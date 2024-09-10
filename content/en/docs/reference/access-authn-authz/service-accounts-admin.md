---
reviewers:
  - liggitt
  - enj
title: Managing Service Accounts
content_type: concept
weight: 50
---

<!-- overview -->

A _ServiceAccount_ provides an identity for processes that run in a Pod.

A process inside a Pod can use the identity of its associated service account to
authenticate to the cluster's API server.

For an introduction to service accounts, read [configure service accounts](/docs/tasks/configure-pod-container/configure-service-account/).

This task guide explains some of the concepts behind ServiceAccounts. The
guide also explains how to obtain or revoke tokens that represent
ServiceAccounts.

<!-- body -->

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

To be able to follow these steps exactly, ensure you have a namespace named
`examplens`.
If you don't, create one by running:

```shell
kubectl create namespace examplens
```

## User accounts versus service accounts

Kubernetes distinguishes between the concept of a user account and a service account
for a number of reasons:

- User accounts are for humans. Service accounts are for application processes,
  which (for Kubernetes) run in containers that are part of pods.
- User accounts are intended to be global: names must be unique across all
  namespaces of a cluster. No matter what namespace you look at, a particular
  username that represents a user represents the same user.
  In Kubernetes, service accounts are namespaced: two different namespaces can
  contain ServiceAccounts that have identical names.
- Typically, a cluster's user accounts might be synchronised from a corporate
  database, where new user account creation requires special privileges and is
  tied to complex business processes. By contrast, service account creation is
  intended to be more lightweight, allowing cluster users to create service accounts
  for specific tasks on demand. Separating ServiceAccount creation from the steps to
  onboard human users makes it easier for workloads to follow the principle of
  least privilege.
- Auditing considerations for humans and service accounts may differ; the separation
  makes that easier to achieve.
- A configuration bundle for a complex system may include definition of various service
  accounts for components of that system. Because service accounts can be created
  without many constraints and have namespaced names, such configuration is
  usually portable.

## Bound service account tokens

ServiceAccount tokens can be bound to API objects that exist in the kube-apiserver.
This can be used to tie the validity of a token to the existence of another API object.
Supported object types are as follows:

* Pod (used for projected volume mounts, see below)
* Secret (can be used to allow revoking a token by deleting the Secret)
* Node (in v1.30, creating new node-bound tokens is alpha, using existing node-bound tokens is beta)

When a token is bound to an object, the object's `metadata.name` and `metadata.uid` are
stored as extra 'private claims' in the issued JWT.

When a bound token is presented to the kube-apiserver, the service account authenticator
will extract and verify these claims.
If the referenced object or the ServiceAccount is pending deletion (for example, due to finalizers),
then for any instant that is 60 seconds (or more) after the `.metadata.deletionTimestamp` date,
authentication with that token would fail.
If the referenced object no longer exists (or its `metadata.uid` does not match),
the request will not be authenticated.

### Additional metadata in Pod bound tokens

{{< feature-state feature_gate_name="ServiceAccountTokenPodNodeInfo" >}}

When a service account token is bound to a Pod object, additional metadata is also
embedded into the token that indicates the value of the bound pod's `spec.nodeName` field,
and the uid of that Node, if available.

This node information is **not** verified by the kube-apiserver when the token is used for authentication.
It is included so integrators do not have to fetch Pod or Node API objects to check the associated Node name
and uid when inspecting a JWT.

### Verifying and inspecting private claims

The `TokenReview` API can be used to verify and extract private claims from a token:

1. First, assume you have a pod named `test-pod` and a service account named `my-sa`.
2. Create a token that is bound to this Pod:

```shell
kubectl create token my-sa --bound-object-kind="Pod" --bound-object-name="test-pod"
```

3. Copy this token into a new file named `tokenreview.yaml`:

```yaml
apiVersion: authentication.k8s.io/v1
kind: TokenReview
spec:
  token: <token from step 2>
```

4. Submit this resource to the apiserver for review:

```shell
kubectl create -o yaml -f tokenreview.yaml # we use '-o yaml' so we can inspect the output
```

You should see an output like below:

```yaml
apiVersion: authentication.k8s.io/v1
kind: TokenReview
metadata:
  creationTimestamp: null
spec:
  token: <token>
status:
  audiences:
  - https://kubernetes.default.svc.cluster.local
  authenticated: true
  user:
    extra:
      authentication.kubernetes.io/credential-id:
      - JTI=7ee52be0-9045-4653-aa5e-0da57b8dccdc
      authentication.kubernetes.io/node-name:
      - kind-control-plane
      authentication.kubernetes.io/node-uid:
      - 497e9d9a-47aa-4930-b0f6-9f2fb574c8c6
      authentication.kubernetes.io/pod-name:
      - test-pod
      authentication.kubernetes.io/pod-uid:
      - e87dbbd6-3d7e-45db-aafb-72b24627dff5
    groups:
    - system:serviceaccounts
    - system:serviceaccounts:default
    - system:authenticated
    uid: f8b4161b-2e2b-11e9-86b7-2afc33b31a7e
    username: system:serviceaccount:default:my-sa
```

{{< note >}}
Despite using `kubectl create -f` to create this resource, and defining it similar to
other resource types in Kubernetes, TokenReview is a special type and the kube-apiserver
does not actually persist the TokenReview object into etcd.
Hence `kubectl get tokenreview` is not a valid command.
{{< /note >}}

## Bound service account token volume mechanism {#bound-service-account-token-volume}

{{< feature-state feature_gate_name="BoundServiceAccountTokenVolume" >}}

By default, the Kubernetes control plane (specifically, the
[ServiceAccount admission controller](#serviceaccount-admission-controller)) 
adds a [projected volume](/docs/concepts/storage/projected-volumes/) to Pods,
and this volume includes a token for Kubernetes API access.

Here's an example of how that looks for a launched Pod:

```yaml
...
  - name: kube-api-access-<random-suffix>
    projected:
      sources:
        - serviceAccountToken:
            path: token # must match the path the app expects
        - configMap:
            items:
              - key: ca.crt
                path: ca.crt
            name: kube-root-ca.crt
        - downwardAPI:
            items:
              - fieldRef:
                  apiVersion: v1
                  fieldPath: metadata.namespace
                path: namespace
```

That manifest snippet defines a projected volume that consists of three sources. In this case,
each source also represents a single path within that volume. The three sources are:

1. A `serviceAccountToken` source, that contains a token that the kubelet acquires from kube-apiserver.
   The kubelet fetches time-bound tokens using the TokenRequest API. A token served for a TokenRequest expires
   either when the pod is deleted or after a defined lifespan (by default, that is 1 hour).
   The kubelet also refreshes that token before the token expires.
   The token is bound to the specific Pod and has the kube-apiserver as its audience.
   This mechanism superseded an earlier mechanism that added a volume based on a Secret,
   where the Secret represented the ServiceAccount for the Pod, but did not expire.
1. A `configMap` source. The ConfigMap contains a bundle of certificate authority data. Pods can use these
   certificates to make sure that they are connecting to your cluster's kube-apiserver (and not to middlebox
   or an accidentally misconfigured peer).
1. A `downwardAPI` source that looks up the name of the namespace containing the Pod, and makes
   that name information available to application code running inside the Pod.

Any container within the Pod that mounts this particular volume can access the above information.

{{< note >}}
There is no specific mechanism to invalidate a token issued via TokenRequest. If you no longer
trust a bound service account token for a Pod, you can delete that Pod. Deleting a Pod expires
its bound service account tokens.
{{< /note >}}

## Manual Secret management for ServiceAccounts

Versions of Kubernetes before v1.22 automatically created credentials for accessing
the Kubernetes API. This older mechanism was based on creating token Secrets that
could then be mounted into running Pods.

In more recent versions, including Kubernetes v{{< skew currentVersion >}}, API credentials
are [obtained directly](#bound-service-account-token-volume) using the
[TokenRequest](/docs/reference/kubernetes-api/authentication-resources/token-request-v1/) API,
and are mounted into Pods using a projected volume.
The tokens obtained using this method have bounded lifetimes, and are automatically
invalidated when the Pod they are mounted into is deleted.

You can still [manually create](/docs/tasks/configure-pod-container/configure-service-account/#manually-create-an-api-token-for-a-serviceaccount) a Secret to hold a service account token; for example, if you need a token that never expires.

Once you manually create a Secret and link it to a ServiceAccount, the Kubernetes control plane automatically populates the token into that Secret.

{{< note >}}
Although the manual mechanism for creating a long-lived ServiceAccount token exists,
using [TokenRequest](/docs/reference/kubernetes-api/authentication-resources/token-request-v1/)
to obtain short-lived API access tokens is recommended instead.
{{< /note >}}

## Auto-generated legacy ServiceAccount token clean up {#auto-generated-legacy-serviceaccount-token-clean-up}

Before version 1.24, Kubernetes automatically generated Secret-based tokens for
ServiceAccounts. To distinguish between automatically generated tokens and
manually created ones, Kubernetes checks for a reference from the
ServiceAccount's secrets field. If the Secret is referenced in the `secrets`
field, it is considered an auto-generated legacy token. Otherwise, it is
considered a manually created legacy token. For example:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: build-robot
  namespace: default
secrets:
  - name: build-robot-secret # usually NOT present for a manually generated token                         
```

Beginning from version 1.29, legacy ServiceAccount tokens that were generated
automatically will be marked as invalid if they remain unused for a certain
period of time (set to default at one year). Tokens that continue to be unused
for this defined period (again, by default, one year) will subsequently be
purged by the control plane.

If users use an invalidated auto-generated token, the token validator will

1. add an audit annotation for the key-value pair
  `authentication.k8s.io/legacy-token-invalidated: <secret name>/<namespace>`,
1. increment the `invalid_legacy_auto_token_uses_total` metric count,
1. update the Secret label `kubernetes.io/legacy-token-last-used` with the new
   date,
1. return an error indicating that the token has been invalidated.

When receiving this validation error, users can update the Secret to remove the
`kubernetes.io/legacy-token-invalid-since` label to temporarily allow use of
this token.

Here's an example of an auto-generated legacy token that has been marked with the
`kubernetes.io/legacy-token-last-used` and `kubernetes.io/legacy-token-invalid-since`
labels:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: build-robot-secret
  namespace: default
  labels:
    kubernetes.io/legacy-token-last-used: 2022-10-24
    kubernetes.io/legacy-token-invalid-since: 2023-10-25
  annotations:
    kubernetes.io/service-account.name: build-robot
type: kubernetes.io/service-account-token
```

## Control plane details

### ServiceAccount controller

A ServiceAccount controller manages the ServiceAccounts inside namespaces, and
ensures a ServiceAccount named "default" exists in every active namespace.

### Token controller

The service account token controller runs as part of `kube-controller-manager`.
This controller acts asynchronously. It:

- watches for ServiceAccount deletion and deletes all corresponding ServiceAccount
  token Secrets.
- watches for ServiceAccount token Secret addition, and ensures the referenced
  ServiceAccount exists, and adds a token to the Secret if needed.
- watches for Secret deletion and removes a reference from the corresponding
  ServiceAccount if needed.

You must pass a service account private key file to the token controller in
the `kube-controller-manager` using the `--service-account-private-key-file`
flag. The private key is used to sign generated service account tokens.
Similarly, you must pass the corresponding public key to the `kube-apiserver`
using the `--service-account-key-file` flag. The public key will be used to
verify the tokens during authentication.

### ServiceAccount admission controller

The modification of pods is implemented via a plugin
called an [Admission Controller](/docs/reference/access-authn-authz/admission-controllers/).
It is part of the API server.
This admission controller acts synchronously to modify pods as they are created.
When this plugin is active (and it is by default on most distributions), then
it does the following when a Pod is created:

1. If the pod does not have a `.spec.serviceAccountName` set, the admission controller sets the name of the
   ServiceAccount for this incoming Pod to `default`.
1. The admission controller ensures that the ServiceAccount referenced by the incoming Pod exists. If there
   is no ServiceAccount with a matching name, the admission controller rejects the incoming Pod. That check
   applies even for the `default` ServiceAccount.
1. Provided that neither the ServiceAccount's `automountServiceAccountToken` field nor the
   Pod's `automountServiceAccountToken` field is set to `false`:
   - the admission controller mutates the incoming Pod, adding an extra
     {{< glossary_tooltip text="volume" term_id="volume" >}} that contains
     a token for API access.
   - the admission controller adds a `volumeMount` to each container in the Pod,
     skipping any containers that already have a volume mount defined for the path
     `/var/run/secrets/kubernetes.io/serviceaccount`.
     For Linux containers, that volume is mounted at `/var/run/secrets/kubernetes.io/serviceaccount`;
     on Windows nodes, the mount is at the equivalent path.
1. If the spec of the incoming Pod doesn't already contain any `imagePullSecrets`, then the
   admission controller adds `imagePullSecrets`, copying them from the `ServiceAccount`.

### Legacy ServiceAccount token tracking controller

{{< feature-state feature_gate_name="LegacyServiceAccountTokenTracking" >}}

This controller generates a ConfigMap called
`kube-system/kube-apiserver-legacy-service-account-token-tracking` in the
`kube-system` namespace. The ConfigMap records the timestamp when legacy service
account tokens began to be monitored by the system.

### Legacy ServiceAccount token cleaner

{{< feature-state feature_gate_name="LegacyServiceAccountTokenCleanUp" >}}

The legacy ServiceAccount token cleaner runs as part of the
`kube-controller-manager` and checks every 24 hours to see if any auto-generated
legacy ServiceAccount token has not been used in a *specified amount of time*.
If so, the cleaner marks those tokens as invalid.

The cleaner works by first checking the ConfigMap created by the control plane
(provided that `LegacyServiceAccountTokenTracking` is enabled). If the current
time is a *specified amount of time* after the date in the ConfigMap, the
cleaner then loops through the list of Secrets in the cluster and evaluates each
Secret that has the type `kubernetes.io/service-account-token`.

If a Secret meets all of the following conditions, the cleaner marks it as
invalid:

- The Secret is auto-generated, meaning that it is bi-directionally referenced
  by a ServiceAccount.
- The Secret is not currently mounted by any pods.
- The Secret has not been used in a *specified amount of time* since it was
  created or since it was last used.

The cleaner marks a Secret invalid by adding a label called
`kubernetes.io/legacy-token-invalid-since` to the Secret, with the current date
as the value. If an invalid Secret is not used in a *specified amount of time*,
the cleaner will delete it.

{{< note >}}
All the *specified amount of time* above defaults to one year. The cluster
administrator can configure this value through the
`--legacy-service-account-token-clean-up-period` command line argument for the
`kube-controller-manager` component.
{{< /note >}}

### TokenRequest API

{{< feature-state for_k8s_version="v1.22" state="stable" >}}

You use the [TokenRequest](/docs/reference/kubernetes-api/authentication-resources/token-request-v1/)
subresource of a ServiceAccount to obtain a time-bound token for that ServiceAccount.
You don't need to call this to obtain an API token for use within a container, since
the kubelet sets this up for you using a _projected volume_.

If you want to use the TokenRequest API from `kubectl`, see
[Manually create an API token for a ServiceAccount](/docs/tasks/configure-pod-container/configure-service-account/#manually-create-an-api-token-for-a-serviceaccount).

The Kubernetes control plane (specifically, the ServiceAccount admission controller)
adds a projected volume to Pods, and the kubelet ensures that this volume contains a token
that lets containers authenticate as the right ServiceAccount.

(This mechanism superseded an earlier mechanism that added a volume based on a Secret,
where the Secret represented the ServiceAccount for the Pod but did not expire.)

Here's an example of how that looks for a launched Pod:

```yaml
...
  - name: kube-api-access-<random-suffix>
    projected:
      defaultMode: 420 # decimal equivalent of octal 0644
      sources:
        - serviceAccountToken:
            expirationSeconds: 3607
            path: token
        - configMap:
            items:
              - key: ca.crt
                path: ca.crt
            name: kube-root-ca.crt
        - downwardAPI:
            items:
              - fieldRef:
                  apiVersion: v1
                  fieldPath: metadata.namespace
                path: namespace
```

That manifest snippet defines a projected volume that combines information from three sources:

1. A `serviceAccountToken` source, that contains a token that the kubelet acquires from kube-apiserver.
   The kubelet fetches time-bound tokens using the TokenRequest API. A token served for a TokenRequest expires
   either when the pod is deleted or after a defined lifespan (by default, that is 1 hour).
   The token is bound to the specific Pod and has the kube-apiserver as its audience.
1. A `configMap` source. The ConfigMap contains a bundle of certificate authority data. Pods can use these
   certificates to make sure that they are connecting to your cluster's kube-apiserver (and not to middlebox
   or an accidentally misconfigured peer).
1. A `downwardAPI` source. This `downwardAPI` volume makes the name of the namespace containing the Pod available
   to application code running inside the Pod.

Any container within the Pod that mounts this volume can access the above information.

## Create additional API tokens {#create-token}

{{< caution >}}
Only create long-lived API tokens if the [token request](#tokenrequest-api) mechanism
is not suitable. The token request mechanism provides time-limited tokens; because these
expire, they represent a lower risk to information security.
{{< /caution >}}

To create a non-expiring, persisted API token for a ServiceAccount, create a
Secret of type `kubernetes.io/service-account-token` with an annotation
referencing the ServiceAccount. The control plane then generates a long-lived token and
updates that Secret with that generated token data.

Here is a sample manifest for such a Secret:

{{% code_sample file="secret/serviceaccount/mysecretname.yaml" %}}

To create a Secret based on this example, run:

```shell
kubectl -n examplens create -f https://k8s.io/examples/secret/serviceaccount/mysecretname.yaml
```

To see the details for that Secret, run:

```shell
kubectl -n examplens describe secret mysecretname
```

The output is similar to:

```
Name:           mysecretname
Namespace:      examplens
Labels:         <none>
Annotations:    kubernetes.io/service-account.name=myserviceaccount
                kubernetes.io/service-account.uid=8a85c4c4-8483-11e9-bc42-526af7764f64

Type:   kubernetes.io/service-account-token

Data
====
ca.crt:         1362 bytes
namespace:      9 bytes
token:          ...
```

If you launch a new Pod into the `examplens` namespace, it can use the `myserviceaccount`
service-account-token Secret that you just created.

{{< caution >}}
Do not reference manually created Secrets in the `secrets` field of a
ServiceAccount. Or the manually created Secrets will be cleaned if it is not used for a long
time. Please refer to [auto-generated legacy ServiceAccount token clean up](#auto-generated-legacy-serviceaccount-token-clean-up).
{{< /caution >}}

## Delete/invalidate a ServiceAccount token {#delete-token}

If you know the name of the Secret that contains the token you want to remove:

```shell
kubectl delete secret name-of-secret
```

Otherwise, first find the Secret for the ServiceAccount.

```shell
# This assumes that you already have a namespace named 'examplens'
kubectl -n examplens get serviceaccount/example-automated-thing -o yaml
```

The output is similar to:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  annotations:
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"v1","kind":"ServiceAccount","metadata":{"annotations":{},"name":"example-automated-thing","namespace":"examplens"}}
  creationTimestamp: "2019-07-21T07:07:07Z"
  name: example-automated-thing
  namespace: examplens
  resourceVersion: "777"
  selfLink: /api/v1/namespaces/examplens/serviceaccounts/example-automated-thing
  uid: f23fd170-66f2-4697-b049-e1e266b7f835
secrets:
  - name: example-automated-thing-token-zyxwv
```

Then, delete the Secret you now know the name of:

```shell
kubectl -n examplens delete secret/example-automated-thing-token-zyxwv
```

## Clean up

If you created a namespace `examplens` to experiment with, you can remove it:

```shell
kubectl delete namespace examplens
```

## {{% heading "whatsnext" %}}

- Read more details about [projected volumes](/docs/concepts/storage/projected-volumes/).
