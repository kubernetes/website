---
title: CBORServingAndStorage
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"
---
Enables CBOR as a [supported encoding for requests and
responses](/docs/reference/using-api/api-concepts/#cbor-encoding), and as the preferred storage
encoding for custom resources.
