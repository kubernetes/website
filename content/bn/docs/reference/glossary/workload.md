---
title: ওয়ার্কলোড
id: workload
date: 2019-02-13
full_link: /bn/docs/concepts/workloads/
short_description: >
   ওয়ার্কলোড হলো কুবারনেটিস-এ চলমান একটি অ্যাপ্লিকেশন।

aka: 
tags:
- fundamental
---
   ওয়ার্কলোড হলো কুবারনেটিস-এ চলমান একটি অ্যাপ্লিকেশন।

<!--more--> 

বিভিন্ন কোর অবজেক্ট যা ওয়ার্কলোডের বিভিন্ন ধরণ বা অংশগুলির প্রতিনিধিত্ব করে তাদের মধ্যে ডেমনসেট(DaemonSet), 
ডিপ্লয়মেন্ট, জব, রেপ্লিকাসেট(ReplicaSet), এবং স্টেটফুলসেট অবজেক্ট(StatefulSet objects) অন্তর্ভুক্ত।

উদাহরণস্বরূপ, একটি ওয়ার্কলোড যেখানে একটি ওয়েব সার্ভার এবং একটি ডেটাবেস রয়েছে
তারা ডেটাবেসটি একটি {{< glossary_tooltip term_id="StatefulSet" >}} এ
এবং ওয়েব সার্ভারটি একটি {{< glossary_tooltip term_id="Deployment" >}} এ চালাতে পারে।
