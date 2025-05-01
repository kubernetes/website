---
layout: blog
title: "গেটওয়ে API v1.1: সার্ভিস মেশ, GRPCRoute, এবং আরো অনেক কিছু"
date: 2024-05-09T09:00:00-08:00
slug: gateway-api-v1-1
author: >
  [Richard Belleville](https://github.com/gnossen) (Google),
  [Frank Budinsky](https://github.com/frankbu) (IBM),
  [Arko Dasgupta](https://github.com/arkodg) (Tetrate),
  [Flynn](https://github.com/kflynn) (Buoyant),
  [Candace Holman](https://github.com/candita) (Red Hat),
  [John Howard](https://github.com/howardjohn) (Solo.io),
  [Christine Kim](https://github.com/xtineskim) (Isovalent),
  [Mattia Lavacca](https://github.com/mlavacca) (Kong),
  [Keith Mattix](https://github.com/keithmattix) (Microsoft),
  [Mike Morris](https://github.com/mikemorris) (Microsoft),
  [Rob Scott](https://github.com/robscott) (Google),
  [Grant Spence](https://github.com/gcs278) (Red Hat),
  [Shane Utt](https://github.com/shaneutt) (Kong),
  [Gina Yeh](https://github.com/ginayeh) (Google),
  and other review and release note contributors
---

![গেটওয়ে API লোগো](gateway-api-logo.svg)

গত অক্টোবরে গেটওয়ে API-এর
GA রিলিজের পর, কুবারনেটিস SIG নেটওয়ার্ক [গেটওয়ে API](https://gateway-api.sigs.k8s.io/)-এর v1.1
রিলিজ ঘোষণা করতে পেরে আনন্দিত। এই রিলিজে, বেশ কিছু ফিচার
_Standard Channel_ (GA)-তে গ্র্যাজুয়েট হচ্ছে, বিশেষত সার্ভিস মেশ এবং GRPCRoute-এর জন্য
সাপোর্ট সহ। আমরা কিছু নতুন এক্সপেরিমেন্টাল ফিচারও প্রবর্তন করছি, যার মধ্যে
সেশনের স্থিরতা এবং ক্লায়েন্ট সার্টিফিকেট ভেরিফিকেশন।

## নতুন কি

### স্ট্যান্ডার্ড থেকে গ্র্যাজুয়েট

এই রিলিজে চারটি অধীর আগ্রহে প্রতীক্ষিত ফিচার স্ট্যান্ডার্ডে গ্র্যাজুয়েট অন্তর্ভুক্ত রয়েছে।
এর মানে এগুলো আর পরীক্ষামূলক ধারণা নয়; স্ট্যান্ডার্ড রিলিজ
চ্যানেলে অন্তর্ভুক্তি API সারফেসের উপর হাই লেভেলের আস্থা নির্দেশ করে এবং
ব্যাকওয়ার্ড কম্প্যাটিবিলিটির গ্যারান্টি প্রদান করে। অবশ্যই, অন্য যেকোন
কুবারনেটিস API-এর মতো, স্ট্যান্ডার্ড চ্যানেল ফিচারগুলি সময়ের সাথে সাথে
ব্যাকওয়ার্ড-কম্প্যাটিবিলিটির সংযোজনের সাথে বিকশিত হতে পারে এবং আমরা অবশ্যই ভবিষ্যতে
এই নতুন ফিচারগুলিতে আরও রিফাইনমেন্ট এবং উন্নতি আশা করি।
এই সবগুলি কীভাবে কাজ করে সে সম্পর্কে আরও তথ্যের জন্য,
[গেটওয়ে API ভার্শনিং পলিসি](https://gateway-api.sigs.k8s.io/concepts/versioning/) দেখুন।

#### [সার্ভিস মেশ সাপোর্ট](https://gateway-api.sigs.k8s.io/mesh/)

সার্ভিস মেশ সাপোর্ট গেটওয়ে APIতে সার্ভিস মেশ ব্যবহারকারীদের ইনগ্রেস ট্র্যাফিক এবং মেশ ট্র্যাফিক
পরিচালনা করতে, একই পলিসি এবং রাউটিং ইন্টারফেসগুলি পুনরায় ব্যবহার করতে একই API
ব্যবহার করতে দেয়। গেটওয়ে API v1.1-এ, রুটগুলিতে (যেমন HTTPRoute) এখন 'parentRef' হিসাবে
একটি সার্ভিস থাকতে পারে, নির্দিষ্ট সার্ভিসগুলিতে ট্র্যাফিক কীভাবে আচরণ করে তা নিয়ন্ত্রণ করতে।
আরও তথ্যের জন্য,
[গেটওয়ে API সার্ভিস মেশ ডকুমেন্টেশন] (https://gateway-api.sigs.k8s.io/mesh/)
পড়ুন বা 
[গেটওয়ে API বাস্তবায়নের তালিকা] (https://gateway-api.sigs.k8s.io/implementations/#service-mesh-implementation-status) দেখুন।

উদাহরণস্বরূপ, কেউ একটি HTTPRoute দিয়ে একটি অ্যাপ্লিকেশনের কল গ্রাফের গভীরে
একটি ওয়ার্কলোডের একটি canary স্থাপনার কাজ করতে পারে:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: color-canary
  namespace: faces
spec:
  parentRefs:
    - name: color
      kind: Service
      group: ""
      port: 80
  rules:
  - backendRefs:
    - name: color
      port: 80
      weight: 50
    - name: color2
      port: 80
      weight: 50
```

এটি মূল `color` সার্ভিস এবং `color2` সার্ভিসটির মধ্যে `faces` নেমস্পেস এর
`color` সার্ভিসটিতে প্রেরিত ট্র্যাফিককে 50/50 বিভক্ত করবে, একটি পোর্টেবল
কনফিগারেশন ব্যবহার করে যা এক মেশ থেকে অন্য মেশে সরানো সহজ।

#### [GRPCRoute](https://gateway-api.sigs.k8s.io/guides/grpc-routing/)

আপনি যদি ইতিমধ্যে GRPCRoute এর পরীক্ষামূলক ভার্সনটি ব্যবহার করে থাকেন তবে আমরা
GRPCRoute স্ট্যান্ডার্ড চ্যানেল ভার্সনে আপগ্রেড করা বন্ধ রাখার পরামর্শ দিচ্ছি যতক্ষণ না আপনি যে কন্ট্রোলারগুলি
ব্যবহার করছেন তা GRPCRoute v1 সমর্থন করার জন্য আপডেট করা হয়। ততক্ষণ পর্যন্ত,
GRPCRoute-এর v1.1-এ পরীক্ষামূলক চ্যানেল ভার্সনে আপগ্রেড করা নিরাপদ
যা v1alpha2 এবং v1 API ভার্সন উভয়ই অন্তর্ভুক্ত করে।

#### [ParentReference Port](https://gateway-api.sigs.k8s.io/reference/spec/#gateway.networking.k8s.io%2fv1.ParentReference)

`port` ফিল্ডটি ParentReference এ যুক্ত করা হয়েছিল, আপনাকে গেটওয়ে লিসেনার,
সার্ভিস বা অন্যান্য প্যারেন্ট রিসোর্সগুলিতে রিসোর্সগুলি সংযুক্ত করার অনুমতি দেয়
(বাস্তবায়নের উপর নির্ভর করে)। একটি পোর্টের সাথে বাইন্ডিং আপনাকে
একবারে একাধিক লিসেনার্সের সাথে অ্যাটাচ করতে দেয়।

উদাহরণস্বরূপ, আপনি লিসেনারের `name` ফিল্ডের পরিবর্তে লিসেনার `port` দ্বারা নির্দিষ্ট হিসাবে
গেটওয়ের এক বা একাধিক নির্দিষ্ট লিসেনারের সাথে একটি HTTPRoute সংযুক্ত করতে পারেন।

আরও তথ্যের জন্য, দেখুন
[গেটওয়েতে সংযুক্ত করা হচ্ছে](https://gateway-api.sigs.k8s.io/api-types/httproute/#attaching-to-gateways).

#### [কনফর্মেন্স প্রোফাইল এবং রিপোর্ট](https://gateway-api.sigs.k8s.io/concepts/conformance/#conformance-profiles)

কনফর্মেন্স রিপোর্ট API `mode` ফিল্ড (ইমপ্লিমেন্টেশনের কাজের মোড নির্দিষ্ট করার
উদ্দেশ্যে) এবং `gatewayAPIChannel` (স্ট্যান্ডার্ড বা এক্সপেরিমেন্টাল)
দিয়ে প্রসারিত করা হয়েছে। `gatewayAPIVersion` এবং `gatewayAPIChannel`
এখন টেস্টিং ফলাফলের সংক্ষিপ্ত বিবরণ সহ স্যুট মেশিনারি দ্বারা
স্বয়ংক্রিয়ভাবে পূরণ করা হয়। প্রতিবেদনগুলি আরও স্ট্রাকচারড উপায়ে পুনর্গঠিত হয়েছে এবং
ইমপ্লিমেন্টেশনগুলিতে এখন টেস্টগুলি কীভাবে চালানো হবে সে সম্পর্কে তথ্য যুক্ত করতে পারে এবং
রিপ্রোডাকশন পদক্ষেপগুলি সরবরাহ করতে পারে।

### এক্সপেরিমেন্টাল চ্যানেলে নতুন সংযোজন

#### [গেটওয়ে ক্লায়েন্ট সার্টিফিকেট ভেরিফিকেশন](https://gateway-api.sigs.k8s.io/geps/gep-91/)

গেটওয়েগুলি এখন `tls` এর মধ্যে একটি নতুন `frontendValidation` ফিল্ড প্রবর্তন করে প্রতিটি
গেটওয়ে লিস্টেনারের জন্য ক্লায়েন্ট সার্টিফিকেট ভেরিফিকেশন কনফিগার করতে পারে।
এই ফিল্ডটি CA সার্টিফিকেটগুলির একটি তালিকা কনফিগার করা সমর্থন করে যা ক্লায়েন্ট দ্বারা উপস্থাপিত
সার্টিফিকেটগুলি যাচাই করার জন্য ট্রাস্ট অ্যাঙ্কর হিসাবে ব্যবহার করা যেতে পারে।

নিম্নলিখিত উদাহরণটি দেখায় যে কীভাবে `foo-example-com-ca-cert`
ConfigMap-এ সঞ্চিত CACertificate-টি `foo-https` গেটওয়ে লিস্টেনারের সাথে সংযুক্ত ক্লায়েন্টদের
দ্বারা উপস্থাপিত সার্টিফিকেটগুলি যাচাই করতে ব্যবহার করা যেতে পারে।

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: client-validation-basic
spec:
  gatewayClassName: acme-lb
  listeners:
    name: foo-https
    protocol: HTTPS
    port: 443
    hostname: foo.example.com
  tls:
    certificateRefs:
      kind: Secret
      group: ""
      name: foo-example-com-cert
    frontendValidation:
      caCertificateRefs:
        kind: ConfigMap
        group: ""
        name: foo-example-com-ca-cert
```

#### [সেশন পার্সিস্টেন্স এবং BackendLBPolicy (Session Persistence and BackendLBPolicy)](https://gateway-api.sigs.k8s.io/geps/gep-1619/)

সার্ভিস-লেভেলের কনফিগারেশনের জন্য একটি নতুন পলিসি
([BackendLBPolicy](https://gateway-api.sigs.k8s.io/reference/spec/#gateway.networking.k8s.io/v1alpha2.BackendLBPolicy))
এবং রুট-লেভেলের কনফিগারেশনের জন্য HTTPRoute এবং GRPCRoute এর মধ্যে ফিল্ড হিসাবে গেটওয়ে API-তে
[সেশন পার্সিস্টেন্স](https://gateway-api.sigs.k8s.io/reference/spec/#gateway.networking.k8s.io%2fv1.SessionPersistence)
ইন্ট্রোডিউসড করা হচ্ছে। BackendLBPolicy এবং রুট-লেভেলের
API-গুলি সেশন টাইমআউট, সেশনের নাম, সেশনের ধরণ এবং কুকি লাইফটাইম টাইপ সহ
একই সেশন পার্সিস্টেন্স কনফিগারেশন সরবরাহ করে।

নীচে `BackendLBPolicy` এর একটি উদাহরণ কনফিগারেশন রয়েছে যা `foo` সার্ভিসের জন্য কুকি-বেসড
সেশন পার্সিস্টেন্স এনাবল করে। এটি সেশনের নামটি `foo-session` এ সেট করে,
অ্যাবসুলুট এবং আইডিএল টাইমআউটসগুলি ডিফাইন করে এবং কুকিটিকে সেশন
কুকি হিসাবে কনফিগার করে:

```yaml
apiVersion: gateway.networking.k8s.io/v1alpha2
kind: BackendLBPolicy
metadata:
  name: lb-policy
  namespace: foo-ns
spec:
  targetRefs:
  - group: core
    kind: service
    name: foo
  sessionPersistence:
    sessionName: foo-session
    absoluteTimeout: 1h
    idleTimeout: 30m
    type: Cookie
    cookieConfig:
      lifetimeType: Session
```

### বাকি সব

#### [TLS টার্মিনোলজি ক্ল্যারিফিকেশন](https://gateway-api.sigs.k8s.io/geps/gep-2907/)

API জুড়ে আমাদের TLS টার্মিনোলজিকে আরও সামঞ্জস্যপূর্ণ করার বিস্তৃত লক্ষ্যের
অংশ হিসাবে, আমরা BackendTLSPolicy-তে কিছু ব্রেকিং পরিবর্তন ইন্ট্রোডিউসড করেছি।
এর ফলে একটি নতুন API ভার্সন (v1alpha3) তৈরি হয়েছে এবং ভার্সন আপগ্রেড সঠিকভাবে পরিচালনা
করার জন্য এই নীতির যে কোনও এক্সিস্টিং ইমপ্লিমেন্টেশনের প্রয়োজন হবে, যেমন
ডেটা ব্যাক আপ করে এবং এই নতুন ভার্সনটি ইনস্টল করার আগে v1alpha2
ভার্সনটি আনইনস্টল করতে হবে।

v1alpha2 BackendTLSPolicy ফিল্ড-ত্রর যে কোনও রেফারেন্স v1alpha3 এ আপডেট করতে হবে।
ফিল্ডগুলিতে নির্দিষ্ট পরিবর্তনগুলির মধ্যে রয়েছে:

- `targetRef` BackendTLSPolicy-কে একাধিক লক্ষ্যবস্তুর সাথে সংযুক্ত করার অনুমতি দেওয়ার
  জন্য `targetRefs` হয়ে যায়
- `tls`  হয়ে যায় `validation`
- `tls.caCertRefs` হয়ে যায় `validation.caCertificateRefs`
- `tls.wellKnownCACerts` হয়ে যায় `validation.wellKnownCACertificates`

এই রিলিজে অন্তর্ভুক্ত পরিবর্তনগুলির সম্পূর্ণ তালিকার জন্য, দয়া করে
[v1.1.0 রিলিজ নোটগুলি](https://github.com/kubernetes-sigs/gateway-api/releases/tag/v1.1.0) দেখুন।

## গেটওয়ে API ব্যাকগ্রাউন্ড

গেটওয়ে API-এর ধারণাটি প্রাথমিকভাবে 2019 KubeCon San Diego-তে
Ingress API-এর পরবর্তী প্রজন্ম হিসাবে [প্রপোজড](https://youtu.be/Ne9UJL6irXY?si=wgtC9w8PMB5ZHil2)
করা হয়েছিল। তার পর থেকে,
[কুবারনেটিস ইতিহাসের সবচেয়ে সহযোগী API](https://www.youtube.com/watch?v=V3Vu_FWb4l4)
হয়ে ওঠার জন্য একটি অবিশ্বাস্য কমিউনিটি গঠিত হয়েছে।
এখন পর্যন্ত 200 জনেরও বেশি লোক এই API-তে অবদান রেখেছে এবং এই সংখ্যাটি বাড়ছে।

রক্ষণাবেক্ষণকারীরা গেটওয়ে API তে অবদান রেখেছেন রিপোসিটোরি তে কমিট,
ডিসকাশন, আইডিয়া বা সাধারণ সহায়তার আকারে এমন প্রত্যেককে ধন্যবাদ জানাতে চান।
আমরা সত্যিকার অর্থেই এই নিবেদিত ও সক্রিয় কমিউনিটির সাপোর্ট ছাড়া এতদূর
আসতে পারতাম না।

## চেষ্টা করে দেখুন

অন্যান্য কুবারনেটিস API-গুলির বিপরীতে, গেটওয়ে API-এর সর্বশেষ ভার্সন পেতে আপনাকে
কুবারনেটিসের সর্বশেষ ভার্সনে আপগ্রেড করতে হবে না। যতক্ষণ না আপনি কুবারনেটিস 1.26
বা তার পরের টা চালাচ্ছেন, আপনি গেটওয়ে API-এর এই ভার্সনটি দিয়ে উঠতে এবং
চালাতে সক্ষম হবেন।

API ব্যবহার করতে, আমাদের [শুরু করার গাইড](https://gateway-api.sigs.k8s.io/guides/) অনুসরণ করুন।

## যুক্ত হোন

ইনগ্রেস এবং সার্ভিস মেশ উভয়ের জন্য কুবারনেটিস রাউটিং API-গুলির ভবিষ্যতকে সংজ্ঞায়িত করতে
এবং সহায়তা করার প্রচুর সুযোগ রয়েছে।

* কোন ইউজ-কেস সম্বোধন করা যেতে পারে তা দেখতে [ব্যবহারকারী গাইডগুলি](https://gateway-api.sigs.k8s.io/guides) দেখুন।
* [বিদ্যমান গেটওয়ে কন্ট্রোলারগুলির](https://gateway-api.sigs.k8s.io/implementations/) মধ্যে একটি ব্যবহার করে দেখুন।
* অথবা [কমিউনিটিতে আমাদের সাথে যোগ দিন](https://gateway-api.sigs.k8s.io/contributing/)
  এবং একসাথে গেটওয়ে API-এর ভবিষ্যত গড়ে তুলতে আমাদের সহায়তা করুন!

## রিলেটেড কুবারনেটিস ব্লগ আর্টিকেলস

* [গেটওয়ে API v1.0 এ নতুন এক্সপেরিমেন্টাল ফিচারস](/blog/2023/11/28/gateway-api-ga/)
  11/2023
* [গেটওয়ে API v1.0: GA রিলিজ](/blog/2023/10/31/gateway-api-ga/)
  10/2023
* [ingress2gateway ইন্ট্রোডিউসিং করা; গেটওয়ে API-তে আপগ্রেড সিম্পলিফাই করা হচ্ছে](/blog/2023/10/25/introducing-ingress2gateway/)
  10/2023
* [গেটওয়ে API v0.8.0: ইন্ট্রোডিউসিং সার্ভিস মেশ সাপোর্ট](/blog/2023/08/29/gateway-api-v0-8/)
  08/2023
