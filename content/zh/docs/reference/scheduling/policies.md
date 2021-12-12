---
title: 调度策略
content_type: concept
weight: 10
---
<!--  
title: Scheduling Policies
content_type: concept
weight: 10
-->

<!-- overview -->

<!--  
A scheduling Policy can be used to specify the *predicates* and *priorities*
that the {{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}}
runs to [filter and score nodes](/docs/concepts/scheduling-eviction/kube-scheduler/#kube-scheduler-implementation),
respectively.
-->
{{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}}
根据调度策略指定的*断言（predicates）*和*优先级（priorities）*
分别对节点进行[过滤和打分](/zh/docs/concepts/scheduling-eviction/kube-scheduler/#kube-scheduler-implementation)。

<!--  
You can set a scheduling policy by running
`kube-scheduler --policy-config-file <filename>` or
`kube-scheduler --policy-configmap <ConfigMap>`
and using the [Policy type](/zh/docs/reference/config-api/kube-scheduler-policy-config.v1/).
-->
你可以通过执行 `kube-scheduler --policy-config-file <filename>` 或
`kube-scheduler --policy-configmap <ConfigMap>` 
设置并使用[调度策略](/zh/docs/reference/config-api/kube-scheduler-policy-config.v1/)。


<!-- body -->

<!-- ## Predicates -->
## 断言    {#predicates}


<!-- The following *predicates* implement filtering: -->
以下*断言*实现了过滤接口：

<!-- 
- `PodFitsHostPorts`: Checks if a Node has free ports (the network protocol kind)
  for the Pod ports the Pod is requesting. 
-->
- `PodFitsHostPorts`：检查 Pod 请求的端口（网络协议类型）在节点上是否可用。

<!-- - `PodFitsHost`: Checks if a Pod specifies a specific Node by its hostname. -->
- `PodFitsHost`：检查 Pod 是否通过主机名指定了 Node。

<!-- 
- `PodFitsResources`: Checks if the Node has free resources (eg, CPU and Memory)
  to meet the requirement of the Pod.
-->
- `PodFitsResources`：检查节点的空闲资源（例如，CPU和内存）是否满足 Pod 的要求。

<!--  
- `MatchNodeSelector`: Checks if a Pod's Node {{< glossary_tooltip term_id="selector" >}}
   matches the Node's {{< glossary_tooltip text="label(s)" term_id="label" >}}.
-->
- `MatchNodeSelector`：检查 Pod 的节点{{< glossary_tooltip text="选择算符" term_id="selector" >}}
  和节点的 {{< glossary_tooltip text="标签" term_id="label" >}} 是否匹配。

<!--  
- `NoVolumeZoneConflict`: Evaluate if the {{< glossary_tooltip text="Volumes" term_id="volume" >}}
  that a Pod requests are available on the Node, given the failure zone restrictions for
  that storage.
-->
- `NoVolumeZoneConflict`：给定该存储的故障区域限制，
  评估 Pod 请求的{{< glossary_tooltip text="卷" term_id="volume" >}}在节点上是否可用。

<!--  
- `NoDiskConflict`: Evaluates if a Pod can fit on a Node due to the volumes it requests,
   and those that are already mounted.
-->
- `NoDiskConflict`：根据 Pod 请求的卷是否在节点上已经挂载，评估 Pod 和节点是否匹配。

<!--  
- `MaxCSIVolumeCount`: Decides how many {{< glossary_tooltip text="CSI" term_id="csi" >}}
  volumes should be attached, and whether that's over a configured limit.
-->
- `MaxCSIVolumeCount`：决定附加 {{< glossary_tooltip text="CSI" term_id="csi" >}} 卷的数量，判断是否超过配置的限制。

<!--  
- `PodToleratesNodeTaints`: checks if a Pod's {{< glossary_tooltip text="tolerations" term_id="toleration" >}}
  can tolerate the Node's {{< glossary_tooltip text="taints" term_id="taint" >}}.
-->
- `PodToleratesNodeTaints`：检查 Pod 的{{< glossary_tooltip text="容忍" term_id="toleration" >}}
  是否能容忍节点的{{< glossary_tooltip text="污点" term_id="taint" >}}。

<!-- 
- `CheckVolumeBinding`: Evaluates if a Pod can fit due to the volumes it requests.
  This applies for both bound and unbound
  {{< glossary_tooltip text="PVCs" term_id="persistent-volume-claim" >}}. 
-->
- `CheckVolumeBinding`：基于 Pod 的卷请求，评估 Pod 是否适合节点，这里的卷包括绑定的和未绑定的
  {{< glossary_tooltip text="PVCs" term_id="persistent-volume-claim" >}} 都适用。


<!-- ## Priorities -->
## 优先级    {#priorities}

<!-- The following *priorities* implement scoring: -->
以下*优先级*实现了打分接口：

<!--  
- `SelectorSpreadPriority`: Spreads Pods across hosts, considering Pods that
   belong to the same {{< glossary_tooltip text="Service" term_id="service" >}},
   {{< glossary_tooltip term_id="statefulset" >}} or
   {{< glossary_tooltip term_id="replica-set" >}}.
-->
- `SelectorSpreadPriority`：属于同一 {{< glossary_tooltip text="Service" term_id="service" >}}、
  {{< glossary_tooltip term_id="statefulset" >}} 或
  {{< glossary_tooltip term_id="replica-set" >}} 的 Pod，跨主机部署。

<!--  
- `InterPodAffinityPriority`: Implements preferred
  [inter pod affininity and antiaffinity](/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity).
-->
- `InterPodAffinityPriority`：实现了 [Pod 间亲和性与反亲和性](/zh/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)的优先级。

<!--
- `LeastRequestedPriority`: Favors nodes with fewer requested resources. In other
  words, the more Pods that are placed on a Node, and the more resources those
  Pods use, the lower the ranking this policy will give.  
-->
- `LeastRequestedPriority`：偏向最少请求资源的节点。 
  换句话说，节点上的 Pod 越多，使用的资源就越多，此策略给出的排名就越低。

<!--  
- `MostRequestedPriority`: Favors nodes with most requested resources. This policy
  will fit the scheduled Pods onto the smallest number of Nodes needed to run your
  overall set of workloads.
-->
- `MostRequestedPriority`：支持最多请求资源的节点。
  该策略将 Pod 调度到整体工作负载所需的最少的一组节点上。

<!-- - `RequestedToCapacityRatioPriority`: Creates a requestedToCapacity based ResourceAllocationPriority using default resource scoring function shape. -->
- `RequestedToCapacityRatioPriority`：使用默认的打分方法模型，创建基于 ResourceAllocationPriority 的 requestedToCapacity。

<!-- - `BalancedResourceAllocation`: Favors nodes with balanced resource usage. -->
- `BalancedResourceAllocation`：偏向平衡资源使用的节点。

<!-- 
- `NodePreferAvoidPodsPriority`: Prioritizes nodes according to the node annotation
  `scheduler.alpha.kubernetes.io/preferAvoidPods`. You can use this to hint that
  two different Pods shouldn't run on the same Node. 
  -->
- `NodePreferAvoidPodsPriority`：根据节点的注解 `scheduler.alpha.kubernetes.io/preferAvoidPods` 对节点进行优先级排序。
  你可以使用它来暗示两个不同的 Pod 不应在同一节点上运行。

<!--  
- `NodeAffinityPriority`: Prioritizes nodes according to node affinity scheduling
   preferences indicated in PreferredDuringSchedulingIgnoredDuringExecution.
   You can read more about this in [Assigning Pods to Nodes](/docs/concepts/scheduling-eviction/assign-pod-node/).
-->
- `NodeAffinityPriority`：根据节点亲和中 PreferredDuringSchedulingIgnoredDuringExecution 字段对节点进行优先级排序。
  你可以在[将 Pod 分配给节点](/zh/docs/concepts/scheduling-eviction/assign-pod-node/)中了解更多。

<!--  
- `TaintTolerationPriority`: Prepares the priority list for all the nodes, based on
  the number of intolerable taints on the node. This policy adjusts a node's rank
  taking that list into account.
-->
- `TaintTolerationPriority`：根据节点上无法忍受的污点数量，给所有节点进行优先级排序。
  此策略会根据排序结果调整节点的等级。

<!-- 
- `ImageLocalityPriority`: Favors nodes that already have the
  {{< glossary_tooltip text="container images" term_id="image" >}} for that
  Pod cached locally.
-->
- `ImageLocalityPriority`：偏向已在本地缓存 Pod 所需容器镜像的节点。

<!-- 
- `ServiceSpreadingPriority`: For a given Service, this policy aims to make sure that
  the Pods for the Service run on different nodes. It favours scheduling onto nodes
  that don't have Pods for the service already assigned there. The overall outcome is
  that the Service becomes more resilient to a single Node failure.
-->
- `ServiceSpreadingPriority`：对于给定的 Service，此策略旨在确保该 Service 关联的 Pod 在不同的节点上运行。
  它偏向把 Pod 调度到没有该服务的节点。
  整体来看，Service 对于单个节点故障变得更具弹性。

<!-- - `EqualPriority`: Gives an equal weight of one to all nodes. -->
- `EqualPriority`：给予所有节点相等的权重。

<!-- 
- `EvenPodsSpreadPriority`: Implements preferred
  [pod topology spread constraints](/docs/concepts/workloads/pods/pod-topology-spread-constraints/). 
-->
- `EvenPodsSpreadPriority`：实现了 [Pod 拓扑扩展约束](/zh/docs/concepts/workloads/pods/pod-topology-spread-constraints/)的优先级排序。



## {{% heading "whatsnext" %}}

<!--  
* Learn about [scheduling](/docs/concepts/scheduling-eviction/kube-scheduler/)
* Learn about [kube-scheduler Configuration](/docs/reference/scheduling/config/)
* Read the [kube-scheduler configuration reference (v1beta1)](/docs/reference/config-api/kube-scheduler-config.v1beta2)
* Read the [kube-scheduler Policy reference (v1)](/docs/reference/config-api/kube-scheduler-policy-config.v1/)
-->
* 了解[调度](/zh/docs/concepts/scheduling-eviction/kube-scheduler/)
* 了解 [kube-scheduler 配置](/zh/docs/reference/scheduling/config/)
* 阅读 [kube-scheduler 配置参考 (v1beta1)](/zh/docs/reference/config-api/kube-scheduler-config.v1beta2)
* 阅读 [kube-scheduler 策略参考 (v1)](/zh/docs/reference/config-api/kube-scheduler-policy-config.v1/)
