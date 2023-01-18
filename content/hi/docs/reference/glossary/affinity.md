---
title: आत्मीयता
id: affinity
date: 2019-01-11
full_link: /docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity
short_description: >
     पॉड्स को कहां रखा जाए, यह निर्धारित करने के लिए शेड्यूलर द्वारा उपयोग किए जाने वाले नियम
aka:
tags:
- fundamental
---

कुबेरनेट्स में, _आत्मीयता_ नियमों का एक समूह है जो शेड्यूलर को संकेत देता है कि पॉड्स को कहाँ रखा जाए।

<!--more-->
आत्मीयता दो प्रकार की होती है:
* [नोड आत्मीयता](/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity)
* [पॉड-टू-पॉड आत्मीयता](/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)

नियमों को कुबेरनेट्स {{< glossary_tooltip term_id="label" text="लेबल">}} और {{< glossary_tooltip term_id="selector" text="सेलेक्टर">}} 
का उपयोग करके परिभाषित किया गया है, जो {{< glossary_tooltip term_id="pod" text="पॉड्स" >}} में निर्दिष्ट हैं , 
और उनका उपयोग इस बात पर निर्भर करता है कि आप शेड्यूलर को कितनी सख्ती से लागू करना चाहते हैं।
