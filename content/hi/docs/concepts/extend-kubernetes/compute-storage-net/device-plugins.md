---
title: डिवाइस प्लगइन
description: >
  डिवाइस प्लगइन आपको उन डिवाइस या रिसोर्स के समर्थन के साथ अपने क्लस्टर को कॉन्फ़िगर करने देते हैं
  जिन्हें वेंडर-विशिष्ट सेटअप की आवश्यकता होती है, जैसे GPU, NIC, FPGA, या non-volatile मेन मेमोरी।
content_type: concept
weight: 20
---

<!-- overview -->
{{< feature-state for_k8s_version="v1.26" state="stable" >}}

कुबरनेट्स एक डिवाइस प्लगइन फ़्रेमवर्क प्रदान करता है जिसका उपयोग आप सिस्टम हार्डवेयर रिसोर्स को
{{< glossary_tooltip term_id="kubelet" >}} के लिए उजागर करने के लिए कर सकते हैं।

खुद कुबरनेट्स के कोड को अनुकूलित करने के बजाय, वेंडर एक डिवाइस प्लगइन लागू कर सकते हैं जिसे आप
मैन्युअल रूप से या {{< glossary_tooltip term_id="daemonset" >}} के रूप में डिप्लॉय करते हैं। टारगेट
किए गए डिवाइस में GPU, हाई-परफ़ॉर्मेंस NIC, FPGA, InfiniBand एडाप्टर, और अन्य समान कंप्यूटिंग रिसोर्स
शामिल हैं जिन्हें वेंडर-विशिष्ट इनिशियलाइज़ेशन और सेटअप की आवश्यकता हो सकती है।

<!-- body -->

## डिवाइस प्लगइन रजिस्ट्रेशन

kubelet एक `Registration` gRPC सेवा एक्सपोर्ट करता है:

```gRPC
service Registration {
	rpc Register(RegisterRequest) returns (Empty) {}
}
```

एक डिवाइस प्लगइन इस gRPC सेवा के माध्यम से kubelet के साथ स्वयं को पंजीकृत कर सकता है। रजिस्ट्रेशन के
दौरान, डिवाइस प्लगइन को यह भेजना होता है:

* इसके Unix सॉकेट का नाम।
* वह Device Plugin API वर्शन जिसके लिए इसे बनाया गया है।
* वह `ResourceName` जिसे यह उजागर करना चाहता है। यहाँ `ResourceName` को
  [एक्सटेंडेड रिसोर्स नेमिंग स्कीम](/docs/concepts/configuration/manage-resources-containers/#extended-resources)
  का पालन करते हुए `vendor-domain/resourcetype` के रूप में होना चाहिए।
  (उदाहरण के लिए, एक NVIDIA GPU को `nvidia.com/gpu` के रूप में उजागर किया जाता है।)

सफल रजिस्ट्रेशन के बाद, डिवाइस प्लगइन kubelet को उन डिवाइस की सूची भेजता है जिन्हें यह प्रबंधित करता है,
और उसके बाद kubelet, नोड स्टेटस अपडेट के हिस्से के रूप में उन रिसोर्स को API सर्वर पर उजागर करने
की ज़िम्मेदारी लेता है। उदाहरण के लिए, किसी डिवाइस प्लगइन द्वारा kubelet के साथ
`hardware-vendor.example/foo` पंजीकृत करने और किसी नोड पर दो हेल्दी डिवाइस की सूचना देने के बाद, नोड
स्टेटस को यह उजागर करने के लिए अपडेट किया जाता है कि नोड पर 2 "Foo" डिवाइस इंस्टॉल्ड और उपलब्ध हैं।

फिर, यूज़र किसी Pod स्पेसिफ़िकेशन के हिस्से के रूप में डिवाइस का अनुरोध कर सकते हैं (देखें
[`container`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container))।
एक्सटेंडेड रिसोर्स का अनुरोध करना अन्य रिसोर्स के लिए अनुरोध और लिमिट प्रबंधित करने जैसा ही है, इन
अंतरों के साथ:
* एक्सटेंडेड रिसोर्स केवल इंटीजर रिसोर्स के रूप में समर्थित हैं और इन्हें ओवरकमिट नहीं किया जा सकता।
* डिवाइस को कंटेनरों के बीच शेयर नहीं किया जा सकता।

### उदाहरण {#example-pod}

मान लीजिए कोई कुबरनेट्स क्लस्टर एक ऐसा डिवाइस प्लगइन चला रहा है जो कुछ नोड पर `hardware-vendor.example/foo`
रिसोर्स को उजागर करता है। यहाँ एक डेमो वर्कलोड चलाने के लिए इस रिसोर्स का अनुरोध करने वाले पॉड का
उदाहरण है:

```yaml
---
apiVersion: v1
kind: Pod
metadata:
  name: demo-pod
spec:
  containers:
    - name: demo-container-1
      image: registry.k8s.io/pause:3.8
      resources:
        limits:
          hardware-vendor.example/foo: 2
#
# This Pod needs 2 of the hardware-vendor.example/foo devices
# and can only schedule onto a Node that's able to satisfy
# that need.
#
# If the Node has more than 2 of those devices available, the
# remainder would be available for other Pods to use.
```

## डिवाइस प्लगइन कार्यान्वयन

किसी डिवाइस प्लगइन के सामान्य वर्कफ़्लो में ये चरण शामिल हैं:

1. इनिशियलाइज़ेशन। इस फ़ेज़ के दौरान, डिवाइस प्लगइन यह सुनिश्चित करने के लिए वेंडर-विशिष्ट
   इनिशियलाइज़ेशन और सेटअप करता है कि डिवाइस रेडी स्टेट में हैं।

1. प्लगइन एक gRPC सेवा शुरू करता है, जिसमें होस्ट पाथ `/var/lib/kubelet/device-plugins/` के अंतर्गत
   एक Unix सॉकेट होता है (यह पाथ हार्डकोडेड है और kubelet के `--root-dir` या किसी अन्य कॉन्फ़िगरेशन
   से प्रभावित नहीं होता), और यह निम्न इंटरफ़ेस लागू करता है:

   ```gRPC
   service DevicePlugin {
         // GetDevicePluginOptions returns options to be communicated with Device Manager.
         rpc GetDevicePluginOptions(Empty) returns (DevicePluginOptions) {}

         // ListAndWatch returns a stream of List of Devices
         // Whenever a Device state change or a Device disappears, ListAndWatch
         // returns the new list
         rpc ListAndWatch(Empty) returns (stream ListAndWatchResponse) {}

         // Allocate is called during container creation so that the Device
         // Plugin can run device specific operations and instruct Kubelet
         // of the steps to make the Device available in the container
         rpc Allocate(AllocateRequest) returns (AllocateResponse) {}

         // GetPreferredAllocation returns a preferred set of devices to allocate
         // from a list of available ones. The resulting preferred allocation is not
         // guaranteed to be the allocation ultimately performed by the
         // devicemanager. It is only designed to help the devicemanager make a more
         // informed allocation decision when possible.
         rpc GetPreferredAllocation(PreferredAllocationRequest) returns (PreferredAllocationResponse) {}

         // PreStartContainer is called, if indicated by Device Plugin during registration phase,
         // before each container start. Device plugin can run device specific operations
         // such as resetting the device before making devices available to the container.
         rpc PreStartContainer(PreStartContainerRequest) returns (PreStartContainerResponse) {}
   }
   ```

   {{< note >}}
   प्लगइन के लिए `GetPreferredAllocation()` या `PreStartContainer()` का उपयोगी कार्यान्वयन देना
   आवश्यक नहीं है। इन कॉल की उपलब्धता बताने वाले फ़्लैग, अगर कोई हैं, को `GetDevicePluginOptions()` की
   कॉल द्वारा वापस भेजे जाने वाले `DevicePluginOptions` मैसेज में सेट किया जाना चाहिए। `kubelet` सीधे
   इनमें से किसी को भी कॉल करने से पहले, यह देखने के लिए हमेशा `GetDevicePluginOptions()` को कॉल
   करेगा कि कौन से ऑप्शनल फ़ंक्शन उपलब्ध हैं।
   {{< /note >}}

1. प्लगइन होस्ट पाथ `/var/lib/kubelet/device-plugins/kubelet.sock` पर मौजूद Unix सॉकेट के माध्यम से
   kubelet के साथ स्वयं को पंजीकृत करता है।

   {{< note >}}
   वर्कफ़्लो का क्रम महत्वपूर्ण है। सफल रजिस्ट्रेशन के लिए किसी प्लगइन को kubelet के साथ स्वयं को
   पंजीकृत करने से पहले gRPC सेवा को प्रदान करना शुरू करना ज़रूरी है।
   {{< /note >}}

1. स्वयं को सफलतापूर्वक पंजीकृत करने के बाद, डिवाइस प्लगइन सर्विंग मोड में चलता है, जिसके दौरान यह
   डिवाइस की हेल्थ की निगरानी करता रहता है और किसी भी डिवाइस स्टेटस बदलाव पर kubelet को सूचित करता है।
   यह `Allocate` gRPC अनुरोध को पूरा करने के लिए भी जिम्मेदार है। `Allocate` के दौरान, डिवाइस
   प्लगइन डिवाइस-विशिष्ट तैयारी कर सकता है; उदाहरण के लिए, GPU क्लीनअप या QRNG इनिशियलाइज़ेशन। अगर
   ऑपरेशन सफल होते हैं, तो डिवाइस प्लगइन एक `AllocateResponse` लौटाता है जिसमें एलोकेटेड डिवाइस तक
   पहुँचने के लिए कंटेनर रनटाइम कॉन्फ़िगरेशन होते हैं। kubelet यह जानकारी कंटेनर रनटाइम को भेजता है।

   एक `AllocateResponse` में शून्य या अधिक `ContainerAllocateResponse` ऑब्जेक्ट होते हैं। इनमें,
   डिवाइस प्लगइन उन बदलावों को परिभाषित करता है जो डिवाइस तक पहुँच देने के लिए किसी कंटेनर की
   डेफ़िनिशन में करने आवश्यक हैं। इन बदलावों में शामिल हैं:

   * [एनोटेशन](/docs/concepts/overview/working-with-objects/annotations/)
   * डिवाइस नोड
   * एनवायरनमेंट वेरिएबल
   * माउंट
   * फ़ुली-क्वालिफ़ाइड CDI डिवाइस नाम

   {{< note >}}
   फ़ुली-क्वालिफ़ाइड CDI डिवाइस नामों को Device Manager द्वारा संसाधित करने के लिए यह आवश्यक है कि
   `DevicePluginCDIDevices` [फ़ीचर गेट](/docs/reference/command-line-tools-reference/feature-gates/)
   kubelet और kube-apiserver, दोनों के लिए एनेबल्ड हो। इसे कुबरनेट्स v1.28 में अल्फ़ा फ़ीचर के रूप में
   जोड़ा गया था, v1.29 में बीटा में और v1.31 में GA में अपग्रेड किया गया।
   {{< /note >}}

### kubelet रीस्टार्ट को संभालना

एक डिवाइस प्लगइन से यह अपेक्षा की जाती है कि वह kubelet रीस्टार्ट का पता लगाए और नए kubelet इंस्टेंस
के साथ स्वयं को फिर से पंजीकृत करे। जब कोई नया kubelet इंस्टेंस शुरू होता है, तो यह
`/var/lib/kubelet/device-plugins` (डिवाइस प्लगइन के लिए हार्डकोडेड पाथ) के अंतर्गत मौजूद सभी Unix
सॉकेट को हटा देता है। एक डिवाइस प्लगइन अपने Unix सॉकेट के हटाए जाने की निगरानी कर सकता है और ऐसे इवेंट
पर स्वयं को फिर से पंजीकृत कर सकता है।

### डिवाइस प्लगइन और अनहेल्दी डिवाइस {#device-plugin-and-unhealthy-devices}

कुछ मामलों में डिवाइस फ़ेल हो जाते हैं या शट डाउन हो जाते हैं। इस स्थिति में Device Plugin की
ज़िम्मेदारी है कि वह `ListAndWatchResponse` API का उपयोग करके kubelet को इस स्थिति के बारे में सूचित
करे।

एक बार जब किसी डिवाइस को अनहेल्दी के रूप में मार्क किया जाता है, तो kubelet नोड पर उस रिसोर्स के लिए
एलोकेटेबल काउंट को कम कर देगा, यह दर्शाने के लिए कि नए पॉड को शेड्यूल करने के लिए कितने डिवाइस का
उपयोग किया जा सकता है। रिसोर्स के लिए कैपेसिटी काउंट नहीं बदलेगा।

जो पॉड फ़ेल हो गए डिवाइस को निर्दिष्ट किए गए थे, वे इस डिवाइस को निर्दिष्ट रहेंगे। यह सामान्य बात है कि डिवाइस
पर निर्भर कोड फ़ेल होने लगेगा और अगर पॉड के लिए `restartPolicy` `Always` नहीं था तो पॉड Failed फ़ेज़ में
जा सकता है, अन्यथा क्रैश लूप में चला जाएगा।

कुबरनेट्स v1.31 से पहले, यह जानने का तरीका कि कोई पॉड फ़ेल हो गए डिवाइस से जुड़ा है या नहीं,
[PodResources API](#monitoring-device-plugin-resources) का उपयोग करना था।

{{< feature-state feature_gate_name="ResourceHealthStatus" >}}

जब `ResourceHealthStatus` फ़ीचर गेट एनेबल्ड होता है (v1.36 से बीटा में और डिफ़ॉल्ट रूप से एनेबल्ड),
तो `allocatedResourcesStatus` फ़ील्ड हर पॉड के `.status` के भीतर, हर कंटेनर स्टेटस में जोड़ी जाती है।
`allocatedResourcesStatus` फ़ील्ड कंटेनर को निर्दिष्ट किए गए हर डिवाइस के लिए हेल्थ जानकारी की सूचना देती
है। हर रिसोर्स हेल्थ एंट्री में एक ऑप्शनल `message` फ़ील्ड शामिल हो सकती है जिसमें हेल्थ स्टेटस के बारे
में अतिरिक्त, इंसानों के पढ़ने योग्य संदर्भ हो, जैसे एरर विवरण या फ़ेल्योर के कारण।

किसी फ़ेल्ड पॉड के लिए, या जहाँ आपको किसी फ़ॉल्ट का संदेह हो, आप यह समझने के लिए इस स्टेटस का उपयोग कर
सकते हैं कि पॉड का व्यवहार डिवाइस फ़ेल्योर से जुड़ा हो सकता है या नहीं। उदाहरण के लिए, अगर कोई
एक्सेलेरेटर ओवर-टेम्परेचर इवेंट की सूचना दे रहा है, तो `allocatedResourcesStatus` फ़ील्ड इसे सूचित कर
सकती है।


## डिवाइस प्लगइन डिप्लॉयमेंट

आप किसी डिवाइस प्लगइन को DaemonSet के रूप में, अपने नोड के ऑपरेटिंग सिस्टम के लिए एक पैकेज के रूप में,
या मैन्युअल रूप से डिप्लॉय कर सकते हैं।

कैनोनिकल डायरेक्टरी `/var/lib/kubelet/device-plugins` (जो kubelet पर हार्डकोडेड है) को प्रिविलेज्ड
एक्सेस की आवश्यकता होती है, इसलिए डिवाइस प्लगइन को प्रिविलेज्ड सिक्योरिटी कॉन्टेक्स्ट में चलना चाहिए।
अगर आप किसी डिवाइस प्लगइन को DaemonSet के रूप में डिप्लॉय कर रहे हैं, तो `/var/lib/kubelet/device-plugins`
को प्लगइन के [PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)
में एक {{< glossary_tooltip term_id="volume" >}} के रूप में माउंट किया जाना चाहिए।

अगर आप DaemonSet तरीका चुनते हैं तो आप कुबरनेट्स पर निर्भर रह सकते हैं: डिवाइस प्लगइन के पॉड को नोड पर
रखने के लिए, फ़ेल्योर के बाद डेमन पॉड को रीस्टार्ट करने के लिए, और अपग्रेड को स्वचालित करने में मदद करने
के लिए।

## API कॉम्पेटिबिलिटी {#api-compatibility}

पहले, वर्शनिंग स्कीम के लिए Device Plugin के API वर्शन का Kubelet के वर्शन से पूरी तरह मेल खाना
आवश्यक था। v1.12 में इस फ़ीचर के बीटा में अपग्रेड होने के बाद से यह अब एक सख़्त आवश्यकता नहीं है। यह
API वर्शन्ड है और इस फ़ीचर के बीटा में अपग्रेड होने के बाद से स्टेबल रहा है। इसके कारण, kubelet अपग्रेड
सहज होने चाहिए लेकिन स्टेबिलाइज़ेशन से पहले API में बदलाव हो सकते हैं जिससे अपग्रेड का non-breaking
होना गारंटीड नहीं है।

{{< note >}}
हालाँकि कुबरनेट्स का Device Manager कॉम्पोनेंट एक सामान्य रूप से उपलब्ध (generally available) फ़ीचर
है, _डिवाइस प्लगइन API_ स्टेबल नहीं है। डिवाइस प्लगइन API और वर्शन कॉम्पेटिबिलिटी की जानकारी के लिए,
पढ़ें [डिवाइस प्लगइन API वर्शन](/docs/reference/node/device-plugin-api-versions/)।
{{< /note >}}

एक प्रोजेक्ट के रूप में, कुबरनेट्स डिवाइस प्लगइन डेवलपर को यह सुझाव देता है कि वे:

* भविष्य के रिलीज़ में Device Plugin API में होने वाले बदलावों पर नज़र रखें।
* बैकवर्ड/फ़ॉरवर्ड कॉम्पेटिबिलिटी के लिए डिवाइस प्लगइन API के कई वर्शन का समर्थन करें।

ऐसे नोड पर डिवाइस प्लगइन चलाने के लिए जिन्हें एक नए डिवाइस प्लगइन API वर्शन वाले कुबरनेट्स रिलीज़ में
अपग्रेड करना है, इन नोड को अपग्रेड करने से पहले अपने डिवाइस प्लगइन को दोनों वर्शन का समर्थन करने के लिए
अपग्रेड करें। यह तरीका अपनाने से अपग्रेड के दौरान डिवाइस एलोकेशन का निरंतर काम करना सुनिश्चित होगा।

## डिवाइस प्लगइन रिसोर्स की निगरानी {#monitoring-device-plugin-resources}

{{< feature-state for_k8s_version="v1.28" state="stable" >}}

डिवाइस प्लगइन द्वारा प्रदान किए गए रिसोर्स की निगरानी करने के लिए, निगरानी एजेंट को नोड पर उपयोग हो
रहे डिवाइस के सेट का पता लगाने और यह बताने वाला मेटाडेटा प्राप्त करने में सक्षम होना चाहिए कि मेट्रिक
किस कंटेनर से जुड़ा होना चाहिए। डिवाइस निगरानी एजेंट द्वारा उजागर किए गए
[Prometheus](https://prometheus.io/) मेट्रिक को
[कुबरनेट्स इंस्ट्रुमेंटेशन गाइडलाइन](https://github.com/kubernetes/community/blob/main/contributors/devel/sig-instrumentation/metric-instrumentation.md)
का पालन करना चाहिए, और `pod`, `namespace`, और `container` prometheus लेबल का उपयोग करके कंटेनरों की
पहचान करनी चाहिए।

kubelet एक gRPC सेवा प्रदान करता है जो उपयोग हो रहे डिवाइस की खोज को सक्षम बनाती है, और इन डिवाइस के
लिए मेटाडेटा प्रदान करती है:

```gRPC
// PodResourcesLister is a service provided by the kubelet that provides information about the
// node resources consumed by pods and containers on the node
service PodResourcesLister {
    rpc List(ListPodResourcesRequest) returns (ListPodResourcesResponse) {}
    rpc GetAllocatableResources(AllocatableResourcesRequest) returns (AllocatableResourcesResponse) {}
    rpc Get(GetPodResourcesRequest) returns (GetPodResourcesResponse) {}
}
```

### `List` gRPC एंडपॉइंट {#grpc-endpoint-list}

`List` एंडपॉइंट चल रहे पॉड के रिसोर्स की जानकारी प्रदान करता है, जिसमें एक्सक्लूसिव रूप से एलोकेटेड
CPU की id, डिवाइस प्लगइन द्वारा बताई गई डिवाइस id, और जिन डिवाइस को एलोकेट किया गया है उस NUMA
नोड की id जैसे विवरण शामिल हैं। साथ ही, NUMA-आधारित मशीनों के लिए, इसमें किसी कंटेनर के लिए रिज़र्व
की गई मेमोरी और hugepages की जानकारी भी शामिल होती है।

कुबरनेट्स v1.27 से, `List` एंडपॉइंट `DynamicResourceAllocation` API द्वारा `ResourceClaims` में
एलोकेटेड चल रहे पॉड के रिसोर्स की जानकारी प्रदान कर सकता है। कुबरनेट्स v1.34 से, यह फ़ीचर डिफ़ॉल्ट रूप
से एनेबल्ड है।


```gRPC
// ListPodResourcesResponse is the response returned by List function
message ListPodResourcesResponse {
    repeated PodResources pod_resources = 1;
}

// PodResources contains information about the node resources assigned to a pod
message PodResources {
    string name = 1;
    string namespace = 2;
    repeated ContainerResources containers = 3;
}

// ContainerResources contains information about the resources assigned to a container
message ContainerResources {
    string name = 1;
    repeated ContainerDevices devices = 2;
    repeated int64 cpu_ids = 3;
    repeated ContainerMemory memory = 4;
    repeated DynamicResource dynamic_resources = 5;
}

// ContainerMemory contains information about memory and hugepages assigned to a container
message ContainerMemory {
    string memory_type = 1;
    uint64 size = 2;
    TopologyInfo topology = 3;
}

// Topology describes hardware topology of the resource
message TopologyInfo {
        repeated NUMANode nodes = 1;
}

// NUMA representation of NUMA node
message NUMANode {
        int64 ID = 1;
}

// ContainerDevices contains information about the devices assigned to a container
message ContainerDevices {
    string resource_name = 1;
    repeated string device_ids = 2;
    TopologyInfo topology = 3;
}

// DynamicResource contains information about the devices assigned to a container by Dynamic Resource Allocation
message DynamicResource {
    string class_name = 1;
    string claim_name = 2;
    string claim_namespace = 3;
    repeated ClaimResource claim_resources = 4;
}

// ClaimResource contains per-plugin resource information
message ClaimResource {
    repeated CDIDevice cdi_devices = 1 [(gogoproto.customname) = "CDIDevices"];
}

// CDIDevice specifies a CDI device information
message CDIDevice {
    // Fully qualified CDI device name
    // for example: vendor.com/gpu=gpudevice1
    // see more details in the CDI specification:
    // https://github.com/container-orchestrated-devices/container-device-interface/blob/main/SPEC.md
    string name = 1;
}
```
{{< note >}}
`List` एंडपॉइंट में `ContainerResources` में cpu_ids किसी खास कंटेनर को एलोकेटेड एक्सक्लूसिव CPU के
अनुरूप होते हैं। अगर लक्ष्य शेयर्ड पूल से संबंधित CPU का मूल्यांकन करना है, तो `List` एंडपॉइंट का
उपयोग `GetAllocatableResources` एंडपॉइंट के साथ मिलकर, नीचे बताए अनुसार करना होगा:
1. सभी एलोकेटेबल CPU की सूची पाने के लिए `GetAllocatableResources` को कॉल करें
2. सिस्टम में सभी `ContainerResources` पर `GetCpuIds` को कॉल करें
3. `GetAllocatableResources` कॉल से `GetCpuIds` कॉल के सभी CPU को घटाएँ
{{< /note >}}

### `GetAllocatableResources` gRPC एंडपॉइंट {#grpc-endpoint-getallocatableresources}

{{< feature-state state="stable" for_k8s_version="v1.28" >}}

GetAllocatableResources वर्कर नोड पर शुरुआत में उपलब्ध रिसोर्स की जानकारी प्रदान करता है। यह kubelet
द्वारा APIServer को एक्सपोर्ट की जाने वाली जानकारी से अधिक जानकारी प्रदान करता है।

{{< note >}}
`GetAllocatableResources` का उपयोग केवल किसी नोड पर
[एलोकेटेबल](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable) रिसोर्स का
मूल्यांकन करने के लिए किया जाना चाहिए। अगर लक्ष्य फ़्री/अनएलोकेटेड रिसोर्स का मूल्यांकन करना है, तो
इसे List() एंडपॉइंट के साथ मिलकर उपयोग किया जाना चाहिए। `GetAllocatableResources` से मिला परिणाम,
kubelet को उजागर किए जा रहे अंतर्निहित रिसोर्स में बदलाव न होने तक, वही रहेगा। ऐसा शायद ही कभी होता
है, लेकिन जब होता है (उदाहरण के लिए: hotplug/hotunplug, डिवाइस हेल्थ में बदलाव), तो क्लाइंट से
`GetAllocatableResources` एंडपॉइंट को कॉल करने की अपेक्षा की जाती है।

हालाँकि, cpu और/या मेमोरी अपडेट की स्थिति में केवल `GetAllocatableResources` एंडपॉइंट को कॉल करना
पर्याप्त नहीं है और सही रिसोर्स कैपेसिटी और एलोकेटेबल को दर्शाने के लिए Kubelet को रीस्टार्ट करना
आवश्यक है।
{{< /note >}}

```gRPC
// AllocatableResourcesResponses contains information about all the devices known by the kubelet
message AllocatableResourcesResponse {
    repeated ContainerDevices devices = 1;
    repeated int64 cpu_ids = 2;
    repeated ContainerMemory memory = 3;
}
```

`ContainerDevices` टोपोलॉजी जानकारी उजागर करते हैं जो यह बताती है कि डिवाइस किस NUMA सेल से जुड़ा है।
NUMA सेल की पहचान एक ऑपेक इंटीजर ID का उपयोग करके की जाती है, जिसकी वैल्यू उससे मेल खाती है जो डिवाइस
प्लगइन
[kubelet के साथ स्वयं को पंजीकृत करते समय](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#device-plugin-integration-with-the-topology-manager)
बताते हैं।

gRPC सेवा को kubelet की रूट डायरेक्टरी के भीतर `pod-resources/kubelet.sock` पर एक unix सॉकेट के
माध्यम से प्रदान की जाती है (आमतौर पर `/var/lib/kubelet/pod-resources/kubelet.sock`)। डिवाइस प्लगइन
रिसोर्स के लिए निगरानी एजेंट को एक डेमन के रूप में, या DaemonSet के रूप में डिप्लॉय किया जा सकता है।
kubelet रूट डायरेक्टरी के अंतर्गत कैनोनिकल डायरेक्टरी `pod-resources` (आमतौर पर
`/var/lib/kubelet/pod-resources`) को प्रिविलेज्ड एक्सेस की आवश्यकता होती है, इसलिए निगरानी एजेंट को
प्रिविलेज्ड सिक्योरिटी कॉन्टेक्स्ट में चलना चाहिए। अगर कोई डिवाइस निगरानी एजेंट DaemonSet के रूप में
चल रहा है, तो `pod-resources` डायरेक्टरी को डिवाइस निगरानी एजेंट के
[PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core) में एक
{{< glossary_tooltip term_id="volume" >}} के रूप में माउंट किया जाना चाहिए।

{{< note >}}

जब किसी DaemonSet या होस्ट पर कंटेनर के रूप में डिप्लॉय किए गए किसी अन्य ऐप से `pod-resources/kubelet.sock`
को एक्सेस किया जाता है, जो सॉकेट को वॉल्यूम के रूप में माउंट कर रहा है, तो सॉकेट फ़ाइल के बजाय
`pod-resources` डायरेक्टरी को माउंट करना एक अच्छा तरीका है। इससे यह सुनिश्चित होगा कि kubelet रीस्टार्ट
के बाद, कंटेनर इस सॉकेट से फिर से कनेक्ट हो सकेगा।

एक सामान्य Linux नोड पर, इसका अर्थ है `/var/lib/kubelet/pod-resources/kubelet.sock` के बजाय
`/var/lib/kubelet/pod-resources/` को माउंट करना।

कंटेनर माउंट को सॉकेट या डायरेक्टरी को संदर्भित करने वाले inode द्वारा प्रबंधित किया जाता है, यह इस पर
निर्भर करता है कि क्या माउंट किया गया था। जब kubelet रीस्टार्ट होता है, तो सॉकेट हट जाता है और
एक नया सॉकेट बनाया जाता है, जबकि डायरेक्टरी अनछुई रहती है। इसलिए सॉकेट का मूल inode अनुपयोगी हो जाता
है। डायरेक्टरी का inode काम करता रहेगा।

{{< /note >}}

### `Get` gRPC एंडपॉइंट {#grpc-endpoint-get}

{{< feature-state state="beta" for_k8s_version="v1.34" >}}

`Get` एंडपॉइंट किसी चल रहे Pod के रिसोर्स की जानकारी प्रदान करता है। यह `List` एंडपॉइंट में बताई गई
जानकारी जैसी ही जानकारी उजागर करता है। `Get` एंडपॉइंट को चल रहे Pod के `PodName` और `PodNamespace`
की आवश्यकता होती है।

```gRPC
// GetPodResourcesRequest contains information about the pod
message GetPodResourcesRequest {
    string pod_name = 1;
    string pod_namespace = 2;
}
```

`Get` एंडपॉइंट dynamic resource allocation API द्वारा एलोकेटेड डायनामिक रिसोर्स से संबंधित Pod
जानकारी प्रदान कर सकता है। कुबरनेट्स v1.34 से, यह फ़ीचर डिफ़ॉल्ट रूप से एनेबल्ड है।

## Topology Manager के साथ डिवाइस प्लगइन एकीकरण {#device-plugin-integration-with-the-topology-manager}

{{< feature-state for_k8s_version="v1.27" state="stable" >}}

Topology Manager एक Kubelet कॉम्पोनेंट है जो रिसोर्स को टोपोलॉजी के अनुसार समन्वित करने की अनुमति देता
है। ऐसा करने के लिए, Device Plugin API को एक `TopologyInfo` स्ट्रक्ट शामिल करने के लिए विस्तारित किया
गया।

```gRPC
message TopologyInfo {
    repeated NUMANode nodes = 1;
}

message NUMANode {
    int64 ID = 1;
}
```

जो Device Plugin Topology Manager का लाभ लेना चाहते हैं, वे डिवाइस रजिस्ट्रेशन के हिस्से के रूप में,
डिवाइस ID और डिवाइस की हेल्थ के साथ, एक भरा हुआ TopologyInfo स्ट्रक्ट वापस भेज सकते हैं। इसके बाद
device manager इस जानकारी का उपयोग Topology Manager से सलाह लेने और रिसोर्स निर्धारण के निर्णय लेने
के लिए करता है।

`TopologyInfo` `nodes` फ़ील्ड को `nil` या NUMA नोड की सूची पर सेट करने का समर्थन देता है। इससे Device
Plugin ऐसे डिवाइस को उजागर कर सकता है जो कई NUMA नोड में फैला हो।

किसी दिए गए डिवाइस के लिए `TopologyInfo` को `nil` सेट करना या NUMA नोड की खाली सूची देना यह दर्शाता है
कि Device Plugin को उस डिवाइस के लिए कोई NUMA एफ़िनिटी प्रेफ़रेंस नहीं है।

Device Plugin द्वारा किसी डिवाइस के लिए भरे गए `TopologyInfo` स्ट्रक्ट का एक उदाहरण:

```
pluginapi.Device{ID: "25102017", Health: pluginapi.Healthy, Topology:&pluginapi.TopologyInfo{Nodes: []*pluginapi.NUMANode{&pluginapi.NUMANode{ID: 0,},}}}
```

## डिवाइस प्लगइन के उदाहरण {#examples}

{{% thirdparty-content %}}

डिवाइस प्लगइन कार्यान्वयन के कुछ उदाहरण यहाँ दिए गए हैं:

* [Akri](https://github.com/project-akri/akri), जो आपको हेटरोजीनियस लीफ़ डिवाइस (जैसे IP कैमरा और USB डिवाइस) को आसानी से उजागर करने देता है।
* [AMD GPU डिवाइस प्लगइन](https://github.com/ROCm/k8s-device-plugin)
* सामान्य Linux डिवाइस और USB डिवाइस के लिए [जेनेरिक डिवाइस प्लगइन](https://github.com/squat/generic-device-plugin)
* हेटरोजीनियस AI कंप्यूटिंग वर्चुअलाइज़ेशन मिडलवेयर के लिए [HAMi](https://github.com/Project-HAMi/HAMi) (उदाहरण के लिए, NVIDIA, Cambricon, Hygon, Iluvatar, MThreads, Ascend, Metax)
* Intel GPU, FPGA, QAT, VPU, SGX, DSA, DLB और IAA डिवाइस के लिए
  [Intel डिवाइस प्लगइन](https://github.com/intel/intel-device-plugins-for-kubernetes)
* हार्डवेयर-असिस्टेड वर्चुअलाइज़ेशन के लिए [KubeVirt डिवाइस प्लगइन](https://github.com/kubevirt/kubernetes-device-plugins)
* NVIDIA GPU को उजागर करने और GPU हेल्थ की निगरानी करने के लिए NVIDIA का
  [NVIDIA GPU डिवाइस प्लगइन](https://github.com/NVIDIA/k8s-device-plugin), आधिकारिक डिवाइस प्लगइन
* [Container-Optimized OS के लिए NVIDIA GPU डिवाइस प्लगइन](https://github.com/GoogleCloudPlatform/container-engine-accelerators/tree/master/cmd/nvidia_gpu)
* [RDMA डिवाइस प्लगइन](https://github.com/hustcat/k8s-rdma-device-plugin)
* [SocketCAN डिवाइस प्लगइन](https://github.com/collabora/k8s-socketcan)
* [Solarflare डिवाइस प्लगइन](https://github.com/vikaschoudhary16/sfc-device-plugin)
* [SR-IOV नेटवर्क डिवाइस प्लगइन](https://github.com/intel/sriov-network-device-plugin)
* Xilinx FPGA डिवाइस के लिए [Xilinx FPGA डिवाइस प्लगइन](https://github.com/Xilinx/FPGA_as_a_Service/tree/master/k8s-device-plugin)

## {{% heading "whatsnext" %}}

* डिवाइस प्लगइन का उपयोग करके [GPU रिसोर्स को शेड्यूल करने](/docs/tasks/manage-gpus/scheduling-gpus/) के
  बारे में जानें
* किसी नोड पर [एक्सटेंडेड रिसोर्स उजागर करने](/docs/tasks/administer-cluster/extended-resource-node/) के
  बारे में जानें
* [Topology Manager](/docs/tasks/administer-cluster/topology-manager/) के बारे में जानें
* कुबरनेट्स के साथ
  [TLS ingress के लिए हार्डवेयर एक्सेलेरेशन](/blog/2019/04/24/hardware-accelerated-ssl/tls-termination-in-ingress-controllers-using-kubernetes-device-plugins-and-runtimeclass/)
  के उपयोग के बारे में पढ़ें
* [DRA द्वारा एक्सटेंडेड रिसोर्स एलोकेशन](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#extended-resource)
  के बारे में अधिक पढ़ें
