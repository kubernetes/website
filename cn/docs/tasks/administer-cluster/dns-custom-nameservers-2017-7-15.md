---
assignees:
- bowei
- zihongz
title: Configure private DNS zones and upstream nameservers in Kubernetes
---

{% capture overview %}
This page shows how to add custom private DNS zones (stub domains) and upstream
nameservers.
{% endcapture %}

{% capture prerequisites %}
* {% include task-tutorial-prereqs.md %}
* Kubernetes version 1.6 and above.
* The cluster must be configured to use the `kube-dns` addon.
{% endcapture %}

{% capture steps %}

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
    {“acme.local”: [“1.2.3.4”]}
  upstreamNameservers: |
    [“8.8.8.8”, “8.8.4.4”]
```

As specified, DNS requests with the “.acme.local” suffix
are forwarded to a DNS listening at 1.2.3.4. Google Public DNS
serves the upstream queries.

The table below describes how queries with certain domain names would map to their destination DNS servers:

| Domain name | Server answering the query |
| ----------- | -------------------------- |
| kubernetes.default.svc.cluster.local| kube-dns |
| foo.acme.local| custom DNS (1.2.3.4) |
| widget.com    | upstream DNS (one of 8.8.8.8, 8.8.4.4) |

See [ConfigMap options](#configmap-options) for
details about the configuration option format.

{% endcapture %}

{% capture discussion %}

## Understanding name resolution in Kubernetes

DNS policies can be set on a per-pod basis. Currently Kubernetes supports two pod-specific DNS policies: “Default” and “ClusterFirst”. These policies are specified with the `dnsPolicy` flag.

*NOTE: "Default" is not the default DNS policy. If `dnsPolicy` is not
explicitly specified, then “ClusterFirst” is used.*

### "Default" DNS Policy

If `dnsPolicy` is set to “Default”, then the name resolution configuration is
inherited from the node that the pods run on. Custom upstream nameservers and stub domains cannot be used in conjunction with this policy.

### "ClusterFirst" DNS Policy

If the `dnsPolicy` is set to "ClusterFirst", name resolution is handled differently, *depending on whether stub-domain and upstream DNS servers are configured*.

**Without custom configurations**: Any query that does not match the configured cluster domain suffix, such as "www.kubernetes.io", is forwarded to the upstream nameserver inherited from the node.

**With custom configurations**: If stub domains and upstream DNS servers are configured (as in the [previous example](#configuring-stub-domain-and-upstream-dns-servers)), DNS queries will be
routed according to the following flow:

1. The query is first sent to the DNS caching layer in kube-dns.

1. From the caching layer, the suffix of the request is examined and then forwarded to the appropriate DNS, based on the following cases:

   * *Names with the cluster suffix* (e.g.".cluster.local"): The request is sent to kube-dns.

   * *Names with the stub domain suffix* (e.g. ".acme.local"): The request is sent to the configured custom DNS resolver (e.g. listening at 1.2.3.4).

   * *Names without a matching suffix* (e.g."widget.com"): The request is forwarded to the upstream DNS (e.g. Google public DNS servers at 8.8.8.8 and 8.8.4.4).

![DNS lookup flow](/docs/tasks/administer-cluster/dns-custom-nameservers/dns.png)

## ConfigMap options

Options for the kube-dns `kube-system:kube-dns` ConfigMap

| Field | Format | Description |
| ----- | ------ | ----------- |
| `stubDomains` (optional) | A JSON map using a DNS suffix key (e.g. “acme.local”) and a value consisting of a JSON array of DNS IPs. | The target nameserver may itself be a Kubernetes service. For instance, you can run your own copy of dnsmasq to export custom DNS names into the ClusterDNS namespace. |
| `upstreamNameservers` (optional) | A JSON array of DNS IPs. | Note: If specified, then the values specified replace the nameservers taken by default from the node’s `/etc/resolv.conf`. Limits: a maximum of three upstream nameservers can be specified. |

## Additional examples

### Example: Stub domain

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
          {“consul.local”: [“10.150.0.1”]}
```

Note that the cluster administrator did not wish to override the node’s
upstream nameservers, so they did not specify the optional
`upstreamNameservers` field.

### Example: Upstream nameserver

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
          [“172.16.0.1”]
```

{% endcapture %}

{% include templates/task.md %}
