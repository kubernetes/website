---
title: Leases
api_metadata:
- apiVersion: "coordination.k8s.io/v1"
  kind: "Lease"
content_type: concept
weight: 30
---

<!-- overview -->

Sistemas distribuídos frequentemente precisam de _leases_, que fornecem um mecanismo para bloquear recursos
compartilhados e coordenar as atividades entre os membros de um conjunto.
No Kubernetes, o conceito de lease é representado por objetos [Lease](/docs/reference/kubernetes-api/cluster-resources/lease-v1/)
no {{< glossary_tooltip text="grupo de API" term_id="api-group" >}} `coordination.k8s.io`,
que são usados para funcionalidades críticas do sistema, como os heartbeats dos nós e a eleição de líder entre componentes.

<!-- body -->

## Heartbeats dos nós {#node-heart-beats}

O Kubernetes usa a API de Lease para comunicar os heartbeats de nó do kubelet ao servidor de API do Kubernetes.
Para cada `Node`, existe um objeto `Lease` com o mesmo nome no namespace `kube-node-lease`.
Internamente, cada heartbeat do kubelet é uma requisição de **update** para esse objeto `Lease`, que atualiza
o campo `spec.renewTime` da Lease. A camada de gerenciamento do Kubernetes usa o registro de data e hora desse campo
para determinar a disponibilidade desse `Node`.

Veja [objetos Lease de nó](/docs/concepts/architecture/nodes/#heartbeats) para mais detalhes.

## Eleição de líder

O Kubernetes também usa Leases para garantir que apenas uma instância de um componente esteja em execução em um dado momento.
Isso é usado por componentes da camada de gerenciamento, como o `kube-controller-manager` e o `kube-scheduler`, em
configurações de alta disponibilidade, nas quais apenas uma instância do componente deve estar ativamente em execução enquanto as
demais instâncias ficam em espera.

Leia [eleição de líder coordenada](/docs/concepts/cluster-administration/coordinated-leader-election)
para entender como o Kubernetes se apoia na API de Lease para selecionar qual instância do componente
atua como líder.

### Liberação do lock do kube-controller-manager ao encerrar

{{< feature-state feature_gate_name="ControllerManagerReleaseLeaderElectionLockOnExit" >}}

Quando o feature gate `ControllerManagerReleaseLeaderElectionLockOnExit` está habilitado,
o `kube-controller-manager` libera ativamente o seu lock de eleição de líder durante
as transições de liderança, em vez de esperar o TTL do lock expirar. Isso permite
que um novo líder seja eleito mais rapidamente, reduzindo a latência da transição de liderança.

## Identidade do servidor de API

{{< feature-state feature_gate_name="APIServerIdentity" >}}

A partir do Kubernetes v1.26, cada `kube-apiserver` usa a API de Lease para publicar sua identidade para o
restante do sistema. Embora isso não seja particularmente útil por si só, fornece um mecanismo para que os clientes
descubram quantas instâncias do `kube-apiserver` estão operando a camada de gerenciamento do Kubernetes.
A existência de leases do kube-apiserver possibilita funcionalidades futuras que podem exigir coordenação entre
as instâncias do kube-apiserver.

Você pode inspecionar as Leases de cada kube-apiserver procurando por objetos lease no namespace `kube-system`
com o nome `apiserver-<sha256-hash>`. Alternativamente, você pode usar o seletor de label `apiserver.kubernetes.io/identity=kube-apiserver`:

```shell
kubectl -n kube-system get lease -l apiserver.kubernetes.io/identity=kube-apiserver
```
```
NAME                                        HOLDER                                                                           AGE
apiserver-07a5ea9b9b072c4a5f3d1c3702        apiserver-07a5ea9b9b072c4a5f3d1c3702_0c8914f7-0f35-440e-8676-7844977d3a05        5m33s
apiserver-7be9e061c59d368b3ddaf1376e        apiserver-7be9e061c59d368b3ddaf1376e_84f2a85d-37c1-4b14-b6b9-603e62e4896f        4m23s
apiserver-1dfef752bcb36637d2763d1868        apiserver-1dfef752bcb36637d2763d1868_c5ffa286-8a9a-45d4-91e7-61118ed58d2e        4m43s

```

O hash SHA256 usado no nome da lease é baseado no hostname do sistema operacional visto por aquele servidor de API. Cada kube-apiserver deve ser
configurado para usar um hostname único dentro do cluster. Novas instâncias do kube-apiserver que usam o mesmo hostname
assumem as Leases existentes usando uma nova identidade de detentor, em vez de criar novos objetos Lease. Você pode verificar o
hostname usado pelo kube-apiserver conferindo o valor do label `kubernetes.io/hostname`:

```shell
kubectl -n kube-system get lease apiserver-07a5ea9b9b072c4a5f3d1c3702 -o yaml
```
```yaml
apiVersion: coordination.k8s.io/v1
kind: Lease
metadata:
  creationTimestamp: "2023-07-02T13:16:48Z"
  labels:
    apiserver.kubernetes.io/identity: kube-apiserver
    kubernetes.io/hostname: master-1
  name: apiserver-07a5ea9b9b072c4a5f3d1c3702
  namespace: kube-system
  resourceVersion: "334899"
  uid: 90870ab5-1ba9-4523-b215-e4d4e662acb1
spec:
  holderIdentity: apiserver-07a5ea9b9b072c4a5f3d1c3702_0c8914f7-0f35-440e-8676-7844977d3a05
  leaseDurationSeconds: 3600
  renewTime: "2023-07-04T21:58:48.065888Z"
```

Leases expiradas de kube-apiservers que não existem mais são removidas pela coleta de lixo dos novos kube-apiservers após 1 hora.

Você pode desabilitar as leases de identidade do servidor de API desabilitando o
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) `APIServerIdentity`.

## Cargas de trabalho {#custom-workload}

A sua própria carga de trabalho pode definir o seu próprio uso de Leases. Por exemplo, você pode executar um
{{< glossary_tooltip term_id="controller" text="controlador" >}} personalizado em que um membro primário ou líder
executa operações que os seus pares não executam. Você define uma Lease para que as réplicas do controlador possam selecionar
ou eleger um líder, usando a API do Kubernetes para coordenação.
Se você usar uma Lease, é uma boa prática definir para ela um nome obviamente associado
ao produto ou componente. Por exemplo, se você tem um componente chamado Example Foo, use uma Lease chamada
`example-foo`.

Se um operador do cluster ou outro usuário final puder implantar múltiplas instâncias de um componente, escolha um
prefixo de nome e adote um mecanismo (como um hash do nome do Deployment) para evitar colisões de nomes
entre as Leases.

Você pode usar outra abordagem, desde que ela alcance o mesmo resultado: produtos de software diferentes
não entram em conflito uns com os outros.
