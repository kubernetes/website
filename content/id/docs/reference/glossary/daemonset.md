---
title: DaemonSet
id: daemonset
full_link: /id/docs/concepts/workloads/controllers/daemonset
short_description: >
  Memastikan salinan Pod dijalankan pada sekumpulan Node dalam satu klaster.

aka:
tags:
- fundamental
- core-object
- workload
---
Memastikan salinan {{< glossary_tooltip term_id="pod" >}} dijalankan pada sekumpulan Node dalam satu {{< glossary_tooltip text="klaster" term_id="cluster" >}}.

<!--more-->

Digunakan untuk menggelar _daemon_ sistem sebagai kolektor log dan memonitor agen yang biasanya harus dijalankan di setiap {{< glossary_tooltip term_id="node" >}}.
