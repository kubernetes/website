---
title: KubeAPIServerWorkloadsTrust
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.38"
---
Makes the kube-apiserver use the ClusterTrustBundles with signer 'kubernetes.io/kube-apiserver-serving'
when injecting the kube-apiserver serving certificate trust to workloads.
This is injected instead of the 'kube-root-ca.crt' configMap into automounted ServiceAccount
volumes.
