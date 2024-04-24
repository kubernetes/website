---
title: 对 DaemonSet 执行滚动更新
content_type: task
weight: 10
---

<!--
reviewers:
- janetkuo
title: Perform a Rolling Update on a DaemonSet
content_type: task
-->

<!-- overview -->

<!--
This page shows how to perform a rolling update on a DaemonSet.
-->
本文介绍了如何对 DaemonSet 执行滚动更新。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

<!--
## DaemonSet Update Strategy

DaemonSet has two update strategy types:
-->
## DaemonSet 更新策略    {#daemonset-update-strategy}

DaemonSet 有两种更新策略：

<!--
* `OnDelete`: With `OnDelete` update strategy, after you update a DaemonSet template, new
  DaemonSet pods will *only* be created when you manually delete old DaemonSet
  pods. This is the same behavior of DaemonSet in Kubernetes version 1.5 or
  before.
* `RollingUpdate`: This is the default update strategy.  
  With `RollingUpdate` update strategy, after you update a
  DaemonSet template, old DaemonSet pods will be killed, and new DaemonSet pods
  will be created automatically, in a controlled fashion. At most one pod of
  the DaemonSet will be running on each node during the whole update process.
-->

* `OnDelete`：使用 `OnDelete` 更新策略时，在更新 DaemonSet 模板后，只有当你手动删除老的
  DaemonSet Pod 之后，新的 DaemonSet Pod **才会**被自动创建。跟 Kubernetes 1.6 以前的版本类似。
* `RollingUpdate`：这是默认的更新策略。使用 `RollingUpdate` 更新策略时，在更新 DaemonSet 模板后，
  老的 DaemonSet Pod 将被终止，并且将以受控方式自动创建新的 DaemonSet Pod。
  更新期间，最多只能有 DaemonSet 的一个 Pod 运行于每个节点上。

<!--
## Performing a Rolling Update

To enable the rolling update feature of a DaemonSet, you must set its
`.spec.updateStrategy.type` to `RollingUpdate`.
-->
## 执行滚动更新    {#performing-a-rolling-update}

要启用 DaemonSet 的滚动更新功能，必须设置 `.spec.updateStrategy.type` 为 `RollingUpdate`。

<!--
You may want to set
[`.spec.updateStrategy.rollingUpdate.maxUnavailable`](/docs/reference/kubernetes-api/workload-resources/daemon-set-v1/#DaemonSetSpec) 
(default to 1),
[`.spec.minReadySeconds`](/docs/reference/kubernetes-api/workload-resources/daemon-set-v1/#DaemonSetSpec)
(default to 0) and
[`.spec.updateStrategy.rollingUpdate.maxSurge`](/docs/reference/kubernetes-api/workload-resources/daemon-set-v1/#DaemonSetSpec)
(defaults to 0) as well.
-->
你可能想设置
[`.spec.updateStrategy.rollingUpdate.maxUnavailable`](/zh-cn/docs/reference/kubernetes-api/workload-resources/daemon-set-v1/#DaemonSetSpec)（默认为 1）、
[`.spec.minReadySeconds`](/zh-cn/docs/reference/kubernetes-api/workload-resources/daemon-set-v1/#DaemonSetSpec)（默认为 0）和
[`.spec.updateStrategy.rollingUpdate.maxSurge`](/zh-cn/docs/reference/kubernetes-api/workload-resources/daemon-set-v1/#DaemonSetSpec)
（默认为 0）。

<!--
### Creating a DaemonSet with `RollingUpdate` update strategy

This YAML file specifies a DaemonSet with an update strategy as 'RollingUpdate'
-->
### 创建带有 `RollingUpdate` 更新策略的 DaemonSet    {#creating-a-daemonset-with-rollingupdate-update-strategy}

下面的 YAML 包含一个 DaemonSet，其更新策略为 'RollingUpdate'：

{{% code_sample file="controllers/fluentd-daemonset.yaml" %}}

<!--
After verifying the update strategy of the DaemonSet manifest, create the DaemonSet:
-->
检查了 DaemonSet 清单中更新策略的设置之后，创建 DaemonSet：

```shell
kubectl create -f https://k8s.io/examples/controllers/fluentd-daemonset.yaml
```

<!--
Alternatively, use `kubectl apply` to create the same DaemonSet if you plan to
update the DaemonSet with `kubectl apply`.
-->
另一种方式是如果你希望使用 `kubectl apply` 来更新 DaemonSet 的话，
也可以使用 `kubectl apply` 来创建 DaemonSet：

```shell
kubectl apply -f https://k8s.io/examples/controllers/fluentd-daemonset.yaml
```

<!--
### Checking DaemonSet `RollingUpdate` update strategy

Check the update strategy of your DaemonSet, and make sure it's set to
`RollingUpdate`:
-->
### 检查 DaemonSet 的滚动更新策略    {#checking-daemonset-rollingupdate-update-strategy}

首先，检查 DaemonSet 的更新策略，确保已经将其设置为 `RollingUpdate`：

```shell
kubectl get ds/fluentd-elasticsearch -o go-template='{{.spec.updateStrategy.type}}{{"\n"}}' -n kube-system
```

<!--
If you haven't created the DaemonSet in the system, check your DaemonSet
manifest with the following command instead:
-->
如果还没在系统中创建 DaemonSet，请使用以下命令检查 DaemonSet 的清单：

```shell
kubectl apply -f https://k8s.io/examples/controllers/fluentd-daemonset.yaml --dry-run=client -o go-template='{{.spec.updateStrategy.type}}{{"\n"}}'
```

<!--
The output from both commands should be:
-->
两个命令的输出都应该为：

```
RollingUpdate
```

<!--
If the output isn't `RollingUpdate`, go back and modify the DaemonSet object or
manifest accordingly.
-->
如果输出不是 `RollingUpdate`，请返回并相应地修改 DaemonSet 对象或者清单。

<!--
### Updating a DaemonSet template

Any updates to a `RollingUpdate` DaemonSet `.spec.template` will trigger a rolling
update. Let's update the DaemonSet by applying a new YAML file. This can be done with several different `kubectl` commands.
-->
### 更新 DaemonSet 模板    {#updating-a-daemonset-template}

对 `RollingUpdate` DaemonSet 的 `.spec.template` 的任何更新都将触发滚动更新。
这可以通过几个不同的 `kubectl` 命令来完成。

{{% code_sample file="controllers/fluentd-daemonset-update.yaml" %}}

<!--
#### Declarative commands

If you update DaemonSets using
[configuration files](/docs/tasks/manage-kubernetes-objects/declarative-config/),
use `kubectl apply`:
-->
#### 声明式命令    {#declarative-commands}

如果你使用[配置文件](/zh-cn/docs/tasks/manage-kubernetes-objects/declarative-config/)来更新
DaemonSet，请使用 `kubectl apply`：

```shell
kubectl apply -f https://k8s.io/examples/controllers/fluentd-daemonset-update.yaml
```

<!--
#### Imperative commands

If you update DaemonSets using
[imperative commands](/docs/tasks/manage-kubernetes-objects/imperative-command/),
use `kubectl edit`:
-->
#### 指令式命令    {#imperative-commands}

如果你使用[指令式命令](/zh-cn/docs/tasks/manage-kubernetes-objects/imperative-command/)来更新
DaemonSets，请使用 `kubectl edit`：

```shell
kubectl edit ds/fluentd-elasticsearch -n kube-system
```

<!--
##### Updating only the container image

If you only need to update the container image in the DaemonSet template, i.e.
`.spec.template.spec.containers[*].image`, use `kubectl set image`:
--->
##### 只更新容器镜像    {#updating-only-the-container-image}

如果你只需要更新 DaemonSet 模板里的容器镜像，比如 `.spec.template.spec.containers[*].image`，
请使用 `kubectl set image`：

```shell
kubectl set image ds/fluentd-elasticsearch fluentd-elasticsearch=quay.io/fluentd_elasticsearch/fluentd:v2.6.0 -n kube-system
```

<!--
### Watching the rolling update status

Finally, watch the rollout status of the latest DaemonSet rolling update:
-->
### 监视滚动更新状态    {#watching-the-rolling-update-status}

最后，观察 DaemonSet 最新滚动更新的进度：

```shell
kubectl rollout status ds/fluentd-elasticsearch -n kube-system
```

<!--
When the rollout is complete, the output is similar to this:
-->
当滚动更新完成时，输出结果如下：

```shell
daemonset "fluentd-elasticsearch" successfully rolled out
```

<!--
## Troubleshooting

### DaemonSet rolling update is stuck
-->
## 故障排查    {#troubleshooting}

### DaemonSet 滚动更新卡住    {#daemonset-rolling-update-is-stuck}

<!--
Sometimes, a DaemonSet rolling update may be stuck. Here are some possible
causes:

#### Some nodes run out of resources
-->
有时，DaemonSet 滚动更新可能卡住，以下是一些可能的原因：

#### 一些节点可用资源耗尽    {#some-nodes-run-out-of-resources}

<!--
The rollout is stuck because new DaemonSet pods can't be scheduled on at least one
node. This is possible when the node is
[running out of resources](/docs/concepts/scheduling-eviction/node-pressure-eviction/).

When this happens, find the nodes that don't have the DaemonSet pods scheduled on
by comparing the output of `kubectl get nodes` and the output of:
-->
DaemonSet 滚动更新可能会卡住，其 Pod 至少在某个节点上无法调度运行。
当节点上[可用资源耗尽](/zh-cn/docs/concepts/scheduling-eviction/node-pressure-eviction/)时，
这是可能的。

发生这种情况时，通过对 `kubectl get nodes` 和下面命令行的输出作比较，
找出没有调度 DaemonSet Pod 的节点：

```shell
kubectl get pods -l name=fluentd-elasticsearch -o wide -n kube-system
```

<!--
Once you've found those nodes, delete some non-DaemonSet pods from the node to
make room for new DaemonSet pods.
-->
一旦找到这些节点，从节点上删除一些非 DaemonSet Pod，为新的 DaemonSet Pod 腾出空间。

<!--
This will cause service disruption when deleted pods are not controlled by any controllers or pods are not
replicated. This does not respect [PodDisruptionBudget](/docs/tasks/run-application/configure-pdb/)
either.
-->
{{< note >}}
当所删除的 Pod 不受任何控制器管理，也不是多副本的 Pod 时，上述操作将导致服务中断。
同时，上述操作也不会考虑
[PodDisruptionBudget](/zh-cn/docs/tasks/run-application/configure-pdb/)
所施加的约束。
{{< /note >}}

<!--
#### Broken rollout

If the recent DaemonSet template update is broken, for example, the container is
crash looping, or the container image doesn't exist (often due to a typo),
DaemonSet rollout won't progress.
-->
#### 不完整的滚动更新    {#broken-rollout}

如果最近的 DaemonSet 模板更新被破坏了，比如，容器处于崩溃循环状态或者容器镜像不存在
（通常由于拼写错误），就会发生 DaemonSet 滚动更新中断。

<!--
To fix this, update the DaemonSet template again. New rollout won't be
blocked by previous unhealthy rollouts.
-->
要解决此问题，需再次更新 DaemonSet 模板。新的滚动更新不会被以前的不健康的滚动更新阻止。

<!--
#### Clock skew

If `.spec.minReadySeconds` is specified in the DaemonSet, clock skew between
master and nodes will make DaemonSet unable to detect the right rollout
progress.
-->
#### 时钟偏差    {#clock-skew}

如果在 DaemonSet 中指定了 `.spec.minReadySeconds`，主控节点和工作节点之间的时钟偏差会使
DaemonSet 无法检测到正确的滚动更新进度。

<!--
## Clean up

Delete DaemonSet from a namespace:
-->
## 清理    {#clean-up}

从名字空间中删除 DaemonSet：

```shell
kubectl delete ds fluentd-elasticsearch -n kube-system
```

## {{% heading "whatsnext" %}}

<!--
* See [Performing a rollback on a DaemonSet](/docs/tasks/manage-daemon/rollback-daemon-set/)
* See [Creating a DaemonSet to adopt existing DaemonSet pods](/docs/concepts/workloads/controllers/daemonset/)
-->
* 查看[在 DaemonSet 上执行回滚](/zh-cn/docs/tasks/manage-daemon/rollback-daemon-set/)
* 查看[创建 DaemonSet 以收养现有 DaemonSet Pod](/zh-cn/docs/concepts/workloads/controllers/daemonset/)

