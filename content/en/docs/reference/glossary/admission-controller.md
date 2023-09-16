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
A piece of code that intercepts requests to the Kubernetes API server prior to persistence of the object.

<!--more-->

Admission controllers are configurable for the Kubernetes API server and may be "validating", "mutating", or
both. Any admission controller may reject the request. Mutating controllers may modify the objects they admit;
validating controllers may not.
准入控制器可针对 Kubernetes API 服务器进行配置，并且可以是“验证”、“变异”或
两个都。任何准入控制器都可以拒绝该请求。变异控制器可能会修改它们承认的对象；
验证控制器可能不会。

* [Admission controllers in the Kubernetes documentation](/docs/reference/access-authn-authz/admission-controllers/)
