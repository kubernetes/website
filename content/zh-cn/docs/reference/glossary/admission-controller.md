---
title: 准入控制器（Admission Controller）
id: admission-controller
date: 2019-06-28
full_link: /zh-cn/docs/reference/access-authn-authz/admission-controllers/
short_description: >
 在对象持久化之前拦截 Kubernetes Api 服务器请求的一段代码
aka:
tags:
- extension
- security
---


<!--
---
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
---																										 
-->


<!--
A piece of code that intercepts requests to the Kubernetes API server prior to persistence of the object.
-->
在对象持久化之前拦截 Kubernetes Api 服务器请求的一段代码

<!--more-->

<!--
Admission controllers are configurable for the Kubernetes API server and may be “validating”, “mutating”, or
both. Any admission controller may reject the request. Mutating controllers may modify the objects they admit;
validating controllers may not.

* [Admission controllers in the Kubernetes documentation](/docs/reference/access-authn-authz/admission-controllers/)
-->

准入控制器可针对 Kubernetes Api 服务器进行配置，可以执行验证，变更或两者都执行。任何准入控制器都可以拒绝访问请求。
变更（mutating）控制器可以修改其允许的对象，验证（validating）控制器则不可以。

* [Kubernetes 文档中的准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/)