---
title: API द्वारा शुरू किया गया निष्कासन (API-initiated eviction)
id: api-eviction
date: 2021-04-27
full_link: /docs/concepts/scheduling-eviction/api-eviction/
short_description: >
  API द्वारा शुरू किया गया निष्कासन वह प्रक्रिया है जिसके द्वारा आप एविक्शन (Eviction) API का उपयोग एक एविक्शन ऑब्जेक्ट बनाने के लिए करते हैं जो ग्रेसफुल पॉड टर्मिनेशन को ट्रिगर करता है।
aka:
tags:
  - operation
---

API द्वारा शुरू किया गया निष्कासन वह प्रक्रिया है जिसके द्वारा [एविक्शन API](/docs/reference/generated/kubernetes-api/{{<param "version">}}/#create-eviction-pod-v1-core) का उपयोग एक `Eviction` ऑब्जेक्ट बनाने के लिए किया जाता हैं जो ग्रेसफुल पॉड समापन को ट्रिगर करता है।

<!--more-->

आप kube-apiserver के क्लाइंट जैसे कि `kubectl drain` कमांड का उपयोग करके सीधे एविक्शन API को कॉल करके निष्कासन का अनुरोध कर सकते हैं। जब एक `Eviction` ऑब्जेक्ट बनाया जाता है, तो API सर्वर पॉड को समाप्त कर देता है।

API द्वारा शुरू किया गया निष्कासन आपके कॉन्फ़िगर किए गए [`PodDisruptionBudgets`](/docs/tasks/run-application/configure-pdb/) और [`terminationGracePeriodSeconds`](/docs/concepts/workloads/pods/pod-lifecycle#pod-termination) का सम्मान करते हैं।

API द्वारा शुरू किया गया निष्कासन [नोड-प्रेशर एविक्शन](/docs/concepts/scheduling-eviction/node-pressure-eviction/) से अलग है।

- अधिक जानकारी के लिए [API द्वारा शुरू किया गया निष्कासन](/docs/concepts/scheduling-eviction/api-eviction/) देखें।
