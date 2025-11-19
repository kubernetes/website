---
title: 爲節點發布擴展資源
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
本文展示瞭如何爲節點指定擴展資源（Extended Resource）。
擴展資源允許集羣管理員發佈節點級別的資源，這些資源在不進行發佈的情況下無法被 Kubernetes 感知。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
## Get the names of your Nodes

-->
## 獲取你的節點名稱

```shell
kubectl get nodes
```

<!--
Choose one of your Nodes to use for this exercise.
-->
選擇一個節點用於此練習。

<!--
## Advertise a new extended resource on one of your Nodes

To advertise a new extended resource on a Node, send an HTTP PATCH request to
the Kubernetes API server. For example, suppose one of your Nodes has four dongles
attached. Here's an example of a PATCH request that advertises four dongle resources
for your Node.
-->
## 在你的一個節點上發佈一種新的擴展資源

爲在一個節點上發佈一種新的擴展資源，需要發送一個 HTTP PATCH 請求到 Kubernetes API server。
例如：假設你的一個節點上帶有四個 dongle 資源。
下面是一個 PATCH 請求的示例，該請求爲你的節點發布四個 dongle 資源。

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
注意：Kubernetes 不需要了解 dongle 資源的含義和用途。
前面的 PATCH 請求告訴 Kubernetes 你的節點擁有四個你稱之爲 dongle 的東西。

啓動一個代理（proxy），以便你可以很容易地向 Kubernetes API server 發送請求：

```shell
kubectl proxy
```

<!--
In another command window, send the HTTP PATCH request.
Replace `<your-node-name>` with the name of your Node:
-->

在另一個命令窗口中，發送 HTTP PATCH 請求。 用你的節點名稱替換 `<your-node-name>`：

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
在前面的請求中，`~1` 爲 patch 路徑中 “/” 符號的編碼。
JSON-Patch 中的操作路徑值被解析爲 JSON 指針。
更多細節，請查看 [IETF RFC 6901](https://tools.ietf.org/html/rfc6901) 的第 3 節。
{{< /note >}}

<!--
The output shows that the Node has a capacity of 4 dongles:
-->
輸出顯示該節點的 dongle 資源容量（capacity）爲 4：

```
"capacity": {
  "cpu": "2",
  "memory": "2049008Ki",
  "example.com/dongle": "4",
```

<!--
Describe your Node:
-->
描述你的節點：

```
kubectl describe node <your-node-name>
```

<!--
Once again, the output shows the dongle resource:
-->
輸出再次展示了 dongle 資源：

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
現在，應用開發者可以創建請求一定數量 dongle 資源的 Pod 了。
參見[將擴展資源分配給容器](/zh-cn/docs/tasks/configure-pod-container/extended-resource/)。

<!--
## Discussion

Extended resources are similar to memory and CPU resources. For example,
just as a Node has a certain amount of memory and CPU to be shared by all components
running on the Node, it can have a certain number of dongles to be shared
by all components running on the Node. And just as application developers
can create Pods that request a certain amount of memory and CPU, they can
create Pods that request a certain number of dongles.
-->
## 討論

擴展資源類似於內存和 CPU 資源。例如，正如一個節點擁有一定數量的內存和 CPU 資源，
它們被節點上運行的所有組件共享，該節點也可以擁有一定數量的 dongle 資源，
這些資源同樣被節點上運行的所有組件共享。
此外，正如應用開發者可以創建請求一定數量的內存和 CPU 資源的 Pod，
他們也可以創建請求一定數量 dongle 資源的 Pod。

<!--
Extended resources are opaque to Kubernetes; Kubernetes does not
know anything about what they are. Kubernetes knows only that a Node
has a certain number of them. Extended resources must be advertised in integer
amounts. For example, a Node can advertise four dongles, but not 4.5 dongles.
-->
擴展資源對 Kubernetes 是不透明的。Kubernetes 不知道擴展資源含義相關的任何信息。
Kubernetes 只瞭解一個節點擁有一定數量的擴展資源。
擴展資源必須以整形數量進行發佈。
例如，一個節點可以發佈 4 個 dongle 資源，但是不能發佈 4.5 個。

<!--
### Storage example

Suppose a Node has 800 GiB of a special kind of disk storage. You could
create a name for the special storage, say example.com/special-storage.
Then you could advertise it in chunks of a certain size, say 100 GiB. In that case,
your Node would advertise that it has eight resources of type
example.com/special-storage.
-->
### 存儲示例

假設一個節點擁有一種特殊類型的磁盤存儲，其容量爲 800 GiB。
你可以爲該特殊存儲創建一個名稱，如 `example.com/special-storage`。
然後你就可以按照一定規格的塊（如 100 GiB）對其進行發佈。
在這種情況下，你的節點將會通知它擁有八個 `example.com/special-storage` 類型的資源。

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
如果你想要允許針對特殊存儲任意（數量）的請求，你可以按照 1 字節大小的塊來發布特殊存儲。
在這種情況下，你將會發布 800Gi 數量的 example.com/special-storage 類型的資源。

```yaml
Capacity:
 ...
 example.com/special-storage:  800Gi
```

<!--
Then a Container could request any number of bytes of special storage, up to 800Gi.
-->
然後，容器就能夠請求任意數量（多達 800Gi）字節的特殊存儲。

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

這裏是一個從節點移除 dongle 資源發佈的 PATCH 請求。

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
啓動一個代理，以便你可以很容易地向 Kubernetes API 服務器發送請求：

```shell
kubectl proxy
```

<!--
In another command window, send the HTTP PATCH request.
Replace `<your-node-name>` with the name of your Node:
-->
在另一個命令窗口中，發送 HTTP PATCH 請求。用你的節點名稱替換 `<your-node-name>`：

```shell
curl --header "Content-Type: application/json-patch+json" \
  --request PATCH \
  --data '[{"op": "remove", "path": "/status/capacity/example.com~1dongle"}]' \
  http://localhost:8001/api/v1/nodes/<your-node-name>/status
```

<!--
Verify that the dongle advertisement has been removed:
-->
驗證 dongle 資源的發佈已經被移除：

```
kubectl describe node <your-node-name> | grep dongle
```

<!--
(you should not see any output)
-->
(你應該看不到任何輸出)

## {{% heading "whatsnext" %}}

<!--
### For application developers

- [Assign Extended Resources to a Container](/docs/tasks/configure-pod-container/extended-resource/)
- [Extended Resource allocation by DRA](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#extended-resource)

### For cluster administrators

- [Configure Minimum and Maximum Memory Constraints for a Namespace](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)
- [Configure Minimum and Maximum CPU Constraints for a Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)
- [Extended Resource allocation by DRA](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#extended-resource)
-->
### 針對應用開發人員

- [將擴展資源分配給容器](/zh-cn/docs/tasks/configure-pod-container/extended-resource/)
- [通過 DRA 爲節點分配擴展資源](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#extended-resource)

### 針對集羣管理員

- [爲名字空間配置最小和最大內存約束](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)
- [爲名字空間配置最小和最大 CPU 約束](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)
- [通過 DRA 爲節點分配擴展資源](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#extended-resource)
