---
title: এগ্রেগেশন লেয়ার
id: aggregation-layer
date: 2018-10-08
full_link: /docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/
short_description: >
  এগ্রেগেশন লেয়ার আপনাকে আপনার ক্লাস্টারে অতিরিক্ত কুবারনেটিস-স্টাইলের এপিআই ইনস্টল করতে দেয়।

aka: 
tags:
- architecture
- extension
- operation
---

এগ্রেগেশন লেয়ার আপনাকে আপনার ক্লাস্টারে অতিরিক্ত কুবারনেটিস-স্টাইলের এপিআই ইনস্টল করতে দেয়।

<!--more-->

যখন আপনি {{< glossary_tooltip text="Kubernetes API Server" term_id="kube-apiserver" >}} 
[অতিরিক্ত এপিআই সমর্থন](/docs/tasks/extend-kubernetes/configure-aggregation-layer/) করার জন্য কনফিগার করেছেন, 
তখন আপনি `API-Service` অবজেক্ট যোগ করে কুবারনেটিস এপিআইতে একটি URL পথ দাবি করতে পারেন।
