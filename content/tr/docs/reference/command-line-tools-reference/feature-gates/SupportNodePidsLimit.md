---
# Removed from Kubernetes
title: SupportNodePidsLimit
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.14"
    toVersion: "1.14"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.15"
    toVersion: "1.19"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.20"
    toVersion: "1.23"    

removed: true
---
Enable the support to limiting PIDs on the Node.  The parameter
`pid=<number>` in the `--system-reserved` and `--kube-reserved` options can be specified to
ensure that the specified number of process IDs will be reserved for the system as a whole and for
 Kubernetes system daemons respectively.
