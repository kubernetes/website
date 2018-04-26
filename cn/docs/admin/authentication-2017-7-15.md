---
assignees:
- erictune
- lavalamp
- ericchiang
- deads2k
- liggitt
title: Authenticating
---

* TOC
{:toc}

## Users in Kubernetes

All Kubernetes clusters have two categories of users: service accounts managed
by Kubernetes, and normal users.

Normal users are assumed to be managed by an outside, independent service. An
admin distributing private keys, a user store like Keystone or Google Accounts,
even a file with a list of usernames and passwords. In this regard, _Kubernetes
does not have objects which represent normal user accounts._ Regular users
cannot be added to a cluster through an API call.

In contrast, service accounts are users managed by the Kubernetes API. They are
bound to specific namespaces, and created automatically by the API server or
manually through API calls. Service accounts are tied to a set of credentials
stored as `Secrets`, which are mounted into pods allowing in cluster processes
to talk to the Kubernetes API.

API requests are tied to either a normal user or a service account, or are treated
as anonymous requests. This means every process inside or outside the cluster, from
a human user typing `kubectl` on a workstation, to `kubelets` on nodes, to members
of the control plane, must authenticate when making requests to the API server,
or be treated as an anonymous user.

## Authentication strategies

Kubernetes uses client certificates, bearer tokens, an authenticating proxy, or HTTP basic auth to
authenticate API requests through authentication plugins. As HTTP requests are
made to the API server, plugins attempt to associate the following attributes
with the request:

* Username: a string which identifies the end user. Common values might be `kube-admin` or `jane@example.com`.
* UID: a string which identifies the end user and attempts to be more consistent and unique than username.
* Groups: a set of strings which associate users with as set of commonly grouped users.
* Extra fields: a map of strings to list of strings which holds additional information authorizers may find useful.

All values are opaque to the authentication system and only hold significance
when interpreted by an [authorizer](/docs/admin/authorization/).

You can enable multiple authentication methods at once. You should usually use at least two methods:

 - service account tokens for service accounts
 - at least one other method for user authentication.

When multiple authenticator modules are enabled, the first module
to successfully authenticate the request short-circuits evaluation.
The API server does not guarantee the order authenticators run in.

The `system:authenticated` group is included in the list of groups for all authenticated users.

### X509 Client Certs

Client certificate authentication is enabled by passing the `--client-ca-file=SOMEFILE`
option to API server. The referenced file must contain one or more certificates authorities
to use to validate client certificates presented to the API server. If a client certificate
is presented and verified, the common name of the subject is used as the user name for the
request. As of Kubernetes 1.4, client certificates can also indicate a user's group memberships
using the certificate's organization fields. To include multiple group memberships for a user,
include multiple organization fields in the certificate.

For example, using the `openssl` command line tool to generate a certificate signing request:

``` bash
openssl req -new -key jbeda.pem -out jbeda-csr.pem -subj "/CN=jbeda/O=app1/O=app2"
```

This would create a CSR for the username "jbeda", belonging to two groups, "app1" and "app2".

See [APPENDIX](#appendix) for how to generate a client cert.

### Static Token File

The API server reads bearer tokens from a file when given the `--token-auth-file=SOMEFILE` option on the command line.  Currently, tokens last indefinitely, and the token list cannot be
changed without restarting API server.

The token file is a csv file with a minimum of 3 columns: token, user name, user uid,
followed by optional group names. Note, if you have more than one group the column must be
double quoted e.g.

```conf
token,user,uid,"group1,group2,group3"
```

#### Putting a Bearer Token in a Request

When using bearer token authentication from an http client, the API
server expects an `Authorization` header with a value of `Bearer
THETOKEN`.  The bearer token must be a character sequence that can be
put in an HTTP header value using no more than the encoding and
quoting facilities of HTTP.  For example: if the bearer token is
`31ada4fd-adec-460c-809a-9e56ceb75269` then it would appear in an HTTP
header as shown below.

```http
Authorization: Bearer 31ada4fd-adec-460c-809a-9e56ceb75269
```

### Bootstrap Tokens

This feature is currently in **alpha**.

To allow for streamlined bootstrapping for new clusters, Kubernetes includes a
dynamically-managed Bearer token type called a *Bootstrap Token*. These tokens
are stored as Secrets in the `kube-system` namespace, where they can be
dynamically managed and created. Controller Manager contains a TokenCleaner
controller that deletes bootstrap tokens as they expire.

The tokens are of the form `[a-z0-9]{6}.[a-z0-9]{16}`.  The first component is a
Token ID and the second component is the Token Secret.  You specify the token
in an HTTP header as follows:

```http
Authorization: Bearer 781292.db7bc3a58fc5f07e
```

You must enable the Bootstrap Token Authenticator with the
`--experimental-bootstrap-token-auth` flag on the API Server.  You must enable
the TokenCleaner controller via the `--controllers` flag on the Controller
Manager.  This is done with something like `--controllers=*,tokencleaner`.
`kubeadm` will do this for you if you are using it to bootstrapping a cluster.

The authenticator authenticates as `system:bootstrap:<Token ID>`.  It is
included in the `system:bootstrappers` group.  The naming and groups are
intentionally limited to discourage users from using these tokens past
bootstrapping.  The user names and group can be used (and are used by `kubeadm`)
to craft the appropriate authorization policies to support bootstrapping a
cluster.

Please see [Bootstrap Tokens](/docs/admin/bootstrap-tokens/) for in depth
documentation on the Bootstrap Token authenticator and controllers along with
how to manage these tokens with `kubeadm`.

### Static Password File

Basic authentication is enabled by passing the `--basic-auth-file=SOMEFILE`
option to API server. Currently, the basic auth credentials last indefinitely,
and the password cannot be changed without restarting API server. Note that basic
authentication is currently supported for convenience while we finish making the
more secure modes described above easier to use.

The basic auth file is a csv file with a minimum of 3 columns: password, user name, user id.
In Kubernetes version 1.6 and later, you can specify an optional fourth column containing
comma-separated group names. If you have more than one group, you must enclose the fourth
column value in double quotes ("). See the following example:

```conf
password,user,uid,"group1,group2,group3"
```

When using basic authentication from an http client, the API server expects an `Authorization` header
with a value of `Basic BASE64ENCODED(USER:PASSWORD)`.

### Service Account Tokens

Service accounts are an automatically enabled authenticator that uses signed
bearer tokens to verify requests. The plugin takes two optional flags:

* `--service-account-key-file` A file containing a PEM encoded key for signing bearer tokens.
If unspecified, the API server's TLS private key will be used.
* `--service-account-lookup` If enabled, tokens which are deleted from the API will be revoked.

Service accounts are usually created automatically by the API server and
associated with pods running in the cluster through the `ServiceAccount`
[Admission Controller](/docs/admin/admission-controllers/). Bearer tokens are
mounted into pods at well known locations, and allow in cluster processes to
talk to the API server. Accounts may be explicitly associated with pods using the
`serviceAccountName` field of a `PodSpec`.

NOTE: `serviceAccountName` is usually omitted because this is done automatically.

```
apiVersion: apps/v1beta1
kind: Deployment
metadata:
  name: nginx-deployment
  namespace: default
spec:
  replicas: 3
  template:
    metadata:
    # ...
    spec:
      containers:
      - name: nginx
        image: nginx:1.7.9
        serviceAccountName: bob-the-bot
```

Service account bearer tokens are perfectly valid to use outside the cluster and
can be used to create identities for long standing jobs that wish to talk to the
Kubernetes API. To manually create a service account, simply use the `kubectl
create serviceaccount (NAME)` command. This creates a service account in the
current namespace and an associated secret.

```
$ kubectl create serviceaccount jenkins
serviceaccount "jenkins" created
$ kubectl get serviceaccounts jenkins -o yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  # ...
secrets:
- name: jenkins-token-1yvwg
```

The created secret holds the public CA of the API server and a signed JSON Web
Token (JWT).

```
$ kubectl get secret jenkins-token-1yvwg -o yaml
apiVersion: v1
data:
  ca.crt: (APISERVER'S CA BASE64 ENCODED)
  token: (BEARER TOKEN BASE64 ENCODED)
kind: Secret
metadata:
  # ...
type: kubernetes.io/service-account-token
```

Note: values are base64 encoded because secrets are always base64 encoded.

The signed JWT can be used as a bearer token to authenticate as the given service
account. See [above](#putting-a-bearer-token-in-a-request) for how the token is included
in a request.  Normally these secrets are mounted into pods for in-cluster access to
the API server, but can be used from outside the cluster as well.

Service accounts authenticate with the username `system:serviceaccount:(NAMESPACE):(SERVICEACCOUNT)`,
and are assigned to the groups `system:serviceaccounts` and `system:serviceaccounts:(NAMESPACE)`.

WARNING: Because service account tokens are stored in secrets, any user with
read access to those secrets can authenticate as the service account. Be cautious
when granting permissions to service accounts and read capabilities for secrets.

### OpenID Connect Tokens

[OpenID Connect](https://openid.net/connect/) is a flavor of OAuth2 supported by
some OAuth2 providers, notably Azure Active Directory, Salesforce, and Google.
The protocol's main extension of OAuth2 is an additional field returned with
the access token called an [ID Token](https://openid.net/specs/openid-connect-core-1_0.html#IDToken).
This token is a JSON Web Token (JWT) with well known fields, such as a user's
email, signed by the server.

To identify the user, the authenticator uses the `id_token` (not the `access_token`)
from the OAuth2 [token response](https://openid.net/specs/openid-connect-core-1_0.html#TokenResponse)
as a bearer token.  See [above](#putting-a-bearer-token-in-a-request) for how the token
is included in a request.

![Kubernetes OpenID Connect Flow](/images/docs/admin/k8s_oidc_login.svg)

1.  Login to your identity provider
2.  Your identity provider will provide you with an `access_token`, `id_token` and a `refresh_token`
3.  When using `kubectl`, use your `id_token` with the `--token` flag or add it directly to your `kubeconfig`
4.  `kubectl` sends your `id_token` in a header called Authorization to the API server
5.  The API server will make sure the JWT signature is valid by checking against the certificate named in the configuration
6.  Check to make sure the `id_token` hasn't expired
7.  Make sure the user is authorized
8.  Once authorized the API server returns a response to `kubectl`
9.  `kubectl` provides feedback to the user

Since all of the data needed to validate who you are is in the `id_token`, Kubernetes doesn't need to
"phone home" to the identity provider.  In a model where every request is stateless this provides a very scalable
solution for authentication.  It does offer a few challenges:

1.  Kubernetes has no "web interface" to trigger the authentication process.  There is no browser or interface to collect credentials which is why you need to authenticate to your identity provider first.
2.  The `id_token` can't be revoked, its like a certificate so it should be short-lived (only a few minutes) so it can be very annoying to have to get a new token every few minutes
3.  There's no easy way to authenticate to the Kubernetes dashboard without using the `kubectl -proxy` command or a reverse proxy that injects the `id_token`


#### Configuring the API Server

To enable the plugin, configure the following flags on the API server:

| Parameter | Description | Example | Required |
| --------- | ----------- | ------- | ------- |
| `--oidc-issuer-url` | URL of the provider which allows the API server to discover public signing keys. Only URLs which use the `https://` scheme are accepted.  This is typically the provider's discovery URL without a path, for example "https://accounts.google.com" or "https://login.salesforce.com".  This URL should point to the level below .well-known/openid-configuration | If the discovery URL is https://accounts.google.com/.well-known/openid-configuration the value should be https://accounts.google.com | Yes |
| `--oidc-client-id` |  A client id that all tokens must be issued for. | kubernetes | Yes |
| `--oidc-username-claim` | JWT claim to use as the user name. By default `sub`, which is expected to be a unique identifier of the end user. Admins can choose other claims, such as `email` or `name`, depending on their provider. However, claims other than `email` will be prefixed with the issuer URL to prevent naming clashes with other plugins. | sub | No |
| `--oidc-groups-claim` | JWT claim to use as the user's group. If the claim is present it must be an array of strings. | groups | No |
| `--oidc-ca-file` | The path to the certificate for the CA that signed your identity provider's web certificate.  Defaults to the host's root CAs. | `/etc/kubernetes/ssl/kc-ca.pem` | No |

If a claim other than `email` is chosen for `--oidc-username-claim`, the value
will be prefixed with the `--oidc-issuer-url` to prevent clashes with existing
Kubernetes names (such as the `system:` users). For example, if the provider
URL is `https://accounts.google.com` and the username claim maps to `jane`, the
plugin will authenticate the user as:

```
https://accounts.google.com#jane
```

Importantly, the API server is not an OAuth2 client, rather it can only be
configured to trust a single issuer. This allows the use of public providers,
such as Google, without trusting credentials issued to third parties. Admins who
wish to utilize multiple OAuth clients should explore providers which support the
`azp` (authorized party) claim, a mechanism for allowing one client to issue
tokens on behalf of another.

Kubernetes does not provide an OpenID Connect Identity Provider.
You can use an existing public OpenID Connect Identity Provider (such as Google, or [others](http://connect2id.com/products/nimbus-oauth-openid-connect-sdk/openid-connect-providers)).
Or, you can run your own Identity Provider, such as CoreOS [dex](https://github.com/coreos/dex), [Keycloak](https://github.com/keycloak/keycloak), CloudFoundry [UAA](https://github.com/cloudfoundry/uaa), or Tremolo Security's [OpenUnison](https://github.com/tremolosecurity/openunison).

For an identity provider to work with Kubernetes it must:

1.  Support [OpenID connect discovery](https://openid.net/specs/openid-connect-discovery-1_0.html); not all do.
2.  Run in TLS with non-obsolete ciphers
3.  Have a CA signed certificate (even if the CA is not a commercial CA or is self signed)

A note about requirement #3 above, requiring a CA signed certificate.  If you deploy your own identity provider (as opposed to one of the cloud providers like Google or Microsoft) you MUST have your identity provider's web server certificate signed by a certificate with the `CA` flag set to `TRUE`, even if it is self signed.  This is due to GoLang's TLS client implementation being very strict to the standards around certificate validation.  If you don't have a CA handy, you can use this script from the CoreOS team to create a simple CA and a signed certificate and key pair - https://github.com/coreos/dex/blob/1ee5920c54f5926d6468d2607c728b71cfe98092/examples/k8s/gencert.sh or this script based on it that will generate SHA256 certs with a longer life and larger key size https://raw.githubusercontent.com/TremoloSecurity/openunison-qs-kubernetes/master/makecerts.sh.

Setup instructions for specific systems:

- [UAA](http://apigee.com/about/blog/engineering/kubernetes-authentication-enterprise)
- [Dex](https://speakerdeck.com/ericchiang/kubernetes-access-control-with-dex)
- [OpenUnison](https://github.com/TremoloSecurity/openunison-qs-kubernetes)

#### Using kubectl

##### Option 1 - OIDC Authenticator

The first option is to use the `oidc` authenticator.  This authenticator takes your `id_token`, `refresh_token` and your OIDC `client_secret` and will refresh your token automatically.  Once you have authenticated to your identity provider:

```bash
kubectl config set-credentials USER_NAME \
   --auth-provider=oidc \
   --auth-provider-arg=idp-issuer-url=( issuer url ) \
   --auth-provider-arg=client-id=( your client id ) \
   --auth-provider-arg=client-secret=( your client secret ) \
   --auth-provider-arg=refresh-token=( your refresh token ) \
   --auth-provider-arg=idp-certificate-authority=( path to your ca certificate ) \
   --auth-provider-arg=id-token=( your id_token ) \
   --auth-provider-arg=extra-scopes=( comma separated list of scopes to add to "openid email profile", optional )
```

As an example, running the below command after authenticating to your identity provider:

```bash
kubectl config set-credentials mmosley  \
        --auth-provider=oidc  \
        --auth-provider-arg=idp-issuer-url=https://oidcidp.tremolo.lan:8443/auth/idp/OidcIdP  \
        --auth-provider-arg=client-id=kubernetes  \
        --auth-provider-arg=client-secret=1db158f6-177d-4d9c-8a8b-d36869918ec5  \
        --auth-provider-arg=refresh-token=q1bKLFOyUiosTfawzA93TzZIDzH2TNa2SMm0zEiPKTUwME6BkEo6Sql5yUWVBSWpKUGphaWpxSVAfekBOZbBhaEW+VlFUeVRGcluyVF5JT4+haZmPsluFoFu5XkpXk5BXqHega4GAXlF+ma+vmYpFcHe5eZR+slBFpZKtQA= \
        --auth-provider-arg=idp-certificate-authority=/root/ca.pem \
        --auth-provider-arg=extra-scopes=groups \
        --auth-provider-arg=id-token=eyJraWQiOiJDTj1vaWRjaWRwLnRyZW1vbG8ubGFuLCBPVT1EZW1vLCBPPVRybWVvbG8gU2VjdXJpdHksIEw9QXJsaW5ndG9uLCBTVD1WaXJnaW5pYSwgQz1VUy1DTj1rdWJlLWNhLTEyMDIxNDc5MjEwMzYwNzMyMTUyIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL29pZGNpZHAudHJlbW9sby5sYW46ODQ0My9hdXRoL2lkcC9PaWRjSWRQIiwiYXVkIjoia3ViZXJuZXRlcyIsImV4cCI6MTQ4MzU0OTUxMSwianRpIjoiMm96US15TXdFcHV4WDlHZUhQdy1hZyIsImlhdCI6MTQ4MzU0OTQ1MSwibmJmIjoxNDgzNTQ5MzMxLCJzdWIiOiI0YWViMzdiYS1iNjQ1LTQ4ZmQtYWIzMC0xYTAxZWU0MWUyMTgifQ.w6p4J_6qQ1HzTG9nrEOrubxIMb9K5hzcMPxc9IxPx2K4xO9l-oFiUw93daH3m5pluP6K7eOE6txBuRVfEcpJSwlelsOsW8gb8VJcnzMS9EnZpeA0tW_p-mnkFc3VcfyXuhe5R3G7aa5d8uHv70yJ9Y3-UhjiN9EhpMdfPAoEB9fYKKkJRzF7utTTIPGrSaSU6d2pcpfYKaxIwePzEkT4DfcQthoZdy9ucNvvLoi1DIC-UocFD8HLs8LYKEqSxQvOcvnThbObJ9af71EwmuE21fO5KzMW20KtAeget1gnldOosPtz1G5EwvaQ401-RPQzPGMVBld0_zMCAwZttJ4knw
```

Which would produce the below configuration:

```yaml
users:
- name: mmosley
  user:
    auth-provider:
      config:
        client-id: kubernetes
        client-secret: 1db158f6-177d-4d9c-8a8b-d36869918ec5
        extra-scopes: groups
        id-token: eyJraWQiOiJDTj1vaWRjaWRwLnRyZW1vbG8ubGFuLCBPVT1EZW1vLCBPPVRybWVvbG8gU2VjdXJpdHksIEw9QXJsaW5ndG9uLCBTVD1WaXJnaW5pYSwgQz1VUy1DTj1rdWJlLWNhLTEyMDIxNDc5MjEwMzYwNzMyMTUyIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL29pZGNpZHAudHJlbW9sby5sYW46ODQ0My9hdXRoL2lkcC9PaWRjSWRQIiwiYXVkIjoia3ViZXJuZXRlcyIsImV4cCI6MTQ4MzU0OTUxMSwianRpIjoiMm96US15TXdFcHV4WDlHZUhQdy1hZyIsImlhdCI6MTQ4MzU0OTQ1MSwibmJmIjoxNDgzNTQ5MzMxLCJzdWIiOiI0YWViMzdiYS1iNjQ1LTQ4ZmQtYWIzMC0xYTAxZWU0MWUyMTgifQ.w6p4J_6qQ1HzTG9nrEOrubxIMb9K5hzcMPxc9IxPx2K4xO9l-oFiUw93daH3m5pluP6K7eOE6txBuRVfEcpJSwlelsOsW8gb8VJcnzMS9EnZpeA0tW_p-mnkFc3VcfyXuhe5R3G7aa5d8uHv70yJ9Y3-UhjiN9EhpMdfPAoEB9fYKKkJRzF7utTTIPGrSaSU6d2pcpfYKaxIwePzEkT4DfcQthoZdy9ucNvvLoi1DIC-UocFD8HLs8LYKEqSxQvOcvnThbObJ9af71EwmuE21fO5KzMW20KtAeget1gnldOosPtz1G5EwvaQ401-RPQzPGMVBld0_zMCAwZttJ4knw
        idp-certificate-authority: /root/ca.pem
        idp-issuer-url: https://oidcidp.tremolo.lan:8443/auth/idp/OidcIdP
        refresh-token: q1bKLFOyUiosTfawzA93TzZIDzH2TNa2SMm0zEiPKTUwME6BkEo6Sql5yUWVBSWpKUGphaWpxSVAfekBOZbBhaEW+VlFUeVRGcluyVF5JT4+haZmPsluFoFu5XkpXk5BXq
      name: oidc
```
Once your `id_token` expires, `kubectl` will attempt to refresh your `id_token` using your `refresh_token` and `client_secret` storing the new values for the `refresh_token` and `id_token` in your `kube/.config`.


##### Option 2 - Use the `--token` Option

The `kubectl` command lets you pass in a token using the `--token` option.  Simply copy and paste the `id_token` into this option:

```
kubectl --token=eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJodHRwczovL21sYi50cmVtb2xvLmxhbjo4MDQzL2F1dGgvaWRwL29pZGMiLCJhdWQiOiJrdWJlcm5ldGVzIiwiZXhwIjoxNDc0NTk2NjY5LCJqdGkiOiI2RDUzNXoxUEpFNjJOR3QxaWVyYm9RIiwiaWF0IjoxNDc0NTk2MzY5LCJuYmYiOjE0NzQ1OTYyNDksInN1YiI6Im13aW5kdSIsInVzZXJfcm9sZSI6WyJ1c2VycyIsIm5ldy1uYW1lc3BhY2Utdmlld2VyIl0sImVtYWlsIjoibXdpbmR1QG5vbW9yZWplZGkuY29tIn0.f2As579n9VNoaKzoF-dOQGmXkFKf1FMyNV0-va_B63jn-_n9LGSCca_6IVMP8pO-Zb4KvRqGyTP0r3HkHxYy5c81AnIh8ijarruczl-TK_yF5akjSTHFZD-0gRzlevBDiH8Q79NAr-ky0P4iIXS8lY9Vnjch5MF74Zx0c3alKJHJUnnpjIACByfF2SCaYzbWFMUNat-K1PaUk5-ujMBG7yYnr95xD-63n8CO8teGUAAEMx6zRjzfhnhbzX-ajwZLGwGUBT4WqjMs70-6a7_8gZmLZb2az1cZynkFRj2BaCkVT3A2RrjeEwZEtGXlMqKJ1_I2ulrOVsYx01_yD35-rw get nodes
```


### Webhook Token Authentication

Webhook authentication is a hook for verifying bearer tokens.

* `--authentication-token-webhook-config-file` a kubeconfig file describing how to access the remote webhook service.
* `--authentication-token-webhook-cache-ttl` how long to cache authentication decisions. Defaults to two minutes.

The configuration file uses the [kubeconfig](/docs/concepts/cluster-administration/authenticate-across-clusters-kubeconfig/)
file format. Within the file "users" refers to the API server webhook and
"clusters" refers to the remote service. An example would be:

```yaml
# clusters refers to the remote service.
clusters:
  - name: name-of-remote-authn-service
    cluster:
      certificate-authority: /path/to/ca.pem         # CA for verifying the remote service.
      server: https://authn.example.com/authenticate # URL of remote service to query. Must use 'https'.

# users refers to the API server's webhook configuration.
users:
  - name: name-of-api-server
    user:
      client-certificate: /path/to/cert.pem # cert for the webhook plugin to use
      client-key: /path/to/key.pem          # key matching the cert

# kubeconfig files require a context. Provide one for the API server.
current-context: webhook
contexts:
- context:
    cluster: name-of-remote-authn-service
    user: name-of-api-sever
  name: webhook
```

When a client attempts to authenticate with the API server using a bearer token
as discussed [above](#putting-a-bearer-token-in-a-request),
the authentication webhook
queries the remote service with a review object containing the token. Kubernetes
will not challenge a request that lacks such a header.

Note that webhook API objects are subject to the same [versioning compatibility rules](/docs/api/)
as other Kubernetes API objects. Implementers should be aware of looser
compatibility promises for beta objects and check the "apiVersion" field of the
request to ensure correct deserialization. Additionally, the API server must
enable the `authentication.k8s.io/v1beta1` API extensions group (`--runtime-config=authentication.k8s.io/v1beta1=true`).

The request body will be of the following format:

```json
{
  "apiVersion": "authentication.k8s.io/v1beta1",
  "kind": "TokenReview",
  "spec": {
    "token": "(BEARERTOKEN)"
  }
}
```

The remote service is expected to fill the `TokenAccessReviewStatus` field of
the request to indicate the success of the login. The response body's "spec"
field is ignored and may be omitted. A successful validation of the bearer
token would return:

```json
{
  "apiVersion": "authentication.k8s.io/v1beta1",
  "kind": "TokenReview",
  "status": {
    "authenticated": true,
    "user": {
      "username": "janedoe@example.com",
      "uid": "42",
      "groups": [
        "developers",
        "qa"
      ],
      "extra": {
        "extrafield1": [
          "extravalue1",
          "extravalue2"
        ]
      }
    }
  }
}
```

An unsuccessful request would return:

```json
{
  "apiVersion": "authentication.k8s.io/v1beta1",
  "kind": "TokenReview",
  "status": {
    "authenticated": false
  }
}
```

HTTP status codes can be used to supply additional error context.


### Authenticating Proxy

The API server can be configured to identify users from request header values, such as `X-Remote-User`.
It is designed for use in combination with an authenticating proxy, which sets the request header value.

* `--requestheader-username-headers` Required, case-insensitive. Header names to check, in order, for the user identity. The first header containing a value is used as the username.
* `--requestheader-group-headers` 1.6+. Optional, case-insensitive. "X-Remote-Group" is suggested. Header names to check, in order, for the user's groups. All values in all specified headers are used as group names.
* `--requestheader-extra-headers-prefix` 1.6+. Optional, case-insensitive. "X-Remote-Extra-" is suggested. Header prefixes to look for to determine extra information about the user (typically used by the configured authorization plugin). Any headers beginning with any of the specified prefixes have the prefix removed, the remainder of the header name becomes the extra key, and the header value is the extra value.

For example, with this configuration:
```
--requestheader-username-headers=X-Remote-User
--requestheader-group-headers=X-Remote-Group
--requestheader-extra-headers-prefix=X-Remote-Extra-
```

this request:
```
GET / HTTP/1.1
X-Remote-User: fido
X-Remote-Group: dogs
X-Remote-Group: dachshunds
X-Remote-Extra-Scopes: openid
X-Remote-Extra-Scopes: profile
```

would result in this user info:
```yaml
name: fido
groups:
- dogs
- dachshunds
extra:
  scopes:
  - openid
  - profile
```


In order to prevent header spoofing, the authenticating proxy is required to present a valid client
certificate to the API server for validation against the specified CA before the request headers are
checked.

* `--requestheader-client-ca-file` Required. PEM-encoded certificate bundle. A valid client certificate must be presented and validated against the certificate authorities in the specified file before the request headers are checked for user names.
* `--requestheader-allowed-names` Optional.  List of common names (cn). If set, a valid client certificate with a Common Name (cn) in the specified list must be presented before the request headers are checked for user names. If empty, any Common Name is allowed.


### Keystone Password

Keystone authentication is enabled by passing the `--experimental-keystone-url=<AuthURL>`
option to the API server during startup. The plugin is implemented in
`plugin/pkg/auth/authenticator/password/keystone/keystone.go` and currently uses
basic auth to verify used by username and password.

If you have configured self-signed certificates for the Keystone server,
you may need to set the `--experimental-keystone-ca-file=SOMEFILE` option when
starting the Kubernetes API server. If you set the option, the Keystone
server's certificate is verified by one of the authorities in the
`experimental-keystone-ca-file`. Otherwise, the certificate is verified by
the host's root Certificate Authority.

For details on how to use keystone to manage projects and users, refer to the
[Keystone documentation](http://docs.openstack.org/developer/keystone/). Please
note that this plugin is still experimental, under active development, and likely
to change in subsequent releases.

Please refer to the [discussion](https://github.com/kubernetes/kubernetes/pull/11798#issuecomment-129655212),
[blueprint](https://github.com/kubernetes/kubernetes/issues/11626) and [proposed
changes](https://github.com/kubernetes/kubernetes/pull/25536) for more details.

## Anonymous requests

When enabled, requests that are not rejected by other configured authentication methods are
treated as anonymous requests, and given a username of `system:anonymous` and a group of
`system:unauthenticated`.

For example, on a server with token authentication configured, and anonymous access enabled,
a request providing an invalid bearer token would receive a `401 Unauthorized` error.
A request providing no bearer token would be treated as an anonymous request.

In 1.5.1-1.5.x, anonymous access is disabled by default, and can be enabled by
passing the `--anonymous-auth=false` option to the API server.

In 1.6+, anonymous access is enabled by default if an authorization mode other than `AlwaysAllow`
is used, and can be disabled by passing the `--anonymous-auth=false` option to the API server.
Starting in 1.6, the ABAC and RBAC authorizers require explicit authorization of the
`system:anonymous` user or the `system:unauthenticated` group, so legacy policy rules
that grant access to the `*` user or `*` group do not include anonymous users.

## User impersonation

A user can act as another user through impersonation headers. These let requests
manually override the user info a request authenticates as. For example, an admin
could use this feature to debug an authorization policy by temporarily
impersonating another user and seeing if a request was denied.

Impersonation requests first authenticate as the requesting user, then switch
to the impersonated user info.

* A user makes an API call with their credentials _and_ impersonation headers.
* API server authenticates the user.
* API server ensures the authenticated users has impersonation privileges.
* Request user info is replaced with impersonation values.
* Request is evaluated, authorization acts on impersonated user info.

The following HTTP headers can be used to performing an impersonation request:

* `Impersonate-User`: The username to act as.
* `Impersonate-Group`: A group name to act as. Can be provided multiple times to set multiple groups. Optional. Requires "Impersonate-User"
* `Impersonate-Extra-( extra name )`: A dynamic header used to associate extra fields with the user. Optional. Requires "Impersonate-User"

An example set of headers:

```http
Impersonate-User: jane.doe@example.com
Impersonate-Group: developers
Impersonate-Group: admins
Impersonate-Extra-dn: cn=jane,ou=engineers,dc=example,dc=com
Impersonate-Extra-scopes: view
Impersonate-Extra-scopes: development
```

When using `kubectl` set the `--as` flag to configure the `Impersonate-User`
header, set the `--as-group` flag to configure the `Impersonate-Group` header.

```shell
$ kubectl drain mynode
Error from server (Forbidden): User "clark" cannot get nodes at the cluster scope. (get nodes mynode)

$ kubectl drain mynode --as=superman --as-group=system:masters
node "mynode" cordoned
node "mynode" drained
```

To impersonate a user, group, or set extra fields, the impersonating user must
have the ability to perform the "impersonate" verb on the kind of attribute
being impersonated ("user", "group", etc.). For clusters that enable the RBAC
authorization plugin, the following ClusterRole encompasses the rules needed to
set user and group impersonation headers:

```yaml
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRole
metadata:
  name: impersonator
rules:
- apiGroups: [""]
  resources: ["users", "groups", "serviceaccounts"]
  verbs: ["impersonate"]
```

Extra fields are evaluated as sub-resources of the resource "userextras". To
allow a user to use impersonation headers for the extra field "scopes," a user
should be granted the following role:

```yaml
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRole
metadata:
  name: scopes-impersonator
# Can set "Impersonate-Extra-scopes" header.
- apiGroups: ["authentication.k8s.io"]
  resources: ["userextras/scopes"]
  verbs: ["impersonate"]
```

The values of impersonation headers can also be restricted by limiting the set
of `resourceNames` a resource can take.

```yaml
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRole
metadata:
  name: limited-impersonator
rules:
# Can impersonate the user "jane.doe@example.com"
- apiGroups: [""]
  resources: ["users"]
  verbs: ["impersonate"]
  resourceNames: ["jane.doe@example.com"]

# Can impersonate the groups "developers" and "admins"
- apiGroups: [""]
  resources: ["groups"]
- verbs: ["impersonate"]
  resourceNames: ["developers","admins"]

# Can impersonate the extras field "scopes" with the values "view" and "development"
- apiGroups: ["authentication.k8s.io"]
  resources: ["userextras/scopes"]
  verbs: ["impersonate"]
  resourceNames: ["view", "development"]
```

## Plugin Development

We plan for the Kubernetes API server to issue tokens after the user has been
(re)authenticated by a *bedrock* authentication provider external to Kubernetes.
We also plan to make it easy to develop modules that interface between
Kubernetes and a bedrock authentication provider (e.g. github.com, google.com,
enterprise directory, kerberos, etc.)

## APPENDIX

### Creating Certificates

When using client certificate authentication, you can generate certificates
using an existing deployment script or manually through `easyrsa` or `openssl.`

#### Using an Existing Deployment Script

**Using an existing deployment script** is implemented at
`cluster/saltbase/salt/generate-cert/make-ca-cert.sh`.

Execute this script with two parameters. The first is the IP address
of API server. The second is a list of subject alternate names in the form `IP:<ip-address> or DNS:<dns-name>`.

The script will generate three files: `ca.crt`, `server.crt`, and `server.key`.

Finally, add the following parameters into API server start parameters:

- `--client-ca-file=/srv/kubernetes/ca.crt`
- `--tls-cert-file=/srv/kubernetes/server.crt`
- `--tls-private-key-file=/srv/kubernetes/server.key`

#### easyrsa

**easyrsa** can be used to manually generate certificates for your cluster.

1.  Download, unpack, and initialize the patched version of easyrsa3.

          curl -L -O https://storage.googleapis.com/kubernetes-release/easy-rsa/easy-rsa.tar.gz
          tar xzf easy-rsa.tar.gz
          cd easy-rsa-master/easyrsa3
          ./easyrsa init-pki
1.  Generate a CA. (`--batch` set automatic mode. `--req-cn` default CN to use.)

          ./easyrsa --batch "--req-cn=${MASTER_IP}@`date +%s`" build-ca nopass
1.  Generate server certificate and key.
    (build-server-full [filename]: Generate a keypair and sign locally for a client or server)

          ./easyrsa --subject-alt-name="IP:${MASTER_IP}" build-server-full server nopass
1.  Copy `pki/ca.crt`, `pki/issued/server.crt`, and `pki/private/server.key` to your directory.
1.  Fill in and add the following parameters into the API server start parameters:

          --client-ca-file=/yourdirectory/ca.crt
          --tls-cert-file=/yourdirectory/server.crt
          --tls-private-key-file=/yourdirectory/server.key

#### openssl

**openssl** can also be use to manually generate certificates for your cluster.

1.  Generate a ca.key with 2048bit:

          openssl genrsa -out ca.key 2048
1.  According to the ca.key generate a ca.crt (use -days to set the certificate effective time):

          openssl req -x509 -new -nodes -key ca.key -subj "/CN=${MASTER_IP}" -days 10000 -out ca.crt
1.  Generate a server.key with 2048bit

          openssl genrsa -out server.key 2048
1.  According to the server.key generate a server.csr:

          openssl req -new -key server.key -subj "/CN=${MASTER_IP}" -out server.csr
1.  According to the ca.key, ca.crt and server.csr generate the server.crt:

          openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out server.crt -days 10000
1.  View the certificate.

          openssl x509  -noout -text -in ./server.crt

Finally, do not forget to fill out and add the same parameters into the API server start parameters.

#### Certificates API

You can use the `certificates.k8s.io` API to provision
x509 certificates to use for authentication as documented
[here](/docs/tasks/tls/managing-tls-in-a-cluster).
