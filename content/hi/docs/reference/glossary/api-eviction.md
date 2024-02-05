---
title: API-initiated eviction
id: api-eviction
date: 2021-04-27
full_link: /docs/concepts/scheduling-eviction/api-eviction/
short_description: >
  API-इनेशिएटेड एविक्शन वह प्रक्रिया है जिसके द्वारा आप एक एविक्शन ऑब्जेक्ट बनाने के लिए एविक्शन एपीआई का उपयोग करते हैं जो ग्रेसफुल पॉड समाप्ति को ट्रिगर करता है।
aka:
tags:
- operation
---
API-इनेशिएटेड एविक्शन वह प्रक्रिया है जिसके द्वारा आप एक `एविक्शन` ऑब्जेक्ट बनाने के लिए [एविक्शन API](/docs/reference/generated/kubernetes-api/{{<param "version">}}/#create-eviction-pod-v1-core) का उपयोग करते हैं जो ग्रेसफुल पॉड समाप्ति को ट्रिगर करता है।

<!--more-->

आप `kubectl drain` कमांड की तरह, kube-apiserver के क्लाइंट का उपयोग करके सीधे एविक्शन API को कॉल करके निष्कासन का अनुरोध कर सकते हैं। जब एक `एविक्शन` ऑब्जेक्ट बनाया जाता है, तो API सर्वर पॉड को समाप्त कर देता है।

API-इनेशिएटेड एविक्शन आपके कॉन्फ़िगर किए गए [`पॉडडिस्रप्शनबजगेट्स`](/docs/tasks/run-application/configure-pdb/) और [`terminationGracePeriodSeconds` (/docs/concepts/workloads/pods/pod-lifecycle#pod-termination) का सम्मान करते हैं .

API-इनेशिएटेड एविक्शन [नोड-दबाव-निष्कासन](/docs/concepts/scheduling-eviction/node-pressure-eviction/) के समान नहीं है।

* अधिक जानकारी के लिए [API-इनेशिएटेड एविक्शन](/docs/concepts/scheduling-eviction/api-eviction/) देखें।