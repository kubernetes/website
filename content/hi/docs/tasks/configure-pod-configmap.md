---
title: ConfigMap का उपयोग करने के लिए Pod कॉन्फ़िगर करें
content_type: task
weight: 190
card:
  name: tasks
  weight: 50
---

<!-- overview -->
कई एप्लिकेशन कॉन्फ़िगरेशन पर निर्भर करते हैं, जिसका उपयोग एप्लिकेशन के initialization के दौरान या runtime में किया जाता है।
ज़्यादातर बार, कॉन्फ़िगरेशन पैरामीटर को दिए गए मानों को समायोजित करने की आवश्यकता होती है।
ConfigMap, Kubernetes का एक मैकेनिज़्म है जो आपको कॉन्फ़िगरेशन डेटा को एप्लिकेशन
{{< glossary_tooltip text="pods" term_id="pod" >}} में inject करने देता है।

ConfigMap का कॉन्सेप्ट आपको कॉन्फ़िगरेशन artifacts को image content से अलग (decouple) करने देता है,
ताकि containerized applications पोर्टेबल बनी रहें। उदाहरण के लिए, आप एक ही
{{< glossary_tooltip text="container image" term_id="image" >}} को डाउनलोड और रन करके
local development, system test, या live end-user workload चलाने के लिए कंटेनर शुरू कर सकते हैं।

यह पेज उपयोग के कई उदाहरण देता है, जिनसे यह दिखाया गया है कि ConfigMap कैसे बनाएँ और
ConfigMap में स्टोर किए गए डेटा का उपयोग करके Pods को कैसे कॉन्फ़िगर करें।

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

आपके सिस्टम में `wget` टूल इंस्टॉल होना चाहिए। अगर आपके पास कोई दूसरा टूल
जैसे `curl` है और `wget` नहीं है, तो आपको example data डाउनलोड करने वाला
step उसी के अनुसार बदलना होगा।

<!-- steps -->

## ConfigMap बनाएं

ConfigMap बनाने के लिए आप या तो `kubectl create configmap` का उपयोग कर सकते हैं या
`kustomization.yaml` में ConfigMap generator का।

### `kubectl create configmap` का उपयोग करके ConfigMap बनाएं

`kubectl create configmap` कमांड का उपयोग करके आप
[directories](#create-configmaps-from-directories), [files](#create-configmaps-from-files),
या [literal values](#create-configmaps-from-literal-values) से ConfigMap बना सकते हैं:

```shell
kubectl create configmap <map-name> <data-source>
```

जहाँ \<map-name> वह नाम है जो आप ConfigMap को देना चाहते हैं और \<data-source> वह
directory, file, या literal value है जिससे डेटा लिया जाएगा।
ConfigMap ऑब्जेक्ट का नाम एक वैध
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names) होना चाहिए।

जब आप किसी फ़ाइल के आधार पर ConfigMap बनाते हैं, तो \<data-source> में key डिफ़ॉल्ट रूप से
उस फ़ाइल का basename होती है, और value डिफ़ॉल्ट रूप से फ़ाइल का content होता है।

आप [`kubectl describe`](/docs/reference/generated/kubectl/kubectl-commands/#describe) या
[`kubectl get`](/docs/reference/generated/kubectl/kubectl-commands/#get) का उपयोग करके
ConfigMap की जानकारी प्राप्त कर सकते हैं।

#### डायरेक्टरी से ConfigMap बनाएं {#create-configmaps-from-directories}

आप `kubectl create configmap` का उपयोग करके एक ही डायरेक्टरी में मौजूद कई फ़ाइलों से
ConfigMap बना सकते हैं। जब आप डायरेक्टरी के आधार पर ConfigMap बनाते हैं, तो kubectl उन
फ़ाइलों की पहचान करता है जिनका filename वैध key होता है, और हर ऐसी फ़ाइल को नए
ConfigMap में पैकेज करता है। सामान्य फ़ाइलों (regular files) के अलावा बाकी डायरेक्टरी entries
नज़रअंदाज़ कर दी जाती हैं (जैसे: subdirectories, symlinks, devices, pipes, आदि)।

{{< note >}}
ConfigMap बनाने के लिए उपयोग होने वाला हर filename केवल स्वीकार्य अक्षरों से बना होना चाहिए:
letters (`A` से `Z` और `a` से `z`), digits (`0` से `9`), '-', '_', या '.'।
अगर आप `kubectl create configmap` को ऐसी डायरेक्टरी पर चलाते हैं जहाँ किसी फ़ाइल के नाम में
अस्वीकार्य कैरेक्टर हो, तो `kubectl` कमांड fail हो सकती है।

जब `kubectl` कमांड को invalid filename मिलता है, तो यह हमेशा error प्रिंट नहीं करता।
{{< /note >}}

लोकल डायरेक्टरी बनाएं:

```shell
mkdir -p configure-pod-container/configmap/
```

अब sample configuration डाउनलोड करें और ConfigMap बनाएं:

```shell
# Download the sample files into `configure-pod-container/configmap/` directory
wget https://kubernetes.io/examples/configmap/game.properties -O configure-pod-container/configmap/game.properties
wget https://kubernetes.io/examples/configmap/ui.properties -O configure-pod-container/configmap/ui.properties

# Create the ConfigMap
kubectl create configmap game-config --from-file=configure-pod-container/configmap/
```

ऊपर दी गई कमांड हर फ़ाइल को पैकेज करती है, इस केस में `game.properties` और `ui.properties`
को `configure-pod-container/configmap/` डायरेक्टरी से `game-config` ConfigMap में जोड़ती है।
आप नीचे दी गई कमांड से ConfigMap का विवरण देख सकते हैं:

```shell
kubectl describe configmaps game-config
```

आउटपुट कुछ इस तरह होगा:
```
Name:         game-config
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
game.properties:
----
enemies=aliens
lives=3
enemies.cheat=true
enemies.cheat.level=noGoodRotten
secret.code.passphrase=UUDDLRLRBABAS
secret.code.allowed=true
secret.code.lives=30
ui.properties:
----
color.good=purple
color.bad=yellow
allow.textmode=true
how.nice.to.look=fairlyNice
```

`configure-pod-container/configmap/` डायरेक्टरी में मौजूद `game.properties` और `ui.properties`
फ़ाइलें ConfigMap के `data` सेक्शन में प्रदर्शित होती हैं।

```shell
kubectl get configmaps game-config -o yaml
```
आउटपुट कुछ इस तरह होगा:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2022-02-18T18:52:05Z
  name: game-config
  namespace: default
  resourceVersion: "516"
  uid: b4952dc3-d670-11e5-8cd0-68f728db1985
data:
  game.properties: |
    enemies=aliens
    lives=3
    enemies.cheat=true
    enemies.cheat.level=noGoodRotten
    secret.code.passphrase=UUDDLRLRBABAS
    secret.code.allowed=true
    secret.code.lives=30
  ui.properties: |
    color.good=purple
    color.bad=yellow
    allow.textmode=true
    how.nice.to.look=fairlyNice
```

#### फ़ाइलों से ConfigMap बनाएं

आप `kubectl create configmap` का उपयोग करके एक फ़ाइल या
कई फ़ाइलों से ConfigMap बना सकते हैं।

उदाहरण के लिए,

```shell
kubectl create configmap game-config-2 --from-file=configure-pod-container/configmap/game.properties
```

यह निम्न ConfigMap बनाएगा:

```shell
kubectl describe configmaps game-config-2
```

जहाँ आउटपुट कुछ इस तरह होगा:

```
Name:         game-config-2
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
game.properties:
----
enemies=aliens
lives=3
enemies.cheat=true
enemies.cheat.level=noGoodRotten
secret.code.passphrase=UUDDLRLRBABAS
secret.code.allowed=true
secret.code.lives=30
```

कई data sources से ConfigMap बनाने के लिए आप `--from-file` argument को कई बार दे सकते हैं।

```shell
kubectl create configmap game-config-2 --from-file=configure-pod-container/configmap/game.properties --from-file=configure-pod-container/configmap/ui.properties
```

आप नीचे दी गई कमांड से `game-config-2` ConfigMap का विवरण देख सकते हैं:

```shell
kubectl describe configmaps game-config-2
```

आउटपुट कुछ इस तरह होगा:

```
Name:         game-config-2
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
game.properties:
----
enemies=aliens
lives=3
enemies.cheat=true
enemies.cheat.level=noGoodRotten
secret.code.passphrase=UUDDLRLRBABAS
secret.code.allowed=true
secret.code.lives=30
ui.properties:
----
color.good=purple
color.bad=yellow
allow.textmode=true
how.nice.to.look=fairlyNice
```

env-file से ConfigMap बनाने के लिए `--from-env-file` विकल्प का उपयोग करें, उदाहरण के लिए:

```shell
# Env-files contain a list of environment variables.
# These syntax rules apply:
#   Each line in an env file has to be in VAR=VAL format.
#   Lines beginning with # (i.e. comments) are ignored.
#   Blank lines are ignored.
#   There is no special handling of quotation marks (i.e. they will be part of the ConfigMap value)).

# Download the sample files into `configure-pod-container/configmap/` directory
wget https://kubernetes.io/examples/configmap/game-env-file.properties -O configure-pod-container/configmap/game-env-file.properties
wget https://kubernetes.io/examples/configmap/ui-env-file.properties -O configure-pod-container/configmap/ui-env-file.properties

# The env-file `game-env-file.properties` looks like below
cat configure-pod-container/configmap/game-env-file.properties
enemies=aliens
lives=3
allowed="true"

# This comment and the empty line above it are ignored
```

```shell
kubectl create configmap game-config-env-file \
       --from-env-file=configure-pod-container/configmap/game-env-file.properties
```

यह एक ConfigMap बनाएगा। ConfigMap देखें:

```shell
kubectl get configmap game-config-env-file -o yaml
```

आउटपुट कुछ इस तरह होगा:
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2019-12-27T18:36:28Z
  name: game-config-env-file
  namespace: default
  resourceVersion: "809965"
  uid: d9d1ca5b-eb34-11e7-887b-42010a8002b8
data:
  allowed: '"true"'
  enemies: aliens
  lives: "3"
```

Kubernetes v1.23 से, `kubectl` में `--from-env-file` argument को
कई बार specify करके कई data sources से ConfigMap बनाना समर्थित है।

```shell
kubectl create configmap config-multi-env-files \
        --from-env-file=configure-pod-container/configmap/game-env-file.properties \
        --from-env-file=configure-pod-container/configmap/ui-env-file.properties
```

यह निम्न ConfigMap बनाएगा:

```shell
kubectl get configmap config-multi-env-files -o yaml
```

जहाँ आउटपुट कुछ इस तरह होगा:
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2019-12-27T18:38:34Z
  name: config-multi-env-files
  namespace: default
  resourceVersion: "810136"
  uid: 252c4572-eb35-11e7-887b-42010a8002b8
data:
  allowed: '"true"'
  color: purple
  enemies: aliens
  how: fairlyNice
  lives: "3"
  textmode: "true"
```

#### फ़ाइल से ConfigMap बनाते समय उपयोग होने वाली key परिभाषित करें

जब आप `--from-file` argument का उपयोग करते हैं, तब ConfigMap के `data` सेक्शन में
फ़ाइल नाम के बजाय कोई दूसरी key भी परिभाषित कर सकते हैं:

```shell
kubectl create configmap game-config-3 --from-file=<my-key-name>=<path-to-file>
```

जहाँ `<my-key-name>` वह key है जिसे आप ConfigMap में उपयोग करना चाहते हैं और `<path-to-file>`
वह data source फ़ाइल का स्थान है जिसे वह key represent करेगी।

उदाहरण के लिए:

```shell
kubectl create configmap game-config-3 --from-file=game-special-key=configure-pod-container/configmap/game.properties
```

यह निम्न ConfigMap बनाएगा:
```
kubectl get configmaps game-config-3 -o yaml
```

जहाँ आउटपुट कुछ इस तरह होगा:
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2022-02-18T18:54:22Z
  name: game-config-3
  namespace: default
  resourceVersion: "530"
  uid: 05f8da22-d671-11e5-8cd0-68f728db1985
data:
  game-special-key: |
    enemies=aliens
    lives=3
    enemies.cheat=true
    enemies.cheat.level=noGoodRotten
    secret.code.passphrase=UUDDLRLRBABAS
    secret.code.allowed=true
    secret.code.lives=30
```

#### literal values से ConfigMap बनाएं

आप `kubectl create configmap` के साथ `--from-literal` argument का उपयोग करके
command line से literal value परिभाषित कर सकते हैं:

```shell
kubectl create configmap special-config --from-literal=special.how=very --from-literal=special.type=charm
```

आप कई key-value pairs दे सकते हैं। command line पर दिया गया हर pair ConfigMap के
`data` सेक्शन में अलग entry के रूप में दिखता है।

```shell
kubectl get configmaps special-config -o yaml
```

आउटपुट कुछ इस तरह होगा:
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2022-02-18T19:14:38Z
  name: special-config
  namespace: default
  resourceVersion: "651"
  uid: dadce046-d673-11e5-8cd0-68f728db1985
data:
  special.how: very
  special.type: charm
```

### generator से ConfigMap बनाएं

आप generators से भी ConfigMap बना सकते हैं और फिर उसे apply करके cluster के API server
में object बना सकते हैं।
आपको generators को किसी डायरेक्टरी के भीतर `kustomization.yaml` फ़ाइल में define करना चाहिए।

#### फ़ाइलों से ConfigMap generate करें

उदाहरण के लिए, फ़ाइल `configure-pod-container/configmap/game.properties` से ConfigMap generate करने के लिए:

```shell
# Create a kustomization.yaml file with ConfigMapGenerator
cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: game-config-4
  options:
    labels:
      game-config: config-4
  files:
  - configure-pod-container/configmap/game.properties
EOF
```

ConfigMap object बनाने के लिए kustomization डायरेक्टरी apply करें:

```shell
kubectl apply -k .
```
```
configmap/game-config-4-m9dm2f92bt created
```

आप यह इस तरह जांच सकते हैं कि ConfigMap बना है:

```shell
kubectl get configmap
```
```
NAME                       DATA   AGE
game-config-4-m9dm2f92bt   1      37s
```

और यह भी:

```shell
kubectl describe configmaps/game-config-4-m9dm2f92bt
```
```
Name:         game-config-4-m9dm2f92bt
Namespace:    default
Labels:       game-config=config-4
Annotations:  kubectl.kubernetes.io/last-applied-configuration:
                {"apiVersion":"v1","data":{"game.properties":"enemies=aliens\nlives=3\nenemies.cheat=true\nenemies.cheat.level=noGoodRotten\nsecret.code.p...

Data
====
game.properties:
----
enemies=aliens
lives=3
enemies.cheat=true
enemies.cheat.level=noGoodRotten
secret.code.passphrase=UUDDLRLRBABAS
secret.code.allowed=true
secret.code.lives=30
Events:  <none>
```

ध्यान दें कि generated ConfigMap नाम के अंत में content का hash जोड़कर एक suffix लगाया जाता है।
इससे यह सुनिश्चित होता है कि content बदलने पर हर बार नया ConfigMap generate हो।

#### फ़ाइल से ConfigMap generate करते समय उपयोग होने वाली key परिभाषित करें

आप ConfigMap generator में फ़ाइल नाम के बजाय दूसरी key परिभाषित कर सकते हैं।
उदाहरण के लिए, `configure-pod-container/configmap/game.properties` से `game-special-key`
key के साथ ConfigMap generate करने के लिए:

```shell
# Create a kustomization.yaml file with ConfigMapGenerator
cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: game-config-5
  options:
    labels:
      game-config: config-5
  files:
  - game-special-key=configure-pod-container/configmap/game.properties
EOF
```

ConfigMap object बनाने के लिए kustomization डायरेक्टरी apply करें।
```shell
kubectl apply -k .
```
```
configmap/game-config-5-m67dt67794 created
```

#### literals से ConfigMap generate करें

यह उदाहरण दिखाता है कि Kustomize और kubectl का उपयोग करके दो literal key/value pairs
`special.type=charm` और `special.how=very` से `ConfigMap` कैसे बनाया जाए।
इसके लिए आप `ConfigMap` generator specify कर सकते हैं। `kustomization.yaml` बनाएं (या replace करें),
ताकि उसका content नीचे जैसा हो:

```yaml
---
# kustomization.yaml contents for creating a ConfigMap from literals
configMapGenerator:
- name: special-config-2
  literals:
  - special.how=very
  - special.type=charm
```

ConfigMap object बनाने के लिए kustomization डायरेक्टरी apply करें:
```shell
kubectl apply -k .
```
```
configmap/special-config-2-c92b5mmcf2 created
```

## अंतरिम सफ़ाई

आगे बढ़ने से पहले, बनाए गए कुछ ConfigMaps को साफ़ करें:

```bash
kubectl delete configmap special-config
kubectl delete configmap env-config
kubectl delete configmap -l 'game-config in (config-4,config-5)'
```

अब आपने ConfigMap परिभाषित करना सीख लिया है, तो आप अगले सेक्शन में जाकर
सीख सकते हैं कि Pods के साथ इन ऑब्जेक्ट्स का उपयोग कैसे करें।

---

## ConfigMap डेटा का उपयोग करके कंटेनर environment variables परिभाषित करें

### एक single ConfigMap के डेटा से कंटेनर environment variable परिभाषित करें

1. ConfigMap में key-value pair के रूप में एक environment variable परिभाषित करें:

   ```shell
   kubectl create configmap special-config --from-literal=special.how=very
   ```

2. ConfigMap में परिभाषित `special.how` मान को Pod specification में `SPECIAL_LEVEL_KEY`
   environment variable को असाइन करें।

   {{% code_sample file="pods/pod-single-configmap-env-variable.yaml" %}}

   Pod बनाएं:

   ```shell
   kubectl create -f https://kubernetes.io/examples/pods/pod-single-configmap-env-variable.yaml
   ```

   अब Pod के आउटपुट में environment variable `SPECIAL_LEVEL_KEY=very` शामिल होगा।

### कई ConfigMaps के डेटा से कंटेनर environment variables परिभाषित करें

पिछले उदाहरण की तरह पहले ConfigMaps बनाएं।
यहाँ वह manifest है जिसका आप उपयोग करेंगे:

{{% code_sample file="configmap/configmaps.yaml" %}}

* ConfigMap बनाएं:

  ```shell
  kubectl create -f https://kubernetes.io/examples/configmap/configmaps.yaml
  ```

* Pod specification में environment variables परिभाषित करें।

  {{% code_sample file="pods/pod-multiple-configmap-env-variable.yaml" %}}

  Pod बनाएं:

  ```shell
  kubectl create -f https://kubernetes.io/examples/pods/pod-multiple-configmap-env-variable.yaml
  ```

  अब Pod के आउटपुट में environment variables `SPECIAL_LEVEL_KEY=very` और `LOG_LEVEL=INFO` शामिल होंगे।

  आगे बढ़ने के बाद, वह Pod और ConfigMap हटा दें:
  ```shell
  kubectl delete pod dapi-test-pod --now
  kubectl delete configmap special-config
  kubectl delete configmap env-config
  ```

## ConfigMap में मौजूद सभी key-value pairs को कंटेनर environment variables के रूप में कॉन्फ़िगर करें

* कई key-value pairs वाला एक ConfigMap बनाएं।

  {{% code_sample file="configmap/configmap-multikeys.yaml" %}}

  ConfigMap बनाएं:

  ```shell
  kubectl create -f https://kubernetes.io/examples/configmap/configmap-multikeys.yaml
  ```

* `envFrom` का उपयोग करके ConfigMap के सभी डेटा को कंटेनर environment variables के रूप में परिभाषित करें।
  ConfigMap की key, Pod में environment variable नाम बन जाती है।

  {{% code_sample file="pods/pod-configmap-envFrom.yaml" %}}

  Pod बनाएं:

  ```shell
  kubectl create -f https://kubernetes.io/examples/pods/pod-configmap-envFrom.yaml
  ```
  अब Pod के आउटपुट में environment variables `SPECIAL_LEVEL=very` और
  `SPECIAL_TYPE=charm` शामिल होंगे।

  आगे बढ़ने के बाद, वह Pod हटा दें:
  ```shell
  kubectl delete pod dapi-test-pod --now
  ```

## Pod commands में ConfigMap-परिभाषित environment variables का उपयोग करें

आप कंटेनर के `command` और `args` में ConfigMap-परिभाषित environment variables का उपयोग
Kubernetes substitution syntax `$(VAR_NAME)` के साथ कर सकते हैं।

उदाहरण के लिए, नीचे दिया गया Pod manifest:

{{% code_sample file="pods/pod-configmap-env-var-valueFrom.yaml" %}}

उस Pod को चलाकर बनाएं:

```shell
kubectl create -f https://kubernetes.io/examples/pods/pod-configmap-env-var-valueFrom.yaml
```

वह Pod `test-container` कंटेनर से नीचे दिया गया आउटपुट देता है:
```shell
kubectl logs dapi-test-pod
```

```
very charm
```

आगे बढ़ने के बाद, वह Pod हटा दें:
```shell
kubectl delete pod dapi-test-pod --now
```

## ConfigMap डेटा को Volume में जोड़ें

[फ़ाइलों से ConfigMap बनाएं](#create-configmaps-from-files) में बताए अनुसार, जब आप
`--from-file` का उपयोग करके ConfigMap बनाते हैं, तो filename, ConfigMap के `data` सेक्शन में
store होने वाली key बन जाता है। फ़ाइल का content उस key की value बनता है।

इस सेक्शन के उदाहरण `special-config` नाम के ConfigMap को refer करते हैं:

{{% code_sample file="configmap/configmap-multikeys.yaml" %}}

ConfigMap बनाएं:

```shell
kubectl create -f https://kubernetes.io/examples/configmap/configmap-multikeys.yaml
```

### ConfigMap में stored डेटा से Volume populate करें

Pod specification के `volumes` सेक्शन में ConfigMap का नाम जोड़ें।
इससे ConfigMap डेटा `volumeMounts.mountPath` द्वारा बताए गए डायरेक्टरी में जुड़ता है (इस
उदाहरण में `/etc/config`)। `command` सेक्शन डायरेक्टरी की उन फ़ाइलों को सूचीबद्ध करता है
जिनके नाम ConfigMap की keys से मेल खाते हैं।

{{% code_sample file="pods/pod-configmap-volume.yaml" %}}

Pod बनाएं:

```shell
kubectl create -f https://kubernetes.io/examples/pods/pod-configmap-volume.yaml
```

जब Pod चलता है, तो `ls /etc/config/` कमांड नीचे जैसा आउटपुट देता है:

```
SPECIAL_LEVEL
SPECIAL_TYPE
```

Text data को UTF-8 character encoding के साथ फ़ाइलों के रूप में expose किया जाता है।
अगर आप कोई दूसरी character encoding उपयोग करना चाहते हैं, तो `binaryData` उपयोग करें
(अधिक जानकारी के लिए [ConfigMap object](/docs/concepts/configuration/configmap/#configmap-object) देखें)।

{{< note >}}
अगर उस container image की `/etc/config` डायरेक्टरी में कोई फ़ाइलें मौजूद हैं, तो volume
mount image की उन फ़ाइलों को inaccessible बना देगा।
{{< /note >}}

आगे बढ़ने के बाद, वह Pod हटा दें:
```shell
kubectl delete pod dapi-test-pod --now
```

### Volume में ConfigMap डेटा को किसी specific path पर जोड़ें

specific ConfigMap items के लिए इच्छित फ़ाइल पथ बताने हेतु `path` फ़ील्ड उपयोग करें।
इस केस में `SPECIAL_LEVEL` item, `config-volume` volume में `/etc/config/keys` पर mount होगा।

{{% code_sample file="pods/pod-configmap-volume-specific-key.yaml" %}}

Pod बनाएं:

```shell
kubectl create -f https://kubernetes.io/examples/pods/pod-configmap-volume-specific-key.yaml
```

जब Pod चलता है, तो `cat /etc/config/keys` कमांड नीचे जैसा आउटपुट देता है:

```
very
```

{{< caution >}}
पहले की तरह, `/etc/config/` डायरेक्टरी में मौजूद सभी पहले की फ़ाइलें हट जाएँगी।
{{< /caution >}}

वह Pod हटा दें:
```shell
kubectl delete pod dapi-test-pod --now
```

### keys को specific paths और file permissions पर project करें

आप keys को specific paths पर project कर सकते हैं। syntax के लिए [Secrets](/docs/tasks/inject-data-application/distribute-credentials-secure/#project-secret-keys-to-specific-file-paths) गाइड के संबंधित सेक्शन को देखें।  
आप keys के लिए POSIX permissions सेट कर सकते हैं। syntax के लिए [Secrets](/docs/tasks/inject-data-application/distribute-credentials-secure/#set-posix-permissions-for-secret-keys) गाइड के संबंधित सेक्शन को देखें।

### वैकल्पिक संदर्भ

ConfigMap reference को _optional_ के रूप में चिह्नित किया जा सकता है। अगर ConfigMap मौजूद नहीं है,
तो mounted volume खाली होगा। अगर ConfigMap मौजूद है लेकिन referenced key मौजूद नहीं है, तो
mount point के नीचे वह path मौजूद नहीं होगा। अधिक जानकारी के लिए [Optional ConfigMaps](#optional-configmaps) देखें।

### Mounted ConfigMaps अपने-आप अपडेट होते हैं

जब mounted ConfigMap अपडेट होता है, तो projected content भी eventually अपडेट हो जाता है।
यह उस केस में भी लागू होता है जहाँ optional रूप से referenced ConfigMap, pod शुरू होने के बाद अस्तित्व में आता है।

Kubelet हर periodic sync पर जांचता है कि mounted ConfigMap fresh है या नहीं। हालांकि,
current value लाने के लिए यह अपना local TTL-based cache इस्तेमाल करता है। परिणामस्वरूप,
ConfigMap अपडेट होने के समय से लेकर pod में नई keys project होने तक कुल देरी अधिकतम
kubelet sync period (डिफ़ॉल्ट 1 मिनट) + kubelet में ConfigMaps cache का TTL (डिफ़ॉल्ट 1 मिनट)
जितनी हो सकती है। आप pod की किसी annotation को अपडेट करके तुरंत refresh ट्रिगर कर सकते हैं।

{{< note >}}
[subPath](/docs/concepts/storage/volumes/#using-subpath) volume के रूप में ConfigMap का उपयोग करने वाला कंटेनर,
ConfigMap updates प्राप्त नहीं करेगा।
{{< /note >}}

<!-- discussion -->

## ConfigMaps और Pods को समझना

ConfigMap API resource, configuration data को key-value pairs के रूप में store करता है। इस डेटा को
pods में उपयोग किया जा सकता है या controllers जैसे system components के configurations देने के लिए।
ConfigMap, [Secrets](/docs/concepts/configuration/secret/) जैसा है, लेकिन यह ऐसे strings के साथ काम करने का तरीका देता है
जिनमें संवेदनशील जानकारी नहीं होती। उपयोगकर्ता और system components, दोनों ConfigMap में configuration data store कर सकते हैं।

{{< note >}}
ConfigMaps को properties files को replace नहीं, बल्कि refer करना चाहिए। ConfigMap को Linux की
`/etc` डायरेक्टरी और उसके content जैसी किसी चीज़ का प्रतिनिधित्व करने वाला समझें। उदाहरण के लिए,
अगर आप ConfigMap से [Kubernetes Volume](/docs/concepts/storage/volumes/) बनाते हैं, तो ConfigMap का
हर data item volume में एक अलग फ़ाइल के रूप में दर्शाया जाता है।
{{< /note >}}

ConfigMap के `data` फ़ील्ड में configuration data होता है। नीचे दिए उदाहरण की तरह, यह साधारण भी हो सकता है
(जैसे `--from-literal` से परिभाषित individual properties) या जटिल भी
(जैसे `--from-file` से परिभाषित configuration files या JSON blobs)।

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2016-02-18T19:14:38Z
  name: example-config
  namespace: default
data:
  # example of a simple property defined using --from-literal
  example.property.1: hello
  example.property.2: world
  # example of a complex property defined using --from-file
  example.property.file: |-
    property.1=value-1
    property.2=value-2
    property.3=value-3
```

जब `kubectl` ऐसे inputs से ConfigMap बनाता है जो ASCII या UTF-8 नहीं होते, तो टूल
उन्हें ConfigMap के `binaryData` फ़ील्ड में रखता है, `data` में नहीं। text और binary
दोनों data sources को एक ConfigMap में मिलाया जा सकता है।

अगर आप ConfigMap में `binaryData` keys (और उनकी values) देखना चाहते हैं, तो आप
`kubectl get configmap -o jsonpath='{.binaryData}' <name>` चला सकते हैं।

Pods, `data` या `binaryData` में से किसी का उपयोग करने वाले ConfigMap से डेटा लोड कर सकते हैं।

## वैकल्पिक ConfigMaps

आप Pod specification में ConfigMap reference को _optional_ के रूप में चिह्नित कर सकते हैं।
अगर ConfigMap मौजूद नहीं है, तो Pod में वह configuration जिसके लिए ConfigMap डेटा देता
है (उदाहरण: environment variable, mounted volume) खाली रहेगा।
अगर ConfigMap मौजूद है, लेकिन referenced key मौजूद नहीं है, तो डेटा भी खाली रहेगा।

उदाहरण के लिए, नीचे दिया Pod specification ConfigMap से environment variable को optional चिह्नित करता है:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: dapi-test-pod
spec:
  containers:
    - name: test-container
      image: gcr.io/google_containers/busybox
      command: ["/bin/sh", "-c", "env"]
      env:
        - name: SPECIAL_LEVEL_KEY
          valueFrom:
            configMapKeyRef:
              name: a-config
              key: akey
              optional: true # mark the variable as optional
  restartPolicy: Never
```

अगर आप यह pod चलाते हैं और `a-config` नाम का ConfigMap मौजूद नहीं है, तो आउटपुट खाली होगा।
अगर आप यह pod चलाते हैं और `a-config` नाम का ConfigMap मौजूद है लेकिन उसमें `akey` नाम की key नहीं है,
तो आउटपुट फिर भी खाली होगा। अगर आप `a-config` ConfigMap में `akey` के लिए value सेट करते हैं,
तो यह pod वह value प्रिंट करके terminate हो जाता है।

आप ConfigMap द्वारा प्रदान किए गए volumes और files को भी optional चिह्नित कर सकते हैं। Kubernetes,
भले ही referenced ConfigMap या key मौजूद न हो, volume के mount paths हमेशा बनाता है। उदाहरण के लिए,
नीचे दिया Pod specification ConfigMap को refer करने वाले volume को optional चिह्नित करता है:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: dapi-test-pod
spec:
  containers:
    - name: test-container
      image: gcr.io/google_containers/busybox
      command: ["/bin/sh", "-c", "ls /etc/config"]
      volumeMounts:
      - name: config-volume
        mountPath: /etc/config
  volumes:
    - name: config-volume
      configMap:
        name: no-config
        optional: true # mark the source ConfigMap as optional
  restartPolicy: Never
```



## प्रतिबंध

- Pod specification में reference करने से पहले आपको `ConfigMap` object बनाना होगा।
  वैकल्पिक रूप से, Pod spec में ConfigMap reference को `optional` चिह्नित करें (देखें
  [Optional ConfigMaps](#optional-configmaps))। अगर आप ऐसे ConfigMap को reference करते हैं जो मौजूद नहीं है
  और reference को `optional` नहीं चिह्नित करते, तो Pod शुरू नहीं होगा। इसी तरह ConfigMap में
  मौजूद न रहने वाली keys के references भी Pod को शुरू होने से रोकेंगे, जब तक कि आप key references
  को `optional` चिह्नित न करें।

- अगर आप ConfigMaps से environment variables परिभाषित करने के लिए `envFrom` उपयोग करते हैं, तो
  invalid मानी जाने वाली keys skip कर दी जाती हैं। pod शुरू हो जाएगा, लेकिन invalid names event log
  (`InvalidVariableNames`) में रिकॉर्ड किए जाएंगे। log message हर skipped key की सूची देता है।
  उदाहरण के लिए:

  ```shell
  kubectl get events
  ```

  आउटपुट कुछ इस तरह होगा:
  ```
  LASTSEEN FIRSTSEEN COUNT NAME          KIND  SUBOBJECT  TYPE      REASON                            SOURCE                MESSAGE
  0s       0s        1     dapi-test-pod Pod              Warning   InvalidEnvironmentVariableNames   {kubelet, 127.0.0.1}  Keys [1badkey, 2alsobad] from the EnvFrom configMap default/myconfig were skipped since they are considered invalid environment variable names.
  ```

- ConfigMaps किसी विशेष {{< glossary_tooltip term_id="namespace" >}} में रहते हैं।
  Pods केवल उसी namespace के ConfigMaps को refer कर सकते हैं जिसमें वह Pod मौजूद है।

- आप ConfigMaps का उपयोग
  {{< glossary_tooltip text="static pods" term_id="static-pod" >}} के लिए नहीं कर सकते, क्योंकि
  kubelet इसका समर्थन नहीं करता।

## {{% heading "cleanup" %}}

आपके बनाए हुए ConfigMaps और Pods हटाएं:

```bash
kubectl delete configmaps/game-config configmaps/game-config-2 configmaps/game-config-3 \
               configmaps/game-config-env-file
kubectl delete pod dapi-test-pod --now

# You might already have removed the next set
kubectl delete configmaps/special-config configmaps/env-config
kubectl delete configmap -l 'game-config in (config-4,config-5)'
```

ConfigMap generate करने के लिए उपयोग की गई `kustomization.yaml` फ़ाइल हटाएं:

```bash
rm kustomization.yaml
```

अगर आपने `configure-pod-container` नाम की डायरेक्टरी बनाई थी और अब उसकी ज़रूरत नहीं है, तो उसे भी हटाएँ
या उसे trash / deleted files location में ले जाएँ।

```bash
rm -r configure-pod-container
```

## {{% heading "whatsnext" %}}

* इसका वास्तविक उदाहरण देखें:
  [Configuring Redis using a ConfigMap](/docs/tutorials/configuration/configure-redis-using-configmap/)।
* एक और उदाहरण देखें:
  [Updating configuration via a ConfigMap](/docs/tutorials/configuration/updating-configuration-via-a-configmap/)।
