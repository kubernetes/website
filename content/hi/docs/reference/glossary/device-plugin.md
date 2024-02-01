---
title: Device Plugin
id: device-plugin
date: 2019-02-02
full_link: /docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/
short_description: >
  पोड्स को उन उपकरणों तक पहुंचने की अनुमति देने के लिए सॉफ़्टवेयर एक्सटेंशन, जिन्हें विक्रेता-विशिष्ट आरंभीकरण या सेटअप की आवश्यकता होती है
aka:
tags:
- fundamental
- extension
---
डिवाइस प्लगइन्स वर्कर {{<glossary_tooltip text="नोड्स" term_id="node" >}} पर चलते हैं और {{<glossary_tooltip text="पॉड्स" term_id="pod" >}} को स्थानीय हार्डवेयर जैसे संसाधनों तक पहुंच प्रदान करते हैं, जिनके लिए विक्रेता-विशिष्ट आरंभीकरण या सेटअप चरणों की आवश्यकता होती है।

<!--more-->

डिवाइस प्लगइन्स {{<glossary_tooltip text="क्यूबलेट" term_id="kubelet" >}} पर संसाधनों का विज्ञापन करते हैं, ताकि कार्यभार पॉड हार्डवेयर सुविधाओं तक पहुंच सकें,यह हार्डवेयर सुविधाएं उस नोड से संबंधित हैं जहां पॉड चल रहा है।

आप एक डिवाइस प्लगइन को {{<glossary_tooltip text="डेमोंसेट" term_id="daemonset">}} के रूप में तैनात कर सकते हैं, या प्रत्येक लक्ष्य नोड पर सीधे डिवाइस प्लगइन सॉफ़्टवेयर स्थापित कर सकते हैं।

अधिक जानकारी के लिए [डिवाइस प्लगइन्स](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/) देखें।