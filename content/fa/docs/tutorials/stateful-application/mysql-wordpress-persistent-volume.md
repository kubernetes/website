---
title: "مثال: استقرار وردپرس و MySQL با حجم های پایدار"
reviewers:
- moh0ps
content_type: tutorial
weight: 20
card: 
  name: tutorials
  weight: 40
  title: "Stateful Example: Wordpress with Persistent Volumes"
---

<!-- overview -->
این آموزش به شما نشان می‌دهد که چگونه یک سایت وردپرس و یک پایگاه داده MySQL را با استفاده از Minikube مستقر کنید. هر دو برنامه از حجم های پایدار و ادعای حجم های پایدار برای ذخیره داده‌ها استفاده می‌کنند.

یک [حجم پایدار](/docs/concepts/storage/persistent-volumes/) (PV) یک قطعه ذخیره‌سازی در خوشه است که به صورت دستی توسط مدیر سیستم یا به صورت پویا توسط کوبرنتیز با استفاده از [کلاس ذخیره ساز](/docs/concepts/storage/storage-classes) فراهم شده است. یک [ادعای حجم پایدار](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims) (PVC) یک درخواست ذخیره‌سازی توسط یک کاربر است که می‌تواند توسط یک PV انجام شود. حجم پایدار و ادعای حجم پایدار مستقل از چرخه عمر پاد هستند و داده‌ها را از طریق راه‌اندازی مجدد، زمان‌بندی مجدد و حتی حذف پادها حفظ می‌کنند.

{{< caution >}}
این استقرار برای موارد استفاده در محیط عملیاتی مناسب نیست، زیرا از پادهای تک نمونه‌ای وردپرس و MySQL استفاده می‌کند. برای استقرار وردپرس در محیط عملیاتی، استفاده از [WordPress Helm Chart](https://github.com/bitnami/charts/tree/master/bitnami/wordpress) را در نظر بگیرید.
{{< /caution >}}

{{< note >}}
پرونده‌های ارائه شده در این آموزش از APIهای استقرار GA استفاده می‌کنند و مخصوص کوبرنتیز نسخه ۱.۹ و بالاتر هستند. اگر مایل به استفاده از این آموزش با نسخه‌های قبلی کوبرنتیز هستید، لطفاً نسخه API را به طور مناسب به‌روزرسانی کنید یا به نسخه‌های قبلی این آموزش مراجعه کنید.
{{< /note >}}

## {{% heading "Objectives" %}}

* ایجاد ادعای حجم پایدار و حجم پایدار
* ایجاد یک «customization.yaml» با
  * یک مولد مخفی
  * پیکربندی منابع MySQL
  * پیکربندی منابع وردپرس
* با استفاده از دستور `kubectl apply -k ./` پوشه سفارشی‌سازی را اعمال کنید.
* پاکسازی

## {{% heading "Prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

مثالی که در این صفحه نشان داده شده است با `kubectl` 1.27 و بالاتر کار می‌کند.

پرونده‌های پیکربندی زیر را دانلود کنید:

1. [mysql-deployment.yaml](/examples/application/wordpress/mysql-deployment.yaml)

1. [wordpress-deployment.yaml](/examples/application/wordpress/wordpress-deployment.yaml)

<!-- lessoncontent -->

## ایجاد ادعای حجم پایدار و حجم پایدار

MySQL و WordPress هر دو برای ذخیره داده‌ها به یک حجم پایدار نیاز دارند. ادعای حجم پایدار آنها در مرحله استقرار ایجاد می‌شود.

بسیاری از محیط‌های خوشه‌ای یک کلاس ذخیره ساز پیش‌فرض نصب کرده‌اند. وقتی یک کلاس ذخیره ساز درادعای حجم پایدار مشخص نشده باشد،
به جای آن از کلاس ذخیره ساز پیش‌فرض خوشه استفاده می‌شود.

وقتی یک ادعای حجم پایدار ایجاد می‌شود، حجم پایدار به صورت پویا بر اساس پیکربندی کلاس ذخیره ساز ارائه می‌شود.

{{< caution >}}
در خوشه‌های محلی، کلاس ذخیره ساز پیش‌فرض از ارائه‌دهنده‌ی `hostPath` استفاده می‌کند. `hostPath` حجم ها فقط برای توسعه و آزمایش مناسب هستند. با `hostPath` حجم ها، داده‌های شما در `/tmp` روی گره‌ای که پاد روی آن زمان‌بندی شده است، قرار دارند و بین گره‌ها جابجا نمی‌شوند. اگر یک پاد از کار بیفتد و به گره دیگری در خوشه زمان‌بندی شود، یا گره مجدداً راه‌اندازی شود، داده‌ها از بین می‌روند.
{{< /caution >}}

{{< note >}}
اگر خوشه‌ای را ایجاد می‌کنید که باید از ارائه‌دهنده «hostPath» استفاده کند،
پرچم «--enable-hostpath-provisioner» باید در مؤلفه «کنترل-مدیریت» تنظیم شود.
{{< /note >}}

{{< note >}}
اگر یک خوشه کوبرنتیز دارید که در Google Kubernetes Engine اجرا می شود، لطفاً
[این راهنما] (https://cloud.google.com/kubernetes-engine/docs/tutorials/persistent-disk) را دنبال کنید.
{{< /note >}}

## ایجاد یک kustomization.yaml

### یک مولد مخفی اضافه کنید

یک [Secret](/docs/concepts/configuration/secret/) شیء‌ای است که بخشی از داده‌های حساس مانند رمز عبور یا کلید را ذخیره می‌کند. از نسخه ۱.۱۴، `kubectl` از مدیریت اشیاء کوبرنتیز با استفاده از یک پرونده kustomization پشتیبانی می‌کند. می‌توانید یک Secret را توسط مولدها در `kustomization.yaml` ایجاد کنید.

یک مولد رمز عبور (Secret generator) در `kustomization.yaml` از دستور زیر اضافه کنید. باید `YOUR_PASSWORD` را با رمز عبوری که می‌خواهید استفاده کنید جایگزین کنید.

```shell
cat <<EOF >./kustomization.yaml
secretGenerator:
- name: mysql-pass
  literals:
  - password=YOUR_PASSWORD
EOF
```

## پیکربندی منابع را برای MySQL و WordPress اضافه کنید

تنظیمات زیر یک نمونه‌ی واحد از استقرار MySQL را شرح می‌دهد. کانتینر MySQL، حجم پایدار را در /var/lib/mysql نصب می‌کند. متغیر محیطی `MYSQL_ROOT_PASSWORD` رمز عبور پایگاه داده را از Secret تنظیم می‌کند.

{{% code_sample file="application/wordpress/mysql-deployment.yaml" %}}

تنظیمات زیر یک استقرار وردپرس تک نمونه‌ای را شرح می‌دهد. کانتینر وردپرس، حجم پایدار را در `/var/www/html` برای پرونده‌های داده وب‌سایت نصب می‌کند. متغیر محیطی `WORDPRESS_DB_HOST` نام سرویس MySQL تعریف شده در بالا را تنظیم می‌کند و وردپرس از طریق سرویس به پایگاه داده دسترسی خواهد داشت. متغیر محیطی `WORDPRESS_DB_PASSWORD` رمز عبور پایگاه داده را از Secret kustomize تولید شده تنظیم می‌کند.

{{% code_sample file="application/wordpress/wordpress-deployment.yaml" %}}

1. پرونده پیکربندی استقرار MySQL را دانلود کنید.

   ```shell
   curl -LO https://k8s.io/examples/application/wordpress/mysql-deployment.yaml
   ```

2. پرونده پیکربندی وردپرس را دانلود کنید.

   ```shell
   curl -LO https://k8s.io/examples/application/wordpress/wordpress-deployment.yaml
   ```

3. آنها را به پرونده `kustomization.yaml` اضافه کنید.

   ```shell
   cat <<EOF >>./kustomization.yaml
   resources:
     - mysql-deployment.yaml
     - wordpress-deployment.yaml
   EOF
   ```

## اعمال و تأیید

پرونده `kustomization.yaml` شامل تمام منابع لازم برای استقرار یک سایت وردپرس و یک پایگاه داده MySQL است. می‌توانید این پوشه را به صورت زیر اعمال کنید:

```shell
kubectl apply -k ./
```

حالا می‌توانید تأیید کنید که همه اشیاء وجود دارند.

1. با اجرای دستور زیر اطمینان حاصل کنید که Secret وجود دارد:

   ```shell
   kubectl get secrets
   ```

   پاسخ باید به این شکل باشد:

   ```
   NAME                    TYPE                                  DATA   AGE
   mysql-pass-c57bb4t7mf   Opaque                                1      9s
   ```

2. تأیید کنید که یک حجم پایدار به صورت پویا فراهم شده است.

   ```shell
   kubectl get pvc
   ```

   {{< note >}}
   ممکن است چند دقیقه طول بکشد تا حجم های پایدار آماده و متصل شوند.
   {{< /note >}}

   پاسخ باید به این شکل باشد:

   ```
   NAME             STATUS    VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS       AGE
   mysql-pv-claim   Bound     pvc-8cbd7b2e-4044-11e9-b2bb-42010a800002   20Gi       RWO            standard           77s
   wp-pv-claim      Bound     pvc-8cd0df54-4044-11e9-b2bb-42010a800002   20Gi       RWO            standard           77s
   ```

3. با اجرای دستور زیر، از فعال بودن پاد اطمینان حاصل کنید:

   ```shell
   kubectl get pods
   ```

   {{< note >}}
   ممکن است چند دقیقه طول بکشد تا وضعیت پاد به «در حال اجرا» (RUNNING) برسد.
   {{< /note >}}

   پاسخ باید به این شکل باشد:

   ```
   NAME                               READY     STATUS    RESTARTS   AGE
   wordpress-mysql-1894417608-x5dzt   1/1       Running   0          40s
   ```

4. با اجرای دستور زیر، از فعال بودن سرویس اطمینان حاصل کنید:

   ```shell
   kubectl get services wordpress
   ```

   پاسخ باید به این شکل باشد:

   ```
   NAME        TYPE            CLUSTER-IP   EXTERNAL-IP   PORT(S)        AGE
   wordpress   LoadBalancer    10.0.0.89    <pending>     80:32406/TCP   4m
   ```

   {{< note >}}
   Minikube فقط می‌تواند سرویس‌ها را از طریق «NodePort» در معرض نمایش قرار دهد. EXTERNAL-IP همیشه در حالت انتظار است.
   {{< /note >}}

5. برای دریافت نشانی IP سرویس وردپرس، دستور زیر را اجرا کنید:

   ```shell
   minikube service wordpress --url
   ```

   پاسخ باید به این شکل باشد:

   ```
   http://1.2.3.4:32406
   ```

6. نشانی IP را کپی کنید و صفحه را در مرورگر خود بارگذاری کنید تا سایت خود را مشاهده کنید.

   شما باید صفحه تنظیمات وردپرس را مشابه تصویر زیر ببینید.

   ![wordpress-init](https://raw.githubusercontent.com/kubernetes/examples/master/mysql-wordpress-pd/WordPress.png)

   {{< caution >}}
   نصب وردپرس خود را در این صفحه رها نکنید. اگر کاربر دیگری آن را پیدا کند، می‌تواند یک وب‌سایت روی نمونه شما راه‌اندازی کند و از آن برای ارائه محتوای مخرب استفاده کند. یا با ایجاد نام کاربری و رمز عبور، وردپرس را نصب کنید یا نمونه خود را حذف کنید.
   {{< /caution >}}

## {{% heading "Cleaning up" %}}

1. دستور زیر را برای حذف Secret، Deployments، سرویس ها و ادعای حجم پایدار اجرا کنید:

   ```shell
   kubectl delete -k ./
   ```

## {{% heading "What's next?" %}}

* درباره [درون‌نگری و اشکال‌زدایی](/docs/tasks/debug/debug-application/debug-running-pod/) بیشتر بدانید
* درباره [مشاغل](/docs/concepts/workloads/controllers/job/) بیشتر بدانید
* درباره [Port Forwarding](/docs/tasks/access-application-cluster/port-forward-access-application-cluster/) بیشتر بدانید
* یاد بگیرید چگونه [یک پوسته را به یک کانتینر](/docs/tasks/debug/debug-application/get-shell-running-container/) منتقل کنید
