---
layout: blog
title: 'Image Filesystem: Configuring Kubernetes to store containers on a separate filesystem'
date: 2024-01-23
slug: kubernetes-separate-image-filesystem
canonicalUrl: https://www.kubernetes.dev/blog/2024/01/15/sig-release-spotlight-2023/
---

**Author:** Kevin Hannon (Red Hat)

Kubernetesクラスターの運用における一般的な問題は、ディスク容量が不足することです。ノードがプロビジョニングされる際には、コンテナイメージと実行中のコンテナのために十分なストレージスペースを確保することが重要です。通常、[コンテナランタイム](/ja/docs/setup/production-environment/container-runtimes/)は `/var` に書き込みます。これは別のパーティションにあるか、ルートファイルシステム上にあるかもしれません。CRI-Oはデフォルトで、コンテナとイメージを `/var/lib/containers` に書き込みますが、containerdはコンテナとイメージを `/var/lib/containerd` に書き込みます。

このブログ記事では、コンテナランタイムがデフォルトのパーティションとは別にコンテンツを保存する方法に注意を向けたいと思います。これにより、Kubernetesの設定をより柔軟に行うことができ、デフォルトのファイルシステムを触らずにコンテナストレージ用により大きなディスクを追加することができます。

もう少し説明が必要な領域は、Kubernetesがディスクに書き込む場所/内容です。

## Kubernetesディスク使用状況の理解

Kubernetesには永続データと一時データがあります。kubeletとローカルのKubernetes固有ストレージのベースパスは設定可能ですが、通常は `/var/lib/kubelet` と想定されています。Kubernetesのドキュメントでは、これは時々ルートまたはノードファイルシステムと呼ばれます。このデータの大部分は、次のようにカテゴリー分けされます。

- 一時的なストレージ
- ログ
- コンテナランタイム

これは、ほとんどのPOSIXシステムとは異なります。ルート/ノードファイルシステムは `/` ではなく、`/var/lib/kubelet` があるディスクです。

### 一時的なストレージ

ポッドやコンテナは、動作に一時的または短期的なローカルストレージを必要とする場合があります。一時的なストレージの寿命は個々のポッドの寿命を超えず、一時的なストレージはポッド間で共有することはできません。

### ログ

デフォルトでは、Kubernetesは各実行中のコンテナのログを `/var/log` 内のファイルとして保存します。これらのログは一時的であり、ポッドが実行されている間に大きくなりすぎないように kubelet によって監視されます。

各ノードの[ログローテーション](/docs/concepts/cluster-administration/logging/#log-rotation)設定をカスタマイズしてこれらのログのサイズを管理し、ノードローカルストレージに依存せずにログの配信を設定することができます（サードパーティーのソリューションを使用）。

### コンテナランタイム

コンテナランタイムには、コンテナとイメージのための2つの異なるストレージ領域があります。

-読み取り専用レイヤー：イメージは通常、コンテナが実行されている間に変更されないため、読み取り専用レイヤーとして表されます。読み取り専用レイヤーには、複数のレイヤーが組み合わされて単一の読み取り専用レイヤーになることがあります。コンテナがファイルシステムに書き込んでいる場合、コンテナの上には一時的なストレージを提供する薄いレイヤーがあります。

- 書き込み可能レイヤー：コンテナランタイムによっては、ローカルの書き込みがレイヤー化された書き込みメカニズム（例えば、Linux上の`overlayfs`やWindows上のCimFS）として実装されることがあります。これは書き込み可能レイヤーと呼ばれます。ローカルの書き込みは、コンテナイメージの完全なクローンで初期化された書き込み可能なファイルシステムを使用する場合もあります。これは、ハイパーバイザ仮想化に基づく一部のランタイムで使用されます。

コンテナランタイムのファイルシステムには、読み取り専用レイヤーと書き込み可能レイヤーの両方が含まれます。これはKubernetesドキュメントではイメージファイルシステムと見なされています。

## コンテナランタイムの構成

### CRI-O

CRI-Oは、コンテナランタイムが永続データと一時データをどのように保存するかを制御するためのTOML形式のストレージ構成ファイルを使用します。CRI-Oは[ストレージライブラリ](https://github.com/containers/storage)を利用します。
一部のLinuxディストリビューションには、ストレージに関するマニュアルエントリ（`man 5 containers-storage.conf`）があります。ストレージのメイン設定は、`/etc/containers/storage.conf`にあり、一時データの場所やルートディレクトリを制御することができます。
ルートディレクトリは、CRI-Oが永続データを保存する場所です。

```toml
[storage]
# Default storage driver
driver = "overlay"
# Temporary storage location
runroot = "/var/run/containers/storage"
# Primary read/write location of container storage
graphroot = "/var/lib/containers/storage"
```

- `graphroot`
  - コンテナランタイムから保存される永続データを指します
  - SELinuxが有効になっている場合、これは `/var/lib/containers/storage` と一致する必要があります
- `runroot`
  - コンテナに対する一時的な読み書きアクセスを提供します
  - これは一時ファイルシステムに配置することを推奨します

以下は、graphrootディレクトリを `/var/lib/containers/storage` に一致させる簡単な方法です：

```bash
semanage fcontext -a -e /var/lib/containers/storage <YOUR-STORAGE-PATH>
restorecon -R -v <YOUR-STORAGE-PATH>
```

### containerd

コンテナランタイムであるcontainerdは、永続データと一時データの保存先を制御するためのTOML形式の構成ファイルを使用します。構成ファイルのデフォルトパスは、`/etc/containerd/config.toml` にあります。

containerdストレージの関連フィールドは、`root`と`state`です。

- `root`
  - containerdのメタデータのルートディレクトリ
  - デフォルトは `/var/lib/containerd` です
  - また、OSがそれを要求する場合は、ルートにSELinuxラベルも必要です
- `state`
  - containerdの一時データ
  - デフォルトは、`/run/containerd` です

## Kubernetesノードの圧力による退避

Kubernetesは、コンテナファイルシステムがノードファイルシステムと分離されているかどうかを自動的に検出します。ファイルシステムを分離する場合、Kubernetesはノードファイルシステムとコンテナランタイムファイルシステムの両方を監視する責任があります。Kubernetesドキュメントでは、ノードファイルシステムとコンテナランタイムファイルシステムをそれぞれnodefsとimagefsと呼んでいます。nodefsまたはimagefsのいずれかがディスク容量不足になると、ノード全体がディスク圧力があると見なされます。Kubernetesは、まず未使用のコンテナやイメージを削除してスペースを回収し、その後にポッドを追い出すことでスペースを再利用します。nodefsとimagefsの両方を持つノードでは、kubeletはimagefs上の未使用のコンテナイメージを[ガベージコレクト](/docs/concepts/architecture/garbage-collection/#containers-images)し、nodefsからは死んだポッドとそれらのコンテナを削除します。nodefsのみが存在する場合、Kubernetesのガベージコレクションには、死んだコンテナ、死んだポッド、未使用のイメージが含まれます。

Kubernetesでは、ディスクがいっぱいかどうかを判断するためのより多くの構成が可能です。
kubelet内の追い出しマネージャには、関連する閾値を制御するいくつかの構成設定があります。ファイルシステムの場合、関連する測定値は`nodefs.available`、`nodefs.inodesfree`、`imagefs.available`、およびimagefs.inodesfreeです。コンテナランタイム用に専用のディスクがない場合、imagefsは無視されます。

ユーザーは、既存のデフォルト値を使用できます:

- `memory.available` < 100MiB
- `nodefs.available` < 10%
- `imagefs.available` < 15%
- `nodefs.inodesFree` < 5% (Linuxノード)

Kubernetesでは、kubeletの構成ファイル内の`EvictionHard`と`EvictionSoft`にユーザー定義の値を設定することができます。

`EvictionHard`
  限界値を定義します。これらの限界値を超えると、Grace Periodなしでポッドが追い出されます。

`EvictionSoft`
  限界値を定義します。これらの限界値を超えると、Grace Periodが設定されたシグナルごとにポッドが追い出されます。

EvictionHardの値を指定すると、デフォルト値が置き換えられます。
したがって、構成ですべてのシグナルを設定することが重要です。

例えば、次のkubelet構成は、[追い出しシグナル](/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals-and-thresholds)とGrace Periodオプションを構成するために使用できます。

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
address: "192.168.0.8"
port: 20250
serializeImagePulls: false
evictionHard:
    memory.available:  "100Mi"
    nodefs.available:  "10%"
    nodefs.inodesFree: "5%"
    imagefs.available: "15%"
    imagefs.inodesFree: "5%"
evictionSoft:
    memory.available:  "100Mi"
    nodefs.available:  "10%"
    nodefs.inodesFree: "5%"
    imagefs.available: "15%"
    imagefs.inodesFree: "5%"
evictionSoftGracePeriod:
    memory.available:  "1m30s"
    nodefs.available:  "2m"
    nodefs.inodesFree: "2m"
    imagefs.available: "2m"
    imagefs.inodesFree: "2m"
evictionMaxPodGracePeriod: 60s
```

## 問題点

Kubernetesプロジェクトでは、退避のデフォルト設定を使用するか、すべてのフィールドを退避のために設定することをお勧めしています。デフォルト設定を使用するか、独自の`evictionHard`設定を指定できます。シグナルを見逃すと、Kubernetesはそのリソースを監視しません。管理者やユーザーが遭遇する可能性のある一般的な設定ミスの1つは、新しいファイルシステムを `/var/lib/containers/storage` または `/var/lib/containerd` にマウントすることです。Kubernetesは別のファイルシステムを検出するため、これを行った場合は `imagefs.inodesfree` と `imagefs.available` が必要に応じて設定に一致していることを確認する必要があります。

もう一つの混乱の領域は、イメージファイルシステムをノードに定義した場合でも、一時的なストレージの報告が変わらないことです。イメージファイルシステム（`imagefs`）は、コンテナイメージのレイヤーを保存するために使用されます。コンテナが自分自身のルートファイルシステムに書き込む場合、そのローカルな書き込みはコンテナイメージのサイズには含まれません。コンテナランタイムがこれらのローカルな変更を保存する場所は、ランタイムによって定義されますが、通常はイメージファイルシステムです。ポッド内のコンテナがファイルシステムをバックエンドとする`emptyDir`ボリュームに書き込んでいる場合、これはノードファイルシステムからスペースを使用します。kubeletは常に、`nodefs`で表されるファイルシステムに基づいて一時的なストレージの容量と割り当てを報告します。これは、実際には一時的な書き込みがイメージファイルシステムに行われている場合に混乱の原因となる可能性があります。

## 今後の課題

[KEP-4191](https://github.com/kubernetes/enhancements/issues/4191)に取り組むことで、一時的なストレージの報告の制限を解消し、コンテナランタイムにより多くの構成オプションを提供することが期待されています。この提案では、Kubernetesは書き込み可能なレイヤーが読み取り専用のレイヤー（イメージ）と分離されているかどうかを検出します。これにより、書き込み可能なレイヤーを含むすべての一時的なストレージを同じディスクに配置することが可能になります。また、イメージ用に別のディスクを使用することも可能になります。

## 参加するためにはどうすればよいですか？

もしKubernetesに参加したいのであれば、Kubernetesの[SIG Node](https://github.com/kubernetes/community/tree/master/sig-node)に参加することがおすすめです。

フィードバックや質問は、私たちの [#sig-node](https://kubernetes.slack.com/archives/C0BP8PW9G) Slack チャンネルで行うことができます。もしSlackワークスペースにまだ参加していない場合は、招待をリクエストすることができます。招待のリンクは [https://slack.k8s.io/](https://slack.k8s.io/) です。

素晴らしいレビューや貴重な洞察を提供してくれたり、トピックのアイデアを提案してくれたすべての貢献者に特別な感謝を申し上げます。あなた方の貢献によって、コミュニティ全体のKubernetesがより良くなることを支えています。

- Peter Hunt
- Mrunal Patel
- Ryan Phillips
- Gaurav Singh
