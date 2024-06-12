---
title: অ্যাফিনিটি (Affinity)
id: affinity
date: 2019-01-11
full_link: /bn/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity
short_description: >
     শিডিউলার দ্বারা ব্যবহৃত নিয়ম নির্ধারণ করে পড কোথায় রাখতে হবে
aka:
tags:
- fundamental
---

কুবারনেটিসে, _অ্যাফিনিটি_ হল নিয়মগুলির একটি সেট যা পডগুলি কোথায় রাখতে হবে সে সম্পর্কে শিডিউলারকে ইঙ্গিত দেয়।

<!--more-->
দুই ধরণের অ্যাফিনিটি রয়েছে:
* [নোড অ্যাফিনিটি](/bn/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity)
* [পড-টু-পড অ্যাফিনিটি](/bn/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-ant-affinity)

নিয়মগুলি সংজ্ঞায়িত করা হয়েছে কুবারনেটিস ব্যবহার করে {{< glossary_tooltip term_id="label" text="লেবেল">}},
এবং {{< glossary_tooltip term_id="selector" text="নির্বাচক">}} এ উল্লেখ করা হয়েছে {{< glossary_tooltip term_id="pod" text="পড" >}},
এবং সেগুলি হয় প্রয়োজন বা পছন্দের হতে পারে, আপনি কতটা কঠোরভাবে শিডিউলারকে তাদের প্রয়োগ করতে চান তার উপর নির্ভর করে।
