---
title: नोड शटडाउन
content_type: concept
weight: 10
---

<!-- overview -->

Kubernetes क्लस्टर में, एक {{< glossary_tooltip text="node" term_id="node" >}}
को बिजली चले जाने या किसी अन्य बाहरी कारण से नियोजित रूप से या अनपेक्षित रूप से बंद किया जा सकता है।
यदि शटडाउन से पहले नोड को drain नहीं किया जाता है, तो नोड शटडाउन से वर्कलोड विफल हो सकते हैं।
नोड शटडाउन **सुचारु** या **असुचारु** हो सकता है।

{{< caution >}}
Debian का `unattended-upgrades` पैकेज अपने सामान्य कॉन्फ़िगरेशन में नोड के सुचारु शटडाउन से टकराता है।
यदि आप `unattended-upgrades` का डिफ़ॉल्ट कॉन्फ़िगरेशन इस्तेमाल करते हैं, जो सर्वर शटडाउन की
grace अवधि को अनुकूलित करता है, तो kubelet शटडाउन इवेंट को ठीक से संभालने के लिए आवश्यक लॉक
प्राप्त नहीं कर पाता है।

ऐसा तब होता है, जब `shutdownGracePeriod` मान 30 सेकंड से अधिक हो।
इससे बचने के लिए, आप `unattended-upgrades` कॉन्फ़िगरेशन का एक भाग निष्क्रिय कर सकते हैं;
इसके लिए `/etc/systemd/logind.conf.d/unattended-upgrades-logind-maxdelay.conf` को `/dev/null` का
symbolic link बनाएं।

अधिक जानकारी के लिए,
[`logind.conf` दस्तावेज़](https://www.freedesktop.org/software/systemd/man/latest/logind.conf.html) देखें।
{{< /caution >}}

<!-- body -->

## सुचारु नोड शटडाउन {#graceful-node-shutdown}

kubelet नोड के सिस्टम शटडाउन का पता लगाने का प्रयास करता है और नोड पर चल रहे Pods को समाप्त करता है।

Kubelet यह सुनिश्चित करता है कि नोड शटडाउन के दौरान Pods सामान्य
[Pod समाप्ति प्रक्रिया](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)
का पालन करें। नोड शटडाउन के दौरान, kubelet नए Pods स्वीकार नहीं करता है
(भले ही वे Pods पहले ही नोड से bound हों)।

### सुचारु नोड शटडाउन सक्षम करना

{{< tabs name="graceful_shutdown_os" >}}
{{% tab name="Linux" %}}
{{< feature-state feature_gate_name="GracefulNodeShutdown" >}}

Linux पर, सुचारु नोड शटडाउन सुविधा `GracefulNodeShutdown`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) द्वारा नियंत्रित होती है, जो
1.21 में डिफ़ॉल्ट रूप से सक्षम है।

{{< note >}}
सुचारु नोड शटडाउन सुविधा systemd पर निर्भर करती है, क्योंकि यह
[systemd inhibitor locks](https://www.freedesktop.org/wiki/Software/systemd/inhibit/) का उपयोग करके
नोड शटडाउन को एक निश्चित अवधि तक विलंबित करती है।
{{</ note >}}
{{% /tab %}}

{{% tab name="Windows" %}}
{{< feature-state feature_gate_name="WindowsGracefulNodeShutdown" >}}

Windows पर, सुचारु नोड शटडाउन सुविधा `WindowsGracefulNodeShutdown`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) द्वारा नियंत्रित होती है।
इसे 1.32 में alpha सुविधा के रूप में पेश किया गया था। Kubernetes 1.34 में यह सुविधा Beta है
और डिफ़ॉल्ट रूप से सक्षम है।

{{< note >}}
Windows की सुचारु नोड शटडाउन सुविधा के लिए kubelet का Windows सेवा के रूप में चलना आवश्यक है।
तब उसके पास दिए गए समय तक preshutdown इवेंट को विलंबित करने के लिए पंजीकृत
[service control handler](https://learn.microsoft.com/en-us/windows/win32/services/service-control-handler-function) होगा।
{{</ note >}}

Windows का सुचारु नोड शटडाउन रद्द नहीं किया जा सकता।

यदि kubelet Windows सेवा के रूप में नहीं चल रहा है, तो वह
[Preshutdown](https://learn.microsoft.com/en-us/windows/win32/api/winsvc/ns-winsvc-service_preshutdown_info) इवेंट को सेट और मॉनिटर नहीं कर सकेगा;
नोड को ऊपर बताई गई [असुचारु नोड शटडाउन](#non-graceful-node-shutdown) प्रक्रिया से गुजरना होगा।

यदि Windows सुचारु नोड शटडाउन सुविधा सक्षम है, लेकिन kubelet Windows सेवा के रूप में नहीं चल रहा है,
तो kubelet विफल होने के बजाय चलता रहेगा। हालांकि, वह यह बताते हुए त्रुटि लॉग करेगा कि उसे
Windows सेवा के रूप में चलाया जाना चाहिए।
{{% /tab %}}

{{< /tabs >}}

### सुचारु नोड शटडाउन कॉन्फ़िगर करना

ध्यान दें कि डिफ़ॉल्ट रूप से नीचे बताए गए दोनों कॉन्फ़िगरेशन विकल्प,
`shutdownGracePeriod` और `shutdownGracePeriodCriticalPods`, शून्य पर सेट होते हैं;
इसलिए सुचारु नोड शटडाउन कार्यक्षमता सक्रिय नहीं होती।
इस सुविधा को सक्रिय करने के लिए, दोनों विकल्पों को उपयुक्त रूप से कॉन्फ़िगर करके
non-zero मान पर सेट करना चाहिए।

जब kubelet को नोड शटडाउन की सूचना मिलती है, तब वह Node पर `NotReady` condition सेट करता है,
जिसका `reason` "node is shutting down" होता है। kube-scheduler इस condition का सम्मान करता है
और प्रभावित नोड पर कोई Pods schedule नहीं करता; अन्य third-party schedulers से भी उसी तर्क का पालन
करने की अपेक्षा की जाती है। इसका अर्थ है कि उस नोड पर नए Pods schedule नहीं होंगे और इसलिए कोई भी आरंभ नहीं होगा।

यदि kubelet नोड शटडाउन का पता लगा चुका है, तो वह `PodAdmission` चरण में Pods को **अस्वीकार भी** करता है,
जिससे `node.kubernetes.io/not-ready:NoSchedule` के लिए
{{< glossary_tooltip text="toleration" term_id="toleration" >}} वाले Pods भी वहां आरंभ नहीं होते।

API के माध्यम से अपने Node पर वह condition सेट करते समय,
kubelet स्थानीय रूप से चल रहे सभी Pods को भी समाप्त करना शुरू कर देता है।

सुचारु शटडाउन के दौरान, kubelet Pods को दो चरणों में समाप्त करता है:

1. नोड पर चल रहे सामान्य Pods को समाप्त करें।
1. नोड पर चल रहे [critical Pods](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical)
   को समाप्त करें।

सुचारु नोड शटडाउन सुविधा को दो
[`KubeletConfiguration`](/docs/tasks/administer-cluster/kubelet-config-file/) विकल्पों से कॉन्फ़िगर किया जाता है:

- `shutdownGracePeriod`:

  वह कुल अवधि निर्दिष्ट करता है, जितने समय तक नोड को शटडाउन विलंबित करना चाहिए। यह सामान्य और
  [critical Pods](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical) दोनों के लिए Pod समाप्ति की
  कुल grace अवधि है।

- `shutdownGracePeriodCriticalPods`:

  नोड शटडाउन के दौरान [critical Pods](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical)
  को समाप्त करने के लिए उपयोग की जाने वाली अवधि निर्दिष्ट करता है। यह मान `shutdownGracePeriod` से कम होना चाहिए।

{{< note >}}

कभी-कभी सिस्टम द्वारा (या संभवतः किसी administrator द्वारा मैन्युअल रूप से) नोड का शटडाउन रद्द कर दिया जाता है।
ऐसी किसी भी स्थिति में Node वापस `Ready` स्थिति में आ जाएगा। हालांकि, जिन Pods ने समाप्ति प्रक्रिया
पहले ही शुरू कर दी है, उन्हें kubelet पुनर्स्थापित नहीं करेगा और उन्हें फिर से schedule करना होगा।

{{< /note >}}

उदाहरण के लिए, यदि `shutdownGracePeriod=30s` और
`shutdownGracePeriodCriticalPods=10s` है, तो kubelet नोड शटडाउन को 30 सेकंड तक विलंबित करेगा।
शटडाउन के दौरान, पहले 20 (30-10) सेकंड सामान्य Pods को सुचारु रूप से समाप्त करने के लिए आरक्षित होंगे,
और अंतिम 10 सेकंड [critical Pods](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical)
को समाप्त करने के लिए आरक्षित होंगे।

{{< note >}}
सुचारु नोड शटडाउन के दौरान जब Pods evict किए जाते हैं, तो उन्हें shutdown के रूप में चिह्नित किया जाता है।
`kubectl get pods` चलाने पर evict किए गए Pods की स्थिति `Terminated` दिखाई देती है।
और `kubectl describe pod` बताता है कि Pod को नोड शटडाउन के कारण evict किया गया था:

```
Reason:         Terminated
Message:        Pod was terminated in response to imminent node shutdown.
```

{{< /note >}}

### Pod Priority पर आधारित सुचारु नोड शटडाउन {#pod-priority-graceful-node-shutdown}

{{< feature-state feature_gate_name="GracefulNodeShutdownBasedOnPodPriority" >}}

शटडाउन के दौरान Pods के क्रम के संबंध में अधिक लचीलापन देने के लिए, यदि आपने इस सुविधा को
अपने क्लस्टर में सक्षम किया है, तो सुचारु नोड शटडाउन Pods के लिए PriorityClass का सम्मान करता है।
यह सुविधा क्लस्टर administrators को सुचारु नोड शटडाउन के दौरान Pods का क्रम स्पष्ट रूप से
[priority classes](/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass) के आधार पर
परिभाषित करने देती है।

ऊपर वर्णित [सुचारु नोड शटडाउन](#graceful-node-shutdown) सुविधा Pods को दो चरणों में बंद करती है:
पहले non-critical Pods, फिर critical Pods। यदि शटडाउन के दौरान Pods का क्रम अधिक सूक्ष्म तरीके से
स्पष्ट रूप से निर्धारित करने के लिए अतिरिक्त लचीलेपन की आवश्यकता है, तो Pod priority आधारित सुचारु
शटडाउन का उपयोग किया जा सकता है।

जब सुचारु नोड शटडाउन Pod priorities का सम्मान करता है, तो सुचारु नोड शटडाउन को कई चरणों में
करना संभव होता है, जहां प्रत्येक चरण किसी विशेष priority class के Pods को बंद करता है। kubelet को
सटीक चरणों और प्रत्येक चरण के शटडाउन समय के साथ कॉन्फ़िगर किया जा सकता है।

किसी क्लस्टर में निम्न कस्टम Pod
[priority classes](/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass) मानते हुए,

| Pod priority class नाम | Pod priority class मान |
| ----------------------- | ------------------------ |
| `custom-class-a`        | 100000                   |
| `custom-class-b`        | 10000                    |
| `custom-class-c`        | 1000                     |
| `regular/unset`         | 0                        |

[kubelet configuration](/docs/reference/config-api/kubelet-config.v1beta1/) में
`shutdownGracePeriodByPodPriority` की सेटिंग इस प्रकार हो सकती है:

| Pod priority class मान | शटडाउन अवधि |
| ------------------------ | --------------- |
| 100000                   | 10 सेकंड      |
| 10000                    | 180 सेकंड     |
| 1000                     | 120 सेकंड     |
| 0                        | 60 सेकंड      |

संबंधित kubelet config YAML कॉन्फ़िगरेशन यह होगा:

```yaml
shutdownGracePeriodByPodPriority:
  - priority: 100000
    shutdownGracePeriodSeconds: 10
  - priority: 10000
    shutdownGracePeriodSeconds: 180
  - priority: 1000
    shutdownGracePeriodSeconds: 120
  - priority: 0
    shutdownGracePeriodSeconds: 60
```

ऊपर दी गई तालिका का अर्थ है कि `priority` मान >= 100000 वाले किसी भी Pod को बंद होने के लिए
केवल 10 सेकंड मिलेंगे, >= 10000 और < 100000 मान वाले किसी भी Pod को 180 सेकंड मिलेंगे,
और >= 1000 तथा < 10000 मान वाले किसी भी Pod को 120 सेकंड मिलेंगे।
अंत में, अन्य सभी Pods को बंद होने के लिए 60 सेकंड मिलेंगे।

सभी classes के अनुरूप मान देना आवश्यक नहीं है। उदाहरण के लिए, आप इसके बजाय इन सेटिंग का उपयोग कर सकते हैं:

| Pod priority class मान | शटडाउन अवधि |
| ------------------------ | --------------- |
| 100000                   | 300 सेकंड     |
| 1000                     | 120 सेकंड     |
| 0                        | 60 सेकंड      |

ऊपर के मामले में, `custom-class-b` वाले Pods शटडाउन के लिए `custom-class-c` के समान bucket में जाएंगे।

यदि किसी विशेष range में कोई Pods नहीं हैं, तो kubelet उस priority range के Pods की प्रतीक्षा नहीं करता।
इसके बजाय, kubelet तुरंत अगली priority class value range पर चला जाता है।

यदि यह सुविधा सक्षम है और कोई कॉन्फ़िगरेशन नहीं दिया गया है, तो क्रम से संबंधित कोई कार्रवाई नहीं की जाएगी।

इस सुविधा के उपयोग के लिए `GracefulNodeShutdownBasedOnPodPriority`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) को सक्षम करना और
[kubelet config](/docs/reference/config-api/kubelet-config.v1beta1/) में `ShutdownGracePeriodByPodPriority` को
Pod priority class मानों और उनकी संबंधित शटडाउन अवधियों वाले इच्छित कॉन्फ़िगरेशन पर सेट करना आवश्यक है।

{{< note >}}
सुचारु नोड शटडाउन के दौरान Pod priority को ध्यान में रखने की क्षमता को Kubernetes v1.23 में
Alpha सुविधा के रूप में पेश किया गया था। Kubernetes {{< skew currentVersion >}} में
यह सुविधा Beta है और डिफ़ॉल्ट रूप से सक्षम है।
{{< /note >}}

नोड शटडाउन की निगरानी के लिए kubelet subsystem के अंतर्गत metrics
`graceful_shutdown_start_time_seconds` और `graceful_shutdown_end_time_seconds` emit किए जाते हैं।

## असुचारु नोड शटडाउन को संभालना {#non-graceful-node-shutdown}

{{< feature-state feature_gate_name="NodeOutOfServiceVolumeDetach" >}}

नोड शटडाउन कार्रवाई का kubelet का Node Shutdown Manager पता नहीं लगा सकता, क्योंकि या तो कमांड
kubelet द्वारा उपयोग किए जाने वाले inhibitor locks mechanism को ट्रिगर नहीं करता है, या उपयोगकर्ता त्रुटि के कारण,
अर्थात ShutdownGracePeriod और ShutdownGracePeriodCriticalPods सही तरीके से कॉन्फ़िगर नहीं किए गए हैं।
अधिक जानकारी के लिए ऊपर का [सुचारु नोड शटडाउन](#graceful-node-shutdown) अनुभाग देखें।

जब नोड शटडाउन होता है, लेकिन kubelet का Node Shutdown Manager उसका पता नहीं लगाता, तब
{{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}} का हिस्सा Pods शटडाउन नोड पर
terminating स्थिति में अटक जाएंगे और नए चल रहे नोड पर नहीं जा पाएंगे। ऐसा इसलिए है क्योंकि शटडाउन नोड
पर kubelet Pods को हटाने के लिए उपलब्ध नहीं होता, इसलिए StatefulSet उसी नाम का नया Pod नहीं बना सकता।
यदि Pods volumes का उपयोग कर रहे हैं, तो मूल शटडाउन नोड से VolumeAttachments हटाए नहीं जाएंगे;
इसलिए इन Pods द्वारा उपयोग किए गए volumes नए चल रहे नोड से attach नहीं किए जा सकते। परिणामस्वरूप,
StatefulSet पर चल रहा application ठीक से काम नहीं कर सकता। यदि मूल शटडाउन नोड फिर से चालू होता है,
तो kubelet Pods को हटा देगा और नए Pods किसी दूसरे चल रहे नोड पर बनाए जाएंगे। यदि मूल शटडाउन नोड
फिर से चालू नहीं होता, तो ये Pods शटडाउन नोड पर हमेशा terminating स्थिति में अटके रहेंगे।

उपरोक्त स्थिति को कम करने के लिए, उपयोगकर्ता Node को out-of-service चिह्नित करते हुए उसमें
`node.kubernetes.io/out-of-service` taint को `NoExecute` या `NoSchedule` effect के साथ मैन्युअल रूप से जोड़ सकता है।
यदि इस taint के साथ Node को out-of-service चिह्नित किया जाता है, तो नोड पर मौजूद Pods को forcefully हटाया जाएगा
यदि उन पर matching tolerations नहीं हैं, और नोड पर समाप्त हो रहे Pods के लिए volume detach कार्रवाइयां तुरंत होंगी।
इससे out-of-service नोड के Pods किसी दूसरे नोड पर शीघ्रता से recover कर सकते हैं।

असुचारु शटडाउन के दौरान, Pods को दो चरणों में समाप्त किया जाता है:

1. उन Pods को force delete करें जिनके पास matching `out-of-service` tolerations नहीं हैं।
1. ऐसे Pods के लिए तुरंत detach volume कार्रवाई करें।

{{< note >}}

- `node.kubernetes.io/out-of-service` taint जोड़ने से पहले, यह सत्यापित करना चाहिए कि नोड पहले ही
  शटडाउन या power off स्थिति में है (पुनः आरंभ होने के बीच में नहीं)।
- Pods के नए नोड पर जाने के बाद और उपयोगकर्ता के यह जांचने के बाद कि शटडाउन नोड recover हो गया है,
  उपयोगकर्ता को out-of-service taint मैन्युअल रूप से हटाना आवश्यक है, क्योंकि मूल रूप से taint उसी ने जोड़ा था।

{{< /note >}}

### समय-सीमा समाप्त होने पर बाध्य storage detach {#storage-force-detach-on-timeout}

किसी भी ऐसी स्थिति में जहां Pod हटाना 6 मिनट तक सफल नहीं हुआ है, यदि उस समय नोड अस्वस्थ है, तो Kubernetes
unmount हो रहे volumes को force detach करेगा। force-detached volume का उपयोग कर रहा और नोड पर अब भी चल रहा कोई भी
वर्कलोड
[CSI specification](https://github.com/container-storage-interface/spec/blob/master/spec.md#controllerunpublishvolume) का उल्लंघन करेगा,
जो बताता है कि `ControllerUnpublishVolume` को "**must**" तब कॉल किया जाना चाहिए, जब volume पर सभी
`NodeUnstageVolume` और `NodeUnpublishVolume` कॉल किए जा चुके हों और सफल हुए हों।
ऐसी परिस्थितियों में, संबंधित नोड के volumes में डेटा भ्रष्टाचार हो सकता है।

बाध्य storage detach व्यवहार वैकल्पिक है; उपयोगकर्ता इसके बजाय "असुचारु नोड शटडाउन" सुविधा का उपयोग कर सकते हैं।

समय-सीमा समाप्त होने पर force storage detach को `kube-controller-manager` में
`disable-force-detach-on-timeout` config field सेट करके निष्क्रिय किया जा सकता है। समय-सीमा समाप्त होने पर
force detach सुविधा को निष्क्रिय करने का अर्थ है कि 6 मिनट से अधिक समय तक अस्वस्थ नोड पर होस्ट किए गए volume का
संबद्ध
[VolumeAttachment](/docs/reference/kubernetes-api/config-and-storage-resources/volume-attachment-v1/) हटाया नहीं जाएगा।

यह सेटिंग लागू होने के बाद, volumes से जुड़े हुए अस्वस्थ Pods को अभी भी ऊपर बताई गई
[असुचारु नोड शटडाउन](#non-graceful-node-shutdown) प्रक्रिया द्वारा recover करना होगा।

{{< note >}}

- [असुचारु नोड शटडाउन](#non-graceful-node-shutdown) प्रक्रिया का उपयोग करते समय सावधानी बरतनी चाहिए।
- ऊपर दस्तावेज़ित चरणों से भटकने पर डेटा भ्रष्टाचार हो सकता है।

{{< /note >}}

## {{% heading "whatsnext" %}}

निम्न के बारे में और जानें:

- ब्लॉग: [असुचारु नोड शटडाउन](/blog/2023/08/16/kubernetes-1-28-non-graceful-node-shutdown-ga/)।
- क्लस्टर आर्किटेक्चर: [नोड्स](/docs/concepts/architecture/nodes/).
