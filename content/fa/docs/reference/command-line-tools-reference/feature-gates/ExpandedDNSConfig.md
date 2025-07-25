---
title: ExpandedDNSConfig
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.22"
    toVersion: "1.25"
  - stage: beta
    defaultValue: true
    fromVersion: "1.26"  
    toVersion: "1.27" 
  - stage: stable
    defaultValue: true
    fromVersion: "1.28"  
    toVersion: "1.29" 
removed: true
---
kubelet و kube-apiserver را فعال کنید تا مسیرهای جستجوی DNS بیشتر و لیست طولانی‌تری از مسیرهای جستجوی DNS را فراهم کنید. این ویژگی نیاز به پشتیبانی از زمان اجرای کانتینر دارد (Containerd: نسخه ۱.۵.۶ یا بالاتر، CRI-O: نسخه ۱.۲۲ یا بالاتر). به [Expanded DNS Configuration](/docs/concepts/services-networking/dns-pod-service/#expanded-dns-configuration). مراجعه کنید.