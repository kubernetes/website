---
title: कंट्रोल प्लेन (Control Plane)
id: control-plane
date: 2019-05-12
full_link:
short_description: >
  कंटेनर ऑर्केस्ट्रेशन लेयर जो कंटेनरों के जीवनचक्र को परिभाषित, परिनियोजित और प्रबंधित करने के लिए API और इंटरफेस को उजागर करता है।

aka:
tags:
  - fundamental
---

कंटेनर ऑर्केस्ट्रेशन लेयर जो कंटेनरों के जीवनचक्र को परिभाषित, परिनियोजित और प्रबंधित करने के लिए एपीआई और इंटरफेस को उजागर करता है।

 <!--more-->

यह लेयर कई अलग-अलग घटकों से बना है, जैसे (लेकिन इन तक सीमित नहीं):

- {{< glossary_tooltip text="etcd" term_id="etcd" >}}
- {{< glossary_tooltip text="API सर्वर" term_id="kube-apiserver" >}}
- {{< glossary_tooltip text="शेड्यूलर" term_id="kube-scheduler" >}}
- {{< glossary_tooltip text="कंट्रोलर मैनेजर" term_id="kube-controller-manager" >}}
- {{< glossary_tooltip text="क्लाउड कंट्रोलर मैनेजर" term_id="cloud-controller-manager" >}}

इन घटकों को पारंपरिक ऑपरेटिंग सिस्टम सेवाओं (डेमॉन) या कंटेनर के रूप में चलाया जा सकता है। इन घटकों को चलाने वाले मेजबानों को ऐतिहासिक रूप से {{< glossary_tooltip text="मास्टर्स" term_id="master" >}} कहा जाता था।
