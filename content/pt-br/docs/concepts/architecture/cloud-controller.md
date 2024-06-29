---
title: Cloud Controller Manager
content_type: concept
weight: 40
---

<!-- overview -->

As tecnologias de infraestrutura em nuvem permitem-nos executar o Kubernetes em nuvens públicas, privadas e híbridas. O Kubernetes acredita em uma infraestrutura automatizada e orientada por API, sem acoplamento rígido entre os componentes.

O cloud-controller-manager é um componente do control plane do Kubernetes que incorpora a lógica de controle específica da nuvem. O cloud-controller-manager permite conectar seu cluster à API do seu provedor de nuvem, e separa os componentes que interagem com essa plataforma de nuvem dos componentes que interagem apenas com seu cluster.

Ao desacoplar a lógica de interoperabilidade entre o Kubernetes e a infraestrutura subjacente da nuvem, o componente cloud-controller-manager permite que os provedores de nuvem lancem recursos em um ritmo diferente em comparação com o projeto principal do Kubernetes.

O cloud-controller-manager é estruturado usando um mecanismo de plugin que permite que diferentes provedores de nuvem integrem suas plataformas com o Kubernetes.

<!-- body -->

## Design

![Kubernetes components](/images/docs/components-of-kubernetes.svg)

O cloud controller manager é executado no control plane como um conjunto replicado de processos (geralmente, esses são contêineres em Pods). Cada cloud-controller-manager implementa múltiplos  {{< glossary_tooltip text="controladores" term_id="controller" >}} em um único processo.

{{< note >}}
Nota:
Você também pode executar o cloud controller manager como um {{< glossary_tooltip text="addon" term_id="addons" >}} do Kubernetes em vez de como parte do plano de controle.
{{< /note >}}

## Funções do cloud controller manager 

Os controladores dentro do cloud controller manager incluem:

### Node Controller

O node controller é responsável por atualizar objetos Node quando novos servidores são criados em sua infraestrutura de nuvem. O controlador de nós obtém informações sobre os hosts em execução dentro da sua _tenancy_ com o provedor de nuvem. Ele realiza as seguintes funções:

1. Atualizar um objeto Node com o identificador único do servidor correspondente obtido da API do provedor de nuvem.
2. Anotar e rotular o objeto Node com informações específicas da nuvem, como a região onde o nó está implantado e os recursos (CPU, memória, etc.) disponíveis.
3. Obter o hostname e os endereços de rede do nó.
4. Verificar a saúde do nó. Caso um nó se torne não responsivo, este controlador verifica com a API do provedor de nuvem se o servidor foi desativado/deletado/terminado. Se o nó foi deletado da nuvem, o controlador exclui o objeto Node do seu cluster Kubernetes.

Algumas implementações de provedores de nuvem dividem isso em um node controller e um node lifecycle controller separado.

### Route Controller

O route controller é responsável por configurar rotas na nuvem adequadamente para que contêineres em diferentes nós no seu cluster Kubernetes possam se comunicar entre si.

Dependendo do provedor de nuvem, o controlador de roteadores também pode alocar blocos de endereços IP para a rede de Pods.

### Service Controller

Os {{< glossary_tooltip text="Services" term_id="service" >}} integram-se com componentes da infraestrutura de nuvem, como balanceadores de carga gerenciados, endereços IP, filtragem de pacotes de rede e verificação de integridade dos alvos. O service controller interage com as APIs do seu provedor de nuvem para configurar balanceadores de carga e outros componentes de infraestrutura quando você declara um recurso de Service que os requer.

## Autorização

Esta seção detalha o acesso que o cloud controller manager precisa em vários objetos da API para realizar suas operações.

### Node Controller 

O Node controller trabalha apenas com objetos Node. Ele requer acesso completo para ler e modificar objetos Node.

`v1/Node`:

- get
- list
- create
- update
- patch
- watch
- delete

### Route Controller
O controlador de roteadores monitora a criação de objetos Node e configura rotas de forma apropriada. Ele requer acesso de leitura (Get) aos objetos Node.

`v1/Node`:

- get

### Service Controller

O service controller monitora eventos de criação(**create**), atualização(**update**) e exclusão(**delete**) de objetos do tipo Service e, em seguida, configura Endpoints para esses serviços de forma apropriada (para EndpointSlices, o kube-controller-manager gerencia esses sob demanda).

Para acessar a API de Services, ele requer acesso para listar (**list**) e monitorar (**watch**). Para atualizar Services, ele precisa de acesso para aplicar patch (patch) e atualizar (update).

Para configurar o recurso de `Endpoints` para os Services, ele necessita de acesso para criar (**create**), listar (**list**), obter (**get**), monitorar (**watch**) e atualizar (**update**).

`v1/Service`:

- list
- get
- watch
- patch
- update

### Outros 

A implementação do _core_ do cloud controller manager requer acesso para criar objetos Event e, para garantir uma operação segura, necessita de acesso para criar ServiceAccounts.

`v1/Event`:

- create
- patch
- update

`v1/ServiceAccount`:

- create

The {{< glossary_tooltip term_id="rbac" text="RBAC" >}} ClusterRole for the cloud
controller manager looks like:
A {{< glossary_tooltip term_id="rbac" text="RBAC" >}} do ClusterRole para o cloud controller manager é semelhante a:

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

## {{% heading "A seguir" %}}

* [Cloud Controller Manager Administration](/docs/tasks/administer-cluster/running-cloud-controller/#cloud-controller-manager) possui instruções para configurar e executar o cloud controller manager.

* Para atualizar um plano de controle HA para usar o cloud controller manager, consulte [Migrate Replicated Control Plane To Use Cloud Controller Manager](/docs/tasks/administer-cluster/controller-manager-leader-migration/).

* Quer saber como implementar seu próprio cloud controller manager ou estender um projeto existente?

 - O cloud controller manager usa interfaces Go, especificamente, a interface `CloudProvider` definida em 
    [`cloud.go`](https://github.com/kubernetes/cloud-provider/blob/release-1.21/cloud.go#L42-L69)
    do [kubernetes/cloud-provider](https://github.com/kubernetes/cloud-provider) para permitir que implementações de qualquer nuvem possam ser conectadas.
  - The implementation of the shared controllers highlighted in this document (Node, Route, and Service),
    and some scaffolding along with the shared cloudprovider interface, is part of the Kubernetes core.
    Implementations specific to cloud providers are outside the core of Kubernetes and implement
    the `CloudProvider` interface.
  - A implementação dos controladores compartilhados destacados neste documento (Node, Route e Service),
    e alguns scaffolds, juntamente com a interface compartilhada do cloudprovider fazem parte do core do Kubernetes.
    Implementações específicas para provedores de nuvem estão fora do core do Kubernetes e implementam
    a interface `CloudProvider`.
  - Para mais informações sobre o desenvolvimento de plugins,
    veja [Developing Cloud Controller Manager](/docs/tasks/administer-cluster/developing-cloud-controller-manager/).
