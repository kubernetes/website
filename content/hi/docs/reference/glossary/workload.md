---
title: कार्यभार (Workload)
id: workloads
date: 2019-02-13
full_link: /docs/concepts/workloads/pods/pod-lifecycle/
short_description: >
   वर्कलोड कुबेरनेट्स पर चलने वाला एक एप्लिकेशन है।

aka: 
tags:
- fundamental
---
   वर्कलोड कुबेरनेट्स पर चलने वाला एक एप्लिकेशन है।

<!--more--> 

विभिन्न कोर ऑब्जेक्ट्स जैसे डेमनसेट, डिप्लॉयमेंट, जॉब, रेप्लिकासेट और स्टेटफुलसेट एक कार्यभार के विभिन्न प्रकारों या भागों को प्रतिनिधित्व करते हैं।



उदाहरण के लिए, एक वेब सर्वर और एक डेटाबेस वाला कार्यभार चल सकता है
एक {{<glossary_tooltip term_id="StatefulSet" >}} और 
वेब सर्वर में डेटाबेस एक {{<glossary_tooltip term_id="Deployment" >}} में।
