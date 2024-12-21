---
title: कंटेनर पर्यावरण
content_type: concept
weight: 20
---

<!-- overview -->

यह पृष्ठ कंटेनर परिवेश में कंटेनरों के लिए उपलब्ध संसाधनों का वर्णन करता है।


<!-- body -->

## कंटेनर पर्यावरण

कुबेरनेट्स का कंटेनर वातावरण कंटेनरों को कई महत्वपूर्ण संसाधन प्रदान करता है:

* एक फाइल सिस्टम, जो एक [इमेज](/docs/concepts/containers/images/) और एक या अधिक [वॉल्यूम](/docs/concepts/storage/volumes/) का संयोजन है।
* कंटेनर के बारे में जानकारी।
* क्लस्टर में अन्य ऑब्जेक्ट के बारे में जानकारी।

### कंटेनर जानकारी

कंटेनर का होस्टनाम उस पॉड का नाम है जिसमें कंटेनर चल रहा है।
यह libc में `hostname` कमांड या [`gethostname`](https://man7.org/linux/man-pages/man2/gethostname.2.html) फ़ंक्शन कॉल के ज़रिए उपलब्ध है।

पॉड नाम और नामस्थान [डाउनवर्ड API](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/) के ज़रिए पर्यावरण चर के रूप में उपलब्ध हैं।

पॉड परिभाषा से उपयोगकर्ता द्वारा परिभाषित पर्यावरण चर भी कंटेनर के लिए उपलब्ध हैं, जैसे कि कंटेनर छवि में स्थिर रूप से निर्दिष्ट कोई भी पर्यावरण चर।

### क्लस्टर जानकारी

जब कंटेनर बनाया गया था, तब चल रही सभी सेवाओं की सूची उस कंटेनर के लिए पर्यावरण चर के रूप में उपलब्ध है।
यह सूची नए कंटेनर के पॉड और कुबेरनेट्स कंट्रोल प्लेन सेवाओं के समान नामस्थान के भीतर सेवाओं तक सीमित है।

*foo* नामक सेवा के लिए जो *bar* नामक कंटेनर से मैप होती है, उसके लिए निम्नलिखित चर परिभाषित किए गए हैं:

```shell
FOO_SERVICE_HOST=<the host the service is running on>
FOO_SERVICE_PORT=<the port the service is running on>
```

यदि [DNS ऐडऑन](https://releases.k8s.io/v{{< skew currentPatchVersion >}}/cluster/addons/dns/) सक्षम है तो सेवाओं के पास समर्पित IP पते हैं और DNS के माध्यम से कंटेनर के लिए उपलब्ध हैं।

## {{% heading "whatsnext" %}}

* [कंटेनर जीवनचक्र हुक](/docs/concepts/containers/container-lifecycle-hooks/) के बारे में अधिक जानें
* [कंटेनर जीवनचक्र ईवेंट में हैंडलर संलग्न](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/) करने का व्यावहारिक अनुभव प्राप्त करें


