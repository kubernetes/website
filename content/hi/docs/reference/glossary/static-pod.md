---
title: Static Pod
id: static-pod
date: 2019-02-12
full_link: /docs/tasks/configure-pod-container/static-pod/
short_description: >
  एक पॉड एक विशिष्ट नोड पर क्यूबलेट डेमॉन द्वारा सीधे प्रबंधित किया जाता है।

aka: 
tags:
- fundamental
---
एक {{<glossary_tooltip text="पॉड" term_id="pod" >}} को API सर्वर द्वारा देखे बिना सीधे {{<glossary_tooltip text="क्यूबलेट" term_id="kubelet" >}} डेमॉन द्वारा एक विशिष्ट {{<glossary_tooltip text="नोड" term_id="node" >}} पर प्रबंधित किया जाता है।

<!--more-->



स्टेटिक पॉड्स {{<glossary_tooltip text="क्षणिक-कंटेनर" term_id="ephemeral-container" >}} का समर्थन नहीं करते हैं।