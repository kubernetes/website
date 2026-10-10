---
reviewers:
- sig-cluster-lifecycle
title: Mise en place d’un cluster etcd haute disponibilité avec kubeadm
content_type: task
weight: 70
---

<!-- vue d’ensemble -->


Par défaut, kubeadm exécute une instance locale d’etcd sur chaque nœud du plan de contrôle.
Il est également possible de considérer le cluster etcd comme externe et de provisionner
des instances etcd sur des hôtes séparés. Les différences entre ces deux approches sont détaillées dans la page
[Options pour une topologie hautement disponible](/docs/setup/production-environment/tools/kubeadm/ha-topology).

Cette tâche décrit le processus de création d’un cluster etcd externe haute disponibilité composé de trois membres,
qui peut être utilisé par kubeadm lors de la création du cluster.

## {{% heading "prerequisites" %}}

- Trois hôtes capables de communiquer entre eux via les ports TCP 2379 et 2380. Ce document utilise ces ports par défaut, mais ils peuvent être configurés via le fichier de configuration kubeadm.
- Chaque hôte doit disposer de systemd et d’un shell compatible bash.
- Chaque hôte doit [avoir un runtime de conteneurs, kubelet et kubeadm installés](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/).
- Chaque hôte doit pouvoir accéder au registre d’images Kubernetes (`registry.k8s.io`) ou lister/télécharger l’image etcd requise avec
  `kubeadm config images list/pull`. Ce guide configure les instances etcd en tant que
  [pods statiques](/docs/tasks/configure-pod-container/static-pod/) gérés par kubelet.
- Une infrastructure permettant de copier des fichiers entre les hôtes. Par exemple, `ssh` et `scp` peuvent être utilisés.

<!-- étapes -->

## Configuration du cluster

L’approche générale consiste à générer tous les certificats sur un seul nœud, puis à distribuer uniquement les fichiers _nécessaires_ aux autres nœuds.

{{< note >}}
kubeadm inclut toute la mécanique cryptographique nécessaire pour générer les certificats décrits ci-dessous ; aucun autre outil cryptographique n’est requis pour cet exemple.
{{< /note >}}

{{< note >}}
Les exemples ci-dessous utilisent des adresses IPv4, mais vous pouvez également configurer kubeadm, kubelet et etcd pour utiliser des adresses IPv6. Le mode dual-stack est pris en charge par certaines options Kubernetes, mais pas par etcd. Pour plus de détails sur le support dual-stack dans Kubernetes, consultez [Support dual-stack avec kubeadm](/docs/setup/production-environment/tools/kubeadm/dual-stack-support/).
{{< /note >}}

1. Configurer le kubelet pour qu’il serve de gestionnaire de service pour etcd.

   {{< note >}}Vous devez effectuer cette étape sur chaque hôte où etcd doit être exécuté.{{< /note >}}

   Comme etcd a été créé en premier, vous devez remplacer la priorité du service en créant un nouveau fichier d’unité
   ayant une priorité plus élevée que le fichier d’unité kubelet fourni par kubeadm.

   ```sh
   cat << EOF > /etc/systemd/system/kubelet.service.d/kubelet.conf
   # Replace "systemd" with the cgroup driver of your container runtime. The default value in the kubelet is "cgroupfs".
   # Replace the value of "containerRuntimeEndpoint" for a different container runtime if needed.
   #
   apiVersion: kubelet.config.k8s.io/v1beta1
   kind: KubeletConfiguration
   authentication:
     anonymous:
       enabled: false
     webhook:
       enabled: false
   authorization:
     mode: AlwaysAllow
   cgroupDriver: systemd
   address: 127.0.0.1
   containerRuntimeEndpoint: unix:///var/run/containerd/containerd.sock
   staticPodPath: /etc/kubernetes/manifests
   EOF

   cat << EOF > /etc/systemd/system/kubelet.service.d/20-etcd-service-manager.conf
   [Service]
   ExecStart=
   ExecStart=/usr/bin/kubelet --config=/etc/systemd/system/kubelet.service.d/kubelet.conf
   Restart=always
   EOF

   systemctl daemon-reload
   systemctl restart kubelet
   ```

   Vérifiez l’état du kubelet pour vous assurer qu’il est en cours d’exécution.

   ```sh
   systemctl status kubelet
   ```
1. Créez les fichiers de configuration pour kubeadm.

   Générez un fichier de configuration kubeadm pour chaque hôte qui exécutera un membre etcd
   en utilisant le script suivant.

   ```sh
   # Update HOST0, HOST1 and HOST2 with the IPs of your hosts
   export HOST0=10.0.0.6
   export HOST1=10.0.0.7
   export HOST2=10.0.0.8

   # Update NAME0, NAME1 and NAME2 with the hostnames of your hosts
   export NAME0="infra0"
   export NAME1="infra1"
   export NAME2="infra2"

   # Create temp directories to store files that will end up on other hosts
   mkdir -p /tmp/${HOST0}/ /tmp/${HOST1}/ /tmp/${HOST2}/

   HOSTS=(${HOST0} ${HOST1} ${HOST2})
   NAMES=(${NAME0} ${NAME1} ${NAME2})

   for i in "${!HOSTS[@]}"; do
   HOST=${HOSTS[$i]}
   NAME=${NAMES[$i]}
   cat << EOF > /tmp/${HOST}/kubeadmcfg.yaml
   ---
   apiVersion: "kubeadm.k8s.io/v1beta4"
   kind: InitConfiguration
   nodeRegistration:
       name: ${NAME}
   localAPIEndpoint:
       advertiseAddress: ${HOST}
   ---
   apiVersion: "kubeadm.k8s.io/v1beta4"
   kind: ClusterConfiguration
   etcd:
       local:
           serverCertSANs:
           - "${HOST}"
           peerCertSANs:
           - "${HOST}"
           extraArgs:
           - name: initial-cluster
             value: ${NAMES[0]}=https://${HOSTS[0]}:2380,${NAMES[1]}=https://${HOSTS[1]}:2380,${NAMES[2]}=https://${HOSTS[2]}:2380
           - name: initial-cluster-state
             value: new
           - name: name
             value: ${NAME}
           - name: listen-peer-urls
             value: https://${HOST}:2380
           - name: listen-client-urls
             value: https://${HOST}:2379
           - name: advertise-client-urls
             value: https://${HOST}:2379
           - name: initial-advertise-peer-urls
             value: https://${HOST}:2380
   EOF
   done
   ```

1. Générez l’autorité de certification (CA).

   Si vous possédez déjà une CA, la seule action consiste à copier les fichiers `crt` et `key` de la CA vers :
   `/etc/kubernetes/pki/etcd/ca.crt` et `/etc/kubernetes/pki/etcd/ca.key`. Une fois ces fichiers copiés,
   passez à l’étape suivante, « Créer des certificats pour chaque membre ».

   Si vous ne possédez pas encore de CA, exécutez cette commande sur `$HOST0` (où vous avez généré les fichiers de configuration kubeadm).

   ```
   kubeadm init phase certs etcd-ca
   ```

   Cela crée deux fichiers :

   - `/etc/kubernetes/pki/etcd/ca.crt`
   - `/etc/kubernetes/pki/etcd/ca.key`

1. Créer des certificats pour chaque membre.

   ```sh
   kubeadm init phase certs etcd-server --config=/tmp/${HOST2}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-peer --config=/tmp/${HOST2}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-healthcheck-client --config=/tmp/${HOST2}/kubeadmcfg.yaml
   kubeadm init phase certs apiserver-etcd-client --config=/tmp/${HOST2}/kubeadmcfg.yaml
   cp -R /etc/kubernetes/pki /tmp/${HOST2}/
   # cleanup non-reusable certificates
   find /etc/kubernetes/pki -not -name ca.crt -not -name ca.key -type f -delete

   kubeadm init phase certs etcd-server --config=/tmp/${HOST1}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-peer --config=/tmp/${HOST1}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-healthcheck-client --config=/tmp/${HOST1}/kubeadmcfg.yaml
   kubeadm init phase certs apiserver-etcd-client --config=/tmp/${HOST1}/kubeadmcfg.yaml
   cp -R /etc/kubernetes/pki /tmp/${HOST1}/
   find /etc/kubernetes/pki -not -name ca.crt -not -name ca.key -type f -delete

   kubeadm init phase certs etcd-server --config=/tmp/${HOST0}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-peer --config=/tmp/${HOST0}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-healthcheck-client --config=/tmp/${HOST0}/kubeadmcfg.yaml
   kubeadm init phase certs apiserver-etcd-client --config=/tmp/${HOST0}/kubeadmcfg.yaml
   # No need to move the certs because they are for HOST0

   # clean up certs that should not be copied off this host
   find /tmp/${HOST2} -name ca.key -type f -delete
   find /tmp/${HOST1} -name ca.key -type f -delete
   ```

1. Copiez les certificats et les fichiers de configuration kubeadm.

   Les certificats ont été générés et doivent maintenant être déplacés vers leurs
   hôtes respectifs.

   ```sh
   USER=ubuntu
   HOST=${HOST1}
   scp -r /tmp/${HOST}/* ${USER}@${HOST}:
   ssh ${USER}@${HOST}
   USER@HOST $ sudo -Es
   root@HOST $ chown -R root:root pki
   root@HOST $ mv pki /etc/kubernetes/
   ```

1. Assurez-vous que tous les fichiers attendus existent.

   La liste complète des fichiers requis sur `$HOST0` est la suivante :

   ```
   /tmp/${HOST0}
   └── kubeadmcfg.yaml
   ---
   /etc/kubernetes/pki
   ├── apiserver-etcd-client.crt
   ├── apiserver-etcd-client.key
   └── etcd
       ├── ca.crt
       ├── ca.key
       ├── healthcheck-client.crt
       ├── healthcheck-client.key
       ├── peer.crt
       ├── peer.key
       ├── server.crt
       └── server.key
   ```

   Sur `$HOST1` :

   ```
   $HOME
   └── kubeadmcfg.yaml
   ---
   /etc/kubernetes/pki
   ├── apiserver-etcd-client.crt
   ├── apiserver-etcd-client.key
   └── etcd
       ├── ca.crt
       ├── healthcheck-client.crt
       ├── healthcheck-client.key
       ├── peer.crt
       ├── peer.key
       ├── server.crt
       └── server.key
   ```

    Sur `$HOST2` :

    ```
   $HOME
   └── kubeadmcfg.yaml
   ---
   /etc/kubernetes/pki
   ├── apiserver-etcd-client.crt
   ├── apiserver-etcd-client.key
   └── etcd
       ├── ca.crt
       ├── healthcheck-client.crt
       ├── healthcheck-client.key
       ├── peer.crt
       ├── peer.key
       ├── server.crt
       └── server.key
   ```

1. Créez les manifests de pods statiques.

   Maintenant que les certificats et les fichiers de configuration sont en place, il est temps de créer les manifests. Sur chaque hôte, exécutez la commande `kubeadm` pour générer un manifest statique pour etcd.

   ```sh
   root@HOST0 $ kubeadm init phase etcd local --config=/tmp/${HOST0}/kubeadmcfg.yaml
   root@HOST1 $ kubeadm init phase etcd local --config=$HOME/kubeadmcfg.yaml
   root@HOST2 $ kubeadm init phase etcd local --config=$HOME/kubeadmcfg.yaml
   ```

1. Optionnel : Vérifiez l’état de santé du cluster.

   Si `etcdctl` n’est pas disponible, vous pouvez exécuter cet outil dans une image de conteneur.
   Vous pouvez le faire directement avec votre runtime de conteneurs en utilisant un outil tel que
   `crictl run`, et non via Kubernetes.

    ```sh
    ETCDCTL_API=3 etcdctl \
    --cert /etc/kubernetes/pki/etcd/peer.crt \
    --key /etc/kubernetes/pki/etcd/peer.key \
    --cacert /etc/kubernetes/pki/etcd/ca.crt \
    --endpoints https://${HOST0}:2379 endpoint health
    ...
    https://[HOST0 IP]:2379 is healthy: successfully committed proposal: took = 16.283339ms
    https://[HOST1 IP]:2379 is healthy: successfully committed proposal: took = 19.44402ms
    https://[HOST2 IP]:2379 is healthy: successfully committed proposal: took = 35.926451ms
    ```

    - Définissez `${HOST0}` avec l’adresse IP de l’hôte que vous testez.

## {{% heading "whatsnext" %}}

Une fois que vous disposez d’un cluster etcd avec 3 membres fonctionnels, vous pouvez continuer à mettre en place un plan de contrôle haute disponibilité en utilisant la
[méthode etcd externe avec kubeadm](/docs/setup/production-environment/tools/kubeadm/high-availability/).