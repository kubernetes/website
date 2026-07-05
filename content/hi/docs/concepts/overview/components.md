---
reviewers:
- lavalamp
title: कुबेरनेट्स घटक (Kubernetes Components)
content_type: concept
description: >
  कुबेरनेट्स क्लस्टर बनाने वाले प्रमुख घटकों का अवलोकन।
weight: 10
theme_lock: light
card:
  title: क्लस्टर के घटक
  name: concepts
  weight: 20
---

<!-- overview -->

यह पृष्ठ उन आवश्यक घटकों का एक उच्च-स्तरीय अवलोकन प्रदान करता है जो एक कुबेरनेट्स क्लस्टर बनाते हैं।

{{< figure src="/images/docs/components-of-kubernetes.svg" alt="कुबेरनेट्स के घटक" caption="कुबेरनेट्स क्लस्टर के घटक" class="diagram-large" clicktozoom="true" >}}

<!-- body -->

## मुख्य घटक (Core Components)

एक कुबेरनेट्स क्लस्टर में एक कंट्रोल प्लेन (control plane) और एक या अधिक वर्कर नोड (worker nodes) होते हैं।
यहाँ मुख्य घटकों का संक्षिप्त विवरण दिया गया है:

### कंट्रोल प्लेन घटक (Control Plane Components)

क्लस्टर की समग्र स्थिति का प्रबंधन करते हैं:

[kube-apiserver](/docs/concepts/architecture/#kube-apiserver)
: कोर घटक सर्वर जो कुबेरनेट्स HTTP API को एक्सपोज़ करता है।

[etcd](/docs/concepts/architecture/#etcd)
: सभी API सर्वर डेटा के लिए सुसंगत और उच्च-उपलब्धता वाला की-वैल्यू (key-value) स्टोर।

[kube-scheduler](/docs/concepts/architecture/#kube-scheduler)
: उन पॉड्स (Pods) की तलाश करता है जो अभी तक किसी नोड से नहीं जुड़े हैं, और प्रत्येक पॉड को एक उपयुक्त नोड प्रदान करता है।

[kube-controller-manager](/docs/concepts/architecture/#kube-controller-manager)
: कुबेरनेट्स API व्यवहार को लागू करने के लिए {{< glossary_tooltip text="नियंत्रकों (controllers)" term_id="controller" >}} को चलाता है।

[cloud-controller-manager](/docs/concepts/architecture/#cloud-controller-manager) (वैकल्पिक)
: अंतर्निहित क्लाउड प्रदाता(ओं) के साथ एकीकृत करता है।

### नोड घटक (Node Components)

प्रत्येक नोड पर चलते हैं, चल रहे पॉड्स को बनाए रखते हैं और कुबेरनेट्स रनटाइम वातावरण प्रदान करते हैं:

[kubelet](/docs/concepts/architecture/#kubelet)
: यह सुनिश्चित करता है कि पॉड्स चल रहे हैं, जिसमें उनके कंटेनर भी शामिल हैं।

[kube-proxy](/docs/concepts/architecture/#kube-proxy) (वैकल्पिक)
: {{< glossary_tooltip text="सर्विसेज (Services)" term_id="service" >}} को लागू करने के लिए नोड्स पर नेटवर्क नियमों को बनाए रखता है।

[Container runtime](/docs/concepts/architecture/#container-runtime)
: कंटेनरों को चलाने के लिए जिम्मेदार सॉफ्टवेयर। अधिक जानने के लिए
  [कंटेनर रनटाइम](/docs/setup/production-environment/container-runtimes/) पढ़ें।

{{% thirdparty-content single="true" %}}

आपके क्लस्टर को प्रत्येक नोड पर अतिरिक्त सॉफ़्टवेयर की आवश्यकता हो सकती है; उदाहरण के लिए, आप स्थानीय घटकों की निगरानी के लिए लिनक्स नोड पर [systemd](https://systemd.io/) चला सकते हैं।

## एडऑन (Addons)

एडऑन कुबेरनेट्स की कार्यक्षमता का विस्तार करते हैं। कुछ महत्वपूर्ण उदाहरणों में शामिल हैं:

[DNS](/docs/concepts/architecture/#dns)
: क्लस्टर-व्यापी DNS रिज़ॉल्यूशन के लिए।

[Web UI](/docs/concepts/architecture/#web-ui-dashboard) (डैशबोर्ड)
: वेब इंटरफेस के माध्यम से क्लस्टर प्रबंधन के लिए।

[Container Resource Monitoring](/docs/concepts/architecture/#container-resource-monitoring)
: कंटेनर मेट्रिक्स को इकट्ठा करने और संग्रहीत करने के लिए।

[Cluster-level Logging](/docs/concepts/architecture/#cluster-level-logging)
: कंटेनर लॉग्स को एक केंद्रीय लॉग स्टोर में सहेजने के लिए।

## वास्तुकला में लचीलापन (Flexibility in Architecture)

कुबेरनेट्स इस बात में लचीलापन प्रदान करता है कि इन घटकों को कैसे तैनात और प्रबंधित किया जाता है।
वास्तुकला को विभिन्न आवश्यकताओं के अनुकूल किया जा सकता है, छोटे विकास वातावरण से लेकर बड़े पैमाने पर उत्पादन तैनाती तक।

प्रत्येक घटक और आपके क्लस्टर वास्तुकला को कॉन्फ़िगर करने के विभिन्न तरीकों के बारे में अधिक विस्तृत जानकारी के लिए, [क्लस्टर वास्तुकला (Cluster Architecture)](/docs/concepts/architecture/) पृष्ठ देखें।
