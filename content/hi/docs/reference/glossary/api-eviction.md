---
title: API-ने निष्कासन शुरू किया
id: api-eviction
date: 2021-04-27
full_link: /docs/concepts/scheduling-eviction/api-eviction/
short_description: >
  API-eviction निष्कासन वह प्रक्रिया है जिसके द्वारा आप एक बनाने के लिए निष्कासन API का उपयोग करते हैं
aka:
tags:
- operation
---
API-initiated eviction वह प्रक्रिया है जिसके द्वारा आप [निष्कासन एपीआई](/docs/reference/generated/kubernetes-api/{{<param "version">}}/#create-eviction-pod-v1-core) का उपयोग करते हैं
एक `एविक्शन` ऑब्जेक्ट बनाने के लिए जो सुंदर पॉड समाप्ति को ट्रिगर करता है।

<!--more-->
आप सीधे eviction API को कॉल करके बेदखली का अनुरोध कर सकते हैं
क्यूब-एपिसर्वर के क्लाइंट का उपयोग करना, जैसे `kubectl drain` कमांड।
जब एक `Eviction` ऑब्जेक्ट बनाया जाता है, तो API सर्वर पॉड को समाप्त कर देता है।


API-initiated evictions आपके कॉन्फ़िगर किए गए [`पॉडडिस्रप्शनबजट`](/docs/tasks/run-application/configure-pdb/) का सम्मान करते हैं
और [`terminationGracePeriodSeconds`](/docs/concepts/workloads/pods/pod-lifecycle#pod-टर्मिनेशन)।

API-initiated eviction [नोड-दबाव-निष्कासन](/docs/concepts/scheduling-eviction/node-pressure-eviction/) के समान नहीं है।

* अधिक जानकारी के लिए [एपीआई-आरंभित निष्कासन](/docs/concepts/scheduling-eviction/api-eviction/) देखें।
