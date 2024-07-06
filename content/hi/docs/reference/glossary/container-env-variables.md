---
title: Container Environment Variables
id: container-env-variables
date: 2018-04-12
full_link: /docs/concepts/containers/container-environment/
short_description: >
  कंटेनर पर्यावरण चर name=value जोड़े हैं जो पॉड में चल रहे कंटेनरों में उपयोगी जानकारी प्रदान करते हैं।

aka: 
tags:
- fundamental
---
 कंटेनर पर्यावरण चर name=value जोड़े हैं जो {{<glossary_tooltip text="पॉड" term_id="pod">}} में चल रहे कंटेनरों में उपयोगी जानकारी प्रदान करते हैं।

<!--more-->

कंटेनर पर्यावरण चर कंटेनर के लिए महत्वपूर्ण संसाधनों के बारे में जानकारी के साथ-साथ चल रहे कंटेनरीकृत अनुप्रयोगों के लिए आवश्यक जानकारी प्रदान करते हैं। उदाहरण के लिए, फ़ाइल सिस्टम विवरण, स्वयं {{<glossary_tooltip text="कंटेनर" term_id="container">}} के बारे में जानकारी, और अन्य क्लस्टर संसाधन जैसे सेवा समापन बिंदु।