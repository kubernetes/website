---
cn-approvers:
- xiaosuiba
title: 为节点发布不透明整数资源（Opaque Integer Resources）
---
<!--
title: Advertise Opaque Integer Resources for a Node
-->


{% capture overview %}

<!--
This page shows how to specify opaque integer resources for a Node.
Opaque integer resources allow cluster administrators to advertise node-level
resources that would otherwise be unknown to Kubernetes.
-->
本文展示了如何为节点指定不透明整数资源（opaque integer resource）。不透明整数资源使得集群管理员可以发布节点层级的资源，这些资源对 Kubernetes 透明。

{% include feature-state-deprecated.md %}

{% endcapture %}


{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

{% endcapture %}


{% capture steps %}

<!--
## Get the names of your Nodes
-->
## 获取节点名

```shell
kubectl get nodes
```

<!--
Choose one of your Nodes to use for this exercise.
-->
请选择一个节点来执行这个练习。

<!--
## Advertise a new opaque integer resource on one of your Nodes
-->
## 在节点上发布一个新的不透明资源

<!--
To advertise a new opaque integer resource on a Node, send an HTTP PATCH request to
the Kubernetes API server. For example, suppose one of your Nodes has four dongles
attached. Here's an example of a PATCH request that advertises four dongle resources
for your Node.
-->
要在节点上发布一个新的不透明资源，请发送一个 HTTP PATCH 请求给 Kubernetes API server。例如，假设某个节点连接了 4 个 dongle。这是如何在节点上发布 4 个 dongle 资源的 PATCH 请求示例。

```shell
PATCH /api/v1/nodes/<your-node-name>/status HTTP/1.1
Accept: application/json
Content-Type: application/json-patch+json
Host: k8s-master:8080

[
  {
    "op": "add",
    "path": "/status/capacity/pod.alpha.kubernetes.io~1opaque-int-resource-dongle",
    "value": "4"
  }
]
```

<!--
Note that Kubernetes does not need to know what a dongle is or what a dongle is for.
The preceding PATCH request just tells Kubernetes that your Node has four things that
you call dongles.
-->
请注意，Kubernetes 并不需要知道 dongle 是什么或者用来做什么。前面的 PATCH 请求仅仅告诉了 Kubernetes 节点有 4 个叫做 dongle 的东西。

<!--
Start a proxy, so that you can easily send requests to the Kubernetes API server:
-->
请启动一个代理，这样更易于发送请求到 Kubernetes API server：

```
kubectl proxy
```

<!--
In another command window, send the HTTP PATCH request.
Replace `<your-node-name>` with the name of your Node:
-->
在另一个命令行窗口中发送 HTTP PATCH 请求。
请替换 `<your-node-name>` 为节点的名称：

```shell
curl --header "Content-Type: application/json-patch+json" \
--request PATCH \
--data '[{"op": "add", "path": "/status/capacity/pod.alpha.kubernetes.io~1opaque-int-resource-dongle", "value": "4"}]' \
http://localhost:8001/api/v1/nodes/<your-node-name>/status
```

<!--
**Note**: In the preceding request, `~1` is the encoding for the character / in
the patch path. The operation path value in JSON-Patch is interpreted as a
JSON-Pointer. For more details, see
[IETF RFC 6901](https://tools.ietf.org/html/rfc6901), section 3.
-->
**注意**：在前面的请求中，`~1` 表示 patch 路径中 / 字符的编码。JSON-Patch 中的操作路径（operation path）值会被解析为一个 JSON-Pointer。更多详细信息请查阅 [IETF RFC 6901](https://tools.ietf.org/html/rfc6901) 第三节。

<!--
The output shows that the Node has a capacity of 4 dongles:
-->
输出显示 Node 拥有 4 个 dongle：

```
"capacity": {
  "alpha.kubernetes.io/nvidia-gpu": "0",
  "cpu": "2",
  "memory": "2049008Ki",
  "pod.alpha.kubernetes.io/opaque-int-resource-dongle": "4",
```

<!--
Describe your Node:
-->
Describe 节点：

```
kubectl describe node <your-node-name>
```

<!--
Once again, the output shows the dongle resource:
-->
输出再次显示了 dongle 资源：

```yaml
Capacity:
 alpha.kubernetes.io/nvidia-gpu:      0
 cpu:             2
 memory:            2049008Ki
 pod.alpha.kubernetes.io/opaque-int-resource-dongle:  4
```

<!--
Now, application developers can create Pods that request a certain
number of dongles. See
[Assign Opaque Integer Resources to a Container](/docs/tasks/configure-pod-container/opaque-integer-resource/).
-->
现在，应用开发者就可以创建请求 dongle 资源的 Pod 了。请参考 [为容器分配不透明整数资源](/docs/tasks/configure-pod-container/opaque-integer-resource/)。

<!--
## Discussion
-->
## 讨论

<!--
Opaque integer resources are similar to memory and CPU resources. For example,
just as  a Node has a certain amount of memory and CPU to be shared by all components
running on the Node, it can have a certain number of dongles to be shared
by all components running on the Node. And just as application developers
can create Pods that request a certain amount of memory and CPU, they can
create Pods that request a certain number of dongles.
-->
不透明整数资源与内存和 CPU 资源是相似的。例如，如同节点可以拥有一定数量的内存和 CPU 供其上所有组件共用一样，它也可以拥有一定数量的 dongle（供其上所有组件共用）。同时，正如应用开发者创建的 Pod 可以请求一定数量的内存和 CPU，Pod 也可以请求一定数量的 dongle。

<!--
Opaque integer resources are called opaque because Kubernetes does not
know anything about what they are. Kubernetes knows only that a Node
has a certain number of them. They are called integer resources because
they must be advertised in integer amounts. For example, a Node can advertise
four dongles, but not 4.5 dongles.
-->
不透明整数资源之所以被称为“不透明”是因为 Kubernetes 不知道任何关于它是什么的信息。Kubernetes 只知道节点拥有一定数量的不透明整数资源。称它们为不透明整数是因为它们必须以整数数量发布。例如，节点可以发布 4 个 dongle，但不能是 4.5 个。

<!--
### Storage example
-->
### 存储的示例

<!--
Suppose a Node has 800 GiB of a special kind of disk storage. You could
create a name for the special storage, say opaque-int-resource-special-storage.
Then you could advertise it in chunks of a certain size, say 100 GiB. In that case,
your Node would advertise that it has eight resources of type
opaque-int-resource-special-storage.
-->
假设一个节点有 800 GiB 特殊类型的磁盘。您可以为它们取一个名字，例如 opaque-int-resource-special-storage。然后您就可以用某个大小的块来发布它，例如 100 GiB。在这种情况下，节点就可以发布它拥有 8 个 opaque-int-resource-special-storage 类型的资源。

```yaml
Capacity:
 ...
 pod.alpha.kubernetes.io/opaque-int-resource-special-storage:  8
```

<!--
If you want to allow arbitrary requests for special storage, you
could advertise special storage in chunks of size 1 byte. In that case, you would advertise
800Gi resources of type opaque-int-resource-special-storage.
-->
如果希望对特殊存储进行更自由的请求，您可以发布它的块大小为 1 byte。在这种情况下，您就可以发布 800Gi opaque-int-resource-special-storage 类型的资源。

```yaml
Capacity:
 ...
 pod.alpha.kubernetes.io/opaque-int-resource-special-storage:  800Gi
```

<!--
Then a Container could request any number of bytes of special storage, up to 800Gi.
-->
然后容器就能够请求任意数量的特殊存储，最多可达 800Gi。

<!--
## Clean up
-->
## 清理

<!--
Here is a PATCH request that removes the dongle advertisement from a Node.
-->
这是从节点删除 dongle 发布的 PATCH 请求。

```shell
PATCH /api/v1/nodes/<your-node-name>/status HTTP/1.1
Accept: application/json
Content-Type: application/json-patch+json
Host: k8s-master:8080

[
  {
    "op": "remove",
    "path": "/status/capacity/pod.alpha.kubernetes.io~1opaque-int-resource-dongle",
  }
]
```
<!--
Start a proxy, so that you can easily send requests to the Kubernetes API server:
-->
请启动一个代理，这样更易于发送请求到 Kubernetes API server：

```
kubectl proxy
```

<!--
In another command window, send the HTTP PATCH request.
Replace `<your-node-name>` with the name of your Node:
-->
在另一个命令行窗口中发送 HTTP PATCH 请求。
请替换 `<your-node-name>` 为节点的名称：

```shell
curl --header "Content-Type: application/json-patch+json" \
--request PATCH \
--data '[{"op": "remove", "path": "/status/capacity/pod.alpha.kubernetes.io~1opaque-int-resource-dongle"}]' \
http://localhost:8001/api/v1/nodes/<your-node-name>/status
```

<!--
Verify that the dongle advertisement has been removed:
-->
验证 dongle 发布是否已经被删除：

```
kubectl describe node <your-node-name> | grep dongle
```

{% endcapture %}


{% capture whatsnext %}

<!--
### For application developers
-->
### 对于应用开发者

<!--
* [Assign Opaque Integer Resources to a Container](/docs/tasks/configure-pod-container/opaque-integer-resource/)
-->
* [为容器分配不透明整数资源](/docs/tasks/configure-pod-container/opaque-integer-resource/)

<!--
### For cluster administrators
-->
### 对于集群管理员

<!--
* [Configure Minimum and Maximum Memory Constraints for a Namespace](/docs/tasks/administer-cluster/memory-constraint-namespace/)
* [Configure Minimum and Maximum CPU Constraints for a Namespace](/docs/tasks/administer-cluster/cpu-constraint-namespace/)
-->
* [为 Namespace 配置最小和最大内存限制](/docs/tasks/administer-cluster/memory-constraint-namespace/)
* [为 Namespace 配置最小和最大 CPU 限制](/docs/tasks/administer-cluster/cpu-constraint-namespace/)


{% endcapture %}


{% include templates/task.md %}
