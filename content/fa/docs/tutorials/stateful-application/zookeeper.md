---
reviewers:
- moh0ps
title: اجرای ZooKeeper، یک هماهنگ‌کننده سیستم توزیع‌شده
content_type: tutorial
weight: 40
---

<!-- overview -->
این آموزش اجرای [Apache Zookeeper](https://zookeeper.apache.org) را روی کوبرنتیز با استفاده از [StatefulSets](/docs/concepts/workloads/controllers/statefulset/)، [PodDisruptionBudgets](/docs/concepts/workloads/pods/disruptions/#pod-disruption-budget) و [PodAntiAffinity](/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity) نشان می‌دهد.

## {{% heading "Prerequisites" %}}

قبل از شروع این آموزش، باید با مفاهیم کوبرنتیز زیر آشنا باشید:

- [پادها](/docs/concepts/workloads/pods/)
- [خوشه DNS](/docs/concepts/services-networking/dns-pod-service/)
- [سرویس های بدون سر](/docs/concepts/services-networking/service/#headless-services)
- [حجم های پایدار](/docs/concepts/storage/persistent-volumes/) 
- [تأمین حجم پایدار](https://github.com/kubernetes/examples/tree/master/staging/persistent-volume-provisioning/)
- [StatefulSets](/docs/concepts/workloads/controllers/statefulset/)
- [بودجه های اختلال پاد](/docs/concepts/workloads/pods/disruptions/#pod-disruption-budget)
- [PodAntiAffinity](/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity)
- [kubectl رابط خط فرمان](/docs/reference/kubectl/kubectl/)

شما باید یک خوشه با حداقل چهار گره داشته باشید و هر گره حداقل به 2 CPU و 4 گیگابایت حافظه نیاز دارد. در این آموزش شما گره های خوشه را محاصره و تخلیه می کنید. **این به این معنی است که خوشه تمام پادها را در گره های خود خاتمه داده و خارج می کند و گره ها به طور موقت غیرقابل برنامه ریزی می شوند.** باید از یک خوشه اختصاصی برای این آموزش استفاده کنید یا باید اطمینان حاصل کنید که اختلالی که ایجاد می کنید با سایر مستاجران تداخلی ایجاد نمی کند.

این آموزش فرض می‌کند که شما خوشه خود را برای ارائه پویا حجم های پایدار پیکربندی کرده‌اید. اگر خوشه شما برای انجام این کار پیکربندی نشده است، قبل از شروع این آموزش باید سه جلد 20 گیگابایتی را به صورت دستی تهیه کنید.

## {{% heading "Objectives" %}}

پس از این آموزش، موارد زیر را خواهید دانست.

- نحوه‌ی استقرار یک مجموعه‌ی ZooKeeper با استفاده از StatefulSet.
- چگونه می‌توان این مجموعه را به طور مداوم پیکربندی کرد.
- چگونه می‌توان استقرار سرورهای ZooKeeper را در این مجموعه گسترش داد.
- نحوه استفاده از بودجه‌های اختلال در پاد برای اطمینان از در دسترس بودن خدمات در طول تعمیر و نگهداری برنامه‌ریزی شده.

<!-- lessoncontent -->

### ZooKeeper

[Apache ZooKeeper](https://zookeeper.apache.org/doc/current/) یک سرویس هماهنگی توزیع‌شده و متن‌باز برای برنامه‌های توزیع‌شده است. ZooKeeper به شما امکان می‌دهد داده‌ها را بخوانید، بنویسید و به‌روزرسانی‌ها را مشاهده کنید. داده‌ها در یک پرونده سیستم مانند سلسله مراتب سازماندهی شده و در تمام سرورهای ZooKeeper در گروه (مجموعه‌ای از سرورهای ZooKeeper) تکرار می‌شوند. تمام عملیات روی داده‌ها اتمی و به صورت متوالی سازگار هستند. ZooKeeper با استفاده از پروتکل اجماع [Zab](https://pdfs.semanticscholar.org/b02c/6b00bd5dbdbd951fddb00b906c82fa80f0b3.pdf) این امر را تضمین می‌کند تا یک ماشین حالت را در تمام سرورهای گروه تکرار کند.

این گروه از پروتکل Zab برای انتخاب یک رهبر استفاده می‌کند و تا زمانی که این انتخاب کامل نشود، نمی‌تواند داده‌ای بنویسد. پس از تکمیل، گروه از Zab استفاده می‌کند تا اطمینان حاصل کند که همه نوشته‌ها را قبل از تأیید و قابل مشاهده کردن برای مشتریان در حد نصاب تکرار می‌کند. بدون توجه به حد نصاب های وزن دار، حد نصاب جزء اکثریت گروهی است که رهبر فعلی را در بر می گیرد. به عنوان مثال، اگر گروه سه سرور داشته باشد، جزئی که شامل رهبر و یک سرور دیگر است، حد نصاب را تشکیل می‌دهد. اگر گروه نتواند به حد نصاب برسد، گروه نمی‌تواند داده بنویسد.

سرورهای ZooKeeper کل دستگاه حالت خود را در حافظه نگه می دارند و هر جهش را در یک WAL بادوام (Write Ahead Log) روی رسانه ذخیره سازی می نویسند. هنگامی که یک سرور از کار می‌افتد، می‌تواند با بازپخش WAL، وضعیت قبلی خود را بازیابی کند. برای جلوگیری از رشد بدون محدودیت WAL، سرورهای ZooKeeper به صورت دوره‌ای آنها را در وضعیت حافظه در رسانه ذخیره‌سازی ذخیره می‌کنند. این تصاویر می‌توانند مستقیماً در حافظه بارگذاری شوند و تمام ورودی‌های WAL که قبل از تصویر لحظه‌ای بوده‌اند، ممکن است دور ریخته شوند.

## ایجاد یک گروه ZooKeeper

تنظیمات زیر شامل یک [Headless Service](/docs/concepts/services-networking/service/#headless-services)، یک [Service](/docs/concepts/services-networking/service/)، یک [PodDisruptionBudget](/docs/concepts/workloads/pods/disruptions/#pod-disruption-budgets) و یک [StatefulSet](/docs/concepts/workloads/controllers/statefulset/) است.

{{% code_sample file="application/zookeeper/zookeeper.yaml" %}}

یک خط فرمان باز کنید و از دستور ‎[`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands/#apply)‎ برای ایجاد تنظیمات استفاده کنید.

```shell
kubectl apply -f https://k8s.io/examples/application/zookeeper/zookeeper.yaml
```

این باعث ایجاد سرویس Headless `zk-hs`، سرویس `zk-cs`، PodDisruptionBudget `zk-pdb` و StatefulSet `zk` می‌شود.

```
service/zk-hs created
service/zk-cs created
poddisruptionbudget.policy/zk-pdb created
statefulset.apps/zk created
```

برای مشاهده‌ی نحوه‌ی ایجاد پادهای StatefulSet توسط کنترل کننده StatefulSet، از [`kubectl get`](/docs/reference/generated/kubectl/kubectl-commands/#get) استفاده کنید.

```shell
kubectl get pods -w -l app=zk
```

به محض اینکه Pod `zk-2` اجرا و آماده شد، از `CTRL-C` برای خاتمه دادن به kubectl استفاده کنید.

```
NAME      READY     STATUS    RESTARTS   AGE
zk-0      0/1       Pending   0          0s
zk-0      0/1       Pending   0         0s
zk-0      0/1       ContainerCreating   0         0s
zk-0      0/1       Running   0         19s
zk-0      1/1       Running   0         40s
zk-1      0/1       Pending   0         0s
zk-1      0/1       Pending   0         0s
zk-1      0/1       ContainerCreating   0         0s
zk-1      0/1       Running   0         18s
zk-1      1/1       Running   0         40s
zk-2      0/1       Pending   0         0s
zk-2      0/1       Pending   0         0s
zk-2      0/1       ContainerCreating   0         0s
zk-2      0/1       Running   0         19s
zk-2      1/1       Running   0         40s
```

کنترل کننده StatefulSet سه پاد ایجاد می‌کند و هر پاد دارای یک کانتینر با یک سرور [ZooKeeper](https://archive.apache.org/dist/zookeeper/stable/) است.

### تسهیل انتخاب رهبر

از آنجا که هیچ الگوریتم پایانی برای انتخاب رهبر در یک شبکه ناشناس وجود ندارد، Zab برای انجام انتخاب رهبر به پیکربندی عضویت صریح نیاز دارد. هر سرور در گروه باید یک شناسه منحصر به فرد داشته باشد، همه سرورها باید مجموعه جهانی شناسه‌ها را بدانند و هر شناسه باید با یک آدرس شبکه مرتبط باشد.

برای دریافت نام میزبان‌های پادها در `zk` StatefulSet از [`kubectl exec`](/docs/reference/generated/kubectl/kubectl-commands/#exec) استفاده کنید.

```shell
for i in 0 1 2; do kubectl exec zk-$i -- hostname; done
```

کنترل‌کننده StatefulSet بر اساس اندیس ترتیبی هر پاد، یک نام میزبان منحصر به فرد به آن اختصاص می‌دهد. نام‌های میزبان به شکل `<statefulset name>-<ordinal index>` هستند. از آنجا که فیلد `replicas` در `zk` StatefulSet روی `3` تنظیم شده است، کنترل‌کننده Set سه پاد با نام‌های میزبان آنها `zk-0`، `zk-1` و `zk-2` ایجاد می‌کند.

```
zk-0
zk-1
zk-2
```

سرورهای موجود در یک مجموعه ZooKeeper از اعداد طبیعی به عنوان شناسه‌های منحصر به فرد استفاده می‌کنند و شناسه هر سرور را در پونده ای به نام `myid` در پوشه داده‌های سرور ذخیره می‌کنند.

برای بررسی محتویات پرونده `myid` برای هر سرور از دستور زیر استفاده کنید.

```shell
for i in 0 1 2; do echo "myid zk-$i";kubectl exec zk-$i -- cat /var/lib/zookeeper/data/myid; done
```

از آنجا که شناسه‌ها اعداد طبیعی هستند و اندیس‌های ترتیبی اعداد صحیح غیر منفی هستند، می‌توانید با اضافه کردن ۱ به عدد ترتیبی، یک شناسه تولید کنید.

```
myid zk-0
1
myid zk-1
2
myid zk-2
3
```

برای دریافت نام دامنه کاملاً واجد شرایط (FQDN) هر پاد در «zk» StatefulSet از دستور زیر استفاده کنید.

```shell
for i in 0 1 2; do kubectl exec zk-$i -- hostname -f; done
```

سرویس `zk-hs` برای همه پادها یک دامنه ایجاد می‌کند، `zk-hs.default.svc.cluster.local`.
```
zk-0.zk-hs.default.svc.cluster.local
zk-1.zk-hs.default.svc.cluster.local
zk-2.zk-hs.default.svc.cluster.local
```

رکوردهای A در [کوبرنتیز DNS](/docs/concepts/services-networking/dns-pod-service/) FQDNها را به نشانی‌های IP پادها تبدیل می‌کنند. اگر کوبرنتیز زمان‌بندی پادها را تغییر دهد، رکوردهای A را با نشانی‌های IP جدید پادها به‌روزرسانی می‌کند، اما نام رکوردهای A تغییر نخواهد کرد.

ZooKeeper پیکربندی برنامه خود را در پرونده ای به نام `zoo.cfg` ذخیره می‌کند. برای مشاهده محتوای پرونده `zoo.cfg` در `zk-0` Pod از `kubectl exec` استفاده کنید.

```shell
kubectl exec zk-0 -- cat /opt/zookeeper/conf/zoo.cfg
```

در ویژگی‌های `server.1`، `server.2` و `server.3` در پایین پرونده، `1`، `2` و `3` مربوط به شناسه‌های موجود در پرونده‌های `myid` سرورهای ZooKeeper هستند. آن‌ها روی FQDNهای مربوط به پادها در `zk` StatefulSet تنظیم شده‌اند.

```
clientPort=2181
dataDir=/var/lib/zookeeper/data
dataLogDir=/var/lib/zookeeper/log
tickTime=2000
initLimit=10
syncLimit=2000
maxClientCnxns=60
minSessionTimeout= 4000
maxSessionTimeout= 40000
autopurge.snapRetainCount=3
autopurge.purgeInterval=0
server.1=zk-0.zk-hs.default.svc.cluster.local:2888:3888
server.2=zk-1.zk-hs.default.svc.cluster.local:2888:3888
server.3=zk-2.zk-hs.default.svc.cluster.local:2888:3888
```

### دستیابی به اجماع

پروتکل‌های اجماع مستلزم آن هستند که شناسه‌های هر شرکت‌کننده منحصر به فرد باشند. هیچ دو شرکت‌کننده‌ای در پروتکل Zab نباید شناسه منحصر به فرد یکسانی را ادعا کنند. این امر برای اینکه فرآیندهای موجود در سیستم بتوانند در مورد اینکه کدام فرآیندها کدام داده‌ها را ثبت کرده‌اند، توافق کنند، ضروری است. اگر دو پاد با ترتیبی یکسان راه اندازی شوند، دو سرور ZooKeeper هر دو خود را به عنوان یک سرور معرفی می کنند.

```shell
kubectl get pods -w -l app=zk
```

```
NAME      READY     STATUS    RESTARTS   AGE
zk-0      0/1       Pending   0          0s
zk-0      0/1       Pending   0         0s
zk-0      0/1       ContainerCreating   0         0s
zk-0      0/1       Running   0         19s
zk-0      1/1       Running   0         40s
zk-1      0/1       Pending   0         0s
zk-1      0/1       Pending   0         0s
zk-1      0/1       ContainerCreating   0         0s
zk-1      0/1       Running   0         18s
zk-1      1/1       Running   0         40s
zk-2      0/1       Pending   0         0s
zk-2      0/1       Pending   0         0s
zk-2      0/1       ContainerCreating   0         0s
zk-2      0/1       Running   0         19s
zk-2      1/1       Running   0         40s
```

رکوردهای A برای هر پاد زمانی وارد می شوند که پاد آماده شود. بنابراین، FQDN های سرورهای ZooKeeper به یک نقطه پایانی واحد تبدیل می‌شوند و آن نقطه پایانی، سرور ZooKeeper منحصر به فردی خواهد بود که هویت پیکربندی شده در پرونده `myid` خود را ادعا می‌کند.
```
zk-0.zk-hs.default.svc.cluster.local
zk-1.zk-hs.default.svc.cluster.local
zk-2.zk-hs.default.svc.cluster.local
```

این تضمین می‌کند که ویژگی‌های `servers` در پرونده‌های `zoo.cfg` متعلق به ZooKeepers، یک مجموعه پیکربندی‌شده‌ی صحیح را نشان می‌دهند.
```
server.1=zk-0.zk-hs.default.svc.cluster.local:2888:3888
server.2=zk-1.zk-hs.default.svc.cluster.local:2888:3888
server.3=zk-2.zk-hs.default.svc.cluster.local:2888:3888
```

وقتی سرورها از پروتکل Zab برای تلاش برای ثبت یک مقدار استفاده می‌کنند، یا به اجماع می‌رسند و مقدار را ثبت می‌کنند (اگر انتخاب رهبر موفقیت‌آمیز بوده و حداقل دو تا از پادها در حال اجرا و آماده باشند)، یا در انجام این کار شکست می‌خورند (اگر هر یک از شرایط برقرار نباشد). هیچ وضعیتی پیش نمی‌آید که یک سرور، نوشتن را از طرف سرور دیگر تأیید کند.

### تست سلامت عقل گروه

اساسی‌ترین آزمون سلامت عقل، نوشتن داده‌ها در یک سرور ZooKeeper و خواندن داده‌ها از سرور دیگر است.

دستور زیر اسکریپت "zkCli.sh" را برای نوشتن "world" در مسیر "/hello" در "zk-0" پاد در گروه اجرا می‌کند.
```shell
kubectl exec zk-0 -- zkCli.sh create /hello world
```

```
WATCHER::

WatchedEvent state:SyncConnected type:None path:null
Created /hello
```

برای دریافت داده‌ها از پاد `zk-1` از دستور زیر استفاده کنید.
```shell
kubectl exec zk-1 -- zkCli.sh get /hello
```

داده‌هایی که شما در `zk-0` ایجاد کرده‌اید، در تمام سرورهای موجود در مجموعه موجود است.
```
WATCHER::

WatchedEvent state:SyncConnected type:None path:null
world
cZxid = 0x100000002
ctime = Thu Dec 08 15:13:30 UTC 2016
mZxid = 0x100000002
mtime = Thu Dec 08 15:13:30 UTC 2016
pZxid = 0x100000002
cversion = 0
dataVersion = 0
aclVersion = 0
ephemeralOwner = 0x0
dataLength = 5
numChildren = 0
```

### فراهم کردن فضای ذخیره‌سازی بادوام

همانطور که در بخش [مبانی ZooKeeper](#zookeeper) ذکر شد، ZooKeeper تمام ورودی‌ها را در یک WAL بادوام ثبت می‌کند و به صورت دوره‌ای تصویر‌ها را در حالت حافظه، روی رسانه ذخیره‌سازی می‌نویسد. استفاده از WALها برای تأمین دوام، یک تکنیک رایج برای برنامه‌هایی است که از پروتکل‌های اجماع برای دستیابی به یک ماشین حالت تکثیر شده استفاده می‌کنند.

برای حذف مجموعه حالت‌های `zk` از دستور [`kubectl delete`](/docs/reference/generated/kubectl/kubectl-commands/#delete) استفاده کنید.

```shell
kubectl delete statefulset zk
```

```
statefulset.apps "zk" deleted
```

به خاتمه‌ی پادها در StatefulSet توجه کنید.

```shell
kubectl get pods -w -l app=zk
```

وقتی `zk-0` به طور کامل خاتمه یافت، از `CTRL-C` برای خاتمه دادن به kubectl استفاده کنید.

```
zk-2      1/1       Terminating   0         9m
zk-0      1/1       Terminating   0         11m
zk-1      1/1       Terminating   0         10m
zk-2      0/1       Terminating   0         9m
zk-2      0/1       Terminating   0         9m
zk-2      0/1       Terminating   0         9m
zk-1      0/1       Terminating   0         10m
zk-1      0/1       Terminating   0         10m
zk-1      0/1       Terminating   0         10m
zk-0      0/1       Terminating   0         11m
zk-0      0/1       Terminating   0         11m
zk-0      0/1       Terminating   0         11m
```

تنظیمات را در `zookeeper.yaml` دوباره اعمال کنید.

```shell
kubectl apply -f https://k8s.io/examples/application/zookeeper/zookeeper.yaml
```

این شیء StatefulSet با شناسه `zk` را ایجاد می‌کند، اما سایر اشیاء API موجود در تنظیمات تغییر نمی‌کنند زیرا از قبل وجود دارند.

ببینید که کنترل کننده StatefulSet چگونه پاد های StatefulSet را بازسازی می‌کند.

```shell
kubectl get pods -w -l app=zk
```

به محض اینکه پاد `zk-2` اجرا و آماده شد، از `CTRL-C` برای خاتمه دادن به kubectl استفاده کنید.

```
NAME      READY     STATUS    RESTARTS   AGE
zk-0      0/1       Pending   0          0s
zk-0      0/1       Pending   0         0s
zk-0      0/1       ContainerCreating   0         0s
zk-0      0/1       Running   0         19s
zk-0      1/1       Running   0         40s
zk-1      0/1       Pending   0         0s
zk-1      0/1       Pending   0         0s
zk-1      0/1       ContainerCreating   0         0s
zk-1      0/1       Running   0         18s
zk-1      1/1       Running   0         40s
zk-2      0/1       Pending   0         0s
zk-2      0/1       Pending   0         0s
zk-2      0/1       ContainerCreating   0         0s
zk-2      0/1       Running   0         19s
zk-2      1/1       Running   0         40s
```

از دستور زیر برای دریافت مقداری که در طول [آزمون سلامت عقل](#sanity-testing-the-ensemble) از پاد `zk-2` وارد کرده‌اید، استفاده کنید.

```shell
kubectl exec zk-2 zkCli.sh get /hello
```

حتی اگر تمام پادها را در `zk` StatefulSet خاتمه داده و از نو ایجاد کرده باشید، این مجموعه هنوز مقدار اصلی را ارائه می‌دهد.

```
WATCHER::

WatchedEvent state:SyncConnected type:None path:null
world
cZxid = 0x100000002
ctime = Thu Dec 08 15:13:30 UTC 2016
mZxid = 0x100000002
mtime = Thu Dec 08 15:13:30 UTC 2016
pZxid = 0x100000002
cversion = 0
dataVersion = 0
aclVersion = 0
ephemeralOwner = 0x0
dataLength = 5
numChildren = 0
```

بخش `volumeClaimTemplates` از `spec` مربوط به `zk` StatefulSet، یک حجم ماندگار ارائه شده برای هر پاد را مشخص می‌کند.

```yaml
volumeClaimTemplates:
  - metadata:
      name: datadir
      annotations:
        volume.alpha.kubernetes.io/storage-class: anything
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 20Gi
```

کنترل کننده `StatefulSet` برای هر پاد در `StatefulSet` یک `PersistentVolumeClaim` تولید می‌کند.

برای دریافت `PersistentVolumeClaims` از `StatefulSet` از دستور زیر استفاده کنید.

```shell
kubectl get pvc -l app=zk
```

وقتی «StatefulSet» پادهای خود را دوباره ایجاد کرد، حجم های ماندگار پادها را دوباره متصل می‌کند.

```
NAME           STATUS    VOLUME                                     CAPACITY   ACCESSMODES   AGE
datadir-zk-0   Bound     pvc-bed742cd-bcb1-11e6-994f-42010a800002   20Gi       RWO           1h
datadir-zk-1   Bound     pvc-bedd27d2-bcb1-11e6-994f-42010a800002   20Gi       RWO           1h
datadir-zk-2   Bound     pvc-bee0817e-bcb1-11e6-994f-42010a800002   20Gi       RWO           1h
```

بخش "volumeMounts" از "الگوی" کانتینر "StatefulSet" PersistentVolumes را در فهرست راهنمای داده‌های سرورهای ZooKeeper متصل می‌کند.

```yaml
volumeMounts:
- name: datadir
  mountPath: /var/lib/zookeeper
```

وقتی یک پاد در `zk` `StatefulSet` (دوباره) زمان‌بندی می‌شود، همیشه همان `PersistentVolume` را خواهد داشت که در پوشه داده‌های سرور ZooKeeper متصل شده است. حتی وقتی پادها زمان‌بندی مجدد می‌شوند، تمام نوشته‌های انجام شده در WALهای سرورهای ZooKeeper و تمام تصویر‌های آنها، پایدار باقی می‌مانند.

## تضمین پیکربندی پایدار

همانطور که در بخش‌های [تسهیل‌کننده‌ی انتخاب رهبر](#facilitating-leader-election) و [Achieving Consensus](#achieving-consensus) اشاره شد، سرورهای موجود در یک مجموعه‌ی ZooKeeper برای انتخاب یک رهبر و تشکیل یک حد نصاب به پیکربندی سازگار نیاز دارند. آن‌ها همچنین برای اینکه پروتکل به درستی در یک شبکه کار کند، به پیکربندی سازگار پروتکل Zab نیاز دارند. در مثال ما، با جاسازی مستقیم پیکربندی در مانیفست، به پیکربندی سازگار دست می‌یابیم.

StatefulSet مربوط به `zk` را دریافت کنید.

```shell
kubectl get sts zk -o yaml
```

```
…
command:
      - sh
      - -c
      - "start-zookeeper \
        --servers=3 \
        --data_dir=/var/lib/zookeeper/data \
        --data_log_dir=/var/lib/zookeeper/data/log \
        --conf_dir=/opt/zookeeper/conf \
        --client_port=2181 \
        --election_port=3888 \
        --server_port=2888 \
        --tick_time=2000 \
        --init_limit=10 \
        --sync_limit=5 \
        --heap=512M \
        --max_client_cnxns=60 \
        --snap_retain_count=3 \
        --purge_interval=12 \
        --max_session_timeout=40000 \
        --min_session_timeout=4000 \
        --log_level=INFO"
…
```

دستوری که برای شروع سرورهای ZooKeeper استفاده شد، پیکربندی را به عنوان پارامتر خط فرمان ارسال کرد. همچنین می‌توانید از متغیرهای محیطی برای ارسال پیکربندی به مجموعه استفاده کنید.

### پیکربندی ثبت وقایع

یکی از پرونده‌های تولید شده توسط اسکریپت `zkGenConfig.sh` ثبت وقایع ZooKeeper را کنترل می‌کند. ZooKeeper از [Log4j](https://logging.apache.org/log4j/2.x/) استفاده می‌کند و به طور پیش‌فرض، از یک پیوست‌کننده پرونده غلتان مبتنی بر زمان و اندازه برای پیکربندی ثبت وقایع خود استفاده می‌کند.

از دستور زیر برای دریافت پیکربندی ثبت وقایع از یکی از Podها در `zk` `StatefulSet` استفاده کنید.

```shell
kubectl exec zk-0 cat /usr/etc/zookeeper/log4j.properties
```

پیکربندی ثبت وقایع زیر باعث می‌شود فرآیند ZooKeeper تمام گزارش‌های خود را در جریان پرونده خروجی استاندارد بنویسد.

```
zookeeper.root.logger=CONSOLE
zookeeper.console.threshold=INFO
log4j.rootLogger=${zookeeper.root.logger}
log4j.appender.CONSOLE=org.apache.log4j.ConsoleAppender
log4j.appender.CONSOLE.Threshold=${zookeeper.console.threshold}
log4j.appender.CONSOLE.layout=org.apache.log4j.PatternLayout
log4j.appender.CONSOLE.layout.ConversionPattern=%d{ISO8601} [myid:%X{myid}] - %-5p [%t:%C{1}@%L] - %m%n
```

این ساده‌ترین راه ممکن برای ورود ایمن به داخل کانتینر است.
از آنجایی که برنامه‌ها گزارش‌ها را به صورت استاندارد می‌نویسند، کوبرنتیز چرخش گزارش را برای شما مدیریت می‌کند.
کوبرنتیز همچنین یک سیاست حفظ منطقی را پیاده‌سازی می‌کند که تضمین می‌کند گزارش‌های برنامه نوشته شده به صورت استاندارد و خطای استاندارد رسانه ذخیره‌سازی محلی را خسته نمی‌کند.

برای بازیابی ۲۰ خط گزارش آخر از یکی از پادها، از [`kubectl logs`](/docs/reference/generated/kubectl/kubectl-commands/#logs) استفاده کنید.

```shell
kubectl logs zk-0 --tail 20
```

شما می‌توانید گزارش‌های برنامه نوشته شده روی خروجی استاندارد یا خطای استاندارد را با استفاده از `kubectl logs` و از داشبورد کوبرنتیز مشاهده کنید.

```
2016-12-06 19:34:16,236 [myid:1] - INFO  [NIOServerCxn.Factory:0.0.0.0/0.0.0.0:2181:NIOServerCnxn@827] - Processing ruok command from /127.0.0.1:52740
2016-12-06 19:34:16,237 [myid:1] - INFO  [Thread-1136:NIOServerCnxn@1008] - Closed socket connection for client /127.0.0.1:52740 (no session established for client)
2016-12-06 19:34:26,155 [myid:1] - INFO  [NIOServerCxn.Factory:0.0.0.0/0.0.0.0:2181:NIOServerCnxnFactory@192] - Accepted socket connection from /127.0.0.1:52749
2016-12-06 19:34:26,155 [myid:1] - INFO  [NIOServerCxn.Factory:0.0.0.0/0.0.0.0:2181:NIOServerCnxn@827] - Processing ruok command from /127.0.0.1:52749
2016-12-06 19:34:26,156 [myid:1] - INFO  [Thread-1137:NIOServerCnxn@1008] - Closed socket connection for client /127.0.0.1:52749 (no session established for client)
2016-12-06 19:34:26,222 [myid:1] - INFO  [NIOServerCxn.Factory:0.0.0.0/0.0.0.0:2181:NIOServerCnxnFactory@192] - Accepted socket connection from /127.0.0.1:52750
2016-12-06 19:34:26,222 [myid:1] - INFO  [NIOServerCxn.Factory:0.0.0.0/0.0.0.0:2181:NIOServerCnxn@827] - Processing ruok command from /127.0.0.1:52750
2016-12-06 19:34:26,226 [myid:1] - INFO  [Thread-1138:NIOServerCnxn@1008] - Closed socket connection for client /127.0.0.1:52750 (no session established for client)
2016-12-06 19:34:36,151 [myid:1] - INFO  [NIOServerCxn.Factory:0.0.0.0/0.0.0.0:2181:NIOServerCnxnFactory@192] - Accepted socket connection from /127.0.0.1:52760
2016-12-06 19:34:36,152 [myid:1] - INFO  [NIOServerCxn.Factory:0.0.0.0/0.0.0.0:2181:NIOServerCnxn@827] - Processing ruok command from /127.0.0.1:52760
2016-12-06 19:34:36,152 [myid:1] - INFO  [Thread-1139:NIOServerCnxn@1008] - Closed socket connection for client /127.0.0.1:52760 (no session established for client)
2016-12-06 19:34:36,230 [myid:1] - INFO  [NIOServerCxn.Factory:0.0.0.0/0.0.0.0:2181:NIOServerCnxnFactory@192] - Accepted socket connection from /127.0.0.1:52761
2016-12-06 19:34:36,231 [myid:1] - INFO  [NIOServerCxn.Factory:0.0.0.0/0.0.0.0:2181:NIOServerCnxn@827] - Processing ruok command from /127.0.0.1:52761
2016-12-06 19:34:36,231 [myid:1] - INFO  [Thread-1140:NIOServerCnxn@1008] - Closed socket connection for client /127.0.0.1:52761 (no session established for client)
2016-12-06 19:34:46,149 [myid:1] - INFO  [NIOServerCxn.Factory:0.0.0.0/0.0.0.0:2181:NIOServerCnxnFactory@192] - Accepted socket connection from /127.0.0.1:52767
2016-12-06 19:34:46,149 [myid:1] - INFO  [NIOServerCxn.Factory:0.0.0.0/0.0.0.0:2181:NIOServerCnxn@827] - Processing ruok command from /127.0.0.1:52767
2016-12-06 19:34:46,149 [myid:1] - INFO  [Thread-1141:NIOServerCnxn@1008] - Closed socket connection for client /127.0.0.1:52767 (no session established for client)
2016-12-06 19:34:46,230 [myid:1] - INFO  [NIOServerCxn.Factory:0.0.0.0/0.0.0.0:2181:NIOServerCnxnFactory@192] - Accepted socket connection from /127.0.0.1:52768
2016-12-06 19:34:46,230 [myid:1] - INFO  [NIOServerCxn.Factory:0.0.0.0/0.0.0.0:2181:NIOServerCnxn@827] - Processing ruok command from /127.0.0.1:52768
2016-12-06 19:34:46,230 [myid:1] - INFO  [Thread-1142:NIOServerCnxn@1008] - Closed socket connection for client /127.0.0.1:52768 (no session established for client)
```

کوبرنتیز با بسیاری از راه‌حل‌های ثبت وقایع (logging) ادغام می‌شود. می‌توانید راه‌حلی برای ورود به سیستم انتخاب کنید که به بهترین وجه متناسب با خوشه و برنامه‌های شما باشد. برای ثبت وقایع و تجمیع وقایع در سطح خوشه، استقرار یک [sidecar container](/docs/concepts/cluster-administration/logging#sidecar-container-with-logging-agent) را برای چرخش و ارسال وقایع (logs) خود در نظر بگیرید.

### پیکربندی یک کاربر غیرمجاز

بهترین شیوه‌ها برای اجازه دادن به یک برنامه برای اجرای آن به عنوان یک کاربر دارای امتیاز در داخل یک کانتینر، موضوع بحث است. اگر سازمان شما نیاز دارد که برنامه‌ها به عنوان یک کاربر بدون امتیاز اجرا شوند، می‌توانید از یک [SecurityContext](/docs/tasks/configure-pod-container/security-context/) برای کنترل کاربری که نقطه ورود به عنوان آن اجرا می‌شود، استفاده کنید.

قالب پاد مربوط به `zk` مربوط به `StatefulSet` شامل یک `SecurityContext` است.

```yaml
securityContext:
  runAsUser: 1000
  fsGroup: 1000
```

در کانتینرهای پادها، شناسه کاربری ۱۰۰۰ مربوط به کاربر zookeeper و شناسه کاربری ۱۰۰۰ مربوط به گروه zookeeper است.

اطلاعات فرآیند ZooKeeper را از پاد `zk-0` دریافت کنید.

```shell
kubectl exec zk-0 -- ps -elf
```

از آنجایی که بخش `runAsUser` از شیء `securityContext` روی ۱۰۰۰ تنظیم شده است، فرآیند ZooKeeper به جای اجرا به عنوان کاربر root، به عنوان کاربر zookeeper اجرا می‌شود.

```
F S UID        PID  PPID  C PRI  NI ADDR SZ WCHAN  STIME TTY          TIME CMD
4 S zookeep+     1     0  0  80   0 -  1127 -      20:46 ?        00:00:00 sh -c zkGenConfig.sh && zkServer.sh start-foreground
0 S zookeep+    27     1  0  80   0 - 1155556 -    20:46 ?        00:00:19 /usr/lib/jvm/java-8-openjdk-amd64/bin/java -Dzookeeper.log.dir=/var/log/zookeeper -Dzookeeper.root.logger=INFO,CONSOLE -cp /usr/bin/../build/classes:/usr/bin/../build/lib/*.jar:/usr/bin/../share/zookeeper/zookeeper-3.4.9.jar:/usr/bin/../share/zookeeper/slf4j-log4j12-1.6.1.jar:/usr/bin/../share/zookeeper/slf4j-api-1.6.1.jar:/usr/bin/../share/zookeeper/netty-3.10.5.Final.jar:/usr/bin/../share/zookeeper/log4j-1.2.16.jar:/usr/bin/../share/zookeeper/jline-0.9.94.jar:/usr/bin/../src/java/lib/*.jar:/usr/bin/../etc/zookeeper: -Xmx2G -Xms2G -Dcom.sun.management.jmxremote -Dcom.sun.management.jmxremote.local.only=false org.apache.zookeeper.server.quorum.QuorumPeerMain /usr/bin/../etc/zookeeper/zoo.cfg
```

به طور پیش‌فرض، وقتی حجم های پایدار مربوط به پاد در پوشه داده‌های سرور ZooKeeper نصب می‌شود، فقط توسط کاربر root قابل دسترسی است. این پیکربندی از نوشتن فرآیند ZooKeeper در WAL و ذخیره تصویرهای آن جلوگیری می‌کند.

برای دریافت مجوزهای پرونده پوشه داده ZooKeeper در پاد `zk-0` از دستور زیر استفاده کنید.

```shell
kubectl exec -ti zk-0 -- ls -ld /var/lib/zookeeper/data
```

از آنجا که بخش `fsGroup` از شیء `securityContext` روی ۱۰۰۰ تنظیم شده است، مالکیت حجم های پایدار مربوط به پادها به گروه zookeeper تنظیم شده است و فرآیند ZooKeeper قادر به خواندن و نوشتن داده‌های آن است.

```
drwxr-sr-x 3 zookeeper zookeeper 4096 Dec  5 20:45 /var/lib/zookeeper/data
```

## مدیریت فرآیند ZooKeeper

در [مستندات ZooKeeper](https://zookeeper.apache.org/doc/current/zookeeperAdmin.html#sc_supervision) ذکر شده است که "شما به یک فرآیند نظارتی نیاز دارید که هر یک از فرآیندهای سرور ZooKeeper (JVM) شما را مدیریت کند." استفاده از یک watchdog (فرآیند نظارتی) برای راه‌اندازی مجدد فرآیندهای ناموفق در یک سیستم توزیع‌شده، یک الگوی رایج است. هنگام استقرار یک برنامه در کوبرنتیز، به جای استفاده از یک ابزار خارجی به عنوان یک فرآیند نظارتی، باید از کوبرنتیز به عنوان watchdog برای برنامه خود استفاده کنید.

### به روز رسانی مجموعه

`zk` `StatefulSet` طوری پیکربندی شده است که از استراتژی به‌روزرسانی `RollingUpdate` استفاده کند.

شما می‌توانید از `kubectl patch` برای به‌روزرسانی تعداد `cpu` اختصاص داده شده به سرورها استفاده کنید.

```shell
kubectl patch sts zk --type='json' -p='[{"op": "replace", "path": "/spec/template/spec/containers/0/resources/requests/cpu", "value":"0.3"}]'
```

```
statefulset.apps/zk patched
```

برای مشاهده وضعیت به‌روزرسانی از `kubectl rollout status` استفاده کنید.

```shell
kubectl rollout status sts/zk
```

```
waiting for statefulset rolling update to complete 0 pods at revision zk-5db4499664...
Waiting for 1 pods to be ready...
Waiting for 1 pods to be ready...
waiting for statefulset rolling update to complete 1 pods at revision zk-5db4499664...
Waiting for 1 pods to be ready...
Waiting for 1 pods to be ready...
waiting for statefulset rolling update to complete 2 pods at revision zk-5db4499664...
Waiting for 1 pods to be ready...
Waiting for 1 pods to be ready...
statefulset rolling update complete 3 pods at revision zk-5db4499664...
```

این کار، پادها را یکی یکی و به ترتیب ترتیب معکوس خاتمه می‌دهد و آنها را با پیکربندی جدید دوباره ایجاد می‌کند. این تضمین می‌کند که حد نصاب در طول به‌روزرسانی مداوم حفظ شود.

برای مشاهده تاریخچه یا پیکربندی‌های قبلی، از دستور `kubectl rollout history` استفاده کنید.

```shell
kubectl rollout history sts/zk
```

خروجی مشابه این است:

```
statefulsets "zk"
REVISION
1
2
```

برای بازگرداندن تغییرات به حالت قبل، از دستور `kubectl rollout undo` استفاده کنید.

```shell
kubectl rollout undo sts/zk
```

خروجی مشابه این است:

```
statefulset.apps/zk rolled back
```

### مدیریت شکست فرآیند

[سیاست‌های راه‌اندازی مجدد](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy) کنترل می‌کند که کوبرنتیز چگونه با شکست‌های فرآیند برای نقطه ورودی کانتینر در یک پاد برخورد می‌کند. برای پادهای موجود در `StatefulSet`، تنها `RestartPolicy` مناسب، Always است و این مقدار پیش‌فرض است. برای برنامه‌های stateful، **هرگز** نباید سیاست پیش‌فرض را لغو کنید.

از دستور زیر برای بررسی درخت فرآیند سرور ZooKeeper که در پاد `zk-0` اجرا می‌شود، استفاده کنید.

```shell
kubectl exec zk-0 -- ps -ef
```

دستوری که به عنوان نقطه ورود کانتینر استفاده می‌شود، PID 1 دارد و فرآیند ZooKeeper که فرزند نقطه ورود است، PID 27 دارد.

```
UID        PID  PPID  C STIME TTY          TIME CMD
zookeep+     1     0  0 15:03 ?        00:00:00 sh -c zkGenConfig.sh && zkServer.sh start-foreground
zookeep+    27     1  0 15:03 ?        00:00:03 /usr/lib/jvm/java-8-openjdk-amd64/bin/java -Dzookeeper.log.dir=/var/log/zookeeper -Dzookeeper.root.logger=INFO,CONSOLE -cp /usr/bin/../build/classes:/usr/bin/../build/lib/*.jar:/usr/bin/../share/zookeeper/zookeeper-3.4.9.jar:/usr/bin/../share/zookeeper/slf4j-log4j12-1.6.1.jar:/usr/bin/../share/zookeeper/slf4j-api-1.6.1.jar:/usr/bin/../share/zookeeper/netty-3.10.5.Final.jar:/usr/bin/../share/zookeeper/log4j-1.2.16.jar:/usr/bin/../share/zookeeper/jline-0.9.94.jar:/usr/bin/../src/java/lib/*.jar:/usr/bin/../etc/zookeeper: -Xmx2G -Xms2G -Dcom.sun.management.jmxremote -Dcom.sun.management.jmxremote.local.only=false org.apache.zookeeper.server.quorum.QuorumPeerMain /usr/bin/../etc/zookeeper/zoo.cfg
```

در یک خط فرمان دیگر، با دستور زیر، پادها را در `zk` `StatefulSet` زیر نظر بگیرید.

```shell
kubectl get pod -w -l app=zk
```

در یک خط فرمان دیگر، فرآیند ZooKeeper را در پاد `zk-0` با دستور زیر خاتمه دهید.

```shell
kubectl exec zk-0 -- pkill java
```

خاتمه یافتن فرآیند ZooKeeper باعث خاتمه یافتن فرآیند والد آن شد. از آنجا که `RestartPolicy` مربوط به کانتینر Always است، فرآیند والد را مجدداً راه‌اندازی کرد.

```
NAME      READY     STATUS    RESTARTS   AGE
zk-0      1/1       Running   0          21m
zk-1      1/1       Running   0          20m
zk-2      1/1       Running   0          19m
NAME      READY     STATUS    RESTARTS   AGE
zk-0      0/1       Error     0          29m
zk-0      0/1       Running   1         29m
zk-0      1/1       Running   1         29m
```

اگر برنامه شما از اسکریپتی (مانند `zkServer.sh`) برای راه‌اندازی فرآیندی که منطق تجاری برنامه را پیاده‌سازی می‌کند استفاده می‌کند، اسکریپت باید با فرآیند فرزند خاتمه یابد. این تضمین می‌کند که کوبرنتیز در صورت عدم موفقیت فرآیند پیاده‌سازی منطق تجاری برنامه، کانتینر برنامه را مجدداً راه‌اندازی کند.

### آزمایش برای زنده بودن

پیکربندی برنامه شما برای راه‌اندازی مجدد فرآیندهای ناموفق برای سالم نگه داشتن یک سیستم توزیع‌شده کافی نیست. سناریوهایی وجود دارد که در آن‌ها فرآیندهای یک سیستم می‌توانند هم فعال و هم غیرفعال یا به هر حال ناسالم باشند. شما باید از کاوشگرهای زنده بودن برای اطلاع‌رسانی به کوبرنتیز استفاده کنید که فرآیندهای برنامه شما ناسالم هستند و باید آن‌ها را مجدداً راه‌اندازی کند.

قالب پاد برای `zk` `StatefulSet` یک کاوشگر زنده بودن را مشخص می‌کند.

```yaml
  livenessProbe:
    exec:
      command:
      - sh
      - -c
      - "zookeeper-ready 2181"
    initialDelaySeconds: 15
    timeoutSeconds: 5
```

این کاوشگر یک اسکریپت bash را فراخوانی می‌کند که از کلمه چهار حرفی `ruok` در ZooKeeper برای آزمایش سلامت سرور استفاده می‌کند.

```
OK=$(echo ruok | nc 127.0.0.1 $1)
if [ "$OK" == "imok" ]; then
    exit 0
else
    exit 1
fi
```

در یک پنجره خط فرمان، از دستور زیر برای مشاهده پادها در StatefulSet مربوط به `zk` استفاده کنید.

```shell
kubectl get pod -w -l app=zk
```

در پنجره‌ی دیگری، با استفاده از دستور زیر، اسکریپت `zookeeper-ready` را از سیستم پرونده پاد `zk-0` حذف کنید.

```shell
kubectl exec zk-0 -- rm /opt/zookeeper/bin/zookeeper-ready
```

هنگامی که بررسی زنده بودن فرآیند ZooKeeper با شکست مواجه شود، کوبرنتیز به طور خودکار فرآیند را برای شما مجدداً راه‌اندازی می‌کند و اطمینان حاصل می‌کند که فرآیندهای ناسالم در مجموعه مجدداً راه‌اندازی می‌شوند.

```shell
kubectl get pod -w -l app=zk
```

```
NAME      READY     STATUS    RESTARTS   AGE
zk-0      1/1       Running   0          1h
zk-1      1/1       Running   0          1h
zk-2      1/1       Running   0          1h
NAME      READY     STATUS    RESTARTS   AGE
zk-0      0/1       Running   0          1h
zk-0      0/1       Running   1         1h
zk-0      1/1       Running   1         1h
```

### آزمایش برای آمادگی

آمادگی با زنده بودن یکسان نیست. اگر فرآیندی زنده باشد، برنامه‌ریزی شده و سالم است. اگر فرآیندی آماده باشد، قادر به پردازش ورودی است. زنده بودن شرط لازم اما نه کافی برای آمادگی است. مواردی وجود دارد، به ویژه در هنگام مقداردهی اولیه و خاتمه، که یک فرآیند می‌تواند زنده باشد اما آماده نباشد.

اگر یک بررسی آمادگی مشخص کنید، کوبرنتیز تضمین می‌کند که فرآیندهای برنامه شما تا زمانی که بررسی‌های آمادگی آنها با موفقیت انجام نشود، ترافیک شبکه دریافت نخواهند کرد.

برای یک سرور ZooKeeper، زنده بودن به معنای آمادگی است. بنابراین، کاوشگر آمادگی از تنظیمات `zookeeper.yaml` با کاوشگر زنده بودن یکسان است.

```yaml
  readinessProbe:
    exec:
      command:
      - sh
      - -c
      - "zookeeper-ready 2181"
    initialDelaySeconds: 15
    timeoutSeconds: 5
```

اگرچه کاوشگرهای زنده بودن و آمادگی یکسان هستند، اما مشخص کردن هر دو مهم است. این تضمین می‌کند که فقط سرورهای سالم در مجموعه ZooKeeper ترافیک شبکه را دریافت می‌کنند.

## تحمل خرابی گره

ZooKeeper برای اعمال موفقیت‌آمیز جهش‌ها به داده‌ها، به حد نصاب مشخصی از سرورها نیاز دارد. برای یک مجموعه سه سروره، دو سرور باید سالم باشند تا نوشتن‌ها با موفقیت انجام شوند. در سیستم‌های مبتنی بر حد نصاب، اعضا در دامنه‌های خرابی مستقر می‌شوند تا از در دسترس بودن اطمینان حاصل شود. برای جلوگیری از قطع برق، به دلیل از دست دادن یک دستگاه جداگانه، بهترین شیوه‌ها از قرار دادن چندین نمونه از برنامه در یک دستگاه جلوگیری می‌کنند.

به طور پیش‌فرض، کوبرنتیز ممکن است پادها را در یک `StatefulSet` در یک گره قرار دهد. برای سه مجموعه سروری که ایجاد کرده‌اید، اگر دو سرور در یک گره باشند و آن گره از کار بیفتد، کلاینت‌های سرویس ZooKeeper شما تا زمانی که حداقل یکی از پادها دوباره برنامه‌ریزی شود، دچار قطعی خواهند شد.

شما همیشه باید ظرفیت اضافی را فراهم کنید تا در صورت خرابی گره، امکان برنامه‌ریزی مجدد فرآیندهای سیستم‌های حیاتی فراهم شود. اگر این کار را انجام دهید، قطعی فقط تا زمانی ادامه خواهد داشت که زمان‌بند کوبرنتیز یکی از سرورهای ZooKeeper را مجدداً برنامه‌ریزی کند. با این حال، اگر می‌خواهید سرویس شما خرابی گره را بدون خرابی تحمل کند، باید `podAntiAffinity` را تنظیم کنید.

از دستور زیر برای دریافت گره‌های پادها در `zk` `StatefulSet` استفاده کنید.

```shell
for i in 0 1 2; do kubectl get pod zk-$i --template {{.spec.nodeName}}; echo ""; done
```

تمام پادهای موجود در `zk` `StatefulSet` روی گره‌های مختلف مستقر شده‌اند.

```
kubernetes-node-cxpk
kubernetes-node-a5aq
kubernetes-node-2g2d
```

دلیل این امر این است که پادهای موجود در `zk` `StatefulSet` دارای `PodAntiAffinity` مشخص شده هستند.
```yaml
affinity:
  podAntiAffinity:
    requiredDuringSchedulingIgnoredDuringExecution:
      - labelSelector:
          matchExpressions:
            - key: "app"
              operator: In
              values:
                - zk
        topologyKey: "kubernetes.io/hostname"
```

بخش «requiredDuringSchedulingIgnoredDuringExecution» به «Kubernetes Scheduler» می‌گوید که هرگز نباید دو پاد که برچسب «app» آنها «zk» است را در دامنه تعریف شده توسط «topologyKey» در کنار هم قرار دهد. «topologyKey» در kubernetes.io/hostname نشان می‌دهد که دامنه یک گره مجزا است. با استفاده از قوانین، برچسب‌ها و انتخابگرهای مختلف، می‌توانید این تکنیک را برای گسترش مجموعه خود در دامنه‌های فیزیکی، شبکه‌ای و قطع برق گسترش دهید.

## نگهداری و تعمیرات باقی مانده

در این بخش، شما گره‌ها را محصور و تخلیه خواهید کرد. اگر از این آموزش استفاده می کنید
در یک خوشه مشترک، مطمئن شوید که این امر بر سایر مستاجرین تأثیر منفی نخواهد گذاشت.

بخش قبلی به شما نشان داد که چگونه پادهای خود را در گره‌ها پخش کنید تا از خرابی‌های برنامه‌ریزی نشده گره‌ها در امان بمانید، اما شما همچنین باید برای خرابی‌های موقت گره‌ها که به دلیل تعمیر و نگهداری برنامه‌ریزی شده رخ می‌دهند، برنامه‌ریزی کنید.

از این دستور برای دریافت گره های خوشه خود استفاده کنید.

```shell
kubectl get nodes
```

این آموزش یک خوشه با حداقل چهار گره را فرض می کند. اگر خوشه بیش از چهار گره داشته باشد، از [`kubectl cordon`](/docs/reference/generated/kubectl/kubectl-commands/#cordon) برای محصور کردن همه گره‌ها به جز چهار گره استفاده کنید. محدود کردن به چهار گره تضمین می‌کند که کوبرنتیز هنگام برنامه‌ریزی پادهای zookeeper در شبیه‌سازی نگهداری زیر، با محدودیت‌های affinity و PodDisruptionBudget مواجه شود.

```shell
kubectl cordon <node-name>
```

از این دستور برای دریافت `zk-pdb` `PodDisruptionBudget` استفاده کنید.

```shell
kubectl get pdb zk-pdb
```

بخش «max-unavailable» به Kubernetes نشان می‌دهد که حداکثر یک پاد از آن است
«Zk» «StatefulSet» می‌تواند در هر زمان در دسترس نباشد.

```
NAME      MIN-AVAILABLE   MAX-UNAVAILABLE   ALLOWED-DISRUPTIONS   AGE
zk-pdb    N/A             1                 1
```

در یک خط فرمان، از این دستور برای مشاهده پادها در `zk` `StatefulSet` استفاده کنید.

```shell
kubectl get pods -w -l app=zk
```

در یک خط فرمان دیگر، از این دستور برای دریافت گره‌هایی که پادها در حال حاضر روی آنها برنامه‌ریزی شده‌اند، استفاده کنید.

```shell
for i in 0 1 2; do kubectl get pod zk-$i --template {{.spec.nodeName}}; echo ""; done
```

خروجی مشابه این است:

```
kubernetes-node-pb41
kubernetes-node-ixsl
kubernetes-node-i4c4
```

از [`kubectl drain`](/docs/reference/generated/kubectl/kubectl-commands/#drain) برای محصور کردن و تخلیه گره‌ای که `zk-0` پاد روی آن برنامه‌ریزی شده است، استفاده کنید.

```shell
kubectl drain $(kubectl get pod zk-0 --template {{.spec.nodeName}}) --ignore-daemonsets --force --delete-emptydir-data
```

خروجی مشابه این است:

```
node "kubernetes-node-pb41" cordoned

WARNING: Deleting pods not managed by ReplicationController, ReplicaSet, Job, or DaemonSet: fluentd-cloud-logging-kubernetes-node-pb41, kube-proxy-kubernetes-node-pb41; Ignoring DaemonSet-managed pods: node-problem-detector-v0.1-o5elz
pod "zk-0" deleted
node "kubernetes-node-pb41" drained
```

از آنجایی که چهار گره در خوشه شما وجود دارد، «kubectl drain» موفق می شود و
`zk-0` به گره دیگری برنامه ریزی می شود.

```
NAME      READY     STATUS    RESTARTS   AGE
zk-0      1/1       Running   2          1h
zk-1      1/1       Running   0          1h
zk-2      1/1       Running   0          1h
NAME      READY     STATUS        RESTARTS   AGE
zk-0      1/1       Terminating   2          2h
zk-0      0/1       Terminating   2         2h
zk-0      0/1       Terminating   2         2h
zk-0      0/1       Terminating   2         2h
zk-0      0/1       Pending   0         0s
zk-0      0/1       Pending   0         0s
zk-0      0/1       ContainerCreating   0         0s
zk-0      0/1       Running   0         51s
zk-0      1/1       Running   0         1m
```

در خط فرمان اول، پادهای «StatefulSet» را زیر نظر داشته باشید و گره‌ای را که «zk-1» روی آن برنامه‌ریزی شده است، تخلیه کنید.

```shell
kubectl drain $(kubectl get pod zk-1 --template {{.spec.nodeName}}) --ignore-daemonsets --force --delete-emptydir-data
```

خروجی مشابه این است:

```
"kubernetes-node-ixsl" cordoned
WARNING: Deleting pods not managed by ReplicationController, ReplicaSet, Job, or DaemonSet: fluentd-cloud-logging-kubernetes-node-ixsl, kube-proxy-kubernetes-node-ixsl; Ignoring DaemonSet-managed pods: node-problem-detector-v0.1-voc74
pod "zk-1" deleted
node "kubernetes-node-ixsl" drained
```


پادِ `zk-1` قابل برنامه‌ریزی نیست زیرا `zk` `StatefulSet` حاوی یک قانون `PodAntiAffinity` است که از هم‌مکانی پادها جلوگیری می‌کند و از آنجایی که فقط دو گره قابل برنامه‌ریزی هستند، پاد در حالت Pending باقی می‌ماند.

```shell
kubectl get pods -w -l app=zk
```

خروجی مشابه این است:

```
NAME      READY     STATUS    RESTARTS   AGE
zk-0      1/1       Running   2          1h
zk-1      1/1       Running   0          1h
zk-2      1/1       Running   0          1h
NAME      READY     STATUS        RESTARTS   AGE
zk-0      1/1       Terminating   2          2h
zk-0      0/1       Terminating   2         2h
zk-0      0/1       Terminating   2         2h
zk-0      0/1       Terminating   2         2h
zk-0      0/1       Pending   0         0s
zk-0      0/1       Pending   0         0s
zk-0      0/1       ContainerCreating   0         0s
zk-0      0/1       Running   0         51s
zk-0      1/1       Running   0         1m
zk-1      1/1       Terminating   0         2h
zk-1      0/1       Terminating   0         2h
zk-1      0/1       Terminating   0         2h
zk-1      0/1       Terminating   0         2h
zk-1      0/1       Pending   0         0s
zk-1      0/1       Pending   0         0s
```

همچنان به زیر نظر داشتن پادهای StatefulSet ادامه دهید و گره‌ای را که `zk-2` روی آن برنامه‌ریزی شده است، تخلیه کنید.

```shell
kubectl drain $(kubectl get pod zk-2 --template {{.spec.nodeName}}) --ignore-daemonsets --force --delete-emptydir-data
```

خروجی مشابه این است:

```
node "kubernetes-node-i4c4" cordoned

WARNING: Deleting pods not managed by ReplicationController, ReplicaSet, Job, or DaemonSet: fluentd-cloud-logging-kubernetes-node-i4c4, kube-proxy-kubernetes-node-i4c4; Ignoring DaemonSet-managed pods: node-problem-detector-v0.1-dyrog
WARNING: Ignoring DaemonSet-managed pods: node-problem-detector-v0.1-dyrog; Deleting pods not managed by ReplicationController, ReplicaSet, Job, or DaemonSet: fluentd-cloud-logging-kubernetes-node-i4c4, kube-proxy-kubernetes-node-i4c4
There are pending pods when an error occurred: Cannot evict pod as it would violate the pod's disruption budget.
pod/zk-2
```

برای خاتمه دادن به kubectl از `CTRL-C` استفاده کنید.

شما نمی‌توانید گره سوم را تخلیه کنید زیرا تخلیه «zk-2» «zk-budget» را نقض می‌کند. با این حال، گره همچنان محصور خواهد ماند.

از `zkCli.sh` برای بازیابی مقداری که در طول تست سلامت عقل وارد کرده‌اید از `zk-0` استفاده کنید.

```shell
kubectl exec zk-0 zkCli.sh get /hello
```

این سرویس هنوز در دسترس است زیرا `PodDisruptionBudget` آن رعایت شده است.

```
WatchedEvent state:SyncConnected type:None path:null
world
cZxid = 0x200000002
ctime = Wed Dec 07 00:08:59 UTC 2016
mZxid = 0x200000002
mtime = Wed Dec 07 00:08:59 UTC 2016
pZxid = 0x200000002
cversion = 0
dataVersion = 0
aclVersion = 0
ephemeralOwner = 0x0
dataLength = 5
numChildren = 0
```

از ['kubectl uncordon'](/docs/reference/generated/kubectl/kubectl-commands/#uncordon) برای باز کردن اولین گره استفاده کنید.

```shell
kubectl uncordon kubernetes-node-pb41
```

خروجی مشابه این است:

```
node "kubernetes-node-pb41" uncordoned
```

`zk-1` در این گره دوباره زمانبندی شده است. صبر کنید تا `zk-1` در حال اجرا و آماده باشد.

```shell
kubectl get pods -w -l app=zk
```

خروجی مشابه این است:

```
NAME      READY     STATUS    RESTARTS   AGE
zk-0      1/1       Running   2          1h
zk-1      1/1       Running   0          1h
zk-2      1/1       Running   0          1h
NAME      READY     STATUS        RESTARTS   AGE
zk-0      1/1       Terminating   2          2h
zk-0      0/1       Terminating   2         2h
zk-0      0/1       Terminating   2         2h
zk-0      0/1       Terminating   2         2h
zk-0      0/1       Pending   0         0s
zk-0      0/1       Pending   0         0s
zk-0      0/1       ContainerCreating   0         0s
zk-0      0/1       Running   0         51s
zk-0      1/1       Running   0         1m
zk-1      1/1       Terminating   0         2h
zk-1      0/1       Terminating   0         2h
zk-1      0/1       Terminating   0         2h
zk-1      0/1       Terminating   0         2h
zk-1      0/1       Pending   0         0s
zk-1      0/1       Pending   0         0s
zk-1      0/1       Pending   0         12m
zk-1      0/1       ContainerCreating   0         12m
zk-1      0/1       Running   0         13m
zk-1      1/1       Running   0         13m
```

تلاش برای تخلیه گره‌ای که `zk-2` روی آن برنامه‌ریزی شده است.

```shell
kubectl drain $(kubectl get pod zk-2 --template {{.spec.nodeName}}) --ignore-daemonsets --force --delete-emptydir-data
```

خروجی مشابه این است:

```
node "kubernetes-node-i4c4" already cordoned
WARNING: Deleting pods not managed by ReplicationController, ReplicaSet, Job, or DaemonSet: fluentd-cloud-logging-kubernetes-node-i4c4, kube-proxy-kubernetes-node-i4c4; Ignoring DaemonSet-managed pods: node-problem-detector-v0.1-dyrog
pod "heapster-v1.2.0-2604621511-wht1r" deleted
pod "zk-2" deleted
node "kubernetes-node-i4c4" drained
```

این بار 'kubectl drain' موفق شد.

گره دوم را از حالت قفل خارج کنید تا امکان زمانبندی مجدد «zk-2» فراهم شود.

```shell
kubectl uncordon kubernetes-node-ixsl
```

خروجی مشابه این است:

```
node "kubernetes-node-ixsl" uncordoned
```

شما می‌توانید از `kubectl drain` همراه با `PodDisruptionBudgets` استفاده کنید تا اطمینان حاصل شود که سرویس‌های شما در طول تعمیر و نگهداری در دسترس هستند. اگر از drain برای قرنطینه کردن گره‌ها و بیرون راندن پادها قبل از آفلاین کردن گره برای تعمیر و نگهداری استفاده شود، سرویس‌هایی که بودجه اختلال را بیان می‌کنند، آن بودجه را رعایت خواهند کرد. شما همیشه باید ظرفیت اضافی را برای سرویس‌های حیاتی اختصاص دهید تا پادهای آنها بتوانند بلافاصله دوباره برنامه‌ریزی شوند.

## {{% heading "Cleaning up" %}}

- از «kubectl uncordon» برای جدا کردن تمام گره‌های خوشه خود استفاده کنید.
- شما باید رسانه ذخیره‌سازی پایدار مربوط به حجم های پایدار مورد استفاده در این آموزش را حذف کنید. مراحل لازم را بر اساس محیط، پیکربندی ذخیره‌سازی و روش تأمین خود دنبال کنید تا مطمئن شوید که تمام فضای ذخیره‌سازی آزاد شده است.
