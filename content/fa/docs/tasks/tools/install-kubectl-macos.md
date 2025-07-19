---
reviewers:
- moh0ps
title: نصب و راه‌اندازی kubectl در macOS
content_type: task
weight: 10
---

## {{% heading "prerequisites" %}}

شما باید از نسخه‌ای از kubectl استفاده کنید که در محدوده‌ی یک اختلاف جزئی نسخه با خوشه شما باشد. برای مثال، یک کلاینت v{{< skew currentVersion >}} می‌تواند با صفحات کنترل v{{< skew currentVersionAddMinor -1 >}}، v{{< skew currentVersionAddMinor 0 >}} و v{{< skew currentVersionAddMinor 1 >}} ارتباط برقرار کند. استفاده از آخرین نسخه سازگار kubectl به جلوگیری از مشکلات پیش‌بینی نشده کمک می‌کند.

## نصب kubectl روی macOS

روش‌های زیر برای نصب kubectl در macOS وجود دارد:

- [نصب kubectl روی macOS](#install-kubectl-on-macos)
  - [نصب دودویی kubectl با curl در macOS](#install-kubectl-binary-with-curl-on-macos)
  - [نصب با Homebrew در macOS](#install-with-homebrew-on-macos)
  - [نصب با Macports روی macOS](#install-with-macports-on-macos)
- [بررسی پیکربندی kubectl](#verify-kubectl-configuration)
- [پیکربندی‌ها و افزونه‌های اختیاری kubectl](#optional-kubectl-configurations-and-plugins)
  - [فعال کردن تکمیل خودکار پوسته](#enable-shell-autocompletion)
  - [نصب افزونه «kubectl convert»](#install-kubectl-convert-plugin)

### نصب دودویی kubectl با curl در macOS

1. آخرین نسخه را دانلود کنید:

   {{< tabs name="download_binary_macos" >}}
   {{< tab name="Intel" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl"
   {{< /tab >}}
   {{< tab name="Apple Silicon" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/arm64/kubectl"
   {{< /tab >}}
   {{< /tabs >}}

   {{< note >}}
   برای دانلود یک نسخه خاص، بخش `$(curl -L -s https://dl.k8s.io/release/stable.txt)` از دستور را با نسخه خاص جایگزین کنید.

   به عنوان مثال، برای دانلود نسخه {{< skew currentPatchVersion >}} در MacOS اینتل، تایپ کنید:

   ```bash
   curl -LO "https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/darwin/amd64/kubectl"
   ```

   و برای macOS روی Apple Silicon، تایپ کنید:

   ```bash
   curl -LO "https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/darwin/arm64/kubectl"
   ```

   {{< /note >}}

1. اعتبارسنجی پوشه دودویی (اختیاری)

   پوشه بررسی kubectl را دانلود کنید:

   {{< tabs name="download_checksum_macos" >}}
   {{< tab name="Intel" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl.sha256"
   {{< /tab >}}
   {{< tab name="Apple Silicon" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/arm64/kubectl.sha256"
   {{< /tab >}}
   {{< /tabs >}}
  
   اعتبارسنجی پوشه دودویی kubectl با استفاده از پوشه checksum:

   ```bash
   echo "$(cat kubectl.sha256)  kubectl" | shasum -a 256 --check
   ```

   اگر معتبر باشد، خروجی به صورت زیر است:

   ```console
   kubectl: OK
   ```

   اگر بررسی با شکست مواجه شود، `shasum` با وضعیت غیر صفر خارج می‌شود و خروجی مشابه زیر را چاپ می‌کند:

   ```console
   kubectl: FAILED
   shasum: WARNING: 1 computed checksum did NOT match
   ```

   {{< note >}}
   نسخه یکسانی از پوشه دودویی و checksum را دانلود کنید.
   {{< /note >}}

1. پوشه دودویی kubectl را قابل اجرا کنید.

   ```bash
   chmod +x ./kubectl
   ```

1. پوشه دودویی kubectl را به یک پوشه در مسیر PATH سیستم خود منتقل کنید.

   ```bash
   sudo mv ./kubectl /usr/local/bin/kubectl
   sudo chown root: /usr/local/bin/kubectl
   ```

   {{< note >}}
   مطمئن شوید که `/usr/local/bin` در متغیر محیطی PATH شما قرار دارد.
   {{< /note >}}

1. تست کنید تا مطمئن شوید نسخه ای که نصب کرده اید به روز است:

   ```bash
   kubectl version --client
   ```
   
   یا برای مشاهده دقیق نسخه از این استفاده کنید:

   ```cmd
   kubectl version --client --output=yaml
   ```

1. پس از نصب و اعتبارسنجی kubectl، پوشه checksum را حذف کنید:

   ```bash
   rm kubectl.sha256
   ```

### نصب با Homebrew در macOS

اگر از macOS استفاده می‌کنید و از مدیر بسته [Homebrew](https://brew.sh/) استفاده می‌کنید، می‌توانید kubectl را با Homebrew نصب کنید.

1. دستور نصب را اجرا کنید:

   ```bash
   brew install kubectl
   ```

   یا

   ```bash
   brew install kubernetes-cli
   ```

1. تست کنید تا مطمئن شوید نسخه ای که نصب کرده اید به روز است:

   ```bash
   kubectl version --client
   ```

### نصب با Macports روی macOS

اگر از macOS استفاده می‌کنید و از مدیر بسته [Macports](https://macports.org/) استفاده می‌کنید، می‌توانید kubectl را با Macports نصب کنید.

1. دستور نصب را اجرا کنید:

   ```bash
   sudo port selfupdate
   sudo port install kubectl
   ```

1. تست کنید تا مطمئن شوید نسخه ای که نصب کرده اید به روز است:

   ```bash
   kubectl version --client
   ```

## بررسی پیکربندی kubectl

{{< include "included/verify-kubectl.md" >}}

## پیکربندی‌ها و افزونه‌های اختیاری kubectl

### فعال کردن تکمیل خودکار پوسته

kubectl از تکمیل خودکار دستورات Bash، Zsh، Fish و PowerShell پشتیبانی می‌کند که می‌تواند در تایپ کردن شما صرفه‌جویی زیادی کند.

در زیر مراحل تنظیم تکمیل خودکار برای Bash، Fish و Zsh آمده است.

{{< tabs name="kubectl_autocompletion" >}}
{{< tab name="Bash" include="included/optional-kubectl-configs-bash-mac.md" />}}
{{< tab name="Fish" include="included/optional-kubectl-configs-fish.md" />}}
{{< tab name="Zsh" include="included/optional-kubectl-configs-zsh.md" />}}
{{< /tabs >}}

### نصب افزونه «kubectl convert»

{{< include "included/kubectl-convert-overview.md" >}}

1. آخرین نسخه را با دستور زیر دانلود کنید:

   {{< tabs name="download_convert_binary_macos" >}}
   {{< tab name="Intel" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl-convert"
   {{< /tab >}}
   {{< tab name="Apple Silicon" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/arm64/kubectl-convert"
   {{< /tab >}}
   {{< /tabs >}}

1. اعتبارسنجی پوشه دودویی (اختیاری)

   پوشه بررسی kubectl-convert را دانلود کنید:

   {{< tabs name="download_convert_checksum_macos" >}}
   {{< tab name="Intel" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl-convert.sha256"
   {{< /tab >}}
   {{< tab name="Apple Silicon" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/arm64/kubectl-convert.sha256"
   {{< /tab >}}
   {{< /tabs >}}

   دودویی kubectl-convert را در برابر پوشه checksum اعتبار سنجی کنید:

   ```bash
   echo "$(cat kubectl-convert.sha256)  kubectl-convert" | shasum -a 256 --check
   ```

   اگر معتبر باشد، خروجی به صورت زیر است:

   ```console
   kubectl-convert: OK
   ```

   اگر بررسی با شکست مواجه شود، `shasum` با وضعیت غیر صفر خارج می‌شود و خروجی مشابه زیر را چاپ می‌کند:

   ```console
   kubectl-convert: FAILED
   shasum: WARNING: 1 computed checksum did NOT match
   ```

   {{< note >}}
   نسخه یکسانی از پوشه دودویی و checksum را دانلود کنید.
   {{< /note >}}

1. تبدیل پوشه دودویی kubectl-convert به پوشه اجرایی

   ```bash
   chmod +x ./kubectl-convert
   ```

1. پوشه دودویی kubectl-convert را به محل پوشه ای در سیستم خود به نام PATH منتقل کنید.

   ```bash
   sudo mv ./kubectl-convert /usr/local/bin/kubectl-convert
   sudo chown root: /usr/local/bin/kubectl-convert
   ```

   {{< note >}}
   مطمئن شوید که `/usr/local/bin` در متغیر محیطی PATH شما قرار دارد.
   {{< /note >}}

1. تأیید کنید که افزونه با موفقیت نصب شده است

   ```shell
   kubectl convert --help
   ```

   اگر خطایی مشاهده نکردید، به این معنی است که افزونه با موفقیت نصب شده است.

1. پس از نصب افزونه، پوشه‌های نصب را پاک کنید:

   ```bash
   rm kubectl-convert kubectl-convert.sha256
   ```

### حذف نصب kubectl در macOS

بسته به نحوه نصب `kubectl`، از یکی از روش‌های زیر استفاده کنید.

### حذف نصب kubectl با استفاده از خط فرمان

1.  پوشه دودویی `kubectl` را روی سیستم خود پیدا کنید:

    ```bash
    which kubectl
    ```

1.  پوشه دودویی `kubectl` را حذف کنید:

    ```bash
    sudo rm <path>
    ```
    عبارت `<path>` را با مسیر پوشه دودویی `kubectl` از مرحله قبل جایگزین کنید. برای مثال، `sudo rm /usr/local/bin/kubectl`.

### حذف kubectl با استفاده از homebrew

اگر `kubectl` را با استفاده از Homebrew نصب کرده‌اید، دستور زیر را اجرا کنید:

```bash
brew remove kubectl
```
  
## {{% heading "whatsnext" %}}

{{< include "included/kubectl-whats-next.md" >}}


