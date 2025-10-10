---
title: ComponentSLIs
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.26"
    toVersion: "1.26"
  - stage: beta
    defaultValue: true
    fromVersion: "1.27"
---
نقطه پایانی `/metrics/slis` را روی اجزای Kubernetes مانند kubelet، kube-scheduler، kube-proxy، kube-controller-manager، cloud-controller-manager فعال کنید تا بتوانید معیارهای بررسی سلامت را استخراج کنید.