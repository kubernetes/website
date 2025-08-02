---
title: Toleration
id: toleration
date: 2019-01-11
full_link: /docs/concepts/scheduling-eviction/taint-and-toleration/
short_description: >
  یک شیء هسته‌ای که شامل سه ویژگی اجباری است: کلید، مقدار و اثر. Tolerationها امکان زمان‌بندی پادها روی نودها یا گروه‌های نود با Taintهای منطبق را فراهم می‌کنند.

aka:
tags:
- core-object
- fundamental
---
 یک شیء هسته‌ای که شامل سه ویژگی اجباری است: کلید، مقدار و اثر. Tolerationها امکان زمان‌بندی پادها روی نودها یا گروه‌های نود با {{< glossary_tooltip text="taints" term_id="taint" >}} منطبق را فراهم می‌کنند.

<!--more-->

Tolerationها و {{< glossary_tooltip text="taints" term_id="taint" >}} با هم کار می‌کنند تا اطمینان حاصل شود پادها روی نودهای نامناسب زمان‌بندی نمی‌شوند. یک یا چند Toleration به یک {{< glossary_tooltip text="pod" term_id="pod" >}} اعمال می‌شود. یک Toleration نشان می‌دهد که آن {{< glossary_tooltip text="pod" term_id="pod" >}} مجاز است (اما مجبور نیست) روی نودها یا گروه‌های نود با {{< glossary_tooltip text="taints" term_id="taint" >}} منطبق زمان‌بندی شود.
