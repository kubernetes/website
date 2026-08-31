---
title: DRA APIオブジェクト
content_type: concept
weight: 10
api_metadata:
- apiVersion: "resource.k8s.io/v1"
  kind: "ResourceClaim"
- apiVersion: "resource.k8s.io/v1"
  kind: "ResourceClaimTemplate"
- apiVersion: "resource.k8s.io/v1"
  kind: "DeviceClass"
- apiVersion: "resource.k8s.io/v1"
  kind: "ResourceSlice"
---

<!-- overview -->

このページでは、Dynamic Resource Allocation (DRA)がデバイスを分類、要求、割り当てを行うために使用するKubernetes API kindについて説明します。

<!-- body -->

## DRAの用語 {#terminology}

DRAは、コアとなる割り当て機能を提供するために、次のKubernetes API kindを使用します。
これらのAPI kindはすべて、`resource.k8s.io/v1` {{< glossary_tooltip text="APIグループ" term_id="api-group" >}}に含まれています。

DeviceClass
: 要求可能なデバイスのカテゴリと、クレーム内で特定のデバイス属性を選択する方法を定義します。
  DeviceClassのパラメーターは、ResourceSlice内の0個以上のデバイスに一致します。
  DeviceClassからデバイスを要求するために、ResourceClaimは特定のデバイス属性を選択します。

ResourceClaim
: クラスター内のデバイスなどの接続されたリソースへのアクセス要求を記述します。
  ResourceClaimは、Podに対して特定のリソースへのアクセスを提供します。
  ResourceClaimは、ワークロード運用者が作成することも、ResourceClaimTemplateに基づいてKubernetesが生成することもできます。

ResourceClaimTemplate
: ワークロード用のPodごとのResourceClaimをKubernetesが作成するために使用するテンプレートを定義します。
  ResourceClaimTemplateはPodに対して、それぞれ独立した同種のリソースへのアクセスを提供します。
  Kubernetesがテンプレートから生成する各ResourceClaimは、特定のPodに関連付けられます。
  Podが終了すると、Kubernetesは対応するResourceClaimを削除します。

ResourceSlice
: デバイスなどのノードに接続された1つ以上のリソースを表します。
  ドライバーはクラスター内のResourceSliceを作成および管理します。
  ResourceClaimが作成され、Podで使用されると、KubernetesはResourceSliceを使用して、要求されたリソースにアクセスできるノードを探します。
  KubernetesはResourceClaimにリソースを割り当て、そのリソースにアクセスできるノードにPodをスケジュールします。

### DeviceClass {#deviceclass}

DeviceClassを使用すると、クラスター管理者またはデバイスドライバーは、クラスター内のデバイスのカテゴリを定義できます。
DeviceClassは運用者に対して、どのデバイスを要求できるか、およびそれらのデバイスをどのように要求できるかを示します。
[common expression language (CEL)](https://cel.dev)を使用すると、特定の属性に基づいてデバイスを選択できます。
DeviceClassを参照するResourceClaimは、そのDeviceClass内の特定の構成を要求できます。

DeviceClassを作成する方法については、[クラスターのDRAをセットアップする](/docs/tasks/configure-pod-container/assign-resources/set-up-dra-cluster)を参照してください。

### ResourceClaimsとResourceClaimTemplates {#resourceclaims-templates}

ResourceClaimは、ワークロードが必要とするリソースを定義します。
すべてのResourceClaimは、DeviceClassを参照して、そのDeviceClassからデバイスを選択する _requests_ を持ちます。
ResourceClaimは、特定の要件を満たすデバイスをフィルタリングするための _selectors_ や、要求を満たすことができるデバイスを制限するための _constraints_ を使用することもできます。
ResourceClaimは、ワークロード運用者が作成することも、ResourceClaimTemplateに基づいてKubernetesが生成することもできます。
ResourceClaimTemplateは、KubernetesがPodに対するResourceClaimを自動生成するために使用できるテンプレートを定義します。

#### ResourceClaimとResourceClaimTemplateのユースケース {#when-to-use-rc-rct}

利用方法は、要件に応じて次のように選択します:

* **ResourceClaim**: 複数のPodで特定のデバイスへのアクセスを共有したい場合に使用します。
  作成したResourceClaimのライフサイクルは、自分で管理します。
* **ResourceClaimTemplate**: Podごとに、それぞれ独立した同じ構成のデバイスへのアクセスを持たせたい場合に使用します。
  Kubernetesは、ResourceClaimTemplateの仕様に基づいてResourceClaimを生成します。
  生成された各ResourceClaimのライフサイクルは、対応するPodのライフサイクルに関連づけられます。
* [**PodGroup ResourceClaimTemplate**](#workload-resource-claims): {{< glossary_tooltip text="PodGroup" term_id="podgroup" >}}ごとにそれぞれ独立した同じ構成のデバイスへのアクセスを持たせ、PodGroupのPod間でデバイスを共有したい場合に使用します。
  Kubernetesは、ResourceClaimTemplateの定義に基づいて、PodGroupごとに1つのResourceClaimを生成します。
  生成された各ResourceClaimのライフサイクルは、対応するPodGroupのライフサイクルに関連づけられます。
  これを使用するには、[`DRAWorkloadResourceClaims`](/docs/reference/command-line-tools-reference/feature-gates/#DRAWorkloadResourceClaims)の機能を有効にする必要があります。

ワークロードを定義する時は、特定のデバイス属性や容量に基づいたフィルタリングのために{{< glossary_tooltip term_id="cel" text="Common Expression Language (CEL)" >}}が使用できます。
フィルタリングに使用できるパラメーターは、デバイスやドライバーによって異なります。

Podから特定のResourceClaimを直接参照する場合、ResourceClaimはあらかじめPodと同じNamespaceに存在している必要があります。
ResourceClaimがNamespaceに存在していない場合、Podはスケジュールされません。
この動作は、PersistentVolumeClaimを参照するPodでは、そのPersistentVolumeClaimがPodと同じNamespaceに存在している必要があることと同様です。

Podから自動生成されたResourceClaimを参照することもできますが、自動生成されたResourceClaimは、それを生成するトリガーとなったPodまたはPodGroupのライフサイクルに関連づけられるため、推奨されません。

これらの方法のいずれかを使用してリソースを要求する手順については、[DRAを使用してワークロードにデバイスを割り当てる](/docs/tasks/configure-pod-container/assign-resources/allocate-devices-dra/)を参照してください。

#### 優先度付きリスト {#prioritized-list}

{{< feature-state feature_gate_name="DRAPrioritizedList" >}}

ResourceClaimまたはResourceClaimTemplate内のrequestsには、サブリクエストの優先度付きリストを指定できます。
スケジューラーは、その中から割り当て可能な最初のサブリクエストを選択します。
これによりユーザーは、第一候補が利用できない場合に、ワークロードで使用できる代わりのデバイスを指定できます。

以下の例では、ResourceClaimTemplateは、黒色の大きなサイズのデバイスを要求しています。
それらの属性を持つデバイスが利用できない場合、Podはスケジュールされません。
優先度付きリストの機能を使用すると、第二候補として、白色で小さなサイズのデバイス2台を要求するサブリクエストを指定できます。
サイズが大きい黒色のデバイスが利用可能な場合は、そのデバイスが割り当てられます。
利用できない場合でも、サイズが小さい白色のデバイスが2台利用できれば、Podは引き続き実行できます。

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceClaimTemplate
metadata:
  name: prioritized-list-claim-template
spec:
  spec:
    devices:
      requests:
      - name: req-0
        firstAvailable:
        - name: large-black
          deviceClassName: resource.example.com
          selectors:
          - cel:
              expression: |-
                device.attributes["resource-driver.example.com"].color == "black" &&
                device.attributes["resource-driver.example.com"].size == "large"
        - name: small-white
          deviceClassName: resource.example.com
          selectors:
          - cel:
              expression: |-
                device.attributes["resource-driver.example.com"].color == "white" &&
                device.attributes["resource-driver.example.com"].size == "small"
          count: 2
```

Podがクラスター内の複数のノードで利用できる場合、スケジューラーは各ノードをスコアリングする際の入力の1つとして、優先度付きリストから選択されたサブリクエストのインデックスを使用します。
そのため、より優先度の高いサブリクエストで要求されたデバイスを割り当てられるノードは、より優先度の低いサブリクエストで要求されたデバイスしか割り当てられないノードよりも選択されやすくなります。

この判断はPodごとに行われるため、そのPodがReplicaSetなどのグループのメンバーである場合、グループ内のすべてのPodで同じサブリクエストが選択されるとは限りません。
ワークロードは、この動作に対応できるよう設計されている必要があります。

#### ワークロードResourceClaim {#workload-resource-claims}

{{< feature-state feature_gate_name="DRAWorkloadResourceClaims" >}}

[Workload API](/docs/concepts/workloads/workload-api/)を使用してPodを管理する場合、個々のPodではなく{{< glossary_tooltip text="PodGroups" term_id="podgroup" >}}全体に対してResourceClaimを予約でき、また、単一のPodではなくPodGroupに対するResourceClaimTemplateを生成できるため、PodGroup内のPodは、生成されたResourceClaimに割り当てられたデバイスへのアクセスを共有できます。

この機能は、次の2つの問題を解決することを目的としています:

- ResourceClaim APIの`status.reservedFor`リストには、最大256個の項目しか含められません。
  kube-schedulerはこのリストに個々のPodしか記録しないため、1つのResourceClaimを共有できるPodは最大256個です。
 `status.reservedFor`にPodGroupを記録できるようにすることで、256個を超えるPodが1つのResourceClaimを共有できるようになります。
- PodがResourceClaimを共有できるのは、その正確な名前がわかっている場合に限られます。
  Podの _groups_ を複製するような複雑なワークロードでは、各グループ内のPodが共有するResourceClaimを、グループのスケールアップまたはスケールダウンに応じて明示的に作成および削除する必要があります。
  PodGroupごとにResourceClaimを生成することで、1つのResourceClaimTemplateを基に、PodGroup内のPod間で自動複製、共有されるResourceClaimを作成できます。

PodGroup APIは、Pod APIの`spec.resourceClaims`フィールドと同じ構造、同様の意味を持つ`spec.resourceClaims`フィールドを定義します:

```yaml
apiVersion: scheduling.k8s.io/v1beta1
kind: PodGroup
metadata:
  name: training-group
  namespace: some-ns
spec:
  ...
  resourceClaims:
  - name: pg-claim
    resourceClaimName: my-pg-claim
  - name: pg-claim-template
    resourceClaimTemplateName: my-pg-template
```

Podのクレームと同様に、`resourceClaimName`を定義するPodGroupのクレームは、名前によってResourceClaimを参照します。
`resourceClaimTemplateName`を定義するクレームは、PodGroup全体に対して1つのResourceClaimに展開されるResourceClaimTemplateを参照し、このResourceClaimはPodGroup内のPod間で共有できます。

Podが定義するクレームの`name`、`resourceClaimName`、`resourceClaimTemplateName`が、そのPodGroupのいずれか1つのクレームとすべて一致する場合、kube-schedulerはPodではなくPodGroupのためにそのResourceClaimを予約します。
PodのクレームがPodGroupのクレームと一致しない場合、kube-schedulerはPodのためにそのResourceClaimを予約します。
いずれの場合も、予約情報はResourceClaimの`status.reservedFor`に記録されます。
PodGroupに対する予約と、それに対応するリソースの割り当ては、PodGroupにPodが存在しなくなった場合でも、PodGroupが削除されるまでResourceClaimに保持されます。

PodGroupのクレームと一致するPodのクレームが`resourceClaimTemplateName`を定義している場合、そのPodGroupに対して1つのResourceClaimが生成されます。
同じクレームを定義するグループ内の他のPodは、Podごとに新しいResourceClaimを生成するのではなく、その生成済みのResourceClaimを共有します。
`resourceClaimTemplateName`を定義するクレームがPodGroupのクレームと一致するかどうかにかかわらず、生成されたResourceClaimの名前は、Podの`status.resourceClaimStatuses`に記録されます。

ResourceClaimTemplateに一致するPodGroupのクレームによってResourceClaimが作成されるのは、[`DRAWorkloadResourceClaims`](/docs/reference/command-line-tools-reference/feature-gates/#DRAWorkloadResourceClaims)の機能が有効になっている場合のみです。
機能が無効の場合、PodごとのResourceClaimが作成されることはなく、ResourceClaimは一切作成されません。
これは、クラスターのアップグレード中や、`kube-apiserver`と`kube-controller-manager`の間でこの機能をロールアウトまたはロールバックする際に、意図せずPodごとのResourceClaimが作成されることを防ぐためです。

PodGroupに対するResourceClaimTemplateから生成されたResourceClaimは、PodGroupのライフサイクルに従います。
ResourceClaimは、PodGroupとそれに対応するResourceClaimTemplateの両方が存在するときに初めて作成されます。
ResourceClaimは、PodGroupが削除され、ResourceClaimが予約されなくなった後に削除されます。

次の例を考えてみます:

```yaml
apiVersion: scheduling.k8s.io/v1beta1
kind: PodGroup
metadata:
  name: training-group
  namespace: some-ns
spec:
  ...
  resourceClaims:
  - name: pg-claim
    resourceClaimName: my-pg-claim
  - name: pg-claim-template
    resourceClaimTemplateName: my-pg-template
---
apiVersion: v1
kind: Pod
metadata:
  name: training-group-pod-1
  namespace: some-ns
spec:
  ...
  schedulingGroup:
    podGroupName: training-group
  resourceClaims:
  - name: pod-claim
    resourceClaimName: my-pod-claim
  - name: pod-claim-template
    resourceClaimTemplateName: my-pod-template
  - name: pg-claim
    resourceClaimName: my-pg-claim
  - name: pg-claim-template
    resourceClaimTemplateName: my-pg-template
```

この例では、`training-group` PodGroupには`training-group-pod-1`という名前のPodが1つあります。
このPodの`pod-claim`および`pod-claim-template`クレームは、PodGroupが定義するどのクレームとも一致しないため、これらのクレームはPodGroupの影響を受けません: ResourceClaim `my-pod-claim`はPodのために予約され、ResourceClaimTemplate `my-pod-template`から生成されたResourceClaimもPodのために予約されます。
一方、`pg-claim`および`pg-claim-template`は、PodGroupが定義するクレームと一致します。
そのため、ResourceClaim `my-pg-claim`はPodGroupのために予約され、ResourceClaimTemplate `my-pg-template`から生成されたResourceClaimもPodGroupのために予約されます。

Workload APIリソースへのResourceClaimの関連付けは、kube-apiserver、kube-controller-manager、kube-schedulerおよびkubeletの[`DRAWorkloadResourceClaims`フィーチャーゲート](/docs/reference/command-line-tools-reference/feature-gates/#DRAWorkloadResourceClaims)によって制御されます。

### ResourceSlice {#resourceslice}

各ResourceSliceは、1つのプール内の1台以上の{{< glossary_tooltip term_id="device" text="デバイス" >}}を表します。
プールはResourceSliceを作成、管理するデバイスドライバーによって管理されます。
プール内のリソースは、1つのResourceSliceまたは複数のResourceSliceにまたがって表されます。

ResourceSliceは、デバイスの利用者とスケジューラーに有用な情報を提供し、動的リソース割り当てにおいて重要な役割を果たします。
すべてのResourceSliceには、次の情報を含める必要があります:

* **リソースプール**: ドライバーが管理する1つ以上のリソースのグループです。
  プールは複数のResourceSliceにまたがる場合があります。
  プール内のリソースに変更があった場合は、その変更をプール内のすべてのResourceSliceに反映する必要があります。
  この反映が行われることは、プールを管理するデバイスドライバーの責任です。
* **デバイス**: 管理対象のプール内のデバイスです。
  ResourceSliceは、プール内のすべてのデバイス、またはその一部を一覧表示できます。
  ResourceSliceは、属性、バージョン、容量などのデバイス情報を定義します。
  デバイスの利用者は、ResourceClaimまたはDeviceClass内のデバイス情報を条件としてフィルタリングすることで、割り当てるデバイスを選択できます。
* **ノード**: リソースにアクセスできるノードです。
  ドライバーは、クラスター内のすべてのノード、特定の名前を持つ1つのノード、または特定のノードラベルを持つノードなど、どのノードがリソースにアクセスできるかを選択できます。

ドライバーは、{{< glossary_tooltip text="コントローラー" term_id="controller" >}}を使用してクラスター内のResourceSliceを、ドライバーが公開する情報と一致する状態に調整します。
このコントローラーは、クラスターの利用者がResourceSliceを作成または変更した場合などの、手動による変更を上書きします。

次のResourceSliceの例を考えます:

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceSlice
metadata:
  name: cat-slice
spec:
  driver: "resource-driver.example.com"
  pool:
    generation: 1
    name: "black-cat-pool"
    resourceSliceCount: 1
  # allNodesフィールドは、クラスター内のすべてのノードがデバイスにアクセスできるかどうかを定義します。
  allNodes: true
  devices:
  - name: "large-black-cat"
    attributes:
      color:
        string: "black"
      size:
        string: "large"
      cat:
        bool: true
```
このResourceSliceは、プール`black-cat-pool`内の`resource-driver.example.com`ドライバーによって管理されています。
`allNodes: true`フィールドは、クラスター内のすべてのノードがこれらのデバイスにアクセスできることを示します。
ResourceSliceには、`large-black-cat`という名前のデバイスが1台含まれており、次の属性を持ちます:

* `color`: `black`
* `size`: `large`
* `cat`: `true`

DeviceClassは、これらの属性を使用してこのResourceSliceを選択することができ、ResourceClaimは、そのDeviceClass内の特定のデバイスをフィルタリングできます。

#### 名前付けと優先度 {#resourceslice-naming-and-prioritization}

Kubernetesスケジューラーが割り当て対象を評価する順番は、ResourceSlice名およびリソースプール名の辞書順によって決まります。
スケジューラーは先頭一致戦略を採用しており、クレームの要件を満たす最初の利用可能なデバイスを選択します。

このため、プールとResourceSliceに付ける名前によって、リソース割り当ての優先度に影響を与えることができます。
なお、[バインディング条件](/docs/concepts/resource-management/dynamic-resource-allocation/how-dra-works/#device-binding-conditions)を持たないプールは、名前に関係なく、バインディング条件を持つプールよりも常に先に評価されることに注意してください。

`k8s.io/dynamic-resources/kubeletplugin` Goパッケージ、またはそのモジュールに含まれるResourceSliceコントローラーを使用して構築されたドライバーでは、これらのコンポーネントがResourceSliceの名前付けを自動で処理し、ドライバーが指定した順序で評価されることを保証します。

## 管理者アクセス {#admin-access}

{{< feature-state feature_gate_name="DRAAdminAccess" >}}

ResourceClaimまたはResourceClaimTemplate内のrequestを、保守およびトラブルシューティングタスクのための特権機能を持つものとして指定できます。
管理者アクセスが有効なrequestは、使用中のデバイスにアクセスできるほか、デバイスをコンテナから利用できるようにする際に追加の権限が付与される場合があります:

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceClaimTemplate
metadata:
  name: large-black-cat-claim-template
spec:
  spec:
    devices:
      requests:
      - name: req-0
        exactly:
          deviceClassName: resource.example.com
          allocationMode: All
          adminAccess: true
```

管理者アクセスは特権モードであり、マルチテナントクラスターでは一般ユーザーに付与すべきではありません。
`resource.kubernetes.io/admin-access: "true"` (大文字と小文字は区別されます)のラベルが付いたNamespaceにおいて、ResourceClaimまたはResourceClaimTemplateオブジェクトを作成する権限を持つユーザーのみが`adminAccess`フィールドを使用できます。
これにより、管理者以外のユーザーがこの機能を不正に利用することを防ぎます。

管理者アクセスは`kube-apiserver`、`kube-scheduler`および`kubelet`の[`DRAAdminAccess`フィーチャーゲート](/docs/reference/command-line-tools-reference/feature-gates/#DRAAdminAccess)によって制御されます。


## リスト型属性 {#list-type-attributes}

{{< feature-state feature_gate_name="DRAListTypeAttributes" >}}

この機能によりResourceSlice APIが改善され、DRAドライバーはデバイス属性に対して、スカラー値だけでなくリスト値も指定できるようになります。
これは、CPUが複数のPCIeルートに隣接している場合など、より複雑なノード内部のトポロジーをモデル化する場合に役に立ちます。

ResourceClaimの作成者(エンドユーザー)にとって、これは`matchAttribute`と`distinctAttribute`がこのようなケースに対してより適切に機能するようになることを意味します。

- `matchAttribute` - 2つの属性は同一である必要はなく、*共通部分が空ではないリスト*でなければなりません(スカラー値は要素が1つだけのリストとして扱われます)。
  つまり、一方のドライバーがPCIeルートについての単一の値を公開し、もう一方のドライバーがリストを公開している場合、単一の値がリスト内のどこかに含まれていれば、この制約を満たします。
- `distinctAttribute` - 属性値は*互いに素*(どの2つのデバイス間でも共有される値がない)である必要があります。

ResourceClaimの作成者がリストの可能性がある属性をCEL式内で扱いやすくするため、この機能では`includes()` CEL関数も導入されています。

```
# スカラー属性(後方互換)
# 前提: device.attributes["dra.example.com"].model = "model-a"
device.attributes["dra.example.com"].model.includes("model-a")  # true
device.attributes["dra.example.com"].model.includes("model-b")  # false

# リスト型属性(DRAListTypeAttributesが必要)
# 前提: device.attributes["dra.example.com"].supported-models= ["model-a", "model-b"]
device.attributes["dra.example.com"].supported-models.includes("model-a")  # true
device.attributes["dra.example.com"].supported-models.includes("model-c")  # false
```

### DRAドライバー作成者向けの詳細 {#details-for-dra-driver-authors}

既定では、各`DeviceAttribute`は、ブール値、整数、文字列、セマンティックバージョン文字列のいずれか1つのスカラー値を保持します。
`DRAListTypeAttributes`フィーチャーゲートにより、4つのリスト型フィールドを持つように`DeviceAttribute`が拡張され、1つの属性に対して複数の値をデバイスから公開できるようになります:

- **`bools`** - ブール値のリスト
- **`ints`** - 64ビット整数値のリスト
- **`strings`** - 文字列のリスト(各文字列は最大64文字)
- **`versions`** - semver.org spec 2.0.0に準拠したセマンティックバージョン文字列のリスト(各文字列は最大64文字)

デバイス毎に指定できる各属性値の個数(スカラーフィールドとすべてのリスト要素の合計)は、**48個**までに制限されています。
ResourceSlice内のいずれかのデバイスがこの機能やtaintなどのその他の高度な機能を使用する場合、ResourceSliceに含めることができるデバイスは最大**64個**に制限されます。

以下は、リスト型の文字列属性を使用して、複数のサポートされるモデルを公開するデバイスの例です:


```yaml
kind: ResourceSlice
apiVersion: resource.k8s.io/v1
metadata:
  name: example-resourceslice
spec:
  nodeName: worker-1
  pool:
    name: pool
    generation: 1
    resourceSliceCount: 1
  driver: dra.example.com
  devices:
  - name: gpu-0
    attributes:
      dra.example.com/supported-models:
        strings:
        - model-a
        - model-b
```

リスト型属性は`kube-apiserver`と`kube-scheduler`の[`DRAListTypeAttributes`フィーチャーゲート](/docs/reference/command-line-tools-reference/feature-gates/#DRAListTypeAttributes)によって制御されます。

## 派生属性 {#derived-attributes}

{{< feature-state feature_gate_name="DRADerivedAttributes" >}}

`matchAttribute`制約と`distinctAttribute`制約は、通常、デバイスがまったく同一の名前で属性を公開している必要があります。
もしGPUドライバーが`pcie_locality`を公開し、NICドライバーが`pcie_root`を公開している場合(または、`numa0-pcie1`のような文字列に同じ情報を埋め込んでいる場合)、これらが同じものを表していることをスケジューラーが認識する方法はないため、はじめに共通の属性名を共有していない限り、2つのドライバーのデバイスを同じ場所に配置することはできません。

`derivedAttributes`を使用すると、ドライバーに対して共通の属性名が標準化されるのを待たずに、インラインでこのギャップの橋渡しができます。
リクエストの`.spec.devices.requests[].exactly`または`.spec.devices.requests[].firstAvailable[]`の下に、1つ以上の`derivedAttributes`エントリを追加します。
各エントリは、そのリクエストに対して候補となるすべてのデバイスをスケジューラーが評価するCEL式を定義します。
その結果は、ドライバーが提供するデバイス属性と同じように、`matchAttribute`制約または`distinctAttribute`制約から参照可能な仮想的な属性となります。

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceClaim
metadata:
  name: gpu-nic-numa-alignment
spec:
  devices:
    requests:
    - name: gpu
      exactly:
        deviceClassName: gpu.example.com
        count: 1
        derivedAttributes:
        - name: derived/numa
          expression: device.attributes["gpu.example.com"].numa
    - name: nic
      exactly:
        deviceClassName: nic.example.com
        count: 1
        derivedAttributes:
        - name: derived/numa
          expression: device.attributes["nic.example.com"].numaNode
    constraints:
    - requests: ["gpu", "nic"]
      matchAttribute: derived/numa
```

この例では、`gpu`と`nic`ドライバーは異なる属性名(`numa`と`numaNode`)でトポロジー情報を公開しています。
各リクエストは、自身のデバイス属性から共通の`derived/numa`値を計算します。
そして、元となるドライバーが共通の属性名について合意していなくても、`matchAttribute`制約は、この仮想属性によって2つのリクエストを揃えます。

`derivedAttributes`について、いくつか注意点があります:

- **名前付け**: `name`は、ドライバーが提供する属性名と同じ形式で、DNSサブドメインに続いて、`/`とC識別子を指定する必要があります(例えば`example.com/numaNode`や`derived/numaNode`)。
  ドライバーによってすでに公開されている属性と同じ名前を指定した場合、制約のマッチングでは、派生属性の値はドライバーが提供する属性を上書きします。
  意図しない上書きを避けたい場合は、`derived/`のようにどのドライバーも使用しないドメインプレフィックスを使用してください。
  1つのリクエストにつき、最大32個の派生属性が定義できます。
- **制約での使用必須**: すべての派生属性は、それが定義されたリクエスト(またはサブリクエスト)に適用される1つ以上の`matchAttribute`または`distinctAttribute`によって参照される必要があります。
  そうでない場合、ResourceClaimはバリデーションに失敗します。
- **評価範囲と順序**: `expression`は、リクエスト自身のCELセレクター(`.selectors[].cel`)がそのデバイスをフィルターした後に、候補となるデバイス毎に1回評価されます。
  そのため、派生属性はセレクター式から参照することはできず、CEL環境の`device.attributes`を通じて公開されることもありません。
- **戻り値の型**: `expression`はスカラー値(`string`、`int`、`bool`またはセマンティックバージョン)、または`DRAListTypeAttributes`フィーチャーゲートも有効になっている場合は、これらのスカラー型の1つのリストである必要があります。
- **コスト制限**: 各式には、最大長と推定されたCELの評価コストの上限があります。
  それに加えて、ResourceClaimに含まれるすべての`derivedAttributes`式の推定コストの合計についても、1回のスケジューリングの試行で加えられる合計のオーバーヘッドを制限するために、上限が設定されています。
  これらの上限値のいずれかを超えると、ResourceClaimは拒否されます。
- **ランタイムエラーによるスケジューリングの中止**: 例えばデバイスに存在しない属性を参照した場合など、候補となるデバイスに対する式の評価に失敗すると、そのデバイスを黙ってスキップするのではなく、スケジューラーは割り当てを中止し、Podはスケジューリングに失敗します。
  例えば属性を読み取る前にその属性が存在することを確認するなど、防御的に式を記述してください。

派生属性は、`kube-apiserver`と`kube-scheduler`の[`DRADerivedAttributes`フィーチャーゲート](/docs/reference/command-line-tools-reference/feature-gates/#DRADerivedAttributes)によって制御されます。

DRAドライバーが公開できる標準的なデバイス属性の一覧については、[標準デバイス属性](/docs/reference/node/dra-standard-device-attributes/)を参照してください。

## DRAによる拡張リソース割り当て {#extended-resource}

{{< feature-state feature_gate_name="DRAExtendedResource" >}}

DeviceClassには、拡張リソース名を指定できます。
この時スケジューラーは、拡張リソース要求に対してクラスが合致するデバイスを選択します。
これにより、デバイスプラグインによって提供される拡張リソースまたはDRAデバイスのいずれかを要求するために、ユーザーは引き続き拡張リソース要求を使用することができます。
同じ拡張リソースは、1つのクラスターノード上では、デバイスプラグインまたはDRAのいずれかによって提供できます。
同じ拡張リソースは、あるノード上ではデバイスプラグインによって、同じクラスターの他のノード上ではDRAによって提供できます。

以下の例では、DeviceClassは`example.com/gpu`というextendedResourceNameによって与えられています。
Podが拡張リソース`example.com/gpu: 2`を要求すると、DeviceClassに一致するデバイスを2つ以上持つノードにスケジューリングされます。

```yaml
apiVersion: resource.k8s.io/v1
kind: DeviceClass
metadata:
  name: gpu.example.com
spec:
  selectors:
  - cel:
      expression: device.driver == 'gpu.example.com' && device.attributes['gpu.example.com'].type
        == 'gpu'
  extendedResourceName: example.com/gpu
```

さらにユーザーは、ResourceClaimを明示的に作成することなく、特殊な拡張リソースを使用してデバイスを割り当てることができます。
拡張リソース名のプレフィックス`deviceclass.resource.kubernetes.io/`とDeviceClass名を使用します。
これは、拡張リソース名を指定しない場合であっても、任意のDeviceClassに対して機能します。
作成されるResourceClaimには、そのDeviceClassの指定された数のデバイスに対する`ExactCount`の要求が含まれます。

DRAによる拡張リソースの割り当ては、`kube-apiserver`、`kube-scheduler`、`kube-controller-manager`、および`kubelet`の[`DRAExtendedResource`フィーチャーゲート](/docs/reference/command-line-tools-reference/feature-gates/#DRAExtendedResource)によって制御されます。

拡張リソースを要求する一連の流れのハンズオンについては、[コンテナに拡張リソースを割り当てる](/docs/tasks/configure-pod-container/extended-resource/)を参照してください。
