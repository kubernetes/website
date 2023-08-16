---
title: काम का बोझ
id: workloads
date: 2019-02-13
full_link: /docs/concepts/workloads/
short_description: >
   कार्यभार एक ऐप्लिकेशन है जो Kubernetes पर चल रहा है।

aka: 
tags:
- मौलिक
---
   कार्यभार एक ऐप्लिकेशन है जो Kubernetes पर चल रहा है।

<!--more--> 

विभिन्न मूल ऑब्जेक्ट जैसे DaemonSet(डेमन सेट), Deployment(डिप्लॉयमेंट), Job(जॉब), ReplicaSet(रिप्लिका सेट) और StatefulSet(स्टेटफुल सेट) कार्यभार के विभिन्न प्रकार या भागों को प्रतिनिधित करती हैं।

उदाहरण के लिए, एक ऐप्लिकेशन जिसमें वेब सर्वर और डेटाबेस हो सकता है, डेटाबेस को एक {{< glossary_tooltip term_id="StatefulSet" >}} में और वेब सर्वर को एक {{< glossary_tooltip term_id="Deployment" >}} में चलाया जा सकता है।
