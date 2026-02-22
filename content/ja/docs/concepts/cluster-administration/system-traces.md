---
title: Kubernetesシステムコンポーネントのトレース
content_type: concept
weight: 90
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.27" state="beta" >}}

システムコンポーネントのトレースは、クラスター内の処理のレイテンシーと処理間の関係性を記録します。

Kubernetesコンポーネントは、gRPCエクスポーターを使用して[OpenTelemetry Protocol](https://opentelemetry.io/docs/specs/otlp/)でトレースを出力し、[OpenTelemetry Collector](https://github.com/open-telemetry/opentelemetry-collector#-opentelemetry-collector)を使用してトレースバックエンドに収集およびルーティングできます。

<!-- body -->

## トレースの収集 {#trace-collection}

Kubernetesコンポーネントには、OTLPのトレースをエクスポートするための組み込みgRPCエクスポーターがあり、OpenTelemetry Collectorを使用する場合と使用しない場合の両方で利用できます。

トレースの収集とCollectorの使用に関する完全なガイドについては、[OpenTelemetry Collectorの使い方](https://opentelemetry.io/docs/collector/getting-started/)を参照してください。
ただし、Kubernetesコンポーネント固有の注意点がいくつかあります。

デフォルトでは、KubernetesコンポーネントはOTLPのgRPCエクスポーターを使用して、[IANA OpenTelemetryポート](https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml?search=opentelemetry)である4317番ポートでトレースをエクスポートします。
例えば、CollectorがKubernetesコンポーネントのサイドカーとして実行されている場合、以下のレシーバー設定でスパンを収集し、標準出力にログを出力します:

```yaml
receivers:
  otlp:
    protocols:
      grpc:
exporters:
  # このエクスポーターをバックエンド用のエクスポーターに置き換えてください
  exporters:
    debug:
      verbosity: detailed
service:
  pipelines:
    traces:
      receivers: [otlp]
      exporters: [debug]
```

Collectorを使用せずにバックエンドに直接トレースを出力するには、Kubernetesトレース設定ファイルの`endpoint`フィールドに目的のトレースバックエンドアドレスを指定します。
この方法ではCollectorが不要になり、全体的な構成がシンプルになります。

認証情報を含むトレースバックエンドのヘッダー設定については、`OTEL_EXPORTER_OTLP_HEADERS`環境変数を使用できます。
詳細は[OTLPエクスポーターの設定](https://opentelemetry.io/docs/languages/sdk-configuration/otlp-exporter/)を参照してください。

また、Kubernetesクラスター名、名前空間、Pod名などのトレースリソース属性の設定には、`OTEL_RESOURCE_ATTRIBUTES`環境変数を使用できます。
詳細は[OTLP Kubernetesリソース](https://opentelemetry.io/docs/specs/semconv/resource/k8s/)を参照してください。

## コンポーネントのトレース {#component-traces}

### kube-apiserverのトレース {#kube-apiserver-traces}

kube-apiserverは、受信HTTPリクエスト、およびWebhook、etcd、再入リクエストへの送信リクエストに対してスパンを生成します。
kube-apiserverは送信リクエストで[W3C Trace Context](https://www.w3.org/TR/trace-context/)を伝播しますが、kube-apiserverは多くの場合パブリックエンドポイントであるため、受信リクエストに付加されたトレースコンテキストは使用しません。

#### kube-apiserverでのトレースの有効化 {#enabling-tracing-in-the-kube-apiserver}

トレースを有効にするには、`--tracing-config-file=<設定ファイルのパス>`でkube-apiserverにトレース設定ファイルを提供します。
以下は、10000リクエストに1つの割合でスパンを記録し、デフォルトのOpenTelemetryエンドポイントを使用する設定の例です:

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: TracingConfiguration
# default value
#endpoint: localhost:4317
samplingRatePerMillion: 100
```

`TracingConfiguration`構造体の詳細については、[APIサーバー設定API (v1)](/docs/reference/config-api/apiserver-config.v1/#apiserver-k8s-io-v1-TracingConfiguration)を参照してください。

### kubeletのトレース {#kubelet-traces}

{{< feature-state feature_gate_name="KubeletTracing" >}}

kubeletのCRIインターフェースと認証済みHTTPサーバーは、トレーススパンを生成するように計装されています。
apiserverと同様に、エンドポイントとサンプリングレートは設定可能です。
トレースコンテキストの伝播も設定されています。
親スパンのサンプリング決定は常に尊重されます。
指定されたトレース設定のサンプリングレートは、親を持たないスパンに適用されます。
エンドポイントを設定せずに有効にした場合、デフォルトのOpenTelemetry Collectorレシーバーアドレス「localhost:4317」が設定されます。

#### kubeletでのトレースの有効化 {#enabling-tracing-in-the-kubelet}

トレースを有効にするには、[トレース設定](https://github.com/kubernetes/component-base/blob/release-1.27/tracing/api/v1/types.go)を適用します。
以下は、10000リクエストに1つの割合でスパンを記録し、デフォルトのOpenTelemetryエンドポイントを使用するkubelet設定のスニペット例です:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
tracing:
  # default value
  #endpoint: localhost:4317
  samplingRatePerMillion: 100
```

`samplingRatePerMillion`を100万(`1000000`)に設定すると、すべてのスパンがエクスポーターに送信されます。

Kubernetes v{{< skew currentVersion >}}のkubeletは、ガベージコレクション、Pod同期ルーチン、およびすべてのgRPCメソッドからスパンを収集します。
kubeletはgRPCリクエストでトレースコンテキストを伝播するため、CRI-Oやcontainerdなどのトレースインストルメンテーションをサポートするコンテナランタイムは、kubeletからのトレースコンテキストに関連付けてエクスポートされたスパンを作成できます。
結果として得られるトレースには、kubeletとコンテナランタイムのスパン間の親子リンクが含まれ、ノードの問題をデバッグする際に役立つコンテキストを提供します。

スパンのエクスポートには、システム全体の設定に応じて、ネットワークとCPU側で常に小さなパフォーマンスオーバーヘッドが発生することに注意してください。
トレースが有効なクラスターでそのような問題が発生した場合は、`samplingRatePerMillion`を減らすか、設定を削除してトレースを完全に無効にすることで問題を軽減してください。

## 安定性 {#stability}

トレースインストルメンテーションはまだ活発に開発中であり、さまざまな形で変更される可能性があります。
これには、スパン名、付加された属性、計測対象のエンドポイントなどが含まれます。
この機能がStableに昇格するまで、トレースインストルメンテーションの後方互換性は保証されません。

## {{% heading "whatsnext" %}}

* [OpenTelemetry Collectorの使い方](https://opentelemetry.io/docs/collector/getting-started/)について読む
* [OTLPエクスポーターの設定](https://opentelemetry.io/docs/languages/sdk-configuration/otlp-exporter/)について読む
