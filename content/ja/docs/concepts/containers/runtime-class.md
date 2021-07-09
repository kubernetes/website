---
reviewers:
title: ランタイムクラス(Runtime Class)
content_type: concept
weight: 20
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.14" state="beta" >}}

このページではRuntimeClassリソースと、runtimeセクションのメカニズムについて説明します。

RuntimeClassはコンテナランタイムの設定を選択するための機能です。そのコンテナランタイム設定はPodのコンテナを稼働させるために使われます。


<!-- body -->

## RuntimeClassを使う動機

異なるPodに異なるRuntimeClassを設定することで、パフォーマンスとセキュリティのバランスをとることができます。例えば、ワークロードの一部に高レベルの情報セキュリティ保証が必要な場合、ハードウェア仮想化を使用するコンテナランタイムで実行されるようにそれらのPodをスケジュールすることを選択できます。その後、追加のオーバーヘッドを犠牲にして、代替ランタイムをさらに分離することでメリットが得られます。

RuntimeClassを使用して、コンテナランタイムは同じで設定が異なるPodを実行することもできます。

## セットアップ

RuntimeClass機能のフィーチャーゲートが有効になっていることを確認してください(デフォルトで有効です)。フィーチャーゲートを有効にする方法については、[フィーチャーゲート](/ja/docs/reference/command-line-tools-reference/feature-gates/)を参照してください。
その`RuntimeClass`のフィーチャーゲートはApiServerとkubeletのどちらも有効になっていなければなりません。

1. ノード上でCRI実装を設定する。(ランタイムに依存)
2. 対応するRuntimeClassリソースを作成する。

### 1. ノード上でCRI実装を設定する

RuntimeClassを通じて利用可能な設定はContainer Runtime Interface (CRI)の実装依存となります。
ユーザーの環境のCRI実装の設定方法は、対応するドキュメント([下記](#cri-configuration))を参照ください。

{{< note >}}
RuntimeClassは、クラスター全体で同じ種類のノード設定であることを仮定しています。(これは全てのノードがコンテナランタイムに関して同じ方法で構成されていることを意味します)。
設定が異なるノードをサポートするには、[スケジューリング](#scheduling)を参照してください。
{{< /note >}}

RuntimeClassの設定は、RuntimeClassによって参照される`ハンドラー`名を持ちます。そのハンドラーは正式なDNS-1123に準拠する形式のラベルでなくてはなりません(英数字 + `-`の文字で構成されます)。

### 2. 対応するRuntimeClassリソースを作成する

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

RuntimeClassオブジェクトの名前は[DNSサブドメイン名](/ja/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)に従う必要があります。


{{< note >}}
RuntimeClassの書き込み操作(create/update/patch/delete)はクラスター管理者のみに制限されることを推奨します。
これはたいていデフォルトで有効となっています。さらなる詳細に関しては[Authorization
Overview](/docs/reference/access-authn-authz/authorization/)を参照してください。
{{< /note >}}

## 使用例

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

これは、Kubeletに対してPodを稼働させるためのRuntimeClassを使うように指示します。もし設定されたRuntimeClassが存在しない場合や、CRIが対応するハンドラーを実行できない場合、そのPodは`Failed`という[フェーズ](/ja/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase)になります。
エラーメッセージに関しては対応する[イベント](/docs/tasks/debug-application-cluster/debug-application-introspection/)を参照して下さい。

もし`runtimeClassName`が指定されていない場合、デフォルトのRuntimeHandlerが使用され、これはRuntimeClassの機能が無効であるときのふるまいと同じものとなります。

### CRIの設定

CRIランタイムのセットアップに関するさらなる詳細は、[CRIのインストール](/docs/setup/cri/)を参照してください。

#### dockershim

Kubernetesのビルトインのdockershim CRIは、ランタイムハンドラーをサポートしていません。

#### {{< glossary_tooltip term_id="containerd" >}}

ランタイムハンドラーは、`/etc/containerd/config.toml`にあるcontainerdの設定ファイルにより設定されます。
正しいハンドラーは、その`runtime`セクションで設定されます。

```
[plugins.cri.containerd.runtimes.${HANDLER_NAME}]
```

containerdの設定に関する詳細なドキュメントは下記を参照してください。  
https://github.com/containerd/cri/blob/master/docs/config.md

#### {{< glossary_tooltip term_id="cri-o" >}}

ランタイムハンドラーは、`/etc/crio/crio.conf`にあるCRI-Oの設定ファイルにより設定されます。
正しいハンドラーは[crio.runtime
table](https://github.com/cri-o/cri-o/blob/master/docs/crio.conf.5.md#crioruntime-table)で設定されます。

```
[crio.runtime.runtimes.${HANDLER_NAME}]
  runtime_path = "${PATH_TO_BINARY}"
```

詳細はCRI-Oの[設定に関するドキュメント](https://raw.githubusercontent.com/cri-o/cri-o/9f11d1d/docs/crio.conf.5.md)を参照してください。

## スケジューリング {#scheduling}

{{< feature-state for_k8s_version="v1.16" state="beta" >}}

Kubernetes 1.16では、RuntimeClassは`scheduling`フィールドを使ったクラスター内での異なる設定をサポートしています。
このフィールドによって、設定されたRuntimeClassをサポートするノードに対してPodがスケジュールされることを保証できます。
スケジューリングをサポートするためにはRuntimeClass [アドミッションコントローラー](/docs/reference/access-authn-authz/admission-controllers/#runtimeclass)を有効にしなければなりません。(1.16ではデフォルトです)

特定のRuntimeClassをサポートしているノードへPodが配置されることを保証するために、各ノードは`runtimeclass.scheduling.nodeSelector`フィールドによって選択される共通のラベルを持つべきです。
RuntimeClassのnodeSelectorはアドミッション機能によりPodのnodeSelectorに統合され、効率よくノードを選択します。
もし設定が衝突した場合は、Pod作成は拒否されるでしょう。

もしサポートされているノードが他のRuntimeClassのPodが稼働しないようにtaint付与されていた場合、RuntimeClassに対して`tolerations`を付与することができます。
`nodeSelector`と同様に、tolerationsはPodのtolerationsにアドミッション機能によって統合され、効率よく許容されたノードを選択します。

ノードの選択とtolerationsについての詳細は[ノード上へのPodのスケジューリング](/ja/docs/concepts/scheduling-eviction/assign-pod-node/)を参照してください。

### Podオーバーヘッド

{{< feature-state for_k8s_version="v1.18" state="beta" >}}

Podが稼働する時に関連する_オーバーヘッド_リソースを指定できます。オーバーヘッドを宣言すると、クラスター(スケジューラーを含む)がPodとリソースに関する決定を行うときにオーバーヘッドを考慮することができます。
Podオーバーヘッドを使うためには、PodOverhead[フィーチャーゲート](/ja/docs/reference/command-line-tools-reference/feature-gates/)を有効にしなければなりません。(デフォルトではonです)

PodのオーバーヘッドはRuntimeClass内の`overhead`フィールドによって定義されます。
このフィールドを使用することで、RuntimeClassを使用して稼働するPodのオーバーヘッドを指定することができ、Kubernetes内部で使用されるオーバーヘッドを確保することができます。


## {{% heading "whatsnext" %}}

- [RuntimeClassデザイン](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/585-runtime-class/README.md)
- [RuntimeClassスケジューリングデザイン](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/585-runtime-class/README.md#runtimeclass-scheduling)
- [Podオーバーヘッド](/docs/concepts/scheduling-eviction/pod-overhead/)のコンセプトを読む
- [PodOverhead機能デザイン](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/20190226-pod-overhead.md)
