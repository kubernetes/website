---
reviewers:
- derekwaynecarr
title: हयूजपेजेज प्रबंधित करें
content_type: task
description: क्लस्टर में एक अनुसूचीशील संसाधन के रूप में हयूजपेजेज को कॉन्फ़िगर और प्रबंधित करें।
---

<!-- overview -->
{{< feature-state feature_gate_name="HugePages" >}}

Kubernetes पॉड में एप्लिकेशन द्वारा पूर्व-आवंटित हयूजपेजेज के आवंटन और उपभोग का समर्थन करता है। यह पेज बताता है कि उपयोगकर्ता हयूजपेजेज का उपयोग कैसे कर सकते हैं।

## {{% heading "prerequisites" %}}

नोड को अपनी हयूजपेज क्षमता की रिपोर्ट करने के लिए Kubernetes नोड्स को
[हयूजपेजेज पूर्व-आवंटित](https://www.kernel.org/doc/html/latest/admin-guide/mm/hugetlbpage.html)
करना होगा।

एक नोड कई आकारों के लिए हयूजपेजेज पूर्व-आवंटित कर सकता है, उदाहरण के लिए,
`/etc/default/grub` में निम्नलिखित पंक्ति 1 GiB के `2*1GiB` और 2 MiB के `512*2 MiB` पेज आवंटित करती है:

```
GRUB_CMDLINE_LINUX="hugepagesz=1G hugepages=2 hugepagesz=2M hugepages=512"
```

नोड्स स्वचालित रूप से सभी हयूजपेज संसाधनों को खोज लेंगे और अनुसूचीशील संसाधनों के रूप में रिपोर्ट करेंगे।

जब आप नोड का विवरण देखते हैं, तो आपको `Capacity` और `Allocatable` अनुभागों में निम्नलिखित के समान कुछ दिखाई देना चाहिए:

```
Capacity:
  cpu:                ...
  ephemeral-storage:  ...
  hugepages-1Gi:      2Gi
  hugepages-2Mi:      1Gi
  memory:             ...
  pods:               ...
Allocatable:
  cpu:                ...
  ephemeral-storage:  ...
  hugepages-1Gi:      2Gi
  hugepages-2Mi:      1Gi
  memory:             ...
  pods:               ...
```

{{< note >}}
गतिशील रूप से आवंटित पेजों (बूट के बाद) के लिए, नए आवंटनों को प्रतिबिंबित करने के लिए
क्यूबलेट को पुनः आरंभ करने की आवश्यकता होती है।
{{< /note >}}

<!-- steps -->

## API

हयूजपेजेज का उपभोग कंटेनर स्तर की संसाधन आवश्यकताओं के माध्यम से संसाधन नाम `hugepages-<size>` का उपयोग करके किया जा सकता है, जहां `<size>` किसी विशेष नोड पर समर्थित पूर्णांक मानों का उपयोग करने वाला सबसे कॉम्पैक्ट बाइनरी संकेतन है। उदाहरण के लिए, यदि कोई नोड 2048KiB और 1048576KiB पेज आकारों का समर्थन करता है, तो यह अनुसूचीशील संसाधन `hugepages-2Mi` और `hugepages-1Gi` को एक्सपोज करेगा। CPU या मेमोरी के विपरीत, हयूजपेजेज ओवरकमिट का समर्थन नहीं करते हैं। ध्यान दें कि हयूजपेज संसाधनों का अनुरोध करते समय, मेमोरी या CPU संसाधनों का भी अनुरोध किया जाना चाहिए।

एक पॉड एक ही पॉड स्पेक में कई हयूजपेज आकारों का उपभोग कर सकता है। इस मामले में इसे सभी वॉल्यूम माउंट के लिए `medium: HugePages-<hugepagesize>` संकेतन का उपयोग करना होगा।

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: huge-pages-example
spec:
  containers:
  - name: example
    image: fedora:latest
    command:
    - sleep
    - inf
    volumeMounts:
    - mountPath: /hugepages-2Mi
      name: hugepage-2mi
    - mountPath: /hugepages-1Gi
      name: hugepage-1gi
    resources:
      limits:
        hugepages-2Mi: 100Mi
        hugepages-1Gi: 2Gi
        memory: 100Mi
      requests:
        memory: 100Mi
  volumes:
  - name: hugepage-2mi
    emptyDir:
      medium: HugePages-2Mi
  - name: hugepage-1gi
    emptyDir:
      medium: HugePages-1Gi
```

एक पॉड `medium: HugePages` का उपयोग केवल तभी कर सकता है जब वह एक आकार के हयूजपेजेज का अनुरोध करता है।

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: huge-pages-example
spec:
  containers:
  - name: example
    image: fedora:latest
    command:
    - sleep
    - inf
    volumeMounts:
    - mountPath: /hugepages
      name: hugepage
    resources:
      limits:
        hugepages-2Mi: 100Mi
        memory: 100Mi
      requests:
        memory: 100Mi
  volumes:
  - name: hugepage
    emptyDir:
      medium: HugePages
```

- हयूजपेज अनुरोधों को सीमाओं के बराबर होना चाहिए। यह डिफ़ॉल्ट है यदि सीमाएं
  निर्दिष्ट की गई हैं, लेकिन अनुरोध नहीं किए गए हैं।
- हयूजपेजेज कंटेनर स्कोप पर अलग किए जाते हैं, इसलिए प्रत्येक कंटेनर के पास कंटेनर स्पेक में
  अनुरोधित अनुसार उनके cgroup सैंडबॉक्स पर अपनी सीमा होती है।
- हयूजपेजेज द्वारा समर्थित EmptyDir वॉल्यूम पॉड अनुरोध से अधिक हयूजपेज मेमोरी का
  उपभोग नहीं कर सकते।
- `SHM_HUGETLB` के साथ `shmget()` के माध्यम से हयूजपेजेज का उपभोग करने वाले एप्लिकेशन को
  एक पूरक समूह के साथ चलना चाहिए जो `proc/sys/vm/hugetlb_shm_group` से मेल खाता हो।
- नेमस्पेस में हयूजपेज उपयोग को ResourceQuota के माध्यम से नियंत्रित किया जा सकता है
  जो `cpu` या `memory` जैसे अन्य कम्प्यूट संसाधनों के समान है, जो `hugepages-<size>`
  टोकन का उपयोग करता है। 