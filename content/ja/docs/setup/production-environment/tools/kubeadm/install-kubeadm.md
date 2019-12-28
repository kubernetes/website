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

<img src="https://raw.githubusercontent.com/kubernetes/kubeadm/master/logos/stacked/color/kubeadm-stacked-color.png" align="right" width="150px">このページでは`kubeadm`ツールボックスのインストール方法について示します。

このインストールプロセスを実行した後、kubeadmを使用してクラスターを作成する方法については、[kubeadmを使用したシングルマスタークラスターの作成](/ja/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)のページを参照してください。

{{% /capture %}}

{{% capture prerequisites %}}

* 次のいずれかを実行する1つ以上のマシン:
  - Ubuntu 16.04+
  - Debian 9+
  - CentOS 7
  - Red Hat Enterprise Linux (RHEL) 7
  - Fedora 25+
  - HypriotOS v1.0.1+
  - Container Linux (tested with 1800.6.0)
* マシンごとに2GB以上のRAM（これより少ないと、アプリ用のスペースがほとんどなくなります）
* 2コア以上のCPU
* クラスタ内のすべてのマシン間の完全なネットワーク接続（パブリック、プライベートネットワークどちらでも問題ありません）
* すべてのノードに一意のホスト名、MACアドレス、およびproduct_uuidが割り当てられていること。詳細は[こちら](#MACアドレスとproduct_uuidが全てのノードでユニークであることの検証)をご覧ください
* スワップが無効になっていること。kubeletが正常に機能するには、スワップを**無効にしなければなりません**

{{% /capture %}}

{{% capture steps %}}

## MACアドレスとproduct_uuidが全てのノードでユニークであることの検証

* コマンド`ip link`または`ifconfig -a`を使用して、ネットワークインターフェースのMACアドレスを取得できます
* product_uuidは、コマンド`sudo cat /sys/class/dmi/id/product_uuid`を使用して確認できます

一部の仮想マシンは同じ値を持つ場合がありますが、ハードウェアデバイスには一意のアドレスが割り当てられる可能性が非常に高くなります。Kubernetesはこれらの値を使用して、クラスター内のノードを一意に識別します。

これらの値が各ノードに固有でない場合、インストールプロセスは[失敗](https://github.com/kubernetes/kubeadm/issues/31)する場合があります。

## ネットワークアダプタの確認

複数のネットワークアダプターがあり、Kubernetesコンポーネントがデフォルトルートに到達できない場合、Kubernetesクラスターアドレスが適切なアダプターを経由するようにIPルートを追加することをお勧めします。

## iptablesがnftablesバックエンドを使用しないようにする

Linuxでは、nftablesはカーネルのiptablesサブシステムを置き換えるものとして利用できます。`iptables`ツールは互換レイヤとして動作し、iptablesのように動作しますが、実際にはnftablesを使って設定します。このnftablesバックエンドは現在のkubeadmパッケージと互換性がありません。ファイアウォールルールの重複を引き起こし、`kube-proxy`を破壊します。

システムの`iptables`ツールがnftablesバックエンドを使用している場合、これらの問題を避けるために`iptables`ツールをレガシーモードに切り替える必要があります。これは、少なくともDebian 10(Buster)、Ubuntu 19.04、Fedora 29、およびこれらのディストリビューションの新しいリリースでのデフォルトです。RHEL 8はレガシーモードへの切り替えをサポートしていないため、現在のkubeadmパッケージと互換性がありません。

{{< tabs name="iptables_legacy" >}}
{{% tab name="Debian or Ubuntu" %}}
```bash
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

| プロトコル | 方向       | ポート範囲  | 目的                     | 利用するサービス         |
|----------|------------|-----------|-------------------------|------------------------|
| TCP      | インバウンド | 6443*     | Kubernetes API server   | All                    |
| TCP      | インバウンド | 2379-2380 | etcd server client API  | kube-apiserver, etcd   |
| TCP      | インバウンド | 10250     | Kubelet API             | Self, Control plane    |
| TCP      | インバウンド | 10251     | kube-scheduler          | Self                   |
| TCP      | インバウンド | 10252     | kube-controller-manager | Self                   |

### ワーカーノード


| プロトコル | 方向       | ポート範囲    | 目的                   | 利用するサービス          |
|----------|------------|-------------|-----------------------|-------------------------|
| TCP      | インバウンド | 10250       | Kubelet API           | Self, Control plane     |
| TCP      | インバウンド | 30000-32767 | NodePort Services**   | All                     |

** [NodePortサービス](/docs/concepts/services-networking/service/)のデフォルトのポート範囲

*のマークが付いたポート番号はすべて上書き可能であるため、指定するカスタムポートも開いていることを確認する必要があります。

etcdポートはコントロールプレーンノードに含まれていますが、独自のetcdクラスターを外部またはカスタムポートでホストすることもできます。

使用するPodネットワークプラグイン（以下を参照）も、特定のポートを開く必要があります。 これは各Podネットワークプラグインによって異なるため、必要なポートについてはプラグインのドキュメントを参照してください。

## ランタイムのインストール

v1.6.0以降、KubernetesはデフォルトでCRI（Container Runtime Interface）の使用を有効にしました。

v1.14.0以降、kubeadmは、既知のドメインソケットのリストをスキャンして、Linuxノード上のコンテナランタイムを自動的に検出しようとします。使用可能な検出可能なランタイムとソケットパスは、以下の表に記載されています。

| ランタイム  | ドメインソケット                   |
|------------|---------------------------------|
| Docker     | /var/run/docker.sock            |
| containerd | /run/containerd/containerd.sock |
| CRI-O      | /var/run/crio/crio.sock         |

Dockerとcontainerdの両方が同時に検出された場合、Dockerが優先されます。Docker 18.09にはcontainerdが同梱されており、両方が検出可能であるためです。他の2つ以上のランタイムが検出された場合、kubeadmは適切なエラーメッセージで終了します。

Linux以外のノードでは、デフォルトで使用されるコンテナランタイムはDockerです。

選択したコンテナランタイムがDockerである場合、`kubelet`内にある組み込みの`dockershim`というCRI実装を通じてランタイムが使用されます。

他のCRIベースのランタイムには以下のようなものがあります:

- [containerd](https://github.com/containerd/cri) (CRI plugin built into containerd)
- [cri-o](https://cri-o.io/)
- [frakti](https://github.com/kubernetes/frakti)

詳細は[CRIのインストール](/ja/docs/setup/cri)をご覧ください。

## kubeadm、kubelet、kubectlのインストール

これらのパッケージをすべてのマシンにインストールします:

* `kubeadm`: クラスターをブートストラップするコマンドです

* `kubelet`: クラスター内のすべてのマシンで実行され、Podやコンテナの起動などを行うコンポーネントです

* `kubectl`: クラスターと通信するために使用するコマンドラインユーティリティです

kubeadmは`kubelet`や`kubectl`を **インストールまたは管理しません** ので、kubeadmでインストールするKubernetesコントロールプレーンのバージョンと一致させる必要があります。そうしないと、予期しないバグのある動作につながる可能性のあるバージョンスキューが発生するリスクがあります。ただし、kubeletとコントロールプレーン間の1マイナーバージョンスキューはサポートされていますが、kubeletバージョンはAPIサーバーのバージョンを超えることはできません。たとえば、1.7.0を実行するkubeletは1.8.0 APIサーバーと完全に互換性がありますが、その逆はできません。

`kubectl`のインストールに関する詳細は[kubectlのインストールおよびセットアップ](/ja/docs/tasks/tools/install-kubectl/)をご覧ください。

{{< warning >}}
これらの手順は、システムのアップグレードからすべてのKubernetesパッケージを除外します。
これは、kubeadmとKubernetesが[アップグレードに特別な注意](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade-1-14/)を必要とするためです。
{{</ warning >}}

バージョンスキューに関する詳細は以下をご覧ください:

* Kubernetes[バージョンとバージョンスキューサポートポリシー](/ja/docs/setup/release/version-skew-policy/)
* Kubeadm固有の[バージョンスキューポリシー](/ja/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#version-skew-policy)

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

# SELinuxをpermissiveモードに設定します（実質的に無効にします）
setenforce 0
sed -i 's/^SELINUX=enforcing$/SELINUX=permissive/' /etc/selinux/config

yum install -y kubelet kubeadm kubectl --disableexcludes=kubernetes

systemctl enable --now kubelet
```

  **注意:**

  - 「`setenforce 0`と`sed ...`を実行してSELinuxをpermissiveモードに設定すると、SELinuxは事実上無効になります。これは、コンテナがホストファイルシステムにアクセスする等の場合、Podネットワークに必要です。kubeletにおけるSELinux対応が改善されるまで、これを行う必要があります。
  - RHEL/CentOS 7の一部のユーザーは、iptablesがバイパスされているため、トラフィックが正しくルーティングされないという問題を報告しています。`sysctl`で` net.bridge.bridge-nf-call-iptables`が1に設定されていることを確認する必要があります。

    ```bash
    cat <<EOF >  /etc/sysctl.d/k8s.conf
    net.bridge.bridge-nf-call-ip6tables = 1
    net.bridge.bridge-nf-call-iptables = 1
    EOF
    sysctl --system
    ```
  - このステップの前に `br_netfilter`モジュールがロードされていることを確認してください。これは `lsmod | grep br_netfilter`によって実行されます。明示的にロードするには、 `modprobe br_netfilter`を呼び出します。
{{% /tab %}}
{{% tab name="Container Linux" %}}
CNIプラグインをインストールします（ほとんどのポッドネットワークに必要）:

```bash
CNI_VERSION="v0.8.2"
mkdir -p /opt/cni/bin
curl -L "https://github.com/containernetworking/plugins/releases/download/${CNI_VERSION}/cni-plugins-linux-amd64-${CNI_VERSION}.tgz" | tar -C /opt/cni/bin -xz
```

crictlのインストール（kubeadm / Kubelet Container Runtime Interface（CRI）に必要）

```bash
CRICTL_VERSION="v1.16.0"
mkdir -p /opt/bin
curl -L "https://github.com/kubernetes-sigs/cri-tools/releases/download/${CRICTL_VERSION}/crictl-${CRICTL_VERSION}-linux-amd64.tar.gz" | tar -C /opt/bin -xz
```

`kubeadm`、`kubelet`、`kubectl`をインストールし、`kubelet`のsystemdサービスを追加します:

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

`kubelet`を有効にして起動する:

```bash
systemctl enable --now kubelet
```
{{% /tab %}}
{{< /tabs >}}


kubeletはクラッシュループでkubeadmが何をすべきかを指示するのを待つため、数秒ごとに再起動します。

## マスターノードのkubeletによって使用されるcgroupドライバの設定

Dockerを使用する場合、kubeadmはkubeletのcgroupドライバーを自動的に検出し、実行時にそれを`/var/lib/kubelet/kubeadm-flags.env`ファイルに設定します。

別のCRIを使用している場合、`/etc/default/kubelet`（CentOS、RHEL、Fedoraの場合は`/etc/sysconfig/kubelet`）にある`cgroup-driver`の値を変更する必要があります:

```bash
KUBELET_EXTRA_ARGS=--cgroup-driver=<value>
```

このファイルは、kubeletの追加のユーザー定義引数を取得するために、`kubeadm init`および`kubeadm join`によって使用されます。

CRIのcgroupドライバーが`cgroupfs`**でない場合にのみ** それを行う必要があることに注意してください。これは、既にkubeletのデフォルト値が明示されているためです。

kubeletの再起動が必要です:

```bash
systemctl daemon-reload
systemctl restart kubelet
```

CRI-Oやcontainerdなどの他のコンテナランタイム用のcgroupドライバの自動検出は現在鋭意開発中です。


## トラブルシュート

kubeadmで問題が発生した場合は、[トラブルシューティングドキュメント](/ja/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/)を参照してください。

{{% capture whatsnext %}}

* [kubeadmを使用したシングルマスタークラスターの作成](/ja/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)

{{% /capture %}}
