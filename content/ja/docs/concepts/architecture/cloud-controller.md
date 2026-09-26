---
title: クラウドコントローラーマネージャー
content_type: concept
weight: 40
---

<!-- overview -->

{{< feature-state state="beta" for_k8s_version="v1.11" >}}

クラウドインフラストラクチャ技術により、パブリック、プライベート、ハイブリッドクラウド上でKubernetesを動かすことができます。Kubernetesは、コンポーネント間の密なつながりが不要な自動化されたAPI駆動インフラストラクチャを信条としています。

{{< glossary_definition term_id="cloud-controller-manager" length="all" prepend="cloud-controller-managerは">}}

cloud-controller-managerは、プラグイン機構を用い、異なるクラウドプロバイダーに対してそれぞれのプラットフォームとKubernetesの結合を可能にする構成になっています。

<!-- body -->

## 設計 {#design}

![Kubernetesのコンポーネント](/images/docs/components-of-kubernetes.svg)

クラウドコントローラーマネージャーは、複製されたプロセスの集合としてコントロールプレーンで実行されます(通常、Pod内のコンテナとなります)。各cloud-controller-managerは、シングルプロセスで複数の{{< glossary_tooltip text="コントローラー" term_id="controller" >}}を実装します。


{{< note >}}
コントロールプレーンの一部ではなく、Kubernetesの{{< glossary_tooltip text="アドオン" term_id="addons" >}}としてクラウドコントローラーマネージャーを実行することもできます。
{{< /note >}}

## クラウドコントローラーマネージャーの機能 {#functions-of-the-ccm}

クラウドコントローラーマネージャーのコントローラーは以下を含んでいます。

#### ノードコントローラー {#node-controller}

ノードコントローラーは、クラウドインフラストラクチャで新しいサーバーが作成された際に、{{< glossary_tooltip text="Node" term_id="node" >}}オブジェクトを作成する責務を持ちます。ノードコントローラーは、クラウドプロバイダーのテナント内で動作しているホストの情報を取得します。ノードコントローラーは下記に示す機能を実行します:

1. Nodeオブジェクトを、コントローラーがクラウドプロバイダーAPIを通じて見つけた各サーバーで初期化する。
2. Nodeオブジェクトに、ノードがデプロイされているリージョンや利用可能なリソース(CPU、メモリなど)のようなクラウド特有な情報を注釈付けやラベル付けをする。
3. ノードのホスト名とネットワークアドレスを取得する。
4. ノードの正常性を検証する。ノードが応答しなくなった場合、クラウドプロバイダーのAPIを利用しサーバーがdeactivated / deleted / terminatedであるかを確認する。クラウドからノードが削除されていた場合、KubernetesクラスターからNodeオブジェクトを削除する。

いくつかのクラウドプロバイダーは、これをノードコントローラーと個別のノードライフサイクルコントローラーに分けて実装しています。

#### ルートコントローラー {#route-controller}

ルートコントローラーは、クラスター内の異なるノード上で稼働しているコンテナが相互に通信できるように、クラウド内のルートを適切に設定する責務を持ちます。

クラウドプロバイダーによっては、ルートコントローラーはPodネットワークのIPアドレスのブロックを割り当てることもあります。

#### サービスコントローラー {#service-controller}

{{< glossary_tooltip text="Service" term_id="service" >}}は、マネージドロードバランサー、IPアドレスネットワークパケットフィルターや対象のヘルスチェックのようなクラウドインフラストラクチャコンポーネントとの統合を行います。サービスコントローラーは、ロードバランサーや他のインフラストラクチャコンポーネントを必要とするServiceリソースを宣言する際にそれらのコンポーネントを設定するため、クラウドプロバイダーのAPIと対話します。

## 認可 {#authorization}

このセクションでは、クラウドコントローラーマネージャーが操作を行うために様々なAPIオブジェクトに必要な権限を分類します。

### ノードコントローラー {#authorization-node-controller}

ノードコントローラーはNodeオブジェクトのみに対して働きます。Nodeオブジェクトに対して、readとmodifyの全権限が必要です。

`v1/Node`:

- get
- list
- create
- update
- patch
- watch
- delete

### ルートコントローラー {#authorization-route-controller}

ルートコントローラーは、Nodeオブジェクトの作成を待ち受け、ルートを適切に設定します。Nodeオブジェクトについて、get権限が必要です。

`v1/Node`:

- get

### サービスコントローラー {#authorization-service-controller}

サービスコントローラーは、Serviceオブジェクトの**create**、**update**、**delete**イベントを待ち受け、その後、サービスのロードバランサーを適切に設定します。

Serviceにアクセスするため、**list**、**watch**の権限が必要です。Serviceを更新するため、`status`サブリソースへの**patch**、**update**の権限が必要です。

`v1/Service`:

- list
- get
- watch
- patch
- update

### その他 {#authorization-miscellaneous}

クラウドコントローラーマネージャーのコア機能の実装は、Eventオブジェクトのcreate権限と、セキュアな処理を保証するため、ServiceAccountのcreate権限が必要です。

`v1/Event`:

- create
- patch
- update

`v1/ServiceAccount`:

- create

クラウドコントローラーマネージャーの{{< glossary_tooltip term_id="rbac" text="RBAC" >}} ClusterRoleはこのようになります:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: cloud-controller-manager
rules:
- apiGroups:
  - ""
  resources:
  - events
  verbs:
  - create
  - patch
  - update
- apiGroups:
  - ""
  resources:
  - nodes
  verbs:
  - '*'
- apiGroups:
  - ""
  resources:
  - nodes/status
  verbs:
  - patch
- apiGroups:
  - ""
  resources:
  - services
  verbs:
  - list
  - watch
- apiGroups:
  - ""
  resources:
  - services/status
  verbs:
  - patch
  - update
- apiGroups:
  - ""
  resources:
  - serviceaccounts
  verbs:
  - create
- apiGroups:
  - ""
  resources:
  - persistentvolumes
  verbs:
  - get
  - list
  - update
  - watch
```


## {{% heading "whatsnext" %}}

* [クラウドコントローラーマネージャーの運用管理](/docs/tasks/administer-cluster/running-cloud-controller/#cloud-controller-manager)はクラウドコントローラーマネージャーの実行と管理を説明しています。

* クラウドコントローラーマネージャーを使用するためにHAコントロールプレーンをアップグレードするには、[複製されたコントロールプレーンをクラウドコントローラーマネージャーを使用するために移行する](/docs/tasks/administer-cluster/controller-manager-leader-migration/)を参照してください。

* どのようにあなた自身のクラウドコントローラーマネージャーが実装されるのか、もしくは既存プロジェクトの拡張について知りたいですか？

  - クラウドコントローラーマネージャーは、いかなるクラウドからもプラグインとしての実装を許可するためにGoインターフェースを使います。具体的には、[kubernetes/cloud-provider](https://github.com/kubernetes/cloud-provider)の [`cloud.go`](https://github.com/kubernetes/cloud-provider/blob/release-1.21/cloud.go#L42-L69)で定義されている`CloudProvider`を使います。

  - 本ドキュメントでハイライトした共有コントローラー(Node、Route、Service)の実装と共有クラウドプロバイダーインターフェースに沿ったいくつかの足場は、Kubernetesコアの一部です。クラウドプロバイダーに特化した実装は、Kubernetesのコアの外部として、また`CloudProvider`インターフェースを実装します。

  - プラグイン開発についての詳細な情報は、[クラウドコントローラーマネージャーの開発](/docs/tasks/administer-cluster/developing-cloud-controller-manager/)を見てください。
