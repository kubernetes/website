---
title: लिमिटरेंज (LimitRange)
id: limitrange
date: 2019-04-15
full_link:  /docs/concepts/policy/limit-range/
short_description: >
  नामस्थान (namespace) में प्रति कंटेनर या पॉड में संसाधन खपत को सीमित करने के लिए प्रतिबंध प्रदान करता है।

aka: 
tags:
- core-object
- fundamental
- architecture
related:
 - pod
 - container

---
 नामस्थान (namespace) में प्रति {{< glossary_tooltip text="कंटेनर" term_id="container" >}} या {{< glossary_tooltip text="पॉड" term_id="pod" >}} में संसाधन खपत को सीमित करने के लिए प्रतिबंध प्रदान करता है।

<!--more--> 
लिमिटरेंज (LimitRange) टाइप (type) द्वारा बनाई जा सकने वाली वस्तुओं की मात्रा को सीमित रहता है,
साथ ही एक नामस्थान (namespace) में अलग-अलग {{< glossary_tooltip text="कंटेनर" term_id="container" >}} या {{< glossary_tooltip text="पॉड" term_id="pod" >}} द्वारा अनुरोधित/उपभोग किए जा सकने वाले कंप्यूट संसाधनों की मात्रा को भी।
