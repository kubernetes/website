---
title: এপিএই সার্ভার
id: kube-apiserver
date: ২০১৮-০৪-১২
full_link: /docs/concepts/overview/components/#kube-apiserver
short_description: >
   কন্ট্রোল প্লেন উপাদান যা কুবারনেটেস API পরিবেশন করে।

aka:
- kube-apiserver
tags:
- আর্কিটেকচার
- মৌলিক
---
 কুবারনেটেস {{< glossary_tooltip text="কন্ট্রোল প্লেন" term_id="control-plane" >}} এর একটি উপাদান হলো API সার্ভার যা কুবারনেটেস API প্রকাশ করে।
API সার্ভার কুবারনেটেস কন্ট্রোল প্লেনের ফ্রন্ট এন্ড হিসেবে কাজ করে।

<!--আরও-->

কুবারনেটেস API সার্ভারের প্রধান বাস্তবায়ন হলো [kube-apiserver](/docs/reference/generated/kube-apiserver/)।
kube-apiserver হরিজন্টালি স্কেল করার জন্য নকশা করা হয়েছে—অর্থাৎ, এটি আরও বেশি উদাহরণ ডেপ্লয় করে স্কেল করে।
আপনি একাধিক kube-apiserver উদাহরণ চালাতে পারেন এবং সেই উদাহরণগুলির মধ্যে ট্রাফিক ব্যালেন্স করতে পারেন।
