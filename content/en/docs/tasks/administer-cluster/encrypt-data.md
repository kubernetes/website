---
reviewers:
- smarterclayton
title: Encrypting Secret Data at Rest
content_template: templates/task
---

{{% capture overview %}}
This page shows how to enable and configure encryption of secret data at rest.
{{% /capture %}}

{{% capture prerequisites %}}

* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* Kubernetes version 1.13.0 or later is required

* etcd v3 or later is required

{{% /capture %}}

{{% capture steps %}}

## Configuration and determining whether encryption at rest is already enabled

The `kube-apiserver` process accepts an argument `--encryption-provider-config`
that controls how API data is encrypted in etcd. An example configuration
is provided below.

Note:
The alpha version of the encryption feature prior to 1.13 used the `--experimental-encryption-provider-config` flag.

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
providers. Only one provider type may be specified per entry (`identity` or `aescbc` may be provided,
but not both in the same item).

The first provider in the list is used to encrypt resources going into storage. When reading
resources from storage each provider that matches the stored data attempts to decrypt the data in
order. If no provider can read the stored data due to a mismatch in format or secret key, an error 
is returned which prevents clients from accessing that resource. 

Note:
The alpha version of the encryption feature prior to 1.13 required to be configured with
`kind: EncryptionConfig` and `apiVersion: v1`.

{{< caution >}}
**IMPORTANT:** If any resource is not readable via the encryption config (because keys were changed), 
the only recourse is to delete that key from the underlying etcd directly. Calls that attempt to 
read that resource will fail until it is deleted or a valid decryption key is provided.
{{< /caution >}}

### Providers:

Name | Encryption | Strength | Speed | Key Length | Other Considerations
-----|------------|----------|-------|------------|---------------------
`identity` | None | N/A | N/A | N/A | Resources written as-is without encryption. When set as the first provider, the resource will be decrypted as new values are written.
`aescbc` | AES-CBC with PKCS#7 padding | Strongest | Fast | 32-byte | The recommended choice for encryption at rest but may be slightly slower than `secretbox`.
`secretbox` | XSalsa20 and Poly1305 | Strong | Faster | 32-byte | A newer standard and may not be considered acceptable in environments that require high levels of review. 
`aesgcm` | AES-GCM with random nonce | Must be rotated every 200k writes | Fastest | 16, 24, or 32-byte | Is not recommended for use except when an automated key rotation scheme is implemented.
`kms` | Uses envelope encryption scheme: Data is encrypted by data encryption keys (DEKs) using AES-CBC with PKCS#7 padding, DEKs are encrypted by key encryption keys (KEKs) according to configuration in Key Management Service (KMS) | Strongest | Fast | 32-bytes |  The recommended choice for using a third party tool for key management. Simplifies key rotation, with a new DEK generated for each encryption, and KEK rotation controlled by the user. [Configure the KMS provider](/docs/tasks/administer-cluster/kms-provider/)

Each provider supports multiple keys - the keys are tried in order for decryption, and if the provider
is the first provider, the first key is used for encryption.

__Storing the raw encryption key in the EncryptionConfig only moderately improves your security posture, compared to no encryption.
Please use `kms` provider for additional security.__ By default, the `identity` provider is used to protect secrets in etcd, which
provides no encryption. `EncryptionConfiguration` was introduced to encrypt secrets locally, with a locally managed key.
Encrypting secrets with a locally managed key protects against an etcd compromise, but it fails to protect against a host compromise.
Since the encryption keys are stored on the host in the EncryptionConfig YAML file, a skilled attacker can access that file and
extract the encryption keys. This was a stepping stone in development to the `kms` provider, introduced in 1.10, and beta since 1.12. Envelope encryption
creates dependence on a separate key, not stored in Kubernetes. In this case, an attacker would need to compromise etcd, the
kubeapi-server, and the third-party KMS provider to retrieve the plaintext values, providing a higher level of security than
locally-stored encryption keys.

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

To create a new secret perform the following steps:

1. Generate a 32 byte random key and base64 encode it. If you're on Linux or macOS, run the following command:

    ```
    head -c 32 /dev/urandom | base64
    ```

2. Place that value in the secret field.
3. Set the `--encryption-provider-config` flag on the `kube-apiserver` to point to the location of the config file.
4. Restart your API server.

{{< caution >}}
Your config file contains keys that can decrypt content in etcd, so you must properly restrict permissions on your masters so only the user who runs the kube-apiserver can read it.
{{< /caution >}}


## Verifying that data is encrypted 

Data is encrypted when written to etcd. After restarting your `kube-apiserver`, any newly created or
updated secret should be encrypted when stored. To check, you can use the `etcdctl` command line
program to retrieve the contents of your secret.

1. Create a new secret called `secret1` in the `default` namespace:

    ```
    kubectl create secret generic secret1 -n default --from-literal=mykey=mydata
    ```

2. Using the etcdctl commandline, read that secret out of etcd:

    ```
    ETCDCTL_API=3 etcdctl get /registry/secrets/default/secret1 [...] | hexdump -C
    ```

    where `[...]` must be the additional arguments for connecting to the etcd server. 
3. Verify the stored secret is prefixed with `k8s:enc:aescbc:v1:` which indicates the `aescbc` provider has encrypted the resulting data. 
4. Verify the secret is correctly decrypted when retrieved via the API:

    ```
    kubectl describe secret secret1 -n default
    ```

    should match `mykey: bXlkYXRh`, mydata is encoded, check [decoding a secret](/docs/concepts/configuration/secret#decoding-a-secret) to
    completely decode the secret.


## Ensure all secrets are encrypted

Since secrets are encrypted on write, performing an update on a secret will encrypt that content.

```
kubectl get secrets --all-namespaces -o json | kubectl replace -f -
```

The command above reads all secrets and then updates them to apply server side encryption.
If an error occurs due to a conflicting write, retry the command.
For larger clusters, you may wish to subdivide the secrets by namespace or script an update.


## Rotating a decryption key

Changing the secret without incurring downtime requires a multi step operation, especially in
the presence of a highly available deployment where multiple `kube-apiserver` processes are running.

1. Generate a new key and add it as the second key entry for the current provider on all servers
2. Restart all `kube-apiserver` processes to ensure each server can decrypt using the new key
3. Make the new key the first entry in the `keys` array so that it is used for encryption in the config
4. Restart all `kube-apiserver` processes to ensure each server now encrypts using the new key
5. Run `kubectl get secrets --all-namespaces -o json | kubectl replace -f -` to encrypt all existing secrets with the new key
6. Remove the old decryption key from the config after you back up etcd with the new key in use and update all secrets

With a single `kube-apiserver`, step 2 may be skipped.


## Decrypting all data

To disable encryption at rest place the `identity` provider as the first entry in the config:

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

and restart all `kube-apiserver` processes. Then run the command `kubectl get secrets --all-namespaces -o json | kubectl replace -f -`
to force all secrets to be decrypted.

{{% /capture %}}


