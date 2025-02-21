---
title: पॉड्स और उनके एंडपॉइंट्स के लिए समाप्ति व्यवहार का अन्वेषण करें
content_type: tutorial
weight: 60
---


<!-- overview -->

एक बार जब आप अपने एप्लिकेशन को सेवा से कनेक्ट कर लेते हैं, तो [एप्लिकेशन को सेवाओं से कनेक्ट करना](/hi/docs/tutorials/services/connect-applications-service/) में बताए गए चरणों का पालन करते हुए, आपके पास एक निरंतर चलने वाला, प्रतिकृति एप्लिकेशन होता है, जो नेटवर्क पर प्रदर्शित होता है। यह ट्यूटोरियल आपको पॉड्स के लिए समाप्ति प्रवाह को देखने और सुंदर कनेक्शन ड्रेनिंग को लागू करने के तरीकों का पता लगाने में मदद करता है।


<!-- body -->

## पॉड्स और उनके एन्डपॉइन्ट्स के लिए समाप्ति प्रक्रिया

अक्सर ऐसे मामले होते हैं जब आपको पॉड को समाप्त करने की आवश्यकता होती है - चाहे वह अपग्रेड के लिए हो या स्केल डाउन के लिए।
एप्लिकेशन की उपलब्धता में सुधार करने के लिए, उचित सक्रिय कनेक्शन ड्रेनिंग को लागू करना महत्वपूर्ण हो सकता है।
यह ट्यूटोरियल अवधारणा को प्रदर्शित करने के लिए एक सरल nginx वेब सर्वर का उपयोग करके संगत एंडपॉइंट स्थिति और निष्कासन के संबंध में पॉड समाप्ति के प्रवाह की व्याख्या करता है।

<!-- body -->

## Example flow with endpoint termination

निम्नलिखित उदाहरण [पॉड्स की समाप्ति](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination) दस्तावेज़ में वर्णित प्रवाह है।

मान लीजिए कि आपके पास एक एकल `nginx` प्रतिकृति (केवल प्रदर्शन उद्देश्यों के लिए) और एक सेवा युक्त डिप्लॉयमेंट है:

{{% code_sample file="service/pod-with-graceful-termination.yaml" %}}

{{% code_sample file="service/explore-graceful-termination-nginx.yaml" %}}

अब उपरोक्त फ़ाइलों का उपयोग करके डिप्लॉयमेंट पॉड और सेवा बनाएँ:

```shell
kubectl apply -f pod-with-graceful-termination.yaml
kubectl apply -f explore-graceful-termination-nginx.yaml
```

एक बार पॉड और सेवा चलने के बाद, आप किसी भी संबद्ध एंडपॉइंटस्लाइस का नाम प्राप्त कर सकते हैं:

```shell
kubectl get endpointslice
```

इसका आउटपुट कुछ इस प्रकार है:

```none
NAME                  ADDRESSTYPE   PORTS   ENDPOINTS                 AGE
nginx-service-6tjbr   IPv4          80      10.12.1.199,10.12.1.201   22m
```

आप इसकी स्थिति देख सकते हैं, और पुष्टि कर सकते हैं कि एक एंडपॉइन्ट पंजीकृत है:

```shell
kubectl get endpointslices -o json -l kubernetes.io/service-name=nginx-service
```

इसका आउटपुट कुछ इस प्रकार है:

```none
{
    "addressType": "IPv4",
    "apiVersion": "discovery.k8s.io/v1",
    "endpoints": [
        {
            "addresses": [
                "10.12.1.201"
            ],
            "conditions": {
                "ready": true,
                "serving": true,
                "terminating": false
```

अब आइए पॉड को समाप्त करें और सत्यापित करें कि पॉड को अनुग्रहपूर्ण समाप्ति अवधि (graceful termination period) 
कॉन्फ़िगरेशन का सम्मान करते हुए समाप्त किया जा रहा है:

```shell
kubectl delete pod nginx-deployment-7768647bf9-b4b9s
```

सभी पॉड्स की जानकारी प्राप्त करें:

```shell
kubectl get pods
```

इसका आउटपुट कुछ इस प्रकार है:

```none
NAME                                READY   STATUS        RESTARTS      AGE
nginx-deployment-7768647bf9-b4b9s   1/1     Terminating   0             4m1s
nginx-deployment-7768647bf9-rkxlw   1/1     Running       0             8s
```

आप देख सकते हैं कि नया पॉड शेड्यूल हो गया है।

जब तक नए पॉड के लिए नया एंडपॉइंट बनाया जा रहा है, पुराना एंडपॉइंट अभी भी टर्मिनेटिंग अवस्था में है:

```shell
kubectl get endpointslice -o json nginx-service-6tjbr
```

इसका आउटपुट कुछ इस प्रकार है:

```none
{
    "addressType": "IPv4",
    "apiVersion": "discovery.k8s.io/v1",
    "endpoints": [
        {
            "addresses": [
                "10.12.1.201"
            ],
            "conditions": {
                "ready": false,
                "serving": true,
                "terminating": true
            },
            "nodeName": "gke-main-default-pool-dca1511c-d17b",
            "targetRef": {
                "kind": "Pod",
                "name": "nginx-deployment-7768647bf9-b4b9s",
                "namespace": "default",
                "uid": "66fa831c-7eb2-407f-bd2c-f96dfe841478"
            },
            "zone": "us-central1-c"
        },
        {
            "addresses": [
                "10.12.1.202"
            ],
            "conditions": {
                "ready": true,
                "serving": true,
                "terminating": false
            },
            "nodeName": "gke-main-default-pool-dca1511c-d17b",
            "targetRef": {
                "kind": "Pod",
                "name": "nginx-deployment-7768647bf9-rkxlw",
                "namespace": "default",
                "uid": "722b1cbe-dcd7-4ed4-8928-4a4d0e2bbe35"
            },
            "zone": "us-central1-c"
```

इससे एप्लिकेशन को समाप्ति के दौरान अपनी स्थिति के बारे में बताने की अनुमति मिलती है
और क्लाइंट (जैसे लोड बैलेंसर) को कनेक्शन ड्रेनिंग कार्यक्षमता को लागू करने की अनुमति मिलती है।
ये क्लाइंट समाप्ति के समापन बिंदुओं का पता लगा सकते हैं और उनके लिए एक विशेष तर्क लागू कर सकते हैं।

Kubernetes में, समाप्त होने वाले एंडपॉइंट की `ready` स्थिति हमेशा `false` के रूप में सेट होती है।
बैकवर्ड संगतता के लिए ऐसा होना ज़रूरी है, ताकि मौजूदा लोड बैलेंसर इसका इस्तेमाल नियमित ट्रैफ़िक के लिए न करें। अगर समाप्त होने वाले पॉड पर ट्रैफ़िक ड्रेनिंग की ज़रूरत है, तो वास्तविक तत्परता को `सर्विंग` की स्थिति के रूप में जाँचा जा सकता है।

जब पॉड समाप्त हो जाता है, तो पुराना एंडपॉइंट भी साथ ही साथ समाप्त हो जाएगा।


## {{% heading "whatsnext" %}}


* जानें कि [एप्लिकेशन को सेवाओं से कैसे कनेक्ट करें](/docs/tutorials/services/connect-applications-service/)
* [क्लस्टर में किसी एप्लिकेशन तक पहुंचने के लिए सेवा का उपयोग करना](/docs/tasks/access-application-cluster/service-access-application-cluster/) के बारे में अधिक जानें
* [सेवा का उपयोग करके फ्रंट एंड को बैक एंड से कनेक्ट करना](/docs/tasks/access-application-cluster/connecting-frontend-backend/) के बारे में अधिक जानें
* [बाहरी लोड बैलेंसर बनाने](/docs/tasks/access-application-cluster/create-external-load-balancer/) के बारे में अधिक जानें

