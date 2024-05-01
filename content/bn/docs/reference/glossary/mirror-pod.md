---
title: মিরর পদ
id: mirror-pod
date: ২০১৯-০৮-০৬
short_description: >
  একটি অবজেক্ট  এর এপিআই সার্ভার যা অনুসরণ করে একটি kubelet এর  উপর একটি স্ট্যাটিক পদ ।
aka: 
tags:
- মৌলিক 
---
একটি {{< glossary_tooltip text="pod" term_id="pod" >}} object that a {{< glossary_tooltip text="kubelet" term_id="kubelet" >}}
প্রতিনিধিত্ব করতে ব্যবহার করে {{< glossary_tooltip text="static pod" term_id="static-pod" >}}


যখন kubelet এর কনফিগারেশনে একটি স্ট্যাটিক পদ পায়, তখন স্বয়ংক্রিয়ভাবে এটি
একটি পদ অবজেক্ট তৈরি করার জন্য কোনো প্রয়াস করে । এটা মানে করে যে পড়টি
API সার্ভারে দেখা যাবে, কিন্তু এটি সেখান থেকে নিয়ন্ত্রণ করা যাবে না।

(যেমন, একটি মিরর পদ সরানোর মাধ্যমে kubelet daemon  চালু করা থেকে বাধা পাওয়া যাবে না)।
