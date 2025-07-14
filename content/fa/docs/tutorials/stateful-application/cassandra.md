---
title: "مثال: استقرار Cassandra با StatefulSet"
reviewers:
- moh0ps
content_type: tutorial
weight: 30
---

<!-- overview -->
این آموزش به شما نشان می دهد که چگونه [Apache Cassandra] (https://cassandra.apache.org/) را در کوبرنتیز اجرا کنید. Cassandra، یک پایگاه داده، برای ارائه دوام داده ها به ذخیره سازی دائمی نیاز دارد (Application _state_). در این مثال، یک ارائه‌دهنده بذر Cassandra سفارشی به پایگاه داده اجازه می‌دهد تا نمونه‌های جدید Cassandra را هنگام پیوستن به خوشه Cassandra کشف کند.

*StatefulSets* استقرار برنامه های دارای وضعیت را در خوشه کوبرنتیز شما آسان تر می کند. برای اطلاعات بیشتر در مورد ویژگی های استفاده شده در این آموزش، به [StatefulSet](/docs/concepts/workloads/controllers/statefulset/) مراجعه کنید.

{{< توجه >}}
Cassandra و کوبرنتیز هر دو از اصطلاح گره به معنای عضوی از یک خوشه استفاده می کنند. در این آموزش، پادهایی که متعلق به StatefulSet هستند، گره‌های Cassandraهستند و اعضای خوشه کاساندرا (که حلقه نامیده می‌شود) می‌باشند. وقتی آن پادها در خوشه کوبرنتیز شما اجرا می‌شوند، صفحه کنترل کوبرنتیز، آن پادها را روی کوبرنتیز زمان‌بندی می‌کند.
{{< glossary_tooltip text="گره ها" term_id="node" >}}.

هنگامی که یک گره Cassandra شروع به کار می کند، از یک لیست دانه برای راه اندازی کشف سایرین استفاده می کند
گره ها در حلقه این آموزش یک ارائه‌دهنده دانه کاساندرا سفارشی را مستقر می‌کند که به پایگاه داده اجازه می‌دهد پادهای Cassandra جدید را هنگام ظاهر شدن در خوشه کوبرنتیز شما کشف کند.
{{< /توجه >}}


## {{% heading "Objectives" %}}

* ایجاد و اعتبارسنجی یک سرویس بدون سر کاساندرا {{< glossary_tooltip text="سرویس" term_id="service" >}}.
* از {{< glossary_tooltip term_id="StatefulSet" >}} برای ایجاد حلقه کاساندرا استفاده کنید.
* اعتبارسنجی StatefulSet.
* StatefulSet را تغییر دهید.
* StatefulSet و {{< glossary_tooltip text="پادها" term_id="pod" >}} آن را حذف نمایید.


## {{% heading "Prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

برای تکمیل این آموزش، شما باید از قبل آشنایی اولیه با{{< glossary_tooltip text="پادها" term_id="pod" >}},
{{< glossary_tooltip text="سرویس ها" term_id="service" >}}, و
{{< glossary_tooltip text="StatefulSets" term_id="StatefulSet" >}}.

### دستورالعمل‌های اضافی برای راه‌اندازی Minikube

{{< احتیاط >}}
[Minikube](https://minikube.sigs.k8s.io/docs/) به طور پیش‌فرض روی 2048 مگابایت حافظه و 2 پردازنده تنظیم شده است.

اجرای Minikube با پیکربندی پیش‌فرض منابع منجر به خطاهای منابع ناکافی در طول این آموزش می‌شود. برای جلوگیری از این خطاها، Minikube را با تنظیمات زیر اجرا کنید:

```shell
minikube start --memory 5120 --cpus=4
```
{{< /احتیاط >}}


<!-- lessoncontent -->
## ایجاد یک سرویس بدون سر برای کاساندرا {#creating-a-cassandra-headless-service}

در کوبرنتیز، یک {{< glossary_tooltip text="سرویس" term_id="service" >}} مجموعه‌ای از {{< glossary_tooltip text="پادها" term_id="pod" >}} را توصیف می‌کند که وظیفه یکسانی را انجام می‌دهند.

سرویس زیر برای جستجوی DNS بین Cassandra پادها و کلاینت‌های درون خوشه شما استفاده می‌شود:

{{% code_sample file="application/cassandra/cassandra-service.yaml" %}}

یک سرویس برای ردیابی همه اعضای Cassandra StatefulSet از پرونده `cassandra-service.yaml` ایجاد کنید:

```shell
kubectl apply -f https://k8s.io/examples/application/cassandra/cassandra-service.yaml
```


### اعتبارسنجی (اختیاری) {#validating}

سرویس کاساندرا را دریافت کنید.

```shell
kubectl get svc cassandra
```

پاسخ این است
```
NAME        TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
cassandra   ClusterIP   None         <none>        9042/TCP   45s
```

اگر سرویسی با نام `cassandra` را نمی‌بینید، به این معنی است که ایجاد آن ناموفق بوده است. برای کمک به عیب‌یابی مشکلات رایج، [Debug Services](/docs/tasks/debug/debug-application/debug-service/) را مطالعه کنید.

## استفاده از StatefulSet برای ایجاد یک حلقه کاساندرا

تنظیمات StatefulSet که در زیر آمده است، یک حلقه کاساندرا ایجاد می‌کند که از سه پاد تشکیل شده است.

{{< توجه >}}
این مثال از ارائه‌دهنده پیش‌فرض برای Minikube استفاده می‌کند.
لطفاً StatefulSet زیر را برای ابری که با آن کار می‌کنید، به‌روزرسانی کنید.
{{< /توجه >}}

{{% code_sample file="application/cassandra/cassandra-statefulset.yaml" %}}

Cassandra StatefulSet را از پرونده «cassandra-statefulset.yaml» ایجاد کنید:

```shell
# اگر می‌توانید cassandra-statefulset.yaml را بدون تغییر اعمال کنید، از این استفاده کنید.
kubectl apply -f https://k8s.io/examples/application/cassandra/cassandra-statefulset.yaml
```

اگر می‌خواهید «cassandra-statefulset.yaml» را مطابق با خوشه خود تغییر دهید، https://k8s.io/examples/application/cassandra/cassandra-statefulset.yaml را دانلود کنید و سپس آن تنظیمات را از پرونده‌ای که نسخه اصلاح شده را در آن ذخیره کرده‌اید اعمال کنید:
```shell
# اگر نیاز به تغییر cassandra-statefulset.yaml به صورت محلی دارید، از این استفاده کنید
kubectl apply -f cassandra-statefulset.yaml
```


## اعتبار سنجی Cassandra StatefulSet

1. Cassandra StatefulSet را دریافت کنید:

    ```shell
    kubectl get statefulset cassandra
    ```

    پاسخ باید مشابه زیر باشد:

    ```
    NAME        DESIRED   CURRENT   AGE
    cassandra   3         0         13s
    ```

    منبع «StatefulSet» پادها را به ترتیب مستقر می‌کند.

1. پادها را وادار کنید تا وضعیت ایجاد سفارش داده شده را مشاهده کنند:

    ```shell
    kubectl get pods -l="app=cassandra"
    ```

    پاسخ باید مشابه زیر باشد:

    ```shell
    NAME          READY     STATUS              RESTARTS   AGE
    cassandra-0   1/1       Running             0          1m
    cassandra-1   0/1       ContainerCreating   0          8s
    ```

    ممکن است چند دقیقه طول بکشد تا هر سه پاد مستقر شوند. پس از استقرار آنها، همان دستور خروجی مشابه زیر را برمی‌گرداند:

    ```
    NAME          READY     STATUS    RESTARTS   AGE
    cassandra-0   1/1       Running   0          10m
    cassandra-1   1/1       Running   0          9m
    cassandra-2   1/1       Running   0          8m
    ```

3. برای نمایش وضعیت حلقه، Cassandra [nodetool] (https://cwiki.apache.org/confluence/display/CASSANDRA2/NodeTool) را در اولین پاد اجرا کنید.

    ```shell
    kubectl exec -it cassandra-0 -- nodetool status
    ```

    پاسخ باید چیزی شبیه به این باشد:

    ```
    Datacenter: DC1-K8Demo
    ======================
    Status=Up/Down
    |/ State=Normal/Leaving/Joining/Moving
    --  Address     Load       Tokens       Owns (effective)  Host ID                               Rack
    UN  172.17.0.5  83.57 KiB  32           74.0%             e2dd09e6-d9d3-477e-96c5-45094c08db0f  Rack1-K8Demo
    UN  172.17.0.4  101.04 KiB  32           58.8%             f89d6835-3a42-4419-92b3-0e62cae1479c  Rack1-K8Demo
    UN  172.17.0.6  84.74 KiB  32           67.1%             a6a1e8c2-3dc5-4417-b1a0-26507af2aaad  Rack1-K8Demo
    ```

## اصلاح Cassandra StatefulSet

برای تغییر اندازه‌ی یک Cassandra StatefulSet از دستور `kubectl edit` استفاده کنید.

1. دستور زیر را اجرا کنید:

    ```shell
    kubectl edit statefulset cassandra
    ```

    این دستور یک ویرایشگر در خط فرمان شما باز می‌کند. خطی که باید تغییر دهید، بخش `replicas` است. نمونه زیر گزیده‌ای از پرونده StatefulSet است:

    ```yaml
    # لطفاً شیء زیر را ویرایش کنید. خطوطی که با '#' شروع می‌شوند نادیده گرفته می‌شوند،
    # و یک فایل خالی، ویرایش را متوقف می‌کند. اگر هنگام ذخیره این فایل خطایی رخ دهد،
    # با رفع نواقص مربوطه، دوباره بازگشایی خواهد شد.
    #
    apiVersion: apps/v1
    kind: StatefulSet
    metadata:
      creationTimestamp: 2016-08-13T18:40:58Z
      generation: 1
      labels:
      app: cassandra
      name: cassandra
      namespace: default
      resourceVersion: "323"
      uid: 7a219483-6185-11e6-a910-42010a8a0fc0
    spec:
      replicas: 3
    ```

1. تعداد کپی‌ها را به ۴ تغییر دهید و سپس تنظیمات را ذخیره کنید.

    The StatefulSet now scales to run with 4 Pods.

1. برای تأیید تغییر خود، Cassandra StatefulSet را دریافت کنید:

    ```shell
    kubectl get statefulset cassandra
    ```

    پاسخ باید مشابه زیر باشد:

    ```
    NAME        DESIRED   CURRENT   AGE
    cassandra   4         4         36m
    ```



## {{% heading "پاکسازی" %}}

حذف یا کاهش مقیاس StatefulSet حجم های مرتبط با StatefulSet را حذف نمی کند. این تنظیم برای ایمنی شماست زیرا داده‌های شما ارزشمندتر از آن هستند که به طور خودکار تمام منابع مرتبط StatefulSet را پاک کنید.

{{< هشدار >}}
بسته به کلاس ذخیره‌سازی و سیاست بازپس‌گیری، حذف *PersistentVolumeClaims* ممکن است باعث حذف حجم های مرتبط نیز شود. هرگز فرض نکنید که در صورت حذف حجم های مربوطه، می‌توانید به آنها دسترسی داشته باشید.
{{< /هشدار >}}

1. دستورات زیر را (که به صورت زنجیروار در یک دستور واحد قرار گرفته‌اند) اجرا کنید تا همه چیز در Cassandra StatefulSet حذف شود:

    ```shell
    grace=$(kubectl get pod cassandra-0 -o=jsonpath='{.spec.terminationGracePeriodSeconds}') \
      && kubectl delete statefulset -l app=cassandra \
      && echo "Sleeping ${grace} seconds" 1>&2 \
      && sleep $grace \
      && kubectl delete persistentvolumeclaim -l app=cassandra
    ```

1. دستور زیر را برای حذف سرویسی که برای کاساندرا تنظیم کرده‌اید، اجرا کنید:

    ```shell
    kubectl delete service -l app=cassandra
    ```

## متغیرهای محیطی کانتینر کاساندرا

پادها در این آموزش از پرونده image [`gcr.io/google-samples/cassandra:v13`](https://github.com/kubernetes/examples/blob/master/cassandra/image/Dockerfile) از [container registry] گوگل (https://cloud.google.com/container-registry/docs/) استفاده می‌کنند. docker image  بالا بر اساس [debian-base](https://github.com/kubernetes/release/tree/master/images/build/debian-base) است و شامل OpenJDK 8 نیز می‌شود.

این تصویر شامل یک نسخه استاندارد نصب شده کاساندرا از مخزن آپاچی دبیان است. با استفاده از متغیرهای محیطی می‌توانید مقادیری را که در `cassandra.yaml` درج شده‌اند، تغییر دهید.

| Environment variable     | Default value    |
| ------------------------ |:---------------: |
| `CASSANDRA_CLUSTER_NAME` | `'Test Cluster'` |
| `CASSANDRA_NUM_TOKENS`   | `32`             |
| `CASSANDRA_RPC_ADDRESS`  | `0.0.0.0`        |



## {{% heading "What's next?" %}}


* یاد بگیرید که چگونه یک StatefulSet را [مقیاس‌بندی کنید](/docs/tasks/run-application/scale-stateful-set/).
* درباره [*KubernetesSeedProvider*]بیشتر بدانید (https://github.com/kubernetes/examples/blob/master/cassandra/java/src/main/java/io/k8s/cassandra/KubernetesSeedProvider.java)
* تنظیمات بیشتر [Seed Provider Configurations] (https://git.k8s.io/examples/cassandra/java/README.md) را ببینید.



