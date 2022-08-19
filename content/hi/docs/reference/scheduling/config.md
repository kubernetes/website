---
title: सचेंडूलर कॉन्फ़िगरेशन
content_type: अवधारणा
weight: 20
---

{{< feature-state for_k8s_version="v1.19" state="beta" >}}

आप `kube-scheduler` के व्यवहार को एक कॉन्फ़िगरेशन फ़ाइल लिखकर और उसके पथ को कमांड लाइन आर्गुमेंटक के रूप में पारित करके अनुकूलित कर सकते हैं।

<!-- overview -->

<!-- body -->

शेड्यूलिंग प्रोफ़ाइल आपको शेड्यूलिंग के विभिन्न चरणों को कॉन्फ़िगर करने की अनुमति देता है
{{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}} में।
प्रत्येक चरण एक विस्तार बिंदु में उजागर होता है। प्लगइन्स शेड्यूलिंग व्यवहार प्रदान करते हैं
इनमें से एक या अधिक विस्तार बिंदु को लागू करके।

आप `kube-scheduler --config <filename>` चलाकर शेड्यूलिंग प्रोफाइल निर्दिष्ट कर सकते हैं,
का उपयोग
KubeSchedulerConfiguration ([v1beta2](/docs/reference/config-api/kube-scheduler-config.v1beta2/)
या [v1beta3](/docs/reference/config-api/kube-scheduler-config.v1beta3/))
संरचना।

एक न्यूनतम कॉन्फ़िगरेशन इस प्रकार दिखता है:

```yaml
apiVersion: kubescheduler.config.k8s.io/v1beta2
kind: KubeSchedulerConfiguration
clientConnection:
  kubeconfig: /etc/srv/kubernetes/kube-scheduler/kubeconfig
```

## प्रोफाइल

शेड्यूलिंग प्रोफ़ाइल आपको शेड्यूलिंग के विभिन्न चरणों को कॉन्फ़िगर करने की अनुमति देता है
{{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}} में।
प्रत्येक चरण एक [विस्तार बिंदु](#विस्तार-बिंदु) में उजागर होता है।
[प्लगइन्स](#शेड्यूलिंग-प्लगइन्स) एक या इनमें से अधिक विस्तार बिंदु को लागू करके शेड्यूलिंग
व्यवहार प्रदान करते हैं।

आप [एकाधिक प्रोफाइल](#एकाधिक-प्रोफाइल) चलाने के लिए `kube-scheduler` के एकल उदाहरण
को कॉन्फ़िगर कर सकते हैं।

### विस्तार बिंदु

शेड्यूलिंग चरणों की एक श्रृंखला में होता है जो निम्नलिखित विस्तार बिंदु के माध्यम
से सामने आते हैं:

1. `queueSort`: ये प्लगइन्स एक ऑर्डरिंग फ़ंक्शन प्रदान करते हैं जिसका उपयोग किया जाता है
   शेड्यूलिंग कतार में लंबित पॉड्स को सॉर्ट करने के लिए। एक बार में बिल्कुल एक कतार सॉर्ट प्लगइन
   सक्षम किया जा सकता है।
2. `preFilter`: इन प्लगइन्स का उपयोग पूर्व-प्रक्रिया या जानकारी की जांच करने के लिए किया जाता है
   छानने से पहले एक पॉड या क्लस्टर के बारे में। वे एक पॉड को अनिर्धारित रूप में चिह्नित
   कर सकते हैं।
3. `filter`: ये प्लगइन्स शेड्यूलिंग पॉलिसी में प्रेडिकेट्स के बराबर हैं और उन नोड्स को फ़िल्टर करने के लिए उपयोग किए जाते हैं जो पॉड नहीं चला सकते। फ़िल्टर को कॉन्फ़िगर किए गए क्रम में कहा जाता है। यदि कोई नोड सभी फ़िल्टर पास नहीं करता है, तो एक पॉड को शेड्यूल करने योग्य नहीं के रूप में चिह्नित किया जाता है।
4. `postFilter`: इन प्लगइन्स को उनके कॉन्फ़िगर किए गए क्रम में कहा जाता है जब पॉड के लिए कोई व्यवहार्य नोड नहीं मिला। यदि कोई `postFilter` प्लगइन पॉड
   को _schedulable_ चिह्नित करता है, शेष प्लगइन्स को नहीं कहा जाता है।
5. `preScore`: यह एक सूचनात्मक विस्तार बिंदु है जिसका उपयोग किया जा सकता है
   प्री-स्कोरिंग कार्य करने के लिए।
6. `score`: ये प्लगइन्स प्रत्येक नोड को एक अंक प्रदान करते हैं जो पास कर चुका है
   छानने का चरण। सचेंडूलर तब उच्चतम भारित स्कोर योग के साथ नोड का चयन करेगा।
7. `reserve`: यह एक सूचनात्मक विस्तार बिंदु है जो किसी दिए गए पॉड के लिए संसाधनों को आरक्षित किए जाने पर प्लगइन्स को सूचित करता है। प्लगइन्स एक `Unreserve` कॉल भी लागू करते हैं जिसे `Reserve` के दौरान या बाद में विफलता के मामले में बुलाया जाता है।
8. `permit`: ये प्लगइन्स पॉड के बंधन को रोक सकते हैं या देरी कर सकते हैं।
9. `preBind`: ये प्लगइन्स पॉड के बाध्य होने से पहले आवश्यक कोई भी कार्य करते हैं।
10. `bind`: प्लगइन्स एक पॉड को एक नोड से बाइंड करते हैं। `बाइंड` प्लगइन्स को क्रम में बुलाया जाता है और एक बार बाइंडिंग करने के बाद, शेष प्लगइन्स को छोड़ दिया जाता है। कम से कम एक बाइंड प्लगइन आवश्यक है।
11. `postBind`: यह एक सूचनात्मक विस्तार बिंदु है जिसे पॉड के बाउंड होने के बाद कहा जाता है।
12. `multiPoint`: यह एक कॉन्फिग-ओनली फ़ील्ड है जो प्लगइन्स को उनके सभी लागू विस्तार बिंदु के लिए एक साथ सक्षम या अक्षम करने की अनुमति देता है।

प्रत्येक विस्तार बिंदु के लिए, आप विशिष्ट [डिफ़ॉल्ट प्लगइन्स](#शेड्यूलिंग-प्लगइन्स) को खुद से अक्षम या सक्षम कर सकते हैं। उदाहरण के लिए:

```yaml
apiVersion: kubescheduler.config.k8s.io/v1beta2
kind: KubeSchedulerConfiguration
profiles:
  - plugins:
      score:
        disabled:
          - name: PodTopologySpread
        enabled:
          - name: MyCustomPluginA
            weight: 2
          - name: MyCustomPluginB
            weight: 1
```

आप सभी डिफ़ॉल्ट प्लगइन्स को अक्षम करने के लिए अक्षम सरणी में नाम के रूप में `*` का उपयोग कर सकते हैं
उस विस्तार बिंदु के लिए। इसका उपयोग प्लगइन्स ऑर्डर को पुनर्व्यवस्थित करने के लिए भी किया जा सकता है, यदि
इच्छित।

### शेड्यूलिंग प्लगइन्स

निम्नलिखित प्लगइन्स, डिफ़ॉल्ट रूप से सक्षम, इनमें से एक या अधिक विस्तार बिंदु को लागू करते हैं:

- `ImageLocality`: उन नोड्स का समर्थन करता है जिनके पास पहले से ही कंटेनरां इमेजेज हैं जो पॉड चालाते हैं।
  विस्तार बिंदु: `score`.
- `TaintToleration`: लागू करता है
  [कलंक और सहनशीलता](/docs/concepts/scheduling-eviction/taint-and-toleration/)।
  विस्तार बिंदु लागू करता है: `filter`, `preScore`, `score`.
- `NodeName`: जाँचता है कि क्या पॉड स्पेक नोड नाम वर्तमान नोड से मेल खाता है।
  विस्तार बिंदु: `filter`.
- `NodePorts`: जाँचता है कि नोड में अनुरोधित पॉड पोर्ट के लिए मुफ़्त पोर्ट हैं या नहीं।
  विस्तार बिंदु: `preFilter`, `filter`.
- `NodeAffinity`: लागू करता है
  [नोड चयनकर्ता](/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector)
  तथा [नोड आत्मीयता](/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity)।
  विस्तार बिंदु: `filter`, `score`.
- `PodTopologySpread`: लागू करता है
  [पॉड टोपोलॉजी स्प्रेड](/docs/concepts/scheduling-eviction/topology-spread-constraints/)।
  विस्तार बिंदु: `preFilter`, `filter`, `preScore`, `score`.
- `NodeUnschedulable`: उन नोड्स को फ़िल्टर करता है जिनमें `.spec.unschedulable` को यथार्थ चरण किया गया है।
  विस्तार बिंदु: `filter`.
- `NodeResourcesFit`: जाँचता है कि क्या नोड में वे सभी संसाधन हैं जो पॉड अनुरोध कर रहा है। स्कोर तीन रणनीतियों में से एक का उपयोग कर सकता है: `LeastAllocated`
  (डिफ़ॉल्ट), `MostAllocated` और `RequestedToCapacityRatio`।
  विस्तार बिंदु: `preFilter`, `filter`, `score`.
- `NodeResourcesBalancedAllocation`: नोड्स को अधिक संतुलित संसाधन उपयोग प्राप्त होगा यदि पॉड को वहां शेड्यूल किया गया है तो।
  विस्तार बिंदु: `score`.
- `VolumeBinding`: जाँचता है कि क्या नोड में है या यदि यह अनुरोधित को बाँध सकता है
  {{< glossary_tooltip text="volumes" term_id="volume" >}}.
  विस्तार बिंदु: `preFilter`, `filter`, `reserve`, `preBind`, `score`.
  {{< note >}}
  `VolumeCapacityPriority` सुविधा सक्षम होने पर `score` विस्तार बिंदु सक्षम होता है। यह सबसे छोटे पीवी को प्राथमिकता देता है जो अनुरोधित वॉल्यूम आकार में फिट हो सकते हैं।
  {{< /note >}}
- `VolumeRestrictions`: जाँचता है कि नोड में माउंट किए गए वॉल्यूम, वॉल्यूम प्रदाता के लिए विशिष्ट प्रतिबंधों को पूरा करते हैं।
  विस्तार बिंदु: `filter`.
- `VolumeZone`: जाँचता है कि अनुरोधित मात्राएँ किसी भी क्षेत्र की आवश्यकताओं को पूरा करती हैं जो उनके पास हो सकती हैं।
  विस्तार बिंदु: `filter`.
- `NodeVolumeLimits`: जाँचता है कि नोड के लिए CSI वॉल्यूम सीमा को संतुष्ट किया जा सकता है।
  विस्तार बिंदु: `filter`.
- `EBSLimits`: जाँचता है कि नोड के लिए AWS EBS वॉल्यूम सीमा को संतुष्ट किया जा सकता है।
  विस्तार बिंदु: `filter`.
- `GCEPDLimits`: जाँच करता है कि नोड के लिए GCP-PD वॉल्यूम सीमा को संतुष्ट किया जा सकता है।
  विस्तार बिंदु: `filter`.
- `AzureDiskLimits`: जाँचता है कि नोड के लिए Azure डिस्क वॉल्यूम सीमा को संतुष्ट किया जा सकता है।
  विस्तार बिंदु: `filter`.
- `InterPodAffinity`: लागू करता है
  [इंटर-पॉड आत्मीयता और विरोधी आत्मीयता](/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)।
  विस्तार बिंदु: `preFilter`, `filter`, `preScore`, `score`.
- `PrioritySort`: डिफ़ॉल्ट प्राथमिकता आधारित छँटाई प्रदान करता है।
  विस्तार बिंदु: `queueSort`.
- `DefaultBinder`: डिफ़ॉल्ट बाध्यकारी तंत्र प्रदान करता है।
  विस्तार बिंदु: `bind`.
- `DefaultPreemption`: डिफ़ॉल्ट छूट तंत्र प्रदान करता है।
  विस्तार बिंदु: `postFilter`.

आप घटक कॉन्फ़िगरेशन API के माध्यम से निम्न प्लगइन्स को भी सक्षम कर सकते हैं,
जो डिफ़ॉल्ट रूप से सक्षम नहीं हैं:

- `SelectorSpread`: पॉड्स के लिए नोड्स में फैले हुए पक्ष जो संबंधित हैं
  {{< glossary_tooltip text="Services" term_id="service" >}},
  {{< glossary_tooltip text="ReplicaSets" term_id="replica-set" >}} तथा
  {{< glossary_tooltip text="StatefulSets" term_id="statefulset" >}}.
  विस्तार बिंदु: `preScore`, `score`.
- `CinderLimits`: जाँचता है कि [ओपनस्टैक सिंडर](https://docs.openstack.org/cinder/) नोड के लिए वॉल्यूम सीमा को संतुष्ट किया जा सकता है।
  विस्तार बिंदु: `filter`.

### एकाधिक प्रोफाइल

आप एक से अधिक प्रोफ़ाइल चलाने के लिए `kube-scheduler` को कॉन्फ़िगर कर सकते हैं।
प्रत्येक प्रोफ़ाइल में एक संबद्ध शेड्यूलर नाम होता है और इसका एक अलग कॉन्फ़िगर किए गए प्लगइन्स सेट हो सकता है
इसके [विस्तार बिंदु](#विस्तार-बिंदु) में।

निम्नलिखित नमूना कॉन्फ़िगरेशन के साथ, सचेंडूलर दो प्रोफाइल के साथ चलेगा:
एक डिफ़ॉल्ट प्लगइन्स के साथ और एक सभी अक्षम स्कोरिंग प्लगइन्स के साथ।

```yaml
apiVersion: kubescheduler.config.k8s.io/v1beta2
kind: KubeSchedulerConfiguration
profiles:
  - schedulerName: default-scheduler
  - schedulerName: no-scoring-scheduler
    plugins:
      preScore:
        disabled:
          - name: "*"
      score:
        disabled:
          - name: "*"
```

पॉड्स जो एक विशिष्ट प्रोफ़ाइल के अनुसार शेड्यूल करना चाहते हैं, उनमें संबंधित सचेंडूलर नाम शामिल हो सकते हैं
इसके `.spec.schedulerName` में।

डिफ़ॉल्ट रूप से, शेड्यूलर नाम `default-scheduler` के साथ एक प्रोफ़ाइल बनाई जाते है।
इस प्रोफ़ाइल में ऊपर वर्णित डिफ़ॉल्ट प्लगइन्स शामिल हैं। एक से अधिक प्रोफ़ाइल घोषित करते समय, उनमें से प्रत्येक के लिए एक अद्वितीय शेड्यूलर नाम की आवश्यकता होती है।

यदि कोई पॉड शेड्यूलर नाम निर्दिष्ट नहीं करता है, तो kube-apiserver इसे सेट करेगा
'default-scheduler'। इसलिए, इस सचेंडूलर नाम के साथ एक प्रोफ़ाइल मौजूद होना चाहिए
उन पॉड्स को शेड्यूल करने के लिए।

{{< note >}}
पॉड के शेड्यूलिंग इवेंट में ReportingController के रूप में `.spec.schedulerName` होता है।
नेता चुनाव के लिए कार्यक्रम सूची में पहले प्रोफ़ाइल के सचेंडूलर नाम का उपयोग करते हैं।
{{< /note >}}

{{< note >}}
सभी प्रोफ़ाइलों को `queueSort` विस्तार बिंदु में एक ही प्लगइन का उपयोग करना चाहिए और होना चाहिए
समान कॉन्फ़िगरेशन पैरामीटर (यदि लागू हो)। ऐसा इसलिए है क्योंकि सचेंडूलर का
केवल एक ही लंबित पॉड queue है।
{{< /note >}}

### एकाधिक विस्तार बिंदुओं पर लागू होने वाले प्लगइन्स {#multipoint}

`kubescheduler.config.k8s.io/v1beta3` से शुरू होकर, प्रोफ़ाइल कॉन्फिग में एक अतिरिक्त फ़ील्ड है, `multiPoint`, जो एक प्लगइन को आसानी से सक्षम या अक्षम करने की अनुमति देता है कई विस्तार बिंदुओं पर। `multipoint` कॉन्फिग का इरादा कस्टम प्रोफाइल का उपयोग करते समय उपयोगकर्ताओं और प्रशासकों के लिए आवश्यक कॉन्फ़िगरेशन को सरल बनाना है।

एक प्लगइन पर विचार करें, `MyPlugin`, जो `preScore`, `score`, `preFilter`, को लागू करता है,
और `filter` विस्तार बिंदु। `MyPlugin` को सक्षम करने के लिए इसके सभी उपलब्ध विस्तार बिंदु के लिए, प्रोफ़ाइल कॉन्फिग इस तरह दिखता है:

```yaml
apiVersion: kubescheduler.config.k8s.io/v1beta3
kind: KubeSchedulerConfiguration
profiles:
  - schedulerName: multipoint-scheduler
    plugins:
      multiPoint:
        enabled:
          - name: MyPlugin
```

यह अपने सभी विस्तार बिंदु के लिए `MyPlugin` को मैन्युअल रूप से सक्षम करने के समान होगा
अंक, जैसे:

```yaml
apiVersion: kubescheduler.config.k8s.io/v1beta3
kind: KubeSchedulerConfiguration
profiles:
  - schedulerName: non-multipoint-scheduler
    plugins:
      preScore:
        enabled:
          - name: MyPlugin
      score:
        enabled:
          - name: MyPlugin
      preFilter:
        enabled:
          - name: MyPlugin
      filter:
        enabled:
          - name: MyPlugin
```

यहां `multiPoint` का उपयोग करने का एक लाभ यह है कि यदि `MyPlugin` दूसरे विस्तार बिंदु को लागू करता है
भविष्य में , `multiPoint` कॉन्फ़िगरेशन स्वचालित रूप से इसे सक्षम करेगा
नए विस्तार के लिए।

विशिष्ट विस्तार बिंदुओं को `multiPoint` विस्तार से बाहर रखा जा सकता है उस विस्तार बिंदु के `disabled` फ़ील्ड का उपयोग करके। यह डिफ़ॉल्ट प्लगइन्स, गैर-डिफ़ॉल्ट प्लगइन्स, या वाइल्डकार्ड (`'*'`) के साथ सभी प्लगइन्स को अक्षम करने के साथ काम करता है। इसका एक उदाहरण, `Score` और `PreScore` को अक्षम करना, यह होगा:

```yaml
apiVersion: kubescheduler.config.k8s.io/v1beta3
kind: KubeSchedulerConfiguration
profiles:
  - schedulerName: non-multipoint-scheduler
    plugins:
      multiPoint:
        enabled:
          - name: "MyPlugin"
      preScore:
        disabled:
          - name: "*"
      score:
        disabled:
          - name: "*"
```

`v1beta3` में, सभी [डिफ़ॉल्ट प्लगइन्स](#शेड्यूलिंग-प्लगइन्स) `MultiPoint` के माध्यम से आंतरिक रूप से सक्षम हैं।
हालांकि, डिफ़ॉल्ट मानों का (जैसे ordering और Score weights) लचीलेपन पुनर्विन्यास की अनुमति देने के लिए अलग-अलग विस्तार बिंदु अभी भी उपलब्ध हैं।
उदाहरण के लिए, दो स्कोर प्लगइन्स `DefaultScore1` और `DefaultScore2` पर विचार करें, प्रत्येक में
`1` का वजन। उन्हें अलग-अलग वज़न के साथ फिर से व्यवस्थित किया जा सकता है जैसे:

```yaml
apiVersion: kubescheduler.config.k8s.io/v1beta3
kind: KubeSchedulerConfiguration
profiles:
  - schedulerName: multipoint-scheduler
    plugins:
      score:
        enabled:
          - name: "DefaultScore2"
            weight: 5
```

इस उदाहरण में, प्लगइन्स को `MultiPoint` में स्पष्ट रूप से निर्दिष्ट करना अनावश्यक है
क्योंकि वे डिफ़ॉल्ट प्लगइन्स हैं। और `Score` में निर्दिष्ट एकमात्र प्लगइन `DefaultScore2` है।
ऐसा इसलिए है क्योंकि विशिष्ट विस्तार बिंदुओं के माध्यम से सेट किए गए प्लगइन्स को हमेशा प्राथमिकता दी जाएगी
`MultiPoint` प्लगइन्स पर। तो, यह स्निपेट अनिवार्य रूप से दो प्लगइन्स को फिर से ऑर्डर करता है
उन दोनों को निर्दिष्ट करने की आवश्यकता के बिना।

`MultiPoint` प्लगइन्स को कॉन्फ़िगर करते समय वरीयता के लिए सामान्य पदानुक्रम इस प्रकार है:

1. विशिष्ट विस्तार बिंदु पहले चलते हैं, और उनकी सेटिंग कहीं और सेट की गई चीज़ों को ओवरराइड करती हैं
2. प्लगइन्स मैन्युअल रूप से `MultiPoint` और उनकी सेटिंग्स के माध्यम से कॉन्फ़िगर किए गए हैं
3. डिफ़ॉल्ट प्लगइन्स और उनकी डिफ़ॉल्ट सेटिंग्स

उपरोक्त पदानुक्रम को प्रदर्शित करने के लिए, निम्न उदाहरण इन प्लगइन्स पर आधारित है:
|प्लगइन|विस्तार बिंदु|
|---|---|
|`DefaultQueueSort`|`QueueSort`|
|`CustomQueueSort`|`QueueSort`|
|`DefaultPlugin1`|`Score`, `Filter`|
|`DefaultPlugin2`|`Score`|
|`CustomPlugin1`|`Score`, `Filter`|
|`CustomPlugin2`|`Score`, `Filter`|

इन प्लगइन्स के लिए एक मान्य नमूना विन्यास होगा:

```yaml
apiVersion: kubescheduler.config.k8s.io/v1beta3
kind: KubeSchedulerConfiguration
profiles:
  - schedulerName: multipoint-scheduler
    plugins:
      multiPoint:
        enabled:
          - name: "CustomQueueSort"
          - name: "CustomPlugin1"
            weight: 3
          - name: "CustomPlugin2"
        disabled:
          - name: "DefaultQueueSort"
      filter:
        disabled:
          - name: "DefaultPlugin1"
      score:
        enabled:
          - name: "DefaultPlugin2"
```

ध्यान दें कि किसी विशिष्ट विस्तार बिंदु में `MultiPoint` प्लगइन को फिर से घोषित करने में कोई त्रुटि नहीं है।
पुनर्घोषणा को अनदेखा किया जाता है (और लॉग किया जाता है), क्योंकि विशिष्ट विस्तार बिंदुओं को प्राथमिकता दी जाती है।

अधिकांश कॉन्फ़िगरेशन को एक स्थान पर रखने के अलावा, यह नमूना कुछ चीजें करता है:

- कस्टम `queueSort` प्लगइन को सक्षम करता है और डिफ़ॉल्ट को अक्षम करता है
- `CustomPlugin1` और `CustomPlugin2` को सक्षम करता है, जो उनके सभी विस्तार बिंदुओं के लिए पहले चलेंगे
- `DefaultPlugin1` को अक्षम करता है, लेकिन केवल `filter` के लिए
- `DefaultPlugin2` को `score` में पहले चलाने के लिए पुन: व्यवस्थित करें (कस्टम प्लग इन से पहले भी)

`v1beta3` से पहले के कॉन्फ़िगरेशन के संस्करणों में, `MultiPoint` के बिना, उपरोक्त स्निपेट इसके बराबर होगा:

```yaml
apiVersion: kubescheduler.config.k8s.io/v1beta2
kind: KubeSchedulerConfiguration
profiles:
  - schedulerName: multipoint-scheduler
    plugins:
      # Disable the default QueueSort plugin
      queueSort:
        enabled:
          - name: "CustomQueueSort"
        disabled:
          - name: "DefaultQueueSort"

      # Enable custom Filter plugins
      filter:
        enabled:
          - name: "CustomPlugin1"
          - name: "CustomPlugin2"
          - name: "DefaultPlugin2"
        disabled:
          - name: "DefaultPlugin1"

      # Enable and reorder custom score plugins
      score:
        enabled:
          - name: "DefaultPlugin2"
            weight: 1
          - name: "DefaultPlugin1"
            weight: 3
```

हालांकि यह एक जटिल उदाहरण है, यह `MultiPoint` कॉन्फिग के लचीलेपन को प्रदर्शित करता है
साथ ही विस्तार बिंदुओं को कॉन्फ़िगर करने के मौजूदा तरीकों के साथ इसका सहज एकीकरण।

## शेड्यूलर कॉन्फ़िगरेशन माइग्रेशन

{{< tabs name="tab_with_md" >}}
{{% tab name="v1beta1 → v1beta2" %}}

- v1beta2 कॉन्फ़िगरेशन संस्करण के साथ, आप `NodeResourcesFit` प्लगइन के लिए एक नए स्कोर एक्सटेंशन का उपयोग कर सकते हैं।
  नया एक्सटेंशन `NodeResourcesLeastAllocated`,`NodeResourcesMostAllocated` और`RequestedToCapacityRatio` प्लगइन्स की कार्यक्षमता को जोड़ती है।
  उदाहरण के लिए, यदि आपने पहले `NodeResourcesMostAllocated` प्लगइन का उपयोग किया है, तो आप
  इसके बजाय `NodeResourcesFit` (डिफ़ॉल्ट रूप से सक्षम) का उपयोग करेंगे और एक `pluginConfig` जोड़ेंगे
  एक `scoreStrategy` के साथ जो इसके समान है:
  ```yaml
  apiVersion: kubescheduler.config.k8s.io/v1beta2
  kind: KubeSchedulerConfiguration
  profiles:
    - pluginConfig:
        - args:
            scoringStrategy:
              resources:
                - name: cpu
                  weight: 1
              type: MostAllocated
          name: NodeResourcesFit
  ```
- सचेंडूलर प्लगइन `NodeLabel` पदावनत है; इसके बजाय, समान व्यवहार प्राप्त करने के लिए [`NodeAffinity`](/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity) प्लगइन (डिफ़ॉल्ट रूप से सक्षम) का उपयोग करें।

- सचेंडूलर प्लगइन `ServiceAffinity` पदावनत है; इसके बजाय, समान व्यवहार प्राप्त करने के लिए [`InterPodAffinity`](/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity) प्लगइन (डिफ़ॉल्ट रूप से सक्षम) का उपयोग करें।

- सचेंडूलर प्लगइन `NodePreferAvoidPods` पदावनत है; इसके बजाय, समान व्यवहार प्राप्त करने के लिए [node taints](/docs/concepts/scheduling-eviction/taint-and-toleration/) का उपयोग करें।

- एक v1beta2 कॉन्फ़िगरेशन फ़ाइल में सक्षम एक प्लगइन उस प्लगइन के लिए डिफ़ॉल्ट कॉन्फ़िगरेशन पर पूर्वता लेता है।

- शेड्यूलर हेल्थज़ और मेट्रिक्स बाइंड एड्रेस के लिए कॉन्फ़िगर किया गया अमान्य `host` या `port` सत्यापन विफलता का कारण होगा।
  {{% /tab %}}

{{% tab name="v1beta2 → v1beta3" %}}

- तीन प्लगइन्स का वजन डिफ़ॉल्ट रूप से बढ़ जाता है:
  - `InterPodAffinity` 1 से 2 तक
  - `NodeAffinity` 1 से 2 तक
  - `TaintToleration` 1 से 3 तक
    {{% /tab %}}
    {{< /tabs >}}

## {{% heading "आगे क्या" %}}

- को पढ़िए [kube-scheduler reference](/docs/reference/command-line-tools-reference/kube-scheduler/)
- के बारे में जानें [scheduling](/docs/concepts/scheduling-eviction/kube-scheduler/)
- को पढ़िए [kube-scheduler configuration (v1beta2)](/docs/reference/config-api/kube-scheduler-config.v1beta2/) संदर्भ
- को पढ़िए [kube-scheduler configuration (v1beta3)](/docs/reference/config-api/kube-scheduler-config.v1beta3/) संदर्भ
