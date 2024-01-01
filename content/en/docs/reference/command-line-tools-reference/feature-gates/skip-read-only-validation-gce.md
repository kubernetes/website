---
title: SkipReadOnlyValidationGCE
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.28"
    toVersion: "1.28"
  - stage: deprecated
    defaultValue: true
    fromVersion: "1.29"  
---
Disable validation for Google Cloud Engine (GCE) regarding the usage of PersistentDisk volumes. In previous versions, workloads (e.g., Deployments, DaemonSets, etc.) using PersistentDisk volumes were required to operate in read-only mode. This validation, despite incurring relatively high implementation costs, provided limited value. Starting from version 1.29, this validation is no longer enforced. If you encounter issues with this change in a specific use-case, you can set the SkipReadOnlyValidationGCE feature gate to false to re-enable the validation. If necessary, please file a Kubernetes bug report with details.

