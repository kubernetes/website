---
title: API सर्वर
id: kube-apiserver
date: 2018-04-12
full_link: /docs/concepts/overview/components/#kube-apiserver
short_description: >
  एक कंट्रोल प्लेन घटक जो कुबेरनेट्स API की सेवाएं प्रदान करता है।।

aka:
- kube-apiserver
tags:
- architecture
- fundamental
---
API सर्वर कुबेरनेट्स {{< glossary_tooltip text="कंट्रोल प्लेन" term_id="control-plane" >}} का एक घटक है जो कुबेरनेट्स API को उजागर करता है।
API सर्वर कुबेरनेट्स कंट्रोल प्लेन का फ्रंट एंड है।

<!--more-->

कुबेरनेट्स API सर्वर का मुख्य कार्यान्वयन [kube-apiserver](/docs/reference/generated/kube-apiserver/) है।
kube-apiserver को हॉरिज़ॉन्टल रूप से स्केल करने के लिए बनाया गया है अर्थात, आप अधिक इंस्टेंस को डिप्लॉय करके स्केल कर सकते हैं।
आप kube-apiserver के कई इंस्टेंस चला सकते हैं और उनके बीच ट्रैफ़िक को संतुलित कर सकते हैं।