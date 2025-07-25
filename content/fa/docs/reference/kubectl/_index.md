---
title: ابزار خط فرمان (kubectl)
content_type: مرجع
weight: 110
no_list: true
card:
  name: مرجع
  title: ابزار خط فرمان  
  weight: 20
---

<!-- overview -->
{{< glossary_definition prepend="Kubernetes provides a" term_id="kubectl" length="short" >}}

این ابزار «kubectl» نام دارد.

برای پیکربندی، `kubectl` به دنبال فایلی با نام `config` در دایرکتوری `$HOME/.kube` می‌گردد.
شما می‌توانید با تنظیم متغیر محیطی [kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/) یا با تنظیم پرچم `[`--kubeconfig`](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)`، فایل‌های دیگری را مشخص کنید.

این مرور کلی، سینتکس `kubectl` را پوشش می‌دهد، عملیات دستور را شرح می‌دهد و مثال‌های رایج را ارائه می‌دهد.
برای جزئیات بیشتر در مورد هر دستور، شامل تمام پرچم‌ها و زیردستورات پشتیبانی شده، به مستندات مرجع 
[kubectl](/docs/reference/kubectl/generated/kubectl/) مراجعه کنید.

برای دستورالعمل‌های نصب، به [Installing kubectl](/docs/tasks/tools/#kubectl) مراجعه کنید.
برای راهنمای سریع، به [cheat sheet](/docs/reference/kubectl/quick-reference/) مراجعه کنید.
اگر به استفاده از ابزار خط فرمان `docker` عادت دارید، [`kubectl` for Docker Users](/docs/reference/kubectl/docker-cli-to-kubectl/) برخی از دستورات معادل را برای Kubernetes توضیح می‌دهد.

<!-- body -->

## Syntax

برای اجرای دستورات `kubectl` از پنجره ترمینال خود، از سینتکس زیر استفاده کنید:

```shell
kubectl [command] [TYPE] [NAME] [flags]
```

که در آن `command`، `TYPE`، `NAME` و `flags` عبارتند از:

* `command`: عملیاتی را که می‌خواهید روی یک یا چند منبع انجام دهید مشخص می‌کند، برای مثال `create`، `get`، `describe`، `delete`.

* `TYPE`: نوع منبع (#resource-types) را مشخص می‌کند. انواع منابع به حروف کوچک و بزرگ حساس نیستند و می‌توانید حالت مفرد، جمع یا اختصاری آنها را مشخص کنید. برای مثال، دستورات زیر خروجی یکسانی تولید می‌کنند:

  ```shell
  kubectl get pod pod1
  kubectl get pods pod1
  kubectl get po pod1
  ```

* `NAME`: نام منبع را مشخص می‌کند. نام‌ها به حروف کوچک و بزرگ حساس هستند. اگر نام حذف شود، جزئیات همه منابع نمایش داده می‌شود، برای مثال `kubectl get pods`.

هنگام انجام عملیاتی روی چندین منبع، می‌توانید هر منبع را بر اساس نوع و نام مشخص کنید یا یک یا چند فایل را مشخص کنید:


  * برای مشخص کردن منابع بر اساس نوع و نام:

* برای گروه‌بندی منابع اگر همه از یک نوع باشند: `TYPE1 name1 name2 name<#>`.<br/>
مثال: `kubectl get pod example-pod1 example-pod2`

* برای مشخص کردن چندین نوع منبع به صورت جداگانه: `TYPE1/name1 TYPE1/name2 TYPE2/name3 TYPE<#>/name<#>`.<br/>
مثال: `kubectl get pod/example-pod1 replicationcontroller/example-rc1`
 * برای مشخص کردن منابع با یک یا چند فایل: `-f file1 -f file2 -f file<#>`

* [Use YAML rather than JSON](/docs/concepts/configuration/overview/#general-configuration-tips)
زیرا YAML معمولاً کاربرپسندتر است، مخصوصاً برای فایل‌های پیکربندی.<br/>
مثال: `kubectl get -f ./pod.yaml`

* `flags`: پرچم‌های اختیاری را مشخص می‌کند. برای مثال، می‌توانید از پرچم‌های `-s` یا `--server` برای مشخص کردن آدرس و پورت سرور Kubernetes API استفاده کنید.
<br/>

{{< caution >}}
پرچم‌هایی که از خط فرمان مشخص می‌کنید، مقادیر پیش‌فرض و هر متغیر محیطی مربوطه را لغو می‌کنند.
{{< /caution >}}

اگر به کمک نیاز دارید، `kubectl help` را از پنجره ترمینال اجرا کنید.

## احراز هویت درون خوشه و لغو فضای نام

به طور پیش‌فرض، `kubectl` ابتدا بررسی می‌کند که آیا درون یک pod و بنابراین در یک خوشه در حال اجرا است یا خیر. این کار با بررسی متغیرهای محیطی `KUBERNETES_SERVICE_HOST` و `KUBERNETES_SERVICE_PORT` و وجود فایل توکن حساب سرویس در `/var/run/secrets/kubernetes.io/serviceaccount/token` آغاز می‌شود. در صورت وجود هر سه مورد، احراز هویت درون خوشه انجام می‌شود.

برای حفظ سازگاری با نسخه‌های قبلی، اگر متغیر محیطی `POD_NAMESPACE` در طول احراز هویت درون خوشه‌ای تنظیم شود، فضای نام پیش‌فرض را از توکن حساب سرویس لغو می‌کند. هرگونه مانیفست یا ابزاری که به پیش‌فرض بودن فضای نام متکی است، تحت تأثیر این امر قرار خواهد گرفت.

**`POD_NAMESPACE` متغیر محیطی**

اگر متغیر محیطی `POD_NAMESPACE` تنظیم شده باشد، عملیات cli روی منابع namespaced به طور پیش‌فرض روی مقدار متغیر تنظیم می‌شوند. برای مثال، اگر متغیر روی `seattle` تنظیم شده باشد، `kubectl get pods` پادهایی را در فضای نام `seattle` برمی‌گرداند. دلیل این امر این است که پادها `یک منبع namespaced هستند و هیچ فضای نامی در دستور ارائه نشده است. خروجی `kubectl api-resources` را بررسی کنید تا مشخص شود که آیا یک منبع namespaced شده است یا خیر.

استفاده صریح از `--namespace <value>` این رفتار را لغو می‌کند.

**نحوه مدیریت توکن‌های ServiceAccount توسط kubectl**

اگر:

* فایل توکن حساب سرویس Kubernetes در آدرس
`/var/run/secrets/kubernetes.io/serviceaccount/token` نصب شده باشد، و
* متغیر محیطی `KUBERNETES_SERVICE_HOST` تنظیم شده باشد، و
* متغیر محیطی `KUBERNETES_SERVICE_PORT` تنظیم شده باشد، و
* شما به طور صریح فضای نامی را در خط فرمان kubectl مشخص نکرده باشید

در این صورت kubectl فرض می‌کند که در خوشه شما در حال اجرا است. ابزار kubectl فضای نام آن ServiceAccount (که همان فضای نام Pod است) را جستجو می‌کند و بر اساس آن فضای نام عمل می‌کند. این با آنچه در خارج از یک خوشه اتفاق می‌افتد متفاوت است؛ وقتی kubectl خارج از یک خوشه اجرا می‌شود و شما فضای نامی را مشخص نکرده باشید، دستور kubectl بر اساس فضای نامی که برای زمینه فعلی در پیکربندی کلاینت شما تنظیم شده است عمل می‌کند. برای تغییر فضای نام پیش‌فرض برای kubectl خود، می‌توانید از دستور زیر استفاده کنید:

```shell
kubectl config set-context --current --namespace=<namespace-name>
```

## Operations

جدول زیر شامل توضیحات کوتاه و سینتکس کلی برای تمام عملیات `kubectl` است:

Operation       | Syntax    |       Description
-------------------- | -------------------- | --------------------
`alpha` | `kubectl alpha SUBCOMMAND [flags]` | دستورات موجود مربوط به ویژگی‌های آلفا را که به طور پیش‌فرض در خوشههای Kubernetes فعال نیستند، فهرست کنید.
`annotate` | <code>kubectl annotate (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) KEY_1=VAL_1 ... KEY_N=VAL_N [--overwrite] [--all] [--resource-version=version] [flags]</code> | حاشیه‌نویسی‌های یک یا چند منبع را اضافه یا به‌روزرسانی کنید.
`api-resources` | `kubectl api-resources [flags]` | فهرست منابع API موجود.
`api-versions` | `kubectl api-versions [flags]` | فهرست نسخه‌های API موجود.
`apply` | `kubectl apply -f FILENAME [flags]`| اعمال یک تغییر پیکربندی به یک منبع از یک فایل یا stdin.
`attach` | `kubectl attach POD -c CONTAINER [-i] [-t] [flags]` | برای مشاهده جریان خروجی یا تعامل با کانتینر (stdin)، به یک کانتینر در حال اجرا متصل می‌شود.
`auth` | `kubectl auth [flags] [options]` | بررسی مجوزها.
`autoscale` | <code>kubectl autoscale (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) [--min=MINPODS] --max=MAXPODS [--cpu-percent=CPU] [flags]</code> | به طور خودکار مجموعه پادهایی را که توسط یک کنترل‌کننده تکثیر مدیریت می‌شوند، مقیاس‌بندی می‌کند.
`certificate` | `kubectl certificate SUBCOMMAND [options]` | تغییر منابع گواهی.
`cluster-info` | `kubectl cluster-info [flags]` | نمایش اطلاعات نقطه پایانی در مورد سرور اصلی و سرویس‌های موجود در خوشه.
`تکمیل` | `تکمیل kubectl SHELL [options]` | کد تکمیل پوسته را برای پوسته مشخص شده (bash یا zsh) خروجی می‌دهد.

`config` | `kubectl config SUBCOMMAND [flags]` | فایل‌های kubeconfig را تغییر می‌دهد. برای جزئیات بیشتر به زیردستورات جداگانه مراجعه کنید.
`convert` | `kubectl convert -f FILENAME [options]` | تبدیل فایل‌های پیکربندی بین نسخه‌های مختلف API. هر دو فرمت YAML و JSON پذیرفته می‌شوند. توجه - نصب افزونه `kubectl-convert` الزامی است.
`cordon` | `kubectl cordon NODE [options]` | علامت‌گذاری گره به عنوان غیرقابل برنامه‌ریزی.
`cp`    | `kubectl cp <file-spec-src> <file-spec-dest> `cp` | `kubectl cp <file-spec-src> <file-spec-dest> [options]` | کپی فایل‌ها و دایرکتوری‌ها به و از کانتینرها.
`create` | `kubectl create -f FILENAME [flags]` | ایجاد یک یا چند منبع از یک فایل یا stdin.
`delete` | <code>kubectl delete (-f FILENAME &#124; TYPE [NAME &#124; /NAME &#124; -l label &#124; --all]) [flags]</code> | حذف منابع از یک فایل، stdin یا با مشخص کردن انتخابگرهای برچسب، نام‌ها، انتخابگرهای منبع یا منابع.
`describe` | <code>kubectl describe (-f FILENAME &#124; TYPE [NAME_PREFIX &#124; /NAME &#124; -l label]) [flags]</code> | نمایش وضعیت دقیق یک یا چند منبع.
`diff` | `kubectl diff -f FILENAME [flags]`| فایل تفاوت یا stdin در برابر پیکربندی زنده.
`drain` | `kubectl drain NODE [options]` | گره را برای آماده‌سازی جهت تعمیر و نگهداری تخلیه کنید.
`edit` | <code>kubectl edit (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) [flags]</code> | ویرایش و به‌روزرسانی تعریف یک یا چند منبع روی سرور با استفاده از ویرایشگر پیش‌فرض.
`events` | `kubectl events` | فهرست رویدادها
`exec` | `kubectl exec POD [-c CONTAINER] [-i] [-t] [flags] [-- COMMAND [args...]]` | اجرای یک دستور روی یک کانتینر در یک pod.
`explain` | `kubectl explain TYPE [--recursive=false] [flags]` | دریافت مستندات منابع مختلف. به عنوان مثال podها، گره‌ها، سرویس‌ها و غیره.
`expose` | <code>kubectl expose (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) [--port=port] [--protocol=TCP&#124;UDP] [--target-port=number-or-name] [--name=name] [--external-ip=external-ip-of-service] [--type=type] [flags]</code> | یک کنترل‌کننده، سرویس یا غلاف تکثیر را به عنوان یک سرویس جدید Kubernetes افشا کنید.
`get` | <code>kubectl get (-f FILENAME &#124; TYPE [NAME &#124; /NAME &#124; -l label]) [--watch] [--sort-by=FIELD] [[-o &#124; --output]=OUTPUT_FORMAT] [flags]</code> | یک یا چند منبع را فهرست می‌کند.
`kustomize` | `kubectl kustomize <dir> [flags] [options]` | مجموعه‌ای از منابع API تولید شده از دستورالعمل‌های موجود در فایل kustomization.yaml را فهرست می‌کند. آرگومان باید مسیر دایرکتوری حاوی فایل یا یک URL مخزن git با پسوند مسیر باشد که همان را نسبت به ریشه مخزن مشخص می‌کند.
`label` | <code>برچسب kubectl (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) KEY_1=VAL_1 ... KEY_N=VAL_N [--overwrite] [--all] [--resource-version=version] [flags]</code> | برچسب‌های یک یا چند منبع را اضافه یا به‌روزرسانی کنید.
`logs` | `kubectl logs POD [-c CONTAINER] [--follow] [flags]` | گزارش‌های مربوط به یک کانتینر در یک pod را چاپ کنید.
`options` | `kubectl options` | فهرست گزینه‌های سراسری خط فرمان، که برای همه دستورات اعمال می‌شوند.
`patch` | <code>kubectl patch (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) --patch PATCH [flags]</code> | به‌روزرسانی یک یا چند فیلد از یک منبع با استفاده از فرآیند استراتژیک ادغام پچ.
`plugin` | `kubectl plugin [flags] [options]` | ابزارهایی برای تعامل با افزونه‌ها فراهم می‌کند.
`port-forward` | `kubectl port-forward POD [LOCAL_PORT:]REMOTE_PORT [...[LOCAL_PORT_N:]REMOTE_PORT_N] [flags]` | یک یا چند پورت محلی را به یک pod فوروارد می‌کند.
`proxy` | `kubectl proxy [--port=PORT] [--www=static-dir] [--www-prefix=prefix] [--api-prefix=prefix] [flags]` | یک پروکسی برای سرور API کوبرنتیز اجرا کنید.
`replace` | `kubectl replace -f FILENAME` | جایگزینی یک منبع از یک فایل یا stdin.
`rollout` | `kubectl rollout SUBCOMMAND [options]` | مدیریت rollout یک منبع. انواع منابع معتبر عبارتند از: deployments، daemonsets و statefulsets.
`run` | <code>kubectl run NAME --image=image [--env="key=value"] [--port=port] [--dry-run=server&#124;client&#124;none] [--overrides=inline-json] [flags]</code> | یک تصویر مشخص شده را روی خوشه اجرا کن.
`scale` | <code>kubectl scale (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) --replicas=COUNT [--resource-version=version] [--current-replicas=count] [flags]</code> | اندازه کنترل‌کننده تکثیر مشخص‌شده را به‌روزرسانی می‌کند.
`set` | `kubectl set SUBCOMMAND [options]` | پیکربندی منابع برنامه.
`taint` | `kubectl taint NODE NAME KEY_1=VAL_1:TAINT_EFFECT_1 ... KEY_N=VAL_N:TAINT_EFFECT_N [options]` | taintها را در یک یا چند گره به‌روزرسانی کنید.
`top` | <code>kubectl top (POD &#124; NODE) ​​[flags] [options]</code> | نمایش میزان استفاده از منابع (CPU/Memory/Storage) از pod یا گره.
`uncordon` | `kubectl uncordon NODE [options]` | علامت‌گذاری گره به عنوان قابل زمان‌بندی.
`version` | `kubectl version [--client] [flags]` | نمایش نسخه Kubernetes در حال اجرا روی کلاینت و سرور.
`wait` | <code>kubectl wait ([-f FILENAME] &#124; resource.group/resource.name &#124; resource.group [(-l label &#124; --all)]) [--for=delete&#124;--for condition=available] [options]</code> | آزمایشی: منتظر یک شرط خاص روی یک یا چند منبع بمانید.

برای کسب اطلاعات بیشتر در مورد عملیات دستور، به مستندات مرجع [kubectl](/docs/reference/kubectl/kubectl/) مراجعه کنید.

## انواع منابع

جدول زیر شامل لیستی از انواع منابع پشتیبانی شده و نام‌های مستعار اختصاری آنها است.

(این خروجی را می‌توان از `kubectl api-resources` بازیابی کرد و از Kubernetes 1.25.0 دقیق بود.)

| NAME | SHORTNAMES | APIVERSION | NAMESPACED | KIND |
|---|---|---|---|---|
| `bindings` |  | v1 | true | Binding |
| `componentstatuses` | `cs` | v1 | false | ComponentStatus |
| `configmaps` | `cm` | v1 | true | ConfigMap |
| `endpoints` | `ep` | v1 | true | Endpoints |
| `events` | `ev` | v1 | true | Event |
| `limitranges` | `limits` | v1 | true | LimitRange |
| `namespaces` | `ns` | v1 | false | Namespace |
| `nodes` | `no` | v1 | false | Node |
| `persistentvolumeclaims` | `pvc` | v1 | true | PersistentVolumeClaim |
| `persistentvolumes` | `pv` | v1 | false | PersistentVolume |
| `pods` | `po` | v1 | true | Pod |
| `podtemplates` |  | v1 | true | PodTemplate |
| `replicationcontrollers` | `rc` | v1 | true | ReplicationController |
| `resourcequotas` | `quota` | v1 | true | ResourceQuota |
| `secrets` |  | v1 | true | Secret |
| `serviceaccounts` | `sa` | v1 | true | ServiceAccount |
| `services` | `svc` | v1 | true | Service |
| `mutatingwebhookconfigurations` |  | admissionregistration.k8s.io/v1 | false | MutatingWebhookConfiguration |
| `validatingwebhookconfigurations` |  | admissionregistration.k8s.io/v1 | false | ValidatingWebhookConfiguration |
| `customresourcedefinitions` | `crd,crds` | apiextensions.k8s.io/v1 | false | CustomResourceDefinition |
| `apiservices` |  | apiregistration.k8s.io/v1 | false | APIService |
| `controllerrevisions` |  | apps/v1 | true | ControllerRevision |
| `daemonsets` | `ds` | apps/v1 | true | DaemonSet |
| `deployments` | `deploy` | apps/v1 | true | Deployment |
| `replicasets` | `rs` | apps/v1 | true | ReplicaSet |
| `statefulsets` | `sts` | apps/v1 | true | StatefulSet |
| `tokenreviews` |  | authentication.k8s.io/v1 | false | TokenReview |
| `localsubjectaccessreviews` |  | authorization.k8s.io/v1 | true | LocalSubjectAccessReview |
| `selfsubjectaccessreviews` |  | authorization.k8s.io/v1 | false | SelfSubjectAccessReview |
| `selfsubjectrulesreviews` |  | authorization.k8s.io/v1 | false | SelfSubjectRulesReview |
| `subjectaccessreviews` |  | authorization.k8s.io/v1 | false | SubjectAccessReview |
| `horizontalpodautoscalers` | `hpa` | autoscaling/v2 | true | HorizontalPodAutoscaler |
| `cronjobs` | `cj` | batch/v1 | true | CronJob |
| `jobs` |  | batch/v1 | true | Job |
| `certificatesigningrequests` | `csr` | certificates.k8s.io/v1 | false | CertificateSigningRequest |
| `leases` |  | coordination.k8s.io/v1 | true | Lease |
| `endpointslices` |  | discovery.k8s.io/v1 | true | EndpointSlice |
| `events` | `ev` | events.k8s.io/v1 | true | Event |
| `flowschemas` |  | flowcontrol.apiserver.k8s.io/v1beta2 | false | FlowSchema |
| `prioritylevelconfigurations` |  | flowcontrol.apiserver.k8s.io/v1beta2 | false | PriorityLevelConfiguration |
| `ingressclasses` |  | networking.k8s.io/v1 | false | IngressClass |
| `ingresses` | `ing` | networking.k8s.io/v1 | true | Ingress |
| `networkpolicies` | `netpol` | networking.k8s.io/v1 | true | NetworkPolicy |
| `runtimeclasses` |  | node.k8s.io/v1 | false | RuntimeClass |
| `poddisruptionbudgets` | `pdb` | policy/v1 | true | PodDisruptionBudget |
| `podsecuritypolicies` | `psp` | policy/v1beta1 | false | PodSecurityPolicy |
| `clusterrolebindings` |  | rbac.authorization.k8s.io/v1 | false | ClusterRoleBinding |
| `clusterroles` |  | rbac.authorization.k8s.io/v1 | false | ClusterRole |
| `rolebindings` |  | rbac.authorization.k8s.io/v1 | true | RoleBinding |
| `roles` |  | rbac.authorization.k8s.io/v1 | true | Role |
| `priorityclasses` | `pc` | scheduling.k8s.io/v1 | false | PriorityClass |
| `csidrivers` |  | storage.k8s.io/v1 | false | CSIDriver |
| `csinodes` |  | storage.k8s.io/v1 | false | CSINode |
| `csistoragecapacities` |  | storage.k8s.io/v1 | true | CSIStorageCapacity |
| `storageclasses` | `sc` | storage.k8s.io/v1 | false | StorageClass |
| `volumeattachments` |  | storage.k8s.io/v1 | false | VolumeAttachment |

## گزینه های خروجی


برای کسب اطلاعات در مورد نحوه قالب‌بندی یا مرتب‌سازی خروجی دستورات خاص، از بخش‌های زیر استفاده کنید. برای جزئیات بیشتر در مورد اینکه کدام دستورات از گزینه‌های مختلف خروجی پشتیبانی می‌کنند، به مستندات مرجع [kubectl](/docs/reference/kubectl/kubectl/) مراجعه کنید.

### فرمت کردن خروجی


قالب خروجی پیش‌فرض برای همه دستورات `kubectl`، قالب متن ساده قابل خواندن توسط انسان است. برای خروجی دادن جزئیات به پنجره ترمینال خود با فرمتی خاص، می‌توانید پرچم‌های `-o` یا `--output` را به یک دستور `kubectl` پشتیبانی شده اضافه کنید.


#### Syntax

```shell
kubectl [command] [TYPE] [NAME] -o <output_format>
```

بسته به عملیات `kubectl`، فرمت‌های خروجی زیر پشتیبانی می‌شوند:

Output format | Description
--------------| -----------
`-o custom-columns=<spec>` | چاپ یک جدول با استفاده از لیستی از [custom columns](#custom-columns) که با کاما از هم جدا شده‌اند.
`-o custom-columns-file=<filename>` | چاپ یک جدول با استفاده از الگوی [custom columns](#custom-columns) در فایل `<filename>`.
`-o json` | خروجی یک شیء API با فرمت JSON.
`-o jsonpath=<template>` | چاپ فیلدهای تعریف شده در عبارت [jsonpath](/docs/reference/kubectl/jsonpath/).
`-o jsonpath-file=<filename>` | چاپ فیلدهای تعریف شده توسط عبارت [jsonpath](/docs/reference/kubectl/jsonpath/) در فایل `<filename>`.
`-o name` | چاپ فقط نام منبع و نه چیز دیگری.
`-o wide` | خروجی در قالب متن ساده به همراه هرگونه اطلاعات اضافی. برای پادها، نام گره نیز درج شده است.
`-o yaml` | خروجی یک شیء API با فرمت YAML.
##### مثال

در این مثال، دستور زیر جزئیات مربوط به یک پاد (pod) را به عنوان یک شیء با فرمت YAML نمایش می‌دهد:

```shell
kubectl get pod web-pod-13je7 -o yaml
```

به یاد داشته باشید: برای جزئیات بیشتر در مورد اینکه هر دستور از کدام فرمت خروجی پشتیبانی می‌کند، به مستندات مرجع [kubectl](/docs/reference/kubectl/kubectl/) مراجعه کنید.

#### ستون های سفارشی


برای تعریف ستون‌های سفارشی و نمایش فقط جزئیاتی که می‌خواهید در یک جدول نمایش دهید، می‌توانید از گزینه `custom-columns` استفاده کنید. می‌توانید ستون‌های سفارشی را به صورت درون‌خطی تعریف کنید یا از یک فایل الگو استفاده کنید: `-o custom-columns=<spec>` یا `-o custom-columns-file=<filename>`.

##### نمونه ها

درون خطی:


```shell
kubectl get pods <pod-name> -o custom-columns=NAME:.metadata.name,RSRC:.metadata.resourceVersion
```

فایل قالب:

```shell
kubectl get pods <pod-name> -o custom-columns-file=template.txt
```

که در آن فایل `template.txt` شامل موارد زیر است:

```
NAME          RSRC
metadata.name metadata.resourceVersion
```
نتیجه اجرای هر یک از دستورها مشابه زیر است:


```
NAME           RSRC
submit-queue   610995
```

#### Server-side columns

`kubectl` از دریافت اطلاعات ستون‌های خاص از سرور در مورد اشیاء پشتیبانی می‌کند.
این بدان معناست که برای هر منبع داده شده، سرور ستون‌ها و ردیف‌های مربوط به آن منبع را برای چاپ توسط کلاینت برمی‌گرداند.
این امر با کپسوله‌سازی جزئیات چاپ توسط سرور، امکان خروجی خوانا و سازگار برای انسان را در بین کلاینت‌های مورد استفاده در یک خوشه فراهم می‌کند.
این ویژگی به طور پیش‌فرض فعال است. برای غیرفعال کردن آن، پرچم `--server-print=false` را به دستور `kubectl get` اضافه کنید.

##### نمونه ها

برای چاپ اطلاعات مربوط به وضعیت یک pod، از دستوری مانند زیر استفاده کنید:

```shell
kubectl get pods <pod-name> --server-print=false
```

The output is similar to:

```
NAME       AGE
pod-name   1m
```

### مرتب سازی اشیاء لیست


برای نمایش اشیاء در یک لیست مرتب شده در پنجره ترمینال خود، می‌توانید پرچم `--sort-by` را به دستور `kubectl` پشتیبانی شده اضافه کنید. اشیاء خود را با مشخص کردن هر فیلد عددی یا رشته‌ای با پرچم `--sort-by` مرتب کنید. برای مشخص کردن یک فیلد، از عبارت [jsonpath](/docs/reference/kubectl/jsonpath/) استفاده کنید.


#### Syntax

```shell
kubectl [command] [TYPE] [NAME] --sort-by=<jsonpath_exp>
```

##### مثال

برای چاپ لیستی از پادها که بر اساس نام مرتب شده‌اند، دستور زیر را اجرا می‌کنید:


```shell
kubectl get pods --sort-by=.metadata.name
```

## Examples: Common operations

از مجموعه مثال‌های زیر برای آشنایی با اجرای عملیات رایج `kubectl` استفاده کنید:

`kubectl apply` - اعمال یا به‌روزرسانی یک منبع از یک فایل یا stdin.apply` - Apply or Update a resource from a file or stdin.

```shell
# Create a service using the definition in example-service.yaml.
kubectl apply -f example-service.yaml

# Create a replication controller using the definition in example-controller.yaml.
kubectl apply -f example-controller.yaml

# Create the objects that are defined in any .yaml, .yml, or .json file within the <directory> directory.
kubectl apply -f <directory>
```

`kubectl get` - List one or more resources.

```shell
# List all pods in plain-text output format.
kubectl get pods

# List all pods in plain-text output format and include additional information (such as node name).
kubectl get pods -o wide

# List the replication controller with the specified name in plain-text output format. Tip: You can shorten and replace the 'replicationcontroller' resource type with the alias 'rc'.
kubectl get replicationcontroller <rc-name>

# List all replication controllers and services together in plain-text output format.
kubectl get rc,services

# List all daemon sets in plain-text output format.
kubectl get ds

# List all pods running on node server01
kubectl get pods --field-selector=spec.nodeName=server01
```

`kubectl describe` - نمایش وضعیت دقیق یک یا چند منبع، از جمله منابع مقداردهی نشده به طور پیش‌فرض.

```shell
# Display the details of the node with name <node-name>.
kubectl describe nodes <node-name>

# Display the details of the pod with name <pod-name>.
kubectl describe pods/<pod-name>

# Display the details of all the pods that are managed by the replication controller named <rc-name>.
# Remember: Any pods that are created by the replication controller get prefixed with the name of the replication controller.
kubectl describe pods <rc-name>

# Describe all pods
kubectl describe pods
```

{{< note >}}
دستور `kubectl get` معمولاً برای بازیابی یک یا چند منبع از یک نوع منبع استفاده می‌شود. این دستور دارای مجموعه‌ای غنی از پرچم‌ها است که به شما امکان می‌دهد قالب خروجی را با استفاده از پرچم `-o` یا `--output` سفارشی کنید، به عنوان مثال. می‌توانید پرچم `-w` یا `--watch` را برای شروع مشاهده به‌روزرسانی‌های یک شیء خاص مشخص کنید. دستور `kubectl describe` بیشتر بر توصیف جنبه‌های مرتبط با یک منبع مشخص تمرکز دارد. این دستور ممکن است چندین فراخوانی API را به سرور API برای ساخت یک نما برای کاربر فراخوانی کند. به عنوان مثال، دستور `kubectl describe node` نه تنها اطلاعات مربوط به گره، بلکه خلاصه‌ای از پادهای در حال اجرا روی آن، رویدادهای ایجاد شده برای گره و غیره را نیز بازیابی می‌کند.
{{< /note >}}

`kubectl delete` - منابع را از یک فایل، stdin یا با مشخص کردن انتخابگرهای برچسب، نام‌ها، انتخابگرهای منبع یا منابع حذف می‌کند.

```shell
# Delete a pod using the type and name specified in the pod.yaml file.
kubectl delete -f pod.yaml

# Delete all the pods and services that have the label '<label-key>=<label-value>'.
kubectl delete pods,services -l <label-key>=<label-value>

# Delete all pods, including uninitialized ones.
kubectl delete pods --all
```

`kubectl exec` -اجرای یک دستور روی یک کانتینر در یک پاد.

```shell
# Get output from running 'date' from pod <pod-name>. By default, output is from the first container.
kubectl exec <pod-name> -- date

# Get output from running 'date' in container <container-name> of pod <pod-name>.
kubectl exec <pod-name> -c <container-name> -- date

# Get an interactive TTY and run /bin/bash from pod <pod-name>. By default, output is from the first container.
kubectl exec -ti <pod-name> -- /bin/bash
```

`kubectl logs` - گزارش‌های مربوط به یک کانتینر را در یک پاد چاپ کنید.

```shell
# Return a snapshot of the logs from pod <pod-name>.
kubectl logs <pod-name>

# Start streaming the logs from pod <pod-name>. This is similar to the 'tail -f' Linux command.
kubectl logs -f <pod-name>
```

`kubectl diff` - مشاهده‌ی تفاوت به‌روزرسانی‌های پیشنهادی برای یک خوشه.

```shell
# Diff resources included in "pod.json".
kubectl diff -f pod.json

# Diff file read from stdin.
cat service.yaml | kubectl diff -f -
```

## مثال‌ها: ایجاد و استفاده از افزونه‌ها

از مجموعه مثال‌های زیر برای آشنایی با نوشتن و استفاده از افزونه‌های `kubectl` استفاده کنید:


```shell
# create a simple plugin in any language and name the resulting executable file
# so that it begins with the prefix "kubectl-"
cat ./kubectl-hello
```
```shell
#!/bin/sh

# this plugin prints the words "hello world"
echo "hello world"
```
با نوشتن یک افزونه، بیایید آن را قابل اجرا کنیم:
```bash
chmod a+x ./kubectl-hello

# and move it to a location in our PATH
sudo mv ./kubectl-hello /usr/local/bin
sudo chown root:root /usr/local/bin

# You have now created and "installed" a kubectl plugin.
# You can begin using this plugin by invoking it from kubectl as if it were a regular command
kubectl hello
```
```
hello world
```

```shell
# You can "uninstall" a plugin, by removing it from the folder in your
# $PATH where you placed it
sudo rm /usr/local/bin/kubectl-hello
```

برای مشاهده تمام افزونه‌های موجود برای `kubectl`، از زیردستور `kubectl plugin list` استفاده کنید:

```shell
kubectl plugin list
```
خروجی مشابه زیر است:

```
افزونه‌های سازگار با kubectl زیر موجود هستند:


/usr/local/bin/kubectl-hello
/usr/local/bin/kubectl-foo
/usr/local/bin/kubectl-bar
```


`kubectl plugin list` همچنین در مورد افزونه‌هایی که قابل اجرا نیستند یا توسط افزونه‌های دیگر در سایه قرار گرفته‌اند، به شما هشدار می‌دهد؛ برای مثال

```shell
sudo chmod -x /usr/local/bin/kubectl-foo # remove execute permission
kubectl plugin list
```

```
افزونه‌های سازگار با kubectl زیر موجود هستند:

/usr/local/bin/kubectl-hello
/usr/local/bin/kubectl-foo
  - هشدار: /usr/local/bin/kubectl-foo به عنوان یک افزونه شناسایی شده است، اما قابل اجرا نیست.
/usr/local/bin/kubectl-bar

خطا: یک هشدار افزونه پیدا شد
```

می‌توانید افزونه‌ها را به عنوان ابزاری برای ساخت قابلیت‌های پیچیده‌تر بر روی دستورات موجود kubectl در نظر بگیرید:


```shell
cat ./kubectl-whoami
```

چند مثال بعدی فرض می‌کنند که شما قبلاً `kubectl-whoami` را با محتوای زیر ایجاد کرده‌اید:

```shell
#!/bin/bash

# این افزونه از دستور `kubectl config` برای خروجی استفاده می‌کند
# اطلاعات در مورد کاربر فعلی، بر اساس زمینه انتخاب شده فعلی
kubectl config view --template='{{ range .contexts }}{{ if eq .name "'$(kubectl config current-context)'" }}Current user: {{ printf "%s\n" .context.user }}{{ end }}{{ end }}'
```

اجرای دستور بالا، خروجی‌ای شامل نام کاربر برای زمینه‌ی فعلی در فایل KUBECONFIG شما را ارائه می‌دهد:

```shell
# make the file executable
sudo chmod +x ./kubectl-whoami

# and move it into your PATH
sudo mv ./kubectl-whoami /usr/local/bin

kubectl whoami
Current user: plugins-user
```

## {{% heading "بعدی چیست؟" %}}

* مستندات مرجع `kubectl` را مطالعه کنید:
* مرجع [command reference](/docs/reference/kubectl/kubectl/) kubectl
* مرجع [command line arguments](/docs/reference/kubectl/generated/kubectl/) kubectl
* درباره [`kubectl` usage conventions](/docs/reference/kubectl/conventions/) اطلاعات کسب کنید
* درباره [JSONPath support](/docs/reference/kubectl/jsonpath/) در kubectl مطالعه کنید
* درباره نحوه [extend kubectl with plugins](/docs/tasks/extend-kubectl/kubectl-plugins) مطالعه کنید
* برای کسب اطلاعات بیشتر در مورد افزونه‌ها، به [example CLI plugin](https://github.com/kubernetes/sample-cli-plugin) نگاهی بیندازید.