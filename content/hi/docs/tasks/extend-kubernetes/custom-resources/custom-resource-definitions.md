---
title: CustomResourceDefinitions के साथ Kubernetes API का विस्तार करें
reviewers:
- deads2k
- jpbetz
- liggitt
- roycaihw
- sttts
content_type: task
min-kubernetes-server-version: 1.16
weight: 20
---

<!-- overview -->
यह पेज दिखाता है कि कैसे [CustomResourceDefinition](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#customresourcedefinition-v1-apiextensions-k8s-io) बनाकर Kubernetes API में एक [कस्टम रिसोर्स](/docs/concepts/extend-kubernetes/api-extension/custom-resources/) को इंस्टॉल किया जाए।

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
यदि आप Kubernetes का कोई पुराना संस्करण उपयोग कर रहे हैं जो अभी भी समर्थित है, तो उस संस्करण के लिए दस्तावेज़ीकरण पर स्विच करें जो आपके क्लस्टर के लिए प्रासंगिक है।

<!-- steps -->

## CustomResourceDefinition बनाएं

जब आप एक नया CustomResourceDefinition (CRD) बनाते हैं, तो Kubernetes API सर्वर आपके द्वारा निर्दिष्ट प्रत्येक संस्करण के लिए एक नया RESTful रिसोर्स पथ बनाता है। CRD ऑब्जेक्ट से बनाया गया कस्टम रिसोर्स या तो नेमस्पेस्ड या क्लस्टर-स्कोप्ड हो सकता है, जैसा कि CRD के `spec.scope` फ़ील्ड में निर्दिष्ट है। मौजूदा बिल्ट-इन ऑब्जेक्ट्स की तरह, नेमस्पेस को हटाने से उस नेमस्पेस में सभी कस्टम ऑब्जेक्ट्स हट जाते हैं। CustomResourceDefinitions स्वयं नॉन-नेमस्पेस्ड होते हैं और सभी नेमस्पेस के लिए उपलब्ध होते हैं।

उदाहरण के लिए, यदि आप निम्नलिखित CustomResourceDefinition को `resourcedefinition.yaml` में सहेजते हैं: 