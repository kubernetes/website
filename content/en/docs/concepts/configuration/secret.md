---
reviewers:
- mikedanese
title: Secrets
content_type: concept
feature:
  title: Secret and configuration management
  description: >
    Deploy and update secrets and application configuration without rebuilding your image
    and without exposing secrets in your stack configuration.
weight: 30
---

<!-- overview -->

A Secret is an object that contains a small amount of sensitive data such as
a password, a token, or a key. Such information might otherwise be put in a
{{< glossary_tooltip term_id="pod" >}} specification or in a
{{< glossary_tooltip text="container image" term_id="image" >}}. Using a
Secret means that you don't need to include confidential data in your
application code.

Secrets are similar to {{< glossary_tooltip text="ConfigMaps" term_id="configmap" >}}
but are specifically intended to hold confidential data.

<!-- body -->

## When to use Secrets {#use-cases}

Use Secrets to separate sensitive data used by your applications from the application code. Because Secrets can be created independently of the Pods that use them, there is less risk of the Secret (and its data) being exposed during the workflow of creating, viewing, and editing Pods. Kubernetes, and applications that run in your cluster, can also take additional precautions with Secrets, such as avoiding writing secret data to nonvolatile storage.

Some common use cases for Secrets include:

* Store SSH keys that Pods can use to establish SSH connections
* Store credentials for multiple environments to simplify Pod manifests
* Store service account tokens that your Pods can use to authenticate to the API
  server
* Distribute credentials to access private image registries
* Store certificates and keys for TLS
  
## How to consume Secrets {#consume-secrets}

Pods can use Secrets in one of the following ways:

*  As [files in a volume](/docs/tasks/inject-data-application/distribute-credentials-secure/#create-a-pod-that-has-access-to-the-secret-data-through-a-volume) that is mounted to one or more containers.
*  As an [environment variable](/docs/tasks/inject-data-application/distribute-credentials-secure/#define-container-environment-variables-using-secret-data).
*  As a list of Secrets in an [image pull Secret](/docs/tasks/configure-pod-container/pull-image-private-registry/) that's passed to the kubelet.

## Types of Secrets

When creating a Secret, you can specify its *type* using the `type` field of the [Secret resource](/docs/reference/kubernetes-api/config-and-storage-resources/secret-v1/), or equivalent `kubectl` flags, if available. Kubernetes uses the Secret type to facilitate programmatic handling of the Secret data.

Kubernetes provides the following built-in Secret types for common use cases.
These built-in types vary in terms of the validations performed and the
constraints placed on each type.

| Type                                  | Usage                                                                                              |
| ------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `Opaque`                              | arbitrary user-defined data                                                                        |
| `kubernetes.io/service-account-token` | [Service account token](/docs/reference/access-authn-authz/authentication/#service-account-tokens) |
| `kubernetes.io/dockercfg`             | serialized `~/.dockercfg` file                                                                     |
| `kubernetes.io/dockerconfigjson`      | serialized `~/.docker/config.json` file                                                            |
| `kubernetes.io/basic-auth`            | credentials for basic authentication                                                               |
| `kubernetes.io/ssh-auth`              | credentials for SSH authentication                                                                 |
| `kubernetes.io/tls`                   | data for a TLS client or server                                                                    |
| `bootstrap.kubernetes.io/token`       | bootstrap token data                                                                               |

In addition to these built-in types, you can define your own Secret type by
assigning any string value in the `type` field for the Secret object. If you
don't specify a value for the `type` field, Kubernetes treats it as the `Opaque`
type. Kubernetes doesn't place any constraints on custom types. However, if
you're using one of the built-in types, you must meet all the requirements for
that type.

As a best practice when defining Secret types for public use, structure the type
name to contain your domain name before the type name, such as
`example.com/type-name`.

### Opaque Secrets

`type: Opaque`

`Opaque` is the default Secret type if you don't specify a type in the Secret
configuration file. If you create a Secret using the `kubectl` command-line
tool, use the `generic` subcommand to indicate the `Opaque` secret type.

### Service account token Secrets

`type: kubernetes.io/service-account-token`

The service account token Secret type stores a token credential that identifies
a Kubernetes {{< glossary_tooltip text="service account"
term_id="service-account" >}}. In Kubernetes v1.22 and later, Kubernetes no
longer uses this type of Secret to mount credentials into Pods. Instead, the
recommended method is to obtain tokens using the [`TokenRequest`
API](/docs/reference/kubernetes-api/authentication-resources/token-request-v1/).

Tokens that you obtain from the `TokenRequest` API have a bounded lifetime and
cannot be read by other API clients. These characteristics make them more secure
than tokens stored in Secret objects. To get a token from the `TokenRequest`
API, run the [`kubectl create
token`](/docs/reference/generated/kubectl/kubectl-commands#-em-token-em-)
command. 

You should only create a service account token Secret object
if you can't use the `TokenRequest` API to obtain a token,
and the security exposure of persisting a non-expiring token credential
in a readable API object is acceptable to you.

To use a service account token Secret, set the
`kubernetes.io/service-account.name` annotation in the `Secret` object to the name of an existing
service account. If you need a new service account, create the `ServiceAccount`
object *before* the `Secret` object.

After you create the `Secret` object, a Kubernetes {{< glossary_tooltip text="controller"
term_id="controller" >}} populates the Secret with other information such as the
`kubernetes.io/service-account.uid` annotation, and the
`token` key in the `data` field, which is populated with an authentication token.

When you create a `Pod`, you can mount the service account token Secret as a
volume in the Pod manifest. However, this approach creates long-lived Secrets
that can be read by other API clients.

For more information:

  * See the
    [ServiceAccount](/docs/tasks/configure-pod-container/configure-service-account/)
    documentation for more information on how service accounts work.
  * Check the `automountServiceAccountToken` field and the `serviceAccountName`
    field of the [`Pod`](/docs/reference/generated/kubernetes-api/{{< param
    "version" >}}/#pod-v1-core) for information on referencing service accounts from Pods.

### Docker config Secrets

Docker config Secrets store credentials that you can use to access a container
image registry. You can use the following values for `type`:

  * `type: kubernetes.io/dockercfg`: Store a serialized `~/.dockercfg`, which is
    the legacy format for configuring the Docker command line. To use this
    Secret type, set the `data` field of the `Secret` object to a `.dockercfg`
    key with a value that is the base64-encoded contents of a `~/.dockercfg`
    file.
  * `type: kubernetes.io/dockerconfigjson`: Store a serialized JSON that has the
    same format rules as the `~/.docker/config.json` file, which is a new format
    for `~/.dockercfg`. To use this Secret type, set the `data` field of the
    `Secret` object to a `.dockerconfigjson` key with a value that is the base64-encoded contents of a `~/.docker/config.json` file.

For example, the following manifest creates a `kubernetes.io/dockerconfigjson` Secret:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: secret-dockerconfigjson
type: kubernetes.io/dockerconfigjson
data:
  .dockerconfigjson: |
    "<base64 encoded ~/.docker/config.json file>"
```
Optionally, you can use the `stringData` field instead of the `data` field to
provide values in unencoded clear text.

When you create these types of Secrets using a manifest, the API
server checks whether the expected key exists in the `data` field, and
verifies if the value provided can be parsed as a valid JSON. The API
server doesn't validate if the JSON actually is a Docker config file.

For instructions on how to use a Docker config Secret, refer to [Pull an Image
from a Private Registry](/docs/tasks/configure-pod-container/pull-image-private-registry/).

### Basic authentication Secrets

`type: kubernetes.io/basic-auth`

Basic authentication Secrets store the credentials needed for basic
authentication with a username and password. The `kubernetes.io/basic-auth` type
is provided for convenience. You can use an opaque Secret type to store the same
credentials. However, using the defined, public type lets other people know the
purpose of the Secret, and sets a convention for what key names to expect.
The Kubernetes API verifies that the required keys are set for a Secret
of this type.

To create a basic authentication Secret type, set the `data` field of the
`Secret` object to at least one of the following keys:

- `username`: the user name for authentication
- `password`: the password or token for authentication

Both values for the above two keys must be base64 encoded strings. You can also
provide unencoded content using the `stringData` field.

The following manifest is an example of a basic authentication Secret:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: secret-basic-auth
type: kubernetes.io/basic-auth
data:
  username: YWRtaW4=
  password: dDBwLVNlY3JldA==
```
Optionally, you can use the `stringData` field instead of the `data` field to
provide values in unencoded clear text.

### SSH authentication Secrets

`type: kubernetes.io/ssh-auth`

SSH authentication Secrets store credentials used for SSH authentication. This
Secret type is available for convenience. You can use an opaque Secret type to
store the same credentials. However, using the defined, public type lets other
people know the purpose of the Secret, and sets a convention for what key names
to expect. The Kubernetes API verifies that the required keys are set for a
Secret of this type.

To use an SSH authentication Secret type, set the `data` field of the `Secret`
object to the `ssh-privatekey` key, with a value that is the base64 encoded
content of the private key.

The following manifest is an example of an SSH authentication Secret:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: secret-ssh-auth
type: kubernetes.io/ssh-auth
data:
  # the data is abbreviated in this example
  ssh-privatekey: |
     MIIEpQIBAAKCAQEAulqb/Y ...
```
Optionally, you can use the `stringData` field instead of the `data` field to
provide values in unencoded clear text.

{{< caution >}}
SSH private keys do not establish trusted communication between an SSH client and
host server on their own. A secondary means of establishing trust is needed to
mitigate "man in the middle" attacks, such as a `known_hosts` file added to a
ConfigMap.
{{< /caution >}}

### TLS Secrets

`type: kubernetes.io/tls`

TLS Secrets store a certificate and the associated key, typically used for
[TLS](/docs/tasks/tls/managing-tls-in-a-cluster/). Common use cases for TLS
Secrets include configuring encryption in-transit for resources such as an
[Ingress](/docs/concepts/services-networking/ingress/), as well as other
resources or workloads. The API server doesn't validate the values in the
key-value pairs.

This Secret type is available for convenience. You can use an opaque Secret type
to store the same credentials. However, using the defined, public type lets
other people know the purpose of the Secret, and sets a convention for what key
names to expect.

To use a TLS Secret type, set the `data` field of the `Secret` object to the
following key-value pairs:

  * `tls.crt` key: takes a value that is the base64 encoded contents of the
    `.crt` certificate file.
  * `tls.key` key: takes a value that is the base64 encoded contents of the
    `.key` associated private key file.

The values that you provide in the `data` field must be the base64-encoded
values for the public/private key pair. This data must be the same as in PEM,
without the first and last lines in PEM. For example, for a certificate, do not
include the `--------BEGIN CERTIFICATE-----` and `-------END CERTIFICATE----`
lines.

The following manifest is an example of a TLS Secret:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: secret-tls
type: kubernetes.io/tls
data:
  # the data is abbreviated in this example
  tls.crt: |
    MIIC2DCCAcCgAwIBAgIBATANBgkqh ...
  tls.key: |
    MIIEpgIBAAKCAQEA7yn3bRHQ5FHMQ ...
```
Optionally, you can use the `stringData` field instead of the `data` field to
provide values in unencoded clear text.

You can also create a TLS Secret in the command line using the [`kubectl create
secret
tls`](/docs/reference/generated/kubectl/kubectl-commands#-em-secret-tls-em-)
subcommand and providing the public/private key pair. Both files must be .PEM-encoded. The public key
certificate must be in DER format as described in [Section 5.1 of RFC
7468](https://datatracker.ietf.org/doc/html/rfc7468#section-5.1). The public
certificate must match the private key, which must be PKCS #8 in DER format as
described in [Section 11 of RFC 7468](https://datatracker.ietf.org/doc/html/rfc7468#section-11).

### Bootstrap token Secrets

`type: bootstrap.kubernetes.io/token`

Bootstrap token Secrets store token credentials used during the node bootstrap
process. Kubernetes uses these tokens to sign well-known ConfigMaps. Bootstrap
token Secrets are usually created in the `kube-system` namespace with the naming
format `bootstrap-token-<token-id>`, where `<token-id>` is a six-character
string with the token's ID.

To use a bootstrap token Secret, set the following key-value pairs in the `data`
field of the `Secret` object:

  * `token-id`: a random six-character string as the token identifier. Required.
  * `token-secret`: a random 16-character string as the actual token secret. Required.
  * `expiration`: an absolute time value in UTC using
    [RFC3339](https://datatracker.ietf.org/doc/html/rfc3339) that specifies when
    the token should expire. Optional.
  * `usage-bootstrap-authetication`: a boolean flag indicating that the token can
  be used as a bearer token to authenticate to the API server.
  * `usage-bootstrap-signing`: a boolean flag indicating that the token can be
    used to sign well-known ConfigMaps.
  * `description`: a human-readable description of the token purpose. Optional.

The following manifest is an example of a bootstrap token Secret:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: bootstrap-token-5emitj
  namespace: kube-system
type: bootstrap.kubernetes.io/token
data:
  auth-extra-groups: c3lzdGVtOmJvb3RzdHJhcHBlcnM6a3ViZWFkbTpkZWZhdWx0LW5vZGUtdG9rZW4=
  expiration: MjAyMC0wOS0xM1QwNDozOToxMFo=
  token-id: NWVtaXRq
  token-secret: a3E0Z2lodnN6emduMXAwcg==
  usage-bootstrap-authentication: dHJ1ZQ==
  usage-bootstrap-signing: dHJ1ZQ==
```
Optionally, you can use the `stringData` field instead of the `data` field to
specify values in unencoded clear text format.

For instructions on how to use boostrap tokens to authenticate and to sign
objects, refer to [Authenticating with Bootstrap
Tokens](https://kubernetes.io/docs/reference/access-authn-authz/bootstrap-tokens/).

## Immutable Secrets {#secret-immutable}

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

Kubernetes lets you mark Secrets of any type (and ConfigMaps) as *immutable*.
This prevents changes to the data in the Secret, which has benefits such as the following:

* Protects you from accidental or unwanted updates that could cause application outages
* Improves performance in clusters that use tens of thousands of Secrets. The
  kubelet doesn't need to
  [watch](/docs/reference/using-api/api-concepts/#efficient-detection-of-changes)
  immutable Secrets, which reduces the load on the API server.

To mark a new or existing Secret as immutable, set the `immutable` field in the `Secret` object
to `"true"`.

```yaml
apiVersion: v1
kind: Secret
metadata:
  ...
data:
  ...
immutable: "true"
```

Marking a Secret or a ConfigMap object as immutable is a permanent change. You
can never change the `data` in the `Secret` object. If you want to update the
contents of the Secret, you must delete and recreate the Secret. If the original
Secret was mounted to existing Pods, you should recreate those Pods.

## Information security for Secrets

Although ConfigMaps and Secrets work similarly, Kubernetes applies some
additional protections to Secret objects.

Secrets often hold values that span a spectrum of importance. Many of these
values can cause escalations within Kubernetes and to external systems. Even if
an individual app can reason about the power of the Secrets it expects to
interact with, other apps within the same namespace can render those assumptions invalid.

A Secret is only sent to a node if a Pod on that node requires it.
For mounting secrets into Pods, the kubelet stores a copy of the data into a
`tmpfs` so that the confidential data is not written to durable storage.
When the Pod that depends on the Secret is deleted, the kubelet deletes its
local copy of the confidential data from the Secret.

There may be several containers in a Pod. By default, containers you define
only have access to the default `ServiceAccount` object and its related Secret.
To provide access to other Secret objects, you must explicitly map those objects
to your containers.

There may be Secrets for several Pods on the same node. However, only the
Secrets that a Pod requests are potentially visible within its containers.
One Pod does not have access to the Secrets of another Pod.

{{< warning >}}
Any privileged containers on a node might have access to all Secrets used
on that node.
{{< /warning >}}

For guidelines to manage and improve the security of your Secrets, refer to
[Good practices for Kubernetes
Secrets](/docs/concepts/security/secrets-good-practices).

## Limitations of Secrets {#limitations}

If you plan to use Secrets to store sensitive data in your clusters, consider
the following limitations:

*  By default, Secrets are stored unencrypted in {{<glossary_tooltip
   text="`etcd`" term_id="etcd">}}. Anyone with access to the API or to `etcd`
   can retrieve or modify a Secret.
*  Anyone who is authorized to create a Pod in a namespace can use the Pod to
   read the contents of any Secret in that namespace. This authorization
   includes indirect access, such as the ability to create Deployments.

Cluster administrators and developers can take measures to improve the security
of a cluster's Secrets. For guidance, refer to [Good practices for
Secrets](TBD). You can also use a variety of alternatives to the default Secrets
implementation.

### Alternatives to Secrets {#alternatives-to-secrets}

Consider the following alternatives to Secrets, based on your use case:

*  Use a service account and bearer tokens to authenticate between applications
   in the same cluster.
*  Use third-party Secret management tools that run inside or outside the
   cluster. For example, a service that reveals a Secret to Pods that
   authenticate to the service over HTTPS.
*  Implement a custom certificate authority and use
   [CertificateSigningRequests](/docs/reference/access-authn-authz/certificate-signing-requests/)
   to let the custom signer issue certificates to Pods.
*  Use a [device
   plugin](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
   to expose node-local encryption hardware to a specific Pod. For example, you
   can schedule trusted Pods onto nodes that provide a Trusted Platform Module,
   configured out-of-band.
   
You can also combine two or more of those options, including the option to use Secret objects themselves.

For example, you can implement or deploy an operator that fetches short-lived
session tokens from an external service, and then creates Secrets based on those
short-lived session tokens. Pods running in your cluster can use the session
tokens, and the operator ensures that the tokens are valid. This separation
means that you can run Pods that are unaware of the exact mechanisms for issuing
and refreshing those session tokens.

## {{% heading "whatsnext" %}}

- Read the [Best practices for Kubernetes Secrets](/docs/concepts/security/secrets-good-practices)
- Learn how to [manage Secrets using `kubectl`](/docs/tasks/configmap-secret/managing-secret-using-kubectl/)
- Learn how to [manage Secrets using config file](/docs/tasks/configmap-secret/managing-secret-using-config-file/)
- Learn how to [manage Secrets using kustomize](/docs/tasks/configmap-secret/managing-secret-using-kustomize/)
- Read the [API reference](/docs/reference/kubernetes-api/config-and-storage-resources/secret-v1/) for `Secret`
