---
title: Pod 主机名
content_type: concept
weight: 85
---
<!--
title: Pod Hostname
content_type: concept
weight: 85
-->

<!-- overview -->

<!--
This page explains how to set a Pod's hostname, 
potential side effects after configuration, and the underlying mechanics.
-->
本文讲述如何设置 Pod 的主机名、配置主机名后的潜在副作用以及底层机制。

<!-- body -->

<!--
## Default Pod hostname

When a Pod is created, its hostname (as observed from within the Pod) 
is derived from the Pod's metadata.name value. 
Both the hostname and its corresponding fully qualified domain name (FQDN) 
are set to the metadata.name value (from the Pod's perspective)
-->
## 默认 Pod 主机名 {#default-pod-hostname}

当 Pod 被创建时，其主机名（从 Pod 内部观察）来源于 Pod 的 `metadata.name` 值。
主机名和其对应的完全限定域名（FQDN）都会被设置为 `metadata.name` 值（从 Pod 的角度）。

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

<!--
The Pod created by this manifest will have its hostname and fully qualified domain name (FQDN) set to `busybox-1`.

## Hostname with pod's hostname and subdomain fields

The Pod spec includes an optional `hostname` field. 
When set, this value takes precedence over the Pod's `metadata.name` as the 
hostname (observed from within the Pod).
For example, a Pod with spec.hostname set to `my-host` will have its hostname set to `my-host`.
-->
由上述清单创建的 Pod 将其主机名和完全限定域名（FQDN）设置为 `busybox-1`。

## 使用 Pod 的 hostname 和 subdomain 字段设置主机名 {#hostname-with-pod-s-hostname-and-subdomain-fields}

Pod 规约包含一个可选的 `hostname` 字段。
当此字段被设置时，其取值优先于 Pod 的 `metadata.name`，作为 Pod 的主机名（从 Pod 内部观察）。
例如，如果将 Pod 的 `spec.hostname` 设置为 `my-host`，则 Pod 的主机名会被设置为 `my-host`。

<!--
The Pod spec also includes an optional `subdomain` field, 
indicating the Pod belongs to a subdomain within its namespace. 
If a Pod has `spec.hostname` set to "foo" and spec.subdomain set 
to "bar" in the namespace `my-namespace`, its hostname becomes `foo` and its 
fully qualified domain name (FQDN) becomes 
`foo.bar.my-namespace.svc.cluster-domain.example` (observed from within the Pod).
-->
Pod 规约还包含一个可选的 `subdomain` 字段，表示 Pod 属于其命名空间中的某个子域。
如果 Pod 的 `spec.hostname` 设置为 `foo`，`spec.subdomain` 设置为 `my-namespace` 命名空间中的 `bar`，
则其主机名为 `foo`，完全限定域名（FQDN）为 `foo.bar.my-namespace.svc.cluster-domain.example`（从 Pod 内部观察）。

<!--
When both hostname and subdomain are set, the cluster's DNS server will 
create A and/or AAAA records based on these fields. 
Refer to: [Pod's hostname and subdomain fields](/docs/concepts/services-networking/dns-pod-service/#pod-hostname-and-subdomain-field).

## Hostname with pod's setHostnameAsFQDN fields
-->
当 `hostname` 和 `subdomain` 都被设置时，集群的 DNS 服务器会基于这些字段创建 A 和/或 AAAA 记录。参考
[Pod 的 hostname 和 subdomain 字段](/zh-cn/docs/concepts/services-networking/dns-pod-service/#pod-hostname-and-subdomain-field)。

## 使用 Pod 的 setHostnameAsFQDN 字段设置主机名 {#hostname-with-pod-s-sethostnameasfqdn-fields}

{{< feature-state for_k8s_version="v1.22" state="stable" >}}

<!--
When a Pod is configured to have fully qualified domain name (FQDN), its
hostname is the short hostname. For example, if you have a Pod with the fully
qualified domain name `busybox-1.busybox-subdomain.my-namespace.svc.cluster-domain.example`,
then by default the `hostname` command inside that Pod returns `busybox-1` and the
`hostname --fqdn` command returns the FQDN.
-->
当 Pod 被配置为使用完全限定域名（FQDN）时，则其主机名是短的主机名。
例如，如果 Pod 的完全限定域名是 `busybox-1.busybox-subdomain.my-namespace.svc.cluster-domain.example`，
那么该 Pod 内的 `hostname` 命令默认返回 `busybox-1`，而 `hostname --fqdn` 命令返回 FQDN。

<!--
When both `setHostnameAsFQDN: true` and the subdomain field is set in the Pod spec,
the kubelet writes the Pod's FQDN
into the hostname for that Pod's namespace. In this case, both `hostname` and `hostname --fqdn`
return the Pod's FQDN.

The Pod's FQDN is constructed in the same manner as previously defined.
It is composed of the Pod's `spec.hostname` (if specified) or `metadata.name` field,
the `spec.subdomain`, the `namespace` name, and the cluster domain suffix.
-->
当在 Pod 规约中同时设置了 `setHostnameAsFQDN: true` 和 `subdomain` 字段时，
kubelet 会将 Pod 的 FQDN 写入该 Pod 命名空间的主机名中。
在这种情况下，`hostname` 和 `hostname --fqdn` 都会返回 Pod 的 FQDN。

Pod 的 FQDN 构建方式与前面定义的方式相同。
它由 Pod 的 `spec.hostname`（如果指定）或 `metadata.name` 字段、
`spec.subdomain`、`namespace` 名称以及集群域名后缀组成。

{{< note >}}
<!--
In Linux, the hostname field of the kernel (the `nodename` field of `struct utsname`) is limited to 64 characters.

If a Pod enables this feature and its FQDN is longer than 64 character, it will fail to start.
The Pod will remain in `Pending` status (`ContainerCreating` as seen by `kubectl`) generating
error events, such as "Failed to construct FQDN from Pod hostname and cluster domain".

This means that when using this field, 
you must ensure the combined length of the Pod's `metadata.name` (or `spec.hostname`) 
and `spec.subdomain` fields results in an FQDN that does not exceed 64 characters.
-->
在 Linux 中，内核的 hostname 字段（`struct utsname` 的 `nodename` 字段）限制为 64 个字符。

如果 Pod 启用了此特性，而其 FQDN 长于 64 个字符，则此 Pod 将无法启动。
Pod 将保持在 `Pending` 状态（在 `kubectl` 中显示为 `ContainerCreating`），并生成错误事件，
例如 “Failed to construct FQDN from Pod hostname and cluster domain”。

这意味着在使用此字段时，你必须确保 Pod 的 `metadata.name`（或 `spec.hostname`）
与 `spec.subdomain` 字段组合后的 FQDN 不超过 64 个字符。
{{< /note >}}

<!--
## Hostname with pod's hostnameOverride
-->
## 使用 Pod 的 hostnameOverride 设置主机名 {#hostname-with-pod-s-hostnameoverride}

{{< feature-state feature_gate_name="HostnameOverride" >}}

<!--
Setting a value for `hostnameOverride` in the Pod spec causes the kubelet 
to unconditionally set both the Pod's hostname and fully qualified domain name (FQDN)
to the `hostnameOverride` value. 

The `hostnameOverride` field has a length limitation of 64 characters 
and must adhere to the DNS subdomain names standard defined in [RFC 1123](https://datatracker.ietf.org/doc/html/rfc1123).

Example:
-->
在 Pod 规约中为 `hostnameOverride` 设置一个值，会导致 kubelet 无条件地将 Pod 的主机名和完全限定域名（FQDN）
都设置为 `hostnameOverride` 值。

`hostnameOverride` 字段的长度限制为 64 个字符，并且必须符合
[RFC 1123](https://datatracker.ietf.org/doc/html/rfc1123) 所定义的 DNS 子域名标准。

示例：

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
<!--
This only affects the hostname within the Pod; it does not affect the Pod's A or AAAA records in the cluster DNS server.
-->
这仅影响 Pod 内部的主机名；不会影响集群 DNS 服务器中 Pod 的 A 或 AAAA 记录。
{{< /note >}}

<!--
If `hostnameOverride` is set alongside `hostname` and `subdomain` fields:
* The hostname inside the Pod is overridden to the `hostnameOverride` value.
  
* The Pod's A and/or AAAA records in the cluster DNS server are still generated based on the `hostname` and `subdomain` fields.
-->
如果同时设置了 `hostnameOverride` 和 `hostname`、`subdomain` 字段：

* Pod 内部的主机名会被覆盖为 `hostnameOverride` 值。
* 集群 DNS 服务器中 Pod 的 A 和/或 AAAA 记录仍然基于 `hostname` 和 `subdomain` 字段生成。

<!--
Note: If `hostnameOverride` is set, you cannot simultaneously set the `hostNetwork` and `setHostnameAsFQDN` fields.
The API server will explicitly reject any create request attempting this combination.

For details on behavior when `hostnameOverride` is set in combination with 
other fields (hostname, subdomain, setHostnameAsFQDN, hostNetwork), 
see the table in the [KEP-4762 design details](https://github.com/kubernetes/enhancements/blob/master/keps/sig-network/4762-allow-arbitrary-fqdn-as-pod-hostname/README.md#design-details ).
-->
注意：如果设置了 `hostnameOverride`，则你不能同时设置 `hostNetwork` 和 `setHostnameAsFQDN` 字段。
API 服务器将显式拒绝任何尝试这种组合的创建请求。

关于在 `hostnameOverride` 与其他字段（hostname、subdomain、setHostnameAsFQDN、hostNetwork）
组合使用时的行为详情，请参阅
[KEP-4762 设计细节](https://github.com/kubernetes/enhancements/blob/master/keps/sig-network/4762-allow-arbitrary-fqdn-as-pod-hostname/README.md#design-details)中的表格。
