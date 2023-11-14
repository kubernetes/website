---
title: सीग्रुप v2 के बारे में  
content_type: concept
weight: 50
---

<!-- overview -->

लिनक्स पर, {{< glossary_tooltip text="नियंत्रण समूह" term_id="cgroup" >}} उन संसाधनों को बाधित करते हैं जो प्रक्रियाओं को आवंटित किए जाते हैं।

[पॉड्स और कंटेनरों के लिए संसाधन प्रबंधन](/docs/concepts/configuration/manage-resources-containers/) को लागू करने के लिए क्यूबलेट और अंतर्निहित रनटाइम कंटेनर को सीग्रुप के साथ इंटरफेस करने की आवश्यकता होती है जिसमें कंटेनरीकृत कार्य भार के लिए सीपीयू/मेमोरी अनुरोध और सीमाएं शामिल होती हैं।

Linux में cgroups के दो संस्करण हैं: सीग्रुप v1 और सीग्रुप v2। 
सीग्रुप v2
`सीग्रुप` एपीआई की नई पीढ़ी है।

<!-- body -->


## सीग्रुप v2 क्या है?? {#cgroup-v2}
{{< feature-state for_k8s_version="v1.25" state="stable" >}}

सीग्रुप v2 Linux `सीग्रुप` API का अगला संस्करण है।. 
सीग्रुप v2 उन्नत संसाधन प्रबंधन के साथ एक एकीकृत नियंत्रण प्रणाली प्रदान करता है


सीग्रुप v2, सीग्रुप v1 की तुलना में कई सुधार प्रदान करता है, जैसे कि निम्नलिखित:

- एपीआई में एकल एकीकृत पदानुक्रम डिज़ाइन
- कंटेनरों को सुरक्षित उपवृक्ष प्रत्यायोजन
- [प्रेशर स्टॉल सूचना](https://www.kernel.org/doc/html/latest/accounting/psi.html) जैसी नई सुविधाएँ
- कई संसाधनों में उन्नत संसाधन आवंटन प्रबंधन और अलगाव
  - विभिन्न प्रकार के मेमोरी आवंटन (नेटवर्क मेमोरी, कर्नेल मेमोरी, आदि) के लिए एकीकृत लेखांकन
  -पेज कैश राइट बैक जैसे गैर-तत्काल संसाधन परिवर्तनों के लिए लेखांकन


कुछ Kubernetes सुविधाएँ उन्नत संसाधन के लिए विशेष रूप से सीग्रुप v2 का उपयोग करती हैं
प्रबंधन और अलगाव. उदाहरण के लिए, [मेमोरी QoS](/blog/2021/11/26/qos-memory-resources/) सुविधा मेमोरी QoS में सुधार करती है और cgroup v2 प्रिमिटिव पर निर्भर करती है।

## सीग्रुप v2 का उपयोग {#using-cgroupv2}

सीग्रुप v2 का उपयोग करने का अनुशंसित तरीका लिनक्स वितरण का उपयोग करना है
डिफ़ॉल्ट रूप से सीग्रुप v2 को सक्षम और उपयोग करता है.

यह जाँचने के लिए कि क्या आपका वितरण cgroup v2 का उपयोग करता है, [लिनक्स नोड्स पर cgroup संस्करण की पहचान करें देखें।](#check-cgroup-version)
### आवश्यकताएं

सीग्रुप v2 की निम्नलिखित आवश्यकताएँ हैं:

* OS वितरण सीग्रुप v2 को सक्षम बनाता है
* लिनक्स कर्नेल संस्करण 5.8 या उसके बाद का है
* कंटेनर रनटाइम सीग्रुप v2 का समर्थन करता है। उदाहरण के लिए:
  * [कंटेनरड](https://containerd.io/) v1.4 और बाद का संस्करण
  * [क्रि-ओ](https://cri-o.io/) v1.20 और बाद का संस्करण
* क्यूबलेट और कंटेनर रनटाइम को [सिस्टमडी सीग्रुप ड्राइवर](/docs/setup/production-environment/container-runtimes#systemd-cgroup-driver) का उपयोग करने के लिए कॉन्फ़िगर किया गया है 

### लिनक्स वितरण सीग्रुप v2 समर्थन


सीग्रुप v2 का उपयोग करने वाले Linux वितरणों की सूची के लिए,  [सीग्रुप v2 दस्तावेज़](https://github.com/opencontainers/runc/blob/main/docs/cgroup-v2.md) देखें

<!-- the list should be kept in sync with https://github.com/opencontainers/runc/blob/main/docs/cgroup-v2.md -->
* कंटेनर अनुकूलित ओएस (एम97 से)
* उबंटू (21.10 से, 22.04+ अनुशंसित)
* डेबियन जीएनयू/लिनक्स (डेबियन 11 बुल्सआई के बाद से)
* फेडोरा (31 से)
* आर्क लिनक्स (अप्रैल 2021 से)
* आरएचईएल और आरएचईएल-जैसे वितरण (9 से)

यह जाँचने के लिए कि क्या आपका वितरण cgroup v2 का उपयोग कर रहा है, अपने वितरण के दस्तावेज़ देखें या [Linux नोड्स पर cgroup संस्करण की पहचान](#check-cgroup-version) करें में दिए गए निर्देशों का पालन करें।

आप कर्नेल cmdline बूट तर्कों को संशोधित करके अपने लिनक्स वितरण पर सीग्रुप v2 को मैन्युअल रूप से भी सक्षम कर सकते हैं। यदि आपका वितरण GRUB का उपयोग करता है, `systemd.unified_cgroup_hierarchy=1` को `GRUB_CMDLINE_LINUX` में जोड़ा जाना चाहिए
`/etc/default/grub` के अंतर्गत, उसके बाद `sudo update-grub`। हालांकि
अनुशंसित दृष्टिकोण एक ऐसे वितरण का उपयोग करना है जो पहले से ही सीग्रुप v2 को सक्षम बनाता है
गलती करना।

### सीग्रुप v2 पर माइग्रेट करें {#migrating-cgroupv2}

cgroup v2 में प्रवास करने के लिए सुनिश्चित करें कि आप [आवश्यकताओं](#requirements) को पूरा करते हैं, और फिर उस कर्णल संस्करण पर अपग्रेड करें जिसमें cgroup v2 को डिफ़ॉल्ट रूप से सक्षम किया गया है।

कुबलेट स्वचालित रूप से पहचानता है कि ऑपरेटिंग सिस्टम cgroup v2 पर चल रहा है और बिना किसी अतिरिक्त कॉन्फ़िगरेशन के यह उचित रूप से कार्रवाई करता है।

cgroup v2 में स्विच करते समय उपयोगकर्ता अनुभव में कोई भी प्रमुख अंतर होना नहीं चाहिए, यहाँ तक कि यदि उपयोगकर्ता सीधे cgroup फ़ाइल सिस्टम तक पहुँच रहे हैं, या नोड से या कंटेनर के भीतर से।

cgroup v2 cgroup v1 की तुलना में एक अलग API का उपयोग करता है, इसलिए यदि कोई एप्लिकेशन सीधे cgroup फ़ाइल सिस्टम तक सीधे पहुँचता है, तो उन्हें cgroup v2 को समर्थन करने वाले नए संस्करणों में अपडेट किया जाना चाहिए। उदाहरण के लिए:

* Some third-party monitoring and security agents may depend on the cgroup filesystem.
 Update these agents to versions that support cgroup v2.
* If you run [cAdvisor](https://github.com/google/cadvisor) as a stand-alone
 DaemonSet for monitoring pods and containers, update it to v0.43.0 or later.
* If you deploy Java applications, prefer to use versions which fully support cgroup v2:
    * [OpenJDK / HotSpot](https://bugs.openjdk.org/browse/JDK-8230305): jdk8u372, 11.0.16, 15 and later
    * [IBM Semeru Runtimes](https://www.ibm.com/support/pages/apar/IJ46681): 8.0.382.0, 11.0.20.0, 17.0.8.0, and later
    * [IBM Java](https://www.ibm.com/support/pages/apar/IJ46681): 8.0.8.6 and later
* If you are using the [uber-go/automaxprocs](https://github.com/uber-go/automaxprocs) package, make sure
  the version you use is v1.5.1 or higher.


* कुछ थर्ड-पार्टी मॉनिटरिंग और सुरक्षा एजेंट्स cgroup फ़ाइल सिस्टम पर निर्भर कर सकते हैं। इन एजेंट्स को cgroup v2 का समर्थन करने वाले संस्करणों में अपडेट करें।
* यदि आप [cAdvisor](https://github.com/google/cadvisor) को स्वतंत्र DaemonSet के रूप में
  पॉड और कंटेनरों का मॉनिटरिंग के लिए चलाते हैं, तो इसे v0.43.0 या उससे बाद के संस्करण में अपडेट करें।
* यदि आप जावा एप्लिकेशन डिप्लॉय करते हैं, तो cgroup v2 का पूरी तरह से समर्थन करने वाले संस्करणों का उपयोग करें:
    * [OpenJDK / HotSpot](https://bugs.openjdk.org/browse/JDK-8230305): jdk8u372, 11.0.16, 15 और बाद के संस्करण
    * [IBM Semeru Runtimes](https://www.ibm.com/support/pages/apar/IJ46681): 8.0.382.0, 11.0.20.0, 17.0.8.0, और बाद के संस्करण
    * [IBM Java](https://www.ibm.com/support/pages/apar/IJ46681): 8.0.8.6 और बाद के संस्करण
* यदि आप [uber-go/automaxprocs](https://github.com/uber-go/automaxprocs) पैकेज का उपयोग कर रहे हैं, तो सुनिश्चित करें
  कि आपका उपयोग करते संस्करण v1.5.1 या उच्चतर है।


## लिनक्स नोड्स पर cgroup संस्करण की पहचान {#check-cgroup-version}

cgroup संस्करण उपयोग की जाने वाली लिनक्स वितरण और ऑपरेटिंग सिस्टम पर योग्यता पर निर्भर करता है। यह जांचने के लिए कि आपका वितरण कौनसा cgroup संस्करण उपयोग कर रहा है, नोड पर `stat -fc %T /sys/fs/cgroup/` कमांड चलाएं:


```shell
stat -fc %T /sys/fs/cgroup/
```

cgroup v2 के लिए, आउटपुट `cgroup2fs` है।

cgroup v1 के लिए, आउटपुट `tmpfs` है।

## {{% heading "whatsnext" %}}

- [cgroups](https://man7.org/linux/man-pages/man7/cgroups.7.html) के बारे में और अधिक जानें
- [कंटेनर रनटाइम](/docs/concepts/architecture/cri) के बारे में और अधिक जानें
- [cgroup ड्राइवर](/docs/setup/production-environment/container-runtimes#cgroup-drivers) के बारे में और अधिक जानें
