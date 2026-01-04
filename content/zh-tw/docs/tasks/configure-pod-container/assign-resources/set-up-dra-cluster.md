---
title: "在叢集中安裝 DRA"
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
本文介紹如何在 Kubernetes 叢集中通過啓用 API 組並設定設備類別來設置**動態資源分配（DRA）**。
這些指示說明適用於叢集管理員。

<!-- body -->

<!--
## About DRA {#about-dra}
-->
## 關於 DRA {#about-dra}

{{< glossary_definition term_id="dra" length="all" >}}

<!--
Ensure that you're familiar with how DRA works and with DRA terminology like
{{< glossary_tooltip text="DeviceClasses" term_id="deviceclass" >}},
{{< glossary_tooltip text="ResourceClaims" term_id="resourceclaim" >}}, and
{{< glossary_tooltip text="ResourceClaimTemplates" term_id="resourceclaimtemplate" >}}.
For details, see
[Dynamic Resource Allocation (DRA)](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/).
-->
確保你已瞭解 DRA 的工作機制及其術語，例如
{{< glossary_tooltip text="DeviceClasses" term_id="deviceclass" >}}、
{{< glossary_tooltip text="ResourceClaims" term_id="resourceclaim" >}}以及
{{< glossary_tooltip text="ResourceClaimTemplates" term_id="resourceclaimtemplate" >}}。
更多資訊請參見[動態資源分配（DRA）](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)。

<!-- prerequisites -->

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
* Directly or indirectly attach devices to your cluster. To avoid potential
  issues with drivers, wait until you set up the DRA feature for your
  cluster before you install drivers.
-->
* 將設備直接或間接掛接到你的叢集中。爲避免驅動相關的問題，請在安裝驅動之前先完成 DRA 特性的設定。

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
DRA 在 Kubernetes 1.34 中進階至 Stable 並預設啓用。
一些較舊的 DRA 驅動或工作負載可能仍需要 Kubernetes 1.30 的 v1beta1 API
或 Kubernetes 1.32 的 v1beta2 API。
當且僅當需要支持這些時，才啓用以下
{{< glossary_tooltip text="API 組" term_id="api-group" >}}：

   * `resource.k8s.io/v1beta1`
   * `resource.k8s.io/v1beta2`

更多資訊請參閱[啓用或禁用 API 組](/zh-cn/docs/reference/using-api/#enabling-or-disabling)。

<!--
## Verify that DRA is enabled {#verify}

To verify that the cluster is configured correctly, try to list DeviceClasses:
-->
## 驗證是否啓用了 DRA {#verify}

若要驗證叢集是否設定正確，可嘗試列出 DeviceClass：

```shell
kubectl get deviceclasses
```

<!--
If the component configuration was correct, the output is similar to the
following:
-->
如果組件設定正確，輸出類似如下：

```
No resources found
```

<!--
If DRA isn't correctly configured, the output of the preceding command is
similar to the following:
-->
如果 DRA 未正確設定，則上述命令的輸出可能如下：

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
你可以嘗試以下排查步驟：

1. 重新設定並重啓 `kube-apiserver` 組件。

2. 如果從 Pod 中完全刪除了 `.spec.resourceClaims` 字段，
   或者 Pod 在不考慮 ResourceClaim 的情況下被調度，
   那麼請驗證 `DynamicResourceAllocation` **特性門控**在
   kube-apiserver、kube-controller-manager、kube-schedule
   或 kubelet 組件中是否被關閉。

<!--
## Install device drivers {#install-drivers}

After you enable DRA for your cluster, you can install the drivers for your
attached devices. For instructions, check the documentation of your device
owner or the project that maintains the device drivers. The drivers that you
install must be compatible with DRA.

To verify that your installed drivers are working as expected, list
ResourceSlices in your cluster:
-->
## 安裝設備驅動 {#install-drivers}

你啓用叢集的 DRA 特性後，你可以安裝所掛接設備的驅動。
安裝方式請參見設備所有者或驅動維護方提供的文檔。你安裝的驅動必須與 DRA 兼容。

若要驗證驅動是否正常工作，可列出叢集中的 ResourceSlice：

```shell
kubectl get resourceslices
```

<!--
The output is similar to the following:
-->
輸出示例如下：

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
嘗試以下故障排查步驟：

1. 檢查 DRA 驅動的健康狀況，並在其日誌輸出中查找關於發佈 ResourceSlice
   的錯誤消息。驅動的供應商可能有關於安裝和故障排除的進一步指示。


<!--
## Create DeviceClasses {#create-deviceclasses}

You can define categories of devices that your application operators can
claim in workloads by creating
{{< glossary_tooltip text="DeviceClasses" term_id="deviceclass" >}}. Some device
driver providers might also instruct you to create DeviceClasses during driver
installation.
-->
## 創建 DeviceClass {#create-deviceclasses}

你可以通過創建
{{< glossary_tooltip text="DeviceClasses" term_id="deviceclass" >}}
定義設備的分類，供應用運維人員在工作負載中申領這些設備。
某些設備驅動提供方也可能在驅動安裝過程中要求你創建 DeviceClass。

<!--
The ResourceSlices that your driver publishes contain information about the
devices that the driver manages, such as capacity, metadata, and attributes. You
can use {{< glossary_tooltip term_id="cel" >}} to filter for properties in your
DeviceClasses, which can make finding devices easier for your workload
operators.

1.  To find the device properties that you can select in DeviceClasses by using
    CEL expressions, get the specification of a ResourceSlice:
-->
你的驅動所發佈的 ResourceSlice 中包含了設備的相關資訊，例如容量、元資料和屬性。你可以使用
{{< glossary_tooltip term_id="cel" >}} 表達式按 DeviceClass 中的屬性進行篩選，
從而幫助工作負載運維人員更輕鬆地找到合適的設備。

1. 若要查看可通過 CEL 表達式在 DeviceClass 中選擇的設備屬性，你可以查看某個 ResourceSlice 的規約：

   ```shell
   kubectl get resourceslice <resourceslice-name> -o yaml
   ```

   <!--
   The output is similar to the following:
   -->

   輸出類似如下：

   <!--
   # lines omitted for clarity
   -->

   ```yaml
   apiVersion: resource.k8s.io/v1
   kind: ResourceSlice
   # 爲簡潔省略部分內容
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
   # 爲簡潔省略部分內容
   ```

   <!--
   You can also check the driver provider's documentation for available
   properties and values.
   -->

   你也可以查閱驅動提供商的文檔，瞭解可用的屬性和對應值。

<!--
1.  Review the following example DeviceClass manifest, which selects any device
    that's managed by the `driver.example.com` device driver:
-->
2. 查看以下 DeviceClass 示例清單，它選擇所有由 `driver.example.com` 設備驅動管理的設備：

   {{% code_sample file="dra/deviceclass.yaml" %}}

<!--
1.  Create the DeviceClass in your cluster:
-->
3. 在叢集中創建 DeviceClass：

   ```shell
   kubectl apply -f https://k8s.io/examples/dra/deviceclass.yaml
   ```

<!--
## Clean up {#clean-up}

To delete the DeviceClass that you created in this task, run the following
command:
-->
## 清理 {#clean-up}

要刪除本任務中創建的 DeviceClass，運行以下命令：

```shell
kubectl delete -f https://k8s.io/examples/dra/deviceclass.yaml
```

## {{% heading "whatsnext" %}}

<!--
* [Learn more about DRA](/docs/concepts/scheduling-eviction/dynamic-resource-allocation)
* [Allocate Devices to Workloads with DRA](/docs/tasks/configure-pod-container/assign-resources/allocate-devices-dra)
-->
* [進一步瞭解 DRA](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation)
* [使用 DRA 爲工作負載分配設備](/zh-cn/docs/tasks/configure-pod-container/assign-resources/allocate-devices-dra)
