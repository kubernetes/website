---
title: اعمال استانداردهای امنیتی Pod در سطح فضای نام
content_type: tutorial
weight: 20
---

{{% alert title="Note" %}}
این آموزش فقط برای خوشه‌های جدید کاربرد دارد.
{{% /alert %}}

Pod Security Admission یک کنترل‌کننده پذیرش است که هنگام ایجاد پادها،
[استانداردهای امنیت پاد](/docs/concepts/security/pod-security-standards/) را اعمال می‌کند.
این قابلیت در نسخه ۱٫۲۵ به وضعیت GA (عرضه عمومی) رسید.  
در این آموزش، استاندارد امنیت پاد `baseline` را به‌صورت جداگانه روی هر فضای نام اعمال خواهید کرد.

همچنین می‌توانید استانداردهای امنیت پاد را در سطح خوشه و به‌طور هم‌زمان روی چند فضای نام اعمال کنید.  
برای دستورالعمل‌ها، به
[اعمال استانداردهای امنیت پاد در سطح خوشه](/docs/tutorials/security/cluster-level-pss/) مراجعه کنید.

## {{% heading "prerequisites" %}}

موارد زیر را روی ایستگاه کاری خود نصب کنید:

- [kind](https://kind.sigs.k8s.io/docs/user/quick-start/#installation)
- [kubectl](/docs/tasks/tools/)

## ساخت خوشه

1. یک خوشه `kind` به صورت زیر ایجاد کنید:

   ```shell
   kind create cluster --name psa-ns-level
   ```

   خروجی مشابه این است:

   ```
   Creating cluster "psa-ns-level" ...
    ✓ Ensuring node image (kindest/node:v{{< skew currentPatchVersion >}}) 🖼 
    ✓ Preparing nodes 📦  
    ✓ Writing configuration 📜 
    ✓ Starting control-plane 🕹️ 
    ✓ Installing CNI 🔌 
    ✓ Installing StorageClass 💾 
   Set kubectl context to "kind-psa-ns-level"
   You can now use your cluster with:
    
   kubectl cluster-info --context kind-psa-ns-level
    
   Not sure what to do next? 😅  Check out https://kind.sigs.k8s.io/docs/user/quick-start/
   ```

1. زمینه kubectl را روی خوشه جدید تنظیم کنید:

   ```shell
   kubectl cluster-info --context kind-psa-ns-level
   ```
   خروجی مشابه این است:

   ```
   Kubernetes control plane is running at https://127.0.0.1:50996
   CoreDNS is running at https://127.0.0.1:50996/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
    
   To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
   ```

## ساخت فضای نام

یک فضای نام جدید به نام `example` ایجاد کنید:

```shell
kubectl create ns example
```

خروجی مشابه این است:

```
namespace/example created
```

## فعال کردن استانداردهای امنیتی پاد برای بررسی آن فضای نام

1. استانداردهای امنیتی پاد را در این فضای نام با استفاده از برچسب‌های پشتیبانی‌شده توسط پذیرش امنیتی پاد داخلی فعال کنید. در این مرحله، بررسی را پیکربندی خواهید کرد تا به پادهایی که آخرین نسخه استاندارد امنیتی پاد _baseline_ را رعایت نمی‌کنند، هشدار دهد.

   ```shell
   kubectl label --overwrite ns example \
      pod-security.kubernetes.io/warn=baseline \
      pod-security.kubernetes.io/warn-version=latest
   ```

2. شما می‌توانید با استفاده از برچسب‌ها، چندین بررسی استاندارد امنیتی پاد را روی هر فضای نامی پیکربندی کنید.
دستور زیر استاندارد امنیتی پاد «پایه» را «اجرا» می‌کند، اما استانداردهای امنیتی پاد «محدود» را مطابق با آخرین نسخه «هشدار» و «ممیزی» می‌دهد (مقدار پیش‌فرض)

   ```shell
   kubectl label --overwrite ns example \
     pod-security.kubernetes.io/enforce=baseline \
     pod-security.kubernetes.io/enforce-version=latest \
     pod-security.kubernetes.io/warn=restricted \
     pod-security.kubernetes.io/warn-version=latest \
     pod-security.kubernetes.io/audit=restricted \
     pod-security.kubernetes.io/audit-version=latest
   ```

## اجرای استاندارد امنیت پاد را تأیید کنید

1. یک پاد پایه در فضای نام `example` ایجاد کنید:

   ```shell
   kubectl apply -n example -f https://k8s.io/examples/security/example-baseline-pod.yaml
   ```
   پاد بدون مشکل شروع به کار می‌کند؛ خروجی شامل یک هشدار است. برای مثال:

   ```
   Warning: would violate PodSecurity "restricted:latest": allowPrivilegeEscalation != false (container "nginx" must set securityContext.allowPrivilegeEscalation=false), unrestricted capabilities (container "nginx" must set securityContext.capabilities.drop=["ALL"]), runAsNonRoot != true (pod or container "nginx" must set securityContext.runAsNonRoot=true), seccompProfile (pod or container "nginx" must set securityContext.seccompProfile.type to "RuntimeDefault" or "Localhost")
   pod/nginx created
   ```

1. یک پاد پایه در فضای نام `default` ایجاد کنید:

   ```shell
   kubectl apply -n default -f https://k8s.io/examples/security/example-baseline-pod.yaml
   ```
   خروجی مشابه این است:

   ```
   pod/nginx created
   ```

تنظیمات اعمال و هشدارهای استانداردهای امنیت پاد فقط بر روی نام‌فضای `example` اعمال شدند.  
می‌توانید همان پاد را در نام‌فضای `default` ایجاد کنید بدون آنکه هشدار دریافت کنید.

## تمیز کردن

حالا با اجرای دستور زیر، خوشه‌ای که در بالا ایجاد کردید را حذف کنید:

```shell
kind delete cluster --name psa-ns-level
```

## {{% heading "whatsnext" %}}

- یک
  [اسکریپت شِل](/examples/security/kind-with-namespace-level-baseline-pod-security.sh)
  اجرا کنید تا همه مراحل بالا را یکجا انجام دهد.

  1. ایجاد یک خوشه kind
  2. ایجاد یک نام‌فضای جدید
  3. اعمال استاندارد امنیت پاد `baseline` در حالت `enforce` و همزمان اعمال
     استاندارد امنیت پاد `restricted` در حالت‌های `warn` و `audit`
  4. ایجاد یک پاد جدید با استانداردهای امنیت پاد زیر:

- [پذیرش امنیت پاد](/docs/concepts/security/pod-security-admission/)
- [استانداردهای امنیتی پاد](/docs/concepts/security/pod-security-standards/)
- [اعمال استانداردهای امنیت پاد در سطح خوشه](/docs/tutorials/security/cluster-level-pss/)
