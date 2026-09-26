---
title: नोड
id: node
full_link: /docs/concepts/architecture/nodes/
short_description: >
  नोड कुबेरनेट्स में एक काम करने वाली मशीन है।
tags:
- core-object
- fundamental
---

नोड कुबेरनेट्स में एक काम करने वाली मशीन है।

<!--more-->

यह काम करने वाली मशीन एक वर्चुअल मशीन हो सकती है या एक भौतिक मशीन भी हो सकती है। इसमें {{< glossary_tooltip text="पॉड" term_id="pod" >}} चलाने के लिए आवश्यक कई प्रोग्राम या सेवाएँ चलती रहती हैं और इसे कंट्रोल प्लेन द्वारा प्रबंधित किया जाता है।

एक नोड (Node) पर चलने वाले प्रोग्रामों के उदाहरण हैं: {{< glossary_tooltip text="क्यूबलेट" term_id="kubelet" >}}, {{< glossary_tooltip text="क्यूब-प्रॉक्सी" term_id="kube-proxy" >}}, और कंटेनर रनटाइम जो {{< glossary_tooltip text="CRI" term_id="cri" >}} को लागू करता है, जैसे कि {{< glossary_tooltip  text="डॉकर" term_id="docker" >}}

कुबेरनेट्स के शुरुआती संस्करणों में, नोड्स को "मिनियंस" कहा जाता था।