---
reviewers:
- smarterclayton
title: Using a KMS provider for data encryption
content_template: templates/task
---
{{% capture overview %}}
This page shows how to configure a Key Management Service (KMS) provider and plugin to enable secret data encryption.
{{% /capture %}}

{{% capture prerequisites %}}

* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* Kubernetes version 1.10.0 or later is required

* etcd v3 or later is required

{{< feature-state for_k8s_version="v1.12" state="beta" >}}

{{% /capture %}}

{{% capture steps %}}

The KMS encryption provider uses an envelope encryption scheme to encrypt data in etcd. The data is encrypted using a data encryption key (DEK); a new DEK is generated for each encryption. The DEKs are encrypted with a key encryption key (KEK) that is stored and managed in a remote KMS. The KMS provider uses gRPC to communicate with a specific KMS 
plugin. The KMS plugin, which is implemented as a gRPC server and deployed on the same host(s) as the Kubernetes master(s), is responsible for all communication with the remote KMS.

## Configuring the KMS provider

To configure a KMS provider on the API server, include a provider of type ```kms``` in the providers array in the encryption configuration file and set the following properties:

  * `name`: Display name of the KMS plugin.
  * `endpoint`: Listen address of the gRPC server (KMS plugin). The endpoint is a UNIX domain socket.
  * `cachesize`: Number of data encryption keys (DEKs) to be cached in the clear. When cached, DEKs can be used without another call to the KMS; whereas DEKs that are not cached require a call to the KMS to unwrap.
  * `timeout`: How long should kube-apiserver wait for kms-plugin to respond before returning an error (default is 3 seconds).

See [Understanding the encryption at rest configuration.](/docs/tasks/administer-cluster/encrypt-data)

## Implementing a KMS plugin

To implement a KMS plugin, you can develop a new plugin gRPC server or enable a KMS plugin already provided by your cloud provider. You then integrate the plugin with the remote KMS and deploy it on the Kubernetes master.

### Enabling the KMS supported by your cloud provider 
Refer to your cloud provider for instructions on enabling the cloud provider-specific KMS plugin.

### Developing a KMS plugin gRPC server
You can develop a KMS plugin gRPC server using a stub file available for Go. For other languages, you use a proto file to create a stub file that you can use to develop the gRPC server code.

* Using Go: Use the functions and data structures in the stub file: [service.pb.go](https://github.com/kubernetes/kubernetes/blob/master/staging/src/k8s.io/apiserver/pkg/storage/value/encrypt/envelope/v1beta1/service.pb.go) to develop the gRPC server code 

* Using languages other than Go: Use the protoc compiler with the proto file: [service.proto](https://github.com/kubernetes/kubernetes/blob/master/staging/src/k8s.io/apiserver/pkg/storage/value/encrypt/envelope/v1beta1/service.proto) to generate a stub file for the specific language

Then use the functions and data structures in the stub file to develop the server code.

**Notes:**

* kms plugin version: `v1beta1`

In response to procedure call Version, a compatible KMS plugin should return v1beta1 as VersionResponse.version

* message version: `v1beta1`

All messages from KMS provider have the version field set to current version v1beta1

* protocol: UNIX domain socket (`unix`)

The gRPC server should listen at UNIX domain socket

### Integrating a KMS plugin with the remote KMS
The KMS plugin can communicate with the remote KMS using any protocol supported by the KMS.
All configuration data, including authentication credentials the KMS plugin uses to communicate with the remote KMS, 
are stored and managed by the KMS plugin independently. The KMS plugin can encode the ciphertext with additional metadata that may be required before sending it to the KMS for decryption.

### Deploying the KMS plugin 
Ensure that the KMS plugin runs on the same host(s) as the Kubernetes master(s).

## Encrypting your data with the KMS provider
To encrypt the data:

1. Create a new encryption configuration file using the appropriate properties for the `kms` provider:

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
resources:
  - resources:
    - secrets
    providers:
    - kms:
        name: myKmsPlugin
        endpoint: unix:///tmp/socketfile.sock
        cachesize: 100
        timeout: 3s
    - identity: {}
```

2. Set the `--encryption-provider-config` flag on the kube-apiserver to point to the location of the configuration file.
3. Restart your API server.

Note:
The alpha version of the encryption feature prior to 1.13 required a config file with
`kind: EncryptionConfig` and `apiVersion: v1`, and used the `--experimental-encryption-provider-config` flag.

## Verifying that the data is encrypted
Data is encrypted when written to etcd. After restarting your kube-apiserver, any newly created or updated secret should be encrypted when stored. To verify, you can use the etcdctl command line program to retrieve the contents of your secret.

1. Create a new secret called secret1 in the default namespace:
```
kubectl create secret generic secret1 -n default --from-literal=mykey=mydata
```
2. Using the etcdctl command line, read that secret out of etcd:
```
ETCDCTL_API=3 etcdctl get /kubernetes.io/secrets/default/secret1 [...] | hexdump -C
```
 where `[...]` must be the additional arguments for connecting to the etcd server.

3. Verify the stored secret is prefixed with `k8s:enc:kms:v1:`, which indicates that the `kms` provider has encrypted the resulting data.

4. Verify that the secret is correctly decrypted when retrieved via the API:
```
kubectl describe secret secret1 -n default
```
should match `mykey: mydata`

## Ensuring all secrets are encrypted
Because secrets are encrypted on write, performing an update on a secret encrypts that content.

The following command reads all secrets and then updates them to apply server side encryption. If an error occurs due to a conflicting write, retry the command. For larger clusters, you may wish to subdivide the secrets by namespace or script an update.
```
kubectl get secrets --all-namespaces -o json | kubectl replace -f -
```

## Switching from a local encryption provider to the KMS provider
To switch from a local encryption provider to the `kms` provider and re-encrypt all of the secrets:

1. Add the `kms` provider as the first entry in the configuration file as shown in the following example.

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
resources:
  - resources:
    - secrets
    providers:
    - kms:
        name : myKmsPlugin
        endpoint: unix:///tmp/socketfile.sock
        cachesize: 100
    - aescbc:
         keys:
         - name: key1
           secret: <BASE 64 ENCODED SECRET>
```

2. Restart all kube-apiserver processes.

3. Run the following command to force all secrets to be re-encrypted using the `kms` provider.

```
kubectl get secrets --all-namespaces -o json| kubectl replace -f -
```

## Disabling encryption at rest
To disable encryption at rest:

1. Place the `identity` provider as the first entry in the configuration file: 

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
resources:
  - resources:
    - secrets
    providers:
    - identity: {}
    - kms:
        name : myKmsPlugin
        endpoint: unix:///tmp/socketfile.sock
        cachesize: 100
```
2.  Restart all kube-apiserver processes. 
3. Run the following command to force all secrets to be decrypted.
```
kubectl get secrets --all-namespaces -o json | kubectl replace -f -
```
{{% /capture %}}


