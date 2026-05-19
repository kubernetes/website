---
reviewers:
- danwent
- aanm
title: नेटवर्कपॉलिसी के लिए Cilium का उपयोग करें
content_type: task
weight: 30
---

<!-- overview -->

यह पेज नेटवर्कपॉलिसी के लिए Cilium का उपयोग कैसे करें, यह दिखाता है।

Cilium की पृष्ठभूमि के लिए, [Cilium का परिचय](https://docs.cilium.io/en/stable/overview/intro) पढ़ें।

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## बेसिक टेस्टिंग के लिए Minikube पर Cilium डिप्लॉय करना

Cilium से आसानी से परिचित होने के लिए आप
[Cilium Kubernetes आरंभ करने की गाइड](https://docs.cilium.io/en/stable/gettingstarted/k8s-install-default/)
का पालन करके minikube में Cilium का बेसिक DaemonSet इंस्टॉलेशन कर सकते हैं।

minikube शुरू करने के लिए, जिसके लिए v1.5.2 या उससे ऊपर का वर्शन आवश्यक है, निम्नलिखित आर्गुमेंट्स के साथ चलाएं:

```shell
minikube version
```

```
minikube version: v1.5.2
```

```shell
minikube start --network-plugin=cni
```

minikube के लिए आप Cilium को उसके CLI टूल का उपयोग करके इंस्टॉल कर सकते हैं। ऐसा करने के लिए, पहले निम्नलिखित कमांड से CLI का नवीनतम वर्शन डाउनलोड करें:

```shell
curl -LO https://github.com/cilium/cilium-cli/releases/latest/download/cilium-linux-amd64.tar.gz
```

फिर डाउनलोड की गई फ़ाइल को निम्नलिखित कमांड से अपनी `/usr/local/bin` डायरेक्टरी में एक्सट्रैक्ट करें:

```shell
sudo tar xzvfC cilium-linux-amd64.tar.gz /usr/local/bin
rm cilium-linux-amd64.tar.gz
```

ऊपर दिए गए कमांड चलाने के बाद, अब आप निम्नलिखित कमांड से Cilium इंस्टॉल कर सकते हैं:

```shell
cilium install
```

Cilium स्वचालित रूप से क्लस्टर कॉन्फ़िगरेशन का पता लगाएगा और सफल इंस्टॉलेशन के लिए उचित कंपोनेंट्स बनाएगा और इंस्टॉल करेगा।
कंपोनेंट्स हैं:

- Secret `cilium-ca` में Certificate Authority (CA) और Hubble (Cilium की ऑब्ज़र्वेबिलिटी लेयर) के लिए सर्टिफिकेट।
- Service accounts।
- Cluster roles।
- ConfigMap।
- Agent DaemonSet और एक Operator Deployment।

इंस्टॉलेशन के बाद, आप `cilium status` कमांड से Cilium डिप्लॉयमेंट की समग्र स्थिति देख सकते हैं।
`status` कमांड का अपेक्षित आउटपुट
[यहाँ](https://docs.cilium.io/en/stable/gettingstarted/k8s-install-default/#validate-the-installation) देखें।

शेष आरंभ करने की गाइड एक उदाहरण एप्लिकेशन का उपयोग करके L3/L4
(यानी, IP एड्रेस + पोर्ट) सिक्योरिटी पॉलिसीज़ और L7 (जैसे, HTTP) सिक्योरिटी
पॉलिसीज़ दोनों को लागू करने का तरीका बताती है।

## प्रोडक्शन उपयोग के लिए Cilium डिप्लॉय करना

प्रोडक्शन के लिए Cilium डिप्लॉय करने के विस्तृत निर्देशों के लिए, देखें:
[Cilium Kubernetes इंस्टॉलेशन गाइड](https://docs.cilium.io/en/stable/network/kubernetes/concepts/)
इस डॉक्यूमेंटेशन में विस्तृत आवश्यकताएं, निर्देश और उदाहरण
प्रोडक्शन DaemonSet फ़ाइलें शामिल हैं।

<!-- discussion -->

## Cilium कंपोनेंट्स को समझना

Cilium के साथ क्लस्टर डिप्लॉय करने से `kube-system` नेमस्पेस में पॉड्स जुड़ जाते हैं। इन
पॉड्स की सूची देखने के लिए चलाएं:

```shell
kubectl get pods --namespace=kube-system -l k8s-app=cilium
```

आपको इसके जैसी पॉड्स की सूची दिखेगी:

```console
NAME           READY   STATUS    RESTARTS   AGE
cilium-kkdhz   1/1     Running   0          3m23s
...
```

एक `cilium` पॉड आपके क्लस्टर के प्रत्येक नोड पर चलता है और Linux BPF का उपयोग करके
उस नोड पर पॉड्स के ट्रैफ़िक पर नेटवर्क पॉलिसी लागू करता है।

## {{% heading "whatsnext" %}}

एक बार जब आपका क्लस्टर चल रहा हो, तो आप कुबेरनेट्स नेटवर्कपॉलिसी को आज़माने के लिए
[नेटवर्क पॉलिसी घोषित करें](/docs/tasks/administer-cluster/declare-network-policy/)
का पालन कर सकते हैं।
यदि आपके कोई प्रश्न हैं, तो हमसे
[Cilium Slack Channel](https://slack.cilium.io/) पर संपर्क करें।
