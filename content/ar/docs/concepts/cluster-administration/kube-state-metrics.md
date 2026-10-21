---
title: قياسات لحالات كائنات كوبيرنيتيس
content_type: concept
weight: 75
description: >-
   kube-state-metrics، وكيل إضافي لتوليد قياسات على مستوى العنقود وإتاحتها.
---

يمكن إتاحة حالة كائنات كوبيرنيتيس في واجهة برمجة تطبيقات كوبيرنيتيس في هيئة قياسات. ويستطيع
وكيل إضافي اسمه [kube-state-metrics](https://github.com/kubernetes/kube-state-metrics)
الاتصال بخادم API كوبيرنيتيس وإتاحة نقطة نهاية HTTP تحمل قياسات مولَّدة من حالة
الكائنات الفردية في العنقود. وهو يكشف معلومات متنوعة عن حالة الكائنات، مثل الوسوم
والتعليقات التوضيحية، وأوقات البدء والإنهاء، والحالة أو الطور الذي يمرّ به الكائن
حالياً. فمثلاً، تنشئ الحاويات العاملة داخل الحُجيرات قياس `kube_pod_container_info`.
ويتضمن ذلك اسم الحاوية، واسم الحجيرة التي تنتمي إليها، و
{{< glossary_tooltip text="مساحة الأسماء" term_id="namespace" >}} التي تعمل فيها
الحجيرة، واسم صورة الحاوية، ومعرّف الصورة، واسم الصورة من مواصفات الحاوية (spec)،
ومعرّف الحاوية العاملة، ومعرّف الحجيرة، في صورة وسوم.

{{% thirdparty-content single="true" %}}

ويمكن الآن استخدام مكوّن خارجي قادر على سحب (scrape) نقطة نهاية kube-state-metrics
(مثلاً عبر Prometheus) لتمكين حالات الاستخدام التالية.

## مثال: استخدام قياسات kube-state-metrics للاستعلام عن حالة العنقود {#example-kube-state-metrics-query-1}

تساعد السلاسل الزمنية للقياسات المولَّدة من kube-state-metrics على جمع رؤى أعمق
حول العنقود، إذ يمكن استخدامها في الاستعلامات.

وإذا كنت تستخدم Prometheus أو أداة أخرى تستخدم لغة الاستعلام نفسها، فإن استعلام
PromQL التالي يُعيد عدد الحُجيرات غير الجاهزة:

```
count(kube_pod_status_ready{condition="false"}) by (namespace, pod)
```

## مثال: التنبيه بالاستناد إلى kube-state-metrics {#example-kube-state-metrics-alert-1}

تتيح القياسات المولَّدة من kube-state-metrics أيضاً التنبيه على المشكلات في
العنقود.

وإذا كنت تستخدم Prometheus أو أداة مشابهة تستخدم لغة قواعد التنبيه نفسها، فإن
التنبيه التالي سيُطلق إذا كانت هناك حُجيرات في حالة `Terminating` لأكثر من 5
دقائق:

```yaml
groups:
- name: Pod state
  rules:
  - alert: PodsBlockedInTerminatingState
    expr: count(kube_pod_deletion_timestamp) by (namespace, pod) * count(kube_pod_status_reason{reason="NodeLost"} == 0) by (namespace, pod) > 0
    for: 5m
    labels:
      severity: page
    annotations:
      summary: Pod {{$labels.namespace}}/{{$labels.pod}} blocked in Terminating state.
```
