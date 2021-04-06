---
title: ラベル(Labels)とセレクター(Selectors)
content_type: concept
weight: 40
---

<!-- overview -->

_ラベル(Labels)_ はPodなどのオブジェクトに割り当てられたキーとバリューのペアです。  
ラベルはユーザーに関連した意味のあるオブジェクトの属性を指定するために使われることを目的としています。しかしKubernetesのコアシステムに対して直接的にその意味を暗示するものではありません。  
ラベルはオブジェクトのサブセットを選択し、グルーピングするために使うことができます。また、ラベルはオブジェクトの作成時に割り当てられ、その後いつでも追加、修正ができます。  
各オブジェクトはキーとバリューのラベルのセットを定義できます。各キーは、単一のオブジェクトに対してはユニークである必要があります。 
```json
"metadata": {
  "labels": {
    "key1" : "value1",
    "key2" : "value2"
  }
}
```

ラベルは効率的な検索・閲覧を可能にし、UIやCLI上での利用に最適です。 
識別用途でない情報は、[アノテーション](/ja/docs/concepts/overview/working-with-objects/annotations/)を用いて記録されるべきです。  




<!-- body -->

## ラベルを使う動機

ラベルは、クライアントにそのマッピング情報を保存することを要求することなく、ユーザー独自の組織構造をシステムオブジェクト上で疎結合にマッピングできます。

サービスデプロイメントとバッチ処理のパイプラインは多くの場合、多次元のエンティティとなります(例: 複数のパーティション、Deployment、リリーストラック、ティアー、ティアー毎のマイクロサービスなど)  
管理は分野横断的な操作が必要になることが多く、それによって厳密な階層表現、特にユーザーによるものでなく、インフラストラクチャーによって定義された厳格な階層のカプセル化が破られます。

ラベルの例:

   * `"release" : "stable"`, `"release" : "canary"`
   * `"environment" : "dev"`, `"environment" : "qa"`, `"environment" : "production"`
   * `"tier" : "frontend"`, `"tier" : "backend"`, `"tier" : "cache"`
   * `"partition" : "customerA"`, `"partition" : "customerB"`
   * `"track" : "daily"`, `"track" : "weekly"`

これらは単によく使われるラベルの例です。ユーザーは自由に規約を決めることができます。
ラベルのキーは、ある1つのオブジェクトに対してユニークである必要があることは覚えておかなくてはなりません。  

## 構文と文字セット {#syntax-and-character-set}

ラベルは、キーとバリューのベアです。正しいラベルキーは2つのセグメントを持ちます。  
それは`/`によって分割されたオプショナルなプレフィックスと名前です。  
名前セグメントは必須で、63文字以下である必要があり、文字列の最初と最後は英数字(`[a-z0-9A-Z]`)で、文字列の間ではこれに加えてダッシュ(`-`)、アンダースコア(`_`)、ドット(`.`)を使うことができます。  
プレフィックスはオプションです。もしプレフィックスが指定されていた場合、プレフィックスはDNSサブドメイン形式である必要があり、それはドット(`.`)で区切られたDNSラベルのセットで、253文字以下である必要があり、最後にスラッシュ(`/`)が続きます。  

もしプレフィックスが省略された場合、ラベルキーはそのユーザーに対してプライベートであると推定されます。  
エンドユーザーのオブジェクトにラベルを追加するような自動化されたシステムコンポーネント(例: `kube-scheduler` `kube-controller-manager` `kube-apiserver` `kubectl`やその他のサードパーティツール)は、プレフィックスを指定しなくてはなりません。  

`kubernetes.io/`と`k8s.io/`プレフィックスは、Kubernetesコアコンポーネントのために予約されています。  

正しいラベル値は63文字以下の長さで、空文字か、もしくは開始と終了が英数字(`[a-z0-9A-Z]`)で、文字列の間がダッシュ(`-`)、アンダースコア(`_`)、ドット(`.`)と英数字である文字列を使うことができます。  

例えば、`environment: production`と`app: nginx`の2つのラベルを持つPodの設定ファイルは下記のようになります。

```yaml

apiVersion: v1
kind: Pod
metadata:
  name: label-demo
  labels:
    environment: production
    app: nginx
spec:
  containers:
  - name: nginx
    image: nginx:1.14.2
    ports:
    - containerPort: 80

```

## ラベルセレクター {#label-selectors}

[名前とUID](/ja/docs/concepts/overview/working-with-objects/names/)とは異なり、ラベルはユニーク性を提供しません。通常、多くのオブジェクトが同じラベルを保持することを想定します。

*ラベルセレクター* を介して、クライアントとユーザーはオブジェクトのセットを指定できます。ラベルセレクターはKubernetesにおいてコアなグルーピング機能となります。

Kubernetes APIは現在2タイプのセレクターをサポートしています。  
それは*等価ベース(equality-based)* と*集合ベース(set-based)* です。  
単一のラベルセレクターは、コンマ区切りの複数の*要件(requirements)* で構成されています。  
複数の要件がある場合、コンマセパレーターは論理積 _AND_(`&&`)オペレーターと同様にふるまい、全ての要件を満たす必要があります。

空文字の場合や、指定なしのセレクターに関するセマンティクスは、コンテキストに依存します。
そしてセレクターを使うAPIタイプは、それらのセレクターの妥当性とそれらが示す意味をドキュメントに記載するべきです。

{{< note >}}
ReplicaSetなど、いくつかのAPIタイプにおいて、2つのインスタンスのラベルセレクターは単一の名前空間において重複してはいけません。重複していると、コントローラがそれらのラベルセレクターがコンフリクトした操作とみなし、どれだけの数のレプリカを稼働させるべきか決めることができなくなります。
{{< /note >}}

{{< caution >}}
等価ベース、集合ベースともに、論理OR (`||`) オペレーターは存在しません。フィルターステートメントが意図した通りになっていることを確認してください。
{{< /caution >}}

### *等価ベース(Equality-based)* の要件(requirement)

*等価ベース(Equality-based)* もしくは*不等ベース(Inequality-based)* の要件は、ラベルキーとラベル値によるフィルタリングを可能にします。  
要件に一致したオブジェクトは、指定されたラベルの全てを満たさなくてはいけませんが、それらのオブジェクトはさらに追加のラベルも持つことができます。  
そして等価ベースの要件においては、3つの種類のオペレーターの利用が許可されています。`=`、`==`、`!=`となります。  
最初の2つのオペレーター(`=`、`==`)は*等価(Equality)* を表現し(この2つは単なる同義語)、最後の1つ(`!=`)は*不等(Inequality)* を意味します。  
例えば

```
environment = production
tier != frontend
```

最初の例は、キーが`environment`で、値が`production`である全てのリソースを対象にします。  
次の例は、キーが`tier`で、値が`frontend`とは異なるリソースと、`tier`という名前のキーを持たない全てのリソースを対象にします。  
コンマセパレーター`,`を使って、`production`の中から、`frontend`のものを除外するようにフィルターすることもできます。  
`environment=production,tier!=frontend`  

等価ベースのラベル要件の1つの使用シナリオとして、PodにおけるNodeの選択要件を指定するケースがあります。  
例えば、下記のサンプルPodは、ラベル`accelerator=nvidia-tesla-p100`をもったNodeを選択します。  

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: cuda-test
spec:
  containers:
    - name: cuda-test
      image: "k8s.gcr.io/cuda-vector-add:v0.1"
      resources:
        limits:
          nvidia.com/gpu: 1
  nodeSelector:
    accelerator: nvidia-tesla-p100
```

### *集合ベース(Set-based)* の要件(requirement)

*集合ベース(Set-based)* のラベルの要件は値のセットによってキーをフィルタリングします。  
`in`、`notin`、`exists`の3つのオペレーターをサポートしています(キーを特定するのみ)。    

例えば:  
```
environment in (production, qa)
tier notin (frontend, backend)
partition
!partition
```

* 最初の例では、キーが`environment`で、値が`production`か`qa`に等しいリソースを全て選択します。  
* 第2の例では、キーが`tier`で、値が`frontend`と`backend`以外のもの、そして`tier`キーを持たないリソースを全て選択します。  
* 第3の例では、`partition`というキーをもつラベルを全て選択し、値はチェックしません。  
* 第4の例では、`partition`というキーを持たないラベルを全て選択し、値はチェックしません。  
同様に、コンマセパレーターは、_AND_ オペレーターと同様にふるまいます。そのため、`partition`と`environment`キーの値がともに`qa`でないラベルを選択するには、`partition,environment notin (qa)`と記述することで可能です。  
*集合ベース* のラベルセレクターは、`environment=production`という記述が`environment in (production)`と等しいため、一般的な等価形式となります。 `!=`と`notin`も同様に等価となります。  

*集合ベース* の要件は、*等価ベース* の要件と混在できます。  
例えば:  
`partition in (customerA, customerB),environment!=qa`.

## API

### LISTとWATCHによるフィルタリング

LISTとWATCHオペレーションは、単一のクエリパラメータを使うことによって返されるオブジェクトのセットをフィルターするためのラベルセレクターを指定できます。  
*集合ベース* と*等価ベース* のどちらの要件も許可されています(ここでは、URLクエリストリング内で出現します)。  

  * *等価ベース* での要件: `?labelSelector=environment%3Dproduction,tier%3Dfrontend`
  * *集合ベース* での要件: `?labelSelector=environment+in+%28production%2Cqa%29%2Ctier+in+%28frontend%29`

上記の2つの形式のラベルセレクターはRESTクライアントを介してリストにしたり、もしくは確認するために使われます。  
例えば、`kubectl`によって`apiserver`をターゲットにし、*等価ベース* の要件でフィルターすると以下のように書けます。  

```shell
kubectl get pods -l environment=production,tier=frontend
```

もしくは、*集合ベース* の要件を指定すると以下のようになります。  
```shell
kubectl get pods -l 'environment in (production),tier in (frontend)'
```

すでに言及したように、*集合ベース* の要件は、*等価ベース* の要件より表現力があります。  
例えば、値に対する _OR_ オペレーターを実装して以下のように書けます。  

```shell
kubectl get pods -l 'environment in (production, qa)'
```

もしくは、_exists_ オペレーターを介して、否定マッチングによる制限もできます。  

```shell
kubectl get pods -l 'environment,environment notin (frontend)'
```

### APIオブジェクトに参照を設定する
[`Service`](/ja/docs/concepts/services-networking/service/) と [`ReplicationController`](/docs/concepts/workloads/controllers/replicationcontroller/)のような、いくつかのKubernetesオブジェクトでは、ラベルセレクターを[Pod](/ja/docs/concepts/workloads/pods/)のような他のリソースのセットを指定するのにも使われます。  

#### ServiceとReplicationController
`Service`が対象とするPodの集合は、ラベルセレクターによって定義されます。  
同様に、`ReplicationController`が管理するべきPod数についてもラベルセレクターを使って定義されます。  

それぞれのオブジェクトに対するラベルセレクターはマップを使って`json`もしくは`yaml`形式のファイルで定義され、*等価ベース* のセレクターのみサポートされています。  

```json
"selector": {
    "component" : "redis",
}
```
もしくは  

```yaml
selector:
    component: redis
```

このセレクター(それぞれ`json`または`yaml`形式)は、`component=redis`または`component in (redis)`と等価です。   

#### *集合ベース* の要件指定をサポートするリソース

[`Job`](/docs/concepts/workloads/controllers/job/)や[`Deployment`](/ja/docs/concepts/workloads/controllers/deployment/)、[`ReplicaSet`](/ja/docs/concepts/workloads/controllers/replicaset/)や[`DaemonSet`](/ja/docs/concepts/workloads/controllers/daemonset/)などの比較的新しいリソースは、*集合ベース* での要件指定もサポートしています。  
```yaml
selector:
  matchLabels:
    component: redis
  matchExpressions:
    - {key: tier, operator: In, values: [cache]}
    - {key: environment, operator: NotIn, values: [dev]}
```

`matchLabels`は、`{key,value}`ペアのマップです。`matchLabels`内の単一の`{key,value}`は、`matchExpressions`の要素と等しく、それは、`key`フィールドがキー名で、`operator`が"In"で、`values`配列は単に"値"を保持します。  
`matchExpressions`はPodセレクター要件のリストです。対応しているオペレーターは`In`、`NotIn`、`Exists`と`DoesNotExist`です。`values`のセットは、`In`と`NotIn`オペレーターにおいては空文字を許容しません。  
`matchLabels`と`matchExpressions`の両方によって指定された全ての要件指定はANDで判定されます。つまり要件にマッチするには指定された全ての要件を満たす必要があります。  

#### Nodeのセットを選択する  
ラベルを選択するための1つのユースケースはPodがスケジュールできるNodeのセットを制限することです。  
さらなる情報に関しては、[Node選定](/ja/docs/concepts/scheduling-eviction/assign-pod-node/) のドキュメントを参照してください。 


