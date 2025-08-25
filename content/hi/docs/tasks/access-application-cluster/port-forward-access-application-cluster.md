---
title: क्लस्टर में एप्लिकेशन तक पहुंचने के लिए पोर्ट फॉरवर्डिंग का उपयोग करें
content_type: task
weight: 40
min-kubernetes-server-version: v1.10
---

<!-- overview -->

यह पेज दिखाता है कि कैसे कुबेरनेट्स क्लस्टर में चल रहे MongoDB सर्वर से कनेक्ट करने के लिए `kubectl port-forward` का उपयोग करें। इस प्रकार का कनेक्शन डेटाबेस डीबगिंग के लिए उपयोगी हो सकता है।

## {{% heading "prerequisites" %}}

* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
* [MongoDB Shell](https://www.mongodb.com/try/download/shell) इंस्टॉल करें।

<!-- steps -->

## MongoDB डिप्लॉयमेंट और सर्विस बनाना

1. MongoDB चलाने के लिए एक डिप्लॉयमेंट बनाएं:

   ```shell
   kubectl apply -f https://k8s.io/examples/application/mongodb/mongo-deployment.yaml
   ```

   सफल कमांड का आउटपुट पुष्टि करता है कि डिप्लॉयमेंट बनाया गया था:

   ```
   deployment.apps/mongo created
   ```

   यह जांचने के लिए कि यह तैयार है, पॉड की स्थिति देखें:

   ```shell
   kubectl get pods
   ```

   आउटपुट बनाए गए पॉड को प्रदर्शित करता है:

   ```
   NAME                     READY   STATUS    RESTARTS   AGE
   mongo-75f59d57f4-4nd6q   1/1     Running   0          2m4s
   ```

   डिप्लॉयमेंट की स्थिति देखें:

   ```shell
   kubectl get deployment
   ```

   आउटपुट दिखाता है कि डिप्लॉयमेंट बनाया गया था:

   ```
   NAME    READY   UP-TO-DATE   AVAILABLE   AGE
   mongo   1/1     1            1           2m21s
   ```

   डिप्लॉयमेंट स्वचालित रूप से एक ReplicaSet को प्रबंधित करता है।
   ReplicaSet की स्थिति इस कमांड से देखें:

   ```shell
   kubectl get replicaset
   ```

   आउटपुट दिखाता है कि ReplicaSet बनाया गया था:

   ```
   NAME               DESIRED   CURRENT   READY   AGE
   mongo-75f59d57f4   1         1         1       3m12s
   ```

2. नेटवर्क पर MongoDB को एक्सपोज करने के लिए एक सर्विस बनाएं:

   ```shell
   kubectl apply -f https://k8s.io/examples/application/mongodb/mongo-service.yaml
   ```

   सफल कमांड का आउटपुट पुष्टि करता है कि सर्विस बनाई गई थी:

   ```
   service/mongo created
   ```

   बनाई गई सर्विस की जांच करें:

   ```shell
   kubectl get service mongo
   ```

   आउटपुट बनाई गई सर्विस को प्रदर्शित करता है:

   ```
   NAME    TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)     AGE
   mongo   ClusterIP   10.96.41.183   <none>        27017/TCP   11s
   ```

3. सत्यापित करें कि MongoDB सर्वर पॉड में चल रहा है, और पोर्ट 27017 पर सुन रहा है:

   ```shell
   # mongo-75f59d57f4-4nd6q को पॉड के नाम से बदलें
   kubectl get pod mongo-75f59d57f4-4nd6q --template='{{(index (index .spec.containers 0).ports 0).containerPort}}{{"\n"}}'
   ```

   आउटपुट उस पॉड में MongoDB के लिए पोर्ट प्रदर्शित करता है:

   ```
   27017
   ```

   27017 MongoDB के लिए आधिकारिक TCP पोर्ट है।

## पॉड पर लोकल पोर्ट को फॉरवर्ड करना

1. `kubectl port-forward` रिसोर्स नाम का उपयोग करने की अनुमति देता है, जैसे पॉड का नाम, पोर्ट फॉरवर्ड करने के लिए मिलान करने वाले पॉड को चुनने के लिए।

   ```shell
   # mongo-75f59d57f4-4nd6q को पॉड के नाम से बदलें
   kubectl port-forward mongo-75f59d57f4-4nd6q 28015:27017
   ```

   जो इसके समान है

   ```shell
   kubectl port-forward pods/mongo-75f59d57f4-4nd6q 28015:27017
   ```

   या

   ```shell
   kubectl port-forward deployment/mongo 28015:27017
   ```

   या

   ```shell
   kubectl port-forward replicaset/mongo-75f59d57f4 28015:27017
   ```

   या

   ```shell
   kubectl port-forward service/mongo 28015:27017
   ```

   उपरोक्त में से कोई भी कमांड काम करेगी। आउटपुट इस तरह का होगा:

   ```
   Forwarding from 127.0.0.1:28015 -> 27017
   Forwarding from [::1]:28015 -> 27017
   ```

   {{< note >}}
   `kubectl port-forward` वापस नहीं लौटता। अभ्यास जारी रखने के लिए, आपको एक और टर्मिनल खोलना होगा।
   {{< /note >}}

2. MongoDB कमांड लाइन इंटरफ़ेस शुरू करें:

   ```shell
   mongosh --port 28015
   ```

3. MongoDB कमांड लाइन प्रॉम्प्ट पर, `ping` कमांड दर्ज करें:

   ```
   db.runCommand( { ping: 1 } )
   ```

   एक सफल पिंग अनुरोध वापस लौटाता है:

   ```
   { ok: 1 }
   ```

### वैकल्पिक रूप से _kubectl_ को लोकल पोर्ट चुनने दें {#let-kubectl-choose-local-port}

यदि आपको किसी विशिष्ट लोकल पोर्ट की आवश्यकता नहीं है, तो आप `kubectl` को लोकल पोर्ट चुनने और आवंटित करने दे सकते हैं 
और इस तरह आपको लोकल पोर्ट विवादों को प्रबंधित करने से मुक्त कर सकते हैं, थोड़े सरल सिंटैक्स के साथ:

```shell
kubectl port-forward deployment/mongo :27017
```

`kubectl` टूल एक लोकल पोर्ट नंबर ढूंढता है जो उपयोग में नहीं है (कम पोर्ट नंबरों से बचता है,
क्योंकि इनका उपयोग अन्य एप्लिकेशन द्वारा किया जा सकता है)। आउटपुट इस तरह का होता है:

```
Forwarding from 127.0.0.1:63753 -> 27017
Forwarding from [::1]:63753 -> 27017
```

<!-- discussion -->

## चर्चा

लोकल पोर्ट 28015 पर किए गए कनेक्शन उस पॉड के पोर्ट 27017 पर फॉरवर्ड किए जाते हैं जो
MongoDB सर्वर चला रहा है। इस कनेक्शन के स्थापित होने के साथ, आप पॉड में चल रहे डेटाबेस को डीबग करने के लिए अपने
लोकल वर्कस्टेशन का उपयोग कर सकते हैं।

{{< note >}}
`kubectl port-forward` केवल TCP पोर्ट्स के लिए लागू किया गया है।
UDP प्रोटोकॉल के लिए समर्थन को 
[issue 47862](https://github.com/kubernetes/kubernetes/issues/47862) में ट्रैक किया जा रहा है।
{{< /note >}}

## {{% heading "whatsnext" %}}

[kubectl port-forward](/docs/reference/generated/kubectl/kubectl-commands/#port-forward) के बारे में और जानें।
