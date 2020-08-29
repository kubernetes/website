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

この問題の更なる情報は以下のリンクを参照してください。
[cve-2019-5736 : runc vulnerability](https://access.redhat.com/security/cve/cve-2019-5736)
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
バージョン19.03.4が推奨されていますが、1.13.1、17.03、17.06、17.09、18.06、18.09についても動作が確認されています。
Kubernetesのリリースノートにある、Dockerの動作確認済み最新バージョンについてもご確認ください。

システムへDockerをインストールするには、次のコマンドを実行します。

{{< tabs name="tab-cri-docker-installation" >}}
{{< tab name="Ubuntu 16.04+" codelang="bash" >}}
# Docker CEのインストール
## リポジトリをセットアップ
### HTTPS越しのリポジトリの使用をaptに許可するために、パッケージをインストール
apt-get update && apt-get install -y \
  apt-transport-https ca-certificates curl software-properties-common gnupg2

### Docker公式のGPG鍵を追加
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -

### Dockerのaptリポジトリを追加
add-apt-repository \
  "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) \
  stable"

## Docker CEのインストール
apt-get update && apt-get install -y \
  containerd.io=1.2.10-3 \
  docker-ce=5:19.03.4~3-0~ubuntu-$(lsb_release -cs) \
  docker-ce-cli=5:19.03.4~3-0~ubuntu-$(lsb_release -cs)

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

mkdir -p /etc/systemd/system/docker.service.d

# dockerを再起動
systemctl daemon-reload
systemctl restart docker
{{< /tab >}}
{{< tab name="CentOS/RHEL 7.4+" codelang="bash" >}}

# Docker CEのインストール
## リポジトリをセットアップ
### 必要なパッケージのインストール
yum install -y yum-utils device-mapper-persistent-data lvm2

### Dockerリポジトリの追加
yum-config-manager --add-repo \
  https://download.docker.com/linux/centos/docker-ce.repo

## Docker CEのインストール
yum update -y && yum install -y \
  containerd.io-1.2.10 \
  docker-ce-19.03.4 \
  docker-ce-cli-19.03.4

## /etc/docker ディレクトリを作成
mkdir /etc/docker

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

mkdir -p /etc/systemd/system/docker.service.d

# dockerを再起動
systemctl daemon-reload
systemctl restart docker
{{< /tab >}}
{{< /tabs >}}

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
{{< tab name="Debian" codelang="bash" >}}
# Debian Unstable/Sid
echo 'deb http://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/Debian_Unstable/ /' > /etc/apt/sources.list.d/devel:kubic:libcontainers:stable.list
wget -nv https://download.opensuse.org/repositories/devel:kubic:libcontainers:stable/Debian_Unstable/Release.key -O- | sudo apt-key add -

# Debian Testing
echo 'deb http://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/Debian_Testing/ /' > /etc/apt/sources.list.d/devel:kubic:libcontainers:stable.list
wget -nv https://download.opensuse.org/repositories/devel:kubic:libcontainers:stable/Debian_Testing/Release.key -O- | sudo apt-key add -

# Debian 10
echo 'deb http://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/Debian_10/ /' > /etc/apt/sources.list.d/devel:kubic:libcontainers:stable.list
wget -nv https://download.opensuse.org/repositories/devel:kubic:libcontainers:stable/Debian_10/Release.key -O- | sudo apt-key add -

# Raspbian 10
echo 'deb http://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/Raspbian_10/ /' > /etc/apt/sources.list.d/devel:kubic:libcontainers:stable.list
wget -nv https://download.opensuse.org/repositories/devel:kubic:libcontainers:stable/Raspbian_10/Release.key -O- | sudo apt-key add -

# CRI-Oのインストール
sudo apt-get install cri-o-1.17
{{< /tab >}}

{{< tab name="Ubuntu 18.04, 19.04 and 19.10" codelang="bash" >}}
# リポジトリの設定
. /etc/os-release
sudo sh -c "echo 'deb http://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/x${NAME}_${VERSION_ID}/ /' > /etc/apt/sources.list.d/devel:kubic:libcontainers:stable.list"
wget -nv https://download.opensuse.org/repositories/devel:kubic:libcontainers:stable/x${NAME}_${VERSION_ID}/Release.key -O- | sudo apt-key add -
sudo apt-get update

# CRI-Oのインストール
sudo apt-get install cri-o-1.17
{{< /tab >}}

{{< tab name="CentOS/RHEL 7.4+" codelang="bash" >}}
# 必要なパッケージのインストール
yum-config-manager --add-repo=https://cbs.centos.org/repos/paas7-crio-115-release/x86_64/os/

# CRI-Oのインストール
yum install --nogpgcheck -y cri-o
{{< /tab >}}

{{< tab name="openSUSE Tumbleweed" codelang="bash" >}}
sudo zypper install cri-o
{{< /tab >}}
{{< /tabs >}}

### CRI-Oの起動

```
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
{{< tab name="Ubuntu 16.04" codelang="bash" >}}
# containerdのインストール
## リポジトリの設定
### HTTPS越しのリポジトリの使用をaptに許可するために、パッケージをインストール
apt-get update && apt-get install -y apt-transport-https ca-certificates curl software-properties-common

### Docker公式のGPG鍵を追加
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -

### Dockerのaptリポジトリの追加
add-apt-repository \
    "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
    $(lsb_release -cs) \
    stable"

## containerdのインストール
apt-get update && apt-get install -y containerd.io

# containerdの設定
mkdir -p /etc/containerd
containerd config default > /etc/containerd/config.toml

# containerdの再起動
systemctl restart containerd
{{< /tab >}}
{{< tab name="CentOS/RHEL 7.4+" codelang="bash" >}}
# containerdのインストール
## リポジトリの設定
### 必要なパッケージのインストール
yum install -y yum-utils device-mapper-persistent-data lvm2

### Dockerのリポジトリの追加
yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo

## containerdのインストール
yum update -y && yum install -y containerd.io

# containerdの設定
mkdir -p /etc/containerd
containerd config default > /etc/containerd/config.toml

# containerdの再起動
systemctl restart containerd
{{< /tab >}}
{{< /tabs >}}

### systemd

`systemd`のcgroupドライバーを使うには、`/etc/containerd/config.toml`内で`plugins.cri.systemd_cgroup = true`を設定してください。
kubeadmを使う場合は[kubeletのためのcgroupドライバー](/ja/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#マスターノードのkubeletによって使用されるcgroupドライバーの設定)を手動で設定してください。

## その他のCRIランタイム: frakti

詳細については[Fraktiのクイックスタートガイド](https://github.com/kubernetes/frakti#quickstart)を参照してください。


