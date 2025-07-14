---
reviewers:
- چرخه حیات cluster sig

title: ایجاد یک خوشه با kubeadm
content_type: وظیفه
weight: 30
---

<!-- overview -->

<img src="/images/kubeadm-stacked-color.png" align="right" width="150px"></img>
با استفاده از `kubeadm`، می‌توانید یک خوشه Kubernetes با حداقل قابلیت اجرا ایجاد کنید که با بهترین شیوه‌ها مطابقت داشته باشد.

در واقع، می‌توانید از `kubeadm` برای راه‌اندازی خوشهی استفاده کنید که آزمون‌های انطباق [Kubernetes Conformance tests](/blog/2017/10/software-conformance-certification/). را با موفقیت پشت سر بگذارد.

`kubeadm` همچنین از سایر توابع چرخه عمر خوشه، مانند `[bootstrap tokens](/docs/reference/access-authn-authz/bootstrap-tokens/) و ارتقاء خوشه پشتیبانی می‌کند.


ابزار `kubeadm` در صورت نیاز به موارد زیر مفید است:

- روشی ساده برای شما تا احتمالاً برای اولین بار Kubernetes را امتحان کنید.
- روشی برای کاربران فعلی تا راه‌اندازی یک خوشه را خودکار کرده و برنامه خود را آزمایش کنند.
- یک بلوک سازنده در سایر بن‌سازه‌ها و/یا ابزارهای نصب با دامنه وسیع‌تر.

شما می‌توانید `kubeadm` را روی دستگاه‌های مختلفی نصب و استفاده کنید: لپ‌تاپ، مجموعه‌ای از سرورهای ابری، رزبری پای و موارد دیگر. چه در حال استقرار در فضای ابری باشید و چه در محل، می‌توانید `kubeadm` را در سیستم‌های آماده‌سازی مانند Ansible یا Terraform ادغام کنید.

## {{% heading "prerequisites" %}}

برای دنبال کردن این راهنما، شما نیاز دارید به:

- One or more machines running a deb/rpm-compatible Linux OS; - یک یا چند دستگاه که سیستم عامل لینوکس سازگار با deb/rpm را اجرا می‌کنند؛ به عنوان مثال: اوبونتو یا CentOS.


۲ گیگابایت یا بیشتر رم برای هر دستگاه - کمتر از این مقدار، فضای کمی برای برنامه‌های شما باقی می‌گذارد.


حداقل ۲ پردازنده روی دستگاهی که به عنوان گره صفحه کنترل استفاده می‌کنید.


اتصال کامل شبکه بین تمام دستگاه‌های موجود در خوشه. می‌توانید از یک شبکه عمومی یا خصوصی استفاده کنید.

همچنین باید از نسخه‌ای از `kubeadm` استفاده کنید که بتواند نسخه Kubernetes مورد نظر شما را در خوشه جدیدتان مستقر کند.

[Kubernetes' version and version skew support policy](/docs/setup/release/version-skew-policy/#supported-versions)
هم برای `kubeadm` و هم برای کل Kubernetes اعمال می‌شود.

برای اطلاع از نسخه‌های Kubernetes و `kubeadm` که پشتیبانی می‌شوند، این سیاست را بررسی کنید. این صفحه برای Kubernetes نوشته شده است {{< param "version" >}}.


وضعیت کلی ویژگی ابزار `kubeadm` در حالت دسترسی عمومی (GA) است. برخی از زیرویژگی‌ها هنوز در دست توسعه فعال هستند. پیاده‌سازی ایجاد خوشه ممکن است با تکامل ابزار کمی تغییر کند، اما پیاده‌سازی کلی باید کاملاً پایدار باشد.

{{< note >}}
هر دستوری که تحت `kubeadm alpha` باشد، طبق تعریف، در سطح آلفا پشتیبانی می‌شود.
{{< /note >}}

<!-- steps -->

## Objectives

* نصب یک خوشه Kubernetes با صفحه کنترل واحد
* نصب یک شبکه Pod روی خوشه به طوری که Pod های شما بتوانند با یکدیگر ارتباط برقرار کنند

## دستورالعمل ها

### آماده سازی میزبانان

#### نصب کامپوننت

یک {{< glossary_tooltip term_id="container-runtime" text="container runtime" >}}
و kubeadm را روی همه میزبان‌ها نصب کنید. برای دستورالعمل‌های دقیق و سایر پیش‌نیازها، به [Installing kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/). مراجعه کنید.


{{< note >}}
اگر قبلاً kubeadm را نصب کرده‌اید، برای دستورالعمل‌های مربوط به نحوه‌ی ارتقاء kubeadm، به دو مرحله‌ی اول سند [Upgrading Linux nodes](/docs/tasks/administer-cluster/kubeadm/upgrading-linux-nodes) مراجعه کنید.



وقتی شما ارتقا می‌دهید، kubelet هر چند ثانیه یک بار مجدداً راه‌اندازی می‌شود و در یک حلقه‌ی خرابی منتظر می‌ماند تا kubeadm به آن بگوید چه کاری انجام دهد. این حلقه‌ی خرابی مورد انتظار و طبیعی است.
پس از اینکه صفحه کنترل خود را مقداردهی اولیه کردید، kubelet به طور عادی اجرا می‌شود.
{{< /note >}}

#### Network setup

kubeadm مشابه سایر اجزای Kubernetes سعی می‌کند یک IP قابل استفاده در رابط‌های شبکه مرتبط با یک دروازه پیش‌فرض روی یک میزبان پیدا کند. سپس چنین IP برای تبلیغات و/یا شنود انجام شده توسط یک جزء استفاده می‌شود.

برای فهمیدن اینکه این IP در هاست لینوکس چیست، می‌توانید از دستور زیر استفاده کنید:

```shell
ip route show # Look for a line starting with "default via"
```

{{< note >}}
اگر دو یا چند default gateways روی میزبان وجود داشته باشد، یک جزء Kubernetes سعی می‌کند از اولین default gateways که با آن مواجه می‌شود و دارای یک آدرس IP جهانی تک‌پخشی مناسب است، استفاده کند. هنگام انجام این انتخاب، ترتیب دقیق default gateways ممکن است بین سیستم‌عامل‌ها و نسخه‌های هسته مختلف متفاوت باشد.
{{< /note >}}

اجزای Kubernetes رابط شبکه سفارشی را به عنوان یک گزینه نمی‌پذیرند، بنابراین یک آدرس IP سفارشی باید به عنوان یک پرچم به تمام نمونه‌های اجزایی که به چنین پیکربندی سفارشی نیاز دارند، ارسال شود.

{{< note >}}
اگر میزبان دروازه پیش‌فرض نداشته باشد و اگر یک آدرس IP سفارشی به یک جزء Kubernetes ارسال نشود، ممکن است آن جزء با خطا خارج شود.
{{< /note >}}

برای پیکربندی آدرس تبلیغ سرور API برای گره‌های صفحه کنترل که با هر دو `init` و `join` ایجاد شده‌اند، می‌توان از پرچم `--apiserver-advertise-address` استفاده کرد.

ترجیحاً، این گزینه می‌تواند در [kubeadm API](/docs/reference/config-api/kubeadm-config.v1beta4) به صورت `InitConfiguration.localAPIEndpoint` و `JoinConfiguration.controlPlane.localAPIEndpoint` تنظیم شود.

برای kubeletها روی همه گره‌ها، گزینه `--node-ip` را می‌توان در `.nodeRegistration.kubeletExtraArgs` درون یک فایل پیکربندی kubeadm (`InitConfiguration` یا `JoinConfiguration`) ارسال کرد.



برای دو پشته‌سازی به [Dual-stack support with kubeadm](/docs/setup/production-environment/tools/kubeadm/dual-stack-support).مراجعه کنید.

آدرس‌های IP که به اجزای صفحه کنترل اختصاص می‌دهید، بخشی از فیلدهای نام جایگزین موضوع گواهی‌های X.509 آنها می‌شوند. تغییر این آدرس‌های IP نیاز به امضای گواهی‌های جدید و راه‌اندازی مجدد اجزای آسیب‌دیده دارد، به طوری که تغییر در فایل‌های گواهی منعکس شود. برای جزئیات بیشتر در مورد این موضوع به [Manual certificate renewal](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#manual-certificate-renewal) مراجعه کنید.


{{< warning >}}
پروژه Kubernetes این رویکرد (پیکربندی تمام نمونه‌های کامپوننت با آدرس‌های IP سفارشی) را توصیه نمی‌کند. در عوض، نگهدارندگان Kubernetes توصیه می‌کنند شبکه میزبان را طوری تنظیم کنید که IP ,default gateway  IP باشد که اجزای Kubernetes به طور خودکار آن را شناسایی و استفاده می‌کنند.
در گره‌های لینوکس، می‌توانید از دستوراتی مانند `ip route` برای پیکربندی شبکه استفاده کنید. سیستم عامل شما ممکن است ابزارهای مدیریت شبکه سطح بالاتری را نیز ارائه دهد. اگر دروازه پیش‌فرض گره شما یک آدرس IP عمومی است، باید فیلتر کردن بسته‌ها یا سایر اقدامات امنیتی را که از گره‌ها و خوشه شما محافظت می‌کند، پیکربندی کنید.
{{< /warning >}}

### آماده‌سازیcontainer images مورد نیاز

این مرحله اختیاری است و فقط در صورتی اعمال می‌شود که شما نخواهید `kubeadm init` و `kubeadm join` تصاویر کانتینر پیش‌فرض را که در `registry.k8s.io` میزبانی می‌شوند، دانلود کنند.


Kubeadm دستوراتی دارد که می‌تواند به شما در پیش‌دریافت تصاویر مورد نیاز هنگام ایجاد یک خوشه بدون اتصال اینترنت روی گره‌های آن کمک کند.
برای جزئیات بیشتر به [Running kubeadm without an internet connection](/docs/reference/setup-tools/kubeadm/kubeadm-init#without-internet-connection) مراجعه کنید.


Kubeadm به شما امکان می‌دهد از یک مخزن image سفارشی برای تصاویر مورد نیاز استفاده کنید.
برای جزئیات بیشتر به [Using custom images](/docs/reference/setup-tools/kubeadm/kubeadm-init#custom-images)مراجعه کنید.

.

### مقداردهی اولیه control-plane node

control-plane node, ماشینی است که اجزای صفحه کنترل، از جمله {{< glossary_tooltip term_id="etcd" >}} (پایگاه داده خوشه‌ای) و {{< glossary_tooltip text="API Server" term_id="kube-apiserver" >}} (که ابزار خط فرمان {{< glossary_tooltip text="kubectl" term_id="kubectl" >}} با آن ارتباط برقرار می‌کند) در آن اجرا می‌شوند.

دارید این خوشه واحد `kubeadm` در صفحه کنترل را به [high availability](/docs/setup/production-environment/tools/kubeadm/high-availability/) ارتقا دهید، باید `--control-plane-endpoint` را برای تنظیم endpoint مشترک برای همهcontrol-plane مشخص کنید. چنین نقطه پایانی می‌تواند یک نام DNS یا یک آدرس IP از یک load-balancer باشد.


1. .دارید این خوشه واحد `kubeadm` در صفحه کنترل را به [high availability](/docs/setup/production-environment/tools/kubeadm/high-availability/) ارتقا دهید، باید `--control-plane-endpoint` را برای تنظیم endpoint مشترک برای همهcontrol-plane مشخص کنید. چنین نقطه پایانی می‌تواند یک نام DNS یا یک آدرس IP از یک load-balancer باشد.

یک افزونه شبکه Pod انتخاب کنید و بررسی کنید که آیا نیاز به ارسال آرگومان به `kubeadm init` دارد یا خیر. بسته به اینکه کدام ارائه‌دهنده شخص ثالث را انتخاب می‌کنید، ممکن است لازم باشد `--pod-network-cidr` را روی یک مقدار خاص ارائه‌دهنده تنظیم کنید. به [Installing a Pod network add-on](#pod-network) مراجعه کنید.
1. Cیک افزونه شبکه Pod انتخاب کنید و بررسی کنید که آیا نیاز به ارسال آرگومان به `kubeadm init` دارد یا خیر. بسته به اینکه کدام ارائه‌دهنده شخص ثالث را انتخاب می‌کنید، ممکن است لازم باشد `--pod-network-cidr` را روی یک مقدار خاص ارائه‌دهنده تنظیم کنید. به [Installing a Pod network add-on](#pod-network) مراجعه کنید.

۱. (اختیاری) `kubeadm` سعی می‌کند با استفاده از فهرستی از نقاط پایانی شناخته‌شده، زمان اجرای کانتینر را شناسایی کند. برای استفاده از زمان اجرای کانتینرهای مختلف یا اگر بیش از یک زمان اجرای کانتینر روی گره تأمین‌شده نصب شده است، آرگومان `--cri-socket` را برای `kubeadm` مشخص کنید. به [Installing a runtime](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#installing-runtime) مراجعه کنید.

برای مقداردهی اولیه گره صفحه کنترل، دستور زیر را اجرا کنید:

```bash
kubeadm init <args>
```

### ملاحظاتی در مورد apiserver-advertise-address و ControlPlaneEndpoint

در حالی که می‌توان از `--apiserver-advertise-address` برای تنظیم آدرس تبلیغ‌شده برای سرور API این گره صفحه کنترل خاص استفاده کرد، `--control-plane-endpoint` می‌تواند برای تنظیم نقطه پایانی مشترک برای همهcontrol-plane nodes  استفاده شود.


`--control-plane-endpoint` به آدرس‌های IP و نام‌های DNS اجازه می‌دهد تا به آدرس‌های IP نگاشت شوند. لطفاً برای ارزیابی راه‌حل‌های ممکن در رابطه با چنین نگاشتی، با مدیر شبکه خود تماس بگیرید.


در اینجا یک نمونه نقشه برداری آورده شده است:


```
192.168.0.102 cluster-endpoint
```

که در آن `192.168.0.102` آدرس IP این گره و `cluster-endpoint` یک نام DNS سفارشی است که به این IP نگاشت می‌شود.
این به شما امکان می‌دهد `--control-plane-endpoint=cluster-endpoint` را به `kubeadm init` ارسال کنید و همان نام DNS را به `kubeadm join` ارسال کنید. بعداً می‌توانید `cluster-endpoint` را تغییر دهید تا در سناریوی دسترسی بالا به آدرس متعادل‌کننده بار شما اشاره کند.

تبدیل یک خوشه صفحه کنترل که بدون `--control-plane-endpoint` ایجاد شده است به یک خوشه با دسترسی بالا توسط kubeadm پشتیبانی نمی‌شود.


### اطلاعات بیشتر

برای اطلاعات بیشتر در مورد آرگومان‌های `kubeadm init`، به [Using kubeadm init with a configuration file](/docs/reference/setup-tools/kubeadm/kubeadm-init/#config-file).مراجعه کنید.


برای سفارشی‌سازی اجزای صفحه کنترل، از جمله تخصیص اختیاری IPv6 به کاوشگر زنده بودن برای اجزای صفحه کنترل و سرور etcd، آرگومان‌های اضافی را برای هر جزء ارائه دهید، همانطور که در [custom arguments](/docs/setup/production-environment/tools/kubeadm/control-plane-flags/) مستند شده است.


برای پیکربندی مجدد خوشهی که قبلاً ایجاد شده است، به [Reconfiguring a kubeadm cluster](/docs/tasks/administer-cluster/kubeadm/kubeadm-reconfigure). مراجعه کنید.


برای اجرای مجدد `kubeadm init`، ابتدا باید [tear down the cluster](#tear-down).


اگر به node با معماری متفاوت با خوشه خود متصل می‌شوید، مطمئن شوید که DaemonSetهای مستقر شده شما از image کانتینر برای این معماری پشتیبانی می‌کنند.


`kubeadm init` ابتدا یک سری پیش‌بررسی انجام می‌دهد تا مطمئن شود که دستگاه برای اجرای Kubernetes آماده است. این پیش‌بررسی‌ها هشدارها را نمایش می‌دهند و در صورت بروز خطا از سیستم خارج می‌شوند. `kubeadm init` سپس اجزای صفحه کنترل خوشه را دانلود و نصب می‌کند. این کار ممکن است چند دقیقه طول بکشد.

بعد از اتمام باید ببینید:


```none

control-plane Kubernetes شما با موفقیت راه‌اندازی شد!

برای شروع استفاده از خوشه خود، باید دستور زیر را به عنوان یک کاربر معمولی اجرا کنید:


  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config


اکنون باید یک شبکه پاد (Pod network) را در خوشه مستقر کنید. دستور "kubectl apply -f [podnetwork].yaml" را با یکی از گزینه‌های ذکر شده در آدرس زیر اجرا کنید:
  /docs/concepts/cluster-administration/addons/


اکنون باید یک شبکه پاد (Pod network) را در خوشه مستقر کنید. دستور "kubectl apply -f [podnetwork].yaml" را با یکی از گزینه‌های ذکر شده در آدرس زیر اجرا کنید:
  /docs/concepts/cluster-administration/addons/


اکنون می‌توانید با اجرای دستور زیر روی هر گره به عنوان کاربر root هر تعداد ماشین را به هم متصل کنید:


  kubeadm join <control-plane-host>:<control-plane-port> --token <token> --discovery-token-ca-cert-hash sha256:<hash>
```

برای اینکه kubectl برای کاربر غیر ریشه شما کار کند، این دستورات را اجرا کنید که بخشی از خروجی `kubeadm init` نیز هستند:


```bash
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

از طرف دیگر، اگر کاربر «root» هستید، می‌توانید دستور زیر را اجرا کنید:

```bash
export KUBECONFIG=/etc/kubernetes/admin.conf
```

{{< warning >}}
فایل kubeconfig با نام `admin.conf` که `kubeadm init` تولید می‌کند، حاوی گواهی‌نامه‌ای با این مشخصات است: `Subject: O = kubeadm:cluster-admins, CN = kubernetes-admin`. گروه `kubeadm:cluster-admins` به ClusterRole داخلی `cluster-admin` متصل است. فایل `admin.conf` را با هیچ‌کس به اشتراک نگذارید.

`kubeadm init` یک فایل kubeconfig دیگر به نام `super-admin.conf` تولید می‌کند که حاوی گواهی‌نامه‌ای با این مشخصات است:
`Subject: O = system:masters, CN = kubernetes-super-admin`. `system:masters` یک گروه کاربری فوق‌العاده قدرتمند است که لایه مجوز (مثلاً RBAC) را دور می‌زند.
فایل `super-admin.conf` را با کسی به اشتراک نگذارید. توصیه می‌شود فایل را به مکانی امن منتقل کنید.


برای اطلاع از نحوه استفاده از `kubeadm kubeconfig user` برای تولید فایل‌های kubeconfig برای کاربران اضافی، به [Generating kubeconfig files for additional users](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs#kubeconfig-additional-users) مراجعه کنید.
{{< /warning >}}


دستور `kubeadm join` که `kubeadm init` خروجی می‌دهد را یادداشت کنید. شما به این دستور برای [join nodes to your cluster](#join-nodes) نیاز دارید.


این توکن برای احراز هویت متقابل بینcontrol-plane node و گره‌های اتصال استفاده می‌شود. توکن موجود در اینجا مخفی است. آن را ایمن نگه دارید، زیرا هر کسی که این توکن را داشته باشد می‌تواند گره‌های احراز هویت شده را به خوشه شما اضافه کند. این توکن‌ها را می‌توان با دستور `kubeadm token` فهرست، ایجاد و حذف کرد. به [kubeadm reference guide](/docs/reference/setup-tools/kubeadm/kubeadm-token/) مراجعه کنید.

### نصب افزونه شبکه پاد {#pod-network}

{{< caution >}}
این بخش حاوی اطلاعات مهمی در مورد راه‌اندازی شبکه و ترتیب استقرار است.
قبل از ادامه، تمام این توصیه‌ها را با دقت بخوانید.

**شما باید یک افزونه شبکه پاد مبتنی بر {{< glossary_tooltip text="رابط شبکه کانتینر" term_id="cni" >}}
(CNI) را مستقر کنید تا پادهای شما بتوانند با یکدیگر ارتباط برقرار کنند.
Cluster DNS (CoreDNS) قبل از نصب شبکه راه‌اندازی نمی‌شود.**


- مراقب باشید که شبکه Pod شما با هیچ یک از شبکه‌های میزبان همپوشانی نداشته باشد: در صورت وجود هرگونه همپوشانی، احتمالاً با مشکلاتی مواجه خواهید شد.
(اگر بین شبکه Pod ترجیحی افزونه شبکه خود و برخی از شبکه‌های میزبان خود، تصادمی مشاهده کردید، باید به جای آن از یک بلوک CIDR مناسب استفاده کنید، سپس آن را در طول `kubeadm init` با `--pod-network-cidr` و به عنوان جایگزینی در YAML افزونه شبکه خود استفاده کنید.)

- به طور پیش‌فرض، `kubeadm` خوشه شما را برای استفاده و اعمال کنترل دسترسی مبتنی بر نقش [RBAC](/docs/reference/access-authn-authz/rbac/) تنظیم می‌کند.

مطمئن شوید که افزونه شبکه Pod شما و همچنین هر مانیفستی که برای استقرار آن استفاده می‌کنید، از RBAC پشتیبانی می‌کند.


- اگر می‌خواهید از IPv6 - چه شبکه دو پشته‌ای و چه تک پشته‌ای - برای خوشه خود استفاده کنید، مطمئن شوید که افزونه شبکه Pod شما از IPv6 پشتیبانی می‌کند.

پشتیبانی از IPv6 در  [v0.6.0](https://github.com/containernetworking/cni/releases/tag/v0.6.0) به CNI اضافه شده است.

{{< /caution >}}

{{< note >}}
Kubeadm باید CNI را نادیده بگیرد و اعتبارسنجی ارائه‌دهندگان CNI خارج از محدوده آزمایش فعلی e2e ما است.
اگر مشکلی مربوط به یک افزونه CNI پیدا کردید، باید به جای ردیاب‌های مشکل kubeadm یا kubernetes، در ردیاب مشکل مربوطه تیکت ثبت کنید.
{{< /note >}}

چندین پروژه خارجی، شبکه‌های Kubernetes Pod را با استفاده از CNI ارائه می‌دهند که برخی از آنها از [Network Policy](/docs/concepts/services-networking/network-policies/) نیز پشتیبانی می‌کنند.

فهرستی از افزونه‌هایی که مدل شبکه Kubernetes را پیاده‌سازی می‌کنند را ببینید. [Kubernetes networking model](/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-network-model).


برای مشاهده لیست ناقص افزونه‌های شبکه پشتیبانی شده توسط Kubernetes، لطفاً به صفحه [Installing Addons](/docs/concepts/cluster-administration/addons/#networking-and-network-policy) مراجعه کنید.
شما می‌توانید افزونه شبکه Pod را با دستور زیر روی گره control-plane یا گره‌ای که دارای اعتبارنامه kubeconfig است، نصب کنید:

```bash
kubectl apply -f <add-on.yaml>
```

{{< note >}}
فقط تعداد کمی از افزونه‌های CNI از ویندوز پشتیبانی می‌کنند. جزئیات بیشتر و دستورالعمل‌های راه‌اندازی را می‌توانید در [Adding Windows worker nodes](/docs/tasks/administer-cluster/kubeadm/adding-windows-nodes/#network-config) بیابید.
{{< /note >}}

شما می‌توانید فقط یک شبکه Pod در هر خوشه نصب کنید.

پس از نصب شبکه Pod، می‌توانید با بررسی اینکه CoreDNS Pod در خروجی `kubectl get pods --all-namespaces` در حال اجرا است، از عملکرد آن اطمینان حاصل کنید.
و پس از راه‌اندازی و اجرای CoreDNS Pod، می‌توانید با اتصال گره‌های خود ادامه دهید.


اگر شبکه شما کار نمی‌کند یا CoreDNS در حالتا`Running` نیست، برای `kubeadm` به [troubleshooting guide](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/)مراجعه کنید.

### برچسب‌های گره مدیریت شده

به طور پیش‌فرض، kubeadm کنترل‌کننده‌ی پذیرش [NodeRestriction](/docs/reference/access-authn-authz/admission-controllers/#noderestriction) را فعال می‌کند که برچسب‌هایی را که kubelets می‌تواند به صورت خودکار در ثبت گره اعمال کند، محدود می‌کند.
مستندات admission controller، برچسب‌هایی را که مجاز به استفاده با گزینه `--node-labels` در kubelet هستند، پوشش می‌دهد. برچسب `node-role.kubernetes.io/control-plane` یک برچسب محدود است و kubeadm آن را به صورت دستی با استفاده از یک کلاینت ممتاز پس از ایجاد یک گره اعمال می‌کند. برای انجام این کار به صورت دستی، می‌توانید همین کار را با استفاده از `kubectl label` انجام دهید و مطمئن شوید که از یک kubeconfig ممتاز مانند kubeadm managed `/etc/kubernetes/admin.conf` استفاده می‌کند.

### Control plane node isolation

به طور پیش‌فرض، خوشه شما به دلایل امنیتی، Podها را روی control plane کنترل زمان‌بندی نمی‌کند. اگر می‌خواهید بتوانید Podها را روی گره‌های صفحه کنترل زمان‌بندی کنید، به عنوان مثال برای یک خوشه Kubernetes تک ماشینه، دستور زیر را اجرا کنید:

```bash
kubectl taint nodes --all node-role.kubernetes.io/control-plane-
```

خروجی چیزی شبیه به این خواهد بود:

```
node "test-01" untainted
...
```
این کار، اثر `node-role.kubernetes.io/control-plane:NoSchedule` را از هر گره‌ای که آن را داشته باشد، از جمله control plane، حذف می‌کند، به این معنی که زمان‌بند می‌تواند Podها را در همه جا زمان‌بندی کند.

علاوه بر این، می‌توانید دستور زیر را برای حذف برچسب ‎[`node.kubernetes.io/exclude-from-external-load-balancers`](/docs/reference/labels-annotations-taints/#node-kubernetes-io-exclude-from-external-load-balancers)‎ از گره صفحه کنترل اجرا کنید، که آن را از لیست سرورهای backend حذف می‌کند:

```bash
kubectl label nodes --all node.kubernetes.io/exclude-from-external-load-balancers-
```

### افزودن control plane nodes بیشتر

برای مراحل ایجاد یک خوشه kubeadm با قابلیت دسترسی بالا با افزودن گره‌های صفحه کنترل بیشتر، به [Creating Highly Available Clusters with kubeadm](/docs/setup/production-environment/tools/kubeadm/high-availability/) مراجعه کنید.

### اضافه کردن orker nodes {#join-nodes}

worker nodes جایی هستند که بارهای کاری شما اجرا می‌شوند.

صفحات زیر نحوه اضافه کردن worker nodesر لینوکس و ویندوز به خوشه را با استفاده از دستور `kubeadm join` نشان می‌دهند:


* [Adding Linux worker nodes](/docs/tasks/administer-cluster/kubeadm/adding-linux-nodes/)
* [Adding Windows worker nodes](/docs/tasks/administer-cluster/kubeadm/adding-windows-nodes/)

### (Optional) Controlling your cluster from machines other than the control-plane node

(اختیاری) کنترل خوشه شما از ماشین‌هایی غیر از گره control-plane node

برای اینکه بتوانید kubectl را روی رایانه دیگری (مثلاً لپ‌تاپ) با خوشه خود ارتباط برقرار کنید، باید فایل kubeconfig با دسترسی مدیر را از گره صفحه کنترل خود به ایستگاه کاری خود به این صورت کپی کنید:


```bash
scp root@<control-plane-host>:/etc/kubernetes/admin.conf .
kubectl --kubeconfig ./admin.conf get nodes
```

{{< note >}}
مثال بالا فرض می‌کند که دسترسی SSH برای کاربر root فعال است. اگر اینطور نیست، می‌توانید فایل `admin.conf` را کپی کنید تا توسط کاربر دیگری قابل دسترسی باشد و `scp` را با استفاده از آن کاربر دیگر اجرا کنید.


فایل `admin.conf` به کاربر _superuser_ دسترسی‌های لازم را در خوشه می‌دهد. این فایل باید به ندرت استفاده شود. برای کاربران عادی، توصیه می‌شود که یک اعتبارنامه منحصر به فرد ایجاد کنند که به آن دسترسی‌ها را اعطا کنید. می‌توانید این کار را با دستور `kubeadm kubeconfig user --client-name <CN>` انجام دهید. این دستور یک فایل KubeConfig را در STDOUT چاپ می‌کند که باید آن را در یک فایل ذخیره کرده و بین کاربر خود توزیع کنید. پس از آن، با استفاده از `kubectl create (cluster)rolebinding` به کاربر دسترسی‌های لازم را اعطا کنید.
{{< /note >}}

### (اختیاری) پروکسی کردن سرور API به localhost

اگر می‌خواهید از خارج از خوشه به سرور API متصل شوید، می‌توانید از پروکسی `kubectl` استفاده کنید:


```bash
scp root@<control-plane-host>:/etc/kubernetes/admin.conf .
kubectl --kubeconfig ./admin.conf proxy
```

اکنون می‌توانید به صورت محلی به سرور API دسترسی داشته باشید. `http://localhost:8001/api/v1`

## تمیز کردن {#tear-down}

اگر برای تست از سرورهای یکبار مصرف برای خوشه خود استفاده کرده‌اید، می‌توانید آنها را خاموش کنید و دیگر نیازی به پاکسازی نداشته باشید. می‌توانید از دستور `kubectl config delete-cluster` برای حذف ارجاعات محلی خود به خوشه استفاده کنید.

با این حال، اگر می‌خواهید خوشه خود را به طور تمیزتری از حالت آماده به کار خارج کنید، ابتدا باید [drain the node](/docs/reference/generated/kubectl/kubectl-commands#drain) را انجام دهید و مطمئن شوید که گره خالی است، سپس گره را از حالت پیکربندی خارج کنید

### حذف  node

Talking to the control-plane node with the appropriate credentials, run:

با استفاده از اعتبارنامه‌های مناسب، با control-plane node ارتباط برقرار کنید و دستور زیر را اجرا کنید:


```bash
kubectl drain <node name> --delete-emptydir-data --force --ignore-daemonsets
```

قبل از حذف گره، وضعیت نصب شده توسط `kubeadm` را ریست کنید:

```bash
kubeadm reset
```

فرآیند بازنشانی، قوانین iptables یا جداول IPVS را بازنشانی یا پاک نمی‌کند.
اگر می‌خواهید iptables را بازنشانی کنید، باید این کار را به صورت دستی انجام دهید:

```bash
iptables -F && iptables -t nat -F && iptables -t mangle -F && iptables -X
```

اگر می‌خواهید جداول IPVS را مجدداً تنظیم کنید، باید دستور زیر را اجرا کنید:


```bash
ipvsadm -C
```

حالا گره را حذف کنید:

```bash
kubectl delete node <node name>
```

اگر می‌خواهید از ابتدا شروع کنید، `kubeadm init` یا `kubeadm join` را با آرگومان‌های مناسب اجرا کنید.


### Clean up the control plane

control plane را تمیز کنید

شما می‌توانید از دستور `kubeadm reset` روی میزبان صفحه کنترل برای راه‌اندازی یک پاکسازی با بهترین تلاش استفاده کنید.


برای اطلاعات بیشتر در مورد این زیردستور و گزینه‌های آن، به مستندات مرجع [`kubeadm reset`](/docs/reference/setup-tools/kubeadm/kubeadm-reset/) مراجعه کنید.

## یاست انحراف نسخه {#version-skew-policy}

اگرچه kubeadm اجازه می‌دهد تا نسخه در برابر برخی از اجزایی که مدیریت می‌کند، تغییر کند، توصیه می‌شود نسخه kubeadm را با نسخه‌های اجزای control plane، kube-proxy و kubelet، مطابقت دهید.


### انحراف kubeadm از نسخه Kubernetes


kubeadm را می‌توان با اجزای Kubernetes که نسخه مشابه kubeadm یا یک نسخه قدیمی‌تر دارند، استفاده کرد. نسخه Kubernetes را می‌توان با استفاده از پرچم ``--kubernetes-version` از `kubeadm init` یا فیلد ``[`ClusterConfiguration.kubernetesVersion`](/docs/reference/config-api/kubeadm-config.v1beta4/) هنگام استفاده از `--config` برای kubeadm مشخص کرد. این گزینه نسخه‌های kube-apiserver، kube-controller-manager، kube-scheduler و kube-proxy را کنترل می‌کند.

مثال:


* kubeadm در {{< skew currentVersion >}} قرار دارد.
* `kubernetesVersion` باید در {{< skew currentVersion >}} یا {{< skew currentVersionAddMinor -1 >}} باشد.

### انحراف kubeadm در برابر kubelet


مشابه نسخه Kubernetes، kubeadm را می‌توان با یک نسخه kubelet که همان نسخه kubeadm یا سه نسخه قدیمی‌تر است، استفاده کرد.


مثال:


* kubeadm در {{< skew currentVersion >}} قرار دارد.
* kubelet روی میزبان باید در {{< skew currentVersion >}} باشد
 , {{< skew currentVersionAddMinor -1 >}},
  {{< skew currentVersionAddMinor -2 >}} or {{< skew currentVersionAddMinor -3 >}}

### انحراف kubeadm`sدر برابر kubeadm


محدودیت‌های خاصی در مورد نحوه‌ی عملکرد دستورات kubeadm روی گره‌های موجود یا کل خوشههای مدیریت‌شده توسط kubeadm وجود دارد.


اگر nodes جدیدی به خوشه اضافه شوند، فایل باینری kubeadm که برای `kubeadm join` استفاده می‌شود، باید با آخرین نسخه kubeadm که برای ایجاد خوشه با `kubeadm init` یا برای ارتقاء همان گره با `kubeadm upgrade` استفاده شده است، مطابقت داشته باشد. قوانین مشابهی برای بقیه دستورات kubeadm اعمال می‌شود، به استثنای `kubeadm upgrade`.


مثال برای `kubeadm join`:

* نسخه kubeadm {{< skew currentVersion >}} برای ایجاد یک خوشه با `kubeadm init` استفاده شد.
* گره‌های اتصال باید از یک فایل باینری kubeadm که در نسخه {{< skew currentVersion >}} است، استفاده کنند.


Nodes که ارتقا می‌یابند باید از نسخه‌ای از kubeadm استفاده کنند که با نسخه MINOR یکسان باشد یا یک نسخه MINOR جدیدتر از نسخه kubeadm مورد استفاده برای مدیریت گره باشد.


مثال برای `kubeadm upgrade`:

* نسخه kubeadm {{< skew currentVersionAddMinor -1 >}} برای ایجاد یا ارتقاء گره استفاده شد.
* نسخه kubeadm مورد استفاده برای ارتقاء گره باید در {{< skew currentVersionAddMinor -1 >}} یا {{< skew currentVersion >}} باشد.


برای کسب اطلاعات بیشتر در مورد انحراف نسخه بین اجزای مختلف Kubernetes، به [Version Skew Policy](/releases/version-skew-policy/) مراجعه کنید.

## محدودیت‌ها {#limitations}


### تاب‌آوری Cluster {#resilience}


cluster ایجاد شده در اینجا دارای یکcontrol-plane node است که یک پایگاه داده etcd روی آن اجرا می‌شود. این بدان معناست که اگرcontrol-plane node گ از کار بیفتد، خوشه شما ممکن است داده‌ها را از دست بدهد و ممکن است نیاز به ایجاد مجدد از ابتدا داشته باشد.


راه حل ها:

* به طور منظم از etcd نسخه پشتیبان تهیه کنید [back up etcd](https://etcd.io/docs/v3.5/op-guide/recovery/). دایرکتوری داده etcd که توسط kubeadm پیکربندی شده است، در گره control-plane در مسیر `/var/lib/etcd` قرار دارد.


* از چندین گره صفحه کنترل استفاده کنید. می‌توانید برای انتخاب یک توپولوژی خوشه که [Options for Highly Available topology](/docs/setup/production-environment/tools/kubeadm/ha-topology/) را انتخاب می‌کند، [high-availability](/docs/setup/production-environment/tools/kubeadm/high-availability/) را مطالعه کنید.


### سازگاری با پلتفرم {#multi-platform}

بسته‌ها و فایل‌های باینری deb/rpm kubeadm برای amd64، arm (32-bit)، arm64، ppc64le و s390x مطابق با [multi-platform proposal](https://git.k8s.io/design-proposals-archive/multi-platform.md) ساخته شده‌اند.


images کانتینر چند پلتفرمی برایcontrol plane و افزونه‌ها نیز از نسخه ۱.۱۲ پشتیبانی می‌شوند.

فقط برخی از ارائه دهندگان شبکه، راهکارهایی برای همه پلتفرم‌ها ارائه می‌دهند. لطفاً برای اطلاع از اینکه آیا ارائه دهنده از پلتفرم انتخابی شما پشتیبانی می‌کند یا خیر، به لیست ارائه دهندگان شبکه در بالا یا مستندات هر ارائه دهنده مراجعه کنید.


## عیب یابی{#troubleshooting}

اگر با kubeadm به مشکل برخوردید، لطفاً به  ما [troubleshooting docs](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/). مراجعه کنید.

<!-- discussion -->

## {{% heading "whatsnext" %}}

* با استفاده از [Sonobuoy](https://github.com/heptio/sonobuoy) از اجرای صحیح خوشه خود اطمینان حاصل کنید.
* <a id="lifecycle" />برای جزئیات بیشتر در مورد ارتقاء خوشه خود با استفاده از `kubeadm` به [ارتقاء خوشههای kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/) مراجعه کنید.

* برای آشنایی با کاربردهای پیشرفته‌ی `kubeadm` به [kubeadm reference documentation](/docs/reference/setup-tools/kubeadm/) مراجعه کنید.
* برای آشنایی بیشتر با Kubernetes [concepts](/docs/concepts/) و [`kubectl`](/docs/reference/kubectl/) را مطالعه کنید.

* برای فهرست کامل‌تری از افزونه‌های شبکه Pod، به صفحه [Cluster Networking](/docs/concepts/cluster-administration/networking/) مراجعه کنید.


* برای فهرست کامل‌تری از افزونه‌های شبکه Pod، به صفحه [Cluster Networking](/docs/concepts/cluster-administration/networking/) مراجعه کنید.
* <a id="other-addons" />برای بررسی سایر افزونه‌ها، از جمله ابزارهای ثبت وقایع، نظارت، سیاست‌های شبکه، تجسم و کنترل خوشه Kubernetes [list of add-ons](/docs/concepts/cluster-administration/addons/) مراجعه کنید.
* نحوه مدیریت لاگ‌ها توسط خوشه خود برای رویدادهای خوشه و از برنامه‌های در حال اجرا در Pods را پیکربندی کنید.
برای مرور کلی آنچه که در این زمینه دخیل است، به [Logging Architecture](/docs/concepts/cluster-administration/logging/) مراجعه کنید.


### بازخورد {#feedback}

* برای اطلاع از اشکالات، به [kubeadm GitHub issue tracker](https://github.com/kubernetes/kubeadm/issues) مراجعه کنید.
* برای پشتیبانی، به [#kubeadm](https://kubernetes.slack.com/messages/kubeadm/) کانال Slack مراجعه کنید.
* توسعه چرخه حیات عمومی خوشه SIG کانال Slack:
[#sig-cluster-lifecycle](https://kubernetes.slack.com/messages/sig-cluster-lifecycle/)
* چرخه حیات Cluster SIG [اطلاعات SIG](https://github.com/kubernetes/community/tree/master/sig-cluster-lifecycle#readme)
* لیست پستی چرخه حیات Cluster SIG:
[kubernetes-sig-cluster-lifecycle](https://groups.google.com/forum/#!forum/kubernetes-sig-cluster-lifecycle)