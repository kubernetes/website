---
title: SELinuxChangePolicy
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"
    toVersion: "1.32"
  - stage: beta
    defaultValue: true
    fromVersion: "1.33"
---
فیلد `spec.securityContext.seLinuxChangePolicy` را فعال می‌کند.
این فیلد می‌تواند برای انصراف از اعمال برچسب SELinux به حجم‌های پاد با استفاده از گزینه‌های mount استفاده شود. این مورد زمانی لازم است که یک حجم واحد که از نصب با گزینه mount SELinux پشتیبانی می‌کند، بین پادهایی که برچسب‌های SELinux متفاوتی دارند، مانند پادهای ممتاز و غیر ممتاز، به اشتراک گذاشته شود.
فعال کردن ویژگی `SELinuxChangePolicy` مستلزم فعال بودن ویژگی `SELinuxMountReadWriteOncePod` است.
