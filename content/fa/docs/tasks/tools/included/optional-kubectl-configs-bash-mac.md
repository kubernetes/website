---
title: "تکمیل خودکار bash در macOS"
description: "برخی پیکربندی‌های اختیاری برای تکمیل خودکار دستورات bash در macOS."
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

### مقدمه

اسکریپت تکمیل kubectl برای Bash را می توان با «kubectl completion bash» ایجاد کرد. منبع‌دهی این اسکریپت در پوسته شما، تکمیل kubectl را فعال می‌کند.

با این حال، اسکریپت تکمیل kubectl به [**bash-completion**](https://github.com/scop/bash-completion) بستگی دارد که بنابراین باید قبلاً آن را نصب کنید.

{{< هشدار>}}
دو نسخه از bash-completion وجود دارد، نسخه ۱ و نسخه ۲. نسخه ۱ برای Bash 3.2 (که پیش‌فرض در macOS است) و نسخه ۲ برای Bash 4.1+ است. اسکریپت تکمیل kubectl **با bash-completion نسخه ۱ و Bash 3.2 به درستی کار نمی‌کند**. برای این کار به **bash-completion نسخه ۲** و **Bash 4.1+** نیاز است. بنابراین، برای اینکه بتوانید به درستی از تکمیل kubectl در macOS استفاده کنید، باید Bash 4.1+ را نصب و استفاده کنید ([*instructions*](https://itnext.io/upgrading-bash-on-macos-7138bd1066ba)). دستورالعمل‌های زیر فرض می‌کنند که شما از Bash 4.1+ استفاده می‌کنید (یعنی هر نسخه Bash از ۴.۱ یا جدیدتر).
{{< /هشدار >}}

### ارتقا Bash

دستورالعمل‌های اینجا فرض می‌کنند که شما از Bash نسخه ۴.۱ به بالا استفاده می‌کنید. می‌توانید نسخه Bash خود را با اجرای دستور زیر بررسی کنید:

```bash
echo $BASH_VERSION
```

اگر خیلی قدیمی است، می‌توانید آن را با استفاده از Homebrew نصب/ارتقاء دهید:

```bash
brew install bash
```

پوسته خود را دوباره بارگیری کنید و بررسی کنید که نسخه مورد نظر در حال استفاده است:

```bash
echo $BASH_VERSION $SHELL
```

Homebrew معمولاً آن را در `/usr/local/bin/bash` نصب می‌کند.

### نصب bash-completion

{{< توجه >}}
همانطور که گفته شد، این دستورالعمل‌ها فرض می‌کنند که شما از Bash 4.1+ استفاده می‌کنید، به این معنی که bash-completion نسخه ۲ را نصب خواهید کرد (برخلاف Bash 3.2 و bash-completion نسخه ۱، که در این صورت kubectl-completion کار نخواهد کرد).
{{< /توجه >}}

می‌توانید با استفاده از دستور `type _init_completion`` بررسی کنید که آیا bash-completion نسخه ۲ از قبل نصب شده است یا خیر. در غیر این صورت، می‌توانید آن را با Homebrew نصب کنید:

```bash
brew install bash-completion@2
```

همانطور که در خروجی این دستور آمده است، موارد زیر را به پرونده `~/.bash_profile` خود اضافه کنید:

```bash
brew_etc="$(brew --prefix)/etc" && [[ -r "${brew_etc}/profile.d/bash_completion.sh" ]] && . "${brew_etc}/profile.d/bash_completion.sh"
```

پوسته خود را دوباره بارگیری کنید و بررسی کنید که bash-completion v2 به درستی با «type_init_completion» نصب شده باشد.

### فعال کردن تکمیل خودکار kubectl

اکنون باید مطمئن شوید که اسکریپتkubectl-completion در تمام جلسات پوسته شما منبع‌یابی می‌شود. روش‌های مختلفی برای دستیابی به این هدف وجود دارد:

- منبع اسکریپت تکمیل را در پرونده «~/.bash_profile» خود قرار دهید:

    ```bash
    echo 'source <(kubectl completion bash)' >>~/.bash_profile
    ```

- اسکریپت تکمیل را به پوشه `/usr/local/etc/bash_completion.d` اضافه کنید:

    ```bash
    kubectl completion bash >/usr/local/etc/bash_completion.d/kubectl
    ```

- اگر برای kubectl یک نام مستعار دارید، می‌توانید shell-completion را طوری توسعه دهید که با آن نام مستعار کار کند:

    ```bash
    echo 'alias k=kubectl' >>~/.bash_profile
    echo 'complete -o default -F __start_kubectl k' >>~/.bash_profile
    ```

- اگر kubectl را با Homebrew نصب کرده‌اید (همانطور که [اینجا](/docs/tasks/tools/install-kubectl-macos/#install-with-homebrew-on-macos) توضیح داده شده است)، آنگاه اسکریپت تکمیل kubectl باید از قبل در `/usr/local/etc/bash_completion.d/kubectl` باشد. در این صورت، لازم نیست کاری انجام دهید.

   {{< توجه >}}
   نصب Homebrew از bash-completion نسخه ۲ تمام فایل‌های موجود در پوشه `BASH_COMPLETION_COMPAT_DIR` را منبع می‌کند، به همین دلیل دو روش آخر کار می‌کنند.
   {{< /توجه >}}

در هر صورت، پس از بارگذاری مجدد پوسته، تکمیل kubectl باید به درستی انجام شود.
