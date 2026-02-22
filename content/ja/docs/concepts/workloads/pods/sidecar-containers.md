---
title: サイドカーコンテナ
content_type: concept
weight: 50
---

<!-- overview -->

{{< feature-state feature_gate_name="SidecarContainers" >}}

サイドカーコンテナは、同じ{{< glossary_tooltip text="Pod" term_id="pod" >}}内でメインのアプリケーションコンテナと共に実行されるセカンダリコンテナです。
これらのコンテナは、ロギング、モニタリング、セキュリティ、データ同期などの追加サービスや機能を提供することで、プライマリの _アプリケーションコンテナ_ の機能を強化または拡張するために使用されます。
メインのアプリケーションコードを直接変更する必要はありません。

通常、Pod内にはアプリケーションコンテナが1つだけ含まれます。
例えば、ローカルWebサーバーを必要とするWebアプリケーションがある場合、ローカルWebサーバーがサイドカーであり、Webアプリケーション自体がアプリケーションコンテナです。

<!-- body -->

## Kubernetesにおけるサイドカーコンテナ {#pod-sidecar-containers}

Kubernetesは、サイドカーコンテナを[Initコンテナ](/docs/concepts/workloads/pods/init-containers/)の特殊なケースとして実装しています。
サイドカーコンテナはPod起動後も実行され続けます。
このドキュメントでは、Pod起動時にのみ実行されるコンテナを明確に指すために、_通常のInitコンテナ_ という用語を使用します。

クラスターで`SidecarContainers`[フィーチャーゲート](/docs/reference/command-line-tools-reference/feature-gates/)が有効になっている場合(この機能はKubernetes v1.29以降デフォルトで有効です)、Podの`initContainers`フィールドにリストされているコンテナに対して`restartPolicy`を指定できます。
これらの再起動可能な _サイドカー_ コンテナは、同じPod内の他のInitコンテナやメインアプリケーションコンテナから独立しています。
メインアプリケーションコンテナや他のInitコンテナに影響を与えることなく、これらを起動、停止、または再起動することができます。

また、Initコンテナやサイドカーコンテナとして定義されていない複数のコンテナでPodを実行することもできます。
これは、Pod内のコンテナがPod全体の動作に必要であるが、どのコンテナを最初に起動または停止するかを制御する必要がない場合に適しています。
また、コンテナレベルの`restartPolicy`フィールドをサポートしていない古いバージョンのKubernetesをサポートする必要がある場合にも、この方法を使用できます。

### アプリケーションの例 {#sidecar-example}

以下は、2つのコンテナを持つDeploymentの例で、そのうちの1つがサイドカーコンテナです:

{{% code_sample language="yaml" file="application/deployment-sidecar.yaml" %}}

## サイドカーコンテナとPodのライフサイクル {#sidecar-containers-and-pod-lifecycle}

Initコンテナが`restartPolicy`を`Always`に設定して作成された場合、Podの全ライフサイクルを通じて起動し、実行され続けます。
これは、メインのアプリケーションコンテナから分離した補助的なサービスを実行する際に役立ちます。

このInitコンテナに`readinessProbe`が指定されている場合、その結果はPodの`ready`状態を判定するために使用されます。

これらのコンテナはInitコンテナとして定義されているため、通常のInitコンテナと同じ順序と順次実行の保証の恩恵を受けます。
これにより、複雑なPod初期化フローの際に、サイドカーコンテナと通常のInitコンテナを混在させることができます。

通常のInitコンテナと比較して、`initContainers`内で定義されたサイドカーコンテナは起動後も実行され続けます。
これは、Podの`.spec.initContainers`内に複数のエントリがある場合に重要です。
サイドカー形式のInitコンテナが実行状態になった後(kubeletがそのInitコンテナの`started`ステータスをtrueに設定した後)、kubeletは順序付けられた`.spec.initContainers`リストから次のInitコンテナを起動します。
このステータスは、コンテナ内でプロセスが実行されておりStartup Probeが定義されていない場合、または`startupProbe`が成功した結果として、trueになります。

Podの[終了](/docs/concepts/workloads/pods/pod-lifecycle/#termination-with-sidecars)時には、kubeletはメインのアプリケーションコンテナが完全に停止するまで、サイドカーコンテナの終了を引き延ばします。
その後、サイドカーコンテナはPodの仕様内で定義された順序と逆の順序でシャットダウンされます。
このアプローチにより、サイドカーコンテナは、そのサービスが不要になるまで、Pod内の他のコンテナをサポートし続けることが保証されます。

### サイドカーコンテナを持つJob {#jobs-with-sidecar-containers}

Kubernetes形式のInitコンテナを使用してサイドカーコンテナを使用するJobを定義した場合、各Pod内のサイドカーコンテナは、メインコンテナが終了した後にJobが完了することを妨げません。

以下は、2つのコンテナを持つJobの例で、そのうちの1つがサイドカーコンテナです:

{{% code_sample language="yaml" file="application/job/job-sidecar.yaml" %}}

## アプリケーションコンテナとの違い {#differences-from-application-containers}

サイドカーコンテナは、同じPod内で _アプリケーションコンテナ_ と並行して実行されます。
ただし、サイドカーコンテナは主要なアプリケーションロジックを実行するのではなく、メインアプリケーションに補助的な機能を提供します。

サイドカーコンテナは独自の独立したライフサイクルを持ちます。
アプリケーションコンテナとは独立して、起動、停止、再起動できます。
これは、メインアプリケーションに影響を与えることなく、サイドカーコンテナを更新、スケール、またはメンテナンスできることを意味します。

サイドカーコンテナは、プライマリコンテナと同じネットワークおよびストレージ名前空間を共有します。
このように共存することで、密接に相互作用しリソースを共有できます。

Kubernetesの観点からは、サイドカーコンテナのグレースフルな終了はそれほど重要ではありません。
他のコンテナが、割り当てられたグレースフルな終了時間をすべて消費した場合、サイドカーコンテナはグレースフルに終了する時間を持つ前に、`SIGTERM`シグナルに続いて`SIGKILL`シグナルを受信します。
そのため、サイドカーコンテナにおいては、Pod終了時の`0`以外の終了コード(`0`は正常終了を示します)は正常なものであり、一般的に外部ツールによって無視されるべきです。

## Initコンテナとの違い {#differences-from-init-containers}

サイドカーコンテナはメインコンテナと並行して動作し、その機能を拡張して追加のサービスを提供します。

サイドカーコンテナは、メインのアプリケーションコンテナと同時に実行されます。
サイドカーコンテナはPodのライフサイクル全体を通じてアクティブであり、メインコンテナとは独立して起動および停止できます。
[Initコンテナ](/docs/concepts/workloads/pods/init-containers/)とは異なり、サイドカーコンテナは、ライフサイクルを制御するための[Probe](/docs/concepts/workloads/pods/pod-lifecycle/#types-of-probe)をサポートしています。

サイドカーコンテナは、メインのアプリケーションコンテナと直接やり取りできます。
これは、Initコンテナと同様に常に同じネットワークを共有し、オプションでボリューム(ファイルシステム)も共有できるためです。

Initコンテナはメインコンテナが起動する前に停止するため、InitコンテナはPod内のアプリケーションコンテナとメッセージを交換できません。
データの受け渡しは一方向です(例えば、Initコンテナが`emptyDir`ボリューム内に情報を配置することはできます)。

サイドカーコンテナのイメージを変更してもPodは再起動されませんが、コンテナの再起動はトリガーされます。

## コンテナ内でのリソース共有 {#resource-sharing-within-containers}

{{< comment >}}
このセクションは[Initコンテナ](/docs/concepts/workloads/pods/init-containers/)のページにも存在します。
このセクションを編集する場合は、両方の場所を変更してください。
{{< /comment >}}

Initコンテナ、サイドカーコンテナ、アプリケーションコンテナの実行順序を考慮すると、リソース使用に関して以下のルールが適用されます:

* すべてのInitコンテナで定義された特定のリソース要求または制限のうち、最も高い値が*実効Init要求/制限*となります。
  いずれかのリソースにリソース制限が指定されていない場合、これが最も高い制限と見なされます。
* リソースに対するPodの*実効要求/制限*は、[Podのオーバーヘッド](/docs/concepts/scheduling-eviction/pod-overhead/)と以下のうち高い方の合計です:
  * すべての非Initコンテナ(アプリケーションコンテナとサイドカーコンテナ)のリソース要求/制限の合計
  * リソースに対する実効Init要求/制限
* スケジューリングは実効要求/制限に基づいて行われます。
  これは、InitコンテナがPodのライフタイム中には使用されない初期化用のリソースを予約できることを意味します。
* Podの*実効QoS tier*のQoS(サービス品質) tierは、Initコンテナ、サイドカーコンテナ、アプリケーションコンテナすべてに対するQoS tierです。

クォータと制限は、実効Pod要求と制限に基づいて適用されます。

### サイドカーコンテナとLinux cgroup {#cgroups}

Linuxでは、Podレベルのコントロールグループ(cgroup)に対するリソース割り当ては、スケジューラーと同様に、実効的なPod要求/制限に基づいて行われます。

## {{% heading "whatsnext" %}}

* [サイドカーコンテナの導入](/docs/tutorials/configuration/pod-sidecar-containers/)方法について学ぶ。
* [ネイティブなサイドカーコンテナ](/blog/2023/08/25/native-sidecar-containers/)に関するブログ記事を読む。
* [Initコンテナを持つPodの作成](/docs/tasks/configure-pod-container/configure-pod-initialization/#create-a-pod-that-has-an-init-container)について読む。
* [Probeのタイプ](/docs/concepts/workloads/pods/pod-lifecycle/#types-of-probe): Liveness、Readiness、Startup Probeについて学ぶ。
* [Podオーバーヘッド](/docs/concepts/scheduling-eviction/pod-overhead/)について学ぶ。
