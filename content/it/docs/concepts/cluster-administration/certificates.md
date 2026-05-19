---
draft: True
title: Certificati
content_type: concept
weight: 20
---


<!-- overview -->

Quando si utilizza l'autenticazione del certificato client, è possibile generare certificati
manualmente tramite `easyrsa`, `openssl` o `cfssl`.




<!-- body -->

### easyrsa

** easyrsa ** può generare manualmente certificati per il tuo cluster.

1. Scaricare, decomprimere e inizializzare la versione patched di easyrsa3.

        curl -LO  https://dl.k8s.io/easy-rsa/easy-rsa.tar.gz
        tar xzf easy-rsa.tar.gz
        cd easy-rsa-master / easyrsa3
        ./easyrsa init-pki
1. Generare una CA. (`--batch` imposta la modalità automatica. `--req-cn` default CN da usare.)

        ./easyrsa --batch "--req-cn = $ {MASTER_IP} @` date +% s` "build-ca nopass
1. Genera certificato e chiave del server.
    L'argomento `--subject-alt-name` imposta i possibili IP e nomi DNS del server API
    accessibile con. Il `MASTER_CLUSTER_IP` è solitamente il primo IP dal servizio CIDR
    che è specificato come argomento `--service-cluster-ip-range` per il server API e
    il componente del controller controller. L'argomento `--days` è usato per impostare il numero di giorni
    dopodiché scade il certificato.
    L'esempio sotto riportato assume anche che tu stia usando `cluster.local` come predefinito
    Nome di dominio DNS

        ./easyrsa --subject-alt-name = "IP: $ {MASTER_IP}," \
        "IP: $ {} MASTER_CLUSTER_IP," \
        "DNS: kubernetes," \
        "DNS: kubernetes.default," \
        "DNS: kubernetes.default.svc," \
        "DNS: kubernetes.default.svc.cluster," \
        "DNS: kubernetes.default.svc.cluster.local" \
        --days = 10000 \
        build-server-full server nopass
1. Copia `pki / ca.crt`, `pki / issued / server.crt` e `pki / private / server.key` nella tua directory.
1. Compilare e aggiungere i seguenti parametri nei parametri di avvio del server API:

        --client-ca-file =/YourDirectory/ca.crt
        --tls-cert-file =/YourDirectory/server.crt
        --tls-chiave file privato=/YourDirectory/server.key

### openssl

** openssl ** può generare manualmente certificati per il tuo cluster.

1. Genera un tasto approssimativo con 2048 bit:

         openssl genrsa -out ca.key 2048
1. In base al tasto approssimativo, generare ca.crt (utilizzare -giorni per impostare il tempo effettivo del certificato):

         openssl req -x509 -new -nodes -key ca.key -subj "/ CN = $ {MASTER_IP}" -days 10000 -out ca.crt
1. Genera un server.key con 2048 bit:

         openssl genrsa -out server.key 2048
1. Creare un file di configurazione per generare una richiesta di firma del certificato (CSR).
     Assicurati di sostituire i valori contrassegnati da parentesi angolari (ad esempio `<MASTER_IP>`)
     con valori reali prima di salvarlo in un file (ad esempio `csr.conf`).
     Si noti che il valore di `MASTER_CLUSTER_IP` è l'IP del cluster di servizio per il
     Server API come descritto nella sottosezione precedente.
     L'esempio sotto riportato assume anche che tu stia usando `cluster.local` come predefinito
     Nome di dominio DNS

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
1.  Generate the certificate signing request based on the config file:

        openssl req -new -key server.key -out server.csr -config csr.conf
1. Generare il certificato del server usando ca.key, ca.crt e server.csr:

        openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key \
        -CAcreateserial -out server.crt -days 10000 \
        -extensions v3_ext -extfile csr.conf -sha256
1. Visualizza il certificato:

        openssl x509  -noout -text -in ./server.crt

Infine, aggiungi gli stessi parametri nei parametri di avvio del server API.

### cfssl

** cfssl ** è un altro strumento per la generazione di certificati.

1. Scaricare, decomprimere e preparare gli strumenti da riga di comando come mostrato di seguito.
     Si noti che potrebbe essere necessario adattare i comandi di esempio in base all'hardware
     architettura e versione di cfssl che stai utilizzando.

        curl -L https://pkg.cfssl.org/R1.2/cfssl_linux-amd64 -o cfssl
        chmod +x cfssl
        curl -L https://pkg.cfssl.org/R1.2/cfssljson_linux-amd64 -o cfssljson
        chmod +x cfssljson
        curl -L https://pkg.cfssl.org/R1.2/cfssl-certinfo_linux-amd64 -o cfssl-certinfo
        chmod +x cfssl-certinfo
1.  Create a directory to hold the artifacts and initialize cfssl:

        mkdir cert
        cd cert
        ../cfssl print-defaults config > config.json
        ../cfssl print-defaults csr > csr.json
1. Creare un file di configurazione JSON per generare il file CA, ad esempio, `ca-config.json`:

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
1. Creare un file di configurazione JSON per la richiesta di firma del certificato CA (CSR), ad esempio,
     `Ca-csr.json`. Assicurarsi di sostituire i valori contrassegnati da parentesi angolari con
     valori reali che si desidera utilizzare.

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
1.  Generate CA key (`ca-key.pem`) and certificate (`ca.pem`):

        ../cfssl gencert -initca ca-csr.json | ../cfssljson -bare ca
1. Creare un file di configurazione JSON per generare chiavi e certificati per l'API
     server, ad esempio, `server-csr.json`. Assicurati di sostituire i valori tra parentesi angolari con
     valori reali che si desidera utilizzare. `MASTER_CLUSTER_IP` è il cluster di servizio
     IP per il server API come descritto nella sottosezione precedente.
     L'esempio sotto riportato assume anche che tu stia usando `cluster.local` come predefinito
     Nome di dominio DNS

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
1. Generare la chiave e il certificato per il server API, che sono per impostazione predefinita
     salvati nel file `server-key.pem` e` server.pem` rispettivamente:

        ../cfssl gencert -ca=ca.pem -ca-key=ca-key.pem \
        --config=ca-config.json -profile=kubernetes \
        server-csr.json | ../cfssljson -bare server


## Distributing Self-Signed CA Certificate

Un nodo client può rifiutarsi di riconoscere un certificato CA autofirmato come valido.
Per una distribuzione non di produzione o per una distribuzione che viene eseguita dietro una società
firewall, è possibile distribuire un certificato CA autofirmato a tutti i client e
aggiornare l'elenco locale per i certificati validi.

Su ciascun client, eseguire le seguenti operazioni:

```bash
$ sudo cp ca.crt /usr/local/share/ca-certificates/kubernetes.crt
$ sudo update-ca-certificates
Updating certificates in /etc/ssl/certs...
1 added, 0 removed; done.
Running hooks in /etc/ca-certificates/update.d....
done.
```

## Certificates API

È possibile utilizzare l'API `certificates.k8s.io` per eseguire il provisioning
certificati x509 da utilizzare per l'autenticazione come documentato
[here](/docs/tasks/tls/managing-tls-in-a-cluster).


