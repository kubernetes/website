---
title: 通用表達式語言（CEL）
id: cel
date: 2025-06-04
full_link: https://cel.dev
short_description: >
  一種爲安全執行使用者代碼而設計的表達式語言。
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
一種通用的表達式語言，其設計目標是快速執行、可移植，並且具備安全性。

<!--more-->

<!--
In Kubernetes, CEL can be used to run queries and perform fine-grained
filtering. For example, you can use CEL expressions with
[dynamic admission control](/docs/reference/access-authn-authz/extensible-admission-controllers/)
to filter for specific fields in requests, and with
[dynamic resource allocation (DRA)](/docs/concepts/scheduling-eviction/dynamic-resource-allocation)
to select resources based on specific attributes.
-->
在 Kubernetes 中，CEL 可用於運行查詢並進行細粒度的篩選。例如，你可以將 CEL
表達式用於[動態准入控制](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/)，  
以篩選請求中的特定字段；也可以與[動態資源分配（DRA）](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation)結合使用，
基於特定屬性選擇資源。
