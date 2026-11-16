---
title: 更新 Deployment 而不中断服务
content_type: task
weight: 16
---
<!--
title: Update a Deployment Without Downtime
content_type: task
weight: 16
-->

<!-- overview -->

<!--
This page shows how to update a running Deployment to a new version using a
rolling update. A rolling update gradually replaces old Pods with new ones, so
your application remains available throughout the process.
-->
本文介绍如何使用滚动更新将运行中的 Deployment 更新到新版本。滚动更新会逐步用新 Pod 替换旧
Pod，因此你的应用在整个更新过程中保持可用。

## {{% heading "objectives" %}}

<!--
- Trigger a rolling update on a Deployment.
- Monitor rollout progress.
- Pause and resume the rollout.
- Configure rolling update strategy parameters.
- (If required) Roll back to a previous revision.
-->
- 触发 Deployment 的滚动更新。
- 监控上线进度。
- 暂停和恢复上线。
- 配置滚动更新策略参数。
- （如果需要）回滚到之前的版本。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!--
You need an existing Deployment. If you do not have one, create the nginx
Deployment from
[Run a Stateless Application Using a Deployment](/docs/tasks/run-application/run-stateless-application-deployment/):
-->
你需要一个已存在的 Deployment。如果你还没有，
可以按照[使用 Deployment 运行无状态应用](/zh-cn/docs/tasks/run-application/run-stateless-application-deployment/)中的说明创建一个
nginx Deployment：

```shell
kubectl apply -f https://k8s.io/examples/application/deployment.yaml
```

<!--
Verify the Deployment runs two Pods:
-->
验证该 Deployment 运行了两个 Pod：

```shell
kubectl get deployment nginx-deployment
```

<!--
The output is similar to:
-->
输出类似于这样：

```
NAME               READY   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment   2/2     2            2           10s
```

<!-- steps -->

<!--
## Performing a rolling update

Any change to the `.spec.template` field of a Deployment triggers a rolling
update. Kubernetes creates new Pods with the updated configuration and gradually
terminates old Pods.
-->
## 执行滚动更新   {#performing-a-rolling-update}

对 Deployment 的 `.spec.template` 字段的任何更改都会触发滚动更新。
Kubernetes 会使用更新后的配置创建新 Pod，并逐步终止旧 Pod。

<!--
### Updating with `kubectl apply`

You can trigger a rolling update by editing the Deployment manifest and applying the change. This approach works well when you keep manifests in version control.
-->
### 使用 `kubectl apply` 进行更新   {#updating-with-kubectl-apply}

你可以通过编辑 Deployment 清单文件并应用更改来触发滚动更新。
当你将清单文件保存在版本控制中时，这种方法效果很好。

<!--
Export the current Deployment to a local file:
-->
将当前 Deployment 导出到本地文件：

```shell
kubectl get deployment nginx-deployment -o yaml > /tmp/nginx-deployment.yaml
```

<!--
Edit `/tmp/nginx-deployment.yaml` and change `.spec.template.spec.containers[0].image`
from `nginx:1.14.2` to `nginx:1.16.1`.
-->
编辑 `/tmp/nginx-deployment.yaml`，将 `.spec.template.spec.containers[0].image`
从 `nginx:1.14.2` 改为 `nginx:1.16.1`。

<!--
Before applying, compare your local changes against the cluster state:
-->
在应用之前，将本地更改与集群状态进行比较：

```shell
kubectl diff -f /tmp/nginx-deployment.yaml
```

<!--
The output is similar to:
-->
输出类似于这样：

```diff
diff -u -N /tmp/LIVE/apps.v1.Deployment.default.nginx-deployment /tmp/MERGED/apps.v1.Deployment.default.nginx-deployment
--- /tmp/LIVE/apps.v1.Deployment...
+++ /tmp/MERGED/apps.v1.Deployment...
@@ -29,7 +29,7 @@
       containers:
-      - image: nginx:1.14.2
+      - image: nginx:1.16.1
         name: nginx
```

<!--
Apply the updated manifest:
-->
应用更新后的清单：

```shell
kubectl apply -f /tmp/nginx-deployment.yaml
```

<!--
### Updating only the container image

To update the container image without editing a manifest file, use
`kubectl set image`:
-->
### 仅更新容器镜像   {#updating-only-the-container-image}

要在不编辑清单文件的情况下更新容器镜像，请使用 `kubectl set image`：

```shell
kubectl set image deployment/nginx-deployment nginx=nginx:1.16.1
```

<!--
The output is similar to:
-->
输出类似于这样：

```
deployment.apps/nginx-deployment image updated
```

<!--
Verify the image was updated:
-->
验证镜像已更新：

```shell
kubectl get deployment nginx-deployment -o jsonpath='{.spec.template.spec.containers[0].image}'
```

<!--
The output is similar to:
-->
输出类似于这样：

```
nginx:1.16.1
```

<!--
## Monitoring rollout progress

Use `kubectl rollout status` to watch the progress of a rolling update:
-->
## 监控上线进度   {#monitoring-rollout-progress}

使用 `kubectl rollout status` 来观察滚动更新的进度：

```shell
kubectl rollout status deployment/nginx-deployment
```

<!--
The output is similar to:
-->
输出类似于这样：

```
Waiting for deployment "nginx-deployment" rollout to finish: 1 out of 2 new replicas have been updated...
Waiting for deployment "nginx-deployment" rollout to finish: 1 out of 2 new replicas have been updated...
Waiting for deployment "nginx-deployment" rollout to finish: 1 old replicas are pending termination...
deployment "nginx-deployment" successfully rolled out
```

<!--
After the rollout completes, verify the Deployment:
-->
上线完成后，验证该 Deployment：

```shell
kubectl get deployment nginx-deployment
```

<!--
The output is similar to:
-->
输出类似于这样：

```
NAME               READY   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment   2/2     2            2           2m
```

<!--
## Pausing and resuming a rollout

You can pause a rollout to inspect a partial update or to batch multiple changes
into a single rollout.
-->
## 暂停和恢复上线   {#pausing-and-resuming-a-rollout}

你可以暂停上线过程，以便检查部分更新或将多个更改合并到一次上线中。

<!--
### Pausing a rollout
-->
### 暂停上线   {#pausing-a-rollout}

```shell
kubectl rollout pause deployment/nginx-deployment
```

<!--
The output is similar to:
-->
输出类似于这样：

```
deployment.apps/nginx-deployment paused
```

<!--
### Making additional changes while paused

While the rollout is paused, you can make additional changes. These changes do
not trigger a new rollout until you resume:
-->
### 暂停期间进行其他更改   {#making-additional-changes-while-paused}

当上线暂停时，你可以进行其他更改。这些更改在你恢复上线之前不会触发新的上线：

```shell
kubectl set image deployment/nginx-deployment nginx=nginx:1.17.0
```

{{< note >}}
<!--
You can make multiple changes to a paused Deployment. Kubernetes applies all
changes together when you resume the rollout.
-->
你可以对暂停的 Deployment 进行多次更改。当你恢复上线时，Kubernetes 会将所有更改一起应用。
{{< /note >}}

<!--
### Resuming a rollout
-->
### 恢复上线   {#resuming-a-rollout}

```shell
kubectl rollout resume deployment/nginx-deployment
```

<!--
The output is similar to:
-->
输出类似于这样：

```
deployment.apps/nginx-deployment resumed
```

<!--
Verify the rollout completes:
-->
验证上线是否完成：

```shell
kubectl rollout status deployment/nginx-deployment
```

<!--
## Configuring rolling update strategy

Deployments support two
[update strategy types](/docs/concepts/workloads/controllers/deployment/#strategy):
-->
## 配置滚动更新策略   {#configuring-rolling-update-strategy}

Deployment 支持两种[更新策略类型](/zh-cn/docs/concepts/workloads/controllers/deployment/#strategy)：

<!--
- **RollingUpdate** (default): gradually replaces old Pods with new ones.
- **Recreate**: terminates all existing Pods before creating new ones. This
  causes downtime.
-->
- **RollingUpdate**（默认）：逐步用新 Pod 替换旧 Pod。
- **Recreate**：在创建新 Pod 之前终止所有现有 Pod。这会导致停机。

<!--
For the RollingUpdate strategy, these parameters control how Kubernetes performs the update:

| Parameter | Controls | Default | Example |
|-----------|----------|---------|---------|
| `maxUnavailable` | Maximum number of Pods that can be unavailable during the update | 25% | `1` or `25%` |
| `maxSurge` | Maximum number of extra Pods that can be created during the update | 25% | `1` or `25%` |
-->
对于 RollingUpdate 策略，以下参数控制 Kubernetes 执行更新的方式：

| 参数 | 控制内容 | 默认值 | 示例 |
|-----|---------|-------|-----|
| `maxUnavailable` | 更新期间不可用 Pod 的最大数量 | 25% | `1` 或 `25%` |
| `maxSurge` | 更新期间允许创建的额外 Pod 的最大数量 | 25% | `1` 或 `25%` |

{{< note >}}
<!--
`maxUnavailable` and `maxSurge` accept an absolute number or a percentage.
Kubernetes calculates percentages from the desired replica count, rounding down
for `maxUnavailable` and rounding up for `maxSurge`.
-->
`maxUnavailable` 和 `maxSurge` 接受绝对数值或百分比。Kubernetes 基于所需副本数计算百分比，
对 `maxUnavailable` 向下取整，对 `maxSurge` 向上取整。
{{< /note >}}

<!--
To configure these parameters, use `kubectl patch`:
-->
要配置这些参数，请使用 `kubectl patch`：

```shell
kubectl patch deployment nginx-deployment -p \
  '{"spec":{"strategy":{"rollingUpdate":{"maxUnavailable":"25%","maxSurge":"25%"}}}}'
```

<!--
You can also set these fields in a Deployment manifest under
`.spec.strategy.rollingUpdate`. For detailed examples, see
[max unavailable](/docs/concepts/workloads/controllers/deployment/#max-unavailable)
and [max surge](/docs/concepts/workloads/controllers/deployment/#max-surge)
in the Deployment concepts documentation.
-->
你也可以在 Deployment 清单的 `.spec.strategy.rollingUpdate` 下设置这些字段。有关详细示例，请参阅 Deployment
概念文档中的[最大不可用数量](/zh-cn/docs/concepts/workloads/controllers/deployment/#max-unavailable)和[最大峰值](/zh-cn/docs/concepts/workloads/controllers/deployment/#max-surge)。

<!--
### Detecting a stalled rollout

If a rollout does not make progress within the time specified by
`.spec.progressDeadlineSeconds` (default: 600 seconds), Kubernetes marks the Deployment condition `Progressing` as `False`. You can check for this condition by describing the Deployment:
-->
### 检测停滞的上线   {#detecting-a-stalled-rollout}

如果上线过程在 `.spec.progressDeadlineSeconds`（默认：600 秒）指定的时间内没有进展，Kubernetes 会将
Deployment 的 `Progressing` 状况标记为 `False`。你可以通过描述 Deployment 来检查此状况：

```shell
kubectl describe deployment nginx-deployment
```

<!--
Look for the `Progressing` condition in the `Conditions` section of the output. A stalled rollout usually indicates that new Pods are failing to start. The `Events` section of the output can help diagnose the issue.
-->
在输出的 `Conditions` 部分查找 `Progressing` 状况。停滞的上线通常表明新 Pod 启动失败。输出的
`Events` 部分可以帮助诊断问题。

<!--
## Rolling back to a previous revision {#rollback}

If a new version introduces issues, you can roll back to a previous revision.
-->
## 回滚到之前的版本   {#rollback}

如果新版本引入了问题，你可以回滚到之前的版本。

<!--
### Viewing rollout history
-->
### 查看上线历史   {#viewing-rollout-history}

```shell
kubectl rollout history deployment/nginx-deployment
```

<!--
The output is similar to:
-->
输出类似于这样：

```
deployment.apps/nginx-deployment
REVISION  CHANGE-CAUSE
1         <none>
2         <none>
```

{{< note >}}
<!--
The `CHANGE-CAUSE` column shows the value of the `kubernetes.io/change-cause`
annotation at the time of each revision. This annotation is **not** set automatically,
but if you are using an automated solution to manage Deployments, the tool you use
may write some text into that annotation.
-->
`CHANGE-CAUSE` 列显示每个版本对应时刻 `kubernetes.io/change-cause` 注解的值。
此注解**不会**被自动设置，但如果你使用自动化方案来管理 Deployment，你所使用的工具可能会将一些文本写入该注解。
{{< /note >}}

<!--
### Rolling back to the previous revision
-->
### 回滚到上一个版本   {#rolling-back-to-the-previous-revision}

```shell
kubectl rollout undo deployment/nginx-deployment
```

<!--
The output is similar to:
-->
输出类似于这样：

```
deployment.apps/nginx-deployment rolled back
```

<!--
### Rolling back to a specific revision
-->
### 回滚到特定版本   {#rolling-back-to-a-specific-revision}

```shell
kubectl rollout undo deployment/nginx-deployment --to-revision=1
```

<!--
Verify the rollback completes:
-->
验证回滚是否完成：

```shell
kubectl rollout status deployment/nginx-deployment
```

{{< note >}}
<!--
A Deployment's revision history is stored in the ReplicaSets it controls.
By default, Kubernetes retains 10 old ReplicaSets. You can change this limit
by setting `.spec.revisionHistoryLimit` in the Deployment manifest. Setting it to `0` disables rollback entirely.
-->
Deployment 的版本历史存储在其控制的 ReplicaSet 中。默认情况下，Kubernetes 会保留 10 个旧
ReplicaSet。你可以通过在 Deployment 清单中设置 `.spec.revisionHistoryLimit` 来更改此限制。
将其设置为 `0` 将完全禁用回滚。
{{< /note >}}

## {{% heading "cleanup" %}}

<!--
Delete the Deployment:
-->
删除该 Deployment：

```shell
kubectl delete deployment nginx-deployment
```

## {{% heading "whatsnext" %}}

<!--
- Learn more about [Deployments](/docs/concepts/workloads/controllers/deployment/).
- Learn how to [scale a Deployment manually](/docs/tasks/run-application/scale-deployment/).
- Walk through [Horizontal Pod Autoscaling](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/).
- See how to [perform a rolling update on a DaemonSet](/docs/tasks/manage-daemon/update-daemon-set/).
-->
- 进一步了解 [Deployment](/zh-cn/docs/concepts/workloads/controllers/deployment/)。
- 了解如何[手动扩缩 Deployment](/zh-cn/docs/tasks/run-application/scale-deployment/)。
- 学习[水平 Pod 自动扩缩](/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/)。
- 参阅如何[对 DaemonSet 执行滚动更新](/zh-cn/docs/tasks/manage-daemon/update-daemon-set/)。
