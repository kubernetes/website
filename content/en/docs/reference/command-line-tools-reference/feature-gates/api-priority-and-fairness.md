---
title: APIPriorityAndFairness
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.18"
    toVersion: "1.19"
  - stage: beta
    defaultValue: true
    fromVersion: "1.20"
    toVersion: "1.28"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.29"    
---
Enable managing request concurrency with
prioritization and fairness at each server. (Renamed from `RequestManagement`)
