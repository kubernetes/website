---
title: कंटेनरों को एनवायरनमेंट वेरिएबल्स के माध्यम से पॉड जानकारी एक्सपोज़ करना
content_type: task
weight: 30
---

<!-- overview -->

यह पृष्ठ दिखाता है कि एक पॉड कैसे एनवायरनमेंट वेरिएबल्स का उपयोग कर सकता है अपने कंटेनरों को खुद की जानकारी प्रदान करने के लिए, _downward API_ का उपयोग करके। आप एनवायरनमेंट वेरिएबल्स का उपयोग पॉड फ़ील्ड्स, कंटेनर फ़ील्ड्स, या दोनों को एक्सपोज़ करने के लिए कर सकते हैं।

Kubernetes में, एक चल रहे कंटेनर को पॉड और कंटेनर फ़ील्ड्स एक्सपोज़ करने के दो तरीके हैं:

* एनवायरनमेंट वेरिएबल्स (_Environment variables_), जैसा कि इस कार्य में समझाया गया है
* [वॉल्यूम फ़ाइलें (Volume files)](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)

ये दोनों तरीके मिलकर पॉड और कंटेनर फ़ील्ड्स को एक्सपोज़ करने के लिए डाउनवर्ड एपीआई (downward API) कहलाते हैं।

चूँकि सर्विसेज़ Kubernetes द्वारा प्रबंधित कंटेनरयुक्त अनुप्रयोगों के बीच संचार का प्राथमिक तरीका हैं,
रनटाइम पर उन्हें खोजने में सक्षम होना उपयोगी है।
सर्विसेज़ तक पहुँचने के बारे में अधिक पढ़ें [here](/docs/tutorials/services/connect-applications-service/#accessing-the-service)।

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## पॉड फ़ील्ड्स को एनवायरनमेंट वेरिएबल्स के रूप में उपयोग करना {#use-pod-fields-as-values-for-environment-variables}

इस अभ्यास में, आप एक ऐसा पॉड बनाएँगे जिसमें एक कंटेनर होगा, और आप
पॉड-स्तरीय फ़ील्ड्स को एक चलते कंटेनर में एनवायरनमेंट वेरिएबल्स के रूप में प्रोजेक्ट करेंगे।

{{% code_sample file="pods/inject/dapi-envars-pod.yaml" %}}

उस मैनिफेस्ट में, आप पाँच एनवायरनमेंट वेरिएबल्स देख सकते हैं। `env`
फ़ील्ड एनवायरनमेंट वेरिएबल परिभाषाओं की एक एरे है।
एरे का पहला तत्व (element) निर्दिष्ट करता है कि `MY_NODE_NAME` एनवायरनमेंट
वेरिएबल को उसका मान पॉड के `spec.nodeName` फ़ील्ड से प्राप्त होता है। इसी तरह,
अन्य एनवायरनमेंट वेरिएबल्स अपने नाम पॉड फ़ील्ड्स से प्राप्त करते हैं।

{{< note >}}
इस उदाहरण में जो फ़ील्ड्स हैं वे पॉड फ़ील्ड्स हैं। वे पॉड में कंटेनर के फ़ील्ड्स नहीं हैं।
{{< /note >}}

पॉड बनाएँ:

```shell
kubectl apply -f https://k8s.io/examples/pods/inject/dapi-envars-pod.yaml
```

सुनिश्चित करें कि पॉड में कंटेनर चल रहा है:

```shell
kubectl get pods
```

कंटेनर के लॉग देखें:

```shell
kubectl logs dapi-envars-fieldref
```

आउटपुट चयनित एनवायरनमेंट वेरिएबल्स के मान दिखाता है:

```
minikube
dapi-envars-fieldref
default
172.17.0.4
default
```

यह देखने के लिए कि ये मान लॉग में क्यों हैं, `command` और `args` फ़ील्ड्स को देखें
कॉन्फ़िगरेशन फ़ाइल में। जब कंटेनर शुरू होता है, तो यह पाँच एनवायरनमेंट वेरिएबल्स के मान stdout में लिखता है। यह हर दस सेकंड में दोहराता है।

इसके बाद, पॉड में चल रहे कंटेनर में एक शेल प्राप्त करें:

```shell
kubectl exec -it dapi-envars-fieldref -- sh
```

अपने शेल में, एनवायरनमेंट वेरिएबल्स देखें:

```shell
printenv
```

आउटपुट दिखाता है कि कुछ एनवायरनमेंट वेरिएबल्स को
पॉड फ़ील्ड्स के मान सौंपे गए हैं:

```
MY_POD_SERVICE_ACCOUNT=default
...
MY_POD_NAMESPACE=default
MY_POD_IP=172.17.0.4
...
MY_NODE_NAME=minikube
...
MY_POD_NAME=dapi-envars-fieldref
```

## कंटेनर फ़ील्ड्स को एनवायरनमेंट वेरिएबल्स के रूप में उपयोग करना {#use-container-fields-as-values-for-environment-variables}

पिछले अभ्यास में, आपने पॉड-स्तरीय फ़ील्ड्स से जानकारी ली थी
एनवायरनमेंट वेरिएबल्स के मान के रूप में।
अगले अभ्यास में, आप पॉड परिभाषा का हिस्सा होने वाले लेकिन
विशिष्ट [कंटेनर](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container) से लिए गए फ़ील्ड्स को पास करेंगे न कि पूरे पॉड से।

यह एक मैनिफेस्ट है एक और पॉड के लिए जिसमें फिर से केवल एक कंटेनर है:

{{% code_sample file="pods/inject/dapi-envars-container.yaml" %}}

इस मैनिफेस्ट में, आप चार एनवायरनमेंट वेरिएबल्स देख सकते हैं। `env`
फ़ील्ड एनवायरनमेंट वेरिएबल परिभाषाओं की एक एरे है।
पहला तत्व निर्दिष्ट करता है कि `MY_CPU_REQUEST` एनवायरनमेंट
वेरिएबल को उसका मान कंटेनर `test-container` के `requests.cpu` फ़ील्ड से प्राप्त होता है।
इसी तरह, अन्य एनवायरनमेंट वेरिएबल्स को मान कंटेनर-विशिष्ट फ़ील्ड्स से प्राप्त होते हैं।

पॉड बनाएँ:

```shell
kubectl apply -f https://k8s.io/examples/pods/inject/dapi-envars-container.yaml
```

सुनिश्चित करें कि पॉड में कंटेनर चल रहा है:

```shell
kubectl get pods
```

कंटेनर के लॉग देखें:

```shell
kubectl logs dapi-envars-resourcefieldref
```

आउटपुट चयनित एनवायरनमेंट वेरिएबल्स के मान दिखाता है:

```
1
1
33554432
67108864
```

## {{% heading "whatsnext" %}}


* [एक कंटेनर के लिए एनवायरनमेंट वेरिएबल्स परिभाषित करना](/docs/tasks/inject-data-application/define-environment-variable-container/) पढ़ें।
* [`spec`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodSpec) एपीआई परिभाषा को पढ़ें जो पॉड के लिए है। इसमें कंटेनर की परिभाषा भी शामिल है (जो पॉड का हिस्सा है)।
* उन  [उपलब्ध फ़ील्ड्स (available fields)](/docs/concepts/workloads/pods/downward-api/#available-fields) की सूची पढ़ें जिन्हें आप डाउनवर्ड एपीआई का उपयोग करके एक्सपोज़ कर सकते हैं।

पॉड्स, कंटेनर और एनवायरनमेंट वेरिएबल्स के बारे में पुरानी एपीआई संदर्भ में पढ़ें:

* [PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)
* [Container](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)
* [EnvVar](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvar-v1-core)
* [EnvVarSource](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvarsource-v1-core)
* [ObjectFieldSelector](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#objectfieldselector-v1-core)
* [ResourceFieldSelector](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#resourcefieldselector-v1-core)




