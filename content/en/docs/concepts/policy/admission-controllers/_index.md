---
title: Policy with Admission Controllers
content_type: concept
weight: 20
description: An admission controller runs in the API server and can validate or mutate API requests. Some admission controllers act as policies. For example, the AlwaysPullImages admission controller modifies a new Pod to set the image pull policy to Always.
---

An admission controller runs in the API server and can validate or mutate API requests. Some admission controllers act as policies. For example, the `AlwaysPullImages` admission controller modifies a new Pod to set the image pull policy to `Always`.

Kubernetes has several built-in admission controllers that are configurable via the API server `--enable-admission-plugins` flag.

Details on admission controllers, with the complete list of available admission controllers, are documented in a dedicated section:

* [Admission Controllers](/docs/reference/access-authn-authz/admission-controllers/)
