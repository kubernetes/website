---
title: नोड (Node)
id: node
date: 2018-04-12
full_link: /docs/concepts/architecture/nodes/
short_description: >
  नोड, कुबेरनेट्स में वर्कर मशीन होती है।

aka:
tags:
- core-object
- fundamental
---
 नोड, कुबेरनेट्स में वर्कर मशीन होती है।

<!--more-->

वर्कर नोड वर्चुअल मशीन (VM) या फिजिकल मशीन होती है, जो क्लस्टर पर निर्भर करता है। इसमें लोकल डेमॉन्स या सर्विसेज होती हैं जो {{< glossary_tooltip text="पॉड्स" term_id="pod" >}} को चलाने के लिए आवश्यक हैं, और इसे कंट्रोल प्लेन द्वारा मैनेज किया जाता है। नोड पर चलने वाले डेमॉन्स में {{< glossary_tooltip text="क्यूबलेट" term_id="kubelet" >}}, {{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}}, और {{< glossary_tooltip text="CRI" term_id="cri" >}} को लागू करने वाला कंटेनर रनटाइम (जैसे {{< glossary_tooltip text="डॉकर" term_id="docker" >}}) शामिल होते हैं।

कुबेरनेट्स के शुरुआती वर्ज़नोंमें, नोड्स को मिनियन्स कहा जाता था
