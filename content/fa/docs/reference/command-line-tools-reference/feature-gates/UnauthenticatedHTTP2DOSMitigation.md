---
title: UnauthenticatedHTTP2DOSMitigation
content_type: feature_gate
_build:
  list: never
  render: false
 
stages:
  - stage: beta
    defaultValue: false
    fromVersion: "1.28"
    toVersion: "1.28"
  - stage: beta
    defaultValue: true
    fromVersion: "1.29" 
---
کاهش حملات انکار سرویس (DoS) HTTP/2 را برای کلاینت‌های احراز هویت نشده فعال می‌کند. Kubernetes نسخه‌های ۱.۲۸.۰ تا ۱.۲۸.۲ شامل این ویژگی نمی‌شوند.
