---
title: Certificats
content_type: concept
description: Certifications cluster Kubernetes
weight: 20
---

<!-- overview -->

Lorsque vous utilisez l'authentification par certificats client, vous pouvez générer des certificats
manuellement grâce à `easyrsa`, `openssl` ou `cfssl`.




<!-- body -->

### easyrsa

**easyrsa** peut générer manuellement des certificats pour votre cluster.

1.  Téléchargez, décompressez et initialisez la version corrigée de easyrsa3.

        curl -LO https://dl.k8s.io/easy-rsa/easy-rsa.tar.gz
        tar xzf easy-rsa.tar.gz
        cd easy-rsa-master/easyrsa3
        ./easyrsa init-pki
1.  Générez une CA. (`--batch` pour le mode automatique. `--req-cn` CN par défaut à utiliser)

        ./easyrsa --batch "--req-cn=${MASTER_IP}@`date +%s`" build-ca nopass
1.  Générer un certificat de serveur et une clé.
    L' argument `--subject-alt-name` définit les adresses IP et noms DNS possibles par lesquels l'API
    serveur peut être atteind. La `MASTER_CLUSTER_IP` est généralement la première adresse IP du CIDR des services
    qui est spécifié en tant qu'argument `--service-cluster-ip-range` pour l'API Server et
    le composant controller manager. L'argument `--days` est utilisé pour définir le nombre de jours
    après lesquels le certificat expire.
    L’exemple ci-dessous suppose également que vous utilisez `cluster.local` par défaut comme
    nom de domaine DNS.

        ./easyrsa --subject-alt-name="IP:${MASTER_IP},"\
        "IP:${MASTER_CLUSTER_IP},"\
        "DNS:kubernetes,"\
        "DNS:kubernetes.default,"\
        "DNS:kubernetes.default.svc,"\
        "DNS:kubernetes.default.svc.cluster,"\
        "DNS:kubernetes.default.svc.cluster.local" \
        --days=10000 \
        build-server-full server nopass
1.  Copiez `pki/ca.crt`, `pki/issued/server.crt`, et `pki/private/server.key` dans votre répertoire.
1.  Personnalisez et ajoutez les lignes suivantes aux paramètres de démarrage de l'API Server:

        --client-ca-file=/yourdirectory/ca.crt
        --tls-cert-file=/yourdirectory/server.crt
        --tls-private-key-file=/yourdirectory/server.key

### openssl

**openssl** peut générer manuellement des certificats pour votre cluster.

1.  Générez ca.key en 2048bit:

        openssl genrsa -out ca.key 2048
1.  A partir de la clé ca.key générez ca.crt (utilisez -days pour définir la durée du certificat):

        openssl req -x509 -new -nodes -key ca.key -subj "/CN=${MASTER_IP}" -days 10000 -out ca.crt
1.  Générez server.key en 2048bit:

        openssl genrsa -out server.key 2048
1.  Créez un fichier de configuration pour générer une demande de signature de certificat (CSR).
    Assurez-vous de remplacer les valeurs marquées par des "< >" (par exemple, `<MASTER_IP>`)
    avec des valeurs réelles avant de l'enregistrer dans un fichier (par exemple, `csr.conf`).
    Notez que la valeur de `MASTER_CLUSTER_IP` est celle du service Cluster IP pour l'
    API Server comme décrit dans la sous-section précédente.
    L’exemple ci-dessous suppose également que vous utilisez `cluster.local` par défaut comme
    nom de domaine DNS.

        [ req ]
        default_bits = 2048
        prompt = no
        default_md = sha256
        req_extensions = req_ext
        distinguished_name = dn

        [ dn ]
        C = <country>
        ST = <state>
        L = <city>
        O = <organization>
        OU = <organization unit>
        CN = <MASTER_IP>

        [ req_ext ]
        subjectAltName = @alt_names

        [ alt_names ]
        DNS.1 = kubernetes
        DNS.2 = kubernetes.default
        DNS.3 = kubernetes.default.svc
        DNS.4 = kubernetes.default.svc.cluster
        DNS.5 = kubernetes.default.svc.cluster.local
        IP.1 = <MASTER_IP>
        IP.2 = <MASTER_CLUSTER_IP>

        [ v3_ext ]
        authorityKeyIdentifier=keyid,issuer:always
        basicConstraints=CA:FALSE
        keyUsage=keyEncipherment,dataEncipherment
        extendedKeyUsage=serverAuth,clientAuth
        subjectAltName=@alt_names
1.  Générez la demande de signature de certificat basée sur le fichier de configuration:

        openssl req -new -key server.key -out server.csr -config csr.conf
1.  Générez le certificat de serveur en utilisant ca.key, ca.crt et server.csr:

        openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key \
        -CAcreateserial -out server.crt -days 10000 \
        -extensions v3_ext -extfile csr.conf -sha256
1.  Vérifiez le certificat:

        openssl x509  -noout -text -in ./server.crt

Enfin, ajoutez les mêmes paramètres aux paramètres de démarrage de l'API Server.

### cfssl

**cfssl** est un autre outil pour la génération de certificat.

1.  Téléchargez, décompressez et préparez les outils de ligne de commande comme indiqué ci-dessous.
    Notez que vous devrez peut-être adapter les exemples de commandes en fonction du matériel,
    de l'architecture et de la version de cfssl que vous utilisez.

        curl -L https://pkg.cfssl.org/R1.2/cfssl_linux-amd64 -o cfssl
        chmod +x cfssl
        curl -L https://pkg.cfssl.org/R1.2/cfssljson_linux-amd64 -o cfssljson
        chmod +x cfssljson
        curl -L https://pkg.cfssl.org/R1.2/cfssl-certinfo_linux-amd64 -o cfssl-certinfo
        chmod +x cfssl-certinfo
1.  Créez un répertoire pour contenir les artefacts et initialiser cfssl:

        mkdir cert
        cd cert
        ../cfssl print-defaults config > config.json
        ../cfssl print-defaults csr > csr.json
1.  Créez un fichier JSON pour générer le fichier d'autorité de certification, par exemple, `ca-config.json`:

        {
          "signing": {
            "default": {
              "expiry": "8760h"
            },
            "profiles": {
              "kubernetes": {
                "usages": [
                  "signing",
                  "key encipherment",
                  "server auth",
                  "client auth"
                ],
                "expiry": "8760h"
              }
            }
          }
        }
1.  Créez un fichier JSON pour la demande de signature de certificat de l'autorité de certification, par exemple,
    `ca-csr.json`. Assurez-vous de remplacer les valeurs marquées par des "< >" par
    les vraies valeurs que vous voulez utiliser.

        {
          "CN": "kubernetes",
          "key": {
            "algo": "rsa",
            "size": 2048
          },
          "names":[{
            "C": "<country>",
            "ST": "<state>",
            "L": "<city>",
            "O": "<organization>",
            "OU": "<organization unit>"
          }]
        }
1.  Générez la clé de CA (`ca-key.pem`) et le certificat (`ca.pem`):

        ../cfssl gencert -initca ca-csr.json | ../cfssljson -bare ca
1.  Créer un fichier JSON pour générer des clés et des certificats pour l'API Server,
    par exemple, `server-csr.json`. Assurez-vous de remplacer les valeurs entre "< >" par
    les vraies valeurs que vous voulez utiliser. `MASTER_CLUSTER_IP` est le service Cluster IP
    de l'API Server, comme décrit dans la sous-section précédente.
    L’exemple ci-dessous suppose également que vous utilisez `cluster.local` par défaut comme
    nom de domaine DNS.

        {
          "CN": "kubernetes",
          "hosts": [
            "127.0.0.1",
            "<MASTER_IP>",
            "<MASTER_CLUSTER_IP>",
            "kubernetes",
            "kubernetes.default",
            "kubernetes.default.svc",
            "kubernetes.default.svc.cluster",
            "kubernetes.default.svc.cluster.local"
          ],
          "key": {
            "algo": "rsa",
            "size": 2048
          },
          "names": [{
            "C": "<country>",
            "ST": "<state>",
            "L": "<city>",
            "O": "<organization>",
            "OU": "<organization unit>"
          }]
        }
1.  Générez la clé et le certificat pour l'API Server, qui sont par défaut
    sauvegardés respectivement dans les fichiers `server-key.pem` et` server.pem`:

        ../cfssl gencert -ca=ca.pem -ca-key=ca-key.pem \
        --config=ca-config.json -profile=kubernetes \
        server-csr.json | ../cfssljson -bare server


## Distribuer un certificat auto-signé

Un client peut refuser de reconnaître un certificat auto-signé comme valide.
Pour un déploiement hors production ou pour un déploiement exécuté derrière un
pare-feu d'entreprise, vous pouvez distribuer un certificat auto-signé à tous les clients et
actualiser la liste locale pour les certificats valides.

Sur chaque client, effectuez les opérations suivantes:

```bash
$ sudo cp ca.crt /usr/local/share/ca-certificates/kubernetes.crt
$ sudo update-ca-certificates
Updating certificates in /etc/ssl/certs...
1 added, 0 removed; done.
Running hooks in /etc/ca-certificates/update.d....
done.
```

## API pour les certificats

Vous pouvez utiliser l’API `certificates.k8s.io` pour faire créer des
Certificats x509 à utiliser pour l'authentification, comme documenté
[ici](/docs/tasks/tls/managing-tls-in-a-cluster).


