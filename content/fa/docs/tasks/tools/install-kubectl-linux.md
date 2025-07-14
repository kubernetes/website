---
reviewers:
- moh0ps
title: نصب و راه‌اندازی kubectl در لینوکس
content_type: task
weight: 10
---

## {{% heading "prerequisites" %}}

شما باید از نسخه‌ای از kubectl استفاده کنید که در محدوده‌ی یک اختلاف جزئی نسخه با خوشه شما باشد. برای مثال، یک کلاینت v{{< skew currentVersion >}} می‌تواند با صفحات کنترل v{{< skew currentVersionAddMinor -1 >}}، v{{< skew currentVersionAddMinor 0 >}} و v{{< skew currentVersionAddMinor 1 >}} ارتباط برقرار کند. استفاده از آخرین نسخه سازگار kubectl به جلوگیری از مشکلات پیش‌بینی نشده کمک می‌کند.

## نصب kubectl در لینوکس

روش‌های زیر برای نصب kubectl در لینوکس وجود دارد:

- [نصب دودویی kubectl با curl در لینوکس](#install-kubectl-binary-with-curl-on-linux)
- [نصب با استفاده از مدیریت بسته بومی](#install-using-native-package-management)
- [نصب با استفاده از سایر ابزارهای مدیریت بسته](#install-using-other-package-management)

### نصب دودویی kubectl با curl در لینوکس

1. آخرین نسخه را با دستور زیر دانلود کنید:

   {{< tabs name="دانلود لینوکس دودویی" >}}
   {{< tab name="x86-64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
   {{< /tab >}}
   {{< tab name="ARM64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/arm64/kubectl"
   {{< /tab >}}
   {{< /tabs >}}

   {{< توجه >}}
   برای دانلود یک نسخه خاص، بخش `$(curl -L -s https://dl.k8s.io/release/stable.txt)` از دستور را با نسخه خاص جایگزین کنید.

   برای مثال، برای دانلود نسخه {{< skew currentPatchVersion >}} در لینوکس x86-64، تایپ کنید:

   ```bash
   curl -LO https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/linux/amd64/kubectl
   ```

   و برای لینوکس ARM64، تایپ کنید:

   ```bash
   curl -LO https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/linux/arm64/kubectl
   ```

   {{< /توجه >}}

1. اعتبارسنجی پوشه دودویی (اختیاری)

   پوشه بررسی kubectl را دانلود کنید:

   {{< tabs name="دانلود checksum لینوکس" >}}
   {{< tab name="x86-64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl.sha256"
   {{< /tab >}}
   {{< tab name="ARM64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/arm64/kubectl.sha256"
   {{< /tab >}}
   {{< /tabs >}}

   اعتبارسنجی پوشه دودویی kubectl با استفاده از پوشه checksum:

   ```bash
   echo "$(cat kubectl.sha256)  kubectl" | sha256sum --check
   ```

   اگر معتبر باشد، خروجی به صورت زیر است:

   ```console
   kubectl: OK
   ```

   اگر بررسی با شکست مواجه شود، `sha256` با وضعیت غیر صفر خارج می‌شود و خروجی مشابه زیر را چاپ می‌کند:

   ```console
   kubectl: FAILED
   sha256sum: WARNING: 1 computed checksum did NOT match
   ```

   {{< توجه >}}
   نسخه یکسانی از پوشه دودویی و checksum را دانلود کنید.
   {{< /توجه >}}

1. نصب kubectl

   ```bash
   sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
   ```

   {{< توجه >}}
   اگر در سیستم هدف دسترسی روت ندارید، همچنان می‌توانید kubectl را در پرونده `~/.local/bin` نصب کنید:

   ```bash
   chmod +x kubectl
   mkdir -p ~/.local/bin
   mv ./kubectl ~/.local/bin/kubectl
   # and then append (or prepend) ~/.local/bin to $PATH
   ```

   {{< /توجه >}}

1. برای اطمینان از به‌روز بودن نسخه نصب‌شده، آزمایش کنید:

   ```bash
   kubectl version --client
   ```

   یا برای مشاهده دقیق نسخه از این استفاده کنید:

   ```cmd
   kubectl version --client --output=yaml
   ```

### نصب با استفاده از مدیریت بسته بومی

{{< tabs name="نصب kubectl" >}}
{{% tab name="توزیع‌های مبتنی بر دبیان" %}}

1. فهرست بسته‌های `apt` را به‌روزرسانی کنید و بسته‌های مورد نیاز برای استفاده از مخزن کوبرنتیز `apt` را نصب کنید:

   ```shell
   sudo apt-get update
   # apt-transport-https may be a dummy package; if so, you can skip that package
   sudo apt-get install -y apt-transport-https ca-certificates curl gnupg
   ```

2. کلید امضای عمومی مخازن بسته کوبرنتیز را دانلود کنید. کلید امضای یکسانی برای همه مخازن استفاده می‌شود، بنابراین می‌توانید نسخه موجود در URL را نادیده بگیرید:

   ```shell
   # If the folder `/etc/apt/keyrings` does not exist, it should be created before the curl command, read the note below.
   # sudo mkdir -p -m 755 /etc/apt/keyrings
   curl -fsSL https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
   sudo chmod 644 /etc/apt/keyrings/kubernetes-apt-keyring.gpg # به برنامه‌های APT بدون امتیاز اجازه می‌دهد این حلقه کلید را بخوانند
   ```
   
{{< توجه >}}
در نسخه‌های قدیمی‌تر از دبیان ۱۲ و اوبونتو ۲۲.۰۴، پوشه `/etc/apt/keyrings` به طور پیش‌فرض وجود ندارد و باید قبل از دستور curl ایجاد شود.
{{< /توجه >}}

3. مخزن کوبرنتیز `apt` مناسب را اضافه کنید. اگر می‌خواهید از نسخه کوبرنتیز متفاوتی نسبت به {{< param "version" >}} استفاده کنید، {{< param "version" >}} را با نسخه فرعی مورد نظر در دستور زیر جایگزین کنید:

   ```shell
   # This overwrites any existing configuration in /etc/apt/sources.list.d/kubernetes.list
   echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list
   sudo chmod 644 /etc/apt/sources.list.d/kubernetes.list   # به ابزارهایی مانند command-not-found کمک می‌کند تا به درستی کار کنند
   ```

{{< توجه >}}
برای ارتقاء kubectl به نسخه فرعی دیگر، باید قبل از اجرای `apt-get update` و `apt-get upgrade`، نسخه را در `/etc/apt/sources.list.d/kubernetes.list` تغییر دهید. این روش با جزئیات بیشتر در [تغییر مخزن بسته کوبرنتیز](/docs/tasks/administer-cluster/kubeadm/change-package-repository/) توضیح داده شده است.
{{< /توجه >}}

4. فهرست بسته `apt` را به‌روزرسانی کنید، سپس kubectl را نصب کنید:

   ```shell
   sudo apt-get update
   sudo apt-get install -y kubectl
   ```

{{% /tab %}}

{{% tab name="توزیع‌های مبتنی بر Red Hat" %}}

1. مخزن کوبرنتیز `yum` را اضافه کنید. اگر می‌خواهید از نسخه کوبرنتیز
متفاوت از {{< param "version" >}} استفاده کنید، {{< param "version" >}} را با نسخه فرعی مورد نظر در دستور زیر جایگزین کنید.

   ```bash
   # این دستور هرگونه پیکربندی موجود در /etc/yum.repos.d/kubernetes.repo را بازنویسی می‌کند.
   cat <<EOF | sudo tee /etc/yum.repos.d/kubernetes.repo
   [kubernetes]
   name=Kubernetes
   baseurl=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/
   enabled=1
   gpgcheck=1
   gpgkey=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/repodata/repomd.xml.key
   EOF
   ```

{{< توجه >}}
برای ارتقاء kubectl به نسخه فرعی دیگر، باید قبل از اجرای `yum update`، نسخه را در `/etc/yum.repos.d/kubernetes.repo` تغییر دهید. این روش با جزئیات بیشتر در [تغییر مخزن بسته کوبرنتیز](/docs/tasks/administer-cluster/kubeadm/change-package-repository/) توضیح داده شده است.
{{< /توجه >}}

2. نصب kubectl با استفاده از `yum`:

   ```bash
   sudo yum install -y kubectl
   ```

{{% /tab %}}

{{% tab name="توزیع‌های مبتنی بر SUSE" %}}

1. مخزن کوبرنتیز `zypper` را اضافه کنید. اگر می‌خواهید از نسخه کوبرنتیز متفاوتی نسبت به {{< param "version" >}} استفاده کنید، {{< param "version" >}} را با نسخه فرعی مورد نظر در دستور زیر جایگزین کنید.

   ```bash
   #این دستور هرگونه پیکربندی موجود در /etc/zypp/repos.d/kubernetes.repo را بازنویسی می‌کند.
   cat <<EOF | sudo tee /etc/zypp/repos.d/kubernetes.repo
   [kubernetes]
   name=Kubernetes
   baseurl=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/
   enabled=1
   gpgcheck=1
   gpgkey=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/repodata/repomd.xml.key
   EOF
   ```

{{< توجه >}}
برای ارتقاء kubectl به نسخه فرعی دیگر، باید قبل از اجرای `zypper update`، نسخه را در `/etc/zypp/repos.d/kubernetes.repo` تغییر دهید. این روش با جزئیات بیشتر در [تغییر مخزن بسته کوبرنتیز](/docs/tasks/administer-cluster/kubeadm/change-package-repository/) توضیح داده شده است.
{{< /توجه >}}

2. `zypper` را به‌روزرسانی کنید و افزودن مخزن جدید را تأیید کنید:
   
   ```bash
   sudo zypper update
   ```

   وقتی این پیام ظاهر شد، «t» یا «a» را فشار دهید:

   ```
   New repository or package signing key received:

   Repository:       Kubernetes
   Key Fingerprint:  1111 2222 3333 4444 5555 6666 7777 8888 9999 AAAA
   Key Name:         isv:kubernetes OBS Project <isv:kubernetes@build.opensuse.org>
   Key Algorithm:    RSA 2048
   Key Created:      Thu 25 Aug 2022 01:21:11 PM -03
   Key Expires:      Sat 02 Nov 2024 01:21:11 PM -03 (expires in 85 days)
   Rpm Name:         gpg-pubkey-9a296436-6307a177

   Note: Signing data enables the recipient to verify that no modifications occurred after the data
   were signed. Accepting data with no, wrong or unknown signature can lead to a corrupted system
   and in extreme cases even to a system compromise.

   Note: A GPG pubkey is clearly identified by its fingerprint. Do not rely on the key's name. If
   you are not sure whether the presented key is authentic, ask the repository provider or check
   their web site. Many providers maintain a web page showing the fingerprints of the GPG keys they
   are using.

   Do you want to reject the key, trust temporarily, or trust always? [r/t/a/?] (r): a
   ```
   
3. نصب kubectl با استفاده از zypper:

   ```bash
   sudo zypper install -y kubectl
   ```

{{% /tab %}}
{{< /tabs >}}

### نصب با استفاده از سایر ابزارهای مدیریت بسته

{{< tabs name="other_kubectl_install" >}}
{{% tab name="Snap" %}}
اگر از اوبونتو یا توزیع لینوکس دیگری که از مدیر بسته‌ی [snap](https://snapcraft.io/docs/core/install) پشتیبانی می‌کند، استفاده می‌کنید، kubectl به عنوان یک برنامه‌ی [snap](https://snapcraft.io/) در دسترس است.

```shell
snap install kubectl --classic
kubectl version --client
```

{{% /tab %}}

{{% tab name="Homebrew" %}}
اگر از لینوکس استفاده می‌کنید و از مدیر بسته [Homebrew](https://docs.brew.sh/Homebrew-on-Linux) استفاده می‌کنید، kubectl برای [نصب](https://docs.brew.sh/Homebrew-on-Linux#install) در دسترس است.

```shell
brew install kubectl
kubectl version --client
```

{{% /tab %}}

{{< /tabs >}}

## تایید پیکربندی Kubectl

{{< include "included/verify-kubectl.md" >}}

## پیکربندی‌ها و افزونه‌های اختیاری kubectl

### فعال کردن تکمیل خودکار پوسته

kubectl از تکمیل خودکار دستورات Bash، Zsh، Fish و PowerShell پشتیبانی می‌کند که می‌تواند در تایپ کردن شما صرفه‌جویی زیادی کند.

در زیر مراحل تنظیم تکمیل خودکار برای Bash، Fish و Zsh آمده است.

{{< tabs name="kubectl_autocompletion" >}}
{{< tab name="Bash" include="included/optional-kubectl-configs-bash-linux.md" />}}
{{< tab name="Fish" include="included/optional-kubectl-configs-fish.md" />}}
{{< tab name="Zsh" include="included/optional-kubectl-configs-zsh.md" />}}
{{< /tabs >}}

### افزونه «kubectl convert» را نصب کنید

{{< include "included/kubectl-convert-overview.md" >}}

1. آخرین نسخه را با دستور زیر دانلود کنید:

   {{< tabs name="download_convert_binary_linux" >}}
   {{< tab name="x86-64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl-convert"
   {{< /tab >}}
   {{< tab name="ARM64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/arm64/kubectl-convert"
   {{< /tab >}}
   {{< /tabs >}}

1. اعتبارسنجی پوشه دودویی (اختیاری)

   پوشه بررسی kubectl-convert را دانلود کنید:

   {{< tabs name="download_convert_checksum_linux" >}}
   {{< tab name="x86-64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl-convert.sha256"
   {{< /tab >}}
   {{< tab name="ARM64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/arm64/kubectl-convert.sha256"
   {{< /tab >}}
   {{< /tabs >}}

   پوشه دودویی kubectl-convert را در برابر پوشه checksum اعتبار سنجی کنید:

   ```bash
   echo "$(cat kubectl-convert.sha256) kubectl-convert" | sha256sum --check
   ```

   اگر معتبر باشد، خروجی به صورت زیر است:

   ```console
   kubectl-convert: OK
   ```

   اگر بررسی با شکست مواجه شود، `sha256` با وضعیت غیر صفر خارج می‌شود و خروجی مشابه زیر را چاپ می‌کند:

   ```console
   kubectl-convert: FAILED
   sha256sum: WARNING: 1 computed checksum did NOT match
   ```

   {{< توجه >}}
   نسخه یکسانی از پوشه دودویی و checksum را دانلود کنید.
   {{< /توجه >}}

1. نصب kubectl-convert

   ```bash
   sudo install -o root -g root -m 0755 kubectl-convert /usr/local/bin/kubectl-convert
   ```

1. بررسی کنید که افزونه با موفقیت نصب شده است

   ```shell
   kubectl convert --help
   ```

   اگر خطایی مشاهده نکردید، به این معنی است که افزونه با موفقیت نصب شده است.

1. پس از نصب افزونه، پوشه های نصب را پاک کنید:

   ```bash
   rm kubectl-convert kubectl-convert.sha256
   ```

## {{% heading "whatsnext" %}}

{{< include "included/kubectl-whats-next.md" >}}
