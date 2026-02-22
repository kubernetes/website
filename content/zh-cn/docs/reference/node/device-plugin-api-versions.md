---
content_type: "reference"
title: Kubelet 设备管理器 API 版本
weight: 50
---
<!--
content_type: "reference"
title: Kubelet Device Manager API Versions
weight: 50
-->

<!--
This page provides details of version compatibility between the Kubernetes
[device plugin API](https://github.com/kubernetes/kubelet/tree/master/pkg/apis/deviceplugin),
and different versions of Kubernetes itself.
-->
本页详述了 Kubernetes
[设备插件 API](https://github.com/kubernetes/kubelet/tree/master/pkg/apis/deviceplugin)
与不同版本的 Kubernetes 本身之间的版本兼容性。

<!--
## Compatibility matrix
-->
## 兼容性矩阵   {#compatibility-matrix}

|                 |  `v1alpha1` | `v1beta1`   |
|-----------------|-------------|-------------|
| Kubernetes 1.21 |  -          | ✓           |
| Kubernetes 1.22 |  -          | ✓           |
| Kubernetes 1.23 |  -          | ✓           |
| Kubernetes 1.24 |  -          | ✓           |
| Kubernetes 1.25 |  -          | ✓           |
| Kubernetes 1.26 |  -          | ✓           |

<!--
Key:

* `✓` Exactly the same features / API objects in both device plugin API and
   the Kubernetes version.
-->
简要说明：

* `✓` 设备插件 API 和 Kubernetes 版本中的特性或 API 对象完全相同。
<!--
* `+` The device plugin API has features or API objects that may not be present in the
  Kubernetes cluster, either because the device plugin API has added additional new API
  calls, or that the server has removed an old API call. However, everything they have in
  common (most other APIs) will work. Note that alpha APIs may vanish or
  change significantly between one minor release and the next.
-->
* `+` 设备插件 API 具有 Kubernetes 集群中可能不存在的特性或 API 对象，
  不是因为设备插件 API 添加了额外的新 API 调用，就是因为服务器移除了旧的 API 调用。
  但它们的共同点是（大多数其他 API）都能工作。
  请注意，Alpha API 可能会在次要版本的迭代过程中消失或出现重大变更。
<!--
* `-` The Kubernetes cluster has features the device plugin API can't use,
  either because server has added additional API calls, or that device plugin API has
  removed an old API call. However, everything they share in common (most APIs) will work.
-->
* `-` Kubernetes 集群具有设备插件 API 无法使用的特性，不是因为服务器添加了额外的 API 调用，
  就是因为设备插件 API 移除了旧的 API 调用。但它们的共同点是（大多数 API）都能工作。
