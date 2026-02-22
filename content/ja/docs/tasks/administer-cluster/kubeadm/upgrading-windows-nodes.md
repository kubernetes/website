---
title: Windowsノードのアップグレード
min-kubernetes-server-version: 1.17
content_type: task
weight: 50
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.18" state="beta" >}}

このページでは、[kubeadmで作られた](/ja/docs/tasks/administer-cluster/kubeadm/adding-windows-nodes)Windowsノードをアップグレードする方法について説明します。




## {{% heading "prerequisites" %}}
 
{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
* [残りのkubeadmクラスターをアップグレードするプロセス](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade)を理解します。
Windowsノードをアップグレードする前にコントロールプレーンノードをアップグレードしたいと思うかもしれません。




<!-- steps -->

## ワーカーノードをアップグレード

### kubeadmをアップグレード

1.  Windowsノードから、kubeadmをアップグレードします。:

    ```powershell
    # {{% skew currentPatchVersion %}}を目的のバージョンに置き換えます
    curl.exe -Lo C:\k\kubeadm.exe https://dl.k8s.io/v{{% skew currentPatchVersion %}}/bin/windows/amd64/kubeadm.exe
    ```

### ノードをドレインする

1.  Kubernetes APIにアクセスできるマシンから、
    ノードをスケジュール不可としてマークして、ワークロードを削除することでノードのメンテナンスを準備します:

    ```shell
    # <node-to-drain>をドレインするノードの名前に置き換えます
    kubectl drain <node-to-drain> --ignore-daemonsets
    ```

    このような出力結果が表示されるはずです:

    ```
    node/ip-172-31-85-18 cordoned
    node/ip-172-31-85-18 drained
    ```

### kubeletの構成をアップグレード

1. Windowsノードから、次のコマンドを呼び出して新しいkubelet構成を同期します:

    ```powershell
    kubeadm upgrade node
    ```

### kubeletをアップグレード

1.  Windowsノードから、kubeletをアップグレードして再起動します:

    ```powershell
    stop-service kubelet
    curl.exe -Lo C:\k\kubelet.exe https://dl.k8s.io/v{{% skew currentPatchVersion %}}/bin/windows/amd64/kubelet.exe
    restart-service kubelet
    ```

### ノードをオンライン状態に

1.  Kubernetes APIにアクセスできるマシンから、
スケジュール可能としてマークして、ノードをオンラインに戻します:

    ```shell
    # <node-to-drain>をノードの名前に置き換えます
    kubectl uncordon <node-to-drain>
    ```
### kube-proxyをアップグレード

1. Kubernetes APIにアクセスできるマシンから、次を実行します、
もう一度{{< skew currentPatchVersion >}}を目的のバージョンに置き換えます:

    ```shell
    curl -L https://github.com/kubernetes-sigs/sig-windows-tools/releases/latest/download/kube-proxy.yml | sed 's/VERSION/v{{< skew currentPatchVersion >}}/g' | kubectl apply -f -
    ```


