---
title: कुबरनेट्स API एग्रीगेशन लेयर
reviewers:
- lavalamp
- cheftako
- chenopis
content_type: concept
weight: 20
---

<!-- overview -->

एग्रीगेशन लेयर कुबरनेट्स को कोर कुबरनेट्स API द्वारा प्रदान की जाने वाली सुविधाओं से आगे, अतिरिक्त
API का विस्तार करने की अनुमति देती है।
ये अतिरिक्त API या तो [metrics server](https://github.com/kubernetes-sigs/metrics-server) जैसे
रेडी-मेड समाधान हो सकते हैं, या फिर वे API हो सकते हैं जो आप स्वयं डेवलप करते हैं।

एग्रीगेशन लेयर [कस्टम रिसोर्स डेफ़िनिशन](/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
से अलग है, जो {{< glossary_tooltip term_id="kube-apiserver" text="kube-apiserver" >}} को नए प्रकार के
ऑब्जेक्ट पहचानने में सक्षम बनाने का एक तरीका है।

<!-- body -->

## एग्रीगेशन लेयर

एग्रीगेशन लेयर kube-apiserver के साथ इन-प्रोसेस चलती है। जब तक कोई एक्सटेंशन रिसोर्स पंजीकृत नहीं हो
जाता, एग्रीगेशन लेयर कुछ नहीं करती। किसी API को पंजीकृत करने के लिए, आप एक _APIService_ ऑब्जेक्ट जोड़ते
हैं, जो कुबरनेट्स API में URL पाथ का "दावा" करता है। इस बिंदु पर, एग्रीगेशन लेयर उस API पाथ पर भेजी
गई किसी भी चीज़ (जैसे `/apis/myextension.mycompany.io/v1/…`) को पंजीकृत APIService पर प्रॉक्सी कर
देगी।

APIService को लागू करने का सबसे सामान्य तरीका यह है कि आप अपने क्लस्टर में चलने वाले पॉड में एक
*एक्सटेंशन API सर्वर* चलाएँ। अगर आप अपने क्लस्टर में रिसोर्स प्रबंधित करने के लिए एक्सटेंशन API सर्वर का
उपयोग कर रहे हैं, तो एक्सटेंशन API सर्वर (जिसे "extension-apiserver" भी लिखा जाता है) आमतौर पर एक या
अधिक {{< glossary_tooltip text="नियंत्रकों" term_id="controller" >}} के साथ जोड़ा जाता है।
apiserver-builder लाइब्रेरी एक्सटेंशन API सर्वर और संबंधित नियंत्रक(ओं), दोनों के लिए एक स्केलेटन
प्रदान करती है।

### रिस्पॉन्स लेटेंसी

एक्सटेंशन API सर्वर की kube-apiserver से आने-जाने वाली नेटवर्किंग में लेटेंसी कम होनी चाहिए। डिस्कवरी
रिक्वेस्ट को kube-apiserver से पाँच सेकंड या उससे कम समय में राउंड-ट्रिप करना आवश्यक है।

अगर आपका एक्सटेंशन API सर्वर इस लेटेंसी आवश्यकता को पूरा नहीं कर पाता, तो ऐसे बदलाव करने पर विचार करें
जिनसे आप इसे पूरा कर सकें।

## {{% heading "whatsnext" %}}

* अपने वातावरण में एग्रीगेटर को काम करने योग्य बनाने के लिए, [एग्रीगेशन लेयर कॉन्फ़िगर करें](/docs/tasks/extend-kubernetes/configure-aggregation-layer/)।
* फिर, एग्रीगेशन लेयर के साथ काम करने के लिए [एक्सटेंशन api-server सेटअप करें](/docs/tasks/extend-kubernetes/setup-extension-api-server/)।
* API संदर्भ में [APIService](/docs/reference/kubernetes-api/cluster-resources/api-service-v1/) के बारे में पढ़ें
* [डिक्लेरेटिव वैलिडेशन कॉन्सेप्ट](/docs/reference/using-api/declarative-validation/) के बारे में जानें,
  यह वैलिडेशन नियम परिभाषित करने का एक इंटरनल तंत्र है जो भविष्य में एक्सटेंशन API सर्वर डेवलपमेंट
  के लिए वैलिडेशन का समर्थन करने में मदद करेगा।

वैकल्पिक रूप से: जानें कि [कस्टम रिसोर्स डेफ़िनिशन](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/)
का उपयोग करके कुबरनेट्स API का विस्तार कैसे करें।
