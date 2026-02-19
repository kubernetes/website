---
title: Diretrizes para o blog
content_type: concept
weight: 40
---

<!-- overview -->

Estas diretrizes abrangem o blog principal do Kubernetes e o blog de contribuidores do Kubernetes.

Todo o conteúdo do blog também deve aderir à política geral do [guia de conteúdo](/docs/contribute/style/content-guide/).

# {{% heading "prerequisites" %}}

Certifique-se de estar familiarizado com as seções de introdução de [contribuindo para os blogs do Kubernetes](/docs/contribute/blog/), não apenas para aprender sobre os dois blogs oficiais e as diferenças entre eles, mas também para obter uma visão geral do processo.

## Conteúdo original

O projeto Kubernetes aceita **apenas conteúdo original**, em inglês.

{{< note >}}
O projeto Kubernetes não pode aceitar conteúdo para o blog se ele já tiver sido enviado ou publicado fora do projeto Kubernetes.

Os blogs oficiais não estão disponíveis como meio para reaproveitar conteúdo existente
de terceiros como se fosse conteúdo novo.
{{< /note >}}

Essa restrição também se aplica à promoção de outros projetos da Linux Foundation e da CNCF. Muitos projetos da CNCF possuem seus próprios blogs. Estes geralmente são uma escolha melhor para publicações sobre um projeto específico, mesmo que esse projeto tenha sido criado especificamente para funcionar com Kubernetes (ou com Linux, etc.).

## Conteúdo relevante

Os artigos devem conter conteúdo que se aplique de forma ampla à comunidade Kubernetes. Por exemplo, um envio deve focar no Kubernetes upstream, e não em configurações específicas de fornecedores. Para artigos enviados ao blog principal que não sejam [artigos espelho](/docs/contribute/blog/article-mirroring/), os hiperlinks no artigo devem normalmente direcionar para a documentação oficial do Kubernetes. Ao fazer referências externas, os links devem ser diversificados - por exemplo, um envio não deve conter apenas links para o blog de uma única empresa.

Os blogs oficiais do Kubernetes **não** são o local para propostas de fornecedores ou para artigos que promovam uma solução específica de fora do Kubernetes.

Às vezes, esse é um  equilíbrio delicado. Você pode pedir orientação no Slack ([#sig-docs-blog](https://kubernetes.slack.com/archives/CJDHVD54J)) para entender se um post é apropriado para o blog do Kubernetes e / ou para o blog de contribuidores - não hesite em entrar em contato.

O [guia de conteúdo](/docs/contribute/style/content-guide/) se aplica incondicionalmente a artigos de blog e aos PRs que os adicionam. Tenha em mente que algumas restrições no guia indicam que são relevantes apenas para a documentação; essas restrições marcadas não se aplicam a artigos do blog.

## Localização

O site está localizado em vários idiomas; o inglês é o idioma base para todas as outras localizações. Mesmo que você fale outro idioma e fique feliz em fornecer uma localização, isso deve ser feito em um pull request separado (consulte [idiomas por PR](/docs/contribute/new-content/#languages-per-pr)).

## Direitos autorais e reutilização

Você deve escrever [conteúdo original](#conteúdo-original) e deve ter permissão para licenciar esse conteúdo para a Cloud Native Computing Foundation (para que o projeto Kubernetes possa publicá-lo legalmente). Isso significa que não somente o plágio direto é proibido, mas também que você não pode escrever um artigo do blog se não tiver permissão para atender às condições de licenciamento de direitos autorais da CNCF (por exemplo, se o seu empregador tiver uma política de propriedade intelectual que restrinja o que você tem permissão para fazer).

A [licença](https://github.com/kubernetes/website/blob/main/LICENSE) do blog permite o uso comercial do conteúdo para fins comerciais, mas não o contrário.

## Grupos de interesse especial e grupos de trabalho

Tópicos relacionados à participação ou aos resultados das atividades dos SIGs do Kubernetes estão sempre no tópico (consulte o trabalho da [Equipe de Comunicação de Contribuidores](https://github.com/kubernetes/community/blob/master/communication/contributor-comms/blogging-resources/blog-guidelines.md#contributor-comms-blog-guidelines)
para suporte a esses posts).

O projeto normalmente [espelha](/docs/contribute/blog/article-mirroring/) esses artigos em ambos os blogs.

## Restrições nacionais sobre conteúdo

O site do Kubernetes possui uma licença de Provedor de Conteúdo de Internet (ICP) do governo da China. Embora seja improvável que isso seja um problema, o Kubernetes não pode publicar artigos que seriam bloqueados pela filtragem oficial de conteúdo da internet do governo chinês.

## Diretrizes específicas para conteúdo de blog {#what-we-publish}

Além do [guia de estilo geral](/docs/contribute/style/style-guide/), os artigos de blog devem (não obrigatoriamente) se alinhar às [recomendações de estilo específicas para blogs](/docs/contribute/blog/article-submission/#article-content).

O restante desta página é uma orientação adicional; não são regras rígidas que os artigos devem seguir, mas os revisores provavelmente irão (e devem) solicitar ajustes em artigos que obviamente não estejam alinhados com as recomendações aqui descritas.

### Diagramas e ilustrações {#illustrations}

Para [ilustrações](/docs/contribute/blog/article-submission/#illustrations) - incluindo diagramas ou gráficos - utilize o [shortcode figure](https://gohugo.io/content-management/shortcodes/#figure) sempre que possível. Você deve definir um atributo `alt` para acessibilidade.

Utilize imagens vetoriais para ilustrações, diagramas técnicos e gráficos similares;
o formato SVG é fortemente recomendado.

Artigos que utilizam imagens rasterizadas para ilustrações são mais difíceis de manter e, em alguns casos, a equipe do blog pode solicitar que o autor revise o artigo antes da publicação.

### Atemporalidade

Os posts do blog devem buscar ser à prova do futuro

- Dada a velocidade de desenvolvimento do projeto, o SIG Docs prefere uma escrita _atemporal_: conteúdo que não exija atualizações frequentes para se manter correto para o leitor.
- Pode ser melhor adicionar um tutorial ou atualizar a documentação oficial do que escrever uma visão geral de alto nível em um post do blog.
- Considere concentrar o conteúdo técnico mais extenso como um call to action do post do blog, e foque no problema ou no motivo pelo qual os leitores deveriam se importar.


### Exemplos de conteúdo

Aqui estão alguns exemplos de conteúdo apropriado para o [blog principal do Kubernetes](/docs/contribute/blog/#main-blog):

* Anúncios sobre novos recursos do Kubernetes
* Explicações de como alcançar um determinado resultado usando Kubernetes; apresente uma abordagem de baixo esforço operacional para aprimorar um rolling deploy.
* Comparações entre diferentes opções de software relacionadas a Kubernetes e cloud native. É aceitável incluir links para uma dessas opções, desde que você divulgue claramente qualquer conflito de interesse / relacionamento
* Relatos sobre problemas ou incidentes e como você os resolveu
* Artigos sobre a construção de plataformas cloud native para casos de uso específicos
* Sua opinião sobre pontos positivos ou negativos do Kubernetes
* Anúncios e notícias sobre componentes não centrais do Kubernetes, como a Gateway API
* [Anúncios e atualizações pós-release](#post-release-comms)
* Comunicados sobre vulnerabilidades de segurança importantes do Kubernetes
* Atualizações de projetos do Kubernetes
* Tutoriais e demonstrações
* Liderança de pensamento sobre Kubernetes e cloud native
* Os componentes do Kubernetes são propositalmente modulares, então textos sobre pontos de integração existentes como CNI e CSI são relevantes. Desde que você não escreva uma proposta de fornecedor, você também pode escrever sobre o que está do outro lado dessas integrações.

Aqui estão alguns exemplos de conteúdo apropriado para o [blog de contribuidores](/docs/contribute/blog/#contributor-blog) do Kubernetes:

* Artigos sobre como testar suas alterações no código do Kubernetes
* Conteúdo sobre contribuições não relacionadas a código
* Discussões sobre funcionalidades em estágio alfa, cujo design ainda está em discussão
* Artigos do tipo “Conheça o time” sobre grupos de trabalho, SIGs, etc.
* Um guia sobre como escrever código seguro que fará parte do próprio Kubernetes
* Artigos sobre encontros de mantenedores e os resultados desses encontros

### Exemplos de conteúdo que não será aceito {#what-we-do-not-publish}

No entanto, o projeto não publicará:

* Propostas de fornecedores
* Um artigo que você já publicou em outro lugar, mesmo que apenas em seu próprio blog de baixo tráfego
* Grandes blocos de código-fonte de exemplo com apenas uma explicação mínima
* Atualizações sobre projetos externos que funcionam ou dependem do Kubernetes (esses devem ser publicados no blog do próprio projeto externo)
* Artigos sobre o uso do Kubernetes com um cloud provider específico
* Artigos que critiquem pessoas, grupos de pessoas ou empresas específicas
* Artigos que contêm erros técnicos importantes ou detalhes enganosos (por exemplo: se você recomendar desativar um importante controle de segurança em clusters de produção, porque isso pode ser inconveniente, é provável que o projeto Kubernetes rejeite o artigo)
