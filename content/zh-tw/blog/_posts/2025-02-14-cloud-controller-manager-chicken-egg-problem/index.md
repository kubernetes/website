---
layout: blog
title: "雲控制器管理器（Cloud Controller Manager）'雞與蛋'的問題"
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
[完成了 Kubernetes 歷史上最大的遷移][migration-blog]，移除了樹內雲驅動（in-tree cloud provider）。
雖然組件遷移已經完成，但這爲使用者和安裝項目（例如 kOps 或 Cluster API）帶來了一些額外的複雜性。
我們將回顧這些額外的步驟和可能的故障點，併爲叢集所有者提供改進建議。  
此次遷移非常複雜，必須從核心組件中提取部分邏輯，構建四個新的子系統。

<!--
1. **Cloud controller manager** ([KEP-2392][kep2392])
2. **API server network proxy** ([KEP-1281][kep1281])
3. **kubelet credential provider plugins** ([KEP-2133][kep2133])
4. **Storage migration to use [CSI][csi]** ([KEP-625][kep625])

The [cloud controller manager is part of the control plane][ccm]. It is a critical component
that replaces some functionality that existed previously in the kube-controller-manager and the
kubelet.
-->
1. **雲控制器管理器** ([KEP-2392][kep2392])  
2. **API 伺服器網路代理** ([KEP-1281][kep1281])  
3. **kubelet 憑證提供程式插件** ([KEP-2133][kep2133])  
4. **儲存遷移到使用 [CSI][csi]** ([KEP-625][kep625])  

[雲控制器管理器是控制平面的一部分][ccm]。這是一個關鍵組件，替換了之前存在於 kube-controller-manager
和 kubelet 中的某些特性。

<!--
{{< figure
    src="/images/docs/components-of-kubernetes.svg"
    alt="Components of Kubernetes"
    caption="Components of Kubernetes"
>}}
-->
{{< figure
    src="/zh-cn/docs/images/components-of-kubernetes.svg"
    alt="Kubernetes 組件"
    caption="Kubernetes 組件"
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
雲控制器管理器最重要的功能之一是節點控制器，它負責節點的初始化。

從下圖可以看出，當 **kubelet** 啓動時，它會向 apiserver 註冊 Node 對象，並對節點設置污點，
以便雲控制器管理器可以先處理該節點。初始的 Node 缺少與雲提供商相關的資訊，
例如節點地址和包含雲提供商特定資訊的標籤，如節點、區域和實例類型資訊。

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
    alt="雞和蛋問題時序圖"
    caption="雞和蛋問題時序圖"
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
這一新的初始化過程會增加節點就緒的延遲。以前，kubelet 可以在創建節點的同時初始化節點。
對於某些 Kubernetes 架構而言，其控制平面其他組件以靜態 Pod、獨立二進制檔案或具有容忍污點功能的、
用 `hostNetwork` DaemonSet/Deployment 部署，由於節點初始化邏輯已移至雲控制管理器中，
如果不將控制器管理器作爲控制平面的一部分，則可能會導致叢集引導過程中出現[雞和蛋問題][chicken-and-egg]（更多內容見下文）。

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
## 依賴問題的示例

如上所述，在引導過程中，雲控制器管理器可能無法被調度，
因此叢集將無法正確初始化。以下幾個具體示例說明此問題的可能表現形式及其根本原因。

這些示例假設你使用 Kubernetes 資源（例如 Deployment、DaemonSet
或類似資源）來控制雲控制器管理器的生命週期。由於這些方法依賴於 Kubernetes 來調度雲控制器管理器，
因此必須確保其能夠正確調度。

<!--
### Example: Cloud controller manager not scheduling due to uninitialized taint

As [noted in the Kubernetes documentation][kubedocs0], when the kubelet is started with the command line
flag `--cloud-provider=external`, its corresponding `Node` object will have a no schedule taint
named `node.cloudprovider.kubernetes.io/uninitialized` added. Because the cloud-controller-manager
is responsible for removing the no schedule taint, this can create a situation where a
cloud-controller-manager that is being managed by a Kubernetes resource, such as a `Deployment`
or `DaemonSet`, may not be able to schedule.
-->
### 示例：由於未初始化的污點導致雲控制器管理器無法調度

如 [Kubernetes 文檔中所述][kubedocs0]，當 kubelet 使用命令列標誌 `--cloud-provider=external`
啓動時，其對應的 `Node` 對象將添加一個名爲 `node.cloudprovider.kubernetes.io/uninitialized`
的不可調度污點。由於雲控制器管理器負責移除該不可調度污點，這可能會導致由某個 Kubernetes
資源（例如 `Deployment` 或 `DaemonSet`）管理的雲控制器管理器無法被調度的情況。

<!--
If the cloud-controller-manager is not able to be scheduled during the initialization of the
control plane, then the resulting `Node` objects will all have the
`node.cloudprovider.kubernetes.io/uninitialized` no schedule taint. It also means that this taint
will not be removed as the cloud-controller-manager is responsible for its removal. If the no
schedule taint is not removed, then critical workloads, such as the container network interface
controllers, will not be able to schedule, and the cluster will be left in an unhealthy state.
-->
如果在控制平面初始化期間雲控制器管理器無法被調度，那麼生成的 `Node` 對象將全部帶有
`node.cloudprovider.kubernetes.io/uninitialized` 不可調度污點。這也意味着該污點不會被移除，
因爲雲控制器管理器負責其移除工作。如果不可調度污點未被移除，關鍵工作負載（例如容器網路介面控制器）
將無法被調度，叢集將處於不健康狀態。

<!--
### Example: Cloud controller manager not scheduling due to not-ready taint

The next example would be possible in situations where the container network interface (CNI) is
waiting for IP address information from the cloud-controller-manager (CCM), and the CCM has not
tolerated the taint which would be removed by the CNI.

The [Kubernetes documentation describes][kubedocs1] the `node.kubernetes.io/not-ready` taint as follows:

> "The Node controller detects whether a Node is ready by monitoring its health and adds or removes this taint accordingly."
-->
### 示例：由於未就緒污點導致雲控制器管理器無法調度

下一個示例可能出現在容器網路介面（CNI）正在等待來自雲控制器管理器（CCM）的
IP 地址資訊，而 CCM 未容忍將由 CNI 移除的污點的情況下。

[Kubernetes 文檔][kubedocs1] 對 `node.kubernetes.io/not-ready` 污點的描述如下：

> "節點控制器通過監控節點的健康狀態來檢測節點是否已準備好，並據此添加或移除此污點。"

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
當容器網路尚未在某節點上初始化時，可能導致 Node 資源具有此污點。由於雲控制器管理器負責爲
Node 資源添加 IP 地址，而容器網路控制器需要這些 IP 地址來正確設定容器網路，因此在某些情況下，
節點可能會永久處於未就緒且未初始化的狀態。

這種情況的發生原因與第一個示例類似，但在此情況下，`node.kubernetes.io/not-ready`
污點使用了 NoExecute 效果，從而導致雲控制器管理器無法在帶有該污點的節點上運行。
如果雲控制器管理器無法執行，則它將無法初始化節點。這將進一步導致容器網路控制器無法正常運行，
節點最終會同時攜帶 `node.cloudprovider.kubernetes.io/uninitialized` 和
`node.kubernetes.io/not-ready` 兩個污點，從而使叢集處於不健康狀態。

<!--
## Our Recommendations

There is no one “correct way” to run a cloud-controller-manager. The details will depend on the
specific needs of the cluster administrators and users. When planning your clusters and the
lifecycle of the cloud-controller-managers please consider the following guidance:

For cloud-controller-managers running in the same cluster, they are managing.
-->
## 我們的建議

運行雲控制器管理器並沒有唯一的“正確方式”。具體細節將取決於叢集管理員和使用者的特定需求。
在規劃你的叢集以及雲控制器管理器的生命週期時，請考慮以下指導。

對於在同一叢集中運行的雲控制器管理器，它們所管理的叢集也是這一叢集，需要特別注意。

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
1. 使用主機網路模式，而不是 Pod 網路：在大多數情況下，雲控制器管理器需要與基礎設施相關的 API 服務端點進行通信。
   將 "hostNetwork" 設置爲 `true` 可確保雲控制器使用主機網路而非容器網路，從而擁有與主機操作系統相同的網路訪問權限。
   這還將消除對網路插件的依賴。這可以確保雲控制器能夠訪問基礎設施端點
   （你應該始終檢查網路設定是否與基礎設施提供商所給的指導相符）。
2. 使用規模可擴縮的資源類型。`Deployment` 和 `DaemonSet` 對於控制雲控制器的生命週期非常有用。
   它們支持輕鬆地運行多個副本以實現冗餘，並利用 Kubernetes 調度來確保在叢集中的正確放置。
   當使用這些原語控制雲控制器的生命週期並運行多個副本時，請務必啓用領導者選舉，
   否則控制器之間可能會發生衝突，導致叢集中的節點無法初始化。
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
3. 將控制器管理器容器定位到控制平面。可能存在一些需要在控制平面之外運行的其他控制器
  （例如，Azure 的節點管理器控制器），但云控制器管理器本身應部署到控制平面。
   使用節點選擇算符或親和性設定將雲控制器管理器定向調度到控制平面節點，以確保它們運行在受保護的空間中。
   雲控制器管理器在叢集中添加和移除節點時至關重要，因爲它們構成了 Kubernetes 與物理基礎設施之間的橋樑。
   1. 值得注意的是，使用反親和性設定以防止多個雲控制器管理器運行在同一主機上也非常有用，
      這可以確保單個節點故障不會影響雲控制器管理器的性能。
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
4. 確保污點容忍規則允許操作。在雲控制器管理器容器的清單中使用污點容忍規則，以確保其能夠被調度到正確的節點，
   並能夠在節點初始化時運行。這意味着雲控制器應容忍 `node.cloudprovider.kubernetes.io/uninitialized`
   污點，還應容忍與控制平面相關的任何污點（例如，`node-role.kubernetes.io/control-plane` 或
   `node-role.kubernetes.io/master`）。容忍 `node.kubernetes.io/not-ready` 污點也可能很有用，
   以確保即使節點尚未準備好進行健康監控時，雲控制器仍能運行。

對於不在其所管理的叢集上（例如，在其他叢集上的託管控制平面上）運行的雲控制器管理器，
其規則將更多地受限於運行雲控制器管理器的叢集環境的依賴項。針對自管叢集的運行建議可能不適用，
因爲衝突類型和網路約束會有所不同。請根據這些場景諮詢你的拓撲結構的架構和需求。

<!--
### Example

This is an example of a Kubernetes Deployment highlighting the guidance shown above. It is
important to note that this is for demonstration purposes only, for production uses please
consult your cloud provider’s documentation.
-->
### 示例

這是一個 Kubernetes Deployment 的示例，突顯了上述指導原則。需要注意的是，
此示例僅用於演示目的，對於生產環境的使用，請參考你的雲提供商的文檔。

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
      containers: # 容器的詳細信息將取決於你具體的雲控制器管理器
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
      hostNetwork: true # 這些 Pod 是控制平面的一部分
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
在決定如何部署雲控制器管理器時，需要注意的是，不建議使用與叢集規模成比例的或基於資源的 Pod
自動規模擴縮。運行多個雲控制器管理器副本是確保高可用性和冗餘的良好實踐，但這並不會提高性能。
通常情況下，任何時候只有一個雲控制器管理器實例會負責協調叢集。

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
