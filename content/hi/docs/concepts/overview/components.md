---
reviewers:
- lavalamp
title: कुबेरनेट्स के घटक
content_type: concept
description: >
  उन प्रमुख घटकों का अवलोकन जो एक कुबेरनेट्स क्लस्टर बनाते हैं।
weight: 10
theme_lock: light
card:
  title: क्लस्टर के घटक
  name: concepts
  weight: 20
---

<!-- overview -->

यह पृष्ठ उन आवश्यक घटकों का एक उच्च-स्तरीय अवलोकन प्रदान करता है जो एक कुबेरनेट्स क्लस्टर बनाते हैं।

{{< figure src="/images/docs/components-of-kubernetes.svg" alt="कुबेरनेट्स के घटक" caption="एक कुबेरनेट्स क्लस्टर के घटक" class="diagram-large" clicktozoom="true" >}}

<!-- body -->

## मुख्य घटक

एक कुबेरनेट्स क्लस्टर एक कंट्रोल प्लेन और एक या अधिक वर्कर नोड्स से मिलकर बनता है।
यहाँ मुख्य घटकों का एक संक्षिप्त अवलोकन दिया गया है:

### कंट्रोल प्लेन घटक

क्लस्टर की समग्र स्थिति का प्रबंधन करते हैं:

[kube-apiserver](/docs/concepts/architecture/#kube-apiserver)
: वह मुख्य घटक सर्वर जो कुबेरनेट्स HTTP API को उजागर करता है।

[etcd](/docs/concepts/architecture/#etcd)
: API सर्वर के सभी डेटा के लिए सुसंगत और अत्यधिक उपलब्ध key-value स्टोर।

[kube-scheduler](/docs/concepts/architecture/#kube-scheduler)
: उन Pods को खोजता है जो अभी तक किसी नोड से बंधे नहीं हैं, और प्रत्येक Pod को एक उपयुक्त नोड पर असाइन करता है।

[kube-controller-manager](/docs/concepts/architecture/#kube-controller-manager)
: कुबेरनेट्स API के व्यवहार को लागू करने के लिए {{< glossary_tooltip text="कंट्रोलर" term_id="controller" >}} चलाता है।

[cloud-controller-manager](/docs/concepts/architecture/#cloud-controller-manager) (वैकल्पिक)
: अंतर्निहित क्लाउड प्रदाता(ओं) के साथ एकीकृत होता है।

### नोड घटक

प्रत्येक नोड पर चलते हैं, चल रहे Pods को बनाए रखते हैं और कुबेरनेट्स रनटाइम वातावरण प्रदान करते हैं:

[kubelet](/docs/concepts/architecture/#kubelet)
: सुनिश्चित करता है कि Pods, अपने कंटेनरों सहित, चल रहे हैं।

[kube-proxy](/docs/concepts/architecture/#kube-proxy) (वैकल्पिक)
: {{< glossary_tooltip text="Services" term_id="service" >}} को लागू करने के लिए नोड्स पर नेटवर्क नियमों को बनाए रखता है।

[कंटेनर रनटाइम](/docs/concepts/architecture/#container-runtime)
: कंटेनरों को चलाने के लिए ज़िम्मेदार सॉफ़्टवेयर। अधिक जानने के लिए
  [कंटेनर रनटाइम](/docs/setup/production-environment/container-runtimes/) पढ़ें।

{{% thirdparty-content single="true" %}}

आपके क्लस्टर को प्रत्येक नोड पर अतिरिक्त सॉफ़्टवेयर की आवश्यकता हो सकती है; उदाहरण के लिए, आप
स्थानीय घटकों की निगरानी के लिए किसी Linux नोड पर [systemd](https://systemd.io/) भी चला सकते हैं।

## ऐडऑन्स

ऐडऑन्स, कुबेरनेट्स की कार्यक्षमता का विस्तार करते हैं। कुछ महत्वपूर्ण उदाहरणों में शामिल हैं:

[DNS](/docs/concepts/architecture/#dns)
: क्लस्टर-व्यापी DNS रिज़ॉल्यूशन के लिए।

[वेब UI](/docs/concepts/architecture/#web-ui-dashboard) (Dashboard)
: वेब इंटरफ़ेस के माध्यम से क्लस्टर प्रबंधन के लिए।

[कंटेनर रिसोर्स मॉनिटरिंग](/docs/concepts/architecture/#container-resource-monitoring)
: कंटेनर मेट्रिक्स को एकत्र और संग्रहीत करने के लिए।

[क्लस्टर-स्तरीय लॉगिंग](/docs/concepts/architecture/#cluster-level-logging)
: कंटेनर लॉग्स को एक केंद्रीय लॉग स्टोर में सहेजने के लिए।

## आर्किटेक्चर में लचीलापन

कुबेरनेट्स इन घटकों को तैनात और प्रबंधित करने के तरीके में लचीलापन प्रदान करता है।
आर्किटेक्चर को विभिन्न आवश्यकताओं के अनुसार अनुकूलित किया जा सकता है, छोटे विकास वातावरण से
लेकर बड़े पैमाने पर उत्पादन परिनियोजन तक।

प्रत्येक घटक के बारे में अधिक विस्तृत जानकारी और अपने क्लस्टर आर्किटेक्चर को कॉन्फ़िगर करने के
विभिन्न तरीकों के लिए, [क्लस्टर आर्किटेक्चर](/docs/concepts/architecture/) पृष्ठ देखें।
