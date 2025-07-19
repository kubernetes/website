---
title: SELinuxMount
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.30"
    toVersion: "1.32"
  - stage: beta
    defaultValue: false
    fromVersion: "1.33"

---
با اجازه دادن به kubelet برای مانت کردن مستقیم ولوم‌ها برای یک Pod با برچسب صحیح SELinux به جای تغییر بازگشتی هر فایل روی ولوم‌ها، سرعت راه‌اندازی کانتینر را افزایش می‌دهد.
با گسترش پیاده‌سازی به تمام ولوم‌ها، بهبود عملکرد پشت گیت ویژگی `SELinuxMountReadWriteOncePod` را گسترش می‌دهد.
فعال کردن گیت ویژگی `SELinuxMount` مستلزم فعال بودن گیت‌های ویژگی `SELinuxMountReadWriteOncePod` و `SELinuxChangePolicy` است.