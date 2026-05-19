---
content_type: concept
title: 監査
---

<!-- overview -->

Kubernetesの監査はクラスター内の一連の行動を記録するセキュリティに関連した時系列の記録を提供します。
クラスターはユーザー、Kubernetes APIを使用するアプリケーション、
およびコントロールプレーン自体によって生成されたアクティビティなどを監査します。

監査により、クラスター管理者は以下の質問に答えることができます:

 - 何が起きたのか？
 - いつ起こったのか？
 - 誰がそれを始めたのか？
 - 何のために起こったのか？
 - それはどこで観察されたのか？
 - それはどこから始まったのか？
 - それはどこへ向かっていたのか？

<!-- body -->

監査記録のライフサイクルは[kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/)コンポーネントの中で始まります。
各リクエストの実行の各段階で、監査イベントが生成されます。
ポリシーに従って前処理され、バックエンドに書き込まれます。 ポリシーが何を記録するかを決定し、
バックエンドがその記録を永続化します。現在のバックエンドの実装はログファイルやWebhookなどがあります。

各リクエストは関連する _stage_ で記録されます。
定義されたステージは以下の通りです:

- `RequestReceived` - 監査ハンドラーがリクエストを受信すると同時に生成されるイベントのステージ。
  つまり、ハンドラーチェーンに委譲される前に生成されるイベントのステージです。
- `ResponseStarted` - レスポンスヘッダーが送信された後、レスポンスボディが送信される前のステージです。
  このステージは長時間実行されるリクエスト(watchなど)でのみ発生します。
- `ResponseComplete` - レスポンスボディの送信が完了して、それ以上のバイトは送信されません。
- `Panic` - パニックが起きたときに発生するイベント。

{{< note >}}
[Audit Event configuration](/docs/reference/config-api/apiserver-audit.v1/#audit-k8s-io-v1-Event)の設定は[Event](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#event-v1-core)APIオブジェクトとは異なります。
{{< /note >}}

監査ログ機能は、リクエストごとに監査に必要なコンテキストが保存されるため、APIサーバーのメモリー消費量が増加します。
メモリーの消費量は、監査ログ機能の設定によって異なります。

## 監査ポリシー

監査ポリシーはどのようなイベントを記録し、どのようなデータを含むべきかについてのルールを定義します。
監査ポリシーのオブジェクト構造は、[`audit.k8s.io` API group](/docs/reference/config-api/apiserver-audit.v1/#audit-k8s-io-v1-Policy)で定義されています。

イベントが処理されると、そのイベントは順番にルールのリストと比較されます。
最初のマッチングルールは、イベントの監査レベルを設定します。

定義されている監査レベルは:

- `None` - ルールに一致するイベントを記録しません。
- `Metadata` - リクエストのメタデータ(リクエストしたユーザー、タイムスタンプ、リソース、動作など)を記録しますが、リクエストやレスポンスのボディは記録しません。
- `Request` - ログイベントのメタデータとリクエストボディは表示されますが、レスポンスボディは表示されません。
  これは非リソースリクエストには適用されません。
- `RequestResponse` - イベントのメタデータ、リクエストとレスポンスのボディを記録しますが、
  非リソースリクエストには適用されません。

`audit-policy-file`フラグを使って、ポリシーを記述したファイルを `kube-apiserver`に渡すことができます。
このフラグが省略された場合イベントは記録されません。
監査ポリシーファイルでは、`rules`フィールドが必ず指定されることに注意してください。
ルールがない(0)ポリシーは不当なものとして扱われます。

以下は監査ポリシーファイルの例です:

{{% codenew file="audit/audit-policy.yaml" %}}

最小限の監査ポリシーファイルを使用して、すべてのリクエストを `Metadata`レベルで記録することができます。

```yaml
# Log all requests at the Metadata level.
apiVersion: audit.k8s.io/v1
kind: Policy
rules:
- level: Metadata
```

独自の監査プロファイルを作成する場合は、Google Container-Optimized OSの監査プロファイルを出発点として使用できます。
監査ポリシーファイルを生成する[configure-helper.sh](https://github.com/kubernetes/kubernetes/blob/master/cluster/gce/gci/configure-helper.sh)スクリプトを確認することができます。
スクリプトを直接見ることで、監査ポリシーファイルのほとんどを見ることができます。

また、定義されているフィールドの詳細については、[Policy` configuration reference](/docs/reference/config-api/apiserver-audit.v1/#audit-k8s-io-v1-Policy)を参照できます。

## 監査バックエンド

監査バックエンドは監査イベントを外部ストレージに永続化します。
kube-apiserverには2つのバックエンドが用意されています。

- イベントをファイルシステムに書き込むログバックエンド
- 外部のHTTP APIにイベントを送信するWebhookバックエンド

いずれの場合も、監査イベントはKubernetes API[`audit.k8s.io` API group](/docs/reference/config-api/apiserver-audit.v1/#audit-k8s-io-v1-Event)で定義されている構造に従います。


{{< note >}}
パッチの場合、リクエストボディはパッチ操作を含むJSON配列であり、適切なKubernetes APIオブジェクトを含むJSONオブジェクトではありません。
例えば、以下のリクエストボディは`/apis/batch/v1/namespaces/some-namespace/jobs/some-job-name`に対する有効なパッチリクエストです。

```json
[
  {
    "op": "replace",
    "path": "/spec/parallelism",
    "value": 0
  },
  {
    "op": "remove",
    "path": "/spec/template/spec/containers/0/terminationMessagePolicy"
  }
]
```

{{< /note >}}

### ログバックエンド

ログバックエンドは監査イベントを[JSONlines](https://jsonlines.org/)形式のファイルに書き込みます。
以下の `kube-apiserver` フラグを使ってログ監査バックエンドを設定できます。

- `--audit-log-path` は、ログバックエンドが監査イベントを書き込む際に使用するログファイルのパスを指定します。
  このフラグを指定しないと、ログバックエンドは無効になります。`-` は標準出力を意味します。
- `--audit-log-maxage` は、古い監査ログファイルを保持する最大日数を定義します。
- `audit-log-maxbackup`は、保持する監査ログファイルの最大数を定義します。
- `--audit-log-maxsize` は、監査ログファイルがローテーションされるまでの最大サイズをメガバイト単位で定義します。

クラスターのコントロールプレーンでkube-apiserverをPodとして動作させている場合は、監査記録が永久化されるように、ポリシーファイルとログファイルの場所に`hostPath`をマウントすることを忘れないでください。
例えば:

```yaml
  - --audit-policy-file=/etc/kubernetes/audit-policy.yaml
  - --audit-log-path=/var/log/kubernetes/audit/audit.log
```

それからボリュームをマウントします:
```yaml
...
volumeMounts:
  - mountPath: /etc/kubernetes/audit-policy.yaml
    name: audit
    readOnly: true
  - mountPath: /var/log/audit.log
    name: audit-log
    readOnly: false
```

最後に`hostPath`を設定します:
```yaml
...
volumes:
- name: audit
  hostPath:
    path: /etc/kubernetes/audit-policy.yaml
    type: File

- name: audit-log
  hostPath:
    path: /var/log/audit.log
    type: FileOrCreate
```

### Webhookバックエンド

Webhook監査バックエンドは、監査イベントをリモートのWeb APIに送信しますが、
これは認証手段を含むKubernetes APIの形式であると想定されます。

Webhook監査バックエンドを設定するには、以下のkube-apiserverフラグを使用します。

- `--audit-webhook-config-file` は、Webhookの設定ファイルのパスを指定します。
  webhookの設定は、事実上特化した[kubeconfig](/docs/tasks/access-application-cluster/configure-access-multiple-clusters)です。
- `--audit-webhook-initial-backoff` は、最初に失敗したリクエストの後、再試行するまでに待つ時間を指定します。
  それ以降のリクエストは、指数関数的なバックオフで再試行されます。

Webhookの設定ファイルは、kubeconfig形式でサービスのリモートアドレスと接続に使用する認証情報を指定します。

## イベントバッチ {#batching}

ログバックエンドとwebhookバックエンドの両方がバッチ処理をサポートしています。
webhookを例に、利用可能なフラグの一覧を示します。
ログバックエンドで同じフラグを取得するには、フラグ名の`webhook`を`log`に置き換えてください。
デフォルトでは、バッチングは`webhook`では有効で、`log`では無効です。
同様に、デフォルトではスロットリングは `webhook` で有効で、`log`では無効です。

- `--audit-webhook-mode` は、バッファリング戦略を定義します。以下のいずれかとなります。
  - `batch` - イベントをバッファリングして、非同期にバッチ処理します。これがデフォルトです。
  - `blocking` - 個々のイベントを処理する際に、APIサーバーの応答をブロックします。
  - `blocking-strict` - blockingと同じですが、RequestReceivedステージでの監査ログに失敗した場合は RequestReceivedステージで監査ログに失敗すると、kube-apiserverへのリクエスト全体が失敗します。

以下のフラグは `batch` モードでのみ使用されます:

- `--audit-webhook-batch-buffer-size`は、バッチ処理を行う前にバッファリングするイベントの数を定義します。
  入力イベントの割合がバッファをオーバーフローすると、イベントはドロップされます。
- `--audit-webhook-batch-max-size`は、1つのバッチに入れるイベントの最大数を定義します。
- `--audit-webhook-batch-max-wait`は、キュー内のイベントを無条件にバッチ処理するまでの最大待機時間を定義します。
- `--audit-webhook-batch-throttle-qps`は、1秒あたりに生成されるバッチの最大平均数を定義します。
- `--audit-webhook-batch-throttle-burst`は、許可された QPS が低い場合に、同じ瞬間に生成されるバッチの最大数を定義します。


## パラメーターチューニング

パラメーターは、APIサーバーの負荷に合わせて設定してください。

例えば、kube-apiserverが毎秒100件のリクエストを受け取り、それぞれのリクエストが`ResponseStarted`と`ResponseComplete`の段階でのみ監査されるとします。毎秒≅200の監査イベントが発生すると考えてください。
1つのバッチに最大100個のイベントがあるの場合、スロットリングレベルを少なくとも2クエリ/秒に設定する必要があります。
バックエンドがイベントを書き込むのに最大で5秒かかる場合、5秒分のイベントを保持するようにバッファーサイズを設定する必要があります。

10バッチ、または1000イベントとなります。

しかし、ほとんどの場合デフォルトのパラメーターで十分であり、手動で設定する必要はありません。
kube-apiserverが公開している以下のPrometheusメトリクスや、ログを見て監査サブシステムの状態を監視することができます。

- `apiserver_audit_event_total`メトリックには、エクスポートされた監査イベントの合計数が含まれます。
- `apiserver_audit_error_total`メトリックには、エクスポート中にエラーが発生してドロップされたイベントの総数が含まれます。

### ログエントリー・トランケーション {#truncate}

logバックエンドとwebhookバックエンドは、ログに記録されるイベントのサイズを制限することをサポートしています。

例として、logバックエンドで利用可能なフラグの一覧を以下に示します

- `audit-log-truncate-enabled`イベントとバッチの切り捨てを有効にするかどうかです。
- `audit-log-truncate-max-batch-size`バックエンドに送信されるバッチのバイト単位の最大サイズ。
- `audit-log-truncate-max-event-size`バックエンドに送信される監査イベントのバイト単位の最大サイズです。

デフォルトでは、`webhook`と`log`の両方で切り捨ては無効になっていますが、クラスター管理者は `audit-log-truncate-enabled`または`audit-webhook-truncate-enabled`を設定して、この機能を有効にする必要があります。

## {{% heading "whatsnext" %}}

* [Mutating webhook auditing annotations](/docs/reference/access-authn-authz/extensible-admission-controllers/#mutating-webhook-auditing-annotations).
* [`Event`](/docs/reference/config-api/apiserver-audit.v1/#audit-k8s-io-v1-Event)
* [`Policy`](/docs/reference/config-api/apiserver-audit.v1/#audit-k8s-io-v1-Policy)
