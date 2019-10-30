---
reviewers:
- janetkuo
title: 对 DaemonSet 执行滚动更新
content_template: templates/task
---

<!--
---
reviewers:
- janetkuo
title: Perform a Rolling Update on a DaemonSet
content_template: templates/task
---
--->

{{% capture overview %}}

<!--
This page shows how to perform a rolling update on a DaemonSet.
--->
本文介绍了如何对 DaemonSet 执行滚动更新。

{{% /capture %}}


{{% capture prerequisites %}}

<!--
* The DaemonSet rolling update feature is only supported in Kubernetes version 1.6 or later.
--->
* Kubernetes 1.6 或者更高版本中才支持 DaemonSet 滚动更新功能。

{{% /capture %}}


{{% capture steps %}}

<!--
## DaemonSet Update Strategy
--->
## DaemonSet 更新策略

<!--
DaemonSet has two update strategy types:
--->
DaemonSet 有两种更新策略：

<!--
* OnDelete:  With `OnDelete` update strategy, after you update a DaemonSet template, new
  DaemonSet pods will *only* be created when you manually delete old DaemonSet
  pods. This is the same behavior of DaemonSet in Kubernetes version 1.5 or
  before.
* RollingUpdate: This is the default update strategy.  
  With `RollingUpdate` update strategy, after you update a
  DaemonSet template, old DaemonSet pods will be killed, and new DaemonSet pods
  will be created automatically, in a controlled fashion.
--->

* OnDelete:  使用 `OnDelete` 更新策略时，在更新 DaemonSet 模板后，只有当您手动删除老的 DaemonSet pods 之后，新的 DaemonSet pods *才会*被自动创建。跟 Kubernetes 1.6 以前的版本类似。
* RollingUpdate: 这是默认的更新策略。使用 `RollingUpdate` 更新策略时，在更新 DaemonSet 模板后，老的 DaemonSet pods 将被终止，并且将以受控方式自动创建新的 DaemonSet pods。

<!--
## Performing a Rolling Update
--->
## 执行滚动更新

<!--
To enable the rolling update feature of a DaemonSet, you must set its
`.spec.updateStrategy.type` to `RollingUpdate`.
--->
要启用 DaemonSet 的滚动更新功能，必须设置 `.spec.updateStrategy.type` 为 `RollingUpdate`。

<!--
You may want to set [`.spec.updateStrategy.rollingUpdate.maxUnavailable`](/docs/concepts/workloads/controllers/deployment/#max-unavailable) (default
to 1) and [`.spec.minReadySeconds`](/docs/concepts/workloads/controllers/deployment/#min-ready-seconds) (default to 0) as well.
--->
您可能想设置[`.spec.updateStrategy.rollingUpdate.maxUnavailable`](/docs/concepts/workloads/controllers/deployment/#max-unavailable) (默认为 1) 和[`.spec.minReadySeconds`](/docs/concepts/workloads/controllers/deployment/#min-ready-seconds) (默认为 0)。 

<!--
### Step 1: Checking DaemonSet `RollingUpdate` update strategy
--->
### 步骤 1: 检查 DaemonSet 的滚动更新策略

<!--
First, check the update strategy of your DaemonSet, and make sure it's set to
`RollingUpdate`:
--->
首先，检查 DaemonSet 的更新策略，确保已经将其设置为 `RollingUpdate`:

```shell
kubectl get ds/<daemonset-name> -o go-template='{{.spec.updateStrategy.type}}{{"\n"}}'
```

<!--
If you haven't created the DaemonSet in the system, check your DaemonSet
manifest with the following command instead:
--->
如果还没在系统中创建 DaemonSet，请使用以下命令检查 DaemonSet 的清单：

```shell
kubectl create -f ds.yaml --dry-run -o go-template='{{.spec.updateStrategy.type}}{{"\n"}}'
```
<!--
The output from both commands should be:
--->
两个命令的输出都应该为：

```shell
RollingUpdate
```

<!--
If the output isn't `RollingUpdate`, go back and modify the DaemonSet object or
manifest accordingly.
--->
如果输出不是 `RollingUpdate`，请返回并相应地修改 DaemonSet 对象或者清单。

<!--
### Step 2: Creating a DaemonSet with `RollingUpdate` update strategy
--->
### 步骤 2：使用 `RollingUpdate` 更新策略创建 DaemonSet

<!--
If you have already created the DaemonSet, you may skip this step and jump to
step 3.
--->
如果已经创建了 DaemonSet，则可以跳过该步骤并跳转到步骤 3。

<!--
After verifying the update strategy of the DaemonSet manifest, create the DaemonSet:
--->
验证 DaemonSet 清单的更新策略后，创建 DaemonSet：

```shell
kubectl create -f ds.yaml
```

<!--
Alternatively, use `kubectl apply` to create the same DaemonSet if you plan to
update the DaemonSet with `kubectl apply`.
--->
或者，您打算使用 `kubectl apply` 更新 DaemonSet，请使用 `kubectl apply` 创建相同的 DaemonSet。

```shell
kubectl apply -f ds.yaml
```

<!--
### Step 3: Updating a DaemonSet template
--->
### 步骤 3：更新 DaemonSet 模板

<!--
Any updates to a `RollingUpdate` DaemonSet `.spec.template` will trigger a rolling
update. This can be done with several different `kubectl` commands.
--->
对 `RollingUpdate` DaemonSet `.spec.template` 的任何更新都将触发滚动更新。这可以通过几个不同的 `kubectl` 命令来完成。

<!--
#### Declarative commands
--->
#### 声明式命令

<!--
If you update DaemonSets using
[configuration files](/docs/concepts/overview/object-management-kubectl/declarative-config/),
use `kubectl apply`:
--->
如果您使用[配置文件](/docs/concepts/overview/object-management-kubectl/declarative-config/)来更新 DaemonSets，请使用 `kubectl apply`:

```shell
kubectl apply -f ds-v2.yaml
```

<!--
#### Imperative commands
--->
#### 命令式命令

<!--
If you update DaemonSets using
[imperative commands](/docs/concepts/overview/object-management-kubectl/imperative-command/),
use `kubectl edit` or `kubectl patch`:
--->
如果您使用[命令式命令](/docs/concepts/overview/object-management-kubectl/imperative-command/)来更新 DaemonSets，请使用`kubectl edit` 或者 `kubectl patch`:

```shell
kubectl edit ds/<daemonset-name>
```

```shell
kubectl patch ds/<daemonset-name> -p=<strategic-merge-patch>
```

<!--
##### Updating only the container image
--->
##### 只更新容器镜像

<!--
If you just need to update the container image in the DaemonSet template, i.e.
`.spec.template.spec.containers[*].image`, use `kubectl set image`:
--->
如果您只需要更新 DaemonSet 模板里的容器镜像，比如，`.spec.template.spec.containers[*].image`, 请使用 `kubectl set image`:

```shell
kubectl set image ds/<daemonset-name> <container-name>=<container-new-image>
```

<!--
### Step 4: Watching the rolling update status
--->
### 步骤 4：查看滚动更新状态

<!--
Finally, watch the rollout status of the latest DaemonSet rolling update:
--->
最后，观察 DaemonSet 最新滚动更新的进度：

```shell
kubectl rollout status ds/<daemonset-name>
```

<!--
When the rollout is complete, the output is similar to this:
--->
当滚动更新完成时，输出结果如下：

```shell
daemonset "<daemonset-name>" successfully rolled out
```

<!--
## Troubleshooting
--->
## 故障排查

<!--
### DaemonSet rolling update is stuck
--->
### DaemonSet 滚动更新卡住

<!--
Sometimes, a DaemonSet rolling update may be stuck. Here are some possible
causes:
--->
有时，DaemonSet 滚动更新可能会卡住。可能原因如下：

<!--
#### Some nodes run out of resources
--->
#### 一些节点资源用尽

<!--
The rollout is stuck because new DaemonSet pods can't be scheduled on at least one
node. This is possible when the node is
[running out of resources](/docs/tasks/administer-cluster/out-of-resource/).
--->
由于新 DaemonSet pods 无法调度到至少一个节点时，滚动更新就会卡住。这可能是由于节点已经[资源用尽](/docs/tasks/administer-cluster/out-of-resource/)。

<!--
When this happens, find the nodes that don't have the DaemonSet pods scheduled on
by comparing the output of `kubectl get nodes` and the output of:
--->
发生这种情况时，通过对 `kubectl get nodes` 和下面命令行的输出作比较，找出没有调度部署 DaemonSet pods 的节点：

```shell
kubectl get pods -l <daemonset-selector-key>=<daemonset-selector-value> -o wide
```

<!--
Once you've found those nodes, delete some non-DaemonSet pods from the node to
make room for new DaemonSet pods.
--->
一旦找到这些节点，从节点上删除一些非 DaemonSet pods，为新的 DaemonSet pods 腾出空间。

<!--
{{< note >}}
This will cause service disruption when deleted pods are not controlled by any controllers or pods are not
replicated. This does not respect [PodDisruptionBudget](/docs/tasks/configure-pod-container/configure-pod-disruption-budget/)
either.
{{< /note >}}
--->
{{< note >}}
当所删除的 pods 不受任何控制器管理，也不是多副本的 pods，上述操作将导致服务中断。
同时，上述操作也不会考虑 [PodDisruptionBudget](/docs/tasks/configure-pod-container/configure-pod-disruption-budget/) 所施加的约束。
{{< /note >}}

<!--
#### Broken rollout
--->

#### 滚动更新中断


<!--
If the recent DaemonSet template update is broken, for example, the container is
crash looping, or the container image doesn't exist (often due to a typo),
DaemonSet rollout won't progress.
--->
如果最近的 DaemonSet 模板更新被破坏了，比如，容器处于崩溃循环状态或者容器镜像不存在(通常由于拼写错误)，就会发生 DaemonSet 滚动更新中断。

<!--
To fix this, just update the DaemonSet template again. New rollout won't be
blocked by previous unhealthy rollouts.
--->
要解决此问题，只需再次更新 DaemonSet 模板即可。以前不健康的滚动更新不会阻止新的滚动更新。

<!--
#### Clock skew
--->
#### 时钟偏差

<!--
If `.spec.minReadySeconds` is specified in the DaemonSet, clock skew between
master and nodes will make DaemonSet unable to detect the right rollout
progress.
--->
如果在 DaemonSet 中指定了 `.spec.minReadySeconds`，主节点和工作节点之间的时钟偏差会使 DaemonSet 无法检测到正确的滚动更新进度。

{{% /capture %}}


{{% capture whatsnext %}}

<!--
* See [Task: Performing a rollback on a
  DaemonSet](/docs/tasks/manage-daemon/rollback-daemon-set/)
* See [Concepts: Creating a DaemonSet to adopt existing DaemonSet pods](/docs/concepts/workloads/controllers/daemonset/)
--->
* 查看[任务: 在 DaemonSet 上执行回滚](/docs/tasks/manage-daemon/rollback-daemon-set/)
* 查看[概念: 创建 DaemonSet 以适应现有的 DaemonSet pods](/docs/concepts/workloads/controllers/daemonset/)

{{% /capture %}}
