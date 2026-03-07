---
title: पॉड फेलियर पॉलिसी
content_type: task
min-kubernetes-server-version: v1.25
weight: 60
---

<!-- overview -->

पॉड फेलियर पॉलिसी आपको निम्नलिखित में मदद कर सकती है:

* कम्प्यूटेशनल संसाधनों का बेहतर उपयोग करके अनावश्यक पॉड रिट्राइज से बचें।
* पॉड डिसरप्शन (जैसे प्रीम्प्शन, API-इनिशिएटेड एविक्शन या टेंट-बेस्ड एविक्शन) के कारण जॉब फेलियर से बचें।

## {{% heading "prerequisites" %}}

आपको पहले से ही [Job](/docs/concepts/workloads/controllers/job/) के बुनियादी उपयोग से परिचित होना चाहिए।

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

आपके Kubernetes सर्वर का वर्जन v1.25 या उससे बाद का होना चाहिए।

वर्जन जांचने के लिए, `kubectl version` दर्ज करें।

## अनावश्यक पॉड रिट्राइज से बचने के लिए पॉड फेलियर पॉलिसी का उपयोग करना

निम्नलिखित उदाहरण के साथ, आप सीख सकते हैं कि कैसे पॉड फेलियर पॉलिसी का उपयोग करके अनावश्यक पॉड रीस्टार्ट से बचा जा सकता है जब एक पॉड फेलियर एक नॉन-रेट्रायबल सॉफ्टवेयर बग का संकेत देता है।

सबसे पहले, कॉन्फ़िग के आधार पर एक जॉब बनाएं:

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: job-pod-failure-policy-failjob
spec:
  completions: 8
  parallelism: 2
  template:
    spec:
      restartPolicy: Never
      containers:
      - name: main
        image: docker.io/library/bash:5
        command: ["bash"]
        args:
        - -c
        - echo "Hello world! I'm going to exit with 42 to simulate a software bug." && sleep 30 && exit 42
  backoffLimit: 6
  podFailurePolicy:
    rules:
    - action: FailJob
      onExitCodes:
        containerName: main
        operator: In
        values: [42]
```

इसे चलाकर:

```shell
kubectl create -f job-pod-failure-policy-failjob.yaml
```

लगभग 30 सेकंड के बाद पूरा जॉब टर्मिनेट हो जाना चाहिए। जॉब की स्थिति की जांच करने के लिए चलाएं:

```shell
kubectl get jobs -l job-name=job-pod-failure-policy-failjob -o yaml
```

जॉब स्थिति में, निम्नलिखित कंडीशन्स दिखाई देते हैं:

* `FailureTarget` कंडीशन: `reason` फील्ड `PodFailurePolicy` पर सेट है और `message` फील्ड में टर्मिनेशन के बारे में अधिक जानकारी है, जैसे `Container main for pod default/job-pod-failure-policy-failjob-8ckj8 failed with exit code 42 matching FailJob rule at index 0`। जॉब कंट्रोलर जॉब को फेलियर मानते ही इस कंडीशन को जोड़ता है। विवरण के लिए, [टर्मिनेशन ऑफ जॉब पॉड्स](/docs/concepts/workloads/controllers/job/#termination-of-job-pods) देखें।
* `Failed` कंडीशन: `FailureTarget` कंडीशन के समान `reason` और `message`। जॉब कंट्रोलर जॉब के सभी पॉड्स टर्मिनेट होने के बाद इस कंडीशन को जोड़ता है।

तुलना के लिए, यदि पॉड फेलियर पॉलिसी डिसेबल होती, तो पॉड के 6 रिट्राइज लगते, जिसमें कम से कम 2 मिनट लगते।

### सफाई

आपके द्वारा बनाए गए जॉब को हटाएं:

```shell
kubectl delete jobs/job-pod-failure-policy-failjob
```

क्लस्टर स्वचालित रूप से पॉड्स को साफ कर देगा।

## पॉड डिसरप्शन को अनदेखा करने के लिए पॉड फेलियर पॉलिसी का उपयोग करना

निम्नलिखित उदाहरण के साथ, आप सीख सकते हैं कि कैसे पॉड फेलियर पॉलिसी का उपयोग करके पॉड डिसरप्शन को अनदेखा किया जा सकता है जो `.spec.backoffLimit` लिमिट की ओर पॉड रिट्राइ काउंटर को बढ़ाने से रोकता है।

#### सावधानी:

इस उदाहरण के लिए टाइमिंग महत्वपूर्ण है, इसलिए आप निष्पादन से पहले चरणों को पढ़ना चाह सकते हैं। पॉड डिसरप्शन को ट्रिगर करने के लिए, जबकि पॉड उस पर चल रहा हो (पॉड के शेड्यूल होने के 90 सेकंड के भीतर) नोड को ड्रेन करना महत्वपूर्ण है।

1. कॉन्फ़िग के आधार पर एक जॉब बनाएं:
```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: job-pod-failure-policy-ignore
spec:
  completions: 4
  parallelism: 2
  template:
    spec:
      restartPolicy: Never
      containers:
      - name: main
        image: docker.io/library/bash:5
        command: ["bash"]
        args:
        - -c
        - echo "Hello world! I'm going to exit with 0 (success)." && sleep 90 && exit 0
  backoffLimit: 0
  podFailurePolicy:
    rules:
    - action: Ignore
      onPodConditions:
      - type: DisruptionTarget
```
इसे चलाकर:
```shell
kubectl create -f job-pod-failure-policy-ignore.yaml
```

2. पॉड के शेड्यूल किए गए `nodeName` की जांच करने के लिए यह कमांड चलाएं:
```shell
nodeName=$(kubectl get pods -l job-name=job-pod-failure-policy-ignore -o jsonpath='{.items[0].spec.nodeName}')
```

3. पॉड के पूरा होने से पहले नोड को ड्रेन करें (90 सेकंड के भीतर):
```shell
kubectl drain nodes/$nodeName --ignore-daemonsets --grace-period=0
```

4. जॉब के लिए काउंटर न बढ़ने की जांच करने के लिए `.status.failed` की जांच करें:
```shell
kubectl get jobs -l job-name=job-pod-failure-policy-ignore -o yaml
```

5. नोड को अनकॉर्डन करें:
```shell
kubectl uncordon nodes/$nodeName
```

जॉब रिज्यूम होता है और सफल होता है।

तुलना के लिए, यदि पॉड फेलियर पॉलिसी डिसेबल होती, तो पॉड डिसरप्शन पूरे जॉब को टर्मिनेट कर देता (क्योंकि `.spec.backoffLimit` 0 पर सेट है)।

### सफाई

आपके द्वारा बनाए गए जॉब को हटाएं:

```shell
kubectl delete jobs/job-pod-failure-policy-ignore
```

क्लस्टर स्वचालित रूप से पॉड्स को साफ कर देगा।

## कस्टम पॉड कंडीशन्स के आधार पर अनावश्यक पॉड रिट्राइज से बचने के लिए पॉड फेलियर पॉलिसी का उपयोग करना

निम्नलिखित उदाहरण के साथ, आप सीख सकते हैं कि कैसे पॉड फेलियर पॉलिसी का उपयोग करके कस्टम पॉड कंडीशन्स के आधार पर अनावश्यक पॉड रीस्टार्ट से बचा जा सकता है।

#### नोट:

नीचे दिया गया उदाहरण वर्जन 1.27 से काम करता है क्योंकि यह `Pending` फेज में डिलीट किए गए पॉड्स के टर्मिनल फेज में ट्रांजिशन पर निर्भर करता है (देखें: [पॉड फेज](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase))।

1. सबसे पहले, कॉन्फ़िग के आधार पर एक जॉब बनाएं:
```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: job-pod-failure-policy-config-issue
spec:
  completions: 8
  parallelism: 2
  template:
    spec:
      restartPolicy: Never
      containers:
      - name: main
        image: "non-existing-repo/non-existing-image:example"
  backoffLimit: 6
  podFailurePolicy:
    rules:
    - action: FailJob
      onPodConditions:
      - type: ConfigIssue
```
इसे चलाकर:
```shell
kubectl create -f job-pod-failure-policy-config-issue.yaml
```
ध्यान दें कि, इमेज मिसकॉन्फ़िगर्ड है, क्योंकि यह मौजूद नहीं है।

2. जॉब के पॉड्स की स्थिति की जांच करने के लिए चलाएं:
```shell
kubectl get pods -l job-name=job-pod-failure-policy-config-issue -o yaml
```
आप इसके समान आउटपुट देखेंगे:
```yaml
containerStatuses:
- image: non-existing-repo/non-existing-image:example
   ...
   state:
   waiting:
      message: Back-off pulling image "non-existing-repo/non-existing-image:example"
      reason: ImagePullBackOff
      ...
phase: Pending
```
ध्यान दें कि पॉड `Pending` फेज में रहता है क्योंकि यह मिसकॉन्फ़िगर्ड इमेज को पुल करने में विफल रहता है। सिद्धांत रूप में, यह एक ट्रांजिएंट इश्यू हो सकता है और इमेज पुल की जा सकती है। हालांकि, इस मामले में, इमेज मौजूद नहीं है इसलिए हम इस तथ्य को एक कस्टम कंडीशन द्वारा इंगित करते हैं।

3. कस्टम कंडीशन जोड़ें। पहले पैच तैयार करें:
```shell
cat <<EOF > patch.yaml
status:
  conditions:
  - type: ConfigIssue
    status: "True"
    reason: "NonExistingImage"
    lastTransitionTime: "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
EOF
```
दूसरा, जॉब द्वारा बनाए गए पॉड्स में से एक का चयन करें:
```shell
podName=$(kubectl get pods -l job-name=job-pod-failure-policy-config-issue -o jsonpath='{.items[0].metadata.name}')
```
फिर, निम्न कमांड चलाकर एक पॉड पर पैच लागू करें:
```shell
kubectl patch pod $podName --subresource=status --patch-file=patch.yaml
```
यदि सफलतापूर्वक लागू किया गया, तो आपको इसके समान एक नोटिफिकेशन मिलेगा:
```shell
pod/job-pod-failure-policy-config-issue-k6pvp patched
```

4. पॉड को `Failed` फेज में ट्रांजिशन करने के लिए इसे डिलीट करें:
```shell
kubectl delete pods/$podName
```

5. जॉब की स्थिति की जांच करने के लिए चलाएं:
```shell
kubectl get jobs -l job-name=job-pod-failure-policy-config-issue -o yaml
```
जॉब स्थिति में, `reason` फील्ड `PodFailurePolicy` के बराबर वाली जॉब `Failed` कंडीशन देखें। इसके अतिरिक्त, `message` फील्ड में जॉब टर्मिनेशन के बारे में अधिक विस्तृत जानकारी होती है, जैसे: `Pod default/job-pod-failure-policy-config-issue-k6pvp has condition ConfigIssue matching FailJob rule at index 0`।

#### नोट:

प्रोडक्शन एनवायरनमेंट में, चरण 3 और 4 को यूजर-प्रोवाइडेड कंट्रोलर द्वारा ऑटोमेट किया जाना चाहिए।

### सफाई

आपके द्वारा बनाए गए जॉब को हटाएं:

```shell
kubectl delete jobs/job-pod-failure-policy-config-issue
```

क्लस्टर स्वचालित रूप से पॉड्स को साफ कर देगा।

## वैकल्पिक

आप केवल [पॉड बैकऑफ फेलियर पॉलिसी](/docs/concepts/workloads/controllers/job/#pod-backoff-failure-policy) पर भरोसा कर सकते हैं, जॉब के `.spec.backoffLimit` फील्ड को निर्दिष्ट करके। हालांकि, कई स्थितियों में `.spec.backoffLimit` के लिए एक कम वैल्यू सेट करके अनावश्यक पॉड रिट्राइज से बचने और फिर भी यह सुनिश्चित करने के लिए कि जॉब पॉड डिसरप्शन द्वारा टर्मिनेट नहीं होगा, के बीच संतुलन खोजना समस्याग्रस्त हो सकता है।

## {{% heading "whatsnext" %}}

* [जॉब्स](/docs/concepts/workloads/controllers/job/) के बारे में और जानें
* [पॉड फेलियर पॉलिसी](/docs/concepts/workloads/controllers/job/#pod-failure-policy) के बारे में और जानें
* [पॉड्स](/docs/concepts/workloads/pods/) के बारे में और जानें
* [सेवाएं](/docs/concepts/services-networking/service/) के बारे में और जानें 