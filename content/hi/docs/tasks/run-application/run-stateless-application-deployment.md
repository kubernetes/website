---
title: एक Stateless एप्लिकेशन को Deployment का उपयोग करके चलाएं
min-kubernetes-server-version: v1.9
content_type: tutorial
weight: 10
---

<!-- overview -->

यह पृष्ठ दिखाता है कि Kubernetes Deployment ऑब्जेक्ट का उपयोग करके एक एप्लिकेशन कैसे चलाया जाए।

## {{% heading "objectives" %}}

- एक nginx डिप्लॉयमेंट बनाएं।
- kubectl का उपयोग करके डिप्लॉयमेंट की जानकारी सूचीबद्ध करें।
- डिप्लॉयमेंट को अपडेट करें।

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- lessoncontent -->

## एक nginx डिप्लॉयमेंट बनाना और उसका अन्वेषण करना

आप Kubernetes Deployment ऑब्जेक्ट बनाकर एक एप्लिकेशन चला सकते हैं, और आप YAML फ़ाइल में एक डिप्लॉयमेंट का वर्णन कर सकते हैं। उदाहरण के लिए, यह YAML फ़ाइल एक डिप्लॉयमेंट का वर्णन करती है जो nginx:1.14.2 Docker इमेज चलाती है:

{{% code_sample file="application/deployment.yaml" %}}

1. YAML फ़ाइल के आधार पर एक डिप्लॉयमेंट बनाएं:

   ```shell
   kubectl apply -f https://k8s.io/examples/application/deployment.yaml
   ```

1. डिप्लॉयमेंट की जानकारी प्रदर्शित करें:

   ```shell
   kubectl describe deployment nginx-deployment
   ```

   आउटपुट इस प्रकार होगा:

   ```
   Name:     nginx-deployment
   Namespace:    default
   CreationTimestamp:  Tue, 30 Aug 2016 18:11:37 -0700
   Labels:     app=nginx
   Annotations:    deployment.kubernetes.io/revision=1
   Selector:   app=nginx
   Replicas:   2 desired | 2 updated | 2 total | 2 available | 0 unavailable
   StrategyType:   RollingUpdate
   MinReadySeconds:  0
   RollingUpdateStrategy:  1 max unavailable, 1 max surge
   Pod Template:
     Labels:       app=nginx
     Containers:
       nginx:
       Image:              nginx:1.14.2
       Port:               80/TCP
       Environment:        <none>
       Mounts:             <none>
     Volumes:              <none>
   Conditions:
     Type          Status  Reason
     ----          ------  ------
     Available     True    MinimumReplicasAvailable
     Progressing   True    NewReplicaSetAvailable
   OldReplicaSets:   <none>
   NewReplicaSet:    nginx-deployment-1771418926 (2/2 replicas created)
   No events.
   ```

1. डिप्लॉयमेंट द्वारा बनाए गए Pods की सूची बनाएं:

   ```shell
   kubectl get pods -l app=nginx
   ```

   आउटपुट इस प्रकार होगा:

   ```
   NAME                                READY     STATUS    RESTARTS   AGE
   nginx-deployment-1771418926-7o5ns   1/1       Running   0          16h
   nginx-deployment-1771418926-r18az   1/1       Running   0          16h
   ```

1. एक Pod की जानकारी प्रदर्शित करें:

   ```shell
   kubectl describe pod <pod-name>
   ```

   जहां `<pod-name>` आपके Pods में से किसी एक का नाम है।

## डिप्लॉयमेंट को अपडेट करना

आप एक नई YAML फ़ाइल लागू करके डिप्लॉयमेंट को अपडेट कर सकते हैं। यह YAML फ़ाइल निर्दिष्ट करती है कि डिप्लॉयमेंट को nginx 1.16.1 का उपयोग करने के लिए अपडेट किया जाना चाहिए।

{{% code_sample file="application/deployment-update.yaml" %}}

1. नई YAML फ़ाइल लागू करें:

   ```shell
   kubectl apply -f https://k8s.io/examples/application/deployment-update.yaml
   ```

1. नए नामों के साथ Pods बनाते हुए और पुराने Pods को हटाते हुए डिप्लॉयमेंट को देखें:

   ```shell
   kubectl get pods -l app=nginx
   ```

## एप्लिकेशन को स्केल करना (Pods की संख्या बढ़ाना)

आप एक नई YAML फ़ाइल लागू करके अपने डिप्लॉयमेंट में Pods की संख्या बढ़ा सकते हैं। यह YAML फ़ाइल `replicas` को 4 पर सेट करती है, जो निर्दिष्ट करती है कि डिप्लॉयमेंट में चार Pods होने चाहिए:

{{% code_sample file="application/deployment-scale.yaml" %}}

1. नई YAML फ़ाइल लागू करें:

   ```shell
   kubectl apply -f https://k8s.io/examples/application/deployment-scale.yaml
   ```

1. सत्यापित करें कि डिप्लॉयमेंट में चार Pods हैं:

   ```shell
   kubectl get pods -l app=nginx
   ```

   आउटपुट इस प्रकार होगा:

   ```
   NAME                               READY     STATUS    RESTARTS   AGE
   nginx-deployment-148880595-4zdqq   1/1       Running   0          25s
   nginx-deployment-148880595-6zgi1   1/1       Running   0          25s
   nginx-deployment-148880595-fxcez   1/1       Running   0          2m
   nginx-deployment-148880595-rwovn   1/1       Running   0          2m
   ```

## डिप्लॉयमेंट को हटाना

डिप्लॉयमेंट को नाम से हटाएं:

```shell
kubectl delete deployment nginx-deployment
```

## ReplicationControllers -- पुराना तरीका

एक replicated एप्लिकेशन बनाने का पसंदीदा तरीका एक डिप्लॉयमेंट का उपयोग करना है, जो बदले में एक ReplicaSet का उपयोग करता है। डिप्लॉयमेंट और ReplicaSet को Kubernetes में जोड़ने से पहले, replicated एप्लिकेशन को [ReplicationController](/docs/concepts/workloads/controllers/replicationcontroller/) का उपयोग करके कॉन्फ़िगर किया जाता था।

## {{% heading "whatsnext" %}}

- [Deployment ऑब्जेक्ट्स](/docs/concepts/workloads/controllers/deployment/) के बारे में और जानें।
