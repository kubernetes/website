---
title: ラベル(Labels)とセレクタ(Selectors)
content_template: templates/concept
weight: 40
---

{{% capture overview %}}

_ラベル(Labels)_ は  ポッドなどのオブジェクトに割り当てられたキー・バリューペアです。  
ラベルは、ユーザに関連した意味のあるオブジェクトのアトリビュートを指定するために使われることを目的としています。しかしKubernetesのコアシステムに対して直接的にその意味を暗示するものではありません。  
ラベルはオブジェクトのサブセットを選択し、グルーピングするために使うことができます。また、ラベルはオブジェクトの作成時に割り当てられ、その後いつでも追加、修正ができます。  
各オブジェクトはキー・バリューのラベルのセットを定義できます。各キーは、単一のオブジェクトに対してはユニークである必要があります。 
```json
"metadata": {
  "labels": {
    "key1" : "value1",
    "key2" : "value2"
  }
}
```

ラベルは効率的な検索・閲覧や、UIやCLI上での利用しやすさを可能にします。  
非識別の情報は、[アノテーション](/docs/concepts/overview/working-with-objects/annotations/)を用いて記録されるべきです。  

{{% /capture %}}


{{% capture body %}}

## ラベルを使う動機

ラベルは、クライアントにそのマッピング情報を保存することを要求することなく、ユーザ独自の組織構造をシステムオブジェクト上で疎結合にマッピングできます。

？
サービスデプロイメントとバッチ処理パイプラインは、たいてい多次元エンティティとなります(例: 複数のパーティション、デプロイメント、リリーストラック、ティアー、ティアー毎のマイクロサービスなど)  
管理はたいてい、分野横断的な操作が必要になることが多く、厳密な階層表現、特にユーザによるものでなく、インフラストラクチャによって定義された厳格な階層のカプセル化が破られます。

ラベルの例:

   * `"release" : "stable"`, `"release" : "canary"`
   * `"environment" : "dev"`, `"environment" : "qa"`, `"environment" : "production"`
   * `"tier" : "frontend"`, `"tier" : "backend"`, `"tier" : "cache"`
   * `"partition" : "customerA"`, `"partition" : "customerB"`
   * `"track" : "daily"`, `"track" : "weekly"`

これらはよく使われるラベル例となります。ユーザは自由に規約を決めることができます。  
ラベルのキーは、ある1つのオブジェクトに対してユニークである必要があることは覚えておかなくてはなりません。  

## シンタックスと文字セット

ラベルは、キー/バリューのベアです。正しいラベルキーは2つのセグメントを持ちます。  
`/`によって分割されたオプショナルなプレフィックスと名前です。  
名前セグメントは必須で、63文字以下である必要があり、文字列の最初と最後は英数字(`[a-z0-9A-Z]`)と、文字列の間にダッシュ(`-`)、アンダースコア(`_`)、ドット(`.`)を使うことができます。  
プレフィックスはオプションです。もしプレフィックスが指定されていた場合、プレフィックスはDNSサブドメイン形式である必要があり、それはドット(`.`)で区切られたDNSラベルのセットで、253文字以下である必要があり、最後にスラッシュ(`/`)が続きます。  

もしプレフィックスが除外された場合、ラベルキーはそのユーザ対してプライベートであると推定されます。  
エンドユーザのオブジェクトにラベルを追加するような自動化されたシステムコンポーネント(例: `kube-scheduler` `kube-controller-manager` `kube-apiserver` `kubectl`やその他のサードパーティツール)は、プレフィックスを指定しなくてはなりません。  

`kubernetes.io/`と`k8s.io/`プレフィックスは、Kubernetesコアコンポーネントのために予約されています。  

正しいラベル値は63文字以下の長さで、空文字か、もしくは開始と終了が英数字(`[a-z0-9A-Z]`)で、文字列の間にダッシュ(`-`)、アンダースコア(`_`)、ドット(`.`)である文字列を使うことができます。  

## ラベルセレクタ

[名前とUID](/docs/user-guide/identifiers)とは異なり、ラベルはユニーク性を提供しません。通常、多くのオブジェクトが同じラベルを保持することを想定します。

*ラベルセレクタ* を介して、クライアントとユーザはオブジェクトのセットを指定できます。ラベルセレクタはKubernetesにおいてコアなグルーピング機能となります。

Kubernetes APIは現在2タイプのセレクタをサポートしています。  
*等価ベース(equality-based)* と*集合ベース(set-based)* です。  
単一のラベルセレクタは、コンマ区切りの複数の*要件(requirements)* で構成されています。  
複数の要件がある場合、コンマセパレータは論理積 _AND_(`&&`)オペレータと同様にふるまい、全ての要件を満たす必要があります。

空文字の場合や、指定なしのセレクタに関するセマンティクスは、コンテキストに依存します。
そしてセレクタを使うAPIタイプは、それらのセレクタの妥当性とそれらが示す意味をドキュメントに記載するべきです。

{{< note >}}
レプリカセットなど、いくつかのAPIタイプにおいて、2つのインスタンスのラベルセレクタは単一の名前空間において重複してはいけません。重複していると、コントローラがそれらのラベルセレクタがコンフリクトした操作とみなし、いくつのレプリカを稼働させるべきか決めることができなくなります。
{{< /note >}}

### *等価ベース(Equality-based)* の要件(requirement)

*等価ベース(Equality-based)* もしくは*不等ベース(Inequality-based)* の要件は、ラベルキーとラベル値によるフィルタリングを可能にします。  
要件に一致したオブジェクトは、指定されたラベルの全てを満たさなくてはいけませんが、それらのオブジェクトはさらに追加のラベルも持つことができます。  
3つの種類のオペレータの利用が許可されています。`=`,`==`,`!=`。  
最初の2つのオペレータ(`=`,`==`)は*等価(Equality)* を表現し(この2つは単なる同義語)、最後の1つ(`!=`)は*不等(Inequality)* を意味します。  
例えば

```
environment = production
tier != frontend
```

最初の例は、キーが`environment`で、値が`production`である全てのリソースを対象にします。  
次の例は、キーが`tier`で、値が`frontend`とは異なるリソースと、`tier`という名前のキーを持たない全てのリソースを対象にします。  
コンマセパレータ`,`を使って、`production`の中から、`frontend`のものを除外するようにフィルターすることもできます。  
`environment=production,tier!=frontend`  

等価ベースのラベル要件の1つの使用シナリオとして、ポッドにおけるノードの選択要件を指定するケースがあります。  
例えば、下記のサンプルポッドは、ラベル`accelerator=nvidia-tesla-p100`をもったノードを選択します。  

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

*集合ベース(Set-based)* のラベルの要件は値のセットによってキーをフィルタリングします。  
`in`、`notin`、`exists`の3つのオペレータをサポートしています(キーを特定するのみ)。    

例えば:  
```
environment in (production, qa)
tier notin (frontend, backend)
partition
!partition
```

最初の例では、キーが`environment`で、値が`production`か`qa`に等しいリソースを全て選択します。  
第2の例では、キーが`tier`で、値が`frontend`と`backend`以外のもの、そして`tier`キーを持たないリソースを全て選択します。  
第3の例では、`partition`というキーをもつラベルを全て選択し、値はチェックしません。  
第4の例では、`partition`というキーを持たないラベルを全て選択し、値はチェックしません。  
同様に、コンマセパレータは、_AND_オペレータと同様にふるまいます。そのため、`partition`と`environment`キーの値がともに`qa`でないラベルを選択するには、`partition,environment notin (qa)`と記述することで可能です。  
*集合ベース* のラベルセレクタは、`environment=production`という記述が`environment in (production)`と等しいため、一般的な等価形式となります。 `!=`と`notin`も同様に等価となります。  

*集合ベース* の要件は、*等価ベース* の要件と混在できます。  
例えば:  
`partition in (customerA, customerB),environment!=qa`.

## API

### LISTとWATCHによるフィルタリング

LISTとWATCHオペレーションは、単一のクエリパラメータを使うことによって返されるオブジェクトのセットをフィルターするためのラベルセレクタを指定できます。  
*集合ベース* と*等価ベース* のどちらの要件も許可されています(ここでは、URLクエリストリング内で出現します)。  

  * *等価ベース* での要件: `?labelSelector=environment%3Dproduction,tier%3Dfrontend`
  * *集合ベース* での要件: `?labelSelector=environment+in+%28production%2Cqa%29%2Ctier+in+%28frontend%29`

上記の2つの形式のラベルセレクタはRESTクライアントを介してリストにしたり、もしくは確認するために使われます。  
例えば、`kubectl`によって`apiserver`をターゲットにし、*等価ベース* の要件でフィルターすると以下のように書けます。  

```shell
kubectl get pods -l environment=production,tier=frontend
```

もしくは、*集合ベース* の要件を指定すると以下のようになります。  
```shell
kubectl get pods -l 'environment in (production),tier in (frontend)'
```

すでに言及したように、*集合ベース* の要件は、*等価ベース* の要件より表現力があります。  
例えば、値に対する_OR_ オペレータを実装して以下のように書けます。  

```shell
kubectl get pods -l 'environment in (production, qa)'
```

もしくは、_exists_ オペレータを介して、否定マッチングによる制限もできます。  

```shell
kubectl get pods -l 'environment,environment notin (frontend)'
```

### APIオブジェクトに参照を設定する
[`サービス`](/docs/user-guide/services) と [`レプリケーションコントローラ`](/docs/user-guide/replication-controller)のような、いくつかのKubernetesオブジェクトでは、ラベルセレクタを[ポッド](/docs/user-guide/pods)のような他のリソースのセットを指定するのにも使われます。  

#### サービスとレプリケーションコントローラ
`サービス`が対象とするポッドの集合は、ラベルセレクタによって定義されます。  
同様に、`レプリケーションコントローラ`が管理するべきポッド数についてもラベルセレクタを使って定義されます。  

それぞれのオブジェクトに対するラベルセレクタはマップを使って`json`もしくは`yaml`形式のファイルで定義され、*等価ベース* のセレクタのみサポートされています。  

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

このセレクタ(それぞれ`json`または`yaml`形式)は、`component=redis`または`component in (redis)`と等価です。   

#### *集合ベース* の要件指定をサポートするリソース

[`ジョブ`](/docs/concepts/jobs/run-to-completion-finite-workloads/)や[`デプロイメント`](/docs/concepts/workloads/controllers/deployment/)、[`レプリカセット`](/docs/concepts/workloads/controllers/replicaset/)や[`デーモンセット`](/docs/concepts/workloads/controllers/daemonset/)となどの比較的新しいリソースは、*集合ベース* での要件指定もサポートしています。  
```yaml
selector:
  matchLabels:
    component: redis
  matchExpressions:
    - {key: tier, operator: In, values: [cache]}
    - {key: environment, operator: NotIn, values: [dev]}
```

`matchLabels`は、`{key,value}`ペアのマップです。`matchLabels`内の単一の`{key,value}`は、`matchExpressions`の要素と等しく、それは、`key`フィールドがキー名で、`operator`が"In"で、`values`配列は単に"値”を保持します。  
`matchExpressions`はポッドセレクタ要件のリストです。対応しているオペレータは`In`、`NotIn`、`Exists`と`DoesNotExist`です。`values`のセットは、`In`と`NotIn`オペレータにおいては空文字を許容しません。  
`matchLabels`と`matchExpressions`の両方によって指定された全ての要件指定はANDで判定されます。つまり要件にマッチするには指定された全ての要件を満たす必要があります。  

#### ノードのセットを選択する  
ラベルを選択するための1つのユースケースはポッドがスケジュールできるノードのセットを制限することです。  
さらなる情報に関しては、[ノード選定](/docs/concepts/configuration/assign-pod-node/) のドキュメントを参照してください。 

{{% /capture %}}
