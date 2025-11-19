---
title: 聚合層（Aggregation Layer）
id: aggregation-layer
date: 2018-10-08
full_link: /zh-cn/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/
short_description: >
  聚合層允許你在自己的集羣上安裝額外的 Kubernetes 風格的 API。

aka: 
tags:
- architecture
- extension
- operation
---
<!--
title: Aggregation Layer
id: aggregation-layer
date: 2018-10-08
full_link: /docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/
short_description: >
  The aggregation layer lets you install additional Kubernetes-style APIs in your cluster.

aka: 
tags:
- architecture
- extension
- operation
-->

<!--
 The aggregation layer lets you install additional Kubernetes-style APIs in your cluster.
-->
聚合層允許你在自己的集羣上安裝額外的 Kubernetes 風格的 API。

<!--more-->

<!--
When you've configured the {{< glossary_tooltip text="Kubernetes API Server" term_id="kube-apiserver" >}} to [support additional APIs](/docs/tasks/extend-kubernetes/configure-aggregation-layer/), you can add `APIService` objects to "claim" a URL path in the Kubernetes API.
-->
當你配置了
{{< glossary_tooltip text="Kubernetes API 服務器" term_id="kube-apiserver" >}}來[支持額外的 API](/zh-cn/docs/tasks/extend-kubernetes/configure-aggregation-layer/)，
你就可以在 Kubernetes API 中增加 `APIService` 對象來"申領（Claim）"一個 URL 路徑。
