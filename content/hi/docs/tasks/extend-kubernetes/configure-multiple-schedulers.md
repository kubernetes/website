---
title: एकाधिक स्केड्यूलर्स कॉन्फ़िगर करें
content_type: task
weight: 20
---

<!-- overview -->

कुबेरनेट्स एक डिफ़ॉल्ट स्केड्यूलर के साथ आता है जिसका वर्णन [यहाँ](/docs/reference/command-line-tools-reference/kube-scheduler/) किया गया है।
यदि डिफ़ॉल्ट स्केड्यूलर आपकी आवश्यकताओं के अनुरूप नहीं है, तो आप अपना खुद का स्केड्यूलर लागू कर सकते हैं।
इसके अलावा, आप डिफ़ॉल्ट स्केड्यूलर के साथ-साथ एकाधिक स्केड्यूलर्स को एक साथ चला सकते हैं और कुबेरनेट्स को निर्देश दे सकते हैं कि आपके प्रत्येक पॉड के लिए किस स्केड्यूलर का उपयोग करना है।
आइए एक उदाहरण के साथ कुबेरनेट्स में एकाधिक स्केड्यूलर्स चलाना सीखें।

स्केड्यूलर को कैसे लागू किया जाए, इसका विस्तृत विवरण इस दस्तावेज़ के दायरे से बाहर है।
एक विहित उदाहरण के लिए, कुबेरनेट्स स्रोत निर्देशिका में [pkg/scheduler](https://github.com/kubernetes/kubernetes/tree/master/pkg/scheduler) में kube-scheduler कार्यान्वयन देखें।

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## स्केड्यूलर को पैकेज करें

अपने स्केड्यूलर बाइनरी को कंटेनर इमेज में पैकेज करें। इस उदाहरण के उद्देश्यों के लिए, आप डिफ़ॉल्ट स्केड्यूलर (kube-scheduler) को अपने दूसरे स्केड्यूलर के रूप में उपयोग कर सकते हैं।
[GitHub से कुबेरनेट्स स्रोत कोड](https://github.com/kubernetes/kubernetes) को क्लोन करें और स्रोत बनाएं।

```shell
git clone https://github.com/kubernetes/kubernetes.git
cd kubernetes
make
```

kube-scheduler बाइनरी वाला कंटेनर इमेज बनाएं। इमेज बनाने के लिए यहाँ `Dockerfile` है:

```docker
FROM busybox
ADD ./_output/local/bin/linux/amd64/kube-scheduler /usr/local/bin/kube-scheduler
```

फ़ाइल को `Dockerfile` के रूप में सहेजें, इमेज बनाएं और रजिस्ट्री में पुश करें। यह उदाहरण इमेज को [Google Container Registry (GCR)](https://cloud.google.com/container-registry/) में पुश करता है।
अधिक विवरण के लिए, कृपया GCR [दस्तावेज़ीकरण](https://cloud.google.com/container-registry/docs/) पढ़ें। वैकल्पिक रूप से आप [Docker Hub](https://hub.docker.com/search?q=) का भी उपयोग कर सकते हैं। अधिक विवरण के लिए Docker Hub [दस्तावेज़ीकरण](https://docs.docker.com/docker-hub/repos/create/#create-a-repository) देखें।

```shell
docker build -t gcr.io/my-gcp-project/my-kube-scheduler:1.0 .     # इमेज नाम और रिपॉजिटरी
gcloud docker -- push gcr.io/my-gcp-project/my-kube-scheduler:1.0 # यहाँ उपयोग किया गया सिर्फ एक उदाहरण है
```

## स्केड्यूलर के लिए कुबेरनेट्स डिप्लॉयमेंट परिभाषित करें

अब जब आपके पास कंटेनर इमेज में आपका स्केड्यूलर है, इसके लिए पॉड कॉन्फ़िगरेशन बनाएं और इसे अपने कुबेरनेट्स क्लस्टर में चलाएं। लेकिन इस उदाहरण में क्लस्टर में सीधे पॉड बनाने के बजाय, आप [Deployment](/docs/concepts/workloads/controllers/deployment/) का उपयोग कर सकते हैं। [Deployment](/docs/concepts/workloads/controllers/deployment/) एक [Replica Set](/docs/concepts/workloads/controllers/replicaset/) को प्रबंधित करता है जो बदले में पॉड्स को प्रबंधित करता है, जिससे स्केड्यूलर विफलताओं के प्रति लचीला बन जाता है। यहाँ डिप्लॉयमेंट कॉन्फ़िग है। इसे `my-scheduler.yaml` के रूप में सहेजें:

{{% code_sample file="admin/sched/my-scheduler.yaml" %}}

उपरोक्त मैनिफेस्ट में, आप अपने स्केड्यूलर कार्यान्वयन के व्यवहार को अनुकूलित करने के लिए [KubeSchedulerConfiguration](/docs/reference/scheduling/config/) का उपयोग करते हैं। यह कॉन्फ़िगरेशन `--config` विकल्प के साथ प्रारंभीकरण के दौरान `kube-scheduler` को पारित किया गया है। `my-scheduler-config` ConfigMap कॉन्फ़िगरेशन फ़ाइल को संग्रहीत करता है। `my-scheduler` डिप्लॉयमेंट का पॉड `my-scheduler-config` ConfigMap को वॉल्यूम के रूप में माउंट करता है।

उपरोक्त स्केड्यूलर कॉन्फ़िगरेशन में, आपका स्केड्यूलर कार्यान्वयन [KubeSchedulerProfile](/docs/reference/config-api/kube-scheduler-config.v1/#kubescheduler-config-k8s-io-v1-KubeSchedulerProfile) के माध्यम से दर्शाया गया है।
{{< note >}}
यह निर्धारित करने के लिए कि क्या कोई स्केड्यूलर किसी विशिष्ट पॉड को शेड्यूल करने के लिए जिम्मेदार है, पॉडटेम्पलेट या पॉड मैनिफेस्ट में `spec.schedulerName` फ़ील्ड को `KubeSchedulerProfile` के `schedulerName` फ़ील्ड से मेल खाना चाहिए।
क्लस्टर में चलने वाले सभी स्केड्यूलर्स के नाम अद्वितीय होने चाहिए।
{{< /note >}}

इसके अलावा, ध्यान दें कि आप एक समर्पित सर्विस अकाउंट `my-scheduler` बनाते हैं और इसे `system:kube-scheduler` क्लस्टर भूमिका से बाइंड करते हैं ताकि इसे `kube-scheduler` के समान विशेषाधिकार प्राप्त हों।

अन्य कमांड लाइन तर्कों का विस्तृत विवरण [kube-scheduler दस्तावेज़ीकरण](/docs/reference/command-line-tools-reference/kube-scheduler/) और अन्य अनुकूलन योग्य `kube-scheduler` कॉन्फ़िगरेशन का विस्तृत विवरण [स्केड्यूलर कॉन्फ़िगरेशन संदर्भ](/docs/reference/config-api/kube-scheduler-config.v1/) में देखें।

## क्लस्टर में दूसरा स्केड्यूलर चलाएं

अपने स्केड्यूलर को कुबेरनेट्स क्लस्टर में चलाने के लिए, ऊपर निर्दिष्ट डिप्लॉयमेंट को कुबेरनेट्स क्लस्टर में बनाएं:

```shell
kubectl create -f my-scheduler.yaml
```

सत्यापित करें कि स्केड्यूलर पॉड चल रहा है:

```shell
kubectl get pods --namespace=kube-system
```

```
NAME                                           READY     STATUS    RESTARTS    AGE
....
my-scheduler-lnf4s-4744f                       1/1       Running   0          2m
...
```

आपको इस सूची में डिफ़ॉल्ट kube-scheduler पॉड के अलावा "Running" my-scheduler पॉड दिखना चाहिए।

### लीडर इलेक्शन सक्षम करें

लीडर इलेक्शन सक्षम करके एकाधिक स्केड्यूलर चलाने के लिए, आपको निम्नलिखित करना होगा:

अपनी YAML फ़ाइल में `my-scheduler-config` ConfigMap में KubeSchedulerConfiguration के निम्नलिखित फ़ील्ड अपडेट करें:

* `leaderElection.leaderElect` को `true` पर सेट करें
* `leaderElection.resourceNamespace` को `<lock-object-namespace>` पर सेट करें
* `leaderElection.resourceName` को `<lock-object-name>` पर सेट करें

{{< note >}}
कंट्रोल प्लेन आपके लिए लॉक ऑब्जेक्ट बनाता है, लेकिन नेमस्पेस पहले से मौजूद होना चाहिए।
आप `kube-system` नेमस्पेस का उपयोग कर सकते हैं।
{{< /note >}}

यदि आपके क्लस्टर पर RBAC सक्षम है, तो आपको `system:kube-scheduler` क्लस्टर भूमिका अपडेट करनी होगी।
`endpoints` और `leases` संसाधनों के लिए लागू नियम के resourceNames में अपना स्केड्यूलर नाम जोड़ें, जैसा कि निम्न उदाहरण में है:

```shell
kubectl edit clusterrole system:kube-scheduler
```

{{% code_sample file="admin/sched/clusterrole.yaml" %}}

## पॉड्स के लिए स्केड्यूलर्स निर्दिष्ट करें

अब जब आपका दूसरा स्केड्यूलर चल रहा है, कुछ पॉड्स बनाएं और उन्हें डिफ़ॉल्ट स्केड्यूलर या आपके द्वारा डिप्लॉय किए गए स्केड्यूलर द्वारा शेड्यूल करने के लिए निर्देशित करें।
किसी दिए गए पॉड को किसी विशिष्ट स्केड्यूलर का उपयोग करके शेड्यूल करने के लिए, उस पॉड स्पेक में स्केड्यूलर का नाम निर्दिष्ट करें। तीन उदाहरण देखते हैं।

- बिना किसी स्केड्यूलर नाम के पॉड स्पेक

  {{% code_sample file="admin/sched/pod1.yaml" %}}

  जब कोई स्केड्यूलर नाम निर्दिष्ट नहीं किया जाता है, तो पॉड स्वचालित रूप से default-scheduler का उपयोग करके शेड्यूल किया जाता है।

  इस फ़ाइल को `pod1.yaml` के रूप में सहेजें और इसे कुबेरनेट्स क्लस्टर में सबमिट करें।

  ```shell
  kubectl create -f pod1.yaml
  ```

- `default-scheduler` के साथ पॉड स्पेक

  {{% code_sample file="admin/sched/pod2.yaml" %}}

  स्केड्यूलर `spec.schedulerName` के मान के रूप में स्केड्यूलर नाम देकर निर्दिष्ट किया जाता है। इस मामले में, हम डिफ़ॉल्ट स्केड्यूलर का नाम देते हैं जो `default-scheduler` है।

  इस फ़ाइल को `pod2.yaml` के रूप में सहेजें और इसे कुबेरनेट्स क्लस्टर में सबमिट करें।

  ```shell
  kubectl create -f pod2.yaml
  ```

- `my-scheduler` के साथ पॉड स्पेक

  {{% code_sample file="admin/sched/pod3.yaml" %}}

  इस मामले में, हम निर्दिष्ट करते हैं कि यह पॉड हमारे द्वारा डिप्लॉय किए गए स्केड्यूलर - `my-scheduler` का उपयोग करके शेड्यूल किया जाना चाहिए। ध्यान दें कि `spec.schedulerName` का मान `KubeSchedulerProfile` के `schedulerName` फ़ील्ड में दिए गए नाम से मेल खाना चाहिए।

  इस फ़ाइल को `pod3.yaml` के रूप में सहेजें और इसे क्लस्टर में सबमिट करें।

  ```shell
  kubectl create -f pod3.yaml
  ```

  सत्यापित करें कि तीनों पॉड्स चल रहे हैं।

  ```shell
  kubectl get pods
  ```

<!-- discussion -->

### सत्यापित करना कि पॉड्स वांछित स्केड्यूलर्स द्वारा शेड्यूल किए गए थे

इन उदाहरणों के माध्यम से काम करना आसान बनाने के लिए, हमने यह सत्यापित नहीं किया कि पॉड्स वास्तव में वांछित स्केड्यूलर्स द्वारा शेड्यूल किए गए थे। हम उपरोक्त पॉड और डिप्लॉयमेंट कॉन्फ़िग सबमिशन के क्रम को बदलकर इसे सत्यापित कर सकते हैं। यदि हम स्केड्यूलर डिप्लॉयमेंट कॉन्फ़िग सबमिट करने से पहले सभी पॉड कॉन्फ़िग्स को कुबेरनेट्स क्लस्टर में सबमिट करते हैं, तो हम देखते हैं कि `annotation-second-scheduler` पॉड हमेशा के लिए "Pending" स्थिति में रहता है जबकि अन्य दो पॉड्स शेड्यूल हो जाते हैं। एक बार जब हम स्केड्यूलर डिप्लॉयमेंट कॉन्फ़िग सबमिट करते हैं और हमारा नया स्केड्यूलर चलना शुरू करता है, तो `annotation-second-scheduler` पॉड भी शेड्यूल हो जाता है।

वैकल्पिक रूप से, आप यह सत्यापित करने के लिए कि पॉड्स वांछित स्केड्यूलर्स द्वारा शेड्यूल किए गए थे, इवेंट लॉग में "Scheduled" प्रविष्टियों को देख सकते हैं।

```shell
kubectl get events
```

आप क्लस्टर के मुख्य स्केड्यूलर के लिए संबंधित कंट्रोल प्लेन नोड्स पर इसके स्टैटिक पॉड मैनिफेस्ट को संशोधित करके [कस्टम स्केड्यूलर कॉन्फ़िगरेशन](/docs/reference/scheduling/config/#multiple-profiles) या कस्टम कंटेनर इमेज का उपयोग भी कर सकते हैं।
