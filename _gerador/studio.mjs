// Páginas do próprio ZeitVez: site institucional, "Entrar" da raiz, admin e telas de estado.
// Cada tela segue o componente real do web/ (citado no comentário); só os dados vêm do seed.
import { ic, pagina as paginaBase, esc, precoCentavos, SCRIPT_TEMA_STUDIO, D0 } from './comum.mjs';
import { TENANTS, CORTE_FINO, FONTES } from './dados.mjs';
import { cartaoConta, campo, caixa, MANTER } from './tenant.mjs';

// Todas as telas do ZeitVez seguem o tema do sistema e o que foi escolhido no botão do institucional.
const pagina = (opts) => paginaBase({ ...opts, head: SCRIPT_TEMA_STUDIO });

const PULAR = `<a href="#conteudo" class="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-tema focus:bg-fundo focus:px-4 focus:py-2 focus:font-semibold focus:text-texto focus:shadow-lg">Pular para o conteúdo</a>`;

// ---------- Marca (platform-brand.tsx) ----------
const marca = (href, nome = 'ZeitVez') => `<a href="${href}" class="flex items-center gap-2.5">
        <span class="inline-flex h-9 w-9 items-center justify-center rounded-tema bg-primaria text-sobre-primaria">${ic('brilho', 'h-5 w-5')}</span>
        <span class="titulo whitespace-nowrap text-lg">${nome}</span>
      </a>`;

// ---------- Botão de tema (theme-toggle.tsx, lib/platform/color-scheme.ts) ----------
// Traz os dois nomes e os dois ícones; o CSS mostra só os do tema em uso (como o real). O anúncio sai no app.js.
const botaoTema = `<button type="button" class="btn btn-fantasma h-11 w-11 px-0" data-alternar-tema>
          <span class="tema-icone-lua sr-only">Alternar para tema escuro</span>
          <span class="tema-icone-sol sr-only">Alternar para tema claro</span>
          <span class="tema-icone-lua" aria-hidden="true">${ic('lua', 'h-5 w-5')}</span>
          <span class="tema-icone-sol" aria-hidden="true">${ic('sol', 'h-5 w-5')}</span>
        </button>
        <span aria-live="polite" class="sr-only" data-tema-anuncio></span>`;

// ---------- Salões de exemplo (lib/platform/demo.ts, copiado: miniaturas ilustrativas, não dados) ----------
// A forma (caixa, espaçamento, raios) é a que o real tira do estilo da fonte (shapeForFont).
const FORMAS = {
  serifada: { titulo: ['none', 'normal', 600], botao: ['none', 'normal'], raio: '10px', raioBotao: '999px' },
  condensada: { titulo: ['uppercase', '.03em', 600], botao: ['uppercase', '.06em'], raio: '4px', raioBotao: '4px' },
  'sem-serifa': { titulo: ['none', '-0.02em', 800], botao: ['none', 'normal'], raio: '12px', raioBotao: '12px' },
};
const DEMO = [
  {
    slug: 'aurora', nome: 'Studio Aurora', descricao: 'Salão de beleza · Tema claro · tons quentes · serifada', fonte: 'serifada', tagline: 'Cabelo, cor e cuidado — sem pressa.',
    cores: { fundo: '#FBF6F0', superficie: '#FFFFFF', texto: '#2A1F1A', suave: '#6B584D', borda: '#EADFD4', primaria: '#A3502E', sobre: '#FFFFFF', capa1: '#E9C4A8', capa2: '#B7694A' },
    servicos: [['Corte e finalização', 12000], ['Corte curto', 8000]],
  },
  {
    slug: 'navalha', nome: 'Barbearia Navalha', descricao: 'Barbearia · Tema escuro · dourado · condensada', fonte: 'condensada', tagline: 'Corte afiado. Barba alinhada.',
    cores: { fundo: '#0E0E10', superficie: '#17171A', texto: '#F2EEE6', suave: '#A9A39A', borda: '#2C2C31', primaria: '#D6A548', sobre: '#15120C', capa1: '#3A3A40', capa2: '#1C1C20' },
    servicos: [['Corte clássico', 5500], ['Corte + barba', 9500]],
  },
  {
    slug: 'lumi', nome: 'Espaço Lumi', descricao: 'Salão de beleza · Tema claro · paleta fria · sem serifa', fonte: 'sem-serifa', tagline: 'Cuidado leve, para todo mundo.',
    cores: { fundo: '#F2F7F9', superficie: '#FFFFFF', texto: '#0E2430', suave: '#4A6270', borda: '#D3E2E8', primaria: '#0D7285', sobre: '#FFFFFF', capa1: '#A9D8E2', capa2: '#5A9FB3' },
    servicos: [['Corte', 9000], ['Coloração', 21000]],
  },
];

// ---------- Miniatura de um salão (salon-preview.tsx) ----------
// Estilo inline próprio, que não mexe nas variáveis do tema do produto. Decorativa: sem links nem foco.
function miniatura(s, cls = '') {
  const c = s.cores, f = FONTES[s.fonte], forma = FORMAS[s.fonte];
  const [caixaTitulo, espacoTitulo, pesoTitulo] = forma.titulo;
  const titulo = `font-family:${f.titulo};text-transform:${caixaTitulo};letter-spacing:${espacoTitulo};font-weight:${pesoTitulo};line-height:1.1`;
  const botao = `background-color:${c.primaria};color:${c.sobre};border-radius:${forma.raioBotao};text-transform:${forma.botao[0]};letter-spacing:${forma.botao[1]}`;
  return `<div aria-hidden="true" class="mini-salao select-none overflow-hidden rounded-2xl border shadow-lg ${cls}" style="${esc(`border-color:${c.borda};background-color:${c.fundo};color:${c.texto};font-family:${f.corpo}`)}">
        <div class="p-4">
          <div class="flex items-center justify-between gap-2">
            <span class="flex min-w-0 items-center gap-2">
              <span class="inline-flex h-7 w-7 shrink-0 items-center justify-center text-xs" style="${esc(`${titulo};${botao};text-transform:none;letter-spacing:normal`)}">${s.nome[0]}</span>
              <span class="break-words text-sm" style="${esc(titulo)}">${s.nome}</span>
            </span>
            <span class="mini-agendar shrink-0 px-2.5 py-1 text-[11px] font-semibold" style="${esc(botao)}">Agendar</span>
          </div>
          <div class="mt-3 aspect-[16/9]" style="${esc(`border-radius:${forma.raio};background-image:radial-gradient(circle at 75% 20%, rgb(255 255 255 / 0.22), transparent 55%), linear-gradient(135deg, ${c.capa1}, ${c.capa2})`)}"></div>
          <p class="mt-3 text-base" style="${esc(titulo)}">${s.tagline}</p>
          <div class="mt-2 grid grid-cols-2 gap-2 text-[11px]">
            ${s.servicos.map(([nome, cents]) => `<span class="border p-2" style="${esc(`border-color:${c.borda};background-color:${c.superficie};border-radius:${forma.raio}`)}"><span class="block font-semibold">${nome}</span><span style="color:${c.suave}">${precoCentavos(cents)}</span></span>`).join('\n            ')}
          </div>
        </div>
      </div>`;
}

// ---------- Site institucional (platform-site.tsx no ambiente de demonstração, sem contato configurado) ----------
function institucional() {
  const links = [['#beneficios', 'Benefícios'], ['#como-funciona', 'Como funciona'], ['#demonstracao', 'Demonstração'], ['#contato', 'Contato']];
  const beneficios = [
    ['globo', 'Site com a sua cara', 'Cores, fonte, logo e fotos do seu negócio. Nada de página genérica.'],
    ['calendario', 'Agenda aberta 24h', 'O cliente escolhe serviço, profissional e horário — sem trocar 20 mensagens.'],
    ['celular', 'Feito para o celular', 'Funciona bem no celular do cliente e no seu, sem instalar nada.'],
    ['usuarios', 'Equipe organizada', 'Cada profissional com seus serviços, dias e horários.'],
    ['pincel', 'Você muda sozinho', 'Preços, fotos e horários atualizados pelo painel, quando quiser.'],
    ['loja', 'Seu endereço', 'seunegocio.zeitvez.com ou o seu próprio domínio .com.br.'],
  ];
  const passos = [
    ['Conversa rápida', 'Entendemos seus serviços, equipe e horários.'],
    ['Montamos seu site', 'Com sua identidade visual. Você revisa e ajusta no painel.'],
    ['Divulgue o link', 'Coloque no Instagram e no WhatsApp e receba agendamentos.'],
  ];
  const corpo = `
${PULAR}
<header class="sticky top-0 z-40 border-b border-borda bg-fundo">
  <div class="relative mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
    ${marca('index.html')}
    <nav class="hidden items-center gap-6 text-sm font-semibold lg:flex" aria-label="Principal">
      ${links.map(([h, n]) => `<a href="${h}" class="text-suave hover:text-texto">${n}</a>`).join('\n      ')}
    </nav>
    <div class="flex shrink-0 items-center gap-2">
      ${botaoTema}
      <div class="lg:hidden">
        <button type="button" class="btn btn-fantasma h-11 w-11 px-0" data-menu-botao aria-controls="menu-mobile" aria-expanded="false" aria-label="Abrir menu">${ic('menu', 'h-6 w-6')}</button>
      </div>
    </div>
    <nav id="menu-mobile" hidden aria-label="Menu" class="absolute inset-x-0 top-full border-b border-borda bg-fundo px-4 pb-4 pt-2 shadow-sm lg:hidden">
      <ul>
        ${links.map(([h, n]) => `<li><a href="${h}" class="block rounded-tema px-2 py-3 font-semibold hover:bg-superficie-2">${n}</a></li>`).join('\n        ')}
      </ul>
    </nav>
  </div>
</header>

<main id="conteudo" tabindex="-1" class="outline-none">
  <section class="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-2 lg:pt-20">
    <div>
      <p class="rotulo">Para salões e barbearias</p>
      <h1 class="titulo mt-3 text-4xl sm:text-5xl lg:text-6xl">Site próprio e agenda online para o seu negócio.</h1>
      <p class="mt-5 max-w-xl text-lg text-suave">Seus clientes agendam sozinhos, a qualquer hora, num site com a cara do seu salão ou barbearia. Você acompanha tudo num painel simples.</p>
      <div class="mt-8 flex flex-col gap-3 sm:flex-row">
        <a href="#demonstracao" class="btn btn-primario">Ver demonstração</a>
      </div>
      <ul class="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-suave">
        ${['Sem instalar aplicativo', 'Pronto em poucos dias'].map((b) => `<li class="flex items-center gap-2"><span class="text-primaria">${ic('check', 'h-4 w-4')}</span> ${b}</li>`).join('\n        ')}
      </ul>
    </div>
    <div class="mx-auto w-full max-w-md lg:max-w-none">
      <div class="grid grid-cols-6 items-start gap-3">
        ${miniatura(DEMO[0], 'col-span-4')}
        ${miniatura(DEMO[1], 'col-span-4 col-start-3 -mt-24 sm:-mt-32')}
      </div>
    </div>
  </section>

  <section id="beneficios" aria-labelledby="beneficios-titulo" class="scroll-mt-20 border-y border-borda bg-superficie">
    <div class="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p class="rotulo">Benefícios</p>
      <h2 id="beneficios-titulo" class="titulo mt-2 text-3xl sm:text-4xl">Menos mensagem, mais cadeira ocupada</h2>
      <ul class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        ${beneficios.map(([i, a, b]) => `<li>
          <span class="flex h-11 w-11 items-center justify-center rounded-tema bg-primaria-suave text-primaria">${ic(i)}</span>
          <h3 class="mt-4 text-lg font-bold">${a}</h3>
          <p class="mt-1 text-suave">${b}</p>
        </li>`).join('\n        ')}
      </ul>
    </div>
  </section>

  <section id="como-funciona" aria-labelledby="como-funciona-titulo" class="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6">
    <p class="rotulo">Como funciona</p>
    <h2 id="como-funciona-titulo" class="titulo mt-2 text-3xl sm:text-4xl">Três passos até o primeiro agendamento</h2>
    <ol class="mt-10 grid gap-4 md:grid-cols-3">
      ${passos.map(([a, b], i) => `<li class="cartao p-6">
        <span aria-hidden="true" class="titulo text-4xl text-primaria">${i + 1}</span>
        <h3 class="mt-3 text-lg font-bold">${a}</h3>
        <p class="mt-1 text-suave">${b}</p>
      </li>`).join('\n      ')}
    </ol>
  </section>

  <section id="demonstracao" aria-labelledby="demonstracao-titulo" class="scroll-mt-20 border-y border-borda bg-superficie-2">
    <div class="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p class="rotulo">Demonstração</p>
      <h2 id="demonstracao-titulo" class="titulo mt-2 text-3xl sm:text-4xl">Mesmo sistema, identidades diferentes</h2>
      <p class="mt-2 max-w-2xl text-suave">Três negócios fictícios usando exatamente o mesmo layout. Só mudam cores, fontes e conteúdo.</p>
      <ul class="mt-10 grid gap-6 md:grid-cols-3">
        ${DEMO.map((s) => `<li class="flex flex-col">
          ${miniatura(s)}
          <div class="mt-4 flex-1">
            <h3 class="text-lg font-bold">${s.nome}</h3>
            <p class="text-sm text-suave">${s.descricao}</p>
          </div>
          <a href="${s.slug}/index.html" class="btn btn-primario btn-sm mt-4 w-full">Ver site<span class="sr-only">: ${s.nome}</span></a>
        </li>`).join('\n        ')}
      </ul>
    </div>
  </section>

  <section id="contato" aria-labelledby="contato-titulo" class="mx-auto w-full max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6">
    <div class="cartao grid gap-8 p-6 sm:p-10 lg:grid-cols-2 lg:items-center">
      <div>
        <p class="rotulo">Contato</p>
        <h2 id="contato-titulo" class="titulo mt-2 text-3xl sm:text-4xl">Quer ver com o seu negócio?</h2>
        <p class="mt-3 text-suave">Mande uma mensagem com o nome do seu salão ou barbearia. A gente mostra como ficaria e conta os valores.</p>
      </div>
      <div class="flex flex-col gap-3">
        <p class="text-center text-sm text-suave">Preço sob consulta.</p>
      </div>
    </div>
  </section>
</main>

<footer class="border-t border-borda">
  <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 py-8 text-sm text-suave sm:px-6">
    <span>© ${D0.getFullYear()} ZeitVez</span>
    <a href="entrar.html" rel="nofollow" class="inline-flex min-h-11 items-center text-xs underline-offset-4 hover:text-texto hover:underline">Acesso restrito</a>
  </div>
</footer>`;
  return pagina({ titulo: 'ZeitVez · Site e agenda online para salões e barbearias', raiz: '', tema: 'assets/zeitvez.css', corpo, descricao: 'Site próprio e agendamento online para salões de beleza e barbearias.' });
}

// ---------- "Entrar" na raiz (app/entrar/page.tsx fora de um salão: só a equipe do ZeitVez) ----------
function entrarRaiz() {
  const corpo = `
${PULAR}
<header class="border-b border-borda bg-fundo">
  <div class="mx-auto flex max-w-6xl items-center px-4 py-3 sm:px-6">
    ${marca('index.html')}
  </div>
</header>
<main id="conteudo" tabindex="-1" class="outline-none">
${cartaoConta(null, {
    titulo: 'Entrar',
    subtitulo: 'Acesso da equipe do ZeitVez.',
    depois: `<p class="mt-6 text-center text-sm"><a href="index.html" class="text-suave underline-offset-4 hover:text-texto hover:underline">Voltar para o site</a></p>`,
    conteudo: `<form class="space-y-5" action="admin/index.html" data-ir="admin/index.html" novalidate>
      ${campo({ id: 'login-email', rotulo: 'E-mail', tipo: 'email', auto: 'username', placeholder: 'voce@email.com' })}
      ${campo({ id: 'login-senha', rotulo: 'Senha', tipo: 'password', auto: 'current-password', acao: `<a href="#" class="link font-semibold" style="text-decoration: none" data-toast="Demonstração: a recuperação de senha não faz parte desta vitrine.">Esqueci minha senha</a>` })}
      ${caixa('manter', 'Manter conectado neste aparelho', MANTER)}
      <button class="btn btn-primario btn-bloco" type="submit">Entrar</button>
    </form>`,
  })}
</main>`;
  return pagina({ titulo: 'Entrar · ZeitVez', raiz: '', tema: 'assets/zeitvez.css', corpo });
}

// ---------- Admin (admin-shell.tsx e as páginas de app/admin/) ----------
// Dados: docs/seeds/01-plataforma.md (salões, endereços e prazo) e 03-contas-e-pessoas.md (dono). A lista segue a ordem
// da API (por nome). Todo salão da lista abre a tela do Studio Aurora (mesma regra dos exemplos fixos do painel).
const MESES_CANCELAR = 6; // platform_settings
const SALOES = [
  { slug: 'navalha', nome: 'Barbearia Navalha', tipo: 'Barbearia', status: 'ativo', criado: '19/01/2026' },
  { slug: 'cortefino', nome: 'Corte Fino Barbearia', tipo: 'Barbearia', status: 'suspenso', criado: '16/02/2026' },
  { slug: 'lumi', nome: 'Espaço Lumi', tipo: 'Salão', status: 'ativo', criado: '02/02/2026' },
  { slug: 'tesoura', nome: 'Salão Tesoura de Ouro', tipo: 'Salão', status: 'cancelado', criado: '05/01/2026' },
  { slug: 'aurora', nome: 'Studio Aurora', tipo: 'Salão', status: 'ativo', criado: '12/01/2026' },
];
const SELOS = {
  ativo: ['Ativo', 'bg-[#DCFCE7] text-[#14532D]'],
  suspenso: ['Suspenso', 'bg-[#FEF3C7] text-[#78350F]'],
  cancelado: ['Cancelado', 'bg-superficie-2 text-texto'],
};
const selo = (st) => `<span class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${SELOS[st][1]}">${SELOS[st][0]}</span>`;
const LINK_ADMIN = 'inline-flex min-h-11 items-center text-sm font-semibold text-primaria underline-offset-4 hover:underline';

function adminLayout(titulo, conteudo) {
  const corpo = `
${PULAR}
<header class="border-b border-borda bg-fundo">
  <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
    <div class="flex items-center gap-6">
      ${marca('index.html', 'ZeitVez Admin')}
      <nav aria-label="Painel" class="flex items-center gap-4">
        <a href="index.html" class="${LINK_ADMIN}">Salões</a>
        <a href="configuracoes.html" class="${LINK_ADMIN}">Configurações</a>
      </nav>
    </div>
    <a href="../index.html" class="btn btn-secundario gap-2 px-4">${ic('sair', 'h-4 w-4')} Sair</a>
  </div>
</header>
<main id="conteudo" tabindex="-1" class="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 outline-none sm:px-6 sm:pt-10">
${conteudo}
</main>`;
  return pagina({ titulo: `${titulo} · ZeitVez Admin`, raiz: '../', tema: '../assets/zeitvez.css', corpo });
}

// "Salões" (app/admin/page.tsx): busca e filtro rodam no app.js, escondendo linhas e recontando.
function adminSaloes() {
  const filtros = [['todos', 'Todos'], ['ativo', 'Ativos'], ['suspenso', 'Suspensos'], ['cancelado', 'Cancelados']];
  const dados = (s) => `data-salao data-status="${s.status}" data-busca="${esc(`${s.nome} ${s.slug}.localhost`.toLowerCase())}"`;
  const conteudo = `
<div data-lista-saloes>
  <div class="flex flex-wrap items-center justify-between gap-3">
    <h1 class="titulo text-3xl sm:text-4xl">Salões</h1>
    <a href="novo.html" class="btn btn-primario gap-2 px-5">${ic('mais', 'h-5 w-5')} Novo salão</a>
  </div>

  <div class="mt-6 space-y-4">
    <form role="search" class="flex flex-wrap items-end gap-3" data-busca-form novalidate>
      <div class="min-w-0 flex-1 basis-64 space-y-1.5">
        <label for="busca" class="campo-rotulo !mb-0">Buscar por nome ou endereço</label>
        <input id="busca" name="q" type="search" maxlength="80" class="campo" data-busca-campo>
      </div>
      <button type="submit" class="btn btn-secundario gap-2 px-5">${ic('busca', 'h-5 w-5')} Buscar</button>
    </form>
    <nav aria-label="Filtrar por status">
      <ul class="flex flex-wrap gap-2">
        ${filtros.map(([v, n], i) => `<li><a href="#" data-filtro-status="${v}"${i === 0 ? ' aria-current="true"' : ''} class="inline-flex h-11 items-center rounded-full border px-4 text-sm font-semibold ${i === 0 ? 'border-primaria bg-primaria text-sobre-primaria' : 'border-borda bg-superficie hover:bg-superficie-2'}">${n}</a></li>`).join('\n        ')}
      </ul>
    </nav>
  </div>

  <p class="mt-6 text-sm text-suave" role="status" data-contagem data-total="${SALOES.length}">${SALOES.length} salões</p>

  <div class="mt-4 hidden overflow-hidden rounded-xl border border-borda md:block" data-tabela>
    <table class="w-full text-left text-sm">
      <caption class="sr-only">Salões cadastrados</caption>
      <thead class="bg-superficie-2 text-suave">
        <tr>
          <th scope="col" class="px-4 py-3 font-semibold">Salão</th>
          <th scope="col" class="px-4 py-3 font-semibold">Endereço</th>
          <th scope="col" class="px-4 py-3 font-semibold">Status</th>
          <th scope="col" class="px-4 py-3 font-semibold">Criado em</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-borda bg-superficie">
        ${SALOES.map((s) => `<tr ${dados(s)}>
          <td class="px-4 py-3">
            <a href="salao.html" class="font-semibold text-primaria underline-offset-4 hover:underline">${s.nome}</a>
            <div class="text-suave">${s.tipo}</div>
          </td>
          <td class="break-all px-4 py-3">${s.slug}.localhost</td>
          <td class="px-4 py-3">${selo(s.status)}</td>
          <td class="px-4 py-3">${s.criado}</td>
        </tr>`).join('\n        ')}
      </tbody>
    </table>
  </div>

  <ul class="mt-4 space-y-3 md:hidden" data-cartoes>
    ${SALOES.map((s) => `<li ${dados(s)} class="rounded-xl border border-borda bg-superficie p-4">
      <div class="flex items-start justify-between gap-3">
        <a href="salao.html" class="font-semibold text-primaria underline-offset-4 hover:underline">${s.nome}</a>
        ${selo(s.status)}
      </div>
      <p class="mt-1 text-sm text-suave">${s.tipo}</p>
      <dl class="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
        <dt class="text-suave">Endereço</dt>
        <dd class="break-all">${s.slug}.localhost</dd>
        <dt class="text-suave">Criado em</dt>
        <dd>${s.criado}</dd>
      </dl>
    </li>`).join('\n    ')}
  </ul>

  <div class="mt-4 rounded-xl border border-dashed border-borda p-6 text-center" data-vazio hidden>
    <p class="font-semibold">Nenhum salão corresponde à busca.</p>
    <a href="#" data-limpar-filtros class="${LINK_ADMIN} mt-4 justify-center">Limpar filtros</a>
  </div>
</div>`;
  return adminLayout('Salões', conteudo);
}

// Caixas de confirmação (status-action-dialog.tsx e remove-domain-dialog.tsx)
const dialogo = ({ id, titulo, texto, extra = '', voltar = 'Voltar', confirmar, perigo = false, desativado = false }) => `<dialog id="${id}" class="dialogo" aria-labelledby="${id}-titulo">
  <div class="grid gap-4 p-6">
    <h2 id="${id}-titulo" class="titulo text-xl">${titulo}</h2>
    <p class="text-sm text-suave">${texto}</p>
    ${extra}
    <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
      <button type="button" class="btn btn-secundario" data-fechar-dialogo>${voltar}</button>
      <button type="button" class="btn btn-primario"${perigo ? ' style="background: var(--cor-erro-texto); color: var(--cor-fundo)"' : ''} data-confirmar-admin${desativado ? ' disabled data-requer-confirmacao' : ''}>${confirmar}</button>
    </div>
  </div>
</dialog>`;

const secaoAdmin = (titulo, descricao, html) => `<section class="rounded-xl border border-borda bg-superficie p-5 sm:p-6">
      <h2 class="titulo text-xl">${titulo}</h2>
      ${descricao ? `<p class="mt-1 text-sm text-suave">${descricao}</p>` : ''}
      <div class="mt-5">${html}</div>
    </section>`;

const voltarAosSaloes = `<a href="index.html" class="${LINK_ADMIN}">← Voltar para os salões</a>`;
const BOTAO_SECUNDARIO = 'btn btn-secundario h-11 px-4';

// Opções "uma entre poucas" (choice-field.tsx): radios nativos, cada opção é um cartão clicável
const escolha = ({ nome, legenda, opcoes, marcada, colunas = 2 }) => `<fieldset role="radiogroup" class="space-y-2 rounded-tema">
          <legend class="text-sm font-semibold">${legenda}</legend>
          <div class="grid gap-3 ${colunas === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}">
            ${opcoes.map((o) => `<div class="relative">
              <input id="${nome}-${o.valor}" type="radio" name="${nome}" value="${o.valor}" class="peer sr-only"${o.valor === marcada ? ' checked' : ''}>
              <label for="${nome}-${o.valor}" class="flex h-full cursor-pointer flex-col gap-2 rounded-xl border border-borda bg-superficie p-3 text-sm peer-checked:border-primaria peer-checked:ring-2 peer-checked:ring-primaria peer-focus-visible:ring-2 peer-focus-visible:ring-primaria">
                ${o.previa ?? ''}<span class="font-semibold">${o.rotulo}</span>${o.descricao ? `<span class="text-suave">${o.descricao}</span>` : ''}
              </label>
            </div>`).join('\n            ')}
          </div>
        </fieldset>`;
const TIPOS = [{ valor: 'Salon', rotulo: 'Salão' }, { valor: 'Barbershop', rotulo: 'Barbearia' }];

// "Novo salão" (saloes/novo/page.tsx e new-tenant-form.tsx)
function adminNovo() {
  const temas = [
    { valor: 'WarmLight', rotulo: 'Claro quente', descricao: 'Fundo claro, tons de terra e fonte serifada.', demo: DEMO[0] },
    { valor: 'Dark', rotulo: 'Escuro', descricao: 'Fundo escuro, dourado e fonte condensada.', demo: DEMO[1] },
    { valor: 'CoolLight', rotulo: 'Claro frio', descricao: 'Fundo claro, azul-petróleo e fonte sem serifa.', demo: DEMO[2] },
  ].map((t) => ({
    ...t,
    previa: `<span aria-hidden="true" class="flex h-14 flex-col justify-center gap-1.5 rounded-lg border border-black/10 px-3" style="background-color:${t.demo.cores.fundo}"><span class="block h-2 w-3/4 rounded-full" style="background-color:${t.demo.cores.texto}"></span><span class="block h-2 w-1/3 rounded-full" style="background-color:${t.demo.cores.primaria}"></span></span>`,
  }));
  const conteudo = `
<div class="mx-auto max-w-2xl">
  ${voltarAosSaloes}
  <h1 class="titulo mt-3 text-3xl sm:text-4xl">Novo salão</h1>
  <p class="mt-1 text-suave">Cria o site do salão e a conta do dono em um passo só.</p>
  <div class="mt-8 rounded-xl border border-borda bg-superficie p-5 sm:p-7">
    <form class="space-y-6" action="salao.html" data-ir="salao.html?criado=1" novalidate>
      <section aria-labelledby="dados-salao" class="space-y-5">
        <h2 id="dados-salao" class="titulo text-xl">Dados do salão</h2>
        ${campo({ id: 'nome', rotulo: 'Nome do salão', auto: 'off' })}
        ${escolha({ nome: 'businessType', legenda: 'Tipo', opcoes: TIPOS, marcada: 'Salon' })}
        <div class="space-y-1.5">
          <label for="subdominio" class="campo-rotulo !mb-0">Subdomínio</label>
          <div class="flex items-center gap-2">
            <input id="subdominio" name="subdomain" type="text" autocomplete="off" autocapitalize="none" spellcheck="false" class="campo min-w-0 flex-1" aria-describedby="subdominio-previa" data-subdominio data-base="localhost">
            <span aria-hidden="true" class="text-base text-suave">.localhost</span>
          </div>
          <p id="subdominio-previa" class="text-sm text-suave" data-subdominio-previa>Endereço do site: digite o subdomínio (letras minúsculas, números e hífen).</p>
        </div>
        ${escolha({ nome: 'theme', legenda: 'Tema inicial do site', opcoes: temas, marcada: 'WarmLight', colunas: 3 })}
      </section>

      <section aria-labelledby="dados-dono" class="space-y-5">
        <h2 id="dados-dono" class="titulo text-xl">Dono do salão</h2>
        ${campo({ id: 'dono-nome', rotulo: 'Nome do dono', auto: 'off' })}
        ${campo({ id: 'dono-email', rotulo: 'E-mail do dono', tipo: 'email', auto: 'off', dica: 'É nele que o dono recebe o link para definir a senha.' })}
      </section>

      <section aria-labelledby="o-que-acontece" class="rounded-xl bg-superficie-2 p-4 text-sm">
        <h2 id="o-que-acontece" class="font-semibold">O que acontece ao criar</h2>
        <ul class="mt-2 list-disc space-y-1 pl-5 text-suave">
          <li>O site do salão entra no ar no endereço acima, com textos padrão e o tema escolhido.</li>
          <li>Os horários começam fechados e o catálogo, vazio: o dono preenche depois.</li>
          <li>O dono recebe um e-mail “Defina sua senha” (o link vale por 72 horas).</li>
          <li>Se algo falhar, nada é criado e nenhum e-mail é enviado.</li>
        </ul>
      </section>

      <button type="submit" class="btn btn-primario">Criar salão</button>
    </form>
  </div>
</div>`;
  return adminLayout('Novo salão', conteudo);
}

// "Salão" (saloes/[id]/page.tsx): o Studio Aurora fixo, com o caso ativo e dois endereços (domains-section.tsx)
function adminSalao() {
  const dono = { nome: 'Marina Costa', email: 'marina@studioaurora.com.br' };
  const enderecos = [
    { host: 'aurora.localhost', principal: true },
    { host: 'agenda.studioaurora.com.br', principal: false, proprio: true },
  ];
  const conteudo = `
<div class="mx-auto max-w-3xl">
  ${voltarAosSaloes}
  <div class="mt-3 flex flex-wrap items-center gap-3">
    <h1 class="titulo text-3xl sm:text-4xl">Studio Aurora</h1>
    ${selo('ativo')}
  </div>
  <p role="status" class="mt-4 rounded-lg border border-borda bg-superficie-2 p-3 text-sm" data-aviso-criado hidden>Salão criado. Enviamos o e-mail “Defina sua senha” para <strong class="break-all">${dono.email}</strong>; o link vale por 72 horas. Se ele não chegar, use “Reenviar e-mail de acesso” abaixo.</p>

  <div class="mt-8 space-y-6">
    ${secaoAdmin('Dados do salão', '', `<dl class="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
        <dt class="text-suave">Tipo</dt>
        <dd>Salão</dd>
        <dt class="text-suave">Endereço principal</dt>
        <dd class="break-all">aurora.localhost <a href="../aurora/index.html" class="${LINK_ADMIN} ml-2 gap-1">Abrir site${ic('externo', 'h-3.5 w-3.5')}</a></dd>
        <dt class="text-suave">Status</dt>
        <dd>${selo('ativo')} <span class="text-suave">desde 12/01/2026 00:00</span></dd>
        <dt class="text-suave">Criado em</dt>
        <dd>12/01/2026</dd>
      </dl>`)}

    ${secaoAdmin('Dono do salão', '', `<dl class="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
        <dt class="text-suave">Nome</dt>
        <dd>${dono.nome}</dd>
        <dt class="text-suave">E-mail</dt>
        <dd class="break-all">${dono.email}</dd>
        <dt class="text-suave">Acesso</dt>
        <dd>Senha definida</dd>
      </dl>`)}

    ${secaoAdmin('Endereços', 'O endereço principal abre o site do salão. Os demais levam o visitante para o principal, no mesmo caminho.', `<div class="space-y-6">
        <ul class="divide-y divide-borda rounded-lg border border-borda">
          ${enderecos.map((e) => `<li class="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 p-4">
            <div class="min-w-0 space-y-1.5">
              <p class="break-all font-semibold">${e.host}</p>
              <p class="flex flex-wrap items-center gap-2 text-sm">
                <span class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${e.principal ? 'bg-[#DCFCE7] text-[#14532D]' : 'bg-superficie-2 text-texto'}">${e.principal ? 'Principal' : 'Redireciona para o principal'}</span>
                ${e.proprio ? '<span class="text-suave">Domínio próprio</span>' : ''}
              </p>
            </div>
            ${e.principal ? '' : `<div class="flex flex-wrap items-start gap-2">
              <button type="button" class="${BOTAO_SECUNDARIO}" data-toast="Demonstração: nada foi enviado." aria-label="Tornar ${e.host} o endereço principal">Tornar principal</button>
              <button type="button" class="${BOTAO_SECUNDARIO}" data-abrir-dialogo="dlg-remover" aria-label="Remover o endereço ${e.host}">Remover</button>
            </div>`}
          </li>`).join('\n          ')}
        </ul>
        <div>
          <h3 class="text-sm font-semibold">Adicionar endereço</h3>
          <form class="mt-3 space-y-4" data-ir-aviso novalidate>
            <div class="space-y-1.5">
              <label for="novo-subdominio" class="campo-rotulo !mb-0">Subdomínio</label>
              <div class="flex items-center gap-2">
                <input id="novo-subdominio" name="subdomain" type="text" autocomplete="off" autocapitalize="none" spellcheck="false" class="campo min-w-0 flex-1" aria-describedby="novo-subdominio-previa novo-subdominio-ajuda" data-subdominio data-base="localhost">
                <span aria-hidden="true" class="text-base text-suave">.localhost</span>
              </div>
              <p id="novo-subdominio-previa" class="text-sm text-suave" data-subdominio-previa>Endereço do site: digite o subdomínio (letras minúsculas, números e hífen).</p>
              <p id="novo-subdominio-ajuda" class="text-sm text-suave">O novo endereço leva ao endereço principal até você torná-lo o principal.</p>
            </div>
            <button type="submit" class="btn btn-primario">Adicionar endereço</button>
          </form>
        </div>
      </div>`)}

    ${secaoAdmin('Editar', '', `<form class="space-y-5" data-ir-aviso novalidate>
        ${campo({ id: 'editar-nome', rotulo: 'Nome do salão', auto: 'off', valor: 'Studio Aurora' })}
        ${escolha({ nome: 'editar-tipo', legenda: 'Tipo', opcoes: TIPOS, marcada: 'Salon' })}
        <button type="submit" class="btn btn-primario">Salvar alterações</button>
      </form>`)}

    ${secaoAdmin('Status do site', 'Suspender tira o site do ar até a mensalidade ser regularizada. Cancelar encerra o salão de vez.', `<div class="flex flex-wrap gap-3">
        <button type="button" class="${BOTAO_SECUNDARIO} px-5" data-abrir-dialogo="dlg-suspender">Suspender</button>
        <button type="button" class="btn btn-perigo h-11 px-5" data-abrir-dialogo="dlg-cancelar-salao">Cancelar salão</button>
      </div>`)}
  </div>
</div>

${dialogo({
    id: 'dlg-suspender', titulo: 'Suspender Studio Aurora?', confirmar: 'Suspender salão',
    texto: 'O site do salão em <strong class="break-all text-texto">aurora.localhost</strong> passa a mostrar “Site temporariamente indisponível” para os clientes, em qualquer página. Os dados ficam guardados e você pode reativar quando quiser.',
  })}
${dialogo({
    id: 'dlg-cancelar-salao', titulo: 'Cancelar Studio Aurora?', confirmar: 'Cancelar salão para sempre', perigo: true, desativado: true,
    texto: '<strong style="color: var(--cor-erro-texto)">Esta ação não pode ser desfeita.</strong> O endereço <strong class="break-all text-texto">aurora.localhost</strong> passa a mostrar “Salão não encontrado”, e o salão não poderá mais ser editado, suspenso nem reativado.',
    extra: `<div class="space-y-1.5">
      <label for="confirmar-subdominio" class="campo-rotulo !mb-0">Para confirmar, digite o subdomínio: <strong class="break-all">aurora</strong></label>
      <input id="confirmar-subdominio" name="confirm" class="campo" autocomplete="off" autocapitalize="none" spellcheck="false" data-confirma-subdominio="aurora">
    </div>`,
  })}
${dialogo({
    id: 'dlg-remover', titulo: 'Remover este endereço?', confirmar: 'Remover endereço', perigo: true,
    texto: 'O endereço <strong class="break-all text-texto">agenda.studioaurora.com.br</strong> deixa de levar ao salão e mostra “Salão não encontrado”. Links já divulgados nele param de funcionar.',
  })}`;
  return adminLayout('Salão', conteudo);
}

// "Configurações" (configuracoes/page.tsx e settings-form.tsx)
function adminConfiguracoes() {
  const conteudo = `
<div class="mx-auto max-w-2xl">
  ${voltarAosSaloes}
  <h1 class="titulo mt-3 text-3xl sm:text-4xl">Configurações</h1>
  <p class="mt-1 text-suave">Regras que valem para todos os salões.</p>
  <div class="mt-8 rounded-xl border border-borda bg-superficie p-5 sm:p-7">
    <form class="space-y-5" action="configuracoes.html" data-ir-aviso novalidate>
      <div class="space-y-1.5">
        <label for="meses" class="campo-rotulo !mb-0">Meses suspenso até cancelar</label>
        <input id="meses" name="monthsUntilCancellation" type="text" inputmode="numeric" autocomplete="off" value="${MESES_CANCELAR}" class="campo" aria-describedby="meses-ajuda">
        <p id="meses-ajuda" class="text-sm text-suave">De 1 a 24 meses. Todo dia o sistema cancela os salões suspensos há mais tempo que este prazo (a contagem começa quando o salão foi suspenso). Se você diminuir o prazo, os salões que já passaram dele serão cancelados na próxima execução.</p>
      </div>
      <button type="submit" class="btn btn-primario">Salvar configurações</button>
    </form>
  </div>
</div>`;
  return adminLayout('Configurações', conteudo);
}

// ---------- Estados (site-message.tsx, site-suspended/page.tsx e not-found.tsx do produto real) ----------
// Mensagem centralizada de página inteira, no tema padrão da plataforma (o salão não tem tema aqui).
function estado({ titulo, h1, texto }) {
  const corpo = `
<main class="flex min-h-screen flex-col items-center justify-center gap-2 p-4 text-center">
  <h1 class="titulo text-3xl">${h1}</h1>
  <p class="max-w-md text-suave">${texto}</p>
</main>`;
  return pagina({ titulo, raiz: '../', tema: '../assets/zeitvez.css', corpo });
}

const suspenso = () => estado({
  titulo: `Site temporariamente indisponível · ${CORTE_FINO.nome}`,
  h1: 'Site temporariamente indisponível',
  texto: `O site de <strong class="text-texto">${CORTE_FINO.nome}</strong> não está recebendo agendamentos no momento. Se você tem um horário marcado, fale direto com o estabelecimento.`,
});

const naoEncontrado = () => estado({
  titulo: 'Salão não encontrado',
  h1: 'Salão não encontrado',
  texto: 'Nenhum salão ou barbearia usa este endereço. Confira se o link foi digitado corretamente ou peça o endereço certo ao estabelecimento.',
});

export function paginasStudio() {
  return {
    'index.html': institucional(),
    'entrar.html': entrarRaiz(),
    'admin/index.html': adminSaloes(),
    'admin/novo.html': adminNovo(),
    'admin/salao.html': adminSalao(),
    'admin/configuracoes.html': adminConfiguracoes(),
    'estados/suspenso.html': suspenso(),
    'estados/nao-encontrado.html': naoEncontrado(),
  };
}
