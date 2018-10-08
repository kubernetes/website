---
title: Aggregation Layer
id: aggregation-layer
date: 2018-10-08
full_link: /docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/
short_description: >
  A mechanism to extend Kubernetes by aggregating the existing API Server with additional Kubernetes-style APIs servers

aka: 
tags:
- architecture
- extension
- operation
---
 A mechanism used to extend Kubernetes by aggregating the existing core APIs with additional Kubernetes-style APIs.

<!--more--> 

This mechanism must be activated on the {{< glossary_tooltip text="Kubernetes API Server" term_id="kube-apiserver" >}}, then users can add APIService objects, which “claim” an URL path in the Kubernetes API.

