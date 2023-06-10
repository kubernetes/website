---
title: Encrypting Confidential Data at Rest
reviewers:
- smarterclayton
- enj
content_type: task
weight: 210
---

<!-- overview -->
This page shows how to enable and configure encryption of secret data at rest.

## {{% heading "prerequisites" %}}

* {{< include "task-tutorial-prereqs.md" >}}

* This task assumes that you are running the Kubernetes API server as a
  {{< glossary_tooltip text="static pod" term_id="static-pod" >}} on each control
  plane node.

* Your cluster's control plane **must** use etcd v3.x (major version 3, any minor version).

* To encrypt a custom resource, your cluster must be running Kubernetes v1.26 or newer.

* To use a wildcard to match resources, your cluster must be running Kubernetes v1.27 or newer.

{{< version-check >}}


<!-- steps -->

## Configuration and determining whether encryption at rest is already enabled

The `kube-apiserver` process accepts an argument `--encryption-provider-config`
that controls how API data is encrypted in etcd.
The configuration is provided as an API named
[`EncryptionConfiguration`](/docs/reference/config-api/apiserver-encryption.v1/). An example configuration is provided below.

{{< caution >}}
**IMPORTANT:** For high-availability configurations (with two or more control plane nodes), the
encryption configuration file must be the same! Otherwise, the `kube-apiserver` component cannot
decrypt data stored in the etcd.
{{< /caution >}}

## Understanding the encryption at rest configuration

```yaml
---
#
# CAUTION: this is an example configuration.
#          Do not use this for your own cluster!
#
apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
resources:
  - resources:
      - secrets
      - configmaps
      - pandas.awesome.bears.example # a custom resource API
    providers:
      # This configuration does not provide data confidentiality. The first
      # configured provider is specifying the "identity" mechanism, which
      # stores resources as plain text.
      #
      - identity: {} # plain text, in other words NO encryption
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
  - resources:
      - events
    providers:
      - identity: {} # do not encrypt Events even though *.* is specified below
  - resources:
      - '*.apps' # wildcard match requires Kubernetes 1.27 or later
    providers:
      - aescbc:
          keys:
          - name: key2
            secret: c2VjcmV0IGlzIHNlY3VyZSwgb3IgaXMgaXQ/Cg==
  - resources:
      - '*.*' # wildcard match requires Kubernetes 1.27 or later
    providers:
      - aescbc:
          keys:
          - name: key3
            secret: c2VjcmV0IGlzIHNlY3VyZSwgSSB0aGluaw==
```

Each `resources` array item is a separate config and contains a complete configuration. The
`resources.resources` field is an array of Kubernetes resource names (`resource` or `resource.group`)
that should be encrypted like Secrets, ConfigMaps, or other resources. 

If custom resources are added to `EncryptionConfiguration` and the cluster version is 1.26 or newer, 
any newly created custom resources mentioned in the `EncryptionConfiguration` will be encrypted. 
Any custom resources that existed in etcd prior to that version and configuration will be unencrypted
until they are next written to storage. This is the same behavior as built-in resources.
See the [Ensure all secrets are encrypted](#ensure-all-secrets-are-encrypted) section.

The `providers` array is an ordered list of the possible encryption providers to use for the APIs that you listed.

Only one provider type may be specified per entry (`identity` or `aescbc` may be provided,
but not both in the same item).
The first provider in the list is used to encrypt resources written into the storage. When reading
resources from storage, each provider that matches the stored data attempts in order to decrypt the
data. If no provider can read the stored data due to a mismatch in format or secret key, an error
is returned which prevents clients from accessing that resource.

`EncryptionConfiguration` supports the use of wildcards to specify the resources that should be encrypted.
Use '`*.<group>`' to encrypt all resources within a group (for eg '`*.apps`' in above example) or '`*.*`'
to encrypt all resources. '`*.`' can be used to encrypt all resource in the core group. '`*.*`' will
encrypt all resources, even custom resources that are added after API server start. 

{{< note >}} Use of wildcards that overlap within the same resource list or across multiple entries are not allowed
since part of the configuration would be ineffective. The `resources` list's processing order and precedence
are determined by the order it's listed in the configuration. {{< /note >}}

Opting out of encryption for specific resources while wildcard is enabled can be achieved by adding a new
`resources` array item with the resource name, followed by the `providers` array item with the `identity` provider.
For example, if '`*.*`' is enabled and you want to opt-out encryption for the `events` resource, add a new item
to the `resources` array with `events` as the resource name, followed by the providers array item with `identity`.
The new item should look like this:

```yaml
- resources:
    - events
  providers:
    - identity: {}
```
Ensure that the new item is listed before the wildcard '`*.*`' item in the resources array to give it precedence.

For more detailed information about the `EncryptionConfiguration` struct, please refer to the
[encryption configuration API](/docs/reference/config-api/apiserver-encryption.v1/).

{{< caution >}}
If any resource is not readable via the encryption config (because keys were changed),
the only recourse is to delete that key from the underlying etcd directly. Calls that attempt to
read that resource will fail until it is deleted or a valid decryption key is provided.
{{< /caution >}}

### Providers

The following table describes each available provider:

<!-- localization note: if it makes sense to adapt this table to work for your localization,
     please do that. Each sentence in the English original should have a direct equivalent in the adapted
     layout, although this may not always be possible -->
<table class="complex-layout">
<caption style="display: none;">Providers for Kubernetes encryption at rest</caption>
<thead>
  <tr>
  <th>Name</th>
  <th>Encryption</th>
  <th>Strength</th>
  <th>Speed</th>
  <th>Key length</th>
  </tr>
</thead>
<tbody id="encryption-providers-identity">
  <!-- list identity first, even when the remaining rows are sorted alphabetically -->
  <tr>
  <th rowspan="2" scope="row"><tt>identity</tt></th>
  <td><strong>None</strong></td>
  <td>N/A</td>
  <td>N/A</td>
  <td>N/A</td>
  </tr>
  <tr>
  <td colspan="4">Resources written as-is without encryption. When set as the first provider, the resource will be decrypted as new values are written. Existing encrypted resources are <strong>not</strong> automatically overwritten with the plaintext data.
   The <tt>identity</tt> provider is the default if you do not specify otherwise.</td>
  </tr>
</tbody>
<tbody id="encryption-providers-that-encrypt">
  <tr>
  <th rowspan="2" scope="row"><tt>aescbc</tt></th>
  <td>AES-CBC with <a href="https://datatracker.ietf.org/doc/html/rfc2315">PKCS#7</a> padding</td>
  <td>Weak</td>
  <td>Fast</td>
  <td>32-byte</td>
  </tr>
  <tr>
  <td colspan="4">Not recommended due to CBC's vulnerability to padding oracle attacks. Key material accessible from control plane host.</td>
  </tr>
  <tr>
  <th rowspan="2" scope="row"><tt>aesgcm</tt></th>
  <td>AES-GCM with random nonce</td>
  <td>Must be rotated every 200,000 writes</td>
  <td>Fastest</td>
  <td>16, 24, or 32-byte</td>
  </tr>
  <tr>
  <td colspan="4">Not recommended for use except when an automated key rotation scheme is implemented. Key material accessible from control plane host.</td>
  </tr>
  <tr>
  <th rowspan="2" scope="row"><tt>kms</tt> v1</th>
  <td>Uses envelope encryption scheme with DEK per resource.</td>
  <td>Strongest</td>
  <td>Slow (<em>compared to <tt>kms</tt> version 2</em>)</td>
  <td>32-bytes</td>
  </tr>
  <tr>
  <td colspan="4">
    Data is encrypted by data encryption keys (DEKs) using AES-GCM;
    DEKs are encrypted by key encryption keys (KEKs) according to
    configuration in Key Management Service (KMS).
    Simple key rotation, with a new DEK generated for each encryption, and
    KEK rotation controlled by the user.
    <br />
    Read how to <a href="/docs/tasks/administer-cluster/kms-provider#configuring-the-kms-provider-kms-v1">configure the KMS V1 provider</a>.
    </td>
  </tr>
  <tr>
  <th rowspan="2" scope="row"><tt>kms</tt> v2 <em>(beta)</em></th>
  <td>Uses envelope encryption scheme with DEK per API server.</td>
  <td>Strongest</td>
  <td>Fast</td>
  <td>32-bytes</td>
  </tr>
  <tr>
  <td colspan="4">
    Data is encrypted by data encryption keys (DEKs) using AES-GCM; DEKs
    are encrypted by key encryption keys (KEKs) according to configuration
    in Key Management Service (KMS).
    A new DEK is generated at API server startup, and is then reused for
    encryption. The DEK is rotated whenever the KEK is rotated.
    A good choice if using a third party tool for key management.
    Available in beta from Kubernetes v1.27.
    <br />
    Read how to <a href="/docs/tasks/administer-cluster/kms-provider#configuring-the-kms-provider-kms-v2">configure the KMS V2 provider</a>.
    </td>
  </tr>
  <tr>
  <th rowspan="2" scope="row"><tt>secretbox</tt></th>
  <td>XSalsa20 and Poly1305</td>
  <td>Strong</td>
  <td>Faster</td>
  <td>32-byte</td>
  </tr>
  <tr>
  <td colspan="4">Uses relatively new encryption technologies that may not be considered acceptable in environments that require high levels of review. Key material accessible from control plane host.</td>
  </tr>
</tbody>
</table>

Each provider supports multiple keys - the keys are tried in order for decryption, and if the provider
is the first provider, the first key is used for encryption.


{{< caution >}}
Storing the raw encryption key in the EncryptionConfig only moderately improves your security
posture, compared to no encryption.  Please use `kms` provider for additional security.
{{< /caution >}}

By default, the `identity` provider is used to protect secret data in etcd, which provides no
encryption. `EncryptionConfiguration` was introduced to encrypt secret data locally, with a locally
managed key.

Encrypting secret data with a locally managed key protects against an etcd compromise, but it fails to
protect against a host compromise. Since the encryption keys are stored on the host in the
EncryptionConfiguration YAML file, a skilled attacker can access that file and extract the encryption
keys.

Envelope encryption creates dependence on a separate key, not stored in Kubernetes. In this case,
an attacker would need to compromise etcd, the `kubeapi-server`, and the third-party KMS provider to
retrieve the plaintext values, providing a higher level of security than locally stored encryption keys.

## Encrypting your data

Create a new encryption config file:

```yaml
---
apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
resources:
  - resources:
      - secrets
      - configmaps
      - pandas.awesome.bears.example
    providers:
      - aescbc:
          keys:
            - name: key1
              # See the following text for more details about the secret value
              secret: <BASE 64 ENCODED SECRET>
      - identity: {} # this fallback allows reading unencrypted secrets;
                     # for example, during initial migratoin
```

To create a new Secret, perform the following steps:

1. Generate a 32-byte random key and base64 encode it. If you're on Linux or macOS, run the following command:

   ```shell
   head -c 32 /dev/urandom | base64
   ```

1. Place that value in the `secret` field of the `EncryptionConfiguration` struct.
1. Set the `--encryption-provider-config` flag on the `kube-apiserver` to point to
   the location of the config file.

   You will need to mount the new encryption config file to the `kube-apiserver` static pod. Here is an example on how to do that:

   1. Save the new encryption config file to `/etc/kubernetes/enc/enc.yaml` on the control-plane node.
   1. Edit the manifest for the `kube-apiserver` static pod: `/etc/kubernetes/manifests/kube-apiserver.yaml` similarly to this:

   ```yaml
   ---
   #
   # This is a fragment of a manifest for a static Pod.
   # Check whether this is correct for your cluster and for your API server.
   #
   apiVersion: v1
   kind: Pod
   metadata:
     annotations:
       kubeadm.kubernetes.io/kube-apiserver.advertise-address.endpoint: 10.20.30.40:443
     creationTimestamp: null
     labels:
       app.kubernetes.io/component: kube-apiserver
       tier: control-plane
     name: kube-apiserver
     namespace: kube-system
   spec:
     containers:
     - command:
       - kube-apiserver
       ...
       - --encryption-provider-config=/etc/kubernetes/enc/enc.yaml  # add this line
       volumeMounts:
       ...
       - name: enc                           # add this line
         mountPath: /etc/kubernetes/enc      # add this line
         readonly: true                      # add this line
       ...
     volumes:
     ...
     - name: enc                             # add this line
       hostPath:                             # add this line
         path: /etc/kubernetes/enc           # add this line
         type: DirectoryOrCreate             # add this line
     ...
   ```

1. Restart your API server.

{{< caution >}}
Your config file contains keys that can decrypt the contents in etcd, so you must properly restrict
permissions on your control-plane nodes so only the user who runs the `kube-apiserver` can read it.
{{< /caution >}}

## Verifying that data is encrypted

Data is encrypted when written to etcd. After restarting your `kube-apiserver`, any newly created or
updated Secret or other resource types configured in `EncryptionConfiguration` should be encrypted
when stored. To check this, you can use the `etcdctl` command line
program to retrieve the contents of your secret data.

1. Create a new Secret called `secret1` in the `default` namespace:

   ```shell
   kubectl create secret generic secret1 -n default --from-literal=mykey=mydata
   ```

1. Using the `etcdctl` command line, read that Secret out of etcd:

   ```
   ETCDCTL_API=3 etcdctl get /registry/secrets/default/secret1 [...] | hexdump -C
   ```

   where `[...]` must be the additional arguments for connecting to the etcd server.

   For example:

   ```shell
   ETCDCTL_API=3 etcdctl \
      --cacert=/etc/kubernetes/pki/etcd/ca.crt   \
      --cert=/etc/kubernetes/pki/etcd/server.crt \
      --key=/etc/kubernetes/pki/etcd/server.key  \
      get /registry/secrets/default/secret1 | hexdump -C
   ```

   The output is similar to this (abbreviated):

   ```hexdump
   00000000  2f 72 65 67 69 73 74 72  79 2f 73 65 63 72 65 74  |/registry/secret|
   00000010  73 2f 64 65 66 61 75 6c  74 2f 73 65 63 72 65 74  |s/default/secret|
   00000020  31 0a 6b 38 73 3a 65 6e  63 3a 61 65 73 63 62 63  |1.k8s:enc:aescbc|
   00000030  3a 76 31 3a 6b 65 79 31  3a c7 6c e7 d3 09 bc 06  |:v1:key1:.l.....|
   00000040  25 51 91 e4 e0 6c e5 b1  4d 7a 8b 3d b9 c2 7c 6e  |%Q...l..Mz.=..|n|
   00000050  b4 79 df 05 28 ae 0d 8e  5f 35 13 2c c0 18 99 3e  |.y..(..._5.,...>|
   [...]
   00000110  23 3a 0d fc 28 ca 48 2d  6b 2d 46 cc 72 0b 70 4c  |#:..(.H-k-F.r.pL|
   00000120  a5 fc 35 43 12 4e 60 ef  bf 6f fe cf df 0b ad 1f  |..5C.N`..o......|
   00000130  82 c4 88 53 02 da 3e 66  ff 0a                    |...S..>f..|
   0000013a
   ```

1. Verify the stored Secret is prefixed with `k8s:enc:aescbc:v1:` which indicates
   the `aescbc` provider has encrypted the resulting data. Confirm that the key name shown in `etcd`
   matches the key name specified in the `EncryptionConfiguration` mentioned above. In this example,
   you can see that the encryption key named `key1` is used in `etcd` and in `EncryptionConfiguration`.

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
---
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

Then run the following command to force decrypt all Secrets:

```shell
kubectl get secrets --all-namespaces -o json | kubectl replace -f -
```

## Configure automatic reloading

You can configure automatic reloading of encryption provider configuration.
That setting determines whether the
{{< glossary_tooltip text="API server" term_id="kube-apiserver" >}} should
load the file you specify for `--encryption-provider-config` only once at
startup, or automatically whenever you change that file. Enabling this option
allows you to change the keys for encryption at rest without restarting the
API server.

To allow automatic reloading, configure the API server to run with:
`--encryption-provider-config-automatic-reload=true`

## {{% heading "whatsnext" %}}

* Learn more about the [EncryptionConfiguration configuration API (v1)](/docs/reference/config-api/apiserver-encryption.v1/).
