---
reviewers:
- eparis
- pmorie
title: कॉन्फ़िगमैप का उपयोग करके रेडिस को कॉन्फ़िगर करना
content_type: ट्यूटोरियल
---

<!-- overview -->

यह पृष्ठ कॉन्फिग मैप का उपयोग करके रेडिस को कॉन्फ़िगर करने का वास्तविक विश्व उदाहरण प्रदान करता है और [कॉन्फिग मैप का उपयोग करने के लिए पॉड को कॉन्फ़िगर करें] (/docs/tasks/configure-pod-container/configure-pod-configmap/) कार्य पर आधारित है।



## {{% heading "objectives" %}}


* रेडिस कॉन्फ़िगरेशन वैल्यू के साथ एक कॉन्फ़िगमैप बनाएं
* एक रेडिस पॉड बनाएं जो बनाए गए कॉन्फ़िगमैप को माउंट और उपयोग करता है
* जांच करें कि कॉन्फ़िगरेशन सही ढंग से लागू किया गया था



## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* इस पृष्ठ पर दिखाया गया उदाहरण `kubectl` 1.14 और उससे ऊपर के संस्करण के साथ काम करता है।
* समझें [Configure a Pod to Use a ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/).



<!-- lessoncontent -->


## Real World Example: Configuring Redis using a ConfigMap

कॉन्फिगरेशन मैप में स्टोर्ड डेटा का उपयोग करके रेडिस कैश को कॉन्फ़िगर करने के लिए नीचे दिए गए चरणों का पालन करें।

सबसे पहले एक खाली कॉन्फ़िगरेशन ब्लॉक के साथ एक कॉन्फिग मैप बनाएं:

```shell
cat <<EOF >./example-redis-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: example-redis-config
data:
  redis-config: ""
EOF
```

रेडिस पॉड मेनिफेस्ट के साथ ऊपर बनाए गए कॉन्फ़िगमैप को लागू करें:

```shell
kubectl apply -f example-redis-config.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/pods/config/redis-pod.yaml
```

रेडिस पॉड मेनिफेस्ट की कंटेंट की जांच करें और निम्नलिखित पर ध्यान दें:

* `config` नामक वॉल्यूम `spec.volumes[1]` द्वारा बनाया गया है
* `spec.volumes[1].configMap.items[0]` के अंतर्गत `कुंजी` और `पथ` `redis-config` कुंजी को उजागर करता है
  `example-redis-config` `config` वॉल्यूम पर `redis.conf` नामक फ़ाइल के रूप में कॉन्फिग मैप।
* `config` वॉल्यूम को `spec.containers[0].volumeMounts[1]` द्वारा `/redis-master` पर माउंट किया जाता है।

इसका `example-redis-config` से `data.redis-config` में डेटा को उजागर करने का शुद्ध प्रभाव है
पॉड के अंदर `/redis-master/redis.conf` के रूप में ऊपर कॉन्फिग मैप।

{{% code_sample file="pods/config/redis-pod.yaml" %}}

बनाई गई वस्तुओं की जांच करें:

```shell
kubectl get pod/redis configmap/example-redis-config 
```

आपको निम्नलिखित आउटपुट देखना चाहिए

```
NAME        READY   STATUS    RESTARTS   AGE
pod/redis   1/1     Running   0          8s

NAME                             DATA   AGE
configmap/example-redis-config   1      14s
```

याद रखें कि हमने `example-redis-config` कॉन्फिग मैप में `redis-config` कुंजी को खाली छोड़ दिया था:

```shell
kubectl describe configmap/example-redis-config
```

आपको एक खाली `redis-config` कुंजी दिखनी चाहिए:

```shell
Name:         example-redis-config
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
redis-config:
```

पॉड में प्रवेश करने के लिए `kubectl exec` का उपयोग करें और वर्तमान कॉन्फ़िगरेशन की जांच करने के लिए `redis-cli` टूल चलाएं:

```shell
kubectl exec -it redis -- redis-cli
```

चेक `maxmemory`:

```shell
127.0.0.1:6379> CONFIG GET maxmemory
```

इसे 0 का डिफ़ॉल्ट वैल्यू दिखाना चाहिए:

```shell
1) "maxmemory"
2) "0"
```

इसी तरह, `maxmemory-policy` जांचें:

```shell
127.0.0.1:6379> CONFIG GET maxmemory-policy
```

जिससे इसका डिफ़ॉल्ट वैल्यू भी प्राप्त होना चाहिए`noeviction`:

```shell
1) "maxmemory-policy"
2) "noeviction"
```

आइए अब `example-redis-config` कॉन्फिग मैप में कुछ कॉन्फ़िगरेशन वैल्यू जोड़ें:

{{% code_sample file="pods/config/example-redis-config.yaml" %}}

अपडेट कॉन्फ़िगमैप लागू करें:

```shell
kubectl apply -f example-redis-config.yaml
```

पुष्टि करें कि कॉन्फ़िगमैप अपडेट किया गया था:

```shell
kubectl describe configmap/example-redis-config
```

आपको हमारे द्वारा अभी जोड़े गए कॉन्फ़िगरेशन वैल्यू देखना चाहिए:

```shell
Name:         example-redis-config
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
redis-config:
----
maxmemory 2mb
maxmemory-policy allkeys-lru
```

यह देखने के लिए कि कॉन्फ़िगरेशन लागू किया गया था या नहीं, `kubectl exec` के माध्यम से `redis-cli` का उपयोग करके रेडिस पॉड को फिर से जांचें:

```shell
kubectl exec -it redis -- redis-cli
```


चेक `maxmemory`:

```shell
127.0.0.1:6379> CONFIG GET maxmemory
```

यह 0 के डिफ़ॉल्ट वैल्यू पर रहता है:

```shell
1) "maxmemory"
2) "0"
```

इसी तरह, `maxmemory-policy` `noeviction` डिफ़ॉल्ट सेटिंग पर बनी रहती है:

```shell
127.0.0.1:6379> CONFIG GET maxmemory-policy
```

रिटर्न:

```shell
1) "maxmemory-policy"
2) "noeviction"
```

कॉन्फ़िगरेशन वैल्यू नहीं बदले हैं क्योंकि अपडेट प्राप्त करने के लिए पॉड को पुनः आरंभ करने की आवश्यकता है संबद्ध कॉन्फ़िगमैप्स से मान। आइए पॉड को हटाएं और पुनः बनाएं:

```shell
kubectl delete pod redis
kubectl apply -f https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/pods/config/redis-pod.yaml
```

अब कॉन्फ़िगरेशन वैल्यू को आखिरी बार दोबारा जांचें:

```shell
kubectl exec -it redis -- redis-cli
```

चेक `maxmemory`:

```shell
127.0.0.1:6379> CONFIG GET maxmemory
```

अब इसे 2097152 का अपडेट वैल्यू लौटाना चाहिए:

```shell
1) "maxmemory"
2) "2097152"
```

इसी तरह, `मैक्समेमोरी-पॉलिसी` को भी अपडेट किया गया है:

```shell
127.0.0.1:6379> CONFIG GET maxmemory-policy
```

यह `allkeys-lru` का डिजायर वैल्यू दर्शाता है:

```shell
1) "maxmemory-policy"
2) "allkeys-lru"
```

निर्मित संसाधनों को हटाकर अपना कार्य क्लीन करें:

```shell
kubectl delete pod/redis configmap/example-redis-config
```

## {{% heading "whatsnext" %}}


* इसके बारे में और सीखो [ConfigMaps](/docs/tasks/configure-pod-container/configure-pod-configmap/).
