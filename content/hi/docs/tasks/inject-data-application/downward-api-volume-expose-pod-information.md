---
title: फ़ाइलों के माध्यम से कंटेनरों को पॉड जानकारी प्रकट करें
content_type: task
weight: 40
---

<!-- overview -->

यह पेज दिखाता है कि एक पॉड कैसे एक
[`downwardAPI` वॉल्यूम](/docs/concepts/storage/volumes/#downwardapi)
का उपयोग करके, अपने बारे में जानकारी उस पॉड में चल रहे कंटेनरों को प्रदान कर सकता है।
एक `downwardAPI` वॉल्यूम पॉड फ़ील्ड्स और कंटेनर फ़ील्ड्स को प्रकट कर सकता है।

कुबेरनेट्स में, किसी चल रहे कंटेनर को पॉड और कंटेनर फ़ील्ड्स प्रकट करने के दो तरीके हैं:

* [एनवायरनमेंट वेरिएबल्स](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)
* वॉल्यूम फ़ाइलें, जैसा कि इस कार्य में समझाया गया है

इन दोनों तरीकों को मिलाकर _डाउनवर्ड API_ कहा जाता है।

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}


<!-- steps -->

## पॉड फ़ील्ड संग्रहीत करें {#store-Pod-fields}

इस अभ्यास के इस भाग में, आप एक पॉड बनाते हैं जिसमें एक कंटेनर होता है, और आप पॉड-स्तर के फ़ील्ड्स को एक फ़ाइल के रूप में चल रहे कंटेनर में प्रोजेक्ट करते हैं।
यहाँ पॉड के लिए मैनिफ़ेस्ट है:

{{% code_sample file="pods/inject/dapi-volume.yaml" %}}

मैनिफ़ेस्ट में, आप देख सकते हैं कि पॉड में एक `downwardAPI` वॉल्यूम है,
और कंटेनर उस वॉल्यूम को `/etc/podinfo` पर माउंट करता है।

`downwardAPI` के अंतर्गत `items` ऐरे को देखें। इस ऐरे का प्रत्येक तत्व एक `downwardAPI` वॉल्यूम को परिभाषित करता है। पहला तत्व निर्दिष्ट करता है कि पॉड के `metadata.labels` फ़ील्ड का मान `labels` नाम की फ़ाइल में संग्रहीत किया जाना चाहिए। दूसरा तत्व निर्दिष्ट करता है कि पॉड के `annotations` फ़ील्ड का मान `annotations` नाम की फ़ाइल में संग्रहीत किया जाना चाहिए।

{{< note >}}
इस उदाहरण में फ़ील्ड पॉड फ़ील्ड्स हैं। ये पॉड में कंटेनर के फ़ील्ड्स नहीं हैं।
{{< /note >}}

पॉड बनाएँ:

```shell
kubectl apply -f https://k8s.io/examples/pods/inject/dapi-volume.yaml
```

सुनिश्चित करें कि पॉड में कंटेनर चल रहा है:

```shell
kubectl get pods
```

कंटेनर के लॉग देखें:

```shell
kubectl logs kubernetes-downwardapi-volume-example
```

आउटपुट में `labels` फ़ाइल और `annotations` फ़ाइल की सामग्री दिखाई देगी:

```
cluster="test-cluster1"
rack="rack-22"
zone="us-est-coast"

build="two"
builder="john-doe"
```

पॉड में चल रहे कंटेनर में एक शेल प्राप्त करें:

```shell
kubectl exec -it kubernetes-downwardapi-volume-example -- sh
```

अपने शेल में, `labels` फ़ाइल देखें:

```shell
/# cat /etc/podinfo/labels
```

आउटपुट दिखाता है कि सभी पॉड के लेबल `labels` फ़ाइल में लिखे गए हैं:

```shell
cluster="test-cluster1"
rack="rack-22"
zone="us-est-coast"
```

इसी तरह, `annotations` फ़ाइल देखें:

```shell
/# cat /etc/podinfo/annotations
```

`/etc/podinfo` डायरेक्टरी में फ़ाइलें देखें:

```shell
/# ls -laR /etc/podinfo
```

आउटपुट में, आप देख सकते हैं कि `labels` और `annotations` फ़ाइलें एक अस्थायी सबडायरेक्टरी में हैं: इस उदाहरण में,
`..2982_06_02_21_47_53.299460680`। `/etc/podinfo` डायरेक्टरी में, `..data` एक सिम्बोलिक लिंक है जो उस अस्थायी सबडायरेक्टरी की ओर इशारा करता है।
साथ ही `/etc/podinfo` डायरेक्टरी में `labels` और `annotations` भी सिम्बोलिक लिंक्‍स हैं।

```
drwxr-xr-x  ... Feb 6 21:47 ..2982_06_02_21_47_53.299460680
lrwxrwxrwx  ... Feb 6 21:47 ..data -> ..2982_06_02_21_47_53.299460680
lrwxrwxrwx  ... Feb 6 21:47 annotations -> ..data/annotations
lrwxrwxrwx  ... Feb 6 21:47 labels -> ..data/labels

/etc/..2982_06_02_21_47_53.299460680:
total 8
-rw-r--r--  ... Feb  6 21:47 annotations
-rw-r--r--  ... Feb  6 21:47 labels
```

सिम्बोलिक लिंक्‍स का उपयोग मेटाडेटा का डायनामिक और एटॉमिक रीफ्रेश सक्षम करता है;  
अपडेट्स एक नई अस्थायी डायरेक्टरी में लिखे जाते हैं, और `..data` सिम्बोलिक लिंक को  
[rename(2)](http://man7.org/linux/man-pages/man2/rename.2.html) का उपयोग करके एटॉमिक रूप से अपडेट किया जाता है।

{{< note >}}
यदि कोई कंटेनर डाउनवर्ड API को
[सबपाथ](/docs/concepts/storage/volumes/#using-subpath) वॉल्यूम माउंट के रूप में उपयोग कर रहा है,
तो उसे डाउनवर्ड API अपडेट प्राप्त नहीं होंगे।
{{< /note >}}

शेल से बाहर निकलें:

```shell
/# exit
```

## कंटेनर फ़ील्ड्स को संग्रहित करें {#Store-container-fields}

पिछले अभ्यास में, आपने डाउनवर्ड API का उपयोग करके पॉड-स्तर के फ़ील्ड्स को एक्सेस किया था।  
अब इस अगले अभ्यास में, आप ऐसे फ़ील्ड्स पास करने जा रहे हैं जो पॉड परिभाषा का हिस्सा होते हैं,  
लेकिन वे पूरे पॉड के बजाय किसी विशेष [कंटेनर](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container) से लिए जाते हैं। नीचे एक पॉड का मैनिफ़ेस्ट है जिसमें फिर से सिर्फ एक कंटेनर है:

{{% code_sample file="pods/inject/dapi-volume-resources.yaml" %}}

मैनिफ़ेस्ट में, आप देख सकते हैं कि इस पॉड में एक  
[`downwardAPI` वॉल्यूम](/docs/concepts/storage/volumes/#downwardapi) है,  
और उस पॉड में जो एकमात्र कंटेनर है वह उस वॉल्यूम को `/etc/podinfo` पर माउंट करता है।

`downwardAPI` के अंतर्गत `items` ऐरे को देखें। इस ऐरे का प्रत्येक एलिमेंट
डाउनवर्ड API वॉल्यूम में एक फ़ाइल को परिभाषित करता है।

पहला एलिमेंट निर्दिष्ट करता है कि `client-container` नामक कंटेनर में,  
`limits.cpu` फ़ील्ड का मान, जो `1m` स्वरूप में है,  
`cpu_limit` नाम की फ़ाइल के रूप में प्रकाशित किया जाना चाहिए।  
`divisor` फ़ील्ड वैकल्पिक है और इसका डिफ़ॉल्ट मान `1` है।  
`cpu` संसाधनों के लिए डिवाइज़र 1 का अर्थ है कोर,  
और `memory` संसाधनों के लिए इसका अर्थ है बाइट्स।

पॉड बनाएँ:

```shell
kubectl apply -f https://k8s.io/examples/pods/inject/dapi-volume-resources.yaml
```

अपने पॉड में चल रहे कंटेनर में एक शेल प्राप्त करें:

```shell
kubectl exec -it kubernetes-downwardapi-volume-example-2 -- sh
```

अपने शेल में, `cpu_limit` फ़ाइल देखें:

```shell
cat /etc/podinfo/cpu_limit
```

आप समान कमांड का उपयोग करके `cpu_request`, `mem_limit`, और
`mem_request` फ़ाइलों को भी देख सकते हैं।

<!-- discussion -->

## कुंजियों को विशिष्ट पथों और फ़ाइल अनुमतियों पर प्रोजेक्ट करें {#project-keys-to-specific-paths-and-file-permissions}

आप प्रत्येक फ़ाइल के आधार पर कुंजियों को विशिष्ट पथों और विशिष्ट अनुमतियों के साथ प्रोजेक्ट कर सकते हैं।
अधिक जानकारी के लिए देखें:[सीक्रेट](/docs/concepts/configuration/secret/)।


## {{% heading "whatsnext" %}}


* [`spec`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodSpec) 
API परिभाषा पढ़ें जो पॉड को परिभाषित करती है। इसमें कंटेनर की परिभाषा भी शामिल है (जो पॉड का हिस्सा है)।
* उन उपलब्ध फ़ील्ड्स की सूची पढ़ें [अवेलेबल फील्ड्स](/docs/concepts/workloads/pods/downward-api/#available-fields), जिन्हें आप डाउनवर्ड API का उपयोग करके एक्सपोज़ कर सकते हैं।

पुरानी API संदर्भ में वॉल्यूम्स के बारे में पढ़ें: 
* [Volume](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#volume-v1-core)
API परिभाषा देखें जो पॉड में कंटेनरों द्वारा एक्सेस किए जाने वाले सामान्य वॉल्यूम को परिभाषित करती है।

* [DownwardAPIVolumeSource](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#downwardapivolumesource-v1-core)
API परिभाषा देखें जो डाउनवर्ड API जानकारी वाले वॉल्यूम को परिभाषित करती है।

* [DownwardAPIVolumeFile](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#downwardapivolumefile-v1-core)
API परिभाषा देखें जो फ़ाइलों को आबाद करने के लिए ऑब्जेक्ट या रिसोर्स फ़ील्ड्स का संदर्भ रखती है।

* [ResourceFieldSelector](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#resourcefieldselector-v1-core)
API परिभाषा देखें जो कंटेनर संसाधनों और उनके आउटपुट फ़ॉर्मेट को निर्दिष्ट करती है।

