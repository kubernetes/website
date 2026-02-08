---
layout: blog
title: "Kubernetes v1.35：云控制器管理器中的基于监视的路由协调"
date: 2026-01-08T10:30:00-08:00
slug: kubernetes-v1-35-watch-based-route-reconciliation-in-ccm
author: >
  [Lukas Metzner](https://github.com/lukasmetzner) (Hetzner)
translator: >
  [Xin Li](https://github.com/my-git9)
---

<!--
---
layout: blog
title: "Kubernetes v1.35: Watch Based Route Reconciliation in the Cloud Controller Manager"
date: 2026-01-08T10:30:00-08:00
slug: kubernetes-v1-35-watch-based-route-reconciliation-in-ccm
author: >
  [Lukas Metzner](https://github.com/lukasmetzner) (Hetzner)
---
-->

<!--
Up to and including Kubernetes v1.34,
the route controller in Cloud Controller Manager (CCM)
implementations built using the
[k8s.io/cloud-provider](https://github.com/kubernetes/cloud-provider)
library reconciles routes at a fixed interval.
This causes unnecessary API requests to the cloud provider when
there are no changes to routes. Other controllers implemented
through the same library already use watch-based mechanisms,
leveraging informers to avoid unnecessary API calls.
A new feature gate is being introduced in v1.35 to allow
changing the behavior of the route controller to use watch-based informers.
-->
在 Kubernetes v1.34 及更早版本中，使用
[k8s.io/cloud-provider](https://github.com/kubernetes/cloud-provider)
库构建的云控制器管理器（CCM）实现中的路由控制器会以固定的时间间隔进行路由协调。
这会导致在路由没有变化的情况下，向云提供商发出不必要的 API 请求。
其他使用同一库实现的控制器已经使用基于监听的机制，
利用 informer 来避免不必要的 API 调用。
v1.35 版本引入了一个新的特性门控，允许更改路由控制器的行为，
使其使用基于监听的 informer。

<!--
## What's new?

The feature gate `CloudControllerManagerWatchBasedRoutesReconciliation`
has been introduced to
[k8s.io/cloud-provider](https://github.com/kubernetes/cloud-provider)
in alpha stage by
[SIG Cloud Provider](https://github.com/kubernetes/community/blob/master/sig-cloud-provider/README.md).
To enable this feature you can use
`--feature-gate=CloudControllerManagerWatchBasedRoutesReconciliation=true`
in the CCM implementation you are using.
-->
## 新特性

[SIG Cloud Provider](https://github.com/kubernetes/community/blob/master/sig-cloud-provider/README.md)
已在 [k8s.io/cloud-provider](https://github.com/kubernetes/cloud-provider)
引入了 Alpha 阶段的 `CloudControllerManagerWatchBasedRoutesReconciliation`
特性门控。要启用此特性，你可以在使用的 CCM 实现中使用
`--feature-gate=CloudControllerManagerWatchBasedRoutesReconciliation=true`
参数。

<!--
## About the feature gate
-->
## 关于此特性门控

<!--
This feature gate will trigger the route reconciliation loop whenever a node is
added, deleted, or the fields `.spec.podCIDRs` or `.status.addresses` are updated.

An additional reconcile is performed in a random interval between 12h and 24h,
which is chosen at the controller's start time.
-->
此特性门控会在节点添加、删除 `.spec.podCIDRs` 或
`.status.addresses` 字段更新时触发路由协调循环。

此外，还会以 12 小时到 24 小时之间的随机间隔执行一次额外的协调，
该间隔在控制器启动时确定。

<!--
This feature gate does not modify the logic within the reconciliation loop.
Therefore, users of a CCM implementation should not experience significant
changes to their existing route configurations.
-->
此特性门控不会修改协调循环内的逻辑。
因此，CCM 实现的用户不应遇到现有路由配置的重大变化。

<!--
## How can I learn more?

For more details, refer to the [KEP-5237](https://kep.k8s.io/5237).
-->
## 如何了解更多？

更多详情请参阅
[KEP-5237](https://kep.k8s.io/5237)。

