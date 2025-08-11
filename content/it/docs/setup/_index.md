---
reviewers:
- brendandburns
- erictune
- mikedanese
title: Primi passi
main_menu: true
weight: 20
content_type: concept
no_list: true
card:
  name: setup
  weight: 20
  anchors:
  - anchor: "#learning-environment"
    title: Ambiente di learning
  - anchor: "#production-environment"
    title: Ambiente di produzione 
---

<!-- overview -->

Questa sezione elenca i diversi modi per configurare ed eseguire Kubernetes.
Quando installi Kubernetes, scegli un tipo di installazione in base a: facilità di manutenzione, sicurezza,
controllo, risorse disponibili e competenze richieste per gestire e utilizzare un cluster.

Puoi [scaricare Kubernetes](/releases/download/) per distribuire un cluster Kubernetes
su una macchina locale, nel cloud o nel tuo data center.

Diversi [componenti Kubernetes](/docs/concepts/overview/components/) come {{< glossary_tooltip text="kube-apiserver" term_id="kube-apiserver" >}} o {{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}} possono anche essere
distribuiti come [container images](/releases/download/#container-images) all'interno del cluster.

Si **consiglia** di eseguire i componenti Kubernetes come container images, ove
possibile, e di affidare la gestione di tali componenti a Kubernetes.
I componenti che eseguono container, in particolare il kubelet, non possono essere inclusi in questa categoria.

Se non desideri gestire autonomamente un cluster Kubernetes, puoi scegliere un servizio gestito, tra cui
[piattaforme certificate](/docs/setup/production-environment/turnkey-solutions/).
Sono disponibili anche altre soluzioni standardizzate e personalizzate per un'ampia gamma di ambienti cloud e
bare metal.
<!-- body -->

## Ambiente di learning

Se stai imparando a usare Kubernetes, utilizza gli strumenti supportati dalla community di Kubernetes
o gli strumenti dell'ecosistema per configurare un cluster Kubernetes su una macchina locale.
Vedi [Installazione degli strumenti](/docs/tasks/tools/).

## Ambiente di produzione

Quando si valuta una soluzione per un
[ambiente di produzione](/docs/setup/production-environment/), si considerino quali aspetti del
funzionamento di un cluster Kubernetes (o _astrazioni_) si desidera gestire autonomamente e quali si
preferisce delegare a un provider.

Per un cluster gestito autonomamente, lo strumento ufficialmente supportato
per il deployment di Kubernetes è [kubeadm](/docs/setup/production-environment/tools/kubeadm/).

## {{% heading "whatsnext" %}}

- [Scarica Kubernetes](/releases/download/)
- Scarica e [installalla i tools](/docs/tasks/tools/) incluso `kubectl`
- Seleziona un [container runtime](/docs/setup/production-environment/container-runtimes/) per il tuo nuovo cluster
- Impara le [best practices](/docs/setup/best-practices/) per la configurazione di un cluster

Kubernetes è progettato dato il suo {{< glossary_tooltip term_id="control-plane" text="control plane" >}} per funzionare su Linux. All'interno del cluster è possibile eseguire applicazioni su Linux o altri sistemi operativi, incluso Windows.

- Impara a [configurare cluster con nodi Windows](/docs/concepts/windows/)
