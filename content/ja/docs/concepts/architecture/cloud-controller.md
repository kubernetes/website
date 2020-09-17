---
title: クラウドコントローラーマネージャー
content_type: concept
weight: 40
---

<!-- overview -->

{{< feature-state state="beta" for_k8s_version="v1.11" >}}

クラウドインフラストラクチャー技術により、パブリック、プライベート、ハイブリッドクラウド上でKubernetesを動かすことができます。Kubernetesは、コンポーネント間の密なつながりが不要な自動化されたAPI駆動インフラストラクチャーを信条としています。

{{< glossary_definition term_id="cloud-controller-manager" length="all" prepend="cloud-controller-managerは">}}

cloud-controller-managerは、プラグイン機構を用い、異なるクラウドプロバイダーに対してそれぞれのプラットフォームとKubernetesの結合を可能にする構成になっています。



<!-- body -->

## 設計

![Kubernetesのコンポーネント](/images/docs/components-of-kubernetes.png)

クラウドコントローラーマネージャーは、複製されたプロセスの集合としてコントロールプレーンで実行されます。（通常、Pod内のコンテナとなります）各cloud-controller-managerは、シングルプロセスで複数の{{< glossary_tooltip text="controllers" term_id="controller" >}}を実装します。


{{< note >}}
コントロールプレーンの一部ではなく、Kubernetesの{{< glossary_tooltip text="addon" term_id="addons" >}}としてクラウドコントローラーマネージャーを実行することもできます。
{{< /note >}}

## クラウドコントローラーマネージャーの機能 {#functions-of-the-ccm}

クラウドコントローラーマネージャーのコントローラーは以下を含んでいます。

#### ノードコントローラー

ノードコントローラーは、クラウドインフラストラクチャーで新しいサーバーが作成された際に、{{< glossary_tooltip text="Node" term_id="node" >}}オブジェクトを作成する責務を持ちます。ノードコントローラーは、クラウドプロバイダーのテナント内で動作しているホストの情報を取得します。ノードコントローラーは下記に示す機能を実行します:

1. Nodeオブジェクトを、コントローラーがクラウドプロバイダーAPIを通じて見つけた各サーバーで初期化する
2. Nodeオブジェクトに、ノードがデプロイされているリージョンや利用可能なリソース（CPU、メモリなど）のようなクラウド特有な情報を注釈付けやラベル付けをする
3. ノードのホスト名とネットワークアドレスを取得する
4. ノードの正常性を検証する。ノードが応答しなくなった場合、クラウドプロバイダーのAPIを利用しサーバーがdeactivated / deleted / terminatedであるかを確認する。クラウドからノードが削除されていた場合、KubernetesクラスターからNodeオブジェクトを削除する

いくつかのクラウドプロバイダーは、これをノードコントローラーと個別のノードライフサイクルコントローラーに分けて実装しています。

#### ルートコントローラー

ルートコントローラーは、クラスタ内の異なるノード上で稼働しているコンテナが相互に通信できるように、クラウド内のルートを適切に設定する責務を持ちます。

クラウドプロバイダーによっては、ルートコントローラーはPodネットワークのIPアドレスのブロックを割り当てることもあります。

#### サービスコントローラー

{{< glossary_tooltip text="Services" term_id="service" >}}は、マネージドロードバランサー、IPアドレスネットワークパケットフィルタや対象のヘルスチェックのようなクラウドインフラストラクチャーコンポーネントのインテグレーションを行います。サービスコントローラーは、ロードバランサーや他のインフラストラクチャーコンポーネントを必要とするServiceリソースを宣言する際にそれらのコンポーネントを設定するため、クラウドプロバイダーのAPIと対話します。

## 認可

このセクションでは、クラウドコントローラーマネージャーが操作を行うために様々なAPIオブジェクトに必要な権限を分類します。

### ノードコントローラー {#authorization-node-controller}

ノードコントローラーはNodeオブジェクトのみに対して働きます。Nodeオブジェクトに対して、readとmodifyの全権限が必要です。

`v1/Node`:

- Get
- List
- Create
- Update
- Patch
- Watch
- Delete

### ルートコントローラー  {#authorization-route-controller}

ルートコントローラーは、Nodeオブジェクトの作成を待ち受け、ルートを適切に設定します。Nodeオブジェクトについて、get権限が必要です。

`v1/Node`:

- Get

### サービスコントローラー {#authorization-service-controller}

サービスコントローラーは、Serviceオブジェクトの作成、更新、削除イベントを待ち受け、その後、サービスのEndpointを適切に設定します。

サービスにアクセスするため、list、watchの権限が必要です。サービスを更新するため、patch、updateの権限が必要です。

サービスのEndpointリソースを設定するため、create、list、get、watchそしてupdateの権限が必要です。

`v1/Service`:

- List
- Get
- Watch
- Patch
- Update

### その他 {#authorization-miscellaneous}

クラウドコントローラーマネージャーのコア機能の実装は、Eventオブジェクトのcreate権限と、セキュアな処理を保証するため、ServiceAccountのcreate権限が必要です。

`v1/Event`:

- Create
- Patch
- Update

`v1/ServiceAccount`:

- Create

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
  - patch
  - update
  - watch
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
- apiGroups:
  - ""
  resources:
  - endpoints
  verbs:
  - create
  - get
  - list
  - watch
  - update
```


## {{% heading "whatsnext" %}}

[Cloud Controller Manager Administration](/docs/tasks/administer-cluster/running-cloud-controller/#cloud-controller-manager)
はクラウドコントラーマネージャーの実行と管理を説明しています。

どのようにあなた自身のクラウドコントローラーマネージャーが実装されるのか、もしくは既存プロジェクトの拡張について知りたいですか？

クラウドコントローラーマネージャーは、いかなるクラウドからもプラグインとしての実装を許可するためにGoインターフェースを使います。具体的には、[kubernetes/cloud-provider](https://github.com/kubernetes/cloud-provider)の [`cloud.go`](https://github.com/kubernetes/cloud-provider/blob/release-1.17/cloud.go#L42-L62)で定義されている`CloudProvider`を使います。

本ドキュメントでハイライトした共有コントローラー（Node、Route、Service）の実装と共有クラウドプロバイダーインターフェースに沿ったいくつかの足場は、Kubernetesコアの一部です。クラウドプロバイダに特化した実装は、Kubernetesのコアの外部として、また`CloudProvider`インターフェースを実装します。

プラグイン開発ついての詳細な情報は、[Developing Cloud Controller Manager](/docs/tasks/administer-cluster/developing-cloud-controller-manager/)を見てください。
