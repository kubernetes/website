---
title: क्रॉन्जॉब (CronJob)
id: cronjob
date: 2018-04-12
full_link: /docs/concepts/workloads/controllers/cron-jobs/
short_description: >
  एक दोहराए जाने वाला कार्य (एक काम) जो नियमित समय पर चलता है।

aka:
tags:
  - core-object
  - workload
---

एक [काम (Job)](/docs/concepts/workloads/controllers/job/) का प्रबंधन करता है जो आवधिक अनुसूची पर चलता है।

<!--more-->

एक _crontab_ फ़ाइल में एक पंक्ति के समान, एक क्रॉन्जॉब (CronJob) ऑब्जेक्ट [क्रॉन](https://en.wikipedia.org/wiki/Cron) प्रारूप का उपयोग करके एक अनुसूची निर्दिष्ट करता है।
