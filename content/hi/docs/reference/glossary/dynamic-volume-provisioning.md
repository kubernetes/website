---
title: Dynamic Volume Provisioning
id: dynamicvolumeprovisioning
date: 2018-04-12
full_link: /docs/concepts/storage/dynamic-provisioning
short_description: >
  उपयोगकर्ताओं को स्टोरेज वॉल्यूम के स्वचालित निर्माण का अनुरोध करने की अनुमति देता है।

aka: 
tags:
- core-object
- storage
---
 उपयोगकर्ताओं को स्टोरेज {{<glossary_tooltip text="वॉल्यूम" term_id="volume">}} के स्वचालित निर्माण का अनुरोध करने की अनुमति देता है।

<!--more--> 

Dynamic provisioning eliminates the need for cluster administrators to pre-provision storage. Instead, it automatically provisions storage by user request. Dynamic volume provisioning is based on an API object, {{< glossary_tooltip text="StorageClass" term_id="storage-class" >}}, referring to a {{< glossary_tooltip text="Volume Plugin" term_id="volume-plugin" >}} that provisions a {{< glossary_tooltip text="Volume" term_id="volume" >}} and the set of parameters to pass to the Volume Plugin.
