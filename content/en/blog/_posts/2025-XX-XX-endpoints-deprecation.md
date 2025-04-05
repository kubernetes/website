---
layout: blog
title: "Continuing the transition from Endpoints to EndpointSlices"
slug: endpoints-deprecation
date: 2025-XX-XX
draft: true
author: >
  Dan Winship (Red Hat)
---

Since the addition of [EndpointSlices] ([KEP-752]) as alpha in v1.15
and later GA in v1.21, the
Endpoints API in Kubernetes has been gathering dust. New Service
features like [dual-stack networking] and [traffic distribution] are
only supported via the EndpointSlice API, so all service proxies,
Gateway API implementations, and similar controllers have had to be
ported from using Endpoints to using EndpointSlices. At this point,
the Endpoints API is really only there to avoid breaking end user
workloads and scripts that still make use of it.

While the [Kubernetes deprecation policy] means that the Endpoints
type itself will probably never completely go away, the 1.33 release
will take a few more steps towards fully deprecating it, with
clarifications to the documentation, and warnings from the API server
when a client reads or writes Endpoints resources rather than using
EndpointSlices.

Eventually, the plan (as documented in [KEP-4794]) is to change the
[Kubernetes Conformance] criteria to no longer require that clusters
run the _Endpoints controller_ (which generates Endpoints objects
based on Services and Pods) and the _EndpointSlice mirroring
controller_ (which copies user-created Endpoints objects to equivalent
EndpointSlice objects), to avoid doing work that is unneeded in most
modern-day clusters.

Thus, although there are no changes to functionality or supportedness
in Kubernetes 1.33, users who still have workloads or scripts that use
the Endpoints API should start migrating them to EndpointSlices.

[EndpointSlices]: /blog/2020/09/02/scaling-kubernetes-networking-with-endpointslices/
[KEP-752]: https://github.com/kubernetes/enhancements/blob/master/keps/sig-network/0752-endpointslices/README.md
[dual-stack networking]: /docs/concepts/services-networking/dual-stack/
[traffic distribution]: /docs/reference/networking/virtual-ips/#traffic-distribution
[Kubernetes deprecation policy]: /docs/reference/using-api/deprecation-policy/
[KEP-4974]: https://github.com/kubernetes/enhancements/blob/master/keps/sig-network/4974-deprecate-endpoints/README.md
[Kubernetes Conformance]: https://www.cncf.io/training/certification/software-conformance/

## Notes on migrating from Endpoints to EndpointSlices

For end users, the biggest change between the Endpoints API and the
EndpointSlice API is that while every Service with a `selector` has
exactly 1 Endpoints object (with the same name as the Service), a
Service may have any number of EndpointSlices associated with it:

```console
$ kubectl get endpoints myservice
NAME        ENDPOINTS          AGE
myservice   10.180.3.17:443    1h

$ kubectl get endpointslice -l kubernetes.io/service-name=myservice
NAME              ADDRESSTYPE   PORTS   ENDPOINTS          AGE
myservice-7vzhx   IPv4          443     10.180.3.17        21s
myservice-jcv8s   IPv6          443     2001:db8:0123::5   21s
```

In this case, because the service is dual stack, it has 2
EndpointSlices: 1 for IPv4 addresses and 1 for IPv6 addresses. (The
Endpoints API does not support dual stack, so the Endpoints object
shows only the addresses in the cluster's primary address family.) A
Service can also have multiple EndpointSlices in other cases; in
particular, if it has more than 100 endpoint pods, then the endpoints
will be split up into multiple EndpointSlice objects, which can be
processed more efficiently than a single excessively-large Endpoints
object.

Because there is not a predictable 1-to-1 mapping between Services and
EndpointSlices, there is no way to know what the actual name of the
EndpointSlice resource(s) will be ahead of time; thus, instead of
fetching the EndpointSlice(s) by name, you instead ask for all
EndpointSlices with a "`kubernetes.io/service-name`" [label] pointing to
the Service. A similar change is needed in Go code:

[label]: /docs/concepts/overview/working-with-objects/labels/

```go
// Get the Endpoints named `name` in `namespace`.
endpoint, err := client.CoreV1().Endpoints(namespace).Get(ctx, name, metav1.GetOptions{})
if err != nil {
	if apierrors.IsNotFound(err) {
		// No Endpoints exists for the Service (yet?)
		...
	}
        // handle other errors
	...
}

// process `endpoint`
...
```

becomes

```go
// Get all EndpointSlices for Service `name` in `namespace`.
slices, err := client.DiscoveryV1().EndpointSlices(namespace).List(ctx,
	metav1.ListOptions{LabelSelector: discoveryv1.LabelServiceName + "=" + name})
if err != nil {
        // handle errors
	...
} else if len(slices.Items) == 0 {
	// No EndpointSlices exist for the Service (yet?)
	...
}

// process `slices.Items`
...
```
