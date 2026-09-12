---
title: सुरक्षा चेकलिस्ट
description: >
  Kubernetes क्लस्टर में सुरक्षा सुनिश्चित करने के लिए बेसलाइन चेकलिस्ट।
content_type: concept
weight: 100
---

<!-- overview -->

यह चेकलिस्ट बुनियादी मार्गदर्शन की एक सूची प्रदान करती है, जिसमें हर विषय के
लिए अधिक व्यापक दस्तावेज़ीकरण के लिंक दिए गए हैं। यह संपूर्ण होने का दावा नहीं
करती और इसे लगातार विकसित होते रहना है।

इस दस्तावेज़ को पढ़ने और उपयोग करने के तरीके के बारे में:

- विषयों का क्रम प्राथमिकता के क्रम को नहीं दर्शाता है।
- कुछ चेकलिस्ट आइटम प्रत्येक सेक्शन की सूची के नीचे दिए गए पैराग्राफ में विस्तार से समझाए गए हैं।

{{< caution >}}
अपने आप में चेकलिस्ट अच्छी सुरक्षा स्थिति (security posture) प्राप्त करने के लिए
**पर्याप्त नहीं** हैं। अच्छी सुरक्षा स्थिति के लिए लगातार ध्यान और सुधार की आवश्यकता
होती है, लेकिन चेकलिस्ट सुरक्षा की तैयारी की कभी समाप्त न होने वाली यात्रा का पहला
कदम हो सकती है। इस चेकलिस्ट में दी गई कुछ सिफ़ारिशें आपकी विशिष्ट सुरक्षा आवश्यकताओं
के लिए बहुत प्रतिबंधात्मक या बहुत ढीली हो सकती हैं। चूँकि Kubernetes की सुरक्षा
"एक हर किसी के लिए उपयुक्त" (one size fits all) नहीं है, इसलिए चेकलिस्ट आइटम की
प्रत्येक श्रेणी का मूल्यांकन उसकी विशेषताओं के आधार पर किया जाना चाहिए।
{{< /caution >}}

<!-- body -->

## प्रमाणीकरण और प्राधिकरण (Authentication & Authorization)

- [ ] बूटस्ट्रैपिंग के बाद उपयोगकर्ता या कंपोनेंट प्रमाणीकरण के लिए `system:masters` समूह का उपयोग नहीं किया जाता।
- [ ] kube-controller-manager को `--use-service-account-credentials` सक्षम के साथ चलाया जाता है।
- [ ] रूट सर्टिफिकेट सुरक्षित है (या तो ऑफ़लाइन CA, या प्रभावी एक्सेस कंट्रोल के साथ
  एक प्रबंधित ऑनलाइन CA)।
- [ ] इंटरमीडिएट और लीफ सर्टिफिकेट की समाप्ति तिथि भविष्य में 3
  वर्षों से अधिक नहीं है।
- [ ] आवधिक एक्सेस समीक्षा (access review) की एक प्रक्रिया मौजूद है, और समीक्षाएँ 24
  महीनों से अधिक के अंतराल पर नहीं होतीं।
- [ ] प्रमाणीकरण और प्राधिकरण से संबंधित मार्गदर्शन के लिए
  [Role Based Access Control की अच्छी प्रथाएँ](/docs/concepts/security/rbac-good-practices/)
  का पालन किया जाता है।

बूटस्ट्रैपिंग के बाद, न तो उपयोगकर्ताओं को और न ही कंपोनेंट्स को Kubernetes API के
प्रति `system:masters` के रूप में प्रमाणित होना चाहिए। इसी तरह,
kube-controller-manager को पूरी तरह से `system:masters` के रूप में चलाने से बचना
चाहिए। वास्तव में, `system:masters` का उपयोग केवल एडमिन उपयोगकर्ता के विपरीत,
ब्रेक-ग्लास (break-glass) तंत्र के रूप में किया जाना चाहिए।

## नेटवर्क सुरक्षा

- [ ] उपयोग में आने वाले CNI प्लगइन्स नेटवर्क पॉलिसी का समर्थन करते हैं।
- [ ] इनग्रेस (ingress) और एग्रेस (egress) नेटवर्क पॉलिसी क्लस्टर में सभी वर्कलोड पर
  लागू हैं।
- [ ] प्रत्येक namespace में, सभी pods का चयन करने वाली, सब कुछ अस्वीकार करने वाली
  डिफ़ॉल्ट नेटवर्क पॉलिसी मौजूद हैं।
- [ ] यदि उपयुक्त हो, तो क्लस्टर के अंदर के सभी संचारों को एन्क्रिप्ट करने के लिए
  सर्विस मेश का उपयोग किया जाता है।
- [ ] Kubernetes API, kubelet API और etcd सार्वजनिक रूप से इंटरनेट पर उजागर नहीं हैं।
- [ ] वर्कलोड से क्लाउड मेटाडेटा API तक का एक्सेस फ़िल्टर किया जाता है।
- [ ] LoadBalancer और ExternalIPs का उपयोग प्रतिबंधित है।

कई [Container Network Interface (CNI) प्लगइन्स](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
वह कार्यक्षमता प्रदान करते हैं जो
pods के लिए उपलब्ध नेटवर्क संसाधनों को प्रतिबंधित करती है जिनसे वे संवाद कर सकते हैं। यह सबसे अधिक
इसके माध्यम से [Network Policies](/docs/concepts/services-networking/network-policies/)
के माध्यम से किया जाता है, जो नियमों को परिभाषित करने के लिए एक namespace स्कोप वाला संसाधन प्रदान करते हैं।
प्रत्येक namespace में सभी इग्रेस और एग्रेस को ब्लॉक करने वाली, सभी pods का चयन करने वाली डिफ़ॉल्ट
नेटवर्क पॉलिसी, यह सुनिश्चित करने के लिए अनुमति सूची (allow list) दृष्टिकोण अपनाने में
उपयोगी हो सकती हैं कि कोई भी वर्कलोड छूट न जाए।

सभी CNI प्लगइन्स ट्रांज़िट में एन्क्रिप्शन प्रदान नहीं करते हैं। यदि चुने गए प्लगइन में
यह सुविधा नहीं है, तो एक विकल्प यह हो सकता है कि उस
कार्यक्षमता को प्रदान करने के लिए सर्विस मेश का उपयोग किया जाए।

कंट्रोल प्लेन के etcd डेटास्टोर में एक्सेस को सीमित करने के लिए नियंत्रण होने चाहिए और
इसे इंटरनेट पर सार्वजनिक रूप से उजागर नहीं होना चाहिए। इसके अलावा, इसके साथ सुरक्षित रूप से संवाद करने के लिए
म्यूचुअल TLS (mTLS) का उपयोग किया जाना चाहिए। इसके लिए
सर्टिफिकेट अथॉरिटी etcd के लिए अद्वितीय होनी चाहिए।

Kubernetes API सर्वर तक बाहरी इंटरनेट एक्सेस को प्रतिबंधित किया जाना चाहिए ताकि
API सार्वजनिक रूप से उजागर न हो। सावधान रहें, क्योंकि कई प्रबंधित Kubernetes वितरण
डिफ़ॉल्ट रूप से API सर्वर को सार्वजनिक रूप से उजागर करते हैं। इसके बाद आप सर्वर तक पहुँचने के लिए
एक बैस्टियन होस्ट (bastion host) का उपयोग कर सकते हैं।

[kubelet](/docs/reference/command-line-tools-reference/kubelet/) API एक्सेस
को प्रतिबंधित किया जाना चाहिए और इसे सार्वजनिक रूप से उजागर नहीं होना चाहिए; जब `--config` फ़्लैग के साथ कोई
कॉन्फ़िगरेशन फ़ाइल निर्दिष्ट नहीं की जाती, तो डिफ़ॉल्ट प्रमाणीकरण और
प्राधिकरण सेटिंग्स अत्यधिक उदार होती हैं।

यदि Kubernetes को होस्ट करने के लिए किसी क्लाउड प्रदाता का उपयोग किया जाता है, तो pods से क्लाउड
मेटाडेटा API `169.254.169.254` तक के एक्सेस को भी प्रतिबंधित या अवरुद्ध किया जाना चाहिए यदि
आवश्यकता न हो, क्योंकि यह जानकारी लीक कर सकता है।

प्रतिबंधित LoadBalancer और ExternalIPs उपयोग के लिए,
[CVE-2020-8554: Man in the middle using LoadBalancer or ExternalIPs](https://github.com/kubernetes/kubernetes/issues/97076)
और [DenyServiceExternalIPs एडमिशन कंट्रोलर](/docs/reference/access-authn-authz/admission-controllers/#denyserviceexternalips)
देखें।

## पॉड सुरक्षा

- [ ] वर्कलोड को `create`, `update`, `patch`, `delete` करने के RBAC अधिकार केवल आवश्यकता होने पर ही दिए जाते हैं।
- [ ] उचित Pod Security Standards पॉलिसी सभी namespaces के लिए लागू और लागू-अनिवार्य (enforced) है।
- [ ] उन वर्कलोड के लिए मेमोरी लिमिट सेट है जिनकी सीमा अनुरोध (request) के बराबर या उससे कम है।
- [ ] संवेदनशील वर्कलोड पर CPU लिमिट सेट की जा सकती है।
- [ ] जिन नोड्स पर समर्थन है, वहाँ प्रोग्राम के लिए उपयुक्त syscalls प्रोफ़ाइल के साथ
  Seccomp सक्षम है।
- [ ] जिन नोड्स पर समर्थन है, वहाँ प्रोग्राम के लिए उपयुक्त प्रोफ़ाइल के साथ
  AppArmor या SELinux सक्षम है।

RBAC प्राधिकरण महत्वपूर्ण है लेकिन
[Pods के संसाधनों पर प्राधिकरण होने के लिए पर्याप्त बारीक नहीं हो सकता](/docs/concepts/security/rbac-good-practices/#workload-creation)
(या किसी भी संसाधन पर जो Pods को प्रबंधित करता है)। एकमात्र बारीकी संसाधन स्वयं
पर API verbs की है, उदाहरण के लिए, Pods पर `create`। अतिरिक्त
एडमिशन के बिना, इन संसाधनों को बनाने की प्राधिकरण क्लस्टर के शेड्यूल करने योग्य नोड्स तक
सीधी अप्रतिबंधित पहुँच की अनुमति देता है।

[Pod Security Standards](/docs/concepts/security/pod-security-standards/)
तीन अलग-अलग पॉलिसी परिभाषित करते हैं — privileged, baseline और restricted — जो
सुरक्षा के संबंध में `PodSpec` में फ़ील्ड्स को कैसे सेट किया जा सकता है, उसे सीमित
करते हैं।
इन मानकों को namespace स्तर पर नए
[Pod Security](/docs/concepts/security/pod-security-admission/) एडमिशन,
जो डिफ़ॉल्ट रूप से सक्षम है, या किसी थर्ड-पार्टी एडमिशन वेबहुक द्वारा लागू किया जा सकता है। कृपया ध्यान दें कि,
इसके द्वारा प्रतिस्थापित हटाई गई PodSecurityPolicy एडमिशन के विपरीत,
[Pod Security](/docs/concepts/security/pod-security-admission/)
एडमिशन को एडमिशन वेबहुक्स और बाहरी सेवाओं के साथ आसानी से जोड़ा जा सकता है।

Pod Security एडमिशन की `restricted` पॉलिसी, जो
[Pod Security Standards](/docs/concepts/security/pod-security-standards/) सेट
की सबसे प्रतिबंधात्मक पॉलिसी है,
[कई मोड में संचालित हो सकती है](/docs/concepts/security/pod-security-admission/#pod-security-admission-labels-for-namespaces),
`warn`, `audit` या `enforce`, सुरक्षा सर्वोत्तम प्रथाओं के अनुसार सबसे उपयुक्त
[security context](/docs/tasks/configure-pod-container/security-context/)
को धीरे-धीरे लागू करने के लिए। फिर भी, pods के
[security context](/docs/tasks/configure-pod-container/security-context/)
की अलग से जाँच की जानी चाहिए ताकि विशिष्ट उपयोग के मामलों के लिए,
पूर्वनिर्धारित सुरक्षा मानकों के ऊपर pods के पास मौजूद विशेषाधिकारों और पहुँच को
सीमित किया जा सके।

[Pod Security](/docs/concepts/security/pod-security-admission/) पर
एक हैंड्स-ऑन ट्यूटोरियल के लिए, ब्लॉग पोस्ट
[Kubernetes 1.23: Pod Security Graduates to Beta](/blog/2021/12/09/pod-security-admission-beta/)
देखें।

पॉड द्वारा नोड पर उपभोग की जा सकने वाली मेमोरी और CPU संसाधनों को सीमित करने के लिए, और इस प्रकार दुर्भावनापूर्ण या
समझौता किए गए वर्कलोड से संभावित DoS हमलों को रोकने के लिए
[मेमोरी और CPU लिमिट](/docs/concepts/configuration/manage-resources-containers/)
सेट की जानी चाहिए। इस तरह की पॉलिसी को एडमिशन कंट्रोलर द्वारा लागू किया जा सकता है।
कृपया ध्यान दें कि CPU लिमिट उपयोग को थ्रॉटल (throttle) करेगी और इस प्रकार ऑटो-स्केलिंग सुविधाओं या दक्षता पर अनजाने
प्रभाव डाल सकती है, यानी CPU संसाधन उपलब्ध होने पर प्रक्रिया को बेस्ट
एफ़र्ट (best effort) में चलाना।

{{< caution >}}
अनुरोध से अधिक मेमोरी लिमिट पूरे नोड को OOM समस्याओं के लिए उजागर कर सकती है।
{{< /caution >}}

### Seccomp सक्षम करना

Seccomp का पूरा नाम secure computing mode है और यह Linux kernel की सुविधा रही है संस्करण 2.6.12 से।
इसका उपयोग किसी प्रक्रिया के विशेषाधिकारों को सैंडबॉक्स करने के लिए किया जा सकता है, जो उसे
userspace से kernel में करने योग्य कॉल को प्रतिबंधित करता है। Kubernetes आपको नोड पर लोड की गई
seccomp प्रोफ़ाइल को आपके Pods और कंटेनरों पर स्वचालित रूप से लागू करने की अनुमति देता है।

Seccomp, कंटेनरों के अंदर उपलब्ध Linux kernel syscall हमले की सतह को कम करके
आपके वर्कलोड की सुरक्षा में सुधार कर सकता है। seccomp फ़िल्टर मोड BPF का लाभ उठाकर विशिष्ट syscalls की
एक अनुमति या अस्वीकृति सूची बनाता है, जिन्हें प्रोफ़ाइल कहा जाता है।

Kubernetes 1.27 से, आप सभी वर्कलोड के लिए डिफ़ॉल्ट seccomp प्रोफ़ाइल के रूप में
`RuntimeDefault` का उपयोग सक्षम कर सकते हैं। इस
विषय पर एक [सुरक्षा ट्यूटोरियल](/docs/tutorials/security/seccomp/) उपलब्ध है। इसके अतिरिक्त,
[Kubernetes Security Profiles Operator](https://github.com/kubernetes-sigs/security-profiles-operator)
एक ऐसा प्रोजेक्ट है जो क्लस्टर में seccomp के प्रबंधन और उपयोग को सरल बनाता है।

{{< note >}}
Seccomp केवल Linux नोड्स पर उपलब्ध है।
{{< /note >}}

### AppArmor या SELinux सक्षम करना

#### AppArmor

[AppArmor](/docs/tutorials/security/apparmor/) एक Linux kernel सुरक्षा मॉड्यूल है जो
Mandatory Access Control (MAC) लागू करने और सिस्टम लॉग के माध्यम से बेहतर
ऑडिटिंग प्रदान करने का आसान तरीका प्रदान कर सकता है। जिन नोड्स पर समर्थन हो, वहाँ एक डिफ़ॉल्ट AppArmor प्रोफ़ाइल लागू होती है, या एक कस्टम प्रोफ़ाइल कॉन्फ़िगर की जा सकती है।
seccomp की तरह, AppArmor भी प्रोफ़ाइल के माध्यम से कॉन्फ़िगर होता
है, जहाँ प्रत्येक प्रोफ़ाइल या तो enforcing मोड में चलती है, जो अस्वीकृत संसाधनों तक पहुँच को ब्लॉक करती है, या complain मोड में, जो केवल उल्लंघनों की रिपोर्ट करता है। AppArmor प्रोफ़ाइल एक
एनोटेशन के साथ, प्रति-कंटेनर आधार पर लागू होती हैं, जिससे प्रक्रियाओं को बिल्कुल सही विशेषाधिकार मिल सकें।

{{< note >}}
AppArmor केवल Linux नोड्स पर उपलब्ध है, और
[कुछ Linux वितरणों](https://gitlab.com/apparmor/apparmor/-/wikis/home#distributions-and-ports) में सक्षम है।
{{< /note >}}

#### SELinux

[SELinux](https://github.com/SELinuxProject/selinux-notebook/blob/main/src/selinux_overview.md) भी एक
Linux kernel सुरक्षा मॉड्यूल है जो एक्सेस
नियंत्रण सुरक्षा पॉलिसी का समर्थन करने के लिए एक तंत्र प्रदान कर सकता है, जिसमें Mandatory Access Controls (MAC) शामिल हैं। SELinux
लेबल को कंटेनरों या pods को
[उनके `securityContext` सेक्शन के माध्यम से](/docs/tasks/configure-pod-container/security-context/#assign-selinux-labels-to-a-container) सौंपा जा सकता है।

{{< note >}}
SELinux केवल Linux नोड्स पर उपलब्ध है, और
[कुछ Linux वितरणों](https://en.wikipedia.org/wiki/Security-Enhanced_Linux#Implementations) में सक्षम है।
{{< /note >}}

## लॉग और ऑडिटिंग

- [ ] ऑडिट लॉग, यदि सक्षम हैं, सामान्य एक्सेस से सुरक्षित हैं।


## पॉड प्लेसमेंट

- [ ] पॉड प्लेसमेंट एप्लिकेशन की संवेदनशीलता के स्तरों (tiers) के अनुसार किया जाता है।
- [ ] संवेदनशील एप्लिकेशन नोड्स पर अलग-थलग चल रहे हैं या विशिष्ट
  सैंडबॉक्स्ड (sandboxed) रनटाइम के साथ।

विभिन्न संवेदनशीलता के स्तरों पर मौजूद pods, उदाहरण के लिए, एक एप्लिकेशन pod
और Kubernetes API सर्वर, को अलग-अलग नोड्स पर तैनात किया जाना चाहिए। नोड अलगाव
का उद्देश्य किसी एप्लिकेशन कंटेनर ब्रेकआउट को रोकना है ताकि वह सीधे
अधिक संवेदनशीलता वाले एप्लिकेशन तक पहुँच प्रदान करके क्लस्टर के भीतर आसानी से आगे न बढ़ सके। pods को
गलती से उसी नोड पर तैनात होने से रोकने के लिए यह अलगाव लागू किया जाना चाहिए। इसे
निम्नलिखित सुविधाओं के साथ लागू किया जा सकता है:

[Node Selectors](/docs/concepts/scheduling-eviction/assign-pod-node/)
: कुंजी-मूल्य (key-value) जोड़े, पॉड विनिर्देश के हिस्से के रूप में, जो निर्दिष्ट करते हैं कि किन नोड्स पर
तैनात करना है। इन्हें
[PodNodeSelector](/docs/reference/access-authn-authz/admission-controllers/#podnodeselector)
एडमिशन कंट्रोलर के साथ namespace और क्लस्टर स्तर पर लागू किया जा सकता है।

[PodTolerationRestriction](/docs/reference/access-authn-authz/admission-controllers/#podtolerationrestriction)
: एक एडमिशन कंट्रोलर जो प्रशासकों को एक namespace के भीतर अनुमत
[tolerations](/docs/concepts/scheduling-eviction/taint-and-toleration/) को प्रतिबंधित करने की अनुमति देता है। एक namespace के भीतर के pods केवल उन्हीं tolerations का उपयोग कर सकते हैं
जो namespace ऑब्जेक्ट एनोटेशन कुंजियों पर निर्दिष्ट हैं और जो डिफ़ॉल्ट और अनुमत
tolerations का एक सेट प्रदान करती हैं।

[RuntimeClass](/docs/concepts/containers/runtime-class/)
: RuntimeClass कंटेनर रनटाइम कॉन्फ़िगरेशन का चयन करने के लिए एक सुविधा है।
कंटेनर रनटाइम कॉन्फ़िगरेशन का उपयोग Pod के कंटेनरों को चलाने के लिए किया जाता है और
यह प्रदर्शन ओवरहेड की कीमत पर होस्ट से अधिक या कम अलगाव प्रदान कर सकता है।

## सीक्रेट्स (Secrets)

- [ ] ConfigMaps का उपयोग गोपनीय डेटा रखने के लिए नहीं किया जाता।
- [ ] Secret API के लिए एन्क्रिप्शन एट रेस्ट (encryption at rest) कॉन्फ़िगर किया गया है।
- [ ] यदि उपयुक्त हो, तो थर्ड-पार्टी संग्रहण में संग्रहीत सीक्रेट्स को इंजेक्ट करने का एक तंत्र
  तैनात और उपलब्ध है।
- [ ] सर्विस अकाउंट टोकन उन pods में माउंट नहीं किए जाते जिन्हें उनकी आवश्यकता नहीं है।
- [ ] गैर-समाप्ति वाले टोकन के बजाय
  [Bound service account token volume](/docs/reference/access-authn-authz/service-accounts-admin/#bound-service-account-token-volume)
  का उपयोग किया जा रहा है।

pods के लिए आवश्यक सीक्रेट्स को ConfigMap जैसे विकल्पों के बजाय
Kubernetes Secrets के भीतर संग्रहीत किया जाना चाहिए। etcd के भीतर संग्रहीत Secret
संसाधनों को [एन्क्रिप्टेड एट रेस्ट](/docs/tasks/administer-cluster/encrypt-data/) होना चाहिए।

सीक्रेट्स की आवश्यकता वाले pods में ये वॉल्यूम के माध्यम से स्वचालित रूप से माउंट होने चाहिए,
बेहतर यह होगा कि उन्हें मेमोरी में संग्रहीत किया जाए, जैसे कि
[`emptyDir.medium` विकल्प](/docs/concepts/storage/volumes/#emptydir) के साथ। थर्ड-पार्टी संग्रहण से सीक्रेट्स को वॉल्यूम के रूप में
इंजेक्ट करने के लिए भी तंत्र का उपयोग किया जा सकता है, जैसे
[Secrets Store CSI Driver](https://secrets-store-csi-driver.sigs.k8s.io/)।
यह pods को सीक्रेट्स तक सर्विस अकाउंट RBAC एक्सेस प्रदान करने की तुलना में
अधिक प्राथमिकता के साथ किया जाना चाहिए। इससे सीक्रेट्स को pod में
एनवायरनमेंट वेरिएबल या फ़ाइलों के रूप में जोड़ा जा सकेगा। कृपया ध्यान दें कि फ़ाइलों पर
अनुमति तंत्र के विपरीत, लॉग में क्रैश डंप और Linux में एनवायरनमेंट वेरिएबल की
गैर-गोपनीय प्रकृति के कारण एनवायरनमेंट वेरिएबल विधि लीक होने के अधिक शिकार हो सकती है।

सर्विस अकाउंट टोकन उन pods में माउंट नहीं किए जाने चाहिए जिन्हें उनकी आवश्यकता नहीं है। इसे सेट करके कॉन्फ़िगर किया जा सकता है
[`automountServiceAccountToken`](/docs/tasks/configure-pod-container/configure-service-account/#use-the-default-service-account-to-access-the-api-server)
को `false`, या तो पूरे namespace में लागू होने के लिए सर्विस अकाउंट के भीतर
या विशेष रूप से एक pod के लिए। Kubernetes v1.22 और उससे ऊपर के लिए,
समय-सीमित सर्विस अकाउंट क्रेडेंशियल्स के लिए
[Bound Service Accounts](/docs/reference/access-authn-authz/service-accounts-admin/#bound-service-account-token-volume)
का उपयोग करें।

## इमेज (Images)

- [ ] कंटेनर इमेज में अनावश्यक सामग्री को न्यूनतम किया गया है।
- [ ] कंटेनर इमेज को अनप्रिविलेज्ड (unprivileged) उपयोगकर्ता के रूप में चलाने के लिए कॉन्फ़िगर किया गया है।
- [ ] कंटेनर इमेज के संदर्भ sha256 डाइजेस्ट द्वारा किए जाते हैं (टैग के
बजाय) या इमेज की उत्पत्ति (provenance) को तैनाती के समय इमेज के
डिजिटल हस्ताक्षर को सत्यापित करके [एडमिशन कंट्रोल के माध्यम से](/docs/tasks/administer-cluster/verify-signed-artifacts/#verifying-image-signatures-with-admission-controller) मान्य किया जाता है।
- [ ] कंटेनर इमेज को निर्माण और परिनियोजन के दौरान नियमित रूप से स्कैन किया जाता है, और
  ज्ञात कमज़ोर सॉफ़्टवेयर को पैच किया जाता है।

कंटेनर इमेज में उन्हें पैकेज किए गए प्रोग्राम को चलाने के लिए न्यूनतम सामग्री होनी चाहिए। बेहतर यह होगा कि केवल
प्रोग्राम और उसकी निर्भरताएँ हों, और इमेज को न्यूनतम संभव बेस से बनाया जाए। विशेष रूप से, उत्पादन में उपयोग की जाने वाली इमेज में
शेल या डिबगिंग उपयोगिताएँ नहीं होनी चाहिए, क्योंकि
समस्या निवारण के लिए एक
[ephemeral debug container](/docs/tasks/debug/debug-application/debug-running-pod/#ephemeral-container)
का उपयोग किया जा सकता है।

[`USER` निर्देश डॉकरफ़ाइल में](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#user)
का उपयोग करके इमेज को सीधे एक अनप्रिविलेज्ड उपयोगकर्ता के साथ शुरू होने के लिए बनाएँ।
[Security Context](/docs/tasks/configure-pod-container/security-context/#set-the-security-context-for-a-pod)
`runAsUser` और `runAsGroup` के साथ कंटेनर इमेज को एक विशिष्ट उपयोगकर्ता और समूह के साथ शुरू करने की अनुमति देता है,
भले ही इमेज मैनिफेस्ट में निर्दिष्ट न हो।
हालाँकि, इमेज परतों में फ़ाइल अनुमतियाँ इमेज को संशोधित किए बिना
प्रक्रिया को नए अनप्रिविलेज्ड उपयोगकर्ता के साथ शुरू करना असंभव बना सकती हैं।

किसी इमेज को संदर्भित करने के लिए इमेज टैग के उपयोग से बचें, विशेष रूप से `latest`
टैग, टैग के पीछे की इमेज को रजिस्ट्री में आसानी से संशोधित किया जा सकता है। इमेज मैनिफेस्ट के लिए अद्वितीय पूर्ण
`sha256` डाइजेस्ट का उपयोग करना बेहतर है। इस पॉलिसी को एक
[ImagePolicyWebhook](/docs/reference/access-authn-authz/admission-controllers/#imagepolicywebhook)
के माध्यम से लागू किया जा सकता है। इमेज हस्ताक्षरों को तैनाती के समय
[एडमिशन कंट्रोलर के साथ स्वचालित रूप से सत्यापित](/docs/tasks/administer-cluster/verify-signed-artifacts/#verifying-image-signatures-with-admission-controller)
भी किया जा सकता है ताकि उनकी प्रामाणिकता और अखंडता मान्य हो सके।

कंटेनर इमेज को स्कैन करने से महत्वपूर्ण कमज़ोरियों को कंटेनर इमेज के साथ
क्लस्टर में तैनात होने से रोका जा सकता है। कंटेनर इमेज को क्लस्टर में तैनात करने से पहले इमेज स्कैनिंग पूरी
की जानी चाहिए और आमतौर पर यह CI/CD पाइपलाइन में परिनियोजन प्रक्रिया के
हिस्से के रूप में की जाती है। इमेज स्कैन का उद्देश्य
कंटेनर इमेज में संभावित कमज़ोरियों और उनकी रोकथाम के बारे में जानकारी प्राप्त करना है, जैसे कि एक
[Common Vulnerability Scoring System (CVSS)](https://www.first.org/cvss/)
स्कोर। यदि इमेज स्कैन का परिणाम पाइपलाइन
अनुपालन नियमों के साथ जोड़ा जाता है, तो केवल उचित रूप से पैच की गई कंटेनर इमेज ही
उत्पादन में पहुँचेंगी।

## एडमिशन कंट्रोलर्स (Admission Controllers)

- [ ] एडमिशन कंट्रोलर्स का एक उपयुक्त चयन सक्षम है।
- [ ] Pod Security Admission और/या एक
  वेबहुक एडमिशन कंट्रोलर द्वारा pod सुरक्षा पॉलिसी लागू-अनिवार्य है।
- [ ] एडमिशन चेन प्लगइन्स और वेबहुक्स सुरक्षित रूप से कॉन्फ़िगर किए गए हैं।

एडमिशन कंट्रोलर्स क्लस्टर की सुरक्षा में सुधार करने में मदद कर सकते हैं। हालाँकि,
वे स्वयं जोखिम पैदा कर सकते हैं क्योंकि वे API सर्वर का विस्तार करते हैं और
[उन्हें ठीक से सुरक्षित किया जाना चाहिए](/blog/2022/01/19/secure-your-admission-controllers-and-webhooks/)।

निम्नलिखित सूचियाँ कुछ ऐसे एडमिशन कंट्रोलर्स प्रस्तुत करती हैं जिन्हें
आपके क्लस्टर और एप्लिकेशन की सुरक्षा स्थिति बढ़ाने के लिए माना जा सकता है। इसमें
वे कंट्रोलर शामिल हैं जिनका उल्लेख इस दस्तावेज़ के अन्य भागों में किया गया है।

एडमिशन कंट्रोलर्स का यह पहला समूह उन प्लगइन्स को शामिल करता है जो
[डिफ़ॉल्ट रूप से सक्षम](/docs/reference/access-authn-authz/admission-controllers/#which-plugins-are-enabled-by-default)
हैं; जब तक कि आपको न पता हो कि आप क्या कर रहे हैं, तब तक उन्हें सक्षम रहने देने पर विचार करें:

[`CertificateApproval`](/docs/reference/access-authn-authz/admission-controllers/#certificateapproval)
: यह सुनिश्चित करने के लिए अतिरिक्त प्राधिकरण जाँच करता है कि अनुमोदन करने वाले
उपयोगकर्ता को सर्टिफिकेट अनुरोध को अनुमोदित करने की अनुमति है।

[`CertificateSigning`](/docs/reference/access-authn-authz/admission-controllers/#certificatesigning)
: यह सुनिश्चित करने के लिए अतिरिक्त प्राधिकरण जाँच करता है कि हस्ताक्षर करने
वाले उपयोगकर्ता को सर्टिफिकेट अनुरोधों पर हस्ताक्षर करने की अनुमति है।

[`CertificateSubjectRestriction`](/docs/reference/access-authn-authz/admission-controllers/#certificatesubjectrestriction)
: `system:masters` के 'group' (या 'organization attribute') को निर्दिष्ट करने वाले किसी भी
सर्टिफिकेट अनुरोध को अस्वीकार करता है।

[`LimitRanger`](/docs/reference/access-authn-authz/admission-controllers/#limitranger)
: LimitRange API बाधाओं को लागू करता है।

[`MutatingAdmissionWebhook`](/docs/reference/access-authn-authz/admission-controllers/#mutatingadmissionwebhook)
: वेबहुक्स के माध्यम से कस्टम कंट्रोलर्स के उपयोग की अनुमति देता है, ये कंट्रोलर्स उन अनुरोधों को
संशोधित कर सकते हैं जिनकी उनकी समीक्षा होती है।

[`PodSecurity`](/docs/reference/access-authn-authz/admission-controllers/#podsecurity)
: Pod Security Policy का प्रतिस्थापन, तैनात किए गए Pods के security contexts को
प्रतिबंधित करता है।

[`ResourceQuota`](/docs/reference/access-authn-authz/admission-controllers/#resourcequota)
: संसाधनों के अति-उपयोग को रोकने के लिए संसाधन कोटा लागू करता है।

[`ValidatingAdmissionWebhook`](/docs/reference/access-authn-authz/admission-controllers/#validatingadmissionwebhook)
: वेबहुक्स के माध्यम से कस्टम कंट्रोलर्स के उपयोग की अनुमति देता है, ये कंट्रोलर्स उन अनुरोधों को
संशोधित नहीं करते जिनकी उनकी समीक्षा होती है।

दूसरा समूह उन प्लगइन्स को शामिल करता है जो डिफ़ॉल्ट रूप से सक्षम नहीं हैं लेकिन सामान्य
उपलब्धता (GA) स्थिति में हैं और आपकी सुरक्षा स्थिति को बेहतर बनाने के लिए अनुशंसित हैं:

[`DenyServiceExternalIPs`](/docs/reference/access-authn-authz/admission-controllers/#denyserviceexternalips)
: `Service.spec.externalIPs` फ़ील्ड के सभी नेट-नए उपयोग को अस्वीकार करता है। यह
[CVE-2020-8554: Man in the middle using LoadBalancer or ExternalIPs](https://github.com/kubernetes/kubernetes/issues/97076)
के लिए एक शमन (mitigation) है।

[`NodeRestriction`](/docs/reference/access-authn-authz/admission-controllers/#noderestriction)
: kubelet की अनुमतियों को केवल उन्हीं pods API संसाधनों को संशोधित करने तक सीमित करता है
जिनके वे स्वामी हैं या उस node API संसाधन तक जो स्वयं का प्रतिनिधित्व करता है। यह kubelet को `node-restriction.kubernetes.io/`
एनोटेशन का उपयोग करने से भी रोकता है, जिसका उपयोग
kubelet के क्रेडेंशियल्स तक पहुँच रखने वाला हमलावर नियंत्रित नोड पर pod
प्लेसमेंट को प्रभावित करने के लिए कर सकता है।

तीसरा समूह उन प्लगइन्स को शामिल करता है जो डिफ़ॉल्ट रूप से सक्षम नहीं हैं लेकिन कुछ उपयोग के
मामलों के लिए माने जा सकते हैं:

[`AlwaysPullImages`](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)
: टैग की गई इमेज के नवीनतम संस्करण के उपयोग को लागू करता है और यह सुनिश्चित करता है कि परिनियोजक
को इमेज का उपयोग करने की अनुमति है।

[`ImagePolicyWebhook`](/docs/reference/access-authn-authz/admission-controllers/#imagepolicywebhook)
: वेबहुक्स के माध्यम से इमेज के लिए अतिरिक्त नियंत्रण लागू करने की अनुमति देता है।

<!-- चौथा समूह उन प्लगइन्स को शामिल करता है जो डिफ़ॉल्ट रूप से सक्षम नहीं हैं, अभी भी
alpha स्थिति में हैं लेकिन कुछ उपयोग के मामलों के लिए माने जा सकते हैं:

[`EventRateLimit`](/docs/reference/access-authn-authz/admission-controllers/#eventratelimit)
: API सर्वर में नए Events जोड़ने की दर सीमित करता है।

[`PodNodeSelector`](/docs/reference/access-authn-authz/admission-controllers/#podnodeselector)
: namespaces और क्लस्टर-व्यापी स्तर पर नोड सेलेक्टर के नियंत्रण की अनुमति देता है।

[`PodTolerationRestriction`](/docs/reference/access-authn-authz/admission-controllers/#podtolerationrestriction)
: एक namespace के भीतर pods के लिए अनुमत pod tolerations के नियंत्रण की अनुमति देता है। -->

## आगे क्या

- [Pod creation के माध्यम से विशेषाधिकार वृद्धि (Privilege escalation)](/docs/reference/access-authn-authz/authorization/#privilege-escalation-via-pod-creation)
  आपको एक विशिष्ट एक्सेस नियंत्रण जोखिम के बारे में चेतावनी देता है; देखें कि आप उस
  खतरे को कैसे प्रबंधित कर रहे हैं।
  - यदि आप Kubernetes RBAC का उपयोग करते हैं, तो प्राधिकरण पर अधिक
    जानकारी के लिए [RBAC अच्छी प्रथाएँ](/docs/concepts/security/rbac-good-practices/)
    पढ़ें।
- क्लस्टर को अनजाने या दुर्भावनापूर्ण एक्सेस से बचाने की जानकारी के लिए
  [Securing a Cluster](/docs/tasks/administer-cluster/securing-a-cluster/)।
- मल्टी-टेनेंसी (multi-tenancy) पर कॉन्फ़िगरेशन विकल्पों की सिफ़ारिशों और सर्वोत्तम प्रथाओं के लिए
  [Cluster Multi-tenancy गाइड](/docs/concepts/security/multi-tenancy/)।
- Kubernetes क्लस्टर को हार्डन करने पर अतिरिक्त संसाधन के लिए ब्लॉग पोस्ट
  ["A Closer Look at NSA/CISA Kubernetes Hardening Guidance"](/blog/2021/10/05/nsa-cisa-kubernetes-hardening-guidance/#building-secure-container-images)।
