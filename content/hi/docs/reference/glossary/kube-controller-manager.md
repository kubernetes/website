---
title: क्यूब-कंट्रोलर-मैनजर (kube-controller-manager)
id: kube-controller-manager
date: 2018-04-12
full_link: /docs/reference/command-line-tools-reference/kube-controller-manager/
short_description: >
   कंट्रोल प्लेन का घटक जो कंट्रोलर प्रॉसेसेज़ को चलाता है।

aka: 
tags:
- architecture
- fundamental
---
 कंट्रोल प्लेन का घटक जो {{< glossary_tooltip text="कंट्रोलर" term_id="controller" >}} प्रॉसेसेज़ को चलाता है।

<!--more-->

लॉजिकल रूप से, प्रत्येक {{< glossary_tooltip text="कंट्रोलर" term_id="controller" >}} एक अलग प्रक्रिया है, लेकिन जटिलता को कम करने के लिए, उन्हें सभी को एक सिंगल बाइनरी में संकलित किया जाता है और एक ही प्रक्रिया में चलाया जाता है।
