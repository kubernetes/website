---
reviewers:
- bowei
- zihongz
title: Customizing DNS Service
content_template: templates/task
---

# Customizing kube-dns

{{% capture overview %}}
This section provides hints on configuring DNS Pod and guidance on customizing the
DNS resolution process.
{{% /capture %}}

{{% capture prerequisites %}}
* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
* Kubernetes version 1.6 and above.
* The cluster must be configured to use the `kube-dns` addon.
{{% /capture %}}

{{% capture steps %}}

## Introduction

Starting from Kubernetes v1.3, DNS is a built-in service launched automatically
using the addon manager
[cluster add-on](http://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/README.md).

The running Kubernetes DNS pod holds 3 containers:

- "`kubedns`": The `kubedns` process watches the Kubernetes master for changes
  in Services and Endpoints, and maintains in-memory lookup structures to serve
  DNS requests.
- "`dnsmasq`": The `dnsmasq` container adds DNS caching to improve performance.
- "`sidecar`": The `sidecar` container provides a single health check endpoint
  while performing dual healthchecks (for `dnsmasq` and `kubedns`).

The DNS pod is exposed as a Kubernetes Service with a static IP. Once assigned
the kubelet passes DNS configured using the `--cluster-dns=<dns-service-ip>`
flag to each container.

DNS names also need domains. The local domain is configurable in the kubelet
using the flag `--cluster-domain=<default-local-domain>`.

The Kubernetes cluster DNS server is based off the
[SkyDNS](https://github.com/skynetservices/skydns) library. It supports forward
lookups (A records), service lookups (SRV records) and reverse IP address
lookups (PTR records).

## Inheriting DNS from the node

When running a pod, kubelet will prepend the cluster DNS server and search
paths to the node's own DNS settings.  If the node is able to resolve DNS names
specific to the larger environment, pods should be able to, also.
See [Known issues](#known-issues) below for a caveat.

If you don't want this, or if you want a different DNS config for pods, you can
use the kubelet's `--resolv-conf` flag.  Setting it to "" means that pods will
not inherit DNS. Setting it to a valid file path means that kubelet will use
this file instead of `/etc/resolv.conf` for DNS inheritance.

## Configure stub-domain and upstream DNS servers

Cluster administrators can specify custom stub domains and upstream nameservers
by providing a ConfigMap for kube-dns (`kube-system:kube-dns`).

For example, the following ConfigMap sets up a DNS configuration with a single stub domain and two
upstream nameservers.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: kube-dns
  namespace: kube-system
data:
  stubDomains: |
    {"acme.local": ["1.2.3.4"]}
  upstreamNameservers: |
    ["8.8.8.8", "8.8.4.4"]
```

As specified, DNS requests with the “.acme.local” suffix
are forwarded to a DNS listening at 1.2.3.4. Google Public DNS
serves the upstream queries.

The table below describes how queries with certain domain names would map to
their destination DNS servers:

| Domain name | Server answering the query |
| ----------- | -------------------------- |
| kubernetes.default.svc.cluster.local| kube-dns |
| foo.acme.local| custom DNS (1.2.3.4) |
| widget.com    | upstream DNS (one of 8.8.8.8, 8.8.4.4) |

See [ConfigMap options](#configmap-options) for
details about the configuration option format.

{{% /capture %}}

{{% capture discussion %}}

### Impacts on Pods

Custom upstream nameservers and stub domains won't impact Pods that have their
`dnsPolicy` set to "`Default`" or "`None`".

If a Pod's `dnsPolicy` is set to "`ClusterFirst`", its name resolution is
handled differently, depending on whether stub-domain and upstream DNS servers
are configured.

**Without custom configurations**: Any query that does not match the configured
cluster domain suffix, such as "www.kubernetes.io", is forwarded to the upstream
nameserver inherited from the node.

**With custom configurations**: If stub domains and upstream DNS servers are
configured (as in the [previous example](#configuring-stub-domain-and-upstream-dns-servers)),
DNS queries will be routed according to the following flow:

1. The query is first sent to the DNS caching layer in kube-dns.

1. From the caching layer, the suffix of the request is examined and then
   forwarded to the appropriate DNS, based on the following cases:

   * *Names with the cluster suffix* (e.g.".cluster.local"):
     The request is sent to kube-dns.

   * *Names with the stub domain suffix* (e.g. ".acme.local"):
     The request is sent to the configured custom DNS resolver (e.g. listening at 1.2.3.4).

   * *Names without a matching suffix* (e.g."widget.com"):
     The request is forwarded to the upstream DNS
     (e.g. Google public DNS servers at 8.8.8.8 and 8.8.4.4).

![DNS lookup flow](/docs/tasks/administer-cluster/dns-custom-nameservers/dns.png)

## ConfigMap options

Options for the kube-dns `kube-system:kube-dns` ConfigMap:

| Field | Format | Description |
| ----- | ------ | ----------- |
| `stubDomains` (optional) | A JSON map using a DNS suffix key (e.g. “acme.local”) and a value consisting of a JSON array of DNS IPs. | The target nameserver may itself be a Kubernetes service. For instance, you can run your own copy of dnsmasq to export custom DNS names into the ClusterDNS namespace. |
| `upstreamNameservers` (optional) | A JSON array of DNS IPs. | Note: If specified, then the values specified replace the nameservers taken by default from the node’s `/etc/resolv.conf`. Limits: a maximum of three upstream nameservers can be specified. |

### Examples

#### Example: Stub domain

In this example, the user has a Consul DNS service discovery system that they wish to
integrate with kube-dns. The consul domain server is located at 10.150.0.1, and
all consul names have the suffix “.consul.local”.  To configure Kubernetes, the
cluster administrator simply creates a ConfigMap object as shown below.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: kube-dns
  namespace: kube-system
data:
  stubDomains: |
    {"consul.local": ["10.150.0.1"]}
```

Note that the cluster administrator did not wish to override the node’s
upstream nameservers, so they did not specify the optional
`upstreamNameservers` field.

#### Example: Upstream nameserver

In this example the cluster administrator wants to explicitly force all
non-cluster DNS lookups to go through their own nameserver at 172.16.0.1.
Again, this is easy to accomplish; they just need to create a ConfigMap with the
`upstreamNameservers` field specifying the desired nameserver.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: kube-dns
  namespace: kube-system
data:
  upstreamNameservers: |
    ["172.16.0.1"]
```

{{% /capture %}}

# Customizing CoreDNS

This section provides with details on [CoreDNS](https://coredns.io/) as a service discovery.

## Introduction

CoreDNS is available as an option in Kubernetes starting from v1.9.
It is currently a [GA feature](https://github.com/kubernetes/community/blob/master/keps/sig-network/0010-20180314-coredns-GA-proposal.md) and is on course to be [the default](https://github.com/kubernetes/community/blob/master/keps/sig-network/0012-20180518-coredns-default-proposal.md), replacing kube-dns.


## ConfigMap options

CoreDNS chains plugins and can be configured by maintaining a Corefile via the ConfigMap. CoreDNS supports all the functionalities and more that is provided by kube-dns.
A ConfigMap created for kube-dns to support `StubDomains`and `upstreamnameserver` translates to the `proxy` plugin in CoreDNS.
Similarly, the `Federation` plugin translates to the `federation` plugin in CoreDNS.

### Example
Below is an example ConfigMap of kube-dns with federations, stubdomains and upstreamnameservers configured.

```yaml
apiVersion: v1
data:
  federations: |
    {"foo" : "foo.feddomain.com"}
  stubDomains: |
    {"abc.com" : ["1.2.3.4"], "my.cluster.local" : ["2.3.4.5"]}
  upstreamNameservers: |
    ["8.8.8.8", "8.8.4.4"]
kind: ConfigMap
```

The equivalent configuration in CoreDNS translates to the following Corefile:
* For federations:
```yaml
federation cluster.local {
           foo foo.feddomain.com
        }
```

* For StubDomains:
```yaml
abc.com:53 {
        errors
        cache 30
        proxy . 1.2.3.4
    }
    my.cluster.local:53 {
        errors
        cache 30
        proxy . 2.3.4.5
    }
```

The complete Corefile along with the default plugins:

```yaml
.:53 {
        errors
        health
        kubernetes cluster.local  in-addr.arpa ip6.arpa {
           upstream  8.8.8.8 8.8.4.4
           pods insecure
           fallthrough in-addr.arpa ip6.arpa
        }
        federation cluster.local {
           foo foo.feddomain.com
        }
        prometheus :9153
        proxy .  8.8.8.8 8.8.4.4
        cache 30
    }
    abc.com:53 {
        errors
        cache 30
        proxy . 1.2.3.4
    }
    my.cluster.local:53 {
        errors
        cache 30
        proxy . 2.3.4.5
    }
```

Currently from Kubernetes 1.10, automatic translation of the CoreDNS configmap from kube-dns ConfigMap is supported via `kubeadm`.

## Migration to CoreDNS

Currently, a number of tools supports the installation of CoreDNS instead of kube-dns.
If a user wants to migrate from kube-dns to CoreDNS, [a detailed blog](https://coredns.io/2018/05/21/migration-from-kube-dns-to-coredns/) is available to help users in adapting CoreDNS in place of kube-dns.

## What's next
- [Debugging DNS Resolution](/docs/tasks/administer-cluster/dns-debugging-resolution/).




