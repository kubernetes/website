---
title: "クラウドネイティブセキュリティとKubernetes"
linkTitle: "クラウドネイティブセキュリティ"
weight: 10

# The section index lists this explicitly
hide_summary: true

description: >
  クラウドネイティブワークロードを安全に保つためのコンセプト。
---

Kubernetesはクラウドネイティブアーキテクチャに基づいており、クラウドネイティブ情報セキュリティのグッドプラクティスに関するアドバイスを{{< glossary_tooltip text="CNCF" term_id="cncf" >}}から受けています。

このページを読み進めることで、安全なクラウドネイティブプラットフォームをデプロイするためにKubernetesがどのように設計されているかについての概要を知ることができます。

## クラウドネイティブ情報セキュリティ

{{< comment >}}
このホワイトペーパーにはローカライズされたバージョンがあります。
ローカライズする際に、そのうち1つをリンクすることができれば、さらに良いでしょう。
{{< /comment >}}

クラウドネイティブセキュリティに関するCNCF[ホワイトペーパー](https://github.com/cncf/tag-security/blob/main/community/resources/security-whitepaper/v2/CNCF_cloud-native-security-whitepaper-May2022-v2.pdf)では、さまざまな _ライフサイクルフェーズ_ に適したセキュリティコントロールとプラクティスが定義されています。

## _Develop_ ライフサイクルフェーズ {#lifecycle-phase-develop}

- 開発環境の整合性を確保します。
- 状況に応じて、情報セキュリティのグッドプラクティスに沿ったアプリケーションを設計します。
- エンドユーザーのセキュリティをソリューション設計の一部として考慮します。

これを実現するためには、次のようなことができます:

1. 内部の脅威であっても、攻撃対象となる範囲を最小限に抑える[ゼロトラスト](https://glossary.cncf.io/ja/zero-trust-architecture/)のようなアーキテクチャを採用します。
1. セキュリティの懸念を考慮したコードレビュープロセスを定義します。
1. システムまたはアプリケーションの _脅威モデル_ を作成し、信頼境界を特定します。
   そのモデルを使用してリスクを特定し、それらのリスクに対処する方法を見つけるのに役立てます。
1. _ファジング_ や[セキュリティカオスエンジニアリング](https://glossary.cncf.io/ja/security-chaos-engineering/)のような高度なセキュリティ自動化を組み込みます。

## _Distribute_ ライフサイクルフェーズ {#lifecycle-phase-distribute}

- 実行するコンテナイメージのサプライチェーンのセキュリティを確保します。
- クラスターとその他のコンポーネントがアプリケーションを実行するためのサプライチェーンのセキュリティを確保します。
  他のコンポーネントの例としては、クラウドネイティブアプリケーションが永続性のために使用する外部データベースがあります。

これを実現するためには、次のようなことができます:

1. 既知の脆弱性を持つコンテナイメージやその他のアーティファクトをスキャンします。
1. ソフトウェアのディストリビューションが、ソフトウェアのソースに対するトラストチェーンを使用して、転送中の暗号化を行うようにします。
1. 利用可能になった更新に対応するための依存関係の更新プロセスを採用し、それに従います。
1. サプライチェーンを保証するために、デジタル証明書などの検証メカニズムを使用します。
1. セキュリティリスクを通知するためのフィードや他のメカニズムにサブスクライブします。
1. アーティファクトへのアクセスを制限します。
   コンテナイメージを[プライベートレジストリ](/ja/docs/concepts/containers/images/#using-a-private-registry)に配置し、認証されたクライアントのみがイメージを取得できるようにします。

## _Deploy_ ライフサイクルフェーズ {#lifecycle-phase-deploy}

何をデプロイできるか、誰がデプロイできるか、どこにデプロイできるかに関する適切な制限を確保します。
コンテナイメージアーティファクトの暗号化されたアイデンティティを検証するなど、_Distribute_ フェーズからの対策を適用できます。

Kubernetesをデプロイすると、アプリケーションのランタイム環境の基盤、つまりKubernetesクラスター(または複数のクラスター)も設定されます。
ITインフラストラクチャは、より高いレイヤーが期待するセキュリティ保証を提供する必要があります。

## _Runtime_ ライフサイクルフェーズ {#lifecycle-phase-runtime}

Runtimeフェーズは、[コンピューティング](#protection-runtime-compute)、[アクセス](#protection-runtime-access)、および[ストレージ](#protection-runtime-storage)の3つの重要な領域から構成されます。

### Runtime保護: アクセス {#protection-runtime-access}

Kubernetes APIはクラスターを機能させるためのものです。
このAPIを保護することは、効果的なクラスターセキュリティを提供するための鍵となります。

Kubernetesドキュメント内の他のページでは、アクセスコントロールの特定の側面を設定する方法について詳しく説明しています。
[セキュリティチェックリスト](/docs/concepts/security/security-checklist/)には、クラスターの基本的なチェックを行うための提案が記載されています。

さらに、APIアクセスのための効果的な[認証](/ja/docs/concepts/security/controlling-access/#authentication)と[認可](/ja/docs/concepts/security/controlling-access/#authorization)を実装することがクラスターのセキュリティを確保することにつながります。
[サービスアカウント](/ja/docs/concepts/security/service-accounts/)を使用して、ワークロードとクラスターコンポーネントのセキュリティアイデンティティを提供および管理します。

KubernetesはTLSを使用してAPIトラフィックを保護します。
(ノードとコントロールプレーン間のトラフィックを含めて)TLSを使用してクラスターをデプロイし、暗号化キーを保護してください。
[CertificateSigningRequests](/docs/reference/access-authn-authz/certificate-signing-requests/#certificate-signing-requests)にKubernetes独自のAPIを使用する場合は、その悪用を制限するために特に注意を払ってください。

### Runtime保護: コンピューティング {#protection-runtime-compute}

{{< glossary_tooltip text="コンテナ" term_id="container" >}}は、異なるアプリケーション間の分離と、それらの分離されたアプリケーションを同じホストコンピューターで実行するメカニズムの2つを提供します。
これらの2つの側面、分離と集約は、ランタイムセキュリティとのトレードオフがあり、適切なバランスを見つける必要があることを意味します。

Kubernetesは実際にコンテナを設定して実行するために{{< glossary_tooltip text="コンテナランタイム" term_id="container-runtime" >}}に依存しています。
Kubernetesプロジェクトは特定のコンテナランタイムを推奨しておらず、選択したランタイムが情報セキュリティの要件を満たしていることを確認する必要があります。

ランタイムでコンピューティングを保護するために、次のことができます:

1. アプリケーションの[Podのセキュリティ標準](/ja/docs/concepts/security/pod-security-standards/)を強制することで、アプリケーションが必要な権限のみで実行されるようにします。
1. コンテナ化されたワークロードを実行するために、特別に設計されたオペレーティングシステムをノード上で実行します。
   これは通常、コンテナの実行に不可欠なサービスのみを提供する読み取り専用オペレーティングシステム(_イミュータブルイメージ_)に基づいています。

   コンテナ固有のオペレーティングシステムは、システムコンポーネントを分離し、コンテナエスケープが発生した際の攻撃対象領域を減らすのに役立ちます。
1. [ResourceQuotas](/ja/docs/concepts/policy/resource-quotas/)を定義して、共有リソースを公平に割り当て、Podがリソース要件を指定できるようにするために[LimitRanges](/ja/docs/concepts/policy/limit-range/)などのメカニズムを使用します。
1. 異なるノード間でワークロードを分割します。
   Kubernetes自体またはエコシステムのいずれかから[ノードの分離](/ja/docs/concepts/scheduling-eviction/assign-pod-node/#node-isolation-restriction)メカニズムを使用して、異なる信頼コンテキストのPodが別個のノードセットで実行されるようにします。
1. セキュリティ制約を提供する{{< glossary_tooltip text="コンテナランタイム" term_id="container-runtime" >}}を使用します。
1. Linuxノードでは、[AppArmor](/docs/tutorials/security/apparmor/)や[seccomp](/docs/tutorials/security/seccomp/)などのLinuxセキュリティモジュールを使用します。

### Runtime保護: ストレージ {#protection-runtime-storage}

クラスターのストレージとそこで実行されるアプリケーションの保護のために、次のことができます:

1. クラスターを、ボリューム保存時の暗号化を提供する外部ストレージプラグインと統合します。
1. APIオブジェクトの[保存時の暗号化](/docs/tasks/administer-cluster/encrypt-data/)を有効にします。
1. バックアップを使用してデータの耐久性を保護します。
   必要に応じていつでもこれらを復元できることを確認します。
1. クラスターノードとそれが依存するネットワークストレージ間の接続を認証します。
1. 自分自身のアプリケーション内でデータ暗号化を実装します。

暗号化キーについては、専用のハードウェア内で生成することで、漏洩リスクに対する最善の保護を提供します。
_ハードウェアセキュリティモジュール_ を使用すると、セキュリティキーを他の場所にコピーすることなく暗号化操作を実施できます。

### ネットワークとセキュリティ

[ネットワークポリシー](/ja/docs/concepts/services-networking/network-policies/)や[サービスメッシュ](https://glossary.cncf.io/ja/service-mesh/)などのネットワークセキュリティ対策の検討もまた重要です。
Kubernetesの一部のネットワークプラグインは、仮想プライベートネットワーク(VPN)オーバーレイなどの技術を使用して、クラスターネットワークの暗号化を提供します。
設計上、Kubernetesはクラスターに独自のネットワークプラグインを使用することを許可しています(マネージドKubernetesを使用している場合、クラスターを管理している個人または組織がネットワークプラグインを選択している可能性があります)。

選択したネットワークプラグインとその統合方法は、転送中の情報のセキュリティに大きな影響を与える可能性があります。

### オブザーバビリティとランタイムセキュリティ

Kubernetesを使用すると、追加のツールを使用してクラスターを拡張できます。
サードパーティのソリューションをセットアップすることで、アプリケーションと実行中のクラスターを監視またはトラブルシューティングするのに役立ちます。
Kubernetes自体にもいくつかの基本的なオブザーバビリティ機能が組み込まれています。
コンテナ内で実行されるコードは、ログの生成、メトリクスの公開、その他の可観測性データの提供ができます。
デプロイ時に、クラスターが適切な保護レベルを提供していることを確認する必要があります。

メトリクスダッシュボードやそれに類似するものをセットアップする場合、そのダッシュボードにデータを投入する一連のコンポーネントと、ダッシュボード自体を確認してください。
クラスターの機能が低下するようなインシデントが発生している場合でも信頼できるように、全体のチェーンが十分な回復力と整合性保護を備えて設計されていることを確認してください。

必要に応じて、(ログや監査レコードの忠実性を確保するのに役立つ)暗号化されたメジャーブートや認証された時間配分など、Kubernetes自体よりも下位のセキュリティ対策をデプロイしてください。

高い信頼性の環境のために、ログの改ざん防止と機密性を確保するために暗号化保護をデプロイしてください。

## {{% heading "whatsnext" %}}

### クラウドネイティブセキュリティ {#further-reading-cloud-native}

* クラウドネイティブセキュリティに関するCNCF[ホワイトペーパー](https://github.com/cncf/tag-security/blob/main/community/resources/security-whitepaper/v2/CNCF_cloud-native-security-whitepaper-May2022-v2.pdf)
* ソフトウェアサプライチェーンを保護するためのグッドプラクティスに関するCNCF[ホワイトペーパー](https://github.com/cncf/tag-security/blob/f80844baaea22a358f5b20dca52cd6f72a32b066/supply-chain-security/supply-chain-security-paper/CNCF_SSCP_v1.pdf)
* [Fixing the Kubernetes clusterf\*\*k: Understanding security from the kernel up](https://archive.fosdem.org/2020/schedule/event/kubernetes/) (FOSDEM 2020)
* [Kubernetes Security Best Practices](https://www.youtube.com/watch?v=wqsUfvRyYpw) (Kubernetes Forum Seoul 2019)
* [Towards Measured Boot Out of the Box](https://www.youtube.com/watch?v=EzSkU3Oecuw) (Linux Security Summit 2016)

### Kubernetesと情報セキュリティ {#further-reading-k8s}

* [Kubernetesセキュリティ](/ja/docs/concepts/security/)
* [クラスターの保護](/ja/docs/tasks/administer-cluster/securing-a-cluster/)
* コントロールプレーンの[転送中のデータ暗号化](/docs/tasks/tls/managing-tls-in-a-cluster/)
* [保存時のデータ暗号化](/docs/tasks/administer-cluster/encrypt-data/)
* [KubernetesのSecret](/ja/docs/concepts/configuration/secret/)
* [Kubernetes APIへのアクセスコントロール](/ja/docs/concepts/security/controlling-access)
* Podの[ネットワークポリシー](/ja/docs/concepts/services-networking/network-policies/)
* [Podセキュリティの標準](/ja/docs/concepts/security/pod-security-standards/)
* [RuntimeClass](/ja/docs/concepts/containers/runtime-class)
