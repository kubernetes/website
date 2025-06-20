---
title: ड्यूल-स्टैक नेटवर्किंग को मान्य करें
content_type: task
weight: 40
---

<!-- overview -->

यह दस्तावेज़ बताता है कि ड्यूल-स्टैक नेटवर्किंग को कैसे मान्य किया जाए।

## {{% heading "prerequisites" %}}

* कुबेरनेट्स 1.23 या बाद का संस्करण
* एक प्रदाता जो ड्यूल-स्टैक नेटवर्किंग का समर्थन करता है (क्लाउड प्रदाता या अन्य)
* ड्यूल-स्टैक क्लस्टर
* [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
* `jq`

<!-- steps -->

एक बार जब आपके पास ड्यूल-स्टैक क्लस्टर हो जाए, तो आप अपने नोड्स और पॉड्स को मान्य कर सकते हैं।

## नोड्स को मान्य करें

### नोड पतों को मान्य करें

प्रत्येक ड्यूल-स्टैक नोड में एक सिंगल IPv4 पता और एक सिंगल IPv6 पता होना चाहिए। निम्न कमांड चलाकर सभी नोड्स के लिए आईपी पतों को मान्य करें। आउटपुट में `-o wide` जोड़ना न भूलें।

```shell
kubectl get nodes -o wide
```

आउटपुट:
```
NAME          STATUS   ROLES    AGE   VERSION   INTERNAL-IP      EXTERNAL-IP   OS-IMAGE             KERNEL-VERSION      CONTAINER-RUNTIME
k8s-master    Ready    master   21m   v1.23.0   192.168.0.5      <none>        Ubuntu 16.04.7 LTS   4.4.0-210-generic   containerd://1.5.8
k8s-node1     Ready    <none>   20m   v1.23.0   192.168.0.4      <none>        Ubuntu 16.04.7 LTS   4.4.0-210-generic   containerd://1.5.8
k8s-node2     Ready    <none>   20m   v1.23.0   fd00::2          <none>        Ubuntu 16.04.7 LTS   4.4.0-210-generic   containerd://1.5.8
k8s-node3     Ready    <none>   20m   v1.23.0   2001:db8::1      <none>        Ubuntu 16.04.7 LTS   4.4.0-210-generic   containerd://1.5.8
k8s-node4     Ready    <none>   20m   v1.23.0   10.240.0.5       <none>        Ubuntu 16.04.7 LTS   4.4.0-210-generic   containerd://1.5.8
k8s-node5     Ready    <none>   20m   v1.23.0   192.0.2.254      <none>        Ubuntu 16.04.7 LTS   4.4.0-210-generic   containerd://1.5.8
```

आप निम्न कमांड का उपयोग करके एक नोड का चयन करके भी अधिक विस्तृत रूप में देख सकते हैं। `INTERNAL-IP` फ़ील्ड के मान की जाँच करें।

```shell
kubectl get node k8s-node2 -o yaml
```

आउटपुट:
```yaml
apiVersion: v1
kind: Node
metadata:
# ...
status:
  addresses:
  - address: 10.240.0.4
    type: InternalIP
  - address: fd00::2
    type: InternalIP
  - address: k8s-node2
    type: Hostname
#...
```

आउटपुट से, आप देख सकते हैं कि `k8s-node2` में एक IPv6 पता है।

### kube-proxy के माध्यम से नोड पतों को मान्य करें

आप यह भी मान्य कर सकते हैं कि नोड के पास `kubectl` का उपयोग करके ड्यूल-स्टैक आईपी पते हैं।

```shell
kubectl get ds -n kube-system -l k8s-app=kube-proxy -o json | jq -r '.items[0].spec.template.spec.containers[0].command[]' | grep "node-ip"
```

आउटपुट:
```
--node-ip=::
```

## पॉड्स को मान्य करें

### पॉड पतों को मान्य करें

मान्य करें कि एक पॉड के पास IPv4 और IPv6 पता है।

```shell
kubectl get pods -o wide
```

```
NAME          READY   STATUS    RESTARTS   AGE   IP
pod01         1/1     Running   0          6s    10.244.1.4,fd00:10:244:1::4
```

आप `kubectl describe` का उपयोग करके एक पॉड के आईपी पतों को भी मान्य कर सकते हैं।

```shell
kubectl describe pods pod01
```

आउटपुट:
```
#...
IP:  10.244.1.4
IPs:
  IP:  10.244.1.4
  IP:  fd00:10:244:1::4
#...
```

### डाउनवर्ड एपीआई के माध्यम से पॉड पतों को मान्य करें

आप [डाउनवर्ड एपीआई](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/) का उपयोग करके एक पॉड के आईपी पतों को मान्य कर सकते हैं।

यह पॉड परिभाषा दिखाती है कि `status.podIPs` फ़ील्ड का उपयोग करके एक पॉड अपने आईपी पतों को कैसे उजागर करता है। `fieldPath` आपको पॉड के आईपी पतों को उजागर करने की अनुमति देता है।

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: downward-api-pod
spec:
  containers:
    - name: main
      image: debian
      command: ["sleep", "3600"]
      resources:
        requests:
          cpu: 15m
          memory: 40Mi
        limits:
          cpu: 15m
          memory: 40Mi
      env:
        - name: POD_IPS
          valueFrom:
            fieldRef:
              apiVersion: v1
              fieldPath: status.podIPs
  restartPolicy: Never
```

1. ऊपर पॉड परिभाषा से पॉड बनाएँ।

   ```shell
   kubectl apply -f downward-api-pod.yaml
   ```

2. सत्यापित करें कि पॉड में IPv4 और IPv6 पते हैं जो `POD_IPS` पर्यावरण चर में संग्रहीत हैं। निम्न कमांड आपको पॉड द्वारा उजागर किए गए आईपी पते दिखाएगा।

   ```shell
   kubectl exec -it downward-api-pod -- printenv POD_IPS
   ```

   आउटपुट:
   ```
   fd00:10:244:1::5,10.244.1.5
   ```

## सेवाओं को मान्य करें

### सेवाओं के लिए आईपी पतों को मान्य करें

आपके क्लस्टर में सेवाएँ होनी चाहिए जो IPv4, IPv6, या दोनों का उपयोग करती हैं।

आप सेवाओं के लिए निम्न कमांड का उपयोग करके आईपी परिवारों को मान्य कर सकते हैं।

```shell
kubectl get services -o wide
```

आउटपुट:
```
NAME         TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE   SELECTOR
kubernetes   ClusterIP   10.96.0.1    <none>        443/TCP   26m   <none>
```

आप अपनी सेवाओं के लिए `.spec` में निम्न फ़ील्ड का उपयोग करके आईपी परिवार नीति को स्पष्ट रूप से परिभाषित कर सकते हैं।

* `ipFamilyPolicy`
* `ipFamilies`

आप इन फ़ील्ड्स को केवल तभी सेट कर सकते हैं जब आप एक नई सेवा बना रहे हों। आप इन फ़ील्ड्स को मौजूदा सेवाओं पर सेट नहीं कर सकते हैं।

### एक सिंगल-स्टैक सेवा बनाएँ

यह परिभाषा एक ऐसी सेवा दिखाती है जिसमें `ipFamilyPolicy` `SingleStack` पर सेट है। कुबेरनेट्स कंट्रोल प्लेन इस सेवा के लिए पहले कॉन्फ़िगर किए गए `service-cluster-ip-range` से एक आईपी पता आवंटित करेगा, और `ipFamilies` को उस आईपी परिवार के लिए सेट करेगा।

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  ipFamilyPolicy: SingleStack
  ports:
  - protocol: TCP
    port: 80
    targetPort: 9376
  selector:
    app: MyApp
```

1. ऊपर सेवा परिभाषा से सेवा बनाएँ।

   ```shell
   kubectl apply -f my-service.yaml
   ```

2. सेवा के लिए आईपी पता मान्य करें।

   ```shell
   kubectl get services my-service -o jsonpath='{.spec.clusterIPs}'
   ```

   आउटपुट:
   ```
   ["10.96.0.122"]
   ```

यदि आप एक विशिष्ट आईपी परिवार चाहते हैं, तो आप `ipFamilies` फ़ील्ड को परिभाषित कर सकते हैं। निम्न सेवा परिभाषा `ipFamilies` को `IPv6` पर सेट करती है। कुबेरनेट्स इस सेवा के लिए IPv6 रेंज से एक आईपी पता आवंटित करेगा।

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service-ipv6
spec:
  ipFamilyPolicy: SingleStack
  ipFamilies:
  - IPv6
  ports:
  - protocol: TCP
    port: 80
    targetPort: 9376
  selector:
    app: MyApp
```

### एक ड्यूल-स्टैक सेवा बनाएँ

निम्न सेवा परिभाषा `ipFamilyPolicy` को `RequireDualStack` पर सेट करती है। कुबेरनेट्स इस सेवा के लिए IPv4 और IPv6 दोनों पते आवंटित करेगा।

{{< note >}}
आप `PreferDualStack` का भी उपयोग कर सकते हैं। `PreferDualStack` का उपयोग करके, कुबेरनेट्स इस सेवा के लिए IPv4 और IPv6 दोनों पते आवंटित करेगा यदि क्लस्टर ड्यूल-स्टैक सक्षम है। यदि क्लस्टर ड्यूल-स्टैक सक्षम नहीं है, तो कुबेरनेट्स प्राथमिक आईपी परिवार से एक आईपी पता आवंटित करेगा।
{{< /note >}}

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service-dual
spec:
  ipFamilyPolicy: RequireDualStack
  ports:
  - protocol: TCP
    port: 80
    targetPort: 9376
  selector:
    app: MyApp
```

1. ऊपर सेवा परिभाषा से सेवा बनाएँ।

   ```shell
   kubectl apply -f my-service-dual.yaml
   ```

2. सेवा के लिए आईपी पते मान्य करें।

   ```shell
   kubectl get services my-service-dual -o jsonpath='{.spec.clusterIPs}'
   ```

   आउटपुट:
   ```
   ["10.96.229.206","fd00:10:96::775c"]
   ```

आप `ipFamilies` फ़ील्ड को परिभाषित करके भी एक ड्यूल-स्टैक सेवा बना सकते हैं।

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service-dual-ipfamilies
spec:
  ipFamilyPolicy: RequireDualStack
  ipFamilies:
  - IPv6
  - IPv4
  ports:
  - protocol: TCP
    port: 80
    targetPort: 9376
  selector:
    app: MyApp
```

`ipFamilies` फ़ील्ड में आपके द्वारा परिभाषित पहला आईपी पता प्राथमिक आईपी पता माना जाता है। इस मामले में, IPv6 प्राथमिक आईपी पता है। 