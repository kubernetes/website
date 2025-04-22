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

As of Kubernetes 1.33, the Endpoints API is now officially deprecated,
and the API server will return warnings to users who read or write
Endpoints resources rather than using EndpointSlices.

Eventually, the plan (as documented in [KEP-4794]) is to change the
[Kubernetes Conformance] criteria to no longer require that clusters
run the _Endpoints controller_ (which generates Endpoints objects
based on Services and Pods), to avoid doing work that is unneeded in
most modern-day clusters.

Thus, while the [Kubernetes deprecation policy] means that the
Endpoints type itself will probably never completely go away, users
who still have workloads or scripts that use the Endpoints API should
start migrating them to EndpointSlices.

[EndpointSlices]: /blog/2020/09/02/scaling-kubernetes-networking-with-endpointslices/
[KEP-752]: https://github.com/kubernetes/enhancements/blob/master/keps/sig-network/0752-endpointslices/README.md
[dual-stack networking]: /docs/concepts/services-networking/dual-stack/
[traffic distribution]: /docs/reference/networking/virtual-ips/#traffic-distribution
[Kubernetes deprecation policy]: /docs/reference/using-api/deprecation-policy/
[KEP-4974]: https://github.com/kubernetes/enhancements/blob/master/keps/sig-network/4974-deprecate-endpoints/README.md
[Kubernetes Conformance]: https://www.cncf.io/training/certification/software-conformance/

## Notes on migrating from Endpoints to EndpointSlices

### Consuming EndpointSlices rather than Endpoints

For end users, the biggest change between the Endpoints API and the
EndpointSlice API is that while every Service with a `selector` has
exactly 1 Endpoints object (with the same name as the Service), a
Service may have any number of EndpointSlices associated with it:

```console
$ kubectl get endpoints myservice
Warning: v1 Endpoints is deprecated in v1.33+; use discovery.k8s.io/v1 EndpointSlice
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
shows only the addresses in the cluster's primary address family.)
Although any Service with multiple endpoints _can_ have multiple
EndpointSlices, there are three main cases where you will see this:

  - An EndpointSlice can only represent endpoints of a single IP
    family, so dual-stack Services will have separate EndpointSlices
    for IPv4 and IPv6.

  - All of the endpoints in an EndpointSlice must target the same
    ports. So, for example, if you have a set of endpoint Pods
    listening on port 80, and roll out an update to make them listen
    on port 8080 instead, then while the rollout is in progress, the
    Service will need 2 EndpointSlices: 1 for the endpoints listening
    on port 80, and 1 for the endpoints listening on port 8080.

  - When a Service has more than 100 endpoints, the EndpointSlice
    controller will split the endpoints into multiple EndpointSlices
    rather than aggregating them into a single excessively-large
    object like the Endpoints controller does.

Because there is not a predictable 1-to-1 mapping between Services and
EndpointSlices, there is no way to know what the actual name of the
EndpointSlice resource(s) for a Service will be ahead of time; thus,
instead of fetching the EndpointSlice(s) by name, you instead ask for
all EndpointSlices with a "`kubernetes.io/service-name`"
[label](/docs/concepts/overview/working-with-objects/labels/) pointing
to the Service:

```console
$ kubectl get endpointslice -l kubernetes.io/service-name=myservice
```

A similar change is needed in Go code. With Endpoints, you would do
something like:

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

With EndpointSlices, this becomes:

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

### Generating EndpointSlices rather than Endpoints

For people (or controllers) generating Endpoints, migrating to
EndpointSlices is slightly easier, because in most cases you won't
have to worry about multiple slices. You just need to update your YAML
or Go code to use the new type (which organizes the information in a
slightly different way than Endpoints did).

For example, this Endpoints object:

```yaml
apiVersion: v1
kind: Endpoints
metadata:
  name: myservice
subsets:
  - addresses:
      - ip: 10.180.3.17
        nodeName: node-4
      - ip: 10.180.5.22
        nodeName: node-9
      - ip: 10.180.18.2
        nodeName: node-7
    notReadyAddresses:
      - ip: 10.180.6.6
        nodeName: node-8
    ports:
      - name: https
        protocol: TCP
        port: 443
```

would become something like:

```yaml
apiVersion: discovery.k8s.io/v1
kind: EndpointSlice
metadata:
  name: myservice
  labels:
    kubernetes.io/service-name: myservice
addressType: IPv4
endpoints:
  - addresses:
      - 10.180.3.17
    nodeName: node-4
  - addresses:
      - 10.180.5.22
    nodeName: node-9
  - addresses:
      - 10.180.18.12
    nodeName: node-7
  - addresses:
      - 10.180.6.6
    nodeName: node-8
    conditions:
      ready: false
ports:
  - name: https
    protocol: TCP
    port: 443
```

Some points to note:

1. This example uses an explicit `name`, but you could also use
`generateName` and let the API server append a unique suffix. The name
itself does not matter: what matters is the
`"kubernetes.io/service-name"` label pointing back to the Service.

2. You have to explicitly indicate `addressType: IPv4` (or `IPv6`).

3. An EndpointSlice is similar to a single element of the `"subsets"`
array in Endpoints. An Endpoints object with multiple subsets will
normally need to be expressed as multiple EndpointSlices, each with
different `"ports"`.

4. The `endpoints` and `addresses` fields are both arrays, but by
convention, each `addresses` array only contains a single element. If
your Service has multiple endpoints, then you need to have multiple
elements in the `endpoints` array, each with a single element in its
`addresses` array.

5. The Endpoints API lists "ready" and "not-ready" endpoints
separately, while the EndpointSlice API allows each endpoint to have
conditions (such as "`ready: false`") associated with it.

And of course, once you have ported to EndpointSlice, you can make use
of EndpointSlice-specific features, such as topology hints and
terminating endpoints. Consult the
[EndpointSlice API documentation](/docs/reference/kubernetes-api/service-resources/endpoint-slice-v1)
for more information.
