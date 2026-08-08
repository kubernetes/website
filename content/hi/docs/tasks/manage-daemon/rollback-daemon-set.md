---
reviewers:
- janetkuo
title: डेमनसेट पर रोलबैक करें
content_type: task
weight: 20
min-kubernetes-server-version: 1.7
---

<!-- overview -->

यह पृष्ठ दिखाता है कि {{< glossary_tooltip term_id="daemonset" >}} पर रोलबैक कैसे करें।


## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

आपको पहले से पता होना चाहिए कि [डेमनसेट पर रोलिंग अपडेट कैसे करें](/docs/tasks/manage-daemon/update-daemon-set/)।

<!-- steps -->

## डेमनसेट पर रोलबैक करना

### चरण 1: वह डेमनसेट रिवीजन खोजें जिस पर आप रोलबैक करना चाहते हैं

यदि आप केवल अंतिम रिवीजन पर वापस जाना चाहते हैं तो इस चरण को छोड़ सकते हैं।

डेमनसेट के सभी रिवीजन की सूची देखें:

```shell
kubectl rollout history daemonset <daemonset-name>
```

यह डेमनसेट रिवीजन की एक सूची लौटाता है:

```
daemonsets "<daemonset-name>"
REVISION        CHANGE-CAUSE
1               ...
2               ...
...
```

* चेंज-कॉज़ को डेमनसेट एनोटेशन `kubernetes.io/change-cause` से
  बनाते समय उसके रिवीजन में कॉपी किया जाता है। आप चेंज-कॉज़ एनोटेशन में
  निष्पादित कमांड रिकॉर्ड करने के लिए `kubectl` में `--record=true` निर्दिष्ट कर सकते हैं।

किसी विशिष्ट रिवीजन का विवरण देखने के लिए:

```shell
kubectl rollout history daemonset <daemonset-name> --revision=1
```

यह उस रिवीजन का विवरण लौटाता है:

```
daemonsets "<daemonset-name>" with revision #1
Pod Template:
Labels:       foo=bar
Containers:
app:
 Image:        ...
 Port:         ...
 Environment:  ...
 Mounts:       ...
Volumes:      ...
```

### चरण 2: किसी विशिष्ट रिवीजन पर रोलबैक करें

```shell
# --to-revision में चरण 1 से प्राप्त रिवीजन नंबर निर्दिष्ट करें
kubectl rollout undo daemonset <daemonset-name> --to-revision=<revision>
```

सफल होने पर, कमांड यह लौटाता है:

```
daemonset "<daemonset-name>" rolled back
```

{{< note >}}
यदि `--to-revision` फ्लैग निर्दिष्ट नहीं किया गया है, तो kubectl सबसे हालिया रिवीजन चुनता है।
{{< /note >}}

### चरण 3: डेमनसेट रोलबैक की प्रगति देखें

`kubectl rollout undo daemonset` सर्वर को डेमनसेट का रोलबैक शुरू करने के लिए कहता है।
वास्तविक रोलबैक क्लस्टर के अंदर {{< glossary_tooltip term_id="control-plane" text="कंट्रोल प्लेन" >}}
में असंक्रमिक रूप से किया जाता है।

रोलबैक की प्रगति देखने के लिए:

```shell
kubectl rollout status ds/<daemonset-name>
```

जब रोलबैक पूरा हो जाता है, तो आउटपुट इस प्रकार दिखता है:

```
daemonset "<daemonset-name>" successfully rolled out
```


<!-- discussion -->

## डेमनसेट रिवीजन को समझना

पिछले `kubectl rollout history` चरण में, आपको डेमनसेट रिवीजन की एक सूची मिली।
प्रत्येक रिवीजन ControllerRevision नामक एक रिसोर्स में संग्रहीत होता है।

यह देखने के लिए कि प्रत्येक रिवीजन में क्या संग्रहीत है, डेमनसेट रिवीजन के रॉ रिसोर्स खोजें:

```shell
kubectl get controllerrevision -l <daemonset-selector-key>=<daemonset-selector-value>
```

यह ControllerRevisions की एक सूची लौटाता है:

```
NAME                               CONTROLLER                     REVISION   AGE
<daemonset-name>-<revision-hash>   DaemonSet/<daemonset-name>     1          1h
<daemonset-name>-<revision-hash>   DaemonSet/<daemonset-name>     2          1h
```

प्रत्येक ControllerRevision एक डेमनसेट रिवीजन के एनोटेशन और टेम्पलेट संग्रहीत करता है।

`kubectl rollout undo` एक विशिष्ट ControllerRevision लेता है और डेमनसेट टेम्पलेट को
ControllerRevision में संग्रहीत टेम्पलेट से बदल देता है।
`kubectl rollout undo` अन्य कमांड जैसे `kubectl edit` या `kubectl apply` के
माध्यम से डेमनसेट टेम्पलेट को पिछले रिवीजन में अपडेट करने के समकक्ष है।

{{< note >}}
डेमनसेट रिवीजन केवल आगे बढ़ते हैं। अर्थात्, रोलबैक पूरा होने के बाद,
जिस ControllerRevision पर रोलबैक किया गया था, उसका रिवीजन नंबर (`.revision` फ़ील्ड)
आगे बढ़ जाएगा। उदाहरण के लिए, यदि सिस्टम में रिवीजन 1 और 2 हैं, और रिवीजन 2 से
रिवीजन 1 पर रोलबैक किया जाता है, तो `.revision: 1` वाला ControllerRevision
`.revision: 3` बन जाएगा।
{{< /note >}}

## समस्या निवारण

* [डेमनसेट रोलिंग अपडेट की समस्या निवारण](/docs/tasks/manage-daemon/update-daemon-set/#troubleshooting) देखें।