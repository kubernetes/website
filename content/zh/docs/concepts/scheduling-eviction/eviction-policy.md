---
title: 驱逐策略
content_template: templates/concept
weight: 60
---
<!--
title: Eviction Policy
content_template: templates/concept
weight: 60
-->

<!-- overview -->
<!--
This page is an overview of Kubernetes' policy for eviction.
-->
本页提供 Kubernetes 驱逐策略的概览。

<!-- body -->

<!--
## Eviction Policy

The {{< glossary_tooltip text="Kubelet" term_id="kubelet" >}} can proactively monitor for and prevent total starvation of a
compute resource. In those cases, the `kubelet` can reclaim the starved
resource by proactively failing one or more Pods. When the `kubelet` fails
a Pod, it terminates all of its containers and transitions its `PodPhase` to `Failed`.
If the evicted Pod is managed by a Deployment, the Deployment will create another Pod
to be scheduled by Kubernetes.
-->
## 驱逐策略  {#eviction-policy}

{{< glossary_tooltip text="Kubelet" term_id="kubelet" >}} 能够主动监测和防止计算资源的全面短缺。
在资源短缺的情况下，`kubelet` 可以主动地结束一个或多个 Pod 以回收短缺的资源。
当 `kubelet` 结束一个 Pod 时，它将终止 Pod 中的所有容器，而 Pod 的 `Phase` 将变为 `Failed`。
如果被驱逐的 Pod 由 Deployment 管理，这个 Deployment 会创建另一个 Pod 给 Kubernetes 来调度。

## {{% heading "whatsnext" %}}

<!--
- Read [Configure out of resource handling](/docs/tasks/administer-cluster/out-of-resource/) to learn more about eviction signals, thresholds, and handling.
-->
- 阅读[配置资源不足的处理](/zh/docs/tasks/administer-cluster/out-of-resource/)，
  进一步了解驱逐信号、阈值以及处理方法。

