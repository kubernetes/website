---
title: HPAExternalMetricFallback
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.36"
---
Enables optional fallback configuration for the `ExternalMetricSource` type in
`HorizontalPodAutoscaler`, allowing users to specify a failure duration and a
desired replica count to use when the external metric has been unavailable for
the configured threshold.
