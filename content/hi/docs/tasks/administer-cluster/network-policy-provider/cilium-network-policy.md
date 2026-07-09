---
title: नेटवर्कपॉलिसी के लिए Cilium का उपयोग करें
content_type: task
weight: 30
---

<!-- overview -->

यह पेज दिखाता है कि नेटवर्कपॉलिसी के लिए Cilium का उपयोग कैसे करें।

Cilium की पृष्ठभूमि जानने के लिए, [Cilium का परिचय](https://docs.cilium.io/en/stable/overview/intro) पढ़ें।

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## बुनियादी परीक्षण के लिए Minikube पर Cilium डिप्लॉय करना {#deploying-cilium-on-minikube-for-basic-testing}

Cilium से आसानी से परिचित होने के लिए, आप minikube में Cilium की एक बुनियादी DaemonSet इंस्टॉलेशन करने हेतु
[Cilium कुबेरनेट्स गेटिंग स्टार्टेड गाइड](https://docs.cilium.io/en/stable/gettingstarted/k8s-install-default/)
का पालन कर सकते हैं।

minikube शुरू करने के लिए, जिसके लिए संस्करण v1.5.2 या उससे उच्चतर आवश्यक है, इसे निम्नलिखित
आर्गुमेंट्स के साथ चलाएँ:

```shell
minikube version
```

```
minikube version: v1.5.2
```

```shell
minikube start --network-plugin=cni
```

minikube के लिए आप इसके CLI टूल का उपयोग करके Cilium इंस्टॉल कर सकते हैं। ऐसा करने के लिए, पहले
निम्नलिखित कमांड के साथ CLI का नवीनतम संस्करण डाउनलोड करें:

```shell
curl -LO https://github.com/cilium/cilium-cli/releases/latest/download/cilium-linux-amd64.tar.gz
```

फिर निम्नलिखित कमांड के साथ डाउनलोड की गई फ़ाइल को अपनी `/usr/local/bin` डायरेक्टरी में एक्सट्रैक्ट करें:

```shell
sudo tar xzvfC cilium-linux-amd64.tar.gz /usr/local/bin
rm cilium-linux-amd64.tar.gz
```

उपरोक्त कमांड चलाने के बाद, अब आप निम्नलिखित कमांड के साथ Cilium इंस्टॉल कर सकते हैं:

```shell
cilium install
```

इसके बाद Cilium स्वचालित रूप से क्लस्टर कॉन्फ़िगरेशन का पता लगाएगा और सफल इंस्टॉलेशन के लिए उपयुक्त
घटकों को बनाकर इंस्टॉल करेगा। ये घटक हैं:

- Secret `cilium-ca` में सर्टिफ़िकेट अथॉरिटी (CA) और Hubble (Cilium की ऑब्ज़र्वेबिलिटी लेयर) के लिए सर्टिफ़िकेट।
- सर्विस अकाउंट्स।
- क्लस्टर रोल्स।
- ConfigMap।
- एजेंट DaemonSet और एक ऑपरेटर Deployment।

इंस्टॉलेशन के बाद, आप `cilium status` कमांड से Cilium डिप्लॉयमेंट की समग्र स्थिति देख सकते हैं।
`status` कमांड का अपेक्षित आउटपुट
[यहाँ](https://docs.cilium.io/en/stable/gettingstarted/k8s-install-default/#validate-the-installation) देखें।

शेष गेटिंग स्टार्टेड गाइड यह समझाती है कि किसी उदाहरण एप्लिकेशन का उपयोग करके L3/L4
(अर्थात् IP पता + पोर्ट) सुरक्षा पॉलिसीज़ के साथ-साथ L7 (जैसे, HTTP) सुरक्षा
पॉलिसीज़ को कैसे लागू किया जाए।

## उत्पादन उपयोग के लिए Cilium डिप्लॉय करना {#deploying-cilium-for-production-use}

उत्पादन के लिए Cilium डिप्लॉय करने से संबंधित विस्तृत निर्देशों हेतु, देखें:
[Cilium कुबेरनेट्स इंस्टॉलेशन गाइड](https://docs.cilium.io/en/stable/network/kubernetes/concepts/)।
इस दस्तावेज़ में विस्तृत आवश्यकताएँ, निर्देश और उदाहरण
उत्पादन DaemonSet फ़ाइलें शामिल हैं।

<!-- discussion -->

## Cilium घटकों को समझना {#understanding-cilium-components}

Cilium के साथ एक क्लस्टर डिप्लॉय करने से `kube-system` नेमस्पेस में पॉड्स जुड़ जाते हैं। पॉड्स की यह
सूची देखने के लिए चलाएँ:

```shell
kubectl get pods --namespace=kube-system -l k8s-app=cilium
```

आपको इसके समान पॉड्स की एक सूची दिखाई देगी:

```console
NAME           READY   STATUS    RESTARTS   AGE
cilium-kkdhz   1/1     Running   0          3m23s
...
```

एक `cilium` पॉड आपके क्लस्टर के प्रत्येक नोड पर चलता है और Linux BPF का उपयोग करके उस नोड पर
पॉड्स से आने-जाने वाले ट्रैफ़िक पर नेटवर्क पॉलिसी लागू करता है।

## {{% heading "whatsnext" %}}

एक बार जब आपका क्लस्टर चल रहा हो, तो आप Cilium के साथ कुबेरनेट्स नेटवर्कपॉलिसी आज़माने के लिए
[नेटवर्क पॉलिसी घोषित करें](/docs/tasks/administer-cluster/declare-network-policy/)
का पालन कर सकते हैं।
आनंद लें, और यदि आपके कोई प्रश्न हों, तो
[Cilium Slack चैनल](https://slack.cilium.io/) का उपयोग करके हमसे संपर्क करें।
