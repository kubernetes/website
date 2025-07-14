---
reviewers:
  - xirehat
title: کلاس زمان اجرا
content_type: concept
weight: 30
hide_summary: true # Listed separately in section index
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

این صفحه مکانیزم انتخاب منبع و زمان اجرا در RuntimeClass را شرح می‌دهد.

RuntimeClass قابلیتی برای انتخاب پیکربندی زمان اجرای کانتینر است. پیکربندی زمان اجرای کانتینر برای اجرای کانتینرهای یک Pod استفاده می‌شود.

<!-- body -->

## انگیزه

شما می‌توانید یک RuntimeClass متفاوت بین Podهای مختلف تنظیم کنید تا تعادلی بین عملکرد و امنیت برقرار شود. به عنوان مثال، اگر بخشی از حجم کاری شما نیاز به سطح بالایی از تضمین امنیت اطلاعات دارد، می‌توانید آن Podها را طوری زمان‌بندی کنید که در یک زمان اجرای کانتینر که از مجازی‌سازی سخت‌افزار استفاده می‌کند، اجرا شوند. در این صورت، از ایزوله بودن بیشتر زمان اجرای جایگزین، به قیمت مقداری سربار اضافی، بهره‌مند خواهید شد.

همچنین می‌توانید از RuntimeClass برای اجرای Podهای مختلف با زمان اجرای کانتینر یکسان اما با تنظیمات متفاوت استفاده کنید.

## راه‌اندازی

1. پیکربندی پیاده‌سازی CRI روی گره‌ها (وابسته به زمان اجرا)

2. ایجاد منابع RuntimeClass مربوطه

### 2. پیکربندی پیاده‌سازی CRI روی گره‌ها

پیکربندی‌های موجود از طریق RuntimeClass به پیاده‌سازی رابط زمان اجرای کانتینر (CRI) وابسته هستند. برای نحوه پیکربندی، به مستندات مربوطه ([below](#cri-configuration)) برای پیاده‌سازی CRI خود مراجعه کنید.

{{< note >}}
RuntimeClass به‌طور پیش‌فرض فرض می‌کند که پیکربندی نودها در سراسر خوشه همگن است (به این معنی که همه نودها از نظر زمان‌اجرای کانتینرها به یک شکل پیکربندی شده‌اند). برای پشتیبانی از پیکربندی‌های ناهمگن نود، به بخش [زمان‌بندی](#scheduling) در پایین مراجعه کنید.
{{< /note >}}

پیکربندی‌ها نام `handler` متناظری دارند که توسط RuntimeClass ارجاع داده می‌شود.  
این `handler` باید یک [نام برچسب DNS](/docs/concepts/overview/working-with-objects/names/#dns-label-names) معتبر باشد.

### 2. ایجاد منابع متقابل RuntimeClass

هر یک از پیکربندی‌هایی که در مرحله ۱ تنظیم شدند، باید یک نام `handler` مرتبط داشته باشند که پیکربندی را شناسایی کند. برای هر `handler`، یک شیء RuntimeClass متناظر ایجاد کنید.

منبع RuntimeClass در حال حاضر تنها دو فیلد مهم دارد: نام RuntimeClass (`metadata.name`) و `handler`. تعریف شیء به این صورت است:
```yaml
# RuntimeClass is defined in the node.k8s.io API group
apiVersion: node.k8s.io/v1
kind: RuntimeClass
metadata:
  # The name the RuntimeClass will be referenced by.
  # RuntimeClass is a non-namespaced resource.
  name: myclass 
# The name of the corresponding CRI configuration
handler: myconfiguration 
```

نام یک شیء RuntimeClass باید یک [نام زیردامنه DNS](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names) معتبر باشد.

{{< note >}}
توصیه می‌شود عملیات نوشتن روی RuntimeClass (ایجاد/به‌روزرسانی/پچ/حذف) محدود به مدیر خوشه باشد. این معمولاً پیش‌فرض است. برای جزئیات بیشتر به [مروری بر مجوزدهی](/docs/reference/access-authn-authz/authorization/) مراجعه کنید.
{{< /note >}}

## استفاده

پس از پیکربندی RuntimeClassها برای خوشه، می‌توانید در مشخصات پاد، `runtimeClassName` را برای استفاده از آن تعیین کنید. برای مثال:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  runtimeClassName: myclass
  # ...
```

این دستور به kubelet می‌گوید که برای اجرای این پاد از RuntimeClass مشخص‌شده استفاده کند. اگر RuntimeClass مشخص‌شده وجود نداشته باشد یا CRI نتواند هندلر مربوطه را اجرا کند، پاد وارد [فاز نهایی](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase) `Failed` می‌شود. برای مشاهده پیام خطا، به [رویداد مربوطه](/docs/tasks/debug/debug-application/debug-running-pod/) مراجعه کنید.

اگر `runtimeClassName` مشخص نشود، از RuntimeHandler پیش‌فرض استفاده خواهد شد که معادل رفتار هنگام غیرفعال بودن قابلیت RuntimeClass است.

### پیکربندی CRI

برای جزئیات بیشتر در مورد تنظیم زمان‌اجراهای CRI، به [نصب CRI](/docs/setup/production-environment/container-runtimes/) مراجعه کنید.

#### {{< glossary_tooltip term_id="containerd" >}}

هندلرهای زمان‌اجرا از طریق پیکربندی containerd در مسیر  
`/etc/containerd/config.toml` تعریف می‌شوند. هندلرهای معتبر در بخش `runtimes` پیکربندی می‌شوند:

```
[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.${HANDLER_NAME}]
```

برای مشاهده جزئیات بیشتر به مستندات پیکربندی [containerd](https://github.com/containerd/containerd/blob/main/docs/cri/config.md) مراجعه کنید:

#### {{< glossary_tooltip term_id="cri-o" >}}

هندلرهای زمان‌اجرا از طریق پیکربندی CRI-O در مسیر `/etc/crio/crio.conf` تنظیم می‌شوند. هندلرهای معتبر در جدول [crio.runtime](https://github.com/cri-o/cri-o/blob/master/docs/crio.conf.5.md#crioruntime-table) پیکربندی می‌شوند:

```
[crio.runtime.runtimes.${HANDLER_NAME}]
  runtime_path = "${PATH_TO_BINARY}"
```

برای جزئیات بیشتر به مستندات پیکربندی CRI-O در [اینجا](https://github.com/cri-o/cri-o/blob/master/docs/crio.conf.5.md) مراجعه کنید.

## زمان‌بندی

{{< feature-state for_k8s_version="v1.16" state="beta" >}}

با مشخص کردن فیلد `scheduling` برای یک RuntimeClass، می‌توانید قیدهایی تعریف کنید تا اطمینان حاصل شود پادهایی که با این RuntimeClass اجرا می‌شوند، روی نودهایی زمان‌بندی شوند که از آن پشتیبانی می‌کنند. اگر `scheduling` تنظیم نشود، فرض بر این است که این RuntimeClass توسط همه نودها پشتیبانی می‌شود.

برای اطمینان از اینکه پادها روی نودهای پشتیبانی‌کننده از یک RuntimeClass خاص قرار بگیرند، آن مجموعه نودها باید یک برچسب مشترک داشته باشند که سپس توسط فیلد `runtimeclass.scheduling.nodeSelector` انتخاب شود. nodeSelector مربوط به RuntimeClass در مرحله admission با nodeSelector پاد ترکیب می‌شود و در واقع اشتراک مجموعه نودهای انتخاب‌شده توسط هر دو گرفته می‌شود. اگر تعارضی وجود داشته باشد، پاد رد خواهد شد.

اگر نودهای پشتیبانی‌کننده به‌منظور جلوگیری از اجرای سایر پادهای RuntimeClass روی آن نود، تِینت (taint) شده باشند، می‌توانید `tolerations` را به RuntimeClass اضافه کنید. همانند `nodeSelector`، tolerations نیز در admission با tolerations پاد ترکیب می‌شود و در واقع اجتماع مجموعه نودهای مورد تحمل هر دو گرفته می‌شود.

برای آشنایی بیشتر با پیکربندی node selector و tolerations، به بخش  
[اختصاص پادها به نودها](/docs/concepts/scheduling-eviction/assign-pod-node/)  
مراجعه کنید.

### سربار پاد

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

شما می‌توانید منابع _سربار_ مرتبط با اجرای یک پاد را مشخص کنید. اعلام سربار به خوشه (شامل scheduler) اجازه می‌دهد در تصمیم‌گیری‌ها درباره پادها و منابع، آن را لحاظ کند.

سربار پاد در RuntimeClass از طریق فیلد `overhead` تعریف می‌شود. با استفاده از این فیلد می‌توانید سربار اجرای پادهایی که از این RuntimeClass استفاده می‌کنند را مشخص کرده و اطمینان حاصل کنید که این سربارها در Kubernetes لحاظ شوند.

## {{% heading "whatsnext" %}}

- [طراحی RuntimeClass](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/585-runtime-class/README.md)
- [طراحی زمان‌بندی RuntimeClass](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/585-runtime-class/README.md#runtimeclass-scheduling)
- درباره مفهوم [سربار پاد](/docs/concepts/scheduling-eviction/pod-overhead/) مطالعه کنید
- [طراحی ویژگی PodOverhead](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/688-pod-overhead)

