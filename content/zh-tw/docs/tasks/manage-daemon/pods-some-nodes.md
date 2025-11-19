---
title: 僅在某些節點上運行 Pod
content_type: task
weight: 30
---
<!--
title: Running Pods on Only Some Nodes
content_type: task
weight: 30
-->

<!-- overview -->

<!--
This page demonstrates how can you run {{<glossary_tooltip term_id="pod" text="Pods">}}
on only some {{<glossary_tooltip term_id="node" text="Nodes">}} as part of a
{{<glossary_tooltip term_id="daemonset" text="DaemonSet">}}
-->
本頁演示了你如何能夠僅在某些{{<glossary_tooltip term_id="node" text="節點">}}上作爲
{{<glossary_tooltip term_id="daemonset" text="DaemonSet">}}
的一部分運行{{<glossary_tooltip term_id="pod" text="Pod">}}。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!--
## Running Pods on only some Nodes

Imagine that you want to run a {{<glossary_tooltip term_id="daemonset" text="DaemonSet">}}, but you only need to run those daemon pods
on nodes that have local solid state (SSD) storage. For example, the Pod might provide cache service to the
node, and the cache is only useful when low-latency local storage is available.
-->
## 僅在某些節點上運行 Pod    {#running-pod-on-some-nodes}

設想一下你想要運行 {{<glossary_tooltip term_id="daemonset" text="DaemonSet">}}，
但你只需要在配備了本地固態 (SSD) 存儲的節點上運行這些守護進程 Pod。
例如，Pod 可以向節點提供緩存服務，而緩存僅在低延遲本地存儲可用時纔有用。

<!--
### Step 1: Add labels to your nodes

Add the label `ssd=true` to the nodes which have SSDs.
-->
### 第 1 步：爲節點打標籤

在配有 SSD 的節點上打標籤 `ssd=true`。

```shell
kubectl label nodes example-node-1 example-node-2 ssd=true
```

<!--
### Step 2: Create the manifest

Let's create a {{<glossary_tooltip term_id="daemonset" text="DaemonSet">}} which
will provision the daemon pods on the SSD labeled {{<glossary_tooltip term_id="node" text="nodes">}} only.

Next, use a `nodeSelector` to ensure that the DaemonSet only runs Pods on nodes
with the `ssd` label set to `"true"`.
-->
### 第 2 步：創建清單

讓我們創建一個 {{<glossary_tooltip term_id="daemonset" text="DaemonSet">}}，
它將僅在打了 SSD 標籤的{{<glossary_tooltip term_id="node" text="節點">}}上製備守護進程 Pod。

接下來，使用 `nodeSelector` 確保 DaemonSet 僅在 `ssd` 標籤設爲 `"true"` 的節點上運行 Pod。

{{% code_sample file="controllers/daemonset-label-selector.yaml" %}}

<!--
### Step 3: Create the DaemonSet

Create the DaemonSet from the manifest by using `kubectl create` or `kubectl apply`

Let's label another node as `ssd=true`.
-->
### 第 3 步：創建 DaemonSet

使用 `kubectl create` 或 `kubectl apply` 從清單創建 DaemonSet。

讓我們爲另一個節點打上標籤 `ssd=true`。

```shell
kubectl label nodes example-node-3 ssd=true
```

<!--
Labelling the node automatically triggers the control plane (specifically, the DaemonSet controller)
to run a new daemon pod on that node.
-->
節點打上標籤後將自動觸發控制平面（具體而言是 DaemonSet 控制器）在該節點上運行新的守護進程 Pod。

```shell
kubectl get pods -o wide
```

<!--
The output is similar to:
-->
輸出類似於：

```console
NAME                              READY     STATUS    RESTARTS   AGE    IP      NODE
<daemonset-name><some-hash-01>    1/1       Running   0          13s    .....   example-node-1
<daemonset-name><some-hash-02>    1/1       Running   0          13s    .....   example-node-2
<daemonset-name><some-hash-03>    1/1       Running   0          5s     .....   example-node-3
```
