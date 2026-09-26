---
title: "शेड्यूलिंग, प्रीइम्प्शन और इविक्शन"
weight: 95
content_type: concept
no_list: true
---

कुबेरनेट्स में शेड्यूलिंग का मतलब है कि, किस {{<glossary_tooltip text="पॉड" term_id="pod">}} को किस {{<glossary_tooltip text="नोड" term_id="node">}} पे चलाना है ये निर्धारित किया जा सके ताकि {{<glossary_tooltip text="क्यूबलेट" term_id="kubelet">}} उन्हें उस नोड पर चला सके।

प्रीइम्प्शन का मतलब है कि वो पॉड्स जिनकी {{<glossary_tooltip text="प्रायोरिटी" term_id="pod-priority">}} कम है उन्हें किसी नोड से हटा के वो पॉड्स चला सकें जिनकी प्रायोरिटी ज्यादा है।

इविक्शन का मतलब है कि एक या एक से अधिक पॉड्स को समाप्त किया जा सके।

## शेड्यूलिंग

* [कुबेरनेट्स शेड्यूलर](/docs/concepts/scheduling-eviction/kube-scheduler/)
* [नोड्स को पॉड्स आवंटित करना](/docs/concepts/scheduling-eviction/assign-pod-node/)
* [पॉड ओवरहेड](/docs/concepts/scheduling-eviction/pod-overhead/)
* [पॉड टोपोलॉजी स्प्रेड प्रतिबंध](/docs/concepts/scheduling-eviction/topology-spread-constraints/)
* [टेन्ट्स एंड टॉलरेशंस](/docs/concepts/scheduling-eviction/taint-and-toleration/)
* [शेड्यूलिंग रूपरेखा](/docs/concepts/scheduling-eviction/scheduling-framework)
* [गतिशील संसाधन आवंटन](/docs/concepts/scheduling-eviction/dynamic-resource-allocation)
* [शेड्यूलर परफॉरमेंस ट्यूनिंग](/docs/concepts/scheduling-eviction/scheduler-perf-tuning/)
* [विस्तारित संसाधनों के लिए संसाधन बिन पैकिंग](/docs/concepts/scheduling-eviction/resource-bin-packing/)
* [पॉड शेड्यूलिंग तत्परता](/docs/concepts/scheduling-eviction/pod-scheduling-readiness/)
* [पॉड-समूह शेड्यूलिंग](/docs/concepts/scheduling-eviction/podgroup-scheduling/)
* [गैंग शेड्यूलिंग](/docs/concepts/scheduling-eviction/gang-scheduling/)
* [टोपोलॉजी-सचेत शेड्यूलिंग](/docs/concepts/scheduling-eviction/topology-aware-scheduling/)
* [वर्कलोड-सचेत प्रिएम्प्शन](/docs/concepts/scheduling-eviction/workload-aware-preemption/)
* [डीशेड्यूलर](https://github.com/kubernetes-sigs/descheduler#descheduler-for-kubernetes)
* [नोड घोषित विशेषताएं](/docs/concepts/scheduling-eviction/node-declared-features/)

## पॉड व्यवधान

{{<glossary_definition text="पॉड व्यवधान" term_id="pod-disruption" length="all">}}

* [पॉड प्रायोरिटी और प्रीइम्प्शन](/docs/concepts/scheduling-eviction/pod-priority-preemption/)
* [नोड-प्रेशर इविक्शन](/docs/concepts/scheduling-eviction/node-pressure-eviction/)
* [एपीआई के द्वारा शुरू की गई इविक्शन](/docs/concepts/scheduling-eviction/api-eviction/)