// Horários livres e a escolha de exemplo do fluxo de agendamento, usados pelo site do salão (cliente) e pelo painel (balcão e remarcação).
import { duracao, hora, minutos, somaDias, somaServicos, HOJE, AGORA_MIN, dataSlot } from './comum.mjs';


// ---------- Horários livres do seed (vitrine; D3 e D4 do design) ----------
// Aproximação legível do cálculo da API (que continua sendo a fonte da verdade no produto): expediente do profissional
// recortado pelo horário do salão, menos agendamentos não cancelados e bloqueios do seed, inícios a cada passo em que a
// duração inteira cabe dentro de um mesmo intervalo, só depois de AGORA + antecedência mínima e até a antecedência máxima.
const MIN_DIA = 1440;
const emIntervalo = (a, b, c, d) => a < d && c < b; // [a,b) cruza [c,d)

function ocupacao(t, proKey, dia) {
  const faixas = [];
  for (const a of t.agendamentos) {
    if (a.pro === proKey && a.dia === dia && a.st !== 'Cancelled') faixas.push([a.ini, a.fim]);
  }
  for (const b of t.bloqueios) {
    if ((b.quem === proKey || b.quem === 'salao') && dia >= b.de && dia <= b.ate) {
      faixas.push(b.horario ? [minutos(b.horario[0]), minutos(b.horario[1])] : [0, MIN_DIA]);
    }
  }
  return faixas;
}

function iniciosDoProfissional(t, p, duracaoMin, dia) {
  const data = somaDias(HOJE, dia);
  const salao = t.horario[data.getDay()];
  if (!salao || dia < 0 || dia > t.regras.antecedenciaMaxDias) return [];
  const [abre, fecha] = [minutos(salao[0]), minutos(salao[1])];
  const faixas = ocupacao(t, p.key, dia);
  const limite = AGORA_MIN + t.regras.antecedenciaMin - dia * MIN_DIA; // primeiro início permitido, em minutos do dia
  const inicios = [];
  for (const [i, f] of p.agenda[data.getDay()] ?? []) {
    const de = Math.max(minutos(i), abre), ate = Math.min(minutos(f), fecha);
    for (let m = de; m + duracaoMin <= ate; m += t.regras.passo) {
      if (m < limite) continue;
      if (faixas.some(([a, b]) => emIntervalo(m, m + duracaoMin, a, b))) continue;
      inicios.push(m);
    }
  }
  return inicios;
}

/**
 * Inícios livres (minutos desde a meia-noite) de `quem` (chave do profissional ou 'sem-preferencia') para atendimentos de
 * `duracaoMin` no dia D0+`dia`. Com "Sem preferência", é a união dos profissionais que fazem todos os `servicoKeys`.
 */
export function horariosLivres(t, quem, duracaoMin, dia, servicoKeys = []) {
  const pros = quem === 'sem-preferencia'
    ? t.equipe.filter((p) => servicoKeys.every((k) => p.chaves.includes(k)))
    : t.equipe.filter((p) => p.key === quem);
  const todos = new Set(pros.flatMap((p) => iniciosDoProfissional(t, p, duracaoMin, dia)));
  return [...todos].sort((a, b) => a - b);
}

/** Card "Próximo horário livre": o menor serviço que alguém faz, o primeiro início dos próximos 14 dias. */
export function proximoHorarioLivre(t) {
  const oferecidos = new Set(t.equipe.flatMap((p) => p.chaves));
  const servico = t.servicos.filter((x) => oferecidos.has(x.key)).reduce((a, b) => (b.dur < a.dur ? b : a));
  for (let dia = 0; dia < 14; dia++) {
    const [ini] = horariosLivres(t, 'sem-preferencia', servico.dur, dia, [servico.key]);
    if (ini !== undefined) return { dia, ini, servico, rotulo: dataSlot(somaDias(HOJE, dia), ini), nota: `para atendimentos de ${duracao(servico.dur)}` };
  }
  return null;
}

/** A escolha de exemplo do fluxo (profissional, serviços, dia e hora); o gerador falha se a hora não estiver livre. */
export function escolhaDeExemplo(t) {
  const pro = t.equipe[0];
  const servicos = t.exemplo.servicos.map((i) => t.servicos[i]);
  const tot = somaServicos(servicos);
  const livres = horariosLivres(t, pro.key, tot.dur, t.exemplo.dia);
  if (!livres.includes(t.exemplo.ini)) throw new Error(`${t.slug}: ${hora(t.exemplo.ini)} não está livre para ${pro.nome} em D0+${t.exemplo.dia} (livres: ${livres.map(hora).join(', ')})`);
  const data = somaDias(HOJE, t.exemplo.dia);
  return { pro, servicos, tot, dia: t.exemplo.dia, data, ini: t.exemplo.ini, fim: t.exemplo.ini + tot.dur };
}

/** Os dias (D0..D0+13) com horários livres, no formato da etapa "Quando?" e de "Remarcar". */
export function diasComHorarios(t, quem, duracaoMin, servicoKeys = [], { dias = 14, incluir = null } = {}) {
  const lista = [];
  for (let dia = 0; dia < dias; dia++) {
    const inicios = horariosLivres(t, quem, duracaoMin, dia, servicoKeys);
    const extra = incluir && incluir.dia === dia && !inicios.includes(incluir.ini) ? [incluir.ini] : [];
    const todos = [...inicios, ...extra].sort((a, b) => a - b);
    if (todos.length) lista.push({ dia, data: somaDias(HOJE, dia), inicios: todos });
  }
  return lista;
}
