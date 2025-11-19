---
title: 協調領導者選舉
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
Kubernetes {{< skew currentVersion >}} includes a beta feature that allows {{<
glossary_tooltip text="control plane" term_id="control-plane" >}} components to
deterministically select a leader via _coordinated leader election_.
This is useful to satisfy Kubernetes version skew constraints during cluster upgrades.
Currently, the only builtin selection strategy is `OldestEmulationVersion`,
preferring the leader with the lowest emulation version, followed by binary
version, followed by creation timestamp.
-->
Kubernetes {{< skew currentVersion >}} 包含一個 Beta 特性，
允許{{< glossary_tooltip text="控制平面" term_id="control-plane" >}}組件通過**協調領導者選舉**確定性地選擇一個領導者。
這對於在叢集升級期間滿足 Kubernetes 版本偏差約束非常有用。
目前，唯一內置的選擇策略是 `OldestEmulationVersion`，
此策略會優先選擇最低仿真版本作爲領導者，其次按二進制版本選擇領導者，最後會按創建時間戳選擇領導者。

<!--
## Enabling coordinated leader election

Ensure that `CoordinatedLeaderElection` [feature
gate](/docs/reference/command-line-tools-reference/feature-gates/) is enabled
when you start the {{< glossary_tooltip text="API Server"
term_id="kube-apiserver" >}}: and that the `coordination.k8s.io/v1beta1` API group is
enabled.
-->
## 啓用協調領導者選舉   {#enabling-coordinated-leader-election}

確保你在啓動 {{< glossary_tooltip text="API 伺服器" term_id="kube-apiserver" >}}時
`CoordinatedLeaderElection` [特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)被啓用，
並且 `coordination.k8s.io/v1beta1` API 組被啓用。

<!--
This can be done by setting flags `--feature-gates="CoordinatedLeaderElection=true"` and
`--runtime-config="coordination.k8s.io/v1beta1=true"`.
-->
此操作可以通過設置 `--feature-gates="CoordinatedLeaderElection=true"`
和 `--runtime-config="coordination.k8s.io/v1beta1=true"` 標誌來完成。

<!--
## Component configuration

Provided that you have enabled the `CoordinatedLeaderElection` feature gate _and_  
have the `coordination.k8s.io/v1beta1` API group enabled, compatible control plane  
components automatically use the LeaseCandidate and Lease APIs to elect a leader  
as needed.
-->
## 組件設定   {#component-configuration}

前提是你已啓用 `CoordinatedLeaderElection` 特性門控**並且**
啓用了 `coordination.k8s.io/v1beta1` API 組，
兼容的控制平面組件會自動使用 LeaseCandidate 和 Lease API 根據需要選舉領導者。

<!--
For Kubernetes {{< skew currentVersion >}}, two control plane components  
(kube-controller-manager and kube-scheduler) automatically use coordinated  
leader election when the feature gate and API group are enabled.
-->
對於 Kubernetes {{< skew currentVersion >}}，
當特性門控和 API 組被啓用時，
兩個控制平面組件（kube-controller-manager 和 kube-scheduler）會自動使用協調領導者選舉。
