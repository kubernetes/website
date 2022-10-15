---
title: डिप्लॉयमेन्ट (Deployment)
id: deployment
date: 2018-04-12
full_link: /docs/concepts/workloads/controllers/deployment/
short_description: >
  आपके क्लस्टर पर एक प्रतिरूपित एप्लिकेशन का प्रबंधन करता है।

aka: 
tags:
- fundamental
- core-object
- workload
---
 एक API ऑब्जेक्ट जो एक प्रतिकृति एप्लिकेशन का प्रबंधन करता है, आमतौर पर पॉड्स को बिना किसी स्थानीय स्थिति के चलाकर।

<!--more--> 

प्रत्येक प्रतिकृति को एक {{<glossary_tooltip term_id="pod" >}} द्वारा दर्शाया जाता है, और पॉड्स को बीच में वितरित किया जाता है {{< glossary_tooltip text="nodes" term_id="node" >}} एक क्लस्टर का।
ऐसे कार्यभार के लिए जिन्हें स्थानीय स्थिति की आवश्यकता होती है, {{< glossary_tooltip term_id="StatefulSet" >}} का उपयोग करने पर विचार करें।