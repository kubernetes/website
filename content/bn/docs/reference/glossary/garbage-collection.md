---
title: আবর্জনা সংগ্রহ
id: garbage-collection
date: ২০২১/০৭/০৭
full_link: /docs/concepts/architecture/garbage-collection/
short_description: >
 কুবারনেটস (Kubernetes) ক্লাস্টার বা গুচ্ছ রিসোর্স বা সংস্থান পরিষ্কার করতে ব্যবহার করে বিভিন্ন প্রক্রিয়ার জন্য একটি সম্মিলিত শব্দ।

aka: 
tags:
- fundamental
- operation
---

আবর্জনা সংগ্রহ বেশ কয়েকটি প্রক্রিয়ার জন্য একটি সম্মিলিত শব্দ যা কুবারনেটস (Kubernetes) পরিষ্কার করতে ব্যবহার করে
ক্লাস্টার বা গুচ্ছ সম্পদ।
<!--more-->
কুবারনেটস (Kubernetes) এই ধরনের সম্পদ পরিষ্কার করার জন্য আবর্জনা সংগ্রহ ব্যবহার করে যেমন 
[অব্যবহৃত পাত্রে এবং ছবি](/docs/concepts/architecture/garbage-collection/#containers-images),
[ব্যর্থ শুঁটি](/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection),
[লক্ষ্যকৃত সম্পদের মালিকানাধীন বস্তু](/docs/concepts/overview/working-with-objects/owners-dependents/),
[কাজ সম্পন্ন](/docs/concepts/workloads/controllers/ttlafterfinished/),এবং সম্পদ
যে মেয়াদ শেষ বা ব্যর্থ হয়েছে।
