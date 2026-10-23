---
title: Kustomize का उपयोग करके Secrets का प्रबंधन
content_type: task
weight: 30
description: kustomization.yaml file का उपयोग करके Secret objects बनाना।
---

<!-- overview -->

`kubectl` Secrets और ConfigMaps का प्रबंधन करने के लिए [Kustomize object management tool](/docs/tasks/manage-kubernetes-objects/kustomization/) का उपयोग करने का समर्थन करता है। आप Kustomize का उपयोग करके एक *resource generator* बनाते हैं, जो
एक Secret उत्पन्न करता है जिसे आप `kubectl` का उपयोग करके API server पर apply कर सकते हैं।

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## एक Secret बनाएं

आप एक `secretGenerator` को परिभाषित करके एक Secret उत्पन्न कर सकते हैं
`kustomization.yaml` file में जो अन्य मौजूदा files, `.env` files, या
literal values को reference करता है। उदाहरण के लिए, निम्नलिखित निर्देश username `admin` और password `1f2d1e2e67df` के लिए एक kustomization
file बनाते हैं।

{{< note >}}
Secret के लिए `stringData` फ़ील्ड server-side apply के साथ अच्छी तरह से काम नहीं करता है।
{{< /note >}}

### kustomization file बनाएं

{{< tabs name="Secret data" >}}
{{< tab name="Literals" codelang="yaml" >}}
secretGenerator:
- name: database-creds
  literals:
  - username=admin
  - password=1f2d1e2e67df
{{< /tab >}}
{{% tab name="Files" %}}
1.  क्रेडेंशियल्स को फ़ाइलों में स्टोर करें। फ़ाइल नाम secret की keys हैं:

    ```shell
    echo -n 'admin' > ./username.txt
    echo -n '1f2d1e2e67df' > ./password.txt
    ```
    `-n` flag यह सुनिश्चित करता है कि आपकी फ़ाइलों के अंत में कोई newline वर्ण नहीं है।

1.  `kustomization.yaml` file बनाएं:

    ```yaml
    secretGenerator:
    - name: database-creds
      files:
      - username.txt
      - password.txt
    ```
{{% /tab %}}
{{% tab name=".env files" %}}
आप `kustomization.yaml` file में secretGenerator को भी परिभाषित कर सकते हैं
`.env` files प्रदान करके। उदाहरण के लिए, निम्नलिखित `kustomization.yaml` file
एक `.env.secret` file से डेटा pull करती है:

```yaml
secretGenerator:
- name: db-user-pass
  envs:
  - .env.secret
```
{{% /tab %}}
{{< /tabs >}}

सभी मामलों में, आपको values को base64 में encode करने की आवश्यकता नहीं है। YAML
file का नाम **अवश्य** `kustomization.yaml` या `kustomization.yml` होना चाहिए।

### kustomization file को apply करें

Secret बनाने के लिए, उस directory को apply करें जिसमें kustomization file है:

```shell
kubectl apply -k <directory-path>
```

आउटपुट इस प्रकार है:

```text
secret/database-creds-5hdh7hhgfk created
```

जब एक Secret उत्पन्न होता है, तो Secret का नाम Secret डेटा को hash करके
और hash value को नाम में append करके बनाया जाता है। यह सुनिश्चित करता है कि
डेटा को modify किए जाने पर हर बार एक नया Secret उत्पन्न होता है।

Secret बनाया गया था या नहीं, इसे सत्यापित करने और Secret डेटा को डिकोड करने के लिए,

```shell
kubectl get -k <directory-path> -o jsonpath='{.data}' 
```

आउटपुट इस प्रकार है:

```text
{ "password": "MWYyZDFlMmU2N2Rm", "username": "YWRtaW4=" }
```

```shell
echo 'MWYyZDFlMmU2N2Rm' | base64 --decode
```

आउटपुट इस प्रकार है:

```text
1f2d1e2e67df
```

अधिक जानकारी के लिए, देखें
[Managing Secrets using kubectl](/docs/tasks/configmap-secret/managing-secret-using-kubectl/#verify-the-secret) और
[Declarative Management of Kubernetes Objects Using Kustomize](/docs/tasks/manage-kubernetes-objects/kustomization/).

## एक Secret संपादित करें {#edit-secret}

1.  अपनी `kustomization.yaml` file में, डेटा को संशोधित करें, जैसे `password`।
1.  उस directory को apply करें जिसमें kustomization file है:

    ```shell
    kubectl apply -k <directory-path>
    ```

    आउटपुट इस प्रकार है:

    ```text
    secret/db-user-pass-6f24b56cc8 created
    ```

संपादित Secret एक नए `Secret` object के रूप में बनाया जाता है, मौजूदा
`Secret` object को अपडेट करने के बजाय। आपको अपने Pods में Secret के references को अपडेट करने की आवश्यकता हो सकती है।

## सफाई

एक Secret को हटाने के लिए, `kubectl` का उपयोग करें:

```shell
kubectl delete secret db-user-pass
```

## {{% heading "whatsnext" %}}

- [Secret concept](/docs/concepts/configuration/secret/) के बारे में और पढ़ें
- जानें कि [kubectl का उपयोग करके Secrets का प्रबंधन](/docs/tasks/configmap-secret/managing-secret-using-kubectl/) कैसे करें
- जानें कि [config file का उपयोग करके Secrets का प्रबंधन](/docs/tasks/configmap-secret/managing-secret-using-config-file/) कैसे करें

