---
title: Container Runtime
id: container-runtime
date: 2019-06-05
full_link: /docs/setup/production-environment/container-runtimes
short_description: >
 कंटेनर रनटाइम वह सॉफ़्टवेयर है जो कंटेनर चलाने के लिए ज़िम्मेदार है।
aka:
tags:
- fundamental
- workload
---
 एक मूलभूत घटक जो कुबेरनेट्स को कंटेनरों को प्रभावी ढंग से चलाने के लिए सशक्त बनाता है। यह कुबेरनेट्स पर्यावरण के भीतर कंटेनरों के निष्पादन और जीवनचक्र के प्रबंधन के लिए जिम्मेदार है।

<!--more-->

कुबेरनेट्स कंटेनर रनटाइम जैसे {{<glossary_tooltip text="कंटेनरडी" term_id="containerd">}},  {{<glossary_tooltip term_id="cri-o">}} और [कुबेरनेट्स cri (कंटेनर रनटाइम इंटरफ़ेस)](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/container-runtime-interface.md) के किसी भी अन्य कार्यान्वयन का समर्थन करता है।