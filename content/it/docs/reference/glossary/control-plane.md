---
title: Control Plane
id: control-plane
date: 2019-05-12
full_link:
short_description: >
  Lo strato per l'orchestrazione dei container che espone le API e interfaccie per definere, deploy, e gestione del ciclo di vita dei container.


aka:
tags:
- fundamental
---
 Lo strato per l'orchestrazione dei container che espone le API e interfaccie per definere, deploy, e gestione del ciclo di vita dei container.

 <!--more--> 
 
 Questo strato è composto da diversi componenti, come (ma non limitato a):

 * {{< glossary_tooltip text="etcd" term_id="etcd" >}}
 * {{< glossary_tooltip text="API Server" term_id="kube-apiserver" >}}
 * {{< glossary_tooltip text="Scheduler" term_id="kube-scheduler" >}}
 * {{< glossary_tooltip text="Controller Manager" term_id="kube-controller-manager" >}}
 * {{< glossary_tooltip text="Cloud Controller Manager" term_id="cloud-controller-manager" >}}

 Questi compenti possono girare come trazionali servizi del sistema operativo (demoni) o come containers. L'host che esegue questi componenti era storicamente chiamato {{< glossary_tooltip text="master" term_id="master" >}}.