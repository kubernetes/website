---
reviewers:
#- janetkuo
title: استقرارها (Deployments)
api_metadata:
- apiVersion: "apps/v1"
  kind: "Deployment"
feature:
  title: rollout و rollback خودکار
  description: >
    کوبرنتیز تغییرات را به‌صورت تدریجی روی اپلیکیشن شما یا پیکربندی آن اعمال می‌کند، در حالی که سلامت اپلیکیشن را زیر نظر دارد تا مطمئن شود همه‌ی نمونه‌ها را همزمان از بین نمی‌برد. اگر مشکلی پیش بیاید، کوبرنتیز تغییر را برای شما rollback می‌کند. از یک اکوسیستم رو‌به‌رشد از راهکارهای deployment بهره ببرید.
description: >-
  یک Deployment مجموعه‌ای از پادها را برای اجرای یک workload اپلیکیشن مدیریت می‌کند، معمولاً workloadی که وضعیتی (state) را نگه نمی‌دارد.
content_type: concept
weight: 10
hide_summary: true # Listed separately in section index
---

<!-- overview -->

یک _Deployment_ به‌روزرسانی‌های declarative را برای {{< glossary_tooltip text="پادها" term_id="pod" >}} و
{{< glossary_tooltip term_id="replica-set" text="ReplicaSetها" >}} فراهم می‌کند.

شما یک _وضعیت مطلوب_ (desired state) را در یک Deployment توصیف می‌کنید، و {{< glossary_tooltip term_id="controller" >}} مربوط به Deployment وضعیت واقعی را با سرعتی کنترل‌شده به وضعیت مطلوب تغییر می‌دهد. می‌توانید Deploymentها را طوری تعریف کنید که ReplicaSetهای جدید ایجاد کنند، یا Deploymentهای موجود را حذف کرده و همه‌ی منابع آن‌ها را با Deploymentهای جدید به دست بگیرند (adopt).

{{< note >}}
ReplicaSetهایی که متعلق به یک Deployment هستند را مدیریت نکنید. اگر use case شما در ادامه پوشش داده نشده، باز کردن یک issue در مخزن اصلی کوبرنتیز را در نظر بگیرید.
{{< /note >}}

<!-- body -->

## موارد استفاده

موارد استفاده‌ی معمول برای Deploymentها عبارت‌اند از:

* [ایجاد یک Deployment برای rollout کردن یک ReplicaSet](#creating-a-deployment). ReplicaSet در پس‌زمینه پادها را ایجاد می‌کند. وضعیت rollout را بررسی کنید تا ببینید موفق بوده یا نه.
* [اعلام وضعیت جدید پادها](#updating-a-deployment) با به‌روزرسانی PodTemplateSpec مربوط به Deployment. یک ReplicaSet جدید ایجاد می‌شود، و Deployment به‌تدریج آن را scale up می‌کند در حالی که ReplicaSet قدیمی را scale down می‌کند، و اطمینان می‌دهد که Podها با سرعتی کنترل‌شده جایگزین می‌شوند. هر ReplicaSet جدید نسخه (revision) Deployment را به‌روز می‌کند.
* [بازگشت به یک revision قدیمی‌تر از Deployment](#rolling-back-a-deployment) اگر وضعیت فعلی Deployment پایدار نباشد. هر rollback نسخه‌ی Deployment را به‌روز می‌کند.
* [افزایش مقیاس (scale up) Deployment](#scaling-a-deployment) برای تحمل بار بیشتر.
* [متوقف کردن (pause) rollout یک Deployment](#pausing-and-resuming-a-deployment) برای اعمال چندین تغییر روی PodTemplateSpec آن و سپس از سرگیری آن برای شروع یک rollout جدید.
* [استفاده از وضعیت (status) Deployment](#deployment-status) به‌عنوان نشانه‌ای از گیر کردن (stuck) یک rollout.
* [پاکسازی ReplicaSetهای قدیمی‌تر](#clean-up-policy) که دیگر به آن‌ها نیازی ندارید.

## ایجاد یک Deployment

در ادامه نمونه‌ای از یک Deployment آمده است. این Deployment یک ReplicaSet ایجاد می‌کند تا سه پاد از نوع `nginx` را بالا بیاورد:

{{% code_sample file="controllers/nginx-deployment.yaml" %}}

در این مثال:

* یک Deployment با نام `nginx-deployment` ایجاد می‌شود، که با فیلد
  `.metadata.name` مشخص شده است. این نام مبنایی خواهد بود برای ReplicaSetها
  و پادهایی که بعداً ایجاد می‌شوند. برای جزئیات بیشتر به [نوشتن یک Deployment Spec](#writing-a-deployment-spec)
  مراجعه کنید.
* Deployment یک ReplicaSet ایجاد می‌کند که سه پاد تکراری (replicated) می‌سازد، که با فیلد `.spec.replicas` مشخص شده است.
* فیلد `.spec.selector` تعیین می‌کند که ReplicaSet ایجادشده چگونه پادهایی را که باید مدیریت کند پیدا کند.
  در این مورد، شما لیبلی را انتخاب می‌کنید که در template مربوط به پاد تعریف شده (`app: nginx`).
  با این حال، قواعد پیچیده‌تری برای انتخاب هم ممکن است،
  تا زمانی که خود template مربوط به پاد آن قاعده را برآورده کند.

  {{< note >}}
  فیلد `.spec.selector.matchLabels` نگاشتی از جفت‌های {key,value} است.
  یک جفت {key,value} در نگاشت `matchLabels` معادل یک عنصر از `matchExpressions` است،
  که فیلد `key` آن "key"، عملگر (operator) آن "In" است، و آرایه‌ی `values` آن فقط شامل "value" است.
  همه‌ی شرط‌ها، چه از `matchLabels` و چه از `matchExpressions`، باید برآورده شوند تا تطبیق صورت گیرد.
  {{< /note >}}

* فیلد `.spec.template` شامل زیرفیلدهای زیر است:
  * پادها با استفاده از فیلد `.metadata.labels` با لیبل `app: nginx` مشخص می‌شوند.
  * مشخصات (specification) مربوط به template پاد، یا فیلد `.spec`، نشان می‌دهد که
    پادها یک کانتینر به نام `nginx` اجرا می‌کنند، که ایمیج `nginx` را از
    [Docker Hub](https://hub.docker.com/) با نسخه‌ی 1.14.2 اجرا می‌کند.
  * با استفاده از فیلد `.spec.containers[0].name` یک کانتینر ایجاد کرده و آن را `nginx` نام‌گذاری کنید.

پیش از شروع، مطمئن شوید که کلاستر کوبرنتیز شما بالا آمده و در حال اجرا است.
برای ایجاد Deployment بالا، مراحل زیر را دنبال کنید:

1. Deployment را با اجرای دستور زیر ایجاد کنید:

   ```shell
   kubectl apply -f https://k8s.io/examples/controllers/nginx-deployment.yaml
   ```

2. برای بررسی این‌که آیا Deployment ایجاد شده یا نه، `kubectl get deployments` را اجرا کنید.

   اگر Deployment هنوز در حال ایجاد شدن باشد، خروجی چیزی شبیه به این خواهد بود:
   ```
   NAME               READY   UP-TO-DATE   AVAILABLE   AGE
   nginx-deployment   0/3     0            0           1s
   ```
   وقتی Deploymentهای موجود در کلاستر خود را بررسی می‌کنید، فیلدهای زیر نمایش داده می‌شوند:
   * `NAME` نام Deploymentهای موجود در namespace را فهرست می‌کند.
   * `READY` نشان می‌دهد چند replica از اپلیکیشن برای کاربران شما در دسترس است. الگوی آن ready/desired است.
   * `UP-TO-DATE` تعداد replicaهایی را نشان می‌دهد که برای رسیدن به وضعیت مطلوب به‌روزرسانی شده‌اند.
   * `AVAILABLE` نشان می‌دهد چند replica از اپلیکیشن برای کاربران شما در دسترس است.
   * `AGE` مدت‌زمانی را نشان می‌دهد که اپلیکیشن در حال اجرا بوده است.

   توجه کنید که تعداد replicaهای مطلوب، طبق فیلد `.spec.replicas`، برابر با 3 است.

3. برای دیدن وضعیت rollout مربوط به Deployment، `kubectl rollout status deployment/nginx-deployment` را اجرا کنید.

   خروجی چیزی شبیه به این است:
   ```
   Waiting for rollout to finish: 2 out of 3 new replicas have been updated...
   deployment "nginx-deployment" successfully rolled out
   ```

4. چند ثانیه بعد دوباره `kubectl get deployments` را اجرا کنید.
   خروجی چیزی شبیه به این است:
   ```
   NAME               READY   UP-TO-DATE   AVAILABLE   AGE
   nginx-deployment   3/3     3            3           18s
   ```
   توجه کنید که Deployment هر سه replica را ایجاد کرده، و همه‌ی replicaها به‌روز (آخرین نسخه‌ی template مربوط به پاد را دارند) و در دسترس هستند.

5. برای دیدن ReplicaSet (`rs`) ایجادشده توسط Deployment، `kubectl get rs` را اجرا کنید. خروجی چیزی شبیه به این است:
   ```
   NAME                          DESIRED   CURRENT   READY   AGE
   nginx-deployment-75675f5897   3         3         3       18s
   ```
   خروجی ReplicaSet فیلدهای زیر را نشان می‌دهد:

   * `NAME` نام ReplicaSetهای موجود در namespace را فهرست می‌کند.
   * `DESIRED` تعداد مطلوب _replicaها_ از اپلیکیشن را نشان می‌دهد، که شما هنگام ایجاد Deployment آن را تعریف می‌کنید. این همان _وضعیت مطلوب_ است.
   * `CURRENT` نشان می‌دهد در حال حاضر چند replica در حال اجراست.
   * `READY` نشان می‌دهد چند replica از اپلیکیشن برای کاربران شما در دسترس است.
   * `AGE` مدت‌زمانی را نشان می‌دهد که اپلیکیشن در حال اجرا بوده است.

   توجه کنید که نام ReplicaSet همیشه به شکل
   `[DEPLOYMENT-NAME]-[HASH]` قالب‌بندی می‌شود. این نام مبنایی خواهد بود برای پادهایی
   که ایجاد می‌شوند.

   رشته‌ی `HASH` همان لیبل `pod-template-hash` روی ReplicaSet است.

6. برای دیدن لیبل‌هایی که به‌صورت خودکار برای هر پاد تولید شده‌اند، `kubectl get pods --show-labels` را اجرا کنید.
   خروجی چیزی شبیه به این است:
   ```
   NAME                                READY     STATUS    RESTARTS   AGE       LABELS
   nginx-deployment-75675f5897-7ci7o   1/1       Running   0          18s       app=nginx,pod-template-hash=75675f5897
   nginx-deployment-75675f5897-kzszj   1/1       Running   0          18s       app=nginx,pod-template-hash=75675f5897
   nginx-deployment-75675f5897-qqcnn   1/1       Running   0          18s       app=nginx,pod-template-hash=75675f5897
   ```
   ReplicaSet ایجادشده تضمین می‌کند که سه پاد از نوع `nginx` وجود داشته باشد.

{{< note >}}
باید یک selector و لیبل‌های مناسب برای template پاد را در یک Deployment مشخص کنید
(در این مورد، `app: nginx`).

لیبل‌ها یا selectorها را با کنترلرهای دیگر (شامل Deploymentها و StatefulSetهای دیگر) هم‌پوشانی ندهید. کوبرنتیز شما را از هم‌پوشانی منع نمی‌کند، و اگر چندین کنترلر selectorهای هم‌پوشان داشته باشند، آن کنترلرها ممکن است دچار تداخل شوند و رفتار غیرمنتظره‌ای داشته باشند.
{{< /note >}}

### لیبل pod-template-hash

{{< caution >}}
این لیبل را تغییر ندهید.
{{< /caution >}}

لیبل `pod-template-hash` توسط کنترلر Deployment به هر ReplicaSetی که یک Deployment ایجاد می‌کند یا به دست می‌گیرد (adopt) اضافه می‌شود.

این لیبل تضمین می‌کند که ReplicaSetهای فرزند یک Deployment با هم هم‌پوشانی نداشته باشند. این لیبل با هش کردن `PodTemplate` مربوط به ReplicaSet تولید می‌شود، و از هش حاصل به‌عنوان مقدار لیبلی استفاده می‌شود که به selector مربوط به ReplicaSet، لیبل‌های template پاد،
و هر پاد موجودی که آن ReplicaSet ممکن است داشته باشد اضافه می‌شود.

## به‌روزرسانی یک Deployment

{{< note >}}
یک rollout مربوط به Deployment تنها و تنها زمانی فعال می‌شود که template پاد مربوط به Deployment (یعنی `.spec.template`)
تغییر کند، برای مثال اگر لیبل‌ها یا ایمیج‌های کانتینرهای template به‌روزرسانی شوند. سایر به‌روزرسانی‌ها، مانند scale کردن Deployment، rollout را فعال نمی‌کنند.
{{< /note >}}

برای به‌روزرسانی Deployment خود مراحل زیر را دنبال کنید:

1. بیایید پادهای nginx را طوری به‌روزرسانی کنیم که به‌جای ایمیج `nginx:1.14.2` از ایمیج `nginx:1.16.1` استفاده کنند.

   ```shell
   kubectl set image deployment.v1.apps/nginx-deployment nginx=nginx:1.16.1
   ```

   یا از دستور زیر استفاده کنید:

   ```shell
   kubectl set image deployment/nginx-deployment nginx=nginx:1.16.1
   ```
   که در آن `deployment/nginx-deployment` نشان‌دهنده‌ی Deployment است،
   `nginx` نشان‌دهنده‌ی کانتینری است که به‌روزرسانی روی آن انجام می‌شود و
   `nginx:1.16.1` نشان‌دهنده‌ی ایمیج جدید و تگ آن است.


   خروجی چیزی شبیه به این است:

   ```
   deployment.apps/nginx-deployment image updated
   ```

   به‌عنوان جایگزین، می‌توانید Deployment را `edit` کنید و `.spec.template.spec.containers[0].image` را از `nginx:1.14.2` به `nginx:1.16.1` تغییر دهید:

   ```shell
   kubectl edit deployment/nginx-deployment
   ```

   خروجی چیزی شبیه به این است:

   ```
   deployment.apps/nginx-deployment edited
   ```

2. برای دیدن وضعیت rollout، این دستور را اجرا کنید:

   ```shell
   kubectl rollout status deployment/nginx-deployment
   ```

   خروجی چیزی شبیه به این است:

   ```
   Waiting for rollout to finish: 2 out of 3 new replicas have been updated...
   ```

   یا

   ```
   deployment "nginx-deployment" successfully rolled out
   ```

جزئیات بیشتری از Deployment به‌روزرسانی‌شده‌ی خود به دست بیاورید:

* پس از موفقیت rollout، می‌توانید با اجرای `kubectl get deployments` این Deployment را مشاهده کنید.
  خروجی چیزی شبیه به این است:

  ```
  NAME               READY   UP-TO-DATE   AVAILABLE   AGE
  nginx-deployment   3/3     3            3           36s
  ```

* `kubectl get rs` را اجرا کنید تا ببینید Deployment، پادها را با ایجاد یک ReplicaSet جدید و scale up کردن آن
تا 3 replica به‌روزرسانی کرده است، و همچنین ReplicaSet قدیمی را تا 0 replica scale down کرده است.

  ```shell
  kubectl get rs
  ```

  خروجی چیزی شبیه به این است:
  ```
  NAME                          DESIRED   CURRENT   READY   AGE
  nginx-deployment-1564180365   3         3         3       6s
  nginx-deployment-2035384211   0         0         0       36s
  ```

* اجرای `get pods` اکنون باید فقط پادهای جدید را نشان دهد:

  ```shell
  kubectl get pods
  ```

  خروجی چیزی شبیه به این است:
  ```
  NAME                                READY     STATUS    RESTARTS   AGE
  nginx-deployment-1564180365-khku8   1/1       Running   0          14s
  nginx-deployment-1564180365-nacti   1/1       Running   0          14s
  nginx-deployment-1564180365-z9gth   1/1       Running   0          14s
  ```

  دفعه‌ی بعد که بخواهید این پادها را به‌روزرسانی کنید، فقط کافی است دوباره template پاد مربوط به Deployment را به‌روزرسانی کنید.

  Deployment تضمین می‌کند که تنها تعداد مشخصی از پادها هنگام به‌روزرسانی از دسترس خارج شوند. به‌صورت پیش‌فرض،
  تضمین می‌کند که دست‌کم 75% از تعداد مطلوب پادها بالا باشند (حداکثر 25% غیرقابل‌دسترس).

  همچنین Deployment تضمین می‌کند که تنها تعداد مشخصی از پادها بیشتر از تعداد مطلوب ایجاد شوند.
  به‌صورت پیش‌فرض، تضمین می‌کند که حداکثر 125% از تعداد مطلوب پادها بالا باشند (حداکثر 25% surge).

  برای مثال، اگر به Deployment بالا با دقت نگاه کنید، می‌بینید که ابتدا یک پاد جدید ایجاد می‌کند،
  سپس یک پاد قدیمی را حذف می‌کند، و یکی دیگر جدید ایجاد می‌کند. پادهای قدیمی را از بین نمی‌برد تا زمانی که تعداد کافی از
  پادهای جدید بالا آمده باشند، و پادهای جدید ایجاد نمی‌کند تا زمانی که تعداد کافی از پادهای قدیمی از بین رفته باشند.
  اطمینان حاصل می‌کند که دست‌کم 3 پاد در دسترس است و حداکثر در مجموع 4 پاد در دسترس است. در حالتی
  که Deployment دارای 4 replica باشد، تعداد پادها بین 3 و 5 خواهد بود.

* جزئیات Deployment خود را به دست بیاورید:
  ```shell
  kubectl describe deployments
  ```
  خروجی چیزی شبیه به این است:
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
  همان‌طور که می‌بینید، وقتی برای اولین بار Deployment را ایجاد کردید، یک ReplicaSet (nginx-deployment-2035384211)
  ایجاد کرد و مستقیماً آن را تا 3 replica scale up کرد. وقتی Deployment را به‌روزرسانی کردید، یک ReplicaSet جدید
  (nginx-deployment-1564180365) ایجاد کرد و آن را تا 1 scale up کرد و منتظر بالا آمدنش ماند. سپس ReplicaSet قدیمی را
  تا 2 scale down کرد و ReplicaSet جدید را تا 2 scale up کرد تا دست‌کم 3 پاد در دسترس باشد و حداکثر 4 پاد در هر لحظه ایجاد شود.
  سپس به scale up و scale down کردن ReplicaSet جدید و قدیمی ادامه داد، با همان استراتژی rolling update.
  در نهایت، 3 replica در دسترس در ReplicaSet جدید خواهید داشت، و ReplicaSet قدیمی تا 0 scale down می‌شود.

{{< note >}}
Kubernetes هنگام محاسبه‌ی تعداد `availableReplicas`، پادهای در حال خاتمه (terminating) را به حساب نمی‌آورد، که این تعداد باید بین
`replicas - maxUnavailable` و `replicas + maxSurge` باشد. در نتیجه، ممکن است متوجه شوید که در طول یک rollout تعداد پادها بیشتر از
حد انتظار است، و مجموع منابع مصرفی توسط Deployment بیشتر از `replicas + maxSurge` است
تا زمانی که `terminationGracePeriodSeconds` مربوط به پادهای در حال خاتمه به پایان برسد.
{{< /note >}}

### Rollover (یا همان چندین به‌روزرسانی هم‌زمان)

هر بار که یک Deployment جدید توسط کنترلر Deployment مشاهده شود، یک ReplicaSet ایجاد می‌شود تا پادهای مطلوب را بالا بیاورد.
اگر Deployment به‌روزرسانی شود، ReplicaSet موجودی که پادهایی را کنترل می‌کند که لیبل‌های آن‌ها با `.spec.selector` تطبیق دارد ولی
template آن‌ها با `.spec.template` تطبیق ندارد، scale down می‌شود. در نهایت، ReplicaSet جدید تا `.spec.replicas` scale می‌شود و همه‌ی
ReplicaSetهای قدیمی تا 0 scale می‌شوند.

اگر در حین پیشرفت یک rollout موجود، Deployment را به‌روزرسانی کنید، Deployment طبق آن به‌روزرسانی یک ReplicaSet جدید
ایجاد کرده و شروع به scale up کردن آن می‌کند، و ReplicaSetی را که پیش‌تر در حال scale up کردنش بود rollover می‌کند
-- آن را به لیست ReplicaSetهای قدیمی خود اضافه کرده و شروع به scale down کردن آن می‌کند.

برای مثال، فرض کنید یک Deployment ایجاد می‌کنید تا 5 replica از `nginx:1.14.2` بسازد،
اما سپس Deployment را به‌روزرسانی می‌کنید تا 5 replica از `nginx:1.16.1` بسازد، در حالی که فقط 3
replica از `nginx:1.14.2` ایجاد شده بود. در آن حالت، Deployment بلافاصله شروع به از بین بردن
3 پاد از نوع `nginx:1.14.2` که ایجاد کرده بود می‌کند، و شروع به ایجاد
پادهای `nginx:1.16.1` می‌کند. منتظر ایجاد شدن 5 replica از `nginx:1.14.2` نمی‌ماند
پیش از تغییر مسیر.

### به‌روزرسانی label selector

به‌طورکلی به‌روزرسانی label selector توصیه نمی‌شود و پیشنهاد می‌شود selectorهای خود را از پیش برنامه‌ریزی کنید.
label selector مربوط به یک Deployment پس از ایجاد **تغییرناپذیر (immutable)** است؛
نمی‌توان آن را با `kubectl patch`، `kubectl edit`، `kubectl apply`، یا ابزارهایی مانند `helm upgrade` به‌روزرسانی کرد.

اگر باید selector را تغییر دهید، باید Deployment را حذف کرده و دوباره ایجاد کنید.
به‌صورت پیش‌فرض، حذف Deployment، پادهای در حال اجرای آن را نیز حذف می‌کند و باعث downtime می‌شود؛ اگر نیاز دارید آن پادها
هنگام بازسازی Deployment به کار خود ادامه دهند، از `--cascade=orphan` استفاده کنید
(به پیامدهای زیر توجه کنید).
دقت زیادی به خرج دهید و مطمئن شوید پیامدهای زیر را درک می‌کنید:

* **اضافه کردن‌ها:** وقتی یک Deployment جدید با یک selector محدودتر ایجاد می‌کنید، Deployment جدید **باید** یک template پاد مناسب هم داشته باشد.
  اگر یک manifest موجود دارید و آن manifest را برای محدود کردن selector ویرایش می‌کنید، باید metadata مربوط به template پاد را در آن Deployment ویرایش کنید،
  و لیبل‌های جدید
  را برای تطبیق اضافه کنید، در غیر این صورت API server خطای اعتبارسنجی برمی‌گرداند. این یک تغییر _غیرهم‌پوشان_ است:
  Deployment جدید پادهای قدیمی (که لیبل جدید را ندارند) را "نمی‌بیند"، که باعث می‌شود ReplicaSet قدیمی
  **بی‌سرپرست (orphaned)** شود و یک ReplicaSet کاملاً جدید ایجاد شود.
* **به‌روزرسانی مقادیر:** تغییر مقدار موجود در یک کلید selector (مثلاً از `v1` به `v2`)
  همان رفتار اضافه کردن‌ها را دارد (orphan شدن و بازسازی).
* **حذف‌ها:** حذف یک کلید موجود از selector مربوط به Deployment نیازی به هیچ تغییری
  در لیبل‌های template پاد ندارد. این یک تغییر _هم‌پوشان_ است: selector جدید و گسترده‌تر با
  پادهای قدیمی تطبیق پیدا می‌کند. ReplicaSetهای موجود orphan نمی‌شوند، و ReplicaSet جدیدی ایجاد نمی‌شود،
  اما توجه کنید که لیبل حذف‌شده همچنان در هر پاد و ReplicaSet موجود باقی می‌ماند.
  می‌توانید با فعال کردن یک rollout برای Deployment، این را پاکسازی کنید.

## بازگرداندن (Rollback) یک Deployment

گاهی اوقات، ممکن است بخواهید یک Deployment را rollback کنید؛ برای مثال، وقتی Deployment پایدار نیست، مثلاً در crash loop باشد.
به‌صورت پیش‌فرض، تمام تاریخچه‌ی rollout مربوط به Deployment در سیستم نگه‌داری می‌شود تا هر زمان که بخواهید بتوانید rollback کنید
(می‌توانید با تغییر محدودیت تاریخچه‌ی revision این را تغییر دهید).

{{< note >}}
یک revision از Deployment زمانی ایجاد می‌شود که rollout مربوط به Deployment فعال شود. این یعنی
revision جدید تنها و تنها زمانی ایجاد می‌شود که template پاد مربوط به Deployment (`.spec.template`) تغییر کند،
برای مثال اگر لیبل‌ها یا ایمیج‌های کانتینرهای template را به‌روزرسانی کنید. سایر به‌روزرسانی‌ها، مانند scale کردن Deployment،
یک revision از Deployment ایجاد نمی‌کنند، تا بتوانید هم‌زمان scaling دستی یا خودکار انجام دهید.
این یعنی وقتی به یک revision قدیمی‌تر rollback می‌کنید، فقط بخش template پاد مربوط به Deployment
rollback می‌شود.
{{< /note >}}

* فرض کنید هنگام به‌روزرسانی Deployment یک اشتباه تایپی مرتکب شده‌اید، و نام ایمیج را `nginx:1.161` به‌جای `nginx:1.16.1` وارد کرده‌اید:

  ```shell
  kubectl set image deployment/nginx-deployment nginx=nginx:1.161
  ```

  خروجی چیزی شبیه به این است:
  ```
  deployment.apps/nginx-deployment image updated
  ```

* rollout گیر می‌کند (stuck). می‌توانید این را با بررسی وضعیت rollout تأیید کنید:

  ```shell
  kubectl rollout status deployment/nginx-deployment
  ```

  خروجی چیزی شبیه به این است:
  ```
  Waiting for rollout to finish: 1 out of 3 new replicas have been updated...
  ```

* برای توقف watch مربوط به وضعیت rollout بالا، Ctrl-C را فشار دهید. برای اطلاعات بیشتر درباره‌ی rolloutهای گیرکرده،
[بیشتر بخوانید](#deployment-status).

* می‌بینید که تعداد replicaهای قدیمی (با جمع تعداد replicaها از
  `nginx-deployment-1564180365` و `nginx-deployment-2035384211`) برابر 3 است، و تعداد
  replicaهای جدید (از `nginx-deployment-3066724191`) برابر 1 است.

  ```shell
  kubectl get rs
  ```

  خروجی چیزی شبیه به این است:
  ```
  NAME                          DESIRED   CURRENT   READY   AGE
  nginx-deployment-1564180365   3         3         3       25s
  nginx-deployment-2035384211   0         0         0       36s
  nginx-deployment-3066724191   1         1         0       6s
  ```

* با نگاه کردن به پادهای ایجادشده، می‌بینید که پاد1 ایجادشده توسط ReplicaSet جدید در یک image pull loop گیر کرده است.

  ```shell
  kubectl get pods
  ```

  خروجی چیزی شبیه به این است:
  ```
  NAME                                READY     STATUS             RESTARTS   AGE
  nginx-deployment-1564180365-70iae   1/1       Running            0          25s
  nginx-deployment-1564180365-jbqqo   1/1       Running            0          25s
  nginx-deployment-1564180365-hysrc   1/1       Running            0          25s
  nginx-deployment-3066724191-08mng   0/1       ImagePullBackOff   0          6s
  ```

  {{< note >}}
  کنترلر Deployment به‌صورت خودکار rollout بد را متوقف می‌کند، و از scale up کردن بیشتر ReplicaSet جدید دست می‌کشد. این به پارامترهای rollingUpdate (به‌طور مشخص `maxUnavailable`) بستگی دارد که مشخص کرده‌اید. Kubernetes به‌صورت پیش‌فرض این مقدار را 25% تنظیم می‌کند.
  {{< /note >}}

* جزئیات Deployment را به دست بیاورید:
  ```shell
  kubectl describe deployment
  ```

  خروجی چیزی شبیه به این است:
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

  برای رفع این مشکل، باید به یک revision قدیمی‌تر و پایدار از Deployment rollback کنید.

### بررسی تاریخچه‌ی Rollout مربوط به یک Deployment

برای بررسی تاریخچه‌ی rollout، مراحل زیر را دنبال کنید:

1. ابتدا، revisionهای این Deployment را بررسی کنید:
   ```shell
   kubectl rollout history deployment/nginx-deployment
   ```
   خروجی چیزی شبیه به این است:
   ```
   deployments "nginx-deployment"
   REVISION    CHANGE-CAUSE
   1           <none>
   2           <none>
   3           <none>
   ```

   `CHANGE-CAUSE` از annotation مربوط به Deployment یعنی `kubernetes.io/change-cause` هنگام ایجاد revision، در آن کپی می‌شود. می‌توانید پیام `CHANGE-CAUSE` را این‌گونه مشخص کنید:

   * با annotate کردن Deployment با استفاده از `kubectl annotate deployment/nginx-deployment kubernetes.io/change-cause="image updated to 1.16.1"`
   * با ویرایش دستی manifest مربوط به منبع.
   * با استفاده از ابزاری که این annotation را به‌صورت خودکار تنظیم می‌کند.

   {{< note >}}
   در نسخه‌های قدیمی‌تر Kubernetes، می‌توانستید از فلگ `--record` همراه با دستورات kubectl استفاده کنید تا فیلد `CHANGE-CAUSE` به‌صورت خودکار پر شود. این فلگ منسوخ (deprecated) شده و در یک نسخه‌ی آینده حذف خواهد شد.
   {{< /note >}}

2. برای دیدن جزئیات هر revision، این دستور را اجرا کنید:
   ```shell
   kubectl rollout history deployment/nginx-deployment --revision=2
   ```

   خروجی چیزی شبیه به این است:
   ```
   deployments "nginx-deployment" revision 2
     Labels:       app=nginx
             pod-template-hash=1159050644
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

### بازگشت به یک Revision قبلی
برای rollback کردن Deployment از نسخه‌ی فعلی به نسخه‌ی قبلی، که نسخه‌ی 2 است، مراحل زیر را دنبال کنید.

1. حالا تصمیم گرفته‌اید rollout فعلی را لغو کرده و به revision قبلی برگردید:
   ```shell
   kubectl rollout undo deployment/nginx-deployment
   ```

   خروجی چیزی شبیه به این است:
   ```
   deployment.apps/nginx-deployment rolled back
   ```
   به‌عنوان جایگزین، می‌توانید با مشخص کردن `--to-revision` به یک revision خاص rollback کنید:

   ```shell
   kubectl rollout undo deployment/nginx-deployment --to-revision=2
   ```

   خروجی چیزی شبیه به این است:
   ```
   deployment.apps/nginx-deployment rolled back
   ```

   برای جزئیات بیشتر درباره‌ی دستورات مرتبط با rollout، [`kubectl rollout`](/docs/reference/generated/kubectl/kubectl-commands#rollout) را بخوانید.

   Deployment اکنون به یک revision پایدار قبلی rollback شده است. همان‌طور که می‌بینید، یک رویداد `DeploymentRollback`
   برای بازگشت به revision 2 توسط کنترلر Deployment تولید شده است.

2. برای بررسی این‌که rollback موفق بوده و Deployment طبق انتظار در حال اجراست، این را اجرا کنید:
   ```shell
   kubectl get deployment nginx-deployment
   ```

   خروجی چیزی شبیه به این است:
   ```
   NAME               READY   UP-TO-DATE   AVAILABLE   AGE
   nginx-deployment   3/3     3            3           30m
   ```
3. توضیحات (description) مربوط به Deployment را به دست بیاورید:
   ```shell
   kubectl describe deployment nginx-deployment
   ```
   خروجی چیزی شبیه به این است:
   ```
   Name:                   nginx-deployment
   Namespace:              default
   CreationTimestamp:      Sun, 02 Sep 2018 18:17:55 -0500
   Labels:                 app=nginx
   Annotations:            deployment.kubernetes.io/revision=4
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

## افزایش مقیاس (Scale) یک Deployment

می‌توانید با استفاده از دستور زیر یک Deployment را scale کنید:

```shell
kubectl scale deployment/nginx-deployment --replicas=10
```
خروجی چیزی شبیه به این است:
```
deployment.apps/nginx-deployment scaled
```

با فرض این‌که [horizontal Pod autoscaling](/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/) در
کلاستر شما فعال باشد، می‌توانید یک autoscaler برای Deployment خود تنظیم کنید و حداقل و حداکثر تعداد
پادهایی را که می‌خواهید بر اساس میزان مصرف CPU در پادهای موجود اجرا شوند انتخاب کنید.

```shell
kubectl autoscale deployment/nginx-deployment --min=10 --max=15 --cpu-percent=80%
```
خروجی چیزی شبیه به این است:
```
deployment.apps/nginx-deployment scaled
```

### Scaling نسبی (Proportional)

Deploymentهای RollingUpdate از اجرای هم‌زمان چندین نسخه از یک اپلیکیشن پشتیبانی می‌کنند. وقتی شما
یا یک autoscaler یک Deployment از نوع RollingUpdate را که در میانه‌ی یک rollout است (چه در حال پیشرفت
و چه متوقف‌شده) scale می‌کند، کنترلر Deployment replicaهای اضافی را در میان
ReplicaSetهای فعال موجود (ReplicaSetهایی که پاد دارند) متوازن می‌کند تا ریسک را کاهش دهد. به این کار *scaling نسبی* گفته می‌شود.

برای مثال، فرض کنید یک Deployment با 10 replica، [maxSurge](#max-surge)=3، و [maxUnavailable](#max-unavailable)=2 در حال اجراست.

* مطمئن شوید 10 replica مربوط به Deployment شما در حال اجراست.
  ```shell
  kubectl get deploy
  ```
  خروجی چیزی شبیه به این است:

  ```
  NAME                 DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
  nginx-deployment     10        10        10           10          50s
  ```

* به یک ایمیج جدید به‌روزرسانی می‌کنید که به‌طور اتفاقی از داخل کلاستر قابل resolve نیست.
  ```shell
  kubectl set image deployment/nginx-deployment nginx=nginx:sometag
  ```

  خروجی چیزی شبیه به این است:
  ```
  deployment.apps/nginx-deployment image updated
  ```

* به‌روزرسانی ایمیج یک rollout جدید را با ReplicaSet به نام nginx-deployment-1989198191 شروع می‌کند، اما به دلیل الزام
`maxUnavailable` که در بالا ذکر شد، مسدود می‌شود. وضعیت rollout را بررسی کنید:
  ```shell
  kubectl get rs
  ```
  خروجی چیزی شبیه به این است:
  ```
  NAME                          DESIRED   CURRENT   READY     AGE
  nginx-deployment-1989198191   5         5         0         9s
  nginx-deployment-618515232    8         8         8         1m
  ```

* سپس یک درخواست scaling جدید برای Deployment می‌آید. autoscaler تعداد replicaهای Deployment را
به 15 افزایش می‌دهد. کنترلر Deployment باید تصمیم بگیرد این 5 replica جدید را کجا اضافه کند. اگر از scaling نسبی
استفاده نمی‌کردید، هر 5 مورد به ReplicaSet جدید اضافه می‌شدند. با scaling نسبی، شما
replicaهای اضافی را در میان همه‌ی ReplicaSetها پخش می‌کنید. سهم بیشتر به ReplicaSetهایی می‌رسد که
بیشترین تعداد replica را دارند و سهم کمتر به ReplicaSetهایی که replica کمتری دارند. باقی‌مانده‌ها به
ReplicaSetی اضافه می‌شوند که بیشترین تعداد replica را دارد. ReplicaSetهایی که صفر replica دارند scale up نمی‌شوند.

در مثال بالا، 3 replica به ReplicaSet قدیمی و 2 replica به
ReplicaSet جدید اضافه می‌شود. با فرض این‌که replicaهای جدید سالم (healthy) شوند، فرایند rollout در نهایت باید همه‌ی replicaها را به ReplicaSet جدید منتقل کند. برای تأیید این موضوع، این را اجرا کنید:

```shell
kubectl get deploy
```

خروجی چیزی شبیه به این است:
```
NAME                 DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment     15        18        7            8           7m
```
وضعیت rollout تأیید می‌کند که replicaها چگونه به هر ReplicaSet اضافه شده‌اند.
```shell
kubectl get rs
```

خروجی چیزی شبیه به این است:
```
NAME                          DESIRED   CURRENT   READY     AGE
nginx-deployment-1989198191   7         7         0         7m
nginx-deployment-618515232    11        11        11        7m
```

## متوقف کردن و از سرگیری یک rollout از Deployment {#pausing-and-resuming-a-deployment}

وقتی یک Deployment را به‌روزرسانی می‌کنید، یا قصد این کار را دارید، می‌توانید rolloutهای
آن Deployment را پیش از فعال کردن یک یا چند به‌روزرسانی متوقف (pause) کنید. وقتی
آماده‌ی اعمال آن تغییرات باشید، rolloutهای مربوط به Deployment را از سر می‌گیرید (resume). این روش به شما
اجازه می‌دهد چندین تعمیر را بین pause و resume اعمال کنید بدون این‌که rolloutهای غیرضروری فعال شوند.

* برای مثال، با یک Deployment که ایجاد شده:

  جزئیات Deployment را به دست بیاورید:
  ```shell
  kubectl get deploy
  ```
  خروجی چیزی شبیه به این است:
  ```
  NAME      DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
  nginx     3         3         3            3           1m
  ```
  وضعیت rollout را به دست بیاورید:
  ```shell
  kubectl get rs
  ```
  خروجی چیزی شبیه به این است:
  ```
  NAME               DESIRED   CURRENT   READY     AGE
  nginx-2142116321   3         3         3         1m
  ```

* با اجرای دستور زیر متوقف (pause) کنید:
  ```shell
  kubectl rollout pause deployment/nginx-deployment
  ```

  خروجی چیزی شبیه به این است:
  ```
  deployment.apps/nginx-deployment paused
  ```

* سپس ایمیج Deployment را به‌روزرسانی کنید:
  ```shell
  kubectl set image deployment/nginx-deployment nginx=nginx:1.16.1
  ```

  خروجی چیزی شبیه به این است:
  ```
  deployment.apps/nginx-deployment image updated
  ```

* توجه کنید که هیچ rollout جدیدی شروع نشد:
  ```shell
  kubectl rollout history deployment/nginx-deployment
  ```

  خروجی چیزی شبیه به این است:
  ```
  deployments "nginx"
  REVISION  CHANGE-CAUSE
  1   <none>
  ```
* وضعیت rollout را به دست بیاورید تا تأیید کنید ReplicaSet موجود تغییر نکرده است:
  ```shell
  kubectl get rs
  ```

  خروجی چیزی شبیه به این است:
  ```
  NAME               DESIRED   CURRENT   READY     AGE
  nginx-2142116321   3         3         3         2m
  ```

* می‌توانید هر تعداد به‌روزرسانی که می‌خواهید انجام دهید، برای مثال، منابعی که استفاده خواهد شد را به‌روزرسانی کنید:
  ```shell
  kubectl set resources deployment/nginx-deployment -c=nginx --limits=cpu=200m,memory=512Mi
  ```

  خروجی چیزی شبیه به این است:
  ```
  deployment.apps/nginx-deployment resource requirements updated
  ```

  وضعیت اولیه‌ی Deployment پیش از متوقف کردن rollout آن به کار خود ادامه می‌دهد، اما به‌روزرسانی‌های جدید روی
  Deployment تا زمانی که rollout مربوط به Deployment متوقف است، هیچ تأثیری نخواهند داشت.

* در نهایت، rollout مربوط به Deployment را از سر بگیرید (resume) و مشاهده کنید یک ReplicaSet جدید با همه‌ی به‌روزرسانی‌های جدید بالا می‌آید:
  ```shell
  kubectl rollout resume deployment/nginx-deployment
  ```

  خروجی چیزی شبیه به این است:
  ```
  deployment.apps/nginx-deployment resumed
  ```
* وضعیت rollout را تا پایان آن {{< glossary_tooltip text="watch" term_id="watch" >}} کنید.
  ```shell
  kubectl get rs --watch
  ```

  خروجی چیزی شبیه به این است:
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
* وضعیت آخرین rollout را به دست بیاورید:
  ```shell
  kubectl get rs
  ```

  خروجی چیزی شبیه به این است:
  ```
  NAME               DESIRED   CURRENT   READY     AGE
  nginx-2142116321   0         0         0         2m
  nginx-3926361531   3         3         3         28s
  ```
{{< note >}}
نمی‌توانید یک Deployment متوقف‌شده (paused) را rollback کنید تا زمانی که آن را از سر بگیرید (resume).
{{< /note >}}

## وضعیت (Status) Deployment

یک Deployment در طول چرخه‌ی عمر خود وضعیت‌های مختلفی به خود می‌گیرد. می‌تواند در حال [پیشرفت (progressing)](#progressing-deployment) باشد در حالی که
یک ReplicaSet جدید را rollout می‌کند، می‌تواند [کامل (complete)](#complete-deployment) شود، یا می‌تواند [در پیشرفت شکست بخورد](#failed-deployment).

### Deployment در حال پیشرفت (Progressing)

Kubernetes وقتی یکی از کارهای زیر انجام شود یک Deployment را _در حال پیشرفت (progressing)_ علامت‌گذاری می‌کند:

* Deployment یک ReplicaSet جدید ایجاد می‌کند.
* Deployment جدیدترین ReplicaSet خود را scale up می‌کند.
* Deployment ReplicaSet(های) قدیمی‌تر خود را scale down می‌کند.
* پادهای جدید آماده (ready) یا در دسترس می‌شوند (دست‌کم به مدت [MinReadySeconds](#min-ready-seconds) آماده بوده‌اند).

وقتی rollout به حالت "در حال پیشرفت" می‌رسد، کنترلر Deployment یک condition با ویژگی‌های
زیر به `.status.conditions` مربوط به Deployment اضافه می‌کند:

* `type: Progressing`
* `status: "True"`
* `reason: NewReplicaSetCreated` | `reason: FoundNewReplicaSet` | `reason: ReplicaSetUpdated`

می‌توانید با استفاده از `kubectl rollout status` پیشرفت یک Deployment را زیر نظر بگیرید.

### Deployment کامل (Complete)

Kubernetes وقتی یک Deployment ویژگی‌های زیر را داشته باشد آن را _کامل (complete)_ علامت‌گذاری می‌کند:

* همه‌ی replicaهای مرتبط با Deployment به آخرین نسخه‌ای که مشخص کرده‌اید به‌روزرسانی شده‌اند، یعنی هر
به‌روزرسانی‌ای که درخواست داده‌اید کامل شده است.
* همه‌ی replicaهای مرتبط با Deployment در دسترس‌اند.
* هیچ replica قدیمی‌ای برای Deployment در حال اجرا نیست.

وقتی rollout "کامل" می‌شود، کنترلر Deployment یک condition با ویژگی‌های
زیر را در `.status.conditions` مربوط به Deployment تنظیم می‌کند:

* `type: Progressing`
* `status: "True"`
* `reason: NewReplicaSetAvailable`

این condition از نوع `Progressing` مقدار `"True"` را حفظ می‌کند تا زمانی که یک rollout جدید
فعال شود. این condition حتی وقتی در دسترس بودن replicaها تغییر کند (که در عوض روی
condition به نام `Available` تأثیر می‌گذارد) پابرجا می‌ماند.

می‌توانید با استفاده از `kubectl rollout status` بررسی کنید که آیا یک Deployment کامل شده یا نه. اگر rollout با
موفقیت کامل شده باشد، `kubectl rollout status` یک کد خروج صفر برمی‌گرداند.

```shell
kubectl rollout status deployment/nginx-deployment
```
خروجی چیزی شبیه به این است:
```
Waiting for rollout to finish: 2 of 3 updated replicas are available...
deployment "nginx-deployment" successfully rolled out
```
و وضعیت خروج (exit status) از `kubectl rollout` برابر 0 است (موفقیت):
```shell
echo $?
```
```
0
```

### Deployment ناموفق (Failed)

ممکن است Deployment شما در حین تلاش برای deploy کردن جدیدترین ReplicaSet خود گیر کند بدون این‌که هرگز کامل شود. این می‌تواند
به دلیل برخی از عوامل زیر رخ دهد:

* سهمیه‌ی (quota) ناکافی
* شکست‌های readiness probe
* خطاهای image pull
* دسترسی‌های ناکافی
* Limit range ها
* پیکربندی نادرست runtime اپلیکیشن

یکی از راه‌های تشخیص این وضعیت مشخص کردن یک پارامتر deadline در spec مربوط به Deployment است:
([`.spec.progressDeadlineSeconds`](#progress-deadline-seconds)). `.spec.progressDeadlineSeconds` نشان‌دهنده‌ی
تعداد ثانیه‌هایی است که کنترلر Deployment صبر می‌کند پیش از این‌که در وضعیت Deployment اعلام کند
پیشرفت Deployment متوقف شده است.

دستور `kubectl` زیر spec را با `progressDeadlineSeconds` تنظیم می‌کند تا کنترلر
پس از 10 دقیقه فقدان پیشرفت یک rollout مربوط به Deployment را گزارش دهد:

```shell
kubectl patch deployment/nginx-deployment -p '{"spec":{"progressDeadlineSeconds":600}}'
```
خروجی چیزی شبیه به این است:
```
deployment.apps/nginx-deployment patched
```
پس از این‌که deadline سپری شود، کنترلر Deployment یک DeploymentCondition با ویژگی‌های
زیر به `.status.conditions` مربوط به Deployment اضافه می‌کند:

* `type: Progressing`
* `status: "False"`
* `reason: ProgressDeadlineExceeded`

این condition همچنین می‌تواند زودتر شکست بخورد و در آن صورت مقدار status آن به `"False"` به دلایلی مثل `ReplicaSetCreateError` تنظیم می‌شود.
همچنین، پس از این‌که rollout مربوط به Deployment کامل شود، دیگر deadline در نظر گرفته نمی‌شود.

برای اطلاعات بیشتر درباره‌ی status conditionها به [قراردادهای API کوبرنتیز](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#typical-status-properties) مراجعه کنید.

{{< note >}}
Kubernetes روی یک Deployment متوقف‌شده (stalled) هیچ اقدامی جز گزارش یک status condition با
`reason: ProgressDeadlineExceeded` انجام نمی‌دهد. ارکستریتورهای سطح بالاتر می‌توانند از این استفاده کرده و بر اساس آن عمل کنند، برای
مثال، Deployment را به نسخه‌ی قبلی‌اش rollback کنند.
{{< /note >}}

{{< note >}}
اگر یک rollout مربوط به Deployment را متوقف (pause) کنید، Kubernetes پیشرفت را در برابر deadlinی که مشخص کرده‌اید بررسی نمی‌کند.
می‌توانید با خیال راحت یک rollout مربوط به Deployment را در میانه‌ی یک rollout متوقف کرده و بدون فعال کردن
condition مربوط به سپری شدن deadline از سر بگیرید.
{{< /note >}}

ممکن است با Deploymentهای خود خطاهای گذرا (transient) را تجربه کنید، چه به دلیل timeout پایینی که تنظیم کرده‌اید یا
به دلیل هر نوع خطای دیگری که بتوان آن را گذرا در نظر گرفت. برای مثال، فرض کنید سهمیه‌ی (quota) ناکافی دارید. اگر Deployment را describe کنید، بخش زیر را مشاهده خواهید کرد:

```shell
kubectl describe deployment nginx-deployment
```
خروجی چیزی شبیه به این است:
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

اگر `kubectl get deployment nginx-deployment -o yaml` را اجرا کنید، وضعیت Deployment چیزی شبیه به این خواهد بود:

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

در نهایت، پس از این‌که deadline پیشرفت Deployment سپری شود، Kubernetes وضعیت و
دلیل مربوط به condition از نوع Progressing را به‌روزرسانی می‌کند:

```
Conditions:
  Type            Status  Reason
  ----            ------  ------
  Available       True    MinimumReplicasAvailable
  Progressing     False   ProgressDeadlineExceeded
  ReplicaFailure  True    FailedCreate
```

می‌توانید مشکل کمبود quota را با scale down کردن Deployment خود، با scale down کردن کنترلرهای دیگری که ممکن است در
حال اجرا داشته باشید، یا با افزایش quota در namespace خود برطرف کنید. اگر شرایط quota را برآورده کنید و کنترلر
Deployment سپس rollout مربوط به Deployment را کامل کند، وضعیت Deployment را با یک condition موفق
مشاهده خواهید کرد (`status: "True"` و `reason: NewReplicaSetAvailable`).

```
Conditions:
  Type          Status  Reason
  ----          ------  ------
  Available     True    MinimumReplicasAvailable
  Progressing   True    NewReplicaSetAvailable
```

`type: Available` با `status: "True"` یعنی Deployment شما حداقل در دسترس بودن (minimum availability) را دارد. حداقل در دسترس بودن
با پارامترهای مشخص‌شده در استراتژی Deployment تعیین می‌شود. `type: Progressing` با `status: "True"` یعنی Deployment شما
یا در میانه‌ی یک rollout است و در حال پیشرفت است یا این‌که پیشرفت خود را با موفقیت کامل کرده و حداقل تعداد
لازم از replicaهای جدید در دسترس هستند (برای جزئیات به Reason مربوط به condition مراجعه کنید - در مورد ما
`reason: NewReplicaSetAvailable` یعنی Deployment کامل شده است).

می‌توانید با استفاده از `kubectl rollout status` بررسی کنید که آیا یک Deployment در پیشرفت شکست خورده است یا نه. `kubectl rollout status`
اگر Deployment از deadline پیشرفت خود عبور کرده باشد، یک کد خروج غیرصفر برمی‌گرداند.

```shell
kubectl rollout status deployment/nginx-deployment
```
خروجی چیزی شبیه به این است:
```
Waiting for rollout to finish: 2 out of 3 new replicas have been updated...
error: deployment "nginx" exceeded its progress deadline
```
و وضعیت خروج از `kubectl rollout` برابر 1 است (نشان‌دهنده‌ی خطا):
```shell
echo $?
```
```
1
```

### عملیات روی یک deployment ناموفق

همه‌ی اقداماتی که برای یک Deployment کامل به کار می‌روند برای یک Deployment ناموفق هم به کار می‌روند. می‌توانید آن را scale up/down کنید، به
یک revision قبلی rollback کنید، یا حتی اگر نیاز دارید چندین تغییر روی template پاد مربوط به Deployment اعمال کنید آن را pause کنید.

## سیاست پاکسازی (Clean up Policy)

می‌توانید فیلد `.spec.revisionHistoryLimit` را در یک Deployment تنظیم کنید تا مشخص کنید چند ReplicaSet قدیمی
مربوط به این Deployment را می‌خواهید نگه دارید. باقی آن‌ها در پس‌زمینه garbage-collect خواهند شد. به‌صورت پیش‌فرض،
این مقدار 10 است.

{{< note >}}
تنظیم صریح این فیلد به 0، باعث پاکسازی کل تاریخچه‌ی Deployment شما خواهد شد
و در نتیجه آن Deployment امکان rollback نخواهد داشت.
{{< /note >}}

پاکسازی تنها **پس از** رسیدن Deployment به یک
[وضعیت کامل](/docs/concepts/workloads/controllers/deployment/#complete-deployment) شروع می‌شود.
اگر `.spec.revisionHistoryLimit` را روی 0 تنظیم کنید، هر rollout با این حال باعث ایجاد یک
ReplicaSet جدید می‌شود پیش از این‌که Kubernetes ReplicaSet قدیمی را حذف کند.

حتی با یک محدودیت تاریخچه‌ی revision غیرصفر، ممکن است تعداد ReplicaSetهای شما بیشتر از محدودیتی باشد که
تنظیم کرده‌اید. برای مثال، اگر پادها در حال crash loop باشند، و چندین رویداد rolling update
در طول زمان فعال شده باشند، ممکن است در نهایت تعداد ReplicaSetهای شما بیشتر از
`.spec.revisionHistoryLimit` شود، چون Deployment هرگز به وضعیت کامل نمی‌رسد.

## Canary Deployment

اگر می‌خواهید نسخه‌ها را با استفاده از Deployment روی زیرمجموعه‌ای از کاربران یا سرورها rollout کنید، می‌توانید
چندین Deployment، یکی برای هر نسخه، طبق الگوی canary توضیح داده‌شده در
[مدیریت منابع](/docs/concepts/workloads/management/#canary-deployments) ایجاد کنید.

## نوشتن یک Deployment Spec

مانند هر پیکربندی دیگر Kubernetes، یک Deployment به فیلدهای `.apiVersion`، `.kind`، و `.metadata` نیاز دارد.
برای اطلاعات کلی درباره‌ی کار با فایل‌های پیکربندی، به اسناد
[استقرار اپلیکیشن‌ها](/docs/tasks/run-application/run-stateless-application-deployment/)،
پیکربندی کانتینرها، و [استفاده از kubectl برای مدیریت منابع](/docs/concepts/overview/working-with-objects/object-management/) مراجعه کنید.

وقتی control plane Podهای جدیدی برای یک Deployment ایجاد می‌کند، `.metadata.name` مربوط به
Deployment بخشی از مبنای نام‌گذاری آن پادها است. نام یک Deployment باید یک مقدار معتبر
[DNS subdomain](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)
باشد، اما این می‌تواند نتایج غیرمنتظره‌ای برای hostname مربوط به پادها ایجاد کند. برای بهترین سازگاری،
نام باید از قواعد محدودکننده‌تر
[DNS label](/docs/concepts/overview/working-with-objects/names#dns-label-names) پیروی کند.

یک Deployment همچنین به یک [بخش `.spec`](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status) نیاز دارد.

### Template پاد

`.spec.template` و `.spec.selector` تنها فیلدهای الزامی `.spec` هستند.

`.spec.template` یک [template پاد](/docs/concepts/workloads/pods/#pod-templates) است. دقیقاً همان schema یک {{< glossary_tooltip text="پاد" term_id="pod" >}} را دارد، با این تفاوت که تودرتو (nested) است و `apiVersion` یا `kind` ندارد.

علاوه بر فیلدهای الزامی برای یک پاد، یک template پاد در یک Deployment باید لیبل‌ها و سیاست restart
مناسبی مشخص کند. برای لیبل‌ها، مطمئن شوید با کنترلرهای دیگر هم‌پوشانی نداشته باشند. به [selector](#selector) مراجعه کنید.

فقط [`.spec.template.spec.restartPolicy`](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy) برابر با `Always` مجاز است، که در صورت مشخص نشدن، مقدار پیش‌فرض است.

### Replicas

`.spec.replicas` یک فیلد اختیاری است که تعداد پادهای مطلوب را مشخص می‌کند. مقدار پیش‌فرض آن 1 است.

اگر یک Deployment را به‌صورت دستی scale کنید، مثلاً از طریق `kubectl scale deployment
deployment --replicas=X`، و سپس آن Deployment را بر اساس یک manifest به‌روزرسانی کنید
(برای مثال: با اجرای `kubectl apply -f deployment.yaml`)،
اعمال آن manifest، scaling دستی‌ای را که پیش‌تر انجام داده بودید بازنویسی (overwrite) می‌کند.

اگر یک [HorizontalPodAutoscaler](/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/) (یا هر
API مشابهی برای horizontal scaling) در حال مدیریت scaling برای یک Deployment باشد، `.spec.replicas` را تنظیم نکنید.

در عوض، اجازه دهید {{< glossary_tooltip text="control plane" term_id="control-plane" >}} کوبرنتیز
فیلد `.spec.replicas` را به‌صورت خودکار مدیریت کند.

### انتخابگر (Selector)

`.spec.selector` یک فیلد الزامی است که یک [label selector](/docs/concepts/overview/working-with-objects/labels/)
برای پادهای هدف این Deployment مشخص می‌کند.

`.spec.selector` باید با `.spec.template.metadata.labels` تطبیق داشته باشد، در غیر این صورت توسط API رد می‌شود.

در نسخه‌ی API با نام `apps/v1`، `.spec.selector` و `.metadata.labels` در صورت تنظیم نشدن به‌صورت پیش‌فرض به `.spec.template.metadata.labels` تنظیم نمی‌شوند. پس باید به‌صورت صریح تنظیم شوند. همچنین توجه کنید که `.spec.selector` پس از ایجاد Deployment در `apps/v1` تغییرناپذیر (immutable) است.

یک Deployment ممکن است پادهایی را که لیبل‌های آن‌ها با selector تطبیق دارد خاتمه دهد، اگر template آن‌ها متفاوت
از `.spec.template` باشد یا اگر تعداد کل چنین پادهایی از `.spec.replicas` بیشتر باشد. اگر تعداد پادها کمتر از تعداد
مطلوب باشد، پادهای جدیدی با `.spec.template` بالا می‌آورد.

{{< note >}}
نباید پادهای دیگری ایجاد کنید که لیبل‌های آن‌ها با این selector تطبیق داشته باشد، چه مستقیماً، با ایجاد
یک Deployment دیگر، یا با ایجاد کنترلر دیگری مانند یک ReplicaSet یا یک ReplicationController. اگر
این کار را انجام دهید، Deployment اول تصور می‌کند که این پادهای دیگر را خودش ایجاد کرده است. Kubernetes شما را از انجام این کار منع نمی‌کند.
{{< /note >}}

اگر چندین کنترلر با selectorهای هم‌پوشان داشته باشید، آن کنترلرها با یکدیگر تداخل پیدا می‌کنند و به‌درستی رفتار نخواهند کرد.

### Strategy

`.spec.strategy` استراتژی مورد استفاده برای جایگزین کردن پادهای قدیمی با پادهای جدید را مشخص می‌کند.
`.spec.strategy.type` می‌تواند "Recreate" یا "RollingUpdate" باشد. "RollingUpdate"
مقدار پیش‌فرض است.

#### بازسازی استقرار (Recreate Deployment)

وقتی `.spec.strategy.type==Recreate` باشد، همه‌ی پادهای موجود پیش از ایجاد پادهای جدید از بین می‌روند.

{{< note >}}
این فقط برای ارتقاها (upgrade) خاتمه‌ی پاد پیش از ایجاد را تضمین می‌کند. اگر یک Deployment را ارتقا دهید، همه‌ی پادهای
revision قدیمی بلافاصله خاتمه می‌یابند. پیش از این‌که هیچ پادی از revision جدید ایجاد شود، منتظر حذف موفق می‌ماند. اگر یک پاد را به‌صورت دستی حذف کنید، چرخه‌ی عمر آن توسط ReplicaSet کنترل می‌شود و
جایگزین آن بلافاصله ایجاد خواهد شد (حتی اگر پاد قدیمی هنوز در وضعیت Terminating باشد). اگر به تضمین
"حداکثر" (at most) برای پادهای خود نیاز دارید، استفاده از یک
[StatefulSet](/docs/concepts/workloads/controllers/statefulset/) را در نظر بگیرید.
{{< /note >}}

#### Rolling Update Deployment

وقتی `.spec.strategy.type==RollingUpdate` باشد، Deployment به‌شکل rolling update Podها را به‌روزرسانی می‌کند
(به‌تدریج ReplicaSetهای قدیمی را scale down و ReplicaSet جدید را scale up می‌کند). می‌توانید `maxUnavailable` و `maxSurge` را برای کنترل
فرایند rolling update مشخص کنید.

##### Max Unavailable

`.spec.strategy.rollingUpdate.maxUnavailable` یک فیلد اختیاری است که حداکثر تعداد
پادهایی را که می‌توانند در طول فرایند به‌روزرسانی غیرقابل‌دسترس باشند مشخص می‌کند. مقدار می‌تواند یک عدد مطلق (برای مثال، 5)
یا درصدی از تعداد پادهای مطلوب باشد (برای مثال، 10%). عدد مطلق با گرد کردن به پایین از درصد محاسبه می‌شود. این مقدار
اگر `.spec.strategy.rollingUpdate.maxSurge` برابر 0 باشد، نمی‌تواند 0 باشد. مقدار پیش‌فرض 25% است.

برای مثال، وقتی این مقدار روی 30% تنظیم شود، ReplicaSet قدیمی می‌تواند بلافاصله هنگام شروع rolling update
تا 70% از پادهای مطلوب scale down شود. پس از آماده شدن پادهای جدید، ReplicaSet قدیمی می‌تواند بیشتر
scale down شود، و به دنبال آن ReplicaSet جدید scale up می‌شود، تا اطمینان حاصل شود که تعداد کل پادهای در دسترس
در همه‌ی زمان‌ها در طول به‌روزرسانی دست‌کم 70% از پادهای مطلوب است.

##### Max Surge

`.spec.strategy.rollingUpdate.maxSurge` یک فیلد اختیاری است که حداکثر تعداد پادهایی
را که می‌توانند بیش از تعداد مطلوب پادها ایجاد شوند مشخص می‌کند. مقدار می‌تواند یک عدد مطلق (برای مثال، 5) یا
درصدی از تعداد پادهای مطلوب باشد (برای مثال، 10%). این مقدار در صورتی که `maxUnavailable` برابر 0 باشد نمی‌تواند 0 باشد. عدد مطلق
با گرد کردن به بالا از درصد محاسبه می‌شود. مقدار پیش‌فرض 25% است.

برای مثال، وقتی این مقدار روی 30% تنظیم شود، ReplicaSet جدید می‌تواند بلافاصله هنگام شروع rolling update
scale up شود، به‌طوری که مجموع پادهای قدیمی و جدید از 130% تعداد مطلوب
تجاوز نکند. پس از این‌که پادهای قدیمی حذف شدند، ReplicaSet جدید می‌تواند بیشتر scale up شود، تا اطمینان حاصل شود
مجموع پادهایی که در هر لحظه از به‌روزرسانی در حال اجرا هستند حداکثر 130% از تعداد مطلوب است.

در ادامه چند نمونه از Rolling Update Deployment آمده که از `maxUnavailable` و `maxSurge` استفاده می‌کنند:

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

### Progress Deadline Seconds

`.spec.progressDeadlineSeconds` یک فیلد اختیاری است که تعداد ثانیه‌هایی را مشخص می‌کند که می‌خواهید
پیش از این‌که سیستم گزارش دهد Deployment [در پیشرفت شکست خورده](#failed-deployment) - که به‌صورت یک condition با
`type: Progressing`، `status: "False"`، و `reason: ProgressDeadlineExceeded` در status منبع نمایان می‌شود - منتظر پیشرفت Deployment خود بمانید. کنترلر Deployment همچنان به تلاش دوباره برای انجام Deployment ادامه می‌دهد. مقدار پیش‌فرض این فیلد 600 است.

اگر مشخص شود، این فیلد باید بزرگ‌تر از `.spec.minReadySeconds` باشد.

### Min Ready Seconds

`.spec.minReadySeconds` یک فیلد اختیاری است که حداقل تعداد ثانیه‌هایی را مشخص می‌کند که یک پاد تازه
ایجادشده باید بدون این‌که هیچ‌یک از کانتینرهای آن دچار crash شود آماده (ready) بماند، تا در دسترس در نظر گرفته شود.
مقدار پیش‌فرض آن 0 است (پاد به‌محض آماده شدن، در دسترس در نظر گرفته می‌شود). برای اطلاعات بیشتر درباره‌ی این‌که چه زمانی
یک پاد آماده در نظر گرفته می‌شود، به [Container Probes](/docs/concepts/workloads/pods/pod-lifecycle/#container-probes) مراجعه کنید.

### پادهای در حال خاتمه (Terminating)

{{< feature-state feature_gate_name="DeploymentReplicaSetTerminatingReplicas" >}}

شما فقط در صورتی می‌توانید پادهای در حال خاتمه را ببینید که feature gate به نام `DeploymentReplicaSetTerminatingReplicas`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) روی [API server](/docs/reference/command-line-tools-reference/kube-apiserver/)
و [kube-controller-manager](/docs/reference/command-line-tools-reference/kube-controller-manager/) فعال باشد.

پادهایی که به دلیل حذف یا scale down در حال خاتمه (terminating) می‌شوند، ممکن است مدت زیادی طول بکشد تا خاتمه یابند، و ممکن است در آن مدت
منابع اضافی مصرف کنند. در نتیجه، مجموع تعداد همه‌ی پادها می‌تواند به‌طور موقت از
`.spec.replicas` بیشتر شود. پادهای در حال خاتمه را می‌توان با استفاده از فیلد `.status.terminatingReplicas` مربوط به Deployment پیگیری کرد.

### محدودیت تاریخچه‌ی Revision

تاریخچه‌ی revision یک Deployment در ReplicaSetهایی که کنترل می‌کند ذخیره می‌شود.

`.spec.revisionHistoryLimit` یک فیلد اختیاری است که تعداد ReplicaSetهای قدیمی‌ای را که می‌خواهید برای امکان
rollback نگه دارید مشخص می‌کند. این ReplicaSetهای قدیمی در `etcd` منابع مصرف می‌کنند و خروجی `kubectl get rs` را شلوغ می‌کنند. پیکربندی هر revision از Deployment در ReplicaSetهای آن ذخیره می‌شود؛ بنابراین، به‌محض حذف یک ReplicaSet قدیمی، توانایی rollback به آن revision از Deployment را از دست می‌دهید. به‌صورت پیش‌فرض، 10 ReplicaSet قدیمی نگه داشته می‌شود، هرچند مقدار ایده‌آل آن به تناوب و پایداری Deploymentهای جدید بستگی دارد.

به‌طور دقیق‌تر، تنظیم این فیلد روی صفر یعنی همه‌ی ReplicaSetهای قدیمی با 0 replica پاکسازی خواهند شد.
در این حالت، یک rollout جدید از Deployment قابل بازگشت (undo) نیست، چون تاریخچه‌ی revision آن پاکسازی شده است.

### Paused

`.spec.paused` یک فیلد boolean اختیاری برای متوقف کردن و از سرگیری یک Deployment است. تنها تفاوت میان
یک Deployment متوقف‌شده و یکی که متوقف نشده این است که هر تغییری در PodTemplateSpec مربوط به Deployment متوقف‌شده
تا زمانی که متوقف است هیچ rollout جدیدی فعال نمی‌کند. یک Deployment هنگام ایجاد به‌صورت پیش‌فرض متوقف نیست.

## {{% heading "whatsnext" %}}

* درباره‌ی [پادها](/docs/concepts/workloads/pods) بیشتر بیاموزید.
* [اجرای یک اپلیکیشن stateless با استفاده از یک Deployment](/docs/tasks/run-application/run-stateless-application-deployment/).
* {{< api-reference page="apps/deployment-v1" >}} را برای درک API مربوط به Deployment بخوانید.
* درباره‌ی [PodDisruptionBudget](/docs/concepts/workloads/pods/disruptions/) بخوانید و ببینید
  چگونه می‌توانید از آن برای مدیریت در دسترس بودن اپلیکیشن در طول اختلالات (disruptions) استفاده کنید.
* از kubectl برای [ایجاد یک Deployment](/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/) استفاده کنید.