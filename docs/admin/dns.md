---
assignees:
- ArtfulCoder
- davidopp
- lavalamp

---

## Introduction

As of Kubernetes 1.3, DNS is a built-in service launched automatically using the addon manager [cluster add-on](http://releases.k8s.io/{{page.githubbranch}}/cluster/addons/README.md).
A DNS Pod and Service will be scheduled on the cluster, and the kubelets will be
configured to tell individual containers to use the DNS Service's IP to resolve DNS names.

Every Service defined in the cluster (including the DNS server itself) will be
assigned a DNS name.  By default, a client Pod's DNS search list will
include the Pod's own namespace and the cluster's default domain.  This is best
illustrated by example:

Assume a Service named `foo` in the Kubernetes namespace `bar`.  A Pod running
in namespace `bar` can look up this service by simply doing a DNS query for
`foo`.  A Pod running in namespace `quux` can look up this service by doing a
DNS query for `foo.bar`.

The Kubernetes cluster DNS server (based off the [SkyDNS](https://github.com/skynetservices/skydns) library)
supports forward lookups (A records), service lookups (SRV records) and reverse IP address lookups (PTR records).


## How it Works

The running Kubernetes DNS pod holds 3 containers - kubedns, dnsmasq and a health check called healthz.
The kubedns process watches the Kubernetes master for changes in Services and Endpoints, and maintains
in-memory lookup structures to service DNS requests. The dnsmasq container adds DNS caching to improve
performance. The healthz container provides a single health check endpoint while performing dual healthchecks
(for dnsmasq and kubedns).

## Kubernetes Federation (Multiple Zone support)

Release 1.3 introduced Cluster Federation support for multi-site
Kubernetes installations. This required some minor
(backward-compatible) changes to the way
the Kubernetes cluster DNS server processes DNS queries, to facilitate
the lookup of federated services (which span multiple Kubernetes clusters).
See the [Cluster Federation Administrators' Guide](/docs/admin/federation/index.md) for more
details on Cluster Federation and multi-site support.

## References

- [Docs for the DNS cluster addon](http://releases.k8s.io/{{page.githubbranch}}/build/kube-dns/README.md)

