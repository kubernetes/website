---
title: कंटेनर रनटाइम इंटरफ़ेस (Container Runtime Interface)
id: container-runtime-interface
date: 2021-11-24
full_link: /docs/concepts/architecture/cri
short_description: >
  क्यूबलेट और कंटेनर रनटाइम के बीच संचार के लिए मुख्य प्रोटोकॉल।

aka:
tags:
  - cri
---

क्यूबलेट और कंटेनर रनटाइम के बीच संचार के लिए मुख्य प्रोटोकॉल।

<!--more-->

[क्लस्टर घटक](/docs/concepts/overview/components/#node-components) {{< glossary_tooltip text="क्यूबलेट" term_id="kubelet" >}} और {{< glossary_tooltip text="कंटेनर रनटाइम" term_id="container-runtime" >}} के बीच संचार के लिए कुबेरनेट्स कंटेनर रनटाइम इंटरफेस (सीआरआई) मुख्य [gRPC](https://grpc.io) प्रोटोकॉल को परिभाषित करता है।
