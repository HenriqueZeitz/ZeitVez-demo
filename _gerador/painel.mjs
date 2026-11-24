// Painel do salão, em dois níveis como no produto real (web/src/app/painel e components/owner, components/agenda):
//  - dono: Agenda, Bloqueios, Meu site, Serviços, Equipe, Horário, Aparência e Regras de agendamento;
//  - profissional (o 3º da equipe, D2 do design): Minha agenda e Meus bloqueios.
// Cada tela copia a estrutura e os textos do componente real citado; os dados vêm do seed (dados.mjs). No protótipo, as
// telas do profissional têm o prefixo "pro-" (o mesmo arquivo não pode ter dois menus).
import { ic, pagina, esc, duracao, somaDias, precoCentavos, formatarTelefone, dataSlotLonga, hora, D0, MESES } from './comum.mjs';
import { STATUS, FONTES, MODOS, agendaDoPeriodo, exemplosDoPainel, bloqueiosDoPainel } from './dados.mjs';
import { escolhaDeExemplo, diasComHorarios } from './agendamento.mjs';
import { opcoesProfissional, formServicos, seletorHorarios, resumoAgendamento } from './tenant.mjs';

const R = '../../';
const SEMANA = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const SEMANA_CURTA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const DIAS_AGENDA = Array.from({ length: 15 }, (_, i) => i - 1); // D0−1 a D0+13 (design D3, ampliado: ver design.md)
const SEMANAS = [0, 7]; // a semana de D0 e a de D0+7 (a das férias do seed)

// ---------- Formatos do produto real (web/src/lib/agenda/dates.ts e text.ts) ----------
const dataDe = (n) => somaDias(D0, n);
const tituloDia = (n) => { const d = dataDe(n); return `${SEMANA[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`; };
const tituloDiaCurto = (n) => { const d = dataDe(n); return `${SEMANA[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]}`; };
const diaSemanaCurto = (n) => { const d = dataDe(n); return `${SEMANA_CURTA[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]}`; };
function tituloSemana(n) {
  const a = dataDe(n), b = dataDe(n + 6);
  return a.getMonth() === b.getMonth()
    ? `${a.getDate()} a ${b.getDate()} de ${MESES[b.getMonth()]} de ${b.getFullYear()}`
    : `${a.getDate()} de ${MESES[a.getMonth()]} a ${b.getDate()} de ${MESES[b.getMonth()]} de ${b.getFullYear()}`;
}
const historico = (a) => (a.concluidos <= 0
  ? 'Nenhum atendimento concluído ainda.'
  : `${a.concluidos === 1 ? '1 atendimento concluído' : `${a.concluidos} atendimentos concluídos`} · último em ${diaSemanaCurto(a.ultimaVisita)}`);
const conflitosTexto = (n) => (n <= 0 ? null : n === 1 ? '1 agendamento neste período precisa ser remarcado' : `${n} agendamentos neste período precisam ser remarcados`);
const periodoBloqueio = (b) => {
  const inicio = diaSemanaCurto(b.de);
  if (b.horario) return `${inicio} · ${b.horario[0]} às ${b.horario[1]}`;
  return b.de === b.ate ? `${inicio} · Dia inteiro` : `${inicio} a ${diaSemanaCurto(b.ate)} · Dia inteiro`;
};
const duracaoRegra = (min) => (min < 60 ? `${min} min` : Number.isInteger(min / 60) ? `${min / 60} ${min === 60 ? 'hora' : 'horas'}` : `${min} min`);

// ---------- Nomes de arquivo (design D1): espelham as rotas reais, numa pasta plana ----------
const pre = (nivel) => (nivel === 'pro' ? 'pro-' : '');
const arqDia = (nivel, n) => `${pre(nivel)}agenda${n === 0 ? '' : `-dia-${n < 0 ? `menos-${-n}` : n}`}.html`;
const arqSemana = (nivel, n) => `${pre(nivel)}agenda-semana${n === 0 ? '' : `-${n}`}.html`;
const arq = (nivel, nome) => `${pre(nivel)}${nome}.html`;

// ---------- Moldura (owner-shell.tsx, owner-nav.tsx, lib/owner/navigation.ts) ----------
const MENU_DONO = [['agenda', 'Agenda', 'agenda.html'], ['bloqueios', 'Bloqueios', 'bloqueios.html'], ['site', 'Meu site', 'site.html'], ['servicos', 'Serviços', 'servicos.html'],
  ['equipe', 'Equipe', 'equipe.html'], ['horario', 'Horário', 'horario.html'], ['aparencia', 'Aparência', 'aparencia.html'], ['regras', 'Regras de agendamento', 'regras.html']];
const MENU_PRO = [['agenda', 'Minha agenda', 'pro-agenda.html'], ['bloqueios', 'Meus bloqueios', 'pro-bloqueios.html']];

function moldura(t, nivel, atual, titulo, conteudo) {
  const itens = (nivel === 'pro' ? MENU_PRO : MENU_DONO).map(([id, rotulo, href]) => {
    const ativo = id === atual;
    return `<a href="${href}"${ativo ? ' aria-current="page"' : ''} class="inline-flex min-h-11 items-center rounded-tema px-3 py-2.5 text-sm font-semibold outline-none ${ativo ? 'bg-primaria-suave text-texto' : 'text-suave hover:bg-superficie-2 hover:text-texto'}">${rotulo}</a>`;
  }).join('\n        ');
  const corpo = `
<a href="#conteudo" class="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded-tema focus:bg-superficie focus:px-3 focus:py-2">Pular para o conteúdo</a>
<div class="flex min-h-screen flex-col lg:flex-row">
  <aside class="border-b border-borda bg-superficie px-4 py-4 lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:self-start lg:overflow-y-auto lg:border-b-0 lg:border-r">
    <div class="flex items-center gap-3 px-1 lg:px-2">
      <span class="monograma">${t.monograma}</span>
      <div class="min-w-0">
        <p class="titulo truncate text-lg leading-tight">${t.nome}</p>
        <p class="text-xs text-suave">Painel do estabelecimento</p>
      </div>
    </div>
    <div class="mt-4 lg:mt-6">
      <nav aria-label="Painel" class="flex flex-wrap gap-1 lg:flex-col">
        ${itens}
      </nav>
    </div>
    <div class="mt-4 flex flex-wrap items-center gap-2 border-t border-borda pt-4 lg:flex-col lg:items-stretch">
      <a href="../index.html" class="inline-flex min-h-11 items-center gap-2 rounded-tema px-3 text-sm font-semibold text-suave hover:bg-superficie-2 hover:text-texto">${ic('externo', 'h-4 w-4')} Ver meu site</a>
      <a href="../index.html" class="inline-flex min-h-11 items-center gap-2 rounded-tema px-3 text-sm font-semibold text-suave hover:bg-superficie-2 hover:text-texto">${ic('sair', 'h-4 w-4')} Sair</a>
    </div>
  </aside>

  <main id="conteudo" tabindex="-1" class="min-w-0 flex-1 px-4 pb-20 pt-6 outline-none sm:px-8 sm:pt-8">
    <div class="mx-auto max-w-3xl">
${conteudo}
    </div>
  </main>
</div>`;
  return pagina({ titulo: `${titulo} · Painel · ${t.nome}`, raiz: R, tema: '../tema.css', corpo });
}

// ---------- Peças das telas (owner-page.tsx, form-controls.tsx) ----------
const cabecalho = (titulo, descricao) => `<header class="mb-6">
      <h1 class="titulo text-3xl sm:text-4xl">${titulo}</h1>
      <p class="mt-1 text-suave">${descricao}</p>
    </header>`;
const cartaoPainel = (conteudo) => `<div class="cartao p-5 sm:p-7">${conteudo}</div>`;
const espaco = '<div class="h-6" aria-hidden="true"></div>';

const campo = ({ id, rotulo, valor = '', tipo = 'text', dica = '', placeholder = '' }) => `<div class="space-y-1.5">
          <label class="campo-rotulo !mb-0" for="${id}">${rotulo}</label>
          <input class="campo" id="${id}" name="${id}" type="${tipo}" autocomplete="off"${valor !== '' ? ` value="${esc(valor)}"` : ''}${placeholder ? ` placeholder="${placeholder}"` : ''}${dica ? ` aria-describedby="${id}-ajuda"` : ''}>
          ${dica ? `<p id="${id}-ajuda" class="text-sm text-suave">${dica}</p>` : ''}
        </div>`;
const areaTexto = ({ id, rotulo, valor = '', linhas = 3, dica = '' }) => `<div class="space-y-1.5">
          <label class="campo-rotulo !mb-0" for="${id}">${rotulo}</label>
          <textarea class="campo" id="${id}" name="${id}" rows="${linhas}"${dica ? ` aria-describedby="${id}-ajuda"` : ''}>${esc(valor)}</textarea>
          ${dica ? `<p id="${id}-ajuda" class="text-sm text-suave">${dica}</p>` : ''}
        </div>`;
const selecao = ({ id, rotulo, opcoes, valor, dica = '', extra = '' }) => `<div class="space-y-1.5">
          <label class="campo-rotulo !mb-0" for="${id}">${rotulo}</label>
          <select class="campo" id="${id}" name="${id}"${extra}${dica ? ` aria-describedby="${id}-ajuda"` : ''}>
            ${opcoes.map(([v, r, attrs = '']) => `<option value="${v}"${String(v) === String(valor) ? ' selected' : ''}${attrs}>${r}</option>`).join('\n            ')}
          </select>
          ${dica ? `<p id="${id}-ajuda" class="text-sm text-suave">${dica}</p>` : ''}
        </div>`;
const caixaMarcar = ({ id, rotulo, marcado = false, descricao = '' }) => `<div class="flex items-start gap-3 text-sm">
          <input type="checkbox" class="caixa-marcar mt-0.5" id="${id}" name="${id}"${marcado ? ' checked' : ''}>
          <div><label for="${id}" class="font-medium">${rotulo}</label>${descricao ? `<p class="text-suave">${descricao}</p>` : ''}</div>
        </div>`;
const formulario = (destino, conteudo, classe = 'space-y-6') => `<form class="${classe}" action="${destino}" data-ir="${destino}" novalidate>
${conteudo}
      </form>`;
const botaoEnviar = (rotulo) => `<button type="submit" class="btn btn-primario">${rotulo}</button>`;
const linkVoltar = (href, rotulo = 'Voltar') => `<a href="${href}" class="btn btn-secundario">${rotulo}</a>`;
const botaoNovo = (href, rotulo) => `<a href="${href}" class="btn btn-primario">${ic('mais', 'h-4 w-4')} ${rotulo}</a>`;
const emblema = (texto) => `<span class="rounded-full border border-borda bg-fundo px-2.5 py-0.5 text-xs font-semibold">${texto}</span>`;
const vazio = (titulo, acao = '') => `<div class="rounded-xl border border-dashed border-borda p-8 text-center">
        <p class="titulo text-lg">${titulo}</p>
        ${acao ? `<div class="mt-4">${acao}</div>` : ''}
      </div>`;

// Envio de imagem (image-upload.tsx) sem imagem nenhuma: o seed não tem logo, capa nem fotos (design D8)
const envioImagem = ({ id, rotulo, dica, vazioTexto, caixa }) => `<div class="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div class="flex shrink-0 items-center justify-center overflow-hidden rounded-tema border border-borda bg-superficie-2 ${caixa}"><span class="px-2 text-center text-xs text-suave">${vazioTexto}</span></div>
        <div class="min-w-0 flex-1 space-y-1.5">
          <label class="campo-rotulo !mb-0" for="${id}">${rotulo}</label>
          <input class="campo" id="${id}" type="file" accept="image/jpeg,image/png,image/webp" aria-describedby="${id}-ajuda">
          <p id="${id}-ajuda" class="text-sm text-suave">${dica}</p>
          <div class="pt-1.5"><button type="button" class="btn btn-secundario">Enviar</button></div>
        </div>
      </div>`;

// ---------- Agenda (agenda/page.tsx, agenda-toolbar.tsx, appointment-row.tsx, appointment-actions.tsx, pending-closure.tsx) ----------
/** Quais botões valem para o estado mostrado (AppointmentTransitions da API); o app.js repete esta tabela ao trocar o selo. */
function acoesPermitidas(exibicao, dono) {
  const iniciado = exibicao === 'andamento' || exibicao === 'a-conferir';
  const aberto = exibicao === 'confirmado' || iniciado;
  return {
    complete: iniciado || exibicao === 'nao-compareceu',
    'no-show': iniciado || exibicao === 'concluido',
    cancel: aberto,
    reschedule: aberto,
    'change-professional': aberto && dono,
  };
}

function linhaAgenda(t, a, nivel) {
  const dono = nivel === 'dono';
  const [rotulo, classe] = STATUS[a.exibicao];
  const cli = a.cliente;
  const duracaoTotal = a.itens.reduce((n, x) => n + x.dur, 0);
  const preco = precoCentavos(a.cents, a.aPartir);
  const servicos = a.itens.map((x) => x.nome).join(' + ');
  const permitidas = acoesPermitidas(a.exibicao, dono);
  const canal = a.canal === 'Counter' ? `Agendado no balcão por ${a.lancadoPor?.nome ?? 'a equipe'}` : 'Agendado pelo site';
  const destinoRemarcar = arq(nivel, 'remarcar');
  const botao = (acao, classeBtn, texto, rotuloAria) => `<button type="button" class="btn ${classeBtn}" data-acao="${acao}" aria-label="${rotuloAria}"${permitidas[acao] ? '' : ' hidden'}>${texto}</button>`;
  const link = (acao, href, texto, rotuloAria) => `<a href="${href}" class="btn btn-secundario" data-acao="${acao}" aria-label="${rotuloAria}"${permitidas[acao] ? '' : ' hidden'}>${texto}</a>`;
  return `<li data-agendamento data-status="${a.exibicao}" data-pro="${a.pro}" data-nivel="${nivel}">
          <details class="acordeao cartao">
            <summary class="flex cursor-pointer items-start gap-3 rounded-tema-lg p-4">
              <div class="w-16 shrink-0 sm:w-20">
                <p class="titulo text-lg leading-tight">${hora(a.ini)}</p>
                <p class="text-xs text-suave">até ${hora(a.fim)}</p>
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="selo ${classe}" data-selo>${rotulo}</span>${a.dentroDeBloqueio ? `
                  <span class="selo selo-erro">Dentro de um bloqueio</span>` : ''}
                </div>
                <p class="mt-1 break-words font-semibold">${cli.nome}${cli.semConta ? '<span class="font-normal text-suave"> · sem conta</span>' : ''}</p>
                <p class="break-words text-sm text-suave">${servicos} · ${duracao(duracaoTotal)} · ${preco}${dono ? ` · ${a.profissional.nome}` : ''}</p>
              </div>
              <span class="acordeao-seta mt-1 shrink-0 text-suave">${ic('baixo', 'h-5 w-5')}</span>
            </summary>
            <div class="space-y-4 border-t border-borda p-4">
              <section aria-label="Cliente: ${cli.nome}" class="space-y-2">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="text-sm font-semibold">${formatarTelefone(cli.tel)}</span>
                  <a href="https://wa.me/${cli.tel}" target="_blank" rel="noopener noreferrer" class="btn btn-secundario">${ic('whatsapp', 'h-4 w-4')} WhatsApp<span class="sr-only"> (abre em outra aba)</span></a>
                  <a href="tel:+${cli.tel}" class="btn btn-secundario">${ic('telefone', 'h-4 w-4')} Ligar</a>
                </div>${cli.semConta ? '\n                <p class="text-sm text-suave">Cliente de balcão, sem conta.</p>' : ''}
                <p class="text-sm text-suave">${historico(a)}</p>
              </section>
              <section aria-label="Serviços">
                <ul class="divide-y divide-borda rounded-tema border border-borda text-sm">
                  ${a.itens.map((x) => `<li class="flex justify-between gap-3 px-3 py-2"><span class="min-w-0 break-words">${x.nome}</span><span class="shrink-0 text-suave">${duracao(x.dur)} · ${precoCentavos(x.cents, x.aPartir)}</span></li>`).join('\n                  ')}
                  <li class="flex justify-between gap-3 bg-superficie-2 px-3 py-2 font-semibold"><span>Total · ${duracao(duracaoTotal)}</span><span>${preco}</span></li>
                </ul>
              </section>${a.obs ? `
              <p class="break-words rounded-tema bg-superficie-2 p-3 text-sm"><span class="font-semibold">Observação do cliente: </span>${a.obs}</p>` : ''}
              <p class="text-sm text-suave">${canal}${dono ? '' : ` · com ${a.profissional.nome}`}</p>
              <div class="space-y-3">
                <div class="flex flex-wrap gap-2">
                  ${botao('complete', 'btn-primario', 'Concluir', `Concluir o atendimento de ${cli.nome}`)}
                  ${botao('no-show', 'btn-secundario', 'Não compareceu', `Marcar que ${cli.nome} não compareceu`)}
                  ${botao('cancel', 'btn-secundario', 'Cancelar', `Cancelar o atendimento de ${cli.nome}`)}
                  ${link('reschedule', destinoRemarcar, 'Remarcar', `Remarcar o atendimento de ${cli.nome}`)}${dono ? `
                  ${link('change-professional', `${destinoRemarcar}#profissional`, 'Trocar profissional', `Trocar o profissional do atendimento de ${cli.nome}`)}` : ''}
                </div>
                <p class="text-sm text-suave" data-sem-acoes${Object.values(permitidas).some(Boolean) ? ' hidden' : ''}>Este atendimento não tem mais ações.</p>
              </div>
            </div>
          </details>
        </li>`;
}

const contador = (chave, n, singular, plural, destaque = false) => `<div class="cartao p-3${destaque ? ' contador-alerta' : ''}" data-contador="${chave}" data-singular="${singular}" data-plural="${plural}">
          <p class="font-semibold" data-texto>${`${n} ${n === 1 ? singular : plural}`}</p>
        </div>`;

function barraDaAgenda(t, nivel, { dia, semana }) {
  const visao = semana !== null ? 'semana' : 'dia';
  const titulo = visao === 'semana' ? tituloSemana(semana) : tituloDia(dia);
  const atual = visao === 'semana' ? arqSemana(nivel, semana) : arqDia(nivel, dia);
  const hoje = visao === 'semana' ? arqSemana(nivel, 0) : arqDia(nivel, 0);
  const vizinho = (delta) => (visao === 'semana'
    ? arqSemana(nivel, SEMANAS.includes(semana + delta) ? semana + delta : semana)
    : arqDia(nivel, DIAS_AGENDA.includes(dia + delta) ? dia + delta : dia));
  const unidade = visao === 'semana' ? 'semana' : 'dia';
  const Unidade = visao === 'semana' ? 'Semana' : 'Dia';
  const pilula = (v, rotulo) => `<a href="${v === visao ? atual : v === 'dia' ? arqDia(nivel, 0) : arqSemana(nivel, 0)}"${v === visao ? ' aria-current="page"' : ''} class="chip inline-flex min-h-11 items-center px-4 text-sm font-semibold">${rotulo}</a>`;
  return `<div class="space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <h2 class="titulo text-2xl first-letter:uppercase sm:text-3xl" aria-live="polite">${titulo}</h2>
          ${botaoNovo(arq(nivel, 'novo-agendamento'), 'Novo agendamento')}
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <a href="${vizinho(visao === 'semana' ? -7 : -1)}" class="btn btn-secundario" aria-label="${Unidade} anterior">${ic('esquerda', 'h-4 w-4')}<span class="hidden sm:inline">${Unidade} anterior</span></a>
          <a href="${hoje}" class="btn btn-secundario"${(visao === 'dia' ? dia === 0 : semana === 0) ? ' aria-current="date"' : ''}>Hoje</a>
          <a href="${vizinho(visao === 'semana' ? 7 : 1)}" class="btn btn-secundario" aria-label="${Unidade} seguinte"><span class="hidden sm:inline">${unidade === 'dia' ? 'Dia seguinte' : 'Semana seguinte'}</span>${ic('direita', 'h-4 w-4')}</a>
          <nav aria-label="Visão da agenda" class="ml-auto flex gap-1">
            ${pilula('dia', 'Dia')}
            ${pilula('semana', 'Semana')}
          </nav>
        </div>${nivel === 'dono' ? `
        <nav aria-label="Filtrar por profissional" class="flex flex-wrap gap-2" data-filtro-profissional>
          <button type="button" class="chip inline-flex min-h-11 items-center px-4 text-sm font-semibold" aria-pressed="true" data-profissional="todos">Todos</button>
          ${t.equipe.map((p) => `<button type="button" class="chip inline-flex min-h-11 items-center px-4 text-sm font-semibold" aria-pressed="false" data-profissional="${p.key}">${p.nome}</button>`).join('\n          ')}
        </nav>` : ''}
      </div>`;
}

function paginaAgenda(t, nivel, { dia = null, semana = null }) {
  const ex = exemplosDoPainel(t);
  const dono = nivel === 'dono';
  const dias = semana !== null ? Array.from({ length: 7 }, (_, i) => semana + i) : [dia];
  const agenda = agendaDoPeriodo(t, dias, dono ? null : ex.profissional.key);
  const { contadores: c } = agenda;
  const lista = (itens) => `<ul class="space-y-3">
        ${itens.map((a) => linhaAgenda(t, a, nivel)).join('\n        ')}
      </ul>`;
  const corpoLista = semana === null
    ? (agenda.todos.length === 0
      ? vazio('Nenhum atendimento neste dia.', botaoNovo(arq(nivel, 'novo-agendamento'), 'Novo agendamento'))
      : lista(agenda.todos))
    : `<div class="space-y-6">
        ${agenda.porDia.map(({ dia: n, itens }) => `<section aria-labelledby="dia-${n}">
          <h2 id="dia-${n}" class="titulo mb-2 text-lg"><a href="${arqDia(nivel, n)}" class="underline-offset-4 hover:underline">${tituloDiaCurto(n)}</a></h2>
          ${itens.length === 0 ? '<p class="rounded-xl border border-dashed border-borda p-4 text-sm text-suave">Sem atendimentos</p>' : lista(itens)}
        </section>`).join('\n        ')}
      </div>`;
  const titulo = dono ? 'Agenda' : `Minha agenda · ${ex.profissional.nome}`;
  const conteudo = `
    ${cabecalho(titulo, dono ? 'Os atendimentos do salão, por dia ou por semana.' : 'Os seus atendimentos, por dia ou por semana.')}

    <div class="space-y-5" data-status-mapa="${esc(JSON.stringify(STATUS))}">
      <div role="status" aria-live="polite" class="rounded-tema text-sm" data-aviso-painel data-avisos="${esc(JSON.stringify({ remarcado: 'Atendimento remarcado.', criado: 'Agendamento criado.' }))}"></div>

      ${barraDaAgenda(t, nivel, { dia, semana })}

      <div role="group" aria-label="Resumo do período" class="grid grid-cols-2 gap-2 sm:grid-cols-4">
        ${contador('total', c.total, 'agendamento', 'agendamentos')}
        ${contador('atender', c.aAtender, 'a atender', 'a atender')}
        ${contador('concluidos', c.concluidos, 'concluído', 'concluídos')}
        ${contador('conferir', c.aConferir, 'a conferir', 'a conferir', c.aConferir > 0)}
      </div>
${semana === null ? `
      <div data-aviso-conferir${c.aConferir > 0 ? '' : ' hidden'}>
        <button type="button" class="btn btn-primario" data-concluir-todos>Concluir todos (<span data-conta-conferir>${c.aConferir}</span>)</button>
      </div>
` : ''}
      ${corpoLista}
    </div>`;
  return moldura(t, nivel, 'agenda', semana !== null ? 'Agenda da semana' : 'Agenda', conteudo);
}

// ---------- Remarcar atendimento (agenda/[id]/remarcar/page.tsx) ----------
function paginaRemarcar(t, nivel) {
  const ex = exemplosDoPainel(t);
  const dono = nivel === 'dono';
  const a = dono ? ex.remarcarDono : ex.remarcarPro;
  const cliente = t.clientes[a.cli];
  const pro = t.equipe.find((p) => p.key === a.pro);
  const itens = a.itens.map((x) => x.nome).join(' + ');
  const dias = diasComHorarios(t, a.pro, a.fim - a.ini, [], { dias: 14, incluir: { dia: a.dia, ini: a.ini } });
  const profissional = dono ? `
        <section id="profissional" aria-labelledby="titulo-profissional" class="mt-6 scroll-mt-6">
          <h2 id="titulo-profissional" class="titulo text-xl">Profissional</h2>
          <nav aria-label="Escolher o profissional" class="mt-3 flex flex-wrap gap-2">
            ${t.equipe.map((p) => `<a href="${arq(nivel, 'remarcar')}#profissional"${p.key === a.pro ? ' aria-current="page"' : ''} class="chip inline-flex min-h-11 items-center px-4 text-sm font-semibold">${p.nome}</a>`).join('\n            ')}
          </nav>
        </section>` : '';
  const conteudo = `
    ${cabecalho('Remarcar atendimento', `${cliente.nome} · escolha o novo horário.`)}
    ${cartaoPainel(`
        <p>Atual: ${itens}, ${dataSlotLonga(dataDe(a.dia), a.ini)}, com ${pro.nome}.</p>${profissional}
        ${seletorHorarios(dias, { atual: { dia: a.dia, ini: a.ini }, destino: `${arq(nivel, 'agenda')}?aviso=remarcado` })}
        <a href="${arqDia(nivel, a.dia)}" class="btn btn-secundario mt-8">${ic('esquerda', 'h-4 w-4')} Voltar para a agenda</a>`)}`;
  return moldura(t, nivel, 'agenda', 'Remarcar atendimento', conteudo);
}

// ---------- Novo agendamento no balcão (agenda/novo/page.tsx, counter-customer-form.tsx) ----------
const ETAPAS_BALCAO = ['novo-agendamento', 'novo-agendamento-servicos', 'novo-agendamento-horario', 'novo-agendamento-cliente'];
const TITULOS_BALCAO = ['Com quem?', 'Quais serviços?', 'Quando?', 'Para quem?'];

function paginaBalcao(t, nivel, etapa) {
  const ex = escolhaDeExemplo(t);
  const exemplos = exemplosDoPainel(t);
  const proxima = arq(nivel, ETAPAS_BALCAO[etapa + 1] ?? 'agenda');
  const voltar = etapa === 0 ? arq(nivel, 'agenda') : arq(nivel, ETAPAS_BALCAO[etapa - 1]);
  let miolo;
  if (etapa === 0) miolo = opcoesProfissional(t, { destino: proxima, semPreferencia: 'O salão escolhe quem atende no horário escolhido.' });
  else if (etapa === 1) miolo = formServicos(t, { destino: proxima });
  else if (etapa === 2) {
    const dias = diasComHorarios(t, ex.pro.key, ex.tot.dur, [], { dias: 14 });
    miolo = seletorHorarios(dias, { atual: { dia: ex.dia, ini: ex.ini }, destino: proxima });
  } else {
    const cli = exemplos.clienteBalcao;
    const concluidos = t.agendamentos.filter((x) => x.cli === cli.key && x.st === 'Completed').length;
    const destino = `${arq(nivel, 'agenda')}?aviso=criado`;
    const historicoCliente = concluidos > 0 ? (concluidos === 1 ? '1 atendimento concluído' : `${concluidos} atendimentos concluídos`) : 'Nenhum atendimento concluído ainda.';
    miolo = `<div class="mt-4 overflow-hidden rounded-xl border border-borda">${resumoAgendamento(t, ex)}</div>
      ${formulario(destino, `
        <section aria-labelledby="titulo-cliente" class="space-y-4">
          <h2 id="titulo-cliente" class="titulo text-xl">Cliente</h2>
          <div class="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div class="flex-1">${campo({ id: 'celular', rotulo: 'Celular do cliente', tipo: 'tel', valor: formatarTelefone(cli.tel), dica: 'Com DDD. Se a pessoa já veio antes, a busca acha o cadastro.' })}</div>
            <button type="button" class="btn btn-secundario">Buscar cliente</button>
          </div>
          <fieldset>
            <legend class="mb-2 text-sm font-semibold">Clientes encontrados</legend>
            <ul class="grid gap-2">
              <li><label class="opcao ativo flex min-h-14 cursor-pointer items-start gap-3 p-3" data-opcao-radio><input type="radio" name="cliente" class="caixa-marcar mt-1" checked><span class="min-w-0"><span class="block break-words font-semibold">${cli.nome}</span><span class="block text-sm text-suave">${cli.semConta ? 'Cliente de balcão, sem conta' : 'Tem conta'} · ${historicoCliente}</span></span></label></li>
              <li><label class="opcao flex min-h-14 cursor-pointer items-start gap-3 p-3" data-opcao-radio><input type="radio" name="cliente" class="caixa-marcar mt-1"><span class="min-w-0"><span class="block font-semibold">É outra pessoa</span><span class="block text-sm text-suave">Cadastrar um cliente novo com este celular.</span></span></label></li>
            </ul>
          </fieldset>
        </section>
        ${campo({ id: 'observacao', rotulo: 'Observação (opcional)', dica: 'Aparece no detalhe do atendimento, só para a equipe.' })}
        ${botaoEnviar('Confirmar agendamento')}`, 'mt-6 space-y-6')}`;
  }
  const conteudo = `
    ${cabecalho('Novo agendamento', 'Para quem chega ao balcão ou liga para o salão.')}
    ${cartaoPainel(`
        <div class="flex items-center justify-between gap-4">
          <a href="${voltar}" class="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-suave hover:text-texto">${ic('esquerda', 'h-4 w-4')} Voltar</a>
          <span class="text-sm text-suave">Passo ${etapa + 1} de 4</span>
        </div>
        <h2 class="titulo mt-2 text-2xl">${TITULOS_BALCAO[etapa]}</h2>
        ${miolo}`)}`;
  return moldura(t, nivel, 'agenda', 'Novo agendamento', conteudo);
}

// ---------- Bloqueios (bloqueios/page.tsx, blocks-list.tsx, block-form.tsx) ----------
function paginaBloqueios(t, nivel) {
  const ex = exemplosDoPainel(t);
  const dono = nivel === 'dono';
  const lista = bloqueiosDoPainel(t, dono ? null : ex.profissional.key);
  const verNaAgenda = (b) => {
    if (b.de === b.ate) return DIAS_AGENDA.includes(b.de) ? arqDia(nivel, b.de) : arq(nivel, 'agenda');
    return arqSemana(nivel, SEMANAS.filter((s) => s <= b.de).at(-1) ?? 0);
  };
  const item = (b) => {
    const quem = b.quem === 'salao' ? 'Salão todo' : t.equipe.find((p) => p.key === b.quem).nome;
    const conflitos = conflitosTexto(b.conflitos);
    return `<li class="cartao p-4 sm:p-5">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div class="min-w-0 space-y-1">
              <h3 class="titulo break-words text-lg">${quem}${b.motivo ? `<span class="font-corpo text-base font-normal text-suave"> · ${b.motivo}</span>` : ''}</h3>
              <p class="text-sm">${periodoBloqueio(b)}</p>
              <p class="text-sm text-suave">Criado por ${b.criadoPor}</p>${conflitos ? `
              <p class="text-sm font-semibold" style="color: var(--cor-erro-texto)">${conflitos}. <a href="${verNaAgenda(b)}" class="underline underline-offset-4">Ver na agenda</a></p>` : ''}
            </div>${b.pode ? `
            <div class="shrink-0"><button type="button" class="btn btn-secundario" data-remover-item aria-label="Remover o bloqueio de ${quem}">Remover</button></div>` : ''}
          </div>
        </li>`;
  };
  const quemCampo = dono
    ? selecao({ id: 'quem', rotulo: 'Quem', valor: '', opcoes: [['', 'Salão todo'], ...t.equipe.map((p) => [p.key, p.nome])] })
    : '';
  const conteudo = `
    ${cabecalho(dono ? 'Bloqueios' : 'Meus bloqueios', 'Períodos em que não há atendimento. O site deixa de oferecer esses horários.')}
    <div class="space-y-8">
      <section aria-labelledby="titulo-lista" class="space-y-3">
        <h2 id="titulo-lista" class="titulo text-xl">Por vir</h2>
        <ul class="space-y-3">
        ${lista.map(item).join('\n        ')}
        </ul>
      </section>
      ${cartaoPainel(`
        <h2 class="titulo mb-4 text-xl">Novo bloqueio</h2>
        ${formulario(arq(nivel, 'bloqueios'), `
        ${quemCampo}
        <fieldset class="space-y-2">
          <legend class="text-sm font-semibold">Tipo</legend>
          <div class="flex flex-wrap gap-2">
            <label class="chip inline-flex min-h-11 cursor-pointer items-center gap-2 px-4 text-sm font-semibold"><input type="radio" name="tipo" value="horas" class="caixa-marcar" data-revela="bloqueio-horas" checked> Algumas horas</label>
            <label class="chip inline-flex min-h-11 cursor-pointer items-center gap-2 px-4 text-sm font-semibold"><input type="radio" name="tipo" value="dias" class="caixa-marcar" data-revela="bloqueio-dias"> Dias inteiros</label>
          </div>
        </fieldset>
        <div id="bloqueio-horas" class="grid gap-4 sm:grid-cols-3">
          ${campo({ id: 'dia', rotulo: 'Dia', tipo: 'date' })}
          ${campo({ id: 'das', rotulo: 'Das', tipo: 'time' })}
          ${campo({ id: 'ate-hora', rotulo: 'Até', tipo: 'time' })}
        </div>
        <div id="bloqueio-dias" class="grid gap-4 sm:grid-cols-2" hidden>
          ${campo({ id: 'de-dia', rotulo: 'De (primeiro dia)', tipo: 'date' })}
          ${campo({ id: 'ate-dia', rotulo: 'Até (último dia)', tipo: 'date', dica: 'O último dia também fica bloqueado. No máximo 60 dias.' })}
        </div>
        ${campo({ id: 'motivo', rotulo: 'Motivo (opcional)', dica: 'Só a equipe vê.' })}
        ${botaoEnviar('Criar bloqueio')}`, 'space-y-5')}`)}
    </div>`;
  return moldura(t, nivel, 'bloqueios', dono ? 'Bloqueios' : 'Meus bloqueios', conteudo);
}

// ---------- Meu site (site/page.tsx, site-form.tsx) ----------
const UFS = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];

function paginaSite(t) {
  const conteudo = `
    ${cabecalho('Meu site', 'Os textos e os contatos que aparecem na página do seu salão.')}
    ${cartaoPainel(`
        <h2 class="titulo text-xl">Logo e capa</h2>
        <p class="mb-4 mt-1 text-sm text-suave">As imagens do seu site. Sem logo, aparece a inicial do nome; sem capa, um fundo com as cores do site.</p>
        <div class="grid gap-4 lg:grid-cols-2">
          ${envioImagem({ id: 'logo', rotulo: 'Logo', dica: 'JPEG, PNG ou WebP, até 5 MB. Fundo transparente funciona melhor (PNG ou WebP). Aparece pequeno, no topo e no rodapé.', vazioTexto: 'Sem logo', caixa: 'h-24 w-24' })}
          ${envioImagem({ id: 'capa', rotulo: 'Capa', dica: 'JPEG, PNG ou WebP, até 5 MB. Uma foto em pé funciona melhor (proporção 4:5). Se for larga, as pontas podem ser cortadas na exibição.', vazioTexto: 'Sem capa', caixa: 'aspect-[4/5] w-24' })}
        </div>`)}
    ${espaco}
    ${cartaoPainel(formulario('site.html', `
        <fieldset class="space-y-5">
          <legend class="titulo mb-1 text-xl">O salão</legend>
          ${campo({ id: 'name', rotulo: 'Nome do salão', valor: t.nome, dica: 'De 2 a 80 caracteres.' })}
          ${campo({ id: 'tagline', rotulo: 'Frase de destaque', valor: t.tagline, dica: 'A frase grande do topo do site. Até 60 caracteres.' })}
          ${areaTexto({ id: 'heroText', rotulo: 'Texto do topo', valor: t.descricaoHero, linhas: 3, dica: 'Uma apresentação curta, logo abaixo da frase de destaque.' })}
          ${areaTexto({ id: 'aboutText', rotulo: 'Sobre', valor: t.sobre.join('\n\n'), linhas: 6, dica: 'Opcional. Deixe uma linha em branco entre um parágrafo e outro.' })}
          ${areaTexto({ id: 'highlights', rotulo: 'Destaques', valor: t.destaques.join('\n'), linhas: 5, dica: 'Opcional. Um por linha, até 6 destaques de até 40 caracteres (ex.: Desde 2016, Café e Wi-Fi).' })}
          ${campo({ id: 'coverCaption', rotulo: 'Legenda da capa', valor: t.capa, dica: 'Opcional. Aparece sobre a foto de capa e descreve a imagem. Até 80 caracteres.' })}
        </fieldset>
        <fieldset class="space-y-5">
          <legend class="titulo mb-1 text-xl">Contato</legend>
          ${campo({ id: 'phone', rotulo: 'Telefone', tipo: 'tel', valor: t.telefone, dica: 'Com DDD, ex.: (11) 3000-0101. Opcional.' })}
          ${campo({ id: 'whatsapp', rotulo: 'WhatsApp', tipo: 'tel', valor: t.whatsapp, dica: 'Com DDD, ex.: (11) 90000-0101. É o botão principal do site. Opcional.' })}
          ${campo({ id: 'email', rotulo: 'E-mail', tipo: 'email', valor: t.email, dica: 'Opcional.' })}
          ${campo({ id: 'instagram', rotulo: 'Instagram', valor: t.instagram, dica: 'O usuário (@studioaurora) ou o link do perfil. Opcional.' })}
        </fieldset>
        <fieldset class="space-y-5">
          <legend class="titulo mb-1 text-xl">Endereço</legend>
          ${campo({ id: 'addressLine', rotulo: 'Endereço', valor: t.endereco, dica: 'Rua, número e bairro. Opcional, até 150 caracteres.' })}
          <div class="grid gap-5 sm:grid-cols-[1fr_8rem]">
            ${campo({ id: 'city', rotulo: 'Cidade', valor: t.cidadeNome })}
            ${selecao({ id: 'state', rotulo: 'UF', valor: t.uf, opcoes: [['', '—'], ...UFS.map((u) => [u, u])] })}
          </div>
        </fieldset>
        ${botaoEnviar('Salvar alterações')}`))}`;
  return moldura(t, 'dono', 'site', 'Meu site', conteudo);
}

// ---------- Serviços (servicos/*, services-list.tsx, service-form.tsx) ----------
function formServico({ destino, servico = null, rotuloBotao }) {
  return formulario(destino, `
        ${campo({ id: 'name', rotulo: 'Nome do serviço', valor: servico?.nome ?? '', dica: 'Ex.: Corte e finalização. Até 80 caracteres, sem repetir o nome de outro serviço.' })}
        ${areaTexto({ id: 'description', rotulo: 'Descrição (opcional)', valor: servico?.desc ?? '', linhas: 3, dica: 'Uma frase curta que aparece no site, embaixo do nome.' })}
        <div class="grid gap-5 sm:grid-cols-2">
          ${campo({ id: 'durationMinutes', rotulo: 'Duração, em minutos', valor: servico ? String(servico.dur) : '', dica: 'De 5 a 600 minutos. Ex.: 60.' })}
          ${campo({ id: 'price', rotulo: 'Preço, em reais', valor: servico ? (servico.cents / 100).toFixed(2).replace('.', ',') : '', dica: 'Ex.: 45 ou 45,00.' })}
        </div>
        ${caixaMarcar({ id: 'priceIsFrom', rotulo: 'Mostrar “a partir de” no preço', marcado: !!servico?.aPartir, descricao: 'Use quando o valor varia, como na coloração: o site mostra “a partir de” antes do preço.' })}
        <div class="flex flex-wrap gap-3">
          ${botaoEnviar(rotuloBotao)}
          ${linkVoltar('servicos.html')}
        </div>`);
}

function paginaServicos(t) {
  const n = t.servicos.length;
  const mover = (i) => `${i > 0 ? `<button type="button" class="btn btn-secundario" aria-label="Subir ${t.servicos[i].nome}">Subir</button>` : ''}${i < n - 1 ? `<button type="button" class="btn btn-secundario" aria-label="Descer ${t.servicos[i].nome}">Descer</button>` : ''}`;
  const conteudo = `
    ${cabecalho('Serviços', 'Os serviços que o salão oferece, na ordem em que aparecem no site. Um serviço desativado sai do site, mas fica aqui para reativar.')}
    <div class="space-y-5">
      <div role="status" aria-live="polite" class="rounded-tema text-sm"></div>
      ${botaoNovo('servico-novo.html', 'Novo serviço')}
      <ul class="space-y-3">
        ${t.servicos.map((s, i) => `<li class="cartao p-4 sm:p-5">
          <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-2"><h2 class="titulo break-words text-lg">${s.nome}</h2></div>
              <p class="mt-1 text-sm text-suave">${duracao(s.dur)} · ${precoCentavos(s.cents, s.aPartir)}</p>
            </div>
            <div class="flex flex-wrap gap-2 md:shrink-0 md:justify-end">
              <a href="servico.html" class="btn btn-secundario" aria-label="Editar ${s.nome}">Editar</a>
              ${mover(i)}
              <button type="button" class="btn btn-secundario" aria-label="Desativar ${s.nome}">Desativar</button>
            </div>
          </div>
        </li>`).join('\n        ')}
      </ul>
    </div>`;
  return moldura(t, 'dono', 'servicos', 'Serviços', conteudo);
}

function paginaServicoNovo(t) {
  const conteudo = `
    ${cabecalho('Novo serviço', 'Preencha os dados do serviço. Ele entra no fim da lista e já aparece no seu site. Você pode enviar a foto depois de criar.')}
    ${cartaoPainel(formServico({ destino: 'servicos.html', rotuloBotao: 'Salvar' }))}`;
  return moldura(t, 'dono', 'servicos', 'Novo serviço', conteudo);
}

function paginaServico(t) {
  const s = exemplosDoPainel(t).servico;
  const conteudo = `
    ${cabecalho('Editar serviço', s.nome)}
    ${cartaoPainel(formServico({ destino: 'servico.html', servico: s, rotuloBotao: 'Salvar alterações' }))}
    ${espaco}
    ${cartaoPainel(`
        <h2 class="titulo text-xl">Foto</h2>
        <p class="mb-4 mt-1 text-sm text-suave">Aparece no cartão do serviço em &ldquo;O que fazemos&rdquo;. A foto é salva na hora, sem precisar salvar o formulário.</p>
        ${envioImagem({ id: 'foto', rotulo: 'Foto do serviço', dica: 'JPEG, PNG ou WebP, até 5 MB. Uma foto na horizontal funciona melhor (proporção 4:3); nas pontas pode haver corte.', vazioTexto: 'Sem foto', caixa: 'aspect-[4/3] w-32' })}`)}`;
  return moldura(t, 'dono', 'servicos', 'Editar serviço', conteudo);
}

// ---------- Equipe (equipe/*, team-list.tsx, professional-*.tsx, schedule-form.tsx) ----------
function paginaEquipe(t) {
  const n = t.equipe.length;
  const link = (href, texto, aria) => `<a href="${href}" class="btn btn-secundario" aria-label="${aria}">${texto}</a>`;
  const conteudo = `
    ${cabecalho('Equipe', 'Quem atende no salão, na ordem em que aparece no site. Quem não faz nenhum serviço (como a recepção) não aparece no site, e quem está desativado também não.')}
    <div class="space-y-5">
      <div role="status" aria-live="polite" class="rounded-tema text-sm"></div>
      ${botaoNovo('profissional-novo.html', 'Novo profissional')}
      <ul class="space-y-3">
        ${t.equipe.map((p, i) => `<li class="cartao p-4 sm:p-5">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-2"><h2 class="titulo break-words text-lg">${p.nome}</h2>${p.dono ? emblema('Você') : ''}</div>
              <p class="mt-1 break-words text-sm text-suave">${p.papel}</p>
            </div>
            <div class="flex flex-wrap gap-2 lg:shrink-0 lg:justify-end">
              ${link('profissional.html', 'Editar', `Editar ${p.nome}`)}
              ${link('profissional-servicos.html', 'Serviços', `Serviços de ${p.nome}`)}
              ${link('profissional-horario.html', 'Horário', `Horário de ${p.nome}`)}
              ${i > 0 ? `<button type="button" class="btn btn-secundario" aria-label="Subir ${p.nome}">Subir</button>` : ''}${i < n - 1 ? `<button type="button" class="btn btn-secundario" aria-label="Descer ${p.nome}">Descer</button>` : ''}
              <button type="button" class="btn btn-secundario" aria-label="Desativar ${p.nome}">Desativar</button>
            </div>
          </div>
        </li>`).join('\n        ')}
      </ul>
    </div>`;
  return moldura(t, 'dono', 'equipe', 'Equipe', conteudo);
}

function formProfissional({ destino, membro = null, novo = false, rotuloBotao }) {
  const emailBloco = membro?.dono
    ? `<div class="space-y-1.5">
          <p class="text-sm font-semibold">E-mail de acesso</p>
          <p class="break-all rounded-tema border border-borda bg-superficie-2 px-3 py-2.5 text-base">${membro.email}</p>
          <p class="text-sm text-suave">O seu e-mail de acesso não muda por aqui.</p>
        </div>`
    : campo({
      id: 'email', rotulo: 'E-mail de acesso', tipo: 'email', valor: membro?.email ?? '',
      dica: novo ? 'A pessoa recebe neste e-mail o link para definir a senha e entrar. O link vale por 72 horas.'
        : 'Trocar o e-mail encerra as sessões da pessoa. Se ela ainda não definiu a senha, um novo link vai para o novo e-mail.',
    });
  return formulario(destino, `
        ${campo({ id: 'displayName', rotulo: 'Nome de exibição', valor: membro?.nome ?? '', dica: 'O nome que aparece no site. Até 80 caracteres.' })}
        ${campo({ id: 'title', rotulo: 'Cargo (opcional)', valor: membro?.papel ?? '', dica: 'Ex.: Colorista, Barbeiro sênior. Até 60 caracteres.' })}
        ${campo({ id: 'bio', rotulo: 'Bio (opcional)', valor: membro?.bio ?? '', dica: 'Uma frase sobre a pessoa, em uma linha. Até 300 caracteres.' })}
        ${emailBloco}
        <div class="flex flex-wrap gap-3">
          ${botaoEnviar(rotuloBotao)}
          ${linkVoltar('equipe.html')}
        </div>`);
}

function abasProfissional(nome, atual) {
  const abas = [['dados', 'Dados', 'profissional.html'], ['servicos', 'Serviços', 'profissional-servicos.html'], ['horario', 'Horário', 'profissional-horario.html']];
  return `<div class="mb-6 space-y-4">
      <a href="equipe.html" class="inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4" style="color: var(--cor-primaria-forte, var(--cor-primaria))">← Voltar para a equipe</a>
      <h1 class="titulo break-words text-3xl sm:text-4xl">${nome}</h1>
      <nav aria-label="Abas de ${nome}" class="flex flex-wrap gap-1 border-b border-borda pb-2">
        ${abas.map(([id, rotulo, href]) => `<a href="${href}"${id === atual ? ' aria-current="page"' : ''} class="inline-flex min-h-11 items-center rounded-tema px-3 py-2.5 text-sm font-semibold outline-none ${id === atual ? 'bg-primaria-suave text-texto' : 'text-suave hover:bg-superficie-2 hover:text-texto'}">${rotulo}</a>`).join('\n        ')}
      </nav>
    </div>`;
}

function paginaProfissionalNovo(t) {
  const conteudo = `
    ${cabecalho('Novo profissional', 'Cadastre quem atende. Enviamos um e-mail para a pessoa definir a senha e entrar. Depois você escolhe os serviços e o horário dela. Você pode enviar a foto depois de criar.')}
    ${cartaoPainel(formProfissional({ destino: 'profissional-servicos.html', novo: true, rotuloBotao: 'Criar profissional' }))}`;
  return moldura(t, 'dono', 'equipe', 'Novo profissional', conteudo);
}

function paginaProfissional(t) {
  const m = exemplosDoPainel(t).membro;
  const conteudo = `
    ${abasProfissional(m.nome, 'dados')}
    ${cartaoPainel(formProfissional({ destino: 'profissional.html', membro: m, rotuloBotao: 'Salvar alterações' }))}
    ${espaco}
    ${cartaoPainel(`
        <h2 class="titulo text-xl">Foto</h2>
        <p class="mb-4 mt-1 text-sm text-suave">Aparece no cartão de &ldquo;Quem vai te atender&rdquo;. A foto é salva na hora, sem precisar salvar o formulário.</p>
        ${envioImagem({ id: 'foto', rotulo: 'Foto do profissional', dica: 'JPEG, PNG ou WebP, até 5 MB. Uma foto do rosto, de preferência quadrada: ela aparece num círculo pequeno.', vazioTexto: 'Sem foto', caixa: 'h-24 w-24' })}`)}`;
  return moldura(t, 'dono', 'equipe', 'Profissional', conteudo);
}

function paginaProfissionalServicos(t) {
  const m = exemplosDoPainel(t).membro;
  const conteudo = `
    ${abasProfissional(m.nome, 'servicos')}
    ${cartaoPainel(formulario('profissional-servicos.html', `
        <fieldset class="space-y-3">
          <legend class="text-sm font-semibold">Serviços que esta pessoa faz</legend>
          <p class="text-sm text-suave">Sem nenhum serviço marcado, a pessoa não aparece no site (como uma recepcionista).</p>
          <ul class="grid gap-2 sm:grid-cols-2">
            ${t.servicos.map((s) => `<li><label class="flex cursor-pointer items-center gap-3 rounded-tema border border-borda bg-campo px-3 py-3 text-sm font-medium"><input type="checkbox" name="serviceIds" value="${s.key}" class="caixa-marcar"${m.chaves.includes(s.key) ? ' checked' : ''}><span class="break-words">${s.nome}</span></label></li>`).join('\n            ')}
          </ul>
        </fieldset>
        ${botaoEnviar('Salvar serviços')}`))}`;
  return moldura(t, 'dono', 'equipe', 'Serviços do profissional', conteudo);
}

function paginaProfissionalHorario(t) {
  const m = exemplosDoPainel(t).membro;
  const campoHora = (id, rotulo, valor) => `<div class="flex flex-col gap-1">
              <label class="text-sm font-semibold" for="${id}">${rotulo}</label>
              <input class="campo" id="${id}" name="${id}" type="time"${valor ? ` value="${valor}"` : ''}>
            </div>`;
  const dia = (w) => {
    const salao = t.horario[w];
    const intervalos = m.agenda[w];
    const almoco = intervalos && intervalos.length > 1 ? [intervalos[0][1], intervalos[1][0]] : ['', ''];
    return `<fieldset class="space-y-3 rounded-xl border border-borda p-4">
          <legend class="px-1 text-base font-semibold">${SEMANA[w]}${w >= 1 && w <= 5 ? '-feira' : ''}</legend>
          <p class="text-sm text-suave">${salao ? `Salão: ${salao[0]} às ${salao[1]}` : 'Salão fechado'}</p>${!salao ? `
          <p class="text-sm font-medium">O profissional não trabalha neste dia.</p>` : `
          <div class="flex items-center gap-3">
            <input id="trabalha-${w}" type="checkbox" name="works-${w}" class="caixa-marcar"${intervalos ? ' checked' : ''}>
            <label for="trabalha-${w}" class="text-sm font-semibold">Trabalha neste dia</label>
          </div>
          <div class="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            ${campoHora(`entrada-${w}`, 'Entrada', intervalos?.[0][0])}
            ${campoHora(`saida-${w}`, 'Saída', intervalos?.at(-1)[1])}
            ${campoHora(`almoco-inicio-${w}`, 'Início do almoço', almoco[0])}
            ${campoHora(`almoco-fim-${w}`, 'Fim do almoço', almoco[1])}
          </div>
          <p class="text-sm text-suave">O almoço é opcional: deixe os dois em branco se não houver.</p>`}
        </fieldset>`;
  };
  const conteudo = `
    ${abasProfissional(m.nome, 'horario')}
    ${cartaoPainel(formulario('profissional-horario.html', `
        <div class="space-y-4">
          ${[0, 1, 2, 3, 4, 5, 6].map(dia).join('\n          ')}
        </div>
        ${botaoEnviar('Salvar horário')}`))}`;
  return moldura(t, 'dono', 'equipe', 'Horário do profissional', conteudo);
}

// ---------- Horário do salão, Aparência e Regras (hours-form.tsx, theme-form.tsx, theme-preview.tsx, rules-form.tsx) ----------
function paginaHorario(t) {
  const linhas = [1, 2, 3, 4, 5, 6, 0].map((w) => {
    const h = t.horario[w];
    const nome = `${SEMANA[w]}${w >= 1 && w <= 5 ? '-feira' : ''}`;
    return `<li>
          <div class="space-y-2 p-4">
            <div class="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
              <label for="fechado-${w}" class="flex min-h-11 min-w-40 cursor-pointer items-center gap-3">
                <input id="fechado-${w}" type="checkbox" name="fechado-${w}" class="caixa-marcar"${h ? '' : ' checked'}>
                <span><span class="block font-semibold">${nome}</span><span class="block text-sm font-normal text-suave">Fechado</span></span>
              </label>
              <div class="grid w-full grid-cols-2 gap-3 sm:w-auto sm:min-w-72">
                <div class="space-y-1"><label class="text-sm font-semibold" for="abre-${w}">Abre</label><input class="campo" id="abre-${w}" name="abre-${w}" type="time"${h ? ` value="${h[0]}"` : ''}></div>
                <div class="space-y-1"><label class="text-sm font-semibold" for="fecha-${w}">Fecha</label><input class="campo" id="fecha-${w}" name="fecha-${w}" type="time"${h ? ` value="${h[1]}"` : ''}></div>
              </div>
            </div>
          </div>
        </li>`;
  });
  const conteudo = `
    ${cabecalho('Horário', 'Os dias e horários em que o salão atende. Marque “Fechado” nos dias sem atendimento.')}
    ${cartaoPainel(formulario('horario.html', `
        <ul class="divide-y divide-borda rounded-xl border border-borda">
          ${linhas.join('\n          ')}
        </ul>
        ${botaoEnviar('Salvar horário')}`))}`;
  return moldura(t, 'dono', 'horario', 'Horário', conteudo);
}

function paginaAparencia(t) {
  const v = t.tema.vars;
  const cor = (id, rotulo, variavel, dica) => `<div class="space-y-1.5">
          <label class="campo-rotulo !mb-0" for="${id}">${rotulo}</label>
          <div class="flex items-center gap-3">
            <input type="color" aria-label="${rotulo}: escolher no seletor de cores" value="${v[variavel].toLowerCase()}" data-tema-var="${variavel}" class="h-11 w-14 shrink-0 cursor-pointer rounded-tema border border-borda bg-campo p-1">
            <input class="campo max-w-40 font-mono uppercase" id="${id}" name="${id}" value="${v[variavel].toUpperCase()}" maxlength="7" spellcheck="false" autocomplete="off" data-hex-de="${variavel}" aria-describedby="${id}-ajuda">
          </div>
          <p id="${id}-ajuda" class="text-sm text-suave">${dica} Formato #RRGGBB.</p>
        </div>`;
  const fontes = Object.entries(FONTES);
  const modoAtual = v['--esquema'] === 'dark' ? 'escuro' : 'claro';
  const conteudo = `
    ${cabecalho('Aparência', 'As cores e a fonte do seu site. Veja a prévia antes de salvar.')}
    ${cartaoPainel(`<div class="grid gap-8 lg:grid-cols-2">
        ${formulario('aparencia.html', `
          ${cor('primaryColor', 'Cor principal', '--cor-primaria', 'Botões, destaques e links do site.')}
          ${cor('secondaryColor', 'Cor de apoio', '--cor-secundaria', 'Detalhes e a capa do site.')}
          ${selecao({
            id: 'fontKey', rotulo: 'Fonte', valor: t.tema.fonte, dica: 'O par de fontes dos títulos e dos textos.', extra: ' data-tema-fonte',
            opcoes: fontes.map(([k, f]) => [k, f.nome, ` data-titulo="${esc(f.titulo)}" data-corpo="${esc(f.corpo)}" data-caixa="${f.caixa}"`]),
          })}
          <fieldset role="radiogroup" class="space-y-2">
            <legend class="text-sm font-semibold">Modo</legend>
            <div class="flex gap-3">
              ${[['claro', 'Claro'], ['escuro', 'Escuro']].map(([m, r]) => `<label class="opcao flex h-11 flex-1 cursor-pointer items-center justify-center px-4 text-sm font-semibold"><input type="radio" name="colorMode" value="${m}" class="sr-only" data-tema-modo="${esc(JSON.stringify(MODOS[m]))}"${m === modoAtual ? ' checked' : ''}>${r}</label>`).join('\n              ')}
            </div>
          </fieldset>
          ${botaoEnviar('Salvar aparência')}`)}
        <div class="space-y-3 lg:sticky lg:top-6 lg:self-start">
          <h2 class="titulo text-xl">Prévia</h2>
          <p class="text-sm text-suave">É assim que o site ficará. Nada muda até você salvar.</p>
          <div id="preview-tema" aria-hidden="true" class="overflow-hidden rounded-xl border border-borda bg-fundo font-corpo text-texto" style="color-scheme: var(--esquema)">
            <div class="flex items-center justify-between gap-3 border-b border-borda bg-superficie px-4 py-3">
              <div class="flex min-w-0 items-center gap-2.5"><span class="monograma h-9 w-9 text-base">${t.monograma}</span><span class="titulo truncate text-lg">${t.nome}</span></div>
              <span class="text-sm font-semibold underline underline-offset-4" style="color: var(--cor-primaria-forte, var(--cor-primaria))">Entrar</span>
            </div>
            <div class="space-y-4 p-5">
              <div class="space-y-2">
                <p class="titulo text-2xl">Cuidado de verdade, com hora marcada</p>
                <p class="text-sm text-suave">Um texto de exemplo para ver como a letra e as cores ficam no seu site.</p>
              </div>
              <span class="btn btn-primario">Agendar horário</span>
              <div class="cartao space-y-1 p-4">
                <p class="font-semibold">Corte e escova</p>
                <p class="text-sm text-suave">1 hora · a partir de R$ 120,00</p>
                <p class="pt-1 text-sm font-semibold underline underline-offset-4" style="color: var(--cor-primaria-forte, var(--cor-primaria))">Ver detalhes</p>
              </div>
            </div>
          </div>
        </div>
      </div>`)}`;
  return moldura(t, 'dono', 'aparencia', 'Aparência', conteudo);
}

function paginaRegras(t) {
  const r = t.regras;
  const minutos = (lista) => lista.map((m) => [m, duracaoRegra(m)]);
  const dias = (lista) => lista.map((d) => [d, `${d} dias`]);
  const conteudo = `
    ${cabecalho('Regras de agendamento', 'Como os clientes podem agendar e cancelar horários no seu salão.')}
    ${cartaoPainel(formulario('regras.html', `
        <div class="grid gap-5 sm:grid-cols-2">
          ${selecao({ id: 'slotStepMinutes', rotulo: 'Intervalo entre horários', valor: r.passo, opcoes: minutos([10, 15, 20, 30]), dica: 'De quanto em quanto tempo os horários de início são oferecidos.' })}
          ${selecao({ id: 'minNoticeMinutes', rotulo: 'Antecedência mínima', valor: r.antecedenciaMin, opcoes: minutos([30, 60, 120, 240, 1440]), dica: 'Com quanto tempo de antecedência o cliente pode agendar.' })}
          ${selecao({ id: 'maxAdvanceDays', rotulo: 'Agenda aberta até', valor: r.antecedenciaMaxDias, opcoes: dias([7, 15, 30, 60, 90]), dica: 'Até quantos dias à frente o cliente pode agendar.' })}
          ${selecao({ id: 'cancellationDeadlineMinutes', rotulo: 'Prazo para cancelar', valor: r.prazoCancelamento, opcoes: minutos([60, 120, 360, 720, 1440, 2880]), dica: 'Até quanto tempo antes do horário o cliente pode cancelar pelo site.' })}
        </div>
        ${areaTexto({ id: 'cancellationPolicyText', rotulo: 'Texto da política de cancelamento', valor: r.politica, linhas: 4, dica: 'Opcional. Aparece para o cliente na hora de agendar.' })}
        ${botaoEnviar('Salvar regras')}`))}`;
  return moldura(t, 'dono', 'regras', 'Regras de agendamento', conteudo);
}

// ---------- Páginas e mapa de telas ----------
export function paginasPainel(t) {
  const p = {};
  for (const nivel of ['dono', 'pro']) {
    for (const n of DIAS_AGENDA) p[`painel/${arqDia(nivel, n)}`] = paginaAgenda(t, nivel, { dia: n });
    for (const n of SEMANAS) p[`painel/${arqSemana(nivel, n)}`] = paginaAgenda(t, nivel, { semana: n });
    p[`painel/${arq(nivel, 'remarcar')}`] = paginaRemarcar(t, nivel);
    ETAPAS_BALCAO.forEach((nome, i) => { p[`painel/${arq(nivel, nome)}`] = paginaBalcao(t, nivel, i); });
    p[`painel/${arq(nivel, 'bloqueios')}`] = paginaBloqueios(t, nivel);
  }
  Object.assign(p, {
    'painel/site.html': paginaSite(t),
    'painel/servicos.html': paginaServicos(t),
    'painel/servico-novo.html': paginaServicoNovo(t),
    'painel/servico.html': paginaServico(t),
    'painel/equipe.html': paginaEquipe(t),
    'painel/profissional-novo.html': paginaProfissionalNovo(t),
    'painel/profissional.html': paginaProfissional(t),
    'painel/profissional-servicos.html': paginaProfissionalServicos(t),
    'painel/profissional-horario.html': paginaProfissionalHorario(t),
    'painel/horario.html': paginaHorario(t),
    'painel/aparencia.html': paginaAparencia(t),
    'painel/regras.html': paginaRegras(t),
  });
  return p;
}

/** Grupos do mapa "Telas": o painel do dono, o do profissional e as páginas de cada dia e semana da agenda. */
export function telasDoPainel(t) {
  const f = (nome) => `${t.slug}/painel/${nome}`;
  const dono = [
    ['Agenda (dia)', f('agenda.html'), '/painel/agenda'], ['Agenda (semana)', f('agenda-semana.html'), '/painel/agenda?visao=semana'],
    ['Remarcar atendimento', f('remarcar.html'), '/painel/agenda/[id]/remarcar'],
    ...ETAPAS_BALCAO.map((nome, i) => [`Novo agendamento: ${TITULOS_BALCAO[i]}`, f(`${nome}.html`), '/painel/agenda/novo']),
    ['Bloqueios', f('bloqueios.html'), '/painel/bloqueios'], ['Meu site', f('site.html'), '/painel/site'],
    ['Serviços', f('servicos.html'), '/painel/servicos'], ['Novo serviço', f('servico-novo.html'), '/painel/servicos/novo'], ['Editar serviço', f('servico.html'), '/painel/servicos/[id]'],
    ['Equipe', f('equipe.html'), '/painel/equipe'], ['Novo profissional', f('profissional-novo.html'), '/painel/equipe/novo'],
    ['Profissional: Dados', f('profissional.html'), '/painel/equipe/[id]'], ['Profissional: Serviços', f('profissional-servicos.html'), '/painel/equipe/[id]/servicos'],
    ['Profissional: Horário', f('profissional-horario.html'), '/painel/equipe/[id]/horario'],
    ['Horário', f('horario.html'), '/painel/horario'], ['Aparência', f('aparencia.html'), '/painel/aparencia'], ['Regras de agendamento', f('regras.html'), '/painel/regras'],
  ];
  const pro = [
    ['Minha agenda (dia)', f('pro-agenda.html'), '/painel/agenda'], ['Minha agenda (semana)', f('pro-agenda-semana.html'), '/painel/agenda?visao=semana'],
    ['Remarcar atendimento', f('pro-remarcar.html'), '/painel/agenda/[id]/remarcar'],
    ...ETAPAS_BALCAO.map((nome, i) => [`Novo agendamento: ${TITULOS_BALCAO[i]}`, f(`pro-${nome}.html`), '/painel/agenda/novo']),
    ['Meus bloqueios', f('pro-bloqueios.html'), '/painel/bloqueios'],
  ];
  const outros = [];
  for (const nivel of ['dono', 'pro']) {
    const quem = nivel === 'dono' ? 'Dono' : 'Profissional';
    for (const n of DIAS_AGENDA) if (n !== 0) outros.push([`${quem} · ${diaSemanaCurto(n)}`, f(arqDia(nivel, n)), `/painel/agenda?dia=D0${n < 0 ? n : `+${n}`}`]);
    outros.push([`${quem} · semana de ${diaSemanaCurto(7)}`, f(arqSemana(nivel, 7)), '/painel/agenda?visao=semana&dia=D0+7']);
  }
  return [[`Painel do dono · ${t.nome}`, dono], [`Painel do profissional · ${t.nome}`, pro], [`Outros dias da agenda · ${t.nome}`, outros]];
}
