---
reviewers:
- bprashanth
- davidopp
- lavalamp
- liggitt
title: Managing Service Accounts
content_template: templates/concept
weight: 50
---

{{% capture overview %}}
This is a Cluster Administrator guide to service accounts. It assumes knowledge of
the [User Guide to Service Accounts](/docs/user-guide/service-accounts).

Support for authorization and user accounts is planned but incomplete.  Sometimes
incomplete features are referred to in order to better describe service accounts.
{{% /capture %}}

{{% capture body %}}
## User accounts vs service accounts

Kubernetes distinguishes between the concept of a user account and a service account
for a number of reasons:

  - User accounts are for humans. Service accounts are for processes, which
    run in pods.
  - User accounts are intended to be global. Names must be unique across all
    namespaces of a cluster, future user resource will not be namespaced.
    Service accounts are namespaced.
  - Typically, a cluster's User accounts might be synced from a corporate
    database, where new user account creation requires special privileges and
    is tied to complex business processes. Service account creation is intended
    to be more lightweight, allowing cluster users to create service accounts for
    specific tasks (i.e. principle of least privilege).
  - Auditing considerations for humans and service accounts may differ.
  - A config bundle for a complex system may include definition of various service
    accounts for components of that system.  Because service accounts can be created
    ad-hoc and have namespaced names, such config is portable.

## Service account automation

Three separate components cooperate to implement the automation around service accounts:

  - A Service account admission controller
  - A Token controller
  - A Service account controller

### Service Account Admission Controller

The modification of pods is implemented via a plugin
called an [Admission Controller](/docs/reference/access-authn-authz/admission-controllers/). It is part of the apiserver.
It acts synchronously to modify pods as they are created or updated. When this plugin is active
(and it is by default on most distributions), then it does the following when a pod is created or modified:

  1. If the pod does not have a `ServiceAccount` set, it sets the `ServiceAccount` to `default`.
  1. It ensures that the `ServiceAccount` referenced by the pod exists, and otherwise rejects it.
  1. If the pod does not contain any `ImagePullSecrets`, then `ImagePullSecrets` of the `ServiceAccount` are added to the pod.
  1. It adds a `volume` to the pod which contains a token for API access.
  1. It adds a `volumeSource` to each container of the pod mounted at `/var/run/secrets/kubernetes.io/serviceaccount`.

Starting from v1.13, you can migrate a service account volume to a projected volume when
the `BoundServiceAccountTokenVolume` feature gate is enabled.
The service account token will expire after 1 hour or the pod is deleted. See more details about [projected volume](/docs/tasks/configure-pod-container/configure-projected-volume-storage/).

### Token Controller

TokenController runs as part of controller-manager. It acts asynchronously. It:

- observes serviceAccount creation and creates a corresponding Secret to allow API access.
- observes serviceAccount deletion and deletes all corresponding ServiceAccountToken Secrets.
- observes secret addition, and ensures the referenced ServiceAccount exists, and adds a token to the secret if needed.
- observes secret deletion and removes a reference from the corresponding ServiceAccount if needed.

You must pass a service account private key file to the token controller in the controller-manager by using
the `--service-account-private-key-file` option. The private key will be used to sign generated service account tokens.
Similarly, you must pass the corresponding public key to the kube-apiserver using the `--service-account-key-file`
option. The public key will be used to verify the tokens during authentication.

#### To create additional API tokens

A controller loop ensures a secret with an API token exists for each service
account. To create additional API tokens for a service account, create a secret
of type `ServiceAccountToken` with an annotation referencing the service
account, and the controller will update it with a generated token:

secret.json:

```json
{
    "kind": "Secret",
    "apiVersion": "v1",
    "metadata": {
        "name": "mysecretname",
        "annotations": {
            "kubernetes.io/service-account.name": "myserviceaccount"
        }
    },
    "type": "kubernetes.io/service-account-token"
}
```

```shell
kubectl create -f ./secret.json
kubectl describe secret mysecretname
```

#### To delete/invalidate a service account token

```shell
kubectl delete secret mysecretname
```

### Service Account Controller

Service Account Controller manages ServiceAccount inside namespaces, and ensures
a ServiceAccount named "default" exists in every active namespace.
{{% /capture %}}
