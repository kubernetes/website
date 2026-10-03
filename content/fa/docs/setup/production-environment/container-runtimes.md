---
#reviewers:
#- vincepri
#- bart0sh
title: محیط‌های اجرای کانتینر
content_type: concept
weight: 20
---
<!-- overview -->

{{% dockershim-removal %}}

باید روی هر گره (Node) کلاستر یک
{{< glossary_tooltip text="محیط اجرای کانتینر" term_id="container-runtime" >}}
نصب کنید تا پادها بتوانند آنجا اجرا شوند. این صفحه شرح می‌دهد
چه کارهایی لازم است و وظایف مرتبط با راه‌اندازی گره‌ها را توضیح می‌دهد.

کوبرنتیز {{< skew currentVersion >}} ایجاب می‌کند از محیطی استفاده کنید که با
{{< glossary_tooltip term_id="cri" text="رابط محیط اجرای کانتینر">}} (CRI) سازگار باشد.

برای اطلاعات بیشتر، [پشتیبانی از نسخه CRI](#cri-versions) را ببینید.

این صفحه طرحی از نحوه استفاده از چند محیط اجرای کانتینر رایج همراه با
کوبرنتیز ارائه می‌دهد.

- [containerd](#containerd)
- [CRI-O](#cri-o)
- [Docker Engine](#docker)
- [Mirantis Container Runtime](#mcr)

{{< note >}}
نسخه‌های کوبرنتیز پیش از v1.24 یکپارچگی مستقیمی با Docker Engine داشتند
که از مؤلفه‌ای به نام _dockershim_ استفاده می‌کرد. آن یکپارچگی مستقیم ویژه دیگر
بخشی از کوبرنتیز نیست (این حذف
[اعلام شد](/blog/2020/12/08/kubernetes-1-20-release-announcement/#dockershim-deprecation)
و بخشی از انتشار v1.20 بود).
می‌توانید
[بررسی کنید آیا حذف Dockershim بر شما اثر می‌گذارد](/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-removal-affects-you/)
را بخوانید تا بفهمید این حذف چگونه ممکن است بر شما اثر بگذارد. برای آشنایی با مهاجرت از dockershim،
[مهاجرت از dockershim](/docs/tasks/administer-cluster/migrating-from-dockershim/) را ببینید.

اگر نسخه‌ای از کوبرنتیز غیر از v{{< skew currentVersion >}} را اجرا می‌کنید،
مستندات همان نسخه را بررسی کنید.
{{< /note >}}

<!-- body -->
## نصب و پیکربندی پیش‌نیازها

### پیکربندی شبکه

به‌طور پیش‌فرض، هسته لینوکس اجازه نمی‌دهد بسته‌های IPv4
بین رابط‌ها مسیریابی شوند. بیشتر پیاده‌سازی‌های شبکه کلاستر کوبرنتیز
این تنظیم را (در صورت نیاز) تغییر می‌دهند، اما برخی انتظار دارند
مدیر این کار را برای آن‌ها انجام دهد. (برخی همچنین انتظار دارند پارامترهای sysctl دیگری
تنظیم شود، ماژول‌های هسته بارگذاری شود و مانند آن؛ مستندات
پیاده‌سازی شبکه خودتان را ببینید.)

### فعال‌سازی هدایت بسته IPv4 {#prerequisite-ipv4-forwarding-optional}

برای فعال کردن دستی هدایت بسته IPv4:

```bash
# پارامترهای sysctl مورد نیاز راه‌اندازی؛ این پارامترها پس از راه‌اندازی مجدد باقی می‌مانند
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.ipv4.ip_forward = 1
EOF

# اعمال پارامترهای sysctl بدون راه‌اندازی مجدد
sudo sysctl --system
```

بررسی کنید که `net.ipv4.ip_forward` روی 1 تنظیم شده باشد:

```bash
sysctl net.ipv4.ip_forward
```

## درایورهای cgroup

در لینوکس، از {{< glossary_tooltip text="گروه‌های کنترل" term_id="cgroup" >}}
برای محدود کردن منابعی که به فرایندها تخصیص می‌یابد استفاده می‌شود.

هم {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} و هم
محیط اجرای کانتینر زیرین باید با گروه‌های کنترل ارتباط برقرار کنند تا
[مدیریت منابع پادها و کانتینرها](/docs/concepts/configuration/manage-resources-containers/)
را اعمال کنند و منابعی مانند درخواست‌ها و محدودیت‌های cpu/حافظه را تنظیم کنند. برای ارتباط با گروه‌های
کنترل، kubelet و محیط اجرای کانتینر باید از یک *درایور cgroup* استفاده کنند.
بسیار مهم است که kubelet و محیط اجرای کانتینر از یک درایور cgroup
یکسان استفاده کنند و به یک شکل پیکربندی شده باشند.

دو درایور cgroup در دسترس است:

* [`cgroupfs`](#cgroupfs-cgroup-driver)
* [`systemd`](#systemd-cgroup-driver)

### درایور cgroupfs {#cgroupfs-cgroup-driver}

درایور `cgroupfs` [درایور cgroup پیش‌فرض در kubelet](/docs/reference/config-api/kubelet-config.v1beta1) است.
وقتی از درایور `cgroupfs` استفاده می‌شود، kubelet و محیط اجرای کانتینر مستقیماً با
سیستم‌فایل cgroup ارتباط برقرار می‌کنند تا cgroupها را پیکربندی کنند.

وقتی [systemd](https://www.freedesktop.org/wiki/Software/systemd/) سیستم
init باشد، درایور `cgroupfs` **توصیه نمی‌شود**، چون systemd انتظار دارد یک مدیر cgroup واحد روی
سامانه باشد. علاوه بر این، اگر از [cgroup v2](/docs/concepts/architecture/cgroups) استفاده می‌کنید، به‌جای `cgroupfs` از درایور cgroup
`systemd` استفاده کنید.

### درایور cgroup از نوع systemd {#systemd-cgroup-driver}

وقتی [systemd](https://www.freedesktop.org/wiki/Software/systemd/) به‌عنوان سیستم init
یک توزیع لینوکس انتخاب می‌شود، فرایند init یک گروه کنترل ریشه
(`cgroup`) می‌سازد و مصرف می‌کند و نقش مدیر cgroup را دارد.

systemd یکپارچگی تنگاتنگی با cgroupها دارد و برای هر واحد systemd
یک cgroup تخصیص می‌دهد. در نتیجه، اگر `systemd` را به‌عنوان سیستم init همراه با درایور
`cgroupfs` به کار ببرید، سامانه دو مدیر cgroup متفاوت خواهد داشت.

دو مدیر cgroup دو دیدگاه متفاوت از منابع موجود و در حال استفاده
سامانه ایجاد می‌کنند. در برخی موارد، گره‌هایی که برای kubelet و محیط اجرای کانتینر روی `cgroupfs` پیکربندی شده‌اند
اما بقیه فرایندها را با `systemd` اجرا می‌کنند،
زیر فشار منابع ناپایدار می‌شوند.

راه کاهش این ناپایداری آن است که وقتی systemd سیستم init انتخاب‌شده است،
`systemd` را به‌عنوان درایور cgroup برای kubelet و محیط اجرای کانتینر به کار ببرید.

برای تنظیم `systemd` به‌عنوان درایور cgroup، گزینه
[`KubeletConfiguration`](/docs/tasks/administer-cluster/kubelet-config-file/)
به نام `cgroupDriver` را ویرایش کنید و آن را روی `systemd` بگذارید. برای مثال:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
...
cgroupDriver: systemd
```

اگر `systemd` را به‌عنوان درایور cgroup برای kubelet پیکربندی کنید، باید
`systemd` را به‌عنوان درایور cgroup محیط اجرای کانتینر هم پیکربندی کنید. برای دستورالعمل، به
مستندات محیط اجرای کانتینر خودتان مراجعه کنید. برای مثال:

*  [containerd](#containerd-systemd)
*  [CRI-O](#cri-o)

در کوبرنتیز {{< skew currentVersion >}}، وقتی [دروازه قابلیت](/docs/reference/command-line-tools-reference/feature-gates/)
`KubeletCgroupDriverFromCRI`
فعال باشد و محیط اجرای کانتینر از RPC مربوط به `RuntimeConfig` در CRI پشتیبانی کند،
kubelet درایور cgroup مناسب را به‌طور خودکار از محیط اجرا تشخیص می‌دهد
و تنظیم `cgroupDriver` درون پیکربندی kubelet را نادیده می‌گیرد.

با این حال، نسخه‌های قدیمی‌تر محیط‌های اجرای کانتینر (به‌طور مشخص
containerd نسخه 1.y و پایین‌تر) از RPC مربوط به `RuntimeConfig` در CRI پشتیبانی نمی‌کنند و
ممکن است به این پرس‌وجو پاسخ درست ندهند؛ در این صورت Kubelet به مقدار
پرچم `--cgroup-driver` خودش برمی‌گردد.

در کوبرنتیز ۱.۳۸ این رفتار بازگشت حذف می‌شود و نسخه‌های قدیمی‌تر
containerd با kubeletهای جدیدتر با شکست مواجه می‌شوند.

{{< caution >}}
تغییر درایور cgroup گره‌ای که به یک کلاستر پیوسته است عملیاتی حساس است.
اگر kubelet پادها را با معنای یک درایور cgroup ساخته باشد، تغییر محیط اجرای
کانتینر به درایور cgroup دیگر می‌تواند هنگام تلاش برای ساخت دوباره sandbox پاد
برای آن پادهای موجود خطا ایجاد کند. راه‌اندازی مجدد kubelet ممکن است این خطاها را برطرف نکند.

اگر خودکارسازی‌ای دارید که این کار را ممکن می‌کند، گره را با گره‌ای دیگر که پیکربندی به‌روز دارد جایگزین کنید،
یا آن را با خودکارسازی دوباره نصب کنید.
{{< /caution >}}

## پشتیبانی از نسخه CRI {#cri-versions}

محیط اجرای کانتینر شما باید از نسخه v1 رابط محیط اجرای کانتینر پشتیبانی کند.

کوبرنتیز [از v1.26 به بعد](/blog/2022/11/18/upcoming-changes-in-kubernetes-1-26/#cri-api-removal)
_فقط_ با نسخه v1 از API مربوط به CRI کار می‌کند. اگر یک محیط اجرای کانتینر از API نسخه v1 پشتیبانی نکند،
kubelet به‌عنوان گره ثبت نمی‌شود.

## محیط‌های اجرای کانتینر

{{% thirdparty-content %}}

### containerd

این بخش گام‌های لازم برای استفاده از containerd به‌عنوان محیط اجرای CRI را شرح می‌دهد.

برای نصب containerd روی سامانه خود، دستورالعمل‌های
[شروع کار با containerd](https://github.com/containerd/containerd/blob/main/docs/getting-started.md) را دنبال کنید.
پس از آنکه یک فایل پیکربندی معتبر `config.toml` ساختید، به این گام برگردید.

{{< tabs name="Finding your config.toml file" >}}
{{% tab name="Linux" %}}
این فایل را می‌توانید در مسیر `/etc/containerd/config.toml` پیدا کنید.
{{% /tab %}}
{{% tab name="Windows" %}}
این فایل را می‌توانید در مسیر `C:\Program Files\containerd\config.toml` پیدا کنید.
{{% /tab %}}
{{< /tabs >}}

در لینوکس، سوکت پیش‌فرض CRI برای containerd برابر است با `/run/containerd/containerd.sock`.
در ویندوز، نقطه پایانی پیش‌فرض CRI برابر است با `npipe://./pipe/containerd-containerd`.

#### پیکربندی درایور cgroup از نوع `systemd` {#containerd-systemd}

برای استفاده از درایور cgroup از نوع `systemd` در `/etc/containerd/config.toml` همراه با `runc`،
پیکربندی زیر را بر اساس نسخه Containerd خود تنظیم کنید.

نسخه‌های 1.x از Containerd:

```
[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc]
  ...
  [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
    SystemdCgroup = true
```

نسخه‌های 2.x از Containerd:

```
[plugins.'io.containerd.cri.v1.runtime'.containerd.runtimes.runc]
  ...
  [plugins.'io.containerd.cri.v1.runtime'.containerd.runtimes.runc.options]
    SystemdCgroup = true
```

اگر از [cgroup v2](/docs/concepts/architecture/cgroups) استفاده می‌کنید، درایور cgroup از نوع `systemd` توصیه می‌شود.

{{< note >}}
اگر containerd را از یک بسته نصب کرده‌اید (برای مثال RPM یا `.deb`)، ممکن است ببینید
افزونه یکپارچه‌سازی CRI به‌طور پیش‌فرض غیرفعال است.

برای استفاده از containerd همراه با کوبرنتیز باید پشتیبانی CRI فعال باشد. مطمئن شوید `cri`
در فهرست `disabled_plugins` درون `/etc/containerd/config.toml` نیست؛
اگر آن فایل را تغییر دادید، `containerd` را هم دوباره راه‌اندازی کنید.

اگر پس از نصب اولیه کلاستر یا پس از
نصب یک CNI با حلقه خرابی کانتینر مواجه شدید، پیکربندی containerd همراه بسته ممکن است
پارامترهای پیکربندی ناسازگار داشته باشد. بازنشانی پیکربندی containerd را با
`containerd config default > /etc/containerd/config.toml` در نظر بگیرید، همان‌طور که در
[getting-started.md](https://github.com/containerd/containerd/blob/main/docs/getting-started.md#advanced-topics)
آمده است، و سپس پارامترهای پیکربندی ذکرشده در بالا را متناسب تنظیم کنید.
{{< /note >}}

اگر این تغییر را اعمال می‌کنید، حتماً containerd را دوباره راه‌اندازی کنید:

```shell
sudo systemctl restart containerd
```

در کوبرنتیز v1.28 می‌توانید تشخیص خودکار درایور
cgroup را به‌عنوان یک قابلیت آلفا فعال کنید. برای جزئیات بیشتر، [درایور cgroup از نوع systemd](#systemd-cgroup-driver)
را ببینید.

#### جایگزینی ایمیج sandbox (pause) {#override-pause-image-containerd}

در [پیکربندی containerd](https://github.com/containerd/containerd/blob/main/docs/cri/config.md) می‌توانید ایمیج
sandbox را با تنظیم پیکربندی زیر بازنویسی کنید:

```toml
[plugins."io.containerd.grpc.v1.cri"]
  sandbox_image = "registry.k8s.io/pause:3.10"
```

پس از به‌روزرسانی فایل پیکربندی، ممکن است لازم باشد `containerd` را هم دوباره راه‌اندازی کنید: `systemctl restart containerd`.

### CRI-O

این بخش گام‌های لازم برای نصب CRI-O به‌عنوان محیط اجرای کانتینر را در بر دارد.

برای نصب CRI-O، [دستورالعمل نصب CRI-O](https://github.com/cri-o/packaging/blob/main/README.md#usage) را دنبال کنید.

#### درایور cgroup

CRI-O به‌طور پیش‌فرض از درایور cgroup از نوع systemd استفاده می‌کند، که احتمالاً برای شما درست کار می‌کند.
برای جابه‌جایی به درایور cgroup از نوع `cgroupfs`، یا
`/etc/crio/crio.conf` را ویرایش کنید یا یک پیکربندی drop-in در
`/etc/crio/crio.conf.d/02-cgroup-manager.conf` بگذارید، برای مثال:

```toml
[crio.runtime]
conmon_cgroup = "pod"
cgroup_manager = "cgroupfs"
```

باید به `conmon_cgroup` تغییر یافته هم توجه کنید؛ هنگام استفاده از CRI-O با `cgroupfs` باید روی مقدار
`pod` تنظیم شود. به‌طور کلی لازم است پیکربندی درایور
cgroup در kubelet (که معمولاً از راه kubeadm انجام می‌شود) و CRI-O
هم‌گام بماند.

در کوبرنتیز v1.28 می‌توانید تشخیص خودکار درایور
cgroup را به‌عنوان یک قابلیت آلفا فعال کنید. برای جزئیات بیشتر، [درایور cgroup از نوع systemd](#systemd-cgroup-driver)
را ببینید.

برای CRI-O، سوکت CRI به‌طور پیش‌فرض `/var/run/crio/crio.sock` است.

#### جایگزینی ایمیج sandbox (pause) {#override-pause-image-cri-o}

در [پیکربندی CRI-O](https://github.com/cri-o/cri-o/blob/main/docs/crio.conf.5.md) می‌توانید مقدار پیکربندی زیر را تنظیم کنید:

```toml
[crio.image]
pause_image="registry.k8s.io/pause:3.10"
```

این گزینه پیکربندی از بارگذاری زنده پیکربندی برای اعمال تغییر پشتیبانی می‌کند: `systemctl reload crio`، یا با فرستادن
`SIGHUP` به فرایند `crio`.

### Docker Engine {#docker}

{{< note >}}
این دستورالعمل‌ها فرض می‌کنند برای یکپارچه کردن
Docker Engine با کوبرنتیز از آداپتور
[`cri-dockerd`](https://mirantis.github.io/cri-dockerd/) استفاده می‌کنید.
{{< /note >}}

1. روی هر یک از گره‌ها، Docker را برای توزیع لینوکس خود مطابق
  [نصب Docker Engine](https://docs.docker.com/engine/install/#server) نصب کنید.

2. [`cri-dockerd`](https://mirantis.github.io/cri-dockerd/usage/install) را نصب کنید و جهت‌های بخش نصب مستندات را دنبال کنید.

برای `cri-dockerd`، سوکت CRI به‌طور پیش‌فرض `/run/cri-dockerd.sock` است.

### Mirantis Container Runtime {#mcr}

[Mirantis Container Runtime](https://docs.mirantis.com/mcr/25.0/overview.html) (MCR) یک محیط اجرای کانتینر
تجاری است که پیش‌تر با نام Docker Enterprise Edition شناخته می‌شد.

می‌توانید Mirantis Container Runtime را با کوبرنتیز و با استفاده از مؤلفه متن‌باز
[`cri-dockerd`](https://mirantis.github.io/cri-dockerd/) که همراه MCR است به کار ببرید.

برای آشنایی بیشتر با نحوه نصب Mirantis Container Runtime،
به [راهنمای استقرار MCR](https://docs.mirantis.com/mcr/25.0/install.html) مراجعه کنید.

برای یافتن مسیر سوکت CRI، واحد systemd به نام `cri-docker.socket` را بررسی کنید.

#### جایگزینی ایمیج sandbox (pause) {#override-pause-image-cri-dockerd-mcr}

آداپتور `cri-dockerd` یک آرگومان خط فرمان می‌پذیرد تا
مشخص کند کدام ایمیج کانتینر به‌عنوان کانتینر زیرساخت پاد («ایمیج pause») استفاده شود.
آرگومان خط فرمان مورد استفاده `--pod-infra-container-image` است.

## {{% heading "whatsnext" %}}

علاوه بر یک محیط اجرای کانتینر، کلاستر شما به یک
[افزونه شبکه](/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-network-model) در حال کار نیاز دارد.
