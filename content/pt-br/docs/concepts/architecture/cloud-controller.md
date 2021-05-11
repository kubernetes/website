---
title: Conceitos sobre Cloud Controller Manager
content_type: concept
weight: 30
---

<!-- overview -->

O conceito do Cloud Controller Manager (CCM) (não confundir com o binário) foi originalmente criado para permitir que o código específico de provedor de nuvem e o núcleo do Kubernetes evoluíssem independentemente um do outro. O Cloud Controller Manager é executado junto com outros componentes principais, como o Kubernetes controller manager, o servidor de API e o scheduler. Também pode ser iniciado como um addon do Kubernetes, caso em que é executado em cima do Kubernetes.

O design do Cloud Controller Manager é baseado em um mecanismo de plug-in que permite que novos provedores de nuvem se integrem facilmente ao Kubernetes usando plug-ins. Existem planos para integrar novos provedores de nuvem no Kubernetes e para migrar provedores de nuvem que estão utilizando o modelo antigo para o novo modelo de CCM.

Este documento discute os conceitos por trás do Cloud Controller Manager e fornece detalhes sobre suas funções associadas.

Aqui está a arquitetura de um cluster Kubernetes sem o Cloud Controller Manager:

![Pre CCM Kube Arch](/images/docs/pre-ccm-arch.png)




<!-- body -->

## Projeto de Arquitetura (Design)

No diagrama anterior, o Kubernetes e o provedor de nuvem são integrados através de vários componentes diferentes:

* Kubelet
* Kubernetes controller manager
* Kubernetes API server

O CCM consolida toda a lógica que depende da nuvem dos três componentes anteriores para criar um único ponto de integração com a nuvem. A nova arquitetura com o CCM se parece com isso:

![CCM Kube Arch](/images/docs/post-ccm-arch.png)

## Componentes do CCM

O CCM separa algumas das funcionalidades do KCM (Kubernetes Controller Manager) e o executa como um processo separado. Especificamente, isso elimina os controladores no KCM que dependem da nuvem. O KCM tem os seguintes loops de controlador dependentes de nuvem:

 * Node controller
 * Volume controller
 * Route controller
 * Service controller

Na versão 1.9, o CCM executa os seguintes controladores da lista anterior:

* Node controller
* Route controller
* Service controller

{{< note >}}
O Volume Controller foi deliberadamente escolhido para não fazer parte do CCM. Devido à complexidade envolvida e devido aos esforços existentes para abstrair a lógica de volume específica do fornecedor, foi decidido que o Volume Controller não será movido para o CCM.
{{< /note >}}

O plano original para suportar volumes usando o CCM era usar volumes Flex para suportar volumes plugáveis. No entanto, um esforço concorrente conhecido como CSI está sendo planejado para substituir o Flex.

Considerando essas dinâmicas, decidimos ter uma medida de intervalo intermediário até que o CSI esteja pronto.

## Funções do CCM

O CCM herda suas funções de componentes do Kubernetes que são dependentes de um provedor de nuvem. Esta seção é estruturada com base nesses componentes.

### 1. Kubernetes Controller Manager

A maioria das funções do CCM é derivada do KCM. Conforme mencionado na seção anterior, o CCM executa os seguintes ciclos de controle:

* Node Controller
* Route Controller
* Service Controller

#### Node Controller

O Node Controller é responsável por inicializar um nó obtendo informações sobre os nós em execução no cluster do provedor de nuvem. O Node Controller executa as seguintes funções:

1. Inicializar um node com labels de região/zona específicos para a nuvem.
2. Inicialize um node com detalhes de instância específicos da nuvem, por exemplo, tipo e tamanho.
3. Obtenha os endereços de rede e o nome do host do node.
4. No caso de um node não responder, verifique a nuvem para ver se o node foi excluído da nuvem.
Se o node foi excluído da nuvem, exclua o objeto Node do Kubernetes.

#### Route Controller

O Route Controller é responsável por configurar as rotas na nuvem apropriadamente, de modo que os contêineres em diferentes nodes no cluster do Kubernetes possam se comunicar entre si. O Route Controller é aplicável apenas para clusters do Google Compute Engine.

#### Service controller

O Service controller é responsável por ouvir os eventos de criação, atualização e exclusão do serviço. Com base no estado atual dos serviços no Kubernetes, ele configura os balanceadores de carga da nuvem (como o ELB, o Google LB ou o Oracle Cloud Infrastrucutre LB) para refletir o estado dos serviços no Kubernetes. Além disso, garante que os back-ends de serviço para balanceadores de carga da nuvem estejam atualizados.

### 2. Kubelet

O Node Controller contém a funcionalidade dependente da nuvem do kubelet. Antes da introdução do CCM, o kubelet era responsável por inicializar um nó com detalhes específicos da nuvem, como endereços IP, rótulos de região / zona e informações de tipo de instância. A introdução do CCM mudou esta operação de inicialização do kubelet para o CCM.

Nesse novo modelo, o kubelet inicializa um nó sem informações específicas da nuvem. No entanto, ele adiciona uma marca (taint) ao nó recém-criado que torna o nó não programável até que o CCM inicialize o nó com informações específicas da nuvem. Em seguida, remove essa mancha (taint).

## Mecanismo de plugins

O Cloud Controller Manager usa interfaces Go para permitir implementações de qualquer nuvem a ser conectada. Especificamente, ele usa a Interface CloudProvider definida[aqui](https://github.com/kubernetes/cloud-provider/blob/9b77dc1c384685cb732b3025ed5689dd597a5971/cloud.go#L42-L62).

A implementação dos quatro controladores compartilhados destacados acima, e algumas estruturas que ficam junto com a interface compartilhada do provedor de nuvem, permanecerão no núcleo do Kubernetes. Implementações específicas para provedores de nuvem serão construídas fora do núcleo e implementarão interfaces definidas no núcleo.

Para obter mais informações sobre o desenvolvimento de plug-ins, consulte[Desenvolvendo o Cloud Controller Manager](/docs/tasks/administer-cluster/developing-cloud-controller-manager/).

## Autorização

Esta seção divide o acesso necessário em vários objetos da API pelo CCM para executar suas operações.

### Node Controller

O Node Controller só funciona com objetos Node. Ele requer acesso total para obter, listar, criar, atualizar, corrigir, assistir e excluir objetos Node.

v1/Node:

- Get
- List
- Create
- Update
- Patch
- Watch
- Delete

### Rote Controller

O Rote Controller escuta a criação do objeto Node e configura as rotas apropriadamente. Isso requer acesso a objetos Node.

v1/Node:

- Get

### Service Controller

O Service Controller escuta eventos de criação, atualização e exclusão de objeto de serviço e, em seguida, configura pontos de extremidade para esses serviços de forma apropriada.

Para acessar os Serviços, é necessário listar e monitorar o acesso. Para atualizar os Serviços, ele requer patch e atualização de acesso.

Para configurar endpoints para os Serviços, é necessário acesso para criar, listar, obter, assistir e atualizar.

v1/Service:

- List
- Get
- Watch
- Patch
- Update

### Outros

A implementação do núcleo do CCM requer acesso para criar eventos e, para garantir a operação segura, requer acesso para criar ServiceAccounts.

v1/Event:

- Create
- Patch
- Update

v1/ServiceAccount:

- Create

O RBAC ClusterRole para o CCM se parece com isso:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: cloud-controller-manager
rules:
- apiGroups:
  - ""
  resources:
  - events
  verbs:
  - create
  - patch
  - update
- apiGroups:
  - ""
  resources:
  - nodes
  verbs:
  - '*'
- apiGroups:
  - ""
  resources:
  - nodes/status
  verbs:
  - patch
- apiGroups:
  - ""
  resources:
  - services
  verbs:
  - list
  - patch
  - update
  - watch
- apiGroups:
  - ""
  resources:
  - serviceaccounts
  verbs:
  - create
- apiGroups:
  - ""
  resources:
  - persistentvolumes
  verbs:
  - get
  - list
  - update
  - watch
- apiGroups:
  - ""
  resources:
  - endpoints
  verbs:
  - create
  - get
  - list
  - watch
  - update
```

## Implementações de Provedores de Nuvem

Os seguintes provedores de nuvem implementaram CCMs:

* [Digital Ocean](https://github.com/digitalocean/digitalocean-cloud-controller-manager)
* [Oracle](https://github.com/oracle/oci-cloud-controller-manager)
* [Azure](https://github.com/kubernetes/cloud-provider-azure)
* [GCP](https://github.com/kubernetes/cloud-provider-gcp)
* [AWS](https://github.com/kubernetes/cloud-provider-aws)
* [BaiduCloud](https://github.com/baidu/cloud-provider-baiducloud)
* [Linode](https://github.com/linode/linode-cloud-controller-manager)

## Administração de Cluster

Voce vai encontrar instruções completas para configurar e executar o CCM
[aqui](/docs/tasks/administer-cluster/running-cloud-controller/#cloud-controller-manager).


