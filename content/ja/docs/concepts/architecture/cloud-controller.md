---
title: クラウドコントローラマネージャーの基礎となる概念
content_template: templates/concept
weight: 30
---

{{% capture overview %}}

クラウドコントローラーマネージャー（CCM）の概念（バイナリと混同しないでください）は元々はクラウド固有のベンダーコードとKubernetesのコアが互いに独立して開発できるようにするために作られました。クラウドコントローラーマネージャーはKubernetesコントローラーマネージャー、APIサーバー、スケジューラーなどの他のマスターコンポーネントと一緒に実行されます。Kubernetesのアドオンとして起動することもできます。この場合、Kubernetes上で実行されます。

クラウドコントローラーマネージャーの設計は新しいクラウドプロバイダーがプラグインを使用してKubernetesと簡単に統合できるプラグインメカニズムに基づいています。Kubernetesに新しいクラウドプロバイダーを搭載してクラウドプロバイダーを古いモデルから新しいクラウドコントローラマネージャーのモデルに移行する計画があります。

このドキュメントではクラウドコントローラーマネージャーの背後にある概念について説明し、関連する機能についても詳しく説明します。

クラウドコントローラーマネージャーを使用しないKubernetesクラスターのアーキテクチャは次のとおりです。

![Pre CCM Kube Arch](/images/docs/pre-ccm-arch.png)

{{% /capture %}}


{{% capture body %}}

## 設計

前の図では、Kubernetesとクラウドプロバイダーが以下のいくつかの異なるコンポーネントを介して統合されています。

* Kubelet
* Kubernetesコントローラマネージャー
* Kubernetes APIサーバー

クラウドコントローラーマネージャーは前述の3つのコンポーネントのクラウドに依存するロジックをすべて統合してクラウドとの単一の連携機能を提供します。クラウドコントローラーマネージャーの新しいアーキテクチャは次のようになります。

![CCM Kube Arch](/images/docs/post-ccm-arch.png)

## クラウドコントローラーマネージャーのコンポーネント

クラウドコントローラーマネージャーはKubernetesコントローラーマネージャー（KCM）の機能の一部を分離して別のプロセスとして実行します。具体的にはクラウドに依存するKubernetesコントローラーマネージャー内のコントローラーを分離します。KCMには以下のようなクラウドに依存した処理を持つコントローラーループがあります。

 * ノードコントローラー
 * ボリュームコントローラー
 * ルートコントローラー
 * サービスコントローラー

バージョン1.9以降ではクラウドコントローラーマネージャーは以下のコントローラーを実行します。

* ノードコントローラー
* ルートコントローラー
* サービスコントローラー

{{< note >}}
ボリュームコントローラーはクラウドコントローラーマネージャーから意図的に除外されました。ボリュームに関する複雑さと、ベンダー固有のボリュームのロジックを抽象化する努力により、ボリュームコントローラーをクラウドコントローラーマネージャーに移動しないことが決定されました。
{{< /note >}}

当初はクラウドコントローラーマネージャーがFlexボリュームを使用して組み込み可能なボリュームをサポートする予定でしたが、現在はFlexボリュームをCSIに置き換えることが計画されています。

このダイナミックな計画を考慮して、CSIの準備が整うまでの間はボリュームコントローラーをクラウドコントローラーマネージャーで実行するようになりました。

## クラウドコントローラーマネージャーの機能

クラウドコントローラーマネージャーはのクラウドプロバイダーに依存するKubernetesのコンポーネントからそれらの機能を引き継ぎます。このセクションはこれらのコンポーネントに基づいて構成されています。

### 1. Kubernetesコントローラマネージャー

クラウドコントローラマネージャーの機能の大半はKubernetesコントローラマネージャーから派生したものです。前述したようにクラウドコントローラマネージャーは以下の制御ループを実行します。

* ノードコントローラー
* ルートコントローラー
* サービスコントローラー

#### ノードコントローラー

ノードコントローラーはクラスタで実行されているノードに関する情報をクラウドプロバイダーから取得し、ノードの初期化を行う役割を担います。ノードコントローラは以下の機能を実行します。

1. クラウド固有のゾーン/リージョン情報をノードに付与してノードを初期化します
2. タイプやサイズといったクラウド固有のインスタンスの詳細情報をノードに付与してノードを初期化します
3. ノードのアドレスとホスト名を取得します
4. ノードの反応がなくなった際にクラウド上でノードが削除されたかをチェックします。すでにノードがクラウド上で削除されていればKubernetesのノードオブジェクトを削除します

#### ルートコントローラー

ルートコントローラーはKubernetesクラスター内の異なるノード上のコンテナが相互に通信できるように、クラウド内のルートを適切に構成する役割を担います。ルートコントローラーはGoogle Compute Engineクラスターにのみ適用できます。

#### サービスコントローラー

サービスコントローラーはサービスの作成、更新、および削除イベントを監視する役割を担います。Kubernetesのサービスの現在の状態に基づいて、Kubernetesのサービスの状態を反映した形で（ELB、Google LB、Oracle Cloud Infrastructure LBなどの）クラウドロードバランサーを構成します。さらに、クラウドロードバランサーのサービスバックエンドが最新であることを保証します。

### 2. Kubelet

ノードコントローラーにはkubeletのクラウドに依存する機能が含まれています。クラウドコントローラーマネージャーの導入以前、kubeletはIPアドレス、リージョン/ゾーンのラベルやインスタンスタイプの情報などクラウド固有の詳細情報を取得してノードを初期化する役割を担っていました。クラウドコントローラーマネージャーの導入によりこの初期化作業がkubeletからクラウドコントローラーマネージャーへと移行されました。

この新しいモデルでは、kubeletはクラウド固有の情報なしでノードを初期化します。ただし、クラウドコントローラーマネージャーがクラウド固有の情報でノードを初期化するまでの間ノードをスケジュールできないようにするために、新しく作成されたノードに汚染を追加します。そしてクラウドコントローラーマネージャーによる初期化後にこの汚染を取り除きます。

## プラグインのメカニズム

クラウドコントローラーマネージャーはGoインターフェイスを使用して任意のクラウドからの実装をプラグインできるようにします。具体的には、[ここ](https://github.com/kubernetes/cloud-provider/blob/9b77dc1c384685cb732b3025ed5689dd597a5971/cloud.go#L42-L62)で定義されたCloudProviderインターフェイスを使用します。

上記でハイライトした4つの共有コントローラーの実装、および共有クラウドプロバイダーインターフェイスと一部の基盤となる実装Kubernetesリポジトリの内部に残ります。クラウドプロバイダーに固有の実装はKubernetesリポジトリの外部で構築され、Kubernetesリポジトリの内部で定義されたインターフェイスを実装します。

プラグインの開発の詳細については[クラウドコントローラーマネージャーの開発](/docs/tasks/administer-cluster/developing-cloud-controller-manager/)を参照してください。

## 認可

このセクションではクラウドコントローラーマネージャーが操作を実行するために必要なAPIオブジェクトへのアクセスの詳細について説明します。

### ノードコントローラー

ノードコントローラーはノードオブジェクトに対してのみ処理を行います。ノードオブジェクトのget、list、create、update、patch、watch、およびdeleteへのフルアクセスが必要です。

v1/Node:

- Get
- List
- Create
- Update
- Patch
- Watch
- Delete

### ルートコントローラ

ルートコントローラーはノードオブジェクトの作成を監視しルートを適切に構成します。ノードオブジェクトのgetができる必要があります。

v1/Node:

- Get

### サービスコントローラ

サービスコントローラーは、サービスオブジェクトの作成、更新、および削除イベントを監視し、それらのサービスのエンドポイントを適切に構成します。

サービスにアクセスするにはlistおよびwatchへのアクセスが必要です。サービスを更新するにはpatchおよびupdateへのアクセスも必要です。

サービスのエンドポイントを設定するには、create、list、get、watch、およびupdateへのアクセスが必要です。

v1/Service:

- List
- Get
- Watch
- Patch
- Update

### その他

クラウドコントローラーマネージャーのコアの実装にはイベントを作成するためのアクセスが必要です。安全な操作を確保するには、ServiceAccountsを作成するためのアクセスが必要です。

v1/Event:

- Create
- Patch
- Update

v1/ServiceAccount:

- Create

クラウドコントローラーマネージャーのRBACのClusterRoleは以下のようになります。

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

## ベンダーの実装

以下のクラウドプロバイダーはクラウドコントローラーマネージャーの実装があります。

* [Digital Ocean](https://github.com/digitalocean/digitalocean-cloud-controller-manager)
* [Oracle](https://github.com/oracle/oci-cloud-controller-manager)
* [Azure](https://github.com/kubernetes/cloud-provider-azure)
* [GCP](https://github.com/kubernetes/cloud-provider-gcp)
* [AWS](https://github.com/kubernetes/cloud-provider-aws)
* [BaiduCloud](https://github.com/baidu/cloud-provider-baiducloud)
* [Linode](https://github.com/linode/linode-cloud-controller-manager)

## クラスタ管理

クラウドコントローラーマネージャーを構成および実行するための完全な手順は[こちら](/docs/tasks/administer-cluster/running-cloud-controller/#cloud-controller-manager)にあります。

{{% /capture %}}
