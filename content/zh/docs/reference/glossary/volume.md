---
title: Volume
id: volume
date: 2018-04-12
full_link: /docs/concepts/storage/volumes/
short_description: >
  A directory containing data, accessible to the containers in a pod.

aka: 
tags:
- core-object
- fundamental
---
 A directory containing data, accessible to the containers in a {{< glossary_tooltip text="pod" term_id="pod" >}}.

<!--more--> 

A Kubernetes volume lives as long as the {{< glossary_tooltip text="pod" term_id="pod" >}} that encloses it. Consequently, a volume outlives any {{< glossary_tooltip text="containers" term_id="container" >}} that run within the {{< glossary_tooltip text="pod" term_id="pod" >}}, and data is preserved across {{< glossary_tooltip text="container" term_id="container" >}} restarts. 

