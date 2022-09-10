
---
title: डॉक्यूमेंटेशन सामग्री के लिए निर्देश (Documentation Content Guide)
linktitle: सामग्री के लिए निर्देश
content_type: concept
weight: 10
---

<!-- overview -->

यह पेज कुबेरनट्स के प्रलेखन (दस्तावेजीकरण | डॉक्यूमेटेशम )  के लिए निर्देश उपलब्ध कराता है |
This page contains guidelines for Kubernetes documentation.

अगर आपके पास कोई अनुमत प्रश्न है तो स्लैक पर कुबेरनट्स से जुड़े 
[कुबेरनट्स स्लैक (Kubernetes Slack)](https://slack.k8s.io/) और पूछे! 

आप कुबेरनट्स के लिए स्लैक(Slack) पर यहां https://slack.k8s.io/ 
पंजीकरण (Registration) कर सकते है ।

कुबेरनट्स पर नई सामग्री (कंटेंट) बनाने के बारे में ज्यादा जानने के लिए इन निर्देश [कुबेरनट्स शैली(Kubernates Style)](/docs/contribute/style/style-guide) अनुसरण करें ।

<!-- body -->

## अवलोकन (Overview)

कुबेरनट्स वेबसाइट (वेबसाइट) के लिए स्रोत (Source) जिसमे डॉक्यूमेंटेशन भी समिल है 
[kubernetes/website](https://github.com/kubernetes/website) पर उपलब्ध है.

कुबेरनट्स डॉक्स `kubernetes/website/content/<language_code>/docs` फोल्डर में उपलब्ध है, ज्यादातर योगदान  (Contribution) कुबेरनट्स संस्था [Kubernetes
project](https://github.com/kubernetes/kubernetes) के लिए होते है

## क्या अनुमत है 

कुबेरनट्स अन्य पार्टी के परियोजना (प्रोजेक्ट |project) के सामग्री (कंटेंट|content) को अनुमत करता है जब :
- सॉफ्टवेयर की सामग्री कुबेरनट्स परियोजना (प्रोजेक्ट) में हो 
- सॉफ्टवेयर का सामाग्री कुबेरनट्स परियोजना (प्रोजेक्ट) के बाहर का हो लेकिन कुबेरनट्स को कार्य करने के लिए उनकी जरूरत हो 
- विषय (सामग्री) kubernetes.io पर विहित है, या कही और के विहित कंटेंट से जुड़ी है (उस कंटेंट से जुड़ी है जो kubernetes.io से जुड़ी है)

### अन्य संगठन की सामग्री (थर्ड पार्टी कंटेंट)

कुबेरनट्स डॉक्यूमेटेशन, कुबेरनट्स के अन्तरगत आने वाली परियोजनाओं के लिए लागू होने वाले उदाहरण शामिल करती है जो कि [कुबेरनेट्स(kubernetes)](https://github.com/kubernetes) और [kubernetes-sigs](https://github.com/kubernetes-sigs) गिटहब(Github) संगठन (संस्था) में है। 

कुबेरनट्स परियोजना(प्रोजेक्ट) के सक्रिय(एक्टिव) सामग्री(कंटेंट) के लिंक(link) अनुमत है।

कुबेरनट्स को कार्य करने के लिए कुछ तीसरी पार्टी(थर्ड पार्टी) के सामग्री की आवश्यकता होती है। उदाहरण के लिए कंटेनर रनटाइम(container runtimes) ( कंटेनरडी (containerd), सीआरआई-ओ(CRI-O), डोकर (Docker)),
[नेटवर्किंग नीति(पालिसी)](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/) (सीएनआई प्लग-इन), [इंग्रेस नियंत्रक(Ingress Controller)](/docs/concepts/services-networking/ingress-controllers/), और  [लॉगिंग(logging)](/docs/concepts/cluster-administration/logging/)|

डॉक्स को तीसरी पार्टी के ओपन सोर्स सॉफ्टवेयर से जोड़ा(लिंक) किया जा सकता है केवल जब कुबेरनट्स को कार्य करने के लिए उसकी जरूरत हो।

### दोहरी स्रोत वाली सामाग्री

जब भी संभव हो, दोहरी स्रोत वाली सामग्री की जगह कुबेरनट्स डॉक्स को विहित(कैनोनिकल) स्रोत से जोड़े।

दोहरी स्रोत की सामग्री को प्रबंधित करने के लिए दोहरे प्रयास(या उससे ज्यादा) प्रयास की जरूरत जोति है और बहुत जल्द ही पुराना हो जाता है।

{{< note >}}

यदि आप किसी कुबेरनट्स परियोजना(प्रोजेक्ट) के प्रबंधक है और अपने डॉक्स की होस्टिंग के लिए मदद चाहिए, [#sig-docs कुबेरनट्स स्लैक](https://kubernetes.slack.com/messages/C1J0BPD2M/) पर पूछे ।

{{< /note >}}

### और जानकारी

यदि आपके पास अनुमत सामग्री (allowed कॉन्टेंट) के बारे में कोई प्रश्न है तो [कुबेरनट्स स्लैक(Kubernetes Slack)](https://kubernetes.slack.com/messages/C1J0BPD2M/) #sig-docs चैनल से जुड़े और पूछे।



## {{% heading "आगे क्या है" %}}


* [स्टाइल मार्गेदर्शक (स्टाइल गाइड।Style guide)](/docs/contribute/style/style-guide) पढ़े।
