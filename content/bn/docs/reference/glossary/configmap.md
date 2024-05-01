---
title: কনফিগম্যাপ (ConfigMap)
id: configmap
date: ২০১৮/০৪/১২
full_link: /docs/concepts/configuration/configmap/
short_description: >
  একটি API অবজেক্ট কী-মান (key-value) জোড়ায় অ-গোপনীয় ডেটা সংরক্ষণ করতে ব্যবহৃত হয়। এটি এনভায়রনমেন্ট ভেরিয়েবলস , কমান্ড-লাইন আর্গুমেন্টস  বা একটি ভলিউমে কনফিগারেশন ফাইলস হিসাবে ব্যবহার করা যেতে পারে।
aka: 
tags:
- core-object
---
একটি API অবজেক্ট কী-মান (key-value) জোড়ায় অ-গোপনীয় ডেটা সংরক্ষণ করতে ব্যবহৃত হয়। {{< glossary_tooltip text="Pods" term_id="pod" >}} কনফিগম্যাপকে এনভায়রনমেন্ট ভেরিয়েবল, কমান্ড-লাইন আর্গুমেন্টস বা {{< glossary_tooltip text="volume" term_id="volume" >}} -তে কনফিগারেশন ফাইলস হিসেবে ব্যবহার করতে পারে।

<!--more--> 

একটি কনফিগম্যাপ (ConfigMap) আপনাকে আপনার {{< glossary_tooltip text="container images" term_id="image" >}} থেকে এনভায়রনমেন্ট-নির্দিষ্ট কনফিগারেশন ডিকপল (decouple) করার অনুমতি দেয়, যাতে আপনার অ্যাপ্লিকেশনগুলি সহজেই বহনযোগ্য (portable) হয়৷
