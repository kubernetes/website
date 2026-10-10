---
title: ManifestBasedAdmissionControlConfig
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.36"
---
Enable loading admission webhooks and CEL-based admission policies from
static manifest files on disk via the `staticManifestsDir` field in
`AdmissionConfiguration`. These policies are active from API server startup,
survive etcd unavailability, and can protect API-based admission resources
from modification.
