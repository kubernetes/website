---
title: Configuration File का उपयोग करके Secrets का प्रबंधन
content_type: task
weight: 20
description: Resource configuration file का उपयोग करके Secret objects बनाना।
---

<!-- overview -->

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Secret बनाएं {#create-the-config-file}

आप पहले एक manifest में `Secret` object को JSON या YAML प्रारूप में परिभाषित कर सकते हैं,
और फिर उस object को बना सकते हैं।
[Secret](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#secret-v1-core)
resource में दो maps होते हैं: `data` और `stringData`।
`data` फ़ील्ड का उपयोग arbitrary डेटा को स्टोर करने के लिए किया जाता है, जो base64 का उपयोग करके encoded होता है।
`stringData` फ़ील्ड सुविधा के लिए प्रदान किया गया है, और यह आपको
unencoded strings के रूप में समान डेटा प्रदान करने की अनुमति देता है।
`data` और `stringData` की keys में alphanumeric वर्ण,
`-`, `_` या `.` शामिल होने चाहिए।

निम्नलिखित उदाहरण `data` फ़ील्ड का उपयोग करके एक Secret में दो strings को स्टोर करता है।

1. Strings को base64 में कन्वर्ट करें:

   ```shell
   echo -n 'admin' | base64
   echo -n '1f2d1e2e67df' | base64
   ```

   {{< note >}}
   Secret डेटा के serialized JSON और YAML values को base64 strings के रूप में encode किया जाता है। इन strings के भीतर newlines वैध नहीं हैं और इन्हें छोड़ दिया जाना चाहिए। Darwin/macOS पर `base64` utility का उपयोग करते समय, users को लंबी lines को split करने के लिए `-b` विकल्प का उपयोग करने से बचना चाहिए। इसके विपरीत, Linux users को `base64` कमांड में `-w 0` विकल्प जोड़ना चाहिए या pipeline `base64 | tr -d '\n'` यदि `-w` विकल्प उपलब्ध नहीं है।
   {{< /note >}}

   आउटपुट इस प्रकार है:

   ```text
   YWRtaW4=
   MWYyZDFlMmU2N2Rm
   ```

1. Manifest बनाएं:

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

   ध्यान दें कि Secret object का नाम एक वैध
   [DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names) होना चाहिए।

1. [`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands#apply) का उपयोग करके Secret बनाएं:

   ```shell
   kubectl apply -f ./secret.yaml
   ```

   आउटपुट इस प्रकार है:

   ```text
   secret/mysecret created
   ```

Secret बनाया गया था या नहीं, इसे सत्यापित करने और Secret डेटा को डिकोड करने के लिए,
[Managing Secrets using kubectl](/docs/tasks/configmap-secret/managing-secret-using-kubectl/#verify-the-secret) देखें।

### Secret बनाते समय unencoded डेटा निर्दिष्ट करें

कुछ परिदृश्यों के लिए, आप `stringData` फ़ील्ड का उपयोग करना चाह सकते हैं। यह
फ़ील्ड आपको एक non-base64 encoded string को सीधे Secret में रखने की अनुमति देता है,
और string को encode किया जाएगा जब Secret बनाया या अपडेट किया जाता है।

इसका एक व्यावहारिक उदाहरण यह हो सकता है कि आप एक application deploy कर रहे हैं
जो एक configuration file को स्टोर करने के लिए Secret का उपयोग करता है, और आप उस configuration file के parts को populate करना चाहते हैं
अपने deployment process के दौरान।

उदाहरण के लिए, यदि आपका application निम्नलिखित configuration file का उपयोग करता है:

```yaml
apiUrl: "https://my.api.com/api/v1"
username: "<user>"
password: "<password>"
```

आप इसे निम्नलिखित परिभाषा का उपयोग करके एक Secret में स्टोर कर सकते हैं:

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
Secret के लिए `stringData` फ़ील्ड server-side apply के साथ अच्छी तरह से काम नहीं करता है।
{{< /note >}}

जब आप Secret डेटा retrieve करते हैं, तो कमांड encoded values लौटाता है,
और `stringData` में आपके द्वारा प्रदान किए गए plaintext values नहीं।

उदाहरण के लिए, यदि आप निम्नलिखित कमांड चलाते हैं:

```shell
kubectl get secret mysecret -o yaml
```

आउटपुट इस प्रकार है:

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

### `data` और `stringData` दोनों निर्दिष्ट करें

यदि आप `data` और `stringData` दोनों में एक फ़ील्ड निर्दिष्ट करते हैं, तो `stringData` से value का उपयोग किया जाता है।

उदाहरण के लिए, यदि आप निम्नलिखित Secret को परिभाषित करते हैं:

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
Secret के लिए `stringData` फ़ील्ड server-side apply के साथ अच्छी तरह से काम नहीं करता है।
{{< /note >}}

`Secret` object इस प्रकार बनाया जाता है:

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

`YWRtaW5pc3RyYXRvcg==` को `administrator` में डिकोड किया जाता है।

## एक Secret संपादित करें {#edit-secret}

एक manifest का उपयोग करके बनाए गए Secret में डेटा को संपादित करने के लिए, `data`
या `stringData` फ़ील्ड को अपने manifest में संशोधित करें और फ़ाइल को अपने
cluster पर apply करें। आप एक मौजूदा `Secret` object को संपादित कर सकते हैं जब तक कि यह
[immutable](/docs/concepts/configuration/secret/#secret-immutable) नहीं है।

उदाहरण के लिए, यदि आप पिछले उदाहरण से password को
`birdsarentreal` में बदलना चाहते हैं, तो निम्नलिखित करें:

1. नए password string को encode करें:

   ```shell
   echo -n 'birdsarentreal' | base64
   ```

   आउटपुट इस प्रकार है:

   ```text
   YmlyZHNhcmVudHJlYWw=
   ```

1. अपने नए password string के साथ `data` फ़ील्ड को अपडेट करें:

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

1. Manifest को अपने cluster पर apply करें:

   ```shell
   kubectl apply -f ./secret.yaml
   ```

   आउटपुट इस प्रकार है:

   ```text
   secret/mysecret configured
   ```

कुबेरनेट्स मौजूदा `Secret` object को अपडेट करता है। विस्तार से, `kubectl` tool
ध्यान देता है कि एक ही नाम के साथ एक मौजूदा `Secret` object है। `kubectl`
मौजूदा object को fetch करता है, इसमें changes की योजना बनाता है, और changed
`Secret` object को अपने cluster control plane में submit करता है।

यदि आपने `kubectl apply --server-side` निर्दिष्ट किया है, तो `kubectl` इसके बजाय
[Server Side Apply](/docs/reference/using-api/server-side-apply/) का उपयोग करता है।

## सफाई

आपके द्वारा बनाए गए Secret को हटाने के लिए:

```shell
kubectl delete secret mysecret
```

## {{% heading "whatsnext" %}}

- [Secret concept](/docs/concepts/configuration/secret/) के बारे में और पढ़ें
- जानें कि [kubectl का उपयोग करके Secrets का प्रबंधन](/docs/tasks/configmap-secret/managing-secret-using-kubectl/) कैसे करें
- जानें कि [kustomize का उपयोग करके Secrets का प्रबंधन](/docs/tasks/configmap-secret/managing-secret-using-kustomize/) कैसे करें
