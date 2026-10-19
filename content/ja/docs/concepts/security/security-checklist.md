---
title: セキュリティチェックリスト
description: >
  Kubernetesクラスターのセキュリティを確保するための基本的なチェックリスト。
content_type: concept
weight: 100
---

<!-- overview -->

このチェックリストは、各トピックについて、より包括的な文書へのリンクとともにガイダンスの基本的なリストを提供することを目的としています。
網羅的なものではなく、進化することを目的としています。

この文書の読み方、使い方について:

- トピックの順序は、優先順位を反映したものではありません。
- いくつかのチェックリスト項目は、各セクションのリストの下の段落に詳述されています。

{{< caution >}}
チェックリストだけでは、適切なセキュリティ体制を確立するのに十分**ではありません**。
適切なセキュリティ体制には継続的な注意と改善が必要ですが、チェックリストはセキュリティ対策に向けた終わりのない旅の第一歩です。
このチェックリストの推奨事項の一部は、特定のセキュリティニーズに対して制限が厳しすぎたり、緩すぎたりする場合があります。
Kubernetesのセキュリティは「万能」ではないため、チェックリストの各項目のメリットに基づいて評価する必要があります。
{{< /caution >}}

<!-- body -->

## 認証と認可

- [ ] `system:masters`グループはブートストラップ後のユーザー認証またはコンポーネント認証に使用していません。
- [ ] kube-controller-managerが`--use-service-account-credentials`を有効にして実行しています。
- [ ] ルート証明書は保護されています(オフラインCAまたは効果的なアクセス制御を備えた管理されたオンラインCAのいずれか)。
- [ ] 中間証明書とリーフ証明書の有効期限は、3年以内です。
- [ ] 定期的なアクセスレビューのプロセスが存在し、レビューの間隔は24か月以内です。
- [ ] 認証と認可に関するガイダンスについては、[ロールベースのアクセス制御のベストプラクティス](/ja/docs/concepts/security/rbac-good-practices/)に従っています。

ブートストラップ後、ユーザーもコンポーネントもKubernetes APIに対して`system:masters`として認証しないでください。
同様に、すべてのkube-controller-managerを`system:masters`として実行することは避けてください。
実際には、`system:masters`は管理者ユーザーとは対照的に、緊急アクセス用としてのみ使用してください。

## ネットワークセキュリティ

- [ ] 使用中のCNIプラグインはネットワークポリシーをサポートしています。
- [ ] ingressおよびegressのネットワークポリシーは、クラスター内のすべてのワークロードに適用しています。
- [ ] 各Namespace内のデフォルトのネットワークポリシーで、すべてのPodを選択して拒否しています。
- [ ] 適切な場合、サービスメッシュを使用してクラスター内のすべての通信を暗号化しています。
- [ ] Kubernetes API、kubelet API、およびetcdはインターネット上に公開していません。
- [ ] ワークロードからクラウドメタデータAPIへのアクセスはフィルターしています。
- [ ] LoadBalancerおよびExternalIPの使用は制限しています。

多数の[コンテナネットワークインターフェース(CNI)プラグイン](/ja/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)は、Podが通信できるネットワークリソースを制限する機能を提供します。
これは、ルールを定義するためのNamespaceリソースを提供する[ネットワークポリシー](/ja/docs/concepts/services-networking/network-policies/)を通じて最も一般的に行われます。
各Namespaceですべてのegressとingressをブロックし、すべてのPodを選択するデフォルトのネットワークポリシーは、許可リストアプローチを採用してワークロードの見落としがないようにするのに役立ちます。

すべてのCNIプラグインが転送中の暗号化を提供するわけではありません。
選択したプラグインにこの機能がない場合、代替ソリューションとして、サービスメッシュを使用してその機能を提供することができます。

コントロールプレーンのetcdデータストアには、アクセスを制限し、インターネット上で公開されないようにする制御が必要です。
さらに、安全に通信するために相互TLS(mTLS)を使用する必要があります。
この認証局はetcdに固有のものである必要があります。

Kubernetes APIサーバーへの外部インターネットアクセスは、APIが公開されないように制限する必要があります。
多くのマネージドKubernetesディストリビューションは、デフォルトでAPIサーバーを公開しているため注意してください。
その場合、要塞ホストを使用してサーバーにアクセスできます。

[kubelet](/ja/docs/reference/command-line-tools-reference/kubelet/)のAPIアクセスは制限し、公開しないようにする必要があります。
`--config`フラグで設定ファイルが指定されていない場合、デフォルトの認証および認可設定は過度に許可されています。

Kubernetesのホスティングにクラウドプロバイダーを使用する場合、PodからクラウドメタデータAPI`169.254.169.254`へのアクセスも、情報が漏洩する可能性があるため、必要でない場合は制限またはブロックする必要があります。

LoadBalancerおよびExternalIPの制限付き使用の詳細については[CVE-2020-8554: Man in the middle using LoadBalancer or ExternalIPs](https://github.com/kubernetes/kubernetes/issues/97076)および[DenyServiceExternalIPsアドミッションコントローラー](/docs/reference/access-authn-authz/admission-controllers/#denyserviceexternalips)を参照してください。

## Podセキュリティ

- [ ] ワークロードの`create`、`update`、`patch`、`delete`に対するRBAC権限は、必要な場合にのみ付与しています。
- [ ] 適切なPodセキュリティ標準ポリシーをすべてのNamespaceに強制適用しています。
- [ ] ワークロードのメモリ制限は、リクエストと同等またはそれ以下の制限で設定しています。
- [ ] 機密性の高いワークロードにはCPU制限を設定する場合があります。
- [ ] Seccompをサポートしているノードでは、プログラム用の適切なsyscallプロファイルでそれが有効になっています。
- [ ] AppArmorまたはSELinuxをサポートしているノードでは、プログラム用の適切なプロファイルでそれが有効になっています。

RBAC認証は重要ですが、[Podのリソース](/ja/docs/concepts/security/rbac-good-practices/#workload-creation)(またはPodを管理する任意のリソース)に対する認証を行うほど細かく設定することはできません。
唯一の細分性は、リソース自体に対するAPI動詞です。
たとえばPodに対する`create`です。
追加のアドミッションがなければ、これらのリソースを作成する権限によって、クラスターのスケジューリング可能なノードへの直接的な無制限のアクセスが許可されます。

[Podセキュリティ標準](/ja/docs/concepts/security/Pod-security-standards/)は、セキュリティに関して`PodSpec`でフィールドを設定する方法を制限する、特権、ベースライン、制限の3つの異なるポリシーを定義します。

デフォルトで有効になっている新しい[Podセキュリティ](/ja/docs/concepts/security/Pod-security-admission/)アドミッション、またはサードパーティのアドミッションWebhookを使用して、Namespaceレベルで適用できます。
削除され置き換えられたPodSecurityPolicyアドミッションとは異なり、[Podセキュリティ](/ja/docs/concepts/security/Pod-security-admission/)アドミッションは、アドミッションWebhookや外部サービスと簡単に組み合わせることが可能な点に注意してください。

Podセキュリティアドミッション`restricted`ポリシーは、[Podセキュリティ標準](/ja/docs/concepts/security/Pod-security-standards/)セットの中で最も制限の厳しいポリシーで、[複数のモードで動作可能](/ja/docs/concepts/security/Pod-security-admission/#Pod-security-admission-labels-for-namespaces)です。
`warn`、`audit`、または`enforce`を使用して、セキュリティのベストプラクティスに従って、最も適切な[セキュリティコンテキスト](/ja/docs/tasks/configure-Pod-container/security-context/)を段階的に適用します。
ただし、特定のユースケースでは、事前定義されたセキュリティ標準に加えて、Podが持つ権限とアクセスを制限するために、Podの[セキュリティコンテキスト](/ja/docs/tasks/configure-Pod-container/security-context/)を個別に調査する必要があります。

[Podセキュリティ](/ja/docs/concepts/security/Pod-security-admission/)の実践的なチュートリアルについては、ブログ投稿[Kubernetes 1.23: Podセキュリティがベータ版に移行](/blog/2021/12/09/Pod-security-admission-beta/)を参照してください。

[メモリとCPUの制限](/ja/docs/concepts/configuration/manage-resources-containers/)を設定して、Podがノードで消費できるメモリとCPUリソースを制限し、悪意のあるワークロードや侵害されたワークロードによる潜在的なDoS攻撃を防ぐ必要があります。
このようなポリシーは、アドミッションコントローラーによって適用できます。
CPU制限により使用量が制限されるため、自動スケーリング機能や効率性、つまり利用可能なCPUリソースをベストエフォートで実行することに対して、意図しない影響が生じる可能性があります。

{{< caution >}}
メモリ制限が要求を上回ると、ノード全体がOOM問題にさらされる可能性があります。
{{< /caution >}}

### Seccompの有効化
Seccompはセキュアコンピューティングモードの略で、バージョン2.6.12以降のLinuxカーネルの機能です。
プロセスの権限をサンドボックス化して、ユーザー空間からカーネルへの呼び出しを制限するために使用できます。
Kubernetesを使用すると、ノードに読み込まれたseccompプロファイルを、Podとコンテナに自動的に適用できます。

Seccompを使用すると、コンテナ内で利用可能なLinuxカーネルsyscall攻撃対象領域を減らすことで、ワークロードのセキュリティを向上できます。
seccompフィルターモードは、BPFを利用して、プロファイルという名前の特定のsyscallの許可または拒否リストを作成します。

Kubernetes 1.27以降、すべてのワークロードのデフォルトのseccompプロファイルとして`RuntimeDefault`の使用を有効にできます。
このトピックに関する[セキュリティチュートリアル](/ja/docs/tutorials/security/seccomp/)が利用可能です。
さらに、[Kubernetes Security Profiles Operator](https://github.com/kubernetes-sigs/security-profiles-operator)は、クラスターでのseccompの管理と使用を容易にするプロジェクトです。

{{< note >}}
seccompはLinuxノードでのみ使用できます。
{{< /note >}}

### AppArmorまたはSELinuxの有効化

#### AppArmor

[AppArmor](/ja/docs/tutorials/security/apparmor/)は、強制アクセス制御(MAC)を簡単に実装し、システムログを通じて監査を向上させることができるLinuxカーネルセキュリティモジュールです。
デフォルトのAppArmorプロファイルは、それをサポートするノードで強制されますが、カスタムプロファイルを構成することもできます。
seccompと同様に、AppArmorもプロファイルを通じて構成されます。
各プロファイルは、許可されていないリソースへのアクセスをブロックする強制モード(complain mode)か、違反のみを報告する苦情モード(enforce mode)で実行されます。
AppArmorプロファイルは、コンテナごとに注釈付きで適用され、プロセスが適切な権限を取得できるようにします。

{{< note >}}
AppArmorはLinuxノードでのみ使用可能で、[一部のLinuxディストリビューション](https://gitlab.com/apparmor/apparmor/-/wikis/home#distributions-and-ports)で有効になっています。
{{< /note >}}

#### SELinux

[SELinux](https://github.com/SELinuxProject/selinux-notebook/blob/main/src/selinux_overview.md)も、強制アクセス制御(MAC)などのアクセス制御セキュリティポリシーをサポートするLinuxカーネルセキュリティモジュールです。
SELinuxラベルは、コンテナまたはPodに[`securityContext`セクションを介して](/ja/docs/tasks/configure-Pod-container/security-context/#assign-selinux-labels-to-a-container)割り当てることができます。

{{< note >}}
SELinuxはLinuxノードでのみ使用可能で、[一部のLinuxディストリビューション](https://en.wikipedia.org/wiki/Security-Enhanced_Linux#Implementations)で有効になっています。
{{< /note >}}

## ログと監査

- [ ] 監査ログを有効化して、一般アクセスから保護します。

## Podの配置

- [ ] Podの配置は、アプリケーションの機密性の階層に従って行います。
- [ ] 機密性の高いアプリケーションは、ノード上で分離して実行するか、特定のサンドボックス化されたランタイムで実行します。

アプリケーションPodとKubernetes APIサーバーなど、機密性の異なる層にあるPodは、別々のノードにデプロイする必要があります。
ノード分離の目的は、アプリケーションコンテナのブレイクアウトを防ぎ、より機密性の高いアプリケーションへのアクセスを直接提供して、クラスター内で簡単にピボットできるようにすることです。
Podが誤って同じノードにデプロイされるのを防ぐために、この分離を実施する必要があります。
これは、次の機能を使用して実施できます。

[ノードセレクター](/ja/docs/concepts/scheduling-eviction/assign-Pod-node/)
: Pod仕様の一部として、デプロイするノードを指定するキーと値のペア。
これらは、[PodNodeSelector](/ja/docs/reference/access-authn-authz/admission-controllers/#Podnodeselector)アドミッションコントローラーを使用して、Namespaceとクラスターレベルで実施できます。

[PodTolerationRestriction](/ja/docs/reference/access-authn-authz/admission-controllers/#Podtolerationrestriction)
: 管理者がNamespace内で許可された[toleration](/ja/docs/concepts/scheduling-eviction/taint-and-toleration/)を制限できるようにするアドミッションコントローラー。
Namespace内のPodは、デフォルトおよび許可された一連のtolerationを提供するNamespaceオブジェクトアノテーションキーで指定されたtolerationのみを使用できます。

[RuntimeClass](/ja/docs/concepts/containers/runtime-class/)
: RuntimeClassは、コンテナのランタイム構成を選択するための機能です。

コンテナのランタイム構成は、Podのコンテナを実行するために使用され、パフォーマンスのオーバーヘッドを犠牲にして、多少なりともホストからの分離を提供できます。

## Secret

- [ ] ConfigMapを、機密データを保持するために使用していません。
- [ ] Secret APIは保存時に暗号化をしています。
- [ ] 適切な場合、サードパーティのストレージに保存されているシークレットを挿入する仕組みを導入しており、使用可能です。
- [ ] サービスアカウントトークンは、それらを必要としないPodにはマウントしません。
- [ ] [バインドされたサービスアカウントトークンボリューム](/ja/docs/reference/access-authn-authz/service-accounts-admin/#bound-service-account-token-volume)は、期限切れのないトークンの代わりに使用しています。

Podに必要なシークレットは、ConfigMapなどの代替手段ではなく、Kubernetes Secret内に保存する必要があります。
etcd内に保存されているシークレットリソースは、[保存時に暗号化](/ja/docs/tasks/administer-cluster/encrypt-data/)する必要があります。

シークレットを必要とするPodでは、ボリュームを介してシークレットが自動的にマウントされ、できれば[`emptyDir.medium`オプション](/ja/docs/concepts/storage/volumes/#emptydir)のようにメモリ内に保存される必要があります。
このメカニズムは、[Secret Store CSIドライバー](https://secrets-store-csi-driver.sigs.k8s.io/)などのボリュームとしてサードパーティのストレージからシークレットを挿入するためにも使用できます。
PodのサービスアカウントにシークレットへのRBACアクセスを提供するよりも、これを優先的に行う必要があります。
これにより、シークレットを環境変数またはファイルとしてPodに追加できます。
環境変数メソッドは、ファイルの権限メカニズムとは異なり、ログのクラッシュダンプとLinuxの環境変数の非機密性により、漏洩が発生しやすい可能性があることに注意してください。

サービスアカウントトークンは、それらを必要としないPodにマウントしないでください。
これは、サービスアカウント内で[`automountServiceAccountToken`](/ja/docs/tasks/configure-Pod-container/configure-service-account/#use-the-default-service-account-to-access-the-api-server)を`false`に設定して、Namespace全体に適用するか、Podに固有の設定にすることで構成できます。
Kubernetes v1.22以降では、時間制限のあるサービスアカウント認証情報には[バインドされたサービスアカウント](/ja/docs/reference/access-authn-authz/service-accounts-admin/#bound-service-account-token-volume)を使用します。

## イメージ

- [ ] コンテナイメージ内の不要なコンテンツは最小限に抑えています。
- [ ] コンテナイメージは、権限のないユーザーとして実行されるように構成しています。
- [ ] コンテナイメージへの参照は、(タグではなく)sha256ダイジェストによって行うか、もしくは、デプロイ時に[アドミッションコントロール経由](/ja/docs/tasks/administer-cluster/verify-signed-artifacts/#verifying-image-signatures-with-admission-controller)でイメージのデジタル署名を検証しています。
- [ ] コンテナイメージは、作成中およびデプロイ中に定期的にスキャンし、既知の脆弱なソフトウェアにはパッチを適用しています。

コンテナイメージには、パッケージ化されたプログラムを実行するための最小限のものだけが含まれている必要があります。
できれば、プログラムとその依存関係のみで、最小限のベースからイメージを構築します。
特に、本番環境で使用するイメージには、シェルやデバッグユーティリティを含めないでください。
[エフェメラル(一時的)なデバッグコンテナ](/ja/docs/tasks/debug/debug-application/debug-running-Pod/#ephemeral-container)をトラブルシューティングに使用できます。

[Dockerfileの`USER`命令](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#user)を使用して、権限のないユーザーで直接起動するイメージを構築します。
[セキュリティコンテキスト](/ja/docs/tasks/configure-Pod-container/security-context/#set-the-security-context-for-a-Pod)を使用すると、イメージマニフェストで指定されていない場合でも、`runAsUser`および`runAsGroup`を使用して特定のユーザーとグループでコンテナイメージを開始できます。
ただし、イメージレイヤーのファイル権限により、イメージを変更せずに新しい権限のないユーザーでプロセスを開始することが不可能になる場合があります。

イメージタグ、特に`latest`タグを使用してイメージを参照することは避けてください。
タグの背後にあるイメージはレジストリで簡単に変更できます。
イメージマニフェストに固有の完全な`sha256`ダイジェストを使用することをお勧めします。
このポリシーは、[ImagePolicyWebhook](/ja/docs/reference/access-authn-authz/admission-controllers/#imagepolicywebhook)を介して適用できます。
イメージ署名は、デプロイ時に自動的に[アドミッションコントローラーで検証](/ja/docs/tasks/administer-cluster/verify-signed-artifacts/#verifying-image-signatures-with-admission-controller)して、信頼性と整合性を検証することもできます。

コンテナイメージをスキャンすると、重大な脆弱性がコンテナイメージと一緒にクラスターにデプロイされるのを防ぐことができます。
イメージスキャンは、コンテナイメージをクラスターにデプロイする前に完了する必要があり、通常はCI/CDパイプラインのデプロイプロセスの一部として行われます。
イメージスキャンの目的は、コンテナイメージ内の潜在的な脆弱性とその防止策に関する情報([共通脆弱性評価システム(CVSS)](https://www.first.org/cvss/)スコアなど)を取得することです。
イメージスキャンの結果をパイプラインのコンプライアンスルールと組み合わせると、適切にパッチが適用されたコンテナイメージのみが本番環境に導入されます。

## アドミッションコントローラー

- [ ] 適切なアドミッションコントローラーの選択を有効にしています。
- [ ] Podセキュリティポリシーは、Podセキュリティアドミッション、または/およびWebhookアドミッションコントローラーによって適用しています。
- [ ] アドミッションチェーンプラグインとWebhookを安全に構成しています。
アドミッションコントローラーは、クラスターのセキュリティの向上に役立ちます。
ただし、APIサーバーを拡張するため、アドミッションコントローラー自体にリスクが生じる可能性があり、[適切に保護する必要があります](/blog/2022/01/19/secure-your-admission-controllers-and-webhooks/)。

次のリストは、クラスターとアプリケーションのセキュリティ体制を強化するために検討できるアドミッションコントローラーをいくつか示しています。
このドキュメントの他の部分で参照される可能性のあるコントローラーも含まれています。

この最初のアドミッションコントローラーグループには、[デフォルトで有効](/ja/docs/reference/access-authn-authz/admission-controllers/#which-plugins-are-enabled-by-default)になっているプラグインがあります。
何をしているのかよくわからない場合は、有効のままにしておいてください:

[`CertificateApproval`](/ja/docs/reference/access-authn-authz/admission-controllers/#certificateapproval)
: 承認ユーザーが証明書要求を承認する権限を持っていることを確認するために、追加の承認チェックを実行します。

[`CertificateSigning`](/ja/docs/reference/access-authn-authz/admission-controllers/#certificatesigning)
: 署名ユーザーが証明書要求に署名する権限を持っていることを確認するために、追加の承認チェックを実行します。

[`CertificateSubjectRestriction`](/ja/docs/reference/access-authn-authz/admission-controllers/#certificatesubjectrestriction)
: `system:masters`の「グループ」(または「組織属性」)を指定するすべての証明書リクエストを拒否します。

[`LimitRanger`](/ja/docs/reference/access-authn-authz/admission-controllers/#limitranger)
: LimitRange API制約を適用します。

[`MutatingAdmissionWebhook`](/ja/docs/reference/access-authn-authz/admission-controllers/#mutatingadmissionwebhook)
: Webhookを介してカスタムコントローラーの使用を許可します。これらのコントローラーは、確認するリクエストを変更する場合があります。

[`PodSecurity`](/ja/docs/reference/access-authn-authz/admission-controllers/#Podsecurity)
: Podセキュリティポリシーの代替で、デプロイされたPodのセキュリティコンテキストを制限します。

[`ResourceQuota`](/ja/docs/reference/access-authn-authz/admission-controllers/#resourcequota)
: リソースの過剰使用を防ぐためにリソースクォータを適用します。

[`ValidatingAdmissionWebhook`](/ja/docs/reference/access-authn-authz/admission-controllers/#validatingadmissionwebhook)
: Webhookを介してカスタムコントローラーの使用を許可します。これらのコントローラーは、確認するリクエストを変更しません。

2番目のグループには、デフォルトでは有効になっていませんが、GAステータスであり、セキュリティ体制を向上させるために推奨されるプラグインが含まれます:

[`DenyServiceExternalIPs`](/ja/docs/reference/access-authn-authz/admission-controllers/#denyserviceexternalips)
: `Service.spec.externalIPs`フィールドの新規使用をすべて拒否します。
これは、[CVE-2020-8554: Man in the middle using LoadBalancer or ExternalIPs](https://github.com/kubernetes/kubernetes/issues/97076)の緩和策です。

[`NodeRestriction`](/ja/docs/reference/access-authn-authz/admission-controllers/#noderestriction)
: kubeletの権限を、所有するPod APIリソースまたは自身を表すノードAPIリソースのみを変更するように制限します。
また、kubeletが`node-restriction.kubernetes.io/`アノテーションを使用するのを防ぎます。このアノテーションは、kubeletの認証情報にアクセスできる攻撃者が、制御対象ノードへのPodの配置に影響を与えるために使用する可能性があります。

3番目のグループには、デフォルトでは有効になっていませんが、特定のユースケースで検討できるプラグインが含まれます:

[`AlwaysPullImages`](/ja/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)
: タグ付けされたイメージの最新バージョンの使用を強制し、デプロイヤーがイメージを使用する権限を持っていることを確認します。

[`ImagePolicyWebhook`](/ja/docs/reference/access-authn-authz/admission-controllers/#imagepolicywebhook)
: Webhookを通じてイメージの追加制御を強制できるようにします。

<!-- 4番目のグループには、デフォルトでは有効になっていないプラグインが含まれます。まだアルファ状態ですが、特定のユースケースで検討できます:

[`EventRateLimit`](/ja/docs/reference/access-authn-authz/admission-controllers/#eventratelimit)
: APIサーバーに新しいイベントを追加するレートを制限します。

[`PodNodeSelector`](/ja/docs/reference/access-authn-authz/admission-controllers/#Podnodeselector)
: Namespace内およびクラスター全体でノードセレクターを制御できます。

[`PodTolerationRestriction`](/ja/docs/reference/access-authn-authz/admission-controllers/#Podtolerationrestriction)
: Namespace内のPodに許可されるPodの許容範囲を制御できます。 -->

## 次のステップ

- [Pod作成による権限昇格](/ja/docs/reference/access-authn-authz/authorization/#privilege-escalation-via-Pod-creation)は、特定のアクセス制御リスクについて警告しますので、その脅威をどのように管理しているかを確認してください。
  - Kubernetes RBACを使用する場合は、認可に関する詳細について、[RBACのベストプラクティス](/ja/docs/concepts/security/rbac-good-practices/)をお読みください。
- 偶発的または悪意のあるアクセスからクラスターを保護する方法については、[クラスターのセキュリティ保護](/ja/docs/tasks/administer-cluster/securing-a-cluster/)を参照してください。
- マルチテナンシーに関する構成オプションの推奨事項とベストプラクティスについては、[クラスターマルチテナンシーガイド](/ja/docs/concepts/security/multi-tenancy/)を参照してください。
- Kubernetesクラスターの強化に関する補足リソースについては、[ブログ投稿「NSA/CISA Kubernetes 強化ガイダンスの詳細」](/blog/2021/10/05/nsa-cisa-kubernetes-hardening-guidance/#building-secure-container-images)を参照してください。
