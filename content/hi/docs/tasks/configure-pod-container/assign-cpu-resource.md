---
title: कंटेनर और पॉड को CPU संसाधन आवंटित करें
content_type: task
weight: 20
---

<!-- overview -->

यह पृष्ठ दिखाता है कि कंटेनर को CPU *request* और CPU *limit* कैसे असाइन करें।
कंटेनर कॉन्फ़िगर की गई सीमा से अधिक CPU का उपयोग नहीं कर सकते।
बशर्ते सिस्टम में CPU समय उपलब्ध हो, कंटेनर को उतना CPU आवंटित करने की गारंटी है
जितना वह request करता है।




## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

टास्क उदाहरण चलाने के लिए आपके क्लस्टर में कम से कम 1 CPU उपलब्ध होना चाहिए।

इस पृष्ठ के कुछ चरणों में आपको अपने क्लस्टर में
[metrics-server](https://github.com/kubernetes-sigs/metrics-server)
सर्विस चलाने की आवश्यकता है। यदि आपके पास metrics-server
चल रहा है, तो आप उन चरणों को छोड़ सकते हैं।

यदि आप {{< glossary_tooltip term_id="minikube" >}} चला रहे हैं, तो
metrics-server को सक्षम करने के लिए निम्नलिखित कमांड चलाएं:

```shell
minikube addons enable metrics-server
```

यह देखने के लिए कि क्या metrics-server (या resource metrics
API का कोई अन्य प्रदाता, `metrics.k8s.io`) चल रहा है, निम्नलिखित कमांड टाइप करें:

```shell
kubectl get apiservices
```

यदि resource metrics API उपलब्ध है, तो आउटपुट में
`metrics.k8s.io` का एक संदर्भ शामिल होगा।


```
NAME
v1beta1.metrics.k8s.io
```




<!-- steps -->

## नेमस्पेस बनाएं

एक {{< glossary_tooltip term_id="namespace" >}} बनाएं ताकि आप इस अभ्यास में जो
संसाधन बनाते हैं वे आपके शेष क्लस्टर से अलग रहें।

```shell
kubectl create namespace cpu-example
```

## CPU request और CPU limit निर्दिष्ट करें

कंटेनर के लिए CPU request निर्दिष्ट करने के लिए, Container resource manifest में
`resources:requests` फ़ील्ड शामिल करें। CPU limit निर्दिष्ट करने के लिए, `resources:limits` शामिल करें।

इस अभ्यास में, आप एक Pod बनाते हैं जिसमें एक कंटेनर होता है। कंटेनर में
0.5 CPU का request और 1 CPU की limit होती है। यहाँ Pod के लिए कॉन्फ़िगरेशन फ़ाइल है:

{{% code_sample file="pods/resource/cpu-request-limit.yaml" %}}

कॉन्फ़िगरेशन फ़ाइल का `args` सेक्शन कंटेनर शुरू होने पर उसे आर्गुमेंट प्रदान करता है।
`-cpus "2"` आर्गुमेंट कंटेनर को 2 CPU का उपयोग करने का प्रयास करने के लिए कहता है।

Pod बनाएं:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/cpu-request-limit.yaml --namespace=cpu-example
```

सत्यापित करें कि Pod चल रहा है:

```shell
kubectl get pod cpu-demo --namespace=cpu-example
```

Pod के बारे में विस्तृत जानकारी देखें:

```shell
kubectl get pod cpu-demo --output=yaml --namespace=cpu-example
```

आउटपुट दिखाता है कि Pod में एक कंटेनर में 500 milliCPU का CPU request
और 1 CPU की CPU limit है।

```yaml
resources:
  limits:
    cpu: "1"
  requests:
    cpu: 500m
```

Pod के लिए metrics प्राप्त करने के लिए `kubectl top` का उपयोग करें:

```shell
kubectl top pod cpu-demo --namespace=cpu-example
```

यह उदाहरण आउटपुट दिखाता है कि Pod 974 milliCPU का उपयोग कर रहा है, जो
Pod कॉन्फ़िगरेशन में निर्दिष्ट 1 CPU की सीमा से थोड़ा कम है।

```
NAME                        CPU(cores)   MEMORY(bytes)
cpu-demo                    974m         <something>
```

याद रखें कि `-cpu "2"` सेट करके, आपने कंटेनर को 2 CPU का उपयोग करने का प्रयास करने के लिए कॉन्फ़िगर किया था, लेकिन कंटेनर को केवल लगभग 1 CPU का उपयोग करने की अनुमति दी जा रही है। कंटेनर का CPU उपयोग थ्रॉटल किया जा रहा है, क्योंकि कंटेनर अपनी सीमा से अधिक CPU संसाधनों का उपयोग करने का प्रयास कर रहा है।

{{< note >}}
CPU उपयोग 1.0 से नीचे होने का एक और संभावित कारण यह है कि Node में पर्याप्त
CPU संसाधन उपलब्ध नहीं हो सकते हैं। याद रखें कि इस अभ्यास के लिए आवश्यकताएं हैं कि आपके क्लस्टर में कम से कम 1 CPU उपलब्ध हो। यदि आपका कंटेनर ऐसे Node पर चलता है जिसमें केवल 1 CPU है, तो कंटेनर के लिए निर्दिष्ट CPU limit की परवाह किए बिना कंटेनर 1 CPU से अधिक का उपयोग नहीं कर सकता।
{{< /note >}}

## CPU इकाइयां

CPU संसाधन *CPU* इकाइयों में मापा जाता है। Kubernetes में एक CPU निम्नलिखित के बराबर है:

* 1 AWS vCPU
* 1 GCP Core
* 1 Azure vCore
* Hyperthreading वाले bare-metal Intel प्रोसेसर पर 1 Hyperthread

आंशिक मान अनुमत हैं। एक कंटेनर जो 0.5 CPU request करता है, उसे 1 CPU request करने वाले
कंटेनर की तुलना में आधा CPU गारंटीकृत है। आप milli को इंगित करने के लिए प्रत्यय m का उपयोग कर सकते हैं। उदाहरण के लिए
100m CPU, 100 milliCPU, और 0.1 CPU सभी समान हैं। 1m से बारीक परिशुद्धता की अनुमति नहीं है।

CPU हमेशा एक निरपेक्ष मात्रा के रूप में request किया जाता है, कभी भी सापेक्ष मात्रा के रूप में नहीं; 0.1
सिंगल-कोर, डुअल-कोर, या 48-कोर मशीन पर CPU की समान मात्रा है।

अपना Pod हटाएं:

```shell
kubectl delete pod cpu-demo --namespace=cpu-example
```

## ऐसा CPU request निर्दिष्ट करें जो आपके Nodes के लिए बहुत बड़ा है

CPU requests और limits Containers से जुड़े हैं, लेकिन Pod को CPU request
और limit वाला मानना उपयोगी है। Pod के लिए CPU request Pod में सभी
Containers के CPU requests का योग है। इसी तरह, Pod के लिए CPU limit
Pod में सभी Containers की CPU limits का योग है।

Pod शेड्यूलिंग requests पर आधारित है। एक Pod को Node पर चलने के लिए तभी शेड्यूल किया जाता है
जब Node में Pod CPU request को संतुष्ट करने के लिए पर्याप्त CPU संसाधन उपलब्ध हों।

इस अभ्यास में, आप एक Pod बनाते हैं जिसमें CPU request इतना बड़ा है कि यह आपके क्लस्टर
में किसी भी Node की क्षमता से अधिक है। यहाँ एक Pod के लिए कॉन्फ़िगरेशन फ़ाइल है
जिसमें एक Container है। Container 100 CPU request करता है, जो संभवतः आपके
क्लस्टर में किसी भी Node की क्षमता से अधिक होगा।

{{% code_sample file="pods/resource/cpu-request-limit-2.yaml" %}}

Pod बनाएं:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/cpu-request-limit-2.yaml --namespace=cpu-example
```

Pod की स्थिति देखें:

```shell
kubectl get pod cpu-demo-2 --namespace=cpu-example
```

आउटपुट दिखाता है कि Pod की स्थिति Pending है। यानी, Pod को किसी भी Node पर
चलने के लिए शेड्यूल नहीं किया गया है, और यह अनिश्चित काल तक Pending स्थिति में रहेगा:


```
NAME         READY     STATUS    RESTARTS   AGE
cpu-demo-2   0/1       Pending   0          7m
```

Pod के बारे में विस्तृत जानकारी देखें, जिसमें events शामिल हैं:


```shell
kubectl describe pod cpu-demo-2 --namespace=cpu-example
```

आउटपुट दिखाता है कि Nodes पर अपर्याप्त CPU संसाधनों के कारण
Container को शेड्यूल नहीं किया जा सकता:


```
Events:
  Reason                        Message
  ------                        -------
  FailedScheduling      No nodes are available that match all of the following predicates:: Insufficient cpu (3).
```

अपना Pod हटाएं:

```shell
kubectl delete pod cpu-demo-2 --namespace=cpu-example
```

## यदि आप CPU limit निर्दिष्ट नहीं करते हैं

यदि आप Container के लिए CPU limit निर्दिष्ट नहीं करते हैं, तो इनमें से एक स्थिति लागू होती है:

* Container द्वारा उपयोग किए जा सकने वाले CPU संसाधनों पर कोई ऊपरी सीमा नहीं है। Container
जिस Node पर चल रहा है, वहां उपलब्ध सभी CPU संसाधनों का उपयोग कर सकता है।

* Container ऐसे namespace में चल रहा है जिसमें डिफ़ॉल्ट CPU limit है, और
Container को स्वचालित रूप से डिफ़ॉल्ट limit असाइन की जाती है। क्लस्टर प्रशासक
CPU limit के लिए डिफ़ॉल्ट मान निर्दिष्ट करने के लिए
[LimitRange](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#limitrange-v1-core/)
का उपयोग कर सकते हैं।

## यदि आप CPU limit निर्दिष्ट करते हैं लेकिन CPU request निर्दिष्ट नहीं करते हैं

यदि आप Container के लिए CPU limit निर्दिष्ट करते हैं लेकिन CPU request निर्दिष्ट नहीं करते हैं, तो Kubernetes स्वचालित रूप से
एक CPU request असाइन करता है जो limit से मेल खाता है। इसी तरह, यदि Container अपनी memory limit निर्दिष्ट करता है,
लेकिन memory request निर्दिष्ट नहीं करता है, तो Kubernetes स्वचालित रूप से एक memory request असाइन करता है जो
limit से मेल खाता है।

## CPU requests और limits के लिए प्रेरणा

अपने क्लस्टर में चलने वाले Containers के CPU requests और limits को कॉन्फ़िगर करके,
आप अपने क्लस्टर Nodes पर उपलब्ध CPU संसाधनों का कुशल उपयोग कर सकते हैं।
Pod CPU request को कम रखकर, आप Pod को शेड्यूल होने का अच्छा मौका देते हैं।
CPU request से अधिक CPU limit रखने से, आप दो चीजें हासिल करते हैं:

* Pod में गतिविधि के विस्फोट हो सकते हैं जहां यह CPU संसाधनों का उपयोग करता है जो उपलब्ध होते हैं।
* विस्फोट के दौरान Pod द्वारा उपयोग किए जा सकने वाले CPU संसाधनों की मात्रा कुछ उचित मात्रा तक सीमित है।

## साफ़ करें

अपना namespace हटाएं:

```shell
kubectl delete namespace cpu-example
```



## {{% heading "whatsnext" %}}



### ऐप डेवलपर्स के लिए

* [कंटेनर और पॉड को मेमोरी संसाधन आवंटित करें](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [पॉड-स्तरीय CPU और मेमोरी संसाधन आवंटित करें](/docs/tasks/configure-pod-container/assign-pod-level-resources/)

* [पॉड के लिए सेवा की गुणवत्ता कॉन्फ़िगर करें](/docs/tasks/configure-pod-container/quality-service-pod/)

* [कंटेनर को आवंटित CPU और मेमोरी संसाधनों का आकार बदलें](/docs/tasks/configure-pod-container/resize-container-resources/)

* [पॉड-स्तरीय CPU और मेमोरी संसाधनों का आकार बदलें](/docs/tasks/configure-pod-container/resize-pod-resources/)

### क्लस्टर प्रशासकों के लिए

* [नेमस्पेस के लिए डिफ़ॉल्ट मेमोरी Requests और Limits कॉन्फ़िगर करें](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [नेमस्पेस के लिए डिफ़ॉल्ट CPU Requests और Limits कॉन्फ़िगर करें](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [नेमस्पेस के लिए न्यूनतम और अधिकतम मेमोरी बाधाएं कॉन्फ़िगर करें](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [नेमस्पेस के लिए न्यूनतम और अधिकतम CPU बाधाएं कॉन्फ़िगर करें](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [नेमस्पेस के लिए मेमोरी और CPU कोटा कॉन्फ़िगर करें](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)

* [नेमस्पेस के लिए Pod कोटा कॉन्फ़िगर करें](/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

* [API ऑब्जेक्ट्स के लिए कोटा कॉन्फ़िगर करें](/docs/tasks/administer-cluster/quota-api-object/)

* [कंटेनर को आवंटित CPU और मेमोरी संसाधनों का आकार बदलें](/docs/tasks/configure-pod-container/resize-container-resources/)
