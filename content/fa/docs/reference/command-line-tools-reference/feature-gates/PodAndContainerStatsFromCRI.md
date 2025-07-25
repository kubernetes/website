---
title: PodAndContainerStatsFromCRI
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.23"
---
kubelet را طوری پیکربندی کنید که آمار کانتینر و پاد را از زمان اجرای کانتینر CRI جمع‌آوری کند، نه اینکه آنها را از cAdvisor جمع‌آوری کند.
از نسخه ۱.۲۶، این شامل جمع‌آوری معیارها از CRI و انتشار آنها از طریق `/metrics/cadvisor` نیز می‌شود (به جای اینکه cAdvisor آنها را مستقیماً منتشر کند).