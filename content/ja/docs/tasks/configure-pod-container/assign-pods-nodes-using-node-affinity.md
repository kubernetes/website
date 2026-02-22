---
title: Node Affinityを利用してPodをノードに割り当てる
min-kubernetes-server-version: v1.10
content_type: task
weight: 160
---

<!-- overview -->
このページでは、Node Affinityを利用して、PodをKubernetesクラスター内の特定のノードに割り当てる方法を説明します。


## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->

## ノードにラベルを追加する

1. クラスター内のノードを一覧表示して、ラベルを確認します。

    ```shell
    kubectl get nodes --show-labels
    ```

    出力は次のようになります。

    ```shell
    NAME      STATUS    ROLES    AGE     VERSION        LABELS
    worker0   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker0
    worker1   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker1
    worker2   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker2
    ```
1. ノードを選択して、ラベルを追加します。

    ```shell
    kubectl label nodes <your-node-name> disktype=ssd
    ```

    ここで、`<your-node-name>`は選択したノードの名前で置換します。

1. 選択したノードに`disktype=ssd`ラベルがあることを確認します。

    ```shell
    kubectl get nodes --show-labels
    ```

    出力は次のようになります。

    ```
    NAME      STATUS    ROLES    AGE     VERSION        LABELS
    worker0   Ready     <none>   1d      v1.13.0        ...,disktype=ssd,kubernetes.io/hostname=worker0
    worker1   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker1
    worker2   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker2
    ```

    この出力を見ると、`worker0`ノードに`disktype=ssd`というラベルが追加されたことがわかります。

## required node affinityを使用してPodをスケジューリングする

以下に示すマニフェストには、`requiredDuringSchedulingIgnoredDuringExecution`に`disktype: ssd`というnode affinityを使用したPodが書かれています。このように書くと、Podは`disktype=ssd`というラベルを持つノードにだけスケジューリングされるようになります。

{{% codenew file="pods/pod-nginx-required-affinity.yaml" %}}

1. マニフェストを適用して、選択したノード上にスケジューリングされるPodを作成します。
    
    ```shell
    kubectl apply -f https://k8s.io/examples/pods/pod-nginx-required-affinity.yaml
    ```

1. Podが選択したノード上で実行されていることを確認します。

    ```shell
    kubectl get pods --output=wide
    ```

    出力は次のようになります。
    
    ```
    NAME     READY     STATUS    RESTARTS   AGE    IP           NODE
    nginx    1/1       Running   0          13s    10.200.0.4   worker0
    ```
    
## preferred node affinityを使用してPodをスケジューリングする

以下に示すマニフェストには、`preferredDuringSchedulingIgnoredDuringExecution`に`disktype: ssd`というnode affinityを使用したPodが書かれています。このように書くと、Podは`disktype=ssd`というラベルを持つノードに優先的にスケジューリングされるようになります。

{{% codenew file="pods/pod-nginx-preferred-affinity.yaml" %}}

1. マニフェストを適用して、選択したノード上にスケジューリングされるPodを作成します。
    
    ```shell
    kubectl apply -f https://k8s.io/examples/pods/pod-nginx-preferred-affinity.yaml
    ```

1. Podが選択したノード上で実行されていることを確認します。

    ```shell
    kubectl get pods --output=wide
    ```

    出力は次のようになります。
    
    ```
    NAME     READY     STATUS    RESTARTS   AGE    IP           NODE
    nginx    1/1       Running   0          13s    10.200.0.4   worker0
    ```

## {{% heading "whatsnext" %}}

[Node Affinity](/ja/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity)についてさらに学ぶ。

