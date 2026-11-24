# ZeitVez — vitrine do produto

Páginas estáticas em HTML que mostram a salões e barbearias **como o ZeitVez ficou**: mesmas telas, textos e fluxos do produto real, com dados fictícios. Não tem backend: os botões só navegam, os formulários não enviam nada e a escolha de horários vem de uma conta simples feita ao gerar as páginas. A pasta funciona sozinha: pode ser aberta por duplo clique ou servida por qualquer host estático.

> Histórico: o protótipo nasceu como referência de design (ver [docs/PRD.md](docs/PRD.md)). Hoje é a **vitrine** do produto, mantida em sincronia com o `web/`.

## Como abrir

Abra `index.html` no navegador (duplo clique). **Não precisa de internet nem de nada instalado:** o CSS (`assets/vitrine.css`) e as fontes (`assets/fontes/`) são arquivos da própria pasta, e nenhuma chamada de rede é feita ao abrir as telas. Só os links de contato dos salões (WhatsApp, Instagram, "Como chegar") saem da pasta, e só quando alguém clica.

Em todas as telas há um botão flutuante **▦ Telas** (canto inferior direito). Ele abre o mapa de telas, agrupado por área e por salão, e mostra a rota real de cada tela ao passar o mouse.

## Mapa das telas

Pasta plana por salão (`aurora/`, `navalha/`, `lumi/`), mais a raiz do ZeitVez (site institucional, "Entrar" da equipe e admin); a coluna "Rota real" é o endereço da mesma tela no produto.

| Tela | Arquivo (em cada salão) | Rota real |
|---|---|---|
| Landing (visitante) | `index.html` | `/` |
| Landing (com sessão, topo "Olá, Alex") | `inicio-conectado.html` | `/` |
| Agendar 1 · Com quem? | `agendar-profissional.html` | `/agendar/profissional` |
| Agendar 2 · O que vamos fazer? | `agendar-servicos.html` | `/agendar/servicos` |
| Agendar 3 · Quando? | `agendar-horario.html` | `/agendar/horario` |
| Agendar 4 · Confira e confirme | `agendar-confirmar.html` (sem login), `agendar-confirmar-conectado.html` | `/agendar/confirmar` |
| Agendamento confirmado | `agendar-sucesso.html` | `/agendar/sucesso/[id]` |
| Entrar, Criar conta | `entrar.html`, `criar-conta.html` | `/entrar`, `/criar-conta` |
| Recuperar e definir senha | `recuperar-senha.html`, `nova-senha.html`, `definir-senha.html` | `/recuperar-senha`, `/nova-senha`, `/definir-senha` |
| Minha conta | `minha-conta.html` | `/minha-conta` |
| Meus agendamentos, Remarcar | `meus-agendamentos.html`, `remarcar.html` | `/minha-conta/agendamentos`, `.../[id]/remarcar` |
| Termos, privacidade, 404 | `termos.html`, `privacidade.html`, `404.html` | `/termos`, `/privacidade`, (rota inexistente) |
| Estados | `estados/suspenso.html`, `estados/nao-encontrado.html` | salão suspenso, endereço sem salão |
| Painel do dono: agenda do dia e da semana | `{salão}/painel/agenda.html`, `agenda-semana.html` (e `agenda-dia-<n>.html`, `agenda-semana-7.html`) | `/painel/agenda` |
| Painel: remarcar atendimento, novo agendamento no balcão | `painel/remarcar.html`, `novo-agendamento.html`, `-servicos`, `-horario`, `-cliente` | `/painel/agenda/[id]/remarcar`, `/painel/agenda/novo` |
| Painel: bloqueios, Meu site | `painel/bloqueios.html`, `site.html` | `/painel/bloqueios`, `/painel/site` |
| Painel: serviços | `painel/servicos.html`, `servico-novo.html`, `servico.html` | `/painel/servicos`, `.../novo`, `.../[id]` |
| Painel: equipe e profissional (Dados, Serviços, Horário) | `painel/equipe.html`, `profissional-novo.html`, `profissional.html`, `profissional-servicos.html`, `profissional-horario.html` | `/painel/equipe`, `.../novo`, `.../[id]`, `.../[id]/servicos`, `.../[id]/horario` |
| Painel: horário, aparência, regras de agendamento | `painel/horario.html`, `aparencia.html`, `regras.html` | `/painel/horario`, `/painel/aparencia`, `/painel/regras` |
| Painel do profissional de exemplo (o 3º da equipe) | as mesmas telas da agenda, do balcão e dos bloqueios com o prefixo `pro-` (`painel/pro-agenda.html`, `pro-bloqueios.html`…) | `/painel/agenda`, `/painel/bloqueios` |
| Site institucional do ZeitVez (no ambiente de demonstração, sem contato) | `index.html` (na raiz da pasta) | `/` na raiz |
| Entrar da equipe do ZeitVez | `entrar.html` (na raiz da pasta) | `/entrar` na raiz |
| Admin: salões, novo salão, salão (Studio Aurora fixo), configurações | `admin/index.html`, `novo.html`, `salao.html`, `configuracoes.html` | `/admin`, `/admin/saloes/novo`, `/admin/saloes/[id]`, `/admin/configuracoes` |

## Dados e "agora"

- Todo dado de salão, pessoa, serviço, preço, horário, regra, agendamento e bloqueio vem de `docs/seeds/` do repositório do produto (mesmas chaves: `aurora/marina`, `aurora-ag-15`…), em `_gerador/dados.mjs`.
- O "agora" é fixo: **terça, 20 de outubro de 2026, às 14:30** (o D0 do seed). Datas de agendamentos e bloqueios são "D0 ± n".
- O cliente de exemplo é o Alex Souza de cada salão. Os atendimentos dele em "Meus agendamentos" são os do seed: no Espaço Lumi, o de D0 às 15:30 já passou do prazo de cancelamento (24 h) e mostra a política do salão em vez de "Cancelar".
- Os horários livres ("Quando?", "Remarcar" e o card "Próximo horário livre") saem de `horariosLivres` (`_gerador/agendamento.mjs`): expediente do profissional, horário do salão, agendamentos e bloqueios do seed, passo de 15 min e antecedência mínima. É uma aproximação legível do cálculo da API, só para a vitrine.
- O painel tem duas versões por salão, como no produto: o dono (oito itens no menu) e o profissional de exemplo, o 3º da equipe (Bia, Caio ou Nina; só "Minha agenda" e "Meus bloqueios"). A agenda, os contadores ("agendamentos", "a atender", "concluídos", "a conferir"), os status derivados ("Em atendimento", "A conferir") e os bloqueios vêm dos agendamentos e bloqueios do seed, no "agora" de D0 às 14:30. A agenda tem uma página por dia (de D0−1 a D0+13) e a semana de D0 e a de D0+7; o filtro por profissional e os botões de status (concluir, não compareceu, cancelar, concluir todos) mudam só o que aparece na tela.
- As telas de detalhe do painel usam um item fixo do seed: "Editar serviço" mostra o 1º serviço, "Profissional" o 2º da equipe e "Remarcar" o próximo atendimento confirmado depois do "agora" (do dono, ou do profissional de exemplo).
- Cada fluxo tem uma escolha de exemplo (profissional, serviços, dia e hora). Clicar em outra opção só a marca; "Continuar" segue com a escolha de exemplo. O gerador falha se a hora de exemplo não estiver livre.

## Tema por CSS variables

Cada salão tem um `tema.css` com um bloco `:root` (cores, fontes, raios, caixa dos títulos). As cores são as mesmas que o produto deriva das duas cores do seed; a forma vem do estilo da fonte (Clássica = botão em pílula; Condensada = 4 px e caixa alta; Moderna = 12 px e título 800). O `assets/tailwind.config.js` liga as classes do Tailwind a essas variáveis e `assets/base.css` monta os componentes só com variáveis: o HTML dos três salões é idêntico, só o `tema.css` muda.

## Gerador (`_gerador/`)

As telas dos três salões são iguais, então o HTML é gerado a partir de templates:

Primeira vez (só o Tailwind, que fica em `_gerador/node_modules/`, fora do git):

```
(cd prototipo/_gerador && npm ci)
```

Depois, para gerar:

```
node prototipo/_gerador/gerar.mjs
```

Sem o `npm ci`, o gerador para e diz o que fazer. Quem só **abre** a vitrine não precisa de nada disso.

- `dados.mjs` — espelho de `docs/seeds/` (salões, serviços, equipe, horários, regras, clientes, agendamentos, bloqueios) e os temas
- `comum.mjs` — D0 e "agora", formatos de data, preço e telefone do produto real, ícones e o documento base
- `agendamento.mjs` — `horariosLivres`, a escolha de exemplo e os dias com horários
- `tenant.mjs` — site do salão, agendamento e conta do cliente (exporta as peças que o balcão do painel reaproveita)
- `painel.mjs` — painel do dono e do profissional
- `studio.mjs` — site institucional, "Entrar" da raiz, admin e estados
- `baixar-fontes.mjs` — baixa as fontes para `assets/fontes/` (roda à mão, com internet, só quando uma fonte nova entra)

O gerador **sobrescreve** os `.html`, `tema.css`, `.ics`, `assets/zeitvez.css`, `assets/fontes.css`, `assets/vitrine.css` e `assets/telas.js`, e **remove** o que deixou de gerar (a lista fica em `_gerador/gerados.json`). Rodar duas vezes seguidas dá os mesmos arquivos. `assets/base.css`, `assets/app.js` e `assets/tailwind.config.js` são escritos à mão.

- **`assets/vitrine.css`:** o gerador compila o Tailwind (3.4.16, fixo no `package.json` do gerador) sobre os HTML gerados e o `app.js`, com o `base.css` dentro, e grava o resultado minificado. Toda página carrega só ele. Mudou uma classe num template? Rode o gerador de novo.
- **Fontes:** os `.woff2` (só o subconjunto latino, licença OFL em `assets/fontes/LICENCAS.md`) ficam em `assets/fontes/` e vão para o git. O `node prototipo/_gerador/baixar-fontes.mjs` baixa de novo, e só é preciso rodá-lo ao entrar uma família ou um peso novo em `FONTES` (`dados.mjs`). O gerador escreve o `assets/fontes.css` com os `@font-face` e falha se faltar um arquivo.

Ao terminar, o gerador confere e sai com código diferente de zero se algo falhar:

- todo link, `src` e destino de formulário aponta para um arquivo que existe (âncoras incluídas) e todo HTML está no mapa de telas;
- o nome antigo do produto não aparece em lugar nenhum;
- nenhum recurso de fora da pasta (script, folha de estilo, fonte, imagem, mapa, iframe, `@import` ou `url()`), e todo `@font-face` aponta para um arquivo que existe;
- nenhum caminho começa com `/` (a vitrine roda em `.../ZeitVez-demo/` no GitHub Pages);
- e-mails e telefones são só os do seed.

## Regra de manutenção: mudou uma tela no `web/`, atualize o template

A vitrine só vale se continuar igual ao produto. Sempre que uma tela do `web/` mudar (texto, ordem dos blocos, fluxo), atualize o template correspondente e rode o gerador:

| Tela | Componente real (`web/src/`) | Template |
|---|---|---|
| Topo, menu e conta | `components/site/site-header.tsx`, `site-menu.tsx`, `account-menu.tsx` | `tenant.mjs` (`cabecalho`) |
| Landing | `components/site/hero.tsx`, `services-section.tsx`, `team-section.tsx`, `about.tsx`, `visit-info.tsx`, `site-footer.tsx` | `tenant.mjs` (`landing`, `rodape`) |
| Agendamento | `app/agendar/*`, `components/booking/*` | `tenant.mjs` (`agendar*`) |
| Conta | `app/entrar`, `criar-conta`, `recuperar-senha`, `nova-senha`, `definir-senha`, `minha-conta`, `components/account/*` | `tenant.mjs` |
| Meus agendamentos e remarcar | `app/minha-conta/agendamentos/*`, `components/booking/meu-agendamento.tsx` | `tenant.mjs` (`meusAgendamentos`, `remarcar`) |
| Termos e privacidade | `components/account/legal/*` | `tenant.mjs` (`termos`, `privacidade`) |
| Estados | `app/not-found.tsx`, `app/site-suspended/page.tsx`, `components/site/salon-not-found.tsx` | `tenant.mjs`, `studio.mjs` |
| Site institucional | `components/platform/platform-site.tsx`, `platform-header.tsx`, `platform-hero.tsx`, `benefits-section.tsx`, `how-it-works-section.tsx`, `demo-section.tsx`, `contact-section.tsx`, `platform-footer.tsx`, `salon-preview.tsx`, `theme-toggle.tsx`; `lib/platform/demo.ts` | `studio.mjs` (`institucional`, `miniatura`, `DEMO`) |
| Entrar da raiz | `app/entrar/page.tsx` (fora de um salão) | `studio.mjs` (`entrarRaiz`) |
| Admin: moldura e lista de salões | `components/admin/admin-shell.tsx`, `app/admin/page.tsx`, `status-badge.tsx`, `lib/admin/status.ts` | `studio.mjs` (`adminLayout`, `adminSaloes`) |
| Admin: novo salão | `app/admin/saloes/novo/page.tsx`, `components/admin/new-tenant-form.tsx`, `subdomain-field.tsx`, `theme-swatches.tsx`, `lib/admin/themes.ts` | `studio.mjs` (`adminNovo`) |
| Admin: salão (dados, dono, endereços, editar, status) | `app/admin/saloes/[id]/page.tsx`, `components/admin/domains-section.tsx`, `status-action-dialog.tsx`, `remove-domain-dialog.tsx`, `edit-tenant-form.tsx`, `add-domain-form.tsx` | `studio.mjs` (`adminSalao`, `dialogo`) |
| Admin: configurações | `app/admin/configuracoes/page.tsx`, `components/admin/settings-form.tsx` | `studio.mjs` (`adminConfiguracoes`) |
| Moldura e menu do painel | `components/owner/owner-shell.tsx`, `owner-nav.tsx`, `lib/owner/navigation.ts` | `painel.mjs` (`moldura`) |
| Agenda, linhas e ações | `app/painel/agenda/page.tsx`, `components/agenda/agenda-toolbar.tsx`, `appointment-row.tsx`, `appointment-actions.tsx`, `pending-closure.tsx` | `painel.mjs` (`paginaAgenda`, `linhaAgenda`, `barraDaAgenda`) |
| Remarcar e novo agendamento no balcão | `app/painel/agenda/[id]/remarcar/page.tsx`, `app/painel/agenda/novo/page.tsx`, `components/agenda/counter-customer-form.tsx` | `painel.mjs` (`paginaRemarcar`, `paginaBalcao`) |
| Bloqueios | `app/painel/bloqueios/page.tsx`, `components/agenda/blocks-list.tsx`, `block-form.tsx` | `painel.mjs` (`paginaBloqueios`) |
| Meu site, serviços, equipe | `app/painel/site`, `servicos`, `equipe`, `components/owner/site-form.tsx`, `services-list.tsx`, `service-form.tsx`, `team-list.tsx`, `professional-*.tsx`, `schedule-form.tsx` | `painel.mjs` (`paginaSite`, `paginaServicos`, `paginaEquipe`, `paginaProfissional*`) |
| Horário, aparência, regras | `app/painel/horario`, `aparencia`, `regras`, `components/owner/hours-form.tsx`, `theme-form.tsx`, `theme-preview.tsx`, `rules-form.tsx` | `painel.mjs` (`paginaHorario`, `paginaAparencia`, `paginaRegras`) |

## Publicar a vitrine

A vitrine pública fica no repositório **`HenriqueZeitz/ZeitVez-demo`** e é servida pelo GitHub Pages em **https://henriquezeitz.github.io/ZeitVez-demo/**. O repositório do produto continua privado: o que vai para lá é só uma **cópia desta pasta**, feita à mão (não há automação). Faça a cópia ao fim de cada change que mexer no protótipo.

1. **Gere e confira:** `node prototipo/_gerador/gerar.mjs` precisa terminar com `✓ conferências`.
2. **Copie a pasta para o clone do `ZeitVez-demo`**, levando tudo de `prototipo/` **menos** `_gerador/`, `docs/` e `_publicacao/` (e sem `node_modules/`). Apague antes o conteúdo antigo do clone (menos a pasta `.git`), para não sobrar tela que saiu do produto.
3. **Copie por cima** o conteúdo de `prototipo/_publicacao/`: o `README.md` público ("Como ver a demonstração") e o `.nojekyll`, para o Pages servir a pasta como ela está.
4. **Confira a cópia:** tem `index.html`, `aurora/`, `navalha/`, `lumi/`, `estados/`, `admin/`, `assets/`, `README.md` e `.nojekyll`, e **não** tem `_gerador/`, `docs/`, `_publicacao/` nem `node_modules/`.
5. **Commit e push no `ZeitVez-demo`.**
6. **Só na primeira vez:** no GitHub, em *Settings → Pages*, escolha *Deploy from a branch*, branch `main`, pasta `/ (root)`. Em cerca de um minuto o endereço acima responde.

Exemplo da cópia (Git Bash, da raiz do repositório do produto, com o clone em `../ZeitVez-demo`):

```bash
destino=../ZeitVez-demo
find "$destino" -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
tar -C prototipo --exclude=_gerador --exclude=docs --exclude=_publicacao --exclude=node_modules -cf - . | tar -C "$destino" -xf -
cp -a prototipo/_publicacao/. "$destino"/
```

## Revisão

As descobertas feitas durante a montagem estão em [docs/DESCOBERTAS.md](docs/DESCOBERTAS.md).
