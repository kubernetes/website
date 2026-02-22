---
title: Disrupsi
id: disruption
date: 2019-09-10
full_link: /id/docs/concepts/workloads/pods/disruptions/
short_description: >
  Peristiwa yang menyebabkan hilangnya Pod
aka:
tags:
- fundamental
---
Disrupsi merupakan kejadian yang menyebabkan hilangnya satu atau beberapa {{< glossary_tooltip term_id="pod" >}}. Suatu disrupsi memiliki konsekuensi terhadap sumber daya beban kerja, seperti {{< glossary_tooltip term_id="deployment" >}}, yang bergantung pada Pod yang terpengaruh.

<!--more-->

Jika kamu, sebagai operator klaster, menghancurkan sebuah Pod milik suatu aplikasi, maka hal ini dalam Kubernetes dikenal sebagai disrupsi disengaja (_voluntary disruption_). Jika sebuah Pod menghilang karena kegagalan Node, atau pemadaman yang mempengaruhi zona kegagalan yang lebih luas, maka dalam Kubernetes dikenal dengan istilah disrupsi tidak disengaja (_involuntary disruption_).

Lihat [Disrupsi](/id/docs/concepts/workloads/pods/disruptions/) untuk informasi lebih lanjut.
