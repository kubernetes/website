---
title: StorageCapacityScoring
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.33"
---

گیت ویژگی `VolumeCapacityPriority` در نسخه ۱.۳۲ برای پشتیبانی از فضای ذخیره‌سازی که به صورت ایستا تأمین می‌شوند، استفاده می‌شد. از نسخه ۱.۳۳، گیت ویژگی جدید `StorageCapacityScoring` جایگزین گیت قدیمی `VolumeCapacityPriority` شده و پشتیبانی از فضای ذخیره‌سازی پویا را نیز به آن اضافه کرده است.
هنگامی که `StorageCapacityScoring` فعال باشد، افزونه VolumeBinding در kube-scheduler برای امتیازدهی به گره‌ها بر اساس ظرفیت ذخیره‌سازی روی هر یک از آنها توسعه داده می‌شود.[Storage Capacity](/docs/concepts/storage/storage-capacity/)