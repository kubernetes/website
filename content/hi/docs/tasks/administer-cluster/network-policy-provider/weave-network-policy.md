---
reviewers:
- bboreham
title: नेटवर्कपॉलिसी के लिए वीव नेट
content_type: task
weight: 60
---

<!-- overview -->

यह पेज नेटवर्कपॉलिसी के लिए वीव नेट का उपयोग कैसे करें, यह दिखाता है।

## {{% heading "prerequisites" %}}

आपके पास एक कुबेरनेट्स क्लस्टर होना चाहिए। एक क्लस्टर को बूटस्ट्रैप करने के लिए
[क्यूबऐडम आरंभ करने की गाइड](/docs/reference/setup-tools/kubeadm/) का पालन करें।

<!-- steps -->

## वीव नेट ऐडऑन इंस्टॉल करें

[ऐडऑन के माध्यम से कुबेरनेट्स को इंटीग्रेट करना](https://github.com/weaveworks/weave/blob/master/site/kubernetes/kube-addon.md#-installation) गाइड का पालन करें।

कुबेरनेट्स के लिए वीव नेट ऐडऑन एक
[नेटवर्क पॉलिसी कंट्रोलर](https://github.com/weaveworks/weave/blob/master/site/kubernetes/kube-addon.md#network-policy)
के साथ आता है जो सभी नेमस्पेस पर किसी भी नेटवर्कपॉलिसी एनोटेशन के लिए स्वचालित रूप से कुबेरनेट्स की निगरानी करता है
और पॉलिसीज़ द्वारा निर्देशित ट्रैफ़िक को अनुमति या ब्लॉक करने के लिए `iptables` नियम कॉन्फ़िगर करता है।

## इंस्टॉलेशन का परीक्षण करें

सत्यापित करें कि वीव काम कर रहा है।

निम्नलिखित कमांड दर्ज करें:

```shell
kubectl get pods -n kube-system -o wide
```

आउटपुट इसके जैसा होगा:

```
NAME                                    READY     STATUS    RESTARTS   AGE       IP              NODE
weave-net-1t1qg                         2/2       Running   0          9d        192.168.2.10    worknode3
weave-net-231d7                         2/2       Running   1          7d        10.2.0.17       worknodegpu
weave-net-7nmwt                         2/2       Running   3          9d        192.168.2.131   masternode
weave-net-pmw8w                         2/2       Running   0          9d        192.168.2.216   worknode2
```

प्रत्येक नोड पर एक वीव पॉड है, और सभी पॉड्स `Running` और `2/2 READY` हैं। (`2/2` का मतलब है कि प्रत्येक पॉड में `weave` और `weave-npc` है।)

## {{% heading "whatsnext" %}}

एक बार जब आपने वीव नेट ऐडऑन इंस्टॉल कर लिया हो, तो आप कुबेरनेट्स नेटवर्कपॉलिसी को आज़माने के लिए
[नेटवर्क पॉलिसी घोषित करें](/docs/tasks/administer-cluster/declare-network-policy/)
का पालन कर सकते हैं। यदि आपके कोई प्रश्न हैं, तो
[#weave-community स्लैक या वीव यूज़र ग्रुप](https://github.com/weaveworks/weave#getting-help) पर संपर्क करें।
