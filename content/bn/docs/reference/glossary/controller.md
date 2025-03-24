---
title: কন্ট্রোলার
id: controller
date: 2018-04-12
full_link: /docs/concepts/architecture/controller/
short_description: >
  এটি একটি কন্ট্রোল লুপ যা apiserver এর মাধ্যমে ক্লাস্টারের শেয়ার্ড স্টেট পর্যবেক্ষণ করে এবং বর্তমান স্টেটকে কাঙ্ক্ষিত স্টেটের দিকে নিয়ে যাওয়ার জন্য পরিবর্তন করে।

aka: 
tags:
- architecture
- fundamental
---
কুবারনেটিসে, কন্ট্রোলার হল কন্ট্রোল লুপ যা আপনার 
{{< glossary_tooltip term_id="cluster" text="ক্লাস্টার">}} এর অবস্থা পর্যবেক্ষণ করে, 
তারপর প্রয়োজনে পরিবর্তন করে বা পরিবর্তন করার অনুরোধ করে।
প্রতিটি কন্ট্রোলার বর্তমান ক্লাস্টার স্টেটকে কাঙ্ক্ষিত স্টেটের কাছাকাছি নিয়ে 
যাওয়ার চেষ্টা করে।

<!--more-->

কন্ট্রোলারগুলো {{< glossary_tooltip text="apiserver" term_id="kube-apiserver" >}} 
(apiserver {{< glossary_tooltip term_id="control-plane" >}} এর অংশ) 
এর মাধ্যমে আপনার ক্লাস্টারের শেয়ার্ড স্টেট পর্যবেক্ষণ করে।

কিছু কন্ট্রোলার কন্ট্রোল প্লেনের ভিতরেও চলে, 
যা কুবারনেটিসের অপারেশনগুলোর মূল কন্ট্রোল লুপ প্রদান করে। 
উদাহরণস্বরূপ: ডিপ্লয়মেন্ট (deployment) কন্ট্রোলার, ডেমনসেট (daemonset) কন্ট্রোলার, 
নেমস্পেস (namespace) কন্ট্রোলার, এবং পারসিস্টেন্ট ভলিউম (persistent volume) কন্ট্রোলার (এবং অন্যান্য) সবই 
{{< glossary_tooltip term_id="kube-controller-manager" >}} এর মধ্যে চলে।

