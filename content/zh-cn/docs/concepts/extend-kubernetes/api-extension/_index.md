---
title: 扩展 Kubernetes API
weight: 30
---

<!--
Custom resources are extensions of the Kubernetes API. Kubernetes provides two ways to add custom resources to your cluster:
-->
自定义资源是 Kubernetes API 的扩展。
Kubernetes 提供了两种将自定义资源添加到集群的方法：

<!--
- The [CustomResourceDefinition](/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
  (CRD) mechanism allows you to declaratively define a new custom API with an API group, kind, and
  schema that you specify.
  The Kubernetes control plane serves and handles the storage of your custom resource. CRDs allow you to
  create new types of resources for your cluster without writing and running a custom API server.
-->
- [CustomResourceDefinition](/zh-cn/docs/concepts/extend-kubernetes/api-extension/custom-resources/)（CRD）
  机制允许你通过指定自己的 API 组、种类和模式以声明方式定义新的自定义 API。
  Kubernetes 控制平面为自定义资源提供服务并为其提供存储。
  CRD 允许你为集群创建新的资源类别，而无需编写和运行自定义 API 服务器。
<!--
- The [aggregation layer](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
  sits behind the primary API server, which acts as a proxy.
  This arrangement is called API Aggregation (AA), which allows you to provide
  specialized implementations for your custom resources by writing and
  deploying your own API server.
  The main API server delegates requests to your API server for the custom APIs that you specify,
  making them available to all of its clients.
-->
- [聚合层（Aggregation Layer）](/zh-cn/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)位于主
  API 服务器后面，将 API 服务器用作代理。
  这种安排称为 API 聚合（API Aggregation，AA），允许你通过编写和部署自己的 API 服务器来为自定义资源提供专门的实现。
  主 API 服务器将你指定的自定义 API 的请求委托给你的 API 服务器，使其可供所有客户端使用。
