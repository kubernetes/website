---
title: Horizontal Pod Autoscaler
id: horizontal-pod-autoscaler
date: 2018-04-12
full_link: /docs/tasks/run-application/horizontal-pod-autoscale/
short_description: >
  एक एपीआई संसाधन जो लक्षित सीपीयू उपयोग या कस्टम मीट्रिक लक्ष्यों के आधार पर स्वचालित रूप से पॉड प्रतिकृतियों की संख्या को मापता है।

aka: 
- HPA
tags:
- operation
---
 एक API संसाधन जो लक्षित सीपीयू उपयोग या कस्टम मीट्रिक लक्ष्यों के आधार पर स्वचालित रूप से {{<glossary_tooltip text="पॉड" term_id="pod" >}} प्रतिकृतियों की संख्या को मापता है।

<!--more--> 

एचपीए का उपयोग आमतौर पर {{<glossary_tooltip text="रेप्लिकेशनकंट्रोलर" term_id="replication-controller" >}}, {{<glossary_tooltip text="डिप्लॉयमेंट" term_id="deployment" >}} या {{<glossary_tooltip text="रेप्लिकासेट्स" term_id="replica-set" >}} के साथ किया जाता है। इसे उन वस्तुओं पर लागू नहीं किया जा सकता है जिन्हें स्केल नहीं किया जा सकता है, उदाहरण के लिए डेमनसेट्स।

HPA is typically used with {{< glossary_tooltip text="ReplicationControllers" term_id="replication-controller" >}}, {{< glossary_tooltip text="Deployments" term_id="deployment" >}}, or {{< glossary_tooltip text="ReplicaSets" term_id="replica-set" >}}. It cannot be applied to objects that cannot be scaled, for example {{< glossary_tooltip text="DaemonSets" term_id="daemonset" >}}.
