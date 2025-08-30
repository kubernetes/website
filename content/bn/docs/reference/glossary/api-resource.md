---
title: API রিসোর্স
id: api-resource
date: 2025-02-09
full_link: /docs/reference/using-api/api-concepts/#standard-api-terminology
short_description: >
  কুবারনেটিসের একটি এনটিটি, যা কুবারনেটিস API সার্ভারের একটি এন্ডপয়েন্টকে উপস্থাপন করে।

aka:
 - Resource
tags:
- architecture
---
  কুবারনেটিসের একটি এনটিটি, যা {{< glossary_tooltip text="কুবারনেটিস API" term_id="kubernetes-api" >}} সার্ভারের একটি এন্ডপয়েন্টকে উপস্থাপন করে।
একটি রিসোর্স সাধারণত একটি {{< glossary_tooltip text="অবজেক্টের" term_id="object" >}} প্রতিনিধিত্ব করে।
কিছু রিসোর্স অন্য অবজেক্টের উপর পরিচালিত কোনো অপারেশনকে উপস্থাপন করে, যেমন অনুমতি যাচাই।
<!--more-->
প্রতিটি রিসোর্স কুবারনেটিস API সার্ভারের একটি HTTP এন্ডপয়েন্ট (URI) উপস্থাপন করে, যা সেই রিসোর্সের অবজেক্ট বা অপারেশনগুলোর জন্য স্কিমা(schema) নির্ধারণ করে।
