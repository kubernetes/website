---
title: ক্লাস্টার(Cluster)
id: ক্লাস্টার
date: ২০১৯-০৬-১৫
full_link: 
short_description: >
   ওয়ার্কিং(working) মেশিনের একটি সেট, যাকে নোড বলা হয়, যা কন্টেইনারাইজড অ্যাপ্লিকেশন চালায়। প্রতিটি ক্লাস্টারে কমপক্ষে একটি ওয়ার্কার নোড থাকে।

aka: 
tags:
- fundamental
- operation
---
ওয়ার্কিং(working) মেশিনের একটি সেট, যাকে {{< glossary_tooltip text="nodes" term_id="node" >}} বলা হয়, 
যা কন্টেইনারাইজড অ্যাপ্লিকেশন চালায়। প্রতিটি ক্লাস্টারে কমপক্ষে একটি ওয়ার্কার নোড থাকে।

<!--more-->
ওয়ার্কিং নোড(গুলো) হোস্ট করে {{< glossary_tooltip text="Pods" term_id="pod" >}} যা হচ্ছে 
অ্যাপ্লিকেশন এর কাজেরচাপ(workload) এর উপাদান। 
{{< glossary_tooltip text="control plane" term_id="control-plane" >}} পরিচালনা করে 
ওয়ার্কার নোডগুলো(nodes) এবং পডগুলো(pods)। উৎপাদন পরিবেশে, কন্ট্রোল প্লেন(control plane) সাধারণত
একাধিক কম্পিউটার জুড়ে চলে এবং একটি ক্লাস্টার সাধারণত একাধিক নোড চালায়, প্রদান করে
ত্রুটি-সহনশীলতা(fault-tolerance) এবং উচ্চ প্রাপ্যতা(high-availability)।
