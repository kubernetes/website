---
reviewers:
- remyleone
- feloy
- rekcah78
- rbenzair
title: Ingress
content_template: templates/concept
weight: 40
---

{{% capture overview %}}

{{% /capture %}}

{{% capture body %}}

## Terminologie

Par souci de clarté, ce guide définit les termes suivants :

* Noeud : une seule machine virtuelle ou physique dans un cluster Kubernetes.
* Cluster : groupe de nœuds protégés par un pare-feu provenant d'Internet et constituant les principales ressources de calcul gérées par Kubernetes.
* Routeur Edge : routeur appliquant la stratégie de pare-feu pour votre cluster. Il peut s’agir d’une passerelle gérée par un fournisseur de cloud ou d’un matériel physique.
* Réseau de cluster: ensemble de liens, logiques ou physiques, facilitant la communication au sein d'un cluster selon le [modèle de réseau Kubernetes](/docs/concepts/cluster-administration/networking/).
* Service : un Kubernetes [Service](/docs/concepts/services-networking/service/) identifiant un ensemble de pods à l'aide de sélecteurs d'étiquettes. Sauf indication contraire, les services sont supposés avoir des adresses IP virtuelles routables uniquement dans le réseau du cluster.

## Qu'est-ce qu'un ingress ?

Ingress (ou une entrée réseau), ajouté à Kubernetes v1.1, expose les routes HTTP et HTTPS de l'extérieur du cluster à
{{<link text = "services" url = "/docs/concepts/services-networking/service/">}} au sein du cluster.
Le routage du trafic est contrôlé par des règles définies sur la ressource Ingress.

```none
    internet
        |
   [ Ingress ]
   --|-----|--
   [ Services ]
```

Un Ingress peut être configuré pour donner aux services des URLs accessibles de l'extérieur, du trafic de charge équilibrée, la résiliation de SSL et un hébergement virtuel basé sur le nom. Un [contrôleur d'Ingress](/docs/concepts/services-networking/ingress-controllers) est responsable de l'exécution de le l'Ingress, généralement avec un équilibreur de charge, bien qu'il puisse également configurer votre routeur périphérique ou des interfaces supplémentaires pour aider à gérer le trafic.

Un Ingress n'expose pas de ports ni de protocoles arbitraires. Exposer des services autres que HTTP et HTTPS à Internet généralement utilise un service de type [Service.Type=NodePort](/docs/concepts/services-networking/service/#nodeport) ou [Service.Type=LoadBalancer](/docs/concepts/services-networking/service/#loadbalancer).

## Conditions préalables

{{<feature-state for_k8s_version = "v1.1" state = "beta">}}

Avant de commencer à utiliser un Ingress, vous devez comprendre certaines choses. Un Ingress est une ressource bêta.

{{<note>}}
Vous devez avoir un [contrôleur d'Ingress](/docs/concepts/services-networking/ingress-controllers) pour lancer un Ingress. Seule la création d'une ressource Ingress n'a aucun effet.
{{</note>}}

GCE/GKE (Google Cloud Engine / Google Kubernetes Engine) déploie un contrôleur d’Ingress sur le master (le maître de kubernetes). Revoir le [limitations bêta](https://github.com/kubernetes/ingress-gce/blob/master/BETA_LIMITATIONS.md#glbc-beta-limitations) de ce contrôleur si vous utilisez GCE/GKE.

Dans les environnements autres que GCE/GKE, vous devrez peut-être [déployer un contrôleur d'Ingress](https://kubernetes.github.io/ingress-nginx/deploy/). Il y a un certain nombre de
[contrôleurs d'Ingress](/docs/concepts/services-networking/ingress-controllers) parmi lesquels vous pouvez choisir.

### Avant de commencer

Dans l’idéal, tous les contrôleurs d’Ingress devraient correspondre à cette spécification, mais les diverses contrôleurs sont légèrement différents.

{{<note>}}
Assurez-vous de consulter la documentation de votre contrôleur d’Ingress pour bien comprendre les mises en garde qu’il ya à faire pour le choisir.
{{</ note>}}

## La ressource Ingress

Exemple de ressource Ingress minimale :

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: test-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - http:
      paths:
      - path: /testpath
        backend:
          serviceName: test
          servicePort: 80
```