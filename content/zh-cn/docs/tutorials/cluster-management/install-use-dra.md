---
title: 安装驱动并使用 DRA 来分配设备
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

<!--
FUTURE MAINTAINERS:
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
This tutorial shows you how to install
{{< glossary_tooltip term_id="dra" text="Dynamic Resource Allocation (DRA)" >}}
drivers in your cluster and how to use them in conjunction with the DRA APIs to allocate
{{< glossary_tooltip text="devices" term_id="device" >}} to Pods.
This page is intended for cluster administrators.
-->
本教程向你展示如何在集群中安装
{{< glossary_tooltip term_id="dra" text="动态资源分配（DRA）" >}}驱动，
以及如何将它们与 DRA API 配合使用，为 Pod 分配
{{< glossary_tooltip text="设备" term_id="device" >}}。
本页面向集群管理员。

<!--
{{< glossary_tooltip text="Dynamic Resource Allocation (DRA)" term_id="dra" >}}
lets a cluster manage availability and allocation of hardware resources to
satisfy Pod-based claims for hardware requirements and preferences. To support
this, a mixture of Kubernetes built-in components (like the Kubernetes
scheduler, kubelet, and kube-controller-manager) and third-party drivers from
device owners (called DRA drivers) share the responsibility to advertise,
allocate, prepare, mount, healthcheck, unprepare, and cleanup resources
throughout the Pod lifecycle. These components share information via a series of
DRA specific APIs in the `resource.k8s.io` API group including
{{< glossary_tooltip text="DeviceClasses" term_id="deviceclass" >}},
{{< glossary_tooltip text="ResourceSlices" term_id="resourceslice" >}},
{{< glossary_tooltip text="ResourceClaims" term_id="resourceclaim" >}}, as well as
new fields in the Pod spec itself.
-->
{{< glossary_tooltip text="动态资源分配（DRA）" term_id="dra" >}}
让集群能够管理硬件资源的可用性与分配，以满足基于 Pod 的硬件需求与偏好申领。
为此，Kubernetes 内置组件（如 Kubernetes 调度器、kubelet 和 kube-controller-manager）
与来自设备所有者的第三方驱动（称为 DRA 驱动）共同承担责任，
在 Pod 的整个生命周期中发布、分配、准备、挂载、健康检查、取消准备和清理资源。
这些组件通过 `resource.k8s.io` API 组中一系列 DRA 专用 API 共享信息，其中包括
{{< glossary_tooltip text="DeviceClasses" term_id="deviceclass" >}}、
{{< glossary_tooltip text="ResourceSlices" term_id="resourceslice" >}}、
{{< glossary_tooltip text="ResourceClaims" term_id="resourceclaim" >}}，
以及 Pod 规约本身新增的字段。

<!-- objectives -->

### {{% heading "objectives" %}}

<!--
* Deploy an example DRA driver
* Deploy a Pod requesting a hardware claim using DRA APIs
* Delete a Pod that has a claim
-->
* 部署一个示例 DRA 驱动
* 使用 DRA API 部署一个请求硬件申领的 Pod
* 删除一个带有申领的 Pod

<!-- prerequisites -->

## {{% heading "prerequisites" %}}

<!--
Your cluster should support [RBAC](/docs/reference/access-authn-authz/rbac/).
You can try this tutorial with a cluster using a different authorization
mechanism, but in that case you will have to adapt the steps around defining
roles and permissions.
-->
你的集群应支持 [RBAC](/zh-cn/docs/reference/access-authn-authz/rbac/)。
你可以在使用不同鉴权机制的集群上尝试本教程，
但在那种情况下，你需要调整定义角色和权限的相关步骤。

{{< include "task-tutorial-prereqs.md" >}}

<!--
This tutorial has been tested with Linux nodes, though it may also work with
other types of nodes.
-->
本教程已在 Linux 节点上测试通过，不过也可能适用于其他类型的节点。

{{< version-check >}}

<!--
If your cluster is not currently running Kubernetes {{< skew currentVersion >}}
then please check the documentation for the version of Kubernetes that you
plan to use.
-->
如果你的集群当前运行的 Kubernetes 版本不是 {{< skew currentVersion >}}，
请查阅你计划使用的 Kubernetes 版本的文档。

<!-- lessoncontent -->

<!--
## Explore the initial cluster state {#explore-initial-state}

You can spend some time to observe the initial state of a cluster with DRA
enabled, especially if you have not used these APIs extensively before. If you
set up a new cluster for this tutorial, with no driver installed and no Pod
claims yet to satisfy, the output of these commands won't show any resources.
-->
## 探索集群的初始状态 {#explore-initial-state}

你可以花一些时间观察启用了 DRA 的集群的初始状态，
尤其是在你此前没有广泛使用过这些 API 的情况下。
如果你为本教程搭建了一个新集群，尚未安装任何驱动，
也没有任何需要满足的 Pod 申领，那么这些命令的输出不会显示任何资源。

<!--
1.  Get a list of {{< glossary_tooltip text="DeviceClasses" term_id="deviceclass" >}}:
-->
1. 获取 {{< glossary_tooltip text="DeviceClasses" term_id="deviceclass" >}} 列表：

   ```shell
   kubectl get deviceclasses
   ```

   <!--
   The output is similar to this:
   -->
   输出类似于：

   ```
   No resources found
   ```

<!--
1.  Get a list of  {{< glossary_tooltip text="ResourceSlices" term_id="resourceslice" >}}:
-->
2. 获取 {{< glossary_tooltip text="ResourceSlices" term_id="resourceslice" >}} 列表：

   ```shell
   kubectl get resourceslices
   ```

   <!--
   The output is similar to this:
   -->
   输出类似于：

   ```
   No resources found
   ```

<!--
1.  Get a list of {{< glossary_tooltip text="ResourceClaims" term_id="resourceclaim" >}} and
    {{< glossary_tooltip text="ResourceClaimTemplates" term_id="resourceclaimtemplate" >}}.
-->
3. 获取 {{< glossary_tooltip text="ResourceClaim" term_id="resourceclaim" >}} 和
   {{< glossary_tooltip text="ResourceClaimTemplate" term_id="resourceclaimtemplate" >}} 列表。

   ```shell
   kubectl get resourceclaims -A
   kubectl get resourceclaimtemplates -A
   ```

   <!--
   The output is similar to this:
   -->
   输出类似于：

   ```
   No resources found
   No resources found
   ```

<!--
At this point, you have confirmed that DRA is enabled and configured properly in
the cluster, and that no DRA drivers have advertised any resources to the DRA
APIs yet.
-->
至此，你已经确认集群中的 DRA 已启用并正确配置，
并且还没有任何 DRA 驱动向 DRA API 发布过任何资源。

<!--
## Install an example DRA driver {#install-example-driver}

DRA drivers are third-party applications that run on each node of your cluster
to interface with the hardware of that node and Kubernetes' built-in DRA
components. The installation procedure depends on the driver you choose, but is
likely deployed as a {{< glossary_tooltip term_id="daemonset" >}} to all or a
selection of the nodes (using {{< glossary_tooltip text="selectors" term_id="selector" >}}
or similar mechanisms) in your cluster.
-->
## 安装示例 DRA 驱动 {#install-example-driver}

DRA 驱动是第三方应用，运行在集群的每个节点上，
与该节点的硬件以及 Kubernetes 内置的 DRA 组件对接。
安装过程取决于你选择的驱动，但通常会以 {{< glossary_tooltip term_id="daemonset" >}}
的形式部署到集群中全部或部分节点
（使用{{< glossary_tooltip text="选择算符" term_id="selector" >}}或类似机制）。

<!--
Check your driver's documentation for specific installation instructions, which
might include a Helm chart, a set of manifests, or other deployment tooling.
-->
具体安装说明请查阅你所选驱动的文档，其中可能包含 Helm Chart、一组清单或其他部署工具。

<!--
This tutorial uses an example driver which can be found in the
[kubernetes-sigs/dra-example-driver](https://github.com/kubernetes-sigs/dra-example-driver)
repository to demonstrate driver installation. This example driver advertises
simulated GPUs to Kubernetes for your Pods to interact with.
-->
本教程使用
[kubernetes-sigs/dra-example-driver](https://github.com/kubernetes-sigs/dra-example-driver)
仓库中的一个示例驱动来演示驱动的安装过程。
该示例驱动向 Kubernetes 发布模拟的 GPU，供你的 Pod 与之交互。

<!--
### Prepare your cluster for driver installation {#prepare-cluster-driver}

To simplify cleanup, create a namespace named dra-tutorial:
-->
### 为驱动安装准备集群 {#prepare-cluster-driver}

为了简化清理操作，创建一个名为 dra-tutorial 的命名空间：

<!--
1.  Create the namespace:
-->
1. 创建命名空间：

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
   在生产环境中，你可能会使用驱动厂商或你自己所在组织此前发布或验证过的镜像，
   并且你的节点需要能够访问托管驱动镜像的镜像仓库。
   在本教程中，你将使用 dra-example-driver 的一个公开发布镜像，
   来模拟访问 DRA 驱动镜像的过程。

<!--
1.  Confirm your nodes have access to the image by running the following
    from within one of your cluster's nodes:
-->
2. 在集群的某个节点上运行以下命令，确认你的节点可以访问该镜像：

   ```shell
   docker pull registry.k8s.io/dra-example-driver/dra-example-driver:v0.2.0
   ```

<!--
### Deploy the DRA driver components {#deploy-the-dra-driver-components}

For this tutorial, you will install the critical example resource driver
components individually with `kubectl`.
-->
### 部署 DRA 驱动组件 {#deploy-the-dra-driver-components}

在本教程中，你将使用 `kubectl` 逐个安装示例资源驱动的关键组件。

<!--
1.  Create the DeviceClass representing the device types this DRA driver
   supports:
-->
1. 创建表示该 DRA 驱动所支持的设备类型的 DeviceClass：

   {{% code_sample language="yaml" file="dra/driver-install/deviceclass.yaml" %}}

   ```shell
   kubectl apply --server-side -f http://k8s.io/examples/dra/driver-install/deviceclass.yaml
   ```

<!--
1.  Create the ServiceAccount, ClusterRole and ClusterRoleBinding that will
    be used by the driver to gain permissions to interact with the Kubernetes API
    on this cluster:
-->
2. 创建驱动将要使用的 ServiceAccount、ClusterRole 和 ClusterRoleBinding，
   以便驱动获得在此集群上与 Kubernetes API 交互所需的权限：

   <!--
   1.  Create the Service Account:
   -->
   1. 创建 ServiceAccount：

      {{% code_sample language="yaml" file="dra/driver-install/serviceaccount.yaml" %}}

      ```shell
      kubectl apply --server-side -f http://k8s.io/examples/dra/driver-install/serviceaccount.yaml
      ```

   <!--
   1.  Create the ClusterRole:
   -->
   2. 创建 ClusterRole：

      {{% code_sample language="yaml" file="dra/driver-install/clusterrole.yaml" %}}

      ```shell
      kubectl apply --server-side -f http://k8s.io/examples/dra/driver-install/clusterrole.yaml
      ```

   <!--
   1.  Create the ClusterRoleBinding:
   -->
   3. 创建 ClusterRoleBinding：

      {{% code_sample language="yaml" file="dra/driver-install/clusterrolebinding.yaml" %}}

      ```shell
      kubectl apply --server-side -f http://k8s.io/examples/dra/driver-install/clusterrolebinding.yaml
      ```

<!--
1.  Create a {{< glossary_tooltip term_id="priority-class" >}} for the DRA
    driver. The PriorityClass prevents preemption of th  DRA driver component,
    which is responsible for important lifecycle operations for Pods with
    claims. Learn more about [pod priority and preemption
    here](/docs/concepts/scheduling-eviction/pod-priority-preemption/).
-->
3. 为 DRA 驱动创建一个 {{< glossary_tooltip term_id="priority-class" >}}。
   该 PriorityClass 可防止 DRA 驱动组件被抢占，
   该组件负责为带有申领的 Pod 执行重要的生命周期操作。进一步了解
   [Pod 优先级和抢占](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/)。

   {{% code_sample language="yaml" file="dra/driver-install/priorityclass.yaml" %}}

   ```shell
   kubectl apply --server-side -f http://k8s.io/examples/dra/driver-install/priorityclass.yaml
   ```

<!--
1.  Deploy the actual DRA driver as a DaemonSet configured to run the example
    driver binary with the permissions provisioned above. The DaemonSet has the
    permissions that you granted to the ServiceAccount in the previous steps.
-->
4. 将实际的 DRA 驱动部署为一个 DaemonSet，
   其配置为使用上面提供的权限运行示例驱动的二进制文件。
   该 DaemonSet 拥有你在前面步骤中授予 ServiceAccount 的权限。

   {{% code_sample language="yaml" file="dra/driver-install/daemonset.yaml" %}}

   ```shell
   kubectl apply --server-side -f http://k8s.io/examples/dra/driver-install/daemonset.yaml
   ```

   <!--
   The DaemonSet is configured with the volume mounts necessary to interact with the underlying
   Container Device Interface (CDI) directory, and to expose its socket to `kubelet` via the
   `kubelet/plugins` directory.
   -->
   该 DaemonSet 配置了与底层容器设备接口（Container Device Interface，CDI）目录交互以及通过
   `kubelet/plugins` 目录向 `kubelet` 暴露其套接字所需的卷挂载。

<!--
### Verify the DRA driver installation {#verify-driver-install}
-->
### 验证 DRA 驱动的安装 {#verify-driver-install}

<!--
1.  Get a list of the Pods of the DRA driver DaemonSet across all worker nodes:
-->
1. 获取所有工作节点上 DRA 驱动 DaemonSet 的 Pod 列表：

   ```shell
   kubectl get pod -l app.kubernetes.io/name=dra-example-driver -n dra-tutorial
   ```

   <!--
   The output is similar to this:
   -->
   输出类似于：

   ```
   NAME                                     READY   STATUS    RESTARTS   AGE
   dra-example-driver-kubeletplugin-4sk2x   1/1     Running   0          13s
   dra-example-driver-kubeletplugin-cttr2   1/1     Running   0          13s
   ```

<!--
1.  The initial responsibility of each node's local DRA driver is to update the
    cluster with what devices are available to Pods on that node, by publishing its
    metadata to the ResourceSlices API. You can check that API to see that each node
    with a driver is advertising the device class it represents.
-->
2. 节点上本地 DRA 驱动的首要职责是将元数据发布到 ResourceSlices API，
   从而让集群了解该节点上有哪些设备可供 Pod 使用。
   你可以查看该 API，确认每个安装了驱动的节点都在发布它所代表的设备类。

   <!--
   Check for available ResourceSlices:
   -->
   查看可用的 ResourceSlices：

   ```shell
   kubectl get resourceslices
   ```

   <!--
   The output is similar to this:
   -->
   输出类似于：

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
至此，你已经成功安装了示例 DRA 驱动，并确认了其初始配置。现在你可以使用 DRA 来调度 Pod 了。

<!--
## Claim resources and deploy a Pod {#claim-resources-pod}

To request resources using DRA, you create ResourceClaims or
ResourceClaimTemplates that define the resources that your Pods need. In the
example driver, a memory capacity attribute is exposed for mock GPU devices.
This section shows you how to use {{< glossary_tooltip term_id="cel" >}} to
express your requirements in a ResourceClaim, select that ResourceClaim in a Pod
specification, and observe the resource allocation.
-->
## 申领资源并部署 Pod {#claim-resources-pod}

要使用 DRA 请求资源，你需要创建 ResourceClaim 或 ResourceClaimTemplate
来定义 Pod 所需的资源。在示例驱动中，为模拟的 GPU 设备暴露了一个内存容量属性。
本节展示如何使用 {{< glossary_tooltip term_id="cel" >}}
在 ResourceClaim 中表达你的需求、在 Pod 规约中选择该 ResourceClaim，
并观察资源的分配情况。

<!--
This tutorial showcases only one basic example of a DRA ResourceClaim. Read
[Dynamic Resource Allocation](/docs/concepts/resource-management/dynamic-resource-allocation/)
to learn more about ResourceClaims.
-->
本教程只展示了一个 DRA ResourceClaim 的基本示例。
阅读[动态资源分配](/zh-cn/docs/concepts/resource-management/dynamic-resource-allocation/)了解更多关于
ResourceClaim 的信息。

<!--
### Create the ResourceClaim {#create-the-resourceclaim}

In this section, you create a ResourceClaim and reference it in a Pod. Whatever
the claim, the `deviceClassName` is a required field, narrowing down the scope
of the request to a specific device class. The request itself can include a
{{< glossary_tooltip term_id="cel" >}} expression that references attributes that
may be advertised by the driver managing that device class.
-->
### 创建 ResourceClaim {#create-the-resourceclaim}

本节中，你将创建一个 ResourceClaim 并在 Pod 中引用它。
无论申领内容如何，`deviceClassName` 都是必填字段，用于将请求范围缩小到特定的设备类。
请求本身可以包含 {{< glossary_tooltip term_id="cel" >}} 表达式，
引用管理该设备类的驱动可能发布的属性。

<!--
In this example, you will create a request for any GPU advertising over 10Gi
memory capacity. The attribute exposing capacity from the example driver takes
the form `device.capacity['gpu.example.com'].memory`. Note also that the name of
the claim is set to `some-gpu`.
-->
在本示例中，你将创建一个请求，要求所获取的 GPU 发布的内存容量超过 10Gi。
示例驱动暴露容量的属性形式为 `device.capacity['gpu.example.com'].memory`。
另请注意，该申领的名称被设置为 `some-gpu`。

{{% code_sample language="yaml" file="dra/driver-install/example/resourceclaim.yaml" %}}

```shell
kubectl apply --server-side -f http://k8s.io/examples/dra/driver-install/example/resourceclaim.yaml
```

<!--
### Create the Pod that references that ResourceClaim {#create-the-pod-that-references-that-resourceclaim}

Below is the Pod manifest referencing the ResourceClaim you just made,
`some-gpu`, in the `spec.resourceClaims.resourceClaimName` field. The local name
for that claim, `gpu`, is then used in the
`spec.containers.resources.claims.name` field to allocate the claim to the Pod's
underlying container.
-->
### 创建引用该 ResourceClaim 的 Pod {#create-the-pod-that-references-that-resourceclaim}

下面是你刚刚创建的 ResourceClaim `some-gpu` 的 Pod 清单，
它在 `spec.resourceClaims.resourceClaimName` 字段中引用该申领。
该申领的本地名称 `gpu` 随后用于 `spec.containers.resources.claims.name` 字段，
以便将该申领分配给 Pod 底层的容器。

{{% code_sample language="yaml" file="dra/driver-install/example/pod.yaml" %}}

```shell
kubectl apply --server-side -f http://k8s.io/examples/dra/driver-install/example/pod.yaml
```

<!--
Confirm the pod has deployed:
-->
确认 Pod 已部署：

```shell
kubectl get pod pod0 -n dra-tutorial
```

<!--
The output is similar to this:
-->
输出类似于：

```
NAME   READY   STATUS    RESTARTS   AGE
pod0   1/1     Running   0          9s
```

<!--
### Explore the DRA state {#explore-the-dra-state}

After you create the Pod, the cluster tries to schedule that Pod to a node where
Kubernetes can satisfy the ResourceClaim. In this tutorial, the DRA driver is
deployed on all nodes, and is advertising mock GPUs on all nodes, all of which
have enough capacity advertised to satisfy the Pod's claim, so Kubernetes can
schedule this Pod on any node and can allocate any of the mock GPUs on that
node.
-->
### 探索 DRA 状态 {#explore-the-dra-state}

创建 Pod 后，集群会尝试将该 Pod 调度到 Kubernetes 能够满足该 ResourceClaim 的节点上。
在本教程中，DRA 驱动部署在所有节点上，并在所有节点上发布模拟 GPU，
这些节点发布的容量都足以满足该 Pod 的申领，
因此 Kubernetes 可以把此 Pod 调度到任意节点，并分配该节点上的任意一个模拟 GPU。

<!--
When Kubernetes allocates a mock GPU to a Pod, the example driver adds
environment variables in each container it is allocated to in order to indicate
which GPUs _would_ have been injected into them by a real resource driver and
how they would have been configured, so you can check those environment
variables to see how the Pods have been handled by the system.
-->
当 Kubernetes 为一个 Pod 分配模拟 GPU 时，
示例驱动会在该 GPU 被分配到的每个容器中添加环境变量，
以指明真实的资源驱动**本会**向这些容器注入哪些 GPU，以及本会如何配置它们。
因此你可以查看这些环境变量，了解系统是如何处理这些 Pod 的。

<!--
1.  Check the Pod logs, which report the name of the mock GPU that was allocated:
-->
1. 查看 Pod 日志，其中报告了所分配的模拟 GPU 的名称：

   ```shell
   kubectl logs pod0 -c ctr0 -n dra-tutorial | grep -E "GPU_DEVICE_[0-9]+=" | grep -v "RESOURCE_CLAIM"
   ```

   <!--
   The output is similar to this:
   -->
   输出类似于：

   ```
   declare -x GPU_DEVICE_0="gpu-0"
   ```

<!--
1.  Check the state of the ResourceClaim object:
-->
2. 查看 ResourceClaim 对象的状态：

   ```shell
   kubectl get resourceclaims -n dra-tutorial
   ```

   <!--
   The output is similar to this:
   -->
   输出类似于：

   ```
   NAME       STATE                AGE
   some-gpu   allocated,reserved   34s
   ```

   <!--
   In this output, the `STATE` column shows that the ResourceClaim is allocated
   and reserved.
   -->
   在此输出中，`STATE` 列显示该 ResourceClaim 已被分配并预留。

<!--
1.  Check the details of the `some-gpu` ResourceClaim. The `status` stanza of
    the ResourceClaim has information about the allocated device and the Pod it
    has been reserved for:
-->
3. 查看 `some-gpu` ResourceClaim 的详细信息。
   ResourceClaim 的 `status` 部分包含已分配设备以及为其预留的 Pod 的信息：

   ```shell
   kubectl get resourceclaim some-gpu -n dra-tutorial -o yaml
   ```

   <!--
   The output is similar to this:
   -->
   输出类似于：

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

<!--
1.  To check how the driver handled device allocation, get the logs for the
    driver DaemonSet Pods:
-->
4. 要查看驱动如何处理设备分配，获取驱动 DaemonSet Pod 的日志：

   ```shell
   kubectl logs -l app.kubernetes.io/name=dra-example-driver -n dra-tutorial
   ```

   <!--
   The output is similar to this:
   -->
   输出类似于：

   ```
   I0820 18:17:44.131324       1 driver.go:106] PrepareResourceClaims is called: number of claims: 1
   I0820 18:17:44.135056       1 driver.go:133] Returning newly prepared devices for claim 'd3e48dbf-40da-47c3-a7b9-f7d54d1051c3': [{[some-gpu] kind-worker gpu-0 [k8s.gpu.example.com/gpu=common k8s.gpu.example.com/gpu=d3e48dbf-40da-47c3-a7b9-f7d54d1051c3-gpu-0]}]
   ```

<!--
You have now successfully deployed a Pod that claims devices using DRA, verified
that the Pod was scheduled to an appropriate node, and saw that the associated
DRA APIs kinds were updated with the allocation status.
-->
现在你已经成功部署了一个使用 DRA 申领设备的 Pod，
验证了该 Pod 被调度到合适的节点，
并看到了相关的 DRA API 资源类型已更新为分配状态。

<!--
## Delete a Pod that has a claim {#delete-pod-claim}

When a Pod with a claim is deleted, the DRA driver deallocates the resource so
it can be available for future scheduling. To validate this behavior, delete the
Pod that you created in the previous steps and watch the corresponding changes
to the ResourceClaim and driver.
-->
## 删除带有申领的 Pod {#delete-pod-claim}

删除带有申领的 Pod 时，DRA 驱动会释放相应资源，
使其可供将来的调度使用。要验证这一行为，
请删除前面步骤中创建的 Pod，并观察 ResourceClaim 和驱动的相应变化。

<!--
Delete the `pod0` Pod:
-->
删除 `pod0` Pod：

```shell
kubectl delete pod pod0 -n dra-tutorial
```

<!--
The output is similar to this:
-->
输出类似于：

```
pod "pod0" deleted
```

<!--
### Observe the DRA state {#observe-the-dra-state}

When the Pod is deleted, the driver deallocates the device from the
ResourceClaim and updates the ResourceClaim resource in the Kubernetes API. The
ResourceClaim has a `pending` state until it's referenced in a new Pod.
-->
### 观察 DRA 状态 {#observe-the-dra-state}

Pod 被删除后，驱动会从 ResourceClaim 中释放该设备，
并更新 Kubernetes API 中的 ResourceClaim 资源。
在新的 Pod 引用该 ResourceClaim 之前，它处于 `pending` 状态。

<!--
1.  Check the state of the `some-gpu` ResourceClaim:
-->
1. 查看 `some-gpu` ResourceClaim 的状态：

   ```shell
   kubectl get resourceclaims -n dra-tutorial
   ```

   <!--
   The output is similar to this:
   -->
   输出类似于：

   ```
   NAME       STATE     AGE
   some-gpu   pending   76s
   ```

<!--
1.  Verify that the driver has processed unpreparing the device for this claim by
   checking the driver logs:
-->
2. 通过查看驱动日志，验证驱动已处理该申领的设备取消准备操作：

   ```shell
   kubectl logs -l app.kubernetes.io/name=dra-example-driver -n dra-tutorial
   ```

   <!--
   The output is similar to this:
   -->
   输出类似于：

   ```
   I0820 18:22:15.629376       1 driver.go:138] UnprepareResourceClaims is called: number of claims: 1
   ```

<!--
You have now deleted a Pod that had a claim, and observed that the driver took
action to unprepare the underlying hardware resource and update the DRA APIs to
reflect that the resource is available again for future scheduling.
-->
现在你已经删除了一个带有申领的 Pod，并观察到驱动采取了操作来取消准备底层硬件资源，
同时更新 DRA API 以反映该资源已重新可用于将来的调度。

## {{% heading "cleanup" %}}

<!--
To clean up the resources that you created in this tutorial, follow these steps:
-->
要清理本教程中创建的资源，请执行以下步骤：

```shell
kubectl delete namespace dra-tutorial
kubectl delete deviceclass gpu.example.com
kubectl delete clusterrole dra-example-driver-role
kubectl delete clusterrolebinding dra-example-driver-role-binding
kubectl delete priorityclass dra-driver-high-priority
```

## {{% heading "whatsnext" %}}

<!--
* [Learn more about DRA](/docs/concepts/resource-management/dynamic-resource-allocation/)
* [Allocate Devices to Workloads with DRA](/docs/tasks/configure-pod-container/assign-resources/allocate-devices-dra)
-->
* [进一步了解 DRA](/zh-cn/docs/concepts/resource-management/dynamic-resource-allocation/)
* [使用 DRA 为工作负载分配设备](/zh-cn/docs/tasks/configure-pod-container/assign-resources/allocate-devices-dra/)
