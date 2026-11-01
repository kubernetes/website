---
reviewers:
- sig-cluster-lifecycle
title: Création de clusters hautement disponibles avec kubeadm
content_type: task
weight: 60
---

<!-- overview -->

Cette page explique deux approches pour configurer un cluster Kubernetes hautement disponible
(HA) à l’aide de kubeadm :

- Avec des nœuds de plan de contrôle empilés (stacked control plane). Cette approche nécessite moins d’infrastructure. Les membres etcd
  et les nœuds de plan de contrôle sont co-localisés.
- Avec un cluster etcd externe. Cette approche nécessite plus d’infrastructure. Les
  nœuds de plan de contrôle et les membres etcd sont séparés.

Avant de continuer, vous devez soigneusement choisir l’approche qui correspond le mieux aux besoins de vos applications
et de votre environnement. La page Options de topologie hautement disponible décrit les avantages et inconvénients de chaque approche.

Si vous rencontrez des problèmes lors de la configuration du cluster HA, veuillez les signaler
dans le système de tickets kubeadm.

Voir également la documentation de mise à niveau.

{{< caution >}}
Cette page ne couvre pas les déploiements sur un fournisseur cloud. Dans un environnement cloud,
aucune des approches décrites ici ne fonctionne correctement avec les objets Service de type LoadBalancer,
ni avec les volumes persistants dynamiques.
{{< /caution >}}

## {{% heading "prerequisites" %}}

Les prérequis dépendent de la topologie choisie pour le plan de contrôle :

{{< tabs name="prerequisite_tabs" >}}
{{% tab name="Stacked etcd" %}}
<!--
Note aux réviseurs : ces prérequis doivent correspondre au début de l’onglet externe etc.
-->

Vous avez besoin de :

- Trois machines ou plus répondant aux [exigences minimales de kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#before-you-begin) pour
  les nœuds du plan de contrôle. Avoir un nombre impair de nœuds de plan de contrôle peut aider
  lors de l’élection du leader en cas de défaillance d’une machine ou d’une zone.
  - incluant un {{< glossary_tooltip text="runtime de conteneurs" term_id="container-runtime" >}}, déjà installé et fonctionnel
- Trois machines ou plus répondant aux [exigences minimales de kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#before-you-begin) pour les workers
  - incluant un runtime de conteneurs, déjà installé et fonctionnel
- Une connectivité réseau complète entre toutes les machines du cluster (réseau public ou privé)
- Des privilèges superutilisateur sur toutes les machines via `sudo`
  - Vous pouvez utiliser un autre outil ; ce guide utilise `sudo` dans les exemples.
- Un accès SSH depuis une machine vers tous les nœuds du système
- `kubeadm` et `kubelet` déjà installés sur toutes les machines.

_Voir la [topologie etcd empilée](/docs/setup/production-environment/tools/kubeadm/ha-topology/#stacked-etcd-topology) pour le contexte._

{{% /tab %}}
{{% tab name="External etcd" %}}
<!--
Note aux réviseurs : ces prérequis doivent correspondre au début de l’onglet externe etc.
-->

Vous avez besoin de :

- Trois machines ou plus répondant aux [exigences minimales de kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#before-you-begin) pour
  les nœuds du plan de contrôle. Avoir un nombre impair de nœuds de plan de contrôle peut aider
  lors de l’élection du leader en cas de défaillance d’une machine ou d’une zone.
  - incluant un {{< glossary_tooltip text="runtime de conteneurs" term_id="container-runtime" >}}, déjà configuré et fonctionnel
- Trois machines ou plus répondant aux [exigences minimales de kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#before-you-begin) pour les workers
  - incluant un runtime de conteneurs, déjà configuré et fonctionnel
- Une connectivité réseau complète entre toutes les machines du cluster (réseau public ou privé)
- Des privilèges superutilisateur sur toutes les machines via `sudo`
  - Vous pouvez utiliser un autre outil ; ce guide utilise `sudo` dans les exemples.
- Un accès SSH depuis une machine vers tous les nœuds du système
- `kubeadm` et `kubelet` déjà installés sur toutes les machines.

<!-- fin des prérequis communs -->

Et vous avez également besoin de :

- Trois machines supplémentaires ou plus, qui deviendront des membres du cluster etcd.
  Avoir un nombre impair de membres dans le cluster etcd est une exigence pour obtenir un
  quorum de vote optimal.
  - Ces machines doivent également avoir `kubeadm` et `kubelet` installés.
  - Ces machines nécessitent aussi un runtime de conteneurs, déjà configuré et fonctionnel.

_Voir la [topologie etcd externe](/docs/setup/production-environment/tools/kubeadm/ha-topology/#external-etcd-topology) pour le contexte._
{{% /tab %}}
{{< /tabs >}}

### Images de conteneurs

Chaque hôte doit avoir accès en lecture et pouvoir récupérer les images depuis le registre d’images de conteneurs Kubernetes, `registry.k8s.io`. Si vous souhaitez déployer un cluster hautement disponible dont les hôtes n’ont pas accès pour télécharger les images, c’est possible. Vous devez alors vous assurer par d’autres moyens que les bonnes images de conteneurs sont déjà disponibles sur les hôtes concernés.

### Interface en ligne de commande {#kubectl}

Pour gérer Kubernetes une fois votre cluster configuré, vous devez
[installer kubectl](/docs/tasks/tools/#kubectl) sur votre ordinateur. Il est également utile
d’installer l’outil `kubectl` sur chaque nœud du plan de contrôle, car cela peut être
utile pour le dépannage.

<!-- étapes -->

## Premières étapes pour les deux méthodes

### Création d’un load balancer pour kube-apiserver

{{< note >}}
Il existe de nombreuses configurations possibles pour les load balancers. L’exemple suivant n’est qu’une
option parmi d’autres. Les exigences de votre cluster peuvent nécessiter une configuration différente.
{{< /note >}}

1. Créer un load balancer pour le kube-apiserver avec un nom qui résout via DNS.

   - Dans un environnement cloud, vous devez placer vos nœuds du plan de contrôle derrière un load balancer TCP. Ce load balancer distribue le trafic vers tous les nœuds du plan de contrôle en bonne santé présents dans sa liste de cibles. Le contrôle de santé (health check) pour l’API server est une vérification TCP sur le port utilisé par le kube-apiserver (valeur par défaut `:6443`).

   - Il n’est pas recommandé d’utiliser directement une adresse IP dans un environnement cloud.

   - Le load balancer doit pouvoir communiquer avec tous les nœuds du plan de contrôle sur le port de l’API server. Il doit également autoriser le trafic entrant sur son port d’écoute.

   - Assurez-vous que l’adresse du load balancer correspond toujours à l’adresse définie dans le `ControlPlaneEndpoint` de kubeadm.

   - Consultez le guide [Options for Software Load Balancing](https://git.k8s.io/kubeadm/docs/ha-considerations.md#options-for-software-load-balancing) pour plus de détails.

1. Ajouter le premier nœud du plan de contrôle au load balancer, et tester la connexion :

   ```shell
   nc -zv -w 2 <LOAD_BALANCER_IP> <PORT>
   ```

   Une erreur de type connection refused est attendue car le serveur API n’est pas encore en cours d’exécution. En revanche, un timeout signifie que le load balancer ne peut pas communiquer avec le nœud du plan de contrôle. Si un timeout se produit, reconfigurez le load balancer afin qu’il puisse communiquer avec le nœud du plan de contrôle.

1. Ajouter les autres nœuds du plan de contrôle au groupe de cibles du load balancer.

## Nœuds du plan de contrôle et etcd empilés (stacked)

### Étapes pour le premier nœud du plan de contrôle

1. Initialiser le plan de contrôle :

   ```sh
   sudo kubeadm init --control-plane-endpoint "LOAD_BALANCER_DNS:LOAD_BALANCER_PORT" --upload-certs
   ```

   - Vous pouvez utiliser l’option `--kubernetes-version` pour définir la version de Kubernetes à utiliser.
     Il est recommandé que les versions de kubeadm, kubelet, kubectl et Kubernetes soient identiques.
   - L’option `--control-plane-endpoint` doit être définie avec l’adresse (ou le DNS) et le port du load balancer.

   - L’option `--upload-certs` est utilisée pour téléverser les certificats qui doivent être partagés
     entre toutes les instances du plan de contrôle dans le cluster. Si vous préférez copier les certificats
     manuellement entre les nœuds du plan de contrôle ou utiliser des outils d’automatisation, supprimez cette option et référez-vous à la section [Distribution manuelle des certificats](#manual-certs) ci-dessous.

   {{< note >}}
   Les flags `--config` et `--certificate-key` de `kubeadm init` ne peuvent pas être utilisés ensemble.
   Par conséquent, si vous souhaitez utiliser la [configuration kubeadm](/docs/reference/config-api/kubeadm-config.v1beta4/),
   vous devez ajouter le champ `certificateKey` aux emplacements appropriés
   (dans `InitConfiguration` et `JoinConfiguration: controlPlane`).
   {{< /note >}}

   {{< note >}}
   Certains plugins réseau CNI nécessitent une configuration supplémentaire, par exemple la définition du CIDR des pods, tandis que d’autres n’en ont pas besoin. 
   Consultez la [documentation CNI](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#pod-network).
   Pour ajouter un CIDR de pods, utilisez le flag `--pod-network-cidr`, ou si vous utilisez un fichier de configuration kubeadm, définissez le champ `podSubnet` dans l’objet `networking` de `ClusterConfiguration`.
   {{< /note >}}

   La sortie ressemble à :

   ```sh
   ...
   Vous pouvez maintenant joindre autant de nœuds du plan de contrôle que vous le souhaitez en exécutant la commande suivante sur chacun en tant que root :
       kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866 --control-plane --certificate-key f8902e114ef118304e561c3ecd4d0b543adc226b7a07f675f56564185ffe0c07

   Veuillez noter que la certificate-key donne accès à des données sensibles du cluster, gardez-la secrète ! 
   Par mesure de sécurité, les certificats téléversés seront supprimés au bout de deux heures. Si nécessaire, vous pouvez utiliser `kubeadm init phase upload-certs` pour recharger les certificats par la suite.

   Ensuite, vous pouvez joindre autant de nœuds workers que vous le souhaitez en exécutant la commande suivante sur chacun en tant que root :
       kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866
   ```

   - Copiez cette sortie dans un fichier texte. Vous en aurez besoin plus tard pour ajouter des nœuds du plan de contrôle et des nœuds workers au cluster.
   - Lorsque l’option `--upload-certs` est utilisée avec `kubeadm init`, les certificats du plan de contrôle principal sont chiffrés et envoyés dans le Secret `kubeadm-certs`.
   - Pour ré-envoyer les certificats et générer une nouvelle clé de déchiffrement, utilisez la commande suivante sur un nœud du plan de contrôle déjà joint au cluster :

     ```sh
     sudo kubeadm init phase upload-certs --upload-certs
     ```

   - Vous pouvez également spécifier une clé personnalisée `--certificate-key` lors de l’exécution de `init`, qui pourra ensuite être utilisée par `join`.
     Pour générer une telle clé, vous pouvez utiliser la commande suivante :

     ```sh
     kubeadm certs certificate-key
     ```

   La clé de certificat est une chaîne encodée en hexadécimal correspondant à une clé AES de 32 octets.

   {{< note >}}
   Le Secret `kubeadm-certs` ainsi que la clé de déchiffrement expirent après deux heures.
   {{< /note >}}

   {{< caution >}}
   Comme indiqué dans la sortie de la commande, la clé de certificat donne accès à des données sensibles du cluster. Gardez-la secrète !
   {{< /caution >}}

1. Appliquez le plugin CNI de votre choix :
   [Suivez ces instructions](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#pod-network) pour installer un fournisseur CNI. Assurez-vous que la configuration correspond au CIDR des Pods défini dans le fichier de configuration kubeadm (le cas échéant).

   {{< note >}}
   Vous devez choisir un plugin réseau adapté à votre cas d’usage et l’installer avant de passer à l’étape suivante. 
   Si ce n’est pas fait, vous ne pourrez pas démarrer correctement votre cluster.
   {{< /note >}}

1. Tapez la commande suivante et observez le démarrage des Pods des composants du plan de contrôle :

   ```sh
   kubectl get pod -n kube-system -w
   ```

### Étapes pour les autres nœuds du plan de contrôle

Pour chaque nœud de plan de contrôle supplémentaire, vous devez :

1. Exécutez la commande de jointure qui vous a été fournie précédemment par la sortie de `kubeadm init` sur le premier nœud.
   Elle devrait ressembler à ceci :

   ```sh
   sudo kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866 --control-plane --certificate-key f8902e114ef118304e561c3ecd4d0b543adc226b7a07f675f56564185ffe0c07
   ```

   - L’option `--control-plane` indique à `kubeadm join` de créer un nouveau plan de contrôle.
   - L’option `--certificate-key ...` permet de télécharger les certificats du plan de contrôle depuis le Secret `kubeadm-certs` du cluster, puis de les déchiffrer à l’aide de la clé fournie.

{{< note >}}
Comme les nœuds du cluster sont généralement initialisés de manière séquentielle, il est probable que les pods CoreDNS s’exécutent tous sur le premier nœud du plan de contrôle. Pour assurer une meilleure disponibilité, veuillez rééquilibrer les pods CoreDNS avec la commande `kubectl -n kube-system rollout restart deployment coredns` après qu’au moins un nouveau nœud a été rejoint.
{{< /note >}}

## Nœuds etcd externes

La configuration d’un cluster avec des nœuds etcd externes est similaire à celle du mode stacked etcd,
à l’exception du fait que vous devez d’abord configurer etcd, puis fournir les informations etcd
dans le fichier de configuration kubeadm.

### Mise en place du cluster etcd

1. Suivez ces [instructions](/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/) pour configurer le cluster etcd.

1. Configurez SSH comme décrit [ici](#manual-certs).

1. Copiez les fichiers suivants depuis n’importe quel nœud etcd du cluster vers le premier nœud du plan de contrôle :

   ```sh
   export CONTROL_PLANE="ubuntu@10.0.0.7"
   scp /etc/kubernetes/pki/etcd/ca.crt "${CONTROL_PLANE}":
   scp /etc/kubernetes/pki/apiserver-etcd-client.crt "${CONTROL_PLANE}":
   scp /etc/kubernetes/pki/apiserver-etcd-client.key "${CONTROL_PLANE}":
   ```

   - Replace the value of `CONTROL_PLANE` with the `user@host` of the first control-plane node.

### Configuration du premier nœud du plan de contrôle

1. Créez un fichier nommé `kubeadm-config.yaml` avec le contenu suivant :

   ```yaml
   ---
   apiVersion: kubeadm.k8s.io/v1beta4
   kind: ClusterConfiguration
   kubernetesVersion: stable
   controlPlaneEndpoint: "LOAD_BALANCER_DNS:LOAD_BALANCER_PORT" # change this (see below)
   etcd:
     external:
       endpoints:
         - https://ETCD_0_IP:2379 # change ETCD_0_IP appropriately
         - https://ETCD_1_IP:2379 # change ETCD_1_IP appropriately
         - https://ETCD_2_IP:2379 # change ETCD_2_IP appropriately
       caFile: /etc/kubernetes/pki/etcd/ca.crt
       certFile: /etc/kubernetes/pki/apiserver-etcd-client.crt
       keyFile: /etc/kubernetes/pki/apiserver-etcd-client.key
   ```

{{< note >}}
La différence entre etcd empilé (stacked etcd) et etcd externe ici est que la configuration etcd externe nécessite
un fichier de configuration avec les endpoints etcd sous l’objet `external` de `etcd`.
Dans le cas de la topologie etcd empilée, cela est géré automatiquement.
{{< /note >}}

- Remplacez les variables suivantes dans le modèle de configuration avec les valeurs appropriées de votre cluster :

  - `LOAD_BALANCER_DNS`
  - `LOAD_BALANCER_PORT`
  - `ETCD_0_IP`
  - `ETCD_1_IP`
  - `ETCD_2_IP`

Les étapes suivantes sont similaires à la configuration etcd empilée :

1. Exécutez `sudo kubeadm init --config kubeadm-config.yaml --upload-certs` sur ce nœud.

1. Enregistrez les commandes de jointure affichées dans un fichier texte pour une utilisation ultérieure.

1. Appliquez le plugin réseau CNI de votre choix.

{{< note >}}
Vous devez choisir un plugin réseau adapté à votre cas d’usage et le déployer avant de passer à l’étape suivante.
Sinon, vous ne pourrez pas démarrer correctement votre cluster.
{{< /note >}}

### Étapes pour les autres nœuds du plan de contrôle

Les étapes sont les mêmes que pour la configuration etcd empilée :

- Assurez-vous que le premier nœud du plan de contrôle est entièrement initialisé.
- Joignez chaque nœud de plan de contrôle avec la commande de jointure que vous avez enregistrée dans un fichier texte. Il est recommandé de les joindre un par un.
- N’oubliez pas que la clé de déchiffrement `--certificate-key` expire par défaut après deux heures.

## Tâches courantes après le démarrage du plan de contrôle

### Ajouter des workers

Les nœuds worker peuvent être ajoutés au cluster avec la commande que vous avez précédemment enregistrée lors de la sortie de `kubeadm init` :

```sh
sudo kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866
```

## Distribution manuelle des certificats {#manual-certs}

Si vous choisissez de ne pas utiliser `kubeadm init` avec le flag `--upload-certs`, cela signifie que
vous devrez copier manuellement les certificats depuis le nœud principal du plan de contrôle vers les
nœuds du plan de contrôle qui rejoignent le cluster.

Il existe plusieurs façons de faire cela. L’exemple suivant utilise `ssh` et `scp` :

SSH est requis si vous souhaitez contrôler tous les nœuds depuis une seule machine.

1. Activez `ssh-agent` sur votre machine principale qui a accès à tous les autres nœuds du système :

   ```shell
   eval $(ssh-agent)
   ```

1. Ajoutez votre identité SSH à la session :

   ```shell
   ssh-add ~/.ssh/path_to_private_key
   ```

1. Effectuez une connexion SSH entre les nœuds pour vérifier que la connexion fonctionne correctement.

   - Lorsque vous vous connectez en SSH à un nœud, ajoutez l’option `-A`. Cette option permet au nœud sur lequel vous êtes connecté via SSH d’accéder à l’agent SSH de votre PC. Envisagez des méthodes alternatives si vous ne faites pas entièrement confiance à la sécurité de votre session utilisateur sur le nœud.

     ```shell
     ssh -A 10.0.0.7
     ```

   - Lorsque vous utilisez `sudo` sur un nœud, assurez-vous de préserver l’environnement afin que la redirection SSH (SSH forwarding) fonctionne :

     ```shell
     sudo -E -s
     ```

1. Après avoir configuré SSH sur tous les nœuds, vous devez exécuter le script suivant sur le premier
   nœud du plan de contrôle après avoir exécuté `kubeadm init`. Ce script va copier les certificats depuis
   le premier nœud du plan de contrôle vers les autres nœuds du plan de contrôle :

   Dans l’exemple suivant, remplacez `CONTROL_PLANE_IPS` par les adresses IP des
   autres nœuds du plan de contrôle.

   ```sh
   USER=ubuntu # customizable
   CONTROL_PLANE_IPS="10.0.0.7 10.0.0.8"
   for host in ${CONTROL_PLANE_IPS}; do
       scp /etc/kubernetes/pki/ca.crt "${USER}"@$host:
       scp /etc/kubernetes/pki/ca.key "${USER}"@$host:
       scp /etc/kubernetes/pki/sa.key "${USER}"@$host:
       scp /etc/kubernetes/pki/sa.pub "${USER}"@$host:
       scp /etc/kubernetes/pki/front-proxy-ca.crt "${USER}"@$host:
       scp /etc/kubernetes/pki/front-proxy-ca.key "${USER}"@$host:
       scp /etc/kubernetes/pki/etcd/ca.crt "${USER}"@$host:etcd-ca.crt
       # Skip the next line if you are using external etcd
       scp /etc/kubernetes/pki/etcd/ca.key "${USER}"@$host:etcd-ca.key
   done
   ```

{{< caution >}}
Copiez uniquement les certificats listés ci-dessus. kubeadm se chargera de générer le reste des certificats
avec les SAN (Subject Alternative Name) requis pour les instances de plan de contrôle qui rejoignent le cluster. Si vous copiez tous les certificats par erreur,
la création de nouveaux nœuds peut échouer en raison de l’absence des SAN requis.
{{< /caution >}}

1. Ensuite, sur chaque nœud du plan de contrôle qui rejoint le cluster, vous devez exécuter le script suivant avant d’exécuter `kubeadm join`.
   Ce script déplacera les certificats précédemment copiés depuis le répertoire home vers `/etc/kubernetes/pki` :

   ```sh
   USER=ubuntu # customizable
   mkdir -p /etc/kubernetes/pki/etcd
   mv /home/${USER}/ca.crt /etc/kubernetes/pki/
   mv /home/${USER}/ca.key /etc/kubernetes/pki/
   mv /home/${USER}/sa.pub /etc/kubernetes/pki/
   mv /home/${USER}/sa.key /etc/kubernetes/pki/
   mv /home/${USER}/front-proxy-ca.crt /etc/kubernetes/pki/
   mv /home/${USER}/front-proxy-ca.key /etc/kubernetes/pki/
   mv /home/${USER}/etcd-ca.crt /etc/kubernetes/pki/etcd/ca.crt
   # Skip the next line if you are using external etcd
   mv /home/${USER}/etcd-ca.key /etc/kubernetes/pki/etcd/ca.key
   ```      
