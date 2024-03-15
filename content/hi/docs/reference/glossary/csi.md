---
title: Container Storage Interface (CSI)
id: csi
date: 2018-06-25
full_link: /docs/concepts/storage/volumes/#csi
short_description: >
    कंटेनर स्टोरेज इंटरफ़ेस (सीएसआई) स्टोरेज सिस्टम को कंटेनरों में उजागर करने के लिए एक मानक इंटरफ़ेस को परिभाषित करता है।
aka: 
tags:
- storage 
---
 कंटेनर स्टोरेज इंटरफ़ेस (सीएसआई) स्टोरेज सिस्टम को कंटेनरों में उजागर करने के लिए एक मानक इंटरफ़ेस को परिभाषित करता है।

<!--more--> 

सीएसआई विक्रेताओं को कुबेरनेट्स रिपॉजिटरी (आउट-ऑफ-ट्री प्लगइन्स) में जोड़े बिना कुबेरनेट्स के लिए कस्टम स्टोरेज प्लगइन बनाने की अनुमति देता है। किसी स्टोरेज प्रदाता से CSI ड्राइवर का उपयोग करने के लिए, आपको पहले [इसे अपने क्लस्टर में तैनात करना होगा](https://kubernetes-csi.github.io/docs/deploying.html)। फिर आप एक {{< glossary_tooltip text="स्टोरेज-क्लास" term_id="storage-class" >}} बनाने में सक्षम होंगे जो उस सीएसआई ड्राइवर का उपयोग करता है।

* [CSI in the Kubernetes documentation](/docs/concepts/storage/volumes/#csi)
* [List of available CSI drivers](https://kubernetes-csi.github.io/docs/drivers.html)