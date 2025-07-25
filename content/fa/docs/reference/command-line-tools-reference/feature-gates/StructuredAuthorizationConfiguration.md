---
title: StructuredAuthorizationConfiguration
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
    toVersion: "1.31"
  - stage: stable
    defaultValue: true
    fromVersion: "1.32"
---
پیکربندی مجوز ساختاریافته را فعال کنید، به طوری که مدیران خوشه بتوانند بیش از یک [authorization webhook](/docs/reference/access-authn-authz/webhook/) را در زنجیره کنترل‌کننده سرور API مشخص کنند.