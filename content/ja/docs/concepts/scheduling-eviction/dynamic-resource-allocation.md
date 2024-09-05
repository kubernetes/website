---
title: 動的リソース割り当て
content_type: concept
weight: 65
---

<!-- overview -->

構造化パラメーターを用いたコアのDynamic Resource Allocation:

{{< feature-state feature_gate_name="DynamicResourceAllocation" >}}

コントロールプレーンコントローラーを用いたDynamic Resource Allocation:

{{< feature-state feature_gate_name="DRAControlPlaneController" >}}

動的なリソース割り当ては、PodとPod内のコンテナ間でリソースを要求および共有するためのAPIです。
これは、汎用リソース用の永続ボリュームAPIを一般化したものです。
通常、これらのリソースはGPUなどのデバイスです。

サードパーティのリソースドライバーは、リソースの追跡と準備を行い、リソースの割り当ては _構造化パラメーター_ (Kubernetes 1.30で導入)を介してKubernetesによって処理されます。
さまざまな種類のリソースが、要求と初期化を定義するための任意のパラメーターをサポートします。

ドライバーが _コントロールプレーンコントローラー_ を提供する場合、ドライバー自体がKubernetesスケジューラーと連携して割り当てを処理します。

## {{% heading "prerequisites" %}}

Kubernetes v{{< skew currentVersion >}}には、動的リソース割り当てに関するクラスターレベルのAPIサポートが含まれていますが、明示的に[有効化する必要があります](#enabling-dynamic-resource-allocation)。
また、このAPIを使用して管理する特定のリソースのリソースドライバーもインストールする必要があります。
Kubernetes v{{< skew currentVersion >}}を実行していない場合は、そのバージョンのKubernetesのドキュメントを確認してください。

<!-- body -->

## API

`resource.k8s.io/v1alpha3` {{< glossary_tooltip text="APIグループ" term_id="api-group" >}} は次のタイプを提供します:

ResourceClaim
: ワークロードによって使用される、クラスター内のリソースへのアクセス要求を記述します。
  たとえば、ワークロードが特定のプロパティを持つアクセラレーターデバイスを必要とする場合、その要求はこのように表現されます。
  ステータススタンザは、この要求が満たされたかどうかと、どのリソースが割り当てられたかを追跡します。

ResourceClaimTemplate
: ResourceClaimを作成するための仕様とメタデータを定義します。
  ユーザーがワークロードをデプロイするときに作成されます。
  PodごとのResourceClaimは、Kubernetesによって自動的に作成および削除されます。

DeviceClass
: 特定のデバイスとそれらの構成に対する事前定義の選択基準が含まれています。
  DeviceClassは、リソースドライバーをインストールするときにクラスター管理者によって作成されます。
  ResourceClaim内でデバイスを割り当てる各要求は、正確に1つのDeviceClassを参照する必要があります。

PodSchedulingContext
: ResourceClaimをPodに割り当てる必要があり、それらのResourceClaimがコントロールプレーンコントローラーを使用する場合に、Podのスケジューリングを調整するために、コントロールプレーンとリソースドライバーによって内部的に使用されます。

ResourceSlice
: クラスター内で使用可能なリソースに関する情報を公開するために、構造化パラメーターとともに使用します。

リソースドライバーの開発者は、コントロールプレーンコントローラーを使用して割り当てを処理するか、代わりに構造化パラメーターを使用してKubernetesを介した割り当てに依存するかを決定します。
カスタムコントローラーは柔軟性が高い一方で、クラスターの自動スケーリングがノードのローカルリソースに対して確実に機能しない可能性があります。
構造化パラメーターはクラスターの自動スケーリングを可能にしますが、すべてのユースケースを満たすわけではありません。

ドライバーが構造化パラメーターを使用する場合、デバイスを選択するためのすべてのパラメーターは、Kubrnetes本体に組み込まれたResourceClaimおよびDeviceClass内で定義されます。
構成パラメーターは任意のJSONオブジェクトとして埋め込むことができます。

`core/v1` `PodSpec`は、`ResourceClaim`フィールド内でPodに必要なResourceClaimを定義します。
このリスト内のエントリは、ResourceClaimまたはResourceClaimTemplateを参照します。
ResourceClaimを参照する場合、このPodSpecを使用するすべてのPod(例えば、DeploymentまたはStatefulSet内)は、同じResourceClaimインスタンスを共有します。
ResourceClaimTemplateを参照する場合、各Podには独自のインスタンスが割り当てられます。

コンテナリソースの`resources.claims`リストは、コンテナがこれらのリソースインスタンスにアクセスできるかどうかを定義します。
これにより、1つ以上のコンテナ間でリソースを共有することが可能になります。

以下は、架空のリソースドライバーの例です。
このPodに対して2つのResourceClaimオブジェクトが作成され、各コンテナがそれぞれ1つにアクセスできます。

```yaml
apiVersion: resource.k8s.io/v1alpha3
kind: DeviceClass
name: resource.example.com
spec:
  selectors:
  - cel:
      expression: device.driver == "resource-driver.example.com"
---
apiVersion: resource.k8s.io/v1alpha2
kind: ResourceClaimTemplate
metadata:
  name: large-black-cat-claim-template
spec:
  spec:
    devices:
      requests:
      - name: req-0
        deviceClassName: resource.example.com
        selectors:
        - cel:
           expression: |-
              device.attributes["resource-driver.example.com"].color == "black" &&
              device.attributes["resource-driver.example.com"].size == "large"
–--
apiVersion: v1
kind: Pod
metadata:
  name: pod-with-cats
spec:
  containers:
  - name: container0
    image: ubuntu:20.04
    command: ["sleep", "9999"]
    resources:
      claims:
      - name: cat-0
  - name: container1
    image: ubuntu:20.04
    command: ["sleep", "9999"]
    resources:
      claims:
      - name: cat-1
  ResourceClaim:
  - name: cat-0
    resourceClaimTemplateName: large-black-cat-claim-template
  - name: cat-1
    resourceClaimTemplateName: large-black-cat-claim-template
```

## スケジューリング

### コントロールプレーンコントローラーを使用する

ネイティブリソース(CPU、RAM)と拡張リソース(デバイスプラグインによって管理され、kubeletによってアドバタイズされる)とは異なり、構造化パラメーターがない場合、スケジューラーはクラスター内の使用可能な動的リソースや、特定のResourceClaimの要件を満たすためにどのように分割できるかについて知識がありません。
リソースドライバーがその責任を持ちます。
ResourceClaimはリソースが予約されると「割り当て済み」としてマークされます。
これにより、スケジューラーはResourceClaimが使用可能であるクラスター内の場所を知ることができます。

Podがスケジュールされると、スケジューラーはPodに必要なすべてのResourceClaimをチェックし、PodSchedulingオブジェクトを作成して、それらのResourceClaimに関連するリソースドライバーにスケジューラーが適していると判断したノードについて通知します。
リソースドライバーは、ドライバーのリソースが十分に残っていないノードを除外することで応答します。
スケジューラーがその情報を取得すると、ノードを1つ選択し、その選択をPodSchedulingオブジェクトに保存します。
リソースドライバーはその後、リソースがそのノードで使用できるようにResourceClaimを割り当てます。
それが完了すると、Podがスケジュールされます。

このプロセスの一環として、ResourceClaimもPodのために予約されます。
現在、ResourceClaimは単一のPodまたは無制限の数のPodによって排他的に使用できます。

重要な機能の1つは、すべてのリソースが割り当てられて、予約されない限り、Podがノードにスケジュールされないことです。
これにより、Podが1つのノードにスケジュールされ、そのノードで実行できないというシナリオが回避されます。
このような保留中のPodは、RAMやCPUなどの他のすべてのリソースもブロックするため、問題が発生します。

{{< note >}}

ResourceClaimを使用するPodのスケジューリングは、追加の通信が必要となるため遅くなります。
一度に1つのPodしかスケジュールされず、ResourceClaimでPodを処理するときにAPI呼び出しをブロックすることになり、次のPodのスケジュールが遅延するため、ResourceClaimを使用しないPodにも影響する可能性があることに注意してください。

{{< /note >}}

### 構造化パラメーターを使用する

ドライバーが構造化パラメーターを使用する場合、Podがリソースを必要とするたびに、スケジューラーがResourceClaimにリソースを割り当てる責任を引き継ぎます。
これは、ResourceSliceオブジェクトから使用可能なリソースの完全なリストを取得し、既存のResourceClaimに割り当てられているリソースを追跡し、これらの残存リソースから選択することによって行われます。

現時点でサポートされているリソースの種類はデバイスのみです。
デバイスインスタンスは、名前といくつかの属性とキャパシティを持ちます。
デバイスは、それらの属性とキャパシティをチェックするCEL式を通じて選択されます。
さらに、選択されたデバイスのセットを、特定の制約を満たすセットに制限することもできます。

選択されたリソースはベンダー固有の構成とともにResourceClaimのステータスに記録されるため、Podがノード上で起動しようとすると、ノード上のリソースドライバーはリソースを準備するために必要なすべての情報を持ちます。

構造化パラメーターを使用することで、スケジューラーは任意のDRAリソースドライバーと通信せずに決定を下すことができます。
またResourceClaimの割り当てに関する情報をメモリに保持し、Podをノードにバインドする際にバックエンドでこの情報をResourceClaimオブジェクトに書き込むことで、複数のPodを迅速にスケジュールすることができます。

## リソースの監視

kubeletは、実行中のPodの動的リソースの検出を可能にするgRPCサービスを提供します。
gRPCエンドポイントに関する詳細については、[リソース割り当てレポート](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources)を参照してください。

## 事前スケジュールされたPod

あなた、または他のAPIクライアントが、`spec.nodeName`がすでに設定されているPodを作成すると、スケジューラーはバイパスされます。
そのPodに必要なResourceClaimがまだ存在しない場合や、Podに割り当てられていない、またはPodのために予約されていない場合、kubeletはPodの実行に失敗し、それらの要件が後に満たされる可能性があるため定期的に再チェックを行います。

このような状況は、Podがスケジュールされた時点でスケジューラーに動的リソース割り当てのサポートが有効になっていなかった場合にも発生します(バージョンスキュー、構成、フィーチャーゲートなど)。
kube-controller-managerはこれを検出し、必要なResourceClaimの割り当てや予約をトリガーすることで、Podを実行可能にしようとします。

{{< note >}}

これは、構造化パラメーターを使用しないリソースドライバーにのみ適用されます。

{{< /note >}}

ノードに割り当てられたPodは通常のリソース(RAM、CPU)をブロックし、そのPodがスタックしている間は他のPodで使用できなくなるため、スケジューラーのバイパスは避けることが望ましいです。
Podを通常のスケジューリングフローを通して特定のノード上で実行するには、目的のノードと完全に一致するノードセレクターを使用してPodを作成します:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-with-cats
spec:
  nodeSelector:
    kubernetes.io/hostname: name-of-the-intended-node
  ...
```

また、アドミッション時に入力されるPodの`.spec.nodeName`フィールドを解除し、代わりにノードセレクターを使用することもできます。

## 動的リソース割り当ての有効化 {#enabling-dynamic-resource-allocation}

動的リソース割り当ては*アルファ機能*であり、`DynamicResourceAllocation`[フィーチャーゲート](/ja/docs/reference/command-line-tools-reference/feature-gates/)と`resource.k8s.io/v1alpha3` {{< glossary_tooltip text="APIグループ" term_id="api-group" >}}が有効になっている場合のみ有効になります。
詳細については、`--feature-gates`および`--runtime-config`[kube-apiserverパラメーター](/docs/reference/command-line-tools-reference/kube-apiserver/)を参照してください。
kube-scheduler、kube-controller-manager、kubeletもフィーチャーゲートが必要です。

リソースドライバーがコントロールプレーンコントローラーを使用する場合、`DynamicResourceAllocation`に加えて`DRAControlPlaneController`フィーチャーゲートを有効化する必要があります。

Kubernetesクラスターがこの機能をサポートしているかどうかを簡単に確認するには、次のコマンドを使用してDeviceClassオブジェクトをリストします:

```shell
kubectl get deviceclasses
```

クラスターが動的リソース割り当てをサポートしている場合、レスポンスはDeviceClassオブジェクトのリストか、次のように表示されます:

```
No resources found
```

サポートされていない場合、代わりに次のエラーが表示されます:

```
error: the server doesn't have a resource type "deviceclasses"
```

`spec.controller`フィールドが設定されているResourceClaimが作成可能な場合、コントロールプレーンコントローラーがサポートされます。
`DRAControlPlaneController`フィーチャーゲートが無効になっている場合、そのフィールドはResourceClaimを保存するときに自動的にクリアされます。

kube-schedulerのデフォルト構成では、フィーチャーゲートが有効でありv1構成APIを使用している場合にのみ「DynamicResources」プラグインが有効になります。
カスタム構成では、このプラグインを含めるように変更する必要があるかもしれません。

クラスターで機能を有効化するには、リソースドライバーもインストールする必要があります。
詳細については、ドライバーのドキュメントを参照してください。

## {{% heading "whatsnext" %}}

- 設計に関する詳細は、KEPの[Structured Parameters with Structured Parameters](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/4381-dra-structured-parameters)と[Dynamic Resource Allocation with Control Plane Controller](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/3063-dynamic-resource-allocation/README.md)を参照してください。
