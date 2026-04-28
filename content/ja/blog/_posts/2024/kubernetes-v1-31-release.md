---
layout: blog
title: 'Kubernetes v1.31: Elli'
date: 2024-08-13
slug: kubernetes-v1-31-release
author: >
  [Kubernetes v1.31 Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.31/release-team.md)
translator: >
  [Taisuke Okamoto](https://github.com/b1gb4by) ([IDC Frontier Inc.](https://www.idcf.jp/))
---

**編集者:** Matteo Bianchi, Yigit Demirbas, Abigail McCarthy, Edith Puclla, Rashan Smith

Kubernetes v1.31: Elliのリリースを発表します！

これまでのリリースと同様に、Kubernetes v1.31では新たなGA、ベータ、アルファの機能が導入されています。
継続的に高品質なリリースを提供できていることは、私たちの開発サイクルの強さと、活発なコミュニティのサポートを示すものです。
今回のリリースでは、45の機能強化が行われました。
そのうち、11の機能がGAに昇格し、22の機能がベータに移行し、12の機能がアルファとして導入されています。

## リリースのテーマとロゴ

{{< figure src="/images/blog/2024-08-13-kubernetes-1.31-release/k8s-1.31.png" alt="Kubernetes v1.31 Elliのロゴ" class="release-logo" >}}

Kubernetes v1.31のリリーステーマは"Elli"です。

Kubernetes v1.31のElliは、優しい心を持つ愛らしい犬で、かわいらしい船乗りの帽子をかぶっています。
これは、多様で大きなKubernetesコントリビューターファミリーへの遊び心あふれる敬意を表しています。

Kubernetes v1.31は、プロジェクトが[10周年](/ja/blog/2024/06/06/10-years-of-kubernetes/)を祝った後の初めてのリリースです。
Kubernetesは誕生以来、長い道のりを歩んできました。
そして今もなお、各リリースで新たな方向に進化し続けています。
10年という節目を迎え、これを実現させた数え切れないほどのKubernetesコントリビューターたちの努力、献身、技術、知恵、そして地道な作業を振り返ると、深い感銘を受けずにはいられません。

プロジェクトの運営には膨大な労力が必要ですが、それにもかかわらず、熱意と笑顔を持って何度も貢献し、コミュニティの一員であることに誇りを感じる人々が絶えません。
新旧問わずコントリビューターから見られるこの「魂」こそが、活気に満ちた、まさに「喜びにあふれた」コミュニティの証なのです。

Kubernetes v1.31のElliは、まさにこの素晴らしい精神を祝福する存在なのです！
Kubernetesの輝かしい次の10年に、みんなで乾杯しましょう！

## GAに昇格した機能のハイライト

_これは、v1.31のリリースに伴いGAとなった改善点の一部です。_

### AppArmorのサポートがGAに

KubernetesのAppArmorサポートがGAになりました。
コンテナの`securityContext`内の`appArmorProfile.type`フィールドを設定することで、AppArmorを使用してコンテナを保護できます。
Kubernetes v1.30より前では、AppArmorはアノテーションで制御されていましたが、v1.30からはフィールドを使用して制御されるようになりました。
そのためアノテーションの使用をやめ、`appArmorProfile.type`フィールドの使用に移行することをお勧めします。

詳細については、[AppArmorのチュートリアル](/docs/tutorials/security/apparmor/)をご覧ください。
この機能は、[SIG Node](https://github.com/kubernetes/community/tree/master/sig-node)によって[KEP #24](https://github.com/kubernetes/enhancements/issues/24)の一環として開発しました。

### kube-proxyによる外部からの接続の安定性改善

kube-proxyを使用した外部からの接続の安定性が、v1.31で大きく改善されました。
Kubernetesのロードバランサーに関する一般的な課題の1つに、トラフィックの損失を防ぐための各コンポーネント間の連携があります。
この機能では、kube-proxyに新たな仕組みを導入し、`type: LoadBalancer`と`externalTrafficPolicy: Cluster`を設定したサービスで公開される終了予定のNodeに対して、ロードバランサーが接続をスムーズに切り替えられるようにしています。
また、クラウドプロバイダーとKubernetesのロードバランサー実装における推奨プラクティスも確立しました。

この機能を利用するには、kube-proxyがクラスタ上でデフォルトのサービスプロキシとして動作し、ロードバランサーが接続の切り替えをサポートしている必要があります。
特別な設定は不要で、v1.30からkube-proxyにデフォルトで組み込まれており、v1.31で正式にGAとなりました。

詳しくは、[仮想IPとサービスプロキシのドキュメント](/docs/reference/networking/virtual-ips/#external-traffic-policy)をご覧ください。

この機能は、[SIG Network](https://github.com/kubernetes/community/tree/master/sig-network)が[KEP #3836](https://github.com/kubernetes/enhancements/issues/3836)の一環として開発しました。

### 永続ボリュームの状態変化時刻の記録機能が正式リリース

永続ボリュームの状態変化時刻を記録する機能が、v1.31で正式にリリースされました。
この機能により、PersistentVolumeの状態が最後に変わった時刻を保存する`PersistentVolumeStatus`フィールドが追加されます。
機能が有効になると、すべてのPersistentVolumeオブジェクトに`.status.lastTransitionTime`という新しいフィールドが設けられ、ボリュームの状態が最後に変わった時刻が記録されます。
ただし、この変更はすぐには反映されません。
Kubernetes v1.31にアップグレードした後、PersistentVolumeが更新され、状態(`Pending`、`Bound`、`Released`)が初めて変わったときに、新しいフィールドに時刻が記録されます。
この機能により、PersistentVolumeが`Pending`から`Bound`に変わるまでの時間を測定できるようになります。
また、様々な指標やSLOの設定にも活用できます。

詳しくは、[永続ボリュームのドキュメント](/ja/docs/concepts/storage/persistent-volumes/)をご覧ください。

この機能は、[SIG Storage](https://github.com/kubernetes/community/tree/master/sig-storage)が[KEP #3762](https://github.com/kubernetes/enhancements/issues/3762)の一環として開発しました。

## ベータに昇格した機能のハイライト

_これは、v1.31のリリースに伴いベータとなった改善点の一部です。_

### kube-proxyでのnftablesバックエンドの導入

v1.31では、nftablesバックエンドがベータとして登場しました。
この機能は`NFTablesProxyMode`という設定で制御され、現在はデフォルトで有効になっています。

nftables APIは、iptables APIの次世代版として開発され、より高いパフォーマンスと拡張性を提供します。
`nftables`プロキシモードは、`iptables`モードと比べてサービスエンドポイントの変更をより迅速かつ効率的に処理できます。
また、カーネル内でのパケット処理も効率化されています(ただし、この効果は数万のサービスを持つ大規模クラスタでより顕著になります)。

Kubernetes v1.31の時点では、`nftables`モードはまだ新しい機能のため、すべてのネットワークプラグインとの互換性が確認されているわけではありません。
お使いのネットワークプラグインのドキュメントで対応状況を確認してください。
このプロキシモードはLinux Nodeのみで利用可能で、カーネル5.13以降が必要です。
移行を検討する際は、特にNodePortサービスに関連する一部の機能が、iptablesモードとnftablesモードで完全に同じように動作しない点に注意が必要です。
デフォルト設定の変更が必要かどうかは、[移行ガイド](/docs/reference/networking/virtual-ips/#migrating-from-iptables-mode-to-nftables)で確認してください。

この機能は、[SIG Network](https://github.com/kubernetes/community/tree/master/sig-network)が[KEP #3866](https://github.com/kubernetes/enhancements/issues/3866)の一環として開発しました。

### 永続ボリュームのreclaimポリシーに関する変更

Kubernetes v1.31では、PersistentVolumeのreclaimポリシーを常に尊重する機能がベータになりました。
この機能強化により、関連するPersistentVolumeClaim(PVC)が削除された後でも、PersistentVolume(PV)のreclaimポリシーが確実に適用されるようになり、ボリュームの漏洩を防止します。

これまでは、PVとPVCのどちらが先に削除されたかによって、特定の条件下でPVに設定されたreclaimポリシーが無視されることがありました。
その結果、reclaimポリシーが"Delete"に設定されていても、外部インフラの対応するストレージリソースが削除されないケースがありました。
これにより、一貫性の欠如やリソースのリークが発生する可能性がありました。

この機能の導入により、PVとPVCの削除順序に関係なく、reclaimポリシーの"Delete"が確実に実行され、バックエンドインフラから基盤となるストレージオブジェクトが削除されることがKubernetesによって保証されるようになりました。

この機能は、[SIG Storage](https://github.com/kubernetes/community/tree/master/sig-storage)が[KEP #2644](https://github.com/kubernetes/enhancements/issues/2644)の一環として開発しました。

### バインドされたサービスアカウントトークンの改善

`ServiceAccountTokenNodeBinding`機能が、v1.31でベータに昇格しました。
この機能により、PodではなくNodeにのみバインドされたトークンを要求できるようになりました。
このトークンには、Node情報が含まれており、トークンが使用される際にNodeの存在を検証します。
詳しくは、[バインドされたサービスアカウントトークンのドキュメント](/docs/reference/access-authn-authz/service-accounts-admin/#bound-service-account-tokens)をご覧ください。

この機能は、[SIG Auth](https://github.com/kubernetes/community/tree/master/sig-auth)が[KEP #4193](https://github.com/kubernetes/enhancements/issues/4193)の一環として開発しました。

### 複数のサービスCIDRのサポート

v1.31では、複数のサービスCIDRを持つクラスターのサポートがベータになりました(デフォルトでは無効)。

Kubernetesクラスターには、IPアドレスを使用する複数のコンポーネントがあります: Node、Pod、そしてServiceです。
NodeとPodのIP範囲は、それぞれインフラストラクチャやネットワークプラグインに依存するため、動的に変更できます。
しかし、サービスのIP範囲は、クラスター作成時にkube-apiserverのハードコードされたフラグとして定義されていました。
長期間運用されているクラスターや大規模なクラスターでは、管理者が割り当てられたサービスCIDR範囲を拡張、縮小、あるいは完全に置き換える必要があり、IPアドレスの枯渇が問題となっていました。
これらの操作は正式にサポートされておらず、複雑で繊細なメンテナンス作業を通じて行われ、しばしばクラスタのダウンタイムを引き起こしていました。
この新機能により、ユーザーとクラスター管理者はダウンタイムなしでサービスCIDR範囲を動的に変更できるようになります。

この機能の詳細については、[仮想IPとサービスプロキシ](/docs/reference/networking/virtual-ips/#ip-address-objects)のドキュメントページをご覧ください。

この機能は、[SIG Network](https://github.com/kubernetes/community/tree/master/sig-network)が[KEP #1880](https://github.com/kubernetes/enhancements/issues/1880)の一環として開発しました。

### サービスのトラフィック分散機能

サービスのトラフィック分散機能が、v1.31でベータとなり、デフォルトで有効になりました。

SIG Networkingは、サービスネットワーキングにおける最適なユーザー体験とトラフィック制御機能を見出すため、何度も改良を重ねてきました。
その結果、サービス仕様に`trafficDistribution`フィールドを実装しました。
このフィールドは、ルーティングの決定を行う際に、基盤となる実装が考慮すべき指針として機能します。

この機能の詳細については、[1.30リリースブログ](/blog/2024/04/17/kubernetes-v1-30-release/#traffic-distribution-for-services-sig-network-https-github-com-kubernetes-community-tree-master-sig-network)をお読みいただくか、[サービス](/docs/concepts/services-networking/service/#traffic-distribution)のドキュメントページをご覧ください。

この機能は、[SIG Network](https://github.com/kubernetes/community/tree/master/sig-network)が[KEP #4444](https://github.com/kubernetes/enhancements/issues/4444)の一環として開発しました。

### Kubernetes VolumeAttributesClassによるボリューム修正機能

[VolumeAttributesClass](/ja/docs/concepts/storage/volume-attributes-classes/) APIが、v1.31でベータになります。
VolumeAttributesClassは、プロビジョニングされたIOのような動的なボリュームパラメータを修正するための、Kubernetes独自の汎用APIを提供します。
これにより、プロバイダーがサポートしている場合、ワークロードはコストとパフォーマンスのバランスを取るために、オンラインでボリュームを垂直スケーリングできるようになります。
この機能は、Kubernetes 1.29からアルファとして提供されていました。

この機能は、[SIG Storage](https://github.com/kubernetes/community/tree/master/sig-storage)が主導し、[KEP #3751](https://github.com/kubernetes/enhancements/issues/3751)の一環として開発しました。

## アルファとして導入された新機能

_これは、v1.31のリリースでアルファとして導入された主な改善点の一部です。_

### アクセラレータなどのハードウェア管理を改善する新しいDRA API

Kubernetes v1.31では、動的リソース割り当て(DRA)APIとその設計が更新されました。
この更新の主な焦点は構造化パラメータにあります。
これにより、リソース情報とリクエストがKubernetesとクライアントに対して透明になり、クラスタのオートスケーリングなどの機能の実装が可能になります。
kubeletのDRAサポートも更新され、kubeletとコントロールプレーン間のバージョンの違いに対応できるようになりました。
構造化パラメータにより、スケジューラはPodのスケジューリング時にResourceClaimを割り当てます。
DRAドライバコントローラによる割り当ては、現在「クラシックDRA」と呼ばれる方法でも引き続きサポートされています。

Kubernetes v1.31では、クラシックDRAに`DRAControlPlaneController`という別のフィーチャーゲートが用意されており、これを明示的に有効にする必要があります。
このコントロールプレーンコントローラーを使用することで、DRAドライバは構造化パラメータではまだサポートされていない割り当てポリシーを実装できます。

この機能は、[SIG Node](https://github.com/kubernetes/community/tree/master/sig-node)が[KEP #3063](https://github.com/kubernetes/enhancements/issues/3063)の一環として開発しました。

### イメージボリュームのサポート

Kubernetesコミュニティは、将来的に人工知能(AI)や機械学習(ML)のユースケースをより多く実現することを目指しています。

これらのユースケースを実現するための要件の1つは、Open Container Initiative(OCI)互換のイメージやアーティファクト(OCIオブジェクトと呼ばれる)を、ネイティブのボリュームソースとして直接サポートすることです。
これにより、ユーザーはOCI標準に集中でき、OCIレジストリを使用してあらゆるコンテンツを保存・配布できるようになります。

そこで、v1.31では、OCIイメージをPod内のボリュームとして使用できる新しいアルファ機能が追加されました。
この機能により、ユーザーはPod内でイメージ参照をボリュームとして指定し、それをコンテナ内のボリュームマウントとして再利用できます。
この機能を試すには、`ImageVolume`フィーチャーゲートを有効にする必要があります。

この機能は、[SIG Node](https://github.com/kubernetes/community/tree/master/sig-node)と[SIG Storage](https://github.com/kubernetes/community/tree/master/sig-storage)が[KEP #4639](https://github.com/kubernetes/enhancements/issues/4639)の一環として開発しました。

### Podステータスを通じたデバイスの健全性情報の公開

Podステータスを通じてデバイスの健全性情報を公開する機能が、v1.31で新しいアルファ機能として追加されました。デフォルトでは無効になっています。

Kubernetes v1.31以前では、Podが故障したデバイスと関連付けられているかどうかを知る方法は、[PodResources API](/ja/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources)を使用することでした。

この機能を有効にすると、各Pod の`.status`内の各コンテナステータスに`allocatedResourcesStatus`フィールドが追加されます。
`allocatedResourcesStatus`フィールドは、コンテナに割り当てられた各デバイスの健全性情報を報告します。

この機能は、[SIG Node](https://github.com/kubernetes/community/tree/master/sig-node)が[KEP #4680](https://github.com/kubernetes/enhancements/issues/4680)の一環として開発しました。

### セレクターに基づいたより細かな認可

この機能により、Webhookオーソライザーや将来の(現在は設計されていない)ツリー内オーソライザーが、ラベルやフィールドセレクターを使用するリクエストに限り、**list**と**watch**リクエストを許可できるようになります。
例えば、オーソライザーは次のような表現が可能になります: このユーザーはすべてのPodをリストできないが、`.spec.nodeName`が特定の値に一致するPodはリストできる。
あるいは、ユーザーが名前空間内の`confidential: true`とラベル付けされて**いない**すべてのSecretを監視することを許可する。
CRDフィールドセレクター(これもv1.31でベータに移行)と組み合わせることで、より安全なNodeごとの拡張機能を作成することが可能になります。

この機能は、[SIG Auth](https://github.com/kubernetes/community/tree/master/sig-auth)が[KEP #4601](https://github.com/kubernetes/enhancements/issues/4601)の一環として開発しました。

### 匿名APIアクセスへの制限

`AnonymousAuthConfigurableEndpoints`フィーチャーゲートを有効にすることで、ユーザーは認証設定ファイルを使用して、匿名リクエストがアクセスできるエンドポイントを設定できるようになりました。
これにより、匿名ユーザーにクラスタへの広範なアクセスを与えてしまうようなRBAC設定ミスから、ユーザー自身を守ることができます。

この機能は、[SIG Auth](https://github.com/kubernetes/community/tree/master/sig-auth)が[KEP #4633](https://github.com/kubernetes/enhancements/issues/4633)の一環として開発しました。

## 1.31における機能の昇格、非推奨化、および削除

### GAへの昇格

ここでは、GA(一般提供とも呼ばれる)に昇格したすべての機能を紹介します。新機能やアルファからベータへの昇格を含む完全な更新リストについては、リリースノートをご覧ください。

このリリースでは、以下の11個の機能強化がGAに昇格しました:

* [PersistentVolume last phase transition time](https://github.com/kubernetes/enhancements/issues/3762)
* [Metric cardinality enforcement](https://github.com/kubernetes/enhancements/issues/2305)
* [Kube-proxy improved ingress connectivity reliability](https://github.com/kubernetes/enhancements/issues/3836)
* [Add CDI devices to device plugin API](https://github.com/kubernetes/enhancements/issues/4009)
* [Move cgroup v1 support into maintenance mode](https://github.com/kubernetes/enhancements/issues/4569)
* [AppArmor support](https://github.com/kubernetes/enhancements/issues/24)
* [PodHealthyPolicy for PodDisruptionBudget](https://github.com/kubernetes/enhancements/issues/3017)
* [Retriable and non-retriable Pod failures for Jobs](https://github.com/kubernetes/enhancements/issues/3329)
* [Elastic Indexed Jobs](https://github.com/kubernetes/enhancements/issues/3715)
* [Allow StatefulSet to control start replica ordinal numbering](https://github.com/kubernetes/enhancements/issues/3335)
* [Random Pod selection on ReplicaSet downscaling](https://github.com/kubernetes/enhancements/issues/2185)

### 非推奨化と削除

Kubernetesの開発と成熟に伴い、プロジェクト全体の健全性のために、機能が非推奨化、削除、またはより良いものに置き換えられる場合があります。
このプロセスの詳細については、Kubernetesの[非推奨化と削除のポリシー](/ja/docs/reference/using-api/deprecation-policy/)をご覧ください。

#### cgroup v1のメンテナンスモードへの移行

Kubernetesがコンテナオーケストレーションの変化に適応し続ける中、コミュニティはv1.31でcgroup v1のサポートをメンテナンスモードに移行することを決定しました。
この変更は、業界全体の[cgroup v2](/ja/docs/concepts/architecture/cgroups/)への移行と歩調を合わせており、機能性、拡張性、そしてより一貫性のあるインターフェースの向上を提供します。
Kubernetesのメンテナンスモードとは、cgroup v1サポートに新機能が追加されないことを意味します。
重要なセキュリティ修正は引き続き提供されますが、バグ修正はベストエフォートとなり、重大なバグは可能な場合修正されますが、一部の問題は未解決のままとなる可能性があります。

できるだけ早くcgroup v2への移行を開始することをお勧めします。
この移行はアーキテクチャに依存し、基盤となるオペレーティングシステムとコンテナランタイムがcgroup v2をサポートしていることを確認し、ワークロードとアプリケーションがcgroup v2で正しく機能することを検証するためのテストを含みます。

問題が発生した場合は、[issue](https://github.com/kubernetes/kubernetes/issues/new/choose)を作成して報告してください。

この機能は、[SIG Node](https://github.com/kubernetes/community/tree/master/sig-node)が[KEP #4569](https://github.com/kubernetes/enhancements/issues/4569)の一環として開発しました。

#### SHA-1署名サポートに関する注意事項

[go1.18](https://go.dev/doc/go1.18#sha1)(2022年3月リリース)以降、crypto/x509ライブラリはSHA-1ハッシュ関数で署名された証明書を拒否するようになりました。
SHA-1は安全でないことが確立されており、公的に信頼された認証局は2015年以降SHA-1証明書を発行していません。
Kubernetesのコンテキストでは、アグリケーションAPIサーバーやWebhookに使用される私的な認証局を通じてSHA-1ハッシュ関数で署名されたユーザー提供の証明書が依然として存在する可能性があります。
SHA-1ベースの証明書を使用している場合は、環境に`GODEBUG=x509sha1=1`を設定することで、明示的にそのサポートを有効にする必要があります。

Goの[GODEBUGの互換性ポリシー](https://go.dev/blog/compat)に基づき、`x509sha1` GODEBUGとSHA-1証明書のサポートは、[go1.24で完全に削除される](https://tip.golang.org/doc/go1.23)予定です。
go1.24は2025年前半にリリースされる予定です。
SHA-1証明書に依存している場合は、できるだけ早く移行を開始してください。

SHA-1サポートの終了時期、Kubernetesリリースがgo1.24を採用する計画、およびメトリクスと監査ログを通じてSHA-1証明書の使用を検出する方法の詳細については、[Kubernetes issue #125689](https://github.com/kubernetes/kubernetes/issues/125689)をご覧ください。

#### Nodeの`status.nodeInfo.kubeProxyVersion`フィールドの非推奨化([KEP 4004](https://github.com/kubernetes/enhancements/issues/4004))

Kubernetes v1.31では、Nodeの`.status.nodeInfo.kubeProxyVersion`フィールドが非推奨となり、将来のリリースで削除される予定です。
このフィールドの値が正確ではなかった(そして現在も正確ではない)ため、非推奨化されています。
このフィールドはkubeletによって設定されますが、kubeletはkube-proxyのバージョンやkube-proxyが実行されているかどうかについて信頼できる情報を持っていません。

v1.31では、`DisableNodeKubeProxyVersion`[フィーチャーゲート](/docs/reference/command-line-tools-reference/feature-gates/)がデフォルトで`true`に設定され、kubeletは関連するNodeの`.status.kubeProxyVersion`フィールドを設定しなくなります。

#### クラウドプロバイダーとの全てのインツリー統合の削除

[以前の記事](/ja/blog/2024/05/20/completing-cloud-provider-migration/)で強調したように、クラウドプロバイダー統合の最後に残っていたインツリーサポートがv1.31リリースの一部として削除されました。
これは、クラウドプロバイダーと統合できなくなったという意味ではありません。
ただし、外部統合を使用する推奨アプローチを**必ず**使用する必要があります。
一部の統合はKubernetesプロジェクトの一部であり、他はサードパーティのソフトウェアです。

この節目は、Kubernetes v1.26から始まった、全てのクラウドプロバイダー統合のKubernetesコアからの外部化プロセスの完了を示しています([KEP-2395](https://github.com/kubernetes/enhancements/blob/master/keps/sig-cloud-provider/2395-removing-in-tree-cloud-providers/README.md))。
この変更により、Kubernetesは真にベンダー中立なプラットフォームに近づきます。

クラウドプロバイダー統合の詳細については、[v1.29 クラウドプロバイダー統合機能のブログ記事](/ja/blog/2023/12/14/cloud-provider-integration-changes/)をお読みください。
インツリーのコード削除に関する追加の背景については、([v1.29 非推奨化ブログ](/ja/blog/2023/11/16/kubernetes-1-29-upcoming-changes/#removal-of-in-tree-integrations-with-cloud-providers-kep-2395-https-kep-k8s-io-2395))をご確認ください。

後者のブログには、v1.29以降のバージョンに移行する必要があるユーザーにとって有用な情報も含まれています。

#### インツリープロバイダーのフィーチャーゲートの削除

Kubernetes v1.31では、以下のアルファフィーチャーゲートが削除されました: `InTreePluginAWSUnregister`、`InTreePluginAzureDiskUnregister`、`InTreePluginAzureFileUnregister`、`InTreePluginGCEUnregister`、`InTreePluginOpenStackUnregister`、および`InTreePluginvSphereUnregister`。
これらのフィーチャーゲートは、実際にコードベースから削除することなく、インツリーのボリュームプラグインが削除されたシナリオのテストを容易にするために導入されました。
Kubernetes 1.30でこれらのインツリーのボリュームプラグインが非推奨となったため、これらのフィーチャーゲートは冗長となり、もはや目的を果たさなくなりました。
唯一残っているCSIの移行ゲートは`InTreePluginPortworxUnregister`で、これはPortworxのCSI移行が完了し、そのツリー内ボリュームプラグインの削除準備が整うまでアルファのままとなります。

#### kubeletの`--keep-terminated-pod-volumes`コマンドラインフラグの削除

2017年に非推奨となったkubeletのフラグ`--keep-terminated-pod-volumes`が、v1.31リリースの一部として削除されました。

詳細については、Pull Request [#122082](https://github.com/kubernetes/kubernetes/pull/122082)をご覧ください。

#### CephFSボリュームプラグインの削除

[CephFSボリュームプラグイン](/docs/concepts/storage/volumes/#cephfs)がこのリリースで削除され、`cephfs`ボリュームタイプは機能しなくなりました。

代わりに、サードパーティのストレージドライバーとして[CephFS CSIドライバー](https://github.com/ceph/ceph-csi/)を使用することをお勧めします。
クラスターバージョンをv1.31にアップグレードする前にCephFSボリュームプラグインを使用していた場合は、新しいドライバーを使用するようにアプリケーションを再デプロイする必要があります。

CephFSボリュームプラグインは、v1.28で正式に非推奨とマークされていました。

#### Ceph RBDボリュームプラグインの削除

v1.31リリースでは、[Ceph RBDボリュームプラグイン](/docs/concepts/storage/volumes/#rbd)とそのCSI移行サポートが削除され、`rbd`ボリュームタイプは機能しなくなりました。

代わりに、クラスターで[RBD CSIドライバー](https://github.com/ceph/ceph-csi/)を使用することをお勧めします。
クラスターバージョンをv1.31にアップグレードする前にCeph RBDボリュームプラグインを使用していた場合は、新しいドライバーを使用するようにアプリケーションを再デプロイする必要があります。

Ceph RBDボリュームプラグインは、v1.28で正式に非推奨とマークされていました。

#### kube-schedulerにおける非CSIボリューム制限プラグインの非推奨化

v1.31リリースでは、すべての非CSIボリューム制限スケジューラープラグインが非推奨となり、[デフォルトプラグイン](/docs/reference/scheduling/config/)から既に非推奨となっているいくつかのプラグインが削除されます。
これには以下が含まれます：

* `AzureDiskLimits`
* `CinderLimits`
* `EBSLimits`
* `GCEPDLimits`

これらのボリュームタイプはCSIに移行されているため、代わりに`NodeVolumeLimits`プラグインを使用することをお勧めします。
`NodeVolumeLimits`プラグインは、削除されたプラグインと同じ機能を処理できます。
[スケジューラーの設定](/ja/docs/reference/scheduling/config/)で明示的にこれらのプラグインを使用している場合は、非推奨のプラグインを`NodeVolumeLimits`プラグインに置き換えてください。
`AzureDiskLimits`、`CinderLimits`、`EBSLimits`、`GCEPDLimits`プラグインは将来のリリースで削除される予定です。

これらのプラグインは、Kubernetes v1.14以降非推奨となっていたため、デフォルトのスケジューラープラグインリストから削除されます。

### リリースノートとアップグレードに必要なアクション

Kubernetes v1.31リリースの詳細については、[リリースノート](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.31.md)をご確認ください。

#### `SchedulerQueueingHints`が有効な場合、スケジューラーはQueueingHintを使用するようになりました

スケジューラーに、Pod/Updatedイベントに登録されたQueueingHintを使用して、以前スケジュール不可能だったPodの更新がそれらをスケジュール可能にしたかどうかを判断するサポートが追加されました。
この新機能は、フィーチャーゲート`SchedulerQueueingHints`が有効な場合に動作します。

これまで、スケジュール不可能なPodが更新された場合、スケジューラは常にPodをキュー(`activeQ` / `backoffQ`)に戻していました。
しかし、Podへのすべての更新がPodをスケジュール可能にするわけではありません。
特に、現在の多くのスケジューリング制約が不変であることを考慮すると、そうではありません。
新しい動作では、スケジュール不可能なPodが更新されると、スケジューリングキューはQueueingHint(s)を使用して、その更新がPodをスケジュール可能にする可能性があるかどうかをチェックします。
少なくとも1つのQueueingHintが`Queue`を返した場合にのみ、それらを`activeQ`または`backoffQ`に再度キューイングします。

**カスタムスケジューラープラグイン開発者向けの必要なアクション**:
プラグインからの拒否が、スケジュールされていないPod自体の更新によって解決される可能性がある場合、プラグインはPod/Updateイベントに対するQueueingHintを実装する必要があります。
例えば`schedulable=false`ラベルを持つPodを拒否するカスタムプラグインを開発したとします。
`schedulable=false`ラベルを持つPodは、`schedulable=false`ラベルが削除されるとスケジュール可能になります。このプラグインはPod/Updateイベントに対するQueueingHintを実装し、スケジュールされていないPodでそのようなラベルの変更が行われた場合にQueueを返すようにします。
詳細については、Pull Request [#122234](https://github.com/kubernetes/kubernetes/pull/122234)をご覧ください。

#### kubeletの`--keep-terminated-pod-volumes`コマンドラインフラグの削除

2017年に非推奨となったkubeletのフラグ`--keep-terminated-pod-volumes`が、v1.31リリースの一部として削除されました。

詳細については、Pull Request [#122082](https://github.com/kubernetes/kubernetes/pull/122082)をご覧ください。

## 入手方法

Kubernetes v1.31は、[GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.31.0)または[Kubernetesダウンロードページ](/ja/releases/download/)からダウンロードできます。

Kubernetesを始めるには、[対話式のチュートリアル](/ja/docs/tutorials/)をチェックするか、[minikube](https://minikube.sigs.k8s.io/)を使用してローカルKubernetesクラスタを実行してください。
また、[kubeadm](/ja/docs/setup/independent/create-cluster-kubeadm/)を使用して簡単にv1.31をインストールすることもできます。

## リリースチーム

Kubernetesは、そのコミュニティのサポート、献身、そして懸命な努力に支えられて実現しています。
各リリースチームは、皆様が頼りにしているKubernetesリリースを構成する多くの要素を構築するために協力して働く、献身的なコミュニティボランティアで構成されています。
これには、コード自体からドキュメンテーション、プロジェクト管理に至るまで、コミュニティのあらゆる分野から専門的なスキルを持つ人々が必要です。

私たちは、Kubernetes v1.31リリースをコミュニティに提供するために多くの時間を費やしてくださった[リリースチーム](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.31/release-team.md)全体に感謝の意を表します。
リリースチームのメンバーは、初めてShadowとして参加する人から、複数のリリースサイクルを経験したベテランのチームリーダーまで多岐にわたります。
特に、リリースリーダーのAngelos Kolaitisには特別な感謝の意を表します。
リリースサイクルを成功に導き、チーム全体をサポートし、各メンバーが最大限に貢献できる環境を整えると同時に、リリースプロセスの改善にも取り組んでくれました。

## プロジェクトの進捗速度

CNCF K8s DevStatsプロジェクトは、Kubernetesと様々なサブプロジェクトの進捗に関する興味深いデータポイントを集計しています。
これには、個人の貢献から貢献している企業の数まで、このエコシステムの進化に関わる取り組みの深さと広さを示す様々な情報が含まれています。

14週間(5月7日から8月13日まで)続いたv1.31リリースサイクルでは、113の異なる企業と528の個人がKubernetesに貢献しました。

クラウドネイティブエコシステム全体では、379の企業から合計2268人の貢献者がいます。
これは、前回のリリースサイクルと比較して、貢献者数が驚異の63%増加しました！

このデータの出典:

* [Kubernetesに貢献している企業](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&from=1715032800000&to=1723586399000&var-period=d28&var-repogroup_name=Kubernetes&var-repo_name=kubernetes%2Fkubernetes)
* [エコシステム全体への貢献](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&from=1715032800000&to=1723586399000&var-period=d28&var-repogroup_name=All&var-repo_name=kubernetes%2Fkubernetes)

ここでいう貢献とは、コミットの作成、コードレビュー、コメント、IssueやPRの作成、PRのレビュー(ブログやドキュメントを含む)、またはIssueやPRへのコメントを指します。

貢献に興味がある方は、[このページ](https://www.kubernetes.dev/docs/guide/#getting-started)を訪れて始めてください。

Kubernetesプロジェクトとコミュニティ全体の進捗速度についてもっと知りたい方は、[DevStatsをチェック](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&var-period=m&var-repogroup_name=All)してください。

## イベント情報

2024年8月から11月にかけて開催予定のKubernetesとクラウドネイティブ関連のイベントをご紹介します。KubeCon、KCD、その他世界各地で開催される注目のカンファレンスが含まれています。Kubernetesコミュニティの最新情報を入手し、交流を深めましょう。

**2024年8月**

* [**KubeCon + CloudNativeCon + Open Source Summit China 2024**](https://events.linuxfoundation.org/kubecon-cloudnativecon-open-source-summit-ai-dev-china/): 2024年8月21日-23日 | 香港
* [**KubeDay Japan**](https://events.linuxfoundation.org/kubeday-japan/): 2024年8月27日 | 東京、日本

**2024年9月**

* [**KCD Lahore - Pakistan 2024**](https://community.cncf.io/events/details/cncf-kcd-lahore-presents-kcd-lahore-pakistan-2024/): 2024年9月1日 | ラホール、パキスタン
* [**KuberTENes Birthday Bash Stockholm**](https://community.cncf.io/events/details/cncf-stockholm-presents-kubertenes-birthday-bash-stockholm-a-couple-of-months-late/): 2024年9月5日 | ストックホルム、スウェーデン
* [**KCD Sydney '24**](https://community.cncf.io/events/details/cncf-kcd-australia-presents-kcd-sydney-24/): 2024年9月5日-6日 | シドニー、オーストラリア
* [**KCD Washington DC 2024**](https://community.cncf.io/events/details/cncf-kcd-washington-dc-presents-kcd-washington-dc-2024/): 2024年9月24日 | ワシントンDC、アメリカ合衆国
* [**KCD Porto 2024**](https://community.cncf.io/events/details/cncf-kcd-porto-presents-kcd-porto-2024/): 2024年9月27日-28日 | ポルト、ポルトガル

**2024年10月**

* [**KubeDay Australia**](https://events.linuxfoundation.org/kubeday-australia/): 2024年10月1日 | メルボルン、オーストラリア
* [**KCD Austria 2024**](https://community.cncf.io/events/details/cncf-kcd-austria-presents-kcd-austria-2024/): 2024年10月8日-10日 | ウィーン、オーストリア
* [**KCD UK - London 2024**](https://community.cncf.io/events/details/cncf-kcd-uk-presents-kubernetes-community-days-uk-london-2024/): 2024年10月22日-23日 | グレーターロンドン、イギリス

**2024年11月**

* [**KubeCon + CloudNativeCon North America 2024**](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/): 2024年11月12日-15日 | ソルトレイクシティ、アメリカ合衆国
* [**Kubernetes on EDGE Day North America**](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/co-located-events/kubernetes-on-edge-day/): 2024年11月12日 | ソルトレイクシティ、アメリカ合衆国

## 次期リリースに関するウェビナーのお知らせ

2024年9月12日(木)午前10時(太平洋時間)に開催されるKubernetes v1.31リリースチームメンバーによるウェビナーにご参加ください。このリリースの主要な機能や、アップグレード計画に役立つ非推奨化および削除された機能について学ぶことができます。
詳細および登録については、CNCFオンラインプログラムサイトの[イベントページ](https://community.cncf.io/events/details/cncf-cncf-online-programs-presents-cncf-live-webinar-kubernetes-131-release/)をご覧ください。

## 参加方法

Kubernetesに関わる最も簡単な方法は、あなたの興味に合った[Special Interest Groups(SIG)](https://github.com/kubernetes/community/blob/master/sig-list.md)のいずれかに参加することです。
Kubernetesコミュニティに向けて何か発信したいことはありますか？
毎週の[コミュニティミーティング](https://github.com/kubernetes/community/tree/master/communication)や、以下のチャンネルであなたの声を共有してください。
継続的なフィードバックとサポートに感謝いたします。

* 最新情報はX(旧Twitter)の[@Kubernetesio](https://x.com/kubernetesio)をフォローしてください
* [Discuss](https://discuss.kubernetes.io/)でコミュニティディスカッションに参加してください
* [Slack](http://slack.k8s.io/)でコミュニティに参加してください
* [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)で質問したり、回答したりしてください
* あなたのKubernetesに関する[ストーリー](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)を共有してください
* Kubernetesの最新情報は[ブログ](https://kubernetes.io/blog/)でさらに詳しく読むことができます
* [Kubernetesリリースチーム](https://github.com/kubernetes/sig-release/tree/master/release-team)についてもっと学んでください
