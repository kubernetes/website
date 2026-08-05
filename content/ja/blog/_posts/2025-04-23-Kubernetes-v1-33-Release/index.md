---
layout: blog
title: 'Kubernetes v1.33: Octarine'
date: 2025-04-23T10:30:00-08:00
slug: kubernetes-v1-33-release
author: >
  [Kubernetes v1.33 Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.33/release-team.md)
translator: >
  [Taisuke Okamoto](https://github.com/b1gb4by) ([IDC Frontier Inc.](https://www.idcf.jp/)),
  [Junya Okabe](https://github.com/Okabe-Junya) (筑波大学),
  [Takuto Nagami](https://github.com/logica0419) (千葉工業大学),
  [Tim Bannister](https://github.com/lmktfy) ([ControlPlane](https://control-plane.io/)),
  [Toshiaki Inukai](https://github.com/t-inu)
---

**編集者:** Agustina Barbetta, Aakanksha Bhende, Udi Hofesh, Ryota Sawada, Sneha Yadav

前回のリリースと同様に、Kubernetes v1.33リリースでは新しいGA、ベータ、アルファの機能が導入されています。
高品質なリリースの継続的な提供は、私たちの開発サイクルの強さとコミュニティからの活発なサポートを示しています。

このリリースには64個の機能改善が含まれています。
それらのうち、GAへの昇格が18個、ベータへの移行が20個、アルファとしての導入が24個、機能の非推奨化及び撤回が2個となっています。

また、このリリースにはいくつかの注目すべき[非推奨化と削除](#deprecations-and-removals)があります。
まだ古いバージョンのKubernetesを実行している場合は、これらに必ず目を通してください。

## リリースのテーマとロゴ

{{< figure src="k8s-1.33.svg" alt="Kubernetes v1.33 Octarineのロゴ" class="release-logo" >}}

Kubernetes v1.33のテーマは**Octarine: 魔法の色**<sup>1</sup>で、テリー・プラチェットの _ディスクワールド_ シリーズに着想を得ています。

このリリースは、Kubernetesがエコシステム全体で可能にするオープンソースの魔法<sup>2</sup>を強調しています。

ディスクワールドの世界に詳しい方なら、"見えざる大学"の塔の上に止まった小さな沼ドラゴンが、アンク・モルポークの街の上に64の星<sup>3</sup>と共に浮かぶKubernetesの月を見上げる様子を思い浮かべていることでしょう。

Kubernetesが10年の節目を迎え新たな10年へ踏み出すにあたり、私たちはメンテナーの魔術、新しいコントリビューターの好奇心、そしてプロジェクトを推進する協力的な精神を祝福します。
v1.33リリースは、プラチェットが書いたように、_「やり方を知っていても、それはまだ魔法だ」_ ということを思い出させてくれます。
Kubernetesのコードベースの詳細をすべて知っていたとしても、リリースサイクルの終わりに立ち止まってみると、Kubernetesはまだ魔法のままであることがわかるでしょう。

Kubernetes v1.33は、真に卓越したものを生み出すために世界中の何百人ものコントリビューター<sup>4</sup>が協力する、オープンソースイノベーションの持続的な力の証です。
あらゆる新機能の背後には、プロジェクトを維持・改善したり、安全性や信頼性を担保したり、計画通りにリリースしたりといったKubernetesコミュニティの働きがあります。

<sub>1. Octarineはディスクワールド世界の神話上の8番目の色で、「蛍光の緑がかった黄紫色」と表現される架空の色です。
秘術に調律された人々—魔法使い、魔女、そしてもちろん猫にのみ見えます。
一般人は目を閉じた時のみこの色を感じることができるとされています。
そして時々、IPテーブルのルールを長時間見つめてきた人にも見えるようになります。</sub>\
<sub>2. 「十分に発達した技術は魔法と区別がつかない」ですよね…？</sub>\
<sub>3. v1.33にも64のKEP(Kubernetes Enhancement Proposals)が含まれていますが、これは偶然ではありません。</sub>\
<sub>4. v1.33のプロジェクト活動状況セクションをご覧ください 🚀</sub>

## 主なアップデート情報

Kubernetes v1.33は新機能と改善点が満載です。
このセクションでは、リリースチームが特に注目して欲しい、選りすぐりのアップデート内容をご紹介します！

### GA: サイドカーコンテナ

サイドカーパターンでは、ネットワーキング、ロギング、メトリクス収集などの分野における追加機能を処理するために、別途補助的なコンテナをデプロイする必要があります。
サイドカーコンテナはv1.33でGAに昇格しました。

Kubernetesでは、`restartPolicy: Always`が設定された、特別な種類のinitコンテナとしてサイドカーを実装しています。
サイドカーは、アプリケーションコンテナより先に起動し、Podのライフサイクル全体を通じて実行され続け、アプリケーションコンテナの終了を待ってから自動的に終了することが保証されます。

さらに、サイドカーはprobe(startup、readiness、liveness)を使用して動作状態を通知できる他、メモリ不足時の早期終了を防ぐため、Out-Of-Memory(OOM)スコア調整がプライマリコンテナと揃えられています。

詳細については、[サイドカーコンテナ](/ja/docs/concepts/workloads/pods/sidecar-containers/)をお読みください。

この作業はSIG Nodeが主導した[KEP-753: Sidecar Containers](https://kep.k8s.io/753)の一環として行われました。

### ベータ: Podの垂直スケーリングのためのインプレースなリソースリサイズ

ワークロードはDeployment、StatefulSetなどのAPIを使用して定義できます。
これらはメモリやCPUリソース、また実行すべきPodの数(レプリカ数)を含む、実行されるべきPodのテンプレートを示しています。
ワークロードはPodのレプリカ数を更新することで水平方向にスケールしたり、Podのコンテナに必要なリソースを更新することで垂直方向にスケールしたりできます。
この機能改善が入る前、Podの`spec`で定義されたコンテナリソースは不変であり、これらの詳細をPodテンプレート内で更新するにはPodの置き換えが必要でした。

しかし、再起動無しで既存のPodのリソース設定を動的に更新できるとしたらどうでしょうか？

[KEP-1287](https://kep.k8s.io/1287)は、まさにそのようなインプレースPod更新を可能にするためのものです。
これはv1.27でアルファとしてリリースされ、v1.33でベータに昇格しました。
これにより、ステートフルなプロセスをダウンタイムなしで垂直方向にスケールアップしたり、トラフィックが少ない時シームレスにスケールダウンすることができます。
さらには起動時に大きなリソースを割り当てて、初期設定が完了したら削減したりするなど、さまざまな可能性が開かれます。

この作業はSIG NodeとSIG Autoscalingが主導した[KEP-1287: In-Place Update of Pod Resources](https://kep.k8s.io/1287)の一環として行われました。

### アルファ: `.kuberc`によるkubectl向けユーザー設定の新しい記述オプション

v1.33にて、`kubectl`は新しいアルファ機能として、ユーザー設定をクラスター設定と分けて明示的に記述するファイル、`.kuberc`を導入します。
このファイルには`kubectl`のエイリアスや上書き設定(例えば[Server-Side Apply](/docs/reference/using-api/server-side-apply/)をデフォルトで使用するなど)を含めることができますが、クラスター認証情報やホスト情報はkubeconfigに残しておく必要があります。

この分離によって、対象クラスターや使用するkubeconfigに関わらず、`kubectl`の操作に関わるユーザー設定は同じ物を使い回せるようになります。

このアルファ機能を有効にするためには、環境変数`KUBECTL_KUBERC=true`を設定し、`.kuberc`設定ファイルを作成して下さい。
デフォルトの状態では、`kubectl`は`~/.kube/kuberc`にこのファイルが無いか探します。
`--kuberc`フラグを使用すると、代わりの場所を指定することもできます。

例: `kubectl --kuberc /var/kube/rc`

この作業はSIG CLIが主導した[KEP-3104: Separate kubectl user preferences from cluster configs](https://kep.k8s.io/3104)の一環として行われました。

## GAに昇格した機能

_これはv1.33リリース後にGAとなった改善点の一部です。_

### インデックス付きJobのインデックスごとのバックオフ制限

このリリースでは、インデックス付きJobのインデックスごとにバックオフ制限を設定できる機能がGAに昇格しました。
従来、Kubernetes Jobの`backoffLimit`パラメーターは、Job全体が失敗とみなされる前の再試行回数を指定していました。
この機能強化により、インデックス付きJob内の各インデックスが独自のバックオフ制限を持つことができるようになり、個々のタスクの再試行動作をより細かく制御できるようになりました。
これにより、特定のインデックスの失敗がJob全体を早期に終了させることなく、他のインデックスが独立して処理を継続できるようになります。

この作業はSIG Appsが主導した[KEP-3850: Backoff Limit Per Index For Indexed Jobs](https://kep.k8s.io/3850)の一環として行われました。

### Job成功ポリシー

`.spec.successPolicy`を使用してユーザーはどのPodインデックスが成功する必要があるか(`succeededIndexes`)、何個のPodが成功する必要があるか(`succeededCount`)、またはその両方の組み合わせを指定できます。
この機能は、部分的な完了で十分なシミュレーションやリーダーの成功だけがJobの全体的な結果を決定するリーダー・ワーカーパターンなど、さまざまなワークロードに利点をもたらします。

この作業はSIG Appsが主導した[KEP-3998: Job success/completion policy](https://kep.k8s.io/3998)の一環として行われました。

### バインドされたServiceAccountトークンのセキュリティ改善

この機能強化では一意のトークン識別子(すなわち[JWT IDクレーム、JTIとも呼ばれる](https://datatracker.ietf.org/doc/html/rfc7519#section-4.1.7))やノード情報をトークン内に含めることで、より正確な検証と監査を可能にする機能などが導入されました。
さらに、ノード固有の制限をサポートし、トークンが指定されたノードでのみ使用可能であることを保証することで、トークンの不正使用や潜在的なセキュリティ侵害のリスクを低減します。
これらの改善は現在一般提供され、Kubernetesクラスター内のサービスアカウントトークンの全体的なセキュリティ態勢を強化することを目的としています。

この作業はSIG Authが主導した[KEP-4193: Bound service account token improvements](https://kep.k8s.io/4193)の一環として行われました。

### kubectlでのサブリソースサポート

`--subresource`引数が現在kubectlのサブコマンド(`get`、`patch`、`edit`、`apply`、`replace`など)で一般提供されるようになり、ユーザーはそれらをサポートするすべてのリソースのサブリソースを取得および更新できるようになりました。
サポートされているサブリソースの詳細については、[Subresources](/docs/reference/kubectl/conventions/#subresources)をご覧ください。

この作業はSIG CLIが主導した[KEP-2590: Add subresource support to kubectl](https://kep.k8s.io/2590)の一環として行われました。

## 複数のサービスCIDR

この機能強化では、サービスIPの割り当てロジックの新しい実装が導入されました。
クラスター全体で、`type: ClusterIP`の各サービスには一意のIPアドレスが割り当てられる必要があります。
既に割り当てられている特定のClusterIPでサービスを作成しようとすると、エラーが返されます。
更新されたIPアドレス割り当てロジックは、`ServiceCIDR`と`IPAddress`という2つの新しく安定化したAPIオブジェクトを使用します。
現在一般提供されているこれらのAPIにより、クラスター管理者は(新しいServiceCIDRオブジェクトを作成することで)`type: ClusterIP`サービスに利用可能なIPアドレスの数を動的に増やすことができます。

この作業はSIG Networkが主導した[KEP-1880: Multiple Service CIDRs](https://kep.k8s.io/1880)の一環として行われました。

### kube-proxyの`nftables`バックエンド

kube-proxyの`nftables`バックエンドがGAになり、Kubernetesクラスター内のサービス実装のパフォーマンスとスケーラビリティを大幅に向上させる新しい実装が追加されました。
互換性の理由から、Linuxノードではデフォルトで`iptables`のままです。
試してみたい場合は[Migrating from iptables mode to nftables](/docs/reference/networking/virtual-ips/#migrating-from-iptables-mode-to-nftables)をご確認ください。

この作業はSIG Networkが主導した[KEP-3866: nftables kube-proxy backend](https://kep.k8s.io/3866)の一環として行われました。

### `trafficDistribution: PreferClose`によるTopology Aware Routing

このリリースでは、Topology Aware Routingとトラフィック分散がGAに昇格し、マルチゾーンクラスターでのサービストラフィックを最適化できるようになりました。
EndpointSliceのTopology Aware Hintによりkube-proxyなどのコンポーネントは同じゾーン内のエンドポイントへのトラフィックルーティングを優先できるようになり、レイテンシーとクロスゾーンデータ転送コストが削減されます。
これを基に、Serviceの仕様に`trafficDistribution`フィールドが追加され、`PreferClose`オプションによりネットワークトポロジーに基づいて最も近い利用可能なエンドポイントにトラフィックが誘導されます。
この構成はゾーン間通信を最小限に抑えることでパフォーマンスとコスト効率を向上させます。

この作業はSIG Networkが主導した[KEP-4444: Traffic Distribution for Services](https://kep.k8s.io/4444)と[KEP-2433: Topology Aware Routing](https://kep.k8s.io/2433)の一環として行われました。

### SMT非対応ワークロードを拒否するオプション

この機能はCPUマネージャーにポリシーオプションを追加し、Simultaneous Multithreading(SMT)構成に適合しないワークロードを拒否できるようにしました。
現在一般提供されているこの機能強化により、PodがCPUコアの排他的使用を要求する場合、CPUマネージャーはSMT対応システムで完全なコアペア(プライマリスレッドと兄弟スレッド両方を含む)の割り当てを強制できるようになり、ワークロードが意図しない方法でCPUリソースを共有するシナリオを防止します。

この作業はSIG Nodeが主導した[KEP-2625: node: cpumanager: add options to reject non SMT-aligned workload](https://kep.k8s.io/2625)の一環として行われました。

### `matchLabelKeys`と`mismatchLabelKeys`を使用したPodアフィニティまたはアンチアフィニティの定義

`matchLabelKeys`と`mismatchLabelKeys`フィールドがPodアフィニティ条件で利用可能になり、ユーザーはPodが共存する(アフィニティ)または共存しない(アンチアフィニティ)べき範囲を細かく制御できるようになりました。
これらの新しく安定化したオプションは、既存の`labelSelector`メカニズムを補完します。
`affinity`フィールドは、多用途なローリングアップデートの強化されたスケジューリングや、グローバル構成に基づいてツールやコントローラーによって管理されるサービスの分離を容易にします。

この作業はSIG Schedulingが主導した[KEP-3633: Introduce MatchLabelKeys to Pod Affinity and Pod Anti Affinity](https://kep.k8s.io/3633)の一環として行われました。

### Podトポロジー分散制約スキューの計算時にtaintとtolerationを考慮する

この機能強化は`PodTopologySpread`に`nodeAffinityPolicy`と`nodeTaintsPolicy`という2つのフィールドを導入しました。
これらのフィールドにより、ユーザーはノード間のPod分散のスキュー(偏り)を計算する際にノードアフィニティルールとノードテイントを考慮すべきかどうかを指定できます。
デフォルトでは、`nodeAffinityPolicy`は`Honor`に設定されており、Podのノードアフィニティまたはセレクターに一致するノードのみが分散計算に含まれることを意味します。
`nodeTaintsPolicy`はデフォルトで`Ignore`に設定されており、指定されない限りノードテイントは考慮されないことを示します。
この機能強化によりPod配置のより細かい制御が可能になり、Podがアフィニティとテイント許容の両方の要件を満たすノードにスケジュールされることを保証し、制約を満たさないためにPodが保留状態のままになるシナリオを防止します。

この作業はSIG Schedulingが主導した[KEP-3094: Take taints/tolerations into consideration when calculating PodTopologySpread skew](https://kep.k8s.io/3094)の一環として行われました。

### Volume Populators

v1.24でベータとしてリリースされた後、_Volume Populators_ はv1.33でGAに昇格しました。
この新しく安定化した機能は、ユーザーがPersistentVolumeClaim(PVC)クローンやボリュームスナップショットだけでなく、様々なソースからのデータでボリュームを事前に準備する方法を提供します。
このメカニズムはPersistentVolumeClaim内の`dataSourceRef`フィールドに依存しています。
このフィールドは既存の`dataSource`フィールドよりも柔軟性が高く、カスタムリソースをデータソースとして使用することができます。

特別なコントローラーである`volume-data-source-validator`は、VolumePopulatorという名前のAPI種別のための新しく安定化したCustomResourceDefinition(CRD)と共に、これらのデータソース参照を検証します。
VolumePopulator APIにより、ボリュームポピュレーターコントローラーはサポートするデータソースのタイプを登録できます。
ボリュームポピュレーターを使用するには、適切なCRDでクラスターをセットアップする必要があります。

この作業はSIG Storageが主導した[KEP-1495: Generic data populators](https://kep.k8s.io/1495)の一環として行われました。

### PersistentVolumeの再利用ポリシーを常に尊重する

この機能強化はPersistent Volume(PV)の再利用ポリシーが一貫して尊重されない問題に対処したもので、ストレージリソースのリークを防ぎます。
具体的にはPVがその関連するPersistent Volume Claim(PVC)より先に削除された場合、再利用ポリシー(`Delete`)が実行されず、基盤となるストレージアセットがそのまま残ってしまう可能性がありました。
これを緩和するために、Kubernetesは関連するPVにファイナライザーを設定し、削除順序に関係なく再利用ポリシーが適用されるようになりました。
この機能強化により、ストレージリソースの意図しない保持を防ぎ、PVライフサイクル管理の一貫性を維持します。

この作業はSIG Storageが主導した[KEP-2644: Always Honor PersistentVolume Reclaim Policy](https://kep.k8s.io/2644)の一環として行われました。

## ベータの新機能

_これはv1.33リリース後にベータとなった改善点の一部です。_

### Windowsのkube-proxyにおけるDirect Service Return (DSR)のサポート

DSRは、ロードバランサーを経由するリターントラフィックがロードバランサーをバイパスしてクライアントに直接応答できるようにすることでパフォーマンスを最適化します。
これによりロードバランサーの負荷が軽減され、全体的なレイテンシーも低減されます。
Windows上のDSRに関する情報は、[Direct Server Return (DSR) in a nutshell](https://techcommunity.microsoft.com/blog/networkingblog/direct-server-return-dsr-in-a-nutshell/693710)をお読みください。

v1.14で最初に導入されたDSRのサポートは、[KEP-5100: Support for Direct Service Return (DSR) and overlay networking in Windows kube-proxy](https://kep.k8s.io/5100)の一環としてSIG Windowsによりベータに昇格しました。

### 構造化パラメーターのサポート

構造化パラメーターのサポートはKubernetes v1.33でベータ機能として継続される中、Dynamic Resource Allocation(DRA)のこの中核部分に大幅な改善が見られました。
新しいv1beta2バージョンは`resource.k8s.io` APIを簡素化し、名前空間クラスターの`edit`ロールを持つ一般ユーザーが現在DRAを使用できるようになりました。

`kubelet`は現在シームレスなアップグレードサポートを含み、DaemonSetとしてデプロイされたドライバーがローリングアップデートメカニズムを使用できるようになっています。
DRA実装では、これによりResourceSliceの削除と再作成が防止され、アップグレード中も変更されないままにすることができます。
さらに、ドライバーの登録解除後に`kubelet`がクリーンアップを行う前に30秒の猶予期間が導入され、ローリングアップデートを使用しないドライバーのサポートが向上しました。

この作業はSIG Node、SIG Scheduling、SIG Autoscalingを含む機能横断チームであるWG Device Managementによる[KEP-4381: DRA: structured parameters](https://kep.k8s.io/4381)の一環として行われました。

### ネットワークインターフェース向けDynamic Resource Allocation(DRA)

v1.32で導入されたDRAによるネットワークインターフェースデータの標準化された報告がv1.33でベータに昇格しました。
これにより、よりネイティブなKubernetesネットワークの統合が可能になり、ネットワークデバイスの開発と管理が簡素化されます。
これについては以前に[v1.32リリース発表ブログ](/ja/blog/2024/12/11/kubernetes-v1-32-release/#dra-resourceclaimステータスのための標準化されたネットワークインターフェースデータ)で説明されています。

この作業はSIG Network、SIG Node、およびWG Device Managementが主導した[KEP-4817: DRA: Resource Claim Status with possible standardized network interface data](https://kep.k8s.io/4817)の一環として行われました。

### スケジューラーが`activeQ`にPodを持たない場合に、スケジュールされていないPodを早期に処理

この機能はキュースケジューリングの動作を改善します。
裏側では、スケジューラーは`activeQ`が空の場合に、エラーによってバックオフされていないPodを`backoffQ`からポップすることでこれを実現しています。
以前は、`activeQ`が空の場合でもスケジューラーはアイドル状態になってしまいましたが、この機能強化はそれを防止することでスケジューリング効率を向上させます。

この作業はSIG Schedulingが主導した[KEP-5142: Pop pod from backoffQ when activeQ is empty](https://kep.k8s.io/5142)の一環として行われました。

### Kubernetesスケジューラーにおける非同期プリエンプション

プリエンプションは、優先度の低いPodを退避させることで、優先度の高いPodが必要なリソースを確保できるようにします。
v1.32でアルファとして導入された非同期プリエンプションがv1.33でベータに昇格しました。
この機能強化により、Podを削除するためのAPIコールなどの重い操作が並行して処理されるようになり、スケジューラーは遅延なく他のPodのスケジューリングを継続できます。
この改善は特にPodの入れ替わりが激しいクラスターやスケジューリングの失敗が頻繁に発生するクラスターで有益であり、より効率的で回復力のあるスケジューリングプロセスを確保します。

この作業はSIG Schedulingが主導した[KEP-4832: Asynchronous preemption in the scheduler](https://kep.k8s.io/4832)の一環として行われました。

### ClusterTrustBundle

X.509トラストアンカー(ルート証明書)を保持するために設計されたクラスタースコープリソースであるClusterTrustBundleがv1.33でベータに昇格しました。
このAPIにより、クラスター内の証明書署名者がX.509トラストアンカーをクラスターワークロードに公開および通信することが容易になります。

この作業はSIG Authが主導した[KEP-3257: ClusterTrustBundles (previously Trust Anchor Sets)](https://kep.k8s.io/3257)の一環として行われました。

### きめ細かいSupplementalGroupsの制御

v1.31で導入されたこの機能はv1.33でベータに昇格し、現在はデフォルトで有効になっています。
クラスターでフィーチャーゲートの`SupplementalGroupsPolicy`が有効になっている場合、Podの`securityContext`内の`supplementalGroupsPolicy`フィールドは2つのポリシーをサポートします:
デフォルトのMergeポリシーはコンテナイメージの`/etc/group`ファイルからのグループと指定されたグループを結合することで後方互換性を維持し、新しいStrictポリシーは明示的に定義されたグループのみを適用します。

この機能強化は、コンテナイメージからの暗黙的なグループメンバーシップが意図しないファイルアクセス権限につながり、ポリシー制御をバイパスする可能性があるセキュリティ上の懸念に対処するのに役立ちます。

この作業はSIG Nodeが主導した[KEP-3619: Fine-grained SupplementalGroups control](https://kep.k8s.io/3619)の一環として行われました。

### イメージをボリュームとしてマウントする機能をサポート

v1.31で導入されたPodでOpen Container Initiative(OCI)イメージをボリュームとして使用する機能のサポートがベータに昇格しました。
この機能により、ユーザーはPod内でイメージ参照をボリュームとして指定し、コンテナ内でボリュームマウントとして再利用できるようになります。
これにより、ボリュームデータを別々にパッケージ化し、メインイメージに含めることなくPod内のコンテナ間で共有する可能性が開かれ、脆弱性を減らしイメージ作成を簡素化します。

この作業はSIG NodeとSIG Storageが主導した[KEP-4639: VolumeSource: OCI Artifact and/or Image](https://kep.k8s.io/4639)の一環として行われました。

### Linux Podにおけるユーザー名前空間のサポート

執筆時点で最も古いオープンなKEPの1つである[KEP-127](https://kep.k8s.io/127)は、Pod用のLinux[ユーザー名前空間](/ja/docs/concepts/workloads/pods/user-namespaces/)を使用したPodセキュリティの改善です。
このKEPは2016年後半に最初に提案され、複数の改訂を経て、v1.25でアルファリリース、v1.30で初期ベータ(デフォルトでは無効)となり、v1.33の一部としてデフォルトで有効なベータに移行しました。

このサポートは、手動で`pod.spec.hostUsers`を指定してオプトインしない限り、既存のPodに影響を与えません。
[v1.30の先行紹介ブログ](/ja/blog/2024/03/12/kubernetes-1-30-upcoming-changes/)で強調されているように、これは脆弱性を軽減するための重要なマイルストーンです。

この作業はSIG Nodeが主導した[KEP-127: Support User Namespaces in pods](https://kep.k8s.io/127)の一環として行われました。

### Podの`procMount`オプション

v1.12でアルファとして導入され、v1.31でデフォルト無効のベータだった`procMount`オプションが、v1.33でデフォルト有効のベータに移行しました。
この機能強化はユーザーが`/proc`ファイルシステムへのアクセスを細かく調整できるようにすることでPod分離を改善します。
具体的には、Podの`securityContext`にフィールドを追加し、特定の`/proc`パスをマスクしたり読み取り専用としてマークするデフォルトの動作をオーバーライドできるようにします。
これは特に、ユーザーがユーザー名前空間を使用してKubernetes Pod内で非特権コンテナを実行したい場合に便利です。
通常、コンテナランタイム(CRI実装を介して)は厳格な`/proc`マウント設定で外部コンテナを起動します。
しかし、非特権Pod内でネストされたコンテナを正常に実行するには、ユーザーはそれらのデフォルト設定を緩和するメカニズムが必要であり、この機能はまさにそれを提供します。

この作業はSIG Nodeが主導した[KEP-4265: add ProcMount option](https://kep.k8s.io/4265)の一環として行われました。

### NUMAノード間でCPUを分散させるCPUManagerポリシー

この機能はCPUManagerに、単一ノードに集中させるのではなく非一様メモリアクセス(NUMA)ノード間でCPUを分散させる新しいポリシーオプションを追加します。
これにより複数のNUMAノード間でワークロードのバランスを取ることでCPUリソースの割り当てを最適化し、マルチNUMAシステムにおけるパフォーマンスとリソース使用率を向上させます。

この作業はSIG Nodeが主導した[KEP-2902: Add CPUManager policy option to distribute CPUs across NUMA nodes instead of packing them](https://kep.k8s.io/2902)の一環として行われました。

### コンテナのPreStopフックのゼロ秒スリープ

Kubernetes 1.29ではPodの`preStop`ライフサイクルフックにSleepアクションが導入され、コンテナが終了する前に指定された時間だけ一時停止できるようになりました。
これにより、接続のドレイン(排出)やクリーンアップ操作などのタスクを容易にするコンテナのシャットダウンを遅らせるための簡単な方法が提供されます。

`preStop`フックのSleepアクションは、現在ベータ機能としてゼロ秒の時間を受け付けることができます。
これにより、`preStop`フックが必要だが遅延が不要な場合に便利な、無操作(no-op)の`preStop`フックを定義できるようになります。

この作業はSIG Nodeが主導した[KEP-3960: Introducing Sleep Action for PreStop Hook](https://kep.k8s.io/3960)および[KEP-4818: Allow zero value for Sleep Action of PreStop Hook](https://kep.k8s.io/4818)の一環として行われました。

### Kubernetesネイティブ型の宣言的検証のための内部ツール

ひそかに、Kubernetesの内部はオブジェクトとオブジェクトへの変更を検証するための新しいメカニズムの使用を開始しています。
Kubernetes v1.33では、Kubernetesコントリビューターが宣言的な検証ルールを生成するために使用する内部ツール`validation-gen`を導入しています。
全体的な目標は、開発者が検証制約を宣言的に指定できるようにすることでAPI検証の堅牢性と保守性を向上させ、手動コーディングエラーを減らし、コードベース全体での一貫性を確保することです。

この作業はSIG API Machineryが主導した[KEP-5073: Declarative Validation Of Kubernetes Native Types With validation-gen](https://kep.k8s.io/5073)の一環として行われました。

## アルファの新機能

_これはv1.33リリース後にアルファとなった改善点の一部です。_

### HorizontalPodAutoscalerの設定可能な許容値

この機能は、HorizontalPodAutoscaler設定可能な許容値を導入し、小さなメトリクス変動に対するスケーリング反応を抑制します。

この作業はSIG Autoscalingが主導した[KEP-4951: Configurable tolerance for Horizontal Pod Autoscalers](https://kep.k8s.io/4951)の一環として行われました。

### 設定可能なコンテナの再起動遅延

CrashLoopBackOffの処理方法を微調整できる機能です。

この作業はSIG Nodeが主導した[KEP-4603: Tune CrashLoopBackOff](https://kep.k8s.io/4603)の一環として行われました。

### カスタムコンテナの停止シグナル

Kubernetes v1.33より前では、停止シグナルはコンテナイメージ定義内でのみ設定可能でした(例えば、イメージメタデータの`StopSignal`フィールドを介して)。
終了動作を変更したい場合は、カスタムコンテナイメージをビルドする必要がありました。
Kubernetes v1.33で(アルファの)フィーチャーゲートである`ContainerStopSignals`を有効にすることで、Pod仕様内で直接カスタム停止シグナルを定義できるようになりました。
これはコンテナの`lifecycle.stopSignal`フィールドで定義され、Podの`spec.os.name`フィールドが存在する必要があります。
指定されない場合、コンテナはイメージで定義された停止シグナル(存在する場合)、またはコンテナランタイムのデフォルト(通常Linuxの場合はSIGTERM)にフォールバックします。

この作業はSIG Nodeが主導した[KEP-4960: Container Stop Signals](https://kep.k8s.io/4960)の一環として行われました。

### 豊富なDRA機能強化

Kubernetes v1.33は、今日の複雑なインフラストラクチャ向けに設計された機能を備えたDynamic Resource Allocation (DRA)の開発を継続しています。
DRAはPod間およびPod内のコンテナ間でリソースを要求および共有するためのAPIです。
通常、それらのリソースはGPU、FPGA、ネットワークアダプターなどのデバイスです。

以下はv1.33で導入されたすべてのアルファのDRAのフィーチャーゲートです:

- ノードテイントと同様に、フィーチャーゲートの`DRADeviceTaints`を有効にすることで、デバイスはTaintとTolerationをサポートします。
  管理者またはコントロールプレーンコンポーネントはデバイスにテイントを付けて使用を制限できます。
  テイントが存在する間、それらのデバイスに依存するPodのスケジューリングを一時停止したり、テイントされたデバイスを使用するPodを退避させたりすることができます。
- フィーチャーゲートの`DRAPrioritizedList`を有効にすることで、DeviceRequestsは`firstAvailable`という新しいフィールドを取得します。
  このフィールドは順序付けられたリストで、ユーザーが特定のハードウェアが利用できない場合に何も割り当てないことを含め、リクエストが異なる方法で満たされる可能性を指定できるようにします。
- フィーチャーゲートの`DRAAdminAccess`を有効にすると、`resource.k8s.io/admin-access: "true"`でラベル付けされた名前空間内でResourceClaimまたはResourceClaimTemplateオブジェクトを作成する権限を持つユーザーのみが`adminAccess`フィールドを使用できます。
  これにより、管理者以外のユーザーが`adminAccess`機能を誤用できないようになります。
- v1.31以降、デバイスパーティションの使用が可能でしたが、ベンダーはデバイスを事前にパーティション分割し、それに応じて通知する必要がありました。
  v1.33でフィーチャーゲートの`DRAPartitionableDevices`を有効にすることで、デバイスベンダーは重複するものを含む複数のパーティションを通知できます。
  Kubernetesスケジューラーはワークロード要求に基づいてパーティションを選択し、競合するパーティションの同時割り当てを防止します。
  この機能により、ベンダーは割り当て時に動的にパーティションを作成する機能を持ちます。
  割り当てと動的パーティショニングは自動的かつユーザーに透過的に行われ、リソース使用率の向上を可能にします。

これらのフィーチャーゲートは、フィーチャーゲートの`DynamicResourceAllocation`も有効にしない限り効果がありません。

この作業はSIG Node、SIG Scheduling、SIG Authが主導した
[KEP-5055: DRA: device taints and tolerations](https://kep.k8s.io/5055)、
[KEP-4816: DRA: Prioritized Alternatives in Device Requests](https://kep.k8s.io/4816)、
[KEP-5018: DRA: AdminAccess for ResourceClaims and ResourceClaimTemplates](https://kep.k8s.io/5018)、
および[KEP-4815: DRA: Add support for partitionable devices](https://kep.k8s.io/4815)の一環として行われました。

### `IfNotPresent`と`Never`のイメージに対する認証を行う堅牢なimagePullPolicy

この機能により、ユーザーはイメージがノード上に既に存在するかどうかに関わらず、新しい資格情報セットごとにkubeletがイメージプル認証チェックを要求することを確実にできます。

この作業はSIG Authが主導した[KEP-2535: Ensure secret pulled images](https://kep.k8s.io/2535)の一環として行われました。

### Downward APIを通じて利用可能なノードトポロジーラベル

この機能により、ノードトポロジーラベルがダウンワードAPIを通じて公開されるようになります。
Kubernetes v1.33より前では、基盤となるノードについてKubernetes APIに問い合わせるために初期化コンテナを使用する回避策が必要でした。
このアルファ機能により、ワークロードがノードトポロジー情報にアクセスする方法が簡素化されます。

この作業はSIG Nodeが主導した[KEP-4742: Expose Node labels via downward API](https://kep.k8s.io/4742)の一環として行われました。

### 生成番号と観測された生成番号によるより良いPodステータス

この変更以前は、`metadata.generation`フィールドはPodでは使用されていませんでした。
`metadata.generation`をサポートするための拡張に加えて、この機能は`status.observedGeneration`を導入し、より明確なPodステータスを提供します。

この作業はSIG Nodeが主導した[KEP-5067: Pod Generation](https://kep.k8s.io/5067)の一環として行われました。

### kubeletのCPU Managerによる分割レベル3キャッシュアーキテクチャのサポート

これまでのkubeletのCPU Managerは分割L3キャッシュアーキテクチャ(Last Level Cache、またはLLCとも呼ばれる)を認識せず、分割L3キャッシュを考慮せずにCPU割り当てを分散させる可能性があり、ノイジーネイバー問題を引き起こす可能性がありました。
このアルファ機能はCPU Managerを改善し、より良いパフォーマンスのためにCPUコアをより適切に割り当てます。

この作業はSIG Nodeが主導した[KEP-5109: Split L3 Cache Topology Awareness in CPU Manager](https://kep.k8s.io/5109)の一環として行われました。

### スケジューリング改善のためのPSI(Pressure Stall Information)メトリクス

この機能は、Linuxノードにcgroupv2を使用してPSI統計とメトリクスを提供するサポートを追加します。
これによりリソース不足を検出し、Podスケジューリングのためのより細かい制御をノードに提供できます。

この作業はSIG Nodeが主導した[KEP-4205: Support PSI based on cgroupv2](https://kep.k8s.io/4205)の一環として行われました。

### kubeletによるシークレットレスイメージPull

kubeletのオンディスク認証情報プロバイダーが、オプションでKubernetes ServiceAccount(SA)トークンの取得をサポートするようになりました。
これにより、クラウドプロバイダーはOIDC互換のアイデンティティソリューションとより適切に統合でき、イメージレジストリとの認証が簡素化されます。

この作業はSIG Authが主導した[KEP-4412: Projected service account tokens for Kubelet image credential providers](https://kep.k8s.io/4412)の一環として行われました。

## v1.33での昇格、非推奨化、および削除

### GAへの昇格

これは安定版(一般提供、GAとも呼ばれる)に昇格したすべての機能を一覧にしたものです。
アルファからベータへの昇格や新機能を含む更新の完全なリストについては、リリースノートをご覧ください。

このリリースには、GAに昇格した合計18の機能強化が含まれています:

- [Take taints/tolerations into consideration when calculating PodTopologySpread skew](https://github.com/kubernetes/enhancements/issues/3094)
- [Introduce `MatchLabelKeys` to Pod Affinity and Pod Anti Affinity](https://github.com/kubernetes/enhancements/issues/3633)
- [Bound service account token improvements](https://github.com/kubernetes/enhancements/issues/4193)
- [Generic data populators](https://github.com/kubernetes/enhancements/issues/1495)
- [Multiple Service CIDRs](https://github.com/kubernetes/enhancements/issues/1880)
- [Topology Aware Routing](https://github.com/kubernetes/enhancements/issues/2433)
- [Portworx file in-tree to CSI driver migration](https://github.com/kubernetes/enhancements/issues/2589)
- [Always Honor PersistentVolume Reclaim Policy](https://github.com/kubernetes/enhancements/issues/2644)
- [nftables kube-proxy backend](https://github.com/kubernetes/enhancements/issues/3866)
- [Deprecate status.nodeInfo.kubeProxyVersion field](https://github.com/kubernetes/enhancements/issues/4004)
- [Add subresource support to kubectl](https://github.com/kubernetes/enhancements/issues/2590)
- [Backoff Limit Per Index For Indexed Jobs](https://github.com/kubernetes/enhancements/issues/3850)
- [Job success/completion policy](https://github.com/kubernetes/enhancements/issues/3998)
- [Sidecar Containers](https://github.com/kubernetes/enhancements/issues/753)
- [CRD Validation Ratcheting](https://github.com/kubernetes/enhancements/issues/4008)
- [node: cpumanager: add options to reject non SMT-aligned workload](https://github.com/kubernetes/enhancements/issues/2625)
- [Traffic Distribution for Services](https://github.com/kubernetes/enhancements/issues/4444)
- [Recursive Read-only (RRO) mounts](https://github.com/kubernetes/enhancements/issues/3857)

### 非推奨化と削除 {#deprecations-and-removals}

Kubernetesの開発と成熟に伴い、プロジェクト全体の健全性を向上させるために機能が非推奨化されたり、削除されたり、より良い機能に置き換えられたりすることがあります。
このプロセスに関する詳細は、[Kubernetes非推奨ポリシー](/ja/docs/reference/using-api/deprecation-policy/)を参照してください。
これらの非推奨化や削除の多くは、[Kubernetes v1.33の先行紹介ブログ](/ja/blog/2025/03/26/kubernetes-v1-33-upcoming-changes)で告知されました。

#### Endpoints APIの非推奨化

v1.21以降GAされた[EndpointSlice](/docs/concepts/services-networking/endpoint-slices/) APIは、元のEndpoint APIを事実上置き換えました。
元のEndpoint APIはシンプルで分かりやすかったものの、多数のネットワークエンドポイントへスケーリングする際にいくつかの課題がありました。
EndpointSlice APIにはデュアルスタックネットワーキングなどの新機能が導入され、これにより元のEndpoint APIは非推奨化されることになりました。

この非推奨化は、ワークロードやスクリプトからEndpoint APIを直接使用しているユーザーにのみ影響します。
これらのユーザーは代わりにEndpointSliceを使用するように移行する必要があります。
非推奨化による影響と移行計画に関する詳細を記載した専用のブログ記事が公開される予定です。

詳細は[KEP-4974: Deprecate v1.Endpoints](https://kep.k8s.io/4974)で確認できます。

#### Nodeステータスにおけるkube-proxyバージョン情報の削除

v1.31の[「Deprecation of status.nodeInfo.kubeProxyVersion field for Nodes」](/blog/2024/07/19/kubernetes-1-31-upcoming-changes/#deprecation-of-status-nodeinfo-kubeproxyversion-field-for-nodes-kep-4004-https-github-com-kubernetes-enhancements-issues-4004)で強調されているように、v1.31での非推奨化に続き、Nodeの`.status.nodeInfo.kubeProxyVersion`フィールドがv1.33で削除されました。

このフィールドはkubeletによって設定されていましたが、その値は一貫して正確ではありませんでした。
v1.31以降デフォルトで無効化されていたため、このフィールドはv1.33で完全に削除されました。

詳細は[KEP-4004: Deprecate status.nodeInfo.kubeProxyVersion field](https://kep.k8s.io/4004)で確認できます。

#### インツリーのgitRepoボリュームドライバーの削除

`gitRepo`ボリュームタイプは、約7年前のv1.11から非推奨化されていました。
非推奨化されて以降、`gitRepo`ボリュームタイプがノード上でrootとしてリモートコード実行を得るためにどのように悪用されうるかといった、セキュリティ上の懸念がありました。
v1.33では、インツリーのドライバーコードが削除されます。

代替手段として`git-sync`やinitコンテナがあります。
Kubernetes APIの`gitVolumes`は削除されないため、`gitRepo`ボリュームを持つPodは`kube-apiserver`によって受け入れられます。
しかし、フィーチャーゲートの`GitRepoVolumeDriver`が`false`に設定されている`kubelet`はそれらを実行せず、ユーザーに適切なエラーを返します。
これにより、ユーザーはワークロードを修正するための十分な時間を確保するために、3バージョン分の期間、ドライバーの再有効化をオプトインできます。

`kubelet`のフィーチャーゲートとインツリーのプラグインコードは、v1.39リリースで削除される予定です。

詳細は[KEP-5040: Remove gitRepo volume driver](https://kep.k8s.io/5040)で確認できます。

#### Windows Podにおけるホストネットワークサポートの削除

Windows Podのネットワーキングは、コンテナがNodeのネットワーク名前空間を使用できるようにすることでLinuxとの機能パリティを達成し、クラスター密度を向上させることを目指していました。
元の実装はv1.26でアルファとして導入されましたが、予期せぬ`containerd`の挙動に直面し、代替ソリューションが存在したため、Kubernetesプロジェクトは関連するKEPを取り下げることを決定しました。
サポートはv1.33で完全に削除されました。

これは、ホストネットワークおよびホストレベルのアクセスを提供する[HostProcessコンテナ](/docs/tasks/configure-pod-container/create-hostprocess-pod/)には影響しないことに注意してください。
v1.33で取り下げられたKEPは、ホストネットワークのみを提供することに関するものでしたが、Windowsのネットワーキングロジックにおける技術的な制限のため、安定することはありませんでした。

詳細は[KEP-3503: Host network support for Windows pods](https://kep.k8s.io/3503)で確認できます。

## リリースノート

Kubernetes v1.33リリースの詳細については、[リリースノート](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.33.md)をご覧ください。

## 入手方法

Kubernetes v1.33は[GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.33.0)または[Kubernetes公式サイトのダウンロードページ](/releases/download/)からダウンロードできます。

Kubernetesを始めるには、[チュートリアル](/docs/tutorials/)をチェックするか、[minikube](https://minikube.sigs.k8s.io/)を使用してローカルKubernetesクラスターを実行してください。
また、[kubeadm](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)を使用して簡単にv1.33をインストールすることもできます。

## リリースチーム

Kubernetesはそのコミュニティのサポート、コミットメント、そして懸命な働きによってのみ実現可能です。
リリースチームは、ユーザーが依存するKubernetesリリースを構成する多くの部分を構築するために協力する、献身的なコミュニティボランティアによって構成されています。
これには、コード自体からドキュメンテーションやプロジェクト管理まで、コミュニティのあらゆる分野の人々の専門的なスキルが必要です。

私たちは、Kubernetes v1.33リリースをコミュニティに提供するために熱心に取り組んだ時間について、[リリースチーム](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.33/release-team.md)全体に感謝します。
リリースチームのメンバーは、初めてのShadow(見習い)から、複数のリリースサイクルで培われた経験を持ち、復帰をしたチームリードまで幅広く存在します。
このリリースサイクルでは、リリースノートとDocsのサブチームを統合し、Docsサブチームに統一するという新しいチーム構造が採用されました。
新しいDocsチームから関連情報とリソースを整理する綿密な努力のおかげで、リリースノートとDocsの追跡は円滑かつ成功した移行を実現しました。
最後に、成功したリリースサイクルを通してのサポート、支援、誰もが効果的に貢献できるようにする取り組み、そしてリリースプロセスを改善するための課題に対して、リリースリードのNina Polshakovaに心より感謝します。

## プロジェクトの活動状況

CNCF K8sの[DevStats](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&var-period=m&var-repogroup_name=All)プロジェクトは、Kubernetesおよび様々なサブプロジェクトの活動状況に関する興味深いデータポイントを集計しています。
これには個人の貢献から貢献企業数まで含まれ、このエコシステムの発展に費やされる努力の深さと広さを示しています。

v1.33リリースサイクル(2025年1月13日から4月23日までの15週間)において、Kubernetesには最大121の異なる企業と570人の個人から貢献がありました(執筆時点では、リリース日の数週間前の数値です)。
より広範なクラウドネイティブエコシステムでは、この数字は435社、合計2400人のコントリビューターに達しています。
データソースは[このダッシュボード](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&var-period=d28&var-repogroup_name=All&var-repo_name=kubernetes%2Fkubernetes&from=1736755200000&to=1745477999000)で確認できます。
[前回のリリースv1.32の活動データ](/blog/2024/12/11/kubernetes-v1-32-release/#project-velocity)と比較すると、企業や個人からの貢献レベルは同様であり、コミュニティの関心と参加が引き続き強いことを示しています。

なお、「貢献」とはコミットの作成、コードレビュー、コメント、IssueやPRの作成、PRのレビュー(ブログやドキュメントを含む)、またはIssueやPRへのコメントを行うことを指します。
貢献に興味がある場合は、公式ドキュメントのコントリビューター向けの[はじめに](https://www.kubernetes.dev/docs/guide/#getting-started)をご覧ください。

Kubernetesプロジェクトとコミュニティの全体的な活動状況についてさらに詳しく知るには、[DevStatsをチェック](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&var-period=m&var-repogroup_name=All)してください。

## イベント情報

今後開催予定のKubernetesおよびクラウドネイティブイベント(KubeCon + CloudNativeCon、KCDなど)や、世界各地で開催される主要なカンファレンスについて紹介します。
Kubernetesコミュニティの最新情報を入手し、参加しましょう！

**2025年5月**

- [**KCD - Kubernetes Community Days: Costa Rica**](https://community.cncf.io/events/details/cncf-kcd-costa-rica-presents-kcd-costa-rica-2025/):
  2025年5月3日 | コスタリカ、エレディア
- [**KCD - Kubernetes Community Days: Helsinki**](https://community.cncf.io/events/details/cncf-kcd-helsinki-presents-kcd-helsinki-2025/):
  2025年5月6日 | フィンランド、ヘルシンキ
- [**KCD - Kubernetes Community Days: Texas Austin**](https://community.cncf.io/events/details/cncf-kcd-texas-presents-kcd-texas-austin-2025/):
  2025年5月15日 | アメリカ、オースティン
- [**KCD - Kubernetes Community Days: Seoul**](https://community.cncf.io/events/details/cncf-kcd-south-korea-presents-kcd-seoul-2025/):
  2025年5月22日 | 韓国、ソウル
- [**KCD - Kubernetes Community Days: Istanbul, Turkey**](https://community.cncf.io/events/details/cncf-kcd-istanbul-presents-kcd-istanbul-2025/):
  2025年5月23日 | トルコ、イスタンブール
- [**KCD - Kubernetes Community Days: San Francisco Bay Area**](https://community.cncf.io/events/details/cncf-kcd-sf-bay-area-presents-kcd-san-francisco-bay-area/):
  2025年5月28日 | アメリカ、サンフランシスコ

**2025年6月**

- [**KCD - Kubernetes Community Days: New York**](https://community.cncf.io/events/details/cncf-kcd-new-york-presents-kcd-new-york-2025/):
  2025年6月4日 | アメリカ、ニューヨーク
- [**KCD - Kubernetes Community Days: Czech & Slovak**](https://community.cncf.io/events/details/cncf-kcd-czech-slovak-presents-kcd-czech-amp-slovak-bratislava-2025/):
  2025年6月5日 | スロバキア、ブラチスラバ
- [**KCD - Kubernetes Community Days: Bengaluru**](https://community.cncf.io/events/details/cncf-kcd-bengaluru-presents-kubernetes-community-days-bengaluru-2025-in-person/):
  2025年6月6日 | インド、バンガロール
- [**KubeCon + CloudNativeCon China 2025**](https://events.linuxfoundation.org/kubecon-cloudnativecon-china/):
  2025年6月10日-11日 | 香港
- [**KCD - Kubernetes Community Days: Antigua Guatemala**](https://community.cncf.io/events/details/cncf-kcd-guatemala-presents-kcd-antigua-guatemala-2025/):
  2025年6月14日 | グアテマラ、アンティグア・グアテマラ
- [**KubeCon + CloudNativeCon Japan 2025**](https://events.linuxfoundation.org/kubecon-cloudnativecon-japan):
  2025年6月16日-17日 | 日本、東京
- [**KCD - Kubernetes Community Days: Nigeria, Africa**](https://www.cncf.io/kcds/):
  2025年6月19日 | アフリカ、ナイジェリア

**2025年7月**

- [**KCD - Kubernetes Community Days: Utrecht**](https://community.cncf.io/events/details/cncf-kcd-netherlands-presents-kcd-utrecht-2025/):
  2025年7月4日 | オランダ、ユトレヒト
- [**KCD - Kubernetes Community Days: Taipei**](https://community.cncf.io/events/details/cncf-kcd-taiwan-presents-kcd-taipei-2025/):
  2025年7月5日 | 台湾、台北
- [**KCD - Kubernetes Community Days: Lima, Peru**](https://community.cncf.io/events/details/cncf-kcd-lima-peru-presents-kcd-lima-peru-2025/):
  2025年7月19日 | ペルー、リマ

**2025年8月**

- [**KubeCon + CloudNativeCon India 2025**](https://events.linuxfoundation.org/kubecon-cloudnativecon-india-2025/):
  2025年8月6日-7日 | インド、ハイデラバード
- [**KCD - Kubernetes Community Days: Colombia**](https://community.cncf.io/events/details/cncf-kcd-colombia-presents-kcd-colombia-2025/):
  2025年8月29日 | コロンビア、ボゴタ

最新のKCD情報は[こちら](https://www.cncf.io/kcds/)でご確認いただけます。

## ウェビナーのご案内

Kubernetes v1.33リリースチームのメンバーと一緒に **2025年5月16日(金)午後4時(UTC)** から、このリリースのハイライトやアップグレードの計画に役立つ非推奨事項や削除事項について学びましょう。
詳細および参加登録は、CNCFオンラインプログラム・サイトの[イベントページ](https://community.cncf.io/events/details/cncf-cncf-online-programs-presents-cncf-live-webinar-kubernetes-133-release/)をご覧ください。

## 参加方法

Kubernetesに関わる最も簡単な方法は、あなたの興味に合った[Special Interest Groups](https://github.com/kubernetes/community/blob/master/sig-list.md) (SIGs)のいずれかに参加することです。
Kubernetesコミュニティに向けて何か発信したいことはありますか？
毎週の[コミュニティミーティング](https://github.com/kubernetes/community/tree/master/communication)や、以下のチャンネルであなたの声を共有してください。
継続的なフィードバックとサポートに感謝いたします。

- 最新情報はBlueSkyの[@kubernetes.io](https://bsky.app/profile/kubernetes.io)をフォローしてください
- [Discuss](https://discuss.kubernetes.io/)でコミュニティディスカッションに参加してください
- [Slack](http://slack.k8s.io/)でコミュニティに参加してください
- [Server Fault](https://serverfault.com/questions/tagged/kubernetes)か[Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)で質問したり、回答したりしてください
- あなたのKubernetesに関する[ストーリー](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)を共有してください
- Kubernetesの最新情報は[ブログ](https://kubernetes.io/blog/)でさらに詳しく読むことができます
- [Kubernetes Release Team](https://github.com/kubernetes/sig-release/tree/master/release-team)についての詳細はこちらをご覧ください
