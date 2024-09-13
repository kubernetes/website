---
title: Encrypting Confidential Data at Rest
reviewers:
- smarterclayton
- enj
content_type: task
weight: 210
---

<!-- overview -->

All of the APIs in Kubernetes that let you write persistent API resource data support
at-rest encryption. For example, you can enable at-rest encryption for
{{< glossary_tooltip text="Secrets" term_id="secret" >}}.
This at-rest encryption is additional to any system-level encryption for the
etcd cluster or for the filesystem(s) on hosts where you are running the
kube-apiserver.

This page shows how to enable and configure encryption of API data at rest.

{{< note >}}
This task covers encryption for resource data stored using the
{{< glossary_tooltip text="Kubernetes API" term_id="kubernetes-api" >}}. For example, you can
encrypt Secret objects, including the key-value data they contain.

If you want to encrypt data in filesystems that are mounted into containers, you instead need
to either:

- use a storage integration that provides encrypted
  {{< glossary_tooltip text="volumes" term_id="volume" >}}
- encrypt the data within your own application
{{< /note >}}

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

## Determine whether encryption at rest is already enabled {#determining-whether-encryption-at-rest-is-already-enabled}

By default, the API server stores plain-text representations of resources into etcd, with
no at-rest encryption.

The `kube-apiserver` process accepts an argument `--encryption-provider-config`
that specifies a path to a configuration file. The contents of that file, if you specify one,
control how Kubernetes API data is encrypted in etcd.
If you are running the kube-apiserver without the `--encryption-provider-config` command line
argument, you do not have encryption at rest enabled. If you are running the kube-apiserver
with the `--encryption-provider-config` command line argument, and the file that it references
specifies the `identity` provider as the first encryption provider in the list, then you
do not have at-rest encryption enabled
(**the default `identity` provider does not provide any confidentiality protection.**)

If you are running the kube-apiserver
with the `--encryption-provider-config` command line argument, and the file that it references
specifies a provider other than `identity` as the first encryption provider in the list, then
you already have at-rest encryption enabled. However, that check does not tell you whether
a previous migration to encrypted storage has succeeded. If you are not sure, see
[ensure all relevant data are encrypted](#ensure-all-secrets-are-encrypted).

## Understanding the encryption at rest configuration

<!-- note to localizers: the highlight is to make the initial comment obvious -->
<!-- you can use as many lines as makes sense for your target localization    -->

{{< highlight yaml "linenos=false,hl_lines=2-5" >}}
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
{{< /highlight  >}}

Each `resources` array item is a separate config and contains a complete configuration. The
`resources.resources` field is an array of Kubernetes resource names (`resource` or `resource.group`)
that should be encrypted like Secrets, ConfigMaps, or other resources.

If custom resources are added to `EncryptionConfiguration` and the cluster version is 1.26 or newer,
any newly created custom resources mentioned in the `EncryptionConfiguration` will be encrypted.
Any custom resources that existed in etcd prior to that version and configuration will be unencrypted
until they are next written to storage. This is the same behavior as built-in resources.
See the [Ensure all secrets are encrypted](#ensure-all-secrets-are-encrypted) section.

The `providers` array is an ordered list of the possible encryption providers to use for the APIs that you listed.
Each provider supports multiple keys - the keys are tried in order for decryption, and if the provider
is the first provider, the first key is used for encryption.

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

If you have a wildcard covering resources and want to opt out of at-rest encryption for a particular kind
of resource, you achieve that by adding a separate `resources` array item with the name of the resource that
you want to exempt, followed by a `providers` array item where you specify the `identity` provider. You add
this item to the list so that it appears earlier than the configuration where you do specify encryption
(a provider that is not `identity`).

For example, if '`*.*`' is enabled and you want to opt out of encryption for Events and ConfigMaps, add a
new **earlier** item to the `resources`, followed by the providers array item with `identity` as the
provider. The more specific entry must come before the wildcard entry.

The new item would look similar to:

```yaml
  ...
  - resources:
      - configmaps. # specifically from the core API group,
                    # because of trailing "."
      - events
    providers:
      - identity: {}
  # and then other entries in resources
```

Ensure that the exemption is listed _before_ the wildcard '`*.*`' item in the resources array
to give it precedence.

For more detailed information about the `EncryptionConfiguration` struct, please refer to the
[encryption configuration API](/docs/reference/config-api/apiserver-config.v1/).

{{< caution >}}
If any resource is not readable via the encryption configuration (because keys were changed),
and you cannot restore a working configuration, your only recourse is to delete that entry from
the underlying etcd directly.

Any calls to the Kubernetes API that attempt to read that resource will fail until it is deleted
or a valid decryption key is provided.
{{< /caution >}}

### Available providers {#providers}

Before you configure encryption-at-rest for data in your cluster's Kubernetes API, you
need to select which provider(s) you will use.

The following table describes each available provider.

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
  <th rowspan="2" scope="row"><tt>kms</tt> v1 <em>(deprecated since Kubernetes v1.28)</em></th>
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
  <th rowspan="2" scope="row"><tt>kms</tt> v2 </th>
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
    Kubernetes generates a new DEK per encryption from a secret seed.
    The seed is rotated whenever the KEK is rotated.<br/>
    A good choice if using a third party tool for key management.
    Available as stable from Kubernetes v1.29.
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

The `identity` provider is the default if you do not specify otherwise. **The `identity` provider does not
encrypt stored data and provides _no_ additional confidentiality protection.**

### Key storage

#### Local key storage

Encrypting secret data with a locally managed key protects against an etcd compromise, but it fails to
protect against a host compromise. Since the encryption keys are stored on the host in the
EncryptionConfiguration YAML file, a skilled attacker can access that file and extract the encryption
keys.

#### Managed (KMS) key storage {#kms-key-storage}

The KMS provider uses _envelope encryption_: Kubernetes encrypts resources using a data key, and then
encrypts that data key using the managed encryption service. Kubernetes generates a unique data key for
each resource. The API server stores an encrypted version of the data key in etcd alongside the ciphertext;
when reading the resource, the API server calls the managed encryption service and provides both the
ciphertext and the (encrypted) data key.
Within the managed encryption service, the provider use a _key encryption key_ to decipher the data key,
deciphers the data key, and finally recovers the plain text. Communication between the control plane
and the KMS requires in-transit protection, such as TLS.

Using envelope encryption creates dependence on the key encryption key, which is not stored in Kubernetes.
In the KMS case, an attacker who intends to get unauthorised access to the plaintext
values would need to compromise etcd **and** the third-party KMS provider.

### Protection for encryption keys

You should take appropriate measures to protect the confidential information that allows decryption,
whether that is a local encryption key, or an authentication token that allows the API server to
call KMS.

Even when you rely on a provider to manage the use and lifecycle of the main encryption key (or keys), you are still responsible
for making sure that access controls and other security measures for the managed encryption service are
appropriate for your security needs.

## Encrypt your data {#encrypting-your-data}

### Generate the encryption key {#generate-key-no-kms}

The following steps assume that you are not using KMS, and therefore the steps also
assume that you need to generate an encryption key. If you already have an encryption key,
skip to [Write an encryption configuration file](#write-an-encryption-configuration-file).

{{< caution >}}
Storing the raw encryption key in the EncryptionConfig only moderately improves your security posture,
compared to no encryption.

For additional secrecy, consider using the `kms` provider as this relies on keys held outside your
Kubernetes cluster. Implementations of `kms` can work with hardware security modules or with
encryption services managed by your cloud provider.

To learn about setting
up encryption at rest using KMS, see
[Using a KMS provider for data encryption](/docs/tasks/administer-cluster/kms-provider/).
The KMS provider plugin that you use may also come with additional specific documentation.
{{< /caution >}}

Start by generating a new encryption key, and then encode it using base64:

{{< tabs name="generate_encryption_key" >}}
{{% tab name="Linux" %}}
Generate a 32-byte random key and base64 encode it. You can use this command:
```shell
head -c 32 /dev/urandom | base64
```

You can use `/dev/hwrng` instead of `/dev/urandom` if you want to
use your PC's built-in hardware entropy source. Not all Linux
devices provide a hardware random generator.
{{% /tab %}}
{{% tab name="macOS" %}}
<!-- localization note: this is similar to the Linux tab and the wording
should match wherever the English text does -->
Generate a 32-byte random key and base64 encode it. You can use this command:
```shell
head -c 32 /dev/urandom | base64
```
{{% /tab %}}
{{% tab name="Windows" %}}
Generate a 32-byte random key and base64 encode it. You can use this command:
```powershell
# Do not run this in a session where you have set a random number
# generator seed.
[Convert]::ToBase64String((1..32|%{[byte](Get-Random -Max 256)}))
```
{{% /tab %}}
{{< /tabs >}}


{{< note >}}
Keep the encryption key confidential, including while you generate it and
ideally even after you are no longer actively using it.
{{< /note >}}

### Replicate the encryption key

Using a secure mechanism for file transfer, make a copy of that encryption key
available to every other control plane host.

At a minimum, use encryption in transit - for example, secure shell (SSH). For more
security, use asymmetric encryption between hosts, or change the approach you are using
so that you're relying on KMS encryption.

### Write an encryption configuration file

{{< caution >}}
The encryption configuration file may contain keys that can decrypt content in etcd.
If the configuration file contains any key material, you must properly
restrict permissions on all your control plane hosts so only the user
who runs the kube-apiserver can read this configuration.
{{< /caution >}}

Create a new encryption configuration file. The contents should be similar to:

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
                     # for example, during initial migration
```

To create a new encryption key (that does not use KMS), see
[Generate the encryption key](#generate-key-no-kms).

### Use the new encryption configuration file

You will need to mount the new encryption config file to the `kube-apiserver` static pod. Here is an example on how to do that:

1. Save the new encryption config file to `/etc/kubernetes/enc/enc.yaml` on the control-plane node.
1. Edit the manifest for the `kube-apiserver` static pod: `/etc/kubernetes/manifests/kube-apiserver.yaml` so that it is similar to:

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
         readOnly: true                      # add this line
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

You now have encryption in place for **one** control plane host. A typical
Kubernetes cluster has multiple control plane hosts, so there is more to do.

### Reconfigure other control plane hosts {#api-server-config-update-more}

If you have multiple API servers in your cluster, you should deploy the
changes in turn to each API server.

{{< caution >}}
For cluster configurations with two or more control plane nodes, the encryption configuration
should be identical across each control plane node.

If there is a difference in the encryption provider configuration between control plane
nodes, this difference may mean that the kube-apiserver can't decrypt data.
{{< /caution >}}

When you are planning to update the encryption configuration of your cluster, plan this
so that the API servers in your control plane can always decrypt the stored data
(even part way through rolling out the change).

Make sure that you use the **same** encryption configuration on each
control plane host.

### Verify that newly written data is encrypted {#verifying-that-data-is-encrypted}

Data is encrypted when written to etcd. After restarting your `kube-apiserver`, any newly
created or updated Secret (or other resource kinds configured in `EncryptionConfiguration`)
should be encrypted when stored.

To check this, you can use the `etcdctl` command line
program to retrieve the contents of your secret data.

This example shows how to check this for encrypting the Secret API.

1. Create a new Secret called `secret1` in the `default` namespace:

   ```shell
   kubectl create secret generic secret1 -n default --from-literal=mykey=mydata
   ```

1. Using the `etcdctl` command line tool, read that Secret out of etcd:

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

   The output should contain `mykey: bXlkYXRh`, with contents of `mydata` encoded using base64;
   read
   [decoding a Secret](/docs/tasks/configmap-secret/managing-secret-using-kubectl/#decoding-secret)
   to learn how to completely decode the Secret.

### Ensure all relevant data are encrypted {#ensure-all-secrets-are-encrypted}

It's often not enough to make sure that new objects get encrypted: you also want that
encryption to apply to the objects that are already stored.

For this example, you have configured your cluster so that Secrets are encrypted on write.
Performing a replace operation for each Secret will encrypt that content at rest,
where the objects are unchanged.

You can make this change across all Secrets in your cluster:

```shell
# Run this as an administrator that can read and write all Secrets
kubectl get secrets --all-namespaces -o json | kubectl replace -f -
```

The command above reads all Secrets and then updates them with the same data, in order to
apply server side encryption.

{{< note >}}
If an error occurs due to a conflicting write, retry the command.
It is safe to run that command more than once.

For larger clusters, you may wish to subdivide the Secrets by namespace,
or script an update.
{{< /note >}}

## Prevent plain text retrieval {#cleanup-all-secrets-encrypted}

If you want to make sure that the only access to a particular API kind is done using
encryption, you can remove the API server's ability to read that API's backing data
as plaintext.

{{< warning >}}
Making this change prevents the API server from retrieving resources that are marked
as encrypted at rest, but are actually stored in the clear.

When you have configured encryption at rest for an API (for example: the API kind
`Secret`, representing `secrets` resources in the core API group), you **must** ensure
that all those resources in this cluster really are encrypted at rest. Check this before
you carry on with the next steps.
{{< /warning >}}

Once all Secrets in your cluster are encrypted, you can remove the `identity`
part of the encryption configuration. For example:

{{< highlight yaml "linenos=false,hl_lines=12" >}}
---
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
      - identity: {} # REMOVE THIS LINE
{{< /highlight >}}

…and then restart each API server in turn. This change prevents the API server
from accessing a plain-text Secret, even by accident.

## Rotate a decryption key {#rotating-a-decryption-key}

Changing an encryption key for Kubernetes without incurring downtime requires a multi-step operation,
especially in the presence of a highly-available deployment where multiple `kube-apiserver` processes
are running.

1. Generate a new key and add it as the second key entry for the current provider on all
   control plane nodes.
1. Restart **all** `kube-apiserver` processes, to ensure each server can decrypt
   any data that are encrypted with the new key.
1. Make a secure backup of the new encryption key. If you lose all copies of this key you would
   need to delete all the resources were encrypted under the lost key, and workloads may not
   operate as expected during the time that at-rest encryption is broken.
1. Make the new key the first entry in the `keys` array so that it is used for encryption-at-rest
   for new writes
1. Restart all `kube-apiserver` processes to ensure each control plane host now encrypts using the new key
1. As a privileged user, run `kubectl get secrets --all-namespaces -o json | kubectl replace -f -`
   to encrypt all existing Secrets with the new key
1. After you have updated all existing Secrets to use the new key and have made a secure backup of the
   new key, remove the old decryption key from the configuration.

## Decrypt all data {#decrypting-all-data}

This example shows how to stop encrypting the Secret API at rest. If you are encrypting
other API kinds, adjust the steps to match.

To disable encryption at rest, place the `identity` provider as the first
entry in your encryption configuration file:

```yaml
---
apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
resources:
  - resources:
      - secrets
      # list any other resources here that you previously were
      # encrypting at rest
    providers:
      - identity: {} # add this line
      - aescbc:
          keys:
            - name: key1
              secret: <BASE 64 ENCODED SECRET> # keep this in place
                                               # make sure it comes after "identity"
```

Then run the following command to force decryption of all Secrets:

```shell
kubectl get secrets --all-namespaces -o json | kubectl replace -f -
```

Once you have replaced all existing encrypted resources with backing data that
don't use encryption, you can remove the encryption settings from the
`kube-apiserver`.

## Configure automatic reloading

You can configure automatic reloading of encryption provider configuration.
That setting determines whether the
{{< glossary_tooltip text="API server" term_id="kube-apiserver" >}} should
load the file you specify for `--encryption-provider-config` only once at
startup, or automatically whenever you change that file. Enabling this option
allows you to change the keys for encryption at rest without restarting the
API server.

To allow automatic reloading, configure the API server to run with:
`--encryption-provider-config-automatic-reload=true`.
When enabled, file changes are polled every minute to observe the modifications.
The `apiserver_encryption_config_controller_automatic_reload_last_timestamp_seconds`
metric identifies when the new config becomes effective. This allows
encryption keys to be rotated without restarting the API server.


## {{% heading "whatsnext" %}}

* Read about [decrypting data that are already stored at rest](/docs/tasks/administer-cluster/decrypt-data/)
* Learn more about the [EncryptionConfiguration configuration API (v1)](/docs/reference/config-api/apiserver-config.v1/).
