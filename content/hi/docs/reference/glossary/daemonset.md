---
title: DaemonSet
id: daemonset
date: 2018-04-12
full_link: /docs/concepts/workloads/controllers/daemonset
short_description: >
  Ensures a copy of a Pod is running across a set of nodes in a cluster.
aka: 
tags:
- fundamental
- core-object
- workload
---
 यह सुनिश्चित करता है कि {{<glossary_tooltip text="पॉड" term_id="pod">}} की एक प्रति {{<glossary_tooltip text="क्लस्टर" term_id="cluster" >}} में नोड्स के एक सेट पर चल रही है।
<!--more--> 

लॉग कलेक्टरों और मॉनिटरिंग एजेंटों जैसे सिस्टम डेमॉन को तैनात करने के लिए उपयोग किया जाता है जिन्हें आमतौर पर हर {{<glossary_tooltip text="नोड" term_id="node" >}} पर चलना चाहिए।