---
title: Double pile IPv4/IPv6
description: >-
  Kubernetes vous permet de configurer un réseau en pile simple IPv4,
  un réseau en pile simple IPv6, ou un réseau en double pile avec
  les deux familles d'adresses actives. Cette page explique comment.
feature:
  title: Double pile IPv4/IPv6
  description: >
    Attribution d'adresses IPv4 et IPv6 aux Pods et aux Services
content_type: concept
weight: 90
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

Le réseau en double pile IPv4/IPv6 permet d'attribuer à la fois des adresses IPv4 et IPv6 aux
{{< glossary_tooltip text="Pods" term_id="pod" >}} et aux {{< glossary_tooltip text="Services" term_id="service" >}}.

Le réseau en double pile IPv4/IPv6 est activé par défaut dans votre cluster Kubernetes depuis
la version 1.21, ce qui permet d'attribuer simultanément des adresses IPv4 et IPv6.

<!-- body -->

## Fonctionnalités prises en charge {#supported-features}

La double pile IPv4/IPv6 de votre cluster Kubernetes apporte les fonctionnalités suivantes :

* Réseau des Pods en double pile (une adresse IPv4 et une adresse IPv6 attribuées à chaque Pod)
* Services compatibles IPv4 et IPv6
* Routage du trafic sortant des Pods vers l'extérieur du cluster (par exemple Internet) par des interfaces IPv4 et IPv6

## Prérequis {#prerequisites}

Pour utiliser des clusters Kubernetes en double pile IPv4/IPv6, il vous faut :

* Kubernetes 1.20 ou une version ultérieure

  Pour savoir comment utiliser les Services en double pile avec des versions
  antérieures de Kubernetes, consultez la documentation de la version
  de Kubernetes concernée.

* La prise en charge du réseau en double pile par le fournisseur (le fournisseur de cloud ou un autre
  fournisseur doit pouvoir doter les nœuds Kubernetes d'interfaces réseau IPv4/IPv6 routables)
* Un [plugin réseau](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/) qui
  prend en charge le réseau en double pile.

## Configurer la double pile IPv4/IPv6 {#configure-ipv4-ipv6-dual-stack}

Pour configurer la double pile IPv4/IPv6, définissez des plages réseau en double pile pour le cluster :

* kube-apiserver :
  * `--service-cluster-ip-range=<IPv4 CIDR>,<IPv6 CIDR>`
* kube-controller-manager :
  * `--cluster-cidr=<IPv4 CIDR>,<IPv6 CIDR>`
  * `--service-cluster-ip-range=<IPv4 CIDR>,<IPv6 CIDR>`
  * `--node-cidr-mask-size-ipv4|--node-cidr-mask-size-ipv6` vaut par défaut /24 pour IPv4 et /64 pour IPv6
* kube-proxy :
  * `--cluster-cidr=<IPv4 CIDR>,<IPv6 CIDR>`
* kubelet :
  * `--node-ip=<IPv4 IP>,<IPv6 IP>`
    * Cette option est obligatoire pour les nœuds bare metal en double pile (les nœuds qui ne définissent pas
      de fournisseur de cloud avec l'option `--cloud-provider`). Si vous utilisez un fournisseur de cloud
      et que vous choisissez de remplacer les adresses IP de nœud choisies par ce fournisseur, renseignez
      l'option `--node-ip`.
    * (Les fournisseurs de cloud intégrés historiques ne prennent pas en charge `--node-ip` en double pile.)

{{< note >}}
Exemple de CIDR IPv4 : `10.244.0.0/16` (à remplacer par votre propre plage d'adresses)

Exemple de CIDR IPv6 : `fdXY:IJKL:MNOP:15::/64` (cet exemple montre le format, mais ce n'est pas une
adresse valide ; voir la [RFC 4193](https://tools.ietf.org/html/rfc4193))
{{< /note >}}

## Services {#services}

Vous pouvez créer des {{< glossary_tooltip text="Services" term_id="service" >}} qui utilisent IPv4, IPv6 ou les deux.

Par défaut, la famille d'adresses d'un Service est celle de la première plage d'adresses IP
des Services (configurée par l'option `--service-cluster-ip-range` de kube-apiserver).

Lorsque vous définissez un Service, vous pouvez le configurer en double pile si vous le souhaitez. Pour indiquer le comportement voulu,
donnez au champ `.spec.ipFamilyPolicy` l'une des valeurs suivantes :

* `SingleStack` : Service en pile simple. Le plan de contrôle attribue une adresse IP de cluster au Service,
  en utilisant la première plage d'adresses IP des Services configurée.
* `PreferDualStack` : attribue au Service des adresses IP de cluster IPv4 et IPv6 si la double pile est activée. Si la double pile n'est pas activée ou pas prise en charge, le Service se comporte comme en pile simple.
* `RequireDualStack` : attribue les `.spec.clusterIPs` du Service à partir des plages d'adresses IPv4 et IPv6 si la double pile est activée. Si la double pile n'est pas activée ou pas prise en charge, la création de l'objet Service dans l'API échoue.
  * Choisit `.spec.clusterIP` dans la liste `.spec.clusterIPs` en fonction de la famille d'adresses
    du premier élément du tableau `.spec.ipFamilies`.

Si vous voulez choisir la famille d'adresses IP à utiliser en pile simple, ou l'ordre des familles
d'adresses IP en double pile, vous pouvez indiquer les familles d'adresses dans le champ facultatif
`.spec.ipFamilies` du Service.

{{< note >}}
Le champ `.spec.ipFamilies` n'est modifiable que sous certaines conditions : vous pouvez ajouter ou supprimer une famille
d'adresses IP secondaire, mais vous ne pouvez pas changer la famille d'adresses IP principale d'un Service existant.
{{< /note >}}

Vous pouvez donner à `.spec.ipFamilies` l'une des valeurs de tableau suivantes :

- `["IPv4"]`
- `["IPv6"]`
- `["IPv4","IPv6"]` (double pile)
- `["IPv6","IPv4"]` (double pile)

La première famille de la liste est utilisée pour le champ historique `.spec.clusterIP`.

### Scénarios de configuration des Services en double pile {#dual-stack-service-configuration-scenarios}

Les exemples suivants montrent le comportement de différents scénarios de configuration de Services en double pile.

#### Options de double pile pour les nouveaux Services {#dual-stack-options-on-new-services}

1. Cette spécification de Service ne définit pas explicitement `.spec.ipFamilyPolicy`. Lorsque vous créez
   ce Service, Kubernetes lui attribue une adresse IP de cluster prise dans la première plage
   `service-cluster-ip-range` configurée, et renseigne `SingleStack` dans `.spec.ipFamilyPolicy`. (Les [Services
   sans sélecteurs](/docs/concepts/services-networking/service/#services-without-selectors) et les
   [Services headless](/docs/concepts/services-networking/service/#headless-services) avec sélecteurs
   se comportent de la même façon.)

   {{% code_sample file="service/networking/dual-stack-default-svc.yaml" %}}

1. Cette spécification de Service définit explicitement `PreferDualStack` dans `.spec.ipFamilyPolicy`. Lorsque
   vous créez ce Service sur un cluster en double pile, Kubernetes lui attribue à la fois une adresse IPv4
   et une adresse IPv6. Le plan de contrôle met à jour la `.spec` du Service pour enregistrer les adresses IP
   attribuées. Le champ `.spec.clusterIPs` est le champ principal et contient les deux adresses IP
   attribuées ; `.spec.clusterIP` est un champ secondaire dont la valeur est calculée à partir de
   `.spec.clusterIPs`.

   * Pour le champ `.spec.clusterIP`, le plan de contrôle enregistre l'adresse IP qui appartient à
     la même famille d'adresses que la première plage d'adresses IP des Services.
   * Sur un cluster en pile simple, les champs `.spec.clusterIPs` et `.spec.clusterIP` ne contiennent
     tous les deux qu'une seule adresse.
   * Sur un cluster où la double pile est activée, indiquer `RequireDualStack` dans `.spec.ipFamilyPolicy`
     a le même effet que `PreferDualStack`.

   {{% code_sample file="service/networking/dual-stack-preferred-svc.yaml" %}}

1. Cette spécification de Service définit explicitement `IPv6` et `IPv4` dans `.spec.ipFamilies`, ainsi
   que `PreferDualStack` dans `.spec.ipFamilyPolicy`. Lorsque Kubernetes attribue une adresse IPv6 et
   une adresse IPv4 dans `.spec.clusterIPs`, `.spec.clusterIP` reçoit l'adresse IPv6,
   premier élément du tableau `.spec.clusterIPs`, ce qui remplace le comportement par défaut.

   {{% code_sample file="service/networking/dual-stack-preferred-ipfamilies-svc.yaml" %}}

#### Valeurs par défaut de la double pile pour les Services existants {#dual-stack-defaults-on-existing-services}

Les exemples suivants montrent le comportement par défaut lorsque la double pile est activée sur un cluster
où des Services existent déjà. (La mise à niveau d'un cluster existant vers la version 1.21 ou ultérieure
active la double pile.)

1. Lorsque la double pile est activée sur un cluster, le plan de contrôle configure les Services existants
   (qu'ils soient `IPv4` ou `IPv6`) en donnant à `.spec.ipFamilyPolicy` la valeur `SingleStack` et
   à `.spec.ipFamilies` la famille d'adresses du Service existant. L'adresse IP de cluster du Service existant
   est enregistrée dans `.spec.clusterIPs`.

   {{% code_sample file="service/networking/dual-stack-default-svc.yaml" %}}

   Vous pouvez vérifier ce comportement en inspectant un Service existant avec kubectl.

   ```shell
   kubectl get svc my-service -o yaml
   ```

   ```yaml
   apiVersion: v1
   kind: Service
   metadata:
     labels:
       app.kubernetes.io/name: MyApp
     name: my-service
   spec:
     clusterIP: 10.0.197.123
     clusterIPs:
     - 10.0.197.123
     ipFamilies:
     - IPv4
     ipFamilyPolicy: SingleStack
     ports:
     - port: 80
       protocol: TCP
       targetPort: 80
     selector:
       app.kubernetes.io/name: MyApp
     type: ClusterIP
   status:
     loadBalancer: {}
   ```

1. Lorsque la double pile est activée sur un cluster, le plan de contrôle configure les
   [Services headless](/docs/concepts/services-networking/service/#headless-services) existants avec sélecteurs
   en donnant à `.spec.ipFamilyPolicy` la valeur `SingleStack` et à `.spec.ipFamilies` la famille d'adresses
   de la première plage d'adresses IP des Services (configurée par l'option
   `--service-cluster-ip-range` de kube-apiserver), même si `.spec.clusterIP` vaut
   `None`.

   {{% code_sample file="service/networking/dual-stack-default-svc.yaml" %}}

   Vous pouvez vérifier ce comportement en inspectant avec kubectl un Service headless existant doté de sélecteurs.

   ```shell
   kubectl get svc my-service -o yaml
   ```

   ```yaml
   apiVersion: v1
   kind: Service
   metadata:
     labels:
       app.kubernetes.io/name: MyApp
     name: my-service
   spec:
     clusterIP: None
     clusterIPs:
     - None
     ipFamilies:
     - IPv4
     ipFamilyPolicy: SingleStack
     ports:
     - port: 80
       protocol: TCP
       targetPort: 80
     selector:
       app.kubernetes.io/name: MyApp
   ```

#### Passer un Service de la pile simple à la double pile, et inversement {#switching-services-between-single-stack-and-dual-stack}

Un Service peut passer de la pile simple à la double pile, et de la double pile à la pile simple.

1. Pour passer un Service de la pile simple à la double pile, faites passer `.spec.ipFamilyPolicy` de
   `SingleStack` à `PreferDualStack` ou `RequireDualStack`, selon vos besoins. Lorsque vous passez ce
   Service en double pile, Kubernetes lui attribue la famille d'adresses manquante, si bien que le
   Service a désormais des adresses IPv4 et IPv6.

   Modifiez la spécification du Service en passant `.spec.ipFamilyPolicy` de `SingleStack` à `PreferDualStack`.

   Avant :

   ```yaml
   spec:
     ipFamilyPolicy: SingleStack
   ```

   Après :

   ```yaml
   spec:
     ipFamilyPolicy: PreferDualStack
   ```

1. Pour passer un Service de la double pile à la pile simple, faites passer `.spec.ipFamilyPolicy` de
   `PreferDualStack` ou `RequireDualStack` à `SingleStack`. Lorsque vous passez ce Service en
   pile simple, Kubernetes ne conserve que le premier élément du tableau `.spec.clusterIPs`,
   affecte cette adresse IP à `.spec.clusterIP` et donne à `.spec.ipFamilies` la famille
   d'adresses de `.spec.clusterIPs`.

### Services headless sans sélecteur {#headless-services-without-selector}

Pour les [Services headless sans sélecteurs](/docs/concepts/services-networking/service/#without-selectors)
dont `.spec.ipFamilyPolicy` n'est pas défini explicitement, le champ `.spec.ipFamilyPolicy` vaut par défaut
`RequireDualStack`.

### Service de type LoadBalancer {#service-type-loadbalancer}

Pour provisionner un équilibreur de charge en double pile pour votre Service :

* Donnez au champ `.spec.type` la valeur `LoadBalancer`
* Donnez au champ `.spec.ipFamilyPolicy` la valeur `PreferDualStack` ou `RequireDualStack`

{{< note >}}
Pour utiliser un Service de type `LoadBalancer` en double pile, votre fournisseur de cloud doit prendre en charge
les équilibreurs de charge IPv4 et IPv6.
{{< /note >}}

## Trafic sortant {#egress-traffic}

Si vous voulez autoriser le trafic sortant pour joindre des destinations extérieures au cluster (par exemple
Internet) depuis un Pod qui utilise des adresses IPv6 non routables publiquement, vous devez permettre au Pod
d'utiliser une adresse IPv6 routée publiquement, grâce à un mécanisme comme un proxy transparent ou le
masquage d'adresses IP (IP masquerading). Le projet [ip-masq-agent](https://github.com/kubernetes-sigs/ip-masq-agent)
prend en charge le masquage d'adresses IP sur les clusters en double pile.

{{< note >}}
Vérifiez que votre fournisseur {{< glossary_tooltip text="CNI" term_id="cni" >}} prend en charge IPv6.
{{< /note >}}

## Prise en charge de Windows {#windows-support}

Kubernetes sous Windows ne prend pas en charge le réseau en pile simple « IPv6 uniquement ». En revanche,
le réseau en double pile IPv4/IPv6 est pris en charge pour les Pods et les nœuds, avec des Services
d'une seule famille d'adresses.

Vous pouvez utiliser le réseau en double pile IPv4/IPv6 avec les réseaux `l2bridge`.

{{< note >}}
Sous Windows, les réseaux overlay (VXLAN) **ne prennent pas** en charge le réseau en double pile.
{{< /note >}}

Pour en savoir plus sur les différents modes réseau de Windows, consultez la page
[Réseau sous Windows](/docs/concepts/services-networking/windows-networking#network-modes).

## {{% heading "whatsnext" %}}

* [Valider le réseau en double pile IPv4/IPv6](/docs/tasks/network/validate-dual-stack)
* [Activer le réseau en double pile avec kubeadm](/docs/setup/production-environment/tools/kubeadm/dual-stack-support/)
