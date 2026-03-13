---
title: কন্ট্রোলার
id: controller
full_link: /bn/docs/concepts/architecture/controller/
short_description: >
  একটি কন্ট্রোল লুপ যা apiserver এর মাধ্যমে ক্লাস্টারের শেয়ার্ড স্টেট পর্যবেক্ষণ করে এবং বর্তমান স্টেটকে কাঙ্ক্ষিত স্টেটের দিকে নিয়ে যাওয়ার চেষ্টা করে পরিবর্তন করে।

aka: 
tags:
- architecture
- fundamental
---
কুবারনেটিসে, কন্ট্রোলার হল কন্ট্রোল লুপ যা আপনার
{{< glossary_tooltip term_id="cluster" text="ক্লাস্টারের">}} স্টেট পর্যবেক্ষণ করে, তারপর প্রয়োজন অনুযায়ী
পরিবর্তন করে বা অনুরোধ করে।
প্রতিটি কন্ট্রোলার বর্তমান ক্লাস্টার স্টেটকে কাঙ্ক্ষিত
স্টেটের কাছাকাছি নিয়ে যাওয়ার চেষ্টা করে।

<!--more-->

কন্ট্রোলাররা {{< glossary_tooltip text="apiserver" term_id="kube-apiserver" >}} এর মাধ্যমে আপনার ক্লাস্টারের শেয়ার্ড স্টেট পর্যবেক্ষণ করে
({{< glossary_tooltip term_id="control-plane" text="কন্ট্রোল প্লেনের" >}} অংশ)।

কিছু কন্ট্রোলার কন্ট্রোল প্লেনের ভিতরেও চলে, যা কুবারনেটিসের অপারেশনের জন্য মূল কন্ট্রোল লুপ প্রদান করে। উদাহরণস্বরূপ: deployment কন্ট্রোলার, daemonset কন্ট্রোলার, namespace কন্ট্রোলার, এবং persistent volume কন্ট্রোলার (এবং অন্যান্য) সবগুলি
{{< glossary_tooltip term_id="kube-controller-manager" >}} এর মধ্যে চলে।
