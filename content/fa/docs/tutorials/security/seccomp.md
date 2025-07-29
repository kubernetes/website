---
reviewers:
- xirehat
title: محدود کردن فراخوانی‌های سیستمی یک کانتینر با seccomp
content_type: tutorial
weight: 40
min-kubernetes-server-version: v1.22
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.19" state="stable" >}}

Seccomp مخفف *secure computing mode* است و از نسخه 2.6.12 در هسته لینوکس وجود دارد.  
می‌توان از آن برای سندباکس کردن سطح دسترسی یک فرایند استفاده کرد و فراخوانی‌هایی را که این فرایند از فضای کاربری به هسته انجام می‌دهد محدود نمود.  
کوبرنتیز به شما اجازه می‌دهد پروفایل‌های seccomp بارگذاری‌شده روی یک
{{< glossary_tooltip text="node" term_id="node" >}}
را به‌صورت خودکار روی پادها و کانتینرهایتان اعمال کنید.

تشخیص مجوزهای موردنیاز برای بارهای کاری می‌تواند دشوار باشد. در این آموزش می‌آموزید چگونه پروفایل‌های seccomp را در یک خوشه محلی کوبرنتیز بارگذاری کنید، آن‌ها را به یک پاد اعمال کنید و پروفایل‌هایی بسازید که فقط دسترسی‌های لازم را به فرایندهای کانتینری بدهند.

## {{% heading "objectives" %}}

* یاد بگیرید چگونه پروفایل‌های seccomp را روی یک گره بارگذاری کنید
* یاد بگیرید چگونه یک پروفایل seccomp را روی یک کانتینر اعمال کنید
* مشاهده ممیزی فراخوان‌های سیستمیِ انجام‌شده توسط فرایند کانتینر
* مشاهده رفتار زمانی که یک پروفایلِ موجود نیست مشخص می‌شود
* مشاهده نقض یک پروفایل seccomp
* یاد بگیرید چگونه پروفایل‌های seccomp دقیق و جزئی بسازید
* یاد بگیرید چگونه پروفایل seccomp پیش‌فرض زمان‌اجرای کانتینر را اعمال کنید

## {{% heading "prerequisites" %}}

برای انجام همه مراحل این آموزش باید [kind](/docs/tasks/tools/#kind) و [kubectl](/docs/tasks/tools/#kubectl) را نصب کنید.

دستورات استفاده‌شده در این راهنما فرض می‌کنند که شما از
[Docker](https://www.docker.com/)
به‌عنوان زمان‌اجرای کانتینر استفاده می‌کنید (خوشهی که `kind` می‌سازد ممکن است درونی از زمان‌اجرای دیگری استفاده کند).  
می‌توانید از [Podman](https://podman.io/) نیز بهره ببرید، اما در آن صورت باید طبق
[دستورالعمل‌های ویژه](https://kind.sigs.k8s.io/docs/user/rootless/)
عمل کنید تا کارها با موفقیت انجام شوند.

این آموزش نمونه‌هایی را نشان می‌دهد که برخی هنوز در وضعیت بتا هستند (از v1.25) و برخی دیگر از قابلیت‌های seccomp عمومی استفاده می‌کنند. اطمینان حاصل کنید که خوشه شما برای نسخه‌ای که استفاده می‌کنید
[به‌درستی پیکربندی شده باشد](https://kind.sigs.k8s.io/docs/user/quick-start/#setting-kubernetes-version).

در این آموزش برای بارگیری مثال‌ها از ابزار `curl` استفاده می‌شود؛ اگر مایلید می‌توانید از ابزار دیگری استفاده کنید.

{{< note >}}
امکان اعمال یک پروفایل seccomp به کانتینری که در `securityContext` آن
`privileged: true`
تنظیم شده نیست. کانتینرهای *privileged* همیشه با حالت `Unconfined` اجرا می‌شوند.
{{< /note >}}

<!-- steps -->

## دانلود پروفایل‌های نمونه seccomp {#download-profiles}

محتوای این پروفایل‌ها را بعداً بررسی خواهیم کرد، اما فعلاً آن‌ها را در پوشه‌ای به نام `profiles/` دانلود کنید تا بتوان در خوشه بارگذاری‌شان کرد.

{{< tabs name="tab_with_code" >}}
{{< tab name="audit.json" >}}
{{% code_sample file="pods/security/seccomp/profiles/audit.json" %}}
{{< /tab >}}
{{< tab name="violation.json" >}}
{{% code_sample file="pods/security/seccomp/profiles/violation.json" %}}
{{< /tab >}}
{{< tab name="fine-grained.json" >}}
{{% code_sample file="pods/security/seccomp/profiles/fine-grained.json" %}}
{{< /tab >}}
{{< /tabs >}}

این دستورات را اجرا کنید:

```shell
mkdir ./profiles
curl -L -o profiles/audit.json https://k8s.io/examples/pods/security/seccomp/profiles/audit.json
curl -L -o profiles/violation.json https://k8s.io/examples/pods/security/seccomp/profiles/violation.json
curl -L -o profiles/fine-grained.json https://k8s.io/examples/pods/security/seccomp/profiles/fine-grained.json
ls profiles
```

در پایان مرحله آخر باید سه پروفایل را مشاهده کنید:
```
audit.json  fine-grained.json  violation.json
```

## ایجاد یک خوشه محلی کوبرنتیز با kind

برای سادگی، می‌توان از [kind](https://kind.sigs.k8s.io/) برای ایجاد یک خوشه تک‌گره‌ای استفاده کرد که پروفایل‌های seccomp در آن بارگذاری شده‌اند. kind کوبرنتیز را داخل Docker اجرا می‌کند، بنابراین هر گره خوشه یک کانتینر است. این امکان فراهم می‌شود که فایل‌ها در فایل‌سیستم هر کانتینر سوار (mount) شوند، مشابهِ بارگذاری فایل‌ها روی یک گره.

{{% code_sample file="pods/security/seccomp/kind.yaml" %}}

پیکربندی kind نمونه را بارگیری کنید و آن را در فایلی با نام `kind.yaml` ذخیره کنید:
```shell
curl -L -O https://k8s.io/examples/pods/security/seccomp/kind.yaml
```

می‌توانید با تعیین ایمیج کانتینرِ گره، نسخه مشخصی از Kubernetes را تنظیم کنید.  
برای جزئیات بیشتر، به بخش [Nodes](https://kind.sigs.k8s.io/docs/user/configuration/#nodes) در مستندات kind درباره پیکربندی مراجعه کنید.  
این آموزش فرض می‌کند که شما از Kubernetes {{< param "version" >}} استفاده می‌کنید.

به عنوان یک قابلیت بتا، می‌توانید Kubernetes را طوری پیکربندی کنید که به‌جای بازگشت به `Unconfined`، از پروفایلی که
{{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}
به طور پیش‌فرض ترجیح می‌دهد استفاده کند.  
اگر می‌خواهید این کار را امتحان کنید، پیش از ادامه، بخش
[فعالسازی استفاده از `RuntimeDefault` به عنوان پروفایل پیش‌فرض seccomp برای همه کارها](#enable-the-use-of-runtimedefault-as-the-default-seccomp-profile-for-all-workloads)
را ببینید.

پس از آن‌که پیکربندی kind را آماده کردید، خوشه kind را با همان پیکربندی ایجاد کنید:

```shell
kind create cluster --config=kind.yaml
```

پس از آماده شدن خوشه جدید Kubernetes، کانتینر Docker در حال اجرا را به عنوان خوشه تک گره‌ای شناسایی کنید:

```shell
docker ps
```

باید خروجی را ببینید که نشان می‌دهد یک کانتینر با نام `kind-control-plane` در حال اجرا است. خروجی مشابه زیر است:

```
CONTAINER ID        IMAGE                  COMMAND                  CREATED             STATUS              PORTS                       NAMES
6a96207fed4b        kindest/node:v1.18.2   "/usr/local/bin/entr…"   27 seconds ago      Up 24 seconds       127.0.0.1:42223->6443/tcp   kind-control-plane
```

اگر فایل‌سیستم آن کانتینر را بررسی کنید، باید ببینید که پوشه `profiles/` با موفقیت در مسیر پیش‌فرض seccomp مربوط به kubelet بارگذاری شده است. از `docker exec` برای اجرای یک دستور در پاد استفاده کنید:

```shell
# 6a96207fed4b را به شناسه کانتینری که در "docker ps" دیدید، تغییر دهید.
docker exec -it 6a96207fed4b ls /var/lib/kubelet/seccomp/profiles
```

```
audit.json  fine-grained.json  violation.json
```

شما تأیید کرده‌اید که این پروفایل‌های seccomp برای kubelet که در kind اجرا می‌شود در دسترس هستند.

## ایجاد یک پاد که از پروفایل seccomp پیش‌فرض زمان‌اجرای کانتینر استفاده می‌کند

بیشتر زمان‌اجرای‌های کانتینر مجموعه‌ای معقول از syscalls مجاز یا غیرمجاز را فراهم می‌کنند.  
می‌توانید با قرار دادن نوع seccomp در `securityContext` پاد یا کانتینر روی `RuntimeDefault`,
این پیش‌فرض‌ها را برای بار کاری خود به کار بگیرید.

{{< note >}}
اگر پیکربندی `seccompDefault`
[کوبه‌لت](/docs/reference/config-api/kubelet-config.v1beta1/) را فعال کرده باشید،
پاد‌ها هر زمان که پروفایل seccomp دیگری مشخص نشده باشد از پروفایل `RuntimeDefault`
استفاده می‌کنند. در غیر این صورت، مقدار پیش‌فرض `Unconfined` است.
{{< /note >}}

در این‌جا یک مانیفست برای پادی آمده است که برای همه کانتینرهای خود پروفایل seccomp
`RuntimeDefault` را درخواست می‌کند:

{{% code_sample file="pods/security/seccomp/ga/default-pod.yaml" %}}

این پاد را ایجاد کنید:
```shell
kubectl apply -f https://k8s.io/examples/pods/security/seccomp/ga/default-pod.yaml
```

```shell
kubectl get pod default-pod
```

پاد باید با موفقیت شروع به کار کرده باشد:
```
NAME        READY   STATUS    RESTARTS   AGE
default-pod 1/1     Running   0          20s
```

قبل از رفتن به بخش بعدی، Pod را حذف کنید:

```shell
kubectl delete pod default-pod --wait --now
```

## ایجاد یک پاد با پروفایل seccomp برای ممیزی فراخوان‌های سیستمی

در ابتدا، پروفایل `audit.json` را که تمام فراخوان‌های سیستمیِ فرایند را لاگ می‌کند
به یک پاد جدید اعمال کنید.

در این‌جا مانیفست آن پاد آمده است:

{{% code_sample file="pods/security/seccomp/ga/audit-pod.yaml" %}}

{{< note >}}
در نسخه‌های قدیمی‌تر Kubernetes می‌توانستید رفتار seccomp را با استفاده از
{{< glossary_tooltip text="annotations" term_id="annotation" >}} پیکربندی کنید.
Kubernetes {{< skew currentVersion >}} فقط استفاده از فیلدهای درون
`.spec.securityContext` را برای پیکربندی seccomp پشتیبانی می‌کند و این
آموزش همین روش را توضیح می‌دهد.
{{< /note >}}

پاد را در خوشه ایجاد کنید:

```shell
kubectl apply -f https://k8s.io/examples/pods/security/seccomp/ga/audit-pod.yaml
```

این پروفایل هیچ فراخوانی سیستمی را محدود نمی‌کند، بنابراین Pod باید با موفقیت شروع به کار کند.

```shell
kubectl get pod audit-pod
```

```
NAME        READY   STATUS    RESTARTS   AGE
audit-pod   1/1     Running   0          30s
```

برای آن‌که بتوانید با این نقطه پایانی که توسط این کانتینر در دسترس قرار گرفته است تعامل کنید،
یک NodePort {{< glossary_tooltip text="Service" term_id="service" >}} ایجاد کنید که
دسترسی به این نقطه پایانی را از داخل کانتینر control plane در kind امکان‌پذیر کند.

```shell
kubectl expose pod audit-pod --type NodePort --port 5678
```

بررسی کنید که چه پورتی به سرویس روی گره اختصاص داده شده است.

```shell
kubectl get service audit-pod
```

خروجی مشابه زیر است:
```
NAME        TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
audit-pod   NodePort   10.111.36.142   <none>        5678:32373/TCP   72s
```

اکنون می‌توانید با استفاده از `curl` از داخل کانتینر control plane در kind به آن
نقطه پایانی در پورتی که این Service در معرض قرار داده است دسترسی پیدا کنید.  
از `docker exec` استفاده کنید تا فرمان `curl` را درون همان کانتینر control plane اجرا کنید:

```shell
# عدد 6a96207fed4b را به شناسه کانتینر صفحه کنترل و عدد 32373 را به شماره پورتی که در "docker ps" مشاهده کردید، تغییر دهید.
docker exec -it 6a96207fed4b curl localhost:32373
```

```
just made some syscalls!
```

می‌توانید ببینید که فرایند در حال اجراست؛ اما دقیقاً چه فراخوان‌های سیستمی انجام داده است؟  
از آنجا که این پاد در یک خوشه محلی اجرا می‌شود، باید بتوانید این فراخوان‌ها را در
`/var/log/syslog` روی سیستم محلی خود مشاهده کنید. یک پنجره ترمینال جدید باز کنید و با دستور `tail`
خروجی مربوط به فراخوان‌های `http-echo` را بررسی کنید:

```shell
# مسیر گزارش در رایانه شما ممکن است با "/var/log/syslog" متفاوت باشد.
tail -f /var/log/syslog | grep 'http-echo'
```

شما باید از قبل برخی از لاگ‌های مربوط به فراخوانی‌های سیستمی انجام شده توسط `http-echo` را مشاهده کنید، و اگر `curl` را دوباره درون کانتینر صفحه کنترل اجرا کنید، خروجی‌های بیشتری را که در لاگ نوشته شده‌اند، خواهید دید.

For example:
```
Jul  6 15:37:40 my-machine kernel: [369128.669452] audit: type=1326 audit(1594067860.484:14536): auid=4294967295 uid=0 gid=0 ses=4294967295 pid=29064 comm="http-echo" exe="/http-echo" sig=0 arch=c000003e syscall=51 compat=0 ip=0x46fe1f code=0x7ffc0000
Jul  6 15:37:40 my-machine kernel: [369128.669453] audit: type=1326 audit(1594067860.484:14537): auid=4294967295 uid=0 gid=0 ses=4294967295 pid=29064 comm="http-echo" exe="/http-echo" sig=0 arch=c000003e syscall=54 compat=0 ip=0x46fdba code=0x7ffc0000
Jul  6 15:37:40 my-machine kernel: [369128.669455] audit: type=1326 audit(1594067860.484:14538): auid=4294967295 uid=0 gid=0 ses=4294967295 pid=29064 comm="http-echo" exe="/http-echo" sig=0 arch=c000003e syscall=202 compat=0 ip=0x455e53 code=0x7ffc0000
Jul  6 15:37:40 my-machine kernel: [369128.669456] audit: type=1326 audit(1594067860.484:14539): auid=4294967295 uid=0 gid=0 ses=4294967295 pid=29064 comm="http-echo" exe="/http-echo" sig=0 arch=c000003e syscall=288 compat=0 ip=0x46fdba code=0x7ffc0000
Jul  6 15:37:40 my-machine kernel: [369128.669517] audit: type=1326 audit(1594067860.484:14540): auid=4294967295 uid=0 gid=0 ses=4294967295 pid=29064 comm="http-echo" exe="/http-echo" sig=0 arch=c000003e syscall=0 compat=0 ip=0x46fd44 code=0x7ffc0000
Jul  6 15:37:40 my-machine kernel: [369128.669519] audit: type=1326 audit(1594067860.484:14541): auid=4294967295 uid=0 gid=0 ses=4294967295 pid=29064 comm="http-echo" exe="/http-echo" sig=0 arch=c000003e syscall=270 compat=0 ip=0x4559b1 code=0x7ffc0000
Jul  6 15:38:40 my-machine kernel: [369188.671648] audit: type=1326 audit(1594067920.488:14559): auid=4294967295 uid=0 gid=0 ses=4294967295 pid=29064 comm="http-echo" exe="/http-echo" sig=0 arch=c000003e syscall=270 compat=0 ip=0x4559b1 code=0x7ffc0000
Jul  6 15:38:40 my-machine kernel: [369188.671726] audit: type=1326 audit(1594067920.488:14560): auid=4294967295 uid=0 gid=0 ses=4294967295 pid=29064 comm="http-echo" exe="/http-echo" sig=0 arch=c000003e syscall=202 compat=0 ip=0x455e53 code=0x7ffc0000
```

می‌توانید با نگاه‌کردن به ورودی `syscall=` در هر خط، شروع به درک فراخوان‌های سیستمی موردنیاز برای فرایند `http-echo` کنید. گرچه این‌ها به‌احتمال زیاد همه فراخوان‌های سیستمیِ مورد استفاده را در بر نمی‌گیرند، اما می‌توانند مبنایی برای ایجاد یک پروفایل seccomp برای این کانتینر باشند.

پیش از رفتن به بخش بعدی، Service و Pod را حذف کنید:

```shell
kubectl delete service audit-pod --wait
kubectl delete pod audit-pod --wait --now
```

## ایجاد یک پاد با پروفایل seccomp که موجب نقض می‌شود

برای نمایش، پروفایلی را به پاد اعمال کنید که هیچ فراخوان سیستمی را مجاز نمی‌کند.

مانیفست این دموی آموزشی به شکل زیر است:

{{% code_sample file="pods/security/seccomp/ga/violation-pod.yaml" %}}

تلاش کنید پاد را در خوشه ایجاد کنید:

```shell
kubectl apply -f https://k8s.io/examples/pods/security/seccomp/ga/violation-pod.yaml
```

پاد ایجاد می‌شود، اما مشکلی وجود دارد. اگر وضعیت پاد را بررسی کنید، باید ببینید که شروع به کار نکرده است.

```shell
kubectl get pod violation-pod
```

```
NAME            READY   STATUS             RESTARTS   AGE
violation-pod   0/1     CrashLoopBackOff   1          6s
```

همان‌طور که در مثال قبلی دیدید، فرایند `http-echo` به فراخوان‌های سیستمی نسبتاً زیادی نیاز دارد.
در این‌جا با تنظیم `"defaultAction": "SCMP_ACT_ERRNO"` به seccomp دستور داده شده است
که برای هر فراخوان سیستمی خطا برگرداند. این رویکرد از نظر امنیتی بسیار سخت‌گیرانه است،
اما امکان انجام هر عمل معناداری را سلب می‌کند. آنچه واقعاً می‌خواهید این است که به بارهای کاری
فقط دسترسی‌های موردنیازشان را بدهید.

پیش از رفتن به بخش بعدی، پاد را حذف کنید:

```shell
kubectl delete pod violation-pod --wait --now
```

## ایجاد یک پاد با پروفایل seccomp که فقط فراخوان‌های سیستمی لازم را مجاز می‌کند

اگر به پروفایل `fine-grained.json` نگاهی بیندازید، برخی از فراخوان‌های سیستمی‌ای را خواهید دید که در syslogِ مثال اول—جایی که `"defaultAction": "SCMP_ACT_LOG"` تنظیم شده بود—مشاهده کردید.  
اکنون این پروفایل مقدار `"defaultAction": "SCMP_ACT_ERRNO"` را تعیین می‌کند، اما مجموعه‌ای از فراخوان‌های سیستمی را به‌طور صریح در بلوک `"action": "SCMP_ACT_ALLOW"` مجاز اعلام می‌کند. در حالت ایده‌آل، کانتینر بدون مشکل اجرا می‌شود و هیچ پیامی به `syslog` ارسال نخواهد شد.

مانیفست این مثال به شکل زیر است:

{{% code_sample file="pods/security/seccomp/ga/fine-pod.yaml" %}}

پاد را در خوشه خود ایجاد کنید:

```shell
kubectl apply -f https://k8s.io/examples/pods/security/seccomp/ga/fine-pod.yaml
```

```shell
kubectl get pod fine-pod
```

پاد باید با موفقیت شروع به کار کرده باشد:
```
NAME        READY   STATUS    RESTARTS   AGE
fine-pod   1/1     Running   0          30s
```

یک پنجره ترمینال جدید باز کنید و از `tail` برای نظارت بر ورودی‌های لاگ که به فراخوانی‌های `http-echo` اشاره می‌کنند، استفاده کنید:

```shell
# مسیر گزارش در رایانه شما ممکن است با "/var/log/syslog" متفاوت باشد.
tail -f /var/log/syslog | grep 'http-echo'
```

در مرحله بعد، Pod را با یک سرویس NodePort در معرض نمایش قرار دهید:

```shell
kubectl expose pod fine-pod --type NodePort --port 5678
```

بررسی کنید که چه پورتی به سرویس روی گره اختصاص داده شده است:

```shell
kubectl get service fine-pod
```

خروجی مشابه زیر است:
```
NAME        TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
fine-pod    NodePort   10.111.36.142   <none>        5678:32373/TCP   72s
```

برای دسترسی به آن نقطه پایانی از داخل کانتینر صفحه کنترل نوع، از `curl` استفاده کنید:

```shell
# عدد 6a96207fed4b را به شناسه کانتینر صفحه کنترل و عدد 32373 را به شماره پورتی که در "docker ps" مشاهده کردید، تغییر دهید.
docker exec -it 6a96207fed4b curl localhost:32373
```

```
just made some syscalls!
```

نباید هیچ خروجی‌ای در `syslog` مشاهده کنید. دلیلش این است که پروفایل همه فراخوان‌های سیستمی ضروری را مجاز کرده و تعیین ‌کرده است اگر فراخوانی خارج از این فهرست انجام شود خطا رخ دهد. از دیدگاه امنیتی، این وضعیت ایده‌آلی است؛ ولی برای رسیدن به آن باید زمان و تلاش صرف تحلیل برنامه می‌شد. عالی می‌شد اگر راه ساده‌تری برای نزدیک‌شدن به این سطح امنیت بدون این‌همه تلاش وجود داشت.

پیش از رفتن به بخش بعدی، Service و Pod را حذف کنید:

```shell
kubectl delete service fine-pod --wait
kubectl delete pod fine-pod --wait --now
```

## فعال‌سازی استفاده از `RuntimeDefault` به‌عنوان پروفایل seccomp پیش‌فرض برای همه بارهای کاری

{{< feature-state state="stable" for_k8s_version="v1.27" >}}

برای بهره‌گیری از پیش‌فرض‌گذاریِ پروفایل seccomp، باید برای هر گره‌ای که می‌خواهید از این قابلیت استفاده کند، kubelet را با فلگ خط فرمان
`--seccomp-default`
[command line flag](/docs/reference/command-line-tools-reference/kubelet)
اجرا کنید.

اگر این قابلیت فعال شود، kubelet به‌طور پیش‌فرض از پروفایل seccomp با نام `RuntimeDefault` که توسط زمان‌اجرای کانتینر تعریف می‌شود استفاده خواهد کرد و دیگر حالت `Unconfined` (غیرفعال بودن seccomp) به کار نمی‌رود.
پروفایل‌های پیش‌فرض در تلاش‌اند مجموعه‌ای قدرتمند از تنظیمات امنیتی را بدون لطمه به کارکرد بار کاری فراهم کنند.
ممکن است این پروفایل‌های پیش‌فرض در میان زمان‌اجرای‌های کانتینر و نسخه‌های انتشار آن‌ها (برای نمونه CRI-O و containerd) متفاوت باشند.

{{< note >}}
فعالسازی این قابلیت، فیلد API مربوط به `securityContext.seccompProfile` در Kubernetes را تغییر نداده و annotationهای منسوخ‌شده بار کاری را نیز اضافه نمی‌کند.  
به این ترتیب، کاربران هر زمان که بخواهند می‌توانند بدون تغییر واقعی در پیکربندی بار کاری به وضعیت قبلی بازگردند.  
برای اطمینان از این‌که یک کانتینر از کدام پروفایل seccomp استفاده می‌کند، می‌توان از ابزارهایی همچون
[`crictl inspect`](https://github.com/kubernetes-sigs/cri-tools) بهره برد.
{{< /note >}}

برخی بارهای کاری ممکن است به محدودیت‌های کمتری بر روی فراخوان‌های سیستمی نیاز داشته باشند؛ بنابراین حتی با پروفایل `RuntimeDefault` نیز ممکن است در زمان اجرا با خطا مواجه شوند. برای رفع این مشکل می‌توانید:

- بار کاری را صراحتاً با حالت `Unconfined` اجرا کنید.
- قابلیت `SeccompDefault` را برای گره‌ها غیرفعال کنید و اطمینان یابید که بارهای کاری روی گره‌هایی زمان‌بندی شوند که این قابلیت غیرفعال است.
- یک پروفایل seccomp سفارشی برای بار کاری ایجاد کنید.

اگر قصد دارید این قابلیت را در یک خوشه شبیه محیط تولید فعال کنید، پروژه Kubernetes توصیه می‌کند ابتدا این درگاه قابلیت (feature gate) را بر روی زیرمجموعه‌ای از گره‌ها فعال کرده و پس از آزمایش اجرای بارهای کاری، آن را در کل خوشه گسترش دهید.

اطلاعات مفصل‌تر درباره راهبرد ارتقا و بازگشت (downgrade) را می‌توانید در پیشنهاد تکمیلی Kubernetes (KEP) مرتبط بیابید:
[Enable seccomp by default](https://github.com/kubernetes/enhancements/tree/9a124fd29d1f9ddf2ff455c49a630e3181992c25/keps/sig-node/2413-seccomp-by-default#upgrade--downgrade-strategy).

Kubernetes {{< skew currentVersion >}} اجازه می‌دهد پروفایل seccompی را پیکربندی کنید که در صورت تعریف‌نشدن پروفایل مشخص در spec پاد اعمال می‌شود؛ با این حال همچنان باید این پیش‌فرض‌گذاری را برای هر گره‌ای که می‌خواهید فعال کنید.

اگر از خوشه Kubernetes {{< skew currentVersion >}} استفاده می‌کنید و می‌خواهید این قابلیت را فعال کنید، یا kubelet را با فلگ خط فرمان `--seccomp-default` اجرا کنید، یا آن را از طریق [فایل پیکربندی kubelet](/docs/tasks/administer-cluster/kubelet-config-file/) فعال سازید.  
برای فعال‌کردن این درگاه قابلیت در [kind](https://kind.sigs.k8s.io)، مطمئن شوید که `kind` نسخه حداقل موردنیاز Kubernetes را فراهم می‌کند و قابلیت `SeccompDefault` را
[در پیکربندی kind](https://kind.sigs.k8s.io/docs/user/quick-start/#enable-feature-gates-in-your-cluster)
فعال کرده است:

```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
  - role: control-plane
    image: kindest/node:v1.28.0@sha256:9f3ff58f19dcf1a0611d11e8ac989fdb30a28f40f236f59f0bea31fb956ccf5c
    kubeadmConfigPatches:
      - |
        kind: JoinConfiguration
        nodeRegistration:
          kubeletExtraArgs:
            seccomp-default: "true"
  - role: worker
    image: kindest/node:v1.28.0@sha256:9f3ff58f19dcf1a0611d11e8ac989fdb30a28f40f236f59f0bea31fb956ccf5c
    kubeadmConfigPatches:
      - |
        kind: JoinConfiguration
        nodeRegistration:
          kubeletExtraArgs:
            seccomp-default: "true"
```

اگر خوشه آماده باشد، آنگاه یک پاد اجرا می‌شود:

```shell
kubectl run --rm -it --restart=Never --image=alpine alpine -- sh
```

اکنون باید پروفایل پیش‌فرض seccomp پیوست شده باشد. این موضوع را می‌توان با استفاده از `docker exec` برای اجرای `crictl inspect` برای کانتینر روی worker نوع تأیید کرد:

```shell
docker exec -it kind-worker bash -c \
    'crictl inspect $(crictl ps --name=alpine -q) | jq .info.runtimeSpec.linux.seccomp'
```

```json
{
  "defaultAction": "SCMP_ACT_ERRNO",
  "architectures": ["SCMP_ARCH_X86_64", "SCMP_ARCH_X86", "SCMP_ARCH_X32"],
  "syscalls": [
    {
      "names": ["..."]
    }
  ]
}
```

## {{% heading "whatsnext" %}}

می‌توانید درباره seccomp در لینوکس بیشتر بیاموزید:

* [مروری بر seccomp](https://lwn.net/Articles/656307/)
* [پروفایل‌های امنیتی seccomp برای Docker](https://docs.docker.com/engine/security/seccomp/)
