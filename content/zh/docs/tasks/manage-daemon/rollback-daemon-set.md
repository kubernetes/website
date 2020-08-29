---
approvers:
- janetkuo
title: 对 DaemonSet 执行回滚
content_type: task
weight: 20
min-kubernetes-server-version: 1.7
---
<!--
reviewers:
- janetkuo
title: Perform a Rollback on a DaemonSet
content_type: task
weight: 20
min-kubernetes-server-version: 1.7
-->

<!-- overview -->
<!--
This page shows how to perform a rollback on a {{< glossary_tooltip term_id="daemonset" >}}.
-->
本文展示了如何对 {{< glossary_tooltip term_id="daemonset" text="DaemonSet" >}} 执行回滚。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
You should already know how to [perform a rolling update on a
 DaemonSet](/docs/tasks/manage-daemon/update-daemon-set/).
-->
你应该已经了解如何[为 DaemonSet 执行滚东更新](/zh/docs/tasks/manage-daemon/update-daemon-set/)。

<!-- steps -->

<!--
## Performing a rollback on a DaemonSet

### Step 1: Find the DaemonSet revision you want to roll back to

You can skip this step if you just want to roll back to the last revision.

List all revisions of a DaemonSet:
-->
## 对 DaemonSet 执行回滚

### 步骤 1：找到想要 DaemonSet 回滚到的历史修订版本（revision）

如果只想回滚到最后一个版本，可以跳过这一步。

列出 DaemonSet 的所有版本：

```shell
kubectl rollout history daemonset <daemonset-name>
```

<!--
This returns a list of DaemonSet revisions:
-->
此命令返回 DaemonSet 版本列表：

```shell
daemonsets "<daemonset-name>"
REVISION        CHANGE-CAUSE
1               ...
2               ...
...
```

<!--
* Change cause is copied from DaemonSet annotation `kubernetes.io/change-cause`
  to its revisions upon creation. You may specify `-record=true` in `kubectl`
  to record the command executed in the change cause annotation.

To see the details of a specific revision:
-->
* 在创建时，DaemonSet 的变化原因从 `kubernetes.io/change-cause` 注解（annotation）
  复制到其修订版本中。用户可以在 `kubectl` 命令中设置 `--record=true`，
  将执行的命令记录在变化原因注解中。

执行以下命令，来查看指定版本的详细信息：

```shell
kubectl rollout history daemonset <daemonset-name> --revision=1
```

<!--
This returns the details of that revision:
-->
该命令返回相应修订版本的详细信息：

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

<!--
### Step 2: Roll back to a specific revision
-->
### 步骤 2：回滚到指定版本

```shell
# 在 --to-revision 中指定你从步骤 1 中获取的修订版本
kubectl rollout undo daemonset <daemonset-name> --to-revision=<revision>
```

<!--
If it succeeds, the command returns:
-->
如果成功，命令会返回：

```shell
daemonset "<daemonset-name>" rolled back
```

<!--
If `--to-revision` flag is not specified, kubectl picks the most recent revision.
-->
{{< note >}}
如果 `--to-revision` 参数未指定，将选中最近的版本。
{{< /note >}}

<!--
### Step 3: Watch the progress of the DaemonSet rollback

`kubectl rollout undo daemonset` tells the server to start rolling back the
DaemonSet. The real rollback is done asynchronously inside the cluster
{{< glossary_tooltip term_id="control-plane" text="control plane" >}}.
-->
### 步骤 3：监视 DaemonSet 回滚进度

`kubectl rollout undo daemonset` 向服务器表明启动 DaemonSet 回滚。
真正的回滚是在集群的
{{< glossary_tooltip term_id="control-plane" text="控制面" >}}
异步完成的。

<!--
To watch the progress of the rollback:
-->
执行以下命令，来监视 DaemonSet 回滚进度：

```shell
kubectl rollout status ds/<daemonset-name>
```

<!--
When the rollback is complete, the output is similar to:
-->
回滚完成时，输出形如：

```
daemonset "<daemonset-name>" successfully rolled out
```

<!-- discussion -->

<!--
## Understanding DaemonSet revisions

In the previous `kubectl rollout history` step, you got a list of DaemonSet
revisions. Each revision is stored in a resource named ControllerRevision.

To see what is stored in each revision, find the DaemonSet revision raw
resources:
-->
## 理解 DaemonSet 修订版本

在前面的 `kubectl rollout history` 步骤中，你获得了一个修订版本列表，每个修订版本都存储在名为
 `ControllerRevision` 的资源中。

要查看每个修订版本中保存的内容，可以找到 DaemonSet 修订版本的原生资源：

```shell
kubectl get controllerrevision -l <daemonset-selector-key>=<daemonset-selector-value>
```

<!--
This returns a list of ControllerRevisions:
-->
该命令返回 `ControllerRevisions` 列表：

```
NAME                               CONTROLLER                     REVISION   AGE
<daemonset-name>-<revision-hash>   DaemonSet/<daemonset-name>     1          1h
<daemonset-name>-<revision-hash>   DaemonSet/<daemonset-name>     2          1h
```

<!--
Each ControllerRevision stores the annotations and template of a DaemonSet
revision.
-->
每个 `ControllerRevision` 中存储了相应 DaemonSet 版本的注解和模板。

<!--
`kubectl rollout undo` takes a specific ControllerRevision and replaces
DaemonSet template with the template stored in the ControllerRevision.
`kubectl rollout undo` is equivalent to updating DaemonSet template to a
previous revision through other commands, such as `kubectl edit` or `kubectl
apply`.
-->
`kubectl rollout undo` 选择特定的 `ControllerRevision`，并用
`ControllerRevision` 中存储的模板代替 DaemonSet 的模板。
`kubectl rollout undo` 相当于通过其他命令（如 `kubectl edit` 或 `kubectl apply`）
将 DaemonSet 模板更新至先前的版本。

<!--
DaemonSet revisions only roll forward. That is to say, after a
rollback completes, the revision number (`.revision` field) of the
ControllerRevision being rolled back to will advance. For example, if you
have revision 1 and 2 in the system, and roll back from revision 2 to revision
1, the ControllerRevision with `.revision: 1` will become `.revision: 3`.
-->
{{< note >}}
注意 DaemonSet 修订版本只会正向变化。也就是说，回滚完成后，所回滚到的
`ControllerRevision` 版本号 (`.revision` 字段) 会增加。
例如，如果用户在系统中有版本 1 和版本 2，并从版本 2 回滚到版本 1，
带有 `.revision: 1` 的`ControllerRevision` 将变为 `.revision: 3`。
{{< /note >}}

<!--
## Troubleshooting

* See [troubleshooting DaemonSet rolling
  update](/docs/tasks/manage-daemon/update-daemon-set/#troubleshooting).
-->
## 故障排查

* 参阅 [DaemonSet 滚动升级故障排除](/zh/docs/tasks/manage-daemon/update-daemon-set/#troubleshooting)。


