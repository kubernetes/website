---
title: एपीआई द्वारा शुरू किया गया निष्कासन (API-initiated eviction)
id: api-eviction
date: 2021-04-27
full_link: /docs/concepts/scheduling-eviction/api-eviction/
short_description: >
  एपीआई द्वारा शुरू की गईी निष्कासन वह प्रक्रिया है जिसके द्वारा आप एविक्शन एपीआई का उपयोग एक निष्कासन वस्तु बनाने के लिए करते हैं जो ग्रेसफुल पॉड टर्मिनेशन को ट्रिगर करता है।
aka:
tags:
  - operation
---

एपीआई द्वारा शुरू किया गया निष्कासन वह प्रक्रिया है जिसके द्वारा [निष्कासन एपीआई](/docs/reference/generated/kubernetes-api/{{<param "version">}}/#create-eviction-pod-v1-core) का उपयोग एक `निष्कासन` वस्तु बनाने के लिए किया जाता हैं जो ग्रेसफुल पॉड समापन को ट्रिगर करता है।

<!--more-->

आप सीधे निष्कासन एपीआई को कॉल करके निष्कासन का अनुरोध कर सकते हैं कुबे-एपीआईसर्वर के क्लाइंट का उपयोगा करके, जैसे `kubectl drain` कमांड। जब एक `निष्कासन` वस्तु बनाया जाता है, तो एपीआई सर्वर पॉड को समाप्त कर देता है।

एपीआई द्वारा शुरू किया गया निष्कासन आपके कॉन्फ़िगर किए गए [`PodDisruptionBudgets`](/docs/tasks/run-application/configure-pdb/) और [`terminationGracePeriodSeconds`](/docs/concepts/workloads/pods/pod-lifecycle#pod-termination) का सम्मान करते हैं।

एपीआई द्वारा शुरू की गईी निष्कासन [node-pressure eviction](/docs/concepts/scheduling-eviction/node-pressure-eviction/) के समान नहीं है।

- अधिक जानकारी के लिए [एपीआई द्वारा शुरू किया गया निष्कासन](/docs/concepts/scheduling-eviction/api-eviction/) देखें।
