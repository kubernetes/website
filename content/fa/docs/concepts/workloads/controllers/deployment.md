---
reviewers:
- moh0ps
title: استقرارها
api_metadata:
- apiVersion: "apps/v1"
  kind: "Deployment"
feature:
  title: Automated rollouts and rollbacks
  description: >
    Kubernetes progressively rolls out changes to your application or its configuration, while monitoring application health to ensure it doesn't kill all your instances at the same time. If something goes wrong, Kubernetes will rollback the change for you. Take advantage of a growing ecosystem of deployment solutions.
description: >-
  A Deployment manages a set of Pods to run an application workload, usually one that doesn't maintain state.
content_type: concept
weight: 10
hide_summary: true # Listed separately in section index
---

<!-- overview -->

یک استقرار به‌روزرسانی‌های اعلانی برای {{< glossary_tooltip text="Pods" term_id="pod" >}} و
{{< glossary_tooltip term_id="replica-set" text="ReplicaSets" >}} ارائه می‌دهد.

شما یک وضعیت مطلوب را در یک استقرار توصیف می‌کنید، و استقرار {{< glossary_tooltip term_id="controller" >}} وضعیت واقعی را با سرعت کنترل‌شده‌ای به وضعیت مطلوب تغییر می‌دهد. می‌توانید استقرارها را برای ایجاد ReplicaSetهای جدید یا حذف استقرارهای موجود و اتخاذ تمام منابع آنها با استقرارهای جدید تعریف کنید.

{{< note >}}
ReplicaSet های متعلق به یک استقرار را مدیریت نکنید. اگر مورد استفاده شما در زیر پوشش داده نشده است، باز کردن یک مشکل در مخزن اصلی کوبرنتیز را در نظر بگیرید.
{{< /note >}}

<!-- body -->

## مورد استفاده

موارد استفاده معمول برای استقرارها به شرح زیر است:

* [ایجاد یک استقرار برای راه‌اندازی ReplicaSet](#creating-a-deployment). ReplicaSet در پس‌زمینه پادها را ایجاد می‌کند. وضعیت انتشار را بررسی کنید تا ببینید آیا موفق شده است یا خیر.
* [اعلام کردن وضعیت جدید پادها](#updating-a-deployment) با به‌روزرسانی PodTemplateSpec مربوط به استقرار. یک ReplicaSet جدید ایجاد می‌شود و استقرار، انتقال پادها را از ReplicaSet قدیمی به جدید با سرعت کنترل‌شده مدیریت می‌کند. هر ReplicaSet جدید، نسخه استقرار را به‌روزرسانی می‌کند.
* [بازگشت به نسخه قبلی استقرار](#rolling-back-a-deployment) اگر وضعیت فعلی استقرار پایدار نباشد. هر بازگشت مجدد، نسخه استقرار را به‌روزرسانی می‌کند.
* [افزایش مقیاس استقرار برای تسهیل بارگذاری بیشتر](#scaling-a-deployment).
* [توقف اجرای یک استقرار](#pausing-and-resuming-a-deployment) برای اعمال چندین اصلاحیه در PodTemplateSpec خود و سپس از سرگیری آن برای شروع یک انتشار جدید.
* [استفاده از وضعیت استقرار](#deployment-status) به عنوان شاخصی که نشان می‌دهد یک عرضه اولیه متوقف شده است.
* [ReplicaSets قدیمی‌تر را پاک می کند](#clean-up-policy) که دیگر نیازی به آن ندارید.

## ایجاد یک استقرار

در ادامه مثالی از یک استقرار آمده است. این استقرار یک ReplicaSet ایجاد می‌کند تا سه پاد از نوع nginx را نمایش دهد:

{{% code_sample file="controllers/nginx-deployment.yaml" %}}

در این مثال:

* یک استقرار با نام `nginx-deployment` ایجاد می‌شود که با فیلد `.metadata.name` مشخص می‌شود. این نام مبنای ReplicaSets و پادهایی خواهد بود که بعداً ایجاد می‌شوند. برای جزئیات بیشتر به [نوشتن مشخصات استقرار](#writing-a-deployment-spec) مراجعه کنید.
* استقرار یک ReplicaSet ایجاد می‌کند که سه پاد تکثیر شده ایجاد می‌کند که با فیلد `.spec.replicas` مشخص شده‌اند.
* فیلد `.spec.selector` تعریف می‌کند که ReplicaSet ایجاد شده چگونه پادها را برای مدیریت پیدا می‌کند. در این حالت، شما برچسبی را انتخاب می‌کنید که در الگوی پاد تعریف شده است (`app: nginx`). با این حال، قوانین انتخاب پیچیده‌تری نیز امکان‌پذیر است، تا زمانی که خود الگوی پاد این قانون را برآورده کند.

  {{< note >}}
  بخش `.spec.selector.matchLabels` یک نگاشت از جفت‌های {key,value} است. یک {key,value} واحد در نگاشت `matchLabels` معادل یک عنصر از `matchExpressions` است که بخش `key` آن "key"، `operator` آن "In" و آرایه `values` آن فقط شامل "value" است. برای تطبیق، باید تمام الزامات، از هر دو `matchLabels` و `matchExpressions`، برآورده شوند.
  {{< /note >}}

* بخش`.spec.template` شامل زیربخش های زیر است:
  * پادها با استفاده از بخش `.metadata.labels` با برچسب `app: nginx` مشخص شده‌اند.
  * مشخصات قالب پاد یا بخش `.spec` نشان می‌دهد که پادها یک کانتینر به نام `nginx` را اجرا می‌کنند که پرونده image  `nginx` [Docker Hub](https://hub.docker.com/) را با نسخه ۱.۱۴.۲ اجرا می‌کند.
  * یک کانتینر ایجاد میکند و با استفاده از بخش `.spec.containers[0].name` نام آن را `nginx` می گذارد.

قبل از شروع، مطمئن شوید که خوشه کوبرنتیز شما فعال و در حال اجرا است. برای ایجاد استقرار فوق، مراحل زیر را دنبال کنید:

1. با اجرای دستور زیر، استقرار را ایجاد کنید:

   ```shell
   kubectl apply -f https://k8s.io/examples/controllers/nginx-deployment.yaml
   ```

2. برای بررسی اینکه آیا استقرار ایجاد شده است یا خیر، دستور `kubectl get deployments` را اجرا کنید.

   اگر استقرار هنوز در حال ایجاد باشد، خروجی مشابه زیر خواهد بود:
   ```
   NAME               READY   UP-TO-DATE   AVAILABLE   AGE
   nginx-deployment   0/3     0            0           1s
   ```
   وقتی استقرارها را در خوشه خود بررسی می‌کنید، بخش های زیر نمایش داده می‌شوند:
   * `NAME` نام‌های استقرارها را در فضای نام فهرست می‌کند.
   * `READY` نمایش می‌دهد که چه تعداد رونوشت از برنامه برای کاربران شما در دسترس است. این از الگوی آماده/مطلوب پیروی می‌کند.
   * `UP-TO-DATE` تعداد رونوشت هایی را که برای رسیدن به وضعیت مطلوب به‌روزرسانی شده‌اند، نمایش می‌دهد.
   * `AVAILABLE` تعداد نسخه‌های رونوشت برنامه را که برای کاربران شما در دسترس است، نمایش می‌دهد.
   * `AGE` مدت زمانی که برنامه در حال اجرا بوده است را نمایش می‌دهد.

   توجه کنید که تعداد رونوشت های مورد نظر طبق بخش `.spec.replicas` برابر با ۳ است.

3. برای مشاهده وضعیت انتشار استقرار، دستور `kubectl rollout status deployment/nginx-deployment` را اجرا کنید.

   خروجی مشابه زیر است:
   ```
   Waiting for rollout to finish: 2 out of 3 new replicas have been updated...
   deployment "nginx-deployment" successfully rolled out
   ```

4. چند ثانیه بعد دوباره دستور `kubectl get deployments` را اجرا کنید.
   خروجی مشابه این است:
   ```
   NAME               READY   UP-TO-DATE   AVAILABLE   AGE
   nginx-deployment   3/3     3            3           18s
   ```
   توجه داشته باشید که استقرار هر سه replica را ایجاد کرده است و همه replicaها به‌روز هستند (حاوی آخرین الگوی پاد هستند) و در دسترس هستند.

5. برای مشاهده ReplicaSet (`rs`) ایجاد شده توسط استقرار، دستور `kubectl get rs` را اجرا کنید. خروجی مشابه این خواهد بود:
   ```
   NAME                          DESIRED   CURRENT   READY   AGE
   nginx-deployment-75675f5897   3         3         3       18s
   ```
   خروجی ReplicaSet بخش های زیر را نشان می‌دهد:

   * `NAME` نام‌های ReplicaSetها را در فضای نام فهرست می‌کند.
   * `DESIRED` تعداد مورد نظر _replicas_ از برنامه را که هنگام ایجاد استقرار تعریف می‌کنید، نمایش می‌دهد. این حالت مطلوب است.
   * `CURRENT` تعداد رونوشت های در حال اجرا را نمایش می‌دهد.
   * `READY` تعداد نسخه‌های رونوشت برنامه را که برای کاربران شما در دسترس است، نمایش می‌دهد.
   * `AGE` مدت زمانی که برنامه در حال اجرا بوده است را نمایش می‌دهد.

   توجه داشته باشید که نام ReplicaSet همیشه به صورت `[DEPLOYMENT-NAME]-[HASH]` قالب‌بندی می‌شود. این نام مبنای پادهایی خواهد بود که ایجاد می‌شوند.

   رشته `HASH` همان برچسب `pod-template-hash` در ReplicaSet است.

6. برای مشاهده برچسب‌هایی که به طور خودکار برای هر پاد ایجاد می‌شوند، دستور `kubectl get pods --show-labels` را اجرا کنید.
   خروجی مشابه زیر است:
   ```
   NAME                                READY     STATUS    RESTARTS   AGE       LABELS
   nginx-deployment-75675f5897-7ci7o   1/1       Running   0          18s       app=nginx,pod-template-hash=75675f5897
   nginx-deployment-75675f5897-kzszj   1/1       Running   0          18s       app=nginx,pod-template-hash=75675f5897
   nginx-deployment-75675f5897-qqcnn   1/1       Running   0          18s       app=nginx,pod-template-hash=75675f5897
   ```
   ReplicaSet ایجاد شده تضمین می‌کند که سه پاد از نوع nginx وجود دارد.

{{< note >}}
شما باید یک انتخابگر مناسب و برچسب‌های الگوی پاد را در یک استقرار (در این مورد، `app: nginx`) مشخص کنید.

برچسب‌ها یا انتخابگرها را با سایر کنترل‌کننده‌ها (از جمله سایر استقرارها و StatefulSetها) همپوشانی نکنید. کوبرنتیز مانع از همپوشانی شما نمی‌شود و اگر چندین کنترل‌کننده انتخابگرهای همپوشانی داشته باشند، ممکن است آن کنترل‌کننده‌ها با هم تداخل داشته باشند و رفتار غیرمنتظره‌ای داشته باشند.
{{< /note >}}

### برچسب Pod-template-hash

{{< caution >}}
این برچسب را تغییر ندهید.
{{< /caution >}}

برچسب `pod-template-hash` توسط کنترل کننده استقرار به هر ReplicaSet که یک استقرار ایجاد یا اتخاذ می‌کند، اضافه می‌شود.

این برچسب تضمین می‌کند که ReplicaSet های فرزند یک استقرار با هم همپوشانی نداشته باشند. این برچسب با هش کردن `PodTemplate` مربوط به ReplicaSet و استفاده از هش حاصل به عنوان مقدار برچسبی که به انتخابگر ReplicaSet، برچسب‌های الگوی پاد و در هر پاد موجود دیگری که ReplicaSet ممکن است داشته باشد، اضافه می‌شود، ایجاد می‌شود.

## به‌روزرسانی یک استقرار

{{< note >}}
یک عرضه استقرار تنها در صورتی فعال می‌شود که الگوی پاد مربوط به استقرار (یعنی `.spec.template`) تغییر کند، برای مثال اگر برچسب‌ها یا تصاویر کانتینر الگو به‌روزرسانی شوند. سایر به‌روزرسانی‌ها، مانند تغییر مقیاس استقرار، باعث فعال شدن rollout نمی‌شوند.
{{< /note >}}

برای به‌روزرسانی استقرار خود، مراحل زیر را دنبال کنید:

1. بیایید پادهای nginx را به‌روزرسانی کنیم تا از تصویر `nginx:1.16.1` به جای تصویر `nginx:1.14.2` استفاده کند.

   ```shell
   kubectl set image deployment.v1.apps/nginx-deployment nginx=nginx:1.16.1
   ```

   یا از دستور زیر استفاده کنید:

   ```shell
   kubectl set image deployment/nginx-deployment nginx=nginx:1.16.1
   ```
   که در آن `deployment/nginx-deployment` نشان‌دهنده‌ی استقرار است، `nginx` نشان‌دهنده‌ی کانتینری است که به‌روزرسانی در آن انجام خواهد شد و `nginx:1.16.1` نشان‌دهنده‌ی image جدید و برچسب آن است.


   خروجی مشابه زیر است:

   ```
   deployment.apps/nginx-deployment image updated
   ```

   از طرف دیگر، می‌توانید استقرار را ویرایش کرده و `.spec.template.spec.containers[0].image` را از `nginx:1.14.2` به `nginx:1.16.1` تغییر دهید:

   ```shell
   kubectl edit deployment/nginx-deployment
   ```

   خروجی مشابه زیر است:

   ```
   deployment.apps/nginx-deployment edited
   ```

2. برای مشاهده وضعیت انتشار، دستور زیر را اجرا کنید:

   ```shell
   kubectl rollout status deployment/nginx-deployment
   ```

   خروجی مشابه این است:

   ```
   Waiting for rollout to finish: 2 out of 3 new replicas have been updated...
   ```

   یا

   ```
   deployment "nginx-deployment" successfully rolled out
   ```

جزئیات بیشتری در مورد استقرار به‌روزرسانی‌شده خود دریافت کنید:

* پس از موفقیت در انتشار، می‌توانید با اجرای دستور `kubectl get deployments`، وضعیت استقرار را مشاهده کنید.
  خروجی مشابه این است:

  ```
  NAME               READY   UP-TO-DATE   AVAILABLE   AGE
  nginx-deployment   3/3     3            3           36s
  ```

* دستور `kubectl get rs` را اجرا کنید تا ببینید که استقرار با ایجاد یک ReplicaSet جدید و افزایش مقیاس آن تا ۳ رونوشت، و همچنین کاهش مقیاس ReplicaSet قدیمی به ۰ رونوشت، پادها را به‌روزرسانی کرده است.

  ```shell
  kubectl get rs
  ```

  خروجی مشابه این است:
  ```
  NAME                          DESIRED   CURRENT   READY   AGE
  nginx-deployment-1564180365   3         3         3       6s
  nginx-deployment-2035384211   0         0         0       36s
  ```

* اجرای دستور `get pods` اکنون باید فقط پاد های جدید را نشان دهد:

  ```shell
  kubectl get pods
  ```

  خروجی مشابه این است:
  ```
  NAME                                READY     STATUS    RESTARTS   AGE
  nginx-deployment-1564180365-khku8   1/1       Running   0          14s
  nginx-deployment-1564180365-nacti   1/1       Running   0          14s
  nginx-deployment-1564180365-z9gth   1/1       Running   0          14s
  ```

  دفعه‌ی بعدی که می‌خواهید این پادها را به‌روزرسانی کنید، فقط کافی است الگوی پاد مربوط به استقرار را دوباره به‌روزرسانی کنید.

  استقرار تضمین می‌کند که فقط تعداد مشخصی از پادها در حین به‌روزرسانی از کار بیفتند. به طور پیش‌فرض، تضمین می‌کند که حداقل ۷۵٪ از تعداد پادهای مورد نظر فعال باشند (حداکثر ۲۵٪ در دسترس نباشند).

  استقرار همچنین تضمین می‌کند که فقط تعداد مشخصی پاد بالاتر از تعداد پادهای مورد نظر ایجاد شوند. به طور پیش‌فرض، تضمین می‌کند که حداکثر ۱۲۵٪ از تعداد پادهای مورد نظر فعال باشند (حداکثر ۲۵٪ افزایش).

  برای مثال، اگر به استقرار بالا با دقت نگاه کنید، خواهید دید که ابتدا یک پاد جدید ایجاد می‌کند، سپس یک پاد قدیمی را حذف می‌کند و یک پاد جدید دیگر ایجاد می‌کند. تا زمانی که تعداد کافی پاد جدید ایجاد نشده باشد، پادهای قدیمی را از بین نمی‌برد و تا زمانی که تعداد کافی پاد قدیمی از بین نرفته باشد، پادهای جدید ایجاد نمی‌کند. این اطمینان حاصل می‌کند که حداقل ۳ پاد و حداکثر ۴ پاد در مجموع در دسترس باشند. در صورت وجود استقرار با ۴ رونوشت، تعداد پادها بین ۳ تا ۵ خواهد بود.

* جزئیات استقرار خود را دریافت کنید:
  ```shell
  kubectl describe deployments
  ```
  خروجی مشابه این است:
  ```
  Name:                   nginx-deployment
  Namespace:              default
  CreationTimestamp:      Thu, 30 Nov 2017 10:56:25 +0000
  Labels:                 app=nginx
  Annotations:            deployment.kubernetes.io/revision=2
  Selector:               app=nginx
  Replicas:               3 desired | 3 updated | 3 total | 3 available | 0 unavailable
  StrategyType:           RollingUpdate
  MinReadySeconds:        0
  RollingUpdateStrategy:  25% max unavailable, 25% max surge
  Pod Template:
    Labels:  app=nginx
     Containers:
      nginx:
        Image:        nginx:1.16.1
        Port:         80/TCP
        Environment:  <none>
        Mounts:       <none>
      Volumes:        <none>
    Conditions:
      Type           Status  Reason
      ----           ------  ------
      Available      True    MinimumReplicasAvailable
      Progressing    True    NewReplicaSetAvailable
    OldReplicaSets:  <none>
    NewReplicaSet:   nginx-deployment-1564180365 (3/3 replicas created)
    Events:
      Type    Reason             Age   From                   Message
      ----    ------             ----  ----                   -------
      Normal  ScalingReplicaSet  2m    deployment-controller  Scaled up replica set nginx-deployment-2035384211 to 3
      Normal  ScalingReplicaSet  24s   deployment-controller  Scaled up replica set nginx-deployment-1564180365 to 1
      Normal  ScalingReplicaSet  22s   deployment-controller  Scaled down replica set nginx-deployment-2035384211 to 2
      Normal  ScalingReplicaSet  22s   deployment-controller  Scaled up replica set nginx-deployment-1564180365 to 2
      Normal  ScalingReplicaSet  19s   deployment-controller  Scaled down replica set nginx-deployment-2035384211 to 1
      Normal  ScalingReplicaSet  19s   deployment-controller  Scaled up replica set nginx-deployment-1564180365 to 3
      Normal  ScalingReplicaSet  14s   deployment-controller  Scaled down replica set nginx-deployment-2035384211 to 0
  ```
  در اینجا می‌بینید که وقتی برای اولین بار استقرار را ایجاد کردید، یک ReplicaSet (nginx-deployment-2035384211) ایجاد کرد و آن را مستقیماً تا ۳ رونوشت افزایش مقیاس داد. وقتی استقرار را به‌روزرسانی کردید، یک ReplicaSet جدید (nginx-deployment-1564180365) ایجاد کرد و آن را تا ۱ افزایش مقیاس داد و منتظر ماند تا بالا بیاید. سپس ReplicaSet قدیمی را تا ۲ کاهش مقیاس داد و ReplicaSet جدید را تا ۲ افزایش مقیاس داد تا حداقل ۳ پاد در دسترس باشد و حداکثر ۴ پاد در هر زمان ایجاد شود. سپس با همان استراتژی به‌روزرسانی پیوسته، به افزایش و کاهش مقیاس ReplicaSet جدید و قدیمی ادامه داد. در نهایت، ۳ رونوشت در ReplicaSet جدید خواهید داشت و ReplicaSet قدیمی تا ۰ کاهش مقیاس داده می‌شود.

{{< note >}}
کوبرنتیز هنگام محاسبه تعداد `availableReplicas`، پادهای خاتمه‌دهنده را که باید بین `replicas - maxUnavailable` و `replicas + maxSurge` باشد، در نظر نمی‌گیرد. در نتیجه، ممکن است متوجه شوید که در طول یک راه‌اندازی، پادهای بیشتری از حد انتظار وجود دارد و کل منابع مصرف‌شده توسط استقرار تا زمانی که `terminationGracePeriodSeconds` پادهای خاتمه‌دهنده منقضی شود، بیشتر از `replicas + maxSurge` است.
{{< /note >}}

### Rollover (معروف به به‌روزرسانی‌های چندگانه در حین انجام کار)

هر بار که یک استقرار جدید توسط کنترل کننده استقرار مشاهده می‌شود، یک ReplicaSet برای نمایش پادهای مورد نظر ایجاد می‌شود. اگر استقرار به‌روزرسانی شود، ReplicaSet موجود که پادهایی را کنترل می‌کند که برچسب‌های آنها با `.spec.selector` مطابقت دارد اما الگوی آنها با `.spec.template` مطابقت ندارد، کوچک می‌شود. در نهایت، ReplicaSet جدید به `.spec.replicas` مقیاس‌بندی می‌شود و تمام ReplicaSetهای قدیمی به 0 مقیاس‌بندی می‌شوند.

اگر یک استقرار را در حالی که یک rollout موجود در حال انجام است، به‌روزرسانی کنید، استقرار یک ReplicaSet جدید مطابق با به‌روزرسانی ایجاد می‌کند و شروع به افزایش مقیاس آن می‌کند و ReplicaSet را که قبلاً افزایش مقیاس داده بود، به لیست ReplicaSetهای قدیمی خود اضافه می‌کند و شروع به کاهش مقیاس آن می‌کند.

برای مثال، فرض کنید شما یک استقرار ایجاد می‌کنید تا ۵ رونوشت از `nginx:1.14.2` ایجاد کند، اما سپس استقرار را به‌روزرسانی می‌کنید تا ۵ رونوشت از `nginx:1.16.1` ایجاد کند، در حالی که فقط ۳ رونوشت از `nginx:1.14.2` ایجاد شده بود. در این صورت، استقرار بلافاصله شروع به از بین بردن ۳ پاد `nginx:1.14.2` که ایجاد کرده بود، می‌کند و شروع به ایجاد Pod `nginx:1.16.1` می‌کند. قبل از تغییر مسیر، منتظر ایجاد ۵ رونوشت از `nginx:1.14.2` نمی‌ماند.

### به‌روزرسانی‌های انتخابگر برچسب

به طور کلی توصیه می‌شود که به‌روزرسانی‌های انتخابگر برچسب انجام نشود و پیشنهاد می‌شود که انتخابگرهای خود را از قبل برنامه‌ریزی کنید. در هر صورت، اگر نیاز به انجام به‌روزرسانی انتخابگر برچسب دارید، احتیاط زیادی به خرج دهید و مطمئن شوید که تمام پیامدها را درک کرده‌اید.

{{< note >}}
در نسخه API `apps/v1`، انتخابگر برچسب یک استقرار پس از ایجاد آن تغییرناپذیر است.
{{< /note >}}

* اضافه کردن انتخاب گرها مستلزم آن است که برچسب‌های قالب پاد در مشخصات استقرار نیز با برچسب جدید به‌روزرسانی شوند، در غیر این صورت یک خطای اعتبارسنجی بازگردانده می‌شود. این تغییر، یک تغییر غیر همپوشانی است، به این معنی که انتخاب گر جدید ReplicaSets و پادهای ایجاد شده با انتخاب گر قدیمی را انتخاب نمی‌کند، که منجر به یتیم شدن همه ReplicaSets قدیمی و ایجاد یک ReplicaSet جدید می‌شود.
* به‌روزرسانی‌های انتخابگر، مقدار موجود در کلید انتخابگر را تغییر می‌دهند -- نتیجه‌ای مشابه با جمع‌ها دارند.
* حذف انتخابگرها، یک کلید موجود را از انتخابگر استقرار حذف می‌کند -- نیازی به هیچ تغییری در برچسب‌های قالب پاد ندارد. ReplicaSetهای موجود یتیم نمی‌شوند و ReplicaSet جدیدی ایجاد نمی‌شود، اما توجه داشته باشید که برچسب حذف شده هنوز در هر پاد و ReplicaSet موجود وجود دارد.

## بازگرداندن یک استقرار به حالت قبل

گاهی اوقات، ممکن است بخواهید یک استقرار را به حالت اولیه برگردانید؛ برای مثال، وقتی استقرار پایدار نیست، مانند حلقه خرابی. به طور پیش‌فرض، تمام تاریخچه‌ی انتشار استقرار در سیستم نگهداری می‌شود تا بتوانید هر زمان که خواستید آن را به حالت اولیه برگردانید (می‌توانید این را با تغییر محدودیت تاریخچه‌ی ویرایش تغییر دهید).

{{< note >}}
یک نسخه از استقرار زمانی ایجاد می‌شود که یک بخش از استقرار فعال شود. این بدان معناست که نسخه جدید فقط و فقط در صورتی ایجاد می‌شود که الگوی پاد مربوط به استقرار (`.spec.template`) تغییر کند، برای مثال اگر برچسب‌ها یا تصاویر کانتینر الگو را به‌روزرسانی کنید. سایر به‌روزرسانی‌ها، مانند مقیاس‌بندی استقرار، یک نسخه از استقرار ایجاد نمی‌کنند، بنابراین می‌توانید مقیاس‌بندی دستی یا خودکار همزمان را تسهیل کنید. این بدان معناست که وقتی به یک نسخه قبلی برمی‌گردید، فقط بخش الگوی پاد مربوط به استقرار به عقب برگردانده می‌شود.
{{< /note >}}

* فرض کنید هنگام به‌روزرسانی استقرار، با قرار دادن نام image به صورت `nginx:1.161` به جای `nginx:1.16.1`، اشتباه تایپی مرتکب شده‌اید:

  ```shell
  kubectl set image deployment/nginx-deployment nginx=nginx:1.161
  ```

  خروجی مشابه این است:
  ```
  deployment.apps/nginx-deployment image updated
  ```

* انتشار متوقف می‌شود. می‌توانید با بررسی وضعیت انتشار، آن را تأیید کنید:

  ```shell
  kubectl rollout status deployment/nginx-deployment
  ```

  خروجی مشابه این است:
  ```
  Waiting for rollout to finish: 1 out of 3 new replicas have been updated...
  ```

* برای متوقف کردن نمایش وضعیت انتشار بالا، Ctrl-C را فشار دهید. برای اطلاعات بیشتر در مورد انتشارهای متوقف شده، [اینجا بیشتر بخوانید](#deployment-status).

* می‌بینید که تعداد رونوشت های قدیمی (با جمع تعداد رونوشت ها از `nginx-deployment-1564180365` و `nginx-deployment-2035384211`) برابر با ۳ است، و تعداد رونوشت های جدید (از `nginx-deployment-3066724191`) برابر با ۱ است.

  ```shell
  kubectl get rs
  ```

  خروجی مشابه این است:
  ```
  NAME                          DESIRED   CURRENT   READY   AGE
  nginx-deployment-1564180365   3         3         3       25s
  nginx-deployment-2035384211   0         0         0       36s
  nginx-deployment-3066724191   1         1         0       6s
  ```

* با نگاهی به پادهای ایجاد شده، می بینید که پاد 1 ایجاد شده توسط new ReplicaSet در یک حلقه ادغام image گیر کرده است.

  ```shell
  kubectl get pods
  ```

  خروجی مشابه این است:
  ```
  NAME                                READY     STATUS             RESTARTS   AGE
  nginx-deployment-1564180365-70iae   1/1       Running            0          25s
  nginx-deployment-1564180365-jbqqo   1/1       Running            0          25s
  nginx-deployment-1564180365-hysrc   1/1       Running            0          25s
  nginx-deployment-3066724191-08mng   0/1       ImagePullBackOff   0          6s
  ```

  {{< note >}}
  کنترل‌کننده‌ی استقرار به‌طور خودکار روند نامناسب را متوقف می‌کند و افزایش مقیاس ReplicaSet جدید را متوقف می‌کند. این بستگی به پارامترهای به روز رسانی چرخشی (به‌طور خاص maxUnavailable) دارد که شما مشخص کرده‌اید. کوبرنتیز به‌طور پیش‌فرض مقدار را روی ۲۵٪ تنظیم می‌کند.
  {{< /note >}}

* شرح استقرار را دریافت کنید:
  ```shell
  kubectl describe deployment
  ```

  خروجی مشابه این است:
  ```
  Name:           nginx-deployment
  Namespace:      default
  CreationTimestamp:  Tue, 15 Mar 2016 14:48:04 -0700
  Labels:         app=nginx
  Selector:       app=nginx
  Replicas:       3 desired | 1 updated | 4 total | 3 available | 1 unavailable
  StrategyType:       RollingUpdate
  MinReadySeconds:    0
  RollingUpdateStrategy:  25% max unavailable, 25% max surge
  Pod Template:
    Labels:  app=nginx
    Containers:
     nginx:
      Image:        nginx:1.161
      Port:         80/TCP
      Host Port:    0/TCP
      Environment:  <none>
      Mounts:       <none>
    Volumes:        <none>
  Conditions:
    Type           Status  Reason
    ----           ------  ------
    Available      True    MinimumReplicasAvailable
    Progressing    True    ReplicaSetUpdated
  OldReplicaSets:     nginx-deployment-1564180365 (3/3 replicas created)
  NewReplicaSet:      nginx-deployment-3066724191 (1/1 replicas created)
  Events:
    FirstSeen LastSeen    Count   From                    SubObjectPath   Type        Reason              Message
    --------- --------    -----   ----                    -------------   --------    ------              -------
    1m        1m          1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-2035384211 to 3
    22s       22s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-1564180365 to 1
    22s       22s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled down replica set nginx-deployment-2035384211 to 2
    22s       22s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-1564180365 to 2
    21s       21s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled down replica set nginx-deployment-2035384211 to 1
    21s       21s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-1564180365 to 3
    13s       13s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled down replica set nginx-deployment-2035384211 to 0
    13s       13s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-3066724191 to 1
  ```

  برای رفع این مشکل، باید به نسخه قبلی استقرار که پایدار است، برگردید.

### بررسی تاریخچه‌ی انتشار یک استقرار

برای بررسی تاریخچه انتشار، مراحل زیر را دنبال کنید:

1. ابتدا، اصلاحات این استقرار را بررسی کنید:
   ```shell
   kubectl rollout history deployment/nginx-deployment
   ```
   خروجی مشابه این است:
   ```
   deployments "nginx-deployment"
   REVISION    CHANGE-CAUSE
   1           kubectl apply --filename=https://k8s.io/examples/controllers/nginx-deployment.yaml
   2           kubectl set image deployment/nginx-deployment nginx=nginx:1.16.1
   3           kubectl set image deployment/nginx-deployment nginx=nginx:1.161
   ```

   `CHANGE-CAUSE` از حاشیه‌نویسی استقرار `kubernetes.io/change-cause` در نسخه‌های پس از ایجاد آن رونوشت می‌شود. می‌توانید پیام `CHANGE-CAUSE` را به صورت زیر مشخص کنید:

   * حاشیه‌نویسی استقرار با استفاده از `kubectl annotate deployment/nginx-deployment kubernetes.io/change-cause="image updated to 1.16.1"`
   * ویرایش دستی تنظیمات منبع.

2. برای مشاهده جزئیات هر نسخه، دستور زیر را اجرا کنید:
   ```shell
   kubectl rollout history deployment/nginx-deployment --revision=2
   ```

   خروجی مشابه این است:
   ```
   deployments "nginx-deployment" revision 2
     Labels:       app=nginx
             pod-template-hash=1159050644
     Annotations:  kubernetes.io/change-cause=kubectl set image deployment/nginx-deployment nginx=nginx:1.16.1
     Containers:
      nginx:
       Image:      nginx:1.16.1
       Port:       80/TCP
        QoS Tier:
           cpu:      BestEffort
           memory:   BestEffort
       Environment Variables:      <none>
     No volumes.
   ```

### بازگشت به نسخه قبلی
برای بازگرداندن استقرار از نسخه فعلی به نسخه قبلی، که نسخه ۲ است، مراحل زیر را دنبال کنید.

1. حالا تصمیم گرفته‌اید که تغییرات اعمال شده را لغو کنید و به نسخه قبلی برگردید:
   ```shell
   kubectl rollout undo deployment/nginx-deployment
   ```

   خروجی مشابه این است:
   ```
   deployment.apps/nginx-deployment rolled back
   ```
   به طور جایگزین، می‌توانید با مشخص کردن یک ویرایش خاص با استفاده از `--to-revision` به آن برگردید:

   ```shell
   kubectl rollout undo deployment/nginx-deployment --to-revision=2
   ```

   خروجی مشابه این است:
   ```
   deployment.apps/nginx-deployment rolled back
   ```

   برای جزئیات بیشتر در مورد دستورات مربوط به عرضه، [`kubectl rollout`](/docs/reference/generated/kubectl/kubectl-commands#rollout) را مطالعه کنید.

   اکنون استقرار به نسخه پایدار قبلی برگردانده می‌شود. همانطور که می‌بینید، یک رویداد `DeploymentRollback` برای برگرداندن به نسخه ۲ از کنترلر استقرار ایجاد می‌شود.

2. بررسی کنید که آیا بازگرداندن به نسخه قبلی موفقیت‌آمیز بوده و استقرار طبق انتظار در حال اجرا است یا خیر، دستور زیر را اجرا کنید:
   ```shell
   kubectl get deployment nginx-deployment
   ```

   خروجی مشابه این است:
   ```
   NAME               READY   UP-TO-DATE   AVAILABLE   AGE
   nginx-deployment   3/3     3            3           30m
   ```
3. شرح استقرار را دریافت کنید:
   ```shell
   kubectl describe deployment nginx-deployment
   ```
   خروجی مشابه این است:
   ```
   Name:                   nginx-deployment
   Namespace:              default
   CreationTimestamp:      Sun, 02 Sep 2018 18:17:55 -0500
   Labels:                 app=nginx
   Annotations:            deployment.kubernetes.io/revision=4
                           kubernetes.io/change-cause=kubectl set image deployment/nginx-deployment nginx=nginx:1.16.1
   Selector:               app=nginx
   Replicas:               3 desired | 3 updated | 3 total | 3 available | 0 unavailable
   StrategyType:           RollingUpdate
   MinReadySeconds:        0
   RollingUpdateStrategy:  25% max unavailable, 25% max surge
   Pod Template:
     Labels:  app=nginx
     Containers:
      nginx:
       Image:        nginx:1.16.1
       Port:         80/TCP
       Host Port:    0/TCP
       Environment:  <none>
       Mounts:       <none>
     Volumes:        <none>
   Conditions:
     Type           Status  Reason
     ----           ------  ------
     Available      True    MinimumReplicasAvailable
     Progressing    True    NewReplicaSetAvailable
   OldReplicaSets:  <none>
   NewReplicaSet:   nginx-deployment-c4747d96c (3/3 replicas created)
   Events:
     Type    Reason              Age   From                   Message
     ----    ------              ----  ----                   -------
     Normal  ScalingReplicaSet   12m   deployment-controller  Scaled up replica set nginx-deployment-75675f5897 to 3
     Normal  ScalingReplicaSet   11m   deployment-controller  Scaled up replica set nginx-deployment-c4747d96c to 1
     Normal  ScalingReplicaSet   11m   deployment-controller  Scaled down replica set nginx-deployment-75675f5897 to 2
     Normal  ScalingReplicaSet   11m   deployment-controller  Scaled up replica set nginx-deployment-c4747d96c to 2
     Normal  ScalingReplicaSet   11m   deployment-controller  Scaled down replica set nginx-deployment-75675f5897 to 1
     Normal  ScalingReplicaSet   11m   deployment-controller  Scaled up replica set nginx-deployment-c4747d96c to 3
     Normal  ScalingReplicaSet   11m   deployment-controller  Scaled down replica set nginx-deployment-75675f5897 to 0
     Normal  ScalingReplicaSet   11m   deployment-controller  Scaled up replica set nginx-deployment-595696685f to 1
     Normal  DeploymentRollback  15s   deployment-controller  Rolled back deployment "nginx-deployment" to revision 2
     Normal  ScalingReplicaSet   15s   deployment-controller  Scaled down replica set nginx-deployment-595696685f to 0
   ```

## مقیاس‌بندی یک استقرار

شما می‌توانید با استفاده از دستور زیر، یک استقرار را مقیاس‌بندی کنید:

```shell
kubectl scale deployment/nginx-deployment --replicas=10
```
خروجی مشابه این است:
```
deployment.apps/nginx-deployment scaled
```

با فرض اینکه [مقیاس‌بندی خودکار افقی پاد](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/) در خوشه شما فعال باشد، می‌توانید یک مقیاس‌بندی خودکار برای استقرار خود تنظیم کنید و حداقل و حداکثر تعداد پادهایی را که می‌خواهید اجرا کنید، بر اساس میزان استفاده از CPU پادهای موجود خود انتخاب کنید.

```shell
kubectl autoscale deployment/nginx-deployment --min=10 --max=15 --cpu-percent=80
```
خروجی مشابه این است:
```
deployment.apps/nginx-deployment scaled
```

### مقیاس‌بندی متناسب

استقرارهای به‌روزرسانی مداوم از اجرای چندین نسخه از یک برنامه به طور همزمان پشتیبانی می‌کند. هنگامی که شما یا یک مقیاس کننده خودکار یک استقرار به‌روزرسانی مداوم را که در اواسط یک عرضه (چه در حال انجام و چه متوقف شده) است، مقیاس‌بندی می‌کنید، کنترل‌کننده استقرار، کپی‌های اضافی را در ReplicaSets فعال موجود (ReplicaSets با پادها) متعادل می‌کند تا ریسک را کاهش دهد. به این کار *مقیاس‌بندی متناسب* می‌گویند.

برای مثال، شما در حال اجرای یک استقرار با 10 رونوشت هستید، [maxSurge](#max-surge)=3، و [maxUnavailable](#max-unavailable)=2.

* مطمئن شوید که 10 رونوشت موجود در استقرار شما در حال اجرا هستند.
  ```shell
  kubectl get deploy
  ```
  خروجی مشابه این است:

  ```
  NAME                 DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
  nginx-deployment     10        10        10           10          50s
  ```

* شما به یک image جدید به‌روزرسانی می‌کنید که از داخل خوشه قابل جداسازی نیست.
  ```shell
  kubectl set image deployment/nginx-deployment nginx=nginx:sometag
  ```

  خروجی مشابه این است:
  ```
  deployment.apps/nginx-deployment image updated
  ```

* به‌روزرسانی image، یک به‌روزرسانی جدید با ReplicaSet nginx deployment-1989198191 آغاز می‌کند، اما به دلیل الزام maxUnavailable که در بالا به آن اشاره کردید، مسدود شده است. وضعیت به‌روزرسانی را بررسی کنید:
  ```shell
  kubectl get rs
  ```
  خروجی مشابه این است:
  ```
  NAME                          DESIRED   CURRENT   READY     AGE
  nginx-deployment-1989198191   5         5         0         9s
  nginx-deployment-618515232    8         8         8         1m
  ```

* سپس یک درخواست مقیاس‌بندی جدید برای استقرار ارسال می‌شود. مقیاس‌بندی خودکار، رونوشت‌های استقرار را به ۱۵ افزایش می‌دهد. کنترل‌کننده استقرار باید تصمیم بگیرد که این ۵ رونوشت جدید را کجا اضافه کند. اگر از مقیاس‌بندی متناسب استفاده نمی‌کردید، هر ۵ رونوشت در ReplicaSet جدید اضافه می‌شدند. با مقیاس‌بندی متناسب، رونوشت های اضافی را در تمام ReplicaSetها پخش می‌کنید. نسبت‌های بزرگتر به ReplicaSetهایی با بیشترین رونوشت و نسبت‌های کوچکتر به ReplicaSetهایی با رونوشت های کمتر می‌روند. هر مقدار باقی مانده به ReplicaSet با بیشترین رونوشت اضافه می‌شود. ReplicaSetهایی که هیچ رونوشتی ندارند، مقیاس‌بندی نمی‌شوند.

در مثال بالا، ۳ رونوشت به ReplicaSet قدیمی و ۲ رونوشت به ReplicaSet جدید اضافه می‌شوند. فرآیند انتشار در نهایت باید تمام کپی‌ها را به ReplicaSet جدید منتقل کند، با فرض اینکه رونوشت های جدید سالم باشند. برای تأیید این موضوع، دستور زیر را اجرا کنید:

```shell
kubectl get deploy
```

خروجی مشابه این است:
```
NAME                 DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment     15        18        7            8           7m
```
وضعیت انتشار، نحوه‌ی اضافه شدن رونوشت ها به هر ReplicaSet را تأیید می‌کند.
```shell
kubectl get rs
```

خروجی مشابه این است:
```
NAME                          DESIRED   CURRENT   READY     AGE
nginx-deployment-1989198191   7         7         0         7m
nginx-deployment-618515232    11        11        11        7m
```

## توقف و از سرگیری عرضه یک استقرار {#pausing-and-resuming-a-deployment}

وقتی یک استقرار را به‌روزرسانی می‌کنید، یا قصد دارید به‌روزرسانی کنید، می‌توانید قبل از شروع یک یا چند به‌روزرسانی، به‌روزرسانی‌های آن استقرار را متوقف کنید. وقتی آماده اعمال آن تغییرات شدید، به‌روزرسانی‌های مربوط به استقرار را از سر می‌گیرید. این رویکرد به شما امکان می‌دهد بدون راه‌اندازی به‌روزرسانی‌های غیرضروری، چندین اصلاحیه را بین توقف و از سرگیری اعمال کنید.

* برای مثال، با استقراری که ایجاد شده است:

  جزئیات استقرار را دریافت کنید:
  ```shell
  kubectl get deploy
  ```
  خروجی مشابه این است:
  ```
  NAME      DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
  nginx     3         3         3            3           1m
  ```
  وضعیت انتشار را دریافت کنید:
  ```shell
  kubectl get rs
  ```
  خروجی مشابه این است:
  ```
  NAME               DESIRED   CURRENT   READY     AGE
  nginx-2142116321   3         3         3         1m
  ```

* با اجرای دستور زیر، توقف کنید:
  ```shell
  kubectl rollout pause deployment/nginx-deployment
  ```

  خروجی مشابه این است:
  ```
  deployment.apps/nginx-deployment paused
  ```

* سپس image استقرار را به‌روزرسانی کنید:
  ```shell
  kubectl set image deployment/nginx-deployment nginx=nginx:1.16.1
  ```

  خروجی مشابه این است:
  ```
  deployment.apps/nginx-deployment image updated
  ```

* توجه داشته باشید که هیچ انتشار جدیدی آغاز نشده است:
  ```shell
  kubectl rollout history deployment/nginx-deployment
  ```

  خروجی مشابه این است:
  ```
  deployments "nginx"
  REVISION  CHANGE-CAUSE
  1   <none>
  ```
* وضعیت انتشار را بررسی کنید تا تأیید کنید که ReplicaSet موجود تغییر نکرده است:
  ```shell
  kubectl get rs
  ```

  خروجی مشابه این است:
  ```
  NAME               DESIRED   CURRENT   READY     AGE
  nginx-2142116321   3         3         3         2m
  ```

* شما می‌توانید هر تعداد به‌روزرسانی که می‌خواهید انجام دهید، برای مثال، منابعی را که استفاده خواهند شد به‌روزرسانی کنید:
  ```shell
  kubectl set resources deployment/nginx-deployment -c=nginx --limits=cpu=200m,memory=512Mi
  ```

  خروجی مشابه این است:
  ```
  deployment.apps/nginx-deployment resource requirements updated
  ```

 وضعیت اولیه‌ی استقرار قبل از توقف انتشار، به عملکرد خود ادامه خواهد داد، اما به‌روزرسانی‌های جدید استقرار تا زمانی که انتشار استقرار متوقف شده باشد، هیچ تأثیری نخواهند داشت.

* در نهایت، بخش استقرار را از سر بگیرید و مشاهده کنید که یک ReplicaSet جدید با تمام به‌روزرسانی‌های جدید ظاهر می‌شود:
  ```shell
  kubectl rollout resume deployment/nginx-deployment
  ```

  خروجی مشابه این است:
  ```
  deployment.apps/nginx-deployment resumed
  ```
* {{< glossary_tooltip text="Watch" term_id="watch" >}} وضعیت انتشار را تا زمان اتمام آن نشان می‌دهد.
  ```shell
  kubectl get rs --watch
  ```

  خروجی مشابه این است:
  ```
  NAME               DESIRED   CURRENT   READY     AGE
  nginx-2142116321   2         2         2         2m
  nginx-3926361531   2         2         0         6s
  nginx-3926361531   2         2         1         18s
  nginx-2142116321   1         2         2         2m
  nginx-2142116321   1         2         2         2m
  nginx-3926361531   3         2         1         18s
  nginx-3926361531   3         2         1         18s
  nginx-2142116321   1         1         1         2m
  nginx-3926361531   3         3         1         18s
  nginx-3926361531   3         3         2         19s
  nginx-2142116321   0         1         1         2m
  nginx-2142116321   0         1         1         2m
  nginx-2142116321   0         0         0         2m
  nginx-3926361531   3         3         3         20s
  ```
* وضعیت آخرین انتشار را دریافت کنید:
  ```shell
  kubectl get rs
  ```

  خروجی مشابه این است:
  ```
  NAME               DESIRED   CURRENT   READY     AGE
  nginx-2142116321   0         0         0         2m
  nginx-3926361531   3         3         3         28s
  ```
{{< note >}}
شما نمی‌توانید یک استقرار متوقف‌شده را تا زمانی که آن را از سر نگیرید، به حالت اولیه برگردانید.
{{< /note >}}

## وضعیت استقرار

یک استقرار در طول چرخه حیات خود وارد حالت‌های مختلفی می‌شود. می‌تواند در حین راه‌اندازی یک ReplicaSet جدید، در حال [پیشرفت](#پیشرفت-استقرار) باشد، می‌تواند [کامل](#کامل-استقرار) باشد، یا می‌تواند [در پیشرفت ناموفق](#نارسایی-استقرار) باشد.

### استقرار در حال پیشرفت

کوبرنتیز زمانی یک استقرار را به عنوان در حال پیشرفت علامت‌گذاری می‌کند که یکی از وظایف زیر انجام شده باشد:

* استقرار یک ReplicaSet جدید ایجاد می‌کند.
* استقرار در حال افزایش مقیاس جدیدترین ReplicaSet خود است.
* استقرار در حال کاهش مقیاس ReplicaSet(های) قدیمی خود است.
* پادهای جدید آماده یا در دسترس می‌شوند (حداقل برای [MinReadySeconds](#min-ready-seconds) آماده هستند).

وقتی روند انتشار «در حال پیشرفت» می‌شود، کنترل‌کننده‌ی استقرار شرطی با ویژگی‌های زیر را به `.status.conditions` مربوط به استقرار اضافه می‌کند:

* `type: Progressing`
* `status: "True"`
* `reason: NewReplicaSetCreated` | `reason: FoundNewReplicaSet` | `reason: ReplicaSetUpdated`

شما می‌توانید با استفاده از `kubectl rollout status` پیشرفت یک استقرار را رصد کنید.

### استقرار کامل

کوبرنتیز زمانی یک استقرار را به عنوان _کامل_ علامت‌گذاری می‌کند که ویژگی‌های زیر را داشته باشد:

* تمام رونوشت های مرتبط با استقرار به آخرین نسخه‌ای که شما مشخص کرده‌اید به‌روزرسانی شده‌اند، به این معنی که هرگونه به‌روزرسانی که درخواست کرده‌اید، تکمیل شده است.
* تمام رونوشت های مرتبط با استقرار در دسترس هستند.
* هیچ رونوشت قدیمی برای استقرار در حال اجرا نیست.

وقتی که انتشار «کامل» می‌شود، کنترل‌کننده‌ی استقرار شرطی را با ویژگی‌های زیر برای `.status.conditions` مربوط به استقرار تنظیم می‌کند:

* `type: Progressing`
* `status: "True"`
* `reason: NewReplicaSetAvailable`

این وضعیت «در حال پیشرفت» تا زمانی که یک به‌روزرسانی جدید آغاز شود، مقدار وضعیت «درست» را حفظ خواهد کرد. این وضعیت حتی زمانی که در دسترس بودن نسخه‌های مشابه تغییر کند (که در عوض بر وضعیت «موجود» تأثیر می‌گذارد) نیز برقرار است.

می‌توانید با استفاده از `kubectl rollout status` بررسی کنید که آیا یک استقرار تکمیل شده است یا خیر. اگر عرضه با موفقیت تکمیل شود، `kubectl rollout status` کد خروج صفر را برمی‌گرداند.

```shell
kubectl rollout status deployment/nginx-deployment
```
خروجی مشابه این است:
```
Waiting for rollout to finish: 2 of 3 updated replicas are available...
deployment "nginx-deployment" successfully rolled out
```
و وضعیت خروج از `kubectl rollout` برابر با 0 (موفقیت) است:
```shell
echo $?
```
```
0
```

### استقرار ناموفق

ممکن است استقرار شما در تلاش برای استقرار جدیدترین ReplicaSet خود، بدون تکمیل، متوقف شود. این امر می‌تواند به دلیل برخی از عوامل زیر رخ دهد:

* سهمیه ناکافی
* خرابی‌های کاوشگر آمادگی
* خطاهای کشش image
* مجوزهای ناکافی
* محدوده‌های محدود
* پیکربندی نادرست مجری برنامه

یکی از راه‌های تشخیص این وضعیت، تعیین پارامتر مهلت در مشخصات استقرار است:
([`.spec.progressDeadlineSeconds`](#progress-deadline-seconds)). `.spec.progressDeadlineSeconds` تعداد ثانیه‌هایی را نشان می‌دهد که کنترل‌کننده‌ی استقرار قبل از اعلام (در وضعیت استقرار) مبنی بر توقف پیشرفت استقرار، منتظر می‌ماند.

دستور `kubectl` زیر، مشخصات را با `progressDeadlineSeconds` تنظیم می‌کند تا کنترکننده، عدم پیشرفت راه‌اندازی برای استقرار را پس از 10 دقیقه گزارش دهد:

```shell
kubectl patch deployment/nginx-deployment -p '{"spec":{"progressDeadlineSeconds":600}}'
```
خروجی مشابه این است:
```
deployment.apps/nginx-deployment patched
```
زمانی که مهلت مقرر به پایان برسد، کنترل‌کننده‌ی استقرار یک شرایط استقرار با ویژگی‌های زیر به `.status.conditions` از استقرار اضافه می‌کند:

* `type: Progressing`
* `status: "False"`
* `reason: ProgressDeadlineExceeded`

این شرط همچنین می‌تواند در مراحل اولیه با شکست مواجه شود و سپس به دلایلی مانند `ReplicaSetCreateError` روی مقدار وضعیت `"False"` تنظیم شود. همچنین، پس از اتمام مرحله استقرار، مهلت دیگر در نظر گرفته نمی‌شود.

برای اطلاعات بیشتر در مورد شرایط وضعیت، به [قراردادهای API کوبرنتیز](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#typical-status-properties) مراجعه کنید.

{{< note >}}
کوبرنتیز هیچ اقدامی در مورد استقرار متوقف‌شده انجام نمی‌دهد، جز اینکه وضعیت را با «دلیل: ProgressDeadlineExceeded» گزارش می‌دهد. هماهنگ‌کنندگان سطح بالاتر می‌توانند از این موضوع سوءاستفاده کرده و بر اساس آن عمل کنند، برای مثال، استقرار را به نسخه قبلی خود برگردانند.
{{< /note >}}

{{< note >}}
اگر اجرای استقرار را متوقف کنید، کوبرنتیز پیشرفت را در مقایسه با مهلت تعیین‌شده شما بررسی نمی‌کند. می‌توانید با خیال راحت اجرای استقرار را در وسط یک اجرا متوقف کنید و بدون ایجاد شرایط برای عبور از مهلت، آن را از سر بگیرید.
{{< /note >}}

ممکن است در استقرارهای خود با خطاهای گذرا مواجه شوید، چه به دلیل زمان انقضای کمی که تنظیم کرده‌اید و چه به دلیل هر نوع خطای دیگری که بتوان آن را گذرا در نظر گرفت. برای مثال، فرض کنید سهمیه کافی ندارید. اگر استقرار را شرح دهید، متوجه بخش زیر خواهید شد:

```shell
kubectl describe deployment nginx-deployment
```
خروجی مشابه این است:
```
<...>
Conditions:
  Type            Status  Reason
  ----            ------  ------
  Available       True    MinimumReplicasAvailable
  Progressing     True    ReplicaSetUpdated
  ReplicaFailure  True    FailedCreate
<...>
```

اگر دستور `kubectl get deployment nginx-deployment -o yaml` را اجرا کنید، وضعیت استقرار مشابه این خواهد بود:

```
status:
  availableReplicas: 2
  conditions:
  - lastTransitionTime: 2016-10-04T12:25:39Z
    lastUpdateTime: 2016-10-04T12:25:39Z
    message: Replica set "nginx-deployment-4262182780" is progressing.
    reason: ReplicaSetUpdated
    status: "True"
    type: Progressing
  - lastTransitionTime: 2016-10-04T12:25:42Z
    lastUpdateTime: 2016-10-04T12:25:42Z
    message: Deployment has minimum availability.
    reason: MinimumReplicasAvailable
    status: "True"
    type: Available
  - lastTransitionTime: 2016-10-04T12:25:39Z
    lastUpdateTime: 2016-10-04T12:25:39Z
    message: 'Error creating: pods "nginx-deployment-4262182780-" is forbidden: exceeded quota:
      object-counts, requested: pods=1, used: pods=3, limited: pods=2'
    reason: FailedCreate
    status: "True"
    type: ReplicaFailure
  observedGeneration: 3
  replicas: 2
  unavailableReplicas: 2
```

در نهایت، به محض اینکه مهلت پیشرفت استقرار به پایان برسد، کوبرنتیز وضعیت و دلیل وضعیت در حال پیشرفت را به‌روزرسانی می‌کند:

```
Conditions:
  Type            Status  Reason
  ----            ------  ------
  Available       True    MinimumReplicasAvailable
  Progressing     False   ProgressDeadlineExceeded
  ReplicaFailure  True    FailedCreate
```

شما می‌توانید با کاهش مقیاس استقرار خود، کاهش مقیاس سایر کنترکننده هایی که ممکن است در حال اجرا داشته باشید، یا با افزایش سهمیه در فضای نام خود، مشکل سهمیه ناکافی را برطرف کنید. اگر شرایط سهمیه را برآورده کنید و کنترکننده استقرار سپس روند استقرار را تکمیل کند، به‌روزرسانی وضعیت استقرار را با یک شرط موفقیت‌آمیز (`status: "True"` و `reason: NewReplicaSetAvailable`) مشاهده خواهید کرد.

```
Conditions:
  Type          Status  Reason
  ----          ------  ------
  Available     True    MinimumReplicasAvailable
  Progressing   True    NewReplicaSetAvailable
```

`type: Available` به همراه `status: "True"` به این معنی است که استقرار شما حداقل دسترسی را دارد. حداقل دسترسی توسط پارامترهای مشخص شده در استراتژی استقرار تعیین می‌شود. `type: Progressing` به همراه `status: "True"` به این معنی است که استقرار شما یا در حال اجرا است و در حال پیشرفت است یا اینکه پیشرفت خود را با موفقیت به پایان رسانده و حداقل کپی‌های جدید مورد نیاز در دسترس هستند (برای جزئیات به دلیل شرط مراجعه کنید - در مورد ما `reason: NewReplicaSetAvailable` به این معنی است که استقرار کامل شده است).

می‌توانید با استفاده از `kubectl rollout status` بررسی کنید که آیا پیشرفت استقرار با شکست مواجه شده است یا خیر. `kubectl rollout status` در صورتی که استقرار از مهلت پیشرفت خود فراتر رفته باشد، یک کد خروج غیر صفر برمی‌گرداند.

```shell
kubectl rollout status deployment/nginx-deployment
```
خروجی مشابه این است:
```
Waiting for rollout to finish: 2 out of 3 new replicas have been updated...
error: deployment "nginx" exceeded its progress deadline
```
و وضعیت خروج از `kubectl rollout` 1 است (که نشان دهنده یک خطا است):
```shell
echo $?
```
```
1
```

### عملیات در یک استقرار ناموفق

تمام اقداماتی که برای یک استقرار کامل اعمال می‌شوند، برای یک استقرار ناموفق نیز اعمال می‌شوند. می‌توانید مقیاس آن را افزایش/کاهش دهید، به نسخه قبلی برگردید یا حتی در صورت نیاز به اعمال چندین تغییر در الگوی استقرار پاد، آن را متوقف کنید.

## سیاست پاکسازی

شما می‌توانید بخش `.spec.revisionHistoryLimit` را در یک استقرار تنظیم کنید تا مشخص کنید که می‌خواهید چند ReplicaSet قدیمی برای این استقرار حفظ شود. بقیه در پس‌زمینه جمع‌آوری زباله می‌شوند. به طور پیش‌فرض، این مقدار 10 است.

{{< note >}}
تنظیم صریح این بخش روی ۰، منجر به پاک شدن تمام تاریخچه استقرار شما می‌شود، بنابراین استقرار قادر به بازگشت به حالت قبل نخواهد بود.
{{< /note >}}

پاکسازی فقط **پس از** رسیدن یک استقرار به وضعیت [کامل](/docs/concepts/workloads/controllers/deployment/#complete-deployment) شروع می‌شود. اگر `.spec.revisionHistoryLimit` را روی 0 تنظیم کنید، با این وجود هرگونه انتشار، قبل از اینکه کوبرنتیز نسخه قدیمی را حذف کند، باعث ایجاد یک ReplicaSet جدید می‌شود.

حتی با محدودیت تاریخچه‌ی ویرایش غیر صفر، می‌توانید ReplicaSets بیشتری نسبت به محدودیتی که پیکربندی می‌کنید، داشته باشید. برای مثال، اگر پادها در حال تکرار مداوم خرابی باشند و چندین رویداد به‌روزرسانی مداوم در طول زمان فعال شوند، ممکن است در نهایت ReplicaSets بیشتری نسبت به `.spec.revisionHistoryLimit` داشته باشید، زیرا استقرار هرگز به حالت کامل نمی‌رسد.

## استقرار قناری

اگر می‌خواهید نسخه‌ها را با استفاده از استقرار به زیرمجموعه‌ای از کاربران یا سرورها منتشر کنید، می‌توانید چندین استقرار ایجاد کنید، یکی برای هر نسخه، با پیروی از الگوی Canary که در [مدیریت منابع](/docs/concepts/workloads/management/#canary-deployments) توضیح داده شده است.

## نوشتن مشخصات استقرار

همانند سایر پیکربندی‌های کوبرنتیز، یک استقرار به بخش های `.apiVersion`، `.kind` و `.metadata` نیاز دارد. برای اطلاعات کلی در مورد کار با فایل‌های پیکربندی، به اسناد [استقرار برنامه‌ها](/docs/tasks/run-application/run-stateless-application-deployment/)، پیکربندی کانتینرها و [استفاده از kubectl برای مدیریت منابع](/docs/concepts/overview/working-with-objects/object-management/) مراجعه کنید.

وقتی صفحه کنترل، پادهای جدیدی برای یک استقرار ایجاد می‌کند، `.metadata.name` از استقرار بخشی از مبنای نامگذاری آن پادها است. نام یک استقرار باید یک مقدار معتبر باشد، اما این می‌تواند نتایج غیرمنتظره‌ای برای نام‌های میزبان پاد ایجاد کند. برای بهترین سازگاری، نام باید از قوانین محدودکننده‌تر برای یک `[DNS label](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)` پیروی کند.

یک استقرار همچنین به یک بخش [`.spec`](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status) نیاز دارد.

### قالب پاد

«.spec.template» و «.spec.selector» تنها بخش های الزامیِ «.spec» هستند.

`.spec.template` یک [الگوی پاد](/docs/concepts/workloads/pods/#pod-templates) است. این الگو دقیقاً همان طرحواره {{< glossary_tooltip text="Pod" term_id="pod" >}} را دارد، با این تفاوت که تودرتو است و `apiVersion` یا `kind` ندارد.

علاوه بر بخش های مورد نیاز برای یک پاد، یک الگوی پاد در یک استقرار باید برچسب‌های مناسب و یک سیاست راه‌اندازی مجدد مناسب را مشخص کند. برای برچسب‌ها، مطمئن شوید که با سایر کنترل‌کننده‌ها همپوشانی ندارند. به [انتخابگر](#selector) مراجعه کنید.

فقط یک [`.spec.template.spec.restartPolicy`](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy) برابر با `Always` مجاز است، که اگر مشخص نشده باشد، پیش‌فرض است.

### رونوشت ها

`.spec.replicas` یک بخش اختیاری است که تعداد پاد های مورد نظر را مشخص می کند. به طور پیش فرض روی ۱ است.

اگر شما به صورت دستی یک استقرار را مقیاس‌بندی کنید، مثلاً از طریق `kubectl scale deployment deployment --replicas=X`، و سپس آن استقرار را بر اساس یک تنظیمات به‌روزرسانی کنید (برای مثال: با اجرای `kubectl apply -f deployment.yaml`)، اعمال آن تنظیمات، مقیاس‌بندی دستی که قبلاً انجام داده‌اید را بازنویسی می‌کند.

اگر یک [مقیاس‌کننده خودکار پاد افقی](/docs/tasks/run-application/horizontal-pod-autoscale/) (یا هر API مشابه برای مقیاس‌بندی افقی) در حال مدیریت مقیاس‌بندی برای یک استقرار است، `.spec.replicas` را تنظیم نکنید.

در عوض، به کوبرنتیز اجازه دهید تا بخش `.spec.replicas` را به طور خودکار مدیریت کند.

### انتخابگر

`.spec.selector` یک بخش الزامی است که یک [انتخابگر برچسب](/docs/concepts/overview/working-with-objects/labels/) را برای پادهایی که توسط این استقرار هدف قرار می‌گیرند، مشخص می‌کند.

`.spec.selector` باید با `.spec.template.metadata.labels` مطابقت داشته باشد، در غیر این صورت توسط API رد خواهد شد.

در نسخه API `apps/v1`، `.spec.selector` و `.metadata.labels` در صورت تنظیم نشدن، به صورت پیش‌فرض روی `.spec.template.metadata.labels` تنظیم نمی‌شوند. بنابراین باید صریحاً تنظیم شوند. همچنین توجه داشته باشید که `.spec.selector` پس از ایجاد استقرار در `apps/v1` تغییرناپذیر است.

یک استقرار ممکن است پادهایی را که برچسب‌هایشان با انتخابگر مطابقت دارد، در صورتی که الگوی آنها با `.spec.template` متفاوت باشد یا اگر تعداد کل چنین پادهایی از `.spec.replicas` بیشتر شود، خاتمه دهد. اگر تعداد پادها کمتر از تعداد مورد نظر باشد، پادهای جدیدی با `.spec.template` ایجاد می‌کند.

{{< note >}}
شما نباید پادهای دیگری که برچسب آنها با این انتخابگر مطابقت دارد، چه مستقیماً، چه با ایجاد یک استقرار دیگر، و چه با ایجاد یک کنترل کننده دیگر مانند ReplicaSet یا ReplicationController، ایجاد کنید. اگر این کار را انجام دهید، استقرار اول فکر می‌کند که این پادهای دیگر را ایجاد کرده است. کوبرنتیز مانع انجام این کار نمی‌شود.
{{< /note >}}

اگر چندین کنترل کننده داشته باشید که انتخابگرهایشان با هم تداخل داشته باشد، کنترل کننده ها با یکدیگر درگیر می‌شوند و به درستی رفتار نخواهند کرد.

### راهبرد

`.spec.strategy` راهبرد مورد استفاده برای جایگزینی پادهای قدیمی با پادهای جدید را مشخص می‌کند.
مقدار `.spec.strategy.type` می‌تواند "Recreate" یا "RollingUpdate" باشد. "RollingUpdate" مقدار پیش‌فرض است.

#### بازسازی استقرار

قبل از اینکه پادهای جدید ایجاد شوند، تمام پادهای موجود از بین می‌روند. این اتفاق زمانی می‌افتد که دستور `.spec.strategy.type==Recreate` اجرا شود.

{{< note >}}
این فقط خاتمه پاد قبل از ایجاد برای ارتقاء را تضمین می‌کند. اگر یک استقرار را ارتقا دهید، تمام پادهای نسخه قدیمی بلافاصله خاتمه می‌یابند. قبل از ایجاد هر پاد از نسخه جدید، حذف موفقیت‌آمیز انتظار می‌رود. اگر یک پاد را به صورت دستی حذف کنید، چرخه حیات توسط ReplicaSet کنترل می‌شود و جایگزینی بلافاصله ایجاد می‌شود (حتی اگر پاد قدیمی هنوز در حالت خاتمه باشد). اگر به یک تضمین "حداکثر" برای پادهای خود نیاز دارید، باید استفاده از یک [StatefulSet](/docs/concepts/workloads/controllers/statefulset/) را در نظر بگیرید.
{{< /note >}}

#### استقرار به‌روزرسانی مداوم

استقرار، پادها را به صورت به‌روزرسانی مداوم، زمانی که `.spec.strategy.type==RollingUpdate`` باشد، به‌روزرسانی می‌کند. می‌توانید `maxUnavailable` و `maxSurge` را برای کنترل فرآیند به‌روزرسانی مداوم تعیین کنید.

##### حداکثر در دسترس نبودن

`.spec.strategy.rollingUpdate.maxUnavailable` یک بخش اختیاری است که حداکثر تعداد پادهایی را که می‌توانند در طول فرآیند به‌روزرسانی در دسترس نباشند، مشخص می‌کند. مقدار می‌تواند یک عدد مطلق (مثلاً ۵) یا درصد پادهای مورد نظر (مثلاً ۱۰٪) باشد. عدد مطلق با گرد کردن به پایین از درصد محاسبه می‌شود. اگر `.spec.strategy.rollingUpdate.maxSurge` برابر با ۰ باشد، مقدار نمی‌تواند ۰ باشد. مقدار پیش‌فرض ۲۵٪ است.

برای مثال، وقتی این مقدار روی ۳۰٪ تنظیم شود، ReplicaSet قدیمی می‌تواند بلافاصله پس از شروع به‌روزرسانی، تا ۷۰٪ از پادهای مورد نظر کوچک شود. پس از آماده شدن پادهای جدید، ReplicaSet قدیمی می‌تواند بیشتر کوچک شود و سپس ReplicaSet جدید بزرگ شود و اطمینان حاصل شود که تعداد کل پادهای موجود در تمام مدت به‌روزرسانی حداقل ۷۰٪ از پادهای مورد نظر باشد.

##### حداکثر افزایش

`.spec.strategy.rollingUpdate.maxSurge` یک بخش اختیاری است که حداکثر تعداد پادهایی را که می‌توان ایجاد کرد، نسبت به تعداد پادهای مورد نظر، مشخص می‌کند. مقدار می‌تواند یک عدد مطلق (مثلاً ۵) یا درصد پادهای مورد نظر (مثلاً ۱۰٪) باشد. اگر `MaxUnavailable` برابر با ۰ باشد، مقدار نمی‌تواند ۰ باشد. عدد مطلق از درصد با گرد کردن به بالا محاسبه می‌شود. مقدار پیش‌فرض ۲۵٪ است.

برای مثال، وقتی این مقدار روی ۳۰٪ تنظیم شود، ReplicaSet جدید می‌تواند بلافاصله پس از شروع به‌روزرسانی، افزایش مقیاس یابد، به طوری که تعداد کل پادهای قدیمی و جدید از ۱۳۰٪ پادهای مورد نظر تجاوز نکند. پس از حذف پادهای قدیمی، ReplicaSet جدید می‌تواند بیشتر افزایش مقیاس یابد و اطمینان حاصل شود که تعداد کل پادهای در حال اجرا در هر زمان در طول به‌روزرسانی حداکثر ۱۳۰٪ پادهای مورد نظر باشد.

در اینجا چند نمونه از استقرار به روزرسانی مداوم که از `maxUnavailable` و `maxSurge` استفاده می‌کنند، آورده شده است:

{{< tabs name="tab_with_md" >}}
{{% tab name="Max Unavailable" %}}

 ```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1
 ```

{{% /tab %}}
{{% tab name="Max Surge" %}}

 ```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
 ```

{{% /tab %}}
{{% tab name="Hybrid" %}}

 ```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 1
 ```

{{% /tab %}}
{{< /tabs >}}

### مهلت پیشرفت (بر حسب ثانیه)

`.spec.progressDeadlineSeconds` یک بخش اختیاری است که تعداد ثانیه‌هایی را که می‌خواهید برای پیشرفت استقرار خود منتظر بمانید، مشخص می‌کند تا سیستم گزارش دهد که استقرار به عنوان یک شرط با `type: Progressing`، `status: "False"` و `reason: ProgressDeadlineExceeded` در وضعیت منبع ظاهر شده است. کنترل‌کننده استقرار به تلاش مجدد برای استقرار ادامه خواهد داد. این مقدار پیش‌فرض ۶۰۰ است. در آینده، پس از پیاده‌سازی عقبگرد خودکار، کنترل‌کننده استقرار به محض مشاهده چنین شرطی، استقرار را عقبگرد می‌کند.

در صورت مشخص شدن، این بخش باید بزرگتر از `.spec.minReadySeconds` باشد.

### حداقل زمان آماده بودن (به ثانیه)

`.spec.minReadySeconds` یک بخش اختیاری است که حداقل تعداد ثانیه‌هایی را مشخص می‌کند که یک پاد تازه ایجاد شده باید بدون از کار افتادن هیچ یک از کانتینرهایش آماده باشد تا در دسترس در نظر گرفته شود. این مقدار پیش‌فرض 0 است (پاد به محض آماده شدن، در دسترس در نظر گرفته می‌شود). برای کسب اطلاعات بیشتر در مورد زمان آماده در نظر گرفته شدن یک پاد، به [کاوشگر کانتینر](/docs/concepts/workloads/pods/pod-lifecycle/#container-probes) مراجعه کنید.

### پادهای درحال خاتمه

{{< feature-state feature_gate_name="DeploymentReplicaSetTerminatingReplicas" >}}

شما می‌توانید این ویژگی را با تنظیم `DeploymentReplicaSetTerminatingReplicas` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) در [API server](/docs/reference/command-line-tools-reference/kube-apiserver/) و در [kube-controller-manager](/docs/reference/command-line-tools-reference/kube-controller-manager/) فعال کنید.

پادهایی که به دلیل حذف یا کاهش مقیاس، خاتمه می‌یابند، ممکن است مدت زیادی طول بکشد تا خاتمه یابند و ممکن است در طول آن دوره منابع اضافی مصرف کنند. در نتیجه، تعداد کل پادها می‌تواند به طور موقت از `.spec.replicas` تجاوز کند. پادهای خاتمه یافته را می‌توان با استفاده از فیلد `.status.terminatingReplicas` در استقرار ردیابی کرد.

### محدودیت تاریخچه اصلاح

تاریخچه‌ی اصلاح‌های یک استقرار در ReplicaSets که آن را کنترل می‌کند، ذخیره می‌شود.

`.spec.revisionHistoryLimit` یک بخش اختیاری است که تعداد ReplicaSet های قدیمی را که باید حفظ شوند تا امکان بازگشت به عقب فراهم شود، مشخص می‌کند. این ReplicaSet های قدیمی منابع را در `etcd` مصرف می‌کنند و خروجی `kubectl get rs` را شلوغ می‌کنند. پیکربندی هر نسخه استقرار در ReplicaSet های آن ذخیره می‌شود. بنابراین، هنگامی که یک ReplicaSet قدیمی حذف می‌شود، شما توانایی بازگشت به آن نسخه استقرار را از دست می‌دهید. به طور پیش‌فرض، 10 ReplicaSet قدیمی نگه داشته می‌شوند، اما مقدار ایده‌آل آن به فرکانس و پایداری استقرارهای جدید بستگی دارد.

به طور خاص، تنظیم این بخش روی صفر به این معنی است که تمام ReplicaSet های قدیمی با 0 رونوشت پاک می‌شوند. در این حالت، یک عرضه جدید استقرار قابل لغو نیست، زیرا تاریخچه اصلاح های آن پاک می‌شود.

### متوقف شده

`.spec.paused` یک بخش بولی اختیاری برای توقف و از سرگیری یک استقرار است. تنها تفاوت بین یک استقرار متوقف شده و یک استقرار متوقف نشده این است که هرگونه تغییر در PodTemplateSpec از استقرار متوقف شده، تا زمانی که متوقف شده باشد، باعث راه‌اندازی‌های جدید نمی‌شود. یک استقرار هنگام ایجاد، به طور پیش‌فرض متوقف نمی‌شود.

## {{% heading "whatsnext" %}}

* درباره [پادها](/docs/concepts/workloads/pods) بیشتر بدانید.
* [اجرای یک برنامه بدون وضعیت با استفاده از استقرار](/docs/tasks/run-application/run-stateless-application-deployment/).
* برای درک API مربوط به استقرار، {{< api-reference page="workload-resources/deployment-v1" >}} را مطالعه کنید.
* درباره [PodDisruptionBudget](/docs/concepts/workloads/pods/disruptions/) و نحوه استفاده از آن برای مدیریت دسترسی به برنامه‌ها در هنگام اختلالات، مطالعه کنید.
* از kubectl برای [ایجاد یک استقرار](/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/) استفاده کنید.
