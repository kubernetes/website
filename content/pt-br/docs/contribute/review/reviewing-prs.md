---
title: Revisando pull requests
content_type: concept
main_menu: true
weight: 10
---

<!-- overview -->

Qualquer pessoa pode revisar um _pull request_ da documentação. 
Visite a seção [pull requests](https://github.com/kubernetes/website/pulls) no repositório do site Kubernetes para ver os _pull requests_ abertos.

Revisar os _pull requests_ da documentação é uma ótima maneira de se apresentar à comunidade Kubernetes. 
Isso ajuda você a aprender a base de código e construir a confiança com outros colaboradores.

Antes de revisar, é uma boa ideia:

- Ler o [guia de conteúdo](/docs/contribute/style/content-guide/) e o [guia de estilo](/docs/contribute/style/style-guide/) para que você possa deixar comentários esclarecedores.
- Entender as diferentes [funções e responsabilidades](/docs/contribute/participate/roles-and-responsibilities/) na comunidade da documentação do Kubernetes.

<!-- body -->

## Antes de começar

Antes de começar uma revisão:

- Leia o [Código de Conduta da CNCF](https://github.com/cncf/foundation/blob/main/code-of-conduct.md) e certifique-se de cumpri-lo o tempo todo.
- Seja educado, atencioso e prestativo.
- Comente os aspectos positivos dos PRs, bem como mudanças.
- Seja empático e cuidadoso, observe como sua avaliação pode ser recebida.
- Assuma boas intenções e faça perguntas esclarecedoras.
- Colaboradores experientes, considere trabalhar em par com os novos colaboradores cujo trabalho requer grandes mudanças.

## Processo de revisão

Em geral, revise os _pull requests_ de conteúdo e estilo em inglês. 
A Figura 1 descreve as etapas para o processo de revisão. 
Seguem os detalhes para cada etapa.

<!-- See https://github.com/kubernetes/website/issues/28808 for live-editor URL to this figure -->
<!-- You can also cut/paste the mermaid code into the live editor at https://mermaid-js.github.io/mermaid-live-editor to play around with it -->

{{< mermaid >}}
flowchart LR
    subgraph fourth[Começar revisão]
    direction TB
    S[ ] -.-
    M[adicionar comentários] --> N[revisar mudanças]
    N --> O[novos colaboradores devem<br>escolher Comment]
    end
    subgraph third[Selecionar PR]
    direction TB
    T[ ] -.-
    J[leia a descrição<br>e comentários]--> K[visualize as mudanças no ambiente<br>de pré-visualização do Netlify]
    end
 
  A[Revise a lista de PR abertos]--> B[Filtre os PRs abertos<br>pela label]
  B --> third --> fourth
     

classDef grey fill:#dddddd,stroke:#ffffff,stroke-width:px,color:#000000, font-size:15px;
classDef white fill:#ffffff,stroke:#000,stroke-width:px,color:#000,font-weight:bold
classDef spacewhite fill:#ffffff,stroke:#fff,stroke-width:0px,color:#000
class A,B,J,K,M,N,O grey
class S,T spacewhite
class third,fourth white
{{</ mermaid >}}

Figura 1. Etapas do processo de revisão.

1. Acesse [https://github.com/kubernetes/website/pulls](https://github.com/kubernetes/website/pulls). 
   Você verá uma lista de todas as solicitações de _pull requests_ abertos no site e na documentação do Kubernetes.

2. Filtre os PRs abertos usando um ou todos os _labels_ seguintes:

   - `cncf-cla: yes` (Recomendado): PRs enviados por colaboradores que não assinaram o CLA não podem ser feito o _merge_. Consulte [Assinar o CLA](/docs/contribute/new-content/#sign-the-cla) para obter mais informações.
   - `language/pt` (Recomendado): Filtro para PRs em português.
   - `size/<size>`: Filtro para PRs com um determinado tamanho. Se você é novo, comece com PRs menores.

   Além disso, certifique-se que o PR não esteja marcado como `work in progress`. Os PRs que usam o _label_ `work in progress` ainda não estão prontos para revisão.

3. Depois de selecionar um PR para revisar, entenda a mudança:

   - Lendo a descrição do PR para entender as alterações feitas e ler quaisquer `issues` vinculadas
   - Lendo quaisquer comentários de outros revisores
   - Clicando na aba **Files changed** para ver os arquivos e linhas alteradas
   - Pré-visualizar as alterações ambiente de pré-visualização do _Netlify_, rolando até a seção _PR's build check_ na parte inferior da aba **Conversation**. 
   Aqui está uma captura da tela (isso mostra a área de trabalho do site GitHub; se você estiver revisando em um tablet ou smartphone, a interface web do usuário GitHub será um pouco diferente):
   {{< figure src="/images/docs/github_netlify_deploy_preview.png" alt="Detalhes do PR no GitHub, incluindo o link para a visualização do Netlify" >}}
   Para abrir a visualização, selecione o link **Details** da linha **deploy/netlify** na lista de verificações.

4. Vá para a aba **Files changed** para iniciar sua revisão.

   1. Clique no símbolo `+` ao lado da linha que você deseja comentar.

   1. Preencha com todos os comentários que você tenha sobre a linha e clique em **Add single comment** (se você tiver apenas um comentário para fazer) ou **Start a review** (se você tiver vários comentários para fazer)

   1. Quando terminar, clique em **Review changes** na parte superior da página. 
   Aqui, você pode adicionar um resumo da sua revisão (e deixar alguns comentários positivos para o colaborador!). 
   Por favor, sempre use o "Comentário"

     - Evite clicar no botão "Request changes" ao concluir sua revisão. 
       Se você quiser bloquear o _merge_ do PR antes que outras alterações sejam realizadas, você pode deixar um comentário "/hold". 
       Mencione por que você está definindo o bloqueio e, opcionalmente, especifique as condições sob as quais o bloqueio pode ser removido por você ou por outros revisores.

     - Evite clicar no botão "Approve" ao concluir sua revisão. 
       Deixar um comentário "/approve" é recomendado na maioria dos casos.


## Checklist para revisão

Ao revisar, use como ponto de partida o seguinte.

### Linguagem e gramática

- Existe algum erro óbvio na linguagem ou gramática? Existe uma maneira melhor de expressar algo?
  - Concentre-se na linguagem e na gramática nas partes que o autor está mudando na página. 
    A menos que o autor esteja claramente com o objetivo de atualizar a página inteira, ele não tem obrigação de corrigir todos os problemas na página.
  - Quando um PR atualiza uma página existente, você deve se concentrar em revisar as partes que estão sendo atualizadas na página. 
    Esse conteúdo alterado deve ser revisado quanto à correção técnica e editorial. 
    Se você encontrar erros na página que não se relacionam diretamente com o que o autor do PR está tentando resolver, ele deve ser tratado em uma `issue` separada (primeiro, verifique se não existe uma `issue` existente sobre isso).
  - Cuidado com os _pull requests_ que movem conteúdo. 
    Se um autor renomear uma página ou combinar duas páginas, nós (_Kubernetes SIG Docs_) geralmente evitamos pedir a esse autor que corrija todas as questões gramaticais ou ortográficas que poderíamos identificar dentro desse conteúdo movido.
- Existem palavras complicadas ou arcaicas que podem ser substituídas por uma palavra mais simples?
- Existem palavras, termos ou frases em uso que podem ser substituídos por uma alternativa não discriminatória?
- A escolha da palavra e sua capitalização seguem o [guia de estilo](/docs/contribute/style/style-guide/)?
- Existem frases longas que podem ser mais curtas ou menos complexas?
- Existem parágrafos longos que podem funcionar melhor como uma lista ou tabela?

### Conteúdo

- Existe conteúdo semelhante em outro lugar no site Kubernetes?
- O conteúdo está excessivamente vinculado a uma documentação externa, de um fornecedor individual ou de um código não aberto?

### Website

- Esse PR alterou ou removeu um título da página, _slug/alias_ ou link? 
Em caso afirmativo, existem links quebrados como resultado deste PR? 
Existe outra opção, como alterar o título da página sem alterar o _slug_?
- O PR apresenta uma nova página? Caso afirmativo:
  - A página está usando corretamente o [tipo de conteúdo](/docs/contribute/style/page-content-types/) e os códigos relacionados ao Hugo?
  - A página aparece corretamente na navegação da seção (ou em geral)?
  - A página deve aparecer na lista em [Documentação/Home](/pt-br/docs/home/)?
- As alterações aparecem na visualização do Netlify? Esteja particularmente atento a listas, blocos de código, tabelas, notas e imagens.

### Outro

- Cuidado com as [edições triviais](https://www.kubernetes.dev/docs/guide/pull-requests/#trivial-edits); 
  se você observar uma mudança que entender ser uma edição trivial, por favor, marque essa política (ainda não há problema em aceitar a alteração se for genuinamente uma melhoria).
- Incentive os autores que estão fazendo correções de espaço em branco a fazê-lo no primeiro commit de seu PR e, em seguida, adicione outras alterações além disso. 
  Isso facilita as revisões e o _merge_. 
  Cuidado especialmente com uma mudança trivial que aconteça em um único _commit_, juntamente com uma grande quantidade de limpeza dos espaços em branco (e se você observar isso, incentive o autor a corrigi-lo).

Como revisor, se você identificar pequenos problemas com um PR que não são essenciais para o significado, como erros de digitação ou espaços em branco incorretos, sinalize seus comentários com `nit:`. 
Isso permite que o autor saiba que esta parte do seu _feedback_ não é uma crítica.

Se você estiver considerando um __pull request__ e todo o _feedback_ restante estiver marcado como um `nit`, você pode realizar o _merge_ do PR de qualquer maneira. 
Nesse caso, muitas vezes é útil abrir uma _issue_ sobre os `nits` restantes. 
Considere se você é capaz de atender aos requisitos para marcar esse nova _issue_ como uma [Good First Issue](https://www.kubernetes.dev/docs/guide/help-wanted/#good-first-issue); se você puder, esses são uma boa fonte.
