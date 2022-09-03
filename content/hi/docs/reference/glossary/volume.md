---
title: वॉल्यूम (Volume)
id: volume
date: 2018-04-12
full_link: /docs/concepts/storage/volumes/
short_description: >
  एक डायरेक्टरी जिसमें रहने बाले डेटा एक पॉड की कंटेनरों तक अभिगम्य होता हैं।

aka:
tags:
- core-object
- fundamental
---
  एक डायरेक्टरी जिसमें रहने बाले डेटा एक {{< glossary_tooltip text="पोड" term_id="pod" >}} की {{< glossary_tooltip text="कंटेनरों" term_id="container" >}} तक अभिगम्य होता हैं।

<!--more-->

कुबेरनेट्स वॉल्यूम तब तक रहता है जब तक पॉड इसे घेर लेता है। नतीजतन, वॉल्यूम पॉड के भीतर चलने वाले किसी भी कंटेनर से अधिक रहता है, और वॉल्यूम में डेटा कंटेनर पुनरारंभ में संरक्षित होता है।

अधिक जानकारी के लिए [संग्रहण](/docs/concepts/storage/) देखें।
