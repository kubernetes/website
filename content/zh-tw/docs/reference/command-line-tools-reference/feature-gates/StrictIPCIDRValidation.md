---
title: StrictIPCIDRValidation
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.33"
---

<!--
Use stricter validation for fields containing IP addresses and CIDR values.
-->
對包含 IP 地址和 CIDR 值的字段使用更嚴格的校驗。

<!--
In particular, with this feature gate enabled, octets within IPv4 addresses are
not allowed to have any leading `0`s, and IPv4-mapped IPv6 values (e.g.
`::ffff:192.168.0.1`) are forbidden. These sorts of values can potentially cause
security problems when different components interpret the same string as
referring to different IP addresses (as in CVE-2021-29923).
-->
具體而言，啓用此特性門控後，IPv4 地址中的每個八位字節不允許出現前導 `0`，
同時禁止使用 IPv4 映射的 IPv6 值（例如 `::ffff:192.168.0.1`）。
當不同組件將同一個字符串解釋爲不同的 IP 地址時，這類值可能會導致安全問題
（如 CVE-2021-29923 中所述）。

<!--
This tightening applies only to fields in build-in API kinds, and not to
custom resource kinds, values in Kubernetes configuration files, or
command-line arguments.
-->
該校驗收緊僅適用於內置 API 類型中的字段，不影響自定義資源類型、Kubernetes 設定檔案中的值或命令列參數。
