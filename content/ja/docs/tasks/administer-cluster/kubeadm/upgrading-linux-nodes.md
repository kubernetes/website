---
title: Linuxノードのアップグレード
content_type: task
weight: 40
---

<!-- overview -->

このページでは、kubeadmで構築したLinuxワーカーノードのアップグレード方法を示します。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs-node-upgrade.md" >}} {{< version-check >}}
* [残りのkubeadmクラスターのアップグレード手順](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade)をよく理解しておいてください。
  Linuxワーカーノードをアップグレードする前に、コントロールプレーンノードのアップグレードをする必要があります。

<!-- steps -->

## パッケージリポジトリの変更 {#changing-the-package-repository}

コミュニティ所有のパッケージリポジトリ(`pkgs.k8s.io`)を使用している場合、必要なKubernetesのマイナーリリースのパッケージリポジトリを有効化する必要があります。
これは、[Kubernetesパッケージリポジトリの変更](/docs/tasks/administer-cluster/kubeadm/change-package-repository/)ドキュメントにて説明されています。

{{% legacy-repos-deprecation %}}

## ワーカーノードのアップグレード {#upgrading-worker-nodes}

### kubeadmのアップグレード {#upgrade-kubeadm}

kubeadmをアップグレードします。

{{< tabs name="k8s_install_kubeadm_worker_nodes" >}}
{{% tab name="Ubuntu、Debian、またはHypriotOS" %}}
```shell
#「{{< skew currentVersion >}}.x-*」の「x」は最新のパッチバージョンに置き換えてください。
sudo apt-mark unhold kubeadm && \
sudo apt-get update && sudo apt-get install -y kubeadm='{{< skew currentVersion >}}.x-*' && \
sudo apt-mark hold kubeadm
```
{{% /tab %}}
{{% tab name="CentOS、RHEL、またはFedora" %}}
DNFを搭載したシステムの場合:
```shell
#「{{< skew currentVersion >}}.x-*」の「x」は最新のパッチバージョンに置き換えてください。
sudo yum install -y kubeadm-'{{< skew currentVersion >}}.x-*' --disableexcludes=kubernetes
```
DNF5を搭載したシステムの場合:
```shell
#「{{< skew currentVersion >}}.x-*」の「x」は最新のパッチバージョンに置き換えてください。
sudo yum install -y kubeadm-'{{< skew currentVersion >}}.x-*' --setopt=disable_excludes=kubernetes
```
{{% /tab %}}
{{< /tabs >}}

### "kubeadm upgrade"の実行 {#call-kubeadm-upgrade}

ワーカーノードは、以下のコマンドによってローカルのkubeletの設定がアップグレードされます。

```shell
sudo kubeadm upgrade node
```

### ノードのドレイン {#drain-the-node}

ノードをスケジュール不可としてマークし、ワークロードを退去させることで、ノードのメンテナンスの準備をします。

```shell
# このコマンドはコントロールプレーンノードで実行してください。
# <node-to-drain>は、ドレインするノード名に置き換えてください。
kubectl drain <node-to-drain> --ignore-daemonsets
```

### kubeletとkubectlのアップグレード {#upgrade-kubelet-and-kubectl}

1. kubeletとkubectlをアップグレードします。

   {{< tabs name="k8s_kubelet_and_kubectl" >}}
   {{% tab name="Ubuntu、Debian、またはHypriotOS" %}}
   ```shell
   #「{{< skew currentVersion >}}.x-*」の「x」は最新のパッチバージョンに置き換えてください。
   sudo apt-mark unhold kubelet kubectl && \
   sudo apt-get update && sudo apt-get install -y kubelet='{{< skew currentVersion >}}.x-*' kubectl='{{< skew currentVersion >}}.x-*' && \
   sudo apt-mark hold kubelet kubectl
   ```
   {{% /tab %}}
   {{% tab name="CentOS、RHEL、またはFedora" %}}
   DNFを搭載したシステムの場合:
   ```shell
   #「{{< skew currentVersion >}}.x-*」の「x」は最新のパッチバージョンに置き換えてください。
   sudo yum install -y kubelet-'{{< skew currentVersion >}}.x-*' kubectl-'{{< skew currentVersion >}}.x-*' --disableexcludes=kubernetes
   ```
   DNF5を搭載したシステムの場合:
   ```shell
   #「{{< skew currentVersion >}}.x-*」の「x」は最新のパッチバージョンに置き換えてください。
   sudo yum install -y kubelet-'{{< skew currentVersion >}}.x-*' kubectl-'{{< skew currentVersion >}}.x-*' --setopt=disable_excludes=kubernetes
   ```
   {{% /tab %}}
   {{< /tabs >}}

1. kubeletを再起動します。

   ```shell
   sudo systemctl daemon-reload
   sudo systemctl restart kubelet
   ```

### ノードの隔離解除 {#uncordon-the-node}

ノードをスケジュール可能としてマークすることで、ノードをオンラインに戻します。

```shell
# このコマンドはコントロールプレーンノードで実行してください。
# <node-to-uncordon>は対象のノード名に置き換えてください。
kubectl uncordon <node-to-uncordon>
```

## {{% heading "whatsnext" %}}

* [Windowsノードのアップグレード](/docs/tasks/administer-cluster/kubeadm/upgrading-windows-nodes/)を参照してください。