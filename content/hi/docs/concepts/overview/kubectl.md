---
title: kubectl कमांड-लाइन टूल
content_type: concept
description: >
  kubectl एक प्राथमिक कमांड-लाइन टूल है जिसका उपयोग कुबेरनेट्स क्लस्टर के साथ संवाद करने के लिए किया जाता है। यह पृष्ठ kubectl और कुबेरनेट्स इकोसिस्टम में इसकी भूमिका का अवलोकन प्रदान करता है।
weight: 50
card:
  name: concepts
  title: kubectl
  weight: 40
---

<!-- overview -->

{{< glossary_definition prepend="कुबेरनेट्स प्रदान करता है" term_id="kubectl" length="short" >}}

`kubectl` टूल [कुबेरनेट्स API](/docs/concepts/overview/kubernetes-api/) के माध्यम से आपके क्लस्टर के साथ संवाद करता है।
कॉन्फ़िगरेशन के लिए, `kubectl` `$HOME/.kube` निर्देशिका में `config` नामक एक फ़ाइल की तलाश करता है।
आप `KUBECONFIG` पर्यावरण चर सेट करके या [`--kubeconfig`](/docs/concepts/configuration/organize-cluster-access-kubeconfig/) ध्वज सेट करके अन्य [kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/) फ़ाइलें निर्दिष्ट कर सकते हैं।

<!-- body -->

## kubectl की भूमिका (Role of kubectl)

`kubectl` टूल कुबेरनेट्स ऑब्जेक्ट बनाने, निरीक्षण करने, अपडेट करने और हटाने के लिए प्राथमिक इंटरफ़ेस है।
यह आपके क्लस्टर के अंदर चलने वाले [कुबेरनेट्स घटकों](/hi/docs/concepts/overview/components/) और उन घटकों द्वारा लागू किए गए [कुबेरनेट्स API](/docs/concepts/overview/kubernetes-api/) का पूरक है।
चाहे आप अपने लैपटॉप से `kubectl` चलाएँ या क्लस्टर के अंदर किसी पॉड से, यह API सर्वर को अनुरोध भेजता है।
अन्य क्लाइंट, जैसे [क्लाइंट लाइब्रेरी](/docs/reference/using-api/client-libraries/) और वेब डैशबोर्ड
जैसे [Headlamp](https://headlamp.dev/), भी उसी API के माध्यम से संवाद करते हैं।

## kubectl कैसे काम करता है (How kubectl works)

`kubectl` टूल API सर्वर से जुड़ता है और आपकी [kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/) फ़ाइल में परिभाषित क्लस्टर, उपयोगकर्ता और संदर्भ का उपयोग करके प्रमाणित करता है।
जब आप क्लस्टर के बाहर से `kubectl` चलाते हैं, तो यह API सर्वर का पता और क्रेडेंशियल खोजने के लिए kubeconfig फ़ाइल का उपयोग करता है।
जब `kubectl` किसी पॉड के अंदर चलता है (उदाहरण के लिए, CI/CD पाइपलाइन में), तो यह पॉड में माउंट किए गए ServiceAccount टोकन के आधार पर इन-क्लस्टर प्रमाणीकरण का उपयोग कर सकता है।

जब आप कोई कमांड चलाते हैं, तो `kubectl` आपके इरादे को [कुबेरनेट्स API](/docs/concepts/overview/kubernetes-api/) के लिए एक या अधिक HTTP अनुरोधों में अनुवादित करता है। API सर्वर प्रत्येक अनुरोध को मान्य करता है, इसे {{< glossary_tooltip text="etcd" term_id="etcd" >}} में सहेजी गई क्लस्टर स्थिति पर लागू करता है, और परिणाम देता है। इसका मतलब है कि प्रत्येक `kubectl` क्रिया, चाहे परिनियोजन (Deployment) बनाना हो या लॉग पढ़ना हो, उसी API-संचालित पथ का अनुसरण करती है।

चूँकि आपकी kubeconfig कई क्लस्टर, उपयोगकर्ता और संदर्भों को परिभाषित कर सकती है, इसलिए आप अपने परिवेश को फिर से कॉन्फ़िगर किए बिना क्लस्टर्स के बीच स्विच करने के लिए `kubectl` का उपयोग कर सकते हैं। सक्रिय संदर्भ को बदलने के लिए `kubectl config use-context` चलाएँ।

## आप kubectl के साथ क्या कर सकते हैं (What you can do with kubectl)

`kubectl` टूल कई ऑपरेशनों का समर्थन करता है, जो इन व्यापक श्रेणियों में आते हैं:

* **संसाधनों का प्रबंधन (Manage resources)** – पॉड्स, डिप्लॉयमेंट्स और सर्विसेज जैसे ऑब्जेक्ट बनाएं, अपडेट करें और हटाएं।
  कॉन्फ़िगरेशन फ़ाइलों से घोषणात्मक प्रबंधन के लिए `kubectl apply` का उपयोग करें।
* **क्लस्टर स्थिति का निरीक्षण करें (Inspect cluster state)** – ऑब्जेक्ट को सूचीबद्ध करें और उसका वर्णन करें, ईवेंट देखें और संसाधन उपयोग की जांच करें।
* **डिबग (Debug)** – कंटेनरों से लॉग देखें, चल रहे कंटेनर के अंदर कमांड निष्पादित करें, या पॉड के लिए पोर्ट-फॉरवर्ड करें।
* **क्लस्टर संचालन (Cluster operations)** – रखरखाव के लिए नोड्स को खाली (drain) करें, नए कार्यभार को रोकने के लिए नोड्स को कॉर्डन (cordon) करें, और क्लस्टर कॉन्फ़िगरेशन प्रबंधित करें।
* **स्क्रिप्ट और स्वचालित करें (Script and automate)** – स्क्रिप्ट और पाइपलाइनों में उपयोग के लिए [JSONPath](/docs/reference/kubectl/jsonpath/) का उपयोग करके आउटपुट को JSON, YAML या कस्टम कॉलम के रूप में प्रारूपित करें।

सिंटैक्स, कमांड संदर्भ और उदाहरणों के लिए, [kubectl संदर्भ प्रलेखन](/docs/reference/kubectl/) देखें।

## घोषणात्मक बनाम अनिवार्य (Declarative vs imperative)

उत्पादन कार्यभार के लिए, संस्करण-नियंत्रित कॉन्फ़िगरेशन फ़ाइलों के साथ `kubectl apply` का उपयोग करके [घोषणात्मक ऑब्जेक्ट प्रबंधन](/docs/concepts/overview/working-with-objects/object-management/) को प्राथमिकता दें।
घोषणात्मक प्रबंधन आपको परिवर्तनों को ट्रैक करने, सहयोग करने और GitOps वर्कफ़्लो के साथ एकीकृत करने में मदद करता है।
अनिवार्य कमांड (जैसे `kubectl create` या `kubectl run`) विकास और प्रयोग के लिए उपयोगी होते हैं,
लेकिन उन्हें पुन: पेश करना और ऑडिट करना कठिन होता है।

## प्लगइन्स के साथ kubectl का विस्तार (Extending kubectl with plugins)

आप `kubectl` को [प्लगइन्स](/docs/tasks/extend-kubectl/kubectl-plugins/) के साथ विस्तारित कर सकते हैं जो नए
उप-कमांड जोड़ते हैं। प्लगइन्स स्टैंडअलोन बायनेरिज़ हैं जो `kubectl-<plugin-name>` नामकरण सम्मेलन का पालन करते हैं।
कुबेरनेट्स समुदाय कई प्लगइन्स का रखरखाव करता है, और आप उन्हें [Krew](https://krew.sigs.k8s.io/) प्लगइन मैनेजर के साथ प्रबंधित कर सकते हैं।

## संस्करण अनुकूलता (Version compatibility)

`kubectl` टूल क्लस्टर के कंट्रोल प्लेन के सापेक्ष प्लस-या-माइनस एक माइनर संस्करण के संस्करण तिरछापन (version skew) का समर्थन करता है। उदाहरण के लिए, `kubectl` v1.32, v1.31, v1.32 और v1.33 पर कंट्रोल प्लेन के साथ काम करता है।
एक संगत संस्करण का उपयोग करने से अप्रत्याशित व्यवहार से बचा जा सकता है। विवरण के लिए
[संस्करण तिरछापन नीति (version skew policy)](/releases/version-skew-policy/) देखें।

## {{% heading "whatsnext" %}}

* सिंटैक्स और कमांड विवरण के लिए [kubectl संदर्भ](/docs/reference/kubectl/) पढ़ें।
* अपनी मशीन पर [kubectl स्थापित करें](/docs/tasks/tools/#kubectl)।
* [कुबेरनेट्स API](/docs/concepts/overview/kubernetes-api/) के बारे में जानें जिसका उपयोग `kubectl` करता है।
* एक क्लस्टर बनाने वाले [कुबेरनेट्स घटकों](/hi/docs/concepts/overview/components/) की समीक्षा करें।
* [ऑब्जेक्ट प्रबंधन](/docs/concepts/overview/working-with-objects/object-management/) और घोषणात्मक कॉन्फ़िगरेशन का अन्वेषण करें।
* समर्थित संस्करण संयोजनों के लिए [संस्करण तिरछापन नीति](/releases/version-skew-policy/) की जांच करें।
