---
reviewers:
title: ロールベースアクセスコントロールのグッドプラクティス
description: >
  クラスター運用者向けの適切なRBAC設計の原則と実践方法
content_type: concept
weight: 60
---

<!-- overview -->

Kubernetes {{< glossary_tooltip text="RBAC" term_id="rbac" >}}は、クラスターユーザーやワークロードがその役割を果たすために、必要なリソースへのアクセスしかできないようにするための重要なセキュリティコントロールです。
クラスターユーザーの権限を設計する際には、クラスター管理者が特権昇格が発生しうる領域を理解し、セキュリティインシデントを引き起こすリスクを減らすことが重要です。

ここで説明するグッドプラクティスは、一般的な[RBACドキュメント](/ja/docs/reference/access-authn-authz/rbac/#restrictions-on-role-creation-or-update)と併せて読むことを推奨します。

<!-- body -->

## 一般的なグッドプラクティス

### 最小特権の原則

理想的には、ユーザーやサービスには最小限の権限のみ割り当てるべきです。
権限は、その操作に明示的に必要なものだけを使用するべきです。
クラスターによって異なりますが、一般的なルールは次のとおりです:

- 可能であれば、namespaceレベルで権限を割り当てます。
  特定のnamespace内でのみユーザーに権限を与えるため、ClusterRoleBindingsではなくRoleBindingsを使用します。
- 可能であれば、ワイルドカード権限を提供しないでください。特に全てのリソースへの権限を提供しないでください。
  Kubernetesは拡張可能なシステムであるため、ワイルドカードアクセスを提供すると、クラスター内に現存するすべてオブジェクトタイプだけでなく、将来作成されるすべてのオブジェクトタイプにも権限が与えられてしまいます。
- 管理者は特に必要でない限り、`cluster-admin`アカウントを使用すべきではありません。
  権限の低いアカウントに[偽装権限](/ja/docs/reference/access-authn-authz/authentication/#user-impersonation)を提供することで、クラスターリソースの誤った変更を回避できます。
- `system:masters`グループにユーザーを追加しないでください。
  このグループのメンバーであるユーザーは、すべてのRBAC権限をバイパスし、常に制限のないスーパーユーザーアクセス権限を持ちます。この権限はRoleBindingsまたはClusterRoleBindingsを削除しても取り消すことができません。
  余談ですが、クラスターが認可ウェブフックを使用している場合、このグループのメンバーシップもそのウェブフックをバイパスします(そのグループのメンバーであるユーザーからのリクエストがウェブフックに送信されることはありません)

### 特権トークンの配布を最小限に抑える {#least-privilege}

理想的には、Podには強力な権限が付与されたサービスアカウントを割り当てられるべきではありません。
(例えば、[特権昇格リスク](#privilege-escalation-risks)にリストされている権限)。
強力な権限が必要な場合は、次のプラクティスを検討してください:

- 強力なPodを実行するノードの数を制限します。
  実行する任意のDaemonSetが必要であることを確認し、コンテナエスケープの影響範囲を制限するために最小限の権限で実行されるようにします。
- 信頼できない、または公開されたPodと強力なPodを一緒に実行しないようにする。
  信頼できない、または信頼度の低いPodと一緒に実行されないようにするために、[TaintsとToleration](/ja/docs/concepts/scheduling-eviction/taint-and-toleration/)、[NodeAffinity](/ja/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity)、または[PodAntiAffinity](/ja/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)の使用を検討してください。
  信頼性の低いPodが**制限付き**Podセキュリティ標準を満たしていない場合は、特に注意してください。

### 強化

Kubernetesは、すべてのクラスターに必要とは限らないアクセスをデフォルトで提供します。
デフォルトで提供されるRBAC権限を確認することで、セキュリティを強化する機会が得られます。
一般的に、`system:`アカウントに提供される権限を変更するべきではありませんが、クラスター権限を強化するためのオプションがいくつか存在します:

- `system:unauthenticated`グループのバインディングを確認し、可能であれば削除します。
  これにより、ネットワークレベルでAPIサーバーに接続できるすべてのユーザーにアクセスが許可されます。
- `automountServiceAccountToken: false`を設定することで、サービスアカウントトークンのデフォルトの自動マウントを回避します。
  詳細については、[デフォルトのサービスアカウントトークンの使用](/docs/tasks/configure-pod-container/configure-service-account/#use-the-default-service-account-to-access-the-api-server)を参照してください。
  Podにこの値を設定すると、サービスアカウント設定が上書きされ、サービスアカウントトークンを必要とするワークロードは引き続きそれをマウントできます。

### 定期的なレビュー

冗長なエントリや特権昇格の可能性がないか、定期的にKubernetes RBAC設定を確認することが不可欠です。
攻撃者が削除されたユーザーと同じ名前のユーザーアカウントを作成できる場合、特にそのユーザーに割り当てられた権限を自動的に継承できます。

## Kubernetes RBAC - 特権昇格リスク　{#privilege-escalation-risks}

Kubernetes RBAC内には、ユーザーやサービスアカウントがクラスター内で特権昇格したり、クラスター外のシステムに影響を与えたりすることができる権限がいくつかあります。

このセクションは、クラスター運用者が意図した以上のクラスターへのアクセスを誤って許可しないようにするために注意を払うべき領域を示すことを目的としています。

### Secretのリスト

一般に、Secretに対する`get`アクセスを許可すると、ユーザーがその内容を読むことができることは明らかです。
また、`list`および`watch`アクセスも、ユーザーがSecretの内容を読むことを事実上可能にします。

例えば、Listレスポンスが返却される(例: `kubectl get secrets -A -o yaml`)と、そのレスポンスにはすべてのSecretの内容が含まれます。

### ワークロードの作成

Namespace内でワークロード(PodやPodを管理する[ワークロードリソース](/ja/docs/concepts/workloads/controllers/))を作成する権限により、そのnamespace内のSecret、ConfigMap、PersistentVolumeなどのPodにマウントできる他の多くのリソースへのアクセスが暗黙的に許可されます。
さらに、Podは任意の[ServiceAccount](/docs/reference/access-authn-authz/service-accounts-admin/)として実行できるため、ワークロードを作成する権限もまた、そのnamespace内の任意のサービスアカウントのAPIアクセスレベルを暗黙的に許可します。

特権付きPodを実行できるユーザーは、そのアクセス権を使用してノードへのアクセスを取得し、さらに特権昇格させる可能性があります。
適切に安全で隔離されたPodを作成できるユーザーや他のプリンシパルを完全に信頼していない場合は、**ベースライン**または**制限付き**Podセキュリティ標準を強制する必要があります。
[Podのセキュリティアドミッション](/ja/docs/concepts/security/pod-security-admission/)や他の(サードパーティ)メカニズムを使用して、その強制を実装できます。

これらの理由から、namespaceは異なる信頼レベルやテナンシーを必要とするリソースを分離するために使用されるべきです。
[最小特権](#least-privilege)の原則に従い、最小限の権限セットを割り当てることがベストプラクティスとされていますが、namespace内の境界は弱いと考えるべきです。

### 永続ボリュームの作成

誰か、または何らかのアプリケーションが、任意のPersistentVolumeを作成する権限を持っている場合、そのアクセスには`hostPath`ボリュームの作成も含まれており、これはPodが関連づけられたノードの基盤となるホストファイルシステムにアクセスできることを意味します。
その権限を与えることはセキュリティリスクとなります。

ホストファイルシステムに制限のないアクセス権を持つコンテナが特権昇格する方法は数多くあり、これには他のコンテナからのデータの読み取りや、Kubeletなどのシステムサービスの資格情報の悪用が含まれます。

PersistentVolumeオブジェクトを作成する権限を許可するのは、次の場合に限定するべきです:

- ユーザー(クラスター運用者)が、作業にこのアクセスを必要としており、かつ信頼できる場合。
- 自動プロビジョニングのために設定されたPersistentVolumeClaimに基づいてPersistentVolumeを作成するKubernetesコントロールコンポーネント。
  これは通常、KubernetesプロバイダーまたはCSIドライバーのインストール時に設定されます。

永続ストレージへのアクセスが必要な場合、信頼できる管理者がPersistentVolumeを作成し、制約のあるユーザーはPersistentVolumeClaimを使用してそのストレージにアクセスするべきです。

### ノードの`proxy`サブリソースへのアクセス

ノードオブジェクトのプロキシサブリソースへのアクセス権を持つユーザーは、Kubelet APIに対する権限を持ち、権限を持つノード上のすべてのPodでコマンドを実行できます。
このアクセスは監査ログやアドミッションコントロールをバイパスするため、このリソースに権限を付与する際には注意が必要です。

### Escalate動詞

一般的に、RBACシステムはユーザーが所有する権限以上のクラスターロールを作成できないようにします。
この例外は`escalate`動詞です。
[RBACのドキュメント](/ja/docs/reference/access-authn-authz/rbac/#restrictions-on-role-creation-or-update)に記載されているように、この権限を持つユーザーは事実上特権昇格させることができます。

### Bind動詞

`escalate`動詞と同様に、ユーザーにこの権限を付与すると、特権昇格に対するKubernetesビルトインの保護をバイパスし、ユーザーがすでに持っていない権限を持つロールへのバインディングを作成できるようになります。

### Impersonate動詞

この動詞は、ユーザーがクラスター内の他のユーザーになりすまし、そのユーザーの権限を取得することを可能にします。
権限を付与する場合は、なりすましアカウントを介して過剰な権限を取得できないように注意する必要があります。

### CSRと証明書の発行

CSR APIは、CSRに対する`create`権限と`kubernetes.io/kube-apiserver-client`を署名者とする`certificatesigningrequests/approval`に対する`update`権限を持つユーザーが、クラスターに対して認証するための新しいクライアント証明書を作成できるようにします。
これらのクライアント証明書は、Kubernetesシステムコンポーネントの重複を含む任意の名前を持つことができます。
これにより、特権昇格が可能になります。

### トークンリクエスト

`serviceaccounts/token`に対する`create`権限を持つユーザーは、既存のサービスアカウント用のトークンを発行するためのTokenRequestsを作成できます。

### アドミッションウェブフックの制御

`validatingwebhookconfigurations`または`mutatingwebhookconfigurations`を制御するユーザーは、クラスターに許可された任意のオブジェクトを読み取ることができるウェブフックを制御し、ウェブフックを変更する場合は許されたオブジェクトも変更できます。

### Namespaceの変更

Namespaceオブジェクトにおいて**patch**操作を実行できるユーザーは(そのアクセス権を持つロールへのnamespace付きのRoleBindingを通じて)namespaceのラベルを変更できます。
Podのセキュリティアドミッションが使用されているクラスターでは、ユーザーは管理者が意図したより緩いポリシーをnamespaceに設定できる場合があります。
NetworkPolicyが使用されているクラスターでは、ユーザーは管理者が意図していないサービスへのアクセスを間接的に許可するラベルを設定できる場合があります。

## Kubernetes RBAC - サービス拒否リスク {#denial-of-service-risks}

### オブジェクト作成によるサービス拒否 {#object-creation-dos}

クラスター内のオブジェクトを作成する権限を持つユーザーは、[etcd used by Kubernetes is vulnerable to OOM attack](https://github.com/kubernetes/kubernetes/issues/107325)で議論されているように、オブジェクトのサイズや数に基づいてサービス拒否を引き起こすほど大きなオブジェクトを作成できる可能性があります。
これは、半信頼または信頼されていないユーザーにシステムへの限定的なアクセスが許可されている場合、特にマルチテナントクラスターに関係する可能性があります。

この問題を緩和するための1つのオプションとして、[リソースクォータ](/ja/docs/concepts/policy/resource-quotas/#object-count-quota)を使用して作成可能なオブジェクトの量を制限することが考えられます。

## {{% heading "whatsnext" %}}

* RBACについてさらに詳しく知るには、[RBACのドキュメント](/ja/docs/reference/access-authn-authz/rbac/)を参照してください。
