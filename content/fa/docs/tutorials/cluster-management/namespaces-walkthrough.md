---
reviewers:
#- derekwaynecarr
#- janetkuo
title: راهنمای فضاهای نام
content_type: task
weight: 260
---

<!-- overview -->
کوبرنتیز {{< glossary_tooltip text="فضاهای نام" term_id="namespace" >}}
به پروژه‌ها، تیم‌ها یا مشتریان مختلف کمک کنید تا خوشه (cluster) کوبرنتیز  را به اشتراک بگذارند.

این کار را با ارائه موارد زیر انجام می‌دهد:

1. یک محدوده برای [نام‌ها](/docs/concepts/overview/working-with-objects/names/).
2. (cluster)سازوکاری برای ضمیمه کردن مجوز و سیاست به یک زیربخش از خوشه.

استفاده از چندین فضای نام اختیاری است.

این مثال نحوه استفاده از فضاهای نام کوبرنتیز برای تقسیم‌بندی خوشه (cluster) شما را نشان می‌دهد.



## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->

## پیش‌نیازها

این مثال موارد زیر را فرض می‌کند:

1. شما یک [خوشه کوبرنتیز موجود](/docs/setup/) دارید.
2. شما درک اولیه‌ای از کوبرنتیز {{< glossary_tooltip text="پادهای" term_id="pod" >}}، {{< glossary_tooltip term_id="service" text="سرویس ها" >}}، و {{< glossary_tooltip text="استقرارها" term_id="deployment" >}} دارید.

## آشنایی با فضای نام پیش‌فرض

به طور پیش‌فرض، یک خوشه (cluster) کوبرنتیز هنگام آماده‌سازی خوشه (cluster)، یک فضای نام پیش‌فرض را نمونه‌سازی می‌کند تا مجموعه پیش‌فرض پادها، سرویس‌هاواستقرارها مورد استفاده توسط خوشه را در خود جای دهد.

با فرض اینکه یک خوشه (cluster) جدید دارید، می‌توانید با انجام موارد زیر، فضاهای نام موجود را بررسی کنید:

```shell
kubectl get namespaces
```
```
NAME      STATUS    AGE
default   Active    13m
```

## ایجاد فضاهای نام جدید

برای این تمرین، دو فضای نام کوبرنتیز اضافی برای نگهداری محتوای خودایجاد خواهیم کرد.

بیایید سناریویی را تصور کنیم که در آن یک سازمان از یک خوشه (cluster) مشترک کوبرنتیز برای موارد استفاده توسعه و تولید استفاده می‌کند.

تیم توسعه می‌خواهد فضایی را در خوشه (cluster) حفظ کند که در آن بتوانند فهرست پادها، سرویس‌هاواستقرارهایی را که برای ساخت و اجرای برنامه خود استفاده می‌کنند، مشاهده کنند. در این فضا، منابع کوبرنتیز می‌آیند و می‌روند و محدودیت‌های مربوط به اینکه چه کسی می‌تواند یا نمی‌تواند منابع را تغییر دهد، کاهش می‌یابد تا توسعه چابک امکان‌پذیر شود.

تیم عملیات مایل است فضایی را در خوشه (cluster) حفظ کند که در آن بتواند رویه‌های سختگیرانه‌ای را در مورد اینکه چه کسی می‌تواند یا نمی‌تواند مجموعه پادها، سرویس‌ها و استقرارهایی را که وبگاه عملیاتی را اداره می‌کنند، دستکاری کند، اعمال کند.

یکی از الگوهایی که این سازمان می‌تواند دنبال کند، تقسیم‌بندی خوشه (cluster) کوبرنتیز به دو فضای نام است: «توسعه» و «تولید».

بیایید دو فضای نام جدید برای نگهداری کارمان ایجاد کنیم.

از پرونده [`namespace-dev.yaml`](/examples/admin/namespace-dev.yaml) که یک فضای نام `development` را توصیف می‌کند، استفاده کنید:

{{% code_sample language="yaml" file="admin/namespace-dev.yaml" %}}

فضای نام «توسعه» را با استفاده از kubectl ایجاد کنید.

```shell
kubectl create -f https://k8s.io/examples/admin/namespace-dev.yaml
```

محتویات زیر را در پرونده [`namespace-prod.yaml`](/examples/admin/namespace-prod.yaml) که یک فضای نام `production` را توصیف می‌کند، ذخیره کنید:

{{% code_sample language="yaml" file="admin/namespace-prod.yaml" %}}

و سپس بیایید فضای نام `production` را با استفاده از kubectl ایجاد کنیم.

```shell
kubectl create -f https://k8s.io/examples/admin/namespace-prod.yaml
```

برای اطمینان از درست بودن همه چیز، بیایید تمام فضاهای نام موجود در خوشه (cluster) خود را فهرست کنیم.

```shell
kubectl get namespaces --show-labels
```
```
NAME          STATUS    AGE       LABELS
default       Active    32m       <none>
development   Active    29s       name=development
production    Active    23s       name=production
```

## ایجاد پادها در هر فضای نام

فضای نام کوبرنتیز، محدوده‌ی پادها، سرویس‌هاواستقرارها را در خوشه (cluster) فراهم می‌کند.

کاربرانی که با یک فضای نام تعامل دارند، محتوای فضای نام دیگر را نمی‌بینند.

برای نشان دادن این موضوع، بیایید یک استقرار و پادهای ساده را در فضای نام `development` اجرا کنیم.
ابتدا بررسی می‌کنیم که محتوا فعلی چیست:

```shell
kubectl config view
```
```yaml
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: REDACTED
    server: https://130.211.122.180
  name: lithe-cocoa-92103_kubernetes
contexts:
- context:
    cluster: lithe-cocoa-92103_kubernetes
    user: lithe-cocoa-92103_kubernetes
  name: lithe-cocoa-92103_kubernetes
current-context: lithe-cocoa-92103_kubernetes
kind: Config
preferences: {}
users:
- name: lithe-cocoa-92103_kubernetes
  user:
    client-certificate-data: REDACTED
    client-key-data: REDACTED
    token: 65rZW78y8HbwXXtSXuUw9DbP4FLjHi4b
- name: lithe-cocoa-92103_kubernetes-basic-auth
  user:
    password: h5M0FtUUIflBSdI7
    username: admin
```
```shell
kubectl config current-context
```
```
lithe-cocoa-92103_kubernetes
```

مرحله بعدی تعریف یک context برای کلاینت kubectl است تا در هر فضای نام کار کند. مقدار فیلدهای "cluster" و "user" از context فعلی رونوشت می‌شود.

```shell
kubectl config set-context dev --namespace=development \
  --cluster=lithe-cocoa-92103_kubernetes \
  --user=lithe-cocoa-92103_kubernetes

kubectl config set-context prod --namespace=production \
  --cluster=lithe-cocoa-92103_kubernetes \
  --user=lithe-cocoa-92103_kubernetes
```

به‌طور پیش‌فرض، دستورات بالا دو context را اضافه می‌کنند که در پرونده «.kube/config» ذخیره می‌شوند. اکنون می‌توانید contextها را مشاهده کنید و بسته به فضای نامی که می‌خواهید با آن کار کنید، متناوب با دو context درخواستی جدید جایگزین کنید.

برای مشاهده‌ی context‌های جدید:

```shell
kubectl config view
```
```yaml
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: REDACTED
    server: https://130.211.122.180
  name: lithe-cocoa-92103_kubernetes
contexts:
- context:
    cluster: lithe-cocoa-92103_kubernetes
    user: lithe-cocoa-92103_kubernetes
  name: lithe-cocoa-92103_kubernetes
- context:
    cluster: lithe-cocoa-92103_kubernetes
    namespace: development
    user: lithe-cocoa-92103_kubernetes
  name: dev
- context:
    cluster: lithe-cocoa-92103_kubernetes
    namespace: production
    user: lithe-cocoa-92103_kubernetes
  name: prod
current-context: lithe-cocoa-92103_kubernetes
kind: Config
preferences: {}
users:
- name: lithe-cocoa-92103_kubernetes
  user:
    client-certificate-data: REDACTED
    client-key-data: REDACTED
    token: 65rZW78y8HbwXXtSXuUw9DbP4FLjHi4b
- name: lithe-cocoa-92103_kubernetes-basic-auth
  user:
    password: h5M0FtUUIflBSdI7
    username: admin
```

بیایید به فضای نام «development» تغییر دهیم.

```shell
kubectl config use-context dev
```

شما می‌توانید با انجام موارد زیر، context فعلی خود را تأیید کنید:

```shell
kubectl config current-context
```
```
dev
```

در این مرحله، تمام درخواست‌هایی که از خط فرمان به خوشه (cluster) کوبرنتیز ارسال می‌کنیم، در فضای نام `development` قرار می‌گیرند.

بیایید چند محتوا ایجاد کنیم.

{{% code_sample file="admin/snowflake-deployment.yaml" %}}

تغییرات را برای ایجاد یک استقرار اعمال کنید 

```shell
kubectl apply -f https://k8s.io/examples/admin/snowflake-deployment.yaml
```
ما یک استقرار با اندازه رونوشت ۲ عدد پاد ایجاد کرده‌ایم که پادی به نام `snowflake` را با یک کانتینر پایه که نام میزبان را ارائه می‌دهد، اجرا می‌کند.
```shell
kubectl get deployment
```
```
NAME         READY   UP-TO-DATE   AVAILABLE   AGE
snowflake    2/2     2            2           2m
```

```shell
kubectl get pods -l app=snowflake
```
```
NAME                         READY     STATUS    RESTARTS   AGE
snowflake-3968820950-9dgr8   1/1       Running   0          2m
snowflake-3968820950-vgc4n   1/1       Running   0          2m
```

و این عالی است، توسعه‌دهندگان می‌توانند هر کاری که می‌خواهند انجام دهند و لازم نیست نگران تأثیرگذاری بر محتوا در فضای نام «تولید» باشند.

بیایید به فضای نام `production` برویم و نشان دهیم که چگونه منابع موجود در یک فضای نام از فضای نام دیگر پنهان می‌شوند.

```shell
kubectl config use-context prod
```

فضای نام `production` باید خالی باشد و دستورات زیر نباید چیزی را برگردانند.

```shell
kubectl get deployment
kubectl get pods
```

بخش تولید دوست دارد گاوها را اداره کند، پس بیایید چند گاوداری ایجاد کنیم.

```shell
kubectl create deployment cattle --image=registry.k8s.io/serve_hostname --replicas=5

kubectl get deployment
```
```
NAME         READY   UP-TO-DATE   AVAILABLE   AGE
cattle       5/5     5            5           10s
```

```shell
kubectl get pods -l app=cattle
```
```
NAME                      READY     STATUS    RESTARTS   AGE
cattle-2263376956-41xy6   1/1       Running   0          34s
cattle-2263376956-kw466   1/1       Running   0          34s
cattle-2263376956-n4v97   1/1       Running   0          34s
cattle-2263376956-p5p3i   1/1       Running   0          34s
cattle-2263376956-sxpth   1/1       Running   0          34s
```

در این مرحله، باید مشخص شده باشد که منابعی که کاربران در یک فضای نام ایجاد می‌کنند، از فضای نام دیگر پنهان هستند.

با تکامل پشتیبانی از سیاست در کوبرنتیز، این سناریو را گسترش خواهیم داد تا نشان دهیم چگونه می‌توانید قوانین مجوز متفاوتی را برای هر فضای نام ارائه دهید.


