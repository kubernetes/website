---
title: रनटाइम क्लास
content_type: concept
weight: 30
hide_summary: true # Listed separately in section index
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

यह पृष्ठ RuntimeClass संसाधन और रनटाइम चयन तंत्र का वर्णन करता है।

RuntimeClass कंटेनर रनटाइम कॉन्फ़िगरेशन का चयन करने के लिए एक सुविधा है। कंटेनर रनटाइम कॉन्फ़िगरेशन का उपयोग पॉड के कंटेनरों को चलाने के लिए किया जाता है।

<!-- body -->

## प्रेरणा

आप प्रदर्शन बनाम सुरक्षा का संतुलन प्रदान करने के लिए विभिन्न पॉड के बीच एक अलग RuntimeClass सेट कर सकते हैं। उदाहरण के लिए, यदि आपके कार्यभार का हिस्सा उच्च स्तर की सूचना सुरक्षा आश्वासन का हकदार है, तो आप उन पॉड को शेड्यूल करना चुन सकते हैं
ताकि वे हार्डवेयर वर्चुअलाइजेशन का उपयोग करने वाले कंटेनर रनटाइम में चलें। फिर आप कुछ अतिरिक्त ओवरहेड की कीमत पर वैकल्पिक रनटाइम के अतिरिक्त अलगाव से लाभान्वित होंगे।

आप समान कंटेनर रनटाइम के साथ लेकिन अलग-अलग सेटिंग्स के साथ अलग-अलग पॉड चलाने के लिए RuntimeClass का उपयोग भी कर सकते हैं।

## सेटअप

1. नोड्स पर CRI कार्यान्वयन कॉन्फ़िगर करें (रनटाइम पर निर्भर)

2. संबंधित RuntimeClass संसाधन बनाएँ

### 1. नोड्स पर CRI कार्यान्वयन कॉन्फ़िगर करें

RuntimeClass के माध्यम से उपलब्ध कॉन्फ़िगरेशन कंटेनर रनटाइम इंटरफ़ेस (CRI) कार्यान्वयन पर निर्भर हैं। कॉन्फ़िगर करने के तरीके के लिए अपने CRI कार्यान्वयन के लिए संबंधित दस्तावेज़ ([नीचे](#cri-configuration)) देखें।

{{< note >}}
RuntimeClass डिफ़ॉल्ट रूप से क्लस्टर में एक समरूप नोड कॉन्फ़िगरेशन मानता है (जिसका अर्थ है कि कंटेनर रनटाइम के संबंध में सभी नोड्स समान तरीके से कॉन्फ़िगर किए गए हैं)। विषम नोड कॉन्फ़िगरेशन का समर्थन करने के लिए, नीचे [शेड्यूलिंग](#scheduling) देखें।
{{< /note >}}

कॉन्फ़िगरेशन में एक संबंधित `हैंडलर` नाम होता है, जिसे RuntimeClass द्वारा संदर्भित किया जाता है। हैंडलर एक वैध [DNS लेबल नाम](/docs/concepts/overview/working-with-objects/names/#dns-label-names) होना चाहिए।

### 2. संगत RuntimeClass संसाधन बनाएँ

चरण 1 में सेटअप किए गए कॉन्फ़िगरेशन में से प्रत्येक में एक संबद्ध `हैंडलर` नाम होना चाहिए, जो कॉन्फ़िगरेशन की पहचान करता है। प्रत्येक हैंडलर के लिए, एक संगत RuntimeClass ऑब्जेक्ट बनाएँ।

RuntimeClass संसाधन में वर्तमान में केवल 2 महत्वपूर्ण फ़ील्ड हैं: RuntimeClass नाम (`metadata.name`) और हैंडलर (`handler`)। ऑब्जेक्ट परिभाषा इस तरह दिखती है:

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

RuntimeClass ऑब्जेक्ट का नाम एक मान्य [DNS सबडोमेन नाम](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names) होना चाहिए।

{{< note  >}}
यह अनुशंसा की जाती है कि RuntimeClass लेखन संचालन (create/update/patch/delete) क्लस्टर व्यवस्थापक तक सीमित रहें। यह आमतौर पर डिफ़ॉल्ट होता है। अधिक जानकारी के लिए [प्राधिकरण अवलोकन](/docs/reference/access-authn-authz/authorization/) देखें।
{{< /note >}}

## उपयोग

क्लस्टर के लिए RuntimeClasses कॉन्फ़िगर किए जाने के बाद, आप इसका उपयोग करने के लिए पॉड स्पेक में `runtimeClassName` निर्दिष्ट कर सकते हैं। उदाहरण के लिए:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  runtimeClassName: myclass
  # ...
```

यह क्यूबलेट को इस पॉड को चलाने के लिए नामित RuntimeClass का उपयोग करने का निर्देश देगा। यदि नामित RuntimeClass मौजूद नहीं है, या CRI संबंधित हैंडलर को नहीं चला सकता है, तो पॉड
`विफल` टर्मिनल [phase](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase) में प्रवेश करेगा। त्रुटि संदेश के लिए संबंधित [event](/docs/tasks/debug/debug-application/debug-running-pod/) देखें।

यदि कोई `runtimeClassName` निर्दिष्ट नहीं है, तो डिफ़ॉल्ट RuntimeHandler का उपयोग किया जाएगा, जो RuntimeClass सुविधा अक्षम होने पर व्यवहार के बराबर है।

### CRI कॉन्फ़िगरेशन

CRI रनटाइम सेट अप करने के बारे में अधिक जानकारी के लिए, [CRI इंस्टॉलेशन](/docs/setup/production-environment/container-runtimes/) देखें।

#### {{< glossary_tooltip term_id="containerd" >}}

रनटाइम हैंडलर `/etc/containerd/config.toml` पर containerd के कॉन्फ़िगरेशन के माध्यम से कॉन्फ़िगर किए जाते हैं। मान्य हैंडलर रनटाइम अनुभाग के अंतर्गत कॉन्फ़िगर किए जाते हैं:

```
[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.${HANDLER_NAME}]
```

अधिक जानकारी के लिए containerd का [कॉन्फ़िगरेशन दस्तावेज़](https://github.com/containerd/containerd/blob/main/docs/cri/config.md) देखें:

#### {{< glossary_tooltip term_id="cri-o" >}}

रनटाइम हैंडलर `/etc/crio/crio.conf` पर CRI-O के कॉन्फ़िगरेशन के माध्यम से कॉन्फ़िगर किए जाते हैं। [crio.runtime टेबल](https://github.com/cri-o/cri-o/blob/master/docs/crio.conf.5.md#crioruntime-table) के अंतर्गत मान्य हैंडलर इस प्रकार कॉन्फ़िगर किए जाते हैं:

```
[crio.runtime.runtimes.${HANDLER_NAME}]
runtime_path = "${PATH_TO_BINARY}"
```

अधिक जानकारी के लिए CRI-O का [कॉन्फ़िगरेशन दस्तावेज़](https://github.com/cri-o/cri-o/blob/master/docs/crio.conf.5.md) देखें।

## शेड्यूलिंग

{{< feature-state for_k8s_version="v1.16" state="beta" >}}

RuntimeClass के लिए `scheduling` फ़ील्ड निर्दिष्ट करके, आप यह सुनिश्चित करने के लिए प्रतिबंध सेट कर सकते हैं कि इस RuntimeClass के साथ चलने वाले पॉड्स को उन नोड्स पर शेड्यूल किया जाए जो इसका समर्थन करते हैं। यदि `शेड्यूलिंग` सेट नहीं है, तो यह RuntimeClass सभी नोड्स द्वारा समर्थित माना जाता है।

यह सुनिश्चित करने के लिए कि पॉड किसी विशिष्ट RuntimeClass का समर्थन करने वाले नोड्स पर लैंड करें, नोड्स के उस सेट में एक सामान्य लेबल होना चाहिए जिसे फिर `runtimeclass.scheduling.nodeSelector` फ़ील्ड द्वारा चुना जाता है। RuntimeClass के nodeSelector को एडमिशन में पॉड के nodeSelector के साथ मर्ज किया जाता है, प्रभावी रूप से प्रत्येक पॉड द्वारा चुने गए नोड्स के सेट के इंटरसेक्शन को लेते हुए। यदि कोई संघर्ष होता है, तो पॉड को अस्वीकार कर दिया जाएगा।

यदि समर्थित नोड्स अन्य RuntimeClass पॉड को नोड पर चलने से रोकने के लिए टेंटेड हैं, तो आप RuntimeClass में `tolerations` जोड़ सकते हैं। `nodeSelector` की तरह, टोलेराशंस को एडमिशन में पॉड की टोलेराशंस के साथ मर्ज किया जाता है, प्रभावी रूप से प्रत्येक पॉड द्वारा सहन किए गए नोड्स के सेट का संघ लेते हुए।

नोड चयनकर्ता और सहनशीलता को कॉन्फ़िगर करने के बारे में अधिक जानने के लिए, [नोड्स को पॉड्स असाइन करना](/docs/concepts/scheduling-eviction/assign-pod-node/) देखें।

### पॉड ओवरहेड

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

आप _ओवरहेड_ संसाधन निर्दिष्ट कर सकते हैं जो पॉड चलाने से जुड़े हैं। ओवरहेड घोषित करने से क्लस्टर (शेड्यूलर सहित) को पॉड्स और संसाधनों के बारे में निर्णय लेते समय इसका हिसाब रखने की अनुमति मिलती है।

पॉड ओवरहेड को `ओवरहेड` फ़ील्ड के माध्यम से RuntimeClass में परिभाषित किया गया है। इस फ़ील्ड के उपयोग के माध्यम से, आप इस RuntimeClass का उपयोग करके चलने वाले पॉड्स के ओवरहेड को निर्दिष्ट कर सकते हैं और सुनिश्चित कर सकते हैं कि Kubernetes में इन ओवरहेड का हिसाब रखा गया है।

## {{% heading "whatsnext" %}}

- [रनटाइमक्लास डिज़ाइन](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/585-runtime-class/README.md)
- [रनटाइमक्लास शेड्यूलिंग डिज़ाइन](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/585-runtime-class/README.md#runtimeclass-scheduling)
- [पॉड ओवरहेड](/docs/concepts/scheduling-eviction/pod-overhead/) अवधारणा के बारे में पढ़ें
- [पॉडओवरहेड फ़ीचर डिज़ाइन](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/688-pod-overhead)

