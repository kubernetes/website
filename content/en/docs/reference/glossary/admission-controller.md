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

Admission controllers are configurable for the Kubernetes API server and may be “validating”, “mutating”, or
both. Any admission controller may reject the request. Mutating controllers may modify the objects they admit;
validating controllers may not.

* [Admission controllers in the Kubernetes documentation](/docs/reference/access-authn-authz/admission-controllers/)
