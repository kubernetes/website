---
layout: blog
title: "Kubernetes v1.35：云控制器管理器中的基于 Watch 的路由协调"
date: 2025-10-27T08:30:00-07:00
draft: true
slug: watch-based-route-reconciliation-in-ccm
author: >
  [Lukas Metzner](https://github.com/lukasmetzner) (Hetzner)
translator: >
  [Xin Li](https://github.com/my-git9) (DaoCloud)
---

<!--
layout: blog
title: "Kubernetes v1.35: Watch Based Route Reconciliation in the Cloud Controller Manager"
date: 2025-10-27T08:30:00-07:00
draft: true
slug: watch-based-route-reconciliation-in-ccm
author: >
  [Lukas Metzner](https://github.com/lukasmetzner) (Hetzner)
-->

<!--
Up to and including Kubernetes v1.34, the route controller in
Cloud Controller Manager (CCM) implementations built using the
[k8s.io/cloud-provider](https://github.com/kubernetes/cloud-provider)
library reconciles routes at a fixed interval.
This causes unnecessary API requests to the cloud provider when
there are no changes to routes. 
Other controllers implemented through the same library already
use watch-based mechanisms, leveraging informers to avoid unnecessary API calls.
A new feature gate is being introduced in v1.35 to allow changing the behavior of
the route controller to use watch-based informers.
-->
截至 Kubernetes v1.34，使用
[k8s.io/cloud-provider](https://github.com/kubernetes/cloud-provider)
库构建的云控制器管理器（CCM）实现中的路由控制器以固定间隔协调路由。
这在路由没有变化时导致了不必要的 API 请求。
通过相同库实现的其他控制器已经使用基于 Watch 的机制，利用 Informer
来避免不必要的 API 调用。
在 v1.35 中，引入了一个新的**特性门控**，允许更改路由控制器的行为以使用基于
Watch 的 Informer。

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
## 新的变化

`CloudControllerManagerWatchBasedRoutesReconciliation` **特性门控**已由
[SIG Cloud Provider](https://github.com/kubernetes/community/blob/master/sig-cloud-provider/README.md)
在 [k8s.io/cloud-provider](https://github.com/kubernetes/cloud-provider)
中作为 Alpha 级别特性引入。
要启用此特性，你可以在使用的 CCM 实现中使用
`--feature-gate=CloudControllerManagerWatchBasedRoutesReconciliation=true`
标志。

<!--
## About the feature gate

This feature gate will trigger the route reconciliation loop
whenever a node is added, deleted, or the fields `.spec.podCIDRs`
or `.status.addresses` are updated.
-->
## 关于特性门控

此特性门控将在节点被添加、删除或字段 `.spec.podCIDRs` 或 `.status.addresses`
被更新时，触发路由协调循环。

<!--
An additional reconcile is performed in a random interval between 12h and 24h,
which is chosen at the controller's start time.
-->
另外，在控制器启动时会随机选择一个 12 到 24 小时之间的间隔进行额外的协调。

<!--
This feature gate does not modify the logic within the reconciliation loop.
Therefore, users of a CCM implementation should not experience significant
changes to their existing route configurations.
-->
此特性门控不会修改协调循环内的逻辑。
因此，CCM 实现的用户不应体验到对其现有路由配置的重大变更。

<!--
## How can I learn more?

For more details, refer to the [KEP-5237](https://kep.k8s.io/5237).
-->
## 了解更多

欲获取更多详情，请参阅 [KEP-5237](https://kep.k8s.io/5237)。

