---
reviewers:
- davidopp
- thockin
title: DNS for Services and Pods
---
{% capture overview %}
This page provides an overview of DNS support by Kubernetes.
{% endcapture %}

{% capture body %}

## Introduction

Kubernetes DNS schedules a DNS Pod and Service on the cluster, and configures
the kubelets to tell individual containers to use the DNS Service's IP to
resolve DNS names.

### What things get DNS names?

Every Service defined in the cluster (including the DNS server itself) is
assigned a DNS name.  By default, a client Pod's DNS search list will
include the Pod's own namespace and the cluster's default domain.  This is best
illustrated by example:

Assume a Service named `foo` in the Kubernetes namespace `bar`.  A Pod running
in namespace `bar` can look up this service by simply doing a DNS query for
`foo`.  A Pod running in namespace `quux` can look up this service by doing a
DNS query for `foo.bar`.

The following sections detail the supported record types and layout that is
supported.  Any other layout or names or queries that happen to work are
considered implementation details and are subject to change without warning.
For more up-to-date specification, see
[Kubernetes DNS-Based Service Discovery](https://github.com/kubernetes/dns/blob/master/docs/specification.md).

## Services

### A records

"Normal" (not headless) Services are assigned a DNS A record for a name of the
form `my-svc.my-namespace.svc.cluster.local`.  This resolves to the cluster IP
of the Service.

"Headless" (without a cluster IP) Services are also assigned a DNS A record for
a name of the form `my-svc.my-namespace.svc.cluster.local`.  Unlike normal
Services, this resolves to the set of IPs of the pods selected by the Service.
Clients are expected to consume the set or else use standard round-robin
selection from the set.

### SRV records

SRV Records are created for named ports that are part of normal or [Headless
Services](/docs/concepts/services-networking/service/#headless-services).
For each named port, the SRV record would have the form
`_my-port-name._my-port-protocol.my-svc.my-namespace.svc.cluster.local`.
For a regular service, this resolves to the port number and the CNAME:
`my-svc.my-namespace.svc.cluster.local`.
For a headless service, this resolves to multiple answers, one for each pod
that is backing the service, and contains the port number and a CNAME of the pod
of the form `auto-generated-name.my-svc.my-namespace.svc.cluster.local`.

## Pods

### A Records

When enabled, pods are assigned a DNS A record in the form of
"`pod-ip-address.my-namespace.pod.cluster.local`".

For example, a pod with IP `1.2.3.4` in the namespace `default` with a DNS name
of `cluster.local` would have an entry: `1-2-3-4.default.pod.cluster.local`.

### Pod's hostname and subdomain fields

Currently when a pod is created, its hostname is the Pod's `metadata.name` value.

The Pod spec has an optional `hostname` field, which can be used to specify the
Pod's hostname. When specified, it takes precedence over the Pod's name to be
the hostname of the pod. For example, given a Pod with `hostname` set to
"`my-host`", the Pod will have its hostname set to "`my-host`".

The Pod spec also has an optional `subdomain` field which can be used to specify
its subdomain. For example, a Pod with `hostname` set to "`foo`", and `subdomain`
set to "`bar`", in namespace "`my-namespace`", will have the fully qualified
domain name (FQDN) "`foo.bar.my-namespace.svc.cluster.local`".

Example:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: default-subdomain
spec:
  selector:
    name: busybox
  clusterIP: None
  ports:
  - name: foo # Actually, no port is needed.
    port: 1234
    targetPort: 1234
---
apiVersion: v1
kind: Pod
metadata:
  name: busybox1
  labels:
    name: busybox
spec:
  hostname: busybox-1
  subdomain: default-subdomain
  containers:
  - image: busybox
    command:
      - sleep
      - "3600"
    name: busybox
---
apiVersion: v1
kind: Pod
metadata:
  name: busybox2
  labels:
    name: busybox
spec:
  hostname: busybox-2
  subdomain: default-subdomain
  containers:
  - image: busybox
    command:
      - sleep
      - "3600"
    name: busybox
```

If there exists a headless service in the same namespace as the pod and with
the same name as the subdomain, the cluster's KubeDNS Server also returns an A
record for the Pod's fully qualified hostname.
For example, given a Pod with the hostname set to "`busybox-1`" and the subdomain set to
"`default-subdomain`", and a headless Service named "`default-subdomain`" in
the same namespace, the pod will see its own FQDN as
"`busybox-1.default-subdomain.my-namespace.svc.cluster.local`". DNS serves an
A record at that name, pointing to the Pod's IP. Both pods "`busybox1`" and
"`busybox2`" can have their distinct A records.

The Endpoints object can specify the `hostname` for any endpoint addresses,
along with its IP.

### Pod's DNS Policy

DNS policies can be set on a per-pod basis. Currently Kubernetes supports the
following pod-specific DNS policies. These policies are specified in the
`dnsPolicy` field of a Pod Spec.

- "`Default`": The Pod inherits the name resolution configuration from the node
  that the pods run on.
  See [related discussion](/docs/tasks/administer-cluster/dns-custom-nameservers/#inheriting-dns-from-the-node)
  for more details.
- "`ClusterFirst`": Any DNS query that does not match the configured cluster
  domain suffix, such as "`www.kubernetes.io`", is forwarded to the upstream
  nameserver inherited from the node. Cluster administrators may have extra
  stub-domain and upstream DNS servers configured.
  See [related discussion](/docs/tasks/administer-cluster/dns-custom-nameservers/#impacts-on-pods)
  for details on how DNS queries are handled in those cases.
- "`ClusterFirstWithHostNet`": For Pods running with hostNetwork, you should
  explicitly set its DNS policy "`ClusterFirstWithHostNet`".
- "`None`": A new option value introduced in Kubernetes v1.9 (Beta in v1.10). It
  allows a Pod to ignore DNS settings from the Kubernetes environment. All DNS
  settings are supposed to be provided using the `dnsConfig` field in the Pod Spec.
  See [DNS config](#dns-config) subsection below.

**NOTE:** "Default" is not the default DNS policy. If `dnsPolicy` is not
explicitly specified, then “ClusterFirst” is used.
{: .note}


The example below shows a Pod with its DNS policy set to
"`ClusterFirstWithHostNet`" because it has `hostNetwork` set to `true`.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: busybox
  namespace: default
spec:
  containers:
  - image: busybox
    command:
      - sleep
      - "3600"
    imagePullPolicy: IfNotPresent
    name: busybox
  restartPolicy: Always
  hostNetwork: true
  dnsPolicy: ClusterFirstWithHostNet
```

### Pod's DNS Config

Kubernetes v1.9 introduces an Alpha feature (Beta in v1.10) that allows users more
control on the DNS settings for a Pod. This feature is enabled by default in v1.10.
To enable this feature in v1.9, the cluster administrator
needs to enable the `CustomPodDNS` feature gate on the apiserver and the kubelet,
for example, "`--feature-gates=CustomPodDNS=true,...`".
When the feature gate is enabled, users can set the `dnsPolicy` field of a Pod
to "`None`" and they can add a new field `dnsConfig` to a Pod Spec.

The `dnsConfig` field is optional and it can work with any `dnsPolicy` settings.
However, when a Pod's `dnsPolicy` is set to "`None`", the `dnsConfig` field has
to be specified.

Below are the properties a user can specify in the `dnsConfig` field:

- `nameservers`: a list of IP addresses that will be used as DNS servers for the
  Pod. There can be at most 3 IP addresses specified. When the Pod's `dnsPolicy`
  is set to "`None`", the list must contain at least one IP address, otherwise
  this property is optional.
  The servers listed will be combined to the base nameservers generated from the
  specified DNS policy with duplicate addresses removed.
- `searches`: a list of DNS search domains for hostname lookup in the Pod.
  This property is optional. When specified, the provided list will be merged
  into the base search domain names generated from the chosen DNS policy.
  Duplicate domain names are removed.
  Kubernetes allows for at most 6 search domains.
- `options`: an optional list of objects where each object may have a `name`
  property (required) and a `value` property (optional). The contents in this
  property will be merged to the options generated from the specified DNS policy.
  Duplicate entries are removed.

The following is an example Pod with custom DNS settings:

{% include code.html language="yaml" file="custom-dns.yaml" ghlink="/docs/concepts/services-networking/custom-dns.yaml" %}

When the Pod above is created, the container `test` gets the following contents
in its `/etc/resolv.conf` file:

```
nameserver 1.2.3.4
search ns1.svc.cluster.local my.dns.search.suffix
options ndots:2 edns0
```

{% endcapture %}

{% capture whatsnext %}

For guidance on administering DNS configurations, check
[Configure DNS Service](/docs/tasks/administer-cluster/dns-custom-nameservers/)

{% endcapture %}

{% include templates/concept.md %}
