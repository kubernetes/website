---
layout: blog
title: 'Deprecate kustomize from kubectl'
date: YYYY-MM-DD
slug: deprecate-kustomize
author: >
  Maciej Szulik (Red Hat)
---


### Kustomize in kubectl

In the early days of Kubernetes, when not that many tools in the field of declarative
configurations existed we've decided to address the gap introducing [kustomize](https://kustomize.sigs.k8s.io).
To make life easier for kubectl users we've even decided to [include kustomize in kubectl](https://github.com/kubernetes/enhancements/blob/master/keps/sig-cli/2377-Kustomize/README.md), by default.

Over the past several years the ecosystem around Kubernetes grew significantly,
resulting in wider spread of tooling, including declarative configuration.
Several various summaries have been written about the topic over the years,
to name a few:
- [Kubernetes Configuration in 2024](https://medium.com/@bgrant0607/kubernetes-configuration-in-2024-434abc7a5a1b)
- [Kubernetes Configuration Management Simplified](https://medium.com/@zone24x7_inc/kubernetes-configuration-management-simplified-314faef059f6)
- [Rethinking Kubernetes Configuration Management](https://kluctl.io/blog/2022/05/16/rethinking-kubernetes-configuration-management/)

The main takeaway from these articles is that multiple tools exist, and each of
them has their own pros and cons.  Thus, it's best left to a user to match their
use cases with the best tool capable of resolving the problem at hand.

### Plugins in kubectl

In the mean time, we in [SIG CLI](https://github.com/kubernetes/community/tree/master/sig-cli)
have been hard at work to address the problem of extensibility.  Over the past
years, we've introduced [kubectl plugins](/docs/tasks/extend-kubectl), and polished
it with various improvements, like autocompletion.
On top of that we've build a whole community around plugins.  The best example
is [krew](https://krew.sigs.k8s.io), which allows discovery, installation and
updates of your plugins.  It was conscious decision on our part not to include
plugin manager inside kubectl, but rather allow one to be created organically
as a plugin.  As of this writing, krew provides a broad variety of plugins
through its [centralized plugin index](https://github.com/kubernetes-sigs/krew).

### Kustomize deprecation

After multiple discussions during our [bi-weekly meetings](https://docs.google.com/document/d/1I1UFGHMDO7mMbDbioQp52DEJXEhk1qymch3qL5-EN10/edit#bookmark=id.da6ykky890fn)
and other in-person conversations during various events, we've decided that,
using kubectl plugins, users have the ability to pick and choose the best tool
to match their needs. Thus we're starting the deprecation process for kustomize.
The [official policy](https://kubernetes.io/docs/reference/using-api/deprecation-policy/)
obliges us to keep a deprecated feature available for at least "12 months or 2
releases (whichever is longer)", but given how long kustomize has been available,
we're planning to extend the deprecation even longer. The exact timeline, which
might change based on the feedback, is currently described in
[the enhancement](https://github.com/kubernetes/enhancements/blob/master/keps/sig-cli/4706-deprecate-and-remove-kustomize/README.md).

We would like to hear from you! Feel free to reach out to us through the usual
means of [communication: mailing list, slack or hop on our bi-weekly call](https://github.com/kubernetes/community/tree/master/sig-cli/#contact).
You can also drop a comment in the [issue tracking the deprecation process](https://github.com/kubernetes/enhancements/issues/4706).
