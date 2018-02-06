---
approvers:
- bowei
- zihongz
title: Customizing DNS Service
---

{% capture overview %}
This page provides hints on configuring DNS Pod and guidance on customizing the
DNS resolution process and diagnosing DNS problems.
{% endcapture %}

{% capture prerequisites %}
* {% include task-tutorial-prereqs.md %}
* Kubernetes version 1.6 and above.
* The cluster must be configured to use the `kube-dns` addon.
{% endcapture %}

{% capture steps %}

## Introduction

Starting from Kubernetes v1.3, DNS is a built-in service launched automatically
using the addon manager
[cluster add-on](http://releases.k8s.io/{{page.githubbranch}}/cluster/addons/README.md).

The running Kubernetes DNS pod holds 3 containers:

- "`kubedns`": The `kubedns` process watches the Kubernetes master for changes
  in Services and Endpoints, and maintains in-memory lookup structures to serve
  DNS requests.
- "`dnsmasq`": The `dnsmasq` container adds DNS caching to improve performance.
- "`healthz`": The `healthz` container provides a single health check endpoint
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

{% endcapture %}

{% capture discussion %}

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

## Debugging DNS resolution

### Create a simple Pod to use as a test environment

Create a file named busybox.yaml with the following contents:

{% include code.html language="yaml" file="busybox.yaml" ghlink="/docs/tasks/administer-cluster/busybox.yaml" %}

Then create a pod using this file and verify its status:

```shell
$ kubectl create -f busybox.yaml
pod "busybox" created

$ kubectl get pods busybox
NAME      READY     STATUS    RESTARTS   AGE
busybox   1/1       Running   0          <some-time>
```

Once that pod is running, you can exec `nslookup` in that environment.
If you see something like the following, DNS is working correctly.

```shell
$ kubectl exec -ti busybox -- nslookup kubernetes.default
Server:    10.0.0.10
Address 1: 10.0.0.10

Name:      kubernetes.default
Address 1: 10.0.0.1
```

If the `nslookup` command fails, check the following:

### Check the local DNS configuration first

Take a look inside the resolv.conf file.
(See [Inheriting DNS from the node](#inheriting-dns-from-the-node) and
[Known issues](#known-issues) below for more information)

```shell
$ kubectl exec busybox cat /etc/resolv.conf
```

Verify that the search path and name server are set up like the following
(note that search path may vary for different cloud providers):

```
search default.svc.cluster.local svc.cluster.local cluster.local google.internal c.gce_project_id.internal
nameserver 10.0.0.10
options ndots:5
```

Errors such as the following indicate a problem with the kube-dns add-on or
associated Services:

```
$ kubectl exec -ti busybox -- nslookup kubernetes.default
Server:    10.0.0.10
Address 1: 10.0.0.10

nslookup: can't resolve 'kubernetes.default'
```

or

```
$ kubectl exec -ti busybox -- nslookup kubernetes.default
Server:    10.0.0.10
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

nslookup: can't resolve 'kubernetes.default'
```

### Check if the DNS pod is running

Use the `kubectl get pods` command to verify that the DNS pod is running.

```shell
$ kubectl get pods --namespace=kube-system -l k8s-app=kube-dns
NAME                    READY     STATUS    RESTARTS   AGE
...
kube-dns-v19-ezo1y      3/3       Running   0           1h
...
```

If you see that no pod is running or that the pod has failed/completed, the DNS
add-on may not be deployed by default in your current environment and you will
have to deploy it manually.

### Check for Errors in the DNS pod

Use `kubectl logs` command to see logs for the DNS daemons.

```shell
$ kubectl logs --namespace=kube-system $(kubectl get pods --namespace=kube-system -l k8s-app=kube-dns -o name) -c kubedns
$ kubectl logs --namespace=kube-system $(kubectl get pods --namespace=kube-system -l k8s-app=kube-dns -o name) -c dnsmasq
$ kubectl logs --namespace=kube-system $(kubectl get pods --namespace=kube-system -l k8s-app=kube-dns -o name) -c sidecar
```

See if there is any suspicious log. Letter '`W`', '`E`', '`F`' at the beginning
represent Warning, Error and Failure. Please search for entries that have these
as the logging level and use
[kubernetes issues](https://github.com/kubernetes/kubernetes/issues)
to report unexpected errors.

### Is DNS service up?

Verify that the DNS service is up by using the `kubectl get service` command.

```shell
$ kubectl get svc --namespace=kube-system
NAME          CLUSTER-IP     EXTERNAL-IP   PORT(S)             AGE
...
kube-dns      10.0.0.10      <none>        53/UDP,53/TCP        1h
...
```

If you have created the service or in the case it should be created by default
but it does not appear, see 
[debugging services](/docs/tasks/debug-application-cluster/debug-service/) for
more information.

### Are DNS endpoints exposed?

You can verify that DNS endpoints are exposed by using the `kubectl get endpoints`
command.

```shell
$ kubectl get ep kube-dns --namespace=kube-system
NAME       ENDPOINTS                       AGE
kube-dns   10.180.3.17:53,10.180.3.17:53    1h
```

If you do not see the endpoints, see endpoints section in the
[debugging services](/docs/tasks/debug-application-cluster/debug-service/) documentation.

For additional Kubernetes DNS examples, see the
[cluster-dns examples](https://github.com/kubernetes/examples/tree/master/staging/cluster-dns)
in the Kubernetes GitHub repository.

## Known issues

Kubernetes installs do not configure the nodes' resolv.conf files to use the
cluster DNS by default, because that process is inherently distro-specific.
This should probably be implemented eventually.

Linux's libc is impossibly stuck ([see this bug from
2005](https://bugzilla.redhat.com/show_bug.cgi?id=168253)) with limits of just
3 DNS `nameserver` records and 6 DNS `search` records.  Kubernetes needs to
consume 1 `nameserver` record and 3 `search` records.  This means that if a
local installation already uses 3 `nameserver`s or uses more than 3 `search`es,
some of those settings will be lost.  As a partial workaround, the node can run
`dnsmasq` which will provide more `nameserver` entries, but not more `search`
entries.  You can also use kubelet's `--resolv-conf` flag.

If you are using Alpine version 3.3 or earlier as your base image, DNS may not
work properly owing to a known issue with Alpine.
Check [here](https://github.com/kubernetes/kubernetes/issues/30215)
for more information.

## Kubernetes Federation (Multiple Zone support)

Release 1.3 introduced Cluster Federation support for multi-site Kubernetes
installations. This required some minor (backward-compatible) changes to the
way the Kubernetes cluster DNS server processes DNS queries, to facilitate
the lookup of federated services (which span multiple Kubernetes clusters).
See the [Cluster Federation Administrators' Guide](/docs/concepts/cluster-administration/federation/)
for more details on Cluster Federation and multi-site support.

## References

- [DNS for Services and Pods](/docs/concepts/services-networking/dns-pod-service/)
- [Docs for the DNS cluster addon](http://releases.k8s.io/{{page.githubbranch}}/cluster/addons/dns/README.md)

## What's next
- [Autoscaling the DNS Service in a Cluster](/docs/tasks/administer-cluster/dns-horizontal-autoscaling/).

{% endcapture %}

{% include templates/task.md %}
