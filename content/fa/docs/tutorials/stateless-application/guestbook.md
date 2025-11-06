---
title: "مثال: استقرار برنامه PHP Guestbook با Redis"
content_type: tutorial
weight: 20
card:
name: tutorials
weight: 30
title: "مثال Stateless: PHP Guestbook با Redis"
min-kubernetes-server-version: v1.14
source: [https://cloud.google.com/kubernetes-engine/docs/tutorials/guestbook](https://cloud.google.com/kubernetes-engine/docs/tutorials/guestbook)
---

<!-- overview -->

این آموزش نشان می‌دهد چگونه یک برنامه‌ی وب ساده *(برای تولید آماده نیست)* و چند لایه را با استفاده از کوبرنتیز و [Docker](https://www.docker.com/) بسازید و استقرار دهید. این مثال شامل اجزای زیر است:

* یک نمونه‌ی Redis برای ذخیره‌ی ورودی‌های guestbook
* چندین نمونه از frontend وب

## {{% heading "اهداف" %}}

* راه‌اندازی یک Redis leader
* راه‌اندازی دو Redis follower
* راه‌اندازی frontend برنامه‌ی guestbook
* افشا و مشاهده‌ی Service مربوط به Frontend
* پاک‌سازی منابع

## {{% heading "پیش‌نیازها" %}}

{{< include "task-tutorial-prereqs.md" >}}

{{< version-check >}}

<!-- lessoncontent -->

## راه‌اندازی پایگاه داده Redis

برنامه‌ی guestbook برای ذخیره‌ی داده‌های خود از Redis استفاده می‌کند.

### ایجاد Deployment برای Redis

فایل manifest زیر یک **Deployment** تعریف می‌کند که یک پاد Redis اجرا می‌کند.

{{% code_sample file="application/guestbook/redis-leader-deployment.yaml" %}}

1. یک ترمینال در دایرکتوری که فایل‌های manifest را دانلود کرده‌اید باز کنید.

2. Deployment مربوط به Redis را با استفاده از فایل `redis-leader-deployment.yaml` اعمال کنید:

   <!---
   برای تست محلی با مسیر نسبی
   kubectl apply -f ./content/en/examples/application/guestbook/redis-leader-deployment.yaml
   -->

   ```shell
   kubectl apply -f https://k8s.io/examples/application/guestbook/redis-leader-deployment.yaml
   ```

3. لیست پادها را بررسی کنید تا مطمئن شوید پاد Redis در حال اجرا است:

   ```shell
   kubectl get pods
   ```

   خروجی باید مشابه زیر باشد:

   ```
   NAME                           READY   STATUS    RESTARTS   AGE
   redis-leader-fb76b4755-xjr2n   1/1     Running   0          13s
   ```

4. دستور زیر را اجرا کنید تا لاگ‌های پاد Redis leader را مشاهده کنید:

   ```shell
   kubectl logs -f deployment/redis-leader
   ```

### ایجاد Service برای Redis leader

برنامه‌ی guestbook نیاز دارد تا با Redis برای نوشتن داده‌ها ارتباط برقرار کند.
برای این کار باید یک [Service](/docs/concepts/services-networking/service/) ایجاد کنید تا ترافیک شبکه را به پاد Redis هدایت کند.
Service یک سیاست دسترسی به پادها تعریف می‌کند.

{{% code_sample file="application/guestbook/redis-leader-service.yaml" %}}

1. Service مربوط به Redis را با استفاده از فایل `redis-leader-service.yaml` اعمال کنید:

   <!---
   برای تست محلی با مسیر نسبی
   kubectl apply -f ./content/en/examples/application/guestbook/redis-leader-service.yaml
   -->

   ```shell
   kubectl apply -f https://k8s.io/examples/application/guestbook/redis-leader-service.yaml
   ```

2. لیست Serviceها را بررسی کنید تا مطمئن شوید Service Redis در حال اجرا است:

   ```shell
   kubectl get service
   ```

   خروجی باید مشابه زیر باشد:

   ```
   NAME           TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
   kubernetes     ClusterIP   10.0.0.1     <none>        443/TCP    1m
   redis-leader   ClusterIP   10.103.78.24 <none>        6379/TCP   16s
   ```

{{< note >}}
این فایل manifest یک Service به نام `redis-leader` ایجاد می‌کند که شامل یک مجموعه برچسب (labels) است که با برچسب‌های تعریف‌شده‌ی قبلی مطابقت دارد، بنابراین ترافیک شبکه را به پاد Redis هدایت می‌کند.
{{< /note >}}

### راه‌اندازی Redis followers

با اینکه Redis leader تنها یک پاد دارد، می‌توانید با افزودن چند Redis follower یا replica، آن را با دسترس‌پذیری بالا و پاسخ‌دهی به ترافیک بهتر آماده کنید.

{{% code_sample file="application/guestbook/redis-follower-deployment.yaml" %}}

1. Deployment مربوط به Redis follower را با استفاده از فایل `redis-follower-deployment.yaml` اعمال کنید:

   <!---
   برای تست محلی با مسیر نسبی
   kubectl apply -f ./content/en/examples/application/guestbook/redis-follower-deployment.yaml
   -->

   ```shell
   kubectl apply -f https://k8s.io/examples/application/guestbook/redis-follower-deployment.yaml
   ```

2. با بررسی لیست پادها، اطمینان حاصل کنید که دو Replica مربوط به Redis follower در حال اجرا هستند:

   ```shell
   kubectl get pods
   ```

   خروجی باید مشابه زیر باشد:

   ```
   NAME                             READY   STATUS    RESTARTS   AGE
   redis-follower-dddfbdcc9-82sfr   1/1     Running   0          37s
   redis-follower-dddfbdcc9-qrt5k   1/1     Running   0          38s
   redis-leader-fb76b4755-xjr2n     1/1     Running   0          11m
   ```


### ایجاد Service برای Redis followers

برنامه guestbook نیاز دارد تا برای **خواندن داده‌ها** با Redis followers ارتباط برقرار کند. برای قابل شناسایی کردن Redis followers، باید یک [Service](/docs/concepts/services-networking/service/) دیگر ایجاد کنید.

{{% code_sample file="application/guestbook/redis-follower-service.yaml" %}}

1. Service مربوط به Redis را با استفاده از فایل `redis-follower-service.yaml` اعمال کنید:

<!---
برای تست محلی با مسیر نسبی
kubectl apply -f ./content/en/examples/application/guestbook/redis-follower-service.yaml
-->

```shell
kubectl apply -f https://k8s.io/examples/application/guestbook/redis-follower-service.yaml
```

2. لیست Serviceها را بررسی کنید تا مطمئن شوید Service Redis در حال اجرا است:

```shell
kubectl get service
```

خروجی باید مشابه زیر باشد:

```
NAME             TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
kubernetes       ClusterIP   10.96.0.1       <none>        443/TCP    3d19h
redis-follower   ClusterIP   10.110.162.42   <none>        6379/TCP   9s
redis-leader     ClusterIP   10.103.78.24    <none>        6379/TCP   6m10s
```

{{< note >}}
این فایل manifest یک Service به نام `redis-follower` ایجاد می‌کند که مجموعه‌ای از **Labels** آن مطابق با برچسب‌های تعریف‌شده قبلی است، بنابراین Service ترافیک شبکه را به Podهای Redis هدایت می‌کند.
{{< /note >}}

## راه‌اندازی و نمایش Frontend برنامه Guestbook

اکنون که ذخیره‌سازی Redis برای guestbook شما آماده و در حال اجرا است، سرورهای وب guestbook را راه‌اندازی کنید. مشابه Redis followers، frontend نیز با استفاده از **Deployment** کوبرنتیز مستقر می‌شود.

برنامه guestbook از یک frontend **PHP** استفاده می‌کند. این frontend طوری پیکربندی شده که بسته به اینکه درخواست **خواندن** باشد یا **نوشتن**، با Service مربوط به Redis follower یا leader ارتباط برقرار کند. Frontend یک رابط JSON ارائه می‌دهد و از UX مبتنی بر **jQuery-Ajax** پشتیبانی می‌کند.

### ایجاد Deployment برای Frontend Guestbook

{{% code_sample file="application/guestbook/frontend-deployment.yaml" %}}

1. Deployment مربوط به frontend را با استفاده از فایل `frontend-deployment.yaml` اعمال کنید:

<!---
برای تست محلی با مسیر نسبی
kubectl apply -f ./content/en/examples/application/guestbook/frontend-deployment.yaml
-->

```shell
kubectl apply -f https://k8s.io/examples/application/guestbook/frontend-deployment.yaml
```

2. لیست پادها را بررسی کنید تا مطمئن شوید که سه **replica** frontend در حال اجرا هستند:

```shell
kubectl get pods -l app=guestbook -l tier=frontend
```

خروجی باید مشابه زیر باشد:

```
NAME                        READY   STATUS    RESTARTS   AGE
frontend-85595f5bf9-5tqhb   1/1     Running   0          47s
frontend-85595f5bf9-qbzwm   1/1     Running   0          47s
frontend-85595f5bf9-zchwc   1/1     Running   0          47s
```


### ایجاد Service برای Frontend

Serviceهایی که برای `Redis` اعمال کردید، تنها در داخل **کلاستر کوبرنتیز** قابل دسترسی هستند، زیرا نوع پیش‌فرض یک Service، [ClusterIP](/docs/concepts/services-networking/service/#publishing-services-service-types) است.
`ClusterIP` یک آدرس IP واحد برای مجموعه پادهایی که Service به آن‌ها اشاره دارد ارائه می‌دهد و این آدرس فقط در داخل کلاستر قابل دسترسی است.

اگر می‌خواهید کاربران خارجی بتوانند به guestbook شما دسترسی داشته باشند، باید **Service frontend** را به‌صورت خارجی قابل مشاهده کنید تا یک کلاینت بتواند Service را از خارج از کلاستر درخواست کند. با این حال، یک کاربر کوبرنتیز می‌تواند از `kubectl port-forward` برای دسترسی به Service حتی با استفاده از `ClusterIP` استفاده کند.

{{< note >}}
برخی ارائه‌دهندگان ابری، مانند **Google Compute Engine** یا **Google Kubernetes Engine**، از **Load Balancerهای خارجی** پشتیبانی می‌کنند. اگر ارائه‌دهنده ابری شما از Load Balancer پشتیبانی می‌کند و می‌خواهید از آن استفاده کنید، `type: LoadBalancer` را از حالت کامنت خارج کنید.
{{< /note >}}

{{% code_sample file="application/guestbook/frontend-service.yaml" %}}

1. Service مربوط به frontend را با استفاده از فایل `frontend-service.yaml` اعمال کنید:

<!---
برای تست محلی با مسیر نسبی
kubectl apply -f ./content/en/examples/application/guestbook/frontend-service.yaml
-->

```shell
kubectl apply -f https://k8s.io/examples/application/guestbook/frontend-service.yaml
```

2. لیست Serviceها را بررسی کنید تا مطمئن شوید Service frontend در حال اجرا است:

```shell
kubectl get services
```

خروجی باید مشابه زیر باشد:

```
NAME             TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
frontend         ClusterIP   10.97.28.230    <none>        80/TCP     19s
kubernetes       ClusterIP   10.96.0.1       <none>        443/TCP    3d19h
redis-follower   ClusterIP   10.110.162.42   <none>        6379/TCP   5m48s
redis-leader     ClusterIP   10.103.78.24    <none>        6379/TCP   11m
```

### مشاهده Service frontend با استفاده از `kubectl port-forward`

1. دستور زیر را اجرا کنید تا پورت `8080` روی ماشین محلی شما به پورت `80` Service هدایت شود:

```shell
kubectl port-forward svc/frontend 8080:80
```

خروجی باید مشابه زیر باشد:

```
Forwarding from 127.0.0.1:8080 -> 80
Forwarding from [::1]:8080 -> 80
```

2. صفحه [http://localhost:8080](http://localhost:8080) را در مرورگر خود باز کنید تا guestbook شما نمایش داده شود.

### مشاهده Service frontend با استفاده از `LoadBalancer`

اگر فایل مانیفست `frontend-service.yaml` را با نوع `LoadBalancer` مستقر کرده‌اید، باید **آدرس IP خارجی** را پیدا کنید تا guestbook خود را مشاهده کنید.

1. دستور زیر را اجرا کنید تا آدرس IP Service frontend را دریافت کنید:

```shell
kubectl get service frontend
```

خروجی باید مشابه زیر باشد:

```
NAME       TYPE           CLUSTER-IP      EXTERNAL-IP        PORT(S)        AGE
frontend   LoadBalancer   10.51.242.136   109.197.92.229     80:32372/TCP   1m
```

2. آدرس IP خارجی را کپی کنید و صفحه را در مرورگر خود بارگذاری کنید تا guestbook شما نمایش داده شود.

{{< note >}}
سعی کنید چند ورودی در guestbook اضافه کنید؛ یک پیام تایپ کرده و روی **Submit** کلیک کنید.
پیامی که وارد کرده‌اید در frontend ظاهر می‌شود. این پیام نشان می‌دهد که داده‌ها با موفقیت از طریق Serviceهایی که قبلاً ایجاد کرده‌اید به Redis اضافه شده‌اند.
{{< /note >}}


## مقیاس‌دهی Web Frontend

شما می‌توانید بسته به نیاز، تعداد سرورها را افزایش یا کاهش دهید، زیرا سرورها به‌عنوان یک **Service** که از **Deployment controller** استفاده می‌کند تعریف شده‌اند.

1. برای افزایش تعداد پادهای frontend، دستور زیر را اجرا کنید:

```shell
kubectl scale deployment frontend --replicas=5
```

2. لیست پادها را بررسی کنید تا مطمئن شوید تعداد پادهای frontend در حال اجرا افزایش یافته است:

```shell
kubectl get pods
```

خروجی باید مشابه زیر باشد:

```
NAME                             READY   STATUS    RESTARTS   AGE
frontend-85595f5bf9-5df5m        1/1     Running   0          83s
frontend-85595f5bf9-7zmg5        1/1     Running   0          83s
frontend-85595f5bf9-cpskg        1/1     Running   0          15m
frontend-85595f5bf9-l2l54        1/1     Running   0          14m
frontend-85595f5bf9-l9c8z        1/1     Running   0          14m
redis-follower-dddfbdcc9-82sfr   1/1     Running   0          97m
redis-follower-dddfbdcc9-qrt5k   1/1     Running   0          97m
redis-leader-fb76b4755-xjr2n     1/1     Running   0          108m
```

3. برای کاهش تعداد پادهای frontend، دستور زیر را اجرا کنید:

```shell
kubectl scale deployment frontend --replicas=2
```

4. لیست پادها را بررسی کنید تا مطمئن شوید تعداد پادهای frontend کاهش یافته است:

```shell
kubectl get pods
```

خروجی باید مشابه زیر باشد:

```
NAME                             READY   STATUS    RESTARTS   AGE
frontend-85595f5bf9-cpskg        1/1     Running   0          16m
frontend-85595f5bf9-l9c8z        1/1     Running   0          15m
redis-follower-dddfbdcc9-82sfr   1/1     Running   0          98m
redis-follower-dddfbdcc9-qrt5k   1/1     Running   0          98m
redis-leader-fb76b4755-xjr2n     1/1     Running   0          109m
```



## {{% heading "پاک‌سازی" %}}

حذف **Deployments** و **Services** باعث حذف تمام پادهای در حال اجرا نیز می‌شود. می‌توانید از **Labels** برای حذف چندین منبع با یک دستور استفاده کنید.

1. دستورات زیر را برای حذف تمام پادها، Deployments و Services اجرا کنید:

```shell
kubectl delete deployment -l app=redis
kubectl delete service -l app=redis
kubectl delete deployment frontend
kubectl delete service frontend
```

خروجی باید مشابه زیر باشد:

```
deployment.apps "redis-follower" deleted
deployment.apps "redis-leader" deleted
deployment.apps "frontend" deleted
service "frontend" deleted
```

2. لیست پادها را بررسی کنید تا مطمئن شوید هیچ پادی در حال اجرا نیست:

```shell
kubectl get pods
```

خروجی باید مشابه زیر باشد:

```
No resources found in default namespace.
```


## {{% heading "گام بعدی" %}}

* تکمیل آموزش‌های تعاملی [مبانی کوبرنتیز](/docs/tutorials/kubernetes-basics/)
* استفاده از کوبرنتیز برای ایجاد یک وبلاگ با استفاده از [Persistent Volumes برای MySQL و Wordpress](/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/#visit-your-new-wordpress-blog)
* مطالعه بیشتر درباره [اتصال برنامه‌ها با Serviceها](/docs/tutorials/services/connect-applications-service/)
* مطالعه بیشتر درباره [استفاده مؤثر از Labels](/docs/concepts/overview/working-with-objects/labels/#using-labels-effectively)

