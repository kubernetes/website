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
Enable the kubelet TLS server to update its certificate if the specified certificate file are changed.

This feature is useful when specifying `tlsCertFile` and `tlsPrivateKeyFile` in kubelet configuration.
The feature gate has no effect for other cases such as using TLS boostrap.
سرور TLS kubelet را فعال کنید تا در صورت تغییر فایل گواهی مشخص شده، گواهی خود را به‌روزرسانی کند.
این ویژگی هنگام تعیین `tlsCertFile` و `tlsPrivateKeyFile` در پیکربندی kubelet مفید است.
این ویژگی در موارد دیگر مانند استفاده از TLS boostrap تأثیری ندارد.