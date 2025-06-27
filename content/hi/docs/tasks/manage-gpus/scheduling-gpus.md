---
reviewers:
- vishh
content_type: concept
title: GPU शेड्यूल करना
description: क्लस्टर में नोड्स द्वारा संसाधन के रूप में उपयोग के लिए GPU को कॉन्फ़िगर और शेड्यूल करें।
---

<!-- overview -->

{{< feature-state state="stable" for_k8s_version="v1.26" >}}

कुबेरनेट्स में आपके क्लस्टर के विभिन्न नोड्स पर AMD और NVIDIA GPU (ग्राफिकल प्रोसेसिंग यूनिट्स) को प्रबंधित करने के लिए **स्थिर** समर्थन शामिल है, जो {{< glossary_tooltip text="डिवाइस प्लगइन" term_id="device-plugin" >}} का उपयोग करता है।

यह पेज बताता है कि उपयोगकर्ता GPU का उपयोग कैसे कर सकते हैं, और कार्यान्वयन में कुछ सीमाओं को रेखांकित करता है।

<!-- body -->

## डिवाइस प्लगइन का उपयोग करना

कुबेरनेट्स पॉड्स को GPU जैसी विशेष हार्डवेयर सुविधाओं तक पहुंच प्रदान करने के लिए डिवाइस प्लगइन का उपयोग करता है।

{{% thirdparty-content %}}

एक व्यवस्थापक के रूप में, आपको नोड्स पर संबंधित हार्डवेयर विक्रेता से GPU ड्राइवर स्थापित करने होंगे और GPU विक्रेता से संबंधित डिवाइस प्लगइन चलाना होगा। यहाँ विक्रेताओं के निर्देशों के कुछ लिंक दिए गए हैं:

* [AMD](https://github.com/ROCm/k8s-device-plugin#deployment)
* [Intel](https://intel.github.io/intel-device-plugins-for-kubernetes/cmd/gpu_plugin/README.html)
* [NVIDIA](https://github.com/NVIDIA/k8s-device-plugin#quick-start)

एक बार जब आप प्लगइन स्थापित कर लेते हैं, तो आपका क्लस्टर एक कस्टम शेड्यूल योग्य संसाधन जैसे `amd.com/gpu` या `nvidia.com/gpu` को एक्सपोज करता है।

आप अपने कंटेनर से इन GPU का उपयोग कस्टम GPU संसाधन का अनुरोध करके कर सकते हैं, उसी तरह जैसे आप `cpu` या `memory` का अनुरोध करते हैं।
हालांकि, कस्टम डिवाइस के लिए संसाधन आवश्यकताओं को निर्दिष्ट करने में कुछ सीमाएं हैं।

GPU को केवल `limits` सेक्शन में निर्दिष्ट किया जाना चाहिए, जिसका मतलब है:
* आप `requests` को निर्दिष्ट किए बिना GPU `limits` निर्दिष्ट कर सकते हैं, क्योंकि
  Kubernetes डिफ़ॉल्ट रूप से अनुरोध मान के रूप में सीमा का उपयोग करेगा।
* आप `limits` और `requests` दोनों में GPU निर्दिष्ट कर सकते हैं लेकिन इन दो मानों को
  बराबर होना चाहिए।
* आप `limits` को निर्दिष्ट किए बिना GPU `requests` निर्दिष्ट नहीं कर सकते।

यहाँ एक GPU का अनुरोध करने वाले पॉड के लिए एक उदाहरण मैनिफेस्ट दिया गया है:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: example-vector-add
spec:
  restartPolicy: OnFailure
  containers:
    - name: example-vector-add
      image: "registry.example/example-vector-add:v42"
      resources:
        limits:
          gpu-vendor.example/example-gpu: 1 # 1 GPU का अनुरोध
```

## विभिन्न प्रकार के GPU वाले क्लस्टर का प्रबंधन

यदि आपके क्लस्टर में विभिन्न नोड्स पर विभिन्न प्रकार के GPU हैं, तो आप
[नोड लेबल और नोड सेलेक्टर](/docs/tasks/configure-pod-container/assign-pods-nodes/)
का उपयोग पॉड्स को उपयुक्त नोड्स पर शेड्यूल करने के लिए कर सकते हैं।

उदाहरण के लिए:

```shell
# अपने नोड्स को उनके एक्सेलरेटर प्रकार के साथ लेबल करें।
kubectl label nodes node1 accelerator=example-gpu-x100
kubectl label nodes node2 accelerator=other-gpu-k915
```

वह लेबल कुंजी `accelerator` केवल एक उदाहरण है; यदि आप चाहें तो एक अलग लेबल कुंजी का उपयोग कर सकते हैं।

## स्वचालित नोड लेबलिंग {#node-labeller}

एक व्यवस्थापक के रूप में, आप Kubernetes [नोड फीचर डिस्कवरी](https://github.com/kubernetes-sigs/node-feature-discovery) (NFD) को तैनात करके अपने सभी GPU सक्षम नोड्स को स्वचालित रूप से खोज और लेबल कर सकते हैं।
NFD एक Kubernetes क्लस्टर में प्रत्येक नोड पर उपलब्ध हार्डवेयर विशेषताओं का पता लगाता है।
आमतौर पर, NFD को उन विशेषताओं को नोड लेबल के रूप में विज्ञापित करने के लिए कॉन्फ़िगर किया जाता है, लेकिन NFD विस्तारित संसाधन, एनोटेशन और नोड टेंट्स भी जोड़ सकता है।
NFD Kubernetes के सभी [समर्थित संस्करणों](/releases/version-skew-policy/#supported-versions) के साथ संगत है।
डिफ़ॉल्ट रूप से NFD पता लगाए गए विशेषताओं के लिए [फीचर लेबल](https://kubernetes-sigs.github.io/node-feature-discovery/master/usage/features.html) बनाता है।
व्यवस्थापक विशिष्ट विशेषता वाले नोड्स को टेंट करने के लिए NFD का उपयोग कर सकते हैं, ताकि केवल उन विशेषताओं का अनुरोध करने वाले पॉड्स को उन नोड्स पर शेड्यूल किया जा सके।

आपको NFD के लिए एक प्लगइन की भी आवश्यकता होगी जो आपके नोड्स में उपयुक्त लेबल जोड़ता है; ये सामान्य
लेबल हो सकते हैं या वे विक्रेता विशिष्ट हो सकते हैं। आपका GPU विक्रेता NFD के लिए एक थर्ड पार्टी
प्लगइन प्रदान कर सकता है; अधिक जानकारी के लिए उनके दस्तावेज़ीकरण की जाँच करें।

{{< highlight yaml "linenos=false,hl_lines=7-18" >}}
apiVersion: v1
kind: Pod
metadata:
  name: example-vector-add
spec:
  restartPolicy: OnFailure
  # आप इस पॉड को एक ऐसे नोड पर शेड्यूल करने के लिए Kubernetes नोड एफिनिटी का उपयोग कर सकते हैं
  # जो उस प्रकार का GPU प्रदान करता है जिसकी इसके कंटेनर को काम करने के लिए आवश्यकता है
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: "gpu.gpu-vendor.example/installed-memory"
            operator: Gt # (से अधिक)
            values: ["40535"]
          - key: "feature.node.kubernetes.io/pci-10.present" # NFD फीचर लेबल
            values: ["true"] # (वैकल्पिक) केवल PCI डिवाइस 10 वाले नोड्स पर शेड्यूल करें
  containers:
    - name: example-vector-add
      image: "registry.example/example-vector-add:v42"
      resources:
        limits:
          gpu-vendor.example/example-gpu: 1 # 1 GPU का अनुरोध
{{< /highlight >}}

#### GPU विक्रेता कार्यान्वयन

- [Intel](https://intel.github.io/intel-device-plugins-for-kubernetes/cmd/gpu_plugin/README.html)
- [NVIDIA](https://github.com/NVIDIA/k8s-device-plugin) 