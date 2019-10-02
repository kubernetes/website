---
title: Endpoint Slice
id: endpoint-slice
date: 2018-04-12
full_link: /docs/concepts/services-networking/endpoint-slices/
short_description: >
  A way to group network endpoints together with Kubernetes resources.

aka:
tags:
- networking
---
 A way to group network endpoints together with Kubernetes resources.

<!--more-->

A scalable and extensible way to group network endpoints together. These can be
used by {{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}} to
establish network routes on each {{< glossary_tooltip text="node" term_id="node" >}}.
