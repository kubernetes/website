---
title: Use a Service to Access an Application in a Cluster
content_type: tutorial
weight: 60
---

<!-- overview -->

This page shows how to create a Kubernetes Service object that external
clients can use to access an application running in a cluster. The Service
provides load balancing for an application that has two running instances.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

## {{% heading "objectives" %}}

- Run two instances of a Hello World application.
- Create a Service object that exposes a node port.
- Use the Service object to access the running application.

<!-- lessoncontent -->

## Creating a service for an application running in two pods

Here is the configuration file for the application Deployment:

{{% code_sample file="service/access/hello-application.yaml" %}}

1. Run a Hello World application in your cluster:
   Create the application Deployment using the file above:

   ```shell
   kubectl apply -f https://k8s.io/examples/service/access/hello-application.yaml
   ```

   The preceding command creates a
   {{< glossary_tooltip text="Deployment" term_id="deployment" >}}
   and an associated
   {{< glossary_tooltip term_id="replica-set" text="ReplicaSet" >}}.
   The ReplicaSet has two
   {{< glossary_tooltip text="Pods" term_id="pod" >}}
   each of which runs the Hello World application.

1. Display information about the Deployment:

   ```shell
   kubectl get deployments hello-world
   kubectl describe deployments hello-world
   ```

1. Display information about your ReplicaSet objects:

   ```shell
   kubectl get replicasets
   kubectl describe replicasets
   ```

1. Create a Service object that exposes the deployment:

   ```shell
   kubectl expose deployment hello-world --type=NodePort --name=example-service
   ```

1. Display information about the Service:

   ```shell
   kubectl describe services example-service
   ```

   The output is similar to this:

   ```none
   Name:                   example-service
   Namespace:              default
   Labels:                 run=load-balancer-example
   Annotations:            <none>
   Selector:               run=load-balancer-example
   Type:                   NodePort
   IP:                     10.32.0.16
   Port:                   <unset> 8080/TCP
   TargetPort:             8080/TCP
   NodePort:               <unset> 31496/TCP
   Endpoints:              10.200.1.4:8080,10.200.2.5:8080
   Session Affinity:       None
   Events:                 <none>
   ```

   Make a note of the NodePort value for the Service. For example,
   in the preceding output, the NodePort value is 31496.

1. हैलो वर्ल्ड एप्लिकेशन चला रहे पॉड्स की सूची देखें:

   ```shell
   kubectl get pods --selector="run=load-balancer-example" --output=wide
   ```

   आउटपुट इस तरह का होगा:

   ```none
   NAME                           READY   STATUS    ...  IP           NODE
   hello-world-2895499144-bsbk5   1/1     Running   ...  10.200.1.4   worker1
   hello-world-2895499144-m1pwt   1/1     Running   ...  10.200.2.5   worker2
   ```

1. अपने किसी एक नोड का पब्लिक IP पता प्राप्त करें जो हैलो वर्ल्ड पॉड चला रहा है। 
   यह पता कैसे प्राप्त करें यह इस बात पर निर्भर करता है कि आपने अपना क्लस्टर कैसे सेट अप किया है। 
   उदाहरण के लिए, यदि आप Minikube का उपयोग कर रहे हैं, तो आप `kubectl cluster-info` चलाकर 
   नोड का पता देख सकते हैं। यदि आप Google Compute Engine इंस्टेंस का उपयोग कर रहे हैं, तो आप 
   अपने नोड्स के पब्लिक पते देखने के लिए `gcloud compute instances list` कमांड का उपयोग कर सकते हैं।

1. अपने चुने हुए नोड पर, अपने नोड पोर्ट पर TCP ट्रैफ़िक की अनुमति देने वाला फ़ायरवॉल नियम बनाएं। 
   उदाहरण के लिए, यदि आपकी सर्विस का NodePort मान 31568 है, तो पोर्ट 31568 पर TCP ट्रैफ़िक की अनुमति 
   देने वाला फ़ायरवॉल नियम बनाएं। विभिन्न क्लाउड प्रोवाइडर्स फ़ायरवॉल नियमों को कॉन्फ़िगर करने के 
   अलग-अलग तरीके प्रदान करते हैं।

1. हैलो वर्ल्ड एप्लिकेशन तक पहुंचने के लिए नोड पता और नोड पोर्ट का उपयोग करें:

   ```shell
   curl http://<public-node-ip>:<node-port>
   ```

   जहाँ `<public-node-ip>` आपके नोड का पब्लिक IP पता है,
   और `<node-port>` आपकी सर्विस का NodePort मान है।
   सफल अनुरोध का जवाब एक हैलो संदेश है:

   ```none
   Hello, world!
   Version: 2.0.0
   Hostname: hello-world-cdd4458f4-m47c8
   ```

## सर्विस कॉन्फ़िगरेशन फ़ाइल का उपयोग करना

`kubectl expose` का उपयोग करने के विकल्प के रूप में, आप सर्विस बनाने के लिए 
[सर्विस कॉन्फ़िगरेशन फ़ाइल](/docs/concepts/services-networking/service/) का उपयोग कर सकते हैं।

## {{% heading "cleanup" %}}

सर्विस को हटाने के लिए, यह कमांड दर्ज करें:

    kubectl delete services example-service

डिप्लॉयमेंट, रेप्लिकासेट और हैलो वर्ल्ड एप्लिकेशन चला रहे पॉड्स को हटाने के लिए, 
यह कमांड दर्ज करें:

    kubectl delete deployment hello-world

## {{% heading "whatsnext" %}}

[सर्विसेज के साथ एप्लिकेशन कनेक्ट करना](/docs/tutorials/services/connect-applications-service/)
ट्यूटोरियल का पालन करें।
