---
title: Unknown Version Interoperability Proxy (UVIP)
id: uvip
date: 2023-07-24
full_link: /docs/concepts/architecture/unknown-version-interoperability-proxy#Enabling-UVIP
short_description: >
  Feature that lets a kube-apiserver proxy a resource request to a different peer API server. 

aka:
tags:
- architecture
---
Feature that lets a kube-apiserver proxy a resource request to a different peer API server.

<!--more-->

When a cluster has multiple API servers running different versions of Kubernetes, this feature enables resource requests to be served by the correct API server.
