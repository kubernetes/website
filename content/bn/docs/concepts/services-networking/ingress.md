---
# reviewers:
# - bprashanth
title: ইনগ্রেস
api_metadata:
- apiVersion: "networking.k8s.io/v1"
  kind: "Ingress"
- apiVersion: "networking.k8s.io/v1"
  kind: "IngressClass"
content_type: concept
description: >-
  আপনার HTTP (বা HTTPS) নেটওয়ার্ক সার্ভিসকে একটি প্রোটোকল-সচেতন কনফিগারেশন
  প্রক্রিয়া ব্যবহার করে এভেইল্যাবল করুন, যা URI, হোস্টনাম, পাথ এবং আরও অনেক কিছুর মতো ওয়েব ধারণাগুলি বোঝে।
  ইনগ্রেস ধারণাটি আপনাকে কুবারনেটিস API এর মাধ্যমে ডিফাইন নিয়মগুলির উপর ভিত্তি করে বিভিন্ন ব্যাকএন্ডে
  ট্রাফিক ম্যাপ করতে দেয়।
weight: 30
---

<!-- overview -->
{{< feature-state for_k8s_version="v1.19" state="stable" >}}
{{< glossary_definition term_id="ingress" length="all" >}}

{{< note >}}
ইনগ্রেস স্থগিত করা হয়েছে। নতুন ফিচারগুলি [Gateway API](/docs/concepts/services-networking/gateway/) তে যোগ করা হচ্ছে।
{{< /note >}}

<!-- body -->

## টার্মিনোলোজি {#terminology}

স্পষ্টতার জন্য, এই গাইড নিম্নলিখিত টার্মগুলি সংজ্ঞায়িত করে:

* নোড: কুবারনেটিস-এ একটি ওয়ার্কার মেশিন, যা একটি ক্লাস্টারের অংশ।
* ক্লাস্টার: একটি সেট নোড যা কুবারনেটিস দ্বারা পরিচালিত কন্টেইনারাইজড অ্যাপ্লিকেশন চালায়।
  এই উদাহরণের জন্য, এবং বেশিরভাগ সাধারণ কুবারনেটিস ডিপ্লয়মেন্টে, ক্লাস্টারের নোডগুলি
  পাবলিক ইন্টারনেটের অংশ নয়।
* এজ রাউটার: একটি রাউটার যা আপনার ক্লাস্টারের জন্য ফায়ারওয়াল নীতি প্রয়োগ করে। এটি
  একটি ক্লাউড প্রদানকারী দ্বারা পরিচালিত একটি গেটওয়ে বা হার্ডওয়্যারের একটি শারীরিক অংশ হতে পারে।
* ক্লাস্টার নেটওয়ার্ক: একটি সেট লিঙ্ক, লজিক্যাল বা ফিজিক্যাল, যা কুবারনেটিস [নেটওয়ার্কিং মডেল](/docs/concepts/cluster-administration/networking/)
  অনুযায়ী একটি ক্লাস্টারের মধ্যে যোগাযোগ সহজতর করে।
* সার্ভিস: একটি কুবারনেটিস {{< glossary_tooltip term_id="service" >}} যা
  {{< glossary_tooltip text="লেবেল" term_id="label" >}} সিলেক্টর ব্যবহার করে একটি পড সেট সনাক্ত করে।
  অন্যথায় উল্লেখ না করা হলে, সার্ভিসগুলি শুধুমাত্র ক্লাস্টার নেটওয়ার্কের মধ্যে রাউটেবল ভার্চুয়াল আইপি ধারণ করে বলে ধরে নেওয়া হয়।

## ইনগ্রেস কী? {#what-is-ingress}

[ইনগ্রেস](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#ingress-v1-networking-k8s-io)
ক্লাস্টারের বাইরে থেকে HTTP এবং HTTPS রুটগুলি
{{< link text="সার্ভিস" url="/docs/concepts/services-networking/service/" >}}-এ উন্মুক্ত করে।
ট্রাফিক রাউটিং ইনগ্রেস রিসোর্সে সংজ্ঞায়িত নিয়ম দ্বারা নিয়ন্ত্রিত হয়।

এখানে একটি সহজ উদাহরণ দেওয়া হল যেখানে একটি ইনগ্রেস তার সমস্ত ট্রাফিক একটি সার্ভিসে পাঠায়:

{{< figure src="/bn/docs/images/ingress.svg" alt="ingress-diagram" class="diagram-large" caption="চিত্র। ইনগ্রেস" link="<https://mermaid.live/edit#pako:eNqNkstuwyAQRX8F4U0r2VHqPlSRKqt0UamLqlnaWWAYJygYLB59KMm_Fxcix-qmGwbuXA7DwAEzzQETXKutof0Ovb4vaoUQkwKUu6pi3FwXM_QSHGBt0VFFt8DRU2OWSGrKUUMlVQwMmhVLEV1Vcm9-aUksiuXRaO_CEhkv4WjBfAgG1TrGaLa-iaUw6a0DcwGI-WgOsF7zm-pN881fvRx1UDzeiFq7ghb1kgqFWiElyTjnuXVG74FkbdumefEpuNuRu_4rZ1pqQ7L5fL6YQPaPNiFuywcG9_-ihNyUkm6YSONWkjVNM8WUIyaeOJLO3clTB_KhL8NQDmVe-OJjxgZM5FhFiiFTK5zjDkxHBQ9_4zB4a-x20EGNSZhyaKmXrg7f5hSsvufUwTMXThtMWiot5Jh6p9ffimHijIezaSVoeN0uiqcfMJvf7w>" >}}

একটি ইনগ্রেস সার্ভিসগুলিকে বাহ্যিকভাবে-অ্যাক্সেসযোগ্য URL প্রদান করতে, ট্রাফিক লোড ব্যালেন্স করতে,
SSL / TLS শেষ করতে এবং নাম-ভিত্তিক ভার্চুয়াল হোস্টিং অফার করতে কনফিগার করা যেতে পারে।
একটি [ইনগ্রেস কন্ট্রোলার](/docs/concepts/services-networking/ingress-controllers)
ইনগ্রেস পূরণ করার জন্য দায়ী, সাধারণত একটি লোড ব্যালেন্সার সহ, যদিও এটি আপনার এজ রাউটার বা
অতিরিক্ত ফ্রন্টএন্ডগুলি ট্রাফিক পরিচালনা করতে সহায়তা করার জন্যও কনফিগার করতে পারে।

ইনগ্রেস এলোমেলো পোর্ট বা প্রোটোকল উন্মুক্ত করে না। HTTP এবং HTTPS ছাড়া অন্য সার্ভিসগুলিকে ইন্টারনেটে উন্মুক্ত করা সাধারণত
[Service.Type=NodePort](/docs/concepts/services-networking/service/#type-nodeport) বা
[Service.Type=LoadBalancer](/docs/concepts/services-networking/service/#loadbalancer) ব্যবহার করে।

## পূর্বশর্ত {#prerequisites}

আপনার একটি [ইনগ্রেস কন্ট্রোলার](/docs/concepts/services-networking/ingress-controllers) থাকতে হবে
একটি ইনগ্রেস পূরণ করতে। শুধুমাত্র একটি ইনগ্রেস রিসোর্স তৈরি করা কোন প্রভাব ফেলে না।

আপনাকে [ingress-nginx](https://kubernetes.github.io/ingress-nginx/deploy/) এর মতো একটি ইনগ্রেস কন্ট্রোলার স্থাপন করতে হতে পারে।
আপনি বেশ কয়েকটি [ইনগ্রেস কন্ট্রোলার](/docs/concepts/services-networking/ingress-controllers) থেকে বেছে নিতে পারেন।

আদর্শভাবে, সমস্ত ইনগ্রেস কন্ট্রোলারগুলি রেফারেন্স স্পেসিফিকেশন অনুসারে ফিট করা উচিত। বাস্তবে, বিভিন্ন ইনগ্রেস
কন্ট্রোলারগুলি সামান্য ভিন্নভাবে কাজ করে।

{{< note >}}
আপনার ইনগ্রেস কন্ট্রোলারের ডকুমেন্টেশন পর্যালোচনা করতে ভুলবেন না যাতে এটি বেছে নেওয়ার সতর্কতা বুঝতে পারেন।
{{< /note >}}

## ইনগ্রেস রিসোর্স {#the-ingress-resource}

একটি ন্যূনতম ইনগ্রেস রিসোর্স উদাহরণ:

{{% code_sample file="service/networking/minimal-ingress.yaml" %}}

একটি ইনগ্রেস এর `apiVersion`, `kind`, `metadata` এবং `spec` ক্ষেত্র প্রয়োজন।
একটি ইনগ্রেস অবজেক্টের নাম একটি বৈধ
[DNS সাবডোমেন নাম](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names) হতে হবে।
কনফিগ ফাইলগুলির সাথে কাজ করার বিষয়ে সাধারণ তথ্যের জন্য, [অ্যাপ্লিকেশন স্থাপন](/docs/tasks/run-application/run-stateless-application-deployment/), [কনফিগারিং কন্টেইনার](/docs/tasks/configure-pod-container/configure-pod-configmap/), [রিসোর্স পরিচালনা](/docs/concepts/cluster-administration/manage-deployment/) দেখুন।
ইনগ্রেস প্রায়ই ইনগ্রেস কন্ট্রোলারের উপর নির্ভর করে কিছু বিকল্প কনফিগার করতে অ্যানোটেশন ব্যবহার করে, যার একটি উদাহরণ
হল [rewrite-target অ্যানোটেশন](https://github.com/kubernetes/ingress-nginx/blob/main/docs/examples/rewrite/README.md)।
বিভিন্ন [ইনগ্রেস কন্ট্রোলার](/docs/concepts/services-networking/ingress-controllers) বিভিন্ন অ্যানোটেশন সমর্থন করে।
সমর্থিত কোন অ্যানোটেশনগুলি শিখতে আপনার পছন্দের ইনগ্রেস কন্ট্রোলারের ডকুমেন্টেশন পর্যালোচনা করুন।

[ইনগ্রেস স্পেস](/docs/reference/kubernetes-api/service-resources/ingress-v1/#IngressSpec)
এ লোড ব্যালেন্সার বা প্রক্সি সার্ভার কনফিগার করার জন্য প্রয়োজনীয় সমস্ত তথ্য রয়েছে। সবচেয়ে গুরুত্বপূর্ণভাবে, এটি
সমস্ত আসন্ন অনুরোধের বিরুদ্ধে মেলানো নিয়মগুলির একটি তালিকা ধারণ করে। ইনগ্রেস রিসোর্স শুধুমাত্র HTTP(S) ট্রাফিক
পরিচালনার জন্য নিয়ম সমর্থন করে।

যদি `ingressClassName` বাদ দেওয়া হয়, একটি [ডিফল্ট ইনগ্রেস ক্লাস](#default-ingress-class)
সংজ্ঞায়িত করা উচিত।

কিছু ইনগ্রেস কন্ট্রোলার আছে, যা একটি ডিফল্ট `IngressClass` সংজ্ঞা
ছাড়াই কাজ করে। উদাহরণস্বরূপ, ইনগ্রেস-NGINX কন্ট্রোলারটি একটি
[ফ্ল্যাগ](https://kubernetes.github.io/ingress-nginx/user-guide/k8s-122-migration/#what-is-the-flag-watch-ingress-without-class)
`--watch-ingress-without-class` দিয়ে কনফিগার করা যেতে পারে। এটি [প্রস্তাবিত](https://kubernetes.github.io/ingress-nginx/user-guide/k8s-122-migration/#i-have-only-one-ingress-controller-in-my-cluster-what-should-i-do) যদিও,
ডিফল্ট `IngressClass` নির্দিষ্ট করতে যেমন [নীচে](#default-ingress-class) দেখানো হয়েছে।

### ইনগ্রেস নিয়ম {#ingress-rules}

প্রতিটি HTTP নিয়মে নিম্নলিখিত তথ্য রয়েছে:

* একটি অপশনাল হোস্ট। এই উদাহরণে, কোন হোস্ট নির্দিষ্ট করা হয়নি, তাই নিয়মটি নির্দিষ্ট করা IP ঠিকানার মাধ্যমে সমস্ত ইনবাউন্ড
  HTTP ট্রাফিকের জন্য প্রযোজ্য। যদি একটি হোস্ট প্রদান করা হয় (উদাহরণস্বরূপ,
  foo.bar.com), নিয়মগুলি সেই হোস্টের জন্য প্রযোজ্য।
* একটি পাথের তালিকা (উদাহরণস্বরূপ, `/testpath`), যার প্রতিটিতে
  একটি `service.name` এবং একটি `service.port.name` বা
  `service.port.number` সহ একটি সম্পর্কিত ব্যাকএন্ড সংজ্ঞায়িত করা হয়েছে।
  হোস্ট এবং পাথ উভয়ই একটি আসন্ন অনুরোধের বিষয়বস্তু মেলাতে হবে এর আগে লোড ব্যালেন্সার ট্রাফিককে উল্লেখিত
  সার্ভিসে নির্দেশ করে।
* একটি ব্যাকএন্ড হল [সার্ভিস ডক](/docs/concepts/services-networking/service/) বা 
  একটি [কাস্টম রিসোর্স ব্যাকএন্ড](#resource-backend) দ্বারা বর্ণিত সার্ভিস
  এবং পোর্ট নামগুলির একটি সংমিশ্রণ {{< glossary_tooltip term_id="CustomResourceDefinition" text="CRD" >}} এর মাধ্যমে। ইনগ্রেস-এ হোস্ট
  এবং পাথের নিয়ম মেলে এমন HTTP (এবং HTTPS) অনুরোধগুলি তালিকাভুক্ত ব্যাকএন্ডে পাঠানো হয়।

একটি `defaultBackend` প্রায়শই একটি ইনগ্রেস কন্ট্রোলারে কনফিগার করা হয় যাতে কোনও অনুরোধের জন্য সার্ভিস দেওয়া হয় যা স্পেসে কোনও
পাথের সাথে মেলে না।

### DefaultBackend {#default-backend}

কোন নিয়ম ছাড়াই একটি ইনগ্রেস সমস্ত ট্রাফিককে একটি একক ডিফল্ট ব্যাকএন্ডে পাঠায় এবং `.spec.defaultBackend`
হল ব্যাকএন্ড যা সেই ক্ষেত্রে অনুরোধগুলি পরিচালনা করা উচিত।
`defaultBackend` প্রচলিতভাবে একটি
[ইনগ্রেস কন্ট্রোলার](/docs/concepts/services-networking/ingress-controllers)
এর একটি কনফিগারেশন বিকল্প এবং আপনার ইনগ্রেস রিসোর্সগুলিতে নির্দিষ্ট করা হয় না।
যদি কোনও `.spec.rules` নির্দিষ্ট না করা হয়, তবে `.spec.defaultBackend` নির্দিষ্ট করা আবশ্যক।
যদি `defaultBackend` সেট না করা হয়, তাহলে কোনও নিয়মের সাথে মেলে না এমন অনুরোধগুলির পরিচালনা ইনগ্রেস কন্ট্রোলারের উপর
নির্ভর করবে (এই ক্ষেত্রে এটি কীভাবে পরিচালনা করে তা জানতে আপনার ইনগ্রেস কন্ট্রোলারের ডকুমেন্টেশন পরামর্শ করুন)।

যদি কোনও হোস্ট বা পাথ ইনগ্রেস অবজেক্টগুলিতে HTTP অনুরোধের সাথে মেলে না, তাহলে ট্রাফিক
আপনার ডিফল্ট ব্যাকএন্ডে রাউট করা হয়।

### রিসোর্স ব্যাকএন্ড {#resource-backend}

একটি `Resource` ব্যাকএন্ড হল ইনগ্রেস অবজেক্টের মতো একই নেমস্পেসের অন্য
কুবারনেটিস রিসোর্সের একটি ObjectRef। একটি `Resource` সার্ভিসের সাথে পারস্পরিক
একচেটিয়া সেটিং এবং উভয় নির্দিষ্ট করা থাকলে বৈধতা ব্যর্থ হবে। একটি `Resource` ব্যাকএন্ডের
একটি সাধারণ ব্যবহার হল স্ট্যাটিক অ্যাসেট সহ একটি অবজেক্ট স্টোরেজ ব্যাকএন্ডে
ডেটা ইনগ্রেস করা।

{{% code_sample file="service/networking/ingress-resource-backend.yaml" %}}

উপরে ইনগ্রেস তৈরি করার পরে, আপনি নিম্নলিখিত কমান্ড দিয়ে এটি দেখতে পারেন:

```bash
kubectl describe ingress ingress-resource-backend
```

```
Name:             ingress-resource-backend
Namespace:        default
Address:
Default backend:  APIGroup: k8s.example.com, Kind: StorageBucket, Name: static-assets
Rules:
  Host        Path  Backends
  ----        ----  --------
  *
              /icons   APIGroup: k8s.example.com, Kind: StorageBucket, Name: icon-assets
Annotations:  <none>
Events:       <none>
```

### পাথ টাইপ {#path-types}

ইনগ্রেস-এ প্রতিটি পাথের একটি সংশ্লিষ্ট পাথ টাইপ থাকা প্রয়োজন। যেসব পাথে
একটি স্পষ্ট `pathType` অন্তর্ভুক্ত নেই তারা বৈধতা ব্যর্থ করবে।
তিনটি সমর্থিত পাথ টাইপ রয়েছে:

* `ImplementationSpecific`: এই পাথ টাইপের সাথে, মেলানো IngressClass এর উপর নির্ভর করে।
  বাস্তবায়নগুলি এটিকে একটি পৃথক `pathType` হিসাবে বা `Prefix` বা `Exact` পাথ টাইপগুলির সাথে
  অভিন্ন হিসাবে বিবেচনা করতে পারে।

* `Exact`: URL পাথটি ঠিক এবং কেস সংবেদনশীলতার সাথে মেলে।

* `Prefix`: `/` দ্বারা বিভক্ত একটি URL পাথ প্রিফিক্সের উপর ভিত্তি করে মেলে।
  মেলানো কেস সংবেদনশীল এবং একটি পাথ উপাদান দ্বারা উপাদান ভিত্তিতে করা হয়।
  একটি পাথ উপাদানটি `/` বিভাজক দ্বারা বিভক্ত পাথের লেবেলের তালিকাকে বোঝায়।
  একটি অনুরোধ পাথ _p_ এর উপাদান-ওয়াইজ প্রিফিক্স হলে পাথ _p_ এর
  জন্য একটি ম্যাচ।

  {{< note >}}
  যদি পাথের শেষ উপাদানটি অনুরোধ পাথের শেষ উপাদানের একটি সাবস্ট্রিং হয়,
  তবে এটি একটি ম্যাচ নয় (উদাহরণস্বরূপ: `/foo/bar` `/foo/bar/baz` এর সাথে মেলে,
  কিন্তু `/foo/barbaz` এর সাথে মেলে না)।
  {{< /note >}}

### উদাহরণ {#examples}

| প্রকার   | পাথ(গুলি)                         | অনুরোধ পাথ(গুলি)               | মেলে?                           |
|--------|---------------------------------|-------------------------------|------------------------------------|
| Prefix | `/`                             | (সব পাথ)                      | হ্যাঁ                                |
| Exact  | `/foo`                          | `/foo`                        | হ্যাঁ                                |
| Exact  | `/foo`                          | `/bar`                        | না                                 |
| Exact  | `/foo`                          | `/foo/`                       | না                                 |
| Exact  | `/foo/`                         | `/foo`                        | না                                 |
| Prefix | `/foo`                          | `/foo`, `/foo/`               | হ্যাঁ                                |
| Prefix | `/foo/`                         | `/foo`, `/foo/`               | হ্যাঁ                                |
| Prefix | `/aaa/bb`                       | `/aaa/bbb`                    | না                                 |
| Prefix | `/aaa/bbb`                      | `/aaa/bbb`                    | হ্যাঁ                                |
| Prefix | `/aaa/bbb/`                     | `/aaa/bbb`                    | হ্যাঁ, শেষ স্ল্যাশ উপেক্ষা করে        |
| Prefix | `/aaa/bbb`                      | `/aaa/bbb/`                   | হ্যাঁ, শেষ স্ল্যাশ মেলে       |
| Prefix | `/aaa/bbb`                      | `/aaa/bbb/ccc`                | হ্যাঁ, সাবপাথ মেলে               |
| Prefix | `/aaa/bbb`                      | `/aaa/bbbxyz`                 | না, স্ট্রিং প্রিফিক্স মেলে না   |
| Prefix | `/`, `/aaa`                     | `/aaa/ccc`                    | হ্যাঁ, `/aaa` প্রিফিক্স মেলে         |
| Prefix | `/`, `/aaa`, `/aaa/bbb`         | `/aaa/bbb`                    | হ্যাঁ, `/aaa/bbb` প্রিফিক্স মেলে     |
| Prefix | `/`, `/aaa`, `/aaa/bbb`         | `/ccc`                        | হ্যাঁ, `/` প্রিফিক্স মেলে            |
| Prefix | `/aaa`                          | `/ccc`                        | না, ডিফল্ট ব্যাকএন্ড ব্যবহার করে           |
| Mixed  | `/foo` (Prefix), `/foo` (Exact) | `/foo`                        | হ্যাঁ, Exact পছন্দ করে                 |

#### একাধিক ম্যাচ {#multiple-matches}

কিছু ক্ষেত্রে, একটি অনুরোধের সাথে ইনগ্রেস-এর একাধিক পাথ মেলে। সেই
ক্ষেত্রে অগ্রাধিকার প্রথমে দীর্ঘতম মেলানো পাথকে দেওয়া হবে। যদি দুটি পাথ
এখনও সমানভাবে মেলে, অগ্রাধিকারটি প্রিফিক্স পাথ টাইপের উপর সঠিক পাথ
টাইপের পাথগুলিকে দেওয়া হবে।

## হোস্টনাম ওয়াইল্ডকার্ড {#hostname-wildcards}

হোস্টগুলি সুনির্দিষ্ট ম্যাচ (উদাহরণস্বরূপ “`foo.bar.com`”) বা একটি ওয়াইল্ডকার্ড
(উদাহরণস্বরূপ “`*.foo.com`”) হতে পারে। সুনির্দিষ্ট ম্যাচগুলির জন্য প্রয়োজন যে
HTTP `host` হেডারটি `host` ক্ষেত্রের সাথে মেলে। ওয়াইল্ডকার্ড ম্যাচগুলির জন্য প্রয়োজন যে HTTP `host` হেডারটি
ওয়াইল্ডকার্ড নিয়মের উপসর্গের সমান।

| হোস্ট        | হোস্ট হেডার       | মেলে?                                            |
| ----------- |-------------------| --------------------------------------------------|
| `*.foo.com` | `bar.foo.com`     | ভাগ করা উপসর্গের উপর ভিত্তি করে মেলে                    |
| `*.foo.com` | `baz.bar.foo.com` | মেলে না, ওয়াইল্ডকার্ড শুধুমাত্র একটি একক DNS লেবেল কভার করে |
| `*.foo.com` | `foo.com`         | মেলে না, ওয়াইল্ডকার্ড শুধুমাত্র একটি একক DNS লেবেল কভার করে |

{{% code_sample file="service/networking/ingress-wildcard-host.yaml" %}}

## ইনগ্রেস ক্লাস {#ingress-class}

ইনগ্রেস বিভিন্ন কন্ট্রোলার দ্বারা বাস্তবায়িত হতে পারে, প্রায়শই বিভিন্ন
কনফিগারেশন সহ। প্রতিটি ইনগ্রেস একটি ক্লাস নির্দিষ্ট করা উচিত, একটি রেফারেন্স
IngressClass রিসোর্স যা অতিরিক্ত কনফিগারেশন ধারণ করে যার মধ্যে রয়েছে
কন্ট্রোলারের নাম যা ক্লাসটি বাস্তবায়িত করা উচিত।

{{% code_sample file="service/networking/external-lb.yaml" %}}

IngressClass এর `.spec.parameters` ক্ষেত্রটি আপনাকে একটি রিসোর্স উল্লেখ করতে দেয়
যা সেই IngressClass এর সাথে সম্পর্কিত কনফিগারেশন প্রদান করে।

ব্যবহার করার জন্য নির্দিষ্ট ধরণের প্যারামিটারগুলি আপনি IngressClass এর `.spec.controller` ক্ষেত্রে যে
ইনগ্রেস কন্ট্রোলারটি নির্দিষ্ট করেছেন তার উপর নির্ভর করে।

### IngressClass স্কোপ

আপনার ইনগ্রেস কন্ট্রোলারের উপর নির্ভর করে, আপনি প্যারামিটারগুলি ব্যবহার করতে সক্ষম হতে পারেন
যা আপনি ক্লাস্টার-ওয়াইড বা শুধুমাত্র একটি নেমস্পেসের জন্য সেট করেন।

{{< tabs name="tabs_ingressclass_parameter_scope" >}}
{{% tab name="Cluster" %}}
IngressClass প্যারামিটারগুলির জন্য ডিফল্ট স্কোপ হল ক্লাস্টার-ওয়াইড।

যদি আপনি `.spec.parameters` ক্ষেত্রটি সেট করেন এবং সেট না করেন
`.spec.parameters.scope`, বা যদি আপনি `.spec.parameters.scope` সেট করেন
`Cluster` এ, তাহলে IngressClass একটি ক্লাস্টার-স্কোপড রিসোর্সকে বোঝায়।
প্যারামিটারগুলির `kind` (apiGroup এর সাথে মিলিত) একটি ক্লাস্টার-স্কোপড
API (সম্ভবত একটি কাস্টম রিসোর্স) বোঝায় এবং
প্যারামিটারগুলির `name` সেই API এর জন্য একটি নির্দিষ্ট ক্লাস্টার
স্কোপড রিসোর্স সনাক্ত করে।

উদাহরণস্বরূপ:

```yaml
---
apiVersion: networking.k8s.io/v1
kind: IngressClass
metadata:
  name: external-lb-1
spec:
  controller: example.com/ingress-controller
  parameters:
    # এই IngressClass এর প্যারামিটারগুলি একটি
    # ClusterIngressParameter (API group k8s.example.net) এ নির্দিষ্ট করা হয়েছে
    # "external-config-1" নামক। এই সংজ্ঞাটি কুবারনেটিস কে বলে
    # একটি ক্লাস্টার-স্কোপড প্যারামিটার রিসোর্সের জন্য সন্ধান করুন।
    scope: Cluster
    apiGroup: k8s.example.net
    kind: ClusterIngressParameter
    name: external-config-1
```

{{% /tab %}}
{{% tab name="Namespaced" %}}
{{< feature-state for_k8s_version="v1.23" state="stable" >}}

যদি আপনি `.spec.parameters` ক্ষেত্রটি সেট করেন এবং সেট করেন
`.spec.parameters.scope` `Namespace` এ, তাহলে IngressClass
একটি নেমস্পেসড-স্কোপড রিসোর্সকে বোঝায়। আপনাকে অবশ্যই `.spec.parameters`
এর মধ্যে `namespace` ক্ষেত্রটি সেট করতে হবে
আপনি যে নেমস্পেসে প্যারামিটারগুলি ব্যবহার করতে চান তা ধারণ করে।

প্যারামিটারগুলির `kind` (apiGroup এর সাথে মিলিত) একটি নেমস্পেসড API
(উদাহরণস্বরূপ: ConfigMap) বোঝায় এবং
প্যারামিটারগুলির `name` আপনি `namespace` এ নির্দিষ্ট করা নেমস্পেসে একটি
নির্দিষ্ট রিসোর্স সনাক্ত করে।

নেমস্পেসড প্যারামিটারগুলি ক্লাস্টার অপারেটরকে কনফিগারেশনের উপর নিয়ন্ত্রণ অর্পণ করতে সহায়তা করে
(উদাহরণস্বরূপ: লোড ব্যালেন্সার সেটিংস, API গেটওয়ে সংজ্ঞা)
যা একটি ওয়ার্কলোডের জন্য ব্যবহৃত হয়। আপনি যদি একটি ক্লাস্টার-স্কোপড প্যারামিটার ব্যবহার করেন তবে হয়:

* ক্লাস্টার অপারেটর টিমকে একটি ভিন্ন টিমের পরিবর্তনগুলি অনুমোদন করতে হবে
  প্রতিবার একটি নতুন কনফিগারেশন পরিবর্তন প্রয়োগ করা হচ্ছে।
* ক্লাস্টার অপারেটরকে নির্দিষ্ট অ্যাক্সেস নিয়ন্ত্রণগুলি সংজ্ঞায়িত করতে হবে, যেমন
  [RBAC](/docs/reference/access-authn-authz/rbac/) ভূমিকা এবং বাইন্ডিং, যা
  অ্যাপ্লিকেশন টিমকে ক্লাস্টার-স্কোপড প্যারামিটার রিসোর্সে পরিবর্তন করতে দেয়।

IngressClass API নিজেই সর্বদা ক্লাস্টার-স্কোপড।

এখানে একটি উদাহরণ দেওয়া হল একটি IngressClass যা প্যারামিটারগুলিকে বোঝায় যা
নেমস্পেসড:

```yaml
---
apiVersion: networking.k8s.io/v1
kind: IngressClass
metadata:
  name: external-lb-2
spec:
  controller: example.com/ingress-controller
  parameters:
    # এই IngressClass এর প্যারামিটারগুলি একটি
    # IngressParameter (API group k8s.example.com) এ নির্দিষ্ট করা হয়েছে, "external-config" নামক,
    # যা "external-configuration" নেমস্পেসে।
    scope: Namespace
    apiGroup: k8s.example.com
    kind: IngressParameter
    namespace: external-configuration
    name: external-config
```

{{% /tab %}}
{{< /tabs >}}

### অপ্রচলিত অ্যানোটেশন {#deprecated-annotation}

IngressClass রিসোর্স এবং `ingressClassName` ক্ষেত্রটি কুবারনেটিস 1.18 এ
যোগ করার আগে, ইনগ্রেস ক্লাসগুলি একটি
ইনগ্রেস-এ `kubernetes.io/ingress.class` অ্যানোটেশন। এই অ্যানোটেশনটি
কখনই আনুষ্ঠানিকভাবে সংজ্ঞায়িত করা হয়নি, তবে এটি ব্যাপকভাবে সমর্থিত ছিল ইনগ্রেস কন্ট্রোলার দ্বারা।

ইনগ্রেস-এ নতুন `ingressClassName` ক্ষেত্রটি সেই অ্যানোটেশনের জন্য একটি প্রতিস্থাপন,
তবে এটি একটি সরাসরি সমতুল্য নয়। যদিও অ্যানোটেশনটি সাধারণত ইনগ্রেস কন্ট্রোলারের
নাম উল্লেখ করতে ব্যবহৃত হত যা ইনগ্রেস বাস্তবায়ন করা উচিত, ক্ষেত্রটি
একটি IngressClass রিসোর্সের একটি রেফারেন্স যা অতিরিক্ত ইনগ্রেস কনফিগারেশন ধারণ করে,
যার মধ্যে রয়েছে ইনগ্রেস কন্ট্রোলারের নাম।

### ডিফল্ট IngressClass {#default-ingress-class}

আপনি আপনার ক্লাস্টারের জন্য একটি নির্দিষ্ট IngressClass ডিফল্ট হিসাবে চিহ্নিত করতে পারেন।
একটি IngressClass রিসোর্সে `ingressclass.kubernetes.io/is-default-class` অ্যানোটেশন
`true` এ সেট করা নিশ্চিত করবে যে নতুন ইনগ্রেস-গুলি যেগুলিতে একটি `ingressClassName` ক্ষেত্র
নির্দিষ্ট করা নেই সেগুলি এই ডিফল্ট IngressClass বরাদ্দ করা হবে।

{{< caution >}}
যদি আপনার ক্লাস্টারের জন্য একাধিক IngressClass ডিফল্ট হিসাবে চিহ্নিত করা থাকে,
অ্যাডমিশন কন্ট্রোলার নতুন ইনগ্রেস অবজেক্ট তৈরি করা থেকে বিরত থাকে যেগুলিতে
একটি `ingressClassName` নির্দিষ্ট করা নেই। আপনি নিশ্চিত করে এটি সমাধান করতে পারেন যে সর্বাধিক 1
IngressClass আপনার ক্লাস্টারে ডিফল্ট হিসাবে চিহ্নিত করা হয়েছে।
{{< /caution >}}

কিছু ইনগ্রেস কন্ট্রোলার আছে, যা একটি ডিফল্ট `IngressClass` সংজ্ঞা ছাড়াই কাজ করে।
উদাহরণস্বরূপ, ইনগ্রেস-NGINX কন্ট্রোলারটি একটি
[ফ্ল্যাগ](https://kubernetes.github.io/ingress-nginx/#what-is-the-flag-watch-ingress-without-class)
`--watch-ingress-without-class` দিয়ে কনফিগার করা যেতে পারে। এটি [প্রস্তাবিত](https://kubernetes.github.io/ingress-nginx/#i-have-only-one-instance-of-the-ingresss-nginx-controller-in-my-cluster-what-should-i-do)  যদিও, ডিফল্ট
`IngressClass` নির্দিষ্ট করতে:

{{% code_sample file="service/networking/default-ingressclass.yaml" %}}

## ইনগ্রেস এর ধরন {#types-of-ingress}

### একটি একক সার্ভিস দ্বারা সমর্থিত ইনগ্রেস {#single-service-ingress}

একটি একক সার্ভিস উন্মুক্ত করার জন্য বিদ্যমান কুবারনেটিস ধারণা রয়েছে
(দেখুন [বিকল্প](#alternatives))। আপনি একটি ইনগ্রেস সহ একটি ডিফল্ট ব্যাকএন্ড নির্দিষ্ট করে এটি করতে পারেন
কোন নিয়ম ছাড়াই।

{{% code_sample file="service/networking/test-ingress.yaml" %}}

যদি আপনি এটি `kubectl apply -f` ব্যবহার করে তৈরি করেন তবে আপনি যুক্ত করা ইনগ্রেস
এর অবস্থা দেখতে সক্ষম হবেন:

```bash
kubectl get ingress test-ingress
```

```
NAME           CLASS         HOSTS   ADDRESS         PORTS   AGE
test-ingress   external-lb   *       203.0.113.123   80      59s
```

যেখানে `203.0.113.123` হল ইনগ্রেস কন্ট্রোলার দ্বারা বরাদ্দ করা IP এই
ইনগ্রেস পূরণ করতে।

{{< note >}}
ইনগ্রেস কন্ট্রোলার এবং লোড ব্যালেন্সারগুলির একটি IP ঠিকানা বরাদ্দ করতে এক বা দুই মিনিট সময় লাগতে পারে।
সেই সময় পর্যন্ত, আপনি প্রায়শই ঠিকানাটি `<pending>` হিসাবে তালিকাভুক্ত দেখতে পান।
{{< /note >}}

### সহজ ফ্যানআউট {#simple-fanout}

একটি ফ্যানআউট কনফিগারেশন একটি একক IP ঠিকানা থেকে একাধিক সার্ভিসে ট্রাফিক রুট করে,
অনুরোধ করা HTTP URI এর উপর ভিত্তি করে। একটি ইনগ্রেস আপনাকে লোড ব্যালেন্সারের সংখ্যা কমিয়ে রাখতে দেয়
একটি ন্যূনতম। উদাহরণস্বরূপ, একটি সেটআপের মতো:

{{< figure src="/docs/images/ingressFanOut.svg" alt="ingress-fanout-diagram" class="diagram-large" caption="চিত্র। ইনগ্রেস ফ্যান আউট" link="<https://mermaid.live/edit#pako:eNqNUslOwzAQ_RXLvYCUhMQpUFzUUzkgcUBwbHpw4klr4diR7bCo8O8k2FFbFomLPZq3jP00O1xpDpjijWHtFt09zAuFUCUFKHey8vf6NE7QrdoYsDZumGIb4Oi6NAskNeOoZJKpCgxK4oXwrFVgRyi7nCVXWZKRPMlysv5yD6Q4Xryf1Vq_WzDPooJs9egLNDbolKTpT03JzKgh3zWEztJZ0Niu9L-qZGcdmAMfj4cxvWmreba613z9C0B-AMQD-V_AdA-A4j5QZu0SatRKJhSqhZR0wjmPrDP6CeikrutQxy-Cuy2dtq9RpaU2dJKm6fzI5Glmg0VOLio4_5dLjx27hFSC015KJ2VZHtuQvY2fuHcaE43G0MaCREOow_FV5cMxHZ5-oPX75UM5avuXhXuOI9yAaZjg_aLuBl6B3RYaKDDtSw4166QrcKE-emrXcubghgunDaY1kxYizDqnH99UhakzHYykpWD9hjS--fEJoIELqQ>" >}}

এটি একটি ইনগ্রেস প্রয়োজন যেমন:

{{% code_sample file="service/networking/simple-fanout-example.yaml" %}}

যখন আপনি `kubectl apply -f` দিয়ে ইনগ্রেস তৈরি করেন:

```shell
kubectl describe ingress simple-fanout-example
```

```
Name:             simple-fanout-example
Namespace:        default
Address:          178.91.123.132
Default backend:  default-http-backend:80 (10.8.2.3:8080)
Rules:
  Host         Path  Backends
  ----         ----  --------
  foo.bar.com
               /foo   service1:4200 (10.8.0.90:4200)
               /bar   service2:8080 (10.8.0.91:8080)
Events:
  Type     Reason  Age                From                     Message
  ----     ------  ----               ----                     -------
  Normal   ADD     22s                loadbalancer-controller  default/test
```

ইনগ্রেস কন্ট্রোলার একটি বাস্তবায়ন-নির্দিষ্ট লোড ব্যালেন্সার সরবরাহ করে
যা ইনগ্রেস পূরণ করে, যতক্ষণ না সার্ভিসগুলি (`service1`, `service2`) বিদ্যমান থাকে।
যখন এটি করেছে, আপনি লোড ব্যালেন্সারের ঠিকানা দেখতে পারেন
ঠিকানা ক্ষেত্র।

{{< note >}}
আপনি যে [ইনগ্রেস কন্ট্রোলার](/docs/concepts/services-networking/ingress-controllers/) ব্যবহার করছেন তার উপর নির্ভর করে,
আপনাকে একটি ডিফল্ট-http-backend তৈরি করতে হতে পারে
[সার্ভিস](/docs/concepts/services-networking/service/)।
{{< /note >}}

### নেম বেসড ভার্চুয়াল হোস্টিং {#name-based-virtual-hosting}

নাম-ভিত্তিক ভার্চুয়াল হোস্টগুলি একই IP ঠিকানায় একাধিক হোস্ট নামের জন্য HTTP ট্রাফিক রাউটিং সমর্থন করে।

{{< figure src="/docs/images/ingressNameBased.svg" alt="ingress-namebase-diagram" class="diagram-large" caption="চিত্র। ইনগ্রেস নাম ভিত্তিক ভার্চুয়াল হোস্টিং" link="<https://mermaid.live/edit#pako:eNqNkl9PwyAUxb8KYS-atM1Kp05m9qSJJj4Y97jugcLtRqTQAPVPdN_dVlq3qUt8gZt7zvkBN7xjbgRgiteW1Rt0_zjLNUJcSdD-ZBn21WmcoDu9tuBcXDHN1iDQVWHnSBkmUMEU0xwsSuK5DK5l745QejFNLtMkJVmSZmT1Re9NcTz_uDXOU1QakxTMJtxUHw7ss-SQLhehQEODTsdH4l20Q-zFyc84-Y67pghv5apxHuweMuj9eS2_NiJdPhix-kMgvwQShOyYMNkJoEUYM3PuGkpUKyY1KqVSdCSEiJy35gnoqCzLvo5fpPAbOqlfI26UsXQ0Ho9nB5CnqesRGTnncPYvSqsdUvqp9KRdlI6KojjEkB0mnLgjDRONhqENBYm6oXbLV5V1y6S7-l42_LowlIN2uFm_twqOcAW2YlK0H_i9c-bYb6CCHNO2FFCyRvkc53rbWptaMA83QnpjMS2ZchBh1nizeNMcU28bGEzXkrV_pArN7Sc0rBTu>" >}}

নিম্নলিখিত ইনগ্রেস ব্যাকিং লোড ব্যালেন্সারকে [Host হেডার](https://tools.ietf.org/html/rfc7230#section-5.4)
এর উপর ভিত্তি করে অনুরোধগুলি রাউট করতে বলে।

{{% code_sample file="service/networking/name-virtual-host-ingress.yaml" %}}

যদি আপনি কোনও হোস্ট সংজ্ঞায়িত না করে একটি ইনগ্রেস রিসোর্স তৈরি করেন তবে নিয়মগুলি,
তাহলে আপনার ইনগ্রেস কন্ট্রোলারের IP ঠিকানায় যেকোনো ওয়েব ট্রাফিক একটি নাম ভিত্তিক ভার্চুয়াল
হোস্ট প্রয়োজন ছাড়াই মেলানো যেতে পারে।

উদাহরণস্বরূপ, নিম্নলিখিত ইনগ্রেস রুট ট্রাফিক
`first.bar.com` এর জন্য অনুরোধ করা `service1` এ, `second.bar.com` এ `service2` এ,
এবং যেকোনো ট্রাফিক যার অনুরোধ হোস্ট হেডার `first.bar.com` এর সাথে মেলে না
এবং `second.bar.com` `service3` এ।

{{% code_sample file="service/networking/name-virtual-host-ingress-no-third-host.yaml" %}}

### TLS

আপনি একটি {{< glossary_tooltip term_id="secret" >}} নির্দিষ্ট করে একটি ইনগ্রেস সুরক্ষিত করতে পারেন
যা একটি TLS ব্যক্তিগত কী এবং শংসাপত্র ধারণ করে। ইনগ্রেস রিসোর্স শুধুমাত্র
একটি একক TLS পোর্ট, 443 সমর্থন করে এবং ইনগ্রেস পয়েন্টে TLS সমাপ্তি ধরে নেয়
(সার্ভিস এবং এর পডগুলিতে ট্র্যাফিক প্লেইনটেক্সটে থাকে)।
যদি একটি ইনগ্রেস-এ TLS কনফিগারেশন বিভাগে বিভিন্ন হোস্ট নির্দিষ্ট করা থাকে, তবে সেগুলি
SNI TLS এক্সটেনশনের মাধ্যমে নির্দিষ্ট হোস্টনাম অনুসারে একই পোর্টে মাল্টিপ্লেক্স করা
হয় (ইনগ্রেস কন্ট্রোলার SNI সমর্থন করে)। TLS সিক্রেটে `tls.crt` এবং `tls.key`
নামে কী থাকতে হবে যা TLS এর জন্য ব্যবহার করার শংসাপত্র এবং
ব্যক্তিগত কী ধারণ করে। উদাহরণস্বরূপ:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: testsecret-tls
  namespace: default
data:
  tls.crt: base64 encoded cert  
  tls.key: base64 encoded key
type: kubernetes.io/tls
```

একটি ইনগ্রেস-এ এই সিক্রেটটি উল্লেখ করা ইনগ্রেস কন্ট্রোলারকে
TLS ব্যবহার করে ক্লায়েন্ট থেকে লোড ব্যালেন্সারে চ্যানেলটি সুরক্ষিত করতে বলে। আপনাকে নিশ্চিত করতে হবে
আপনি যে TLS সিক্রেটটি তৈরি করেছেন তা একটি শংসাপত্র থেকে এসেছে যাতে একটি সাধারণ
নাম (CN), এছাড়াও `https-example.foo.com` এর জন্য একটি সম্পূর্ণ যোগ্য ডোমেন নাম (FQDN) হিসাবে পরিচিত।

{{< note >}}
মনে রাখবেন যে TLS ডিফল্ট নিয়মে কাজ করবে না কারণ
শংসাপত্রগুলি সমস্ত সম্ভাব্য সাব-ডোমেনের জন্য জারি করা উচিত। অতএব,
`tls` বিভাগে `rules` বিভাগে `host` এর সাথে স্পষ্টভাবে মেলাতে
হবে।
{{< /note >}}

{{% code_sample file="service/networking/tls-example-ingress.yaml" %}}

{{< note >}}
বিভিন্ন ইনগ্রেস দ্বারা সমর্থিত TLS ফিচারগুলির মধ্যে একটি ফাঁক রয়েছে
কন্ট্রোলার. অনুগ্রহ করে ডকুমেন্টেশন দেখুন
[nginx](https://kubernetes.github.io/ingress-nginx/user-guide/tls/),
[GCE](https://git.k8s.io/ingress-gce/README.md#frontend-https), বা অন্য কোন
প্ল্যাটফর্ম নির্দিষ্ট ইনগ্রেস কন্ট্রোলার বুঝতে আপনার পরিবেশে TLS কিভাবে কাজ করে।
{{< /note >}}

### লোড ব্যালেন্সিং {#load-balancing}

একটি ইনগ্রেস কন্ট্রোলার কিছু লোড ব্যালেন্সিং নীতি সেটিংস সহ বুটস্ট্র্যাপ করা হয়
যা এটি সমস্ত ইনগ্রেস-এ প্রয়োগ করে, যেমন লোড ব্যালেন্সিং অ্যালগরিদম, ব্যাকএন্ড
ওজন স্কিম, এবং অন্যান্য। আরো উন্নত লোড ব্যালেন্সিং ধারণা
(যেমন স্থায়ী সেশন, গতিশীল ওজন) এখনও ইনগ্রেস এর মাধ্যমে প্রকাশ করা হয়নি।
আপনি পরিবর্তে সার্ভিসের জন্য ব্যবহৃত লোড ব্যালেন্সারের মাধ্যমে এই ফিচারগুলি
পেতে পারেন।

এটি উল্লেখ করার মতো যে স্বাস্থ্য পরীক্ষা সরাসরি প্রকাশ করা হয় না
ইনগ্রেস এর মাধ্যমে, কুবারনেটিস-এ সমান্তরাল ধারণা যেমন
[readiness probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)
যা আপনাকে একই শেষ ফলাফল অর্জন করতে দেয়। অনুগ্রহ করে কন্ট্রোলার পর্যালোচনা করুন
নির্দিষ্ট ডকুমেন্টেশন দেখতে তারা স্বাস্থ্য পরীক্ষা কিভাবে পরিচালনা করে (উদাহরণস্বরূপ:
[nginx](https://git.k8s.io/ingress-nginx/README.md), বা
[GCE](https://git.k8s.io/ingress-gce/README.md#health-checks))।

## একটি ইনগ্রেস আপডেট করা {#updating-an-ingress}

একটি নতুন হোস্ট যোগ করতে একটি বিদ্যমান ইনগ্রেস আপডেট করতে, আপনি এটি সম্পাদনা করে আপডেট করতে পারেন:

```shell
kubectl describe ingress test
```

```
Name:             test
Namespace:        default
Address:          178.91.123.132
Default backend:  default-http-backend:80 (10.8.2.3:8080)
Rules:
  Host         Path  Backends
  ----         ----  --------
  foo.bar.com
               /foo   service1:80 (10.8.0.90:80)
Annotations:
  nginx.ingress.kubernetes.io/rewrite-target:  /
Events:
  Type     Reason  Age                From                     Message
  ----     ------  ----               ----                     -------
  Normal   ADD     35s                loadbalancer-controller  default/test
```

```shell
kubectl edit ingress test
```

এটি YAML ফরম্যাটে বিদ্যমান কনফিগারেশন সহ একটি সম্পাদক পপ আপ করে।
নতুন হোস্ট অন্তর্ভুক্ত করতে এটি পরিবর্তন করুন:

```yaml
spec:
  rules:
  - host: foo.bar.com
    http:
      paths:
      - backend:
          service:
            name: service1
            port:
              number: 80
        path: /foo
        pathType: Prefix
  - host: bar.baz.com
    http:
      paths:
      - backend:
          service:
            name: service2
            port:
              number: 80
        path: /foo
        pathType: Prefix
..
```

আপনার পরিবর্তনগুলি সংরক্ষণ করার পরে, kubectl API সার্ভারে রিসোর্সটি আপডেট করে, যা বলে
ইনগ্রেস কন্ট্রোলার লোড ব্যালেন্সার পুনরায় কনফিগার করতে।

এটি যাচাই করুন:

```shell
kubectl describe ingress test
```

```
Name:             test
Namespace:        default
Address:          178.91.123.132
Default backend:  default-http-backend:80 (10.8.2.3:8080)
Rules:
  Host         Path  Backends
  ----         ----  --------
  foo.bar.com
               /foo   service1:80 (10.8.0.90:80)
  bar.baz.com
               /foo   service2:80 (10.8.0.91:80)
Annotations:
  nginx.ingress.kubernetes.io/rewrite-target:  /
Events:
  Type     Reason  Age                From                     Message
  ----     ------  ----               ----                     -------
  Normal   ADD     45s                loadbalancer-controller  default/test
```

আপনি একটি পরিবর্তিত ইনগ্রেস YAML ফাইলে `kubectl replace -f` আহ্বান করে একই ফলাফল অর্জন করতে পারেন।

## প্রাপ্যতা জোন জুড়ে ব্যর্থ হচ্ছে {#failing-across-availability-zones}

ব্যর্থতার ডোমেনগুলির মধ্যে ট্র্যাফিক ছড়িয়ে দেওয়ার কৌশলগুলি ক্লাউড প্রদানকারীদের মধ্যে আলাদা।
বিস্তারিত জানার জন্য প্রাসঙ্গিক [ইনগ্রেস কন্ট্রোলার](/docs/concepts/services-networking/ingress-controllers) এর ডকুমেন্টেশন চেক করুন।

## বিকল্প {#alternatives}

আপনি একটি সার্ভিসকে একাধিক উপায়ে উন্মুক্ত করতে পারেন যা সরাসরি ইনগ্রেস রিসোর্সের সাথে জড়িত নয়:

* [Service.Type=LoadBalancer](/docs/concepts/services-networking/service/#loadbalancer) ব্যবহার করুন
* [Service.Type=NodePort](/docs/concepts/services-networking/service/#type-nodeport) ব্যবহার করুন

## {{% heading "whatsnext" %}}

* [ইনগ্রেস](/docs/reference/kubernetes-api/service-resources/ingress-v1/) API সম্পর্কে জানুন
* [ইনগ্রেস কন্ট্রোলার](/docs/concepts/services-networking/ingress-controllers/) সম্পর্কে জানুন
* [NGINX কন্ট্রোলার সহ Minikube-এ ইনগ্রেস সেট আপ করুন](/docs/tasks/access-application-cluster/ingress-minikube/)
