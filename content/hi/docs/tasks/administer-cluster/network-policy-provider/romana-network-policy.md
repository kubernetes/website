---
reviewers:
- dipesh-rawat
- divya-mohan0209
title: नेटवर्कपॉलिसी के लिए Romana
content_type: task
weight: 50
---

<!-- overview -->

यह पेज दिखाता है कि नेटवर्कपॉलिसी के लिए Romana का उपयोग कैसे करें।

## {{% heading "prerequisites" %}}

[kubeadm आरंभ करने की गाइड](/docs/reference/setup-tools/kubeadm/) के चरण 1, 2, और 3 को पूरा करें।

<!-- steps -->

## kubeadm के साथ Romana इंस्टॉल करना

kubeadm के लिए [कंटेनराइज्ड इंस्टॉलेशन गाइड](https://github.com/romana/romana/tree/master/containerize) का पालन करें।

## नेटवर्क पॉलिसीज़ लागू करना

नेटवर्क पॉलिसीज़ लागू करने के लिए निम्न में से एक का उपयोग करें:

* [Romana नेटवर्क पॉलिसीज़](https://github.com/romana/romana/wiki/Romana-policies)
    * [Romana नेटवर्क पॉलिसी का उदाहरण](https://github.com/romana/core/blob/master/doc/policy.md)
* नेटवर्कपॉलिसी API

## {{% heading "whatsnext" %}}

एक बार जब आप Romana इंस्टॉल कर लेते हैं, तो आप कुबेरनेट्स नेटवर्कपॉलिसी को आज़माने के लिए 
[नेटवर्क पॉलिसी घोषित करें](/docs/tasks/administer-cluster/declare-network-policy/) 
का पालन कर सकते हैं।
