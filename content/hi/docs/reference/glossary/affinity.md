---
title: आत्मीयता (Affinity)
id: affinity
date: 2019-01-11
full_link: /docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity
short_description: >
     पॉड्स को कहां रखा जाए, यह निर्धारित करने के लिए अनुसूचक द्वारा उपयोग किए जाने वाले नियम
aka:
tags:
- fundamental
---

कुबेरनेट्स में, आत्मीयता नियमों का एक समूह है जो अनुसूचक को संकेत देता है कि पॉड्स को कहाँ रखा जाए।

<!--more-->
आत्मीयता दो प्रकार की होती है:
* [नोड आत्मीयता](/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity)
* [पॉड-टू-पॉड आत्मीयता](/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)

कुबेरनेट्स {{< glossary_tooltip term_id="label" text="labels">}} का उपयोग करके नियमों को परिभाषित किया गया है,
और {{<glossary_tooltip term_id="selector" text="selectors">}} {{<glossary_tooltip term_id="pod" text="pods" >}} में निर्दिष्ट,
और उन्हें या तो आवश्यक या पसंद किया जा सकता है, यह इस बात पर निर्भर करता है कि आप अनुसूचक को कितनी सख्ती से लागू करना चाहते हैं।
