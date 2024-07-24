---
title: সিক্রেট
id: secret
date: 2018-04-12
full_link: /bn/docs/concepts/configuration/secret/
short_description: >
  সংবেদনশীল তথ্য, যেমন পাসওয়ার্ড, OAuth টোকেন এবং ssh কী(keys) গুলো সংরক্ষণ করে।

aka:
tags:
- core-object
- security
---
সংবেদনশীল তথ্য, যেমন পাসওয়ার্ড, OAuth টোকেন এবং ssh কী(keys) গুলো সংরক্ষণ করে।

<!--more-->

সিক্রেট গুলো আপনাকে কীভাবে সংবেদনশীল তথ্য ব্যবহার করা হয় তার উপর আরও নিয়ন্ত্রণ দেয়
এবং দুর্ঘটনাজনিত এক্সপোজারের ঝুঁকি হ্রাস করে। সিক্রেট ভ্যালুগুলি base64 স্ট্রিং হিসাবে এনকোড
করা হয় এবং ডিফল্টরূপে এনক্রিপ্ট না করে সংরক্ষণ করা হয় তবে
[বাকি সময়ে এনক্রিপ্ট](/bn/docs/tasks/administer-cluster/encrypt-data/#ensure-all-secrets-are-encrypted) করার জন্য কনফিগার করা যেতে পারে।

একটি {{< glossary_tooltip text="পড" term_id="pod" >}} বিভিন্ন উপায়ে সিক্রেটকে উল্লেখ করতে পারে,
যেমন একটি ভলিউম মাউন্ট বা এনভায়রনমেন্ট ভেরিয়েবল হিসাবে।
সিক্রেটগুলি গোপনীয় ডেটার জন্য ডিজাইন করা হয়েছে এবং
[কনফিগম্যাপগুলি](/bn/docs/tasks/configure-pod-container/configure-pod-configmap/)
অ-গোপনীয় ডেটার জন্য ডিজাইন করা হয়েছে ৷
