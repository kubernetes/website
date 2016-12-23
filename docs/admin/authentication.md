---
assignees:
- erictune
- lavalamp
- ericchiang
- deads2k

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
of the control plane, must authenticate when making requests to the the API server, 
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

When multiple are enabled, the first authenticator module
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

The token file format is implemented in `plugin/pkg/auth/authenticator/token/tokenfile/...`
and is a csv file with a minimum of 3 columns: token, user name, user uid, followed by
optional group names. Note, if you have more than one group the column must be double quoted e.g.

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

### Static Password File

Basic authentication is enabled by passing the `--basic-auth-file=SOMEFILE`
option to API server. Currently, the basic auth credentials last indefinitely,
and the password cannot be changed without restarting API server. Note that basic
authentication is currently supported for convenience while we finish making the
more secure modes described above easier to use.

The basic auth file format is implemented in `plugin/pkg/auth/authenticator/password/passwordfile/...`
and is a csv file with 3 columns: password, user name, user id.

```conf
password,user,uid
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
apiVersion: extensions/v1beta1
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

To enable the plugin, pass the following required flags:

* `--oidc-issuer-url` URL of the provider which allows the API server to discover
public signing keys. Only URLs which use the `https://` scheme are accepted.  This is typically
the provider's URL without a path, for example "https://accounts.google.com" or "https://login.salesforce.com".

* `--oidc-client-id` A client id that all tokens must be issued for.

Importantly, the API server is not an OAuth2 client, rather it can only be
configured to trust a single client. This allows the use of public providers,
such as Google, without trusting credentials issued to third parties. Admins who
wish utilize multiple OAuth clients should explore providers which support the
`azp` (authorized party) claim, a mechanism for allowing one client to issue
tokens on behalf of another.

The plugin also accepts the following optional flags:

* `--oidc-ca-file` Used by the API server to establish and verify the secure
connection to the issuer. Defaults to the host's root CAs.

And experimental flags:

* `--oidc-username-claim` JWT claim to use as the user name. By default `sub`,
which is expected to be a unique identifier of the end user. Admins can choose
other claims, such as `email`, depending on their provider.
* `--oidc-groups-claim` JWT claim to use as the user's group. If the claim is present
it must be an array of strings.

Kubernetes does not provide an OpenID Connect Identity Provider.
You can use an existing public OpenID Connect Identity Provider (such as Google, or [others](http://connect2id.com/products/nimbus-oauth-openid-connect-sdk/openid-connect-providers)).
Or, you can run your own Identity Provider, such as CoreOS [dex](https://github.com/coreos/dex), [Keycloak](https://github.com/keycloak/keycloak) or CloudFoundry [UAA](https://github.com/cloudfoundry/uaa).

The provider needs to support [OpenID connect discovery](https://openid.net/specs/openid-connect-discovery-1_0.html); not all do.

Setup instructions for specific systems:

- [UAA](http://apigee.com/about/blog/engineering/kubernetes-authentication-enterprise)
- [Dex](https://speakerdeck.com/ericchiang/kubernetes-access-control-with-dex)

### Webhook Token Authentication

Webhook authentication is a hook for verifying bearer tokens.

* `--authentication-token-webhook-config-file` a kubeconfig file describing how to access the remote webhook service.
* `--authentication-token-webhook-cache-ttl` how long to cache authentication decisions. Defaults to two minutes.

The configuration file uses the [kubeconfig](/docs/user-guide/kubeconfig-file/)
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
In order to prevent header spoofing, the authenticating proxy is required to present a valid client
certificate to the API server for validation against the specified CA before the request headers are 
checked.

* `--requestheader-username-headers` Required, case-insensitive. Header names to check, in order, for the user identity. The first header containing a value is used as the identity.
* `--requestheader-client-ca-file` Required. PEM-encoded certificate bundle. A valid client certificate must be presented and validated against the certificate authorities in the specified file before the request headers are checked for user names.
* `--requestheader-allowed-names` Optional.  List of common names (cn). If set, a valid client certificate with a Common Name (cn) in the specified list must be presented before the request headers are checked for user names. If empty, any Common Name is allowed. 


### Keystone Password

Keystone authentication is enabled by passing the `--experimental-keystone-url=<AuthURL>`
option to the API server during startup. The plugin is implemented in
`plugin/pkg/auth/authenticator/password/keystone/keystone.go` and currently uses
basic auth to verify used by username and password.

For details on how to use keystone to manage projects and users, refer to the
[Keystone documentation](http://docs.openstack.org/developer/keystone/). Please
note that this plugin is still experimental, under active development, and likely
to change in subsequent releases.

Please refer to the [discussion](https://github.com/kubernetes/kubernetes/pull/11798#issuecomment-129655212),
[blueprint](https://github.com/kubernetes/kubernetes/issues/11626) and [proposed
changes](https://github.com/kubernetes/kubernetes/pull/25536) for more details.

## Anonymous requests

Anonymous access is enabled by default, and can be disabled by passing `--anonymous-auth=false` 
option to the API server during startup.

When enabled, requests that are not rejected by other configured authentication methods are 
treated as anonymous requests, and given a username of `system:anonymous` and a group of 
`system:unauthenticated`.

For example, on a server with token authentication configured, and anonymous access enabled,
a request providing an invalid bearer token would receive a `401 Unauthorized` error. 
A request providing no bearer token would be treated as an anonymous request. 

If you rely on authentication alone to authorize access, either change to use an 
authorization mode other than `AlwaysAllow`, or set `--anonymous-auth=false`.

## Plugin Development

We plan for the Kubernetes API server to issue tokens after the user has been
(re)authenticated by a *bedrock* authentication provider external to Kubernetes.
We also plan to make it easy to develop modules that interface between
Kubernetes and a bedrock authentication provider (e.g. github.com, google.com,
enterprise directory, kerberos, etc.)

## APPENDIX

### Creating Certificates

When using client certificate authentication, you can generate certificates
using an existing deployment script or manually through `easyrsa` or `openssl.``

#### Using an Existing Deployment Script

**Using an existing deployment script** is implemented at
`cluster/saltbase/salt/generate-cert/make-ca-cert.sh`.  

Execute this script with two parameters. The first is the IP address
of API server. The second is a list of subject alternate names in the form `IP:<ip-address> or DNS:<dns-name>`.

The script will generate three files: `ca.crt`, `server.crt`, and `server.key`.

Finally, add the following parameters into API server start parameters:

- `--client-ca-file=/srv/kubernetes/ca.crt`
- `--tls-cert-file=/srv/kubernetes/server.cert`
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

          ./easyrsa --subject-alt-name="IP:${MASTER_IP}" build-server-full kubernetes-master nopass
1.  Copy `pki/ca.crt`, `pki/issued/kubernetes-master.crt`, and `pki/private/kubernetes-master.key` to your directory.
1.  Fill in and add the following parameters into the API server start parameters:

          --client-ca-file=/yourdirectory/ca.crt
          --tls-cert-file=/yourdirectory/server.cert
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
