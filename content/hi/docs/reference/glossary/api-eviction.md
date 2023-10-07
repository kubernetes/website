---
title: एपीआई द्वारा आरंभित निष्कासन (API-Initiated Eviction)
id: api-eviction
date: 2021-04-27
full_link: /hi/docs/concepts/scheduling-eviction/api-eviction/
short_description: >
  'API-Initiated Eviction' निष्कासन की वह प्रक्रिया है, जिसके द्वारा आप एक Eviction ऑब्जेक्ट बनाने के लिए Eviction API का उपयोग करते हैं, जो graceful pod termination को ट्रिगर करती है।
aka:
tags:
- operation
---
'API-Initiated Eviction' निष्कासन की वह प्रक्रिया है, जिसके द्वारा आप एक `Eviction` ऑब्जेक्ट बनाने के लिए [Eviction API](/hi/docs/reference/generated/kubernetes-api/{{<param "version">}}/#create-eviction-pod-v1-core) (निष्कासन एपीआई) का उपयोग करते हैं, जो graceful pod termination को ट्रिगर करती है।

<!--more-->
आप सीधे Eviction API को कॉल करके निष्कासन का अनुरोध कर सकते हैं, 
Kube-apiserver के क्लाइंट का उपयोग करके, जैसे `kubectl drain` कमांड।
जब एक `Eviction` ऑब्जेक्ट बनाया जाता है, तो API सर्वर पॉड को समाप्त कर देता है।


API-initiated evictions आपके कॉन्फ़िगर किए गए [`PodDisruptionBudgets`](/hi/docs/tasks/run-application/configure-pdb/) और 
[`terminationGracePeriodSeconds`](/hi/docs/concepts/workloads/pods/pod-lifecycle#pod-termination) का सम्मान करता है।

'एपीआई द्वारा आरंभित निष्कासन', [नोड के दबाव द्वारा निष्कासन](/hi/docs/concepts/scheduling-eviction/node-pressure-eviction/) के समान नहीं है।

* अधिक जानकारी के लिए [एपीआई द्वारा आरंभित निष्कासन](/hi/docs/concepts/scheduling-eviction/api-eviction/) देखें।
