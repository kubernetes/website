---
title: WatchListClient
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: false
    fromVersion: "1.30"
---
به یک کلاینت API اجازه می‌دهد تا به جای دریافت یک لیست کامل، جریانی از داده‌ها را درخواست کند.
این قابلیت در `client-go` موجود است و نیاز به فعال بودن ویژگی 
[WatchList](/docs/reference/command-line-tools-reference/feature-gates/) در سرور دارد.
اگر `WatchList` در سرور پشتیبانی نشود، کلاینت به طور یکپارچه به یک درخواست لیست استاندارد برمی‌گردد.