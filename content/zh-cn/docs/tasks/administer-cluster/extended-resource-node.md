---
title: 为节点发布扩展资源
content_type: task
weight: 70
---
<!--
title: Advertise Extended Resources for a Node
content_type: task
weight: 70
-->

<!-- overview -->

<!--
This page shows how to specify extended resources for a Node.
Extended resources allow cluster administrators to advertise node-level
resources that would otherwise be unknown to Kubernetes.
-->
本文展示了如何为节点指定扩展资源（Extended Resource）。
扩展资源允许集群管理员发布节点级别的资源，这些资源在不进行发布的情况下无法被 Kubernetes 感知。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
## Get the names of your Nodes

-->
## 获取你的节点名称

```shell
kubectl get nodes
```

<!--
Choose one of your Nodes to use for this exercise.
-->
选择一个节点用于此练习。

<!--
## Advertise a new extended resource on one of your Nodes

To advertise a new extended resource on a Node, send an HTTP PATCH request to
the Kubernetes API server. For example, suppose one of your Nodes has four dongles
attached. Here's an example of a PATCH request that advertises four dongle resources
for your Node.
-->
## 在你的一个节点上发布一种新的扩展资源

为在一个节点上发布一种新的扩展资源，需要发送一个 HTTP PATCH 请求到 Kubernetes API server。
例如：假设你的一个节点上带有四个 dongle 资源。
下面是一个 PATCH 请求的示例，该请求为你的节点发布四个 dongle 资源。

```
PATCH /api/v1/nodes/<your-node-name>/status HTTP/1.1
Accept: application/json
Content-Type: application/json-patch+json
Host: k8s-master:8080

[
  {
    "op": "add",
    "path": "/status/capacity/example.com~1dongle",
    "value": "4"
  }
]
```

<!--
Note that Kubernetes does not need to know what a dongle is or what a dongle is for.
The preceding PATCH request tells Kubernetes that your Node has four things that
you call dongles.

Start a proxy, so that you can easily send requests to the Kubernetes API server:
-->
注意：Kubernetes 不需要了解 dongle 资源的含义和用途。
前面的 PATCH 请求告诉 Kubernetes 你的节点拥有四个你称之为 dongle 的东西。

启动一个代理（proxy），以便你可以很容易地向 Kubernetes API server 发送请求：

```shell
kubectl proxy
```

<!--
In another command window, send the HTTP PATCH request.
Replace `<your-node-name>` with the name of your Node:
-->

在另一个命令窗口中，发送 HTTP PATCH 请求。 用你的节点名称替换 `<your-node-name>`：

```shell
curl --header "Content-Type: application/json-patch+json" \
  --request PATCH \
  --data '[{"op": "add", "path": "/status/capacity/example.com~1dongle", "value": "4"}]' \
  http://localhost:8001/api/v1/nodes/<your-node-name>/status
```

{{< note >}}
<!--
In the preceding request, `~1` is the encoding for the character / in
the patch path. The operation path value in JSON-Patch is interpreted as a
JSON-Pointer. For more details, see
[IETF RFC 6901](https://tools.ietf.org/html/rfc6901), section 3.
-->
在前面的请求中，`~1` 为 patch 路径中 “/” 符号的编码。
JSON-Patch 中的操作路径值被解析为 JSON 指针。
更多细节，请查看 [IETF RFC 6901](https://tools.ietf.org/html/rfc6901) 的第 3 节。
{{< /note >}}

<!--
The output shows that the Node has a capacity of 4 dongles:
-->
输出显示该节点的 dongle 资源容量（capacity）为 4：

```
"capacity": {
  "cpu": "2",
  "memory": "2049008Ki",
  "example.com/dongle": "4",
```

<!--
Describe your Node:
-->
描述你的节点：

```
kubectl describe node <your-node-name>
```

<!--
Once again, the output shows the dongle resource:
-->
输出再次展示了 dongle 资源：

```yaml
Capacity:
  cpu: 2
  memory: 2049008Ki
  example.com/dongle: 4
```

<!--
Now, application developers can create Pods that request a certain
number of dongles. See
[Assign Extended Resources to a Container](/docs/tasks/configure-pod-container/extended-resource/).
-->
现在，应用开发者可以创建请求一定数量 dongle 资源的 Pod 了。
参见[将扩展资源分配给容器](/zh-cn/docs/tasks/configure-pod-container/extended-resource/)。

<!--
## Discussion

Extended resources are similar to memory and CPU resources. For example,
just as a Node has a certain amount of memory and CPU to be shared by all components
running on the Node, it can have a certain number of dongles to be shared
by all components running on the Node. And just as application developers
can create Pods that request a certain amount of memory and CPU, they can
create Pods that request a certain number of dongles.
-->
## 讨论

扩展资源类似于内存和 CPU 资源。例如，正如一个节点拥有一定数量的内存和 CPU 资源，
它们被节点上运行的所有组件共享，该节点也可以拥有一定数量的 dongle 资源，
这些资源同样被节点上运行的所有组件共享。
此外，正如应用开发者可以创建请求一定数量的内存和 CPU 资源的 Pod，
他们也可以创建请求一定数量 dongle 资源的 Pod。

<!--
Extended resources are opaque to Kubernetes; Kubernetes does not
know anything about what they are. Kubernetes knows only that a Node
has a certain number of them. Extended resources must be advertised in integer
amounts. For example, a Node can advertise four dongles, but not 4.5 dongles.
-->
扩展资源对 Kubernetes 是不透明的。Kubernetes 不知道扩展资源含义相关的任何信息。
Kubernetes 只了解一个节点拥有一定数量的扩展资源。
扩展资源必须以整形数量进行发布。
例如，一个节点可以发布 4 个 dongle 资源，但是不能发布 4.5 个。

<!--
### Storage example

Suppose a Node has 800 GiB of a special kind of disk storage. You could
create a name for the special storage, say example.com/special-storage.
Then you could advertise it in chunks of a certain size, say 100 GiB. In that case,
your Node would advertise that it has eight resources of type
example.com/special-storage.
-->
### 存储示例

假设一个节点拥有一种特殊类型的磁盘存储，其容量为 800 GiB。
你可以为该特殊存储创建一个名称，如 `example.com/special-storage`。
然后你就可以按照一定规格的块（如 100 GiB）对其进行发布。
在这种情况下，你的节点将会通知它拥有八个 `example.com/special-storage` 类型的资源。

```yaml
Capacity:
 ...
 example.com/special-storage: 8
```

<!--
If you want to allow arbitrary requests for special storage, you
could advertise special storage in chunks of size 1 byte. In that case, you would advertise
800Gi resources of type example.com/special-storage.
-->
如果你想要允许针对特殊存储任意（数量）的请求，你可以按照 1 字节大小的块来发布特殊存储。
在这种情况下，你将会发布 800Gi 数量的 example.com/special-storage 类型的资源。

```yaml
Capacity:
 ...
 example.com/special-storage:  800Gi
```

<!--
Then a Container could request any number of bytes of special storage, up to 800Gi.
-->
然后，容器就能够请求任意数量（多达 800Gi）字节的特殊存储。

```yaml
Capacity:
 ...
 example.com/special-storage:  800Gi
```

<!--
## Clean up

Here is a PATCH request that removes the dongle advertisement from a Node.
-->
## 清理

这里是一个从节点移除 dongle 资源发布的 PATCH 请求。

```
PATCH /api/v1/nodes/<your-node-name>/status HTTP/1.1
Accept: application/json
Content-Type: application/json-patch+json
Host: k8s-master:8080

[
  {
    "op": "remove",
    "path": "/status/capacity/example.com~1dongle",
  }
]
```

<!--
Start a proxy, so that you can easily send requests to the Kubernetes API server:
-->
启动一个代理，以便你可以很容易地向 Kubernetes API 服务器发送请求：

```shell
kubectl proxy
```

<!--
In another command window, send the HTTP PATCH request.
Replace `<your-node-name>` with the name of your Node:
-->
在另一个命令窗口中，发送 HTTP PATCH 请求。用你的节点名称替换 `<your-node-name>`：

```shell
curl --header "Content-Type: application/json-patch+json" \
  --request PATCH \
  --data '[{"op": "remove", "path": "/status/capacity/example.com~1dongle"}]' \
  http://localhost:8001/api/v1/nodes/<your-node-name>/status
```

<!--
Verify that the dongle advertisement has been removed:
-->
验证 dongle 资源的发布已经被移除：

```
kubectl describe node <your-node-name> | grep dongle
```

<!--
(you should not see any output)
-->
(你应该看不到任何输出)

## {{% heading "whatsnext" %}}

<!--
### For application developers

- [Assign Extended Resources to a Container](/docs/tasks/configure-pod-container/extended-resource/)

### For cluster administrators

- [Configure Minimum and Maximum Memory Constraints for a Namespace](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)
- [Configure Minimum and Maximum CPU Constraints for a Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)
-->
### 针对应用开发人员

- [将扩展资源分配给容器](/zh-cn/docs/tasks/configure-pod-container/extended-resource/)

### 针对集群管理员

- [为名字空间配置最小和最大内存约束](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)
- [为名字空间配置最小和最大 CPU 约束](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)
