---
title: ノードの健全性を監視します
content_type: task
reviewers:
- ptux
weight: 20
---

<!-- overview -->

*Node Problem Detector*は、ノードの健全性を監視し、報告するためのデーモンです。
`Node Problem Detector`は`DaemonSet`として、あるいはスタンドアロンデーモンとして実行することができます。

`Node Problem Detector`は様々なデーモンからノードの問題に関する情報を収集し、これらの状態を[NodeCondition](/ja/docs/concepts/architecture/nodes/#condition)および[Event](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#event-v1-core)としてAPIサーバーにレポートします。
`Node Problem Detector`のインストール方法と使用方法については、[Node Problem Detectorプロジェクトドキュメント](https://github.com/kubernetes/node-problem-detector)を参照してください。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## 制限事項

* Node Problem Detectorは、ファイルベースのカーネルログのみをサポートします。
  `journald`のようなログツールはサポートされていません。

* Node Problem Detectorは、カーネルの問題を報告するためにカーネルログフォーマットを使用します。
  カーネルログフォーマットを拡張する方法については、[Add support for another log format](#support-other-log-format) を参照してください。

## ノード問題検出の有効化

クラウドプロバイダーによっては、`Node Problem Detector`を{{< glossary_tooltip text="Addon" term_id="addons" >}}として有効にしている場合があります。
また、`kubectl`を使って`Node Problem Detector`を有効にするか、`Addon pod`を作成することで有効にできます。

### kubectlを使用してNode Problem Detectorを有効化します {#using-kubectl}

`kubectl`は`Node Problem Detector`を最も柔軟に管理することができます。
デフォルトの設定を上書きして自分の環境に合わせたり、カスタマイズしたノードの問題を検出したりすることができます。
例えば:

1. `node-problem-detector.yaml`のような`Node Problem Detector`の設定を作成します:

   {{% codenew file="debug/node-problem-detector.yaml" %}}

   {{< note >}}
   システムログのディレクトリが、お使いのOSのディストリビューションに合っていることを確認する必要があります。
   {{< /note >}}

1. `Node Problem Detector`を`kubectl`で起動します。

   ```shell
   kubectl apply -f https://k8s.io/examples/debug/node-problem-detector.yaml
   ```

### Addon podを使用してNode Problem Detectorを有効化します {#using-addon-pod}

カスタムのクラスターブートストラップソリューションを使用していて、デフォルトの設定を上書きする必要がない場合は、`Addon Pod`を利用してデプロイをさらに自動化できます。
`node-problem-detector.yaml`を作成し、制御プレーンノードの`Addon Pod`のディレクトリ`/etc/kubernetes/addons/node-problem-detector`に設定を保存します。

## コンフィギュレーションを上書きします

`Node Problem Detector`の Dockerイメージをビルドする際に、[default configuration](https://github.com/kubernetes/node-problem-detector/tree/v0.1/config)が埋め込まれます。

[`ConfigMap`](/ja/docs/tasks/configure-pod-container/configure-pod-configmap/) を使用することで設定を上書きすることができます。


1. `config/` にある設定ファイルを変更します
1. `ConfigMap` `node-problem-detector-config`を作成します。

   ```shell
   kubectl create configmap node-problem-detector-config --from-file=config/
   ```

1. `node-problem-detector.yaml`を変更して、`ConfigMap`を使用するようにします。

   {{% codenew file="debug/node-problem-detector-configmap.yaml" %}}

1. 新しい設定ファイルで`Node Problem Detector`を再作成します。

   ```shell
   # If you have a node-problem-detector running, delete before recreating
   kubectl delete -f https://k8s.io/examples/debug/node-problem-detector.yaml
   kubectl apply -f https://k8s.io/examples/debug/node-problem-detector-configmap.yaml
   ```

{{< note >}}
この方法は `kubectl` で起動された Node Problem Detector にのみ適用されます。
{{< /note >}}

ノード問題検出装置がクラスターアドオンとして実行されている場合、設定の上書きはサポートされていません。
`Addon Manager`は、`ConfigMap`をサポートしていません。

## Kernel Monitor

*Kernel Monitor*は`Node Problem Detector`でサポートされるシステムログ監視デーモンです。
*Kernel Monitor*はカーネルログを監視し、事前に定義されたルールに従って既知のカーネル問題を検出します。
*Kernel Monitor*は[`config/kernel-monitor.json`](https://github.com/kubernetes/node-problem-detector/blob/v0.1/config/kernel-monitor.json)にある一連の定義済みルールリストに従ってカーネルの問題を照合します。
ルールリストは拡張可能です。設定を上書きすることで、ルールリストを拡張することができます。

### 新しいNodeConditionsの追加

新しい`NodeCondition`をサポートするには、例えば`config/kernel-monitor.json`の`conditions`フィールド内に条件定義を作成します。

```json
{
  "type": "NodeConditionType",
  "reason": "CamelCaseDefaultNodeConditionReason",
  "message": "arbitrary default node condition message"
}
```

### 新たな問題の発見

新しい問題を検出するために、`config/kernel-monitor.json`の`rules`フィールドを新しいルール定義で拡張することができます。

```json
{
  "type": "temporary/permanent",
  "condition": "NodeConditionOfPermanentIssue",
  "reason": "CamelCaseShortReason",
  "message": "regexp matching the issue in the kernel log"
}
```

### カーネルログデバイスのパスの設定 {#kernel-log-device-path}

ご使用のオペレーティングシステム(OS)ディストリビューションのカーネルログパスをご確認ください。
Linuxカーネルの[ログデバイス](https://www.kernel.org/doc/Documentation/ABI/testing/dev-kmsg)は通常`/dev/kmsg`として表示されます。
しかし、OSのディストリビューションによって、ログパスの位置は異なります。
`config/kernel-monitor.json`の`log`フィールドは、コンテナ内のログパスを表します。
`log`フィールドは、`Node Problem Detector`で見たデバイスパスと一致するように設定することができます。

### 別のログ形式をサポートします {#support-other-log-format}

Kernel monitorは[`Translator`](https://github.com/kubernetes/node-problem-detector/blob/v0.1/pkg/kernelmonitor/translator/translator.go)プラグインを使用して、カーネルログの内部データ構造を変換します。
新しいログフォーマット用に新しいトランスレータを実装することができます。

<!-- discussion -->

## 推奨・制限事項

ノードの健全性を監視するために、クラスターでNode Problem Detectorを実行することが推奨されます。
`Node Problem Detector`を実行する場合、各ノードで余分なリソースのオーバーヘッドが発生することが予想されます。

通常これは問題ありません。

* カーネルログは比較的ゆっくりと成長します。
* Node Problem Detector にはリソース制限が設定されています。
* 高負荷時であっても、リソースの使用は許容範囲内です。

詳細は`Node Problem Detector`[ベンチマーク結果](https://github.com/kubernetes/node-problem-detector/issues/2#issuecomment-220255629)を参照してください。
