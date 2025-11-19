---
layout: blog
title: "Kubernetes 1.26: 動態資源分配 Alpha API"
date: 2022-12-15
slug: dynamic-resource-allocation
---
<!-- 
layout: blog
title: "Kubernetes 1.26: Alpha API For Dynamic Resource Allocation"
date: 2022-12-15
slug: dynamic-resource-allocation
-->

<!-- 
 **Authors:** Patrick Ohly (Intel), Kevin Klues (NVIDIA)
-->
**作者:** Patrick Ohly (Intel)、Kevin Klues (NVIDIA)

**譯者：** 空桐

<!-- 
Dynamic resource allocation is a new API for requesting resources. It is a
generalization of the persistent volumes API for generic resources, making it possible to:

- access the same resource instance in different pods and containers,
- attach arbitrary constraints to a resource request to get the exact resource
  you are looking for,
- initialize a resource according to parameters provided by the user.
-->
動態資源分配是一個用於請求資源的新 API。
它是對爲通用資源所提供的持久卷 API 的泛化。它可以：

- 在不同的 pod 和容器中訪問相同的資源實例，
- 將任意約束附加到資源請求以獲取你正在尋找的確切資源，
- 通過使用者提供的參數初始化資源。

<!-- 
Third-party resource drivers are responsible for interpreting these parameters
as well as tracking and allocating resources as requests come in.
-->
第三方資源驅動程序負責解釋這些參數，並在資源請求到來時跟蹤和分配資源。

<!-- 
Dynamic resource allocation is an *alpha feature* and only enabled when the
`DynamicResourceAllocation` [feature
gate](/docs/reference/command-line-tools-reference/feature-gates/) and the
`resource.k8s.io/v1alpha1` {{< glossary_tooltip text="API group"
term_id="api-group" >}} are enabled. For details, see the
`--feature-gates` and `--runtime-config` [kube-apiserver
parameters](/docs/reference/command-line-tools-reference/kube-apiserver/).
The kube-scheduler, kube-controller-manager and kubelet components all need
the feature gate enabled as well.
-->
動態資源分配是一個 **alpha 特性**，只有在啓用 `DynamicResourceAllocation`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
和 `resource.k8s.io/v1alpha1` {{< glossary_tooltip text="API 組"
term_id="api-group" >}} 時才啓用。
有關詳細信息，參閱 `--feature-gates` 和 `--runtime-config`
[kube-apiserver 參數](/zh-cn/docs/reference/command-line-tools-reference/kube-apiserver/)。
kube-scheduler、kube-controller-manager 和 kubelet 也需要設置該特性門控。

<!-- 
The default configuration of kube-scheduler enables the `DynamicResources`
plugin if and only if the feature gate is enabled. Custom configurations may
have to be modified to include it.
-->
kube-scheduler 的默認設定僅在啓用特性門控時才啓用 `DynamicResources` 插件。
自定義設定可能需要被修改才能啓用它。

<!-- 
Once dynamic resource allocation is enabled, resource drivers can be installed
to manage certain kinds of hardware. Kubernetes has a test driver that is used
for end-to-end testing, but also can be run manually. See
[below](#running-the-test-driver) for step-by-step instructions.
-->
一旦啓用動態資源分配，就可以安裝資源驅動程序來管理某些類型的硬件。
Kubernetes 有一個用於端到端測試的測試驅動程序，但也可以手動運行。
逐步說明參見[下文](#running-the-test-driver)。

<!--
## API
-->
## API

<!--
The new `resource.k8s.io/v1alpha1` {{< glossary_tooltip text="API group"
term_id="api-group" >}} provides four new types: 
-->
新的 `resource.k8s.io/v1alpha1`
{{< glossary_tooltip text="API 組" term_id="api-group" >}}提供了四種新類型：

<!--
ResourceClass
: Defines which resource driver handles a certain kind of
  resource and provides common parameters for it. ResourceClasses
  are created by a cluster administrator when installing a resource
  driver.

ResourceClaim
: Defines a particular resource instances that is required by a
  workload. Created by a user (lifecycle managed manually, can be shared
  between different Pods) or for individual Pods by the control plane based on
  a ResourceClaimTemplate (automatic lifecycle, typically used by just one
  Pod).
-->
ResourceClass
: 定義由哪個資源驅動程序處理哪種資源，併爲其提供通用參數。
  在安裝資源驅動程序時，由叢集管理員創建 ResourceClass。

ResourceClaim
: 定義工作負載所需的特定資源實例。
  由使用者創建（手動管理生命週期，可以在不同的 Pod 之間共享），
  或者由控制平面基於 ResourceClaimTemplate 爲特定 Pod 創建
  （自動管理生命週期，通常僅由一個 Pod 使用）。

<!--
ResourceClaimTemplate
: Defines the spec and some meta data for creating
  ResourceClaims. Created by a user when deploying a workload.

PodScheduling
: Used internally by the control plane and resource drivers
  to coordinate pod scheduling when ResourceClaims need to be allocated
  for a Pod.
-->
ResourceClaimTemplate
: 定義用於創建 ResourceClaim 的 spec 和一些元數據。
  部署工作負載時由使用者創建。

PodScheduling
: 供控制平面和資源驅動程序內部使用，
  在需要爲 Pod 分配 ResourceClaim 時協調 Pod 調度。

<!--
Parameters for ResourceClass and ResourceClaim are stored in separate objects,
typically using the type defined by a {{< glossary_tooltip
term_id="CustomResourceDefinition" text="CRD" >}} that was created when
installing a resource driver.
-->
ResourceClass 和 ResourceClaim 的參數存儲在單獨的對象中，
通常使用安裝資源驅動程序時創建的 {{< glossary_tooltip
term_id="CustomResourceDefinition" text="CRD" >}} 所定義的類型。

<!--
With this alpha feature enabled, the `spec` of Pod defines ResourceClaims that are needed for a Pod
to run: this information goes into a new
`resourceClaims` field. Entries in that list reference either a ResourceClaim
or a ResourceClaimTemplate. When referencing a ResourceClaim, all Pods using
this `.spec` (for example, inside a Deployment or StatefulSet) share the same
ResourceClaim instance. When referencing a ResourceClaimTemplate, each Pod gets
its own ResourceClaim instance.
-->
啓用此 Alpha 特性後，Pod 的 `spec` 定義 Pod 運行所需的 ResourceClaim：
此信息放入新的 `resourceClaims` 字段。
該列表中的條目引用 ResourceClaim 或 ResourceClaimTemplate。
當引用 ResourceClaim 時，使用此 `.spec` 的所有 Pod
（例如 Deployment 或 StatefulSet 中的 Pod）共享相同的 ResourceClaim 實例。
引用 ResourceClaimTemplate 時，每個 Pod 都有自己的實例。

<!--
For a container defined within a Pod, the  `resources.claims` list 
defines whether that container gets
access to these resource instances, which makes it possible to share resources
between one or more containers inside the same Pod. For example, an init container could
set up the resource before the application uses it.
-->
對於 Pod 中定義的容器，`resources.claims` 列表定義該容器可以訪問的資源實例，
從而可以在同一 Pod 中的一個或多個容器之間共享資源。
例如，init 容器可以在應用程序使用資源之前設置資源。

<!-- 
Here is an example of a fictional resource driver. Two ResourceClaim objects
will get created for this Pod and each container gets access to one of them.

Assuming a resource driver called `resource-driver.example.com` was installed
together with the following resource class:
-->
下面是一個虛構的資源驅動程序的示例。
此 Pod 將創建兩個 ResourceClaim 對象，每個容器都可以訪問其中一個。

假設已安裝名爲 `resource-driver.example.com` 的資源驅動程序和以下資源類：
```
apiVersion: resource.k8s.io/v1alpha1
kind: ResourceClass
name: resource.example.com
driverName: resource-driver.example.com
```

<!--
An end-user could then allocate two specific resources of type
`resource.example.com` as follows:
-->
這樣，終端使用者可以按如下方式分配兩個類型爲
`resource.example.com` 的特定資源：
```yaml
---
apiVersion: cats.resource.example.com/v1
kind: ClaimParameters
name: large-black-cats
spec:
  color: black
  size: large
---
apiVersion: resource.k8s.io/v1alpha1
kind: ResourceClaimTemplate
metadata:
  name: large-black-cats
spec:
  spec:
    resourceClassName: resource.example.com
    parametersRef:
      apiGroup: cats.resource.example.com
      kind: ClaimParameters
      name: large-black-cats
–--
apiVersion: v1
kind: Pod
metadata:
  name: pod-with-cats
spec:
  containers: # 兩個示例容器；每個容器申領一個 cat 資源
  - name: first-example
    image: ubuntu:22.04
    command: ["sleep", "9999"]
    resources:
      claims:
      - name: cat-0
  - name: second-example
    image: ubuntu:22.04
    command: ["sleep", "9999"]
    resources:
      claims:
      - name: cat-1
  resourceClaims:
  - name: cat-0
    source:
      resourceClaimTemplateName: large-black-cats
  - name: cat-1
    source:
      resourceClaimTemplateName: large-black-cats
```

<!--
## Scheduling
-->
## 調度 {#scheduling}

<!--
In contrast to native resources (such as CPU or RAM) and
[extended resources](/docs/concepts/configuration/manage-resources-containers/#extended-resources)
(managed by a
device plugin, advertised by kubelet), the scheduler has no knowledge of what
dynamic resources are available in a cluster or how they could be split up to
satisfy the requirements of a specific ResourceClaim. Resource drivers are
responsible for that. Drivers mark ResourceClaims as _allocated_ once resources
for it are reserved. This also then tells the scheduler where in the cluster a
claimed resource is actually available.
-->
與原生資源（CPU、RAM）和[擴展資源](/zh-cn/docs/concepts/configuration/manage-resources-containers/#extended-resources)
（由設備插件管理，並由 kubelet 公佈）不同，調度器不知道叢集中有哪些動態資源，
也不知道如何將它們拆分以滿足特定 ResourceClaim 的要求。
資源驅動程序負責這些任務。
資源驅動程序在爲 ResourceClaim 保留資源後將其標記爲**已分配（Allocated）**。
然後告訴調度器叢集中可用的 ResourceClaim 的位置。

<!--
ResourceClaims can get resources allocated as soon as the ResourceClaim
is created (_immediate allocation_), without considering which Pods will use
the resource. The default (_wait for first consumer_) is to delay allocation until
a Pod that relies on the ResourceClaim becomes eligible for scheduling.
This design with two allocation options is similar to how Kubernetes handles
storage provisioning with PersistentVolumes and PersistentVolumeClaims.
-->
ResourceClaim 可以在創建時就進行分配（**立即分配**），不用考慮哪些 Pod 將使用該資源。
默認情況下采用延遲分配（**等待第一個消費者**），
直到依賴於 ResourceClaim 的 Pod 有資格調度時再進行分配。
這種兩種分配選項的設計與 Kubernetes 處理 PersistentVolume 和
PersistentVolumeClaim 供應的存儲類似。

<!--
In the wait for first consumer mode, the scheduler checks all ResourceClaims needed
by a Pod. If the Pods has any ResourceClaims, the scheduler creates a PodScheduling
(a special object that requests scheduling details on behalf of the Pod). The PodScheduling
has the same name and namespace as the Pod and the Pod as its as owner.
Using its PodScheduling, the scheduler informs the resource drivers
responsible for those ResourceClaims about nodes that the scheduler considers
suitable for the Pod. The resource drivers respond by excluding nodes that
don't have enough of the driver's resources left.
-->
在等待第一個消費者模式下，調度器檢查 Pod 所需的所有 ResourceClaim。
如果 Pod 有 ResourceClaim，則調度器會創建一個 PodScheduling
對象（一種特殊對象，代表 Pod 請求調度詳細信息）。
PodScheduling 的名稱和命名空間與 Pod 相同，Pod 是它的所有者。
調度器使用 PodScheduling 通知負責這些 ResourceClaim
的資源驅動程序，告知它們調度器認爲適合該 Pod 的節點。
資源驅動程序通過排除沒有足夠剩餘資源的節點來響應調度器。

<!--
Once the scheduler has that resource
information, it selects one node and stores that choice in the PodScheduling
object. The resource drivers then allocate resources based on the relevant
ResourceClaims so that the resources will be available on that selected node.
Once that resource allocation is complete, the scheduler attempts to schedule the Pod
to a suitable node. Scheduling can still fail at this point; for example, a different Pod could
be scheduled to the same node in the meantime. If this happens, already allocated
ResourceClaims may get deallocated to enable scheduling onto a different node.
-->
一旦調度器有了資源信息，它就會選擇一個節點，並將該選擇存儲在 PodScheduling 對象中。
然後，資源驅動程序分配其 ResourceClaim，以便資源可用於選中的節點。
一旦完成資源分配，調度器嘗試將 Pod 調度到合適的節點。這時候調度仍然可能失敗；
例如，不同的 Pod 可能同時被調度到同一個節點。如果發生這種情況，已分配的
ResourceClaim 可能會被取消分配，從而讓 Pod 可以被調度到不同的節點。

<!--
As part of this process, ResourceClaims also get reserved for the
Pod. Currently ResourceClaims can either be used exclusively by a single Pod or
an unlimited number of Pods. 
-->
作爲此過程的一部分，ResourceClaim 會爲 Pod 保留。
目前，ResourceClaim 可以由單個 Pod 獨佔使用或不限數量的多個 Pod 使用。

<!--
One key feature is that Pods do not get scheduled to a node unless all of
their resources are allocated and reserved. This avoids the scenario where
a Pod gets scheduled onto one node and then cannot run there, which is bad
because such a pending Pod also blocks all other resources like RAM or CPU that were
set aside for it.
-->
除非 Pod 的所有資源都已分配和保留，否則 Pod 不會被調度到節點，這是一個重要特性。
這避免了 Pod 被調度到一個節點但無法在那裏運行的情況，
這種情況很糟糕，因爲被掛起 Pod 也會阻塞爲其保留的其他資源，如 RAM 或 CPU。

<!-- 
## Limitations
-->
## 限制 {#limitations}

<!--
The scheduler plugin must be involved in scheduling Pods which use
ResourceClaims. Bypassing the scheduler by setting the `nodeName` field leads
to Pods that the kubelet refuses to start because the ResourceClaims are not
reserved or not even allocated. It may be possible to remove this
[limitation](https://github.com/kubernetes/kubernetes/issues/114005) in the
future.
-->
調度器插件必須參與調度那些使用 ResourceClaim 的 Pod。
通過設置 `nodeName` 字段繞過調度器會導致 kubelet 拒絕啓動 Pod，
因爲 ResourceClaim 沒有被保留或甚至根本沒有被分配。
未來可能去除此[限制](https://github.com/kubernetes/kubernetes/issues/114005)。

<!--
## Writing a resource driver
-->
## 編寫資源驅動程序 {#writing-a-resource-driver}

<!--
A dynamic resource allocation driver typically consists of two separate-but-coordinating
components: a centralized controller, and a DaemonSet of node-local kubelet
plugins. Most of the work required by the centralized controller to coordinate
with the scheduler can be handled by boilerplate code. Only the business logic
required to actually allocate ResourceClaims against the ResourceClasses owned
by the plugin needs to be customized. As such, Kubernetes provides
the following package, including APIs for invoking this boilerplate code as
well as a `Driver` interface that you can implement to provide their custom
business logic:
- [k8s.io/dynamic-resource-allocation/controller](https://github.com/kubernetes/dynamic-resource-allocation/tree/release-1.26/controller)
-->
動態資源分配驅動程序通常由兩個獨立但相互協調的組件組成：
一個集中控制器和一個節點本地 kubelet 插件的 DaemonSet。
集中控制器與調度器協調所需的大部分工作都可以由樣板代碼處理。
只有針對插件所擁有的 ResourceClass 實際分配 ResourceClaim 時所需的業務邏輯才需要自定義。
因此，Kubernetes 提供了以下軟件包，其中包括用於調用此樣板代碼的 API，
以及可以實現自定義業務邏輯的 `Driver` 接口：
- [k8s.io/dynamic-resource-allocation/controller](https://github.com/kubernetes/dynamic-resource-allocation/tree/release-1.26/controller)

<!--
Likewise, boilerplate code can be used to register the node-local plugin with
the kubelet, as well as start a gRPC server to implement the kubelet plugin
API. For drivers written in Go, the following package is recommended:
- [k8s.io/dynamic-resource-allocation/kubeletplugin](https://github.com/kubernetes/dynamic-resource-allocation/tree/release-1.26/kubeletplugin)
-->
同樣，樣板代碼可用於向 kubelet 註冊節點本地插件，
也可以啓動 gRPC 伺服器來實現 kubelet 插件 API。
對於用 Go 編寫的驅動程序，推薦使用以下軟件包：
- [k8s.io/dynamic-resource-allocation/kubeletplugin](https://github.com/kubernetes/dynamic-resource-allocation/tree/release-1.26/kubeletplugin)

<!--
It is up to the driver developer to decide how these two components
communicate. The [KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/3063-dynamic-resource-allocation/README.md) outlines an [approach using
CRDs](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/3063-dynamic-resource-allocation#implementing-a-plugin-for-node-resources).
the KEP outlines an approach using CRDs. 
-->
驅動程序開發人員決定這兩個組件如何通信。
[KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/3063-dynamic-resource-allocation/README.md)
詳細介紹了[使用 CRD 的方法](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/3063-dynamic-resource-allocation#implementing-a-plugin-for-node-resources)。

<!-- 
Within SIG Node, we also plan to provide a complete [example
driver](https://github.com/kubernetes-sigs/dra-example-driver) that can serve
as a template for other drivers.
-->
在 SIG Node 中，我們還計劃提供一個完整的[示例驅動程序](https://github.com/kubernetes-sigs/dra-example-driver)，
它可以當作其他驅動程序的模板。

<!-- 
## Running the test driver
-->
## 運行測試驅動程序 {#running-the-test-driver}

<!--
The following steps bring up a local, one-node cluster directly from the
Kubernetes source code. As a prerequisite, your cluster must have nodes with a container
runtime that supports the
[Container Device Interface](https://github.com/container-orchestrated-devices/container-device-interface) 
(CDI). For example, you can run CRI-O [v1.23.2](https://github.com/cri-o/cri-o/releases/tag/v1.23.2) or later.
Once containerd v1.7.0 is released, we expect that you can run that or any later version.
In the example below, we use CRI-O.
-->
下面的步驟直接使用 Kubernetes 源代碼啓一個本地單節點叢集。
前提是，你的叢集必須具有支持[容器設備接口](https://github.com/container-orchestrated-devices/container-device-interface)
（CDI）的容器運行時。
例如，你可以運行 CRI-O [v1.23.2](https://github.com/cri-o/cri-o/releases/tag/v1.23.2)
或更高版本。containerd v1.7.0 發佈後，我們期望你可以運行該版本或更高版本。
在下面的示例中，我們使用 CRI-O。

<!-- 
First, clone the Kubernetes source code. Inside that directory, run:
-->
首先，克隆 Kubernetes 源代碼。在其目錄中，運行：
```console
$ hack/install-etcd.sh
...

$ RUNTIME_CONFIG=resource.k8s.io/v1alpha1 \
  FEATURE_GATES=DynamicResourceAllocation=true \
  DNS_ADDON="coredns" \
  CGROUP_DRIVER=systemd \
  CONTAINER_RUNTIME_ENDPOINT=unix:///var/run/crio/crio.sock \
  LOG_LEVEL=6 \
  ENABLE_CSI_SNAPSHOTTER=false \
  API_SECURE_PORT=6444 \
  ALLOW_PRIVILEGED=1 \
  PATH=$(pwd)/third_party/etcd:$PATH \
  ./hack/local-up-cluster.sh -O
...
要使用集羣，你可以打開另一個終端/選項卡並運行：
  export KUBECONFIG=/var/run/kubernetes/admin.kubeconfig
...
```

<!-- 
Once the cluster is up, in another
terminal run the test driver controller. `KUBECONFIG` must be set for all of
the following commands.
```console
$ go run ./test/e2e/dra/test-driver --feature-gates ContextualLogging=true -v=5 controller
```

In another terminal, run the kubelet plugin:
```console
$ sudo mkdir -p /var/run/cdi && \
  sudo chmod a+rwx /var/run/cdi /var/lib/kubelet/plugins_registry /var/lib/kubelet/plugins/
$ go run ./test/e2e/dra/test-driver --feature-gates ContextualLogging=true -v=6 kubelet-plugin
```
-->
叢集啓動後，在另一個終端運行測試驅動程序控制器。
必須爲以下所有命令設置 `KUBECONFIG`。
```console
$ go run ./test/e2e/dra/test-driver --feature-gates ContextualLogging=true -v=5 controller
```

在另一個終端中，運行 kubelet 插件：
```console
$ sudo mkdir -p /var/run/cdi && \
  sudo chmod a+rwx /var/run/cdi /var/lib/kubelet/plugins_registry /var/lib/kubelet/plugins/
$ go run ./test/e2e/dra/test-driver --feature-gates ContextualLogging=true -v=6 kubelet-plugin
```

<!-- 
Changing the permissions of the directories makes it possible to run and (when
using delve) debug the kubelet plugin as a normal user, which is convenient
because it uses the already populated Go cache. Remember to restore permissions
with `sudo chmod go-w` when done. Alternatively, you can also build the binary
and run that as root.

Now the cluster is ready to create objects:
-->
更改目錄的權限，這樣可以以普通使用者身份運行和（使用 delve）調試 kubelet 插件，
這很方便，因爲它使用已填充的 Go 緩存。
完成後，記得使用 `sudo chmod go-w` 還原權限。
或者，你也可以構建二進制文件並以 root 身份運行該二進制文件。

現在叢集已準備好創建對象：
```console
$ kubectl create -f test/e2e/dra/test-driver/deploy/example/resourceclass.yaml
resourceclass.resource.k8s.io/example created

$ kubectl create -f test/e2e/dra/test-driver/deploy/example/pod-inline.yaml
configmap/test-inline-claim-parameters created
resourceclaimtemplate.resource.k8s.io/test-inline-claim-template created
pod/test-inline-claim created

$ kubectl get resourceclaims
NAME                         RESOURCECLASSNAME   ALLOCATIONMODE         STATE                AGE
test-inline-claim-resource   example             WaitForFirstConsumer   allocated,reserved   8s

$ kubectl get pods
NAME                READY   STATUS      RESTARTS   AGE
test-inline-claim   0/2     Completed   0          21s
```

<!--
The test driver doesn't do much, it only sets environment variables as defined
in the ConfigMap. The test pod dumps the environment, so the log can be checked
to verify that everything worked:
-->
這個測試驅動程序沒有做什麼事情，
它只是將 ConfigMap 中定義的變量設爲環境變量。
測試 pod 會轉儲環境變量，所以可以檢查日誌以驗證是否正常：
```console
$ kubectl logs test-inline-claim with-resource | grep user_a
user_a='b'
```
<!-- 
## Next steps
 -->
## 下一步 {#next-steps}

<!-- 
- See the
[Dynamic Resource Allocation](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/3063-dynamic-resource-allocation/README.md)
  KEP for more information on the design.
- Read [Dynamic Resource Allocation](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)
  in the official Kubernetes documentation.
- You can participate in
  [SIG Node](https://github.com/kubernetes/community/blob/master/sig-node/README.md)
  and / or the [CNCF Container Orchestrated Device Working Group](https://github.com/cncf/tag-runtime/blob/master/wg/COD.md).
- You can view or comment on the [project board](https://github.com/orgs/kubernetes/projects/95/views/1)
  for dynamic resource allocation.
 - In order to move this feature towards beta, we need feedback from hardware
   vendors, so here's a call to action: try out this feature, consider how it can help
   with problems that your users are having, and write resource drivers…
-->
- 瞭解更多該設計的信息，
  參閱[動態資源分配 KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/3063-dynamic-resource-allocation/README.md)。
- 閱讀 Kubernetes 官方文檔的[動態資源分配](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)。
- 你可以參與 [SIG Node](https://github.com/kubernetes/community/blob/master/sig-node/README.md)
  和 [CNCF 容器編排設備工作組](https://github.com/cncf/tag-runtime/blob/master/wg/COD.md)。
- 你可以查看或評論動態資源分配的[項目看板](https://github.com/orgs/kubernetes/projects/95/views/1)。
- 爲了將該功能向 beta 版本推進，我們需要來自硬件供應商的反饋，
  因此，有一個行動號召：嘗試這個功能，
  考慮它如何有助於解決你的使用者遇到的問題，並編寫資源驅動程序…