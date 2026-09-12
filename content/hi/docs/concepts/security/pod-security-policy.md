---
title: पॉड सुरक्षा नीतियां (Pod Security Policies)
content_type: concept
weight: 30
---

<!-- overview -->

{{% alert title="हटा दी गई सुविधा" color="warning" %}}
PodSecurityPolicy को Kubernetes v1.21 में [बर्खास्त (deprecated)](/blog/2021/04/08/kubernetes-1-21-release-announcement/#podsecuritypolicy-deprecation) कर दिया गया था, और v1.25 में Kubernetes से हटा दिया गया है।
{{% /alert %}}

PodSecurityPolicy का उपयोग करने के बजाय, आप इनमें से किसी एक या दोनों का उपयोग करके Pods पर समान प्रतिबंध लागू कर सकते हैं:

- [पॉड सुरक्षा स्वीकृति (Pod Security Admission)](/docs/concepts/security/pod-security-admission/)
- एक तृतीय-पक्ष (3rd party) एडमिशन प्लगइन, जिसे आप स्वयं तैनात (deploy) और कॉन्फ़िगर करते हैं

माइग्रेशन गाइड के लिए, [PodSecurityPolicy से Built-In PodSecurity एडमिशन कंट्रोलर पर माइग्रेट करें](/docs/tasks/configure-pod-container/migrate-from-psp/) देखें।
इस API को हटाए जाने के बारे में अधिक जानकारी के लिए,
[PodSecurityPolicy का हटाया जाना: अतीत, वर्तमान और भविष्य (Past, Present, and Future)](/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/) देखें।

यदि आप Kubernetes v{{< skew currentVersion >}} नहीं चला रहे हैं, तो अपने Kubernetes संस्करण के लिए दस्तावेज़ देखें।
