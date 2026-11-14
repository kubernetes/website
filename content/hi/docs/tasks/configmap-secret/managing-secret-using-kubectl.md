---
title: kubectl का उपयोग करके Secrets का प्रबंधन
content_type: task
weight: 10
description: kubectl कमांड लाइन का उपयोग करके Secret objects बनाना।
---

<!-- overview -->

यह पृष्ठ आपको दिखाता है कि `kubectl` कमांड-लाइन टूल का उपयोग करके कुबेरनेट्स
{{<glossary_tooltip text="Secrets" term_id="secret">}} कैसे बनाएं, संपादित करें, प्रबंधित करें और हटाएं।

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## एक Secret बनाएं

एक `Secret` object संवेदनशील डेटा जैसे कि क्रेडेंशियल्स को स्टोर करता है
जिनका उपयोग Pods सेवाओं तक पहुंचने के लिए करते हैं। उदाहरण के लिए, आपको एक Secret की आवश्यकता हो सकती है
डेटाबेस तक पहुंचने के लिए आवश्यक username और password को स्टोर करने के लिए।

आप कमांड में raw data पास करके, या उन क्रेडेंशियल्स को फ़ाइलों में स्टोर करके Secret बना सकते हैं
जिन्हें आप कमांड में पास करते हैं। निम्नलिखित कमांड
एक Secret बनाते हैं जो username `admin` और password `S!B\*d$zDsb=` को स्टोर करता है।

### Raw data का उपयोग करें

निम्नलिखित कमांड चलाएं:

```shell
kubectl create secret generic db-user-pass \
    --from-literal=username=admin \
    --from-literal=password='S!B\*d$zDsb='
```
आपको विशेष वर्णों जैसे `$`, `\`,
`*`, `=`, और `!` को अपने strings में escape करने के लिए single quotes `''` का उपयोग करना चाहिए। यदि आप ऐसा नहीं करते हैं, तो आपका shell इन वर्णों की व्याख्या करेगा।

{{< note >}}
Secret के लिए `stringData` फ़ील्ड server-side apply के साथ अच्छी तरह से काम नहीं करता है।
{{< /note >}}

### Source files का उपयोग करें

1. क्रेडेंशियल्स को फ़ाइलों में स्टोर करें:

   ```shell
   echo -n 'admin' > ./username.txt
   echo -n 'S!B\*d$zDsb=' > ./password.txt
   ```

   `-n` flag यह सुनिश्चित करता है कि उत्पन्न फ़ाइलों में
   टेक्स्ट के अंत में एक अतिरिक्त newline वर्ण नहीं होता है। यह महत्वपूर्ण है क्योंकि जब `kubectl`
   एक फ़ाइल पढ़ता है और सामग्री को base64 string में encode करता है, तो अतिरिक्त
   newline वर्ण भी encode हो जाता है। आपको फ़ाइल में शामिल strings में विशेष वर्णों को escape करने की आवश्यकता नहीं है।

1. `kubectl` कमांड में फ़ाइल paths पास करें:

   ```shell
   kubectl create secret generic db-user-pass \
       --from-file=./username.txt \
       --from-file=./password.txt
   ```

   डिफ़ॉल्ट key name फ़ाइल का नाम है। आप वैकल्पिक रूप से key name सेट कर सकते हैं
   `--from-file=[key=]source` का उपयोग करके। उदाहरण के लिए:

   ```shell
   kubectl create secret generic db-user-pass \
       --from-file=username=./username.txt \
       --from-file=password=./password.txt
   ```

किसी भी विधि के साथ, आउटपुट इस प्रकार है:

```text
secret/db-user-pass created
```

### Secret को सत्यापित करें {#verify-the-secret}

जांचें कि Secret बनाया गया था:

```shell
kubectl get secrets
```

आउटपुट इस प्रकार है:

```text
NAME              TYPE       DATA      AGE
db-user-pass      Opaque     2         51s
```

Secret का विवरण देखें:

```shell
kubectl describe secret db-user-pass
```

आउटपुट इस प्रकार है:

```text
Name:            db-user-pass
Namespace:       default
Labels:          <none>
Annotations:     <none>

Type:            Opaque

Data
====
password:    12 bytes
username:    5 bytes
```

`kubectl get` और `kubectl describe` कमांड डिफ़ॉल्ट रूप से एक `Secret` की सामग्री को दिखाने से बचते हैं।
यह `Secret` को गलती से exposed होने से, या terminal log में stored होने से बचाने के लिए है।

### Secret को डिकोड करें  {#decoding-secret}

1. आपके द्वारा बनाए गए Secret की सामग्री देखें:

   ```shell
   kubectl get secret db-user-pass -o jsonpath='{.data}'
   ```

   आउटपुट इस प्रकार है:

   ```json
   { "password": "UyFCXCpkJHpEc2I9", "username": "YWRtaW4=" }
   ```

1. `password` डेटा को डिकोड करें:

   ```shell
   echo 'UyFCXCpkJHpEc2I9' | base64 --decode
   ```

   आउटपुट इस प्रकार है:

   ```text
   S!B\*d$zDsb=
   ```

   {{< caution >}}
   यह दस्तावेज़ीकरण उद्देश्यों के लिए एक उदाहरण है। व्यवहार में,
   यह विधि encoded डेटा के साथ कमांड को आपके shell history में stored होने का कारण बन सकती है।
   आपके कंप्यूटर तक पहुंच वाला कोई भी व्यक्ति कमांड ढूंढ सकता है और secret को डिकोड कर सकता है। एक बेहतर दृष्टिकोण view और
   decode कमांड को संयोजित करना है।
   {{< /caution >}}

   ```shell
   kubectl get secret db-user-pass -o jsonpath='{.data.password}' | base64 --decode
   ```

## एक Secret संपादित करें {#edit-secret}

आप एक मौजूदा `Secret` object को संपादित कर सकते हैं जब तक कि यह
[immutable](/docs/concepts/configuration/secret/#secret-immutable) नहीं है। एक Secret को संपादित करने के लिए, निम्नलिखित कमांड चलाएं:

```shell
kubectl edit secrets <secret-name>
```

यह आपके डिफ़ॉल्ट editor को खोलता है और आपको base64 encoded
Secret values को `data` फ़ील्ड में अपडेट करने की अनुमति देता है, जैसे निम्नलिखित उदाहरण में:

```yaml
# Please edit the object below. Lines beginning with a '#' will be ignored,
# and an empty file will abort the edit. If an error occurs while saving this file, it will be
# reopened with the relevant failures.
#
apiVersion: v1
data:
  password: UyFCXCpkJHpEc2I9
  username: YWRtaW4=
kind: Secret
metadata:
  creationTimestamp: "2022-06-28T17:44:13Z"
  name: db-user-pass
  namespace: default
  resourceVersion: "12708504"
  uid: 91becd59-78fa-4c85-823f-6d44436242ac
type: Opaque
```

## सफाई

एक Secret को हटाने के लिए, निम्नलिखित कमांड चलाएं:

```shell
kubectl delete secret db-user-pass
```

## {{% heading "whatsnext" %}}

- [Secret concept](/docs/concepts/configuration/secret/) के बारे में और पढ़ें
- जानें कि [config file का उपयोग करके Secrets का प्रबंधन](/docs/tasks/configmap-secret/managing-secret-using-config-file/) कैसे करें
- जानें कि [kustomize का उपयोग करके Secrets का प्रबंधन](/docs/tasks/configmap-secret/managing-secret-using-kustomize/) कैसे करें

