---
title: Encrypting Secret Data at Rest
reviewers:
- smarterclayton
content_type: task
min-kubernetes-server-version: 1.13
---

<!-- overview -->
This page shows how to enable and configure encryption of secret data at rest.

## {{% heading "prerequisites" %}}

* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* etcd v3.0 or later is required

<!-- steps -->

## Configuration and determining whether encryption at rest is already enabled

The `kube-apiserver` process accepts an argument `--encryption-provider-config`
that controls how API data is encrypted in etcd.
The configuration is provided as an API named
[`EncryptionConfiguration`](/docs/reference/config-api/apiserver-encryption.v1/).
An example configuration is provided below.

{{< caution >}}
**IMPORTANT:** For high-availability configurations (with two or more control plane nodes), the
encryption configuration file must be the same! Otherwise, the `kube-apiserver` component cannot
decrypt data stored in the etcd.
{{< /caution >}}

## Understanding the encryption at rest configuration.

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
resources:
  - resources:
      - secrets
    providers:
      - identity: {}
      - aesgcm:
          keys:
            - name: key1
              secret: c2VjcmV0IGlzIHNlY3VyZQ==
            - name: key2
              secret: dGhpcyBpcyBwYXNzd29yZA==
      - aescbc:
          keys:
            - name: key1
              secret: c2VjcmV0IGlzIHNlY3VyZQ==
            - name: key2
              secret: dGhpcyBpcyBwYXNzd29yZA==
      - secretbox:
          keys:
            - name: key1
              secret: YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXoxMjM0NTY=
```

Each `resources` array item is a separate config and contains a complete configuration. The
`resources.resources` field is an array of Kubernetes resource names (`resource` or `resource.group`)
that should be encrypted. The `providers` array is an ordered list of the possible encryption
providers.

Only one provider type may be specified per entry (`identity` or `aescbc` may be provided,
but not both in the same item).
The first provider in the list is used to encrypt resources written into the storage. When reading
resources from storage, each provider that matches the stored data attempts in order to decrypt the
data. If no provider can read the stored data due to a mismatch in format or secret key, an error
is returned which prevents clients from accessing that resource.

For more detailed information about the `EncryptionConfiguration` struct, please refer to the
[encryption configuration API](/docs/reference/config-api/apiserver-encryption.v1/).

{{< caution >}}
If any resource is not readable via the encryption config (because keys were changed),
the only recourse is to delete that key from the underlying etcd directly. Calls that attempt to
read that resource will fail until it is deleted or a valid decryption key is provided.
{{< /caution >}}

### Providers:

{{< table caption="Providers for Kubernetes encryption at rest" >}}
Name | Encryption | Strength | Speed | Key Length | Other Considerations
-----|------------|----------|-------|------------|---------------------
`identity` | None | N/A | N/A | N/A | Resources written as-is without encryption. When set as the first provider, the resource will be decrypted as new values are written.
`secretbox` | XSalsa20 and Poly1305 | Strong | Faster | 32-byte | A newer standard and may not be considered acceptable in environments that require high levels of review.
`aesgcm` | AES-GCM with random nonce | Must be rotated every 200k writes | Fastest | 16, 24, or 32-byte | Is not recommended for use except when an automated key rotation scheme is implemented.
`aescbc` | AES-CBC with [PKCS#7](https://datatracker.ietf.org/doc/html/rfc2315) padding | Weak | Fast | 32-byte | Not recommended due to CBC's vulnerability to padding oracle attacks.
`kms` | Uses envelope encryption scheme: Data is encrypted by data encryption keys (DEKs) using AES-CBC with [PKCS#7](https://datatracker.ietf.org/doc/html/rfc2315) padding, DEKs are encrypted by key encryption keys (KEKs) according to configuration in Key Management Service (KMS) | Strongest | Fast | 32-bytes |  The recommended choice for using a third party tool for key management. Simplifies key rotation, with a new DEK generated for each encryption, and KEK rotation controlled by the user. [Configure the KMS provider](/docs/tasks/administer-cluster/kms-provider/)

Each provider supports multiple keys - the keys are tried in order for decryption, and if the provider
is the first provider, the first key is used for encryption.


{{< caution >}}
Storing the raw encryption key in the EncryptionConfig only moderately improves your security
posture, compared to no encryption.  Please use `kms` provider for additional security.
{{< /caution >}}

By default, the `identity` provider is used to protect Secrets in etcd, which provides no
encryption. `EncryptionConfiguration` was introduced to encrypt Secrets locally, with a locally
managed key.

Encrypting Secrets with a locally managed key protects against an etcd compromise, but it fails to
protect against a host compromise. Since the encryption keys are stored on the host in the
EncryptionConfiguration YAML file, a skilled attacker can access that file and extract the encryption
keys.

Envelope encryption creates dependence on a separate key, not stored in Kubernetes. In this case,
an attacker would need to compromise etcd, the `kubeapi-server`, and the third-party KMS provider to
retrieve the plaintext values, providing a higher level of security than locally stored encryption keys.

## Encrypting your data

Create a new encryption config file:

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
resources:
  - resources:
      - secrets
    providers:
      - aescbc:
          keys:
            - name: key1
              secret: <BASE 64 ENCODED SECRET>
      - identity: {}
```

To create a new Secret, perform the following steps:

1. Generate a 32-byte random key and base64 encode it. If you're on Linux or macOS, run the following command:

   ```shell
   head -c 32 /dev/urandom | base64
   ```

1. Place that value in the `secret` field of the `EncryptionConfiguration` struct.
1. Set the `--encryption-provider-config` flag on the `kube-apiserver` to point to
   the location of the config file.
1. Restart your API server.

{{< caution >}}
Your config file contains keys that can decrypt the contents in etcd, so you must properly restrict
permissions on your control-plane nodes so only the user who runs the `kube-apiserver` can read it.
{{< /caution >}}

{{< note >}}
We need to mount the new encryption config file to the kube-apiserver static pod.
{{< /note >}}

Example steps to set the `--encryption-provider-config` flag on the `kube-apiserver`:

- Save the new encryption config file to `/etc/kubernetes/enc/enc.yaml`.

- Edit static pod definition of kube-apiserver pod `/etc/kubernetes/manifests/kube-apiserver.yaml`.

  ```yaml
  apiVersion: v1
  kind: Pod
  metadata:
    annotations:
      kubeadm.kubernetes.io/kube-apiserver.advertise-address.endpoint: 10.10.30.4:6443
    creationTimestamp: null
    labels:
      component: kube-apiserver
      tier: control-plane
    name: kube-apiserver
    namespace: kube-system
  spec:
    containers:
    - command:
      - kube-apiserver
      ...
      - --encryption-provider-config=/etc/kubernetes/enc/enc.yaml  # <-- add this line
      volumeMounts:
      ...
      - name: enc                           # <-- add this line
        mountPath: /etc/kubernetes/enc      # <-- add this line
        readonly: true                      # <-- add this line
      ...
    volumes:
    ...
    - name: enc                             # <-- add this line
      hostPath:                             # <-- add this line
        path: /etc/kubernetes/enc           # <-- add this line
        type: DirectoryOrCreate             # <-- add this line
    ...
  ```

## Verifying that data is encrypted

Data is encrypted when written to etcd. After restarting your `kube-apiserver`, any newly created or
updated Secret should be encrypted when stored. To check this, you can use the `etcdctl` command line
program to retrieve the contents of your Secret.

1. Create a new Secret called `secret1` in the `default` namespace:

   ```shell
   kubectl create secret generic secret1 -n default --from-literal=mykey=mydata
   ```

1. Using the `etcdctl` command line, read that Secret out of etcd:

   `ETCDCTL_API=3 etcdctl get /registry/secrets/default/secret1 [...] | hexdump -C`

   where `[...]` must be the additional arguments for connecting to the etcd server.

   Example:

   ```
   ETCDCTL_API=3 etcdctl \
      --cacert=/etc/kubernetes/pki/etcd/ca.crt \
      --cert=/etc/kubernetes/pki/etcd/server.crt \
      --key=/etc/kubernetes/pki/etcd/server.key \
      get /registry/secrets/default/secret1  | hexdump -C
   00000000  2f 72 65 67 69 73 74 72  79 2f 73 65 63 72 65 74  |/registry/secret|
   00000010  73 2f 64 65 66 61 75 6c  74 2f 73 65 63 72 65 74  |s/default/secret|
   00000020  31 0a 6b 38 73 3a 65 6e  63 3a 61 65 73 63 62 63  |1.k8s:enc:aescbc|
   00000030  3a 76 31 3a 6b 65 79 31  3a c7 6c e7 d3 09 bc 06  |:v1:key1:.l.....|
   00000040  25 51 91 e4 e0 6c e5 b1  4d 7a 8b 3d b9 c2 7c 6e  |%Q...l..Mz.=..|n|
   00000050  b4 79 df 05 28 ae 0d 8e  5f 35 13 2c c0 18 99 3e  |.y..(..._5.,...>|
   00000060  44 ae f4 d3 ea f4 40 d1  58 b4 1c 33 7c ba c7 71  |D.....@.X..3|..q|
   00000070  eb ea 34 f0 2f a3 5a 84  52 96 7c 3f c8 ee a9 50  |..4./.Z.R.|?...P|
   00000080  bc 83 4f 8b 8e 62 ab 90  c9 eb 41 ca 9b 6d fc 93  |..O..b....A..m..|
   00000090  7c cf ec 04 0f 99 0c 55  f0 7f da d8 80 82 2a 5f  ||......U......*_|
   000000a0  be 9c ed 40 0f 3b 6a 41  46 13 8d 2a b3 79 29 83  |...@.;jAF..*.y).|
   000000b0  57 22 cf 92 a6 d6 92 58  ea 65 51 17 a3 24 be f0  |W".....X.eQ..$..|
   000000c0  d6 1f 37 41 6d 35 ee af  e9 62 a5 35 16 f4 e6 66  |..7Am5...b.5...f|
   000000d0  08 42 36 fa 14 5b a3 52  f4 cd cb d8 f2 8f 3a c0  |.B6..[.R......:.|
   000000e0  24 92 7e b9 45 ab 99 4b  f1 4a 18 55 72 04 11 a8  |$.~.E..K.J.Ur...|
   000000f0  29 92 45 de 18 a0 ef 60  10 4b f8 42 11 e4 87 9a  |).E....`.K.B....|
   00000100  5a 36 19 10 20 7f 66 80  d6 63 19 dd f0 f3 3a 71  |Z6.. .f..c....:q|
   00000110  23 3a 0d fc 28 ca 48 2d  6b 2d 46 cc 72 0b 70 4c  |#:..(.H-k-F.r.pL|
   00000120  a5 fc 35 43 12 4e 60 ef  bf 6f fe cf df 0b ad 1f  |..5C.N`..o......|
   00000130  82 c4 88 53 02 da 3e 66  ff 0a                    |...S..>f..|
   0000013a
   ```

1. Verify the stored Secret is prefixed with `k8s:enc:aescbc:v1:` which indicates
   the `aescbc` provider has encrypted the resulting data.

1. Verify the Secret is correctly decrypted when retrieved via the API:

   ```shell
   kubectl get secret secret1 -n default -o yaml
   ```

   The output should contain `mykey: bXlkYXRh`, with contents of `mydata` encoded, check
   [decoding a Secret](/docs/tasks/configmap-secret/managing-secret-using-kubectl/#decoding-secret)
   to completely decode the Secret.

## Ensure all Secrets are encrypted

Since Secrets are encrypted on write, performing an update on a Secret will encrypt that content.

```shell
kubectl get secrets --all-namespaces -o json | kubectl replace -f -
```

The command above reads all Secrets and then updates them to apply server side encryption.

{{< note >}}
If an error occurs due to a conflicting write, retry the command.
For larger clusters, you may wish to subdivide the secrets by namespace or script an update.
{{< /note >}}

## Rotating a decryption key

Changing a Secret without incurring downtime requires a multi-step operation, especially in
the presence of a highly-available deployment where multiple `kube-apiserver` processes are running.

1. Generate a new key and add it as the second key entry for the current provider on all servers
1. Restart all `kube-apiserver` processes to ensure each server can decrypt using the new key
1. Make the new key the first entry in the `keys` array so that it is used for encryption in the config
1. Restart all `kube-apiserver` processes to ensure each server now encrypts using the new key
1. Run `kubectl get secrets --all-namespaces -o json | kubectl replace -f -` to encrypt all
   existing Secrets with the new key
1. Remove the old decryption key from the config after you have backed up etcd with the new key in use
   and updated all Secrets

When running a single `kube-apiserver` instance, step 2 may be skipped.

## Decrypting all data

To disable encryption at rest, place the `identity` provider as the first entry in the config
and restart all `kube-apiserver` processes. 

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
resources:
  - resources:
      - secrets
    providers:
      - identity: {}
      - aescbc:
          keys:
            - name: key1
              secret: <BASE 64 ENCODED SECRET>
```

Then run the following command to force decrypt
all Secrets:

```shell
kubectl get secrets --all-namespaces -o json | kubectl replace -f -
```

## {{% heading "whatsnext" %}}

* Learn more about the [EncryptionConfiguration configuration API (v1)](/docs/reference/config-api/apiserver-encryption.v1/).

