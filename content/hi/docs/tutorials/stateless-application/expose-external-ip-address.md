---
title: क्लस्टर में एप्लिकेशन तक पहुँचने के लिए एक बाहरी IP पता एक्सपोज़ करना (Exposing an External IP Address to Access an Application in a Cluster)
content_type: tutorial
weight: 10
---

<!-- overview -->

यह पृष्ठ दिखाता है कि कुबेरनेट्स सर्विस ऑब्जेक्ट (Service object) कैसे बनाया जाए जो एक बाहरी IP पते को एक्सपोज़ करता है।

## {{% heading "prerequisites" %}}

* [kubectl](/docs/tasks/tools/) स्थापित करें।
* कुबेरनेट्स क्लस्टर बनाने के लिए Google Kubernetes Engine या Amazon Web Services जैसे क्लाउड प्रदाता (cloud provider) का उपयोग करें। यह ट्यूटोरियल एक
  [बाहरी लोड बैलेंसर (external load balancer)](/docs/tasks/access-application-cluster/create-external-load-balancer/) बनाता है,
  जिसके लिए एक क्लाउड प्रदाता की आवश्यकता होती है।
* अपने कुबेरनेट्स API सर्वर के साथ संवाद करने के लिए `kubectl` को कॉन्फ़िगर करें। निर्देशों के लिए, अपने क्लाउड प्रदाता के दस्तावेज़ देखें।

## {{% heading "objectives" %}}

* हैलो वर्ल्ड (Hello World) एप्लिकेशन के पाँच इंस्टेंस चलाएँ।
* एक सर्विस ऑब्जेक्ट बनाएँ जो एक बाहरी IP पते को एक्सपोज़ करे।
* चल रहे एप्लिकेशन तक पहुँचने के लिए सर्विस ऑब्जेक्ट का उपयोग करें।

<!-- lessoncontent -->

## पाँच पॉड्स (pods) में चलने वाले एप्लिकेशन के लिए एक सर्विस बनाना

1. अपने क्लस्टर में एक हैलो वर्ल्ड एप्लिकेशन चलाएँ:

   {{% code_sample file="service/load-balancer-example.yaml" %}}

   ```shell
   kubectl apply -f https://k8s.io/examples/service/load-balancer-example.yaml
   ```
   पिछला कमांड एक
   {{< glossary_tooltip text="डिप्लॉयमेंट (Deployment)" term_id="deployment" >}}
   और एक संबद्ध
   {{< glossary_tooltip term_id="replica-set" text="रेप्लिकासेट (ReplicaSet)" >}} बनाता है।
   ReplicaSet में पाँच
   {{< glossary_tooltip text="पॉड्स (Pods)" term_id="pod" >}} हैं,
   जिनमें से प्रत्येक हैलो वर्ल्ड एप्लिकेशन चलाता है।

1. डिप्लॉयमेंट के बारे में जानकारी प्रदर्शित करें:

   ```shell
   kubectl get deployments hello-world
   kubectl describe deployments hello-world
   ```

1. अपने ReplicaSet ऑब्जेक्ट्स के बारे में जानकारी प्रदर्शित करें:

   ```shell
   kubectl get replicasets
   kubectl describe replicasets
   ```

1. एक सर्विस ऑब्जेक्ट बनाएँ जो डिप्लॉयमेंट को एक्सपोज़ करे:

   ```shell
   kubectl expose deployment hello-world --type=LoadBalancer --name=my-service
   ```

1. सर्विस के बारे में जानकारी प्रदर्शित करें:

   ```shell
   kubectl get services my-service
   ```

   आउटपुट इसके समान है:

   ```console
   NAME         TYPE           CLUSTER-IP     EXTERNAL-IP      PORT(S)    AGE
   my-service   LoadBalancer   10.3.245.137   104.198.205.71   8080/TCP   54s
   ```

   {{< note >}}

   `type=LoadBalancer` सर्विस बाहरी क्लाउड प्रदाताओं द्वारा समर्थित है, जिसे इस उदाहरण में शामिल नहीं किया गया है। विवरण के लिए कृपया [अपनी सर्विस के लिए `type: LoadBalancer` सेट करना](/docs/concepts/services-networking/service/#loadbalancer) देखें।

   {{< /note >}}

   {{< note >}}

   यदि बाहरी IP पता \<pending\> के रूप में दिखाया गया है, तो एक मिनट प्रतीक्षा करें और फिर से वही कमांड दर्ज करें।

   {{< /note >}}

1. सर्विस के बारे में विस्तृत जानकारी प्रदर्शित करें:

   ```shell
   kubectl describe services my-service
   ```

   आउटपुट इसके समान है:

   ```console
   Name:           my-service
   Namespace:      default
   Labels:         app.kubernetes.io/name=load-balancer-example
   Annotations:    <none>
   Selector:       app.kubernetes.io/name=load-balancer-example
   Type:           LoadBalancer
   IP:             10.3.245.137
   LoadBalancer Ingress:   104.198.205.71
   Port:           <unset> 8080/TCP
   NodePort:       <unset> 32377/TCP
   Endpoints:      10.0.0.6:8080,10.0.1.6:8080,10.0.1.7:8080 + 2 more...
   Session Affinity:   None
   Events:         <none>
   ```

   अपनी सर्विस द्वारा एक्सपोज़ किए गए बाहरी IP पते (`LoadBalancer Ingress`) को नोट करें। इस उदाहरण में, बाहरी IP पता 104.198.205.71 है।
   `Port` और `NodePort` के मान को भी नोट करें। इस उदाहरण में, `Port` 8080 है और `NodePort` 32377 है।

1. पिछले आउटपुट में, आप देख सकते हैं कि सर्विस के कई एंडपॉइंट (endpoints) हैं:
   10.0.0.6:8080,10.0.1.6:8080,10.0.1.7:8080 + 2 more। ये उन पॉड्स के आंतरिक पते (internal addresses) हैं जो हैलो वर्ल्ड एप्लिकेशन चला रहे हैं। यह सत्यापित करने के लिए कि ये पॉड पते हैं, यह कमांड दर्ज करें:

   ```shell
   kubectl get pods --output=wide
   ```

   आउटपुट इसके समान है:

   ```console
   NAME                         ...  IP         NODE
   hello-world-2895499144-1jaz9 ...  10.0.1.6   gke-cluster-1-default-pool-e0b8d269-1afc
   hello-world-2895499144-2e5uh ...  10.0.1.8   gke-cluster-1-default-pool-e0b8d269-1afc
   hello-world-2895499144-9m4h1 ...  10.0.0.6   gke-cluster-1-default-pool-e0b8d269-5v7a
   hello-world-2895499144-o4z13 ...  10.0.1.7   gke-cluster-1-default-pool-e0b8d269-1afc
   hello-world-2895499144-segjf ...  10.0.2.5   gke-cluster-1-default-pool-e0b8d269-cpuc
   ```

1. हैलो वर्ल्ड एप्लिकेशन तक पहुँचने के लिए बाहरी IP पते (`LoadBalancer Ingress`) का उपयोग करें:

   ```shell
   curl http://<external-ip>:<port>
   ```

   जहाँ `<external-ip>` आपकी सर्विस का बाहरी IP पता (`LoadBalancer Ingress`) है, और `<port>` आपकी सर्विस विवरण में `Port` का मान है।
   यदि आप minikube का उपयोग कर रहे हैं, तो `minikube service my-service` टाइप करने से ब्राउज़र में स्वचालित रूप से हैलो वर्ल्ड एप्लिकेशन खुल जाएगा।

   एक सफल अनुरोध की प्रतिक्रिया एक हैलो संदेश है:

   ```console
   Hello, world!
   Version: 2.0.0
   Hostname: 0bd46b45f32f
   ```

## {{% heading "cleanup" %}}

सर्विस को हटाने के लिए, यह कमांड दर्ज करें:

```shell
kubectl delete services my-service
```

हैलो वर्ल्ड एप्लिकेशन चला रहे डिप्लॉयमेंट, ReplicaSet, और Pods को हटाने के लिए, यह कमांड दर्ज करें:

```shell
kubectl delete deployment hello-world
```

## {{% heading "whatsnext" %}}

[एप्लिकेशन को सेवाओं से जोड़ने (connecting applications with services)](/docs/tutorials/services/connect-applications-service/) के बारे में अधिक जानें।
