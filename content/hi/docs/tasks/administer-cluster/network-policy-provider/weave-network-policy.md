---
title: नेटवर्कपॉलिसी के लिए Weave Net
content_type: task
weight: 60
---

<!-- overview -->

यह पेज दिखाता है कि नेटवर्कपॉलिसी के लिए Weave Net का उपयोग कैसे करें।

## {{% heading "prerequisites" %}}

आपके पास एक कुबेरनेट्स क्लस्टर होना चाहिए। एक क्लस्टर बूटस्ट्रैप करने के लिए
[kubeadm गेटिंग स्टार्टेड गाइड](/docs/reference/setup-tools/kubeadm/) का पालन करें।

<!-- steps -->

## Weave Net ऐडऑन इंस्टॉल करें {#install-the-weave-net-addon}

[ऐडऑन के माध्यम से कुबेरनेट्स को इंटीग्रेट करना](https://github.com/weaveworks/weave/blob/master/site/kubernetes/kube-addon.md#-installation) गाइड का पालन करें।

कुबेरनेट्स के लिए Weave Net ऐडऑन एक
[नेटवर्क पॉलिसी कंट्रोलर](https://github.com/weaveworks/weave/blob/master/site/kubernetes/kube-addon.md#network-policy)
के साथ आता है, जो सभी नेमस्पेस पर किसी भी नेटवर्कपॉलिसी एनोटेशन के लिए कुबेरनेट्स की स्वचालित रूप से निगरानी करता है और पॉलिसीज़ के निर्देशानुसार ट्रैफ़िक को अनुमति देने या ब्लॉक करने के लिए `iptables` नियमों को कॉन्फ़िगर करता है।

## इंस्टॉलेशन का परीक्षण करें {#test-the-installation}

सत्यापित करें कि weave काम करता है।

निम्नलिखित कमांड दर्ज करें:

```shell
kubectl get pods -n kube-system -o wide
```

आउटपुट इसके समान है:

```
NAME                                    READY     STATUS    RESTARTS   AGE       IP              NODE
weave-net-1t1qg                         2/2       Running   0          9d        192.168.2.10    worknode3
weave-net-231d7                         2/2       Running   1          7d        10.2.0.17       worknodegpu
weave-net-7nmwt                         2/2       Running   3          9d        192.168.2.131   masternode
weave-net-pmw8w                         2/2       Running   0          9d        192.168.2.216   worknode2
```

प्रत्येक नोड में एक weave पॉड है, और सभी पॉड्स `Running` तथा `2/2 READY` हैं। (`2/2` का अर्थ है कि प्रत्येक पॉड में `weave` और `weave-npc` हैं।)

## {{% heading "whatsnext" %}}

एक बार जब आप Weave Net ऐडऑन इंस्टॉल कर लेते हैं, तो आप कुबेरनेट्स नेटवर्कपॉलिसी आज़माने के लिए
[नेटवर्क पॉलिसी घोषित करें](/docs/tasks/administer-cluster/declare-network-policy/)
का पालन कर सकते हैं। यदि आपका कोई प्रश्न है, तो हमसे
[Slack पर #weave-community या Weave यूज़र ग्रुप](https://github.com/weaveworks/weave#getting-help) पर संपर्क करें।
