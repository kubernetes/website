---
title: रेप्लिकासेट (ReplicaSet)
id: replica-set
date: 2018-04-12
full_link: /docs/concepts/workloads/controllers/replicaset/
short_description: >
  रेप्लिकासेट यह सुनिश्चित करता है कि किसी एक अवसर पर निर्दिष्ट संख्या में पॉड प्रतिकृतियां चल रही हैं।

aka: 
tags:
- fundamental
- core-object
- workload
---
 एक रेप्लिकासेट (का उद्देश्य) किसी भी समय चल रहे रेप्लिका पॉड्स का एक समूह बनाए रखना है।

<!--more-->

वर्कलोड ऑब्जेक्ट्स, जैसे {{< glossary_tooltip text="डिप्लॉयमेंट" term_id="deployment" >}}, रेप्लिकासेट्स
के विनिर्देश के आधार पर आपके क्लस्टर पर कॉन्फ़िगर की गई संख्या में {{< glossary_tooltip term_id="pod" text="पॉड्स" >}} चल रहे है ये सुनिश्चित करते हैं।
