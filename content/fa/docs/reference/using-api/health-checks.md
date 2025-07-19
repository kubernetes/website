---
title: Kubernetes API health endpoints
reviewers:
- logicalhan
content_type: concept
weight: 50
---

<!-- overview -->
Kubernetes {{< glossary_tooltip term_id="kube-apiserver" text="API server" >}} نقاط پایانی API را برای نشان دادن وضعیت فعلی سرور API ارائه می‌دهد.
این صفحه این نقاط پایانی API را شرح می‌دهد و نحوه استفاده از آنها را توضیح می‌دهد.
<!-- body -->

## API endpoints for health

سرور API کوبرنتیز ۳ نقطه پایانی API (`healthz`، `livez` و `readyz`) را برای نشان دادن وضعیت فعلی سرور API ارائه می‌دهد. نقطه پایانی `healthz` منسوخ شده است (از Kubernetes نسخه ۱.۱۶) و شما باید به جای آن از نقاط پایانی خاص‌تر `livez` و `readyz` استفاده کنید.
نقطه پایانی `livez` را می‌توان با `--livez-grace-period` [flag](/docs/reference/command-line-tools-reference/kube-apiserver) برای مشخص کردن مدت زمان راه‌اندازی استفاده کرد.
برای خاموش کردن مناسب، می‌توانید `--shutdown-delay-duration` [flag](/docs/reference/command-line-tools-reference/kube-apiserver) را با نقطه پایانی `/readyz` مشخص کنید. ماشین‌هایی که `healthz`/`livez`/`readyz` سرور API را بررسی می‌کنند، باید به کد وضعیت HTTP تکیه کنند. کد وضعیت `200` نشان می‌دهد که سرور API بسته به نقطه پایانی فراخوانی شده، `healthy`/`live`/`ready` است.
گزینه‌های طولانی‌تر نشان داده شده در زیر برای استفاده توسط اپراتورهای انسانی برای اشکال‌زدایی خوشه خود یا درک وضعیت سرور API در نظر گرفته شده‌اند.

مثال‌های زیر نحوه تعامل با نقاط پایانی API سلامت را نشان می‌دهند.
برای همه نقاط پایانی، می‌توانید از پارامتر `verbose` برای چاپ بررسی‌ها و وضعیت آنها استفاده کنید.
این می‌تواند برای یک اپراتور انسانی جهت اشکال‌زدایی وضعیت فعلی سرور API مفید باشد، اما قرار نیست توسط یک ماشین مصرف شود:

```shell
curl -k https://localhost:6443/livez?verbose
```

or from a remote host with authentication:

```shell
kubectl get --raw='/readyz?verbose'
```

The output will look like this:

    [+]ping ok
    [+]log ok
    [+]etcd ok
    [+]poststarthook/start-kube-apiserver-admission-initializer ok
    [+]poststarthook/generic-apiserver-start-informers ok
    [+]poststarthook/start-apiextensions-informers ok
    [+]poststarthook/start-apiextensions-controllers ok
    [+]poststarthook/crd-informer-synced ok
    [+]poststarthook/bootstrap-controller ok
    [+]poststarthook/rbac/bootstrap-roles ok
    [+]poststarthook/scheduling/bootstrap-system-priority-classes ok
    [+]poststarthook/start-cluster-authentication-info-controller ok
    [+]poststarthook/start-kube-aggregator-informers ok
    [+]poststarthook/apiservice-registration-controller ok
    [+]poststarthook/apiservice-status-available-controller ok
    [+]poststarthook/kube-apiserver-autoregistration ok
    [+]autoregister-completion ok
    [+]poststarthook/apiservice-openapi-controller ok
    healthz check passed

The Kubernetes API server also supports to exclude specific checks.
The query parameters can also be combined like in this example:

```shell
curl -k 'https://localhost:6443/readyz?verbose&exclude=etcd'
```

The output show that the `etcd` check is excluded:

    [+]ping ok
    [+]log ok
    [+]etcd excluded: ok
    [+]poststarthook/start-kube-apiserver-admission-initializer ok
    [+]poststarthook/generic-apiserver-start-informers ok
    [+]poststarthook/start-apiextensions-informers ok
    [+]poststarthook/start-apiextensions-controllers ok
    [+]poststarthook/crd-informer-synced ok
    [+]poststarthook/bootstrap-controller ok
    [+]poststarthook/rbac/bootstrap-roles ok
    [+]poststarthook/scheduling/bootstrap-system-priority-classes ok
    [+]poststarthook/start-cluster-authentication-info-controller ok
    [+]poststarthook/start-kube-aggregator-informers ok
    [+]poststarthook/apiservice-registration-controller ok
    [+]poststarthook/apiservice-status-available-controller ok
    [+]poststarthook/kube-apiserver-autoregistration ok
    [+]autoregister-completion ok
    [+]poststarthook/apiservice-openapi-controller ok
    [+]shutdown ok
    healthz check passed

## Individual health checks

{{< feature-state state="alpha" >}}

هر بررسی سلامت جداگانه، یک نقطه پایانی HTTP را در معرض نمایش قرار می‌دهد و می‌تواند به صورت جداگانه بررسی شود.
طرحواره بررسی‌های سلامت جداگانه `/livez/<healthcheck-name>` یا `/readyz/<healthcheck-name>` است، که در آن `livez` و `readyz` می‌توانند به ترتیب برای نشان دادن اینکه آیا می‌خواهید زنده بودن یا آمادگی سرور API را بررسی کنید، استفاده شوند.
مسیر `<healthcheck-name>` را می‌توان با استفاده از پرچم `verbose` از بالا کشف کرد و مسیر بین `[+]` و `ok` را در پیش گرفت.
این بررسی‌های سلامت جداگانه نباید توسط ماشین‌ها مصرف شوند، اما می‌توانند برای یک اپراتور انسانی برای اشکال‌زدایی سیستم مفید باشند:

```shell
curl -k https://localhost:6443/livez/etcd
```
