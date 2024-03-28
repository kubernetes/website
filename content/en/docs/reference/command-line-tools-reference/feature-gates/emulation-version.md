---
title: EmulationVersion
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.30"
---
Enables a `--emulation-version` flag to emulate the capabiliites (APIs, features, ...) of a prior Kubernetes release version. 

When used, the capabilities available will match the emulated version. Any capabilities present in the binary version that were introduced after the emulation version will be unavailable and any capabilities removed after the emulation version will be available. This enables a binary version to emulate the behavior of a previous version with sufficient fidelity that interoperability with other system components can be defined in terms of the emulated version.
