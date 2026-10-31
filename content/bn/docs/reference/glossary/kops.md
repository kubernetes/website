---
title: kOps (কুবারনেটিস অপারেশনস)
id: kops
full_link: /docs/setup/production-environment/kops/
short_description: >
  kOps শুধুমাত্র প্রোডাকশন-গ্রেড, উচ্চ প্রাপ্যতা(highly available) সম্পন্ন কুবারনেটিস ক্লাস্টার তৈরি, ধ্বংস, আপগ্রেড এবং রক্ষণাবেক্ষণে সহায়তা করে না, বরং প্রয়োজনীয় ক্লাউড অবকাঠামোও প্রস্তুত(provision) করে।

aka: 
tags:
- tool
- operation
---

`kOps` শুধুমাত্র প্রোডাকশন-গ্রেড, উচ্চ প্রাপ্যতা(highly available) সম্পন্ন কুবারনেটিস ক্লাস্টার তৈরি, ধ্বংস, আপগ্রেড এবং রক্ষণাবেক্ষণে সহায়তা করে না, বরং প্রয়োজনীয় ক্লাউড অবকাঠামোও প্রস্তুত(provision) করে।

<!--more--> 

{{< note >}}
বর্তমানে AWS (Amazon Web Services) আনুষ্ঠানিকভাবে সমর্থিত, DigitalOcean, GCE এবং OpenStack বিটা সমর্থনে এবং Azure আলফা সমর্থনে রয়েছে।
{{< /note >}}

`kOps` একটি স্বয়ংক্রিয় প্রভিশনিং(provisioning) সিস্টেম:
  * সম্পূর্ণ স্বয়ংক্রিয় ইনস্টলেশন
  * ক্লাস্টার শনাক্ত করতে DNS ব্যবহার করে
  * স্ব-নিরাময়(Self-healing): সবকিছু অটো-স্কেলিং গ্রুপে(Auto-Scaling Groups) চলে
  * একাধিক OS সমর্থন (Amazon Linux, Debian, Flatcar, RHEL, Rocky এবং Ubuntu)
  * উচ্চ প্রাপ্যতা(High-Availability) সমর্থন
  * সরাসরি প্রভিশন করতে পারে, অথবা terraform ম্যানিফেস্ট তৈরি করতে পারে
