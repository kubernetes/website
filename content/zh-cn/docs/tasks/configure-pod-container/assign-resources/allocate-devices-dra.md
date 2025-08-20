---
title: 使用 DRA 为工作负载分配设备
content_type: task
min-kubernetes-server-version: v1.32
weight: 20
---
<!--
title: Allocate Devices to Workloads with DRA
content_type: task
min-kubernetes-server-version: v1.32
weight: 20
-->

{{< feature-state feature_gate_name="DynamicResourceAllocation" >}}

<!-- overview -->

<!--
This page shows you how to allocate devices to your Pods by using
_dynamic resource allocation (DRA)_. These instructions are for workload
operators. Before reading this page, familiarize yourself with how DRA works and
with DRA terminology like
{{< glossary_tooltip text="ResourceClaims" term_id="resourceclaim" >}} and
{{< glossary_tooltip text="ResourceClaimTemplates" term_id="resourceclaimtemplate" >}}.
For more information, see
[Dynamic Resource Allocation (DRA)](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/).
-->
本文介绍如何使用**动态资源分配（DRA）**为 Pod 分配设备。
这些指示说明面向工作负载运维人员。在阅读本文之前，请先了解 DRA 的工作原理以及相关术语，例如
{{< glossary_tooltip text="ResourceClaims" term_id="resourceclaim" >}} 和
{{< glossary_tooltip text="ResourceClaimTemplates" term_id="resourceclaimtemplate" >}}。
更多信息参阅[动态资源分配（DRA）](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)。

<!-- body -->

<!--
## About device allocation with DRA {#about-device-allocation-dra}

As a workload operator, you can _claim_ devices for your workloads by creating
ResourceClaims or ResourceClaimTemplates. When you deploy your workload,
Kubernetes and the device drivers find available devices, allocate them to your
Pods, and place the Pods on nodes that can access those devices.
-->
## 关于使用 DRA 分配设备 {#about-device-allocation-dra}

作为工作负载运维人员，你可以通过创建 ResourceClaim 或 ResourceClaimTemplate
来**申领**工作负载所需的设备。当你部署工作负载时，Kubernetes 和设备驱动会找到可用的设备，
将其分配给 Pod，并将 Pod 调度到可访问这些设备的节点上。

<!-- prerequisites -->

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
* Ensure that your cluster admin has set up DRA, attached devices, and installed
  drivers. For more information, see
  [Set Up DRA in a Cluster](/docs/tasks/configure-pod-container/assign-resources/set-up-dra-cluster).
-->
* 请确保集群管理员已设置好 DRA，挂接了设备并安装了驱动程序。
  详情请参见[在集群中设置 DRA](/zh-cn/docs/tasks/configure-pod-container/assign-resources/set-up-dra-cluster)。

<!-- steps -->

<!--
## Identify devices to claim {#identify-devices}

Your cluster administrator or the device drivers create
_{{< glossary_tooltip term_id="deviceclass" text="DeviceClasses" >}}_ that
define categories of devices. You can claim devices by using
{{< glossary_tooltip term_id="cel" >}} to filter for specific device properties.

Get a list of DeviceClasses in the cluster:、
-->
## 寻找可申领的设备  {#identify-devices}

你的集群管理员或设备驱动程序会创建定义设备类别的
{{< glossary_tooltip term_id="deviceclass" text="DeviceClass" >}}。你可以使用
{{< glossary_tooltip term_id="cel" >}} 表达式筛选特定的设备属性，从而申领设备。

获取集群中的 DeviceClass 列表：

```shell
kubectl get deviceclasses
```

<!--
The output is similar to the following:
-->
输出类似如下：

```
NAME                 AGE
driver.example.com   16m
```

<!--
If you get a permission error, you might not have access to get DeviceClasses.
Check with your cluster administrator or with the driver provider for available
device properties.
-->
如果你遇到权限错误，你可能无权获取 DeviceClass。
请与你的集群管理员或驱动提供商联系，了解可用的设备属性。

<!--
## Claim resources {#claim-resources}

You can request resources from a DeviceClass by using 
{{< glossary_tooltip text="ResourceClaims" term_id="resourceclaim" >}}. To
create a ResourceClaim, do one of the following:
-->
## 申领资源 {#claim-resources}

你可以通过
{{< glossary_tooltip text="ResourceClaims" term_id="resourceclaim" >}}
请求某个 DeviceClass 的资源。要创建 ResourceClaim，可以采用以下方式之一：

<!--
* Manually create a ResourceClaim if you want multiple Pods to share access to
  the same devices, or if you want a claim to exist beyond the lifetime of a
  Pod.
* Use a
  {{< glossary_tooltip text="ResourceClaimTemplate" term_id="resourceclaimtemplate" >}}
  to let Kubernetes generate and manage per-Pod ResourceClaims. Create a
  ResourceClaimTemplate if you want every Pod to have access to separate devices
  that have similar configurations. For example, you might want simultaneous
  access to devices for Pods in a Job that uses
  [parallel execution](/docs/concepts/workloads/controllers/job/#parallel-jobs).
-->
* 手动创建 ResourceClaim，如果你希望多个 Pod 共享相同设备，或希望申领在 Pod 生命期结束后仍然存在。
* 使用
  {{< glossary_tooltip text="ResourceClaimTemplate" term_id="resourceclaimtemplate" >}}，
  让 Kubernetes 为每个 Pod 生成并管理 ResourceClaim。如果你希望每个 Pod
  访问独立的、具有类似配置的设备，你可以创建 ResourceClaimTemplate。例如，
  在使用[并行执行](/zh-cn/docs/concepts/workloads/controllers/job/#parallel-jobs)的
  Job 中，你可能希望多个 Pod 同时访问设备。

<!--
If you directly reference a specific ResourceClaim in a Pod, that ResourceClaim
must already exist in the cluster. If a referenced ResourceClaim doesn't exist,
the Pod remains in a pending state until the ResourceClaim is created. You can
reference an auto-generated ResourceClaim in a Pod, but this isn't recommended
because auto-generated ResourceClaims are bound to the lifetime of the Pod that
triggered the generation.

To create a workload that claims resources, select one of the following options:
-->
如果你在 Pod 中直接引用了特定 ResourceClaim，该 ResourceClaim 必须已存在于集群中。否则，
Pod 会保持在 Pending 状态，直到申领被创建。你可以在 Pod 中引用自动生成的 ResourceClaim，
但不推荐这样做，因为自动生成的 ResourceClaim 的生命期被绑定到了触发生成它的 Pod。

要创建申领资源的工作负载，请选择以下选项之一：

{{< tabs name="claim-resources" >}}
{{% tab name="ResourceClaimTemplate" %}}

<!--
Review the following example manifest:
-->
查看以下示例清单：

{{% code_sample file="dra/resourceclaimtemplate.yaml" %}}

<!--
This manifest creates a ResourceClaimTemplate that requests devices in the
`example-device-class` DeviceClass that match both of the following parameters:

  * Devices that have a `driver.example.com/type` attribute with a value of
    `gpu`.
  * Devices that have `64Gi` of capacity.

To create the ResourceClaimTemplate, run the following command:
-->
此清单会创建一个 ResourceClaimTemplate，它请求属于 `example-device-class`
DeviceClass、且同时满足以下两个参数的设备：

* 属性 `driver.example.com/type` 的值为 `gpu`
* 容量为 `64Gi`

创建 ResourceClaimTemplate 的命令如下：

```shell
kubectl apply -f https://k8s.io/examples/dra/resourceclaimtemplate.yaml
```

{{% /tab %}}
{{% tab name="ResourceClaim" %}}

<!--
Review the following example manifest:
-->
查看以下示例清单：

{{% code_sample file="dra/resourceclaim.yaml" %}}

<!--
This manifest creates ResourceClaim that requests devices in the
`example-device-class` DeviceClass that match both of the following parameters:

  * Devices that have a `driver.example.com/type` attribute with a value of
    `gpu`.
  * Devices that have `64Gi` of capacity.

To create the ResourceClaim, run the following command:
-->
此清单会创建一个 ResourceClaim，请求属于 `example-device-class`
DeviceClass、且同时满足以下两个参数的设备：

* 属性 `driver.example.com/type` 的值为 `gpu`
* 容量为 `64Gi`

创建 ResourceClaim 的命令如下：

```shell
kubectl apply -f https://k8s.io/examples/dra/resourceclaim.yaml
```

{{% /tab %}}
{{< /tabs >}}

<!--
## Request devices in workloads using DRA {#request-devices-workloads}

To request device allocation, specify a ResourceClaim or a ResourceClaimTemplate
in the `resourceClaims` field of the Pod specification. Then, request a specific
claim by name in the `resources.claims` field of a container in that Pod.
You can specify multiple entries in the `resourceClaims` field and use specific
claims in different containers.

1. Review the following example Job:
-->
## 使用 DRA 在工作负载中请求设备 {#request-devices-workloads}

要请求设备分配，请在 Pod 规约的 `resourceClaims` 字段中指定 ResourceClaim
或 ResourceClaimTemplate，然后在容器的 `resources.claims` 字段中按名称请求具体的资源申领。
你可以在 `resourceClaims` 中列出多个条目，并在不同容器中使用特定的申领。

1. 查看以下 Job 示例：

   {{% code_sample file="dra/dra-example-job.yaml" %}}

   <!--
   Each Pod in this Job has the following properties:
   
   * Makes a ResourceClaimTemplate named `separate-gpu-claim` and a
     ResourceClaim named `shared-gpu-claim` available to containers.
   * Runs the following containers:
       * `container0` requests the devices from the `separate-gpu-claim` 
         ResourceClaimTemplate. 
       * `container1` and `container2` share access to the devices from the
         `shared-gpu-claim` ResourceClaim.
   -->

   此 Job 中的每个 Pod 具备以下属性：

   * 提供名为 `separate-gpu-claim` 的 ResourceClaimTemplate 和名为
     `shared-gpu-claim` 的 ResourceClaim 给容器使用。
   * 运行以下容器：

     * `container0` 请求 `separate-gpu-claim` ResourceClaimTemplate 中定义的设备。
     * `container1` 和 `container2` 共享对 `shared-gpu-claim` ResourceClaim 中设备的访问。

<!--
1. Create the Job:
-->
2. 创建 Job：

   ```shell
   kubectl apply -f https://k8s.io/examples/dra/dra-example-job.yaml
   ```

<!--
## Clean up {#clean-up}

To delete the Kubernetes objects that you created in this task, follow these
steps:

1.  Delete the example Job:
-->
## 清理 {#clean-up}

要删除本任务中创建的 Kubernetes 对象，请按照以下步骤操作：

1. 删除示例 Job：

   ```shell
   kubectl delete -f https://k8s.io/examples/dra/dra-example-job.yaml
   ```

<!--
1.  To delete your resource claims, run one of the following commands:

    * Delete the ResourceClaimTemplate:
-->
2. 运行以下其中一条命令来删除你的资源申领：

   * 删除 ResourceClaimTemplate：

     ```shell
     kubectl delete -f https://k8s.io/examples/dra/resourceclaimtemplate.yaml
     ```

   <!--
   * Delete the ResourceClaim:
   -->

   * 删除 ResourceClaim：

     ```shell
     kubectl delete -f https://k8s.io/examples/dra/resourceclaim.yaml
     ```

## {{% heading "whatsnext" %}}

<!--
* [Learn more about DRA](/docs/concepts/scheduling-eviction/dynamic-resource-allocation)
-->
* [进一步了解 DRA](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation)
