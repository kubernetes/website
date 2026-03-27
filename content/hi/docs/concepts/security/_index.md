---
title: "सुरक्षा"
weight: 85
description: >
  अपने क्लाउड-नेटिव वर्कलोड को सुरक्षित रखने की अवधारणाएं।
simple_list: true
---

कुबरनेट्स प्रलेखन का यह भाग आपको वर्कलोड को अधिक सुरक्षित तरीके से चलाने और कुबरनेट्स क्लस्टर को सुरक्षित रखने के आवश्यक पहलुओं के बारे में सीखने में मदद करता है।

कुबरनेट्स एक क्लाउड-नेटिव आर्किटेक्चर पर आधारित है, और {{< glossary_tooltip text="CNCF" term_id="cncf" >}} से क्लाउड नेटिव सूचना सुरक्षा के लिए सर्वोत्तम प्रथाओं के बारे में सलाह लेता है।

अपने क्लस्टर को सुरक्षित करने और अपने द्वारा चलाए जाने वाले अनुप्रयोगों के बारे में व्यापक संदर्भ के लिए [क्लाउड नेटिव सुरक्षा और कुबरनेट्स](/docs/concepts/security/cloud-native-security/) पढ़ें।

## कुबरनेट्स सुरक्षा तंत्र {#security-mechanisms}

कुबरनेट्स में कई API और सुरक्षा नियंत्रण शामिल हैं, साथ ही [नीतियों](#policies) को परिभाषित करने के तरीके हैं जो आपके सूचना सुरक्षा प्रबंधन का हिस्सा बन सकते हैं।

### नियंत्रण विमान संरक्षण

किसी भी कुबरनेट्स क्लस्टर के लिए एक मुख्य सुरक्षा तंत्र [कुबरनेट्स API तक पहुंच को नियंत्रित करना](/docs/concepts/security/controlling-access) है।

कुबरनेट्स की अपेक्षा है कि आप नियंत्रण विमान के भीतर [ट्रांजिट में डेटा एन्क्रिप्शन](/docs/tasks/tls/managing-tls-in-a-cluster/) प्रदान करने के लिए TLS को कॉन्फ़िगर और उपयोग करें, और नियंत्रण विमान और इसके क्लाइंट के बीच। आप कुबरनेट्स नियंत्रण विमान के भीतर संग्रहीत डेटा के लिए [आराम पर एन्क्रिप्शन](/docs/tasks/administer-cluster/encrypt-data/) भी सक्षम कर सकते हैं; यह आपके स्वयं के वर्कलोड के डेटा के लिए आराम पर एन्क्रिप्शन का उपयोग करने से अलग है, जो भी एक अच्छा विचार हो सकता है।

### राज़

[Secret](/docs/concepts/configuration/secret/) API गोपनीयता की आवश्यकता वाले कॉन्फ़िगरेशन मानों के लिए बुनियादी सुरक्षा प्रदान करता है।

### वर्कलोड संरक्षण

[Pod सुरक्षा मानकों](/docs/concepts/security/pod-security-standards/) को लागू करें ताकि Pods और उनके कंटेनर उचित रूप से अलग हों। यदि आपको इसकी आवश्यकता है तो आप कस्टम अलगाव को परिभाषित करने के लिए [RuntimeClasses](/docs/concepts/containers/runtime-class) का भी उपयोग कर सकते हैं।

[नेटवर्क नीतियां](/docs/concepts/services-networking/network-policies/) आपको Pods के बीच, या Pods और आपके क्लस्टर के बाहर के नेटवर्क के बीच नेटवर्क ट्रैफ़िक को नियंत्रित करने देती हैं।

आप Pods, उनके कंटेनर और उनमें चलने वाली छवियों के चारों ओर निवारक या जांच नियंत्रण लागू करने के लिए व्यापक पारिस्थितिकी तंत्र से सुरक्षा नियंत्रण तैनात कर सकते हैं।

### प्रवेश नियंत्रण {#admission-control}

[प्रवेश नियंत्रक](/docs/reference/access-authn-authz/admission-controllers/) प्लगइन हैं जो कुबरनेट्स API अनुरोधों को रोकते हैं और अनुरोध में विशेष फ़ील्ड के आधार पर अनुरोधों को मान्य या परिवर्तित कर सकते हैं। इन नियंत्रकों को सावधानीपूर्वक डिजाइन करने से कुबरनेट्स API संस्करण अपडेट के दौरान अनपेक्षित विघ्न से बचने में मदद मिलती है। डिजाइन विचारों के लिए, [प्रवेश Webhook सर्वोत्तम प्रथाएं](/docs/concepts/cluster-administration/admission-webhooks-good-practices/) देखें।

### ऑडिटिंग

कुबरनेट्स [ऑडिट लॉगिंग](/docs/tasks/debug/debug-cluster/audit/) सुरक्षा-प्रासंगिक, कालानुक्रमिक रिकॉर्ड का एक सेट प्रदान करता है जो एक क्लस्टर में कार्यों के अनुक्रम को दस्तावेज़ करता है। क्लस्टर उपयोगकर्ताओं द्वारा उत्पन्न गतिविधियों, कुबरनेट्स API का उपयोग करने वाले अनुप्रयोगों द्वारा और नियंत्रण विमान द्वारा स्वयं का ऑडिट करता है।

## क्लाउड प्रदाता सुरक्षा

{{% thirdparty-content vendor="true" %}}

यदि आप अपने स्वयं के हार्डवेयर या किसी भिन्न क्लाउड प्रदाता पर कुबरनेट्स क्लस्टर चला रहे हैं, तो सुरक्षा सर्वोत्तम प्रथाओं के लिए अपने दस्तावेज़ से परामर्श लें।
यहाँ कुछ लोकप्रिय क्लाउड प्रदाताओं के सुरक्षा दस्तावेज़ के लिंक दिए गए हैं:

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

## नीतियां

आप कुबरनेट्स-नेटिव तंत्र का उपयोग करके सुरक्षा नीतियों को परिभाषित कर सकते हैं,
जैसे [NetworkPolicy](/docs/concepts/services-networking/network-policies/)
(नेटवर्क पैकेट फ़िल्टरिंग पर घोषणात्मक नियंत्रण) या
[ValidatingAdmissionPolicy](/docs/reference/access-authn-authz/validating-admission-policy/) (घोषणात्मक प्रतिबंध कि कोई कुबरनेट्स API का उपयोग करके क्या परिवर्तन कर सकता है)।

हालांकि, आप कुबरनेट्स के चारों ओर व्यापक पारिस्थितिकी तंत्र से नीति कार्यान्वयन पर भी भरोसा कर सकते हैं। कुबरनेट्स एक्सटेंशन तंत्र प्रदान करता है ताकि वे पारिस्थितिकी तंत्र परियोजनाएं स्रोत कोड समीक्षा, कंटेनर छवि अनुमोदन, API पहुंच नियंत्रण, नेटवर्किंग और अधिक पर अपने स्वयं की नीति नियंत्रण लागू कर सकें।

नीति तंत्र और कुबरनेट्स के बारे में अधिक जानकारी के लिए,
[नीतियां](/docs/concepts/policy/) पढ़ें।

## {{% heading "whatsnext" %}}

संबंधित कुबरनेट्स सुरक्षा विषयों के बारे में जानें:

* [अपने क्लस्टर को सुरक्षित करना](/docs/tasks/administer-cluster/securing-a-cluster/)
* [ज्ञात कमजोरियां](/docs/reference/issues-security/official-cve-feed/)
  कुबरनेट्स में (और आगे की जानकारी के लिंक)
* [नियंत्रण विमान के लिए ट्रांजिट में डेटा एन्क्रिप्शन](/docs/tasks/tls/managing-tls-in-a-cluster/)
* [आराम पर डेटा एन्क्रिप्शन](/docs/tasks/administer-cluster/encrypt-data/)
* [कुबरनेट्स API तक पहुंच को नियंत्रित करना](/docs/concepts/security/controlling-access)
* [Pods के लिए नेटवर्क नीतियां](/docs/concepts/services-networking/network-policies/)
* [कुबरनेट्स में राज़](/docs/concepts/configuration/secret/)
* [Pod सुरक्षा मानक](/docs/concepts/security/pod-security-standards/)
* [RuntimeClasses](/docs/concepts/containers/runtime-class)

संदर्भ जानें:

<!-- if changing this, also edit the front matter of content/en/docs/concepts/security/cloud-native-security.md to match; check the no_list setting -->
* [क्लाउड नेटिव सुरक्षा और कुबरनेट्स](/docs/concepts/security/cloud-native-security/)

प्रमाणित हो जाएँ:

* [प्रमाणित कुबरनेट्स सुरक्षा विशेषज्ञ](https://training.linuxfoundation.org/certification/certified-kubernetes-security-specialist/)
  प्रमाणीकरण और आधिकारिक प्रशिक्षण पाठ्यक्रम।

इस भाग में और पढ़ें:
