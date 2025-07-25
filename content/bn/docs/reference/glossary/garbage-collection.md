---
title: গার্বেজ কালেকশন
id: garbage-collection
date: 2021-07-07
full_link: /docs/concepts/architecture/garbage-collection/
short_description: >
  কুবার্নেটিস ক্লাস্টারের রিসোর্স পরিষ্কার করার জন্য ব্যবহৃত বিভিন্ন প্রক্রিয়ার                                  
  সম্মিলিত নাম।

aka: 
tags:
- fundamental
- operation
---

গার্বেজ কালেকশন হলো ক্লাস্টারের রিসোর্স পরিষ্কার করার জন্য কুবার্নেটিস ব্যবহৃত বিভিন্ন প্রক্রিয়ার
সম্মিলিত নাম।

<!--more-->

কুবার্নেটিস নিম্নলিখিত রিসোর্সগুলো পরিস্কার করতে আবর্জনা সংগ্রহ ব্যবহার করে
[অব্যবহৃত কনটেইনার ও ইমেজ](/docs/concepts/architecture/garbage-collection/#containers-images),
[ব্যর্থ পড (Pods)](/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection),
[টার্গেট করা রিসোর্সের মালিকানাধীন অবজেক্ট](/docs/concepts/overview/working-with-objects/owners-dependents/),
[সম্পন্ন হওয়া জবস (Jobs)](/docs/concepts/workloads/controllers/ttlafterfinished/), এবং যেসব রিসোর্সের 
মেয়াদ শেষ হয়েছে বা ব্যর্থ হয়েছে।

