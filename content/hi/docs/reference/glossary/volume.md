---
title: वॉल्यूम
id: volume
date: 2018-04-12
full_link: /docs/concepts/storage/volumes/
short_description: >
  एक निर्देशिका जिसमें डेटा होता है, जो पॉड में कंटेनरों तक पहुंच योग्य होता है।
aka: Volume
tags:
- core-object
- fundamental
---
 एक निर्देशिका जिसमें डेटा होता है, जो {{<glossary_tooltip text="पॉड" term_id="pod">}} में {{<glossary_tooltip text="कंटेनरों" term_id="container">}} तक पहुंच योग्य होता है।.

<!--more-->

कुबेरनेट्स वॉल्यूम तब तक जीवित रहता है जब तक कि उसे घेरने वाला पॉड। नतीजतन, एक वॉल्यूम पॉड के भीतर चलने वाले किसी भी कंटेनर से अधिक समय तक जीवित रहता है, और वॉल्यूम में डेटा कंटेनर पुनरारंभ में संरक्षित होता है।

अधिक जानकारी के लिए [स्टोरेज](/docs/concepts/storage/) देखें.
