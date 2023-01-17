---
title: डेमनसेट (DaemonSet)
id: daemonset
date: 2018-04-12
full_link: /docs/concepts/workloads/controllers/daemonset
short_description: >
 यह सुनिश्चित करता है कि क्लस्टर में नोड्स के सेट पर पॉड की एक प्रतिलिपि चल रही है।
aka:
tags:
  - fundamental
  - core-object
  - workload
---

यह सुनिश्चित करता है कि {{< Glosary_tooltip text="क्लस्टर" term_id="cluster" >}} में नोड्स के सेट पर {{< Glosary_tooltip text="पॉड" term_id="pod" >}} की एक प्रतिलिपि चल रही है।

<!--more-->

लॉग कलेक्टर (log collectors) और निगरानी एजेंट (monitoring agents) जैसे सिस्टम डेमॉन को तैनात करने के लिए उपयोग किया जाता है जो आमतौर पर प्रत्येक नोड पर चलने चाहिए।
