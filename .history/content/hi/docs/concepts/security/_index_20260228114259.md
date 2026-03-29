---
title: "सुरक्षा"
weight: 85
description: >
  अपने क्लाउड-नेटिव वर्कलोड को सुरक्षित रखने से संबंधित अवधारणाएँ।
simple_list: true
---

Kubernetes दस्तावेज़ के इस भाग का उद्देश्य आपको वर्कलोड को अधिक सुरक्षित
तरीके से चलाना और Kubernetes क्लस्टर को सुरक्षित रखने के आवश्यक पहलुओं को
समझने में सहायता करना है।

Kubernetes एक क्लाउड-नेटिव आर्किटेक्चर पर आधारित है और
{{< glossary_tooltip text="CNCF" term_id="cncf" >}} द्वारा सुझाई गई
क्लाउड-नेटिव सूचना सुरक्षा की सर्वोत्तम प्रथाओं का पालन करता है।

अपने क्लस्टर और उस पर चल रहे अनुप्रयोगों को सुरक्षित करने के व्यापक संदर्भ
को समझने के लिए
[Cloud Native Security and Kubernetes](/docs/concepts/security/cloud-native-security/)
पढ़ें।

## Kubernetes सुरक्षा तंत्र {#security-mechanisms}

Kubernetes कई APIs और सुरक्षा नियंत्रण प्रदान करता है, साथ ही
[policies](#policies) को परिभाषित करने के तरीके भी उपलब्ध कराता है,
जो सूचना सुरक्षा प्रबंधन का महत्वपूर्ण हिस्सा बन सकते हैं।

### कंट्रोल प्लेन सुरक्षा

किसी भी Kubernetes क्लस्टर के लिए एक महत्वपूर्ण सुरक्षा तंत्र है
[Kubernetes API तक पहुँच नियंत्रित करना](/docs/concepts/security/controlling-access)।

Kubernetes अपेक्षा करता है कि आप TLS कॉन्फ़िगर करें ताकि
[data encryption in transit](/docs/tasks/tls/managing-tls-in-a-cluster/)
कंट्रोल प्लेन के भीतर तथा कंट्रोल प्लेन और उसके क्लाइंट्स के बीच सुनिश्चित हो सके।

आप Kubernetes कंट्रोल प्लेन में संग्रहीत डेटा के लिए
[encryption at rest](/docs/tasks/administer-cluster/encrypt-data/)
भी सक्षम कर सकते हैं। यह आपके स्वयं के वर्कलोड डेटा के एन्क्रिप्शन से अलग है,
जिसे सक्षम करना भी एक अच्छा अभ्यास हो सकता है।

### Secrets

[Secret](/docs/concepts/configuration/secret/) API उन कॉन्फ़िगरेशन मानों के लिए
मूलभूत सुरक्षा प्रदान करता है जिन्हें गोपनीयता की आवश्यकता होती है।

### वर्कलोड सुरक्षा

[Pod security standards](/docs/concepts/security/pod-security-standards/)
को लागू करें ताकि Pods और उनके कंटेनर उचित रूप से अलग-थलग रहें।
यदि आवश्यकता हो तो आप कस्टम आइसोलेशन के लिए
[RuntimeClasses](/docs/concepts/containers/runtime-class) का उपयोग कर सकते हैं।

[Network policies](/docs/concepts/services-networking/network-policies/)
आपको Pods के बीच या Pods और क्लस्टर के बाहर नेटवर्क के बीच ट्रैफिक नियंत्रित
करने की सुविधा देती हैं।

आप व्यापक Kubernetes इकोसिस्टम से सुरक्षा नियंत्रण लागू कर सकते हैं
ताकि Pods, कंटेनरों और उनमें चल रही इमेजेज के लिए रोकथाम या निगरानी
आधारित सुरक्षा लागू की जा सके।

### Admission नियंत्रण {#admission-control}

[Admission controllers](/docs/reference/access-authn-authz/admission-controllers/)
ऐसे प्लगइन्स होते हैं जो Kubernetes API अनुरोधों को इंटरसेप्ट करते हैं
और अनुरोध के विशिष्ट फ़ील्ड के आधार पर उन्हें सत्यापित या संशोधित कर सकते हैं।

इन कंट्रोलर्स को सावधानीपूर्वक डिज़ाइन करने से Kubernetes संस्करण अपडेट के दौरान
अनपेक्षित समस्याओं से बचा जा सकता है।
डिज़ाइन संबंधित दिशानिर्देशों के लिए देखें:
[Admission Webhook Good Practices](/docs/concepts/cluster-administration/admission-webhooks-good-practices/)।

### ऑडिटिंग

Kubernetes
[audit logging](/docs/tasks/debug/debug-cluster/audit/)
एक सुरक्षा-संबंधित कालानुक्रमिक रिकॉर्ड प्रदान करता है,
जो क्लस्टर में होने वाली गतिविधियों के क्रम को दर्शाता है।

क्लस्टर उपयोगकर्ताओं, Kubernetes API का उपयोग करने वाले अनुप्रयोगों,
और स्वयं कंट्रोल प्लेन द्वारा उत्पन्न गतिविधियों का ऑडिट करता है।

## क्लाउड प्रदाता सुरक्षा

{{% thirdparty-content vendor="true" %}}

यदि आप Kubernetes क्लस्टर को अपने हार्डवेयर या किसी अन्य क्लाउड प्रदाता पर
चला रहे हैं, तो सुरक्षा सर्वोत्तम प्रथाओं के लिए उनके दस्तावेज़ देखें।

नीचे लोकप्रिय क्लाउड प्रदाताओं की सुरक्षा दस्तावेज़ लिंक दिए गए हैं:

{{< table caption="Cloud provider security" >}}

IaaS Provider        | Link |
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

## नीतियाँ (Policies)

आप Kubernetes-native तंत्रों का उपयोग करके सुरक्षा नीतियाँ परिभाषित कर सकते हैं,
जैसे कि
[NetworkPolicy](/docs/concepts/services-networking/network-policies/)
या
[ValidatingAdmissionPolicy](/docs/reference/access-authn-authz/validating-admission-policy/)।

हालाँकि, आप Kubernetes इकोसिस्टम में उपलब्ध अन्य नीति कार्यान्वयन पर भी
निर्भर रह सकते हैं। Kubernetes एक्सटेंशन तंत्र प्रदान करता है जिससे बाहरी
प्रोजेक्ट्स सोर्स कोड समीक्षा, कंटेनर इमेज अनुमोदन, API एक्सेस नियंत्रण,
नेटवर्किंग और अन्य क्षेत्रों में अपनी नीति नियंत्रण लागू कर सकते हैं।

अधिक जानकारी के लिए पढ़ें:
[Policies](/docs/concepts/policy/)।

## {{% heading "whatsnext" %}}

संबंधित Kubernetes सुरक्षा विषयों के बारे में जानें:

* [Securing your cluster](/docs/tasks/administer-cluster/securing-a-cluster/)
* Kubernetes की [Known vulnerabilities](/docs/reference/issues-security/official-cve-feed/)
* कंट्रोल प्लेन के लिए [Data encryption in transit](/docs/tasks/tls/managing-tls-in-a-cluster/)
* [Data encryption at rest](/docs/tasks/administer-cluster/encrypt-data/)
* [Controlling Access to the Kubernetes API](/docs/concepts/security/controlling-access)
* Pods के लिए [Network policies](/docs/concepts/services-networking/network-policies/)
* Kubernetes में [Secrets](/docs/concepts/configuration/secret/)
* [Pod security standards](/docs/concepts/security/pod-security-standards/)
* [RuntimeClasses](/docs/concepts/containers/runtime-class)

संदर्भ समझें:

* [Cloud Native Security and Kubernetes](/docs/concepts/security/cloud-native-security/)

प्रमाणन प्राप्त करें:

* [Certified Kubernetes Security Specialist](https://training.linuxfoundation.org/certification/certified-kubernetes-security-specialist/)
  प्रमाणन और आधिकारिक प्रशिक्षण कोर्स।

इस अनुभाग में और पढ़ें: