---
title: Preemption
id: preemption
date: 2019-01-31
full_link: /docs/concepts/scheduling-eviction/pod-priority-preemption/#preemption
short_description: >
  कुबेरनेट्स में प्रीएम्प्शन लॉजिक उस नोड पर मौजूद कम प्राथमिकता वाले पॉड्स को हटाकर एक लंबित पॉड को एक उपयुक्त नोड खोजने में मदद करता है।

aka:
tags:
- operation
---
 कुबेरनेट्स में प्रीएम्प्शन लॉजिक उस {{<glossary_tooltip text="नोड" term_id="node" >}} पर मौजूद कम प्राथमिकता वाले {{<glossary_tooltip text="पॉड्स" term_id="pod" >}} को हटाकर एक लंबित पॉड को एक उपयुक्त नोड खोजने में मदद करता है।

<!--more-->

यदि किसी पॉड को शेड्यूल नहीं किया जा सकता है, तो शेड्यूलर लंबित पॉड की शेड्यूलिंग को संभव बनाने के लिए [प्रीएम्प्ट](/docs/concepts/scheduling-eviction/pod-priority-preemption/#preemption) कम प्राथमिकता वाले पॉड्स को शेड्यूल करने का प्रयास करता है।