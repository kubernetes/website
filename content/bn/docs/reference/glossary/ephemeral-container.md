---
title: ইফেমেরাল কন্টেইনার(Ephemeral Container)
id: ephemeral-container
date: 2019-08-26
full_link: /bn/docs/concepts/workloads/pods/ephemeral-containers/
short_description: >
  এক ধরনের কন্টেইনার যা আপনি অস্থায়ীভাবে একটি পডের ভিতরে রান করতে পারেন।

aka:
tags:
- fundamental
---
এক ধরনের {{< glossary_tooltip term_id="container" >}} যা আপনি অস্থায়ীভাবে একটি {{< glossary_tooltip term_id="pod" >}}এর ভিতরে রান করতে পারেন।

<!--more-->

আপনি যদি সমস্যা নিয়ে চলমান একটি পড তদন্ত করতে চান তবে আপনি সেই পডে একটি অস্থায়ী কন্টেইনার যোগ করতে পারেন এবং ডায়াগনস্টিকস চালাতে পারেন। ইফেমেরাল কন্টেইনারগুলির কোনও রিসোর্স বা শিডিউলিং গ্যারান্টি নেই এবং ওয়ার্কলোড এর কোনও অংশ চালানোর জন্য সেগুলি আপনার ব্যবহার করা উচিত নয়।

ইফেমেরাল কনটেইনার {{< glossary_tooltip text="স্ট্যাটিক পড" term_id="static-pod" >}} দ্বারা সাপোর্টেড নয়৷
