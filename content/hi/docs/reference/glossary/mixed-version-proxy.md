---
title: मिश्रित संस्करण प्रॉक्सी
id: mvp
date: 2023-07-24
full_link: /docs/concepts/architecture/mixed-version-proxy/
short_description: >
  वह सुविधा जो kube-apiserver प्रॉक्सी को एक अलग पीयर API सर्वर के लिए संसाधन अनुरोध की सुविधा देती है। 
aka: Mixed Version Proxy (MVP)
tags:
- architecture
---
वह सुविधा जो kube-apiserver प्रॉक्सी को एक अलग पीयर API सर्वर के लिए संसाधन अनुरोध की सुविधा देती है। 

<!--more-->

जब किसी क्लस्टर में कुबेरनेट्स के विभिन्न संस्करण चलाने वाले कई एपीआई सर्वर होते हैं, तो यह सुविधा संसाधन अनुरोधों को सही API सर्वर द्वारा सेवा प्रदान करने में सक्षम बनाती है।

एमवीपी डिफ़ॉल्ट रूप से अक्षम है और इसे सक्षम करके सक्रिय किया जा सकता है
{{<glossary_tooltip text="API सर्वर" term_id="kube-apiserver" >}} शुरू होने पर [फीचर गेट](/docs/reference/command-line-tools-reference/feature-gates/) को `UnknownVersionInteroperabilityProxy` नाम दिया गया है।