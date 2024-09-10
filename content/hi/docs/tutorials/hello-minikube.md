---
title: हेलो मिनीक्यूब
content_type: tutorial
weight: 5
menu:
  main:
    title: "शुरू करते हैं"
    weight: 10
    post: >
      <p>तो क्या आप तैयार हैं? एक सामान्य ऐप चलाने के लिए के लिए एक साधारण कुबेरनेट्स क्लस्टर बनाएं।</p>
card:
  name: tutorials
  weight: 10
---

<!-- overview -->

यह ट्यूटोरियल आपको मिनिक्यूब का उपयोग करते हुए कुबेरनेट्स पर एक सैम्पल ऐप चलाने का तरीका दिखाता है। ट्यूटोरियल एक कंटेनर छवि प्रदान करता है जो सभी अनुरोधों को प्रतिध्वनित करने के लिए NGINX का उपयोग करता है। 

## {{% heading "objectives" %}}

* मिनीक्यूब में एक नमूना एप्लीकेशन डेप्लॉय करें।
* ऐप को चलाएं।
* एप्लिकेशन लॉग देखें।

## {{% heading "prerequisites" %}}


यह ट्यूटोरियल मानता है कि आपने पहले ही `मिनीक्यूब` सेट कर लिया है।
इंस्टॉलेशन निर्देशों के लिए [मिनीक्यूब स्टार्ट](https://minikube.sigs.k8s.io/docs/start/) में __Step 1__ देखें।
{{<note>}}
केवल __Step 1, इंस्टालेशन__ में दिए गए निर्देशों का पालन करें। बाकी निर्देश इस पेज पर कवर किया गया है।
{{</note>}}

आपको `kubectl` भी इंस्टॉल करना होगा। स्थापाना निर्देश के लिए [Kubectl स्थापित करें](/hi/docs/tasks/tools/#kubectl) देखें। 

<!-- lessoncontent -->

## एक मिनीक्यूब क्लस्टर बनाएं

```shell
minikube start
```

## कुबेरनेट्स डैशबोर्ड खोलें:

कुबेरनेट्स डैशबोर्ड खोलें। आप इसे दो अलग-अलग तरीकों से कर सकते हैं:

{{< tabs name="dashboard" >}}
{{% tab name="ब्राउज़र से लॉन्च करें" %}}
एक **नया** टर्मिनल खोलें, और चलाएँ:
```shell
# एक नया टर्मिनल प्रारंभ करें, और इस कमांड को चालू छोड़ दें।
minikube dashboard
```

अब, उस टर्मिनल पर वापस जाएँ जहाँ आपने `minikube start` चलाया था।

{{< note >}}
`dashboard` कमांड डैशबोर्ड ऐड-ऑन को इस्तेमाल के लिए तैयार करता है और प्रॉक्सी को डिफ़ॉल्ट वेब ब्राउज़र में खोलता है।
आप डैशबोर्ड पर कुबेरनेट्स संसाधन जैसे डेप्लॉयमेंट और सर्विस बना सकते हैं।

आमतौर पर, डैशबोर्ड केवल आंतरिक कुबेरनेट्स वर्चुअल नेटवर्क के भीतर से ही पहुँचा जा सकता है।
डैशबोर्ड को कुबेरनेट्स वर्चुअल नेटवर्क के बाहर से एक्सेस करने योग्य बनाने के लिए `dashboard` कमांड एक अस्थायी प्रॉक्सी बनाता है।

प्रॉक्सी को रोकने और प्रक्रिया से बाहर निकलने के लिए `Ctrl+C` का प्रयोग करें।
कमांड से बाहर निकलने के बाद, डैशबोर्ड कुबेरनेट्स क्लस्टर में चलता रहता है। 
आप डैशबोर्ड तक पहुंचने और प्रॉक्सी बनाने के लिए फिर से `dashboard` कमांड चला सकते हैं।
{{< /note >}}

{{% /tab %}}
{{% tab name="URL कॉपी और पेस्ट करें" %}}

यदि आप वेब ब्राउज़र नहीं खोलना चाहते हैं, तो URL प्राप्त करने के लिए url फ़्लैग के साथ `dashboard` कमांड चलाएँ:

```shell
minikube dashboard --url
```

अब, उस टर्मिनल पर वापस जाएँ जहाँ आपने `मिनीक्यूब स्टार्ट` चलाया था।

{{% /tab %}}
{{< /tabs >}}

## डेप्लॉयमेंट बनाएँ

कुबेरनेट्स [*पॉड*](/docs/concepts/workloads/pods/) एक या अधिक कंटेनरों का एक समूह है,
जो प्रशासन और नेटवर्किंग के उद्देश्यों के लिए एक साथ बंधे होते हैं। इस ट्यूटोरियल के 
पॉड में केवल एक कंटेनर है। कुबेरनेट्स 
[*डेप्लॉयमेंट*](/docs/concepts/workloads/controllers/deployment/) आपके पॉड के स्वास्थ्य की
जाँच करता है और यदि पॉड बंद हो जाता है तो पॉड के कंटेनर को पुनः आरंभ करता है।
पॉड्स के निर्माण और स्केलिंग को प्रबंधित करने के लिए डेप्लॉयमेंट अनुशंसित तरीका है।

1. पॉड को प्रबंधित करने वाला डेप्लॉयमेंट बनाने के लिए `kubectl create` कमांड का उपयोग करें। पॉड 
प्रदान की गई डॉकर इमेज के आधार पर एक कंटेनर चलाता है।

    ```shell
    kubectl create deployment hello-node --image=registry.k8s.io/echoserver:1.4
    ```

2. डेप्लॉयमेंट देखें:

    ```shell
    kubectl get deployments
    ```

    आउटपुट कुछ इस समान होगा:

    ```
    NAME         READY   UP-TO-DATE   AVAILABLE   AGE
    hello-node   1/1     1            1           1m
    ```

3. पॉड देखें:

    ```shell
    kubectl get pods
    ```

    आउटपुट कुछ इस समान होगा:

    ```
    NAME                          READY     STATUS    RESTARTS   AGE
    hello-node-5f76cf6ccf-br9b5   1/1       Running   0          1m
    ```

4. क्लस्टर इवेंट देखें:

    ```shell
    kubectl get events
    ```

5. `kubectl` कॉन्फ़िगरेशन देखें:

    ```shell
    kubectl config view
    ```

{{< note >}}
`kubectl` कमांड के बारे में अधिक जानकारी के लिए [kubectl अवलोकन](/docs/reference/kubectl/overview/) देखें।
{{< /note >}}

## सर्विस बनाएं

आमतौर पर, पॉड कुबेरनेट्स क्लस्टर के भीतर अपने आंतरिक IP पते से ही पहुँचा जा सकता है।
`hello-node` कंटेनर को कुबेरनेट्स वर्चुअल नेटवर्क के
बाहर से सुलभ बनाने के लिए,पॉड को
कुबेरनेट्स [*सर्विस*](/docs/concepts/services-networking/service/) के रूप में बेनकाब करना होगा।

1. `kubectl expose` कमांड का उपयोग करके पॉड को सार्वजनिक इंटरनेट पर एक्सपोज़ करें:

    ```shell
    kubectl expose deployment hello-node --type=LoadBalancer --port=8080
    ```

    `--type=LoadBalancer` फ्लैग इंगित करता है कि आप क्लस्टर के बाहर 
    अपने सर्विस को प्रदर्शित करना चाहते हैं।
    
    इमेज के अंदर एप्लिकेशन कोड `registry.k8s.io/echoserver` केवल TCP पोर्ट 8080 पर सुनता है। 
    यदि आपने किसी भिन्न पोर्ट को एक्सपोज़ करने के लिए `kubectl एक्सपोज़` का उपयोग किया है, तो क्लाइंट उस अन्य पोर्ट से जुड़ नहीं सकते।

2. आपके द्वारा बनाई गई सर्विस देखें:

    ```shell
    kubectl get service
    ```

    आउटपुट कुछ इस समान होगा:

    ```
    NAME         TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
    hello-node   LoadBalancer   10.108.144.78   <pending>     8080:30369/TCP   21s
    kubernetes   ClusterIP      10.96.0.1       <none>        443/TCP          23m
    ```

    लोड बैलेंसर्स का समर्थन करने वाले क्लाउड प्रदाताओं पर, सर्विस तक पहुंचने के 
    लिए एक बाहरी IP पते का प्रावधान किया जाएगा। मिनीक्यूब पर,
    `LoadBalancer` टाइप `minikube service` कमांड से सर्विस को
    पहुंच योग्य बनाता है।     

3. इस कमांड को चलायें:

    ```shell
    minikube service hello-node
    ```

    यह कमांड एक ब्राउज़र विंडो खोलता है जो ऐप की प्रतिक्रिया दिखाती है।

## ऐडऑन सक्षम करें

मिनीक्यूब टूल में बिल्ट-इन {{< glossary_tooltip text="ऐडऑन" term_id="addons" >}} (add on) का एक समूह
शामिल है जिसे स्थानीय कुबेरनेट्स वातावरण में सक्षम, अक्षम और खोला जा सकता है।

1. वर्तमान में उपलब्ध ऐडऑन की सूची:

    ```shell
    minikube addons list
    ```

    आउटपुट कुछ इस समान होगा:

    ```
    addon-manager: enabled
    dashboard: enabled
    default-storageclass: enabled
    efk: disabled
    freshpod: disabled
    gvisor: disabled
    helm-tiller: disabled
    ingress: disabled
    ingress-dns: disabled
    logviewer: disabled
    metrics-server: disabled
    nvidia-driver-installer: disabled
    nvidia-gpu-device-plugin: disabled
    registry: disabled
    registry-creds: disabled
    storage-provisioner: enabled
    storage-provisioner-gluster: disabled
    ```

2. एक ऐडऑन सक्षम करें, उदाहरण के लिए, `metrics-server`:

    ```shell
    minikube addons enable metrics-server
    ```

    आउटपुट कुछ इस समान होगा:

    ```
    The 'metrics-server' addon is enabled
    ```

3. आपके द्वारा बनाई गई पॉड और सर्विस देखें:

    ```shell
    kubectl get pod,service -n kube-system
    ```

    आउटपुट कुछ इस समान होगा:

    ```
    NAME                                        READY     STATUS    RESTARTS   AGE
    pod/coredns-5644d7b6d9-mh9ll                1/1       Running   0          34m
    pod/coredns-5644d7b6d9-pqd2t                1/1       Running   0          34m
    pod/metrics-server-67fb648c5                1/1       Running   0          26s
    pod/etcd-minikube                           1/1       Running   0          34m
    pod/influxdb-grafana-b29w8                  2/2       Running   0          26s
    pod/kube-addon-manager-minikube             1/1       Running   0          34m
    pod/kube-apiserver-minikube                 1/1       Running   0          34m
    pod/kube-controller-manager-minikube        1/1       Running   0          34m
    pod/kube-proxy-rnlps                        1/1       Running   0          34m
    pod/kube-scheduler-minikube                 1/1       Running   0          34m
    pod/storage-provisioner                     1/1       Running   0          34m

    NAME                           TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)             AGE
    service/metrics-server         ClusterIP   10.96.241.45    <none>        80/TCP              26s
    service/kube-dns               ClusterIP   10.96.0.10      <none>        53/UDP,53/TCP       34m
    service/monitoring-grafana     NodePort    10.99.24.54     <none>        80:30002/TCP        26s
    service/monitoring-influxdb    ClusterIP   10.111.169.94   <none>        8083/TCP,8086/TCP   26s
    ```

4. `metrics-server`अक्षम करें:

    ```shell
    minikube addons disable metrics-server
    ```

    आउटपुट कुछ इस समान होगा:

    ```
    metrics-server was successfully disabled
    ```

## साफ - सफाई

अब आप अपने क्लस्टर में बनाए गए संसाधनों को साफ कर सकते हैं:

```shell
kubectl delete service hello-node
kubectl delete deployment hello-node
```

वैकल्पिक रूप से, मिनिक्यूब वर्चुअल मशीन (VM) को बंद करें:

```shell
minikube stop
```

वैकल्पिक रूप से, मिनिक्यूब VM को डिलीट करें:

```shell
minikube delete
```

## {{% heading "whatsnext" %}}


* [डेप्लॉयमेंट ऑब्जेक्ट](/docs/concepts/workloads/controllers/deployment/) के बारे में अधिक जाने।
* [एप्लीकेशन डेप्लॉय](/docs/tasks/run-application/run-stateless-application-deployment/) करने के बारे में अधिक जाने।
* [सर्विस ऑब्जेक्ट](/docs/concepts/services-networking/service/) के बारे में अधिक जाने।
