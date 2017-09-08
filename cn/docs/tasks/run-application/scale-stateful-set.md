---
approvers:
- bprashanth
- enisoc
- erictune
- foxish
- janetkuo
- kow3ns
- smarterclayton
title: 伸缩StatefulSet
---

{% capture overview %}
本文介绍如何伸缩StatefulSet.
{% endcapture %}

{% capture prerequisites %}

* StatefulSets仅适用于Kubernetes1.5版本或高于1.5.
* **不是所有stateful applications都适合伸缩.** 在伸缩前您必须了解您的StatefulSets应用. 如果您不确定, 请记住伸缩该StatefulSets也许不安全.
* 仅当您确定该stateful应用的集群是完全健康才可执行伸缩操作.

{% endcapture %}

{% capture steps %}

## 使用 `kubectl` 伸缩StatefulSets

伸缩前确保 `kubectl` 已升级至Kubernetes1.5版本或高于1.5. 如果不确定, 执行 `kubectl version` 命令并检查使用的 `Client Version`.

### `kubectl 伸缩`

首先, 找到您想要伸缩的StatefulSet. 记住, 您需先清楚是否能伸缩该应用.

```shell
kubectl get statefulsets <stateful-set-name>
```

改变StatefulSet副本数量:

```shell
kubectl scale statefulsets <stateful-set-name> --replicas=<new-replicas>
```

### 可使用其他命令: `kubectl apply` / `kubectl edit` / `kubectl patch`

另外, 您可以 [in-place updates](/docs/concepts/cluster-administration/manage-deployment/#in-place-updates-of-resources) StatefulSets.

如果您的StatefulSet开始由 `kubectl apply` 或 `kubectl create --save-config`创建,
更新StatefulSet manifests中的 `.spec.replicas`, 然后执行命令 `kubectl apply`:

```shell
kubectl apply -f <stateful-set-file-updated>
```

除此之外, 可以通过命令 `kubectl edit`编辑该字段:

```shell
kubectl edit statefulsets <stateful-set-name>
```

或使用 `kubectl patch`:

```shell
kubectl patch statefulsets <stateful-set-name> -p '{"spec":{"replicas":<new-replicas>}}'
```

## 排查故障

### 缩容工作不正常

当stateful管理下的任何一个Pod不健康时您不能缩容该StatefulSet. 仅当stateful下的所有Pods都处于运行和ready状态后才可缩容.

当一个StatefulSet的size > 1, 如果有一个不健康的Pod, 没有办法让Kubernetes知道是否是由于永久性故障还是瞬态(升级/维护/节点重启)导致. 如果该Pod不健康是由于永久性
故障导致, 则在不纠正该故障的情况下进行缩容可能会导致一种状态， 即StatefulSet下的Pod数量低于应正常运行的副本数. 这也许会导致StatefulSet变成不可用.

如果由于瞬态故障而导致Pod不健康,并且Pod可能再次可用，那么瞬态错误可能会干扰您对StatefulSet的扩容/缩容操作. 一些分布式数据库在节点加入和同时离开时存在问题. 在这些情况下，最好是在应用级别进行伸缩操作, 并且只有在您确保stateful应用的集群是完全健康时才执行伸缩.


{% endcapture %}

{% capture whatsnext %}

了解更多 [deleting a StatefulSet](/docs/tasks/manage-stateful-set/deleting-a-statefulset/).

{% endcapture %}

{% include templates/task.md %}
