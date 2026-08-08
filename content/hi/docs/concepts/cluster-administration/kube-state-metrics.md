---
title: कुबेरनेट्स ऑब्जेक्ट स्थितियों के लिए मेट्रिक्स
content_type: concept
weight: 75
description: >-
   kube-state-metrics, क्लस्टर-स्तरीय मेट्रिक्स उत्पन्न करने और उजागर करने के लिए एक ऐड-ऑन एजेंट।
---

कुबेरनेट्स API में कुबेरनेट्स ऑब्जेक्ट्स की स्थिति को मेट्रिक्स के रूप में उजागर किया जा सकता है।
[kube-state-metrics](https://github.com/kubernetes/kube-state-metrics) नामक एक ऐड-ऑन एजेंट कुबेरनेट्स API सर्वर से कनेक्ट हो सकता है और क्लस्टर में अलग-अलग ऑब्जेक्ट्स की स्थिति से उत्पन्न मेट्रिक्स के साथ एक HTTP एंडपॉइंट उजागर कर सकता है।
यह ऑब्जेक्ट्स की स्थिति के बारे में विभिन्न जानकारी उजागर करता है जैसे लेबल और एनोटेशन, आरंभ और समाप्ति समय, स्थिति या वह फ़ेज़ जिसमें ऑब्जेक्ट वर्तमान में है।
उदाहरण के लिए, pods में चलने वाले कंटेनर एक `kube_pod_container_info` मेट्रिक बनाते हैं।
इसमें लेबल के रूप में कंटेनर का नाम, जिस pod का यह हिस्सा है उसका नाम, जिस {{< glossary_tooltip text="namespace" term_id="namespace" >}} में pod चल रहा है, कंटेनर इमेज का नाम, इमेज की ID, कंटेनर के spec से इमेज का नाम, चल रहे कंटेनर की ID और pod की ID शामिल होती है।

{{% thirdparty-content single="true" %}}

एक बाहरी घटक जो kube-state-metrics के एंडपॉइंट को स्क्रैप करने में सक्षम है (उदाहरण के लिए Prometheus के माध्यम से) अब निम्नलिखित उपयोग-स्थितियों को सक्षम करने के लिए उपयोग किया जा सकता है।

## उदाहरण: क्लस्टर स्थिति की क्वेरी के लिए kube-state-metrics से मेट्रिक्स का उपयोग {#example-kube-state-metrics-query-1}

kube-state-metrics द्वारा उत्पन्न मेट्रिक श्रृंखलाएँ क्लस्टर में और अधिक अंतर्दृष्टि प्राप्त करने में सहायक होती हैं, क्योंकि इनका उपयोग क्वेरी के लिए किया जा सकता है।

यदि आप Prometheus या समान क्वेरी भाषा का उपयोग करने वाले किसी अन्य टूल का उपयोग करते हैं, तो निम्नलिखित PromQL क्वेरी उन pods की संख्या लौटाती है जो तैयार नहीं हैं:

```
count(kube_pod_status_ready{condition="false"}) by (namespace, pod)
```

## उदाहरण: kube-state-metrics के आधार पर अलर्टिंग {#example-kube-state-metrics-alert-1}

kube-state-metrics से उत्पन्न मेट्रिक्स क्लस्टर में समस्याओं पर अलर्टिंग की भी अनुमति देते हैं।

यदि आप Prometheus या समान अलर्ट नियम भाषा का उपयोग करने वाले किसी समान टूल का उपयोग करते हैं, तो निम्नलिखित अलर्ट तब सक्रिय होगा जब ऐसे pods हों जो 5 मिनट से अधिक समय से `Terminating` स्थिति में हैं:

```yaml
groups:
- name: Pod state
  rules:
  - alert: PodsBlockedInTerminatingState
    expr: count(kube_pod_deletion_timestamp) by (namespace, pod) * count(kube_pod_status_reason{reason="NodeLost"} == 0) by (namespace, pod) > 0
    for: 5m
    labels:
      severity: page
    annotations:
      summary: Pod {{$labels.namespace}}/{{$labels.pod}} blocked in Terminating state.
```
