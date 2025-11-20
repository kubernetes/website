---
title: 對 DaemonSet 執行滾動更新
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
本文介紹瞭如何對 DaemonSet 執行滾動更新。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

<!--
## DaemonSet Update Strategy

DaemonSet has two update strategy types:
-->
## DaemonSet 更新策略    {#daemonset-update-strategy}

DaemonSet 有兩種更新策略：

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
* `OnDelete`：使用 `OnDelete` 更新策略時，在更新 DaemonSet 模板後，只有當你手動刪除老的
  DaemonSet Pod 之後，新的 DaemonSet Pod **纔會**被自動創建。跟 Kubernetes 1.6 以前的版本類似。
* `RollingUpdate`：這是預設的更新策略。使用 `RollingUpdate` 更新策略時，在更新 DaemonSet 模板後，
  老的 DaemonSet Pod 將被終止，並且將以受控方式自動創建新的 DaemonSet Pod。
  更新期間，最多只能有 DaemonSet 的一個 Pod 運行於每個節點上。

<!--
## Performing a Rolling Update

To enable the rolling update feature of a DaemonSet, you must set its
`.spec.updateStrategy.type` to `RollingUpdate`.
-->
## 執行滾動更新    {#performing-a-rolling-update}

要啓用 DaemonSet 的滾動更新功能，必須設置 `.spec.updateStrategy.type` 爲 `RollingUpdate`。

<!--
You may want to set
[`.spec.updateStrategy.rollingUpdate.maxUnavailable`](/docs/reference/kubernetes-api/workload-resources/daemon-set-v1/#DaemonSetSpec) 
(default to 1),
[`.spec.minReadySeconds`](/docs/reference/kubernetes-api/workload-resources/daemon-set-v1/#DaemonSetSpec)
(default to 0) and
[`.spec.updateStrategy.rollingUpdate.maxSurge`](/docs/reference/kubernetes-api/workload-resources/daemon-set-v1/#DaemonSetSpec)
(defaults to 0) as well.
-->
你可能想設置
[`.spec.updateStrategy.rollingUpdate.maxUnavailable`](/zh-cn/docs/reference/kubernetes-api/workload-resources/daemon-set-v1/#DaemonSetSpec)（預設爲 1）、
[`.spec.minReadySeconds`](/zh-cn/docs/reference/kubernetes-api/workload-resources/daemon-set-v1/#DaemonSetSpec)（預設爲 0）和
[`.spec.updateStrategy.rollingUpdate.maxSurge`](/zh-cn/docs/reference/kubernetes-api/workload-resources/daemon-set-v1/#DaemonSetSpec)
（預設爲 0）。

<!--
### Creating a DaemonSet with `RollingUpdate` update strategy

This YAML file specifies a DaemonSet with an update strategy as 'RollingUpdate'
-->
### 創建帶有 `RollingUpdate` 更新策略的 DaemonSet    {#creating-a-daemonset-with-rollingupdate-update-strategy}

下面的 YAML 包含一個 DaemonSet，其更新策略爲 'RollingUpdate'：

{{% code_sample file="controllers/fluentd-daemonset.yaml" %}}

<!--
After verifying the update strategy of the DaemonSet manifest, create the DaemonSet:
-->
檢查了 DaemonSet 清單中更新策略的設置之後，創建 DaemonSet：

```shell
kubectl create -f https://k8s.io/examples/controllers/fluentd-daemonset.yaml
```

<!--
Alternatively, use `kubectl apply` to create the same DaemonSet if you plan to
update the DaemonSet with `kubectl apply`.
-->
另一種方式是如果你希望使用 `kubectl apply` 來更新 DaemonSet 的話，
也可以使用 `kubectl apply` 來創建 DaemonSet：

```shell
kubectl apply -f https://k8s.io/examples/controllers/fluentd-daemonset.yaml
```

<!--
### Checking DaemonSet `RollingUpdate` update strategy

Check the update strategy of your DaemonSet, and make sure it's set to
`RollingUpdate`:
-->
### 檢查 DaemonSet 的滾動更新策略    {#checking-daemonset-rollingupdate-update-strategy}

首先，檢查 DaemonSet 的更新策略，確保已經將其設置爲 `RollingUpdate`：

```shell
kubectl get ds/fluentd-elasticsearch -o go-template='{{.spec.updateStrategy.type}}{{"\n"}}' -n kube-system
```

<!--
If you haven't created the DaemonSet in the system, check your DaemonSet
manifest with the following command instead:
-->
如果你還沒在系統中創建 DaemonSet，請使用以下命令檢查 DaemonSet 的清單：

```shell
kubectl apply -f https://k8s.io/examples/controllers/fluentd-daemonset.yaml --dry-run=client -o go-template='{{.spec.updateStrategy.type}}{{"\n"}}'
```

<!--
The output from both commands should be:
-->
兩個命令的輸出都應該爲：

```
RollingUpdate
```

<!--
If the output isn't `RollingUpdate`, go back and modify the DaemonSet object or
manifest accordingly.
-->
如果輸出不是 `RollingUpdate`，請返回並相應地修改 DaemonSet 對象或者清單。

<!--
### Updating a DaemonSet template

Any updates to a `RollingUpdate` DaemonSet `.spec.template` will trigger a rolling
update. Let's update the DaemonSet by applying a new YAML file. This can be done with several different `kubectl` commands.
-->
### 更新 DaemonSet 模板    {#updating-a-daemonset-template}

對 `RollingUpdate` DaemonSet 的 `.spec.template` 的任何更新都將觸發滾動更新。
這可以通過幾個不同的 `kubectl` 命令來完成。

{{% code_sample file="controllers/fluentd-daemonset-update.yaml" %}}

<!--
#### Declarative commands

If you update DaemonSets using
[configuration files](/docs/tasks/manage-kubernetes-objects/declarative-config/),
use `kubectl apply`:
-->
#### 聲明式命令    {#declarative-commands}

如果你使用[設定檔案](/zh-cn/docs/tasks/manage-kubernetes-objects/declarative-config/)來更新
DaemonSet，請使用 `kubectl apply`：

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

如果你使用[指令式命令](/zh-cn/docs/tasks/manage-kubernetes-objects/imperative-command/)來更新
DaemonSets，請使用 `kubectl edit`：

```shell
kubectl edit ds/fluentd-elasticsearch -n kube-system
```

<!--
##### Updating only the container image

If you only need to update the container image in the DaemonSet template, i.e.
`.spec.template.spec.containers[*].image`, use `kubectl set image`:
--->
##### 只更新容器映像檔    {#updating-only-the-container-image}

如果你只需要更新 DaemonSet 模板裏的容器映像檔，比如 `.spec.template.spec.containers[*].image`，
請使用 `kubectl set image`：

```shell
kubectl set image ds/fluentd-elasticsearch fluentd-elasticsearch=quay.io/fluentd_elasticsearch/fluentd:v2.6.0 -n kube-system
```

<!--
### Watching the rolling update status

Finally, watch the rollout status of the latest DaemonSet rolling update:
-->
### 監視滾動更新狀態    {#watching-the-rolling-update-status}

最後，觀察 DaemonSet 最新滾動更新的進度：

```shell
kubectl rollout status ds/fluentd-elasticsearch -n kube-system
```

<!--
When the rollout is complete, the output is similar to this:
-->
當滾動更新完成時，輸出結果如下：

```shell
daemonset "fluentd-elasticsearch" successfully rolled out
```

<!--
## Troubleshooting

### DaemonSet rolling update is stuck
-->
## 故障排查    {#troubleshooting}

### DaemonSet 滾動更新卡住    {#daemonset-rolling-update-is-stuck}

<!--
Sometimes, a DaemonSet rolling update may be stuck. Here are some possible
causes:

#### Some nodes run out of resources
-->
有時，DaemonSet 滾動更新可能卡住，以下是一些可能的原因：

#### 一些節點可用資源耗盡    {#some-nodes-run-out-of-resources}

<!--
The rollout is stuck because new DaemonSet pods can't be scheduled on at least one
node. This is possible when the node is
[running out of resources](/docs/concepts/scheduling-eviction/node-pressure-eviction/).

When this happens, find the nodes that don't have the DaemonSet pods scheduled on
by comparing the output of `kubectl get nodes` and the output of:
-->
DaemonSet 滾動更新可能會卡住，其 Pod 至少在某個節點上無法調度運行。
當節點上[可用資源耗盡](/zh-cn/docs/concepts/scheduling-eviction/node-pressure-eviction/)時，
這是可能的。

發生這種情況時，通過對 `kubectl get nodes` 和下面命令列的輸出作比較，
找出沒有調度 DaemonSet Pod 的節點：

```shell
kubectl get pods -l name=fluentd-elasticsearch -o wide -n kube-system
```

<!--
Once you've found those nodes, delete some non-DaemonSet pods from the node to
make room for new DaemonSet pods.
-->
一旦找到這些節點，從節點上刪除一些非 DaemonSet Pod，爲新的 DaemonSet Pod 騰出空間。

{{< note >}}
<!--
This will cause service disruption when deleted pods are not controlled by any controllers or pods are not
replicated. This does not respect [PodDisruptionBudget](/docs/tasks/run-application/configure-pdb/)
either.
-->
當所刪除的 Pod 不受任何控制器管理，也不是多副本的 Pod 時，上述操作將導致服務中斷。
同時，上述操作也不會考慮
[PodDisruptionBudget](/zh-cn/docs/tasks/run-application/configure-pdb/)
所施加的約束。
{{< /note >}}

<!--
#### Broken rollout

If the recent DaemonSet template update is broken, for example, the container is
crash looping, or the container image doesn't exist (often due to a typo),
DaemonSet rollout won't progress.
-->
#### 不完整的滾動更新    {#broken-rollout}

如果最近的 DaemonSet 模板更新被破壞了，比如，容器處於崩潰循環狀態或者容器映像檔不存在
（通常由於拼寫錯誤），就會發生 DaemonSet 滾動更新中斷。

<!--
To fix this, update the DaemonSet template again. New rollout won't be
blocked by previous unhealthy rollouts.
-->
要解決此問題，需再次更新 DaemonSet 模板。新的滾動更新不會被以前的不健康的滾動更新阻止。

<!--
#### Clock skew

If `.spec.minReadySeconds` is specified in the DaemonSet, clock skew between
master and nodes will make DaemonSet unable to detect the right rollout
progress.
-->
#### 時鐘偏差    {#clock-skew}

如果在 DaemonSet 中指定了 `.spec.minReadySeconds`，主控節點和工作節點之間的時鐘偏差會使
DaemonSet 無法檢測到正確的滾動更新進度。

<!--
## Clean up

Delete DaemonSet from a namespace:
-->
## 清理    {#clean-up}

從名字空間中刪除 DaemonSet：

```shell
kubectl delete ds fluentd-elasticsearch -n kube-system
```

## {{% heading "whatsnext" %}}

<!--
* See [Performing a rollback on a DaemonSet](/docs/tasks/manage-daemon/rollback-daemon-set/)
* See [Creating a DaemonSet to adopt existing DaemonSet pods](/docs/concepts/workloads/controllers/daemonset/)
-->
* 查看[在 DaemonSet 上執行回滾](/zh-cn/docs/tasks/manage-daemon/rollback-daemon-set/)
* 查看[創建 DaemonSet 以收養現有 DaemonSet Pod](/zh-cn/docs/concepts/workloads/controllers/daemonset/)
