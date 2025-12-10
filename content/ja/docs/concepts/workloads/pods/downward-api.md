---
title: Downward API
content_type: concept
weight: 170
description: >
  Podやコンテナのフィールドを実行中のコンテナに公開する方法には2つあります。
  1つは環境変数で、もう1つは特殊なボリュームタイプによってファイルとして公開する方法です。
  これら2つの方法をまとめてDownward APIと呼びます。
---

<!-- overview -->

Kubernetesに過度に密結合することなく、コンテナが自分自身についての情報を持つことは有用な場合があります。
_downward API_ を用いることで、コンテナはKubernetesのクライアントやAPIサーバーを利用せずに、自分自身やクラスターに関する情報を取得することができます。

例として、特定の既知の環境変数に一意な識別子が格納されていることを前提とする既存のアプリケーションがあるとします。
一つの可能性は、アプリケーションをラップすることですが、これは煩雑でエラーが起こりやすく、疎結合という目標に反します。
より良い選択肢は、Pod名を識別子として使用し、Pod名をその既知の環境変数に注入することです。

Kubernetesでは、実行中のコンテナにPodおよびコンテナフィールドを公開する方法が2つあります:

* [環境変数](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)として
* [`downwardAPI`ボリューム内のファイル](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)として

これらPodおよびコンテナフィールドを公開する2つの方法を総称して、_downward API_ と呼びます。

<!-- body -->

## 利用可能なフィールド

Kubernetes APIフィールドのうち、downward APIを通じて利用可能なものは一部のみです。
このセクションでは、利用可能なフィールドを列挙します。

利用可能なPodレベルのフィールドからの情報は、`fieldRef`を使用して渡すことができます。
APIレベルでは、Podの`spec`は常に少なくとも1つの[Container](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container)を定義します。
利用可能なコンテナレベルのフィールドからの情報は、`resourceFieldRef`を使用して渡すことができます。

### `fieldRef`を通じて利用可能な情報 {#downwardapi-fieldRef}

一部のPodレベルフィールドについては、環境変数として、または`downwardAPI`ボリュームを使用して、コンテナに提供することができます。
どちらのメカニズムでも利用可能なフィールドは以下の通りです:

`metadata.name`
: Podの名前

`metadata.namespace`
: Podの{{< glossary_tooltip text="ネームスペース" term_id="namespace" >}}

`metadata.uid`
: Podの一意ID

`metadata.annotations['<KEY>']`
: `<KEY>`という名前のPodの{{< glossary_tooltip text="アノテーション" term_id="annotation" >}}の値(例: `metadata.annotations['myannotation']`)

`metadata.labels['<KEY>']`
: `<KEY>`という名前のPodの{{< glossary_tooltip text="ラベル" term_id="label" >}}のテキスト値(例: `metadata.labels['mylabel']`)

以下の情報は環境変数を通じて利用可能ですが、**downwardAPIボリュームのfieldRefとしては利用できません**:

`spec.serviceAccountName`
: Podの{{< glossary_tooltip text="サービスアカウント" term_id="service-account" >}}の名前

`spec.nodeName`
: Podが実行されている{{< glossary_tooltip term_id="node" text="ノード">}}の名前

`status.hostIP`
: Podが割り当てられているノードのプライマリIPアドレス

`status.hostIPs`
: `status.hostIP`のデュアルスタック版のIPアドレスで、最初のIPアドレスは常に`status.hostIP`と同じです

`status.podIP`
: PodのプライマリIPアドレス(通常、IPv4アドレス)

`status.podIPs`
: `status.podIP`のデュアルスタック版のIPアドレスで、最初のIPアドレスは常に`status.podIP`と同じです

以下の情報は`downwardAPI`ボリュームの`fieldRef`を通じて利用可能ですが、**環境変数としては利用できません**:

`metadata.labels`
: Podのすべてのラベルで、`label-key="escaped-label-value"`形式でフォーマットされ、1行に1つのラベルが記載されます

`metadata.annotations`
: Podのすべてのアノテーションで、`annotation-key="escaped-annotation-value"`形式でフォーマットされ、1行に1つのアノテーションが記載されます

### `resourceFieldRef`を通じて利用可能な情報 {#downwardapi-resourceFieldRef}

これらのコンテナレベルフィールドを使用すると、CPUやメモリなどのリソースの[要求と制限](/docs/concepts/configuration/manage-resources-containers/#requests-and-limits)に関する情報を提供することができます。

{{< note >}}
{{< feature-state feature_gate_name="InPlacePodVerticalScaling" >}}
コンテナのCPUとメモリリソースは、コンテナの実行中にリサイズすることができます。
この場合、downward APIボリュームは更新されますが、環境変数はコンテナが再起動されない限り更新されません。
詳細については、[コンテナに割り当てるCPUとメモリ容量を変更する](/docs/tasks/configure-pod-container/resize-container-resources/)を参照してください。
{{< /note >}}

`resource: limits.cpu`
: コンテナのCPU制限

`resource: requests.cpu`
: コンテナのCPU要求

`resource: limits.memory`
: コンテナのメモリ制限

`resource: requests.memory`
: コンテナのメモリ要求

`resource: limits.hugepages-*`
: コンテナのhugepages制限

`resource: requests.hugepages-*`
: コンテナのhugepages要求

`resource: limits.ephemeral-storage`
: コンテナの一時ストレージ制限

`resource: requests.ephemeral-storage`
: コンテナの一時ストレージ要求

#### リソース制限のフォールバック情報

コンテナにCPUとメモリの制限が指定されておらず、downward APIを使用してその情報を公開しようとする場合、kubeletは[ノード割り当て可能量](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)の計算に基づいて、CPUとメモリの最大割り当て可能値をデフォルトで公開します。

## {{% heading "whatsnext" %}}

[`downwardAPI`ボリューム](/docs/concepts/storage/volumes/#downwardapi)について詳しく読むことができます。

downward APIを使用してコンテナレベルまたはPodレベルの情報を公開することを試してみることができます:
* [環境変数](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)として
* [`downwardAPI`ボリューム内のファイル](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)として
