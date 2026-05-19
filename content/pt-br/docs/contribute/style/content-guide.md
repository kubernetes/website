---
title: Guia de Conteúdo da Documentação
linktitle: Guia de conteúdo
content_type: concept
weight: 10
---

<!-- overview -->

Esta página contém orientações para a documentação do Kubernetes.

Se você tiver dúvidas sobre o que é permitido, junte-se ao canal #sig-docs no
[Slack do Kubernetes](https://slack.k8s.io/) e pergunte!

Você pode se registrar no Slack do Kubernetes através do endereço https://slack.k8s.io/.

Para informações sobre como criar novo conteúdo para a documentação do Kubernetes,
siga o [guia de estilo](/pt-br/docs/contribute/style/style-guide).

<!-- body -->

## Visão geral

O código-fonte para o _website_ do Kubernetes, incluindo a documentação, é
armazenado no repositório [kubernetes/website](https://github.com/kubernetes/website).

Localizada dentro da pasta `kubernetes/website/content/<codigo-do-idioma>/docs`,
a maior parte da documentação do Kubernetes é específica para o
[projeto Kubernetes](https://github.com/kubernetes/kubernetes).

## O que é permitido

A documentação do Kubernetes permite conteúdo de projetos de terceiros somente
quando:

- O conteúdo documenta software que existe no projeto Kubernetes
- O conteúdo documenta software que está fora do projeto, mas é necessário para
  o funcionamento do Kubernetes
- O conteúdo é canônico no kubernetes.io, ou está vinculado a conteúdo canônico
  em outro local

### Conteúdo de terceiros {#third-party-content}

A documentação do Kubernetes contém exemplos aplicados de projetos no projeto
Kubernetes &mdash; projetos que existem nas organizações
[kubernetes](https://github.com/kubernetes) e
[kubernetes-sigs](https://github.com/kubernetes-sigs)
do GitHub.

Links para conteúdo ativo no projeto Kubernetes sempre são permitidos.

O Kubernetes requer alguns conteúdos de terceiros para funcionar. Exemplos
incluem agentes de execução de contêiner (containerd, CRI-O, Docker),
[políticas de rede](/pt-br/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
(plugins CNI), [controladores Ingress](/docs/concepts/services-networking/ingress-controllers/),
e [sistemas de log](/pt-br/docs/concepts/cluster-administration/logging/).

A documentação pode conter vínculos com software de código aberto de terceiros
fora do projeto Kubernetes somente quando estes projetos são necessários para
o funcionamento do Kubernetes.

### Conteúdo duplicado

Sempre que possível, a documentação do Kubernetes utiliza links para fontes
canônicas de documentação ao invés de hospedar conteúdo duplicado.

Conteúdo duplicado requer o dobro de esforço (ou mais!) para manter e fica
obsoleto mais rapidamente.

{{< note >}}
Se você é um mantenedor e precisa de auxílio para hospedar sua própria
documentação, solicite ajuda no canal
[#sig-docs do Slack do Kubernetes](https://kubernetes.slack.com/messages/C1J0BPD2M/).
{{< /note >}}

### Mais informações

Se você tem dúvidas sobre o conteúdo permitido, junte-se ao canal #sig-docs
do [Slack do Kubernetes](https://slack.k8s.io/) e faça sua pergunta!

## {{% heading "whatsnext" %}}

* Leia o [guia de estilo](/pt-br/docs/contribute/style/style-guide).
