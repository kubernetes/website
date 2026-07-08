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
允许 kubelet TLS 服务器在指定的证书文件发生变化时更新其证书。

此特性在 kubelet 配置中指定了 `tlsCertFile` 和 `tlsPrivateKeyFile` 时非常有用。
对于其他情况，例如使用 TLS 引导启动时，此特性门控无效。
