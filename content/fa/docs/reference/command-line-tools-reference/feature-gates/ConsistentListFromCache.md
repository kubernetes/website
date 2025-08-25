---
title: ConsistentListFromCache
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.28"
    toVersion: "1.30"
  - stage: beta
    defaultValue: true
    fromVersion: "1.31"
---
عملکرد سرور Kubernetes API را با ارائه درخواست‌های **list** سازگار، مستقیماً از حافظه پنهان watch آن، بهبود می‌بخشد و مقیاس‌پذیری و زمان پاسخ را بهبود می‌بخشد.
برای ارائه لیست سازگار از حافظه پنهان، Kubernetes به نسخه جدیدتر etcd (نسخه ۳.۴.۳۱+ یا نسخه ۳.۵.۱۳+) نیاز دارد، که شامل اصلاحاتی برای ویژگی درخواست پیشرفت watch است.
اگر نسخه قدیمی‌تر etcd ارائه شود، Kubernetes به طور خودکار آن را تشخیص داده و به ارائه خواندن‌های سازگار از etcd بازمی‌گردد.
اعلان‌های پیشرفت، اطمینان حاصل می‌کنند که حافظه پنهان watch با etcd سازگار است و در عین حال نیاز به خواندن‌های حد نصاب با منابع فشرده از etcd را کاهش می‌دهد.
برای جزئیات بیشتر به مستندات Kubernetes در [Semantics for **get** and **list**](/docs/reference/using-api/api-concepts/#semantics-for-get-and-list) مراجعه کنید.