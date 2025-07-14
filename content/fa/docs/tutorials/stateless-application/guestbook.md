---
title: "مثال: استقرار برنامه PHP Guestbook با Redis"
reviewers:
- ahmetb
- jimangel
content_type: آموزش
weight: 20
card:
  name: آموزش
  weight: 30
  title: "مثال: استقرار برنامه PHP Guestbook با Redis"
min-kubernetes-server-version: v1.14
source: https://cloud.google.com/kubernetes-engine/docs/tutorials/guestbook
---

<!-- overview -->
این آموزش به شما نشان می‌دهد که چگونه یک برنامه وب چندلایه ساده _(نه آماده تولید)_ را با استفاده از Kubernetes و [Docker](https://www.docker.com/). بسازید و مستقر کنید. این مثال شامل اجزای زیر است:


* یک نمونه واحد [Redis](https://www.redis.io/) برای ذخیره ورودی‌های دفتر مهمان
* چندین نمونه رابط کاربری وب

## {{% heading "اهداف" %}}

* یک لیدر Redis راه‌اندازی کنید.
* دو دنبال‌کننده‌ی Redis راه‌اندازی کنید.
* رابط کاربریguestbook را راه‌اندازی کنید.
* سرویس Frontend را نمایش داده و مشاهده کنید.
* پاک کن

## {{% heading "پیش نیازها" %}}

{{< include "task-tutorial-prereqs.md" >}}

{{< version-check >}}

<!-- lessoncontent -->

## راه اندازی پایگاه داده Redis

برنامه‌ی guestbook از Redis برای ذخیره‌ی داده‌های خود استفاده می‌کند.

### ایجاد  Redis Deployment

فایل مانیفست، که در زیر آمده است، یک کنترلر Deployment را مشخص می‌کند که یک Redis Pod کپی شده را اجرا می‌کند.


{{% code_sample file="application/guestbook/redis-leader-deployment.yaml" %}}

1. یک پنجره ترمینال را در دایرکتوری که فایل‌های مانیفست را دانلود کرده‌اید، اجرا کنید.
1. Redis Deployment را از فایل `redis-leader-deployment.yaml` اعمال کنید:

   <!---
   for local testing of the content via relative file path
   kubectl apply -f ./content/en/examples/application/guestbook/redis-leader-deployment.yaml
   -->

   ```shell
   kubectl apply -f https://k8s.io/examples/application/guestbook/redis-leader-deployment.yaml
   ```

1. برای تأیید اجرای Redis Pod، لیست Podها را جستجو کنید:

   ```shell
   kubectl get pods
   ```

   پاسخ باید مشابه این باشد:

   ```
   NAME                           READY   STATUS    RESTARTS   AGE
   redis-leader-fb76b4755-xjr2n   1/1     Running   0          13s
   ```

1. برای مشاهده گزارش‌ها از Redis leader Pod، دستور زیر را اجرا کنید:

   ```shell
   kubectl logs -f deployment/redis-leader
   ```

### ایجاد سرویس رهبر Redis

برنامه‌ی Guestbook برای نوشتن داده‌هایش باید با Redis ارتباط برقرار کند. شما باید یک [Service](/docs/concepts/services-networking/service/) را برای پراکسی کردن ترافیک به Redis Pod اعمال کنید. یک سرویس، سیاستی را برای دسترسی به Podها تعریف می‌کند.

{{% code_sample file="application/guestbook/redis-leader-service.yaml" %}}

1. سرویس Redis را از فایل `redis-leader-service.yaml` زیر اعمال کنید:

   <!---
   for local testing of the content via relative file path
   kubectl apply -f ./content/en/examples/application/guestbook/redis-leader-service.yaml
   -->

   ```shell
   kubectl apply -f https://k8s.io/examples/application/guestbook/redis-leader-service.yaml
   ```

1. برای تأیید اجرای سرویس Redis، لیست سرویس‌ها را بررسی کنید:

   ```shell
   kubectl get service
   ```

   پاسخ باید مشابه این باشد:

   ```
   NAME           TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
   kubernetes     ClusterIP   10.0.0.1     <none>        443/TCP    1m
   redis-leader   ClusterIP   10.103.78.24 <none>        6379/TCP   16s
   ```

{{< note >}}
این فایل مانیفست، سرویسی به نام `redis-leader` با مجموعه‌ای از برچسب‌ها که با برچسب‌های قبلاً تعریف شده مطابقت دارند، ایجاد می‌کند، بنابراین سرویس، ترافیک شبکه را به Redis Pod هدایت می‌کند.
{{< /note >}}

### دنبال‌کنندگان Redis را تنظیم کنید

اگرچه رهبر Redis یک Pod واحد است، اما می‌توانید با اضافه کردن چند دنبال‌کننده یا کپی Redis، آن را در دسترس قرار دهید و نیازهای ترافیکی را برآورده کنید.

{{% code_sample file="application/guestbook/redis-follower-deployment.yaml" %}}

1. Redis Deployment را از فایل `redis-follower-deployment.yaml` زیر اعمال کنید:

   <!---
   for local testing of the content via relative file path
   kubectl apply -f ./content/en/examples/application/guestbook/redis-follower-deployment.yaml
   -->

   ```shell
   kubectl apply -f https://k8s.io/examples/application/guestbook/redis-follower-deployment.yaml
   ```

1.   مطمین شوید که  از لیست Podها، تأیید کنید که دو کپی دنبال‌کننده Redis در حال اجرا هستند:

   ```shell
   kubectl get pods
   ```

   پاسخ باید مشابه این باشد:

   ```
   NAME                             READY   STATUS    RESTARTS   AGE
   redis-follower-dddfbdcc9-82sfr   1/1     Running   0          37s
   redis-follower-dddfbdcc9-qrt5k   1/1     Running   0          38s
   redis-leader-fb76b4755-xjr2n     1/1     Running   0          11m
   ```

### ایجاد سرویس دنبال‌کننده Redis

برنامه‌ی Guestbook برای خواندن داده‌ها نیاز به برقراری ارتباط با دنبال‌کنندگان Redis دارد. برای اینکه دنبال‌کنندگان Redis قابل شناسایی باشند، باید یک سرویس دیگر (/docs/concepts/services-networking/service/) راه‌اندازی کنید.

{{% code_sample file="application/guestbook/redis-follower-service.yaml" %}}

1. سرویس Redis را از فایل `redis-follower-service.yaml` زیر اعمال کنید:
   <!---
   for local testing of the content via relative file path
   kubectl apply -f ./content/en/examples/application/guestbook/redis-follower-service.yaml
   -->

   ```shell
   kubectl apply -f https://k8s.io/examples/application/guestbook/redis-follower-service.yaml
   ```

1. برای تأیید اجرای سرویس Redis، لیست سرویس‌ها را بررسی کنید:

   ```shell
   kubectl get service
   ```

   پاسخ باید مشابه این باشد:

   ```
   NAME             TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
   kubernetes       ClusterIP   10.96.0.1       <none>        443/TCP    3d19h
   redis-follower   ClusterIP   10.110.162.42   <none>        6379/TCP   9s
   redis-leader     ClusterIP   10.103.78.24    <none>        6379/TCP   6m10s
   ```

{{< note >}}
این فایل مانیفست، سرویسی به نام `redis-follower` با مجموعه‌ای از برچسب‌ها که با برچسب‌های قبلاً تعریف شده مطابقت دارند، ایجاد می‌کند، بنابراین سرویس، ترافیک شبکه را به Redis Pod هدایت می‌کند.
{{< /note >}}

## راه‌اندازی و نمایش فرانت‌اند دفتر مهمان

اکنون که فضای ذخیره‌سازی Redis مربوط به guestbook خود را راه‌اندازی و اجرا کرده‌اید، سرورهای وب guestbook را راه‌اندازی کنید. مانند دنبال‌کنندگان Redis، frontend با استفاده از Kubernetes Deployment مستقر شده است.


برنامه‌ی guestbook از یک رابط کاربری PHP استفاده می‌کند. این برنامه طوری پیکربندی شده است که بسته به اینکه درخواست خواندن یا نوشتن باشد، با سرویس‌های دنبال‌کننده یا رهبر Redis ارتباط برقرار کند. رابط کاربری یک رابط JSON را ارائه می‌دهد و یک رابط کاربری مبتنی بر jQuery-Ajax را ارائه می‌دهد.


### ایجاد  Guestbook Frontend Deployment:

{{% code_sample file="application/guestbook/frontend-deployment.yaml" %}}

1. افزونه frontend Deployment را از فایل `frontend-deployment.yaml` اعمال کنید:

   <!---
   for local testing of the content via relative file path
   kubectl apply -f ./content/en/examples/application/guestbook/frontend-deployment.yaml
   -->

   ```shell
   kubectl apply -f https://k8s.io/examples/application/guestbook/frontend-deployment.yaml
   ```

1. برای تأیید اینکه سه کپی frontend در حال اجرا هستند، لیست Podها را جستجو کنید:

   ```shell
   kubectl get pods -l app=guestbook -l tier=frontend
   ```

   The response should be similar to this:

   ```
   NAME                        READY   STATUS    RESTARTS   AGE
   frontend-85595f5bf9-5tqhb   1/1     Running   0          47s
   frontend-85595f5bf9-qbzwm   1/1     Running   0          47s
   frontend-85595f5bf9-zchwc   1/1     Running   0          47s
   ```

### ایجاد سرویس Frontend

سرویس‌های `Redis` که شما اعمال کرده‌اید، فقط در داخل خوشه Kubernetes قابل دسترسی هستند، زیرا نوع پیش‌فرض برای یک سرویس، [ClusterIP](/docs/concepts/services-networking/service/#publishing-services-service-types) است. `ClusterIP` یک آدرس IP واحد برای مجموعه پادهایی که سرویس به آنها اشاره می‌کند، ارائه می‌دهد. این آدرس IP فقط در داخل خوشه قابل دسترسی است.

اگر می‌خواهید مهمانان بتوانند به guestbook شما دسترسی داشته باشند، باید سرویس frontend را طوری پیکربندی کنید که از خارج قابل مشاهده باشد، بنابراین یک کلاینت می‌تواند سرویس را از خارج از خوشه Kubernetes درخواست کند. با این حال، یک کاربر Kubernetes می‌تواند از `kubectl port-forward` برای دسترسی به سرویس استفاده کند، حتی اگر از `ClusterIP` استفاده کند.

{{< note >}}
برخی از ارائه‌دهندگان خدمات ابری، مانند Google Compute Engine یا Google Kubernetes Engine، از متعادل‌کننده‌های بار خارجی پشتیبانی می‌کنند. اگر ارائه‌دهنده خدمات ابری شما از متعادل‌کننده‌های بار پشتیبانی می‌کند و شما می‌خواهید از آن استفاده کنید، عبارت `type: LoadBalancer` را از حالت کامنت خارج کنید.
{{< /note >}}

{{% code_sample file="application/guestbook/frontend-service.yaml" %}}

1. سرویس frontend را از فایل `frontend-service.yaml` اعمال کنید:

   <!---
   for local testing of the content via relative file path
   kubectl apply -f ./content/en/examples/application/guestbook/frontend-service.yaml
   -->

   ```shell
   kubectl apply -f https://k8s.io/examples/application/guestbook/frontend-service.yaml
   ```

1. برای تأیید اجرای سرویس frontend، لیست سرویس‌ها را بررسی کنید:
   ```shell
   kubectl get services
   ```

   پاسخ باید مشابه این باشد:

   ```
   NAME             TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
   frontend         ClusterIP   10.97.28.230    <none>        80/TCP     19s
   kubernetes       ClusterIP   10.96.0.1       <none>        443/TCP    3d19h
   redis-follower   ClusterIP   10.110.162.42   <none>        6379/TCP   5m48s
   redis-leader     ClusterIP   10.103.78.24    <none>        6379/TCP   11m
   ```

### مشاهده سرویس Frontend از طریق `kubectl port-forward`

1. دستور زیر را برای ارسال پورت `8080` روی دستگاه محلی خود به پورت `80` روی سرویس اجرا کنید.

   ```shell
   kubectl port-forward svc/frontend 8080:80
   ```

   The response should be similar to this:

   ```
   Forwarding from 127.0.0.1:8080 -> 80
   Forwarding from [::1]:8080 -> 80
   ```

1. برای مشاهده‌ی guestbook، صفحه‌ی [http://localhost:8080](http://localhost:8080) را در مرورگر خود بارگذاری کنید.

### مشاهده سرویس Frontend از طریق `LoadBalancer`

اگر فایل مانیفست `frontend-service.yaml` را با نوع `LoadBalancer` پیاده‌سازی کرده‌اید، برای مشاهده Guestbook خود باید آدرس IP را پیدا کنید.

1. دستور زیر را برای دریافت آدرس IP سرویس frontend اجرا کنید.

   ```shell
   kubectl get service frontend
   ```

   پاسخ باید مشابه این باشد:

   ```
   NAME       TYPE           CLUSTER-IP      EXTERNAL-IP        PORT(S)        AGE
   frontend   LoadBalancer   10.51.242.136   109.197.92.229     80:32372/TCP   1m
   ```

1. آدرس IP خارجی را کپی کنید و صفحه را در مرورگر خود بارگذاری کنید تا دفترچه مهمان خود را مشاهده کنید.

{{< note >}}
با تایپ کردن یک پیام و کلیک روی ارسال، سعی کنید چند ورودی به دفتر مهمان اضافه کنید.
پیامی که تایپ کردید در قسمت کاربری نمایش داده می‌شود. این پیام نشان می‌دهد که
داده‌ها با موفقیت از طریق سرویس‌هایی که قبلاً ایجاد کرده‌اید به Redis اضافه شده‌اند.
{{< /note >}}

## مقیاس‌بندی ظاهر وب

شما می‌توانید در صورت نیاز، مقیاس را افزایش یا کاهش دهید، زیرا سرورهای شما به عنوان سرویسی تعریف می‌شوند که از یک کنترل‌کننده‌ی استقرار (Deployment controller) استفاده می‌کند.

1. برای افزایش تعداد Pod های frontend، دستور زیر را اجرا کنید:

   ```shell
   kubectl scale deployment frontend --replicas=5
   ```

1. برای تأیید تعداد پادهای frontend در حال اجرا، لیست پادها را جستجو کنید.:

   ```shell
   kubectl get pods
   ```

   پاسخ باید شبیه به این باشد:

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

1. برای کاهش تعداد پادهای فرانت‌اند، دستور زیر را اجرا کنید:

   ```shell
   kubectl scale deployment frontend --replicas=2
   ```

1. برای تأیید تعداد پادهای فرانت‌اند در حال اجرا، لیست پادها را جستجو کنید:

   ```shell
   kubectl get pods
   ```

   پاسخ او باید چیزی شبیه به این باشد:

   ```
   NAME                             READY   STATUS    RESTARTS   AGE
   frontend-85595f5bf9-cpskg        1/1     Running   0          16m
   frontend-85595f5bf9-l9c8z        1/1     Running   0          15m
   redis-follower-dddfbdcc9-82sfr   1/1     Running   0          98m
   redis-follower-dddfbdcc9-qrt5k   1/1     Running   0          98m
   redis-leader-fb76b4755-xjr2n     1/1     Running   0          109m
   ```

## {{% heading "پاکسازی" %}}

حذف Deployments و Services، تمام Pod های در حال اجرا را نیز حذف می‌کند. از برچسب‌ها برای حذف چندین منبع با یک دستور استفاده کنید.

1. برای حذف همه Podها، Deployments و سرویس‌ها، دستورات زیر را اجرا کنید.

   ```shell
   kubectl delete deployment -l app=redis
   kubectl delete service -l app=redis
   kubectl delete deployment frontend
   kubectl delete service frontend
   ```

   پاسخ باید شبیه به این باشد:

   ```
   deployment.apps "redis-follower" deleted
   deployment.apps "redis-leader" deleted
   deployment.apps "frontend" deleted
   service "frontend" deleted
   ```

1. لیست Podها را بررسی کنید تا مطمئن شوید هیچ Podای در حال اجرا نیست:

   ```shell
   kubectl get pods
   ```

   پاسخ باید شبیه به این باشد:

   ```
   No resources found in default namespace.
   ```

## {{% heading "بعدی چیست؟" %}}

* آموزش‌های تعاملی [Kubernetes Basics](/docs/tutorials/kubernetes-basics/) را تکمیل کنید
* از Kubernetes برای ایجاد یک وبلاگ با استفاده از [Persistent Volumes for MySQL and Wordpress](/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/#visit-your-new-wordpress-blog) استفاده کنید
* درباره [connecting applications with services](/docs/tutorials/services/connect-applications-service/) بیشتر بخوانید
* درباره [using labels effectively](/docs/concepts/overview/working-with-objects/labels/#using-labels-effectively) بیشتر بخوانید