---
title: Certificats PKI et exigences
reviewers:
- sig-cluster-lifecycle
content_type: concept
weight: 50
---

<!-- overview -->

Kubernetes requiert les certificats gérés par *PKI* (*Public Key Infrastructure* ou *ICP* pour *Infrastructure à Clé Publique*) 
pour l'authentification via *TLS*.
Si vous installez Kubernetes à l'aide de [kubeadm](/docs/reference/setup-tools/kubeadm/),
les certificats dont votre grappe exige sont automatiquement générés.
Vous pouvez également générer vos propres certificats -- par exemple, mieux sécuriser vos clés privées
en ne les stockant pas tous sur la machine hébergeant le *serveur API*.

Cette page liste les certificats requis par votre grappe.

<!-- body -->

## Comment les certificats au sein de votre grappe sont utilisés ?

Kubernetes requiert une *PKI* pour les opérations suivantes:

### Certificats Serveur

* Certificat Serveur pour le *serveur API*.
* Certificate Serveur pour le serveur *etcd*
* [Certificats Serveur](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/#client-and-serving-certificates)
  pour chaque *kubelet* (chaque {{< glossary_tooltip text="noeud" term_id="node" >}} exécute un *kubelet*)
* Certificat Serveur optionnel pour le [front-proxy](/docs/tasks/extend-kubernetes/configure-aggregation-layer/)

### Certificats Client

* Les certificats Client pour chaque *kubelet*,
  utilisés pour s'authentifier auprès du *serveur API* en tant que client de
  l'*API* de Kubernetes
* Certificat Client pour chaque *serveur API*, utilisé pour s'authentifier en tant que client auprès de *etcd*
* Certificat Client pour le *gestionnaire de contrôleurs* afin de sécuriser la communication avec le *serveur API*
* Certificat Client pour le *planificateur* afin de sécuriser la communication avec le *serveur API*
* Certificat Client, un pour chaque {{< glossary_tooltip text="noeud" term_id="node" >}}, pour *kube-proxy* pour s'authentifier auprès du *serveur API*
* Certificats Client optionnels pour les administrateurs de la grappe afin de s'authentifier auprès du *serveur API*
* Certificat Client optionnel pour le [front-proxy](/docs/tasks/extend-kubernetes/configure-aggregation-layer/)

### Certificats client et serveur pour Kubelet

Pour établir une connexion sécurisée et s'authentifier lui-même auprès de *kubelet*, le *serveur API* 
a besoin d'une paire certificat client/clé privée.

Dans ce scénario, il existe deux approches pour l'utilisation du certificat:

* Certificat et clé privée partagés: *kube-apiserver* peut utiliser le même certificat et la même clé privée que ceux qu'il utilise
  pour permettre l'authentification de ses clients. C'est-à-dire, les fichiers existant, dont `apiserver.crt`
  et `apiserver.key`, peuvent être utilisés pour communiquer avec les serveurs *kubelet*.

* Certficat et clé privée distincts: D'un autre côté, *kube-apiserver* peut utiliser un autre certificat
  et une autre clé privée afin de s'authentifier auprès des serveurs *kubelet*. Dans ce cas précis,
  un nouveau certificat nommé `kubelet-client.crt` et la clé privée lui correspondant,
  `kubelet-client.key` devront alors être créés.

{{< note >}}
La paire certificat/clé privée du `front-proxy` sont requis uniquement si vous exécutez *kube-proxy* pour prendre en charge
[une extension pour le serveur API](/docs/tasks/extend-kubernetes/setup-extension-api-server/).
{{< /note >}}

*etcd* implemente également le *Mutual TLS (mTLS)* pour authentifier ses clients et les *peer*.

## Où sont stockés les certificats ?

Si vous installez Kubernetes à l'aide de *kubeadm*, la plupart des certificats se trouvent dans `/etc/kubernetes/pki`.
Tous les chemins des fichiers dans cette documentation sont relatifs à ce dossier, sauf ceux des certificats du compte utilisateur
dont la base est plutôt `/etc/kubernetes`, et que cette dernière soit l'emplacement par défaut utilisé par *kubeadm* pour stocker ces certificats.

## Configurer manuellement les certificats

Si vous ne souhaitez pas utiliser *kubeadm* pour générer les certificats requis, vous pouvez les créer manuellement.
Voir [Certificats](/docs/tasks/administer-cluster/certificates/)
pour plus de détails sur la création de votre propre certificat racine et les certificats issus de ce dernier. Voir
[Gestion des certificats avec kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/)
pour en savoir plus sur la gestion des certificats.

### Certificat racine principal

Vous pouvez créer un certificat racine principal, controllé par un administrateur. Ce certificat racine principal permet ensuite de créer
de multiples certificats racine intermédiaires, et déléguer toute création supplémentaire à Kubernetes lui-même.

Certificats racines requis:

| Chemin                 | *CN* par défaut           | Description                                                                           |
|------------------------|---------------------------|---------------------------------------------------------------------------------------|
| ca.crt,key             | kubernetes-ca             | Certificat racine et sa clé privée par défaut de Kubernetes                           |
| etcd/ca.crt,key        | etcd-ca                   | Pour tout ce qui est lié à *etcd*                                                     |
| front-proxy-ca.crt,key | kubernetes-front-proxy-ca | Pour le [front-end proxy](/docs/tasks/extend-kubernetes/configure-aggregation-layer/) |

Avant les certificats racines précedent, il est aussi nécessaire d'avoir un couple de clés publiaue/privé pour la gestion du *service account*,
`sa.key` and `sa.pub`.
L'exemple ci-dessous illustre les fichiers vus dans le tableau précédent:

```
/etc/kubernetes/pki/ca.crt
/etc/kubernetes/pki/ca.key
/etc/kubernetes/pki/etcd/ca.crt
/etc/kubernetes/pki/etcd/ca.key
/etc/kubernetes/pki/front-proxy-ca.crt
/etc/kubernetes/pki/front-proxy-ca.key
```

### Tous les certificats

Si vous ne souhaitez pas stocker les clés privées de vos certificats racine au sein de votre grappe,
vous pouvez génrer tous les certificqts en dehors de cette dernière.

Certificats requis:

| *CN* par défaut               | *CN* du certificat racine | O (dans *Subject*) | *Key usage*    | *SAN*                                                      |
|-------------------------------|---------------------------|--------------------|----------------|------------------------------------------------------------|
| kube-etcd                     | etcd-ca                   |                    | server, client | `<nom d'hôte>`, `<IP de l'hôte>`, `localhost`, `127.0.0.1` |
| kube-etcd-peer                | etcd-ca                   |                    | server, client | `<nom d'hôte>`, `<IP de l'hôte>`, `localhost`, `127.0.0.1`        |
| kube-etcd-healthcheck-client  | etcd-ca                   |                    | client         |                                                            |
| kube-apiserver-etcd-client    | etcd-ca                   |                    | client         |                                                            |
| kube-apiserver                | kubernetes-ca             |                    | server         | `<nom d'hôte>`, `<IP de l'hôte>`, `<advertise_IP>`[^1]            |
| kube-apiserver-kubelet-client | kubernetes-ca             | system:masters     | client         |                                                            |
| front-proxy-client            | kubernetes-front-proxy-ca |                    | client         |                                                            |

{{< note >}}
Au lieu d'utiliser le groupe `system:masters` qui possède tous les privilèges pour `kube-apiserver-kubelet-client`,
un autre groupe avec moins de privilèges devrait être uttlisé. Par exemple, *kubeadm* utilise `kubeadm:cluster-admins`
{{< /note >}}

[^1]: tout autre IP ou nom DNS sur lequel joindre votre grappe (comme ceux utilisés par [kubeadm](/docs/reference/setup-tools/kubeadm/), 
l'adresse IP et/ou le nom DNS du répartisseur de charge, `kubernetes`, `kubernetes.default`, `kubernetes.default.svc`,
`kubernetes.default.svc.cluster`, `kubernetes.default.svc.cluster.local`)

où `kind` correspond à une ou plusieurs valeurs de *key usqge* de *x509* (dont *key usage* est une extension du standard *x509*), qui est documenté ici
`.spec.usages` pour le type [CertificateSigningRequest](/docs/reference/kubernetes-api/authentication-resources/certificate-signing-request-v1#CertificateSigningRequest):

| *kind* | *Key usage*                                      |
|--------|--------------------------------------------------|
| server | digital signature, key encipherment, server auth |
| client | digital signature, key encipherment, client auth |

{{< note >}}
*Hosts/SAN* listés ci-dessus sont les premières valeurs recommandées pour avoir une grappe fonctionelle; 
si d'autres éléments sont nécessaire pour
une configuraion spécifique, il est possible d'ajouter des *SANs* dans tous les certificats serveurs.
{{< /note >}}

{{< note >}}
Seulement pour les utilisateurs de kubeadm:

* Le scénario où vous copiez vos certificats du *CA* sans les clés privées vers  votre grappe est
  reférrée en tant que *CA* externe dans la documentation de *kubeadm*.
* Si vous comparez la liste des certificats ci-dessus avec une autre contenant les certificats *PKI* générés par *kubeadm*, 
  veuillez considérez que les certificats
  `kube-etcd`, `kube-etcd-peer` et `kube-etcd-healthcheck-client` ne sont pas générés
  dans le cas d'un *etcd* externe.

{{< /note >}}

### Les emplacements des Certificats

Les certificats devraient être placés dans un emplacement recommandé (tel qu'utilisé par [kubeadm](/docs/reference/setup-tools/kubeadm/)).
Les chemins doivent être spécifiés en utilisant l'argument donné, quel que soit l'emplacement.

| *CN* par défaut               | Chemin recommandé de la clé privée | Chemin recommandé pour le certificat | Commande | Argument pour la clé privée | Argument pour le certificat |
|-------------------------------|  | ------------------- | ------- | ----------- | ------------ |
| etcd-ca                       | etcd/ca.key | etcd/ca.crt | kube-apiserver | | --etcd-cafile |
| kube-apiserver-etcd-client    | apiserver-etcd-client.key | apiserver-etcd-client.crt | kube-apiserver | --etcd-keyfile | --etcd-certfile |
| kubernetes-ca                 | ca.key | ca.crt | kube-apiserver | | --client-ca-file |
| kubernetes-ca                 | ca.key | ca.crt | kube-controller-manager | --cluster-signing-key-file | --client-ca-file,--root-ca-file,--cluster-signing-cert-file |
| kube-apiserver                | apiserver.key | apiserver.crt| kube-apiserver | --tls-private-key-file | --tls-cert-file |
| kube-apiserver-kubelet-client | apiserver-kubelet-client.key | apiserver-kubelet-client.crt | kube-apiserver | --kubelet-client-key | --kubelet-client-certificate |
| front-proxy-ca                | front-proxy-ca.key | front-proxy-ca.crt | kube-apiserver | | --requestheader-client-ca-file |
| front-proxy-ca                | front-proxy-ca.key | front-proxy-ca.crt | kube-controller-manager | | --requestheader-client-ca-file |
| front-proxy-client            | front-proxy-client.key | front-proxy-client.crt | kube-apiserver | --proxy-client-key-file | --proxy-client-cert-file |
| etcd-ca                       | etcd/ca.key | etcd/ca.crt | etcd | | --trusted-ca-file,--peer-trusted-ca-file |
| kube-etcd                     | etcd/server.key | etcd/server.crt | etcd | --key-file | --cert-file |
| kube-etcd-peer                | etcd/peer.key | etcd/peer.crt | etcd | --peer-key-file | --peer-cert-file |
| etcd-ca                       | | etcd/ca.crt | etcdctl | | --cacert |
| kube-etcd-healthcheck-client  | etcd/healthcheck-client.key | etcd/healthcheck-client.crt | etcdctl | --key | --cert |

Les mêmes recommandations s'appliquent pour la paire de clés du *service account*:

| Chemin de la clé privée | Chemin de la clé publique | Commande                | Argument                           |
|-------------------------|---------------------------|-------------------------|------------------------------------|
| sa.key                  |                           | kube-controller-manager | --service-account-private-key-file |
|                         | sa.pub                    | kube-apiserver          | --service-account-key-file         |

L'example suivant illustrate les chemins des fichiers [du précédent tableau](#certificate-paths)
dont vous devez mettre en place si vous générez vous-même tous vos clés privées et vos certificats:

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

## Configurer les certificats pour les comptes utilisateur

Vous devez manuellement configurer ces comptes administrateurs et les comptes de services:

| Fichier                 | Identifiant                | *CN* par défaut                                 | O (dans *Subject*) |
|-------------------------|----------------------------|-------------------------------------------------|--------------------|
| admin.conf              | default-admin              | kubernetes-admin                                | `<admin-group>`    |
| super-admin.conf        | default-super-admin        | kubernetes-super-admin                          | system:masters     |
| kubelet.conf            | default-auth               | system:node:`<nom du noeud>` (voir la remarque) | system:nodes       |
| controller-manager.conf | default-controller-manager | system:kube-controller-manager                  |                    |
| scheduler.conf          | default-scheduler          | system:kube-scheduler                           |                    |

{{< note >}}
L'élément `<nom du noeud>` pour `kubelet.conf` **doit** précisement correspondre au même nom du noeud
fourni par le kubelet lors de son enregistrement auprès de l'apiserver. Pour plus de détails, veuillez lire
[Node Authorization](/docs/reference/access-authn-authz/node/).
{{< /note >}}

{{< note >}}
Sur l'exemple ci-dessus `<admin-group>` est une implémentation spécifique. Certains outils
ajoute `system:masters` dans le certificat inclus dans le fichier  `admin.conf`. 
`system:masters` est un passe-partout, ce super groupe peut contourner la couche d'authorisation
de Kubernetes, telle que *RBAC*. Mais aussi, certains outils ne génére pas un fichier séparé
`super-admin.conf` avec un certificat lié à ce super groupe.

*kubeadm* génère deux certificats d'administrateur distincts dans les fichiers *kubeconfig*: 
- Le premier se trouve dans `admin.conf` et contient `Subject: O = kubeadm:cluster-admins, CN = kubernetes-admin`.  
`kubeadm:cluster-admins` est un groupe personnalié lié au *ClusterRole* `cluster-admin`. 
Ce fichier est généré sur toutes les machines du centre de contrôle gérées avec *kubeadm*.

- L'autre se trouve dans `super-admin.conf` et contient `Subject: O = system:masters, CN = kubernetes-super-admin`.
Ce fichier est généré uniquement sur le noeud où `kubeadm init` a été utilisé.
{{< /note >}}

1. Pour chaque configuration, générez une paire certificat/clé privée *x509* avec le
    *Common Name (CN)* et le *Organization (O)* fournis.

1. Exécutez `kubectl` comme suit pour chaque configuration:

   ```
   KUBECONFIG=<filename> kubectl config set-cluster default-cluster --server=https://<host ip>:6443 --certificate-authority <path-to-kubernetes-ca> --embed-certs
   KUBECONFIG=<filename> kubectl config set-credentials <credential-name> --client-key <path-to-key>.pem --client-certificate <path-to-cert>.pem --embed-certs
   KUBECONFIG=<filename> kubectl config set-context default-system --cluster default-cluster --user <credential-name>
   KUBECONFIG=<filename> kubectl config use-context default-system
   ```

Ces fichiers sont utilisés comme suit:

| Nom de fichier          | Commande                | Commentaire                                                                    |
|-------------------------|-------------------------|--------------------------------------------------------------------------------|
| admin.conf              | kubectl                 | Configure l'administrateur du *cluster*                                        |
| super-admin.conf        | kubectl                 | Configure le super administrateur du *cluster*                                 |
| kubelet.conf            | kubelet                 | Un seul requis pour chaque noeud du *cluster*.                                 |
| controller-manager.conf | kube-controller-manager | Doit être ajouté au fichier manifeste `manifests/kube-controller-manager.yaml` |
| scheduler.conf          | kube-scheduler          | Doit être ajouté au fichier manifeste `manifests/kube-scheduler.yaml`          |

Les fichiers suivant illustrent les chemins absolues des fichiers listés dans le tableau précédent:

```
/etc/kubernetes/admin.conf
/etc/kubernetes/super-admin.conf
/etc/kubernetes/kubelet.conf
/etc/kubernetes/controller-manager.conf
/etc/kubernetes/scheduler.conf
```
