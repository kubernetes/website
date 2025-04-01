---
title: कस्टम रिसोर्स का उपयोग करें
reviewers:
- deads2k
- enisoc
content_type: task
weight: 20
---

<!-- overview -->

कस्टम रिसोर्स डेफिनिशन (CRD) का उपयोग करके Kubernetes API का विस्तार करने से आप अपने क्लस्टर में नए प्रकार के रिसोर्स को परिभाषित और उपयोग कर सकते हैं।

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## कस्टम रिसोर्स डेफिनिशन बनाएं

कस्टम रिसोर्स डेफिनिशन (CRD) API एक्सटेंशन को परिभाषित करता है जो आपके क्लस्टर में उपलब्ध होगा। CRD ऑब्जेक्ट को परिभाषित करता है जिसका नाम और स्कीमा है।

यहाँ एक CRD का उदाहरण है जो `CronTab` नामक एक कस्टम रिसोर्स को परिभाषित करता है:

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  # नाम <plural>.<group> के रूप में होना चाहिए
  name: crontabs.stable.example.com
spec:
  # समूह नाम, API सर्वर द्वारा उपयोग किया जाता है
  group: stable.example.com
  # इस CRD द्वारा समर्थित संस्करणों की सूची
  versions:
    - name: v1
      # प्रत्येक संस्करण को सर्वेड होने के लिए सक्षम होना चाहिए
      served: true
      # एक और केवल एक संस्करण को स्टोरेज संस्करण के रूप में चिह्नित किया जाना चाहिए
      storage: true
      schema:
        openAPIV3Schema:
          type: object
          properties:
            spec:
              type: object
              properties:
                cronSpec:
                  type: string
                image:
                  type: string
                replicas:
                  type: integer
  # या तो Namespaced या Cluster
  scope: Namespaced
  names:
    # URL में उपयोग किया जाने वाला बहुवचन नाम
    plural: crontabs
    # कमांड लाइन पर उपयोग किया जाने वाला एकवचन नाम
    singular: crontab
    # camelCase में एकवचन नाम
    kind: CronTab
    # API संस्करणों में उपयोग किए जाने वाले छोटे नाम
    shortNames:
    - ct
```

इस CRD को सहेजें `resourcedefinition.yaml` में। फिर इसे बनाएं:

```shell
kubectl apply -f resourcedefinition.yaml
```

एक नया नेमस्पेस बनाएं, `my-namespace.yaml`:

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: my-namespace
```

फिर CRD को लागू करें:

```shell
kubectl apply -f resourcedefinition.yaml
```

अब आप अपने क्लस्टर में कस्टम रिसोर्स बना सकते हैं। निम्नलिखित YAML एक `CronTab` कस्टम रिसोर्स का उदाहरण है:

```yaml
apiVersion: "stable.example.com/v1"
kind: CronTab
metadata:
  name: my-new-cron-object
spec:
  cronSpec: "* * * * */5"
  image: my-awesome-cron-image
```

इस कस्टम रिसोर्स को सहेजें `my-crontab.yaml`:

```yaml
apiVersion: "stable.example.com/v1"
kind: CronTab
metadata:
  name: my-new-cron-object
spec:
  cronSpec: "* * * * */5"
  image: my-awesome-cron-image
```

और इसे बनाएं:

```shell
kubectl apply -f my-crontab.yaml -n my-namespace
```

आप अपने कस्टम रिसोर्स को निम्नलिखित कमांड के साथ देख सकते हैं:

```shell
kubectl get crontab
```

यह आपको निम्नलिखित आउटपुट देगा:

```
NAME                 AGE
my-new-cron-object   6s
```

{{< note >}}
कस्टम रिसोर्स डेफिनिशन बनाने के बाद, आपको कुछ सेकंड प्रतीक्षा करनी होगी ताकि API सर्वर नए CRD को पंजीकृत कर सके।
{{< /note >}}

## कस्टम रिसोर्स डेफिनिशन में संस्करण

कस्टम रिसोर्स डेफिनिशन (CRD) में कई संस्करण हो सकते हैं। उदाहरण के लिए, आपके पास एक CRD हो सकता है जो `v1` और `v1beta1` दोनों संस्करणों को समर्थन करता है। यह आपको अपने API को विकसित करने की अनुमति देता है।

प्रत्येक संस्करण को निम्नलिखित फ़ील्ड के साथ परिभाषित किया जाना चाहिए:

* `name`: संस्करण का नाम (उदाहरण के लिए, `v1`, `v1beta1`)
* `served`: क्या यह संस्करण API सर्वर द्वारा सेवित होना चाहिए
* `storage`: क्या यह संस्करण स्टोरेज में सहेजा जाना चाहिए
* `schema`: इस संस्करण के लिए OpenAPI स्कीमा

उदाहरण के लिए:

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: crontabs.stable.example.com
spec:
  group: stable.example.com
  versions:
    - name: v1
      served: true
      storage: true
      schema:
        openAPIV3Schema:
          type: object
          properties:
            spec:
              type: object
              properties:
                cronSpec:
                  type: string
                image:
                  type: string
                replicas:
                  type: integer
    - name: v1beta1
      served: true
      storage: false
      schema:
        openAPIV3Schema:
          type: object
          properties:
            spec:
              type: object
              properties:
                cronSpec:
                  type: string
                image:
                  type: string
                replicas:
                  type: integer
  scope: Namespaced
  names:
    plural: crontabs
    singular: crontab
    kind: CronTab
    shortNames:
    - ct
```

इस CRD में, `v1` और `v1beta1` दोनों संस्करण सेवित हैं, लेकिन केवल `v1` संस्करण स्टोरेज में सहेजा जाता है। यह आपको अपने API को विकसित करने की अनुमति देता है, जबकि पुराने संस्करणों को भी समर्थन प्रदान करता है।

## आगे क्या है

* [कस्टम रिसोर्स डेफिनिशन](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/) के बारे में अधिक जानें
* [कस्टम रिसोर्स डेफिनिशन में संस्करण](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definition-versioning/) के बारे में अधिक जानें
* [कस्टम रिसोर्स डेफिनिशन में स्टेटस सबरिसोर्स](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#status-subresource) के बारे में अधिक जानें
* [कस्टम रिसोर्स डेफिनिशन में स्केल सबरिसोर्स](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#scale-subresource) के बारे में अधिक जानें 