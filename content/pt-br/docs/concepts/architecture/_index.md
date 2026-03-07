---
title: "Arquitetura do Cluster"
weight: 30
description: >
  Os conceitos arquiteturais por trás do Kubernetes.
---

Um cluster Kubernetes consiste em um control plane mais um conjunto de máquinas trabalhadoras, chamadas de nodes,
que executam aplicações conteinerizadas. Todo cluster precisa de pelo menos um worker node para executar Pods.

Os worker nodes hospedam os Pods que são os componentes da carga de trabalho da aplicação.
O control plane gerencia os worker nodes e os Pods no cluster. Em ambientes de produção,
o control plane geralmente executa em múltiplos computadores e um cluster
geralmente executa múltiplos nodes, fornecendo tolerância a falhas e alta disponibilidade.

Este documento descreve os vários componentes que você precisa ter para um cluster Kubernetes completo e funcional.

{{< figure src="/images/docs/kubernetes-cluster-architecture.svg" alt="O control plane (kube-apiserver, etcd, kube-controller-manager, kube-scheduler) e vários nodes. Cada node está executando um kubelet e kube-proxy." caption="Figura 1. Componentes do cluster Kubernetes." class="diagram-large" >}}

{{< details summary="Sobre esta arquitetura" >}}
O diagrama na Figura 1 apresenta um exemplo de arquitetura de referência para um cluster Kubernetes.
A distribuição real dos componentes pode variar com base em configurações e requisitos específicos do cluster.

No diagrama, cada node executa o componente [`kube-proxy`](#kube-proxy). Você precisa de um
componente de proxy de rede em cada node para garantir que a
{{< glossary_tooltip text="API de Service" term_id="service">}} e comportamentos associados
estejam disponíveis na rede do seu cluster. No entanto, alguns plugins de rede fornecem sua própria
implementação de proxy de terceiros. Quando você usa esse tipo de plugin de rede,
o node não precisa executar o `kube-proxy`.
{{< /details >}}

## Componentes do control plane {#control-plane-components}

Os componentes do control plane tomam decisões globais sobre o cluster (por exemplo, agendamento),
bem como detectam e respondem a eventos do cluster (por exemplo, iniciar um novo
{{< glossary_tooltip text="pod" term_id="pod">}} quando o campo
`{{< glossary_tooltip text="replicas" term_id="replica" >}}` de um Deployment não está satisfeito).

Os componentes do control plane podem ser executados em qualquer máquina do cluster. No entanto, para simplicidade, scripts de
configuração normalmente iniciam todos os componentes do control plane na mesma máquina, e não executam contêineres de usuário nesta máquina.
Consulte [Criando clusters altamente disponíveis com kubeadm](/docs/setup/production-environment/tools/kubeadm/high-availability/)
para um exemplo de configuração do control plane que executa em múltiplas máquinas.

### kube-apiserver

{{< glossary_definition term_id="kube-apiserver" length="all" >}}

### etcd

{{< glossary_definition term_id="etcd" length="all" >}}

### kube-scheduler

{{< glossary_definition term_id="kube-scheduler" length="all" >}}

### kube-controller-manager

{{< glossary_definition term_id="kube-controller-manager" length="all" >}}

Existem muitos tipos diferentes de controllers. Alguns exemplos deles são:

- Node controller: Responsável por notar e responder quando nodes ficam indisponíveis.
- Job controller: Observa objetos Job que representam tarefas pontuais, depois cria Pods para executar essas tarefas até a conclusão.
- EndpointSlice controller: Preenche objetos EndpointSlice (para fornecer um link entre Services e Pods).
- ServiceAccount controller: Cria ServiceAccounts padrão para novos namespaces.

A lista acima não é exaustiva.

### cloud-controller-manager

{{< glossary_definition term_id="cloud-controller-manager" length="short" >}}

O cloud-controller-manager executa apenas controllers que são específicos do seu provedor de nuvem.
Se você está executando o Kubernetes em suas próprias instalações, ou em um ambiente de aprendizado dentro do seu
próprio PC, o cluster não tem um cloud controller manager.

Assim como o kube-controller-manager, o cloud-controller-manager combina vários loops de controle logicamente
independentes em um único binário que você executa como um único processo. Você pode escalar
horizontalmente (executar mais de uma cópia) para melhorar o desempenho ou para ajudar a tolerar falhas.

Os seguintes controllers podem ter dependências do provedor de nuvem:

- Node controller: Para verificar o provedor de nuvem para determinar se um node foi
  excluído na nuvem após parar de responder
- Route controller: Para configurar rotas na infraestrutura de nuvem subjacente
- Service controller: Para criar, atualizar e excluir load balancers do provedor de nuvem

---

## Componentes do node {#node-components}

Os componentes do node executam em cada node, mantendo pods em execução e fornecendo o ambiente de runtime do Kubernetes.

### kubelet

{{< glossary_definition term_id="kubelet" length="all" >}}

### kube-proxy (opcional) {#kube-proxy}

{{< glossary_definition term_id="kube-proxy" length="all" >}}
Se você usar um [plugin de rede](#network-plugins) que implementa encaminhamento de pacotes para Services
por si só, e fornece comportamento equivalente ao kube-proxy, então você não precisa executar
kube-proxy nos nodes do seu cluster.

### Agente de execução de contêiner {#container-runtime}

{{< glossary_definition term_id="container-runtime" length="all" >}}

## Addons

Addons usam recursos do Kubernetes ({{< glossary_tooltip term_id="daemonset" >}},
{{< glossary_tooltip term_id="deployment" >}}, etc) para implementar funcionalidades do cluster.
Como estes estão fornecendo funcionalidades no nível do cluster, recursos com namespace para
addons pertencem ao namespace `kube-system`.

Addons selecionados são descritos abaixo; para uma lista estendida de addons disponíveis,
consulte [Addons](/docs/concepts/cluster-administration/addons/).

### DNS

Embora os outros addons não sejam estritamente necessários, todos os clusters Kubernetes devem ter
[DNS do cluster](/docs/concepts/services-networking/dns-pod-service/), pois muitos exemplos dependem dele.

DNS do cluster é um servidor DNS, além do(s) outro(s) servidor(es) DNS em seu ambiente,
que serve registros DNS para services do Kubernetes.

Contêineres iniciados pelo Kubernetes automaticamente incluem este servidor DNS em suas buscas DNS.

### Web UI (Dashboard) {#web-ui-dashboard}

[Dashboard](/docs/tasks/access-application-cluster/web-ui-dashboard/) é uma UI baseada na web de propósito geral
para clusters Kubernetes. Ela permite aos usuários gerenciar e solucionar problemas de aplicações
executando no cluster, bem como o próprio cluster.

### Monitoramento de recursos de contêiner {#container-resource-monitoring}

[Monitoramento de Recursos de Contêiner](/docs/tasks/debug/debug-cluster/resource-usage-monitoring/)
grava métricas genéricas de séries temporais sobre contêineres em um banco de dados central, e fornece uma UI para navegar nesses dados.

### Logging no nível do cluster {#cluster-level-logging}

Um mecanismo de [logging no nível do cluster](/docs/concepts/cluster-administration/logging/) é responsável
por salvar logs de contêineres em um armazenamento central de logs com uma interface de busca/navegação.

### Plugins de rede {#network-plugins}

[Plugins de rede](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins)
são componentes de software que implementam a especificação da interface de rede de contêineres (CNI).
Eles são responsáveis por alocar endereços IP para pods e permitir que eles se comuniquem
uns com os outros dentro do cluster.

## Variações de arquitetura {#architecture-variations}

Embora os componentes principais do Kubernetes permaneçam consistentes, a forma como eles são implantados e
gerenciados pode variar. Entender essas variações é crucial para projetar e manter
clusters Kubernetes que atendam às necessidades operacionais específicas.

### Opções de implantação do control plane {#control-plane-deployment-options}

Os componentes do control plane podem ser implantados de várias maneiras:

Implantação tradicional
: Os componentes do control plane executam diretamente em máquinas dedicadas ou VMs, frequentemente gerenciados como serviços systemd.

Pods estáticos
: Os componentes do control plane são implantados como Pods estáticos, gerenciados pelo kubelet em nodes específicos.
Esta é uma abordagem comum usada por ferramentas como kubeadm.

Auto-hospedado
: O control plane executa como Pods dentro do próprio cluster Kubernetes, gerenciado por Deployments
e StatefulSets ou outras primitivas do Kubernetes.

Serviços gerenciados do Kubernetes
: Provedores de nuvem frequentemente abstraem o control plane, gerenciando seus componentes como parte de sua oferta de serviço.

### Considerações de posicionamento de carga de trabalho {#workload-placement-considerations}

O posicionamento de cargas de trabalho, incluindo os componentes do control plane, pode variar com base no tamanho do cluster,
requisitos de desempenho e políticas operacionais:

- Em clusters menores ou de desenvolvimento, componentes do control plane e cargas de trabalho de usuário podem executar nos mesmos nodes.
- Clusters de produção maiores frequentemente dedicam nodes específicos aos componentes do control plane,
  separando-os das cargas de trabalho de usuário.
- Algumas organizações executam addons críticos ou ferramentas de monitoramento em nodes do control plane.

### Ferramentas de gerenciamento de cluster {#cluster-management-tools}

Ferramentas como kubeadm, kops e Kubespray oferecem diferentes abordagens para implantar e gerenciar clusters,
cada uma com seu próprio método de layout e gerenciamento de componentes.

A flexibilidade da arquitetura do Kubernetes permite que organizações adaptem seus clusters às necessidades específicas,
equilibrando fatores como complexidade operacional, desempenho e sobrecarga de gerenciamento.

### Customização e extensibilidade {#customization-and-extensibility}

A arquitetura do Kubernetes permite customização significativa:

- Schedulers customizados podem ser implantados para trabalhar junto com o scheduler padrão do Kubernetes ou para substituí-lo completamente.
- Servidores de API podem ser estendidos com CustomResourceDefinitions e API Aggregation.
- Provedores de nuvem podem se integrar profundamente com o Kubernetes usando o cloud-controller-manager.

A flexibilidade da arquitetura do Kubernetes permite que organizações adaptem seus clusters às necessidades específicas,
equilibrando fatores como complexidade operacional, desempenho e sobrecarga de gerenciamento.

## {{% heading "whatsnext" %}}

Saiba mais sobre o seguinte:

- [Nodes](/docs/concepts/architecture/nodes/) e
  [sua comunicação](/docs/concepts/architecture/control-plane-node-communication/)
  com o control plane.
- [Controllers](/docs/concepts/architecture/controller/) do Kubernetes.
- [kube-scheduler](/docs/concepts/scheduling-eviction/kube-scheduler/) que é o scheduler padrão para o Kubernetes.
- [Documentação](https://etcd.io/docs/) oficial do Etcd.
- Vários [agentes de execução de contêiner](/docs/setup/production-environment/container-runtimes/) no Kubernetes.
- Integrando com provedores de nuvem usando [cloud-controller-manager](/docs/concepts/architecture/cloud-controller/).
- Comandos [kubectl](/docs/reference/generated/kubectl/kubectl-commands).
