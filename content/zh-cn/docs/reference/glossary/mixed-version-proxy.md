---
title: 混合版本代理
id: mvp
date: 2023-07-24
full_link: /zh-cn/docs/concepts/architecture/mixed-version-proxy/
short_description: >
  此特性使 kube-apiserver 能够将资源请求代理到另一个对等 API 服务器。
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
此特性使 kube-apiserver 能够将资源请求代理到另一个对等 API 服务器。

<!--more-->

<!--
When a cluster has multiple API servers running different versions of Kubernetes, this 
feature enables resource requests to be served by the correct API server.

MVP is disabled by default and can be activated by enabling
the [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) named `UnknownVersionInteroperabilityProxy` when 
the {{< glossary_tooltip text="API Server" term_id="kube-apiserver" >}} is started.
-->
当集群中多个 API 服务器在运行不同版本 Kubernetes 时，此特性可以确保资源请求由正确的 API 服务器处理。

MVP 默认被禁用，可以在 {{< glossary_tooltip text="API 服务器" term_id="kube-apiserver" >}}启动时通过启用名为
`UnknownVersionInteroperabilityProxy` 的[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)来激活。
