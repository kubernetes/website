---
title: क्यूब-प्रॉक्सी
id: kube-proxy
full_link: /docs/reference/command-line-tools-reference/kube-proxy/
short_description: >
  क्यूब-प्रॉक्सी नोड्स पर नेटवर्क नियमों का रखरखाव करता है

aka:
tags:
- fundamental
- networking
---

क्यूब-प्रॉक्सी एक नेटवर्क प्रॉक्सी है जो आपके क्लस्टर के प्रत्येक {{< glossary_tooltip text="नोड" term_id="node" >}} पर चलता है, और यह कुबेरनेट्स {{< glossary_tooltip text="सर्विस" term_id="service">}} की अवधारणा के एक भाग को लागू करता है।

<!--more-->

[क्यूब-प्रॉक्सी](/docs/reference/command-line-tools-reference/kube-proxy/) नोड्स पर नेटवर्क नियमों का रखरखाव करता है। ये नेटवर्क नियम आपके क्लस्टर के भीतर या बाहर के नेटवर्क सत्रों से आपके {{< glossary_tooltip text="पॉड" term_id="pod" >}} तक नेटवर्क संचार की अनुमति देते हैं।

यदि ऑपरेटिंग सिस्टम में पैकेट फ़िल्टरिंग परत उपलब्ध है, तो क्यूब-प्रॉक्सी उसका उपयोग करता है। अन्यथा, क्यूब-प्रॉक्सी स्वयं ट्रैफ़िक को आगे भेजता है।
