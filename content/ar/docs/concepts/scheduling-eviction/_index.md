---
title: "الجدولة والاستباق والاستبعاد"
weight: 95
content_type: concept
no_list: true
---

في كوبيرنيتيس، تعني الجدولة ضمان مطابقة
{{<glossary_tooltip text="الحُجيرات" term_id="pod">}} مع
{{<glossary_tooltip text="العُقد" term_id="node">}} بحيث يتمكّن
{{<glossary_tooltip text="kubelet" term_id="kubelet">}} من تشغيلها. أما الاستباق
فهو عملية إنهاء الحُجيرات ذات
{{<glossary_tooltip text="الأولوية" term_id="pod-priority">}} الأدنى، حتى تتاح
جدولة الحُجيرات ذات الأولوية الأعلى على العُقد. والاستبعاد هو عملية إنهاء حجيرة
واحدة أو أكثر على العُقد.

## الجدولة

* [مجدول كوبيرنيتيس](/ar/docs/concepts/scheduling-eviction/kube-scheduler/)
* [تشغيل عدة مجدولات](/ar/docs/concepts/scheduling-eviction/running-multiple-schedulers/)
* [إسناد الحُجيرات إلى العُقد](/ar/docs/concepts/scheduling-eviction/assign-pod-node/)
* [الحمل الإضافي للحُجيرة](/ar/docs/concepts/scheduling-eviction/pod-overhead/)
* [قيود انتشار الطوبولوجيا للحُجيرات](/ar/docs/concepts/scheduling-eviction/topology-spread-constraints/)
* [الشوائب والتسامحات](/ar/docs/concepts/scheduling-eviction/taint-and-toleration/)
* [إطار الجدولة](/ar/docs/concepts/scheduling-eviction/scheduling-framework)
* [ضبط أداء المجدول](/ar/docs/concepts/scheduling-eviction/scheduler-perf-tuning/)
* [حزم الموارد للموارد الموسّعة](/ar/docs/concepts/scheduling-eviction/resource-bin-packing/)
* [جاهزية الحُجيرة للجدولة](/ar/docs/concepts/scheduling-eviction/pod-scheduling-readiness/)
* [جدولة PodGroup](/ar/docs/concepts/scheduling-eviction/podgroup-scheduling/)
* [جدولة الجماعة (Gang Scheduling)](/ar/docs/concepts/scheduling-eviction/gang-scheduling/)
* [الجدولة المدركة للبنية الطوبولوجية](/ar/docs/concepts/scheduling-eviction/topology-aware-scheduling/)
* [الاستباق المدرك لأحمال العمل](/ar/docs/concepts/scheduling-eviction/workload-aware-preemption/)
* [Descheduler](https://github.com/kubernetes-sigs/descheduler#descheduler-for-kubernetes)
* [ميزات العُقد المعلَنة](/ar/docs/concepts/scheduling-eviction/node-declared-features/)

## اضطراب الحُجيرات

[اضطراب الحُجيرات](/ar/docs/concepts/workloads/pods/disruptions/) هو العملية التي يتم عبرها إنهاء الحُجيرات على العُقد، سواء طوعاً أو قسراً.

وتبدأ الاضطرابات الطوعية بشكل مقصود من مالكي التطبيقات أو مسؤولي العنقود. أما الاضطرابات القسرية فهي غير مقصودة، وقد تُستدعى من مشكلات لا يمكن تفاديها مثل نفاد موارد العقدة، أو من عمليات حذف عرضية.

* [أولوية الحُجيرة والاستباق](/ar/docs/concepts/scheduling-eviction/pod-priority-preemption/)
* [الاستبعاد بسبب ضغط العقدة](/ar/docs/concepts/scheduling-eviction/node-pressure-eviction/)
* [الاستبعاد الذي يبدأه واجهة API](/ar/docs/concepts/scheduling-eviction/api-eviction/)
