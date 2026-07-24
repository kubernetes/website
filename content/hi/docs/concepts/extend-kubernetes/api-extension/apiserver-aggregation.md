---
title: कुबेरनेट्स API एग्रीगेशन लेयर
reviewers:
- lavalamp
- cheftako
- chenopis
content_type: concept
weight: 20
---

<!-- overview -->

एग्रीगेशन लेयर कुबेरनेट्स को कोर कुबेरनेट्स API द्वारा प्रदान की जाने वाली सुविधाओं से परे अतिरिक्त API के साथ विस्तारित करने की अनुमति देती है।
ये अतिरिक्त API या तो तैयार समाधान हो सकते हैं जैसे कि एक
[metrics server](https://github.com/kubernetes-sigs/metrics-server), या ऐसे API जिन्हें आप स्वयं विकसित करते हैं।

एग्रीगेशन लेयर [कस्टम रिसोर्स डेफ़िनिशन](/docs/concepts/extend-kubernetes/api-extension/custom-resources/) से अलग है,
जो {{< glossary_tooltip term_id="kube-apiserver" text="kube-apiserver" >}} को नए प्रकार के ऑब्जेक्ट को पहचानने का एक तरीका है।

<!-- body -->

## एग्रीगेशन लेयर

एग्रीगेशन लेयर kube-apiserver के साथ इन-प्रोसेस चलती है। जब तक कोई एक्सटेंशन रिसोर्स
पंजीकृत नहीं होता, तब तक एग्रीगेशन लेयर कुछ नहीं करती। किसी API को पंजीकृत करने के लिए, आप एक _APIService_
ऑब्जेक्ट जोड़ते हैं, जो कुबेरनेट्स API में URL पथ का "दावा" करता है। उस बिंदु पर, एग्रीगेशन लेयर
उस API पथ (उदाहरण के लिए `/apis/myextension.mycompany.io/v1/…`) पर भेजी गई किसी भी चीज़ को
पंजीकृत APIService पर प्रॉक्सी कर देगी।

APIService को लागू करने का सबसे सामान्य तरीका आपके क्लस्टर में चलने वाले Pod(s) में एक *एक्सटेंशन API सर्वर* चलाना है।
यदि आप अपने क्लस्टर में रिसोर्स प्रबंधित करने के लिए एक्सटेंशन API सर्वर का उपयोग कर रहे हैं, तो एक्सटेंशन API सर्वर
(जिसे "extension-apiserver" के रूप में भी लिखा जाता है) आमतौर पर एक या अधिक
{{< glossary_tooltip text="controllers" term_id="controller" >}} के साथ जोड़ा जाता है। apiserver-builder
लाइब्रेरी एक्सटेंशन API सर्वर और संबंधित कंट्रोलर(ओं) दोनों के लिए एक स्केलेटन प्रदान करती है।

### रिस्पॉन्स लेटेंसी

एक्सटेंशन API सर्वर की kube-apiserver से और उसकी ओर कम-लेटेंसी नेटवर्किंग होनी चाहिए।
डिस्कवरी अनुरोधों को kube-apiserver से पाँच सेकंड या उससे कम में राउंड-ट्रिप करना आवश्यक है।

यदि आपका एक्सटेंशन API सर्वर उस लेटेंसी आवश्यकता को पूरा नहीं कर सकता, तो ऐसे परिवर्तन करने पर विचार करें
जो आपको इसे पूरा करने में सक्षम बनाएँ।

## {{% heading "whatsnext" %}}

* अपने वातावरण में एग्रीगेटर को काम में लाने के लिए, [एग्रीगेशन लेयर कॉन्फ़िगर करें](/docs/tasks/extend-kubernetes/configure-aggregation-layer/)।
* फिर, एग्रीगेशन लेयर के साथ काम करने के लिए [एक एक्सटेंशन api-server सेटअप करें](/docs/tasks/extend-kubernetes/setup-extension-api-server/)।
* API संदर्भ में [APIService](/docs/reference/kubernetes-api/cluster-resources/api-service-v1/) के बारे में पढ़ें।
* [डिक्लेरेटिव वैलिडेशन कॉन्सेप्ट्स](/docs/reference/using-api/declarative-validation/) के बारे में जानें,
  जो वैलिडेशन नियमों को परिभाषित करने के लिए एक आंतरिक तंत्र है, और भविष्य में एक्सटेंशन API सर्वर विकास के लिए वैलिडेशन का समर्थन करने में मदद करेगा।

वैकल्पिक रूप से: [कस्टम रिसोर्स डेफ़िनिशन](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/) का उपयोग करके कुबेरनेट्स API का विस्तार करना सीखें।
