---
title: একটি ক্লাস্টারের জন্য Node ক্যাপাসিটি ওভারপ্রভিশন করুন
content_type: task
weight: 10
---


<!-- overview -->

এই পৃষ্ঠাটি আপনার কুবারনেটিস ক্লাস্টারে {{< glossary_tooltip text="Node" term_id="node" >}}
ওভারপ্রভিশনিং কনফিগার করার মাধ্যমে আপনাকে গাইড করে। Node ওভারপ্রভিশনিং হল একটি কৌশল যা সক্রিয়ভাবে
আপনার ক্লাস্টারের কম্পিউট রিসোর্সের একটি অংশ রিজার্ভ করে। এই রিজার্ভেশন স্কেলিং ইভেন্টের সময় নতুন Pod শিডিউল করার জন্য প্রয়োজনীয় সময় হ্রাস করতে সহায়তা করে, ট্রাফিক বা ওয়ার্কলোড চাহিদার হঠাৎ স্পাইকের প্রতি আপনার ক্লাস্টারের প্রতিক্রিয়াশীলতা বৃদ্ধি করে।

কিছু অব্যবহৃত ক্যাপাসিটি বজায় রেখে, আপনি নিশ্চিত করেন যে নতুন Pod তৈরি হলে রিসোর্স অবিলম্বে উপলব্ধ থাকে, ক্লাস্টার স্কেল আপ করার সময় তাদের পেন্ডিং স্টেটে প্রবেশ করা থেকে প্রতিরোধ করে।

## {{% heading "prerequisites" %}}

- আপনার একটি কুবারনেটিস ক্লাস্টার থাকা প্রয়োজন, এবং kubectl কমান্ড-লাইন টুল অবশ্যই আপনার ক্লাস্টারের সাথে যোগাযোগ করার জন্য কনফিগার করা থাকতে হবে।
- আপনার ইতিমধ্যে
  [Deployment](/bn/docs/concepts/workloads/controllers/deployment/),
  Pod {{< glossary_tooltip text="প্রায়োরিটি" term_id="pod-priority" >}},
  এবং {{< glossary_tooltip text="PriorityClass" term_id="priority-class" >}} সম্পর্কে মৌলিক ধারণা থাকা উচিত।
- আপনার ক্লাস্টার অবশ্যই একটি [অটোস্কেলার](/bn/docs/concepts/cluster-administration/cluster-autoscaling/) দিয়ে সেট আপ করা থাকতে হবে
  যা চাহিদার উপর ভিত্তি করে Node পরিচালনা করে।

<!-- steps -->

## একটি PriorityClass তৈরি করুন

প্লেসহোল্ডার Pod এর জন্য একটি PriorityClass সংজ্ঞায়িত করে শুরু করুন। প্রথমে, একটি নেগেটিভ প্রায়োরিটি ভ্যালু সহ একটি PriorityClass তৈরি করুন, যা আপনি শীঘ্রই প্লেসহোল্ডার Pod এ অ্যাসাইন করবেন।
পরে, আপনি একটি Deployment সেট আপ করবেন যা এই PriorityClass ব্যবহার করে

{{% code_sample language="yaml" file="priorityclass/low-priority-class.yaml" %}}

তারপর PriorityClass তৈরি করুন:

```shell
kubectl apply -f https://k8s.io/examples/priorityclass/low-priority-class.yaml
```

আপনি পরবর্তীতে একটি Deployment সংজ্ঞায়িত করবেন যা নেগেটিভ-প্রায়োরিটি PriorityClass ব্যবহার করে এবং একটি ন্যূনতম কন্টেইনার চালায়।
যখন আপনি এটি আপনার ক্লাস্টারে যোগ করেন, কুবারনেটিস ক্যাপাসিটি রিজার্ভ করতে সেই প্লেসহোল্ডার Pod চালায়। যখনই
ক্যাপাসিটি ঘাটতি থাকে, কন্ট্রোল প্লেন এই প্লেসহোল্ডার Pod গুলির একটিকে
{{< glossary_tooltip text="প্রিএম্পট" term_id="preemption" >}} করার জন্য প্রথম প্রার্থী হিসাবে বেছে নেবে।

## Node ক্যাপাসিটি অনুরোধ করে এমন Pod চালান

নমুনা ম্যানিফেস্ট পর্যালোচনা করুন:

{{% code_sample language="yaml" file="deployments/deployment-with-capacity-reservation.yaml" %}}

### প্লেসহোল্ডার Pod এর জন্য একটি নেমস্পেস বেছে নিন

আপনার একটি {{< glossary_tooltip term_id="namespace" text="নেমস্পেস">}}
নির্বাচন বা তৈরি করা উচিত যেখানে প্লেসহোল্ডার Pod যাবে।

### প্লেসহোল্ডার ডিপ্লয়মেন্ট তৈরি করুন

সেই ম্যানিফেস্টের উপর ভিত্তি করে একটি Deployment তৈরি করুন:

```shell
# নেমস্পেস নাম "example" পরিবর্তন করুন
kubectl --namespace example apply -f https://k8s.io/examples/deployments/deployment-with-capacity-reservation.yaml
```

## প্লেসহোল্ডার রিসোর্স অনুরোধ সামঞ্জস্য করুন

আপনি বজায় রাখতে চান এমন ওভারপ্রভিশনড রিসোর্সের পরিমাণ সংজ্ঞায়িত করতে প্লেসহোল্ডার Pod এর জন্য রিসোর্স অনুরোধ এবং লিমিট কনফিগার করুন। এই রিজার্ভেশন নিশ্চিত করে যে নতুন Pod এর জন্য একটি নির্দিষ্ট পরিমাণ CPU এবং মেমরি উপলব্ধ রাখা হয়।

Deployment এডিট করতে, উপযুক্ত অনুরোধ এবং লিমিট সেট করতে Deployment ম্যানিফেস্ট ফাইলে `resources` সেকশন পরিবর্তন করুন। আপনি সেই ফাইলটি স্থানীয়ভাবে ডাউনলোড করতে পারেন এবং তারপর আপনার পছন্দের যেকোনো টেক্সট এডিটর দিয়ে এটি এডিট করতে পারেন।

আপনি kubectl ব্যবহার করে Deployment এডিট করতে পারেন:

```shell
kubectl edit deployment capacity-reservation
```

উদাহরণস্বরূপ, 5টি প্লেসহোল্ডার Pod জুড়ে মোট 0.5 CPU এবং 1GiB মেমরি রিজার্ভ করতে,
একটি একক প্লেসহোল্ডার Pod এর জন্য রিসোর্স অনুরোধ এবং লিমিট নিম্নরূপ সংজ্ঞায়িত করুন:

```yaml
  resources:
    requests:
      cpu: "100m"
      memory: "200Mi"
    limits:
      cpu: "100m"
```

## কাঙ্ক্ষিত রেপ্লিকা সংখ্যা সেট করুন

### মোট রিজার্ভড রিসোর্স গণনা করুন

<!-- trailing whitespace in next paragraph is significant -->
উদাহরণস্বরূপ, 5টি রেপ্লিকা প্রতিটি 0.1 CPU এবং 200MiB মেমরি রিজার্ভ করে:  
মোট CPU রিজার্ভড: 5 × 0.1 = 0.5 (Pod স্পেসিফিকেশনে, আপনি পরিমাণ `500m` লিখবেন)  
মোট মেমরি রিজার্ভড: 5 × 200MiB = 1GiB (Pod স্পেসিফিকেশনে, আপনি `1 Gi` লিখবেন)  

Deployment স্কেল করতে, আপনার ক্লাস্টারের আকার এবং প্রত্যাশিত ওয়ার্কলোডের উপর ভিত্তি করে রেপ্লিকার সংখ্যা সামঞ্জস্য করুন:

```shell
kubectl scale deployment capacity-reservation --replicas=5
```

স্কেলিং যাচাই করুন:

```shell
kubectl get deployment capacity-reservation
```

আউটপুট আপডেট করা রেপ্লিকার সংখ্যা প্রতিফলিত করা উচিত:

```none
NAME                   READY   UP-TO-DATE   AVAILABLE   AGE
capacity-reservation   5/5     5            5           2m
```

{{< note >}}
কিছু অটোস্কেলার, বিশেষত [Karpenter](/bn/docs/concepts/cluster-administration/cluster-autoscaling/#autoscaler-karpenter),
Node স্কেলিং বিবেচনা করার সময় পছন্দের অ্যাফিনিটি রুলকে হার্ড রুল হিসাবে বিবেচনা করে।
যদি আপনি Karpenter বা অন্য Node অটোস্কেলার ব্যবহার করেন যা একই হিউরিস্টিক ব্যবহার করে,
আপনি এখানে যে রেপ্লিকা সংখ্যা সেট করেন তা আপনার ক্লাস্টারের জন্য একটি ন্যূনতম Node সংখ্যাও সেট করে।
{{< /note >}}

## {{% heading "whatsnext" %}}

- [PriorityClass](/bn/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass) সম্পর্কে আরও জানুন এবং কীভাবে তারা Pod শিডিউলিং প্রভাবিত করে।
- ওয়ার্কলোড চাহিদার উপর ভিত্তি করে গতিশীলভাবে আপনার ক্লাস্টারের আকার সামঞ্জস্য করতে [Node অটোস্কেলিং](/bn/docs/concepts/cluster-administration/cluster-autoscaling/) অন্বেষণ করুন।
- [Pod প্রিএম্পশন](/bn/docs/concepts/scheduling-eviction/pod-priority-preemption/) বুঝুন, রিসোর্স কনটেনশন পরিচালনা করার জন্য কুবারনেটিসের একটি
  মূল মেকানিজম। একই পৃষ্ঠা _ইভিকশন_ কভার করে,
  যা প্লেসহোল্ডার Pod পদ্ধতির জন্য কম প্রাসঙ্গিক, কিন্তু রিসোর্স কনটেন্ড হলে কুবারনেটিসের প্রতিক্রিয়া জানানোর একটি মেকানিজমও।
