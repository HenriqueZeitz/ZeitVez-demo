# PRD — ZeitVez (Protótipo visual)

> **Status:** vitrine sincronizada com o produto real (desde 2026-11-24) · rascunho v0.2 de 2026-10-14 mantido abaixo como histórico · **Fonte:** ROADMAP.md (no repositório do produto)
> **Natureza:** vitrine estática em HTML, sem backend, com os dados fictícios do seed do produto. **Nenhuma funcionalidade real é desenvolvida aqui.** Quando o `web/` muda, o protótipo é atualizado (ver o README desta pasta).
> **Nota histórica:** até 2026-11-24 o produto se chamava "Studio One" neste protótipo; o nome atual é ZeitVez.

> **O que mudou em 2026-11-24:** o protótipo deixou de ser a referência de design (o produto real foi construído a partir dele) e passou a ser a **vitrine** do ZeitVez, para apresentar a salões e barbearias como o produto ficou. O texto abaixo é o PRD original da fase de desenho e não foi reescrito.

---

## 1. Resumo

**ZeitVez** é um SaaS white-label vendido para **salões de beleza e barbearias**. Cada salão (tenant) recebe um site próprio — landing page, login do cliente e agendamento online — acessado por subdomínio ou domínio próprio.

Este PRD cobre o **protótipo**: um conjunto de páginas HTML estáticas, com dados fixos escritos à mão, só para **ver e sentir como o produto vai ficar** (visual, textos, navegação entre telas) antes de gastar tempo no desenvolvimento real.

## 2. Objetivo

Ter, o mais rápido possível, algo clicável que permita:

| # | Objetivo |
|---|---|
| O1 | Decidir o visual da landing do salão e do fluxo de agendamento |
| O2 | Ver na prática que o **mesmo layout** funciona com identidades diferentes (salão vs. barbearia, claro vs. escuro) |
| O3 | Mostrar para salões/barbearias em conversas de venda e coletar feedback |
| O4 | Descobrir telas, campos e textos que faltam **antes** de modelar o banco e escrever código |

## 3. Princípios do protótipo

1. **É desenho, não software.** Nada de banco, login real, cálculo de horários, middleware, API ou persistência.
2. **Dados fixos.** Nomes, serviços, preços, horários e agendamentos estão escritos direto no HTML.
3. **Navegação por links.** Botões levam para a próxima página (`<a href>`). Interatividade só onde ajuda a *enxergar* algo (ex.: alternar tema, abrir/fechar menu), com JavaScript mínimo.
4. **Mobile-first.** Cada tela é pensada primeiro para celular, depois ajustada para desktop.
5. **Neutro.** Nada que amarre o produto a público feminino; copy e paleta servem para salão e barbearia.
6. **Descartável.** O código do protótipo **não** será reaproveitado no produto real; o que se aproveita são as decisões (telas, textos, campos, estilo).

## 4. Fora de escopo

Next.js, TypeScript, React, Tailwind em build, banco de dados, Prisma, Supabase, Auth.js, multi-tenancy real (middleware/hostname), cálculo de slots, geração real de `.ics`, deploy, Docker, Caddy, planos/níveis de assinatura, pagamentos, notificações, OpenSpec.

> OpenSpec e a stack real entram **depois**, no desenvolvimento do produto (ver §10).

## 5. Telas a mockar

### 5.1 Site institucional do ZeitVez (captação de salões)
| Tela | Arquivo | Conteúdo |
|---|---|---|
| Home | `index.html` | Hero com proposta de valor, benefícios, demonstração (links para os 3 salões de exemplo), bloco "fale conosco" (WhatsApp) |

### 5.2 Site do salão/barbearia (repetido para cada tenant de exemplo)
| Tela | Arquivo | Conteúdo |
|---|---|---|
| Landing | `{tenant}/index.html` | Hero (logo, nome, tagline, botão "Agendar"), serviços com duração e preço, equipe, galeria, sobre, horário de funcionamento, localização, contato (telefone, WhatsApp, Instagram), rodapé "Feito com ZeitVez" |
| Login / Cadastro | `{tenant}/entrar.html` | Formulário de login e link para cadastro (nome, telefone, e-mail, senha) — o botão apenas leva à próxima tela |
| Agendar — 1. Serviço | `{tenant}/agendar-servico.html` | Lista de serviços para escolher |
| Agendar — 2. Profissional | `{tenant}/agendar-profissional.html` | Profissionais + opção "sem preferência" |
| Agendar — 3. Data e horário | `{tenant}/agendar-horario.html` | Seletor de dia + grade de horários (alguns marcados como indisponíveis, só visualmente) |
| Agendar — 4. Confirmação | `{tenant}/agendar-confirmar.html` | Resumo do agendamento + campo de observação |
| Agendar — 5. Sucesso | `{tenant}/agendar-sucesso.html` | Mensagem de confirmação + botão "Adicionar ao calendário" (sem função real) |
| Meus agendamentos | `{tenant}/meus-agendamentos.html` | Próximos e passados, botão "Cancelar" (visual) |

### 5.3 Painel do dono do salão
| Tela | Arquivo | Conteúdo |
|---|---|---|
| Agenda | `{tenant}/painel/agenda.html` | Lista de agendamentos do dia/semana com status |
| Meu site | `{tenant}/painel/meu-site.html` | Formulário de dados e tema (cores, fonte); preview ao lado, estático |
| Serviços e profissionais | `{tenant}/painel/cadastros.html` | Tabelas com botões de adicionar/editar (visuais) |

> O painel pode ser feito só para **um** tenant de exemplo, para não repetir trabalho.

### 5.4 Painel admin do ZeitVez
| Tela | Arquivo | Conteúdo |
|---|---|---|
| Tenants | `admin/index.html` | Tabela: nome, endereço, status (ativo/suspenso), botão de suspender/reativar (visual) |
| Novo tenant | `admin/novo.html` | Formulário: nome, slug, tema inicial |

### 5.5 Telas de estado
| Tela | Arquivo | Quando aparece (explicado na tela) |
|---|---|---|
| Site indisponível | `estados/suspenso.html` | Salão com assinatura suspensa |
| Salão não encontrado | `estados/nao-encontrado.html` | Endereço que não corresponde a nenhum salão |

## 6. Salões de exemplo

| Tenant | Tipo | Visual |
|---|---|---|
| **Studio Aurora** | Salão | Tema claro, tons quentes, fonte serifada |
| **Barbearia Navalha** | Barbearia | Tema escuro, fonte condensada |
| **Espaço Lumi** | Salão | Terceiro visual (paleta fria, fonte sem serifa), mostra a flexibilidade do tema |

Cada um com 4–6 serviços, 2–3 profissionais, 4–6 fotos (placeholders ou imagens livres), horário e contatos fictícios. O salão **suspenso** não precisa de site próprio — basta a tela de estado.

**Tema por CSS variables:** cada tenant define cor primária, cor secundária, fonte e modo claro/escuro em um bloco `:root` no próprio CSS. O layout é o mesmo; só mudam as variáveis. Isso demonstra, em miniatura, o mecanismo que será usado no produto real.

## 7. Fluxos de navegação a conseguir percorrer

1. **Cliente final:** landing → Agendar → login/cadastro → serviço → profissional → horário → confirmação → sucesso → meus agendamentos.
2. **Dono:** painel → agenda → meu site → cadastros.
3. **Admin:** lista de tenants → novo tenant.
4. **Estados:** acessar as telas de suspenso e não encontrado.
5. **Comparação de identidade:** abrir Aurora, Navalha e Lumi lado a lado e ver o mesmo layout com visuais distintos.

## 8. Stack e estrutura

| Item | Escolha |
|---|---|
| Páginas | HTML estático |
| Estilo | **Tailwind via CDN** (sem build) + um `tema.css` por tenant com as variáveis |
| JavaScript | Vanilla, apenas o mínimo (ex.: menu mobile, alternar abas) |
| Imagens | Placeholders ou imagens livres de direitos |
| Execução | Abrir `index.html` no navegador (ou servidor estático simples) |

```
prototipo/
├─ docs/PRD.md
├─ index.html                 # site institucional ZeitVez
├─ assets/                    # imagens e estilos compartilhados
├─ aurora/                    # tenant 1 (tema claro/serifado)
│  ├─ tema.css
│  ├─ index.html, entrar.html, agendar-*.html, meus-agendamentos.html
│  └─ painel/ (agenda, meu-site, cadastros)
├─ navalha/                   # tenant 2 (tema escuro)
├─ lumi/                      # tenant 3
├─ admin/
└─ estados/
```

## 9. Critérios de aceite

- [ ] Os fluxos do §7 são percorríveis apenas clicando, sem becos sem saída.
- [ ] Aurora, Navalha e Lumi têm identidade visual claramente distinta com o mesmo layout.
- [ ] Todas as telas funcionam bem em 360px e em 1280px.
- [ ] Textos e visuais funcionam tanto para salão quanto para barbearia.
- [ ] Contraste legível nos temas claro e escuro.
- [ ] Ao final da revisão, existe uma lista de **ajustes e descobertas** (telas/campos faltantes) para alimentar o desenvolvimento real.

## 10. Depois do protótipo

Com o visual validado, o desenvolvimento real segue o ROADMAP.md: Fase 0 (Next.js, Prisma/Supabase, VPS, prova de conceito multi-tenant) em diante. É nesse momento que entram **OpenSpec + Claude Code**, com changes pequenas e uma explicação curta de React/Next a cada passo, já que o autor está aprendendo.

O protótipo serve de **referência de design**: telas, campos, textos e variáveis de tema viram requisitos das specs.

## 11. Decisões em aberto

- [ ] Identidade visual do próprio ZeitVez (logo/paleta) — pode ser provisória.
- [ ] Imagens: placeholders ou banco de imagens livres.
- [ ] Onde mostrar o protótipo para terceiros (arquivos locais, ou hospedagem estática temporária).
- [ ] Preço/modelo de cobrança do ZeitVez (tela institucional usa apenas "fale conosco" por enquanto).
