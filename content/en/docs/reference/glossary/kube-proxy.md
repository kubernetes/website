---
title: kube-proxy
id: kube-proxy
date: 2018-04-12
full_link: /docs/reference/generated/kube-proxy
short_description: >
  `kube-proxy` is a network proxy that runs on each node in the cluster.

aka: 
tags:
- fundamental
- core-object
---
 `kube-proxy` is a network proxy that runs on each node in the cluster.

It enables the Kubernetes service abstraction by maintaining network rules on
the host and performing connection forwarding.

<!--more--> 

`kube-proxy` is responsible for request forwarding. `kube-proxy` allows TCP and UDP stream forwarding or round robin TCP and UDP forwarding across a set of backend functions.

