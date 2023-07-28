---
title: مرحبًا Minikube
content_type: tutorial
weight: 5
menu:
  main:
    title: "بداية"
    weight: 10
    post: >
      <p>هل أنت جاهز للبداية؟ أنشئ كلستر كوبيرنيتيس بسيطا يشغل نموذجا لتطبيق.</p>
card:
  name: tutorials
  weight: 10
---

<!-- overview -->

يفسر لك هذا البرنامج التعليمي كيفية تشغيل نموذج لتطبيق على كوبيرنيتيس باستخدام minikube.
يوفر البرنامج التعليمي صورة حاوية تستخدم NGINX لإعادة كتابة جميع الطلبات التي يتوصل بها.

## {{% heading "objectives" %}}

* نشر نموذج تطبيق على عنقود minikube.
* تشغيل التطبيق.
* عرض سجلات التطبيق.

## {{% heading "prerequisites" %}}

يفترض هذا البرنامج التعليمي أنك قمت بالفعل بإعداد `minikube`.
اِستَشر [خطوات تنصيب برنامج minikube](https://minikube.sigs.k8s.io/docs/start/).

تحتاج أيضًا إلى تنصيب `kubectl`.
اِستَشر [تعليمات تنصيب الأدوات](/docs/tasks/tools/#kubectl).

<!-- lessoncontent -->

## إنشاء عنقود minikube

```shell
minikube start
```

## فتح اللوحة الرئيسية للتحكم

افتح اللوحة الرئيسية للتحكم في Kubernetes. يمكنك القيام بذلك بطريقتين مختلفتين:

{{< tabs name="dashboard" >}}
{{% tab name="فتح المتصفح" %}}
افتح مستقبلة حاسوب **جديدة**, وشغل الأمر التالي:

```shell
# Start a new terminal, and leave this running.
minikube dashboard
```

الآن، عد إلى المستقبلة أين شغلت `minikube start`.

{{< note >}}
يضيف الأمر `dashboard` وظيفة لوحة التحكم ويفتح بروكسي في متصفح الويب الذي يستخدمه نظام التشغيل.

يمكنك إنشاء موارد Kubernetes على اللوحة الرئيسية للتحكم مثل Deployment و Service.

إذا كنت تعمل في بيئة بحساب المستخدم ذوي الحقوق المطلقة root، فراجع [كيفية فتح لوحة التحكم بعنوان URL](#open-dashboard-with-url).

ليكن في علمك أنه بشكل افتراضي، لا يمكن الوصول إلى اللوحة الرئيسية للتحكم إلا من داخل الشبكة الافتراضية الداخلية ل Kubernetes.
يقوم الأمر `dashboard` بإنشاء بروكسي مؤقت لضمان إمكانية الوصول إلى لوحة التحكم من خارج الشبكة الافتراضية ل Kubernetes.

لإيقاف البروكسي،إضغط على `Ctrl+C`.
بعد إنتهاء تنفيذ الأمر، تظل لوحة التحكم قيد التشغيل في عنقود Kubernetes.
يمكن أن تشغل الأمر `dashboard` من جديد لإنشاء بروكسي آخر للوصول إلى لوحة التحكم.
{{< /note >}}

{{% /tab %}}
{{% tab name="نسخ ولصق URL" %}}

إذا كنت لا تريد أن يفتح minikube متصفح الويب، فقم بتشغيل أمر `dashboard` مع إضافة الخيار `url--`. سيظهر لك `minikube` عنوان URL الذي يمكنك فتحه على متصفح ويب من إختيارك.

افتح مستقبلة حاسوب **جديدة**, وشغل الأمر التالي:

```shell
# Start a new terminal, and leave this running.
minikube dashboard --url
```

الآن، عد إلى المستقبلة أين شغلت `minikube start`.

{{% /tab %}}
{{< /tabs >}}

## قم بإنشاء عملية نشر

[*البود*](/docs/concepts/workloads/pods/) Kubernetes (بالإنجليزية Pod) هو مجموعة مكونة من حاوية واحدة أو أكثر، مرتبطة ببعضها البعض لأغراض الإدارة والتواصل. البود في هذا
البرنامج التعليمي يتكون من حاوية واحدة فقط.
[*النشر*](/docs/concepts/workloads/controllers/deployment/) Kubernetes (بالإنجليزية Deployment) يتحقق من صحة البود و يعمل على إعادة تشغيل حاوياته إذا توقفت. عمليات النشر هي
الطريقة الموصى بها لإدارة إنشاء وقياس البودات.

1. إستعمل الأمر `kubectl create` من أجل إنشاء النشر الَّذِي يسَيّر البود. يقوم البود بتشغيل الحاوية بناءً على الصورة Docker المعطاة.

    ```shell
    # Run a test container image that includes a webserver
    kubectl create deployment hello-node --image=registry.k8s.io/e2e-test-images/agnhost:2.39 -- /agnhost netexec --http-port=8080
    ```

2. قم بعرض النشر :

    ```shell
    kubectl get deployments
    ```

    النتيجة مشابهة ل :

    ```text
    NAME         READY   UP-TO-DATE   AVAILABLE   AGE
    hello-node   1/1     1            1           1m
    ```

3. قم بعرض البود :

    ```shell
    kubectl get pods
    ```

    النتيجة مشابهة ل :

    ```text
    NAME                          READY     STATUS    RESTARTS   AGE
    hello-node-5f76cf6ccf-br9b5   1/1       Running   0          1m
    ```

4. قم بعرض أحداث الكلستر :

    ```shell
    kubectl get events
    ```

5. قم بعرض إعدادات `kubectl`:

    ```shell
    kubectl config view
    ```

{{< note >}}
لمزيد من المعلومات حول أوامر `kubectl`, انظر [ملخص kubectl](/docs/reference/kubectl/).
{{< /note >}}

## قم بإنشاء خدمة

بشكل إفتراضي، لا يمكن الوصول إلى البود إلا من داخل الكلستر و عبر العنوان آي.بي الداخلي. لجعل الحاوية `hello-node` قابلة للتواصل مع خارج الشبكة الإفتراضية ل Kubernetes ، فيجب عرض البود [*كخدمة*](/docs/concepts/services-networking/service/).

1. قم بعرض البود على الإنترنت العام عن طريق تشغيل الأمر `kubectl expose` :

    ```shell
    kubectl expose deployment hello-node --type=LoadBalancer --port=8080
    ```

    الخيار `type=LoadBalancer--` يشير إلى أنك تريد عرض خدمتك خارج الكلستر.

    يستقبل كود التطبيق ( المعبأ داخل صورة الحاوية) الطلبات على المنفذ TCP رقم 8080 فقط. إذا إستخدمت الأمر `kubectl expose` لعرض الخدمة على منفذ مختلف، فلن يتمكن العملاء من الاتصال بالخدمة على هذا المنفذ.

2. اكتشف الخدمة التي قمت بإنشائها:

    ```shell
    kubectl get services
    ```

    النتيجة مشابهة ل :

    ```text
    NAME         TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
    hello-node   LoadBalancer   10.108.144.78   <pending>     8080:30369/TCP   21s
    kubernetes   ClusterIP      10.96.0.1       <none>        443/TCP          23m
    ```

 موفري السحابة الإلكترونية الذين يدعمون خدمات موازنة التحميل يوفرون عنوان آي.بي خارجي للوصول إلى الخدمة. على minikube ،نوع الخدمة `LoadBalancer` يجعلها قابلة للتواصل من خلال الأمر `minikube service`.

3. شغِّل الأمر التالي:

    ```shell
    minikube service hello-node
    ```

    يفتح هذا الأمر نافذة متصفح لعرض تطبيقك واستجابته.

## تمكين الوظائف الإضافية

تتضمن أداة minikube مجموعة من {{< glossary_tooltip text="الوظائف الإضافية" term_id="addons" >}}  التي يمكن تثبيتها، توقيفها وفتحها في بيئة Kubernetes المحلية.

1. استشر الوظائف الإضافية المدعومة حاليًا:

    ```shell
    minikube addons list
    ```

    النتيجة مشابهة ل :

    ```text
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

2. الآن قم بزيادة وظيفة جديدة `metrics-server`:

    ```shell
    minikube addons enable metrics-server
    ```

    النتيجة مشابهة ل :

    ```text
    The 'metrics-server' addon is enabled
    ```

3. قم بعرض البود و الخدمة اللتان أضيفتا نتيجة زيادة الوظيفة الإضافية:

    ```shell
    kubectl get pod,svc -n kube-system
    ```

    النتيجة مشابهة ل :

    ```
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

4. قم بإزالة وظيفة `metrics-server`:

    ```shell
    minikube addons disable metrics-server
    ```

    النتيجة مشابهة ل :

    ```
    metrics-server was successfully disabled
    ```

## مسح الموارد

يمكنك الآن مسح الموارد التي قمت بإنشائها في عنقودك :

```shell
kubectl delete service hello-node
kubectl delete deployment hello-node
```

أوقف عنقود Minikube :

```shell
minikube stop
```

اختياريًا، قم بمسح الجهاز الإفتراضي ل Minikube :

```shell
# Optional
minikube delete
```

إذا كنت تريد استخدام minikube مرة أخرى لمعرفة المزيد حول Kubernetes، فلا داعي لحذفه.

## {{% heading "whatsnext" %}}

* تعلم المزيد عن [كائنات النشر](/docs/concepts/workloads/controllers/deployment/).
* تعلم المزيد عن [نشر التطبيقات](/docs/tasks/run-application/run-stateless-application-deployment/).
* تعلم المزيد عن [كائنات الخدمة](/docs/concepts/services-networking/service/).
