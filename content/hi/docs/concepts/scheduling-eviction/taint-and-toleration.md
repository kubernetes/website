---
reviewers:
- davidopp
- kevin-wangzefeng
- bsalamat
title: टेंट्स और टॉलरेशन
content_type: concept
weight: 50
---


<!-- overview -->
[_नोड एफिनिटी_](/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity)
{{< glossary_tooltip text="पॉड्स" term_id="pod" >}} की एक ऐसी विशेषता है जो उन्हें
{{< glossary_tooltip text="नोड्स" term_id="node" >}} के एक समूह की ओर *आकर्षित* करती है
(प्राथमिकता के रूप में या कठोर आवश्यकता के रूप में)। _टेंट्स_ इसके विपरीत हैं --
वे एक नोड को पॉड्स के एक समूह को अस्वीकार करने की अनुमति देते हैं।

_टॉलरेशन_ पॉड्स पर लागू होती हैं। टॉलरेशन शेड्यूलर को मिलान करने वाले टेंट्स वाले
पॉड्स को शेड्यूल करने की अनुमति देती हैं। टॉलरेशन शेड्यूलिंग की अनुमति देती हैं
लेकिन शेड्यूलिंग की गारंटी नहीं देतीं: शेड्यूलर अपने कार्य के भाग के रूप में
[अन्य मापदंडों का भी मूल्यांकन करता है](/docs/concepts/scheduling-eviction/pod-priority-preemption/)।

टेंट्स और टॉलरेशन मिलकर यह सुनिश्चित करते हैं कि पॉड्स अनुचित नोड्स पर शेड्यूल
न हों। एक या अधिक टेंट्स एक नोड पर लागू किए जाते हैं; यह दर्शाता है कि नोड उन
पॉड्स को स्वीकार नहीं करेगा जो टेंट्स को टॉलरेट नहीं करते।

<!-- body -->

## अवधारणाएं

आप [kubectl taint](/docs/reference/generated/kubectl/kubectl-commands#taint) का उपयोग
करके एक नोड पर टेंट जोड़ सकते हैं। उदाहरण के लिए,

```shell
kubectl taint nodes node1 key1=value1:NoSchedule
```

नोड `node1` पर एक टेंट लगाता है। इस टेंट की key `key1`, value `value1`, और टेंट
effect `NoSchedule` है। इसका अर्थ है कि कोई भी पॉड `node1` पर शेड्यूल नहीं हो
सकेगा जब तक उसके पास मिलान करने वाली टॉलरेशन न हो।

ऊपर दिए गए कमांड से जोड़े गए टेंट को हटाने के लिए, आप यह चला सकते हैं:

```shell
kubectl taint nodes node1 key1=value1:NoSchedule-
```

आप PodSpec में पॉड के लिए टॉलरेशन निर्दिष्ट करते हैं। निम्नलिखित दोनों टॉलरेशन
ऊपर की `kubectl taint` लाइन से बने टेंट से "मिलान" करती हैं, और इसलिए इनमें से
किसी भी टॉलरेशन वाला पॉड `node1` पर शेड्यूल हो सकता है:

```yaml
tolerations:
- key: "key1"
  operator: "Equal"
  value: "value1"
  effect: "NoSchedule"
```

```yaml
tolerations:
- key: "key1"
  operator: "Exists"
  effect: "NoSchedule"
```

डिफ़ॉल्ट Kubernetes शेड्यूलर किसी विशेष पॉड को चलाने के लिए नोड चुनते समय टेंट्स
और टॉलरेशन को ध्यान में रखता है। हालांकि, यदि आप किसी पॉड के लिए `.spec.nodeName`
मैन्युअल रूप से निर्दिष्ट करते हैं, तो वह क्रिया शेड्यूलर को बाईपास कर देती है;
पॉड तब उस नोड पर बाउंड हो जाता है जहाँ आपने उसे असाइन किया था, भले ही उस नोड पर
`NoSchedule` टेंट्स हों। यदि ऐसा होता है और नोड पर `NoExecute` टेंट भी सेट है,
तो kubelet पॉड को बाहर कर देगा जब तक उचित tolerance सेट न हो।

यहाँ एक पॉड का उदाहरण है जिसमें कुछ टॉलरेशन परिभाषित हैं:

{{% code_sample file="pods/pod-with-toleration.yaml" %}}

`operator` का डिफ़ॉल्ट मान `Equal` है।

एक टॉलरेशन एक टेंट से "मिलान" करती है यदि keys समान हों और effects समान हों, और:

* `operator` `Exists` है (इस स्थिति में कोई `value` निर्दिष्ट नहीं होनी चाहिए), या
* `operator` `Equal` है और values समान होनी चाहिए।

{{< note >}}

दो विशेष मामले हैं:

यदि `key` खाली है, तो `operator` `Exists` होना चाहिए, जो सभी keys और values से
मिलान करता है। ध्यान दें कि `effect` को अभी भी एक साथ मिलान करना होगा।

एक खाली `effect` key `key1` के साथ सभी effects से मिलान करता है।

{{< /note >}}

ऊपर दिए गए उदाहरण में `NoSchedule` के `effect` का उपयोग किया गया था। वैकल्पिक
रूप से, आप `PreferNoSchedule` के `effect` का उपयोग कर सकते हैं।

`effect` फ़ील्ड के लिए अनुमत मान हैं:

`NoExecute`
: यह उन पॉड्स को प्रभावित करता है जो नोड पर पहले से चल रहे हैं, इस प्रकार:

  * जो पॉड्स टेंट को टॉलरेट नहीं करते उन्हें तुरंत बाहर कर दिया जाता है
  * जो पॉड्स टेंट को टॉलरेट करते हैं और अपनी टॉलरेशन विनिर्देश में
    `tolerationSeconds` निर्दिष्ट नहीं करते वे हमेशा के लिए बाउंड रहते हैं
  * जो पॉड्स टेंट को निर्दिष्ट `tolerationSeconds` के साथ टॉलरेट करते हैं,
    निर्दिष्ट समय तक बाउंड रहते हैं। उस समय के बाद, नोड lifecycle controller
    पॉड्स को नोड से बाहर कर देता है।

`NoSchedule`
: टेंटेड नोड पर कोई नया पॉड शेड्यूल नहीं होगा जब तक उनके पास मिलान करने वाली
  टॉलरेशन न हो। नोड पर वर्तमान में चल रहे पॉड्स को बाहर **नहीं** किया जाता।

`PreferNoSchedule`
: `PreferNoSchedule`, `NoSchedule` का एक "प्राथमिकता" या "सॉफ्ट" संस्करण है।
  कंट्रोल प्लेन उस पॉड को टेंटेड नोड पर रखने से *बचने की कोशिश करेगा* जो टेंट
  को टॉलरेट नहीं करता, लेकिन यह गारंटीकृत नहीं है।

आप एक ही नोड पर कई टेंट्स और एक ही पॉड पर कई टॉलरेशन रख सकते हैं। Kubernetes
कई टेंट्स और टॉलरेशन को एक फ़िल्टर की तरह प्रोसेस करता है: नोड के सभी टेंट्स से
शुरू करें, फिर उन टेंट्स को अनदेखा करें जिनके लिए पॉड के पास मिलान करने वाली
टॉलरेशन है; शेष अनदेखे न किए गए टेंट्स पॉड पर इंगित effects देते हैं। विशेष रूप से,

* यदि `NoSchedule` effect वाला कम से कम एक अनदेखा न किया गया टेंट है तो Kubernetes
  पॉड को उस नोड पर शेड्यूल नहीं करेगा
* यदि `NoSchedule` effect वाला कोई अनदेखा न किया गया टेंट नहीं है लेकिन कम से कम
  एक `PreferNoSchedule` effect वाला अनदेखा न किया गया टेंट है तो Kubernetes पॉड को
  उस नोड पर शेड्यूल न करने की *कोशिश करेगा*
* यदि `NoExecute` effect वाला कम से कम एक अनदेखा न किया गया टेंट है तो पॉड को नोड
  से बाहर कर दिया जाएगा (यदि वह नोड पर पहले से चल रहा है), और नोड पर शेड्यूल
  नहीं होगा (यदि वह अभी नोड पर नहीं चल रहा)।

उदाहरण के लिए, मान लीजिए आप एक नोड को इस तरह टेंट करते हैं

```shell
kubectl taint nodes node1 key1=value1:NoSchedule
kubectl taint nodes node1 key1=value1:NoExecute
kubectl taint nodes node1 key2=value2:NoSchedule
```

और एक पॉड के पास दो टॉलरेशन हैं:

```yaml
tolerations:
- key: "key1"
  operator: "Equal"
  value: "value1"
  effect: "NoSchedule"
- key: "key1"
  operator: "Equal"
  value: "value1"
  effect: "NoExecute"
```

इस मामले में, पॉड नोड पर शेड्यूल नहीं हो सकेगा, क्योंकि तीसरे टेंट से मिलान
करने वाली कोई टॉलरेशन नहीं है। लेकिन यदि टेंट जोड़े जाने के समय पॉड पहले से
नोड पर चल रहा है तो वह चलते रहने में सक्षम होगा, क्योंकि तीसरा टेंट तीनों में
से अकेला ऐसा है जो पॉड द्वारा टॉलरेट नहीं किया जाता।

सामान्यतः, यदि `NoExecute` effect वाला टेंट एक नोड पर जोड़ा जाता है, तो जो पॉड्स
टेंट को टॉलरेट नहीं करते उन्हें तुरंत बाहर कर दिया जाता है, और जो पॉड्स टेंट को
टॉलरेट करते हैं उन्हें कभी बाहर नहीं किया जाता। हालांकि, `NoExecute` effect वाली
टॉलरेशन एक वैकल्पिक `tolerationSeconds` फ़ील्ड निर्दिष्ट कर सकती है जो यह बताती
है कि टेंट जोड़े जाने के बाद पॉड कितने समय तक नोड से बाउंड रहेगा। उदाहरण के लिए,

```yaml
tolerations:
- key: "key1"
  operator: "Equal"
  value: "value1"
  effect: "NoExecute"
  tolerationSeconds: 3600
```

इसका अर्थ है कि यदि यह पॉड चल रहा है और नोड पर एक मिलान करने वाला टेंट जोड़ा
जाता है, तो पॉड 3600 सेकंड तक नोड से बाउंड रहेगा, और फिर बाहर हो जाएगा। यदि
उस समय से पहले टेंट हटा दिया जाता है, तो पॉड बाहर नहीं होगा।

## संख्यात्मक तुलना ऑपरेटर {#numeric-comparison-operators}

{{< feature-state feature_gate_name="TaintTolerationComparisonOperators" >}}

`Equal` और `Exists` के अलावा, आप पूर्णांक मानों वाले टेंट्स से मिलान करने के लिए
संख्यात्मक तुलना ऑपरेटर (`Gt` और `Lt`) का उपयोग कर सकते हैं। यह threshold-आधारित
शेड्यूलिंग के लिए उपयोगी है, जैसे reliability level या SLA tier के अनुसार नोड्स
का मिलान करना।

* `Gt` तब मिलान करता है जब टेंट value टॉलरेशन value से अधिक हो।
* `Lt` तब मिलान करता है जब टेंट value टॉलरेशन value से कम हो।

संख्यात्मक ऑपरेटरों के लिए, टॉलरेशन और टेंट दोनों values वैध पूर्णांक होने चाहिए।
यदि कोई भी value पूर्णांक के रूप में parse नहीं हो सकती, तो टॉलरेशन मिलान नहीं करती।

{{< note >}}
जब आप `Gt` या `Lt` टॉलरेशन ऑपरेटर का उपयोग करने वाला पॉड बनाते हैं, तो API server
यह validate करता है कि टॉलरेशन values वैध पूर्णांक हैं। नोड्स पर टेंट values को
नोड registration के समय validate नहीं किया जाता। यदि किसी नोड के पास non-numeric
टेंट value है (उदाहरण के लिए,
`servicelevel.organization.example/agreed-service-level=high:NoSchedule`),
संख्यात्मक तुलना ऑपरेटर वाले पॉड्स उस टेंट से मिलान नहीं करेंगे और उस नोड पर
शेड्यूल नहीं हो सकते।
{{< /note >}}

उदाहरण के लिए, यदि नोड्स को service level agreement (SLA) दर्शाने वाली value के
साथ टेंट किया जाता है:

```shell
kubectl taint nodes node1 servicelevel.organization.example/agreed-service-level=950:NoSchedule
```

एक पॉड 900 से अधिक SLA वाले नोड्स को टॉलरेट कर सकता है:

{{% code_sample file="pods/pod-with-numeric-toleration.yaml" %}}

यह टॉलरेशन `node1` पर टेंट से मिलान करती है क्योंकि `950 > 900` (`Gt` ऑपरेटर के
लिए टेंट value टॉलरेशन value से अधिक है)। इसी तरह, आप `Lt` ऑपरेटर का उपयोग उन
टेंट्स से मिलान करने के लिए कर सकते हैं जहाँ टेंट value टॉलरेशन value से कम हो:

```yaml
tolerations:
- key: "servicelevel.organization.example/agreed-service-level"
  operator: "Lt"
  value: "1000"
  effect: "NoSchedule"
```

{{< note >}}
संख्यात्मक तुलना ऑपरेटर का उपयोग करते समय:

* टॉलरेशन और टेंट दोनों values वैध signed 64-bit पूर्णांक होने चाहिए
  (zero leading numbers (जैसे, "0550") अनुमत नहीं हैं)।
* यदि कोई value पूर्णांक के रूप में parse नहीं हो सकती, तो टॉलरेशन मिलान नहीं करती।
* संख्यात्मक ऑपरेटर सभी टेंट effects के साथ काम करते हैं: `NoSchedule`,
  `PreferNoSchedule`, और `NoExecute`।
* `PreferNoSchedule` के साथ संख्यात्मक ऑपरेटर के लिए: यदि पॉड की टॉलरेशन संख्यात्मक
  तुलना संतुष्ट नहीं करती (जैसे, `Gt` उपयोग करते समय टेंट value < टॉलरेशन value),
  तो शेड्यूलर नोड को कम प्राथमिकता देता है लेकिन यदि कोई बेहतर विकल्प नहीं है तो
  वहाँ शेड्यूल भी कर सकता है।
{{< /note >}}

{{< warning >}}

`TaintTolerationComparisonOperators` feature gate disable करने से पहले:

* आपको controller hot-loops से बचने के लिए `Gt` या `Lt` ऑपरेटर का उपयोग करने वाले
  सभी workloads की पहचान करनी चाहिए।
* सभी workload controller templates को `Equal` या `Exists` ऑपरेटर का उपयोग करने
  के लिए अपडेट करें
* `Gt` या `Lt` ऑपरेटर का उपयोग करने वाले pending पॉड्स को delete करें
* validation errors में spikes के लिए `apiserver_request_total` metric की निगरानी करें
{{< /warning >}}

## उपयोग के उदाहरण

टेंट्स और टॉलरेशन पॉड्स को नोड्स से *दूर* करने या उन पॉड्स को बाहर करने का एक
लचीला तरीका है जो नहीं चलने चाहिए। कुछ उपयोग के मामले हैं:

* **समर्पित नोड्स**: यदि आप किसी विशेष उपयोगकर्ताओं के समूह के एकल उपयोग के लिए
  नोड्स का एक समूह समर्पित करना चाहते हैं, तो आप उन नोड्स पर एक टेंट जोड़ सकते
  हैं (जैसे, `kubectl taint nodes nodename dedicated=groupName:NoSchedule`) और फिर
  उनके पॉड्स में संबंधित टॉलरेशन जोड़ सकते हैं (यह सबसे आसानी से एक custom
  [admission controller](/docs/reference/access-authn-authz/admission-controllers/)
  लिखकर किया जाता है)। टॉलरेशन वाले पॉड्स तब टेंटेड (समर्पित) नोड्स के साथ-साथ
  cluster के किसी भी अन्य नोड का उपयोग करने में सक्षम होंगे। यदि आप नोड्स को उनके
  लिए समर्पित करना *चाहते हैं* और यह सुनिश्चित करना चाहते हैं कि वे *केवल* समर्पित
  नोड्स का उपयोग करें, तो आपको नोड्स के उसी समूह पर टेंट के समान एक label भी जोड़ना
  चाहिए (जैसे `dedicated=groupName`), और admission controller को अतिरिक्त रूप से एक
  node affinity जोड़नी चाहिए जिसमें आवश्यकता हो कि पॉड्स केवल `dedicated=groupName`
  से labeled नोड्स पर शेड्यूल हो सकें।

* **विशेष हार्डवेयर वाले नोड्स**: एक ऐसे cluster में जहाँ नोड्स के एक छोटे उपसमूह
  के पास विशेष हार्डवेयर है (उदाहरण के लिए GPUs), यह वांछनीय है कि विशेष हार्डवेयर
  की आवश्यकता न होने वाले पॉड्स को उन नोड्स से दूर रखा जाए, इस प्रकार बाद में आने
  वाले पॉड्स के लिए जगह बचाई जाए जिन्हें विशेष हार्डवेयर की आवश्यकता है। यह
  विशेष हार्डवेयर वाले नोड्स को टेंट करके (जैसे
  `kubectl taint nodes nodename special=true:NoSchedule` या
  `kubectl taint nodes nodename special=true:PreferNoSchedule`) और विशेष हार्डवेयर
  का उपयोग करने वाले पॉड्स में संबंधित टॉलरेशन जोड़कर किया जा सकता है।

* **टेंट आधारित निष्कासन**: नोड समस्याएं होने पर per-pod-configurable निष्कासन
  व्यवहार, जो अगले अनुभाग में वर्णित है।

## टेंट आधारित निष्कासन

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

नोड controller कुछ conditions के सत्य होने पर स्वचालित रूप से एक नोड को टेंट करता
है। निम्नलिखित टेंट्स built-in हैं:

 * `node.kubernetes.io/not-ready`: नोड ready नहीं है। यह NodeCondition `Ready` के
   "`False`" होने से संबंधित है।
 * `node.kubernetes.io/unreachable`: नोड, node controller से unreachable है। यह
   NodeCondition `Ready` के "`Unknown`" होने से संबंधित है।
 * `node.kubernetes.io/memory-pressure`: नोड पर memory pressure है।
 * `node.kubernetes.io/disk-pressure`: नोड पर disk pressure है।
 * `node.kubernetes.io/pid-pressure`: नोड पर PID pressure है।
 * `node.kubernetes.io/network-unavailable`: नोड का network unavailable है।
 * `node.kubernetes.io/unschedulable`: नोड unschedulable है।
 * `node.cloudprovider.kubernetes.io/uninitialized`: जब kubelet एक "external" cloud
    provider के साथ शुरू किया जाता है, तो यह टेंट नोड पर set किया जाता है उसे
    unusable mark करने के लिए। cloud-controller-manager के एक controller द्वारा इस
    नोड को initialize करने के बाद, kubelet इस टेंट को हटा देता है।

यदि किसी नोड को drain करना हो, तो node controller या kubelet `NoExecute` effect के
साथ संबंधित टेंट्स जोड़ता है। यह effect `node.kubernetes.io/not-ready` और
`node.kubernetes.io/unreachable` टेंट्स के लिए डिफ़ॉल्ट रूप से जोड़ा जाता है।
यदि fault condition सामान्य हो जाती है, तो kubelet या node controller संबंधित
टेंट(s) हटा सकता है।

कुछ मामलों में जब नोड unreachable होता है, API server नोड पर kubelet के साथ
communicate नहीं कर सकता। पॉड्स को delete करने का निर्णय kubelet को तब तक communicate
नहीं किया जा सकता जब तक API server के साथ communication पुनः स्थापित न हो जाए।
इस बीच, deletion के लिए scheduled पॉड्स partitioned नोड पर चलते रह सकते हैं।

{{< note >}}
कंट्रोल प्लेन नोड्स में नए टेंट्स जोड़ने की दर को सीमित करता है। यह rate limiting
उन निष्कासनों की संख्या को manage करता है जो तब trigger होते हैं जब बहुत सारे नोड्स
एक साथ unreachable हो जाते हैं (उदाहरण के लिए: यदि network disruption होती है)।
{{< /note >}}

आप एक पॉड के लिए `tolerationSeconds` निर्दिष्ट कर सकते हैं यह परिभाषित करने के
लिए कि failing या unresponsive नोड पर वह पॉड कितने समय तक bound रहेगा।

उदाहरण के लिए, आप network partition होने पर बहुत सारी local state वाले application
को नोड से काफी समय तक bound रखना चाहते हो सकते हैं, उम्मीद रखते हुए कि partition
recover हो जाएगा और इसलिए पॉड निष्कासन से बचा जा सकता है।
इस पॉड के लिए आप जो टॉलरेशन set करते हैं वह कुछ इस तरह लग सकती है:

```yaml
tolerations:
- key: "node.kubernetes.io/unreachable"
  operator: "Exists"
  effect: "NoExecute"
  tolerationSeconds: 6000
```

{{< note >}}
Kubernetes स्वचालित रूप से `node.kubernetes.io/not-ready` और
`node.kubernetes.io/unreachable` के लिए `tolerationSeconds=300` के साथ टॉलरेशन
जोड़ता है, जब तक आप, या कोई controller, उन टॉलरेशन को स्पष्ट रूप से सेट न करें।

ये स्वचालित रूप से जोड़ी गई टॉलरेशन का अर्थ है कि पॉड्स इन समस्याओं में से किसी
एक के detect होने के बाद 5 मिनट तक नोड्स से bound रहते हैं।
{{< /note >}}

[DaemonSet](/docs/concepts/workloads/controllers/daemonset/) पॉड्स निम्नलिखित टेंट्स
के लिए बिना `tolerationSeconds` के `NoExecute` टॉलरेशन के साथ बनाए जाते हैं:

  * `node.kubernetes.io/unreachable`
  * `node.kubernetes.io/not-ready`

यह सुनिश्चित करता है कि DaemonSet पॉड्स इन समस्याओं के कारण कभी बाहर नहीं होते।

{{< note >}}
नोड controller नोड्स में टेंट्स जोड़ने और पॉड्स को बाहर करने के लिए जिम्मेदार था।
लेकिन 1.29 के बाद, taint-based eviction implementation को node controller से बाहर
एक अलग, और स्वतंत्र component में स्थानांतरित कर दिया गया है जिसे
taint-eviction-controller कहा जाता है। उपयोगकर्ता वैकल्पिक रूप से taint-based
eviction को kube-controller-manager में
`--controllers=-taint-eviction-controller` सेट करके disable कर सकते हैं।
{{< /note >}}

## स्थिति के अनुसार नोड्स को टेंट करना

कंट्रोल प्लेन, नोड {{<glossary_tooltip text="controller" term_id="controller">}} का
उपयोग करके, स्वचालित रूप से
[नोड conditions](/docs/concepts/scheduling-eviction/node-pressure-eviction/#node-conditions)
के लिए `NoSchedule` effect के साथ टेंट्स बनाता है।

शेड्यूलर scheduling decisions करते समय नोड conditions नहीं, टेंट्स check करता है।
यह सुनिश्चित करता है कि नोड conditions सीधे scheduling को प्रभावित नहीं करतीं।
उदाहरण के लिए, यदि `DiskPressure` नोड condition सक्रिय है, तो कंट्रोल प्लेन
`node.kubernetes.io/disk-pressure` टेंट जोड़ता है और affected नोड पर नए पॉड्स
शेड्यूल नहीं करता। यदि `MemoryPressure` नोड condition सक्रिय है, तो कंट्रोल प्लेन
`node.kubernetes.io/memory-pressure` टेंट जोड़ता है।

आप नए बने पॉड्स के लिए संबंधित पॉड टॉलरेशन जोड़कर नोड conditions को अनदेखा कर
सकते हैं। कंट्रोल प्लेन उन पॉड्स पर भी `node.kubernetes.io/memory-pressure` टॉलरेशन
जोड़ता है जिनकी {{< glossary_tooltip text="QoS class" term_id="qos-class" >}}
`BestEffort` के अलावा कोई और है। यह इसलिए है क्योंकि Kubernetes `Guaranteed` या
`Burstable` QoS classes में पॉड्स को (चाहे उनके पास कोई memory request set न हो)
ऐसे treat करता है जैसे वे memory pressure cope करने में सक्षम हैं, जबकि नए
`BestEffort` पॉड्स affected नोड पर शेड्यूल नहीं होते।

DaemonSet controller स्वचालित रूप से निम्नलिखित `NoSchedule` टॉलरेशन सभी daemons
में जोड़ता है, DaemonSets को break होने से रोकने के लिए।

  * `node.kubernetes.io/memory-pressure`
  * `node.kubernetes.io/disk-pressure`
  * `node.kubernetes.io/pid-pressure` (1.14 या बाद का)
  * `node.kubernetes.io/unschedulable` (1.10 या बाद का)
  * `node.kubernetes.io/network-unavailable` (*केवल host network*)

ये टॉलरेशन जोड़ना backward compatibility सुनिश्चित करता है। आप DaemonSets में
arbitrary टॉलरेशन भी जोड़ सकते हैं।

## डिवाइस टेंट्स और टॉलरेशन

पूरे नोड्स को टेंट करने की जगह, administrators [individual devices को भी टेंट कर सकते हैं](/docs/concepts/scheduling-eviction/dynamic-resource-allocation#device-taints-and-tolerations)
जब cluster विशेष हार्डवेयर manage करने के लिए
[dynamic resource allocation](/docs/concepts/scheduling-eviction/dynamic-resource-allocation)
का उपयोग करता है। इसका फायदा यह है कि tainting को ठीक उस हार्डवेयर की ओर
लक्षित किया जा सकता है जो faulty है या maintenance की आवश्यकता है। टॉलरेशन भी
supported हैं और devices request करते समय निर्दिष्ट की जा सकती हैं। टेंट्स की
तरह ये उन सभी पॉड्स पर लागू होती हैं जो समान allocated device share करते हैं।

## {{% heading "whatsnext" %}}

* [नोड-pressure Eviction](/docs/concepts/scheduling-eviction/node-pressure-eviction/)
  के बारे में पढ़ें और आप इसे कैसे configure कर सकते हैं
* [पॉड Priority](/docs/concepts/scheduling-eviction/pod-priority-preemption/) के
  बारे में पढ़ें
* [device टेंट्स और टॉलरेशन](/docs/concepts/scheduling-eviction/dynamic-resource-allocation#device-taints-and-tolerations)
  के बारे में पढ़ें