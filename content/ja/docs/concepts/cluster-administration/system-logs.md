---
title: システムログ
content_type: concept
weight: 80
---

<!-- overview -->

システムコンポーネントのログは、クラスター内で起こったイベントを記録します。このログはデバッグのために非常に役立ちます。ログのverbosityを設定すると、ログをどの程度詳細に見るのかを変更できます。ログはコンポーネント内のエラーを表示する程度の荒い粒度にすることも、イベントのステップバイステップのトレース(HTTPのアクセスログ、Podの状態の変更、コントローラーの動作、スケジューラーの決定など)を表示するような細かい粒度に設定することもできます。

<!-- body -->

## klog

klogは、Kubernetesのログライブラリです。[klog](https://github.com/kubernetes/klog)は、Kubernetesのシステムコンポーネント向けのログメッセージを生成します。

klogの設定に関する詳しい情報については、[コマンドラインツールのリファレンス](/docs/reference/command-line-tools-reference/)を参照してください。

klogネイティブ形式の例:

```
I1025 00:15:15.525108       1 httplog.go:79] GET /api/v1/namespaces/kube-system/pods/metrics-server-v0.3.1-57c75779f-9p8wg: (1.512ms) 200 [pod_nanny/v0.0.0 (linux/amd64) kubernetes/$Format 10.56.1.19:51756]
```

### 構造化ログ

{{< feature-state for_k8s_version="v1.19" state="alpha" >}}

{{< warning >}}
構造化ログへのマイグレーションは現在進行中の作業です。このバージョンでは、すべてのログメッセージが構造化されているわけではありません。ログファイルをパースする場合、JSONではないログの行にも対処しなければなりません。

ログの形式と値のシリアライズは変更される可能性があります。
{{< /warning>}}

構造化ログは、ログメッセージに単一の構造を導入し、プログラムで情報の抽出ができるようにするものです。構造化ログは、僅かな労力とコストで保存・処理できます。新しいメッセージ形式は後方互換性があり、デフォルトで有効化されます。

構造化ログの形式:

```ini
<klog header> "<message>" <key1>="<value1>" <key2>="<value2>" ...
```

例:

```ini
I1025 00:15:15.525108       1 controller_utils.go:116] "Pod status updated" pod="kube-system/kubedns" status="ready"
```


### JSONログ形式

{{< feature-state for_k8s_version="v1.19" state="alpha" >}}

{{<warning >}}
JSONの出力は多数の標準のklogフラグをサポートしていません。非対応のklogフラグの一覧については、[コマンドラインツールリファレンス](/docs/reference/command-line-tools-reference/)を参照してください。

すべてのログがJSON形式で書き込むことに対応しているわけではありません(たとえば、プロセスの開始時など)。ログのパースを行おうとしている場合、JSONではないログの行に対処できるようにしてください。

フィールド名とJSONのシリアライズは変更される可能性があります。
{{< /warning >}}

`--logging-format=json`フラグは、ログの形式をネイティブ形式klogからJSON形式に変更します。以下は、JSONログ形式の例(pretty printしたもの)です。

```json
{
   "ts": 1580306777.04728,
   "v": 4,
   "msg": "Pod status updated",
   "pod":{
      "name": "nginx-1",
      "namespace": "default"
   },
   "status": "ready"
}
```

特別な意味を持つキー:
* `ts` - Unix時間のタイムスタンプ(必須、float)
* `v` - verbosity (必須、int、デフォルトは0)
* `err` - エラー文字列 (オプション、string)
* `msg` - メッセージ (必須、string)

現在サポートされているJSONフォーマットの一覧:
* {{< glossary_tooltip term_id="kube-controller-manager" text="kube-controller-manager" >}}
* {{< glossary_tooltip term_id="kube-apiserver" text="kube-apiserver" >}}
* {{< glossary_tooltip term_id="kube-scheduler" text="kube-scheduler" >}}
* {{< glossary_tooltip term_id="kubelet" text="kubelet" >}}

### ログのサニタイズ

{{< feature-state for_k8s_version="v1.20" state="alpha" >}}

{{<warning >}}
ログのサニタイズ大きな計算のオーバーヘッドを引き起こす可能性があるため、本番環境では有効にするべきではありません。
{{< /warning >}}

`--experimental-logging-sanitization`フラグはklogのサニタイズフィルタを有効にします。有効にすると、すべてのログの引数が機密データ(パスワード、キー、トークンなど)としてタグ付けされたフィールドについて検査され、これらのフィールドのログの記録は防止されます。

現在ログのサニタイズをサポートしているコンポーネント一覧:
* kube-controller-manager
* kube-apiserver
* kube-scheduler
* kubelet

{{< note >}}
ログのサニタイズフィルターは、ユーザーのワークロードのログが機密データを漏洩するのを防げるわけではありません。
{{< /note >}}

### ログのverbosityレベル

`-v`フラグはログのverbosityを制御します。値を増やすとログに記録されるイベントの数が増えます。値を減らすとログに記録されるイベントの数が減ります。verbosityの設定を増やすと、ますます多くの深刻度の低いイベントをログに記録するようになります。verbosityの設定を0にすると、クリティカルなイベントだけをログに記録します。

### ログの場所

システムコンポーネントには2種類あります。コンテナ内で実行されるコンポーネントと、コンテナ内で実行されないコンポーネントです。たとえば、次のようなコンポーネントがあります。

* Kubernetesのスケジューラーやkube-proxyはコンテナ内で実行されます。
* kubeletやDockerのようなコンテナランタイムはコンテナ内で実行されません。

systemdを使用しているマシンでは、kubeletとコンテナランタイムはjournaldに書き込みを行います。それ以外のマシンでは、`/var/log`ディレクトリ内の`.log`ファイルに書き込みます。コンテナ内部のシステムコンポーネントは、デフォルトのログ機構をバイパスするため、常に`/var/log`ディレクトリ内の`.log`ファイルに書き込みます。コンテナのログと同様に、`/var/log`ディレクトリ内のシステムコンポーネントのログはローテートする必要があります。`kube-up.sh`スクリプトによって作成されたKubernetesクラスターでは、ログローテーションは`logrotate`ツールで設定されます。`logrotate`ツールはログを1日ごとまたはログのサイズが100MBを超えたときにローテートします。

## {{% heading "whatsnext" %}}

* [Kubernetesのログのアーキテクチャ](/docs/concepts/cluster-administration/logging/)について読む。
* [構造化ログ](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/1602-structured-logging)について読む。
* [ログの深刻度の慣習](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/logging.md)について読む。
