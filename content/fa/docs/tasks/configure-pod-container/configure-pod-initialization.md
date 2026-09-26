---
title: پیکربندی مقداردهی اولیه‌ی پاد
content_type: task
weight: 170
---

<!-- overview -->

این صفحه نشان می‌دهد که چگونه با استفاده از یک Init Container، پیش از اجرای
کانتینر برنامه، یک پاد را مقداردهی اولیه کنید.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## ساخت پادی که یک Init Container دارد

در این تمرین، پادی می‌سازید که یک کانتینر برنامه و یک Init Container دارد.
کانتینر init پیش از آغاز کانتینر برنامه، اجرای خود را تا پایان کامل می‌کند.

فایل پیکربندی این پاد به این صورت است:

{{% code_sample file="pods/init-containers.yaml" %}}

در فایل پیکربندی می‌بینید که پاد یک Volume دارد که کانتینر init و کانتینر برنامه
آن را با هم به اشتراک می‌گذارند.

کانتینر init این Volume مشترک را در مسیر `/work-dir` و کانتینر برنامه آن را در
مسیر `/usr/share/nginx/html` mount می‌کند. کانتینر init فرمان زیر را اجرا می‌کند
و سپس خاتمه می‌یابد:

```shell
wget -O /work-dir/index.html http://info.cern.ch
```

توجه کنید که کانتینر init فایل `index.html` را در مسیر ریشه(root) سرور nginx
می‌نویسد.

پاد را بسازید:

```shell
kubectl apply -f https://k8s.io/examples/pods/init-containers.yaml
```

بررسی کنید که کانتینر nginx در حال اجرا باشد:

```shell
kubectl get pod init-demo
```

خروجی نشان می‌دهد که کانتینر nginx در حال اجراست:

```
NAME        READY     STATUS    RESTARTS   AGE
init-demo   1/1       Running   0          1m
```

یک shell در کانتینر nginx که داخل پاد init-demo اجرا می‌شود باز کنید:

```shell
kubectl exec -it init-demo -- /bin/bash
```

در shell خود، یک درخواست GET به سرور nginx بفرستید:

```
root@nginx:~# apt-get update
root@nginx:~# apt-get install curl
root@nginx:~# curl localhost
```

خروجی نشان می‌دهد که nginx صفحه‌ی وبی را که کانتینر init نوشته است، ارائه می‌دهد:

```html
<html><head></head><body><header>
<title>http://info.cern.ch</title>
</header>

<h1>http://info.cern.ch - home of the first website</h1>
  ...
  <li><a href="http://info.cern.ch/hypertext/WWW/TheProject.html">Browse the first website</a></li>
  ...
```

## {{% heading "whatsnext" %}}

* درباره‌ی
  [ارتباط بین کانتینرهای در حال اجرا در یک پاد](/docs/tasks/access-application-cluster/communicate-containers-same-pod-shared-volume/)
  بیشتر بدانید.
* درباره‌ی [کانتینرهای init](/docs/concepts/workloads/pods/init-containers/) بیشتر بدانید.
* درباره‌ی [Volumeها](/docs/concepts/storage/volumes/) بیشتر بدانید.
* درباره‌ی [اشکال‌زدایی کانتینرهای init](/docs/tasks/debug/debug-application/debug-init-containers/) بیشتر بدانید.
