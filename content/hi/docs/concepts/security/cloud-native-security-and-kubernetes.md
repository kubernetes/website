---
title: "क्लाउड नेटिव सुरक्षा और Kubernetes"
linkTitle: "क्लाउड नेटिव सुरक्षा"
weight: 10

# The section index lists this explicitly
hide_summary: true

description: >
  अपने क्लाउड नेटिव वर्कलोड को सुरक्षित रखने की अवधारणाएँ।
---

Kubernetes एक क्लाउड नेटिव आर्किटेक्चर पर आधारित है और क्लाउड नेटिव
सूचना सुरक्षा के लिए अच्छे अभ्यास के बारे में
{{< glossary_tooltip text="CNCF" term_id="cncf" >}} की सलाह का उपयोग करता है।

आगे पढ़ें और जानें कि Kubernetes आपको एक सुरक्षित क्लाउड नेटिव प्लेटफ़ॉर्म
तैनात करने में कैसे मदद करने के लिए डिज़ाइन किया गया है।

## क्लाउड नेटिव सूचना सुरक्षा

{{< comment >}}
There are localized versions available of this whitepaper; if you can link to one of those
when localizing, that's even better.
{{< /comment >}}

क्लाउड नेटिव सुरक्षा पर CNCF का [श्वेत पत्र](https://github.com/cncf/tag-security/blob/main/community/resources/security-whitepaper/v2/CNCF_cloud-native-security-whitepaper-May2022-v2.pdf)
सुरक्षा नियंत्रणों और प्रथाओं को परिभाषित करता है जो विभिन्न _जीवनचक्र चरणों_ के
लिए उपयुक्त हैं।

## _Develop_ जीवनचक्र चरण {#lifecycle-phase-develop}

- विकास परिवेशों की अखंडता सुनिश्चित करें।
- अपने संदर्भ के लिए उपयुक्त सूचना सुरक्षा की अच्छी प्रथाओं का पालन करते हुए
  एप्लिकेशन डिज़ाइन करें।
- समाधान डिज़ाइन के हिस्से के रूप में अंतिम उपयोगकर्ता सुरक्षा पर विचार करें।

इसे प्राप्त करने के लिए, आप यह कर सकते हैं:

1. एक ऐसी आर्किटेक्चर अपनाएँ, जैसे [zero trust](https://glossary.cncf.io/zero-trust-architecture/),
   जो आंतरिक खतरों के लिए भी अटैक सर्फेस को कम करती है।
1. एक कोड समीक्षा प्रक्रिया परिभाषित करें जो सुरक्षा संबंधी चिंताओं पर विचार करे।
1. अपने सिस्टम या एप्लिकेशन का एक _थ्रेट मॉडल_ बनाएँ जो ट्रस्ट सीमाओं की पहचान
   करे। उस थ्रेट मॉडल का उपयोग जोखिमों की पहचान करने और उन्हें कैसे संभालना है
   यह निर्धारित करने के लिए करें।
1. उन्नत सुरक्षा स्वचालन शामिल करें, जैसे _fuzzing_ और
   [security chaos engineering](https://glossary.cncf.io/security-chaos-engineering/),
   जहाँ यह उचित हो।

## _Distribute_ जीवनचक्र चरण {#lifecycle-phase-distribute}

- आप जो कंटेनर इमेज निष्पादित करते हैं उनकी सप्लाई चेन की सुरक्षा सुनिश्चित करें।
- क्लस्टर और अन्य घटकों की सप्लाई चेन की सुरक्षा सुनिश्चित करें जो आपका
  एप्लिकेशन निष्पादित करते हैं। उदाहरण के लिए, इसमें एक बाहरी डेटाबेस शामिल
  हो सकता है जिसे आपका क्लाउड नेटिव एप्लिकेशन persistence के लिए उपयोग करता है।

इसे प्राप्त करने के लिए, आप यह कर सकते हैं:

1. ज्ञात कमज़ोरियों के लिए कंटेनर इमेज और अन्य आर्टिफैक्ट स्कैन करें।
1. सुनिश्चित करें कि सॉफ़्टवेयर वितरण ट्रांज़िट में एन्क्रिप्शन का उपयोग करे,
   सॉफ़्टवेयर स्रोत के लिए विश्वास की श्रृंखला के साथ।
1. अपडेट उपलब्ध होने पर, विशेष रूप से सुरक्षा घोषणाओं के जवाब में,
   dependencies अपडेट करने की प्रक्रियाएँ अपनाएँ और उनका पालन करें।
1. सप्लाई चेन आश्वासन के लिए डिजिटल प्रमाणपत्र जैसे सत्यापन तंत्र का उपयोग करें।
1. सुरक्षा जोखिमों के बारे में सचेत करने के लिए फ़ीड और अन्य तंत्रों की सदस्यता लें।
1. आर्टिफैक्ट तक पहुँच प्रतिबंधित करें। कंटेनर इमेज को एक
   [प्राइवेट रजिस्ट्री](/docs/concepts/containers/images/#using-a-private-registry)
   में रखें जो केवल अधिकृत क्लाइंट को इमेज pull करने की अनुमति देती है।

## _Deploy_ जीवनचक्र चरण {#lifecycle-phase-deploy}

यह सुनिश्चित करें कि क्या तैनात किया जा सकता है, कौन इसे तैनात कर सकता है,
और इसे कहाँ तैनात किया जा सकता है, इस पर उचित प्रतिबंध हों।
आप _distribute_ चरण के उपाय लागू कर सकते हैं, जैसे कंटेनर इमेज आर्टिफैक्ट
की क्रिप्टोग्राफ़िक पहचान सत्यापित करना।

आप विभिन्न एप्लिकेशन और क्लस्टर घटकों को अलग-अलग
{{< glossary_tooltip text="namespaces" term_id="namespace" >}} में तैनात कर सकते हैं।
कंटेनर और namespaces दोनों अलगाव तंत्र प्रदान करते हैं जो सूचना सुरक्षा के
लिए प्रासंगिक हैं।

जब आप Kubernetes तैनात करते हैं, तो आप अपने एप्लिकेशन के रनटाइम परिवेश की
नींव भी रखते हैं: एक Kubernetes क्लस्टर (या कई क्लस्टर)।
उस इंफ्रास्ट्रक्चर को वे सुरक्षा गारंटी प्रदान करनी होगी जिनकी उच्च परतें
अपेक्षा करती हैं।

## _Runtime_ जीवनचक्र चरण {#lifecycle-phase-runtime}

Runtime चरण में तीन महत्वपूर्ण क्षेत्र शामिल हैं: [एक्सेस](#protection-runtime-access),
[कंप्यूट](#protection-runtime-compute), और [स्टोरेज](#protection-runtime-storage)।

### Runtime सुरक्षा: एक्सेस {#protection-runtime-access}

Kubernetes API ही आपके क्लस्टर को काम करवाती है। इस API की सुरक्षा करना
प्रभावी क्लस्टर सुरक्षा प्रदान करने की कुंजी है।

Kubernetes दस्तावेज़ीकरण के अन्य पृष्ठों में एक्सेस नियंत्रण के विशिष्ट पहलुओं
को कैसे सेट करें इस बारे में अधिक विवरण है।
[security checklist](/docs/concepts/security/security-checklist/)
आपके क्लस्टर के लिए सुझाए गए बुनियादी जाँच प्रदान करती है।

इसके अलावा, आपके क्लस्टर को सुरक्षित करने का अर्थ है API एक्सेस के लिए
प्रभावी [authentication](/docs/concepts/security/controlling-access/#authentication)
और [authorization](/docs/concepts/security/controlling-access/#authorization) लागू करना।
वर्कलोड और क्लस्टर घटकों के लिए सुरक्षा पहचान प्रदान करने और प्रबंधित करने के
लिए [ServiceAccounts](/docs/concepts/security/service-accounts/) का उपयोग करें।

Kubernetes API ट्रैफ़िक की सुरक्षा के लिए TLS का उपयोग करता है; सुनिश्चित करें
कि आप TLS का उपयोग करके क्लस्टर तैनात करें (नोड्स और कंट्रोल प्लेन के बीच
ट्रैफ़िक सहित) और एन्क्रिप्शन कुंजियों की सुरक्षा करें। यदि आप
[CertificateSigningRequests](/docs/reference/access-authn-authz/certificate-signing-requests/#certificate-signing-requests)
के लिए Kubernetes के अपने API का उपयोग करते हैं, तो वहाँ दुरुपयोग को
प्रतिबंधित करने पर विशेष ध्यान दें।

### Runtime सुरक्षा: कंप्यूट {#protection-runtime-compute}

{{< glossary_tooltip text="Containers" term_id="container" >}} दो चीज़ें
प्रदान करते हैं: एप्लिकेशन के बीच अलगाव और उन अलग-अलग एप्लिकेशन को एक ही
होस्ट कंप्यूटर पर चलाने के लिए संयोजित करने का एक तंत्र। वे दो पहलू—अलगाव
और एकत्रीकरण—का अर्थ है कि रनटाइम सुरक्षा में ट्रेडऑफ़ की पहचान करना और
एक उचित संतुलन खोजना शामिल है।

Kubernetes कंटेनर सेट अप और चलाने के लिए एक
{{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}
पर निर्भर करता है। Kubernetes प्रोजेक्ट किसी विशिष्ट कंटेनर रनटाइम की
अनुशंसा नहीं करता है, और आपको यह सुनिश्चित करना चाहिए कि आपके द्वारा चुना
गया रनटाइम आपकी सूचना सुरक्षा आवश्यकताओं को पूरा करता है।

रनटाइम पर अपने कंप्यूट की सुरक्षा के लिए, आप यह कर सकते हैं:

1. एप्लिकेशन के लिए [Pod Security Standards](/docs/concepts/security/pod-security-standards/)
   लागू करें ताकि यह सुनिश्चित हो सके कि वे केवल आवश्यक privileges के साथ चलें।
1. अपने नोड्स पर एक विशेष ऑपरेटिंग सिस्टम चलाएँ जो विशेष रूप से
   containerized वर्कलोड चलाने के लिए डिज़ाइन किया गया हो। यह आमतौर पर एक
   रीड-ओनली ऑपरेटिंग सिस्टम (_immutable image_) पर आधारित होता है जो केवल
   कंटेनर चलाने के लिए आवश्यक सेवाएँ प्रदान करता है।

   कंटेनर-विशिष्ट ऑपरेटिंग सिस्टम सिस्टम घटकों को अलग करने में मदद करते हैं
   और कंटेनर एस्केप की स्थिति में एक कम अटैक सर्फेस प्रस्तुत करते हैं।
1. साझा संसाधनों को उचित रूप से आवंटित करने के लिए
   [ResourceQuotas](/docs/concepts/policy/resource-quotas/) परिभाषित करें, और
   यह सुनिश्चित करने के लिए कि Pods अपनी संसाधन आवश्यकताओं को निर्दिष्ट करें,
   [LimitRanges](/docs/concepts/policy/limit-range/) जैसे तंत्रों का उपयोग करें।
1. अलगाव में सुधार के लिए वर्कलोड को विभिन्न नोड्स में विभाजित करें।
   यह सुनिश्चित करने के लिए कि विभिन्न ट्रस्ट संदर्भों वाले Pods अलग नोड
   सेट पर चलें, Kubernetes से या पारिस्थितिकी तंत्र से
   [node isolation](/docs/concepts/scheduling-eviction/assign-pod-node/#node-isolation-restriction)
   तंत्रों का उपयोग करें।
1. एक {{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}
   का उपयोग करें जो सुरक्षा प्रतिबंध प्रदान करता है।
1. Linux नोड्स पर, Linux सुरक्षा मॉड्यूल जैसे [AppArmor](/docs/tutorials/security/apparmor/)
   या [seccomp](/docs/tutorials/security/seccomp/) का उपयोग करें।

### Runtime सुरक्षा: स्टोरेज {#protection-runtime-storage}

अपने क्लस्टर और उस पर चलने वाले एप्लिकेशन के लिए स्टोरेज की सुरक्षा के
लिए, आप यह कर सकते हैं:

1. अपने क्लस्टर को एक बाहरी स्टोरेज प्लगइन के साथ एकीकृत करें जो volumes के
   लिए रेस्ट में एन्क्रिप्शन प्रदान करता है।
1. API ऑब्जेक्ट के लिए
   [encryption at rest](/docs/tasks/administer-cluster/encrypt-data/) सक्षम करें।
1. बैकअप का उपयोग करके डेटा स्थायित्व की सुरक्षा करें, और सत्यापित करें कि
   आप जब भी आवश्यक हो उन्हें पुनर्स्थापित कर सकते हैं।
1. क्लस्टर नोड्स और उनके द्वारा उपयोग किए जाने वाले किसी भी नेटवर्क स्टोरेज
   के बीच कनेक्शन प्रमाणित करें।
1. अपने स्वयं के एप्लिकेशन के भीतर डेटा एन्क्रिप्शन लागू करें।

एन्क्रिप्शन कुंजियों के लिए, विशेष हार्डवेयर के भीतर इन्हें उत्पन्न करना
प्रकटीकरण जोखिमों के विरुद्ध सर्वोत्तम सुरक्षा प्रदान करता है। एक
_hardware security module_ आपको क्रिप्टोग्राफ़िक ऑपरेशन करने की अनुमति दे
सकता है बिना सुरक्षा कुंजी को कहीं और कॉपी होने दिए।

### नेटवर्किंग और सुरक्षा

आपको नेटवर्क सुरक्षा उपायों पर भी विचार करना चाहिए, जैसे
[NetworkPolicy](/docs/concepts/services-networking/network-policies/) या एक
[service mesh](https://glossary.cncf.io/service-mesh/)।
Kubernetes के कुछ नेटवर्क प्लगइन वर्चुअल प्राइवेट नेटवर्क (VPN) ओवरले जैसी
तकनीकों का उपयोग करके आपके क्लस्टर नेटवर्क के लिए एन्क्रिप्शन प्रदान करते हैं।
डिज़ाइन के अनुसार, Kubernetes आपको अपने क्लस्टर के लिए अपना नेटवर्किंग
प्लगइन उपयोग करने देता है। यदि आप managed Kubernetes का उपयोग करते हैं, तो
प्रदाता ने शायद पहले से ही आपके लिए एक नेटवर्क प्लगइन चुना हो।

आप जो नेटवर्क प्लगइन चुनते हैं और जिस तरह से आप इसे एकीकृत करते हैं, वह
ट्रांज़िट में सूचना की सुरक्षा पर महत्वपूर्ण प्रभाव डाल सकता है।

### अवलोकनीयता और रनटाइम सुरक्षा

Kubernetes आपको अतिरिक्त टूलिंग के साथ अपने क्लस्टर का विस्तार करने देता है।
आप अपने एप्लिकेशन और उन्हें चलाने वाले क्लस्टर की निगरानी या समस्या निवारण
में मदद के लिए थर्ड-पार्टी समाधान सेट अप कर सकते हैं। आपको Kubernetes में
बनी हुई कुछ बुनियादी अवलोकनीयता सुविधाएँ भी मिलती हैं। कंटेनरों में चलने
वाला आपका कोड लॉग उत्पन्न कर सकता है, मेट्रिक्स प्रकाशित कर सकता है, या
अन्य अवलोकनीयता डेटा प्रदान कर सकता है; तैनाती के समय, आपको यह सुनिश्चित
करना होगा कि आपका क्लस्टर वहाँ सुरक्षा का उचित स्तर प्रदान करे।

यदि आप कोई मेट्रिक्स डैशबोर्ड या इसी तरह की कोई चीज़ सेट करते हैं, तो
उस डैशबोर्ड में डेटा भरने वाले घटकों की श्रृंखला के साथ-साथ डैशबोर्ड की
भी समीक्षा करें। सुनिश्चित करें कि पूरी श्रृंखला पर्याप्त लचीलेपन और
अखंडता सुरक्षा के साथ डिज़ाइन की गई है ताकि आप किसी घटना के दौरान भी इस
पर भरोसा कर सकें जब आपका क्लस्टर डिग्रेड हो सकता है।

जहाँ उचित हो, Kubernetes परत के नीचे सुरक्षा उपाय तैनात करें, जैसे
क्रिप्टोग्राफ़िक रूप से मापा गया बूट या समय का प्रमाणित वितरण (जो लॉग और
ऑडिट रिकॉर्ड की निष्ठा सुनिश्चित करने में मदद करता है)।

उच्च-आश्वासन परिवेश के लिए, यह सुनिश्चित करने के लिए क्रिप्टोग्राफ़िक
सुरक्षा तैनात करें कि लॉग छेड़छाड़-रोधी और गोपनीय दोनों हों।

## {{% heading "whatsnext" %}}

### क्लाउड नेटिव सुरक्षा {#further-reading-cloud-native}

* क्लाउड नेटिव सुरक्षा पर CNCF [श्वेत पत्र](https://github.com/cncf/tag-security/blob/main/community/resources/security-whitepaper/v2/CNCF_cloud-native-security-whitepaper-May2022-v2.pdf)।
* सॉफ़्टवेयर सप्लाई चेन को सुरक्षित करने की अच्छी प्रथाओं पर CNCF [श्वेत पत्र](https://github.com/cncf/tag-security/blob/f80844baaea22a358f5b20dca52cd6f72a32b066/supply-chain-security/supply-chain-security-paper/CNCF_SSCP_v1.pdf)।
* [Fixing the Kubernetes clusterf\*\*k: Understanding security from the kernel up](https://archive.fosdem.org/2020/schedule/event/kubernetes/) (FOSDEM 2020)
* [Kubernetes Security Best Practices](https://www.youtube.com/watch?v=wqsUfvRyYpw) (Kubernetes Forum Seoul 2019)
* [Towards Measured Boot Out of the Box](https://www.youtube.com/watch?v=EzSkU3Oecuw) (Linux Security Summit 2016)

### Kubernetes और सूचना सुरक्षा {#further-reading-k8s}

* [Kubernetes सुरक्षा](/docs/concepts/security/)
* [अपने क्लस्टर को सुरक्षित करना](/docs/tasks/administer-cluster/securing-a-cluster/)
* कंट्रोल प्लेन के लिए [ट्रांज़िट में डेटा एन्क्रिप्शन](/docs/tasks/tls/managing-tls-in-a-cluster/)
* [रेस्ट में डेटा एन्क्रिप्शन](/docs/tasks/administer-cluster/encrypt-data/)
* [Kubernetes में सीक्रेट्स](/docs/concepts/configuration/secret/)
* [Kubernetes API तक पहुँच नियंत्रित करना](/docs/concepts/security/controlling-access)
* Pods के लिए [Network policies](/docs/concepts/services-networking/network-policies/)
* [Pod security standards](/docs/concepts/security/pod-security-standards/)
* [RuntimeClasses](/docs/concepts/containers/runtime-class)
