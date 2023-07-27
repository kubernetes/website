---
title: Cotas de Recursos
content_type: concept
weight: 20
---

<!-- overview -->

Quando vários usuários ou equipes compartilham um cluster com um número fixo de nós,
há uma preocupação de que uma equipe possa usar mais do que é justo durante o compartilhamento de recursos.

As cotas de recursos são uma ferramenta para os administradores resolverem essa preocupação.

<!-- body -->

Uma cota de recurso, definida por um objeto `ResourceQuota`, fornece restrições que limitam
consumo de recursos agregados por _namespace_. Pode limitar a quantidade de objetos que podem
ser criado em um _namespace_ por tipo, bem como a quantidade total de recursos computacionais que podem
ser consumidos por recursos nesse _namespace_.

As cotas de recursos funcionam assim: 

- Diferentes equipes trabalham em diferentes _namespaces_. Atualmente, isso é voluntário, mas o suporte para tornar isso obrigatório por meio de ACLs está planejado.

- O administrador cria uma `ResourceQuota` para cada _namespace_.

- Os usuários criam recursos (pods, serviços, etc.) no _namespace_ e o sistema de cotas rastreia o uso para garantir que ele não exceda os limites de recursos definidos em um `ResourceQuota`.


- Se a criação ou atualização de um recurso violar uma restrição de cota, a solicitação falhará com código de status HTTP `403 FORBIDDEN` acompanhado de uma mensagem explicando a restrição que foi violada. 

- Se a cota estiver habilitada em um _namespace_ para recursos computacionais como `cpu` e `memória`, os usuários devem especificar solicitações ou limites para esses valores; caso contrário, o sistema de cotas poderá rejeitar a criação de pods. Dica: use o controlador de admissão `LimitRanger` para forçar padrões para pods que não exigem recursos computacionais.

  Veja o [passo a passo](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)
  para um exemplo de como evitar este problema. 

O nome de um objeto `ResourceQuota` deve ser um [nome do subdomínio DNS](/pt-br/docs/concepts/overview/working-with-objects/names#dns-subdomain-names) válido.

Exemplos de políticas que podem ser criadas usando _namespaces_ e cotas são:

- Em um cluster com capacidade de 32 GiB de RAM e 16 núcleos, deixe a equipe A usar 20 GiB e 10 núcleos, deixe B usar 10GiB e 4 núcleos e mantenha 2GiB e 2 núcleos em reserva para alocação futura.
- Limite o _namespace_ "testing" para usar 1 núcleo e 1GiB de RAM. Deixe o namespace "produção" usar qualquer quantia.

Caso a capacidade total do cluster seja menor que a soma das cotas dos _namespaces_, pode haver contenção de recursos. Isso é tratado por ordem de chegada.

Nem a contenção nem as alterações na cota afetarão os recursos já criados.

## Ativando a cota de recursos

O suporte à cota de recursos é ativado por padrão para muitas distribuições do Kubernetes. Isto é
ativado quando a flag {{< glossary_tooltip text="API server" term_id="kube-apiserver" >}} `--enable-admission-plugins=` tem `ResourceQuota` como
um de seus argumentos.

Uma cota de recurso é aplicada em um _namespace_ específico quando há um `ResourceQuota` nesse _namespace_.

## Cota de recursos computacionais

Você pode limitar a soma total de [recursos computacionais](/docs/concepts/configuration/manage-resources-containers/) que pode ser solicitado em um determinado _namespace_.

Os seguintes tipos de recursos são suportados:

| Nome do Recurso | Descrição |
| --------------------- | ----------------------------------------------------------- |
| `limits.cpu` | Em todos os pods em um estado não terminal, a soma dos limites de CPU não pode exceder esse valor. |
| `limits.memory` | Em todos os pods em um estado não terminal, a soma dos limites de memória não pode exceder esse valor.|
| `requests.cpu` | Em todos os pods em um estado não terminal, a soma das solicitações da CPU não pode exceder esse valor. |
| `requests.memory` | Em todos os pods em um estado não terminal, a soma das solicitações de memória não pode exceder esse valor. |
| `hugepages-<size>` | Em todos os pods em um estado não terminal, o número de solicitações de grandes páginas do tamanho especificado não pode exceder esse valor. |
| `cpu` | O mesmo que `requests.cpu` |
| `memory` | O mesmo que `requests.memory` |

### Cota de recursos para recursos estendidos

Além dos recursos mencionados acima, na versão 1.10, suporte a cotas para [recursos estendidos](/docs/concepts/configuration/manage-resources-containers/#extended-resources) foi adicionado.

Como o `overcommit` não é permitido para recursos estendidos, não faz sentido especificar tanto `requests` e `limits` para o mesmo recurso estendido em uma cota. Portanto, para recursos estendidos, apenas itens de cota com prefixo `requests.` é permitido por enquanto.

Tome o recurso GPU como exemplo, se o nome do recurso for `nvidia.com/gpu` e você quiser limitar o número total de GPUs solicitadas em um _namespace_ para 4, você pode definir uma cota da seguinte maneira:

* `requests.nvidia.com/gpu: 4`

Veja [como visualizar e definir cotas](#viewing-and-setting-quotas) para mais informações.


## Cota de recursos de armazenamento

Você pode limitar a soma total de [recursos de armazenamento](/docs/concepts/storage/persistent-volumes/) que podem ser solicitados em um determinado _namespace_.

Além disso, você pode limitar o consumo de recursos de armazenamento com base na classe de armazenamento associada.

| Nome do recurso | Descrição |
| --------------------- | ----------------------------------------------------------- |
| `requests.storage` | Em todas as solicitações de volume persistentes, a soma das solicitações de armazenamento não pode exceder esse valor.|
| `persistentvolumeclaims` | O número total de [PersistentVolumeClaims](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims) que podem existir no namespace. |
| `<storage-class-name>.storageclass.storage.k8s.io/requests.storage` | Em todas as solicitações de volume persistentes associadas ao `<storage-class-name>`, a soma das solicitações de armazenamento não pode exceder esse valor. |
| `<storage-class-name>.storageclass.storage.k8s.io/persistentvolumeclaims` | Em todas as declarações de volume persistentes associadas ao storage-class-name, o número total de [declarações de volume persistente](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims) que podem existir no namespace. |

Por exemplo, se um operador deseja cotar armazenamento com classe de armazenamento `gold` separada da classe de armazenamento `bronze`, o operador pode definir uma cota da seguinte forma:

* `gold.storageclass.storage.k8s.io/requests.storage: 500Gi`
* `bronze.storageclass.storage.k8s.io/requests.storage: 100Gi`

Na versão 1.8, o suporte de cota para armazenamento temporário local foi adicionado como um recurso alfa:

| Nome do Recurso | Descrição |
| ------------------------------- |----------------------------------------------------------- |
| `requests.ephemeral-storage` | Em todos os pods no _namespace_, a soma das solicitações de armazenamento local efêmero não pode exceder esse valor.|
| `limits.ephemeral-storage` | Em todos os pods no _namespace_, a soma dos limites de armazenamento temporário local não pode exceder esse valor. |
| `ephemeral-storage` | O mesmo que `requests.ephemeral-storage`. |

{{< note >}}
Ao usar um tempo de execução do contêiner CRI, os logs do contêiner serão contabilizados na cota de armazenamento efêmero. Isso pode resultar no despejo inesperado de pods que esgotaram suas cotas de armazenamento. Consulte [Arquitetura de registro](/docs/concepts/cluster-administration/logging/) para mais detalhes.
{{< /note >}}

## Cota de contagem de objetos

Você pode definir cotas para o número total de determinados recursos de todos os padrões, tipos de recursos com _namespace_ usando a seguinte sintaxe:

* `count/<resource>.<group>` para recursos de grupos não principais
* `count/<resource>` para recursos do grupo principal

Exemplo de conjunto de recursos que os usuários podem querer colocar na cota de contagem de objetos:

* `count/persistentvolumeclaims`
* `count/services`
* `count/secrets`
* `count/configmaps`
* `count/replicationcontrollers`
* `count/deployments.apps`
* `count/replicasets.apps`
* `count/statefulsets.apps`
* `count/jobs.batch`
* `count/cronjobs.batch`

A mesma sintaxe pode ser usada para recursos personalizados. Por exemplo, para criar uma cota em um recurso personalizado `widgets` no grupo de API `example.com`, use `count/widgets.example.com`.

Ao usar a cota de recurso `count/*`, um objeto é cobrado na cota se existir no armazenamento do servidor. Esses tipos de cotas são úteis para proteger contra o esgotamento dos recursos de armazenamento. Por exemplo, você pode desejar limitar o número de segredos em um servidor devido ao seu grande tamanho. Muitos segredos em um cluster podem
na verdade, impedir que servidores e controladores sejam iniciados. Você pode definir uma cota para projetos para proteger contra um `CronJob` mal configurado. `CronJobs` que criam muitos `Jobs` em um _namespace_ podem levar a uma negação de serviço.

Também é possível fazer uma cota de contagem de objetos genéricos em um conjunto limitado de recursos.
Os seguintes tipos são suportados:

| Nome do Recurso | Descrição |
| ------------------------------- | ------------------------------------------------- |
| `configmaps` | O número total de `ConfigMaps` que podem existir no namespace. |
| `persistentvolumeclaims` | O número total de [PersistentVolumeClaims](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims) que podem existir no namespace. |
| `pods` | O número total de pods em um estado não terminal que pode existir no namespace. Um pod está em um estado terminal se `.status.phase in (Failed, Succeeded)` for verdadeiro.  |
| `replicationcontrollers` | O número total de `ReplicationControllers` que podem existir no _namespace_. |
| `resourcequotas` | O número total de `ResourceQuotas` que podem existir no _namespace_. |
| `services` | O número total de Serviços que podem existir no _namespace_. |
| `services.loadbalancers` | O número total de serviços do tipo `LoadBalancer` que podem existir no _namespace_. |
| `services.nodeports` | O número total de serviços do tipo `NodePort` que podem existir no _namespace_. |
| `secrets` | O número total de segredos que podem existir no _namespace_. |

Por exemplo, a cota de `pods` conta e impõe um número máximo de `pods` criados em um único _namespace_ que não é terminal. Você pode querer definir uma cota `pods`em um _namespace_ para evitar o caso em que um usuário cria muitos `pods` pequenos e esgota o fornecimento de IPs de pod do cluster.

## Escopos de cota

Cada cota pode ter um conjunto associado de `scopes`. Uma cota só medirá o uso de um recurso se corresponder
a interseção de escopos enumerados.

Quando um escopo é adicionado à cota, ele limita o número de recursos aos quais ele dá suporte a aqueles que pertencem ao escopo. Os recursos especificados na cota fora do conjunto permitido resultam em um erro de validação.

| Escopo | Descrição |
| ----- | ----------- |
| `Terminating` | Pods correspondentes onde `.spec.activeDeadlineSeconds >= 0` |
| `NotTerminating` | Pods correspondentes onde `.spec.activeDeadlineSeconds is nil` |
| `BestEffort` | Pods correspondentes que tenham a qualidade de serviço de melhor esforço. |
| `NotBestEffort` | Pods correspondentes que não têm qualidade de serviço de melhor esforço. |
| `PriorityClass` | Corresponde aos pods que fazem referência à [classe de prioridade](/docs/concepts/scheduling-eviction/pod-priority-preemption) especificada. |
| `CrossNamespacePodAffinity` | Corresponde a pods que tenham [termos de (anti)afinidade](/docs/concepts/scheduling-eviction/assign-pod-node) de _namespace_ cruzado. |

O escopo `BestEffort` restringe uma cota ao rastreamento do seguinte recurso:

* `pods`

Os escopos `Termination`, `NotTerminate`, `NotBestEffort` e `PriorityClass`restringem uma cota para rastrear os seguintes recursos:

* `pods`
* `cpu`
* `memory`
* `requests.cpu`
* `requests.memory`
* `limits.cpu`
* `limits.memory`

Observe que você não pode especificar os escopos `Terminate` e o `NotTerminate`na mesma cota, e você também não pode especificar o `BestEffort` e`NotBestEffort` na mesma cota.

O `scopeSelector` suporta os seguintes valores no campo `operator`:

* `In`
* `NotIn`
* `Exists`
* `DoesNotExist`

Ao usar um dos seguintes valores como o `scopeName` ao definir o`scopeSelector`, o `operator` deve ser `Exists`. 

* `Terminating`
* `NotTerminating`
* `BestEffort`
* `NotBestEffort`

Se o `operator` for `In` ou `NotIn`, o campo `values` deve ter pelo menos um valor. Por exemplo:

```yaml
  scopeSelector:
    matchExpressions:
      - scopeName: PriorityClass
        operator: In
        values:
          - middle
```

Se o `operator` for `Exists` ou `DoesNotExist`, o campo `values` *NÃO* deve ser especificado.

### Cota de recursos por classe de prioridade

{{< feature-state for_k8s_version="v1.17" state="stable" >}}

Os pods podem ser criados em uma [prioridade](/docs/concepts/scheduling-eviction/pod-priority-preemption/#pod-priority) específica. Você pode controlar o consumo de recursos do sistema de um pod com base na prioridade de um pod, usando o `scopeSelector`
campo na especificação de cota.

Uma cota é correspondida e consumida apenas se `scopeSelector` na especificação de cota selecionar o pod.

Quando a cota está no escopo da classe de prioridade usando o campo `scopeSelector`, objeto de cota
está restrito a rastrear apenas os seguintes recursos:

* `pods`
* `cpu`
* `memory`
* `ephemeral-storage`
* `limits.cpu`
* `limits.memory`
* `limits.ephemeral-storage`
* `requests.cpu`
* `requests.memory`
* `requests.ephemeral-storage`

Este exemplo cria um objeto de cota e o corresponde a pods em prioridades específicas. O exemplo
funciona da seguinte forma:

- Os pods no cluster têm uma das três classes de prioridade, "baixa", "média", "alta".
- Um objeto de cota é criado para cada prioridade.

Salve o seguinte YAML em um arquivo `quota.yml`.

```yaml
apiVersion: v1
kind: List
items:
- apiVersion: v1
  kind: ResourceQuota
  metadata:
    name: pods-high
  spec:
    hard:
      cpu: "1000"
      memory: 200Gi
      pods: "10"
    scopeSelector:
      matchExpressions:
      - operator : In
        scopeName: PriorityClass
        values: ["high"]
- apiVersion: v1
  kind: ResourceQuota
  metadata:
    name: pods-medium
  spec:
    hard:
      cpu: "10"
      memory: 20Gi
      pods: "10"
    scopeSelector:
      matchExpressions:
      - operator : In
        scopeName: PriorityClass
        values: ["medium"]
- apiVersion: v1
  kind: ResourceQuota
  metadata:
    name: pods-low
  spec:
    hard:
      cpu: "5"
      memory: 10Gi
      pods: "10"
    scopeSelector:
      matchExpressions:
      - operator : In
        scopeName: PriorityClass
        values: ["low"]
```

Aplique o YAML usando `kubectl create`.

```shell
kubectl create -f ./quota.yml
```

```
resourcequota/pods-high created
resourcequota/pods-medium created
resourcequota/pods-low created
```

Verifique se a cota `Used` é `0` usando `kubectl describe quota`.

```shell
kubectl describe quota
```

```
Name:       pods-high
Namespace:  default
Resource    Used  Hard
--------    ----  ----
cpu         0     1k
memory      0     200Gi
pods        0     10


Name:       pods-low
Namespace:  default
Resource    Used  Hard
--------    ----  ----
cpu         0     5
memory      0     10Gi
pods        0     10


Name:       pods-medium
Namespace:  default
Resource    Used  Hard
--------    ----  ----
cpu         0     10
memory      0     20Gi
pods        0     10
```

Crie um pod com prioridade "high". Salve o seguinte YAML em um arquivo `high-priority-pod.yml`.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: high-priority
spec:
  containers:
  - name: high-priority
    image: ubuntu
    command: ["/bin/sh"]
    args: ["-c", "while true; do echo hello; sleep 10;done"]
    resources:
      requests:
        memory: "10Gi"
        cpu: "500m"
      limits:
        memory: "10Gi"
        cpu: "500m"
  priorityClassName: high
```

Applique com `kubectl create`.

```shell
kubectl create -f ./high-priority-pod.yml
```

Verifique se as estatísticas "Used" para a cota de prioridade "high", `pods-high` foram alteradas e se
as outras duas cotas permanecem inalteradas.

```shell
kubectl describe quota
```

```
Name:       pods-high
Namespace:  default
Resource    Used  Hard
--------    ----  ----
cpu         500m  1k
memory      10Gi  200Gi
pods        1     10


Name:       pods-low
Namespace:  default
Resource    Used  Hard
--------    ----  ----
cpu         0     5
memory      0     10Gi
pods        0     10


Name:       pods-medium
Namespace:  default
Resource    Used  Hard
--------    ----  ----
cpu         0     10
memory      0     20Gi
pods        0     10
```

### Cota de afinidade de pod entre _namespaces_

{{< feature-state for_k8s_version="v1.22" state="beta" >}}

Os operadores podem usar o escopo de cota `CrossNamespacePodAffinity` para limitar quais _namespaces_ têm permissão para ter pods com termos de afinidade que cruzam _namespaces_. Especificamente, ele controla quais pods são permitidos para definir os campos `namespaces` ou `namespaceSelector` em termos de afinidade de pod.

Impedir que os usuários usem termos de afinidade entre _namespaces_ pode ser desejável, pois um pod
com restrições antiafinidade pode bloquear pods de todos os outros _namespaces_ de ser agendado em um domínio de falha.

O uso desses operadores de escopo pode impedir certos _namespaces_ (`foo-ns` no exemplo abaixo) de ter pods que usam afinidade de pod entre _namespaces_ criando um objeto de cota de recurso nesse _namespace_ com escopo `CrossNamespaceAffinity` e limite rígido de 0:

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: disable-cross-namespace-affinity
  namespace: foo-ns
spec:
  hard:
    pods: "0"
  scopeSelector:
    matchExpressions:
    - scopeName: CrossNamespaceAffinity
```

Se os operadores quiserem proibir o uso de `namespaces` e `namespaceSelector` por padrão, e
permitir apenas para _namespaces_ específicos, eles podem configurar `CrossNamespaceAffinity`como um recurso limitado definindo o sinalizador kube-apiserver --admission-control-config-file
para o caminho do seguinte arquivo de configuração:

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
- name: "ResourceQuota"
  configuration:
    apiVersion: apiserver.config.k8s.io/v1
    kind: ResourceQuotaConfiguration
    limitedResources:
    - resource: pods
      matchScopes:
      - scopeName: CrossNamespaceAffinity
```

Com a configuração acima, os pods podem usar `namespaces` e `namespaceSelector` apenas na afinidade do pod se o _namespace_ em que foram criados tiver um objeto de cota de recurso com escopo `CrossNamespaceAffinity` e um limite rígido maior ou igual ao número de pods usando esses campos.

Esse recurso é beta e ativado por padrão. Você pode desativá-lo usando o [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) `PodAffinityNamespaceSelector` no kube-apiserver e no kube-scheduler.

## Solicitações comparadas aos limites {#requests-vs-limits}

Ao alocar recursos computacionais, cada contêiner pode especificar uma solicitação e um valor limite para CPU ou memória. A cota pode ser configurada para cotar qualquer valor.

Se a cota tiver um valor especificado para `requests.cpu` ou `requests.memory`, ela exigirá que cada container faça uma solicitação explícita para esses recursos. Se a cota tiver um valor especificado para `limits.cpu` ou `limits.memory`, em seguida exige que cada contêiner de entrada especifique um limite explícito para esses recursos.

## Como visualizar e definir cotas

O Kubectl é compatível com a criação, atualização e visualização de cotas:

```shell
kubectl create namespace myspace
```

```shell
cat <<EOF > compute-resources.yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: compute-resources
spec:
  hard:
    requests.cpu: "1"
    requests.memory: 1Gi
    limits.cpu: "2"
    limits.memory: 2Gi
    requests.nvidia.com/gpu: 4
EOF
```

```shell
kubectl create -f ./compute-resources.yaml --namespace=myspace
```

```shell
cat <<EOF > object-counts.yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: object-counts
spec:
  hard:
    configmaps: "10"
    persistentvolumeclaims: "4"
    pods: "4"
    replicationcontrollers: "20"
    secrets: "10"
    services: "10"
    services.loadbalancers: "2"
EOF
```

```shell
kubectl create -f ./object-counts.yaml --namespace=myspace
```

```shell
kubectl get quota --namespace=myspace
```

```none
NAME                    AGE
compute-resources       30s
object-counts           32s
```

```shell
kubectl describe quota compute-resources --namespace=myspace
```

```none
Name:                    compute-resources
Namespace:               myspace
Resource                 Used  Hard
--------                 ----  ----
limits.cpu               0     2
limits.memory            0     2Gi
requests.cpu             0     1
requests.memory          0     1Gi
requests.nvidia.com/gpu  0     4
```

```shell
kubectl describe quota object-counts --namespace=myspace
```

```none
Name:                   object-counts
Namespace:              myspace
Resource                Used    Hard
--------                ----    ----
configmaps              0       10
persistentvolumeclaims  0       4
pods                    0       4
replicationcontrollers  0       20
secrets                 1       10
services                0       10
services.loadbalancers  0       2
```

Kubectl also supports object count quota for all standard namespaced resources
using the syntax `count/<resource>.<group>`:

```shell
kubectl create namespace myspace
```

```shell
kubectl create quota test --hard=count/deployments.apps=2,count/replicasets.apps=4,count/pods=3,count/secrets=4 --namespace=myspace
```

```shell
kubectl create deployment nginx --image=nginx --namespace=myspace --replicas=2
```

```shell
kubectl describe quota --namespace=myspace
```

```
Name:                         test
Namespace:                    myspace
Resource                      Used  Hard
--------                      ----  ----
count/deployments.apps        1     2
count/pods                    2     3
count/replicasets.apps        1     4
count/secrets                 1     4
```

## Capacidade e cota de Cluster

`ResourceQuotas` são independentes da capacidade do cluster. Eles estão expresso em unidades absolutas. Portanto, se você adicionar nós ao cluster, isso *não*
dá automaticamente a cada _namespace_ a capacidade de consumir mais recursos.

Às vezes, políticas mais complexas podem ser necessárias, como:

- Divida proporcionalmente os recursos totais do cluster entre várias equipes.
- Permita que cada locatário aumente o uso de recursos conforme necessário, mas tenha um generoso limite para evitar o esgotamento acidental de recursos.
- Detecte a demanda de um _namespace_, adicione nós e aumente a cota.

Tais políticas podem ser implementadas usando `ResourceQuotas` como blocos de construção, por
escrevendo um "controlador" que observa o uso da cota e ajusta os limites rígidos da cota de cada _namespace_ de acordo com outros sinais.

Observe que a cota de recursos divide os recursos agregados do cluster, mas não cria restrições em torno dos nós: pods de vários _namespaces_ podem ser executados no mesmo nó.

## Limite de consumo de classe de prioridade por padrão

Pode ser desejado que os pods com uma prioridade particular, por exemplo. "cluster-services",
deve ser permitido em um _namespace_, se, e somente se, existir um objeto de cota correspondente.

Com este mecanismo, os operadores podem restringir o uso de certas classes de prioridade para um número limitado de _namespaces_ , e nem todos poderão consumir essas classes de prioridade por padrão.

Para impor isso, a flag `kube-apiserver` `--admission-control-config-file` deve ser
usada para passar o caminho para o seguinte arquivo de configuração:

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
- name: "ResourceQuota"
  configuration:
    apiVersion: apiserver.config.k8s.io/v1
    kind: ResourceQuotaConfiguration
    limitedResources:
    - resource: pods
      matchScopes:
      - scopeName: PriorityClass
        operator: In
        values: ["cluster-services"]
```

Em seguida, crie um objeto de cota de recurso no _namespace_ `kube-system`:

{{% codenew file="policy/priority-class-resourcequota.yaml" %}}

```shell
kubectl apply -f https://k8s.io/examples/policy/priority-class-resourcequota.yaml -n kube-system
```

```none
resourcequota/pods-cluster-services created
```

Nesse caso, a criação de um pod será permitida se:

1. O `priorityClassName` do pod não foi especificado.
1. O `priorityClassName` do pod é especificado com um valor diferente de `cluster-services`.
1. O `priorityClassName` do pod está definido como `cluster-services`, ele deve ser criado no namespace `kube-system` e passou na verificação de cota de recursos.

Uma solicitação de criação de pod é rejeitada caso seu `priorityClassName` estiver definido como `cluster-services` e deve ser criado em um _namespace_ diferente de `kube-system`.

## {{% heading "whatsnext" %}}

- Veja o [documento de design de cota de recursos](https://git.k8s.io/community/contributors/design-proposals/resource-management/admission_control_resource_quota.md) para mais informações.
- Veja um [exemplo detalhado de como usar a cota de recursos](/docs/tasks/administer-cluster/quota-api-object/).
- Leia o [documento de design de suporte de cota para prioridade de classe](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/scheduling/pod-priority-resourcequota.md).
- Veja [recursos limitados](https://github.com/kubernetes/kubernetes/pull/36765)
