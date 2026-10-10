---
title: Utiliser un Service pour accéder à une application dans un cluster
content_type: tutorial
weight: 60
---

<!-- overview -->

Cette page montre comment créer un Service Kubernetes que des clients externes peuvent utiliser 
pour accéder à une application s'exécutant dans un cluster. 
Le Service fournit une répartition de charge pour une application 
ayant deux instances en cours d'exécution.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

## {{% heading "objectives" %}}

- Exécuter deux instances d'une application Hello World.
- Créer un Service qui expose un port du nœud.
- Utiliser le Service pour accéder à l'application en cours d'exécution.

<!-- lessoncontent -->

## Création d'un service pour une application s'exécutant dans deux pods

Voici le fichier de configuration pour le déploiement de l'application :

{{% codenew file="service/access/hello-application.yaml" %}}

1. Exécutez une application Hello World dans votre cluster :
   Créez le déploiement de l'application en utilisant le fichier ci-dessus :

   ```shell
   kubectl apply -f https://k8s.io/examples/service/access/hello-application.yaml
   ```

   La commande précédente crée un
   {{< glossary_tooltip text="Deployment" term_id="deployment" >}}
   et un
   {{< glossary_tooltip term_id="replica-set" text="ReplicaSet" >}} associé.
   Le ReplicaSet possède deux
   {{< glossary_tooltip text="Pods" term_id="pod" >}},
   chacun exécutant l'application Hello World.

1. Affichez les informations du déploiement :

   ```shell
   kubectl get deployments hello-world
   kubectl describe deployments hello-world
   ```

1. Affichez les informations des ReplicaSet :

   ```shell
   kubectl get replicasets
   kubectl describe replicasets
   ```

1. Créez un Service qui expose le déploiement :

   ```shell
   kubectl expose deployment hello-world --type=NodePort --name=example-service
   ```

1. Affichez les informations sur le Service :

   ```shell
   kubectl describe services example-service
   ```

   Le résultat sera similaire à ceci :

   ```none
   Name:                   example-service
   Namespace:              default
   Labels:                 run=load-balancer-example
   Annotations:            <none>
   Selector:               run=load-balancer-example
   Type:                   NodePort
   IP:                     10.32.0.16
   Port:                   <unset> 8080/TCP
   TargetPort:             8080/TCP
   NodePort:               <unset> 31496/TCP
   Endpoints:              10.200.1.4:8080,10.200.2.5:8080
   Session Affinity:       None
   Events:                 <none>
   ```

   Notez la valeur de NodePort pour le service. Par exemple,
   dans le résultat précédent, la valeur de NodePort est 31496.

1. Répertoriez les pods qui exécutent l'application Hello World :

   ```shell
   kubectl get pods --selector="run=load-balancer-example" --output=wide
   ```

   Le résultat est similaire à ceci :

   ```none
   NAME                           READY   STATUS    ...  IP           NODE
   hello-world-2895499144-bsbk5   1/1     Running   ...  10.200.1.4   worker1
   hello-world-2895499144-m1pwt   1/1     Running   ...  10.200.2.5   worker2
   ```

1. Obtenez l'adresse IP publique de l'un de vos nœuds qui exécute
   un pod Hello World. L'obtention de cette adresse dépend de la manière dont vous avez configuré votre cluster. 
   Par exemple, si vous utilisez Minikube, vous pouvez
   voir l'adresse du nœud en exécutant `kubectl cluster-info`. Si vous utilisez
   des instances Google Compute Engine, vous pouvez utiliser la commande
   `gcloud compute instances list` pour voir les adresses publiques de vos
   nœuds.

1. Sur le nœud choisi, créez une règle de pare-feu autorisant le trafic TCP
   sur votre port. Par exemple, si votre Service a une valeur NodePort de
   31568, créez une règle de pare-feu autorisant le trafic TCP vers le port 31568. Différents
   fournisseurs cloud offrent différentes façons de configurer des règles de pare-feu.

1. Utilisez l'adresse du nœud et le port de nœud pour accéder à l'application Hello World :

   ```shell
   curl http://<adresse-ip-publique>:<port>
   ```

   où `<adresse-ip-publique>` est l'adresse IP publique de votre nœud,
   et `<port>` est la valeur de NodePort pour votre service. La
   réponse à une requête réussie est un message de bienvenue :

   ```none
   Hello, world!
   Version: 2.0.0
   Hostname: hello-world-2895499144-bsbk5
   ```

## Utilisation d'un fichier de configuration de service

Au lieu d'utiliser `kubectl expose`, vous pouvez utiliser un
[fichier de configuration de service](/docs/concepts/services-networking/service/)
pour créer un Service.

## {{% heading "cleanup" %}}

Pour supprimer le Service, saisissez cette commande :

    kubectl delete services example-service

Pour supprimer le Déploiement, le ReplicaSet et les Pods qui exécutent
l'application Hello World, saisissez cette commande :

    kubectl delete deployment hello-world

## {{% heading "whatsnext" %}}

Suivez le tutoriel
[Connecter des applications avec les Services](/docs/tutorials/services/connect-applications-service/).