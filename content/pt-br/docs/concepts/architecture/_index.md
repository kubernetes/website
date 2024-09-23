---
title: "Arquitetura do Cluster"
weight: 30
description: >
  Os conceitos arquiteturais por trás do Kubernetes
---

Um {{< glossary_tooltip text="cluster" term_id="cluster" >}} Kubernetes consiste de uma 
{{< glossary_tooltip text="camada de gerenciamento" term_id="control-plane" >}} somada a 
um conjunto de máquinas de processamento, chamadas {{< glossary_tooltip text="nós" term_id="node" >}} (Node em ingles),
que executam aplicações em {{< glossary_tooltip text="contêineres" term_id="container" >}}.
Cada cluster precisa de pelo menos um nó de processamento para executar Pods.

Os nós de processamento hospedam os {{< glossary_tooltip text="Pods" term_id="pod" >}} que
são os componentes da {{< glossary_tooltip text="carga de trabalho" term_id="workload" >}}
da aplicação.
A camada de gerenciamento gerencia os nós de processamento e os Pods em um cluster. Em ambientes
de produção, a camada de gerenciamento normalmente é executada entre múltiplos computadores
e um cluster normalmente executa múltiplos nós, fornecendo tolerância a falhas e alta disponibilidade.

Este documento descreve os vários componentes que você precisa para ter um cluster Kubernetes
completo e funcional.

{{< figure 
	src="/images/docs/kubernetes-cluster-architecture-pt.svg" 
	alt="A camada de gerenciamento (kube-apiserver, etcd, kube-controller-manager, kube-scheduler) e vários nós. Cada nó está executando um kubelet e um kube-proxy."
	title="Componentes de um cluster Kubernetes"
	caption="**Observação:** Este diagrama apresenta uma arquitetura de referência de exemplo para um cluster Kubernetes. A distribuição real dos componentes pode variar baseada em configurações e requisitos específicos do cluster." 
	class="diagram-large" 
>}}

## Componentes da camada de gerenciamento

Os componentes da camada de gerenciamento tomam decisões globais sobre o cluster (por exemplo, alocação),
bem como detectam e respondem a eventos do cluster (por exemplo, iniciar um novo pod quando
o campo `replicas` de um {{< glossary_tooltip text="Deployment" term_id="deployment" >}}
não está satisfeito).

Os componentes da camada de gerenciamento podem ser executados em qualquer máquina no cluster.
Contudo, para simplificar, scripts de configuração normalmente iniciam todos os componentes
da camada de gerenciamento na mesma máquina, e não executam contêineres de usuários nesta máquina.
Confira [Criando clusters de Alta Disponibilidade com kubeadm](/docs/setup/production-environment/tools/kubeadm/high-availability/) (em inglês)
para um exemplo de uma configuração da camada de gerenciamento que é executada entre múltiplas máquinas.

### kube-apiserver

{{< glossary_definition term_id="kube-apiserver" length="all" >}}

### etcd

{{< glossary_definition term_id="etcd" length="all" >}}

### kube-scheduler

{{< glossary_definition term_id="kube-scheduler" length="all" >}}

### kube-controller-manager

{{< glossary_definition term_id="kube-controller-manager" length="all" >}}

Existem diversos tipos diferentes de controladores. Alguns exemplos deles são:

- Controlador de Node: responsável por perceber e responder quando nós caem.
- Controlador de {{< glossary_tooltip text="Job" term_id="job" >}}: Observa os objetos do
tipo Job que representam tarefas pontuais, então cria Pods para executar estas tarefas até
a conclusão.
- Controlador de {{< glossary_tooltip text="EndpointSlice" term_id="endpoint-slice" >}}: Popula
objetos do tipo EndpointSlice (para fornecer um vínculo entre Serviços e Pods).
- Controlador de {{< glossary_tooltip text="ServiceAccount" term_id="service-account" >}}:
Cria contas de serviço padrão para novos {{< glossary_tooltip text="namespaces" term_id="namespace" >}}.

A lista acima não é completa.

### cloud-controller-manager

{{< glossary_definition term_id="cloud-controller-manager" length="short" >}}

O cloud-controller-manager executa apenas controladores que são específicos para o seu
provedor de nuvem. Se você está executando Kubernetes nas suas próprias instalações
(_on premises_), ou em um ambiente de aprendizado no seu PC próprio, seu cluster não tem 
um gerenciador de controladores integrados com a nuvem.

Assim como com o kube-controller-manager, o cloud-controller-manager combina vários 
circuitos de controles lógicos independentes em um único binário que você executa como um
único processo. Você pode escalonar horizontalmente (executar mais de uma cópia) para
melhorar o desempenho ou para auxiliar na tolerância a falhas.

Os controladores a seguir podem ter dependências do provedor de nuvem:

- Controlador de Node: para verificar o provedor de nuvem para determinar se um nó foi 
removido na nuvem depois que ele parou de responder
- Controlador de Route: Para ajustar rotas na infraestrutura subjacente da nuvem
- Controlador de Service: Para criar, atualizar e remover balanceadores de carga do provedor
de nuvem

## Componentes para nó

Componentes de Nó são executados em cada nó, conservando a execução de pods e fornecendo o
ambiente de execução do Kubernetes.

### kubelet

{{< glossary_definition term_id="kubelet" length="all" >}}

### kube-proxy (optional) {#kube-proxy}

{{< glossary_definition term_id="kube-proxy" length="all" >}}
Se você usa um [plugin de redes](#network-plugins) que implementa o encaminhamento de pacotes
para Serviços por si próprio, e que fornece o comportamento equivalente ao kube-proxy, então
você não precisa executar o kube-proxy nos nós do seu cluster.

### Agente de execução de contêiner

{{< glossary_definition term_id="container-runtime" length="all" >}}

## Complementos

{{< glossary_tooltip text="Complementos" term_id="addons" >}} usam recursos do Kubernetes
({{< glossary_tooltip term_id="daemonset" >}}, {{< glossary_tooltip term_id="deployment" >}},
etc) para implementar funcionalidades do cluster. Porque os complementos estão fornecendo
funcionalidades em nível do cluster, os recursos nos namespaces para os complementos pertencem
ao namespace do `kube-system`.

Alguns complementos selecionados estão descritos abaixo; para uma lista mais extensa de
complementos disponíveis, por favor veja [Instalando Complementos](/docs/concepts/cluster-administration/addons/).

### DNS

Enquanto outros complementos não são estritamente obrigatórios, todos os cluster Kubernetes
deveriam ter o [Cluster DNS](/docs/concepts/services-networking/dns-pod-service/),
já que muitos exemplos se apoiam nisso.

O complemento Cluster DNS é um servidor DNS, além de outro(s) servidor(es) DNS no seu ambiente,
que serve registros de DNS para os serviços Kubernetes.

Contêineres iniciados pelo Kubernetes automaticamente incluem este servidor DNS em suas pesquisas
DNS.

### Inteface Web (Dashboard)

O [Dashboard](/docs/tasks/access-application-cluster/web-ui-dashboard/) é uma interface de usuário
baseada na web e de propósito geral para clusters Kubernetes. Ele permite que usuários gerenciem
e solucionem problemas em aplicações que estão sendo executadas no cluster, bem como o próprio cluster.

### Monitoramento de recursos de contêineres

O [Monitoramento de Recursos de Contêineres](/docs/tasks/debug/debug-cluster/resource-usage-monitoring/)
registra métricas de séries temporais genéricas em um banco de dados central, e fornece uma
interface de usuário para navegar por esses dados.

### Geração de logs em nível de cluster

Um mecanismo de [geração de logs em nível de cluster](/docs/concepts/cluster-administration/logging/)
é responsável por salvar os logs gerados pelos contêineres para um armazenamento de log central
com uma interface de pesquisa e navegação.

### Plugins de rede

[Plugins de rede](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins) são
componentes de software que implementam a especificação de Interface de Redes de Contêineres
({{< glossary_tooltip text="CNI" term_id="cni" >}}). Eles são responsáveis por alocar endereços
de IP para os pods e habilitá-los a se comunicar uns com os outros dentro do cluster.

## Variações da Arquitetura

Enquanto os componentes essenciais do Kubernetes permaneçam consistentes, a forma como eles
são implantados e gerenciados pode variar. Entender estas variações é crucial para projetar
e manter clusters Kubernetes que atendem necessidades operacionais específicas.

### Opções de implantação da camada de gerenciamento

Os componentes da camada de gerenciamento podem ser implantados de diversas formas:

Implantação tradicional
: Os componentes da camada de gerenciamento são executados diretamente em máquinas dedicadas
ou máquinas virtuais, frequentemente gerenciados como serviços do systemd.

Pods estáticos
: Os componentes da camada de gerenciamento são implantados como Pods estáticos, gerenciados
pelo kubelet em nós específicos.
  Esta é uma abordagem comum usada por ferramentas como {{< glossary_tooltip text="kubeadm" term_id="kubeadm" >}}.

Auto-hosptedados
: A camada de gerenciamento é executada como Pods dentro do próprio cluster Kubernetes,
gerenciada por Deployments e {{< glossary_tooltip text="StatefulSets" term_id="statefulset" >}}
ou outros objetos primitivos do Kubernetes.

Serviços do Kubernetes Gerenciado
: Provedores de nuvem, com frequência, abstraem a camada de gerenciamento, gerenciando seus
componentes como parte de sua oferta de serviços.

### Considerações na acomodação da carga de trabalho

A acomodação das cargas de trabalho, incluindo os componentes da camada de gerenciamento,
podem variar baseada no dimensionamento do cluster, requisitos de performance e políticas
operacionais:

- Em clusters menores ou para desenvolvimento, os componentes da camada de gerenciamento
e cargas de trabalho de usuários podem ser executados no mesmo nó.
- Clusters maiores para produção, com frequência, dedicam nós específicos para os componentes
da camada de gerenciamento, separando-os das cargas de trabalho dos usuários.
- Algumas organizações executam complementos críticos ou ferramentas de monitoramento nos
nós da camada de gerenciamento.

### Ferramentas de gerenciamento do cluster

Ferramentas como kubeadm, {{< glossary_tooltip text="kops" term_id="kops" >}} e Kubespray
oferecem abordagens diferentes para implantar e gerenciar clusters, cada uma com seus próprios
métodos de arranjar e gerenciar os componentes.

A flexibilidade da arquitetura do Kubernetes permite que organizações adequem seus clusters
para necessidades específicas, equilibrando fatores tais como complexidade operacional, e
sobrecarga de performance e gerenciamento.

### Personalização e extensibilidade

A arquitetura do Kubernetes permite personalização significativa:

- Escalonadores personalizados podem ser implantados para trabalhar junto com o {{< glossary_tooltip text="escalonador padrão do Kubernetes" term_id="kube-scheduler" >}},
ou substituí-lo completamente.
- Servidores de API podem ser estendidos com {{< glossary_tooltip text="CustomResourceDefinition" term_id="CustomResourceDefinition" >}}
e {{< glossary_tooltip text="agregação" term_id="aggregation-layer" >}} de APIs.
- Provedores de nuvem podem integrar profundamente com o Kubernetes usando o cloud-controller-manager.

A flexibilidade da arquitetura do Kubernetes permite que organizações adequem seus clusters
para necessidades específicas, equilibrando fatores tais como complexidade operacional, e
sobrecarga de performance e gerenciamento.

## {{% heading "whatsnext" %}}

Saiba mais sobre os tópicos a seguir:

- [Nós](/docs/concepts/architecture/nodes/) e a [comunicação deles](/docs/concepts/architecture/control-plane-node-communication/)
com a camada de gerenciamento.
- [Controladores](/docs/concepts/architecture/controller/) do Kubernetes.
- [kube-scheduler](/docs/concepts/scheduling-eviction/kube-scheduler/), que é o escalonador
padrão para o Kubernetes.
- A [documentação](https://etcd.io/docs/) oficial do Etcd (**em inglês**).
- Vários [agentes de execução de contêiner](/docs/setup/production-environment/container-runtimes/)
no Kubernetes.
- Integração com provedores de nuvem usando o [Gerenciador de Controladores Integrados com a Nuvem](/docs/concepts/architecture/cloud-controller).
- Comandos do [kubectl](/docs/reference/generated/kubectl/kubectl-commands).
