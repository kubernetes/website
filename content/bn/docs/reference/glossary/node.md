---
title: নোড
id: node
date: 2018-04-12
full_link: /docs/concepts/architecture/nodes/
short_description: >
  নোড হলো কুবারনেটিসে একটি ওয়ার্কার মেশিন।

aka:
tags:
- fundamental
---
নোড হলো কুবারনেটিসে একটি ওয়ার্কার মেশিন।

<!--more-->

একটি ওয়ার্কার নোড একটি ভার্চুয়াল মেশিন বা ফিজিক্যাল মেশিন হতে পারে, একটি ক্লাস্টারের উপর নির্ভর করে । এটির {{< glossary_tooltip text="পডগুলোকে" term_id="pod" >}} সহজে চালানোর জন্য প্রয়োজনীয় সকল লোকাল ডেমন(daemons) বা সার্ভিস আছে এবং এটি কন্ট্রোল প্লেন দ্বারা পরিচালিত হয়। একটি নোডের ডেমনগুলোতে থাকে {{< glossary_tooltip text="kubelet" term_id="kubelet" >}}, {{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}}, এবং একটি কন্টেইনার রানটাইম যা {{< glossary_tooltip text="CRI" term_id="cri" >}} সম্পাদন করে যেমন {{< glossary_tooltip term_id="docker" >}}

প্রাথমিক কুবারনেটিস সংস্করণে, নোডগুলি "Minions" হিসেবে পরিচিত ছিল।
