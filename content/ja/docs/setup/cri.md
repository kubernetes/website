---
title: CRIのインストール
content_template: templates/concept
weight: 100
---
{{% capture overview %}}
{{< feature-state for_k8s_version="v1.6" state="stable" >}}
Podのコンテナを実行するために、Kubernetesはコンテナランタイムを使用します。
様々なランタイムのインストール手順は次のとおりです。

{{% /capture %}}

{{% capture body %}}


{{< caution >}}
コンテナ実行時にruncがシステムファイルディスクリプターを扱える脆弱性が見つかりました。
悪意のあるコンテナがこの脆弱性を利用してruncのバイナリを上書きし、
コンテナホストシステム上で任意のコマンドを実行する可能性があります。

この問題の更なる情報は以下のリンクを参照してください。
[cve-2019-5736 : runc vulnerability](https://access.redhat.com/security/cve/cve-2019-5736)
{{< /caution >}}

### 適用性

{{< note >}}
このドキュメントはLinuxにCRIをインストールするユーザーの為に書かれています。
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

あなたのコンテナランタイムとkubeletにcgroupドライバーとしてsystemdを使用するように設定を変更することはシステムを安定させました。
以下のDocker設定の `native.cgroupdriver=systemd` オプションに注意してください。

## Docker

それぞれのマシンに対してDockerをインストールします。
バージョン18.06.2が推奨されていますが、1.11、1.12、1.13、17.03、18.09についても動作が確認されています。
Kubernetesのリリースノートにある、Dockerの動作確認済み最新バージョンについてもご確認ください。

システムへDockerをインストールするには、次のコマンドを実行します。

{{< tabs name="tab-cri-docker-installation" >}}
{{< tab name="Ubuntu 16.04" codelang="bash" >}}
# Docker CEのインストール
## リポジトリをセットアップ
### aptパッケージインデックスを更新
    apt-get update

### HTTPS越しのリポジトリの使用をaptに許可するために、パッケージをインストール
    apt-get update && apt-get install apt-transport-https ca-certificates curl software-properties-common

### Docker公式のGPG鍵を追加
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -

### dockerのaptリポジトリを追加
    add-apt-repository \
    "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
    $(lsb_release -cs) \
    stable"

## docker ceのインストール
apt-get update && apt-get install docker-ce=18.06.2~ce~3-0~ubuntu

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
    yum install yum-utils device-mapper-persistent-data lvm2

### dockerパッケージ用のyumリポジトリを追加
yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo

## docker ceのインストール
yum update && yum install docker-ce-18.06.2.ce

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

## その他のCRIランタイム: frakti

詳細については[Fraktiのクイックスタートガイド](https://github.com/kubernetes/frakti#quickstart)を参照してください。

{{% /capture %}}
