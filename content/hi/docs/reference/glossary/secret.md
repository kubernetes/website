---
title: सीक्रेट
id: secret
date: 2018-04-12
full_link: /docs/concepts/configuration/secret/
short_description: >
  संवेदनशील जानकारी, जैसे पासवर्ड, OAuth टोकन और SSH कुंजियाँ संग्रहीत करता है।
aka: Secret
tags:
- core-object
- security
---
 संवेदनशील जानकारी, जैसे पासवर्ड, OAuth टोकन और SSH कुंजियाँ संग्रहीत करता है।

<!--more-->

सिक्रेट्स आपको इस पर अधिक नियंत्रण देते हैं कि संवेदनशील जानकारी का उपयोग कैसे किया जाता है और आकस्मिक जोखिम का जोखिम कम हो जाता है। गुप्त मानों को बेस 64 स्ट्रिंग्स के रूप में एन्कोड किया गया है और डिफ़ॉल्ट रूप से अनएन्क्रिप्टेड संग्रहीत किया गया है, लेकिन इसे [बाकी समय में एन्क्रिप्टेड] (/docs/tasks/administer-cluster/encrypt-data/#ensure-all-secrets-are-encrypted) के रूप में कॉन्फ़िगर किया जा सकता है। .

एक {{<glossary_tooltip text="पॉड" term_id="pod" >}} विभिन्न तरीकों से सिक्रेट्स को संदर्भित कर सकता है, जैसे वॉल्यूम माउंट में या पर्यावरण चर के रूप में। सिक्रेट्स गोपनीय डेटा के लिए डिज़ाइन किए गए हैं और [ConfigMaps](/docs/tasks/configure-pod-container/configure-pod-configmap/) गैर-गोपनीय डेटा के लिए डिज़ाइन किए गए हैं।