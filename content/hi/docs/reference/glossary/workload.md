---
title: काम का बोझ
id: workloads
date: 2019-02-13
full_link: /docs/concepts/workloads/
short_description: >
   काम का बोझ एक ऐप्लिकेशन है जो Kubernetes पर चल रहा है।

aka: 
tags:
- मौलिक
---
   काम का बोझ एक ऐप्लिकेशन है जो Kubernetes पर चल रहा है।

<!--more--> 

विभिन्न मूल वस्तुएँ जो विभिन्न प्रकार के या भागों को प्रतिनिधित करती हैं, उनमें DaemonSet, Deployment, Job, ReplicaSet और StatefulSet वस्तुएँ शामिल हैं।

उदाहरण के लिए, एक ऐप्लिकेशन जिसमें वेब सर्वर और डेटाबेस हो सकता है, डेटाबेस को एक {{< glossary_tooltip term_id="StatefulSet" >}} में और वेब सर्वर को एक {{< glossary_tooltip term_id="Deployment" >}} में चलाया जा सकता है।
