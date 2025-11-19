---
title: 准入控制器（Admission Controller）
id: admission-controller
date: 2019-06-28
full_link: /zh-cn/docs/reference/access-authn-authz/admission-controllers/
short_description: >
 在對象持久化之前攔截 Kubernetes API 服務器請求的一段代碼。
aka:
tags:
- extension
- security
---
<!--
title: Admission Controller
id: admission-controller
date: 2019-06-28
full_link: /docs/reference/access-authn-authz/admission-controllers/
short_description: >
  A piece of code that intercepts requests to the Kubernetes API server prior to persistence of the object.

aka:
tags:
- extension
- security
-->

<!--
A piece of code that intercepts requests to the Kubernetes API server prior to persistence of the object.
-->
在對象持久化之前攔截 Kubernetes API 服務器請求的一段代碼。

<!--more-->

<!--
Admission controllers are configurable for the Kubernetes API server and may be "validating", "mutating", or
both. Any admission controller may reject the request. Mutating controllers may modify the objects they admit;
validating controllers may not.

* [Admission controllers in the Kubernetes documentation](/docs/reference/access-authn-authz/admission-controllers/)
-->
准入控制器可針對 Kubernetes API 服務器進行配置，可以執行“驗證（validating）”、“變更（mutating）”或兩者都執行。
任何准入控制器都可以拒絕訪問請求。
變更控制器可以修改其允許的對象，驗證控制器則不可以。

* [Kubernetes 文檔中的准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/)
