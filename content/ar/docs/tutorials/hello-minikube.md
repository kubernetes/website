---
title: مرحبًا، مينيكيوب
content_type: tutorial
weight: 5
menu:
  main:
    title: "ابدأ الآن"
    weight: 10
    post: >
       <p>مستعد للبدء؟ قم ببناء عنقود كوبيرنيتيس بسيط لتشغيل عينة تطبيق .</p>
card:
  name: tutorials
  weight: 10
---

<!-- overview -->

يوفر هذا الدليل كيفية تشغيل تطبيق عينة على كوبيرنيتيس باستخدام مينيكيوب.
يقدم الدليل صورة حاوية تستخدم نجينكس لإعادة توجيه جميع الطلبات.

## {{% heading "objectives" %}}

* نشر تطبيق عينة على مينيكيوب.
* تشغيل التطبيق.
* عرض سجلات التطبيق.

## {{% heading "prerequisites" %}}

يفترض هذا البرنامج التعليمي أنك قد قمت بإعداد `مينيكيوب` بالفعل.
يرجى الرجوع إلى __الخطوة 1__ في [بدء مينيكيوب](https://minikube.sigs.k8s.io/docs/start/) للحصول على تعليمات التثبيت.

{{< note >}}
قم بتنفيذ التعليمات فقط في __الخطوة 1، التثبيت__. الباقي مغطى في هذه الصفحة.
{{< /note >}}

كما يتعين عليك تثبيت `kubectl`.
يرجى الرجوع إلى [تثبيت الأدوات](/docs/tasks/tools/#kubectl) للحصول على تعليمات التثبيت.

<!-- lessoncontent -->

## إنشاء عنقود مينيكيوب

```shell
minikube start
```

## فتح  لوحة المعلومات

افتح لوحة معلومات كوبيرنيتيس. يمكنك فعل ذلك بطريقتين مختلفتين:

{{< tabs name="dashboard" >}}
{{% tab name="Launch a browser" %}}
افتح **سطر أوامر* جديدًا، وقم بتشغيل:

```shell
# ابدأ سطر أوامر جديد واترك هذا الأمر يعمل.
minikube dashboard
```

الآن، قم بالتبديل إلى سطر الأوامر حيث قمت بتشغيل `minikube start`.

## نشر التطبيق

[*حجيرة*](/docs/concepts/workloads/pods/) كوبيرنيتيس هي مجموعة من حاويات واحدة أو أكثر، مرتبطة معًا لأغراض الإدارة والشبكات. الحجيرة في هذا البرنامج التعليمي لديها حاوية واحدة فقط. يتحقق [*النشر*](/docs/concepts/workloads/controllers/deployment/) في كوبيرنيتيس من صحة حجيرتك ويعيد تشغيل حاوية الحجيرة إذا انتهت. النشر هو الطريقة الموصى بها لإدارة إنشاء و تحجيم الحجائر.

1. استخدم أمر `kubectl create` لإنشاء نشر يدير حجيرة. تعمل الحجيرة على حاوية تعتمد على صورة دوكر المقدمة:

    ```shell
    # تشغيل صورة حاوية اختبار تتضمن خادم شبكةالويب
    kubectl create deployment hello-node --image=registry.k8s.io/e2e-test-images/agnhost:2.39 -- /agnhost netexec --http-port=8080
    ```

1. عرض النشر:

    ```shell
    kubectl get deployments
    ```

    الناتج مشابه للتالي:

    ```shell
    NAME         READY   UP-TO-DATE   AVAILABLE   AGE
    hello-node   1/1      1            1           1m
    ```

1. عرض الحجيرات:

    ```shell
    kubectl get pods
    ```

    الناتج مشابه للتالي:

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

   الناتج مشابه للتالي:

   ```shell
   I0911 09:19:26.677397       1 log.go:195] Started HTTP server on port 8080
   I0911 09:19:26.677586       1 log.go:195] Started UDP server on port  8081
   ```

{{< note >}}
لمزيد من المعلومات حول أوامر `kubectl`، انظر [نظرة عامة على kubectl](/docs/reference/kubectl/).
{{< /note >}}

## إنشاء خدمة

بشكل افتراضي، الحجيرة متاحة فقط عبر عنوان بروتوكول الإنترنت (ب إي) الداخلي ضمن العنقود الخاص بكوبيرنيتيس. لجعل حاوية `hello-node` متاحة من خارج الشبكة الافتراضية لكوبيرنيتيس، يجب عليك تعريض الحجيرة ك[*خدمة*](/docs/concepts/services-networking/service/) كوبيرنيتيس.

1. قم بتعريض الحجيرة للإنترنت العام باستخدام أمر `kubectl expose`:

    ```shell
    kubectl expose deployment hello-node --type=LoadBalancer --port=8080
    ```

    العلم `--type=LoadBalancer` يشير إلى أنك تريد تعريض خدمتك خارج العنقود.

    الكود التطبيقي داخل صورة الاختبار يستمع فقط على منفذ TCP 8080. إذا استخدمت `kubectl expose` لتعريض منفذ مختلف، لن يتمكن العملاء من الاتصال بذلك المنفذ الآخر.

2. عرض الخدمة التي أنشأتها:

    ```shell
    kubectl get services
    ```

    الناتج مشابه للتالي:

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

    الناتج مشابه للتالي:

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

    الناتج مشابه للتالي:

    ```shell
    The 'metrics-server' addon is enabled
    ```

1. عرض الحجيرة والخدمة التي أنشأتها من خلال تثبيت تلك الإضافة:

    ```shell
    kubectl get pod,svc -n kube-system
    ```

    الناتج مشابه للتالي:

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

    الناتج مشابه للتالي:

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

    الناتج مشابه للتالي:

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

إذا كنت ترغب في استخدام مينيكيوب مرة أخرى للتعرف على المزيد حول كوبيرنيتيس، فلا حاجة لحذفه.

## الختام

تمت تغطية الجوانب الأساسية للحصول على عنقود مينيكيوب جاهزًا للتشغيل. أنت الآن جاهز لنشر التطبيقات.

## {{% heading "whatsnext" %}}

* البرنامج التعليمي لـ _[نشر التطبيق الأول على كوبيرنيتيس باستخدام kubectl](/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/)_.
* تعلم المزيد حول [النشر](/docs/concepts/workloads/controllers/deployment/).
* تعلم المزيد حول [نشر التطبيقات](/docs/tasks/run-application/run-stateless-application-deployment/).
* تعلم المزيد حول [الخدمة](/docs/concepts/services-networking/service/).