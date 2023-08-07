---
title: Mixed Version Proxy (MVP)
id: mvp
date: 2023-07-24
full_link: /docs/concepts/architecture/mixed-version-proxy#Enabling-the-Mixed-Version-Proxy
short_description: >
  Feature that lets a kube-apiserver proxy a resource request to a different peer API server. 
aka: ["MVP"]
tags:
- architecture
---
Feature to let a kube-apiserver proxy a resource request to a different peer API server.

<!--more-->

When a cluster has multiple API servers running different versions of Kubernetes, this 
feature enables resource requests to be served by the correct API server.

MVP is disabled by default and can be activated by enabling
the feature gate named `UnknownVersionInteroperabilityProxy` when 
{{< glossary_tooltip text="API Server" term_id="kube-apiserver" >}} is started.
