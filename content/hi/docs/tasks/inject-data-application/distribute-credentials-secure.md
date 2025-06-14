---
title: सीक्रेट्स (Secrets) का उपयोग करके प्रमाण-पत्रों को सुरक्षित रूप से वितरित करें
content_type: task
weight: 50
min-kubernetes-server-version: v1.6
---

<!-- overview -->

यह पृष्ठ दिखाता है कि संवेदनशील डेटा जैसे कि पासवर्ड और एन्क्रिप्शन कुंजियाँ  
पॉड्स (pods) में सुरक्षित रूप से कैसे इंजेक्ट की जाती हैं।

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

### अपने गुप्त डेटा को base-64 रूपांतरण में बदलें {#convert-your-secret-data-to-a-base-64-representation}

मान लीजिए कि आप दो गुप्त जानकारियाँ रखना चाहते हैं: एक उपयोगकर्ता नाम `my-app`  
और एक पासवर्ड `39528$vdg7Jb`। सबसे पहले, base64 एन्कोडिंग टूल का उपयोग करके अपने उपयोगकर्ता नाम और पासवर्ड को base-64 रूप में बदलें। नीचे दिए गए उदाहरण में सामान्य रूप से उपलब्ध base64 प्रोग्राम का उपयोग किया गया है:

```shell
echo -n 'my-app' | base64
echo -n '39528$vdg7Jb' | base64
```

आउटपुट दिखाता है कि आपके उपयोगकर्ता नाम का base-64 रूपांतरण है `bXktYXBw`,
और पासवर्ड का base-64 रूपांतरण है `Mzk1MjgkdmRnN0pi`।

{{< caution >}}
सुरक्षा जोखिमों को कम करने के लिए, किसी विश्वसनीय स्थानीय टूल का उपयोग करें
जो आपके ऑपरेटिंग सिस्टम द्वारा समर्थित हो। बाहरी टूल पर निर्भरता से बचें।
{{< /caution >}}

<!-- steps -->

## एक सीक्रेट (Secret) बनाएँ {#create-a-Secret}

यहाँ एक कॉन्फ़िगरेशन फ़ाइल दी गई है जिसका उपयोग आप अपना उपयोगकर्ता नाम और पासवर्ड  
रखने वाले सीक्रेट को बनाने के लिए कर सकते हैं:

{{% code_sample file="pods/inject/secret.yaml" %}}

1. सीक्रेट बनाएँ:

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/inject/secret.yaml
   ```

2. सीक्रेट के बारे में जानकारी देखें:

   ```shell
   kubectl get secret test-secret
   ```

   आउटपुट:

   ```
   NAME          TYPE      DATA      AGE
   test-secret   Opaque    2         1m
   ```

3. सीक्रेट के बारे में और विस्तृत जानकारी देखें:

   ```shell
   kubectl describe secret test-secret
   ```

   आउटपुट:

   ```
   Name:       test-secret
   Namespace:  default
   Labels:     <none>
   Annotations:    <none>

   Type:   Opaque

   Data
   ====
   password:   13 bytes
   username:   7 bytes
   ```

### सीधे `kubectl` से एक सीक्रेट (Secret) बनाएँ {#create-a-secret-directly-with-kubectl}

यदि आप Base64 एन्कोडिंग चरण को छोड़ना चाहते हैं,  
तो आप उसी Secret को `kubectl create secret` कमांड का उपयोग करके बना सकते हैं। उदाहरण के लिए:

```shell
kubectl create secret generic test-secret --from-literal='username=my-app' --from-literal='password=39528$vdg7Jb'
```

यह तरीका अधिक सुविधाजनक है। पहले दिखाया गया विस्तृत तरीका
हर चरण को स्पष्ट रूप से चलाकर यह दर्शाता है कि अंदर क्या हो रहा है।

## एक ऐसा पॉड बनाएँ जिसे वॉल्यूम (Volume) के माध्यम से सीक्रेट (Secret) डेटा तक पहुँच प्राप्त हो {#create-a-pod-that-has-access-to-the-secret-data-through-a-Volume}

यहाँ एक कॉन्फ़िगरेशन फ़ाइल दी गई है जिसका उपयोग आप एक पॉड बनाने के लिए कर सकते हैं:

{{% code_sample file="pods/inject/secret-pod.yaml" %}}

1. पॉड बनाएँ:

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/inject/secret-pod.yaml
   ```

2. सुनिश्चित करें कि आपका पॉड चल रहा है:

   ```shell
   kubectl get pod secret-test-pod
   ```

   आउटपुट:

   ```
   NAME              READY     STATUS    RESTARTS   AGE
   secret-test-pod   1/1       Running   0          42m
   ```
3. उस कंटेनरों के अंदर एक शेल खोलें जो आपके पॉड में चल रहा है:
   
   ```shell
   kubectl exec -i -t secret-test-pod -- /bin/bash
   ```

4. सीक्रेट डेटा कंटेनरों को एक वॉल्यूम के माध्यम से उपलब्ध कराया जाता है
   जो `/etc/secret-volume` के अंतर्गत माउंट किया गया है।

   अपने शेल में, `/etc/secret-volume` डाइरेक्टरी में फ़ाइलों की सूची देखें:

   ```shell
   # यह कमांड कंटेनर के अंदर शेल में चलाएँ
   ls /etc/secret-volume
   ```

   आउटपुट दो फ़ाइलें दिखाता है, जो हर एक गुप्त डेटा के लिए होती हैं:

   ```
   password username
   ```

5. अपने शेल में, `username` और `password` फ़ाइलों की सामग्री देखें:

   ```shell
   # यह कमांड कंटेनर के अंदर शेल में चलाएँ
   echo "$( cat /etc/secret-volume/username )"
   echo "$( cat /etc/secret-volume/password )"
   ```

   आउटपुट में आपका उपयोगकर्ता नाम और पासवर्ड दिखेगा:

   ```
   my-app
   39528$vdg7Jb
   ```

अपने इमेज या कमांड लाइन को इस प्रकार संशोधित करें कि प्रोग्राम
`mountPath` डाइरेक्टरी में फ़ाइलों को ढूंढे। सीक्रेट की `data` मैप में हर कुंजी
इस डाइरेक्टरी में एक फ़ाइल नाम बन जाती है।

### सीक्रेट (Secret) कुंजियों को विशिष्ट फ़ाइल पथों पर प्रोजेक्ट करे {#project-secret-keys-to-specific-file-paths}

आप वॉल्यूम के अंदर उन पथों को भी नियंत्रित कर सकते हैं जहाँ सीक्रेट कुंजियाँ प्रोजेक्ट की जाएँ।  
प्रत्येक कुंजी के लक्ष्य पथ को बदलने के लिए `.spec.volumes[].secret.items` फ़ील्ड का उपयोग करें:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: mypod
    image: redis
    volumeMounts:
    - name: foo
      mountPath: "/etc/foo"
      readOnly: true
  volumes:
  - name: foo
    secret:
      secretName: mysecret
      items:
      - key: username
        path: my-group/my-username
```

जब आप इस पॉड को डिप्लॉय करते हैं, तो निम्न होता है:

- `mysecret` से `username` कुंजी कंटेनर में `/etc/foo/username` की बजाय
`/etc/foo/my-group/my-username` पथ पर उपलब्ध होती है।
- उस Secret ऑब्जेक्ट की `password` कुंजी प्रोजेक्ट नहीं की जाती है।

यदि आप `.spec.volumes[].secret.items` का उपयोग करके कुंजियों को स्पष्ट रूप से सूचीबद्ध करते हैं,
तो निम्न बातों का ध्यान रखें:

- केवल वही कुंजियाँ प्रोजेक्ट होती हैं जो `items` में निर्दिष्ट हैं।
- यदि आप Secret की सभी कुंजियों का उपयोग करना चाहते हैं, 
  तो सभी को `items` फ़ील्ड में सूचीबद्ध करना होगा।
- सूचीबद्ध सभी कुंजियाँ संबंधित सीक्रेट में मौजूद होनी चाहिए।
  अन्यथा वॉल्यूम नहीं बनाया जाएगा।

### सीक्रेट (Secret) कुंजियों के लिए POSIX अनुमतियाँ सेट करें {#set-POSIX-permissions-for-secret-keys}

आप किसी एक सीक्रेट कुंजी के लिए POSIX फ़ाइल एक्सेस अनुमति बिट्स सेट कर सकते हैं।  
यदि आप कोई अनुमति निर्दिष्ट नहीं करते हैं, तो डिफ़ॉल्ट रूप से `0644` उपयोग होती है।  
आप पूरे सीक्रेट वॉल्यूम के लिए एक डिफ़ॉल्ट POSIX फ़ाइल मोड भी सेट कर सकते हैं,  
और आवश्यकता होने पर किसी कुंजी के लिए उसे ओवरराइड कर सकते हैं।

उदाहरण के लिए, आप इस तरह डिफ़ॉल्ट मोड निर्दिष्ट कर सकते हैं:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: mypod
    image: redis
    volumeMounts:
    - name: foo
      mountPath: "/etc/foo"
  volumes:
  - name: foo
    secret:
      secretName: mysecret
      defaultMode: 0400
```

Secret `/etc/foo` पर माउंट किया गया है;
Secret वॉल्यूम माउंट द्वारा बनाई गई सभी फ़ाइलों की अनुमति `0400` होगी।

{{< note >}}
यदि आप JSON में पॉड या पॉड टेम्पलेट परिभाषित कर रहे हैं, तो सावधान रहें
कि JSON विनिर्देश अंकों के लिए ऑक्टल लिटरल का समर्थन नहीं करता है,
क्योंकि JSON में `0400` को दशमलव मान `400` माना जाता है।
JSON में, `defaultMode` के लिए दशमलव मानों का उपयोग करें।
यदि आप YAML लिख रहे हैं, तो आप `defaultMode` को ऑक्टल में लिख सकते हैं।
{{< /note >}}

## सीक्रेट (Secret) डेटा का उपयोग करके कंटेनर एनवायरनमेंट वेरिएबल परिभाषित करें {#define-container-environment-variables-using-Secret-data}

आप अपने कंटेनरों में सीक्रेट्स के डेटा को एनवायरनमेंट वेरिएबल्स के रूप में उपयोग कर सकते हैं।

यदि कोई कंटेनर पहले से ही एनवायरनमेंट वेरिएबल के रूप में सीक्रेट का उपयोग कर रहा है,  
तो सीक्रेट अपडेट कंटेनर द्वारा तब तक नहीं देखा जाएगा जब तक कि कंटेनर को पुनः प्रारंभ (restart) न किया जाए। ऐसे कई थर्ड पार्टी समाधान उपलब्ध हैं जो सीक्रेट बदलने पर कंटेनर को पुनः प्रारंभ (restart) करते हैं।

### किसी एक सीक्रेट (Secret) से डेटा के साथ कंटेनर एनवायरनमेंट वेरिएबल परिभाषित करें {#define-a-container-environment-variable-with-data-from-a-single-Secret}

- सीक्रेट में key-value जोड़े के रूप में एक एनवायरनमेंट वेरिएबल परिभाषित करें:
  
  ```shell
  kubectl create secret generic backend-user --from-literal=backend-username='backend-admin'
  ```
- पॉड विनिर्देशन (specification) में `SECRET_USERNAME` नामक एनवायरनमेंट वेरिएबल को
  सीक्रेट में परिभाषित `backend-username` मान सौंपें।

  {{% code_sample file="pods/inject/pod-single-secret-env-variable.yaml" %}}

- पॉड बनाएं:

  ```shell
  kubectl create -f https://k8s.io/examples/pods/inject/pod-single-secret-env-variable.yaml
  ```

- अपनी शेल में, कंटेनर एनवायरनमेंट वेरिएबल SECRET_USERNAME की सामग्री प्रदर्शित करें:

  ```shell
  kubectl exec -i -t env-single-secret -- /bin/sh -c 'echo $SECRET_USERNAME'
  ```

  आउटपुट इस प्रकार होगा:

  ```
  backend-admin
  ```

### एक से अधिक सीक्रेट्स (Secrets) के डेटा से कंटेनर एनवायरनमेंट वेरिएबल्स परिभाषित करें {#define-container-environment-variables-with-data-from-multiple-Secrets}

- पहले के उदाहरण की तरह, पहले सीक्रेट्स बनाएं:

  ```shell
  kubectl create secret generic backend-user --from-literal=backend-username='backend-admin'
  kubectl create secret generic db-user --from-literal=db-username='db-admin'
  ```

- पॉड विनिर्देशन में एनवायरनमेंट वेरिएबल्स परिभाषित करें।

  {{% code_sample file="pods/inject/pod-multiple-secret-env-variable.yaml" %}}

- पॉड बनाएं:

  ```shell
  kubectl create -f https://k8s.io/examples/pods/inject/pod-multiple-secret-env-variable.yaml
  ```

- शेल में, कंटेनर एनवायरनमेंट वेरिएबल्स देखें:

  ```shell
  kubectl exec -i -t envvars-multiple-secrets -- /bin/sh -c 'env | grep _USERNAME'
  ```

  आउटपुट कुछ ऐसा होगा:

  ```
  DB_USERNAME=db-admin
  BACKEND_USERNAME=backend-admin
  ```

## सीक्रेट (Secret) के सभी key-value जोड़ों को कंटेनर एनवायरनमेंट वेरिएबल्स के रूप में कॉन्फ़िगर करें {#configure-all-key-value-pairs-in-a-Secret-as-container-environment-variables}

{{< note >}}
यह सुविधा Kubernetes v1.6 और बाद के संस्करणों में उपलब्ध है।
{{< /note >}}

- कई key-value जोड़ों के साथ सीक्रेट बनाएं:

  ```shell
  kubectl create secret generic test-secret --from-literal=username='my-app' --from-literal=password='39528$vdg7Jb'
  ```

- envFrom का उपयोग करके सीक्रेट के सभी डेटा को कंटेनर एनवायरनमेंट वेरिएबल्स के रूप में परिभाषित करें।
सीक्रेट में जो key है वह पॉड में एनवायरनमेंट वेरिएबल्स का नाम बन जाता है।

  {{% code_sample file="pods/inject/pod-secret-envFrom.yaml" %}}

- पॉड बनाएं:

  ```shell
  kubectl create -f https://k8s.io/examples/pods/inject/pod-secret-envFrom.yaml
  ````

- शेल में, `username` और `password` कंटेनर एनवायरनमेंट वेरिएबल्स प्रदर्शित करें:

  ```shell
  kubectl exec -i -t envfrom-secret -- /bin/sh -c 'echo "username: $username\npassword: $password\n"'
  ```

  आउटपुट कुछ इस तरह होगा:

  ```
  username: my-app
  password: 39528$vdg7Jb
  ```

## उदाहरण: सीक्रेट्स (Secrets) का उपयोग करके prod/test क्रेडेंशियल्स को Pods में उपलब्ध कराना {#provide-prod-test-creds}

इस उदाहरण में एक पॉड प्रोडक्शन क्रेडेंशियल्स वाला सीक्रेट उपयोग करता है
और दूसरा पॉड टेस्ट एनवायरनमेंट क्रेडेंशियल्स वाला सीक्रेट।

1. प्रोड (prod) एनवायरनमेंट क्रेडेंशियल्स के लिए सीक्रेट बनाएं:

   ```shell
   kubectl create secret generic prod-db-secret --from-literal=username=produser --from-literal=password=Y4nys7f11
   ```

   आउटपुट:

   ```
   secret "prod-db-secret" created
   ```

2. टेस्ट एनवायरनमेंट क्रेडेंशियल्स के लिए सीक्रेट बनाएं:

   ```shell
   kubectl create secret generic test-db-secret --from-literal=username=testuser --from-literal=password=iluvtests
   ```

   आउटपुट:

   ```
   secret "test-db-secret" created
   ```

   {{< note >}}
   विशेष अक्षर जैसे `$`, `\`, `*`, `=`, और `!` आपके [shell](https://en.wikipedia.org/wiki/Shell_(computing)) द्वारा व्याख्यायित किए जाएंगे और इन्हें एस्केप करना पड़ेगा।

   ज्यादातर शेल में पासवर्ड को (`'`) (सिंगल कोट्स) में लपेटना सबसे आसान तरीका है।
   उदाहरण के लिए, यदि आपका पासवर्ड '`S!B\*d$zDsb=`' है, तो यह कमांड चलाएं:

   ```shell
   kubectl create secret generic dev-db-secret --from-literal=username=devuser --from-literal=password='S!B\*d$zDsb='
   ```

   यदि आप फ़ाइल से पासवर्ड ले रहे हैं (`--from-file`), तो एस्केप करने की जरूरत नहीं होती।
   {{< /note >}}

3. पॉड manifests बनाएं:

   ```shell
   cat <<EOF > pod.yaml
   apiVersion: v1
   kind: List
   items:
   - kind: Pod
     apiVersion: v1
     metadata:
       name: prod-db-client-pod
       labels:
         name: prod-db-client
     spec:
       volumes:
       - name: secret-volume
         secret:
           secretName: prod-db-secret
       containers:
       - name: db-client-container
         image: myClientImage
         volumeMounts:
         - name: secret-volume
           readOnly: true
           mountPath: "/etc/secret-volume"
   - kind: Pod
     apiVersion: v1
     metadata:
       name: test-db-client-pod
       labels:
         name: test-db-client
     spec:
       volumes:
       - name: secret-volume
         secret:
           secretName: test-db-secret
       containers:
       - name: db-client-container
         image: myClientImage
         volumeMounts:
         - name: secret-volume
           readOnly: true
           mountPath: "/etc/secret-volume"
   EOF
   ```

   {{< note >}}
   दोनों Pods के विनिर्देश केवल एक फ़ील्ड में भिन्न होते हैं; यह एक सामान्य पॉड टेम्पलेट से विभिन्न क्षमताओं वाले Pods बनाना आसान बनाता है।
   {{< /note >}}

4. सभी ऑब्जेक्ट्स को API सर्वर पर लागू करें:

   ```shell
   kubectl create -f pod.yaml
   ```

दोनों कंटेनरों में निम्नलिखित फाइलें मौजूद होंगी जिनमें पर्यावरण अनुसार मान होंगे:

```
/etc/secret-volume/username
/etc/secret-volume/password
```

आप दो सर्विस अकाउंट्स का उपयोग करके पॉड विनिर्देशन को और सरल बना सकते हैं:

1. `prod-user` जो `prod-db-secret` का उपयोग करता है
2. `test-user` जो `test-db-secret` का उपयोग करता है

पॉड विनिर्देशन इस प्रकार सरल हो जाता है:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: prod-db-client-pod
  labels:
    name: prod-db-client
spec:
  serviceAccount: prod-db-client
  containers:
  - name: db-client-container
    image: myClientImage
```

### संदर्भ {#References}

- [Secret](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#secret-v1-core)
- [Volume](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#volume-v1-core)
- [Pod](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core)

## {{% heading "whatsnext" %}}

- [Secrets](/docs/concepts/configuration/secret/) के बारे में और जानें।
- [Volumes](/docs/concepts/storage/volumes/) के बारे में जानकारी प्राप्त करें।






















