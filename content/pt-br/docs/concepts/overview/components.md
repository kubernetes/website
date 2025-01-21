---
title: Componentes do Kubernetes
content_type: concept
description: >
  Uma visão geral dos componentes chave que formam um cluster Kubernetes.
weight: 10
card:
  title: Components of a cluster
  name: concepts
  weight: 20
---

<!-- overview -->
Este documento fornece uma visão geral em alto nível dos componentes essenciais que formam
um cluster Kubernetes.

{{< figure src="/images/docs/components-of-kubernetes.svg" alt="Componentes do Kubernetes" caption="Os componentes de um cluster do Kubernetes" class="diagram-large" >}}

<!-- body -->

## Componentes essenciais

Um cluster Kubernetes consiste de uma camada de gerenciamento e um ou mais nós de processamento.
Aqui está uma breve visão geral dos principais componentes:

### Componentes da Camada de Gerenciamento

Gerencia o estado geral do cluster:

[kube-apiserver](/docs/concepts/architecture/#kube-apiserver)
: Componente essencial de servidor que expõe a API HTTP do  Kubernetes

[etcd](/docs/concepts/architecture/#etcd)
: Banco de dados de chave-valor consistente e de alta disponibilidade para todos os dados do servidor da API

[kube-scheduler](/docs/concepts/architecture/#kube-scheduler)
: Procura por Pods que ainda não foram associados a um nó, e atribui cada Pod a um nó adequado.

[kube-controller-manager](/docs/concepts/architecture/#kube-controller-manager)
: Executa os {{< glossary_tooltip text="controladores" term_id="controller" >}} para implementar
o comportamento da API do Kubernetes

[cloud-controller-manager](/docs/concepts/architecture/#cloud-controller-manager) (optional)
: Integra com o provedor de nuvem subjacente.

## Componentes do nó {#node-components}

Os componentes do nó são executados em todos os nós, mantendo os Pods em execução
e fornecendo o ambiente de execução do Kubernetes.

[kubelet](/docs/concepts/architecture/#kubelet)
: Garante que os Pods estão em execução, incluindo seus contêineres.

[kube-proxy](/docs/concepts/architecture/#kube-proxy) (opcional)
: Mantém regras de rede nos nós para implementar {{< glossary_tooltip text="serviços" term_id="service" >}}.

[Agente de execução de contêineres](/docs/concepts/architecture/#container-runtime)
: Software responsável por executar contêineres. Leia
  [Container Runtimes](/docs/setup/production-environment/container-runtimes/) para saber mais (em inglês).

{{% thirdparty-content single="true" %}}

Seu cluster pode exigir softwares adicionais para cada nó; por exemplo, você pode também
executar o [systemd](https://systemd.io/) em um nó Linux para supervisionar componentes
que são executados localmente no nó.

## Complementos (_addons_) {#addons}

Complementos extendem a funcionalidade do Kubernetes. Alguns exemplos importantes incluem:

[DNS](/docs/concepts/architecture/#dns)
: para resolução de DNS para todo o cluster

[Interface Web](/docs/concepts/architecture/#web-ui-dashboard) (Dashboard)
: Para gerenciamento do cluster através de uma interface web

[Monitoramento de recursos de contêineres](/docs/concepts/architecture/#container-resource-monitoring)
: Para coletar e armazenar métricas de contêineres

[Geração de logs em nível de cluster](/docs/concepts/architecture/#cluster-level-logging)
: Para salvar os logs dos contêineres para um armazenamento central de logs

## Flexibilidade na Arquitetura

Kubernetes permite flexibilidade em como estes componentes são implantados e gerenciados.
A arquitetura pode ser adaptada para diversas necessidades, de pequenos ambientes de
desenvolvimento até implantações de ambientes de produção em larga escala.

Para mais informações detalhadas sobre como cada componente e várias formas de configurar
a arquitetura do seu cluster, veja a página da [Arquitetura do Cluster](/docs/concepts/architecture/).
