---
title: "تکمیل خودکار zsh"
description: "برخی پیکربندی‌های اختیاری برای تکمیل خودکار zsh."
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

اسکریپت تکمیل kubectl برای Zsh را می‌توان با دستور `kubectl completion zsh` ایجاد کرد. منبع‌یابی اسکریپت تکمیل در پوسته شما، تکمیل خودکار kubectl را فعال می‌کند.

برای انجام این کار در تمام جلسات پوسته خود، موارد زیر را به پرونده `~/.zshrc` خود اضافه کنید:

```zsh
source <(kubectl completion zsh)
```

اگر برای kubectl نام مستعار داشته باشید، تکمیل خودکار kubectl به طور خودکار با آن کار خواهد کرد.

پس از بارگذاری مجدد پوسته، تکمیل خودکار kubectl باید کار کند.

اگر با خطایی مانند `2: command not found: compdef` مواجه شدید، کد زیر را به ابتدای پرونده `~/.zshrc` خود اضافه کنید:

```zsh
autoload -Uz compinit
compinit
```