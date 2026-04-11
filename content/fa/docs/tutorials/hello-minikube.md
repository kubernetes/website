---
title: سلام Minikube
content_type: tutorial
weight: 5
card:
name: tutorials
weight: 10
----------

<!-- overview -->

این آموزش به شما نشان می‌دهد چگونه یک برنامه نمونه را روی کوبرنتیز با استفاده از minikube اجرا کنید.
این آموزش یک ایمیج کانتینری ارائه می‌دهد که از NGINX برای بازگرداندن تمامی درخواست‌ها استفاده می‌کند.

## {{% heading "objectives" %}}

* استقرار یک برنامه نمونه روی minikube
* اجرای برنامه
* مشاهده لاگ‌های برنامه

## {{% heading "prerequisites" %}}

این آموزش فرض می‌کند که شما قبلا `minikube` را راه‌اندازی کرده‌اید.
برای دستورالعمل نصب، __مرحله ۱__ در صفحه [minikube start](https://minikube.sigs.k8s.io/docs/start/) را ببینید.

{{< note >}}
فقط دستورهای __مرحله ۱__، را برای __نصب__ اجرا کنید. مراحل دیگر در همین صفحه توضیح داده شده‌اند.
{{< /note >}}

همچنین باید `kubectl` را نصب کنید.
برای دستورالعمل نصب، صفحه [Install tools](/docs/tasks/tools/#kubectl) را ببینید.

<!-- lessoncontent -->

## ساخت یک کلاستر minikube

```shell
minikube start
```

## باز کردن داشبورد

داشبورد کوبرنتیز را باز کنید. دو روش برای انجام این کار وجود دارد:

{{< tabs name="dashboard" >}}
{{% tab name="مرورگر خود را باز کنید" %}}
یک ترمینال **جدید** باز کنید و دستور زیر را اجرا کنید:

```shell
# Start a new terminal, and leave this running.
minikube dashboard
```

اکنون به ترمینالی که `minikube start` را اجرا کرده بودید برگردید.

{{< note >}}
دستور `dashboard` افزونه داشبورد را فعال می‌کند و یک پراکسی باز کرده و داشبورد را در مرورگر پیش‌فرض شما نمایش می‌دهد.
در داشبورد می‌توانید منابعی مثل Deployment و Service ایجاد کنید.

برای اینکه بدون باز شدن خودکار مرورگر و فقط آدرس داشبورد را دریافت کنید، تب "کپی و جایگذاری URL" را ببینید.

به طور پیش‌فرض، داشبورد فقط از داخل شبکه داخلی کوبرنتیز قابل دسترسی است.
دستور `dashboard` یک پراکسی موقت برای دسترسی از بیرون ایجاد می‌کند.

برای متوقف کردن پراکسی، کلید `Ctrl+C` را بزنید.
پس از خروج، داشبورد همچنان روی کلاستر اجرا می‌شود و فقط پراکسی قطع می‌شود.
در صورت نیاز می‌توانید دوباره دستور `dashboard` را اجرا کنید.
{{< /note >}}

{{% /tab %}}
{{% tab name="کپی و جایگذاری URL" %}}

اگر نمی‌خواهید minikube مرورگر را باز کند، زیر دستور `dashboard` از فلگ `--url` استفاده کنید.
`minikube` یک آدرس URL نمایش می‌دهد که شما می‌توانید در مرورگر دلخواه باز کنید.

یک ترمینال **جدید** باز کنید و اجرا کنید:

```shell
# یک ترمینال جدید راه‌اندازی کنید و این را در حال اجرا رها کنید..
minikube dashboard --url
```

حالا می‌توانید از این URL استفاده کنید و به ترمینالی که `minikube start` را اجرا کرده بودید برگردید.

{{% /tab %}}
{{< /tabs >}}

## ساخت Deployment

یک [*Pod*](/docs/concepts/workloads/pods/) گروهی از یک یا چند کانتینر است که برای مدیریت و شبکه‌سازی به هم مرتبط هستند.
پاد این آموزش فقط یک کانتینر دارد.
[*Deployment*](/docs/concepts/workloads/controllers/deployment/) وضعیت سلامت پاد را بررسی کرده و اگر خراب شود، آن را مجدداً اجرا می‌کند.
Deployment روش پیشنهادی برای ساخت و مقیاس‌دهی پادهاست.

1. از دستور `kubectl create` برای ایجاد یک Deployment که یک پاد را مدیریت می‌کند، استفاده کنید. پاد یک کانتینر را بر اساس Docker image ارائه شده اجرا می‌کند.:

   ```shell
   # یک image آزمایشی که شامل یک وب سرور است را اجرا کنید
   kubectl create deployment hello-node --image=registry.k8s.io/e2e-test-images/agnhost:2.39 -- /agnhost netexec --http-port=8080
   ```

1. مشاهده Deployment:

   ```shell
   kubectl get deployments
   ```

   خروجی مشابه موارد زیر است:

   ```
   NAME         READY   UP-TO-DATE   AVAILABLE   AGE
   hello-node   1/1     1            1           1m
   ```

   (ممکن است کمی زمان ببرد تا پاد آماده شود. اگر `0/1` دیدید، چند ثانیه بعد دوباره امتحان کنید.)

1. مشاهده Pod:

   ```shell
   kubectl get pods
   ```

   خروجی مشابه موارد زیر است:

   ```
   NAME                          READY     STATUS    RESTARTS   AGE
   hello-node-5f76cf6ccf-br9b5   1/1       Running   0          1m
   ```

1. مشاهده رویدادهای کلاستر:

   ```shell
   kubectl get events
   ```

1. مشاهده پیکربندی `kubectl`:

   ```shell
   kubectl config view
   ```

1. مشاهده لاگ کانتینر داخل پاد (نام پاد را با نامی که از `kubectl get pods` دریافت کرده‌اید، جایگزین کنید.):

   {{< note >}}
   نام `hello-node-5f76cf6ccf-br9b5` را با خروجی دستور `kubectl get pods` جایگزین کنید.
   {{< /note >}}

   ```shell
   kubectl logs hello-node-5f76cf6ccf-br9b5
   ```

   خروجی مشابه موارد زیر است:

   ```
   I0911 09:19:26.677397       1 log.go:195] Started HTTP server on port 8080
   I0911 09:19:26.677586       1 log.go:195] Started UDP server on port  8081
   ```

{{< note >}}
برای اطلاعات بیشتر در مورد دستورهای `kubectl`، صفحه [مرور کلی kubectl](/docs/reference/kubectl/) را ببینید.
{{< /note >}}

## ساخت Service

به طور پیش‌فرض، Pod فقط از طریق آدرس IP داخلی خود در داخل کلاستر کوبرنتیز قابل دسترسی است.
 برای اینکه کانتینر `hello-node` از خارج از شبکه مجازی کوبرنتیز قابل دسترسی باشد، باید Pod را به عنوان یک [*Service*](/docs/concepts/services-networking/service/) کوبرنتیز expose کنید.

{{< warning >}}
کانتینر agnhost یک اندپوینت `/shell` دارد که برای اشکال‌زدایی(debuggin) مفید است، اما expose کردن آن در اینترنت عمومی خطرناک است.
این را روی یک کلاستر متصل به اینترنت یا یک کلاستر عملیاتی اجرا نکنید.
{{< /warning >}}

1. با استفاده از دستور `kubectl expose`، پاد را در اینترنت عمومی expose کنید:

   ```shell
   kubectl expose deployment hello-node --type=LoadBalancer --port=8080
   ```

`--type=LoadBalancer` نشان می‌دهد که شما می‌خواهید سرویس خود را در خارج از کلاستر expose کنید.

کد برنامه درون image آزمایشی فقط به پورت TCP 8080 گوش می‌دهد. اگر از `kubectl expose` برای expose کردن پورت دیگری استفاده می‌کردید، کلاینت‌ها نمی‌توانستند به آن پورت دیگر متصل شوند.

2. مشاهده Service که ایجاد کرده‌اید:

   ```shell
   kubectl get services
   ```

   خروجی مشابه موارد زیر است:

   ```
   NAME         TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
   hello-node   LoadBalancer   10.108.144.78   <pending>     8080:30369/TCP   21s
   kubernetes   ClusterIP      10.96.0.1       <none>        443/TCP          23m
   ```

در ارائه‌دهندگان ابری که از متعادل‌کننده‌های بار(Load Balancers) پشتیبانی می‌کنند، یک آدرس IP خارجی برای دسترسی به سرویس فراهم می‌شود. در minikube، نوع `LoadBalancer` سرویس را از طریق دستور `minikube service` قابل دسترسی می‌کند.

3. دستور زیر را اجرا کنید:

   ```shell
   minikube service hello-node
   ```

   این دستور مرورگر را باز می‌کند و پاسخ برنامه را نمایش می‌دهد.

## فعال‌سازی افزونه‌ها

ابزار minikube شامل مجموعه‌ای از {{< glossary_tooltip text="افزونه‌‌" term_id="addons" >}}‌های داخلی است که می‌توانند در محیط محلی کوبرنتیز فعال، غیرفعال و باز شوند.

1. افزونه‌های پشتیبانی‌شده‌ی فعلی را فهرست کنید:

   ```shell
   minikube addons list
   ```

   خروجی مشابه موارد زیر است:

   ```
    addon-manager: enabled
    dashboard: enabled
    default-storageclass: enabled
    efk: disabled
    freshpod: disabled
    gvisor: disabled
    helm-tiller: disabled
    ingress: disabled
    ingress-dns: disabled
    logviewer: disabled
    metrics-server: disabled
    nvidia-driver-installer: disabled
    nvidia-gpu-device-plugin: disabled
    registry: disabled
    registry-creds: disabled
    storage-provisioner: enabled
    storage-provisioner-gluster: disabled
   ```

1. یک افزونه، مثلاً `metrics-server` را فعال کنید:

   ```shell
   minikube addons enable metrics-server
   ```

   خروجی مشابه موارد زیر است:

   ```
   The 'metrics-server' addon is enabled
   ```

1. مشاهده پاد و سرویسی که با نصب آن افزونه ایجاد کرده‌اید:

   ```shell
   kubectl get pod,svc -n kube-system
   ```
   خروجی مشابه موارد زیر است:

   ```
   NAME                                        READY     STATUS    RESTARTS   AGE
   pod/coredns-5644d7b6d9-mh9ll                1/1       Running   0          34m
   pod/coredns-5644d7b6d9-pqd2t                1/1       Running   0          34m
   pod/metrics-server-67fb648c5                1/1       Running   0          26s
   pod/etcd-minikube                           1/1       Running   0          34m
   pod/influxdb-grafana-b29w8                  2/2       Running   0          26s
   pod/kube-addon-manager-minikube             1/1       Running   0          34m
   pod/kube-apiserver-minikube                 1/1       Running   0          34m
   pod/kube-controller-manager-minikube        1/1       Running   0          34m
   pod/kube-proxy-rnlps                        1/1       Running   0          34m
   pod/kube-scheduler-minikube                 1/1       Running   0          34m
   pod/storage-provisioner                     1/1       Running   0          34m

   NAME                           TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)             AGE
   service/metrics-server         ClusterIP   10.96.241.45    <none>        80/TCP              26s
   service/kube-dns               ClusterIP   10.96.0.10      <none>        53/UDP,53/TCP       34m
   service/monitoring-grafana     NodePort    10.99.24.54     <none>        80:30002/TCP        26s
   service/monitoring-influxdb    ClusterIP   10.111.169.94   <none>        8083/TCP,8086/TCP   26s
   ```

1. خروجی `metrics-server` را بررسی کنید:

   ```shell
   kubectl top pods
   ```

   اگر پیام زیر را مشاهده کردید، صبر کنید و دوباره امتحان کنید:

   ```
   error: Metrics API not available
   ```


1. غیرفعال کردن `metrics-server`:

   ```shell
   minikube addons disable metrics-server
   ```

   خروجی مشابه این است:

   metrics-server was successfully disabled

## پاکسازی

اکنون می‌توانید منابعی را که در کلاستر خود ایجاد کرده‌اید، پاک کنید:

```shell
kubectl delete service hello-node
kubectl delete deployment hello-node
```

توقف کلاستر minikube:

```shell
minikube stop
```

در صورت تمایل، ماشین مجازی Minikube را حذف کنید:

```shell
# Optional
minikube delete
```
اگر می‌خواهید دوباره از minikube برای کسب اطلاعات بیشتر در مورد کوبرنتیز استفاده کنید، نیازی به حذف آن ندارید.

## نتیجه‌گیری

این صفحه جنبه‌های اساسی برای راه‌اندازی و اجرای یک کلاستر minikube را پوشش داد. اکنون آماده استقرار برنامه‌ها هستید.

## {{% heading "whatsnext" %}}

* آموزش *استقرار اولین برنامه روی کوبرنتیز با kubectl*
* درباره [Deployment objects](/docs/concepts/workloads/controllers/deployment/) بیشتر بدانید.
* درباره [استقرار برنامه‌ها](/docs/tasks/run-application/run-stateless-application-deployment/) بیشتر بدانید.
* درباره [Service objects](/docs/concepts/services-networking/service/) بیشتر بدانید.
