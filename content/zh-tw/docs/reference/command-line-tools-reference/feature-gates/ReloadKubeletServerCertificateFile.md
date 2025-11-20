---
title: ReloadKubeletServerCertificateFile
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.31"
---

<!--
Enable the kubelet TLS server to update its certificate if the specified certificate file are changed.

This feature is useful when specifying `tlsCertFile` and `tlsPrivateKeyFile` in kubelet configuration.
The feature gate has no effect for other cases such as using TLS bootstrap.
-->
允許 kubelet TLS 伺服器在指定的證書檔案發生變化時更新其證書。

此特性在 kubelet 設定中指定了 `tlsCertFile` 和 `tlsPrivateKeyFile` 時非常有用。
對於其他情況，例如使用 TLS 引導啓動時，此特性門控無效。
