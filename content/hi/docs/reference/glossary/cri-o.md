---
title: CRI-O
id: cri-o
date: 2019-05-14
full_link: https://cri-o.io/#what-is-cri-o
short_description: >
  कुबेरनेट्स के लिए विशेष रूप से एक हल्का कंटेनर रनटाइम
aka:
tags:
- tool
---
एक उपकरण जो आपको Kubernetes CRI के साथ OCI कंटेनर रनटाइम का उपयोग करने देता है।

<!--more-->

CRI-O ओपन कंटेनर इनिशिएटिव (OCI) [रनटाइम  स्पेक](https://www.github.com/opencontainers/runtime-spec) के साथ संगत {{<glossary_tooltip text="कंटेनर" term_id="container-runtime">}} रनटाइम का उपयोग करने में सक्षम करने के लिए {{<glossary_tooltip term_id="cri">}} का कार्यान्वयन है।

सीआरआई-ओ को तैनात करने से कुबेरनेट्स को {{<glossary_tooltip text="पॉड्स" term_id="pod">}} चलाने के लिए कंटेनर रनटाइम के रूप में किसी भी ओसीआई-अनुरूप रनटाइम का उपयोग करने और दूरस्थ रजिस्ट्रियों से ओसीआई कंटेनर छवियों को लाने की अनुमति मिलती है।