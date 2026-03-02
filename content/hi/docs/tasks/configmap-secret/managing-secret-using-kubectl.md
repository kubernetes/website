---
title: kubectl का उपयोग करके सीक्रेट का प्रबंधन
content_type: task
weight: 10
description: kubectl कमांड लाइन का उपयोग करके सीक्रेट ऑब्जेक्ट बनाना।
---

<!-- overview -->

यह पेज आपको `kubectl` कमांड-लाइन टूल का उपयोग करके कुबेरनेट्स {{<glossary_tooltip text="Secret" term_id="secret">}} को कैसे बनाने, संपादित करने, प्रबंधित करने और हटाने का तरीका दिखाता है।

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## सीक्रेट बनाएं

एक `Secret` ऑब्जेक्ट संवेदनशील डेटा जैसे क्रेडेंशियल को स्टोर करता है जिसका उपयोग पॉड्स द्वारा डेटाबेस तक पहुंचने के लिए किया जाता है। उदाहरण के लिए, आपको डेटाबेस तक पहुंचने के लिए आवश्यक उपयोगकर्ता नाम और पासवर्ड को स्टोर करने के लिए एक सीक्रेट की आवश्यकता हो सकती है।

आप कमांड में रॉ डेटा पास करके या क्रेडेंशियल्स को फाइलों में स्टोर करके सीक्रेट बना सकते हैं जिन्हें आप कमांड में पास करते हैं। निम्नलिखित कमांड एक सीक्रेट बनाते हैं जो उपयोगकर्ता नाम `admin` और पासवर्ड `S!B\*d$zDsb=` को स्टोर करता है।

### रॉ डेटा का उपयोग करें

निम्नलिखित कमांड चलाएं:

```shell
kubectl create secret generic db-user-pass \
    --from-literal=username=admin \
    --from-literal=password='S!B\*d$zDsb='
```

आपको अपनी स्ट्रिंग में विशेष वर्णों जैसे `$`, `\`, `*`, `=`, और `!` को एस्केप करने के लिए एकल उद्धरण `'''` का उपयोग करना होगा। यदि आप ऐसा नहीं करते हैं, तो आपका शेल इन वर्णों की व्याख्या करेगा।

{{< note >}}
सीक्रेट के लिए `stringData` फील्ड सर्वर-साइड एप्लाई के साथ अच्छी तरह से काम नहीं करता है।
{{< /note >}}

### स्रोत फाइलों का उपयोग करें

1. क्रेडेंशियल्स को फाइलों में स्टोर करें:

   ```shell
   echo -n 'admin' > ./username.txt
   echo -n 'S!B\*d$zDsb=' > ./password.txt
   ```

   `-n` फ्लैग यह सुनिश्चित करता है कि जनरेट की गई फाइलों में टेक्स्ट के अंत में एक अतिरिक्त न्यूलाइन वर्ण नहीं है। यह महत्वपूर्ण है क्योंकि जब `kubectl` एक फाइल को पढ़ता है और सामग्री को base64 स्ट्रिंग में एनकोड करता है, तो अतिरिक्त न्यूलाइन वर्ण भी एनकोड हो जाता है। आपको फाइल में शामिल स्ट्रिंग्स में विशेष वर्णों को एस्केप करने की आवश्यकता नहीं है।

1. `kubectl` कमांड में फाइल पथ पास करें:

   ```shell
   kubectl create secret generic db-user-pass \
       --from-file=./username.txt \
       --from-file=./password.txt
   ```

   डिफ़ॉल्ट कुंजी नाम फाइल का नाम है। आप वैकल्पिक रूप से `--from-file=[key=]source` का उपयोग करके कुंजी नाम सेट कर सकते हैं। उदाहरण के लिए:

   ```shell
   kubectl create secret generic db-user-pass \
       --from-file=username=./username.txt \
       --from-file=password=./password.txt
   ```

किसी भी विधि के साथ, आउटपुट इस तरह का होता है:

```
secret/db-user-pass created
```

### सीक्रेट को सत्यापित करें {#verify-the-secret}

जांचें कि सीक्रेट बनाया गया था:

```shell
kubectl get secrets
```

आउटपुट इस तरह का होता है:

```
NAME              TYPE       DATA      AGE
db-user-pass      Opaque     2         51s
```

सीक्रेट के विवरण देखें:

```shell
kubectl describe secret db-user-pass
```

आउटपुट इस तरह का होता है:

```
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

`kubectl get` और `kubectl describe` कमांड डिफ़ॉल्ट रूप से `Secret` की सामग्री को दिखाने से बचते हैं। यह `Secret` को गलती से एक्सपोज होने से बचाने के लिए है, या टर्मिनल लॉग में स्टोर होने से बचाने के लिए है।

### सीक्रेट को डिकोड करें {#decoding-secret}

1. आपके द्वारा बनाए गए सीक्रेट की सामग्री देखें:

   ```shell
   kubectl get secret db-user-pass -o jsonpath='{.data}'
   ```

   आउटपुट इस तरह का होता है:

   ```json
   { "password": "UyFCXCpkJHpEc2I9", "username": "YWRtaW4=" }
   ```

1. `password` डेटा को डिकोड करें:

   ```shell
   echo 'UyFCXCpkJHpEc2I9' | base64 --decode
   ```

   आउटपुट इस तरह का होता है:

   ```
   S!B\*d$zDsb=
   ```

   {{< caution >}}
   यह दस्तावेज़ीकरण के उद्देश्यों के लिए एक उदाहरण है। व्यवहार में,
   यह विधि एनकोडेड डेटा के साथ कमांड को आपके शेल इतिहास में स्टोर कर सकती है। आपके कंप्यूटर तक पहुंच रखने वाला कोई भी व्यक्ति कमांड को ढूंढ सकता है और सीक्रेट को डिकोड कर सकता है। एक बेहतर दृष्टिकोण व्यू और डिकोड कमांड को संयोजित करना है।
   {{< /caution >}}

   ```shell
   kubectl get secret db-user-pass -o jsonpath='{.data.password}' | base64 --decode
   ```

## सीक्रेट को संपादित करें {#edit-secret}

आप एक मौजूदा `Secret` ऑब्जेक्ट को संपादित कर सकते हैं जब तक कि वह [अपरिवर्तनीय](/docs/concepts/configuration/secret/#secret-immutable) नहीं है। सीक्रेट को संपादित करने के लिए, निम्नलिखित कमांड चलाएं:

```shell
kubectl edit secrets <secret-name>
```

यह आपका डिफ़ॉल्ट एडिटर खोलता है और आपको `data` फील्ड में base64 एनकोडेड सीक्रेट मान को अपडेट करने की अनुमति देता है, जैसा कि निम्नलिखित उदाहरण में है:

```yaml
# कृपया नीचे दिए गए ऑब्जेक्ट को संपादित करें। '#' से शुरू होने वाली लाइनें अनदेखी कर दी जाएंगी,
# और एक खाली फाइल संपादन को निरस्त कर देगी। यदि इस फाइल को सहेजते समय कोई त्रुटि होती है, तो इसे
# संबंधित विफलताओं के साथ फिर से खोला जाएगा।
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

## साफ़ करें

सीक्रेट को हटाने के लिए, निम्नलिखित कमांड चलाएं:

```shell
kubectl delete secret db-user-pass
```

## {{% heading "whatsnext" %}}

- [सीक्रेट कॉन्सेप्ट](/docs/concepts/configuration/secret/) के बारे में और पढ़ें
- [कॉन्फ़िग फाइल का उपयोग करके सीक्रेट का प्रबंधन](/docs/tasks/configmap-secret/managing-secret-using-config-file/) करना सीखें
- [kustomize का उपयोग करके सीक्रेट का प्रबंधन](/docs/tasks/configmap-secret/managing-secret-using-kustomize/) करना सीखें
