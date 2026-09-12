---
reviewers:
- thockin
title: "क्लस्टर नेटवर्किंग"
content_type: concept
weight: 50
---

<!-- overview -->

नेटवर्किंग Kubernetes का एक महत्वपूर्ण हिस्सा है, लेकिन यह समझना चुनौतीपूर्ण हो सकता है कि यह वास्तव में कैसे कार्य करता है। नेटवर्किंग से संबंधित 4 प्रमुख समस्याएँ हैं:

1. कंटेनर-से-कंटेनर संचार: इसे {{< glossary_tooltip text="Pods" term_id="pod" >}} और `localhost` संचार द्वारा हल किया जाता है।
2. Pod-से-Pod संचार: यह इस दस्तावेज़ का मुख्य विषय है।
3. Pod-से-Service संचार: यह [Services](/docs/concepts/services-networking/service/) द्वारा संभाला जाता है।
4. बाहरी-से-Service संचार: यह भी Services द्वारा संभाला जाता है।

<!-- body -->

Kubernetes का मुख्य उद्देश्य विभिन्न अनुप्रयोगों के बीच मशीनों को साझा करना है। सामान्यतः, मशीनों को साझा करने के लिए यह सुनिश्चित करना आवश्यक होता है कि दो अनुप्रयोग एक ही पोर्ट का उपयोग न करें। अनेक डेवलपर्स के बीच पोर्ट का समन्वय बड़े पैमाने पर करना कठिन होता है और यह उपयोगकर्ताओं को उनके नियंत्रण से बाहर क्लस्टर-स्तरीय समस्याओं के संपर्क में ला सकता है।

डायनामिक पोर्ट आवंटन प्रणाली को और अधिक जटिल बना देता है। प्रत्येक अनुप्रयोग को पोर्ट्स को फ्लैग्स के रूप में स्वीकार करना पड़ता है, API सर्वरों को कॉन्फ़िगरेशन ब्लॉक्स में डायनामिक पोर्ट नंबर सम्मिलित करने पड़ते हैं, और Services को एक-दूसरे को खोजने में सक्षम होना पड़ता है। इन जटिलताओं से निपटने के बजाय Kubernetes एक अलग तरीका अपनाता है।

Kubernetes नेटवर्किंग मॉडल के बारे में जानने के लिए [यहाँ](/docs/concepts/services-networking/) देखें।

## Kubernetes IP address ranges

Kubernetes क्लस्टरों में Pods, Services और Nodes के लिए गैर-अतिव्यापी (non-overlapping) IP एड्रेस आवंटित किए जाते हैं। ये उपलब्ध एड्रेस रेंज से निम्नलिखित कंपोनेंट्स द्वारा कॉन्फ़िगर किए जाते हैं:

- नेटवर्क प्लगइन Pods को IP एड्रेस असाइन करता है।
- kube-apiserver Services को IP एड्रेस असाइन करता है।
- kubelet या cloud-controller-manager Nodes को IP एड्रेस असाइन करता है।

{{< figure src="/docs/images/kubernetes-cluster-network.svg" alt="Kubernetes क्लस्टर में विभिन्न नेटवर्क रेंज को दर्शाने वाला चित्र" class="diagram-medium" >}}

## Cluster networking types {#cluster-network-ipfamilies}

कॉन्फ़िगर किए गए IP परिवारों के आधार पर Kubernetes क्लस्टरों को निम्न प्रकारों में वर्गीकृत किया जा सकता है:

- IPv4 only: नेटवर्क प्लगइन, kube-apiserver और kubelet/cloud-controller-manager केवल IPv4 एड्रेस असाइन करते हैं।
- IPv6 only: नेटवर्क प्लगइन, kube-apiserver और kubelet/cloud-controller-manager केवल IPv6 एड्रेस असाइन करते हैं।
- IPv4/IPv6 या IPv6/IPv4 [dual-stack](/docs/concepts/services-networking/dual-stack/):
  - नेटवर्क प्लगइन IPv4 और IPv6 दोनों एड्रेस असाइन करता है।
  - kube-apiserver IPv4 और IPv6 दोनों एड्रेस असाइन करता है।
  - kubelet या cloud-controller-manager IPv4 और IPv6 दोनों एड्रेस असाइन करता है।
  - सभी कंपोनेंट्स को कॉन्फ़िगर किए गए प्राथमिक IP परिवार पर सहमत होना चाहिए।

Kubernetes क्लस्टर केवल Pods, Services और Nodes ऑब्जेक्ट्स में मौजूद IP परिवारों को ध्यान में रखते हैं, न कि उन ऑब्जेक्ट्स पर वास्तव में मौजूद सभी IP एड्रेसों को। उदाहरण के लिए, किसी सर्वर या Pod के इंटरफेस पर अनेक IP एड्रेस हो सकते हैं, लेकिन Kubernetes नेटवर्क मॉडल को लागू करते समय और क्लस्टर प्रकार निर्धारित करते समय केवल `node.status.addresses` या `pod.status.ips` में मौजूद IP एड्रेसों को ही ध्यान में रखा जाता है।

## How to implement the Kubernetes network model

नेटवर्क मॉडल प्रत्येक नोड पर कंटेनर रनटाइम द्वारा लागू किया जाता है। अधिकांश कंटेनर रनटाइम अपनी नेटवर्किंग और सुरक्षा क्षमताओं को प्रबंधित करने के लिए [Container Network Interface](https://github.com/containernetworking/cni) (CNI) प्लगइन्स का उपयोग करते हैं।

विभिन्न विक्रेताओं द्वारा कई प्रकार के CNI प्लगइन्स उपलब्ध हैं। इनमें से कुछ केवल नेटवर्क इंटरफेस जोड़ने और हटाने जैसी बुनियादी सुविधाएँ प्रदान करते हैं, जबकि अन्य अधिक उन्नत सुविधाएँ प्रदान करते हैं, जैसे:

- अन्य कंटेनर ऑर्केस्ट्रेशन सिस्टम्स के साथ एकीकरण
- एकाधिक CNI प्लगइन्स का उपयोग
- उन्नत IPAM सुविधाएँ

Kubernetes द्वारा समर्थित नेटवर्किंग एडऑन्स की एक अपूर्ण सूची के लिए [यह पृष्ठ](/docs/concepts/cluster-administration/addons/#networking-and-network-policy) देखें।

## {{% heading "whatsnext" %}}

नेटवर्किंग मॉडल के प्रारंभिक डिज़ाइन और उसके पीछे के कारणों का विस्तृत विवरण [networking design document](https://git.k8s.io/design-proposals-archive/network/networking.md) में उपलब्ध है।

Kubernetes नेटवर्किंग को बेहतर बनाने के लिए भविष्य की योजनाओं और चल रहे प्रयासों के बारे में जानने के लिए SIG-Network [KEPs](https://github.com/kubernetes/enhancements/tree/master/keps/sig-network) देखें।
