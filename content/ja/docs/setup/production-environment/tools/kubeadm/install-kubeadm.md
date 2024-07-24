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

このページでは`kubeadm`コマンドをインストールする方法を示します。このインストール処理実行後にkubeadmを使用してクラスターを作成する方法については、[kubeadmを使用したシングルマスタークラスターの作成](/ja/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)を参照してください。



## {{% heading "prerequisites" %}}

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



<!-- steps -->

## MACアドレスとproduct_uuidが全てのノードでユニークであることの検証

* ネットワークインターフェースのMACアドレスは`ip link`もしくは`ifconfig -a`コマンドで取得できます。
* product_uuidは`sudo cat /sys/class/dmi/id/product_uuid`コマンドで確認できます。

ハードウェアデバイスではユニークなアドレスが割り当てられる可能性が非常に高いですが、VMでは同じになることがあります。Kubernetesはこれらの値を使用して、クラスター内のノードを一意に識別します。これらの値が各ノードに固有ではない場合、インストール処理が[失敗](https://github.com/kubernetes/kubeadm/issues/31)することもあります。

## ネットワークアダプタの確認

複数のネットワークアダプターがあり、Kubernetesコンポーネントにデフォルトで到達できない場合、IPルートを追加して、Kubernetesクラスターのアドレスが適切なアダプターを経由するように設定することをお勧めします。

## 必須ポートの確認

Kubernetesのコンポーネントが互いに通信するためには、これらの[必要なポート](/ja/docs/reference/networking/ports-and-protocols/)が開いている必要があります。
[netcat](https://netcat.sourceforge.net)などのツールを使用することで、下記のようにポートが開いているかどうかを確認することが可能です。

```shell
nc 127.0.0.1 6443 -v
```

使用するPodネットワークプラグインによっては、特定のポートを開く必要がある場合もあります。
これらは各Podネットワークプラグインによって異なるため、どのようなポートが必要かについては、プラグインのドキュメントを参照してください。

## ランタイムのインストール {#installing-runtime}

Podのコンテナを実行するために、Kubernetesは{{< glossary_tooltip term_id="container-runtime" text="コンテナランタイム" >}}を使用します。

{{< tabs name="container_runtime" >}}
{{% tab name="Linuxノード" %}}

デフォルトでは、Kubernetesは選択されたコンテナランタイムと通信するために{{< glossary_tooltip term_id="cri" text="Container Runtime Interface">}} (CRI)を使用します。

ランタイムを指定しない場合、kubeadmはよく知られたUnixドメインソケットのリストをスキャンすることで、インストールされたコンテナランタイムの検出を試みます。
次の表がコンテナランタイムと関連するソケットのパスリストです。

{{< table caption = "コンテナランタイムとソケットパス" >}}
| ランタイム  | Unixドメインソケットのパス        |
|------------|-----------------------------------|
| Docker     | `/var/run/docker.sock`            |
| containerd | `/run/containerd/containerd.sock` |
| CRI-O      | `/var/run/crio/crio.sock`         |
{{< /table >}}

<br />
Dockerとcontainerdの両方が同時に検出された場合、Dockerが優先されます。Docker 18.09にはcontainerdが同梱されており、両方が検出可能であるため、この仕様が必要です。他の2つ以上のランタイムが検出された場合、kubeadmは適切なエラーメッセージで終了します。

kubeletは、組み込まれた`dockershim`CRIを通してDockerと連携します。

詳細は、[コンテナランタイム](/ja/docs/setup/production-environment/container-runtimes/)を参照してください。
{{% /tab %}}
{{% tab name="その他のOS" %}}
デフォルトでは、kubeadmは{{< glossary_tooltip term_id="docker" >}}をコンテナランタイムとして使用します。
kubeletは、組み込まれた`dockershim`CRIを通してDockerと連携します。

詳細は、[コンテナランタイム](/ja/docs/setup/production-environment/container-runtimes/)を参照してください。
{{% /tab %}}
{{< /tabs >}}


## kubeadm、kubelet、kubectlのインストール

以下のパッケージをマシン上にインストールしてください

* `kubeadm`: クラスターを起動するコマンドです。

* `kubelet`: クラスター内のすべてのマシンで実行されるコンポーネントです。
     Podやコンテナの起動などを行います。

* `kubectl`: クラスターにアクセスするためのコマンドラインツールです。

kubeadmは`kubelet`や`kubectl`をインストールまたは管理**しない**ため、kubeadmにインストールするKubernetesコントロールプレーンのバージョンと一致させる必要があります。そうしないと、予期しないバグのある動作につながる可能性のあるバージョン差異(version skew)が発生するリスクがあります。ただし、kubeletとコントロールプレーン間のマイナーバージョン差異(minor version skew)は_1つ_サポートされていますが、kubeletバージョンがAPIサーバーのバージョンを超えることはできません。たとえば、1.7.0を実行するkubeletは1.8.0 APIサーバーと完全に互換性がありますが、その逆はできません。

`kubectl`のインストールに関する詳細情報は、[kubectlのインストールおよびセットアップ](/ja/docs/tasks/tools/install-kubectl/)を参照してください。

{{< warning >}}
これらの手順はシステムアップグレードによるすべてのKubernetesパッケージの更新を除きます。これはkubeadmとKubernetesが[アップグレードにおける特別な注意](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)を必要とするからです。
{{</ warning >}}

バージョン差異(version skew)に関しては下記を参照してください。

* Kubernetes [Kubernetesバージョンとバージョンスキューサポートポリシー](/ja/docs/setup/release/version-skew-policy/)
* Kubeadm-specific [バージョン互換ポリシー](/ja/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#version-skew-policy)

{{< tabs name="k8s_install" >}}
{{% tab name="Ubuntu、Debian、またはHypriotOS" %}}
1. `apt`のパッケージ一覧を更新し、Kubernetesの`apt`リポジトリーを利用するのに必要なパッケージをインストールします:

   ```shell
   sudo apt-get update
   # apt-transport-httpsはダミーパッケージの可能性があります。その場合、そのパッケージはスキップできます
   sudo apt-get install -y apt-transport-https ca-certificates curl gpg
   ```

2. Kubernetesパッケージリポジトリーの公開署名キーをダウンロードします。すべてのリポジトリーに同じ署名キーが使用されるため、URL内のバージョンは無視できます:

   ```shell
   # `/etc/apt/keyrings`フォルダーが存在しない場合は、curlコマンドの前に作成する必要があります。下記の備考を参照してください。
   # sudo mkdir -p -m 755 /etc/apt/keyrings
   curl -fsSL https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
   ```

{{< note >}}
Debian 12とUbuntu 22.04より古いリリースでは、`/etc/apt/keyrings`フォルダーはデフォルトでは存在しないため、curlコマンドの前に作成する必要があります。
{{< /note >}}

3. 適切なKubernetes `apt`リポジトリーを追加します。このリポジトリーには、Kubernetes {{< skew currentVersion >}}用のパッケージのみがあることに注意してください。他のKubernetesマイナーバージョンの場合は、目的のマイナーバージョンに一致するようにURL内のKubernetesマイナーバージョンを変更する必要があります(インストールする予定のKubernetesバージョンのドキュメントも読んでください):

   ```shell
   # これにより、/etc/apt/sources.list.d/kubernetes.listにある既存の設定が上書きされます
   echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list
   ```

4. `apt`のパッケージ一覧を更新し、kubelet、kubeadm、kubectlをインストールします。そしてバージョンを固定します:

   ```shell
   sudo apt-get update
   sudo apt-get install -y kubelet kubeadm kubectl
   sudo apt-mark hold kubelet kubeadm kubectl
   ```

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

  - `setenforce 0`および`sed ...`を実行することによりSELinuxをpermissiveモードに設定し、効果的に無効化できます。
    これはコンテナがホストのファイルシステムにアクセスするために必要です。例えば、Podのネットワークに必要とされます。
    kubeletにおけるSELinuxのサポートが改善されるまでは、これを実行しなければなりません。

{{% /tab %}}
{{% tab name="Container Linux" %}}
CNIプラグインをインストールする(ほとんどのPodのネットワークに必要です):

```bash
CNI_VERSION="v0.8.2"
ARCH="amd64"
mkdir -p /opt/cni/bin
curl -L "https://github.com/containernetworking/plugins/releases/download/${CNI_VERSION}/cni-plugins-linux-${ARCH}-${CNI_VERSION}.tgz" | tar -C /opt/cni/bin -xz
```

crictlをインストールする (kubeadm / Kubelet Container Runtime Interface (CRI)に必要です)

```bash
CRICTL_VERSION="v1.22.0"
ARCH="amd64"
curl -L "https://github.com/kubernetes-sigs/cri-tools/releases/download/${CRICTL_VERSION}/crictl-${CRICTL_VERSION}-linux-${ARCH}.tar.gz" | sudo tar -C $DOWNLOAD_DIR -xz
```

`kubeadm`、`kubelet`、`kubectl`をインストールし`kubelet`をsystemd serviceに登録します:

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

kubeadmが何をすべきか指示するまで、kubeletはクラッシュループで数秒ごとに再起動します。

## コントロールプレーンノードのkubeletによって使用されるcgroupドライバーの設定

Dockerを使用した場合、kubeadmは自動的にkubelet向けのcgroupドライバーを検出し、それを実行時に`/var/lib/kubelet/kubeadm-flags.env`ファイルに設定します。

もしあなたが異なるCRIを使用している場合、`/etc/default/kubelet`(CentOS、RHEL、Fedoraでは`/etc/sysconfig/kubelet`)ファイル内の`cgroup-driver`の値を以下のように変更する必要があります。

```bash
KUBELET_EXTRA_ARGS=--cgroup-driver=<value>
```

このファイルは、kubeletの追加のユーザー定義引数を取得するために、`kubeadm init`および`kubeadm join`によって使用されます。

CRIのcgroupドライバーが`cgroupfs`でない場合に**のみ**それを行う必要があることに注意してください。なぜなら、これはすでにkubeletのデフォルト値であるためです。

kubeletをリスタートする方法:

```bash
systemctl daemon-reload
systemctl restart kubelet
```

CRI-Oやcontainerdといった他のコンテナランタイムのcgroup driverは実行中に自動的に検出されます。

## トラブルシュート

kubeadmで問題が発生した場合は、[トラブルシューティング](/ja/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/)を参照してください。

## {{% heading "whatsnext" %}}


* [kubeadmを使用したシングルコントロールプレーンクラスターの作成](/ja/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)
