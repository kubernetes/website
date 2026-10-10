---
title: Composants de Kubernetes
content_type: concept
description: >
  Un aperçu des principaux composants qui constituent un cluster Kubernetes.
weight: 10
card:
  title: Composants d'un cluster
  name: concepts
  weight: 20
---

<!-- overview -->

Cette page fournit un aperçu général des composants essentiels qui constituent un cluster Kubernetes.

{{< figure src="/images/docs/components-of-kubernetes.svg" alt="Composants de Kubernetes" caption="Les composants d'un cluster Kubernetes" class="diagram-large" clicktozoom="true" >}}

<!-- body -->

## Composants principaux

Un cluster Kubernetes est composé d'un plan de contrôle et d'un ou plusieurs nœuds de travail.
Voici un bref aperçu des principaux composants :

### Composants du plan de contrôle

Gèrent l'état global du cluster :

[kube-apiserver](/docs/concepts/architecture/#kube-apiserver)
: Le serveur principal qui expose l'API HTTP de Kubernetes

[etcd](/docs/concepts/architecture/#etcd)
: Un magasin de clés-valeurs cohérent et hautement disponible pour toutes les données du serveur API

[kube-scheduler](/docs/concepts/architecture/#kube-scheduler)
: Recherche les Pods qui ne sont pas encore liés à un nœud et attribue chaque Pod à un nœud approprié.

[kube-controller-manager](/docs/concepts/architecture/#kube-controller-manager)
: Exécute des {{< glossary_tooltip text="contrôleurs" term_id="controller" >}} pour mettre en œuvre le comportement de l'API Kubernetes.

[cloud-controller-manager](/docs/concepts/architecture/#cloud-controller-manager) (optionnel)
: S'intègre aux fournisseurs de cloud sous-jacents.

### Composants des nœuds

S'exécutent sur chaque nœud, maintiennent les pods en cours d'exécution et fournissent l'environnement d'exécution Kubernetes :

[kubelet](/docs/concepts/architecture/#kubelet)
: Veille à ce que les Pods s'exécutent, y compris leurs conteneurs.

[kube-proxy](/docs/concepts/architecture/#kube-proxy) (optionnel)
: Maintient les règles réseau sur les nœuds pour mettre en œuvre les {{< glossary_tooltip text="Services" term_id="service" >}}.

[Runtime de conteneur](/docs/concepts/architecture/#container-runtime)
: Logiciel responsable de l'exécution des conteneurs. Lisez
  [Runtimes de conteneurs](/docs/setup/production-environment/container-runtimes/) pour en savoir plus.

{{% thirdparty-content single="true" %}}

Votre cluster peut nécessiter des logiciels supplémentaires sur chaque nœud ; par exemple, vous pouvez également
exécuter [systemd](https://systemd.io/) sur un nœud Linux pour superviser les composants locaux.

## Extensions

Les extensions étendent les fonctionnalités de Kubernetes. Quelques exemples importants incluent :

[DNS](/docs/concepts/architecture/#dns)
: Pour la résolution DNS à l'échelle du cluster

[Interface utilisateur Web](/docs/concepts/architecture/#web-ui-dashboard) (Tableau de bord)
: Pour la gestion du cluster via une interface web

[Surveillance des ressources des conteneurs](/docs/concepts/architecture/#container-resource-monitoring)
: Pour collecter et stocker les métriques des conteneurs

[Journalisation au niveau du cluster](/docs/concepts/architecture/#cluster-level-logging)
: Pour enregistrer les journaux des conteneurs dans un référentiel de journaux centralisé

## Flexibilité dans l'architecture

Kubernetes permet une flexibilité dans la façon dont ces composants sont déployés et gérés.
L'architecture peut être adaptée à différents besoins, des environnements de développement réduits
aux déploiements de production à grande échelle.

Pour plus d'informations détaillées sur chaque composant et les différentes façons de configurer votre
architecture de cluster, consultez la page [Architecture du cluster](/docs/concepts/architecture/).

