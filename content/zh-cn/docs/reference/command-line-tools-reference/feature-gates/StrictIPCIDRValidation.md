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
对包含 IP 地址和 CIDR 值的字段使用更严格的校验。

<!--
In particular, with this feature gate enabled, octets within IPv4 addresses are
not allowed to have any leading `0`s, and IPv4-mapped IPv6 values (e.g.
`::ffff:192.168.0.1`) are forbidden. These sorts of values can potentially cause
security problems when different components interpret the same string as
referring to different IP addresses (as in CVE-2021-29923).
-->
具体而言，启用此特性门控后，IPv4 地址中的每个八位字节不允许出现前导 `0`，
同时禁止使用 IPv4 映射的 IPv6 值（例如 `::ffff:192.168.0.1`）。
当不同组件将同一个字符串解释为不同的 IP 地址时，这类值可能会导致安全问题
（如 CVE-2021-29923 中所述）。

<!--
This tightening applies only to fields in build-in API kinds, and not to
custom resource kinds, values in Kubernetes configuration files, or
command-line arguments.
-->
该校验收紧仅适用于内置 API 类型中的字段，不影响自定义资源类型、Kubernetes 配置文件中的值或命令行参数。
