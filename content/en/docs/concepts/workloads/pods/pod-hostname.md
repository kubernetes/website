---
title: Pod Hostname
content_type: concept
weight: 85
---

<!-- overview -->

This page explains how to set a Pod's hostname, 
potential side effects after configuration, and the underlying mechanics.

<!-- body -->

## Default Pod hostname

When a Pod is created, its hostname (as observed from within the Pod) 
is derived from the Pod's metadata.name value. 
Both the hostname and its corresponding fully qualified domain name (FQDN) 
are set to the metadata.name value (from the Pod's perspective)

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: busybox-1
spec:
  containers:
  - image: busybox:1.28
    command:
      - sleep
      - "3600"
    name: busybox
```
The Pod created by this manifest will have its hostname and fully qualified domain name (FQDN) set to `busybox-1`.

## Hostname with pod's hostname and subdomain fields
The Pod spec includes an optional `hostname` field. 
When set, this value takes precedence over the Pod's `metadata.name` as the 
hostname (observed from within the Pod).
For example, a Pod with spec.hostname set to `my-host` will have its hostname set to `my-host`.

The Pod spec also includes an optional `subdomain` field, 
indicating the Pod belongs to a subdomain within its namespace. 
If a Pod has `spec.hostname` set to "foo" and spec.subdomain set 
to "bar" in the namespace `my-namespace`, its hostname becomes `foo` and its 
fully qualified domain name (FQDN) becomes 
`foo.bar.my-namespace.svc.cluster-domain.example` (observed from within the Pod).

When both hostname and subdomain are set, the cluster's DNS server will 
create A and/or AAAA records based on these fields. 
Refer to: [Pod's hostname and subdomain fields](/docs/concepts/services-networking/dns-pod-service/#pod-hostname-and-subdomain-field).

## Hostname with pod's setHostnameAsFQDN fields

{{< feature-state for_k8s_version="v1.22" state="stable" >}}

When a Pod is configured to have fully qualified domain name (FQDN), its
hostname is the short hostname. For example, if you have a Pod with the fully
qualified domain name `busybox-1.busybox-subdomain.my-namespace.svc.cluster-domain.example`,
then by default the `hostname` command inside that Pod returns `busybox-1` and the
`hostname --fqdn` command returns the FQDN.

When both `setHostnameAsFQDN: true` and the subdomain field is set in the Pod spec,
the kubelet writes the Pod's FQDN
into the hostname for that Pod's namespace. In this case, both `hostname` and `hostname --fqdn`
return the Pod's FQDN.

The Pod's FQDN is constructed in the same manner as previously defined.
It is composed of the Pod's `spec.hostname` (if specified) or `metadata.name` field,
the `spec.subdomain`, the `namespace` name, and the cluster domain suffix.

{{< note >}}
In Linux, the hostname field of the kernel (the `nodename` field of `struct utsname`) is limited to 64 characters.

If a Pod enables this feature and its FQDN is longer than 64 character, it will fail to start.
The Pod will remain in `Pending` status (`ContainerCreating` as seen by `kubectl`) generating
error events, such as "Failed to construct FQDN from Pod hostname and cluster domain".

This means that when using this field, 
you must ensure the combined length of the Pod's `metadata.name` (or `spec.hostname`) 
and `spec.subdomain` fields results in an FQDN that does not exceed 64 characters.
{{< /note >}}

## Hostname with pod's hostnameOverride
{{< feature-state feature_gate_name="HostnameOverride" >}}

Setting a value for `hostnameOverride` in the Pod spec causes the kubelet 
to unconditionally set both the Pod's hostname and fully qualified domain name (FQDN)
to the `hostnameOverride` value. 

The `hostnameOverride` field has a length limitation of 64 characters 
and must adhere to the DNS subdomain names standard defined in [RFC 1123](https://datatracker.ietf.org/doc/html/rfc1123).

Example:
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: busybox-2-busybox-example-domain
spec:
  hostnameOverride: busybox-2.busybox.example.domain
  containers:
  - image: busybox:1.28
    command:
      - sleep
      - "3600"
    name: busybox
```
{{< note >}}
This only affects the hostname within the Pod; it does not affect the Pod's A or AAAA records in the cluster DNS server.
{{< /note >}}

If `hostnameOverride` is set alongside `hostname` and `subdomain` fields:
* The hostname inside the Pod is overridden to the `hostnameOverride` value.
  
* The Pod's A and/or AAAA records in the cluster DNS server are still generated based on the `hostname` and `subdomain` fields.

Note: If `hostnameOverride` is set, you cannot simultaneously set the `hostNetwork` and `setHostnameAsFQDN` fields.
The API server will explicitly reject any create request attempting this combination.

For details on behavior when `hostnameOverride` is set in combination with 
other fields (hostname, subdomain, setHostnameAsFQDN, hostNetwork), 
see the table in the [KEP-4762 design details](https://github.com/kubernetes/enhancements/blob/master/keps/sig-network/4762-allow-arbitrary-fqdn-as-pod-hostname/README.md#design-details ).