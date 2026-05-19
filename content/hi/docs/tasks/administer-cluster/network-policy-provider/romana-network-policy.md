---
reviewers:
- chrismarino
title: नेटवर्कपॉलिसी के लिए Romana
content_type: task
weight: 50
---

<!-- overview -->

यह पेज नेटवर्कपॉलिसी के लिए Romana का उपयोग कैसे करें, यह दिखाता है।

## {{% heading "prerequisites" %}}

[kubeadm आरंभ करने की गाइड](/docs/reference/setup-tools/kubeadm/) के चरण 1, 2, और 3 पूरे करें।

<!-- steps -->

## kubeadm के साथ Romana इंस्टॉल करना

kubeadm के लिए [कंटेनराइज़्ड इंस्टॉलेशन गाइड](https://github.com/romana/romana/tree/master/containerize) का पालन करें।

## नेटवर्क पॉलिसीज़ लागू करना

नेटवर्क पॉलिसीज़ लागू करने के लिए निम्नलिखित में से किसी एक का उपयोग करें:

* [Romana नेटवर्क पॉलिसीज़](https://github.com/romana/romana/wiki/Romana-policies)।
    * [Romana नेटवर्क पॉलिसी का उदाहरण](https://github.com/romana/core/blob/master/doc/policy.md)।
* NetworkPolicy API।

## {{% heading "whatsnext" %}}

एक बार जब आपने Romana इंस्टॉल कर लिया हो, तो आप कुबेरनेट्स नेटवर्कपॉलिसी को आज़माने के लिए
[नेटवर्क पॉलिसी घोषित करें](/docs/tasks/administer-cluster/declare-network-policy/)
का पालन कर सकते हैं।
