---
title: 擴展 Kubernetes API
weight: 30
---

<!--
Custom resources are extensions of the Kubernetes API. Kubernetes provides two ways to add custom resources to your cluster:
-->
自定義資源是 Kubernetes API 的擴展。
Kubernetes 提供了兩種將自定義資源添加到集羣的方法：

<!--
- The [CustomResourceDefinition](/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
  (CRD) mechanism allows you to declaratively define a new custom API with an API group, kind, and
  schema that you specify.
  The Kubernetes control plane serves and handles the storage of your custom resource. CRDs allow you to
  create new types of resources for your cluster without writing and running a custom API server.
-->
- [CustomResourceDefinition](/zh-cn/docs/concepts/extend-kubernetes/api-extension/custom-resources/)（CRD）
  機制允許你通過指定自己的 API 組、種類和模式以聲明方式定義新的自定義 API。
  Kubernetes 控制平面爲自定義資源提供服務併爲其提供存儲。
  CRD 允許你爲集羣創建新的資源類別，而無需編寫和運行自定義 API 服務器。
<!--
- The [aggregation layer](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
  sits behind the primary API server, which acts as a proxy.
  This arrangement is called API Aggregation (AA), which allows you to provide
  specialized implementations for your custom resources by writing and
  deploying your own API server.
  The main API server delegates requests to your API server for the custom APIs that you specify,
  making them available to all of its clients.
-->
- [聚合層（Aggregation Layer）](/zh-cn/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)位於主
  API 服務器後面，將 API 服務器用作代理。
  這種安排稱爲 API 聚合（API Aggregation，AA），允許你通過編寫和部署自己的 API 服務器來爲自定義資源提供專門的實現。
  主 API 服務器將你指定的自定義 API 的請求委託給你的 API 服務器，使其可供所有客戶端使用。
