---
reviewers:
- bprashanth
- liggitt
- thockin
title: Configure ServiceAccounts for Pods
content_template: templates/task
weight: 90
---

{{% capture overview %}}
Kubernetes offers two distinct ways for clients outside the
{{< glossary_tooltip text="control plane" term_id="control-plane" >}}
to authenticate to the
{{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}.

A _service account_ provides an identity for processes that run in a Pod,
and maps to a ServiceAccount object. When you authenticate to the API
server, you identify yourself as a particular user. Kubernetes recognises
the concept of a user, however, Kubernetes itself does _not_ have a User
resource.

This guide shows you some ways to configure ServiceAccounts for Pods.

{{% /capture %}}


{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{% /capture %}}

{{% capture steps %}}

## Use the default Service Account to access the API server

When Pods contact the API server, Pods authenticate as a particular
ServiceAccount (for example, `default`). There is always at least one
ServiceAccount in each Namespace.

If you do not specify a ServiceAccount when you create a Pod, the Pod will
automatically be assigned the `default` service account for its namespace.

You can fetch the details for a Pod you have created. For example:
```shell
kubectl get pods/<podname> -o yaml
```

In the output, you see a field `spec.serviceAccountName`.
Kubernetes [automatically](/docs/user-guide/working-with-resources/#resources-are-automatically-modified)
sets that value if you don't specify it when you create a Pod.

An application running inside a Pod can access the Kubernetes API using
automatically mounted service account credentials. See [accessing the Cluster](/docs/user-guide/accessing-the-cluster/#accessing-the-api-from-a-pod) to learn more.

When a Pod authenticates as a ServiceAccount, its level of access depends on the [authorization plugin and policy](/docs/reference/access-authn-authz/authorization/#authorization-modules) in use.

### Opt out of API credential automounting

If you don't want the {{< glossary_tooltip text="kubelet" term_id="kubelet" >}}
to automatically mount a ServiceAccount's API credentials, you can opt out of
the default behavior. To opt out, set `automountServiceAccountToken: false` on
the relevant ServiceAccount.

For example:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: build-robot
automountServiceAccountToken: false
...
```

You can also opt out of automounting API credentials for a particular Pod:
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
spec:
  serviceAccountName: build-robot
  automountServiceAccountToken: false
  ...
```

If both the ServiceAccount and the Pod's `.spec` specify a value for
`automountServiceAccountToken`, the Pod spec takes precedence.

## Use more than one ServiceAccount {#use-multiple-service-accounts}

Every namespace has at least one ServiceAccount: the default ServiceAccount
resource, called `default`.
You can list all ServiceAccount resources in your
[current namespace](/docs/concepts/overview/working-with-objects/namespaces/#setting-the-namespace-preference)
with:

```shell
kubectl get serviceaccounts
```
The output is similar to this:

```
NAME      SECRETS    AGE
default   1          1d
```

You can create additional ServiceAccount objects like this:

```shell
kubectl apply -f - <<EOF
apiVersion: v1
kind: ServiceAccount
metadata:
  name: build-robot
EOF
```

You can get dump of the ServiceAccount object that you created,
in YAML format, like this:

```shell
kubectl get serviceaccounts/build-robot -o yaml
```
The output is similar to this:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  creationTimestamp: 2019-06-16T00:12:34Z
  name: build-robot
  namespace: default
  resourceVersion: "272500"
  uid: 721ab723-13bc-11e5-aec2-42010af0021e
secrets:
- name: build-robot-token-bvbk5
```

Notice that the cluster automatically created a token, placed that token into
a {{< glossary_tooltip text="Secret" term_id="secret" >}}, and stored a reference
to that Secret into the ServiceAccount.

You can use authorization plugins to [set permissions on service accounts](/docs/reference/access-authn-authz/rbac/#service-account-permissions).

To use a non-default service account, set the `spec.serviceAccountName`
field of a Pod to the name of the ServiceAccount you wish to use.

{{< note >}}
You can only set the `serviceAccountName` when creating a Pod, or in a
template for a new Pod. You cannot update the ServiceAccount of a Pod that
already exists.
{{< /note >}}

### Cleanup {#cleanup-use-multiple-service-accounts}

If you tried creating `build-robot` ServiceAccount from the example above,
you can clean it up by running:

```shell
kubectl delete serviceaccount/build-robot
```

## Manually create an API token for a ServiceAccount

Suppose you have an existing service account named "build-robot" as mentioned earlier.
You then manually create a new Secret:

```shell
kubectl apply -f - <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: build-robot-secret
  annotations:
    kubernetes.io/service-account.name: build-robot
type: kubernetes.io/service-account-token
EOF
```

If you view the Secret using:
```shell
kubectl get secret/build-robot-secret -o yaml
```

you can see that the Secret now contains an API token for the "build-robot" ServiceAccount.

The control plane automatically generates tokens for ServiceAccounts, and stores
them into the associated Secret. The control plane also cleans up tokens for
deleted ServiceAccounts.

```shell
kubectl describe secrets/build-robot-secret
```
The output is similar to this:

```
Name:           build-robot-secret
Namespace:      default
Labels:         <none>
Annotations:    kubernetes.io/service-account.name=build-robot
                kubernetes.io/service-account.uid=da68f9c6-9d26-11e7-b84e-002dc52800da

Type:   kubernetes.io/service-account-token

Data
====
ca.crt:         1338 bytes
namespace:      7 bytes
token:          ...
```

{{< note >}}
By design, `kubectl describe` hides the value of the token.
{{< /note >}}

## Add ImagePullSecrets to a service account

First, [create an imagePullSecret](/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod).
Next, verify it has been created. For example:

```shell
kubectl get secrets myregistrykey
```

The output is similar to this:

```
NAME             TYPE                              DATA    AGE
myregistrykey    kubernetes.io/.dockerconfigjson   1       1d
```

Next, modify the default service account for the namespace to use this Secret as an imagePullSecret.

```shell
kubectl patch serviceaccount default -p '{"imagePullSecrets": [{"name": "myregistrykey"}]}'
```

You can achieve the same outcome by editing the object manually:

```shell
kubectl edit serviceaccount/default
```

Your selected text editor will open with a configuration looking something like this:
```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  creationTimestamp: 2019-07-07T22:02:39Z
  name: default
  namespace: default
  resourceVersion: "243024"
  uid: 052fb0f4-3d50-11e5-b066-42010af0d7b6
secrets:
- name: default-token-uudge
```

Using your editor, delete the line with key `resourceVersion`, add lines for `imagePullSecrets:` and save it.
Leave the `uid` value set the same as you found it.

After you made those changes, the edited ServiceAccount looks something like this:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  creationTimestamp: 2019-07-07T22:02:39Z
  name: default
  namespace: default
  uid: 052fb0f4-3d50-11e5-b066-42010af0d7b6
secrets:
- name: default-token-uudge
imagePullSecrets:
- name: myregistrykey
```

Any new Pods created in the current namespace will have this added to their spec:

```yaml
spec:
  imagePullSecrets:
  - name: myregistrykey
```

## ServiceAccount token volume projection

{{< feature-state for_k8s_version="v1.12" state="beta" >}}

{{< note >}}
ServiceAccount token volume projection is __beta__ since Kubernetes v1.12,
controlled by the `TokenRequestProjection`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/).

To use this feature, pass the following flags to the API server:

* `--service-account-issuer`
* `--service-account-signing-key-file`
* `--service-account-api-audiences`

{{< /note >}}

The kubelet can also project a ServiceAccount token into a Pod. You can
specify desired properties of the token, such as the audience and the validity
duration. These properties are _not_ configurable on the default ServiceAccount
token. The token will also become invalid against the API when either the Pod
or the ServiceAccount is deleted.

You can configure this behavior on a PodSpec using a
[projected volume](/docs/concepts/storage/volumes/#projected) type called
`ServiceAccountToken`.

To provide a Pod with a token with an audience of "vault" and a validity duration
of two hours, you would configure the following in your PodSpec:

{{< codenew file="pods/pod-projected-svc-token.yaml" >}}

Create the Pod:

```shell
kubectl create -f https://k8s.io/examples/pods/pod-projected-svc-token.yaml
```

The kubelet will: request and store the token on behalf of the Pod; make
the token available to the Pod at a configurable file path; and refresh
the token as it approaches expiration. kubelet proactively requests rotation
for the token if it is older than 80% of its total time-to-live (TTL),
or if the token is older than 24 hours.

The application is responsible for reloading the token when it rotates.
Periodic reloading (e.g. once every 5 minutes) is sufficient for most use cases.

{{< note >}}
Starting from v1.13, you can have the control plane automatically migrate a
ServiceAccount volume to a projected volume. You'll need to enable the
`BoundServiceAccountTokenVolume` feature gate to benefit from this.
{{< /note >}}

{{% /capture %}}
{{% capture whatsnext %}}
* Read about [Authorization in Kubernetes](/docs/reference/access-authn-authz/authorization/)
* Read about [Secrets](/docs/concepts/configuration/secret/)
* Read about [projected volumes](/docs/tasks/configure-pod-container/configure-projected-volume-storage/).
* Learn to [Distribute Credentials Securely Using Secrets](/docs/tasks/inject-data-application/distribute-credentials-secure/)
{{% /capture %}}
