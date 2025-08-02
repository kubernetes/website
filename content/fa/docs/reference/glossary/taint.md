---
title: Taint
id: taint
date: 2019-01-11
full_link: /docs/concepts/scheduling-eviction/taint-and-toleration/
short_description: >
  یک شیء هسته‌ای که شامل سه ویژگی اجباری است: کلید، مقدار و اثر. Taintها از زمان‌بندی پادها روی نودها یا گروه‌های نود جلوگیری می‌کنند.

aka:
tags:
- fundamental
---
 یک شیء هسته‌ای که شامل سه ویژگی اجباری است: کلید، مقدار و اثر. Taintها از زمان‌بندی {{< glossary_tooltip text="Pods" term_id="pod" >}} روی {{< glossary_tooltip text="nodes" term_id="node" >}} یا گروه‌های نود جلوگیری می‌کنند.

<!--more-->

Taintها و {{< glossary_tooltip text="tolerations" term_id="toleration" >}} با هم کار می‌کنند تا اطمینان حاصل شود پادها روی نودهای نامناسب زمان‌بندی نمی‌شوند. یک یا چند Taint به یک نود اعمال می‌شود. یک نود باید تنها پادهایی را زمان‌بندی کند که Tolerationهای متناسب با Taintهای پیکربندی‌شده را داشته باشند.
