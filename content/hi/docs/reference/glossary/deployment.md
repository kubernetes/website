---
title: Deployment
id: deployment
date: 2018-04-12
full_link: /docs/concepts/workloads/controllers/deployment/
short_description: >
  आपके क्लस्टर पर एक प्रतिकृति एप्लिकेशन का प्रबंधन करता है।
aka: 
tags:
- fundamental
- core-object
- workload
---
 एक API ऑब्जेक्ट जो प्रतिकृति एप्लिकेशन को प्रबंधित करता है, आमतौर पर बिना किसी स्थानीय स्थिति के पॉड्स चलाकर।

<!--more-->

प्रत्येक प्रतिकृति को {{<glossary_tooltip text="पॉड्स" term_id="pod" >}} द्वारा दर्शाया जाता है, और पॉड्स को {{<glossary_tooltip text="नोड्स" term_id="node" >}} के बीच में वितरित किया जाता है।
जिन कार्यभारों के लिए स्थानीय स्थिति की आवश्यकता होती है, उनके लिए {{<glossary_tooltip text="स्टेटफूलसेट" term_id="statefulset" >}} का उपयोग करने पर विचार करें।