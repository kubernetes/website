---
title: क्रॉनजॉब के साथ स्वचालित कार्य चलाना
min-kubernetes-server-version: v1.21
reviewers:
- chenopis
content_type: task
weight: 10
---

<!-- overview -->

यह पेज दिखाता है कि कैसे Kubernetes {{< glossary_tooltip text="CronJob" term_id="cronjob" >}} ऑब्जेक्ट का उपयोग करके स्वचालित कार्य चलाए जाते हैं।

## {{% heading "prerequisites" %}}

* {{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## क्रॉनजॉब बनाना {#creating-a-cron-job}

क्रॉन जॉब्स को एक कॉन्फ़िग फ़ाइल की आवश्यकता होती है।
यहाँ एक क्रॉनजॉब के लिए मैनिफेस्ट है जो हर मिनट एक साधारण डेमो कार्य चलाता है:

{{% code_sample file="application/job/cronjob.yaml" %}}

इस कमांड का उपयोग करके उदाहरण क्रॉनजॉब चलाएं:

```shell
kubectl create -f https://k8s.io/examples/application/job/cronjob.yaml
```
आउटपुट इस तरह का होगा:

```
cronjob.batch/hello created
```

क्रॉनजॉब बनाने के बाद, इस कमांड का उपयोग करके इसकी स्थिति प्राप्त करें:

```shell
kubectl get cronjob hello
```

आउटपुट इस तरह का होगा:

```
NAME    SCHEDULE      SUSPEND   ACTIVE   LAST SCHEDULE   AGE
hello   */1 * * * *   False     0        <none>          10s
```

जैसा कि आप कमांड के परिणामों से देख सकते हैं, क्रॉन जॉब ने अभी तक कोई जॉब शेड्यूल या चलाया नहीं है।
लगभग एक मिनट में जॉब के बनने के लिए {{< glossary_tooltip text="देखें" term_id="watch" >}}:

```shell
kubectl get jobs --watch
```
आउटपुट इस तरह का होगा:

```
NAME               COMPLETIONS   DURATION   AGE
hello-4111706356   0/1                      0s
hello-4111706356   0/1           0s         0s
hello-4111706356   1/1           5s         5s
```

अब आपने "hello" क्रॉन जॉब द्वारा शेड्यूल किया गया एक चलता हुआ जॉब देखा है।
आप जॉब को देखना बंद कर सकते हैं और क्रॉन जॉब को फिर से देख सकते हैं यह देखने के लिए कि इसने जॉब को शेड्यूल किया:

```shell
kubectl get cronjob hello
```

आउटपुट इस तरह का होगा:

```
NAME    SCHEDULE      SUSPEND   ACTIVE   LAST SCHEDULE   AGE
hello   */1 * * * *   False     0        50s             75s
```

आपको दिखाई देगा कि क्रॉन जॉब `hello` ने `LAST SCHEDULE` में निर्दिष्ट समय पर सफलतापूर्वक एक जॉब शेड्यूल किया। वर्तमान में 0 सक्रिय जॉब हैं, जिसका अर्थ है कि जॉब पूरा हो गया है या विफल हो गया है।

अब, पिछले शेड्यूल किए गए जॉब द्वारा बनाए गए पॉड्स को ढूंढें और एक पॉड का स्टैंडर्ड आउटपुट देखें।

{{< note >}}
जॉब का नाम पॉड के नाम से अलग है।
{{< /note >}}

```shell
# "hello-4111706356" को अपने सिस्टम में जॉब नाम से बदलें
pods=$(kubectl get pods --selector=job-name=hello-4111706356 --output=jsonpath={.items[*].metadata.name})
```
पॉड लॉग दिखाएं:

```shell
kubectl logs $pods
```
आउटपुट इस तरह का होगा:

```
Fri Feb 22 11:02:09 UTC 2019
Hello from the Kubernetes cluster
```

## क्रॉनजॉब हटाना {#deleting-a-cron-job}

जब आपको क्रॉन जॉब की और आवश्यकता नहीं होती है, तो इसे `kubectl delete cronjob <cronjob name>` के साथ हटा दें:

```shell
kubectl delete cronjob hello
```

क्रॉन जॉब को हटाने से इसके द्वारा बनाए गए सभी जॉब और पॉड हट जाते हैं और यह अतिरिक्त जॉब बनाना बंद कर देता है।
आप [गारबेज कलेक्शन](/docs/concepts/architecture/garbage-collection/) में जॉब हटाने के बारे में और पढ़ सकते हैं। 