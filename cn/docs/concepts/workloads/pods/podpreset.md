---
approvers:
- jessfraz
title: Pod Preset
---

{% capture overview %}

<!--

This page provides an overview of PodPresets, which are objects for injecting certain information into pods at creation time. The information can include secrets, volumes, volume mounts, and environment variables.

-->

本页是关于 PodPreset 的概述，该对象用来在 Pod 创建的时候向 Pod 中注入某些特定信息。该信息可以包括 secret、volume、volume mount 和环境变量。

{% endcapture %}

{:toc}

{% capture body %}

<!--

## Understanding Pod Presets

A `Pod Preset` is an API resource for injecting additional runtime requirements into a Pod at creation time.
You use [label selectors](/docs/concepts/overview/working-with-objects/labels/#label-selectors) to specify the Pods to which a given Pod Preset applies.

Using a Pod Preset allows pod template authors to not have to explicitly provide  all information for every pod. This way, authors of pod templates consuming a specific service do not need to know all the details about that service.

For more information about the background, see the [design proposal for PodPreset](https://git.k8s.io/community/contributors/design-proposals/service-catalog/pod-preset.md).

-->

## 理解 Pod Preset

`Pod Preset` 是用来在 Pod 被创建的时候向其中注入额外的运行时需求的 API 资源。

您可以使用 [label selector](/docs/concepts/overview/working-with-objects/labels/#label-selectors) 来指定为哪些 Pod 应用 Pod Preset。

使用 Pod Preset 使得 pod 模板的作者可以不必为每个 Pod 明确提供所有信息。这样一来，pod 模板的作者就不需要知道关于该服务的所有细节。

关于该背景的更多信息，请参阅 [PodPreset 的设计方案](https://git.k8s.io/community/contributors/design-proposals/service-catalog/pod-preset.md)。

<!--

## How It Works

Kubernetes provides an admission controller (`PodPreset`) which, when enabled, applies Pod Presets to incoming pod creation requests. When a pod creation request occurs, the system does the following:

-->

## 如何工作

Kubernetes 提供了一个准入控制器（`PodPreset`），当其启用时，控制器会将 Pod Preset 应用到 Pod 的创建请求中。当有 Pod 创建请求发生时，系统将执行以下操作：

<!--

1. Retrieve all `PodPresets` available for use.
2. Check if the label selectors of any `PodPreset` matches the labels on the pod being created.
3. Attempt to merge the various resources defined by the `PodPreset` into the Pod being created.
4. On error, throw an event documenting the merge error on the pod, and create the pod _without_ any injected resources from the `PodPreset`.
5. Annotate the resulting modified Pod spec to indicate that it has been modified by a `PodPreset`. The annotation is of the form `podpreset.admission.kubernetes.io/podpreset-<pod-preset name>": "<resource version>"`.

-->

1. 检索所有可用的 `PodPresets`。
2. 检查 PodPreset 标签选择器上的标签，看看其是否能够匹配正在创建的 Pod 上的标签。
3. 尝试将由 `PodPreset` 定义的各种资源合并到正在创建的 Pod 中。
4. 出现错误时，在该 Pod 上引发记录合并错误的事件，PodPreset *不会*注入任何资源到创建的 Pod 中。
5. 注释刚生成的修改过的 Pod spec，以表明它已被 PodPreset 修改过。注释的格式为 `podpreset.admission.kubernetes.io/podpreset-<pod-preset name>": "<resource version>"`。

<!--

Each Pod can be matched zero or more Pod Presets; and each `PodPreset` can be applied to zero or more pods. When a `PodPreset` is applied to one or more Pods, Kubernetes modifies the Pod Spec. For changes to `Env`, `EnvFrom`, and `VolumeMounts`, Kubernetes modifies the container spec for all containers in the Pod; for changes to `Volume`, Kubernetes modifies the Pod Spec.

**Note:** A Pod Preset is capable of modifying the `spec.containers` field in a Pod spec when appropriate. *No* resource definition from the Pod Preset will be  applied to the `initContainers` field.
{: .note}

-->

每个 Pod 可以匹配零个或多个 Pod Prestet；并且每个 `PodPreset` 可以应用于零个或多个 Pod。 `PodPreset` 应用于一个或多个 Pod 时，Kubernetes 会修改 Pod Spec。对于 `Env`、`EnvFrom` 和 `VolumeMounts` 的更改，Kubernetes 修改 Pod 中所有容器的容器 spec；对于 `Volume` 的更改，Kubernetes 修改 Pod Spec。

**注意：**Pod Preset 可以在适当的时候修改 Pod spec 中的 `spec.containers` 字段。Pod Preset 中的资源定义将*不会*应用于 `initContainers` 字段。

{: .note}

<!--

### Disable Pod Preset for a Specific Pod

There may be instances where you wish for a Pod to not be altered by any Pod Preset mutations. In these cases, you can add an annotation in the Pod Spec of the form: `podpreset.admission.kubernetes.io/exclude: "true"`.

-->

### 禁用特定 Pod 的 Pod Preset

在某些情况下，您可能不希望 Pod 被任何 Pod Preset 所改变。这时，您可以在 Pod 的 Pod Spec 中添加注释：`podpreset.admission.kubernetes.io/exclude："true"`。

<!--

## Enable Pod Preset

In order to use Pod Presets in your cluster you must ensure the following:

1.  You have enabled the API type `settings.k8s.io/v1alpha1/podpreset`. For example, this can be done by including `settings.k8s.io/v1alpha1=true` in the `--runtime-config` option for the API server. 
2.  You have enabled the admission controller `PodPreset`. One way to doing this is to include `PodPreset` in the `--admission-control` option value specified for the API server.
3.  You have defined your Pod Presets by creating `PodPreset` objects in the namespace you will use.

-->

## 启用 Pod Preset

为了在群集中使用 Pod Preset，您必须确保以下内容：

1. 您已启用 `settings.k8s.io/v1alpha1/podpreset` API 类型。例如，可以通过在 API server 的 `--runtime-config` 选项中包含 `settings.k8s.io/v1alpha1=true` 来完成此操作。
2. 您已启用 `PodPreset` 准入控制器。 一种方法是将 `PodPreset` 包含在为 API server 指定的 `--admission-control` 选项值中。
3. 您已经在要使用的命名空间中通过创建 `PodPreset` 对象来定义 `PodPreset`。

{% endcapture %}

{% capture whatsnext %}

<!--

* [Injecting data into a Pod using PodPreset](/docs/tasks/inject-data-application/podpreset/)

-->

- [使用 PodPreset 向 Pod 中注入数据](/docs/tasks/inject-data-application/podpreset/)

{% endcapture %}

{% include templates/concept.md %}
