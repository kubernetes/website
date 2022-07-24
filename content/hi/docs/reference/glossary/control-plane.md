---
title: कण्ट्रोल प्लेन
id: control-plane
full_link:
short_description: >
    कंटेनर ऑर्केस्ट्रेशन परत जो कंटेनरों के जीवनचक्र को परिभाषित, परिनियोजित और प्रबंधित करने के लिए एपीआई और इंटरफेस को उजागर करती है
aka:
tags:
- fundamental
---
कंटेनर ऑर्केस्ट्रेशन परत जो कंटेनरों के जीवनचक्र को परिभाषित, परिनियोजित और प्रबंधित करने के लिए एपीआई और इंटरफेस को उजागर करती है

 <!--more--> 
 
यह परत कई घटकों से बनी है, जैसे (लेकिन इन्हीं तक सीमित नहीं) :

 * {{< glossary_tooltip text="ईटीसीडी" term_id="etcd" >}}
 * {{< glossary_tooltip text="एपीआई सर्वर" term_id="kube-apiserver" >}}
 * {{< glossary_tooltip text="अनुसूचक" term_id="kube-scheduler" >}}
 * {{< glossary_tooltip text="नियंत्रक परबंधक" term_id="kube-controller-manager" >}}
 * {{< glossary_tooltip text="क्लाउड-नियंत्रक परबंधक" term_id="cloud-controller-manager" >}}


इन घटकों को पारंपरिक ऑपरेटिंग सिस्टम सेवाओं (डेमॉन) या कंटेनर के रूप में चलाया जा सकता है। इन घटकों को चलाने वाले मेजबानों को ऐतिहासिक रूप से {{< glossary_tooltip text="masters" term_id="master" >}} कहा जाता था।
