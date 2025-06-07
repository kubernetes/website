---
title: नेटवर्कपॉलिसी के लिए Antrea का उपयोग करें
content_type: task
weight: 10
---

<!-- overview -->
यह पेज कुबेरनेट्स पर Antrea CNI प्लगइन को कैसे इंस्टॉल और उपयोग करें, यह दिखाता है।
प्रोजेक्ट Antrea की पृष्ठभूमि के लिए, [Antrea का परिचय](https://antrea.io/docs/) पढ़ें।

## {{% heading "prerequisites" %}}

आपके पास एक कुबेरनेट्स क्लस्टर होना चाहिए। एक क्लस्टर को बूटस्ट्रैप करने के लिए
[kubeadm आरंभ करने की गाइड](/docs/reference/setup-tools/kubeadm/) का पालन करें।

<!-- steps -->

## kubeadm के साथ Antrea को डिप्लॉय करना

kubeadm के लिए Antrea को डिप्लॉय करने के लिए [आरंभ करने](https://github.com/vmware-tanzu/antrea/blob/main/docs/getting-started.md) की गाइड का पालन करें।

## {{% heading "whatsnext" %}}

एक बार जब आपका क्लस्टर चल रहा हो, तो आप कुबेरनेट्स नेटवर्कपॉलिसी को आज़माने के लिए [नेटवर्क पॉलिसी घोषित करें](/docs/tasks/administer-cluster/declare-network-policy/) का पालन कर सकते हैं।
