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
Use stricter validation for fields containing IP addresses and CIDR values.

In particular, with this feature gate enabled, octets within IPv4 addresses are
not allowed to have any leading `0`s, and IPv4-mapped IPv6 values (e.g.
`::ffff:192.168.0.1`) are forbidden. These sorts of values can potentially cause
security problems when different components interpret the same string as
referring to different IP addresses (as in CVE-2021-29923).

This tightening applies only to fields in build-in API kinds, and not to
custom resource kinds, values in Kubernetes configuration files, or
command-line arguments.