---
title: DeclarativeValidation
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.33"
---
اعتبارسنجی اعلانی APIهای درون‌درختی Kubernetes را فعال می‌کند. در صورت فعال بودن، APIهایی که دارای قوانین اعتبارسنجی اعلانی (که با استفاده از تگ‌های IDL در کد Go تعریف می‌شوند) هستند، هم کد اعتبارسنجی اعلانی تولید شده و هم کد اعتبارسنجی دست‌نویس اصلی را اجرا خواهند کرد. نتایج مقایسه می‌شوند و هرگونه اختلاف از طریق معیار `declarative_validation_mismatch_total` گزارش می‌شود. فقط نتیجه اعتبارسنجی دست‌نویس به کاربر بازگردانده می‌شود (مثلاً: در واقع در مسیر درخواست اعتبارسنجی می‌شود). اعتبارسنجی دست‌نویس اصلی همچنان اعتبارسنجی‌های معتبر هستند، اما اگر این فعال باشد، می‌توان این را تغییر داد اگر [DeclarativeValidationTakeover feature gate](/docs/reference/command-line-tools-reference/feature-gates/DeclarativeValidationTakeover.md) علاوه بر این گیت فعال باشد. این گیت ویژگی فقط روی kube-apiserver عمل می‌کند.