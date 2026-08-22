---
title: "सुरक्षा (Security)"
weight: 85
description: >
  आपके क्लाउड-नेटिव वर्कलोड (cloud-native workload) को सुरक्षित रखने के लिए अवधारणाएँ (Concepts)।
simple_list: true
---

कुबेरनेट्स (Kubernetes) दस्तावेज़ का यह खंड आपको वर्कलोड (workloads) को अधिक सुरक्षित रूप से चलाने के बारे में सीखने और कुबेरनेट्स क्लस्टर (cluster) को सुरक्षित रखने के आवश्यक पहलुओं के बारे में मदद करने के लिए है।

कुबेरनेट्स एक क्लाउड-नेटिव आर्किटेक्चर पर आधारित है, और क्लाउड नेटिव सूचना सुरक्षा के अच्छे अभ्यास के बारे में {{< glossary_tooltip text="CNCF" term_id="cncf" >}} से सलाह लेता है।

अपने क्लस्टर और उस पर चल रहे एप्लिकेशन को सुरक्षित करने के व्यापक संदर्भ के लिए [क्लाउड नेटिव सुरक्षा और कुबेरनेट्स (Cloud Native Security and Kubernetes)](/docs/concepts/security/cloud-native-security/) पढ़ें।

## कुबेरनेट्स सुरक्षा तंत्र (Kubernetes security mechanisms) {#security-mechanisms}

कुबेरनेट्स में कई API और सुरक्षा नियंत्रण (security controls) शामिल हैं, साथ ही [नीतियां (policies)](#policies) परिभाषित करने के तरीके भी हैं जो यह तय कर सकते हैं कि आप सूचना सुरक्षा का प्रबंधन कैसे करते हैं।

### कंट्रोल प्लेन सुरक्षा (Control plane protection)

किसी भी कुबेरनेट्स क्लस्टर के लिए एक प्रमुख सुरक्षा तंत्र [कुबेरनेट्स API तक पहुंच को नियंत्रित करना](/docs/concepts/security/controlling-access) है।

कुबेरनेट्स आपसे अपेक्षा करता है कि आप कंट्रोल प्लेन के भीतर, और कंट्रोल प्लेन और इसके क्लाइंट्स के बीच [डेटा एन्क्रिप्शन इन ट्रांज़िट (data encryption in transit)](/docs/tasks/tls/managing-tls-in-a-cluster/) प्रदान करने के लिए TLS को कॉन्फ़िगर और उपयोग करें।
आप कुबेरनेट्स कंट्रोल प्लेन के भीतर संग्रहीत डेटा के लिए [एन्क्रिप्शन एट रेस्ट (encryption at rest)](/docs/tasks/administer-cluster/encrypt-data/) भी सक्षम कर सकते हैं; यह आपके स्वयं के वर्कलोड के डेटा के लिए एन्क्रिप्शन एट रेस्ट का उपयोग करने से अलग है, जो एक अच्छा विचार भी हो सकता है।

### सीक्रेट्स (Secrets)

[Secret](/docs/concepts/configuration/secret/) API उन कॉन्फ़िगरेशन मानों के लिए बुनियादी सुरक्षा प्रदान करता है जिनके लिए गोपनीयता की आवश्यकता होती है।

### वर्कलोड सुरक्षा (Workload protection)

यह सुनिश्चित करने के लिए कि Pods और उनके कंटेनर उचित रूप से अलग (isolated) हैं, [पॉड सुरक्षा मानकों (Pod security standards)](/docs/concepts/security/pod-security-standards/) को लागू करें। यदि आपको आवश्यकता हो तो कस्टम आइसोलेशन को परिभाषित करने के लिए आप [RuntimeClasses](/docs/concepts/containers/runtime-class) का भी उपयोग कर सकते हैं।

[नेटवर्क नीतियां (Network policies)](/docs/concepts/services-networking/network-policies/) आपको Pods के बीच, या Pods और आपके क्लस्टर के बाहर के नेटवर्क के बीच नेटवर्क ट्रैफ़िक को नियंत्रित करने देती हैं।

आप Pods, उनके कंटेनर और उनमें चलने वाली छवियों (images) के आसपास निवारक (preventative) या जासूसी (detective) नियंत्रण लागू करने के लिए व्यापक इकोसिस्टम (ecosystem) से सुरक्षा नियंत्रण तैनात कर सकते हैं।

### एडमिशन कंट्रोल (Admission control) {#admission-control}

[एडमिशन कंट्रोलर (Admission controllers)](/docs/reference/access-authn-authz/admission-controllers/) प्लगइन्स (plugins) हैं जो कुबेरनेट्स API अनुरोधों को इंटरसेप्ट करते हैं और अनुरोध में विशिष्ट फ़ील्ड के आधार पर अनुरोधों को मान्य (validate) या परिवर्तित (mutate) कर सकते हैं। इन नियंत्रकों को सोच-समझकर डिज़ाइन करने से अनपेक्षित व्यवधानों से बचने में मदद मिलती है क्योंकि संस्करण अपडेट (version updates) में कुबेरनेट्स API बदलते हैं। डिज़ाइन संबंधी विचारों (design considerations) के लिए, [एडमिशन वेबहुक गुड प्रैक्टिसेज (Admission Webhook Good Practices)](/docs/concepts/cluster-administration/admission-webhooks-good-practices/) देखें।

### ऑडिटिंग (Auditing)

कुबेरनेट्स [ऑडिट लॉगिंग](/docs/tasks/debug/debug-cluster/audit/) क्लस्टर में क्रियाओं के अनुक्रम (sequence of actions) का दस्तावेजीकरण करने वाले सुरक्षा-प्रासंगिक (security-relevant), कालानुक्रमिक रिकॉर्ड प्रदान करता है। क्लस्टर उपयोगकर्ताओं द्वारा, कुबेरनेट्स API का उपयोग करने वाले एप्लिकेशन द्वारा, और स्वयं कंट्रोल प्लेन द्वारा उत्पन्न गतिविधियों का ऑडिट करता है।

## क्लाउड प्रदाता सुरक्षा (Cloud provider security)

{{% thirdparty-content vendor="true" %}}

यदि आप कुबेरनेट्स क्लस्टर अपने स्वयं के हार्डवेयर या किसी भिन्न क्लाउड प्रदाता पर चला रहे हैं, तो सुरक्षा सर्वोत्तम प्रथाओं (security best practices) के लिए अपने दस्तावेज़ से परामर्श लें।
यहां कुछ लोकप्रिय क्लाउड प्रदाताओं के सुरक्षा दस्तावेज़ों के लिंक दिए गए हैं:

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

## नीतियां (Policies)

आप कुबेरनेट्स-नेटिव तंत्र (Kubernetes-native mechanisms) का उपयोग करके सुरक्षा नीतियां (security policies) परिभाषित कर सकते हैं,
जैसे [NetworkPolicy](/docs/concepts/services-networking/network-policies/) (नेटवर्क पैकेट फ़िल्टरिंग पर घोषणात्मक नियंत्रण (declarative control)) या [ValidatingAdmissionPolicy](/docs/reference/access-authn-authz/validating-admission-policy/) (कुबेरनेट्स API का उपयोग करके कोई क्या परिवर्तन कर सकता है, इस पर घोषणात्मक प्रतिबंध)।

हालाँकि, आप कुबेरनेट्स के आसपास के व्यापक इकोसिस्टम से नीति कार्यान्वयन पर भी भरोसा कर सकते हैं। कुबेरनेट्स उन इकोसिस्टम परियोजनाओं को स्रोत कोड समीक्षा (source code review), कंटेनर इमेज अनुमोदन (container image approval), API पहुंच नियंत्रण, नेटवर्किंग और बहुत कुछ पर अपने स्वयं के नीति नियंत्रण (policy controls) लागू करने देने के लिए विस्तार तंत्र (extension mechanisms) प्रदान करता है।

नीति तंत्र (policy mechanisms) और कुबेरनेट्स के बारे में अधिक जानकारी के लिए,
[नीतियां (Policies)](/docs/concepts/policy/) पढ़ें।

## {{% heading "whatsnext" %}}

संबंधित कुबेरनेट्स सुरक्षा विषयों के बारे में जानें:

* [अपने क्लस्टर को सुरक्षित करना](/docs/tasks/administer-cluster/securing-a-cluster/)
* कुबेरनेट्स में [ज्ञात कमजोरियां (Known vulnerabilities)](/docs/reference/issues-security/official-cve-feed/) (और अधिक जानकारी के लिंक)
* कंट्रोल प्लेन के लिए [डेटा एन्क्रिप्शन इन ट्रांज़िट](/docs/tasks/tls/managing-tls-in-a-cluster/)
* [डेटा एन्क्रिप्शन एट रेस्ट](/docs/tasks/administer-cluster/encrypt-data/)
* [कुबेरनेट्स API तक पहुंच को नियंत्रित करना](/docs/concepts/security/controlling-access)
* Pods के लिए [नेटवर्क नीतियां](/docs/concepts/services-networking/network-policies/)
* [कुबेरनेट्स में सीक्रेट्स](/docs/concepts/configuration/secret/)
* [पॉड सुरक्षा मानक](/docs/concepts/security/pod-security-standards/)
* [RuntimeClasses](/docs/concepts/containers/runtime-class)

संदर्भ जानें:

<!-- if changing this, also edit the front matter of content/en/docs/concepts/security/cloud-native-security.md to match; check the no_list setting -->
* [क्लाउड नेटिव सुरक्षा और कुबेरनेट्स](/docs/concepts/security/cloud-native-security/)

प्रमाणित हों:

* [Certified Kubernetes Security Specialist](https://training.linuxfoundation.org/certification/certified-kubernetes-security-specialist/) प्रमाणन और आधिकारिक प्रशिक्षण पाठ्यक्रम।

इस अनुभाग में और पढ़ें:
