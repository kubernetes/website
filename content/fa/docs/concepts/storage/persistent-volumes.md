---
reviewers:
#- jsafrane
#- saad-ali
#- thockin
#- msau42
#- xing-yang
title: حجم های پایدار (Persistent Volumes)
api_metadata:
- apiVersion: "v1"
  kind: "PersistentVolume"
- apiVersion: "v1"
  kind: "PersistentVolumeClaim"
feature:
  title: سازمان‌دهی ذخیره‌سازی
  description: >
    سیستم ذخیره‌سازی دلخواه خود را به‌صورت خودکار mount کنید، خواه از ذخیره‌سازی محلی، یک ارائه‌دهنده ابر عمومی، یا یک سیستم ذخیره‌سازی شبکه‌ای مانند iSCSI یا NFS باشد.
content_type: concept
weight: 20
---

<!-- overview -->

این سند _PersistentVolume_ها را در کوبرنتیز توضیح می‌دهد. آشنایی با
[حجم ها](/docs/concepts/storage/volumes/)، [StorageClassها](/docs/concepts/storage/storage-classes/)
و [VolumeAttributesClassها](/docs/concepts/storage/volume-attributes-classes/) توصیه می‌شود.

<!-- body -->

## مقدمه

مدیریت ذخیره‌سازی، مسئله‌ای جداگانه از مدیریت نمونه‌های محاسباتی (compute) است.
زیرسیستم PersistentVolume یک API برای کاربران و مدیران فراهم می‌کند که جزئیات نحوه
ارائه‌ی ذخیره‌سازی را از نحوه‌ی مصرف آن انتزاعی (abstract) می‌کند. برای این کار، دو
منبع API جدید معرفی می‌شود: PersistentVolume و PersistentVolumeClaim.

یک _PersistentVolume_ (PV) قطعه‌ای از فضای ذخیره‌سازی در کلاستر است که توسط یک مدیر
تهیه (provision) شده یا با استفاده از [StorageClassها](/docs/concepts/storage/storage-classes/)
به‌صورت پویا تهیه شده است. این یک منبع در کلاستر است، همان‌طور که یک گره نیز یک
منبع کلاستر است. PVها افزونه‌های Volume هستند، مانند Volumeها، اما چرخه‌ی حیاتی مستقل
از هر پاد خاصی که از آن PV استفاده می‌کند، دارند. این آبجکت API جزئیات پیاده‌سازی
ذخیره‌سازی را ثبت می‌کند، خواه NFS باشد، خواه iSCSI، یا یک سیستم ذخیره‌سازی خاص
ارائه‌دهنده‌ی ابر.

یک _PersistentVolumeClaim_ (PVC) یک درخواست برای فضای ذخیره‌سازی توسط یک کاربر است.
این شبیه به یک پاد است. پادها منابع گره را مصرف می‌کنند و PVCها منابع PV را مصرف
می‌کنند. پادها می‌توانند سطوح خاصی از منابع (CPU و Memory) را درخواست کنند. Claimها
می‌توانند اندازه و حالت‌های دسترسی خاصی را درخواست کنند (مثلاً می‌توانند به‌صورت
ReadWriteOnce، ReadOnlyMany، ReadWriteMany یا ReadWriteOncePod مانت شوند؛ به
[AccessModes](#access-modes) مراجعه کنید).

در حالی که PersistentVolumeClaimها به کاربر امکان مصرف منابع ذخیره‌سازی انتزاعی را
می‌دهند، معمول است که کاربران به PersistentVolumeهایی با ویژگی‌های متفاوت، مثل
کارایی، برای مسائل مختلف نیاز داشته باشند. مدیران کلاستر باید بتوانند طیفی از
PersistentVolumeها را ارائه دهند که در ابعادی بیش از اندازه و حالت‌های دسترسی
متفاوت باشند، بدون آنکه جزئیات نحوه‌ی پیاده‌سازی آن Volumeها را به کاربران نشان
دهند. برای این نیازها، منبع _StorageClass_ وجود دارد.

به [راهنمای گام‌به‌گام با مثال‌های کاربردی](/docs/tutorials/configuration/configure-persistent-volume-storage) مراجعه کنید.

## چرخه‌ی حیات یک Volume و Claim

PVها منابعی در کلاستر هستند. PVCها درخواست‌هایی برای آن منابع‌اند و همچنین به‌عنوان
رسید ادعا (claim check) برای آن منبع عمل می‌کنند. تعامل بین PVها و PVCها از این
چرخه‌ی حیات پیروی می‌کند:

### تهیه (Provisioning)

دو روش برای تهیه‌ی PVها وجود دارد: ایستا یا پویا.

#### ایستا

یک مدیر کلاستر تعدادی PV ایجاد می‌کند. این PVها جزئیات ذخیره‌سازی واقعی را در خود
دارند، که برای استفاده‌ی کاربران کلاستر در دسترس است. آن‌ها در API کوبرنتیز وجود
دارند و برای مصرف در دسترس‌اند.

#### پویا

هنگامی که هیچ‌کدام از PVهای ایستای که مدیر ایجاد کرده با PersistentVolumeClaim
کاربر مطابقت نداشته باشد، کلاستر ممکن است سعی کند یک Volume را به‌طور اختصاصی و
پویا برای آن PVC تهیه کند. این تهیه‌سازی مبتنی بر StorageClassهاست: PVC باید یک
[storage class](/docs/concepts/storage/storage-classes/) درخواست کند و مدیر باید
آن کلاس را برای رخ دادن تهیه‌سازی پویا ایجاد و پیکربندی کرده باشد. Claimهایی که
کلاس `""` را درخواست می‌کنند، عملاً تهیه‌سازی پویا را برای خودشان غیرفعال
می‌کنند.

برای فعال‌سازی تهیه‌سازی پویا ذخیره‌سازی بر اساس storage class، مدیر کلاستر باید
[کنترل کننده پذیرش (admission controller)](/docs/reference/access-authn-authz/admission-controllers/#defaultstorageclass)
`DefaultStorageClass` را روی سرور API فعال کند. این کار می‌تواند، برای مثال، با
اطمینان از این‌که `DefaultStorageClass` در فهرست مرتب‌شده و جدا‌شده با کاما از
مقادیر پرچم `--enable-admission-plugins` مربوط به کامپوننت سرور API وجود دارد،
انجام شود. برای اطلاعات بیشتر درباره‌ی پرچم‌های خط فرمان سرور API، مستندات
[kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/)
را بررسی کنید.

### پیوند (Binding)

یک کاربر یک PersistentVolumeClaim با مقدار مشخصی از ذخیره‌سازی درخواست‌شده و با
حالت‌های دسترسی معین ایجاد می‌کند، یا در حالت تهیه‌سازی پویا، از پیش آن را ایجاد
کرده است. یک حلقه‌ی کنترل (control loop) در control plane مراقب PVCهای جدید است،
یک PV منطبق (اگر ممکن باشد) پیدا می‌کند، و آن‌ها را به هم پیوند می‌دهد. اگر یک PV
به‌صورت پویا برای یک PVC جدید تهیه شده باشد، حلقه همواره آن PV را به آن PVC پیوند
می‌دهد. در غیر این صورت، کاربر همیشه حداقل چیزی را که درخواست کرده دریافت می‌کند،
اما Volume ممکن است بیش از آنچه درخواست شده باشد. پس از پیوند، پیوندهای
PersistentVolumeClaim انحصاری هستند، صرف‌نظر از این‌که چگونه پیوند برقرار شده باشد.
پیوند یک PVC به یک PV یک نگاشت یک‌به‌یک است که با استفاده از یک ClaimRef، که یک
پیوند دوطرفه بین PersistentVolume و PersistentVolumeClaim است، انجام می‌شود.

اگر یک Volume منطبق وجود نداشته باشد، Claimها تا زمان نامعلومی پیوندنخورده باقی
می‌مانند. Claimها زمانی که Volumeهای منطبق در دسترس قرار بگیرند، پیوند خواهند
خورد. برای مثال، کلاستری که با تعداد زیادی PV با اندازه‌ی 50Gi تهیه شده باشد، با
یک PVC که 100Gi درخواست می‌کند، مطابقت نخواهد داشت. این PVC زمانی می‌تواند پیوند
بخورد که یک PV با اندازه‌ی 100Gi به کلاستر افزوده شود.

### استفاده (Using)

پادها از Claimها به‌عنوان Volume استفاده می‌کنند. کلاستر Claim را بررسی می‌کند تا
Volume پیوند‌خورده را پیدا کند و آن Volume را برای یک پاد مانت می‌کند. برای
Volumeهایی که از چند حالت دسترسی پشتیبانی می‌کنند، کاربر هنگام استفاده از Claim
خود به‌عنوان یک Volume در یک پاد، حالت مورد نظر را مشخص می‌کند.

هنگامی که کاربری یک Claim دارد و آن Claim پیوند خورده است، PV پیوند‌خورده تا هر
زمانی که به آن نیاز داشته باشد، متعلق به کاربر است. کاربران پادها را زمان‌بندی
می‌کنند و با قرار دادن یک بخش `persistentVolumeClaim` در بلوک `volumes` یک پاد،
به PVهای مورد ادعای خود دسترسی پیدا می‌کنند. برای جزئیات بیشتر درباره‌ی این موضوع
به [Claimها به‌عنوان Volume](#claims-as-volumes) مراجعه کنید.

### محافظت از آبجکت ذخیره‌سازی در حال استفاده (Storage Object in Use Protection)

هدف از قابلیت محافظت از آبجکت ذخیره‌سازی در حال استفاده این است که اطمینان حاصل
شود PersistentVolumeClaimها (PVCها) که به‌طور فعال توسط یک پاد استفاده می‌شوند و
PersistentVolumeها (PVها) که به PVCها پیوند خورده‌اند، از سیستم حذف نمی‌شوند، زیرا
این کار می‌تواند منجر به از دست رفتن داده شود.

{{< note >}}
یک PVC زمانی به‌طور فعال توسط یک پاد استفاده می‌شود که یک آبجکت پاد وجود داشته
باشد که از آن PVC استفاده می‌کند.
{{< /note >}}

اگر کاربری یک PVC که به‌طور فعال توسط یک پاد استفاده می‌شود را حذف کند، PVC
بلادرنگ حذف نمی‌شود. حذف PVC تا زمانی که هیچ پادی به‌طور فعال از آن استفاده نکند،
به تعویق می‌افتد. همچنین، اگر یک مدیر PVی را که به یک PVC پیوند خورده است حذف کند،
PV بلادرنگ حذف نمی‌شود. حذف PV تا زمانی که دیگر به هیچ PVCی پیوند نداشته باشد، به
تعویق می‌افتد.

می‌توانید ببینید که یک PVC زمانی محافظت‌شده است که وضعیت آن `Terminating` باشد و
فهرست `Finalizers` شامل `kubernetes.io/pvc-protection` باشد:

```shell
kubectl describe pvc hostpath
Name:          hostpath
Namespace:     default
StorageClass:  example-hostpath
Status:        Terminating
Volume:
Labels:        <none>
Annotations:   volume.beta.kubernetes.io/storage-class=example-hostpath
               volume.beta.kubernetes.io/storage-provisioner=example.com/hostpath
Finalizers:    [kubernetes.io/pvc-protection]
...
```

می‌توانید ببینید که یک PV زمانی محافظت‌شده است که وضعیت آن `Terminating` باشد و
فهرست `Finalizers` شامل `kubernetes.io/pv-protection` نیز باشد:

```shell
kubectl describe pv task-pv-volume
Name:            task-pv-volume
Labels:          type=local
Annotations:     <none>
Finalizers:      [kubernetes.io/pv-protection]
StorageClass:    standard
Status:          Terminating
Claim:
Reclaim Policy:  Delete
Access Modes:    RWO
Capacity:        1Gi
Message:
Source:
    Type:          HostPath (bare host directory volume)
    Path:          /tmp/data
    HostPathType:
Events:            <none>
```

### بازیافت (Reclaiming)

هنگامی که کاربری کار خود با Volume را به پایان می‌رساند، می‌تواند آبجکت‌های PVC را
از API حذف کند که این کار امکان بازیافت آن منبع را فراهم می‌کند. سیاست بازیافت
(reclaim policy) یک PersistentVolume به کلاستر می‌گوید که پس از آزادسازی Volume از
Claim آن، با آن Volume چه کند. در حال حاضر، Volumeها می‌توانند Retained
(نگه‌داشته‌شده)، Recycled (بازچرخانی‌شده) یا Deleted (حذف‌شده) باشند.

#### Retain

سیاست بازیافت `Retain` امکان بازیافت دستی منبع را فراهم می‌کند. هنگامی که
PersistentVolumeClaim حذف می‌شود، PersistentVolume همچنان وجود دارد و Volume
"آزاد شده (released)" در نظر گرفته می‌شود. اما هنوز برای Claim دیگری در دسترس
نیست، زیرا داده‌های Claim قبلی روی آن Volume باقی مانده است. یک مدیر می‌تواند با
مراحل زیر Volume را به‌صورت دستی بازیافت کند.

1. PersistentVolume را حذف کنید. دارایی ذخیره‌سازی مرتبط در زیرساخت خارجی پس از
   حذف PV همچنان وجود دارد.
1. داده‌های موجود روی دارایی ذخیره‌سازی مرتبط را به‌صورت دستی به‌طور مناسب پاک‌سازی
   کنید.
1. دارایی ذخیره‌سازی مرتبط را به‌صورت دستی حذف کنید.

اگر می‌خواهید همان دارایی ذخیره‌سازی را دوباره استفاده کنید، یک PersistentVolume
جدید با همان تعریف دارایی ذخیره‌سازی ایجاد کنید.

#### Delete

برای افزونه‌های Volume که از سیاست بازیافت `Delete` پشتیبانی می‌کنند، حذف، هم
آبجکت PersistentVolume را از کوبرنتیز حذف می‌کند و هم دارایی ذخیره‌سازی مرتبط
در زیرساخت خارجی را. Volumeهایی که به‌صورت پویا تهیه شده‌اند،
[سیاست بازیافت StorageClass خود](#reclaim-policy) را به ارث می‌برند، که به‌طور
پیش‌فرض `Delete` است. مدیر باید StorageClass را مطابق با انتظارات کاربران
پیکربندی کند؛ در غیر این صورت، PV پس از ایجاد باید ویرایش یا پچ شود. به
[تغییر سیاست بازیافت یک PersistentVolume](/docs/tasks/administer-cluster/change-pv-reclaim-policy/)
مراجعه کنید.

#### Recycle

{{< warning >}}
سیاست بازیافت `Recycle` منسوخ شده است. به‌جای آن، رویکرد توصیه‌شده استفاده از
تهیه‌سازی پویا است.
{{< /warning >}}

اگر توسط افزونه Volume زیرین پشتیبانی شود، سیاست بازیافت `Recycle` یک پاک‌سازی
پایه (`rm -rf /thevolume/*`) روی Volume انجام می‌دهد و آن را دوباره برای یک
Claim جدید در دسترس قرار می‌دهد.

با این حال، یک مدیر می‌تواند یک قالب پاد بازیافت‌کننده‌ی (recycler) سفارشی را با
استفاده از آرگومان‌های خط فرمان kube-controller-manager، همان‌طور که در
[مرجع](/docs/reference/command-line-tools-reference/kube-controller-manager/)
توضیح داده شده، پیکربندی کند. قالب پاد بازیافت‌کننده‌ی سفارشی باید یک مشخصه‌ی
`volumes` داشته باشد، همان‌طور که در مثال زیر نشان داده شده است:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pv-recycler
  namespace: default
spec:
  restartPolicy: Never
  volumes:
  - name: vol
    hostPath:
      path: /any/path/it/will/be/replaced
  containers:
  - name: pv-recycler
    image: "registry.k8s.io/busybox"
    command: ["/bin/sh", "-c", "test -e /scrub && rm -rf /scrub/..?* /scrub/.[!.]* /scrub/*  && test -z \"$(ls -A /scrub)\" || exit 1"]
    volumeMounts:
    - name: vol
      mountPath: /scrub
```

با این حال، مسیر خاصی که در بخش `volumes` قالب پاد بازیافت‌کننده‌ی سفارشی مشخص
شده، با مسیر خاص Volumeی که در حال بازیافت است جایگزین می‌شود.

### Finalizer محافظت از حذف PersistentVolume
{{< feature-state feature_gate_name="HonorPVReclaimPolicy" >}}

Finalizerها می‌توانند به یک PersistentVolume افزوده شوند تا اطمینان حاصل شود
PersistentVolumeهایی که سیاست بازیافت `Delete` دارند، تنها پس از حذف ذخیره‌سازی
پشتیبان (backing storage) حذف می‌شوند.

Finalizer با نام `external-provisioner.volume.kubernetes.io/finalizer` (که در
نسخه‌ی v1.31 معرفی شد) هم به Volumeهای CSI که به‌صورت پویا تهیه شده‌اند و هم به
آن‌هایی که به‌صورت ایستا تهیه شده‌اند، افزوده می‌شود.

Finalizer با نام `kubernetes.io/pv-controller` (که در نسخه‌ی v1.31 معرفی شد) به
Volumeهای افزونه in-tree که به‌صورت پویا تهیه شده‌اند افزوده می‌شود و برای
Volumeهای افزونه in-tree که به‌صورت ایستا تهیه شده‌اند نادیده گرفته می‌شود.

مثال زیر یک Volume افزونه in-tree که به‌صورت پویا تهیه شده است را نشان می‌دهد:

```shell
kubectl describe pv pvc-74a498d6-3929-47e8-8c02-078c1ece4d78
Name:            pvc-74a498d6-3929-47e8-8c02-078c1ece4d78
Labels:          <none>
Annotations:     kubernetes.io/createdby: vsphere-volume-dynamic-provisioner
                 pv.kubernetes.io/bound-by-controller: yes
                 pv.kubernetes.io/provisioned-by: kubernetes.io/vsphere-volume
Finalizers:      [kubernetes.io/pv-protection kubernetes.io/pv-controller]
StorageClass:    vcp-sc
Status:          Bound
Claim:           default/vcp-pvc-1
Reclaim Policy:  Delete
Access Modes:    RWO
VolumeMode:      Filesystem
Capacity:        1Gi
Node Affinity:   <none>
Message:
Source:
    Type:               vSphereVolume (a Persistent Disk resource in vSphere)
    VolumePath:         [vsanDatastore] d49c4a62-166f-ce12-c464-020077ba5d46/kubernetes-dynamic-pvc-74a498d6-3929-47e8-8c02-078c1ece4d78.vmdk
    FSType:             ext4
    StoragePolicyName:  vSAN Default Storage Policy
Events:                 <none>
```

Finalizer با نام `external-provisioner.volume.kubernetes.io/finalizer` برای
Volumeهای CSI افزوده می‌شود. مثال زیر را ببینید:

```shell
Name:            pvc-2f0bab97-85a8-4552-8044-eb8be45cf48d
Labels:          <none>
Annotations:     pv.kubernetes.io/provisioned-by: csi.vsphere.vmware.com
Finalizers:      [kubernetes.io/pv-protection external-provisioner.volume.kubernetes.io/finalizer]
StorageClass:    fast
Status:          Bound
Claim:           demo-app/nginx-logs
Reclaim Policy:  Delete
Access Modes:    RWO
VolumeMode:      Filesystem
Capacity:        200Mi
Node Affinity:   <none>
Message:
Source:
    Type:              CSI (a Container Storage Interface (CSI) volume source)
    Driver:            csi.vsphere.vmware.com
    FSType:            ext4
    VolumeHandle:      44830fa8-79b4-406b-8b58-621ba25353fd
    ReadOnly:          false
    VolumeAttributes:      storage.kubernetes.io/csiProvisionerIdentity=1648442357185-8081-csi.vsphere.vmware.com
                           type=vSphere CNS Block Volume
Events:                <none>
```

هنگامی که ویژگی پرچم `CSIMigration{provider}` برای یک افزونه Volume in-tree خاص
فعال شود، finalizer `kubernetes.io/pv-controller` با finalizer
`external-provisioner.volume.kubernetes.io/finalizer` جایگزین می‌شود.

Finalizerها تضمین می‌کنند که آبجکت PV تنها پس از حذف Volume از بک‌اند ذخیره‌سازی،
در صورتی که سیاست بازیافت PV برابر با `Delete` باشد، حذف می‌شود. این کار همچنین
تضمین می‌کند که Volume از بک‌اند ذخیره‌سازی حذف می‌شود، صرف‌نظر از ترتیب حذف PV و
PVC.

### رزرو کردن یک PersistentVolume

control plane می‌تواند
[PersistentVolumeClaimها را به PersistentVolumeهای منطبق در کلاستر پیوند دهد](#binding).
اما اگر بخواهید یک PVC به یک PV خاص پیوند بخورد، باید آن‌ها را از پیش پیوند
دهید (pre-bind).

با مشخص کردن یک PersistentVolume در یک PersistentVolumeClaim، شما یک پیوند بین
آن PV و PVC خاص را اعلام می‌کنید. اگر PersistentVolume وجود داشته باشد و از
طریق فیلد `claimRef` خود هیچ PersistentVolumeClaimی را رزرو نکرده باشد، آن
PersistentVolume و PersistentVolumeClaim پیوند خواهند خورد.

این پیوند صرف‌نظر از برخی معیارهای تطبیق Volume، از جمله node affinity، رخ
می‌دهد. control plane همچنان بررسی می‌کند که
[storage class](/docs/concepts/storage/storage-classes/)، حالت‌های دسترسی و
اندازه‌ی ذخیره‌سازی درخواست‌شده معتبر باشند.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: foo-pvc
  namespace: foo
spec:
  storageClassName: "" # رشته‌ی خالی باید صریحاً تنظیم شود، در غیر این صورت StorageClass پیش‌فرض تنظیم خواهد شد
  volumeName: foo-pv
  ...
```

این روش هیچ تضمینی برای امتیازات پیوند به PersistentVolume ایجاد نمی‌کند. اگر
PersistentVolumeClaimهای دیگری بتوانند از PVی که مشخص می‌کنید استفاده کنند،
ابتدا باید آن Volume ذخیره‌سازی را رزرو کنید. PersistentVolumeClaim مربوطه را در
فیلد `claimRef` آن PV مشخص کنید تا PVCهای دیگر نتوانند به آن پیوند بخورند.

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: foo-pv
spec:
  storageClassName: ""
  claimRef:
    name: foo-pvc
    namespace: foo
  ...
```

این کار زمانی مفید است که بخواهید از PersistentVolumeهایی استفاده کنید که
`persistentVolumeReclaimPolicy` آن‌ها روی `Retain` تنظیم شده است، از جمله
حالت‌هایی که یک PV موجود را دوباره استفاده می‌کنید.

### توسعه‌ی PersistentVolumeClaimها (Expanding)

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

پشتیبانی از توسعه‌ی PersistentVolumeClaimها (PVCها) به‌طور پیش‌فرض فعال است. می‌توانید
انواع زیر از Volumeها را توسعه دهید:

* {{< glossary_tooltip text="csi" term_id="csi" >}} (شامل برخی از انواع Volume
  مهاجرت‌شده‌ی CSI)
* flexVolume (منسوخ‌شده)
* portworxVolume (منسوخ‌شده)

فقط در صورتی می‌توانید یک PVC را توسعه دهید که فیلد `allowVolumeExpansion` در
storage class آن روی true تنظیم شده باشد.

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: example-vol-default
provisioner: vendor-name.example/magicstorage
parameters:
  resturl: "http://192.168.10.100:8080"
  restuser: ""
  secretNamespace: ""
  secretName: ""
allowVolumeExpansion: true
```

برای درخواست یک Volume بزرگ‌تر برای یک PVC، آبجکت PVC را ویرایش کنید و اندازه‌ی
بزرگ‌تری را مشخص کنید. این کار باعث توسعه‌ی Volume پشتیبان PersistentVolume
زیرین می‌شود. هیچ‌گاه یک PersistentVolume جدید برای برآورده کردن Claim ایجاد
نمی‌شود. در عوض، یک Volume موجود تغییر اندازه می‌یابد.

{{< warning >}}
ویرایش مستقیم اندازه‌ی یک PersistentVolume می‌تواند از تغییر اندازه‌ی خودکار آن
Volume جلوگیری کند. اگر ظرفیت یک PersistentVolume را ویرایش کنید و سپس `.spec`
یک PersistentVolumeClaim منطبق را ویرایش کنید تا اندازه‌ی PersistentVolumeClaim
با PersistentVolume یکسان شود، هیچ تغییر اندازه‌ای در ذخیره‌سازی رخ نمی‌دهد.
control plane کوبرنتیز خواهد دید که وضعیت مطلوب هر دو منبع یکسان است، و نتیجه
می‌گیرد که اندازه‌ی Volume پشتیبان به‌صورت دستی افزایش یافته و نیازی به تغییر
اندازه نیست.
{{< /warning >}}

#### توسعه‌ی Volume CSI

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

پشتیبانی از توسعه‌ی Volumeهای CSI به‌طور پیش‌فرض فعال است، اما همچنین نیاز به
پشتیبانی یک درایور CSI خاص از توسعه‌ی Volume دارد. برای اطلاعات بیشتر به
مستندات درایور CSI مربوطه مراجعه کنید.

#### تغییر اندازه‌ی یک Volume حاوی یک فایل‌سیستم

فقط در صورتی می‌توانید اندازه‌ی Volumeهای حاوی یک فایل‌سیستم را تغییر دهید که آن
فایل‌سیستم XFS، Ext3 یا Ext4 باشد.

هنگامی که یک Volume حاوی یک فایل‌سیستم است، فایل‌سیستم فقط زمانی تغییر اندازه
می‌یابد که یک پاد جدید از PersistentVolumeClaim در حالت `ReadWrite` استفاده
کند. توسعه‌ی فایل‌سیستم یا هنگام راه‌اندازی یک پاد انجام می‌شود، یا هنگامی که یک
پاد در حال اجراست و فایل‌سیستم زیرین از توسعه‌ی آنلاین پشتیبانی می‌کند.

FlexVolumeها (منسوخ‌شده از کوبرنتیز v1.23) در صورتی امکان تغییر اندازه را
فراهم می‌کنند که درایور با قابلیت `RequiresFSResize` روی true پیکربندی شده
باشد. FlexVolume می‌تواند هنگام راه‌اندازی مجدد پاد تغییر اندازه یابد.

#### تغییر اندازه‌ی یک PersistentVolumeClaim در حال استفاده

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

در این حالت، نیازی نیست یک پاد یا deployment که از یک PVC موجود استفاده می‌کند
را حذف و دوباره ایجاد کنید. هر PVC در حال استفاده به‌طور خودکار به محض تغییر
اندازه‌ی فایل‌سیستم آن، برای پاد خود در دسترس قرار می‌گیرد. این ویژگی هیچ تأثیری
روی PVCهایی که توسط یک پاد یا deployment استفاده نمی‌شوند ندارد. باید یک پاد
ایجاد کنید که از آن PVC استفاده کند، قبل از آنکه توسعه بتواند کامل شود.

مشابه سایر انواع Volume، Volumeهای FlexVolume نیز می‌توانند هنگام استفاده توسط
یک پاد توسعه یابند.

{{< note >}}
تغییر اندازه‌ی FlexVolume تنها در صورتی امکان‌پذیر است که درایور زیرین از تغییر
اندازه پشتیبانی کند.
{{< /note >}}

#### بازیابی از خطا هنگام توسعه‌ی Volumeها

اگر کاربری اندازه‌ی جدیدی مشخص کند که برای سیستم ذخیره‌سازی زیرین بسیار بزرگ
است، توسعه‌ی PVC به‌طور مستمر تکرار می‌شود تا کاربر یا مدیر کلاستر اقدامی انجام
دهد. این حالت می‌تواند نامطلوب باشد و به همین دلیل کوبرنتیز روش‌های زیر را
برای بازیابی از این‌گونه خطاها فراهم می‌کند.

{{< tabs name="recovery_methods" >}}
{{% tab name="به‌صورت دستی با دسترسی مدیر کلاستر" %}}

اگر توسعه‌ی ذخیره‌سازی زیرین با خطا مواجه شود، مدیر کلاستر می‌تواند به‌صورت دستی
وضعیت Persistent Volume Claim (PVC) را بازیابی کرده و درخواست‌های تغییر اندازه
را لغو کند. در غیر این صورت، درخواست‌های تغییر اندازه به‌طور مستمر توسط
کنترلر و بدون دخالت مدیر تکرار می‌شوند.

1. PersistentVolume (PV) پیوندخورده به PersistentVolumeClaim (PVC) را با سیاست
   بازیافت `Retain` علامت‌گذاری کنید.
2. PVC را حذف کنید. چون PV سیاست بازیافت `Retain` دارد، هنگام ایجاد دوباره‌ی
   PVC هیچ داده‌ای از دست نخواهیم داد.
3. ورودی `claimRef` را از مشخصات PV حذف کنید تا PVC جدید بتواند به آن پیوند
   بخورد. این کار باید PV را `Available` کند.
4. PVC را با اندازه‌ی کوچک‌تر از PV دوباره ایجاد کنید و فیلد `volumeName` آن
   PVC را روی نام آن PV تنظیم کنید. این کار باید PVC جدید را به PV موجود پیوند
   دهد.
5. فراموش نکنید سیاست بازیافت PV را بازگردانید.

{{% /tab %}}
{{% tab name="با درخواست توسعه به اندازه‌ی کوچک‌تر" %}}

اگر توسعه برای یک PVC با خطا مواجه شده باشد، می‌توانید توسعه را با اندازه‌ای
کوچک‌تر از مقدار درخواست‌شده‌ی قبلی دوباره تلاش کنید. برای درخواست یک تلاش
توسعه‌ی جدید با اندازه‌ی پیشنهادی کوچک‌تر، `.spec.resources` آن PVC را ویرایش
کنید و مقداری کمتر از مقداری که قبلاً تلاش کرده‌اید انتخاب کنید.
این کار زمانی مفید است که توسعه به مقدار بالاتر به دلیل محدودیت ظرفیت موفق
نشده باشد. اگر این اتفاق افتاده، یا گمان می‌کنید که ممکن است افتاده باشد،
می‌توانید توسعه را با مشخص کردن اندازه‌ای که در محدوده‌ی ظرفیت ارائه‌دهنده‌ی
ذخیره‌سازی زیرین است، دوباره تلاش کنید. می‌توانید وضعیت عملیات تغییر اندازه را
با مشاهده‌ی `.status.allocatedResourceStatuses` و رویدادهای PVC رصد کنید.

توجه داشته باشید که، اگرچه می‌توانید مقدار ذخیره‌سازی کمتری نسبت به آنچه قبلاً
درخواست شده مشخص کنید، مقدار جدید همچنان باید بیشتر از `.status.capacity`
باشد. کوبرنتیز از کوچک کردن یک PVC به کمتر از اندازه‌ی فعلی آن پشتیبانی
نمی‌کند.
{{% /tab %}}
{{% /tabs %}}

## انواع PersistentVolumeها

انواع PersistentVolume به‌صورت افزونه پیاده‌سازی می‌شوند. کوبرنتیز در حال حاضر
از افزونه‌های زیر پشتیبانی می‌کند:

* [`csi`](/docs/concepts/storage/volumes/#csi) - Container Storage Interface (CSI)
* [`fc`](/docs/concepts/storage/volumes/#fc) - ذخیره‌سازی Fibre Channel (FC)
* [`hostPath`](/docs/concepts/storage/volumes/#hostpath) - Volume از نوع HostPath
  (فقط برای تست تک‌گرهی؛ در یک کلاستر چندگرهی کار نخواهد کرد؛
  به جای آن استفاده از Volume از نوع `local` را در نظر بگیرید)
* [`iscsi`](/docs/concepts/storage/volumes/#iscsi) - ذخیره‌سازی iSCSI (SCSI over IP)
* [`local`](/docs/concepts/storage/volumes/#local) - دستگاه‌های ذخیره‌سازی محلی
  که روی گرهها مانت شده‌اند.
* [`nfs`](/docs/concepts/storage/volumes/#nfs) - ذخیره‌سازی Network File System (NFS)

انواع زیر از PersistentVolume منسوخ شده‌اند اما همچنان در دسترس‌اند.
اگر از این انواع Volume به‌غیر از `flexVolume`، `cephfs` و `rbd` استفاده
می‌کنید، لطفاً درایورهای CSI متناظر را نصب کنید.

* [`awsElasticBlockStore`](/docs/concepts/storage/volumes/#awselasticblockstore) - AWS Elastic Block Store (EBS)
  (**مهاجرت به‌طور پیش‌فرض فعال** از نسخه‌ی v1.23)
* [`azureDisk`](/docs/concepts/storage/volumes/#azuredisk) - Azure Disk
  (**مهاجرت به‌طور پیش‌فرض فعال** از نسخه‌ی v1.23)
* [`azureFile`](/docs/concepts/storage/volumes/#azurefile) - Azure File
  (**مهاجرت به‌طور پیش‌فرض فعال** از نسخه‌ی v1.24)
* [`cinder`](/docs/concepts/storage/volumes/#cinder) - Cinder (ذخیره‌سازی بلاکی OpenStack)
  (**مهاجرت به‌طور پیش‌فرض فعال** از نسخه‌ی v1.21)
* [`flexVolume`](/docs/concepts/storage/volumes/#flexvolume) - FlexVolume
  (**منسوخ‌شده** از نسخه‌ی v1.23، بدون طرح مهاجرت و بدون طرح حذف پشتیبانی)
* [`gcePersistentDisk`](/docs/concepts/storage/volumes/#gcePersistentDisk) - GCE Persistent Disk
  (**مهاجرت به‌طور پیش‌فرض فعال** از نسخه‌ی v1.23)
* [`portworxVolume`](/docs/concepts/storage/volumes/#portworxvolume) - Volume Portworx
  (**مهاجرت به‌طور پیش‌فرض فعال** از نسخه‌ی v1.31)
* [`vsphereVolume`](/docs/concepts/storage/volumes/#vspherevolume) - Volume از نوع vSphere VMDK
  (**مهاجرت به‌طور پیش‌فرض فعال** از نسخه‌ی v1.25)

نسخه‌های قدیمی‌تر کوبرنتیز همچنین از انواع زیر PersistentVolume به‌صورت
in-tree پشتیبانی می‌کردند:

* [`cephfs`](/docs/concepts/storage/volumes/#cephfs)
  (**در دسترس نیست** از نسخه‌ی v1.31)
* `flocker` - ذخیره‌سازی Flocker.
  (**در دسترس نیست** از نسخه‌ی v1.25)
* `glusterfs` - ذخیره‌سازی GlusterFS.
  (**در دسترس نیست** از نسخه‌ی v1.26)
* `photonPersistentDisk` - دیسک persistent کنترلر Photon.
  (**در دسترس نیست** از نسخه‌ی v1.15)
* `quobyte` - Volume Quobyte.
  (**در دسترس نیست** از نسخه‌ی v1.25)
* [`rbd`](/docs/concepts/storage/volumes/#rbd) - Volume از نوع Rados Block Device (RBD)
  (**در دسترس نیست** از نسخه‌ی v1.31)
* `scaleIO` - Volume ScaleIO.
  (**در دسترس نیست** از نسخه‌ی v1.21)
* `storageos` - Volume StorageOS.
  (**در دسترس نیست** از نسخه‌ی v1.25)

## PersistentVolumeها

هر PV شامل یک spec و یک status است که به ترتیب مشخصات و وضعیت آن Volume را
تشکیل می‌دهند. نام یک آبجکت PersistentVolume باید یک
[نام subdomain معتبر DNS](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)
باشد.

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv0003
spec:
  capacity:
    storage: 5Gi
  volumeMode: Filesystem
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Recycle
  storageClassName: slow
  mountOptions:
    - hard
    - nfsvers=4.1
  nfs:
    path: /tmp
    server: 172.17.0.2
```

{{< note >}}
برای مصرف یک PersistentVolume در یک کلاستر، ممکن است برنامه‌های کمکی مرتبط با
نوع آن Volume لازم باشند. در این مثال، PersistentVolume از نوع NFS است و
برنامه‌ی کمکی /sbin/mount.nfs برای پشتیبانی از مانت کردن فایل‌سیستم‌های NFS
لازم است.
{{< /note >}}

### ظرفیت (Capacity)

معمولاً یک PV ظرفیت ذخیره‌سازی مشخصی دارد. این با استفاده از ویژگی `capacity`
یک PV تنظیم می‌شود، که یک مقدار {{< glossary_tooltip term_id="quantity" >}}
است.

در حال حاضر، اندازه‌ی ذخیره‌سازی تنها منبعی است که می‌تواند تنظیم یا درخواست
شود. ویژگی‌های آینده ممکن است IOPS، توان عملیاتی و غیره را نیز شامل شود.

### حالت Volume (Volume Mode)

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

کوبرنتیز از دو `volumeMode` برای PersistentVolumeها پشتیبانی می‌کند:
`Filesystem` و `Block`.

`volumeMode` یک پارامتر اختیاری API است.
`Filesystem` حالت پیش‌فرضی است که هنگام حذف پارامتر `volumeMode` استفاده
می‌شود.

Volumeی با `volumeMode: Filesystem` در یک دایرکتوری *مانت* می‌شود درون پادها.
اگر Volume توسط یک دستگاه بلاکی پشتیبانی شود و آن دستگاه خالی باشد، کوبرنتیز
پیش از اولین مانت آن، یک فایل‌سیستم روی دستگاه ایجاد می‌کند.

می‌توانید مقدار `volumeMode` را روی `Block` تنظیم کنید تا از یک Volume به‌عنوان
یک دستگاه بلاکی خام (raw block device) استفاده کنید. چنین Volumeی به یک پاد
به‌صورت یک دستگاه بلاکی، بدون هیچ فایل‌سیستمی روی آن، ارائه می‌شود. این حالت
برای فراهم کردن سریع‌ترین راه ممکن برای دسترسی یک پاد به یک Volume، بدون هیچ
لایه‌ی فایل‌سیستم بین پاد و Volume، مفید است. از سوی دیگر، برنامه‌ای که در پاد
اجرا می‌شود باید بداند چگونه یک دستگاه بلاکی خام را مدیریت کند. برای مثالی
درباره‌ی نحوه‌ی استفاده از یک Volume با `volumeMode: Block` در یک پاد به
[پشتیبانی از Raw Block Volume](#raw-block-volume-support) مراجعه کنید.

### حالت‌های دسترسی (Access Modes)

یک PersistentVolume می‌تواند روی یک میزبان به هر روشی که ارائه‌دهنده‌ی منبع
پشتیبانی می‌کند مانت شود. همان‌طور که در جدول زیر نشان داده شده، ارائه‌دهندگان
قابلیت‌های متفاوتی دارند و حالت‌های دسترسی هر PV بر اساس حالت‌های خاصی که آن
Volume خاص پشتیبانی می‌کند، تنظیم می‌شود. برای مثال، NFS می‌تواند از چند کلاینت
خواندن/نوشتن پشتیبانی کند، اما یک PV خاص NFS ممکن است روی سرور به‌صورت
فقط‌خواندنی export شده باشد. هر PV مجموعه‌ی مخصوص خود از حالت‌های دسترسی را دارد
که قابلیت‌های آن PV خاص را توصیف می‌کند.

حالت‌های دسترسی به این شرح‌اند:

`ReadWriteOnce`
: Volume می‌تواند به‌صورت خواندن-نوشتن توسط یک گره واحد مانت شود. حالت دسترسی
  ReadWriteOnce همچنان می‌تواند به چند پاد اجازه‌ی دسترسی (خواندن یا نوشتن) به
  آن Volume را بدهد، در صورتی که آن پادها روی همان گره در حال اجرا باشند.
  برای دسترسی تک-پاد، لطفاً ReadWriteOncePod را ببینید.

`ReadOnlyMany`
: Volume می‌تواند به‌صورت فقط‌خواندنی توسط چند گره مانت شود.

`ReadWriteMany`
: Volume می‌تواند به‌صورت خواندن-نوشتن توسط چند گره مانت شود.

`ReadWriteOncePod`
: {{< feature-state for_k8s_version="v1.29" state="stable" >}}
  Volume می‌تواند به‌صورت خواندن-نوشتن توسط یک پاد واحد مانت شود. اگر می‌خواهید
  اطمینان حاصل کنید که فقط یک پاد در کل کلاستر می‌تواند آن PVC را بخواند یا در
  آن بنویسد، از حالت دسترسی ReadWriteOncePod استفاده کنید.

{{< note >}}
حالت دسترسی `ReadWriteOncePod` فقط برای Volumeهای
{{< glossary_tooltip text="CSI" term_id="csi" >}} و نسخه‌ی 1.22+ کوبرنتیز
پشتیبانی می‌شود. برای استفاده از این ویژگی، باید
[sidecarهای CSI](https://kubernetes-csi.github.io/docs/sidecar-containers.html)
زیر را به این نسخه‌ها یا بالاتر به‌روزرسانی کنید:

* [csi-provisioner:v3.0.0+](https://github.com/kubernetes-csi/external-provisioner/releases/tag/v3.0.0)
* [csi-attacher:v3.3.0+](https://github.com/kubernetes-csi/external-attacher/releases/tag/v3.3.0)
* [csi-resizer:v1.3.0+](https://github.com/kubernetes-csi/external-resizer/releases/tag/v1.3.0)
{{< /note >}}

در CLI، حالت‌های دسترسی به این صورت مخفف می‌شوند:

* RWO - ReadWriteOnce
* ROX - ReadOnlyMany
* RWX - ReadWriteMany
* RWOP - ReadWriteOncePod

{{< note >}}
کوبرنتیز از حالت‌های دسترسی Volume برای تطبیق PersistentVolumeClaimها و
PersistentVolumeها استفاده می‌کند. در برخی موارد، حالت‌های دسترسی Volume همچنین
محدودیتی برای مکانی که PersistentVolume می‌تواند در آن مانت شود ایجاد می‌کنند.
حالت‌های دسترسی Volume، پس از مانت شدن ذخیره‌سازی، محافظت در برابر نوشتن را
**اعمال نمی‌کنند**. حتی اگر حالت‌های دسترسی به‌صورت ReadWriteOnce، ReadOnlyMany
یا ReadWriteMany مشخص شده باشند، آن‌ها هیچ محدودیتی بر روی Volume تنظیم
نمی‌کنند. برای مثال، حتی اگر یک PersistentVolume با حالت ReadOnlyMany ایجاد
شده باشد، هیچ تضمینی وجود ندارد که واقعاً فقط‌خواندنی باشد. اگر حالت‌های دسترسی
به‌صورت ReadWriteOncePod مشخص شده باشند، Volume محدود می‌شود و فقط می‌تواند
روی یک پاد واحد مانت شود.
{{< /note >}}

> __مهم!__ یک Volume در هر لحظه فقط می‌تواند با استفاده از یک حالت دسترسی مانت
> شود، حتی اگر از چندین حالت پشتیبانی کند.

| افزونه Volume        | ReadWriteOnce          | ReadOnlyMany          | ReadWriteMany | ReadWriteOncePod       |
| :---                 | :---:                  | :---:                 | :---:         | -                      |
| AzureFile            | &#x2713;               | &#x2713;              | &#x2713;      | -                      |
| CephFS               | &#x2713;               | &#x2713;              | &#x2713;      | -                      |
| CSI                  | بستگی به درایور دارد   | بستگی به درایور دارد  | بستگی به درایور دارد | بستگی به درایور دارد |
| FC                   | &#x2713;               | &#x2713;              | -             | -                      |
| FlexVolume           | &#x2713;               | &#x2713;              | بستگی به درایور دارد | -              |
| HostPath             | &#x2713;               | -                     | -             | -                      |
| iSCSI                | &#x2713;               | &#x2713;              | -             | -                      |
| NFS                  | &#x2713;               | &#x2713;              | &#x2713;      | -                      |
| RBD                  | &#x2713;               | &#x2713;              | -             | -                      |
| VsphereVolume        | &#x2713;               | -                     | - (زمانی که پادها هم‌مکان باشند کار می‌کند) | - |
| PortworxVolume       | &#x2713;               | -                     | &#x2713;      | -                  | - |

### کلاس (Class)

یک PV می‌تواند یک کلاس داشته باشد، که با تنظیم ویژگی `storageClassName` روی نام
یک [StorageClass](/docs/concepts/storage/storage-classes/) مشخص می‌شود. یک PV
از کلاس خاص فقط می‌تواند به PVCهایی که آن کلاس را درخواست می‌کنند پیوند بخورد.
یک PV بدون `storageClassName` هیچ کلاسی ندارد و فقط می‌تواند به PVCهایی که
هیچ کلاس خاصی را درخواست نمی‌کنند پیوند بخورد.

در گذشته، annotation `volume.beta.kubernetes.io/storage-class` به‌جای ویژگی
`storageClassName` استفاده می‌شد. این annotation همچنان کار می‌کند؛ با این
حال، در یک نسخه‌ی آینده‌ی کوبرنتی به‌طور کامل منسوخ خواهد شد.

### سیاست بازیافت (Reclaim Policy)

سیاست‌های بازیافت فعلی به این شرح‌اند:

* Retain -- بازیافت دستی
* Recycle -- پاک‌سازی پایه (`rm -rf /thevolume/*`)
* Delete -- حذف Volume

برای کوبرنتیز {{< skew currentVersion >}}، فقط انواع Volume `nfs` و
`hostPath` از بازچرخانی (recycling) پشتیبانی می‌کنند.

### گزینه‌های مانت (Mount Options)

یک مدیر کوبرنتیز می‌تواند گزینه‌های مانت اضافی را برای زمانی که یک
Persistent Volume روی یک گره مانت می‌شود، مشخص کند.

{{< note >}}
همه‌ی انواع Persistent Volume از گزینه‌های مانت پشتیبانی نمی‌کنند.
{{< /note >}}

انواع Volume زیر از گزینه‌های مانت پشتیبانی می‌کنند:

* `csi` (شامل انواع Volume مهاجرت‌شده‌ی CSI)
* `iscsi`
* `nfs`

گزینه‌های مانت اعتبارسنجی نمی‌شوند. اگر یک گزینه‌ی مانت نامعتبر باشد، مانت با
خطا مواجه می‌شود.

در گذشته، annotation `volume.beta.kubernetes.io/mount-options` به‌جای ویژگی
`mountOptions` استفاده می‌شد. این annotation همچنان کار می‌کند؛ با این حال،
در یک نسخه‌ی آینده‌ی کوبرنتیز به‌طور کامل منسوخ خواهد شد.

### تعامد گره (Node Affinity)

{{< note >}}
برای اکثر انواع Volume، لازم نیست این فیلد را تنظیم کنید.
باید آن را به‌طور صریح برای Volumeهای [local](/docs/concepts/storage/volumes/#local) تنظیم کنید.
{{< /note >}}

یک PV می‌تواند node affinity را برای تعریف محدودیت‌هایی که مشخص می‌کند این
Volume از کدام گرهها قابل دسترسی است، مشخص کند. پادهایی که از یک PV استفاده
می‌کنند فقط روی گرههایی زمان‌بندی می‌شوند که توسط node affinity انتخاب شده‌اند.
برای مشخص کردن node affinity، `nodeAffinity` را در `.spec` یک PV تنظیم کنید.
مرجع API
[PersistentVolume](/docs/reference/kubernetes-api/config-and-storage-resources/persistent-volume-v1/#PersistentVolumeSpec)
جزئیات بیشتری درباره‌ی این فیلد دارد.

#### به‌روزرسانی‌های node affinity

{{< feature-state feature_gate_name="MutablePVNodeAffinity" >}}

اگر [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
`MutablePVNodeAffinity` در کلاستر شما فعال باشد، فیلد `.spec.nodeAffinity` یک
PersistentVolume قابل تغییر است. این کار به مدیران کلاستر یا کنترلر ذخیره‌سازی
خارجی امکان می‌دهد node affinity یک PersistentVolume را هنگام مهاجرت داده،
بدون قطع پادهای در حال اجرا، به‌روزرسانی کنند.

هنگام به‌روزرسانی node affinity، باید اطمینان حاصل کنید که node affinity جدید
همچنان با گرههایی که Volume در حال حاضر در آن‌ها استفاده می‌شود مطابقت دارد.
برای پادهایی که affinity جدید را نقض می‌کنند، اگر پاد در حال اجراست، ممکن است
همچنان به اجرا ادامه دهد. اما کوبرنتیز از این پیکربندی پشتیبانی نمی‌کند.
باید به‌زودی پادهای ناقض را متوقف کنید. به‌دلیل کش کردن در حافظه، پادهایی که
پس از به‌روزرسانی ایجاد می‌شوند ممکن است برای مدت کوتاهی همچنان بر اساس node
affinity قدیمی زمان‌بندی شوند.

برای استفاده از این ویژگی، باید feature gate `MutablePVNodeAffinity` را روی
کامپوننت‌های زیر فعال کنید:

- `kube-apiserver`
- `kubelet`

### فاز (Phase)

یک PersistentVolume در یکی از فازهای زیر خواهد بود:

`Available`
: منبعی آزاد که هنوز به هیچ Claimی پیوند نخورده است

`Bound`
: Volume به یک Claim پیوند خورده است

`Released`
: Claim حذف شده است، اما منبع ذخیره‌سازی مرتبط هنوز توسط کلاستر بازیافت نشده
  است

`Failed`
: Volume در بازیافت (خودکار) خود با خطا مواجه شده است

می‌توانید نام PVC پیوندخورده به PV را با استفاده از
`kubectl describe persistentvolume <name>` ببینید.

#### زمان‌مهر تغییر فاز (Phase transition timestamp)

{{< feature-state feature_gate_name="PersistentVolumeLastPhaseTransitionTime" >}}

فیلد `.status` یک PersistentVolume می‌تواند شامل یک فیلد آلفای
`lastPhaseTransitionTime` باشد. این فیلد زمان‌مهر آخرین تغییر فاز آن Volume را
ثبت می‌کند. برای Volumeهای تازه ایجاد‌شده، فاز روی `Pending` تنظیم می‌شود و
`lastPhaseTransitionTime` روی زمان فعلی تنظیم می‌شود.

## PersistentVolumeClaimها

هر PVC شامل یک spec و یک status است که به ترتیب مشخصات و وضعیت آن Claim را
تشکیل می‌دهند. نام یک آبجکت PersistentVolumeClaim باید یک
[نام subdomain معتبر DNS](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)
باشد.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: myclaim
spec:
  accessModes:
    - ReadWriteOnce
  volumeMode: Filesystem
  resources:
    requests:
      storage: 8Gi
  storageClassName: slow
  selector:
    matchLabels:
      release: "stable"
    matchExpressions:
      - {key: environment, operator: In, values: [dev]}
```

### حالت‌های دسترسی

Claimها هنگام درخواست ذخیره‌سازی با حالت‌های دسترسی خاص،
[همان قراردادهای Volumeها](#access-modes) را استفاده می‌کنند.

### حالت‌های Volume

Claimها برای نشان دادن مصرف Volume به‌صورت فایل‌سیستم یا دستگاه بلاکی،
[همان قرارداد Volumeها](#volume-mode) را استفاده می‌کنند.

### نام Volume

Claimها می‌توانند از فیلد `volumeName` برای پیوند صریح به یک PersistentVolume
خاص استفاده کنند. همچنین می‌توانید `volumeName` را تنظیم‌نشده رها کنید، که
نشان می‌دهد می‌خواهید کوبرنتیز یک PersistentVolume جدید که با Claim منطبق
است، راه‌اندازی کند.
اگر PV مشخص‌شده از پیش به یک PVC دیگر پیوند خورده باشد، پیوند در حالت pending
گیر خواهد کرد.

### منابع (Resources)

Claimها، مانند پادها، می‌توانند مقادیر مشخصی از یک منبع را درخواست کنند. در
این حالت، درخواست برای ذخیره‌سازی است. همان
[مدل منبع](https://git.k8s.io/design-proposals-archive/scheduling/resources.md)
برای هر دو Volume و Claim اعمال می‌شود.

{{< note >}}
برای Volumeهای `Filesystem`، درخواست ذخیره‌سازی به اندازه‌ی "بیرونی" Volume
اشاره دارد (یعنی اندازه‌ی تخصیص‌یافته از بک‌اند ذخیره‌سازی).
این به این معناست که اندازه‌ی قابل‌نوشتن ممکن است برای ارائه‌دهندگانی که یک
فایل‌سیستم روی یک دستگاه بلاکی می‌سازند، به‌دلیل سربار فایل‌سیستم، کمی کمتر باشد.
این موضوع به‌ویژه در XFS، که بسیاری از ویژگی‌های متادیتا به‌طور پیش‌فرض فعال
هستند، قابل مشاهده است.
{{< /note >}}

### انتخاب‌گر (Selector)

Claimها می‌توانند یک
[label selector](/docs/concepts/overview/working-with-objects/labels/#label-selectors)
را برای فیلتر کردن بیشتر مجموعه‌ی Volumeها مشخص کنند.
فقط Volumeهایی که labelهایشان با انتخاب‌گر مطابقت دارد می‌توانند به آن Claim
پیوند بخورند. انتخاب‌گر می‌تواند از دو فیلد تشکیل شده باشد:

* `matchLabels` - Volume باید یک label با این مقدار داشته باشد
* `matchExpressions` - فهرستی از الزامات که با مشخص کردن key، فهرست مقادیر و
  اپراتوری که key و مقادیر را به هم مرتبط می‌کند، بیان می‌شود. اپراتورهای
  معتبر شامل `In`، `NotIn`، `Exists` و `DoesNotExist` هستند.

همه‌ی الزامات، از هر دو `matchLabels` و `matchExpressions`، با عملگر AND به هم
مرتبط می‌شوند -- همه‌ی آن‌ها باید برای تطبیق برآورده شوند.

### کلاس

یک Claim می‌تواند یک کلاس خاص را با مشخص کردن نام یک
[StorageClass](/docs/concepts/storage/storage-classes/) با استفاده از ویژگی
`storageClassName` درخواست کند.
فقط PVهایی از کلاس درخواست‌شده، یعنی آن‌هایی که `storageClassName` یکسان با
PVC دارند، می‌توانند به آن PVC پیوند بخورند.

PVCها لازم نیست حتماً یک کلاس درخواست کنند. یک PVC که `storageClassName` آن
برابر با `""` تنظیم شده، همیشه به این معنا تفسیر می‌شود که یک PV بدون کلاس
درخواست می‌کند، بنابراین فقط می‌تواند به PVهایی بدون کلاس (بدون annotation یا
با annotation برابر با `""`) پیوند بخورد. یک PVC بدون `storageClassName` کاملاً
مشابه نیست و بسته به این‌که آیا
[افزونه پذیرش `DefaultStorageClass`](/docs/reference/access-authn-authz/admission-controllers/#defaultstorageclass)
فعال است یا نه، متفاوت با آن رفتار می‌شود.

* اگر افزونه پذیرش فعال باشد، مدیر می‌تواند یک StorageClass پیش‌فرض مشخص کند.
  همه‌ی PVCهایی که `storageClassName` ندارند فقط می‌توانند به PVهای آن پیش‌فرض
  پیوند بخورند. مشخص کردن یک StorageClass پیش‌فرض با تنظیم annotation
  `storageclass.kubernetes.io/is-default-class` برابر با `true` روی یک آبجکت
  StorageClass انجام می‌شود. اگر مدیر پیش‌فرضی مشخص نکند، کلاستر به ایجاد PVC
  همان‌طور که اگر افزونه پذیرش غیرفعال بود، پاسخ می‌دهد. اگر بیش از یک
  StorageClass پیش‌فرض مشخص شده باشد، جدیدترین پیش‌فرض هنگام تهیه‌سازی پویا
  PVC استفاده می‌شود.
* اگر افزونه پذیرش غیرفعال باشد، هیچ مفهومی از StorageClass پیش‌فرض وجود ندارد.
  همه‌ی PVCهایی که `storageClassName` آن‌ها روی `""` تنظیم شده، فقط می‌توانند به
  PVهایی پیوند بخورند که `storageClassName` آن‌ها نیز روی `""` تنظیم شده باشد.
  با این حال، PVCهایی که `storageClassName` ندارند، پس از در دسترس قرار گرفتن
  StorageClass پیش‌فرض، می‌توانند بعداً به‌روزرسانی شوند. اگر PVC به‌روزرسانی
  شود، دیگر به PVهایی که `storageClassName` آن‌ها نیز روی `""` تنظیم شده،
  پیوند نخواهد خورد.

برای جزئیات بیشتر به
[تخصیص گذشته‌نگر StorageClass پیش‌فرض](#retroactive-default-storageclass-assignment)
مراجعه کنید.

بسته به روش نصب، یک StorageClass پیش‌فرض ممکن است توسط مدیر افزونه (addon
manager) در طول نصب، در یک کلاستر کوبرنتیز به‌کار گرفته شود.

هنگامی که یک PVC علاوه بر درخواست یک StorageClass، یک `selector` نیز مشخص
کند، الزامات با عملگر AND به هم مرتبط می‌شوند: فقط PVی که هم کلاس درخواست‌شده و
هم labelهای درخواست‌شده را داشته باشد می‌تواند به آن PVC پیوند بخورد.

{{< note >}}
در حال حاضر، برای PVCی با یک `selector` غیرخالی، هیچ PVی نمی‌تواند به‌صورت
پویا تهیه شود.
{{< /note >}}

در گذشته، annotation `volume.beta.kubernetes.io/storage-class` به‌جای ویژگی
`storageClassName` استفاده می‌شد. این annotation همچنان کار می‌کند؛ با این
حال، در یک نسخه‌ی آینده‌ی کوبرنتیز پشتیبانی نخواهد شد.

#### تخصیص گذشته‌نگر StorageClass پیش‌فرض

{{< feature-state for_k8s_version="v1.28" state="stable" >}}

می‌توانید یک PersistentVolumeClaim را بدون مشخص کردن `storageClassName` برای
PVC جدید ایجاد کنید، و می‌توانید این کار را حتی زمانی انجام دهید که هیچ
StorageClass پیش‌فرضی در کلاستر شما وجود نداشته باشد. در این حالت، PVC جدید
همان‌طور که تعریف کرده‌اید ایجاد می‌شود، و `storageClassName` آن PVC تا زمانی
که یک پیش‌فرض در دسترس قرار بگیرد، تنظیم‌نشده باقی می‌ماند.

هنگامی که یک StorageClass پیش‌فرض در دسترس قرار می‌گیرد، control plane هر
PVC موجود بدون `storageClassName` را شناسایی می‌کند. برای PVCهایی که یا مقدار
خالی برای `storageClassName` دارند یا این کلید را ندارند، control plane سپس
آن PVCها را به‌روزرسانی می‌کند تا `storageClassName` را با StorageClass
پیش‌فرض جدید مطابقت دهد. اگر یک PVC موجود دارید که `storageClassName` آن
`""` است، و یک StorageClass پیش‌فرض پیکربندی می‌کنید، آن PVC به‌روزرسانی نخواهد
شد.

برای حفظ پیوند به PVهایی با `storageClassName` تنظیم‌شده روی `""` (در حالی که
یک StorageClass پیش‌فرض وجود دارد)، باید `storageClassName` PVC مرتبط را روی
`""` تنظیم کنید.

این رفتار به مدیران کمک می‌کند تا StorageClass پیش‌فرض را با حذف پیش‌فرض قدیمی
و سپس ایجاد یا تنظیم پیش‌فرض دیگری تغییر دهند. این بازه‌ی کوتاه که هیچ پیش‌فرضی
وجود ندارد، باعث می‌شود PVCهایی بدون `storageClassName` که در آن زمان ایجاد
شده‌اند هیچ پیش‌فرضی نداشته باشند، اما به‌دلیل تخصیص گذشته‌نگر StorageClass
پیش‌فرض، این روش تغییر پیش‌فرض‌ها ایمن است.

### ردیابی PVCهای استفاده‌نشده

{{< feature-state feature_gate_name="PersistentVolumeClaimUnusedSinceTime" >}}

هنگامی که فعال باشد، کنترلر محافظت PVC یک [condition](/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions)
با نام `Unused` به هر PersistentVolumeClaim می‌افزاید تا نشان دهد آیا در حال
حاضر توسط هیچ پاد غیر-پایانی (non-terminal) ارجاع داده می‌شود یا نه.

این condition دو وضعیت دارد:

`Unused` با status `"True"` (دلیل `NoPodsUsingPVC`)
: هیچ پاد غیر-پایانی به این PVC ارجاع نمی‌دهد. `lastTransitionTime` زمانی را
  که PVC استفاده‌نشده شد، ثبت می‌کند.

`Unused` با status `"False"` (دلیل `PodUsingPVC`)
: حداقل یک پاد غیر-پایانی در حال حاضر به این PVC ارجاع می‌دهد.
  `lastTransitionTime` زمانی را که PVC شروع به استفاده‌شدن کرد، ثبت می‌کند.

یک پاد در صورتی غیر-پایانی در نظر گرفته می‌شود که فاز آن `Succeeded` یا
`Failed` نباشد. این به این معناست که یک پاد در حالت Pending (حتی اگر هنوز
زمان‌بندی نشده باشد) به‌عنوان استفاده‌کننده از PVC به‌حساب می‌آید.

`lastTransitionTime` مربوط به condition `Unused` می‌تواند توسط مدیران کلاستر،
ابزارهای نظارتی و کنترلرهای خارجی برای شناسایی PVCهایی که مدت طولانی است
استفاده نشده‌اند، مورد استفاده قرار گیرد. برای مثال، برای یافتن همه‌ی
PVCهایی که بیش از ۳۰ روز استفاده نشده‌اند، می‌توانید PVCهایی را جستجو کنید که
condition `Unused` آن‌ها `status: "True"` است و `lastTransitionTime` آن‌ها
قدیمی‌تر از ۳۰ روز است.

{{< note >}}
مدت زمان استفاده‌نشدن که این condition نشان می‌دهد، ممکن است به‌دلیل تأخیرهای
پردازشی در کنترلر یا به‌دلیل فعال شدن این ویژگی پس از آن‌که PVC از پیش
استفاده‌نشده بوده، کوتاه‌تر از زمان واقعی استفاده‌نشدن باشد. این condition
هنگامی که PVC دارای `deletionTimestamp` تنظیم‌شده باشد (یعنی PVCهایی که در حال
حذف شدن هستند) به‌روزرسانی نمی‌شود.
{{< /note >}}

## Claimها به‌عنوان Volume

پادها با استفاده از Claim به‌عنوان یک Volume، به ذخیره‌سازی دسترسی پیدا
می‌کنند. Claimها باید در همان namespace با پادی که از آن Claim استفاده
می‌کند، وجود داشته باشند. کلاستر آن Claim را در namespace Pod پیدا می‌کند و از
آن برای دریافت PersistentVolume پشتیبان آن Claim استفاده می‌کند. سپس Volume
روی میزبان و درون پاد مانت می‌شود.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
    - name: myfrontend
      image: nginx
      volumeMounts:
      - mountPath: "/var/www/html"
        name: mypd
  volumes:
    - name: mypd
      persistentVolumeClaim:
        claimName: myclaim
```

### نکته‌ای درباره‌ی Namespaceها

پیوندهای PersistentVolume انحصاری هستند، و چون PersistentVolumeClaimها آبجکت‌های
namespace-محور هستند، مانت کردن Claimها با حالت‌های "Many" (`ROX`، `RWX`) فقط
درون یک namespace امکان‌پذیر است.

### PersistentVolumeهای از نوع `hostPath`

یک PersistentVolume از نوع `hostPath` از یک فایل یا دایرکتوری روی گره برای
شبیه‌سازی ذخیره‌سازی متصل به شبکه استفاده می‌کند. به
[مثالی از Volume از نوع `hostPath`](/docs/tutorials/configuration/configure-persistent-volume-storage/#create-a-persistentvolume)
مراجعه کنید.


## پشتیبانی از Raw Block Volume

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

افزونه‌های Volume زیر از Volumeهای بلاکی خام پشتیبانی می‌کنند، از جمله
تهیه‌سازی پویا در جایی که قابل‌اجرا باشد:

* CSI (شامل برخی از انواع Volume مهاجرت‌شده‌ی CSI)
* FC (Fibre Channel)
* iSCSI
* Local volume

### PersistentVolume با استفاده از یک Raw Block Volume {#persistent-volume-using-a-raw-block-volume}

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: block-pv
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  volumeMode: Block
  persistentVolumeReclaimPolicy: Retain
  fc:
    targetWWNs: ["50060e801049cfd1"]
    lun: 0
    readOnly: false
```

### PersistentVolumeClaim برای درخواست یک Raw Block Volume {#persistent-volume-claim-requesting-a-raw-block-volume}

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: block-pvc
spec:
  accessModes:
    - ReadWriteOnce
  volumeMode: Block
  resources:
    requests:
      storage: 10Gi
```

### مشخصات پاد برای افزودن مسیر Raw Block Device در کانتینر

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-with-block-volume
spec:
  containers:
    - name: fc-container
      image: fedora:26
      command: ["/bin/sh", "-c"]
      args: [ "tail -f /dev/null" ]
      volumeDevices:
        - name: data
          devicePath: /dev/xvda
  volumes:
    - name: data
      persistentVolumeClaim:
        claimName: block-pvc
```

{{< note >}}
هنگام افزودن یک دستگاه بلاکی خام برای یک پاد، مسیر دستگاه را در کانتینر مشخص
می‌کنید، به‌جای یک مسیر مانت.
{{< /note >}}

### پیوند Block Volumeها

اگر کاربری با استفاده از فیلد `volumeMode` در مشخصات PersistentVolumeClaim،
یک Volume بلاکی خام درخواست کند، قوانین پیوند اندکی با نسخه‌های قبلی که این
حالت را بخشی از spec در نظر نمی‌گرفتند، متفاوت است.
در ادامه جدولی از ترکیب‌های ممکنی که کاربر و مدیر ممکن است برای درخواست یک
دستگاه بلاکی خام مشخص کنند، آمده است. این جدول نشان می‌دهد آیا با آن ترکیب‌ها،
Volume پیوند می‌خورد یا نه: ماتریس پیوند Volume برای Volumeهای تهیه‌شده به‌صورت
ایستا:

| volumeMode PV | volumeMode PVC  | نتیجه           |
| --------------|:---------------:| ----------------:|
|   مشخص‌نشده | مشخص‌نشده     | BIND             |
|   مشخص‌نشده | Block           | NO BIND          |
|   مشخص‌نشده | Filesystem      | BIND             |
|   Block       | مشخص‌نشده     | NO BIND          |
|   Block       | Block           | BIND             |
|   Block       | Filesystem      | NO BIND          |
|   Filesystem  | Filesystem      | BIND             |
|   Filesystem  | Block           | NO BIND          |
|   Filesystem  | مشخص‌نشده     | BIND             |

{{< note >}}
فقط Volumeهای تهیه‌شده به‌صورت ایستا برای نسخه‌ی آلفا پشتیبانی می‌شوند. مدیران
باید هنگام کار با دستگاه‌های بلاکی خام، این مقادیر را در نظر بگیرند.
{{< /note >}}

## پشتیبانی از Snapshot Volume و بازیابی Volume از Snapshot

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

Snapshotهای Volume فقط از افزونه‌های Volume خارج از درخت (out-of-tree) CSI
پشتیبانی می‌کنند. برای جزئیات، به [Snapshotهای Volume](/docs/concepts/storage/volume-snapshots/)
مراجعه کنید. افزونه‌های Volume in-tree منسوخ شده‌اند. می‌توانید درباره‌ی
افزونه‌های Volume منسوخ‌شده در
[سؤالات متداول افزونه Volume](https://github.com/kubernetes/community/blob/main/sig-storage/volume-plugin-faq.md)
بخوانید.

### ایجاد یک PersistentVolumeClaim از یک Volume Snapshot {#create-persistent-volume-claim-from-volume-snapshot}

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: restore-pvc
spec:
  storageClassName: csi-hostpath-sc
  dataSource:
    name: new-snapshot-test
    kind: VolumeSnapshot
    apiGroup: snapshot.storage.k8s.io
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```

## کلون کردن Volume

[کلون کردن Volume](/docs/concepts/storage/volume-pvc-datasource/) فقط برای
افزونه‌های Volume CSI در دسترس است.

### ایجاد PersistentVolumeClaim از یک PVC موجود {#create-persistent-volume-claim-from-an-existing-pvc}

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: cloned-pvc
spec:
  storageClassName: my-csi-plugin
  dataSource:
    name: existing-src-pvc-name
    kind: PersistentVolumeClaim
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```

## پرکننده‌های Volume (Volume populators) و منابع داده

[کلون کردن Volume](#volume-cloning) و
[بازیابی از snapshot](#volume-snapshot-and-restore-volume-from-snapshot-support)
یک Volume جدید را از یک _منبع داده_ (data source) درون‌ساخته از پیش پُر
می‌کنند. _پرکننده‌های Volume_ این مکانیزم را گسترش می‌دهند تا یک
PersistentVolumeClaim بتواند از انواع دیگری از منابع (یک custom resource) از
پیش پُر شود، که از طریق فیلد `dataSourceRef` آن ارجاع داده می‌شود:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: populated-pvc
spec:
  dataSourceRef:
    name: example-name
    kind: ExampleDataSource
    apiGroup: example.storage.k8s.io
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```

برای جزئیات، از جمله منابع داده‌ی بین-namespace، به
[پرکننده‌های Volume و منابع داده](/docs/concepts/storage/volume-populators-and-data-sources/)
مراجعه کنید.

## نوشتن پیکربندی قابل‌حمل (Portable)

اگر قالب‌ها یا مثال‌هایی از پیکربندی می‌نویسید که روی طیف وسیعی از کلاسترها
اجرا می‌شوند و به ذخیره‌سازی persistent نیاز دارند، توصیه می‌شود از الگوی زیر
استفاده کنید:

- آبجکت‌های PersistentVolumeClaim را در بسته‌ی پیکربندی خود بگنجانید (در کنار
  Deploymentها، ConfigMapها و غیره).
- آبجکت‌های PersistentVolume را در پیکربندی نگنجانید، زیرا کاربری که آن
  پیکربندی را اجرا می‌کند ممکن است دسترسی لازم برای ایجاد PersistentVolumeها
  را نداشته باشد.
- به کاربر گزینه‌ی ارائه‌ی نام یک storage class هنگام اجرای قالب را بدهید.
  - اگر کاربر نام یک storage class را ارائه دهد، آن مقدار را در فیلد
    `persistentVolumeClaim.storageClassName` قرار دهید. این کار باعث می‌شود
    PVC با کلاس ذخیره‌سازی درست، در صورتی که کلاستر StorageClassها را توسط
    مدیر فعال کرده باشد، مطابقت پیدا کند.
  - اگر کاربر نام یک storage class ارائه ندهد، فیلد
    `persistentVolumeClaim.storageClassName` را nil رها کنید. این کار باعث
    می‌شود یک PV به‌طور خودکار با StorageClass پیش‌فرض کلاستر، برای کاربر
    تهیه شود. بسیاری از محیط‌های کلاستر یک StorageClass پیش‌فرض نصب‌شده دارند،
    یا مدیران می‌توانند StorageClass پیش‌فرض خودشان را ایجاد کنند.
- در ابزار خود، مراقب PVCهایی باشید که پس از مدتی پیوند نمی‌خورند و این را به
  کاربر نشان دهید، زیرا این می‌تواند نشان دهد که کلاستر پشتیبانی از تهیه‌سازی
  پویا ندارد (در این صورت کاربر باید یک PV منطبق ایجاد کند) یا کلاستر هیچ
  سیستم ذخیره‌سازی ندارد (در این صورت کاربر نمی‌تواند پیکربندی نیازمند به PVC
  را استقرار دهد).

## {{% heading "whatsnext" %}}

* درباره‌ی [ایجاد یک PersistentVolume](/docs/tutorials/configuration/configure-persistent-volume-storage/#create-a-persistentvolume) بیشتر بدانید.
* درباره‌ی [ایجاد یک PersistentVolumeClaim](/docs/tutorials/configuration/configure-persistent-volume-storage/#create-a-persistentvolumeclaim) بیشتر بدانید.
* سند طراحی [Persistent Storage](https://git.k8s.io/design-proposals-archive/storage/persistent-storage.md) را بخوانید.

### مراجع API {#reference}

درباره‌ی APIهای توضیح‌داده‌شده در این صفحه بخوانید:

* [`PersistentVolume`](/docs/reference/kubernetes-api/config-and-storage-resources/persistent-volume-v1/)
* [`PersistentVolumeClaim`](/docs/reference/kubernetes-api/config-and-storage-resources/persistent-volume-claim-v1/)
