---
title: ডিপ্লয়মেন্ট(Deployment)
id: deployment
date: 2018-04-12
full_link: /bn/docs/concepts/workloads/controllers/deployment/
short_description: >
  আপনার ক্লাস্টারে একটি প্রতিলিপিকৃত(replicated) অ্যাপ্লিকেশন পরিচালনা করে।

aka: 
tags:
- fundamental
- core-object
- workload
---
 একটি API অবজেক্ট যা একটি প্রতিলিপিকৃত অ্যাপ্লিকেশন পরিচালনা করে, সাধারণত লোকাল স্টেট ব্যতিত পড রান করার মাধ্যমে।

<!--more--> 

প্রতিটি প্রতিলিপি একটি {{< glossary_tooltip term_id="pod" >}} দ্বারা উপস্থাপিত হয়, এবং পডগুলি তাদের মধ্যে ডিস্ট্রিবিউট করা হয়
একটি ক্লাস্টারের {{< glossary_tooltip text="নোড" term_id="node" >}} এর মাধমে।
যেসকল ওয়ার্কলোড এর জন্য লোকাল স্টেট প্রয়োজন, তাদের জন্য {{< glossary_tooltip term_id="StatefulSet" >}} ব্যবহার করা বিবেচনা করুন।
