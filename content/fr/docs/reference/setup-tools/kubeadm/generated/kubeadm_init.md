
Utilisez cette commande afin de configurer le control plane Kubernetes

### Synopsis

Utilisez cette commande afin de configurer le control plane Kubernetes

La commande "init" exécute les phases suivantes : 
```
preflight                  Exécute les vérifications en amont
kubelet-start              Sauvegarde les réglages kubelet et (re)démarre kubelet
certs                      Génération de certificats
  /etcd-ca                   Génère le certificat CA auto signé pour fournir les identités à etcd
  /apiserver-etcd-client     Génère le certificat que l'apiserver utilisera pour communiquer avec etcd
  /etcd-healthcheck-client   Génère le certificat pour les sondes de vivacité (liveness) qui contrôlent etcd
  /etcd-server               Génère le certificat pour l'accès à etcd
  /etcd-peer                 Génère le certificat pour que les noeuds etcd puissent communiquer ensemble
  /ca                        Génère le certificat CA auto signé  de Kubernetes pour fournir les identités aux autres composants Kubernetes
  /apiserver                 Génère le certificat pour l'accès à l'API Kubernetes
  /apiserver-kubelet-client  Génère le certificat pour permettre à l'API server de se connecter à kubelet
  /front-proxy-ca            Génère le certificat CA auto signé pour fournir les identités au proxy frontal (front proxy)
  /front-proxy-client        Génère le certificat pour le client du proxy frontal
  /sa                        Génère une clef privée pour signer les jetons ainsi que la clef publique du compte service
kubeconfig                 Génère tous les fichiers kubeconfig nécessaires pour la création du control plane et du fichier kubeconfig admin
  /admin                     Génère un fichier kubeconfig pour utilisation par l'administrateur et kubeadm
  /kubelet                   Génère un fichier kubeconfig pour utilisation par kubelet seulement à des fins d'installation initiale
  /controller-manager        Génère un fichier fichier kubeconfig for the controller manager to use
  /scheduler                 Génère un fichier kubeconfig pour utilisation par le scheduler
control-plane              Génère tous les manifests de Pod statiques nécessaires à la création du control plane
  /apiserver                 Génère le manifest de Pod statique de l'apiserver
  /controller-manager        Génère le manifest de Pod statique du kube-controller-manager
  /scheduler                 Génère le manifest de Pod statique du kube-schedule
etcd                       Génère le manifest de Pod statique pour l'etcd local
  /local                     Génère le manifest de Pod statique pour une instance etcd locale, à un seul noeud
upload-config              Téléverse les configurations kubeadm et kubelet vers une ConfigMap
  /kubeadm                   Téléverse la ClusterConfiguration de kubeadm vers une ConfigMap
  /kubelet                   Téléverse la configuration kubelet vers une ConfigMap
upload-certs               Téléverse les certificats vers kubeadm-certs
mark-control-plane         Marque un noeud en tant que control-plane
bootstrap-token            Génère les jetons d'installation utilisés pour faire joindre un noeud à un cluster
addon                      Installe les extensions requises pour l'exécution des tests de Conformance
  /coredns                   Installe l'extension CoreDNS à un cluster Kubernetes
  /kube-proxy                Installe l'extension kube-proxy à un cluster Kubernetes
```


```
kubeadm init [flags]
```

### Options

```
      --apiserver-advertise-address string   L'adresse IP que l'API Server utilisera pour s'annoncer. Si non spécifiée, l'interface réseau par défaut sera utilisée.
      --apiserver-bind-port int32            Port d'écoute de l'API Server.  (par default 6443)
      --apiserver-cert-extra-sans strings    Noms alternatifs (Subject Alternative Names  ou encore SANs) optionnels, utilisés dans les certificats servis par l'API Server. Peuvent êtres des adresses IPs ou des noms DNS.
      --cert-dir string                      Le répertoire où sauvegarder les certificats. (par défaut "/etc/kubernetes/pki")
      --certificate-key string               Clef utilisée pour chiffrer les certificats control-plane dans le Secret the kubeadm-certs.
      --config string                        Chemin vers un fichier de configuration kubeadm.
      --cri-socket string                    Chemin vers la socket CRI à laquelle la connexion doit s'effectuer. S'il n'est pas spécifié, kubeadm essaiera de le détecter; utiliser cette option seulement si vous avez plus d'un CRI installé ou si vous utilisez des sockets CRI non standard.
      --dry-run                              N'effectue aucun changement; affiche seulement la sortie standard de ce qui serait effectué.
      --feature-gates string                 Un ensemble de paires clef=valeur qui décrivent l'entrée de configuration pour des fonctionnalités diverses. Il n'y en a aucune dans cette version.
  -h, --help                                 aide pour l'initialisation (init)
      --ignore-preflight-errors strings      Une liste de contrôles dont les erreurs seront catégorisées comme "warnings" (avertissements). Par exemple : 'IsPrivilegedUser,Swap'. La valeur 'all' ignore les erreurs de tous les contrôles.
      --image-repository string              Choisis un container registry d'où télécharger les images du control plane. (par défaut "k8s.gcr.io")
      --kubernetes-version string            Choisis une version Kubernetes spécifique pour le control plane. (par défaut "stable-1")
      --node-name string                     Spécifie le nom du noeud.
      --pod-network-cidr string              Spécifie l'intervalle des adresses IP pour le réseau des pods. Si fournie, le control plane allouera automatiquement les CIDRs pour chacun des noeuds.
      --service-cidr string                  Utilise un intervalle différent pour les adresses IP des services prioritaires (VIPs). (par défaut "10.96.0.0/12")
      --service-dns-domain string            Utilise un domaine alternatif pour les services, par exemple : "myorg.internal". (par défaut "cluster.local")
      --skip-certificate-key-print           N'affiche pas la clef utilisée pour chiffrer les certificats du control-plane.
      --skip-phases strings                  List des des phases à sauter
      --skip-token-print                     N'affiche pas le jeton par défaut de l'installation qui a été généré lors de 'kubeadm init'.
      --token string                         Le jeton à utiliser pour établir la confiance mutuelle  entre les noeuds et les noeuds du control-plane. Le format correspond à la regexp : [a-z0-9]{6}\.[a-z0-9]{16} - par exemple : abcdef.0123456789abcdef
      --token-ttl duration                   La durée au bout de laquelle le jeton sera automatiquement détruit (par exemple :  1s, 2m, 3h). Si réglée à '0', le jeton n'expirera jamais (par défaut 24h0m0s)
      --upload-certs                         Téléverse les certificats du control-plane vers le Secret kubeadm-certs.
```

### Options héritées depuis la commande parent

```
      --rootfs string   [EXPERIMENTALE] Le chemin vers la "vraie" racine du système de fichiers de l'hôte.
```

