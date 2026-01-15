---  
layout: blog
title: "Kubernetes v1.35: Timbernetes (The World Tree Release)"
date: 2025-12-17T10:30:00-08:00
evergreen: true
slug: kubernetes-v1-35-release
author: >
  [Kubernetes v1.35 Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.35/release-team.md)
translator: >
  [Taisuke Okamoto](https://github.com/b1gb4by) ([PLAID, Inc.](https://plaid.co.jp/)),
  [Takuya Kitamura](https://github.com/kfess),
  [Junya Okabe](https://github.com/Okabe-Junya) (筑波大学)
---

**編集者**: Aakanksha Bhende, Arujjwal Negi, Chad M. Crowell, Graziano Casto, Swathi Rao

前回のリリースと同様に、Kubernetes v1.35のリリースでは新しいGA、ベータ版、アルファ版の機能が導入されます。
高品質なリリースの継続的な提供は、私たちの開発サイクルの強さとコミュニティからの活発なサポートを示しています。

このリリースは60個の機能改善で構成されています。
それらのうち、GAへの昇格が17個、ベータへの移行が19個、アルファとしての導入が22個です。

また、このリリースにはいくつかの[非推奨化と削除](#deprecations-removals-and-community-updates)があります。
これらに必ず目を通してください。

## リリースのテーマとロゴ {#release-theme-and-logo}

{{< figure src="k8s-v1.35.png" alt="Kubernetes v1.35 Timbernetesロゴ：輝く世界樹の枝が地球と白いKubernetesホイールを抱く絵本風の六角形バッジ。下には3匹の陽気なリスが立っている—LGTMの巻物を持つプラム色のローブを着た魔法使い、斧と青いKubernetesの盾を持つ戦士、ネイビーのマントを着てランタンを運ぶ盗賊—緑の草の上、「World Tree Release」と書かれた金色のリボンの上に、柔らかな山々と雲が流れる空を背景にして" class="release-logo" >}}

2025年はOctarine: The Color of Magic(v1.33)の輝きで始まり、Of Wind & Will(v1.34)の風に乗って進んできました。
そして私たちは、多くの世界をつなぐ生命の木、北欧神話のユグドラシルにインスパイアされた「世界樹」に手を伸ばしながら、この一年を締めくくります。
偉大な木が年輪を重ねるように、Kubernetesもリリースを重ねて成長し、グローバルコミュニティの献身によって形作られています。

その中心には、地球を包み込むKubernetesの舵輪があります。
それを支えているのは、日々の仕事や人生の変化を乗り越えながら、着実にオープンソースの管理を続ける、粘り強いメンテナ、コントリビューター、そしてユーザーたちです。
彼らは古いAPIを剪定し、新しい機能を接ぎ木し、世界最大級のオープンソースプロジェクトの一つを健全に保っています。

ロゴには、3匹のリスが木を守る姿が描かれています。
レビュアーを象徴する、LGTMの巻物を持った魔法使い。
新しいブランチを切り出すリリースチームを象徴する、斧とKubernetesの盾を持った戦士。
そして、山積みのIssueに光をもたらすトリアージ担当者を象徴する、ランタンを持ったローグです。

彼らは、より大きな冒険パーティーを代表しています。
Kubernetes v1.35は、世界樹に新たな年輪を刻みます。
それは多くの手によって、多くの道を経て形作られた新鮮な一刻であり、根を深く張りながら枝をより高く伸ばし続けるコミュニティの証です。


## 主なアップデート情報 {#spotlight-on-key-updates}

Kubernetes v1.35は新機能と改善点が満載です。
このセクションでは、リリースチームが特に注目して欲しい、選りすぐりのアップデート内容をご紹介します！

### 安定版: Podリソースのインプレース更新 {#stable-in-place-update-of-pod-resources}

Podリソースのインプレース更新機能がGA(General Availability)に昇格しました。
この機能により、Podやコンテナを再起動せずにCPUやメモリリソースを調整できます。
以前は、このような変更にはPodの再作成が必要で、特にステートフルアプリケーションやバッチアプリケーションでワークロードの中断を招く可能性がありました。
また、これまでのKubernetesリリースでは、既存のPodに対してインフラストラクチャのリソース設定(requestsとlimits)のみを変更することが許可されていました。
新しいインプレース機能により、中断のないスムーズな垂直スケーリングが可能になり、効率が向上し、開発もシンプルになります。

この取り組みは、SIG Nodeが主導した[KEP #1287](https://kep.k8s.io/1287)の一環として行われました。

### ベータ: Workload IdentityとセキュリティのためのPod証明書 {#beta-pod-certificates-for-workload-identity-and-security}

以前は、Podに証明書を配布するには外部コントローラー(cert-manager、SPIFFE/SPIRE)、CRDオーケストレーション、およびSecret管理が必要で証明書のローテーションはサイドカーやInitコンテナで処理されていました。
Kubernetes v1.35では、自動証明書ローテーションによるネイティブなWorkload Identityが可能になり、サービスメッシュやゼロトラストアーキテクチャが大幅に簡素化されます。 

`kubelet`が鍵を生成し、PodCertificateRequestを介して証明書を要求し、クレデンシャルバンドルをPodのファイルシステムに直接書き込むようになりました。
`kube-apiserver`はアドミッション時にノード制限を強制し、サードパーティの署名者が誤ってノード分離の境界に違反するという最も一般的な落とし穴を排除します。
これにより、発行パスにBearerトークンを含まない純粋なmTLSフローが可能になります。

この取り組みは、SIG Authが主導した[KEP #4317](https://kep.k8s.io/4317)の一環として行われました。

### アルファ: スケジューリング前のNode Declared Features {#alpha-node-declared-features-before-scheduling}

コントロールプレーンで新機能が有効になっていても、ノードが古いバージョンのままである場合(このような状況は、Kubernetesのスキューポリシーで許可されています)、スケジューラーはその機能を必要とするPodを、互換性のない古いノードに配置してしまうことがあります。
Node Declared Featuresというフレームワークにより、ノードは自身がサポートするKubernetes機能を宣言できるようになります。
この新しいアルファ機能を有効にすると、ノードは自身がサポートする機能を報告し、新しい`.status.declaredFeatures`フィールドを介してこの情報をコントロールプレーンに公開します。
その後、`kube-scheduler`、アドミッションコントローラー、およびサードパーティコンポーネントがこれらの宣言を使用できます。
例えば、スケジューリングやAPI検証の制約を強制して、Podが互換性のあるノードでのみ実行されるようにできます。

この取り組みは、SIG Nodeが主導した[KEP #5328](https://kep.k8s.io/5328)の一環として行われました。

## GAに昇格した機能 {#features-graduating-to-stable}

*これはv1.35リリース後にGAとなった改善点の一部です。*

### PreferSameNodeによるトラフィック分散 {#prefersamenode-traffic-distribution}

Serviceの`trafficDistribution`フィールドが更新され、トラフィックルーティングをより明示的に制御できるようになりました。
新しいオプション`PreferSameNode`が導入され、ローカルノード上のエンドポイントが利用可能な場合はそれを厳密に優先し、利用できない場合にのみリモートエンドポイントにフォールバックするようにServiceを設定できます。

同時に、既存の`PreferClose`オプションは`PreferSameZone`に名称が変更されました。
この変更により、トラフィックが現在のアベイラビリティゾーン内で優先されることが明示され、APIが自己説明的になりました。
`PreferClose`は後方互換性のために保持されていますが、`PreferSameZone`がゾーンルーティングの標準となり、ノードレベルとゾーンレベルの優先設定が明確に区別されるようになりました。

この取り組みは、SIG Networkが主導した[KEP #3015](https://kep.k8s.io/3015)の一環として行われました。

### Job APIのmanaged-byメカニズム {#job-api-managed-by-mechanism}

Job APIに`managedBy`フィールドが追加され、外部コントローラーがJobのステータス同期を処理できるようになりました。
Kubernetes v1.35でGAに昇格したこの機能は、主に[MultiKueue](https://github.com/kubernetes-sigs/kueue/tree/main/keps/693-multikueue)によって推進されています。
MultiKueueは、クラスター間でJobを分散実行するためのシステムです。
管理クラスターで作成したJobがワーカークラスターで実行され、その結果が管理クラスターに反映されます。
このワークフローを有効にするには、組み込みのJobコントローラーが特定のJobリソースに対してアクションを実行しないようにして、代わりにKueueコントローラーがステータス更新を管理できるようにする必要があります。

目的は、Jobの同期を別のコントローラーにクリーンに委譲できるようにすることです。
そのコントローラーにカスタムパラメーターを渡したり、CronJobの並行性ポリシーを変更したりすることは目的としていません。

この取り組みは、SIG Appsが主導した[KEP #4368](https://kep.k8s.io/4368)の一環として行われました。

### `.metadata.generation`による信頼性の高いPodの更新追跡 {#reliable-pod-update-tracking-with-metadata-generation}

これまで、Pod APIにはDeploymentなどの他のKubernetesオブジェクトにある`metadata.generation`フィールドがありませんでした。
このフィールドがなかったため、コントローラーやユーザーは`kubelet`がPodの仕様に対する最新の変更を実際に処理したかどうかを確実に検証する方法がありませんでした。
この曖昧さは、[Podリソースのインプレース更新](#stable-in-place-update-of-pod-resources)で特に問題でした。
リソースのリサイズ要求がいつ適用されたのかを正確に知ることが困難だったためです。

Kubernetes v1.33では、アルファ機能としてPodに`.metadata.generation`フィールドが追加されました。
このフィールドはv1.35のPod APIでGAになりました。
これにより、Podの`spec`が更新されるたびに`.metadata.generation`の値がインクリメントされます。
この改善の一環として、Pod APIには`.status.observedGeneration`フィールドも追加されました。
このフィールドは、`kubelet`が正常に確認して処理したgenerationを報告します。
また、Podの各conditionにも個別の`observedGeneration`フィールドが含まれるようになり、クライアントはこれを報告したり監視したりできます。

この機能はv1.35でGAに昇格したため、すべてのワークロードで利用可能です。

この取り組みは、SIG Nodeが主導した[KEP #5067](https://kep.k8s.io/5067)の一環として行われました。

### トポロジーマネージャーのNUMAノード数制限の設定 {#configurable-numa-node-limit-for-topology-manager}

[トポロジーマネージャー](/docs/concepts/policy/node-resource-managers/)は、アフィニティ計算時の状態爆発を防ぐため、サポートできるNUMAノードの最大数として8というハードコードされた制限を使用していました。
(ここで重要な点があります。_NUMAノード_ はKubernetes APIのNodeとは異なります。)
このNUMAノード数の制限により、8つを超えるNUMAノードを持つCPUアーキテクチャを搭載した最新のハイエンドサーバーをKubernetesで十分に活用できませんでした。

Kubernetes v1.31では、トポロジーマネージャーのポリシー設定に新しい**ベータ**オプション`max-allowable-numa-nodes`が導入されました。
Kubernetes v1.35では、このオプションがGAになりました。
これを有効にすることで、クラスター管理者は8つを超えるNUMAノードを持つサーバーを使用できます。

この設定オプションはGAですが、Kubernetesコミュニティは大規模なNUMAホストでのパフォーマンスが低いことを認識しており、これを改善することを目的とした[改善提案](https://kep.k8s.io/5726)(KEP-5726)があります。
詳細については、[ノードのトポロジー管理ポリシーを制御する](/docs/tasks/administer-cluster/topology-manager/)をご覧ください。

この取り組みは、SIG Nodeが主導した[KEP #4622](https://kep.k8s.io/4622)の一環として行われました。

## ベータの新機能 {#new-features-in-beta}

*これはv1.35リリース後にベータとなった改善点の一部です。*

### Downward APIによるノードトポロジーラベルの公開 {#expose-node-topology-labels-via-downward-api}

従来は、Pod内からリージョンやゾーンなどのノードトポロジー情報にアクセスするには、Kubernetes APIサーバーへのクエリが必要でした。
この方法は機能しますが、インフラストラクチャのメタデータを取得するためだけに広範なRBAC権限やサイドカーコンテナが必要となり、複雑さとセキュリティリスクが生じていました。
Kubernetes v1.35では、Downward APIを介してノードトポロジーラベルを直接公開する機能がベータに昇格しました。 

`kubelet`は、`topology.kubernetes.io/zone`や`topology.kubernetes.io/region`などの標準トポロジーラベルを、環境変数またはProjected VolumeファイルとしてPodに注入できるようになりました。
主な利点は、ワークロードがトポロジーを認識するためのより安全で効率的な方法が提供されることです。
これにより、アプリケーションはAPIサーバーに依存することなく、アベイラビリティゾーンやリージョンにネイティブに適応できます。
最小権限の原則を守ることでセキュリティが強化され、クラスター設定も簡素化されます。

**注意:** Kubernetesは、[Downward API](/docs/concepts/workloads/pods/downward-api/)への入力として使用できるように、利用可能なトポロジーラベルをすべてのPodに注入するようになりました。
v1.35へのアップグレードにより、ほとんどのクラスター管理者は各Podにいくつかの新しいラベルが追加されていることに気づくでしょう。
これは設計の一部として想定された動作です。

この取り組みは、SIG Nodeが主導した[KEP #4742](https://kep.k8s.io/4742)の一環として行われました。

### Storage Version Migrationのネイティブサポート {#native-support-for-storage-version-migration}

Kubernetes v1.35では、Storage Version Migrationのネイティブサポートがベータに昇格し、デフォルトで有効になりました。
この変更により、マイグレーションロジックがKubernetesコントロールプレーンのコア(「in-tree」)に直接統合され、外部ツールへの依存がなくなりました。

これまで管理者は、スキーマの更新や保存データの再暗号化のために、手動の「読み取り/書き込みループ」(多くの場合`kubectl get`を`kubectl replace`にパイプする方法)に頼っていました。
この方法は非効率で、特にSecretのような大規模なリソースでは競合が発生しやすいものでした。
このリリースでは、組み込みコントローラーが更新の競合と整合性トークンを自動的に処理し、最小限の運用オーバーヘッドで保存データを最新の状態に保つ、安全で効率的かつ信頼性の高い方法を提供します。

この取り組みは、SIG API Machineryが主導した[KEP #4192](https://kep.k8s.io/4192)の一環として行われました。

### 変更可能なボリュームアタッチ制限 {#mutable-volume-attach-limits}

CSI(Container Storage Interface)ドライバーは、ストレージシステムをコンテナ化されたワークロードに一貫した方法で公開するKubernetesプラグインです。
`CSINode`オブジェクトは、ノードにインストールされているすべてのCSIドライバーの詳細を記録します。
しかし、ノードで報告されるアタッチ容量と実際の容量の間に不一致が生じることがあります。
CSIドライバーの起動後にボリュームスロットが消費されると、`kube-scheduler`は十分な容量がないノードにステートフルなPodを割り当ててしまい、最終的に`ContainerCreating`状態で停止することがあります。

Kubernetes v1.35では、`CSINode.spec.drivers[*].allocatable.count`が変更可能になり、ノードで利用可能なボリュームアタッチ容量を動的に更新できるようになりました。
また、`CSIDriver`オブジェクトを介して設定可能な更新間隔を導入することで、CSIドライバーがすべてのノードで`allocatable.count`値を更新する頻度を制御できるようになりました。
さらに、容量不足によるボリュームアタッチの失敗を検出すると、`CSINode.spec.drivers[*].allocatable.count`を自動的に更新します。
この機能はv1.34でフィーチャーフラグ`MutableCSINodeAllocatableCount`がデフォルトで無効の状態でベータに昇格しましたが、v1.35でもフィードバックを得る時間を確保するためベータのままです。
ただし、フィーチャーフラグはデフォルトで有効になっています。

この取り組みは、SIG Storageが主導した[KEP #4876](https://kep.k8s.io/4876)の一環として行われました。

### 効率的なバッチスケジューリング {#opportunistic-batching}

従来、Kubernetesスケジューラーは`O(Pod数 × Node数)`の時間計算量でPodを順次処理していたため、互換性のあるPodに対して冗長な計算が発生することがありました。
このKEPでは、`Pod scheduling signature(Podのスケジューリング特性を表すシグネチャ)`を使用して互換性のあるPodを識別し、それらをまとめてバッチ処理することでパフォーマンスを向上させる仕組みを導入しています。
これにより、フィルタリングとスコアリングの結果を複数のPod間で共有できます。

Podスケジューリング署名は、同じ署名を持つ2つのPodがスケジューリングの観点から「同一」であることを保証します。
この署名は、Podとノードの属性だけでなく、システム内の他のPodやPod配置に関するグローバルデータも考慮します。
つまり、同じ署名を持つPodは、任意のノード群に対して同じスコアや実行可能性の結果を得ることになります。

このバッチ処理の仕組みは、必要に応じて呼び出せる2つの操作(*create*と*nominate*)で構成されています。
`create`は、有効な署名を持つPodのスケジューリング結果から新しいバッチ情報のセットを作成します。
`nominate`は、`create`で作成されたバッチ情報を使用して、署名が基準となるPodの署名と一致する新しいPodに対して、nominatedノード名を設定します。

この取り組みは、SIG Schedulingが主導した[KEP #5598](https://kep.k8s.io/5598)の一環として行われました。

### StatefulSetにおける`maxUnavailable` {#maxunavailable-for-statefulsets}

StatefulSetはPodのグループを実行し、各Podに対して固定のアイデンティティを維持します。
これは、安定したネットワーク識別子や永続ストレージを必要とするステートフルなワークロードにとって重要です。
StatefulSetの`.spec.updateStrategy.<type>`が`RollingUpdate`に設定されている場合、StatefulSetコントローラーはStatefulSet内の各Podを削除して再作成します。
Pod終了時と同じ順序(最大の序数から最小へ)で進行し、一度に1つずつPodを更新します。

Kubernetes v1.24では、StatefulSetの`rollingUpdate`設定に`maxUnavailable`という新しい**アルファ**フィールドが追加されました。
このフィールドは、クラスター管理者が明示的にオプトインしない限り、Kubernetes APIの一部ではありませんでした。
Kubernetes v1.35では、このフィールドはベータになり、デフォルトで利用可能です。
これを使用して、更新中に利用不可にできるPodの最大数を定義できます。
この設定は、`.spec.podManagementPolicy`を`Parallel`に設定した場合に最も効果的です。
`maxUnavailable`は正の数(例: 2)または希望するPod数の割合(例: 10%)として設定できます。
このフィールドが指定されていない場合、デフォルトは1となり、一度に1つのPodのみを更新する従来の動作が維持されます。
この改善により、複数のPodが同時に停止することを許容できるステートフルアプリケーションでは、更新を高速に完了できます。

この取り組みは、SIG Appsが主導した[KEP #961](https://kep.k8s.io/961)の一環として行われました。

### `kuberc`における認証情報プラグインポリシーの設定 {#configurable-credential-plugin-policy-in-kuberc}

オプションの[`kuberc`ファイル](/docs/reference/kubectl/kuberc/)は、実行中のCIパイプラインを予期しない出力で中断することなく、サーバー設定とクラスター認証情報をユーザー設定から分離する方法です。

v1.35リリースの一環として、`kuberc`に認証情報プラグインポリシーを設定できる機能が追加されました。
この変更により、すべてのプラグインを許可または拒否する`credentialPluginPolicy`フィールドと、`credentialPluginAllowlist`を使用して許可するプラグインのリストを指定する機能の2つのフィールドが導入されました。

この取り組みは、SIG AuthとSIG CLIの協力により[KEP #3104](https://kep.k8s.io/3104)の一環として行われました。

### KYAML {#kyaml}

YAMLは人間が読みやすいデータシリアライズ形式です。
Kubernetesでは、YAMLファイルはPod、Service、Deploymentなどのリソースを定義および設定するために使用されます。
しかし、複雑なYAMLは読みにくいという問題があります。
YAMLでは空白が意味を持つため、インデントとネストに注意が必要であり、文字列の引用符がオプションであることから予期しない型変換が発生することがあります(例: The Norway Bug)。
JSONは代替手段ですが、コメントをサポートしておらず、末尾のカンマやキーの引用符に厳格な要件があります。

KYAMLは、Kubernetes向けに特別に設計された、より安全で曖昧さの少ないYAMLのサブセットです。
v1.34でオプトインのアルファ機能として導入されたこの機能は、Kubernetes v1.35でベータに昇格し、デフォルトで有効になりました。
環境変数`KUBECTL_KYAML=false`を設定することで無効にできます。 

KYAMLはYAMLとJSONの両方が抱える課題に対処しています。
KYAMLファイルはすべて有効なYAMLファイルでもあるため、KYAMLで記述したマニフェストは任意のバージョンのkubectlで使用できます。
一方で、kubectlへの入力は厳密なKYAML形式である必要はなく、従来のYAMLもそのまま解析できます。

この取り組みは、SIG CLIが主導した[KEP #5295](https://kep.k8s.io/5295)の一環として行われました。

### HorizontalPodAutoscalerの許容値の設定 {#configurable-tolerance-for-horizontalpodautoscalers}

Horizontal Pod Autoscaler(HPA)は、これまでスケーリングアクションに対して、グローバルに設定された固定の10%の許容値に依存していました。
このハードコードされた値の欠点は、5%の負荷増加でスケーリングが必要な高感度のワークロードではスケーリングがブロックされることが多い一方で、他のワークロードでは不必要に振動する可能性があることでした。

Kubernetes v1.35では、許容値を設定できる機能がベータに昇格し、デフォルトで有効になりました。
この機能強化により、HPAの`behavior`フィールド内でリソースごとにカスタムの許容値ウィンドウを定義できます。
特定の許容値を設定することで(例: 5%の場合は0.05に下げる)、オペレーターはオートスケーリングの感度を精密に制御でき、クラスター全体の設定変更を必要とせずに、重要なワークロードがメトリクスの小さな変化に素早く反応するようにできます。

この取り組みは、SIG Autoscalingが主導した[KEP #4951](https://kep.k8s.io/4951)の一環として行われました。

### Podにおけるユーザー名前空間のサポート {#support-for-user-namespaces-in-pods}

Kubernetesにユーザー名前空間のサポートが追加され、Podはホストとユーザー/グループIDを共有する代わりに、分離されたIDマッピングで実行できるようになりました。
これにより、コンテナ内部ではrootとして動作しながら、実際にはホスト上の非特権ユーザーにマッピングされるため、侵害が発生した場合の権限昇格リスクが軽減されます。
この機能はPodレベルのセキュリティを向上させ、コンテナ内でrootが必要なワークロードをより安全に実行できるようにします。
時間の経過とともに、id-mappedマウントによりステートレスとステートフルの両方のPodにサポートが拡大されました。

この取り組みは、SIG Nodeが主導した[KEP #127](https://kep.k8s.io/127)の一環として行われました。

### VolumeSource: OCIアーティファクトおよびイメージ {#volumesource-oci-artifact-and-or-image}

Podを作成する際、コンテナにデータ、バイナリ、または設定ファイルを提供する必要があることがよくあります。
従来は、コンテンツをメインのコンテナイメージに含めるか、カスタムのInitコンテナを使用してファイルをダウンロードし`emptyDir`に展開する必要がありました。
これらのアプローチは現在も有効です。
Kubernetes v1.31では`image`ボリュームタイプのサポートが追加され、PodがOCIコンテナイメージのアーティファクトを宣言的にプルしてボリュームに展開できるようになりました。
これにより、設定ファイル、バイナリ、機械学習モデルなどのデータのみのアーティファクトを、標準的なOCIレジストリツールを使用してパッケージ化し配布できます。 

この機能により、データをコンテナイメージから完全に分離でき、追加のInitコンテナや起動スクリプトが不要になります。
imageボリュームタイプはv1.33からベータであり、v1.35ではデフォルトで有効になっています。
この機能を使用するには、containerd v2.1以降などの互換性のあるコンテナランタイムが必要です。

この取り組みは、SIG Nodeが主導した[KEP #4639](https://kep.k8s.io/4639)の一環として行われました。

### キャッシュされたイメージに対する`kubelet`の認証情報検証の強制 {#enforced-kubelet-credential-verification-for-cached-images}

`imagePullPolicy: IfNotPresent`の設定では、Pod自体がそのイメージを取得するための認証情報を持っていなくても、ノードにすでにキャッシュされているコンテナイメージを使用できます。
この動作の欠点は、マルチテナントクラスターでセキュリティの脆弱性を生むことです。
有効な認証情報を持つPodが機密性の高いプライベートイメージをノード上に取得すると、同じノード上の後続の未認可Podがローカルキャッシュに依存するだけで、そのイメージにアクセスできてしまいます。

このKEPでは、`kubelet`がキャッシュされたイメージに対して認証情報の検証を強制する仕組みを導入しています。
ローカルにキャッシュされたイメージをPodが使用することを許可する前に、`kubelet`はそのPodがイメージを取得するための有効な認証情報を持っているかどうかを確認します。
これにより、イメージがすでにノードに存在するかどうかに関係なく、認可されたワークロードのみがプライベートイメージを使用できるようになり、共有クラスターのセキュリティ体制が大幅に強化されます。

Kubernetes v1.35では、この機能はベータに昇格し、デフォルトで有効になっています。
`KubeletEnsureSecretPulledImages`フィーチャーゲートをfalseに設定することで無効にすることもできます。
さらに、`imagePullCredentialsVerificationPolicy`フラグにより、オペレーターは後方互換性を優先するモードから最大限のセキュリティを提供する厳格な強制モードまで、希望するセキュリティレベルを設定できます。

この取り組みは、SIG Nodeが主導した[KEP #2535](https://kep.k8s.io/2535)の一環として行われました。

### きめ細かなコンテナ再起動ルール {#fine-grained-container-restart-rules}

従来、`restartPolicy`フィールドはPodレベルでのみ定義されており、Pod内のすべてのコンテナに同じ動作を強制していました。
このグローバル設定の欠点は、AI/MLトレーニングジョブなどの複雑なワークロードに対する粒度の欠如でした。
これらのジョブでは、ジョブの完了を管理するためにPodに`restartPolicy: Never`が必要なことが多いですが、個々のコンテナは特定のリトライ可能なエラー(ネットワークの問題やGPU初期化の失敗など)に対してインプレース再起動の恩恵を受ける可能性がありました。

Kubernetes v1.35では、コンテナAPI自体で`restartPolicy`と`restartPolicyRules`を有効にすることでこの問題に対処しています。
これにより、Podの全体的なポリシーとは独立して動作する、個々の通常コンテナとInitコンテナの再起動戦略を定義できます。
たとえば、コンテナが特定のエラーコードで終了した場合にのみ自動的に再起動するように設定でき、一時的な障害のためにPod全体を再スケジュールするコストの高いオーバーヘッドを回避できます。

このリリースでは、この機能はベータに昇格し、デフォルトで有効になっています。
ユーザーはコンテナの仕様で`restartPolicyRules`をすぐに活用して、Podの広範なライフサイクルロジックを変更することなく、長時間実行されるワークロードのリカバリ時間とリソース使用率を最適化できます。

この取り組みは、SIG Nodeが主導した[KEP #5307](https://kep.k8s.io/5307)の一環として行われました。

### CSIドライバーがsecretsフィールドでServiceAccountトークンを受信可能に {#csi-driver-opt-in-for-service-account-tokens-via-secrets-field}

Container Storage Interface(CSI)ドライバーにServiceAccountトークンを提供する方法は、従来は`volume_context`フィールドへの注入に依存していました。
このアプローチは重大なセキュリティリスクをもたらします。
`volume_context`は機密性のない設定データを対象としており、ドライバーやデバッグツールによって平文でログに記録されることが多く、認証情報が漏洩する可能性があるためです。 

Kubernetes v1.35では、CSIドライバーがNodePublishVolumeリクエストの専用secretsフィールドを介してServiceAccountトークンを受け取るためのオプトイン機構を導入しています。
ドライバーはCSIDriverオブジェクトで`serviceAccountTokenInSecrets`フィールドをtrueに設定することでこの動作を有効にでき、`kubelet`にトークンを安全に設定するよう指示します。 

主な利点は、ログやエラーメッセージでの認証情報の意図しない露出を防止することです。
この変更により、機密性の高いワークロードIDが適切な安全なチャネルを介して処理されるようになり、既存のドライバーとの後方互換性を維持しながら、シークレット管理のベストプラクティスに沿った対応が可能になります。 

この取り組みは、SIG AuthがSIG Storageと協力して主導した[KEP #5538](https://kep.k8s.io/5538)の一環として行われました。

### Deploymentステータスの追加: 終了中のレプリカ数 {#deployment-status-count-of-terminating-replicas}

従来、Deploymentのステータスは利用可能なレプリカと更新されたレプリカの詳細を提供していましたが、シャットダウン中のPodを明確に確認することはできませんでした。
この欠落の欠点は、ユーザーやコントローラーが、安定したDeploymentと、クリーンアップタスクを実行中または長い猶予期間に従っているPodがまだ存在するDeploymentを簡単に区別できないことでした。

Kubernetes v1.35では、Deploymentステータス内の`terminatingReplicas`フィールドがベータに昇格しました。
このフィールドは、削除タイムスタンプが設定されているがまだシステムから削除されていないPodの数を提供します。
この機能は、DeploymentがPodの置き換えを処理する方法を改善するより大きな取り組みの基礎的なステップであり、ロールアウト中に新しいPodをいつ作成するかに関する将来のポリシーの基盤を築いています。

主な利点は、ライフサイクル管理ツールやオペレーター向けの可観測性の向上です。
終了中のPodの数を公開することで、外部システムは個々のPodリストを手動でクエリしてフィルタリングすることなく、完全なシャットダウンを待ってから後続のタスクに進むなど、より適切な判断を下せるようになります。

この取り組みは、SIG Appsが主導した[KEP #3973](https://kep.k8s.io/3973)の一環として行われました。

## アルファの新機能 {#new-features-in-alpha}

*これはv1.35リリース後にアルファとなった改善点の一部です。*

### KubernetesにおけるGangスケジューリングのサポート {#gang-scheduling-support-in-kubernetes}

AI/MLトレーニングジョブやHPCシミュレーションなどの相互依存するワークロードのスケジューリングは、デフォルトのKubernetesスケジューラーがPodを個別に配置するため、従来から困難でした。
これにより、一部のPodが開始される一方で他のPodがリソースを無期限に待機する部分的なスケジューリングが発生し、デッドロックやクラスター容量の浪費につながることがよくありました。

Kubernetes v1.35では、新しいWorkload APIとPodGroupコンセプトを介した、いわゆる「Gangスケジューリング」のネイティブサポートを導入しています。
この機能は「オール・オア・ナッシング (全か無か)」のスケジューリング戦略を実装し、定義されたPodのグループは、クラスターがグループ全体を同時に収容するのに十分なリソースを持っている場合にのみスケジュールされることを保証します。

主な利点は、バッチおよび並列ワークロードの信頼性と効率性の向上です。
部分的なデプロイメントを防ぐことで、リソースのデッドロックを排除し、完全なジョブが実行できる場合にのみ高価なクラスター容量が使用されるようになり、大規模なデータ処理タスクのオーケストレーションが大幅に最適化されます。

この取り組みは、SIG Schedulingが主導した[KEP #4671](https://kep.k8s.io/4671)の一環として行われました。

### 制約付きなりすまし {#constrained-impersonation}

従来、Kubernetes RBACの`impersonate`動詞はオール・オア・ナッシングの方式で機能していました。
ユーザーが対象のアイデンティティになりすますことを認可されると、関連するすべての権限を取得していました。
この広範な認可の欠点は、最小権限の原則に違反し、管理者がなりすましを行うユーザーを特定のアクションやリソースに制限できないことでした。

Kubernetes v1.35では、なりすましフローに二次的な認可チェックを追加する新しいアルファ機能、制約付きなりすましを導入しています。
`ConstrainedImpersonation`フィーチャーゲートを介して有効にすると、APIサーバーは基本的な`impersonate`権限だけでなく、新しい動詞プレフィックス(例: `impersonate-on:<mode>:<verb>`)を使用して、なりすましを行うユーザーが特定のアクションに対して認可されているかどうかも確認します。
これにより、管理者はきめ細かなポリシーを定義できます。
たとえば、サポートエンジニアがログを表示するためだけにクラスター管理者になりすますことを許可し、完全な管理アクセス権を付与しないようにできます。

この取り組みは、SIG Authが主導した[KEP #5284](https://kep.k8s.io/5284)の一環として行われました。

### KubernetesコンポーネントのFlagz {#flagz-for-kubernetes-components}

APIサーバーや`kubelet`などのKubernetesコンポーネントのランタイム設定を検証するには、従来ホストノードへの特権アクセスやプロセス引数へのアクセスが必要でした。
これに対処するため、コマンドラインオプションをHTTP経由で公開する`/flagz`エンドポイントが導入されました。
しかし、その出力は当初プレーンテキストに限定されており、自動化ツールが設定を確実に解析して検証することが困難でした。

Kubernetes v1.35では、`/flagz`エンドポイントが機械可読な構造化JSON出力をサポートするように強化されました。
認可されたユーザーは、標準的なHTTPコンテンツネゴシエーションを使用してバージョン管理されたJSONレスポンスをリクエストできるようになり、元のプレーンテキスト形式も人間による検査用に引き続き利用可能です。
このアップデートにより、可観測性とコンプライアンスのワークフローが大幅に改善され、外部システムが脆弱なテキスト解析や直接的なインフラストラクチャアクセスなしに、コンポーネント設定をプログラムで監査できるようになります。

この取り組みは、SIG Instrumentationが主導した[KEP #4828](https://kep.k8s.io/4828)の一環として行われました。

### KubernetesコンポーネントのStatusz {#statusz-for-kubernetes-components}

`kube-apiserver`や`kubelet`などのKubernetesコンポーネントのトラブルシューティングには、従来、構造化されていないログやテキスト出力の解析が必要であり、これは脆弱で自動化が困難でした。
以前から基本的な`/statusz`エンドポイントは存在していましたが、標準化された機械可読形式がなく、外部監視システムでの有用性が制限されていました。

Kubernetes v1.35では、`/statusz`エンドポイントが機械可読な構造化JSON出力をサポートするように強化されました。
認可されたユーザーは、標準的なHTTPコンテンツネゴシエーションを使用してこの形式をリクエストし、バージョン情報やヘルスインジケーターなどの正確なステータスデータを、脆弱なテキスト解析に頼ることなく取得できます。
この改善により、すべてのコアコンポーネントにわたって、自動デバッグおよび可観測性ツールのための信頼性が高く一貫したインターフェースが提供されます。

この取り組みは、SIG Instrumentationが主導した[KEP #4827](https://kep.k8s.io/4827)の一環として行われました。

### CCM: informerを使用したwatch-basedルートコントローラーの調整 {#ccm-watch-based-route-controller-reconciliation-using-informers}

クラウド環境内でのネットワークルートの管理は、従来Cloud Controller Manager(CCM)がクラウドプロバイダーのAPIを定期的にポーリングしてルートテーブルを検証および更新することに依存していました。
この固定間隔での調整アプローチは非効率になりがちで、大量の不要なAPI呼び出しを生成し、ノードの状態変化と対応するルート更新の間に遅延が生じることがよくありました。

Kubernetes v1.35リリースでは、cloud-controller-managerライブラリがルートコントローラー用のwatch-based調整戦略を導入しています。
タイマーに依存する代わりに、コントローラーはinformerを利用して、追加、削除、関連フィールドの更新などの特定のノードイベントを監視し、実際に変更が発生した場合にのみルート同期をトリガーします。

主な利点は、クラウドプロバイダーAPIの使用量が大幅に削減されることで、レート制限に達するリスクが低下し、運用オーバーヘッドが軽減されます。
さらに、このイベント駆動モデルは、クラスタートポロジーの変更後すぐにルートテーブルが更新されることを保証し、クラスターのネットワーク層の応答性を向上させます。

この取り組みは、SIG Cloud Providerが主導した[KEP #5237](https://kep.k8s.io/5237)の一環として行われました。

### しきい値ベースの配置のための拡張toleration演算子 {#extended-toleration-operators-for-threshold-based-placement}

Kubernetes v1.35では、ワークロードが信頼性要件を表現できるようにすることで、SLA対応のスケジューリングを導入しています。
この機能はtolerationに数値比較演算子を追加し、サービス保証や障害ドメインの品質などのSLA指向のtaintに基づいて、Podがノードにマッチするか回避するかを制御できるようにします。

主な利点は、より正確な配置によるスケジューラーの強化です。
重要なワークロードは高SLAノードを要求でき、優先度の低いワークロードは低SLAノードを選択できます。
これにより、信頼性を損なうことなく使用率が向上し、コストが削減されます。

この取り組みは、SIG Schedulingが主導した[KEP #5471](https://kep.k8s.io/5471)の一環として行われました。

### Job一時停止時の変更可能なコンテナリソース {#mutable-container-resources-when-job-is-suspended}

バッチワークロードを実行する際に、リソース制限の設定で試行錯誤を伴うことがよくあります。
現在、Jobの仕様は不変であり、Jobがメモリ不足(OOM)エラーやCPU不足で失敗した場合、ユーザーは単にリソースを調整することができません。
Jobを削除して新しいJobを作成する必要があり、実行履歴とステータスが失われます。

Kubernetes v1.35では、一時停止状態のJobに対してリソースリクエストと制限を更新する機能を導入しています。
`MutableJobPodResourcesForSuspendedJobs`フィーチャーゲートを介して有効にすると、この機能強化により、ユーザーは失敗しているJobを一時停止し、適切なリソース値でPodテンプレートを変更してから、修正された設定で実行を再開できます。

主な利点は、設定ミスのあるJobに対するよりスムーズなリカバリワークフローです。
一時停止中にインプレースで修正できるようにすることで、ユーザーはJobのライフサイクルアイデンティティを中断したり完了ステータスを見失ったりすることなくリソースのボトルネックを解決でき、バッチ処理の開発者体験が大幅に向上します。

この取り組みは、SIG Appsが主導した[KEP #5440](https://kep.k8s.io/5440)の一環として行われました。

## その他の注目すべき変更 {#other-notable-changes}

### Dynamic Resource Allocation(DRA)の継続的なイノベーション{#continued-innovation-in-dynamic-resource-allocation-dra}

[コア機能](https://kep.k8s.io/4381)はv1.34でGAに昇格し、無効にする機能が提供されていました。
v1.35では常に有効になっています。
いくつかのアルファ機能も大幅に改善され、テストの準備が整っています。
今後のリリースでベータへの昇格を目指すこれらの機能について、ぜひフィードバックをお寄せください。

#### DRAを介した拡張リソースリクエスト {#extended-resource-requests-via-dra}

Device Pluginを介した拡張リソースリクエストと比較していくつかの機能的な差分が対処されました。
たとえば、Initコンテナでのデバイスのスコアリングと再利用などです。

#### デバイスのTaintとToleration {#device-taints-and-tolerations}

新しい「None」エフェクトを使用すると、スケジューリングや実行中のPodに直ちに影響を与えることなく問題を報告できます。
DeviceTaintRuleは、進行中の退避に関するステータス情報を提供するようになりました。
「None」エフェクトは、実際にPodを退避する前の「ドライラン」として使用できます:
- 「effect: None」でDeviceTaintRuleを作成する
- ステータスを確認して、退避されるPodの数を確認する
- 「effect: None」を「effect: NoExecute」に置き換える

#### パーティション可能なデバイス {#partitionable-devices}

同じパーティション可能なデバイスに属するデバイスを、異なるResourceSliceで定義できるようになりました。
詳細については[公式ドキュメント](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#partitionable-devices)をご覧ください。

#### Consumable capacityとデバイスバインディング条件 {#consumable-capacity-device-binding-conditions}

いくつかのバグが修正され、テストが追加されました。
[Consumable Capacity](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#consumable-capacity)と[バインディング条件](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#device-binding-conditions)の詳細については、公式ドキュメントをご覧ください。

### 比較可能なリソースバージョンのセマンティクス {#comparable-resource-version-semantics}

Kubernetes v1.35では、クライアントが[リソースバージョン](/docs/reference/using-api/api-concepts/#resource-versions)を解釈する方法が変更されました。

v1.35より前は、クライアントがサポートできる唯一の比較は文字列の等価性チェックでした。
2つのリソースバージョンが等しければ、それらは同じでした。
クライアントはAPIサーバーにリソースバージョンを提供し、特定のリソースバージョン以降のすべてのイベントをストリーミングするなど、コントロールプレーンに内部比較を依頼することもできました。

v1.35では、すべてのin-treeリソースバージョンがより厳格な新しい定義を満たしています。
値は特殊な形式の10進数です。
そして、比較可能であるため、クライアントは2つの異なるリソースバージョンを比較する独自の操作を実行できます。
たとえば、クラッシュ後に再接続するクライアントは、更新があったが変更が失われていない場合と区別して、更新を失ったことを検出できます。

このセマンティクスの変更により、[Storage Version Migration](/docs/tasks/manage-kubernetes-objects/storage-version-migration/)、 _informer_ (クライアントヘルパーの概念)のパフォーマンス改善、コントローラーの信頼性など、他の重要なユースケースが可能になります。
これらのケースはすべて、あるリソースバージョンが別のリソースバージョンより新しいかどうかを知る必要があります。

この取り組みは、SIG API Machineryが主導した[KEP #5504](https://kep.k8s.io/5504)の一環として行われました。

## v1.35での昇格、非推奨、削除 {#graduations-deprecations-and-removals-in-v1-35}

### GAへの昇格 {#graduations-to-stable}

これは安定版(*一般提供、GA*とも呼ばれる)に昇格したすべての機能を一覧にしたものです。
アルファからベータへの昇格や新機能を含む更新の完全なリストについては、リリースノートをご覧ください。

このリリースには、GAに昇格した合計15の機能強化が含まれています:

* [CPUManagerポリシーオプションの追加: reservedSystemCPUsをシステムデーモンと割り込み処理に制限](https://kep.k8s.io/4540)
* [Podのgeneration管理](https://kep.k8s.io/5067)
* [インバリアントテスト](https://kep.k8s.io/5468)
* [Podリソースのインプレース更新](https://kep.k8s.io/1287)
* [きめ細かなSupplementalGroupsの制御](https://kep.k8s.io/3619)
* [kubeletのドロップイン設定ディレクトリのサポート](https://kep.k8s.io/3983)
* [Kubernetes API型からのgogo/protobuf依存関係の削除](https://kep.k8s.io/5589)
* [kubeletの期限ベースイメージGC](https://kep.k8s.io/4210)
* [kubeletの並列イメージプル制限](https://kep.k8s.io/3673)
* [MaxAllowableNUMANodes用のTopologyManagerポリシーオプションの追加](https://kep.k8s.io/4622)
* [HTTPリクエストヘッダーへのkubectlコマンドメタデータの追加](https://kep.k8s.io/859)
* [PreferSameNodeトラフィック分散(旧PreferLocalトラフィックポリシー/ノードレベルトポロジー)](https://kep.k8s.io/3015)
* [Job APIのmanaged-byメカニズム](https://kep.k8s.io/4368)
* [SPDYからWebSocketsへの移行](https://kep.k8s.io/4006)

### 非推奨、削除、コミュニティの更新 {#deprecations-removals-and-community-updates}

Kubernetesの開発と成熟に伴い、プロジェクト全体の健全性を向上させるために、機能が非推奨になったり、削除されたり、より良いものに置き換えられたりすることがあります。
このプロセスの詳細については、Kubernetesの[非推奨と削除のポリシー](/docs/reference/using-api/deprecation-policy/)をご覧ください。
Kubernetes v1.35にはいくつかの非推奨が含まれています。

#### Ingress NGINXの引退 {#ingress-nginx-retirement}

長年にわたり、Ingress NGINXコントローラーはKubernetesクラスターへのトラフィックルーティングにおいて人気のある選択肢でした。
柔軟性があり、広く採用され、数え切れないほどのアプリケーションの標準的なエントリーポイントとして機能してきました。 

しかし、プロジェクトの維持が持続不可能になりました。
メンテナーの深刻な不足と増大する技術的負債により、コミュニティは最近、引退させるという難しい決断を下しました。
これは厳密にはv1.35リリースの一部ではありませんが、非常に重要な変更であるため、ここで強調したいと思います。

その結果、Kubernetesプロジェクトは、Ingress NGINXが**2026年3月**までベストエフォートのメンテナンスのみを受けることを発表しました。
この日以降、アーカイブされ、今後の更新は行われません。
推奨される移行先は[Gateway API](https://gateway-api.sigs.k8s.io/)であり、トラフィック管理のためのより現代的で安全かつ拡張可能な標準を提供します。

詳細については[公式ブログ記事](/blog/2025/11/11/ingress-nginx-retirement/)をご覧ください。

#### cgroup v1サポートの削除 {#removal-of-cgroup-v1-support}

Linuxノードでのリソース管理において、Kubernetesは従来cgroups(コントロールグループ)に依存してきました。
オリジナルのcgroup v1は機能していましたが、一貫性がなく制限があることが多くありました。
そのため、Kubernetesはv1.25でcgroup v2のサポートを導入し、よりクリーンで統一された階層構造と優れたリソース分離を提供しました。

cgroup v2が現代の標準となったため、Kubernetesはv1.35でレガシーなcgroup v1サポートを廃止する準備が整いました。
これはクラスター管理者にとって重要なお知らせです。cgroup v2をサポートしていない古いLinuxディストリビューションでノードを実行している場合、`kubelet`は起動に失敗します。
ダウンタイムを回避するには、それらのノードをcgroup v2が有効になっているシステムに移行する必要があります。

詳細については[cgroup v2について](/docs/concepts/architecture/cgroups/)をお読みください。  
また、[KEP-5573: Remove cgroup v1 support](https://kep.k8s.io/5573)で移行作業を追跡できます。  

#### kube-proxyのipvsモードの非推奨化 {#deprecation-of-ipvs-mode-in-kube-proxy}

数年前、Kubernetesは標準の[`iptables`](/docs/reference/networking/virtual-ips/#proxy-mode-iptables)よりも高速なロードバランシングを提供するために、`kube-proxy`に[`ipvs`](/docs/reference/networking/virtual-ips/#proxy-mode-ipvs)モードを採用しました。
パフォーマンスの向上をもたらしましたが、進化するネットワーキング要件に対応し続けることで、過度の技術的負債と複雑さが生じました。

このメンテナンス負担のため、Kubernetes v1.35では`ipvs`モードが非推奨になりました。
このリリースでは、この`ipvs`モードは引き続き利用可能ですが、`kube-proxy`はipvsを使用するよう設定されている場合、起動時に警告を出力するようになります。
目標はコードベースを合理化し、現代の標準に焦点を当てることです。
Linuxノードでは、現在推奨される代替手段である[`nftables`](/docs/reference/networking/virtual-ips/#proxy-mode-nftables)への移行を開始する必要があります。

詳細については[KEP-5495: Deprecate ipvs mode in kube-proxy](https://kep.k8s.io/5495)をご覧ください。

#### containerd v1.Xの最終サポート {#final-call-for-containerd-v1-x}

Kubernetes v1.35は引き続きcontainerd 1.7およびその他のLTSリリースをサポートしていますが、これがそのようなサポートを提供する最後のバージョンです。
SIG Nodeコミュニティは、v1.35をcontainerd v1.Xシリーズをサポートする最後のリリースに指定しました。

これは重要なリマインダーです。次のKubernetesバージョンにアップグレードする前に、containerd 2.0以降に切り替える必要があります。
どのノードに対応が必要かを特定するために、クラスター内の`kubelet_cri_losing_support`メトリクスを監視できます。

詳細については[公式ブログ記事](/blog/2025/09/12/kubernetes-v1-34-cri-cgroup-driver-lookup-now-ga/#announcement-kubernetes-is-deprecating-containerd-v1-y-support)または[KEP-4033: Discover cgroup driver from CRI](https://kep.k8s.io/4033)をご覧ください。

#### `kubelet`再起動時のPod安定性の向上 {#improved-pod-stability-during-kubelet-restarts}

以前は、`kubelet`サービスの再起動により、Podステータスに一時的な中断が発生することがよくありました。
再起動中、kubeletはコンテナの状態をリセットし、アプリケーション自体が正常に実行されていても、正常なPodが`NotReady`としてマークされ、ロードバランサーから削除されていました。

この信頼性の問題に対処するため、シームレスなノードメンテナンスを確保するようにこの挙動が修正されました。
`kubelet`は起動時にランタイムから既存のコンテナの状態を適切に復元するようになりました。
これにより、`kubelet`の再起動やアップグレード中もワークロードは`Ready`状態を維持し、トラフィックは中断されることなく流れ続けます。

詳細については[KEP-4781: Fix inconsistent container ready state after kubelet restart](https://kep.k8s.io/4781)をご覧ください。

## リリースノート {#release-notes}

Kubernetes v1.35リリースの詳細については、[リリースノート](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.35.md)をご覧ください。

## 入手方法 {#availability}

Kubernetes v1.35は[GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.35.0)または[Kubernetes公式サイトのダウンロードページ](/releases/download/)からダウンロードできます。

Kubernetesを始めるには、[インタラクティブチュートリアル](/docs/tutorials/)をチェックするか、[minikube](https://minikube.sigs.k8s.io/)を使用してローカルKubernetesクラスターを実行してください。
また、[kubeadm](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)を使用して簡単にv1.35をインストールすることもできます。

## リリースチーム {#release-team}

Kubernetesは、コミュニティの支援、コミットメント、献身的な努力なくしては成り立ちません。
各リリースチームは、皆さんが利用するKubernetesリリースを構成する様々な要素を協力して構築する、献身的なコミュニティボランティアで構成されています。
これを実現するには、コードそのものからドキュメント作成、プロジェクト管理に至るまで、コミュニティのあらゆる分野の専門スキルが必要です。

私たちは、技術的な卓越性と周囲を巻き込む情熱でKubernetesコミュニティに永続的な影響を残した、長年にわたるコントリビューターであり尊敬されるエンジニアである[Han Kangを追悼します](https://github.com/cncf/memorials/blob/main/han-kang.md)。
HanはSIG InstrumentationとSIG API Machineryにおいて重要な存在であり、プロジェクトのコアの安定性に対する重要な貢献と持続的なコミットメントにより、[2021 Kubernetes Contributor Award](https://www.kubernetes.dev/community/awards/2021/)を受賞しました。
技術的な貢献に加えて、Hanはメンターとしての寛大さと人々のつながりを築くことへの情熱で深く称賛されていました。
彼は、新しいコントリビューターの最初のPull Requestを導いたり、忍耐と優しさで同僚をサポートしたりと、他者のために「扉を開く」ことで知られていました。
Hanの遺志は、彼がインスパイアしたエンジニアたち、彼が構築を手助けした堅牢なシステム、そして彼がクラウドネイティブのエコシステム内で育んだ温かく協力的な精神を通じて生き続けています。

Kubernetes v1.35リリースをコミュニティに届けるために多くの時間を費やして取り組んでくれた[リリースチーム](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.35/release-team.md)全体に感謝します。
リリースチームには、初参加のShadow(見習い)から、複数のリリースサイクルで経験を積んだベテランのチームリードまで、様々なメンバーが参加しています。
リリースリードの[Drew Hagen](https://github.com/drewhagen)に心より感謝します。
彼の実践的な指導と活力あふれるエネルギーは、複雑な課題を乗り越える力となっただけでなく、この成功したリリースの背後にあるコミュニティ精神を燃え立たせました。

## プロジェクトの活動状況 {#project-velocity}

CNCF K8sの[DevStats](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&var-period=m&var-repogroup_name=All)プロジェクトは、Kubernetesおよび様々なサブプロジェクトの活動状況に関する興味深いデータポイントを集計しています。
これには個人の貢献から貢献企業数まで含まれ、このエコシステムの発展に費やされる努力の深さと広さを示しています。

v1.35リリースサイクル(2025年9月15日から2025年12月17日までの14週間)において、Kubernetesには最大85の異なる企業と419人の個人から貢献がありました。
より広範なクラウドネイティブエコシステムでは、この数字は281社、合計1769人のコントリビューターに達しています。

なお、「貢献」とはコミットの作成、コードレビュー、コメント、IssueやPRの作成、PRのレビュー(ブログやドキュメントを含む)、またはIssueやPRへのコメントを行うことを指します。  
貢献に興味がある場合は、コントリビューター向けWebサイトの[はじめに](https://www.kubernetes.dev/docs/guide/#getting-started)をご覧ください。

データソース:

* [Companies contributing to Kubernetes](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&from=1747609200000&to=1756335599000&var-period=d28&var-repogroup_name=Kubernetes&var-repo_name=kubernetes%2Fkubernetes)  
* [Overall ecosystem contributions](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&from=1747609200000&to=1756335599000&var-period=d28&var-repogroup_name=All&var-repo_name=kubernetes%2Fkubernetes)

## イベント情報 {#upcoming-events}

今後開催予定のKubernetesおよびクラウドネイティブイベント(KubeCon + CloudNativeCon、KCDなど)や、世界各地で開催される主要なカンファレンスについて紹介します。
Kubernetesコミュニティの最新情報を入手し、参加しましょう！

**2026年2月**

- [**KCD - Kubernetes Community Days: New Delhi**](https://www.kcddelhi.com/index.html): 2026年2月21日 | インド、ニューデリー
- [**KCD - Kubernetes Community Days: Guadalajara**](https://community.cncf.io/events/details/cncf-kcd-guadalajara-presents-kcd-guadalajara-open-source-contributor-summit/cohost-kcd-guadalajara): 2026年2月23日 | メキシコ、グアダラハラ

**2026年3月**

- [**KubeCon + CloudNativeCon Europe 2026**](https://events.linuxfoundation.org/kubecon-cloudnativecon-europe/): 2026年3月23日-26日 | オランダ、アムステルダム

**2026年5月**

- [**KCD - Kubernetes Community Days: Toronto**](https://community.cncf.io/events/details/cncf-kcd-toronto-presents-kcd-toronto-canada-2026/): 2026年5月13日 | カナダ、トロント
- [**KCD - Kubernetes Community Days: Helsinki**](https://cloudnativefinland.org/kcd-helsinki-2026/): 2026年5月20日 | フィンランド、ヘルシンキ

**2026年6月**

- [**KubeCon + CloudNativeCon China 2026**](https://events.linuxfoundation.org/kubecon-cloudnativecon-china/): 2026年6月10日-11日 | 香港
- [**KubeCon + CloudNativeCon India 2026**](https://events.linuxfoundation.org/kubecon-cloudnativecon-india/): 2026年6月18日-19日 | インド、ムンバイ
- [**KCD - Kubernetes Community Days: Kuala Lumpur**](https://community.cncf.io/kcd-kuala-lumpur-2026/): 2026年6月27日 | マレーシア、クアラルンプール

**2026年7月**

- [**KubeCon + CloudNativeCon Japan 2026**](https://events.linuxfoundation.org/kubecon-cloudnativecon-japan/): 2026年7月29日-30日 | 日本、横浜

最新のイベント情報は[こちら](https://community.cncf.io/events/#/list)でご確認いただけます。

## ウェビナーのご案内 {#upcoming-release-webinar}

Kubernetes v1.35リリースチームのメンバーと一緒に **2026年1月14日(水)午後5時(UTC)** から、このリリースのハイライトやアップグレードの計画に役立つ非推奨事項や削除事項について学びましょう。
詳細および参加登録は、CNCFオンラインプログラム・サイトの[イベントページ](https://community.cncf.io/events/details/cncf-cncf-online-programs-presents-cloud-native-live-kubernetes-v135-release/)をご覧ください。

## 参加方法 {#get-involved}

Kubernetesに関わる最も簡単な方法は、あなたの興味に合った[Special Interest Groups](https://github.com/kubernetes/community/blob/master/sig-list.md)(SIGs)のいずれかに参加することです。
Kubernetesコミュニティに向けて何か発信したいことはありますか？
毎週の[コミュニティミーティング](https://github.com/kubernetes/community/tree/master/communication)や、以下のチャンネルであなたの声を共有してください。
継続的なフィードバックとサポートに感謝いたします。

* 最新情報はBlueSkyの[@kubernetes.io](https://bsky.app/profile/kubernetes.io)をフォローしてください
* [Discuss](https://discuss.kubernetes.io/)でコミュニティディスカッションに参加してください
* [Slack](http://slack.k8s.io/)でコミュニティに参加してください
* [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)で質問したり、回答したりしてください
* あなたのKubernetesに関する[ストーリー](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)を共有してください
* Kubernetesの最新情報は[ブログ](https://kubernetes.io/blog/)でさらに詳しく読むことができます
* リリースチームについての詳細は[Kubernetes Release Team](https://github.com/kubernetes/sig-release/tree/master/release-team)をご覧ください
