---
title: MinDomainsInPodTopologySpread
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.24"
    toVersion: "1.24"
  - stage: beta
    defaultValue: false
    fromVersion: "1.25"
    toVersion: "1.26"
  - stage: beta
    defaultValue: true
    fromVersion: "1.27"
    toVersion: "1.29"
  - stage: stable
    defaultValue: true
    fromVersion: "1.30"
---
Enable `minDomains` in
[Pod topology spread constraints](/docs/concepts/scheduling-eviction/topology-spread-constraints/).
