---
title: Création de clusters hautement disponibles avec kubeadm
description: Cluster Kubernetes haute-disponibilité kubeadm
content_template: templates/task
weight: 60
---

{{% capture overview %}}

Cette page explique deux approches différentes pour configurer un Kubernetes à haute disponibilité.
cluster utilisant kubeadm:

- Avec des nœuds de control plane empilés. Cette approche nécessite moins d'infrastructure. 
Les membres etcd et les nœuds du control plane sont co-localisés.
- Avec un cluster etcd externe cette approche nécessite plus d'infrastructure. 
Les nœuds du control plane et les membres etcd sont séparés.

Avant de poursuivre, vous devez déterminer avec soin quelle approche répond le mieux 
aux besoins de vos applications et de l'environnement. [Cette comparaison](/docs/setup/independent/ha-topology/) 
décrit les avantages et les inconvénients de chacune.

Vos clusters doivent exécuter Kubernetes version 1.12 ou ultérieure. Vous devriez aussi savoir que
la mise en place de clusters HA avec kubeadm est toujours expérimentale et sera simplifiée davantage
dans les futures versions. Vous pouvez par exemple rencontrer des problèmes lors de la mise à niveau de vos clusters.
Nous vous encourageons à essayer l’une ou l’autre approche et à nous faire part de vos commentaires dans 
[Suivi des problèmes Kubeadm](https://github.com/kubernetes/kubeadm/issues/new).

Notez que la fonctionnalité alpha `HighAvailability` est obsolète dans la version 1.12 et supprimée dans la version 1.13

Voir aussi [La documentation de mise à niveau HA](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade-ha-1-13).

{{< caution >}}
Cette page ne traite pas de l'exécution de votre cluster sur un fournisseur de cloud. Dans un 
environnement Cloud, les approches documentées ici ne fonctionne ni avec des objets de type
load balancer, ni avec des volumes persistants dynamiques.
{{< /caution >}}

{{% /capture %}}

{{% capture prerequisites %}}

Pour les deux méthodes, vous avez besoin de cette infrastructure:

- Trois machines qui répondent aux pré-requis des [exigences de kubeadm](/docs/setup/independent/install-kubeadm/#before-you-begin) pour les maîtres (masters)
- Trois machines qui répondent aux pré-requis des [exigences de kubeadm](/docs/setup/independent/install-kubeadm/#before-you-begin) pour les workers
- Connectivité réseau complète entre toutes les machines du cluster (public ou réseau privé)
- Privilèges sudo sur toutes les machines
- Accès SSH d'une machine à tous les nœuds du cluster
- `kubeadm` et une `kubelet` installés sur toutes les machines. `kubectl` est optionnel.

Pour le cluster etcd externe uniquement, vous avez besoin également de:

- Trois machines supplémentaires pour les membres etcd

{{< note >}}
Les exemples suivants utilisent Calico en tant que fournisseur de réseau de Pod. Si vous utilisez un autre
CNI, pensez à remplacer les valeurs par défaut si nécessaire.
{{< /note >}}

{{% /capture %}}

{{% capture steps %}}

## Premières étapes pour les deux méthodes

{{< note >}}
Toutes les commandes d'un control plane ou d'un noeud etcd doivent être
éxecutées en tant que root.
{{< /note >}}

- Certains plugins réseau CNI tels que Calico nécessitent un CIDR tel que `192.168.0.0 / 16` et 
certains comme Weave n'en ont pas besoin. Voir la 
[Documentation du CNI réseau](/docs/setup/independent/create-cluster-kubeadm/#pod-network).
  Pour ajouter un CIDR de pod, définissez le champ `podSubnet: 192.168.0.0 / 16` sous
  l'objet `networking` de` ClusterConfiguration`.

### Créez un load balancer pour kube-apiserver

{{< note >}}
Il existe de nombreuses configurations pour les équilibreurs de charge (load balancer). 
L'exemple suivant n'est qu'un exemple. Vos exigences pour votre cluster peuvent nécessiter une configuration différente.
{{< /note >}}

1. Créez un load balancer kube-apiserver avec un nom résolu en DNS.

    - Dans un environnement cloud, placez vos nœuds du control plane derrière un load balancer TCP. 
    Ce load balancer distribue le trafic à tous les nœuds du control plane sains dans sa liste. 
    La vérification de la bonne santé d'un apiserver est une vérification TCP sur le port que 
    kube-apiserver écoute (valeur par défaut: `6443`).

    - Il n'est pas recommandé d'utiliser une adresse IP directement dans un environnement cloud.

    - Le load balancer doit pouvoir communiquer avec tous les nœuds du control plane sur le 
    port apiserver. Il doit également autoriser le trafic entrant sur son réseau de port d'écoute.

    - [HAProxy](http://www.haproxy.org/) peut être utilisé comme load balancer.

    - Assurez-vous que l'adresse du load balancer correspond toujours à
      l'adresse de `ControlPlaneEndpoint` de kubeadm.

1. Ajoutez les premiers nœuds du control plane au load balancer et testez la connexion:

    ```sh
    nc -v LOAD_BALANCER_IP PORT
    ```

    - Une erreur `connection refused` est attendue car l'apiserver n'est pas encore en fonctionnement.
     Cependant, un timeout signifie que le load balancer ne peut pas communiquer avec le nœud du 
     control plane. Si un timeout survient, reconfigurez le load balancer pour communiquer avec le nœud du control plane.

1.  Ajouter les nœuds du control plane restants au groupe cible du load balancer.

### Configurer SSH

SSH est requis si vous souhaitez contrôler tous les nœuds à partir d'une seule machine.

1.  Activer ssh-agent sur votre machine ayant accès à tous les autres nœuds du cluster:

    ```
    eval $(ssh-agent)
    ```

1.  Ajoutez votre clé SSH à la session:

    ```
    ssh-add ~/.ssh/path_to_private_key
    ```

1.  SSH entre les nœuds pour vérifier que la connexion fonctionne correctement.

    - Lorsque vous faites un SSH sur un noeud, assurez-vous d’ajouter l’option `-A`:

        ```
        ssh -A 10.0.0.7
        ```

    - Lorsque vous utilisez sudo sur n’importe quel nœud, veillez à préserver l’environnement afin que le SSH forwarding fonctionne:

        ```
        sudo -E -s
        ```

## Control plane empilé et nœuds etcd

### Étapes pour le premier nœud du control plane

1.  Sur le premier nœud du control plane, créez un fichier de configuration appelé `kubeadm-config.yaml`:

        apiVersion: kubeadm.k8s.io/v1beta1
        kind: ClusterConfiguration
        kubernetesVersion: stable
        apiServer:
          certSANs:
          - "LOAD_BALANCER_DNS"
        controlPlaneEndpoint: "LOAD_BALANCER_DNS:LOAD_BALANCER_PORT"

    - `kubernetesVersion` doit représenter la version de Kubernetes à utiliser. Cet exemple utilise `stable`.
    - `controlPlaneEndpoint` doit correspondre à l'adresse ou au DNS et au port du load balancer.
    - Il est recommandé que les versions de kubeadm, kubelet, kubectl et kubernetes correspondent.

1.  Assurez-vous que le nœud est dans un état sain:

    ```sh
    sudo kubeadm init --config=kubeadm-config.yaml
    ```
    
    Vous devriez voir quelque chose comme:
    
    ```sh
    ...
Vous pouvez à présent joindre n'importe quelle machine au cluster en lancant la commande suivante sur 
chaque nœeud en tant que root:
    
    kubeadm join 192.168.0.200:6443 --token j04n3m.octy8zely83cy2ts --discovery-token-ca-cert-hash    sha256:84938d2a22203a8e56a787ec0c6ddad7bc7dbd52ebabc62fd5f4dbea72b14d1f
    ```

1.  Copiez ce jeton dans un fichier texte. Vous en aurez besoin plus tard pour joindre 
d’autres nœuds du control plane au cluster.

1.  Activez l'extension CNI Weave:

    ```sh
    kubectl apply -f "https://cloud.weave.works/k8s/net?k8s-version=$(kubectl version | base64 | tr -d '\n')"
    ```

1.  Tapez ce qui suit et observez les pods des composants démarrer:

    ```sh
    kubectl get pod -n kube-system -w
    ```

    - Il est recommandé de ne joindre les nouveaux nœuds du control plane qu'après l'initialisation du premier nœud.

1.  Copiez les fichiers de certificat du premier nœud du control plane dans les autres:
 
    Dans l'exemple suivant, remplacez `CONTROL_PLANE_IPS` par les adresses IP des autres nœuds du control plane.
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
        scp /etc/kubernetes/pki/etcd/ca.key "${USER}"@$host:etcd-ca.key
        scp /etc/kubernetes/admin.conf "${USER}"@$host:
    done
    ```

{{< caution >}}
N'utilisez que les certificats de la liste ci-dessus. kubeadm se chargera de générer le reste des certificats avec les SANs requis pour les instances du control plane qui se joignent. 
Si vous copiez tous les certificats par erreur, la création de noeuds supplémentaires pourrait
 échouer en raison d'un manque de SANs requis.
{{< /caution >}}

### Étapes pour le reste des nœuds du control plane

1. Déplacer les fichiers créés à l'étape précédente où `scp` était utilisé:

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
    mv /home/${USER}/etcd-ca.key /etc/kubernetes/pki/etcd/ca.key
    mv /home/${USER}/admin.conf /etc/kubernetes/admin.conf
    ```

    Ce processus écrit tous les fichiers demandés dans le dossier `/etc/kubernetes`.

1.  Lancez `kubeadm join` sur ce nœud en utilisant la commande de join qui vous avait été précédemment 
donnée par` kubeadm init` sur le premier noeud. Ça devrait ressembler a quelque chose
 comme ça:

    ```sh
    sudo kubeadm join 192.168.0.200:6443 --token j04n3m.octy8zely83cy2ts --discovery-token-ca-cert-hash sha256:84938d2a22203a8e56a787ec0c6ddad7bc7dbd52ebabc62fd5f4dbea72b14d1f --experimental-control-plane
    ```

    - Remarquez l'ajout de l'option `--experimental-control-plane`. Ce paramètre automatise l'adhésion au 
    control plane du cluster.

1.  Tapez ce qui suit et observez les pods des composants démarrer:

    ```sh
    kubectl get pod -n kube-system -w
    ```

1.  Répétez ces étapes pour le reste des nœuds du control plane.

## Noeuds etcd externes

### Configurer le cluster etcd

- Suivez ces [instructions](/docs/setup/independent/setup-ha-etcd-with-kubeadm/)
  pour configurer le cluster etcd.

### Configurer le premier nœud du control plane

1. Copiez les fichiers suivants de n’importe quel nœud du cluster etcd vers ce nœud.:

    ```sh
    export CONTROL_PLANE="ubuntu@10.0.0.7"
    +scp /etc/kubernetes/pki/etcd/ca.crt "${CONTROL_PLANE}":
    +scp /etc/kubernetes/pki/apiserver-etcd-client.crt "${CONTROL_PLANE}":
    +scp /etc/kubernetes/pki/apiserver-etcd-client.key "${CONTROL_PLANE}":
    ```

    - Remplacez la valeur de `CONTROL_PLANE` par l'`utilisateur@hostname` de cette machine.

1.  Créez un fichier YAML appelé `kubeadm-config.yaml` avec le contenu suivant:

        apiVersion: kubeadm.k8s.io/v1beta1
        kind: ClusterConfiguration
        kubernetesVersion: stable
        apiServer:
          certSANs:
          - "LOAD_BALANCER_DNS"
        controlPlaneEndpoint: "LOAD_BALANCER_DNS:LOAD_BALANCER_PORT"
        etcd:
            external:
                endpoints:
                - https://ETCD_0_IP:2379
                - https://ETCD_1_IP:2379
                - https://ETCD_2_IP:2379
                caFile: /etc/kubernetes/pki/etcd/ca.crt
                certFile: /etc/kubernetes/pki/apiserver-etcd-client.crt
                keyFile: /etc/kubernetes/pki/apiserver-etcd-client.key

    - La différence entre etcd empilé et externe, c’est que nous utilisons le champ `external`
     pour `etcd` dans la configuration de kubeadm. Dans le cas de la topologie etcd empilée, 
     c'est géré automatiquement.
     
    - Remplacez les variables suivantes dans le modèle (template) par les valeurs appropriées
     pour votre cluster:

        - `LOAD_BALANCER_DNS`
        - `LOAD_BALANCER_PORT`
        - `ETCD_0_IP`
        - `ETCD_1_IP`
        - `ETCD_2_IP`

1.  Lancez `kubeadm init --config kubeadm-config.yaml` sur ce nœud.

1.  Ecrivez le résultat de la commande de join dans un fichier texte pour une utilisation ultérieure.

1.  Appliquer le plugin CNI Weave:

    ```sh
    kubectl apply -f "https://cloud.weave.works/k8s/net?k8s-version=$(kubectl version | base64 | tr -d '\n')"
    ```

### Étapes pour le reste des nœuds du control plane

Pour ajouter le reste des nœuds du control plane, suivez [ces instructions](#étapes-pour-le-reste-des-nœuds-du-control-plane).
Les étapes sont les mêmes que pour la configuration etcd empilée, à l’exception du fait qu'un membre
 etcd local n'est pas créé.

Pour résumer:

- Assurez-vous que le premier nœud du control plane soit complètement initialisé.
- Copier les certificats entre le premier nœud du control plane et les autres nœuds du control plane.
- Joignez chaque nœud du control plane à l'aide de la commande de join que vous avez enregistrée dans
 un fichier texte, puis ajoutez l'option `--experimental-control-plane`.

## Tâches courantes après l'amorçage du control plane

### Installer un réseau de pod

[Suivez ces instructions](/docs/setup/independent/create-cluster-kubeadm/#pod-network) afin
 d'installer le réseau de pod. Assurez-vous que cela correspond au pod CIDR que vous avez fourni 
 dans le fichier de configuration principal.

### Installer les workers

Chaque nœud worker peut maintenant être joint au cluster avec la commande renvoyée à partir du resultat
 de n’importe quelle commande `kubeadm init`. L'option `--experimental-control-plane` ne doit pas 
 être ajouté aux nœuds workers.

{{% /capture %}}
