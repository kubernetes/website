---
title: डायनेमिक वॉल्यूम प्रोविज़निंग
id: dynamicvolumeprovisioning
date: 2018-04-12
full_link: /docs/concepts/storage/dynamic-provisioning
short_description: >
  उपयोगकर्ताओं को स्टोरेज वॉल्यूम के स्वचालित निर्माण का अनुरोध करने की अनुमति देता है।
aka: 
tags:
- core-object
- storage
---
 उपयोगकर्ताओं को स्टोरेज {{<glossary_tooltip text="वॉल्यूम" term_id="volume">}} के स्वचालित निर्माण का अनुरोध करने की अनुमति देता है।

<!--more--> 
डायनेमिक प्रोविजनिंग क्लस्टर प्रशासकों के लिए भंडारण को पूर्व-प्रावधान करने की आवश्यकता को समाप्त कर देती है। इसके बजाय, यह स्वचालित रूप से उपयोगकर्ता के अनुरोध पर भंडारण का प्रावधान करता है। डायनामिक वॉल्यूम प्रोविजनिंग एक एपीआई ऑब्जेक्ट, {{<glossary_tooltip text="स्टोरेजक्लास" term_id="storage-class" >}} पर आधारित है, जो {{<glossary_tooltip text="वॉल्यूम प्लगइन" term_id="volume-plugin" >}} को संदर्भित करता है जो वॉल्यूम प्लगइन को पास करने के लिए {{<glossary_tooltip text="वॉल्यूम" term_id="volume" >}} और पैरामीटर के सेट का प्रावधान करता है।