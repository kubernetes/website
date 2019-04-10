---
reviewers:
- remyleone
- feloy
- rekcah78
title: Ingress
content_template: templates/concept
weight: 40
---

{{% capture overview %}}
{{< glossary_definition term_id="ingress" length="all" >}}
{{% /capture %}}

{{% capture body %}}
## Terminologie

Par souci de clarté, ce guide définit les termes suivants :

* Noeud : une seule machine virtuelle ou physique dans un cluster Kubernetes.
* Cluster : groupe de nœuds protégés par un pare-feu provenant d'Internet et constituant les principales ressources de calcul gérées par Kubernetes.
* Routeur Edge : routeur appliquant la stratégie de pare-feu pour votre cluster. Il peut s’agir d’une passerelle gérée par un fournisseur de cloud ou d’un matériel physique.
* Réseau de cluster: ensemble de liens, logiques ou physiques, facilitant la communication au sein d'un cluster selon le [modèle de réseau Kubernetes](/docs/concepts/cluster-administration/networking/).
* Service: un Kubernetes [Service](/docs/concepts/services-networking/service/) identifiant un ensemble de pods à l'aide de sélecteurs d'étiquettes. Sauf indication contraire, les services sont supposés avoir des adresses IP virtuelles routables uniquement dans le réseau du cluster.