---
title: Ephemeral Container
id: ephemeral-container
date: 2019-08-26
full_link: /docs/concepts/workloads/pods/ephemeral-containers/
short_description: >
  एक प्रकार का कंटेनर प्रकार जिसे आप अस्थायी रूप से पॉड के अंदर चला सकते हैं

aka:
tags:
- fundamental
---
एक प्रकार का {{<glossary_tooltip text="कंटेनर" term_id="container" >}} प्रकार जिसे आप अस्थायी रूप से {{<glossary_tooltip text="पॉड" term_id="pod" >}} के अंदर चला सकते हैं


<!--more-->

यदि आप किसी ऐसे पॉड की जांच करना चाहते हैं जो समस्याओं के साथ चल रहा है, तो आप उस पॉड में एक अल्पकालिक कंटेनर जोड़ सकते हैं और निदान कर सकते हैं। अल्पकालिक कंटेनरों में कोई संसाधन या शेड्यूलिंग गारंटी नहीं होती है, और आपको कार्यभार के किसी भी हिस्से को चलाने के लिए उनका उपयोग नहीं करना चाहिए।

अल्पकालिक कंटेनर {{<glossary_tooltip text="स्टैटिक-पॉड" term_id="static-pod" >}} द्वारा समर्थित नहीं हैं।