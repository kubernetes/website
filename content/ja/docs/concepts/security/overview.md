---
reviewers:
title: クラウドネイティブセキュリティの概要
content_type: concept
weight: 1
---

<!-- overview -->

この概要では、クラウドネイティブセキュリティにおけるKubernetesのセキュリティを考えるためのモデルを定義します。

{{< warning >}}
コンテナセキュリティモデルは、実証済の情報セキュリティポリシーではなく提案を提供します。
{{< /warning >}}

<!-- body -->

## クラウドネイティブセキュリティの４C

セキュリティは階層で考えることができます。クラウドネイティブの4Cは、クラウド、クラスター、コンテナ、そしてコードです。

{{< note >}}
階層化されたアプローチは、セキュリティに対する[多層防御](https://en.wikipedia.org/wiki/Defense_in_depth_(computing))のアプローチを強化します。これはソフトウェアシステムを保護するベストプラクティスとして幅広く認知されています。
{{< /note >}}

{{< figure src="/images/docs/4c.png" title="クラウドネイティブセキュリティの４C" >}}

クラウドネイティブセキュリティモデルの各レイヤーは次の最も外側のレイヤー上に構築します。コードレイヤーは、強固な基盤(クラウド、クラスター、コンテナ)セキュリティレイヤーから恩恵を受けます。コードレベルのセキュリティに対応しても基盤レイヤーが低い水準のセキュリティでは守ることができません。

## クラウド

いろいろな意味でも、クラウド(または同じ場所に設置されたサーバー、企業のデータセンター)はKubernetesクラスターの[トラステッド・コンピューティング・ベース](https://en.wikipedia.org/wiki/Trusted_computing_base)です。クラウドレイヤーが脆弱な(または脆弱な方法で構成されている)場合、この基盤の上に構築されたコンポーネントが安全であるという保証はありません。各クラウドプロバイダーは、それぞれの環境でワークロードを安全に実行させるためのセキュリティの推奨事項を作成しています。

### クラウドプロバイダーのセキュリティ

Kubernetesクラスターを所有しているハードウェアや様々なクラウドプロバイダー上で実行している場合、セキュリティのベストプラクティスに関するドキュメントを参考にしてください。ここでは人気のあるクラウドプロバイダーのセキュリティドキュメントの一部のリンクを紹介します。

{{< table caption="Cloud provider security" >}}

IaaSプロバイダー        | リンク |
-------------------- | ------------ |
Alibaba Cloud | https://www.alibabacloud.com/trust-center |
Amazon Web Services | https://aws.amazon.com/security/ |
Google Cloud Platform | https://cloud.google.com/security/ |
Huawei Cloud | https://www.huaweicloud.com/intl/ja-jp/securecenter/overallsafety.html |
IBM Cloud | https://www.ibm.com/cloud/security |
Microsoft Azure | https://docs.microsoft.com/en-us/azure/security/azure-security |
Oracle Cloud Infrastructure | https://www.oracle.com/security/ |
VMWare VSphere | https://www.vmware.com/security/hardening-guides.html |

{{< /table >}}

### インフラのセキュリティ {#infrastructure-security}

Kubernetesクラスターのインフラを保護するための提案です。

{{< table caption="Infrastructure security" >}}

Kubernetesインフラに関する懸念事項 | 推奨事項 |
--------------------------------------------- | -------------- |
API Server(コントロールプレーン)へのネットワークアクセス| Kubernetesコントロールプレーンへのすべてのアクセスは、インターネット上での一般公開は許されず、クラスター管理に必要なIPアドレスに制限するネットワークアクセス制御リストによって制御されます。|
Nodeへのネットワークアクセス | Nodeはコントロールプレーンの特定ポート _のみ_ 接続(ネットワークアクセス制御リストを介して)を受け入れるよう設定し、NodePortとLoadBalancerタイプのKubernetesのServiceに関する接続を受け入れるよう設定する必要があります。可能であれば、それらのNodeはパブリックなインターネットに完全公開しないでください。|
KubernetesからのクラウドプロバイダーAPIへのアクセス | 各クラウドプロバイダーはKubernetesコントロールプレーンとNodeに異なる権限を与える必要があります。[最小権限の原則](https://en.wikipedia.org/wiki/Principle_of_least_privilege)に従い、管理に必要なリソースに対してクラウドプロバイダーへのアクセスをクラスターに提供するのが最善です。[Kopsドキュメント](https://github.com/kubernetes/kops/blob/master/docs/iam_roles.md#iam-roles)にはIAMのポリシーとロールについての情報が記載されています。|
etcdへのアクセス | etcd(Kubernetesのデータストア)へのアクセスはコントロールプレーンのみに制限すべきです。設定によっては、TLS経由でetcdを利用する必要があります。詳細な情報は[etcdドキュメント](https://github.com/etcd-io/etcd/tree/master/Documentation)を参照してください。|
etcdの暗号化 | 可能な限り、保存時に全ドライブを暗号化することは良いプラクティスですが、etcdはクラスター全体(Secretを含む)の状態を保持しているため、そのディスクは特に暗号化する必要があります。|

{{< /table >}}

## クラスター

Kubernetesを保護する為には２つの懸念事項があります。

* 設定可能なクラスターコンポーネントの保護
* クラスターで実行されるアプリケーションの保護

### クラスターのコンポーネント {#cluster-components}

想定外または悪意のあるアクセスからクラスターを保護して適切なプラクティスを採用したい場合、[クラスターの保護](/docs/tasks/administer-cluster/securing-a-cluster/)に関するアドバイスを読み従ってください。

### クラスター内のコンポーネント(アプリケーション) {#cluster-applications}

アプリケーションを対象にした攻撃に応じて、セキュリティの特定側面に焦点をあてたい場合があります。例:他のリソースとの連携で重要なサービス(サービスA)と、リソース枯渇攻撃に対して脆弱な別のワークロード(サービスB)が実行されている場合、サービスBのリソースを制限していないとサービスAが危険にさらされるリスクが高くなります。次の表はセキュリティの懸念事項とKubernetesで実行されるワークロードを保護するための推奨事項を示しています。


ワークロードセキュリティに関する懸念事項 | 推奨事項 |
------------------------------ | --------------------- |
RBAC認可(Kubernetes APIへのアクセス) | https://kubernetes.io/ja/docs/reference/access-authn-authz/rbac/
認証 | https://kubernetes.io/docs/concepts/security/controlling-access/ |
アプリケーションのSecret管理(およびetcdへの保存時に暗号化) | https://kubernetes.io/ja/docs/concepts/configuration/secret/ <br> https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/ |
PodSecurityPolicy | https://kubernetes.io/docs/concepts/policy/pod-security-policy/ |
Quality of Service (およびクラスターリソース管理) | https://kubernetes.io/ja/docs/tasks/configure-pod-container/quality-service-pod/ |
NetworkPolicy | https://kubernetes.io/ja/docs/concepts/services-networking/network-policies/ |
Kubernetes IngressのTLS | https://kubernetes.io/ja/docs/concepts/services-networking/ingress/#tls |


## コンテナ

コンテナセキュリティは本ガイドの範囲外になります。このトピックを検索するために一般的な推奨事項とリンクを以下に示します。

コンテナに関する懸念事項 | 推奨事項 |
------------------------------ | -------------- |
コンテナの脆弱性スキャンとOS依存のセキュリティ | イメージをビルドする手順の一部として、既知の脆弱性がないかコンテナをスキャンする必要があります。 |
イメージの署名と実施 | コンテナイメージを署名し、コンテナの中身に関する信頼性を維持します。 |
特権ユーザーを許可しない | コンテナの構成時に、コンテナの目的を実行するために必要最低限なOS特権を持ったユーザーをコンテナ内部に作成する方法のドキュメントを参考にしてください。 |

## コード

アプリケーションコードは、あなたが最も制御できる主要な攻撃対象のひとつです。アプリケーションコードを保護することはKubernetesのセキュリティトピックの範囲外ですが、アプリケーションコードを保護するための推奨事項を以下に示します。

### コードセキュリティ

{{< table caption="Code security" >}}

コードに関する懸念事項 | 推奨事項 |
-------------------------| -------------- |
TLS経由のアクセスのみ | コードがTCP通信を必要とする場合は、事前にクライアントとのTLSハンドシェイクを実行してください。 いくつかの例外を除いて、全ての通信を暗号化してください。さらに一歩すすめて、サービス間のネットワークトラフィックを暗号化することはよい考えです。これは、サービスを特定した2つの証明書で通信の両端を検証する相互認証、または[mTLS](https://en.wikipedia.org/wiki/Mutual_authentication)して知られているプロセスを通じて実行できます。|
通信ポートの範囲制限 | この推奨事項は一目瞭然かもしれませんが、可能なかぎり、通信とメトリクス収集に必要不可欠なサービスのポートのみを公開します。 |
サードパティに依存するセキュリティ | 既知の脆弱性についてアプリケーションのサードパーティ製ライブラリーを定期的にスキャンすることを推奨します。それぞれの言語は自動でこのチェックを実行するツールを持っています。 |
静的コード解析 | ほとんどの言語ではコードのスニペットを解析して、安全でない可能性のあるコーディングを分析する方法が提供しています。可能な限り、コードベースでスキャンして、よく起こるセキュリティエラーを検出できる自動ツールを使用してチェックを実行すべきです。一部のツールはここで紹介されています。 https://owasp.org/www-community/Source_Code_Analysis_Tools |
動的プロービング攻撃 | よく知られているいくつかのサービス攻撃をサービスに対して試すことができる自動ツールがいくつかあります。これにはSQLインジェクション、CSRF、そしてXSSが含まれます。よく知られている動的解析ツールは[OWASP Zed Attack proxy](https://www.zaproxy.org/)toolです。 |

{{< /table >}}

## {{% heading "whatsnext" %}}

関連するKubernetesセキュリティについて学びます。

* [Podセキュリティの標準](/ja/docs/concepts/security/pod-security-standards/)
* [Podのネットワークポリシー](/ja/docs/concepts/services-networking/network-policies/)
* [Kubernetes APIへのアクセスを制御する](/docs/concepts/security/controlling-access)
* [クラスターの保護](/docs/tasks/administer-cluster/securing-a-cluster/)
* コントロールプレーンとの[通信時のデータ暗号化](/docs/tasks/tls/managing-tls-in-a-cluster/)
* [保存時のデータ暗号化](/docs/tasks/administer-cluster/encrypt-data/)
* [Kubernetes Secret](/ja/docs/concepts/configuration/secret/)
