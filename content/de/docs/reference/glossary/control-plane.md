---
title: Control Plane
id: control-plane
date: 2019-05-12
full_link:
short_description: >
  Die Container Orchestrierungsschicht, die die API und Schnittstellen exponiert, um den Lebenszyklus von Container zu definieren, bereitzustellen, und zu verwalten.

aka:
tags:
- fundamental
---
 Die Container Orchestrierungsschicht, die die API und Schnittstellen exponiert, um den Lebenszyklus von Container zu definieren, bereitzustellen, und zu verwalten.

 <!--more--> 
 
 Diese Schicht besteht aus vielen verschiedenen Komponenten, zum Beispiel (aber nicht begranzt auf):

 * {{< glossary_tooltip text="etcd" term_id="etcd" >}}
 * {{< glossary_tooltip text="API Server" term_id="kube-apiserver" >}}
 * {{< glossary_tooltip text="Scheduler" term_id="kube-scheduler" >}}
 * {{< glossary_tooltip text="Controller Manager" term_id="kube-controller-manager" >}}
 * {{< glossary_tooltip text="Cloud Controller Manager" term_id="cloud-controller-manager" >}}

 Diese Komponenten können als traditionelle Betriebssystemdienste (daemons) oder als Container laufen. Die Hosts auf denen diese Komponenten laufen, hießen früher {{< glossary_tooltip text="Master" term_id="master" >}}.