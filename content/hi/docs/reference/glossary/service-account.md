---
title: सर्विस अकाउंट
id: service-account
date: 2018-04-12
full_link: /docs/tasks/configure-pod-container/configure-service-account/
short_description: >
  पॉड में चलने वाली प्रक्रियाओं के लिए एक पहचान प्रदान करता है।
aka: ServiceAccount 
tags:
- fundamental
- core-object
---
 {{<glossary_tooltip text="पॉड" term_id="pod" >}} में चलने वाली प्रक्रियाओं के लिए एक पहचान प्रदान करता है।

<!--more--> 

जब पॉड्स के अंदर प्रक्रियाएं क्लस्टर तक पहुंचती हैं, तो उन्हें एपीआई सर्वर द्वारा एक विशेष सेवा खाते के रूप में प्रमाणित किया जाता है, उदाहरण के लिए, `डिफ़ॉल्ट`। जब आप एक पॉड बनाते हैं, यदि आप एक सेवा खाता निर्दिष्ट नहीं करते हैं, तो यह स्वचालित रूप से उसी {{<glossary_tooltip text="नेमस्पेस" term_id="namespace" >}} में डिफ़ॉल्ट सेवा खाता असाइन किया जाता है।