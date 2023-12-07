---
title: Runtime Class
content_type: concept
weight: 30
hide_summary: true # Listed separately in section index
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

यह पृष्ठ RuntimeClass संसाधन और रनटाइम चयन तंत्र का वर्णन करता है।

RuntimeClass एक विशेषता है जो कंटेनर रनटाइम कॉन्फ़िगरेशन का चयन करने के लिए उपयोग की जाती है।
कंटेनर रनटाइम कॉन्फ़िगरेशन Pod के containers को चलाने के लिए उपयोग किया जाता है।

<!-- body -->

## प्रेरणा

आप भिन्न Pods के बीच अलग RuntimeClass सेट कर सकते हैं ताकि प्रदर्शन बनाम सुरक्षा का संतुलन प्रदान कर सकें। उदाहरण के लिए, यदि आपके workload का एक हिस्सा जानकारी सुरक्षा आश्वासन के उच्च स्तर के पात्र हैं, तो आप उन Pods को शेड्यूल करना चाहेंगे ताकि वे हार्डवेयर वर्चुअलाइजेशन का उपयोग करने वाले कंटेनर रनटाइम में चलें। इससे आप विकल्प रनटाइम के अतिरिक्त अलगाव के लाभ से लाभान्वित होंगे, लेकिन कुछ अतिरिक्त ओवरहेड के खर्च में।

आप RuntimeClass का उपयोग उन समान कंटेनर रनटाइम के साथ भिन्न सेटिंग के साथ भी कर सकते हैं।


## सेटअप

1. नोडों पर CRI अंमलन कॉन्फ़िगर करें (रनटाइम आधारित)
2. संबंधित रनटाइम क्लास संसाधन बनाएँ

### 1. नोडों पर CRI अंमलन कॉन्फ़िगर करें

RuntimeClass के माध्यम से उपलब्ध कॉन्‍फ़िगरेशन Container Runtime Interface (CRI) अंमलन निर्भर होते हैं।
कृपया कॉन्फ़िगर करने के लिए अपने CRI अंमलन के लिए संबंधित दस्तावेज़ीकरण देखें ([नीचे](#cri-configuration))।

{{< note >}}
डिफ़ॉल्ट रूप से, रनटाइम क्लास हॉमोजेनस नोड कॉन्फ़िगरेशन का अनुमान लगाता है (जिसका अर्थ है कि सभी नोड कंटेनर रनटाइम के संबंध में एक जैसे कॉन्फ़िगर किए जाते हैं)। हेटरोजेनस नोड कॉन्फ़िगरेशन का समर्थन करने के लिए, [Scheduling](#scheduling) देखें।
{{< /note >}}

कॉन्फ़िगरेशन में हर एक `handler` नाम होता है जिसे RuntimeClass द्वारा संदर्भित किया जाता है।
हैंडलर [DNS label name](/docs/concepts/overview/working-with-objects/names/#dns-label-names) का एक वैध नाम होना चाहिए।


### 2. "संबंधित रनटाइम कक्षा संसाधन बनाएँ।"

चरण 1 में विन्यास सेटअप में प्रत्येक का एक संबद्ध `handler` नाम होना चाहिए, जो विन्यास को पहचानता है। प्रत्येक हैंडलर के लिए,
एक संबंधित रनटाइम कक्षा ऑब्जेक्ट बनाएँ।

वर्तमान में, RuntimeClass संसाधन में केवल 2 महत्वपूर्ण फ़ील्ड होते हैं: RuntimeClass नाम (`metadata.name`) और handler
(`handler`)। ऑब्जेक्ट परिभाषा इस तरह दिखती है:


```yaml
# RuntimeClass is defined in the node.k8s.io API group
apiVersion: node.k8s.io/v1
kind: RuntimeClass
metadata:
  # The name the RuntimeClass will be referenced by.
  # RuntimeClass is a non-namespaced resource.
  name: myclass 
# The name of the corresponding CRI configuration
handler: myconfiguration 
```

एक RuntimeClass ऑब्जेक्ट का नाम एक मान्य [DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names) सबडोमेन नाम होना चाहिए।

{{< note >}}
रनटाइम कक्षा लिखने ऑपरेशन (create/update/patch/delete) को क्लस्टर व्यवस्थापक तक सीमित करना सुझाव दिया जाता है। यह
आमतौर पर डिफ़ॉल्ट होता है। अधिक विवरण के लिए, [Authorization Overview](/docs/reference/access-authn-authz/authorization/) देखें।
{{< /note >}}

## उपयोग

एक बार जब रनटाइम कक्षाएँ क्लस्टर के लिए विन्यासित हों, आप इसे उपयोग करने के लिए Pod स्पेक में `runtimeClassName` निर्दिष्ट
कर सकते हैं। उदाहरण के लिए:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  runtimeClassName: myclass
  # ...
```

यह इस पॉड को चलाने के लिए नामित RuntimeClass का उपयोग करने के लिए कुबलेट को निर्देशित करेगा। यदि नामित RuntimeClass
मौजूद नहीं है, या CRI में संबंधित handler नहीं चला सकता है, तो पॉड `Failed` हो जाएगा टर्मिनल [phase](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase) में आ जाएगा। एक त्रुटि संदेश के लिए
एक संबंधित घटना [event](/docs/tasks/debug/debug-application/debug-running-pod/) खोजें।

यदि `runtimeClassName` निर्दिष्ट नहीं किया गया है, तो डिफ़ॉल्ट RuntimeHandler का उपयोग किया जाएगा, जो
RuntimeClass सुविधा अक्षम होने पर कृत्रिम व्यवहार के समान होता है।

### CRI विन्यास


CRI रनटाइम को सेटअप करने के अधिक विवरणों के लिए, [CRI installation](/docs/setup/production-environment/container-runtimes/) देखें।

#### {{< glossary_tooltip term_id="containerd" >}}

टॉमेल पर `/etc/containerd/config.toml` के माध्यम से containerd के माध्यम से रनटाइम हैंडलर को कॉन्फ़िगर
किया जाता है। वैध हैंडलर रनटाइम अनुभाग के तहत कॉन्फ़िगर किए जाते हैं:

```
[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.${HANDLER_NAME}]
```

अधिक विवरणों के लिए containerd के [config documentation](https://github.com/containerd/containerd/blob/main/docs/cri/config.md) देखें:


#### {{< glossary_tooltip term_id="cri-o" >}}

रनटाइम हैंडलर CRI-O की कॉन्फ़िगरेशन के माध्यम से `/etc/crio/crio.conf` पर कॉन्फ़िगर किए जाते हैं। वैध हैंडलर
निम्नलिखित तालिका के तहत कॉन्फ़िगर किए जाते हैं:
[crio.runtime table](https://github.com/cri-o/cri-o/blob/master/docs/crio.conf.5.md#crioruntime-table):

```
[crio.runtime.runtimes.${HANDLER_NAME}]
  runtime_path = "${PATH_TO_BINARY}"
```

अधिक विवरणों के लिए CRI-O की [config documentation](https://github.com/cri-o/cri-o/blob/master/docs/crio.conf.5.md) देखें।

## सचेंडुलिंग

{{< feature-state for_k8s_version="v1.16" state="beta" >}}

RuntimeClass के लिए `scheduling` फ़ील्ड को निर्दिष्ट करके, आप नियंत्रण सेट कर सकते हैं ताकि इस RuntimeClass के साथ चल
रहे पॉड को केवल उन नोड पर स्केड्यूल किया जाए जो इसे समर्थन करते हैं। यदि `scheduling` सेट नहीं किया गया है, तो सभी नोड इस RuntimeClass को समर्थित माने जाएंगे।

एक विशिष्ट RuntimeClass का समर्थन करने वाले नोडों पर पॉडों को लैंड कराने के लिए, उन नोडों का एक सेट एक सामान्य लेबल होना चाहिए, जिसे फिर
`runtimeclass.scheduling.nodeSelector` फ़ील्ड द्वारा चयनित किया जाता है। RuntimeClass का nodeSelector प्रवेश में पॉड के
nodeSelector से मर्ज किया जाता है, असरदार रूप से प्रत्येक द्वारा चयनित नोड सेट के अंतरवर्ती समानांतर होते हुए। यदि कोई विवाद होता है, तो पॉड को अस्वीकार कर दिया जाएगा।


यदि एक विशिष्ट RuntimeClass पर चलने वाले पॉडों को रोकने के लिए समर्थित नोड तट्ट करने के लिए `tainted` हैं, तो आप RuntimeClass में tolerations
जोड़ सकते हैं। `nodeSelector` की तरह, प्रवेश में tolerations पॉड की tolerations के साथ मर्ज किए जाते हैं, जिससे प्रभावी रूप से दोनों द्वारा संभव नोड सेट का संघ बनता है।

नोड सेलेक्टर और टॉलरेंस को कॉन्फ़िगर करने के बारे में अधिक जानने के लिए, देखें [पॉड को नोडों पर असाइन करना](/docs/concepts/scheduling-eviction/assign-pod-node/)।

### पोड ओवरहेड

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

आप पॉड चलाने से जुड़े ओवरहेड संसाधनों को निर्दिष्ट कर सकते हैं। ओवरहेड घोषणा करने से, क्लस्टर (स्केड्यूलर सहित) इसे ध्यान में रख सकता है जब वह पॉड और संसाधनों के बारे में निर्णय लेता है।

पॉड ओवरहेड `overhead` फ़ील्ड के माध्यम से RuntimeClass में परिभाषित किया जाता है। इस फ़ील्ड का उपयोग करके, आप इस RuntimeClass का उपयोग
करते हुए पॉड को चलाने के लिए ओवरहेड निर्दिष्ट कर सकते हैं और सुनिश्चित कर सकते हैं कि कुबेरनेट्स में इन उपरि का खाता रखा जाता है।


## {{% heading "whatsnext" %}}

- [RuntimeClass Design](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/585-runtime-class/README.md)
- [RuntimeClass Scheduling Design](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/585-runtime-class/README.md#runtimeclass-scheduling)
- [Pod Overhead](/docs/concepts/scheduling-eviction/pod-overhead/) अवधारणा के बारे में पढ़ें
- [PodOverhead Feature Design](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/688-pod-overhead)









