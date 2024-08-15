---
title: コンテナランタイム
content_type: concept
weight: 20
---
<!-- overview -->

{{% dockershim-removal %}}

クラスター内の各ノードがPodを実行できるようにするため、{{< glossary_tooltip text="コンテナランタイム" term_id="container-runtime" >}}をインストールする必要があります。
このページでは、ノードをセットアップするための概要と関連する作業について説明します。

Kubernetes {{< skew currentVersion >}}においては、{{< glossary_tooltip term_id="cri" text="Container Runtime Interface">}} (CRI)に準拠したランタイムを使用する必要があります。

詳しくは[サポートするCRIのバージョン](#cri-versions)をご覧ください。

このページではいくつかの一般的なコンテナランタイムをKubernetesで使用する方法の概要を説明します。

- [containerd](#containerd)
- [CRI-O](#cri-o)
- [Docker Engine](#docker)
- [Mirantis Container Runtime](#mcr)

{{< note >}}
v1.24以前のKubernetesリリースでは、 _dockershim_ という名前のコンポーネントを使用したDocker Engineとの直接の統合が含まれていました。
この特別な直接統合は、もはやKubernetesの一部ではありません(この削除はv1.20リリースの一部として[発表](/blog/2020/12/08/kubernetes-1-20-release-announcement/#dockershim-deprecation)されています)。
dockershimの廃止がどのような影響を与えるかについては、[dockershim削除の影響範囲を確認する](/ja/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-removal-affects-you/) をご覧ください。
dockershimからの移行について知りたい場合、[dockershimからの移行](/ja/docs/tasks/administer-cluster/migrating-from-dockershim/)を参照してください。

v{{< skew currentVersion >}}以外のバージョンのKubernetesを実行している場合、そのバージョンのドキュメントを確認してください。
{{< /note >}}

<!-- body -->

## インストールと設定の必須要件

以下の手順では、全コンテナランタイムに共通の設定をLinux上のKubernetesノードに適用します。

特定の設定が不要であることが分かっている場合、手順をスキップして頂いて構いません。

詳細については、[Network Plugin Requirements](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/#network-plugin-requirements)または、特定のコンテナランタイムのドキュメントを参照してください。

### IPv4フォワーディングを有効化し、iptablesからブリッジされたトラフィックを見えるようにする

以下のコマンドを実行します。

```bash
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF

sudo modprobe overlay
sudo modprobe br_netfilter

# この構成に必要なカーネルパラメーター、再起動しても値は永続します
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
EOF

# 再起動せずにカーネルパラメーターを適用
sudo sysctl --system
```

以下のコマンドを実行して`br_netfilter`と`overlay`モジュールが読み込まれていることを確認してください。

```bash
lsmod | grep br_netfilter
lsmod | grep overlay
```

以下のコマンドを実行して、`net.bridge.bridge-nf-call-iptables`、`net.bridge.bridge-nf-call-ip6tables`、`net.ipv4.ip_forward`カーネルパラメーターが1に設定されていることを確認します。

```bash
sysctl net.bridge.bridge-nf-call-iptables net.bridge.bridge-nf-call-ip6tables net.ipv4.ip_forward
```

## cgroupドライバー {#cgroup-drivers}

Linuxでは、プロセスに割り当てられるリソースを制約するために{{< glossary_tooltip text="cgroup" term_id="cgroup" >}}が使用されます。

{{< glossary_tooltip text="kubelet" term_id="kubelet" >}}と基盤となるコンテナランタイムは、[コンテナのリソース管理](/ja/docs/concepts/configuration/manage-resources-containers/)を実施し、CPU/メモリーの要求や制限などのリソースを設定するため、cgroupとインターフェースする必要があります。
cgroupとインターフェースするために、kubeletおよびコンテナランタイムは*cgroupドライバー*を使用する必要があります。
この際、kubeletとコンテナランタイムが同一のcgroupドライバーを使用し、同一の設定を適用することが不可欠となります。

利用可能なcgroupドライバーは以下の2つです。

* [`cgroupfs`](#cgroupfs-cgroup-driver)
* [`systemd`](#systemd-cgroup-driver)

### cgroupfsドライバー {#cgroupfs-cgroup-driver}

`cgroupfs`ドライバーは、kubeletのデフォルトのcgroupドライバーです。
`cgroupfs`ドライバーを使用すると、kubeletとコンテナランタイムはcgroupファイルシステムと直接インターフェースし、cgroupを設定します。

[systemd](https://www.freedesktop.org/wiki/Software/systemd/)がinitシステムである場合、`cgroupfs`ドライバーは推奨**されません**。
なぜなら、systemdはシステム上のcgroupマネージャーが単一であると想定しているからです。
また、[cgroup v2](/ja/docs/concepts/architecture/cgroups)を使用している場合は、`cgroupfs`の代わりに`systemd` cgroupドライバーを使用してください。

### systemd cgroupドライバー {#systemd-cgroup-driver}

Linuxディストリビューションのinitシステムに[systemd](https://www.freedesktop.org/wiki/Software/systemd/)が選択されている場合、
initプロセスはルートcgroupを生成・消費し、cgroupマネージャーとして動作します。

systemdはcgroupと密接に連携しており、systemdユニットごとにcgroupを割り当てます。
その結果、initシステムに`systemd`を使用した状態で`cgroupfs`ドライバーを使用すると、
システムには2つの異なるcgroupマネージャーが存在することになります。

2つのcgroupマネージャーが存在することで、システムで利用可能なリソースおよび使用中のリソースに、2つの異なる見え方が与えられることになります。
特定の場合において、kubeletとコンテナランタイムに`cgroupfs`を、残りのプロセスに`systemd`を使用するように設定されたノードが高負荷時に不安定になることがあります。

このような不安定性を緩和するためのアプローチは、systemdがinitシステムに採用されている場合にkubeletとコンテナランタイムのcgroupドライバーとして`systemd`を使用することです。

cgroupドライバーに`systemd`を設定するには、以下のように[`KubeletConfiguration`](/docs/tasks/administer-cluster/kubelet-config-file/)の`cgroupDriver`オプションを編集して`systemd`を設定します。

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
...
cgroupDriver: systemd
```

kubelet用のcgroupドライバーとして`systemd`を設定する場合、コンテナランタイムのcgroupドライバーにも`systemd`を設定する必要があります。
具体的な手順については、以下のリンクなどの、お使いのコンテナランタイムのドキュメントを参照してください。

*  [containerd](#containerd-systemd)
*  [CRI-O](#cri-o)

{{< caution >}}
クラスターに参加したノードのcgroupドライバーを変更するのはデリケートな操作です。
kubeletが特定のcgroupドライバーのセマンティクスを使用してPodを作成していた場合、
コンテナランタイムを別のcgroupドライバーに変更すると、そのような既存のPodに対してPodサンドボックスを再作成しようとしたときにエラーが発生することがあります。
kubeletを再起動してもこのようなエラーは解決しない可能性があります。

もしあなたが適切な自動化の手段を持っているのであれば、更新された設定を使用してノードを別のノードに置き換えるか、自動化を使用して再インストールを行ってください。
{{< /caution >}}

### kubeadmで管理されたクラスターでの`systemd`ドライバーへの移行

既存のkubeadm管理クラスターで`systemd` cgroupドライバーに移行したい場合は、[cgroupドライバーの設定](/ja/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/)に従ってください。

## サポートするCRIのバージョン {#cri-versions}

コンテナランタイムは、Container Runtime Interfaceのv1alpha2以上をサポートする必要があります。

Kubernetes {{< skew currentVersion >}}は、デフォルトでCRI APIのv1を使用します。
コンテナランタイムがv1 APIをサポートしていない場合、kubeletは代わりに(非推奨の)v1alpha2 APIにフォールバックします。

## コンテナランタイム {#container-runtimes}

{{% thirdparty-content %}}

### containerd

このセクションでは、CRIランタイムとしてcontainerdを使用するために必要な手順の概要を説明します。

以下のコマンドを使用して、システムにcontainerdをインストールします:

まずは[containerdの使用を開始する](https://github.com/containerd/containerd/blob/main/docs/getting-started.md)の指示に従ってください。有効な`config.toml`設定ファイルを作成したら、このステップに戻ります。

{{< tabs name="Finding your config.toml file" >}}
{{% tab name="Linux" %}}
このファイルはパス`/etc/containerd/config.toml`にあります。
{{% /tab %}}
{{% tab name="Windows" %}}
このファイルは`C:\Program Files\containerd\config.toml`にあります。
{{% /tab %}}
{{< /tabs >}}

Linuxでは、containerd用のデフォルトのCRIソケットは`/run/containerd/containerd.sock`です。
Windowsでは、デフォルトのCRIエンドポイントは`npipe://./pipe/containerd-containerd`です。

#### `systemd` cgroupドライバーを構成する

`/etc/containerd/config.toml`内で`runc`が`systemd` cgroupドライバーを使うようにするには、次のように設定します。

```
[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc]
  ...
  [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
    SystemdCgroup = true
```

[cgroup v2](/ja/docs/concepts/architecture/cgroups)を使用する場合は`systemd` cgroupドライバーの利用を推奨します。

{{< note >}}
パッケージ(RPMや`.deb`など)からcontainerdをインストールした場合、
CRI統合プラグインがデフォルトで無効になっていることがあります。

Kubernetesでcontainerdを使用するには、CRIサポートを有効にする必要があります。
`/etc/containerd/config.toml`内の`disabled_plugins`リストに`cri`が含まれていないことを確認してください。
このファイルを変更した場合、`containerd`も再起動してください。

クラスターの初回構築後、またはCNIをインストールした後にコンテナのクラッシュループが発生した場合、
パッケージと共に提供されるcontainerdの設定に互換性のないパラメーターが含まれている可能性があります。
[get-started.md](https://github.com/containerd/containerd/blob/main/docs/getting-started.md#advanced-topics)にあるように、
`containerd config default > /etc/containerd/config.toml`でcontainerdの設定をリセットした上で、
上記の設定パラメーターを使用することを検討してください。
{{< /note >}}

この変更を適用した場合、必ずcontainerdを再起動してください。

```shell
sudo systemctl restart containerd
```

kubeadmを使用している場合、手動で[kubelet cgroupドライバーの設定](/ja/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/#configuring-the-kubelet-cgroup-driver)を行ってください。

#### サンドボックス(pause)イメージの上書き {#override-pause-image-containerd}

[containerdの設定](https://github.com/containerd/containerd/blob/main/docs/cri/config.md)で以下の設定をすることで、サンドボックスのイメージを上書きすることができます。

```toml
[plugins."io.containerd.grpc.v1.cri"]
  sandbox_image = "registry.k8s.io/pause:3.2"
```

この場合も、設定ファイルの更新後に`systemctl restart containerd`を実行して`containerd`も再起動する必要があるでしょう。

### CRI-O

本セクションでは、コンテナランタイムとしてCRI-Oをインストールするために必要な手順を説明します。

CRI-Oをインストールするには、[CRI-Oのインストール手順](https://github.com/cri-o/packaging/blob/main/README.md#usage)に従ってください。

#### cgroupドライバー

CRI-Oはデフォルトでsystemd cgroupドライバーを使用し、おそらく問題なく動作します。
`cgroupfs` cgroupドライバーに切り替えるには、`/etc/crio/crio.conf` を編集するか、
`/etc/crio/crio.conf.d/02-cgroup-manager.conf`にドロップイン設定ファイルを置いて、以下のような設定を記述してください。

```toml
[crio.runtime]
conmon_cgroup = "pod"
cgroup_manager = "cgroupfs"
```

上記で`conmon_cgroup`も変更されていることに注意してください。
CRI-Oで`cgroupfs`を使用する場合、ここには`pod`という値を設定する必要があります。
一般に、kubeletのcgroupドライバーの設定(通常はkubeadmによって行われます)とCRI-Oの設定は一致させる必要があります。

CRI-Oの場合、CRIソケットはデフォルトで`/var/run/crio/crio.sock`となります。

#### サンドボックス(pause)イメージの上書き {#override-pause-image-cri-o}

[CRI-Oの設定](https://github.com/cri-o/cri-o/blob/main/docs/crio.conf.5.md)において、以下の値を設定することができます。

```toml
[crio.image]
pause_image="registry.k8s.io/pause:3.6"
```

このオプションはライブ設定リロードによる変更の適用に対応しています。
`systemctl reload crio`または`crio`プロセスに`SIGHUP`を送信することで変更を適用できます。

### Docker Engine {#docker}

{{< note >}}
この手順では、Docker EngineとKubernetesを統合するために[`cri-dockerd`](https://github.com/Mirantis/cri-dockerd)アダプターを使用することを想定しています。
{{< /note >}}

1. 各ノードに、使用しているLinuxディストリビューション用のDockerを[Docker Engineのインストール](https://docs.docker.com/engine/install/#server)に従ってインストールします。

2. [`cri-dockerd`](https://github.com/Mirantis/cri-dockerd)をリポジトリ内の指示に従ってインストールします。

`cri-dockerd`の場合、CRIソケットはデフォルトで`/run/cri-dockerd.sock`になります。

### Mirantis Container Runtime {#mcr}

[Mirantis Container Runtime](https://docs.mirantis.com/mcr/20.10/overview.html)(MCR)は、
以前はDocker Enterprise Editionとして知られていた、商業的に利用可能なコンテナランタイムです。

MCRに含まれるオープンソースの[`cri-dockerd`](https://github.com/Mirantis/cri-dockerd)コンポーネントを使用することで、
Mirantis Container RuntimeをKubernetesで使用することができます。

Mirantis Container Runtimeのインストール方法について知るには、[MCRデプロイガイド](https://docs.mirantis.com/mcr/20.10/install.html)を参照してください。

CRIソケットのパスを見つけるには、systemdの`cri-docker.socket`という名前のユニットを確認してください。

#### サンドボックス(pause)イメージを上書きする {#override-pause-image-cri-dockerd-mcr}

`cri-dockerd`アダプターは、Podインフラコンテナ("pause image")として使用するコンテナイメージを指定するためのコマンドライン引数を受け付けます。
使用するコマンドライン引数は `--pod-infra-container-image`です。

## {{% heading "whatsnext" %}}

コンテナランタイムに加えて、クラスターには動作する[ネットワークプラグイン](/ja/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-network-model)が必要です。
