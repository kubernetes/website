---
layout: blog
title: "云控制器管理器（Cloud Controller Manager）'鸡与蛋'的问题"
date: 2025-02-14
slug: cloud-controller-manager-chicken-egg-problem
author: >
  Antonio Ojea,
  Michael McCune
---
<!--
layout: blog
title: "The Cloud Controller Manager Chicken and Egg Problem"
date: 2025-02-14
slug: cloud-controller-manager-chicken-egg-problem
author: >
  Antonio Ojea,
  Michael McCune
-->

<!--
Kubernetes 1.31
[completed the largest migration in Kubernetes history][migration-blog], removing the in-tree
cloud provider.  While the component migration is now done, this leaves some additional
complexity for users and installer projects (for example, kOps or Cluster API) .  We will go
over those additional steps and failure points and make recommendations for cluster owners.
This migration was complex and some logic had to be extracted from the core components,
building four new subsystems.
-->
Kubernetes 1.31  
[完成了 Kubernetes 历史上最大的迁移][migration-blog]，移除了树内云驱动（in-tree cloud provider）。
虽然组件迁移已经完成，但这为用户和安装项目（例如 kOps 或 Cluster API）带来了一些额外的复杂性。
我们将回顾这些额外的步骤和可能的故障点，并为集群所有者提供改进建议。  
此次迁移非常复杂，必须从核心组件中提取部分逻辑，构建四个新的子系统。

<!--
1. **Cloud controller manager** ([KEP-2392][kep2392])
2. **API server network proxy** ([KEP-1281][kep1281])
3. **kubelet credential provider plugins** ([KEP-2133][kep2133])
4. **Storage migration to use [CSI][csi]** ([KEP-625][kep625])

The [cloud controller manager is part of the control plane][ccm]. It is a critical component
that replaces some functionality that existed previously in the kube-controller-manager and the
kubelet.
-->
1. **云控制器管理器** ([KEP-2392][kep2392])  
2. **API 服务器网络代理** ([KEP-1281][kep1281])  
3. **kubelet 凭证提供程序插件** ([KEP-2133][kep2133])  
4. **存储迁移到使用 [CSI][csi]** ([KEP-625][kep625])  

[云控制器管理器是控制平面的一部分][ccm]。这是一个关键组件，替换了之前存在于 kube-controller-manager
和 kubelet 中的某些特性。

<!--
{{< figure
    src="/images/docs/components-of-kubernetes.svg"
    alt="Components of Kubernetes"
    caption="Components of Kubernetes"
>}}
-->
{{< figure
    src="/images/docs/components-of-kubernetes.svg"
    alt="Kubernetes 组件"
    caption="Kubernetes 组件"
>}}

<!--
One of the most critical functionalities of the cloud controller manager is the node controller,
which is responsible for the initialization of the nodes.

As you can see in the following diagram, when the **kubelet** starts, it registers the Node
object with the apiserver, Tainting the node so it can be processed first by the
cloud-controller-manager. The initial Node is missing the cloud-provider specific information,
like the Node Addresses and the Labels with the cloud provider specific information like the
Node, Region and Instance type information.
-->
云控制器管理器最重要的功能之一是节点控制器，它负责节点的初始化。

从下图可以看出，当 **kubelet** 启动时，它会向 apiserver 注册 Node 对象，并对节点设置污点，
以便云控制器管理器可以先处理该节点。初始的 Node 缺少与云提供商相关的信息，
例如节点地址和包含云提供商特定信息的标签，如节点、区域和实例类型信息。

<!--
{{< figure
    src="ccm-chicken-egg-problem-sequence-diagram.svg"
    alt="Chicken and egg problem sequence diagram"
    caption="Chicken and egg problem sequence diagram"
    class="diagram-medium"
>}}
-->
{{< figure
    src="ccm-chicken-egg-problem-sequence-diagram.svg"
    alt="鸡和蛋问题时序图"
    caption="鸡和蛋问题时序图"
    class="diagram-medium"
>}}

<!--
This new initialization process adds some latency to the node readiness. Previously, the kubelet
was able to initialize the node at the same time it created the node. Since the logic has moved
to the cloud-controller-manager, this can cause a [chicken and egg problem][chicken-and-egg]
during the cluster bootstrapping for those Kubernetes architectures that do not deploy the
controller manager as the other components of the control plane, commonly as static pods,
standalone binaries or daemonsets/deployments with tolerations to the taints and using
`hostNetwork` (more on this below)
-->
这一新的初始化过程会增加节点就绪的延迟。以前，kubelet 可以在创建节点的同时初始化节点。
对于某些 Kubernetes 架构而言，其控制平面其他组件以静态 Pod、独立二进制文件或具有容忍污点功能的、
用 `hostNetwork` DaemonSet/Deployment 部署，由于节点初始化逻辑已移至云控制管理器中，
如果不将控制器管理器作为控制平面的一部分，则可能会导致集群引导过程中出现[鸡和蛋问题][chicken-and-egg]（更多内容见下文）。

<!--
## Examples of the dependency problem

As noted above, it is possible during bootstrapping for the cloud-controller-manager to be
unschedulable and as such the cluster will not initialize properly. The following are a few
concrete examples of how this problem can be expressed and the root causes for why they might
occur.

These examples assume you are running your cloud-controller-manager using a Kubernetes resource
(e.g. Deployment, DaemonSet, or similar) to control its lifecycle. Because these methods
rely on Kubernetes to schedule the cloud-controller-manager, care must be taken to ensure it
will schedule properly.
-->
## 依赖问题的示例

如上所述，在引导过程中，云控制器管理器可能无法被调度，
因此集群将无法正确初始化。以下几个具体示例说明此问题的可能表现形式及其根本原因。

这些示例假设你使用 Kubernetes 资源（例如 Deployment、DaemonSet 或类似资源）来控制
云控制器管理器的生命周期。由于这些方法依赖于 Kubernetes 来调度云控制器管理器，
因此必须确保其能够正确调度。

<!--
### Example: Cloud controller manager not scheduling due to uninitialized taint

As [noted in the Kubernetes documentation][kubedocs0], when the kubelet is started with the command line
flag `--cloud-provider=external`, its corresponding `Node` object will have a no schedule taint
named `node.cloudprovider.kubernetes.io/uninitialized` added. Because the cloud-controller-manager
is responsible for removing the no schedule taint, this can create a situation where a
cloud-controller-manager that is being managed by a Kubernetes resource, such as a `Deployment`
or `DaemonSet`, may not be able to schedule.
-->
### 示例：由于未初始化的污点导致云控制器管理器无法调度

如 [Kubernetes 文档中所述][kubedocs0]，当 kubelet 使用命令行标志 `--cloud-provider=external`
启动时，其对应的 `Node` 对象将添加一个名为 `node.cloudprovider.kubernetes.io/uninitialized`
的不可调度污点。由于云控制器管理器负责移除该不可调度污点，这可能会导致由某个 Kubernetes
资源（例如 `Deployment` 或 `DaemonSet`）管理的云控制器管理器无法被调度的情况。

<!--
If the cloud-controller-manager is not able to be scheduled during the initialization of the
control plane, then the resulting `Node` objects will all have the
`node.cloudprovider.kubernetes.io/uninitialized` no schedule taint. It also means that this taint
will not be removed as the cloud-controller-manager is responsible for its removal. If the no
schedule taint is not removed, then critical workloads, such as the container network interface
controllers, will not be able to schedule, and the cluster will be left in an unhealthy state.
-->
如果在控制平面初始化期间云控制器管理器无法被调度，那么生成的 `Node` 对象将全部带有
`node.cloudprovider.kubernetes.io/uninitialized` 不可调度污点。这也意味着该污点不会被移除，
因为云控制器管理器负责其移除工作。如果不可调度污点未被移除，关键工作负载（例如容器网络接口控制器）
将无法被调度，集群将处于不健康状态。

<!--
### Example: Cloud controller manager not scheduling due to not-ready taint

The next example would be possible in situations where the container network interface (CNI) is
waiting for IP address information from the cloud-controller-manager (CCM), and the CCM has not
tolerated the taint which would be removed by the CNI.

The [Kubernetes documentation describes][kubedocs1] the `node.kubernetes.io/not-ready` taint as follows:

> "The Node controller detects whether a Node is ready by monitoring its health and adds or removes this taint accordingly."
-->
### 示例：由于未就绪污点导致云控制器管理器无法调度

下一个示例可能出现在容器网络接口（CNI）正在等待来自云控制器管理器（CCM）的
IP 地址信息，而 CCM 未容忍将由 CNI 移除的污点的情况下。

[Kubernetes 文档][kubedocs1] 对 `node.kubernetes.io/not-ready` 污点的描述如下：

> "节点控制器通过监控节点的健康状态来检测节点是否已准备好，并据此添加或移除此污点。"

<!--
One of the conditions that can lead to a Node resource having this taint is when the container
network has not yet been initialized on that node. As the cloud-controller-manager is responsible
for adding the IP addresses to a Node resource, and the IP addresses are needed by the container
network controllers to properly configure the container network, it is possible in some
circumstances for a node to become stuck as not ready and uninitialized permanently.

This situation occurs for a similar reason as the first example, although in this case, the
`node.kubernetes.io/not-ready` taint is used with the no execute effect and thus will cause the
cloud-controller-manager not to run on the node with the taint. If the cloud-controller-manager is
not able to execute, then it will not initialize the node. It will cascade into the container
network controllers not being able to run properly, and the node will end up carrying both the
`node.cloudprovider.kubernetes.io/uninitialized` and `node.kubernetes.io/not-ready` taints,
leaving the cluster in an unhealthy state.
-->
当容器网络尚未在某节点上初始化时，可能导致 Node 资源具有此污点。由于云控制器管理器负责为
Node 资源添加 IP 地址，而容器网络控制器需要这些 IP 地址来正确配置容器网络，因此在某些情况下，
节点可能会永久处于未就绪且未初始化的状态。

这种情况的发生原因与第一个示例类似，但在此情况下，`node.kubernetes.io/not-ready`
污点使用了 NoExecute 效果，从而导致云控制器管理器无法在带有该污点的节点上运行。
如果云控制器管理器无法执行，则它将无法初始化节点。这将进一步导致容器网络控制器无法正常运行，
节点最终会同时携带 `node.cloudprovider.kubernetes.io/uninitialized` 和
`node.kubernetes.io/not-ready` 两个污点，从而使集群处于不健康状态。

<!--
## Our Recommendations

There is no one “correct way” to run a cloud-controller-manager. The details will depend on the
specific needs of the cluster administrators and users. When planning your clusters and the
lifecycle of the cloud-controller-managers please consider the following guidance:

For cloud-controller-managers running in the same cluster, they are managing.
-->
## 我们的建议

运行云控制器管理器并没有唯一的“正确方式”。具体细节将取决于集群管理员和用户的特定需求。
在规划你的集群以及云控制器管理器的生命周期时，请考虑以下指导。

对于在同一集群中运行的云控制器管理器，它们所管理的集群也是这一集群，需要特别注意。

<!--
1. Use host network mode, rather than the pod network: in most cases, a cloud controller manager
  will need to communicate with an API service endpoint associated with the infrastructure.
  Setting “hostNetwork” to true will ensure that the cloud controller is using the host
  networking instead of the container network and, as such, will have the same network access as
  the host operating system. It will also remove the dependency on the networking plugin. This
  will ensure that the cloud controller has access to the infrastructure endpoint (always check
  your networking configuration against your infrastructure provider’s instructions).
2. Use a scalable resource type. `Deployments` and `DaemonSets` are useful for controlling the
  lifecycle of a cloud controller. They allow easy access to running multiple copies for redundancy
  as well as using the Kubernetes scheduling to ensure proper placement in the cluster. When using
  these primitives to control the lifecycle of your cloud controllers and running multiple
  replicas, you must remember to enable leader election, or else your controllers will collide
  with each other which could lead to nodes not being initialized in the cluster.
-->
1. 使用主机网络模式，而不是 Pod 网络：在大多数情况下，云控制器管理器需要与基础设施相关的 API 服务端点进行通信。
   将 "hostNetwork" 设置为 `true` 可确保云控制器使用主机网络而非容器网络，从而拥有与主机操作系统相同的网络访问权限。
   这还将消除对网络插件的依赖。这可以确保云控制器能够访问基础设施端点
   （你应该始终检查网络配置是否与基础设施提供商所给的指导相符）。
2. 使用规模可扩缩的资源类型。`Deployment` 和 `DaemonSet` 对于控制云控制器的生命周期非常有用。
   它们支持轻松地运行多个副本以实现冗余，并利用 Kubernetes 调度来确保在集群中的正确放置。
   当使用这些原语控制云控制器的生命周期并运行多个副本时，请务必启用领导者选举，
   否则控制器之间可能会发生冲突，导致集群中的节点无法初始化。
<!--
3. Target the controller manager containers to the control plane. There might exist other
  controllers which need to run outside the control plane (for example, Azure’s node manager
  controller). Still, the controller managers themselves should be deployed to the control plane.
  Use a node selector or affinity stanza to direct the scheduling of cloud controllers to the
  control plane to ensure that they are running in a protected space. Cloud controllers are vital
  to adding and removing nodes to a cluster as they form a link between Kubernetes and the
  physical infrastructure. Running them on the control plane will help to ensure that they run
  with a similar priority as other core cluster controllers and that they have some separation
  from non-privileged user workloads.
   1. It is worth noting that an anti-affinity stanza to prevent cloud controllers from running
     on the same host is also very useful to ensure that a single node failure will not degrade
     the cloud controller performance.
-->
3. 将控制器管理器容器定位到控制平面。可能存在一些需要在控制平面之外运行的其他控制器
  （例如，Azure 的节点管理器控制器），但云控制器管理器本身应部署到控制平面。
   使用节点选择算符或亲和性配置将云控制器管理器定向调度到控制平面节点，以确保它们运行在受保护的空间中。
   云控制器管理器在集群中添加和移除节点时至关重要，因为它们构成了 Kubernetes 与物理基础设施之间的桥梁。
   1. 值得注意的是，使用反亲和性配置以防止多个云控制器管理器运行在同一主机上也非常有用，
      这可以确保单个节点故障不会影响云控制器管理器的性能。
<!--
4. Ensure that the tolerations allow operation. Use tolerations on the manifest for the cloud
  controller container to ensure that it will schedule to the correct nodes and that it can run
  in situations where a node is initializing. This means that cloud controllers should tolerate
  the `node.cloudprovider.kubernetes.io/uninitialized` taint, and it should also tolerate any
  taints associated with the control plane (for example, `node-role.kubernetes.io/control-plane`
  or `node-role.kubernetes.io/master`). It can also be useful to tolerate the
  `node.kubernetes.io/not-ready` taint to ensure that the cloud controller can run even when the
  node is not yet available for health monitoring.

For cloud-controller-managers that will not be running on the cluster they manage (for example,
in a hosted control plane on a separate cluster), then the rules are much more constrained by the
dependencies of the environment of the cluster running the cloud-controller-manager. The advice
for running on a self-managed cluster may not be appropriate as the types of conflicts and network
constraints will be different. Please consult the architecture and requirements of your topology
for these scenarios.
-->
4. 确保污点容忍规则允许操作。在云控制器管理器容器的清单中使用污点容忍规则，以确保其能够被调度到正确的节点，
   并能够在节点初始化时运行。这意味着云控制器应容忍 `node.cloudprovider.kubernetes.io/uninitialized`
   污点，还应容忍与控制平面相关的任何污点（例如，`node-role.kubernetes.io/control-plane` 或
   `node-role.kubernetes.io/master`）。容忍 `node.kubernetes.io/not-ready` 污点也可能很有用，
   以确保即使节点尚未准备好进行健康监控时，云控制器仍能运行。

对于不在其所管理的集群上（例如，在其他集群上的托管控制平面上）运行的云控制器管理器，
其规则将更多地受限于运行云控制器管理器的集群环境的依赖项。针对自管集群的运行建议可能不适用，
因为冲突类型和网络约束会有所不同。请根据这些场景咨询你的拓扑结构的架构和需求。

<!--
### Example

This is an example of a Kubernetes Deployment highlighting the guidance shown above. It is
important to note that this is for demonstration purposes only, for production uses please
consult your cloud provider’s documentation.
-->
### 示例

这是一个 Kubernetes Deployment 的示例，突显了上述指导原则。需要注意的是，
此示例仅用于演示目的，对于生产环境的使用，请参考你的云提供商的文档。

<!--
```
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app.kubernetes.io/name: cloud-controller-manager
  name: cloud-controller-manager
  namespace: kube-system
spec:
  replicas: 2
  selector:
    matchLabels:
      app.kubernetes.io/name: cloud-controller-manager
  strategy:
    type: Recreate
  template:
    metadata:
      labels:
        app.kubernetes.io/name: cloud-controller-manager
      annotations:
        kubernetes.io/description: Cloud controller manager for my infrastructure
    spec:
      containers: # the container details will depend on your specific cloud controller manager
      - name: cloud-controller-manager
        command:
        - /bin/my-infrastructure-cloud-controller-manager
        - --leader-elect=true
        - -v=1
        image: registry/my-infrastructure-cloud-controller-manager@latest
        resources:
          requests:
            cpu: 200m
            memory: 50Mi
      hostNetwork: true # these Pods are part of the control plane
      nodeSelector:
        node-role.kubernetes.io/control-plane: ""
      affinity:
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - topologyKey: "kubernetes.io/hostname"
            labelSelector:
              matchLabels:
                app.kubernetes.io/name: cloud-controller-manager
      tolerations:
      - effect: NoSchedule
        key: node-role.kubernetes.io/master
        operator: Exists
      - effect: NoExecute
        key: node.kubernetes.io/unreachable
        operator: Exists
        tolerationSeconds: 120
      - effect: NoExecute
        key: node.kubernetes.io/not-ready
        operator: Exists
        tolerationSeconds: 120
      - effect: NoSchedule
        key: node.cloudprovider.kubernetes.io/uninitialized
        operator: Exists
      - effect: NoSchedule
        key: node.kubernetes.io/not-ready
        operator: Exists
```
-->
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app.kubernetes.io/name: cloud-controller-manager
  name: cloud-controller-manager
  namespace: kube-system
spec:
  replicas: 2
  selector:
    matchLabels:
      app.kubernetes.io/name: cloud-controller-manager
  strategy:
    type: Recreate
  template:
    metadata:
      labels:
        app.kubernetes.io/name: cloud-controller-manager
      annotations:
        kubernetes.io/description: Cloud controller manager for my infrastructure
    spec:
      containers: # 容器的详细信息将取决于你具体的云控制器管理器
      - name: cloud-controller-manager
        command:
        - /bin/my-infrastructure-cloud-controller-manager
        - --leader-elect=true
        - -v=1
        image: registry/my-infrastructure-cloud-controller-manager@latest
        resources:
          requests:
            cpu: 200m
            memory: 50Mi
      hostNetwork: true # 这些 Pod 是控制平面的一部分
      nodeSelector:
        node-role.kubernetes.io/control-plane: ""
      affinity:
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - topologyKey: "kubernetes.io/hostname"
            labelSelector:
              matchLabels:
                app.kubernetes.io/name: cloud-controller-manager
      tolerations:
      - effect: NoSchedule
        key: node-role.kubernetes.io/master
        operator: Exists
      - effect: NoExecute
        key: node.kubernetes.io/unreachable
        operator: Exists
        tolerationSeconds: 120
      - effect: NoExecute
        key: node.kubernetes.io/not-ready
        operator: Exists
        tolerationSeconds: 120
      - effect: NoSchedule
        key: node.cloudprovider.kubernetes.io/uninitialized
        operator: Exists
      - effect: NoSchedule
        key: node.kubernetes.io/not-ready
        operator: Exists
```

<!--
When deciding how to deploy your cloud controller manager it is worth noting that
cluster-proportional, or resource-based, pod autoscaling is not recommended. Running multiple
replicas of a cloud controller manager is good practice for ensuring high-availability and
redundancy, but does not contribute to better performance. In general, only a single instance
of a cloud controller manager will be reconciling a cluster at any given time.
-->
在决定如何部署云控制器管理器时，需要注意的是，不建议使用与集群规模成比例的或基于资源的 Pod
自动规模扩缩。运行多个云控制器管理器副本是确保高可用性和冗余的良好实践，但这并不会提高性能。
通常情况下，任何时候只有一个云控制器管理器实例会负责协调集群。

<!--
[migration-blog]: /blog/2024/05/20/completing-cloud-provider-migration/
[kep2392]: https://github.com/kubernetes/enhancements/blob/master/keps/sig-cloud-provider/2392-cloud-controller-manager/README.md
[kep1281]: https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/1281-network-proxy
[kep2133]: https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2133-kubelet-credential-providers
[csi]: https://github.com/container-storage-interface/spec?tab=readme-ov-file#container-storage-interface-csi-specification-
[kep625]: https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/625-csi-migration/README.md
[ccm]: /docs/concepts/architecture/cloud-controller/
[chicken-and-egg]: /docs/tasks/administer-cluster/running-cloud-controller/#chicken-and-egg
[kubedocs0]: /docs/tasks/administer-cluster/running-cloud-controller/#running-cloud-controller-manager
[kubedocs1]: /docs/reference/labels-annotations-taints/#node-kubernetes-io-not-ready
-->
[migration-blog]: /zh-cn/blog/2024/05/20/completing-cloud-provider-migration/
[kep2392]: https://github.com/kubernetes/enhancements/blob/master/keps/sig-cloud-provider/2392-cloud-controller-manager/README.md
[kep1281]: https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/1281-network-proxy
[kep2133]: https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2133-kubelet-credential-providers
[csi]: https://github.com/container-storage-interface/spec?tab=readme-ov-file#container-storage-interface-csi-specification-
[kep625]: https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/625-csi-migration/README.md
[ccm]: /zh-cn/docs/concepts/architecture/cloud-controller/
[chicken-and-egg]: /zh-cn/docs/tasks/administer-cluster/running-cloud-controller/#chicken-and-egg
[kubedocs0]: /zh-cn/docs/tasks/administer-cluster/running-cloud-controller/#running-cloud-controller-manager
[kubedocs1]: /zh-cn/docs/reference/labels-annotations-taints/#node-kubernetes-io-not-ready
