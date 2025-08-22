---
title: RelaxedDNSSearchValidation
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"
    toVersion: "1.32"
  - stage: beta
    defaultValue: true
    fromVersion: "1.33"

---
Relax the server side validation for the DNS search string
(`.spec.dnsConfig.searches`) for containers. For example,
with this gate enabled, it is okay to include the `_` character
in the DNS name search string.
