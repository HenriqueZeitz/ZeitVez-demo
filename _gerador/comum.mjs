// Helpers compartilhados pelos templates.

export const DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
export const DIAS_ABR = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
export const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
export const MESES_ABR = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

// "Agora" fixo da vitrine: D0 do seed (docs/seeds/README.md), terça, 20/10/2026, às 14:30 em America/Sao_Paulo.
export const D0 = new Date(2026, 9, 20);
export const HOJE = D0;
export const AGORA_MIN = 14 * 60 + 30; // minutos desde a meia-noite de D0

export const brl = (n) => 'R$ ' + n.toLocaleString('pt-BR');
export const preco = (s) => (s.aPartir ? 'a partir de ' : '') + brl(s.preco);
// Vários serviços no mesmo agendamento: soma duração e preço ("a partir de" se algum for)
export const somaServicos = (lista) => ({
  nomes: lista.map((s) => s.nome).join(' + '),
  dur: lista.reduce((n, s) => n + s.dur, 0),
  preco: lista.reduce((n, s) => n + s.preco, 0),
  aPartir: lista.some((s) => s.aPartir),
});
export const duracao = (min) => {
  const h = Math.floor(min / 60), m = min % 60;
  if (!h) return `${m} min`;
  return m ? `${h}h${String(m).padStart(2, '0')}` : `${h}h`;
};
export const hora = (min) => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;
export const minutos = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };
export const somaDias = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
export const dataLonga = (d) => `${DIAS[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]}`;
export const dataLongaAno = (d) => `${dataLonga(d)} de ${d.getFullYear()}`;
// ---------- Formatos do produto real (web/src/lib/booking/format.ts, landing/services.ts, landing/contact.ts) ----------
const DIAS_CURTO = ['dom.', 'seg.', 'ter.', 'qua.', 'qui.', 'sex.', 'sáb.'];
const DIAS_LONGO = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
export const hhmm = (min) => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;
/** "qua., 21 out" */
export const diaCurto = (d) => `${DIAS_CURTO[d.getDay()]}, ${d.getDate()} ${MESES_ABR[d.getMonth()]}`;
/** "quarta-feira, 21 de outubro" */
export const diaLongo = (d) => `${DIAS_LONGO[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]}`;
/** "qua., 21 out, às 09:00" */
export const dataSlot = (d, min) => `${diaCurto(d)}, às ${hhmm(min)}`;
/** "quarta-feira, 21 de outubro, às 09:00" */
export const dataSlotLonga = (d, min) => `${diaLongo(d)}, às ${hhmm(min)}`;
/** 60 → "1 hora", 120 → "2 horas", 1440 → "24 horas", 30 → "30 minutos" */
export const prazoTexto = (min) => (min >= 60 && min % 60 === 0 ? (min / 60 === 1 ? '1 hora' : `${min / 60} horas`) : min === 1 ? '1 minuto' : `${min} minutos`);
/** Centavos: 5500 → "R$ 55"; 5550 → "R$ 55,50"; com "a partir de". */
export const precoCentavos = (cents, aPartir = false) => {
  const v = cents % 100 === 0 ? (cents / 100).toLocaleString('pt-BR') : (cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return (aPartir ? 'a partir de ' : '') + 'R$ ' + v;
};
/** "551130000101" → "(11) 3000-0101"; "5511900000101" → "(11) 90000-0101" */
export const formatarTelefone = (digitos) => {
  const m = /^55(\d{2})(\d{4,5})(\d{4})$/.exec(digitos);
  return m ? `(${m[1]}) ${m[2]}-${m[3]}` : digitos;
};

export const maiuscula = (s) => s.charAt(0).toUpperCase() + s.slice(1);
export const iniciais = (nome) => nome.split(' ').map((p) => p[0]).slice(0, 2).join('');

export const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
  .replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ---------- Ícones (traço simples, herdam a cor do texto) ----------
const ICONES = {
  relogio: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  telefone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  whatsapp: '<path d="M21 12a9 9 0 0 1-13.5 7.8L3 21l1.2-4.5A9 9 0 1 1 21 12z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8a4 4 0 0 1-1.8-1.8l.8-1-1-2L9 9.5z"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/>',
  email: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  calendario: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  usuario: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  usuarios: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6.5 6.5 0 0 1 3.5 6"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  esquerda: '<path d="M15 18l-6-6 6-6"/>',
  direita: '<path d="M9 18l6-6-6-6"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  fechar: '<path d="M6 6l12 12M18 6L6 18"/>',
  mais: '<path d="M12 5v14M5 12h14"/>',
  editar: '<path d="M4 20h4L19 9l-4-4L4 16v4z"/><path d="M13.5 6.5l4 4"/>',
  sair: '<path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10"/>',
  externo: '<path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/>',
  tesoura: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4L8.1 15.9M14.5 14.5L20 20M8.1 8.1L12 12"/>',
  pincel: '<path d="M9.5 14.5c-2 0-3.5 1.5-3.5 3.5 0 1.5-1 2.5-3 3 4 1 9 0 9-4 0-1.4-1.1-2.5-2.5-2.5z"/><path d="M11 13l9.5-9.5M14 10l-3-3"/>',
  lista: '<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="3.5" cy="6" r=".8" fill="currentColor"/><circle cx="3.5" cy="12" r=".8" fill="currentColor"/><circle cx="3.5" cy="18" r=".8" fill="currentColor"/>',
  alerta: '<path d="M12 3l9.5 17h-19L12 3z"/><path d="M12 10v4M12 17.5v.01"/>',
  busca: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
  globo: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  celular: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
  brilho: '<path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/><path d="M19 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>',
  upload: '<path d="M12 16V4M7 9l5-5 5 5M4 20h16"/>',
  dinheiro: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/>',
  imagem: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="M21 16l-5-5-9 9"/>',
  loja: '<path d="M4 10v10h16V10M3 6l2-3h14l2 3v2a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0V6z"/><path d="M10 20v-5h4v5"/>',
  cadeado: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  sol: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  lua: '<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/>',
  bloqueio: '<circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/>',
  engrenagem: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  baixo: '<path d="M6 9l6 6 6-6"/>',
  documento: '<path d="M14 3H6v18h12V7z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
  lixeira: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
};
export const ic = (nome, cls = 'h-5 w-5') =>
  `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONES[nome]}</svg>`;

// ---------- Documento ----------
// Telas do ZeitVez: aplica o tema escolhido (claro/escuro) antes de pintar, para não piscar.
export const SCRIPT_TEMA_STUDIO = `<script>try{var t=localStorage.getItem('zeitvez-tema');if(t)document.documentElement.dataset.tema=t}catch(e){}</script>`;

// Tudo vem da própria pasta: fontes.css (@font-face dos arquivos de assets/fontes/), o tema do salão e o vitrine.css
// (Tailwind compilado pelo gerador, com o base.css dentro).
export function pagina({ titulo, raiz, tema, corpo, descricao = '', bodyAttrs = '', head = '' }) {
  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${titulo}</title>${descricao ? `\n  <meta name="description" content="${esc(descricao)}">` : ''}${head ? `\n  ${head}` : ''}
  <link rel="stylesheet" href="${raiz}assets/fontes.css">
  <link rel="stylesheet" href="${tema}">
  <link rel="stylesheet" href="${raiz}assets/vitrine.css">
  <script defer src="${raiz}assets/telas.js"></script>
  <script defer src="${raiz}assets/app.js"></script>
</head>
<body class="min-h-screen bg-fundo font-corpo text-texto antialiased" data-raiz="${raiz}"${bodyAttrs ? ' ' + bodyAttrs : ''}>
${corpo.trim()}
</body>
</html>
`;
}

export function cssTema(t, comentario) {
  const linhas = Object.entries(t.vars).map(([k, v]) => `  ${k}: ${v};`).join('\n');
  return `/* ${comentario}
   Este bloco é o "tema" do tenant: o layout é o mesmo para todos, só estas variáveis mudam. */
:root {
${linhas}
}
`;
}

// Tema do ZeitVez: claro na base; escuro quando o sistema pede (e o usuário não escolheu "claro")
// ou quando o usuário escolheu "escuro" no botão do cabeçalho.
export function cssTemaStudio(t, escuro, comentario) {
  const bloco = (vars, ind) => Object.entries(vars).map(([k, v]) => `${ind}${k}: ${v};`).join('\n');
  return `${cssTema(t, comentario)}
@media (prefers-color-scheme: dark) {
  :root:not([data-tema="claro"]) {
${bloco(escuro, '    ')}
  }
}

:root[data-tema="escuro"] {
${bloco(escuro, '  ')}
}
`;
}

// Cartão/placeholder de foto
export const foto = (legenda, i, cls = 'aspect-[4/3]', clsLegenda = '') =>
  `<div class="foto foto-${(i % 6) + 1} ${cls} rounded-tema-lg"><span class="foto-legenda ${clsLegenda}">${legenda}</span></div>`;

export const avatar = (nome, cls = 'h-12 w-12 text-base') => `<span class="avatar ${cls}" aria-hidden="true">${iniciais(nome)}</span>`;
