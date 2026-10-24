---
title: "dockershim থেকে মাইগ্রেট করা"
weight: 20
content_type: task
no_list: true
---

<!-- overview -->

এই বিভাগটি dockershim থেকে অন্যান্য কন্টেইনার রানটাইমে মাইগ্রেট করার সময় আপনার জানা প্রয়োজন এমন তথ্য উপস্থাপন করে।

কুবারনেটিস 1.20 এ [dockershim ডেপ্রিকেশন](/blog/2020/12/08/kubernetes-1-20-release-announcement/#dockershim-deprecation)
এর ঘোষণার পর থেকে, এটি বিভিন্ন ওয়ার্কলোড এবং কুবারনেটিস
ইনস্টলেশনকে কীভাবে প্রভাবিত করবে সে সম্পর্কে প্রশ্ন ছিল। আমাদের [Dockershim Removal FAQ](/blog/2022/02/17/dockershim-faq/) আপনাকে
সমস্যাটি আরও ভালভাবে বুঝতে সাহায্য করার জন্য রয়েছে।

Dockershim কুবারনেটিস v1.24 রিলিজের সাথে সরানো হয়েছিল।
যদি আপনি আপনার কন্টেইনার রানটাইম হিসাবে dockershim এর মাধ্যমে Docker Engine ব্যবহার করেন এবং v1.24 এ আপগ্রেড করতে চান,
এটি সুপারিশ করা হয় যে আপনি হয় অন্য রানটাইমে মাইগ্রেট করুন বা Docker Engine সমর্থন পাওয়ার জন্য একটি বিকল্প উপায় খুঁজুন।
আপনার অপশন জানতে [কন্টেইনার রানটাইম](/bn/docs/setup/production-environment/container-runtimes/)
বিভাগ দেখুন।

dockershim সহ কুবারনেটিসের ভার্সন (1.23) সমর্থনের বাইরে এবং v1.24
[শীঘ্রই](/releases/#release-v1-24) সমর্থনের বাইরে চলে যাবে। নিশ্চিত করুন যে
মাইগ্রেশনের সাথে আপনার সম্মুখীন হওয়া [সমস্যা রিপোর্ট করুন](https://github.com/kubernetes/kubernetes/issues) যাতে সমস্যাগুলি সময়মতো সমাধান করা যায় এবং আপনার ক্লাস্টার
dockershim অপসারণের জন্য প্রস্তুত হবে। v1.24 সমর্থনের বাইরে চলে যাওয়ার পরে, আপনাকে
সমর্থনের জন্য আপনার কুবারনেটিস প্রোভাইডারের সাথে যোগাযোগ করতে হবে বা একবারে একাধিক ভার্সন আপগ্রেড করতে হবে
যদি আপনার ক্লাস্টারকে প্রভাবিত করে এমন গুরুতর সমস্যা থাকে।

আপনার ক্লাস্টারে একাধিক ধরনের Node থাকতে পারে, যদিও এটি একটি সাধারণ
কনফিগারেশন নয়।

এই টাস্কগুলি আপনাকে মাইগ্রেট করতে সাহায্য করবে:

* [Dockershim অপসারণ আপনাকে প্রভাবিত করে কিনা তা চেক করুন](/bn/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-removal-affects-you/)
* [dockershim থেকে টেলিমেট্রি এবং সিকিউরিটি এজেন্ট মাইগ্রেট করা](/bn/docs/tasks/administer-cluster/migrating-from-dockershim/migrating-telemetry-and-security-agents/)


## {{% heading "whatsnext" %}}

* একটি বিকল্পের জন্য আপনার অপশন বুঝতে [কন্টেইনার রানটাইম](/bn/docs/setup/production-environment/container-runtimes/)
  দেখুন।
* যদি আপনি dockershim থেকে দূরে মাইগ্রেট করার সাথে সম্পর্কিত একটি ত্রুটি বা অন্যান্য প্রযুক্তিগত উদ্বেগ খুঁজে পান,
  আপনি কুবারনেটিস প্রজেক্টে [একটি সমস্যা রিপোর্ট করতে পারেন](https://github.com/kubernetes/kubernetes/issues/new/choose)।
