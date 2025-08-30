---
title: kube-scheduler
id: kube-scheduler
date: 2018-04-12
full_link: /docs/reference/command-line-tools-reference/kube-scheduler/
short_description: >
  এটি কন্ট্রোল প্লেন উপাদান যা নতুন তৈরি পডগুলি তে নজর রাখে যাদের কোনো নোড নির্ধারিত নেই, এবং তাদের চালানোর জন্য একটি নোড নির্বাচন করে।

aka: 
tags:
- architecture
---
এটি কন্ট্রোল প্লেন উপাদান যা নতুন তৈরি
{{< glossary_tooltip term_id="pod" text="পডগুলি" >}} তে জন্য নজর রাখে যাদের কোনো নির্ধারিত
{{< glossary_tooltip term_id="node" text="নোড">}} নেই, এবং তাদের চালানোর জন্য একটি নোড নির্বাচন করে।

<!--more-->

সিডিউলিং সিদ্ধান্তের জন্য বিবেচিত বিষয়গুলির মধ্যে রয়েছে:
ব্যক্তিগত এবং সমষ্টিগত {{< glossary_tooltip text="রিসোর্স" term_id="infrastructure-resource" >}} 
প্রয়োজনীয়তা, হার্ডওয়্যার/সফটওয়্যার/পলিসি সীমাবদ্ধতা,
অ্যাফিনিটি এবং অ্যান্টি-অ্যাফিনিটি স্পেসিফিকেশন, ডেটা লোক্যালিটি,
ইন্টার-ওয়ার্কলোড ইন্টারফেরেন্স, এবং সময়সীমা।
