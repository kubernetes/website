---
title: "Kubernetes में प्रॉक्सी"
content_type: concept
weight: 100
---

<!-- overview -->

यह पृष्ठ Kubernetes के साथ उपयोग की जाने वाली प्रॉक्सी के बारे में बताता है।


<!-- body -->

## प्रॉक्सी

Kubernetes का उपयोग करते समय आपको कई अलग-अलग प्रकार की प्रॉक्सी का सामना करना पड़ सकता है:

1. [kubectl proxy](/docs/tasks/access-application-cluster/access-cluster/#directly-accessing-the-rest-api):

    - उपयोगकर्ता के डेस्कटॉप या किसी Pod में चलता है
    - localhost एड्रेस से Kubernetes apiserver तक प्रॉक्सी करता है
    - क्लाइंट से प्रॉक्सी तक HTTP का उपयोग करता है
    - प्रॉक्सी से apiserver तक HTTPS का उपयोग करता है
    - apiserver का पता लगाता है
    - प्रमाणीकरण हेडर जोड़ता है

1. [apiserver proxy](/docs/tasks/access-application-cluster/access-cluster-services/#discovering-builtin-services):

    - apiserver में निर्मित एक bastion के रूप में कार्य करता है
    - क्लस्टर के बाहर मौजूद उपयोगकर्ता को उन क्लस्टर IPs से कनेक्ट करता है, जो अन्यथा पहुँच योग्य नहीं हो सकते हैं
    - apiserver प्रक्रियाओं में चलता है
    - क्लाइंट से प्रॉक्सी तक HTTPS का उपयोग करता है (या यदि apiserver को इस प्रकार कॉन्फ़िगर किया गया हो तो HTTP)
    - प्रॉक्सी से लक्ष्य तक HTTP या HTTPS का उपयोग कर सकता है, जिसका चयन प्रॉक्सी उपलब्ध जानकारी के आधार पर करता है
    - किसी Node, Pod या Service तक पहुँचने के लिए उपयोग किया जा सकता है
    - Service तक पहुँचने पर लोड बैलेंसिंग करता है

1. [kube proxy](/docs/concepts/services-networking/service/#ips-and-vips):

    - प्रत्येक Node पर चलता है
    - UDP, TCP और SCTP को प्रॉक्सी करता है
    - HTTP को नहीं समझता है
    - लोड बैलेंसिंग प्रदान करता है
    - इसका उपयोग केवल Services तक पहुँचने के लिए किया जाता है

1. apiserver(s) के सामने एक Proxy/Load-balancer:

    - इसका अस्तित्व और कार्यान्वयन प्रत्येक क्लस्टर के अनुसार अलग-अलग होता है (उदाहरण के लिए nginx)
    - सभी क्लाइंट और एक या अधिक apiservers के बीच स्थित होता है
    - यदि कई apiservers हों, तो लोड बैलेंसर के रूप में कार्य करता है

1. बाहरी Services पर Cloud Load Balancers:

    - कुछ cloud providers द्वारा प्रदान किए जाते हैं (उदाहरण के लिए AWS ELB, Google Cloud Load Balancer)
    - Kubernetes Service का type `LoadBalancer` होने पर स्वचालित रूप से बनाए जाते हैं
    - आमतौर पर केवल UDP/TCP का समर्थन करते हैं
    - SCTP का समर्थन cloud provider के load balancer implementation पर निर्भर करता है
    - इनका कार्यान्वयन cloud provider के अनुसार अलग-अलग होता है

Kubernetes उपयोगकर्ताओं को आमतौर पर पहले दो प्रकारों के अलावा किसी अन्य प्रकार के बारे में चिंता करने की आवश्यकता नहीं होगी। क्लस्टर एडमिन आमतौर पर यह सुनिश्चित करेगा कि बाद वाले प्रकार सही तरीके से सेट अप किए गए हों।

## रीडायरेक्ट का अनुरोध करना

प्रॉक्सी ने रीडायरेक्ट क्षमताओं का स्थान ले लिया है। रीडायरेक्ट को अप्रचलित (deprecated) कर दिया गया है।
