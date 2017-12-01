---
approvers:
- jessfraz
title: Pod Preset
---

{% capture overview %}
本文提供了 PodPreset 的概述。 在 pod 创建时，用户可以使用 `podpreset` 对象将特定信息注入
pod 中，这些信息可以包括 secret、 卷、卷挂载和环境变量。
{% endcapture %}

{:toc}

{% capture body %}
## 理解 Pod Preset

`Pod Preset` 是一种 API 资源，在 pod 创建时，用户可以用它将额外的运行时需求信息注入 pod。
使用[标签选择器（label selector）](/docs/concepts/overview/working-with-objects/labels/#label-selectors)来指定 Pod Preset 所适用的 pod。

使用 Pod Preset 使得 pod 模板编写者不必显式地为每个 pod 设置信息。
这样，使用特定服务的 pod 模板编写者不需要了解该服务的所有细节。

了解更多的相关背景信息，请参考 [ PodPreset 设计提案](https://git.k8s.io/community/contributors/design-proposals/service-catalog/pod-preset.md)。

## PodPreset 如何工作

Kubernetes 提供了准入控制器 (`PodPreset`)，该控制器被启用时，会将 Pod Preset 
应用于接收到的 pod 创建请求中。
当出现 pod 创建请求时，系统会执行以下操作：

1. 检索所有可用 `PodPresets` 。
1. 检查 `PodPreset` 的标签选择器与要创建的 pod 的标签是否匹配。
1. 尝试合并 `PodPreset` 中定义的各种资源，并注入要创建的 pod。
1. 发生错误时抛出事件，该事件记录了 pod 信息合并错误，同时在 _不注入_ `PodPreset` 信息的情况下创建 pod。
1. 为改动的 pod spec 添加注解，来表明它被 `PodPreset` 所修改。 注解形如：
`podpreset.admission.kubernetes.io/podpreset-<pod-preset name>": "<resource version>"`。

一个 Pod 可能不与任何 Pod Preset 匹配，也可能匹配多个 Pod Preset。 同时，一个 `PodPreset` 
可能不应用于任何 Pod，也可能应用于多个 Pod。 当 `PodPreset` 应用于一个或多个 Pod 时，Kubernetes
修改 pod spec。 对于 `Env`、 `EnvFrom` 和 `VolumeMounts` 的改动， Kubernetes 修改 pod 
中所有容器的规格，对于卷的改动，Kubernetes 修改 Pod spec。

**注意：** Pod Preset 能够在适当的时候修改 Pod spec 的 `spec.containers` 字段，
但是不会应用于 `initContainers` 字段。
{: .note}

### 为特定 Pod 禁用 Pod Preset

在一些情况下，用户不希望 pod 被 pod preset 所改动，这时，用户可以在 pod spec 中添加形如
 `podpreset.admission.kubernetes.io/exclude: "true"` 的注解。

## 启用 Pod Preset

为了在集群中使用 Pod Preset，必须确保以下几点：

1.  已启用 api 类型 `settings.k8s.io/v1alpha1/podpreset`。 这可以通过在 API 服务器的
    `--runtime-config` 配置项中包含 `settings.k8s.io/v1alpha1=true` 来实现。
1.  已启用准入控制器 `PodPreset`。 启用的一种方式是在 API 服务器的 `--admission-control`
    配置项中包含 `PodPreset` 。
1.  已经通过在相应的名字空间中创建 `PodPreset` 对象，定义了 Pod preset。

{% endcapture %}

{% capture whatsnext %}

* [使用 PodPreset 将信息注入 Pods](/docs/tasks/inject-data-application/podpreset/)

{% endcapture %}

{% include templates/concept.md %}
