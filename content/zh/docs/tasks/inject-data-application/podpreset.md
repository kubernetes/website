---
title: 使用 PodPreset 将信息注入 Pod
min-kubernetes-server-version: v1.6
content_type: task
weight: 60
---
<!--
reviewers:
- jessfraz
title: Inject Information into Pods Using a PodPreset
min-kubernetes-server-version: v1.6
content_type: task
weight: 60
-->

{{< feature-state for_k8s_version="v1.6" state="alpha" >}}

<!--
This page shows how to use PodPreset objects to inject information like {{< glossary_tooltip text="Secrets" term_id="secret" >}}, volume mounts, and {{< glossary_tooltip text="environment variables" term_id="container-env-variables" >}} into Pods at creation time.
-->
本页展示如何在创建 Pod 时 使用 PodPreset 对象将类似
{{< glossary_tooltip text="Secret" term_id="secret" >}}、卷挂载和
{{< glossary_tooltip text="环境变量" term_id="container-env-variables" >}} 
这类信息注入到 Pod 中。

## {{% heading "prerequisites" %}}

<!--
You need to have a Kubernetes cluster, and the kubectl command-line tool must be configured to communicate with your cluster. If you do not already have a cluster, you can create one using [Minikube](/docs/setup/learning-environment/minikube/).
Make sure that you have [enabled PodPreset](/docs/concepts/workloads/pods/podpreset/#enable-pod-preset) in your cluster.
-->
你需要一个运行的 Kubernetes 集群以及配置好与集群通信的 kubectl 命令行工具。
如果你还没有集群，可以使用 [Minikube](/zh/docs/setup/learning-environment/minikube/)
安装一个。
确保你已经在集群中[启用了 PodPreset](/docs/concepts/workloads/pods/podpreset/#enable-pod-preset)。

<!--
## Use Pod presets to inject environment variables and volumes

In this step, you create a preset that has a volume mount and one environment variable.
Here is the manifest for the PodPreset:
-->
## 使用 PodPreset 来注入环境变量和卷

在这一步中，你要创建一个 PodPreset 对象，其中包含卷挂载和一个环境变量。
下面是 PodPreset 的清单：

{{< codenew file="podpreset/preset.yaml" >}}

<!--
The name of a PodPreset object must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).
-->
PodPreset 对象的名称必须是一个合法的
[DNS 子域名](/zh/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。

<!--
In the manifest, you can see that the preset has an environment variable definition called `DB_PORT`
and a volume mount definition called `cache-volume` which is mounted under `/cache`. The {{< glossary_tooltip text="selector" term_id="selector" >}} specifies that
the preset will act upon any Pod that is labeled `role:frontend`.

Create the PodPreset:
-->
在清单中，你可以看到 PodPreset 有一个名为 `DB_PORT` 的环境变量定义，
和一个名为 `cache-volume` 的卷挂载定义，该卷挂载于 `/cache` 下。
{{< glossary_tooltip text="选择算符" term_id="selector" >}} 设定此 PodPreset
将应用于所有匹配 `role:frontend` 标签的 Pods。

创建 PodPreset：

```shell
kubectl apply -f https://k8s.io/examples/podpreset/preset.yaml
```

<!--
Verify that the PodPreset has been created:
-->
检查所创建的 PodPreset：

```shell
kubectl get podpreset
```
```
NAME             AGE
allow-database   1m
```

<!--
This manifest defines a Pod labelled `role: frontend` (matching the PodPreset's selector):
-->
下面的清单定义了一个带有标签 `role: frontend` 的 Pod（与 PodPreset
的选择算符匹配）：

{{< codenew file="podpreset/pod.yaml" >}}

<!--
Create the Pod:
-->
创建 Pod：

```shell
kubectl create -f https://k8s.io/examples/podpreset/pod.yaml
```

<!--
Verify that the Pod is running:
-->
验证 Pod 出于运行状态：

```shell
kubectl get pods
```

```
NAME      READY     STATUS    RESTARTS   AGE
website   1/1       Running   0          4m
```

<!--
View the Pod spec altered by the admission controller in order to see the effects of the preset
having been applied:
-->
查看被准入控制器更改过的 Pod 规约，以了解 PodPreset 在 Pod 上执行过的操作：

```shell
kubectl get pod website -o yaml
```

{{< codenew file="podpreset/merged.yaml" >}}

<!--
The `DB_PORT` environment variable, the `volumeMount` and the `podpreset.admission.kubernetes.io` annotation
of the Pod verify that the preset has been applied.
-->
Pod 的环境变量 `DB_PORT`，`volumeMount` 和 `podpreset.admission.kubernetes.io` 注解
表明 PodPreset 确实起了作用。

<!--
## Pod spec with ConfigMap example

This is an example to show how a Pod spec is modified by a Pod preset
that references a ConfigMap containing environment variables.
-->
### 带有 ConfigMap 的 Pod Spec 示例

这里的示例展示了如何通过 PodPreset 修改 Pod 规约，PodPreset 中定义了 `ConfigMap`
作为环境变量取值来源。

<!--
Here is the manifest containing the definition of the ConfigMap:
-->
包含 ConfigMap 定义的清单：

{{< codenew file="podpreset/configmap.yaml" >}}

<!--
Create the ConfigMap:
-->
创建 ConfigMap：

```shell
kubectl create -f https://k8s.io/examples/podpreset/configmap.yaml
```

<!--
Here is a PodPreset manifest referencing that ConfigMap:
-->
引用该 ConfigMap 的 PodPreset 的清单：

{{< codenew file="podpreset/allow-db.yaml" >}}

<!--
Create the preset that references the ConfigMap:
-->
创建 PodPreset：

```shell
kubectl create -f https://k8s.io/examples/podpreset/allow-db.yaml
```

<!--
The following manifest defines a Pod matching the PodPreset for this example:
-->
下面的清单包含与 PodPreset 匹配的 Pod：

{{< codenew file="podpreset/pod.yaml" >}}

<!--
Create the Pod:
-->
创建 Pod：

```shell
kubectl create -f https://k8s.io/examples/podpreset/pod.yaml
```

<!--
View the Pod spec altered by the admission controller in order to see the effects of the preset
having been applied:
-->
查看 Pod 规约被准入控制器修改后的结果，了解 PodPreset 应用之后的效果：

```shell
kubectl get pod website -o yaml
```

{{< codenew file="podpreset/allow-db-merged.yaml" >}}

<!--
The `DB_PORT` environment variable and the `podpreset.admission.kubernetes.io` annotation of the Pod
verify that the preset has been applied.
-->
Pod 的环境变量 `DB_PORT` 和 `podpreset.admission.kubernetes.io` 注解
表明 PodPreset 确实起了作用。
<!--
## ReplicaSet with Pod spec example

This is an example to show that only Pod specs are modified by Pod presets. Other workload types
like ReplicaSets or Deployments are unaffected.

Here is the manifest for the PodPreset for this example:
-->
### 带有 Pod Spec 的 ReplicaSet 示例

以下示例展示了（通过 ReplicaSet 创建 Pod 后）只有 Pod 规约会被 PodPreset 所修改,
其他资源类型（如 ReplicaSet、Deployment）不受影响。

下面是本例所用 PodPreset 的清单：

{{< codenew file="podpreset/preset.yaml" >}}

<!--
Create the preset:
-->
创建 Preset：

```shell
kubectl apply -f https://k8s.io/examples/podpreset/preset.yaml
```

<!--
This manifest defines a ReplicaSet that manages three application Pods:
-->
此清单定义了一个管理三个应用 Pod 的 ReplicaSet：

{{< codenew file="podpreset/replicaset.yaml" >}}

<!--
Create the ReplicaSet:
-->
创建 ReplicaSet：

```shell
kubectl create -f https://k8s.io/examples/podpreset/replicaset.yaml
```

<!--
Verify that the Pods created by the ReplicaSet are running:
-->
验证 ReplicaSet 所创建的 Pod 处于运行状态：

```shell
kubectl get pods
```

<!--
The output shows that the Pods are running:
-->
输出显示 Pod 正在运行：

```
NAME             READY   STATUS    RESTARTS   AGE
frontend-2l94q   1/1     Running   0          2m18s
frontend-6vdgn   1/1     Running   0          2m18s
frontend-jzt4p   1/1     Running   0          2m18s
```

<!--
View the `spec` of the ReplicaSet:
-->
查看 ReplicaSet 的 `spec` 内容：

```shell
kubectl get replicasets frontend -o yaml
```

<!--
The ReplicaSet object's `spec` was not changed, nor does the ReplicaSet contain a
`podpreset.admission.kubernetes.io` annotation. This is because a PodPreset only
applies to Pod objects.

To see the effects of the preset having been applied, you need to look at individual Pods.
-->
{{< note >}}
ReplicaSet 对象的 `spec` 未被改变，ReplicaSet 也没有被添加
`podpreset.admission.kubernetes.io` 注解。这是因为，PodPreset 只针对
Pod 对象起作用。

要查看 PodPreset 的应用效果，你需要逐个地查看 Pod。
{{< /note >}}

<!--
The command to view the specs of the affected Pods is:
-->
查看被影响的 Pod 的规约的命令是：

```shell
kubectl get pod --selector=role=frontend -o yaml
```

{{< codenew file="podpreset/replicaset-merged.yaml" >}}

<!--
Again the `podpreset.admission.kubernetes.io` annotation of the Pods
verifies that the preset has been applied.
-->
再一次，Pod 的 `podpreset.admission.kubernetes.io` 注解表明 PodPreset
已经被应用过。

<!--
## Multiple Pod presets example

This is an example to show how a Pod spec is modified by multiple Pod presets.

Here is the manifest for the first PodPreset:
-->
### 多 PodPreset 示例

这里的示例展示了如何通过多个 PodPreset 对象修改 Pod 规约。

第一个 PodPreset 的清单如下：

{{< codenew file="podpreset/preset.yaml" >}}

<!--
Create the first PodPreset for this example:
-->
为此例创建第一个 PodPreset：

```shell
kubectl apply -f https://k8s.io/examples/podpreset/preset.yaml
```

<!--
Here is the manifest for the second PodPreset:
-->
下面是第二个 PodPreset 的清单：

{{< codenew file="podpreset/proxy.yaml" >}}

<!--
Create the second preset:
-->
创建第二个 PodPreset：

```shell
kubectl apply -f https://k8s.io/examples/podpreset/proxy.yaml
```

<!--
Here's a manifest containing the definition of an applicable Pod (matched by two PodPresets):
-->
下面是包含可被修改的 Pod 定义的清单（此 Pod 同时被两个 PodPreset 匹配到）：

{{< codenew file="podpreset/pod.yaml" >}}

<!--
Create the Pod:
-->
创建 Pod：

```shell
kubectl create -f https://k8s.io/examples/podpreset/pod.yaml
```

<!--
View the Pod spec altered by the admission controller in order to see the effects of both presets
having been applied:
-->
查看被准入控制器更改后的 Pod 规约，以了解被两个 PodPreset 一同修改
后的效果：

```shell
kubectl get pod website -o yaml
```

{{< codenew file="podpreset/multi-merged.yaml" >}}

<!--
The `DB_PORT` environment variable, the `proxy-volume` VolumeMount and the two `podpreset.admission.kubernetes.io`
annotations of the Pod verify that both presets have been applied.
-->
Pod 定义中的 `DB_PORT` 环境变量、`proxy-volume` 卷挂载以及
两个 `podpreset.admission.kubernetes.io` 可以证明两个 Preset 都被应用了。

<!--
## Conflict example

This is an example to show how a Pod spec is not modified by a Pod preset when there is a conflict.
The conflict in this example consists of a `VolumeMount` in the PodPreset conflicting with a Pod that defines the same `mountPath`.

Here is the manifest for the PodPreset:
-->
### 冲突示例

这里的示例展示了 PodPreset 与原 Pod 存在冲突时，Pod 规约不会被修改。
本例中的冲突是指 PodPreset 中的 `volumeMount` 与 Pod 中定义的卷挂载在
`mountPath` 上有冲突。

下面是 PodPreset 的清单：

{{< codenew file="podpreset/conflict-preset.yaml" >}}

<!--
Note the `mountPath` value of `/cache`.

Create the preset:
-->
注意 `mountPath` 的取值是 `/cache`。
创建 PodPreset：

```shell
kubectl apply -f https://k8s.io/examples/podpreset/conflict-preset.yaml
```

<!--
Here is the manifest for the Pod:
-->
下面是 Pod 的清单：

{{< codenew file="podpreset/conflict-pod.yaml" >}}

<!--
Note the volumeMount element with the same path as in the PodPreset.

Create the Pod:
-->
注意清单中 `volumeMount` 元素的取值与 PodPreset 中的路径值相同。

创建 Pod：

```shell
kubectl create -f https://k8s.io/examples/podpreset/conflict-pod.yaml
```

<!--
View the Pod spec:
-->
查看 Pod 规约：

```shell
kubectl get pod website -o yaml
```

{{< codenew file="podpreset/conflict-pod.yaml" >}}

<!--
You can see there is no preset annotation (`podpreset.admission.kubernetes.io`). Seeing no annotation tells you that no preset has not been applied to the Pod.

However, the
[PodPreset admission controller](/docs/reference/access-authn-authz/admission-controllers/#podpreset)
logs a warning containing details of the conflict.
You can view the warning using `kubectl`:
-->
这里你可以看到 Pod 上并没有 PodPreset 的注解 podpreset.admission.kubernetes.io`。
这意味着没有 PodPreset 被应用到 Pod 之上。

不过 [PodPreset 准入控制器](/zh/docs/reference/access-authn-authz/admission-controllers/#podpreset)
还是为所发生的冲突留下了一条警告性质的日志。
你可以通过 `kubectl` 来查看此警告信息：

```shell
kubectl -n kube-system logs -l=component=kube-apiserver
```

<!--
The output should look similar to:
-->
输出类似于：

```
W1214 13:00:12.987884       1 admission.go:147] conflict occurred while applying podpresets: allow-database on pod:  err: merging volume mounts for allow-database has a conflict on mount path /cache:
v1.VolumeMount{Name:"other-volume", ReadOnly:false, MountPath:"/cache", SubPath:"", MountPropagation:(*v1.MountPropagationMode)(nil), SubPathExpr:""}
does not match
core.VolumeMount{Name:"cache-volume", ReadOnly:false, MountPath:"/cache", SubPath:"", MountPropagation:(*core.MountPropagationMode)(nil), SubPathExpr:""}
 in container
```

注意这里关于卷挂载路径冲突的消息。

<!--
## Deleting a PodPreset

Once you don't need a PodPreset anymore, you can delete it with `kubectl`:
-->
## 删除 Pod Preset

一旦用户不再需要 PodPreset，可以使用 `kubectl` 将其删除：

```shell
kubectl delete podpreset allow-database
```

<!--
The output shows that the PodPreset was deleted:
-->
输出显示 PodPreset 已经被删除：

```
podpreset "allow-database" deleted
```

