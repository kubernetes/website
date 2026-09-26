---
title: Certificats PKI et exigences
reviewers:
  - sig-cluster-lifecycle
content_type: concept
weight: 50
---

<!-- overview -->

Kubernetes nécessite des certificats PKI pour l’authentification via TLS.
Si vous installez Kubernetes avec [kubeadm](/docs/reference/setup-tools/kubeadm/), les certificats requis par votre cluster sont générés automatiquement.
Vous pouvez également générer vos propres certificats — par exemple, pour mieux sécuriser vos clés privées en évitant de les stocker sur le serveur API.
Cette page explique les certificats nécessaires à votre cluster.

<!-- body -->

## Utilisation des certificats par votre cluster

Kubernetes utilise la PKI pour les opérations suivantes :

### Certificats serveur

- Certificat serveur pour le point de terminaison du serveur API
- Certificat serveur pour le serveur etcd
- [Certificats serveur](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/#client-and-serving-certificates)
  pour chaque kubelet (chaque {{< glossary_tooltip text="nœud" term_id="node" >}} exécute un kubelet)
- Certificat serveur optionnel pour le [front-proxy](/docs/tasks/extend-kubernetes/configure-aggregation-layer/)

### Certificats client

- Certificats client pour chaque kubelet, utilisés pour s’authentifier auprès du serveur API en tant que client de l’API Kubernetes
- Certificat client pour chaque serveur API, utilisé pour s’authentifier auprès d’etcd
- Certificat client pour le controller manager afin de communiquer de manière sécurisée avec le serveur API
- Certificat client pour le scheduler afin de communiquer de manière sécurisée avec le serveur API
- Certificats client, un pour chaque nœud, pour que kube-proxy s’authentifie auprès du serveur API
- Certificats client optionnels pour les administrateurs du cluster afin de s’authentifier auprès du serveur API
- Certificat client optionnel pour le [front-proxy](/docs/tasks/extend-kubernetes/configure-aggregation-layer/)

### Certificats serveur et client du kubelet

Pour établir une connexion sécurisée et s’authentifier auprès du kubelet, le serveur API nécessite une paire certificat/clé client.

Dans ce scénario, deux approches sont possibles :

- **Certificats partagés** : le kube-apiserver peut utiliser la même paire certificat/clé que celle utilisée pour authentifier ses clients. Cela signifie que les certificats existants, comme `apiserver.crt` et `apiserver.key`, peuvent être utilisés pour communiquer avec les serveurs kubelet.

- **Certificats distincts** : le kube-apiserver peut générer une nouvelle paire certificat/clé client pour s’authentifier auprès des serveurs kubelet. Dans ce cas, un certificat distinct nommé `kubelet-client.crt` ainsi que sa clé privée `kubelet-client.key` sont créés.

{{< note >}}
Les certificats `front-proxy` sont requis uniquement si vous utilisez kube-proxy pour prendre en charge
[un serveur d’API d’extension](/docs/tasks/extend-kubernetes/setup-extension-api-server/).
{{< /note >}}

etcd implémente également le TLS mutuel pour authentifier les clients et les pairs.

## Emplacement des certificats

Si vous installez Kubernetes avec kubeadm, la plupart des certificats sont stockés dans `/etc/kubernetes/pki`.
Tous les chemins de cette documentation sont relatifs à ce répertoire, à l’exception des certificats des comptes utilisateurs que kubeadm place dans `/etc/kubernetes`.

## Configuration manuelle des certificats

Si vous ne souhaitez pas que kubeadm génère les certificats requis, vous pouvez les créer en utilisant une seule autorité de certification (CA) racine ou en fournissant tous les certificats.
Voir [Certificats](/docs/tasks/administer-cluster/certificates/) pour plus de détails.
Voir également [Gestion des certificats avec kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/).

### CA racine unique

Vous pouvez créer une CA racine unique, contrôlée par un administrateur. Cette CA peut ensuite créer plusieurs CA intermédiaires.

CA requises :

| Chemin                 | CN par défaut             | Description                                                                       |
| ---------------------- | ------------------------- | --------------------------------------------------------------------------------- |
| ca.crt,key             | kubernetes-ca             | CA Kubernetes générale                                                            |
| etcd/ca.crt,key        | etcd-ca                   | Pour toutes les opérations liées à etcd                                           |
| front-proxy-ca.crt,key | kubernetes-front-proxy-ca | Pour le [front-proxy](/docs/tasks/extend-kubernetes/configure-aggregation-layer/) |

En plus des autorités de certification mentionnées ci-dessus, il est également nécessaire d'obtenir une paire de clés publique/privée pour la gestion des comptes de service : les fichiers `sa.key` et `sa.pub`.
L'exemple suivant illustre les fichiers de clé et de certificat de l'autorité de certification présentés dans le tableau précédent :

```
/etc/kubernetes/pki/ca.crt
/etc/kubernetes/pki/ca.key
/etc/kubernetes/pki/etcd/ca.crt
/etc/kubernetes/pki/etcd/ca.key
/etc/kubernetes/pki/front-proxy-ca.crt
/etc/kubernetes/pki/front-proxy-ca.key
```

### Tous les certificats

Vous pouvez générer tous les certificats vous-même si vous ne souhaitez pas copier les clés privées de la CA.

Certificats requis :

| Default CN                    | Parent CA                 | O (in Subject) | kind           | hosts (SAN)                                         |
| ----------------------------- | ------------------------- | -------------- | -------------- | --------------------------------------------------- |
| kube-etcd                     | etcd-ca                   |                | server, client | `<hostname>`, `<Host_IP>`, `localhost`, `127.0.0.1` |
| kube-etcd-peer                | etcd-ca                   |                | server, client | `<hostname>`, `<Host_IP>`, `localhost`, `127.0.0.1` |
| kube-etcd-healthcheck-client  | etcd-ca                   |                | client         |                                                     |
| kube-apiserver-etcd-client    | etcd-ca                   |                | client         |                                                     |
| kube-apiserver                | kubernetes-ca             |                | server         | `<hostname>`, `<Host_IP>`, `<advertise_IP>`[^1]     |
| kube-apiserver-kubelet-client | kubernetes-ca             | system:masters | client         |                                                     |
| front-proxy-client            | kubernetes-front-proxy-ca |                | client         |                                                     |

{{< note >}}
Au lieu d'utiliser le groupe de super-utilisateurs `system:masters` pour `kube-apiserver-kubelet-client`,
un groupe moins privilégié peut être utilisé. kubeadm utilise le groupe `kubeadm:cluster-admins` à cette fin.
{{< /note >}}

[^1]: toute autre adresse IP ou nom DNS utilisé pour accéder à votre cluster (tel qu’utilisé par [kubeadm](/docs/reference/setup-tools/kubeadm/), incluant l’adresse IP stable du load balancer et/ou le nom DNS, `kubernetes`, `kubernetes.default`, `kubernetes.default.svc`, `kubernetes.default.svc.cluster`, `kubernetes.default.svc.cluster.local`)

où `kind` correspond à une ou plusieurs utilisations de la clé x509, également documentées dans le fichier
`.spec.usages` d'une [CertificateSigningRequest](/docs/reference/kubernetes-api/authentication-resources/certificate-signing-request-v1#CertificateSigningRequest)
type :

| kind   | Key usage                                        |
| ------ | ------------------------------------------------ |
| server | digital signature, key encipherment, server auth |
| client | digital signature, key encipherment, client auth |

{{< note >}}
Les hôtes/SAN listés ci-dessus sont ceux recommandés pour obtenir un cluster fonctionnel ; si nécessaire pour une configuration spécifique, il est possible d’ajouter des SAN supplémentaires à tous les certificats serveur.
{{< /note >}}

{{< note >}}
Pour les utilisateurs de kubeadm uniquement :

- Le scénario dans lequel vous copiez dans votre cluster les certificats de l’autorité de certification (CA) sans les clés privées est appelé **CA externe** dans la documentation kubeadm.
- Si vous comparez la liste ci-dessus avec une PKI générée par kubeadm, notez que les certificats `kube-etcd`, `kube-etcd-peer` et `kube-etcd-healthcheck-client` ne sont pas générés dans le cas d’un etcd externe.

{{< /note >}}

### Chemins des certificats

Les certificats doivent être placés dans un chemin recommandé (comme utilisé par [kubeadm](/docs/reference/setup-tools/kubeadm/)).
Les chemins doivent être spécifiés à l’aide des arguments indiqués, quel que soit leur emplacement.

| DefaultCN                     | recommendedkeypath           | recommendedcertpath          | command                 | keyargument                | certargument                                                |
| ----------------------------- | ---------------------------- | ---------------------------- | ----------------------- | -------------------------- | ----------------------------------------------------------- |
| etcd-ca                       | etcd/ca.key                  | etcd/ca.crt                  | kube-apiserver          |                            | --etcd-cafile                                               |
| kube-apiserver-etcd-client    | apiserver-etcd-client.key    | apiserver-etcd-client.crt    | kube-apiserver          | --etcd-keyfile             | --etcd-certfile                                             |
| kubernetes-ca                 | ca.key                       | ca.crt                       | kube-apiserver          |                            | --client-ca-file                                            |
| kubernetes-ca                 | ca.key                       | ca.crt                       | kube-controller-manager | --cluster-signing-key-file | --client-ca-file,--root-ca-file,--cluster-signing-cert-file |
| kube-apiserver                | apiserver.key                | apiserver.crt                | kube-apiserver          | --tls-private-key-file     | --tls-cert-file                                             |
| kube-apiserver-kubelet-client | apiserver-kubelet-client.key | apiserver-kubelet-client.crt | kube-apiserver          | --kubelet-client-key       | --kubelet-client-certificate                                |
| front-proxy-ca                | front-proxy-ca.key           | front-proxy-ca.crt           | kube-apiserver          |                            | --requestheader-client-ca-file                              |
| front-proxy-ca                | front-proxy-ca.key           | front-proxy-ca.crt           | kube-controller-manager |                            | --requestheader-client-ca-file                              |
| front-proxy-client            | front-proxy-client.key       | front-proxy-client.crt       | kube-apiserver          | --proxy-client-key-file    | --proxy-client-cert-file                                    |
| etcd-ca                       | etcd/ca.key                  | etcd/ca.crt                  | etcd                    |                            | --trusted-ca-file,--peer-trusted-ca-file                    |
| kube-etcd                     | etcd/server.key              | etcd/server.crt              | etcd                    | --key-file                 | --cert-file                                                 |
| kube-etcd-peer                | etcd/peer.key                | etcd/peer.crt                | etcd                    | --peer-key-file            | --peer-cert-file                                            |
| etcd-ca                       |                              | etcd/ca.crt                  | etcdctl                 |                            | --cacert                                                    |
| kube-etcd-healthcheck-client  | etcd/healthcheck-client.key  | etcd/healthcheck-client.crt  | etcdctl                 | --key                      | --cert                                                      |

Les mêmes considérations s’appliquent à la paire de clés des comptes de service :

| private key path | public key path | command                 | argument                           |
| ---------------- | --------------- | ----------------------- | ---------------------------------- |
| sa.key           |                 | kube-controller-manager | --service-account-private-key-file |
|                  | sa.pub          | kube-apiserver          | --service-account-key-file         |

L’exemple suivant illustre les chemins des fichiers [issus des tableaux précédents](#certificate-paths)
que vous devez fournir si vous générez vous-même l’ensemble de vos clés et certificats :

```
/etc/kubernetes/pki/etcd/ca.key
/etc/kubernetes/pki/etcd/ca.crt
/etc/kubernetes/pki/apiserver-etcd-client.key
/etc/kubernetes/pki/apiserver-etcd-client.crt
/etc/kubernetes/pki/ca.key
/etc/kubernetes/pki/ca.crt
/etc/kubernetes/pki/apiserver.key
/etc/kubernetes/pki/apiserver.crt
/etc/kubernetes/pki/apiserver-kubelet-client.key
/etc/kubernetes/pki/apiserver-kubelet-client.crt
/etc/kubernetes/pki/front-proxy-ca.key
/etc/kubernetes/pki/front-proxy-ca.crt
/etc/kubernetes/pki/front-proxy-client.key
/etc/kubernetes/pki/front-proxy-client.crt
/etc/kubernetes/pki/etcd/server.key
/etc/kubernetes/pki/etcd/server.crt
/etc/kubernetes/pki/etcd/peer.key
/etc/kubernetes/pki/etcd/peer.crt
/etc/kubernetes/pki/etcd/healthcheck-client.key
/etc/kubernetes/pki/etcd/healthcheck-client.crt
/etc/kubernetes/pki/sa.key
/etc/kubernetes/pki/sa.pub
```

## Configuration des certificats pour les comptes utilisateurs

Vous devez configurer manuellement les comptes administrateurs et les comptes de service :

| Filename                | Credential name            | Default CN                          | O (in Subject)  |
| ----------------------- | -------------------------- | ----------------------------------- | --------------- |
| admin.conf              | default-admin              | kubernetes-admin                    | `<admin-group>` |
| super-admin.conf        | default-super-admin        | kubernetes-super-admin              | system:masters  |
| kubelet.conf            | default-auth               | system:node:`<nodeName>` (see note) | system:nodes    |
| controller-manager.conf | default-controller-manager | system:kube-controller-manager      |                 |
| scheduler.conf          | default-scheduler          | system:kube-scheduler               |                 |

{{< note >}}
La valeur de `<nodeName>` pour `kubelet.conf` **doit** correspondre exactement à la valeur du nom du nœud
fournie par le kubelet lors de son enregistrement auprès de l’API server. Pour plus de détails, consultez
[Node Authorization](/docs/reference/access-authn-authz/node/).
{{< /note >}}

{{< note >}}
Dans l’exemple ci-dessus, `<admin-group>` dépend de l’implémentation. Certains outils signent le
certificat dans le fichier `admin.conf` par défaut afin qu’il fasse partie du groupe `system:masters`.
`system:masters` est un groupe super-utilisateur de type _break-glass_ qui peut contourner la couche
d’autorisation de Kubernetes, comme RBAC. De plus, certains outils ne génèrent pas de fichier
`super-admin.conf` distinct avec un certificat associé à ce groupe super-utilisateur.

kubeadm génère deux certificats administrateur distincts dans des fichiers kubeconfig.
L’un se trouve dans `admin.conf` et possède `Subject: O = kubeadm:cluster-admins, CN = kubernetes-admin`.
`kubeadm:cluster-admins` est un groupe personnalisé associé au ClusterRole `cluster-admin`.
Ce fichier est généré sur toutes les machines du plan de contrôle gérées par kubeadm.

Un autre se trouve dans `super-admin.conf` et possède `Subject: O = system:masters, CN = kubernetes-super-admin`.
Ce fichier est généré uniquement sur le nœud où la commande `kubeadm init` a été exécutée.
{{< /note >}}

1. Pour chaque configuration, générez une paire certificat/clé x509 avec le
   Common Name (CN) et l’Organization (O) indiqués.

1. Exécutez `kubectl` comme suit pour chaque configuration :

   ```
   KUBECONFIG=<filename> kubectl config set-cluster default-cluster --server=https://<host ip>:6443 --certificate-authority <path-to-kubernetes-ca> --embed-certs
   KUBECONFIG=<filename> kubectl config set-credentials <credential-name> --client-key <path-to-key>.pem --client-certificate <path-to-cert>.pem --embed-certs
   KUBECONFIG=<filename> kubectl config set-context default-system --cluster default-cluster --user <credential-name>
   KUBECONFIG=<filename> kubectl config use-context default-system
   ```

   Ces fichiers sont utilisés comme suit :

| Filename                | Command                 | Commentaire                                                           |
| ----------------------- | ----------------------- | --------------------------------------------------------------------- |
| admin.conf              | kubectl                 | Configure l’utilisateur administrateur du cluster                     |
| super-admin.conf        | kubectl                 | Configure l’utilisateur super-administrateur du cluster               |
| kubelet.conf            | kubelet                 | Un fichier requis pour chaque nœud du cluster.                        |
| controller-manager.conf | kube-controller-manager | Doit être ajouté au manifest `manifests/kube-controller-manager.yaml` |
| scheduler.conf          | kube-scheduler          | Doit être ajouté au manifest `manifests/kube-scheduler.yaml`          |

Les fichiers suivants illustrent les chemins complets des fichiers listés dans le tableau précédent :

```
/etc/kubernetes/admin.conf
/etc/kubernetes/super-admin.conf
/etc/kubernetes/kubelet.conf
/etc/kubernetes/controller-manager.conf
/etc/kubernetes/scheduler.conf
```
