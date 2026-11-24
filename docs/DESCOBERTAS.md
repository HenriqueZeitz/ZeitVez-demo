# Ajustes e descobertas do protótipo

> Critério de aceite do PRD §9: lista de telas, campos e decisões faltantes para alimentar o desenvolvimento real.
> Versão inicial, feita durante a montagem (2026-10-14). Rodadas de decisões em 2026-10-15; no mesmo dia, o protótipo foi atualizado com todas elas (só o login do admin segue em aberto).
>
> Legenda: `[ ]` ainda não está no protótipo · `[x]` resolvido (decidido e sem tela a fazer, ou já no protótipo).
> **Decisão** = o que foi definido · **Nota** = observação/recomendação a validar · **Em aberto** = ainda sem decisão.

## Contas e permissões (decidido na 2ª rodada)

- **Todos têm conta com e-mail e senha**: cliente, profissional e dono. Não há agendamento sem conta pelo site.
- **Uma única tela "Entrar"** no site do salão. Depois do login, o sistema lê o nível do usuário e mostra os menus correspondentes.
- **Níveis de permissão:** Admin (ZeitVez) → Proprietário → Profissional → Cliente.
- **Manter conectado:** caixa "Manter conectado neste aparelho", marcada por padrão. A sessão dura bastante (sugestão: 90 dias, renovada a cada uso), então o cliente não precisa digitar a senha a cada agendamento. Desmarcada, a sessão termina ao fechar o navegador. O Auth.js já faz isso com um cookie de sessão de longa duração, sem custo.
- **Recuperar senha só por e-mail.** SMS e WhatsApp ficam de fora, porque são pagos por mensagem.

**Decisões (3ª rodada):**
- **O dono também pode atender.** Basta ele se cadastrar como profissional, marcar os serviços que faz e começar a trabalhar. Os níveis são **cumulativos** (Proprietário + Profissional), não um único campo. O Proprietário tem permissões a mais, como cadastrar funcionários.
- **Login/cadastro na etapa de confirmar** do agendamento. O cliente escolhe profissional, serviços e horário antes de se identificar. Cadastro curto: nome, celular, e-mail e senha.
- **Cliente de balcão sem conta.** O **dono e os profissionais** podem agendar no balcão/telefone só com nome + celular. Se esse cliente criar conta depois com o mesmo celular, os atendimentos anteriores são associados à conta.
- **A conta vale só para aquele salão** (o ROADMAP já prevê o login do cliente escopado ao tenant). Quem é cliente de dois salões do ZeitVez tem duas contas.

**O que cada nível acessa no painel:**

| | Proprietário | Profissional |
|---|---|---|
| Agenda | de todos | só a própria |
| Mudar status dos atendimentos | de todos | dos próprios |
| Agendar no balcão | para qualquer profissional | para qualquer profissional |
| Trocar o profissional de um agendamento | sim | não |
| Bloqueios | de qualquer profissional e do salão todo; vê e pode desfazer os dos profissionais | dos próprios horários |
| Conferir atendimentos ("A conferir" → Concluído) | de todos | dos próprios |
| Cadastros (serviços, profissionais) | sim | não |
| "Meu site" e configurações | sim | não |

- **Bloqueios próprios (decidido):** o profissional marca sozinho, na própria agenda, um período em que não vai atender (ex.: dentista na quinta das 14h às 16h). O site para de oferecer esses horários. O dono vê todos os bloqueios e pode desfazer.
- **Balcão (decidido):** qualquer funcionário agenda para qualquer colega. Exemplo: um salão com recepção, em que quem atende o balcão não corta cabelo, mas marca cortes para os colegas.

- **Agendar para um colega (decidido):** o funcionário não vê a agenda do colega. Usa a **mesma tela de agendamento que o cliente vê** (profissional → serviços → horário), com os horários livres, e informa só nome + celular do cliente.
- **Recepcionista (decidido):** é um **profissional comum sem serviços cadastrados**. Sem serviços, não aparece como opção para os clientes. Não há nível "Recepção".
  - **Nota:** como profissional comum, a recepcionista vê só a própria agenda (vazia) e não consegue receber quem chega, marcar falta ou remarcar atendimentos dos colegas. Se isso for necessário, a saída mais simples é uma opção no cadastro do profissional, **"Pode ver e alterar a agenda de todos"**, que o dono liga para quem precisar, sem criar outro nível. **Anotado, sem implementação por enquanto.**

O acesso do profissional segue o mesmo modelo do dono: o dono cria a conta no cadastro do profissional, repassa a senha, e a troca é obrigatória no primeiro acesso.

## Telas que faltam

- [x] **Recuperar senha.** O link "Esqueci minha senha" existe, mas não há fluxo.
  - **Decisão:** tela que pede o e-mail → envia o link → tela de nova senha. Só por e-mail.
- [x] **Termos de uso e política de privacidade** (LGPD). O cadastro tem a caixa "Li e aceito os termos de uso e a política de privacidade", mas os dois links só mostram um aviso: as páginas não existem.
  - **Nota:** como o site guarda nome, celular, e-mail e histórico do cliente, a LGPD exige uma política de privacidade acessível. Proposta: **um texto-modelo do ZeitVez** com o nome, CNPJ e contato de cada salão preenchidos automaticamente, em `/{salao}/privacidade` e `/{salao}/termos`, com link no rodapé e no cadastro. Pelos papéis da LGPD, o salão é o controlador dos dados dos clientes e o ZeitVez é o operador. Vale uma revisão jurídica do texto-modelo antes de ir para produção.
  - Separado disso: os **termos de contratação do ZeitVez** (contrato com o salão), que não aparecem para o cliente final.
- [x] **Perfil do cliente.**
  - **Decisão:** fazer tudo: editar nome, celular, e-mail e senha; sair deste aparelho; excluir a conta (LGPD).
- [x] **Login único com níveis.** O painel hoje é acessado direto.
  - **Decisão:** a mesma tela "Entrar" para todos. O destino depois do login depende do nível: cliente → site/meus agendamentos; profissional → a própria agenda; proprietário → painel completo. Ver "Contas e permissões".
- [x] **Painel do profissional.** Nova tela, que decorre dos níveis de permissão: é o painel do dono com menos menus (ver "Em aberto" em "Contas e permissões").
- [x] **Troca de senha obrigatória no primeiro acesso** (dono e profissional). Tela simples, que pode reaproveitar o formulário de senha do perfil.
- [ ] **Login do admin** do ZeitVez.
  - **Em aberto:** o nível Admin existe na hierarquia, mas só o próprio ZeitVez acessa, então a tela não é prioridade.
- [x] **Convite / primeiro acesso do dono.**
  - **Decisão:** sem fluxo de convite. O ZeitVez cadastra o dono junto com o salão e repassa usuário e senha. Remover do "Novo tenant" o texto que fala em convite.
- [x] **Detalhe de um agendamento no painel.** Hoje só existe a lista; falta tela/diálogo com dados do cliente, histórico e observação.
  - **Decisão:** a linha da agenda vira um **accordion** que expande com os detalhes.
  - **Nota:** conteúdo sugerido ao expandir: celular com atalho para WhatsApp/ligar, serviços e duração total, observação do cliente, quantas vezes já veio e a última visita, e as ações (iniciar, concluir, não compareceu, cancelar, remarcar, trocar profissional). Abrir um de cada vez. Para o profissional, "trocar profissional" não aparece.
- [x] **Bloqueios de agenda.** Folgas, férias, feriados, intervalo de almoço por profissional.
  - **Decisão:** no painel, bloquear um horário (de X a Y) ou dias inteiros.
  - **Nota:** o bloqueio pode ser de **um profissional** (folga, médico) ou do **salão todo** (feriado; só o proprietário). Se já houver agendamentos no período, o painel mostra a lista para remarcar ou cancelar, em vez de bloquear em silêncio. Almoço e folgas fixas ficam no horário do profissional; o bloqueio é para exceções.
- [x] **Detalhe/edição de tenant no admin.** Hoje só lista, suspende e cria.
  - **Decisão:** fazer, com um botão "Editar" na lista. Inclui o endereço do site, o status (ativo / suspenso / cancelado) e os dados e a senha inicial do proprietário.
- [x] **Página 404 dentro de um tenant** (ex.: `aurora/qualquer-coisa`), diferente de "salão não encontrado".
  - **Decisão:** fazer, com a identidade do salão e botões para o início e para agendar.

## Campos e regras a decidir

- [x] **Horário por profissional.** O horário de funcionamento é do salão, mas cada profissional tem seus dias.
  - **Decisão:** cadastro de horário por profissional (dias, entrada, saída, intervalo de almoço). Resolve almoço, folgas fixas e, junto com os bloqueios, os imprevistos.
  - **Nota:** o horário do salão continua existindo para o site (seção "Horários") e como limite: o horário do profissional precisa caber dentro dele.
- [x] **Intervalo entre horários.** O protótipo usa grade de 30 min.
  - **Decisão:** a **duração é por serviço**. Agendar ocupa o profissional pela duração total. Um horário só é oferecido se a duração inteira couber antes do próximo compromisso (agendamento, bloqueio, almoço ou fim do expediente). Ex.: um atendimento termina às 10h e há outro às 11h; um serviço de 2h não pode começar às 10h.
  - **Decisão:** os horários de início aparecem em passos de **15 min** por padrão (10h, 10h15, 10h30…), configurável por salão.
- [x] **Preço "a partir de".**
  - **Decisão:** manter o checkbox. O preço final varia por cliente (cabelo, mão etc.).
- [x] **Serviço x profissional com preço/duração diferentes** (ex.: barbeiro sênior mais caro).
  - **Decisão:** ideia anotada, sem implementação por enquanto. A modelagem de dados deve deixar espaço para isso (preço/duração opcionais na relação serviço ↔ profissional).
- [x] **Mais de um serviço no mesmo agendamento** (ex.: corte + barba + sobrancelha). Hoje existe só como "combo" cadastrado.
  - **Decisão:** seleção múltipla de serviços, somando tempo e preço.
  - **Decisão:** todos os serviços de um agendamento são feitos **pelo mesmo profissional, em sequência**. Para serviços com profissionais diferentes, o cliente faz mais de um agendamento ou fala com o salão.
  - **Decisão (ordem do fluxo):** Profissional (ou "Sem preferência") → Serviços (só os que aquele profissional faz) → Horário → Confirmar (com login/cadastro curto, se ainda não estiver logado).
  - **Nota:** em "Sem preferência", aparecem todos os serviços, e na hora só entram profissionais que fazem **todos** os escolhidos. Se algum serviço for "a partir de", o total também aparece como "a partir de".
  - **Nota:** com a seleção múltipla, o "combo" cadastrado só faz sentido se tiver preço promocional. Avaliar se continua.
- [x] **Política de cancelamento.** O texto "até 2 horas antes" está fixo.
  - **Decisão:** configurável no painel por salão (antecedência mínima para cancelar pelo site e texto livre opcional).
- [x] **"Sem preferência" de profissional.**
  - **Decisão:** rodízio automático entre os profissionais livres naquele horário (e que fazem os serviços escolhidos). O dono pode reatribuir pelo accordion do agendamento.
- [x] **Antecedência mínima e máxima** para agendar.
  - **Decisão:** configurável por salão (ex.: mínimo 1h, máximo 30 dias).
- [x] **Status do agendamento.** O protótipo usa Confirmado, Em atendimento, Concluído, Cancelado, Não compareceu.
  - **Decisão:** sem "Pendente" no MVP; todo agendamento nasce confirmado. Com a conta obrigatória, o risco de agendamentos falsos cai.
  - **Decisão (status automático com conferência):**

    ```
    Confirmado ──(início, automático)──► Em atendimento ──(fim, automático)──► A conferir ──(manual)──► Concluído
         │                                                                        │
         └──────────── manual, a qualquer momento ────────────────────────────────┴──► Não compareceu / Cancelado
    ```

    - O sistema muda para **Em atendimento** no horário de início e para **A conferir** no fim.
    - Só vira **Concluído** quando alguém confirma. Só então o atendimento entra no histórico do cliente (e, no futuro, nas métricas).
    - Sem prazo: pode ser confirmado ou alterado a qualquer momento. Confirma o próprio profissional, o dono ou a recepção.
  - **Decisão:** o status se chama **"A conferir"** (não "Aguardando confirmação"), para não confundir com "Confirmado".
  - **Decisão:** contador "N atendimentos a conferir" no topo da agenda, com a ação **"Concluir todos"** para fechar o dia de uma vez.
- [x] **Agendamento feito pelo dono** (balcão/telefone) para cliente sem conta.
  - **Decisão:** como está: o diálogo pede só nome e celular. Vale para o dono **e para os profissionais**. Ver "Contas e permissões".
- [x] **Cliente final: conta obrigatória?**
  - **Decisão:** sim, com e-mail e senha, e com a opção de manter conectado no aparelho. O fluxo atual (login antes de agendar) muda: o login/cadastro passa para a etapa de confirmar, para o cliente ver serviços e horários antes de se cadastrar.
- [x] **Endereço do tenant suspenso.** A tela de indisponível não mostra contato.
  - **Decisão:** mostrar o telefone do salão.
  - **Decisão (novo status):** além de **suspenso**, um status **cancelado**: depois de X meses sem pagamento, o salão é desativado (nada é excluído do banco) e o endereço passa a mostrar "salão não encontrado".
  - **Decisão:** X é **global** (configuração do ZeitVez, ex.: 6 meses), igual para todos os salões. O subdomínio de um salão cancelado é só controle interno do ZeitVez; não há nada a reservar ou registrar.

## Visual e textos

- [x] **Nomes longos no cabeçalho mobile.** "Barbearia Navalha" em fonte condensada caixa-alta é cortado em 360px.
  - **Decisão:** esconder o botão "Agendar" do topo **só quando o nome não couber**, e adicionar "Agendar" no menu sanduíche. Os outros botões da página continuam.
- [x] **Fotos reais.** Todas as imagens são placeholders em gradiente.
  - **Decisão:** o salão envia as fotos. **1 foto por serviço** (é um site de agendamento, não uma galeria).
  - **Nota (dimensões sugeridas):** o sistema redimensiona e converte para WebP no envio, então o salão só precisa respeitar a proporção e o tamanho mínimo.

    | Imagem | Proporção | Tamanho recomendado | Mínimo | Formatos / limite |
    |---|---|---|---|---|
    | Foto do serviço | 4:3 (horizontal) | 1200 × 900 px | 800 × 600 px | JPG, PNG, WebP · até 5 MB |
    | Foto de capa (topo do site) | 4:5 a 5:4, com o assunto no centro | 1600 × 1600 px | 1000 × 1000 px | JPG, PNG, WebP · até 5 MB |
    | Foto do profissional | 1:1 (quadrada) | 600 × 600 px | 300 × 300 px | JPG, PNG, WebP · até 5 MB |

    A capa aparece em 4:5 no celular e 5:4 no tablet, por isso o centro da foto precisa ter o assunto principal. Com 1 foto por serviço, a seção "Galeria" do site sai ou passa a ser montada com as fotos dos serviços.
- [x] **Logo do salão.**
  - **Decisão:** sem logo, usamos a inicial num círculo/quadrado. Esse é o padrão.
  - **Nota (dimensões):** PNG com fundo transparente ou SVG, **quadrado, pelo menos 512 × 512 px**, até 2 MB. O símbolo deve funcionar pequeno (aparece com ~40 px no cabeçalho e como ícone da aba). Mostrar essas orientações **ao lado do botão de envio** no "Meu site", com uma prévia de como fica no cabeçalho.
- [x] **Identidade do ZeitVez** (logo/paleta índigo) é provisória (PRD §11).
  - **Decisão:** continua provisória. Telas do ZeitVez (institucional e admin) em **tema escuro por padrão**, seguindo o tema do sistema do usuário (`prefers-color-scheme`), com botão para alternar entre claro e escuro.
- [x] **Mapa.** Hoje é um placeholder + link "Como chegar".
  - **Decisão:** embutir o mapa real.
  - **Nota:** o embed simples do Google Maps (iframe a partir do endereço) não exige chave de API nem tem custo. Manter o link "Como chegar" junto, que abre o app de mapas no celular.
- [x] **Fontes disponíveis no "Meu site".** O protótipo oferece 3 estilos.
  - **Nota (recomendação):** "livre" seria o catálogo inteiro do Google Fonts (~1.700 famílias), com muitas ilegíveis em texto corrido ou sem acentos completos. Recomendação: **lista fechada e curada de 8 a 12 pares** (título + texto), testados com acentuação e no layout, agrupados por estilo. A lista cresce conforme os salões pedirem.
  - **No protótipo:** aplicada a recomendação: 10 pares em 4 estilos (Clássica, Moderna, Condensada, Delicada). Confirmar a lista.
- [x] **Cores escolhidas pelo dono.** O painel calcula a cor do texto sobre o botão automaticamente.
  - **Decisão:** manter como está.

## Extra

- [x] **Endereço do site** (subdomínio/domínio).
  - **Decisão:** definido em conversa entre o ZeitVez e o dono e configurado pelo ZeitVez no admin (tela de edição do tenant), não pelo dono no painel.

## Ideias anotadas (sem implementação por enquanto)

- Preço e duração diferentes por profissional para o mesmo serviço.
- Notificar os profissionais nos agendamentos "Sem preferência" para que eles (ou o dono) escolham quem atende. Agora que profissionais terão login, fica mais viável.
- Login do admin do ZeitVez.
- Status "Pendente" (aprovação manual pelo salão), se surgir demanda.
- "Tempo de preparo/limpeza" por serviço.
- Recuperação de senha e lembretes por SMS/WhatsApp, quando entrar a fase de notificações pagas.
