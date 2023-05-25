---
title: Volume
id: volume
date: 2022-06-21
full_link: /it/docs/concepts/storage/volumes/
short_description: >
  Una cartella contenente dati, accessibile dai containers all'interno del pod.

aka:
tags:
- core-object
- fundamental
---
Una cartella contenente i dati, accessibile dal {{< glossary_tooltip text="containers" term_id="container" >}} in un {{< glossary_tooltip term_id="pod" >}}.

<!--more-->

Un volume di Kubernetes rimane in vita fintanto che lo rimane il Pod che lo racchiude. Di conseguenza, un volume sopravvive ad ogni container all'interno del Pod, e i dati nel volume sono preservati a prescindere dai restart del container.

Vedi [storage](/docs/concepts/storage/) per più informazioni.