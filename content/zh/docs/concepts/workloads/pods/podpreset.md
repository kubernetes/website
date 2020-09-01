---
title: Pod Preset
content_type: concept
weight: 50
---

<!--
title: Pod Preset
content_type: concept
weight: 50
-->

<!--
This page provides an overview of PodPresets, which are objects for injecting
certain information into pods at creation time. The information can include
secrets, volumes, volume mounts, and environment variables.
-->
<!-- overview -->

{{< feature-state for_k8s_version="v1.6" state="alpha" >}}

本文提供了 PodPreset 的概述。 在 Pod 创建时，用户可以使用 PodPreset 对象将特定信息注入 Pod 中，这些信息可以包括 Secret、卷、卷挂载和环境变量。

<!-- body -->

<!--
## Understanding Pod Presets
-->
## 理解 Pod Preset

<!--
A `Pod Preset` is an API resource for injecting additional runtime requirements
into a Pod at creation time.
You use [label selectors](/docs/concepts/overview/working-with-objects/labels/#label-selectors)
to specify the Pods to which a given Pod Preset applies.
-->
`Pod Preset` 是一种 API 资源，在 Pod 创建时，用户可以用它将额外的运行时需求信息注入 Pod。
使用[标签选择算符](/zh/docs/concepts/overview/working-with-objects/labels/#label-selectors)
来指定 Pod Preset 所适用的 Pod。

<!--
Using a Pod Preset allows pod template authors to not have to explicitly provide
all information for every pod. This way, authors of pod templates consuming a
specific service do not need to know all the details about that service.
-->

使用 Pod Preset 使得 Pod 模板编写者不必显式地为每个 Pod 设置信息。
这样，使用特定服务的 Pod 模板编写者不需要了解该服务的所有细节。

<!--
## Enable PodPreset in your cluster {#enable-pod-preset}

In order to use Pod Presets in your cluster you must ensure the following:
-->
## 在你的集群中启用 Pod Preset   {#enable-pod-preset}

为了在集群中使用 Pod Preset，必须确保以下几点：

<!--
1.  You have enabled the API type `settings.k8s.io/v1alpha1/podpreset`. For
    example, this can be done by including `settings.k8s.io/v1alpha1=true` in
    the `--runtime-config` option for the API server. In minikube add this flag
    `--extra-config=apiserver.runtime-config=settings.k8s.io/v1alpha1=true` while
    starting the cluster.
1.  You have enabled the admission controller `PodPreset`. One way to doing this
    is to include `PodPreset` in the `--enable-admission-plugins` option value specified
    for the API server. In minikube add this flag
    
    ```shell
    --extra-config=apiserver.enable-admission-plugins=NamespaceLifecycle,LimitRanger,ServiceAccount,DefaultStorageClass,DefaultTolerationSeconds,NodeRestriction,MutatingAdmissionWebhook,ValidatingAdmissionWebhook,ResourceQuota,PodPreset
    ```
    
    while starting the cluster.
-->
1.  已启用 API 类型 `settings.k8s.io/v1alpha1/podpreset`。 例如，这可以通过在 API 服务器的 `--runtime-config`
    配置项中包含 `settings.k8s.io/v1alpha1=true` 来实现。
    在 minikube 部署的集群中，启动集群时添加此参数 `--extra-config=apiserver.runtime-config=settings.k8s.io/v1alpha1=true`。
1.  已启用准入控制器 `PodPreset`。 启用的一种方式是在 API 服务器的 `--enable-admission-plugins`
    配置项中包含 `PodPreset` 。在 minikube 部署的集群中，启动集群时添加以下参数：

    ```shell
    --extra-config=apiserver.enable-admission-plugins=NamespaceLifecycle,LimitRanger,ServiceAccount,DefaultStorageClass,DefaultTolerationSeconds,NodeRestriction,MutatingAdmissionWebhook,ValidatingAdmissionWebhook,ResourceQuota,PodPreset
    ```

<!--
## How It Works

Kubernetes provides an admission controller (`PodPreset`) which, when enabled,
applies Pod Presets to incoming pod creation requests.
When a pod creation request occurs, the system does the following:
-->
## PodPreset 如何工作

Kubernetes 提供了准入控制器 (`PodPreset`)，该控制器被启用时，会将 Pod Preset 
应用于接收到的 Pod 创建请求中。
当出现 Pod 创建请求时，系统会执行以下操作：

<!--
1. Retrieve all `PodPresets` available for use.
1. Check if the label selectors of any `PodPreset` matches the labels on the
   pod being created.
1. Attempt to merge the various resources defined by the `PodPreset` into the
   Pod being created.
1. On error, throw an event documenting the merge error on the pod, and create
   the pod _without_ any injected resources from the `PodPreset`.
1. Annotate the resulting modified Pod spec to indicate that it has been
   modified by a `PodPreset`. The annotation is of the form
   `podpreset.admission.kubernetes.io/podpreset-<pod-preset name>: "<resource version>"`.
-->

1. 检索所有可用 `PodPresets` 。
1. 检查 `PodPreset` 的标签选择器与要创建的 Pod 的标签是否匹配。
1. 尝试合并 `PodPreset` 中定义的各种资源，并注入要创建的 Pod。
1. 发生错误时抛出事件，该事件记录了 pod 信息合并错误，同时在 _不注入_ `PodPreset` 信息的情况下创建 Pod。
1. 为改动的 Pod spec 添加注解，来表明它被 `PodPreset` 所修改。 注解形如：
   `podpreset.admission.kubernetes.io/podpreset-<pod-preset 名称>": "<资源版本>"`。

<!--
Each Pod can be matched by zero or more Pod Presets; and each `PodPreset` can be
applied to zero or more pods. When a `PodPreset` is applied to one or more
Pods, Kubernetes modifies the Pod Spec. For changes to `Env`, `EnvFrom`, and
`VolumeMounts`, Kubernetes modifies the container spec for all containers in
the Pod; for changes to `Volume`, Kubernetes modifies the Pod Spec.
-->

一个 Pod 可能不与任何 Pod Preset 匹配，也可能匹配多个 Pod Preset。 同时，一个 `PodPreset` 
可能不应用于任何 Pod，也可能应用于多个 Pod。 当 `PodPreset` 应用于一个或多个 Pod 时，Kubernetes
修改 pod spec。 对于 `Env`、 `EnvFrom` 和 `VolumeMounts` 的改动， Kubernetes 修改 pod
中所有容器 spec，对于卷的改动，Kubernetes 会修改 Pod spec。

<!--
A Pod Preset is capable of modifying the following fields in a Pod spec when appropriate:
- The `.spec.containers` field.
- The `initContainers` field
-->
{{< note >}}
适当时候，Pod Preset 可以修改 Pod 规范中的以下字段：
- `.spec.containers` 字段
- `initContainers` 字段
{{< /note >}}

<!--
### Disable Pod Preset for a Specific Pod

There may be instances where you wish for a Pod to not be altered by any Pod
Preset mutations. In these cases, you can add an annotation in the Pod Spec
of the form: `podpreset.admission.kubernetes.io/exclude: "true"`.
-->
### 为特定 Pod 禁用 Pod Preset

在一些情况下，用户不希望 Pod 被 Pod Preset 所改动，这时，用户可以在 Pod
的 `.spec` 中添加形如 `podpreset.admission.kubernetes.io/exclude: "true"` 的注解。

## {{% heading "whatsnext" %}}

<!--
* [Injecting data into a Pod using PodPreset](/docs/tasks/inject-data-application/podpreset/)
* For more information about the background, see the [design proposal for PodPreset](https://git.k8s.io/community/contributors/design-proposals/service-catalog/pod-preset.md).
-->
* 参考[使用 PodPreset 将信息注入 Pod](/zh/docs/tasks/inject-data-application/podpreset/)。
* 若要更多地了解背景知识，请参阅 [PodPreset 的设计提案](https://git.k8s.io/community/contributors/design-proposals/service-catalog/pod-preset.md)。

