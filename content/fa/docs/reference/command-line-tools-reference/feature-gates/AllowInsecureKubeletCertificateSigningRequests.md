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
اعتبارسنجی پذیرش گره [CertificateSigningRequests](/docs/reference/access-authn-authz/certificate-signing-requests/#certificate-signing-requests) را برای امضاکنندگان kubelet غیرفعال کنید. مگر اینکه این ویژگی را غیرفعال کنید، Kubernetes الزام می‌کند که گواهی‌های kubelet جدید دارای `commonName` مطابق با `system:node:$nodeName` باشند.