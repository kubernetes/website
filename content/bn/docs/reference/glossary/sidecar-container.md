---
title: সাইডকার কন্টেইনার (Sidecar Container)
id: sidecar-container
date: 2018-04-12
full_link: 
short_description: >
  একটি সহায়ক কন্টেইনার যা একটি পডের জীবনচক্র জুড়ে চলতে থাকে।
full_link: /bn/docs/concepts/workloads/pods/sidecar-containers/
tags:
- fundamental
---
 এক বা একাধিক {{< glossary_tooltip text="কন্টেইনার" term_id="container">}} যেটি সাধারণত কোনো অ্যাপ কন্টেইনার চলার আগে শুরু হয়।

<!--more-->

সাইডকার কন্টেইনারগুলি রেগুলার অ্যাপ কন্টেইনারগুলির মতো, কিন্তু একটি ভিন্ন উদ্দেশ্য সহ: সাইডকার প্রধান অ্যাপ কন্টেইনারে একটি পড-লোকাল সার্ভিস প্রদান করে।
{{< glossary_tooltip text="init কন্টেইনার" term_id="init-container" >}} এর বিপরীতে,
পড স্টার্টআপের পরে সাইডকার কন্টেইনার চলতে থাকে।

আরও তথ্যের জন্য [সাইডকার কন্টেইনার](/bn/docs/concepts/workloads/pods/sidecar-containers/) পড়ুন।
