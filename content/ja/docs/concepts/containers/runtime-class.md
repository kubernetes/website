---
reviewers:
title: ランタイムクラス(Runtime Class)
content_template: templates/concept
weight: 20
---

{{% capture overview %}}

{{< feature-state for_k8s_version="v1.14" state="beta" >}}

このページではRuntimeClassリソースと、runtimeセクションのメカニズムについて説明します。

{{< warning >}}
RuntimeClassはKubernetes1.14のβ版アップグレードにおいて*破壊的な* 変更を含んでいます。もしユーザーがKubernetes1.14以前のバージョンを使っていた場合、[RuntimeClassのα版からβ版へのアップグレード](#upgrading-runtimeclass-from-alpha-to-beta)を参照してください。
{{< /warning >}}

{{% /capture %}}


{{% capture body %}}

## RuntimeClassについて

RuntimeClassはコンテナランタイムの設定を選択するための機能です。そのコンテナランタイム設定はPodのコンテナを稼働させるために使われます。

### セットアップ

RuntimeClass機能のFeature Gateが有効になっていることを確認してください(デフォルトで有効です)。Feature Gateを有効にする方法については、[Feature
Gates](/docs/reference/command-line-tools-reference/feature-gates/)を参照してください。
その`RuntimeClass`のFeature GateはApiServerとkubeletのどちらも有効になっていなければなりません。

1. ノード上でCRI実装を設定する。（ランタイムに依存）
2. 対応するRuntimeClassリソースを作成する。

#### 1. ノード上でCRI実装を設定する。

RuntimeClassを通じて利用可能な設定はContainer Runtime Interface (CRI)の実装依存となります。
ユーザーの環境のCRI実装の設定方法は、対応するドキュメント([下記](#cri-configuration))を参照ください。

{{< note >}}
RuntimeClassは現時点において、クラスター全体で同じ種類のNode設定であることを仮定しています。(これは全てのNodeがコンテナランタイムに関して同じ方法で構成されていることを意味します)。
設定が異なるNodeに関しては、スケジューリング機能を通じてRuntimeClassとは独立して管理されなくてはなりません。([PodをNodeに割り当てる方法](/docs/concepts/configuration/assign-pod-node/)を参照して下さい)。
{{< /note >}}

RuntimeClassの設定は、RuntimeClassによって参照される`ハンドラー`名を持ちます。そのハンドラーは正式なDNS-1123に準拠する形式のラベルでなくてはなりません(英数字 + `-`の文字で構成されます)。

#### 2. 対応するRuntimeClassリソースを作成する

ステップ1にて設定する各項目は、関連する`ハンドラー` 名を持ちます。それはどの設定かを指定するものです。各ハンドラーにおいて、対応するRuntimeClassオブジェクトが作成されます。

そのRuntimeClassリソースは現時点で2つの重要なフィールドを持ちます。それはRuntimeClassの名前(`metadata.name`)とハンドラー(`handler`)です。そのオブジェクトの定義は下記のようになります。

```yaml
apiVersion: node.k8s.io/v1beta1  # RuntimeClassはnode.k8s.ioというAPIグループで定義されます。
kind: RuntimeClass
metadata:
  name: myclass  # RuntimeClass名
  # RuntimeClassはネームスペースなしのリソースです。
handler: myconfiguration  # 対応するCRI設定
```

{{< note >}}
RuntimeClassの書き込み操作(create/update/patch/delete)はクラスター管理者のみに制限されることを推奨します。
これはたいていデフォルトで有効となっています。さらなる詳細に関しては[Authorization
Overview](/docs/reference/access-authn-authz/authorization/)を参照してください。
{{< /note >}}

### 使用例

一度RuntimeClassがクラスターに対して設定されると、それを使用するのは非常に簡単です。PodSpecの`runtimeClassName`を指定してください。  
例えば

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  runtimeClassName: myclass
  # ...
```

これは、Kubeletに対してPodを稼働させるためのRuntimeClassを使うように指示します。もし設定されたRuntimeClassが存在しない場合や、CRIが対応するハンドラーを実行できない場合、そのPodは`Failed`という[フェーズ](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase)になります。
エラーメッセージに関しては対応する[イベント](/docs/tasks/debug-application-cluster/debug-application-introspection/)を参照して下さい。

もし`runtimeClassName`が指定されていない場合、デフォルトのRuntimeHandlerが使用され、これはRuntimeClassの機能が無効であるときのふるまいと同じものとなります。

### CRIの設定

CRIランタイムのセットアップに関するさらなる詳細は、[CRIのインストール](/docs/setup/cri/)を参照してください。

#### dockershim

Kubernetesのビルトインのdockershim CRIは、ランタイムハンドラーをサポートしていません。

#### [containerd](https://containerd.io/)

ランタイムハンドラーは、`/etc/containerd/config.toml`にあるcontainerdの設定ファイルにより設定されます。
正しいハンドラーは、その`runtime`セクションで設定されます。

```
[plugins.cri.containerd.runtimes.${HANDLER_NAME}]
```

containerdの設定に関する詳細なドキュメントは下記を参照してください。  
https://github.com/containerd/cri/blob/master/docs/config.md

#### [cri-o](https://cri-o.io/)

ランタイムハンドラーは、`/etc/crio/crio.conf`にあるcri-oの設定ファイルにより設定されます。
正しいハンドラーは[crio.runtime
table](https://github.com/kubernetes-sigs/cri-o/blob/master/docs/crio.conf.5.md#crioruntime-table)で設定されます。

```
[crio.runtime.runtimes.${HANDLER_NAME}]
  runtime_path = "${PATH_TO_BINARY}"
```

cri-oの設定に関する詳細なドキュメントは下記を参照してください。  
https://github.com/kubernetes-sigs/cri-o/blob/master/cmd/crio/config.go


### RutimeClassをα版からβ版にアップグレードする

RuntimeClassのβ版の機能は、下記の変更点を含みます。

- `node.k8s.io`APIグループと`runtimeclasses.node.k8s.io`リソースはCustomResourceDefinitionからビルトインAPIへとマイグレーションされました。
- `spec`はRuntimeClassの定義内にインライン化されました(RuntimeClassSpecはすでにありません)。
- `runtimeHandler`フィールドは`handler`にリネームされました。
- `handler`フィールドは、全てのAPIバージョンにおいて必須となりました。これはα版のAPIでの`runtimeHandler`フィールドもまた必須であることを意味します。
- `handler`フィールドは正しいDNSラベルの形式である必要があり([RFC 1123](https://tools.ietf.org/html/rfc1123))、これは`.`文字はもはや含むことができないことを意味します(全てのバージョンにおいて)。有効なハンドラー名は、次の正規表現に従います。`^[a-z0-9]([-a-z0-9]*[a-z0-9])?$`

**Action Required:** 次のアクションはRuntimeClassのα版からβ版へのアップグレードにおいて対応が必須です。

- RuntimeClassリソースはKubernetes v1.14にアップグレードされた*後に* 再作成されなくてはなりません。そして`runtimeclasses.node.k8s.io`というCRDは手動で削除されるべきです。  
  ```
  kubectl delete customresourcedefinitions.apiextensions.k8s.io runtimeclasses.node.k8s.io
  ```
- `runtimeHandler`の指定がないか、もしくは空文字の場合や、ハンドラー名に`.`文字列が使われている場合はα版のRuntimeClassにおいてもはや有効ではありません。正しい形式のハンドラー設定に変更しなくてはなりません(先ほど記載した内容を確認ください)。

{{% /capture %}}
