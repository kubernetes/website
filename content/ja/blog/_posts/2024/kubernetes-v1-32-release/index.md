---
layout: blog
title: 'Kubernetes v1.32: Penelope'
date: 2024-12-11
slug: kubernetes-v1-32-release
author: >
  [Kubernetes v1.32 Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.32/release-team.md)
translator: >
  [Taisuke Okamoto](https://github.com/b1gb4by) ([IDC Frontier Inc.](https://www.idcf.jp/)),
  [Junya Okabe](https://github.com/Okabe-Junya) (筑波大学)
---

**編集者:** Matteo Bianchi, Edith Puclla, William Rizzo, Ryota Sawada, Rashan Smith

Kubernetes v1.32: Penelopeのリリースを発表します！

これまでのリリースと同様に、Kubernetes v1.32では新たなGA、ベータ、アルファの機能が導入されています。
継続的に高品質なリリースを提供できていることは、私たちの開発サイクルの強さと、活発なコミュニティのサポートを示すものです。
今回のリリースでは、44の機能強化が行われました。
そのうち、13の機能がGAに昇格し、12の機能がベータに移行し、19の機能がアルファとして導入されています。

## リリースのテーマとロゴ

{{< figure src="k8s-1.32.png" alt="Kubernetes v1.32のロゴ: オデュッセイアのペーネロペー、舵輪、そして紫色の幾何学的な背景"
class="release-logo" >}}

Kubernetes v1.32のリリーステーマは"Penelope"です。

Kubernetesが古代ギリシャ語で「パイロット」または「舵取り」を意味することから始め、このリリースではKubernetesの10年間とその成果を振り返ります。
各リリースサイクルは一つの旅路であり、「オデュッセイア」のペーネロペーが10年の間、昼に織ったものを夜になると解いていったように、各リリースでは新機能の追加と既存機能の削除を行います。
ただしここでは、Kubernetesを継続的に改善するというより明確な目的を持って行われています。
v1.32はKubernetesが10周年を迎える年の最後のリリースとなることから、クラウドネイティブの海の試練や課題を航海してきたグローバルなKubernetesクルーの一員として貢献してくださった全ての方々に敬意を表したいと思います。
これからも共にKubernetesの未来を紡いでいけることを願っています。

## 最近の主要な機能の更新

### DRAの機能強化に関する注記

今回のリリースでは、前回のリリースと同様に、KubernetesプロジェクトはDynamic Resource Allocation(DRA)に対して多くの機能強化を提案し続けています。
DRAはKubernetesのリソース管理システムの主要なコンポーネントです。
これらの機能強化は、GPU、FPGA、ネットワークアダプターなどの特殊なハードウェアを必要とするワークロードに対するリソース割り当ての柔軟性と効率性を向上させることを目的としています。

これらの機能は、機械学習や高性能コンピューティングアプリケーションなどのユースケースで特に有用です。DRAのStructured parameterサポートを可能にするコア部分は[ベータに昇格しました](#ベータに昇格した機能のハイライト)。

### ノードとサイドカーコンテナの更新における振る舞いの改善

[SIG Node](https://github.com/kubernetes/community/tree/master/sig-node)では、KEPの範囲を超えて以下のような改善が行われています:

1. kubeletのヘルスチェックが失敗した際にkubeletを再起動するために、systemdのwatchdog機能が使用されるようになりました。
また、一定時間内の最大再起動回数も制限されます。
これによりkubeletの信頼性が向上します。
詳細についてはPull Requestの[#127566](https://github.com/kubernetes/kubernetes/pull/127566)をご覧ください。

2. イメージプルのバックオフエラーが発生した場合、Podのステータスに表示されるメッセージが改善され、より分かりやすくなり、Podがこの状態にある理由の詳細が示されるようになりました。
イメージプルのバックオフが発生すると、エラーはPod仕様の`status.containerStatuses[*].state.waiting.message`フィールドに追加され、`reason`フィールドには`ImagePullBackOff`の値が設定されます。
この変更により、より多くのコンテキストが提供され、問題の根本原因を特定するのに役立ちます。
詳細については、Pull Requestの[#127918](https://github.com/kubernetes/kubernetes/pull/127918)をご覧ください。

3. サイドカーコンテナ機能は、v1.33でStableへの昇格を目指しています。
残りの作業項目とユーザーからのフィードバックについては、Issueの[#753](https://github.com/kubernetes/enhancements/issues/753#issuecomment-2350136594)のコメントをご覧ください。

## GAに昇格した機能のハイライト

_これは、v1.32のリリースに伴いGAとなった改善点の一部です。_

### カスタムリソースのフィールドセレクター

カスタムリソースのフィールドセレクターにより、開発者は組み込みのKubernetesオブジェクトで利用できる機能と同様に、カスタムリソースにフィールドセレクターを追加できるようになりました。
これにより、カスタムリソースのより効率的で正確なフィルタリングが可能になり、より良いAPI設計の実践を促進します。

この作業は、[SIG API Machinery](https://github.com/kubernetes/community/tree/master/sig-api-machinery)により[KEP #4358](https://github.com/kubernetes/enhancements/issues/4358)の一部として実施されました。

### SizeMemoryBackedVolumesのサポート

この機能により、Podのリソース制限に基づいてメモリバックアップボリュームを動的にサイズ設定できるようになり、ワークロードの移植性とノードのリソース使用率の全体的な向上を実現します。

この作業は、[SIG Node](https://github.com/kubernetes/community/tree/master/sig-node)により[KEP #1967](https://github.com/kubernetes/enhancements/issues/1967)の一部として実施されました。

### バインドされたサービスアカウントトークンの改善

サービスアカウントトークンのクレームにノード名を含めることで、認可と認証(ValidatingAdmissionPolicy)の過程でこの情報を使用できるようになりました。
さらに、この改善によりサービスアカウントの認証情報がノードの権限昇格パスとなることを防ぎます。

この作業は、[SIG Auth](https://github.com/kubernetes/community/tree/master/sig-auth)により[KEP #4193](https://github.com/kubernetes/enhancements/issues/4193)の一部として実施されました。

### 構造化された認可設定

APIサーバーに複数の認可機能を設定できるようになり、webhookでのCELマッチ条件をサポートすることで、構造化された認可の判断が可能になりました。

この作業は、[SIG Auth](https://github.com/kubernetes/community/tree/master/sig-auth)により[KEP #3221](https://github.com/kubernetes/enhancements/issues/3221)の一部として実施されました。

### StatefulSetによって作成されたPVCの自動削除

StatefulSetが作成したPersistentVolumeClaim(PVC)は、不要になると自動的に削除されるようになりました。
これはStatefulSetの更新やノードのメンテナンス時にもデータを確実に保持したまま削除処理を行います。
この機能により、StatefulSetのストレージ管理が容易になり、PVCが残されたままになるリスクも減少します。

この作業は、[SIG Apps](https://github.com/kubernetes/community/tree/master/sig-apps)により[KEP #1847](https://github.com/kubernetes/enhancements/issues/1847)の一部として実施されました。

## ベータに昇格した機能のハイライト

_これは、v1.32のリリースに伴いベータとなった改善点の一部です。_

### JobのAPI管理メカニズム

Jobの`managedBy`フィールドがv1.32でベータに昇格しました。
この機能により、外部コントローラー([Kueue](https://kueue.sigs.k8s.io/)など)がJobの同期を管理できるようになり、高度なワークロード管理システムとのより柔軟な統合が可能になります。

この作業は、[SIG Apps](https://github.com/kubernetes/community/tree/master/sig-apps)により[KEP #4368](https://github.com/kubernetes/enhancements/issues/4368)の一部として実施されました。

### 設定されたエンドポイントのみの匿名認証を許可

この機能により、管理者は匿名リクエストを許可するエンドポイントを指定できるようになりました。
例えば、管理者は`/healthz`、`/livez`、`/readyz`などのヘルスエンドポイントへの匿名アクセスのみを許可し、ユーザーがRBACを誤設定した場合でも、他のクラスターエンドポイントやリソースへの匿名アクセスを確実に防止できます。

この作業は、[SIG Auth](https://github.com/kubernetes/community/tree/master/sig-auth)により[KEP #4633](https://github.com/kubernetes/enhancements/issues/4633)の一部として実施されました。

### kube-schedulerにおけるプラグインごとの再スケジュール判断機能の改善

この機能は、プラグインごとのコールバック関数(QueueingHint)によってスケジューリングの再試行の判断をより効率的にすることで、スケジューリングのスループットを向上させます。
すべてのプラグインがQueueingHintsを持つようになりました。

この作業は、[SIG Scheduling](https://github.com/kubernetes/community/tree/master/sig-scheduling)により[KEP #4247](https://github.com/kubernetes/enhancements/issues/4247)の一部として実施されました。

### ボリューム拡張の失敗からのリカバリー

この機能により、ユーザーは小さいサイズで再試行することでボリューム拡張の失敗から回復できるようになりました。
この改善により、ボリューム拡張がより堅牢で信頼性の高いものとなり、プロセス中のデータ損失や破損のリスクが軽減されます。

この作業は、[SIG Storage](https://github.com/kubernetes/community/tree/master/sig-storage)により[KEP #1790](https://github.com/kubernetes/enhancements/issues/1790)の一部として実施されました。

### ボリュームグループスナップショット

この機能は、VolumeGroupSnapshot APIを導入し、ユーザーが複数のボリュームを同時にスナップショット取得できるようにすることで、ボリューム間のデータ整合性を確保します。

この作業は、[SIG Storage](https://github.com/kubernetes/community/tree/master/sig-storage)により[KEP #3476](https://github.com/kubernetes/enhancements/issues/3476)の一部として実施されました。

### 構造化パラメーターのサポート

Dynamic Resource Allocation(DRA)のコア部分である構造化パラメーターのサポートがベータに昇格しました。
これにより、kube-schedulerとCluster Autoscalerはサードパーティドライバーを必要とせずに、直接クレームの割り当てをシミュレーションできるようになりました。

これらのコンポーネントは、実際に割り当てを確定することなく、クラスターの現在の状態に基づいてリソース要求が満たされるかどうかを予測できるようになりました。
サードパーティドライバーによる割り当ての検証やテストが不要になったことで、この機能はリソース分配の計画と意思決定を改善し、スケジューリングとスケーリングのプロセスをより効率的にします。

この作業は、WG Device Management([SIG Node](https://github.com/kubernetes/community/tree/master/sig-node)、[SIG Scheduling](https://github.com/kubernetes/community/tree/master/sig-scheduling)、[SIG Autoscaling](https://github.com/kubernetes/community/tree/master/sig-autoscaling)を含む機能横断チーム)により[KEP #4381](https://github.com/kubernetes/enhancements/issues/4381)の一部として実施されました。

### ラベルとフィールドセレクターの認可

認可の判断にラベルとフィールドセレクターを使用できるようになりました。
ノードの認可機能は、これを自動的に活用してノードが自身のPodのみをリストやウォッチできるように制限します。
Webhookの認可機能は、使用されるラベルやフィールドセレクターに基づいてリクエストを制限するように更新できます。

この作業は、[SIG Auth](https://github.com/kubernetes/community/tree/master/sig-auth)により[KEP #4601](https://github.com/kubernetes/enhancements/issues/4601)の一部として実施されました。

## アルファとして導入された新機能

_これは、v1.32のリリースでアルファとして導入された主な改善点の一部です。_

### Kubernetesスケジューラーにおける非同期プリエンプション

Kubernetesスケジューラーは、プリエンプション操作を非同期で処理することでスケジューリングのスループットを向上させる、非同期プリエンプション機能が強化されました。
プリエンプションは、優先度の低いPodを退避させることで、優先度の高いPodに必要なリソースを確保します。
しかし、これまでこのプロセスではPodを削除するためのAPIコールなどの重い操作が必要で、スケジューラーの速度低下を引き起こしていました。
この強化により、そのような処理が並列で実行されるようになり、スケジューラーは他のPodのスケジューリングを遅延なく継続できるようになりました。
この改善は、特にPodの入れ替わりが頻繁なクラスターや、スケジューリングの失敗が頻発するクラスターで有効で、より効率的で堅牢なスケジューリングプロセスを実現します。

この作業は、[SIG Scheduling](https://github.com/kubernetes/community/tree/master/sig-scheduling)により[KEP #4832](https://github.com/kubernetes/enhancements/issues/4832)の一部として実施されました。

### CEL式を使用したMutating Admission Policy

この機能は、CELのオブジェクトインスタンス化とJSONパッチ戦略を、Server Side Applyのマージアルゴリズムと組み合わせて活用します。
これにより、ポリシー定義が簡素化され、変更の競合が削減され、アドミッション制御のパフォーマンスが向上すると同時に、Kubernetesにおけるより堅牢で拡張可能なポリシーフレームワークの基盤が構築されます。

KubernetesのAPIサーバーは、Common Expression Language(CEL)ベースのMutating Admission Policyをサポートするようになり、Mutating Admission Webhookの軽量で効率的な代替手段を提供します。
この強化により、管理者はCELを使用して、ラベルの設定、フィールドのデフォルト値設定、サイドカーの注入といった変更を、シンプルな宣言的な式で定義できるようになりました。
このアプローチにより、運用の複雑さが軽減され、webhookの必要性が排除され、kube-apiserverと直接統合されることで、より高速で信頼性の高いプロセス内変更処理を実現します。

この作業は、[SIG API Machinery](https://github.com/kubernetes/community/tree/master/sig-api-machinery)により[KEP #3962](https://github.com/kubernetes/enhancements/issues/3962)の一部として実施されました。

### Podレベルのリソース指定

この機能強化により、Podレベルでリソースの要求と制限を設定できるようになり、Pod内のすべてのコンテナが動的に使用できる共有プールを作成することで、Kubernetesのリソース管理が簡素化されます。
これは特に、リソース需要が変動的またはバースト的なコンテナを持つワークロードにとって有用で、過剰なプロビジョニングを最小限に抑え、全体的なリソース効率を向上させます。

KubernetesはPodレベルでLinuxのcgroup設定を活用することで、これらのリソース制限を確実に適用しながら、密結合したコンテナが人為的な制約に縛られることなく、より効果的に連携できるようにします。
重要なことに、この機能は既存のコンテナレベルのリソース設定との後方互換性を維持しており、ユーザーは現在のワークフローや既存の設定を中断することなく、段階的に採用できます。

これは、コンテナ間のリソース割り当て管理の運用複雑性を軽減するため、マルチコンテナPodにとって重要な改善となります。
また、コンテナがワークロードを共有したり、最適なパフォーマンスを発揮するために互いの可用性に依存したりするサイドカーアーキテクチャなどの密接に統合されたアプリケーションにおいて、パフォーマンスの向上をもたらします。

この作業は、[SIG Node](https://github.com/kubernetes/community/tree/master/sig-node)により[KEP #2837](https://github.com/kubernetes/enhancements/issues/2837)の一部として実施されました。

### PreStopフックのスリープアクションでゼロ値を許可

この機能強化により、KubernetesのPreStopライフサイクルフックで0秒のスリープ時間を設定できるようになり、リソースの検証とカスタマイズのためのより柔軟な無操作オプションを提供します。
これまでは、スリープアクションにゼロ値を設定しようとするとバリデーションエラーが発生し、その使用が制限されていました。
この更新により、ユーザーはゼロ秒の時間を有効なスリープ設定として設定でき、必要に応じて即時実行と終了の動作が可能になります。

この機能強化は後方互換性があり、`PodLifecycleSleepActionAllowZero`フィーチャーゲートによって制御されるオプトイン機能として導入されています。
この変更は、実際のスリープ時間を必要とせずに、検証やAdmission Webhook処理のためにPreStopフックを必要とするシナリオで特に有効です。
Goの`time.After`関数の機能に合わせることで、この更新はKubernetesワークロードの設定を簡素化し、使いやすさを向上させます。

この作業は、[SIG Node](https://github.com/kubernetes/community/tree/master/sig-node)により[KEP #4818](https://github.com/kubernetes/enhancements/issues/4818)の一部として実施されました。

### DRA：ResourceClaimステータスのための標準化されたネットワークインターフェースデータ

この機能強化により、ドライバーが`ResourceClaim`の各割り当てオブジェクトに対して特定のデバイスステータスデータを報告できる新しいフィールドが追加されました。
また、ネットワークデバイス情報を表現するための標準的な方法も確立されました。

この作業は、[SIG Network](https://github.com/kubernetes/community/tree/master/sig-network)により[KEP #4817](https://github.com/kubernetes/enhancements/issues/4817)の一部として実施されました。

### コアコンポーネントの新しいstatuszとflagzエンドポイント

コアコンポーネントに対して、2つの新しいHTTPエンドポイント(`/statusz`と`/flagz`)を有効にできるようになりました。
これらのエンドポイントは、コンポーネントが実行されているバージョン(Golangのバージョンなど)や、稼働時間、そのコンポーネントが実行された際のコマンドラインフラグの詳細を把握することで、クラスターのデバッグ性を向上させます。
これにより、実行時および設定の問題の診断が容易になります。

この作業は、[SIG Instrumentation](https://github.com/kubernetes/community/tree/master/sig-instrumentation)により[KEP #4827](https://github.com/kubernetes/enhancements/issues/4827)と[KEP #4828](https://github.com/kubernetes/enhancements/issues/4828)の一部として実施されました。

### Windowsの逆襲

Kubernetesクラスターにおいて、Windowsノードの正常なシャットダウンのサポートが追加されました。
このリリース以前、KubernetesはLinuxノードに対して正常なノードシャットダウン機能を提供していましたが、Windowsに対する同等のサポートは欠けていました。
この機能強化により、Windowsノード上のkubeletがシステムのシャットダウンイベントを適切に処理できるようになりました。
これにより、Windowsノード上で実行されているPodが正常に終了され、ワークロードの中断なしでの再スケジュールが可能になります。
この改善により、特に計画的なメンテナンスやシステム更新時において、Windowsノードを含むクラスターの信頼性と安定性が向上します。

さらに、CPUマネージャー、メモリマネージャー、トポロジーマネージャーの改善により、Windowsノードに対するCPUとメモリのアフィニティサポートが追加されました。

この作業は、[SIG Windows](https://github.com/kubernetes/community/tree/master/sig-windows)により[KEP #4802](https://github.com/kubernetes/enhancements/issues/4802)と[KEP #4885](https://github.com/kubernetes/enhancements/issues/4885)の一部として実施されました。

## 1.32における機能の昇格、非推奨化、および削除

### GAへの昇格

ここでは、GA(_一般提供_ とも呼ばれる)に昇格したすべての機能を紹介します。新機能やアルファからベータへの昇格を含む完全な更新リストについては、リリースノートをご覧ください。

このリリースでは、以下の13個の機能強化がGAに昇格しました:

- [Structured Authorization Configuration](https://github.com/kubernetes/enhancements/issues/3221)
- [Bound service account token improvements](https://github.com/kubernetes/enhancements/issues/4193)
- [Custom Resource Field Selectors](https://github.com/kubernetes/enhancements/issues/4358)
- [Retry Generate Name](https://github.com/kubernetes/enhancements/issues/4420)
- [Make Kubernetes aware of the LoadBalancer behaviour](https://github.com/kubernetes/enhancements/issues/1860)
- [Field `status.hostIPs` added for Pod](https://github.com/kubernetes/enhancements/issues/2681)
- [Custom profile in kubectl debug](https://github.com/kubernetes/enhancements/issues/4292)
- [Memory Manager](https://github.com/kubernetes/enhancements/issues/1769)
- [Support to size memory backed volumes](https://github.com/kubernetes/enhancements/issues/1967)
- [Improved multi-numa alignment in Topology Manager](https://github.com/kubernetes/enhancements/issues/3545)
- [Add job creation timestamp to job annotations](https://github.com/kubernetes/enhancements/issues/4026)
- [Add Pod Index Label for StatefulSets and Indexed Jobs](https://github.com/kubernetes/enhancements/issues/4017)
- [Auto remove PVCs created by StatefulSet](https://github.com/kubernetes/enhancements/issues/1847)

### 非推奨化と削除

Kubernetesの開発と成熟に伴い、プロジェクト全体の健全性のために、機能が非推奨化、削除、またはより良いものに置き換えられる場合があります。
このプロセスの詳細については、Kubernetesの[非推奨化と削除のポリシー](/ja/docs/reference/using-api/deprecation-policy/)をご覧ください。

#### 古いDRA実装の廃止

[KEP #3063](https://github.com/kubernetes/enhancements/issues/3063)により、Kubernetes 1.26でDynamic Resource Allocation(DRA)が導入されました。

しかし、Kubernetes v1.32では、このDRAのアプローチが大幅に変更されます。元の実装に関連するコードは削除され、[KEP #4381](https://github.com/kubernetes/enhancements/issues/4381)が「新しい」基本機能として残ります。

既存のアプローチを変更する決定は、リソースの可用性が不透明であったことによるクラスターオートスケーリングとの非互換性に起因しており、これによりCluster Autoscalerとコントローラーの両方の意思決定が複雑化していました。
新しく追加されたStructured Parameterモデルがその機能を置き換えます。

この削除により、Kubernetesはkube-apiserverとの双方向のAPIコールの複雑さを回避し、新しいハードウェア要件とリソースクレームをより予測可能な方法で処理できるようになります。

詳細については、[KEP #3063](https://github.com/kubernetes/enhancements/issues/3063)をご覧ください。

#### API削除

[Kubernetes v1.32](/docs/reference/using-api/deprecation-guide/#v1-32)では、以下のAPIが削除されます：

- FlowSchemaとPriorityLevelConfigurationの`flowcontrol.apiserver.k8s.io/v1beta3` APIバージョンが削除されます。
これに備えるため、既存のマニフェストを編集し、v1.29以降で利用可能な`flowcontrol.apiserver.k8s.io/v1 API`バージョンを使用するようにクライアントソフトウェアを書き換えることができます。
既存の永続化されたオブジェクトはすべて新しいAPIを通じてアクセス可能です。
`flowcontrol.apiserver.k8s.io/v1beta3`における主な変更点として、PriorityLevelConfigurationの`spec.limited.nominalConcurrencyShares`フィールドは未指定の場合にのみデフォルトで30となり、明示的に0が指定された場合は30に変更されないようになりました。

詳細については、[API廃止に関する移行ガイド](/docs/reference/using-api/deprecation-guide/#v1-32)を参照してください。

### リリースノートとアップグレードに必要なアクション

Kubernetes v1.32リリースの詳細については、[リリースノート](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.32.md)をご確認ください。

## 入手方法

Kubernetes v1.32は、[GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.32.0)または[Kubernetesダウンロードページ](/ja/releases/download/)からダウンロードできます。

Kubernetesを始めるには、[対話式のチュートリアル](/ja/docs/tutorials/)をチェックするか、[minikube](https://minikube.sigs.k8s.io/)を使用してローカルKubernetesクラスタを実行してください。
また、[kubeadm](/ja/docs/setup/independent/create-cluster-kubeadm/)を使用して簡単にv1.32をインストールすることもできます。

## リリースチーム

Kubernetesは、そのコミュニティのサポート、献身、そして懸命な努力に支えられて実現しています。
各リリースチームは、皆様が頼りにしているKubernetesリリースを構成する多くの要素を構築するために協力して働く、献身的なコミュニティボランティアで構成されています。
これには、コード自体からドキュメンテーション、プロジェクト管理に至るまで、コミュニティのあらゆる分野から専門的なスキルを持つ人々が必要です。

私たちは、Kubernetes v1.32リリースをコミュニティに提供するために多くの時間を費やしてくださった[リリースチーム](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.32/release-team.md)全体に感謝の意を表します。
リリースチームのメンバーは、初めてShadowとして参加する人から、複数のリリースサイクルを経験したベテランのチームリーダーまで多岐にわたります。
リリースリードのFrederico Muñozには、リリースチームを見事に率いて、あらゆる事柄を細心の注意を払って処理し、このリリースを円滑かつ効率的に実行してくれたことに、特別な感謝の意を表します。
最後になりましたが、すべてのリリースメンバー(リードとShadowの双方)、そして14週間のリリース作業期間中に素晴らしい仕事と成果を上げてくれた以下のSIGsに、大きな感謝の意を表します：

- [SIG Docs](https://github.com/kubernetes/community/tree/master/sig-docs) - ドキュメントとブログのレビューにおける基本的なサポートを提供し、リリースのコミュニケーションとドキュメントチームとの継続的な協力を行ってくれました。
- [SIG K8s Infra](https://github.com/kubernetes/community/tree/master/sig-k8s-infra)と[SIG Testing](https://github.com/kubernetes/community/tree/master/sig-testing) - 必要なすべてのインフラコンポーネントと共に、テストフレームワークを確実に維持するための素晴らしい仕事を行ってくれました。
- [SIG Release](https://github.com/kubernetes/community/tree/master/sig-release)とすべてのリリースマネージャー - リリース全体の調整を通じて素晴らしいサポートを提供し、最も困難な課題でも適切かつタイムリーに対応してくれました。

## プロジェクトの進捗速度

CNCFのK8s [DevStatsプロジェクト](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&var-period=m&var-repogroup_name=All)は、Kubernetesと様々なサブプロジェクトの進捗に関する興味深いデータポイントを集計しています。
これには、個人の貢献から貢献している企業の数まで、このエコシステムの進化に関わる取り組みの深さと広さを示す様々な情報が含まれています。

14週間(9月9日から12月11日まで)続いたv1.32リリースサイクルでは、125の異なる企業と559の個人がKubernetesに貢献しました。

クラウドネイティブエコシステム全体では、433の企業から合計2441人の貢献者がいます。
これは[前回のリリース](https://kubernetes.io/blog/2024/08/13/kubernetes-v1-31-release/#project-velocity)サイクルと比較して、全体の貢献が7%増加し、参加企業数も14%増加したことを示しており、クラウドネイティブプロジェクトに対する強い関心とコミュニティの支持が表れています。

このデータの出典:

- [Companies contributing to
Kubernetes](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&from=1725832800000&to=1733961599000&var-period=d28&var-repogroup_name=Kubernetes&var-repo_name=kubernetes%2Fkubernetes)
- [Overall ecosystem
contributions](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&from=1725832800000&to=1733961599000&var-period=d28&var-repogroup_name=All&var-repo_name=kubernetes%2Fkubernetes)

ここでの貢献とは、コミットの作成、コードレビュー、コメント、IssueやPRの作成、PR(ブログやドキュメントを含む)のレビュー、もしくはIssueやPRへのコメントを指します。

コントリビューターウェブサイトの[Getting Started](https://www.kubernetes.dev/docs/guide/#getting-started)から、貢献を始める方法をご確認ください。

Kubernetesプロジェクトとコミュニティの全体的な活動状況の詳細については、[DevStats](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&var-period=m&var-repogroup_name=All)をご確認ください。

## イベント情報

2025年3月から6月にかけて開催予定のKubernetesとクラウドネイティブ関連のイベントをご紹介します。
KubeCon、KCD、その他世界各地で開催される注目のカンファレンスが含まれています。
Kubernetesコミュニティの最新情報を入手し、交流を深めましょう。

**2025年3月**

- [**KCD - Kubernetes Community Days: Beijing, China**](https://www.cncf.io/kcds/): 3月 | 北京(中国)
- [**KCD - Kubernetes Community Days: Guadalajara, Mexico**](https://www.cncf.io/kcds/): 2025年3月16日 | グアダラハラ(メキシコ)
- [**KCD - Kubernetes Community Days: Rio de Janeiro, Brazil**](https://www.cncf.io/kcds/): 2025年3月22日 | リオデジャネイロ(ブラジル)

**2025年4月**

- [**KubeCon + CloudNativeCon Europe 2025**](https://events.linuxfoundation.org/kubecon-cloudnativecon-europe): 2025年4月1日-4日 | ロンドン(イギリス)
- [**KCD - Kubernetes Community Days: Budapest, Hungary**](https://www.cncf.io/kcds/): 2025年4月23日 | ブダペスト(ハンガリー)
- [**KCD - Kubernetes Community Days: Chennai, India**](https://www.cncf.io/kcds/): 2025年4月26日 | チェンナイ(インド)
- [**KCD - Kubernetes Community Days: Auckland, New Zealand**](https://www.cncf.io/kcds/): 2025年4月28日 | オークランド(ニュージーランド)

**2025年5月**

- [**KCD - Kubernetes Community Days: Helsinki, Finland**](https://www.cncf.io/kcds/): 2025年5月6日 | ヘルシンキ(フィンランド)
- [**KCD - Kubernetes Community Days: San Francisco, USA**](https://www.cncf.io/kcds/): 2025年5月8日 | サンフランシスコ(アメリカ)
- [**KCD - Kubernetes Community Days: Austin, USA**](https://community.cncf.io/events/details/cncf-kcd-texas-presents-kcd-texas-austin-2025/): 2025年5月15日 | オースティン(アメリカ)
- [**KCD - Kubernetes Community Days: Seoul, South Korea**](https://www.cncf.io/kcds/): 2025年5月22日 | ソウル(韓国)
- [**KCD - Kubernetes Community Days: Istanbul, Turkey**](https://www.cncf.io/kcds/): 2025年5月23日 | イスタンブール(トルコ)
- [**KCD - Kubernetes Community Days: Heredia, Costa Rica**](https://www.cncf.io/kcds/): 2025年5月31日 | エレディア(コスタリカ)
- [**KCD - Kubernetes Community Days: New York, USA**](https://www.cncf.io/kcds/): 2025年5月 | ニューヨーク(アメリカ)

**2025年6月**

- [**KCD - Kubernetes Community Days: Bratislava, Slovakia**](https://www.cncf.io/kcds/): 2025年6月5日 | ブラチスラバ(スロバキア)
- [**KCD - Kubernetes Community Days: Bangalore, India**](https://www.cncf.io/kcds/): 2025年6月6日 | バンガロール(インド)
- [**KubeCon + CloudNativeCon China 2025**](https://events.linuxfoundation.org/kubecon-cloudnativecon-china/): 2025年6月10日-11日 | 香港
- [**KCD - Kubernetes Community Days: Antigua Guatemala, Guatemala**](https://www.cncf.io/kcds/): 2025年6月14日 | アンティグア グアテマラ(グアテマラ)
- [**KubeCon + CloudNativeCon Japan 2025**](https://events.linuxfoundation.org/kubecon-cloudnativecon-japan): 2025年6月16日-17日 | 東京(日本)
- [**KCD - Kubernetes Community Days: Nigeria, Africa**](https://www.cncf.io/kcds/): 2025年6月19日 | ナイジェリア

## 次期リリースに関するウェビナーのお知らせ

**2025年1月9日(木)午後5時(太平洋時間)** に開催されるKubernetes v1.32リリースチームメンバーによるウェビナーにご参加ください。
このリリースの主要な機能や、アップグレード計画に役立つ非推奨化および削除された機能について学ぶことができます。
詳細および参加登録については、CNCFオンラインプログラムサイトの[イベントページ](https://community.cncf.io/events/details/cncf-cncf-online-programs-presents-cncf-live-webinar-kubernetes-132-release/)をご覧ください。

## 参加方法

Kubernetesに関わる最も簡単な方法は、あなたの興味に合った[Special Interest Groups(SIG)](https://github.com/kubernetes/community/blob/master/sig-list.md)のいずれかに参加することです。
Kubernetesコミュニティに向けて何か発信したいことはありますか？
毎週の[コミュニティミーティング](https://github.com/kubernetes/community/tree/master/communication)や、以下のチャンネルであなたの声を共有してください。
継続的なフィードバックとサポートに感謝いたします。

- 最新情報はBlueskyの[@Kubernetes.io](https://bsky.app/profile/did:plc:kyg4uikmq7lzpb76ugvxa6ul)をフォローしてください
- [Discuss](https://discuss.kubernetes.io/)でコミュニティディスカッションに参加してください
- [Slack](http://slack.k8s.io/)でコミュニティに参加してください
- [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)で質問したり、回答したりしてください
- あなたのKubernetesに関する[ストーリー](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)を共有してください
- Kubernetesの最新情報は[ブログ](https://kubernetes.io/ja/blog/)でさらに詳しく読むことができます
- [Kubernetesリリースチーム](https://github.com/kubernetes/sig-release/tree/master/release-team)についてもっと学んでください
