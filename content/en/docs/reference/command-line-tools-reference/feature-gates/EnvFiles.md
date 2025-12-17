---
title: EnvFiles
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.34"
    toVersion: "1.34"
  - stage: beta
    defaultValue: true
    fromVersion: "1.35"
---
Support defining container's Environment Variable Values via File.
See [Define Environment Variable Values Using An Init Container](/docs/tasks/inject-data-application/define-environment-variable-via-file) for more details.