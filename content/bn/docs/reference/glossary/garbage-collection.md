---
title: আবর্জনা সংগ্রহ
id: garbage-collection
date: 2021-07-07
full_link: /docs/concepts/architecture/garbage-collection/
short_description: >
 কুবারনেটস (Kubernetes) ক্লাস্টার রিসোর্স পরিষ্কার করতে ব্যবহার করে বিভিন্ন প্রক্রিয়ার জন্য একটি সম্মিলিত শব্দ।

aka: 
tags:
- fundamental
- operation
---
আবর্জনা সংগ্রহ বেশ কয়েকটি প্রক্রিয়ার জন্য একটি সম্মিলিত শব্দ যা কুবারনেটস (Kubernetes) পরিষ্কার করতে ব্যবহার করে
ক্লাস্টার বা গুচ্ছ সম্পদ।
<!--more-->
Kubernetes যেমন সম্পদ পরিষ্কার করার জন্য আবর্জনা সংগ্রহ ব্যবহার করে
[অব্যবহৃত পাত্র এবং চিত্র](/docs/concepts/architecture/garbage-collection/#containers-images),
[ব্যর্থ পড](/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection),
[লক্ষ্যযুক্ত সম্পদের মালিকানাধীন বস্তু](/docs/concepts/overview/working-with-objects/owners-dependents/),
[সম্পূর্ণ চাকরি](/docs/concepts/workloads/controllers/ttlafterfinished/),এবং সম্পদ
যে মেয়াদ শেষ বা ব্যর্থ হয়েছে।
