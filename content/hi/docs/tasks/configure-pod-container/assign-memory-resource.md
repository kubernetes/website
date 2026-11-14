---
title: कंटेनरों और पॉड्स को मेमोरी रिसोर्स असाइन करें
content_type: task
weight: 10
---

<!-- overview -->

यह पृष्ठ दिखाता है कि किसी कंटेनर को मेमोरी *रिक्वेस्ट* और मेमोरी *लिमिट* कैसे असाइन
करें। एक कंटेनर को उतनी मेमोरी मिलने की गारंटी होती है जितनी वह रिक्वेस्ट करता है,
लेकिन उसे अपनी लिमिट से अधिक मेमोरी उपयोग करने की अनुमति नहीं होती है।




## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

आपके क्लस्टर के प्रत्येक नोड में कम से कम 300 MiB मेमोरी होनी चाहिए।

इस पृष्ठ के कुछ चरणों के लिए आवश्यक है कि आप अपने क्लस्टर में
[metrics-server](https://github.com/kubernetes-sigs/metrics-server)
सर्विस चलाएं। यदि आपके पास metrics-server पहले से
चल रहा है, तो आप उन चरणों को छोड़ सकते हैं।

यदि आप Minikube चला रहे हैं, तो metrics-server को सक्षम करने के लिए
निम्नलिखित कमांड चलाएं:

```shell
minikube addons enable metrics-server
```

यह देखने के लिए कि metrics-server चल रहा है, या रिसोर्स मेट्रिक्स API (`metrics.k8s.io`) का
कोई अन्य प्रदाता चल रहा है, निम्नलिखित कमांड चलाएं:

```shell
kubectl get apiservices
```

यदि रिसोर्स मेट्रिक्स API उपलब्ध है, तो आउटपुट में
`metrics.k8s.io` का संदर्भ शामिल होता है।

```shell
NAME
v1beta1.metrics.k8s.io
```



<!-- steps -->

## नेमस्पेस बनाएं {#create-a-namespace}

एक नेमस्पेस बनाएं ताकि इस अभ्यास में आपके द्वारा बनाए गए रिसोर्स
आपके बाकी क्लस्टर से अलग रहें।

```shell
kubectl create namespace mem-example
```

## मेमोरी रिक्वेस्ट और मेमोरी लिमिट निर्दिष्ट करें {#specify-a-memory-request-and-a-memory-limit}

किसी कंटेनर के लिए मेमोरी रिक्वेस्ट निर्दिष्ट करने के लिए, कंटेनर के रिसोर्स मैनिफेस्ट में `resources.requests.memory` फील्ड
शामिल करें। मेमोरी लिमिट निर्दिष्ट करने के लिए, `resources.limits.memory` शामिल करें।

इस अभ्यास में, आप एक पॉड बनाते हैं जिसमें एक कंटेनर है। कंटेनर के लिए 100 MiB की मेमोरी
रिक्वेस्ट और 200 MiB की मेमोरी लिमिट है। यहाँ पॉड के लिए कॉन्फ़िगरेशन
फाइल है:

{{% code_sample file="pods/resource/memory-request-limit.yaml" options="hl_lines=10-14" %}}

कॉन्फ़िगरेशन फाइल में `args` सेक्शन कंटेनर के शुरू होने पर उसके लिए आर्ग्युमेंट्स प्रदान करता है।
`"--vm-bytes", "150M"` आर्ग्युमेंट्स कंटेनर को 150 MiB मेमोरी आवंटित करने का प्रयास करने का निर्देश देते हैं।

पॉड बनाएं:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/memory-request-limit.yaml --namespace=mem-example
```

सत्यापित करें कि पॉड का कंटेनर चल रहा है:

```shell
kubectl get pod memory-demo --namespace=mem-example
```

पॉड के बारे में विस्तृत जानकारी देखें:

```shell
kubectl get pod memory-demo --output=yaml --namespace=mem-example
```

आउटपुट दिखाता है कि पॉड में मौजूद एक कंटेनर की मेमोरी रिक्वेस्ट 100 MiB
और मेमोरी लिमिट 200 MiB है।


```yaml
...
resources:
  requests:
    memory: 100Mi
  limits:
    memory: 200Mi
...
```

पॉड के मेट्रिक्स प्राप्त करने के लिए `kubectl top` चलाएं:

```shell
kubectl top pod memory-demo --namespace=mem-example
```

आउटपुट दिखाता है कि पॉड लगभग 162,900,000 बाइट्स मेमोरी उपयोग कर रहा है, जो
लगभग 150 MiB है। यह पॉड की 100 MiB रिक्वेस्ट से अधिक है, लेकिन पॉड की
200 MiB लिमिट के भीतर है।

```
NAME                        CPU(cores)   MEMORY(bytes)
memory-demo                 <something>  162856960
```

अपना पॉड हटाएं:

```shell
kubectl delete pod memory-demo --namespace=mem-example
```

## कंटेनर की मेमोरी लिमिट से अधिक उपयोग करना {#exceed-a-containers-memory-limit}

यदि नोड पर मेमोरी उपलब्ध है तो एक कंटेनर अपनी मेमोरी रिक्वेस्ट से अधिक उपयोग कर सकता है। लेकिन एक कंटेनर
को अपनी मेमोरी लिमिट से अधिक उपयोग करने की अनुमति नहीं होती है। यदि कोई कंटेनर अपनी लिमिट से अधिक मेमोरी
आवंटित करता है, तो वह कंटेनर टर्मिनेशन के लिए उम्मीदवार बन जाता है। यदि कंटेनर अपनी लिमिट से अधिक
मेमोरी की खपत जारी रखता है, तो कंटेनर को टर्मिनेट कर दिया जाता है। यदि टर्मिनेट किया गया कंटेनर पुनः
आरंभ किया जा सकता है, तो kubelet उसे पुनः आरंभ करता है, जैसा कि किसी अन्य प्रकार की रनटाइम विफलता के साथ होता है।

इस अभ्यास में, आप एक ऐसा पॉड बनाते हैं जो अपनी लिमिट से अधिक मेमोरी आवंटित करने का प्रयास करता है।
यहाँ एक ऐसे पॉड के लिए कॉन्फ़िगरेशन फाइल है जिसमें एक कंटेनर है जिसकी
मेमोरी रिक्वेस्ट 50 MiB और मेमोरी लिमिट 100 MiB है:

{{% code_sample file="pods/resource/memory-request-limit-2.yaml" options="hl_lines=10-14" %}}

कॉन्फ़िगरेशन फाइल के `args` सेक्शन में, आप देख सकते हैं कि कंटेनर
250 MiB मेमोरी आवंटित करने का प्रयास करेगा, जो 100 MiB लिमिट से काफी अधिक है।

पॉड बनाएं:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/memory-request-limit-2.yaml --namespace=mem-example
```

पॉड के बारे में विस्तृत जानकारी देखें:

```shell
kubectl get pod memory-demo-2 --namespace=mem-example
```

इस समय, कंटेनर चल रहा हो सकता है या टर्मिनेट (kill) किया जा चुका हो सकता है। पिछली कमांड को तब तक दोहराएं जब तक कंटेनर टर्मिनेट न हो जाए:

```shell
NAME            READY     STATUS      RESTARTS   AGE
memory-demo-2   0/1       OOMKilled   1          24s
```

कंटेनर स्टेटस का अधिक विस्तृत विवरण प्राप्त करें:

```shell
kubectl get pod memory-demo-2 --output=yaml --namespace=mem-example
```

आउटपुट दिखाता है कि कंटेनर को टर्मिनेट (kill) कर दिया गया क्योंकि उसकी मेमोरी समाप्त हो गई (OOM):

```yaml
lastState:
   terminated:
     containerID: 65183c1877aaec2e8427bc95609cc52677a454b56fcb24340dbd22917c23b10f
     exitCode: 137
     finishedAt: 2017-06-20T20:52:19Z
     reason: OOMKilled
     startedAt: null
```

इस अभ्यास में कंटेनर पुनः आरंभ किया जा सकता है, इसलिए kubelet उसे पुनः आरंभ करता है। यह देखने के लिए
कि कंटेनर बार-बार टर्मिनेट और पुनः आरंभ होता है, इस कमांड को कई बार दोहराएं:

```shell
kubectl get pod memory-demo-2 --namespace=mem-example
```

आउटपुट दिखाता है कि कंटेनर टर्मिनेट होता है, पुनः आरंभ होता है, फिर से टर्मिनेट होता है, फिर से पुनः आरंभ होता है, और इसी तरह चलता रहता है:

```
kubectl get pod memory-demo-2 --namespace=mem-example
NAME            READY     STATUS      RESTARTS   AGE
memory-demo-2   0/1       OOMKilled   1          37s
```
```

kubectl get pod memory-demo-2 --namespace=mem-example
NAME            READY     STATUS    RESTARTS   AGE
memory-demo-2   1/1       Running   2          40s
```

पॉड के इतिहास के बारे में विस्तृत जानकारी देखें:

```
kubectl describe pod memory-demo-2 --namespace=mem-example
```

आउटपुट दिखाता है कि कंटेनर बार-बार शुरू होता है और विफल होता है:

```
... Normal  Created   Created container with id 66a3a20aa7980e61be4922780bf9d24d1a1d8b7395c09861225b0eba1b1f8511
... Warning BackOff   Back-off restarting failed container
```

अपने क्लस्टर के नोड्स के बारे में विस्तृत जानकारी देखें:

```
kubectl describe nodes
```

आउटपुट में आउट-ऑफ-मेमोरी स्थिति के कारण कंटेनर के टर्मिनेट होने का रिकॉर्ड शामिल होता है:

```
Warning OOMKilling Memory cgroup out of memory: Kill process 4481 (stress) score 1994 or sacrifice child
```

अपना पॉड हटाएं:

```shell
kubectl delete pod memory-demo-2 --namespace=mem-example
```

## अपने नोड्स के लिए बहुत बड़ी मेमोरी रिक्वेस्ट निर्दिष्ट करना {#specify-a-memory-request-that-is-too-big-for-your-nodes}

मेमोरी रिक्वेस्ट और लिमिट कंटेनरों से जुड़ी होती हैं, लेकिन पॉड को भी मेमोरी रिक्वेस्ट
और लिमिट वाला मानना उपयोगी है। पॉड की मेमोरी रिक्वेस्ट पॉड के सभी कंटेनरों की
मेमोरी रिक्वेस्ट का योग होती है। इसी तरह, पॉड की मेमोरी लिमिट पॉड के
सभी कंटेनरों की लिमिट का योग होती है।

पॉड की शेड्यूलिंग, रिक्वेस्ट पर आधारित होती है। एक पॉड किसी नोड पर चलने के लिए तभी शेड्यूल किया जाता है
जब नोड के पास पॉड की मेमोरी रिक्वेस्ट को पूरा करने के लिए पर्याप्त उपलब्ध मेमोरी हो।

इस अभ्यास में, आप एक ऐसा पॉड बनाते हैं जिसकी मेमोरी रिक्वेस्ट इतनी बड़ी है कि वह आपके
क्लस्टर के किसी भी नोड की क्षमता से अधिक है। यहाँ एक ऐसे पॉड के लिए कॉन्फ़िगरेशन फाइल है जिसमें
एक कंटेनर है जो 1000 GiB मेमोरी की रिक्वेस्ट करता है, जो संभवतः आपके क्लस्टर के किसी भी
नोड की क्षमता से अधिक है।

{{% code_sample file="pods/resource/memory-request-limit-3.yaml" options="hl_lines=10-14" %}}

पॉड बनाएं:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/memory-request-limit-3.yaml --namespace=mem-example
```

पॉड का स्टेटस देखें:

```shell
kubectl get pod memory-demo-3 --namespace=mem-example
```

आउटपुट दिखाता है कि पॉड का स्टेटस PENDING है। अर्थात, पॉड किसी भी नोड पर चलने के लिए शेड्यूल नहीं किया गया है, और यह अनिश्चित काल तक PENDING स्थिति में रहेगा:

```
kubectl get pod memory-demo-3 --namespace=mem-example
NAME            READY     STATUS    RESTARTS   AGE
memory-demo-3   0/1       Pending   0          25s
```

इवेंट्स सहित, पॉड के बारे में विस्तृत जानकारी देखें:

```shell
kubectl describe pod memory-demo-3 --namespace=mem-example
```

आउटपुट दिखाता है कि नोड्स पर अपर्याप्त मेमोरी के कारण कंटेनर शेड्यूल नहीं किया जा सकता:

```
Events:
  ...  Reason            Message
       ------            -------
  ...  FailedScheduling  No nodes are available that match all of the following predicates:: Insufficient memory (3).
```

## मेमोरी इकाइयाँ {#memory-units}

मेमोरी रिसोर्स को बाइट्स में मापा जाता है। आप मेमोरी को एक सादे पूर्णांक या एक फिक्स्ड-पॉइंट
पूर्णांक के रूप में इनमें से किसी एक प्रत्यय के साथ व्यक्त कर सकते हैं: E, P, T, G, M, K, Ei, Pi, Ti, Gi, Mi, Ki.
उदाहरण के लिए, निम्नलिखित लगभग समान मान दर्शाते हैं:

```
128974848, 129e6, 129M, 123Mi
```

अपना पॉड हटाएं:

```shell
kubectl delete pod memory-demo-3 --namespace=mem-example
```

## यदि आप मेमोरी लिमिट निर्दिष्ट नहीं करते हैं {#if-you-do-not-specify-a-memory-limit}

यदि आप किसी कंटेनर के लिए मेमोरी लिमिट निर्दिष्ट नहीं करते हैं, तो निम्नलिखित स्थितियों में से एक लागू होती है:

* कंटेनर द्वारा उपयोग की जाने वाली मेमोरी की मात्रा पर कोई ऊपरी सीमा नहीं होती है। कंटेनर
उस नोड पर उपलब्ध सारी मेमोरी उपयोग कर सकता है जहाँ वह चल रहा है, जो बदले में OOM Killer को सक्रिय कर सकता है। इसके अलावा, OOM Kill की स्थिति में, बिना रिसोर्स लिमिट वाले कंटेनर के टर्मिनेट होने की संभावना अधिक होती है।

* कंटेनर एक ऐसे नेमस्पेस में चल रहा है जिसमें एक डिफ़ॉल्ट मेमोरी लिमिट है, और
कंटेनर को स्वचालित रूप से डिफ़ॉल्ट लिमिट असाइन कर दी जाती है। क्लस्टर एडमिनिस्ट्रेटर
[LimitRange](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#limitrange-v1-core)
का उपयोग करके मेमोरी लिमिट के लिए एक डिफ़ॉल्ट मान निर्दिष्ट कर सकते हैं।

## मेमोरी रिक्वेस्ट और लिमिट के लिए प्रेरणा {#motivation-for-memory-requests-and-limits}

अपने क्लस्टर में चलने वाले कंटेनरों के लिए मेमोरी रिक्वेस्ट और लिमिट कॉन्फ़िगर करके,
आप अपने क्लस्टर के नोड्स पर उपलब्ध मेमोरी रिसोर्स का कुशल उपयोग कर सकते हैं। पॉड की
मेमोरी रिक्वेस्ट कम रखकर, आप पॉड को शेड्यूल होने का अच्छा अवसर देते हैं। मेमोरी रिक्वेस्ट से
अधिक मेमोरी लिमिट रखकर, आप दो चीजें हासिल करते हैं:

* पॉड में गतिविधि के ऐसे दौर (बर्स्ट) आ सकते हैं जिनमें वह उपलब्ध मेमोरी का उपयोग कर सके।
* बर्स्ट के दौरान पॉड द्वारा उपयोग की जा सकने वाली मेमोरी की मात्रा एक उचित मात्रा तक सीमित रहती है।

## साफ़ करें {#clean-up}

अपना नेमस्पेस हटाएं। यह उन सभी पॉड्स को हटा देता है जो आपने इस कार्य के लिए बनाए थे:

```shell
kubectl delete namespace mem-example
```



## {{% heading "whatsnext" %}}


### ऐप डेवलपर्स के लिए {#for-app-developers}

* [कंटेनरों और पॉड्स को CPU रिसोर्स असाइन करें](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [पॉड-स्तर के CPU और मेमोरी रिसोर्स असाइन करें](/docs/tasks/configure-pod-container/assign-pod-level-resources/)

* [पॉड्स के लिए क्वालिटी ऑफ़ सर्विस कॉन्फ़िगर करें](/docs/tasks/configure-pod-container/quality-service-pod/)

* [कंटेनरों को असाइन किए गए CPU और मेमोरी रिसोर्स का आकार बदलें](/docs/tasks/configure-pod-container/resize-container-resources/)

### क्लस्टर एडमिनिस्ट्रेटर्स के लिए {#for-cluster-administrators}

* [नेमस्पेस के लिए डिफ़ॉल्ट मेमोरी रिक्वेस्ट और लिमिट कॉन्फ़िगर करें](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [नेमस्पेस के लिए डिफ़ॉल्ट CPU रिक्वेस्ट और लिमिट कॉन्फ़िगर करें](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [नेमस्पेस के लिए न्यूनतम और अधिकतम मेमोरी प्रतिबंध कॉन्फ़िगर करें](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [नेमस्पेस के लिए न्यूनतम और अधिकतम CPU प्रतिबंध कॉन्फ़िगर करें](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [नेमस्पेस के लिए मेमोरी और CPU कोटा कॉन्फ़िगर करें](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)

* [नेमस्पेस के लिए पॉड कोटा कॉन्फ़िगर करें](/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

* [API ऑब्जेक्ट्स के लिए कोटा कॉन्फ़िगर करें](/docs/tasks/administer-cluster/quota-api-object/)

* [कंटेनरों को असाइन किए गए CPU और मेमोरी रिसोर्स का आकार बदलें](/docs/tasks/configure-pod-container/resize-container-resources/)
