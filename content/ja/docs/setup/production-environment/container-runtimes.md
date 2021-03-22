---
title: CRIのインストール
content_type: concept
weight: 10
---
<!-- overview -->
{{< feature-state for_k8s_version="v1.6" state="stable" >}}
Podのコンテナを実行するために、Kubernetesはコンテナランタイムを使用します。
様々なランタイムのインストール手順は次のとおりです。



<!-- body -->


{{< caution >}}
コンテナ実行時にruncがシステムファイルディスクリプターを扱える脆弱性が見つかりました。
悪意のあるコンテナがこの脆弱性を利用してruncのバイナリを上書きし、
コンテナホストシステム上で任意のコマンドを実行する可能性があります。

この問題の更なる情報は[CVE-2019-5736](https://access.redhat.com/security/cve/cve-2019-5736)を参照してください。
{{< /caution >}}

### 適用性

{{< note >}}
このドキュメントはLinuxにCRIをインストールするユーザーのために書かれています。
他のオペレーティングシステムの場合、プラットフォーム固有のドキュメントを見つけてください。
{{< /note >}}

このガイドでは全てのコマンドを `root` で実行します。
例として、コマンドに `sudo` を付けたり、 `root` になってそのユーザーでコマンドを実行します。

### Cgroupドライバー

systemdがLinuxのディストリビューションのinitシステムとして選択されている場合、
initプロセスが作成され、rootコントロールグループ(`cgroup`)を使い、cgroupマネージャーとして行動します。
systemdはcgroupと密接に統合されており、プロセスごとにcgroupを割り当てます。
`cgroupfs` を使うように、あなたのコンテナランライムとkubeletを設定することができます。
systemdと一緒に `cgroupfs` を使用するということは、2つの異なるcgroupマネージャーがあることを意味します。

コントロールグループはプロセスに割り当てられるリソースを制御するために使用されます。
単一のcgroupマネージャーは、割り当てられているリソースのビューを単純化し、
デフォルトでは使用可能なリソースと使用中のリソースについてより一貫性のあるビューになります。
2つのマネージャーがある場合、それらのリソースについて2つのビューが得られます。
kubeletとDockerに `cgroupfs` を使用し、ノード上で実行されている残りのプロセスに `systemd` を使用するように設定されたノードが、
リソース圧迫下で不安定になる場合があります。

コンテナランタイムとkubeletがcgroupドライバーとしてsystemdを使用するように設定を変更することでシステムは安定します。
以下のDocker設定の `native.cgroupdriver=systemd` オプションに注意してください。

{{< caution >}}
すでにクラスターに組み込まれているノードのcgroupドライバーを変更することは非常におすすめしません。
kubeletが一方のcgroupドライバーを使用してPodを作成した場合、コンテナランタイムを別のもう一方のcgroupドライバーに変更すると、そのような既存のPodのPodサンドボックスを再作成しようとするとエラーが発生する可能性があります。
kubeletを再起動しても問題は解決しないでしょう。
ワークロードからノードを縮退させ、クラスターから削除して再び組み込むことを推奨します。
{{< /caution >}}

## Docker

それぞれのマシンに対してDockerをインストールします。
バージョン19.03.11が推奨されていますが、1.13.1、17.03、17.06、17.09、18.06、18.09についても動作が確認されています。
Kubernetesのリリースノートにある、Dockerの動作確認済み最新バージョンについてもご確認ください。

システムへDockerをインストールするには、次のコマンドを実行します。

{{< tabs name="tab-cri-docker-installation" >}}
{{% tab name="Ubuntu 16.04+" %}}

```shell
# (Install Docker CE)
## リポジトリをセットアップ
### HTTPS越しのリポジトリの使用をaptに許可するために、パッケージをインストール
apt-get update && apt-get install -y \
  apt-transport-https ca-certificates curl software-properties-common gnupg2
```

```shell
# Docker公式のGPG鍵を追加:
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
```

```shell
# Dockerのaptレポジトリを追加:
add-apt-repository \
  "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) \
  stable"
```

```shell
# Docker CEのインストール
apt-get update && apt-get install -y \
containerd.io=1.2.13-2 \
docker-ce=5:19.03.11~3-0~ubuntu-$(lsb_release -cs) \
docker-ce-cli=5:19.03.11~3-0~ubuntu-$(lsb_release -cs)
```

```shell
# デーモンをセットアップ
cat > /etc/docker/daemon.json <<EOF
{
  "exec-opts": ["native.cgroupdriver=systemd"],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m"
  },
  "storage-driver": "overlay2"
}
EOF
```

```shell
mkdir -p /etc/systemd/system/docker.service.d
```

```shell
# dockerを再起動
systemctl daemon-reload
systemctl restart docker
```
{{% /tab %}}
{{% tab name="CentOS/RHEL 7.4+" %}}

```shell
# (Docker CEのインストール)
## リポジトリをセットアップ
### 必要なパッケージのインストール
yum install -y yum-utils device-mapper-persistent-data lvm2
```

```shell
## Dockerリポジトリの追加
yum-config-manager --add-repo \
  https://download.docker.com/linux/centos/docker-ce.repo
```

```shell
## Docker CEのインストール
yum update -y && yum install -y \
  containerd.io-1.2.13 \
  docker-ce-19.03.11 \
  docker-ce-cli-19.03.11
```

```shell
## /etc/docker ディレクトリを作成
mkdir /etc/docker
```

```shell
# デーモンをセットアップ
cat > /etc/docker/daemon.json <<EOF
{
  "exec-opts": ["native.cgroupdriver=systemd"],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m"
  },
  "storage-driver": "overlay2",
  "storage-opts": [
    "overlay2.override_kernel_check=true"
  ]
}
EOF
```

```shell
mkdir -p /etc/systemd/system/docker.service.d
```

```shell
# dockerを再起動
systemctl daemon-reload
systemctl restart docker
```
{{% /tab %}}
{{< /tabs >}}

ブート時にDockerサービスを開始させたい場合は、以下のコマンドを入力してください:

```shell
sudo systemctl enable docker
```

詳細については、[Dockerの公式インストールガイド](https://docs.docker.com/engine/installation/)を参照してください。

## CRI-O

このセクションでは、CRIランタイムとして`CRI-O`を利用するために必要な手順について説明します。

システムへCRI-Oをインストールするためには以下のコマンドを利用します:

{{< note >}}
CRI-OのメジャーとマイナーバージョンはKubernetesのメジャーとマイナーバージョンと一致しなければなりません。
詳細は[CRI-O互換性表](https://github.com/cri-o/cri-o)を参照してください。
{{< /note >}}

### 事前準備

```shell
modprobe overlay
modprobe br_netfilter

# 必要なカーネルパラメータの設定をします。これらの設定値は再起動後も永続化されます。
cat > /etc/sysctl.d/99-kubernetes-cri.conf <<EOF
net.bridge.bridge-nf-call-iptables  = 1
net.ipv4.ip_forward                 = 1
net.bridge.bridge-nf-call-ip6tables = 1
EOF

sysctl --system
```

{{< tabs name="tab-cri-cri-o-installation" >}}
{{% tab name="Debian" %}}

 CRI-Oを以下のOSにインストールするには、環境変数$OSを以下の表の適切なフィールドに設定します。

| Operating system | $OS               |
| ---------------- | ----------------- |
| Debian Unstable  | `Debian_Unstable` |
| Debian Testing   | `Debian_Testing`  |

<br />
そして、`$VERSION`にKubernetesのバージョンに合わせたCRI-Oのバージョンを設定します。例えば、CRI-O 1.18をインストールしたい場合は、`VERSION=1.18` を設定します。インストールを特定のリリースに固定することができます。バージョン 1.18.3をインストールするには、`VERSION=1.18:1.18.3` を設定します。
<br />

以下を実行します。
```shell
echo "deb https://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/$OS/ /" > /etc/apt/sources.list.d/devel:kubic:libcontainers:stable.list
echo "deb http://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable:/cri-o:/$VERSION/$OS/ /" > /etc/apt/sources.list.d/devel:kubic:libcontainers:stable:cri-o:$VERSION.list

curl -L https://download.opensuse.org/repositories/devel:kubic:libcontainers:stable:cri-o:$VERSION/$OS/Release.key | apt-key add -
curl -L https://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/$OS/Release.key | apt-key add -

apt-get update
apt-get install cri-o cri-o-runc
```

{{% /tab %}}

{{% tab name="Ubuntu" %}}

 CRI-Oを以下のOSにインストールするには、環境変数$OSを以下の表の適切なフィールドに設定します。

| Operating system | $OS               |
| ---------------- | ----------------- |
| Ubuntu 20.04     | `xUbuntu_20.04`   |
| Ubuntu 19.10     | `xUbuntu_19.10`   |
| Ubuntu 19.04     | `xUbuntu_19.04`   |
| Ubuntu 18.04     | `xUbuntu_18.04`   |

<br />
次に、`$VERSION`をKubernetesのバージョンと一致するCRI-Oのバージョンに設定します。例えば、CRI-O 1.18をインストールしたい場合は、`VERSION=1.18` を設定します。インストールを特定のリリースに固定することができます。バージョン 1.18.3 をインストールするには、`VERSION=1.18:1.18.3` を設定します。
<br />

以下を実行します。
```shell
echo "deb https://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/$OS/ /" > /etc/apt/sources.list.d/devel:kubic:libcontainers:stable.list
echo "deb http://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable:/cri-o:/$VERSION/$OS/ /" > /etc/apt/sources.list.d/devel:kubic:libcontainers:stable:cri-o:$VERSION.list

curl -L https://download.opensuse.org/repositories/devel:kubic:libcontainers:stable:cri-o:$VERSION/$OS/Release.key | apt-key add -
curl -L https://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/$OS/Release.key | apt-key add -

apt-get update
apt-get install cri-o cri-o-runc
```
{{% /tab %}}

{{% tab name="CentOS" %}}

 CRI-Oを以下のOSにインストールするには、環境変数$OSを以下の表の適切なフィールドに設定します。

| Operating system | $OS               |
| ---------------- | ----------------- |
| Centos 8         | `CentOS_8`        |
| Centos 8 Stream  | `CentOS_8_Stream` |
| Centos 7         | `CentOS_7`        |

<br />
次に、`$VERSION`をKubernetesのバージョンと一致するCRI-Oのバージョンに設定します。例えば、CRI-O 1.18 をインストールしたい場合は、`VERSION=1.18` を設定します。インストールを特定のリリースに固定することができます。バージョン 1.18.3 をインストールするには、`VERSION=1.18:1.18.3` を設定します。
<br />

以下を実行します。
```shell
curl -L -o /etc/yum.repos.d/devel:kubic:libcontainers:stable.repo https://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/$OS/devel:kubic:libcontainers:stable.repo
curl -L -o /etc/yum.repos.d/devel:kubic:libcontainers:stable:cri-o:$VERSION.repo https://download.opensuse.org/repositories/devel:kubic:libcontainers:stable:cri-o:$VERSION/$OS/devel:kubic:libcontainers:stable:cri-o:$VERSION.repo
yum install cri-o
```

{{% /tab %}}

{{% tab name="openSUSE Tumbleweed" %}}

```shell
 sudo zypper install cri-o
```
{{% /tab %}}
{{% tab name="Fedora" %}}

$VERSIONには、Kubernetesのバージョンと一致するCRI-Oのバージョンを設定します。例えば、CRI-O 1.18をインストールしたい場合は、$VERSION=1.18を設定します。
以下のコマンドで、利用可能なバージョンを見つけることができます。
```shell
dnf module list cri-o
```
CRI-OはFedoraの特定のリリースにピン留めすることをサポートしていません。

以下を実行します。
```shell
dnf module enable cri-o:$VERSION
dnf install cri-o
```

{{% /tab %}}
{{< /tabs >}}


### CRI-Oの起動

```shell
systemctl daemon-reload
systemctl start crio
```

詳細については、[CRI-Oインストールガイド](https://github.com/kubernetes-sigs/cri-o#getting-started)を参照してください。

## Containerd

このセクションでは、CRIランタイムとして`containerd`を利用するために必要な手順について説明します。

システムへContainerdをインストールするためには次のコマンドを実行します。

### 必要な設定の追加

```shell
cat > /etc/modules-load.d/containerd.conf <<EOF
overlay
br_netfilter
EOF

modprobe overlay
modprobe br_netfilter

# 必要なカーネルパラメータの設定をします。これらの設定値は再起動後も永続化されます。
cat > /etc/sysctl.d/99-kubernetes-cri.conf <<EOF
net.bridge.bridge-nf-call-iptables  = 1
net.ipv4.ip_forward                 = 1
net.bridge.bridge-nf-call-ip6tables = 1
EOF

sysctl --system
```

### containerdのインストール

{{< tabs name="tab-cri-containerd-installation" >}}
{{% tab name="Ubuntu 16.04" %}}

```shell
# (containerdのインストール)
## リポジトリの設定
### HTTPS越しのリポジトリの使用をaptに許可するために、パッケージをインストール
apt-get update && apt-get install -y apt-transport-https ca-certificates curl software-properties-common
```

```shell
## Docker公式のGPG鍵を追加
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
```

```shell
## Dockerのaptリポジトリの追加
add-apt-repository \
    "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
    $(lsb_release -cs) \
    stable"
```

```shell
## containerdのインストール
apt-get update && apt-get install -y containerd.io
```

```shell
# containerdの設定
mkdir -p /etc/containerd
containerd config default | sudo tee /etc/containerd/config.toml
```

```shell
# containerdの再起動
systemctl restart containerd
```
{{% /tab %}}
{{% tab name="CentOS/RHEL 7.4+" %}}

```shell
# (containerdのインストール)
## リポジトリの設定
### 必要なパッケージのインストール
yum install -y yum-utils device-mapper-persistent-data lvm2
```

```shell
## Dockerのリポジトリの追加
yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo
```

```shell
## containerdのインストール
yum update -y && yum install -y containerd.io
```

```shell
## containerdの設定
mkdir -p /etc/containerd
containerd config default | sudo tee /etc/containerd/config.toml
```

```shell
# containerdの再起動
systemctl restart containerd
```
{{% /tab %}}
{{< /tabs >}}

### systemd

`systemd`のcgroupドライバーを使うには、`/etc/containerd/config.toml`内で`plugins.cri.systemd_cgroup = true`を設定してください。
kubeadmを使う場合は[kubeletのためのcgroupドライバー](/ja/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#マスターノードのkubeletによって使用されるcgroupドライバーの設定)を手動で設定してください。

## その他のCRIランタイム: frakti

詳細については[Fraktiのクイックスタートガイド](https://github.com/kubernetes/frakti#quickstart)を参照してください。


