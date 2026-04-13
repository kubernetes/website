---
reviewers:
- nelvadas
title: লিমিট রেঞ্জ
api_metadata:
- apiVersion: "v1"
  kind: "LimitRange"
content_type: concept
weight: 10
---

<!-- overview -->

ডিফল্টভাবে, কন্টেইনারগুলি একটি Kubernetes ক্লাস্টারে সীমাহীন [compute resources](/docs/concepts/configuration/manage-resources-containers/) দিয়ে চলে।
Kubernetes [resource quotas](/docs/concepts/policy/resource-quotas/) ব্যবহার করে,
প্রশাসকরা (যাদের _cluster operators_ ও বলা হয়) একটি নির্দিষ্ট
{{< glossary_tooltip text="namespace" term_id="namespace" >}} এর মধ্যে ক্লাস্টার রিসোর্স (যেমন CPU সময়, মেমরি, এবং পার্সিস্টেন্ট স্টোরেজ) এর ব্যবহার এবং তৈরি সীমাবদ্ধ করতে পারেন।
একটি namespace এর মধ্যে, একটি {{< glossary_tooltip text="Pod" term_id="Pod" >}} যতটা CPU এবং মেমরি ব্যবহার করতে পারে যতটা সেই namespace এ প্রযোজ্য ResourceQuotas দ্বারা অনুমোদিত। একজন ক্লাস্টার অপারেটর হিসাবে, বা একজন namespace-স্তরের প্রশাসক হিসাবে, আপনি এটাও নিশ্চিত করতে চিন্তিত হতে পারেন যে একটি একক অবজেক্ট একটি namespace এর মধ্যে সমস্ত উপলব্ধ রিসোর্স একচেটিয়া করতে পারে না।

একটি LimitRange হল একটি নীতি যা রিসোর্স বরাদ্দ (limits এবং requests) সীমাবদ্ধ করে যা আপনি একটি namespace এ প্রতিটি প্রযোজ্য অবজেক্ট ধরনের (যেমন Pod বা {{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}}) জন্য নির্দিষ্ট করতে পারেন।

<!-- body -->

একটি _LimitRange_ সীমাবদ্ধতা প্রদান করে যা পারে:

- একটি namespace এ প্রতি Pod বা Container এর জন্য ন্যূনতম এবং সর্বোচ্চ compute resources ব্যবহার প্রয়োগ করুন।
- একটি namespace এ প্রতি {{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}} এর জন্য ন্যূনতম এবং সর্বোচ্চ স্টোরেজ অনুরোধ প্রয়োগ করুন।
- একটি namespace এ একটি রিসোর্সের জন্য request এবং limit এর মধ্যে একটি অনুপাত প্রয়োগ করুন।
- একটি namespace এ compute resources এর জন্য ডিফল্ট request/limit সেট করুন এবং রানটাইমে স্বয়ংক্রিয়ভাবে সেগুলি Container এ ইনজেক্ট করুন।


একটি LimitRange একটি নির্দিষ্ট namespace এ প্রয়োগ করা হয় যখন সেই namespace এ একটি
LimitRange অবজেক্ট থাকে।

একটি LimitRange অবজেক্টের নাম অবশ্যই একটি বৈধ
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names) হতে হবে।

## রিসোর্স limits এবং requests এর উপর সীমাবদ্ধতা

- প্রশাসক একটি namespace এ একটি LimitRange তৈরি করেন।
- ব্যবহারকারীরা সেই namespace এ অবজেক্ট তৈরি করেন (বা তৈরি করার চেষ্টা করেন), যেমন Pods বা PersistentVolumeClaims।
- প্রথমত, `LimitRange` admission controller সমস্ত Pods (এবং তাদের containers) এর জন্য ডিফল্ট request এবং limit মান প্রয়োগ করে যা compute resource requirements সেট করে না।
- দ্বিতীয়ত, `LimitRange` ব্যবহার ট্র্যাক করে নিশ্চিত করতে যে এটি namespace এ উপস্থিত যেকোনো `LimitRange` এ সংজ্ঞায়িত রিসোর্স minimum, maximum এবং ratio অতিক্রম করে না।
- আপনি যদি একটি `LimitRange` সীমাবদ্ধতা লঙ্ঘন করে এমন একটি অবজেক্ট (Pod বা PersistentVolumeClaim) তৈরি বা আপডেট করার চেষ্টা করেন, API সার্ভারে আপনার অনুরোধ HTTP স্ট্যাটাস কোড `403 Forbidden` এবং লঙ্ঘিত সীমাবদ্ধতা ব্যাখ্যা করে একটি বার্তা সহ ব্যর্থ হবে।
- আপনি যদি একটি namespace এ একটি `LimitRange` যোগ করেন যা compute-সম্পর্কিত রিসোর্স যেমন
 `cpu` এবং `memory` এ প্রযোজ্য, আপনাকে অবশ্যই
  সেই মানগুলির জন্য requests বা limits নির্দিষ্ট করতে হবে। অন্যথায়, সিস্টেম Pod তৈরি প্রত্যাখ্যান করতে পারে।
- `LimitRange` যাচাইকরণ শুধুমাত্র Pod admission পর্যায়ে ঘটে, চলমান Pods এ নয়।
  আপনি যদি একটি LimitRange যোগ বা পরিবর্তন করেন, সেই namespace এ ইতিমধ্যে বিদ্যমান Pods
  অপরিবর্তিত থাকে।
- যদি দুই বা ততোধিক `LimitRange` অবজেক্ট namespace এ থাকে, তাহলে কোন ডিফল্ট মান প্রয়োগ করা হবে তা নির্ধারণযোগ্য নয়।


## Pods এর জন্য LimitRange এবং admission checks

একটি `LimitRange` এটি প্রয়োগ করা ডিফল্ট মানগুলির সামঞ্জস্য পরীক্ষা করে **না**। এর মানে হল যে `LimitRange` দ্বারা সেট করা _limit_ এর জন্য একটি ডিফল্ট মান spec এ container এর জন্য নির্দিষ্ট _request_ মানের চেয়ে কম হতে পারে যা একটি ক্লায়েন্ট API সার্ভারে জমা দেয়। যদি এটি ঘটে, চূড়ান্ত Pod শিডিউলযোগ্য হবে না।

উদাহরণস্বরূপ, আপনি এই ম্যানিফেস্ট দিয়ে একটি `LimitRange` সংজ্ঞায়িত করেন:

{{% code_sample file="concepts/policy/limit-range/problematic-limit-range.yaml" %}}


একটি Pod এর সাথে যা `700m` এর একটি CPU resource request ঘোষণা করে, কিন্তু একটি limit নয়:

{{% code_sample file="concepts/policy/limit-range/example-conflict-with-limitrange-cpu.yaml" %}}


তাহলে সেই Pod শিডিউল করা হবে না, এর মতো একটি ত্রুটি সহ ব্যর্থ হবে:
```
Pod "example-conflict-with-limitrange-cpu" is invalid: spec.containers[0].resources.requests: Invalid value: "700m": must be less than or equal to cpu limit
```

আপনি যদি `request` এবং `limit` উভয়ই সেট করেন, তাহলে সেই নতুন Pod একই `LimitRange` থাকা সত্ত্বেও সফলভাবে শিডিউল হবে:

{{% code_sample file="concepts/policy/limit-range/example-no-conflict-with-limitrange-cpu.yaml" %}}

## উদাহরণ রিসোর্স সীমাবদ্ধতা

`LimitRange` ব্যবহার করে তৈরি করা যেতে পারে এমন নীতির উদাহরণ হল:

- 8 GiB RAM এবং 16 cores এর ক্ষমতা সহ একটি 2 node ক্লাস্টারে, একটি namespace এ Pods কে 100m CPU অনুরোধ করতে এবং CPU এর জন্য সর্বোচ্চ 500m limit এবং Memory এর জন্য 200Mi অনুরোধ এবং Memory এর জন্য সর্বোচ্চ 600Mi limit সীমাবদ্ধ করুন।
- তাদের specs এ cpu এবং memory requests ছাড়া শুরু হওয়া Containers এর জন্য ডিফল্ট CPU limit এবং request 150m এবং memory ডিফল্ট request 300Mi সংজ্ঞায়িত করুন।

যে ক্ষেত্রে namespace এর মোট limits Pods/Containers এর limits এর সমষ্টির চেয়ে কম,
রিসোর্সের জন্য প্রতিদ্বন্দ্বিতা হতে পারে। এই ক্ষেত্রে, Containers বা Pods তৈরি করা হবে না।

প্রতিদ্বন্দ্বিতা বা একটি LimitRange এর পরিবর্তন ইতিমধ্যে তৈরি করা রিসোর্সগুলিকে প্রভাবিত করবে না।

## {{% heading "whatsnext" %}}

limits ব্যবহারের উদাহরণের জন্য, দেখুন:

- [how to configure minimum and maximum CPU constraints per namespace](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)।
- [how to configure minimum and maximum Memory constraints per namespace](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)।
- [how to configure default CPU Requests and Limits per namespace](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)।
- [how to configure default Memory Requests and Limits per namespace](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)।
- [how to configure minimum and maximum Storage consumption per namespace](/docs/tasks/administer-cluster/limit-storage-consumption/#limitrange-to-limit-requests-for-storage)।
- একটি [detailed example on configuring quota per namespace](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)।

প্রসঙ্গ এবং ঐতিহাসিক তথ্যের জন্য [LimitRanger design document](https://git.k8s.io/design-proposals-archive/resource-management/admission_control_limit_range.md) দেখুন।
