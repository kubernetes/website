---
layout: blog
title: 'Kubernetes 1.25：Pod 新增 PodHasNetwork 状况'
date: 2022-09-14
slug: pod-has-network-condition
---
<!--
layout: blog
title: 'Kubernetes 1.25: PodHasNetwork Condition for Pods'
date: 2022-09-14
slug: pod-has-network-condition
-->

<!--
**Author:**
Deep Debroy (Apple)
-->
**作者：**
Deep Debroy (Apple)

<!--
Kubernetes 1.25 introduces Alpha support for a new kubelet-managed pod condition
in the status field of a pod: `PodHasNetwork`. The kubelet, for a worker node,
will use the `PodHasNetwork` condition to accurately surface the initialization
state of a pod from the perspective of pod sandbox creation and network
configuration by a container runtime (typically in coordination with CNI
plugins). The kubelet starts to pull container images and start individual
containers (including init containers) after the status of the `PodHasNetwork`
condition is set to `"True"`. Metrics collection services that report latency of
pod initialization from a cluster infrastructural perspective (i.e. agnostic of
per container characteristics like image size or payload) can utilize the
`PodHasNetwork` condition to accurately generate Service Level Indicators
(SLIs). Certain operators or controllers that manage underlying pods may utilize
the `PodHasNetwork` condition to optimize the set of actions performed when pods
repeatedly fail to come up.
-->
Kubernetes 1.25 引入了对 kubelet 所管理的新的 Pod 状况 `PodHasNetwork` 的 Alpha 支持，
该状况位于 Pod 的 status 字段中 。对于工作节点，kubelet 将使用 `PodHasNetwork` 状况从容器运行时
（通常与 CNI 插件协作）创建 Pod 沙箱和网络配置的角度准确地了解 Pod 的初始化状态。
在 `PodHasNetwork` 状况的 status 设置为 `"True"` 后，kubelet 开始拉取容器镜像并启动独立的容器
（包括 Init 容器）。从集群基础设施的角度报告 Pod 初始化延迟的指标采集服务
（无需知道每个容器的镜像大小或有效负载等特征）就可以利用 `PodHasNetwork`
状况来准确生成服务水平指标（Service Level Indicator，SLI）。
某些管理底层 Pod 的 Operator 或控制器可以利用 `PodHasNetwork` 状况来优化 Pod 反复出现失败时要执行的操作。

<!--
### How is this different from the existing Initialized condition reported for pods?

The kubelet sets the status of the existing `Initialized` condition reported in
the status field of a pod depending on the presence of init containers in a pod.
-->
### 这与现在为 Pod 所报告的 Intialized 状况有何不同？

根据 Pod 中是否存在 Init 容器，kubelet 会设置在 Pod 的 status 字段中报告的 `Initialized` 状况的状态。

<!--
If a pod specifies init containers, the status of the `Initialized` condition in
the pod status will not be set to `"True"` until all init containers for the pod
have succeeded. However, init containers, configured by users, may have errors
(payload crashing, invalid image, etc) and the number of init containers
configured in a pod may vary across different workloads. Therefore,
cluster-wide, infrastructural SLIs around pod initialization cannot depend on
the `Initialized` condition of pods.
-->
如果 Pod 指定了 Init 容器，则 Pod 状态中的 `Initialized` 状况的 status 将不会设置为 `"True"`，
直到该 Pod 的所有 Init 容器都成功为止。但是，用户配置的 Init 容器可能会出现错误（有效负载崩溃、无效镜像等），
并且 Pod 中配置的 Init 容器数量可能因工作负载不同而异。
因此，关于 Pod 初始化的集群范围基础设施 SLI 不能依赖于 Pod 的 `Initialized` 状况。

<!--
If a pod does not specify init containers, the status of the `Initialized`
condition in the pod status is set to `"True"` very early in the lifecycle of
the pod. This occurs before the kubelet initiates any pod runtime sandbox
creation and network configuration steps. As a result, a pod without init
containers will report the status of the `Initialized` condition as `"True"`
even if the container runtime is not able to successfully initialize the pod
sandbox environment.
-->
如果 Pod 未指定 Init 容器，则在 Pod 生命周期的早期，
Pod 状态中的 `Initialized` 状况的 status 会被设置为 `"True"`。
这一设置发生在 kubelet 开始创建 Pod 运行时沙箱及配置网络之前。
因此，即使容器运行时未能成功初始化 Pod 沙箱环境，没有 Init 容器的
Pod 也会将 `Initialized` 状况的 status 报告为 `"True"`。

<!--
Relative to either situation above, the `PodHasNetwork` condition surfaces more
accurate data around when the pod runtime sandbox was initialized with
networking configured so that the kubelet can proceed to launch user-configured
containers (including init containers) in the pod.
-->
相对于上述任何一种情况，`PodHasNetwork` 状况会在 Pod 运行时沙箱被初始化并配置了网络时能够提供更准确的数据，
这样 kubelet 可以继续在 Pod 中启动用户配置的容器（包括 Init 容器）。

<!--
### Special Cases

If a pod specifies `hostNetwork` as `"True"`, the `PodHasNetwork` condition is
set to `"True"` based on successful creation of the pod sandbox while the
network configuration state of the pod sandbox is ignored. This is because the
CRI implementation typically skips any pod sandbox network configuration when
`hostNetwork` is set to `"True"` for a pod.
-->
### 特殊场景

如果一个 Pod 指定 `hostNetwork` 为 `"True"`，
系统会根据 Pod 沙箱创建操作是否成功来决定要不要将 `PodHasNetwork` 状况设置为 `"True"`，
设置此状况时会忽略 Pod 沙箱的网络配置状态。这是因为 Pod 的 `hostNetwork` 被设置为
`"True"` 时 CRI 实现通常会跳过所有 Pod 沙箱网络配置。

<!--
A node agent may dynamically re-configure network interface(s) for a pod by
watching changes in pod annotations that specify additional networking
configuration (e.g. `k8s.v1.cni.cncf.io/networks`). Dynamic updates of pod
networking configuration after the pod sandbox is initialized by Kubelet (in
coordination with a container runtime) are not reflected by the `PodHasNetwork`
condition.
-->
节点代理可以通过监视指定附加网络配置（例如 `k8s.v1.cni.cncf.io/networks`）的 Pod 注解变化，
来动态地为 Pod 重新配置网络接口。Pod 沙箱被 Kubelet 初始化（结合容器运行时）之后
Pod 网络配置的动态更新不反映在 `PodHasNetwork` 状况中。

<!--
### Try out the PodHasNetwork condition for pods

In order to have the kubelet report the `PodHasNetwork` condition in the status
field of a pod, please enable the `PodHasNetworkCondition` feature gate on the
kubelet.

For a pod whose runtime sandbox has been successfully created and has networking
configured, the kubelet will report the `PodHasNetwork` condition with status set to `"True"`:
-->
### 试用 Pod 的 `PodHasNetwork` 状况

为了让 kubelet 在 Pod 的 status 字段中报告 `PodHasNetwork` 状况，需在 kubelet 上启用
`PodHasNetworkCondition` 特性门控。

对于已成功创建运行时沙箱并已配置网络的 Pod，在 status 设置为 `"True"` 后，
kubelet 将报告 `PodHasNetwork` 状况：

```
$ kubectl describe pod nginx1
Name:             nginx1
Namespace:        default
...
Conditions:
  Type              Status
  PodHasNetwork     True
  Initialized       True
  Ready             True
  ContainersReady   True
  PodScheduled      True
```

<!--
For a pod whose runtime sandbox has not been created yet (and networking not
configured either), the kubelet will report the `PodHasNetwork` condition with
status set to `"False"`:
-->
对于尚未创建运行时沙箱（也未配置网络）的 Pod，在 status 设置为 `"False"` 后，
kubelet 将报告 `PodHasNetwork` 状况：

```
$ kubectl describe pod nginx2
Name:             nginx2
Namespace:        default
...
Conditions:
  Type              Status
  PodHasNetwork     False
  Initialized       True
  Ready             False
  ContainersReady   False
  PodScheduled      True
```

<!--
### What’s next?

Depending on feedback and adoption, the Kubernetes team plans to push the
reporting of the `PodHasNetwork` condition to Beta in 1.26 or 1.27.
-->
### 下一步是什么？

Kubernetes 团队根据反馈和采用情况，计划在 1.26 或 1.27 中将 `PodHasNetwork` 状况的报告提升到 Beta 阶段。

<!--
### How can I learn more?

Please check out the
[documentation](/docs/concepts/workloads/pods/pod-lifecycle/) for the
`PodHasNetwork` condition to learn more about it and how it fits in relation to
other pod conditions.
-->
### 我如何了解更多信息？

请查阅 `PodHasNetwork` 状况有关的[文档](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/)，
以了解有关该状况的更多信息以及它与其他 Pod 状况的关系。

<!--
### How to get involved?

This feature is driven by the SIG Node community. Please join us to connect with
the community and share your ideas and feedback around the above feature and
beyond. We look forward to hearing from you!
-->
### 如何参与？

此特性由 SIG Node 社区驱动。请加入我们与社区建立联系，并就上述特性及其他问题分享你的想法和反馈。
我们期待你的回音！

<!--
### Acknowledgements

We want to thank the following people for their insightful and helpful reviews
of the KEP and PRs around this feature: Derek Carr (@derekwaynecarr), Mrunal
Patel (@mrunalp), Dawn Chen (@dchen1107), Qiutong Song (@qiutongs), Ruiwen Zhao
(@ruiwen-zhao), Tim Bannister (@sftim), Danielle Lancashire (@endocrimes) and
Agam Dua (@agamdua).
-->
### 致谢

我们要感谢以下人员围绕此特性对 KEP 和 PR 进行了极具洞察力和相当有助益的评审工作：
Derek Carr (@derekwaynecarr)、Mrunal Patel (@mrunalp)、Dawn Chen (@dchen1107)、
Qiutong Song (@qiutongs)、Ruiwen Zhao (@ruiwen-zhao)、Tim Bannister (@sftim)、
Danielle Lancashire (@endocrimes) 和 Agam Dua (@agamdua)。
