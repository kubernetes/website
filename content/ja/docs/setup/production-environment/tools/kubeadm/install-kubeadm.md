---
title: kubeadmのインストール
content_type: task
weight: 10
card:
  name: setup
  weight: 20
  title: kubeadmセットアップツールのインストール
---

<!-- overview -->

<img src="/images/kubeadm-stacked-color.png" align="right" width="150px">

このページでは`kubeadm`コマンドをインストールする方法を示します。このインストール処理実行後に kubeadm を使用してクラスターを作成する方法については、[kubeadm を使用したシングルマスタークラスターの作成](/ja/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)を参照してください。

## {{% heading "prerequisites" %}}

- 次のいずれかが動作しているマシンが必要です
  - Ubuntu 16.04+
  - Debian 9+
  - CentOS 7
  - Red Hat Enterprise Linux (RHEL) 7
  - Fedora 25+
  - HypriotOS v1.0.1+
  - Container Linux (tested with 1800.6.0)
- 1 台あたり 2GB 以上のメモリ(2GB の場合、アプリ用のスペースはほとんどありません)
- 2 コア以上の CPU
- クラスター内のすべてのマシン間で通信可能なネットワーク(パブリックネットワークでもプライベートネットワークでも構いません)
- ユニークな hostname、MAC アドレス、と product_uuid が各ノードに必要です。詳細は[ここ](#MACアドレスとproduct_uuidが全てのノードでユニークであることの検証)を参照してください。
- マシン内の特定のポートが開いていること。詳細は[ここ](#必須ポートの確認)を参照してください。
- Swap がオフであること。kubelet が正常に動作するためには swap は**必ず**オフでなければなりません。

<!-- steps -->

## MAC アドレスと product_uuid が全てのノードでユニークであることの検証

- ネットワークインターフェースの MAC アドレスは`ip link`もしくは`ifconfig -a`コマンドで取得できます。
- product_uuid は`sudo cat /sys/class/dmi/id/product_uuid`コマンドで確認できます。

ハードウェアデバイスではユニークなアドレスが割り当てられる可能性が非常に高いですが、VM では同じになることがあります。Kubernetes はこれらの値を使用して、クラスター内のノードを一意に識別します。これらの値が各ノードに固有ではない場合、インストール処理が[失敗](https://github.com/kubernetes/kubeadm/issues/31)することもあります。

## ネットワークアダプタの確認

複数のネットワークアダプターがあり、Kubernetes コンポーネントにデフォルトで到達できない場合、IP ルートを追加して、Kubernetes クラスターのアドレスが適切なアダプターを経由するように設定することをお勧めします。

## 必須ポートの確認

Kubernetes のコンポーネントが互いに通信するためには、これらの[必要なポート](/ja/docs/reference/networking/ports-and-protocols/)が開いている必要があります。
netcat などのツールを使用することで、下記のようにポートが開いているかどうかを確認することが可能です。

```shell
nc 127.0.0.1 6443
```

使用する Pod ネットワークプラグインによっては、特定のポートを開く必要がある場合もあります。
これらは各 Pod ネットワークプラグインによって異なるため、どのようなポートが必要かについては、プラグインのドキュメントを参照してください。

## ランタイムのインストール {#installing-runtime}

Pod のコンテナを実行するために、Kubernetes は{{< glossary_tooltip term_id="container-runtime" text="コンテナランタイム" >}}を使用します。

{{< tabs name="container_runtime" >}}
{{% tab name="Linuxノード" %}}

デフォルトでは、Kubernetes は選択されたコンテナランタイムと通信するために{{< glossary_tooltip term_id="cri" text="Container Runtime Interface">}} (CRI)を使用します。

ランタイムを指定しない場合、kubeadm はよく知られた Unix ドメインソケットのリストをスキャンすることで、インストールされたコンテナランタイムの検出を試みます。
次の表がコンテナランタイムと関連するソケットのパスリストです。

{{< table caption = "コンテナランタイムとソケットパス" >}}
| ランタイム | Unix ドメインソケットのパス |
|------------|-----------------------------------|
| Docker | `/var/run/docker.sock` |
| containerd | `/run/containerd/containerd.sock` |
| CRI-O | `/var/run/crio/crio.sock` |
{{< /table >}}

<br />
Dockerとcontainerdの両方が同時に検出された場合、Dockerが優先されます。Docker 18.09にはcontainerdが同梱されており、両方が検出可能であるため、この仕様が必要です。他の2つ以上のランタイムが検出された場合、kubeadmは適切なエラーメッセージで終了します。

kubelet は、組み込まれた`dockershim`CRI を通して Docker と連携します。

詳細は、[コンテナランタイム](/ja/docs/setup/production-environment/container-runtimes/)を参照してください。
{{% /tab %}}
{{% tab name="その他のOS" %}}
デフォルトでは、kubeadm は{{< glossary_tooltip term_id="docker" >}}をコンテナランタイムとして使用します。
kubelet は、組み込まれた`dockershim`CRI を通して Docker と連携します。

詳細は、[コンテナランタイム](/ja/docs/setup/production-environment/container-runtimes/)を参照してください。
{{% /tab %}}
{{< /tabs >}}

## kubeadm、kubelet、kubectl のインストール

以下のパッケージをマシン上にインストールしてください

- `kubeadm`: クラスターを起動するコマンドです。

- `kubelet`: クラスター内のすべてのマシンで実行されるコンポーネントです。
  Pod やコンテナの起動などを行います。

- `kubectl`: クラスターにアクセスするためのコマンドラインツールです。

kubeadm は`kubelet`や`kubectl`をインストールまたは管理**しない**ため、kubeadm にインストールする Kubernetes コントロールプレーンのバージョンと一致させる必要があります。そうしないと、予期しないバグのある動作につながる可能性のあるバージョン差異(version skew)が発生するリスクがあります。ただし、kubelet とコントロールプレーン間のマイナーバージョン差異(minor version skew)は*1 つ*サポートされていますが、kubelet バージョンが API サーバーのバージョンを超えることはできません。たとえば、1.7.0 を実行する kubelet は 1.8.0 API サーバーと完全に互換性がありますが、その逆はできません。

`kubectl`のインストールに関する詳細情報は、[kubectl のインストールおよびセットアップ](/ja/docs/tasks/tools/install-kubectl/)を参照してください。

{{< warning >}}
これらの手順はシステムアップグレードによるすべての Kubernetes パッケージの更新を除きます。これは kubeadm と Kubernetes が[アップグレードにおける特別な注意](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)を必要とするからです。
{{</ warning >}}

バージョン差異(version skew)に関しては下記を参照してください。

- Kubernetes [Kubernetes バージョンとバージョンスキューサポートポリシー](/ja/docs/setup/release/version-skew-policy/)
- Kubeadm-specific [バージョン互換ポリシー](/ja/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#version-skew-policy)

{{< tabs name="k8s_install" >}}
{{% tab name="Ubuntu、Debian、またはHypriotOS" %}}

1. `apt`のパッケージ一覧を更新し、Kubernetes の`apt`リポジトリを利用するのに必要なパッケージをインストールします:

   ```shell
   sudo apt-get update
   sudo apt-get install -y apt-transport-https ca-certificates curl
   ```

2. Google Cloud の公開鍵をダウンロードします:

   ```shell
   curl -fsSL https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-archive-keyring.gpg
   ```

3. Kubernetes の`apt`リポジトリを追加します:

   ```shell
   echo "deb [signed-by=/etc/apt/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list
   ```

4. `apt`のパッケージ一覧を更新し、kubelet、kubeadm、kubectl をインストールします。そしてバージョンを固定します:

   ```shell
   sudo apt-get update
   sudo apt-get install -y kubelet kubeadm kubectl
   sudo apt-mark hold kubelet kubeadm kubectl
   ```

   {{< note >}}
   Debian 12 や Ubuntu 22.04 より古いリリースでは、`/etc/apt/keyrings`はデフォルトでは存在しません。
   必要に応じてこのディレクトリを作成し、誰でも読み取り可能で、管理者のみ書き込み可能にすることができます。
   {{< /note >}}

{{% /tab %}}
{{% tab name="CentOS、RHEL、またはFedora" %}}

```bash
cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
EOF

# SELinuxをpermissiveモードに設定する(効果的に無効化する)
setenforce 0
sed -i 's/^SELINUX=enforcing$/SELINUX=permissive/' /etc/selinux/config

yum install -y kubelet kubeadm kubectl --disableexcludes=kubernetes

systemctl enable --now kubelet
```

**Note:**

- `setenforce 0`および`sed ...`を実行することにより SELinux を permissive モードに設定し、効果的に無効化できます。
  これはコンテナがホストのファイルシステムにアクセスするために必要です。例えば、Pod のネットワークに必要とされます。
  kubelet における SELinux のサポートが改善されるまでは、これを実行しなければなりません。

{{% /tab %}}
{{% tab name="Container Linux" %}}
CNI プラグインをインストールする(ほとんどの Pod のネットワークに必要です):

```bash
CNI_VERSION="v0.8.2"
ARCH="amd64"
mkdir -p /opt/cni/bin
curl -L "https://github.com/containernetworking/plugins/releases/download/${CNI_VERSION}/cni-plugins-linux-${ARCH}-${CNI_VERSION}.tgz" | tar -C /opt/cni/bin -xz
```

crictl をインストールする (kubeadm / Kubelet Container Runtime Interface (CRI)に必要です)

```bash
CRICTL_VERSION="v1.22.0"
ARCH="amd64"
curl -L "https://github.com/kubernetes-sigs/cri-tools/releases/download/${CRICTL_VERSION}/crictl-${CRICTL_VERSION}-linux-${ARCH}.tar.gz" | sudo tar -C $DOWNLOAD_DIR -xz
```

`kubeadm`、`kubelet`、`kubectl`をインストールし`kubelet`を systemd service に登録します:

```bash
RELEASE="$(curl -sSL https://dl.k8s.io/release/stable.txt)"
ARCH="amd64"
mkdir -p /opt/bin
cd /opt/bin
curl -L --remote-name-all https://dl.k8s.io/release/${RELEASE}/bin/linux/${ARCH}/{kubeadm,kubelet,kubectl}
chmod +x {kubeadm,kubelet,kubectl}

curl -sSL "https://raw.githubusercontent.com/kubernetes/kubernetes/${RELEASE}/build/debs/kubelet.service" | sed "s:/usr/bin:/opt/bin:g" > /etc/systemd/system/kubelet.service
mkdir -p /etc/systemd/system/kubelet.service.d
curl -sSL "https://raw.githubusercontent.com/kubernetes/kubernetes/${RELEASE}/build/debs/10-kubeadm.conf" | sed "s:/usr/bin:/opt/bin:g" > /etc/systemd/system/kubelet.service.d/10-kubeadm.conf
```

`kubelet`を有効化し起動します:

```bash
systemctl enable --now kubelet
```

{{% /tab %}}
{{< /tabs >}}

kubeadm が何をすべきか指示するまで、kubelet はクラッシュループで数秒ごとに再起動します。

## コントロールプレーンノードの kubelet によって使用される cgroup ドライバーの設定

Docker を使用した場合、kubeadm は自動的に kubelet 向けの cgroup ドライバーを検出し、それを実行時に`/var/lib/kubelet/kubeadm-flags.env`ファイルに設定します。

もしあなたが異なる CRI を使用している場合、`/etc/default/kubelet`(CentOS、RHEL、Fedora では`/etc/sysconfig/kubelet`)ファイル内の`cgroup-driver`の値を以下のように変更する必要があります。

```bash
KUBELET_EXTRA_ARGS=--cgroup-driver=<value>
```

このファイルは、kubelet の追加のユーザー定義引数を取得するために、`kubeadm init`および`kubeadm join`によって使用されます。

CRI の cgroup ドライバーが`cgroupfs`でない場合に**のみ**それを行う必要があることに注意してください。なぜなら、これはすでに kubelet のデフォルト値であるためです。

kubelet をリスタートする方法:

```bash
systemctl daemon-reload
systemctl restart kubelet
```

CRI-O や containerd といった他のコンテナランタイムの cgroup driver は実行中に自動的に検出されます。

## トラブルシュート

kubeadm で問題が発生した場合は、[トラブルシューティング](/ja/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/)を参照してください。

## {{% heading "whatsnext" %}}

- [kubeadm を使用したシングルコントロールプレーンクラスターの作成](/ja/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)
