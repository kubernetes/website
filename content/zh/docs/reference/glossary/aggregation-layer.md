---
title: 聚合层
id: aggregation-layer
date: 2018-10-08
full_link: /zh/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/
short_description: >
  聚合层允许您在自己的集群上安装额外的 Kubernetes 风格的 API。

aka: 
tags:
- architecture
- extension
- operation
---

<!--
---
title: Aggregation Layer
id: aggregation-layer
date: 2018-10-08
full_link: /zh/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/
short_description: >
  The aggregation layer lets you install additional Kubernetes-style APIs in your cluster.

aka: 
tags:
- architecture
- extension
- operation
---
-->

<!--
 The aggregation layer lets you install additional Kubernetes-style APIs in your cluster.
-->

聚合层允许您在自己的集群上安装额外的 Kubernetes 风格的 API。

<!--more--> 

<!--
When you've configured the {{< glossary_tooltip text="Kubernetes API Server" term_id="kube-apiserver" >}} to [support additional APIs](/docs/tasks/access-kubernetes-api/configure-aggregation-layer/), you can add `APIService` objects to "claim" a URL path in the Kubernetes API.
-->

当您配置了 {{< glossary_tooltip text="Kubernetes API Server" term_id="kube-apiserver" >}} 来 [支持额外的 API](/docs/tasks/access-kubernetes-api/configure-aggregation-layer/)，您就可以在 Kubernetes API 中增加 `APIService` 对象来  "申领（Claim）" 一个 URL 路径。 
