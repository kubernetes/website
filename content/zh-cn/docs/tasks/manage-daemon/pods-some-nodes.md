---
title: 仅在某些节点上运行 Pod
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
本页演示了你如何能够仅在某些{{<glossary_tooltip term_id="node" text="节点">}}上作为
{{<glossary_tooltip term_id="daemonset" text="DaemonSet">}}
的一部分运行{{<glossary_tooltip term_id="pod" text="Pod">}}。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!--
## Running Pods on only some Nodes

Imagine that you want to run a {{<glossary_tooltip term_id="daemonset" text="DaemonSet">}}, but you only need to run those daemon pods
on nodes that have local solid state (SSD) storage. For example, the Pod might provide cache service to the
node, and the cache is only useful when low-latency local storage is available.
-->
## 仅在某些节点上运行 Pod    {#running-pod-on-some-nodes}

设想一下你想要运行 {{<glossary_tooltip term_id="daemonset" text="DaemonSet">}}，
但你只需要在配备了本地固态 (SSD) 存储的节点上运行这些守护进程 Pod。
例如，Pod 可以向节点提供缓存服务，而缓存仅在低延迟本地存储可用时才有用。

<!--
### Step 1: Add labels to your nodes

Add the label `ssd=true` to the nodes which have SSDs.
-->
### 第 1 步：为节点打标签

在配有 SSD 的节点上打标签 `ssd=true`。

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
### 第 2 步：创建清单

让我们创建一个 {{<glossary_tooltip term_id="daemonset" text="DaemonSet">}}，
它将仅在打了 SSD 标签的{{<glossary_tooltip term_id="node" text="节点">}}上制备守护进程 Pod。

接下来，使用 `nodeSelector` 确保 DaemonSet 仅在 `ssd` 标签设为 `"true"` 的节点上运行 Pod。

{{% code_sample file="controllers/daemonset-label-selector.yaml" %}}

<!--
### Step 3: Create the DaemonSet

Create the DaemonSet from the manifest by using `kubectl create` or `kubectl apply`

Let's label another node as `ssd=true`.
-->
### 第 3 步：创建 DaemonSet

使用 `kubectl create` 或 `kubectl apply` 从清单创建 DaemonSet。

让我们为另一个节点打上标签 `ssd=true`。

```shell
kubectl label nodes example-node-3 ssd=true
```

<!--
Labelling the node automatically triggers the control plane (specifically, the DaemonSet controller)
to run a new daemon pod on that node.
-->
节点打上标签后将自动触发控制平面（具体而言是 DaemonSet 控制器）在该节点上运行新的守护进程 Pod。

```shell
kubectl get pods -o wide
```

<!--
The output is similar to:
-->
输出类似于：

```console
NAME                              READY     STATUS    RESTARTS   AGE    IP      NODE
<daemonset-name><some-hash-01>    1/1       Running   0          13s    .....   example-node-1
<daemonset-name><some-hash-02>    1/1       Running   0          13s    .....   example-node-2
<daemonset-name><some-hash-03>    1/1       Running   0          5s     .....   example-node-3
```
