---
#  reviewers:
#  - lavalamp ( The list of approvers is not necessary for the localized version. However, it is included because it helps maintain a certain line break, which further aids in updating a file.That's why it's kept in comment form. ) 
title: কুবারনেটিস কম্পোনেন্ট 
content_type: concept
description: >
  কুবারনেটিস ক্লাস্টার তৈরি করে এমন মূল কম্পোনেন্ট গুলোর একটি ওভারভিউ।
weight: 10
card:
  title: একটি ক্লাস্টারের কম্পোনেন্ট গুলো
  name: concepts
  weight: 20
---

<!-- overview -->

এই পেইজটি প্রয়োজনীয় কম্পোনেন্ট গুলোর একটি হাই-লেভেলের ওভারভিউ প্রদান করে যা একটি কুবারনেটিস ক্লাস্টার তৈরি করে।

{{< figure src="/bn/docs/images/components-of-kubernetes-(bn-version).svg" alt="একটি ক্লাস্টারের কম্পোনেন্ট গুলো" caption="একটি কুবারনেটিস ক্লাস্টারের কম্পোনেন্ট গুলো" class="diagram-large" clicktozoom="true" >}}

<!-- body -->

## মূল কম্পোনেন্ট গুলো

একটি কুবারনেটিস ক্লাস্টার একটি কন্ট্রোল প্লেন এবং এক বা একাধিক ওয়ার্কার নোড নিয়ে গঠিত।
এখানে প্রধান কম্পোনেন্ট গুলোর একটি সংক্ষিপ্ত বিবরণ রয়েছে:

### কন্ট্রোল প্লেন কম্পোনেন্ট গুলো 

ক্লাস্টারের সামগ্রিক অবস্থা পরিচালনা করে:

[kube-apiserver](/docs/concepts/architecture/#kube-apiserver)
: মূল কম্পোনেন্ট সার্ভার যা কুবারনেটিস HTTP API প্রকাশ করে

[etcd](/docs/concepts/architecture/#etcd)
: সকল API সার্ভার ডেটার জন্য সামঞ্জস্যপূর্ণ এবং হাইলি-এভেইলেভেল কী ভ্যালু স্টোর

[kube-scheduler](/docs/concepts/architecture/#kube-scheduler)
: একটি নোডের সাথে এখনও আবদ্ধ নয় এমন পডগুলির সন্ধান করে এবং প্রতিটি পডকে একটি উপযুক্ত নোডে বরাদ্দ করে৷

[kube-controller-manager](/docs/concepts/architecture/#kube-controller-manager)
: কুবারনেটিস API আচরণ বাস্তবায়ন করতে {{< glossary_tooltip text="কন্ট্রোলার" term_id="controller" >}}  চালায়।

[cloud-controller-manager](/docs/concepts/architecture/#cloud-controller-manager) (অপশনাল)
: অন্তর্নিহিত ক্লাউড প্রদানকারী(গুলি) এর সাথে সমন্বিত করে।

### নোড কম্পোনেন্ট গুলো

চলমান পড বজায় রাখে এবং কুবারনেটিস রানটাইম এনভায়রনমেন্ট প্রদান করে প্রতিটি নোডে চালায়:

[kubelet](/docs/concepts/architecture/#kubelet)
: নিশ্চিত করে যে পডগুলো চলছে, তাদের কন্টেইনার সহ।

[kube-proxy](/docs/concepts/architecture/#kube-proxy) (optional)
: {{< glossary_tooltip text="সার্ভিসগুলো" term_id="service" >}} বাস্তবায়নের জন্য নোডগুলিতে নেটওয়ার্ক রুলস বজায় রাখে।

[কন্টেইনার রানটাইম](/docs/concepts/architecture/#container-runtime)
: কন্টেইনার চালানোর জন্য দায়ী সফ্টওয়্যার। আরো জানতে
  [কন্টেইনার রানটাইম](/docs/setup/production-environment/container-runtimes/) পড়ুন।

{{% thirdparty-content single="true" %}}

আপনার ক্লাস্টার প্রতিটি নোডে অতিরিক্ত সফ্টওয়্যার প্রয়োজন হতে পারে;
উদাহরণস্বরূপ, আপনি লোকাল কম্পোনেন্টগুলো তত্ত্বাবধান করতে একটি লিনাক্স নোডে [systemd](https://systemd.io/) চালাতে পারেন।

## অ্যাডঅন

অ্যাডঅন কুবারনেটিসের কার্যকারিতা প্রসারিত করে। কয়েকটি গুরুত্বপূর্ণ উদাহরণের মধ্যে রয়েছে:

[DNS](/docs/concepts/architecture/#dns)
: ক্লাস্টার-ওয়াইড DNS রেজোলিউশনের জন্য

[Web UI](/docs/concepts/architecture/#web-ui-dashboard) (Dashboard)
: একটি ওয়েব ইন্টারফেসের মাধ্যমে ক্লাস্টার পরিচালনার জন্য

[Container Resource Monitoring](/docs/concepts/architecture/#container-resource-monitoring)
: কন্টেইনার মেট্রিক্স সংগ্রহ এবং সংরক্ষণের জন্য

[Cluster-level Logging](/docs/concepts/architecture/#cluster-level-logging)
: একটি কেন্দ্রীয় লগ স্টোরে কন্টেইনার লগ সংরক্ষণের জন্য

## আর্কিটেকচারে ফ্লেক্সিবিলিটি

কুবারনেটিস এই কম্পোনেন্ট গুলোকে কীভাবে স্থাপন এবং পরিচালনা করা হয় তার ক্ষেত্রে ফ্লেক্সিবিলিটি প্রদান করে।
আর্কিটেকচারটি বিভিন্ন প্রয়োজনের জন্য মানিয়ে নেওয়া যেতে পারে, ছোট ডেভেলপমেন্ট এনভায়রনমেন্ট থেকে শুরু করে বড় পরিসরের প্রোডাকশন ডিপ্লয়মেন্ট পর্যন্ত।

প্রতিটি কম্পোনেন্টের ব্যাপারে এবং আপনার ক্লাস্টার আর্কিটেকচার কনফিগার করার বিভিন্ন উপায় সম্পর্কে আরও বিস্তারিত তথ্যের জন্য, [ক্লাস্টার আর্কিটেকচার ](/docs/concepts/architecture/) পেইজটি দেখুন।
