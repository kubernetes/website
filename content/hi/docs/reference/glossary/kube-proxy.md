---
title: kube-proxy
id: kube-proxy
date: 2018-04-12
full_link: /docs/reference/command-line-tools-reference/kube-proxy/
short_description: >
  `kube-proxy` एक नेटवर्क प्रॉक्सी है जो क्लस्टर में प्रत्येक नोड पर चलता है।

aka:
tags:
- fundamental
- networking
---
kube-proxy एक नेटवर्क प्रॉक्सी है जो आपके क्लस्टर में प्रत्येक 
{{< glossary_tooltip text="नोड" term_id="node" >}} पर चलता है,
कुबेरनेट्स की {{< glossary_tooltip text="सर्विस" term_id="service">}} संकल्पना
का भाग लागू करता है।

<!--more-->

[kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/)
नोड्स पर नेटवर्क नियमों को बनाए रखता है। ये नेटवर्क नियम आपके क्लस्टर के अंदर या बाहर नेटवर्क सत्रों से
आपके पॉड्स के साथ नेटवर्क संचार की अनुमति देते हैं।

kube-proxy ऑपरेटिंग सिस्टम की पैकेट फ़िल्टरिंग परत का उपयोग करता है
यदि ऐसी कोई परत मौजूद और उपलब्ध हो। अन्यथा, kube-proxy स्वयं ही 
ट्रैफ़िक को आगे बढ़ाता है।