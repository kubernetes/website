---
title: "تکمیل خودکار fish"
description: "پیکربندی اختیاری برای فعال کردن تکمیل خودکار پوسته ماهی."
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

{{< note >}}
تکمیل خودکار برای Fish به kubectl 1.23 یا بالاتر نیاز دارد.
{{< /note >}}

اسکریپت تکمیل kubectl برای Fish را می‌توان با دستور `kubectl completion fish` ایجاد کرد. منبع‌یابی اسکریپت تکمیل در پوسته شما، تکمیل خودکار kubectl را فعال می‌کند.

برای انجام این کار در تمام جلسات پوسته خود، خط زیر را به پرونده `~/.config/fish/config.fish` خود اضافه کنید:

```shell
kubectl completion fish | source
```

پس از بارگذاری مجدد پوسته، تکمیل خودکار kubectl باید کار کند.
