---
title: CRIのインストール
content_template: templates/concept
weight: 100
---
{{% capture overview %}}
Kubernetesでは、v1.6.0からデフォルトでCRI(Container Runtime Interface)を利用できます。
このページでは、様々なCRIのインストール方法について説明します。

{{% /capture %}}

{{% capture body %}}

手順を進めるにあたっては、下記に示しているコマンドを、ご利用のOSのものに従ってrootユーザとして実行してください。
環境によっては、それぞれのホストへSSHで接続した後に`sudo -i`を実行することで、rootユーザになることができる場合があります。

## Docker

それぞれのマシンに対してDockerをインストールします。
バージョン18.06が推奨されていますが、1.11、1.12、1.13、17.03についても動作が確認されています。
Kubernetesのリリースノートにある、Dockerの動作確認済み最新バージョンについてもご確認ください。

システムへDockerをインストールするには、次のコマンドを実行します。

{{< tabs name="tab-cri-docker-installation" >}}
{{< tab name="Ubuntu 16.04" codelang="bash" >}}
# UbuntuのリポジトリからDockerをインストールする場合は次を実行します:
apt-get update
apt-get install -y docker.io

# または、UbuntuやDebian向けのDockerのリポジトリからDocker CE 18.06をインストールする場合は、次を実行します:

## 必要なパッケージをインストールします。
apt-get update && apt-get install apt-transport-https ca-certificates curl software-properties-common

## GPGキーをダウンロードします。
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -

## dockerパッケージ用のaptリポジトリを追加します。
add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"

## dockerをインストールします。
apt-get update && apt-get install docker-ce=18.06.0~ce~3-0~ubuntu

# デーモンをセットアップします。
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

mkdir -p /etc/systemd/system/docker.service.d

# dockerを再起動します。
systemctl daemon-reload
systemctl restart docker
{{< /tab >}}
{{< tab name="CentOS/RHEL 7.4+" codelang="bash" >}}

# CentOSやRHELのリポジトリからDockerをインストールする場合は、次を実行します:
yum install -y docker

# または、CentOS向けのDockerのリポジトリからDocker CE 18.06をインストールする場合は、次を実行します:

## 必要なパッケージをインストールします。
yum install yum-utils device-mapper-persistent-data lvm2

## dockerパッケージ用のyumリポジトリを追加します。
yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo

## dockerをインストールします。
yum update && yum install docker-ce-18.06.1.ce

## /etc/docker ディレクトリを作成します。
mkdir /etc/docker

# デーモンをセットアップします。
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

mkdir -p /etc/systemd/system/docker.service.d

# dockerを再起動します。
systemctl daemon-reload
systemctl restart docker
{{< /tab >}}
{{< /tabs >}}

詳細については、[Dockerの公式インストールガイド](https://docs.docker.com/engine/installation/)を参照してください。

## CRI-O

このセクションでは、CRIランタイムとして`CRI-O`を利用するために必要な手順について説明します。

システムへCRI-Oをインストールするためには以下のコマンドを利用します:

### 必要な設定の追加

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
{{< tab name="Ubuntu 16.04" codelang="bash" >}}

# 必要なパッケージをインストールし、リポジトリを追加
apt-get update
apt-get install software-properties-common

add-apt-repository ppa:projectatomic/ppa
apt-get update

# CRI-Oをインストール
apt-get install cri-o-1.11

{{< /tab >}}
{{< tab name="CentOS/RHEL 7.4+" codelang="bash" >}}

# 必要なリポジトリを追加
yum-config-manager --add-repo=https://cbs.centos.org/repos/paas7-crio-311-candidate/x86_64/os/

# CRI-Oをインストール
yum install --nogpgcheck cri-o

{{< /tab >}}
{{< /tabs >}}

### CRI-Oの起動

```
systemctl start crio
```

詳細については、[CRI-Oインストールガイド](https://github.com/kubernetes-sigs/cri-o#getting-started)を参照してください。

## Containerd

このセクションでは、CRIランタイムとして`containerd`を利用するために必要な手順について説明します。

システムへContainerdをインストールするためには次のコマンドを実行します。

### 必要な設定の追加

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

{{< tabs name="tab-cri-containerd-installation" >}}
{{< tab name="Ubuntu 16.04+" codelang="bash" >}}
apt-get install -y libseccomp2
{{< /tab >}}
{{< tab name="CentOS/RHEL 7.4+" codelang="bash" >}}
yum install -y libseccomp
{{< /tab >}}
{{< /tabs >}}

### containerdのインストール

[Containerdは定期的にリリース](https://github.com/containerd/containerd/releases)されますが、以下に示すコマンドで利用している値は、この手順が作成された時点での最新のバージョンにしたがって書かれています。より新しいバージョンとダウンロードするファイルのハッシュ値については[こちら](https://storage.googleapis.com/cri-containerd-release)で確認するようにしてください。

```shell
# 必要な環境変数をexportします。
export CONTAINERD_VERSION="1.1.2"
export CONTAINERD_SHA256="d4ed54891e90a5d1a45e3e96464e2e8a4770cd380c21285ef5c9895c40549218"

# containerdのtarボールをダウンロードします。
wget https://storage.googleapis.com/cri-containerd-release/cri-containerd-${CONTAINERD_VERSION}.linux-amd64.tar.gz

# ハッシュ値をチェックします。
echo "${CONTAINERD_SHA256} cri-containerd-${CONTAINERD_VERSION}.linux-amd64.tar.gz" | sha256sum --check -

# 解凍して展開します。
tar --no-overwrite-dir -C / -xzf cri-containerd-${CONTAINERD_VERSION}.linux-amd64.tar.gz

# containerdを起動します。
systemctl start containerd
```

## その他のCRIランタイム(rktletおよびfrakti)について

詳細については[Fraktiのクイックスタートガイド](https://github.com/kubernetes/frakti#quickstart)および[Rktletのクイックスタートガイド](https://github.com/kubernetes-incubator/rktlet/blob/master/docs/getting-started-guide.md)を参照してください。

{{% /capture %}}
