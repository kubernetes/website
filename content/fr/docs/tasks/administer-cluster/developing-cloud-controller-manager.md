---
title: Développer un Cloud Controller Manager
content_template: templates/concept
---

{{% capture overview %}}

{{< feature-state for_k8s_version="v1.11" state="beta" >}}
Dans les prochaines versions, Cloud Controller Manager sera le moyen privilégié d’intégrer Kubernetes à n’importe quel cloud.
Cela garantira que les fournisseurs de cloud peuvent développer leurs fonctionnalités indépendamment des cycles de publication de Kubernetes.

{{< feature-state for_k8s_version="1.8" state="alpha" >}}

Avant d’expliquer comment créer votre propre gestionnaire de contrôleur de cloud, il est utile d’avoir quelques informations sur son fonctionnement interne.
Le cloud controller manager est un code de `kube-controller-manager` utilisant des interfaces Go pour permettre la mise en œuvre d'implémentations depuis n'importe quel cloud.
La plupart des implémentations de contrôleurs génériques seront au cœur du projet, mais elles seront toujours exécutées sur les interfaces de cloud fournies, à condition que l'[interface du fournisseur de cloud](https://github.com/kubernetes/cloud-provider/blob/master/cloud.go#L42-L62) soit satisfaite.

Pour approfondir un peu les détails de la mise en œuvre, tous les gestionnaires de contrôleurs de nuage vont importer des packages à partir de Kubernetes core, la seule différence étant que chaque projet enregistre son propre fournisseur de nuage en appelant [cloudprovider.RegisterCloudProvider](https://github.com/kubernetes/cloud-provider/blob/master/plugins.go#L56-L66) où une variable globale des fournisseurs de cloud disponibles est mise à jour.

{{% /capture %}}

{{% capture body %}}

## Développement

### Out of Tree

Pour construire un out-of-tree cloud-controller-manager pour votre cloud, suivez ces étapes:

1. Créez un package Go avec une implémentation satisfaisant[cloudprovider.Interface](https://github.com/kubernetes/cloud-provider/blob/master/cloud.go).
2. Utilisez [main.go dans cloud-controller-manager](https://github.com/kubernetes/kubernetes/blob/master/cmd/cloud-controller-manager/controller-manager.go) de Kubernetes core en tant que modèle pour votre main.go. Comme mentionné ci-dessus, la seule différence devrait être le package cloud qui sera importé.
3. Importez votre paquet cloud dans `main.go`, assurez-vous que votre paquet a un bloc `init` à exécuter [cloudprovider.RegisterCloudProvider](https://github.com/kubernetes/cloud-provider/blob/master/plugins.go).

Utiliser des exemples de fournisseurs de cloud out-of-tree peut être utile.
Vous pouvez trouver la liste [ici](/docs/tasks/administer-cluster/running-cloud-controller.md#examples).

### In Tree

Pour les cloud in-tree, vous pouvez exécuter le in-tree cloud controller manager comme un [Daemonset](/examples/admin/cloud/ccm-example.yaml) dans votre cluster.
Voir la [documentation sur l'exécution d'un cloud controller manager](/docs/tasks/administer-cluster/running-cloud-controller.md) pour plus de détails.

{{% /capture %}}
