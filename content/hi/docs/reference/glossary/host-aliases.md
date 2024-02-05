---
title: HostAliases
id: HostAliases
date: 2019-01-31
full_link: /docs/reference/generated/kubernetes-api/{{< param "version" >}}/#hostalias-v1-core
short_description: >
  HostAliases IP पते और होस्टनाम के बीच एक मैपिंग है जिसे पॉड की होस्ट फ़ाइल में इंजेक्ट किया जाता है।

aka:
tags:
- operation
---
 HostAliases IP पते और होस्टनाम के बीच एक मैपिंग है जिसे {{<glossary_tooltip text="पॉड" term_id="pod" >}} की होस्ट फ़ाइल में इंजेक्ट किया जाता है।

<!--more-->

[HostAliases](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#hostalias-v1-core) होस्टनाम और आईपी पते की एक वैकल्पिक सूची है जिसे पॉड के होस्ट में इंजेक्ट किया जाएगा यदि निर्दिष्ट हो तो फ़ाइल करें। यह केवल गैर-होस्टनेटवर्क पॉड्स के लिए मान्य है।