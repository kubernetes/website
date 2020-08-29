---
title: クラウドコントローラーマネージャーとそのコンセプト
content_type: concept
weight: 40
---

<!-- overview -->

クラウドコントローラマネージャー(CCM)のコンセプト(バイナリと混同しないでください)は、もともとクラウドベンダー固有のソースコードと、Kubernetesのコアソースコードを独立して進化させることができるように作られました。クラウドコントローラーマネージャーは、Kubernetesコントローラーマネージャー、APIサーバー、そしてスケジューラーのような他のマスターコンポーネントと並行して動きます。またKubernetesのアドオンとしても動かすことができ、その場合はKubernetes上で動きます。

クラウドコントローラーマネージャーの設計は「プラグインメカニズム」をベースにしています。そうすることで、新しいクラウドプロバイダーがプラグインを使ってKubernetesと簡単に統合できるようになります。新しいクラウドプロバイダーに向けてKubernetesのオンボーディングを行ったり、古いモデルを利用しているクラウドプロバイダーに、新しいCCMモデルに移行させるような計画があります。

このドキュメントでは、クラウドコントローラーマネージャーの背景にあるコンセプトと、それに関連する機能の詳細について話します。

これが、クラウドコントローラーマネージャーを除いた、Kubernetesクラスターのアーキテクチャ図です。

![Pre CCM Kube Arch](/images/docs/pre-ccm-arch.png)




<!-- body -->

## 設計

上で示した図で分かるように、Kubernetesとクラウドプロバイダーはいくつかの異なるコンポーネントを通じて連携します:

* Kubelet
* Kubernetesコントローラーマネージャー
* Kubernetes APIサーバー

CCMは、前述した3つのコンポーネントのクラウド依存のロジックを統合し、クラウドとの単一の連携ポイントとなります。CCMを利用した新しいアーキテクチャは下記のようになります:

![CCM Kube Arch](/images/docs/post-ccm-arch.png)

## CCMのコンポーネント

CCMは、Kubernetesコントローラーマネージャー(KCM)からいくつかの機能群を切り離し、別のプロセスとして動かします。具体的には、KCMに含まれるクラウド依存のコントローラーを分離します。KCMは、下記に示すクラウド依存のコントローラーループを持っています:

 * ノードコントローラー
 * ボリュームコントローラー
 * ルートコントローラー
 * サービスコントローラー

バージョン1.9では、CCMは前述のリスト内の下記コントローラーを動かします:

* ノードコントローラー
* ルートコントローラー
* サービスコントローラー

{{< note >}}
ボリュームコントローラーは、意図的にCCMの一部になっていません。複雑さと、ベンダー固有のボリュームロジックを抽象化するのに費やした労力を考え、CCMの一部に移行しないことが決定されました。
{{< /note >}}

CCMを使ったボリュームをサポートする元の計画は、プラガブルなボリュームをサポートするため、[Flex](/docs/concepts/storage/volumes/#flexVolume)ボリュームを使うことでした。しかし、競合している[CSI](/docs/concepts/storage/volumes/#csi)として知られている機能が、Flexを置き換える予定です。

これらのダイナミクスを考慮し、我々はCSIが利用できるようになるまで、間を取った暫定措置を取ることにしました。

## CCMの機能群

CCMは、クラウドに依存しているKubernetesのコンポーネントから機能を継承しています。このセクションはそれらのコンポーネントをベースに構造化されています。

### 1. Kubernetesコントローラーマネージャー

CCMの大半の機能は、KCMから派生しています。前セクションで説明したとおり、CCMは下記のコントロールループを動かします:

* ノードコントローラー
* ルートコントローラー
* サービスコントローラー

#### ノードコントローラー

ノードコントローラーは、クラウドプロバイダーからクラスター内で稼働しているノードの情報を取得し、初期化する責務を持ちます。ノードコントローラーは下記に示す機能を実行します:

1. ノードをクラウド特有のゾーン/リージョンラベルで初期化する
2. ノードをクラウド特有のインスタンス詳細情報(例、タイプ、サイズ)で初期化する
3. ノードのネットワークアドレスとホスト名を取得する
4. ノードが応答しなくなった場合、ノードがクラウドから削除されているかを確認する。クラウドからノードが削除されていた場合、KubernetesからNodeオブジェクトを削除する

#### ルートコントローラー

ルートコントローラーは、クラスタ内の異なるノード上で稼働しているコンテナが相互に通信できるように、クラウド内のルートを適切に設定する責務を持ちます。ルートコントローラーはGoogle Compute Engineのクラスターのみに該当します。

#### サービスコントローラー

サービスコントローラーは、サービスの作成、更新、そして削除イベントの待ち受けに責務を持ちます。Kubernetes内のサービスの現在の状態を、クラウド上のロードバランサー(ELB、Google LB、またOracle Cloud Infrastructure LBなど)に反映するための設定を行います。さらに、クラウドロードバランサーのバックエンドが最新の状態になっていることを保証します。

### 2. Kubelet

ノードコントローラーは、kubeletのクラウドに依存した機能も含んでいます。CCMの登場以前、kubeletはIPアドレス、リージョン/ゾーンラベル、そしてインスタンスタイプ情報のような、クラウド特有の情報を元にノードを初期化する責務を持っていました。CCMが登場したことで、この初期化操作がkubeletからCCMに移行されました。

この新しいモデルでは、kubeletはクラウド特有の情報無しでノードを初期化します。しかし、新しく作成されたノードにtaintを付けて、CCMがクラウド特有の情報でノードを初期化するまで、コンテナがスケジュールされないようにします。その後、taintを削除します。

## プラグインメカニズム

クラウドコントローラーマネージャーは、Goのインターフェースを利用してクラウドの実装をプラグイン化できるようにしています。具体的には、[こちら](https://github.com/kubernetes/cloud-provider/blob/9b77dc1c384685cb732b3025ed5689dd597a5971/cloud.go#L42-L62)で定義されているクラウドプロバイダーインターフェースを利用しています。

上で強調した4つの共有コントローラーの実装、そしていくつかの共有クラウドプロバイダーインターフェースと一部の連携機能は、Kubernetesのコアにとどまります。クラウドプロバイダー特有の実装はコア機能外で構築され、コア機能内で定義されたインターフェースを実装します。

プラグインを開発するためのさらなる情報は、[クラウドコントローラーマネージャーを開発する](/docs/tasks/administer-cluster/developing-cloud-controller-manager/)を参照してください。

## 認可

このセクションでは、CCMが操作を行うために様々なAPIオブジェクトに必要な権限を分類します。

### ノードコントローラー

ノードコントローラーはNodeオブジェクトのみに対して働きます。Nodeオブジェクトに対して、get、list、create、update、patch、watch、そしてdeleteの全権限が必要です。

v1/Node:

- Get
- List
- Create
- Update
- Patch
- Watch
- Delete

### ルートコントローラー

ルートコントローラーは、Nodeオブジェクトの作成を待ち受け、ルートを適切に設定します。Nodeオブジェクトについて、get権限が必要です。

v1/Node:

- Get

### サービスコントローラー

サービスコントローラーは、Serviceオブジェクトの作成、更新、削除イベントを待ち受け、その後、サービスのエンドポイントを適切に設定します。

サービスにアクセスするため、list、watchの権限が必要です。サービスを更新するため、patch、updateの権限が必要です。

サービスのエンドポイントを設定するため、create、list、get、watchそしてupdateの権限が必要です。

v1/Service:

- List
- Get
- Watch
- Patch
- Update

### その他

CCMコア機能の実装は、イベントのcreate権限と、セキュアな処理を保証するため、ServiceAccountのcreate権限が必要です。

v1/Event:

- Create
- Patch
- Update

v1/ServiceAccount:

- Create

CCMのRBAC ClusterRoleはこのようになります:

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

## ベンダー実装

下記のクラウドプロバイダーがCCMを実装しています:

* [Alibaba Cloud](https://github.com/kubernetes/cloud-provider-alibaba-cloud)
* [AWS](https://github.com/kubernetes/cloud-provider-aws)
* [Azure](https://github.com/kubernetes/cloud-provider-azure)
* [BaiduCloud](https://github.com/baidu/cloud-provider-baiducloud)
* [DigitalOcean](https://github.com/digitalocean/digitalocean-cloud-controller-manager)
* [GCP](https://github.com/kubernetes/cloud-provider-gcp)
* [Hetzner](https://github.com/hetznercloud/hcloud-cloud-controller-manager)
* [Linode](https://github.com/linode/linode-cloud-controller-manager)
* [OpenStack](https://github.com/kubernetes/cloud-provider-openstack)
* [Oracle](https://github.com/oracle/oci-cloud-controller-manager)
* [TencentCloud](https://github.com/TencentCloud/tencentcloud-cloud-controller-manager)


## クラスター管理

CCMを設定、動かすための完全な手順は[こちら](/docs/tasks/administer-cluster/running-cloud-controller/#cloud-controller-manager)で提供されています。


