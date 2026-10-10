---
title: कॉन्फ़िगरेशन फाइल का उपयोग करके सीक्रेट्स का प्रबंधन
content_type: task
weight: 20
description: रिसोर्स कॉन्फ़िगरेशन फाइल का उपयोग करके सीक्रेट ऑब्जेक्ट बनाना।
---

<!-- overview -->

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## सीक्रेट बनाएं {#create-the-config-file}

आप पहले JSON या YAML फॉर्मेट में एक मैनिफेस्ट में `Secret` ऑब्जेक्ट को परिभाषित कर सकते हैं, और फिर उस ऑब्जेक्ट को बना सकते हैं। [Secret](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#secret-v1-core) रिसोर्स में दो मैप्स होते हैं: `data` और `stringData`। `data` फील्ड का उपयोग मनमाना डेटा स्टोर करने के लिए किया जाता है, जो base64 का उपयोग करके एनकोड किया जाता है। `stringData` फील्ड सुविधा के लिए प्रदान किया जाता है, और यह आपको समान डेटा को अनएनकोडेड स्ट्रिंग्स के रूप में प्रदान करने की अनुमति देता है। `data` और `stringData` की कुंजियों में अल्फ़ान्यूमेरिक वर्ण, `-`, `_` या `.` होने चाहिए।

निम्नलिखित उदाहरण `data` फील्ड का उपयोग करके एक सीक्रेट में दो स्ट्रिंग्स स्टोर करता है।

1. स्ट्रिंग्स को base64 में कनवर्ट करें:

   ```shell
   echo -n 'admin' | base64
   echo -n '1f2d1e2e67df' | base64
   ```
   {{< note >}}
   सीक्रेट डेटा के सीरियलाइज्ड JSON और YAML वैल्यू base64 स्ट्रिंग्स के रूप में एनकोड किए जाते हैं। इन स्ट्रिंग्स के भीतर न्यूलाइन मान्य नहीं हैं और इन्हें छोड़ा जाना चाहिए। Darwin/macOS पर `base64` यूटिलिटी का उपयोग करते समय, उपयोगकर्ताओं को लंबी लाइनों को विभाजित करने के लिए `-b` विकल्प का उपयोग करने से बचना चाहिए। इसके विपरीत, Linux उपयोगकर्ताओं को `base64` कमांड में `-w 0` विकल्प जोड़ना चाहिए या यदि `-w` विकल्प उपलब्ध नहीं है तो `base64 | tr -d '\n'` पाइपलाइन का उपयोग करना चाहिए।
   {{< /note >}}

   आउटपुट इस तरह का होता है:

   ```
   YWRtaW4=
   MWYyZDFlMmU2N2Rm
   ```

1. मैनिफेस्ट बनाएं:

   ```yaml
   apiVersion: v1
   kind: Secret
   metadata:
     name: mysecret
   type: Opaque
   data:
     username: YWRtaW4=
     password: MWYyZDFlMmU2N2Rm
   ```

   ध्यान दें कि एक सीक्रेट ऑब्जेक्ट का नाम एक मान्य [DNS सबडोमेन नाम](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names) होना चाहिए।

1. [`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands#apply) का उपयोग करके सीक्रेट बनाएं:

   ```shell
   kubectl apply -f ./secret.yaml
   ```

   आउटपुट इस तरह का होता है:

   ```
   secret/mysecret created
   ```

यह सत्यापित करने के लिए कि सीक्रेट बनाया गया था और सीक्रेट डेटा को डिकोड करने के लिए, [kubectl का उपयोग करके सीक्रेट्स का प्रबंधन](/docs/tasks/configmap-secret/managing-secret-using-kubectl/#verify-the-secret) देखें।

### सीक्रेट बनाते समय अनएनकोडेड डेटा निर्दिष्ट करें {#specify-unencoded-data-when-creating-a-secret}

कुछ परिदृश्यों के लिए, आप `stringData` फील्ड का उपयोग करना चाह सकते हैं। यह फील्ड आपको सीक्रेट में सीधे एक नॉन-base64 एनकोडेड स्ट्रिंग डालने की अनुमति देता है, और जब सीक्रेट बनाया या अपडेट किया जाता है तो स्ट्रिंग आपके लिए एनकोड की जाएगी।

इसका एक व्यावहारिक उदाहरण यह हो सकता है जहां आप एक एप्लिकेशन डिप्लॉय कर रहे हैं जो कॉन्फ़िगरेशन फाइल को स्टोर करने के लिए एक सीक्रेट का उपयोग करता है, और आप अपनी डिप्लॉयमेंट प्रक्रिया के दौरान उस कॉन्फ़िगरेशन फाइल के कुछ हिस्सों को पॉप्युलेट करना चाहते हैं।

उदाहरण के लिए, यदि आपका एप्लिकेशन निम्नलिखित कॉन्फ़िगरेशन फाइल का उपयोग करता है:

```yaml
apiUrl: "https://my.api.com/api/v1"
username: "<user>"
password: "<password>"
```

आप इसे निम्नलिखित परिभाषा का उपयोग करके एक सीक्रेट में स्टोर कर सकते हैं:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
stringData:
  config.yaml: |
    apiUrl: "https://my.api.com/api/v1"
    username: <user>
    password: <password>
```

{{< note >}}
सीक्रेट के लिए `stringData` फील्ड सर्वर-साइड एप्लाई के साथ अच्छी तरह से काम नहीं करता है।
{{< /note >}}

जब आप सीक्रेट डेटा प्राप्त करते हैं, तो कमांड एनकोडेड वैल्यू वापस करता है, न कि वे प्लेनटेक्स्ट वैल्यू जो आपने `stringData` में प्रदान किए थे।

उदाहरण के लिए, यदि आप निम्नलिखित कमांड चलाते हैं:

```shell
kubectl get secret mysecret -o yaml
```

आउटपुट इस तरह का होता है:

```yaml
apiVersion: v1
data:
  config.yaml: YXBpVXJsOiAiaHR0cHM6Ly9teS5hcGkuY29tL2FwaS92MSIKdXNlcm5hbWU6IHt7dXNlcm5hbWV9fQpwYXNzd29yZDoge3twYXNzd29yZH19
kind: Secret
metadata:
  creationTimestamp: 2018-11-15T20:40:59Z
  name: mysecret
  namespace: default
  resourceVersion: "7225"
  uid: c280ad2e-e916-11e8-98f2-025000000001
type: Opaque
```

### `data` और `stringData` दोनों निर्दिष्ट करें {#specifying-both-data-and-stringdata}

यदि आप एक फील्ड को `data` और `stringData` दोनों में निर्दिष्ट करते हैं, तो `stringData` से वैल्यू का उपयोग किया जाता है।

उदाहरण के लिए, यदि आप निम्नलिखित सीक्रेट को परिभाषित करते हैं:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  username: YWRtaW4=
stringData:
  username: administrator
```

{{< note >}}
सीक्रेट के लिए `stringData` फील्ड सर्वर-साइड एप्लाई के साथ अच्छी तरह से काम नहीं करता है।
{{< /note >}}

`Secret` ऑब्जेक्ट इस प्रकार बनाया जाता है:

```yaml
apiVersion: v1
data:
  username: YWRtaW5pc3RyYXRvcg==
kind: Secret
metadata:
  creationTimestamp: 2018-11-15T20:46:46Z
  name: mysecret
  namespace: default
  resourceVersion: "7579"
  uid: 91460ecb-e917-11e8-98f2-025000000001
type: Opaque
```

`YWRtaW5pc3RyYXRvcg==` डिकोड होकर `administrator` बनता है।

## सीक्रेट को संपादित करें {#edit-secret}

मैनिफेस्ट का उपयोग करके बनाए गए सीक्रेट में डेटा को संपादित करने के लिए, अपने मैनिफेस्ट में `data` या `stringData` फील्ड को संशोधित करें और फाइल को अपने क्लस्टर में लागू करें। आप एक मौजूदा `Secret` ऑब्जेक्ट को संपादित कर सकते हैं जब तक कि वह [अपरिवर्तनीय](/docs/concepts/configuration/secret/#secret-immutable) नहीं है।

उदाहरण के लिए, यदि आप पिछले उदाहरण से पासवर्ड को `birdsarentreal` में बदलना चाहते हैं, तो निम्नलिखित करें:

1. नई पासवर्ड स्ट्रिंग को एनकोड करें:

   ```shell
   echo -n 'birdsarentreal' | base64
   ```

   आउटपुट इस तरह का होता है:

   ```
   YmlyZHNhcmVudHJlYWw=
   ```

1. अपनी नई पासवर्ड स्ट्रिंग के साथ `data` फील्ड को अपडेट करें:

   ```yaml
   apiVersion: v1
   kind: Secret
   metadata:
     name: mysecret
   type: Opaque
   data:
     username: YWRtaW4=
     password: YmlyZHNhcmVudHJlYWw=
   ```

1. मैनिफेस्ट को अपने क्लस्टर में लागू करें:

   ```shell
   kubectl apply -f ./secret.yaml
   ```

   आउटपुट इस तरह का होता है:

   ```
   secret/mysecret configured
   ```

कुबेरनेट्स मौजूदा `Secret` ऑब्जेक्ट को अपडेट करता है। विस्तार से, `kubectl` टूल नोटिस करता है कि समान नाम का एक मौजूदा `Secret` ऑब्जेक्ट है। `kubectl` मौजूदा ऑब्जेक्ट को प्राप्त करता है, उसमें परिवर्तनों की योजना बनाता है, और बदले हुए `Secret` ऑब्जेक्ट को आपके क्लस्टर कंट्रोल प्लेन को सबमिट करता है।

यदि आपने इसके बजाय `kubectl apply --server-side` निर्दिष्ट किया है, तो `kubectl` [सर्वर साइड एप्लाई](/docs/reference/using-api/server-side-apply/) का उपयोग करता है।

## साफ़ करें {#clean-up}

आपके द्वारा बनाए गए सीक्रेट को हटाने के लिए:

```shell
kubectl delete secret mysecret
```

## {{% heading "whatsnext" %}}

- [सीक्रेट कॉन्सेप्ट](/docs/concepts/configuration/secret/) के बारे में और पढ़ें
- [kubectl का उपयोग करके सीक्रेट्स का प्रबंधन](/docs/tasks/configmap-secret/managing-secret-using-kubectl/) करना सीखें
- [kustomize का उपयोग करके सीक्रेट्स का प्रबंधन](/docs/tasks/configmap-secret/managing-secret-using-kustomize/) करना सीखें 