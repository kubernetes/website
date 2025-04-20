---
title: स्थिर कार्य असाइनमेंट के साथ समानांतर प्रसंस्करण के लिए अनुक्रमित जॉब
content_type: task
min-kubernetes-server-version: v1.21
weight: 30
---

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

<!-- overview -->


इस उदाहरण में, आप एक Kubernetes जॉब चलाएंगे जो कई समानांतर वर्कर प्रोसेस का उपयोग करता है।
प्रत्येक वर्कर अपने स्वयं के पॉड में चलने वाला एक अलग कंटेनर है। पॉड्स में एक _अनुक्रमणिका संख्या_ होती है जो कंट्रोल प्लेन स्वचालित रूप से सेट करता है, जो प्रत्येक पॉड को समग्र कार्य के किस भाग पर काम करना है यह पहचानने की अनुमति देता है।

पॉड अनुक्रमणिका {{< glossary_tooltip text="एनोटेशन" term_id="annotation" >}} `batch.kubernetes.io/job-completion-index` में इसके दशमलव मान का प्रतिनिधित्व करने वाली स्ट्रिंग के रूप में उपलब्ध है। कंटेनरीकृत कार्य प्रक्रिया को यह अनुक्रमणिका प्राप्त करने के लिए, आप [डाउनवर्ड API](/docs/concepts/workloads/pods/downward-api/) तंत्र का उपयोग करके एनोटेशन के मान को प्रकाशित कर सकते हैं।
सुविधा के लिए, कंट्रोल प्लेन स्वचालित रूप से डाउनवर्ड API को अनुक्रमणिका को `JOB_COMPLETION_INDEX` पर्यावरण चर में प्रकट करने के लिए सेट करता है।

यहाँ इस उदाहरण में चरणों का एक सिंहावलोकन है:

1. **अनुक्रमित पूर्णता का उपयोग करते हुए एक जॉब मैनिफेस्ट को परिभाषित करें**।
   डाउनवर्ड API आपको पॉड अनुक्रमणिका एनोटेशन को एक पर्यावरण चर या फ़ाइल के रूप में कंटेनर में पास करने की अनुमति देता है।
2. **उस मैनिफेस्ट के आधार पर एक `अनुक्रमित` जॉब शुरू करें**।

## {{% heading "prerequisites" %}}

आपको पहले से ही [Job](/docs/concepts/workloads/controllers/job/) के बुनियादी, गैर-समानांतर उपयोग से परिचित होना चाहिए।

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## एक दृष्टिकोण चुनें

वर्कर प्रोग्राम से कार्य आइटम तक पहुंचने के लिए, आपके पास कुछ विकल्प हैं:

1. `JOB_COMPLETION_INDEX` पर्यावरण चर पढ़ें। जॉब {{< glossary_tooltip text="कंट्रोलर" term_id="controller" >}} स्वचालित रूप से इस चर को पूर्णता अनुक्रमणिका वाले एनोटेशन से जोड़ता है।
1. पूर्णता अनुक्रमणिका वाली एक फ़ाइल पढ़ें।
1. यह मानते हुए कि आप प्रोग्राम को संशोधित नहीं कर सकते, आप इसे एक स्क्रिप्ट के साथ रैप कर सकते हैं जो ऊपर दी गई किसी भी विधि का उपयोग करके अनुक्रमणिका पढ़ती है और इसे कुछ ऐसे में परिवर्तित करती है जिसे प्रोग्राम इनपुट के रूप में उपयोग कर सकता है।

इस उदाहरण के लिए, कल्पना करें कि आपने विकल्प 3 चुना है और आप [rev](https://man7.org/linux/man-pages/man1/rev.1.html) उपयोगिता चलाना चाहते हैं। यह प्रोग्राम एक फ़ाइल को आर्गुमेंट के रूप में स्वीकार करता है और इसकी सामग्री को उल्टा करके प्रिंट करता है।

```shell
rev data.txt
```

आप [`busybox`](https://hub.docker.com/_/busybox) कंटेनर इमेज से `rev` टूल का उपयोग करेंगे।

चूंकि यह केवल एक उदाहरण है, प्रत्येक पॉड केवल एक छोटा सा काम करता है (एक छोटी स्ट्रिंग को उल्टा करना)। एक वास्तविक वर्कलोड में आप, उदाहरण के लिए, एक जॉब बना सकते हैं जो दृश्य डेटा के आधार पर 60 सेकंड का वीडियो बनाने के कार्य का प्रतिनिधित्व करता है।
वीडियो रेंडरिंग जॉब में प्रत्येक कार्य आइटम उस वीडियो क्लिप का एक विशेष फ्रेम रेंडर करना होगा। अनुक्रमित पूर्णता का मतलब होगा कि जॉब में प्रत्येक पॉड जानता है कि क्लिप की शुरुआत से फ्रेम की गिनती करके किस फ्रेम को रेंडर और प्रकाशित करना है।

## एक अनुक्रमित जॉब को परिभाषित करें

यहाँ एक नमूना जॉब मैनिफेस्ट है जो `अनुक्रमित` पूर्णता मोड का उपयोग करता है:

{{% code_sample language="yaml" file="application/job/indexed-job.yaml" %}}

उपरोक्त उदाहरण में, आप जॉब कंट्रोलर द्वारा सभी कंटेनर के लिए सेट किए गए बिल्ट-इन `JOB_COMPLETION_INDEX` पर्यावरण चर का उपयोग करते हैं। एक [इनिट कंटेनर](/docs/concepts/workloads/pods/init-containers/) अनुक्रमणिका को एक स्थिर मान में मैप करता है और इसे एक फ़ाइल में लिखता है जो [emptyDir वॉल्यूम](/docs/concepts/storage/volumes/#emptydir) के माध्यम से वर्कर चलाने वाले कंटेनर के साथ साझा की जाती है।
वैकल्पिक रूप से, आप [डाउनवर्ड API के माध्यम से अपना स्वयं का पर्यावरण चर परिभाषित कर सकते हैं](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/) कंटेनर में अनुक्रमणिका प्रकाशित करने के लिए। आप [ConfigMap से एक पर्यावरण चर या फ़ाइल के रूप में मानों की एक सूची लोड](/docs/tasks/configure-pod-container/configure-pod-configmap/) करना भी चुन सकते हैं।

वैकल्पिक रूप से, आप सीधे [डाउनवर्ड API का उपयोग कर सकते हैं एनोटेशन मान को एक वॉल्यूम फ़ाइल के रूप में पास करने के लिए](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/#store-pod-fields), जैसा कि निम्नलिखित उदाहरण में दिखाया गया है:

{{% code_sample language="yaml" file="application/job/indexed-job-vol.yaml" %}}

## जॉब चलाना

अब जॉब चलाएं:

```shell
# यह पहले दृष्टिकोण का उपयोग करता है ($JOB_COMPLETION_INDEX पर निर्भर)
kubectl apply -f https://kubernetes.io/examples/application/job/indexed-job.yaml
```

जब आप यह जॉब बनाते हैं, तो कंट्रोल प्लेन प्रत्येक अनुक्रमणिका के लिए एक पॉड की एक श्रृंखला बनाता है जो आपने निर्दिष्ट की है। `.spec.parallelism` का मान निर्धारित करता है कि एक साथ कितने चल सकते हैं जबकि `.spec.completions` निर्धारित करता है कि जॉब कुल कितने पॉड बनाता है।

चूंकि `.spec.parallelism` `.spec.completions` से कम है, कंट्रोल प्लेन उनमें से अधिक शुरू करने से पहले पहले कुछ पॉड के पूरा होने की प्रतीक्षा करता है।

आप जॉब के सफल होने की प्रतीक्षा कर सकते हैं, टाइमआउट के साथ:
```shell
# स्थिति नाम की जांच केस-असंवेदनशील है
kubectl wait --for=condition=complete --timeout=300s job/indexed-job
```

अब, जॉब का विवरण करें और जांचें कि यह सफल था।


```shell
kubectl describe jobs/indexed-job
```

आउटपुट इस तरह का होता है:

```
Name:              indexed-job
Namespace:         default
Selector:          controller-uid=bf865e04-0b67-483b-9a90-74cfc4c3e756
Labels:            controller-uid=bf865e04-0b67-483b-9a90-74cfc4c3e756
                   job-name=indexed-job
Annotations:       <none>
Parallelism:       3
Completions:       5
Start Time:        Thu, 11 Mar 2021 15:47:34 +0000
Pods Statuses:     2 Running / 3 Succeeded / 0 Failed
Completed Indexes: 0-2
Pod Template:
  Labels:  controller-uid=bf865e04-0b67-483b-9a90-74cfc4c3e756
           job-name=indexed-job
  Init Containers:
   input:
    Image:      docker.io/library/bash
    Port:       <none>
    Host Port:  <none>
    Command:
      bash
      -c
      items=(foo bar baz qux xyz)
      echo ${items[$JOB_COMPLETION_INDEX]} > /input/data.txt

    Environment:  <none>
    Mounts:
      /input from input (rw)
  Containers:
   worker:
    Image:      docker.io/library/busybox
    Port:       <none>
    Host Port:  <none>
    Command:
      rev
      /input/data.txt
    Environment:  <none>
    Mounts:
      /input from input (rw)
  Volumes:
   input:
    Type:       EmptyDir (a temporary directory that shares a pod's lifetime)
    Medium:
    SizeLimit:  <unset>
Events:
  Type    Reason            Age   From            Message
  ----    ------            ----  ----            -------
  Normal  SuccessfulCreate  4s    job-controller  Created pod: indexed-job-njkjj
  Normal  SuccessfulCreate  4s    job-controller  Created pod: indexed-job-9kd4h
  Normal  SuccessfulCreate  4s    job-controller  Created pod: indexed-job-qjwsz
  Normal  SuccessfulCreate  1s    job-controller  Created pod: indexed-job-fdhq5
  Normal  SuccessfulCreate  1s    job-controller  Created pod: indexed-job-ncslj
```

इस उदाहरण में, आप प्रत्येक अनुक्रमणिका के लिए कस्टम मानों के साथ जॉब चलाते हैं। आप
पॉड्स में से एक का आउटपुट निरीक्षण कर सकते हैं:

```shell
kubectl logs indexed-job-fdhq5 # इसे उस जॉब के एक पॉड के नाम से बदलें
```


आउटपुट इस तरह का होता है:

```
xuq
``` 