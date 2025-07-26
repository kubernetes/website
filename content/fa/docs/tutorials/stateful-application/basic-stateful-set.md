---
reviewers:
- moh0ps
title: مبانی StatefulSet
content_type: tutorial
weight: 10
---

<!-- overview -->
این آموزش مقدمه‌ای بر مدیریت برنامه‌ها با {{< glossary_tooltip text="StatefulSets" term_id="statefulset" >}} ارائه می‌دهد.
این آموزش نحوه ایجاد، حذف، مقیاس‌بندی و به‌روزرسانی پادهای StatefulSets را نشان می‌دهد.


## {{% heading "Prerequisites" %}}

قبل از شروع این آموزش، باید با مفاهیم کوبرنتیز زیر آشنا شوید:

* [پادها](/docs/concepts/workloads/pods/)
* [DNS خوشه](/docs/concepts/services-networking/dns-pod-service/)
* [سرویس‌های بدون سر](/docs/concepts/services-networking/service/#headless-services)
* [حجم‌های پایدار](/docs/concepts/storage/persistent-volumes/)
* [تأمین حجم‌های پایدار](https://github.com/kubernetes/examples/tree/master/staging/persistent-volume-provisioning/)
* ابزار خط فرمان [kubectl](/docs/reference/kubectl/kubectl/)

{{% include "task-tutorial-prereqs.md" %}}
شما باید `kubectl` را طوری پیکربندی کنید که از زمینه‌ای استفاده کند که از فضای نام ` پیش‌فرض ` استفاده می‌کند. اگر از خوشه موجود استفاده می‌کنید، مطمئن شوید که استفاده از فضای نام پیش‌فرض آن خوشه برای تمرین اشکالی ندارد. در حالت ایده‌آل، در خوشه ای تمرین کنید که هیچ بار کاری واقعی را اجرا نمی‌کند.

همچنین مطالعه‌ی صفحه‌ی مفاهیم مربوط به [StatefulSets](/docs/concepts/workloads/controllers/statefulset/) مفید است.

{{< note >}}
این آموزش فرض می‌کند که خوشه شما طوری پیکربندی شده است که به صورت پویا حجم‌های پایدار را فراهم کند. همچنین به یک [کلاس ذخیره‌سازی پیش‌فرض](/docs/concepts/storage/storage-classes/#default-storageclass) نیاز خواهید داشت. اگر خوشه شما طوری پیکربندی نشده باشد که به صورت پویا فضای ذخیره‌سازی را فراهم کند، باید قبل از شروع این آموزش، دو حجم به اندازه ۱ گیگابایت را به صورت دستی فراهم کنید و خوشه خود را طوری تنظیم کنید که آن حجم‌های پایدار به قالب‌های ادعای حجم پایدار که StatefulSet تعریف می‌کند، نگاشت شوند.
{{< /note >}}

## {{% heading "Objectives" %}}

StatefulSetها برای استفاده با برنامه‌های کاربردی دارای وضعیت و سیستم‌های توزیع‌شده در نظر گرفته شده‌اند. با این حال، مدیریت برنامه‌های کاربردی دارای وضعیت و سیستم‌های توزیع‌شده در کوبرنتیز یک موضوع گسترده و پیچیده است. برای نشان دادن ویژگی‌های اساسی یک StatefulSet، و عدم تداخل موضوع اول با دومی، شما یک برنامه وب ساده را با استفاده از StatefulSet مستقر خواهید کرد.

پس از این آموزش، با موارد زیر آشنا خواهید شد.

* نحوه ایجاد یک StatefulSet
* چگونه یک StatefulSet پادهای خود را مدیریت می‌کند
* نحوه حذف یک StatefulSet
* چگونه یک StatefulSet را مقیاس‌بندی کنیم
* نحوه به‌روزرسانی یک Pod از نوع StatefulSet

<!-- lessoncontent -->

## ایجاد یک StatefulSet

با استفاده از مثال زیر، یک StatefulSet (و سرویسی که به آن متکی است) ایجاد کنید. این مثال مشابه مثال ارائه شده در مفهوم [StatefulSets](/docs/concepts/workloads/controllers/statefulset/) است. این مثال یک [سرویس بدون سر](/docs/concepts/services-networking/service/#headless-services) با نام nginx ایجاد می‌کند تا آدرس‌های IP پادها را در StatefulSet منتشر کند.

{{% code_sample file="application/web/web.yaml" %}}

شما باید حداقل از دو پنجره خط فرمان استفاده کنید. در خط فرمان اول، از [`kubectl get`](/docs/reference/generated/kubectl/kubectl-commands/#get) برای ایجاد پادهای StatefulSet استفاده کنید.

```shell
# از این خط فرمان برای اجرای دستوراتی که مشخص کننده --watch هستند استفاده کنید
# وقتی از شما خواسته می‌شود که یک watch جدید را شروع کنید، این watch را پایان دهید
kubectl get pods --watch -l app=nginx
```

در خط فرمان دوم، از [`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands/#apply) برای ایجاد سرویس بدون سر و مجموعه حالت (StatefulSet) استفاده کنید:

```shell
kubectl apply -f https://k8s.io/examples/application/web/web.yaml
```
```
service/nginx created
statefulset.apps/web created
```

دستور بالا دو پاد ایجاد می‌کند که هر کدام یک وب‌سرور [NGINX](https://www.nginx.com) را اجرا می‌کنند. سرویس `nginx` را دریافت کنید...
```shell
kubectl get service nginx
```
```
NAME      TYPE         CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
nginx     ClusterIP    None         <none>        80/TCP    12s
```
...سپس StatefulSet مربوط به `web` را دریافت کنید تا تأیید کنید که هر دو با موفقیت ایجاد شده‌اند:
```shell
kubectl get statefulset web
```
```
NAME   READY   AGE
web    2/2     37s
```

### ساخت پاد سفارش داده شده

یک StatefulSet به طور پیش‌فرض پادهای خود را به ترتیب مشخصی ایجاد می‌کند.

برای یک StatefulSet با n روگرفت، وقتی  پادها مستقر می‌شوند، به صورت متوالی و از {0....n-1}ایجاد می‌شوند. خروجی دستور `kubectl get` را در خط فرمان اول بررسی کنید. در نهایت، خروجی مانند مثال زیر خواهد بود.

```shell
# watch جدیدی را شروع نکنید;
# این باید از قبل اجرا شده باشد
kubectl get pods --watch -l app=nginx
```
```
NAME      READY     STATUS    RESTARTS   AGE
web-0     0/1       Pending   0          0s
web-0     0/1       Pending   0         0s
web-0     0/1       ContainerCreating   0         0s
web-0     1/1       Running   0         19s
web-1     0/1       Pending   0         0s
web-1     0/1       Pending   0         0s
web-1     0/1       ContainerCreating   0         0s
web-1     1/1       Running   0         18s
```

توجه داشته باشید که پاد `web-1` تا زمانی که پاد `web-0` اجرا و آماده نشده باشد، راه‌اندازی نمی‌شود (به [مرحله پاد](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase) مراجعه کنید) (به `نوع` در [شرایط پاد](/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions) مراجعه کنید).

بعداً در این آموزش [راه‌اندازی موازی](#مدیریت-پاد-موازی) را تمرین خواهید کرد.

{{< note >}}
برای پیکربندی عدد صحیح ترتیبی اختصاص داده شده به هر پاد در یک StatefulSet، به [شروع ترتیبی](/docs/concepts/workloads/controllers/statefulset/#start-ordinal) مراجعه کنید.
{{< /note >}}

## پادها در یک StatefulSet

پادها در یک StatefulSet دارای یک شاخص ترتیبی منحصر به فرد و یک هویت شبکه پایدار هستند.

### بررسی شاخص ترتیبی پاد

پادهای StatefulSet را دریافت کنید:

```shell
kubectl get pods -l app=nginx
```
```
NAME      READY     STATUS    RESTARTS   AGE
web-0     1/1       Running   0          1m
web-1     1/1       Running   0          1m
```

همانطور که در مفهوم [StatefulSets](/docs/concepts/workloads/controllers/statefulset/) ذکر شد، پادها در StatefulSet یک هویت چسبنده و منحصر به فرد دارند. این هویت بر اساس یک شاخص ترتیبی منحصر به فرد است که توسط StatefulSet {{< glossary_tooltip term_id="controller" text="کنترل کننده">}} به هر پاد اختصاص داده می‌شود. نام پادها به شکل `<statefulset name>-< شاخص ترتیبی>` است. از آنجایی که StatefulSet `web` دو روگرفت  دارد، دو پاد ایجاد می‌کند، `web-0` و `web-1`.

### استفاده از هویت‌های شبکه پایدار

هر پاد بر اساس شاخص ترتیبی خود یک نام میزبان پایدار دارد. برای اجرای دستور ‎`hostname` در هر پاد، از ‎[`kubectl exec`](/docs/reference/generated/kubectl/kubectl-commands/#exec)‎ استفاده کنید:

```shell
for i in 0 1; do kubectl exec "web-$i" -- sh -c 'hostname'; done
```
```
web-0
web-1
```

از [`kubectl run`](/docs/reference/generated/kubectl/kubectl-commands/#run) برای اجرای کانتینری که دستور `nslookup` را از بسته `dnsutils` ارائه می‌دهد، استفاده کنید.

با استفاده از `nslookup` روی نام میزبان‌های Pods، می‌توانید آدرس‌های DNS درون خوشه‌ای آنها را بررسی کنید:

```shell
kubectl run -i --tty --image busybox:1.28 dns-test --restart=Never --rm
```
که یک پوسته جدید را شروع می‌کند. در آن پوسته جدید، دستور زیر را اجرا کنید:
```shell
# این را در پوسته کانتینر dns-test اجرا کنید
nslookup web-0.nginx
```
خروجی مشابه زیر است:
```
Server:    10.0.0.10
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      web-0.nginx
Address 1: 10.244.1.6

nslookup web-1.nginx
Server:    10.0.0.10
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      web-1.nginx
Address 1: 10.244.2.6
```

(و حالا از پوسته کانتینر خارج شوید: `exit`)

CNAME سرویس بدون سر به رکوردهای SRV اشاره می‌کند (یکی برای هر پاد که در حال اجرا و آماده است). رکوردهای SRV به ورودی‌های رکورد A اشاره می‌کنند که حاوی نشانی‌های IP پادها هستند.

در یک خط فرمان، Pod های StatefulSet را تماشا کنید:

```shell
# شروع یک watch جدید
# وقتی دیدید که حذف تمام شده است، این watch را پایان بده
kubectl get pod --watch -l app=nginx
```
در خط فرمان دوم، از ‎[`kubectl delete`](/docs/reference/generated/kubectl/kubectl-commands/#delete)‎ برای حذف تمام پادهای موجود در StatefulSet استفاده کنید:

```shell
kubectl delete pod -l app=nginx
```
```
pod "web-0" deleted
pod "web-1" deleted
```

صبر کنید تا StatefulSet آنها را مجدداً راه‌اندازی کند و هر دو پاد به حالت‌های درحال اجرا و آماده منتقل شوند:

```shell
# این باید از قبل اجرا شده باشد
kubectl get pod --watch -l app=nginx
```
```
NAME      READY     STATUS              RESTARTS   AGE
web-0     0/1       ContainerCreating   0          0s
NAME      READY     STATUS    RESTARTS   AGE
web-0     1/1       Running   0          2s
web-1     0/1       Pending   0         0s
web-1     0/1       Pending   0         0s
web-1     0/1       ContainerCreating   0         0s
web-1     1/1       Running   0         34s
```

برای مشاهده نام میزبان‌های پادها و ورودی‌های DNS درون‌خوشه‌ای از `kubectl exec` و `kubectl run` استفاده کنید. ابتدا، نام میزبان‌های پادها را مشاهده کنید:

```shell
for i in 0 1; do kubectl exec web-$i -- sh -c 'hostname'; done
```
```
web-0
web-1
```
سپس، اجرا کنید:
```shell
kubectl run -i --tty --image busybox:1.28 dns-test --restart=Never --rm
```
که یک پوسته جدید را شروع می‌کند. 
در آن پوسته جدید، دستور زیر را اجرا کنید:
```shell
# این را در پوسته کانتینر dns-test اجرا کنید
nslookup web-0.nginx
```
خروجی مشابه زیر است:
```
Server:    10.0.0.10
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      web-0.nginx
Address 1: 10.244.1.7

nslookup web-1.nginx
Server:    10.0.0.10
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      web-1.nginx
Address 1: 10.244.2.8
```

(و حالا از پوسته کانتینر خارج شوید: `exit`)

اعداد ترتیبی، نام میزبان‌ها، رکوردهای SRV و نام رکورد A مربوط به پادها تغییر نکرده‌اند، اما نشانی‌های IP مرتبط با پادها ممکن است تغییر کرده باشند. در خوشه ای که برای این آموزش استفاده شده است، این تغییر رخ داده است. به همین دلیل است که پیکربندی سایر برنامه‌ها برای اتصال به پادها در یک StatefulSet با نشانی IP یک پاد خاص مهم نیست (اتصال به پادها با تبدیل نام میزبان آنها اشکالی ندارد).

#### کشف برای پادهای خاص در یک StatefulSet

اگر نیاز به یافتن و اتصال به اعضای فعال یک StatefulSet دارید، باید CNAME سرویس بدون سر (`nginx.default.svc.cluster.local`) را جستجو کنید. رکوردهای SRV مرتبط با CNAME فقط شامل پادهایی در StatefulSet خواهند بود که در حال اجرا و آماده هستند.

اگر برنامه شما از قبل اتصال منطقی را پیاده‌سازی کرده است که زنده بودن و آمادگی را آزمایش می‌کند، می‌توانید از رکوردهای SRV مربوط به Podها (`web-0.nginx.default.svc.cluster.local`، `web-1.nginx.default.svc.cluster.local`) استفاده کنید، زیرا آنها پایدار هستند و برنامه شما قادر خواهد بود آدرس‌های Podها را هنگام انتقال به حالت‌های در حال اجرا و آماده، کشف کند.

اگر برنامه شما می‌خواهد هر پاد سالمی را در یک StatefulSet پیدا کند، و بنابراین نیازی به ردیابی هر پاد خاص ندارد، می‌توانید به نشانی IP یک سرویس `type: ClusterIP` که توسط پادها در آن StatefulSet پشتیبانی می‌شود، متصل شوید. می‌توانید از همان سرویسی که StatefulSet را ردیابی می‌کند (که در `serviceName` مربوط به StatefulSet مشخص شده است) یا یک سرویس جداگانه که مجموعه صحیح پادها را انتخاب می‌کند، استفاده کنید.

### نوشتن در حافظه پایدار

دریافت ادعاهای حجم پایدار برای `web-0` و `web-1`:

```shell
kubectl get pvc -l app=nginx
```
خروجی مشابه زیر است:
```
NAME        STATUS    VOLUME                                     CAPACITY   ACCESSMODES   AGE
www-web-0   Bound     pvc-15c268c7-b507-11e6-932f-42010a800002   1Gi        RWO           48s
www-web-1   Bound     pvc-15c79307-b507-11e6-932f-42010a800002   1Gi        RWO           48s
```

کنترل کننده StatefulSet دو مورد ایجاد کرد
{{< glossary_tooltip text="PersistentVolumeClaims" term_id="persistent-volume-claim" >}}
که به دو 
{{< glossary_tooltip text="حجم پایدار" term_id="persistent-volume" >}} وابسته‌اند.

از آنجایی که خوشه مورد استفاده در این آموزش طوری پیکربندی شده است که حجم های پایدار را به صورت پویا فراهم کند، حجم های پایدار به طور خودکار ایجاد و متصل شدند.

وب‌سرور NGINX، به طور پیش‌فرض، یک پرونده فهرست از
`/usr/share/nginx/html/index.html` را ارائه می‌دهد. فیلد `volumeMounts` در `spec` مربوط به
`StatefulSet` تضمین می‌کند که پوشه `/usr/share/nginx/html` توسط یک PersistentVolume پشتیبانی می‌شود.

نام‌های میزبان پادها را در پرونده های `index.html` آنها بنویسید و تأیید کنید که وب‌سرورهای NGINX نام‌های میزبان را ارائه می‌دهند:

```shell
for i in 0 1; do kubectl exec "web-$i" -- sh -c 'echo "$(hostname)" > /usr/share/nginx/html/index.html'; done

for i in 0 1; do kubectl exec -i -t "web-$i" -- curl http://localhost/; done
```
```
web-0
web-1
```

{{< note >}}
اگر به جای آن، پاسخ‌های **403 Forbidden** را برای دستور curl بالا مشاهده کردید، باید مجوزهای پوشه که توسط `volumeMounts` نصب شده است را اصلاح کنید (به دلیل [اشکال هنگام استفاده از host Path volumes](https://github.com/kubernetes/kubernetes/issues/2630))، با اجرای دستور زیر:

`for i in 0 1; do kubectl exec web-$i -- chmod 755 /usr/share/nginx/html; done`

قبل از اینکه دستور `curl` بالا را دوباره امتحان کنید.
{{< /note >}}

در یک خط فرمان، پاد های StatefulSet را تماشا کنید:
```shell
# وقتی به انتهای بخش رسیدی، این watch را تمام کن.
# در شروع «مقیاس‌بندی یک مجموعه با وضعیت» (Scaling a StatefulSet)، یک watch جدید را آغاز خواهید کرد.
kubectl get pod --watch -l app=nginx
```

در خط فرمان دوم، تمام پادهای StatefulSet را حذف کنید:
```shell
kubectl delete pod -l app=nginx
```
```
pod "web-0" deleted
pod "web-1" deleted
```
خروجی دستور `kubectl get` را در خط فرمان اول بررسی کنید و منتظر بمانید تا همه پادها به حالت‌های درحال اجرا و آماده منتقل شوند.
```shell
# این باید از قبل اجرا شده باشد
kubectl get pod --watch -l app=nginx
```
```
NAME      READY     STATUS              RESTARTS   AGE
web-0     0/1       ContainerCreating   0          0s
NAME      READY     STATUS    RESTARTS   AGE
web-0     1/1       Running   0          2s
web-1     0/1       Pending   0         0s
web-1     0/1       Pending   0         0s
web-1     0/1       ContainerCreating   0         0s
web-1     1/1       Running   0         34s
```

تأیید کنید که سرورهای وب همچنان نام‌های میزبان خود را ارائه می‌دهند:

```
for i in 0 1; do kubectl exec -i -t "web-$i" -- curl http://localhost/; done
```
```
web-0
web-1
```

اگرچه `web-0` و `web-1` دوباره زمان‌بندی شدند، اما همچنان به ارائه نام‌های میزبان خود ادامه می‌دهند زیرا PersistentVolumeهای مرتبط با PersistentVolumeClaims آنها به `volumeMounts` آنها دوباره متصل شده‌اند. مهم نیست `web-0` و `web-1` روی چه گره‌ای زمان‌بندی شده‌اند، PersistentVolumeهای آنها به نقاط  اتصال مناسب متص می‌شوند.

## مقیاس‌بندی یک StatefulSet

مقیاس‌بندی یک StatefulSet به افزایش یا کاهش تعداد روگرفت ها (مقیاس‌بندی افقی) اشاره دارد. این کار با به‌روزرسانی فیلد `replicas` انجام می‌شود. می‌توانید از [`kubectl scale`](/docs/reference/generated/kubectl/kubectl-commands/#scale) یا [`kubectl patch`](/docs/reference/generated/kubectl/kubectl-commands/#patch) برای مقیاس‌بندی یک StatefulSet استفاده کنید.

### افزایش مقیاس

افزایش مقیاس به معنای اضافه کردن روگرفت های بیشتر است.
به شرطی که برنامه شما بتواند کار را در سراسر StatefulSet توزیع کند، مجموعه بزرگتر جدید پادها می‌توانند بخش بیشتری از آن کار را انجام دهند.

در یک پنجره خط فرمان، پادها را در StatefulSet تماشا کنید:

```shell
# اگر از قبل watch دارید که کار می‌کند، می‌توانید به استفاده از آن ادامه دهید.
# در غیر این صورت، یکی را شروع کنید.
# وقتی 5 پاد سالم برای StatefulSet وجود داشت، این watch را پایان دهید.
kubectl get pods --watch -l app=nginx
```

در یک پنجره خط فرمان دیگر، از `kubectl scale` برای افزایش تعداد روگرفت ها به ۵ استفاده کنید:

```shell
kubectl scale sts web --replicas=5
```
```
statefulset.apps/web scaled
```

خروجی دستور `kubectl get` را در خط فرمان اول بررسی کنید و منتظر بمانید تا سه پاد اضافی به حالت‌های درحال اجرا و آماده منتقل شوند.

```shell
# این باید از قبل اجرا شده باشد
kubectl get pod --watch -l app=nginx
```
```
NAME      READY     STATUS    RESTARTS   AGE
web-0     1/1       Running   0          2h
web-1     1/1       Running   0          2h
NAME      READY     STATUS    RESTARTS   AGE
web-2     0/1       Pending   0          0s
web-2     0/1       Pending   0         0s
web-2     0/1       ContainerCreating   0         0s
web-2     1/1       Running   0         19s
web-3     0/1       Pending   0         0s
web-3     0/1       Pending   0         0s
web-3     0/1       ContainerCreating   0         0s
web-3     1/1       Running   0         18s
web-4     0/1       Pending   0         0s
web-4     0/1       Pending   0         0s
web-4     0/1       ContainerCreating   0         0s
web-4     1/1       Running   0         19s
```

کنترل کننده StatefulSet تعداد روگرفت‌ها را مقیاس‌بندی کرد. همانند
[ایجاد StatefulSet](#ordered-pod-creation)، کنترل کننده StatefulSet
هر Pod را به ترتیب با توجه به شاخص ترتیبی آن ایجاد می‌کرد و
منتظر می‌ماند تا پاد قبلی هر پاد در حال اجرا و آماده باشد تا پاد بعدی را راه‌اندازی کند.

### کاهش مقیاس

کاهش مقیاس به معنای کاهش تعداد روگرفتها است. برای مثال، ممکن است این کار را به این دلیل انجام دهید که سطح ترافیک یک سرویس کاهش یافته است و در مقیاس فعلی منابع بلااستفاده وجود دارد.

در یک خط فرمان، پاد های StatefulSet را تماشا کنید:

```shell
# این watch را زمانی که فقط ۳ پاد برای StatefulSet وجود دارد، پایان دهید.
kubectl get pod --watch -l app=nginx
```

در یک خط فرمان دیگر، از `kubectl patch` برای کاهش مقیاس StatefulSet به سه روگرفت استفاده کنید:

```shell
kubectl patch sts web -p '{"spec":{"replicas":3}}'
```
```
statefulset.apps/web patched
```

منتظر بمانید تا `web-4` و `web-3` به حالت خاتمه (Termminating) منتقل شوند.

```shell
# این باید از قبل اجرا شده باشد
kubectl get pods --watch -l app=nginx
```
```
NAME      READY     STATUS              RESTARTS   AGE
web-0     1/1       Running             0          3h
web-1     1/1       Running             0          3h
web-2     1/1       Running             0          55s
web-3     1/1       Running             0          36s
web-4     0/1       ContainerCreating   0          18s
NAME      READY     STATUS    RESTARTS   AGE
web-4     1/1       Running   0          19s
web-4     1/1       Terminating   0         24s
web-4     1/1       Terminating   0         24s
web-3     1/1       Terminating   0         42s
web-3     1/1       Terminating   0         42s
```

### خاتمه پاد سفارش داده شده

صفحه کنترل هر بار یک پاد را به ترتیب معکوس نسبت به شاخص ترتیبی خود حذف می کند و منتظر می ماند تا هر پاد به طور کامل خاموش شود قبل از حذف مورد بعدی.

PersistentVolumeClaims مربوط به StatefulSet را دریافت کنید:

```shell
kubectl get pvc -l app=nginx
```
```
NAME        STATUS    VOLUME                                     CAPACITY   ACCESSMODES   AGE
www-web-0   Bound     pvc-15c268c7-b507-11e6-932f-42010a800002   1Gi        RWO           13h
www-web-1   Bound     pvc-15c79307-b507-11e6-932f-42010a800002   1Gi        RWO           13h
www-web-2   Bound     pvc-e1125b27-b508-11e6-932f-42010a800002   1Gi        RWO           13h
www-web-3   Bound     pvc-e1176df6-b508-11e6-932f-42010a800002   1Gi        RWO           13h
www-web-4   Bound     pvc-e11bb5f8-b508-11e6-932f-42010a800002   1Gi        RWO           13h

```

هنوز پنج PersistentVolumeClaims و پنج PersistentVolume وجود دارد.

هنگام بررسی [stable storage](#writing-to-stable-storage) یک پاد، مشاهده کردید که PersistentVolumeهای متصل شده روی پادهای یک StatefulSet هنگام حذف Podهای StatefulSet حذف نمی‌شوند. این موضوع همچنان در مواردی که حذف پاد به دلیل کاهش مقیاس StatefulSet باشد، صادق است.

## به‌روزرسانی StatefulSetها

کنترل کننده StatefulSet از به‌روزرسانی‌های خودکار پشتیبانی می‌کند. استراتژی مورد استفاده توسط فیلد `spec.updateStrategy` از شیء API StatefulSet تعیین می‌شود. این ویژگی می‌تواند برای به‌روزرسانی تصاویر کانتینر، درخواست‌های منابع و/یا محدودیت‌ها، برچسب‌ها و حاشیه‌نویسی‌های پادها در یک StatefulSet استفاده شود.

دو استراتژی به‌روزرسانی معتبر وجود دارد، «RollingUpdate» (پیش‌فرض) و «OnDelete».

### RollingUpdate {#rolling-update}

استراتژی به‌روزرسانی `RollingUpdate` تمام پادها را در یک StatefulSet، به ترتیب ترتیبی معکوس، به‌روزرسانی می‌کند، ضمن اینکه ضمانت‌های StatefulSet را رعایت می‌کند.
شما می‌توانید به‌روزرسانی‌های یک StatefulSet که از استراتژی `RollingUpdate` استفاده می‌کند را با مشخص کردن `.spec.updateStrategy.rollingUpdate.partition` به پارتیشن‌ها تقسیم کنید.
این کار را بعداً در این آموزش تمرین خواهید کرد.

ابتدا، یک به‌روزرسانی ساده و rolling را امتحان کنید.

در یک پنجره خط فرمان، StatefulSet مربوط به `web` را وصله کنید تا پرونده image کانتینر دوباره تغییر کند:

```shell
kubectl patch statefulset web --type='json' -p='[{"op": "replace", "path": "/spec/template/spec/containers/0/image", "value":"registry.k8s.io/nginx-slim:0.24"}]'
```
```
statefulset.apps/web patched
```

در یک خط فرمان دیگر، پادها را در StatefulSet تماشا کنید:

```shell
# این watch را پس از اتمام انتشار پایان دهید
#
# اگر مطمئن نیستید، بگذارید یک دقیقه دیگر هم کار کند
kubectl get pod -l app=nginx --watch
```
خروجی مشابه زیر است:
```
NAME      READY     STATUS    RESTARTS   AGE
web-0     1/1       Running   0          7m
web-1     1/1       Running   0          7m
web-2     1/1       Running   0          8m
web-2     1/1       Terminating   0         8m
web-2     1/1       Terminating   0         8m
web-2     0/1       Terminating   0         8m
web-2     0/1       Terminating   0         8m
web-2     0/1       Terminating   0         8m
web-2     0/1       Terminating   0         8m
web-2     0/1       Pending   0         0s
web-2     0/1       Pending   0         0s
web-2     0/1       ContainerCreating   0         0s
web-2     1/1       Running   0         19s
web-1     1/1       Terminating   0         8m
web-1     0/1       Terminating   0         8m
web-1     0/1       Terminating   0         8m
web-1     0/1       Terminating   0         8m
web-1     0/1       Pending   0         0s
web-1     0/1       Pending   0         0s
web-1     0/1       ContainerCreating   0         0s
web-1     1/1       Running   0         6s
web-0     1/1       Terminating   0         7m
web-0     1/1       Terminating   0         7m
web-0     0/1       Terminating   0         7m
web-0     0/1       Terminating   0         7m
web-0     0/1       Terminating   0         7m
web-0     0/1       Terminating   0         7m
web-0     0/1       Pending   0         0s
web-0     0/1       Pending   0         0s
web-0     0/1       ContainerCreating   0         0s
web-0     1/1       Running   0         10s
```

پادها در StatefulSet به ترتیب ترتیبی معکوس به‌روزرسانی می‌شوند. کنترل کننده StatefulSet هر پاد را خاتمه می‌دهد و منتظر می‌ماند تا قبل از به‌روزرسانی پاد بعدی، به حالت در حال اجرا و آماده منتقل شود. توجه داشته باشید که اگرچه کنترل کننده StatefulSet تا زمانی که پاد بعدی در حالت در حال اجرا و آماده نباشد، پاد بعدی را به‌روزرسانی نمی‌کند، اما هر پاد که در طول به‌روزرسانی به نسخه موجود آن پاد از کار بی افتد را بازیابی می‌کند.

پادهایی که قبلاً به‌روزرسانی را دریافت کرده‌اند، به نسخه به‌روزرسانی‌شده بازیابی می‌شوند و پادهایی که هنوز به‌روزرسانی را دریافت نکرده‌اند، به نسخه قبلی بازیابی می‌شوند. به این ترتیب، کنترل‌کننده تلاش می‌کند تا در صورت وجود خرابی‌های متناوب، برنامه را سالم و به‌روزرسانی را به‌طور مداوم حفظ کند.

پرونده های image محفظه‌های پادها را مشاهده کنید:

```shell
for p in 0 1 2; do kubectl get pod "web-$p" --template '{{range $i, $c := .spec.containers}}{{$c.image}}{{end}}'; echo; done
```
```
registry.k8s.io/nginx-slim:0.24
registry.k8s.io/nginx-slim:0.24
registry.k8s.io/nginx-slim:0.24

```

اکنون تمام پادهای موجود در StatefulSet در حال اجرای پرونده های image کانتینر قبلی هستند.

{{< note >}}
همچنین می‌توانید از `kubectl rollout status sts/<name>` برای مشاهده وضعیت به‌روزرسانی‌های در حال انجام در یک StatefulSet استفاده کنید.
{{< /note >}}

#### مرحله‌بندی به‌روزرسانی

شما می‌توانید به‌روزرسانی‌های یک StatefulSet که از استراتژی `RollingUpdate` استفاده می‌کند را با مشخص کردن `.spec.updateStrategy.rollingUpdate.partition` به پارتیشن‌هایی تقسیم کنید.
برای اطلاعات بیشتر، می‌توانید [به‌روزرسانی‌های پیوسته پارتیشن‌بندی‌شده](/docs/concepts/workloads/controllers/statefulset/#partitions) را در صفحه مفهوم StatefulSet مطالعه کنید.

شما می‌توانید با استفاده از فیلد `partition` در پرونده `.spec.updateStrategy.rollingUpdate`، یک به‌روزرسانی برای StatefulSet انجام دهید.
برای این به‌روزرسانی، پادهای موجود در StatefulSet را بدون تغییر نگه می‌دارید، در حالی که الگوی پاد مربوط به StatefulSet را تغییر می‌دهید.
سپس شما - یا خارج از یک آموزش، با استفاده از یک اتوماسیون خارجی - می‌توانید آن به‌روزرسانی آماده‌شده را فعال کنید.

ابتدا، StatefulSet مربوط به `web` را وصله کنید تا یک جداکننده به بخش `updateStrategy` اضافه شود:

```shell
# مقدار «partition» تعیین می‌کند که تغییر روی کدام اعداد ترتیبی اعمال شود.
# حتماً از عددی بزرگتر از آخرین عدد ترتیبی استفاده کنید برای  
# StatefulSet
kubectl patch statefulset web -p '{"spec":{"updateStrategy":{"type":"RollingUpdate","rollingUpdate":{"partition":3}}}}'
```
```
statefulset.apps/web patched
```

برای تغییر پرونده image  کانتینری که این StatefulSet از آن استفاده می‌کند، دوباره StatefulSet را وصله کنید:

```shell
kubectl patch statefulset web --type='json' -p='[{"op": "replace", "path": "/spec/template/spec/containers/0/image", "value":"registry.k8s.io/nginx-slim:0.21"}]'
```
```
statefulset.apps/web patched
```

حذف یک پاد در StatefulSet:

```shell
kubectl delete pod web-2
```
```
pod "web-2" deleted
```

منتظر بمانید تا پاد جایگزین `web-2` اجرا و آماده شود:

```shell
# وقتی دیدید web-2 سالم است watch را تمام کنید
kubectl get pod -l app=nginx --watch
```
```
NAME      READY     STATUS              RESTARTS   AGE
web-0     1/1       Running             0          4m
web-1     1/1       Running             0          4m
web-2     0/1       ContainerCreating   0          11s
web-2     1/1       Running   0         18s
```

پرونده image کانتینر پاد را دریافت کنید:
```shell
kubectl get pod web-2 --template '{{range $i, $c := .spec.containers}}{{$c.image}}{{end}}'
```
```
registry.k8s.io/nginx-slim:0.24
```

توجه داشته باشید که اگرچه استراتژی به‌روزرسانی «RollingUpdate» است، StatefulSet، Pod را با پرونده image کانتینر اصلی بازیابی کرد. دلیل این امر این است که عدد ترتیبی پاد کمتر از «پارتیشن» مشخص شده توسط «updateStrategy» است.

#### Rolling out a canary

اکنون می‌خواهید [انتشار اولیه‌ی canary](https://glossary.cncf.io/canary-deployment/) از آن تغییر مرحله‌ای را امتحان کنید.

شما می‌توانید با کاهش دادن `پارتیشنی که [در بالا](#staging-an-update) مشخص کرده‌اید، یک نسخه آزمایشی (canary) را (برای آزمایش الگوی اصلاح‌شده) منتشر کنید.

StatefulSet را برای کاهش پارتیشن وصله کنید:

```shell
# مقدار "partition" باید با بالاترین عدد ترتیبی موجود برای آن مطابقت داشته باشد.
# the StatefulSet
kubectl patch statefulset web -p '{"spec":{"updateStrategy":{"type":"RollingUpdate","rollingUpdate":{"partition":2}}}}'
```
```
statefulset.apps/web patched
```

صفحه کنترل، جایگزینی برای `web-2` را آغاز می‌کند (که با یک **حذف** زیبا پیاده‌سازی شده و پس از اتمام حذف، یک پاد جدید ایجاد می‌شود).
منتظر بمانید تا پاد جدید «وب-۲» راه‌اندازی و آماده شود.
```shell
# این باید از قبل اجرا شده باشد
kubectl get pod -l app=nginx --watch
```
```
NAME      READY     STATUS              RESTARTS   AGE
web-0     1/1       Running             0          4m
web-1     1/1       Running             0          4m
web-2     0/1       ContainerCreating   0          11s
web-2     1/1       Running   0         18s
```

کانتینر پاد را تهیه کنید:
```shell
kubectl get pod web-2 --template '{{range $i, $c := .spec.containers}}{{$c.image}}{{end}}'
```
```
registry.k8s.io/nginx-slim:0.21

```

وقتی «پارتیشن» را تغییر دادید، کنترل کننده StatefulSet به طور خودکار پاد «web-2» را به‌روزرسانی کرد زیرا عدد ترتیبی پاد بزرگتر یا مساوی «پارتیشن» بود.

پادِ `web-1` را حذف کنید:

```shell
kubectl delete pod web-1
```
```
pod "web-1" deleted
```

صبر کنید تا پاد «وب-۱» راه‌اندازی و آماده شود.

```shell
# این باید از قبل اجرا شده باشد
kubectl get pod -l app=nginx --watch
```
خروجی مشابه زیر است:
```
NAME      READY     STATUS        RESTARTS   AGE
web-0     1/1       Running       0          6m
web-1     0/1       Terminating   0          6m
web-2     1/1       Running       0          2m
web-1     0/1       Terminating   0         6m
web-1     0/1       Terminating   0         6m
web-1     0/1       Terminating   0         6m
web-1     0/1       Pending   0         0s
web-1     0/1       Pending   0         0s
web-1     0/1       ContainerCreating   0         0s
web-1     1/1       Running   0         18s
```

پرونده image کانتینر «web-1» را دریافت کنید:
```shell
kubectl get pod web-1 --template '{{range $i, $c := .spec.containers}}{{$c.image}}{{end}}'
```
```
registry.k8s.io/nginx-slim:0.24
```

`web-1` به پیکربندی اصلی خود بازگردانده شد زیرا عدد ترتیبی پاد کمتر از پارتیشن بود. وقتی یک پارتیشن مشخص می‌شود، تمام پادهایی که عدد ترتیبی آنها بزرگتر یا مساوی پارتیشن است، با به‌روزرسانی `.spec.template` مربوط به StatefulSet به‌روزرسانی می‌شوند. اگر پادی که عدد ترتیبی کوچکتر از پارتیشن دارد حذف یا به هر نحوی خاتمه یابد، به پیکربندی اصلی خود بازگردانده می‌شود.

#### عرضه‌های مرحله‌ای

شما می‌توانید با استفاده از یک به‌روزرسانی غلتانِ بخش‌بندی‌شده، یک انتشار مرحله‌ای (مثلاً انتشار خطی، هندسی یا نمایی) را به روشی مشابه انتشار [canary](#rolling-out-a-canary) انجام دهید. برای انجام انتشار مرحله‌ای، `partition` را روی عدد ترتیبی که می‌خواهید کنترل کننده در آن به‌روزرسانی را متوقف کند، تنظیم کنید.

پارتیشن در حال حاضر روی `۲` تنظیم شده است. پارتیشن را روی `۰` تنظیم کنید:

```shell
kubectl patch statefulset web -p '{"spec":{"updateStrategy":{"type":"RollingUpdate","rollingUpdate":{"partition":0}}}}'
```
```
statefulset.apps/web patched
```

صبر کنید تا همه پاد های موجود در StatefulSet در حال اجرا و آماده شوند.

```shell
# این باید از قبل اجرا شده باشد
kubectl get pod -l app=nginx --watch
```
خروجی مشابه زیر است:
```
NAME      READY     STATUS              RESTARTS   AGE
web-0     1/1       Running             0          3m
web-1     0/1       ContainerCreating   0          11s
web-2     1/1       Running             0          2m
web-1     1/1       Running   0         18s
web-0     1/1       Terminating   0         3m
web-0     1/1       Terminating   0         3m
web-0     0/1       Terminating   0         3m
web-0     0/1       Terminating   0         3m
web-0     0/1       Terminating   0         3m
web-0     0/1       Terminating   0         3m
web-0     0/1       Pending   0         0s
web-0     0/1       Pending   0         0s
web-0     0/1       ContainerCreating   0         0s
web-0     1/1       Running   0         3s
```

جزئیات پرونده image کانتینر را برای پادها در StatefulSet دریافت کنید:
```shell
for p in 0 1 2; do kubectl get pod "web-$p" --template '{{range $i, $c := .spec.containers}}{{$c.image}}{{end}}'; echo; done
```
```
registry.k8s.io/nginx-slim:0.21
registry.k8s.io/nginx-slim:0.21
registry.k8s.io/nginx-slim:0.21
```

با انتقال «پارتیشن» به «0»، به StatefulSet اجازه دادید تا فرآیند به‌روزرسانی را ادامه دهد.

### OnDelete {#on-delete}

شما این استراتژی به‌روزرسانی را برای یک StatefulSet با تنظیم `.spec.template.updateStrategy.type` به `OnDelete` انتخاب می‌کنید.

برای استفاده از استراتژی به‌روزرسانی «OnDelete» «web» StatefulSet را وصله کنید:

```shell
kubectl patch statefulset web -p '{"spec":{"updateStrategy":{"type":"OnDelete", "rollingUpdate": null}}}'
```
```
statefulset.apps/web patched
```

وقتی این استراتژی به‌روزرسانی را انتخاب می‌کنید، کنترل کننده StatefulSet هنگام ایجاد تغییر در فیلد `.spec.template` مربوط به StatefulSet، به طور خودکار پادها را به‌روزرسانی نمی‌کند. شما باید خودتان این به‌روزرسانی را مدیریت کنید - یا به صورت دستی، یا با استفاده از اتوماسیون جداگانه.

## حذف StatefulSetها

StatefulSet از هر دو روش حذف _غیر آبشاری_ و _آبشاری_ پشتیبانی می‌کند. در یک **حذف** غیر آبشاری، پادهای StatefulSet هنگام حذف StatefulSet حذف نمی‌شوند. در یک **حذف** آبشاری، هم StatefulSet و هم پادهای آن حذف می‌شوند.

برای آشنایی کلی با حذف آبشاری، [استفاده از حذف آبشاری در یک خوشه](/docs/tasks/administer-cluster/use-cascading-deletion/) را مطالعه کنید.

### حذف غیر آبشاری

در یک پنجره خط فرمان، پادها را در StatefulSet تماشا کنید.

```
# وقتی هیچ پادی برای StatefulSet وجود ندارد، این watch را پایان دهید.
kubectl get pods --watch -l app=nginx
```

برای حذف StatefulSet از [`kubectl delete`](/docs/reference/generated/kubectl/kubectl-commands/#delete) استفاده کنید. حتماً پارامتر `--cascade=orphan` را به دستور ارائه دهید. این پارامتر به کوبرنتیز می‌گوید که فقط StatefulSet را حذف کند و هیچ یک از پاد های آن را **حذف** نکند.
```shell
kubectl delete statefulset web --cascade=orphan
```
```
statefulset.apps "web" deleted
```

پادها را برای بررسی وضعیت آنها دریافت کنید:
```shell
kubectl get pods -l app=nginx
```
```
NAME      READY     STATUS    RESTARTS   AGE
web-0     1/1       Running   0          6m
web-1     1/1       Running   0          7m
web-2     1/1       Running   0          5m
```

اگرچه `web` حذف شده است، اما همه پادها هنوز در حال اجرا و آماده هستند.
`web-0` را حذف کنید:
```shell
kubectl delete pod web-0
```
```
pod "web-0" deleted
```

پادهای StatefulSet را دریافت کنید:

```shell
kubectl get pods -l app=nginx
```
```
NAME      READY     STATUS    RESTARTS   AGE
web-1     1/1       Running   0          10m
web-2     1/1       Running   0          7m
```

از آنجایی که `web` StatefulSet حذف شده است، `web-0` دوباره راه‌اندازی نشده است.

در یک خط فرمان، پاد های StatefulSet را تماشا کنید.
```shell
# بگذارید این watch تا دفعه‌ی بعدی که watch را شروع می‌کنید، کار کند
kubectl get pods --watch -l app=nginx
```

در خط فرمان دوم، StatefulSet را دوباره ایجاد کنید. توجه داشته باشید که، مگر اینکه سرویس `nginx` را حذف کرده باشید (که نباید حذف کنید)، خطایی مبنی بر وجود سرویس مشاهده خواهید کرد.

```shell
kubectl apply -f https://k8s.io/examples/application/web/web.yaml
```
```
statefulset.apps/web created
service/nginx unchanged
```

خطا را نادیده بگیرید. این خطا فقط نشان می‌دهد که تلاشی برای ایجاد سرویس بدون سر nginx انجام شده است، حتی اگر آن سرویس از قبل وجود داشته باشد.

خروجی دستور `kubectl get` را که در خط فرمان اول اجرا می‌شود، بررسی کنید.

```shell
# این باید از قبل اجرا شده باشد
kubectl get pods --watch -l app=nginx
```
```
NAME      READY     STATUS    RESTARTS   AGE
web-1     1/1       Running   0          16m
web-2     1/1       Running   0          2m
NAME      READY     STATUS    RESTARTS   AGE
web-0     0/1       Pending   0          0s
web-0     0/1       Pending   0         0s
web-0     0/1       ContainerCreating   0         0s
web-0     1/1       Running   0         18s
web-2     1/1       Terminating   0         3m
web-2     0/1       Terminating   0         3m
web-2     0/1       Terminating   0         3m
web-2     0/1       Terminating   0         3m
```

وقتی StatefulSet مربوط به `web` دوباره ایجاد شد، ابتدا `web-0` را دوباره راه‌اندازی کرد. از آنجایی که `web-1` از قبل در حال اجرا و آماده بود، وقتی `web-0` به حالت در حال اجرا و آماده منتقل شد، این پاد را پذیرفت. از آنجایی که شما StatefulSet را با `replicas` برابر با ۲ دوباره ایجاد کردید، پس از اینکه `web-0` دوباره ایجاد شد و هنگامی که `web-1` از قبل در حال اجرا و آماده تشخیص داده شد، `web-2` خاتمه یافت.

حالا نگاهی دوباره به محتویات پرونده `index.html` که توسط وب سرورهای پادها ارائه می‌شود، بیندازید:

```shell
for i in 0 1; do kubectl exec -i -t "web-$i" -- curl http://localhost/; done
```

```
web-0
web-1
```

حتی اگر StatefulSet و پاد `web-0` را حذف کرده باشید، هنوز نام میزبان اولیه وارد شده در پرونده `index.html` خود را ارائه می‌دهد. دلیل این امر این است که StatefulSet هرگز PersistentVolume های مرتبط با یک پاد را حذف نمی‌کند. وقتی StatefulSet را دوباره ایجاد کردید و `web-0` دوباره راه‌اندازی شد، PersistentVolume اصلی آن دوباره مونت شد.

### حذف آبشاری

در یک پنجره خط فرمان، پادها را در StatefulSet تماشا کنید.

```shell
# این را تا بخش بعدی صفحه ادامه دهید
kubectl get pods --watch -l app=nginx
```

در یک خط فرمان دیگر، StatefulSet را دوباره حذف کنید. این بار، پارامتر `--cascade=orphan` را حذف کنید.
```shell
kubectl delete statefulset web
```

```
statefulset.apps "web" deleted
```

خروجی دستور `kubectl get` را که در خط فرمان اول اجرا می‌شود، بررسی کنید و منتظر بمانید تا همه پادها به حالت Terminating منتقل شوند.

```shell
# این باید از قبل اجرا شده باشد
kubectl get pods --watch -l app=nginx
```

```
NAME      READY     STATUS    RESTARTS   AGE
web-0     1/1       Running   0          11m
web-1     1/1       Running   0          27m
NAME      READY     STATUS        RESTARTS   AGE
web-0     1/1       Terminating   0          12m
web-1     1/1       Terminating   0         29m
web-0     0/1       Terminating   0         12m
web-0     0/1       Terminating   0         12m
web-0     0/1       Terminating   0         12m
web-1     0/1       Terminating   0         29m
web-1     0/1       Terminating   0         29m
web-1     0/1       Terminating   0         29m

```

همانطور که در بخش [کاهش مقیاس](#کاهش مقیاس) دیدید، پادها یکی یکی و با توجه به ترتیب معکوس شاخص‌های ترتیبی‌شان خاتمه می‌یابند. قبل از خاتمه یک پاد، کنترل کننده StatefulSet منتظر می‌ماند تا جانشین پاد به طور کامل خاتمه یابد.

{{< note >}}
اگرچه حذف آبشاری، یک StatefulSet را به همراه پادهای آن حذف می‌کند، اما آبشار، سرویس بدون سر (headless) مرتبط با StatefulSet را **حذف** نمی‌کند. شما باید سرویس `nginx` را به صورت دستی حذف کنید.
{{< /note >}}

```shell
kubectl delete service nginx
```

```
service "nginx" deleted
```

یک بار دیگر StatefulSet و سرویس بدون سر را از نو بسازید:
```shell
kubectl apply -f https://k8s.io/examples/application/web/web.yaml
```

```
service/nginx created
statefulset.apps/web created
```

وقتی همه پاد های StatefulSet به حالت درحال اجرا و آماده منتقل شدند، محتویات پرونده های `index.html` آنها را بازیابی کنید:
```shell
for i in 0 1; do kubectl exec -i -t "web-$i" -- curl http://localhost/; done
```

```
web-0
web-1
```

حتی اگر StatefulSet و تمام پاد های آن را به طور کامل حذف کرده باشید، پاد ها باحجم های پایدار خود که متصل شده اند، دوباره ایجاد می شوند و `web-0` و `web-1` همچنان به ارائه نام های میزبان خود ادامه می دهند.

در نهایت، سرویس `nginx` را حذف کنید...
```shell
kubectl delete service nginx
```

```
service "nginx" deleted
```

... و StatefulSet مربوط به `web`:

```shell
kubectl delete statefulset web
```

```
statefulset "web" deleted
```

## سیاست مدیریت پاد

برای برخی از سیستم‌های توزیع‌شده، تضمین‌های ترتیب StatefulSet غیرضروری و/یا نامطلوب هستند. این سیستم‌ها فقط به منحصر به فرد بودن و هویت نیاز دارند.

شما می‌توانید برای جلوگیری از این ترتیب‌بندی سختگیرانه، یک [سیاست مدیریت پاد](/docs/concepts/workloads/controllers/statefulset/#pod-management-policies) مشخص کنید؛ یا «OrderedReady» (پیش‌فرض)، یا «موازی».

### مدیریت پاد OrderedReady

مدیریت پاد `OrderedReady` پیش‌فرض برای StatefulSets است. این به کنترل کننده StatefulSet می‌گوید که تضمین‌های مرتب‌سازی نشان داده شده در بالا را رعایت کند.
از این مورد زمانی استفاده کنید که برنامه شما نیاز دارد یا انتظار دارد تغییراتی، مانند انتشار نسخه جدید برنامه شما، به ترتیب دقیق ترتیبی (شماره پاد) که StatefulSet ارائه می‌دهد، اتفاق بیفتد.
به عبارت دیگر، اگر پادهای `app-0`، `app-1` و `app-2` دارید، کوبرنتیز ابتدا `app-0` را به‌روزرسانی کرده و آن را بررسی می‌کند.
پس از بررسی‌های لازم، کوبرنتیز `app-1` و در نهایت `app-2` را به‌روزرسانی می‌کند.

اگر دو پاد دیگر اضافه کنید، کوبرنتیز `app-3` را راه‌اندازی می‌کند و قبل از استقرار `app-4` منتظر می‌ماند تا سالم شود.

از آنجا که این تنظیم پیش‌فرض است، شما قبلاً استفاده از آن را تمرین کرده‌اید.

### مدیریت موازی پاد

روش جایگزین، مدیریت پاد «موازی»، به کنترل کننده StatefulSet می‌گوید که تمام پادها را به صورت موازی راه‌اندازی یا خاتمه دهد، و منتظر نماند تا پادها «در حال اجرا» و «آماده» شوند یا قبل از راه‌اندازی یا خاتمه دادن به پاد دیگر، کاملاً خاتمه یابند.

گزینه مدیریت پاد «موازی» فقط بر رفتار عملیات مقیاس‌بندی تأثیر می‌گذارد. به‌روزرسانی‌ها تحت تأثیر قرار نمی‌گیرند؛ کوبرنتیز همچنان تغییرات را به ترتیب اعمال می‌کند. برای این آموزش، برنامه بسیار ساده است: یک وب‌سرور که نام میزبان خود را به شما می‌گوید (از آنجا که این یک StatefulSet است، نام میزبان برای هر پاد متفاوت و قابل پیش‌بینی است).

{{% code_sample file="application/web/web-parallel.yaml" %}}

این تنظیمات مشابه تنظیماتی است که در بالا دانلود کردید، با این تفاوت که `.spec.podManagementPolicy` از StatefulSet مربوط به `web` روی `Parallel` تنظیم شده است.
در یک خط فرمان، پادها را در StatefulSet تماشا کنید.
```shell
# بگذارید این watch تا پایان بخش کار کند
kubectl get pod -l app=nginx --watch
```

در یک خط فرمان دیگر، StatefulSet را برای مدیریت پاد «موازی» دوباره پیکربندی کنید:

```shell
kubectl apply -f https://k8s.io/examples/application/web/web-parallel.yaml
```
```
service/nginx updated
statefulset.apps/web updated
```

خط فرمان را در جایی که watch را اجرا می‌کنید، باز نگه دارید. در یک پنجره خط فرمان دیگر، StatefulSet را مقیاس‌بندی کنید:
```shell
kubectl scale statefulset/web --replicas=5
```
```
statefulset.apps/web scaled
```

خروجی خط فرمانی که دستور `kubectl get` در آن اجرا می‌شود را بررسی کنید. ممکن است چیزی شبیه به این باشد:

```
web-3     0/1       Pending   0         0s
web-3     0/1       Pending   0         0s
web-3     0/1       Pending   0         7s
web-3     0/1       ContainerCreating   0         7s
web-2     0/1       Pending   0         0s
web-4     0/1       Pending   0         0s
web-2     1/1       Running   0         8s
web-4     0/1       ContainerCreating   0         4s
web-3     1/1       Running   0         26s
web-4     1/1       Running   0         2s
```


StatefulSet سه پاد جدید راه‌اندازی کرد و منتظر نماند تا اولین پاد به حالت آماده‌باش (Running and Ready) درآید و سپس پادهای دوم و سوم را راه‌اندازی کند.

این رویکرد در صورتی مفید است که حجم کاری شما دارای یک عنصر stateful باشد، یا نیاز داشته باشید که پادها بتوانند یکدیگر را با نامگذاری قابل پیش‌بینی شناسایی کنند، و به خصوص اگر گاهی اوقات نیاز به ارائه سریع ظرفیت بسیار بیشتری داشته باشید. اگر این سرویس وب ساده برای آموزش ناگهان ۱،۰۰۰،۰۰۰ درخواست اضافی در دقیقه دریافت کند، شما می‌خواهید پادهای بیشتری اجرا کنید - اما همچنین نمی‌خواهید منتظر راه‌اندازی هر پاد جدید باشید. شروع موازی پادهای اضافی، زمان بین درخواست ظرفیت اضافی و در دسترس قرار گرفتن آن برای استفاده را کاهش می‌دهد.

## {{% heading "پاکسازی" %}}

شما باید دو خط فرمان باز داشته باشید که آماده اجرای دستورات `kubectl` به عنوان بخشی از پاکسازی باشند.

```shell
kubectl delete sts web
# sts مخفف statefulset است.
```

می‌توانید دستور `kubectl get` را تماشا کنید تا حذف شدن آن پادها را ببینید.
```shell
# وقتی آنچه را که باید، دیدید، watch را پایان بدهید
kubectl get pod -l app=nginx --watch
```
```
web-3     1/1       Terminating   0         9m
web-2     1/1       Terminating   0         9m
web-3     1/1       Terminating   0         9m
web-2     1/1       Terminating   0         9m
web-1     1/1       Terminating   0         44m
web-0     1/1       Terminating   0         44m
web-0     0/1       Terminating   0         44m
web-3     0/1       Terminating   0         9m
web-2     0/1       Terminating   0         9m
web-1     0/1       Terminating   0         44m
web-0     0/1       Terminating   0         44m
web-2     0/1       Terminating   0         9m
web-2     0/1       Terminating   0         9m
web-2     0/1       Terminating   0         9m
web-1     0/1       Terminating   0         44m
web-1     0/1       Terminating   0         44m
web-1     0/1       Terminating   0         44m
web-0     0/1       Terminating   0         44m
web-0     0/1       Terminating   0         44m
web-0     0/1       Terminating   0         44m
web-3     0/1       Terminating   0         9m
web-3     0/1       Terminating   0         9m
web-3     0/1       Terminating   0         9m
```

در حین حذف، یک StatefulSet تمام پادها را هم زمان حذف می‌کند؛ منتظر نمی‌ماند تا جانشین ترتیبی یک پاد قبل از حذف آن پاد خاتمه یابد.

خط فرمانی که دستور `kubectl get` در آن اجرا می‌شود را ببندید و سرویس `nginx` را حذف کنید:

```shell
kubectl delete svc nginx
```

رسانه ذخیره‌سازی پایدار مربوط به PersistentVolumeهای استفاده‌شده در این آموزش را حذف کنید.
```shell
kubectl get pvc
```
```
NAME        STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE
www-web-0   Bound    pvc-2bf00408-d366-4a12-bad0-1869c65d0bee   1Gi        RWO            standard       25m
www-web-1   Bound    pvc-ba3bfe9c-413e-4b95-a2c0-3ea8a54dbab4   1Gi        RWO            standard       24m
www-web-2   Bound    pvc-cba6cfa6-3a47-486b-a138-db5930207eaf   1Gi        RWO            standard       15m
www-web-3   Bound    pvc-0c04d7f0-787a-4977-8da3-d9d3a6d8d752   1Gi        RWO            standard       15m
www-web-4   Bound    pvc-b2c73489-e70b-4a4e-9ec1-9eab439aa43e   1Gi        RWO            standard       14m
```

```shell
kubectl get pv
```
```
NAME                                       CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM               STORAGECLASS   REASON   AGE
pvc-0c04d7f0-787a-4977-8da3-d9d3a6d8d752   1Gi        RWO            Delete           Bound    default/www-web-3   standard                15m
pvc-2bf00408-d366-4a12-bad0-1869c65d0bee   1Gi        RWO            Delete           Bound    default/www-web-0   standard                25m
pvc-b2c73489-e70b-4a4e-9ec1-9eab439aa43e   1Gi        RWO            Delete           Bound    default/www-web-4   standard                14m
pvc-ba3bfe9c-413e-4b95-a2c0-3ea8a54dbab4   1Gi        RWO            Delete           Bound    default/www-web-1   standard                24m
pvc-cba6cfa6-3a47-486b-a138-db5930207eaf   1Gi        RWO            Delete           Bound    default/www-web-2   standard                15m
```

```shell
kubectl delete pvc www-web-0 www-web-1 www-web-2 www-web-3 www-web-4
```

```
persistentvolumeclaim "www-web-0" deleted
persistentvolumeclaim "www-web-1" deleted
persistentvolumeclaim "www-web-2" deleted
persistentvolumeclaim "www-web-3" deleted
persistentvolumeclaim "www-web-4" deleted
```

```shell
kubectl get pvc
```

```
No resources found in default namespace.
```
{{< note >}}
همچنین باید رسانه ذخیره‌سازی پایدار مربوط به PersistentVolumes مورد استفاده در این آموزش را حذف کنید. مراحل لازم را بر اساس محیط، پیکربندی ذخیره‌سازی و روش تأمین خود دنبال کنید تا مطمئن شوید که تمام فضای ذخیره‌سازی آزاد شده است.
{{< /note >}}
