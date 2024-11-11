---
reviewers:
- lavalamp
title: কুবারনেটিস কম্পোনেন্টস 
content_type: concept
description: >
  কুবারনেটিস ক্লাস্টার তৈরী করে যে মূল কম্পোনেন্টস গুলো তাদের একটি ওভারভিউ। 
weight: 10
card:
  title: Components of a cluster
  name: concepts
  weight: 20
---

<!-- overview -->

এই পেইজটি প্রয়োজনীয় কম্পোনেন্টসগুলির একটি উচ্চ-স্তরের ওভারভিউ প্রদান করে যা একটি কুবারনেটিস ক্লাস্টার তৈরি করে।

{{< figure src="/images/docs/components-of-kubernetes.svg" alt="Components of Kubernetes" caption="The components of a Kubernetes cluster" class="diagram-large" clicktozoom="true" >}}

<!-- body -->

## Core Components

একটি কুবারনেটিস ক্লাস্টার একটি কন্ট্রোল প্লেন এবং এক বা একাধিক ওয়ার্কার নোড নিয়ে গঠিত।
এখানে প্রধান কম্পোনেন্টসগুলির একটি সংক্ষিপ্ত বিবরণ রয়েছে:

### কন্ট্রোল প্লেন কম্পোনেন্টস

ক্লাস্টারের সামগ্রিক অবস্থা পরিচালনা করে:

[kube-apiserver](/docs/concepts/architecture/#kube-apiserver)
: মূল কম্পোনেন্ট সার্ভার যা কুবারনেটিস HTTP API প্রকাশ করে

[etcd](/docs/concepts/architecture/#etcd)
: সকল API সার্ভার ডেটার জন্য সামঞ্জস্যপূর্ণ এবং অত্যন্ত-উপলব্ধ কী ভ্যালু স্টোর

[kube-scheduler](/docs/concepts/architecture/#kube-scheduler)
: একটি নোডের সাথে এখনও আবদ্ধ নয় এমন পডগুলির সন্ধান করে এবং প্রতিটি পডকে একটি উপযুক্ত নোডে বরাদ্দ করে৷

[kube-controller-manager](/docs/concepts/architecture/#kube-controller-manager)
: কুবারনেটিস API আচরণ বাস্তবায়ন করতে {{< glossary_tooltip text="কন্ট্রোলার" term_id="controller" >}}  চালায়।

[cloud-controller-manager](/docs/concepts/architecture/#cloud-controller-manager) (optional)
: অন্তর্নিহিত ক্লাউড প্রদানকারী(গুলি) এর সাথে সংহত করে।

### নোড কম্পোনেন্টস

প্রতিটি নোডে চালানো হয়, চলমান পড বজায় রেখে এবং কুবারনেটিস রানটাইম এনভায়রনমেন্ট প্রদান করে:

[kubelet](/docs/concepts/architecture/#kubelet)
: নিশ্চিত করে যে পডগুলো চলছে, তাদের কন্টেইনার সহ।

[kube-proxy](/docs/concepts/architecture/#kube-proxy) (optional)
: নোডগুলিতে নেটওয়ার্ক নিয়ম বজায় রাখে {{< glossary_tooltip text="সেবাগুলি" term_id="service" >}} বাস্তবায়নের জন্য।

[Container runtime](/docs/concepts/architecture/#container-runtime)
: কন্টেইনার চালানোর জন্য দায়ী সফ্টওয়্যার। আরো জানতে
  [Container Runtimes](/docs/setup/production-environment/container-runtimes/) পড়ুন।

{{% thirdparty-content single="true" %}}

আপনার ক্লাস্টার প্রতিটি নোডে অতিরিক্ত সফ্টওয়্যার প্রয়োজন হতে পারে; উদাহরণস্বরূপ, আপনি একটি লিনাক্স নোডে [systemd](https://systemd.io/) চালাতে পারেন লোকাল কম্পোনেন্টস তদারকি করার জন্য।

## অ্যাডনস্

অ্যাডনস্ কুবারনেটিসের কার্যকারিতা প্রসারিত করে। কয়েকটি গুরুত্বপূর্ণ উদাহরণের মধ্যে রয়েছে:

[DNS](/docs/concepts/architecture/#dns)
: ক্লাস্টার-ওয়াইড DNS রেজোলিউশনের জন্য

[Web UI](/docs/concepts/architecture/#web-ui-dashboard) (Dashboard)
: একটি ওয়েব ইন্টারফেসের মাধ্যমে ক্লাস্টার পরিচালনার জন্য

[Container Resource Monitoring](/docs/concepts/architecture/#container-resource-monitoring)
: কন্টেইনার মেট্রিক্স সংগ্রহ এবং সংরক্ষণের জন্য

[Cluster-level Logging](/docs/concepts/architecture/#cluster-level-logging)
: একটি কেন্দ্রীয় লগ স্টোরে কন্টেইনার লগ সংরক্ষণের জন্য

## আর্কিটেকচারে নমনীয়তা

কুবারনেটিস এই কম্পোনেন্টগুলিকে কীভাবে স্থাপন এবং পরিচালনা করা হয় তার ক্ষেত্রে নমনীয়তা প্রদান করে।
আর্কিটেকচারটি বিভিন্ন প্রয়োজনের জন্য মানিয়ে নেওয়া যেতে পারে, ছোট ডেভেলপমেন্ট এনভায়রনমেন্ট থেকে শুরু করে বড় পরিসরের প্রোডাকশন ডিপ্লয়মেন্ট পর্যন্ত।

প্রতিটি কম্পোনেন্টের ব্যাপারে এবং আপনার ক্লাস্টার আর্কিটেকচার কনফিগার করার বিভিন্ন উপায় সম্পর্কে আরও বিস্তারিত তথ্যের জন্য, [Cluster Architecture](/docs/concepts/architecture/) পেইজটি দেখুন।
