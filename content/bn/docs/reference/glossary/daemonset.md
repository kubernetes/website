---
title: ডেমনসেট
id: daemonset
date: 2018-04-12
full_link: /bn/docs/concepts/workloads/controllers/daemonset
short_description: >
  একটি পডের একটি কপি একটি ক্লাস্টারে নোডগুলির একটি সেট জুড়ে চলছে তা নিশ্চিত করে৷

aka: 
tags:
- fundamental
- core-object
- workload
---
 একটি {{< glossary_tooltip text="পডের" term_id="pod" >}} একটি কপি একটি {{< glossary_tooltip text="ক্লাস্টারে" term_id="cluster" >}} নোডগুলির একটি সেট জুড়ে চলছে তা নিশ্চিত করে৷

<!--more--> 

লগ কালেক্টর এবং মনিটরিং এজেন্টের মতো সিস্টেম ডেমন(daemon) ডেপ্লয় করতে ব্যবহৃত হয় যা সাধারণত প্রতিটি {{< glossary_tooltip term_id="node" >}}-এ চলতে হবে।
