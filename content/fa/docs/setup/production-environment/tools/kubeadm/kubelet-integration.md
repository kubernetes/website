---
reviewers:
- sig-cluster-lifecycle
title: پیکربندی هر kubelet در خوشه(cluster) شما با استفاده از kubeadm
content_type: concept
weight: 80
---

<!-- overview -->

{{% dockershim-removal %}}

{{< feature-state for_k8s_version="v1.11" state="stable" >}}

چرخه حیات ابزار رابط خط فرمان kubeadm از [kubelet](/docs/reference/command-line-tools-reference/kubelet) که یک سرویس (daemon) است که روی هر گره(node) در خوشه(cluster) کوبرنتیز اجرا می‌شود، جدا شده است. ابزار رابط خط فرمان kubeadm هنگام راه‌اندازی یا ارتقاء کوبرنتیز توسط کاربر اجرا می‌شود، در حالی که kubelet همیشه در پس‌زمینه در حال اجرا است.

از آنجایی که kubelet یک سرویس (daemon) است، باید توسط نوعی سیستم init یا مدیر سرویس نگهداری شود. وقتی kubelet با استفاده از DEBها یا RPMها نصب می‌شود، systemd برای مدیریت kubelet پیکربندی می‌شود. می‌توانید به جای آن از یک مدیر سرویس متفاوت استفاده کنید، اما باید آن را به صورت دستی پیکربندی کنید.

برخی از جزئیات پیکربندی kubelet باید در تمام kubelet های موجود در خوشه(cluster) یکسان باشد، در حالی که سایر جنبه‌های پیکربندی باید بر اساس هر kubelet تنظیم شوند تا با ویژگی‌های مختلف یک ماشین خاص (مانند سیستم عامل، فضای ذخیره‌سازی و شبکه) سازگار شوند. شما می‌توانید پیکربندی kubelet های خود را به صورت دستی مدیریت کنید، اما kubeadm اکنون یک نوع API از نوع `KubeletConfiguration` را برای [مدیریت پیکربندی‌های kubelet خود به صورت مرکزی](#configure-kubelets-using-kubeadm) ارائه می‌دهد.

<!-- body -->

## الگوهای پیکربندی Kubelet

بخش‌های زیر الگوهایی را برای پیکربندی kubelet شرح می‌دهند که با استفاده از kubeadm ساده شده‌اند، نه اینکه پیکربندی kubelet را برای هر گره(node) به صورت دستی مدیریت کنند.

### انتشار پیکربندی سطح خوشه(cluster) به هر kubelet

شما می‌توانید مقادیر پیش‌فرض را برای استفاده توسط دستورات `kubeadm init` و `kubeadm join` به kubelet ارائه دهید. مثال‌های جالب شامل استفاده از یک مجری کانتینر متفاوت یا تنظیم زیرشبکه پیش‌فرض مورد استفاده توسط سرویس‌ها است.

اگر می‌خواهید سرویس‌های شما از زیرشبکه `10.96.0.0/12` به عنوان پیش‌فرض برای سرویس‌ها استفاده کنند، می‌توانید پارامتر `--service-cidr` را به kubeadm ارسال کنید:

```bash
kubeadm init --service-cidr 10.96.0.0/12
```

اکنون IPهای مجازی برای سرویس‌ها از این زیرشبکه اختصاص داده می‌شوند. همچنین باید نشانی(آدرس) DNS مورد استفاده توسط kubelet را با استفاده از پرچم `--cluster-dns` تنظیم کنید. این تنظیم باید برای هر kubelet روی هر مدیر و گره(node) در خوشه(cluster) یکسان باشد. kubelet یک شیء API نسخه‌بندی شده و ساختار یافته ارائه می‌دهد که می‌تواند اکثر پارامترها را در kubelet پیکربندی کند و این پیکربندی را به هر kubelet در حال اجرا در خوشه(cluster) ارسال کند. این شیء `[`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/) نامیده می‌شود. `KubeletConfiguration` به کاربر اجازه می‌دهد پرچم‌هایی مانند نشانی‌(آدرس)های IP DNS خوشه(cluster) را که به صورت لیستی از مقادیر با کلید camelCased بیان می‌شوند، مشخص کند، که با مثال زیر نشان داده شده است:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
clusterDNS:
- 10.96.0.10
```

برای جزئیات بیشتر در مورد `KubeletConfiguration`، به [این بخش](#تنظیم kubelet با استفاده از kubeadm) نگاهی بیندازید.

### ارائه جزئیات پیکربندی مختص به هر نمونه

برخی از میزبان‌ها به دلیل تفاوت در سخت‌افزار، سیستم عامل، شبکه یا سایر پارامترهای خاص میزبان، به پیکربندی‌های خاصی برای kubelet نیاز دارند. لیست زیر چند نمونه را ارائه می‌دهد.

- مسیر پرونده DNS resolution، همانطور که توسط پرچم پیکربندی `--resolv-conf` در kubelet مشخص شده است، ممکن است در بین سیستم عامل‌ها یا بسته به اینکه آیا از `systemd-resolved` استفاده می‌کنید یا خیر، متفاوت باشد. اگر این مسیر اشتباه باشد، DNS resolution در گره‌ای که kubelet آن به طور نادرست پیکربندی شده است، با شکست مواجه خواهد شد.

- شیء گره(node) API با نام `.metadata.name` به طور پیش‌فرض روی نام میزبان دستگاه تنظیم شده است، مگر اینکه از یک ارائه‌دهنده ابری استفاده کنید. در صورت نیاز به تعیین نام گره‌ای متفاوت از نام میزبان دستگاه، می‌توانید از پرچم `--hostname-override` برای لغو رفتار پیش‌فرض استفاده کنید.

- در حال حاضر، kubelet نمی‌تواند به طور خودکار درایور cgroup مورد استفاده توسط مجری کانتینر را تشخیص دهد، اما مقدار `--cgroup-driver` باید با درایور cgroup مورد استفاده توسط مجری کانتینر مطابقت داشته باشد تا سلامت kubelet تضمین شود.

- برای مشخص کردن مجری کانتینر، باید نقطه پایانی آن را با پرچم `--container-runtime-endpoint=<path>` تنظیم کنید.

روش توصیه‌شده برای اعمال چنین پیکربندی مختص به نمونه، استفاده از [`KubeletConfiguration` patches](/docs/setup/production-environment/tools/kubeadm/control-plane-flags#patches) است.

## پیکربندی kubelets با استفاده از kubeadm

می‌توان kubelet را طوری پیکربندی کرد که kubeadm آن را اجرا کند اگر یک شیء API سفارشی [`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/) با یک پرونده(فایل) پیکربندی مانند `kubeadm ... --config some-config-file.yaml` ارسال شود.

با فراخوانی `kubeadm config print init-defaults --component-configs KubeletConfiguration` می‌توانید تمام مقادیر پیش‌فرض این ساختار را مشاهده کنید.

همچنین می‌توان وصله‌های مخصوص هر نمونه را روی «KubeletConfiguration» پایه اعمال کرد. برای جزئیات بیشتر، نگاهی به [سفارشی‌سازی kubelet](/docs/setup/production-environment/tools/kubeadm/control-plane-flags#customizing-the-kubelet) بیندازید.

### گردش کار هنگام استفاده از `kubeadm init`

وقتی `kubeadm init` را فراخوانی می‌کنید، پیکربندی kubelet در مسیر `/var/lib/kubelet/config.yaml` روی دیسک ذخیره می‌شود و همچنین در یک نقشه پیکربندی `kubelet-config` در فضای نام `kube-system` خوشه(cluster) آپلود می‌شود. یک پرونده(فایل) پیکربندی kubelet همچنین در مسیر `/etc/kubernetes/kubelet.conf` با پیکربندی پایه در سطح خوشه(cluster) برای همه kubelet های خوشه(cluster) نوشته می‌شود. این پرونده(فایل) پیکربندی به گواهی‌های کلاینت اشاره می‌کند که به kubelet اجازه می‌دهد با سرور API ارتباط برقرار کند. این امر نیاز به `[انتشار پیکربندی سطح خوشه(cluster) به هر kubelet](#انتشار-پیکربندی-سطح-خوشه(cluster)-به-هر-kubelet)` را برطرف می‌کند.

برای پرداختن به الگوی دومِ [ارائه جزئیات پیکربندی مختص به نمونه](#ارائه-جزئیات-پیکربندی-مختص-به-نمونه)، kubeadm یک پرونده(فایل) محیطی را در `/var/lib/kubelet/kubeadm-flags.env` می‌نویسد که شامل فهرستی از پرچم‌هایی است که باید هنگام شروع به kubelet منتقل شوند. پرچم‌ها در پرونده(فایل) به این شکل ارائه می‌شوند:

```bash
KUBELET_KUBEADM_ARGS="--flag1=value1 --flag2=value2 ..."
```

علاوه بر پرچم‌های مورد استفاده هنگام شروع kubelet، این پرونده(فایل) همچنین شامل پارامترهای پویا مانند درایور cgroup و اینکه آیا از یک سوکت مجری کانتینر متفاوت (`--cri-socket`) استفاده شود یا خیر، می‌باشد.

پس از مرتب‌سازی این دو پرونده(فایل) روی دیسک، kubeadm تلاش می‌کند دو دستور زیر را اجرا کند، البته اگر از systemd استفاده می‌کنید:


```bash
systemctl daemon-reload && systemctl restart kubelet
```

اگر بارگذاری مجدد و راه‌اندازی مجدد موفقیت‌آمیز باشد، گردش کار عادی `kubeadm init` ادامه می‌یابد.

### گردش کار هنگام استفاده از `kubeadm join`

وقتی `kubeadm join` را اجرا می‌کنید، kubeadm از اعتبارنامه‌ی Bootstrap Token برای انجام یک راه انداز TLS استفاده می‌کند که اعتبارنامه‌ی مورد نیاز برای دانلود نقشه‌ی پیکربندی `kubelet-config` را دریافت کرده و آن را در `/var/lib/kubelet/config.yaml` می‌نویسد. پرونده(فایل) محیط پویا دقیقاً به همان روشی که `kubeadm init` تولید می‌شود، تولید می‌شود.

در مرحله بعد، `kubeadm` دو دستور زیر را برای بارگذاری پیکربندی جدید در kubelet اجرا می‌کند:

```bash
systemctl daemon-reload && systemctl restart kubelet
```

پس از اینکه kubelet پیکربندی جدید را بارگذاری کرد، kubeadm پرونده(فایل) KubeConfig را می‌نویسد که شامل یک گواهی CA و راه انداز Token است. این پرونده‌ها توسط kubelet برای انجام TLS راه انداز و دریافت یک اعتبارنامه منحصر به فرد استفاده می‌شوند که در `/etc/kubernetes/kubelet.conf` ذخیره می‌شود.

وقتی پرونده(فایل) `/etc/kubernetes/kubelet.conf` نوشته می‌شود، kubelet اجرای TLS راه انداز را به پایان رسانده است. Kubeadm پس از تکمیل TLS  راه انداز ، پرونده(فایل) `/etc/kubernetes/bootstrap-kubelet.conf` را حذف می‌کند.

##  پرونده(فایل) افزایش قابلیت kubelet برای systemd

`kubeadm` به همراه پیکربندی نحوه‌ی اجرای kubelet توسط systemd ارائه می‌شود.
توجه داشته باشید که دستور kubeadm CLI (فایل)هرگز به این پرونده drop-in دست نمی‌زند.

این پرونده(فایل) پیکربندی که توسط بسته `kubeadm` (https://github.com/kubernetes/release/blob/cd53840/cmd/krel/templates/latest/kubeadm/10-kubeadm.conf) نصب شده است، در مسیر `/usr/lib/systemd/system/kubelet.service.d/10-kubeadm.conf` نوشته شده و توسط systemd استفاده می‌شود. این پرونده، بسته اصلی `kubelet.service` (https://github.com/kubernetes/release/blob/cd53840/cmd/krel/templates/latest/kubelet/kubelet.service) را تکمیل می‌کند.

اگر می‌خواهید این مورد را بیشتر تغییر دهید، می‌توانید یک پوشه به نشانی(آدرس) `/etc/systemd/system/kubelet.service.d/` (نه `/usr/lib/systemd/system/kubelet.service.d/`) ایجاد کنید و تنظیمات شخصی‌سازی خود را در یک پرونده(فایل) در آنجا قرار دهید. برای مثال، می‌توانید یک پرونده(فایل) محلی جدید به نشانی(آدرس) `/etc/systemd/system/kubelet.service.d/local-overrides.conf` اضافه کنید تا تنظیمات واحد پیکربندی شده توسط `kubeadm` را تغییر دهید.

این چیزی است که احتمالاً در `/usr/lib/systemd/system/kubelet.service.d/10-kubeadm.conf` خواهید یافت:

{{< note >}}
مطالب زیر فقط یک مثال هستند. اگر نمی‌خواهید از مدیر بسته استفاده کنید، راهنمای ذکر شده در بخش ([بدون مدیر بسته](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#k8s-install-2)) را دنبال کنید.
{{< /note >}}

```none
[Service]
Environment="KUBELET_KUBECONFIG_ARGS=--bootstrap-kubeconfig=/etc/kubernetes/bootstrap-kubelet.conf --kubeconfig=/etc/kubernetes/kubelet.conf"
Environment="KUBELET_CONFIG_ARGS=--config=/var/lib/kubelet/config.yaml"
# This is a file that "kubeadm init" and "kubeadm join" generate at runtime, populating
# the KUBELET_KUBEADM_ARGS variable dynamically
EnvironmentFile=-/var/lib/kubelet/kubeadm-flags.env
# This is a file that the user can use for overrides of the kubelet args as a last resort. Preferably,
# the user should use the .NodeRegistration.KubeletExtraArgs object in the configuration files instead.
# KUBELET_EXTRA_ARGS should be sourced from this file.
EnvironmentFile=-/etc/default/kubelet
ExecStart=
ExecStart=/usr/bin/kubelet $KUBELET_KUBECONFIG_ARGS $KUBELET_CONFIG_ARGS $KUBELET_KUBEADM_ARGS $KUBELET_EXTRA_ARGS
```

این پرونده(فایل) مکان‌های پیش‌فرض برای تمام پرونده(فایل) ‌های مدیریت‌شده توسط kubeadm در kubelet را مشخص می‌کند.

- پرونده(فایل) KubeConfig مورد استفاده برای TLS (فایل)راه انداز، پرونده `/etc/kubernetes/bootstrap-kubelet.conf` است، اما فقط در صورتی استفاده می‌شود که `/etc/kubernetes/kubelet.conf` وجود نداشته باشد.
- پرونده(فایل) KubeConfig با هویت منحصر به فرد kubelet در مسیر `/etc/kubernetes/kubelet.conf` قرار دارد.
- پرونده(فایل) حاوی ComponentConfig مربوط به kubelet در مسیر `/var/lib/kubelet/config.yaml` قرار دارد.
- پرونده(فایل) محیط پویا که شامل `KUBELET_KUBEADM_ARGS` است، از `/var/lib/kubelet/kubeadm-flags.env` گرفته شده است.
- پرونده(فایل) ای که می‌تواند شامل لغو پرچم‌های مشخص‌شده توسط کاربر با `KUBELET_EXTRA_ARGS` باشد، از `/etc/default/kubelet` (برای DEBها) یا `/etc/sysconfig/kubelet` (برای RPMها) گرفته شده است. `KUBELET_EXTRA_ARGS`

آخرین پرونده(فایل) در زنجیره پرچم‌ها است و در صورت وجود تنظیمات متناقض، بالاترین اولویت را دارد.

## پرونده(فایل) های دودویی(باینری) و محتویات بسته‌های کوبرنتیز

بسته‌های DEB و RPM که با نسخه‌های کوبرنتیز ارائه می‌شوند عبارتند از:

| Package name | Description |
|--------------|-------------|
| `kubeadm`    | ابزار خط فرمان `/usr/bin/kubeadm` (فایل)و پرونده [kubelet drop-in file](#the-kubelet-drop-in-file-for-systemd) را برای kubelet نصب می‌کند. |
| `kubelet`    | (باینری)پرونده(فایل) دودویی `/usr/bin/kubelet` را نصب می‌کند. |
| `kubectl`    | (باینری)پرونده(فایل) دودویی `/usr/bin/kubectl` را نصب می‌کند. |
| `cri-tools`   | (باینری)پرونده(فایل) دودویی `/usr/bin/crictl` را از مخزن گیت [cri-tools] (https://github.com/kubernetes-sigs/cri-tools) نصب می‌کند. |
| `kubernetes-cni` | (باینری)پرونده‌(فایل)های دودویی `/opt/cni/bin` را از مخزن [plugins git](https://github.com/containernetworking/plugins) نصب می‌کند. |
