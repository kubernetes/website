---
title: 从轮询切换为基于 CRI 事件的更新来获取容器状态
min-kubernetes-server-version: 1.26
content_type: task
weight: 90
---
<!--
title: Switching from Polling to CRI Event-based Updates to Container Status
min-kubernetes-server-version: 1.26
content_type: task
weight: 90
-->

{{< feature-state feature_gate_name="EventedPLEG" >}}

<!-- overview -->

<!--
This page shows how to migrate nodes to use event based updates for container status. The event-based
implementation reduces node resource consumption by the kubelet, compared to the legacy approach
that relies on polling.
You may know this feature as _evented Pod lifecycle event generator (PLEG)_. That's the name used
internally within the Kubernetes project for a key implementation detail.

The polling based approach is referred to as _generic PLEG_.
-->
本页展示了如何迁移节点以使用基于事件的更新来获取容器状态。
与依赖轮询的传统方法相比，基于事件的实现可以减少 kubelet 对节点资源的消耗。
你可以将这个特性称为**事件驱动的 Pod 生命周期事件生成器 (PLEG)**。
这是在 Kubernetes 项目内部针对关键实现细节所用的名称。

基于轮询的方法称为**通用 PLEG**。

## {{% heading "prerequisites" %}}

<!--
* You need to run a version of Kubernetes that provides this feature.
  Kubernetes v1.27 includes beta support for event-based container
  status updates. The feature is beta but is _disabled_ by default
  because it requires support from the container runtime.
* {{< version-check >}}
  If you are running a different version of Kubernetes, check the documentation for that release.
-->
* 你需要运行提供此特性的 Kubernetes 版本。
  Kubernetes 1.27 提供了对基于事件更新容器状态的 Beta 支持。
  此特性处于 Beta 阶段，默认被**禁用**。
* {{< version-check >}}
  如果你正在运行不同版本的 Kubernetes，请查阅对应版本的文档。
<!--
* The container runtime in use must support container lifecycle events.
  The kubelet automatically switches back to the legacy generic PLEG
  mechanism if the container runtime does not announce support for
  container lifecycle events, even if you have this feature gate enabled.
-->
* 所使用的容器运行时必须支持容器生命周期事件。
  如果容器运行时未声明对容器生命周期事件的支持，即使你已启用了此特性门控，
  kubelet 也会自动切换回传统的通用 PLEG。

<!-- steps -->

<!--
## Why switch to Evented PLEG?

* The _Generic PLEG_ incurs non-negligible overhead due to frequent polling of container statuses.
* This overhead is exacerbated by kubelet's parallelized polling of container states, thus limiting
  its scalability and causing poor performance and reliability problems.
* The goal of _Evented PLEG_ is to reduce unnecessary work during inactivity
  by replacing periodic polling.
-->
## 为什么要切换到事件驱动的 PLEG？   {#why-switch-to-evented-pleg}

* **通用 PLEG** 由于频繁轮询容器状态而产生了不可忽略的开销。
* 这种开销会被 kubelet 的并行轮询容器状态的机制加剧，
  限制了可扩缩性，还会导致性能和可靠性问题。
* **事件驱动的 PLEG** 的目标是通过替换定期轮询来减少闲置时的非必要任务。

<!--
## Switching to Evented PLEG

1. Start the kubelet with the [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
   `EventedPLEG` enabled. You can manage the kubelet feature gates editing the kubelet
   [config file](/docs/tasks/administer-cluster/kubelet-config-file/) and restarting the kubelet service.
   You need to do this on each node where you are using this feature.
-->
## 切换为事件驱动的 PLEG   {#switching-to-evented-pleg}

1. 启用[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
   `EventedPLEG` 后启动 kubelet。
   你可以通过编辑 kubelet [配置文件](/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/)并重启
   kubelet 服务来管理 kubelet 特性门控。
   你需要在使用此特性的所有节点上执行此操作。

<!--
2. Make sure the node is [drained](/docs/tasks/administer-cluster/safely-drain-node/) before proceeding. 

3. Start the container runtime with the container event generation enabled. 
-->
2. 确保节点被[腾空](/zh-cn/docs/tasks/administer-cluster/safely-drain-node/)后再继续。

3. 启用容器事件生成后启动容器运行时。

   {{< tabs name="tab_with_code" >}}

   {{% tab name="containerd" %}}
   <!--
   Version 1.7+
   -->
   版本 1.7+

   {{% /tab %}}

   {{% tab name="CRI-O" %}}
   <!--
   Version 1.26+
   
   Check if the CRI-O is already configured to emit CRI events by verifying the configuration,
   -->
   版本 1.26+

   通过验证配置，检查 CRI-O 是否已配置为发送 CRI 事件：

   ```shell
   crio config | grep enable_pod_events
   ```

   <!--
   If it is enabled, the output should be similar to the following:
   -->
   如果已启用，输出应类似于：

   ```none
   enable_pod_events = true
   ```

   <!--
   To enable it, start the CRI-O daemon with the flag `--enable-pod-events=true` or
   use a dropin config with the following lines:
   -->
   要启用它，可使用 `--enable-pod-events=true` 标志或添加以下配置来启动 CRI-O 守护进程：

   ```toml
   [crio.runtime]
   enable_pod_events: true
   ```

   {{% /tab %}}
   {{< /tabs >}}

   {{< version-check >}}

<!--
4. Verify that the kubelet is using event-based container stage change monitoring.
   To check, look for the term `EventedPLEG` in the kubelet logs.

   The output should be similar to this:
-->
4. 确认 kubelet 正使用基于事件的容器阶段变更监控。
   要检查这一点，可在 kubelet 日志中查找 `EventedPLEG` 词条。

   输出类似于：

   ```console
   I0314 11:10:13.909915 1105457 feature_gate.go:249] feature gates: &{map[EventedPLEG:true]}
   ```

   <!--
   If you have set `--v` to 4 and above, you might see more entries that indicate
   that the kubelet is using event-based container state monitoring.
   -->
   如果你将 `--v` 设置为 4 及更高值，你可能会看到更多条目表明
   kubelet 正在使用基于事件的容器状态监控。

   ```console
   I0314 11:12:42.009542 1110177 evented.go:238] "Evented PLEG: Generated pod status from the received event" podUID=3b2c6172-b112-447a-ba96-94e7022912dc
   I0314 11:12:44.623326 1110177 evented.go:238] "Evented PLEG: Generated pod status from the received event" podUID=b3fba5ea-a8c5-4b76-8f43-481e17e8ec40
   I0314 11:12:44.714564 1110177 evented.go:238] "Evented PLEG: Generated pod status from the received event" podUID=b3fba5ea-a8c5-4b76-8f43-481e17e8ec40
   ```

## {{% heading "whatsnext" %}}

<!--
* Learn more about the design in the Kubernetes Enhancement Proposal (KEP):
  [kubelet Evented PLEG for Better Performance](https://github.com/kubernetes/enhancements/blob/5b258a990adabc2ffdc9d84581ea6ed696f7ce6c/keps/sig-node/3386-kubelet-evented-pleg/README.md).
-->
* 进一步了解 Kubernetes 增强提案 (KEP)：
  [kubelet Evented PLEG for Better Performance](https://github.com/kubernetes/enhancements/blob/5b258a990adabc2ffdc9d84581ea6ed696f7ce6c/keps/sig-node/3386-kubelet-evented-pleg/README.md)
  中的设计理念。
