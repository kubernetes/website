---
layout: blog
title: "Kubernetes v1.36：云控制器管理器中的路由同步新指标"
date: 2026-05-15T10:35:00-08:00
slug: ccm-new-metric-route-sync-total
author: >
  [Lukas Metzner](https://github.com/lukasmetzner) (Hetzner)
aliases:
  - /zh-cn/blog/2026/02/26/ccm-new-metric-route-sync-total
  - /zh-cn/blog/2026/02/26/ccm-new-metric-route-sync-total/
translator: >
  [Xin Li](https://github.com/my-git9) (DaoCloud)
---
<!--
layout: blog
title: "Kubernetes v1.36: New Metric for Route Sync in the Cloud Controller Manager"
date: 2026-05-15T10:35:00-08:00
slug: ccm-new-metric-route-sync-total
author: >
  [Lukas Metzner](https://github.com/lukasmetzner) (Hetzner)
aliases:
  - /blog/2026/02/26/ccm-new-metric-route-sync-total
  - /blog/2026/02/26/ccm-new-metric-route-sync-total/
-->

<!--
_This article was originally published with the wrong date. It was later republished, dated the 15th of
May 2026._
-->
**本文最初发布时日期有误。后来重新发布，日期为 2026 年 5 月 15 日。**

<!--
Kubernetes v1.36 introduces a new alpha counter metric `route_controller_route_sync_total`
to the Cloud Controller Manager (CCM) route controller implementation at
[`k8s.io/cloud-provider`](https://github.com/kubernetes/cloud-provider). This metric
increments each time routes are synced with the cloud provider.
-->
Kubernetes v1.36 在位于
[`k8s.io/cloud-provider`](https://github.com/kubernetes/cloud-provider)
的云控制器管理器（CCM）路由控制器实现中引入了一个新的 Alpha 计数器指标
`route_controller_route_sync_total`。此指标在每次与云提供商同步路由时递增。

<!--
## A/B testing watch-based route reconciliation
-->
## 基于监视的路由调谐的 A/B 测试

<!--
This metric was added to help operators validate the
`CloudControllerManagerWatchBasedRoutesReconciliation` feature gate introduced in
[Kubernetes v1.35](/blog/2025/12/30/kubernetes-v1-35-watch-based-route-reconciliation-in-ccm/).
That feature gate switches the route controller from a fixed-interval loop to a watch-based
approach that only reconciles when nodes actually change. This reduces unnecessary API calls
to the infrastructure provider, lowering pressure on rate-limited APIs and allowing operators
to make more efficient use of their available quota.
-->
添加此指标是为了帮助运维人员验证在
[Kubernetes v1.35](/blog/2025/12/30/kubernetes-v1-35-watch-based-route-reconciliation-in-ccm/)
中引入的 `CloudControllerManagerWatchBasedRoutesReconciliation` 特性门控。
此特性门控将路由控制器从固定间隔循环切换为基于监视的方法，仅在节点实际发生变化时进行调谐。
这减少了对基础设施提供商的不必要 API 调用，降低了速率限制 API 的压力，
并允许运维人员更高效地使用其可用配额。

<!--
To A/B test this, compare `route_controller_route_sync_total` with the feature gate
disabled (default) versus enabled. In clusters where node changes are infrequent, you should
see a significant drop in the sync rate with the feature gate turned on.
-->
要对此进行 A/B 测试，请比较特性门控禁用（默认）与启用时的 `route_controller_route_sync_total`。
在节点变化不频繁的集群中，开启特性门控后，你应该会看到同步速率显著下降。

<!--
### Example: expected behavior
-->
### 示例：预期行为

<!--
**With the feature gate disabled** (the default fixed-interval loop), the counter increments
steadily regardless of whether any node changes occurred:
-->
**特性门控禁用时**（默认的固定间隔循环），无论是否发生任何节点变化，计数器都会稳定递增：

```
# After 10 minutes with no node changes
route_controller_route_sync_total 60
# After 20 minutes, still no node changes
route_controller_route_sync_total 120
```

<!--
**With the feature gate enabled** (watch-based reconciliation), the counter only increments
when nodes are actually added, removed, or updated:
-->
**特性门控启用时**（基于监视的调和），仅在节点实际被添加、移除或更新时，计数器才会递增：

```
# After 10 minutes with no node changes
route_controller_route_sync_total 1
# After 20 minutes, still no node changes — counter unchanged
route_controller_route_sync_total 1
# A new node joins the cluster — counter increments
route_controller_route_sync_total 2
```

<!--
The difference is especially visible in stable clusters where nodes rarely change.
-->
这种差异在节点很少变化的稳定集群中尤其明显。

<!--
## Where can I give feedback?
-->
## 我在哪里可以提供反馈？

<!--
If you have feedback, feel free to reach out through any of the following channels:
- The [#sig-cloud-provider](https://kubernetes.slack.com/messages/sig-cloud-provider) channel on [Kubernetes Slack](https://slack.k8s.io/)
- The [KEP-5237 issue](https://kep.k8s.io/5237) on GitHub
- The [SIG Cloud Provider community page](https://github.com/kubernetes/community/tree/05223ecbd2d6f960edb40684dc83d053d49f8b68/sig-cloud-provider) for other communication channels
-->
如果你有反馈，欢迎通过以下任一渠道联系我们：

- [Kubernetes Slack](https://slack.k8s.io/) 上的
  [#sig-cloud-provider](https://kubernetes.slack.com/messages/sig-cloud-provider) 频道
- GitHub 上的 [KEP-5237 Issue](https://kep.k8s.io/5237)
- [SIG Cloud Provider 社区页面](https://github.com/kubernetes/community/tree/05223ecbd2d6f960edb40684dc83d053d49f8b68/sig-cloud-provider)了解其他沟通渠道

<!--
## How can I learn more?
-->
## 我如何了解更多？

<!--
For more details, refer to [KEP-5237](https://kep.k8s.io/5237).
-->
有关更多详细信息，请参阅 [KEP-5237](https://kep.k8s.io/5237)。