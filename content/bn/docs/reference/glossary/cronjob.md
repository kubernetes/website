---
title: ক্রনজব (CronJob)
id: cronjob
full_link: /docs/concepts/workloads/controllers/cron-jobs/
short_description: >
  একটি পুনরাবৃত্ত টাস্ক (একটি জব) যা একটি নিয়মিত শিডিউলে চলে।

aka: 
tags:
- core-object
- workload
---
 একটি নির্দিষ্ট শিডিউল অনুযায়ী পর্যায়ক্রমে চলা একটি [জব](/docs/concepts/workloads/controllers/job/) পরিচালনা করে।

<!--more-->

একটি *crontab* ফাইলের একটি লাইনের মতো, একটি ক্রনজব অবজেক্ট [cron](https://en.wikipedia.org/wiki/Cron) ফরম্যাট ব্যবহার করে একটি শিডিউল নির্ধারণ করে।
