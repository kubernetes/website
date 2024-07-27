---
title: জব
id: job
date: 2018-04-12
full_link: /bn/docs/concepts/workloads/controllers/job/
short_description: >
  একটি সীমিত বা ব্যাচ টাস্ক যা সম্পূর্ণ হওয়া পর্যন্ত চলে৷

aka: 
tags:
- fundamental
- core-object
- workload
---
 একটি সীমিত বা ব্যাচ টাস্ক যা সম্পূর্ণ হওয়া পর্যন্ত চলে৷

<!--more--> 

এক বা একাধিক {{< glossary_tooltip term_id="pod" >}} অবজেক্ট তৈরি করে এবং নিশ্চিত করে যে তাদের একটি নির্দিষ্ট সংখ্যক সফলভাবে সমাপ্ত হয়েছে। পডগুলো সফলভাবে সম্পন্ন হওয়ার সাথে সাথে জব(Job) সফল সমাপ্তিগুলিকে ট্র্যাক করে৷
