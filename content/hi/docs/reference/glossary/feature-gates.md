---
title: Feature gate
id: feature-gate
date: 2023-01-12
full_link: /docs/reference/command-line-tools-reference/feature-gates/
short_description: >
  यह नियंत्रित करने का एक तरीका कि कोई विशेष कुबेरनेट्स सुविधा सक्षम है या नहीं।

aka: 
tags:
- fundamental
- operation
---

फ़ीचर गेट्स कुंजियों का एक सेट (अपारदर्शी स्ट्रिंग मान) हैं जिनका उपयोग आप यह नियंत्रित करने के लिए कर सकते हैं कि आपके क्लस्टर में कौन सी कुबेरनेट्स सुविधाएँ सक्षम हैं।

<!--more-->

आप प्रत्येक Kubernetes घटक पर `--feature-gates` कमांड लाइन ध्वज का उपयोग करके इन सुविधाओं को चालू या बंद कर सकते हैं।
प्रत्येक Kubernetes घटक आपको उस घटक के लिए प्रासंगिक फ़ीचर गेट्स के एक सेट को सक्षम या अक्षम करने देता है।
Kubernetes दस्तावेज़ीकरण सभी मौजूदा [फ़ीचर गेट्स](/docs/reference/command-line-tools-reference/feature-gates/) को सूचीबद्ध करता है और वे क्या नियंत्रित करते हैं।