---
title: रेप्लिकासेट (ReplicaSet)
id: replica-set
date: 2018-04-12
full_link: /docs/concepts/workloads/controllers/replicaset/
short_description: >
  रेप्लिकासेट सुनिश्चित करता है कि पॉड प्रतिकृतियों की एक निर्दिष्ट संख्या एक समय में चल रही हैं।

aka: 
tags:
- fundamental
- core-object
- workload
---
 एक रेप्लिकासेट (का उद्देश्य) किसी भी समय चल रहे रेप्लिका पॉड्स का एक समूह बनाए रखता है।

<!--more-->

वर्कलोड ऑब्जेक्ट्स जैसे {{< glossary_tooltip text="डिप्लॉइमन्ट" term_id="deployment" >}} रेप्लिकासेट्स का उपयोग
यह सुनिश्चित करने के लिए करते हैं कि आपके क्लस्टर में {{< glossary_tooltip term_id="pod" text="पॉड्स" >}} की कॉन्फ़िगर की गई संख्या चल रही है, उस रेप्लिकासेट के विनिर्देश के आधार पर।
