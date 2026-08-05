---
title: API সার্ভার
id: kube-apiserver
date: 2018-04-12
full_link: /docs/concepts/architecture/#kube-apiserver
short_description: >
   কন্ট্রোল প্লেন উপাদান যা কুবারনেটিস API পরিবেশন করে।

aka:
- kube-apiserver
tags:
- architecture
- fundamental
---
 API সার্ভার হলো কুবারনেটিস {{< glossary_tooltip text="কন্ট্রোল প্লেন" term_id="control-plane" >}}
এর একটি উপাদান যা কুবারনেটিস API কে প্রকাশ করে ৷
API সার্ভার কুবারনেটিস কন্ট্রোল প্লেনের ফ্রন্ট এন্ড হিসেবে কাজ করে।

<!--more-->

কুবারনেটিস API সার্ভারের প্রধান বাস্তবায়ন হলো [kube-apiserver](/docs/reference/generated/kube-apiserver/)।
kube-apiserver অনুভূমিকভাবে স্কেল করার জন্য ডিজাইন করা হয়েছে&mdash;অর্থাৎ, এটি আরও বেশি উদাহরণ ডেপ্লয় করে স্কেল করে।
আপনি একাধিক kube-apiserver উদাহরণ চালাতে পারেন এবং সেই উদাহরণগুলির মধ্যে ট্রাফিক ব্যালেন্স করতে পারেন।
