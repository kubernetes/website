---
reviewers:
-  چرخه حیات cluster sig
title: ایجاد خوشه با دسترسی‌پذیری بالا با kubeadm
content_type: task
weight: 60
---

<!-- overview -->

این صفحه دو رویکرد متفاوت برای راه‌اندازی یک خوشه Kubernetes با دسترسی‌پذیری بالا با استفاده از kubeadm را توضیح می‌دهد:


- با control plane nodes انباشته. این رویکرد به زیرساخت کمتری نیاز دارد. اعضای etcd
و control plane nodes در کنار هم قرار دارند.

- با یک cluster etcd خارجی. این رویکرد به زیرساخت بیشتری نیاز دارد. control plane nodes و اعضای etcd از هم جدا هستند.

قبل از ادامه، باید با دقت بررسی کنید که کدام رویکرد به بهترین وجه نیازهای برنامه‌ها و محیط شما را برآورده می‌کند. [Options for Highly Available topology](/docs/setup/production-environment/tools/kubeadm/ha-topology/)
مزایا و معایب هر یک را شرح می‌دهد.

اگر در راه‌اندازی خوشه HA با مشکلی مواجه شدید، لطفاً این موارد را در kubeadm [issue tracker](https://github.com/kubernetes/kubeadm/issues/new). گزارش دهید.

همچنین به [upgrade documentation](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/) مراجعه کنید.

{{< caution >}}
این صفحه به اجرای خوشه شما روی یک ارائه‌دهنده ابری نمی‌پردازد. در یک محیط ابری، هیچ یک از رویکردهای مستند شده در اینجا با اشیاء سرویس از نوع LoadBalancer یا با PersistentVolume های پویا کار نمی‌کنند.
{{< /caution >}}

## {{% heading "prerequisites" %}}

پیش‌نیازها بستگی به این دارد که کدام توپولوژی را برای صفحه control plane خود انتخاب کرده‌اید:

{{< tabs name="prerequisite_tabs" >}}
{{% tab name="Stacked etcd" %}}
<!--
    note to reviewers: these prerequisites should match the start of the
    external etc tab
-->

شما نیاز دارید:

- سه یا چند دستگاه که حداقل الزامات kubeadm را برآورده کنند [kubeadm's minimum requirements](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#before-you-begin) برای control-plane nodes. داشتن تعداد فرد control-plane nodes می‌تواند مفید باشد.می‌تواند در صورت خرابی ماشین یا منطقه به انتخاب رهبر کمک کند.



- شامل {{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}، که از قبل تنظیم شده و کار می‌کند
- سه یا چند دستگاه که [حداقل الزامات kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#before-you-begin) را برای کارگران برآورده کنند
  - شامل یک کانتینر در زمان اجرا، که از قبل راه‌اندازی شده و در حال کار است
- اتصال کامل شبکه بین تمام ماشین‌های موجود در خوشه (شبکه عمومی یا خصوصی)
- امتیازات کاربر ارشد در تمام دستگاه‌ها با استفاده از `sudo`
- شما می‌توانید از ابزار دیگری استفاده کنید؛ این راهنما در مثال‌ها از `sudo` استفاده می‌کند.
- دسترسی SSH از یک دستگاه به تمام گره‌های سیستم
- `kubeadm` و `kubelet` از قبل روی همه دستگاه‌ها نصب شده‌اند.


_See [Stacked etcd topology](/docs/setup/production-environment/tools/kubeadm/ha-topology/#stacked-etcd-topology) for context._

{{% /tab %}}
{{% tab name="External etcd" %}}
<!--
    note to reviewers: these prerequisites should match the start of the
    stacked etc tab
-->
شما نیاز دارید:

- سه یا چند ماشین که حداقل الزامات kubeadm را برآورده کنند [kubeadm's minimum requirements](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#before-you-begin) برای control-plane node. داشتن تعداد فرد گره‌های صفحه کنترل می‌تواند در صورت خرابی ماشین یا منطقه به انتخاب رهبر کمک کند.
- شامل {{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}، که از قبل تنظیم شده و کار می‌کند
- سه یا چند دستگاه که [kubeadm's minimum
  requirements](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#before-you-begin) را برای worker برآورده کنند
- شامل یک زمان اجرای کانتینر، که از قبل تنظیم شده و در حال کار است
- اتصال کامل شبکه بین تمام ماشین‌های موجود در خوشه (شبکه عمومی یا خصوصی)

- امتیازات کاربر ارشد (Superuser) در تمام دستگاه‌ها با استفاده از `sudo`
- شما می‌توانید از ابزار دیگری استفاده کنید؛ این راهنما در مثال‌ها از `sudo` استفاده می‌کند.
- دسترسی SSH از یک دستگاه به تمام گره‌های سیستم
- `kubeadm` و `kubelet` از قبل روی تمام دستگاه‌ها نصب شده‌اند.

<!-- end of shared prerequisites -->

و همچنین شما نیاز دارید:


- سه یا چند ماشین اضافی، که به اعضای cluster etcd تبدیل می‌شوند.
داشتن تعداد فرد عضو در خوشه etcd برای دستیابی به حد نصاب رأی‌گیری بهینه ضروری است.
- این ماشین‌ها نیز باید `kubeadm` و `kubelet` را نصب داشته باشند.
- این ماشین‌ها همچنین به یک زمان اجرای کانتینر نیاز دارند که از قبل راه‌اندازی شده و کار می‌کند.
_See [External etcd topology](/docs/setup/production-environment/tools/kubeadm/ha-topology/#external-etcd-topology) for context._
{{% /tab %}}
{{< /tabs >}}

### کانتینر ایمیج

هر میزبان باید به خواندن و واکشی تصاویر از رجیستری تصویر کانتینر Kubernetes، `registry.k8s.io` دسترسی داشته باشد. اگر می‌خواهید یک خوشه با قابلیت دسترسی بالا مستقر کنید که در آن میزبان‌ها به دریافت تصاویر دسترسی نداشته باشند، این کار امکان‌پذیر است. شما باید به روش‌های دیگری اطمینان حاصل کنید که ایمیج کانتینر صحیح از قبل در میزبان‌های مربوطه موجود هستند.


### رابط خط فرمان {#kubectl}
برای مدیریت Kubernetes پس از راه‌اندازی خوشه، باید [install kubectl](/docs/tasks/tools/#kubectl) را روی رایانه خود نصب کنید. همچنین نصب ابزار `kubectl` روی هرcontrol plane node مفید است، زیرا این امر می‌تواند برای عیب‌یابی مفید باشد.

<!-- steps -->

## مراحل اولیه برای هر دو روش

### ایجاد متعادل‌کننده بار برای kube-apiserver


{{< note >}}
پیکربندی‌های زیادی برای متعادل‌کننده‌های بار وجود دارد. مثال زیر تنها یکی از گزینه‌هاست. ممکن است نیازهای خوشه شما به پیکربندی متفاوتی نیاز داشته باشد.
{{< /note >}}

1. یک متعادل‌کننده بار kube-apiserver با نامی که به DNS متصل می‌شود، ایجاد کنید.

- در یک محیط ابری، باید control plane nodesل خود را پشت یک متعادل‌کننده بار  TCP قرار دهید. این متعادل‌کننده بار، ترافیک را به همه گره‌های صفحه کنترل سالم در لیست هدف خود توزیع می‌کند. بررسی سلامت یک سرور api، بررسی TCP روی پورتی است که kube-apiser به آن گوش می‌دهد (مقدار پیش‌فرض `:6443`).

   - استفاده مستقیم از آدرس IP در محیط ابری توصیه نمی‌شود.

   - متعادل‌کننده بار باید بتواند با تمام گره‌های صفحه کنترل روی پورت apiserver ارتباط برقرار کند. همچنین باید به ترافیک ورودی روی پورت Listening خود اجازه عبور دهد.


   - مطمئن شوید که آدرس متعادل‌کننده بار همیشه با آدرس `ControlPlaneEndpoint` در kubeadm مطابقت دارد.


  - برای جزئیات بیشتر، راهنمای [Options for Software Load Balancing](https://git.k8s.io/kubeadm/docs/ha-considerations.md#options-for-software-load-balancing) را مطالعه کنید.

1. اولین گره  کنترل پلین  را به متعادل‌کننده بار اضافه کنید و اتصال را آزمایش کنید:


   ```shell
   nc -zv -w 2 <LOAD_BALANCER_IP> <PORT>
   ```

  انتظار می‌رود خطای عدم پذیرش اتصال رخ دهد زیرا سرور API هنوز در حال اجرا نیست. با این حال، وقفه زمانی به این معنی است که متعادل‌کننده بار نمی‌تواند باcontrol plane node ارتباط برقرار کند. اگر وقفه زمانی رخ داد، متعادل‌کننده بار را برای ارتباط با گره صفحه کنترل مجدداً پیکربندی کنید.

1. control plane node  باقی‌مانده را به گروه هدف متعادل‌کننده بار اضافه کنید.


## صفحه کنترل انباشته و گره‌های etcd

###  پلین مراحل مربوط به اولین گره  کنترل

1. Initialize the control plane:

   ```sh
   sudo kubeadm init --control-plane-endpoint "LOAD_BALANCER_DNS:LOAD_BALANCER_PORT" --upload-certs
   ```

- می‌توانید از پرچم `--kubernetes-version` برای تنظیم نسخه Kubernetes مورد استفاده استفاده کنید.
توصیه می‌شود نسخه‌های kubeadm، kubelet، kubectl و Kubernetes با هم مطابقت داشته باشند.
- پرچم `--control-plane-endpoint` باید روی آدرس یا DNS و پورت متعادل‌کننده بار تنظیم شود.

- پرچم `--upload-certs` برای آپلود گواهی‌هایی که باید در تمام نمونه‌های صفحه کنترل به خوشه به اشتراک گذاشته شوند، استفاده می‌شود. اگر در عوض، ترجیح می‌دهید گواهی‌ها را به صورت دستی یا با استفاده از ابزارهای اتوماسیون در گره‌های صفحه کنترل کپی کنید، لطفاً این پرچم را حذف کرده و به بخش [توزیع گواهی دستی](#manual-certs) در زیر مراجعه کنید.


   {{< note >}}  
فلگ‌های `kubeadm init` یعنی `--config` و `--certificate-key` را نمی‌توان با هم ترکیب کرد، بنابراین اگر می‌خواهید از [kubeadm configuration](/docs/reference/config-api/kubeadm-config.v1beta4/) استفاده کنید، باید فیلد `certificateKey` را در مکان‌های پیکربندی مناسب (زیر `InitConfiguration` و `JoinConfiguration: controlPlane`) اضافه کنید.

   {{< /note >}}

   {{< note >}}
   برخی از افزونه‌های شبکه CNI به پیکربندی اضافی نیاز دارند، برای مثال مشخص کردن IP CIDR برای pod، در حالی که برخی دیگر این کار را نمی‌کنند.

به [CNI network documentation](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#pod-network) مراجعه کنید.
برای افزودن یک pod CIDR، علامت `--pod-network-cidr` را وارد کنید، یا اگر از فایل پیکربندی kubeadm استفاده می‌کنید، فیلد `podSubnet` را در زیر شیء `networking` از `ClusterConfiguration` تنظیم کنید.
   {{< /note >}}

   The output looks similar to:

   ```sh
   ...
   You can now join any number of control-plane node by running the following command on each as a root:
       kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866 --control-plane --certificate-key f8902e114ef118304e561c3ecd4d0b543adc226b7a07f675f56564185ffe0c07

   Please note that the certificate-key gives access to cluster sensitive data, keep it secret!
   As a safeguard, uploaded-certs will be deleted in two hours; If necessary, you can use kubeadm init phase upload-certs to reload certs afterward.

   Then you can join any number of worker nodes by running the following on each as root:
       kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866
   ```

   - - این خروجی را در یک فایل متنی کپی کنید. بعداً برای اتصال صفحه کنترل و گره‌های ورکر به خوشه به آن نیاز خواهید داشت.
   - وقتی از `--upload-certs` به همراه `kubeadm init` استفاده می‌شود، گواهی‌های صفحه کنترل اصلی
رمزگذاری شده و در فایل مخفی `kubeadm-certs` بارگذاری می‌شوند.
   - برای بارگذاری مجدد گواهی‌ها و ایجاد کلید رمزگشایی جدید، از دستور زیر در گره‌ای که از قبل به خوشه متصل است، استفاده کنید:

     ```sh
     sudo kubeadm init phase upload-certs --upload-certs
     ```

   - همچنین می‌توانید در طول `init` یک `--certificate-key` سفارشی مشخص کنید که بعداً توسط `join` مورد استفاده قرار گیرد. برای تولید چنین کلیدی می‌توانید از دستور زیر استفاده کنید:

     ```sh
     kubeadm certs certificate-key
     ```

   کلید گواهی یک رشته کدگذاری شده هگز است که یک کلید AES با اندازه ۳۲ بایت است.

   {{< note >}}
   رمز `kubeadm-certs` و کلید رمزگشایی پس از دو ساعت منقضی می‌شوند.
   {{< /note >}}

   {{< caution >}}
   همانطور که در خروجی دستور آمده است، کلید گواهی به داده‌های حساس خوشه دسترسی می‌دهد، آن را مخفی نگه دارید!
   {{< /caution >}}

1. افزونه CNI مورد نظر خود را اعمال کنید:
 [Follow these instructions](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#pod-network)
برای نصب ارائه‌دهنده CNI. مطمئن شوید که پیکربندی با Pod CIDR مشخص شده در فایل پیکربندی kubeadm (در صورت وجود) مطابقت دارد.

   {{< note >}}
شما باید یک افزونه شبکه متناسب با مورد استفاده خود انتخاب کنید و قبل از رفتن به مرحله بعدی، آن را مستقر کنید.
اگر این کار را نکنید، نمی‌توانید خوشه خود را به درستی راه‌اندازی کنید.
   {{< /note >}}

1.  دستور زیر را تایپ کنید و شروع به کار پادهای اجزایcontrol plane  را تماشا کنید:

   ```sh
   kubectl get pod -n kube-system -w
   ```

### مراحل مربوط به بقیهcontrol plane nodes

برای هر ontrol plane nodes اضافی باید:

1.  دستور join که قبلاً توسط خروجی `kubeadm init` به شما داده شده بود را روی گره اول اجرا کنید.

باید چیزی شبیه به این باشد:

   ```sh
   sudo kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866 --control-plane --certificate-key f8902e114ef118304e561c3ecd4d0b543adc226b7a07f675f56564185ffe0c07
   ```

  - پرچم `--control-plane` به `kubeadm join` می‌گوید که یک صفحه کنترل جدید ایجاد کند.

  - دستور `--certificate-key ...` باعث دانلود گواهینامه‌های صفحه کنترل می‌شود.
    از راز `kubeadm-certs` در خوشه و با استفاده از کلید داده شده رمزگشایی شود.

شما می‌توانید چندین گره صفحه کنترل را به صورت موازی به هم متصل کنید.

## گره های etcd خارجی

راه‌اندازی یک خوشه با گره‌های خارجی etcd مشابه روشی است که برای etcd انباشته شده استفاده می‌شود، با این تفاوت که ابتدا باید etcd را راه‌اندازی کنید و اطلاعات etcd را در فایل پیکربندی kubeadm وارد کنید.


### تنظیم  etcd cluster


1. برای راه‌اندازی خوشه etcd، این [instructions](/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/) را دنبال کنید.

1. SSH را طبق توضیحات تنظیم کنید [here](#manual-certs).

1. فایل‌های زیر را از هر گره etcd در خوشه به اولین گره صفحه کنترل کپی کنید:


   ```sh
   export CONTROL_PLANE="ubuntu@10.0.0.7"
   scp /etc/kubernetes/pki/etcd/ca.crt "${CONTROL_PLANE}":
   scp /etc/kubernetes/pki/apiserver-etcd-client.crt "${CONTROL_PLANE}":
   scp /etc/kubernetes/pki/apiserver-etcd-client.key "${CONTROL_PLANE}":
   ```

- مقدار `CONTROL_PLANE` را با `user@host` گره صفحه کنترل اول جایگزین کنید.


### راه اندازی اولین control plane node

1. فایلی با نام `kubeadm-config.yaml` با محتوای زیر ایجاد کنید

   ```yaml
   ---
   apiVersion: kubeadm.k8s.io/v1beta4
   kind: ClusterConfiguration
   kubernetesVersion: stable
   controlPlaneEndpoint: "LOAD_BALANCER_DNS:LOAD_BALANCER_PORT" # change this (see below)
   etcd:
     external:
       endpoints:
         - https://ETCD_0_IP:2379 # change ETCD_0_IP appropriately
         - https://ETCD_1_IP:2379 # change ETCD_1_IP appropriately
         - https://ETCD_2_IP:2379 # change ETCD_2_IP appropriately
       caFile: /etc/kubernetes/pki/etcd/ca.crt
       certFile: /etc/kubernetes/pki/apiserver-etcd-client.crt
       keyFile: /etc/kubernetes/pki/apiserver-etcd-client.key
   ```

   {{< note >}}
تفاوت بین etcd انباشته شده و etcd خارجی در اینجا این است که تنظیم etcd خارجی نیاز به یک فایل پیکربندی با نقاط انتهایی etcd تحت شیء `external` برای `etcd` دارد. در مورد توپولوژی etcd انباشته شده، این به طور خودکار مدیریت می‌شود.

   {{< /note >}}

   - متغیرهای زیر را در الگوی پیکربندی با مقادیر مناسب برای cluster خود جایگزین کنید:

     - `LOAD_BALANCER_DNS`
     - `LOAD_BALANCER_PORT`
     - `ETCD_0_IP`
     - `ETCD_1_IP`
     - `ETCD_2_IP`

مراحل زیر مشابه تنظیمات etcd پشته شده است:


1.دستور `sudo kubeadm init --config kubeadm-config.yaml --upload-certs` را روی این گره اجرا کنید.

1. دستورات اتصال خروجی را که برای استفاده بعدی به یک فایل متنی برگردانده می‌شوند، بنویسید.

1. افزونه CNI مورد نظر خود را اعمال کنید.

   {{< note >}}
شما باید یک افزونه شبکه متناسب با مورد استفاده خود انتخاب کنید و قبل از رفتن به مرحله بعدی، آن را مستقر کنید.
اگر این کار را نکنید، نمی‌توانید خوشه خود را به درستی راه‌اندازی کنید.
   {{< /note >}}

### مراحل مربوط به بقیه  control plane nodes

مراحل همانند تنظیمات etcd پشته شده است:

- مطمئن شوید که اولین control plane node به طور کامل مقداردهی اولیه شده است.
- هرcontrol plane node را با دستور join که در یک فایل متنی ذخیره کرده‌اید، به هم متصل کنید. توصیه می‌شود
- control plane node را یکی یکی به هم متصل کنید.

- فراموش نکنید که کلید رمزگشایی از `--certificate-key` به طور پیش‌فرض پس از دو ساعت منقضی می‌شود.

## کارهای متداول پس از بوت‌استرپ کردن کنترل‌پلن

### نصب  workers

گره‌های Worker می‌توانند با دستوری که قبلاً به عنوان خروجی دستور `kubeadm init` ذخیره کرده‌اید، به خوشه متصل شوند:

```sh
sudo kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866
```

## توزیع دستی گواهی {#manual-certs}


اگر تصمیم دارید از `kubeadm init` با فلگ `--upload-certs` استفاده نکنید، این بدان معناست که شما باید گواهی‌ها را از گره صفحه کنترل اصلی به گره‌های صفحه کنترل متصل‌کننده به صورت دستی کپی کنید.


روش‌های زیادی برای انجام این کار وجود دارد. مثال زیر از `ssh` و `scp` استفاده می‌کند:

اگر می‌خواهید همه گره‌ها را از یک دستگاه واحد کنترل کنید، SSH مورد نیاز است.

1. ssh-agent را روی دستگاه اصلی خود که به تمام گره‌های دیگر در سیستم دسترسی دارد، فعال کنید:

   ```shell
   eval $(ssh-agent)
   ```

1. هویت SSH خود را به جلسه اضافه کنید:

   ```shell
   ssh-add ~/.ssh/path_to_private_key
   ```

1. SSH بین گره‌ها برای بررسی صحت اتصال.


- وقتی به هر گره‌ای SSH می‌کنید، پرچم `-A` را اضافه کنید. این پرچم به گره‌ای که از طریق SSH وارد آن شده‌اید اجازه می‌دهد تا به عامل SSH روی رایانه شما دسترسی پیدا کند. اگر به امنیت جلسه کاربری خود در گره کاملاً اعتماد ندارید، روش‌های جایگزین را در نظر بگیرید.

     ```shell
     ssh -A 10.0.0.7
     ```

- هنگام استفاده از sudo روی هر گره‌ای، مطمئن شوید که محیط را حفظ می‌کنید تا SSH forwarding کار کند:

     ```shell
     sudo -E -s
     ```

1. پس از پیکربندی SSH روی تمام گره‌ها، باید اسکریپت زیر را روی اولین گره صفحه کنترل پس از اجرای `kubeadm init` اجرا کنید. این اسکریپت گواهی‌ها را از اولین گره صفحه کنترل به سایر گره‌های صفحه کنترل کپی می‌کند:

در مثال زیر، عبارت `CONTROL_PLANE_IPS` را با آدرس‌های IP سایر گره‌های صفحه کنترل جایگزین کنید.

   ```sh
   USER=ubuntu # customizable
   CONTROL_PLANE_IPS="10.0.0.7 10.0.0.8"
   for host in ${CONTROL_PLANE_IPS}; do
       scp /etc/kubernetes/pki/ca.crt "${USER}"@$host:
       scp /etc/kubernetes/pki/ca.key "${USER}"@$host:
       scp /etc/kubernetes/pki/sa.key "${USER}"@$host:
       scp /etc/kubernetes/pki/sa.pub "${USER}"@$host:
       scp /etc/kubernetes/pki/front-proxy-ca.crt "${USER}"@$host:
       scp /etc/kubernetes/pki/front-proxy-ca.key "${USER}"@$host:
       scp /etc/kubernetes/pki/etcd/ca.crt "${USER}"@$host:etcd-ca.crt
       # Skip the next line if you are using external etcd
       scp /etc/kubernetes/pki/etcd/ca.key "${USER}"@$host:etcd-ca.key
   done
   ```

   {{< caution >}}
فقط گواهینامه‌های موجود در لیست بالا را کپی کنید. kubeadm بقیه گواهینامه‌ها را به همراه SANهای مورد نیاز برای نمونه‌های اتصال صفحه کنترل تولید خواهد کرد. اگر همه گواهینامه‌ها را به اشتباه کپی کنید، ایجاد گره‌های اضافی ممکن است به دلیل کمبود SANهای مورد نیاز با شکست مواجه شود.

   {{< /caution >}}

1. سپس روی هر گره صفحه کنترل که به آن متصل می‌شوید، باید قبل از اجرای `kubeadm join`، اسکریپت زیر را اجرا کنید.
این اسکریپت گواهی‌های کپی‌شده قبلی را از دایرکتوری خانگی به `/etc/kubernetes/pki` منتقل می‌کند:
   ```sh
   USER=ubuntu # customizable
   mkdir -p /etc/kubernetes/pki/etcd
   mv /home/${USER}/ca.crt /etc/kubernetes/pki/
   mv /home/${USER}/ca.key /etc/kubernetes/pki/
   mv /home/${USER}/sa.pub /etc/kubernetes/pki/
   mv /home/${USER}/sa.key /etc/kubernetes/pki/
   mv /home/${USER}/front-proxy-ca.crt /etc/kubernetes/pki/
   mv /home/${USER}/front-proxy-ca.key /etc/kubernetes/pki/
   mv /home/${USER}/etcd-ca.crt /etc/kubernetes/pki/etcd/ca.crt
   # Skip the next line if you are using external etcd
   mv /home/${USER}/etcd-ca.key /etc/kubernetes/pki/etcd/ca.key
   ```
