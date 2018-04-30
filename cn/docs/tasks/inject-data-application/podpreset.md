---
approvers:
- jessfraz
title: 使用 PodPreset 将信息注入 Pods
---

在 pod 创建时，用户可以使用 `podpreset` 对象将 secrets、卷挂载和环境变量等信息注入其中。 
本文展示了一些 `PodPreset` 资源使用的示例。
用户可以从[理解 Pod Presets](/docs/concepts/workloads/pods/podpreset/) 中了解 PodPresets 的整体情况。

* TOC
{:toc}

## 创建 Pod Preset

### 简单的 Pod Spec 示例

这里是一个简单的示例，展示了如何通过 Pod Preset 修改 Pod spec 。

**用户提交的 pod spec：**

{% include code.html language="yaml" file="podpreset-pod.yaml" ghlink="/cn/docs/tasks/inject-data-application/podpreset-pod.yaml" %}

**Pod Preset 示例：**

{% include code.html language="yaml" file="podpreset-preset.yaml" ghlink="/cn/docs/tasks/inject-data-application/podpreset-preset.yaml" %}

**通过准入控制器后的 Pod spec：**

{% include code.html language="yaml" file="podpreset-merged.yaml" ghlink="/cn/docs/tasks/inject-data-application/podpreset-merged.yaml" %}

### 带有 `ConfigMap` 的 Pod Spec 示例

这里的示例展示了如何通过 Pod Preset 修改 Pod spec，Pod Preset 中定义了 `ConfigMap` 作为环境变量取值来源。

**用户提交的 pod spec：**

{% include code.html language="yaml" file="podpreset-pod.yaml" ghlink="/cn/docs/tasks/inject-data-application/podpreset-pod.yaml" %}

**用户提交的 `ConfigMap`：**

{% include code.html language="yaml" file="podpreset-configmap.yaml" ghlink="/cn/docs/tasks/inject-data-application/podpreset-configmap.yaml" %}

**Pod Preset 示例：**

{% include code.html language="yaml" file="podpreset-allow-db.yaml" ghlink="/cn/docs/tasks/inject-data-application/podpreset-allow-db.yaml" %}

**通过准入控制器后的 Pod spec：**

{% include code.html language="yaml" file="podpreset-allow-db-merged.yaml" ghlink="/cn/docs/tasks/inject-data-application/podpreset-allow-db-merged.yaml" %}

### 带有 Pod Spec 的 ReplicaSet 示例

以下示例展示了（通过 ReplicaSet 创建 pod 后）只有 pod spec 会被 Pod Preset 所修改。

**用户提交的 ReplicaSet：**

{% include code.html language="yaml" file="podpreset-replicaset.yaml" ghlink="/cn/docs/tasks/inject-data-application/podpreset-replicaset.yaml" %}

**Pod Preset 示例：**

{% include code.html language="yaml" file="podpreset-preset.yaml" ghlink="/cn/docs/tasks/inject-data-application/podpreset-preset.yaml" %}

**通过准入控制器后的 Pod spec：**

注意 ReplicaSet spec 没有改变，用户必须检查单独的 pod 来验证 PodPreset 已被应用。

{% include code.html language="yaml" file="podpreset-replicaset-merged.yaml" ghlink="/cn/docs/tasks/inject-data-application/podpreset-replicaset-merged.yaml" %}

### 多 PodPreset 示例

这里的示例展示了如何通过多个 Pod 注入策略修改 Pod spec。

**用户提交的 pod spec：**

{% include code.html language="yaml" file="podpreset-pod.yaml" ghlink="/cn/docs/tasks/inject-data-application/podpreset-pod.yaml" %}

**Pod Preset 示例：**

{% include code.html language="yaml" file="podpreset-preset.yaml" ghlink="/cn/docs/tasks/inject-data-application/podpreset-preset.yaml" %}

**另一个 Pod Preset 示例：**

{% include code.html language="yaml" file="podpreset-proxy.yaml" ghlink="/cn/docs/tasks/inject-data-application/podpreset-proxy.yaml" %}

**通过准入控制器后的 Pod spec：**

{% include code.html language="yaml" file="podpreset-multi-merged.yaml" ghlink="/cn/docs/tasks/inject-data-application/podpreset-multi-merged.yaml" %}

### 冲突示例

这里的示例展示了 Pod Preset 与原 Pod 存在冲突时，Pod spec 不会被修改。

**用户提交的 pod spec：**

{% include code.html language="yaml" file="podpreset-conflict-pod.yaml" ghlink="/cn/docs/tasks/inject-data-application/podpreset-conflict-pod.yaml" %}

**Pod Preset 示例：**

{% include code.html language="yaml" file="podpreset-conflict-preset.yaml" ghlink="/cn/docs/tasks/inject-data-application/podpreset-conflict-preset.yaml" %}

**因存在冲突，通过准入控制器后的 Pod spec 不会改变：**

{% include code.html language="yaml" file="podpreset-conflict-pod.yaml" ghlink="/cn/docs/tasks/inject-data-application/podpreset-conflict-pod.yaml" %}

**如果运行 `kubectl describe...` 用户会看到以下事件：**

```
$ kubectl describe ...
....
Events:
  FirstSeen             LastSeen            Count   From                    SubobjectPath               Reason      Message
  Tue, 07 Feb 2017 16:56:12 -0700   Tue, 07 Feb 2017 16:56:12 -0700 1   {podpreset.admission.kubernetes.io/podpreset-allow-database }    conflict  Conflict on pod preset. Duplicate mountPath /cache.
```

## 删除 Pod Preset

一旦用户不再需要 pod preset，可以使用 `kubectl` 进行删除：

```shell
$ kubectl delete podpreset allow-database
podpreset "allow-database" deleted
```

