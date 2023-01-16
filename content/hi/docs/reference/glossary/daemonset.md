---
title: डेमनसेट (DaemonSet)
id: daemonset
date: 2018-04-12
full_link: /docs/concepts/workloads/controllers/daemonset
short_description: >
  सुनिश्चित करें कि पॉड की प्रतिकृति क्लस्टर में नोड्स के एक सेट पर चल रही है।
aka:
tags:
  - fundamental
  - core-object
  - workload
---

सुनिश्चित करता है {{<glossary_tooltip text="पॉड" term_id="pod" >}} की प्रतिकृति {{<glossary_tooltip text="क्लस्टर " term_id="cluster" >}} में नोड्स के एक सेट पर चल रही है।

<!--more-->

आमतौर पर सिस्टम डेमन जैसे लॉग कलेक्टर(log collectors) और मॉनिटरिंग एजेंट(monitoring agents) को तैनात करने के लिए उपयोग किया जाता है जो प्रत्येक{{< glossary_tooltip text="नोड" term_id="node">}} पर चलना चाहिए।
