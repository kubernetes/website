---
content_type: "reference"
title: Kubelet 設備管理器 API 版本
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
本頁詳述了 Kubernetes
[設備插件 API](https://github.com/kubernetes/kubelet/tree/master/pkg/apis/deviceplugin)
與不同版本的 Kubernetes 本身之間的版本兼容性。

<!--
## Compatibility matrix
-->
## 兼容性矩陣   {#compatibility-matrix}

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
簡要說明：

* `✓` 設備插件 API 和 Kubernetes 版本中的特性或 API 對象完全相同。
<!--
* `+` The device plugin API has features or API objects that may not be present in the
  Kubernetes cluster, either because the device plugin API has added additional new API
  calls, or that the server has removed an old API call. However, everything they have in
  common (most other APIs) will work. Note that alpha APIs may vanish or
  change significantly between one minor release and the next.
-->
* `+` 設備插件 API 具有 Kubernetes 集羣中可能不存在的特性或 API 對象，
  不是因爲設備插件 API 添加了額外的新 API 調用，就是因爲服務器移除了舊的 API 調用。
  但它們的共同點是（大多數其他 API）都能工作。
  請注意，Alpha API 可能會在次要版本的迭代過程中消失或出現重大變更。
<!--
* `-` The Kubernetes cluster has features the device plugin API can't use,
  either because server has added additional API calls, or that device plugin API has
  removed an old API call. However, everything they share in common (most APIs) will work.
-->
* `-` Kubernetes 集羣具有設備插件 API 無法使用的特性，不是因爲服務器添加了額外的 API 調用，
  就是因爲設備插件 API 移除了舊的 API 調用。但它們的共同點是（大多數 API）都能工作。
