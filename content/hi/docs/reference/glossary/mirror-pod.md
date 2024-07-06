---
title: Mirror Pod
id: mirror-pod
date: 2019-08-06
short_description: >
  API सर्वर में एक ऑब्जेक्ट जो क्यूबलेट पर एक स्थिर पॉड को ट्रैक करता है।

aka: 
tags:
- fundamental
---
एक {{<glossary_tooltip text="पॉड" term_id="pod" >}} ऑब्जेक्ट जिसका उपयोग {{< glossary_tooltip text="क्यूबलेट" term_id="kubelet" >}} एक स्थिर-पॉड का प्रतिनिधित्व करने के लिए करता है।
 A {{< glossary_tooltip text="pod" term_id="pod" >}} object that a {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} uses
 to represent a {{< glossary_tooltip text="static pod" term_id="static-pod" >}}

<!--more--> 

जब क्यूबलेट को अपने कॉन्फ़िगरेशन में एक स्थिर पॉड मिलता है, तो यह स्वचालित रूप से इसके लिए कुबेरनेट्स API सर्वर पर एक पॉड ऑब्जेक्ट बनाने का प्रयास करता है। इसका मतलब है कि पॉड एपीआई सर्वर पर दिखाई देगा, लेकिन वहां से नियंत्रित नहीं किया जा सकता है।

(उदाहरण के लिए, मिरर पॉड को हटाने से क्यूबलेट डेमॉन को इसे चलाने से नहीं रोका जा सकेगा)।