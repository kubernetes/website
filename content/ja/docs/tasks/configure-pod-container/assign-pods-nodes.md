---
title: Podをノードに割り当てる
content_type: task
weight: 150
---

<!-- overview -->
このページでは、KubernetesのPodをKubernetesクラスター上の特定のノードに割り当てる方法を説明します。

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## ラベルをノードに追加する {#add-a-label-to-a-node}

1. クラスター内の{{< glossary_tooltip term_id="node" text="ノード" >}}のリストをラベル付きで表示します。

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
1. ノードの1つを選択して、ラベルを追加します。

    ```shell
    kubectl label nodes <your-node-name> disktype=ssd
    ```

    ここで、`<your-node-name>`は選択したノードの名前です。

1. 選択したノードに`disktype=ssd`ラベルがあることを確認します。

    ```shell
    kubectl get nodes --show-labels
    ```

    出力は次のようになります。

    ```shell
    NAME      STATUS    ROLES    AGE     VERSION        LABELS
    worker0   Ready     <none>   1d      v1.13.0        ...,disktype=ssd,kubernetes.io/hostname=worker0
    worker1   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker1
    worker2   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker2
    ```

    上の出力を見ると、`worker0`に`disktype=ssd`というラベルがあることがわかります。

## 選択したノードにスケジューリングされるPodを作成する {#create-a-pod-that-gets-scheduled-to-your-chosen-node}

以下のPodの構成ファイルには、nodeSelectorに`disktype: ssd`を持つPodが書かれています。これにより、Podは`disktype: ssd`というラベルを持っているノードにスケジューリングされるようになります。

{{% codenew file="pods/pod-nginx.yaml" %}}

1. 構成ファイルを使用して、選択したノードにスケジューリングされるPodを作成します。

    ```shell
    kubectl apply -f https://k8s.io/examples/pods/pod-nginx.yaml
    ```

1. Podが選択したノード上で実行されているをことを確認します。

    ```shell
    kubectl get pods --output=wide
    ```

    出力は次のようになります。

    ```shell
    NAME     READY     STATUS    RESTARTS   AGE    IP           NODE
    nginx    1/1       Running   0          13s    10.200.0.4   worker0
    ```

## 特定のノードにスケジューリングされるPodを作成する {#create-a-pod-that-gets-scheduled-to-specific-node}

`nodeName`という設定を使用して、Podを特定のノードにスケジューリングすることもできます。

{{% codenew file="pods/pod-nginx-specific-node.yaml" %}}

構成ファイルを使用して、`foo-node`にだけスケジューリングされるPodを作成します。

## {{% heading "whatsnext" %}}

* [ラベルとセレクター](/ja/docs/concepts/overview/working-with-objects/labels/)についてさらに学ぶ。
* [ノード](/ja/docs/concepts/architecture/nodes/)についてさらに学ぶ。
