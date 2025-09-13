---
title: ReduceDefaultCrashLoopBackOffDecay
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.33"
---
کاهش تأخیر اولیه و حداکثر تأخیر ایجاد شده بین راه‌اندازی مجدد کانتینرها برای یک گره برای کانتینرهای موجود در `CrashLoopBackOff` در سراسر خوشه به تأخیر اولیه `1 ثانیه` و حداکثر تأخیر `60 ثانیه` فعال شد.