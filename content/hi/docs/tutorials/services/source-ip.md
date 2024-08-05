---
title: स्रोत आईपी का उपयोग करें
content_type: tutorial
min-kubernetes-server-version: v1.5
weight: 40
---

<!-- overview -->

Kubernetes क्लस्टर में चलने वाले एप्लिकेशन सर्विस एब्स्ट्रैक्शन के ज़रिए एक-दूसरे और बाहरी दुनिया से संपर्क करते हैं और उनसे संवाद करते हैं। यह दस्तावेज़ बताता है कि अलग-अलग तरह की सेवाओं को भेजे जाने वाले पैकेट के स्रोत IP का क्या होता है और आप अपनी ज़रूरतों के हिसाब से इस व्यवहार को कैसे बदल सकते हैं।



## {{% heading "prerequisites" %}}


### शब्दावली

इस दस्तावेज़ में निम्नलिखित शब्दों का प्रयोग किया गया है:

{{< comment >}}
यदि इस अनुभाग का स्थानीयकरण किया जा रहा है, तो लक्ष्य स्थानीयकरण के लिए समकक्ष विकिपीडिया पृष्ठों से लिंक करें।
{{< /comment >}}

[NAT](https://en.wikipedia.org/wiki/Network_address_translation)
: नेटवर्क एड्रेस ट्रांसलेशन

[Source NAT](https://en.wikipedia.org/wiki/Network_address_translation#SNAT)
: पैकेट पर स्रोत आईपी को प्रतिस्थापित करना; इस पृष्ठ पर, इसका अर्थ आमतौर पर नोड के आईपी पते के साथ प्रतिस्थापित करना है।

[Destination NAT](https://en.wikipedia.org/wiki/Network_address_translation#DNAT)
: पैकेट पर गंतव्य आईपी को प्रतिस्थापित करना; इस पृष्ठ पर, इसका मतलब आमतौर पर {{<glossary_tooltip term_id="pod" text="पॉड" >}} के आईपी पते के साथ प्रतिस्थापित करना है 

[VIP](/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies)
: एक वर्चुअल आईपी पता, जैसे कि कुबेरनेट्स में प्रत्येक {{<glossary_tooltip text="सेवा" term_id="service" >}} को निर्दिष्ट किया गया है

[kube-proxy](/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies)
: एक नेटवर्क डेमॉन जो प्रत्येक नोड पर सेवा वीआईपी प्रबंधन को व्यवस्थित करता है

### Prerequisites

{{< include "task-tutorial-prereqs.md" >}}

उदाहरणों में एक छोटे nginx वेबसर्वर का उपयोग किया गया है जो HTTP हेडर के माध्यम से प्राप्त अनुरोधों के स्रोत IP को प्रतिध्वनित करता है। आप इसे निम्न प्रकार से बना सकते हैं:

{{< note >}}
निम्नलिखित कमांड में दी गई छवि केवल AMD64 आर्किटेक्चर पर चलती है।
{{< /note >}}

```shell
kubectl create deployment source-ip-app --image=registry.k8s.io/echoserver:1.4
```
आउटपुट है:
```
deployment.apps/source-ip-app created
```


## {{% heading "objectives" %}}


* विभिन्न प्रकार की सेवाओं के माध्यम से एक सरल अनुप्रयोग को उजागर करें
* समझें कि प्रत्येक सेवा प्रकार स्रोत IP NAT को कैसे संभालता है
* स्रोत IP को संरक्षित करने में शामिल ट्रेडऑफ़ को समझें




<!-- lessoncontent -->

## `Type=ClusterIP` वाली सेवाओं के लिए स्रोत IP

यदि आप kube-proxy को [iptables मोड](/docs/reference/networking/virtual-ips/#proxy-mode-iptables) 
(डिफ़ॉल्ट) में चला रहे हैं, तो क्लस्टर के भीतर से ClusterIP को भेजे गए पैकेट कभी भी स्रोत NAT'd नहीं होते हैं। आप kube-proxy मोड को उस नोड पर `http://localhost:10249/proxyMode` लाकर क्वेरी कर सकते हैं जहाँ kube-proxy चल रहा है।

```console
kubectl get nodes
```

इसका आउटपुट कुछ इस प्रकार है:

```
NAME                           STATUS     ROLES    AGE     VERSION
kubernetes-node-6jst   Ready      <none>   2h      v1.13.0
kubernetes-node-cx31   Ready      <none>   2h      v1.13.0
kubernetes-node-jj1t   Ready      <none>   2h      v1.13.0
```

किसी एक नोड पर प्रॉक्सी मोड प्राप्त करें (kube-proxy पोर्ट 10249 पर सुनता है):

```shell
# Run this in a shell on the node you want to query.
curl http://localhost:10249/proxyMode
```

इसका आउटपुट कुछ इस प्रकार है:

```
iptables
```

आप स्रोत IP ऐप पर सेवा बनाकर स्रोत IP संरक्षण का परीक्षण कर सकते हैं:

```shell
kubectl expose deployment source-ip-app --name=clusterip --port=80 --target-port=8080
```

इसका आउटपुट कुछ इस प्रकार है:

```
service/clusterip exposed
```

```shell
kubectl get svc clusterip
```

इसका आउटपुट कुछ इस प्रकार है:

```
NAME         TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)   AGE
clusterip    ClusterIP   10.0.170.92   <none>        80/TCP    51s
```

और उसी क्लस्टर में एक पॉड से `ClusterIP` को हिट करना:

```shell
kubectl run busybox -it --image=busybox:1.28 --restart=Never --rm
```

इसका आउटपुट कुछ इस प्रकार है:

```
Waiting for pod default/busybox to be running, status is Pending, pod ready: false
If you don't see a command prompt, try pressing enter.

```

फिर आप उस पॉड के अंदर एक कमांड चला सकते हैं:

```shell
# Run this inside the terminal from "kubectl run"
ip addr
```
```
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host
       valid_lft forever preferred_lft forever
3: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1460 qdisc noqueue
    link/ether 0a:58:0a:f4:03:08 brd ff:ff:ff:ff:ff:ff
    inet 10.244.3.8/24 scope global eth0
       valid_lft forever preferred_lft forever
    inet6 fe80::188a:84ff:feb0:26a5/64 scope link
       valid_lft forever preferred_lft forever
```

…फिर लोकल वेबसर्वर को क्वेरी करने के लिए `wget` का उपयोग करें

```shell
# Replace "10.0.170.92" with the IPv4 address of the Service named "clusterip"
wget -qO - 10.0.170.92
```

```
CLIENT VALUES:
client_address=10.244.3.8
command=GET
...
```

`client_address` हमेशा क्लाइंट पॉड का IP पता होता है, चाहे क्लाइंट पॉड और सर्वर पॉड एक ही नोड में हों या अलग-अलग नोड्स में हों।

## `Type=NodePort` वाली सेवाओं के लिए स्रोत IP

[`Type=NodePort`](/docs/concepts/services-networking/service/#type-nodeport) के साथ सेवाओं को भेजे गए पैकेट 
डिफ़ॉल्ट रूप से स्रोत NAT'd होते हैं। आप `NodePort` सेवा बनाकर इसका परीक्षण कर सकते हैं:


```shell
kubectl expose deployment source-ip-app --name=nodeport --port=80 --target-port=8080 --type=NodePort
```

इसका आउटपुट कुछ इस प्रकार है:

```
service/nodeport exposed
```

```shell
NODEPORT=$(kubectl get -o jsonpath="{.spec.ports[0].nodePort}" services nodeport)
NODES=$(kubectl get nodes -o jsonpath='{ $.items[*].status.addresses[?(@.type=="InternalIP")].address }')
```

यदि आप क्लाउड प्रोवाइडर पर चल रहे हैं, तो आपको ऊपर बताए गए `nodes:nodeport` के लिए फ़ायरवॉल-नियम खोलने की आवश्यकता हो सकती है। अब आप ऊपर आवंटित नोड पोर्ट के माध्यम से क्लस्टर के बाहर से सेवा तक पहुँचने का प्रयास कर सकते हैं।

```shell
for node in $NODES; do curl -s $node:$NODEPORT | grep -i client_address; done
```

इसका आउटपुट कुछ इस प्रकार है:

```
client_address=10.180.1.1
client_address=10.240.0.5
client_address=10.240.0.3
```

ध्यान दें कि ये सही क्लाइंट IP नहीं हैं, ये क्लस्टर के आंतरिक IP हैं। यह इस तरह काम करता है:

* क्लाइंट पैकेट को `node2:nodePort` पर भेजता है
* `node2` पैकेट में मौजूद सोर्स IP एड्रेस (SNAT) को अपने IP एड्रेस से बदल देता है
* `node2` पैकेट पर मौजूद डेस्टिनेशन IP को पॉड IP से बदल देता है
* पैकेट को नोड 1 और फिर एंडपॉइंट पर भेजा जाता है
* पॉड का जवाब वापस नोड 2 पर भेजा जाता है
* पॉड का जवाब वापस क्लाइंट को भेजा जाता है

दृश्यात्मक रूप से:

{{< figure src="/docs/images/tutor-service-nodePort-fig01.svg" alt="source IP nodeport figure 01" class="diagram-large" caption="Figure. Source IP Type=NodePort using SNAT" link="https://mermaid.live/edit#pako:eNqNkV9rwyAUxb-K3LysYEqS_WFYKAzat9GHdW9zDxKvi9RoMIZtlH732ZjSbE970cu5v3s86hFqJxEYfHjRNeT5ZcUtIbXRaMNN2hZ5vrYRqt52cSXV-4iMSuwkZiYtyX739EqWaahMQ-V1qPxDVLNOvkYrO6fj2dupWMR2iiT6foOKdEZoS5Q2hmVSStoH7w7IMqXUVOefWoaG3XVftHbGeZYVRbH6ZXJ47CeL2-qhxvt_ucTe1SUlpuMN6CX12XeGpLdJiaMMFFr0rdAyvvfxjHEIDbbIgcVSohKDCRy4PUV06KQIuJU6OA9MCdMjBTEEt_-2NbDgB7xAGy3i97VJPP0ABRmcqg" >}}

इससे बचने के लिए, Kubernetes में [क्लाइंट स्रोत IP को संरक्षित](/docs/tasks/access-application-cluster/create-external-load-balancer/#preserving-the-client-source-ip) करने की सुविधा है।
यदि आप `service.spec.externalTrafficPolicy` को `Local` मान पर सेट करते हैं, तो kube-proxy केवल स्थानीय एंडपॉइंट पर प्रॉक्सी अनुरोधों को प्रॉक्सी करता है, और ट्रैफ़िक को अन्य नोड्स पर अग्रेषित नहीं करता है। यह दृष्टिकोण मूल स्रोत IP पते को संरक्षित करता है। यदि कोई स्थानीय एंडपॉइंट नहीं हैं, तो नोड पर भेजे गए पैकेट ड्रॉप हो जाते हैं, इसलिए आप किसी भी पैकेट प्रोसेसिंग नियम में सही स्रोत-आईपी पर भरोसा कर सकते हैं, आप एक पैकेट लागू कर सकते हैं जो एंडपॉइंट तक पहुंचता है।

`service.spec.externalTrafficPolicy` फ़ील्ड को निम्न प्रकार से सेट करें:

```shell
kubectl patch svc nodeport -p '{"spec":{"externalTrafficPolicy":"Local"}}'
```

इसका आउटपुट कुछ इस प्रकार है:

```
service/nodeport patched
```

अब, परीक्षण पुनः चलाएँ:

```shell
for node in $NODES; do curl --connect-timeout 1 -s $node:$NODEPORT | grep -i client_address; done
```

आउटपुट इस प्रकार है:

```
client_address=198.51.100.79
```

ध्यान दें कि आपको केवल एक उत्तर मिला है, *सही* क्लाइंट IP के साथ, उस नोड से जिस पर एंडपॉइंट पॉड चल रहा है।

यह कुछ इस तरह काम करता है:

* क्लाइंट पैकेट को `node2:nodePort` पर भेजता है, जिसमें कोई एंडपॉइंट नहीं है
* पैकेट को छोड़ दिया जाता है
* क्लाइंट पैकेट को `node1:nodePort` पर भेजता है, जिसमें *एंडपॉइंट* हैं
* node1 पैकेट को सही सोर्स IP वाले एंडपॉइंट पर रूट करता है

दृश्यात्मक रूप से:


{{< figure src="/docs/images/tutor-service-nodePort-fig02.svg" alt="source IP nodeport figure 02" class="diagram-large" caption="Figure. Source IP Type=NodePort preserves client source IP address" link="" >}}

## `Type=LoadBalancer` वाली सेवाओं के लिए स्रोत IP

[`Type=LoadBalancer`](/docs/concepts/services-networking/service/#loadbalancer) के साथ सेवाओं को भेजे गए पैकेट 
डिफ़ॉल्ट रूप से स्रोत NAT'd होते हैं, क्योंकि `Ready` स्थिति में सभी शेड्यूल करने योग्य Kubernetes नोड लोड-बैलेंस्ड ट्रैफ़िक के लिए पात्र होते हैं। इसलिए यदि पैकेट बिना किसी एंडपॉइंट के नोड पर पहुंचते हैं, तो सिस्टम इसे एक एंडपॉइंट वाले नोड पर प्रॉक्सी करता है, पैकेट पर स्रोत IP को नोड के IP से बदल देता है (जैसा कि पिछले अनुभाग में वर्णित है)।

आप लोड बैलेंसर के माध्यम से स्रोत-आईपी-ऐप को उजागर करके इसका परीक्षण कर सकते हैं:

```shell
kubectl expose deployment source-ip-app --name=loadbalancer --port=80 --target-port=8080 --type=LoadBalancer
```

आउटपुट इस प्रकार है::

```
service/loadbalancer exposed
```

सेवा के आईपी पते का प्रिंट आउट लें:

```console
kubectl get svc loadbalancer
```

आउटपुट इस प्रकार है: 

```
NAME           TYPE           CLUSTER-IP    EXTERNAL-IP       PORT(S)   AGE
loadbalancer   LoadBalancer   10.0.65.118   203.0.113.140     80/TCP    5m
```

इसके बाद, इस सेवा के बाहरी-आईपी को अनुरोध भेजें:

```shell
curl 203.0.113.140
```

आउटपुट इस प्रकार है: 

```
CLIENT VALUES:
client_address=10.240.0.5
...
```

हालाँकि, यदि आप Google Kubernetes Engine/GCE पर चल रहे हैं, तो उसी `service.spec.externalTrafficPolicy` 
फ़ील्ड को `Local` पर सेट करने से सेवा समापन बिंदुओं के बिना नोड्स को जानबूझकर स्वास्थ्य जांच में विफल होने के कारण लोडबैलेंस्ड ट्रैफ़िक के लिए योग्य नोड्स की सूची से खुद को हटाने के लिए मजबूर होना पड़ता है।

दृश्यात्मक रूप से:

![Source IP with externalTrafficPolicy](/images/docs/sourceip-externaltrafficpolicy.svg)

आप एनोटेशन सेट करके इसका परीक्षण कर सकते हैं:

```shell
kubectl patch svc loadbalancer -p '{"spec":{"externalTrafficPolicy":"Local"}}'
```

आपको तुरंत Kubernetes द्वारा आवंटित `service.spec.healthCheckNodePort` फ़ील्ड दिखाई देगी:

```shell
kubectl get svc loadbalancer -o yaml | grep -i healthCheckNodePort
```

आउटपुट इस प्रकार है:

```yaml
healthCheckNodePort: 32122
```

`service.spec.healthCheckNodePort` फ़ील्ड `/healthz` पर स्वास्थ्य जाँच करने वाले प्रत्येक नोड पर एक पोर्ट की ओर इशारा करता है। 
आप इसका परीक्षण कर सकते हैं:

```shell
kubectl get pod -o wide -l app=source-ip-app
```

आउटपुट इस प्रकार है: 

```
NAME                            READY     STATUS    RESTARTS   AGE       IP             NODE
source-ip-app-826191075-qehz4   1/1       Running   0          20h       10.180.1.136   kubernetes-node-6jst
```

विभिन्न नोड्स पर `/healthz` एंडपॉइंट लाने के लिए `curl` का उपयोग करें:

```shell
# Run this locally on a node you choose
curl localhost:32122/healthz
```

```
1 Service Endpoints found
```

किसी भिन्न नोड पर आपको भिन्न परिणाम मिल सकता है:

```shell
# Run this locally on a node you choose
curl localhost:32122/healthz
```

```
No Service Endpoints Found
```

{{<glossary_tooltip text="कंट्रोल प्लेन" term_id="control-plane" >}} पर चलने वाला एक कंट्रोलर क्लाउड लोड बैलेंसर को आवंटित करने के लिए जिम्मेदार होता है। वही कंट्रोलर प्रत्येक नोड पर इस पोर्ट/पथ की ओर इशारा करते हुए HTTP स्वास्थ्य जांच भी आवंटित करता है। स्वास्थ्य जांच में विफल होने के लिए एंडपॉइंट के बिना 2 नोड्स के लिए लगभग 10 सेकंड प्रतीक्षा करें, फिर लोड बैलेंसर के IPv4 पते को क्वेरी करने के लिए `curl` का उपयोग करें:

```shell
curl 203.0.113.140
```

आउटपुट इस प्रकार है: 

```
CLIENT VALUES:
client_address=198.51.100.79
...
```

## क्रॉस-प्लेटफ़ॉर्म समर्थन

केवल कुछ क्लाउड प्रदाता ही `Type=LoadBalancer` वाली सेवाओं के माध्यम से स्रोत IP संरक्षण के लिए समर्थन प्रदान करते हैं।
आप जिस क्लाउड प्रदाता पर काम कर रहे हैं, वह कुछ अलग-अलग तरीकों से लोडबैलेंसर के लिए अनुरोध को पूरा कर सकता है:

1. एक प्रॉक्सी के साथ जो क्लाइंट कनेक्शन को समाप्त करता है और आपके नोड्स/एंडपॉइंट्स के लिए एक नया कनेक्शन खोलता है। ऐसे मामलों में स्रोत IP हमेशा क्लाउड LB का होगा, क्लाइंट का नहीं।

2. एक पैकेट फ़ॉरवर्डर के साथ, जैसे कि क्लाइंट से लोडबैलेंसर VIP को भेजे गए अनुरोध क्लाइंट के स्रोत IP वाले नोड पर समाप्त होते हैं, न कि किसी मध्यवर्ती प्रॉक्सी पर।

पहली श्रेणी के लोड बैलेंसर को लोडबैलेंसर और बैकएंड के बीच HTTP [फॉरवर्डेड](https://tools.ietf.org/html/rfc7239#section-5.2) या [X-FORWARDED-FOR](https://en.wikipedia.org/wiki/X-Forwarded-For) हेडर या 
[प्रॉक्सी प्रोटोकॉल](https://www.haproxy.org/download/1.8/doc/proxy-protocol.txt) जैसे वास्तविक क्लाइंट IP को संप्रेषित करने के लिए सहमत प्रोटोकॉल का उपयोग करना चाहिए। दूसरी श्रेणी के लोड बैलेंसर सेवा पर `service.spec.healthCheckNodePort` फ़ील्ड में संग्रहीत पोर्ट पर इंगित HTTP स्वास्थ्य जांच बनाकर ऊपर वर्णित सुविधा का लाभ उठा सकते हैं।


## {{% heading "cleanup" %}}


सेवाएँ समाप्त करें:

```shell
kubectl delete svc -l app=source-ip-app
```

डिप्लॉयमेंट, रेप्लिका सेट और पॉड को समाप्त करें:

```shell
kubectl delete deployment source-ip-app
```



## {{% heading "whatsnext" %}}

* [सेवाओं के माध्यम से एप्लिकेशन कनेक्ट करने](/docs/tutorials/services/connect-applications-service/) के बारे में अधिक जानें
* [बाहरी लोड बैलेंसर बनाने का तरीका](/docs/tasks/access-application-cluster/create-external-load-balancer/) पढ़ें
