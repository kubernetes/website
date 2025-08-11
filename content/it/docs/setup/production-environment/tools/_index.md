---
title: Installare Kubernetes con gli strumenti di distruzione
weight: 30
no_list: true
---

Esistono molti metodi e strumenti per configurare un cluster Kubernetes di produzione.
Ad esempio:

- [kubeadm](/docs/setup/production-environment/tools/kubeadm/)

- [Cluster API](https://cluster-api.sigs.k8s.io/): Un sotto-progetto di Kubernetes focalizzato
  sulla fornitura di API dichiarative e strumenti per semplificare il provisioning, l’aggiornamento e la gestione
  di più cluster Kubernetes.
  
- [kops](https://kops.sigs.k8s.io/): Uno strumento automatizzato per il provisioning dei cluster.
  Per tutorial, best practice, opzioni di configurazione e informazioni su come contattare la community,
  consulta il sito [`kOps`](https://kops.sigs.k8s.io/) per i dettagli.

- [kubespray](https://kubespray.io/):
  Una raccolta di playbook [Ansible](https://docs.ansible.com/),
  [inventory](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/ansible/inventory.md),
  strumenti di provisioning e conoscenze di dominio per attività di gestione della configurazione
  di cluster OS/Kubernetes generici. Puoi contattare la community sul canale Slack
  [#kubespray](https://kubernetes.slack.com/messages/kubespray/).
