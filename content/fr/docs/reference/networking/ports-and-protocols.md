---
title: Ports et protocoles
content_type: reference
weight: 40
---

Lorsque vous exécutez Kubernetes dans un environnement au cloisonnement réseau
strict, comme un centre de données sur site avec des pare-feu physiques ou des
réseaux virtuels dans un cloud public, il est utile de connaître les ports et
les protocoles utilisés par les composants de Kubernetes.

## Plan de contrôle {#control-plane}

| Protocole | Sens    | Plage de ports | Usage                        | Utilisé par                         |
|-----------|---------|----------------|------------------------------|-------------------------------------|
| TCP       | Entrant | 6443           | Serveur d'API Kubernetes     | Tous                                |
| TCP       | Entrant | 2379-2380      | API cliente du serveur etcd  | kube-apiserver, etcd                |
| TCP       | Entrant | 10250          | API du kubelet               | Le nœud lui-même, plan de contrôle  |
| TCP       | Entrant | 10259          | kube-scheduler               | Le nœud lui-même                    |
| TCP       | Entrant | 10257          | kube-controller-manager      | Le nœud lui-même                    |

Bien que les ports d'etcd figurent dans la section du plan de contrôle, vous
pouvez aussi héberger votre propre cluster etcd en externe ou sur des ports
personnalisés.

## Nœuds de travail {#node}

| Protocole | Sens    | Plage de ports | Usage                 | Utilisé par                               |
|-----------|---------|----------------|-----------------------|-------------------------------------------|
| TCP       | Entrant | 10250          | API du kubelet        | Le nœud lui-même, plan de contrôle        |
| TCP       | Entrant | 10256          | kube-proxy            | Le nœud lui-même, équilibreurs de charge  |
| TCP       | Entrant | 30000-32767    | Services NodePort†    | Tous                                      |
| UDP       | Entrant | 30000-32767    | Services NodePort†    | Tous                                      |

† Plage de ports par défaut des [Services NodePort](/docs/concepts/services-networking/service/).

Tous les numéros de port par défaut peuvent être modifiés. Si vous utilisez des
ports personnalisés, ce sont ces ports qu'il faut ouvrir, et non les ports par
défaut indiqués ici.

Un exemple courant est le port du serveur d'API, parfois remplacé par le port 443.
Vous pouvez aussi conserver le port par défaut et placer le serveur d'API derrière un
équilibreur de charge qui écoute sur le port 443 et transmet les requêtes au
serveur d'API sur le port par défaut.
