---
title: एकत्रीकरण परत
id: aggregation-layer
date: 2018-10-08
full_link: /docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/
short_description: >
  एकत्रीकरण परत आपको अपने क्लस्टर में अतिरिक्त कुबेरनेट्स-शैली एपीआई स्थापित करने देता है।

aka:
tags:
  - architecture
  - extension
  - operation
---

एकत्रीकरण परत आपको अपने क्लस्टर में अतिरिक्त कुबेरनेट्स-शैली एपीआई स्थापित करने देता है।

<!--more-->

जब आपने {{< glossary_tooltip text="कुबेरनेट्स एपीआई सर्वर" term_id="kube-apiserver" >}} को [अतिरिक्त एपीआई का समर्थन](/docs/tasks/extend-kubernetes/configure-aggregation-layer/) करने के लिए कॉन्फ़िगर किया हो, आप कुबेरनेट्स एपीआई में यूआरएल पथ का "दावा" करने के लिए `APIService` ऑब्जेक्ट जोड़ सकते हैं।
