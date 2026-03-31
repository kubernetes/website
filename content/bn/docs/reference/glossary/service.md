---
title: Service
id: service
full_link: /bn/docs/concepts/services-networking/service/
short_description: >
  Pod এর একটি সেটে চলমান একটি অ্যাপ্লিকেশনকে নেটওয়ার্ক সার্ভিস হিসাবে এক্সপোজ করার একটি উপায়।
tags:
- fundamental
- core-object
---
একটি নেটওয়ার্ক অ্যাপ্লিকেশন এক্সপোজ করার একটি পদ্ধতি যা আপনার ক্লাস্টারে এক বা একাধিক
{{< glossary_tooltip text="Pod" term_id="pod" >}} হিসাবে চলছে।

<!--more-->

একটি Service দ্বারা টার্গেট করা Pod এর সেট (সাধারণত) একটি
{{< glossary_tooltip text="সিলেক্টর" term_id="selector" >}} দ্বারা নির্ধারিত হয়। যদি আরও Pod যোগ করা হয় বা সরানো হয়,
সিলেক্টরের সাথে মিলে যাওয়া Pod এর সেট পরিবর্তিত হবে। Service নিশ্চিত করে যে নেটওয়ার্ক ট্রাফিক
ওয়ার্কলোডের জন্য বর্তমান Pod সেটে নির্দেশিত হতে পারে।

Kubernetes Service হয় IP নেটওয়ার্কিং (IPv4, IPv6, বা উভয়) ব্যবহার করে, অথবা ডোমেইন নেম সিস্টেম (DNS) এ একটি বাহ্যিক নাম রেফারেন্স করে।

Service অ্যাবস্ট্রাকশন অন্যান্য মেকানিজম সক্ষম করে, যেমন Ingress এবং Gateway।
