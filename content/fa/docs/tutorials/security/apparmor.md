---
reviewers:
- xirehat
title: محدود کردن دسترسی کانتینر به منابع با AppArmor
content_type: tutorial
weight: 30
---

<!-- overview -->

{{< feature-state feature_gate_name="AppArmor" >}}

این صفحه به شما نشان می‌دهد که چگونه پروفایل‌های AppArmor را روی گره‌های خود بارگذاری کنید و آن پروفایل‌ها را در Pods اعمال کنید. برای کسب اطلاعات بیشتر در مورد اینکه چگونه Kubernetes می‌تواند Pods را با استفاده از AppArmor محدود کند، به [محدودیت‌های امنیتی هسته لینوکس برای پادها و کانتینرها](/docs/concepts/security/linux-kernel-security-constraints/#apparmor) مراجعه کنید.

## {{% heading "objectives" %}}


* مثالی از نحوه بارگذاری یک پروفایل در یک گره را ببینید
* یاد بگیرید که چگونه پروفایل را در یک پاد اجرا کنید
* یاد بگیرید که چگونه بررسی کنید که پروفایل بارگذاری شده است
* ببینید چه اتفاقی می‌افتد وقتی یک پروفایل نقض می‌شود
* ببینید چه اتفاقی می‌افتد وقتی یک پروفایل نمی‌تواند بارگذاری شود


## {{% heading "prerequisites" %}}


AppArmor یک ماژول اختیاری هسته و قابلیتی در کوبرنتیز است؛ بنابراین پیش از ادامه، مطمئن شوید که روی
گره‌های شما پشتیبانی می‌شود:

1. ماژول هسته AppArmor فعال است — برای آن‌که هسته لینوکس بتواند یک پروفایل AppArmor را اعمال کند،
   ماژول هسته AppArmor باید نصب و فعال باشد. چندین توزیع این ماژول را به‌صورت پیش‌فرض فعال می‌کنند،
   مانند Ubuntu و SUSE، و بسیاری دیگر پشتیبانی اختیاری ارائه می‌دهند. برای بررسی فعال بودن ماژول،
   فایل `/sys/module/apparmor/parameters/enabled` را بررسی کنید:

   ```shell
   cat /sys/module/apparmor/parameters/enabled
   Y
   ```

   kubelet پیش از پذیرش پادی که به‌طور صریح با AppArmor پیکربندی شده باشد،
   بررسی می‌کند که AppArmor روی میزبان فعال باشد.

1. زمان اجرای کانتینر از AppArmor پشتیبانی می‌کند — همه زمان‌اجرای‌های کانتینری
   متداول که کوبرنتیز پشتیبانی می‌کند باید از AppArmor پشتیبانی کنند، از جمله
   {{< glossary_tooltip term_id="containerd" >}} و
   {{< glossary_tooltip term_id="cri-o" >}}. لطفاً به مستندات زمانِ اجرای مربوطه
   مراجعه کرده و اطمینان حاصل کنید که خوشه شرایط لازم برای استفاده از AppArmor
   را دارد.

1. پروفایل بارگذاری شده است — AppArmor با مشخص‌کردن پروفایل AppArmor برای هر
   کانتینر روی یک پاد اعمال می‌شود. اگر هر یک از پروفایل‌های تعیین‌شده در هسته
   بارگذاری نشده باشد، kubelet پاد را رد می‌کند. می‌توانید با بررسی فایل
   `/sys/kernel/security/apparmor/profiles` ببینید کدام پروفایل‌ها روی یک گره
   بارگذاری شده‌اند. برای مثال:

   ```shell
   ssh gke-test-default-pool-239f5d02-gyn2 "sudo cat /sys/kernel/security/apparmor/profiles | sort"
   ```
   ```
   apparmor-test-deny-write (enforce)
   apparmor-test-audit-write (enforce)
   docker-default (enforce)
   k8s-nginx (enforce)
   ```

   برای جزئیات بیشتر درباره بارگذاری پروفایل‌ها روی گره‌ها، به
   [راه‌اندازی گره‌ها با پروفایل](#setting-up-nodes-with-profiles) مراجعه کنید.

<!-- lessoncontent -->

## ایمن‌سازی یک پاد

{{< note >}}
پیش از Kubernetes نسخه v1.30، AppArmor از طریق annotationها مشخص می‌شد. با استفاده از انتخابگر نسخه
مستندات، می‌توانید مستندات مربوط به این API منسوخ‌شده را مشاهده کنید.
{{< /note >}}

پروفایل‌های AppArmor را می‌توان در سطح pod یا سطح container مشخص کرد. پروفایل AppArmor کانتینر بر پروفایل pod اولویت دارد.

```yaml
securityContext:
  appArmorProfile:
    type: <profile_type>
```

در این‌جا مقدار `<profile_type>` می‌تواند یکی از گزینه‌های زیر باشد:

* `RuntimeDefault` برای استفاده از پروفایل پیش‌فرض زمان‌اجرا
* `Localhost` برای استفاده از پروفایلی که روی میزبان بارگذاری شده است (نگاه کنید به پایین)
* `Unconfined` برای اجرا بدون AppArmor

برای آگاهی از جزئیات کامل API پروفایل AppArmor، به
[مشخص‌کردن محدودسازی AppArmor](#specifying-apparmor-confinement) مراجعه کنید.

برای اطمینان از این‌که پروفایل اعمال شده است، می‌توانید با بررسی ویژگی proc
فرآیند ریشه کانتینر، ببینید که با پروفایل درست اجرا می‌شود:

```shell
kubectl exec <pod_name> -- cat /proc/1/attr/current
```

خروجی باید چیزی شبیه به این باشد:

```
cri-containerd.apparmor.d (enforce)
```

## مثال

*این مثال فرض می‌کند که شما قبلاً خوشهی با پشتیبانی از AppArmor راه‌اندازی کرده‌اید.*

ابتدا، پروفایلی را که می‌خواهید استفاده کنید روی گره‌های خود بارگذاری کنید. این پروفایل همه عملیات نوشتن روی فایل را مسدود می‌کند:

```
#include <tunables/global>

profile k8s-apparmor-example-deny-write flags=(attach_disconnected) {
  #include <abstractions/base>

  file,

  # Deny all file writes.
  deny /** w,
}
```

پروفایل باید روی همه گره‌ها بارگذاری شود، زیرا نمی‌دانید پاد در کدام گره زمان‌بندی خواهد شد.
در این مثال می‌توانید از SSH برای نصب پروفایل‌ها استفاده کنید، اما رویکردهای دیگری نیز
در [راه‌اندازی گره‌ها با پروفایل](#setting-up-nodes-with-profiles) مطرح شده‌اند.

```shell
# این مثال فرض می‌کند که نام گره‌ها با نام میزبان‌ها مطابقت دارد و از طریق SSH قابل دسترسی هستند.
NODES=($( kubectl get node -o jsonpath='{.items[*].status.addresses[?(.type == "Hostname")].address}' ))

for NODE in ${NODES[*]}; do ssh $NODE 'sudo apparmor_parser -q <<EOF
#include <tunables/global>

profile k8s-apparmor-example-deny-write flags=(attach_disconnected) {
  #include <abstractions/base>

  file,

  # Deny all file writes.
  deny /** w,
}
EOF'
done
```

سپس، یک پاد ساده‌ی "Hello AppArmor" را با پروفایل deny-write اجرا کنید:

{{% code_sample file="pods/security/hello-apparmor.yaml" %}}

```shell
kubectl create -f hello-apparmor.yaml
```

شما می‌توانید با بررسی `/proc/1/attr/current` تأیید کنید که کانتینر واقعاً با آن پروفایل در حال اجرا است:

```shell
kubectl exec hello-apparmor -- cat /proc/1/attr/current
```

خروجی باید این باشد:
```
k8s-apparmor-example-deny-write (enforce)
```

در نهایت، می‌توانید ببینید اگر با نوشتن در یک فایل، پروفایل را نقض کنید چه اتفاقی می‌افتد:

```shell
kubectl exec hello-apparmor -- touch /tmp/test
```
```
touch: /tmp/test: Permission denied
error: error executing remote command: command terminated with non-zero exit code: Error executing in Docker Container: 1
```

برای جمع‌بندی، ببینید اگر سعی کنید نمایه‌ای را مشخص کنید که بارگذاری نشده است، چه اتفاقی می‌افتد:

```shell
kubectl create -f /dev/stdin <<EOF
apiVersion: v1
kind: Pod
metadata:
  name: hello-apparmor-2
spec:
  securityContext:
    appArmorProfile:
      type: Localhost
      localhostProfile: k8s-apparmor-example-allow-write
  containers:
  - name: hello
    image: busybox:1.28
    command: [ "sh", "-c", "echo 'Hello AppArmor!' && sleep 1h" ]
EOF
```
```
pod/hello-apparmor-2 created
```

اگرچه Pod با موفقیت ایجاد شد، بررسی بیشتر نشان می‌دهد که در وضعیت pending گیر کرده است:

```shell
kubectl describe pod hello-apparmor-2
```
```
Name:          hello-apparmor-2
Namespace:     default
Node:          gke-test-default-pool-239f5d02-x1kf/10.128.0.27
Start Time:    Tue, 30 Aug 2016 17:58:56 -0700
Labels:        <none>
Annotations:   container.apparmor.security.beta.kubernetes.io/hello=localhost/k8s-apparmor-example-allow-write
Status:        Pending
... 
Events:
  Type     Reason     Age              From               Message
  ----     ------     ----             ----               -------
  Normal   Scheduled  10s              default-scheduler  Successfully assigned default/hello-apparmor to gke-test-default-pool-239f5d02-x1kf
  Normal   Pulled     8s               kubelet            Successfully pulled image "busybox:1.28" in 370.157088ms (370.172701ms including waiting)
  Normal   Pulling    7s (x2 over 9s)  kubelet            Pulling image "busybox:1.28"
  Warning  Failed     7s (x2 over 8s)  kubelet            Error: failed to get container spec opts: failed to generate apparmor spec opts: apparmor profile not found k8s-apparmor-example-allow-write
  Normal   Pulled     7s               kubelet            Successfully pulled image "busybox:1.28" in 90.980331ms (91.005869ms including waiting)
```

یک رویداد، پیام خطا را به همراه دلیل آن ارائه می‌دهد، که نحوه‌ی بیان آن وابسته به زمان اجرا است:
```
  Warning  Failed     7s (x2 over 8s)  kubelet            Error: failed to get container spec opts: failed to generate apparmor spec opts: apparmor profile not found 
```

## اداره کردن

### راه‌اندازی گره‌ها با پروفایل‌ها

Kubernetes {{< skew currentVersion >}} هیچ سازوکار داخلی برای بارگذاری پروفایل‌های AppArmor روی
گره‌ها در اختیار نمی‌گذارد. می‌توان پروفایل‌ها را از طریق زیرساخت سفارشی یا ابزارهایی مانند
[Kubernetes Security Profiles Operator](https://github.com/kubernetes-sigs/security-profiles-operator)
بارگذاری کرد.

زمان‌بند از این‌که کدام پروفایل روی کدام گره بارگذاری شده است آگاه نیست؛ بنابراین مجموعه کامل
پروفایل‌ها باید روی هر گره بارگذاری شود.  رویکرد جایگزین این است که برای هر پروفایل (یا دسته‌ای
از پروفایل‌ها) یک برچسب گره اضافه کنید و با استفاده از
[node selector](/docs/concepts/scheduling-eviction/assign-pod-node/)
اطمینان حاصل کنید که پاد روی گره‌ای اجرا شود که پروفایل مورد نیاز را دارد.

## ایجاد پروفایل‌ها

دریافت و مشخص‌کردن صحیح پروفایل‌های AppArmor می‌تواند کار دشواری باشد. خوشبختانه ابزارهایی برای کمک به این کار وجود دارد:

* `aa-genprof` و `aa-logprof` با نظارت بر فعالیت برنامه و لاگ‌ها، قوانین پروفایل را ایجاد کرده و اقداماتی را که انجام می‌شود مجاز می‌کنند. دستورالعمل‌های بیشتر در [مستندات AppArmor](https://gitlab.com/apparmor/apparmor/wikis/Profiling_with_tools) ارائه شده است.
* [bane](https://github.com/jfrazelle/bane) یک تولیدکننده پروفایل AppArmor برای Docker است که از زبان پروفایل ساده‌شده استفاده می‌کند.

برای اشکال‌زدایی مشکلات AppArmor می‌توانید لاگ‌های سیستم را بررسی کنید تا ببینید دقیقاً چه عملی رد شده است. AppArmor پیام‌های مفصلی را در `dmesg` ثبت می‌کند و خطاها معمولاً در لاگ‌های سیستم یا از طریق `journalctl` قابل یافتن هستند. اطلاعات بیشتر در [خرابی‌های AppArmor](https://gitlab.com/apparmor/apparmor/wikis/AppArmor_Failures) موجود است.


## مشخص‌کردن محدودسازی AppArmor

{{< caution >}}
پیش از Kubernetes نسخه v1.30، AppArmor از طریق annotationها مشخص می‌شد. با استفاده از انتخابگر نسخه مستندات می‌توانید مستندات مربوط به این API منسوخ‌شده را مشاهده کنید.
{{< /caution >}}

### پروفایل AppArmor درون securityContext {#appArmorProfile}

می‌توانید `appArmorProfile` را در `securityContext` یک کانتینر یا در `securityContext` یک پاد مشخص کنید.  
اگر پروفایل در سطح پاد تنظیم شود، به‌عنوان پروفایل پیش‌فرض برای همه کانتینرهای پاد (شامل init، sidecar و ephemeral containerها) به کار می‌رود.  
اگر هم در سطح پاد و هم در سطح کانتینر پروفایل AppArmor تعیین شده باشد، پروفایل کانتینر ملاک خواهد بود.

یک پروفایل AppArmor دو فیلد دارد:

`type` _(required)_ — تعیین می‌کند چه نوع پروفایل AppArmor اعمال خواهد شد. گزینه‌های معتبر:

`Localhost`
: پروفایلی که از پیش روی گره بارگذاری شده است (به‌وسیله `localhostProfile` مشخص می‌شود).

`RuntimeDefault`
: پروفایل پیش‌فرض زمان‌اجرای کانتینر.

`Unconfined`
: بدون اِعمال محدودیت‌های AppArmor.

`localhostProfile` — نام پروفایلی که روی گره بارگذاری شده و باید استفاده شود.  
پروفایل باید از پیش روی گره پیکربندی شده باشد. این گزینه دقیقاً زمانی باید ارائه شود که مقدار `type` برابر `Localhost` باشد.


## {{% heading "whatsnext" %}}

منابع بیشتر:

* [راهنمای سریع زبان پروفایل AppArmor](https://gitlab.com/apparmor/apparmor/wikis/QuickProfileLanguage)
* [مرجع سیاست‌های اصلی AppArmor](https://gitlab.com/apparmor/apparmor/wikis/Policy_Layout)
