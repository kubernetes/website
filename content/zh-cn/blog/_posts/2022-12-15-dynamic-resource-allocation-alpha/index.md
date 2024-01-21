---
layout: blog
title: "Kubernetes 1.26: 动态资源分配 Alpha API"
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

**译者：** 空桐

<!-- 
Dynamic resource allocation is a new API for requesting resources. It is a
generalization of the persistent volumes API for generic resources, making it possible to:

- access the same resource instance in different pods and containers,
- attach arbitrary constraints to a resource request to get the exact resource
  you are looking for,
- initialize a resource according to parameters provided by the user.
-->
动态资源分配是一个用于请求资源的新 API。
它是对为通用资源所提供的持久卷 API 的泛化。它可以：

- 在不同的 pod 和容器中访问相同的资源实例，
- 将任意约束附加到资源请求以获取你正在寻找的确切资源，
- 通过用户提供的参数初始化资源。

<!-- 
Third-party resource drivers are responsible for interpreting these parameters
as well as tracking and allocating resources as requests come in.
-->
第三方资源驱动程序负责解释这些参数，并在资源请求到来时跟踪和分配资源。

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
动态资源分配是一个 **alpha 特性**，只有在启用 `DynamicResourceAllocation`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
和 `resource.k8s.io/v1alpha1` {{< glossary_tooltip text="API 组"
term_id="api-group" >}} 时才启用。
有关详细信息，参阅 `--feature-gates` 和 `--runtime-config`
[kube-apiserver 参数](/zh-cn/docs/reference/command-line-tools-reference/kube-apiserver/)。
kube-scheduler、kube-controller-manager 和 kubelet 也需要设置该特性门控。

<!-- 
The default configuration of kube-scheduler enables the `DynamicResources`
plugin if and only if the feature gate is enabled. Custom configurations may
have to be modified to include it.
-->
kube-scheduler 的默认配置仅在启用特性门控时才启用 `DynamicResources` 插件。
自定义配置可能需要被修改才能启用它。

<!-- 
Once dynamic resource allocation is enabled, resource drivers can be installed
to manage certain kinds of hardware. Kubernetes has a test driver that is used
for end-to-end testing, but also can be run manually. See
[below](#running-the-test-driver) for step-by-step instructions.
-->
一旦启用动态资源分配，就可以安装资源驱动程序来管理某些类型的硬件。
Kubernetes 有一个用于端到端测试的测试驱动程序，但也可以手动运行。
逐步说明参见[下文](#running-the-test-driver)。

<!--
## API
-->
## API

<!--
The new `resource.k8s.io/v1alpha1` {{< glossary_tooltip text="API group"
term_id="api-group" >}} provides four new types: 
-->
新的 `resource.k8s.io/v1alpha1`
{{< glossary_tooltip text="API 组" term_id="api-group" >}}提供了四种新类型：

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
: 定义由哪个资源驱动程序处理哪种资源，并为其提供通用参数。
  在安装资源驱动程序时，由集群管理员创建 ResourceClass。

ResourceClaim
: 定义工作负载所需的特定资源实例。
  由用户创建（手动管理生命周期，可以在不同的 Pod 之间共享），
  或者由控制平面基于 ResourceClaimTemplate 为特定 Pod 创建
  （自动管理生命周期，通常仅由一个 Pod 使用）。

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
: 定义用于创建 ResourceClaim 的 spec 和一些元数据。
  部署工作负载时由用户创建。

PodScheduling
: 供控制平面和资源驱动程序内部使用，
  在需要为 Pod 分配 ResourceClaim 时协调 Pod 调度。

<!--
Parameters for ResourceClass and ResourceClaim are stored in separate objects,
typically using the type defined by a {{< glossary_tooltip
term_id="CustomResourceDefinition" text="CRD" >}} that was created when
installing a resource driver.
-->
ResourceClass 和 ResourceClaim 的参数存储在单独的对象中，
通常使用安装资源驱动程序时创建的 {{< glossary_tooltip
term_id="CustomResourceDefinition" text="CRD" >}} 所定义的类型。

<!--
With this alpha feature enabled, the `spec` of Pod defines ResourceClaims that are needed for a Pod
to run: this information goes into a new
`resourceClaims` field. Entries in that list reference either a ResourceClaim
or a ResourceClaimTemplate. When referencing a ResourceClaim, all Pods using
this `.spec` (for example, inside a Deployment or StatefulSet) share the same
ResourceClaim instance. When referencing a ResourceClaimTemplate, each Pod gets
its own ResourceClaim instance.
-->
启用此 Alpha 特性后，Pod 的 `spec` 定义 Pod 运行所需的 ResourceClaim：
此信息放入新的 `resourceClaims` 字段。
该列表中的条目引用 ResourceClaim 或 ResourceClaimTemplate。
当引用 ResourceClaim 时，使用此 `.spec` 的所有 Pod
（例如 Deployment 或 StatefulSet 中的 Pod）共享相同的 ResourceClaim 实例。
引用 ResourceClaimTemplate 时，每个 Pod 都有自己的实例。

<!--
For a container defined within a Pod, the  `resources.claims` list 
defines whether that container gets
access to these resource instances, which makes it possible to share resources
between one or more containers inside the same Pod. For example, an init container could
set up the resource before the application uses it.
-->
对于 Pod 中定义的容器，`resources.claims` 列表定义该容器可以访问的资源实例，
从而可以在同一 Pod 中的一个或多个容器之间共享资源。
例如，init 容器可以在应用程序使用资源之前设置资源。

<!-- 
Here is an example of a fictional resource driver. Two ResourceClaim objects
will get created for this Pod and each container gets access to one of them.

Assuming a resource driver called `resource-driver.example.com` was installed
together with the following resource class:
-->
下面是一个虚构的资源驱动程序的示例。
此 Pod 将创建两个 ResourceClaim 对象，每个容器都可以访问其中一个。

假设已安装名为 `resource-driver.example.com` 的资源驱动程序和以下资源类：
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
这样，终端用户可以按如下方式分配两个类型为
`resource.example.com` 的特定资源：
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
  containers: # 两个示例容器；每个容器申领一个 cat 资源
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
## 调度 {#scheduling}

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
与原生资源（CPU、RAM）和[扩展资源](/zh-cn/docs/concepts/configuration/manage-resources-containers/#extended-resources)
（由设备插件管理，并由 kubelet 公布）不同，调度器不知道集群中有哪些动态资源，
也不知道如何将它们拆分以满足特定 ResourceClaim 的要求。
资源驱动程序负责这些任务。
资源驱动程序在为 ResourceClaim 保留资源后将其标记为**已分配（Allocated）**。
然后告诉调度器集群中可用的 ResourceClaim 的位置。

<!--
ResourceClaims can get resources allocated as soon as the ResourceClaim
is created (_immediate allocation_), without considering which Pods will use
the resource. The default (_wait for first consumer_) is to delay allocation until
a Pod that relies on the ResourceClaim becomes eligible for scheduling.
This design with two allocation options is similar to how Kubernetes handles
storage provisioning with PersistentVolumes and PersistentVolumeClaims.
-->
ResourceClaim 可以在创建时就进行分配（**立即分配**），不用考虑哪些 Pod 将使用该资源。
默认情况下采用延迟分配（**等待第一个消费者**），
直到依赖于 ResourceClaim 的 Pod 有资格调度时再进行分配。
这种两种分配选项的设计与 Kubernetes 处理 PersistentVolume 和
PersistentVolumeClaim 供应的存储类似。

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
在等待第一个消费者模式下，调度器检查 Pod 所需的所有 ResourceClaim。
如果 Pod 有 ResourceClaim，则调度器会创建一个 PodScheduling
对象（一种特殊对象，代表 Pod 请求调度详细信息）。
PodScheduling 的名称和命名空间与 Pod 相同，Pod 是它的所有者。
调度器使用 PodScheduling 通知负责这些 ResourceClaim
的资源驱动程序，告知它们调度器认为适合该 Pod 的节点。
资源驱动程序通过排除没有足够剩余资源的节点来响应调度器。

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
一旦调度器有了资源信息，它就会选择一个节点，并将该选择存储在 PodScheduling 对象中。
然后，资源驱动程序分配其 ResourceClaim，以便资源可用于选中的节点。
一旦完成资源分配，调度器尝试将 Pod 调度到合适的节点。这时候调度仍然可能失败；
例如，不同的 Pod 可能同时被调度到同一个节点。如果发生这种情况，已分配的
ResourceClaim 可能会被取消分配，从而让 Pod 可以被调度到不同的节点。

<!--
As part of this process, ResourceClaims also get reserved for the
Pod. Currently ResourceClaims can either be used exclusively by a single Pod or
an unlimited number of Pods. 
-->
作为此过程的一部分，ResourceClaim 会为 Pod 保留。
目前，ResourceClaim 可以由单个 Pod 独占使用或不限数量的多个 Pod 使用。

<!--
One key feature is that Pods do not get scheduled to a node unless all of
their resources are allocated and reserved. This avoids the scenario where
a Pod gets scheduled onto one node and then cannot run there, which is bad
because such a pending Pod also blocks all other resources like RAM or CPU that were
set aside for it.
-->
除非 Pod 的所有资源都已分配和保留，否则 Pod 不会被调度到节点，这是一个重要特性。
这避免了 Pod 被调度到一个节点但无法在那里运行的情况，
这种情况很糟糕，因为被挂起 Pod 也会阻塞为其保留的其他资源，如 RAM 或 CPU。

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
调度器插件必须参与调度那些使用 ResourceClaim 的 Pod。
通过设置 `nodeName` 字段绕过调度器会导致 kubelet 拒绝启动 Pod，
因为 ResourceClaim 没有被保留或甚至根本没有被分配。
未来可能去除此[限制](https://github.com/kubernetes/kubernetes/issues/114005)。

<!--
## Writing a resource driver
-->
## 编写资源驱动程序 {#writing-a-resource-driver}

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
动态资源分配驱动程序通常由两个独立但相互协调的组件组成：
一个集中控制器和一个节点本地 kubelet 插件的 DaemonSet。
集中控制器与调度器协调所需的大部分工作都可以由样板代码处理。
只有针对插件所拥有的 ResourceClass 实际分配 ResourceClaim 时所需的业务逻辑才需要自定义。
因此，Kubernetes 提供了以下软件包，其中包括用于调用此样板代码的 API，
以及可以实现自定义业务逻辑的 `Driver` 接口：
- [k8s.io/dynamic-resource-allocation/controller](https://github.com/kubernetes/dynamic-resource-allocation/tree/release-1.26/controller)

<!--
Likewise, boilerplate code can be used to register the node-local plugin with
the kubelet, as well as start a gRPC server to implement the kubelet plugin
API. For drivers written in Go, the following package is recommended:
- [k8s.io/dynamic-resource-allocation/kubeletplugin](https://github.com/kubernetes/dynamic-resource-allocation/tree/release-1.26/kubeletplugin)
-->
同样，样板代码可用于向 kubelet 注册节点本地插件，
也可以启动 gRPC 服务器来实现 kubelet 插件 API。
对于用 Go 编写的驱动程序，推荐使用以下软件包：
- [k8s.io/dynamic-resource-allocation/kubeletplugin](https://github.com/kubernetes/dynamic-resource-allocation/tree/release-1.26/kubeletplugin)

<!--
It is up to the driver developer to decide how these two components
communicate. The [KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/3063-dynamic-resource-allocation/README.md) outlines an [approach using
CRDs](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/3063-dynamic-resource-allocation#implementing-a-plugin-for-node-resources).
the KEP outlines an approach using CRDs. 
-->
驱动程序开发人员决定这两个组件如何通信。
[KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/3063-dynamic-resource-allocation/README.md)
详细介绍了[使用 CRD 的方法](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/3063-dynamic-resource-allocation#implementing-a-plugin-for-node-resources)。

<!-- 
Within SIG Node, we also plan to provide a complete [example
driver](https://github.com/kubernetes-sigs/dra-example-driver) that can serve
as a template for other drivers.
-->
在 SIG Node 中，我们还计划提供一个完整的[示例驱动程序](https://github.com/kubernetes-sigs/dra-example-driver)，
它可以当作其他驱动程序的模板。

<!-- 
## Running the test driver
-->
## 运行测试驱动程序 {#running-the-test-driver}

<!--
The following steps bring up a local, one-node cluster directly from the
Kubernetes source code. As a prerequisite, your cluster must have nodes with a container
runtime that supports the
[Container Device Interface](https://github.com/container-orchestrated-devices/container-device-interface) 
(CDI). For example, you can run CRI-O [v1.23.2](https://github.com/cri-o/cri-o/releases/tag/v1.23.2) or later.
Once containerd v1.7.0 is released, we expect that you can run that or any later version.
In the example below, we use CRI-O.
-->
下面的步骤直接使用 Kubernetes 源代码启一个本地单节点集群。
前提是，你的集群必须具有支持[容器设备接口](https://github.com/container-orchestrated-devices/container-device-interface)
（CDI）的容器运行时。
例如，你可以运行 CRI-O [v1.23.2](https://github.com/cri-o/cri-o/releases/tag/v1.23.2)
或更高版本。containerd v1.7.0 发布后，我们期望你可以运行该版本或更高版本。
在下面的示例中，我们使用 CRI-O。

<!-- 
First, clone the Kubernetes source code. Inside that directory, run:
-->
首先，克隆 Kubernetes 源代码。在其目录中，运行：
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
要使用集群，你可以打开另一个终端/选项卡并运行：
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
集群启动后，在另一个终端运行测试驱动程序控制器。
必须为以下所有命令设置 `KUBECONFIG`。
```console
$ go run ./test/e2e/dra/test-driver --feature-gates ContextualLogging=true -v=5 controller
```

在另一个终端中，运行 kubelet 插件：
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
更改目录的权限，这样可以以普通用户身份运行和（使用 delve）调试 kubelet 插件，
这很方便，因为它使用已填充的 Go 缓存。
完成后，记得使用 `sudo chmod go-w` 还原权限。
或者，你也可以构建二进制文件并以 root 身份运行该二进制文件。

现在集群已准备好创建对象：
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
这个测试驱动程序没有做什么事情，
它只是将 ConfigMap 中定义的变量设为环境变量。
测试 pod 会转储环境变量，所以可以检查日志以验证是否正常：
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
- 了解更多该设计的信息，
  参阅[动态资源分配 KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/3063-dynamic-resource-allocation/README.md)。
- 阅读 Kubernetes 官方文档的[动态资源分配](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)。
- 你可以参与 [SIG Node](https://github.com/kubernetes/community/blob/master/sig-node/README.md)
  和 [CNCF 容器编排设备工作组](https://github.com/cncf/tag-runtime/blob/master/wg/COD.md)。
- 你可以查看或评论动态资源分配的[项目看板](https://github.com/orgs/kubernetes/projects/95/views/1)。
- 为了将该功能向 beta 版本推进，我们需要来自硬件供应商的反馈，
  因此，有一个行动号召：尝试这个功能，
  考虑它如何有助于解决你的用户遇到的问题，并编写资源驱动程序…