---
title: "تکمیل خودکار bash در لینوکس"
description: "برخی پیکربندی‌های اختیاری برای تکمیل خودکار دستورات bash در لینوکس."
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

### مقدمه

اسکریپت تکمیل kubectl برای Bash را می‌توان با دستور `kubectl completion bash` ایجاد کرد. منبع‌یابی اسکریپت تکمیل در پوسته شما، تکمیل خودکار kubectl را فعال می‌کند.

با این حال، اسکریپت تکمیل به [**bash-completion**](https://github.com/scop/bash-completion) بستگی دارد، به این معنی که ابتدا باید این نرم‌افزار را نصب کنید (می‌توانید با اجرای `type _init_completion` بررسی کنید که آیا bash-completion از قبل نصب شده است یا خیر).

### نصب bash-completion

bash-completion توسط بسیاری از مدیران بسته ارائه می‌شود (به [اینجا](https://github.com/scop/bash-completion#installation) مراجعه کنید). می‌توانید آن را با `apt-get install bash-completion` یا `yum install bash-completion` و غیره نصب کنید.

دستورات بالا پرونده `/usr/share/bash-completion/bash_completion` را ایجاد می‌کنند که اسکریپت اصلی bash-completion است. بسته به مدیر بسته شما، باید این پرونده را به صورت دستی در پرونده `~/.bashrc` خود قرار دهید.

برای فهمیدن این موضوع، پوسته خود را مجدداً بارگذاری کنید و `type _init_completion` را اجرا کنید. اگر دستور با موفقیت اجرا شد، شما از قبل تنظیم کرده اید، در غیر این صورت موارد زیر را به پرونده `~/.bashrc` خود اضافه کنید:

```bash
source /usr/share/bash-completion/bash_completion
```

پوسته خود را دوباره بارگیری کنید و با تایپ «type _init_completion» بررسی کنید که bash-completion به درستی نصب شده است.

### فعال کردن تکمیل خودکار kubectl

#### Bash

اکنون باید مطمئن شوید که اسکریپت تکمیل kubectl در تمام جلسات پوسته شما منبع‌یابی می‌شود. دو راه برای انجام این کار وجود دارد:

{{< tabs name="kubectl_bash_autocompletion" >}}
{{< tab name="User" codelang="bash" >}}
echo 'source <(kubectl completion bash)' >>~/.bashrc
{{< /tab >}}
{{< tab name="System" codelang="bash" >}}
kubectl completion bash | sudo tee /etc/bash_completion.d/kubectl > /dev/null
sudo chmod a+r /etc/bash_completion.d/kubectl
{{< /tab >}}
{{< /tabs >}}

اگر برای kubectl نام مستعار دارید، می‌توانید تکمیل پوسته را طوری گسترش دهید که با آن نام مستعار نیز کار کند:

```bash
echo 'alias k=kubectl' >>~/.bashrc
echo 'complete -o default -F __start_kubectl k' >>~/.bashrc
```

{{< توجه >}}
bash-completion تمام اسکریپت‌های تکمیل را در `/etc/bash_completion.d` قرار می دهد.
{{< /توجه >}}

هر دو رویکرد معادل هستند. پس از بارگذاری مجدد پوسته، تکمیل خودکار kubectl باید کار کند. برای فعال کردن تکمیل خودکار bash در جلسه فعلی پوسته، پرونده ~/.bashrc را منبع کنید:

```bash
source ~/.bashrc
```
