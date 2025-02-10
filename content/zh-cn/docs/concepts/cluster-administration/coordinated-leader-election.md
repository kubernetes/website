---
title: 协调领导者选举
content_type: concept
weight: 200
---
<!--
reviewers:
- jpbetz
title: Coordinated Leader Election
content_type: concept
weight: 200
-->

<!-- overview -->

{{< feature-state feature_gate_name="CoordinatedLeaderElection" >}}

<!--
Kubernetes {{< skew currentVersion >}} includes an alpha feature that allows {{<
glossary_tooltip text="control plane" term_id="control-plane" >}} components to
deterministically select a leader via _coordinated leader election_.
This is useful to satisfy Kubernetes version skew constraints during cluster upgrades.
Currently, the only builtin selection strategy is `OldestEmulationVersion`,
preferring the leader with the lowest emulation version, followed by binary
version, followed by creation timestamp.
-->
Kubernetes {{< skew currentVersion >}} 包含一个 Alpha 特性，
允许{{< glossary_tooltip text="控制平面" term_id="control-plane" >}}组件通过**协调领导者选举**确定性地选择一个领导者。
这对于在集群升级期间满足 Kubernetes 版本偏差约束非常有用。
目前，唯一内置的选择策略是 `OldestEmulationVersion`，
此策略会优先选择最低仿真版本作为领导者，其次按二进制版本选择领导者，最后会按创建时间戳选择领导者。

<!--
## Enabling coordinated leader election

Ensure that `CoordinatedLeaderElection` [feature
gate](/docs/reference/command-line-tools-reference/feature-gates/) is enabled
when you start the {{< glossary_tooltip text="API Server"
term_id="kube-apiserver" >}}: and that the `coordination.k8s.io/v1alpha1` API group is
enabled.
-->
## 启用协调领导者选举   {#enabling-coordinated-leader-election}

确保你在启动 {{< glossary_tooltip text="API 服务器" term_id="kube-apiserver" >}}时
`CoordinatedLeaderElection` [特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)被启用，
并且 `coordination.k8s.io/v1alpha1` API 组被启用。

<!--
This can be done by setting flags `--feature-gates="CoordinatedLeaderElection=true"` and
`--runtime-config="coordination.k8s.io/v1alpha1=true"`.
-->
此操作可以通过设置 `--feature-gates="CoordinatedLeaderElection=true"`
和 `--runtime-config="coordination.k8s.io/v1alpha1=true"` 标志来完成。

<!--
## Component configuration

Provided that you have enabled the `CoordinatedLeaderElection` feature gate _and_  
have the `coordination.k8s.io/v1alpha1` API group enabled, compatible control plane  
components automatically use the LeaseCandidate and Lease APIs to elect a leader  
as needed.
-->
## 组件配置   {#component-configuration}

前提是你已启用 `CoordinatedLeaderElection` 特性门控**并且**
启用了 `coordination.k8s.io/v1alpha1` API 组，
兼容的控制平面组件会自动使用 LeaseCandidate 和 Lease API 根据需要选举领导者。

<!--
For Kubernetes {{< skew currentVersion >}}, two control plane components  
(kube-controller-manager and kube-scheduler) automatically use coordinated  
leader election when the feature gate and API group are enabled.
-->
对于 Kubernetes {{< skew currentVersion >}}，
当特性门控和 API 组被启用时，
两个控制平面组件（kube-controller-manager 和 kube-scheduler）会自动使用协调领导者选举。
