---
title: "在集群中安装 DRA"
content_type: task
min-kubernetes-server-version: v1.34
weight: 10
---
<!--
title: "Set Up DRA in a Cluster"
content_type: task
min-kubernetes-server-version: v1.34
weight: 10
-->

{{< feature-state feature_gate_name="DynamicResourceAllocation" >}}

<!-- overview -->

<!--
This page shows you how to configure _dynamic resource allocation (DRA)_ in a
Kubernetes cluster by enabling API groups and configuring classes of devices.
These instructions are for cluster administrators.
-->
本文介绍如何在 Kubernetes 集群中通过启用 API 组并配置设备类别来设置**动态资源分配（DRA）**。
这些指示说明适用于集群管理员。

<!-- body -->

<!--
## About DRA {#about-dra}
-->
## 关于 DRA {#about-dra}

{{< glossary_definition term_id="dra" length="all" >}}

<!--
Ensure that you're familiar with how DRA works and with DRA terminology like
{{< glossary_tooltip text="DeviceClasses" term_id="deviceclass" >}},
{{< glossary_tooltip text="ResourceClaims" term_id="resourceclaim" >}}, and
{{< glossary_tooltip text="ResourceClaimTemplates" term_id="resourceclaimtemplate" >}}.
For details, see
[Dynamic Resource Allocation (DRA)](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/).
-->
确保你已了解 DRA 的工作机制及其术语，例如
{{< glossary_tooltip text="DeviceClasses" term_id="deviceclass" >}}、
{{< glossary_tooltip text="ResourceClaims" term_id="resourceclaim" >}}以及
{{< glossary_tooltip text="ResourceClaimTemplates" term_id="resourceclaimtemplate" >}}。
更多信息请参见[动态资源分配（DRA）](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)。

<!-- prerequisites -->

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
* Directly or indirectly attach devices to your cluster. To avoid potential
  issues with drivers, wait until you set up the DRA feature for your
  cluster before you install drivers.
-->
* 将设备直接或间接挂接到你的集群中。为避免驱动相关的问题，请在安装驱动之前先完成 DRA 特性的配置。

<!-- steps -->

<!--
## Optional: enable legacy DRA API groups {#enable-dra}

DRA graduated to stable in Kubernetes 1.34 and is enabled by default.
Some older DRA drivers or workloads might still need the
v1beta1 API from Kubernetes 1.30 or v1beta2 from Kubernetes 1.32.
If and only if support for those is desired, then enable the following
{{< glossary_tooltip text="API groups" term_id="api-group" >}}:

    * `resource.k8s.io/v1beta1`
    * `resource.k8s.io/v1beta2`

For more information, see
[Enabling or disabling API groups](/docs/reference/using-api/#enabling-or-disabling).
-->
DRA 在 Kubernetes 1.34 中进阶至 Stable 并默认启用。
一些较旧的 DRA 驱动或工作负载可能仍需要 Kubernetes 1.30 的 v1beta1 API
或 Kubernetes 1.32 的 v1beta2 API。
当且仅当需要支持这些时，才启用以下
{{< glossary_tooltip text="API 组" term_id="api-group" >}}：

   * `resource.k8s.io/v1beta1`
   * `resource.k8s.io/v1beta2`

更多信息请参阅[启用或禁用 API 组](/zh-cn/docs/reference/using-api/#enabling-or-disabling)。

<!--
## Verify that DRA is enabled {#verify}

To verify that the cluster is configured correctly, try to list DeviceClasses:
-->
## 验证是否启用了 DRA {#verify}

若要验证集群是否配置正确，可尝试列出 DeviceClass：

```shell
kubectl get deviceclasses
```

<!--
If the component configuration was correct, the output is similar to the
following:
-->
如果组件配置正确，输出类似如下：

```
No resources found
```

<!--
If DRA isn't correctly configured, the output of the preceding command is
similar to the following:
-->
如果 DRA 未正确配置，则上述命令的输出可能如下：

```
error: the server doesn't have a resource type "deviceclasses"
```

<!--
Try the following troubleshooting steps:

1. Reconfigure and restart the `kube-apiserver` component.

1. If the complete `.spec.resourceClaims` field gets removed from Pods, or if
   Pods get scheduled without considering the ResourceClaims, then verify
   that the `DynamicResourceAllocation` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) is not turned off
   for kube-apiserver, kube-controller-manager, kube-scheduler or the kubelet.
-->
你可以尝试以下排查步骤：

1. 重新配置并重启 `kube-apiserver` 组件。

2. 如果从 Pod 中完全删除了 `.spec.resourceClaims` 字段，
   或者 Pod 在不考虑 ResourceClaim 的情况下被调度，
   那么请验证 `DynamicResourceAllocation` **特性门控**在
   kube-apiserver、kube-controller-manager、kube-schedule
   或 kubelet 组件中是否被关闭。

<!--
## Install device drivers {#install-drivers}

After you enable DRA for your cluster, you can install the drivers for your
attached devices. For instructions, check the documentation of your device
owner or the project that maintains the device drivers. The drivers that you
install must be compatible with DRA.

To verify that your installed drivers are working as expected, list
ResourceSlices in your cluster:
-->
## 安装设备驱动 {#install-drivers}

你启用集群的 DRA 特性后，你可以安装所挂接设备的驱动。
安装方式请参见设备所有者或驱动维护方提供的文档。你安装的驱动必须与 DRA 兼容。

若要验证驱动是否正常工作，可列出集群中的 ResourceSlice：

```shell
kubectl get resourceslices
```

<!--
The output is similar to the following:
-->
输出示例如下：

```
NAME                                                  NODE                DRIVER               POOL                             AGE
cluster-1-device-pool-1-driver.example.com-lqx8x      cluster-1-node-1    driver.example.com   cluster-1-device-pool-1-r1gc     7s
cluster-1-device-pool-2-driver.example.com-29t7b      cluster-1-node-2    driver.example.com   cluster-1-device-pool-2-446z     8s
```

<!--
Try the following troubleshooting steps:

1. Check the health of the DRA driver and look for error messages about
   publishing ResourceSlices in its log output. The vendor of the driver
   may have further instructions about installation and troubleshooting.
-->
尝试以下故障排查步骤：

1. 检查 DRA 驱动的健康状况，并在其日志输出中查找关于发布 ResourceSlice
   的错误消息。驱动的供应商可能有关于安装和故障排除的进一步指示。


<!--
## Create DeviceClasses {#create-deviceclasses}

You can define categories of devices that your application operators can
claim in workloads by creating
{{< glossary_tooltip text="DeviceClasses" term_id="deviceclass" >}}. Some device
driver providers might also instruct you to create DeviceClasses during driver
installation.
-->
## 创建 DeviceClass {#create-deviceclasses}

你可以通过创建
{{< glossary_tooltip text="DeviceClasses" term_id="deviceclass" >}}
定义设备的分类，供应用运维人员在工作负载中申领这些设备。
某些设备驱动提供方也可能在驱动安装过程中要求你创建 DeviceClass。

<!--
The ResourceSlices that your driver publishes contain information about the
devices that the driver manages, such as capacity, metadata, and attributes. You
can use {{< glossary_tooltip term_id="cel" >}} to filter for properties in your
DeviceClasses, which can make finding devices easier for your workload
operators.

1.  To find the device properties that you can select in DeviceClasses by using
    CEL expressions, get the specification of a ResourceSlice:
-->
你的驱动所发布的 ResourceSlice 中包含了设备的相关信息，例如容量、元数据和属性。你可以使用
{{< glossary_tooltip term_id="cel" >}} 表达式按 DeviceClass 中的属性进行筛选，
从而帮助工作负载运维人员更轻松地找到合适的设备。

1. 若要查看可通过 CEL 表达式在 DeviceClass 中选择的设备属性，你可以查看某个 ResourceSlice 的规约：

   ```shell
   kubectl get resourceslice <resourceslice-name> -o yaml
   ```

   <!--
   The output is similar to the following:
   -->

   输出类似如下：

   <!--
   # lines omitted for clarity
   -->

   ```yaml
   apiVersion: resource.k8s.io/v1
   kind: ResourceSlice
   # 为简洁省略部分内容
   spec:
     devices:
      - attributes:
          type:
            string: gpu
        capacity:
          memory:
            value: 64Gi
        name: gpu-0
      - attributes:
          type:
            string: gpu
        capacity:
          memory:
            value: 64Gi
        name: gpu-1
     driver: driver.example.com
     nodeName: cluster-1-node-1
   # 为简洁省略部分内容
   ```

   <!--
   You can also check the driver provider's documentation for available
   properties and values.
   -->

   你也可以查阅驱动提供商的文档，了解可用的属性和对应值。

<!--
1.  Review the following example DeviceClass manifest, which selects any device
    that's managed by the `driver.example.com` device driver:
-->
2. 查看以下 DeviceClass 示例清单，它选择所有由 `driver.example.com` 设备驱动管理的设备：

   {{% code_sample file="dra/deviceclass.yaml" %}}

<!--
1.  Create the DeviceClass in your cluster:
-->
3. 在集群中创建 DeviceClass：

   ```shell
   kubectl apply -f https://k8s.io/examples/dra/deviceclass.yaml
   ```

<!--
## Clean up {#clean-up}

To delete the DeviceClass that you created in this task, run the following
command:
-->
## 清理 {#clean-up}

要删除本任务中创建的 DeviceClass，运行以下命令：

```shell
kubectl delete -f https://k8s.io/examples/dra/deviceclass.yaml
```

## {{% heading "whatsnext" %}}

<!--
* [Learn more about DRA](/docs/concepts/scheduling-eviction/dynamic-resource-allocation)
* [Allocate Devices to Workloads with DRA](/docs/tasks/configure-pod-container/assign-resources/allocate-devices-dra)
-->
* [进一步了解 DRA](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation)
* [使用 DRA 为工作负载分配设备](/zh-cn/docs/tasks/configure-pod-container/assign-resources/allocate-devices-dra)
