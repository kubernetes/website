---
title: "सुरक्षा"
weight: 85
description: >
  अपने क्लाउड-नेटिव वर्कलोड को सुरक्षित रखने की अवधारणाएँ।
simple_list: true
---


यह Kubernetes दस्तावेज़ीकरण अनुभाग आपको वर्कलोड को अधिक सुरक्षित तरीके से
चलाने और Kubernetes क्लस्टर को सुरक्षित रखने के आवश्यक पहलुओं के बारे में
सीखने में मदद करता है।

Kubernetes एक क्लाउड-नेटिव आर्किटेक्चर पर आधारित है और क्लाउड नेटिव
सूचना सुरक्षा के लिए अच्छे अभ्यास के बारे में
{{< glossary_tooltip text="CNCF" term_id="cncf" >}} की सलाह का उपयोग करता है।

अपने क्लस्टर और उस पर चलाए जा रहे एप्लिकेशन को सुरक्षित करने के व्यापक
संदर्भ के लिए [Cloud Native Security and Kubernetes](/docs/concepts/security/cloud-native-security/)
पढ़ें।

## Kubernetes सुरक्षा तंत्र {#security-mechanisms}

Kubernetes में कई API और सुरक्षा नियंत्रण शामिल हैं, साथ ही
[नीतियाँ](#policies) परिभाषित करने के तरीके भी हैं जो सूचना सुरक्षा
प्रबंधन का हिस्सा बन सकते हैं।

### कंट्रोल प्लेन सुरक्षा

किसी भी Kubernetes क्लस्टर के लिए एक प्रमुख सुरक्षा तंत्र
[Kubernetes API तक पहुँच को नियंत्रित करना](/docs/concepts/security/controlling-access) है।
कुबेरनेट्स आपसे अपेक्षा करता है कि आप कंट्रोल प्लेन के भीतर और कंट्रोल प्लेन एवं उसके क्लाइंट्स के बीच [ट्रांजिट में डेटा एन्क्रिप्शन](/docs/tasks/tls/managing-tls-in-a-cluster/)  प्रदान करने के लिए TLS को कॉन्फ़िगर और उपयोग करें। आप कुबेरनेट्स कंट्रोल प्लेन के भीतर संग्रहीत डेटा के लिए [एट-रेस्ट एन्क्रिप्शन](/docs/tasks/administer-cluster/encrypt-data/)  भी सक्षम कर सकते हैं; यह आपके अपने वर्कलोड के डेटा के लिए एट-रेस्ट एन्क्रिप्शन का उपयोग करने से अलग है, जो कि एक अच्छा विचार हो सकता है।

### सीक्रेट्स

[Secret](/docs/concepts/configuration/secret/) API उन कॉन्फ़िगरेशन मानों के
लिए बुनियादी सुरक्षा प्रदान करता है जिन्हें गोपनीयता की आवश्यकता होती है।

### वर्कलोड सुरक्षा

[Pod security standards](/docs/concepts/security/pod-security-standards/) लागू
करें ताकि यह सुनिश्चित हो सके कि Pods और उनके कंटेनर उचित रूप से अलग हैं।
यदि आवश्यक हो तो आप कस्टम अलगाव परिभाषित करने के लिए
[RuntimeClasses](/docs/concepts/containers/runtime-class) का भी उपयोग कर सकते हैं।

[नेटवर्क नीतियाँ](/docs/concepts/services-networking/network-policies/) आपको {{< glossary_tooltip text="पॉड्स" term_id="pod" >}}
के बीच, या {{< glossary_tooltip text="पॉड्स" term_id="pod" >}} और आपके क्लस्टर के बाहर के नेटवर्क के बीच नेटवर्क ट्रैफिक को नियंत्रित करने देती हैं।


आप {{< glossary_tooltip text="पॉड्स" term_id="pod" >}}, उनके
{{< glossary_tooltip text="कंटेनरों" term_id="container" >}} और उनमें चलने वाली छवियों (images) के आसपास निवारक या खोजी नियंत्रण लागू करने के लिए व्यापक इकोसिस्टम से सुरक्षा नियंत्रण तैनात कर सकते हैं।

### एडमिशन कंट्रोल {#admission-control}

[Admission controllers](/docs/reference/access-authn-authz/admission-controllers/)
ऐसे प्लगइन हैं जो Kubernetes API अनुरोधों को इंटरसेप्ट करते हैं और अनुरोध में
विशिष्ट फ़ील्ड के आधार पर अनुरोधों को मान्य या परिवर्तित कर सकते हैं।
इन नियंत्रकों को विचारपूर्वक डिज़ाइन करने से Kubernetes APIs के संस्करण
अपडेट में बदलने पर अनपेक्षित व्यवधानों से बचने में मदद मिलती है।
डिज़ाइन संबंधी विचारों के लिए,
[Admission Webhook Good Practices](/docs/concepts/cluster-administration/admission-webhooks-good-practices/)
देखें।

### ऑडिटिंग

Kubernetes [audit logging](/docs/tasks/debug/debug-cluster/audit/) एक
सुरक्षा-प्रासंगिक, कालानुक्रमिक रिकॉर्ड सेट प्रदान करता है जो क्लस्टर में
कार्यों के अनुक्रम को दस्तावेज़ीकरण करता है। क्लस्टर उपयोगकर्ताओं द्वारा,
Kubernetes API का उपयोग करने वाले एप्लिकेशन द्वारा, और कंट्रोल प्लेन द्वारा
उत्पन्न गतिविधियों का ऑडिट करता है।

## क्लाउड प्रदाता सुरक्षा
{{% thirdparty-content vendor="true" %}}

यदि आप अपने हार्डवेयर या किसी भिन्न क्लाउड प्रदाता पर Kubernetes क्लस्टर
चला रहे हैं, तो सुरक्षा सर्वोत्तम प्रथाओं के लिए अपने दस्तावेज़ीकरण से
परामर्श करें। नीचे कुछ लोकप्रिय क्लाउड प्रदाताओं के सुरक्षा दस्तावेज़ीकरण
के लिंक दिए गए हैं:


{{< table caption="क्लाउड प्रदाता सुरक्षा" >}}

IaaS प्रदाता        | लिंक |
-------------------- | ------------ |
Alibaba Cloud | https://www.alibabacloud.com/trust-center |
Amazon Web Services | https://aws.amazon.com/security |
Google Cloud Platform | https://cloud.google.com/security |
Huawei Cloud | https://www.huaweicloud.com/intl/en-us/securecenter/overallsafety |
IBM Cloud | https://www.ibm.com/cloud/security |
Microsoft Azure | https://docs.microsoft.com/en-us/azure/security/azure-security |
Oracle Cloud Infrastructure | https://www.oracle.com/security |
Tencent Cloud | https://www.tencentcloud.com/solutions/data-security-and-information-protection |
VMware vSphere | https://www.vmware.com/solutions/security/hardening-guides |
{{< /table >}}


## नीतियाँ

आप Kubernetes-नेटिव तंत्रों का उपयोग करके सुरक्षा नीतियाँ परिभाषित कर
सकते हैं, जैसे [NetworkPolicy](/docs/concepts/services-networking/network-policies/)
(नेटवर्क पैकेट फ़िल्टरिंग पर घोषणात्मक नियंत्रण) या
[ValidatingAdmissionPolicy](/docs/reference/access-authn-authz/validating-admission-policy/)
(Kubernetes API का उपयोग करके कोई कौन से परिवर्तन कर सकता है इस पर
घोषणात्मक प्रतिबंध)।

हालाँकि, आप कुबेरनेट्स के आसपास के व्यापक इकोसिस्टम (ecosystem) से नीति कार्यान्वयन पर भी भरोसा कर सकते हैं। कुबेरनेट्स ऐसे एक्सटेंशन तंत्र प्रदान करता है जिससे वे इकोसिस्टम प्रोजेक्ट्स सोर्स कोड समीक्षा, {{< glossary_tooltip text="कंटेनर" term_id="container" >}} इमेज अनुमोदन, API एक्सेस कंट्रोल, नेटवर्किंग और बहुत कुछ पर अपने स्वयं के नीति नियंत्रण लागू कर सकें।

नीति तंत्रों और Kubernetes के बारे में अधिक जानकारी के लिए,
[Policies](/docs/concepts/policy/) पढ़ें।



संबंधित Kubernetes सुरक्षा विषयों के बारे में जानें:

* [अपने क्लस्टर को सुरक्षित करना](/docs/tasks/administer-cluster/securing-a-cluster/)
* [ज्ञात कमज़ोरियाँ](/docs/reference/issues-security/official-cve-feed/)
  (और आगे की जानकारी के लिंक)
* [ट्रांज़िट में डेटा एन्क्रिप्शन](/docs/tasks/tls/managing-tls-in-a-cluster/)कंट्रोल प्लेन के लिए 
* [रेस्ट में डेटा एन्क्रिप्शन](/docs/tasks/administer-cluster/encrypt-data/)
* [Kubernetes API तक पहुँच नियंत्रित करना](/docs/concepts/security/controlling-access)
* [पॉड्स के लिए नेटवर्क नीतियाँ](/docs/concepts/services-networking/network-policies/)
* [Kubernetes में सीक्रेट्स](/docs/concepts/configuration/secret/)
* [Pod security standards](/docs/concepts/security/pod-security-standards/)
* [RuntimeClasses](/docs/concepts/containers/runtime-class)

संदर्भ जानें:

<!-- if changing this, also edit the front matter of content/en/docs/concepts/security/cloud-native-security.md to match; check the no_list setting -->
* [क्लाउड नेटिव सुरक्षा और कुबेरनेट्स](/docs/concepts/security/cloud-native-security/)

प्रमाणित हों:

* [Certified Kubernetes Security Specialist](https://training.linuxfoundation.org/certification/certified-kubernetes-security-specialist/)
  प्रमाणन और आधिकारिक प्रशिक्षण पाठ्यक्रम।

इस अनुभाग में और पढ़ें:
