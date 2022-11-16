---
title: लिमिटरेंज (LimitRange)
id: limitrange
date: 2019-04-15
full_link:  /docs/concepts/policy/limit-range/
short_description: >
  नेमस्पेस में प्रति कंटेनर या पॉड में संसाधन खपत को सीमित करने के लिए प्रतिबंध प्रदान करता है।

aka: 
tags:
- core-object
- fundamental
- architecture
related:
 - pod
 - container

---
 नेमस्पेस में प्रति {{< glossary_tooltip text="कंटेनर" term_id="container" >}} या {{< glossary_tooltip text="पॉड" term_id="pod" >}} में संसाधन खपत को सीमित करने के लिए प्रतिबंध प्रदान करता है।

<!--more--> 
लिमिटरेंज, टाइप (type) द्वारा बनाई जा सकने वाले ऑब्जेक्ट्स और साथ ही नेमस्पेस में अलग-अलग {{< glossary_tooltip text="कंटेनर" term_id="container" >}} या {{< glossary_tooltip text="पॉड" term_id="pod" >}} द्वारा अनुरोध/उपभोग किए जा सकने वाले कंप्यूट संसाधनों की मात्रा को सीमित करता है।
