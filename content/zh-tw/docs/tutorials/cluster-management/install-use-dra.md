---
title: 使用 DRA 安裝驅動程式並配置裝置
content_type: tutorial
weight: 60
min-kubernetes-server-version: v1.34
---
<!--
title: Install Drivers and Allocate Devices with DRA
content_type: tutorial
weight: 60
min-kubernetes-server-version: v1.34
-->
<!-- FUTURE MAINTAINERS: 
The original point of this doc was for people (mainly cluster administrators) to
understand the importance of the DRA driver and its interaction with the DRA
APIs. As a result it was a requirement of this tutorial to not use Helm and to
be more direct with all the component installation procedures. While much of
this content is also useful to workload authors, I see the primary audience of
_this_ tutorial as cluster administrators, who I feel also need to understand
how the DRA APIs interact with the driver to maintain them well. If I had to
choose which audience to focus on in this doc, I would choose cluster
administrators. If the prose gets too muddied by considering both of them, I'd
rather make a second tutorial for the workload authors that doesn't go into the
driver at all (since IMHO that is more representative of what we think their
experience should be like) and also potentially goes into much more detailed/ ✨
fun ✨ use cases. 
-->

{{< feature-state feature_gate_name="DynamicResourceAllocation" >}}


<!-- overview -->
<!--
This tutorial shows you how to install {{< glossary_tooltip term_id="dra"
text="Dynamic Resource Allocation (DRA)" >}} drivers in your cluster and how to
use them in conjunction with the DRA APIs to allocate {{< glossary_tooltip
text="devices" term_id="device"
>}} to Pods. This page is intended for cluster administrators.

{{< glossary_tooltip text="Dynamic Resource Allocation (DRA)" term_id="dra" >}}
lets a cluster manage availability and allocation of hardware resources to
satisfy Pod-based claims for hardware requirements and preferences. To support
this, a mixture of Kubernetes built-in components (like the Kubernetes
scheduler, kubelet, and kube-controller-manager) and third-party drivers from
device owners (called DRA drivers) share the responsibility to advertise,
allocate, prepare, mount, healthcheck, unprepare, and cleanup resources
throughout the Pod lifecycle. These components share information via a series of
DRA specific APIs in the `resource.k8s.io` API group including {{<
glossary_tooltip text="DeviceClasses" term_id="deviceclass" >}}, {{<
glossary_tooltip text="ResourceSlices" term_id="resourceslice" >}}, {{<
glossary_tooltip text="ResourceClaims" term_id="resourceclaim" >}}, as well as
new fields in the Pod spec itself.
-->
本教學示範如何在叢集中安裝{{< glossary_tooltip term_id="dra"
text="動態資源分配（DRA）" >}}驅動程式，以及如何搭配 DRA API 將{{< glossary_tooltip
text="裝置" term_id="device">}}配置給 Pod。本頁面適合叢集管理員閱讀。

{{< glossary_tooltip text="動態資源分配（DRA）" term_id="dra" >}}讓叢集能夠管理硬體資源的可用性與分配，以滿足 Pod 對硬體資源的需求與偏好。
為了支援此功能，Kubernetes 內建組件（如 Kubernetes 排程器、kubelet 和 kube-controller-manager）與裝置擁有者提供的第三方驅動程式（稱為 DRA 驅動程式）共同負責在 Pod 生命週期中公告、分配、準備、掛載、健康檢查、解除準備及清理資源。這些組件透過 `resource.k8s.io` API 群組中的一系列 DRA 專用 API 共享資訊，包括 {{<
glossary_tooltip text="DeviceClasses" term_id="deviceclass" >}}、{{<
glossary_tooltip text="ResourceSlices" term_id="resourceslice" >}}、{{<
glossary_tooltip text="ResourceClaims" term_id="resourceclaim" >}}，以及 Pod 規格本身的新欄位。

<!-- objectives -->

### {{% heading "objectives" %}}
<!--
* Deploy an example DRA driver
* Deploy a Pod requesting a hardware claim using DRA APIs
* Delete a Pod that has a claim
-->
* 部署範例 DRA 驅動程式
* 部署使用 DRA API 請求硬體資源的 Pod
* 刪除具有資源請求的 Pod

<!-- prerequisites -->
## {{% heading "prerequisites" %}}

<!--
Your cluster should support [RBAC](/docs/reference/access-authn-authz/rbac/).
You can try this tutorial with a cluster using a different authorization
mechanism, but in that case you will have to adapt the steps around defining
roles and permissions.
-->
您的叢集應支援 [RBAC](/zh-tw/docs/reference/access-authn-authz/rbac/)。您可以在使用其他授權機制的叢集上嘗試本教學，但在這種情況下，您需要調整定義角色和權限的步驟。

{{< include "task-tutorial-prereqs.md" >}}

<!--
This tutorial has been tested with Linux nodes, though it may also work with
other types of nodes.
-->
本教學已在 Linux 節點上測試，但也可能適用於其他類型的節點。

{{< version-check >}}

<!--
If your cluster is not currently running Kubernetes {{< skew currentVersion
>}} then please check the documentation for the version of Kubernetes that you
plan to use.
-->
若您的叢集目前未執行 Kubernetes {{< skew currentVersion >}}，請查閱您計劃使用的 Kubernetes 版本的文件。


<!-- lessoncontent -->

<!--
## Explore the initial cluster state {#explore-initial-state}

You can spend some time to observe the initial state of a cluster with DRA
enabled, especially if you have not used these APIs extensively before. If you
set up a new cluster for this tutorial, with no driver installed and no Pod
claims yet to satisfy, the output of these commands won't show any resources.
-->
## 探索叢集的初始狀態 {#explore-initial-state}

您可以花些時間觀察啟用 DRA 的叢集初始狀態，對於還不熟悉這些 API 的使用者來說尤為有用。
若您為本教學設定了新叢集，且尚未安裝驅動程式也沒有待滿足的 Pod 請求，這些指令的輸出將不會顯示任何資源。

<!--
1.  Get a list of {{< glossary_tooltip text="DeviceClasses" term_id="deviceclass" >}}:

1.  Get a list of  {{< glossary_tooltip text="ResourceSlices" term_id="resourceslice" >}}:

1.  Get a list of {{< glossary_tooltip text="ResourceClaims" term_id="resourceclaim" >}} and {{<
glossary_tooltip text="ResourceClaimTemplates" term_id="resourceclaimtemplate"
>}}
-->
1.  取得 {{< glossary_tooltip text="DeviceClasses" term_id="deviceclass" >}} 清單：

    ```shell
    kubectl get deviceclasses
    ```
    輸出類似如下：
    ```
    No resources found
    ```

1.  取得 {{< glossary_tooltip text="ResourceSlices" term_id="resourceslice" >}} 清單：

    ```shell
    kubectl get resourceslices
    ```
    輸出類似如下：
    ```
    No resources found
    ```

1.  取得 {{< glossary_tooltip text="ResourceClaims" term_id="resourceclaim" >}} 和 {{<
glossary_tooltip text="ResourceClaimTemplates" term_id="resourceclaimtemplate"
>}} 清單：

    ```shell
    kubectl get resourceclaims -A
    kubectl get resourceclaimtemplates -A
    ```
    輸出類似如下：
    ```
    No resources found
    No resources found
    ```

<!--
At this point, you have confirmed that DRA is enabled and configured properly in
the cluster, and that no DRA drivers have advertised any resources to the DRA
APIs yet.
-->
至此，您已確認 DRA 在叢集中已啟用且設定正確，且目前尚無 DRA 驅動程式向 DRA API 公告任何資源。

<!--
## Install an example DRA driver {#install-example-driver}

DRA drivers are third-party applications that run on each node of your cluster
to interface with the hardware of that node and Kubernetes' built-in DRA
components. The installation procedure depends on the driver you choose, but is
likely deployed as a {{< glossary_tooltip term_id="daemonset" >}} to all or a
selection of the nodes (using {{< glossary_tooltip text="selectors"
term_id="selector" >}} or similar mechanisms) in your cluster.

Check your driver's documentation for specific installation instructions, which
might include a Helm chart, a set of manifests, or other deployment tooling.

This tutorial uses an example driver which can be found in the
[kubernetes-sigs/dra-example-driver](https://github.com/kubernetes-sigs/dra-example-driver)
repository to demonstrate driver installation. This example driver advertises
simulated GPUs to Kubernetes for your Pods to interact with.
-->
## 安裝範例 DRA 驅動程式 {#install-example-driver}

DRA 驅動程式是在叢集每個節點上執行的第三方應用程式，用於與該節點的硬體及 Kubernetes 內建 DRA 組件互動。
安裝程序取決於您選擇的驅動程式，但通常會以 {{< glossary_tooltip term_id="daemonset" >}} 的形式部署到叢集中的全部或部分節點（使用{{< glossary_tooltip text="選擇器" term_id="selector" >}}或類似機制）。

請查閱您的驅動程式文件以取得特定安裝說明，其中可能包含 Helm chart、一組設定檔或其他部署工具。

本教學使用可在
[kubernetes-sigs/dra-example-driver](https://github.com/kubernetes-sigs/dra-example-driver)
儲存庫中找到的範例驅動程式來示範驅動程式安裝。此範例驅動程式會向 Kubernetes 公告模擬 GPU，供您的 Pod 互動。

<!--
### Prepare your cluster for driver installation {#prepare-cluster-driver}
-->
### 準備叢集以安裝驅動程式 {#prepare-cluster-driver}

<!--
To simplify cleanup, create a namespace named dra-tutorial:
-->
為了簡化清理工作，請建立名為 dra-tutorial 的命名空間：

<!--
1.  Create the namespace:
-->
1.  建立命名空間：

    ```shell
    kubectl create namespace dra-tutorial 
    ```

<!--
In a production environment, you would likely be using a previously released or
qualified image from the driver vendor or your own organization, and your nodes
would need to have access to the image registry where the driver image is
hosted. In this tutorial, you will use a publicly released image of the
dra-example-driver to simulate access to a DRA driver image.
-->
在正式環境中，您通常會使用驅動程式廠商或您所屬組織先前發佈或認證的映像檔，
且您的節點需要能夠存取託管驅動程式映像檔的映像檔儲存庫。
在本教學中，您將使用公開發佈的 dra-example-driver 映像檔來模擬存取 DRA 驅動程式映像檔。

<!--
1.  Confirm your nodes have access to the image by running the following
from within one of your cluster's nodes:
-->
1.  在叢集的其中一個節點上執行以下指令，確認節點可以存取映像檔：

    ```shell
    docker pull registry.k8s.io/dra-example-driver/dra-example-driver:v0.2.0
    ```

<!--
### Deploy the DRA driver components
-->
### 部署 DRA 驅動程式組件

<!--
For this tutorial, you will install the critical example resource driver
components individually with `kubectl`.
-->
在本教學中，您將使用 `kubectl` 逐一安裝重要的範例資源驅動程式組件。

<!--
1.  Create the DeviceClass representing the device types this DRA driver
   supports:

1.  Create the ServiceAccount, ClusterRole and ClusterRoleBinding that will
be used by the driver to gain permissions to interact with the Kubernetes API
on this cluster:

      1.  Create the Service Account:

      1.  Create the ClusterRole:

      1.  Create the ClusterRoleBinding:

1.  Create a {{< glossary_tooltip term_id="priority-class" >}} for the DRA
    driver. The PriorityClass prevents preemption of th  DRA driver component,
    which is responsible for important lifecycle operations for Pods with
    claims. Learn more about [pod priority and preemption
    here](/docs/concepts/scheduling-eviction/pod-priority-preemption/).

1.  Deploy the actual DRA driver as a DaemonSet configured to run the example
   driver binary with the permissions provisioned above. The DaemonSet has the
   permissions that you granted to the ServiceAccount in the previous steps.

    The DaemonSet is configured with the volume mounts necessary to interact
    with the underlying Container Device Interface (CDI) directory, and to
    expose its socket to `kubelet` via the `kubelet/plugins` directory.
-->
1.  建立代表此 DRA 驅動程式所支援裝置類型的 DeviceClass：

    {{% code_sample language="yaml" file="dra/driver-install/deviceclass.yaml" %}}

    ```shell
    kubectl apply --server-side -f http://k8s.io/examples/dra/driver-install/deviceclass.yaml
    ```

1.  建立驅動程式與此叢集 Kubernetes API 互動所需的 ServiceAccount、ClusterRole 和 ClusterRoleBinding：

    1.  建立 ServiceAccount：

        {{% code_sample language="yaml" file="dra/driver-install/serviceaccount.yaml" %}}

        ```shell
        kubectl apply --server-side -f http://k8s.io/examples/dra/driver-install/serviceaccount.yaml
        ```

    1.  建立 ClusterRole：

        {{% code_sample language="yaml" file="dra/driver-install/clusterrole.yaml" %}}

        ```shell
        kubectl apply --server-side -f http://k8s.io/examples/dra/driver-install/clusterrole.yaml
        ```

    1.  建立 ClusterRoleBinding：

        {{% code_sample language="yaml" file="dra/driver-install/clusterrolebinding.yaml" %}}

        ```shell
        kubectl apply --server-side -f http://k8s.io/examples/dra/driver-install/clusterrolebinding.yaml
        ```

1.  為 DRA 驅動程式建立 {{< glossary_tooltip term_id="priority-class" >}}。
    PriorityClass 可防止 DRA 驅動程式組件被搶佔，該組件負責處理具有資源請求的 Pod 的重要生命週期操作。
    深入了解 [Pod 優先權與搶佔](/zh-tw/docs/concepts/scheduling-eviction/pod-priority-preemption/)。

    {{% code_sample language="yaml" file="dra/driver-install/priorityclass.yaml" %}}

    ```shell
    kubectl apply --server-side -f http://k8s.io/examples/dra/driver-install/priorityclass.yaml
    ```

1.  將實際的 DRA 驅動程式部署為 DaemonSet，並設定為使用上述已配置的權限執行範例驅動程式二進位檔。
    DaemonSet 具有您在前述步驟中授予 ServiceAccount 的權限。

    {{% code_sample language="yaml" file="dra/driver-install/daemonset.yaml" %}}

    ```shell
    kubectl apply --server-side -f http://k8s.io/examples/dra/driver-install/daemonset.yaml
    ```
    DaemonSet 設定了與底層容器裝置介面（CDI）目錄互動所需的卷掛載，並透過 `kubelet/plugins` 目錄向 `kubelet` 公開其 socket。

<!--
### Verify the DRA driver installation {#verify-driver-install}
-->
### 驗證 DRA 驅動程式安裝 {#verify-driver-install}

<!--
1.  Get a list of the Pods of the DRA driver DaemonSet across all worker nodes:

1.  The initial responsibility of each node's local DRA driver is to update the
cluster with what devices are available to Pods on that node, by publishing its
metadata to the ResourceSlices API. You can check that API to see that each node
with a driver is advertising the device class it represents.

    Check for available ResourceSlices:
-->
1.  取得所有工作節點上 DRA 驅動程式 DaemonSet 的 Pod 清單：

    ```shell
    kubectl get pod -l app.kubernetes.io/name=dra-example-driver -n dra-tutorial
    ```
    輸出類似如下：
    ```
    NAME                                     READY   STATUS    RESTARTS   AGE
    dra-example-driver-kubeletplugin-4sk2x   1/1     Running   0          13s
    dra-example-driver-kubeletplugin-cttr2   1/1     Running   0          13s
    ```

1.  每個節點本地 DRA 驅動程式的初始職責是透過將其中繼資料發布到 ResourceSlices API，
    向叢集更新該節點上 Pod 可使用的裝置資訊。您可以查看該 API，確認每個安裝了驅動程式的節點都在公告其所代表的裝置類別。

    查看可用的 ResourceSlices：

    ```shell
    kubectl get resourceslices
    ```
    輸出類似如下：
    ```
    NAME                                 NODE           DRIVER            POOL           AGE
    kind-worker-gpu.example.com-k69gd    kind-worker    gpu.example.com   kind-worker    19s
    kind-worker2-gpu.example.com-qdgpn   kind-worker2   gpu.example.com   kind-worker2   19s
    ```

<!--
At this point, you have successfully installed the example DRA driver, and
confirmed its initial configuration. You're now ready to use DRA to schedule
Pods.
-->
至此，您已成功安裝範例 DRA 驅動程式並確認其初始設定。您現在可以使用 DRA 來排程 Pod。

<!--
## Claim resources and deploy a Pod {#claim-resources-pod}
-->
## 請求資源並部署 Pod {#claim-resources-pod}

<!--
To request resources using DRA, you create ResourceClaims or
ResourceClaimTemplates that define the resources that your Pods need. In the
example driver, a memory capacity attribute is exposed for mock GPU devices.
This section shows you how to use {{< glossary_tooltip term_id="cel" >}} to
express your requirements in a ResourceClaim, select that ResourceClaim in a Pod
specification, and observe the resource allocation.

This tutorial showcases only one basic example of a DRA ResourceClaim. Read
[Dynamic Resource
Allocation](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/) to
learn more about ResourceClaims.
-->
若要使用 DRA 請求資源，您需要建立 ResourceClaims 或 ResourceClaimTemplates 來定義 Pod 所需的資源。
在範例驅動程式中，模擬 GPU 裝置會公開記憶體容量屬性。
本節說明如何使用 {{< glossary_tooltip term_id="cel" >}} 在 ResourceClaim 中表達您的需求、
在 Pod 規格中選取該 ResourceClaim，以及觀察資源分配情況。

本教學僅展示 DRA ResourceClaim 的一個基本範例。請閱讀[動態資源分配](/zh-tw/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)以深入了解 ResourceClaims。

<!--
### Create the ResourceClaim

In this section, you create a ResourceClaim and reference it in a Pod. Whatever
the claim, the `deviceClassName` is a required field, narrowing down the scope
of the request to a specific device class. The request itself can include a {{<
glossary_tooltip term_id="cel" >}} expression that references attributes that
may be advertised by the driver managing that device class.

In this example, you will create a request for any GPU advertising over 10Gi
memory capacity. The attribute exposing capacity from the example driver takes
the form `device.capacity['gpu.example.com'].memory`. Note also that the name of
the claim is set to `some-gpu`.
-->
### 建立 ResourceClaim

<!--
In this section, you create a ResourceClaim and reference it in a Pod. Whatever
the claim, the `deviceClassName` is a required field, narrowing down the scope
of the request to a specific device class. The request itself can include a {{<
glossary_tooltip term_id="cel" >}} expression that references attributes that
may be advertised by the driver managing that device class.

In this example, you will create a request for any GPU advertising over 10Gi
memory capacity. The attribute exposing capacity from the example driver takes
the form `device.capacity['gpu.example.com'].memory`. Note also that the name of
the claim is set to `some-gpu`.
-->
在本節中，您將建立一個 ResourceClaim 並在 Pod 中參照它。
無論請求內容為何，`deviceClassName` 都是必填欄位，用於將請求範圍縮小到特定裝置類別。
請求本身可以包含 {{< glossary_tooltip term_id="cel" >}} 表達式，
用來參照驅動程式針對該裝置類別所公告的屬性。

在本範例中，您將建立一個 ResourceClaim，用於請求任何公告超過 10Gi 記憶體容量的 GPU。
範例驅動程式公開容量的屬性格式為 `device.capacity['gpu.example.com'].memory`。
另請注意，此請求的名稱設定為 `some-gpu`。

{{% code_sample language="yaml" file="dra/driver-install/example/resourceclaim.yaml" %}}

```shell
kubectl apply --server-side -f http://k8s.io/examples/dra/driver-install/example/resourceclaim.yaml
```

<!--
### Create the Pod that references that ResourceClaim

Below is the Pod manifest referencing the ResourceClaim you just made,
`some-gpu`, in the `spec.resourceClaims.resourceClaimName` field. The local name
for that claim, `gpu`, is then used in the
`spec.containers.resources.claims.name` field to allocate the claim to the Pod's
underlying container.
-->
### 建立參照 ResourceClaim 的 Pod

<!--
Below is the Pod manifest referencing the ResourceClaim you just made,
`some-gpu`, in the `spec.resourceClaims.resourceClaimName` field. The local name
for that claim, `gpu`, is then used in the
`spec.containers.resources.claims.name` field to allocate the claim to the Pod's
underlying container.
-->
以下是透過 `spec.resourceClaims.resourceClaimName` 欄位參照 `some-gpu` ResourceClaim 的 Pod 設定檔。
該請求的別名 `gpu` 隨後會在 `spec.containers.resources.claims.name` 欄位中使用，
以將請求分配給 Pod 的底層容器。

{{% code_sample language="yaml" file="dra/driver-install/example/pod.yaml" %}}

```shell
kubectl apply --server-side -f http://k8s.io/examples/dra/driver-install/example/pod.yaml
```

<!--
1.  Confirm the pod has deployed:
-->
1.  確認 Pod 已部署：

    ```shell
    kubectl get pod pod0 -n dra-tutorial
    ```

    輸出類似如下：
    ```
    NAME   READY   STATUS    RESTARTS   AGE
    pod0   1/1     Running   0          9s
    ```

<!--
### Explore the DRA state
-->
### 探索 DRA 狀態

<!--
After you create the Pod, the cluster tries to schedule that Pod to a node where
Kubernetes can satisfy the ResourceClaim. In this tutorial, the DRA driver is
deployed on all nodes, and is advertising mock GPUs on all nodes, all of which
have enough capacity advertised to satisfy the Pod's claim, so Kubernetes can
schedule this Pod on any node and can allocate any of the mock GPUs on that
node.

When Kubernetes allocates a mock GPU to a Pod, the example driver adds
environment variables in each container it is allocated to in order to indicate
which GPUs _would_ have been injected into them by a real resource driver and
how they would have been configured, so you can check those environment
variables to see how the Pods have been handled by the system.
-->
建立 Pod 後，叢集會嘗試將該 Pod 排程到 Kubernetes 可以滿足 ResourceClaim 的節點。
在本教學中，DRA 驅動程式部署在所有節點上，並在所有節點上公告模擬 GPU，
所有節點公告的容量都足以滿足 Pod 的請求，因此 Kubernetes 可以將此 Pod 排程到任何節點，
並分配該節點上的任何模擬 GPU。

當 Kubernetes 將模擬 GPU 分配給 Pod 時，範例驅動程式會為每個被分配到該裝置的容器新增環境變數，
以指示真實資源驅動程式_本應_注入哪些 GPU 及其設定方式，
您可以查看這些環境變數來了解系統如何處理這些 Pod。

<!--
1.  Check the Pod logs, which report the name of the mock GPU that was allocated:

1.  Check the state of the ResourceClaim object:

1.  Check the details of the `some-gpu` ResourceClaim. The `status` stanza of
    the ResourceClaim has information about the allocated device and the Pod it
    has been reserved for:

1.  To check how the driver handled device allocation, get the logs for the
    driver DaemonSet Pods:
-->
1.  查看 Pod 日誌，其中記錄了已分配的模擬 GPU 名稱：

    ```shell
    kubectl logs pod0 -c ctr0 -n dra-tutorial | grep -E "GPU_DEVICE_[0-9]+=" | grep -v "RESOURCE_CLAIM"
    ```

    輸出類似如下：
    ```
    declare -x GPU_DEVICE_0="gpu-0"
    ```

1.  查看 ResourceClaim 物件的狀態：

    ```shell
    kubectl get resourceclaims -n dra-tutorial
    ```

    輸出類似如下：

    ```
    NAME       STATE                AGE
    some-gpu   allocated,reserved   34s
    ```

    在此輸出中，`STATE` 欄位顯示 ResourceClaim 已被分配且已保留。

1.  查看 `some-gpu` ResourceClaim 的詳細資訊。ResourceClaim 的 `status` 區段包含已分配裝置及其保留對象 Pod 的資訊：

    ```shell
    kubectl get resourceclaim some-gpu -n dra-tutorial -o yaml
    ```

    輸出類似如下：
    {{< highlight yaml "linenos=inline, hl_lines=27-30 38-41, style=emacs" >}}
    apiVersion: resource.k8s.io/v1
    kind: ResourceClaim
    metadata:
        creationTimestamp: "2025-08-20T18:17:31Z"
        finalizers:
        - resource.kubernetes.io/delete-protection
        name: some-gpu
        namespace: dra-tutorial
        resourceVersion: "2326"
        uid: d3e48dbf-40da-47c3-a7b9-f7d54d1051c3
    spec:
        devices:
            requests:
            - exactly:
                allocationMode: ExactCount
                count: 1
                deviceClassName: gpu.example.com
                selectors:
                - cel:
                    expression: device.capacity['gpu.example.com'].memory.compareTo(quantity('10Gi'))
                    >= 0
            name: some-gpu
    status:
        allocation:
            devices:
            results:
            - device: gpu-0
                driver: gpu.example.com
                pool: kind-worker
                request: some-gpu
            nodeSelector:
            nodeSelectorTerms:
            - matchFields:
                - key: metadata.name
                operator: In
                values:
                - kind-worker
        reservedFor:
        - name: pod0
            resource: pods
            uid: c4dadf20-392a-474d-a47b-ab82080c8bd7
    {{< /highlight >}}

1.  若要查看驅動程式如何處理裝置分配，請取得驅動程式 DaemonSet Pod 的日誌：

    ```shell
    kubectl logs -l app.kubernetes.io/name=dra-example-driver -n dra-tutorial
    ```

    輸出類似如下：
    ```
    I0820 18:17:44.131324       1 driver.go:106] PrepareResourceClaims is called: number of claims: 1
    I0820 18:17:44.135056       1 driver.go:133] Returning newly prepared devices for claim 'd3e48dbf-40da-47c3-a7b9-f7d54d1051c3': [{[some-gpu] kind-worker gpu-0 [k8s.gpu.example.com/gpu=common k8s.gpu.example.com/gpu=d3e48dbf-40da-47c3-a7b9-f7d54d1051c3-gpu-0]}]
    ```

<!--
You have now successfully deployed a Pod that claims devices using DRA, verified
that the Pod was scheduled to an appropriate node, and saw that the associated
DRA APIs kinds were updated with the allocation status.
-->
您現在已成功部署了一個使用 DRA 請求裝置的 Pod，確認該 Pod 已被排程到適當的節點，
並確認相關的 DRA API 物件已反映最新的分配狀態。

<!--
## Delete a Pod that has a claim {#delete-pod-claim}
-->
## 刪除具有資源請求的 Pod {#delete-pod-claim}

<!--
When a Pod with a claim is deleted, the DRA driver deallocates the resource so
it can be available for future scheduling. To validate this behavior, delete the
Pod that you created in the previous steps and watch the corresponding changes
to the ResourceClaim and driver.
-->
當具有資源請求的 Pod 被刪除時，DRA 驅動程式會釋放資源，使其可用於未來的排程。
為了驗證此行為，請刪除您在前述步驟中建立的 Pod，並觀察 ResourceClaim 和驅動程式的相應變更。

<!--
1.  Delete the `pod0` Pod:
-->
1.  刪除 `pod0` Pod：

    ```shell
    kubectl delete pod pod0 -n dra-tutorial
    ```

    輸出類似如下：

    ```
    pod "pod0" deleted
    ```

<!--
### Observe the DRA state
-->
### 觀察 DRA 狀態

<!--
When the Pod is deleted, the driver deallocates the device from the
ResourceClaim and updates the ResourceClaim resource in the Kubernetes API. The
ResourceClaim has a `pending` state until it's referenced in a new Pod.
-->
當 Pod 被刪除時，驅動程式會從 ResourceClaim 中釋放裝置，並更新 Kubernetes API 中的 ResourceClaim 資源。
ResourceClaim 將保持 `pending` 狀態，直到它被新的 Pod 參照為止。

<!--
1.  Check the state of the `some-gpu` ResourceClaim:

1.  Verify that the driver has processed unpreparing the device for this claim by
   checking the driver logs:
-->
1.  查看 `some-gpu` ResourceClaim 的狀態：

    ```shell
    kubectl get resourceclaims -n dra-tutorial
    ```

    輸出類似如下：
    ```
    NAME       STATE     AGE
    some-gpu   pending   76s
    ```

1.  查看驅動程式日誌，確認驅動程式已解除此請求的裝置配置：

    ```shell
    kubectl logs -l app.kubernetes.io/name=dra-example-driver -n dra-tutorial
    ```
    輸出類似如下：
    ```
    I0820 18:22:15.629376       1 driver.go:138] UnprepareResourceClaims is called: number of claims: 1
    ```

<!--
You have now deleted a Pod that had a claim, and observed that the driver took
action to unprepare the underlying hardware resource and update the DRA APIs to
reflect that the resource is available again for future scheduling.
-->
您現在已刪除了具有資源請求的 Pod，並觀察到驅動程式解除了底層硬體資源的配置，
同時更新 DRA API，讓該資源再次可供排程使用。

## {{% heading "cleanup" %}}

<!--
To clean up the resources that you created in this tutorial, follow these steps:
-->
若要清理本教學中建立的資源，請執行以下步驟：

```shell
kubectl delete namespace dra-tutorial
kubectl delete deviceclass gpu.example.com
kubectl delete clusterrole dra-example-driver-role
kubectl delete clusterrolebinding dra-example-driver-role-binding
kubectl delete priorityclass dra-driver-high-priority
```

## {{% heading "whatsnext" %}}

<!--
* [Learn more about DRA](/docs/concepts/scheduling-eviction/dynamic-resource-allocation)
* [Allocate Devices to Workloads with DRA](/docs/tasks/configure-pod-container/assign-resources/allocate-devices-dra)
-->
* [深入了解 DRA](/zh-tw/docs/concepts/scheduling-eviction/dynamic-resource-allocation)
* [使用 DRA 為工作負載配置裝置](/zh-tw/docs/tasks/configure-pod-container/assign-resources/allocate-devices-dra)
