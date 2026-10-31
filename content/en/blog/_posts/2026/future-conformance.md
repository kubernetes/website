---
layout: blog
title: "The future called; it wants your cluster to pass Kubernetes Conformance"
draft: true
slug: future-conformance
author: >
  Dan Winship (Red Hat)
---

The [Certified Kubernetes Conformance Program] was [created in 2017]
to "give users the confidence that when they use a Certified
Kubernetes™ product, they can rely on a high level of common
functionality". Within a month of the (beta) launch of the program,
[32 vendors had already submitted conformance results]. Today there
are more than 90 Certified Kubernetes Offerings.

While the set of functionality covered by Kubernetes Conformance has
grown over time, there are still unfortunately some gaps. Networking
functionality, in particular, has been difficult to include in the
Conformance test suite, because so much of what is considered standard
Kubernetes networking functionality is implemented not by Kubernetes
itself, but by third-party network plugins developed by the larger
CNCF community. These plugins generally do not put out new releases in
sync with Kubernetes itself, so there's no easy way for SIG Network to
know when a new networking feature is likely to be available in the
majority of clusters. As a result, we have generally avoided adding
new networking requirements to the conformance suite, but this, in
turn, has resulted in network plugin developers being less likely to
implement those features promptly, resulting in a highly fragmented
networking feature landscape.

To help solve this problem, the Kubernetes project is introducing the
idea of "Future Conformance", as a way of explicitly marking tests in
the Kubernetes end-to-end test suite which will become Conformance
requirements in a future release.

If you are an end user of Kubernetes, you don't need to take any
action: the only change you will see as a result of this is that, in
the future, there be more functionality that is guaranteed to work in
the same way in all Certified Kubernetes clusters (and _likely_ to
work in the same way in most non-certified clusters too).

However, if you are a distributor or service provider for a Certified
Kubernetes distribution, or a developer of third-party components used
by Certified Kubernetes distributions, you will want to start paying
attention to "Future Conformance" tests, to ensure you have plenty of
time to plan for upcoming conformance requirements.

## Future Conformance in 1.38

To understand how "Future Conformance" is being used, consider this
description of a Service feature [from the official Kubernetes
documentation]:

> **Port definitions**
> 
> Port definitions in Pods have names, and you can reference these
> names in the targetPort attribute of a Service. For example, we can
> bind the targetPort of the Service to the Pod port in the following
> way:
> 
>     apiVersion: v1
>     kind: Service
>     metadata:
>       name: nginx-service
>     spec:
>       selector:
>         app.kubernetes.io/name: proxy
>       ports:
>       - name: name-of-service-port
>         protocol: TCP
>         port: 80
>         targetPort: http-web-svc
> 
>     ---
>     apiVersion: v1
>     kind: Pod
>     metadata:
>       name: nginx
>       labels:
>         app.kubernetes.io/name: proxy
>     spec:
>       containers:
>       - name: nginx
>         image: nginx:stable
>         ports:
>           - containerPort: 80
>             name: http-web-svc
> 
> _This works even if there is a mixture of Pods in the Service using
> a single configured name, with the same network protocol available
> via different port numbers._ This offers a lot of flexibility for
> deploying and evolving your Services. For example, you can change
> the port numbers that Pods expose in the next version of your
> backend software, without breaking clients.

(Emphasis added.)

Although this has been documented since the very early days of
Kubernetes, SIG Network noticed last year that we didn't have a
conformance test for this behavior. But when we added the e2e test for
it, we discovered that some service proxy implementations don't
actually implement the behavior described by the documentation. In
fact, even the official Windows kube-proxy implementation got this
wrong!

In Kubernetes 1.38, the test of this functionality has been tagged for
future conformance, and if you run the full 1.38 e2e test suite, you
will see a test with the name

> `[It] [sig-network] Services should support named targetPorts that resolve to different ports on different endpoints [FutureConformance] [Conformance: [>=1.41]]`

The `[FutureConformance]` label indicates that the test will become a
conformance requirement in a future release, with the `[Conformance:
[>=1.41]]` constraint showing the release where it will become
required (Kubernetes 1.41, presumably about a year after 1.38).

In 1.38, this test is still ignored by formal conformance testing; if
you run [`sonobuoy --certified-conformance`], [`hydrophone
--conformance`], or any other standard method of running the 1.38
conformance suite, it will skip over this test, just like any other
non-`[Conformance]` e2e test. However, starting in 1.41, the
`[FutureConformance]` label will switch to `[Conformance]`, and the
test will become a requirement for conformance.

Both `sonobuoy` and `hydrophone` are being updated
with `--future-conformance` flags, to help people run tests tagged
with `[FutureConformance]`. The Kubernetes Project recommends that
distributors and service providers submitting conformance test results
should begin also testing their clusters against future conformance
criteria, to learn if anything about the configuration of their
clusters, or the software deployed in them, conflicts with future
conformance requirements.

<!-- FIXME: probably "are being updated" → "have been updated" in the
previous paragraph by the time this is published -->

Likewise, developers 

<!-- FIXME, finish -->

[Certified Kubernetes Conformance Program]: https://www.cncf.io/training/certification/software-conformance/
[created in 2017]: /blog/2017/10/software-conformance-certification/
[32 vendors had already submitted conformance results]: /blog/2017/11/certified-kubernetes-conformance/
[from the official Kubernetes documentation]: https://kubernetes.io/docs/concepts/services-networking/service/#field-spec-ports
[`sonobuoy --certified-conformance`, `hydrophone --conformance`
