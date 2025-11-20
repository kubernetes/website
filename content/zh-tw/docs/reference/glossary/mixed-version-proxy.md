---
title: 混合版本代理
id: mvp
date: 2023-07-24
full_link: /zh-cn/docs/concepts/architecture/mixed-version-proxy/
short_description: >
  此特性使 kube-apiserver 能夠將資源請求代理到另一個對等 API 伺服器。
aka: ["MVP"]
tags:
- architecture
---
<!--
title: Mixed Version Proxy (MVP)
id: mvp
date: 2023-07-24
full_link: /docs/concepts/architecture/mixed-version-proxy/
short_description: >
  Feature that lets a kube-apiserver proxy a resource request to a different peer API server. 
aka: ["MVP"]
tags:
- architecture
-->

<!--
Feature to let a kube-apiserver proxy a resource request to a different peer API server.
-->
此特性使 kube-apiserver 能夠將資源請求代理到另一個對等 API 伺服器。

<!--more-->

<!--
When a cluster has multiple API servers running different versions of Kubernetes, this
feature enables {{< glossary_tooltip text="resource" term_id="api-resource" >}}
requests to be served by the correct API server.

MVP is disabled by default and can be activated by enabling
the [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) named `UnknownVersionInteroperabilityProxy` when 
the {{< glossary_tooltip text="API Server" term_id="kube-apiserver" >}} is started.
-->
當叢集中多個 API 伺服器在運行不同版本 Kubernetes 時，
此特性可以確保{{< glossary_tooltip text="資源" term_id="api-resource" >}}請求由正確的
API 伺服器處理。

MVP 預設被禁用，可以在 {{< glossary_tooltip text="API 伺服器" term_id="kube-apiserver" >}}啓動時通過啓用名爲
`UnknownVersionInteroperabilityProxy` 的[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)來激活。
