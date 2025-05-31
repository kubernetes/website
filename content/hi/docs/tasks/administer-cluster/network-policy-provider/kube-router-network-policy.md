---
reviewers:
- dipesh-rawat
- divya-mohan0209
title: नेटवर्कपॉलिसी के लिए Kube-router का उपयोग
content_type: task
weight: 40
---

<!-- overview -->
यह पेज दिखाता है कि नेटवर्कपॉलिसी के लिए [Kube-router](https://github.com/cloudnativelabs/kube-router) का उपयोग कैसे करें।


## {{% heading "prerequisites" %}}

आपको एक चालू कुबेरनेट्स क्लस्टर की आवश्यकता होगी। यदि आपके पास पहले से क्लस्टर नहीं है, तो आप Kops, Bootkube, Kubeadm आदि जैसे किसी भी क्लस्टर इंस्टॉलर का उपयोग करके एक बना सकते हैं।


<!-- steps -->
## Kube-router एडऑन इंस्टॉल करना
Kube-router एडऑन एक नेटवर्क पॉलिसी कंट्रोलर के साथ आता है जो किसी भी नेटवर्कपॉलिसी और पॉड्स अपडेट के लिए कुबेरनेट्स API सर्वर पर नज़र रखता है और पॉलिसीज़ के निर्देशानुसार ट्रैफ़िक को अनुमति देने या ब्लॉक करने के लिए iptables नियमों और ipsets को कॉन्फ़िगर करता है। कृपया Kube-router एडऑन इंस्टॉल करने के लिए [क्लस्टर इंस्टॉलर्स के साथ Kube-router को आज़माना](https://www.kube-router.io/docs/user-guide/#try-kube-router-with-cluster-installers) गाइड का पालन करें।


## {{% heading "whatsnext" %}}

एक बार जब आप Kube-router एडऑन इंस्टॉल कर लेते हैं, तो आप कुबेरनेट्स नेटवर्कपॉलिसी को आज़माने के लिए [नेटवर्क पॉलिसी घोषित करें](/docs/tasks/administer-cluster/declare-network-policy/) का पालन कर सकते हैं।
