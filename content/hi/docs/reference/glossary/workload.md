---
title: Workload
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

विभिन्न मुख्य वस्तुएं जो विभिन्न प्रकार या कार्यभार के भागों का प्रतिनिधित्व करती हैं
डेमॉनसेट, डिप्लॉयमेंट, जॉब, रेप्लिकासेट और स्टेटफुलसेट ऑब्जेक्ट शामिल हैं।


उदाहरण के लिए, एक वर्कलोड जिसमें एक वेब सर्वर और एक डेटाबेस हैं
डेटाबेस को {{<glossary_tooltip text="स्टेटफुलसेट" term_id="StatefulSet" >}} और
वेब सर्वर को {{<glossary_tooltip text="डिप्लॉमेंट" term_id="Deployment" >}} में चला सकते हैं।
