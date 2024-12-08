---
title: MutatingAdmissionPolicy
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.30"
---

У Kubernetes {{< skew currentVersion >}} цей елемент не має ефекту. У майбутньому випуску Kubernetes цей елемент може бути використано для увімкнення MutatingAdmissionPolicy у ланцюжку допусків.