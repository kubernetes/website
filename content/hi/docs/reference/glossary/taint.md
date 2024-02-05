---
title: Taint
id: taint
date: 2019-01-11
full_link: /docs/concepts/scheduling-eviction/taint-and-toleration/
short_description: >
  एक मुख्य वस्तु जिसमें तीन आवश्यक गुण होते हैं: कुंजी, मूल्य और प्रभाव। टेंट्स नोड्स या नोड समूहों पर पॉड्स के शेड्यूलिंग को रोकते हैं।

aka:
tags:
- core-object
- fundamental
---
एक मुख्य वस्तु जिसमें तीन आवश्यक गुण होते हैं: कुंजी, मूल्य और प्रभाव। टेंट्स {{<glossary_tooltip text="नोड्स" term_id="node" >}} या नोड समूहों पर {{<glossary_tooltip text="पॉड्स" term_id="pod" >}} के शेड्यूलिंग को रोकते हैं।

<!--more-->

Taints and {{< glossary_tooltip text="tolerations" term_id="toleration" >}} work together to ensure that pods are not scheduled onto inappropriate nodes. One or more taints are applied to a node. A node should only schedule a Pod with the matching tolerations for the configured taints.