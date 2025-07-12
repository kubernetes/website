---
title: निर्भर एनवायरनमेंट वेरिएबल्स परिभाषित करें
content_type: task
weight: 20
---

<!-- overview -->

यह पृष्ठ दिखाता है कि कुबेरनेट्स पॉड में किसी कंटेनर के लिए निर्भर एनवायरनमेंट वेरिएबल्स कैसे परिभाषित करें।

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}


<!-- steps -->

## कंटेनर के लिए एक निर्भर एनवायरनमेंट वेरिएबल परिभाषित करें {#define-an-environment-dependent-variable-for-a-container}

जब आप एक पॉड बनाते हैं, तो आप उसमें चलने वाले कंटेनरों के लिए निर्भर एनवायरनमेंट वेरिएबल्स सेट कर सकते हैं। निर्भर एनवायरनमेंट वेरिएबल्स सेट करने के लिए, आप कॉन्फ़िगरेशन फ़ाइल में `env` की `value` में $(VAR_NAME) का उपयोग कर सकते हैं।

इस अभ्यास में, आप एक ऐसा पॉड बनाएंगे जो एक कंटेनर चलाता है।  
पॉड के लिए कॉन्फ़िगरेशन फ़ाइल में एक निर्भर एनवायरनमेंट वेरिएबल्स परिभाषित किया गया है, जिसका सामान्य उपयोग निर्धारित किया गया है।
पॉड के लिए कॉन्फ़िगरेशन मैनिफेस्ट इस प्रकार है:

{{% code_sample file="pods/inject/dependent-envars.yaml" %}}

1. उस मैनिफेस्ट के आधार पर एक पॉड बनाएँ:

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/inject/dependent-envars.yaml
   ```
   ```
   pod/dependent-envars-demo created
   ```

2. चल रहे पॉड्स की सूची देखें:

   ```shell
   kubectl get pods dependent-envars-demo
   ```
   ```
   NAME                      READY     STATUS    RESTARTS   AGE
   dependent-envars-demo     1/1       Running   0          9s
   ```

3. अपने पॉड में चल रहे कंटेनर के लॉग्स देखें:

   ```shell
   kubectl logs pod/dependent-envars-demo
   ```
   ```

   UNCHANGED_REFERENCE=$(PROTOCOL)://172.17.0.1:80
   SERVICE_ADDRESS=https://172.17.0.1:80
   ESCAPED_REFERENCE=$(PROTOCOL)://172.17.0.1:80
   ```

जैसा कि ऊपर दिखाया गया है, आपने `SERVICE_ADDRESS` के लिए एक सही डिपेंडेंसी रेफरेंस,
`UNCHANGED_REFERENCE` के लिए एक गलत डिपेंडेंसी रेफरेंस, और `ESCAPED_REFERENCE` के लिए एक स्किप किया गया रेफरेंस परिभाषित किया है।

जब कोई एनवायरनमेंट वेरिएबल पहले से परिभाषित होता है और उसका रेफरेंस दिया जाता है,
तो वह रेफरेंस सही तरीके से हल हो सकता है, जैसा कि `SERVICE_ADDRESS` के मामले में हुआ।

ध्यान दें कि `env` सूची में क्रम महत्वपूर्ण होता है।
अगर कोई वेरिएबल सूची में नीचे परिभाषित है, तो उसे परिभाषित नहीं माना जाता।
इसी कारण से `UNCHANGED_REFERENCE` `$(PROTOCOL)` को हल करने में विफल रहता है।

जब कोई एनवायरनमेंट वेरिएबल परिभाषित नहीं होता या उसमें कुछ वेरिएबल्स ही शामिल होते हैं,
तो वह वेरिएबल एक सामान्य स्ट्रिंग की तरह माना जाता है, जैसे कि `UNCHANGED_REFERENCE।`
ध्यान दें कि सामान्यतः गलत तरीके से पार्स किए गए एनवायरनमेंट वेरिएबल्स कंटेनर को शुरू होने से नहीं रोकते।

`$(VAR_NAME)` सिंटैक्स को डबल `$`, जैसे `$$(VAR_NAME)` से एस्केप किया जा सकता है।
एस्केप किए गए रेफरेंस कभी भी विस्तारित नहीं होते, चाहे संबंधित वेरिएबल परिभाषित हो या नहीं।
यह `ESCAPED_REFERENCE` उदाहरण में देखा जा सकता है।

## {{% heading "whatsnext" %}}

* [एनवायरनमेंट वेरिएबल्स](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/) के बारे में और जानें।
* [EnvVarSource](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvarsource-v1-core) देखें। 
