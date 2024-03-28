---
reviewers:
- eparis
- pmorie
title: Configmap का उपयोग करके रेडिस को कॉन्फ़िगर करना
content_type: tutorial
---

<!-- overview -->

यह पृष्ठ कॉन्फिग मैप का उपयोग करके रेडिस को कॉन्फ़िगर करने का वास्तविक विश्व उदाहरण प्रदान करता है और इसका निर्माण करता है [उपयोग करने के लिए पॉड को कॉन्फ़िगर करें ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/) काम. 



## {{% heading "objectives" %}}


* Redis कॉन्फ़िगरेशन मानों के साथ एक कॉन्फ़िगमैप बनाएं
* एक रेडिस पॉड बनाएं जो बनाए गए कॉन्फ़िगमैप को माउंट और उपयोग करता है
* सत्यापित करें कि कॉन्फ़िगरेशन सही ढंग से लागू किया गया था।



## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* इस पृष्ठ पर दिखाया गया उदाहरण `kubectl` 1.14 और उससे ऊपर के संस्करण के साथ काम करता है।
* समझना [कॉन्फ़िगमैप का उपयोग करने के लिए पॉड को कॉन्फ़िगर करें](/docs/tasks/configure-pod-container/configure-pod-configmap/).



<!-- lessoncontent -->


## Real World Example: Configuring Redis using a ConfigMap

कॉन्फिगरेशन मैप में संग्रहीत डेटा का उपयोग करके रेडिस कैश को कॉन्फ़िगर करने के लिए नीचे दिए गए चरणों का पालन करें।

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

रेडिस पॉड मेनिफेस्ट की सामग्री की जांच करें और निम्नलिखित पर ध्यान दें:

* A volume named `config` is created by `spec.volumes[1]`
* The `key` and `path` under `spec.volumes[1].items[0]` exposes the `redis-config` key from the 
  `example-redis-config` ConfigMap as a file named `redis.conf` on the `config` volume.
* The `config` volume is then mounted at `/redis-master` by `spec.containers[0].volumeMounts[1]`.

इसका `example-redis-config` से `data.redis-config` में डेटा को उजागर करने का शुद्ध प्रभाव है
पॉड के अंदर `/redis-master/redis.conf` के रूप में ऊपर कॉन्फिग मैप।

{{% code_sample file="pods/config/redis-pod.yaml" %}}

बनाई गई वस्तुओं की जांच करें:

```shell
kubectl get pod/redis configmap/example-redis-config 
```

आपको निम्नलिखित आउटपुट देखना चाहिए:

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

Pod में प्रवेश करने के लिए `kubectl exec` का उपयोग करें और वर्तमान कॉन्फ़िगरेशन की जांच करने के लिए `redis-cli` टूल चलाएं:

```shell
kubectl exec -it redis -- redis-cli
```

Check `maxmemory`:

```shell
127.0.0.1:6379> CONFIG GET maxmemory
```

इसे 0 का डिफ़ॉल्ट मान दिखाना चाहिए:

```shell
1) "maxmemory"
2) "0"
```

इसी तरह जांचें `maxmemory-policy`:

```shell
127.0.0.1:6379> CONFIG GET maxmemory-policy
```

जिससे इसका डिफ़ॉल्ट मान भी प्राप्त होना चाहिए `noeviction`:

```shell
1) "maxmemory-policy"
2) "noeviction"
```

आइए अब `example-redis-config` कॉन्फिग मैप में कुछ कॉन्फ़िगरेशन मान जोड़ें:

{{% code_sample file="pods/config/example-redis-config.yaml" %}}

अद्यतन कॉन्फ़िगमैप लागू करें:

```shell
kubectl apply -f example-redis-config.yaml
```

पुष्टि करें कि कॉन्फ़िगमैप अद्यतन किया गया था:

```shell
kubectl describe configmap/example-redis-config
```

आपको हमारे द्वारा अभी जोड़े गए कॉन्फ़िगरेशन मान देखना चाहिए:

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

Check `maxmemory`:

```shell
127.0.0.1:6379> CONFIG GET maxmemory
```

यह 0 के डिफ़ॉल्ट मान पर रहता है:

```shell
1) "maxmemory"
2) "0"
```

उसी प्रकार, `maxmemory-policy` पर रहता है `noeviction` डिफ़ॉल्ट सेटिंग:

```shell
127.0.0.1:6379> CONFIG GET maxmemory-policy
```

Returns:

```shell
1) "maxmemory-policy"
2) "noeviction"
```

कॉन्फ़िगरेशन मान नहीं बदले हैं क्योंकि अद्यतन प्राप्त करने के लिए पॉड को पुनः आरंभ करने की आवश्यकता है
संबद्ध कॉन्फ़िगमैप्स से मान। आइए पॉड को हटाएं और पुनः बनाएं:

```shell
kubectl delete pod redis
kubectl apply -f https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/pods/config/redis-pod.yaml
```

अब कॉन्फ़िगरेशन मानों को आखिरी बार दोबारा जांचें:

```shell
kubectl exec -it redis -- redis-cli
```

Check `maxmemory`:

```shell
127.0.0.1:6379> CONFIG GET maxmemory
```

अब इसे 2097152 का अद्यतन मान लौटाना चाहिए:

```shell
1) "maxmemory"
2) "2097152"
```

इसी प्रकार, `maxmemory-policy` भी अद्यतन किया गया है:

```shell
127.0.0.1:6379> CONFIG GET maxmemory-policy
```

यह अब वांछित मूल्य को दर्शाता है `allkeys-lru`:

```shell
1) "maxmemory-policy"
2) "allkeys-lru"
```

निर्मित संसाधनों को हटाकर अपना कार्य साफ़ करें:

```shell
kubectl delete pod/redis configmap/example-redis-config
```

## {{% heading "whatsnext" %}}


* बारे में और सीखो [ConfigMaps](/docs/tasks/configure-pod-container/configure-pod-configmap/).
