---
title: 對 DaemonSet 執行回滾
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
本文展示瞭如何對 {{< glossary_tooltip term_id="daemonset" text="DaemonSet" >}} 執行回滾。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
You should already know how to [perform a rolling update on a
 DaemonSet](/docs/tasks/manage-daemon/update-daemon-set/).
-->
你應該已經瞭解如何[爲 DaemonSet 執行滾動更新](/zh-cn/docs/tasks/manage-daemon/update-daemon-set/)。

<!-- steps -->

<!--
## Performing a rollback on a DaemonSet

### Step 1: Find the DaemonSet revision you want to roll back to

You can skip this step if you only want to roll back to the last revision.

List all revisions of a DaemonSet:
-->
## 對 DaemonSet 執行回滾

### 步驟 1：找到想要 DaemonSet 回滾到的歷史修訂版本（revision）

如果只想回滾到最後一個版本，可以跳過這一步。

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
  to its revisions upon creation. You may specify `--record=true` in `kubectl`
  to record the command executed in the change cause annotation.

To see the details of a specific revision:
-->
* 在創建時，DaemonSet 的變化原因從 `kubernetes.io/change-cause` 註解（annotation）
  複製到其修訂版本中。使用者可以在 `kubectl` 命令中設置 `--record=true`，
  將執行的命令記錄在變化原因註解中。

執行以下命令，來查看指定版本的詳細資訊：

```shell
kubectl rollout history daemonset <daemonset-name> --revision=1
```

<!--
This returns the details of that revision:
-->
該命令返回相應修訂版本的詳細資訊：

```shell
daemonsets "<daemonset-name>" with revision #1
Pod Template:
Labels:       foo=bar
Containers:
app:
 Image:        ...
 Port:         ...
 Environment:  ...
 Mounts:       ...
Volumes:      ...
```

<!--
### Step 2: Roll back to a specific revision
-->
### 步驟 2：回滾到指定版本

```shell
# 在 --to-revision 中指定你從步驟 1 中獲取的修訂版本
kubectl rollout undo daemonset <daemonset-name> --to-revision=<revision>
```

<!--
If it succeeds, the command returns:
-->
如果成功，命令會返回：

```shell
daemonset "<daemonset-name>" rolled back
```

<!--
If `--to-revision` flag is not specified, kubectl picks the most recent revision.
-->
{{< note >}}
如果 `--to-revision` 參數未指定，將選中最近的版本。
{{< /note >}}

<!--
### Step 3: Watch the progress of the DaemonSet rollback

`kubectl rollout undo daemonset` tells the server to start rolling back the
DaemonSet. The real rollback is done asynchronously inside the cluster
{{< glossary_tooltip term_id="control-plane" text="control plane" >}}.
-->
### 步驟 3：監視 DaemonSet 回滾進度

`kubectl rollout undo daemonset` 向伺服器表明啓動 DaemonSet 回滾。
真正的回滾是在叢集的
{{< glossary_tooltip term_id="control-plane" text="控制面" >}}
異步完成的。

<!--
To watch the progress of the rollback:
-->
執行以下命令，來監視 DaemonSet 回滾進度：

```shell
kubectl rollout status ds/<daemonset-name>
```

<!--
When the rollback is complete, the output is similar to:
-->
回滾完成時，輸出形如：

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
## 理解 DaemonSet 修訂版本

在前面的 `kubectl rollout history` 步驟中，你獲得了一個修訂版本列表，每個修訂版本都儲存在名爲
 `ControllerRevision` 的資源中。

要查看每個修訂版本中保存的內容，可以找到 DaemonSet 修訂版本的原生資源：

```shell
kubectl get controllerrevision -l <daemonset-selector-key>=<daemonset-selector-value>
```

<!--
This returns a list of ControllerRevisions:
-->
該命令返回 `ControllerRevisions` 列表：

```
NAME                               CONTROLLER                     REVISION   AGE
<daemonset-name>-<revision-hash>   DaemonSet/<daemonset-name>     1          1h
<daemonset-name>-<revision-hash>   DaemonSet/<daemonset-name>     2          1h
```

<!--
Each ControllerRevision stores the annotations and template of a DaemonSet
revision.
-->
每個 `ControllerRevision` 中儲存了相應 DaemonSet 版本的註解和模板。

<!--
`kubectl rollout undo` takes a specific ControllerRevision and replaces
DaemonSet template with the template stored in the ControllerRevision.
`kubectl rollout undo` is equivalent to updating DaemonSet template to a
previous revision through other commands, such as `kubectl edit` or `kubectl
apply`.
-->
`kubectl rollout undo` 選擇特定的 `ControllerRevision`，並用
`ControllerRevision` 中儲存的模板代替 DaemonSet 的模板。
`kubectl rollout undo` 相當於通過其他命令（如 `kubectl edit` 或 `kubectl apply`）
將 DaemonSet 模板更新至先前的版本。

<!--
DaemonSet revisions only roll forward. That is to say, after a
rollback completes, the revision number (`.revision` field) of the
ControllerRevision being rolled back to will advance. For example, if you
have revision 1 and 2 in the system, and roll back from revision 2 to revision
1, the ControllerRevision with `.revision: 1` will become `.revision: 3`.
-->
{{< note >}}
注意 DaemonSet 修訂版本只會正向變化。也就是說，回滾完成後，所回滾到的
`ControllerRevision` 版本號 (`.revision` 字段) 會增加。
例如，如果使用者在系統中有版本 1 和版本 2，並從版本 2 回滾到版本 1，
帶有 `.revision: 1` 的 `ControllerRevision` 將變爲 `.revision: 3`。
{{< /note >}}

<!--
## Troubleshooting

* See [troubleshooting DaemonSet rolling
  update](/docs/tasks/manage-daemon/update-daemon-set/#troubleshooting).
-->
## 故障排查

* 參閱 [DaemonSet 滾動升級故障排除](/zh-cn/docs/tasks/manage-daemon/update-daemon-set/#troubleshooting)。
