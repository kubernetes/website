---
title: Support dual-stack avec kubeadm
content_type: task
weight: 100
min-kubernetes-server-version: 1.21
---

<!-- aperçu -->

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

Votre cluster Kubernetes inclut le support du [dual-stack](/docs/concepts/services-networking/dual-stack/),
ce qui signifie que le réseau du cluster permet d’utiliser l’une ou l’autre famille d’adresses IP.
Dans un cluster, le plan de contrôle peut attribuer à la fois une adresse IPv4 et une adresse IPv6 à un seul
{{< glossary_tooltip text="Pod" term_id="pod" >}} ou à un {{< glossary_tooltip text="Service" term_id="service" >}}.

<!-- corps -->

## {{% heading "prerequisites" %}}

Vous devez avoir installé l’outil {{< glossary_tooltip text="kubeadm" term_id="kubeadm" >}},
en suivant les étapes de [Installation de kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/).

Pour chaque serveur que vous souhaitez utiliser comme {{< glossary_tooltip text="nœud" term_id="node" >}},
assurez-vous que le forwarding IPv6 est activé.

### Activer le forwarding des paquets IPv6 {#prerequisite-ipv6-forwarding}

Pour vérifier si le forwarding IPv6 est activé :

```bash
sysctl net.ipv6.conf.all.forwarding
```

Si la sortie est `net.ipv6.conf.all.forwarding = 1`, le transfert de paquets IPv6 est déjà activé.

Sinon, il n'est pas encore activé.

Pour activer manuellement le transfert de paquets IPv6 :

```bash
# sysctl params required by setup, params persist across reboots
cat <<EOF | sudo tee -a /etc/sysctl.d/k8s.conf
net.ipv6.conf.all.forwarding = 1
EOF

# Apply sysctl params without reboot
sudo sysctl --system
```

Vous devez disposer d’une plage d’adresses IPv4 et IPv6 à utiliser. Les opérateurs de cluster utilisent généralement
des plages d’adresses privées pour IPv4. Pour IPv6, un opérateur de cluster choisit généralement un bloc d’adresses unicast global
dans `2000::/3`, en utilisant une plage attribuée à l’opérateur.
Vous n’avez pas besoin de router les plages d’adresses IP du cluster vers Internet.

La taille des allocations d’adresses IP doit être adaptée au nombre de Pods et de Services que vous prévoyez d’exécuter.

{{< note >}}
Si vous mettez à niveau un cluster existant avec la commande `kubeadm upgrade`,
kubeadm ne prend pas en charge la modification de la plage d’adresses IP des Pods
(“cluster CIDR”) ni de la plage d’adresses des Services (“Service CIDR”) du cluster.
{{< /note >}}

### Créer un cluster dual-stack

Pour créer un cluster dual-stack avec `kubeadm init`, vous pouvez passer des arguments en ligne de commande
similaires à l’exemple suivant :

```shell
# These address ranges are examples
kubeadm init --pod-network-cidr=10.244.0.0/16,2001:db8:42:0::/56 --service-cidr=10.96.0.0/16,2001:db8:42:1::/112
```

Pour plus de clarté, voici un exemple de fichier de configuration kubeadm
[configuration kubeadm](/docs/reference/config-api/kubeadm-config.v1beta4/)
`kubeadm-config.yaml` pour le nœud principal du plan de contrôle en dual-stack.

```yaml
---
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
networking:
  podSubnet: 10.244.0.0/16,2001:db8:42:0::/56
  serviceSubnet: 10.96.0.0/16,2001:db8:42:1::/112
---
apiVersion: kubeadm.k8s.io/v1beta4
kind: InitConfiguration
localAPIEndpoint:
  advertiseAddress: "10.100.0.1"
  bindPort: 6443
nodeRegistration:
  kubeletExtraArgs:
  - name: "node-ip"
    value: "10.100.0.2,fd00:1:2:3::2"
```

`advertiseAddress` dans `InitConfiguration` spécifie l’adresse IP sur laquelle le serveur API annonce qu’il écoute.
La valeur de `advertiseAddress` correspond au flag `--apiserver-advertise-address` de `kubeadm init`.

Exécutez kubeadm pour initialiser le nœud du plan de contrôle en dual-stack :

```shell
kubeadm init --config=kubeadm-config.yaml
```

Les flags du kube-controller-manager `--node-cidr-mask-size-ipv4` et `--node-cidr-mask-size-ipv6`
sont définis avec des valeurs par défaut. Voir
[configurer le dual-stack IPv4/IPv6](/docs/concepts/services-networking/dual-stack#configure-ipv4-ipv6-dual-stack).

{{< note >}}
Le flag `--apiserver-advertise-address` ne prend pas en charge le dual-stack.
{{< /note >}}

### Joindre un nœud à un cluster dual-stack

Avant de joindre un nœud, assurez-vous que celui-ci dispose d’une interface réseau IPv6 routable et que le forwarding IPv6 est activé.

Voici un exemple de fichier de configuration kubeadm
[configuration kubeadm](/docs/reference/config-api/kubeadm-config.v1beta4/)
`kubeadm-config.yaml` pour ajouter un nœud worker au cluster.

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: JoinConfiguration
discovery:
  bootstrapToken:
    apiServerEndpoint: 10.100.0.1:6443
    token: "clvldh.vjjwg16ucnhp94qr"
    caCertHashes:
    - "sha256:a4863cde706cfc580a439f842cc65d5ef112b7b2be31628513a9881cf0d9fe0e"
    # change auth info above to match the actual token and CA certificate hash for your cluster
nodeRegistration:
  kubeletExtraArgs:
  - name: "node-ip"
    value: "10.100.0.2,fd00:1:2:3::3"
```

Voici également un exemple de fichier de configuration kubeadm
[configuration kubeadm](/docs/reference/config-api/kubeadm-config.v1beta4/)
`kubeadm-config.yaml` pour ajouter un autre nœud de plan de contrôle au cluster.

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: JoinConfiguration
controlPlane:
  localAPIEndpoint:
    advertiseAddress: "10.100.0.2"
    bindPort: 6443
discovery:
  bootstrapToken:
    apiServerEndpoint: 10.100.0.1:6443
    token: "clvldh.vjjwg16ucnhp94qr"
    caCertHashes:
    - "sha256:a4863cde706cfc580a439f842cc65d5ef112b7b2be31628513a9881cf0d9fe0e"
    # change auth info above to match the actual token and CA certificate hash for your cluster
nodeRegistration:
  kubeletExtraArgs:
  - name: "node-ip"
    value: "10.100.0.2,fd00:1:2:3::4"
```

`advertiseAddress` dans JoinConfiguration.controlPlane spécifie l'adresse IP sur laquelle
le serveur API annoncera son écoute. La valeur de `advertiseAddress` correspond à
l'option `--apiserver-advertise-address` de `kubeadm join`.

```shell
kubeadm join --config=kubeadm-config.yaml
```

### Créer un cluster mono-stack

{{< note >}}
Le support du dual-stack ne signifie pas que vous devez obligatoirement utiliser un adressage dual-stack.
Vous pouvez déployer un cluster mono-stack avec la fonctionnalité de dual-stack réseau activée.
{{< /note >}}

Pour plus de clarté, voici un exemple de fichier de configuration kubeadm
[configuration kubeadm](/docs/reference/config-api/kubeadm-config.v1beta4/)
`kubeadm-config.yaml` pour un nœud de plan de contrôle en mono-stack.

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
networking:
  podSubnet: 10.244.0.0/16
  serviceSubnet: 10.96.0.0/16
```

## {{% heading "whatsnext" %}}

* [Valider le dual-stack IPv4/IPv6](/docs/tasks/network/validate-dual-stack)
* En savoir plus sur le réseau de cluster [Dual-stack](/docs/concepts/services-networking/dual-stack/)
* Découvrir le format de configuration kubeadm [configuration kubeadm](/docs/reference/config-api/kubeadm-config.v1beta4/)
