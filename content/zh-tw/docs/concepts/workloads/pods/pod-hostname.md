---
title: Pod 主機名
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
本文講述如何設置 Pod 的主機名、配置主機名後的潛在副作用以及底層機制。

<!-- body -->

<!--
## Default Pod hostname

When a Pod is created, its hostname (as observed from within the Pod) 
is derived from the Pod's metadata.name value. 
Both the hostname and its corresponding fully qualified domain name (FQDN) 
are set to the metadata.name value (from the Pod's perspective)
-->
## 默認 Pod 主機名 {#default-pod-hostname}

當 Pod 被創建時，其主機名（從 Pod 內部觀察）來源於 Pod 的 `metadata.name` 值。
主機名和其對應的完全限定域名（FQDN）都會被設置爲 `metadata.name` 值（從 Pod 的角度）。

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
由上述清單創建的 Pod 將其主機名和完全限定域名（FQDN）設置爲 `busybox-1`。

## 使用 Pod 的 hostname 和 subdomain 字段設置主機名 {#hostname-with-pod-s-hostname-and-subdomain-fields}

Pod 規約包含一個可選的 `hostname` 字段。
當此字段被設置時，其取值優先於 Pod 的 `metadata.name`，作爲 Pod 的主機名（從 Pod 內部觀察）。
例如，如果將 Pod 的 `spec.hostname` 設置爲 `my-host`，則 Pod 的主機名會被設置爲 `my-host`。

<!--
The Pod spec also includes an optional `subdomain` field, 
indicating the Pod belongs to a subdomain within its namespace. 
If a Pod has `spec.hostname` set to "foo" and spec.subdomain set 
to "bar" in the namespace `my-namespace`, its hostname becomes `foo` and its 
fully qualified domain name (FQDN) becomes 
`foo.bar.my-namespace.svc.cluster-domain.example` (observed from within the Pod).
-->
Pod 規約還包含一個可選的 `subdomain` 字段，表示 Pod 屬於其命名空間中的某個子域。
如果 Pod 的 `spec.hostname` 設置爲 `foo`，`spec.subdomain` 設置爲 `my-namespace` 命名空間中的 `bar`，
則其主機名爲 `foo`，完全限定域名（FQDN）爲 `foo.bar.my-namespace.svc.cluster-domain.example`（從 Pod 內部觀察）。

<!--
When both hostname and subdomain are set, the cluster's DNS server will 
create A and/or AAAA records based on these fields. 
Refer to: [Pod's hostname and subdomain fields](/docs/concepts/services-networking/dns-pod-service/#pod-hostname-and-subdomain-field).

## Hostname with pod's setHostnameAsFQDN fields
-->
當 `hostname` 和 `subdomain` 都被設置時，集羣的 DNS 服務器會基於這些字段創建 A 和/或 AAAA 記錄。參考
[Pod 的 hostname 和 subdomain 字段](/zh-cn/docs/concepts/services-networking/dns-pod-service/#pod-hostname-and-subdomain-field)。

## 使用 Pod 的 setHostnameAsFQDN 字段設置主機名 {#hostname-with-pod-s-sethostnameasfqdn-fields}

{{< feature-state for_k8s_version="v1.22" state="stable" >}}

<!--
When a Pod is configured to have fully qualified domain name (FQDN), its
hostname is the short hostname. For example, if you have a Pod with the fully
qualified domain name `busybox-1.busybox-subdomain.my-namespace.svc.cluster-domain.example`,
then by default the `hostname` command inside that Pod returns `busybox-1` and the
`hostname --fqdn` command returns the FQDN.
-->
當 Pod 被配置爲使用完全限定域名（FQDN）時，則其主機名是短的主機名。
例如，如果 Pod 的完全限定域名是 `busybox-1.busybox-subdomain.my-namespace.svc.cluster-domain.example`，
那麼該 Pod 內的 `hostname` 命令默認返回 `busybox-1`，而 `hostname --fqdn` 命令返回 FQDN。

<!--
When both `setHostnameAsFQDN: true` and the subdomain field is set in the Pod spec,
the kubelet writes the Pod's FQDN
into the hostname for that Pod's namespace. In this case, both `hostname` and `hostname --fqdn`
return the Pod's FQDN.

The Pod's FQDN is constructed in the same manner as previously defined.
It is composed of the Pod's `spec.hostname` (if specified) or `metadata.name` field,
the `spec.subdomain`, the `namespace` name, and the cluster domain suffix.
-->
當在 Pod 規約中同時設置了 `setHostnameAsFQDN: true` 和 `subdomain` 字段時，
kubelet 會將 Pod 的 FQDN 寫入該 Pod 命名空間的主機名中。
在這種情況下，`hostname` 和 `hostname --fqdn` 都會返回 Pod 的 FQDN。

Pod 的 FQDN 構建方式與前面定義的方式相同。
它由 Pod 的 `spec.hostname`（如果指定）或 `metadata.name` 字段、
`spec.subdomain`、`namespace` 名稱以及集羣域名後綴組成。

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
在 Linux 中，內核的 hostname 字段（`struct utsname` 的 `nodename` 字段）限制爲 64 個字符。

如果 Pod 啓用了此特性，而其 FQDN 長於 64 個字符，則此 Pod 將無法啓動。
Pod 將保持在 `Pending` 狀態（在 `kubectl` 中顯示爲 `ContainerCreating`），並生成錯誤事件，
例如 “Failed to construct FQDN from Pod hostname and cluster domain”。

這意味着在使用此字段時，你必須確保 Pod 的 `metadata.name`（或 `spec.hostname`）
與 `spec.subdomain` 字段組合後的 FQDN 不超過 64 個字符。
{{< /note >}}

<!--
## Hostname with pod's hostnameOverride
-->
## 使用 Pod 的 hostnameOverride 設置主機名 {#hostname-with-pod-s-hostnameoverride}

{{< feature-state feature_gate_name="HostnameOverride" >}}

<!--
Setting a value for `hostnameOverride` in the Pod spec causes the kubelet 
to unconditionally set both the Pod's hostname and fully qualified domain name (FQDN)
to the `hostnameOverride` value. 

The `hostnameOverride` field has a length limitation of 64 characters 
and must adhere to the DNS subdomain names standard defined in [RFC 1123](https://datatracker.ietf.org/doc/html/rfc1123).

Example:
-->
在 Pod 規約中爲 `hostnameOverride` 設置一個值，會導致 kubelet 無條件地將 Pod 的主機名和完全限定域名（FQDN）
都設置爲 `hostnameOverride` 值。

`hostnameOverride` 字段的長度限制爲 64 個字符，並且必須符合
[RFC 1123](https://datatracker.ietf.org/doc/html/rfc1123) 所定義的 DNS 子域名標準。

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
這僅影響 Pod 內部的主機名；不會影響集羣 DNS 服務器中 Pod 的 A 或 AAAA 記錄。
{{< /note >}}

<!--
If `hostnameOverride` is set alongside `hostname` and `subdomain` fields:
* The hostname inside the Pod is overridden to the `hostnameOverride` value.
  
* The Pod's A and/or AAAA records in the cluster DNS server are still generated based on the `hostname` and `subdomain` fields.
-->
如果同時設置了 `hostnameOverride` 和 `hostname`、`subdomain` 字段：

* Pod 內部的主機名會被覆蓋爲 `hostnameOverride` 值。
* 集羣 DNS 服務器中 Pod 的 A 和/或 AAAA 記錄仍然基於 `hostname` 和 `subdomain` 字段生成。

<!--
Note: If `hostnameOverride` is set, you cannot simultaneously set the `hostNetwork` and `setHostnameAsFQDN` fields.
The API server will explicitly reject any create request attempting this combination.

For details on behavior when `hostnameOverride` is set in combination with 
other fields (hostname, subdomain, setHostnameAsFQDN, hostNetwork), 
see the table in the [KEP-4762 design details](https://github.com/kubernetes/enhancements/blob/master/keps/sig-network/4762-allow-arbitrary-fqdn-as-pod-hostname/README.md#design-details ).
-->
注意：如果設置了 `hostnameOverride`，則你不能同時設置 `hostNetwork` 和 `setHostnameAsFQDN` 字段。
API 服務器將顯式拒絕任何嘗試這種組合的創建請求。

關於在 `hostnameOverride` 與其他字段（hostname、subdomain、setHostnameAsFQDN、hostNetwork）
組合使用時的行爲詳情，請參閱
[KEP-4762 設計細節](https://github.com/kubernetes/enhancements/blob/master/keps/sig-network/4762-allow-arbitrary-fqdn-as-pod-hostname/README.md#design-details)中的表格。
