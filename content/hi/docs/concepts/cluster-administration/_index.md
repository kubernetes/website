---
title: क्लस्टर प्रशासन (Cluster Administration)
reviewers:
- davidopp
- lavalamp
weight: 100
content_type: concept
description: >
  कुबेरनेट्स क्लस्टर (Kubernetes cluster) को बनाने या उसका प्रशासन करने से संबंधित निम्न-स्तरीय विवरण।
no_list: true
card:
  name: setup
  weight: 60
  anchors:
  - anchor: "#securing-a-cluster"
    title: क्लस्टर को सुरक्षित करना
---

<!-- overview -->

क्लस्टर प्रशासन का अवलोकन उन सभी लोगों के लिए है जो कुबेरनेट्स क्लस्टर बना रहे हैं या उसका प्रशासन कर रहे हैं।
यह मानता है कि आप कुबेरनेट्स की मुख्य [अवधारणाओं (concepts)](/hi/docs/concepts/) से कुछ परिचित हैं।

<!-- body -->

## क्लस्टर की योजना बनाना

[सेटअप (Setup)](/hi/docs/setup/) में दिए गए गाइड्स देखें, जो बताते हैं कि कुबेरनेट्स क्लस्टर की योजना कैसे बनाएं, उसे सेटअप कैसे करें और कॉन्फ़िगर कैसे करें।
इस लेख में सूचीबद्ध समाधानों को *डिस्ट्रो (distros)* कहा जाता है।

{{< note >}}
सभी डिस्ट्रोस सक्रिय रूप से मेंटेन नहीं किए जाते हैं। ऐसे डिस्ट्रोस चुनें जिन्हें कुबेरनेट्स के हाल के संस्करण के साथ परीक्षण किया गया हो।
{{< /note >}}

गाइड चुनने से पहले, निम्नलिखित बातों पर विचार करें:

- क्या आप अपने कंप्यूटर पर कुबेरनेट्स को आज़माना चाहते हैं, या एक हाई-अवेलेबिलिटी (high-availability), मल्टी-नोड क्लस्टर बनाना चाहते हैं? अपनी आवश्यकताओं के अनुसार उपयुक्त डिस्ट्रोस चुनें।
- क्या आप **होस्ट किए गए कुबेरनेट्स क्लस्टर** का उपयोग करेंगे, जैसे कि [Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine/), या **अपना खुद का क्लस्टर होस्ट करेंगे**?
- क्या आपका क्लस्टर **ऑन-प्रिमाइसेस (on-premises)** होगा, या **क्लाउड (IaaS)** में? कुबेरनेट्स सीधे हाइब्रिड क्लस्टर्स का समर्थन नहीं करता है; इसके बजाय, आप कई क्लस्टर सेटअप कर सकते हैं।
- **यदि आप ऑन-प्रिमाइसेस कुबेरनेट्स कॉन्फ़िगर कर रहे हैं**, तो विचार करें कि कौन सा [नेटवर्किंग मॉडल](/hi/docs/concepts/cluster-administration/networking/) सबसे उपयुक्त है।
- क्या आप कुबेरनेट्स को **"बेयर मेटल" (bare metal)** हार्डवेयर पर या **वर्चुअल मशीनों (VMs)** पर चलाएंगे?
- क्या आप **क्लस्टर चलाना चाहते हैं**, या आप **कुबेरनेट्स प्रोजेक्ट कोड का सक्रिय विकास** करना चाहते हैं? यदि बाद वाला हो, तो सक्रिय रूप से विकसित डिस्ट्रो चुनें। कुछ डिस्ट्रोस केवल बाइनरी रिलीज़ का उपयोग करते हैं, लेकिन विकल्पों की अधिक विविधता प्रदान करते हैं।
- क्लस्टर चलाने के लिए आवश्यक [घटकों (components)](/hi/docs/concepts/overview/components/) से स्वयं को परिचित करें।

## क्लस्टर का प्रबंधन

- जानें कि [नोड्स का प्रबंधन (manage nodes)](/hi/docs/concepts/architecture/nodes/) कैसे करें।
  - [नोड ऑटोस्केलिंग (Node autoscaling)](/hi/docs/concepts/cluster-administration/node-autoscaling/) के बारे में पढ़ें।

- साझा क्लस्टर्स के लिए [रिसोर्स कोटा (resource quota)](/hi/docs/concepts/policy/resource-quotas/) को सेटअप और प्रबंधित करना सीखें।

## क्लस्टर को सुरक्षित करना

- [प्रमाणपत्र उत्पन्न करना (Generate Certificates)](/hi/docs/tasks/administer-cluster/certificates/) विभिन्न टूल चेन का उपयोग करके प्रमाणपत्र बनाने के चरणों का वर्णन करता है।

- [कुबेरनेट्स कंटेनर एनवायरनमेंट](/hi/docs/concepts/containers/container-environment/) कुबेरनेट्स नोड पर क्यूबलेट (Kubelet) द्वारा प्रबंधित कंटेनरों के वातावरण का वर्णन करता है।

- [कुबेरनेट्स API तक पहुंच को नियंत्रित करना](/hi/docs/concepts/security/controlling-access) यह बताता है कि कुबेरनेट्स अपने API के लिए एक्सेस कंट्रोल कैसे लागू करता है।

- [प्रमाणीकरण (Authenticating)](/hi/docs/reference/access-authn-authz/authentication/) कुबेरनेट्स में प्रमाणीकरण की व्याख्या करता है, जिसमें विभिन्न प्रमाणीकरण विकल्प शामिल हैं।

- [प्राधिकरण (Authorization)](/hi/docs/reference/access-authn-authz/authorization/) प्रमाणीकरण से अलग है और यह नियंत्रित करता है कि HTTP कॉल को कैसे संभाला जाए।

- [एडमिशन कंट्रोलर्स का उपयोग करना](/hi/docs/reference/access-authn-authz/admission-controllers/) उन प्लग-इन्स की व्याख्या करता है जो प्रमाणीकरण और प्राधिकरण के बाद कुबेरनेट्स API सर्वर के अनुरोधों को इंटरसेप्ट करते हैं।

- [एडमिशन वेबहुक सर्वोत्तम अभ्यास](/hi/docs/concepts/cluster-administration/admission-webhooks-good-practices/) म्यूटेटिंग और वैलिडेटिंग एडमिशन वेबहुक डिज़ाइन करते समय सर्वोत्तम प्रथाओं और विचारों को प्रदान करता है।

- [कुबेरनेट्स क्लस्टर में Sysctls का उपयोग करना](/hi/docs/tasks/administer-cluster/sysctl-cluster/) एक प्रशासक को यह बताता है कि `sysctl` कमांड-लाइन टूल का उपयोग करके कर्नेल पैरामीटर कैसे सेट किए जाएं।

- [ऑडिटिंग (Auditing)](/hi/docs/tasks/debug/debug-cluster/audit/) यह बताता है कि कुबेरनेट्स के ऑडिट लॉग्स के साथ कैसे इंटरैक्ट किया जाए।

### क्यूबलेट (Kubelet) को सुरक्षित करना

- [कंट्रोल प्लेन-नोड संचार](/hi/docs/concepts/architecture/control-plane-node-communication/)
- [TLS बूटस्ट्रैपिंग](/hi/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/)
- [क्यूबलेट प्रमाणीकरण/प्राधिकरण](/hi/docs/reference/access-authn-authz/kubelet-authn-authz/)

## वैकल्पिक क्लस्टर सेवाएं

- [DNS एकीकरण](/hi/docs/concepts/services-networking/dns-pod-service/) यह बताता है कि DNS नाम को सीधे कुबेरनेट्स सेवा में कैसे resolve किया जाए।

- [क्लस्टर गतिविधि की लॉगिंग और निगरानी](/hi/docs/concepts/cluster-administration/logging/) यह समझाता है कि कुबेरनेट्स में लॉगिंग कैसे काम करती है और इसे कैसे लागू किया जाए।