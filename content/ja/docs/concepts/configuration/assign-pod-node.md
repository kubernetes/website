---
reviewers:
- davidopp
- kevin-wangzefeng
- bsalamat
title: Node上へのPodのスケジューリング
content_template: templates/concept
weight: 30
---


{{% capture overview %}}

[Pod](/docs/concepts/workloads/pods/pod/)が稼働する[Node](/docs/concepts/architecture/nodes/)を特定のものに指定したり、優先条件を指定して制限することができます。
これを実現するためにはいくつかの方法がありますが、推奨されている方法は[label selectors](/docs/concepts/overview/working-with-objects/labels/)です。
スケジューラーが最適な配置を選択するため、一般的にはこのような制限は不要です(例えば、Podを配置する際にリソースが不十分なNodeにはデプロイされないことが挙げられます)が、
SSDが搭載されているNodeにPodをデプロイしたり、同じアベイラビリティーゾーン内で通信する異なるサービスのPodを同じNodeにデプロイする等、柔軟な設定が必要なこともあります。

これらの例は[こちら](https://github.com/kubernetes/website/tree/{{< param "docsbranch" >}}/content/en/docs/concepts/configuration/)で確認することができます。

{{% /capture %}}

{{% capture body %}}

## nodeSelector

`nodeSelector`は、Nodeを選択するための最も簡単で推奨されている方法です。
`nodeSelector`はPodSpecのフィールドです。これはkey-valueペアのマップを特定します。
あるノードでPodを稼働させるためには、そのノードがラベルとして指定されたkey-valueペアを保持している必要があります(複数のラベルを保持することも可能です)。
最も一般的な使用方法は、1つのkey-valueペアを付与する方法です。

以下に、`nodeSelector`の使用例を紹介します。

### ステップ0: 前提条件

この例は、KubernetesのPodに関して基本的な知識を有していることと、[Kubernetesクラスターを操作](https://github.com/kubernetes/kubernetes#documentation)したことがあることを前提としています。

### スッテプ1: Nodeへのラベルの付与

`kubectl get nodes`コマンドで、クラスタのノードの名前を取得してください。
そして、ラベルを付与するNodeを選び、`kubectl label nodes <node-name> <label-key>=<label-value>`コマンドで選択したNodeにラベルを付与します。
例えば、Nodeの名前が'kubernetes-foo-node-1.c.a-robinson.internal'、付与するラベルが'disktype=ssd'の場合、`kubectl label nodes kubernetes-foo-node-1.c.a-robinson.internal disktype=ssd`コマンドによってラベルが付与されます。

<!-- 該当箇所なし -->
"invalid command"エラーによって失敗した場合には、`label`コマンドに対応していない古いバージョンのkubectlを使用している可能性があります。
その場合は、ガイドの[previous version](https://github.com/kubernetes/kubernetes/blob/a053dbc313572ed60d89dae9821ecab8bfd676dc/examples/node-selection/README.md)から、手動でNodeにラベルを付与する手順を参照してください。

`kubectl get nodes --show-labels`コマンドによって、ノードにラベルが付与されたかを確認することができます。
また、`kubectl describe node "nodename"`コマンドから、そのNodeの全てのラベルを表示することもできます。

### ステップ2: PodへのnodeSelectorフィールドの付与

該当のPodのconfigファイルに、nodeSelectorのセクションを追加します。
例として以下のconfigファイルを扱います。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  labels:
    env: test
spec:
  containers:
  - name: nginx
    image: nginx
```

nodeSelectorを以下のように追加します:

{{< codenew file="pods/pod-nginx.yaml" >}}

`kubectl apply -f https://k8s.io/examples/pods/pod-nginx.yaml`コマンドにより、Podは先ほどラベルを付与したNodeへスケジュールされます。
`kubectl get pods -o wide`コマンドで表示される"NODE"の列からPodがデプロイされているNodeを確認することができます。

## 補足: ビルトインNodeラベル
<!-- Interlude -->

明示的に[付与](#step-one-attach-label-to-the-node)するラベルの他に、事前にNodeへ付与されているものもあります。
Kubernetes v1.4 の時点では、以下のようなラベルが該当します。

* `kubernetes.io/hostname`
* `failure-domain.beta.kubernetes.io/zone`
* `failure-domain.beta.kubernetes.io/region`
* `beta.kubernetes.io/instance-type`
* `kubernetes.io/os`
* `kubernetes.io/arch`

{{< note >}}
これらのラベルは、クラウドプロバイダ固有であり、確実なものではありません。
例えば、`kubernetes.io/hostname`の値はNodeの名前と同じである環境もあれば、異なる環境もあります。
{{< /note >}}

## Nodeの隔離や制限
<!-- 難しい -->
Nodeにラベルを付与することで、Podが特定のNodeやNodeグループにスケジュールされます。
これにより、特定のPodを、確かな隔離性や安全性、特性を持ったNodeで稼働させることができます。
この目的でラベルを使用する際に、Node上のkubeletのプロセスに上書きされないラベルキーを選択することが強く推奨されています。
これは、安全性が損なわれたNodeがkubeletの認証情報をNodeのオブジェクトに設定したり、スケジューラーがそのようなNodeにデプロイするのを防ぎます。

`NodeRestriction`プラグインは接頭辞`node-restriction.kubernetes.io/`を付与することで、kubeletがラベルを設定したり書き換えることを防ぎます。
Nodeの隔離にラベルの接頭辞を使用するためには、以下の2点を確認してください。

1. [Node authorizer](/docs/reference/access-authn-authz/node/)を使用していることと、[NodeRestriction admission plugin](/docs/reference/access-authn-authz/admission-controllers/#noderestriction)が有効になっていること。
2. Nodeに`node-restriction.kubernetes.io/` のラベルを付与し、そのラベルがnode selectorに指定されていること。
例えば、`example.com.node-restriction.kubernetes.io/fips=true` または `example.com.node-restriction.kubernetes.io/pci-dss=true`のようなラベルです。

## Affinity と Anti-Affinity

`nodeSelector`はPodの稼働を特定のラベルが付与されたNodeに制限する最も簡単な方法です。
Affinity/Anti-Affinityでは、より詳細な指定方法が提供されています。
拡張機能は以下の通りです。

1. 様々な指定方法がある ("AND"条件に限らない)
2. 必須条件ではなく優先条件を指定でき、条件を満たさない場合でもPodをスケジュールさせることができる
3. Node自体のラベルではなく、Node(または他のトポロジカルドメイン)上で稼働しているPodのラベルに対して条件を指定することができ、そのPodと同じ、または異なるドメインで稼働させることができる

Affinityは"Node affinity"と"Inter-Pod Affinity/Anti-Affinity"の2種類から成ります。
Node affinityは`nodeSelector`(上述の2つのメリットがあります)によって利用可能ですが、Inter-Pod Affinity/Anti-Affinityは、上記の3番目の機能に記載している通り、NodeのラベルではなくPodのラベルに対して制限をかけます。

`nodeSelector`は問題なく使用することができますが、Node affinityは`nodeSelector`で指定できる条件を全て実現できるため、将来的には推奨されなくなります。

### Node Affinity (β機能)

Node Affinityはα機能としてKubernetesのv1.2から導入されました。
Node Affinityは概念的にはNodeのラベルによってPodがどのNodeにスケジュールされるかを制限する`nodeSelector`と同様です。

現在は2種類のNode Affinityがあり、`requiredDuringSchedulingIgnoredDuringExecution`と`preferredDuringSchedulingIgnoredDuringExecution`です。
前者はNodeにスケジュールされるPodが条件を満たすことが必須(`nodeSelector`に似ていますが、より柔軟に条件を指定できます)であり、後者は優先的に考慮されます。
"IgnoredDuringExecution"の意味するところは、`nodeSelector`の機能と同様であり、Nodeのラベルが変更され、Podがその条件を満たさなくなった場合でも
PodはそのNodeで稼働し続けるということです。
将来的には、`requiredDuringSchedulingIgnoredDuringExecution`に、PodのNode Affinityに記された必須要件を満たさなくなったNodeからそのPodを退避させることができる機能を供えた`requiredDuringSchedulingRequiredDuringExecution`が提供される予定です。

それぞれの使用例として、
`requiredDuringSchedulingIgnoredDuringExecution` は、"インテルCPUを供えたNode上でPodを稼働させる"、
`preferredDuringSchedulingIgnoredDuringExecution`は、"Podを優先的にアベイラビリティゾーンXYZで稼働させるが、実現不可能な場合には他のNodeで稼働させる"
といった方法が挙げられます。

Node Affinityは、PodSpecの`affinity`フィールドにある`nodeAffinity`フィールドで特定します。

Node Affinityを使用したPodの例を以下に示します:

{{< codenew file="pods/pod-with-node-affinity.yaml" >}}

このNode Affinityでは、Podはキーが`kubernetes.io/e2e-az-name`、バリューが`e2e-az1`または`e2e-az2`のラベルが付与されたNodeにしか配置されません。
加えて、キーが`another-node-label-key`、バリューが`another-node-label-value`のラベルが付与されたNodeが優先されます。

この例ではオペレータ`In`が使われています。
Node Affinityでは、`In`、`NotIn`、`Exists`、`DoesNotExist`、`Gt`、`Lt`のオペレータが使用できます。
`NotIn`と`DoesNotExist`はNode Anti-Affinity、またはPodを特定のNodeにスケジュールさせない場合に使われる[Taints](/docs/concepts/configuration/taint-and-toleration/)に使用します。

`nodeSelector`と`nodeAffinity`の両方を指定した場合、Podは**両方の**条件を満たすNodeにスケジュールされます。

`nodeAffinity`内で複数の`nodeSelectorTerms`を指定した場合、Podは**どちらかの**`nodeSelectorTerms`を満たしたNodeへスケジュールされます。

`nodeSelectorTerms`内で複数の`matchExpressions`を指定した場合にはPodは**全ての**`matchExpressions`を満たしたNodeへスケジュールされます。

PodがスケジュールされたNodeのラベルを削除しても、Podは削除されません。
言い換えると、AffinityはPodをスケジュールする際にのみ考慮されます。

`preferredDuringSchedulingIgnoredDuringExecution`内の`weight`フィールドは、1から100の範囲で指定します。
全ての必須条件(リソースやRequiredDuringScheduling Affinity等)を満たしたNodeに対して、スケジューラーは、そのNodeがMatchExpressionsを満たした場合に、このフィルードの"weight"を加算して合計を計算します。
このスコアがNodeの他の優先機能のスコアと組み合わせれ、最も高いスコアを有したNodeが優先されます。

Node Affinityに関する詳細な情報は
[デザインドック](https://git.k8s.io/community/contributors/design-proposals/scheduling/nodeaffinity.md)
を参照してください。

### Inter-Pod AffinityとAnti-Affinity (β版)

Inter-Pod AffinityとAnti-Affinityは、Kubernetes 1.4から導入されました。
これらは、Nodeのラベルではなく、すでにNodeで稼働しているPodのラベルに従ってPodがスケジュールされるNodeを制限します。
このポリシーは、"XにてルールYを満たすPodがすでに稼働している場合、このPodもXで稼働させる(Anti-Affinityの場合は、稼働させない)"という形式です。
Yはnamespaceのリストで指定したLabelSelectorで表されます。
Nodeと異なり、Podはnamespaceで区切られているため(それゆえPodのラベルも暗黙的にnamespaceで区切られます)、Podのラベルを指定する label selectorはどのnamespaceにselectorを適用するかを指定する必要があります。
概念的に、XはNodeや、ラック、クラウドプロバイダゾーン、クラウドプロバイダのリージョン等を表すトポロジードメインです。
これらを表すためにシステムが使用するNode Labelのキーである`topologyKey`を使うことで、トポロジードメインを指定することができます。
先述のセクション[補足: ビルトインNodeラベル](#interlude-built-in-node-labels)にてLabelのキーの例が紹介されています。


{{< note >}}
Inter-Pod AffinityとAnti-Affinityは、大規模なクラスタ上にてスケジューリングを遅くする恐れのある多くのプロセスを要します。
そのため、数百台以上のNodeから成るクラスタでは使用することを推奨しません。
{{< /note >}}

{{< note >}}
Pod Anti-Affinityは、Nodeに必ずラベルが付与されている必要があります。
例えば、クラスタの全てのNodeが、`topologyKey`で指定されたものに合致する適切なラベルが必要になります。
それらが付与されていないNodeが存在する場合、意図しない挙動を示すことがあります。
{{< /note >}}

Node Affinityと同様に、Pod AffinityとPod Anti-Affinityにも必須条件と優先条件を示す`requiredDuringSchedulingIgnoredDuringExecution`と`preferredDuringSchedulingIgnoredDuringExecution`があります。
上述のNode Affinityのセクションを参照してください。
`requiredDuringSchedulingIgnoredDuringExecution`を指定するAffinityの使用例は、"Service AのPodとService BのPodが密に通信する際、それらを同じゾーンで稼働させる場合"です。
また、`preferredDuringSchedulingIgnoredDuringExecution`を指定するAnti-Affinityの使用例は、"ゾーンをまたいでPodのサービスを稼働させる場合"(Podの数はゾーンの数よりも多いため、必須条件を指定すると合理的ではありません)です。

Inter-Pod Affinityは、PodSpecの`affinity`フィールド内に`podAffinity`で指定し、Inter-Pod Anti-Affinityは、`podAntiAffinity`で指定します。

#### Pod Affinityを使用したPodの例

{{< codenew file="pods/pod-with-pod-affinity.yaml" >}}

このPodのAffifnityは、Pod AffinityとPod Anti-Affinityを1つずつ定義しています。
この例では、`podAffinity`に`requiredDuringSchedulingIgnoredDuringExecution`、`podAntiAffinity`に`preferredDuringSchedulingIgnoredDuringExecution`が設定されています。
Pod Affinityは、「キーが"security"、バリューが"S1"のラベルが付与されたPodが少なくとも1つは稼働しているノードが同じゾーンにあれば、PodはそのNodeにスケジュールされる」という条件を指定しています(より正確には、Node Nが`failure-domain.beta.kubernetes.io/zone`というキーを保持しており、キーが"security"、バリューが"S1"のラベルが付与されたPodを稼働させているバリューVが付与されたNodeがある場合、)。
PodはNode Nで動く資格がある
Node　Nがキーfailure-domain.beta.kubernetes.io/zone`、バリューVのラベルを持つ場合に
キーが`failure-domain.beta.kubernetes.io/zone`、バリューが、キーが"security"、バリューが"S1"のラベルが付与されたPodを稼働さしているノードのラベル(ここではV)


The affinity on this pod defines one pod affinity rule and one pod anti-affinity rule. In this example, the
`podAffinity` is `requiredDuringSchedulingIgnoredDuringExecution`
while the `podAntiAffinity` is `preferredDuringSchedulingIgnoredDuringExecution`. The
pod affinity rule says that the pod can be scheduled onto a node only if that node is in the same zone
as at least one already-running pod that has a label with key "security" and value "S1". (More precisely, the pod is eligible to run
on node N if node N has a label with key `failure-domain.beta.kubernetes.io/zone` and some value V
such that there is at least one node in the cluster with key `failure-domain.beta.kubernetes.io/zone` and
value V that is running a pod that has a label with key "security" and value "S1".) The pod anti-affinity
rule says that the pod prefers not to be scheduled onto a node if that node is already running a pod with label
having key "security" and value "S2". (If the `topologyKey` were `failure-domain.beta.kubernetes.io/zone` then
it would mean that the pod cannot be scheduled onto a node if that node is in the same zone as a pod with
label having key "security" and value "S2".) See the
[design doc](https://git.k8s.io/community/contributors/design-proposals/scheduling/podaffinity.md)
for many more examples of pod affinity and anti-affinity, both the `requiredDuringSchedulingIgnoredDuringExecution`
flavor and the `preferredDuringSchedulingIgnoredDuringExecution` flavor.

The legal operators for pod affinity and anti-affinity are `In`, `NotIn`, `Exists`, `DoesNotExist`.

In principle, the `topologyKey` can be any legal label-key. However,
for performance and security reasons, there are some constraints on topologyKey:

1. For affinity and for `requiredDuringSchedulingIgnoredDuringExecution` pod anti-affinity,
empty `topologyKey` is not allowed.
2. For `requiredDuringSchedulingIgnoredDuringExecution` pod anti-affinity, the admission controller `LimitPodHardAntiAffinityTopology` was introduced to limit `topologyKey` to `kubernetes.io/hostname`. If you want to make it available for custom topologies, you may modify the admission controller, or simply disable it.
3. For `preferredDuringSchedulingIgnoredDuringExecution` pod anti-affinity, empty `topologyKey` is interpreted as "all topologies" ("all topologies" here is now limited to the combination of `kubernetes.io/hostname`, `failure-domain.beta.kubernetes.io/zone` and `failure-domain.beta.kubernetes.io/region`).
4. Except for the above cases, the `topologyKey` can be any legal label-key.

In addition to `labelSelector` and `topologyKey`, you can optionally specify a list `namespaces`
of namespaces which the `labelSelector` should match against (this goes at the same level of the definition as `labelSelector` and `topologyKey`).
If omitted or empty, it defaults to the namespace of the pod where the affinity/anti-affinity definition appears.

All `matchExpressions` associated with `requiredDuringSchedulingIgnoredDuringExecution` affinity and anti-affinity
must be satisfied for the pod to be scheduled onto a node.

#### More Practical Use-cases

Interpod Affinity and AntiAffinity can be even more useful when they are used with higher
level collections such as ReplicaSets, StatefulSets, Deployments, etc.  One can easily configure that a set of workloads should
be co-located in the same defined topology, eg., the same node.

##### Always co-located in the same node

In a three node cluster, a web application has in-memory cache such as redis. We want the web-servers to be co-located with the cache as much as possible.

Here is the yaml snippet of a simple redis deployment with three replicas and selector label `app=store`. The deployment has `PodAntiAffinity` configured to ensure the scheduler does not co-locate replicas on a single node.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis-cache
spec:
  selector:
    matchLabels:
      app: store
  replicas: 3
  template:
    metadata:
      labels:
        app: store
    spec:
      affinity:
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - labelSelector:
              matchExpressions:
              - key: app
                operator: In
                values:
                - store
            topologyKey: "kubernetes.io/hostname"
      containers:
      - name: redis-server
        image: redis:3.2-alpine
```

The below yaml snippet of the webserver deployment has `podAntiAffinity` and `podAffinity` configured. This informs the scheduler that all its replicas are to be co-located with pods that have selector label `app=store`. This will also ensure that each web-server replica does not co-locate on a single node.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-server
spec:
  selector:
    matchLabels:
      app: web-store
  replicas: 3
  template:
    metadata:
      labels:
        app: web-store
    spec:
      affinity:
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - labelSelector:
              matchExpressions:
              - key: app
                operator: In
                values:
                - web-store
            topologyKey: "kubernetes.io/hostname"
        podAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - labelSelector:
              matchExpressions:
              - key: app
                operator: In
                values:
                - store
            topologyKey: "kubernetes.io/hostname"
      containers:
      - name: web-app
        image: nginx:1.12-alpine
```

If we create the above two deployments, our three node cluster should look like below.

|       node-1         |       node-2        |       node-3       |
|:--------------------:|:-------------------:|:------------------:|
| *webserver-1*        |   *webserver-2*     |    *webserver-3*   |
|  *cache-1*           |     *cache-2*       |     *cache-3*      |

As you can see, all the 3 replicas of the `web-server` are automatically co-located with the cache as expected.

```
kubectl get pods -o wide
```
The output is similar to this:
```
NAME                           READY     STATUS    RESTARTS   AGE       IP           NODE
redis-cache-1450370735-6dzlj   1/1       Running   0          8m        10.192.4.2   kube-node-3
redis-cache-1450370735-j2j96   1/1       Running   0          8m        10.192.2.2   kube-node-1
redis-cache-1450370735-z73mh   1/1       Running   0          8m        10.192.3.1   kube-node-2
web-server-1287567482-5d4dz    1/1       Running   0          7m        10.192.2.3   kube-node-1
web-server-1287567482-6f7v5    1/1       Running   0          7m        10.192.4.3   kube-node-3
web-server-1287567482-s330j    1/1       Running   0          7m        10.192.3.2   kube-node-2
```

##### Never co-located in the same node

The above example uses `PodAntiAffinity` rule with `topologyKey: "kubernetes.io/hostname"` to deploy the redis cluster so that
no two instances are located on the same host.
See [ZooKeeper tutorial](/docs/tutorials/stateful-application/zookeeper/#tolerating-node-failure)
for an example of a StatefulSet configured with anti-affinity for high availability, using the same technique.

For more information on inter-pod affinity/anti-affinity, see the
[design doc](https://git.k8s.io/community/contributors/design-proposals/scheduling/podaffinity.md).

You may want to check [Taints](/docs/concepts/configuration/taint-and-toleration/)
as well, which allow a *node* to *repel* a set of pods.

## nodeName

`nodeName` is the simplest form of node selection constraint, but due
to its limitations it is typically not used.  `nodeName` is a field of
PodSpec.  If it is non-empty, the scheduler ignores the pod and the
kubelet running on the named node tries to run the pod.  Thus, if
`nodeName` is provided in the PodSpec, it takes precedence over the
above methods for node selection.

Some of the limitations of using `nodeName` to select nodes are:

-   If the named node does not exist, the pod will not be run, and in
    some cases may be automatically deleted.
-   If the named node does not have the resources to accommodate the
    pod, the pod will fail and its reason will indicate why,
    e.g. OutOfmemory or OutOfcpu.
-   Node names in cloud environments are not always predictable or
    stable.

Here is an example of a pod config file using the `nodeName` field:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
  - name: nginx
    image: nginx
  nodeName: kube-01
```

The above pod will run on the node kube-01.

{{% /capture %}}

{{% capture whatsnext %}}

{{% /capture %}}
