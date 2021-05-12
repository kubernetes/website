---
reviewers:
title: Componentes do Kubernetes
content_type: concept
description: >
  Um cluster Kubernetes consiste de componentes que representam a camada de gerenciamento, e um conjunto de máquinas chamadas nós.
weight: 20
card:
  name: concepts
  weight: 20
---

<!-- overview -->
Ao implantar o Kubernetes, você obtém um cluster.
{{< glossary_definition term_id="cluster" length="all" prepend="Um cluster Kubernetes consiste em">}}

Este documento descreve os vários componentes que você precisa ter para implantar um cluster Kubernetes completo e funcional.

Esse é o diagrama de um cluster Kubernetes com todos os componentes interligados.

![Componentes do Kubernetes](/images/docs/components-of-kubernetes.svg)


<!-- body -->
## Componentes da camada de gerenciamento

Os componentes da camada de gerenciamento tomam decisões globais sobre o cluster (por exemplo, agendamento de _pods_), bem como detectam e respondem aos eventos do cluster (por exemplo, iniciando um novo _{{< glossary_tooltip text="pod" term_id="pod" >}}_ quando o campo `replicas` de um _Deployment_ não está atendido).

Os componentes da camada de gerenciamento podem ser executados em qualquer máquina do cluster. Contudo, para simplificar, os _scripts_ de configuração normalmente iniciam todos os componentes da camada de gerenciamento na mesma máquina, e não executa contêineres de usuário nesta máquina. Veja [Construindo clusters de alta disponibilidade](/docs/admin/high-availability/) para um exemplo de configuração de múltiplas VMs para camada de gerenciamento (_multi-main-VM_).

### kube-apiserver

{{< glossary_definition term_id="kube-apiserver" length="all" >}}

### etcd

{{< glossary_definition term_id="etcd" length="all" >}}

### kube-scheduler

{{< glossary_definition term_id="kube-scheduler" length="all" >}}

### kube-controller-manager

{{< glossary_definition term_id="kube-controller-manager" length="all" >}}

Alguns tipos desses controladores são:

  * Controlador de nó: responsável por perceber e responder quando os nós caem.
  * Controlador de _Job_: Observa os objetos _Job_ que representam tarefas únicas e, em seguida, cria _pods_ para executar essas tarefas até a conclusão.
  * Controlador de _endpoints_: preenche o objeto _Endpoints_ (ou seja, junta os Serviços e os _pods_).
  * Controladores de conta de serviço e de _token_: crie contas padrão e _tokens_ de acesso de API para novos _namespaces_.

### cloud-controller-manager

{{< glossary_definition term_id="cloud-controller-manager" length="short" >}}

O cloud-controller-manager executa apenas controladores que são específicos para seu provedor de nuvem.
Se você estiver executando o Kubernetes em suas próprias instalações ou em um ambiente de aprendizagem dentro de seu
próprio PC, o cluster não possui um gerenciador de controlador de nuvem.

Tal como acontece com o kube-controller-manager, o cloud-controller-manager combina vários ciclos de controle logicamente independentes em um binário único que você executa como um processo único. Você pode escalar horizontalmente (exectuar mais de uma cópia) para melhorar o desempenho ou para auxiliar na tolerância a falhas.

Os seguintes controladores podem ter dependências de provedor de nuvem:

  * Controlador de nó: para verificar junto ao provedor de nuvem para determinar se um nó foi excluído da nuvem após parar de responder.
  * Controlador de rota: para configurar rotas na infraestrutura de nuvem subjacente.
  * Controlador de serviço: Para criar, atualizar e excluir balanceadores de carga do provedor de nuvem.

## Node Components

Os componentes de nó são executados em todos os nós, mantendo os _pods_ em execução e fornecendo o ambiente de execução do Kubernetes.

### kubelet

{{< glossary_definition term_id="kubelet" length="all" >}}

### kube-proxy

{{< glossary_definition term_id="kube-proxy" length="all" >}}

### Container runtime

{{< glossary_definition term_id="container-runtime" length="all" >}}

## Addons

Complementos (_addons_) usam recursos do Kubernetes ({{< glossary_tooltip term_id="daemonset" >}}, {{< glossary_tooltip term_id="deployment" >}}, etc) para implementar funcionalidades do cluster. Como fornecem funcionalidades em nível do cluster, recursos de _addons_ que necessitem ser criados dentro de um _namespace_ pertencem ao _namespace_ `kube-system`.

Alguns _addons_ selecionados são descritos abaixo; para uma lista estendida dos _addons_ disponíveis, por favor consulte [Addons](/docs/concepts/cluster-administration/addons/).

### DNS

Embora os outros complementos não sejam estritamente necessários, todos os clusters do Kubernetes devem ter um [DNS do cluster](/docs/concepts/services-networking/dns-pod-service/), já que muitos exemplos dependem disso.

O DNS do cluster é um servidor DNS, além de outros servidores DNS em seu ambiente, que fornece registros DNS para serviços do Kubernetes.

Os contêineres iniciados pelo Kubernetes incluem automaticamente esse servidor DNS em suas pesquisas DNS.

### Web UI (Dashboard)

[Dashboard](/docs/tasks/access-application-cluster/web-ui-dashboard/) é uma interface de usuário Web, de uso geral, para clusters do Kubernetes. Ele permite que os usuários gerenciem e solucionem problemas de aplicações em execução no cluster, bem como o próprio cluster.

### Monitoramento de recursos do contêiner

[Monitoramento de recursos do contêiner](/docs/tasks/debug-application-cluster/resource-usage-monitoring/) registra métricas de série temporal genéricas sobre os contêineres em um banco de dados central e fornece uma interface de usuário para navegar por esses dados.

### Logging a nivel do cluster

Um mecanismo de [_logging_ a nível do cluster](/docs/concepts/cluster-administration/logging/) é responsável por guardar os _logs_ dos contêineres em um armazenamento central de _logs_ com um interface para navegação/pesquisa.

## {{% heading "whatsnext" %}}

* Aprenda sobre [Nós](/docs/concepts/architecture/nodes/).
* Aprenda sobre [Controladores](/docs/concepts/architecture/controller/).
* Aprenda sobre [kube-scheduler](/docs/concepts/scheduling-eviction/kube-scheduler/).
* Leia a [documentação](https://etcd.io/docs/) oficial do **etcd**.
