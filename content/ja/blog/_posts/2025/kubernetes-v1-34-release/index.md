---
layout: blog
title: "Kubernetes v1.34: Of Wind & Will (O' WaW)"
date: 2025-08-27T10:30:00-08:00
slug: kubernetes-v1-34-release
author: >
  [Kubernetes v1.34 Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.34/release-team.md)
translator: >
  [Taisuke Okamoto](https://github.com/b1gb4by) ([PLAID, Inc.](https://plaid.co.jp/)),
  [Kaito Ii](https://github.com/kaitoii11) ([Hewlett Packard Enterprise Co.](https://www.hpe.com/)),
  [Toshiaki Inukai](https://github.com/t-inu),
  [Junya Okabe](https://github.com/Okabe-Junya) (筑波大学)
---

**編集者:** Agustina Barbetta, Alejandro Josue Leon Bellido, Graziano Casto, Melony Qin, Dipesh Rawat

前回のリリースと同様に、Kubernetes v1.34のリリースでは新しいGA、ベータ版、アルファ版の機能が導入されます。
高品質なリリースの継続的な提供は、私たちの開発サイクルの強さとコミュニティからの活発なサポートを示しています。

このリリースは58個の機能改善で構成されています。
それらのうち、GAへの昇格が23個、ベータへの移行が22個、アルファとしての導入が13個となっています。

また、このリリースにはいくつかの[非推奨化と削除](#deprecations-and-removals)があります。
これらに必ず目を通してください。

## リリースのテーマとロゴ

{{< figure src="k8s-v1.34.png" alt="Kubernetes v1.34 logo: Three bears sail a wooden ship with a flag featuring a paw and a helm symbol on the sail, as wind blows across the ocean" class="release-logo" >}}

私たちを取り巻く風、そして私たちの内なる意志によって動かされるリリース。

訳注: このリリースでは、Kubernetesの開発を航海になぞらえています。

すべてのリリースサイクルで、私たちは実際にはコントロールできない「風」を受け継ぎます — ツールの状態、ドキュメント、そしてプロジェクトの歴史的な特性です。
時にこれらの風は私たちの帆を満たし、時に横に押し流し、時に凪いでしまいます。

Kubernetesを前進させ続けているのは完璧な風ではなく、船員たちの意志です。
彼らは帆を調整し、舵を取り、航路を定め、船を安定させます。
リリースが実現するのは条件が常に理想的だからではありません。
それを構築する人々、リリースする人々、そしてクマ<sup>^</sup>、猫、犬、魔法使い、好奇心に満ちた人々がいるからこそ実現するのです。
風がどの方向に吹いても、彼らはKubernetesを力強く前進させ続けています。

このリリース **Of Wind & Will (O' WaW)** は、私たちを形作ってきた風と、私たちを前進させる意志に敬意を表しています。

<sub>^ なぜクマなのか？ その答えはご想像にお任せします！</sub>

## 主なアップデート情報

Kubernetes v1.34は新機能と改善点が満載です。
このセクションでは、リリースチームが特に注目して欲しい、選りすぐりのアップデート内容をご紹介します！

### GA: DRAのコア機能

[Dynamic Resource Allocation](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/) (DRA)は、GPU、TPU、NICおよびその他のデバイスを選択、割り当て、共有、設定するためのより強力な方法を提供します。

v1.30リリース以降、DRAは構造化パラメーターを使ってデバイスを要求する仕組みを採用しています。
これらのパラメーターはKubernetesのコアからは直接見えない形で処理されます。
この設計は、ストレージボリュームの動的プロビジョニングから着想を得ています。
構造化パラメーターを使用するDRAは、`resource.k8s.io`配下の以下のAPIに依存しています。ResourceClaim、DeviceClass、ResourceClaimTemplate、ResourceSlice。
また、Podの`.spec`に新しい`resourceClaims`フィールドを追加しています。  
`resource.k8s.io/v1` APIはGAに昇格し、現在はデフォルトで利用可能です。

この作業はWG Device Managementが主導した[KEP \#4381](https://kep.k8s.io/4381)の一環として行われました。

### ベータ: `kubelet`イメージ認証プロバイダー向けのProjected ServiceAccountトークン

プライベートコンテナイメージを取得する際に使用される`kubelet`の認証プロバイダーは、従来、ノードやクラスターに保存された長期間有効なSecretに依存していました。
この方法では、認証情報が特定のワークロードに紐付けられず、自動更新もされないため、セキュリティリスクと管理の手間が増大していました。  
この問題を解決するため、`kubelet`がコンテナレジストリへの認証に、短期間のみ有効で特定の用途に限定されたServiceAccountトークンを要求できるようになりました。
これにより、ノード全体の認証情報ではなく、Pod固有のアイデンティティに基づいてイメージの取得を認可できます。  
最大の利点はセキュリティの大幅な向上です。
イメージ取得のために長期間有効なSecretを保持する必要がなくなり、攻撃を受けるリスクが減少し、管理者と開発者の両方にとって認証情報の管理がシンプルになります。

この作業はSIG AuthとSIG Nodeが主導した[KEP \#4412](https://kep.k8s.io/4412)の一環として行われました。

### アルファ: KYAML(Kubernetes向けに最適化されたYAML形式)のサポート

KYAMLは、Kubernetes向けに最適化された、より安全で曖昧さの少ないYAMLのサブセットです。
Kubernetes v1.34以降、どのバージョンのKubernetesを使用していても、kubectlの新しい出力形式としてKYAMLを利用できます。
  
KYAMLは、YAMLとJSONそれぞれが抱える課題を解決します。
YAMLでは空白文字が重要な意味を持つため、インデントやネストに細心の注意が必要です。
また、文字列の引用符を省略できることで、予期しない型変換が発生することがあります(例: [「ノルウェー問題」](https://hitchdev.com/strictyaml/why/implicit-typing-removed/))。
一方、JSONはコメントが書けず、末尾のカンマや引用符付きのキーに関して厳密なルールがあります。
  
KYAMLファイルはすべて有効なYAMLでもあるため、KYAMLで記述したファイルはどのバージョンの`kubectl`にも入力として渡せます。
v1.34の`kubectl`では、環境変数`KUBECTL_KYAML=true`を設定することで、[KYAML形式での出力](/docs/reference/kubectl/#syntax-1)もリクエストできます(例: `kubectl get -o kyaml ...`)。
もちろん、従来通りJSONやYAML形式での出力も可能です。

この作業はSIG CLIが主導した[KEP \#5295](https://kep.k8s.io/5295)の一環として行われました。

## GAに昇格した機能

*これはv1.34リリース後にGAとなった改善点の一部です。*

### Jobの代替Podの遅延作成

デフォルトでは、JobコントローラーはPodが終了処理を始めた時点で、すぐに代替となる新しいPodを作成します。
その結果、終了中の古いPodとまだ新しいPodが同時に存在し、両方がリソースを使用する状態になります。
リソースが限られたクラスターでは、古いPodが完全に終了してリソースを解放するまで、新しいPodが起動できずに待機状態となり、リソースの競合が発生します。
また、この状況により、クラスターオートスケーラーが不必要にノードを追加してしまうこともあります。
さらに、TensorFlowや[JAX](https://jax.readthedocs.io/en/latest/)などの機械学習フレームワークは、同じインデックスのPodが複数同時に動作することを許可しないため、この同時実行が問題となります。
この機能により、Jobに`.spec.podReplacementPolicy`が導入されます。
Podが完全に終了した後(`.status.phase: Failed`となった後)にのみ代替Podを作成するよう設定できます。
これを行うには、`.spec.podReplacementPolicy: Failed`を設定します。  
v1.28でアルファとして導入されたこの機能は、v1.34でGAに昇格しました。

この作業はSIG Appsが主導した[KEP \#3939](https://kep.k8s.io/3939)の一環として行われました。

### ボリューム拡張失敗からの復旧

この機能により、ストレージプロバイダーがサポートしていないサイズへのボリューム拡張が失敗した場合に、その拡張操作をキャンセルし、サポート範囲内のより小さなサイズで再度拡張を試みることができます。  
v1.23でアルファとして導入されたこの機能は、v1.34でGAに昇格しました。

この作業はSIG Storageが主導した[KEP \#1790](https://kep.k8s.io/1790)の一環として行われました。

### ボリューム変更のためのVolumeAttributesClass

[VolumeAttributesClass](/docs/concepts/storage/volume-attributes-classes/)がv1.34でGAに昇格しました。
VolumeAttributesClassは、プロビジョニングされたIOなどのボリュームパラメーターを変更するための、汎用的なKubernetesネイティブなAPIです。
プロバイダーがサポートしている場合、ワークロードがコストとパフォーマンスのバランスを取りながら、稼働中にボリュームを垂直スケーリングできるようになります。  
Kubernetesの他のすべての新しいボリューム機能と同様に、このAPIは[Container Storage Interface (CSI)](https://kubernetes-csi.github.io/docs/)を介して実装されています。
この機能を使用するには、お使いのプロビジョナー固有のCSIドライバーが、この機能のCSI側の実装である新しいModifyVolume APIをサポートしている必要があります。

この作業はSIG Storageが主導した[KEP \#3751](https://kep.k8s.io/3751)の一環として行われました。

### 構造化された認証設定

Kubernetes v1.29では、APIサーバーのクライアント認証を管理する新しい方法が導入されました。
これまで多数のコマンドラインオプションで設定していた認証を、構造化された設定ファイルで管理できるようになりました。
[AuthenticationConfiguration](/docs/reference/access-authn-authz/authentication/#using-authentication-configuration)という新しいリソースにより、管理者は複数のJWT認証機構の設定、CEL式を使った柔軟な検証ルールの定義、そしてサーバーを再起動することなく設定を動的に再読み込みすることが可能になります。
この変更により、クラスターの認証設定がより管理しやすく、監査しやすくなりました。
この機能はv1.34でGAに昇格しています。

この作業はSIG Authが主導した[KEP \#3331](https://kep.k8s.io/3331)の一環として行われました。

### セレクターに基づく細かい認可

Kubernetesの認可機構(Webhook認可や組み込みのノード認可を含む)が、リクエストに含まれるフィールドセレクターやラベルセレクターの内容まで考慮して、より細かい認可判断を行えるようになりました。
**list**、**watch**、**deletecollection** といった一覧取得や削除のリクエストにセレクターが含まれている場合、認可レイヤーはその条件も含めてアクセス権限を評価します。

例えば、「特定のノード(`.spec.nodeName`)に割り当てられたPodのみを一覧表示できる」という認可ポリシーを作成できます。
この場合、クライアント(例: 特定ノード上のkubelet)は必要なフィールドセレクターを明示的に指定する必要があり、指定がない場合はリクエストが拒否されます。
この機能により、クライアントが制限事項を理解し適切にリクエストを送信できる環境であれば、最小権限の原則に基づいた厳密なアクセス制御が実現できます。
Kubernetes v1.34では、ノードごとのリソース分離やカスタムマルチテナント構成など、きめ細かい制御が必要な環境での運用がより安全になりました。

この作業はSIG Authが主導した[KEP \#4601](https://kep.k8s.io/4601)の一環として行われました。

### 細かい制御による匿名リクエストの制限

匿名アクセスを完全に有効または無効にする代わりに、認証されていないリクエストを許可する特定のエンドポイントのリストを厳密に設定できるようになりました。
これにより、`/healthz`、`/readyz`、`/livez`などのヘルスチェックやブートストラップ用エンドポイントへの匿名アクセスに依存するクラスターに対して、より安全な代替手段を提供します。

この機能により、匿名ユーザーに広範なアクセス権を誤って付与してしまうRBACの設定ミスを防ぐことができ、外部のプローブツールやブートストラップツールへの変更も不要です。

この作業はSIG Authが主導した[KEP \#4633](https://kep.k8s.io/4633)の一環として行われました。

### プラグイン固有のコールバックによる効率的な再キューイング

`kube-scheduler`が、以前スケジュールできなかったPodをいつ再試行すべきかについて、より正確な判断を下せるようになりました。
各スケジューリングプラグインが独自のコールバック関数を登録できるようになり、クラスターで発生したイベントが、以前拒否されたPodをスケジュール可能にする可能性があるかどうかをスケジューラーに通知します。

これにより、不要な再試行が削減され、スケジューリング全体のスループットが向上します。
特に動的リソース割り当て(DRA)を使用するクラスターで効果的です。
また、特定のプラグインが安全と判断した場合には、通常のバックオフ遅延をスキップできるようになり、特定のケースでスケジューリングがより高速化されます。

この作業はSIG Schedulingが主導した[KEP \#4247](https://kep.k8s.io/4247)の一環として行われました。

### 順序付けられたNamespace削除

ランダムに近いリソース削除順序は、セキュリティギャップや意図しない動作を引き起こす可能性があります。
例えば、NetworkPolicyが削除された後もPodが残り続けるといった問題です。  
この改善により、Kubernetes[名前空間](/docs/concepts/overview/working-with-objects/namespaces/)に対して、より構造化された削除プロセスが導入され、安全で決定的なリソース削除が保証されます。
論理的な依存関係やセキュリティの依存関係を尊重する削除順序を強制することで、Podが他のリソースよりも先に削除されることが保証されます。  
この機能はKubernetes v1.33で導入され、v1.34でGAに昇格しました。
この昇格により、[CVE-2024-7598](https://github.com/advisories/GHSA-r56h-j38w-hrqq)で説明されている脆弱性を含む、非決定的な削除によるリスクを軽減し、セキュリティと信頼性が向上します。

この作業はSIG API Machineryが主導した[KEP \#5080](https://kep.k8s.io/5080)の一環として行われました。

### **list** 応答のストリーミング

Kubernetesで大規模な**list**応答を処理することは、これまで大きなスケーラビリティの課題でした。
クライアントが数千のPodやカスタムリソースなどの大規模なリソースリストを要求した場合、APIサーバーは送信前にオブジェクトのコレクション全体を単一の大きなメモリバッファにシリアライズする必要がありました。
このプロセスは大量のメモリ負荷を生み出し、パフォーマンスの低下を引き起こし、クラスター全体の安定性に影響を与える可能性がありました。  
この制限に対処するため、コレクション( **list** 応答)のストリーミングエンコーディングメカニズムが導入されました。
JSONおよびKubernetes Protobuf応答形式では、このストリーミングメカニズムが自動的に有効になり、関連するフィーチャーゲートはGAとなっています。
この方法の主な利点は、APIサーバーでの大規模なメモリ割り当てを回避し、メモリフットプリントをより小さく予測可能にすることです。
その結果、特に大規模なリソースリストの頻繁なリクエストが一般的な大規模環境において、クラスターの回復力とパフォーマンスが向上します。

この作業はSIG API Machineryが主導した[KEP \#5116](https://kep.k8s.io/5116)の一環として行われました。

### 回復力のあるWatchキャッシュの初期化

Watchキャッシュは、etcdに保存されているクラスター状態の結果整合性を保つキャッシュレイヤーで、`kube-apiserver`内部で動作します。
これまで、`kube-apiserver`の起動時にWatchキャッシュがまだ初期化されていない場合や、Watchキャッシュの再初期化が必要な場合に問題が発生することがありました。

これらの問題に対処するため、Watchキャッシュの初期化プロセスが障害に対してより回復力のあるものに改善され、コントロールプレーンの堅牢性が向上し、コントローラーやクライアントが確実にWatchを確立できるようになりました。この改善はv1.31でベータとして導入され、現在はGAとなっています。

この作業はSIG API MachineryとSIG Scalabilityが主導した[KEP \#4568](https://kep.k8s.io/4568)の一環として行われました。

### DNS検索パス検証の緩和

これまで、PodのDNS `search`パスに対する厳格な検証は、複雑なネットワーク環境やレガシーネットワーク環境での統合において問題が発生することがよくありました。
この制限により、組織のインフラストラクチャに必要な設定がブロックされ、管理者は困難な回避策の実装を強いられていました。  
この問題に対処するため、緩和されたDNS検証がv1.32でアルファとして導入され、v1.34でGAに昇格しました。
一般的なユースケースとして、Podが内部のKubernetesサービスと外部ドメインの両方と通信する必要がある場合があります。
Podの`.spec.dnsConfig`の`searches`リストの最初のエントリに単一のドット(`.`)を設定することで、システムのリゾルバーがクラスターの内部検索ドメインを外部クエリに追加することを防げます。
これにより、外部ホスト名に対する不要な内部DNSサーバーへのDNSリクエストの生成を回避し、効率を向上させ、潜在的な名前解決エラーを防ぎます。

この作業はSIG Networkが主導した[KEP \#4427](https://kep.k8s.io/4427)の一環として行われました。

### Windows `kube-proxy`におけるDirect Service Return(DSR)のサポート

DSRは、ロードバランサーを経由したリターントラフィックがロードバランサーをバイパスしてクライアントに直接応答できるようにすることで、パフォーマンスを最適化します。
これにより、ロードバランサーの負荷が軽減され、全体的なレイテンシーが改善されます。
Windows上のDSRの詳細については、[Direct Server Return (DSR) in a nutshell](https://techcommunity.microsoft.com/blog/networkingblog/direct-server-return-dsr-in-a-nutshell/693710)をご覧ください。  
v1.14で最初に導入されたこの機能は、v1.34でGAに昇格しました。

この作業はSIG Windowsが主導した[KEP \#5100](https://kep.k8s.io/5100)の一環として行われました。

### コンテナライフサイクルフックのSleepアクション

コンテナのPreStopおよびPostStartライフサイクルフックにSleepアクションが導入され、安全な終了の管理とコンテナライフサイクル管理全体を改善する簡単な方法が提供されました。  
Sleepアクションにより、コンテナは起動後または終了前に指定された時間だけ一時停止できます。
負の値またはゼロのスリープ時間を使用すると、すぐに戻り、結果的に何も実行しない(no-op)動作となります。  
Sleepアクションは、Kubernetes v1.29で導入され、v1.32でゼロ値のサポートが追加されました。
両方の機能がv1.34でGAに昇格しました。

この作業はSIG Nodeが主導した[KEP \#3960](https://kep.k8s.io/3960)および[KEP #4818](https://kep.k8s.io/4818)の一環として行われました。

### Linuxノードでのスワップ機能のサポート

これまで、Kubernetesでスワップ機能サポートがなかったため、メモリ不足に陥ったノードではプロセスを突然終了させざるを得ず、ワークロードが不安定になることがよくありました。
この問題は特に、大容量だがアクセス頻度の低いメモリフットプリントを持つアプリケーションに影響し、より柔軟なリソース管理を妨げていました。

この問題に対処するため、ノードごとに設定可能なスワップ機能のサポートがv1.22で導入されました。
アルファ版とベータ版の段階を経て、v1.34でGAに昇格しました。
主要なモードである`LimitedSwap`では、Podが既存のメモリ制限内でスワップを使用でき、問題に対する直接的な解決策を提供します。
デフォルトでは、`kubelet`は`NoSwap`モードで設定されており、Kubernetesワークロードはスワップを使用できません。

この機能により、ワークロードの安定性が向上し、リソース使用率がより効率的になります。
リソースに制約のある環境で、より多様なアプリケーションをサポートできるようになりますが、管理者はスワップ使用による潜在的なパフォーマンスへの影響を考慮する必要があります。

この作業はSIG Nodeが主導した[KEP \#2400](https://kep.k8s.io/2400)の一環として行われました。

### 環境変数での特殊文字の許可

Kubernetesの環境変数検証ルールが緩和され、`=`を除くほぼすべての印字可能なASCII文字を変数名で使用できるようになりました。
この変更により、非標準的な文字を変数名に必要とするワークロードのシナリオをサポートします。
例えば、.NET Coreのようなフレームワークでは、ネストされた設定キーを表すために`:`を使用します。

緩和された検証は、Pod仕様で直接定義された環境変数だけでなく、ConfigMapやSecretへの`envFrom`参照を使用して注入された環境変数にも適用されます。

この作業はSIG Nodeが主導した[KEP \#4369](https://kep.k8s.io/4369)の一環として行われました。

### Taint管理のNodeライフサイクルからの分離

これまで、`TaintManager`がノードの状態(NotReady、Unreachableなど)に基づいてNoScheduleやNoExecute taintを適用するロジックは、ノードのライフサイクルコントローラーと密接に結合していました。
この密結合により、コードの保守性とテストが困難になり、taintベースの退避メカニズムの柔軟性も制限されていました。
このKEPでは、`TaintManager`をKubernetesコントローラーマネージャー内の独立したコントローラーとしてリファクタリングします。
これはコードのモジュール性と保守性を向上させるための内部的なアーキテクチャの改善です。
この変更により、taintベースの退避ロジックを独立してテストし、発展させることができるようになりますが、taintの使用方法に対するユーザー向けの直接的な影響はありません。

この作業はSIG SchedulingとSIG Nodeが主導した[KEP \#3902](https://kep.k8s.io/3902)の一環として行われました。

## ベータの新機能

_これはv1.34のリリース後にベータとなった改善点の一部です。_

### Podレベルのリソース要求と制限

複数のコンテナを持つPodのリソース要求を定義することは、これまで困難でした。
要求と制限はコンテナごとにしか設定できなかったため、開発者は各コンテナに過剰なリソースを割り当てるか、必要なリソース総量を細かく分割する必要がありました。
これにより設定が複雑になり、非効率的なリソース割り当てにつながることがよくありました。
この問題を簡素化するため、Podレベルでリソース要求と制限を指定できる機能が導入されました。
これにより、開発者はPod全体のリソース予算を定義し、それを構成するコンテナ間で共有できます。
この機能はv1.32でアルファとして導入され、v1.34でベータに昇格し、HPAもPodレベルのリソース指定をサポートするようになりました。
主な利点は、マルチコンテナPodのリソース管理がより直感的で簡単になることです。
すべてのコンテナが使用するリソースの合計がPodの定義された制限を超えないことが保証されます。
これにより、リソース計画の改善、より正確なスケジューリング、そしてクラスターリソースの効率的な利用が実現されます。

この作業はSIG SchedulingとSIG Autoscalingが主導した[KEP \#2837](https://kep.k8s.io/2837)の一環として行われました。

### `kubectl`向けユーザー設定のための`.kuberc`ファイル

`.kuberc`設定ファイルにより、デフォルトオプションやコマンドエイリアスなど、`kubectl`の設定を定義できます。
kubeconfigファイルとは異なり、`.kuberc`設定ファイルにはクラスターの詳細、ユーザー名、パスワードは含まれません。  
この機能はアルファとしてv1.33で導入され、環境変数`KUBECTL_KUBERC`で有効にすることで利用できます。
v1.34でベータに昇格し、デフォルトで有効になっています。

この作業はSIG CLIが主導した[KEP \#3104](https://kep.k8s.io/3104)の一環として行われました。

### 外部ServiceAccountのトークン署名

これまで、KubernetesはServiceAccountトークンを、`kube-apiserver`の起動時にディスクから読み込まれる静的な署名鍵を使用して管理していました。
この機能では、プロセス外署名のための`ExternalJWTSigner` gRPCサービスが導入されます。
これにより、Kubernetesディストリビューションは、静的なディスクベースの鍵の代わりに外部鍵管理ソリューション(HSM、クラウドKMSなど)を使用してServiceAccountトークンの署名を行えるようになります。

v1.32でアルファとして導入されたこの外部JWTの署名機能は、v1.34でベータに進み、デフォルトで有効になっています。

この作業はSIG Authが主導した[KEP \#740](https://kep.k8s.io/740)の一環として行われました。

### ベータ版のDRA機能

#### セキュアなリソースモニタリングのための管理者アクセス

DRAは、ResourceClaimまたはResourceClaimTemplateの`adminAccess`フィールドを通じて、制御された管理者アクセスをサポートします。
これにより、クラスター運用者は他のユーザーが使用中のデバイスにモニタリングや診断のためにアクセスできます。
この特権モードは、`resource.k8s.io/admin-access: "true"`でラベル付けされた名前空間でそのようなオブジェクトを作成する権限を持つユーザーに限定されます。
これにより、通常のワークロードは影響を受けません。
v1.34でベータに昇格したこの機能は、名前空間ベースの認可チェックを通じてワークロードの分離を保ちながら、セキュアな内部監視機能を提供します。

この作業はWG Device ManagementとSIG Authが主導した[KEP \#5018](https://kep.k8s.io/5018)の一環として行われました。

#### ResourceClaimとResourceClaimTemplateにおける優先順位付きの代替案

ワークロードは単一の高性能GPUで最適に動作するかもしれませんが、2つの中級GPUでも動作可能な場合があります。  
フィーチャーゲートの`DRAPrioritizedList`(現在はデフォルトで有効)により、ResourceClaimとResourceClaimTemplateに新しい`firstAvailable`フィールドが追加されます。
このフィールドは順序付きリストで、リクエストが様々な方法で満たされる可能性があることを指定できます。
特定のハードウェアが利用できない場合は何も割り当てないという選択も含まれます。
スケジューラーはリスト内の代替案を順番に満たそうとするため、ワークロードにはクラスターで利用可能な最適なデバイスセットが割り当てられます。

この作業はWG Device Managementが主導した[KEP \#4816](https://kep.k8s.io/4816)の一環として行われました。

#### `kubelet`による割り当て済みDRAリソースの報告

`kubelet`のAPIが更新され、DRAを通じて割り当てられたPodリソースを報告できるようになりました。
これにより、ノードのモニタリングエージェントは、各ノードでPodに割り当てられているDRAリソースを検出できます。
さらに、ノードコンポーネントはPodResourcesAPIを使用してこのDRA情報を活用し、新しい機能や統合を開発できるようになります。  
Kubernetes v1.34以降、この機能はデフォルトで有効になっています。

この作業はWG Device Managementが主導した[KEP \#3695](https://kep.k8s.io/3695)の一環として行われました。

### `kube-scheduler`の非ブロッキングAPIコール

`kube-scheduler`はスケジューリングサイクル中にブロッキングAPIコールを行い、パフォーマンスのボトルネックを生み出していました。
この機能では、リクエスト重複排除を備えた優先度付きキューシステムを通じた非同期API処理が導入されます。
これにより、スケジューラーはバックグラウンドでAPI操作が完了する間も、Podの処理を継続できます。
主な利点として、スケジューリングレイテンシーの削減、API遅延時のスケジューラースレッドの枯渇防止、スケジュール不可能なPodの即座の再試行機能があります。
この実装は後方互換性を維持し、保留中のAPI操作を監視するためのメトリクスも追加されます。

この作業はSIG Schedulingが主導した[KEP \#5229](https://kep.k8s.io/5229)の一環として行われました。

### Mutating Admission Policy

[MutatingAdmissionPolicy](/docs/reference/access-authn-authz/mutating-admission-policy/)は、Mutating Admission Webhookに対する宣言的でプロセス内の代替手段を提供します。
この機能はCELのオブジェクトインスタンス化とJSONのパッチ戦略を、Server-Side Applyのマージアルゴリズムと組み合わせて活用します。  
これにより、管理者がAPIサーバー内で直接Mutationルールを定義できるようになり、アドミッション制御が大幅に簡素化されます。  
v1.32でアルファとして導入されたMutating Admission Policyは、v1.34でベータに昇格しました。

この作業はSIG API Machineryが主導した[KEP \#3962](https://kep.k8s.io/3962)の一環として行われました。

### スナップショット可能なAPIサーバーのキャッシュ

`kube-apiserver`のキャッシュメカニズム(Watchキャッシュ)は、最新の観測状態に対するリクエストを効率的に処理します。
しかし、以前の状態に対する **list** リクエスト(ページネーションや`resourceVersion`の指定など)は、多くの場合このキャッシュをバイパスし、etcdから直接提供されます。
このetcdへの直接アクセスは、パフォーマンスコストを大幅に増加させ、特に大規模なリソースでは大量のデータ転送によるメモリ圧迫から安定性の問題を引き起こす可能性があります。  
`ListFromCacheSnapshot`フィーチャーゲートがデフォルトで有効になることで、`kube-apiserver`は要求された`resourceVersion`より古いスナップショットが利用可能な場合、そこから応答を提供しようとします。
`kube-apiserver`は最初スナップショットがない状態で開始し、watchイベントごとに新しいスナップショットを作成します。
etcdがコンパクションされたことを検出するか、75秒より古いイベントでキャッシュがいっぱいになるまで、スナップショットを保持します。
指定された`resourceVersion`が利用できない場合、サーバーはetcdにフォールバックします。

この作業はSIG API Machineryが主導した[KEP \#4988](https://kep.k8s.io/4988)の一環として行われました。

### Kubernetesネイティブ型の宣言的検証のためのツール

このリリース以前は、Kubernetesに組み込まれたAPIの検証ルールはすべて手作業で書かれており、メンテナーにとって発見、理解、改善、テストが困難でした。
APIに適用される可能性のあるすべての検証ルールを見つける統一的な方法も存在しませんでした。
_宣言的検証_ により、API開発、保守、レビューが容易になり、より良いツールとドキュメンテーションのためのプログラム的な検査も可能になります。
Kubernetesライブラリを使用して独自のコード(コントローラーなど)を書く開発者にとっても、複雑な検証関数ではなくIDLタグを通じて新しいフィールドを追加できるため、作業が簡素化されます。
この変更は検証用のボイラープレート(定型コード)を自動化してAPI作成を高速化し、バージョン管理された型で検証を実行することでより関連性の高いエラーメッセージを提供します。  
この機能強化(v1.33でベータに昇格し、v1.34でもベータとして継続)は、ネイティブKubernetes型にCELベースの検証ルールをもたらし、型定義に直接、より細かく宣言的な検証を定義できるようにします。
これによりAPIの一貫性と開発者体験が向上します。

この作業はSIG API Machineryが主導した[KEP \#5073](https://kep.k8s.io/5073)の一環として行われました。

### **list** リクエスト用のストリーミングインフォーマー

v1.32以降ベータとなっているストリーミングインフォーマー機能は、v1.34でさらなるベータの改善をしました。
この機能により、**list** リクエストはetcdから直接ページ化された結果を組み立てるのではなく、APIサーバーのWatchキャッシュから継続的なオブジェクトのストリームとしてデータを返すことができます。
**Watch**操作に使用されるのと同じメカニズムを再利用することで、APIサーバーは安定したメモリ使用量を保ちながら大規模なデータセットを提供でき、安定性に影響を与える割り当てのスパイクを回避できます。

このリリースでは、`kube-apiserver`と`kube-controller-manager`の両方がデフォルトで新しい`WatchList`メカニズムを活用します。
`kube-apiserver`ではlistリクエストがより効率的にストリーミングされ、`kube-controller-manager`はインフォーマーを扱うためのよりメモリ効率的で予測可能な方法の恩恵を受けます。
これらの改善により、大規模なlist操作中のメモリ圧迫が削減され、持続的な負荷下での信頼性が向上し、listストリーミングがより予測可能で効率的になります。

この作業はSIG API MachineryとSIG Scalabilityが主導した[KEP \#3157](https://kep.k8s.io/3157)の一環として行われました。

### Windowsノードの安全な終了

Windowsノード上の`kubelet`がシステムのシャットダウンイベントを検出し、実行中のPodの安全な終了を開始できるようになりました。
これはLinux上の既存の動作を反映しており、計画的なシャットダウンや再起動時にワークロードがクリーンに終了することを保証します。  
システムがシャットダウンを開始すると、`kubelet`は標準的な終了ロジックを使用して反応します。
設定されたライフサイクルフックと猶予期間を尊重し、ノードが電源オフになる前にPodに停止する時間を与えます。
この機能はWindowsのプレシャットダウン通知に依存してこのプロセスを調整します。
この機能強化により、メンテナンス、再起動、またはシステムアップデート時のワークロードの信頼性が向上します。
現在ベータ版で、デフォルトで有効になっています。

この作業はSIG Windowsが主導した[KEP \#4802](https://kep.k8s.io/4802)の一環として行われました。

### インプレースなPodのリサイズ機能の改善

v1.33でベータに昇格しデフォルトで有効になったインプレースなPodのリサイズ機能は、v1.34でさらなる改善を受けています。
これには、メモリ使用量の削減のサポートとPodレベルリソースとの統合が含まれます。

この機能はv1.34でもベータのまま維持されています。
詳細な使用方法と例については、ドキュメント[コンテナに割り当てられたCPUとメモリリソースのリサイズ](/docs/tasks/configure-pod-container/resize-container-resources/)をご参照ください。

この作業はSIG NodeとSIG Autoscalingが主導した[KEP \#1287](https://kep.k8s.io/1287)の一環として行われました。

## アルファの新機能

_これはv1.34リリース後にアルファとなった改善点の一部です。_

### mTLS認証のためのPodの証明書

クラスター内のワークロードの認証、特にAPIサーバーとの通信では、主にServiceAccountトークンに依存してきました。
効果的ではあるものの、これらのトークンは相互TLS(mTLS)のための強力で検証可能なアイデンティティを確立するには必ずしも理想的ではなく、証明書ベースの認証を期待する外部システムとの統合時に課題が生じることがあります。  
Kubernetes v1.34では、[PodCertificateRequest](/docs/reference/access-authn-authz/certificate-signing-requests/#pod-certificate-requests)を介してPodがX.509証明書を取得するための組み込みメカニズムが導入されます。
`kubelet`はPod用の証明書を要求・管理でき、これらの証明書はmTLSを使用してKubernetes APIサーバーや他のサービスへの認証に使用できます。
主な利点は、Podのためのより堅牢で柔軟なアイデンティティメカニズムです。
Bearerトークンのみに依存することなく、強力なmTLS認証を実装するネイティブな方法を提供し、Kubernetesを標準的なセキュリティプラクティスに合わせ、証明書対応の可観測性やセキュリティツールとの統合を簡素化します。

この作業はSIG Authが主導した[KEP \#4317](https://kep.k8s.io/4317)の一環として行われました。

### 「制限」Podのセキュリティ標準によるRemote Probeの禁止

Probeおよびライフサイクルハンドラー内の`host`フィールドにより、ユーザーは`kubelet`がProbeする対象として`podIP`以外のエンティティを指定できます。
しかし、これは悪用や、セキュリティ制御をバイパスする攻撃の経路を開きます。
`host`フィールドには、セキュリティ上重要な外部ホストやノード上のlocalhostを含む、**任意の**値を設定できるためです。
Kubernetes v1.34では、Podが[制限](/docs/concepts/security/pod-security-standards/#制限)Podのセキュリティ標準を満たすのは、`host`フィールドを未設定のままにするか、このタイプのProbeを使用しない場合のみとなります。
この標準を強制するには、_Podセキュリティアドミッション_ またはサードパーティソリューションを使用できます。
これらはセキュリティ制御であるため、選択した強制メカニズムの制限と動作を理解するためにドキュメントを確認してください。

この作業はSIG Authが主導した[KEP \#4940](https://kep.k8s.io/4940)の一環として行われました。

### Pod配置を表現するための`.status.nominatedNodeName`の使用

`kube-scheduler`がPodをNodeにバインドするのに時間がかかる場合、クラスターオートスケーラーはPodが特定のNodeにバインドされることを理解できない場合があります。
その結果、Nodeを使用率が低いと誤判断し、削除してしまう可能性があります。  
この問題に対処するため、`kube-scheduler`は`.status.nominatedNodeName`を使用して、進行中のプリエンプションを示すだけでなく、Podの配置意図も表現できるようになります。
`NominatedNodeNameForExpectation`フィーチャーゲートを有効にすることで、スケジューラーはこのフィールドを使用してPodがどこにバインドされるかを示します。
これにより内部的な予約が公開され、外部コンポーネントが情報に基づいた判断を下せるようになります。

この作業はSIG Schedulingが主導した[KEP \#5278](https://kep.k8s.io/5278)の一環として行われました。

### アルファ版のDRA機能

#### DRAのリソースヘルス状態

Podが故障した、または一時的に異常なデバイスを使用している場合、それを把握することは困難です。
これによりPodのクラッシュのトラブルシューティングが難しく、時には不可能になります。  
DRAのリソースヘルス状態機能は、Podに割り当てられたデバイスのヘルス状態をPodのステータスに公開することで、可観測性を向上させます。
これにより、異常なデバイスに関連するPodの問題の原因を特定しやすくなり、適切に対応できるようになります。  
この機能を有効にするには、`ResourceHealthStatus`フィーチャーゲートを有効にし、DRAドライバーが`DRAResourceHealth` gRPCサービスを実装している必要があります。

この作業はWG Device Managementが主導した[KEP \#4680](https://kep.k8s.io/4680)の一環として行われました。

#### 拡張リソースマッピング

拡張リソースマッピングは、リソースの容量と消費量を記述するための簡単な方法を提供することで、DRAの表現力豊かで柔軟なアプローチよりもシンプルな代替手段となります。
これにより、クラスター管理者はDRAで管理しているリソースを*拡張リソース*として公開でき、アプリケーション開発者や運用者は新しいDRA APIを学ぶことなく、従来通りコンテナの`.spec.resources`フィールドでこれらのリソースを要求できます。  
この機能の最大の利点は、既存のワークロードを変更せずにDRAの恩恵を受けられることです。
アプリケーション開発者とクラスター管理者の両方にとって、DRAへの移行が大幅に簡単になります。

この作業はWG Device Managementが主導した[KEP \#5004](https://kep.k8s.io/5004)の一環として行われました。

#### DRAの消費可能な容量

Kubernetes v1.33では、リソースドライバーがデバイス全体を一つの単位として扱うのではなく、利用可能なデバイスの一部分(スライス)を公開できるようになりました。
しかし、このアプローチでは、デバイスドライバーがユーザーの要求に基づいてデバイスリソースを細かく動的に分割する場合や、ResourceClaimの仕様と名前空間の制限を超えてリソースを共有する場合に対応できませんでした。  
`DRAConsumableCapacity`フィーチャーゲートを有効にすることで(v1.34でアルファとして導入)、リソースドライバーは同じデバイスやデバイスの一部を、複数のResourceClaimまたは複数のDeviceRequest間で共有できるようになります。
この機能はまた、`capacity`フィールドで定義されたデバイスリソースの一部を割り当てることをサポートするようスケジューラーを拡張します。
このDRA機能により、名前空間やクレーム間でのデバイス共有が改善され、Podのニーズに合わせた調整が可能になります。
ドライバーが容量制限を強制でき、スケジューリングが強化され、帯域幅を考慮したネットワーキングやマルチテナント共有などの新しいユースケースをサポートします。

この作業はWG Device Managementが主導した[KEP \#5075](https://kep.k8s.io/5075)の一環として行われました。

#### デバイスのバインド条件

Kubernetesスケジューラーは、必要な外部リソース(アタッチ可能なデバイスやFPGAなど)が準備完了であることを確認するまで、PodのNodeへのバインディングを遅延させることで、より信頼性が向上します。  
この遅延メカニズムは、スケジューリングフレームワークの[PreBindフェーズ](/docs/concepts/scheduling-eviction/scheduling-framework/#pre-bind)で実装されます。
このフェーズ中に、スケジューラーは必要なすべてのデバイス条件が満たされているかを確認してから、バインディングを続行します。
これにより外部デバイスコントローラーとの調整が可能になり、より堅牢で予測可能なスケジューリングが実現します。

この作業はWG Device Managementが主導した[KEP \#5007](https://kep.k8s.io/5007)の一環として行われました。

### コンテナ再起動ルール

現在、Pod内のすべてのコンテナは、終了またはクラッシュ時に同じ`.spec.restartPolicy`に従います。
しかし、複数のコンテナを実行するPodでは、各コンテナに異なる再起動要件が必要な場合があります。
例えば、初期化を実行するために使用されるInitコンテナでは、失敗時に初期化を再試行したくない場合があります。
同様に長時間実行される訓練ワークロードを扱うML研究の環境では、再試行可能な終了コードで失敗したコンテナは、Pod全体を再作成して進行状況を失うのではなく、その場で素早く再起動すべきです。  
Kubernetes v1.34では`ContainerRestartRules`フィーチャーゲートを導入します。
有効にすると、Pod内の各コンテナに対して`restartPolicy`を指定できます。
また、最後の終了コードに基づいて`restartPolicy`を上書きする`restartPolicyRules`リストも定義できます。
これにより、複雑なシナリオに対処するために必要な細かい制御と、計算リソースのより良い利用が可能になります。

この作業はSIG Nodeが主導した[KEP \#5307](https://kep.k8s.io/5307)の一環として行われました。

### 実行時に作成されたファイルからの環境変数の読み込み

アプリケーション開発者は長い間、環境変数宣言のより柔軟な方法を求めてきました。
これまで、環境変数は静的な値、ConfigMapまたはSecretを介してAPIサーバー側で宣言されていました。

`EnvFiles`フィーチャーゲートによって、Kubernetes v1.34では実行時に環境変数を宣言する機能を導入します。
あるコンテナ(通常はInitコンテナ)が変数を生成してファイルに保存し、後続のコンテナがそのファイルから環境変数を読み込んで起動できます。
このアプローチにより、対象コンテナのエントリポイントを「ラップ」する(起動コマンドを変更する)必要がなくなり、Pod内でのより柔軟なコンテナオーケストレーションが可能になります。

この機能は特にAI/MLトレーニングのワークロードに有益です。
訓練Job内の各Podが実行時に定義される値で初期化される必要がある場合に役立ちます。

この作業はSIG Nodeが主導した[KEP \#3721](https://kep.k8s.io/3721)の一環として行われました。

## v1.34での昇格、非推奨化、および削除

### GAへの昇格

これは安定版(*一般提供、GA*とも呼ばれる)に昇格したすべての機能を一覧にしたものです。
アルファからベータへの昇格や新機能を含む更新の完全なリストについては、リリースノートをご覧ください。

このリリースには、GAに昇格した合計23の機能強化が含まれています:

* [Allow almost all printable ASCII characters in environment variables](https://kep.k8s.io/4369)
* [Allow for recreation of pods once fully terminated in the job controller](https://kep.k8s.io/3939)
* [Allow zero value for Sleep Action of PreStop Hook](https://kep.k8s.io/4818)
* [API Server tracing](https://kep.k8s.io/647)
* [AppArmor support](https://kep.k8s.io/24)
* [Authorize with Field and Label Selectors](https://kep.k8s.io/4601)
* [Consistent Reads from Cache](https://kep.k8s.io/2340)
* [Decouple TaintManager from NodeLifecycleController](https://kep.k8s.io/3902)
* [Discover cgroup driver from CRI](https://kep.k8s.io/4033)
* [DRA: structured parameters](https://kep.k8s.io/4381)
* [Introducing Sleep Action for PreStop Hook](https://kep.k8s.io/3960)
* [Kubelet OpenTelemetry Tracing](https://kep.k8s.io/2831)
* [Kubernetes VolumeAttributesClass ModifyVolume](https://kep.k8s.io/3751)
* [Node memory swap support](https://kep.k8s.io/2400)
* [Only allow anonymous auth for configured endpoints](https://kep.k8s.io/4633)
* [Ordered namespace deletion](https://kep.k8s.io/5080)
* [Per-plugin callback functions for accurate requeueing in kube-scheduler](https://kep.k8s.io/4247)
* [Relaxed DNS search string validation](https://kep.k8s.io/4427)
* [Resilient Watchcache Initialization](https://kep.k8s.io/4568)
* [Streaming Encoding for LIST Responses](https://kep.k8s.io/5116)
* [Structured Authentication Config](https://kep.k8s.io/3331)
* [Support for Direct Service Return (DSR) and overlay networking in Windows kube-proxy](https://kep.k8s.io/5100)
* [Support recovery from volume expansion failure](https://kep.k8s.io/1790)

### 非推奨化と削除 {#deprecations-and-removals}

Kubernetesの開発と成熟に伴い、プロジェクト全体の健全性を向上させるために機能が非推奨化されたり、削除されたり、より良い機能に置き換えられたりすることがあります。
このプロセスに関する詳細は、[Kubernetes非推奨ポリシー](/docs/reference/using-api/deprecation-policy/)を参照してください。
Kubernetes v1.34にはいくつかの非推奨化が含まれています。

#### 手動でのcgroupドライバー設定の非推奨化

これまで、正しいcgroupドライバーの設定は、Kubernetesクラスターを実行するユーザーにとって悩みの種でした。
Kubernetes v1.28では、`kubelet`がCRI実装に問い合わせて使用すべきcgroupドライバーを見つける方法が追加されました。
この自動検出が現在**強く推奨**されており、そのサポートはv1.34でGAに昇格しました。
お使いのCRIコンテナランタイムが必要なcgroupドライバーを報告する機能をサポートしていない場合は、コンテナランタイムをアップグレードまたは変更する必要があります。
`kubelet`設定ファイルの`cgroupDriver`設定は現在非推奨となっています。
対応するコマンドラインオプション`--cgroup-driver`は以前から非推奨となっており、Kubernetesでは設定ファイルの使用を推奨しています。
設定項目とコマンドラインオプションの両方は将来のリリースで削除される予定ですが、その削除はv1.36のマイナーリリースより前には行われません。

この作業はSIG Nodeが主導した[KEP \#4033](https://kep.k8s.io/4033)の一環として行われました。

#### v1.36でのcontainerd 1.xサポート終了

Kubernetes v1.34はまだcontainerd 1.7やその他のLTSリリースをサポートしていますが、自動でのcgroupドライバー検出の結果として、Kubernetes SIG Nodeコミュニティはcontainerd v1.Xの最終サポートタイムラインについて正式に合意しました。
このサポートを提供する最後のKubernetesリリースはv1.35となります(containerd 1.7のEOLに合わせて)。
これは早期の警告です。
containerd 1.Xを使用している場合は、早急に2.0以降への切り替えを検討してください。
クラスター内のノードが、まもなくサポート対象外となるcontainerdバージョンを使用しているかどうかを判断するために、`kubelet_cri_losing_support`メトリクスを監視できます。

この作業はSIG Nodeが主導した[KEP \#4033](https://kep.k8s.io/4033)の一環として行われました。

#### `PreferClose`トラフィック分散の非推奨化

Kubernetes [Service](/docs/concepts/services-networking/service/)内の`spec.trafficDistribution`フィールドにより、ユーザーはServiceエンドポイントへのトラフィックのルーティング方法に関する優先設定を指定できます。  

[KEP-3015](https://kep.k8s.io/3015)では`PreferClose`を非推奨とし、2つの新しい値`PreferSameZone`と`PreferSameNode`を導入します。
`PreferSameZone`は既存の`PreferClose`のエイリアスで、その意味をより明確にします。
`PreferSameNode`は可能な場合はローカルエンドポイントに接続を配信し、不可能な場合はリモートエンドポイントにフォールバックすることを可能にします。

この機能は`PreferSameTrafficDistribution`フィーチャーゲートの下でv1.33で導入されました。
v1.34でベータに昇格し、デフォルトで有効になっています。

この作業はSIG Networkが主導した[KEP \#3015](https://kep.k8s.io/3015)の一環として行われました

## リリースノート

Kubernetes v1.34リリースの詳細については、[リリースノート](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.34.md)をご覧ください。

## 入手方法

Kubernetes v1.34は[GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.34.0)または[Kubernetes公式サイトのダウンロードページ](/releases/download/)からダウンロードできます。

Kubernetesを始めるには、[チュートリアル](/docs/tutorials/)をチェックするか、[minikube](https://minikube.sigs.k8s.io/)を使用してローカルKubernetesクラスターを実行してください。また、[kubeadm](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)を使用して簡単にv1.34をインストールすることもできます。

## リリースチーム

Kubernetesは、コミュニティの支援と献身的な努力によって成り立っています。
各リリースチームは、皆さんが利用するKubernetesリリースを構成する様々な要素を協力して構築する、献身的なコミュニティボランティアで構成されています。
これを実現するには、コードそのものからドキュメント作成、プロジェクト管理に至るまで、コミュニティのあらゆる分野の専門スキルが必要です。

私たちは、技術とコミュニティ構築への情熱でKubernetesコミュニティに大きな足跡を残した献身的なコントリビューター、[Rodolfo "Rodo" Martínez Vegaを追悼します](https://github.com/cncf/memorials/blob/main/rodolfo-martinez.md)。
Rodoは、v1.22-v1.23およびv1.25-v1.30を含む複数のリリースでKubernetesリリースチームのメンバーとして活動し、プロジェクトの成功と安定性に対する揺るぎない献身を示しました。  
リリースチームでの活動に加え、RodoはCloud Native LATAMコミュニティの発展に深く関わり、この分野における言語と文化の壁を越える架け橋となりました。
Kubernetesドキュメントのスペイン語版やCNCF Glossaryでの活動は、世界中のスペイン語話者の開発者に知識を届けたいという彼の強い思いを体現していました。
Rodoが指導した数多くのコミュニティメンバー、彼が支えたリリース、そして彼が育んだ活気あるLATAM Kubernetesコミュニティを通じて、彼の遺産は今も生き続けています。

Kubernetes v1.34リリースをコミュニティに届けるために多くの時間を費やして取り組んでくれた[リリースチーム](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.34/release-team.md)全体に感謝します。
リリースチームには、初参加のShadow(見習い)から、複数のリリースサイクルで経験を積んだベテランのチームリードまで、様々なメンバーが参加しています。
リリースリードのVyom Yadavに心より感謝します。
彼は成功へと導くリーダーシップ、課題解決への実践的なアプローチ、そしてコミュニティを前進させる活力と思いやりを示してくれました。

## プロジェクトの活動状況

CNCF K8sの[DevStats](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&var-period=m&var-repogroup_name=All)プロジェクトは、Kubernetesおよび様々なサブプロジェクトの活動状況に関する興味深いデータポイントを集計しています。
これには個人の貢献から貢献企業数まで含まれ、このエコシステムの発展に費やされる努力の深さと広さを示しています。

v1.34リリースサイクル(2025年5月19日から2025年8月27日までの15週間)において、Kubernetesには最大106の異なる企業と491人の個人から貢献がありました。
より広範なクラウドネイティブエコシステムでは、この数字は370社、合計2235人のコントリビューターに達しています。

なお、「貢献」とはコミットの作成、コードレビュー、コメント、IssueやPRの作成、PRのレビュー(ブログやドキュメントを含む)、またはIssueやPRへのコメントを行うことを指します。  
貢献に興味がある場合は、コントリビューター向けWebサイトの[はじめに](https://www.kubernetes.dev/docs/guide/#getting-started)をご覧ください。

データソース:

* [Companies contributing to Kubernetes](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&from=1747609200000&to=1756335599000&var-period=d28&var-repogroup_name=Kubernetes&var-repo_name=kubernetes%2Fkubernetes)  
* [Overall ecosystem contributions](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&from=1747609200000&to=1756335599000&var-period=d28&var-repogroup_name=All&var-repo_name=kubernetes%2Fkubernetes)

## イベント情報

今後開催予定のKubernetesおよびクラウドネイティブイベント(KubeCon + CloudNativeCon、KCDなど)や、世界各地で開催される主要なカンファレンスについて紹介します。
Kubernetesコミュニティの最新情報を入手し、参加しましょう！

**2025年8月**

- [**KCD - Kubernetes Community Days:  Colombia**](https://community.cncf.io/events/details/cncf-kcd-colombia-presents-kcd-colombia-2025/): 2025年8月28日 | コロンビア、ボゴタ

**2025年9月**

- [**CloudCon Sydney**](https://community.cncf.io/events/details/cncf-cloud-native-sydney-presents-cloudcon-sydney-sydney-international-convention-centre-910-september/): 2025年9月9日-10日 | オーストラリア、シドニー
- [**KCD - Kubernetes Community Days: San Francisco Bay Area**](https://community.cncf.io/events/details/cncf-kcd-sf-bay-area-presents-kcd-san-francisco-bay-area/): 2025年9月9日 | アメリカ、サンフランシスコ
- [**KCD - Kubernetes Community Days: Washington DC**](https://community.cncf.io/events/details/cncf-kcd-washington-dc-presents-kcd-washington-dc-2025/): 2025年9月16日 | アメリカ、ワシントンD.C.
- [**KCD - Kubernetes Community Days: Sofia**](https://community.cncf.io/events/details/cncf-kcd-sofia-presents-kubernetes-community-days-sofia/): 2025年9月18日 | ブルガリア、ソフィア
- [**KCD - Kubernetes Community Days: El Salvador**](https://community.cncf.io/events/details/cncf-kcd-el-salvador-presents-kcd-el-salvador/): 2025年9月20日 | エルサルバドル、サンサルバドル

**2025年10月**

- [**KCD - Kubernetes Community Days: Warsaw**](https://community.cncf.io/events/details/cncf-kcd-warsaw-presents-kcd-warsaw-2025/): 2025年10月9日 | ポーランド、ワルシャワ
- [**KCD - Kubernetes Community Days: Edinburgh**](https://community.cncf.io/events/details/cncf-kcd-uk-presents-kubernetes-community-days-uk-edinburgh-2025/): 2025年10月21日 | イギリス、エディンバラ
- [**KCD - Kubernetes Community Days: Sri Lanka**](https://community.cncf.io/events/details/cncf-kcd-sri-lanka-presents-kcd-sri-lanka-2025/): 2025年10月26日 | スリランカ、コロンボ

**2025年11月**

- [**KCD - Kubernetes Community Days: Porto**](https://community.cncf.io/events/details/cncf-kcd-porto-presents-kcd-porto-2025/): 2025年11月3日 | ポルトガル、ポルト
- [**KubeCon + CloudNativeCon North America 2025**](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/): 2025年11月10日-13日 | アメリカ、アトランタ
- [**KCD - Kubernetes Community Days: Hangzhou**](https://sessionize.com/kcd-hangzhou-and-oicd-2025/): 2025年11月14日 | 中国、杭州

**2025年12月**

- [**KCD - Kubernetes Community Days: Suisse Romande**](https://community.cncf.io/events/details/cncf-kcd-suisse-romande-presents-kcd-suisse-romande/): 2025年12月4日 | スイス、ジュネーブ

最新のイベント情報は[こちら](https://community.cncf.io/events/#/list)でご確認いただけます。

## ウェビナーのご案内

Kubernetes v1.34リリースチームのメンバーと一緒に **2025年9月24日(水)午後4時(UTC)** から、このリリースのハイライトやアップグレードの計画に役立つ非推奨事項や削除事項について学びましょう。
詳細および参加登録は、CNCFオンラインプログラム・サイトの[イベントページ](https://community.cncf.io/events/details/cncf-cncf-online-programs-presents-cloud-native-live-kubernetes-v134-release/)をご覧ください。

## 参加方法

Kubernetesに関わる最も簡単な方法は、あなたの興味に合った[Special Interest Groups](https://github.com/kubernetes/community/blob/master/sig-list.md) (SIGs)のいずれかに参加することです。
Kubernetesコミュニティに向けて何か発信したいことはありますか？
毎週の[コミュニティミーティング](https://github.com/kubernetes/community/tree/master/communication)や、以下のチャンネルであなたの声を共有してください。
継続的なフィードバックとサポートに感謝いたします。

- 最新情報はBlueSkyの[@kubernetes.io](https://bsky.app/profile/kubernetes.io)をフォローしてください
- [Discuss](https://discuss.kubernetes.io/)でコミュニティディスカッションに参加してください
- [Slack](http://slack.k8s.io/)でコミュニティに参加してください
- [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)で質問したり、回答したりしてください
- あなたのKubernetesに関する[ストーリー](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)を共有してください
- Kubernetesの最新情報は[ブログ](https://kubernetes.io/blog/)でさらに詳しく読むことができます
- リリースチームについての詳細は[Kubernetes Release Team](https://github.com/kubernetes/sig-release/tree/master/release-team)をご覧ください