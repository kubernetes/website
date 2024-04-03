---
title: サイドカーコンテナ
content_type: concept
weight: 50
---

<!-- overview -->
{{< feature-state for_k8s_version="v1.29" state="beta" >}}

サイドカーコンテナは、メインのアプリケーションコンテナと同じ{{< glossary_tooltip text="Pod" term_id="pod" >}}内で実行されるセカンダリーコンテナです。
これらのコンテナは、主要なアプリケーションコードを直接変更することなく、ロギング、モニタリング、セキュリティ、データの同期などの追加サービスや機能を提供することにより、アプリケーションコンテナの機能を強化または拡張するために使用されます。

<!-- body -->

## サイドカーコンテナの有効化

Kubernetes 1.29でデフォルトで有効化された`SidecarContainers`という名前の [フィーチャーゲート](/docs/reference/command-line-tools-reference/feature-gates/)により、
Podの`initContainers`フィールドに記載されているコンテナの`restartPolicy`を指定することができます。
これらの再起動可能な _サイドカー_ コンテナは、同じポッド内の他の[initコンテナ](/docs/concepts/workloads/pods/init-containers/)やメインのアプリケーションコンテナとは独立しています。
これらは、メインアプリケーションコンテナや他のinitコンテナに影響を与えることなく、開始、停止、または再起動することができます。

## サイドカーコンテナとPodのライフサイクル

もしinitコンテナが`restartPolicy`を`Always`に設定して作成された場合、それはPodのライフサイクル全体にわたって起動し続けます。
これは、メインアプリケーションコンテナから分離されたサポートサービスを実行するのに役立ちます。

このinitコンテナに`readinessProbe`が指定されている場合、その結果はPodの`ready`状態を決定するために使用されます。

これらのコンテナはinitコンテナとして定義されているため、他のinitコンテナと同様に順序に関する保証を受けることができ、複雑なPodの初期化フローに他のinitコンテナと混在させることができます。

通常のinitコンテナと比較して、`initContainers`内で定義されたサイドカーは、開始した後も実行を続けます。
これは、`.spec.initContainers`にPod用の複数のエントリーがある場合に重要です。
サイドカースタイルのinitコンテナが実行中になった後(kubeletがそのinitコンテナの`started`ステータスをtrueに設定した後)、kubeletは順序付けられた`.spec.initContainers`リストから次のinitコンテナを開始します。
そのステータスは、コンテナ内でプロセスが実行されておりStartup Probeが定義されていない場合、あるいはその`startupProbe`が成功するとtrueになります。

以下は、サイドカーを含む2つのコンテナを持つDeploymentの例です:

{{% code_sample language="yaml" file="application/deployment-sidecar.yaml" %}}

この機能は、サイドカーコンテナがメインコンテナが終了した後もジョブが完了するのを妨げないため、サイドカーを持つジョブを実行するのにも役立ちます。

以下は、サイドカーを含む2つのコンテナを持つJobの例です:

{{% code_sample language="yaml" file="application/job/job-sidecar.yaml" %}}

## 通常のコンテナとの違い

サイドカーコンテナは、同じPod内の通常のコンテナと並行して実行されます。
しかし、主要なアプリケーションロジックを実行するわけではなく、メインのアプリケーションにサポート機能を提供します。

サイドカーコンテナは独自の独立したライフサイクルを持っています。
通常のコンテナとは独立して開始、停止、再起動することができます。
これは、メインアプリケーションに影響を与えることなく、サイドカーコンテナを更新、スケール、メンテナンスできることを意味します。

サイドカーコンテナは、メインのコンテナと同じネットワークおよびストレージの名前空間を共有します。
このような配置により、密接に相互作用し、リソースを共有することができます。

## initコンテナとの違い

サイドカーコンテナは、メインのコンテナと並行して動作し、その機能を拡張し、追加サービスを提供します。

サイドカーコンテナは、メインアプリケーションコンテナと並行して実行されます。
Podのライフサイクル全体を通じてアクティブであり、メインコンテナとは独立して開始および停止することができます。
[Initコンテナ](/docs/concepts/workloads/pods/init-containers/)とは異なり、サイドカーコンテナはライフサイクルを制御するための[Probe](/docs/concepts/workloads/pods/pod-lifecycle/#types-of-probe)をサポートしています。

これらのコンテナは、メインアプリケーションコンテナと直接相互作用することができ、同じネットワーク名前空間、ファイルシステム、環境変数を共有します。追加の機能を提供するために緊密に連携して動作します。

## コンテナ内のリソース共有

{{< comment >}}
このセクションは[Initコンテナ](/docs/concepts/workloads/pods/init-containers/)ページにも存在します。
このセクションを編集する場合は、その両方を変更してください。
{{< /comment >}}

Initコンテナ、サイドカーコンテナ、アプリケーションコンテナの順序と実行を考えるとき、リソースの使用に関して下記のルールが適用されます。

* 全てのInitコンテナの中で定義された最も高いリソースリクエストとリソースリミットが、*有効なinitリクエスト／リミット* になります。いずれかのリソースでリミットが設定されていない場合、これが最上級のリミットとみなされます。
* Podのリソースの*有効なリクエスト／リミット* は、[Podのオーバーヘッド](/ja/docs/concepts/scheduling-eviction/pod-overhead/)と次のうち大きい方の合計になります。
  * リソースに対する全てのアプリケーションコンテナとサイドカーコンテナのリクエスト／リミットの合計
  * リソースに対する有効なinitリクエスト／リミット
* スケジューリングは有効なリクエスト／リミットに基づいて実行されます。つまり、InitコンテナはPodの生存中には使用されない初期化用のリソースを確保することができます。
* Podの*有効なQoS(quality of service)ティアー* は、Initコンテナ、サイドカーコンテナ、アプリケーションコンテナで同様です。

クォータとリミットは有効なPodリクエストとリミットに基づいて適用されます。

Podレベルのコントロールグループ(cgroups)は、スケジューラーと同様に、有効なPodリクエストとリミットに基づいています。

## {{% heading "whatsnext" %}}

* [ネイティブサイドカーコンテナ](/blog/2023/08/25/native-sidecar-containers/)に関するブログ投稿を読む。
* [Initコンテナを持つPodを作成する方法](/docs/tasks/configure-pod-container/configure-pod-initialization/#create-a-pod-that-has-an-init-container)について読む。
* [Probeの種類](/docs/concepts/workloads/pods/pod-lifecycle/#types-of-probe)について学ぶ: Liveness, Readiness, Startup Probe。
* [Podのオーバーヘッド](/docs/concepts/scheduling-eviction/pod-overhead/)について学ぶ。
