---
title: মিরর-পড
id: mirror-pod
date: 2019-08-06
short_description: >
  API সার্ভারের একটি অবজেক্ট যা একটি kubelet এ একটি স্ট্যাটিক পড ট্র্যাক করে।
  
aka: 
tags:
- fundamental 
---

একটি {{< glossary_tooltip text="পড" term_id="pod" >}} অবজেক্ট যা একটি {{< glossary_tooltip text="kubelet" term_id="kubelet" >}}
ব্যবহার করে {{< glossary_tooltip text="স্ট্যাটিক পড" term_id="static-pod" >}} উপস্থাপন করতে ।

<!more>

যখন kubelet তার কনফিগারেশনে একটি স্ট্যাটিক পড খুঁজে পায়, তখন এটি স্বয়ংক্রিয়ভাবে
এটির জন্য কুবারনেটিস API সার্ভারে একটি পড অবজেক্ট তৈরি করার চেষ্টা করে।
এর মানে হল যে পডটি API সার্ভারে দৃশ্যমান হবে, কিন্তু সেখান থেকে কন্ট্রোল করা যাবে না।

(উদাহরণস্বরূপ, একটি মিরর পড অপসারণ করা kubelet ডেমন(daemon) এটি চালানো বন্ধ করবে না)।
