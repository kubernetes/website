---
title: Gerenciador de Controladores Integrados com a Nuvem
content_type: concept
weight: 40
---

<!-- overview -->

{{< feature-state state="beta" for_k8s_version="v1.11" >}}

Tecnologias de infraestrutura em nuvem permitem que você execute o Kubernetes em nuvens
públicas, privadas e híbridas. Kubernetes acredita em infraestrutura automatizada, dirigida
por API, sem ter alto acoplamento entre os componentes.

{{< glossary_definition term_id="cloud-controller-manager" length="all" >}}

O cloud-controller-manager é estruturado usando um mecanismo de plugin que permite que
diferentes provedores de nuvem integrem suas plataformas com o Kubernetes.

<!-- body -->

## Projeto de Arquitetura (Design)

![Componentes do Kubernetes](/images/docs/components-of-kubernetes.svg)

O gerenciador de controladores integrados com a nuvem é executado na camada de gerenciamento
como um conjunto replicado de processos (estes, normalmente, são contêineres em Pods). Cada
cloud-controller-manager implementa múltiplos {{< glossary_tooltip text="controladores" term_id="controller" >}}
em um único processo.

{{< note >}}
Você também pode executar o cloud-controller-manager como um {{< glossary_tooltip text="complemento" term_id="addons" >}} do Kubernetes ao invés de como parte da camada de gerenciamento.
{{< /note >}}

## Funções do gerenciador de controladores integrados com a nuvem {#functions-of-the-ccm}

Os controladores dentro do cloud-controller-manager incluem:

### Controlador de Node

O controlador de Node é responsável por atualizar objetos de {{< glossary_tooltip text="Node" term_id="node" >}},
quando novos servidores são criados na infraestrutura de nuvem. O controlador de node 
obtém informações sobre os nós em execução no cluster do provedor de nuvem. O controlador
de node executa as seguintes funções:

1. Atualizar os nodes com o identificador único dos servidores correspondentes obtido  da API do provedor de nuvem.
1. Anotar e rotular um node com labels com informações específicas da nuvem, tais como a 
região/zona em que o nó foi criado e os recursos (CPU, memória, etc) que ele tem disponível.
1. Obter os endereços de rede e o nome do host do node.
1. Verificar a saúde do node. No caso de um node não responder, verificar a nuvem para 
ver se o node foi desativado / removido / terminado. Se o node tiver sido excluído da nuvem,
o controlador remove o objeto Node do cluster Kubernetes.

Algumas implementações de provedores de nuvem separa estas funções em um controlador de node e um controlador separado de ciclo de vida de nodes.

### Controlador de Route

O controlador de Route é responsável por configurar as rotas na nuvem apropriadamente, de
modo que os contêineres em diferentes nodes no cluster do Kubernetes possam se comunicar 
entre si.

Dependendo do provedor da nuvem, a controlador de Route pode também alocar blocos de 
endereço IP para a rede dos Pods.

### Controlador de Service

Serviços (objetos do tipo {{< glossary_tooltip text="Service" term_id="service" >}})
integram com componentes de infraestrutura de nuvem tais como balanceadores de carga 
(_load balancers_), endereços de IP, filtragem de pacotes de rede, e _health check_ dos
servidores (para avaliar se os mesmos estão funcionando de acordo). O controlador
interage com a API do provedor de nuvem para configurar balanceadores de carga e outros
componentes de infraestrutura quendo você declara recursos do tipo Service que os 
requisitem.

## Autorização

Esta seção detalha o acesso necessário em vários objetos da API pelo gerenciador de
controladores integrados com a nuvem para executar suas operações.

### Controlador de Node {#authorization-node-controller}

O controlador de Node trabalha apenas com objetos Node. Ele requer acesso total para 
ler e modificar objetos Node.

`v1/Node`:

- get
- list
- create
- update
- patch
- watch
- delete

### Controlador de Route

O controlador de Route escuta a criação de objetos Node e configura apropriadamente as
rotas. Isso requer acesso a objetos Node.

`v1/Node`:

- get

### Controlador de Service

O controlador de Service observa eventos **create**, **update** e **delete** 
de objetos Service e, em seguida, configura _Endpoints_ (que são pontos de acesso) para 
esses serviços de forma apropriada (para objetos do tipo EndpointSlice, que agrupam
endpoints, o kube-controller-manager os gerencia sob-demanda).

Para acessar os Serviços, é necessário acesso para as operações **list** e **watch**.
Para atualizar os Serviços, o cloud-controller-manager precisa de acesso para as 
operações **patch** e **update**.

Para configurar recursos de Endpoints para os Serviços, ele precisa acesso para as 
operações **create**, **list**, **get**, **watch** e **update**.

`v1/Service`:

- list
- get
- watch
- patch
- update

### Outros {#authorization-miscellaneous}

A implementação essencial do gerenciador de controladores integrados com a nuvem requer
acesso para criar objetos de Event e, para garantir a operação segura, requer acesso para
criar ServiceAccounts.

`v1/Event`:

- create
- patch
- update

`v1/ServiceAccount`:

- create

O objeto ClusterRole de {{< glossary_tooltip text="RBAC" term_id="rbac" >}} para o
cloud-controller-manager se parece com isso:

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

## {{% heading "whatsnext" %}}

* [Cloud Controller Manager Administration](/docs/tasks/administer-cluster/running-cloud-controller/#cloud-controller-manager)
tem instruções sobre como executar e gerenciar o cloud-controller-manager (em inglês).

* Para atualizar a camada de gerenciamento em alta disponibilidade (_High Availability_)
  para usar o cloud-controller-manager, leia [Migrate Replicated Control Plane To Use Cloud Controller Manager](/docs/tasks/administer-cluster/controller-manager-leader-migration/).

* Deseja saber como implementar seu próprio cloud-controller-manager, ou extender um projeto
existente?

  - O cloud-controller-manager usa interfaces em Go, especificamente, a interface `CloudProvider`
  definida em [`cloud.go`](https://github.com/kubernetes/cloud-provider/blob/release-1.21/cloud.go#L42-L69)
  do repositório [kubernetes/cloud-provider](https://github.com/kubernetes/cloud-provider)
  para permitir a conexão de implementações de qualquer nuvem.
  - A implementação de controladores compartilhados descritos neste documento (controladores 
  de Node, Route e Service) e algumas estruturas compartilhadas na interface cloudprovider,
  é parte essencial do Kubernetes.
  Implementações específicas para provedores de nuvem estão fora do essencial do Kubernetes
  e implementam a interface `CloudProvider`.
  - Para mais informações sobre o desenvolvimento de plugins, leia [Developing Cloud Controller Manager](/docs/tasks/administer-cluster/developing-cloud-controller-manager/).
