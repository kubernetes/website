---
title: "プロダクション環境"
description: プロダクション品質のKubernetesクラスターを作成します。
weight: 30
no_list: true
---
<!-- overview -->

プロダクション環境向けのKubernetesクラスターには計画と準備が必要です。Kubernetesクラスターが重要なワークロードを動かしている場合、耐障害性のある構成にしなければいけません。このページはプロダクション環境で利用できるクラウターのセットアップをするための手順や既存のクラスターをプロダクション環境で利用できるように昇格するための手順を説明します。
既にプロダクション環境のセットアップを理解している場合、[次の項目](#what-s-next)に進んでください。

<!-- body -->

## プロダクション環境の考慮事項

通常、プロダクション用のKubernetesクラスター環境は個人学習の環境や開発環境、テスト環境より多くの要件があります。プロダクション環境は多くのユーザーによるセキュアなアクセスや安定した可用性、変化する需要に適用するためのリソースが必要になる場合があります。

プロダクション用のKubernetes環境をどこに配置するか(オンプレミスまたはクラウド)、どの程度の管理を自分で行うか、それとも他に任せるかを決定する際には、以下の問題がKubernetesクラスターに対する要件にどのように影響を与えるかを考慮してください。

- *可用性*: 単一のマシンで動作するKubernetes[学習環境](/ja/docs/setup/#learning-environment)には単一障害点があります。高可用性のクラスターの作成するには下記の点を考慮する必要があります。
    - ワーカーノードからのコントロールプレーンの分離
    - 複数ノードへのコントロールプレーンのレプリケーション
    - クラスターの{{< glossary_tooltip term_id="kube-apiserver" text="APIサーバー" >}}へのトラフィックの負荷分散
    - 変化するワークロードに応じて、十分な数のワーカーノードが利用可能であること、または迅速に利用可能になること

- *スケール*: プロダクション用のKubernetes環境が安定した要求を受けることが予測できる場合、必要なキャパシティをセットアップすることができるかもしれません。しかし、時間の経過と共に成長する需要やシーズンや特別なイベントのようなことで大幅な変化を予測する場合、コントロールプレーンやワーカーノードへの多くのリクエストにより増加する負荷を軽減するスケールの方法や未使用のリソースを削減するためのスケールダウンの方法を計画する必要があリます。

- *セキュリティやアクセス管理*: 自身のKubernetes学習クラスターでは全管理者権限を持っています。しかし、重要なワークロードを保持していたり、複数のユーザーが利用する共有クラスターでは、誰がどのクラスターのリソースに対してアクセスできるかをより制限されたアプローチを必要とします。ユーザーやワークロードが必要なリソースへアクセスできることを実現するロールベースアクセス制御([RBAC](/ja/docs/reference/access-authn-authz/rbac/))や他のセキュリティメカニズムを使用し、ワークロードやクラスターを保護することができます。[ポリシー](/docs/concepts/policy/)や[コンテナリソース](/ja/docs/concepts/configuration/manage-resources-containers/)を管理することによってユーザーやワークロードがアクセスできるリソースの制限を設定できます。

自身のプロダクション環境のKubernetesを構築する前に、[ターンキークラウドソリューション](/ja/docs/setup/production-environment/turnkey-solutions/)や
プロバイダーや他の[Kubernetesパートナー](/ja/partners/)へ仕事の一部や全てを委託することを考えてください。オプションには次のものが含まれます。

- *サーバーレス*: クラスターを全く管理せずに第三者の設備上でワークロードを実行します。CPU使用量やメモリ、ディスクリクエストなどの利用に応じて課金します。
- *マネージドコントロールプレーン*: クラスターのコントロールプレーンのスケールと可用性やパッチとアップグレードの実行をプロバイダーに管理してもらいます。
- *マネージドワーカーノード*: 需要に合わせてノードのプールを構成し、プロバイダーがワーカーノードが利用可能であることを保証し、需要に応じたアップグレードを実施できるようにします。
-  *統合*: ストレージ、コンテナレジストリ、認証方法、開発ツールなどの他の必要なサービスとKubernetesを統合するプロバイダーも存在します。

プロダクション用のKubernetesクラスターを自身で構築する場合でもパートナーと連携する場合でもクラスターの*コントロールプレーン*、*ワーカーノード*、*ユーザーアクセス*、および*ワークロードリソース*に関連する要件を評価するために以下のセクションのレビューを行なってください。

## プロダクション環境のクラスターのセットアップ

プロダクション環境向けのKubernetesクラスターでは、コントロールプレーンが異なる方法で複数のコンピューターに分散されたサービスからクラスターを管理します。一方で、各ワーカーノードは単一のエンティティとして表され、KubernetesのPodを実行するように設定されています。

### プロダクション環境のコントロールプレーン

最もシンプルなKubernetesクラスターはすべてのコントロールプレーンとワーカーノードサービスが同一のマシン上で稼働しています。[Kubernetesコンポーネント](/ja/docs/concepts/overview/components/)の図に示すようにワーカーノードの追加によって環境をスケールさせることができます。クラスターが短時間の稼働や深刻な問題が起きたときに破棄してもよい場合は、同一マシン上での構成で要件を満たしているかもしれません。

永続性や高可用性のクラスターが必要であれば、コントロールプレーンの拡張方法を考えなければいけません。設計上、単一のマシンで動作するコントロールプレーンサービスは高可用性ではありません。クラスターを常に稼働させ、何か問題が発生した場合に修復できる保証が重要な場合は、以下のステップを考えてください。

- *デプロイツールの選択*: kubeadm、kopsやkubesprayなどのツールを使ってコントロールプレーンをデプロイできます。これらのデプロイメント方法を使用したプロダクション環境向けののデプロイのヒントを学ぶために[デプロイツールによるKubernetesのインストール](/ja/docs/setup/production-environment/tools/)をご覧になってください。異なる[コンテナランタイム](/ja/docs/setup/production-environment/container-runtimes/)をデプロイに使用することができます。
- *証明書の管理*: コントロールプレーンサービス間の安全な通信は証明書を使用して実装されています。証明書はデプロイ時に自動で生成したり、独自の認証局を使用し生成することができます。詳細は[PKI証明書と要件](/ja/docs/setup/best-practices/certificates/)をご覧ください。
- *APIサーバー用のロードバランサーの構成*: 外部からのAPIリクエストを異なるノード上で稼働しているAPIサーバーサービスインスタンスに分散させるためにロードバランサーを設定します。詳細は [外部ロードバランサーの作成](/docs/tasks/access-application-cluster/create-external-load-balancer/)をご覧ください。
- *etcdサービスの分離とバックアップ*: etcdサービスは他のコントロールプレーンサービスと同じマシン上で動作させることも、追加のセキュリティと可用性のために別のマシン上で動作させることもできます。etcdはクラスターの構成データを格納しており、必要に応じてデータベースを修復できるようにするためにetcdデータベースのバックアップは定期的に行うべきです。etcdの構成と使用に関する詳細は[etcd FAQ](https://etcd.io/docs/v3.5/faq/)をご覧ください。また、[Kubernetes向けのetcdクラスターの運用](/ja/docs/tasks/administer-cluster/configure-upgrade-etcd/)と[kubeadmを使用した高可用性etcdクラスターのセットアップ](/ja/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/)もご覧ください。
- *複数のコントロールプレーンシステムの作成*: 高可用性のためにコントロールプレーンは単一のマシンに限定されるべきではありません。コントロールプレーンサービスはinitサービス（systemdなど）によって実行される場合、各サービスは少なくとも3台のマシンで実行されるべきです。しかし、Kubernetes内でPodとしてコントロールプレーンサービスを実行することで、リクエストしたサービスのレプリカ数が常に利用可能であることが保証されます。スケジューラーは耐障害性が備わっているべきですが、高可用性は必要ありません。一部のデプロイメントツールはKubernetesサービスのリーダー選出のために[Raft](https://raft.github.io/)コンセンサスアルゴリズムを設定しています。プライマリが失われた場合、別のサービスが自らを選出して引き継ぎます。
- *複数ゾーンへの配置*: クラスターを常に利用可能に保つことが重要である場合、複数のデータセンターにまたがって実行されるクラスターを作成することを検討してください。クラウド環境ではゾーンと呼ばれます。ゾーンのグループはリージョンと呼ばれます。同リージョンで複数のゾーンにクラスターを分散させることで、一つのゾーンが利用不可能になったとしても、クラスタが機能し続ける可能性を向上できます。詳細は、[複数ゾーンでの稼働](/ja/docs/setup/best-practices/multiple-zones/)をご覧ください。
- *継続的な機能の管理*: クラスターを長期間稼働する計画がある場合、正常性とセキュリティを維持するために行うべきタスクがあります。例えば、kubeadmを使用してインストールした場合、[証明書管理](/ja/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/)や[kubeadmによるクラスターのアップグレード](s/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)を支援するドキュメントがあります。より多くのKubernetes管理タスクのリストについては、[クラスターの管理](/ja/docs/tasks/administer-cluster/)をご覧ください。

コントロールプレーンサービスを実行する際の利用可能なオプションについて学ぶためには、[kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/)、[kube-controller-manager](/docs/reference/command-line-tools-reference/kube-controller-manager/)、[kube-scheduler](/docs/reference/command-line-tools-reference/kube-scheduler/)のコンポーネントページをご覧ください。高可用性のコントロールプレーンの例については、[高可用性トポロジーのオプション](/ja/docs/setup/production-environment/tools/kubeadm/ha-topology/)、[kubeadmを使用した高可用性クラスターの作成](/ja/docs/setup/production-environment/tools/kubeadm/high-availability/)、[Kubernetes向けetcdクラスターの運用](/ja/docs/tasks/administer-cluster/configure-upgrade-etcd/)をご覧ください。etcdクラスターのバックアップ計画の作成については、[etcdクラスターのバックアップ](/ja/docs/tasks/administer-cluster/configure-upgrade-etcd/#backing-up-an-etcd-cluster)をご覧ください。

### プロダクション環境のワーカーノード

プロダクション向けのワークロードとそのワークロードが依存するサービス(CoreDNSなど)は耐障害性を必要とします。自身でコントロールプレーンを管理するか、クラウドプロバイダーに任せるかに関わらず、ワーカーノード(単にノードとも呼ばれます)の管理方法を考える必要があります。

- *ノードの構成*: ノードは物理マシンもしくは仮想マシンになります。ノードを自身で作成し管理したい場合、サポートされてるオペレーティングシステムをインストールし、適切な[ノードサービス](/ja/docs/concepts/overview/components/#node-components)を追加し、実行します。

    - ノードをセットアップする際に、ワークロードの需要に合わせた適切なメモリ、CPU、ディスク速度、ストレージ容量を確保することを考えること
    - 汎用コンピュータシステムで十分か、GPUプロセッサやWindowsノード、VMの分離を必要とするワークロードがあるかどうかを考えること
- *ノードの検証*: ノードがKubernetesクラスターに参加するための要件を満たしていることを保証する方法についての情報は[有効なノードのセットアップ](/ja/docs/setup/best-practices/node-conformance/)をご覧ください。
- *クラスターへのノードの追加*: 自身でクラスターを管理している場合、自身のマシンをセットアップし手動で追加するか、または自動でクラスターのAPIサーバーに登録させることによってノードを追加できます。これらのKubernetesへノードを追加するためのセットアップ方法については、[ノード](/ja/docs/concepts/architecture/nodes/)セクションをご覧ください。
- *ノードのスケール*: クラスターのキャパシティの拡張プランを作成することは最終的に必要になります。稼働させなければいけないPod数やコンテナ数を基にどのくらいのノード数が必要なのかを決定をするための助けとなる[大規模クラスターの考慮事項](/ja/docs/setup/best-practices/cluster-large/)をご覧ください。自身でノードを管理する場合、自身で物理機材を購入し設置することを意味します。
- *ノードのオートスケーリング*: ノードやノードが提供するキャパシティを自動的に管理するために利用できるツールについて学ぶために、[クラスターのオートスケーリング](/ja/docs/concepts/cluster-administration/cluster-autoscaling)をご覧ください。
- *ノードのヘルスチェックのセットアップ*: 重要なワークロードのためにノード上で稼働しているノードとPodが正常であることを確認しなければいけません。[Node Problem Detector](/ja/docs/tasks/debug/debug-cluster/monitor-node-health/)デーモンを使用し、ノードが正常であることを保証してください。

## プロダクション環境のユーザー管理

プロダクション環境では、自身または少人数の小さなグループがクラスターにアクセスするモデルから、数十人から数百人がアクセスする可能性のあるモデルへと移行するかもしれません。学習環境やプラットフォームのプロトタイプでは、すべての作業を行うための1つの管理アカウントを持っているかもしれません。プロダクション環境では、異なる名前空間へのアクセスレベルが異なる複数のアカウントを持つことになリます。

プロダクション環境向けのクラスターを運用することは、他のユーザーによるアクセスを選択的に許可する方法を決定することを意味します。特に、クラスターにアクセスをしようとするユーザーの身元を検証するための戦略を選択し(認証)、ユーザーが要求する操作に対して権限があるかどうかを決定する必要があります(認可)。:

- *認証*: APIサーバーはクライアント証明書、bearerトークン、認証プロキシまたはHTTPベーシック認証を使用し、ユーザーを認証できます。使用したい認証の方法を選択できます。プラグインを使用することで、APIサーバーはLDAPやKerberosなどの組織の既存の認証方法を活用できます。Kubernetesユーザーを認証する様々な方法の説明は[認証](/ja/docs/reference/access-authn-authz/authentication/)をご覧ください。
- *認可*: 通常のユーザーを認可する際には、おそらくRBACとABACの認可方法のどちらかを選択することになります。様々なユーザーアカウントの認可方式(およびサービスアカウントによるクラスターがアクセスするための認可方式)を評価するために、[認可の概要](/docs/reference/access-authn-authz/authorization/)をご覧ください。
- *ロールベースアクセスコントロール*: ([RBAC](/ja/docs/reference/access-authn-authz/rbac/)): 認証されたユーザーに特定の権限のセットを許可することによってクラスターへのアクセスを割り当てることができます。特定のNamespace(Role)やクラスター全体(ClusterRole)に権限を割り当てることができます。RoleBindingsやClusterRoleBindingsを使用することによって、権限を特定のユーザーに付与することができます。
- *属性ベースアクセスコントロール* ([ABAC](/ja/docs/reference/access-authn-authz/abac/)): クラスターのリソース属性に基づいたポリシーを作成し、その属性に基づいてアクセスを許可または拒否することができます。ポリシーファイルの各行は、バージョニングプロパティ(apiVersionとkind)やsubject(ユーザーやグループ)に紐づくプロパティとリソースに紐づくプロパティとリソースに紐づかないプロパティ(/version or /apis)と読み取り専用プロパティを持つmapのspecプロパティを特定します。詳細は、[Examples](/docs/reference/access-authn-authz/abac/#examples)をご覧ください。

プロダクション用のKubernetesクラスターの認証認可をセットアップするにあたって、いくつかの考慮事項があります。

- *認証モードの設定*: Kubermetes APIサーバー ([kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/))の起動時に、*--authorization-mode*フラグを使用しサポートされた認証モードを設定しなければいけません。例えば、*/etc/kubernetes/manifests*配下の*kube-adminserver.yaml*ファイルで*--authorization-mode*フラグにNodeやRBACを設定することで、認証されたリクエストに対してノードやRBACの認証を許可することができます。
- *ユーザー証明書とロールバインディングの作成(RMAC)*: RBAC認証を使用している場合、ユーザーはクラスター証明機関により署名された証明書署名要求(CSR)を作成でき、各ユーザーにRolesとClusterRolesをバインドすることができます。詳細は[証明書署名要求](/docs/reference/access-authn-authz/certificate-signing-requests/)をご覧ください。
- *属性を組み合わせたポリシーの作成(ABAC)*: ABAC認証を使用している場合、特定のリソース（例えばPod）、Namespace、またはAPIグループにアクセスするために、選択されたユーザーやグループに属性の組み合わせで形成されたポリシーを割り当てることができます。より多くの情報は[Examples](/docs/reference/access-authn-authz/abac/#examples)をご覧ください。
- *アドミッションコントローラーの考慮事項*: APIサーバーを経由してくるリクエストのための追加の認証形式に[Webhookトークン認証](/ja/docs/reference/access-authn-authz/authentication/#webhook-token-authentication)があります。Webhookや他の特別な認証形式はAPIサーバーへアドミッションコントローラーを追加し有効化される必要があります。

## ワークロードリソースの制限の設定

プロダクションワークロードからの要求はKubernetesのコントロールプレーンの内外の両方で負荷が生じる原因になります。クラスターのワークロードの需要に合わせて設定するためには、次の項目を考慮してください。

- *Namespaceの制限の設定*: メモリやCPUなどの項目のクォートをNamespaceごとに設定します。詳細については、[メモリー、CPU、APIリソースの管理](/ja/docs/tasks/administer-cluster/manage-resources/)をご覧ください。制限を継承するために[階層型Namespace](/blog/2020/08/14/introducing-hierarchical-namespaces/)を設定することもできます。
- *DNS要求のための準備*: ワークロードの急激なスケールアップを予測するのであれば、DNSサービスもスケールアップする準備をする必要があります。詳細については、[クラスター内のDNSサービスのオートスケール](/docs/tasks/administer-cluster/dns-horizontal-autoscaling/)をご覧ください。
- *追加のサービスアカウントの作成*: ユーザーアカウントはクラスターで何ができるかを決定し、サービスアカウントは特定のNamespace内でのPodへのアクセスを定義します。
デフォルトでは、Podは名前空間のデフォルトのサービスアカウントを引き受けます。新規のサービスアカウントの作成についての情報は[サービスアカウントの管理](/docs/reference/access-authn-authz/service-accounts-admin/)をご覧ください。例えば、以下のようなことが考えられます：
    - Podが特定のコンテナレジストリからイメージをプルするためのシークレットを追加する。例は[Podのためのサービスアカウントの構成](/docs/tasks/configure-Pod-container/configure-service-account/)についてご覧ください。
    - サービスアカウントへRBAC権限を割り当てる。詳細は[サービスアカウントの権限](/ja/docs/reference/access-authn-authz/rbac/#service-account-permissions)をご覧ください。

## {{% heading "whatsnext" %}}

- プロダクション環境のKubernetesを自身で構築するか、[ターンキークラウドソリューション](/ja/docs/setup/production-environment/turnkey-solutions/)や[Kubernetesパートナー](/ja/partners/)から取得するかを決定する
- 自身で構築することを選んだ場合、[証明書](/ja/docs/setup/best-practices/certificates/)の管理方法を計画し、[etcd](/ja/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/)や[APIサーバー](/docs/setup/production-environment/tools/kubeadm/ha-topology/)などの機能のための高可用性をセットアップする
- [kubeadm](/ja/docs/setup/production-environment/tools/kubeadm/)、[kops](https://kops.sigs.k8s.io/)、[Kubespray](https://kubespray.io/)からデプロイメント方法を選択する
- [認証](/ja/docs/reference/access-authn-authz/authentication/)と
  [認可](/docs/reference/access-authn-authz/authorization/)の方法を決定し、ユーザー管理を構成する
- [リソース制限](/ja/docs/tasks/administer-cluster/manage-resources/)や[DNSオートスケーリング](/docs/tasks/administer-cluster/dns-horizontal-autoscaling/)や[サービスアカウント](/docs/reference/access-authn-authz/service-accounts-admin/)のセットアップによってアプリケーションのワークロードのための準備をする
