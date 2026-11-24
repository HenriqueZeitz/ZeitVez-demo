// Baixa as fontes da vitrine para prototipo/assets/fontes/ (só o subconjunto latino, em .woff2).
// Uso (uma vez, ou quando uma família ou peso novo entrar em FONTES):  node prototipo/_gerador/baixar-fontes.mjs
// Precisa de internet só aqui; o gerador e a vitrine não precisam. Os arquivos são commitados.
// Grava assets/fontes/fontes.json (família, estilo, peso e arquivo), que o gerador lê para escrever assets/fontes.css.
import { mkdirSync, writeFileSync, existsSync, readdirSync, unlinkSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FONTES } from './dados.mjs';

const PASTA = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'fontes');
// Um navegador moderno: o Google Fonts só devolve .woff2 (e separado por subconjunto) para quem se apresenta assim.
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';

mkdirSync(PASTA, { recursive: true });

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const consultas = [...new Set(Object.values(FONTES).map((f) => f.google))];
const porUrl = new Map(); // url do woff2 → nome do arquivo local
const entradas = [];

for (const consulta of consultas) {
  const resposta = await fetch(`https://fonts.googleapis.com/css2?${consulta}&display=swap`, { headers: { 'User-Agent': UA } });
  if (!resposta.ok) throw new Error(`Google Fonts respondeu ${resposta.status} para ${consulta}`);
  const css = await resposta.text();
  // Cada bloco vem precedido de um comentário com o subconjunto: /* latin */, /* latin-ext */, /* cyrillic */...
  for (const m of css.matchAll(/\/\*\s*([\w-]+)\s*\*\/\s*@font-face\s*\{([^}]*)\}/g)) {
    if (m[1] !== 'latin') continue;
    const bloco = m[2];
    const familia = /font-family:\s*'([^']+)'/.exec(bloco)[1];
    const estilo = /font-style:\s*(\w+)/.exec(bloco)[1];
    const peso = /font-weight:\s*(\d+)/.exec(bloco)[1];
    const url = /url\((https:[^)]+\.woff2)\)/.exec(bloco)[1];
    if (!porUrl.has(url)) {
      // Fonte variável: o mesmo arquivo atende vários pesos; o nome leva o primeiro que apareceu
      const arquivo = `${slug(familia)}-${estilo}-${peso}.woff2`;
      const binario = await fetch(url, { headers: { 'User-Agent': UA } });
      if (!binario.ok) throw new Error(`Falha ao baixar ${url}: ${binario.status}`);
      writeFileSync(join(PASTA, arquivo), Buffer.from(await binario.arrayBuffer()));
      porUrl.set(url, arquivo);
    }
    entradas.push({ familia, estilo, peso: Number(peso), arquivo: porUrl.get(url) });
  }
}

// Sem duplicatas (a mesma família pode aparecer em mais de um par) e em ordem estável
const vistos = new Set();
const lista = entradas
  .filter((e) => { const k = `${e.familia}|${e.estilo}|${e.peso}`; if (vistos.has(k)) return false; vistos.add(k); return true; })
  .sort((a, b) => a.familia.localeCompare(b.familia) || a.estilo.localeCompare(b.estilo) || a.peso - b.peso);
writeFileSync(join(PASTA, 'fontes.json'), JSON.stringify(lista, null, 1) + '\n', 'utf8');

// Arquivos que não são mais usados saem
const usados = new Set(lista.map((e) => e.arquivo));
for (const nome of readdirSync(PASTA)) if (nome.endsWith('.woff2') && !usados.has(nome)) unlinkSync(join(PASTA, nome));

const familias = [...new Set(lista.map((e) => e.familia))].sort();
const licencas = `# Licenças das fontes

Todas as fontes desta pasta são do Google Fonts e usam a **SIL Open Font License 1.1 (OFL)**, que permite usar, copiar e redistribuir (inclusive com o produto), desde que a licença acompanhe as fontes. O texto completo: https://openfontlicense.org/open-font-license-official-text/

Cada família tem o seu aviso de direitos autorais no repositório do Google Fonts (https://github.com/google/fonts, pasta \`ofl/<família>/\`).

Famílias incluídas (só o subconjunto latino, em .woff2):

${familias.map((f) => `- ${f}`).join('\n')}

Gerado por \`_gerador/baixar-fontes.mjs\`.
`;
writeFileSync(join(PASTA, 'LICENCAS.md'), licencas, 'utf8');

console.log(`${usados.size} arquivos .woff2 em ${PASTA} (${lista.length} combinações família/peso, ${familias.length} famílias)`);
