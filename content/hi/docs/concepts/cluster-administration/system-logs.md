---
title: सिस्टम लॉग
content_type: concept
weight: 80
---

<!-- overview -->

सिस्टम कॉम्पोनेंट लॉग क्लस्टर में घटित होने वाली घटनाओं को रिकॉर्ड करते हैं, जो डिबगिंग के लिए बहुत उपयोगी हो सकते हैं।
आप लॉग की विस्तृतता (verbosity) को कॉन्फ़िगर करके कम या अधिक विवरण देख सकते हैं।
लॉग उतने ही मोटे-स्तरीय (coarse-grained) हो सकते हैं जितना कि किसी कॉम्पोनेंट के भीतर की त्रुटियाँ दिखाना, या उतने ही महीन-स्तरीय (fine-grained) जितना कि घटनाओं के चरण-दर-चरण ट्रेस दिखाना (जैसे HTTP एक्सेस लॉग, पॉड की स्थिति में बदलाव, कंट्रोलर क्रियाएँ, या शेड्यूलर के निर्णय)।

<!-- body -->

{{< warning >}}
यहाँ वर्णित कमांड लाइन फ़्लैग के विपरीत, लॉग *आउटपुट* स्वयं Kubernetes API स्थिरता गारंटी के अंतर्गत *नहीं* आता:
व्यक्तिगत लॉग एंट्री और उनका फ़ॉर्मेटिंग एक रिलीज़ से दूसरे में बदल सकती है!
{{< /warning >}}

## Klog

klog, Kubernetes की लॉगिंग लाइब्रेरी है। [klog](https://github.com/kubernetes/klog)
Kubernetes सिस्टम कॉम्पोनेंट्स के लिए लॉग संदेश उत्पन्न करती है।

Kubernetes अपने कॉम्पोनेंट्स में लॉगिंग को सरल बनाने की प्रक्रिया में है।
निम्नलिखित klog कमांड लाइन फ़्लैग
Kubernetes v1.23 से [पदावनत (deprecated)](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/2845-deprecate-klog-specific-flags-in-k8s-components)
हो गए हैं और Kubernetes v1.26 में हटा दिए गए हैं:

- `--add-dir-header`
- `--alsologtostderr`
- `--log-backtrace-at`
- `--log-dir`
- `--log-file`
- `--log-file-max-size`
- `--logtostderr`
- `--one-output`
- `--skip-headers`
- `--skip-log-headers`
- `--stderrthreshold`

आउटपुट हमेशा stderr पर लिखा जाएगा, चाहे आउटपुट फ़ॉर्मेट कुछ भी हो। आउटपुट रीडायरेक्शन
उस कॉम्पोनेंट द्वारा संभाला जाना अपेक्षित है जो Kubernetes कॉम्पोनेंट को आमंत्रित (invoke) करता है। यह एक POSIX
शेल या systemd जैसा कोई टूल हो सकता है।

कुछ मामलों में, उदाहरण के लिए distroless कंटेनर या Windows सिस्टम सर्विस, ये विकल्प
उपलब्ध नहीं होते। तब किसी Kubernetes कॉम्पोनेंट के इर्द-गिर्द रैपर (wrapper) के रूप में
[`kube-log-runner`](https://github.com/kubernetes/kubernetes/blob/d2a8a81639fcff8d1221b900f66d28361a170654/staging/src/k8s.io/component-base/logs/kube-log-runner/README.md)
बाइनरी का उपयोग आउटपुट रीडायरेक्ट करने के लिए किया जा सकता है। कई Kubernetes बेस इमेज में एक प्रीबिल्ट बाइनरी
अपने पारंपरिक नाम `/go-runner` के रूप में तथा server और
node रिलीज़ आर्काइव में `kube-log-runner` के रूप में शामिल होती है।

यह तालिका दिखाती है कि `kube-log-runner` आमंत्रण शेल रीडायरेक्शन से कैसे मेल खाते हैं:

| उपयोग                                    | POSIX शेल (जैसे bash) | `kube-log-runner <options> <cmd>`                           |
| -----------------------------------------|----------------------------|-------------------------------------------------------------|
| stderr और stdout को मर्ज करें, stdout पर लिखें | `2>&1`                     | `kube-log-runner` (डिफ़ॉल्ट व्यवहार)                        |
| दोनों को लॉग फ़ाइल में रीडायरेक्ट करें              | `1>>/tmp/log 2>&1`         | `kube-log-runner -log-file=/tmp/log`                        |
| लॉग फ़ाइल में और stdout पर कॉपी करें         | `2>&1 \| tee -a /tmp/log`  | `kube-log-runner -log-file=/tmp/log -also-stdout`           |
| केवल stdout को लॉग फ़ाइल में रीडायरेक्ट करें       | `>/tmp/log`                | `kube-log-runner -log-file=/tmp/log -redirect-stderr=false` |

### Klog आउटपुट

पारंपरिक klog नेटिव फ़ॉर्मेट का एक उदाहरण:

```
I1025 00:15:15.525108       1 httplog.go:79] GET /api/v1/namespaces/kube-system/pods/metrics-server-v0.3.1-57c75779f-9p8wg: (1.512ms) 200 [pod_nanny/v0.0.0 (linux/amd64) kubernetes/$Format 10.56.1.19:51756]
```

संदेश स्ट्रिंग में लाइन ब्रेक हो सकते हैं:

```
I1025 00:15:15.525108       1 example.go:79] This is a message
which has a line break.
```

### स्ट्रक्चर्ड लॉगिंग

{{< feature-state for_k8s_version="v1.23" state="beta" >}}

{{< warning >}}
स्ट्रक्चर्ड लॉग संदेशों में माइग्रेशन एक चल रही प्रक्रिया है। इस संस्करण में सभी लॉग संदेश स्ट्रक्चर्ड नहीं हैं।
लॉग फ़ाइलों को पार्स करते समय, आपको अस्ट्रक्चर्ड लॉग संदेशों को भी संभालना होगा।

लॉग फ़ॉर्मेटिंग और मान क्रमांकन (serialization) बदलने के अधीन हैं।
{{< /warning>}}

स्ट्रक्चर्ड लॉगिंग लॉग संदेशों में एक समान संरचना प्रस्तुत करती है जिससे जानकारी का प्रोग्रामेटिक
निष्कर्षण संभव होता है। आप स्ट्रक्चर्ड लॉग को कम प्रयास और लागत में संग्रहीत और संसाधित कर सकते हैं।
लॉग संदेश उत्पन्न करने वाला कोड यह निर्धारित करता है कि वह पारंपरिक अस्ट्रक्चर्ड
klog आउटपुट का उपयोग करेगा या स्ट्रक्चर्ड लॉगिंग का।

स्ट्रक्चर्ड लॉग संदेशों का डिफ़ॉल्ट फ़ॉर्मेटिंग टेक्स्ट के रूप में होता है, जो पारंपरिक
klog के साथ बैकवर्ड कम्पैटिबल (पश्च-संगत) फ़ॉर्मेट में होता है:

```
<klog header> "<message>" <key1>="<value1>" <key2>="<value2>" ...
```

उदाहरण:

```
I1025 00:15:15.525108       1 controller_utils.go:116] "Pod status updated" pod="kube-system/kubedns" status="ready"
```

स्ट्रिंग्स उद्धरण चिह्नों में होती हैं। अन्य मान
[`%+v`](https://pkg.go.dev/fmt#hdr-Printing) के साथ फ़ॉर्मेट किए जाते हैं, जिससे लॉग संदेश
[डेटा के अनुसार](https://github.com/kubernetes/kubernetes/issues/106428) अगली लाइन पर जारी रह सकते हैं।

```
I1025 00:15:15.525108       1 example.go:116] "Example" data="This is text with a line break\nand \"quotation marks\"." someInt=1 someFloat=0.1 someStruct={StringField: First line,
second line.}
```

### कॉन्टेक्स्टुअल लॉगिंग

{{< feature-state for_k8s_version="v1.30" state="beta" >}}

कॉन्टेक्स्टुअल लॉगिंग स्ट्रक्चर्ड लॉगिंग के ऊपर बनती है। यह मुख्य रूप से इस बारे में है कि
डेवलपर लॉगिंग कॉल का उपयोग कैसे करते हैं: उस अवधारणा पर आधारित कोड अधिक लचीला होता है
और [कॉन्टेक्स्टुअल लॉगिंग KEP](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/3077-contextual-logging)
में वर्णित अतिरिक्त उपयोग-मामलों का समर्थन करता है।

यदि डेवलपर अपने कॉम्पोनेंट्स में `WithValues` या `WithName` जैसे अतिरिक्त फ़ंक्शन का उपयोग करते हैं,
तो लॉग एंट्री में अतिरिक्त जानकारी होती है जो कॉलर द्वारा फ़ंक्शनों में पास की जाती है।

Kubernetes {{< skew currentVersion >}} के लिए, यह `ContextualLogging`
[फ़ीचर गेट](/docs/reference/command-line-tools-reference/feature-gates/) के पीछे है और
डिफ़ॉल्ट रूप से सक्षम है। इसके लिए इन्फ्रास्ट्रक्चर 1.24 में कॉम्पोनेंट्स को संशोधित किए बिना जोड़ा गया था।
[`component-base/logs/example`](https://github.com/kubernetes/kubernetes/blob/v1.24.0-beta.0/staging/src/k8s.io/component-base/logs/example/cmd/logger.go)
कमांड दर्शाता है कि नए लॉगिंग कॉल का उपयोग कैसे किया जाता है और कॉम्पोनेंट
कैसे व्यवहार करता है जो कॉन्टेक्स्टुअल लॉगिंग का समर्थन करता है।

```console
$ cd $GOPATH/src/k8s.io/kubernetes/staging/src/k8s.io/component-base/logs/example/cmd/
$ go run . --help
...
      --feature-gates mapStringBool  A set of key=value pairs that describe feature gates for alpha/experimental features. Options are:
                                     AllAlpha=true|false (ALPHA - default=false)
                                     AllBeta=true|false (BETA - default=false)
                                     ContextualLogging=true|false (BETA - default=true)
$ go run . --feature-gates ContextualLogging=true
...
I0222 15:13:31.645988  197901 example.go:54] "runtime" logger="example.myname" foo="bar" duration="1m0s"
I0222 15:13:31.646007  197901 example.go:55] "another runtime" logger="example" foo="bar" duration="1h0m0s" duration="1m0s"
```

`logger` कुंजी और `foo="bar"` को उस फ़ंक्शन के कॉलर ने जोड़ा
जो `runtime` संदेश और `duration="1m0s"` मान को लॉग करता है, बिना
उस फ़ंक्शन को संशोधित किए।

कॉन्टेक्स्टुअल लॉगिंग अक्षम होने पर, `WithValues` और `WithName` कुछ नहीं करते और लॉग
कॉल ग्लोबल klog लॉगर से होकर जाते हैं। इसलिए यह अतिरिक्त जानकारी
अब लॉग आउटपुट में नहीं होती:

```console
$ go run . --feature-gates ContextualLogging=false
...
I0222 15:14:40.497333  198174 example.go:54] "runtime" duration="1m0s"
I0222 15:14:40.497346  198174 example.go:55] "another runtime" duration="1h0m0s" duration="1m0s"
```

### JSON लॉग फ़ॉर्मेट

{{< feature-state for_k8s_version="v1.19" state="alpha" >}}

{{<warning >}}
JSON आउटपुट कई मानक klog फ़्लैग का समर्थन नहीं करता। असमर्थित klog फ़्लैग की सूची के लिए,
[कमांड लाइन टूल संदर्भ](/docs/reference/command-line-tools-reference/) देखें।

सभी लॉग JSON फ़ॉर्मेट में लिखे जाने की गारंटी नहीं है (उदाहरण के लिए, प्रोसेस स्टार्ट के दौरान)।
यदि आप लॉग पार्स करना चाहते हैं, तो सुनिश्चित करें कि आप उन लॉग लाइनों को भी संभाल सकते हैं जो JSON नहीं हैं।

फ़ील्ड नाम और JSON क्रमांकन बदलने के अधीन हैं।
{{< /warning >}}

`--logging-format=json` फ़्लैग लॉग के फ़ॉर्मेट को klog नेटिव फ़ॉर्मेट से JSON फ़ॉर्मेट में बदल देता है।
JSON लॉग फ़ॉर्मेट का उदाहरण (प्रिटी प्रिंटेड):

```json
{
   "ts": 1580306777.04728,
   "v": 4,
   "msg": "Pod status updated",
   "pod":{
      "name": "nginx-1",
      "namespace": "default"
   },
   "status": "ready"
}
```

विशेष अर्थ वाली कुंजियाँ:

* `ts` - Unix समय के रूप में टाइमस्टैम्प (आवश्यक, float)
* `v` - विस्तृतता (केवल info के लिए, error संदेशों के लिए नहीं, int)
* `err` - त्रुटि स्ट्रिंग (वैकल्पिक, string)
* `msg` - संदेश (आवश्यक, string)

वर्तमान में JSON फ़ॉर्मेट का समर्थन करने वाले कॉम्पोनेंट्स की सूची:

* {{< glossary_tooltip term_id="kube-controller-manager" text="kube-controller-manager" >}}
* {{< glossary_tooltip term_id="kube-apiserver" text="kube-apiserver" >}}
* {{< glossary_tooltip term_id="kube-scheduler" text="kube-scheduler" >}}
* {{< glossary_tooltip term_id="kubelet" text="kubelet" >}}

### लॉग विस्तृतता स्तर

`-v` फ़्लैग लॉग विस्तृतता को नियंत्रित करता है। मान बढ़ाने से लॉग की गई घटनाओं की संख्या बढ़ती है।
मान घटाने से लॉग की गई घटनाओं की संख्या घटती है। विस्तृतता सेटिंग बढ़ाने से
उत्तरोत्तर कम गंभीर घटनाएँ लॉग होती हैं। 0 की विस्तृतता सेटिंग केवल गंभीर घटनाओं को लॉग करती है।

### लॉग स्थान

दो प्रकार के सिस्टम कॉम्पोनेंट्स होते हैं: वे जो कंटेनर में चलते हैं और वे
जो कंटेनर में नहीं चलते। उदाहरण के लिए:

* Kubernetes शेड्यूलर और kube-proxy कंटेनर में चलते हैं।
* kubelet और {{<glossary_tooltip term_id="container-runtime" text="कंटेनर रनटाइम">}}
  कंटेनर में नहीं चलते।

systemd वाली मशीनों पर, kubelet और कंटेनर रनटाइम journald में लिखते हैं।
अन्यथा, वे `/var/log` डायरेक्टरी में `.log` फ़ाइलों में लिखते हैं।
कंटेनरों के अंदर के सिस्टम कॉम्पोनेंट्स हमेशा `/var/log` डायरेक्टरी में `.log` फ़ाइलों में लिखते हैं,
जो डिफ़ॉल्ट लॉगिंग तंत्र को बायपास करते हैं।
कंटेनर लॉग के समान, आपको `/var/log` डायरेक्टरी में सिस्टम कॉम्पोनेंट लॉग को रोटेट करना चाहिए।
`kube-up.sh` स्क्रिप्ट द्वारा बनाए गए Kubernetes क्लस्टर में, लॉग रोटेशन `logrotate` टूल द्वारा कॉन्फ़िगर किया जाता है।
`logrotate` टूल लॉग को दैनिक रोटेट करता है, या जब लॉग का आकार 100MB से अधिक हो जाता है।

## लॉग क्वेरी

{{< feature-state feature_gate_name="NodeLogQuery" >}}

लॉग क्वेरी सुविधा Linux और Windows दोनों
नोड्स में समस्याओं को डिबग करने में मदद कर सकती है। Kubernetes v1.27 में पेश की गई, यह सुविधा
नोड पर चल रही सेवाओं के लॉग देखने की अनुमति देती है। इस सुविधा का उपयोग करने के लिए, सुनिश्चित करें कि
लक्ष्य नोड के लिए kubelet कॉन्फ़िगरेशन विकल्प `enableSystemLogHandler` और `enableSystemLogQuery`
दोनों _true_ पर सेट हों।

Kubernetes v1.36 में यह सुविधा स्थिर (stable) हो गई और `NodeLogQuery` [फ़ीचर गेट](/docs/reference/command-line-tools-reference/feature-gates/)
अब _true_ पर लॉक है, इसलिए फ़ीचर गेट डिफ़ॉल्ट रूप से सक्षम है, जिससे
लॉग क्वेरी सुविधा को सक्षम या अक्षम करने के लिए केवल `enableSystemLogHandler` ही आवश्यक विकल्प रह जाता है।

`enableSystemLogHandler` डिफ़ॉल्ट रूप से _false_ होता है और इसे सक्रिय डिबगिंग के अलावा
अक्षम ही रखने की सिफारिश की जाती है।

{{< warning >}}
`nodes/proxy` को अनुमति देना (भले ही केवल **get** अनुमति हो) शक्तिशाली kubelet API तक पहुंच को भी
अधिकृत करता है जिनका उपयोग नोड पर चल रहे किसी भी कंटेनर में कमांड निष्पादित करने के लिए किया जा सकता है,
इसलिए इन्हें कैसे प्रबंधित करते हैं, इस बारे में सावधान रहें।
अधिक जानकारी के लिए [Kubelet प्रमाणीकरण/प्राधिकरण](/docs/reference/access-authn-authz/kubelet-authn-authz/#get-nodes-proxy-warning)
देखें।
{{< /warning >}}

Linux पर, यह माना जाता है कि सेवा लॉग _journald_ के माध्यम से उपलब्ध हैं।
Windows पर यह माना जाता है कि सेवा लॉग एप्लिकेशन लॉग प्रोवाइडर में उपलब्ध हैं।
दोनों ऑपरेटिंग सिस्टम पर, `/var/log/` के भीतर की फ़ाइलों को पढ़कर भी लॉग उपलब्ध होते हैं।

यदि आप नोड ऑब्जेक्ट के साथ इंटरैक्ट करने के लिए अधिकृत हैं, तो आप इस सुविधा को अपने सभी नोड्स या
केवल एक सबसेट पर आज़मा सकते हैं। यहाँ किसी नोड से kubelet सेवा लॉग प्राप्त करने का एक उदाहरण है:

```shell
# node-1.example नाम के नोड से kubelet लॉग प्राप्त करें
kubectl get --raw "/api/v1/nodes/node-1.example/proxy/logs/?query=kubelet"
```

आप फ़ाइलें भी प्राप्त कर सकते हैं, बशर्ते वे फ़ाइलें उस डायरेक्टरी में हों जिसे kubelet लॉग
फ़ेच के लिए अनुमति देता है। उदाहरण के लिए, आप Linux नोड पर `/var/log` से लॉग प्राप्त कर सकते हैं:

```shell
kubectl get --raw "/api/v1/nodes/<insert-node-name-here>/proxy/logs/?query=/<insert-log-file-name-here>"
```

kubelet लॉग प्राप्त करने के लिए ह्यूरिस्टिक्स का उपयोग करता है। यह तब सहायक होता है जब आप निश्चित नहीं हैं कि कोई सिस्टम
सेवा ऑपरेटिंग सिस्टम के नेटिव लॉगर (जैसे journald) में लॉग लिख रही है या `/var/log/` में किसी लॉग फ़ाइल में।
ह्यूरिस्टिक्स पहले नेटिव लॉगर की जाँच करता है और यदि वह उपलब्ध नहीं है तो `/var/log/<servicename>` या `/var/log/<servicename>.log` या `/var/log/<servicename>/<servicename>.log` से पहले लॉग प्राप्त करने का प्रयास करता है।

उपयोग किए जा सकने वाले विकल्पों की पूरी सूची इस प्रकार है:

| विकल्प      | विवरण                                                                                         |
|-------------|-----------------------------------------------------------------------------------------------------|
| `boot`      | किसी विशिष्ट सिस्टम बूट से संदेश दिखाता है                                                      |
| `pattern`   | दिए गए PERL-संगत रेगुलर एक्सप्रेशन द्वारा लॉग एंट्री को फ़िल्टर करता है                      |
| `query`     | उन सेवा(ओं) या फ़ाइलों को निर्दिष्ट करता है जिनसे लॉग लौटाने हैं (आवश्यक)                           |
| `sinceTime` | एक [RFC3339](https://www.rfc-editor.org/rfc/rfc3339) टाइमस्टैम्प जिससे लॉग दिखाने हैं (सहित)  |
| `untilTime` | एक [RFC3339](https://www.rfc-editor.org/rfc/rfc3339) टाइमस्टैम्प जिस तक लॉग दिखाने हैं (सहित) |
| `tailLines` | लॉग के अंत से कितनी लाइनें प्राप्त करनी हैं; डिफ़ॉल्ट पूरा लॉग लाना है   |

एक अधिक जटिल क्वेरी का उदाहरण:

```shell
# node-1.example नाम के नोड से kubelet लॉग प्राप्त करें जिनमें "error" शब्द हो
kubectl get --raw "/api/v1/nodes/node-1.example/proxy/logs/?query=kubelet&pattern=error"
```

## {{% heading "whatsnext" %}}

* [Kubernetes लॉगिंग आर्किटेक्चर](/docs/concepts/cluster-administration/logging/) के बारे में पढ़ें
* [स्ट्रक्चर्ड लॉगिंग](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/1602-structured-logging) के बारे में पढ़ें
* [कॉन्टेक्स्टुअल लॉगिंग](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/3077-contextual-logging) के बारे में पढ़ें
* [klog फ़्लैग की पदावनति](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/2845-deprecate-klog-specific-flags-in-k8s-components) के बारे में पढ़ें
* [लॉगिंग गंभीरता के लिए कन्वेंशन](https://github.com/kubernetes/community/blob/main/contributors/devel/sig-instrumentation/logging.md) के बारे में पढ़ें
* [लॉग क्वेरी](https://kep.k8s.io/2258) के बारे में पढ़ें
