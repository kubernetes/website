---
title: LimitRange
id: limitrange
date: 2019-04-15
full_link:  /docs/concepts/policy/limit-range/
short_description: >
  Впроваджує ліміти для обмеження обсягу споживання ресурсів для кожного контейнера чи Podʼу в просторі імен.

aka: 
tags:
- core-object
- fundamental
- architecture
related:
 - pod
 - container
---
Впроваджує ліміти для обмеження обсягу споживання ресурсів для кожного {{< glossary_tooltip text="контейнера" term_id="container" >}} чи {{< glossary_tooltip text="поду" term_id="pod" >}} в просторі імен.

<!--more--> 
LimitRange обмежує кількість обʼєктів, які можна створити за типом, а також обсяг обчислювальних ресурсів, які можуть бути затребувані/спожиті окремими {{< glossary_tooltip text="контейнерами" term_id="container" >}} чи {{< glossary_tooltip text="Podʼами" term_id="pod" >}} в просторі імен.
