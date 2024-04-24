---
title: Referência
approvers:
- chenopis
linkTitle: "Referência"
main_menu: true
weight: 70
content_type: concept
---

<!-- overview -->

Esta seção da documentação do Kubernetes contém referências.



<!-- body -->

## Referência da API

* [Visão geral da API do Kubernetes](/docs/reference/using-api/api-overview/) - Visão geral da API para Kubernetes.
* [Referência da API Kubernetes {{< latest-version >}}](/docs/reference/generated/kubernetes-api/{{< latest-version >}}/)

## Biblioteca de clientes da API

Para chamar a API Kubernetes de uma linguagem de programação, você pode usar
[bibliotecas de clientes](/docs/reference/using-api/client-libraries/). Bibliotecas oficialmente suportadas:

- [Biblioteca do cliente Kubernetes em Go](https://github.com/kubernetes/client-go/)
- [Biblioteca do cliente Kubernetes em Python](https://github.com/kubernetes-client/python)
- [Biblioteca do cliente Kubernetes em Java](https://github.com/kubernetes-client/java)
- [Biblioteca do cliente Kubernetes em JavaScript](https://github.com/kubernetes-client/javascript)

## Referência da CLI

* [kubectl](/docs/reference/kubectl/overview/) - Ferramenta CLI principal para executar comandos e gerenciar clusters do Kubernetes.
    * [JSONPath](/docs/reference/kubectl/jsonpath/) - Guia de sintaxe para usar [Expressões JSONPath](http://goessner.net/articles/JsonPath/) com o kubectl.
* [kubeadm](/docs/reference/setup-tools/kubeadm/kubeadm/) - Ferramenta CLI para provisionar facilmente um cluster Kubernetes seguro.

## Referência de configuração

* [kubelet](/docs/reference/command-line-tools-reference/kubelet/) - O principal *agente do nó* que é executado em cada nó. O kubelet usa um conjunto de PodSpecs e garante que os contêineres descritos estejam funcionando e saudáveis.
* [kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/) - API REST que valida e configura dados para objetos de API, como pods, serviços, controladores de replicação.
* [kube-controller-manager](/docs/reference/command-line-tools-reference/kube-controller-manager/) - Daemon que incorpora os principais loops de controle enviados com o Kubernetes.
* [kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/) - É possível fazer o encaminhamento de fluxo TCP/UDP de forma simples ou utilizando o algoritimo de Round Robin encaminhando através de um conjunto de back-ends.
* [kube-scheduler](/docs/reference/command-line-tools-reference/kube-scheduler/) - Agendador que gerencia disponibilidade, desempenho e capacidade.

## Documentos de design

Um arquivo dos documentos de design para as funcionalidades do Kubernetes. Bons pontos de partida são [Arquitetura Kubernetes](https://git.k8s.io/community/contributors/design-proposals/architecture/architecture.md) e [Visão geral do design do Kubernetes](https://git.k8s.io/community/contributors/design-proposals).


