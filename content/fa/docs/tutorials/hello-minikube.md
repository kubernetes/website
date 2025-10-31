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
برای دستورالعمل نصب، **مرحله ۱** در صفحه [minikube start](https://minikube.sigs.k8s.io/docs/start/) را ببینید.

{{< note >}}
فقط دستورهای **مرحله ۱، نصب** را اجرا کنید. مراحل دیگر در همین صفحه توضیح داده شده‌اند.
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
{{% tab name="Launch a browser" %}}
یک ترمینال **جدید** باز کنید و دستور زیر را اجرا کنید:

```shell
# Start a new terminal, and leave this running.
minikube dashboard
```

اکنون به ترمینالی که `minikube start` را اجرا کرده بودید برگردید.

{{< note >}}
دستور `dashboard` افزونه داشبورد را فعال می‌کند و یک پراکسی باز کرده و داشبورد را در مرورگر پیش‌فرض شما نمایش می‌دهد.
در داشبورد می‌توانید منابعی مثل Deployment و Service ایجاد کنید.

برای اینکه بدون باز شدن خودکار مرورگر و فقط آدرس داشبورد را دریافت کنید، تب "URL copy and paste" را ببینید.

به طور پیش‌فرض، داشبورد فقط از داخل شبکه داخلی کوبرنتیز قابل دسترسی است.
دستور `dashboard` یک پراکسی موقت برای دسترسی از بیرون ایجاد می‌کند.

برای متوقف کردن پراکسی، کلید `Ctrl+C` را بزنید.
پس از خروج، داشبورد همچنان روی کلاستر اجرا می‌شود و فقط پراکسی قطع می‌شود.
در صورت نیاز می‌توانید دوباره دستور `dashboard` را اجرا کنید.
{{< /note >}}

{{% /tab %}}
{{% tab name="URL copy and paste" %}}

اگر نمی‌خواهید minikube مرورگر را باز کند، زیر دستور `dashboard` از فلگ `--url` استفاده کنید.
`minikube` یک آدرس URL نمایش می‌دهد که شما می‌توانید در مرورگر دلخواه باز کنید.

یک ترمینال **جدید** باز کنید و اجرا کنید:

```shell
# Start a new terminal, and leave this running.
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

1. ایجاد Deployment:

   ```shell
   # Run a test container image that includes a webserver
   kubectl create deployment hello-node --image=registry.k8s.io/e2e-test-images/agnhost:2.39 -- /agnhost netexec --http-port=8080
   ```

2. مشاهده Deployment:

   ```shell
   kubectl get deployments
   ```

   خروجی مشابه موارد زیر است:

   ```
   NAME         READY   UP-TO-DATE   AVAILABLE   AGE
   hello-node   1/1     1            1           1m
   ```

   (ممکن است کمی زمان ببرد تا پاد آماده شود. اگر `0/1` دیدید، چند ثانیه بعد دوباره امتحان کنید.)

3. مشاهده Pod:

   ```shell
   kubectl get pods
   ```

   خروجی مشابه موارد زیر است:

   ```
   NAME                          READY     STATUS    RESTARTS   AGE
   hello-node-5f76cf6ccf-br9b5   1/1       Running   0          1m
   ```

4. مشاهده رویدادهای کلاستر:

   ```shell
   kubectl get events
   ```

5. مشاهده کانفیگ `kubectl`:

   ```shell
   kubectl config view
   ```

6. مشاهده لاگ کانتینر داخل پاد (نام پاد را جایگزین کنید):

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
برای اطلاعات بیشتر در مورد دستورهای `kubectl`، صفحه [kubectl overview](/docs/reference/kubectl/) را ببینید.
{{< /note >}}

## ساخت Service

به طور پیش‌فرض پاد فقط از داخل شبکه داخلی کوبرنتیز قابل دسترسی است.
برای اینکه کانتینر `hello-node` از بیرون قابل دسترسی باشد، باید آن را به‌عنوان یک [*Service*](/docs/concepts/services-networking/service/) اکسپوز کنید.

{{< warning >}}
کانتینر agnhost یک مسیر `/shell` دارد که برای دیباگ مفید است اما برای اینترنت عمومی خطرناک است.
هرگز این را روی کلاستر عمومی یا تولیدی اجرا نکنید.
{{< /warning >}}

1. اکسپوز کردن پاد:

   ```shell
   kubectl expose deployment hello-node --type=LoadBalancer --port=8080
   ```

2. مشاهده Service:

   ```shell
   kubectl get services
   ```

   خروجی مشابه موارد زیر است:

   ```
   NAME         TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
   hello-node   LoadBalancer   10.108.144.78   <pending>     8080:30369/TCP   21s
   kubernetes   ClusterIP      10.96.0.1       <none>        443/TCP          23m
   ```

3. اجرای سرویس:

   ```shell
   minikube service hello-node
   ```

   این دستور مرورگر را باز می‌کند و پاسخ برنامه را نمایش می‌دهد.

## فعال‌سازی افزونه‌ها

minikube شامل مجموعه‌ای از {{< glossary_tooltip text="addons" term_id="addons" >}} داخلی است.

1. فهرست افزونه‌ها:

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

2. فعال‌سازی افزونه `metrics-server`:

   ```shell
   minikube addons enable metrics-server
   ```

   خروجی مشابه موارد زیر است:

   ```
   The 'metrics-server' addon is enabled
   ```

3. مشاهده پادها و سرویس‌ها:

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

4. بررسی خروجی metrics:

   ```shell
   kubectl top pods
   ```

   اگر دیدید:

   ```
   error: Metrics API not available
   ```

   اگر پیام بالا را مشاهده کردید، صبر کنید و دوباره امتحان کنید:

5. غیرفعال کردن افزونه:

   ```shell
   minikube addons disable metrics-server
   ```

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

در این صفحه یاد گرفتید چگونه یک کلاستر minikube راه‌اندازی کنید و برنامه اجرا کنید.

## {{% heading "whatsnext" %}}

* آموزش *استقرار اولین برنامه روی کوبرنتیز با kubectl*
* یادگیری بیشتر درباره Deployment
* یادگیری بیشتر درباره اجرای برنامه‌ها
* یادگیری بیشتر درباره Service
