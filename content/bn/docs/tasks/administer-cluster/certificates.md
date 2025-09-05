---
title: সার্টিফিকেট ম্যানুয়ালি তৈরি করুন
content_type: task
weight: 30
---

<!-- overview -->

ক্লায়েন্ট সার্টিফিকেট অথেনটিকেশন ব্যবহার করার সময়, আপনি [`easyrsa`](https://github.com/OpenVPN/easy-rsa),
[`openssl`](https://github.com/openssl/openssl) বা [`cfssl`](https://github.com/cloudflare/cfssl) এর মাধ্যমে ম্যানুয়ালি সার্টিফিকেট তৈরি করতে পারেন।

<!-- body -->

### easyrsa

**easyrsa** আপনার ক্লাস্টারের জন্য ম্যানুয়ালি সার্টিফিকেট তৈরি করতে পারে।

1. প্যাচ করা ভার্সন `easyrsa3` ডাউনলোড, আনপ্যাক এবং ইনিশিয়ালাইজ করুন।

   ```shell
   curl -LO https://dl.k8s.io/easy-rsa/easy-rsa.tar.gz
   tar xzf easy-rsa.tar.gz
   cd easy-rsa-master/easyrsa3
   ./easyrsa init-pki
   ```
1. একটি নতুন সার্টিফিকেট অথরিটি (CA) তৈরি করুন। `--batch` স্বয়ংক্রিয় মোড সেট করে; 
   `--req-cn` CA এর নতুন রুট সার্টিফিকেটের জন্য কমন নেম (CN) নির্দিষ্ট করে।

   ```shell
   ./easyrsa --batch "--req-cn=${MASTER_IP}@`date +%s`" build-ca nopass
   ```

1. সার্ভার সার্টিফিকেট এবং key তৈরি করুন।

   আর্গুমেন্ট `--subject-alt-name` সম্ভাব্য IP এবং DNS নাম সেট করে যা দিয়ে API সার্ভার
   অ্যাক্সেস করা হবে। `MASTER_CLUSTER_IP` সাধারণত প্রথম IP যা সার্ভিস CIDR
   থেকে নির্দিষ্ট করা হয় `--service-cluster-ip-range` আর্গুমেন্ট API সার্ভার এবং
   কন্ট্রোলার ম্যানেজার কম্পোনেন্টের জন্য। আর্গুমেন্ট `--days` ব্যবহার করা হয় কত দিন পরে
   সার্টিফিকেটের মেয়াদ শেষ হবে তা সেট করতে।
   নীচের উদাহরণটি এটি নিশ্চিত করে যে আপনি ডিফল্ট DNS ডোমেইন নাম হিসাবে
   `cluster.local` ব্যবহার করছেন।

   ```shell
   ./easyrsa --subject-alt-name="IP:${MASTER_IP},"\
   "IP:${MASTER_CLUSTER_IP},"\
   "DNS:kubernetes,"\
   "DNS:kubernetes.default,"\
   "DNS:kubernetes.default.svc,"\
   "DNS:kubernetes.default.svc.cluster,"\
   "DNS:kubernetes.default.svc.cluster.local" \
   --days=10000 \
   build-server-full server nopass
   ```

1. `pki/ca.crt`, `pki/issued/server.crt`, এবং `pki/private/server.key` আপনার ডিরেক্টরিতে কপি করুন।

1. API সার্ভার শুরু করার প্যারামিটারগুলিতে নিম্নলিখিত প্যারামিটারগুলি পূরণ করুন এবং যোগ করুন:

   ```shell
   --client-ca-file=/yourdirectory/ca.crt
   --tls-cert-file=/yourdirectory/server.crt
   --tls-private-key-file=/yourdirectory/server.key
   ```

### openssl

**openssl** আপনার ক্লাস্টারের জন্য ম্যানুয়ালি সার্টিফিকেট তৈরি করতে পারে।

1. 2048bit সহ একটি ca.key তৈরি করুন:

   ```shell
   openssl genrsa -out ca.key 2048
   ```

1. ca.key অনুযায়ী একটি ca.crt তৈরি করুন (সার্টিফিকেট কার্যকরী সময় সেট করতে `-days` ব্যবহার করুন):

   ```shell
   openssl req -x509 -new -nodes -key ca.key -subj "/CN=${MASTER_IP}" -days 10000 -out ca.crt
   ```

1. 2048bit সহ একটি server.key তৈরি করুন:

   ```shell
   openssl genrsa -out server.key 2048
   ```

1. একটি কনফিগারেশন ফাইল তৈরি করুন সার্টিফিকেট সাইনিং রিকোয়েস্ট (CSR) তৈরি করার জন্য।

   অবশ্যই অ্যাঙ্গেল ব্রাকেটস দ্বারা চিহ্নিত মানগুলি (যেমন `<MASTER_IP>`)
   বাস্তব মানগুলির সাথে প্রতিস্থাপন করুন একটি ফাইলে সংরক্ষণ করার আগে (যেমন `csr.conf`)।
   মনে রাখবেন যে `MASTER_CLUSTER_IP` এর মান হল API সার্ভারের জন্য সার্ভিস ক্লাস্টার IP
   যা পূর্ববর্তী সাবসেকশণে বর্ণিত।
   নীচের উদাহরণটি এটি নিশ্চিত করে যে আপনি ডিফল্ট DNS ডোমেইন নাম হিসাবে
   `cluster.local` ব্যবহার করছেন।

   ```ini
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
   ```

1. কনফিগারেশন ফাইলের ভিত্তিতে সার্টিফিকেট সাইনিং রিকোয়েস্ট তৈরি করুন:

   ```shell
   openssl req -new -key server.key -out server.csr -config csr.conf
   ```

1. ca.key, ca.crt এবং server.csr ব্যবহার করে সার্ভার সার্টিফিকেট তৈরি করুন:

   ```shell
   openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key \
       -CAcreateserial -out server.crt -days 10000 \
       -extensions v3_ext -extfile csr.conf -sha256
   ```

1. সার্টিফিকেট সাইনিং রিকোয়েস্ট দেখুন:

   ```shell
   openssl req  -noout -text -in ./server.csr
   ```

1. সার্টিফিকেট দেখুন:

   ```shell
   openssl x509  -noout -text -in ./server.crt
   ```

অবশেষে, API সার্ভার শুরু করার প্যারামিটারগুলিতে একই প্যারামিটারগুলি যোগ করুন।

### cfssl

**cfssl** সার্টিফিকেট উত্পাদনের জন্য আরেকটি টুল।

1. নীচের মতো কমান্ড লাইন টুলগুলি ডাউনলোড, আনপ্যাক এবং প্রস্তুত করুন।

   মনে রাখবেন যে আপনার হার্ডওয়্যার আর্কিটেকচার এবং আপনি যে cfssl ভার্সনটি ব্যবহার
   করছেন তার উপর ভিত্তি করে নমুনা কমান্ডগুলি এডাপ্ট করতে হতে পারে।

   ```shell
   curl -L https://github.com/cloudflare/cfssl/releases/download/v1.5.0/cfssl_1.5.0_linux_amd64 -o cfssl
   chmod +x cfssl
   curl -L https://github.com/cloudflare/cfssl/releases/download/v1.5.0/cfssljson_1.5.0_linux_amd64 -o cfssljson
   chmod +x cfssljson
   curl -L https://github.com/cloudflare/cfssl/releases/download/v1.5.0/cfssl-certinfo_1.5.0_linux_amd64 -o cfssl-certinfo
   chmod +x cfssl-certinfo
   ```

1. আর্টিফ্যাক্টগুলি ধারণ করার জন্য একটি ডিরেক্টরি তৈরি করুন এবং cfssl ইনিশিয়ালাইজ করুন:

   ```shell
   mkdir cert
   cd cert
   ../cfssl print-defaults config > config.json
   ../cfssl print-defaults csr > csr.json
   ```

1. CA ফাইল তৈরি করার জন্য একটি JSON কনফিগ ফাইল তৈরি করুন, উদাহরণস্বরূপ, `ca-config.json`:

   ```json
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
   ```

1. CA সার্টিফিকেট সাইনিং রিকোয়েস্ট (CSR) এর জন্য একটি JSON কনফিগ ফাইল তৈরি করুন, উদাহরণস্বরূপ,
   `ca-csr.json`। অবশ্যই অ্যাঙ্গেল ব্রাকেটস দ্বারা চিহ্নিত মানগুলি বাস্তব মানগুলির
   সাথে প্রতিস্থাপন করুন।

   ```json
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
   ```

1. CA key (`ca-key.pem`) এবং সার্টিফিকেট (`ca.pem) তৈরি করুন:

   ```shell
   ../cfssl gencert -initca ca-csr.json | ../cfssljson -bare ca
   ```

1. API সার্ভারের জন্য key এবং সার্টিফিকেট তৈরি করার জন্য একটি JSON কনফিগ ফাইল তৈরি 
   করুন, উদাহরণস্বরূপ, `server-csr.json`। অবশ্যই অ্যাঙ্গেল ব্রাকেটসের মানগুলি
   বাস্তব মানগুলির সাথে রিপ্লেস করুন। `<MASTER_CLUSTER_IP>` হল সার্ভিস ক্লাস্টার
   পূর্ববর্তী সাবসেকশনে  বর্ণিত হিসাবে API সার্ভারের জন্য IP।
   নীচের উদাহরণটি এটি নিশ্চিত করে যে আপনি ডিফল্ট DNS ডোমেইন নাম হিসাবে
   `cluster.local` ব্যবহার করছেন।

   ```json
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
   ```

1. API সার্ভারের জন্য key এবং সার্টিফিকেট তৈরি করুন, যা ডিফল্টভাবে
   `server-key.pem` এবং `server.pem` ফাইলে যথাক্রমে সংরক্ষিত হয়:

   ```shell
   ../cfssl gencert -ca=ca.pem -ca-key=ca-key.pem \
        --config=ca-config.json -profile=kubernetes \
        server-csr.json | ../cfssljson -bare server
   ```

## স্ব-স্বাক্ষরিত CA সার্টিফিকেট বিতরণ

একটি ক্লায়েন্ট নোড একটি স্ব-স্বাক্ষরিত CA সার্টিফিকেটকে বৈধ হিসাবে স্বীকার করতে অস্বীকার করতে পারে।
একটি নন-প্রোডাকশন ডিপ্লয়মেন্ট, অথবা একটি ডিপ্লয়মেন্ট যা একটি কোম্পানি
ফায়ারওয়ালের পিছনে চলে, আপনি সমস্ত ক্লায়েন্টের কাছে একটি স্ব-স্বাক্ষরিত CA সার্টিফিকেট বিতরণ এবং বৈধ সার্টিফিকেটের জন্য স্থানীয়
তালিকা রিফ্রেশ করতে পারেন।

প্রতিটি ক্লায়েন্টে, নিম্নলিখিত অপারেশনগুলি সম্পাদন করুন:

```shell
sudo cp ca.crt /usr/local/share/ca-certificates/kubernetes.crt
sudo update-ca-certificates
```

```none
Updating certificates in /etc/ssl/certs...
1 added, 0 removed; done.
Running hooks in /etc/ca-certificates/update.d....
done.
```

## সার্টিফিকেট API

আপনি `certificates.k8s.io` API ব্যবহার করে
x509 সার্টিফিকেট প্রদান করতে পারেন অথেন্টিকেশনের জন্য যেমন নথিভুক্ত
[একটি ক্লাস্টারে TLS পরিচালনা করা](/docs/tasks/tls/managing-tls-in-a-cluster)
টাস্কের পৃষ্ঠায়।

