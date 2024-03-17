---
title: "শিডিউলিং, প্রিএম্পশন এবং ইভিকশন"
weight: 95
content_type: concept
description: >
   কুবারনেটিসে, শিডিউলিং মানে হল নিশ্চিত করা যে পডগুলি নোডগুলির 
   সাথে মিলিত হয়েছে কিনা যাতে কিউবলেট তাদের রান করতে পারে। 
   প্রিএম্পশন হল স্বল্প অগ্রাধিকার পডগুলি বাতিল করার প্রক্রিয়া যাতে উচ্চ 
   অগ্রাধিকার পডগুলি নোডগুলিতে শিডিউল করতে পারে। ইভিকশন হল 
   রিসোর্স-ক্ষুধার্ত নোডগুলিতে এক বা একাধিক পডগুলি প্রত্যাহার করার প্রক্রিয়া।
no_list: True
---

কুবারনেটিসে, শিডিউলিং মানে হল নিশ্চিত করা যে {{<glossary_tooltip text="পডগুলি" term_id="pod">}} 
{{<glossary_tooltip text="নোডগুলির" term_id="node">}} সাথে মিলিত হয়েছে কিনা যাতে {{<glossary_tooltip text="কিউবলেট" term_id="kubelet">}} তাদের 
রান করতে পারে। প্রিএম্পশন হল স্বল্প {{<glossary_tooltip text="অগ্রাধিকার" term_id="pod-priority">}} পডগুলি বাতিল করার প্রক্রিয়া
যাতে উচ্চ অগ্রাধিকার পডগুলি নোডগুলিতে শিডিউল করতে পারে। ইভিকশন হল সম্পদ-ক্ষুধার্ত নোডগুলিতে এক বা 
একাধিক পডগুলি প্রত্যাহার করার প্রক্রিয়া।

## শিডিউলিং

* [কুবারনেটস এর শিডিউলিং](/docs/concepts/scheduling-eviction/kube-scheduler/)
* [নোডগুলিতে পডস বরাদ্দ করা](/docs/concepts/scheduling-eviction/assign-pod-node/)
* [পডসের অতিরিক্ত ব্যয়](/docs/concepts/scheduling-eviction/pod-overhead/)
* [পডস এর টপোলজি ছড়িয়ে যাওয়ার সীমাবদ্ধতা](/docs/concepts/scheduling-eviction/topology-spread-constraints/)
* [টেইন্টস এবং টলারেশনস](/docs/concepts/scheduling-eviction/taint-and-toleration/)
* [শিডিউলিং ফ্রেমওয়ার্ক](/docs/concepts/scheduling-eviction/scheduling-framework)
* [গতিশীল রিসোর্স বরাদ্দ করা](/docs/concepts/scheduling-eviction/dynamic-resource-allocation)
* [শিডিউলিং এর টিউনিং করার কর্মক্ষমতা](/docs/concepts/scheduling-eviction/scheduler-perf-tuning/)
* [সম্প্রসারিত রিসোর্স এর জন্য রিসোর্স বিন প্যাকিং](/docs/concepts/scheduling-eviction/resource-bin-packing/)
* [পড শিডিউলিং এর সাধনযোগ্যতা](/docs/concepts/scheduling-eviction/pod-scheduling-readiness/)
* [ডিশেডিউলার](https://github.com/kubernetes-sigs/descheduler#descheduler-for-kubernetes)

## পডস এর ভাঙ্গন

{{<glossary_definition term_id="pod-disruption" length="all">}}

* [পড অগ্রাধিকার এবং প্রিম্পশন](/docs/concepts/scheduling-eviction/pod-priority-preemption/)
* [নোড-চাপের জন্য ইভিকশন](/docs/concepts/scheduling-eviction/node-pressure-eviction/)
* [API-প্রবর্তিত ইভিকশন](/docs/concepts/scheduling-eviction/api-eviction/)
