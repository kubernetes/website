---
reviewers:
- mikedanese
- thockin
title: بيئة الحاوية
content_type: concept
weight: 20
---

<!-- overview -->

تصف هذه الصفحة الموارد المتاحة للحاويات في بيئة الحاوية.



<!-- body -->

## بيئة الحاوية

توفّر بيئة الحاوية في كوبيرنيتيس عدة موارد مهمة للحاويات:

* نظام ملفات، وهو مزيج من [صورة](/ar/docs/concepts/containers/images/) و[وحدة تخزين](/ar/docs/concepts/storage/volumes/) واحدة أو أكثر.
* معلومات عن الحاوية نفسها.
* معلومات عن كائنات أخرى في العنقود.

### معلومات الحاوية

اسم *المضيف* (hostname) للحاوية هو اسم الحجيرة التي تعمل فيها الحاوية. وهو متاح
عبر الأمر `hostname` أو عبر استدعاء الدالة
[`gethostname`](https://man7.org/linux/man-pages/man2/gethostname.2.html)
في libc.

واسم الحجيرة ومساحة الأسماء متاحان كمتغيّرات بيئة عبر
[واجهة API التنازلية](/ar/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/).

كما أن متغيّرات البيئة التي يعرّفها المستخدم في تعريف الحجيرة متاحة للحاوية، وكذلك
أي متغيّرات بيئة محدّدة بشكل ثابت في صورة الحاوية.

### معلومات العنقود

تتوفّر للحاوية قائمة بكل الخدمات التي كانت قيد التشغيل عند إنشاء الحاوية، في صورة
متغيّرات بيئة. وتقتصر هذه القائمة على الخدمات الواقعة في مساحة الأسماء نفسها التي
تقع فيها حجيرة الحاوية الجديدة، وعلى خدمات مستوى التحكم في كوبيرنيتيس.

ولخدمة اسمها *foo* تكشف مجموعة من الحُجيرات، تعمل كل واحدة منها حاوية اسمها *bar*،
تُعرَّف المتغيّرات التالية:

```shell
FOO_SERVICE_HOST=<the host the service is running on>
FOO_SERVICE_PORT=<the port the service is running on>
```

وللخدمات عناوين IP مخصّصة، وتكون متاحة للحاوية عبر DNS إذا كانت
[إضافة DNS](https://releases.k8s.io/v{{< skew currentPatchVersion >}}/cluster/addons/dns/)
مفعّلة.




## {{% heading "whatsnext" %}}


* تعلَّم المزيد عن [خطافات دورة حياة الحاوية](/ar/docs/concepts/containers/container-lifecycle-hooks/).
* احصل على خبرة عملية في
  [إرفاق معالجات بأحداث دورة حياة الحاوية](/ar/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/).
