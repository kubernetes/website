---
title: ऐप कंटेनर (App Container)
id: app-container
date: 2019-02-12
full_link:
short_description: >
  एक कंटेनर एक कार्यभार का हिस्सा चलाने के लिए प्रयोग किया जाता है। प्रारंभिक कंटेनर की तुलना में।

aka:
tags:
- workload
---
एप्लिकेशन {{<glossary_tooltip text="पात्र" term_id="container" >}} (या ऐप कंटेनर) {{<glossary_tooltip text="पॉड" term_id="pod" >}} में, {{<glossary_tooltip text ="इनिट कंटेनर" term_id="init-container" >}} स्टार्टअप पूरा होने के बाद शुरू होता है।

<!--more-->

एक  इनिट कंटेनर के साथ, संपूर्ण
आप {{< glossary_tooltip text="कार्यभार" term_id="workload" >}} के लिए महत्वपूर्ण आरंभीकरण विवरण अलग कर सकते हैं।
कंटेनर शुरू होने के बाद, इसे चालू रखने की कोई आवश्यकता नहीं है।
यदि पॉड में इनिशियलाइज़र कंटेनर कॉन्फ़िगर नहीं है, तो पॉड के सभी कंटेनर ऐप कंटेनर हैं।