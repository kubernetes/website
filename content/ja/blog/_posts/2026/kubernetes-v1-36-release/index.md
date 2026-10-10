---  
layout: blog
title: "Kubernetes v1.36: ハル (Haru)"
date: 2026-04-22
slug: kubernetes-v1-36-release
release_announcement:
  minor_version: "1.36"
author: >
  [Kubernetes v1.36 Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.36/release-team.md)
translator: >
  [Taisuke Okamoto](https://github.com/b1gb4by) ([PLAID, Inc.](https://plaid.co.jp/)),
  [Takuya Kitamura](https://github.com/kfess),
  [Ryota Sawada](https://github.com/rytswd) ([Numtide Sàrl](https://numtide.com/)),
  [Junya Okabe](https://github.com/Okabe-Junya) ([Mercari, Inc.](https://about.mercari.com/))
---

**編集者:** Chad M. Crowell、Kirti Goyal、Sophia Ugochukwu、Swathi Rao、Utkarsh Umre

前回のリリースと同様に、Kubernetes v1.36のリリースでは新しいGA、ベータ、アルファの機能が導入されます。
高品質なリリースの継続的な提供は、私たちの開発サイクルの強さとコミュニティからの活発なサポートを示しています。

このリリースは70個の機能改善で構成されています。
それらのうち、GAへの昇格が18個、ベータへの移行が25個、アルファとしての導入が25個です。

また、このリリースにはいくつかの[非推奨化と削除](#deprecations-removals-and-community-updates)があります。
これらに必ず目を通してください。

## リリースのテーマとロゴ {#release-theme-and-logo}

{{< figure src="k8s-v1.36.svg" alt="Kubernetes v1.36 ハルのロゴ: v1.36の下に流れるような書体でハルと書かれた六角形のバッジ。右側に富士山がそびえ立ち、山頂は赤く照らされ薄い雪の筋が見える。山の斜面には「晴れに翔け」という日本語の書道が描かれている。左側の青空には浮世絵風の様式化された雲の間にKubernetesの白い舵輪が浮かんでいる。手前には一対の守護猫が立っている。左に灰白色の猫、右に茶トラの猫で、それぞれ小さな青いKubernetesの舵輪チャームが付いた首輪を着けている" class="release-logo" >}}

Kubernetes v1.36で2026年の幕を開けます。
このリリースは季節が移り変わり、山の光が変化する時に届きました。
ハルは日本語で多くの意味を持つ響きです。
その中で最も大切にしているのは、春、晴れ(澄んだ空)、そして遥か(遠く離れた)です。
季節と空と地平線。
この先にある内容には、その3つすべてが見つかるでしょう。

ロゴは[avocadoneko / Natsuho Ide](https://x.com/avocadoneko)によって作成され、[葛飾北斎](https://ja.wikipedia.org/wiki/%E8%91%9B%E9%A3%BE%E5%8C%97%E6%96%8E)の[『富嶽三十六景』](https://ja.wikipedia.org/wiki/%E5%AF%8C%E5%B6%BD%E4%B8%89%E5%8D%81%E5%85%AD%E6%99%AF)からインスピレーションを得ています。
これは[『神奈川沖浪裏』](https://ja.wikipedia.org/wiki/%E7%A5%9E%E5%A5%88%E5%B7%9D%E6%B2%96%E6%B5%AA%E8%A3%8F)を世界に送り出したのと同じシリーズです。
v1.36のロゴは、シリーズの中で最も有名な作品の一つである[『凱風快晴』](https://ja.wikipedia.org/wiki/%E5%87%B1%E9%A2%A8%E5%BF%AB%E6%99%B4)、赤富士とも呼ばれる作品を再解釈しています。
夏の夜明けに赤く染まった山が、長い雪解けの後に雪のない姿を見せる光景です。
三十六の景色はv1.36にふさわしい数であり、北斎もそこで止まらなかったことを思い起こさせます。<sup>1</sup>
その風景を見守るのはKubernetesの舵輪で、山の傍らの空に配置されています。

富士の麓にはStella(左)とNacho(右)という2匹の猫が座っています。
首輪にKubernetesの舵輪が付いた彼らは、日本の神社を守る一対の[狛犬](https://ja.wikipedia.org/wiki/%E7%8B%9B%E7%8A%AC)の役割を担っています。
一対であるのは、何事も一人では守れないからです。
StellaとNachoは、はるかに大きな仲間を代表しています。
SIGとワーキンググループ、メンテナーとレビュアー、ドキュメント、ブログ、翻訳の担当者、リリースチーム、初めての一歩を踏み出す新規コントリビューター、そして季節ごとに戻ってくる長年のコントリビューターです。
Kubernetes v1.36は、いつものように多くの手によって支えられています。

ロゴの赤富士の峰に沿って「晴れに翔け」という書が描かれています。
これは山に収まりきらなかった対句の前半です:

> **晴れに翔け、未来よ明け**\
> 「澄んだ空へ翔け、明日の夜明けに向かって」

これが、このリリースに込めた願いです。
澄んだ空へ翔けること。
リリースそのもののため、プロジェクトのため、そしてそれを共に届けるすべての人のために。
赤富士に差す朝日は終わりではなく、通過点です。
このリリースは次のリリースへ、そのリリースはまたその次へと、一つの視点では捉えきれない遥かな地平線に向かって続いていきます。

<sub>1. このシリーズは非常に人気があったため、北斎はさらに10枚の版画を追加し、合計46枚になりました。</sub>

## 主なアップデート情報 {#spotlight-on-key-updates}

Kubernetes v1.36は新機能と改善点が満載です。
このセクションでは、リリースチームが特に注目して欲しい、選りすぐりのアップデート内容をご紹介します！

### 安定版: きめ細かなAPI認可 {#stable-fine-grained-api-authorization}

Kubernetes SIG AuthおよびSIG Nodeを代表して、きめ細かな`kubelet` API認可がKubernetes v1.36でGA(General Availability)に昇格したことをお知らせします！

`KubeletFineGrainedAuthz`フィーチャーゲートは、Kubernetes v1.32でオプトインのアルファ機能として導入され、v1.33でベータ(デフォルトで有効)に昇格しました。
現在、この機能はGAになりました。
この機能は、`kubelet`のHTTPS APIに対してより精密な最小権限のアクセス制御を可能にし、一般的な監視や可観測性のユースケースにおいて過度に広範なnodes/proxy権限を付与する必要性を排除します。

この取り組みは、SIG AuthとSIG Nodeが主導した[KEP #2862](https://kep.k8s.io/2862)の一環として行われました。

### ベータ: リソースヘルスステータス {#beta-resource-health-status}

v1.34のリリース以前は、Kubernetesには割り当てられたデバイスの健全性を報告するネイティブな方法がなく、ハードウェア障害によるPodのクラッシュを診断することが困難でした。
Device Pluginに焦点を当てたv1.31での最初のアルファリリースを基に、Kubernetes v1.36では各Podの`.status`内の`allocatedResourcesStatus`フィールドをベータに昇格させることでこの機能を拡張しています。
このフィールドは、すべての専用ハードウェアに対する統一されたヘルスレポート機構を提供します。

ユーザーは`kubectl describe pod`を実行して、コンテナのクラッシュループが`Unhealthy`または`Unknown`のデバイスステータスによるものかどうかを判断できるようになりました。
これは、ハードウェアが従来のプラグインまたは新しいDRAフレームワークのどちらで提供されているかに関係なく機能します。
この可視性の向上により、管理者と自動化されたコントローラーは故障したハードウェアを迅速に特定し、高性能ワークロードのリカバリを効率化できます。

この取り組みは、SIG Nodeが主導した[KEP #4680](https://kep.k8s.io/4680)の一環として行われました。

### アルファ: Workload Aware Scheduling(WAS)機能 {#alpha-workload-aware-scheduling-was-features}

従来、KubernetesスケジューラーとJobコントローラーはPodを独立したユニットとして管理していたため、複雑な分散ワークロードにおいて断片的なスケジューリングやリソースの浪費が発生することがよくありました。
Kubernetes v1.36では、Workload Aware Scheduling(WAS)機能の包括的なスイートをアルファとして導入し、Jobコントローラーを改訂された[Workload](/docs/concepts/workloads/workload-api/) APIと新しい分離されたPodGroup APIにネイティブに統合することで、関連するPodを単一の論理エンティティとして扱えるようにしています。

Kubernetes v1.35では、Podがノードにバインドされる前にスケジュール可能な最小数のPodを要求することで、すでに[Gangスケジューリング](/docs/concepts/scheduling-eviction/gang-scheduling/)をサポートしていました。
v1.36では、グループ全体をアトミックに評価する新しいPodGroupスケジューリングサイクルを導入し、さらに進化しています。
グループ内のすべてのPodがまとめてバインドされるか、一つもバインドされないかのどちらかです。

この取り組みは、SIG SchedulingとSIG Appsが主導した複数のKEP([#4671](https://kep.k8s.io/4671)、[#5547](https://kep.k8s.io/5547)、[#5832](https://kep.k8s.io/5832)、[#5732](https://kep.k8s.io/5732)、[#5710](https://kep.k8s.io/5710)を含む)の一環として行われました。

## GAに昇格した機能 {#features-graduating-to-stable}

_これはv1.36リリース後にGAとなった改善点の一部です。_

### ボリュームグループスナップショット {#volume-group-snapshots}

数回のベータサイクルを経て、VolumeGroupSnapshotサポートがKubernetes v1.36でGA(General Availability)に到達しました。
この機能により、複数のPersistentVolumeClaimにわたるクラッシュ整合性のあるスナップショットを同時に取得できます。
ボリュームグループスナップショットのサポートは、[グループスナップショット用の拡張API](https://kubernetes-csi.github.io/docs/group-snapshot-restore-feature.html#volume-group-snapshot-apis)のセットに依存しています。
これらのAPIにより、ユーザーは一連のボリュームに対してクラッシュ整合性のあるスナップショットを取得できます。
主な目的は、そのスナップショットのセットを新しいボリュームに復元し、クラッシュ整合性のあるリカバリポイントに基づいてワークロードを復旧できるようにすることです。

この取り組みは、SIG Storageが主導した[KEP #3476](https://kep.k8s.io/3476)の一環として行われました。

### 変更可能なボリュームアタッチ制限 {#mutable-volume-attach-limits}

Kubernetes v1.36では、_変更可能な`CSINode`のAllocatable_ 機能がGAに昇格しました。
この機能強化により、[Container Storage Interface(CSI)](https://kubernetes-csi.github.io/docs/introduction.html)ドライバーがノードで処理可能なボリュームの最大数を動的に更新できるようになります。

この更新により、`kubelet`はノードのボリューム制限と容量情報を動的に更新できるようになりました。
`kubelet`は、定期的なチェックまたはCSIドライバーからのリソース枯渇エラーに応じて、コンポーネントの再起動を必要とせずにこれらの制限を調整します。
これにより、Kubernetesスケジューラーはストレージの可用性に関する正確な情報を維持し、古いボリューム制限によるPodスケジューリングの失敗を防止します。

この取り組みは、SIG Storageが主導した[KEP #4876](https://kep.k8s.io/4876)の一環として行われました。

### ServiceAccountトークンの外部署名API {#api-for-external-signing-of-service-account-tokens}

Kubernetes v1.36では、ServiceAccountの _外部トークン署名_ 機能がGAに昇格し、Kubernetes APIとのクリーンな統合を維持しながらトークン署名を外部システムに委譲できるようになりました。
クラスターは、標準的なServiceAccountトークン形式に従うProjected ServiceAccountトークンの発行に外部JWT署名者を使用でき、必要に応じて延長された有効期限もサポートします。
これは、すでに外部のIDまたは鍵管理システムに依存しているクラスターにとって特に有用で、コントロールプレーン内で鍵管理を重複させることなくKubernetesを統合できます。

kube-apiserverは外部署名者から公開鍵を検出し、キャッシュし、自身が署名していないトークンを検証するように構成されているため、既存の認証・認可フローは期待通りに動作し続けます。
アルファおよびベータフェーズを通じて、外部署名者プラグインのAPIと設定、パス検証、およびOIDCディスカバリは、実際の本番環境のデプロイメントとローテーションパターンに安全に対応できるよう強化されました。

v1.36でのGA昇格により、外部ServiceAccountトークン署名は、IDと署名を一元管理するプラットフォームにとって完全にサポートされたオプションとなり、外部IAMシステムとの統合が簡素化され、コントロールプレーン内で署名鍵を直接管理する必要性が軽減されます。

この取り組みは、SIG Authが主導した[KEP #740](https://kep.k8s.io/740)の一環として行われました。

### GAに昇格したDRA機能 {#dra-features-graduating-to-stable}

Dynamic Resource Allocation(DRA)エコシステムの一部が、Kubernetes v1.36で主要なガバナンスと選択機能のGA昇格により本番環境で利用可能な成熟度に達しました。
_DRA管理者アクセス_ のGA移行により、クラスター管理者がハードウェアリソースにグローバルにアクセスして管理するための永続的でセキュアなフレームワークが提供され、_優先順位付きリスト_ の安定化により、リソース選択ロジックがすべてのクラスター環境で一貫性と予測可能性を保つようになりました。

これにより、組織は長期的なAPIの安定性と後方互換性の保証のもとで、ミッションクリティカルなハードウェア自動化を安心してデプロイできます。
これらの機能により、大規模GPUクラスターやマルチテナントAIプラットフォームに不可欠な高度なリソース共有ポリシーと管理オーバーライドの実装が可能になり、次世代リソース管理のコアアーキテクチャ基盤の完成を示しています。

この取り組みは、SIG AuthとSIG Schedulingが主導したKEP [#5018](https://kep.k8s.io/5018)および[#4816](https://kep.k8s.io/4816)の一環として行われました。

### Mutating Admissionポリシー {#mutating-admission-policies}

Kubernetes v1.36では、[MutatingAdmissionPolicy](/docs/reference/access-authn-authz/mutating-admission-policy/)のGA昇格により、宣言的なクラスター管理がより洗練されたものとなりました。
このマイルストーンは、管理者がCommon Expression Language(CEL)を使用してAPIサーバー内でリソースの変更を直接定義できるようにすることで、従来のWebhookに代わるネイティブで高性能な代替手段を提供し、多くの一般的なユースケースにおいて外部インフラストラクチャの必要性を完全に排除します。

これにより、クラスターオペレーターはカスタムAdmission Webhookの管理に伴うレイテンシや運用の複雑さなしに、受信リクエストを変更できます。
変更ロジックを宣言的でバージョン管理されたポリシーに移行することで、組織はより予測可能なクラスター動作、ネットワークオーバーヘッドの削減、そして長期的なAPIの安定性が完全に保証された堅牢なセキュリティモデルを実現できます。

この取り組みは、SIG API Machineryが主導した[KEP #3962](https://kep.k8s.io/3962)の一環として行われました。

### `validation-gen`によるKubernetesネイティブ型の宣言的バリデーション {#declarative-validation-of-kubernetes-native-types-with-validation-gen}

Kubernetes v1.36では、_宣言的バリデーション_ (`validation-gen`を使用)のGA昇格により、カスタムリソースの開発がさらに効率的なものとなりました。
このマイルストーンは、Common Expression Language(CEL)を使用してGoの構造体タグ内に高度なバリデーションロジックを直接定義できるようにすることで、複雑なOpenAPIスキーマを手動で記述するという手間がかかりエラーが発生しやすい作業を置き換えます。

カスタムバリデーション関数を記述する代わりに、Kubernetesコントリビューターは`+k8s:minimum`や`+k8s:enum`などのIDLマーカーコメントを使用して、APIの型定義(`types.go`)内にバリデーションルールを直接定義できるようになりました。
`validation-gen`ツールはこれらのコメントを解析し、コンパイル時に堅牢なAPIバリデーションコードを自動生成します。
これにより、メンテナンスのオーバーヘッドが削減され、APIバリデーションがソースコードと一貫性を保ち同期された状態を維持できます。

この取り組みは、SIG API Machineryが主導した[KEP #5073](https://kep.k8s.io/5073)の一環として行われました。

### Kubernetes API型からのgogo/protobuf依存関係の削除 {#remove-gogoprotobuf-dependency-for-kubernetes-api-types}

Kubernetes v1.36では、`gogoprotobuf`の削除が完了し、Kubernetesコードベースのセキュリティと長期的な保守性が大きく前進しました。
この取り組みにより、メンテナンスされていない`gogoprotobuf`ライブラリへの重大な依存関係が排除されました。
このライブラリは、潜在的なセキュリティ脆弱性の原因となり、最新のGo言語機能の採用を妨げる要因となっていました。

Kubernetes API型に互換性のリスクをもたらす標準的なProtobuf生成への移行ではなく、プロジェクトは必要な生成ロジックを`k8s.io/code-generator`内にフォークして内部化することを選択しました。
このアプローチにより、既存のAPIの動作とシリアライゼーションの互換性を維持しながら、Kubernetesの依存関係グラフからメンテナンスされていないランタイム依存関係を排除することに成功しました。
Kubernetes APIをGo言語で利用する開発者にとって、この変更は技術的負債を削減し、標準protobufライブラリとの誤った併用を防止します。

この取り組みは、SIG API Machineryが主導した[KEP #5589](https://kep.k8s.io/5589)の一環として行われました。

### ノードログクエリ {#node-log-query}

以前は、Kubernetesではコントロールプレーンやワーカーノードに関連する問題のデバッグのために、クラスター管理者がSSH経由でノードにログインするか、クライアント側のリーダーを実装する必要がありました。
特定の問題では依然として直接のノードアクセスが必要ですが、kube-proxyやkubeletの問題はログを検査することで診断できます。
ノードログは、Podやコンテナのデバッグと同様に、kubelet APIとkubectlプラグインを使用してノードにログインせずにトラブルシューティングを簡素化する方法をクラスター管理者に提供します。
この方法はオペレーティングシステムに依存せず、サービスまたはノードが`/var/log`にログを出力する必要があります。

この機能は、本番ワークロードでの徹底的なパフォーマンス検証を経てKubernetes v1.36でGAに到達し、`NodeLogQuery`フィーチャーゲートを通じてkubeletでデフォルトで有効になっています。
さらに、`enableSystemLogQuery` kubelet設定オプションも有効にする必要があります。

この取り組みは、SIG Windowsが主導した[KEP #2258](https://kep.k8s.io/2258)の一環として行われました。

### Podにおけるユーザー名前空間のサポート {#support-user-namespaces-in-pods}

Kubernetes v1.36では、ユーザー名前空間のサポートがGAに昇格し、コンテナの分離とノードセキュリティが主要な成熟度のマイルストーンに到達しました。
この待望の機能は、コンテナのrootユーザーをホスト上の非特権ユーザーにマッピングすることで多層防御の重要なレイヤーを提供し、プロセスがコンテナから脱出したとしても、基盤となるノードに対する管理権限を持たないことを保証します。

これにより、クラスターオペレーターはコンテナブレイクアウトの脆弱性の影響を軽減するため、本番ワークロードに対してこの堅牢な分離を安心して有効にできます。
コンテナの内部IDをホストのIDから切り離すことで、Kubernetesはマルチテナント環境と機密性の高いインフラストラクチャを不正アクセスから保護するための堅牢で標準化されたメカニズムを提供し、すべて長期的なAPIの安定性が完全に保証されています。

この取り組みは、SIG Nodeが主導した[KEP #127](https://kep.k8s.io/127)の一環として行われました。

### cgroupv2ベースのPSIサポート {#support-psi-based-on-cgroupv2}

Kubernetes v1.36では、Pressure Stall Information(PSI)メトリクスのエクスポートがGAに昇格し、ノードリソース管理と可観測性がより精密になりました。
この機能は、CPU、メモリ、I/Oの「圧力」メトリクスを報告する能力をkubeletに提供し、従来の使用率メトリクスよりもきめ細かなリソース競合のビューを提供します。

クラスターオペレーターとオートスケーラーは、これらのメトリクスを使用して、単に処理が集中しているシステムとリソース枯渇により実際にストールしているシステムを区別できます。
これらのシグナルを活用することで、ユーザーはPodのリソースリクエストをより正確に調整し、垂直オートスケーリングの信頼性を向上させ、アプリケーションのパフォーマンス低下やノードの不安定化につながる前にノイジーネイバー効果を検出できます。

この取り組みは、SIG Nodeが主導した[KEP #4205](https://kep.k8s.io/4205)の一環として行われました。

### VolumeSource: OCIアーティファクトおよびイメージ {#volumesource-oci-artifact-and-or-image}

Kubernetes v1.36では、_OCIボリュームソース_ サポートがGAに昇格し、コンテナデータの配布がより柔軟になりました。
この機能は、外部ストレージプロバイダーやConfigMapからボリュームをマウントするという従来の要件を超え、kubeletがコンテナイメージやアーティファクトリポジトリなどのOCI準拠のレジストリからコンテンツを直接取得してマウントできるようにします。

これにより、開発者やプラットフォームエンジニアはアプリケーションデータ、モデル、静的アセットをOCIアーティファクトとしてパッケージ化し、コンテナイメージに使用しているのと同じレジストリとバージョニングワークフローを使用してPodに配信できます。
このイメージとボリューム管理の統合により、CI/CDパイプラインが簡素化され、読み取り専用コンテンツのための専用ストレージバックエンドへの依存が軽減され、データがどの環境でも移植可能かつセキュアにアクセス可能な状態を維持できます。

この取り組みは、SIG Nodeが主導した[KEP #4639](https://kep.k8s.io/4639)の一環として行われました。

## ベータの新機能 {#new-features-in-beta}

_これはv1.36リリース後にベータとなった改善点の一部です。_

### コントローラーの陳腐化の軽減 {#staleness-mitigation-for-controllers}

Kubernetesコントローラーにおける陳腐化は、多くのコントローラーに影響を及ぼし、コントローラーの動作に微妙な影響を与える可能性がある問題です。
通常、コントローラーの作成者による何らかの前提に起因して陳腐化が問題であることが発見されるのは、本番環境のコントローラーがすでに誤ったアクションを実行してしまった後、手遅れになってからです。
これにより、キャッシュの陳腐化時にコントローラーの調整において、競合する更新やデータの破損が発生する可能性がありました。

Kubernetes v1.36には、コントローラーの陳腐化を軽減し、コントローラーの動作のより良い可観測性を提供する新機能が含まれていることをお知らせします。
これにより、しばしば有害な動作につながる可能性がある、古いクラスター状態のビューに基づく調整が防止されます。

この取り組みは、SIG API Machineryが主導した[KEP #5647](https://kep.k8s.io/5647)の一環として行われました。

### IP/CIDRバリデーションの改善 {#ip-cidr-validation-improvements}

Kubernetes v1.36では、APIのIPおよびCIDRフィールドに対する`StrictIPCIDRValidation`機能がベータに昇格し、以前はすり抜けていた不正なアドレスやプレフィックスを検出するためにバリデーションが強化されました。
これにより、Service、Pod、NetworkPolicy、またはその他のリソースが無効なIPを参照するという微妙な設定バグを防止でき、混乱するランタイム動作やセキュリティ上の問題を回避できます。

コントローラーは、オブジェクトに書き戻すIPを正規化し、すでに保存されている不正な値に遭遇した場合に警告を出すように更新されているため、クラスターは段階的にクリーンで一貫性のあるデータに収束できます。
ベータでは、`StrictIPCIDRValidation`はより広範な使用の準備が整い、ネットワークやポリシーが時間とともに進化する中で、オペレーターにIP関連の設定に対するより信頼性の高いガードレールを提供します。

この取り組みは、SIG Networkが主導した[KEP #4858](https://kep.k8s.io/4858)の一環として行われました。

### kubectlユーザー設定のクラスター設定からの分離 {#separate-kubectl-user-preferences-from-cluster-configs}

`kubectl`のユーザー設定をカスタマイズするための`.kuberc`機能は引き続きベータであり、デフォルトで有効になっています。
`~/.kube/kuberc`ファイルにより、ユーザーはクラスターのエンドポイントと認証情報を保持する`kubeconfig`ファイルとは別に、エイリアス、デフォルトフラグ、その他の個人設定を保存できます。
この分離により、個人の設定がCIパイプラインや共有の`kubeconfig`ファイルに干渉することを防ぎ、異なるクラスターやコンテキスト間で一貫した`kubectl`エクスペリエンスを維持できます。

Kubernetes v1.36では、`.kuberc`に認証情報プラグインのポリシー(許可リストまたは拒否リスト)を定義する機能が追加され、より安全な認証プラクティスが強制されるようになりました。
必要に応じて、環境変数`KUBECTL_KUBERC=false`または`KUBERC=off`を設定することでこの機能を無効にできます。

この取り組みは、SIG CLIが主導し、SIG Authの協力を得た[KEP #3104](https://kep.k8s.io/3104)の一環として行われました。

### Job一時停止時の変更可能なコンテナリソース {#mutable-container-resources-when-job-is-suspended}

Kubernetes v1.36では、`MutablePodResourcesForSuspendedJobs`機能がベータに昇格し、デフォルトで有効になりました。
この更新により、Jobのバリデーションが緩和され、Jobが一時停止中にコンテナのCPU、メモリ、GPU、および拡張リソースのリクエストと制限を更新できるようになりました。

この機能により、キューコントローラーやオペレーターはリアルタイムのクラスター条件に基づいてバッチワークロードの要件を調整できます。
例えば、キューイングシステムは受信したJobを一時停止し、利用可能な容量やクォータに合わせてリソース要件を調整してから、一時停止を解除できます。
この機能は、変更可能性を一時停止中のJob(または一時停止時にPodが終了されたJob)に厳密に制限し、アクティブに実行中のPodへの破壊的な変更を防止します。

この取り組みは、SIG Appsが主導した[KEP #5440](https://kep.k8s.io/5440)の一環として行われました。

### 制約付きなりすまし {#constrained-impersonation}

Kubernetes v1.36では、ユーザーなりすましの`ConstrainedImpersonation`機能がベータに昇格し、歴史的にオール・オア・ナッシングだったメカニズムを、実際に最小権限の原則に沿うものへと強化しています。
この機能が有効な場合、なりすましを行うユーザーは2つの異なる権限セットを持つ必要があります。1つは特定のアイデンティティになりすますための権限、もう1つはそのアイデンティティに代わって特定のアクションを実行するための権限です。
これにより、なりすましのRBACが誤って設定されている場合でも、サポートツール、コントローラー、またはノードエージェントがなりすましを使用して自身に許可されている以上のアクセス権を取得することを防止します。
既存のimpersonateルールは引き続き機能しますが、APIサーバーは新しい制約付きチェックを優先するため、移行は一斉切り替えではなく段階的に行われます。
v1.36のベータでは、`ConstrainedImpersonation`はテスト済みでドキュメント化されており、デバッグ、プロキシ、またはノードレベルのコントローラーにおいてなりすましに依存するプラットフォームチームによるより広範な採用の準備が整っています。

この取り組みは、SIG Authが主導した[KEP #5284](https://kep.k8s.io/5284)の一環として行われました。

### ベータのDRA機能 {#dra-features-in-beta}

[Dynamic Resource Allocation(DRA)](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)フレームワークは、Kubernetes v1.36で複数のコア機能がベータに昇格しデフォルトで有効になることで、さらなる成熟度のマイルストーンに到達しました。
この移行により、[パーティション可能なデバイス](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#partitionable-devices)と[Consumable Capacity](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#consumable-capacity)の昇格によってGPUなどのハードウェアのよりきめ細かな共有が可能になり、DRAは基本的な割り当てを超えて進化しています。
一方、[デバイスのTaintとToleration](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#device-taints-and-tolerations)により、専用リソースが適切なワークロードによってのみ使用されることが保証されます。

これにより、ユーザーは[ResourceClaimデバイスステータス](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#resourceclaim-device-status)とPodスケジューリング前のデバイスアタッチメントの保証を通じて、はるかに信頼性が高く可観測性の高いリソースライフサイクルの恩恵を受けられます。
これらの機能を[拡張リソース](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#extended-resource)サポートと統合することで、Kubernetesはレガシーなデバイスプラグインシステムに代わる堅牢な本番対応の代替手段を提供し、複雑なAIおよびHPCワークロードが前例のない精度と運用安全性でハードウェアを管理できるようにします。

この取り組みは、SIG SchedulingとSIG Nodeが主導した複数のKEP([#5004](https://kep.k8s.io/5004)、[#4817](https://kep.k8s.io/4817)、[#5055](https://kep.k8s.io/5055)、[#5075](https://kep.k8s.io/5075)、[#4815](https://kep.k8s.io/4815)、[#5007](https://kep.k8s.io/issues/5007)を含む)の一環として行われました。

### KubernetesコンポーネントのStatusz {#statusz-for-kubernetes-components}

Kubernetes v1.36では、コアKubernetesコンポーネントの`ComponentStatusz`フィーチャーゲートがベータに昇格し、各コンポーネントのリアルタイムのビルドおよびバージョン詳細を表示する`/statusz`エンドポイント(デフォルトで有効)が提供されます。
このオーバーヘッドの低い[z-page](/docs/reference/instrumentation/zpages/)は、起動時刻、稼働時間、Goバージョン、バイナリバージョン、エミュレーションバージョン、最小互換バージョンなどの情報を公開し、オペレーターや開発者がログや設定を掘り下げることなく、実行中のものを正確に確認できるようにします。

エンドポイントはデフォルトで人間が読めるテキストビューを提供し、さらに明示的なコンテンツネゴシエーションを介してJSON、YAML、またはCBORでのプログラムアクセス用のバージョン管理された構造化API(`config.k8s.io/v1beta1`)も提供します。
アクセスは`system:monitoring`グループに付与され、ヘルスおよびメトリクスエンドポイントの既存の保護と整合し、機密データの露出を防止します。

ベータでは、`ComponentStatusz`はすべてのコアコントロールプレーンコンポーネントおよびノードエージェントでデフォルトで有効になり、ユニットテスト、統合テスト、E2Eテストにより本番環境での可観測性およびデバッグワークフローに安全に使用できます。

この取り組みは、SIG Instrumentationが主導した[KEP #4827](https://kep.k8s.io/4827)の一環として行われました。

### KubernetesコンポーネントのFlagz {#flagz-for-kubernetes-components}

Kubernetes v1.36では、コアKubernetesコンポーネントの`ComponentFlagz`フィーチャーゲートがベータに昇格し、各コンポーネントが起動時に指定された有効なコマンドラインフラグを公開する`/flagz`エンドポイントが標準化されました。
これにより、クラスターオペレーターと開発者はコンポーネントの設定をクラスター内でリアルタイムに確認できるようになり、予期しない動作のデバッグや、フラグのロールアウトが再起動後に実際に反映されたかの確認が、はるかに容易になります。

エンドポイントは人間が読めるテキストビューとバージョン管理された構造化API(当初は`config.k8s.io/v1beta1`)の両方をサポートしているため、インシデント中に`curl`で確認することも、準備ができたら自動化ツールに組み込むこともできます。
アクセスは`system:monitoring`グループに付与され、機密値はマスクできるため、設定の可視化はヘルスおよびステータスエンドポイント周辺の既存のセキュリティプラクティスと整合しています。

ベータでは、`ComponentFlagz`はデフォルトで有効になり、すべてのコアコントロールプレーンコンポーネントおよびノードエージェントに実装され、ユニットテスト、統合テスト、E2Eテストにより本番クラスターでのエンドポイントの信頼性が確保されています。

この取り組みは、SIG Instrumentationが主導した[KEP #4828](https://kep.k8s.io/4828)の一環として行われました。

### Mixed Versionプロキシ (別名: _バージョン間相互運用プロキシ_) {#mixed-version-proxy}

Kubernetes v1.36では、Mixed Versionプロキシ機能がベータに昇格し、v1.28でのアルファ導入を基に、混合バージョンクラスターに対してより安全なコントロールプレーンのアップグレードを提供します。
各APIリクエストは、リクエストされたグループ、バージョン、リソースを提供するapiserverインスタンスにルーティングできるようになり、バージョンの差異による404エラーや障害が軽減されます。

この機能はピア集約ディスカバリに依存しているため、apiserverはどのリソースとバージョンを公開しているかに関する情報を共有し、そのデータを使用して必要に応じてリクエストを透過的に再ルーティングします。
再ルーティングされたトラフィックとプロキシ動作に関する新しいメトリクスにより、オペレーターはリクエストが転送される頻度と転送先のピアを把握できます。
これらの変更により、マルチステップまたは部分的なコントロールプレーンのアップグレードを実行しながら、高可用性の混合バージョンAPIコントロールプレーンを本番環境で実行することがより容易になります。

この取り組みは、SIG API Machineryが主導した[KEP #4020](https://kep.k8s.io/4020)の一環として行われました。

### cgroups v2によるメモリQoS {#memory-qos-with-cgroups-v2}

Kubernetesは、よりスマートで階層化されたメモリ保護により、Linux cgroup v2ノードでのメモリQoSを強化しました。
カーネルのコントロールをPodのリクエストと制限により適切に整合させ、同じノードを共有するワークロード間の干渉とスラッシングを軽減します。
このイテレーションでは、kubeletが`memory.high`と`memory.min`をプログラムする方法も改善され、ライブロックを回避するためのメトリクスとセーフガードが追加され、クラスターオペレーターが環境に合わせてメモリ保護の動作を調整できる設定オプションが導入されました。

この取り組みは、SIG Nodeが主導した[KEP #2570](https://kep.k8s.io/2570)の一環として行われました。

## アルファの新機能 {#new-features-in-alpha}

_これはv1.36リリース後にアルファとなった改善点の一部です。_

### カスタムメトリクスに対するHPAのゼロへのスケール {#hpa-scale-to-zero-for-custom-metrics}

これまでHorizontalPodAutoscaler(HPA)は、実行中のPodからのメトリクス(CPUやメモリなど)に基づいてのみスケーリングの必要性を計算できたため、最低1つのレプリカをアクティブに保つ必要がありました。
Kubernetes v1.36では、ObjectまたはExternalメトリクスを使用する場合に限り、ワークロードをゼロレプリカにスケールダウンできるようにする*HPAのゼロへのスケール*機能(デフォルトで無効)のアルファでの開発を継続しています。

ユーザーは、保留中のタスクがない場合にリソースを大量に消費するワークロードを完全にアイドル状態にすることで、インフラストラクチャのコストの大幅な削減を試せるようになります。
この機能は`HPAScaleToZero`フィーチャーゲートの背後に残っていますが、ゼロの実行中PodでもHPAをアクティブに維持し、外部メトリクス(例: キューの長さ)が新しいタスクの到着を示すとすぐにDeploymentを自動的にスケールアップします。

この取り組みは、SIG Autoscalingが主導した[KEP #2021](https://kep.k8s.io/2021)の一環として行われました。

### アルファのDRA機能 {#dra-features-in-alpha}

従来、Dynamic Resource Allocation(DRA)フレームワークは、高レベルのコントローラーとのシームレスな統合が欠如しており、デバイス固有のメタデータや可用性を把握する手段が限られていました。
Kubernetes v1.36では、ワークロード向けのネイティブResourceClaimサポートや、CPU管理にDRAの柔軟性を提供するDRAネイティブリソースなど、一連のDRA強化機能をアルファとして導入しています。

ユーザーは[Downward API](/docs/concepts/workloads/pods/downward-api/)を活用して、複雑なリソース属性をコンテナに直接公開できるようになりました。
これにより、リソースの可用性をより正確に把握でき、スケジューリングの予測可能性も向上します。
これらのアップデートは、デバイス属性におけるリスト型のサポートと組み合わさり、DRAを低レベルのプリミティブから、現代のAIおよびハイパフォーマンスコンピューティング(HPC)スタックの高度なネットワーキングとコンピューティング要件を処理できる堅牢なシステムへと変革します。

この取り組みは、SIG SchedulingとSIG Nodeが主導した複数のKEP([#5729](https://kep.k8s.io/5729)、[#5304](https://kep.k8s.io/5304)、[#5517](https://kep.k8s.io/5517)、[#5677](https://kep.k8s.io/5677)、[#5491](https://kep.k8s.io/5491)を含む)にわたって行われました。

### Kubernetesメトリクスのネイティブヒストグラムサポート {#native-histogram-support-for-kubernetes-metrics}

Kubernetes v1.36では、アルファとしてネイティブヒストグラムサポートが導入され、高解像度モニタリングが新たなマイルストーンに到達しました。
従来のPrometheusヒストグラムは事前定義された固定的なバケットに依存しており、データの精度とメモリ使用量の間でトレードオフを強いられることがしばしばありました。
今回のアップデートにより、コントロールプレーンはリアルタイムのデータに基づいて解像度を動的に調整するスパースヒストグラムをエクスポートできるようになります。

クラスターオペレーターは、手動のバケット管理のオーバーヘッドなしに、kube-apiserverやその他のコアコンポーネントの正確なレイテンシ分布をキャプチャできるようになりました。
このアーキテクチャの転換により、より信頼性の高いSLIとSLOを実現でき、予測の難しいワークロードのスパイク時でも精度を保つことが可能な高精度なヒートマップが利用可能になります。

この取り組みは、SIG Instrumentationが主導した[KEP #5808](https://kep.k8s.io/5808)の一環として行われました。

### マニフェストベースのAdmission Control設定 {#manifest-based-admission-control-config}

Kubernetes v1.36では、アルファとして*マニフェストベースのAdmission Control*設定が導入され、Admissionコントローラーの管理がより宣言的で一貫性のあるモデルに移行しました。
この変更は、管理者がAdmission Controlの望ましい状態を構造化されたマニフェストを通じて直接定義できるようにすることで、異なるコマンドラインフラグや個別の複雑な設定ファイルを通じてAdmissionプラグインを設定するという長年の課題に対処しています。

クラスターオペレーターは、他のKubernetesオブジェクトに使用されるのと同じバージョン管理された宣言的ワークフローでAdmissionプラグインの設定を管理できるようになり、クラスターアップグレード中の設定のドリフトや手動エラーのリスクが大幅に軽減されます。
これらの設定を統一されたマニフェストに集約することで、kube-apiserverの監査と自動化が容易になり、より安全で再現可能なクラスターデプロイメントへの道が開かれます。

この取り組みは、SIG API Machineryが主導した[KEP #5793](https://kep.k8s.io/5793)の一環として行われました。

### CRIリストストリーミング {#cri-list-streaming}

Kubernetes v1.36では、アルファとして*CRIリストストリーミング*が導入され、新しい内部ストリーミング操作を使用するようになりました。
この改善は、kubeletとコンテナランタイム間の従来のモノリシックな`List`リクエストを、より効率的なサーバーサイドストリーミングRPCに置き換えることで、大規模ノードでよく見られるメモリ圧迫とレイテンシスパイクに対処しています。

すべてのコンテナまたはイメージデータを含む単一の大きなレスポンスを待つ代わりに、kubeletはストリーミングされた結果をインクリメンタルに処理できるようになりました。
この移行により、kubeletのピークメモリフットプリントが大幅に削減され、高密度ノードでの応答性が向上し、ノードあたりのコンテナ数が増え続けても流動的なクラスター管理が確保されます。

この取り組みは、SIG Nodeが主導した[KEP #5825](https://kep.k8s.io/5825)の一環として行われました。

## その他の注目すべき変更点 {#other-notable-changes}

### Ingress NGINXの引退 {#ingress-nginx-retirement}

エコシステムの安全性とセキュリティを優先するため、Kubernetes SIG NetworkとSecurity Response Committeeは2026年3月24日にIngress NGINXを引退させました。
この日以降、新たなリリース、バグ修正、発見されたセキュリティ脆弱性を解決するためのアップデートは行われません。
Ingress NGINXの既存のデプロイメントは引き続き機能し、Helmチャートやコンテナイメージなどのインストールアーティファクトは引き続き利用可能です。

詳細については[公式の引退アナウンス](/blog/2025/11/11/ingress-nginx-retirement/)をご覧ください。

### ボリュームに対するSELinuxラベリングの高速化(GA) {#volume-selinux-labelling}

Kubernetes v1.36では、SELinuxボリュームマウントの改善がGAに昇格しました。
この変更は、再帰的なファイルのラベル再設定を`mount -o context=XYZ`オプションに置き換え、マウント時にボリューム全体に正しいSELinuxラベルを適用します。
これにより、より一貫したパフォーマンスが実現し、SELinuxが有効なシステムでのPod起動時の遅延が軽減されます。

この機能はv1.28で`ReadWriteOncePod`ボリュームに対するベータとして導入されました。
v1.32では、メトリクスと競合を検出するためのオプトアウトオプション(`securityContext.seLinuxChangePolicy: Recursive`)が追加されました。
v1.36では安定版に到達し、すべてのボリュームにデフォルトで適用され、PodまたはCSIDriverが`spec.seLinuxMount`を介してオプトインします。

ただし、この機能は将来のKubernetesリリースで破壊的変更のリスクを生み出す可能性があります。
これは、同じノード上で特権Podと非特権Podの間で1つのボリュームを共有する場合に発生する可能性があります。

開発者はPodに`seLinuxChangePolicy`フィールドとSELinuxボリュームラベルを設定する責任があります。
Deployment、StatefulSet、DaemonSet、またはPodテンプレートを含むカスタムリソースのいずれを作成する場合でも、これらの設定を慎重に行わないと、Podがボリュームを共有する際にPodが正しく起動しないなどの様々な問題が発生する可能性があります。

Kubernetes v1.36はクラスターを監査するのに最適なリリースです。
詳細については[SELinux Volume Label Changes goes GA (and likely implications in v1.37)](/blog/2026/04/22/breaking-changes-in-selinux-volume-labeling/)のブログ記事をご覧ください。

この機能強化の詳細については、[KEP-1710: Speed up recursive SELinux label change](https://kep.k8s.io/1710)をご参照ください。

## v1.36での昇格、非推奨、削除 {#graduations-deprecations-and-removals-in-v1-36}

### GAへの昇格 {#graduations-to-stable}

これは安定版(*一般提供、GA*とも呼ばれる)に昇格したすべての機能を一覧にしたものです。
アルファからベータへの昇格や新機能を含む更新の完全なリストについては、リリースノートをご覧ください。

このリリースには、GAに昇格した合計18の機能強化が含まれています:

- [PodにおけるUser Namespaceのサポート](https://kep.k8s.io/127)
- [ServiceAccountトークンの外部署名API](https://kep.k8s.io/740)
- [再帰的なSELinuxラベル変更の高速化](https://kep.k8s.io/1710)
- [Portworxファイルのin-treeからCSIドライバーへの移行](https://kep.k8s.io/2589)
- [きめ細かなkubelet API認可](https://kep.k8s.io/2862)
- [Mutating Admissionポリシー](https://kep.k8s.io/3962)
- [ノードログクエリ](https://kep.k8s.io/2258)
- [VolumeGroupSnapshot](https://kep.k8s.io/3476)
- [変更可能なCSINodeのAllocatableプロパティ](https://kep.k8s.io/4876)
- [DRA: デバイスリクエストにおける優先順位付き代替](https://kep.k8s.io/4816)
- [cgroupv2ベースのPSIサポート](https://kep.k8s.io/4205)
- [ProcMountオプションの追加](https://kep.k8s.io/4265)
- [DRA: Dynamic Resource AllocationのリソースをPodResourcesに含める拡張](https://kep.k8s.io/3695)
- [VolumeSource: OCIアーティファクトおよびイメージ](https://kep.k8s.io/4639)
- [CPU ManagerにおけるL3キャッシュトポロジー認識の分割](https://kep.k8s.io/5109)
- [DRA: ResourceClaimとResourceClaimTemplateのAdminAccess](https://kep.k8s.io/5018)
- [Kubernetes API型からのgogo protobuf依存関係の削除](https://kep.k8s.io/5589)
- [secretsフィールドを介したServiceAccountトークンのCSIドライバーオプトイン](https://kep.k8s.io/5538)

## 非推奨、削除、コミュニティの更新 {#deprecations-removals-and-community-updates}

Kubernetesの開発と成熟に伴い、プロジェクト全体の健全性を向上させるために、機能が非推奨になったり、削除されたり、より良いものに置き換えられたりすることがあります。
このプロセスの詳細については、Kubernetesの非推奨と削除のポリシーをご覧ください。
Kubernetes v1.36にはいくつかの非推奨が含まれています。

### Serviceの.spec.externalIPsの非推奨化 {#deprecate-service-spec-externalips}

このリリースでは、Service `spec`の`externalIPs`フィールドが非推奨になりました。
これは、機能自体は存在しますが、Kubernetesの**将来の**バージョンでは機能しなくなることを意味します。
このフィールドに依存している場合は、移行を計画する必要があります。
このフィールドは長年にわたりセキュリティ上の既知の問題であり、[CVE-2020-8554](https://github.com/kubernetes/kubernetes/issues/97076)に記載されているように、クラスタートラフィックに対する中間者攻撃を可能にしていました。
Kubernetes v1.36以降、使用時に非推奨の警告が表示され、v1.43での完全な削除が計画されています。

Serviceがまだ`externalIPs`に依存している場合は、クラウドマネージドのIngressにはLoadBalancer Service、シンプルなポート公開にはNodePort、外部トラフィックをより柔軟かつ安全に処理するには[Gateway API](https://gateway-api.sigs.k8s.io/)の使用を検討してください。

このフィールドとその非推奨化の詳細については、[External IPs](/docs/concepts/services-networking/service/#external-ips)または[KEP-5707: Deprecate service.spec.externalIPs](https://kep.k8s.io/5707)をご参照ください。

### `gitRepo`ボリュームドライバーの削除 {#remove-gitrepo-volume-driver}

`gitRepo`ボリュームタイプはv1.11以降非推奨となっていました。
Kubernetes v1.36では、`gitRepo`ボリュームプラグインが恒久的に無効化され、再度有効にすることはできません。
この変更は、`gitRepo`の使用により攻撃者がノード上でrootとしてコードを実行できるという重大なセキュリティの問題からクラスターを保護します。

`gitRepo`は長年にわたり非推奨であり、より良い代替手段が推奨されてきましたが、以前のリリースでは技術的にはまだ使用可能でした。
v1.36以降、その経路は完全に閉鎖されたため、`gitRepo`に依存している既存のワークロードは、Initコンテナや外部の`git-sync`スタイルのツールなどのサポートされているアプローチに移行する必要があります。

この削除の詳細については、[KEP-5040: Remove gitRepo volume driver](https://kep.k8s.io/5040)をご参照ください。

## リリースノート {#release-notes}

Kubernetes v1.36リリースの詳細については、[リリースノート](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.36.md)をご覧ください。

## 入手方法 {#availability}

Kubernetes v1.36は[GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.36.0)または[Kubernetes公式サイトのダウンロードページ](/releases/download/)からダウンロードできます。

Kubernetesを始めるには、[インタラクティブチュートリアル](/docs/tutorials/)をチェックするか、[minikube](https://minikube.sigs.k8s.io/)を使用してローカルKubernetesクラスターを実行してください。
また、[kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/)を使用して簡単にv1.36をインストールすることもできます。

## リリースチーム {#release-team}

Kubernetesは、コミュニティの支援、コミットメント、献身的な努力なくしては成り立ちません。
各リリースチームは、皆さんが利用するKubernetesリリースを構成する様々な要素を協力して構築する、献身的なコミュニティボランティアで構成されています。
これを実現するには、コードそのものからドキュメント作成、プロジェクト管理に至るまで、コミュニティのあらゆる分野の専門スキルが必要です。

Kubernetes v1.36リリースをコミュニティに届けるために多くの時間を費やして取り組んでくれた[リリースチーム](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.36/release-team.md)全体に感謝します。
リリースチームには、初参加のShadow(見習い)から、複数のリリースサイクルで経験を積んだベテランのチームリードまで、様々なメンバーが参加しています。
リリースリードのRyota Sawadaに心より感謝します。
彼の実践的な課題解決のアプローチと、コミュニティを前進させる活力と情熱で、成功したリリースサイクルを導いてくれました。

## プロジェクトの活動状況 {#project-velocity}

CNCF K8sの[DevStats](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&var-period=m&var-repogroup_name=All)プロジェクトは、Kubernetesおよび様々なサブプロジェクトの活動状況に関する興味深いデータポイントを集計しています。
これには個人の貢献から貢献企業数まで含まれ、このエコシステムの発展に費やされる努力の深さと広さを示しています。

v1.36リリースサイクル(2026年1月12日から2026年4月22日までの15週間)において、Kubernetesには最大106の異なる企業と491人の個人から貢献がありました。
より広範なクラウドネイティブエコシステムでは、この数字は370社、合計2235人のコントリビューターに達しています。

なお、「貢献」とはコミットの作成、コードレビュー、コメント、IssueやPRの作成、PRのレビュー(ブログやドキュメントを含む)、またはIssueやPRへのコメントを行うことを指します。
貢献に興味がある場合は、コントリビューター向けWebサイトの[はじめに](https://www.kubernetes.dev/docs/guide/#getting-started)をご覧ください。

データソース:

- [Companies contributing to Kubernetes](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&from=1747609200000&to=1756335599000&var-period=d28&var-repogroup_name=Kubernetes&var-repo_name=kubernetes%2Fkubernetes)
- [Overall ecosystem contributions](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&from=1747609200000&to=1756335599000&var-period=d28&var-repogroup_name=All&var-repo_name=kubernetes%2Fkubernetes)

## イベント情報 {#events-update}

今後開催予定のKubernetesおよびクラウドネイティブイベント(KubeCon + CloudNativeCon、KCDなど)や、世界各地で開催される主要なカンファレンスについて紹介します。
Kubernetesコミュニティの最新情報を入手し、参加しましょう！

**2026年4月**

- KCD - [Kubernetes Community Days: Guadalajara](https://community.cncf.io/events/details/cncf-kcd-guadalajara-presents-kcd-guadalajara-2026/cohost-kcd-guadalajara/): 2026年4月18日 | メキシコ、グアダラハラ

**2026年5月**

- KCD - [Kubernetes Community Days: Toronto](https://community.cncf.io/events/details/cncf-kcd-toronto-presents-kcd-toronto-2026/): 2026年5月13日 | カナダ、トロント
- KCD - [Kubernetes Community Days: Texas](https://community.cncf.io/events/details/cncf-kcd-texas-presents-kcd-texas-2026/cohost-kcd-texas/): 2026年5月15日 | アメリカ、オースティン
- KCD - [Kubernetes Community Days: Istanbul](https://community.cncf.io/events/details/cncf-kcd-istanbul-presents-kcd-istanbul-2026/): 2026年5月15日 | トルコ、イスタンブール
- KCD - [Kubernetes Community Days: Helsinki](https://community.cncf.io/events/details/cncf-kcd-helsinki-presents-kubernetes-community-days-helsinki-2026/): 2026年5月20日 | フィンランド、ヘルシンキ
- KCD - [Kubernetes Community Days: Czech & Slovak](https://community.cncf.io/events/details/cncf-kcd-czech-slovak-presents-kcd-czech-amp-slovak-prague-2026/): 2026年5月21日 | チェコ、プラハ

**2026年6月**

- KCD - [Kubernetes Community Days: New York](https://community.cncf.io/events/details/cncf-kcd-new-york-presents-kcd-new-york-2026/): 2026年6月10日 | アメリカ、ニューヨーク
- [KubeCon + CloudNativeCon India 2026: 2026年6月18日-19日](https://events.linuxfoundation.org/kubecon-cloudnativecon-india/) | インド、ムンバイ

**2026年7月**

- [KubeCon + CloudNativeCon Japan 2026: 2026年7月29日-30日](https://events.linuxfoundation.org/kubecon-cloudnativecon-japan/) | 日本、横浜

**2026年9月**

- [KubeCon + CloudNativeCon China 2026: 2026年9月8日-9日](https://www.lfopensource.cn/kubecon-cloudnativecon-openinfra-summit-pytorch-conference-china/) | 中国、上海

**2026年10月**

- KCD - [Kubernetes Community Days: UK: 2026年10月19日](https://community.cncf.io/events/details/cncf-kcd-uk-presents-kubernetes-community-days-uk-edinburgh-2026/) | イギリス、エディンバラ

**2026年11月**

- KCD - [Kubernetes Community Days: Porto](https://community.cncf.io/events/details/cncf-kcd-porto-presents-kcd-porto-2026-collab-with-devops-days-portugal/): 2026年11月19日 | ポルトガル、ポルト
- [KubeCon + CloudNativeCon North America 2026](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/): 2026年11月9日-12日 | アメリカ、ソルトレイクシティ

最新のイベント情報は[こちら](https://community.cncf.io/events/#/list)でご確認いただけます。

## ウェビナーのご案内 {#upcoming-release-webinar}

Kubernetes v1.36リリースチームのメンバーと一緒に **2026年5月20日(水)午後4時(UTC)** から、このリリースのハイライトについて学びましょう。
詳細および参加登録は、CNCFオンラインプログラム・サイトの[イベントページ](https://community.cncf.io/events/details/cncf-cncf-online-programs-presents-cloud-native-live-kubernetes-v136-release/)をご覧ください。

## 参加方法 {#get-involved}

Kubernetesに関わる最も簡単な方法は、あなたの興味に合った[Special Interest Groups](https://github.com/kubernetes/community/blob/master/sig-list.md)(SIGs)のいずれかに参加することです。
Kubernetesコミュニティに向けて何か発信したいことはありますか？
毎週の[コミュニティミーティング](https://github.com/kubernetes/community/tree/master/communication)や、以下のチャンネルであなたの声を共有してください。
継続的なフィードバックとサポートに感謝いたします。

- 最新情報はBlueskyの[@kubernetes.io](https://bsky.app/profile/kubernetes.io)をフォローしてください
- [Discuss](https://discuss.kubernetes.io/)でコミュニティディスカッションに参加してください
- [Slack](https://slack.k8s.io/)でコミュニティに参加してください
- [Stack Overflow](https://stackoverflow.com/questions/tagged/kubernetes)で質問したり、回答したりしてください
- あなたのKubernetesに関する[ストーリー](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)を共有してください
- Kubernetesの最新情報は[ブログ](https://kubernetes.io/blog/)でさらに詳しく読むことができます
- リリースチームについての詳細は[Kubernetes Release Team](https://github.com/kubernetes/sig-release/tree/master/release-team)をご覧ください
