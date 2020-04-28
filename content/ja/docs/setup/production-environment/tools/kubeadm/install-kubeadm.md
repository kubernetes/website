---
title: kubeadmのインストール
content_template: templates/task
weight: 20
card:
  name: setup
  weight: 20
  title: kubeadmセットアップツールのインストール
---

{{% capture overview %}}

<img src="https://raw.githubusercontent.com/kubernetes/kubeadm/master/logos/stacked/color/kubeadm-stacked-color.png" align="right" width="150px">
このページでは`kubeadm`コマンドをインストールする方法を示します。このインストール処理実行後にkubeadmを使用してクラスターを作成する方法については、[kubeadmを使用したシングルマスタークラスターの作成](/ja/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)を参照してください。

{{% /capture %}}

{{% capture prerequisites %}}

* 次のいずれかが動作しているマシンが必要です
  - Ubuntu 16.04+
  - Debian 9+
  - CentOS 7
  - Red Hat Enterprise Linux (RHEL) 7
  - Fedora 25+
  - HypriotOS v1.0.1+
  - Container Linux (tested with 1800.6.0)
* 1台あたり2GB以上のメモリ(2GBの場合、アプリ用のスペースはほとんどありません)
* 2コア以上のCPU
* クラスター内のすべてのマシン間で通信可能なネットワーク(パブリックネットワークでもプライベートネットワークでも構いません)
* ユニークなhostname、MACアドレス、とproduct_uuidが各ノードに必要です。詳細は[ここ](#MACアドレスとproduct_uuidが全てのノードでユニークであることの検証)を参照してください。
* マシン内の特定のポートが開いていること。詳細は[ここ](#必須ポートの確認)を参照してください。
* Swapがオフであること。kubeletが正常に動作するためにはswapは**必ず**オフでなければなりません。

{{% /capture %}}

{{% capture steps %}}

## MACアドレスとproduct_uuidが全てのノードでユニークであることの検証

* ネットワークインターフェースのMACアドレスは`ip link`もしくは`ifconfig -a`コマンドで取得できます。
* product_uuidは`sudo cat /sys/class/dmi/id/product_uuid`コマンドで確認できます。

ハードウェアデバイスではユニークなアドレスが割り当てられる可能性が非常に高いですが、VMでは同じになることがあります。Kubernetesはこれらの値を使用して、クラスター内のノードを一意に識別します。これらの値が各ノードに固有ではない場合、インストール処理が[失敗](https://github.com/kubernetes/kubeadm/issues/31)することもあります。

## ネットワークアダプタの確認

複数のネットワークアダプターがあり、Kubernetesコンポーネントにデフォルトで到達できない場合、IPルートを追加して、Kubernetesクラスターのアドレスが適切なアダプターを経由するように設定することをお勧めします。

## iptablesがnftablesバックエンドを使用しないようにする

Linuxでは、カーネルのiptablesサブシステムの最新の代替品としてnftablesが利用できます。`iptables`ツールは互換性レイヤーとして機能し、iptablesのように動作しますが、実際にはnftablesを設定します。このnftablesバックエンドは現在のkubeadmパッケージと互換性がありません。(ファイアウォールルールが重複し、`kube-proxy`を破壊するためです。)

もしあなたのシステムの`iptables`ツールがnftablesバックエンドを使用している場合、これらの問題を避けるために`iptables`ツールをレガシーモードに切り替える必要があります。これは、少なくともDebian 10(Buster)、Ubuntu 19.04、Fedora 29、およびこれらのディストリビューションの新しいリリースでのデフォルトです。RHEL 8はレガシーモードへの切り替えをサポートしていないため、現在のkubeadmパッケージと互換性がありません。

{{< tabs name="iptables_legacy" >}}
{{% tab name="Debian or Ubuntu" %}}
```bash
# レガシーバイナリがインストールされていることを確認してください
sudo apt-get install -y iptables arptables ebtables

sudo update-alternatives --set iptables /usr/sbin/iptables-legacy
sudo update-alternatives --set ip6tables /usr/sbin/ip6tables-legacy
sudo update-alternatives --set arptables /usr/sbin/arptables-legacy
sudo update-alternatives --set ebtables /usr/sbin/ebtables-legacy
```
{{% /tab %}}
{{% tab name="Fedora" %}}
```bash
update-alternatives --set iptables /usr/sbin/iptables-legacy
```
{{% /tab %}}
{{< /tabs >}}

## 必須ポートの確認

### マスターノード

| プロトコル | 通信の向き | ポート範囲  | 目的                    | 使用者                    |
|-----------|------------|------------|-------------------------|---------------------------|
| TCP       | Inbound    | 6443*      | Kubernetes API server   | All                       |
| TCP       | Inbound    | 2379-2380  | etcd server client API  | kube-apiserver, etcd      |
| TCP       | Inbound    | 10250      | Kubelet API             | Self, Control plane       |
| TCP       | Inbound    | 10251      | kube-scheduler          | Self                      |
| TCP       | Inbound    | 10252      | kube-controller-manager | Self                      |

### ワーカーノード

| プロトコル | 通信の向き | ポート範囲   | 目的                    | 使用者                  |
|-----------|------------|-------------|-------------------------|-------------------------|
| TCP       | Inbound    | 10250       | Kubelet API             | Self, Control plane     |
| TCP       | Inbound    | 30000-32767 | NodePort Services**     | All                     |

** [NodePort Services](/ja/docs/concepts/services-networking/service/)のデフォルトのポートの範囲

\*の項目は書き換え可能です。そのため、あなたが指定したカスタムポートも開いていることを確認する必要があります。

etcdポートはコントロールプレーンノードに含まれていますが、独自のetcdクラスターを外部またはカスタムポートでホストすることもできます。

使用するPodネットワークプラグイン（以下を参照）のポートも開く必要があります。これは各Podネットワークプラグインによって異なるため、必要なポートについてはプラグインのドキュメントを参照してください。

## ランタイムのインストール

v1.6.0以降、KubernetesはデフォルトでCRI(Container Runtime Interface)の使用を有効にしています。

また、v1.14.0以降、kubeadmは既知のドメインソケットのリストをスキャンして、Linuxノード上のコンテナランタイムを自動的に検出しようとします。検出可能なランタイムとソケットパスは、以下の表に記載されています。

| ランタイム  | ドメインソケット                   |
|------------|----------------------------------|
| Docker     | /var/run/docker.sock             |
| containerd | /run/containerd/containerd.sock  |
| CRI-O      | /var/run/crio/crio.sock          |

Dockerとcontainerdの両方が同時に検出された場合、Dockerが優先されます。Docker 18.09にはcontainerdが同梱されており、両方が検出可能であるため、この仕様が必要です。他の2つ以上のランタイムが検出された場合、kubeadmは適切なエラーメッセージで終了します。

Linux以外のノードでは、デフォルトで使用されるコンテナランタイムはDockerです。

もしコンテナランタイムとしてDockerを選択した場合、`kebelet`内に組み込まれた`dockershim` CRIが使用されます。

その他のCRIに基づくランタイムでは以下を使用します

- [containerd](https://github.com/containerd/cri) (CRI plugin built into containerd)
- [cri-o](https://cri-o.io/)
- [frakti](https://github.com/kubernetes/frakti)

詳細は[CRIのインストール](/ja/docs/setup/production-environment/container-runtimes/)を参照してください。

## kubeadm、kubelet、kubectlのインストール

以下のパッケージをマシン上にインストールしてください

* `kubeadm`: クラスターを起動するコマンドです。

* `kubelet`: クラスター内のすべてのマシンで実行されるコンポーネントです。
     Podやコンテナの起動などを行います。

* `kubectl`: クラスターにアクセスするためのコマンドラインツールです。

kubeadmは`kubelet`や`kubectl`をインストールまたは管理**しない**ため、kubeadmにインストールするKubernetesコントロールプレーンのバージョンと一致させる必要があります。そうしないと、予期しないバグのある動作につながる可能性のあるバージョン差異(version skew)が発生するリスクがあります。ただし、kubeletとコントロールプレーン間のマイナーバージョン差異(minor version skew)は_1つ_サポートされていますが、kubeletバージョンがAPIサーバーのバージョンを超えることはできません。たとえば、1.7.0を実行するkubeletは1.8.0 APIサーバーと完全に互換性がありますが、その逆はできません。

`kubectl`のインストールに関する詳細情報は、[kubectlのインストールおよびセットアップ](/ja/docs/tasks/tools/install-kubectl/)を参照してください。

{{< warning >}}
これらの手順はシステムアップグレードによるすべてのKubernetesパッケージの更新を除きます。これはkubeadmとKubernetesが[アップグレードにおける特別な注意](docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)を必要とするからです。
{{</ warning >}}

バージョン差異(version skew)に関しては下記を参照してください。

* Kubernetes [Kubernetesバージョンとバージョンスキューサポートポリシー](/ja/docs/setup/release/version-skew-policy/)
* Kubeadm-specific [バージョン互換ポリシー](/ja/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#version-skew-policy)

{{< tabs name="k8s_install" >}}
{{% tab name="Ubuntu, Debian or HypriotOS" %}}
```bash
sudo apt-get update && sudo apt-get install -y apt-transport-https curl
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
cat <<EOF | sudo tee /etc/apt/sources.list.d/kubernetes.list
deb https://apt.kubernetes.io/ kubernetes-xenial main
EOF
sudo apt-get update
sudo apt-get install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl
```
{{% /tab %}}
{{% tab name="CentOS, RHEL or Fedora" %}}
```bash
cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
EOF

# Set SELinux in permissive mode (effectively disabling it)
setenforce 0
sed -i 's/^SELINUX=enforcing$/SELINUX=permissive/' /etc/selinux/config

yum install -y kubelet kubeadm kubectl --disableexcludes=kubernetes

systemctl enable --now kubelet
```

  **Note:**

  - Setting SELinux in permissive mode by running `setenforce 0` and `sed ...` effectively disables it.
    This is required to allow containers to access the host filesystem, which is needed by pod networks for example.
    You have to do this until SELinux support is improved in the kubelet.
  - Some users on RHEL/CentOS 7 have reported issues with traffic being routed incorrectly due to iptables being bypassed. You should ensure
    `net.bridge.bridge-nf-call-iptables` is set to 1 in your `sysctl` config, e.g.

    ```bash
    cat <<EOF > /etc/sysctl.d/k8s.conf
    net.bridge.bridge-nf-call-ip6tables = 1
    net.bridge.bridge-nf-call-iptables = 1
    EOF
    sysctl --system
    ```
  - Make sure that the `br_netfilter` module is loaded before this step. This can be done by running `lsmod | grep br_netfilter`. To load it explicitly call `modprobe br_netfilter`.
{{% /tab %}}
{{% tab name="Container Linux" %}}
Install CNI plugins (required for most pod network):

```bash
CNI_VERSION="v0.8.2"
mkdir -p /opt/cni/bin
curl -L "https://github.com/containernetworking/plugins/releases/download/${CNI_VERSION}/cni-plugins-linux-amd64-${CNI_VERSION}.tgz" | tar -C /opt/cni/bin -xz
```

Install crictl (required for kubeadm / Kubelet Container Runtime Interface (CRI))

```bash
CRICTL_VERSION="v1.16.0"
mkdir -p /opt/bin
curl -L "https://github.com/kubernetes-sigs/cri-tools/releases/download/${CRICTL_VERSION}/crictl-${CRICTL_VERSION}-linux-amd64.tar.gz" | tar -C /opt/bin -xz
```

Install `kubeadm`, `kubelet`, `kubectl` and add a `kubelet` systemd service:

```bash
RELEASE="$(curl -sSL https://dl.k8s.io/release/stable.txt)"

mkdir -p /opt/bin
cd /opt/bin
curl -L --remote-name-all https://storage.googleapis.com/kubernetes-release/release/${RELEASE}/bin/linux/amd64/{kubeadm,kubelet,kubectl}
chmod +x {kubeadm,kubelet,kubectl}

curl -sSL "https://raw.githubusercontent.com/kubernetes/kubernetes/${RELEASE}/build/debs/kubelet.service" | sed "s:/usr/bin:/opt/bin:g" > /etc/systemd/system/kubelet.service
mkdir -p /etc/systemd/system/kubelet.service.d
curl -sSL "https://raw.githubusercontent.com/kubernetes/kubernetes/${RELEASE}/build/debs/10-kubeadm.conf" | sed "s:/usr/bin:/opt/bin:g" > /etc/systemd/system/kubelet.service.d/10-kubeadm.conf
```

Enable and start `kubelet`:

```bash
systemctl enable --now kubelet
```
{{% /tab %}}
{{< /tabs >}}

kubeadmが何をすべきか指示するまで、kubeletはクラッシュループで数秒ごとに再起動します。

## マスターノードのkubeletによって使用されるcgroupドライバーの設定

Dockerを使用した場合、kubeadmは自動的にkubelet向けのcgroupドライバーを検出し、それを実行時に`/var/lib/kubelet/kubeadm-flags.env`ファイルに設定します。

もしあなたが異なるCRIを使用している場合、`/etc/default/kubelet`(CentOS、RHEL、Fedoraでは`/etc/sysconfig/kubelet`)ファイル内の`cgroup-driver`の値を以下のように変更する必要があります。

```bash
KUBELET_EXTRA_ARGS=--cgroup-driver=<value>
```

このファイルは、kubeletの追加のユーザー定義引数を取得するために、`kubeadm init`および`kubeadm join`によって使用されます。

CRIのcgroupドライバーが`cgroupfs`でない場合に**のみ**それを行う必要があることに注意してください。なぜなら、これは既にkubeletのデフォルト値であるためです。

kubeletをリスタートする方法:

```bash
systemctl daemon-reload
systemctl restart kubelet
```

CRI-Oやcontainerdといった他のコンテナランタイムのcgroup driverは実行中に自動的に検出されます。

## トラブルシュート

kubeadmで問題が発生した場合は、[トラブルシューティング](/ja/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/)を参照してください。

{{% capture whatsnext %}}

* [kubeadmを使用したシングルコントロールプレーンクラスターの作成](/ja/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)

{{% /capture %}}
