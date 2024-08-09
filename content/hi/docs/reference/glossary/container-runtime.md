---
title: कंटेनर रनटाइम
id: container-runtime
date: 2019-06-05
full_link: /docs/setup/production-environment/container-runtimes
short_description: >
  कंटेनर रनटाइम वह सॉफ़्टवेयर है जो कंटेनर्स को चलाने के लिए जिम्मेदार है।

aka:
tags:
- fundamental
- workload
---
कुबरनेटीज को कंटेनर्स को प्रभावी रूप से चलाने की क्षमता प्रदान करने वाला एक मौलिक घटक है।
इसका कार्य कुबरनेटीज वातावरण में कंटेनर्स के क्रियान्वयन और जीवनकाल का प्रबंधन करना है।

<!--more-->

कुबरनेटीज कंटेनर रनटाइम्स का समर्थन करता है जैसे:
{{< glossary_tooltip term_id="containerd" >}}, {{< glossary_tooltip term_id="cri-o" >}},
और [कुबरनेटीज CRI (कंटेनर रनटाइम इंटरफेस)](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/container-runtime-interface.md) के किसी अन्य प्रस्तुतिकरण का।
