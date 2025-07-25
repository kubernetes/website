---
reviewers:
- moh0ps
title: نصب و راه‌اندازی kubectl در ویندوز
content_type: task
weight: 10
---

## {{% heading "prerequisites" %}}

شما باید از نسخه‌ای از kubectl استفاده کنید که در محدوده‌ی یک اختلاف جزئی نسخه با خوشه شما باشد. برای مثال، یک کلاینت v{{< skew currentVersion >}} می‌تواند با صفحات کنترل v{{< skew currentVersionAddMinor -1 >}}، v{{< skew currentVersionAddMinor 0 >}} و v{{< skew currentVersionAddMinor 1 >}} ارتباط برقرار کند. استفاده از آخرین نسخه سازگار kubectl به جلوگیری از مشکلات پیش‌بینی نشده کمک می‌کند.

## نصب kubectl روی ویندوز

روش‌های زیر برای نصب kubectl در ویندوز وجود دارد:

- [نصب دودویی kubectl روی ویندوز (از طریق دانلود مستقیم یا curl)](#install-kubectl-binary-on-windows-via-direct-download-or-curl)
- [نصب روی ویندوز با استفاده از Chocolatey، Scoop یا Winget](#install-nonstandard-package-tools)

### نصب دودویی kubectl روی ویندوز (از طریق دانلود مستقیم یا curl)

1. شما دو گزینه برای نصب kubectl روی دستگاه ویندوزی خود دارید.

   - دانلود مستقیم:
     
     با مراجعه به صفحه انتشار Kubernetes (https://kubernetes.io/releases/download/#binaries)، آخرین نسخه دودویی انتشار وصله {{< skew currentVersion >}} را مستقیماً برای معماری خاص خود دانلود کنید. حتماً پوشه دودویی صحیح را برای معماری خود انتخاب کنید (مثلاً amd64، arm64 و غیره).
   
   - استفاده از curl:

     اگر `curl` را نصب کرده‌اید، از این دستور استفاده کنید:

     ```powershell
     curl.exe -LO "https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubectl.exe"
     ```

   {{< note >}}
  برای اطلاع از آخرین نسخه پایدار (مثلاً برای اسکریپت‌نویسی)، به [https://dl.k8s.io/release/stable.txt](https://dl.k8s.io/release/stable.txt) نگاهی بیندازید.
   {{< /note >}}

1. اعتبارسنجی پوشه دودویی (اختیاری)

   پوشه بررسی `kubectl` را دانلود کنید:

   ```powershell
   curl.exe -LO "https://dl.k8s.io/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubectl.exe.sha256"
   ```

   پوشه دودویی«kubectl» را در برابر پوشه checksum اعتبار سنجی کنید:

   - استفاده از خط فرمان برای مقایسه دستی خروجی `CertUtil` با پوشه checksum دانلود شده:

     ```cmd
     CertUtil -hashfile kubectl.exe SHA256
     type kubectl.exe.sha256
     ```

   - استفاده از PowerShell برای خودکارسازی تأیید با استفاده از عملگر `-eq` برای دریافت نتیجه `True` یا `False`:

     ```powershell
      $(Get-FileHash -Algorithm SHA256 .\kubectl.exe).Hash -eq $(Get-Content .\kubectl.exe.sha256)
     ```

1. پوشه دودویی`kubectl` را به متغیر محیطی `PATH` خود اضافه یا در ابتدای آن قرار دهید.

1. تست کنید تا مطمئن شوید که نسخه «kubectl» همان نسخه دانلود شده است:

   ```cmd
   kubectl version --client
   ```
   
   یا برای مشاهده دقیق نسخه از این استفاده کنید:

   ```cmd
   kubectl version --client --output=yaml
   ```



{{< note >}}
[داکر دسکتاپ برای ویندوز](https://docs.docker.com/docker-for-windows/#kubernetes) نسخه مخصوص به خود از `kubectl` را به `PATH` اضافه می‌کند. اگر قبلاً داکر دسکتاپ را نصب کرده‌اید، ممکن است لازم باشد ورودی `PATH` خود را قبل از ورودی اضافه شده توسط نصب‌کننده داکر دسکتاپ قرار دهید یا `kubectl` مربوط به داکر دسکتاپ را حذف کنید.
{{< /note >}}

### نصب روی ویندوز با استفاده از Chocolatey، Scoop یا winget {#install-nonstandard-package-tools}

1. برای نصب kubectl روی ویندوز می‌توانید از مدیر بسته [Chocolatey](https://chocolatey.org)، نصب کننده خط فرمان [Scoop](https://scoop.sh) یا مدیر بسته [winget](https://learn.microsoft.com/en-us/windows/package-manager/winget/) استفاده کنید.

   {{< tabs name="kubectl_win_install" >}}
   {{% tab name="choco" %}}
   ```powershell
   choco install kubernetes-cli
   ```
   {{% /tab %}}
   {{% tab name="scoop" %}}
   ```powershell
   scoop install kubectl
   ```
   {{% /tab %}}
   {{% tab name="winget" %}}
   ```powershell
   winget install -e --id Kubernetes.kubectl
   ```
   {{% /tab %}}
   {{< /tabs >}}

1. تست کنید تا مطمئن شوید نسخه ای که نصب کرده اید به روز است:

   ```powershell
   kubectl version --client
   ```

1. به پرونده خانه خود بروید:

   ```powershell
   # اگر از cmd.exe استفاده می‌کنید، دستور زیر را اجرا کنید: cd %USERPROFILE%
   cd ~
   ```

1. پوشه `.kube` را ایجاد کنید:

   ```powershell
   mkdir .kube
   ```

1. به پوشه‌ی `.kube` که ایجاد کرده‌اید بروید:

   ```powershell
   cd .kube
   ```

1. Kubectl را برای استفاده از خوشه کوبرنتیز راه دور پیکربندی کنید:

   ```powershell
   New-Item config -type file
   ```

{{< note >}}
پوشه پیکربندی را با یک ویرایشگر متن دلخواه مانند Notepad ویرایش کنید.
{{< /note >}}

## بررسی پیکربندی kubectl

{{< include "included/verify-kubectl.md" >}}

## پیکربندی‌ها و افزونه‌های اختیاری kubectl

### فعال کردن تکمیل خودکار پوسته

kubectl از تکمیل خودکار دستورات Bash، Zsh، Fish و PowerShell پشتیبانی می‌کند که می‌تواند در تایپ کردن شما صرفه‌جویی زیادی کند.

در زیر مراحل تنظیم تکمیل خودکار برای PowerShell آمده است.

{{< include "included/optional-kubectl-configs-pwsh.md" >}}

### نصب افزونه «kubectl convert»

{{< include "included/kubectl-convert-overview.md" >}}

1. آخرین نسخه را با دستور زیر دانلود کنید:

   ```powershell
   curl.exe -LO "https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubectl-convert.exe"
   ```

1. اعتبارسنجی پوشه دودویی (اختیاری).

   پوشه کنترلی `kubectl-convert` را دانلود کنید:

   ```powershell
   curl.exe -LO "https://dl.k8s.io/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubectl-convert.exe.sha256"
   ```

   پوشه دودویی «kubectl-convert» را در برابر پوشه checksum اعتبار سنجی کنید:

   - استفاده از خط فرمان برای مقایسه دستی خروجی `CertUtil` با پوشه checksum دانلود شده:

     ```cmd
     CertUtil -hashfile kubectl-convert.exe SHA256
     type kubectl-convert.exe.sha256
     ```

   - استفاده از PowerShell برای خودکارسازی تأیید با استفاده از عملگر `-eq` برای دریافت نتیجه `True` یا `False`:

     ```powershell
     $($(CertUtil -hashfile .\kubectl-convert.exe SHA256)[1] -replace " ", "") -eq $(type .\kubectl-convert.exe.sha256)
     ```

1. پوشه دودویی `kubectl-convert` را به متغیر محیطی `PATH` خود اضافه یا در ابتدای آن قرار دهید.

1. بررسی کنید که افزونه با موفقیت نصب شده است.

   ```shell
   kubectl convert --help
   ```

   اگر خطایی مشاهده نکردید، به این معنی است که افزونه با موفقیت نصب شده است.

1. پس از نصب افزونه، پوشه های نصب را پاک کنید:

   ```powershell
   del kubectl-convert.exe
   del kubectl-convert.exe.sha256
   ```

## {{% heading "whatsnext" %}}

{{< include "included/kubectl-whats-next.md" >}}
