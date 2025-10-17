---
title: SOCKS5 प्रॉक्सी का उपयोग करके कुबेरनेट्स API तक पहुंचें
content_type: task
weight: 42
min-kubernetes-server-version: v1.24
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

यह पेज दिखाता है कि दूरस्थ कुबेरनेट्स क्लस्टर के API तक पहुंचने के लिए SOCKS5 प्रॉक्सी का उपयोग कैसे करें। यह तब उपयोगी होता है जब आप जिस क्लस्टर तक पहुंचना चाहते हैं वह अपना API सार्वजनिक इंटरनेट पर सीधे एक्सपोज़ नहीं करता।

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

आपको SSH क्लाइंट सॉफ्टवेयर (`ssh` टूल) और दूरस्थ सर्वर पर चल रही SSH सेवा की आवश्यकता होगी। आपको दूरस्थ सर्वर पर SSH सेवा में लॉग इन करने में सक्षम होना चाहिए।

<!-- steps -->

## कार्य संदर्भ

{{< note >}}
यह उदाहरण SSH का उपयोग करके ट्रैफ़िक को टनल करता है, जहां SSH क्लाइंट और सर्वर SOCKS प्रॉक्सी के रूप में कार्य करते हैं।
आप इसके बजाय किसी अन्य प्रकार के [SOCKS5](https://en.wikipedia.org/wiki/SOCKS#SOCKS5) प्रॉक्सी का उपयोग कर सकते हैं।
{{</ note >}}

चित्र 1 इस कार्य में आप जो प्राप्त करने जा रहे हैं उसे दर्शाता है।

* आपके पास एक क्लाइंट कंप्यूटर है, जिसे आगे के चरणों में स्थानीय के रूप में संदर्भित किया गया है, जहां से आप कुबेरनेट्स API से बात करने के लिए अनुरोध बनाने जा रहे हैं।
* कुबेरनेट्स सर्वर/API एक दूरस्थ सर्वर पर होस्ट किया गया है।
* आप स्थानीय और दूरस्थ सर्वर के बीच एक सुरक्षित SOCKS5 टनल बनाने के लिए SSH क्लाइंट और सर्वर सॉफ्टवेयर का उपयोग करेंगे। क्लाइंट और कुबेरनेट्स API के बीच HTTPS ट्रैफ़िक SOCKS5 टनल के माध्यम से प्रवाहित होगा, जो स्वयं SSH के माध्यम से टनल किया गया है।

{{< mermaid >}}
graph LR;

  subgraph local[Local client machine]
  client([client])-. local <br> traffic .->  local_ssh[Local SSH <br> SOCKS5 proxy];
  end
  local_ssh[SSH <br>SOCKS5 <br> proxy]-- SSH Tunnel -->sshd
  
  subgraph remote[Remote server]
  sshd[SSH <br> server]-- local traffic -->service1;
  end
  client([client])-. proxied HTTPs traffic <br> going through the proxy .->service1[कुबेरनेट्स API];

  classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
  classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
  classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
  class ingress,service1,service2,pod1,pod2,pod3,pod4 k8s;
  class client plain;
  class cluster cluster;
{{</ mermaid >}}
चित्र 1. SOCKS5 ट्यूटोरियल घटक

## SOCKS5 प्रॉक्सी बनाने के लिए ssh का उपयोग करें

निम्नलिखित कमांड आपके क्लाइंट मशीन और दूरस्थ SOCKS सर्वर के बीच एक SOCKS5 प्रॉक्सी शुरू करता है:

```shell
# SSH टनल आपके इसे चलाने के बाद फोरग्राउंड में चलता रहता है
ssh -D 1080 -q -N username@kubernetes-remote-server.example
```

SOCKS5 प्रॉक्सी आपको निम्नलिखित कॉन्फ़िगरेशन के आधार पर अपने क्लस्टर के API सर्वर से कनेक्ट करने की अनुमति देता है:
* `-D 1080`: स्थानीय पोर्ट :1080 पर SOCKS प्रॉक्सी खोलता है।
* `-q`: शांत मोड। अधिकांश चेतावनी और नैदानिक संदेशों को दबा देता है।
* `-N`: कोई दूरस्थ कमांड निष्पादित न करें। केवल पोर्ट फॉरवर्डिंग के लिए उपयोगी।
* `username@kubernetes-remote-server.example`: दूरस्थ SSH सर्वर जिसके पीछे कुबेरनेट्स क्लस्टर चल रहा है (उदाहरण: एक बैस्टियन होस्ट)।

## क्लाइंट कॉन्फ़िगरेशन

प्रॉक्सी के माध्यम से कुबेरनेट्स API सर्वर तक पहुंचने के लिए आपको `kubectl` को निर्देश देना होगा कि वह पहले बनाए गए `SOCKS` प्रॉक्सी के माध्यम से क्वेरी भेजे। यह या तो उचित environment variable सेट करके, या kubeconfig फ़ाइल में `proxy-url` विशेषता के माध्यम से करें। Environment variable का उपयोग करके:

```shell
export HTTPS_PROXY=socks5://localhost:1080
```

किसी विशिष्ट `kubectl` context पर हमेशा इस सेटिंग का उपयोग करने के लिए, `~/.kube/config` फ़ाइल में प्रासंगिक `cluster` प्रविष्टि के भीतर `proxy-url` विशेषता निर्दिष्ट करें। उदाहरण के लिए:

```yaml
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: LRMEMMW2 # पठनीयता के लिए संक्षिप्त
    server: https://<API_SERVER_IP_ADDRESS>:6443  # "कुबेरनेट्स API" सर्वर, दूसरे शब्दों में kubernetes-remote-server.example का IP पता
    proxy-url: socks5://localhost:1080   # ऊपर के चित्र में "SSH SOCKS5 proxy"
  name: default
contexts:
- context:
    cluster: default
    user: default
  name: default
current-context: default
kind: Config
preferences: {}
users:
- name: default
  user:
    client-certificate-data: LS0tLS1CR== # पठनीयता के लिए संक्षिप्त
    client-key-data: LS0tLS1CRUdJT=      # पठनीयता के लिए संक्षिप्त
```

एक बार जब आपने पहले उल्लिखित ssh कमांड के माध्यम से टनल बना लिया है, और या तो environment variable या `proxy-url` विशेषता को परिभाषित कर लिया है, तो आप उस प्रॉक्सी के माध्यम से अपने क्लस्टर के साथ बातचीत कर सकते हैं। उदाहरण के लिए:

```shell
kubectl get pods
```

```console
NAMESPACE     NAME                                     READY   STATUS      RESTARTS   AGE
kube-system   coredns-85cb69466-klwq8                  1/1     Running     0          5m46s
```

{{< note >}}
- `kubectl` 1.24 से पहले, SOCKS प्रॉक्सी का उपयोग करते समय अधिकांश `kubectl` कमांड काम करते थे, `kubectl exec` को छोड़कर।
- `kubectl` दोनों `HTTPS_PROXY` और `https_proxy` environment variables का समर्थन करता है। इनका उपयोग अन्य प्रोग्रामों द्वारा किया जाता है जो SOCKS का समर्थन करते हैं, जैसे `curl`। इसलिए कुछ मामलों में कमांड लाइन पर environment variable को परिभाषित करना बेहतर होगा:
  ```shell
  HTTPS_PROXY=socks5://localhost:1080 kubectl get pods
  ```
- `proxy-url` का उपयोग करते समय, प्रॉक्सी का उपयोग केवल प्रासंगिक `kubectl` context के लिए किया जाता है,
  जबकि environment variable सभी contexts को प्रभावित करेगा।
- k8s API सर्वर hostname को DNS लीकेज से और अधिक सुरक्षित किया जा सकता है `socks5h` प्रोटोकॉल नाम का उपयोग करके
  ऊपर दिखाए गए अधिक सामान्यतः ज्ञात `socks5` प्रोटोकॉल के बजाय। इस मामले में, `kubectl` प्रॉक्सी सर्वर (जैसे ssh bastion) से k8s API सर्वर domain name को resolve करने के लिए कहेगा, बजाय `kubectl` चलाने वाले सिस्टम पर इसे resolve करने के। यह भी ध्यान दें कि `socks5h` के साथ, `https://localhost:6443/api` जैसा k8s API सर्वर URL आपके स्थानीय क्लाइंट कंप्यूटर को संदर्भित नहीं करता। इसके बजाय, यह प्रॉक्सी सर्वर (जैसे ssh bastion) पर ज्ञात `localhost` को संदर्भित करता है।
{{</ note >}}

## सफाई

ssh पोर्ट-फॉरवर्डिंग प्रक्रिया को रोकने के लिए जिस टर्मिनल में यह चल रहा है उसमें `CTRL+C` दबाएं।

HTTP ट्रैफ़िक को प्रॉक्सी के माध्यम से फॉरवर्ड करना बंद करने के लिए टर्मिनल में `unset https_proxy` टाइप करें।

## आगे पढ़ें

* [OpenSSH remote login client](https://man.openbsd.org/ssh)

## {{% heading "whatsnext" %}}

* [HTTP प्रॉक्सी का उपयोग करके कुबेरनेट्स API तक पहुंचें](/docs/tasks/extend-kubernetes/http-proxy-access-api/)
* [Konnectivity सेटअप](/docs/tasks/extend-kubernetes/setup-konnectivity/) 