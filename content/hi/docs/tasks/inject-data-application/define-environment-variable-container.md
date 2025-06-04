---
title: कंटेनर के लिए एनवायरनमेंट वेरिएबल्स परिभाषित करें
content_type: task
weight: 20
---

<!-- overview -->

यह पृष्ठ दिखाता है कि Kubernetes पॉड में किसी कंटेनर के लिए एनवायरनमेंट वेरिएबल्स कैसे परिभाषित करें।


## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## कंटेनर के लिए एक एनवायरनमेंट वेरिएबल परिभाषित करें

जब आप एक Pod बनाते हैं, तो आप उस Pod में चलने वाले कंटेनरों के लिए एनवायरनमेंट वेरिएबल्स सेट कर सकते हैं।
एनवायरनमेंट वेरिएबल्स सेट करने के लिए, कॉन्फ़िगरेशन फ़ाइल में `env` या `envFrom` फ़ील्ड शामिल करें।

`env` और `envFrom` फ़ील्ड्स का प्रभाव अलग-अलग होता है:

`env`
: आपको प्रत्येक वेरिएबल के लिए सीधे एक मान निर्दिष्ट करके कंटेनर के लिए एनवायरनमेंट वेरिएबल्स सेट करने की अनुमति देता है।

`envFrom`
: आपको एक ConfigMap या Secret का संदर्भ देकर कंटेनर के लिए एनवायरनमेंट वेरिएबल्स सेट करने की अनुमति देता है।
जब आप `envFrom` का उपयोग करते हैं, तो संदर्भित ConfigMap या Secret में मौजूद सभी key-value जोड़े कंटेनर के लिए एनवायरनमेंट वेरिएबल्स के रूप में सेट हो जाते हैं।
आप एक सामान्य प्रीफ़िक्स स्ट्रिंग भी निर्दिष्ट कर सकते हैं।

आप [ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/#configure-all-key-value-pairs-in-a-configmap-as-container-environment-variables)
और [Secret](/docs/tasks/inject-data-application/distribute-credentials-secure/#configure-all-key-value-pairs-in-a-secret-as-container-environment-variables) के बारे में अधिक पढ़ सकते हैं।

यह पृष्ठ आपको `env` का उपयोग करना सिखाता है।

इस अभ्यास में, आप एक ऐसा Pod बनाएँगे जिसमें एक कंटेनर चलता है।
Pod के लिए कॉन्फ़िगरेशन फ़ाइल में `DEMO_GREETING` नामक एनवायरनमेंट वेरिएबल और `"Hello from the environment"` मान परिभाषित किया गया है।
यह रहा Pod के लिए कॉन्फ़िगरेशन मैनिफ़ेस्ट:

{{% code_sample file="pods/inject/envars.yaml" %}}

1. उस मैनिफ़ेस्ट के आधार पर एक Pod बनाएँ:

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/inject/envars.yaml
   ```

2. चल रहे Pods की सूची देखें:

   ```shell
   kubectl get pods -l purpose=demonstrate-envars
   ```
   आउटपुट कुछ ऐसा दिखाई देगा:

   ```
   NAME            READY     STATUS    RESTARTS   AGE
   envar-demo      1/1       Running   0          9s
   ```

3. Pod के कंटेनर के एनवायरनमेंट वेरिएबल्स की सूची देखें:

   ```shell
   kubectl exec envar-demo -- printenv
   ```

   आउटपुट कुछ ऐसा दिखाई देगा:

   ```
   NODE_VERSION=4.4.2
   EXAMPLE_SERVICE_PORT_8080_TCP_ADDR=10.3.245.237
   HOSTNAME=envar-demo
   ...
   DEMO_GREETING=Hello from the environment
   DEMO_FAREWELL=Such a sweet sorrow
   ```


{{< note >}}
`env` या `envFrom` फ़ील्ड का उपयोग करके सेट किए गए एनवायरनमेंट वेरिएबल्स कंटेनर इमेज में पहले से निर्दिष्ट किसी भी एनवायरनमेंट वेरिएबल्स को ओवरराइड कर देते हैं।
{{< /note >}}

{{< note >}}
एनवायरनमेंट वेरिएबल्स एक-दूसरे का संदर्भ दे सकते हैं, लेकिन क्रम (ordering) महत्वपूर्ण होता है।  
जो वेरिएबल्स दूसरों का उपयोग करते हैं, उन्हें सूची में बाद में आना चाहिए।  
इसी तरह, सर्कुलर रेफरेंस (circular references) से बचें।
{{< /note >}}

## अपने कॉन्फ़िग में एनवायरनमेंट वेरिएबल्स का उपयोग करना

Pod के कॉन्फ़िगरेशन में `.spec.containers[*].env[*]` के अंतर्गत परिभाषित किए गए  
एनवायरनमेंट वेरिएबल्स का उपयोग कॉन्फ़िगरेशन के अन्य हिस्सों में भी किया जा सकता है,  
उदाहरण के लिए, उन कमांड्स और आर्ग्युमेंट्स में जो आप Pod के कंटेनरों के लिए सेट करते हैं।
नीचे दिए गए उदाहरण कॉन्फ़िगरेशन में, `GREETING`, `HONORIFIC`, और `NAME` एनवायरनमेंट वेरिएबल्स को  
क्रमशः `Warm greetings to`, `The Most Honorable`, और `Kubernetes` के रूप में सेट किया गया है।  
`MESSAGE` नामक एनवायरनमेंट वेरिएबल इन सभी वेरिएबल्स को एक साथ जोड़कर  
उसे `env-print-demo` कंटेनर को CLI आर्ग्युमेंट के रूप में पास करता है।

एनवायरनमेंट वेरिएबल्स के नाम अक्षरों, अंकों, अंडरस्कोर (_), डॉट (.), या हाइफ़न (-) से मिलकर बन सकते हैं,  
लेकिन पहला अक्षर कोई अंक नहीं हो सकता।

यदि `RelaxedEnvironmentVariableValidation` [फ़ीचर गेट](/docs/reference/command-line-tools-reference/feature-gates/) सक्षम है,  
तो सभी [प्रिंटेबल ASCII कैरेक्टर्स](https://www.ascii-code.com/characters/printable-characters) (सिवाय `"="` के)  
एनवायरनमेंट वेरिएबल नामों में उपयोग किए जा सकते हैं।

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: print-greeting
spec:
  containers:
  - name: env-print-demo
    image: bash
    env:
    - name: GREETING
      value: "Warm greetings to"
    - name: HONORIFIC
      value: "The Most Honorable"
    - name: NAME
      value: "Kubernetes"
    - name: MESSAGE
      value: "$(GREETING) $(HONORIFIC) $(NAME)"
    command: ["echo"]
    args: ["$(MESSAGE)"]
```

कंटेनर के निर्माण पर, कमांड `echo Warm greetings to The Most Honorable Kubernetes` कंटेनर पर चलाया जाता है।

## {{% heading "whatsnext" %}}

* [एनवायरनमेंट वेरिएबल्स](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/) के बारे में और जानें।
* [सीक्रेट्स को एनवायरनमेंट वेरिएबल्स के रूप में उपयोग करना](/docs/concepts/configuration/secret/#using-secrets-as-environment-variables) सीखें।
* [EnvVarSource](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvarsource-v1-core) देखें।
