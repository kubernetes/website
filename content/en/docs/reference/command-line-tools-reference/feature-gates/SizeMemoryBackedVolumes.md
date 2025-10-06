---
title: SizeMemoryBackedVolumes
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.20"
    toVersion: "1.21"
  - stage: beta
    defaultValue: true
    fromVersion: "1.22"
    toVersion: "1.31"
  - stage: stable
    defaultValue: true
    fromVersion: "1.32"
    toVersion: "1.33"

removed: true

---
Enable kubelets to determine the size limit for
memory-backed volumes (mainly `emptyDir` volumes).
