---
layout: blog
title: "Kubernetes 1.28: A New (alpha) Mechanism For Safer Cluster Upgrades"
date: 2023-08-28
slug: kubernetes-1-28-feature-mixed-version-proxy-alpha
author: >
  Richa Banker (Google)
---

This blog describes the _mixed version proxy_, a new alpha feature in Kubernetes 1.28. The
mixed version proxy enables an HTTP request for a resource to be served by the correct API server
in cases where there are multiple API servers at varied versions in a cluster. For example,
this is useful during a cluster upgrade, or when you're rolling out the runtime configuration of
the cluster's control plane.

## What problem does this solve?
When a cluster undergoes an upgrade, the kube-apiservers existing at different versions in that scenario can serve different sets (groups, versions, resources) of built-in resources. A resource request made in this scenario may be served by any of the available apiservers, potentially resulting in the request ending up at an apiserver that may not be aware of the requested resource; consequently it being served a 404 not found error which is incorrect. Furthermore, incorrect serving of the 404 errors can lead to serious consequences such as namespace deletion being blocked incorrectly or objects being garbage collected mistakenly.

## How do we solve the problem?

{{< figure src="/images/blog/2023-08-28-a-new-alpha-mechanism-for-safer-cluster-upgrades/mvp-flow-diagram.svg" class="diagram-large" >}}

The new feature “Mixed Version Proxy” provides the kube-apiserver with the capability to proxy a request to a peer kube-apiserver which is aware of the requested resource and hence can serve the request. To do this, a new filter has been added to the handler chain in the API server's aggregation layer.

1. The new filter in the handler chain checks if the request is for a group/version/resource that the apiserver doesn't know about (using the existing [StorageVersion API](https://github.com/kubernetes/kubernetes/blob/release-1.28/pkg/apis/apiserverinternal/types.go#L25-L37)). If so, it proxies the request to one of the apiservers that is listed in the ServerStorageVersion object. If the identified peer apiserver fails to respond (due to reasons like network connectivity, race between the request being received and the controller registering the apiserver-resource info in ServerStorageVersion object), then error 503("Service Unavailable") is served.
2. To prevent indefinite proxying of the request, a (new for v1.28) HTTP header `X-Kubernetes-APIServer-Rerouted: true` is added to the original request once it is determined that the request cannot be served by the original API server. Setting that to true marks that the original API server couldn't handle the request and it should therefore be proxied. If a destination peer API server sees this header, it never proxies the request further.
3. To set the network location of a kube-apiserver that peers will use to proxy requests, the value passed in `--advertise-address` or (when `--advertise-address` is unspecified) the `--bind-address` flag is used. For users with network configurations that would not allow communication between peer kube-apiservers using the addresses specified in these flags, there is an option to pass in the correct peer address as `--peer-advertise-ip` and `--peer-advertise-port` flags that are introduced in this feature.

## How do I enable this feature?
Following are the required steps to enable the feature:

* Download the [latest Kubernetes project](/releases/download/) (version `v1.28.0` or later)  
* Switch on the feature gate with the command line flag `--feature-gates=UnknownVersionInteroperabilityProxy=true` on the kube-apiservers
* Pass the CA bundle that will be used by source kube-apiserver to authenticate destination kube-apiserver's serving certs using the flag `--peer-ca-file` on the kube-apiservers. Note: this is a required flag for this feature to work. There is no default value enabled for this flag.
* Pass the correct ip and port of the local kube-apiserver that will be used by peers to connect to this kube-apiserver while proxying a request. Use the flags `--peer-advertise-ip` and `peer-advertise-port` to the kube-apiservers upon startup. If unset, the value passed to either `--advertise-address` or `--bind-address` is used. If those too, are unset, the host's default interface will be used.

## What’s missing?
Currently we only proxy resource requests to a peer kube-apiserver when its determined to do so. Next we need to address how to work discovery requests in such scenarios. Right now we are planning to have the following capabilities for beta

* Merged discovery across all kube-apiservers
* Use an egress dialer for network connections made to peer kube-apiservers

## How can I learn more?

- Read the [Mixed Version Proxy documentation](/docs/concepts/architecture/mixed-version-proxy)
- Read [KEP-4020: Unknown Version Interoperability Proxy](https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/4020-unknown-version-interoperability-proxy)

## How can I get involved?
Reach us on [Slack](https://slack.k8s.io/): [#sig-api-machinery](https://kubernetes.slack.com/messages/sig-api-machinery), or through the [mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-api-machinery). 

Huge thanks to the contributors that have helped in the design, implementation, and review of this feature: Daniel Smith, Han Kang, Joe Betz, Jordan Liggit, Antonio Ojea, David Eads and Ben Luddy!
