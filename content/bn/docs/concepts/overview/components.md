---
reviewers:
- lavalamp
title: কুবারনেটিস কম্পোনেন্ট
content_type: concept
description: >
  একটি কুবারনেটিস ক্লাস্টার তৈরি করে এমন মূল কম্পোনেন্টগুলির একটি সংক্ষিপ্ত বিবরণ।
weight: 10
card:
  title: ক্লাস্টারের কম্পোনেন্ট
  name: concepts
  weight: 20
---

<!-- overview -->

এই পৃষ্ঠাটি একটি কুবারনেটিস ক্লাস্টার তৈরি করে এমন প্রয়োজনীয় কম্পোনেন্টগুলির একটি উচ্চ-স্তরের সংক্ষিপ্ত বিবরণ প্রদান করে।

{{< figure src="/images/docs/components-of-kubernetes.svg" alt="Components of Kubernetes" caption="একটি কুবারনেটিস ক্লাস্টারের কম্পোনেন্ট" class="diagram-large" clicktozoom="true" >}}

<!-- body -->

## মূল কম্পোনেন্ট

একটি কুবারনেটিস ক্লাস্টার একটি কন্ট্রোল প্লেন এবং এক বা একাধিক ওয়ার্কার Node নিয়ে গঠিত।
এখানে প্রধান কম্পোনেন্টগুলির একটি সংক্ষিপ্ত বিবরণ রয়েছে:

### কন্ট্রোল প্লেন কম্পোনেন্ট

ক্লাস্টারের সামগ্রিক স্টেট পরিচালনা করে:

[kube-apiserver](/bn/docs/concepts/architecture/#kube-apiserver)
: মূল কম্পোনেন্ট সার্ভার যা কুবারনেটিস HTTP API এক্সপোজ করে।

[etcd](/bn/docs/concepts/architecture/#etcd)
: সমস্ত API সার্ভার ডেটার জন্য সামঞ্জস্যপূর্ণ এবং উচ্চ-উপলব্ধ কী ভ্যালু স্টোর।

[kube-scheduler](/bn/docs/concepts/architecture/#kube-scheduler)
: এমন Pod খুঁজে যা এখনও কোনো Node এর সাথে বাউন্ড নয়, এবং প্রতিটি Pod কে একটি উপযুক্ত Node এ অ্যাসাইন করে।

[kube-controller-manager](/bn/docs/concepts/architecture/#kube-controller-manager)
: কুবারনেটিস API আচরণ বাস্তবায়নের জন্য {{< glossary_tooltip text="কন্ট্রোলার" term_id="controller" >}} চালায়।

[cloud-controller-manager](/bn/docs/concepts/architecture/#cloud-controller-manager) (ঐচ্ছিক)
: অন্তর্নিহিত ক্লাউড প্রোভাইডার(গুলি) এর সাথে ইন্টিগ্রেট করে।

### Node কম্পোনেন্ট

প্রতিটি Node এ চলে, চলমান Pod বজায় রাখে এবং কুবারনেটিস রানটাইম এনভায়রনমেন্ট প্রদান করে:

[kubelet](/bn/docs/concepts/architecture/#kubelet)
: নিশ্চিত করে যে Pod গুলি চলছে, তাদের কন্টেইনার সহ।

[kube-proxy](/bn/docs/concepts/architecture/#kube-proxy) (ঐচ্ছিক)
: {{< glossary_tooltip text="Service" term_id="service" >}} বাস্তবায়নের জন্য Node গুলিতে নেটওয়ার্ক রুল বজায় রাখে।

[Container runtime](/bn/docs/concepts/architecture/#container-runtime)
: কন্টেইনার চালানোর জন্য দায়ী সফ্টওয়্যার। আরও জানতে
  [Container Runtime](/bn/docs/setup/production-environment/container-runtimes/) পড়ুন।

{{% thirdparty-content single="true" %}}

আপনার ক্লাস্টারের প্রতিটি Node এ অতিরিক্ত সফ্টওয়্যার প্রয়োজন হতে পারে; উদাহরণস্বরূপ, আপনি
স্থানীয় কম্পোনেন্ট তত্ত্বাবধান করতে একটি Linux Node এ [systemd](https://systemd.io/) চালাতে পারেন।

## অ্যাড-অন

অ্যাড-অন কুবারনেটিসের কার্যকারিতা প্রসারিত করে। কয়েকটি গুরুত্বপূর্ণ উদাহরণ অন্তর্ভুক্ত:

[DNS](/bn/docs/concepts/architecture/#dns)
: ক্লাস্টার-ব্যাপী DNS রেজোলিউশনের জন্য।

[Web UI](/bn/docs/concepts/architecture/#web-ui-dashboard) (Dashboard)
: একটি ওয়েব ইন্টারফেসের মাধ্যমে ক্লাস্টার ম্যানেজমেন্টের জন্য।

[Container Resource Monitoring](/bn/docs/concepts/architecture/#container-resource-monitoring)
: কন্টেইনার মেট্রিক্স সংগ্রহ এবং সংরক্ষণের জন্য।

[Cluster-level Logging](/bn/docs/concepts/architecture/#cluster-level-logging)
: একটি কেন্দ্রীয় লগ স্টোরে কন্টেইনার লগ সংরক্ষণের জন্য।

## আর্কিটেকচারে নমনীয়তা

কুবারনেটিস এই কম্পোনেন্টগুলি কীভাবে ডিপ্লয় এবং পরিচালিত হয় তাতে নমনীয়তার অনুমতি দেয়।
আর্কিটেকচারটি ছোট ডেভেলপমেন্ট এনভায়রনমেন্ট থেকে শুরু করে বড় আকারের প্রোডাকশন ডিপ্লয়মেন্ট পর্যন্ত বিভিন্ন চাহিদার সাথে খাপ খাইয়ে নেওয়া যেতে পারে।

প্রতিটি কম্পোনেন্ট সম্পর্কে আরও বিস্তারিত তথ্য এবং আপনার ক্লাস্টার আর্কিটেকচার কনফিগার করার বিভিন্ন উপায়ের জন্য, [Cluster Architecture](/bn/docs/concepts/architecture/) পৃষ্ঠাটি দেখুন।
