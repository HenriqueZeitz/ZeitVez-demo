// Site do salão/barbearia + fluxo de agendamento do cliente + telas de conta.
// Cada tela tem a mesma estrutura e os mesmos textos da tela correspondente do produto real (web/src); a coluna
// "componente real" dos comentários diz de onde cada texto foi copiado (design.md, D1).
import {
  ic, pagina, avatar, duracao, hora, somaDias, brl, esc, maiuscula, HOJE, D0, AGORA_MIN,
  diaCurto, diaLongo, dataSlot, dataSlotLonga, prazoTexto, precoCentavos, formatarTelefone,
} from './comum.mjs';
import { horariosLivres, proximoHorarioLivre, escolhaDeExemplo, diasComHorarios } from './agendamento.mjs';

const R = '../';
const AGENDAR = 'agendar-profissional.html';
const INICIO = 'index.html';
const ICS_AVISO = 'Demonstração: nada foi enviado.';

const digitos = (s) => s.replace(/\D/g, '');
const totais = (itens) => ({ dur: itens.reduce((n, x) => n + x.dur, 0), cents: itens.reduce((n, x) => n + x.cents, 0), aPartir: itens.some((x) => x.aPartir) });
const precoTotal = (tot) => precoCentavos(tot.cents, tot.aPartir);
const nomes = (itens) => itens.map((x) => x.nome).join(' + ');
const dataDe = (dia) => somaDias(D0, dia);
const urlWhatsapp = (t, texto) => `https://wa.me/${t.waLink}${texto ? `?text=${encodeURIComponent(texto)}` : ''}`;
const urlMapa = (t) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(enderecoTexto(t))}`;
// "Rua X, 120 — Bairro, São Paulo - SP" (addressText do produto real)
const enderecoTexto = (t) => `${t.endereco}, ${t.cidadeNome} - ${t.uf}`;
const bairroCidade = (t) => `${t.endereco.split(' — ')[1]}, ${t.cidadeNome}`;
const externo = '<span class="sr-only"> (abre em nova aba)</span>';

// Situação de hoje (todayStatus do real), com o "agora" fixo da vitrine: terça 14:30
function situacaoHoje(t) {
  const h = t.horario[D0.getDay()];
  if (!h) return 'Fechado hoje';
  const [abre, fecha] = h.map((x) => { const [a, b] = x.split(':').map(Number); return a * 60 + b; });
  const fmt = (x) => { const [a, b] = x.split(':').map(Number); return b ? `${a}h${String(b).padStart(2, '0')}` : `${a}h`; };
  if (AGORA_MIN < abre) return `Abre hoje às ${fmt(h[0])}`;
  if (AGORA_MIN < fecha) return `Aberto hoje até ${fmt(h[1])}`;
  return 'Fechado agora';
}

// ---------- Topo (site-header.tsx, site-menu.tsx, account-menu.tsx) ----------
// Nome que quebra linha (nunca cortado); links de seção só a partir de 1024 px (antes, no menu); "Entrar" e a ação
// principal a partir de 640 px; o menu da conta ("Olá, Alex") no lugar de "Entrar" com sessão.
const linksSecao = (completo) => [
  ...(completo ? [['Serviços', `${INICIO}#servicos`], ['Equipe', `${INICIO}#equipe`]] : []),
  ['Sobre', `${INICIO}#sobre`], ['Horário', `${INICIO}#horario`], ['Contato', `${INICIO}#contato`],
];

function cabecalho(t, { logado = false, completo = false, acao = 'agendar', inicio = INICIO } = {}) {
  const links = linksSecao(completo);
  const principal = acao === 'agendar'
    ? { rotulo: 'Agendar horário', href: AGENDAR, externo: false }
    : { rotulo: 'Chamar no WhatsApp', href: urlWhatsapp(t), externo: true };
  const botao = (cls, extra = '') => `<a href="${principal.href}" class="btn btn-primario${cls}"${principal.externo ? ' target="_blank" rel="noopener"' : ''}${extra}>${principal.rotulo}${principal.externo ? externo : ''}</a>`;
  const contaLinks = [['Minha conta', 'minha-conta.html'], ['Meus agendamentos', 'meus-agendamentos.html']];
  const conta = logado
    ? `<div class="relative" data-menu-suspenso>
            <button type="button" class="btn btn-fantasma btn-sm gap-2" aria-expanded="false" aria-haspopup="menu" aria-controls="menu-conta">${ic('usuario', 'h-4 w-4')} Olá, ${t.cliente.primeiro} ${ic('baixo', 'h-4 w-4')}</button>
            <div id="menu-conta" role="menu" class="menu-suspenso" hidden>
              ${contaLinks.map(([n, h]) => `<a role="menuitem" href="${h}">${n}</a>`).join('\n              ')}
              <a role="menuitem" href="${INICIO}">Sair</a>
            </div>
          </div>`
    : `<a href="entrar.html" class="btn btn-fantasma btn-sm">Entrar</a>`;
  return `
<a href="#conteudo" class="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded-tema focus:bg-superficie focus:px-3 focus:py-2">Pular para o conteúdo</a>
<header class="sticky top-0 z-40 border-b border-borda bg-fundo">
  <div class="relative mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
    <a href="${inicio}" class="flex min-w-0 items-center gap-3">
      <span class="monograma">${t.monograma}</span>
      <span class="titulo break-words text-lg sm:text-xl">${t.nome}</span>
    </a>
    <nav class="hidden items-center gap-6 text-sm font-semibold lg:flex" aria-label="Principal">
      ${links.map(([n, h]) => `<a href="${h}" class="text-suave hover:text-texto">${n}</a>`).join('\n      ')}
    </nav>
    <div class="flex shrink-0 items-center gap-2">
      <div class="hidden sm:block">
        ${conta}
      </div>
      ${botao(' btn-sm hidden sm:inline-flex')}
      <div class="lg:hidden">
        <button type="button" class="btn btn-fantasma h-11 w-11 px-0" data-menu-botao aria-controls="menu-mobile" aria-expanded="false" aria-label="Abrir menu">${ic('menu', 'h-6 w-6')}</button>
      </div>
    </div>
    <nav id="menu-mobile" hidden aria-label="Menu" class="absolute inset-x-0 top-full border-b border-borda bg-fundo px-4 pb-4 pt-2 shadow-sm lg:hidden">
      ${botao(' btn-bloco my-2')}
      <ul>
        ${links.map(([n, h]) => `<li><a href="${h}" class="block rounded-tema px-2 py-3 font-semibold hover:bg-superficie-2">${n}</a></li>`).join('\n        ')}
        ${logado
          ? `${contaLinks.map(([n, h]) => `<li><a href="${h}" class="block rounded-tema px-2 py-3 font-semibold hover:bg-superficie-2">${n}</a></li>`).join('\n        ')}
        <li><a href="${INICIO}" class="block w-full rounded-tema px-2 py-3 text-left font-semibold hover:bg-superficie-2">Sair</a></li>`
          : `<li><a href="entrar.html" class="block rounded-tema px-2 py-3 font-semibold hover:bg-superficie-2">Entrar</a></li>`}
      </ul>
    </nav>
  </div>
</header>`;
}

// ---------- Rodapé (site-footer.tsx) ----------
function rodape(t) {
  return `
<footer class="mt-16 border-t border-borda bg-superficie">
  <div class="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
    <div>
      <div class="flex items-center gap-3"><span class="monograma">${t.monograma}</span><span class="titulo break-words text-lg">${t.nome}</span></div>
      <p class="mt-3 text-sm text-suave">${t.tagline}</p>
    </div>
    <div class="text-sm">
      <h2 class="titulo mb-3 text-base">Endereço</h2>
      <p class="text-suave">${enderecoTexto(t)}</p>
    </div>
    <div class="text-sm">
      <h2 class="titulo mb-3 text-base">Horário</h2>
      <ul class="space-y-1 text-suave">
        ${t.horarios.map(([d, h]) => `<li class="flex justify-between gap-4"><span>${d}</span><span class="num">${h}</span></li>`).join('\n        ')}
      </ul>
    </div>
  </div>
  <div class="border-t border-borda">
    <div class="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-suave sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <span>© ${D0.getFullYear()} ${t.nome}</span>
      <nav aria-label="Informações legais" class="flex flex-wrap items-center gap-x-4">
        <a href="termos.html" class="inline-flex min-h-11 items-center text-sm underline-offset-4 hover:text-texto hover:underline">Termos de uso</a>
        <a href="privacidade.html" class="inline-flex min-h-11 items-center text-sm underline-offset-4 hover:text-texto hover:underline">Política de privacidade</a>
      </nav>
      <span class="font-semibold">Feito com ZeitVez</span>
    </div>
  </div>
</footer>`;
}

const doc = (t, titulo, corpo, extra = {}) =>
  pagina({ titulo: `${titulo} · ${t.nome}`, raiz: R, tema: 'tema.css', corpo, descricao: t.descricaoHero, ...extra });

// Tela de conta/agendamento: topo do salão + conteúdo + rodapé (AccountShell do real)
const casca = (t, titulo, conteudo, opcoes = {}) => doc(t, titulo, `
${cabecalho(t, opcoes)}
<main id="conteudo" tabindex="-1" class="outline-none">
${conteudo}
</main>
${rodape(t)}`);

// ---------- Landing (salon-landing.tsx, hero.tsx e seções) ----------
function landing(t, { logado = false } = {}) {
  const prox = proximoHorarioLivre(t);
  const mapa = urlMapa(t);
  const contatos = [
    ['telefone', t.telefone, `tel:+${t.telefoneDigitos}`, false],
    ['whatsapp', `WhatsApp ${t.whatsapp}`, urlWhatsapp(t), true],
    ['instagram', t.instagram, `https://www.instagram.com/${t.instagram.slice(1)}/`, true],
    ['email', t.email, `mailto:${t.email}`, false],
  ];
  const icone = (n) => `<span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-tema bg-primaria-suave" style="color: var(--cor-primaria-forte)">${ic(n, 'h-4 w-4')}</span>`;
  const cartao = (id, titulo, iconeNome, conteudo) => `<div${id ? ` id="${id}"` : ''} class="scroll-mt-24 cartao p-6">
        <h3 class="titulo flex items-center gap-2 text-lg"><span style="color: var(--cor-primaria-forte)">${ic(iconeNome, 'h-5 w-5')}</span>${titulo}</h3>
        <div class="mt-4">${conteudo}</div>
      </div>`;
  const corpo = `
${cabecalho(t, { logado, completo: true })}
<main id="conteudo" tabindex="-1" class="outline-none">
  <p class="aviso-pagina mx-auto mt-4 max-w-6xl" role="status" data-aviso-conta hidden>Sua conta foi excluída e seus dados pessoais foram apagados.</p>
  <section class="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-12 pt-10 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:pb-20 lg:pt-16">
    <div>
      <p class="rotulo">${t.tipoCurto} · ${t.cidadeNome}</p>
      <h1 class="titulo mt-3 break-words text-4xl sm:text-5xl lg:text-6xl">${t.nome}</h1>
      <p class="mt-4 text-2xl leading-snug sm:text-3xl" style="font-family: var(--fonte-titulo)">${t.tagline}</p>
      <p class="mt-5 max-w-xl text-lg text-suave">${t.descricaoHero}</p>
      <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <a href="${AGENDAR}" class="btn btn-primario">Agendar horário</a>
        <a href="${urlWhatsapp(t)}" class="btn btn-secundario" target="_blank" rel="noopener">Chamar no WhatsApp${externo}</a>
        <a href="#servicos" class="link inline-flex min-h-11 items-center justify-center text-[0.95rem] font-semibold sm:px-2" style="text-decoration: none">Ver serviços e preços</a>
      </div>
      <ul class="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-suave">
        <li class="flex items-center gap-2"><span style="color: var(--cor-primaria-forte)">${ic('relogio', 'h-4 w-4')}</span>${situacaoHoje(t)}</li>
        <li class="flex items-center gap-2"><span style="color: var(--cor-primaria-forte)">${ic('pin', 'h-4 w-4')}</span>${bairroCidade(t)}</li>
      </ul>
    </div>
    <div class="relative mb-8 lg:mb-0">
      <div aria-hidden="true" class="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-tema-lg sm:aspect-[5/4] lg:aspect-[4/5]" style="background-image: radial-gradient(circle at 75% 20%, rgb(255 255 255 / 0.22), transparent 55%), linear-gradient(135deg, var(--cor-foto-1), var(--cor-foto-2) 60%, var(--cor-foto-3))">
        <span class="titulo select-none text-[9rem] leading-none sm:text-[11rem]" style="color: var(--cor-foto-texto); opacity: .8">${t.monograma}</span>
      </div>
      ${prox ? `<div class="cartao absolute inset-x-4 -bottom-6 p-4 shadow-lg sm:left-auto sm:max-w-xs">
        <p class="rotulo flex items-center gap-2">${ic('calendario', 'h-4 w-4')} Próximo horário livre</p>
        <p class="titulo mt-1.5 text-lg">${prox.rotulo}</p>
        <p class="text-sm text-suave">${prox.nota}</p>
      </div>` : ''}
    </div>
  </section>

  <section id="servicos" aria-labelledby="servicos-titulo" class="scroll-mt-20 border-t border-borda bg-superficie-2">
    <div class="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p class="rotulo">Serviços</p>
          <h2 id="servicos-titulo" class="titulo mt-2 text-3xl sm:text-4xl">O que fazemos</h2>
        </div>
        <p class="max-w-sm text-sm text-suave">Preços e durações de referência.</p>
      </div>
      <ul class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        ${t.servicos.map((s) => `<li class="cartao flex flex-col overflow-hidden">
          <div class="flex flex-1 flex-col p-5">
            <h3 class="titulo break-words text-xl">${s.nome}</h3>
            <div class="flex-1"><p class="mt-2 text-sm text-suave">${s.desc}</p></div>
            <div class="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-borda pt-4">
              <div class="text-sm">
                <p class="font-bold">${precoCentavos(s.cents, s.aPartir)}</p>
                <p class="flex items-center gap-1 text-suave">${ic('relogio', 'h-4 w-4')} ${duracao(s.dur)}</p>
              </div>
              <a href="${AGENDAR}" class="btn btn-secundario btn-sm">Agendar horário<span class="sr-only">: ${s.nome}</span></a>
            </div>
          </div>
        </li>`).join('\n        ')}
      </ul>
    </div>
  </section>

  <section id="equipe" aria-labelledby="equipe-titulo" class="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6">
    <p class="rotulo">Equipe</p>
    <h2 id="equipe-titulo" class="titulo mt-2 text-3xl sm:text-4xl">Quem vai te atender</h2>
    <ul class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      ${t.equipe.map((p) => `<li class="cartao p-5">
        <div class="flex items-center gap-4">
          <span aria-hidden="true" class="titulo inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primaria text-xl text-sobre-primaria">${p.nome[0]}</span>
          <div class="min-w-0">
            <h3 class="titulo break-words text-lg">${p.nome}</h3>
            <p class="text-sm text-suave">${p.papel}</p>
          </div>
        </div>
        <p class="mt-4 text-sm text-suave">${p.bio}</p>
        <ul aria-label="Serviços de ${p.nome}" class="mt-4 flex flex-wrap gap-2">${p.servicos.map((i) => `<li class="rounded-full border border-borda bg-superficie-2 px-2.5 py-0.5 text-xs font-semibold">${t.servicos[i].nome}</li>`).join('')}</ul>
      </li>`).join('\n      ')}
    </ul>
  </section>

  <section id="sobre" aria-labelledby="sobre-titulo" class="scroll-mt-20 border-y border-borda bg-superficie">
    <div class="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
      <div>
        <p class="rotulo">Sobre</p>
        <h2 id="sobre-titulo" class="titulo mt-2 text-3xl sm:text-4xl">Nossa história</h2>
        <div class="mt-4 space-y-4 text-lg text-suave">
          ${t.sobre.map((p) => `<p>${p}</p>`).join('\n          ')}
        </div>
      </div>
      <ul class="grid grid-cols-1 gap-3 self-center sm:grid-cols-2" aria-label="Destaques">
        ${t.destaques.map((d) => `<li class="flex items-center gap-3 rounded-tema border border-borda bg-fundo p-4 text-sm font-semibold"><span class="shrink-0" style="color: var(--cor-primaria-forte)">${ic('check', 'h-5 w-5')}</span>${d}</li>`).join('\n        ')}
      </ul>
    </div>
  </section>

  <section id="contato" aria-labelledby="contato-titulo" class="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6">
    <p class="rotulo">Visite a gente</p>
    <h2 id="contato-titulo" class="titulo mt-2 text-3xl sm:text-4xl">Horário, endereço e contato</h2>
    <div class="mt-10 grid gap-6 lg:grid-cols-3">
      ${cartao('horario', 'Horário de funcionamento', 'relogio', `<p class="text-sm font-semibold" style="color: var(--cor-primaria-forte)">${situacaoHoje(t)}</p>
          <dl class="mt-4 space-y-2 text-sm">
            ${t.horarios.map(([d, h]) => `<div class="flex justify-between gap-4 border-b border-borda pb-2 last:border-0"><dt>${d}</dt><dd class="num text-right text-suave">${h}</dd></div>`).join('\n            ')}
          </dl>`)}
      ${cartao('', 'Endereço', 'pin', `<address class="text-sm not-italic text-suave">${enderecoTexto(t)}</address>
          <a href="${mapa}" target="_blank" rel="noopener" class="btn btn-secundario btn-sm mt-5">${ic('pin', 'h-4 w-4')} Como chegar${externo}</a>`)}
      ${cartao('', 'Fale com a gente', 'whatsapp', `<ul class="space-y-3 text-sm">
            ${contatos.map(([n, rotulo, href, nova]) => `<li><a class="flex min-h-11 items-center gap-3 break-all hover:underline" href="${href}"${nova ? ' target="_blank" rel="noopener"' : ''}>${icone(n)}${rotulo}${nova ? externo : ''}</a></li>`).join('\n            ')}
          </ul>`)}
    </div>
  </section>
</main>
${rodape(t)}`;
  return pagina({ titulo: `${t.nome} · ${t.tagline}`, raiz: R, tema: 'tema.css', corpo, descricao: t.descricaoHero });
}

// ---------- Cartão de conta (AccountCard) e campos (form-controls.tsx) ----------
export const cartaoConta = (t, { titulo, subtitulo, conteudo, depois = '' }, opcoes = {}) => `
<div class="mx-auto w-full max-w-md px-4 py-10 sm:py-16">
  <div class="text-center">
    <h1 class="titulo text-3xl sm:text-4xl">${titulo}</h1>
    ${subtitulo ? `<p class="mt-2 text-suave">${subtitulo}</p>` : ''}
  </div>
  <div class="cartao mt-8 p-5 shadow-sm sm:p-7">
    ${conteudo}
  </div>
  ${depois}
</div>`;

export const campo = ({ id, rotulo, tipo = 'text', auto = '', placeholder = '', dica = '', valor = '', acao = '', somenteLeitura = false }) => `<div class="space-y-1.5">
        <div class="flex flex-wrap items-end justify-between gap-x-3 gap-y-1">
          <label class="campo-rotulo !mb-0" for="${id}">${rotulo}</label>${acao}
        </div>
        <input class="campo" id="${id}" type="${tipo}"${auto ? ` autocomplete="${auto}"` : ''}${placeholder ? ` placeholder="${placeholder}"` : ''}${valor ? ` value="${valor}"` : ''}${somenteLeitura ? ' readonly' : ''}${dica ? ` aria-describedby="${id}-ajuda"` : ''}>
        ${dica ? `<p id="${id}-ajuda" class="text-sm text-suave">${dica}</p>` : ''}
      </div>`;

export const caixa = (id, conteudo, descricao = '', marcado = true) => `<div class="flex items-start gap-3 text-sm">
        <input type="checkbox" class="caixa-marcar mt-0.5" id="${id}"${marcado ? ' checked' : ''}>
        <div><label for="${id}" class="font-medium">${conteudo}</label>${descricao ? `<p class="text-suave">${descricao}</p>` : ''}</div>
      </div>`;

export const MANTER = 'Você não precisa digitar a senha de novo por 90 dias. Desmarque em aparelhos de outras pessoas.';
export const textoLink = (href, rotulo, extra = '') => `<a href="${href}" class="link font-semibold" style="text-decoration: none"${extra}>${rotulo}</a>`;

function entrar(t) {
  return casca(t, 'Entrar', cartaoConta(t, {
    titulo: 'Entrar',
    subtitulo: 'Clientes e equipe usam a mesma tela. Depois de entrar, cada um vai para o lugar certo.',
    depois: `<p class="mt-6 text-center text-sm"><a href="${INICIO}" class="text-suave underline-offset-4 hover:text-texto hover:underline">Voltar para o site</a></p>`,
    conteudo: `<form class="space-y-5" action="inicio-conectado.html" data-ir="inicio-conectado.html" novalidate>
      ${campo({ id: 'login-email', rotulo: 'E-mail', tipo: 'email', auto: 'username', placeholder: 'voce@email.com', valor: t.cliente.email })}
      ${campo({ id: 'login-senha', rotulo: 'Senha', tipo: 'password', auto: 'current-password', valor: 'senha-ficticia', acao: textoLink('recuperar-senha.html', 'Esqueci minha senha') })}
      ${caixa('manter', 'Manter conectado neste aparelho', MANTER)}
      <button class="btn btn-primario btn-bloco" type="submit">Entrar</button>
      <p class="text-center text-sm text-suave">Primeira vez aqui? ${textoLink('criar-conta.html', 'Crie sua conta', ' data-preserva-voltar')}</p>
    </form>`,
  }));
}

function criarConta(t) {
  return casca(t, 'Criar conta', cartaoConta(t, {
    titulo: 'Criar conta',
    subtitulo: `Com a conta você agenda em ${t.nome} e acompanha seus horários.`,
    depois: `<p class="mt-6 text-center text-sm text-suave">Já tem conta? ${textoLink('entrar.html', 'Entrar', ' data-preserva-voltar')}</p>`,
    conteudo: `<form class="space-y-5" action="inicio-conectado.html" data-ir="inicio-conectado.html" novalidate>
      ${campo({ id: 'cad-nome', rotulo: 'Nome', auto: 'name', placeholder: 'Como devemos te chamar?' })}
      ${campo({ id: 'cad-tel', rotulo: 'Celular (WhatsApp)', tipo: 'tel', auto: 'tel-national', placeholder: t.cliente.tel, dica: 'Com DDD. O salão usa para falar com você sobre os seus horários.' })}
      ${campo({ id: 'cad-email', rotulo: 'E-mail', tipo: 'email', auto: 'email', placeholder: 'voce@email.com', dica: 'É com ele que você entra.' })}
      ${campo({ id: 'cad-senha', rotulo: 'Senha', tipo: 'password', auto: 'new-password', dica: 'Mínimo de 8 caracteres.' })}
      ${caixa('cad-manter', 'Manter conectado neste aparelho', MANTER)}
      ${caixa('cad-termos', `Li e aceito os <a href="termos.html" target="_blank" rel="noopener" class="link font-semibold">termos de uso${externo}</a> e a <a href="privacidade.html" target="_blank" rel="noopener" class="link font-semibold">política de privacidade${externo}</a>.`, '', false)}
      <button class="btn btn-primario btn-bloco" type="submit">Criar conta</button>
    </form>`,
  }));
}

function recuperarSenha(t) {
  return casca(t, 'Recuperar senha', cartaoConta(t, {
    titulo: 'Esqueceu a senha?',
    subtitulo: 'Informe o e-mail da sua conta. Enviamos um link para você criar uma nova senha.',
    depois: `<p class="mt-6 text-center text-sm">${textoLink('entrar.html', 'Lembrei a senha')}</p>`,
    conteudo: `<div data-abas hidden><a data-aba="pedir"></a><a data-aba="enviado"></a></div>
    <form id="aba-pedir" class="space-y-5" action="recuperar-senha.html#enviado" data-ir="recuperar-senha.html#enviado" novalidate>
      ${campo({ id: 'rec-email', rotulo: 'E-mail', tipo: 'email', auto: 'email', placeholder: 'voce@email.com', valor: t.cliente.email })}
      <button class="btn btn-primario btn-bloco" type="submit">Enviar link</button>
    </form>
    <div id="aba-enviado" class="text-center" role="status" hidden>
      <span class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primaria-suave" style="color: var(--cor-primaria-forte)">${ic('email', 'h-7 w-7')}</span>
      <h2 class="titulo mt-4 text-xl">Confira seu e-mail</h2>
      <p class="mt-2 text-sm text-suave">Se existir uma conta com esse e-mail, você vai receber um link em alguns minutos. O link vale por 1 hora. Olhe também a caixa de spam.</p>
      <a href="recuperar-senha.html#pedir" class="btn btn-secundario btn-bloco mt-6" data-ir-aba="pedir">Não recebi, enviar de novo</a>
    </div>`,
  }));
}

const camposSenha = `${campo({ id: 'ns-1', rotulo: 'Nova senha', tipo: 'password', auto: 'new-password', dica: 'Mínimo de 8 caracteres.' })}
      ${campo({ id: 'ns-2', rotulo: 'Repita a nova senha', tipo: 'password', auto: 'new-password' })}`;

function novaSenha(t) {
  return casca(t, 'Nova senha', cartaoConta(t, {
    titulo: 'Crie uma nova senha',
    subtitulo: 'Escolha a senha que você vai usar para entrar.',
    conteudo: `<form class="space-y-5" action="entrar.html" data-ir="entrar.html" novalidate>
      ${camposSenha}
      <button class="btn btn-primario btn-bloco" type="submit">Salvar nova senha</button>
    </form>`,
  }));
}

function definirSenha(t) {
  return casca(t, 'Defina sua senha', cartaoConta(t, {
    titulo: 'Defina sua senha',
    subtitulo: `Boas-vindas à equipe de ${t.nome}! Crie a senha que você vai usar para entrar.`,
    conteudo: `<form class="space-y-5" action="painel/agenda.html" data-ir="painel/agenda.html" novalidate>
      ${camposSenha}
      <button class="btn btn-primario btn-bloco" type="submit">Criar senha e entrar</button>
    </form>`,
  }));
}

// ---------- Fluxo de agendamento (booking-frame.tsx e etapas) ----------
function moldura(passo, titulo, voltar, conteudo) {
  return `
<div class="mx-auto w-full max-w-3xl px-4 pb-24 pt-6 sm:px-6 sm:pt-10">
  <div class="flex items-center justify-between gap-4">
    <a href="${voltar}" class="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-suave hover:text-texto">${ic('esquerda', 'h-4 w-4')} Voltar</a>
    <span class="text-sm text-suave">Passo ${passo} de 4</span>
  </div>
  <div class="passos mt-1" aria-hidden="true">${[1, 2, 3, 4].map((i) => `<span class="passo${i <= passo ? ' feito' : ''}"></span>`).join('')}</div>
  <h1 class="titulo mt-6 text-3xl sm:text-4xl">${titulo}</h1>
  ${conteudo}
</div>`;
}

// Lista de profissionais da etapa "Com quem?" (também usada pelo balcão do painel; só o destino e a frase mudam)
export function opcoesProfissional(t, { destino, semPreferencia = 'O salão escolhe quem atende no horário que você escolher.' }) {
  const cartao = (conteudo) => `<li><a href="${destino}" class="opcao flex min-h-16 items-center gap-4 p-4">${conteudo}</a></li>`;
  return `<ul class="mt-6 grid gap-3">
    ${cartao(`<span aria-hidden="true" class="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primaria-suave" style="color: var(--cor-primaria-forte)">★</span>
      <span class="min-w-0"><span class="block font-semibold">Sem preferência</span><span class="block text-sm text-suave">${semPreferencia}</span></span>`)}
    ${t.equipe.map((p) => cartao(`<span aria-hidden="true" class="titulo inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primaria text-lg text-sobre-primaria">${p.nome[0]}</span>
      <span class="min-w-0"><span class="block break-words font-semibold">${p.nome}</span><span class="block text-sm text-suave">${p.papel}</span></span>`)).join('\n    ')}
  </ul>`;
}

function agendarProfissional(t) {
  return casca(t, 'Escolher profissional', moldura(1, 'Com quem?', INICIO, `
  ${opcoesProfissional(t, { destino: 'agendar-servicos.html' })}`));
}

// Formulário da etapa "O que vamos fazer?" (também usado pelo balcão do painel)
export function formServicos(t, { destino }) {
  const ex = escolhaDeExemplo(t);
  const marcados = new Set(ex.servicos.map((x) => x.key));
  return `<form class="mt-6 space-y-5" action="${destino}" data-ir="${destino}" novalidate>
    <fieldset>
      <legend class="sr-only">Serviços</legend>
      <ul class="grid gap-3">
        ${ex.pro.chaves.map((k) => t.servicos.find((x) => x.key === k)).map((s) => `<li><label class="opcao flex min-h-16 cursor-pointer items-start gap-4 p-4${marcados.has(s.key) ? ' ativo' : ''}" data-opcao-check>
          <input type="checkbox" name="servicos" value="${s.key}" class="caixa-marcar mt-0.5"${marcados.has(s.key) ? ' checked' : ''}>
          <span class="min-w-0 flex-1">
            <span class="block break-words font-semibold">${s.nome}</span>
            <span class="block text-sm text-suave">${s.desc}</span>
            <span class="mt-1 block text-sm text-suave">${duracao(s.dur)} · ${precoCentavos(s.cents, s.aPartir)}</span>
          </span>
        </label></li>`).join('\n        ')}
      </ul>
    </fieldset>
    <button type="submit" class="btn btn-primario">Continuar</button>
  </form>`;
}

function agendarServicos(t) {
  return casca(t, 'Escolher serviços', moldura(2, 'O que vamos fazer?', AGENDAR, `
  ${formServicos(t, { destino: 'agendar-horario.html' })}`));
}

// Dias e horários livres (time-picker.tsx): um botão por dia e, abaixo, o dia escolhido com seus horários
export function seletorHorarios(dias, { atual, destino }) {
  const inicial = dias.find((d) => atual && d.dia === atual.dia) ?? dias[0];
  const painel = (d) => `<div id="dia-${d.dia}" data-painel-dia${d === inicial ? '' : ' hidden'}>
    <h2 class="titulo mt-8 text-xl first-letter:uppercase">${diaLongo(d.data)}</h2>
    <ul class="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
      ${d.inicios.map((m) => `<li><a href="${destino}" class="horario${atual && atual.dia === d.dia && atual.ini === m ? ' atual' : ''}" aria-label="${hora(m)}, ${diaLongo(d.data)}">${hora(m)}</a></li>`).join('\n      ')}
    </ul>
  </div>`;
  return `<div class="mt-6" data-seletor-dia>
    <div role="group" aria-label="Dia" class="flex flex-wrap gap-2">
      ${dias.map((d) => `<button type="button" class="chip" aria-pressed="${d === inicial}" data-painel="dia-${d.dia}">${diaCurto(d.data)}</button>`).join('\n      ')}
    </div>
    ${dias.map(painel).join('\n    ')}
  </div>`;
}

function agendarHorario(t) {
  const ex = escolhaDeExemplo(t);
  const dias = diasComHorarios(t, ex.pro.key, ex.tot.dur, [], { dias: 14 });
  return casca(t, 'Escolher horário', moldura(3, 'Quando?', 'agendar-servicos.html', seletorHorarios(dias, { atual: { dia: ex.dia, ini: ex.ini }, destino: 'agendar-confirmar.html' })));
}

// Resumo (booking-summary.tsx)
export function resumoAgendamento(t, ex) {
  const linha = (icone, termo, valor) => `<div class="flex gap-3 px-5 py-3.5">
        <span class="mt-0.5" style="color: var(--cor-primaria-forte)">${ic(icone, 'h-5 w-5')}</span>
        <dt class="w-24 shrink-0 text-sm text-suave sm:w-28">${termo}</dt>
        <dd class="min-w-0 flex-1 break-words text-sm font-semibold">${valor}</dd>
      </div>`;
  const tot = totais(ex.servicos);
  return `<dl class="divide-y divide-borda">
      ${linha('usuario', 'Profissional', ex.pro.nome)}
      ${linha('tesoura', 'Serviços', ex.servicos.map((s) => `<span class="block">${s.nome} <span class="font-normal text-suave">· ${duracao(s.dur)} · ${precoCentavos(s.cents, s.aPartir)}</span></span>`).join(''))}
      ${linha('calendario', 'Data e hora', `<span class="first-letter:uppercase">${dataSlotLonga(ex.data, ex.ini)}</span>`)}
      <div class="flex items-baseline justify-between gap-4 px-5 py-4">
        <dt class="text-sm text-suave">Total · ${duracao(tot.dur)}</dt>
        <dd class="titulo text-xl">${precoTotal(tot)}</dd>
      </div>
    </dl>`;
}

const politicaConfirmacao = (t) => `<p class="mt-4 text-sm text-suave">Você pode cancelar pelo site até ${prazoTexto(t.regras.prazoCancelamento)} antes do horário. Depois disso, fale com o salão.</p>`;

function agendarConfirmar(t, { logado }) {
  const ex = escolhaDeExemplo(t);
  const resumo = `<div class="cartao mt-6 overflow-hidden">
    <h2 class="titulo border-b border-borda px-5 py-4 text-lg">Resumo</h2>
    ${resumoAgendamento(t, ex)}
  </div>
  ${politicaConfirmacao(t)}`;
  const voltar = 'agendar-confirmar-conectado.html';
  const fim = logado
    ? `<form class="mt-6 space-y-5" action="agendar-sucesso.html" data-ir="agendar-sucesso.html" novalidate>
    <div class="space-y-1.5">
      <label for="obs" class="campo-rotulo !mb-0">Observação para o salão (opcional)</label>
      <textarea id="obs" name="customerNote" rows="3" maxlength="500" class="campo"></textarea>
    </div>
    <button type="submit" class="btn btn-primario">Confirmar agendamento</button>
  </form>`
    : `<section aria-labelledby="entrar-titulo" class="mt-8 rounded-tema-lg border border-borda bg-superficie-2 p-5">
    <h2 id="entrar-titulo" class="titulo text-lg">Entre para confirmar</h2>
    <p class="mt-1 text-sm text-suave">Seu horário e suas escolhas ficam guardados: depois de entrar, você volta para esta tela.</p>
    <div class="mt-4 flex flex-col gap-3 sm:flex-row">
      <a href="entrar.html?voltar=${voltar}" class="btn btn-primario">Entrar</a>
      <a href="criar-conta.html?voltar=${voltar}" class="btn btn-secundario">Criar conta</a>
    </div>
  </section>`;
  return casca(t, 'Confirmar agendamento', moldura(4, 'Confira e confirme', 'agendar-horario.html', `${resumo}\n  ${fim}`), { logado });
}

function arquivoIcs(t, { id, titulo, data, ini, fim }) {
  const stamp = (d, m) => `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}T${String(Math.floor(m / 60)).padStart(2, '0')}${String(m % 60).padStart(2, '0')}00`;
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//ZeitVez//Vitrine//PT', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT',
    `UID:${id}@zeitvez.exemplo`, `DTSTAMP:${stamp(D0, AGORA_MIN)}`, `DTSTART;TZID=America/Sao_Paulo:${stamp(data, ini)}`, `DTEND;TZID=America/Sao_Paulo:${stamp(data, fim)}`,
    `SUMMARY:${titulo} · ${t.nome}`, `LOCATION:${enderecoTexto(t)}`, 'END:VEVENT', 'END:VCALENDAR', ''].join('\r\n');
}

const botaoCalendario = (arquivo, cls = '') => `<a href="${R}assets/${arquivo}" download="agendamento.ics" class="btn btn-secundario${cls}">${ic('calendario', 'h-4 w-4')} Adicionar ao calendário</a>`;

function agendarSucesso(t) {
  const ex = escolhaDeExemplo(t);
  return casca(t, 'Agendamento confirmado', `
<div class="mx-auto w-full max-w-3xl px-4 pb-24 pt-6 sm:px-6 sm:pt-10">
  <div class="pt-4 text-center">
    <span class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primaria text-sobre-primaria">${ic('check', 'h-10 w-10')}</span>
    <h1 class="titulo mt-6 text-3xl sm:text-4xl">Agendamento confirmado!</h1>
    <p class="mx-auto mt-3 max-w-md text-suave">Te esperamos ${dataSlotLonga(ex.data, ex.ini)}. Para mudar ou cancelar, fale com o salão.</p>
  </div>
  <div class="cartao mt-8 overflow-hidden">
    ${resumoAgendamento(t, ex)}
  </div>
  <div class="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
    ${botaoCalendario(`exemplo-${t.slug}.ics`)}
    <a href="${INICIO}" class="btn btn-secundario">Voltar ao início do site</a>
  </div>
</div>`, { logado: true });
}

// ---------- Meus agendamentos e remarcar (meu-agendamento.tsx, remarcar/page.tsx) ----------
const ROTULO_ESTADO = { Confirmed: ['Confirmado', 'border-primaria'], Completed: ['Concluído', 'border-primaria'], Cancelled: ['Cancelado', 'border-borda text-suave'], NoShow: ['Não compareceu', 'border-primaria'] };

// Atendimentos de Alex no seed, separados em próximos (confirmados que ainda vão acontecer) e passados
function atendimentosDeAlex(t) {
  const meus = t.agendamentos.filter((a) => a.cli === 'alex');
  const agoraAbs = AGORA_MIN;
  const futuro = (a) => a.st === 'Confirmed' && a.dia * 1440 + a.ini > agoraAbs;
  const prazo = t.regras.prazoCancelamento;
  const dentroDoPrazo = (a) => agoraAbs < a.dia * 1440 + a.ini - prazo;
  const ordenar = (x, y) => x.dia * 1440 + x.ini - (y.dia * 1440 + y.ini);
  return {
    proximos: meus.filter(futuro).sort(ordenar).map((a) => ({ ...a, pode: dentroDoPrazo(a) })),
    passados: meus.filter((a) => !futuro(a)).sort((x, y) => ordenar(y, x)),
  };
}

function cartaoAgendamento(t, a, { proximo }) {
  const pro = t.equipe.find((p) => p.key === a.pro);
  const quando = dataSlotLonga(dataDe(a.dia), a.ini);
  const resumo = `${nomes(a.itens)}, ${quando}`;
  const [rotulo, cls] = ROTULO_ESTADO[a.st];
  const fechado = proximo && !a.pode;
  const arquivoIcsAg = `${a.id}.ics`;
  return `<li id="${a.id}" class="cartao p-5">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div class="min-w-0">
            <h3 class="titulo break-words text-lg">${nomes(a.itens)}</h3>
            <p class="mt-1 text-sm capitalize">${quando}</p>
            <p class="mt-1 text-sm text-suave">Com ${pro.nome}</p>
          </div>
          <span class="rounded-full border px-3 py-1 text-xs font-semibold ${cls}" data-estado>${rotulo}</span>
        </div>
        <p class="mt-3 text-sm font-semibold">${precoCentavos(a.cents, a.aPartir)}</p>
        ${proximo ? `<div class="mt-4 flex flex-wrap gap-2" data-acoes>
          ${botaoCalendario(arquivoIcsAg)}
          ${a.pode ? `<a href="remarcar.html" class="btn btn-secundario">Remarcar</a>
          <button type="button" class="btn btn-secundario" data-abrir-dialogo="dlg-cancelar" data-alvo="${a.id}" data-resumo-dialogo="${esc(resumo)}">Cancelar</button>` : ''}
        </div>` : ''}
        ${fechado ? `<div class="mt-4 rounded-tema border border-borda bg-superficie-2 p-4 text-sm">
          <p>${t.regras.politica}</p>
          <a href="${urlWhatsapp(t, `Olá! Quero falar sobre meu agendamento de ${quando}.`)}" target="_blank" rel="noopener" class="link mt-3 inline-flex min-h-11 items-center font-semibold" style="text-decoration: none">Falar com o salão no WhatsApp${externo}</a>
        </div>` : ''}
      </li>`;
}

function meusAgendamentos(t) {
  const { proximos, passados } = atendimentosDeAlex(t);
  const secao = (titulo, lista, vazio, proximo) => `<section aria-labelledby="lista-${titulo}">
      <h2 id="lista-${titulo}" class="titulo text-xl">${titulo}</h2>
      ${lista.length ? `<ul class="mt-4 space-y-4">\n      ${lista.map((a) => cartaoAgendamento(t, a, { proximo })).join('\n      ')}\n      </ul>` : `<p class="mt-3 text-suave">${vazio}</p>`}
    </section>`;
  return casca(t, 'Meus agendamentos', `
<div class="mx-auto w-full max-w-3xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
  <h1 class="titulo text-3xl sm:text-4xl">Meus agendamentos</h1>
  <p class="mt-1 text-suave">Seus horários em ${t.nome}.</p>
  <p class="aviso-pagina mt-6" role="status" data-aviso-remarcado hidden>Agendamento remarcado. Se você já tinha baixado o arquivo do calendário, baixe de novo para atualizar o horário.</p>
  <div class="mt-8 space-y-10">
    ${secao('Próximos', proximos, 'Nenhum agendamento pela frente.', true)}
    ${secao('Passados', passados, 'Nenhum atendimento anterior.', false)}
  </div>
</div>
<dialog id="dlg-cancelar" class="dialogo">
  <div class="grid gap-4 p-6">
    <h2 class="titulo text-xl">Cancelar este agendamento?</h2>
    <p class="text-sm text-suave"><span data-resumo-alvo></span>. O horário volta a ficar livre para outros clientes.</p>
    <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
      <button type="button" class="btn btn-secundario" data-fechar-dialogo>Voltar</button>
      <button type="button" class="btn btn-primario" style="background: var(--cor-erro-texto); color: var(--cor-fundo)" data-confirmar-cancelamento>Sim, cancelar</button>
    </div>
  </div>
</dialog>`, { logado: true });
}

function remarcar(t) {
  const { proximos } = atendimentosDeAlex(t);
  const a = proximos.find((x) => x.pode);
  const titulo = '<h1 class="titulo text-3xl sm:text-4xl">Remarcar agendamento</h1>';
  const voltar = `<a href="meus-agendamentos.html" class="btn btn-secundario mt-10">Voltar para meus agendamentos</a>`;
  const quadro = (conteudo) => `
<div class="mx-auto w-full max-w-3xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
  ${titulo}
  ${conteudo}
</div>`;
  if (!a) {
    const fechado = proximos[0];
    const pro = t.equipe.find((p) => p.key === fechado.pro);
    return casca(t, 'Remarcar agendamento', quadro(`<p class="mt-6 text-suave">${nomes(fechado.itens)}, ${dataSlotLonga(dataDe(fechado.dia), fechado.ini)}, com ${pro.nome}</p>
  <p role="status" class="mt-6 rounded-tema border border-borda bg-superficie-2 p-4 text-sm">${t.regras.politica}</p>
  ${voltar}`), { logado: true });
  }
  const pro = t.equipe.find((p) => p.key === a.pro);
  const dur = a.fim - a.ini;
  const dias = diasComHorarios(t, a.pro, dur, [], { dias: 14, incluir: { dia: a.dia, ini: a.ini } });
  return casca(t, 'Remarcar agendamento', quadro(`<p class="mt-1">Atual: ${nomes(a.itens)}, ${dataSlotLonga(dataDe(a.dia), a.ini)}, com ${pro.nome}.</p>
  ${seletorHorarios(dias, { atual: { dia: a.dia, ini: a.ini }, destino: 'meus-agendamentos.html?remarcado=1' })}
  ${voltar}`), { logado: true });
}

// ---------- Minha conta (minha-conta/page.tsx e componentes) ----------
function minhaConta(t) {
  const secao = (titulo, descricao, conteudo) => `<section class="cartao p-5 sm:p-6">
      <h2 class="titulo text-xl">${titulo}</h2>
      ${descricao ? `<p class="mt-1 text-sm text-suave">${descricao}</p>` : ''}
      <div class="mt-5">${conteudo}</div>
    </section>`;
  const dir = (botao) => `<div class="flex justify-end">${botao}</div>`;
  return casca(t, 'Minha conta', `
<div class="mx-auto w-full max-w-2xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
  <h1 class="titulo text-3xl sm:text-4xl">Minha conta</h1>
  <p class="mt-1 text-suave">Sua conta vale para ${t.nome}.</p>
  <div class="mt-8 space-y-6">
    ${secao('Dados pessoais', '', `<form class="space-y-5" action="minha-conta.html" data-ir="minha-conta.html" novalidate>
      ${campo({ id: 'pf-nome', rotulo: 'Nome', auto: 'name', valor: t.cliente.nome })}
      ${campo({ id: 'pf-tel', rotulo: 'Celular (WhatsApp)', tipo: 'tel', auto: 'tel-national', valor: t.cliente.tel })}
      ${campo({ id: 'pf-email', rotulo: 'E-mail (usado para entrar)', tipo: 'email', valor: t.cliente.email, somenteLeitura: true, dica: 'O e-mail não pode ser alterado.' })}
      ${dir('<button type="submit" class="btn btn-primario">Salvar dados</button>')}
    </form>`)}
    ${secao('Senha', '', `<form class="space-y-5" action="minha-conta.html" data-ir="minha-conta.html" novalidate>
      ${campo({ id: 'pw-atual', rotulo: 'Senha atual', tipo: 'password', auto: 'current-password' })}
      ${campo({ id: 'pw-nova', rotulo: 'Nova senha', tipo: 'password', auto: 'new-password', dica: 'Mínimo de 8 caracteres. Os outros aparelhos conectados saem da conta.' })}
      ${campo({ id: 'pw-repita', rotulo: 'Repita a nova senha', tipo: 'password', auto: 'new-password' })}
      ${dir('<button type="submit" class="btn btn-primario">Alterar senha</button>')}
    </form>`)}
    ${secao('Sair', 'Encerra a sessão neste aparelho.', `<a href="${INICIO}" class="btn btn-secundario">${ic('sair', 'h-4 w-4')} Sair</a>`)}
    ${secao('Seus dados e privacidade', 'Você pode excluir sua conta a qualquer momento (LGPD). Veja a <a class="link" href="privacidade.html">política de privacidade</a>.', `<button type="button" class="btn btn-perigo" data-abrir-dialogo="dlg-excluir">${ic('lixeira', 'h-4 w-4')} Excluir minha conta</button>`)}
  </div>
</div>
<dialog id="dlg-excluir" class="dialogo">
  <div class="grid gap-4 p-6">
    <h2 class="titulo text-xl">Excluir sua conta?</h2>
    <p class="text-sm text-suave">Seus dados pessoais serão apagados. ${t.nome} mantém só o que a lei obriga (por exemplo, registros fiscais). Não dá para desfazer.</p>
    ${campo({ id: 'ex-senha', rotulo: 'Digite sua senha para confirmar', tipo: 'password', auto: 'current-password' })}
    <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
      <button type="button" class="btn btn-secundario" data-fechar-dialogo>Manter conta</button>
      <a href="${INICIO}?conta=excluida" class="btn btn-primario" style="background: var(--cor-erro-texto); color: var(--cor-fundo)">Excluir conta</a>
    </div>
  </div>
</dialog>`, { logado: true });
}

// ---------- Termos e privacidade (legal-document.tsx, legal-texts.tsx) ----------
function legal(t, { titulo, intro, secoes }) {
  return casca(t, titulo, `
<article class="mx-auto w-full max-w-3xl break-words px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
  <p class="rotulo">${t.nome}</p>
  <h1 class="titulo mt-2 text-3xl sm:text-4xl">${titulo}</h1>
  <p class="mt-2 text-sm text-suave">Última atualização: 22 de outubro de 2026</p>
  <p class="mt-6 text-suave">${intro}</p>
  <div class="mt-8 space-y-8">
    ${secoes.map(([h, ps], i) => `<section>
      <h2 class="titulo text-xl">${i + 1}. ${h}</h2>
      ${ps.map((p) => `<p class="mt-3 text-suave">${p}</p>`).join('\n      ')}
    </section>`).join('\n    ')}
  </div>
</article>`);
}

const controlador = (t) => `${t.razaoSocial} (CNPJ ${t.cnpj})`;
const contato = (t) => `${t.email} ou WhatsApp ${t.whatsapp}`;

const privacidade = (t) => legal(t, {
  titulo: 'Política de privacidade',
  intro: `Esta política explica quais dados pessoais ${t.nome} coleta quando você usa o site, para que usa e quais são os seus direitos pela Lei Geral de Proteção de Dados (LGPD, Lei 13.709/2018).`,
  secoes: [
    ['Quem cuida dos seus dados', [
      `O controlador dos dados é ${controlador(t)}. Contato: ${contato(t)}.`,
      'O site e o sistema de agendamento são fornecidos pelo ZeitVez, que trata os dados apenas em nome do estabelecimento (operador), para hospedar e fazer o sistema funcionar.',
    ]],
    ['Quais dados coletamos', [
      'Nome, celular, e-mail e senha (guardada de forma criptografada, ninguém consegue lê-la); seus agendamentos e o histórico de atendimentos; as observações que você escreve ao agendar.',
      'Se você foi atendido no balcão ou por telefone antes de criar a conta, o estabelecimento pode ter registrado seu nome e celular.',
    ]],
    ['Para que usamos', [
      'Para marcar, confirmar, lembrar e cancelar seus horários; para falar com você sobre seus agendamentos; e para que a equipe conheça seu histórico e suas preferências no atendimento.',
      'Não vendemos seus dados e não enviamos propaganda sem o seu consentimento.',
    ]],
    ['Com quem compartilhamos', [
      `Com os profissionais de ${t.nome} que vão te atender e com o ZeitVez, que opera o sistema. Fora isso, só por obrigação legal ou ordem judicial.`,
    ]],
    ['Por quanto tempo guardamos', [
      'Enquanto sua conta existir. Se você excluir a conta, apagamos ou anonimizamos seus dados, mantendo apenas o que a lei obriga a guardar.',
    ]],
    ['Seus direitos', [
      `Você pode confirmar se tratamos seus dados, acessá-los, corrigi-los, pedir a exclusão, a portabilidade e revogar consentimentos. A maior parte disso está em <a class="link font-semibold" style="text-decoration: none" href="minha-conta.html">Minha conta</a>; para o resto, fale com ${contato(t)}.`,
    ]],
    ['Cookies', [
      'Usamos apenas o cookie necessário para manter você conectado (por até 90 dias, se marcar “Manter conectado”). O site não carrega mapas, fontes, imagens nem scripts de outros endereços.',
    ]],
  ],
});

const termos = (t) => legal(t, {
  titulo: 'Termos de uso',
  intro: `Estes termos valem para o uso do site de ${t.nome}. Ao criar uma conta, você concorda com eles.`,
  secoes: [
    ['O serviço', [
      `O site permite consultar serviços e preços e agendar horários com a equipe de ${t.nome}. O atendimento em si é responsabilidade do estabelecimento, ${controlador(t)}; o site é fornecido pela plataforma ZeitVez.`,
    ]],
    ['Sua conta', [
      `A conta vale só para ${t.nome}. Use dados verdadeiros e mantenha sua senha em segredo. A conta é pessoal. Não marque “Manter conectado” em aparelhos de outras pessoas.`,
    ]],
    ['Agendamentos e preços', [
      'Os horários dependem da disponibilidade da equipe. Preços marcados como “a partir de” podem mudar conforme o comprimento, o volume ou a necessidade de cada cliente; o valor final é combinado no atendimento. O pagamento é feito no local.',
    ]],
    ['Cancelamentos e faltas', [
      `Você pode cancelar pelo site até ${prazoTexto(t.regras.prazoCancelamento)} antes do horário. Depois disso, fale com o estabelecimento (${contato(t)}). Faltas sem aviso ficam registradas no seu histórico.`,
    ]],
    ['Mudanças nestes termos', [
      'Se os termos mudarem, avisamos no site. Continuar usando depois do aviso significa que você concorda com a nova versão.',
    ]],
  ],
});

// ---------- 404 dentro do salão (salon-not-found.tsx) ----------
function naoEncontrada(t) {
  return doc(t, 'Página não encontrada', `
${cabecalho(t, { acao: 'whatsapp' })}
<main id="conteudo" tabindex="-1" class="mx-auto flex w-full max-w-2xl flex-col items-center justify-center gap-4 px-4 py-16 text-center outline-none">
  <p class="rotulo">Erro 404</p>
  <h1 class="titulo text-3xl sm:text-4xl">Página não encontrada</h1>
  <p class="text-lg text-suave">O link pode estar errado ou a página mudou de lugar.</p>
  <div class="mt-4 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
    <a href="${INICIO}" class="btn btn-primario">Ir para o início</a>
    <a href="${urlWhatsapp(t)}" class="btn btn-secundario" target="_blank" rel="noopener">Chamar no WhatsApp${externo}</a>
  </div>
</main>`);
}

export function paginasTenant(t) {
  const ex = escolhaDeExemplo(t);
  const arquivos = {
    'index.html': landing(t),
    'inicio-conectado.html': landing(t, { logado: true }),
    'agendar-profissional.html': agendarProfissional(t),
    'agendar-servicos.html': agendarServicos(t),
    'agendar-horario.html': agendarHorario(t),
    'agendar-confirmar.html': agendarConfirmar(t, { logado: false }),
    'agendar-confirmar-conectado.html': agendarConfirmar(t, { logado: true }),
    'agendar-sucesso.html': agendarSucesso(t),
    'entrar.html': entrar(t),
    'criar-conta.html': criarConta(t),
    'recuperar-senha.html': recuperarSenha(t),
    'nova-senha.html': novaSenha(t),
    'definir-senha.html': definirSenha(t),
    'minha-conta.html': minhaConta(t),
    'meus-agendamentos.html': meusAgendamentos(t),
    'remarcar.html': remarcar(t),
    'termos.html': termos(t),
    'privacidade.html': privacidade(t),
    '404.html': naoEncontrada(t),
    // Arquivos de calendário de exemplo (.ics), em assets/ da raiz (o prefixo "/" diz ao gerador: a partir da raiz)
    [`/assets/exemplo-${t.slug}.ics`]: arquivoIcs(t, { id: `exemplo-${t.slug}`, titulo: nomes(ex.servicos), data: ex.data, ini: ex.ini, fim: ex.fim }),
  };
  for (const a of atendimentosDeAlex(t).proximos) {
    arquivos[`/assets/${a.id}.ics`] = arquivoIcs(t, { id: a.id, titulo: nomes(a.itens), data: dataDe(a.dia), ini: a.ini, fim: a.fim });
  }
  return arquivos;
}

// Telas do salão para o mapa "Telas" (rota real de cada uma)
export function telasDoSalao(t) {
  const s = t.slug;
  return [
    [`${t.nome} · site`, [
      ['Site', `${s}/index.html`, '/'],
      ['Site (conectado)', `${s}/inicio-conectado.html`, '/ (com sessão)'],
      ['Agendar: com quem?', `${s}/agendar-profissional.html`, '/agendar/profissional'],
      ['Agendar: serviços', `${s}/agendar-servicos.html`, '/agendar/servicos'],
      ['Agendar: quando?', `${s}/agendar-horario.html`, '/agendar/horario'],
      ['Confirmar (sem login)', `${s}/agendar-confirmar.html`, '/agendar/confirmar'],
      ['Confirmar (conectado)', `${s}/agendar-confirmar-conectado.html`, '/agendar/confirmar (com sessão)'],
      ['Agendamento confirmado', `${s}/agendar-sucesso.html`, '/agendar/sucesso/[id]'],
      ['Entrar', `${s}/entrar.html`, '/entrar'],
      ['Criar conta', `${s}/criar-conta.html`, '/criar-conta'],
      ['Recuperar senha', `${s}/recuperar-senha.html`, '/recuperar-senha'],
      ['Nova senha', `${s}/nova-senha.html`, '/nova-senha'],
      ['Defina sua senha', `${s}/definir-senha.html`, '/definir-senha'],
      ['Minha conta', `${s}/minha-conta.html`, '/minha-conta'],
      ['Meus agendamentos', `${s}/meus-agendamentos.html`, '/minha-conta/agendamentos'],
      ['Remarcar agendamento', `${s}/remarcar.html`, '/minha-conta/agendamentos/[id]/remarcar'],
      ['Termos de uso', `${s}/termos.html`, '/termos'],
      ['Política de privacidade', `${s}/privacidade.html`, '/privacidade'],
      ['Página não encontrada', `${s}/404.html`, '(qualquer rota inexistente)'],
    ]],
  ];
}
