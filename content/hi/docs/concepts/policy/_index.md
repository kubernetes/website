---
title: "नीतियाँ"
weight: 90
no_list: true
description: >
  नीतियों के साथ सुरक्षा और सर्वोत्तम प्रथाओं को प्रबंधित करें।
---

<!-- overview -->

Kubernetes नीतियाँ वे कॉन्फ़िगरेशन होती हैं जो अन्य कॉन्फ़िगरेशन या रनटाइम व्यवहारों को प्रबंधित करती हैं। Kubernetes विभिन्न प्रकार की नीतियाँ प्रदान करता है, जो नीचे दी गई हैं:

<!-- body -->

## API ऑब्जेक्ट्स का उपयोग करके नीतियाँ लागू करें

कुछ API ऑब्जेक्ट्स नीतियों के रूप में कार्य करते हैं। यहाँ कुछ उदाहरण दिए गए हैं:
* [NetworkPolicies](/docs/concepts/services-networking/network-policies/) का उपयोग किसी वर्कलोड के लिए इनग्रेस और एग्रेस ट्रैफिक को प्रतिबंधित करने के लिए किया जा सकता है।
* [LimitRanges](/docs/concepts/policy/limit-range/) विभिन्न ऑब्जेक्ट प्रकारों के बीच संसाधन आवंटन सीमाओं का प्रबंधन करते हैं।
* [ResourceQuotas](/docs/concepts/policy/resource-quotas/) किसी {{< glossary_tooltip text="नेमस्पेस" term_id="namespace" >}} के लिए संसाधन खपत को सीमित करती हैं।

## Admission Controllers का उपयोग करके नीतियाँ लागू करें

एक {{< glossary_tooltip text="admission controller" term_id="admission-controller" >}} API सर्वर में चलता है और API अनुरोधों को सत्यापित या बदल सकता है। कुछ admission controllers नीतियों को लागू करने के लिए कार्य करते हैं। उदाहरण के लिए, [AlwaysPullImages](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages) admission controller प्रत्येक नए Pod में इमेज पुल नीति को `Always` पर सेट करने के लिए सक्षम करता है।

Kubernetes के पास कई अंतर्निहित admission controllers हैं जिन्हें API सर्वर `--enable-admission-plugins` फ्लैग के माध्यम से कॉन्फ़िगर किया जा सकता है।

Admission controllers के बारे में विस्तृत जानकारी, उपलब्ध admission controllers की पूरी सूची के साथ, एक समर्पित अनुभाग में प्रलेखित है:

* [Admission Controllers](/docs/reference/access-authn-authz/admission-controllers/)

## ValidatingAdmissionPolicy का उपयोग करके नीतियाँ लागू करें

Validating admission policies, API सर्वर में कॉन्फ़िगर करने योग्य सत्यापन जांचों को लागू करने की अनुमति देती हैं, जो Common Expression Language (CEL) का उपयोग करती हैं। उदाहरण के लिए, एक `ValidatingAdmissionPolicy` का उपयोग `latest` इमेज टैग के उपयोग को अस्वीकृत करने के लिए किया जा सकता है।

एक `ValidatingAdmissionPolicy` एक API अनुरोध पर कार्य करता है और गैर-अनुपालन कॉन्फ़िगरेशनों के बारे में उपयोगकर्ताओं को ब्लॉक, ऑडिट, और चेतावनी देने के लिए उपयोग किया जा सकता है।

`ValidatingAdmissionPolicy` API के बारे में विवरण, उदाहरणों सहित, एक समर्पित अनुभाग में प्रलेखित है:
* [Validating Admission Policy](/docs/reference/access-authn-authz/validating-admission-policy/)

## Dynamic admission control का उपयोग करके नीतियाँ लागू करें

Dynamic admission controllers (या admission webhooks) API सर्वर के बाहर एक अलग एप्लिकेशन के रूप में चलते हैं जो API अनुरोधों के सत्यापन या संशोधन के लिए वेबहुक अनुरोधों को प्राप्त करने के लिए पंजीकृत होते हैं।

Dynamic admission controllers का उपयोग API अनुरोधों पर नीतियाँ लागू करने और अन्य नीति-आधारित वर्कफ़्लोज़ को ट्रिगर करने के लिए किया जा सकता है। एक dynamic admission controller ऐसी जटिल जांच कर सकता है, जिसमें अन्य क्लस्टर संसाधनों और बाहरी डेटा की पुनर्प्राप्ति की आवश्यकता होती है। उदाहरण के लिए, एक इमेज सत्यापन जांच OCI रजिस्ट्रियों से डेटा प्राप्त करके कंटेनर इमेज हस्ताक्षर और प्रमाणपत्रों को मान्य करने के लिए उपयोग की जा सकती है।

Dynamic admission control के बारे में विवरण एक समर्पित अनुभाग में प्रलेखित है:
* [Dynamic Admission Control](/docs/reference/access-authn-authz/extensible-admission-controllers/)

### Implementations {#implementations-admission-control}

{{% thirdparty-content %}}

Dynamic admission controllers जो फ्लेक्सिबल नीति इंजन के रूप में कार्य करते हैं, उन्हें कुबेरनेट्स इकोसिस्टम में विकसित किया जा रहा है, जैसे की:
- [Kubewarden](https://github.com/kubewarden)
- [Kyverno](https://kyverno.io)
- [OPA Gatekeeper](https://github.com/open-policy-agent/gatekeeper)
- [Polaris](https://polaris.docs.fairwinds.com/admission-controller/)

## Kubelet कॉन्फ़िगरेशनों का उपयोग करके नीतियाँ लागू करें

Kubernetes प्रत्येक वर्कर नोड पर Kubelet को कॉन्फ़िगर करने की अनुमति देता है। कुछ Kubelet कॉन्फ़िगरेशन नीतियों के रूप में कार्य करते हैं:
* [Process ID limits and reservations](/docs/concepts/policy/pid-limiting/) का उपयोग आवंटन योग्य PIDs को सीमित और आरक्षित करने के लिए किया जाता है।
* [Node Resource Managers](/docs/concepts/policy/node-resource-managers/) उच्च-प्रदर्शन और विलंब-संवेदनशील वर्कलोड्स के लिए कंप्यूट, मेमोरी, और डिवाइस संसाधनों का प्रबंधन कर सकते हैं।
