---
title: लीज़्स
content_type: concept
weight: 30
---

<!-- overview -->

वितरित प्रणालियों को अक्सर "लीज़्स" की आवश्यकता होती है, जो साझा संसाधनों को लॉक करने और नोड्स के बीच गतिविधि को समन्वयित करने के लिए एक तंत्र प्रदान करता है।
कुबेरनेट्स में, "लीज" अवधारणा को `coordination.k8s.io` एपीआई समूह में `Lease` ऑब्जेक्ट्स द्वारा दर्शाया गया है, जो सिस्टम-क्रिटिकल के लिए उपयोग किए जाते हैं जैसी नोड हार्ट बीट्स और कंपोनेंट-लेवल लीडर इलेक्शन  ।

<!-- body -->

## नोड हार्ट बीट्स

कुबेरनेट्स लीज एपीआई का उपयोग करता है क्यूबलेट नोड हार्ट बिट्स को कुबेरनेट्स एपीआई सर्वर तक संप्रेषित करने के लिए ।
प्रत्येक 'Node' के लिए, 'kube-node-lease' में मेल खाने वाले नाम के साथ एक 'Lease' ऑब्जेक्ट होता है
नाम स्थान।
हुड के तहत, प्रत्येक क्यूबलेट हार्ट बिट्स हर एक `Lease` वस्तु के लिए एक अपडेट अनुरोध है, जो `spec.renewTime` फ़ील्ड को अद्यतन करता है|
कुबेरनेट्स कंट्रोल प्लेन इस क्षेत्र के टाइम स्टैम्प का उपयोग करता है
इस 'Node' की उपलब्धता निर्धारित करने के लिए।

देखो [Node Lease objects](/docs/concepts/architecture/nodes/#heartbeats) अधिक जानकारी के लिए.

## नेता चुनाव

कुबेरनेट्स में पट्टों का उपयोग यह सुनिश्चित करने के लिए भी किया जाता है कि किसी भी समय अवयव का केवल एक उदाहरण चल रहा है|
इसका उपयोग कंट्रोल प्लेन घटकों जैसे `kube-controller-manager` और `kube-scheduler` द्वारा किया जाता है
HA कॉन्फ़िगरेशन में, जहां घटक का केवल एक उदाहरण सक्रिय रूप से चलना चाहिए जबकि अन्य
उदाहरण स्टैंड-बाय पर हैं|

## API सर्वर पहचान

{{< feature-state for_k8s_version="v1.26" state="beta" >}}

कुबेरनेट्स v1.26 से शुरू होकर, प्रत्येक `kube-apiserver` अपनी पहचान को बाकी प्रणाली में प्रकाशित करने के लिए लीज एपीआई का उपयोग करता है।
जबकि अपने आप में यह विशेष रूप से उपयोगी नहीं है, यह ग्राहकों के लिए एक तंत्र प्रदान करता है यह पता लगाएँ कि `kube-apiserver` के कितने उदाहरण कुबेरनेट्स नियंत्रण प्लेन का संचालन कर रहे हैं।
kube-apiserver लीज़ का अस्तित्व भविष्य की क्षमताओं को सक्षम बनाता है प्रत्येक kube-apiserver जिनके बीच समन्वय की आवश्यकता हो सकती है।
आप `kube-system` नेमस्पेस में लीज ऑब्जेक्ट्स की जांच करके प्रत्येक क्यूब-एपीसर्वर के स्वामित्व वाले Lease का निरीक्षण कर सकते हैं
`kube-apiserver-<sha256-hash>` नाम से।

वैकल्पिक रूप से आप इस लेबल चयनकर्ता का उपयोग कर सकते हैं `k8s.io/component=kube-apiserver`:

```shell
$ kubectl -n kube-system get lease -l k8s.io/component=kube-apiserver
NAME                                        HOLDER                                                                           AGE
kube-apiserver-c4vwjftbvpc5os2vvzle4qg27a   kube-apiserver-c4vwjftbvpc5os2vvzle4qg27a_9cbf54e5-1136-44bd-8f9a-1dcd15c346b4   5m33s
kube-apiserver-dz2dqprdpsgnm756t5rnov7yka   kube-apiserver-dz2dqprdpsgnm756t5rnov7yka_84f2a85d-37c1-4b14-b6b9-603e62e4896f   4m23s
kube-apiserver-fyloo45sdenffw2ugwaz3likua   kube-apiserver-fyloo45sdenffw2ugwaz3likua_c5ffa286-8a9a-45d4-91e7-61118ed58d2e   4m43s
```
लीज़्स के नाम में इस्तेमाल किया गया SHA256 हैश OS होस्टनाम पर आधारित है जैसा कि kube-apiserver द्वारा देखा गया है। प्रत्येक kube-apiserver को एक होस्टनाम का उपयोग करने के लिए कॉन्फ़िगर किया जाना चाहिए जो क्लस्टर के भीतर अद्वितीय है। kube-apiserver के नए उदाहरण जो एक ही होस्टनाम का उपयोग करते हैं, एक नई धारक पहचान का उपयोग करके मौजूदा लीज़्स को ले लेंगे, जो कि नई लीज वस्तुओं को तत्काल करने के विपरीत है। आप `kubernetes.io/hostname` लेबल के मान की जांच करके क्यूब-एपिसेवर द्वारा उपयोग किए गए होस्टनाम की जांच कर सकते हैं :

```shell
$ kubectl -n kube-system get lease kube-apiserver-c4vwjftbvpc5os2vvzle4qg27a -o yaml
```

```yaml
apiVersion: coordination.k8s.io/v1
kind: Lease
metadata:
  creationTimestamp: "2022-11-30T15:37:15Z"
  labels:
    k8s.io/component: kube-apiserver
    kubernetes.io/hostname: kind-control-plane
  name: kube-apiserver-c4vwjftbvpc5os2vvzle4qg27a
  namespace: kube-system
  resourceVersion: "18171"
  uid: d6c68901-4ec5-4385-b1ef-2d783738da6c
spec:
  holderIdentity: kube-apiserver-c4vwjftbvpc5os2vvzle4qg27a_9cbf54e5-1136-44bd-8f9a-1dcd15c346b4
  leaseDurationSeconds: 3600
  renewTime: "2022-11-30T18:04:27.912073Z"
```

क्यूब-एपिसर्वर के समाप्त हो चुके लीज़्स जो अब मौजूद नहीं हैं, उन्हें नए क्यूब-एपिसर्वर द्वारा 1 घंटे के बाद कचरा एकत्र किए जाते हैं।
