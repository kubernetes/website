---
reviewers:
- davidopp
- thockin
title: DNS pour les services et les pods
content_template: templates/concept
weight: 20
---
{{% capture overview %}}
Cette page fournit une vue d'ensemble de la prise en charge DNS par Kubernetes.
{{% /capture %}}

{{% capture body %}}

## Introduction

Kubernetes DNS planifie un pod et un service DNS sur le cluster et configure
les kubelets pour indiquer à chaque conteneur d'utiliser l'adresse IP du service DNS pour résoudre les noms DNS.

### Quels composants obtiennent des noms DNS?

Chaque service défini dans le cluster (y compris le serveur DNS lui-même) est
a nom DNS. Par défaut, la liste de recherche DNS du client d'un pod
inclura le namespace du pod et le domaine par défaut du cluster. C'est mieux
illustré par un exemple:

Supposons un service nommé `foo` dans le namespace Kubernetes `bar`. Un pod en cours d'exécution dans le namespace `bar` peut rechercher ce service en faisant simplement une requête DNS "foo". Un pod fonctionnant dans l’espace de nommage `quux` peut rechercher ce service en effectuant une requête DNS pour `foo.bar`.

Les sections suivantes détaillent les types d’enregistrement et la structure prise en charge. Toute autre structure ou noms ou requêtes qui fonctionnent sont
considérés comme des détails d'implémentation et peuvent changer sans préavis.
Pour une spécification plus à jour, voir
[Découverte de services basée sur le DNS Kubernetes](https://github.com/kubernetes/dns/blob/master/docs/specification.md).

## Services

### Enregistrement A

Les services "normaux" (pas sans accès direct) se voient attribuer un enregistrement DNS A pour un nom sous forme : `mon-svc.my-namespace.svc.cluster.local`. Cela résout à la Cluster IP du service.

Les Services "Headless" (ou sans tête, c'est à dire sans cluster IP) aura également enregistrement DNS type A pour un nom sous la forme `my-svc.my-namespace.svc.cluster.local`. Contrairement aux Services Normaux, cela résout l'ensemble des IPs des pods sélectionnés par le Service.
On s'attend à ce que les clients consomment l'ensemble ou utilisent le standard de sélection round-robin de l'ensemble.