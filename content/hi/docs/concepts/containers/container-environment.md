---
title: कंटेनर वातावरण (Container Environment)
content_type: concept
weight: 20
---

<!-- overview -->

यह पृष्ठ कंटेनर वातावरण में कंटेनरों के लिए उपलब्ध संसाधनों का विवरण देता है।



<!-- body -->

## कंटेनर वातावरण (Container Environment)

कुबरनेटीज़ कंटेनर वातावरण कंटेनरों के लिए कई महत्वपूर्ण संसाधन प्रदान करता है |

* एक फ़ाइल सिस्टम, जो एक [image](/docs/concepts/containers/images/) और एक या अधिक [volumes](/docs/concepts/storage/volumes/) का संयोजन होता है।
* कंटेनर के बारे में जानकारी।
* क्लस्टर में अन्य ऑब्जेक्ट्स के बारे में जानकारी।


### कंटेनर जानकारी

कंटेनर का *hostname* उस Pod का नाम है जिसमें कंटेनर चल रहा है।

यह `hostname` कमांड या libc में [`gethostname`](https://man7.org/linux/man-pages/man2/gethostname.2.html) फंक्शन के माध्यम से उपलब्ध होता है।

Pod का नाम और नेमस्पेस, [downward API](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/) के माध्यम से environment variables के रूप में उपलब्ध होते हैं।

पॉड की परिभाषा से उपयोगकर्ता परिभाषित environment variables भी कंटेनर के लिए उपलब्ध होते हैं, जैसे कि कंटेनर इमेज में स्थायी रूप से निर्दिष्ट किए गए environment variables भी।


### क्लस्टर जानकारी

कंटेनर बनाए जाने पर जिन सभी सेवाओं को चलाया जा रहा था, उनकी सूची उस कंटेनर के लिए environment variables के रूप में उपलब्ध होती है। यह सूची, नए कंटेनर के पॉड और कुबेरनेट्स कंट्रोल प्लेन सेवाओं के नेमस्पेस के अंदर की सेवाओं की सीमित होती है।

foo नाम की सेवा जो कंटेनर bar से मैप होती है, निम्नलिखित variables को परिभाषित करती हैं:

```shell
FOO_SERVICE_HOST=<सेवा जो चल रही है उस होस्ट>
FOO_SERVICE_PORT=<सेवा जो चल रही है उस पोर्ट>
```

यदि [DNS addon](https://releases.k8s.io/{{< param "fullversion" >}}/cluster/addons/dns/) सक्षम है, तो सेवाएं अलग-अलग IP पतों के साथ समरूप होती हैं और DNS के माध्यम से कंटेनर के लिए उपलब्ध होती हैं।  


## {{% heading "whatsnext" %}}


* [Container lifecycle hooks](/docs/concepts/containers/container-lifecycle-hooks/) के बारे में और अधिक जानें।
* हाथों पर अनुभव प्राप्त करें
[कंटेनर लाइफसाइकल घटनाओं के लिए हैंडलर जोड़ना।](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/).