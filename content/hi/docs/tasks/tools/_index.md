---
title: "उपकरण स्थापित करें"
description: अपने कंप्यूटर पर कुबेरनेट्स टूल सेट करें.
weight: 10
no_list: true
---

## कुबेक्टल

<!-- overview -->
कुबेरनेट्स कमांड-लाइन टूल, [कुबेक्टल](/docs/reference/kubectl/kubectl/), 
आपको कुबेरनेट्स क्लस्टर पर कमांड चलाने की अनुमति देता है।

आप एप्लिकेशन को डिप्लॉय करने, क्लस्टर संसाधनों का निरीक्षण 
और प्रबंधन करने और लॉग देखने के लिए कुबेक्टल का उपयोग कर सकते हैं।

कुबेक्टल संचालन की पूरी सूची सहित अधिक जानकारी के लिए, देखें 
[`कुबेक्टल` संदर्भ प्रलेखन](/docs/reference/kubectl/).

कुबेक्टल विभिन्न प्रकार के लिनक्स प्लेटफॉर्म, मैकओएस और विंडोज पर इंस्टॉल करने योग्य है।
नीचे अपना उपयुक्त ऑपरेटिंग सिस्टम खोजें।

- [कुबेक्टल लिनक्स पर इंस्टॉल करने](/docs/tasks/tools/install-kubectl-linux)
- [कुबेक्टल लिनक्स पर मैकओएस करने](/docs/tasks/tools/install-kubectl-macos)
- [कुबेक्टल लिनक्स पर विंडोज करने](/docs/tasks/tools/install-kubectl-windows)

## काइंड (`Kind`)

[`काइंड`](https://kind.sigs.k8s.io/docs/) आपको अपने कंप्यूटर पर कुबेरनेट चलाने देता है।
इस उपकरण के लिए आवश्यक है कि आपके पास 
[डॉकर](https://docs.docker.com/get-docker/) इंस्टॉल और कॉन्फ़िगर किया गया हो।

काइंड [क्विक स्टार्ट](https://kind.sigs.k8s.io/docs/user/quick-start/) 
पृष्ठ आपको दिखाता है कि काइंड चलाने के लिए आपको क्या करने की आवश्यकता है।

<a class="btn btn-primary" href="https://kind.sigs.k8s.io/docs/user/quick-start/" role="button" aria-label="View kind Quick Start Guide">काइंड क्विक स्टार्ट गाइड देखें</a>

## मिनीक्यूब

`काइंड` की तरह, [`मिनीक्यूब`](https://minikube.sigs.k8s.io/) एक उपकरण 
है जो आपको कुबेरनेट्स चलाने देता है आपके कंप्युटर पर। मिनीक्यूब आपके कंप्यूटर 
(विंडोज़, मैकओएस और लिनक्स पीसी सहित) पर सिंगल-नोड कुबेरनेट्स क्लस्टर चलाता 
है ताकि आप कुबेरनेट्स सीख सकें, या डेवलपमेंट कर सकें।

यदि आपका ध्यान उपकरण को इंस्टॉल करने पर है तो आप मुख्य 
[आरंभ करें!](https://minikube.sigs.k8s.io/docs/start/) 
गाइड का अनुसरण कर सकते हैं।

<a class="btn btn-primary" href="https://minikube.sigs.k8s.io/docs/start/" role="button" aria-label="View minikube Get Started! Guide">मिनीक्यूब क्विक स्टार्ट गाइड देखें</a>

एक बार जब आपके पास मिनीक्यूब काम कर रहा हो, 
तो आप इसका उपयोग [नमूना एप्लिकेशन](/docs/tutorials/hello-minikube/) 
चलाने के लिए कर सकते हैं।


## कुबेदम

कुबेरनेट्स क्लस्टर बनाने और प्रबंधित करने के लिए आप {{< glossary_tooltip term_id="kubeadm" text="kubeadm" >}} टूल का उपयोग कर सकते हैं।
यह उपयोगकर्ता के अनुकूल तरीके से न्यूनतम व्यवहार्य, सुरक्षित क्लस्टर बनाने और चलाने के लिए आवश्यक कार्य करता है।

[कुबेदम इंस्टॉल](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/) करना आपको दिखाता है कि कुबेदम को कैसे इंस्टॉल किया जाए।
एक बार इंस्टॉल होने के बाद, आप इसका उपयोग [क्लस्टर बनाने](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/) के लिए कर सकते हैं।

<a class="btn btn-primary" href="/docs/setup/production-environment/tools/kubeadm/install-kubeadm/" role="button" aria-label="View kubeadm Install Guide">कुबेदम इंस्टॉल गाइड देखें</a>
