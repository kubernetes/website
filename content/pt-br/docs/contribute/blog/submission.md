---
title: Enviando artigos para blogs do Kubernetes
slug: article-submission
content_type: concept
weight: 30
---

<!-- overview -->

Existem dois blogs oficiais do Kubernetes, e a CNCF também possui seu próprio blog, onde você pode encontrar informações sobre Kubernetes. No [blog principal do Kubernetes](/docs/contribute/blog/), nós (o projeto Kubernetes) gostamos de publicar artigos com diferentes perspectivas e focos específicos, que tenham relação com o Kubernetes.

Com apenas algumas exceções especiais, publicamos conteúdos que não tenham sido submetidos ou publicados em nenhum outro lugar.

<!-- body -->

## Escrevendo para os blogs do Kubernetes

Como autor, você tem três caminhos diferentes para a publicação.

### Caminho recomendado {#route-1}

A abordagem recomendada pelo projeto Kubernetes é: envie sua proposta de artigo entrando em contato com a equipe do blog. Você pode fazer isso pelo Slack do Kubernetes ([#sig-docs-blog](https://kubernetes.slack.com/archives/CJDHVD54J)). Para artigos que você deseja publicar apenas no blog de contribuidores, também é possível enviar a ideia diretamente para o [SIG ContribEx comms](https://kubernetes.slack.com/archives/C03KT3SUJ20).
<!-- FIXME: ou usando este formulário -->

A menos que haja algum problema com o seu envio, a equipe do blog / SIG ContribEx irá conectar você com:

* um _editor_ do blog
* seu _parceiro de escrita_ (outro autor do blog)

Quando a equipe conecta você com outro autor, a ideia é que vocês se apoiem mutuamente, revisando os rascunhos um do outro. Você não precisa ser especialista no assunto; a maioria das pessoas que lerá o artigo também não será. Nós, a equipe de blog do Kubernetes, chamamos esse outro autor de parceiro de escrita.

O editor está lá para ajudar você ao longo da jornada, do rascunho até a publicação Ele pode aprovar seu artigo diretamente para publicação ou pode organizar o processo de aprovação.

Leia [escrever um artigo para blog](#authoring) para saber mais sobre o processo.

### Começando com um pull request {#route-2}

O segundo caminho para escrever para nossos blogs é começar diretamente com um pull request no GitHub. A equipe do blog não recomenda essa abordagem; o GitHub é bastante útil para colaboração em código, mas não é ideal para escrita de textos longos.

É totalmente aceitável abrir um pull request inicial provisório com um commit vazio, e em seguida, trabalhar fora do GitHub antes de retornar ao PR inicial.

Assim como no [caminho recomendado](#route-1), tentaremos encontrar um parceiro de escrita e um editor do blog para você. Eles ajudarão você a preparar o artigo para publicação.

### Processo de artigos pós-release {#route-3-post-release-comms}

O terceiro caminho é voltado para artigos sobre alterações no Kubernetes relacionadas a um release. Sempre que há um release, a equipe de Release Comms assume o controle do calendário de publicações do blog. Pessoas que adicionam funcionalidades a um release, ou que estão planejando outras alterações que o projeto precisa anunciar, podem entrar em contato com o Release Comms para que seu artigo seja planejado, redigido, revisado e eventualmente publicado.

## Agendamento de artigos

Para o blog do Kubernetes, a equipe do blog geralmente programa publicações de artigos em dias úteis (Calendário Gregoriano, como utilizado nos EUA e em outros países). Quando é importante publicar em uma data específica que cai em um fim de semana, a equipe tenta acomodar essa necessidade.

A seção sobre [escrever um artigo para blog](#authoring) explica o que fazer:

* inicialmente, não especifique uma data para o artigo
* porém, defina o artigo como rascunho (adicione `draft: true` no front matter)

Quando o bot Prow faz o merge do PR que você escreve, o artigo continua como rascunho e não é publicado. Um contribuidor do Kubernetes (você, seu parceiro de escrita ou alguém da equipe do blog) abre então um pequeno PR de acompanhamento marcando o artigo para publicação. Ao fazer o merge desse segundo PR, o artigo deixa de ser rascunho e passa a ser publicado automaticamente.

No dia em que o artigo está programado para ser publicado, a automação aciona a build do site e o artigo se torna visível.

## Escrevendo um artigo {#authoring}

Após apresentar sua ideia, incentivamos você a usar HackMD (um editor Markdown web) ou um Google Docs, para compartilhar uma versão editável do texto. Seu parceiro de escrita pode ler seu rascunho, e em seguida, fazer sugestões ou fornecer outros comentários. Além de verificar se o conteúdo está alinhado com as [diretrizes do blog](/docs/contribute/blog/guidelines/).

Ao mesmo tempo, você normalmente será o parceiro de escrita **deles** e poderá seguir nosso [guia](/docs/contribute/blog/writing-buddy/) sobre como apoiar o trabalho deles.

### Etapas administrativas iniciais

Você deve [assinar o CLA](/docs/contribute/new-content/#contributing-basics) caso ainda não tenha feito isso. É recomendável iniciar esse processo cedo; se você estiver escrevendo como parte do seu trabalho, talvez precise verificar com a equipe jurídica ou com seu gestor para garantir que você está autorizado a assinar.

### Rascunho inicial

A equipe do blog recomenda que você utilize HackMD ou Google Docs, para preparar e compartilhar uma versão inicial do texto do artigo que possa ser editada em tempo real.

{{< note >}}
Se optar por usar o Google Docs, você pode configurar seu documento no modo Markdown.{{< /note >}}

Seu parceiro de escrita pode comentar e / ou fornecer feedback sobre seu rascunho e irá (ou deveria) verificar se ele está de acordo com as diretrizes. Ao mesmo tempo, você será o parceiro de escrita dele e seguirá o [guia](/docs/contribute/blog/writing-buddy/) que explica como você irá apoiar o trabalho dele.

Nesta fase, não se preocupe muito em acertar a formatação Markdown exatamente.

Se houver imagens, você pode colar versões bitmap para receber um feedback inicial. A equipe do blog pode ajudar você (mais tarde no processo), a preparar as ilustrações para a publicação final.

### Markdown para publicação

Confira o formato Markdown de posts existentes no
[repositório do site](https://github.com/kubernetes/website/tree/master/content/en/blog/_posts) no GitHub.

Se você ainda não estiver familiarizado, leia [noções básicas de contribuição](/docs/contribute/new-content/#contributing-basics). Esta seção da página pressupõe que você não possui um clone local do seu fork e que você está trabalhando através da interface web do GitHub. Você precisa criar um fork remoto do repositório do site caso ainda não tenha.

No repositório do GitHub, clique no botão **Criar novo arquivo**. Copie o conteúdo existente do HackMD ou Google Docs e cole no editor. Mais detalhes sobre o conteúdo do arquivo serão fornecidos posteriormente nesta seção. Nomeie o arquivo de acordo com o título proposto para o post do blog, mas não inclua a data no nome do arquivo. Os revisores do blog trabalharão com você para definir o nome final do arquivo e a data que o artigo será publicado.

1. Ao salvar o arquivo, o GitHub irá guiá-lo através do processo de pull request.

2. Seu parceiro de escrita pode revisar o seu envio e trabalhar com você no feedback nos detalhes finais. Um editor do blog aprova seu pull request para o merge, como um rascunho que ainda não foi agendamento.

#### Front matter

O arquivo Markdown que você escrever deve usar o formato YAML do Hugo [front matter](https://gohugo.io/content-management/front-matter/).

Aqui está um exemplo:

```yaml
---
layout: blog
title: "Seu Título Aqui"
draft: true # será alterado para date: YYYY-MM-DD antes da publicação
slug: texto-em-minusculo-para-o-link-sem-espacos # opcional
author: >
  Autor-1 (Afiliação),
  Autor-2 (Afiliação),
  Autor-3 (Afiliação)
---
```

* inicialmente, não especifique uma data para o artigo
* no entanto, defina o artigo como rascunho (adicione `draft: true` [front matter](https://gohugo.io/content-management/front-matter/) do artigo)

#### Conteúdo do artigo

Certifique-se de usar títulos Markdown de segundo nível (`##` não `#`) como o nível to título mais alto no artigo. O `título` que você define no front matter se torna o título de primeiro nível da página.

Você deve seguir o [guia de estilo](https://kubernetes.io/docs/contribute/style/style-guide/), mas com as seguintes exceções:

- é aceitável que os autores escrevam um artigo em seu próprio estilo, desde que a maioria dos leitores compreenda o ponto que está sendo apresentado.
- é aceitável usar "nós" em um artigo do blog com múltiplos autores ou quando a introdução do artigo indica claramente que o autor está escrevendo em nome de um grupo específico. Como você notará nesta seção, embora nós [evitemos usar "nós"](/docs/contribute/style/style-guide/#avoid-using-we) em nossa documentação, é aceitável fazer exceções justificáveis.
- evitamos usar shortcodes do Kubernetes para chamadas (como `{{</* caution */>}}`). Isso porque as chamadas são direcionadas a leitores de documentação, e artigos de blog não são documentação.
- declarações sobre o futuro são aceitáveis, embora as usemos com cautela em anúncios oficiais em nome do Kubernetes.
- exemplos de código usados ​​em artigos de blog não precisam usar o shortcode `{{</* code_sample */>}}`, e muitas vezes é melhor (mais fácil de manter) que não o usem.

#### Diagramas e ilustrações {#illustrations}


Para ilustrações, diagramas ou gráficos, utilize o [figure shortcode](https://gohugo.io/content-management/shortcodes/#figure) sempre que possível. Você deve definir um atributo `alt` para acessibilidade.

Para ilustrações e diagramas técnicos, tente usar gráficos vetoriais. A equipe do blog recomenda SVG em vez de formatos de diagrama raster (bitmap / pixel) e também recomenda SVG em vez de Mermaid (você ainda pode capturar o código-fonte do Mermaid em um comentário). A preferência por SVG em vez de Mermaid se deve ao fato de que, quando os mantenedores atualizam o Mermaid ou fazem alterações na renderização do diagrama, eles podem não ter uma maneira fácil de entrar em contato com o autor original do artigo do blog para verificar se as alterações estão corretas.
O [guia de diagramas](/docs/contribute/style/diagram-guide/) destina-se à documentação do Kubernetes, não a artigos de blog. Ainda assim, é bom segui-lo, mas:

- não há necessidade de legendar os diagramas como Figura 1, Figura 2, etc.

A exigência de imagens escaláveis ​​(vetoriais) torna o processo mais difícil para pessoas menos familiarizadas com o assunto enviarem artigos; o Kubernetes SIG Docs continua buscando maneiras de reduzir essa barreira. Se você tiver ideias sobre como facilitar esse processo, por favor, ofereça-se para ajudar.

<!-- nota para os responsáveis ​​por esta página: imagens vetoriais são mais fáceis de localizar e são independentes de resolução, portanto, podem ter uma aparência consistentemente boa em diferentes telas -->

Para outras imagens (como fotos), a equipe do blog recomenda fortemente o uso de atributos `alt`. É aceitável usar um atributo `alt` vazio se o software de acessibilidade não deve mencionar a imagem, mas essa é uma situação rara.


#### Mensagens de commit

No momento em que você marcar sua solicitação de pull request como pronta para revisão, cada mensagem de commit deve ser um breve resumo do trabalho que está sendo feito. A primeira mensagem de commit deve fazer sentido como uma descrição geral da postagem do blog.

Exemplos de uma boa mensagem de commit:

- _Add blog post on the foo kubernetes feature_
- _blog: foobar announcement_

Exemplos de mensagens ruins de commit:

- _Placeholder commit for announcement about foo_
- _Add blog post_
- _asdf_
- _initial commit_
- _draft post_

#### Squash

Assim que você achar que o artigo está pronto para o merge, você deve
[squash](https://www.k8s.dev/docs/guide/pull-requests/#squashing) os commits em seu pull request; se você não tiver certeza de como fazer isso, não hesite em pedir ajuda à equipe do blog.