---
title: شهادات البنية التحتية للمفتاح العام PKI و المتطلبات
reviewers:
- sig-docs-ar-reviews
content_type: concept
weight: 50
---

<!-- overview -->


كوبرنيتيز يتطلب شهادات البنية التحتية للمفتاح العام PKI للمصادقة عبر نظام أمان طبقة النقل (Transport Layer Security - TLS)
إذا قمت بتثبيت كوبرنيتيز باستخدام [kubeadm](/docs/reference/setup-tools/kubeadm/), الشهادات
المطلوبة من طرف العنقود تنشأ بطريقة تلقائية.
تستطيع أيضًا توليد شهاداتك الخاصة على سبيل المثال، للحفاظ على المفاتيح الخاصة بك بشكل أكثر أمانًا وعدم تخزينها على خادم واجهة برمجة التطبيقات (API). 



<!-- body -->

## كيف يستخدم العنقود تلك الشهادات  
 

كوبيرنيتيس يتطلب البنية التحتية للمفتاح العام للعمليات التالية:

* شهادات المستخدم للكيوبليت للمصادقة على خادم واجهة برمجة التطبيقات
* كيوبليت [شهادات الخادم](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/#client-and-serving-certificates)
  لكي يتواصل خادم واجهة برمجة التطبيقات مع kubelets
* شهادة الخادم لنقطة نهاية الخادم
* شهادات المستخدم للمسؤولين عن إدارة العنقود للمصادقة على خادم واجهة برمجة التطبيقات 

* شهادات العميل للتحدث إلى خوادم كيوبليت 
* شهادة العميل لخادم واجهة برمجة التطبيقات للتحدث إلى etcd
* شهادة العميل/kubeconfig لمدير وحدة التحكم من أجل الحديث مع خادم واجهة برمجة التطبيقات 
* شهادة العميل/kubeconfig للمجدول للتحدث إلى خادم واجهة برمجة التطبيقات.
* شهادات كل من العميل والخادم [front-proxy](/docs/tasks/extend-kubernetes/configure-aggregation-layer/)


{{< note >}}
شهادات `front-proxy`  مطلوبة فقط إذا كنت تشغل kube-proxy  من أجل دعم
[an extension API server](/docs/tasks/extend-kubernetes/setup-extension-api-server/).
أيضا etcd يطبق TLS المتبادل لمصادقة العملاء والأقران  
{{< /note >}}


## أين يتم تخزين الشهادات

إذا قمت بتثبيت كوبيرنيتيس باستخدام kubeadm، ستجد أن معظم الشهادات مخزنة في `/etc/kubernetes/pki`.
جميع المسارات في هذه الوثائق نسبية إلى هذا الدليل، باستثناء شهادات حساب المستخدم التي يضعها kubeadm في `/etc/kubernetes`
.


## ضبط الشهادات يدويا

إذا لم ترغب في أن ينشئ kubeadm الشهادات المطلوبة، فيمكنك إنشاؤها باستخدام شهادة جذر واحدة أو عن طريق توفير جميع الشهادات. راجع [الشهادات](/docs/tasks/administer-cluster/certificates/)  من أجل المزيد من المعلومات حول إنشاء  سُلْطَة شهادات خاصة بك .
راجع [تسيير الشهادات عن طريق kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/)
من أجل المزيد حول تسيير الشهادات.



### شهادة الجذر الواحد  

يمكنك إنشاء شهادة جذر واحدة، يتحكم فيها المسؤول. ثم يمكن لهذه الشهادة إنشاء عدة شهادات وسيطة، وتفويض جميع عمليات الإنشاء التالية إلى كوبيرنيتيس نفسه.

الشهادات المطلوبة:



|         المسار                |          الاسم المشترك الافتراضي    |                  الوصف                                                                 |  
|--------------------------------|-----------------------------------|---------------------------------------------------------------------------------------|
| ca.crt,key                     | kubernetes-ca                     | Kubernetes general CA                                                                 |
| etcd/ca.crt,key                | etcd-ca                           | For all etcd-related functions                                                        |
| front-proxy-ca.crt,key         | kubernetes-front-proxy-ca         | For the [front-end proxy](/docs/tasks/extend-kubernetes/configure-aggregation-layer/) |


بالإضافة إلى شهادات الاعتماد (CA) المطروحة في الجدول السابق، من الضروري أيضًا الحصول على زوج مفتاح عام/خاص لإدارة حساب الخدمة، `sa.key` و `sa.pub`.
المثال التالي يوضح ملفات المفاتيح والشهادات CA المبينة في الجدول السابق:


```
/etc/kubernetes/pki/ca.crt
/etc/kubernetes/pki/ca.key
/etc/kubernetes/pki/etcd/ca.crt
/etc/kubernetes/pki/etcd/ca.key
/etc/kubernetes/pki/front-proxy-ca.crt
/etc/kubernetes/pki/front-proxy-ca.key
```




### كل الشهادات

إذا لم ترغب في نسخ مفاتيح CA الخاصة إلى العنقود، يمكنك إنشاء جميع الشهادات بنفسك.  


الشهادات المطلوبة:



|          الاسم المميز الافتراضي             |    الشهادة الأم  |           إسم المالك (في الموضوع) |                    النوع  |               المستضيفين (SAN)                                                                  |
|-----------------------------------|---------------------------|-----------------------------------|------------------|---------------------------------------------------------------------------------------------------------|           
| kube-etcd                         | etcd-ca                   |                                   | خادم, مستخدم     |  `<إسم المستضيف>` , `<عنوان بروتوكول الأنترنت_للمستضيف>`, `المستضيف المحلي`, `127.0.0.1`                  |
| kube-etcd-peer                    | etcd-ca                   |                                   | خادم, مستخدم     |  `<إسم المستضيف>` , `<عنوان بروتوكول الأنترنت_للمستضيف>`, `المستضيف المحلي`, `127.0.0.1`                  |
| kube-etcd-healthcheck-client      | etcd-ca                   |                                   | مستخدم           |                                                                                                         |
| kube-apiserver-etcd-client        | etcd-ca                   |                                   | مستخدم           |                                                                                                         |
| kube-apiserver                    | kubernetes-ca             |                                   | خادم             |  `<إسم المستضيف>`, `<عنوان بروتوكول الأنترنت_للمستضيف>`, `<إعلان عنوان بروتوكول الإنترنت>`, `[1]`          |
| kube-apiserver-kubelet-client     | kubernetes-ca             | system:masters                    | مستخدم           |                                                                                                         | 
| front-proxy-client                | kubernetes-front-proxy-ca |                                   | مستخدم           |                                                                                                         | 




{{< note >}}
 بدلاً من استخدام مجموعة المستخدم الأعلى `system:masters` لأجل `kubeadm:cluster-admins` 
يمكن استخدام مجموعة بأقل صلاحيات.
يستخدم kubeadm مجموعة `kubeadm:cluster-admins` لهذا الغرض.
{{< /note >}}



[1]: أي عنوان IP آخر أو اسم نظام أسماء النطاقات  (DNS) تتصل به على العنقود الخاص بك ( كما هو مستخدم بواسطة [kubeadm](/docs/reference/setup-tools/kubeadm/)
موازن التحميل يقوم يثتبيث عنوان
IP و/أو  إسم  آخر أو اسم نظام أسماء النطاقات  (DNS) `kubernetes`, `kubernetes.default`, `kubernetes.default.svc`,
`kubernetes.default.svc.cluster`, `kubernetes.default.svc.cluster.local` )

حيث `kind` يقابل واحد أو أكثر من استخدامات مفتاح x509، والتي تم توثيقها أيضًا في
`.spec.usages` من
[شهادة طلب التوقيع](/docs/reference/kubernetes-api/authentication-resources/certificate-signing-request-v1#CertificateSigningRequest)


النوع:

| الطبيعة                           |                                     الاستخدام الرئيسي                                               |
|------------------------------------------------------|---------------------------------------------------------------------------------|
| خادم                                               |   التوقيع الرقمي, تشفير المفتاح, المصادقة على الخادم                              |
| مستخدم                                      | التوقيع الرقمي, تشفير المفتاح, المصادقة على المستخدم                                     |



{{< note >}}
المضيفين/  شبكة منطقة التخزين (SAN) المذكورة أعلاه هي الموصى بها للحصول على عنقود شغال؛ إذا تطلب إعداد محدد، فمن الممكن إضافة SAN إضافية على جميع شهادات الخادم
{{< /note >}}



{{< note >}}
لمستخدمي kubeadm فقط :

* السيناريو الذي تقوم فيه بنسخ شهادات CA الخاصة بالعنقود الخاص بك دون المفاتيح الخاصة يُشار إليه باسم CA خارجي في توثيق kubeadm.
* إذا كنت تقارن القائمة أعلاه بـالبنية التحتية للمفتاح العام (PKI)  المولد بواسطة kubeadm، يرجى الانتباه إلى أن
  `kube-etcd`, `kube-etcd-peer` و `kube-etcd-healthcheck-client` لا يتم إنشاء شهادات في حالة etcd الخارجي
.
{{< /note >}}

### مسارات الشهادات


يجب وضع الشهادات في المسار الموصى به (كما هو مستخدم بواسطة [kubeadm](/docs/reference/setup-tools/kubeadm/)).
يجب تحديد المسارات باستخدام الخاصية المعطاة بغض النظر عن الموقع.

| الاسم المشترك الافتراضي     |        المسار الموصى به للشهادة     | المسار الموصى به للمفتاح    | الأمر     | خاصية المفتاح                |    خاصية الشهادة                                     |
|------------------------------|------------------------------|-----------------------------|--------------------------|------------------------------|---------------------------------------------------------------|
| etcd-ca                      | etcd/ca.key                  | etcd/ca.crt                 | kube-apiserver           |                              | --etcd-cafile                                                 |
| kube-apiserver-etcd-client   | apiserver-etcd-client.key    | apiserver-etcd-client.crt   | kube-apiserver           | --etcd-keyfile               | --etcd-certfile                                               |
| kubernetes-ca                | ca.key                       | ca.crt                      | kube-apiserver           |                              | --client-ca-file                                              |
| kubernetes-ca                | ca.key                       | ca.crt                      | kube-controller-manager  | --cluster-signing-key-file   | --client-ca-file, --root-ca-file, --cluster-signing-cert-file |
| kube-apiserver               | apiserver.key                | apiserver.crt               | kube-apiserver           | --tls-private-key-file       | --tls-cert-file                                               |
| kube-apiserver-kubelet-client| apiserver-kubelet-client.key | apiserver-kubelet-client.crt| kube-apiserver           | --kubelet-client-key         | --kubelet-client-certificate                                  |
| front-proxy-ca               | front-proxy-ca.key           | front-proxy-ca.crt          | kube-apiserver           |                              | --requestheader-client-ca-file                                |
| front-proxy-ca               | front-proxy-ca.key           | front-proxy-ca.crt          | kube-controller-manager  |                              | --requestheader-client-ca-file                                |
| front-proxy-client           | front-proxy-client.key       | front-proxy-client.crt      | kube-apiserver           | --proxy-client-key-file      | --proxy-client-cert-file                                      |
| etcd-ca                      | etcd/ca.key                  | etcd/ca.crt                 | etcd                     |                              | --trusted-ca-file, --peer-trusted-ca-file                     |
| kube-etcd                    | etcd/server.key              | etcd/server.crt             | etcd                     | --key-file                   | --cert-file                                                   |
| kube-etcd-peer               | etcd/peer.key                | etcd/peer.crt               | etcd                     | --peer-key-file              | --peer-cert-file                                              |
| etcd-ca                      |                              | etcd/ca.crt                 | etcdctl                  |                              | --cacert                                                      |
| kube-etcd-healthcheck-client | etcd/healthcheck-client.key  | etcd/healthcheck-client.crt | etcdctl                  | --key                        | --cert                                                        |

نفس الاعتبارات تنطبق على زوج مفتاح حساب الخدمة:

| مسار المفتاح الخاص  |     مسار المفتاح العام  |      الأمر       |           الخاصية                  |
|-------------------|------------------|-------------------------|--------------------------------------|
|  sa.key           |                  | kube-controller-manager | --service-account-private-key-file   |
|                   | sa.pub           | kube-apiserver          | --service-account-key-file           |

المثال التالي يوضح مسارات الملفات [من الجداول السابقة](#مسارات-الشهادات)
تحتاج إلى توفير ذلك إذا كنت تقوم بإنشاء جميع مفاتيحك وشهاداتك بنفسك



```
/etc/kubernetes/pki/etcd/ca.key
/etc/kubernetes/pki/etcd/ca.crt
/etc/kubernetes/pki/apiserver-etcd-client.key
/etc/kubernetes/pki/apiserver-etcd-client.crt
/etc/kubernetes/pki/ca.key
/etc/kubernetes/pki/ca.crt
/etc/kubernetes/pki/apiserver.key
/etc/kubernetes/pki/apiserver.crt
/etc/kubernetes/pki/apiserver-kubelet-client.key
/etc/kubernetes/pki/apiserver-kubelet-client.crt
/etc/kubernetes/pki/front-proxy-ca.key
/etc/kubernetes/pki/front-proxy-ca.crt
/etc/kubernetes/pki/front-proxy-client.key
/etc/kubernetes/pki/front-proxy-client.crt
/etc/kubernetes/pki/etcd/server.key
/etc/kubernetes/pki/etcd/server.crt
/etc/kubernetes/pki/etcd/peer.key
/etc/kubernetes/pki/etcd/peer.crt
/etc/kubernetes/pki/etcd/healthcheck-client.key
/etc/kubernetes/pki/etcd/healthcheck-client.crt
/etc/kubernetes/pki/sa.key
/etc/kubernetes/pki/sa.pub
```


## إعداد الشهادات لحسابات المستخدمين

يجب عليك تكوين هذه الحسابات الإدارية وحسابات الخدمة يدويًا:

| إسم الملف        |            اسم بيانات الاعتماد           | الاسم المشترك الافتراضي      | إسم المالك (في الموضوع)       |
|-------------------------|----------------------------|-----------------------------------------|------------------------|
| admin.conf              | default-admin              | kubernetes-admin                        | `<مدير-المجموعة>`        |
| super-admin.conf        | default-super-admin        | kubernetes-super-admin                  | system:masters         |
| kubelet.conf            | default-auth               | system:node:`<إسم العقدة>` (أنظر للملاحظة) | system:nodes           |
| controller-manager.conf | default-controller-manager | system:kube-controller-manager          |                        |
| scheduler.conf          | default-scheduler          | system:kube-scheduler                   |                        |


{{< note >}}
قيمة `<إسم العقدة>` لـ `kubelet.conf` **يجب** أن تتطابق تمامًا مع قيمة اسم العقدة المعطاة من طرف كيوبليت عند تسجيله مع apiserver خادم واجهة برمجة التطبيقات (خادم و ب ت) . للمزيد من التفاصيل، إقرأ [ترخيص العقدة](/docs/reference/access-authn-authz/node/).
{{< /note >}}


{{< note >}}
في المثال أعلاه، `<admin-group>` هو تنفيذ محدد. بعض الأدوات توقع الشهادة في `admin.conf` الافتراضي ليكون جزءًا من مجموعة `system:masters`. `system:masters` هي مجموعة مستخدم رئيسية للطوارئ يمكنها تجاوز طبقة التفويض في كوبيرنيتيس، مثل RBAC. كما أن بعض الأدوات لا تنشئ `super-admin.conf` منفصلة مع شهادة مرتبطة بهذه المجموعة المستخدم الرئيسية.

يقوم kubeadm بإنشاء شهادتي مسؤول منفصلتين في ملفات kubeconfig.
واحدة موجودة في `admin.conf` وتحمل `Subject: O = kubeadm:cluster-admins, CN = kubernetes-admin`.
`kubeadm:cluster-admins` هي مجموعة مخصصة مرتبطة بـ `cluster-admin` ClusterRole.
يتم إنشاء هذا الملف على جميع الأجهزة التي يتم إستعمالها كمتحكم بواسطة kubeadm.


 الملف الآخر موجود في `super-admin.conf` والذي له `Subject: O = system:masters, CN = kubernetes-super-admin`.
يتم إنشاء هذا الملف فقط على  مستوى العقدة أين تم تنفيد الأمر `kubeadm init`.
{{< /note >}}

1. لكل تكوين، قم بإنشاء زوج شهادة/مفتاح x509 مع CN و O المحددين.
2. قم بتشغيل `kubectl` كما يلي لكل تكوين:


```
KUBECONFIG=<filename> kubectl config set-cluster default-cluster --server=https://<host ip>:6443 --certificate-authority <path-to-kubernetes-ca> --embed-certs
KUBECONFIG=<filename> kubectl config set-credentials <credential-name> --client-key <path-to-key>.pem --client-certificate <path-to-cert>.pem --embed-certs
KUBECONFIG=<filename> kubectl config set-context default-system --cluster default-cluster --user <credential-name>
KUBECONFIG=<filename> kubectl config use-context default-system
```

يتم استخدام هذه الملفات على النحو التالي:


| إسم الملف        |                   الأمر        | التعليق                                                               |
|-------------------------|-------------------------|-----------------------------------------------------------------------|
| admin.conf              | kubectl                 |  ضبط المستخدم المسؤول للعنقود                                         |
| super-admin.conf        | kubectl                 |  ضبط المستخدم المسؤول الأعلى للعنقود                                  |
| kubelet.conf            | kubelet                 |  واحد مطلوب لكل عقدة على مستوى العنقود                                 |
| controller-manager.conf | kube-controller-manager | يجب إضافته على مستوى المانيفست `manifests/kube-controller-manager.yaml` |
| scheduler.conf          | kube-scheduler          | يجب إضافته على مستوى المانيفست  `manifests/kube-scheduler.yaml`         |

الملفات التالية توضح المسارات الكاملة للملفات المدرجة في الجدول السابق:


```
/etc/kubernetes/admin.conf
/etc/kubernetes/super-admin.conf
/etc/kubernetes/kubelet.conf
/etc/kubernetes/controller-manager.conf
/etc/kubernetes/scheduler.conf
```


