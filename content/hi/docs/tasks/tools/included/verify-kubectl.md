---
title: "kubectl इंस्टॉल सत्यापित करें"
description: "kubectl कैसे सत्यापित करें।"
headless: true
---

kubectl को कुबेरनेट्स क्लस्टर को खोजने और एक्सेस करने के लिए, उसे
[क्यूबकॉन्फिग फाइल](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)(kubeconfig) की आवश्यकता होती है,
जो स्वचालित रूप से तब बनता है जब आप
[kube-up.sh](https://github.com/kubernetes/kubernetes/blob/master/cluster/kube-up.sh) का उपयोग करके क्लस्टर बनाते हैं
या मिनीक्यूब क्लस्टर को सफलतापूर्वक डिप्लॉय करते हैं।
डिफ़ॉल्ट रूप से, kubectl कॉन्फ़िगरेशन `~/.kube/config` पर स्थित होता है।

जाँच करें कि क्लस्टर स्टेट प्राप्त करके kubectl को ठीक से कॉन्फ़िगर किया गया है:

```shell
kubectl cluster-info
```

यदि आपको एक URL प्रतिक्रिया दिखती हैं, तो kubectl आपके क्लस्टर तक पहुँचने के लिए सही ढंग से कॉन्फ़िगर हुआ है।

यदि आपको निम्नलिखित संदेश दिखाई देता है, तो kubectl ठीक से कॉन्फ़िगर नहीं हुआ है या कुबेरनेट्स क्लस्टर से कनेक्ट करने में सक्षम नहीं है।

```
The connection to the server <server-name:port> was refused - did you specify the right host or port?
```

उदाहरण के लिए, यदि आप अपने लैपटॉप (स्थानीय रूप से) पर कुबेरनेट्स क्लस्टर चलाना चाहते हैं, तो आपको पहले मिनीक्यूब (minikube) जैसे टूल को इंस्टॉल करना होगा और ऊपर बताए गए कमांड को फिर से चलाना होगा।

यदि `kubectl cluster-info` URL प्रतिक्रिया देता है, लेकिन आप अपने क्लस्टर को एक्सेस नहीं कर पा रहें हैं, तो यह जाँचने के लिए कि क्या यह ठीक से कॉन्फ़िगर किया गया है, इस कमांड का उपयोग करें:

```shell
kubectl cluster-info dump
```
