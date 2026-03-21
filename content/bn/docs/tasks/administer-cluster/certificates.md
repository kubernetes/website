---
title: ম্যানুয়ালি সার্টিফিকেট জেনারেট করুন
content_type: task
weight: 30
---

<!-- overview -->

ক্লায়েন্ট সার্টিফিকেট অথেনটিকেশন ব্যবহার করার সময়, আপনি [`easyrsa`](https://github.com/OpenVPN/easy-rsa), [`openssl`](https://github.com/openssl/openssl) বা [`cfssl`](https://github.com/cloudflare/cfssl) এর মাধ্যমে ম্যানুয়ালি সার্টিফিকেট জেনারেট করতে পারেন।

<!-- body -->

### easyrsa

**easyrsa** আপনার ক্লাস্টারের জন্য ম্যানুয়ালি সার্টিফিকেট জেনারেট করতে পারে।

1. `easyrsa3` এর প্যাচড ভার্সন ডাউনলোড, আনপ্যাক এবং ইনিশিয়ালাইজ করুন।

   ```shell
   curl -LO https://dl.k8s.io/easy-rsa/easy-rsa.tar.gz
   tar xzf easy-rsa.tar.gz
   cd easy-rsa-master/easyrsa3
   ./easyrsa init-pki
   ```
1. একটি নতুন সার্টিফিকেট অথরিটি (CA) জেনারেট করুন। `--batch` অটোমেটিক মোড সেট করে;
   `--req-cn` CA এর নতুন রুট সার্টিফিকেটের জন্য Common Name (CN) নির্দিষ্ট করে।

   ```shell
   ./easyrsa --batch "--req-cn=${MASTER_IP}@`date +%s`" build-ca nopass
   ```

1. সার্ভার সার্টিফিকেট এবং কী জেনারেট করুন।

   আর্গুমেন্ট `--subject-alt-name` সম্ভাব্য IP এবং DNS নাম সেট করে যার সাথে API সার্ভার
   অ্যাক্সেস করা হবে। `MASTER_CLUSTER_IP` সাধারণত সার্ভিস CIDR থেকে প্রথম IP
   যা API সার্ভার এবং
   কন্ট্রোলার ম্যানেজার কম্পোনেন্ট উভয়ের জন্য `--service-cluster-ip-range` আর্গুমেন্ট হিসাবে নির্দিষ্ট করা হয়। আর্গুমেন্ট `--days` সার্টিফিকেট মেয়াদ শেষ হওয়ার পরে দিনের সংখ্যা সেট করতে ব্যবহৃত হয়।
   নীচের নমুনাটি ধরে নেয় যে আপনি ডিফল্ট
   DNS ডোমেইন নাম হিসাবে `cluster.local` ব্যবহার করছেন।

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

1. নিম্নলিখিত প্যারামিটার পূরণ করুন এবং API সার্ভার স্টার্ট প্যারামিটারে যোগ করুন:

   ```shell
   --client-ca-file=/yourdirectory/ca.crt
   --tls-cert-file=/yourdirectory/server.crt
   --tls-private-key-file=/yourdirectory/server.key
   ```

### openssl

**openssl** আপনার ক্লাস্টারের জন্য ম্যানুয়ালি সার্টিফিকেট জেনারেট করতে পারে।

1. 2048bit সহ একটি ca.key জেনারেট করুন:

   ```shell
   openssl genrsa -out ca.key 2048
   ```

1. ca.key অনুযায়ী একটি ca.crt জেনারেট করুন (সার্টিফিকেট কার্যকর সময় সেট করতে `-days` ব্যবহার করুন):

   ```shell
   openssl req -x509 -new -nodes -key ca.key -subj "/CN=${MASTER_IP}" -days 10000 -out ca.crt
   ```

1. 2048bit সহ একটি server.key জেনারেট করুন:

   ```shell
   openssl genrsa -out server.key 2048
   ```

1. একটি Certificate Signing Request (CSR) জেনারেট করার জন্য একটি কনফিগ ফাইল তৈরি করুন।

   একটি ফাইলে সংরক্ষণ করার আগে অ্যাঙ্গেল ব্র্যাকেট দিয়ে চিহ্নিত মানগুলি (যেমন `<MASTER_IP>`)
   প্রকৃত মান দিয়ে প্রতিস্থাপন করতে ভুলবেন না (যেমন `csr.conf`)।
   মনে রাখবেন যে `MASTER_CLUSTER_IP` এর মান হল
   পূর্ববর্তী উপবিভাগে বর্ণিত API সার্ভারের জন্য সার্ভিস ক্লাস্টার IP।
   নীচের নমুনাটি ধরে নেয় যে আপনি ডিফল্ট
   DNS ডোমেইন নাম হিসাবে `cluster.local` ব্যবহার করছেন।

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

1. কনফিগ ফাইলের উপর ভিত্তি করে সার্টিফিকেট সাইনিং রিকোয়েস্ট জেনারেট করুন:

   ```shell
   openssl req -new -key server.key -out server.csr -config csr.conf
   ```

1. ca.key, ca.crt এবং server.csr ব্যবহার করে সার্ভার সার্টিফিকেট জেনারেট করুন:

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

অবশেষে, API সার্ভার স্টার্ট প্যারামিটারে একই প্যারামিটার যোগ করুন।


### cfssl

**cfssl** সার্টিফিকেট জেনারেশনের জন্য আরেকটি টুল।

1. নীচে দেখানো হিসাবে কমান্ড লাইন টুল ডাউনলোড, আনপ্যাক এবং প্রস্তুত করুন।

   মনে রাখবেন যে আপনি যে হার্ডওয়্যার
   আর্কিটেকচার এবং cfssl ভার্সন ব্যবহার করছেন তার উপর ভিত্তি করে আপনাকে নমুনা কমান্ড অভিযোজিত করতে হতে পারে।

   ```shell
   curl -L https://github.com/cloudflare/cfssl/releases/download/v1.5.0/cfssl_1.5.0_linux_amd64 -o cfssl
   chmod +x cfssl
   curl -L https://github.com/cloudflare/cfssl/releases/download/v1.5.0/cfssljson_1.5.0_linux_amd64 -o cfssljson
   chmod +x cfssljson
   curl -L https://github.com/cloudflare/cfssl/releases/download/v1.5.0/cfssl-certinfo_1.5.0_linux_amd64 -o cfssl-certinfo
   chmod +x cfssl-certinfo
   ```

1. আর্টিফ্যাক্ট রাখার জন্য একটি ডিরেক্টরি তৈরি করুন এবং cfssl ইনিশিয়ালাইজ করুন:

   ```shell
   mkdir cert
   cd cert
   ../cfssl print-defaults config > config.json
   ../cfssl print-defaults csr > csr.json
   ```

1. CA ফাইল জেনারেট করার জন্য একটি JSON কনফিগ ফাইল তৈরি করুন, উদাহরণস্বরূপ, `ca-config.json`:

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
   `ca-csr.json`। অ্যাঙ্গেল ব্র্যাকেট দিয়ে চিহ্নিত মানগুলি
   আপনি ব্যবহার করতে চান এমন প্রকৃত মান দিয়ে প্রতিস্থাপন করতে ভুলবেন না।

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

1. CA কী (`ca-key.pem`) এবং সার্টিফিকেট (`ca.pem`) জেনারেট করুন:

   ```shell
   ../cfssl gencert -initca ca-csr.json | ../cfssljson -bare ca
   ```

1. API
   সার্ভারের জন্য কী এবং সার্টিফিকেট জেনারেট করার জন্য একটি JSON কনফিগ ফাইল তৈরি করুন, উদাহরণস্বরূপ, `server-csr.json`। অ্যাঙ্গেল ব্র্যাকেটে মানগুলি
   আপনি ব্যবহার করতে চান এমন প্রকৃত মান দিয়ে প্রতিস্থাপন করতে ভুলবেন না। `<MASTER_CLUSTER_IP>` হল
   পূর্ববর্তী উপবিভাগে বর্ণিত API সার্ভারের জন্য সার্ভিস ক্লাস্টার IP।
   নীচের নমুনাটি ধরে নেয় যে আপনি ডিফল্ট
   DNS ডোমেইন নাম হিসাবে `cluster.local` ব্যবহার করছেন।

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

1. API সার্ভারের জন্য কী এবং সার্টিফিকেট জেনারেট করুন, যা ডিফল্টরূপে
   যথাক্রমে `server-key.pem` এবং `server.pem` ফাইলে সংরক্ষিত হয়:

   ```shell
   ../cfssl gencert -ca=ca.pem -ca-key=ca-key.pem \
        --config=ca-config.json -profile=kubernetes \
        server-csr.json | ../cfssljson -bare server
   ```

## সেলফ-সাইনড CA সার্টিফিকেট ডিস্ট্রিবিউট করা

একটি ক্লায়েন্ট Node একটি সেলফ-সাইনড CA সার্টিফিকেটকে বৈধ হিসাবে স্বীকৃতি দিতে অস্বীকার করতে পারে।
একটি নন-প্রোডাকশন ডিপ্লয়মেন্টের জন্য, বা একটি কোম্পানি
ফায়ারওয়ালের পিছনে চলা একটি ডিপ্লয়মেন্টের জন্য, আপনি সমস্ত ক্লায়েন্টে একটি সেলফ-সাইনড CA সার্টিফিকেট ডিস্ট্রিবিউট করতে পারেন এবং
বৈধ সার্টিফিকেটের জন্য স্থানীয় তালিকা রিফ্রেশ করতে পারেন।

প্রতিটি ক্লায়েন্টে, নিম্নলিখিত অপারেশন সম্পাদন করুন:

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

## Certificates API

আপনি `certificates.k8s.io` API ব্যবহার করতে পারেন
অথেনটিকেশনের জন্য ব্যবহার করার জন্য x509 সার্টিফিকেট প্রভিশন করতে যেমন
[ক্লাস্টারে TLS পরিচালনা](/bn/docs/tasks/tls/managing-tls-in-a-cluster)
টাস্ক পৃষ্ঠায় ডকুমেন্ট করা হয়েছে।
