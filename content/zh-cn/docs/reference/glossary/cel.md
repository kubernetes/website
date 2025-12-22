---
title: 通用表达式语言（CEL）
id: cel
date: 2025-06-04
full_link: https://cel.dev
short_description: >
  一种为安全执行用户代码而设计的表达式语言。
tags:
- extension
- fundamental
aka:
- CEL
---
<!--
title: Common Expression Language
id: cel
date: 2025-06-04
full_link: https://cel.dev
short_description: >
  An expression language that's designed to be safe for executing user code.
tags:
- extension
- fundamental
aka:
- CEL
-->

<!--
A general-purpose expression language that's designed to be fast, portable, and
safe to execute.
-->
一种通用的表达式语言，其设计目标是快速执行、可移植，并且具备安全性。

<!--more-->

<!--
In Kubernetes, CEL can be used to run queries and perform fine-grained
filtering. For example, you can use CEL expressions with
[dynamic admission control](/docs/reference/access-authn-authz/extensible-admission-controllers/)
to filter for specific fields in requests, and with
[dynamic resource allocation (DRA)](/docs/concepts/scheduling-eviction/dynamic-resource-allocation)
to select resources based on specific attributes.
-->
在 Kubernetes 中，CEL 可用于运行查询并进行细粒度的筛选。例如，你可以将 CEL
表达式用于[动态准入控制](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/)，  
以筛选请求中的特定字段；也可以与[动态资源分配（DRA）](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation)结合使用，
基于特定属性选择资源。
