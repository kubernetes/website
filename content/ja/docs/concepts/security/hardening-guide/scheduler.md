---
title: "堅牢化ガイド - スケジューラーの設定"
description: >
  Kubernetesスケジューラーのセキュリティ強化に関する情報。
content_type: concept
weight: 90
---

<!-- overview -->
Kubernetesの{{< glossary_tooltip text="スケジューラー" term_id="kube-scheduler" >}}は、{{< glossary_tooltip text="コントロールプレーン" term_id="control-plane" >}}の中のもっとも重要なコンポーネントの一つです。

このドキュメントでは、Kubernetesスケジューラーのセキュリティ体制を向上させる方法について説明します。

設定が不適切なスケジューラーは、セキュリティ上の脆弱性を引き起こす可能性があります。
このようなスケジューラーは、特定のノードをターゲットにして、そのノードおよびリソースを共有しているワークロードやアプリケーションを強制的に退避させることができます。
この設定は、脆弱性のあるオートスケーラーを標的とした[YoYo攻撃](https://arxiv.org/abs/2105.00542)に対する防御を強化するのにも役立ちます。

<!-- body -->
## kube-schedulerの設定 {#kube-scheduler-configuration}

### スケジューラーの認証/認可に関するコマンドラインオプション {#scheduler-authentication-authorization-command-line-options}

認証設定を構成する際には、kube-schedulerの認証方式がkube-api-serverの認証方式と整合性を保つように設定することが重要です。
認証ヘッダーが欠落しているリクエストがあった場合、[クラスター全体で認証方式を統一的に管理するために、kube-api-server経由で認証を行うようにしてください](/docs/tasks/extend-kubernetes/configure-aggregation-layer/#original-request-username-and-group)。

- `authentication-kubeconfig`: スケジューラーがAPIサーバーから認証設定オプションを取得できるよう、適切なkubeconfigを設定するようにしてください。この kubeconfig ファイルは、厳格なファイル権限で保護する必要があります。
- `authentication-tolerate-lookup-failure`: この設定を`false`に設定すると、スケジューラーが _常に_ APIサーバーから認証設定を取得するようになります。
- `authentication-skip-lookup`: この設定を`false`に設定すると、スケジューラーが _常に_ APIサーバーから認証設定を取得するようになります。
- `authorization-always-allow-paths`: これらのパスは、匿名アクセス権限に適したデータを返すように設定する必要があります。デフォルト値は、`/healthz,/readyz,/livez`です。
- `profiling`: プロファイリングエンドポイントを無効化する場合は`false`に設定してください。これらのエンドポイントはデバッグ情報を提供しますが、本番環境のクラスターでは使用すべきではありません。サービス拒否攻撃や情報漏洩のリスクがあるためです。`--profiling`引数は非推奨となっており、現在は[KubeScheduler DebuggingConfiguration](https://kubernetes.io/docs/reference/config-api/kube-scheduler-config.v1/#DebuggingConfiguration)を通じて指定できます。プロファイリング機能を無効化するには、kube-schedulerの設定ファイルで `enableProfiling`を`false`に設定してください。
- `requestheader-client-ca-file`: この引数の使用は避けてください。

### スケジューラーのネットワークコマンドラインオプション {#scheduler-networking-command-line-options}

- `bind-address`: 通常、kube-schedulerは外部からアクセス可能な状態にする必要はありません。バインドアドレスを`localhost`に設定することは、セキュリティ上推奨されるベストプラクティスです。
- `permit-address-sharing`: `SO_REUSEADDR`による接続共有を無効にする場合は、この設定を`false`に設定してください。`SO_REUSEADDR`を使用すると、`TIME_WAIT`状態にある終了済み接続が再利用される可能性があります。
- `permit-port-sharing`: デフォルト値は`false`です。セキュリティ上の影響を十分に理解している場合を除き、デフォルト設定をそのまま使用してください。


### スケジューラーのTLSコマンドラインオプション {#scheduler-tls-command-line-options}

- `tls-cipher-suites`: 常に、優先される暗号スイートのリストを明示的に指定してください。これにより、安全性の低い暗号スイートを使用した暗号化が実行されるのを防ぎます。


## カスタムスケジューラーのスケジュール設定 {#scheduling-configurations-for-custom-schedulers}

Kubernetesのスケジューリングコードをベースとしたカスタムスケジューラーを使用する場合、クラスター管理者は、`queueSort`、`prefilter`、`filter`、`permit`といった[拡張ポイント](/docs/reference/scheduling/config/#extension-points)を使用するプラグインの設定には注意が必要です。
これらの拡張ポイントはスケジューリングプロセスの様々な段階を制御しており、設定を誤るとkube-schedulerのクラスター内での動作に影響を及ぼす可能性があります。

### 重要な考慮事項 {#key-considerations}

- `queueSort`拡張ポイントを使用するプラグインは同時に1つだけ有効化できます。`queueSort`を使用するプラグインについては、特に慎重に検証する必要があります。
- `prefilter`または`filter`拡張ポイントを実装するプラグインは、すべてのノードをスケジューリング不可と判定する可能性があります。これにより、新規Podのスケジューリングが完全に停止する恐れがあります。
- `permit`拡張ポイントを実装したプラグインは、Podのバインド処理を阻止または遅延させることができます。このようなプラグインは、クラスター管理者が十分に検証する必要があります。

[デフォルトプラグイン](/docs/reference/scheduling/config/#scheduling-plugins)以外を使用する場合、`queueSort`、`filter`、`permit`の各拡張ポイントを無効化することを検討してください。具体的な手順は以下の通りです。

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
profiles:
  - schedulerName: my-scheduler
    plugins:
      # Disable specific plugins for different extension points
      # You can disable all plugins for an extension point using "*"
      queueSort:
        disabled:
        - name: "*"             # Disable all queueSort plugins
      # - name: "PrioritySort"  # Disable specific queueSort plugin
      filter:
        disabled:
        - name: "*"                 # Disable all filter plugins
      # - name: "NodeResourcesFit"  # Disable specific filter plugin
      permit:
        disabled:
        - name: "*"               # Disables all permit plugins
      # - name: "TaintToleration" # Disable specific permit plugin
```
これにより、`my-scheduler`というスケジューラープロファイルが作成されます。
Podの`.spec`に`.spec.schedulerName`の値が指定されていない場合、kube-schedulerはそのPodに対してデフォルトの設定とデフォルトプラグインを使用して動作します。
`.spec.schedulerName`に`my-scheduler`を指定したPodを定義すると、カスタム設定が適用されたkube-schedulerが起動します。
このカスタム設定では、`queueSort`、`filter`、`permit`の各拡張ポイントが無効化されています。
このKubeSchedulerConfigurationを使用し、かつカスタムスケジューラーを実行していない場合、`.spec.schedulerName`に`nonexistent-scheduler`(またはクラスター内に存在しない任意のスケジューラー名)を指定したPodを定義しても、そのPodに関するイベントは生成されません。

## ノードへのラベル付けを禁止する {#disallow-labeling-nodes}

クラスター管理者は、クラスターユーザーがノードにラベルを付与できないように設定する必要があります。
悪意のある攻撃者が`nodeSelector`を利用することで、本来配置されるべきでないノードにワークロードをスケジュールすることが可能になります。
