---
title: ऐप कंटेनर (App Container)
id: app-container
date: 2019-02-12
full_link:
short_description: >
  एक कंटेनर एक कार्यभार का हिस्सा चलाने के लिए प्रयोग किया जाता है। init कंटेनर के साथ तुलना करें।

aka:
tags:
- workload
---
एप्लिकेशन कंटेनर (या ऐप कंटेनर) {{<glossary_tooltip text="init कंटेनर" term_id="init-container">}} {{<glossary_tooltip text="pod" term_id="pod" >}} एक {{<glossary_tooltip text="pod" term_id="pod" >}} में होते हैं, जो किसी के बाद शुरू होते हैं {{< glossary_tooltip text="init container" term_id="init-container" >}} पूरा हो गया है।

<!--more-->

एक इनिट कंटेनर आपको इनिशियलाइज़ेशन विवरण को अलग करने देता है जो समग्र {{< glossary_tooltip text="कार्यभार" term_id="workload" >}} के लिए महत्वपूर्ण हैं, और एप्लिकेशन कंटेनर शुरू हो जाने के बाद इसे चालू रखने की आवश्यकता नहीं है। यदि किसी पॉड में कोई इनिट कंटेनर कॉन्फ़िगर नहीं है, तो उस पॉड के सभी कंटेनर ऐप कंटेनर हैं।
