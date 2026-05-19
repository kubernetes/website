---
title: क्लस्टर प्रशासन
reviewers:
- davidopp
- lavalamp
weight: 100
content_type: concept
description: >
  Kubernetes क्लस्टर बनाने या उसका प्रशासन करने से संबंधित निचले-स्तर का विवरण।
no_list: true
card:
  name: setup
  weight: 60
  anchors:
  - anchor: "#securing-a-cluster"
    title: क्लस्टर सुरक्षा
---

<!-- overview -->

क्लस्टर प्रशासन का यह अवलोकन उन सभी लोगों के लिए है जो Kubernetes क्लस्टर बनाते या संचालित करते हैं।
यह Kubernetes की मूल [अवधारणाओं](/docs/concepts/) की कुछ परिचित समझ मानकर चलता है।

<!-- body -->

## क्लस्टर की योजना बनाना

[Setup](/docs/setup/) में दिए गए मार्गदर्शक देखें, जिनमें Kubernetes क्लस्टर की योजना, सेटअप और कॉन्फ़िगरेशन के उदाहरण हैं।
इस लेख में सूचीबद्ध समाधानों को *distros* कहा जाता है।

{{< note  >}}
सभी distros सक्रिय रूप से बनाए नहीं रखे जाते। ऐसे distros चुनें जिन्हें Kubernetes के हाल के
संस्करण के साथ परखा गया हो।
{{< /note >}}

मार्गदर्शक चुनने से पहले, इन बातों पर विचार करें:

- क्या आप अपने कंप्यूटर पर Kubernetes आज़माना चाहते हैं, या उच्च उपलब्धता वाला, बहु-नोड क्लस्टर बनाना चाहते हैं?
  अपनी आवश्यकता के अनुरूप distro चुनें।
- क्या आप **होस्टेड Kubernetes क्लस्टर** (जैसे
  [Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine/)) का उपयोग करेंगे, या **अपना क्लस्टर स्वयं होस्ट** करेंगे?
- क्या आपका क्लस्टर **ऑन-प्रिमाइसेस** होगा, या **क्लाउड (IaaS)** में? Kubernetes सीधे हाइब्रिड क्लस्टरों का
  समर्थन नहीं करता। इसके बजाय, आप कई क्लस्टर सेटअप कर सकते हैं।
- **यदि आप Kubernetes को ऑन-प्रिमाइसेस कॉन्फ़िगर कर रहे हैं**, तो देखें कि कौन-सा
  [नेटवर्किंग मॉडल](/docs/concepts/cluster-administration/networking/) सबसे उपयुक्त है।
- क्या आप Kubernetes **"bare metal" हार्डवेयर** पर चलाएँगे या **वर्चुअल मशीनों (VMs)** पर?
- क्या आप **क्लस्टर चलाना** चाहते हैं, या **Kubernetes प्रोजेक्ट कोड का सक्रिय विकास** करना चाहते हैं?
  यदि दूसरा विकल्प है, तो सक्रिय रूप से विकसित होने वाला distro चुनें। कुछ distros केवल बाइनरी रिलीज़ का उपयोग करते हैं,
  लेकिन वे विकल्पों की अधिक विविधता देते हैं।
- क्लस्टर चलाने के लिए आवश्यक [घटकों](/docs/concepts/overview/components/) से परिचित हो जाएँ।

## क्लस्टर का प्रबंधन

* [नोड्स का प्रबंधन](/docs/concepts/architecture/nodes/) करना सीखें।
  * [नोड ऑटोस्केलिंग](/docs/concepts/cluster-administration/node-autoscaling/) के बारे में पढ़ें।

* साझा क्लस्टरों के लिए [रिसोर्स कोटा](/docs/concepts/policy/resource-quotas/) सेटअप और प्रबंधन करना सीखें।

## क्लस्टर सुरक्षा {#securing-a-cluster}

* [प्रमाणपत्र बनाना](/docs/tasks/administer-cluster/certificates/) अलग-अलग टूलचेन का उपयोग करके
  प्रमाणपत्र जनरेट करने के चरण बताता है।

* [Kubernetes कंटेनर वातावरण](/docs/concepts/containers/container-environment/) Kubernetes नोड पर
  Kubelet द्वारा प्रबंधित कंटेनरों के वातावरण का वर्णन करता है।

* [Kubernetes API तक पहुँच नियंत्रित करना](/docs/concepts/security/controlling-access) बताता है कि
  Kubernetes अपने API के लिए एक्सेस कंट्रोल कैसे लागू करता है।

* [प्रमाणीकरण](/docs/reference/access-authn-authz/authentication/) Kubernetes में authentication की
  व्याख्या करता है, जिसमें अलग-अलग authentication विकल्प शामिल हैं।

* [प्राधिकरण](/docs/reference/access-authn-authz/authorization/) authentication से अलग है, और
  नियंत्रित करता है कि HTTP कॉल्स कैसे संभाली जाती हैं।

* [Admission Controllers का उपयोग](/docs/reference/access-authn-authz/admission-controllers/) उन प्लग-इन की
  व्याख्या करता है जो Kubernetes API सर्वर पर authentication और authorization के बाद अनुरोधों को इंटरसेप्ट करते हैं।

* [Admission Webhook की अच्छी प्रथाएँ](/docs/concepts/cluster-administration/admission-webhooks-good-practices/)
  mutating admission webhooks और validating admission webhooks डिज़ाइन करते समय
  अच्छी प्रथाएँ और विचार प्रदान करता है।

* [Kubernetes क्लस्टर में Sysctls का उपयोग](/docs/tasks/administer-cluster/sysctl-cluster/)
  प्रशासक को बताता है कि kernel parameters सेट करने के लिए `sysctl` कमांड-लाइन टूल का उपयोग कैसे करें।

* [ऑडिटिंग](/docs/tasks/debug/debug-cluster/audit/) बताता है कि Kubernetes के audit logs के साथ कैसे इंटरैक्ट करें।

### kubelet की सुरक्षा

* [Control Plane-Node communication](/docs/concepts/architecture/control-plane-node-communication/)
* [TLS bootstrapping](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/)
* [Kubelet authentication/authorization](/docs/reference/access-authn-authz/kubelet-authn-authz/)

## वैकल्पिक क्लस्टर सेवाएँ

* [DNS एकीकरण](/docs/concepts/services-networking/dns-pod-service/) बताता है कि DNS नाम को सीधे Kubernetes
  सेवा पर कैसे resolve करें।

* [क्लस्टर गतिविधि का लॉगिंग और मॉनिटरिंग](/docs/concepts/cluster-administration/logging/)
  बताता है कि Kubernetes में लॉगिंग कैसे काम करती है और इसे कैसे लागू करें।
