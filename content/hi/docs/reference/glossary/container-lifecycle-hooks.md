---
title: कंटेनर लाइफसाइकिल हुक 
id: container-lifecycle-hooks
date: 2018-10-08
full_link: /docs/concepts/containers/container-lifecycle-hooks/
short_description: >
  जीवनचक्र हुक कंटेनर प्रबंधन जीवनचक्र में घटनाओं को उजागर करते हैं और घटनाओं के घटित होने पर उपयोगकर्ता को कोड चलाने देते हैं।
aka: Container Lifecycle Hooks
tags:
- extension
---
  जीवनचक्र हुक {{<glossary_tooltip text="कंटेनर" term_id="container">}} प्रबंधन जीवनचक्र में घटनाओं को उजागर करते हैं और घटनाओं के घटित होने पर उपयोगकर्ता को कोड चलाने देते हैं।

<!--more-->

दो हुक कंटेनरों के संपर्क में आते हैं: PostStart जो कंटेनर बनने के तुरंत बाद निष्पादित होता है और PreStop जो ब्लॉक कर रहा है और कंटेनर समाप्त होने से तुरंत पहले कॉल किया जाता है।
