---
title: সার্ভিস অ্যাকাউন্ট
id: service-account
date: 2018-04-12
full_link: /docs/tasks/configure-pod-container/configure-service-account/
short_description: >
  পডে চলমান কার্যক্রমের জন্য একটি পরিচিতি সরবরাহ করে।

aka: 
tags:
- fundamental
- core-object
---

{{< glossary_tooltip text="পডে" term_id="pod" >}} চলমান কার্যক্রমের জন্য একটি পরিচিতি সরবরাহ করে।

<!--more--> 

যখন পডে ভেতরের প্রক্রিয়াগুলি ক্লাস্টার অ্যাক্সেস করে, তাদেরকে প্রাসঙ্গিক সার্ভিস অ্যাকাউন্ট হিসেবে API সার্ভার দ্বারা অথেনটিকেট(authenticate) করা হয়, উদাহরণস্বরূপ, `default`। যদি আপনি সার্ভিস অ্যাকাউন্ট নির্দিষ্ট না করে একটি পড তৈরি করেন, তাহলে স্বয়ংক্রিয়ভাবে একই {{< glossary_tooltip text="নেমস্পেস" term_id="namespace" >}} এ ডিফল্ট সার্ভিস অ্যাকাউন্টটি নির্ধারন করে দেওয়া হয়।
