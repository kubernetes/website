---
layout: blog
title: 'Kubernetesでコンテナを別ファイルシステムに格納する設定方法'
date: 2024-01-23
slug: kubernetes-separate-image-filesystem
author: >
  Kevin Hannon (Red Hat)
translator: >
  Taisuke Okamoto (IDCフロンティア),
  [Junya Okabe](https://github.com/Okabe-Junya) (筑波大学),
  nasa9084 (LINEヤフー)
---

Kubernetesクラスターの稼働、運用する上でよくある問題は、ディスク容量が不足することです。
ノードがプロビジョニングされる際には、コンテナイメージと実行中のコンテナのために十分なストレージスペースを確保することが重要です。
通常、[コンテナランタイム](/ja/docs/setup/production-environment/container-runtimes/)は`/var`に書き込みます。
これは別のパーティションとして、ルートファイルシステム上に配置できます。
CRI-Oはデフォルトで、コンテナとイメージを`/var/lib/containers`に書き込みますが、containerdはコンテナとイメージを`/var/lib/containerd`に書き込みます。

このブログ記事では、コンテナランタイムがデフォルトのパーティションとは別にコンテンツを保存する方法に注目したいと思います。
これにより、Kubernetesの設定をより柔軟に行うことができ、デフォルトのファイルシステムはそのままに、コンテナストレージ用に大きなディスクを追加する方法が提供されます。

もう少し説明が必要な領域は、Kubernetesがディスクに書き込む場所/内容です。

## Kubernetesディスク使用状況を理解する

Kubernetesには永続(persistent)データと一時(ephemeral)データがあります。
kubeletとローカルのKubernetes固有ストレージのベースパスは設定可能ですが、通常は`/var/lib/kubelet`と想定されています。
Kubernetesのドキュメントでは、これは時々ルートファイルシステムまたはノードファイルシステムと呼ばれます。
このデータの大部分は、次のようにカテゴリー分けされます。

- エフェメラルストレージ
- ログ
- コンテナランタイム

ルート/ノード・ファイルシステムは`/`ではなく、`/var/lib/kubelet`があるディスクのため、ほとんどのPOSIXシステムとは異なります。

### エフェメラルストレージ

Podやコンテナは、動作に一時的または短期的なローカルストレージを必要とする場合があります。
エフェメラルストレージの寿命は個々のPodの寿命を超えず、エフェメラルストレージはPod間で共有することはできません。

### ログ

デフォルトでは、Kubernetesは各実行中のコンテナのログを`/var/log`内のファイルとして保存します。
これらのログは一時的であり、ポッドが実行されている間に大きくなりすぎないようにkubeletによって監視されます。

各ノードの[ログローテーション](/ja/docs/concepts/cluster-administration/logging/#log-rotation)設定をカスタマイズしてこれらのログのサイズを管理し、ノードローカルストレージに依存しないためにログの配信を設定することができます(サードパーティーのソリューションを使用)。

### コンテナランタイム

コンテナランタイムには、コンテナとイメージのための2つの異なるストレージ領域があります。

- 読み取り専用レイヤー:イメージは通常、コンテナが実行されている間に変更されないため、読み取り専用レイヤーとして表されます。読み取り専用レイヤーには、複数のレイヤーが組み合わされて単一の読み取り専用レイヤーになることがあります。コンテナがファイルシステムに書き込んでいる場合、コンテナの上にはエフェメラルストレージを提供する薄いレイヤーがあります。

- 書き込み可能レイヤー:コンテナランタイムによっては、ローカルの書き込みがレイヤー化された書き込みメカニズム(たとえば、Linux上の`overlayfs`やWindows上のCimFS)として実装されることがあります。これは書き込み可能レイヤーと呼ばれます。ローカルの書き込みは、コンテナイメージの完全なクローンで初期化された書き込み可能なファイルシステムを使用する場合もあります。これは、ハイパーバイザ仮想化に基づく一部のランタイムで使用されます。

コンテナランタイムのファイルシステムには、読み取り専用レイヤーと書き込み可能レイヤーの両方が含まれます。これはKubernetesドキュメントでは`imagefs`と見なされています。

## コンテナランタイムの構成

### CRI-O

CRI-Oは、コンテナランタイムが永続データと一時データをどのように保存するかを制御するためのTOML形式のストレージ構成ファイルを使用します。
CRI-Oは[ストレージライブラリ](https://github.com/containers/storage)を利用します。
一部のLinuxディストリビューションには、ストレージに関するマニュアルエントリ(`man 5 containers-storage.conf`)があります。
ストレージの主な設定は、`/etc/containers/storage.conf`にあり、一時データの場所やルートディレクトリを制御することができます。
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
  - SELinuxが有効になっている場合、これは`/var/lib/containers/storage`と一致させる必要があります
- `runroot`
  - コンテナに対する一時的な読み書きアクセスを提供します
  - これは一時ファイルシステムに配置することを推奨します

ここでは、`/var/lib/containers/storage`に合うようにgraphrootディレクトリのラベルを変更する簡単な方法を紹介します:

```bash
semanage fcontext -a -e /var/lib/containers/storage <YOUR-STORAGE-PATH>
restorecon -R -v <YOUR-STORAGE-PATH>
```

### containerd

コンテナランタイムであるcontainerdは、永続データと一時データの保存先を制御するためのTOML形式の構成ファイルを使用します。構成ファイルのデフォルトパスは、`/etc/containerd/config.toml`にあります。

containerdストレージの関連フィールドは、`root`と`state`です。

- `root`
  - containerdのメタデータのルートディレクトリ
  - デフォルトは`/var/lib/containerd`です
  - また、OSがそれを要求する場合は、ルートにSELinuxラベルも必要です
- `state`
  - containerdの一時データ
  - デフォルトは、`/run/containerd`です

## Kubernetesノードの圧迫による退避

Kubernetesは、コンテナファイルシステムがノードファイルシステムと分離されているかどうかを自動的に検出します。
ファイルシステムを分離する場合、Kubernetesはノードファイルシステムとコンテナランタイムファイルシステムの両方を監視する責任があります。
Kubernetesドキュメントでは、ノードファイルシステムとコンテナランタイムファイルシステムをそれぞれnodefsとimagefsと呼んでいます。
nodefsまたはimagefsのいずれかがディスク容量不足になると、ノード全体がディスク圧迫があると見なされます。
Kubernetesは、まず未使用のコンテナやイメージを削除してスペースを回収し、その後にポッドを追い出すことでスペースを再利用します。
nodefsとimagefsの両方を持つノードでは、kubeletはimagefs上の未使用のコンテナイメージを[ガベージコレクト](/ja/docs/concepts/architecture/garbage-collection/#containers-images)し、nodefsからは終了したポッドとそれらのコンテナを削除します。
nodefsのみが存在する場合、Kubernetesのガベージコレクションには、終了したコンテナ、ポッド、そして未使用のイメージが含まれます。

Kubernetesでは、ディスクがいっぱいかどうかを判断するためのより多くの構成が可能です。
kubelet内の退避マネージャーには、関連する閾値を制御するいくつかの構成設定があります。
ファイルシステムの場合、関連する測定値は`nodefs.available`、`nodefs.inodesfree`、`imagefs.available`、および`imagefs.inodesfree`です。
コンテナランタイム用に専用のディスクがない場合、imagefsは無視されます。

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

`EvictionHard`の値を指定すると、デフォルト値が置き換えられます。
したがって、すべてのシグナルを設定することが重要です。

たとえば、次に示すkubeletの設定は、[退避シグナル](/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals-and-thresholds)と猶予期間オプションを設定するために使用できます。

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

Kubernetesプロジェクトでは、退避のデフォルト設定を使用するか、退避に関連するすべてのフィールドを設定することをお勧めしています。
デフォルト設定を使用するか、独自の`evictionHard`設定を指定できます。
シグナルの設定を忘れると、Kubernetesはそのリソースを監視しません。
管理者やユーザーが遭遇する可能性のある一般的な設定ミスの1つは、新しいファイルシステムを`/var/lib/containers/storage`または`/var/lib/containerd`にマウントすることです。
Kubernetesは別のファイルシステムを検出するため、これを行った場合は`imagefs.inodesfree`と`imagefs.available`が必要に応じて設定に一致していることを確認する必要があります。

もう一つの混乱の領域は、イメージファイルシステムをノードに定義した場合でも、エフェメラルストレージの報告が変わらないことです。
イメージファイルシステム(`imagefs`)は、コンテナイメージのレイヤーを保存するために使用されます。
コンテナが自分自身のルートファイルシステムに書き込む場合、そのローカルな書き込みはコンテナイメージのサイズには含まれません。
コンテナランタイムがこれらのローカルな変更を保存する場所は、ランタイムによって定義されますが、通常はイメージファイルシステムです。
Pod内のコンテナがファイルシステムをバックエンドとする`emptyDir`ボリュームに書き込んでいる場合、これはノードファイルシステムからスペースを使用します。
kubeletは常に、`nodefs`で表されるファイルシステムに基づいてエフェメラルストレージの容量と割り当てを報告します。
これは、実際には一時的な書き込みがイメージファイルシステムに行われている場合に混乱の原因となる可能性があります。

## 今後の課題

[KEP-4191](https://github.com/kubernetes/enhancements/issues/4191)に取り組むことで、エフェメラルの報告の制限を解消し、コンテナランタイムにより多くの構成オプションを提供することが期待されています。
この提案では、Kubernetesは書き込み可能なレイヤーが読み取り専用のレイヤー(イメージ)と分離されているかどうかを検出します。
これにより、書き込み可能なレイヤーを含むすべてのエフェメラルストレージを同じディスクに配置することが可能になります。
また、イメージ用に別のディスクを使用することも可能になります。

## 参加するためにはどうすればよいですか？

参加したい場合は、Kubernetesの[SIG Node](https://github.com/kubernetes/community/tree/master/sig-node)に参加することができます。

フィードバックを共有したい場合は、Slackチャンネルの[#sig-node](https://kubernetes.slack.com/archives/C0BP8PW9G)で行うことができます。
まだそのSlackワークスペースに参加していない場合は、[https://slack.k8s.io/](https://slack.k8s.io/)から招待状を取得できます。

素晴らしいレビューを提供し、貴重な洞察を共有し、トピックのアイデアを提案してくれたすべてのコントリビューターに特別な感謝を捧げます。

- Peter Hunt
- Mrunal Patel
- Ryan Phillips
- Gaurav Singh
