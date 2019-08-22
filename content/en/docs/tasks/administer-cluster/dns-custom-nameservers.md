---
reviewers:
- bowei
- zihongz
title: Customizing DNS Service
content_template: templates/task
---

{{% capture overview %}}
This page explains how to configure your DNS Pod and customize the
DNS resolution process. In Kubernetes version 1.11 and later, CoreDNS is at GA
and is installed by default with kubeadm. See [CoreDNS ConfigMap options](#coredns-configmap-options) 
and [Using CoreDNS for Service Discovery](/docs/tasks/administer-cluster/coredns/).
{{% /capture %}}

{{% capture prerequisites %}}
* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
* Kubernetes version 1.6 or later. To work with CoreDNS, version 1.9 or later.
* The appropriate add-on: kube-dns or CoreDNS. To install with kubeadm,
see [the kubeadm reference documentation](/docs/reference/setup-tools/kubeadm/kubeadm-alpha/#cmd-phase-addon).
{{% /capture %}}

{{% capture steps %}}

## Introduction

DNS is a built-in Kubernetes service launched automatically
using the addon manager
[cluster add-on](http://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/README.md).

As of Kubernetes v1.12, CoreDNS is the recommended DNS Server, replacing kube-dns. However, kube-dns may still be installed by
default with certain Kubernetes installer tools. Refer to the documentation provided by your installer to know which DNS server is installed by default.


The CoreDNS Deployment is exposed as a Kubernetes Service with a static IP.
Both the CoreDNS and kube-dns Service are named `kube-dns` in the `metadata.name` field. This is done so that there is greater interoperability with workloads that relied on the legacy `kube-dns` Service name to resolve addresses internal to the cluster. It abstracts away the implementation detail of which DNS provider is running behind that common endpoint. 
The kubelet passes DNS to each container with the `--cluster-dns=<dns-service-ip>` flag.

DNS names also need domains. You configure the local domain in the kubelet
with the flag `--cluster-domain=<default-local-domain>`.

The DNS server supports forward lookups (A records), port lookups (SRV records), reverse IP address lookups (PTR records),
and more. For more information see [DNS for Services and Pods] (/docs/concepts/services-networking/dns-pod-service/).

If a Pod's `dnsPolicy` is set to "`default`", it inherits the name resolution
configuration from the node that the Pod runs on. The Pod's DNS resolution
should behave the same as the node.
But see [Known issues](/docs/tasks/administer-cluster/dns-debugging-resolution/#known-issues).

If you don't want this, or if you want a different DNS config for pods, you can
use the kubelet's `--resolv-conf` flag.  Set this flag to "" to prevent Pods from
inheriting DNS. Set it to a valid file path to specify a file other than
`/etc/resolv.conf` for DNS inheritance.

## CoreDNS

CoreDNS is a general-purpose authoritative DNS server that can serve as cluster DNS, complying with the [dns specifications]
(https://github.com/kubernetes/dns/blob/master/docs/specification.md). 

### CoreDNS ConfigMap options

CoreDNS is a DNS server that is modular and pluggable, and each plugin adds new functionality to CoreDNS. 
This can be configured by maintaining a [Corefile](https://coredns.io/2017/07/23/corefile-explained/), which is the CoreDNS
configuration file. A cluster administrator can modify the ConfigMap for the CoreDNS Corefile to change how service discovery works. 

In Kubernetes, CoreDNS is installed with the following default Corefile configuration.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: coredns
  namespace: kube-system
data:
  Corefile: |
    .:53 {
        errors
        health
        kubernetes cluster.local in-addr.arpa ip6.arpa {
           pods insecure
           upstream
           fallthrough in-addr.arpa ip6.arpa
        }
        prometheus :9153
        proxy . /etc/resolv.conf
        cache 30
        loop
        reload
        loadbalance
    }
``` 
The Corefile configuration includes the following [plugins](https://coredns.io/plugins/) of CoreDNS:

* [errors](https://coredns.io/plugins/errors/): Errors are logged to stdout.
* [health](https://coredns.io/plugins/health/): Health of CoreDNS is reported to http://localhost:8080/health.
* [kubernetes](https://coredns.io/plugins/kubernetes/): CoreDNS will reply to DNS queries based on IP of the services and pods of Kubernetes. You can find more details [here](https://coredns.io/plugins/kubernetes/). 

> The `pods insecure` option is provided for backward compatibility with kube-dns. You can use the `pods verified` option, which returns an A record only if there exists a pod in same namespace with matching IP. The `pods disabled` option can be used if you don't use pod records.

> `Upstream` is used for resolving services that point to external hosts (External Services).

* [prometheus](https://coredns.io/plugins/prometheus/): Metrics of CoreDNS are available at http://localhost:9153/metrics in [Prometheus](https://prometheus.io/) format.
* [proxy](https://coredns.io/plugins/proxy/): Any queries that are not within the cluster domain of Kubernetes will be forwarded to predefined resolvers (/etc/resolv.conf).
* [cache](https://coredns.io/plugins/cache/): This enables a frontend cache.
* [loop](https://coredns.io/plugins/loop/): Detects simple forwarding loops and halts the CoreDNS process if a loop is found.
* [reload](https://coredns.io/plugins/reload): Allows automatic reload of a changed Corefile. After you edit the ConfigMap configuration, allow two minutes for your changes to take effect.
* [loadbalance](https://coredns.io/plugins/loadbalance): This is a round-robin DNS loadbalancer that randomizes the order of A, AAAA, and MX records in the answer.

You can modify the default CoreDNS behavior by modifying the ConfigMap.

### Configuration of Stub-domain and upstream nameserver using CoreDNS

CoreDNS has the ability to configure stubdomains and upstream nameservers using the [proxy plugin](https://coredns.io/plugins/proxy/). 

#### Example
If a cluster operator has a [Consul](https://www.consul.io/) domain server located at 10.150.0.1, and all Consul names have the suffix .consul.local. To configure it in CoreDNS, the cluster administrator creates the following stanza in the CoreDNS ConfigMap.

```
consul.local:53 {
        errors
        cache 30
        proxy . 10.150.0.1
    }
```

To explicitly force all non-cluster DNS lookups to go through a specific nameserver at 172.16.0.1, point the `proxy` and `upstream` to the nameserver instead of `/etc/resolv.conf`

```
proxy .  172.16.0.1
``` 
```
upstream 172.16.0.1
```

The final ConfigMap along with the default `Corefile` configuration looks like:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: coredns
  namespace: kube-system
data:
  Corefile: |
    .:53 {
        errors
        health
        kubernetes cluster.local in-addr.arpa ip6.arpa {
           pods insecure
           upstream 172.16.0.1
           fallthrough in-addr.arpa ip6.arpa
        }
        prometheus :9153
        proxy . 172.16.0.1
        cache 30
        loop
        reload
        loadbalance
    }
    consul.local:53 {
        errors
        cache 30
        proxy . 10.150.0.1
    }
```
In Kubernetes version 1.10 and later, kubeadm supports automatic translation of the CoreDNS ConfigMap from the kube-dns ConfigMap.

## Kube-dns

Kube-dns is now available as an optional DNS server since CoreDNS is now the default.
The running DNS Pod holds 3 containers:

- "`kubedns`": watches the Kubernetes master for changes
  in Services and Endpoints, and maintains in-memory lookup structures to serve
  DNS requests.
- "`dnsmasq`": adds DNS caching to improve performance.
- "`sidecar`": provides a single health check endpoint
  to perform healthchecks for `dnsmasq` and `kubedns`.

### Configure stub-domain and upstream DNS servers

Cluster administrators can specify custom stub domains and upstream nameservers
by providing a ConfigMap for kube-dns (`kube-system:kube-dns`).

For example, the following ConfigMap sets up a DNS configuration with a single stub domain and two
upstream nameservers:

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

DNS requests with the “.acme.local” suffix
are forwarded to a DNS listening at 1.2.3.4. Google Public DNS
serves the upstream queries.

The table below describes how queries with certain domain names map to
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

#### Effects on Pods

Custom upstream nameservers and stub domains do not affect Pods with a
`dnsPolicy` set to "`Default`" or "`None`".

If a Pod's `dnsPolicy` is set to "`ClusterFirst`", its name resolution is
handled differently, depending on whether stub-domain and upstream DNS servers
are configured.

**Without custom configurations**: Any query that does not match the configured
cluster domain suffix, such as "www.kubernetes.io", is forwarded to the upstream
nameserver inherited from the node.

**With custom configurations**: If stub domains and upstream DNS servers are
configured,
DNS queries are routed according to the following flow:

1. The query is first sent to the DNS caching layer in kube-dns.

1. From the caching layer, the suffix of the request is examined and then
   forwarded to the appropriate DNS, based on the following cases:

   * *Names with the cluster suffix*, for example ".cluster.local":
     The request is sent to kube-dns.

   * *Names with the stub domain suffix*, for example ".acme.local":
     The request is sent to the configured custom DNS resolver, listening for example at 1.2.3.4.

   * *Names without a matching suffix*, for example "widget.com":
     The request is forwarded to the upstream DNS,
     for example Google public DNS servers at 8.8.8.8 and 8.8.4.4.

![DNS lookup flow](/docs/tasks/administer-cluster/dns-custom-nameservers/dns.png)

### ConfigMap options

Options for the kube-dns `kube-system:kube-dns` ConfigMap:

| Field | Format | Description |
| ----- | ------ | ----------- |
| `stubDomains` (optional) | A JSON map using a DNS suffix key such as “acme.local”, and a value consisting of a JSON array of DNS IPs. | The target nameserver can itself be a Kubernetes Service. For instance, you can run your own copy of dnsmasq to export custom DNS names into the ClusterDNS namespace. |
| `upstreamNameservers` (optional) | A JSON array of DNS IPs. | If specified, the values replace the nameservers taken by default from the node’s `/etc/resolv.conf`. Limits: a maximum of three upstream nameservers can be specified. |

#### Examples

##### Example: Stub domain

In this example, the user has a Consul DNS service discovery system they want to
integrate with kube-dns. The consul domain server is located at 10.150.0.1, and
all consul names have the suffix `.consul.local`.  To configure Kubernetes, the
cluster administrator creates the following ConfigMap:

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

Note that the cluster administrator does not want to override the node’s
upstream nameservers, so they did not specify the optional
`upstreamNameservers` field.

##### Example: Upstream nameserver

In this example the cluster administrator wants to explicitly force all
non-cluster DNS lookups to go through their own nameserver at 172.16.0.1.
In this case, they create a ConfigMap with the
`upstreamNameservers` field specifying the desired nameserver:

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

## CoreDNS configuration equivalent to kube-dns

CoreDNS supports the features of kube-dns and more.
A ConfigMap created for kube-dns to support `StubDomains`and `upstreamNameservers` translates to the `proxy` plugin in CoreDNS.
Similarly, the `Federations` plugin in kube-dns translates to the `federation` plugin in CoreDNS.

### Example

This example ConfigMap for kubedns specifies federations, stubdomains and upstreamnameservers:

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

The equivalent configuration in CoreDNS creates a Corefile:

* For federations:
```yaml
federation cluster.local {
           foo foo.feddomain.com
        }
```

* For stubDomains:
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

The complete Corefile with the default plugins:

```yaml
.:53 {
        errors
        health
        kubernetes cluster.local in-addr.arpa ip6.arpa {
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

## Migration to CoreDNS

To migrate from kube-dns to CoreDNS, [a detailed blog](https://coredns.io/2018/05/21/migration-from-kube-dns-to-coredns/) is available to help users adapt CoreDNS in place of kube-dns.
A cluster administrator can also migrate using [the deploy script](https://github.com/coredns/deployment/blob/master/kubernetes/deploy.sh).

## What's next
- [Debugging DNS Resolution](/docs/tasks/administer-cluster/dns-debugging-resolution/).
