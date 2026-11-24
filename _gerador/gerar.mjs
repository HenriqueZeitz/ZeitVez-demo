// Gera todas as páginas HTML estáticas do protótipo e confere o resultado.
// Uso:  node prototipo/_gerador/gerar.mjs
// Atenção: sobrescreve os .html, tema.css, .ics e assets gerados; edite os templates aqui, não o HTML.
// Termina com código ≠ 0 se alguma conferência falhar (links, nome antigo, recurso externo, caminho absoluto, fonte, e-mail e telefone).
// Precisa de npm ci uma vez em _gerador/ (Tailwind) e das fontes em assets/fontes/ (baixar-fontes.mjs).
import { writeFileSync, readFileSync, mkdirSync, existsSync, readdirSync, statSync, unlinkSync, rmdirSync, mkdtempSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { dirname, join, relative, posix } from 'node:path';
import { fileURLToPath } from 'node:url';
import { TENANTS, FONTES, TEMA_ZEITVEZ, TEMA_ZEITVEZ_ESCURO, EMAILS_DO_SEED, TELEFONES_DO_SEED, agendaDoPeriodo } from './dados.mjs';
import { cssTema, cssTemaStudio, D0, hora, dataSlot, dataSlotLonga, diaLongo, formatarTelefone } from './comum.mjs';
import { paginasTenant, telasDoSalao } from './tenant.mjs';
import { paginasPainel, telasDoPainel } from './painel.mjs';
import { paginasStudio } from './studio.mjs';
import { escolhaDeExemplo, proximoHorarioLivre, horariosLivres } from './agendamento.mjs';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const MANIFESTO = '_gerador/gerados.json';
const gerados = new Map(); // caminho (com "/") → conteúdo

function salvar(rel, conteudo) {
  const caminho = join(RAIZ, rel);
  mkdirSync(dirname(caminho), { recursive: true });
  writeFileSync(caminho, conteudo, 'utf8');
  gerados.set(rel, conteudo);
}

// ---------- Pré-requisito: Tailwind (só do gerador; a vitrine pronta não precisa de nada instalado) ----------
const CLI_TAILWIND = join(RAIZ, '_gerador', 'node_modules', 'tailwindcss', 'lib', 'cli.js');
if (!existsSync(CLI_TAILWIND)) {
  console.error('✗ O Tailwind do gerador não está instalado. Rode uma vez:\n    (cd prototipo/_gerador && npm ci)');
  process.exit(1);
}

// ---------- Fontes locais (assets/fontes/, baixadas por baixar-fontes.mjs) ----------
// Uma consulta do Google Fonts ("family=Lato:wght@400;700", "family=Playfair+Display:ital,wght@0,500;1,500") vira
// as combinações família/estilo/peso que o gerador exige ter em arquivo.
function fontesUsadas() {
  const usadas = [];
  for (const f of Object.values(FONTES)) {
    for (const parte of f.google.split('&')) {
      const m = /^family=([^:]+)(?::(.+))?$/.exec(parte);
      const familia = m[1].replace(/\+/g, ' ');
      const [eixos, tuplas] = (m[2] ?? 'wght@400').split('@');
      const nomes = eixos.split(',');
      for (const tupla of tuplas.split(';')) {
        const v = tupla.split(',');
        const ital = nomes.includes('ital') ? v[nomes.indexOf('ital')] === '1' : false;
        usadas.push({ familia, estilo: ital ? 'italic' : 'normal', peso: Number(v[nomes.indexOf('wght')]) });
      }
    }
  }
  return usadas;
}
function cssFontes() {
  const caminho = join(RAIZ, 'assets', 'fontes', 'fontes.json');
  if (!existsSync(caminho)) {
    console.error('✗ Faltam as fontes locais (assets/fontes/). Rode uma vez, com internet:\n    node prototipo/_gerador/baixar-fontes.mjs');
    process.exit(1);
  }
  const lista = JSON.parse(readFileSync(caminho, 'utf8'));
  const faltando = fontesUsadas().filter((u) => !lista.some((e) => e.familia === u.familia && e.estilo === u.estilo && e.peso === u.peso));
  if (faltando.length) {
    console.error(`✗ Fontes usadas que não estão em assets/fontes/: ${faltando.map((u) => `${u.familia} ${u.estilo} ${u.peso}`).join(', ')}.\n  Rode: node prototipo/_gerador/baixar-fontes.mjs`);
    process.exit(1);
  }
  // O mesmo arquivo atende vários pesos (fonte variável): um @font-face só, com a faixa de pesos
  const grupos = new Map();
  for (const e of lista) {
    const k = `${e.familia}|${e.estilo}|${e.arquivo}`;
    const g = grupos.get(k) ?? { ...e, min: e.peso, max: e.peso };
    g.min = Math.min(g.min, e.peso); g.max = Math.max(g.max, e.peso);
    grupos.set(k, g);
  }
  const blocos = [...grupos.values()].map((g) => `@font-face {
  font-family: '${g.familia}';
  font-style: ${g.estilo};
  font-weight: ${g.min === g.max ? g.min : `${g.min} ${g.max}`};
  font-display: swap;
  src: url('fontes/${g.arquivo}') format('woff2');
}`);
  return `/* Gerado por _gerador/gerar.mjs a partir de assets/fontes/fontes.json. Não edite à mão.
   Só o subconjunto latino, em arquivos da própria pasta (licenças em fontes/LICENCAS.md). */
${blocos.join('\n')}
`;
}

// ---------- Geração ----------
salvar('assets/fontes.css', cssFontes());
salvar('assets/zeitvez.css', cssTemaStudio(TEMA_ZEITVEZ, TEMA_ZEITVEZ_ESCURO, 'Tema do próprio ZeitVez (site institucional, admin e telas de estado) — provisório. Segue o tema do sistema; o botão do cabeçalho alterna.'));
for (const [rel, html] of Object.entries(paginasStudio())) salvar(rel, html);

for (const t of TENANTS) {
  salvar(`${t.slug}/tema.css`, cssTema(t.tema, `${t.nome} — ${t.resumoVisual}.`));
  const paginas = { ...paginasTenant(t), ...paginasPainel(t) };
  // Chave começando com "/" = a partir da raiz do protótipo (ex.: assets/exemplo-aurora.ics); senão, dentro da pasta do salão
  for (const [rel, conteudo] of Object.entries(paginas)) salvar(rel.startsWith('/') ? rel.slice(1) : `${t.slug}/${rel}`, conteudo);
}

// Mapa "Telas" (botão flutuante): título, arquivo e rota real de cada tela, agrupados por área e por salão
const telas = [
  ['ZeitVez', [['Site institucional', 'index.html', '/ (raiz)'], ['Entrar', 'entrar.html', '/entrar (raiz)']]],
  ...TENANTS.flatMap((t) => telasDoSalao(t)),
  ...TENANTS.flatMap((t) => telasDoPainel(t)),
  ['Admin do ZeitVez', [['Salões', 'admin/index.html', '/admin'], ['Novo salão', 'admin/novo.html', '/admin/saloes/novo'], ['Salão', 'admin/salao.html', '/admin/saloes/[id]'], ['Configurações', 'admin/configuracoes.html', '/admin/configuracoes']]],
  ['Estados', [['Site temporariamente indisponível', 'estados/suspenso.html', '/site-suspended'], ['Salão não encontrado', 'estados/nao-encontrado.html', '(endereço sem salão)']]],
];
salvar('assets/telas.js', `// Gerado por _gerador/gerar.mjs a partir da lista de páginas. Não edite à mão.\nwindow.ZEITVEZ_TELAS = ${JSON.stringify(telas, null, 1)};\n`);

// ---------- CSS compilado (Tailwind 3.4.16, a mesma versão que a vitrine carregava por CDN) ----------
// Entrada: preflight do Tailwind, o base.css (escrito à mão) e as utilitárias, que varrem os HTML gerados e o app.js
// (lista em assets/tailwind.config.js). A saída, minificada, é o único CSS de estrutura que as páginas carregam.
{
  const pasta = mkdtempSync(join(tmpdir(), 'vitrine-'));
  const entrada = join(pasta, 'entrada.css');
  const saida = join(pasta, 'vitrine.css');
  writeFileSync(entrada, `@tailwind base;\n${readFileSync(join(RAIZ, 'assets', 'base.css'), 'utf8')}\n@tailwind components;\n@tailwind utilities;\n`, 'utf8');
  try {
    execFileSync(process.execPath, [CLI_TAILWIND, '-c', join(RAIZ, 'assets', 'tailwind.config.js'), '-i', entrada, '-o', saida, '--minify'], { cwd: RAIZ, stdio: ['ignore', 'ignore', 'pipe'] });
    salvar('assets/vitrine.css', readFileSync(saida, 'utf8'));
  } catch (e) {
    console.error(`✗ O Tailwind falhou ao compilar assets/vitrine.css:\n${String(e.stderr ?? e.message).split('\n').slice(0, 15).join('\n')}`);
    process.exit(1);
  } finally {
    rmSync(pasta, { recursive: true, force: true });
  }
}

// ---------- Manifesto: remove o que o gerador não produz mais (D8) ----------
function listarAntigos() {
  // Sem manifesto anterior: parte da lista atual de arquivos gerados no disco (HTML, tema.css, CSS do tema e .ics)
  const achados = [];
  const andar = (dir) => {
    for (const nome of readdirSync(dir)) {
      const caminho = join(dir, nome);
      const rel = posix.normalize(relative(RAIZ, caminho).split('\\').join('/'));
      if (statSync(caminho).isDirectory()) {
        if (!['docs', '_gerador', 'node_modules', '.git'].includes(nome)) andar(caminho);
      } else if (/\.html$/.test(nome) || nome === 'tema.css' || /\.ics$/.test(nome) || nome === ['studio', 'one.css'].join('-')) achados.push(rel);
    }
  };
  andar(RAIZ);
  return achados;
}
const caminhoManifesto = join(RAIZ, MANIFESTO);
const anteriores = existsSync(caminhoManifesto) ? JSON.parse(readFileSync(caminhoManifesto, 'utf8')) : listarAntigos();
const atuais = [...gerados.keys()].sort();
const removidos = [];
for (const rel of anteriores) {
  if (gerados.has(rel)) continue;
  const caminho = join(RAIZ, rel);
  if (existsSync(caminho)) { unlinkSync(caminho); removidos.push(rel); }
  // Pastas que ficaram vazias saem junto
  let pasta = dirname(caminho);
  while (pasta !== RAIZ && existsSync(pasta) && readdirSync(pasta).length === 0) { rmdirSync(pasta); pasta = dirname(pasta); }
}
writeFileSync(caminhoManifesto, JSON.stringify(atuais, null, 1) + '\n', 'utf8');

// ---------- Conferências (D8) ----------
const erros = [];
const falha = (msg) => erros.push(msg);
const ARQUIVOS_FIXOS = ['assets/base.css', 'assets/app.js', 'assets/tailwind.config.js', 'README.md'];
const textos = new Map([...gerados]);
for (const rel of ARQUIVOS_FIXOS) if (existsSync(join(RAIZ, rel))) textos.set(rel, readFileSync(join(RAIZ, rel), 'utf8'));
const html = [...gerados].filter(([rel]) => rel.endsWith('.html'));

// (a) todo href/src/data-ir relativo existe (âncora incluída), e o "voltar" também
const ehExterno = (u) => /^(https?:|mailto:|tel:|javascript:|data:|\/\/)/i.test(u);
const existe = (rel) => existsSync(join(RAIZ, rel)) && statSync(join(RAIZ, rel)).isFile();
let totalLinks = 0;
for (const [rel, conteudo] of html) {
  const pasta = posix.dirname(rel);
  for (const m of conteudo.matchAll(/\b(?:href|src|data-ir|action)="([^"]*)"/g)) {
    const bruto = m[1];
    if (!bruto || ehExterno(bruto)) continue;
    totalLinks++;
    const [semAncora, ancora] = bruto.split('#');
    const [caminhoRel, consulta] = semAncora.split('?');
    const alvo = caminhoRel === '' ? rel : posix.normalize(posix.join(pasta, caminhoRel));
    if (!existe(alvo)) { falha(`${rel}: "${bruto}" aponta para ${alvo}, que não existe`); continue; }
    if (ancora && alvo.endsWith('.html')) {
      const destino = textos.get(alvo) ?? readFileSync(join(RAIZ, alvo), 'utf8');
      if (!destino.includes(`id="${ancora}"`) && !destino.includes(`data-aba="${ancora}"`)) falha(`${rel}: "${bruto}" aponta para #${ancora}, que não existe em ${alvo}`);
    }
    const voltar = /[?&]voltar=([^&]+)/.exec(consulta ?? '')?.[1];
    if (voltar && !existe(posix.normalize(posix.join(posix.dirname(alvo), voltar)))) falha(`${rel}: voltar=${voltar} não existe`);
  }
}
// Mapa "Telas": todo arquivo existe e todo HTML gerado de salão/admin/estado está no mapa
const arquivosNoMapa = new Set(telas.flatMap(([, itens]) => itens.map(([, arquivo]) => arquivo)));
for (const arquivo of arquivosNoMapa) if (!existe(arquivo)) falha(`assets/telas.js: ${arquivo} não existe`);
for (const [rel] of html) if (!arquivosNoMapa.has(rel)) falha(`assets/telas.js: ${rel} existe, mas não está no mapa`);

// (b) o nome antigo não aparece em lugar nenhum do protótipo (a nota histórica do PRD fica em docs/, fora desta busca)
const nomeAntigo = new RegExp(['studio ?', 'one|studio-', 'one'].join(''), 'i');
for (const [rel, conteudo] of textos) {
  if (rel.endsWith('.ics')) continue;
  if (nomeAntigo.test(conteudo)) falha(`${rel}: ainda cita o nome antigo`);
}

// (c) nenhum recurso de fora da pasta (D7): nem script, folha de estilo, iframe, imagem, mídia, @import, url() ou fonte.
// Só os <a href> de contato (WhatsApp, Instagram, "Como chegar") saem do protótipo, e só quando alguém clica.
const HOSPEDEIROS_LINK = /^https:\/\/(wa\.me\/|www\.instagram\.com\/|www\.google\.com\/maps\/search\/)/;
const FORA = /^(https?:)?\/\//i;
for (const [rel, conteudo] of html) {
  if (/maps\.google|<video|<audio|<embed|<object|<img\b|<iframe\b/i.test(conteudo)) falha(`${rel}: tem mapa, iframe, imagem ou mídia embutida`);
  for (const m of conteudo.matchAll(/<script[^>]*\bsrc="([^"]+)"/g)) if (FORA.test(m[1])) falha(`${rel}: script externo ${m[1]}`);
  for (const m of conteudo.matchAll(/<link[^>]*\bhref="([^"]+)"/g)) if (FORA.test(m[1])) falha(`${rel}: link externo ${m[1]}`);
  for (const m of conteudo.matchAll(/<a\b[^>]*\bhref="(https?:[^"]+)"/g)) if (!HOSPEDEIROS_LINK.test(m[1])) falha(`${rel}: link para fora ${m[1]}`);
  for (const m of conteudo.matchAll(/url\(\s*['"]?([^'")\s]+)/g)) if (FORA.test(m[1])) falha(`${rel}: url() externa ${m[1]}`);
}
for (const [rel, conteudo] of textos) {
  if (!/\.(css|js)$/.test(rel)) continue;
  for (const m of conteudo.matchAll(/@import\s+(?:url\()?\s*['"]?([^'")\s;]+)/g)) if (FORA.test(m[1])) falha(`${rel}: @import externo ${m[1]}`);
  for (const m of conteudo.matchAll(/url\(\s*['"]?([^'")\s]+)/g)) if (FORA.test(m[1])) falha(`${rel}: url() externa ${m[1]}`);
}

// Caminho absoluto quebra no GitHub Pages (a vitrine roda em .../ZeitVez-demo/): tudo é relativo à pasta
for (const [rel, conteudo] of html) {
  for (const m of conteudo.matchAll(/\b(?:href|src|action|data-ir)="(\/[^"]*)"/g)) falha(`${rel}: caminho absoluto "${m[1]}" (use caminho relativo)`);
}
for (const [rel, conteudo] of textos) {
  if (!rel.endsWith('.css')) continue;
  for (const m of conteudo.matchAll(/url\(\s*['"]?(\/[^'")\s]*)/g)) falha(`${rel}: caminho absoluto "${m[1]}" em url()`);
}

// Todo @font-face aponta para um arquivo que existe
for (const m of (gerados.get('assets/fontes.css') ?? '').matchAll(/url\('([^']+)'\)/g)) {
  if (!existe(posix.join('assets', m[1]))) falha(`assets/fontes.css: ${m[1]} não existe em assets/`);
}

// (d) e-mails e telefones: só os do seed (e os endereços da plataforma, no domínio zeitvez.com.br)
const dominiosDoSeed = new Set([...EMAILS_DO_SEED].map((e) => e.split('@')[1]));
const so = (n) => { const d = n.replace(/\D/g, ''); return d.length === 10 || d.length === 11 ? `55${d}` : d; };
for (const [rel, conteudo] of html) {
  for (const m of conteudo.matchAll(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g)) {
    if (!EMAILS_DO_SEED.has(m[0]) && !dominiosDoSeed.has(m[0].split('@')[1])) falha(`${rel}: e-mail fora do seed ${m[0]}`);
  }
  for (const m of conteudo.matchAll(/\(\d{2}\) ?\d{4,5}-\d{4}|tel:\+?(\d+)|wa\.me\/(\d+)/g)) {
    const n = so(m[1] ?? m[2] ?? m[0]);
    if (!TELEFONES_DO_SEED.has(n)) falha(`${rel}: telefone fora do seed ${m[0]}`);
  }
}

// ---------- Resumo ----------
const nHtml = html.length;
console.log(`${gerados.size} arquivos gerados em ${RAIZ} (${nHtml} HTML)`);
console.log(`D0 = ${diaLongo(D0)} de ${D0.getFullYear()}; "agora" = 14:30 (${dataSlot(D0, 14 * 60 + 30)}; ${dataSlotLonga(D0, 14 * 60 + 30)}; ${formatarTelefone('551130000101')}, ${formatarTelefone('5511900000101')})`);
{
  const au = TENANTS[0], dia = (n) => horariosLivres(au, n.pro, n.dur, n.dia).map(hora).join(' ');
  console.log(`  aurora, Marina na quarta D0+1 (60 min): ${dia({ pro: 'marina', dur: 60, dia: 1 })}`);
  console.log(`  aurora, Bia na quarta D0+8 (45 min): ${dia({ pro: 'bia', dur: 45, dia: 8 }) || 'nenhum horário (férias de D0+7 a D0+11)'}`);
}
for (const t of TENANTS) {
  const { contadores: c } = agendaDoPeriodo(t, [0]);
  console.log(`  ${t.slug}: agenda do dono em D0: ${c.total} agendamentos, ${c.aAtender} a atender, ${c.concluidos} concluídos, ${c.aConferir} a conferir`);
  const ex = escolhaDeExemplo(t), prox = proximoHorarioLivre(t);
  console.log(`  ${t.slug}: exemplo ${ex.pro.nome}, ${ex.servicos.map((s) => s.nome).join(' + ')}, ${dataSlot(ex.data, ex.ini)}; próximo livre ${prox.rotulo} (${prox.nota})`);
}
console.log(`  links conferidos: ${totalLinks}; arquivos no mapa: ${arquivosNoMapa.size}${removidos.length ? `; removidos: ${removidos.length} (${removidos.join(', ')})` : ''}`);
if (erros.length) {
  console.error(`\n✗ ${erros.length} problema(s):`);
  for (const e of erros.slice(0, 40)) console.error(`  - ${e}`);
  if (erros.length > 40) console.error(`  … e mais ${erros.length - 40}`);
  process.exit(1);
}
console.log('✓ conferências: links, nome antigo, recursos externos, caminhos relativos, fontes, e-mails e telefones');
