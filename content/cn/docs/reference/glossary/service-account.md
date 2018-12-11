---
title: Service Account
id: service-account
date: 2018-04-12
full_link: /docs/tasks/configure-pod-container/configure-service-account/
short_description: >
  Provides an identity for processes that run in a Pod.

aka: 
tags:
- fundamental
- core-object
---

<!--
 Provides an identity for processes that run in a {{< glossary_tooltip text="Pod" term_id="pod" >}}.

<!--more--> 

When processes inside Pods access the cluster, they are authenticated by the API server as a particular service account, for example, `default`. When you create a Pod, if you do not specify a service account, it is automatically assigned the default service account in the same namespace {{< glossary_tooltip text="Namespace" term_id="namespace" >}}.
-->


为在{{<glossary_tooltip text =“Pod”term_id =“pod”>}}中运行的进程提供标识。

<!--更多-->

当 Pods 中的进程访问集群时，它们将作为特定服务帐户由 API 服务器进行身份验证, 例如 `default`。创建 Pod 时，如果未指定服务帐户, 则会在同一名称空间中自动为其分配默认服务帐户{{<glossary_tooltip text =“Namespace”term_id =“namespace”>}}。

