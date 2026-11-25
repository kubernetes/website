---
title: Виселення внаслідок тиску на вузол
id: node-pressure-eviction
full_link: /docs/concepts/scheduling-eviction/node-pressure-eviction/
short_description: >
  Виселення внаслідок тиску на вузол — це процес, під час якого kubelet проактивно завершує роботу Podʼів, щоб звільнити ресурси на вузлах.

aka:
- kubelet eviction
- Node-pressure eviction
tags:
- operation
---

Виселення внаслідок тиску на вузол — це процес, під час якого {{<glossary_tooltip term_id="kubelet" text="kubelet">}} проактивно завершує роботу Podʼів, щоб звільнити {{< glossary_tooltip text="ресурси" term_id="infrastructure-resource" >}} на вузлах.

<!--more-->

Kubelet відстежує ресурси, такі як ЦП, памʼять, місце на диску та inode файлової системи на вузлах вашого кластера. Коли один або кілька з цих ресурсів досягають певних рівнів використання, kubelet може проактивно завершити роботу одного або кількох Podʼів на вузлі, щоб звільнити ресурси та запобігти їх нестачі.

Виселення внаслідок тиску на вузол — це не те саме, що [виселення, ініційоване API](/docs/concepts/scheduling-eviction/api-eviction/).
