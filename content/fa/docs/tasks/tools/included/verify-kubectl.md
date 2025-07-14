---
title: "تایید نصب kubectl"
description: "چگونه Kubectl را تأیید کنیم."
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

برای اینکه kubectl بتواند یک خوشه کوبرنتیز را پیدا کرده و به آن دسترسی پیدا کند، به یک پرونده [kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/) نیاز دارد که به طور خودکار هنگام ایجاد یک خوشه با استفاده از [kube-up.sh](https://github.com/kubernetes/kubernetes/blob/master/cluster/kube-up.sh) یا استقرار موفقیت‌آمیز یک خوشه Minikube ایجاد می‌شود. به طور پیش‌فرض، پیکربندی kubectl در `~/.kube/config` قرار دارد.

با دریافت وضعیت خوشه، بررسی کنید که kubectl به درستی پیکربندی شده باشد:

```shell
kubectl cluster-info
```

اگر پاسخی از URL مشاهده کردید، kubectl به درستی برای دسترسی به خوشه شما پیکربندی شده است.

اگر پیامی مشابه زیر مشاهده کردید، kubectl به درستی پیکربندی نشده است یا قادر به اتصال به خوشه کوبرنتیز نیست.

```
The connection to the server <server-name:port> was refused - did you specify the right host or port?
```

برای مثال، اگر قصد دارید یک خوشه کوبرنتیز را روی لپ‌تاپ خود (به صورت محلی) اجرا کنید، ابتدا به ابزاری مانند [Minikube](https://minikube.sigs.k8s.io/docs/start/) نیاز دارید تا نصب شود و سپس دستورات ذکر شده در بالا را دوباره اجرا کنید.

اگر `kubectl cluster-info` پاسخ url را برمی‌گرداند اما نمی‌توانید به خوشه خود دسترسی پیدا کنید، برای بررسی اینکه آیا به درستی پیکربندی شده است، از دستور زیر استفاده کنید:

```shell
kubectl cluster-info dump
```

### عیب‌یابی پیام خطای «هیچ ارائه‌دهنده مجوزی یافت نشد» {#no-auth-provider-found}

در کوبرنتیز 1.26، kubectl احراز هویت داخلی را برای ارائه دهندگان ابری زیر که کوبرنتیز مدیریت شده ارائه می‌دهند، حذف کرد. این ارائه دهندگان افزونه‌های kubectl را برای ارائه احراز هویت مخصوص ابر منتشر کرده‌اند. برای دستورالعمل‌ها، به مستندات ارائه دهنده زیر مراجعه کنید:

* Azure AKS: [افزونه kubelogin](https://azure.github.io/kubelogin/)
* موتور گوگل کوبرنتیز: [gke-gcloud-auth-plugin](https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-access-for-kubectl#install_plugin)

(همچنین ممکن است دلایل دیگری برای مشاهده همان پیام خطا وجود داشته باشد که به آن تغییر ربطی ندارد.)
