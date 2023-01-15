---
title: एग्रीगेशन लेयर
id: aggregation-layer
date: 2018-10-08
full_link: /docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/
short_description: >
  एग्रीगेशन लेयर आपको अपने क्लस्टर में अतिरिक्त कुबेरनेट्स-शैली API स्थापित करने देता है।

aka:
tags:
  - architecture
  - extension
  - operation
---

एग्रीगेशन लेयर आपको अपने क्लस्टर में अतिरिक्त कुबेरनेट्स-शैली API स्थापित करने देता है।

<!--more-->

जब आपने {{< glossary_tooltip text="कुबेरनेट्स API सर्वर" term_id="kube-apiserver" >}} को [अतिरिक्त API का समर्थन](/docs/tasks/extend-kubernetes/configure-aggregation-layer/) करने के लिए कॉन्फ़िगर किया हो, आप कुबेरनेट्स API में URL पाथ का "दावा" करने के लिए `APIService` ऑब्जेक्ट जोड़ सकते हैं।
