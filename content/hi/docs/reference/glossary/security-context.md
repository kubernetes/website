---
title: Security Context
id: security-context
date: 2018-04-12
full_link: /docs/tasks/configure-pod-container/security-context/
short_description: >
  SecurityContext फ़ील्ड किसी पॉड या कंटेनर के लिए विशेषाधिकार और एक्सेस नियंत्रण सेटिंग्स को परिभाषित करता है।

aka: 
tags:
- security
---
 `SecurityContext` फ़ील्ड किसी {{<glossary_tooltip text="पॉड" term_id="pod" >}} या {{<glossary_tooltip text="कंटेनर" term_id="container" >}} के लिए विशेषाधिकार और एक्सेस नियंत्रण सेटिंग्स को परिभाषित करता है।

<!--more-->

`सिक्योरिटी कॉन्टेक्स्ट` में, आप इन मापदंडों को परिभाषित कर सकते हैं: उपयोगकर्ता जो प्रक्रियाओं को इस रूप में चलाता है, वह समूह जो प्रक्रियाओं को इस रूप में चलाता है, और विशेषाधिकार सेटिंग्स। आप सुरक्षा नीतियों को भी कॉन्फ़िगर कर सकते हैं (उदाहरण के लिए: SELinux, AppArmor या seccomp)।

`PodSpec.securityContext` सेटिंग पॉड के सभी कंटेनरों पर लागू होती है।