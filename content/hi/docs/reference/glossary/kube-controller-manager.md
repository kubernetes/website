---
title: क्यूब कंट्रोलर मैनेजर
id: kube-controller-manager
date: 2018-04-12
full_link: /docs/reference/command-line-tools-reference/kube-controller-manager/
short_description: >
  कंट्रोल प्लेन घटक जो नियंत्रक प्रक्रियाओं को चलाता है।
aka: kube-controller-manager
tags:
- architecture
- fundamental
---
 कंट्रोल प्लेन घटक जो {{<glossary_tooltip text="नियंत्रक" term_id="controller">}} प्रक्रियाओं को चलाता है।

<!--more-->

तार्किक रूप से, प्रत्येक {{<glossary_tooltip text="नियंत्रक" term_id="controller">}} एक अलग प्रक्रिया है, लेकिन जटिलता को कम करने के लिए, उन सभी को एक ही बाइनरी में संकलित किया जाता है और एक ही प्रक्रिया में चलाया जाता है।