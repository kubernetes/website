---
reviewers:
- xirehat
title: پیکربندی Redis با استفاده از ConfigMap
content_type: tutorial
weight: 30
---

<!-- overview -->

این صفحه یک نمونهٔ واقعی از نحوه پیکربندی Redis با استفاده از یک ConfigMap ارائه می‌دهد و بر روی وظیفهٔ [پیکربندی یک پاد برای استفاده از یک ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/) بنا شده است.

## {{% heading "objectives" %}}

* یک ConfigMap با مقادیر پیکربندی Redis ایجاد کنید  
* یک پاد Redis ایجاد کنید که ConfigMap ساخته‌شده را mount کرده و از آن استفاده کند  
* بررسی کنید که پیکربندی به‌درستی اعمال شده باشد.  

## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* مثال نشان داده شده در این صفحه با `kubectl` 1.14 و بالاتر کار می‌کند.
* [پیکربندی یک پاد برای استفاده از ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/) را درک کنید.

<!-- lessoncontent -->


## مثال دنیای واقعی: پیکربندی Redis با استفاده از ConfigMap

برای پیکربندی حافظه پنهان Redis با استفاده از داده‌های ذخیره شده در ConfigMap، مراحل زیر را دنبال کنید.

ابتدا یک ConfigMap با یک بلوک پیکربندی خالی ایجاد کنید:

```shell
cat <<EOF >./example-redis-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: example-redis-config
data:
  redis-config: ""
EOF
```

ConfigMap ایجاد شده در بالا را به همراه یک Redis pod manifest اعمال کنید:

```shell
kubectl apply -f example-redis-config.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/pods/config/redis-pod.yaml
```

محتویات فایل Manifest مربوط به Redis pod را بررسی کنید و به موارد زیر توجه کنید:

* یک volume به نام `config` به‌وسیله `spec.volumes[1]` ایجاد می‌شود  
* کلیدهای `key` و `path` در `spec.volumes[1].configMap.items[0]`، کلید `redis-config` را از  
  ConfigMap به نام `example-redis-config` به‌صورت فایلی با نام `redis.conf` روی volume `config` در دسترس قرار می‌دهد.  
* سپس volume `config` با استفاده از `spec.containers[0].volumeMounts[1]` در مسیر `/redis-master` mount می‌شود.  

در نتیجه، دادهٔ موجود در `data.redis-config` از ConfigMap ‌`example-redis-config` داخل پاد به شکل فایل  
`/redis-master/redis.conf` در دسترس خواهد بود.  

{{% code_sample file="pods/config/redis-pod.yaml" %}}

اشیاء ایجاد شده را بررسی کنید:

```shell
kubectl get pod/redis configmap/example-redis-config 
```

شما باید خروجی زیر را ببینید:

```
NAME        READY   STATUS    RESTARTS   AGE
pod/redis   1/1     Running   0          8s

NAME                             DATA   AGE
configmap/example-redis-config   1      14s
```

به یاد داشته باشید که ما کلید `redis-config` را در `example-redis-config` ConfigMap خالی گذاشتیم:

```shell
kubectl describe configmap/example-redis-config
```

شما باید یک کلید خالی `redis-config` را ببینید:

```shell
Name:         example-redis-config
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
redis-config:
```

از `kubectl exec` برای ورود به پاد و اجرای ابزار `redis-cli` برای بررسی پیکربندی فعلی استفاده کنید:

```shell
kubectl exec -it redis -- redis-cli
```

بررسی `maxmemory`:

```shell
127.0.0.1:6379> CONFIG GET maxmemory
```

باید مقدار پیش‌فرض ۰ را نشان دهد:

```shell
1) "maxmemory"
2) "0"
```

به طور مشابه، `maxmemory-policy` را بررسی کنید:

```shell
127.0.0.1:6379> CONFIG GET maxmemory-policy
```

که باید مقدار پیش‌فرض `noeviction` را نیز داشته باشد:

```shell
1) "maxmemory-policy"
2) "noeviction"
```

حالا بیایید برخی از مقادیر پیکربندی را به ConfigMap مربوط به `example-redis-config` اضافه کنیم:

{{% code_sample file="pods/config/example-redis-config.yaml" %}}

ConfigMap به‌روزرسانی‌شده را اعمال کنید:

```shell
kubectl apply -f example-redis-config.yaml
```

تأیید کنید که ConfigMap به‌روزرسانی شده است:

```shell
kubectl describe configmap/example-redis-config
```

شما باید مقادیر پیکربندی که اضافه کردیم را ببینید:

```shell
Name:         example-redis-config
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
redis-config:
----
maxmemory 2mb
maxmemory-policy allkeys-lru
```

دوباره Redis Pod را با استفاده از `redis-cli` از طریق `kubectl exec` بررسی کنید تا ببینید آیا پیکربندی اعمال شده است یا خیر:

```shell
kubectl exec -it redis -- redis-cli
```

بررسی `maxmemory`:

```shell
127.0.0.1:6379> CONFIG GET maxmemory
```

در مقدار پیش‌فرض ۰ باقی می‌ماند:

```shell
1) "maxmemory"
2) "0"
```

به طور مشابه، `maxmemory-policy` در تنظیمات پیش‌فرض `noeviction` باقی می‌ماند:

```shell
127.0.0.1:6379> CONFIG GET maxmemory-policy
```

خروجی:

```shell
1) "maxmemory-policy"
2) "noeviction"
```

مقادیر پیکربندی تغییر نکرده‌اند زیرا پاد برای دریافت مقادیر به‌روزرسانی‌شده از ConfigMaps مرتبط، نیاز به راه‌اندازی مجدد دارد. بیایید پاد را حذف و دوباره ایجاد کنیم:

```shell
kubectl delete pod redis
kubectl apply -f https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/pods/config/redis-pod.yaml
```

حالا برای آخرین بار مقادیر پیکربندی را دوباره بررسی کنید:

```shell
kubectl exec -it redis -- redis-cli
```

بررسی `maxmemory`:

```shell
127.0.0.1:6379> CONFIG GET maxmemory
```

اکنون باید مقدار به‌روزرسانی‌شده‌ی ۲۰۹۷۱۵۲ را برگرداند:

```shell
1) "maxmemory"
2) "2097152"
```

به طور مشابه، `maxmemory-policy` نیز به‌روزرسانی شده است:

```shell
127.0.0.1:6379> CONFIG GET maxmemory-policy
```

اکنون مقدار مورد نظر برای `allkeys-lru` را نشان می‌دهد:

```shell
1) "maxmemory-policy"
2) "allkeys-lru"
```

با حذف منابع ایجاد شده، کارتان را مرتب کنید:

```shell
kubectl delete pod/redis configmap/example-redis-config
```

## {{% heading "whatsnext" %}}

* درباره [ConfigMaps](/docs/tasks/configure-pod-container/configure-pod-configmap/) بیشتر بدانید.
* مثال [به‌روزرسانی پیکربندی از طریق ConfigMap](/docs/tutorials/configuration/updating-configuration-via-a-configmap/) را دنبال کنید.
