---
reviewers:
- xirehat
title: برنامه‌های زمان‌اجرای کانتینر
content_type: concept
weight: 20
---
<!-- overview -->

{{% dockershim-removal %}}

شما باید یک
{{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}
روی هر گره در خوشه نصب کنید تا پادها بتوانند در آن اجرا شوند. این صفحه توضیح می‌دهد چه مواردی درگیر هستند و وظایف مرتبط برای راه‌اندازی گره‌ها را توصیف می‌کند.

کوبرنتیز {{< skew currentVersion >}} نیاز دارد که از یک Runtime استفاده کنید که با
{{< glossary_tooltip term_id="cri" text="Container Runtime Interface">}} (CRI) سازگار باشد.

برای اطلاعات بیشتر به [پشتیبانی نسخه‌های CRI](#cri-versions) مراجعه کنید.

این صفحه نمای کلی از نحوه استفاده از چند Runtime رایج کانتینر با کوبرنتیز را ارائه می‌کند.

- [containerd](#containerd)
- [CRI-O](#cri-o)
- [Docker Engine](#docker)
- [Mirantis Container Runtime](#mcr)


{{< note >}}
نسخه‌های کوبرنتیز پیش از v1.24 یک ادغام مستقیم با Docker Engine داشتند که توسط
مولفه‌ای به نام _dockershim_ فراهم می‌شد. این ادغام مستقیم ویژه دیگر بخشی از
کوبرنتیز نیست (این حذف به‌عنوان بخشی از انتشار v1.20
[اعلام شد](/blog/2020/12/08/kubernetes-1-20-release-announcement/#dockershim-deprecation)).
برای درک این‌که این تغییر چه تأثیری بر شما می‌گذارد، بخش
[بررسی کنید که آیا حذف Dockershim بر شما تأثیر می‌گذارد](/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-removal-affects-you/)
را مطالعه کنید. برای آشنایی با نحوه مهاجرت از dockershim نیز به
[مهاجرت از dockershim](/docs/tasks/administer-cluster/migrating-from-dockershim/)
مراجعه کنید.

اگر نسخه‌ای از کوبرنتیز غیر از v{{< skew currentVersion >}} را اجرا می‌کنید،
مستندات همان نسخه را بررسی کنید.
{{< /note >}}

<!-- body -->
## نصب و پیکربندی پیش‌نیازها

### پیکربندی شبکه

به‌طور پیش‌فرض، هسته لینوکس اجازه نمی‌دهد بسته‌های IPv4 بین رابط‌ها مسیریابی شوند. اکثر پیاده‌سازی‌های شبکه خوشه کوبرنتیز این تنظیم را (در صورت نیاز) تغییر می‌دهند، اما بعضی ممکن است انتظار داشته باشند که مدیر سیستم خودش این کار را انجام دهد. (همچنین ممکن است انتظار داشته باشند پارامترهای sysctl دیگری تنظیم شود، ماژول‌های هسته بارگذاری شوند و غیره؛ مستندات پیاده‌سازی شبکه خاص خود را بررسی کنید.)

### فعال کردن ارسال بسته IPv4 {#prerequisite-ipv4-forwarding-optional}

برای فعال کردن دستی ارسال بسته IPv4:

```bash
# sysctl params required by setup, params persist across reboots
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.ipv4.ip_forward = 1
EOF

# Apply sysctl params without reboot
sudo sysctl --system
```

Verify that `net.ipv4.ip_forward` is set to 1 with:

```bash
sysctl net.ipv4.ip_forward
```

## درایورهای cgroup

در لینوکس، {{< glossary_tooltip text="control groups" term_id="cgroup" >}} برای محدود کردن منابع اختصاص‌یافته به فرایندها به کار می‌روند.

هم {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} و هم موتور کانتینر زیرساخت باید برای اعمال
[مدیریت منابع پادها و کانتینرها](/docs/concepts/configuration/manage-resources-containers/)
و تنظیم منابعی مانند درخواست‌ها و محدودیت‌های CPU/حافظه با control groupها تعامل داشته باشند. برای این تعامل، kubelet و موتور کانتینر باید از یک *درایور cgroup* استفاده کنند.
مهم است که kubelet و موتور کانتینر از **همان** درایور cgroup استفاده کرده و به‌گونه‌ای یکسان پیکربندی شوند.

دو درایور cgroup در دسترس هستند:

* [`cgroupfs`](#cgroupfs-cgroup-driver)
* [`systemd`](#systemd-cgroup-driver)

### درایور cgroupfs {#cgroupfs-cgroup-driver}

درایور `cgroupfs` [درایور پیش‌فرض cgroup در kubelet](/docs/reference/config-api/kubelet-config.v1beta1) است.  
زمانی که از درایور `cgroupfs` استفاده می‌شود، kubelet و موتور کانتینر به‌طور مستقیم با
فایل‌سیستم cgroup برای پیکربندی cgroupها تعامل می‌کنند.

درایور `cgroupfs` هنگامی که
[systemd](https://www.freedesktop.org/wiki/Software/systemd/) به‌عنوان سامانه init استفاده می‌شود **توصیه نمی‌شود**،
چرا که systemd انتظار دارد در سیستم تنها یک مدیر cgroup وجود داشته باشد. افزون بر این،
اگر از [cgroup v2](/docs/concepts/architecture/cgroups) استفاده می‌کنید، به‌جای `cgroupfs`
از درایور `systemd` بهره بگیرید.

### درایور systemd cgroup {#systemd-cgroup-driver}

هنگامی که [systemd](https://www.freedesktop.org/wiki/Software/systemd/) به‌عنوان سامانه init در یک توزیع لینوکس انتخاب می‌شود، فرایند init یک گروه کنترل ریشه (`cgroup`) ایجاد کرده و از آن استفاده می‌کند و در نقش مدیر cgroup عمل می‌کند.

systemd با cgroupها یکپارچگی تنگاتنگی دارد و برای هر واحد systemd یک cgroup اختصاص می‌دهد. بنابراین، اگر systemd سامانه init باشد ولی از درایور `cgroupfs` استفاده کنید، سیستم دو مدیر cgroup متفاوت خواهد داشت.

وجود دو مدیر cgroup باعث می‌شود دو نما از منابعِ در دسترس و در حال استفاده سیستم شکل گیرد. در برخی موارد، نودهایی که kubelet و موتور کانتینر آن‌ها از `cgroupfs` استفاده می‌کند اما سایر فرایندها زیر نظر systemd اجرا می‌شوند، زیر فشار منابع دچار ناپایداری می‌گردند.

راهکار کاهش این ناپایداری آن است که وقتی systemd به‌عنوان init استفاده می‌شود، برای kubelet و موتور کانتینر نیز درایور cgroup را `systemd` قرار دهید.

برای تنظیم `systemd` به‌عنوان درایور cgroup، گزینه `cgroupDriver` را در
[`KubeletConfiguration`](/docs/tasks/administer-cluster/kubelet-config-file/)
ویرایش کرده و مقدار آن را `systemd` بگذارید. برای مثال:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
...
cgroupDriver: systemd
```

{{< note >}}
از نسخه v1.22 به بعد، هنگام ایجاد یک خوشه با **kubeadm**، اگر کاربر فیلد `cgroupDriver` را در بخش `KubeletConfiguration` تنظیم نکند، **kubeadm** به‌صورت پیش‌فرض آن را روی `systemd` قرار می‌دهد.
{{< /note >}}

اگر `systemd` را به‌عنوان درایور cgroup برای **kubelet** پیکربندی می‌کنید، باید برای
موتور کانتینر نیز همین درایور را تنظیم کنید. برای دستورالعمل‌های لازم، به مستندات
موتور کانتینر خود رجوع کنید. برای مثال:

*  [containerd](#containerd-systemd)
*  [CRI-O](#cri-o)

در کوبرنتیز {{< skew currentVersion >}}، با فعال بودن
دروازه ویژگی `KubeletCgroupDriverFromCRI`
و وجود موتور کانتینری که فراخوان (RPC) ‏`RuntimeConfig` را در رابط CRI پشتیبانی کند،
**kubelet** درایور cgroup مناسب را به‌طور خودکار از موتور تشخیص می‌دهد
و تنظیم `cgroupDriver` در پیکربندی kubelet را نادیده می‌گیرد.

{{< caution >}}
تغییر درایور cgroup نودی که به یک خوشه پیوسته، عملی حساس است. اگر **kubelet**
پادهایی را با قواعد مربوط به یک درایور cgroup ایجاد کرده باشد، تغییر
موتور کانتینر به درایور دیگری می‌تواند هنگام بازایجاد *Pod Sandbox* برای آن
پادهای موجود خطا ایجاد کند. راه‌اندازی مجدد kubelet ممکن است این خطاها را رفع نکند.

اگر امکان اتوماسیون دارید، نود را با نودی تازه و پیکربندی به‌روز جایگزین کرده
یا با استفاده از ابزارهای خودکار مجدداً نصبش کنید.
{{< /caution >}}


### مهاجرت به درایور `systemd` در خوشه‌های مدیریت‌شده توسط kubeadm

اگر می‌خواهید در خوشه‌های موجودِ مدیریت‌شده با `kubeadm` به درایور cgroup `systemd` مهاجرت کنید، راهنمای [پیکربندی درایور cgroup](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/) را دنبال کنید.

## پشتیبانی از نسخه CRI {#cri-versions}

موتور کانتینر شما باید دست‌کم از نسخه **v1alpha2** رابط اجرای کانتینر (CRI) پشتیبانی کند.

کوبرنتیز از [نسخه v1.26 به بعد](/blog/2022/11/18/upcoming-changes-in-kubernetes-1-26/#cri-api-removal)
_تنها با_ نسخه **v1** رابط CRI کار می‌کند. نسخه‌های پیشین به‌طور پیش‌فرض از همین نسخه v1 استفاده می‌کنند؛
اما اگر موتور کانتینر از API نسخه v1 پشتیبانی نکند، **kubelet** به‌جای آن به نسخه قدیمی
(منسوخ‌شده) **v1alpha2** بازمی‌گردد.

## Container runtimes

{{% thirdparty-content %}}

### containerd

این بخش گام‌های لازم برای استفاده از **containerd** به‌عنوان محیط اجرای CRI را شرح می‌دهد.

برای نصب containerd روی سیستم خود، دستورالعمل‌های
[شروع به کار با containerd](https://github.com/containerd/containerd/blob/main/docs/getting-started.md)
را دنبال کنید. پس از آنکه یک پرونده پیکربندی معتبر `config.toml` ایجاد کردید، به این مرحله بازگردید.

{{< tabs name="Finding your config.toml file" >}}
{{% tab name="Linux" %}}
می‌توانید این پرونده را در مسیر `/etc/containerd/config.toml` پیدا کنید.
{{% /tab %}}
{{% tab name="Windows" %}}
می‌توانید این پرونده را در مسیر `C:\Program Files\containerd\config.toml` پیدا کنید.
{{% /tab %}}
{{< /tabs >}}

در لینوکس، سوکت پیش‌فرض CRI برای containerd مسیر `/run/containerd/containerd.sock` است.  
در ویندوز، نقطه پایانی پیش‌فرض CRI مقدار `npipe://./pipe/containerd-containerd` است.

#### پیکربندی درایور cgroup مربوط به systemd {#containerd-systemd}

برای استفاده از درایور cgroup `systemd` در فایل `/etc/containerd/config.toml` همراه با `runc`، مقدار زیر را تنظیم کنید

```
[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc]
  ...
  [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
    SystemdCgroup = true
```

درایور cgroup `systemd` در صورتی که از [cgroup v2](/docs/concepts/architecture/cgroups) استفاده می‌کنید توصیه می‌شود.

{{< note >}}
اگر containerd را از طریق بسته نصبی (مثلاً RPM یا `.deb`) نصب کرده باشید، ممکن است
افزونه یکپارچه‌سازی CRI به‌طور پیش‌فرض غیرفعال باشد.

برای استفاده از containerd با Kubernetes باید پشتیبانی CRI فعال باشد. مطمئن شوید که `cri`
در فهرست `disabled_plugins` در فایل `/etc/containerd/config.toml` درج نشده است؛
اگر در این فایل تغییری ایجاد کردید، حتماً `containerd` را نیز راه‌اندازی مجدد کنید.

اگر پس از نصب اولیه خوشه یا نصب یک CNI با حلقه کرش کانتینر مواجه شدید،
احتمالاً پیکربندی containerd ارائه‌شده در بسته شامل پارامترهای ناسازگار است.
در این صورت، پیکربندی containerd را با اجرای دستور
`containerd config default > /etc/containerd/config.toml`
طبق مستند
[getting-started.md](https://github.com/containerd/containerd/blob/main/docs/getting-started.md#advanced-topics)
بازنشانی کنید و سپس پارامترهای پیکربندی بالا را مطابق نیاز تنظیم نمایید.
{{< /note >}}

اگر این تغییر را اعمال کردید، حتماً containerd را بازراه‌اندازی کنید:

```shell
sudo systemctl restart containerd
```

هنگام استفاده از **kubeadm**، درایور cgroup برای **kubelet** را به‌صورت دستی پیکربندی کنید:
[cgroup driver for kubelet](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/#configuring-the-kubelet-cgroup-driver).

در کوبرنتیز نسخه v1.28، می‌توانید شناسایی خودکار درایور cgroup را به‌عنوان یک قابلیت آلفا فعال کنید. برای جزئیات بیش‌تر، بخش
[درایور cgroup systemd](#systemd-cgroup-driver) را ببینید.

#### نادیده گرفتن sandbox (pause) image {#override-pause-image-containerd}

در [پیکربندی containerd](https://github.com/containerd/containerd/blob/main/docs/cri/config.md) خود می‌توانید تصویر sandbox را با تنظیم زیر بازنویسی کنید:

```toml
[plugins."io.containerd.grpc.v1.cri"]
  sandbox_image = "registry.k8s.io/pause:3.10"
```

پس از به‌روزرسانی فایل پیکربندی، ممکن است نیاز باشد `containerd` را نیز بازراه‌اندازی کنید:  
`systemctl restart containerd`

### CRI-O

این بخش شامل گام‌های لازم برای نصب **CRI-O** به‌عنوان محیط اجرای کانتینر است.

برای نصب CRI-O، دستورالعمل‌های [نصب CRI-O](https://github.com/cri-o/packaging/blob/main/README.md#usage) را دنبال کنید.

#### درایور cgroup

CRI-O به‌طور پیش‌فرض از درایور cgroup ‌`systemd` استفاده می‌کند که احتمالاً برای شما به‌خوبی کار خواهد کرد.  
برای تغییر به درایور cgroup ‌`cgroupfs`، یا فایل `/etc/crio/crio.conf` را ویرایش کنید یا یک پیکربندی drop-in در مسیر `/etc/crio/crio.conf.d/02-cgroup-manager.conf` قرار دهید؛ برای مثال:

```toml
[crio.runtime]
conmon_cgroup = "pod"
cgroup_manager = "cgroupfs"
```

همچنین باید به گزینه تغییر‌یافته `conmon_cgroup` توجه کنید؛ هنگام استفاده از CRI-O همراه با `cgroupfs`، این گزینه باید روی مقدار `pod` تنظیم شود. به‌طور کلی، لازم است پیکربندی درایور cgroup در kubelet (که معمولاً با kubeadm انجام می‌شود) و در CRI-O با هم همگام باشند.

در کوبرنتیز نسخه v1.28، می‌توانید تشخیص خودکار درایور cgroup را به‌عنوان یک ویژگی آلفا فعال کنید. برای جزئیات بیش‌تر به [درایور cgroup systemd](#systemd-cgroup-driver) مراجعه کنید.

در CRI-O، سوکت CRI به‌صورت پیش‌فرض `/var/run/crio/crio.sock` است.

#### نادیده گرفتن sandbox (pause) image {#override-pause-image-cri-o}

در پیکربندی [CRI-O](https://github.com/cri-o/cri-o/blob/main/docs/crio.conf.5.md) خود می‌توانید مقدار پیکربندی زیر را تنظیم کنید:

```toml
[crio.image]
pause_image="registry.k8s.io/pause:3.10"
```

این گزینه پیکربندی از **بارگذاری زنده پیکربندی** برای اعمال تغییر پشتیبانی می‌کند؛ کافی است دستور
`systemctl reload crio` را اجرا کنید یا سیگنال `SIGHUP` را به فرایند `crio` بفرستید.

### Docker Engine {#docker}

{{< note >}}
این دستورالعمل‌ها فرض می‌کنند که شما از
[`cri-dockerd`](https://mirantis.github.io/cri-dockerd/) برای یکپارچه‌سازی Docker Engine
با Kubernetes استفاده می‌کنید.
{{< /note >}}

1. روی هر یک از نودها، Docker را برای توزیع لینوکسی خود طبق
   [راهنمای نصب Docker Engine](https://docs.docker.com/engine/install/#server) نصب کنید.

2. طبق بخش «نصب» در مستندات، [`cri-dockerd`](https://mirantis.github.io/cri-dockerd/usage/install) را نصب کنید.

به‌طور پیش‌فرض، سوکت CRI برای `cri-dockerd` مسیر `/run/cri-dockerd.sock` است.

### Mirantis Container Runtime {#mcr}

[Mirantis Container Runtime](https://docs.mirantis.com/mcr/20.10/overview.html) (MCR) یک محیط اجرای کانتینر تجاری است که پیش‌تر با نام Docker Enterprise Edition شناخته می‌شد.

می‌توانید Mirantis Container Runtime را با استفاده از مؤلفۀ متن‌باز
[`cri-dockerd`](https://mirantis.github.io/cri-dockerd/) ــ که همراه با MCR عرضه می‌شود ــ در Kubernetes به کار بگیرید.

برای آگاهی بیش‌تر از نحوه نصب Mirantis Container Runtime،
به راهنمای [MCR Deployment Guide](https://docs.mirantis.com/mcr/20.10/install.html) مراجعه کنید.

واحد systemd با نام `cri-docker.socket` را بررسی کنید تا مسیر سوکت CRI را بیابید.

#### نادیده گرفتن sandbox (pause) image {#override-pause-image-cri-dockerd-mcr}

آداپتور `cri-dockerd` یک آرگومان خط فرمان می‌پذیرد تا مشخص کند کدام تصویر کانتینر باید به‌عنوان کانتینر زیرساخت پاد («pause image») استفاده شود.  
آرگومان خط فرمان مورد نیاز `--pod-infra-container-image` است.

## {{% heading "whatsnext" %}}

علاوه بر یک محیط اجرای کانتینر، خوشۀ شما به یک
[افزونه شبکه](/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-network-model)
سالم و فعال نیز نیاز دارد.
