---
title: ServiceAccountTokenNodeBindingValidation
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.29"
    toVersion: "1.29"
  - stage: beta
    defaultValue: true
    fromVersion: "1.30"
---
Керує тим, чи буде apiserver перевіряти посилання на Node у токенах службових облікових записів.

