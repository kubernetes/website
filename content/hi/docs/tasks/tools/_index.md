---
title: "उपकरण स्थापित करें"
description: अपने कंप्यूटर पर कुबेरनेट्स टूल सेटअप करें।
weight: 10
no_list: true
---

## kubectl

<!-- overview -->
कुबेरनेट्स कमांड-लाइन टूल, [kubectl](/docs/reference/kubectl/kubectl/), 
आपको कुबेरनेट्स क्लस्टर पर कमांड चलाने की अनुमति देता है।

आप एप्लिकेशन को डिप्लॉय करने, क्लस्टर संसाधनों का निरीक्षण 
और प्रबंधन करने और लॉग देखने के लिए kubectl का उपयोग कर सकते हैं।

kubectl संचालन की पूरी सूची सहित अधिक जानकारी के लिए, देखें 
[`kubectl` संदर्भ प्रलेखन](/docs/reference/kubectl/).

kubectl विभिन्न प्रकार के Linux प्लेटफॉर्म, macOS और Windows पर इंस्टॉल करने योग्य है।
नीचे अपना उपयुक्त ऑपरेटिंग सिस्टम खोजें।

- [kubectl Linux पर इंस्टॉल करें](/hi/docs/tasks/tools/install-kubectl-linux)
- [kubectl macOS पर इंस्टॉल करें](/hi/docs/tasks/tools/install-kubectl-macos)
- [kubectl Windows पर इंस्टॉल करें](/hi/docs/tasks/tools/install-kubectl-windows)

## kind

[`kind`](https://kind.sigs.k8s.io/docs/) आपको अपने कंप्यूटर पर कुबेरनेट्स चलाने देता है।
इस उपकरण के लिए आवश्यक है कि आपके पास 
[Docker](https://docs.docker.com/get-docker/) इंस्टॉल और कॉन्फ़िगर किया गया हो।

kind [क्विक स्टार्ट](https://kind.sigs.k8s.io/docs/user/quick-start/) 
पृष्ठ आपको दिखाता है कि kind चलाने के लिए आपको क्या करने की आवश्यकता है।

<a class="btn btn-primary" href="https://kind.sigs.k8s.io/docs/user/quick-start/" role="button" aria-label="kind क्विक स्टार्ट गाइड देखें">kind क्विक स्टार्ट गाइड देखें</a>

## minikube

`kind` की तरह, [`minikube`](https://minikube.sigs.k8s.io/) एक उपकरण 
है जो आपको स्थानीय स्तर पर कुबेरनेट्स चलाने देता है। minikube आपके कंप्यूटर 
(windows, macOS और linux पीसी सहित) पर सिंगल-नोड कुबेरनेट्स क्लस्टर चलाता 
है ताकि आप कुबेरनेट्स सीख सकें या डेवलपमेंट कर सकें।

यदि आपका ध्यान उपकरण को इंस्टॉल करने पर है तो आप मुख्य 
[आरंभ करें!](https://minikube.sigs.k8s.io/docs/start/) 
गाइड का अनुसरण कर सकते हैं।

<a class="btn btn-primary" href="https://minikube.sigs.k8s.io/docs/start/" role="button" aria-label="minikube क्विक स्टार्ट गाइड देखें">minikube क्विक स्टार्ट गाइड देखें</a>

एक बार जब आपके पास minikube काम कर रहा हो, 
तो आप इसका उपयोग [नमूना एप्लिकेशन](/docs/tutorials/hello-minikube/) 
चलाने के लिए कर सकते हैं।


## kubeadm

कुबेरनेट्स क्लस्टर बनाने और प्रबंधित करने के लिए आप {{< glossary_tooltip term_id="kubeadm" text="kubeadm" >}} टूल का उपयोग कर सकते हैं।
यह उपयोगकर्ता के अनुकूल तरीके से न्यूनतम व्यवहार्य, सुरक्षित क्लस्टर बनाने और चलाने के लिए आवश्यक कार्य करता है।

[kubeadm इंस्टॉल](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/) करना आपको दिखाता है कि kubeadm को कैसे इंस्टॉल किया जाए।
एक बार इंस्टॉल होने के बाद, आप इसका उपयोग [क्लस्टर बनाने](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/) के लिए कर सकते हैं।

<a class="btn btn-primary" href="/docs/setup/production-environment/tools/kubeadm/install-kubeadm/" role="button" aria-label="kubeadm इंस्टॉल गाइड देखें">kubeadm इंस्टॉल गाइड देखें</a>
