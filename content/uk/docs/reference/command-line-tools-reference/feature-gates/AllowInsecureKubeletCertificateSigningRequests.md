---
title: AllowInsecureKubeletCertificateSigningRequests
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.31"
---
Ввімкнення перевірки допуску вузла [CertificateSigningRequests](/docs/reference/access-authn-authz/certificate-signing-requests/#certificate-signing-requests) для підписувачів kubelet. Якщо ви не вимкнете цю функціональну можливість, Kubernetes вимагатиме, щоб нові сертифікати kubelet мали `commonName`, що відповідає `system:node:$nodeName`.
