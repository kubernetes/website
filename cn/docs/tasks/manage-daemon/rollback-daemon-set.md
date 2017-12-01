---
approvers:
- janetkuo
title: 对 DaemonSet 执行回滚
---

{% capture overview %}

本文展示了如何对 DaemonSet 执行回滚。

{% endcapture %}


{% capture prerequisites %}

* DaemonSet 滚动升级历史和 DaemonSet 回滚特性仅在 Kubernetes 1.7 及以后版本的 `kubectl` 中支持。
* 确保您了解如何 [对 DaemonSet 执行滚动升级](/docs/tasks/manage-daemon/update-daemon-set/)。

{% endcapture %}


{% capture steps %}

## 对 DaemonSet 执行回滚

### 步骤 1： 找到想要 DaemonSet 回滚到的历史版本（revision）

如果只想回滚到最后一个版本，可以跳过这一步。

列出 DaemonSet 的所有版本：

```shell
kubectl rollout history daemonset <daemonset-name>
```

该命令返回 DaemonSet 版本列表：

```shell
daemonsets "<daemonset-name>"
REVISION        CHANGE-CAUSE
1               ...
2               ...
...
```

* 在创建时，DaemonSet 的变化原因从 `kubernetes.io/change-cause` 注解（annotation）复制到其版本中。 用户可以在 `kubectl` 中指定 `--record=true` ，将执行的命令记录在变化原因注解中。 

执行以下命令，来查看指定版本的详细信息：

```shell
kubectl rollout history daemonset <daemonset-name> --revision=1
```

该命令返回相应版本的详细信息：

```shell
daemonsets "<daemonset-name>" with revision #1
Pod Template:
Labels:       foo=bar
Containers:
app:
 Image:       ...
 Port:        ...
 Environment: ...
 Mounts:      ...
Volumes:       ...
```

### 步骤 2： 回滚到指定版本

```shell
# 在 --to-revision 中指定您从步骤 1 中获取的版本序号
kubectl rollout undo daemonset <daemonset-name> --to-revision=<revision>
```

如果成功，命令会返回：

```shell
daemonset "<daemonset-name>" rolled back
```

如果 `--to-revision` 参数未指定，将选中最近的版本。

### 步骤 3： 观察 DaemonSet 回滚进度

`kubectl rollout undo daemonset` 向服务器表明启动 DaemonSet 回滚。 真正的回滚是在服务器端异步完成的。

执行以下命令，来观察 DaemonSet 回滚进度：

```shell 
kubectl rollout status ds/<daemonset-name> 
```

回滚完成时，输出形如：

```shell
daemonset "<daemonset-name>" successfully rolled out
```

{% endcapture %}


{% capture discussion %}

## 理解 DaemonSet 版本

在前面的 `kubectl rollout history` 步骤中，您获得了一个版本列表，每个版本都存储在名为
 `ControllerRevision` 的资源中。 `ControllerRevision` 仅在 Kubernetes 1.7 及以后的版本中可用。

查找原始的版本资源，来查看每个版本中存储了什么内容：

```shell
kubectl get controllerrevision -l <daemonset-selector-key>=<daemonset-selector-value>
```

该命令返回 `ControllerRevisions` 列表：

```shell
NAME                               CONTROLLER                     REVISION   AGE
<daemonset-name>-<revision-hash>   DaemonSet/<daemonset-name>     1          1h
<daemonset-name>-<revision-hash>   DaemonSet/<daemonset-name>     2          1h
```

每个 `ControllerRevision` 中存储了相应 DaemonSet 版本的注解和模板。

`kubectl rollout undo` 采用特定 `ControllerRevision` ，并用
`ControllerRevision` 中存储的模板代替 DaemonSet 的模板。
`kubectl rollout undo` 相当于通过其他命令（如 `kubectl edit` 或 `kubectl apply`）将 DaemonSet 模板更新至先前的版本。

注意 DaemonSet 版本只会向前滚动。 也就是说，回滚完成后，所回滚到的 `ControllerRevision` 版本号 (`.revision` 字段) 会增加。 例如，如果用户在系统中有版本 1 和版本 2，并从版本 2 回滚到版本 1 ，带有 `.revision: 1` 的`ControllerRevision` 将变为 `.revision: 3`。

## 故障排除

* 查看 [DaemonSet 滚动升级故障排除](/docs/tasks/manage-daemon/update-daemon-set/#troubleshooting)。

{% endcapture %}

{% include templates/task.md %}
