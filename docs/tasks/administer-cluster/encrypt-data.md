---
title: Encrypting data at rest
redirect_from:
- "/docs/user-guide/federation/"
- "/docs/user-guide/federation/index.html"
- "/docs/concepts/cluster-administration/multiple-clusters/"
- "/docs/concepts/cluster-administration/multiple-clusters.html"
- "/docs/admin/multi-cluster/"
- "/docs/admin/multi-cluster.html"
---

{% capture overview %}
This page shows how to enable and configure encryption of secret data at rest.
{% endcapture %}

{% capture prerequisites %}

* {% include task-tutorial-prereqs.md %}

* Kubernetes version 1.7.0 or later is required

* Encryption at rest is alpha in 1.7.0 which means it may change without notice. Users may be required to decrypt their data prior to upgrading to 1.8.0.

{% endcapture %}

{% capture steps %}

## Configuration and determining whether encryption at rest is already enabled

The `kube-apiserver` process accepts an argument `--experimental-encryption-provider-config`
that controls how API data is encrypted in etcd. An example configuration
is provided below.

## Understanding the encryption at rest configuration.

```yaml
kind: EncryptionConfig
apiVersion: v1
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

The first provider in the list will be used to encrypt resources going into storage. When reading
resources from storage the providers will be attempted in order to decrypt data. If no provider
can read the stored data, an error will be returned which will prevent clients from accessing that
resource. 

IMPORTANT: If any resource is not readable via the encryption config (because keys were changed), 
the only recourse is to delete that key from the underlying etcd directly. Calls that attempt to 
read that resource will fail until it is deleted or a valid decryption key is provided.

### Providers:

* `identity` results in the data being written as-is without encryption. 
  * When placed in the first position the resource will be decrypted as new values are written.
* `secretbox` uses XSalsa20 and Poly1305 to store data at rest
  * It is fast, but a newer standard and may not be considered acceptable in environments that require high levels of review. 
  * It requires a 32 byte key.
* `aescbc` uses AES in CBC mode
  * It is the recommended choice for encryption at rest but may be slightly slower than `secretbox`.
  * It requires 32 byte keys
* `aesgcm` uses AES in GCM mode with a randomly assigned nonce 
  * This mode is the fastest, but is not recommended for use except when an automated key rotation scheme is implemented. * Because these nonces are small the secret key must be rotated frequently - at most every 200k writes.
  * It supports 16, 24, or 32 byte keys, but 32 byte keys should always be used.

Each provider supports multiple keys - the keys are tried in order for decryption, and if the provider
is the first provider the first key is used for decryption.

## Encrypting your data

Create a new encryption config file

```yaml
kind: EncryptionConfig
apiVersion: v1
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

To create a new secret, generate a 32 byte random key and base64 encode it. On Linux or Mac OS X, the
following command will read 32 bytes of random data and then base 64 encode it.

```
head -c 32 /dev/urandom | base64 -i - -o -
```

Place that value in the secret field.  

Set the `--experimental-encryption-provider-config` flag on the `kube-apiserver` to point to the location 
of the config file and restart your API server. 

IMPORTANT: Your config file contains keys that can decrypt the content in etcd and should be properly 
permission restricted on your masters so that only the user that runs the `kube-apiserver` can read it.


## Verifying that data is encrypted 

Data is encrypted when written to etcd. After restarting your `kube-apiserver`, any newly created or
updated secret should be encrypted when stored. To check, you can use the `etcdctl` command line
program to retrieve the contents of your secret.

Create a new secret called `secret1` in the `default` namespace:

```
kubectl create secret generic secret1 -n default --from-literal=mykey=mydata
```

Using the etcdctl commandline, read that secret out of etcd:

```
ETCDCTL_API=3 etcdctl get /kubernetes.io/secrets/default/secret1 [...] | hexdump -C
```

where `[...]` must be the additional arguments for connecting to the etcd server. The `hexdump` command
will format the encoded bytes into a readable form. Verify the resulting output is prefixed with 
`k8s:enc:aescbc:v1:` which indicates the `aescbc` provider has encrypted the resulting data. 

Verify the secret is correctly decoded by retrieving the secret from the command line, and that the secret
contents match what was provided above (`mykey: mydata`).

```
kubectl describe secret generic -n default
```


## Ensuring all secrets to be encrypted

Since secrets are encrypted on write, performing an update on a secret will encrypt that content.

```
kubectl get secrets -o json | kubectl update -f -
```

Will read all secrets and then perform an update with encryption. If an error occurs due to a 
conflicting write, retry the command. For larger clusters, you may wish to subdivide the secrets
by namespace or script an update.


## Rotating a decryption key

Changing the secret without incurring downtime requires a multi step operation, especially in
the presence of a highly available deployment where multiple `kube-apiserver` processes are running.

1. Generate a new key and add it as the second key entry for the current provider on all servers
2. Restart all `kube-apiserver` processes to ensure each server can decrypt using the new key
3. Make the new key the first entry in the `keys` array so that it is used for encryption in the config
4. Restart all `kube-apiserver` processes to ensure each server now encrypts using the new key
5. Run `kubectl get secrets -o json | kubectl update -f -` to update all secrets
6. Remove the old decryption key from the config after you back up etcd with the new key in use and update all secrets

With a single `kube-apiserver`, step 2 may be skipped


## Decrypting all data

To disable encryption at rest place the `identity` provider as the first entry in the config:

```yaml
kind: EncryptionConfig
apiVersion: v1
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

and restart all `kube-apiserver` processes. Then run the command `kubectl get secrets -o json | kubectl update -f -`
to force all secrets to be decrypted.