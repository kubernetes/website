---
title: Node上へのPodのスケジューリング
content_type: concept
weight: 30
---


<!-- overview -->

{{< glossary_tooltip text="Pod" term_id="pod" >}}が稼働する{{< glossary_tooltip text="Node" term_id="node" >}}を特定のものに指定したり、優先条件を指定して制限することができます。
これを実現するためにはいくつかの方法がありますが、推奨されている方法は[ラベルでの選択](/ja/docs/concepts/overview/working-with-objects/labels/)です。
スケジューラーが最適な配置を選択するため、一般的にはこのような制限は不要です(例えば、複数のPodを別々のNodeへデプロイしたり、Podを配置する際にリソースが不十分なNodeにはデプロイされないことが挙げられます)が、
SSDが搭載されているNodeにPodをデプロイしたり、同じアベイラビリティーゾーン内で通信する異なるサービスのPodを同じNodeにデプロイする等、柔軟な制御が必要なこともあります。



<!-- body -->

## nodeSelector

`nodeSelector`は、Nodeを選択するための、最も簡単で推奨されている手法です。
`nodeSelector`はPodSpecのフィールドです。これはkey-valueペアのマップを特定します。
あるノードでPodを稼働させるためには、そのノードがラベルとして指定されたkey-valueペアを保持している必要があります(複数のラベルを保持することも可能です)。
最も一般的な使用方法は、1つのkey-valueペアを付与する方法です。

以下に、`nodeSelector`の使用例を紹介します。

### ステップ0: 前提条件

この例では、KubernetesのPodに関して基本的な知識を有していることと、[Kubernetesクラスターのセットアップ](/ja/docs/setup/)がされていることが前提となっています。

### ステップ1: Nodeへのラベルの付与

`kubectl get nodes`で、クラスターのノードの名前を取得してください。
そして、ラベルを付与するNodeを選び、`kubectl label nodes <node-name> <label-key>=<label-value>`で選択したNodeにラベルを付与します。
例えば、Nodeの名前が'kubernetes-foo-node-1.c.a-robinson.internal'、付与するラベルが'disktype=ssd'の場合、`kubectl label nodes kubernetes-foo-node-1.c.a-robinson.internal disktype=ssd`によってラベルが付与されます。

`kubectl get nodes --show-labels`によって、ノードにラベルが付与されたかを確認することができます。
また、`kubectl describe node "nodename"`から、そのNodeの全てのラベルを表示することもできます。

### ステップ2: PodへのnodeSelectorフィールドの追加

該当のPodのconfigファイルに、nodeSelectorのセクションを追加します:
例として以下のconfigファイルを扱います:

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

`kubectl apply -f https://k8s.io/examples/pods/pod-nginx.yaml`により、Podは先ほどラベルを付与したNodeへスケジュールされます。
`kubectl get pods -o wide`で表示される"NODE"の列から、PodがデプロイされているNodeを確認することができます。

## 補足: ビルトインNodeラベル {#built-in-node-labels}

明示的に[付与](#step-one-attach-label-to-the-node)するラベルの他に、事前にNodeへ付与されているものもあります。
以下のようなラベルが該当します。

* [`kubernetes.io/hostname`](/docs/reference/kubernetes-api/labels-annotations-taints/#kubernetes-io-hostname)
* [`failure-domain.beta.kubernetes.io/zone`](/docs/reference/kubernetes-api/labels-annotations-taints/#failure-domainbetakubernetesiozone)
* [`failure-domain.beta.kubernetes.io/region`](/docs/reference/kubernetes-api/labels-annotations-taints/#failure-domainbetakubernetesioregion)
* [`topology.kubernetes.io/zone`](/docs/reference/kubernetes-api/labels-annotations-taints/#topologykubernetesiozone)
* [`topology.kubernetes.io/region`](/docs/reference/kubernetes-api/labels-annotations-taints/#topologykubernetesiozone)
* [`beta.kubernetes.io/instance-type`](/docs/reference/kubernetes-api/labels-annotations-taints/#beta-kubernetes-io-instance-type)
* [`node.kubernetes.io/instance-type`](/docs/reference/kubernetes-api/labels-annotations-taints/#nodekubernetesioinstance-type)
* [`kubernetes.io/os`](/docs/reference/kubernetes-api/labels-annotations-taints/#kubernetes-io-os)
* [`kubernetes.io/arch`](/docs/reference/kubernetes-api/labels-annotations-taints/#kubernetes-io-arch)

{{< note >}}
これらのラベルは、クラウドプロバイダー固有であり、確実なものではありません。
例えば、`kubernetes.io/hostname`の値はNodeの名前と同じである環境もあれば、異なる環境もあります。
{{< /note >}}


## Nodeの隔離や制限
Nodeにラベルを付与することで、Podは特定のNodeやNodeグループにスケジュールされます。
これにより、特定のPodを、確かな隔離性や安全性、特性を持ったNodeで稼働させることができます。
この目的でラベルを使用する際に、Node上のkubeletプロセスに上書きされないラベルキーを選択することが強く推奨されています。
これは、安全性が損なわれたNodeがkubeletの認証情報をNodeのオブジェクトに設定したり、スケジューラーがそのようなNodeにデプロイすることを防ぎます。

`NodeRestriction`プラグインは、kubeletが`node-restriction.kubernetes.io/`プレフィックスを有するラベルの設定や上書きを防ぎます。
Nodeの隔離にラベルのプレフィックスを使用するためには、以下のようにします。

1. [Node authorizer](/docs/reference/access-authn-authz/node/)を使用していることと、[NodeRestriction admission plugin](/docs/reference/access-authn-authz/admission-controllers/#noderestriction)が_有効_になっていること。
2. Nodeに`node-restriction.kubernetes.io/` プレフィックスのラベルを付与し、そのラベルがnode selectorに指定されていること。
例えば、`example.com.node-restriction.kubernetes.io/fips=true` または `example.com.node-restriction.kubernetes.io/pci-dss=true`のようなラベルです。

## アフィニティとアンチアフィニティ {#affinity-and-anti-affinity}

`nodeSelector`はPodの稼働を特定のラベルが付与されたNodeに制限する最も簡単な方法です。
アフィニティ/アンチアフィニティでは、より柔軟な指定方法が提供されています。
拡張機能は以下の通りです。

1. アフィニティ/アンチアフィニティという用語はとても表現豊かです。この用語は論理AND演算で作成された完全一致だけではなく、より多くのマッチングルールを提供します。
2. 必須条件ではなく優先条件を指定でき、条件を満たさない場合でもPodをスケジュールさせることができます。
3. Node自体のラベルではなく、Node(または他のトポロジカルドメイン)上で稼働している他のPodのラベルに対して条件を指定することができ、そのPodと同じ、または異なるドメインで稼働させることができます。

アフィニティは"Nodeアフィニティ"と"Pod間アフィニティ/アンチアフィニティ"の2種類から成ります。
Nodeアフィニティは`nodeSelector`(前述の2つのメリットがあります)に似ていますが、Pod間アフィニティ/アンチアフィニティは、上記の3番目の機能に記載している通り、NodeのラベルではなくPodのラベルに対して制限をかけます。

### Nodeアフィニティ

Nodeアフィニティは概念的には、NodeのラベルによってPodがどのNodeにスケジュールされるかを制限する`nodeSelector`と同様です。

現在は2種類のNodeアフィニティがあり、`requiredDuringSchedulingIgnoredDuringExecution`と`preferredDuringSchedulingIgnoredDuringExecution`です。
前者はNodeにスケジュールされるPodが条件を満たすことが必須(`nodeSelector`に似ていますが、より柔軟に条件を指定できます)であり、後者は条件を指定できますが保証されるわけではなく、優先的に考慮されます。
"IgnoredDuringExecution"の意味するところは、`nodeSelector`の機能と同様であり、Nodeのラベルが変更され、Podがその条件を満たさなくなった場合でも
PodはそのNodeで稼働し続けるということです。
将来的には、`requiredDuringSchedulingIgnoredDuringExecution`に、PodのNodeアフィニティに記された必須要件を満たさなくなったNodeからそのPodを退避させることができる機能を備えた`requiredDuringSchedulingRequiredDuringExecution`が提供される予定です。

それぞれの使用例として、
`requiredDuringSchedulingIgnoredDuringExecution` は、"インテルCPUを供えたNode上でPodを稼働させる"、
`preferredDuringSchedulingIgnoredDuringExecution`は、"ゾーンXYZでPodの稼働を試みますが、実現不可能な場合には他の場所で稼働させる"
といった方法が挙げられます。

Nodeアフィニティは、PodSpecの`affinity`フィールドにある`nodeAffinity`フィールドで特定します。

Nodeアフィニティを使用したPodの例を以下に示します:

{{< codenew file="pods/pod-with-node-affinity.yaml" >}}

このNodeアフィニティでは、Podはキーが`kubernetes.io/e2e-az-name`、値が`e2e-az1`または`e2e-az2`のラベルが付与されたNodeにしか配置されません。
加えて、キーが`another-node-label-key`、値が`another-node-label-value`のラベルが付与されたNodeが優先されます。

この例ではオペレーター`In`が使われています。
Nodeアフィニティでは、`In`、`NotIn`、`Exists`、`DoesNotExist`、`Gt`、`Lt`のオペレーターが使用できます。
`NotIn`と`DoesNotExist`はNodeアンチアフィニティ、またはPodを特定のNodeにスケジュールさせない場合に使われる[Taints](/docs/concepts/configuration/taint-and-toleration/)に使用します。

`nodeSelector`と`nodeAffinity`の両方を指定した場合、Podは**両方の**条件を満たすNodeにスケジュールされます。

`nodeAffinity`内で複数の`nodeSelectorTerms`を指定した場合、Podは**いずれかの**`nodeSelectorTerms`を満たしたNodeへスケジュールされます。

`nodeSelectorTerms`内で複数の`matchExpressions`を指定した場合にはPodは**全ての**`matchExpressions`を満たしたNodeへスケジュールされます。

PodがスケジュールされたNodeのラベルを削除したり変更しても、Podは削除されません。
言い換えると、アフィニティはPodをスケジュールする際にのみ考慮されます。

`preferredDuringSchedulingIgnoredDuringExecution`内の`weight`フィールドは、1から100の範囲で指定します。
全ての必要条件(リソースやRequiredDuringSchedulingアフィニティ等)を満たしたNodeに対して、スケジューラーはそのNodeがMatchExpressionsを満たした場合に、このフィルードの"weight"を加算して合計を計算します。
このスコアがNodeの他の優先機能のスコアと組み合わせれ、最も高いスコアを有したNodeが優先されます。

### Pod間アフィニティとアンチアフィニティ

Pod間アフィニティとアンチアフィニティは、Nodeのラベルではなく、すでにNodeで稼働しているPodのラベルに従ってPodがスケジュールされるNodeを制限します。
このポリシーは、"XにてルールYを満たすPodがすでに稼働している場合、このPodもXで稼働させる(アンチアフィニティの場合は稼働させない)"という形式です。
Yはnamespaceのリストで指定したLabelSelectorで表されます。
Nodeと異なり、Podはnamespaceで区切られているため(それゆえPodのラベルも暗黙的にnamespaceで区切られます)、Podのラベルを指定するlabel selectorは、どのnamespaceにselectorを適用するかを指定する必要があります。
概念的に、XはNodeや、ラック、クラウドプロバイダゾーン、クラウドプロバイダのリージョン等を表すトポロジードメインです。
これらを表すためにシステムが使用するNodeラベルのキーである`topologyKey`を使うことで、トポロジードメインを指定することができます。
先述のセクション[補足: ビルトインNodeラベル](#interlude-built-in-node-labels)にてラベルの例が紹介されています。


{{< note >}}
Pod間アフィニティとアンチアフィニティは、大規模なクラスター上で使用する際にスケジューリングを非常に遅くする恐れのある多くの処理を要します。
そのため、数百台以上のNodeから成るクラスターでは使用することを推奨されません。
{{< /note >}}

{{< note >}}
Podのアンチアフィニティは、Nodeに必ずラベルが付与されている必要があります。
言い換えると、クラスターの全てのNodeが、`topologyKey`で指定されたものに合致する適切なラベルが必要になります。
それらが付与されていないNodeが存在する場合、意図しない挙動を示すことがあります。
{{< /note >}}

Nodeアフィニティと同様に、PodアフィニティとPodアンチアフィニティにも必須条件と優先条件を示す`requiredDuringSchedulingIgnoredDuringExecution`と`preferredDuringSchedulingIgnoredDuringExecution`があります。
前述のNodeアフィニティのセクションを参照してください。
`requiredDuringSchedulingIgnoredDuringExecution`を指定するアフィニティの使用例は、"Service AのPodとService BのPodが密に通信する際、それらを同じゾーンで稼働させる場合"です。
また、`preferredDuringSchedulingIgnoredDuringExecution`を指定するアンチアフィニティの使用例は、"ゾーンをまたいでPodのサービスを稼働させる場合"(Podの数はゾーンの数よりも多いため、必須条件を指定すると合理的ではありません)です。

Pod間アフィニティは、PodSpecの`affinity`フィールド内に`podAffinity`で指定し、Pod間アンチアフィニティは、`podAntiAffinity`で指定します。

#### Podアフィニティを使用したPodの例

{{< codenew file="pods/pod-with-pod-affinity.yaml" >}}

このPodのアフィニティは、PodアフィニティとPodアンチアフィニティを1つずつ定義しています。
この例では、`podAffinity`に`requiredDuringSchedulingIgnoredDuringExecution`、`podAntiAffinity`に`preferredDuringSchedulingIgnoredDuringExecution`が設定されています。
Podアフィニティは、「キーが"security"、値が"S1"のラベルが付与されたPodが少なくとも1つは稼働しているNodeが同じゾーンにあれば、PodはそのNodeにスケジュールされる」という条件を指定しています(より正確には、キーが"security"、値が"S1"のラベルが付与されたPodが稼働しており、キーが`failure-domain.beta.kubernetes.io/zone`、値がVであるNodeが少なくとも1つはある状態で、
Node Nがキー`failure-domain.beta.kubernetes.io/zone`、値Vのラベルを持つ場合に、PodはNode Nで稼働させることができます)。
Podアンチアフィニティは、「すでにあるNode上で、キーが"security"、値が"S2"であるPodが稼働している場合に、Podを可能な限りそのNode上で稼働させない」という条件を指定しています
(`topologyKey`が`failure-domain.beta.kubernetes.io/zone`であった場合、キーが"security"、値が"S2"であるであるPodが稼働しているゾーンと同じゾーン内のNodeにはスケジュールされなくなります)。
PodアフィニティとPodアンチアフィニティや、`requiredDuringSchedulingIgnoredDuringExecution`と`preferredDuringSchedulingIgnoredDuringExecution`に関する他の使用例は[デザインドック](https://git.k8s.io/community/contributors/design-proposals/scheduling/podaffinity.md)を参照してください。

PodアフィニティとPodアンチアフィニティで使用できるオペレーターは、`In`、`NotIn`、 `Exists`、 `DoesNotExist`です。

原則として、`topologyKey`には任意のラベルとキーが使用できます。
しかし、パフォーマンスやセキュリティの観点から、以下の制約があります:

1. アフィニティと、`requiredDuringSchedulingIgnoredDuringExecution`を指定したPodアンチアフィニティは、`topologyKey`を指定しないことは許可されていません。
2. `requiredDuringSchedulingIgnoredDuringExecution`を指定したPodアンチアフィニティでは、`kubernetes.io/hostname`の`topologyKey`を制限するため、アドミッションコントローラー`LimitPodHardAntiAffinityTopology`が導入されました。
トポロジーをカスタマイズする場合には、アドミッションコントローラーを修正または無効化する必要があります。
3. `preferredDuringSchedulingIgnoredDuringExecution`を指定したPodアンチアフィニティでは、`topologyKey`を省略することはできません。
4. 上記の場合を除き、`topologyKey` は任意のラベルとキーを指定することができあます。

`labelSelector`と`topologyKey`に加え、`labelSelector`が合致すべき`namespaces`のリストを特定することも可能です(これは`labelSelector`と`topologyKey`を定義することと同等です)。
省略した場合や空の場合は、アフィニティとアンチアフィニティが定義されたPodのnamespaceがデフォルトで設定されます。

`requiredDuringSchedulingIgnoredDuringExecution`が指定されたアフィニティとアンチアフィニティでは、`matchExpressions`に記載された全ての条件が満たされるNodeにPodがスケジュールされます。


#### 実際的なユースケース

Pod間アフィニティとアンチアフィニティは、ReplicaSet、StatefulSet、Deploymentなどのより高レベルなコレクションと併せて使用するとさらに有用です。
Workloadが、Node等の定義された同じトポロジーに共存させるよう、簡単に設定できます。


##### 常に同じNodeで稼働させる場合

３つのノードから成るクラスターでは、ウェブアプリケーションはredisのようにインメモリキャッシュを保持しています。
このような場合、ウェブサーバーは可能な限りキャッシュと共存させることが望ましいです。

ラベル`app=store`を付与した3つのレプリカから成るredisのdeploymentを記述したyamlファイルを示します。
Deploymentには、1つのNodeにレプリカを共存させないために`PodAntiAffinity`を付与しています。


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

ウェブサーバーのDeploymentを記載した以下のyamlファイルには、`podAntiAffinity` と`podAffinity`が設定されています。
全てのレプリカが`app=store`のラベルが付与されたPodと同じゾーンで稼働するよう、スケジューラーに設定されます。
また、それぞれのウェブサーバーは1つのノードで稼働されないことも保証されます。


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
        image: nginx:1.16-alpine
```

上記2つのDeploymentが生成されると、3つのノードは以下のようになります。

|       node-1         |       node-2        |       node-3       |
|:--------------------:|:-------------------:|:------------------:|
| *webserver-1*        |   *webserver-2*     |    *webserver-3*   |
|  *cache-1*           |     *cache-2*       |     *cache-3*      |

このように、3つの`web-server`は期待通り自動的にキャッシュと共存しています。

```
kubectl get pods -o wide
```
出力は以下のようになります:
```
NAME                           READY     STATUS    RESTARTS   AGE       IP           NODE
redis-cache-1450370735-6dzlj   1/1       Running   0          8m        10.192.4.2   kube-node-3
redis-cache-1450370735-j2j96   1/1       Running   0          8m        10.192.2.2   kube-node-1
redis-cache-1450370735-z73mh   1/1       Running   0          8m        10.192.3.1   kube-node-2
web-server-1287567482-5d4dz    1/1       Running   0          7m        10.192.2.3   kube-node-1
web-server-1287567482-6f7v5    1/1       Running   0          7m        10.192.4.3   kube-node-3
web-server-1287567482-s330j    1/1       Running   0          7m        10.192.3.2   kube-node-2
```

##### 同じNodeに共存させない場合

上記の例では `PodAntiAffinity`を`topologyKey: "kubernetes.io/hostname"`と合わせて指定することで、redisクラスター内の2つのインスタンスが同じホストにデプロイされない場合を扱いました。
同様の方法で、アンチアフィニティを用いて高可用性を実現したStatefulSetの使用例は[ZooKeeper tutorial](/docs/tutorials/stateful-application/zookeeper/#tolerating-node-failure)を参照してください。


## nodeName

`nodeName`はNodeの選択を制限する最も簡単な方法ですが、制約があることからあまり使用されません。
`nodeName`はPodSpecのフィールドです。
ここに値が設定されると、schedulerはそのPodを考慮しなくなり、その名前が付与されているNodeのkubeletはPodを稼働させようとします。
そのため、PodSpecに`nodeName`が指定されると、上述のNodeの選択方法よりも優先されます。

 `nodeName`を使用することによる制約は以下の通りです:

-   その名前のNodeが存在しない場合、Podは起動されす、自動的に削除される場合があります。
-   その名前のNodeにPodを稼働させるためのリソースがない場合、Podの起動は失敗し、理由は例えばOutOfmemoryやOutOfcpuになります。
-   クラウド上のNodeの名前は予期できず、変更される可能性があります。

`nodeName`を指定したPodの設定ファイルの例を示します:

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

上記のPodはkube-01という名前のNodeで稼働します。



## {{% heading "whatsnext" %}}


[Taints](/docs/concepts/configuration/taint-and-toleration/)を使うことで、NodeはPodを追い出すことができます。

[Nodeアフィニティ](https://git.k8s.io/community/contributors/design-proposals/scheduling/nodeaffinity.md)と
[Pod間アフィニティ/アンチアフィニティ](https://git.k8s.io/community/contributors/design-proposals/scheduling/podaffinity.md)
のデザインドキュメントには、これらの機能の追加のバックグラウンドの情報が記載されています。

一度PodがNodeに割り当たると、kubeletはPodを起動してノード内のリソースを確保します。
[トポロジーマネージャー](/docs/tasks/administer-cluster/topology-manager/)はNodeレベルのリソース割り当てを決定する際に関与します。
