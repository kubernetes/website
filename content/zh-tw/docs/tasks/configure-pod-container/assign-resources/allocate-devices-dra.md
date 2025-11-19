---
title: 使用 DRA 爲工作負載分配設備
content_type: task
min-kubernetes-server-version: v1.34
weight: 20
---
<!--
title: Allocate Devices to Workloads with DRA
content_type: task
min-kubernetes-server-version: v1.34
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
本文介紹如何使用**動態資源分配（DRA）** 爲 Pod 分配設備。
這些指示說明面向工作負載運維人員。在閱讀本文之前，請先了解 DRA 的工作原理以及相關術語，例如
{{< glossary_tooltip text="ResourceClaim" term_id="resourceclaim" >}} 和
{{< glossary_tooltip text="ResourceClaimTemplate" term_id="resourceclaimtemplate" >}}。
更多信息參閱[動態資源分配（DRA）](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)。

<!-- body -->

<!--
## About device allocation with DRA {#about-device-allocation-dra}

As a workload operator, you can _claim_ devices for your workloads by creating
ResourceClaims or ResourceClaimTemplates. When you deploy your workload,
Kubernetes and the device drivers find available devices, allocate them to your
Pods, and place the Pods on nodes that can access those devices.
-->
## 關於使用 DRA 分配設備 {#about-device-allocation-dra}

作爲工作負載運維人員，你可以通過創建 ResourceClaim 或 ResourceClaimTemplate
來**申領**工作負載所需的設備。當你部署工作負載時，Kubernetes 和設備驅動會找到可用的設備，
將其分配給 Pod，並將 Pod 調度到可訪問這些設備的節點上。

<!-- prerequisites -->

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
* Ensure that your cluster admin has set up DRA, attached devices, and installed
  drivers. For more information, see
  [Set Up DRA in a Cluster](/docs/tasks/configure-pod-container/assign-resources/set-up-dra-cluster).
-->
* 請確保叢集管理員已安裝好 DRA，掛接了設備並安裝了驅動程序。
  詳情請參見[在叢集中安裝 DRA](/zh-cn/docs/tasks/configure-pod-container/assign-resources/set-up-dra-cluster)。

<!-- steps -->

<!--
## Identify devices to claim {#identify-devices}

Your cluster administrator or the device drivers create
_{{< glossary_tooltip term_id="deviceclass" text="DeviceClasses" >}}_ that
define categories of devices. You can claim devices by using
{{< glossary_tooltip term_id="cel" >}} to filter for specific device properties.

Get a list of DeviceClasses in the cluster:、
-->
## 尋找可申領的設備  {#identify-devices}

你的叢集管理員或設備驅動程序會創建定義設備類別的
{{< glossary_tooltip term_id="deviceclass" text="DeviceClass" >}}。你可以使用
{{< glossary_tooltip term_id="cel" >}} 表達式篩選特定的設備屬性，從而申領設備。

獲取叢集中的 DeviceClass 列表：

```shell
kubectl get deviceclasses
```

<!--
The output is similar to the following:
-->
輸出類似如下：

```
NAME                 AGE
driver.example.com   16m
```

<!--
If you get a permission error, you might not have access to get DeviceClasses.
Check with your cluster administrator or with the driver provider for available
device properties.
-->
如果你遇到權限錯誤，你可能無權獲取 DeviceClass。
請與你的叢集管理員或驅動提供商聯繫，瞭解可用的設備屬性。

<!--
## Claim resources {#claim-resources}

You can request resources from a DeviceClass by using 
{{< glossary_tooltip text="ResourceClaims" term_id="resourceclaim" >}}. To
create a ResourceClaim, do one of the following:
-->
## 申領資源 {#claim-resources}

你可以通過
{{< glossary_tooltip text="ResourceClaim" term_id="resourceclaim" >}}
請求某個 DeviceClass 的資源。要創建 ResourceClaim，可以採用以下方式之一：

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
* 手動創建 ResourceClaim，如果你希望多個 Pod 共享相同設備，或希望申領在 Pod 生命期結束後仍然存在。
* 使用
  {{< glossary_tooltip text="ResourceClaimTemplate" term_id="resourceclaimtemplate" >}}，
  讓 Kubernetes 爲每個 Pod 生成並管理 ResourceClaim。如果你希望每個 Pod
  訪問獨立的、具有類似設定的設備，你可以創建 ResourceClaimTemplate。例如，
  在使用[並行執行](/zh-cn/docs/concepts/workloads/controllers/job/#parallel-jobs)的
  Job 中，你可能希望多個 Pod 同時訪問設備。

<!--
If you directly reference a specific ResourceClaim in a Pod, that ResourceClaim
must already exist in the cluster. If a referenced ResourceClaim doesn't exist,
the Pod remains in a pending state until the ResourceClaim is created. You can
reference an auto-generated ResourceClaim in a Pod, but this isn't recommended
because auto-generated ResourceClaims are bound to the lifetime of the Pod that
triggered the generation.

To create a workload that claims resources, select one of the following options:
-->
如果你在 Pod 中直接引用了特定 ResourceClaim，該 ResourceClaim 必須已存在於叢集中。否則，
Pod 會保持在 Pending 狀態，直到申領被創建。你可以在 Pod 中引用自動生成的 ResourceClaim，
但不推薦這樣做，因爲自動生成的 ResourceClaim 的生命期被綁定到了觸發生成它的 Pod。

要創建申領資源的工作負載，請選擇以下選項之一：

{{< tabs name="claim-resources" >}}
{{% tab name="ResourceClaimTemplate" %}}

<!--
Review the following example manifest:
-->
查看以下示例清單：

{{% code_sample file="dra/resourceclaimtemplate.yaml" %}}

<!--
This manifest creates a ResourceClaimTemplate that requests devices in the
`example-device-class` DeviceClass that match both of the following parameters:

  * Devices that have a `driver.example.com/type` attribute with a value of
    `gpu`.
  * Devices that have `64Gi` of capacity.

To create the ResourceClaimTemplate, run the following command:
-->
此清單會創建一個 ResourceClaimTemplate，它請求屬於 `example-device-class`
DeviceClass、且同時滿足以下兩個參數的設備：

* 屬性 `driver.example.com/type` 的值爲 `gpu`
* 容量爲 `64Gi`

創建 ResourceClaimTemplate 的命令如下：

```shell
kubectl apply -f https://k8s.io/examples/dra/resourceclaimtemplate.yaml
```

{{% /tab %}}
{{% tab name="ResourceClaim" %}}

<!--
Review the following example manifest:
-->
查看以下示例清單：

{{% code_sample file="dra/resourceclaim.yaml" %}}

<!--
This manifest creates ResourceClaim that requests devices in the
`example-device-class` DeviceClass that match both of the following parameters:

  * Devices that have a `driver.example.com/type` attribute with a value of
    `gpu`.
  * Devices that have `64Gi` of capacity.

To create the ResourceClaim, run the following command:
-->
此清單會創建一個 ResourceClaim，請求屬於 `example-device-class`
DeviceClass、且同時滿足以下兩個參數的設備：

* 屬性 `driver.example.com/type` 的值爲 `gpu`
* 容量爲 `64Gi`

創建 ResourceClaim 的命令如下：

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
## 使用 DRA 在工作負載中請求設備 {#request-devices-workloads}

要請求設備分配，請在 Pod 規約的 `resourceClaims` 字段中指定 ResourceClaim
或 ResourceClaimTemplate，然後在容器的 `resources.claims` 字段中按名稱請求具體的資源申領。
你可以在 `resourceClaims` 中列出多個條目，並在不同容器中使用特定的申領。

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

   此 Job 中的每個 Pod 具備以下屬性：

   * 提供名爲 `separate-gpu-claim` 的 ResourceClaimTemplate 和名爲
     `shared-gpu-claim` 的 ResourceClaim 給容器使用。
   * 運行以下容器：

     * `container0` 請求 `separate-gpu-claim` ResourceClaimTemplate 中定義的設備。
     * `container1` 和 `container2` 共享對 `shared-gpu-claim` ResourceClaim 中設備的訪問。

<!--
1. Create the Job:
-->
2. 創建 Job：

   ```shell
   kubectl apply -f https://k8s.io/examples/dra/dra-example-job.yaml
   ```

<!--
Try the following troubleshooting steps:

1. When the workload does not start as expected, drill down from Job
   to Pods to ResourceClaims and check the objects
   at each level with `kubectl describe` to see whether there are any
   status fields or events which might explain why the workload is
   not starting.
1. When creating a Pod fails with `must specify one of: resourceClaimName,
   resourceClaimTemplateName`, check that all entries in `pod.spec.resourceClaims`
   have exactly one of those fields set. If they do, then it is possible
   that the cluster has a mutating Pod webhook installed which was built
   against APIs from Kubernetes < 1.32. Work with your cluster administrator
   to check this.
-->
嘗試以下故障排查步驟：

1. 當工作負載未如預期啓動時，從 Job 到 Pod 再到 ResourceClaim 逐步深入檢查，
   並使用 `kubectl describe` 檢查每個層級的對象，
   查看是否有狀態字段或事件可以解釋工作負載爲何沒有啓動。
2. 當創建 Pod 失敗並顯示 `must specify one of：resourceClaimName, resourceClaimTemplateName` 時，
   檢查 `pod.spec.resourceClaims` 中的所有條目是否正好設置了這些字段之一。如果是這樣，
   那麼可能是叢集安裝了一個針對 Kubernetes < 1.32 的 API 構建的 Pod 變更 Webhook。
   請與你的叢集管理員合作檢查這個問題。

<!--
## Clean up {#clean-up}

To delete the Kubernetes objects that you created in this task, follow these
steps:

1.  Delete the example Job:
-->
## 清理 {#clean-up}

要刪除本任務中創建的 Kubernetes 對象，請按照以下步驟操作：

1. 刪除示例 Job：

   ```shell
   kubectl delete -f https://k8s.io/examples/dra/dra-example-job.yaml
   ```

<!--
1.  To delete your resource claims, run one of the following commands:

    * Delete the ResourceClaimTemplate:
-->
2. 運行以下其中一條命令來刪除你的資源申領：

   * 刪除 ResourceClaimTemplate：

     ```shell
     kubectl delete -f https://k8s.io/examples/dra/resourceclaimtemplate.yaml
     ```

   <!--
   * Delete the ResourceClaim:
   -->

   * 刪除 ResourceClaim：

     ```shell
     kubectl delete -f https://k8s.io/examples/dra/resourceclaim.yaml
     ```

## {{% heading "whatsnext" %}}

<!--
* [Learn more about DRA](/docs/concepts/scheduling-eviction/dynamic-resource-allocation)
-->
* [進一步瞭解 DRA](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation)
