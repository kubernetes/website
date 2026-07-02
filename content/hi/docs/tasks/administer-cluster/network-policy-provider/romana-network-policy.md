---
reviewers:
- chrismarino
title: नेटवर्कपॉलिसी के लिए रोमाना
content_type: task
weight: 50
---

<!-- overview -->

यह पेज नेटवर्कपॉलिसी के लिए रोमाना का उपयोग कैसे करें, यह दिखाता है।

## {{% heading "prerequisites" %}}

[क्यूबऐडम आरंभ करने की गाइड](/docs/reference/setup-tools/kubeadm/) के चरण 1, 2, और 3 पूरे करें।

<!-- steps -->

## क्यूबऐडम के साथ रोमाना इंस्टॉल करना

क्यूबऐडम के लिए [कंटेनराइज़्ड इंस्टॉलेशन गाइड](https://github.com/romana/romana/tree/master/containerize) का पालन करें।

## नेटवर्क पॉलिसीज़ लागू करना

नेटवर्क पॉलिसीज़ लागू करने के लिए निम्नलिखित में से किसी एक का उपयोग करें:

* [रोमाना नेटवर्क पॉलिसीज़](https://github.com/romana/romana/wiki/Romana-policies)।
    * [रोमाना नेटवर्क पॉलिसी का उदाहरण](https://github.com/romana/core/blob/master/doc/policy.md)।
* नेटवर्कपॉलिसी एपीआई।

## {{% heading "whatsnext" %}}

एक बार जब आपने रोमाना इंस्टॉल कर लिया हो, तो आप कुबेरनेट्स नेटवर्कपॉलिसी को आज़माने के लिए
[नेटवर्क पॉलिसी घोषित करें](/docs/tasks/administer-cluster/declare-network-policy/)
का पालन कर सकते हैं।
