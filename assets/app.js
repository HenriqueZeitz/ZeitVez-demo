// JavaScript mínimo do protótipo: só o que ajuda a *enxergar* as telas.
// Nada aqui salva dados, valida formulários ou calcula horários.
(function () {
  const $$ = (sel, raiz = document) => Array.from(raiz.querySelectorAll(sel));

  // ---------- Aviso rápido (toast) ----------
  let toastEl, toastTimer;
  function aviso(msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add('visivel');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('visivel'), 3200);
  }
  window.prototipoAviso = aviso;

  const parametros = new URLSearchParams(location.search);
  const regiaoAviso = document.querySelector('[data-aviso-painel]');
  if (regiaoAviso) {
    // Painel: "?aviso=remarcado" ou "?aviso=criado" aparece numa região anunciada (como no produto real), sem toast
    const texto = JSON.parse(regiaoAviso.dataset.avisos)[parametros.get('aviso')];
    if (texto) { regiaoAviso.textContent = texto; regiaoAviso.className += ' border border-borda bg-superficie-2 p-3 font-medium'; }
  } else if (parametros.get('aviso')) setTimeout(() => aviso(parametros.get('aviso')), 300);

  $$('[data-toast]').forEach((el) =>
    el.addEventListener('click', (e) => {
      if (el.tagName === 'A' && el.getAttribute('href') === '#') e.preventDefault();
      aviso(el.dataset.toast);
    })
  );

  // ---------- Menu mobile ----------
  $$('[data-menu-botao]').forEach((botao) => {
    const menu = document.getElementById(botao.getAttribute('aria-controls'));
    botao.addEventListener('click', () => {
      const aberto = botao.getAttribute('aria-expanded') === 'true';
      botao.setAttribute('aria-expanded', String(!aberto));
      menu.hidden = aberto;
    });
    $$('a', menu).forEach((a) => a.addEventListener('click', () => {
      botao.setAttribute('aria-expanded', 'false');
      menu.hidden = true;
    }));
  });

  // ---------- Abas (controladas pelo #hash da URL) ----------
  function ativarAba(nome) {
    $$('[data-abas]').forEach((grupo) => {
      const abas = $$('[data-aba]', grupo);
      if (!abas.some((a) => a.dataset.aba === nome)) return;
      abas.forEach((a) => {
        const sel = a.dataset.aba === nome;
        a.setAttribute('aria-selected', String(sel));
        const painel = document.getElementById('aba-' + a.dataset.aba);
        if (painel) painel.hidden = !sel;
      });
    });
  }
  $$('[data-aba]').forEach((a) =>
    a.addEventListener('click', (e) => {
      e.preventDefault();
      history.replaceState(null, '', '#' + a.dataset.aba);
      ativarAba(a.dataset.aba);
    })
  );
  $$('a[data-ir-aba]').forEach((a) =>
    a.addEventListener('click', (e) => {
      e.preventDefault();
      history.replaceState(null, '', '#' + a.dataset.irAba);
      ativarAba(a.dataset.irAba);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    })
  );
  if (location.hash) ativarAba(location.hash.slice(1));
  window.addEventListener('hashchange', () => ativarAba(location.hash.slice(1)));

  // ---------- Opções em cartão com rádio/checkbox: realce do selecionado ----------
  $$('[data-opcao-radio] input[type="radio"]').forEach((r) =>
    r.addEventListener('change', () => {
      $$(`input[type="radio"][name="${r.name}"]`).forEach((x) => {
        const cartao = x.closest('[data-opcao-radio]');
        if (cartao) cartao.classList.toggle('ativo', x.checked);
      });
    })
  );

  // Modo claro/escuro da Aparência: realce do cartão marcado
  const cartoesModo = $$('label.opcao > input[data-tema-modo]');
  const marcarModo = () => cartoesModo.forEach((x) => x.parentElement.setAttribute('aria-current', String(x.checked)));
  cartoesModo.forEach((r) => r.addEventListener('change', marcarModo));
  marcarModo();

  // Rádio que mostra um bloco quando marcado (ex.: horas do bloqueio)
  $$('input[type="radio"]').forEach((r) =>
    r.addEventListener('change', () => {
      $$(`input[type="radio"][name="${r.name}"][data-revela]`).forEach((x) => {
        const alvo = document.getElementById(x.dataset.revela);
        if (alvo) alvo.hidden = !x.checked;
      });
    })
  );

  // ---------- Vários serviços: soma tempo e valor ----------
  const fmtDuracao = (min) => {
    const h = Math.floor(min / 60), m = min % 60;
    if (!h) return m + ' min';
    return m ? h + 'h' + String(m).padStart(2, '0') : h + 'h';
  };
  $$('[data-lista-servicos]').forEach((lista) => {
    const barra = lista.parentElement.querySelector('[data-soma-servicos]');
    if (!barra) return;
    const atualizar = () => {
      const marcados = $$('[data-servico]', lista).filter((c) => c.checked);
      $$('[data-servico]', lista).forEach((c) => c.closest('.opcao').classList.toggle('ativo', c.checked));
      const dur = marcados.reduce((n, c) => n + Number(c.dataset.dur), 0);
      const valor = marcados.reduce((n, c) => n + Number(c.dataset.preco), 0);
      const aPartir = marcados.some((c) => c.hasAttribute('data-apartir'));
      barra.querySelector('[data-soma-qtd]').textContent = marcados.length === 1 ? '1 serviço' : marcados.length + ' serviços';
      barra.querySelector('[data-soma-dur]').textContent = fmtDuracao(dur);
      barra.querySelector('[data-soma-preco]').textContent = marcados.length ? (aPartir ? 'a partir de ' : '') + 'R$ ' + valor.toLocaleString('pt-BR') : 'Escolha pelo menos um serviço';
      const continuar = barra.querySelector('[data-soma-continuar]');
      continuar.classList.toggle('opacity-50', !marcados.length);
      continuar.classList.toggle('pointer-events-none', !marcados.length);
      continuar.setAttribute('aria-disabled', String(!marcados.length));
    };
    $$('[data-servico]', lista).forEach((c) => c.addEventListener('change', atualizar));
    atualizar();
  });

  // ---------- Agenda do painel: status e contadores (só visual, sem aviso) ----------
  const mapaStatus = (() => {
    const el = document.querySelector('[data-status-mapa]');
    return el ? JSON.parse(el.dataset.statusMapa) : null;
  })();
  // Quais botões valem para cada estado (a mesma tabela que o gerador usa para o estado de partida)
  const acoesDoEstado = (estado, dono) => {
    const iniciado = estado === 'andamento' || estado === 'a-conferir';
    const aberto = estado === 'confirmado' || iniciado;
    return { complete: iniciado || estado === 'nao-compareceu', 'no-show': iniciado || estado === 'concluido', cancel: aberto, reschedule: aberto, 'change-professional': aberto && dono };
  };
  function definirStatus(item, chave) {
    const [rotulo, classe] = mapaStatus[chave];
    item.dataset.status = chave;
    $$('[data-selo]', item).forEach((s) => {
      s.classList.remove(...Object.values(mapaStatus).map((v) => v[1]));
      s.classList.add(classe);
      s.textContent = rotulo;
    });
    const permitidas = acoesDoEstado(chave, item.dataset.nivel === 'dono');
    $$('[data-acao]', item).forEach((b) => (b.hidden = !permitidas[b.dataset.acao]));
    $$('[data-sem-acoes]', item).forEach((p) => (p.hidden = Object.values(permitidas).some(Boolean)));
  }
  function recontar() {
    const visiveis = $$('[data-agendamento]').filter((i) => !i.hidden);
    const conta = (...estados) => visiveis.filter((i) => estados.includes(i.dataset.status)).length;
    const numeros = { total: visiveis.length, atender: conta('confirmado', 'andamento'), concluidos: conta('concluido'), conferir: conta('a-conferir') };
    $$('[data-contador]').forEach((el) => {
      const n = numeros[el.dataset.contador];
      el.querySelector('[data-texto]').textContent = n + ' ' + (n === 1 ? el.dataset.singular : el.dataset.plural);
      if (el.dataset.contador === 'conferir') el.classList.toggle('contador-alerta', n > 0);
    });
    $$('[data-conta-conferir]').forEach((el) => (el.textContent = numeros.conferir));
    $$('[data-aviso-conferir]').forEach((el) => (el.hidden = numeros.conferir === 0));
  }
  if (mapaStatus) {
    const destinoDaAcao = { complete: 'concluido', 'no-show': 'nao-compareceu', cancel: 'cancelado' };
    $$('button[data-acao]').forEach((b) =>
      b.addEventListener('click', () => {
        definirStatus(b.closest('[data-agendamento]'), destinoDaAcao[b.dataset.acao]);
        recontar();
      })
    );
    $$('[data-concluir-todos]').forEach((b) =>
      b.addEventListener('click', () => {
        $$('[data-agendamento][data-status="a-conferir"]').forEach((item) => definirStatus(item, 'concluido'));
        recontar();
      })
    );
    // Filtro por profissional (só o dono): esconde as linhas dos outros, sem trocar de página
    $$('[data-filtro-profissional] button').forEach((b) =>
      b.addEventListener('click', () => {
        $$('[data-filtro-profissional] button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
        $$('[data-agendamento]').forEach((item) => (item.hidden = b.dataset.profissional !== 'todos' && item.dataset.pro !== b.dataset.profissional));
        recontar();
      })
    );
  }

  // Remove um item da lista (ex.: desfazer bloqueio, desconectar aparelho) — só visual
  $$('[data-remover-item]').forEach((b) =>
    b.addEventListener('click', () => {
      const item = b.closest('li');
      if (item) item.hidden = true;
    })
  );

  // ---------- ZeitVez: alternar tema claro/escuro ----------
  $$('[data-alternar-tema]').forEach((b) =>
    b.addEventListener('click', () => {
      const raiz = document.documentElement;
      const atual = raiz.dataset.tema || (matchMedia('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro');
      const novo = atual === 'escuro' ? 'claro' : 'escuro';
      raiz.dataset.tema = novo;
      try { localStorage.setItem('zeitvez-tema', novo); } catch (e) { /* sem armazenamento: vale só nesta página */ }
      $$('[data-tema-anuncio]').forEach((r) => (r.textContent = novo === 'escuro' ? 'Tema escuro ativado.' : 'Tema claro ativado.'));
    })
  );

  // ---------- Seleção visual (ex.: dias) ----------
  $$('[data-grupo-selecao]').forEach((grupo) => {
    const opcoes = $$('[data-opcao]', grupo);
    opcoes.forEach((op) =>
      op.addEventListener('click', () => {
        opcoes.forEach((o) => o.classList.toggle('ativo', o === op));
        const alvo = document.getElementById(grupo.dataset.grupoSelecao);
        if (alvo && op.dataset.rotulo) alvo.textContent = op.dataset.rotulo;
      })
    );
  });

  // ---------- Formulários: não enviam nada; mostram o aviso e levam à tela seguinte ----------
  // "?voltar=arquivo.html" (só um arquivo da mesma pasta) troca o destino: "Entrar" e "Criar conta" vindos da
  // confirmação do agendamento voltam para ela.
  const voltar = parametros.get('voltar');
  const voltarValido = voltar && /^[a-z0-9-]+\.html$/.test(voltar) ? voltar : null;
  const arquivoAtual = location.pathname.split('/').pop();
  $$('form[data-ir]').forEach((form) =>
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      aviso('Demonstração: nada foi enviado.');
      const destino = voltarValido && /^(entrar|criar-conta)\.html$/.test(arquivoAtual) ? voltarValido : form.dataset.ir;
      setTimeout(() => { location.href = destino; }, 900);
    })
  );
  // "Crie sua conta" e "Entrar" levam junto o destino da volta
  $$('a[data-preserva-voltar]').forEach((a) => {
    if (voltarValido) a.href += '?voltar=' + voltarValido;
  });

  // ---------- Avisos de página (por parâmetro na URL) ----------
  if (parametros.get('conta') === 'excluida') $$('[data-aviso-conta]').forEach((el) => (el.hidden = false));
  if (parametros.get('remarcado') === '1') $$('[data-aviso-remarcado]').forEach((el) => (el.hidden = false));

  // ---------- Menu suspenso da conta (topo do salão) ----------
  $$('[data-menu-suspenso]').forEach((raiz) => {
    const botao = raiz.querySelector('button');
    const menu = document.getElementById(botao.getAttribute('aria-controls'));
    const fechar = () => { menu.hidden = true; botao.setAttribute('aria-expanded', 'false'); };
    botao.addEventListener('click', () => {
      menu.hidden = !menu.hidden;
      botao.setAttribute('aria-expanded', String(!menu.hidden));
    });
    document.addEventListener('click', (e) => { if (!raiz.contains(e.target)) fechar(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { fechar(); botao.focus(); } });
  });

  // ---------- Escolha de dia: um painel de horários por dia ----------
  $$('[data-seletor-dia]').forEach((raiz) => {
    const botoes = $$('button[data-painel]', raiz);
    botoes.forEach((b) =>
      b.addEventListener('click', () => {
        botoes.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
        $$('[data-painel-dia]', raiz).forEach((p) => (p.hidden = p.id !== b.dataset.painel));
      })
    );
  });

  // ---------- Serviços marcáveis: realce do cartão ----------
  $$('[data-opcao-check] input[type="checkbox"]').forEach((c) =>
    c.addEventListener('change', () => c.closest('[data-opcao-check]').classList.toggle('ativo', c.checked))
  );

  // ---------- Diálogos ----------
  let alvoDialogo = null;
  $$('[data-abrir-dialogo]').forEach((botao) =>
    botao.addEventListener('click', () => {
      alvoDialogo = botao.dataset.alvo ? document.getElementById(botao.dataset.alvo) : null;
      const dlg = document.getElementById(botao.dataset.abrirDialogo);
      const titulo = botao.dataset.tituloDialogo;
      if (botao.dataset.resumoDialogo) $$('[data-resumo-alvo]', dlg).forEach((r) => (r.textContent = botao.dataset.resumoDialogo));
      if (titulo) $$('[data-titulo-dialogo-alvo]', dlg).forEach((t) => (t.textContent = titulo));
      dlg.showModal();
    })
  );
  $$('[data-fechar-dialogo]').forEach((b) =>
    b.addEventListener('click', () => {
      b.closest('dialog').close();
      if (b.dataset.toastAoFechar) aviso(b.dataset.toastAoFechar);
    })
  );
  $$('dialog.dialogo').forEach((dlg) =>
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); })
  );

  // Cancelar agendamento (cliente) — apenas muda o visual do cartão
  $$('[data-confirmar-cancelamento]').forEach((b) =>
    b.addEventListener('click', () => {
      b.closest('dialog').close();
      if (!alvoDialogo) return;
      const estado = alvoDialogo.querySelector('[data-estado]');
      if (estado) { estado.className = 'rounded-full border border-borda px-3 py-1 text-xs font-semibold text-suave'; estado.textContent = 'Cancelado'; }
      $$('[data-acoes]', alvoDialogo).forEach((el) => (el.hidden = true));
      alvoDialogo.style.opacity = '.65';
    })
  );

  // ---------- Admin: lista de salões (busca e filtro por status, sem recarregar) ----------
  const CLASSES_FILTRO_ATIVO = ['border-primaria', 'bg-primaria', 'text-sobre-primaria'];
  const CLASSES_FILTRO_INATIVO = ['border-borda', 'bg-superficie', 'hover:bg-superficie-2'];
  $$('[data-lista-saloes]').forEach((raiz) => {
    const campo = raiz.querySelector('[data-busca-campo]');
    const filtros = $$('[data-filtro-status]', raiz);
    const contagem = raiz.querySelector('[data-contagem]');
    const vazio = raiz.querySelector('[data-vazio]');
    let status = 'todos';
    const aplicar = () => {
      const consulta = campo.value.trim().toLowerCase();
      $$('[data-salao]', raiz).forEach((el) => {
        el.hidden = !((status === 'todos' || el.dataset.status === status) && el.dataset.busca.includes(consulta));
      });
      const n = $$('tr[data-salao]', raiz).filter((el) => !el.hidden).length;
      const filtrado = status !== 'todos' || consulta !== '';
      contagem.textContent = (n === 1 ? '1 salão' : n + ' salões') + (filtrado ? ' encontrados com este filtro' : '');
      raiz.querySelector('[data-tabela]').hidden = n === 0;
      raiz.querySelector('[data-cartoes]').hidden = n === 0;
      vazio.hidden = n !== 0;
    };
    const escolher = (valor) => {
      status = valor;
      filtros.forEach((f) => {
        const ativo = f.dataset.filtroStatus === valor;
        if (ativo) f.setAttribute('aria-current', 'true'); else f.removeAttribute('aria-current');
        f.classList.remove(...CLASSES_FILTRO_ATIVO, ...CLASSES_FILTRO_INATIVO);
        f.classList.add(...(ativo ? CLASSES_FILTRO_ATIVO : CLASSES_FILTRO_INATIVO));
      });
      aplicar();
    };
    filtros.forEach((f) => f.addEventListener('click', (e) => { e.preventDefault(); escolher(f.dataset.filtroStatus); }));
    raiz.querySelector('[data-busca-form]').addEventListener('submit', (e) => { e.preventDefault(); aplicar(); });
    campo.addEventListener('input', aplicar);
    raiz.querySelector('[data-limpar-filtros]').addEventListener('click', (e) => { e.preventDefault(); campo.value = ''; escolher('todos'); campo.focus(); });
  });

  // ---------- Admin: prévia do endereço enquanto se digita o subdomínio ----------
  $$('[data-subdominio]').forEach((campo) => {
    const alvo = document.getElementById(campo.getAttribute('aria-describedby').split(' ')[0]);
    const padrao = alvo.textContent;
    campo.addEventListener('input', () => {
      const valor = campo.value.trim().toLowerCase();
      if (!valor) { alvo.textContent = padrao; return; }
      const forte = document.createElement('strong');
      forte.className = 'font-semibold break-all text-texto';
      forte.textContent = valor + '.' + campo.dataset.base;
      alvo.textContent = 'Endereço do site: ';
      alvo.appendChild(forte);
    });
  });

  // ---------- Admin: formulários e caixas de confirmação (nada é enviado) ----------
  $$('form[data-ir-aviso]').forEach((form) =>
    form.addEventListener('submit', (e) => { e.preventDefault(); aviso('Demonstração: nada foi enviado.'); })
  );
  $$('[data-confirmar-admin]').forEach((b) =>
    b.addEventListener('click', () => {
      b.closest('dialog').close();
      aviso('Demonstração: nada foi enviado.');
    })
  );
  // "Cancelar salão" só libera o botão com o subdomínio digitado (o foco volta ao botão de origem ao fechar, como no real)
  $$('[data-confirma-subdominio]').forEach((campo) => {
    const dlg = campo.closest('dialog');
    const botao = dlg.querySelector('[data-requer-confirmacao]');
    const atualizar = () => { botao.disabled = campo.value.trim().toLowerCase() !== campo.dataset.confirmaSubdominio; };
    campo.addEventListener('input', atualizar);
    dlg.addEventListener('close', () => { campo.value = ''; atualizar(); });
  });
  if (parametros.get('criado') === '1') $$('[data-aviso-criado]').forEach((el) => (el.hidden = false));

  // ---------- Painel > Meu site: pré-visualização do tema ----------
  const preview = document.getElementById('preview-tema');
  if (preview) {
    const definir = (v, valor) => preview.style.setProperty(v, valor);
    const contraste = (hex) => {
      const n = parseInt(hex.slice(1), 16);
      const [r, g, b] = [n >> 16, (n >> 8) & 255, n & 255].map((c) => {
        c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.4 ? '#141414' : '#ffffff';
    };
    const aplicarCor = (v, valor) => {
      definir(v, valor);
      if (v === '--cor-primaria') {
        definir('--cor-sobre-primaria', contraste(valor));
        definir('--cor-primaria-suave', `color-mix(in srgb, ${valor} 16%, var(--cor-superficie))`);
      }
      $$(`[data-hex-de="${v}"]`).forEach((el) => { if (el.tagName === 'INPUT') el.value = valor.toUpperCase(); else el.textContent = valor.toUpperCase(); });
    };
    $$('[data-tema-var]').forEach((inp) =>
      inp.addEventListener('input', () => aplicarCor(inp.dataset.temaVar, inp.value))
    );
    // O código digitado e o seletor de cor andam juntos
    $$('input[data-hex-de]').forEach((inp) =>
      inp.addEventListener('input', () => {
        if (!/^#[0-9a-fA-F]{6}$/.test(inp.value)) return;
        const seletor = document.querySelector('input[type="color"][data-tema-var="' + inp.dataset.hexDe + '"]');
        if (seletor) seletor.value = inp.value.toLowerCase();
        aplicarCor(inp.dataset.hexDe, inp.value);
      })
    );
    const fonte = document.querySelector('[data-tema-fonte]');
    if (fonte) fonte.addEventListener('change', () => {
      const op = fonte.selectedOptions[0];
      definir('--fonte-titulo', op.dataset.titulo);
      definir('--fonte-corpo', op.dataset.corpo);
      definir('--titulo-caixa', op.dataset.caixa || 'none');
    });
    $$('[data-tema-modo]').forEach((r) =>
      r.addEventListener('change', () => {
        Object.entries(JSON.parse(r.dataset.temaModo)).forEach(([v, valor]) => definir(v, valor));
      })
    );
    $$('[data-tema-preset]').forEach((b) =>
      b.addEventListener('click', () => {
        const p = JSON.parse(b.dataset.temaPreset);
        Object.entries(p.vars).forEach(([v, valor]) => definir(v, valor));
        $$('[data-tema-var]').forEach((inp) => {
          if (p.vars[inp.dataset.temaVar]) { inp.value = p.vars[inp.dataset.temaVar]; aplicarCor(inp.dataset.temaVar, inp.value); }
        });
        if (fonte) fonte.value = p.fonte;
        const modo = document.querySelector(`[data-tema-modo][value="${p.modo}"]`);
        if (modo) modo.checked = true;
        aviso('Tema "' + p.nome + '" aplicado na pré-visualização.');
      })
    );
  }

  // ---------- Atalhos do protótipo (botão flutuante "Telas") ----------
  // O mapa vem de assets/telas.js, escrito pelo gerador a partir da lista de páginas que ele mesmo gera.
  if (window.self === window.top && !document.body.hasAttribute('data-sem-atalhos') && window.ZEITVEZ_TELAS) {
    const r = document.body.dataset.raiz || '';
    const grupos = window.ZEITVEZ_TELAS;
    const fab = document.createElement('div');
    fab.className = 'proto-fab';
    fab.innerHTML =
      '<button type="button" aria-expanded="false" aria-controls="proto-nav">▦ Telas</button>' +
      '<nav id="proto-nav" hidden aria-label="Telas do protótipo">' +
      grupos.map(([g, links]) => '<p>' + g + '</p>' + links.map(([t, h, rota]) => '<a href="' + r + h + '"' + (rota ? ' title="' + rota + '"' : '') + '>' + t + '</a>').join('')).join('') +
      '</nav>';
    document.body.appendChild(fab);
    const botao = fab.querySelector('button');
    const nav = fab.querySelector('nav');
    botao.addEventListener('click', () => {
      nav.hidden = !nav.hidden;
      botao.setAttribute('aria-expanded', String(!nav.hidden));
    });
    document.addEventListener('click', (e) => {
      if (!fab.contains(e.target)) { nav.hidden = true; botao.setAttribute('aria-expanded', 'false'); }
    });
  }
})();
