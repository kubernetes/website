---
title: ReplicationController
id: replication-controller
date: 2018-04-12
full_link: 
short_description: >
  একটি (ডেপ্রিসিয়েটেড) API অবজেক্ট যা একটি প্রতিলিপিকৃত অ্যাপ্লিকেশন পরিচালনা করে।
  
aka: 
tags:
- workload
- core-object
---
 একটি ওয়ার্কলোডের রিসোর্স যা একটি প্রতিলিপিকৃত অ্যাপ্লিকেশন পরিচালনা করে, 
নিশ্চিত করে যে একটি {{< glossary_tooltip text="পড" term_id="pod" >}} এর একটি নির্দিষ্ট সংখ্যক দৃষ্টান্ত চলছে ৷

<!--more-->

কন্ট্রোল প্লেন নিশ্চিত করে যে নির্দিষ্ট সংখ্যক পড চলছে, এমনকি যদি কিছু পড ব্যর্থ হয়,
যদি আপনি ম্যানুয়ালি পড মুছে ফেলেন, বা যদি অনেকগুলি ভুল করে শুরু করা হয়।

{{< note >}}
ReplicationController ডেপ্রিসিয়েটেড করা হয়েছে। দেখুন
{{< glossary_tooltip text="ডিপ্লয়মেন্ট" term_id="deployment" >}}, যা একই রকম।
{{< /note >}}
