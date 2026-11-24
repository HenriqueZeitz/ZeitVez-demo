// Dados do protótipo. Salões, pessoas, serviços, horários, regras e agendamentos vêm de docs/seeds/ (mesmas chaves).
import { formatarTelefone, D0, AGORA_MIN } from './comum.mjs';

// ---------- Temas (viram o bloco :root de cada tema.css) ----------
const STATUS_CLARO = {
  '--cor-sucesso-fundo': '#E6F4EA', '--cor-sucesso-texto': '#1B6B38', '--cor-sucesso-borda': '#BEDFC9',
  '--cor-alerta-fundo': '#FFF4DB', '--cor-alerta-texto': '#855600', '--cor-alerta-borda': '#EFD79C',
  '--cor-erro-fundo': '#FCE9E7', '--cor-erro-texto': '#A1251A', '--cor-erro-borda': '#EFC3BD',
  '--cor-azul-fundo': '#E6EEFB', '--cor-azul-texto': '#1D4E9E', '--cor-azul-borda': '#BCD0F0',
  '--cor-roxo-fundo': '#F1EAFB', '--cor-roxo-texto': '#5B2D9E', '--cor-roxo-borda': '#D9C6F2',
};
const STATUS_ESCURO = {
  '--cor-sucesso-fundo': '#11301E', '--cor-sucesso-texto': '#86DFAA', '--cor-sucesso-borda': '#1F4F33',
  '--cor-alerta-fundo': '#33280F', '--cor-alerta-texto': '#F2C66B', '--cor-alerta-borda': '#5A4516',
  '--cor-erro-fundo': '#3A1614', '--cor-erro-texto': '#F7A196', '--cor-erro-borda': '#62261F',
  '--cor-azul-fundo': '#13233F', '--cor-azul-texto': '#93B9F5', '--cor-azul-borda': '#24406B',
  '--cor-roxo-fundo': '#2A1A40', '--cor-roxo-texto': '#C9A8F5', '--cor-roxo-borda': '#4A2E70',
};

export const MODOS = {
  claro: {
    '--esquema': 'light', '--cor-fundo': '#FAFAF8', '--cor-superficie': '#FFFFFF', '--cor-superficie-2': '#F2F2EF',
    '--cor-campo': '#FFFFFF', '--cor-texto': '#1C1C1C', '--cor-texto-suave': '#5C5C5C',
    '--cor-borda': '#E3E3DE', '--cor-borda-forte': '#C6C6BF', ...STATUS_CLARO,
  },
  escuro: {
    '--esquema': 'dark', '--cor-fundo': '#0E0E10', '--cor-superficie': '#17171A', '--cor-superficie-2': '#202024',
    '--cor-campo': '#121214', '--cor-texto': '#F2EEE6', '--cor-texto-suave': '#A9A39A',
    '--cor-borda': '#2C2C31', '--cor-borda-forte': '#45454C', ...STATUS_ESCURO,
  },
};

// Lista fechada e curada de pares (título + texto) oferecida no "Meu site". `estilo` agrupa no seletor.
export const FONTES = {
  serifada: {
    nome: 'Playfair Display + Lato', estilo: 'Clássica',
    titulo: "'Playfair Display', Georgia, serif", corpo: "'Lato', system-ui, sans-serif", caixa: 'none',
    google: 'family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&family=Lato:wght@400;700',
  },
  cormorant: {
    nome: 'Cormorant Garamond + Mulish', estilo: 'Clássica',
    titulo: "'Cormorant Garamond', Georgia, serif", corpo: "'Mulish', system-ui, sans-serif", caixa: 'none',
    google: 'family=Cormorant+Garamond:wght@500;600;700&family=Mulish:wght@400;600;700',
  },
  baskerville: {
    nome: 'Libre Baskerville + Source Sans 3', estilo: 'Clássica',
    titulo: "'Libre Baskerville', Georgia, serif", corpo: "'Source Sans 3', system-ui, sans-serif", caixa: 'none',
    google: 'family=Libre+Baskerville:wght@400;700&family=Source+Sans+3:wght@400;600;700',
  },
  'sem-serifa': {
    nome: 'Manrope', estilo: 'Moderna',
    titulo: "'Manrope', system-ui, sans-serif", corpo: "'Manrope', system-ui, sans-serif", caixa: 'none',
    google: 'family=Manrope:wght@400;500;600;700;800',
  },
  outfit: {
    nome: 'Outfit', estilo: 'Moderna',
    titulo: "'Outfit', system-ui, sans-serif", corpo: "'Outfit', system-ui, sans-serif", caixa: 'none',
    google: 'family=Outfit:wght@400;500;600;700;800',
  },
  fraunces: {
    nome: 'Fraunces + Inter', estilo: 'Moderna',
    titulo: "'Fraunces', Georgia, serif", corpo: "'Inter', system-ui, sans-serif", caixa: 'none',
    google: 'family=Fraunces:wght@500;600;700;800&family=Inter:wght@400;500;600;700',
  },
  condensada: {
    nome: 'Oswald + Barlow', estilo: 'Condensada',
    titulo: "'Oswald', 'Arial Narrow', sans-serif", corpo: "'Barlow', system-ui, sans-serif", caixa: 'uppercase',
    google: 'family=Oswald:wght@500;600;700&family=Barlow:wght@400;500;600;700',
  },
  'barlow-condensada': {
    nome: 'Barlow Condensed + Barlow', estilo: 'Condensada',
    titulo: "'Barlow Condensed', 'Arial Narrow', sans-serif", corpo: "'Barlow', system-ui, sans-serif", caixa: 'uppercase',
    google: 'family=Barlow+Condensed:wght@500;600;700&family=Barlow:wght@400;500;600;700',
  },
  josefin: {
    nome: 'Josefin Sans + Nunito Sans', estilo: 'Delicada',
    titulo: "'Josefin Sans', system-ui, sans-serif", corpo: "'Nunito Sans', system-ui, sans-serif", caixa: 'none',
    google: 'family=Josefin+Sans:wght@500;600;700&family=Nunito+Sans:wght@400;600;700',
  },
  quicksand: {
    nome: 'Quicksand + Nunito', estilo: 'Delicada',
    titulo: "'Quicksand', system-ui, sans-serif", corpo: "'Nunito', system-ui, sans-serif", caixa: 'none',
    google: 'family=Quicksand:wght@500;600;700&family=Nunito:wght@400;600;700',
  },
  jakarta: {
    nome: 'Plus Jakarta Sans',
    titulo: "'Plus Jakarta Sans', system-ui, sans-serif", corpo: "'Plus Jakarta Sans', system-ui, sans-serif", caixa: 'none',
    google: 'family=Plus+Jakarta+Sans:wght@400;500;600;700;800',
  },
};

function tema(fonte, vars) {
  const f = FONTES[fonte];
  return {
    fonte,
    google: f.google,
    vars: { '--fonte-titulo': f.titulo, '--fonte-corpo': f.corpo, ...vars },
  };
}


export const TEMA_ZEITVEZ = tema('jakarta', {
  '--esquema': 'light',
  '--cor-fundo': '#F8FAFC', '--cor-superficie': '#FFFFFF', '--cor-superficie-2': '#F1F5F9', '--cor-campo': '#FFFFFF',
  '--cor-texto': '#0F172A', '--cor-texto-suave': '#475569', '--cor-borda': '#E2E8F0', '--cor-borda-forte': '#CBD5E1',
  '--cor-primaria': '#4338CA', '--cor-primaria-forte': '#3730A3', '--cor-primaria-suave': '#E0E7FF',
  '--cor-sobre-primaria': '#FFFFFF', '--cor-secundaria': '#F59E0B', '--cor-foco': '#6366F1',
  '--cor-foto-1': '#C7D2FE', '--cor-foto-2': '#6366F1', '--cor-foto-3': '#FDE68A', '--cor-foto-texto': '#1E1B4B',
  ...STATUS_CLARO,
  '--titulo-caixa': 'none', '--titulo-espaco': '-0.02em', '--titulo-peso': '800',
  '--raio': '10px', '--raio-grande': '16px', '--raio-botao': '10px', '--raio-avatar': '999px',
  '--sombra': '0 1px 2px rgba(15,23,42,.04), 0 8px 24px rgba(15,23,42,.06)',
});

// Variante escura do ZeitVez: padrão quando o sistema do usuário está em modo escuro.
export const TEMA_ZEITVEZ_ESCURO = {
  '--esquema': 'dark',
  '--cor-fundo': '#0B0F1A', '--cor-superficie': '#121826', '--cor-superficie-2': '#1B2232', '--cor-campo': '#0E1320',
  '--cor-texto': '#E8ECF4', '--cor-texto-suave': '#9AA4B8', '--cor-borda': '#242C3D', '--cor-borda-forte': '#364055',
  '--cor-primaria': '#8B93F8', '--cor-primaria-forte': '#A9AFFB', '--cor-primaria-suave': '#23244A',
  '--cor-sobre-primaria': '#0B0F1A', '--cor-secundaria': '#F59E0B', '--cor-foco': '#A9AFFB',
  '--cor-foto-1': '#312E81', '--cor-foto-2': '#4F46E5', '--cor-foto-3': '#78350F', '--cor-foto-texto': '#E0E7FF',
  ...STATUS_ESCURO,
  '--sombra': 'none',
};


// ---------- Temas dos salões ----------
// Cores: as mesmas que `deriveTheme` (web/src/lib/landing/theme.ts) deriva das duas cores do seed (docs/seeds/02),
// conferidas uma vez à mão contra a saída do código real. A forma vem do estilo da fonte (D9 do design):
// Clássica = botão em pílula; Condensada = 4 px e caixa alta; Moderna = 12 px e título 800.
const FORMA = {
  classica: { '--titulo-caixa': 'none', '--titulo-espaco': 'normal', '--titulo-peso': '600', '--botao-caixa': 'none', '--botao-espaco': 'normal', '--raio': '10px', '--raio-grande': '20px', '--raio-botao': '999px', '--raio-avatar': '999px' },
  condensada: { '--titulo-caixa': 'uppercase', '--titulo-espaco': '.03em', '--titulo-peso': '600', '--botao-caixa': 'uppercase', '--botao-espaco': '.06em', '--raio': '4px', '--raio-grande': '6px', '--raio-botao': '4px', '--raio-avatar': '6px' },
  moderna: { '--titulo-caixa': 'none', '--titulo-espaco': '-0.02em', '--titulo-peso': '800', '--botao-caixa': 'none', '--botao-espaco': 'normal', '--raio': '12px', '--raio-grande': '16px', '--raio-botao': '12px', '--raio-avatar': '14px' },
};

function temaDoSalao(fonte, forma, modo, c, sombra) {
  return tema(fonte, {
    '--esquema': modo,
    '--cor-fundo': c.background, '--cor-superficie': c.surface, '--cor-superficie-2': c.surface2, '--cor-campo': c.field,
    '--cor-texto': c.text, '--cor-texto-suave': c.mutedText, '--cor-borda': c.border, '--cor-borda-forte': c.borderStrong,
    '--cor-primaria': c.primary, '--cor-primaria-forte': c.primaryStrong, '--cor-primaria-suave': c.primarySoft,
    '--cor-sobre-primaria': c.onPrimary, '--cor-secundaria': c.secondary, '--cor-foco': c.ring,
    '--cor-foto-1': c.cover1, '--cor-foto-2': c.cover2, '--cor-foto-3': c.cover3, '--cor-foto-texto': c.coverText,
    ...(modo === 'dark' ? STATUS_ESCURO : STATUS_CLARO),
    ...FORMA[forma],
    '--sombra': sombra,
  });
}

// ---------- Seed (docs/seeds/01 a 05): mesmas chaves e valores ----------
// Datas dos agendamentos e bloqueios em "D0 ± n" (D0 = terça 20/10/2026, ver comum.mjs); horários HH:MM.
const semana = (dias, normal, sab) => Object.fromEntries(dias.map((d) => [d, d === 6 && sab ? sab : normal]));
const CLIENTES = [
  ['alex', 'Alex Souza', '988881234', 'alex.souza@email.com'], ['marcos', 'Marcos Vieira', '981112030', 'marcos.vieira@email.com'],
  ['livia', 'Lívia Andrade', '982224410', 'livia.andrade@email.com'], ['renato', 'Renato Dias', '983335521', null],
  ['paula', 'Paula Freitas', '981239087', 'paula.freitas@email.com'], ['camila', 'Camila Reis', '984446632', 'camila.reis@email.com'],
  ['davi', 'Davi Rocha', '985557743', 'davi.rocha@email.com'], ['eduarda', 'Eduarda Nunes', '986668854', 'eduarda.nunes@email.com'],
  ['felipe', 'Felipe Ramos', '987779965', 'felipe.ramos@email.com'], ['gabi', 'Gabi Torres', '988881076', null],
  ['heitor', 'Heitor Melo', '989992187', 'heitor.melo@email.com'],
];
// Cliente de balcão: cadastrado por um funcionário, sem conta
const SEM_CONTA = new Set(['renato', 'gabi']);

const SEED = {
  aurora: {
    nome: 'Studio Aurora', tipo: 'Salon', razaoSocial: 'Studio Aurora Cabeleireiros Ltda.', cnpj: '00.000.001/0001-01',
    telefone: '551130000101', whatsapp: '5511900000101', email: 'contato@studioaurora.com.br', instagram: '@studioaurora',
    endereco: 'Rua das Acácias, 120 — Vila Madalena', cidade: 'São Paulo', uf: 'SP', ddd: '5511',
    tagline: 'Cabelo, cor e cuidado — sem pressa.',
    heroText: 'Cortes, coloração e tratamentos para todos os tipos de cabelo, num espaço tranquilo na Vila Madalena. Agende online em menos de um minuto.',
    destaques: ['Desde 2016', 'Produtos veganos', 'Café e Wi-Fi', 'Acessível'],
    sobre: [
      'O Studio Aurora nasceu em 2016 com uma ideia simples: atender com hora marcada, para ninguém precisar esperar. Café passado na hora, música baixa e um time que conversa antes de pegar na tesoura.',
      'Trabalhamos com marcas veganas e atendemos todos os tipos e comprimentos de cabelo — do corte curto ao alongamento de mechas.',
    ],
    regras: { passo: 15, antecedenciaMin: 60, antecedenciaMaxDias: 30, prazoCancelamento: 120, politica: 'Cancelamentos pelo site até 2 horas antes. Depois disso, fale com a gente pelo WhatsApp.' },
    horario: [null, null, ['09:00', '19:00'], ['09:00', '19:00'], ['09:00', '19:00'], ['09:00', '19:00'], ['09:00', '17:00']],
    servicos: [
      ['corte-e-finalizacao', 'Corte e finalização', 'Corte personalizado com lavagem e finalização.', 60, 12000, false],
      ['corte-curto', 'Corte curto', 'Máquina e tesoura, com lavagem e acabamento.', 40, 8000, false],
      ['escova-modelada', 'Escova modelada', 'Lavagem e escova lisa ou com movimento.', 45, 7500, false],
      ['coloracao', 'Coloração', 'Retoque de raiz ou cor global, sem amônia.', 120, 26000, true],
      ['mechas-e-iluminado', 'Mechas e iluminado', 'Luzes, balayage e iluminado sob medida.', 180, 45000, true],
      ['hidratacao-profunda', 'Hidratação profunda', 'Tratamento de reconstrução e brilho.', 45, 9500, false],
    ],
    profissionais: [
      { key: 'marina', email: 'marina@studioaurora.com.br', nome: 'Marina Costa', titulo: 'Cabeleireira e sócia', bio: 'Especialista em cortes e texturas, 12 anos de salão.', dono: true, servicos: ['corte-e-finalizacao', 'corte-curto', 'escova-modelada'], agenda: semana([2, 3, 4, 5, 6], [['09:00', '12:00'], ['13:00', '19:00']], [['09:00', '12:00'], ['13:00', '17:00']]) },
      { key: 'rafael', email: 'rafael@studioaurora.com.br', nome: 'Rafael Nunes', titulo: 'Colorista', bio: 'Mechas, iluminados e correção de cor.', servicos: ['coloracao', 'mechas-e-iluminado'], agenda: semana([2, 3, 4, 5], [['10:00', '13:00'], ['14:00', '19:00']]) },
      { key: 'bia', email: 'bia@studioaurora.com.br', nome: 'Bia Santos', titulo: 'Terapeuta capilar', bio: 'Tratamentos e cronograma capilar personalizado.', servicos: ['escova-modelada', 'hidratacao-profunda'], agenda: semana([3, 4, 5, 6], [['09:00', '12:00'], ['13:00', '17:00']]) },
    ],
    agendamentos: [
      [1, -21, '15:00', '16:00', 'marina', 'alex', 'Completed', 'Online', null, ['corte-e-finalizacao']],
      [2, -14, '11:00', '11:40', 'marina', 'paula', 'Completed', 'Online', null, ['corte-curto']],
      [3, -7, '10:00', '11:00', 'marina', 'marcos', 'Completed', 'Online', null, ['corte-e-finalizacao']],
      [4, -7, '10:00', '12:00', 'rafael', 'livia', 'Completed', 'Online', null, ['coloracao']],
      [5, 0, '09:00', '10:00', 'marina', 'marcos', 'Completed', 'Online', null, ['corte-e-finalizacao']],
      [6, 0, '10:00', '12:00', 'rafael', 'livia', 'Confirmed', 'Online', null, ['coloracao']],
      [7, 0, '10:30', '11:15', 'marina', 'renato', 'NoShow', 'Counter', 'marina', ['escova-modelada']],
      [8, 0, '11:15', '11:55', 'marina', 'paula', 'Confirmed', 'Online', null, ['corte-curto'], 'Quero manter o comprimento, só tirar as pontas.'],
      [9, 0, '13:00', '14:00', 'marina', 'davi', 'Confirmed', 'Online', null, ['corte-e-finalizacao']],
      [10, 0, '14:00', '17:00', 'rafael', 'camila', 'Confirmed', 'Online', null, ['mechas-e-iluminado'], 'Tenho sensibilidade a amônia.'],
      [11, 0, '14:30', '15:15', 'marina', 'eduarda', 'Confirmed', 'Online', null, ['escova-modelada']],
      [12, 0, '16:00', '17:00', 'marina', 'felipe', 'Cancelled', 'Online', null, ['corte-e-finalizacao']],
      [13, 0, '17:30', '18:10', 'marina', 'heitor', 'Confirmed', 'Online', null, ['corte-curto']],
      [14, 1, '11:00', '11:45', 'bia', 'gabi', 'Confirmed', 'Counter', 'bia', ['hidratacao-profunda']],
      [15, 1, '15:00', '16:00', 'marina', 'alex', 'Confirmed', 'Online', null, ['corte-e-finalizacao']],
      [16, 8, '09:30', '10:15', 'bia', 'camila', 'Confirmed', 'Online', null, ['hidratacao-profunda']],
      [17, 9, '14:00', '14:45', 'bia', 'heitor', 'Confirmed', 'Online', null, ['escova-modelada']],
      [18, -7, '15:00', '15:40', 'marina', 'heitor', 'Confirmed', 'Online', null, ['corte-curto']],
    ],
    bloqueios: ['rafael', 'marina', 'bia'],
    exemplo: { servicos: ['corte-e-finalizacao', 'escova-modelada'], dia: 1, ini: '10:00' },
    capa: 'Nosso espaço',
    tema: { fonte: 'serifada', forma: 'classica', modo: 'light', sombra: '0 1px 2px rgba(60,30,10,.05), 0 8px 24px rgba(60,30,10,.06)', cores: { primary: '#A3502E', secondary: '#D7A574', background: '#FCF5F2', surface: '#FFFFFF', surface2: '#F7EAE5', field: '#FFFFFF', text: '#2A1B16', mutedText: '#67534B', border: '#EADAD4', borderStrong: '#D0B8AF', primaryStrong: '#A3502E', primarySoft: '#F2E7E2', onPrimary: '#FFFFFF', ring: '#A3502E', cover1: '#DDBBAD', cover2: '#A3502E', cover3: '#EDD5C0', coverText: '#FFFFFF' } },
  },
  navalha: {
    nome: 'Barbearia Navalha', tipo: 'Barbershop', razaoSocial: 'Navalha Barbearia Ltda.', cnpj: '00.000.002/0001-02',
    telefone: '554130000202', whatsapp: '5541900000202', email: 'contato@barbearianavalha.com.br', instagram: '@barbearianavalha',
    endereco: 'Av. Sete de Setembro, 2200 — Centro', cidade: 'Curitiba', uf: 'PR', ddd: '5541',
    tagline: 'Corte afiado. Barba alinhada.',
    heroText: 'Cortes clássicos, fades e barba na toalha quente, no Centro de Curitiba. Escolha o barbeiro e o horário — sem fila, sem enrolação.',
    destaques: ['Desde 2014', 'Toalha quente', 'Estacionamento conveniado', 'Atende crianças'],
    sobre: [
      'A Navalha abriu em 2014 numa sala pequena da Sete de Setembro, com duas cadeiras e uma regra: horário marcado é horário cumprido.',
      'Hoje são três barbeiros, café e cerveja gelada na espera e o mesmo cuidado com o acabamento na navalha. Atendemos adultos e crianças a partir de 5 anos.',
    ],
    regras: { passo: 15, antecedenciaMin: 30, antecedenciaMaxDias: 15, prazoCancelamento: 60, politica: 'Cancele até 1 hora antes pelo site. Faltas repetidas sem aviso podem limitar novos agendamentos.' },
    horario: [null, ['10:00', '20:00'], ['10:00', '20:00'], ['10:00', '20:00'], ['10:00', '20:00'], ['10:00', '20:00'], ['09:00', '18:00']],
    servicos: [
      ['corte-classico', 'Corte clássico', 'Tesoura e máquina, lavagem e finalização com pomada.', 40, 5500, false],
      ['corte-barba', 'Corte + barba', 'O combo completo, com toalha quente.', 70, 9500, false],
      ['barba-completa', 'Barba completa', 'Desenho, navalha e toalha quente.', 30, 4500, false],
      ['degrade-fade', 'Degradê (fade)', 'Low, mid ou high fade com acabamento na navalha.', 45, 6000, false],
      ['pigmentacao-de-barba', 'Pigmentação de barba', 'Preenchimento de falhas com pigmento.', 30, 4000, false],
      ['sobrancelha', 'Sobrancelha', 'Limpeza e alinhamento na navalha.', 15, 2000, false],
    ],
    profissionais: [
      { key: 'diego', email: 'diego@barbearianavalha.com.br', nome: 'Diego Ramos', titulo: 'Barbeiro e fundador', bio: '15 anos de navalha, especialista em cortes clássicos.', dono: true, servicos: ['corte-classico', 'corte-barba', 'barba-completa', 'sobrancelha'], agenda: semana([1, 2, 3, 4, 5, 6], [['10:00', '13:00'], ['14:00', '20:00']], [['10:00', '13:00'], ['14:00', '18:00']]) },
      { key: 'thiago', email: 'thiago@barbearianavalha.com.br', nome: 'Thiago Alves', titulo: 'Barbeiro', bio: 'Fades, desenhos e pigmentação.', servicos: ['corte-classico', 'degrade-fade', 'pigmentacao-de-barba'], agenda: semana([1, 2, 3, 4, 5], [['10:00', '14:00'], ['15:00', '19:00']]) },
      { key: 'caio', email: 'caio@barbearianavalha.com.br', nome: 'Caio Mendes', titulo: 'Barbeiro', bio: 'Barbas longas e visagismo.', servicos: ['corte-barba', 'barba-completa', 'sobrancelha'], agenda: semana([2, 3, 4, 5, 6], [['11:00', '15:00'], ['16:00', '20:00']], [['11:00', '15:00'], ['16:00', '18:00']]) },
    ],
    agendamentos: [
      [1, -21, '16:00', '17:10', 'caio', 'alex', 'Completed', 'Online', null, ['corte-barba']],
      [2, -7, '10:00', '10:40', 'diego', 'marcos', 'Completed', 'Online', null, ['corte-classico']],
      [3, -7, '11:00', '11:45', 'thiago', 'livia', 'Completed', 'Online', null, ['degrade-fade']],
      [4, 0, '10:00', '10:40', 'diego', 'marcos', 'Completed', 'Online', null, ['corte-classico']],
      [5, 0, '10:30', '11:15', 'thiago', 'livia', 'Confirmed', 'Online', null, ['degrade-fade']],
      [6, 0, '11:00', '12:10', 'diego', 'renato', 'NoShow', 'Counter', 'diego', ['corte-barba']],
      [7, 0, '11:00', '11:45', 'caio', 'gabi', 'Confirmed', 'Counter', 'caio', ['barba-completa', 'sobrancelha']],
      [8, 0, '11:30', '12:45', 'thiago', 'camila', 'Confirmed', 'Online', null, ['degrade-fade', 'pigmentacao-de-barba'], 'Prefiro máquina número 2 nas laterais.'],
      [9, 0, '12:15', '12:45', 'diego', 'paula', 'Confirmed', 'Online', null, ['barba-completa']],
      [10, 0, '14:00', '14:40', 'diego', 'davi', 'Confirmed', 'Online', null, ['corte-classico']],
      [11, 0, '15:00', '16:10', 'diego', 'felipe', 'Cancelled', 'Online', null, ['corte-barba']],
      [12, 0, '15:00', '15:30', 'thiago', 'eduarda', 'Confirmed', 'Online', null, ['pigmentacao-de-barba']],
      [13, 0, '16:00', '17:10', 'caio', 'alex', 'Confirmed', 'Online', null, ['corte-barba']],
      [14, 0, '17:00', '17:55', 'diego', 'heitor', 'Confirmed', 'Online', null, ['corte-classico', 'sobrancelha']],
      [15, 8, '12:00', '12:30', 'caio', 'paula', 'Confirmed', 'Online', null, ['barba-completa']],
      [16, 9, '17:00', '18:10', 'caio', 'davi', 'Confirmed', 'Online', null, ['corte-barba']],
    ],
    bloqueios: ['thiago', 'diego', 'caio'],
    exemplo: { servicos: ['corte-classico', 'barba-completa'], dia: 1, ini: '15:00' },
    capa: 'Nossas cadeiras',
    tema: { fonte: 'condensada', forma: 'condensada', modo: 'dark', sombra: 'none', cores: { primary: '#D6A548', secondary: '#9E3B2F', background: '#0E0E10', surface: '#17171A', surface2: '#202024', field: '#121214', text: '#F2EEE6', mutedText: '#A9A39A', border: '#2C2C31', borderStrong: '#45454C', primaryStrong: '#D6A548', primarySoft: '#393122', onPrimary: '#1B150B', ring: '#D6A548', cover1: '#3A3A40', cover2: '#1C1C20', cover3: '#54452C', coverText: '#F2EEE6' } },
  },
  lumi: {
    nome: 'Espaço Lumi', tipo: 'Salon', razaoSocial: 'Espaço Lumi Beleza Ltda.', cnpj: '00.000.003/0001-03',
    telefone: '554830000303', whatsapp: '5548900000303', email: 'ola@espacolumi.com.br', instagram: '@espacolumi',
    endereco: 'Rua Bocaiúva, 455 — Centro', cidade: 'Florianópolis', uf: 'SC', ddd: '5548',
    tagline: 'Cuidado leve, para todo mundo.',
    heroText: 'Corte, cor, terapia capilar, sobrancelhas e unhas no centro de Florianópolis. Um espaço acolhedor para todas as pessoas.',
    destaques: ['Desde 2021', 'Ambiente sem perfume', 'Cachos e crespos', 'Acolhedor para todas as pessoas'],
    sobre: [
      'O Espaço Lumi abriu em 2021 com luz natural, plantas e um ambiente sem perfumes fortes — pensado para quem quer se cuidar sem pressa e sem julgamento.',
      'Cada atendimento começa com uma conversa rápida para entender o que você quer. Atendemos todos os tipos de cabelo, inclusive cacheados e crespos.',
    ],
    regras: { passo: 15, antecedenciaMin: 120, antecedenciaMaxDias: 60, prazoCancelamento: 1440, politica: 'Cancelamento gratuito até 24 horas antes. Em cima da hora, avise pelo WhatsApp.' },
    horario: [null, ['09:00', '19:00'], ['09:00', '19:00'], ['09:00', '19:00'], ['09:00', '19:00'], ['09:00', '19:00'], ['09:00', '15:00']],
    servicos: [
      ['corte', 'Corte', 'Para todos os comprimentos e texturas, com lavagem.', 50, 9000, false],
      ['coloracao', 'Coloração', 'Cor global ou retoque de raiz.', 90, 21000, true],
      ['terapia-capilar', 'Terapia capilar', 'Diagnóstico do couro cabeludo e tratamento.', 60, 14000, false],
      ['design-de-sobrancelhas', 'Design de sobrancelhas', 'Desenho com pinça e linha.', 30, 5000, false],
      ['manicure-e-pedicure', 'Manicure e pedicure', 'Cuidado completo com esmaltação.', 75, 8000, false],
    ],
    profissionais: [
      { key: 'lia', email: 'lia@espacolumi.com.br', nome: 'Lia Moreira', titulo: 'Cabeleireira e fundadora', bio: 'Cortes, cachos e transição capilar.', dono: true, servicos: ['corte', 'coloracao'], agenda: semana([1, 2, 3, 4, 5], [['09:00', '12:00'], ['13:00', '19:00']]) },
      { key: 'pedro', email: 'pedro@espacolumi.com.br', nome: 'Pedro Sá', titulo: 'Colorista e terapeuta capilar', bio: 'Coloração e saúde do couro cabeludo.', servicos: ['coloracao', 'terapia-capilar'], agenda: semana([1, 2, 3, 4, 5, 6], [['09:00', '12:00'], ['13:00', '18:00']], [['09:00', '12:00'], ['13:00', '15:00']]) },
      { key: 'nina', email: 'nina@espacolumi.com.br', nome: 'Nina Okada', titulo: 'Sobrancelhas e unhas', bio: 'Design de sobrancelhas e nail design.', servicos: ['design-de-sobrancelhas', 'manicure-e-pedicure'], agenda: semana([2, 3, 4, 5, 6], [['10:00', '13:00'], ['14:00', '19:00']], [['10:00', '13:00'], ['14:00', '15:00']]) },
    ],
    agendamentos: [
      [1, -21, '15:00', '16:00', 'pedro', 'alex', 'Completed', 'Online', null, ['terapia-capilar']],
      [2, -14, '10:00', '11:00', 'pedro', 'livia', 'Completed', 'Online', null, ['terapia-capilar']],
      [3, -7, '09:00', '09:50', 'lia', 'marcos', 'Completed', 'Online', null, ['corte']],
      [4, 0, '09:00', '09:50', 'lia', 'marcos', 'Completed', 'Online', null, ['corte']],
      [5, 0, '09:00', '10:00', 'pedro', 'livia', 'Confirmed', 'Online', null, ['terapia-capilar'], 'Primeira vez na terapia capilar.'],
      [6, 0, '10:00', '11:15', 'nina', 'eduarda', 'Confirmed', 'Online', null, ['manicure-e-pedicure']],
      [7, 0, '10:30', '11:20', 'lia', 'paula', 'Confirmed', 'Online', null, ['corte']],
      [8, 0, '10:30', '12:00', 'pedro', 'renato', 'NoShow', 'Counter', 'lia', ['coloracao']],
      [9, 0, '11:30', '12:00', 'nina', 'gabi', 'Confirmed', 'Counter', 'nina', ['design-de-sobrancelhas']],
      [10, 0, '13:00', '13:50', 'lia', 'davi', 'Confirmed', 'Online', null, ['corte']],
      [11, 0, '13:00', '14:30', 'pedro', 'camila', 'Confirmed', 'Online', null, ['coloracao']],
      [12, 0, '14:30', '16:00', 'lia', 'felipe', 'Cancelled', 'Online', null, ['coloracao']],
      [13, 0, '15:30', '16:30', 'pedro', 'alex', 'Confirmed', 'Online', null, ['terapia-capilar']],
      [14, 0, '16:30', '17:20', 'lia', 'heitor', 'Confirmed', 'Online', null, ['corte']],
      [15, 8, '14:00', '14:30', 'nina', 'paula', 'Confirmed', 'Online', null, ['design-de-sobrancelhas']],
      [16, 9, '10:00', '11:15', 'nina', 'eduarda', 'Confirmed', 'Online', null, ['manicure-e-pedicure']],
    ],
    bloqueios: ['pedro', 'lia', 'nina'],
    exemplo: { servicos: ['corte', 'coloracao'], dia: 1, ini: '14:00' },
    capa: 'Nossa recepção',
    tema: { fonte: 'sem-serifa', forma: 'moderna', modo: 'light', sombra: '0 1px 2px rgba(14,36,48,.04), 0 8px 24px rgba(14,36,48,.06)', cores: { primary: '#0D7285', secondary: '#7C83E8', background: '#F0F8FB', surface: '#FFFFFF', surface2: '#E2F0F4', field: '#FFFFFF', text: '#112227', mutedText: '#455D63', border: '#D0E2E6', borderStrong: '#A9C3CA', primaryStrong: '#0D7285', primarySoft: '#DDEBEE', onPrimary: '#FFFFFF', ring: '#0D7285', cover1: '#A1C9D2', cover2: '#0D7285', cover3: '#C2C9F3', coverText: '#FFFFFF' } },
  },
};

// Bloqueios iguais nos três salões (docs/seeds/05): consulta (1º da lista), curso (2º), férias (3º, criadas pelo dono)
// e dois feriados do salão todo.
function bloqueiosDe(seed) {
  const [consulta, curso, ferias] = seed.bloqueios;
  const dono = seed.profissionais.find((p) => p.dono).key;
  return [
    { quem: consulta, de: 3, ate: 3, horario: ['14:00', '16:00'], motivo: 'Consulta médica', por: consulta },
    { quem: curso, de: 2, ate: 2, horario: null, motivo: 'Curso de atualização', por: curso },
    { quem: ferias, de: 7, ate: 11, horario: null, motivo: 'Férias', por: dono, dono: true },
    { quem: 'salao', de: 13, ate: 13, horario: null, motivo: 'Feriado — Finados', por: dono, dono: true },
    { quem: 'salao', de: 31, ate: 31, horario: null, motivo: 'Feriado — Consciência Negra', por: dono, dono: true },
  ];
}

const min = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };
const NOMES_TIPO = { Salon: 'Salão de beleza', Barbershop: 'Barbearia' };
const NOMES_TIPO_CURTO = { Salon: 'Salão', Barbershop: 'Barbearia' };
const RESUMO = { aurora: 'Tema claro · tons quentes · serifada', navalha: 'Tema escuro · dourado · condensada', lumi: 'Tema claro · paleta fria · sem serifa' };
const SEMANA_EXT = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const fmtH = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return m === 0 ? `${h}h` : `${h}h${String(m).padStart(2, '0')}`; };

// Mesmo agrupamento da landing real (groupBusinessHours): segunda a domingo, dias seguidos com o mesmo horário.
function gruposHorario(horario) {
  const hr = (d) => (horario[d] ? `${fmtH(horario[d][0])} às ${fmtH(horario[d][1])}` : 'Fechado');
  const grupos = [];
  for (const d of [1, 2, 3, 4, 5, 6, 0]) {
    const ultimo = grupos.at(-1);
    if (ultimo && ultimo.horas === hr(d)) ultimo.dias.push(d);
    else grupos.push({ dias: [d], horas: hr(d) });
  }
  return grupos.map((g) => {
    const a = SEMANA_EXT[g.dias[0]], b = SEMANA_EXT[g.dias.at(-1)].toLowerCase();
    return [g.dias.length === 1 ? a : g.dias.length === 2 ? `${a} e ${b}` : `${a} a ${b}`, g.horas];
  });
}

function construir(slug, s) {
  const servicos = s.servicos.map(([key, nome, desc, dur, cents, aPartir]) => ({ key, nome, desc, dur, cents, preco: cents / 100, aPartir }));
  const porChave = Object.fromEntries(servicos.map((x) => [x.key, x]));
  const equipe = s.profissionais.map((p) => {
    return {
      key: p.key, nome: p.nome, papel: p.titulo, bio: p.bio, dono: !!p.dono, email: p.email,
      servicos: p.servicos.map((k) => servicos.findIndex((x) => x.key === k)), chaves: p.servicos,
      agenda: p.agenda,
    };
  });
  const clientes = Object.fromEntries(CLIENTES.map(([key, nome, fone, email]) => [key, { key, nome, primeiro: nome.split(' ')[0], tel: s.ddd + fone, email, semConta: SEM_CONTA.has(key) }]));
  const agendamentos = s.agendamentos.map(([n, dia, ini, fim, pro, cli, st, canal, por, chaves, obs]) => {
    const itens = chaves.map((k) => porChave[k]);
    const dur = itens.reduce((a, x) => a + x.dur, 0);
    if (min(fim) - min(ini) !== dur) throw new Error(`${slug}-ag-${n}: o fim não bate com a soma das durações`);
    return {
      id: `${slug}-ag-${String(n).padStart(2, '0')}`, dia, ini: min(ini), fim: min(fim), pro, cli, st, canal, por, itens, obs: obs ?? null,
      cents: itens.reduce((a, x) => a + x.cents, 0), aPartir: itens.some((x) => x.aPartir),
    };
  });
  const tema = s.tema;
  const alex = clientes.alex;
  const exemplo = { servicos: s.exemplo.servicos.map((k) => servicos.findIndex((x) => x.key === k)), dia: s.exemplo.dia, ini: min(s.exemplo.ini) };
  const terca = s.horario[2];
  const t = {
    slug, nome: s.nome, tipo: NOMES_TIPO[s.tipo], tipoCurto: NOMES_TIPO_CURTO[s.tipo],
    monograma: s.nome.match(/\p{L}|\p{N}/u)[0].toUpperCase(),
    resumoVisual: RESUMO[slug], tagline: s.tagline, descricaoHero: s.heroText, sobre: s.sobre, destaques: s.destaques,
    endereco: s.endereco, cidade: `${s.cidade} · ${s.uf}`, cidadeNome: s.cidade, uf: s.uf,
    telefone: formatarTelefone(s.telefone), whatsapp: formatarTelefone(s.whatsapp), waLink: s.whatsapp,
    telefoneDigitos: s.telefone, instagram: s.instagram, email: s.email,
    horarios: gruposHorario(s.horario), horario: s.horario,
    abre: min(terca[0]), fecha: min(terca[1]), fechado: s.horario.map((h, i) => (h ? -1 : i)).filter((i) => i >= 0),
    servicos, equipe, capa: s.capa,
    regras: s.regras,
    razaoSocial: s.razaoSocial, cnpj: s.cnpj,
    cliente: { nome: alex.nome, primeiro: alex.primeiro, tel: formatarTelefone(alex.tel), email: alex.email },
    clientes, agendamentos, bloqueios: bloqueiosDe(s), exemplo,
    tema: temaDoSalao(tema.fonte, tema.forma, tema.modo, { ...tema.cores }, tema.sombra),
  };
  return t;
}

function somaD0(n) { return new Date(D0.getFullYear(), D0.getMonth(), D0.getDate() + n); }

export const TENANTS = Object.entries(SEED).map(([slug, s]) => construir(slug, s));

// Salões que só aparecem nas telas de estado (docs/seeds/01): Corte Fino (suspenso) e Tesoura de Ouro (cancelado)
export const CORTE_FINO = { slug: 'cortefino', nome: 'Corte Fino Barbearia' };
export const TESOURA = { slug: 'tesoura', nome: 'Salão Tesoura de Ouro' };

// Fluxo: Confirmado → Em atendimento (automático, no início) → A conferir (automático, no fim) → Concluído (manual).
// Não compareceu e Cancelado são manuais, a qualquer momento. Só "Concluído" entra no histórico do cliente.
export const STATUS = {
  confirmado: ['Confirmado', 'selo-azul'],
  andamento: ['Em atendimento', 'selo-roxo'],
  'a-conferir': ['A conferir', 'selo-alerta'],
  concluido: ['Concluído', 'selo-sucesso'],
  'nao-compareceu': ['Não compareceu', 'selo-erro'],
  cancelado: ['Cancelado', 'selo-erro'],
};

// ---------- Painel: agenda, contadores e exemplos fixos (design D2 e D4) ----------
// "Em atendimento" e "A conferir" são derivados de Confirmed + o "agora" (docs/seeds/05): começou e não terminou = em
// atendimento; terminou e ninguém conferiu = a conferir. Só entra no histórico do cliente o que foi concluído.
const emMinutos = (dia, min) => dia * 1440 + min;
const AGORA_TOTAL = emMinutos(0, AGORA_MIN);
export function statusDeExibicao(a) {
  if (a.st === 'Completed') return 'concluido';
  if (a.st === 'NoShow') return 'nao-compareceu';
  if (a.st === 'Cancelled') return 'cancelado';
  if (emMinutos(a.dia, a.fim) <= AGORA_TOTAL) return 'a-conferir';
  return emMinutos(a.dia, a.ini) <= AGORA_TOTAL ? 'andamento' : 'confirmado';
}

/** Os atendimentos de um dia (D0+`dia`) para o dono (`quem` nulo) ou para um profissional, já com o que a linha mostra. */
function atendimentosDoDia(t, dia, quem) {
  return t.agendamentos
    .filter((a) => a.dia === dia && (!quem || a.pro === quem))
    .sort((a, b) => a.ini - b.ini || a.id.localeCompare(b.id))
    .map((a) => {
      const cliente = t.clientes[a.cli];
      const concluidos = t.agendamentos.filter((x) => x.cli === a.cli && x.st === 'Completed');
      const ultimo = concluidos.reduce((m, x) => (m === null || x.dia > m ? x.dia : m), null);
      return {
        ...a, exibicao: statusDeExibicao(a), cliente, profissional: t.equipe.find((p) => p.key === a.pro),
        lancadoPor: a.por ? t.equipe.find((p) => p.key === a.por) : null,
        concluidos: concluidos.length, ultimaVisita: ultimo,
        dentroDeBloqueio: a.st === 'Confirmed' && t.bloqueios.some((b) => (b.quem === 'salao' || b.quem === a.pro) && a.dia >= b.de && a.dia <= b.ate && (!b.horario || (a.ini < hhmmMin(b.horario[1]) && a.fim > hhmmMin(b.horario[0])))),
      };
    });
}

/** Atendimentos e os quatro contadores da agenda ("agendamentos", "a atender", "concluídos", "a conferir") de um período. */
export function agendaDoPeriodo(t, dias, quem = null) {
  const porDia = dias.map((dia) => ({ dia, itens: atendimentosDoDia(t, dia, quem) }));
  const todos = porDia.flatMap((d) => d.itens);
  const cont = (...sts) => todos.filter((a) => sts.includes(a.exibicao)).length;
  return {
    porDia, todos,
    contadores: { total: todos.length, aAtender: cont('confirmado', 'andamento'), concluidos: cont('concluido'), aConferir: cont('a-conferir') },
  };
}

/** Quem é o profissional de exemplo do painel (o 3º da equipe) e os itens de exemplo das telas de detalhe (D2). */
export function exemplosDoPainel(t) {
  const profissional = t.equipe[2];
  const dono = t.equipe.find((p) => p.dono);
  const proximo = (quem) => t.agendamentos
    .filter((a) => a.st === 'Confirmed' && (!quem || a.pro === quem) && emMinutos(a.dia, a.ini) > AGORA_TOTAL)
    .sort((a, b) => emMinutos(a.dia, a.ini) - emMinutos(b.dia, b.ini) || a.id.localeCompare(b.id))[0];
  const ex = {
    profissional, dono,
    servico: t.servicos[0], membro: t.equipe[1],
    remarcarDono: proximo(null), remarcarPro: proximo(profissional.key),
    clienteBalcao: t.clientes.paula,
  };
  for (const [nome, v] of Object.entries(ex)) if (!v) throw new Error(`${t.slug}: falta o exemplo "${nome}" do painel no seed`);
  return ex;
}

/** Bloqueios do seed para o painel: os do dono (todos) ou de um profissional (os dele e os do salão todo). */
export function bloqueiosDoPainel(t, quem = null) {
  const confirmados = t.agendamentos.filter((a) => a.st === 'Confirmed');
  return t.bloqueios
    .filter((b) => !quem || b.quem === quem || b.quem === 'salao')
    .map((b) => {
      const faixa = b.horario ? [hhmmMin(b.horario[0]), hhmmMin(b.horario[1])] : [0, 1440];
      const conflitos = confirmados.filter((a) => (b.quem === 'salao' || a.pro === b.quem) && a.dia >= b.de && a.dia <= b.ate && a.ini < faixa[1] && a.fim > faixa[0]).length;
      const criador = t.equipe.find((p) => p.key === b.por);
      return { ...b, conflitos, criadoPor: criador.nome, pode: !quem || b.quem === quem };
    })
    .sort((a, b) => a.de - b.de);
}
const hhmmMin = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };

// Para a conferência de e-mails e telefones do gerador (D8): só o que está no seed ou é da plataforma
export const EMAILS_DO_SEED = new Set([
  'admin@zeitvez.com.br',
  ...Object.values(SEED).flatMap((s) => [s.email, ...s.profissionais.map((p) => p.email)]),
  ...CLIENTES.map(([, , , e]) => e).filter(Boolean),
]);
export const TELEFONES_DO_SEED = new Set(
  Object.values(SEED).flatMap((s) => [s.telefone, s.whatsapp, ...CLIENTES.map(([, , f]) => s.ddd + f)]),
);
