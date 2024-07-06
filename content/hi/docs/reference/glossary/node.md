
---
title: Node
id: node
date: 2018-04-12
full_link: /docs/concepts/architecture/nodes/
short_description: >
  कुबेरनेट्स में नोड एक वर्कर मशीन है।

aka:
tags:
- fundamental
---
 कुबेरनेट्स में नोड एक वर्कर मशीन है।

<!--more-->
क्लस्टर के आधार पर एक वर्कर नोड एक वीएम या भौतिक मशीन हो सकता है। इसमें {{<glossary_tooltip text="पॉड्स" term_id="pod" >}} चलाने के लिए आवश्यक स्थानीय डेमॉन या सेवाएँ हैं और इसे  कंट्रोल प्लेन द्वारा प्रबंधित किया जाता है। एक नोड पर डेमॉन में {{<glossary_tooltip text="क्यूबलेट" term_id="kubelet">}}, क्यूब-प्रॉक्सी और {{<glossary_tooltip text="डॉकर" term_id="docker">}} जैसे {{<glossary_tooltip text="सीआरआई" term_id="cri">}} को लागू करने वाला एक कंटेनर रनटाइम शामिल है।

प्रारंभिक कुबेरनेट्स संस्करणों में, नोड्स को "मिनियंस" कहा जाता था।