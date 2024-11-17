---
title: セキュリティチェックリスト
description: >
  Kubernetes クラスタのセキュリティを確保するためのベースラインチェックリスト。
content_type: コンセプト
weight: 100
---

<!-- overview -->

このチェックリストは、各トピックについて、より包括的な文書へのリンクとともにガイダンスの基本的なリストを提供することを目的としています。
網羅的なものではなく、進化することを目的としています。

この文書の読み方、使い方について:

- トピックの順序は、優先順位を反映したものではありません。
- いくつかのチェックリスト項目は、各セクションのリストの下の段落に詳述されています。

{{< caution >}}
チェックリストだけでは、適切なセキュリティ体制を確立するのに**十分**ではありません。
適切なセキュリティ体制には継続的な注意と改善が必要ですが、チェックリストはセキュリティ対策に向けた終わりのない旅の第一歩となります。
このチェックリストの推奨事項の一部は、特定のセキュリティ ニーズに対して制限が厳しすぎたり、緩すぎたりする場合があります。
Kubernetes セキュリティは「万能」ではないため、チェックリストの各項目のメリットに基づいて評価する必要があります。
{{< /caution >}}

<!-- body -->

## 認証と認可

- [ ] `system:masters` グループはブートストラップ後のユーザー認証またはコンポーネント認証に使用していません。
- [ ] kube-controller-manager が `--use-service-account-credentials` を有効にして実行しています。
- [ ] ルート証明書は保護されています (オフライン CA または効果的なアクセス制御を備えた管理されたオンライン CA のいずれか)。
- [ ] 中間証明書とリーフ証明書の有効期限は、3 年以内です。
- [ ] 定期的なアクセス レビューのプロセスが存在し、レビューの間隔は 24 か月以内です。
- [ ] 認証と認可に関するガイダンスについては、[ロールベースのアクセス制御のベスト プラクティス](/docs/concepts/security/rbac-good-practices/) に従っています。

ブートストラップ後、ユーザーもコンポーネントも Kubernetes API に対して `system:masters` として認証しないでください。
同様に、すべての kube-controller-manager を `system:masters` として実行することは避けてください。
`system:masters` は管理者ユーザーではなく、ブレークグラス メカニズムとしてのみ使用してください。

## ネットワーク セキュリティ

- [ ] 使用中の CNI プラグインはネットワーク ポリシーをサポートしています。
- [ ] イングレスおよびエグレス ネットワーク ポリシーは、クラスター内のすべてのワークロードに適用しています。
- [ ] 各名前空間内のデフォルトのネットワーク ポリシーで、すべてのポッドを選択して拒否しています。
- [ ] 適切な場合、サービス メッシュを使用してクラスター内のすべての通信を暗号化しています。
- [ ] Kubernetes API、kubelet API、および etcd はインターネット上に公開していません。
- [ ] ワークロードからクラウド メタデータ API へのアクセスはフィルターしています。
- [ ] LoadBalancer および ExternalIPs の使用は制限しています。

多数の [コンテナ ネットワーク インターフェース (CNI) プラグイン](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/) は、ポッドが通信できるネットワーク リソースを制限する機能を提供します。
これは、ルールを定義するための名前空間リソースを提供する [ネットワーク ポリシー](/docs/concepts/services-networking/network-policies/) を通じて最も一般的に行われます。
各名前空間ですべての出力と入力をブロックし、すべてのポッドを選択するデフォルトのネットワーク ポリシーは、許可リスト アプローチを採用してワークロードが失われないようにするのに役立ちます。

すべての CNI プラグインが転送中の暗号化を提供するわけではありません。
選択したプラグインにこの機能がない場合、代替ソリューションとして、サービス メッシュを使用してその機能を提供することができます。

コントロール プレーンの etcd データストアには、アクセスを制限し、インターネット上で公開されないようにするコントロールが必要です。
さらに、安全に通信するために相互 TLS (mTLS) を使用する必要があります。
この認証局は etcd に固有のものである必要があります。

Kubernetes API サーバーへの外部インターネット アクセスは、API が公開されないように制限する必要があります。
多くのマネージド Kubernetes ディストリビューションは、デフォルトで API サーバーを公開しているため注意してください。
その後、要塞ホストを使用してサーバーにアクセスできます。

[kubelet](/docs/reference/command-line-tools-reference/kubelet/) API アクセスは制限し、公開しないようにする必要があります。
デフォルトの認証および承認設定は、`--config` フラグで構成ファイルが指定されていない場合は許可されています。

Kubernetes のホスティングにクラウド プロバイダーを使用する場合、ポッドからクラウド メタデータ API `169.254.169.254` へのアクセスも、
情報が漏洩する可能性があるため、必要でない場合は制限またはブロックする必要があります。

LoadBalancer および ExternalIPs の制限付き使用の詳細については
[CVE-2020-8554: LoadBalancer または ExternalIPs を使用した中間者攻撃](https://github.com/kubernetes/kubernetes/issues/97076)
および [DenyServiceExternalIPs アドミッション コントローラー](/docs/reference/access-authn-authz/admission-controllers/#denyserviceexternalips)
を参照してください。

## Pod セキュリティ

- [ ] ワークロードの `create`、`update`、`patch`、`delete` に対する RBAC 権限は、必要な場合にのみ付与しています。
- [ ] 適切な Pod セキュリティ標準ポリシーをすべての名前空間に強制適用しています。
- [ ] ワークロードのメモリ制限は、リクエストと同等またはそれ以下の制限で設定しています。
- [ ] 機密性の高いワークロードには CPU 制限を設定する場合があります。
- [ ] サポートするノードでは、Seccomp がプログラム用の適切な syscalls プロファイルで有効になっています。
- [ ] サポートするノードでは、AppArmor または SELinux がプログラム用の適切な syscalls プロファイルで有効になっています。

RBAC 認証は重要ですが、
[Pod のリソース](/docs/concepts/security/rbac-good-practices/#workload-creation)
(または Pod を管理する任意のリソース) に対する認証を行うほど細かく設定することはできません。
唯一の細分性は、リソース自体に対する API 動詞です。
たとえば Pod に対する `create` です。
追加の許可がなければ、これらのリソースを作成する権限によって、クラスターのスケジューリング可能なノードへの直接的な無制限のアクセスが許可されます。

[Pod セキュリティ標準](/docs/concepts/security/pod-security-standards/)
は、セキュリティに関して `PodSpec` でフィールドを設定する方法を制限する、特権、ベースライン、制限の 3 つの異なるポリシーを定義します。

標準では、デフォルトで有効になっている新しい [Pod セキュリティ](/docs/concepts/security/pod-security-admission/) 認証、
またはサードパーティの認証 Webhook を使用して、名前空間レベルで適用できます。
削除され置き換えられた PodSecurityPolicy アドミッションとは異なり、[Pod Security](/docs/concepts/security/pod-security-admission/)
アドミッションは、アドミッション Webhook や外部サービスと簡単に組み合わせることができることに注意してください。

Pod Security アドミッション `restricted` ポリシーは、
[Pod Security Standards](/docs/concepts/security/pod-security-standards/) セットの中で最も制限の厳しいポリシーで、
[複数のモードで動作可能](/docs/concepts/security/pod-security-admission/#pod-security-admission-labels-for-namespaces)、
`warn`、`audit`、または `enforce` を使用して、セキュリティのベスト プラクティスに従って、最も適切な
[セキュリティ コンテキスト](/docs/tasks/configure-pod-container/security-context/)を段階的に適用します。
ただし、特定のユースケースでは、事前定義されたセキュリティ標準に加えて、ポッドが持つ権限とアクセスを制限するために、
ポッドの[セキュリティ コンテキスト](/docs/tasks/configure-pod-container/security-context/)を個別に調査する必要があります。

[ポッド セキュリティ](/docs/concepts/security/pod-security-admission/)の実践的なチュートリアルについては、
ブログ投稿[Kubernetes 1.23: ポッド セキュリティがベータ版に移行](/blog/2021/12/09/pod-security-admission-beta/)を参照してください。

[メモリと CPU の制限](/docs/concepts/configuration/manage-resources-containers/)を設定して、ポッドがノードで消費できるメモリと CPU リソースを制限し、
悪意のあるワークロードや侵害されたワークロードによる潜在的な DoS 攻撃を防ぐ必要があります。
このようなポリシーは、アドミッション コントローラーによって適用できます。
CPU 制限により使用が制限されるため、自動スケーリング機能や効率性に意図しない影響が生じる可能性があります 
つまり、利用可能な CPU リソースでベストエフォートでプロセスを実行することです。

{{< /caution >}}
メモリ制限が要求を上回ると、ノード全体が OOM 問題にさらされる可能性があります。
{{< /caution >}}

### Seccomp の有効化
Seccomp はセキュア コンピューティング モードの略で、バージョン 2.6.12 以降の Linux カーネルの機能です。
プロセスの権限をサンドボックス化して、ユーザー空間からカーネルへの呼び出しを制限するために使用できます。
Kubernetes を使用すると、ノードにロードされた seccomp プロファイルを Pod とコンテナに自動的に適用できます。

Seccomp を使用すると、コンテナ内で利用可能な Linux カーネル syscall 攻撃対象領域を減らすことで、ワークロードのセキュリティを向上できます。
seccomp フィルター モードは、BPF を利用して、プロファイルという名前の特定の syscall の許可または拒否リストを作成します。

Kubernetes 1.27 以降、すべてのワークロードのデフォルトの seccomp プロファイルとして `RuntimeDefault` の使用を有効にできます。
このトピックに関する [セキュリティ チュートリアル](/docs/tutorials/security/seccomp/) が利用可能です。
さらに、[Kubernetes Security Profiles Operator](https://github.com/kubernetes-sigs/security-profiles-operator)は、クラスターでの seccomp の管理と使用を容易にするプロジェクトです。

{{< note >}}
seccomp は Linux ノードでのみ使用できます。
{{< /note >}}

### AppArmor または SELinux の有効化

#### AppArmor

[AppArmor](/docs/tutorials/security/apparmor/) は、強制アクセス制御 (MAC) を簡単に実装し、
システム ログを通じて監査を向上させることができる Linux カーネル セキュリティ モジュールです。
デフォルトの AppArmor プロファイルは、それをサポートするノードで強制されますが、カスタム プロファイルを構成することもできます。
seccomp と同様に、AppArmor もプロファイルを通じて構成されます。
各プロファイルは、許可されていないリソースへのアクセスをブロックする強制モードか、違反のみを報告する苦情モードで実行されます。 
AppArmor プロファイルは、コンテナごとに注釈付きで適用され、プロセスが適切な権限を取得できるようにします。

{{< note >}}
AppArmor は Linux ノードでのみ使用可能で、[一部の Linux ディストリビューション](https://gitlab.com/apparmor/apparmor/-/wikis/home#distributions-and-ports) で有効になっています。
{{< /note >}}

#### SELinux

[SELinux](https://github.com/SELinuxProject/selinux-notebook/blob/main/src/selinux_overview.md) も、強制アクセス制御 (MAC) などのアクセス制御セキュリティ ポリシーをサポートする Linux カーネル セキュリティ モジュールです。
SELinux ラベルは、コンテナまたはポッドに [`securityContext` セクションを介して](/docs/tasks/configure-pod-container/security-context/#assign-selinux-labels-to-a-container) 割り当てることができます。

{{< note >}}
SELinux は Linux ノードでのみ使用可能で、[一部の Linux ディストリビューション](https://en.wikipedia.org/wiki/Security-Enhanced_Linux#Implementations) で有効になっています。
{{< /note >}}

## ログと監査

- [ ] 監査ログを有効化して、一般アクセスから保護します。

## ポッドの配置

- [ ] ポッドの配置は、アプリケーションの機密性の階層に従って行います。
- [ ] 機密性の高いアプリケーションは、ノード上で分離して実行するか、特定のサンドボックス化されたランタイムで実行します。

アプリケーション ポッドと Kubernetes API サーバーなど、機密性の異なる層にあるポッドは、別々のノードにデプロイする必要があります。
ノード分離の目的は、アプリケーション コンテナのブレイクアウトを防ぎ、より機密性の高いアプリケーションへのアクセスを直接提供して、クラスター内で簡単にピボットできるようにすることです。
ポッドが誤って同じノードにデプロイされるのを防ぐために、この分離を実施する必要があります。
これは、次の機能を使用して実施できます。

[ノード セレクタ](/docs/concepts/scheduling-eviction/assign-pod-node/)
: ポッド仕様の一部として、デプロイするノードを指定するキーと値のペア。
これらは、[PodNodeSelector](/docs/reference/access-authn-authz/admission-controllers/#podnodeselector)アドミッション コントローラーを使用して、名前空間とクラスター レベルで実施できます。

[PodTolerationRestriction](/docs/reference/access-authn-authz/admission-controllers/#podtolerationrestriction)
: 管理者が名前空間内で許可された[tolerations](/docs/concepts/scheduling-eviction/taint-and-toleration/)を制限できるようにするアドミッション コントローラ。
名前空間内の Pod は、デフォルトおよび許可された一連の tolerations を提供する名前空間オブジェクト アノテーション キーで指定された tolerations のみを使用できます。

[RuntimeClass](/docs/concepts/containers/runtime-class/)
: RuntimeClass は、コンテナのランタイム構成を選択するための機能です。

コンテナのランタイム構成は、Pod のコンテナを実行するために使用され、パフォーマンス オーバーヘッドを犠牲にして、ホストからの分離を提供できます。

## Secrets

- [ ] ConfigMaps を機密データを保持するために使用していません。
- [ ] Secret API は保存時に暗号化をしています。
- [ ] 適切な場合、サードパーティのストレージに保存されているシークレットを挿入する仕組みを導入しており、使用可能です。
- [ ] サービス アカウント トークンは、それらを必要としないポッドにはマウントしません。
- [ ] [バインドされたサービス アカウント トークン ボリューム](/docs/reference/access-authn-authz/service-accounts-admin/#bound-service-account-token-volume)は、期限切れのないトークンの代わりに使用しています。

ポッドに必要なシークレットは、ConfigMap などの代替手段ではなく、Kubernetes Secrets 内に保存する必要があります。
etcd 内に保存されているシークレット リソースは、[保存時に暗号化](/docs/tasks/administer-cluster/encrypt-data/) する必要があります。

シークレットを必要とするポッドでは、ボリュームを介してシークレットが自動的にマウントされ、
できれば [`emptyDir.medium` オプション](/docs/concepts/storage/volumes/#emptydir) のようにメモリ内に保存される必要があります。
このメカニズムは、[Secrets Store CSI ドライバー](https://secrets-store-csi-driver.sigs.k8s.io/) などのボリュームとして
サードパーティのストレージからシークレットを挿入するためにも使用できます。
ポッドのサービス アカウントにシークレットへの RBAC アクセスを提供するよりも、これを優先的に行う必要があります。
これにより、シークレットを環境変数またはファイルとしてポッドに追加できるようになります。
環境変数メソッドは、ファイルの権限メカニズムとは異なり、ログのクラッシュ ダンプと Linux の環境変数の非機密性により、漏洩が発生しやすい可能性があることに注意してください。

サービス アカウント トークンは、それらを必要としないポッドにマウントしないでください。
これは、サービス アカウント内で [`automountServiceAccountToken`](/docs/tasks/configure-pod-container/configure-service-account/#use-the-default-service-account-to-access-the-api-server)を `false` に設定して、名前空間全体に適用するか、ポッドに固有の設定にすることで構成できます。
Kubernetes v1.22 以降では、時間制限のあるサービス アカウント認証情報には [バインドされたサービス アカウント](/docs/reference/access-authn-authz/service-accounts-admin/#bound-service-account-token-volume)を使用します。

## イメージ

- [ ] コンテナ イメージ内の不要なコンテンツは最小限に抑えています。
- [ ] コンテナ イメージは、権限のないユーザーとして実行されるように構成しています。
- [ ] コンテナ イメージへの参照は、sha256 ダイジェストによって行うか、もしくは、デプロイ時に [アドミッション コントロール経由](/docs/tasks/administer-cluster/verify-signed-artifacts/#verifying-image-signatures-with-admission-controller) でイメージのデジタル署名を検証しています。
- [ ] コンテナ イメージは、作成中およびデプロイ中に定期的にスキャンし、既知の脆弱なソフトウェアにはパッチを適用しています。

コンテナ イメージには、パッケージ化されたプログラムを実行するための最小限のものだけが含まれている必要があります。
できれば、プログラムとその依存関係のみで、最小限のベースからイメージを構築します。 
特に、本番環境で使用するイメージには、シェルやデバッグ ユーティリティを含めないでください。
[一時的なデバッグ コンテナ](/docs/tasks/debug/debug-application/debug-running-pod/#ephemeral-container) をトラブルシューティングに使用できます。

[Dockerfile の `USER` 命令](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#user) を使用して、権限のないユーザーで直接起動するイメージを構築します。
[セキュリティ コンテキスト](/docs/tasks/configure-pod-container/security-context/#set-the-security-context-for-a-pod)を使用すると、
イメージ マニフェストで指定されていない場合でも、`runAsUser` および `runAsGroup` を使用して特定のユーザーとグループでコンテナ イメージを開始できます。
ただし、イメージ レイヤーのファイル権限により、イメージを変更せずに新しい権限のないユーザーでプロセスを開始することが不可能になる場合があります。

イメージ タグ、特に `latest` タグを使用してイメージを参照することは避けてください。
タグの後ろにあるイメージはレジストリで簡単に変更できます。
イメージ マニフェストに固有の完全な `sha256` ダイジェストを使用することをお勧めします。
このポリシーは、[ImagePolicyWebhook](/docs/reference/access-authn-authz/admission-controllers/#imagepolicywebhook)を介して適用できます。
イメージ署名は、デプロイ時に [アドミッション コントローラで検証](/docs/tasks/administer-cluster/verify-signed-artifacts/#verifying-image-signatures-with-admission-controller) して、信頼性と整合性を検証することもできます。

コンテナ イメージをスキャンすると、重大な脆弱性がコンテナ イメージと一緒にクラスタにデプロイされるのを防ぐことができます。
イメージ スキャンは、コンテナ イメージをクラスタにデプロイする前に完了する必要があり、通常は CI/CD パイプラインのデプロイ プロセスの一部として行われます。
イメージ スキャンの目的は、コンテナ イメージ内の潜在的な脆弱性とその防止策に関する情報 ([共通脆弱性評価システム (CVSS)](https://www.first.org/cvss/) スコアなど) を取得することです。
イメージ スキャンの結果をパイプラインのコンプライアンス ルールと組み合わせると、適切にパッチが適用されたコンテナ イメージのみが本番環境に導入されます。

## アドミッション コントローラー

- [ ] 適切なアドミッション コントローラーの選択を有効にしています。
- [ ] ポッド セキュリティ ポリシーは、ポッド セキュリティ アドミッションまたは、ウェブフック アドミッション コントローラーによって適用しています。
- [ ] アドミッション チェーン プラグインとウェブフックを安全に構成しています。
アドミッション コントローラーは、クラスターのセキュリティの向上に役立ちます。
ただし、API サーバーを拡張するため、アドミッション コントローラー自体にリスクが生じる可能性があり、適切に保護する必要があります (/blog/2022/01/19/secure-your-admission-controllers-and-webhooks/)。

次のリストは、クラスターとアプリケーションのセキュリティ体制を強化するために検討できるアドミッション コントローラーをいくつか示しています。
このドキュメントの他の部分で参照される可能性のあるコントローラーも含まれています。

この最初のアドミッション コントローラ グループには、プラグインが含まれます
[デフォルトで有効](/docs/reference/access-authn-authz/admission-controllers/#which-plugins-are-enabled-by-default)
何をしているのかよくわからない場合は、有効のままにしておくことを検討してください:

[`CertificateApproval`](/docs/reference/access-authn-authz/admission-controllers/#certificateapproval)
: 承認ユーザーが証明書要求を承認する権限を持っていることを確認するために、追加の承認チェックを実行します。

[`CertificateSigning`](/docs/reference/access-authn-authz/admission-controllers/#certificatesigning)
: 署名ユーザーが証明書要求に署名する権限を持っていることを確認するために、追加の承認チェックを実行します。

[`CertificateSubjectRestriction`](/docs/reference/access-authn-authz/admission-controllers/#certificatesubjectrestriction)
: `system:masters` の「グループ」(または「組織属性」) を指定するすべての証明書リクエストを拒否します。

[`LimitRanger`](/docs/reference/access-authn-authz/admission-controllers/#limitranger)
: LimitRange API 制約を適用します。

[`MutatingAdmissionWebhook`](/docs/reference/access-authn-authz/admission-controllers/#mutatingadmissionwebhook)
: Webhook を介してカスタム コントローラーの使用を許可します。これらのコントローラーは、確認するリクエストを変更する場合があります。

[`PodSecurity`](/docs/reference/access-authn-authz/admission-controllers/#podsecurity)
: Pod セキュリティ ポリシーの代替で、デプロイされた Pod のセキュリティ コンテキストを制限します。

[`ResourceQuota`](/docs/reference/access-authn-authz/admission-controllers/#resourcequota)
: リソースの過剰使用を防ぐためにリソース クォータを適用します。

[`ValidatingAdmissionWebhook`](/docs/reference/access-authn-authz/admission-controllers/#validatingadmissionwebhook)
: Webhook を介してカスタム コントローラーの使用を許可します。これらのコントローラーは、レビューするリクエストを変更しません。

2 番目のグループには、デフォルトでは有効になっていないが、一般的な可用性状態ではセキュリティ体制を改善するために推奨されるプラグインが含まれます:

[`DenyServiceExternalIPs`](/docs/reference/access-authn-authz/admission-controllers/#denyserviceexternalips)
: `Service.spec.externalIPs` フィールドのまったく新しい使用をすべて拒否します。
これは、[CVE-2020-8554: LoadBalancer または ExternalIPs を使用した中間者攻撃](https://github.com/kubernetes/kubernetes/issues/97076) の緩和策です。

[`NodeRestriction`](/docs/reference/access-authn-authz/admission-controllers/#noderestriction)
: kubelet の権限を、所有するポッド API リソースまたは自身を表すノード API リソースのみを変更するように制限します。
また、kubelet が `node-restriction.kubernetes.io/` アノテーションを使用するのを防ぎます。これは、kubelet の認証情報にアクセスできる攻撃者が、制御対象ノードへのポッドの配置に影響を与えるために使用できます。

3 番目のグループには、デフォルトでは有効になっていませんが、特定のユースケースで検討できるプラグインが含まれます。

[`AlwaysPullImages`](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)
: タグ付けされたイメージの最新バージョンの使用を強制し、デプロイヤーがイメージを使用する権限を持っていることを確認します。

[`ImagePolicyWebhook`](/docs/reference/access-authn-authz/admission-controllers/#imagepolicywebhook)
: Webhook を通じてイメージの追加制御を強制できるようにします。

<!-- 4 番目のグループには、デフォルトでは有効になっていないプラグインが含まれます。まだアルファ状態ですが、特定のユースケースで検討できます。

[`EventRateLimit`](/docs/reference/access-authn-authz/admission-controllers/#eventratelimit)
: API サーバーに新しいイベントを追加するレートを制限します。

[`PodNodeSelector`](/docs/reference/access-authn-authz/admission-controllers/#podnodeselector)
: 名前空間内およびクラスター全体でノード セレクターを制御できます。

[`PodTolerationRestriction`](/docs/reference/access-authn-authz/admission-controllers/#podtolerationrestriction)
: 名前空間内のポッドに許可されるポッド許容を制御できます。 -->

## 次のステップ

- [Pod 作成による権限昇格](/docs/reference/access-authn-authz/authorization/#privilege-escalation-via-pod-creation)
は、特定のアクセス制御リスクについて警告しますので、その脅威をどのように管理しているかを確認してください。
- Kubernetes RBAC を使用する場合は、認可に関する詳細については、[RBAC のベスト プラクティス](/docs/concepts/security/rbac-good-practices/) をお読みください。
- 偶発的または悪意のあるアクセスからクラスターを保護する方法については、[クラスターのセキュリティ保護](/docs/tasks/administer-cluster/securing-a-cluster/) を参照してください。
- マルチテナンシーに関する構成オプションの推奨事項とベスト プラクティスについては、[クラスター マルチテナンシー ガイド](/docs/concepts/security/multi-tenancy/) を参照してください。
- Kubernetes クラスターの強化に関する補足リソースについては、[ブログ投稿「NSA/CISA Kubernetes 強化ガイダンスの詳細」](/blog/2021/10/05/nsa-cisa-kubernetes-hardening-guidance/#building-secure-container-images)を参照してください。
