---
title: "টুল ইনস্টল করুন"
description: আপনার কম্পিউটারে কুবারনেটিস টুল সেট আপ করুন।
weight: 10
no_list: true
card:
  name: tasks
  weight: 20
  anchors:
  - anchor: "#kubectl"
    title: kubectl ইনস্টল করুন
---

## kubectl

<!-- overview -->
কুবারনেটিস কমান্ড-লাইন টুল, [kubectl](/docs/reference/kubectl/kubectl/)
আপনাকে কুবারনেটিস ক্লাস্টারগুলির বিরুদ্ধে কমান্ড চালাতে অনুমতি দেয় ।
আপনি অ্যাপ্লিকেশন স্থাপন করতে, ক্লাস্টার সংস্থান পরিদর্শন  ও পরিচালনা করতে এবং লগ দেখতে  kubectl ব্যবহার করতে পারেন।
আরও তথ্যের জন্য kubectl অপারেশনগুলির একটি সম্পূর্ণ তালিকা সহ দেখুন
[`kubectl` রেফারেন্স ডকুমেন্টেশন](/docs/reference/kubectl/)।

kubectl বিভিন্ন লিনাক্স প্ল্যাটফর্ম, macOS এবং Windows এ ইনস্টলযোগ্য।
নীচে আপনার পছন্দের অপারেটিং সিস্টেম খুঁজুন।

- [লিনাক্সে kubectl ইনস্টল করুন](/bn/docs/tasks/tools/install-kubectl-linux)
- [macOS-এ kubectl ইনস্টল করুন](/bn/docs/tasks/tools/install-kubectl-macos)
- [উইন্ডোজে kubectl ইনস্টল করুন](/bn/docs/tasks/tools/install-kubectl-windows)

## kind

[`kind`](https://kind.sigs.k8s.io/) আপনাকে কুবারনেটিস চালাতে দেয়
আপনার স্থানীয় কম্পিউটারে।  আপনি
[ডকার](https://www.docker.com/) অথবা [পডম্যান](https://podman.io/) ইনস্টল এবং কনফিগার করুন।

এই ধরনের [কুইক শুরু](https://kind.sigs.k8s.io/docs/user/quick-start/) পৃষ্ঠা আপনাকে
কী করতে হবে তা দেখায়।

<a class="btn btn-primary" href="https://kind.sigs.k8s.io/docs/user/quick-start/" role="button" aria-label="বিভিন্ন ধরনের কুইক স্টার্ট গাইড দেখুন ">বিভিন্ন ধরনের কুইক স্টার্ট গাইড দেখুন </a>

## minikube

`kind` এর মতো, [`minikube`](https://minikube.sigs.k8s.io/) একটি টুল যা আপনাকে স্থানীয়ভাবে কুবারনেটিস চালাতে দেয় ।
`minikube` আপনার ব্যক্তিগত কম্পিউটারের (উইন্ডোজ, ম্যাকোস এবং লিনাক্স পিসি সহ) উপর একটি একক-নোড কুবারনেটিস ক্লাস্টার চালায়
যাতে আপনি চেষ্টা করে দেখতে পারেন কুবারনেটিস, বা দৈনন্দিন উন্নয়ন কাজের জন্য।

আপনি অফিসিয়াল নির্দেশিকা [শুরু করুন!](https://minikube.sigs.k8s.io/docs/start/)
অনুসরণ করতে পারেন যদি আপনার ফোকাস হয় টুল ইনস্টল করার উপর।

<a class="btn btn-primary" href="https://minikube.sigs.k8s.io/docs/start/" role="button" aria-label="minikube শুরু করুন! গাইডটি দেখুন ">minikube শুরু করুন! গাইডটি দেখুন </a>

একবার আপনার `minikube` কাজ করলে, আপনি এটি [একটি নমুনা অ্যাপ্লিকেশন চালাতে](/docs/tutorials/hello-minikube/) ব্যবহার করতে পারেন ।

## kubeadm


আপনি কুবারনেটিস ক্লাস্টার তৈরি এবং পরিচালনা করতে {{< glossary_tooltip term_id="kubeadm" text="kubeadm" >}} টুল ব্যবহার করতে পারেন।
এটি একটি ন্যূনতম কার্যকর, নিরাপদ ক্লাস্টার আপ এবং ব্যবহারকারী বান্ধব উপায়ে চালানোর জন্য প্রয়োজনীয় ক্রিয়া সম্পাদন করে।

[kubeadm ইনস্টল করা](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/) আপনাকে দেখায় কিভাবে kubeadm ইনস্টল করতে হয়।
একবার ইনস্টল হয়ে গেলে আপনি এটিকে [একটি ক্লাস্টার তৈরি করতে](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/) ব্যবহার করতে পারেন।



<a class="btn btn-primary" href="/docs/setup/production-environment/tools/kubeadm/install-kubeadm/" role="button" aria-label="kubeadm ইনস্টল গাইড দেখুন">kubeadm ইনস্টল গাইড দেখুন</a>
