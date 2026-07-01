---
title: क्लस्टर एडमिनिस्ट्रेशन
reviewers:
- davidopp
- lavalamp
weight: 100
content_type: concept
description: >
  Kubernetes क्लस्टर बनाने या प्रशासित करने से संबंधित निम्न-स्तरीय विवरण।
no_list: true
card:
  name: setup
  weight: 60
  anchors:
  - anchor: "#securing-a-cluster"
    title: क्लस्टर को सुरक्षित करना
---

<!-- overview -->

क्लस्टर एडमिनिस्ट्रेशन का यह विवरण उन सभी के लिए है जो Kubernetes क्लस्टर बना रहे हैं या उसका प्रशासन कर रहे हैं।
इसमें मुख्य Kubernetes [concepts](/docs/concepts/) की कुछ जानकारी होना ज़रूरी है।

<!-- body -->

## क्लस्टर की योजना बनाना

Kubernetes क्लस्टर की योजना बनाने, सेटअप करने और कॉन्फ़िगर करने के उदाहरणों के लिए [Setup](/docs/setup/) में दिए गए गाइड देखें। इस लेख में सूचीबद्ध solutions को *distros* कहा जाता है।

{{< note  >}}
सभी distros सक्रिय रूप से maintain नहीं किए जाते। ऐसे distros चुनें जिनका Kubernetes के हाल के version के साथ परीक्षण किया गया हो।
{{< /note >}}

गाइड चुनने से पहले, इन बातों पर विचार करें:

- क्या आप अपने कंप्यूटर पर Kubernetes आज़माना चाहते हैं, या high-availability, multi-node क्लस्टर बनाना चाहते हैं? अपनी आवश्यकताओं के अनुसार सबसे उपयुक्त distros चुनें।
- क्या आप **hosted Kubernetes क्लस्टर** का उपयोग करेंगे, जैसे [Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine/), या **अपना क्लस्टर स्वयं host** करेंगे?
- क्या आपका क्लस्टर **on-premises** होगा, या **cloud (IaaS) में**? Kubernetes hybrid क्लस्टर को सीधे support नहीं करता। इसके बजाय, आप कई क्लस्टर सेटअप कर सकते हैं।
- **यदि आप Kubernetes को on-premises कॉन्फ़िगर कर रहे हैं**, तो विचार करें कि कौन-सा [networking model](/docs/concepts/cluster-administration/networking/) सबसे उपयुक्त है।
- क्या आप Kubernetes को **"bare metal" hardware** पर चलाएंगे या **virtual machines (VMs)** पर?
- क्या आप **केवल क्लस्टर चलाना चाहते हैं**, या आप Kubernetes प्रोजेक्ट कोड का **सक्रिय विकास** करने की योजना बना रहे हैं? यदि दूसरा विकल्प है, तो एक सक्रिय रूप से विकसित distro चुनें। कुछ distros केवल binary releases का उपयोग करते हैं, लेकिन अधिक विविधता प्रदान करते हैं।
- क्लस्टर चलाने के लिए आवश्यक [components](/docs/concepts/overview/components/) से स्वयं को परिचित करें।

## क्लस्टर का प्रबंधन करना

* जानें कि [nodes का प्रबंधन](/docs/concepts/architecture/nodes/) कैसे करें।
  * [Node autoscaling](/docs/concepts/cluster-administration/node-autoscaling/) के बारे में पढ़ें।

* साझा क्लस्टरों के लिए [resource quota](/docs/concepts/policy/resource-quotas/) सेटअप और प्रबंधन करना सीखें।

## क्लस्टर को सुरक्षित करना

* [Generate Certificates](/docs/tasks/administer-cluster/certificates/) विभिन्न tool chains का उपयोग करके certificates जनरेट करने के चरणों का वर्णन करता है।

* [Kubernetes Container Environment](/docs/concepts/containers/container-environment/) Kubernetes node पर Kubelet द्वारा प्रबंधित containers के environment का वर्णन करता है।

* [Controlling Access to the Kubernetes API](/docs/concepts/security/controlling-access) बताता है कि Kubernetes अपने API के लिए access control कैसे लागू करता है।

* [Authenticating](/docs/reference/access-authn-authz/authentication/) Kubernetes में authentication को समझाता है, जिसमें विभिन्न authentication विकल्प शामिल हैं।

* [Authorization](/docs/reference/access-authn-authz/authorization/) authentication से अलग है, और यह नियंत्रित करता है कि HTTP calls को कैसे संभाला जाता है।

* [Using Admission Controllers](/docs/reference/access-authn-authz/admission-controllers/) उन plug-ins को समझाता है जो authentication और authorization के बाद Kubernetes API server को किए गए requests को intercept करते हैं।

* [Admission Webhook Good Practices](/docs/concepts/cluster-administration/admission-webhooks-good-practices/) mutating admission webhooks और validating admission webhooks को डिज़ाइन करते समय अच्छी practices और विचारणीय बातें प्रदान करता है।

* [Using Sysctls in a Kubernetes Cluster](/docs/tasks/administer-cluster/sysctl-cluster/) एक administrator को बताता है कि kernel parameters सेट करने के लिए `sysctl` command-line tool का उपयोग कैसे करें।

* [Auditing](/docs/tasks/debug/debug-cluster/audit/) बताता है कि Kubernetes के audit logs के साथ कैसे इंटरैक्ट करें।

### kubelet को सुरक्षित करना

* [Control Plane-Node communication](/docs/concepts/architecture/control-plane-node-communication/)
* [TLS bootstrapping](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/)
* [Kubelet authentication/authorization](/docs/reference/access-authn-authz/kubelet-authn-authz/)

## वैकल्पिक क्लस्टर सेवाएँ

* [DNS Integration](/docs/concepts/services-networking/dns-pod-service/) बताता है कि किसी DNS नाम को सीधे Kubernetes service से कैसे resolve किया जाए।

* [Logging and Monitoring Cluster Activity](/docs/concepts/cluster-administration/logging/) बताता है कि Kubernetes में logging कैसे काम करती है और इसे कैसे implement करें।
