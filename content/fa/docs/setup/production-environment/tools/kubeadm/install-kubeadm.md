---
title: نصب kubeadm
content_type: task
weight: 10
card:
  name: setup
  weight: 40
  title: نصب kubeadm
---

<!-- overview -->

<img src="/images/kubeadm-stacked-color.png" align="right" width="150px"></img>
این صفحه نحوه نصب جعبه ابزار `kubeadm` را نشان می‌دهد.
برای کسب اطلاعات در مورد نحوه ایجاد یک خوشه(cluster) با kubeadm پس از انجام این فرآیند نصب، به صفحه [ایجاد یک خوشه با kubeadm](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/) مراجعه کنید.

{{< doc-versions-list "راهنمای نصب" >}}

## {{% heading "prerequisites" %}}

* یک میزبان لینوکس سازگار. پروژه کوبرنتیز دستورالعمل‌های عمومی برای توزیع‌های لینوکس مبتنی بر Debian و Red Hat و توزیع‌های بدون مدیر بسته ارائه می‌دهد.
* ۲ گیگابایت یا بیشتر رم برای هر دستگاه (هر چه کمتر باشد، فضای کمی برای برنامه‌های شما باقی می‌ماند).
* ۲ پردازنده مرکزی یا بیشتر برای ماشین‌های کنترلی.
* اتصال کامل شبکه بین تمام ماشین‌های موجود در خوشه (شبکه عمومی یا خصوصی اشکالی ندارد).
* نام میزبان، نشانی(آدرس) MAC و شناسه محصول منحصر به فرد برای هر گره(node). برای جزئیات بیشتر به [اینجا](#verify-mac-address) مراجعه کنید.
* پورت‌های خاصی روی دستگاه‌های شما باز هستند. برای جزئیات بیشتر به [اینجا](#check-required-ports) مراجعه کنید.

{{< note >}}
نصب `kubeadm` از طریق پرونده(فایل) های دودویی(باینری) انجام می‌شود که از پیوند(لینک) پویا استفاده می‌کنند و فرض می‌کنند که سیستم هدف شما `glibc` را ارائه می‌دهد.
این یک فرض منطقی در بسیاری از توزیع‌های لینوکس (از جمله دبیان، اوبونتو، فدورا، CentOS و غیره) است.
اما همیشه در مورد توزیع‌های سفارشی و سبک که به طور پیش‌فرض `glibc` را شامل نمی‌شوند، مانند Alpine Linux، صدق نمی‌کند.
انتظار می‌رود که توزیع یا شامل `glibc` یا یک [لایه سازگاری](https://wiki.alpinelinux.org/wiki/Running_glibc_programs) باشد که نمادهای مورد انتظار را ارائه می‌دهد.
{{< /note >}}

<!-- steps -->

## نسخه سیستم عامل خود را بررسی کنید

{{% thirdparty-content %}}

{{< tabs name="operating_system_version_check" >}}
{{% tab name="Linux" %}}

* پروژه kubeadm از هسته‌های LTS پشتیبانی می‌کند. برای مشاهده به [لیست هسته‌(kernel)های LTS](https://www.kernel.org/category/releases.html) مراجعه کنید.
* شما می‌توانید با استفاده از دستور `uname -r` نسخه هسته(kernel) را دریافت کنید.

برای اطلاعات بیشتر، به [الزامات هسته(kernel) لینوکس](/docs/reference/node/kernel-version-requirements/) مراجعه کنید.

{{% /tab %}}

{{% tab name="Windows" %}}

* پروژه kubeadm از نسخه‌های اخیر هسته(kernel) پشتیبانی می‌کند. برای مشاهده فهرستی از هسته(kernel) های اخیر، به [اطلاعات انتشار ویندوز سرور](https://learn.microsoft.com/en-us/windows/release-health/windows-server-release-info) مراجعه کنید.
* شما می‌توانید نسخه هسته(kernel) (که به آن نسخه سیستم عامل نیز گفته می‌شود) را با استفاده از دستور `systeminfo` مشاهده کنید.

برای اطلاعات بیشتر، به [سازگاری نسخه سیستم عامل ویندوز](/docs/concepts/windows/intro/#windows-os-version-support) مراجعه کنید.

{{% /tab %}}
{{< /tabs >}}

یک خوشه کوبرنتیز که توسط kubeadm ایجاد می‌شود، به نرم‌افزاری بستگی دارد که از ویژگی‌های هسته(kernel) استفاده می‌کند.
این نرم‌افزار شامل، اما نه محدود به
{{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}،
{{< glossary_tooltip term_id="kubelet" text="kubelet">}}، و یک افزونه {{< glossary_tooltip text="Container Network Interface" term_id="cni" >}} می‌شود.

برای کمک به شما در جلوگیری از خطاهای غیرمنتظره ناشی از عدم پشتیبانی از نسخه هسته، kubeadm بررسی پیش از اجرای `SystemVerification` را اجرا می‌کند. اگر نسخه هسته(kernel) پشتیبانی نشود، این بررسی با شکست مواجه می‌شود.

اگر می‌دانید که هسته(kernel) شما ویژگی‌های مورد نیاز را ارائه می‌دهد، حتی اگر kubeadm از نسخه آن پشتیبانی نکند، می‌توانید از بررسی صرف نظر کنید.

## بررسی کنید که نشانی(آدرس) MAC و product_uuid برای هر گره(node) منحصر به فرد باشند {#verify-mac-address}

* شما می‌توانید نشانی(آدرس) MAC رابط‌های شبکه را با استفاده از دستور `ip link` یا `ifconfig -a` دریافت کنید.
* شناسه محصول (product_uuid) را می‌توان با استفاده از دستور `sudo cat /sys/class/dmi/id/product_uuid` بررسی کرد.

بسیار محتمل است که دستگاه‌های سخت‌افزاری نشانی(آدرس) های منحصر به فردی داشته باشند، اگرچه برخی از ماشین‌های مجازی ممکن است مقادیر یکسانی داشته باشند. کوبرنتیز از این مقادیر برای شناسایی منحصر به فرد گره‌ها در خوشه استفاده می‌کند. اگر این مقادیر برای هر گره(node) منحصر به فرد نباشند، فرآیند نصب ممکن است [با شکست مواجه شود](https://github.com/kubernetes/kubeadm/issues/31).

## بررسی آداپتورهای شبکه

اگر بیش از یک adapters شبکه دارید و اجزای کوبرنتیز شما از طریق مسیر پیش‌فرض قابل دسترسی نیستند، توصیه می‌کنیم مسیر(های) IP را اضافه کنید تا نشانی(آدرس) های خوشه کوبرنتیز از طریق adapters مناسب عبور کنند.
## بررسی پورت‌های مورد نیاز {#check-required-ports}

این [پورت‌های مورد نیاز](/docs/reference/networking/ports-and-protocols/)
برای اینکه اجزای Kubernetes بتوانند با یکدیگر ارتباط برقرار کنند، باید باز باشند.
می‌توانید از ابزارهایی مانند [netcat](https://netcat.sourceforge.net) برای بررسی باز بودن یک پورت استفاده کنید. به عنوان مثال:

```shell
nc 127.0.0.1 6443 -zv -w 2
```

افزونه شبکه پاد که استفاده می‌کنید ممکن است نیاز به باز بودن پورت‌های خاصی داشته باشد. از آنجایی که این موضوع در هر افزونه شبکه پاد متفاوت است، لطفاً برای اطلاع از پورت(های) مورد نیاز افزونه‌ها، به مستندات آنها مراجعه کنید.

## پیکربندی Swap {#swap-configuration}

رفتار پیش‌فرض یک kubelet این است که در صورت شناسایی حافظه swap در یک گره، شروع به کار نکند. این بدان معناست که swap باید یا غیرفعال شود یا توسط kubelet تحمل شود.

* برای تحمل swap، `failSwapOn: false` را به پیکربندی kubelet یا به عنوان یک آرگومان خط فرمان اضافه کنید.
توجه: حتی اگر `failSwapOn: false` ارائه شود، بارهای کاری به طور پیش‌فرض به swap دسترسی نخواهند داشت.
این را می‌توان با تنظیم `swapBehavior`، دوباره در پرونده(فایل) پیکربندی kubelet، تغییر داد. برای استفاده از swap، `swapBehavior` را به غیر از تنظیم پیش‌فرض `NoSwap` تنظیم کنید.
برای جزئیات بیشتر به [مدیریت حافظه swap](/docs/concepts/cluster-administration/swap-memory-management) مراجعه کنید.
* برای غیرفعال کردن swap، می‌توان از دستور `sudo swapoff -a` برای غیرفعال کردن موقت swap استفاده کرد.

برای اینکه این تغییر در راه‌اندازی‌های مجدد پایدار بماند، مطمئن شوید که swap در پرونده‌های پیکربندی مانند `/etc/fstab`، `systemd.swap` غیرفعال شده است، بسته به اینکه چگونه روی سیستم شما پیکربندی شده است.


## نصب یک مجری کانتینر {#installing-runtime}

برای اجرای کانتینرها در پادها، کوبرنتیز از یک {{< glossary_tooltip term_id="container-runtime" text="container runtime" >}} استفاده می‌کند.

به طور پیش‌فرض، کوبرنتیز از {{< glossary_tooltip term_id="cri" text="Container Runtime Interface">}} (CRI)
برای ارتباط با مجری کانتینر انتخابی شما استفاده می‌کند.

اگر مجری کانتینر را مشخص نکنید، kubeadm به طور خودکار سعی می‌کند با اسکن لیستی از نقاط پایانی شناخته شده، مجری کانتینر نصب شده را تشخیص دهد.
اگر چندین مجری کانتینر شناسایی شود یا هیچ مجری کانتینری شناسایی نشود، kubeadm خطایی ایجاد می‌کند و از شما می‌خواهد که مشخص کنید می‌خواهید از کدام یک استفاده کنید.

برای اطلاعات بیشتر به [مجری های کانتینر](/docs/setup/production-environment/container-runtimes/) مراجعه کنید.

{{< note >}}
موتور Docker، [CRI](/docs/concepts/architecture/cri/) را پیاده‌سازی نمی‌کند که برای مجری کانتینر جهت کار با کوبرنتیز الزامی است. به همین دلیل، یک سرویس اضافی [cri-dockerd](https://mirantis.github.io/cri-dockerd/) باید نصب شود. cri-dockerd پروژه‌ای مبتنی بر پشتیبانی داخلی قدیمی موتور داکر است که در نسخه ۱.۲۴ از kubelet حذف شد.
{{< /note >}}

جداول زیر شامل نقاط پایانی شناخته شده برای سیستم عامل‌های پشتیبانی شده است:

{{< tabs name="container_runtime" >}}
{{% tab name="Linux" %}}

{{< table caption="Linux container runtimes" >}}
| Runtime                            | Path to Unix domain socket                   |
|------------------------------------|----------------------------------------------|
| containerd                         | `unix:///var/run/containerd/containerd.sock` |
| CRI-O                              | `unix:///var/run/crio/crio.sock`             |
| Docker Engine (using cri-dockerd)  | `unix:///var/run/cri-dockerd.sock`           |
{{< /table >}}

{{% /tab %}}

{{% tab name="Windows" %}}

{{< table caption="Windows container runtimes" >}}
| Runtime                            | Path to Windows named pipe                   |
|------------------------------------|----------------------------------------------|
| containerd                         | `npipe:////./pipe/containerd-containerd`     |
| Docker Engine (using cri-dockerd)  | `npipe:////./pipe/cri-dockerd`               |
{{< /table >}}

{{% /tab %}}
{{< /tabs >}}

## نصب kubeadm، kubelet و kubectl

شما این بسته‌ها را روی تمام دستگاه‌های خود نصب خواهید کرد:

* `kubeadm`: دستور راه اندازی خوشه.

* `kubelet`: مؤلفه‌ای که روی تمام ماشین‌های موجود در خوشه شما اجرا می‌شود و کارهایی مانند راه‌اندازی پادها و کانتینرها را انجام می‌دهد.

* `kubectl`: ابزار خط فرمان برای ارتباط با خوشه شما.

‘kubelet’ , kubeadm یا `kubectl` را برای شما نصب یا مدیریت **نخواهد** کرد، بنابراین باید مطمئن شوید که آنها با نسخه control plane کوبرنتیز که می‌خواهید kubeadm برای شما نصب کند، مطابقت دارند. اگر این کار را نکنید، خطر بروز انحراف نسخه وجود دارد که می‌تواند منجر به رفتار غیرمنتظره و باگ‌دار شود. با این حال، انحراف یک نسخه جزئی بین kubelet و control plane پشتیبانی می‌شود، اما نسخه kubelet هرگز نمی‌تواند از نسخه سرور API فراتر رود. به عنوان مثال، kubelet که نسخه ۱.۷.۰ را اجرا می‌کند باید کاملاً با یک سرور API نسخه ۱.۸.۰ سازگار باشد، اما برعکس آن امکان‌پذیر نیست.

برای اطلاعات بیشتر در مورد نصب `kubectl`، به [نصب و راه‌اندازی kubectl](/docs/tasks/tools/) مراجعه کنید.

{{< warning >}}
این دستورالعمل‌ها تمام بسته‌های کوبرنتیز را از هرگونه ارتقاء سیستم مستثنی می‌کنند.
دلیل این امر این است که kubeadm و کوبرنتیز نیاز به [فرایند ویژه ارتقاء](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/) دارند.
{{</ warning >}}

برای اطلاعات بیشتر در مورد انحراف نسخه، به موارد زیر مراجعه کنید:

* کوبرنتیز [نسخه و سیاست انحراف نسخه](/docs/setup/release/version-skew-policy/)
* ابزار Kubeadm-specific [سیاست انحراف نسخه](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#version-skew-policy)

{{% legacy-repos-deprecation %}}

{{< note >}}
برای هر نسخه فرعی کوبرنتیز یک مخزن بسته اختصاصی وجود دارد. اگر می‌خواهید نسخه فرعی دیگری غیر از v{{< skew currentVersion >}} نصب کنید، لطفاً به راهنمای نصب نسخه فرعی مورد نظر خود مراجعه کنید.
{{< /note >}}

{{< tabs name="k8s_install" >}}
{{% tab name="Debian-based distributions" %}}

این دستورالعمل‌ها برای کوبرنتیز v{{< skew currentVersion >}} هستند.

1. فهرست بسته‌های `apt` را به‌روزرسانی کنید و بسته‌های مورد نیاز برای استفاده از مخزن کوبرنتیز `apt` را نصب کنید:

   ```shell
   sudo apt-get update
   # apt-transport-https may be a dummy package; if so, you can skip that package
   sudo apt-get install -y apt-transport-https ca-certificates curl gpg
   ```

2. کلید امضای عمومی مخازن بسته کوبرنتیز را دانلود کنید.
کلید امضای یکسانی برای همه مخازن استفاده می‌شود، بنابراین می‌توانید نسخه موجود در URL را نادیده بگیرید:

   ```shell
   # اگر پوشه(folder) `/etc/apt/keyrings` وجود ندارد، باید قبل از دستور curl ایجاد شود، نکته زیر را بخوانید.
   # sudo mkdir -p -m 755 /etc/apt/keyrings
   curl -fsSL https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
   ```

{{< note >}}
در نسخه‌های قدیمی‌تر از دبیان ۱۲ و اوبونتو ۲۲.۰۴، پوشه `/etc/apt/keyrings` به طور پیش‌فرض وجود ندارد و باید قبل از دستور curl ایجاد شود.
{{< /note >}}

3. مخزن کوبرنتیز `apt` مناسب را اضافه کنید. لطفاً توجه داشته باشید که این مخزن فقط بسته‌هایی برای کوبرنتیز {{< skew currentVersion >}} دارد؛ برای سایر نسخه‌های فرعی کوبرنتیز، باید نسخه فرعی کوبرنتیز را در URL تغییر دهید تا با نسخه فرعی مورد نظر شما مطابقت داشته باشد. (همچنین باید بررسی کنید که مستندات مربوط به نسخه کوبرنتیز که قصد نصب آن را دارید، مطالعه می‌کنید.)

   ```shell
   # This overwrites any existing configuration in /etc/apt/sources.list.d/kubernetes.list
   echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list
   ```

4. فهرست بسته‌های `apt` را به‌روزرسانی کنید، kubelet، kubeadm و kubectl را نصب کنید و نسخه آنها را پین کنید:

   ```shell
   sudo apt-get update
   sudo apt-get install -y kubelet kubeadm kubectl
   sudo apt-mark hold kubelet kubeadm kubectl
   ```

5. (اختیاری) سرویس kubelet را قبل از اجرای kubeadm فعال کنید:

   ```shell
   sudo systemctl enable --now kubelet
   ```

{{% /tab %}}
{{% tab name="Red Hat-based distributions" %}}

1. SELinux را روی حالت «مجاز» تنظیم کنید:

   این دستورالعمل‌ها برای کوبرنتیز {{< skew currentVersion >}} هستند.

   ```shell
   # Set SELinux in permissive mode (effectively disabling it)
   sudo setenforce 0
   sudo sed -i 's/^SELINUX=enforcing$/SELINUX=permissive/' /etc/selinux/config
   ```

{{< caution >}}
- تنظیم SELinux در حالت مجاز با اجرای `setenforce 0` و `sed ...`
عملاً آن را غیرفعال می‌کند. این کار برای دسترسی کانتینرها به فایل سیستم میزبان لازم است؛ برای مثال، برخی از افزونه‌های شبکه خوشه‌ای به آن نیاز دارند. شما باید این کار را تا زمانی که پشتیبانی SELinux در kubelet بهبود یابد، انجام دهید.
- اگر نحوه پیکربندی SELinux را می‌دانید، می‌توانید آن را فعال نگه دارید، اما ممکن است به تنظیماتی نیاز داشته باشد که توسط kubeadm پشتیبانی نمی‌شوند.
{{< /caution >}}

2. مخزن کوبرنتیز `yum` را اضافه کنید. پارامتر `exclude` در تعریف مخزن تضمین می‌کند که بسته‌های مربوط به کوبرنتیز با اجرای `yum update` ارتقا پیدا نکنند، زیرا برای ارتقاء کوبرنتیز باید رویه خاصی دنبال شود. لطفاً توجه داشته باشید که این مخزن فقط بسته‌هایی برای کوبرنتیز دارد {{< skew currentVersion >}}؛ برای سایر نسخه‌های فرعی کوبرنتیز، باید نسخه فرعی کوبرنتیز را در URL تغییر دهید تا با نسخه فرعی مورد نظر شما مطابقت داشته باشد (همچنین باید بررسی کنید که مستندات مربوط به نسخه کوبرنتیز که قصد نصب آن را دارید، مطالعه می‌کنید).

   ```shell
   # This overwrites any existing configuration in /etc/yum.repos.d/kubernetes.repo
   cat <<EOF | sudo tee /etc/yum.repos.d/kubernetes.repo
   [kubernetes]
   name=Kubernetes
   baseurl=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/
   enabled=1
   gpgcheck=1
   gpgkey=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/repodata/repomd.xml.key
   exclude=kubelet kubeadm kubectl cri-tools kubernetes-cni
   EOF
   ```

3. kubelet، kubeadm و kubectl را نصب کنید:

   ```shell
   sudo yum install -y kubelet kubeadm kubectl --disableexcludes=kubernetes
   ```

4. (اختیاری) سرویس kubelet را قبل از اجرای kubeadm فعال کنید:

   ```shell
   sudo systemctl enable --now kubelet
   ```

{{% /tab %}}
{{% tab name="Without a package manager" %}}
افزونه‌های CNI را نصب کنید (برای اکثر شبکه‌های پاد مورد نیاز است):

```bash
CNI_PLUGINS_VERSION="v1.3.0"
ARCH="amd64"
DEST="/opt/cni/bin"
sudo mkdir -p "$DEST"
curl -L "https://github.com/containernetworking/plugins/releases/download/${CNI_PLUGINS_VERSION}/cni-plugins-linux-${ARCH}-${CNI_PLUGINS_VERSION}.tgz" | sudo tar -C "$DEST" -xz
```

پوشه را برای دانلود پرونده‌‌های دستور(command) ایجاد کنید:

{{< note >}}
متغیر `DOWNLOAD_DIR` باید روی یک پوشه قابل نوشتن تنظیم شود.

اگر از Flatcar کانتینر لینوکس استفاده می‌کنید، `DOWNLOAD_DIR="/opt/bin"` را تنظیم کنید.
{{< /note >}}

```bash
DOWNLOAD_DIR="/usr/local/bin"
sudo mkdir -p "$DOWNLOAD_DIR"
```

در صورت تمایل، crictl را نصب کنید (برای تعامل با رابط مجری کانتینر (CRI) مورد نیاز است، و برای kubeadm اختیاری است):

```bash
CRICTL_VERSION="v1.31.0"
ARCH="amd64"
curl -L "https://github.com/kubernetes-sigs/cri-tools/releases/download/${CRICTL_VERSION}/crictl-${CRICTL_VERSION}-linux-${ARCH}.tar.gz" | sudo tar -C $DOWNLOAD_DIR -xz
```

`kubeadm`، `kubelet` را نصب کنید و یک سرویس systemd `kubelet` اضافه کنید:

```bash
RELEASE="$(curl -sSL https://dl.k8s.io/release/stable.txt)"
ARCH="amd64"
cd $DOWNLOAD_DIR
sudo curl -L --remote-name-all https://dl.k8s.io/release/${RELEASE}/bin/linux/${ARCH}/{kubeadm,kubelet}
sudo chmod +x {kubeadm,kubelet}

RELEASE_VERSION="v0.16.2"
curl -sSL "https://raw.githubusercontent.com/kubernetes/release/${RELEASE_VERSION}/cmd/krel/templates/latest/kubelet/kubelet.service" | sed "s:/usr/bin:${DOWNLOAD_DIR}:g" | sudo tee /usr/lib/systemd/system/kubelet.service
sudo mkdir -p /usr/lib/systemd/system/kubelet.service.d
curl -sSL "https://raw.githubusercontent.com/kubernetes/release/${RELEASE_VERSION}/cmd/krel/templates/latest/kubeadm/10-kubeadm.conf" | sed "s:/usr/bin:${DOWNLOAD_DIR}:g" | sudo tee /usr/lib/systemd/system/kubelet.service.d/10-kubeadm.conf
```

{{< note >}}
لطفاً برای توزیع‌های لینوکس که به طور پیش‌فرض شامل `glibc` نیستند، به یادداشت موجود در بخش [پیش نیازها](#before-you-begin) مراجعه کنید.
{{< /note >}}

با دنبال کردن دستورالعمل‌های موجود در [صفحه نصب ابزارها](/docs/tasks/tools/#kubectl)، `kubectl` را نصب کنید.

در صورت تمایل، قبل از اجرای kubeadm، سرویس kubelet را فعال کنید:

```bash
sudo systemctl enable --now kubelet
```

{{< note >}}
توزیع لینوکس Flatcar Container پوشه `/usr` را به عنوان یک پرونده سیستم فقط خواندنی mount می‌کند.
قبل از راه اندازی خوشه خود، باید مراحل بیشتری را برای پیکربندی یک پوشه قابل نوشتن انجام دهید.
برای یادگیری نحوه راه‌اندازی یک پوشه قابل نوشتن، به [راهنمای عیب‌یابی Kubeadm](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/#usr-mounted-read-only) مراجعه کنید.
{{< /note >}}
{{% /tab %}}
{{< /tabs >}}

Kubelet حالا هر چند ثانیه یک بار ری‌استارت می‌شود، چون در یک حلقه‌ی توقف منتظر می‌ماند تا kubeadm به آن بگوید چه کاری انجام دهد.

## پیکربندی درایور cgroup

پیکربندی درایور cgroup هم مجری کانتینر و هم kubelet دارای یک ویژگی به نام ["cgroup driver"](/docs/setup/production-environment/container-runtimes/#cgroup-drivers) هستند که برای مدیریت cgroupها در دستگاه‌های لینوکس مهم است.

{{< warning >}}
تطبیق مجری کانتینر و درایورهای cgroup kubelet مورد نیاز است یا در غیر این صورت فرآیند kubelet با شکست مواجه خواهد شد.

برای جزئیات بیشتر به [پیکربندی درایور cgroup](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/) مراجعه کنید.
{{< /warning >}}

## عیب‌یابی

اگر با kubeadm به مشکل برخوردید، لطفاً به [مستندات عیب‌یابی](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/) ما مراجعه کنید.

## {{% heading "whatsnext" %}}

* [استفاده از kubeadm برای ایجاد یک خوشه](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)
