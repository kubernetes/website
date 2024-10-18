---
title: डेमनसेट (DaemonSet)
id: daemonset
date: 2018-04-12
full_link: /docs/concepts/workloads/controllers/daemonset
short_description: >
  एक पॉड की एक कॉपी क्लस्टर के विभिन्न नोड्स पर चल रही है, यह सुनिश्चित करता है।

aka: 
tags:
- fundamental
- core-object
- workload
---
 यह सुनिश्चित करता है कि {{<glossary_tooltip text="पॉड" term_id="pod">}} की एक प्रति {{<glossary_tooltip text="क्लस्टर" term_id="cluster" >}} में नोड्स के एक सेट पर चल रही है।

<!--more--> 

लॉग कलेक्टर्स और मॉनिटरिंग एजेंट्स जैसे सिस्टम डेमन्स को चलने के लिए इसका उपयोग किया जाता है, जिन्हें आमतौर पर हर {{< glossary_tooltip text="नोड"  term_id="node" >}} पर चलाना पड़ता है।
