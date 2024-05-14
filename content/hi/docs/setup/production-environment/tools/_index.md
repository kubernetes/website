---
title: "परिनियोजन टूल के साथ कुबेरनेट्स स्थापित करे"
weight: 30
no_list: true
---

अपना स्वयं का प्रोडक्शन कुबेरनेट्स क्लस्टर स्थापित करने के लिए कई विधियाँ और उपकरण है। उदाहरण के लिए:

- [kubeadm](/docs/setup/production-environment/tools/kubeadm/)

- [kops](https://kops.sigs.k8s.io/): एक स्वचालित क्लस्टर प्रावधान उपकरण। ट्यूटोरियल, सर्वोत्तम प्रथाओं, कॉन्फ़िगरेशन विकल्पों और समुदाय तक पहुंचने की जानकारी के लिए, कृपया [`kOps` वेबसाइट](https://kops.sigs.k8s.io/) देखें।

- [kubespray](https://kubespray.io/): सामान्य OS/कुबेरनेट्स क्लस्टर कॉन्फ़िगरेशन प्रबंधन कार्यों के लिए [अन्सिबल](https://docs.ansible.com/) प्लेबुकस, [इन्वेंट्री](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/ansible.md#inventory), प्रोविजनिंग टूल और डोमेन ज्ञान की एक संरचना। आप स्लैक चैनल [#kubespray](https://kubernetes.slack.com/messages/kubespray/) पर समुदाय को संपर्क कर सकते है।