---
# از Kubernetes حذف شد
title: BoundServiceAccountTokenVolume
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.13"
    toVersion: "1.20"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.21"
    toVersion: "1.21"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.22"
    toVersion: "1.23"    

removed: true
---
حجم‌های ServiceAccount را برای استفاده از یک حجم پیش‌بینی‌شده که شامل ServiceAccountTokenVolumeProjection است، منتقل کنید. مدیران کلاستر می‌توانند از معیار `serviceaccount_stale_tokens_total` برای نظارت بر حجم کاری که به توکن‌های توسعه‌یافته وابسته است، استفاده کنند. اگر چنین حجم کاری وجود ندارد، توکن‌های توسعه‌یافته را با شروع `kube-apiserver` با پرچم `--service-account-extend-token-expiration=false` خاموش کنید.
برای جزئیات بیشتر، [Bound Service Account Tokens](https://github.com/kubernetes/enhancements/blob/master/keps/sig-auth/1205-bound-service-account-tokens/README.md) را بررسی کنید.