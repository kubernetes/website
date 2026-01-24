---
title: Contribuindo para os blogs do Kubernetes
slug: blog-contribution
content_type: concept
weight: 15
simple_list: true
---

<!-- overview -->

Existem dois blogs oficiais do Kubernetes, e a CNCF também possui
[seu próprio blog](https://www.cncf.io/blog/), onde você pode encontrar informações sobre Kubernetes. No blog principal do Kubernetes, nós (o projeto Kubernetes) gostamos de publicar artigos com diferentes perspectivas e focos específicos, que tenham relação com o Kubernetes.

Com apenas algumas exceções especiais, publicamos conteúdos que não tenham sido submetidos ou publicados em nenhum outro lugar.

Leia as [diretrizes do blog](/docs/contribute/blog/guidelines/#what-we-publish) para saber mais sobre esse aspecto.

## Blogs oficiais do Kubernetes

### Blog principal

O [blog principal do Kubernetes](/blog/) é utilizado pelo projeto para comunicar novas funcionalidades, relatórios da comunidade e quaisquer novidades relevantes para a comunidade Kubernetes. Isso inclui usuários finais e desenvolvedores. A maior parte do conteúdo do blog aborda coisas que acontecem no projeto principal, mas o Kubernetes, como projeto, também incentiva o envio de artigos sobre o que está acontecendo em outras partes do ecossistema!

Qualquer pessoa pode escrever um post para o blog e submetê-lo para publicação. Com apenas algumas exceções especiais, publicamos conteúdos que não tenham sido submetidos ou publicados em nenhum outro lugar.

### Blog de contribuidores

O [blog de contribuidores do Kubernetes](https://k8s.dev/blog/) é voltado para um público de pessoas que trabalham **no** Kubernetes, mais do que para pessoas que trabalham **com** Kubernetes. O projeto Kubernetes deliberadamente publica alguns artigos em ambos os blogs.

Qualquer pessoa pode escrever um post de blog e submetê-lo para revisão.

## Atualizações e manutenção de artigos {#maintenance}

O projeto Kubernetes não manutém artigos antigos publicados em seus blogs. Isso significa que qualquer artigo publicado há mais de um ano normalmente **não** será elegível para issues ou pull requests que solicitem alterações. Para evitar estabelecer precedentes, até mesmo pull requests tecnicamente corretos provavelmente serão rejeitados.

No entanto, existem exceções, como as seguintes:

* (atualizações em) artigos marcados como [evergreen](#maintenance-evergreen)
* remoção ou correção de artigos que fornecem orientações que agora estão incorretas ou são perigosas de seguir
* correções para garantir que um artigo existente continue sendo renderizado corretamente

Para qualquer artigo com mais de um ano que não esteja marcado como *evergreen*, o site exibe automaticamente um aviso informando que o conteúdo pode estar desatualizado.

### Artigos evergreen {#maintenance-evergreen}

Você pode marcar um artigo como evergreen definindo `evergreen: true` no front matter.

Nós só marcamos artigos de blog como mantidos (`evergreen: true` no front matter) se o projeto Kubernetes puder se comprometer a mantê-los indefinidamente. Alguns artigos realmente merecem isso; por exemplo, o time de comunicação de releases sempre marca os anúncios oficiais de lançamento como evergreen.

## {{% heading "whatsnext" %}}

* Conheça os blogs oficiais:
  * [Blog do Kubernetes](/blog/)
  * [Blog de contribuidores do Kubernetes](https://k8s.dev/blog/)
* Leia sobre [revisão de pull requests de blogs](/docs/contribute/review/reviewing-prs/#blog)
