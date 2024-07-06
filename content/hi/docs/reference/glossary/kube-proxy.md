---
title: kube-proxy
id: kube-proxy
date: 2018-04-12
full_link: /docs/reference/command-line-tools-reference/kube-proxy/
short_description: >
  `क्यूब-प्रॉक्सी` एक नेटवर्क प्रॉक्सी है जो क्लस्टर में प्रत्येक नोड पर चलता है।

aka:
tags:
- fundamental
- networking
---
 क्यूब-प्रॉक्सी एक नेटवर्क प्रॉक्सी है जो आपके क्लस्टर में प्रत्येक {{<glossary_tooltip text="नोड" term_id="node" >}} पर चलता है, यह कुबेरनेट्स {{<glossary_tooltip term_id="service" text="सेवा" >}} अवधारणा का हिस्सा लागू करता है।

<!--more-->

[क्यूब-प्रॉक्सी](/docs/reference/command-line-tools-reference/kube-proxy/) नोड्स पर नेटवर्क नियम बनाए रखता है। ये नेटवर्क नियम आपके क्लस्टर के अंदर या बाहर नेटवर्क सत्रों से आपके पॉड्स को नेटवर्क संचार की अनुमति देते हैं।

क्यूब-प्रॉक्सी ऑपरेटिंग सिस्टम पैकेट फ़िल्टरिंग परत का उपयोग करता है यदि कोई है और यह उपलब्ध है। अन्यथा, क्यूब-प्रॉक्सी ट्रैफ़िक को स्वयं आगे बढ़ाता है।