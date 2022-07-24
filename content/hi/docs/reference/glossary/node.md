---
title: नोड
id: node
full_link: /docs/concepts/architecture/nodes/
short_description: >
  कुबेरनेट्स में एक नोड एक कार्यकर्ता मशीन है।

aka:
tags:
- fundamental
---
 कुबेरनेट्स में एक नोड एक कार्यकर्ता मशीन है।

<!--more-->

320 / 5,000
Translation results
क्लस्टर के आधार पर एक कार्यकर्ता नोड एक वीएम या भौतिक मशीन हो सकता है। इसमें {{< glossary_tooltip text="पॉड्स" term_id="pod" >}} चलाने के लिए आवश्यक स्थानीय डेमॉन या सेवाएं हैं और इसे कण्ट्रोल प्लेन द्वारा प्रबंधित किया जाता है। नोड पर डेमॉन में {{< glossary_tooltip text="क्यूबेलेट" term_id="kubelet" >}}, {{< glossary_tooltip text="क्यूब-प्रॉक्सी" term_id="kube-proxy" >}} और एक कंटेनर रनटाइम शामिल है जो {{< glossary_tooltip text="सी आर आई " term_id="cri" >}} जैसे {{< glossary_tooltip term_id="docker" >}} को लागू करता है।

कुबेरनेट्स के शुरुआती संस्करणों में, नोड्स को "मिनियंस" कहा जाता था।

