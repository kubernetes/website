---
title: مرحبًا، مينيكيوب
content_type: tutorial
weight: 5
menu:
  main:
    title: "ابدأ الآن"
    weight: 10
    post: >
       <p>مستعد للبدء؟ قم ببناء عنقود كوبيرنيتيس بسيط لتشغيل تطبيق تجريبي .</p>
card:
  name: tutorials
  weight: 10
---

<!-- overview -->

يعرض هذا الدليل كيفية تشغيل تطبيق تجريبي على كوبيرنيتيس باستخدام مينيكيوب.
يقدم الدليل صورة حاوية  لإنجينكس (Nginx) لإعادة توجيه جميع الطلبات على الشبكة.

## {{% heading "objectives" %}}

* نشر تطبيق تجريبي على عنقود مينيكيوب.
* تشغيل التطبيق.
* عرض سجلات التطبيق.

## {{% heading "prerequisites" %}}

يفترض هذا البرنامج التعليمي أنك قمت بإعداد `مينيكيوب` مسبقاً.
راجع تعليمات الإعداد في __الخطوة 1__ من [بدء مينيكيوب](https://minikube.sigs.k8s.io/ar/docs/start/) للحصول على تعليمات التثبيت.

{{< note >}}
قم بتنفيذ التعليمات فقط في __الخطوة 1، التثبيت__. الباقي مغطى في هذه الصفحة.
{{< /note >}}

كما يتعين عليك تثبيت `kubectl`.
يرجى مراجعة [تثبيت الأدوات](/ar/docs/tasks/tools/#kubectl) للحصول على تعليمات التثبيت.

<!-- lessoncontent -->

## إنشاء عنقود مينيكيوب

```shell
minikube start
```

## فتح  لوحة المعلومات

افتح لوحة معلومات كوبيرنيتيس. يمكنك فعل ذلك بطريقتين مختلفتين:

{{< tabs name="dashboard" >}}
{{% tab name="Launch a browser" %}}
افتح **سطر أوامر* جديد، وقم بتشغيل:

```shell
# ابدأ سطر أوامر جديد واترك هذا الأمر يعمل.
minikube dashboard
```

الآن، قم بالتبديل إلى سطر الأوامر حيث قمت بتشغيل `minikube start`.

{{% /tab %}}
{{< /tabs >}}

## نشر التطبيق

[*الحجيرة*](/ar/docs/concepts/workloads/pods/) في كوبيرنيتيس هي مجموعة تتكون من حاوية واحدة أو عدة حاويات، مرتبطة معاً لأغراض الإدارة والشبكات. الحجيرة في هذا البرنامج التعليمي تحتوي على حاوية واحدة فقط. [*النشر*](/ar/docs/concepts/workloads/controllers/deployment/) في كوبيرنيتيس هو وحدة تتولى إنشاء وإدارة وتحجيم الحجيرات، وهي الأداة الموصى باستخدامها لتلك الأغراض. يحافظ النشر على صحة حجيرتك ويعيد تشغيل الحاويات داخلها إذا توقفت.

1. استخدم أمر `kubectl create` لإنشاء نشر يدير حجيرة. تعمل الحجيرة على حاوية مبنية على صورة دوكر الآتية:

    ```shell
    # شَغِل صورة حاوية تتضمن خادم شبكة الويب لفحص النظام
    kubectl create deployment hello-node --image=registry.k8s.io/e2e-test-images/agnhost:2.39 -- /agnhost netexec --http-port=8080
    ```

1. عرض النشر:

    ```shell
    kubectl get deployments
    ```

    :سيبدو الناتج مشابهاً للتالي

    ```shell
    NAME         READY   UP-TO-DATE   AVAILABLE   AGE
    hello-node   1/1      1            1           1m
    ```

1. عرض الحجيرات:

    ```shell
    kubectl get pods
    ```

    :سيبدو الناتج مشابهاً للتالي

    ```shell
    NAME                          READY     STATUS    RESTARTS   AGE
    hello-node-5f76cf6ccf-br9b5   1/1       Running   0          1m
    ```

1. عرض أحداث العنقود:

    ```shell
    kubectl get events
    ```

1. عرض إعدادات `kubectl`:

    ```shell
    kubectl config view
    ```

1. عرض سجلات التطبيق لحاوية في حجيرة.

   ```shell
   kubectl logs hello-node-5f76cf6ccf-br9b5
   ```

   :سيبدو الناتج مشابهاً للتالي

   ```shell
   I0911 09:19:26.677397       1 log.go:195] Started HTTP server on port 8080
   I0911 09:19:26.677586       1 log.go:195] Started UDP server on port  8081
   ```

{{< note >}}
لمزيد من المعلومات حول أوامر `kubectl`، انظر [نظرة عامة على kubectl](/ar/docs/reference/kubectl/).
{{< /note >}}

## إنشاء خدمة

تتاح الحجيرة طبيعياً فقط عبر عنوان بروتوكول الإنترنت (IP) الداخلي للعنقود. لإتاحة حاوية `hello-node` خارج الشبكة الافتراضية للعنقود، يجب عليك إبراز الحجيرة ك[*خدمة*](/docs/concepts/services-networking/service/) كوبيرنيتيس.

1. قم بإبراز الحجيرة للإنترنت العام باستخدام أمر `kubectl expose`:

    ```shell
    kubectl expose deployment hello-node --type=LoadBalancer --port=8080
    ```

    العلم `--type=LoadBalancer` يشير إلى أنك تريد بإبراز خدمتك خارج العنقود.

    الكود التطبيقي داخل صورة الاختبار يستمع فقط على منفذ TCP 8080. إذا استخدمت `kubectl expose` لتعريض منفذ مختلف، لن يتمكن العملاء من الاتصال بذلك المنفذ الآخر.

2. عرض الخدمة التي أنشأتها:

    ```shell
    kubectl get services
    ```

    :سيبدو الناتج مشابهاً للتالي

    ```shell
    NAME         TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
    hello-node   LoadBalancer   10.108.144.78   <pending>     8080:30369/TCP   21s
    kubernetes   ClusterIP      10.96.0.1       <none>        443/TCP          23m
    ```

    على مزودي الخدمة السحابية التي تدعم موزع الحمل، سيتم توفير عنوان (ب إي) خارجي للوصول إلى الخدمة. في حالة استخدام مينيكيوب، يجعل النوع `LoadBalancer` الخدمة متاحة من خلال الأمر `minikube service`.

3. قم بتشغيل الأمر التالي:

    ```shell
    minikube service hello-node
    ```

    هذا يفتح نافذة متصفح تخدم تطبيقك وتعرض استجابة التطبيق.

## تفعيل الإضافات

يتضمن برنامج مينيكيوب مجموعة من الإضافات المدمجة التي يمكن تفعيلها، تعطيلها وفتحها في بيئة كوبيرنيتيس المحلية.

1. سرد الإضافات المدعومة حالياً:

    ```shell
    minikube addons list
    ```

    :سيبدو الناتج مشابهاً للتالي

    ```shell
    addon-manager: enabled
    dashboard: enabled
    default-storageclass: enabled
    efk: disabled
    freshpod: disabled
    gvisor: disabled
    helm-tiller: disabled
    ingress: disabled
    ingress-dns: disabled
    logviewer: disabled
    metrics-server: disabled
    nvidia-driver-installer: disabled
    nvidia-gpu-device-plugin: disabled
    registry: disabled
    registry-creds: disabled
    storage-provisioner: enabled
    storage-provisioner-gluster: disabled
    ```

    1. تفعيل إضافة، على سبيل المثال، `metrics-server`:

    ```shell
    minikube addons enable metrics-server
    ```

    :سيبدو الناتج مشابهاً للتالي

    ```shell
    The 'metrics-server' addon is enabled
    ```

1. عرض الحجيرة والخدمة التي أُنشِئت نتيجة تفعيل تلك الإضافة:

    ```shell
    kubectl get pod,svc -n kube-system
    ```

    :سيبدو الناتج مشابهاً للتالي

    ```shell
    NAME                                        READY     STATUS    RESTARTS   AGE
    pod/coredns-5644d7b6d9-mh9ll                1/1       Running   0          34m
    pod/coredns-5644d7b6d9-pqd2t                1/1       Running   0          34m
    pod/metrics-server-67fb648c5                1/1       Running   0          26s
    pod/etcd-minikube                           1/1       Running   0          34m
    pod/influxdb-grafana-b29w8                  2/2       Running   0          26s
    pod/kube-addon-manager-minikube             1/1       Running   0          34m
    pod/kube-apiserver-minikube                 1/1       Running   0          34m
    pod/kube-controller-manager-minikube        1/1       Running   0          34m
    pod/kube-proxy-rnlps                        1/1       Running   0          34m
    pod/kube-scheduler-minikube                 1/1       Running   0          34m
    pod/storage-provisioner                     1/1       Running   0          34m

    NAME                           TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)             AGE
    service/metrics-server         ClusterIP   10.96.241.45    <none>        80/TCP              26s
    service/kube-dns               ClusterIP   10.96.0.10      <none>        53/UDP,53/TCP       34m
    service/monitoring-grafana     NodePort    10.99.24.54     <none>        80:30002/TCP        26s
    service/monitoring-influxdb    ClusterIP   10.111.169.94   <none>        8083/TCP,8086/TCP   26s
    ```

1. تحقق من الناتج من `metrics-server`:

    ```shell
    kubectl top pods
    ```

    :سيبدو الناتج مشابهاً للتالي

    ```shell
    NAME                         CPU(cores)   MEMORY(bytes)   
    hello-node-ccf4b9788-4jn97   1m           6Mi             
    ```

    إذا رأيت الرسالة التالية، انتظر وحاول مرة أخرى:

    ```shell
    error: Metrics API not available
    ```

1. تعطيل `metrics-server`:

    ```shell
    minikube addons disable metrics-server
    ```

    :سيبدو الناتج مشابهاً للتالي

    ```shell
   metrics-server was successfully disabled
    ```

## إزالة الموارد

الآن يمكنك إزالة الموارد التي أنشأتها في عنقودك:

```shell
kubectl delete service hello-node
kubectl delete deployment hello-node
```

إيقاف عنقود مينيكيوب

```shell
minikube stop
```

اختياريًا، حذف خادم الافتراضي الخاص بـ مينيكيوب:

```shell
# اختياري
minikube delete
```

إذا كنت ترغب في استخدام مينيكيوب مرة أخرى لتعلم المزيد عن كوبيرنيتيس، فلا حاجة لحذفه.

## الختام

تمت تغطية الجوانب الأساسية للحصول على عنقود مينيكيوب جاهزًا للتشغيل. أنت الآن جاهز لنشر التطبيقات.

## {{% heading "whatsnext" %}}

* البرنامج التعليمي لـ _[نشر التطبيق الأول على كوبيرنيتيس باستخدام kubectl](/ar/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/)_.
* تعلم المزيد عن [النشر](/ar/docs/concepts/workloads/controllers/deployment/).
* تعلم المزيد عن [نشر التطبيقات](/ar/docs/tasks/run-application/run-stateless-application-deployment/).
* تعلم المزيد عن [الخدمة](/ar/docs/concepts/services-networking/service/).