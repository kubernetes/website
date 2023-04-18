---
title: संसाधन कोटा (Resource Quotas)
id: resource-quota
date: 2018-04-12
full_link: /docs/concepts/policy/resource-quotas/
short_description: >
  प्रति नेमस्पेस पर कुल संसाधन खपत को सीमित करने वाली बाधाएं प्रदान करता है।

aka: 
tags:
- fundamental
- operation
- architecture
---
 प्रति {{< glossary_tooltip text="नेमस्पेस" term_id="namespace" >}} पर कुल संसाधन खपत को सीमित करने वाली बाधाएं (contraints) प्रदान करता है।

<!--more--> 

किसी नेमस्पेस में बनाई जा सकने वाली ऑब्जेक्ट्स की मात्रा को उनके प्रकार के अनुसार सीमित करता है, साथ ही उस परियोजना के संसाधनों द्वारा उपभोग किए जा सकने वाले कंप्यूट संसाधनों की कुल मात्रा को भी सीमित करता है।