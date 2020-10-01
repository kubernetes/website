---
title: Serwer API
id: kube-apiserver
date: 2018-04-12
full_link: /docs/concepts/overview/components/#kube-apiserver
short_description: >
  Składnik warstwy sterowania udostępniający API Kubernetes. 

aka:
- kube-apiserver
tags:
- architecture
- fundamental
---
 Składnik *master* udostępniający API Kubernetes. Służy jako *front-end* dla warstwy sterowania Kubernetes.
 Serwer API jest składnikiem
{{< glossary_tooltip text="warstwy sterowania" term_id="control-plane" >}} Kubernetes, który udostępnia API.
Server API służy jako front-end warstwy sterowania Kubernetes.

<!--more-->

Podstawowa implementacją serwera API Kubernetes jest [kube-apiserver](/docs/reference/generated/kube-apiserver/).
kube-apiserver został zaprojektowany w taki sposób, aby móc skalować się horyzontalnie &mdash; to oznacza, że zwiększa swoją wydajność poprzez dodawanie kolejnych instancji.
Można uruchomić kilka instancji kube-apiserver i rozkładać między nimi ruch od klientów.
