---
reviewers:
- bprashanth
- liggitt
- thockin
title: Configure Service Accounts for Pods
---

A service account provides an identity for processes that run in a Pod.

*This is a user introduction to Service Accounts.  See also the
[Cluster Admin Guide to Service Accounts](/docs/admin/service-accounts-admin/).*

**Note:** This document describes how service accounts behave in a cluster set up
as recommended by the Kubernetes project.  Your cluster administrator may have
customized the behavior in your cluster, in which case this documentation may
not apply.
{: .note}

When you (a human) access the cluster (for example, using `kubectl`), you are
authenticated by the apiserver as a particular User Account (currently this is
usually `admin`, unless your cluster administrator has customized your
cluster).  Processes in containers inside pods can also contact the apiserver.
When they do, they are authenticated as a particular Service Account (for example,
`default`).

## Use the Default Service Account to access the API server.

When you create a pod, if you do not specify a service account, it is
automatically assigned the `default` service account in the same namespace.
If you get the raw json or yaml for a pod you have created (for example, `kubectl get pods/podname -o yaml`),
you can see the `spec.serviceAccountName` field has been
[automatically set](/docs/user-guide/working-with-resources/#resources-are-automatically-modified).

You can access the API from inside a pod using automatically mounted service account credentials,
as described in [Accessing the Cluster](/docs/user-guide/accessing-the-cluster/#accessing-the-api-from-a-pod).
The API permissions a service account has depend on the [authorization plugin and policy](/docs/admin/authorization/#a-quick-note-on-service-accounts) in use.

In version 1.6+, you can opt out of automounting API credentials for a service account by setting
`automountServiceAccountToken: false` on the service account:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: build-robot
automountServiceAccountToken: false
...
```

In version 1.6+, you can also opt out of automounting API credentials for a particular pod:

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

The pod spec takes precedence over the service account if both specify a `automountServiceAccountToken` value.

## Use Multiple Service Accounts.

Every namespace has a default service account resource called `default`.
You can list this and any other serviceAccount resources in the namespace with this command:

```shell
$ kubectl get serviceAccounts
NAME      SECRETS    AGE
default   1          1d
```

You can create additional ServiceAccount objects like this:

```shell
$ cat > /tmp/serviceaccount.yaml <<EOF
apiVersion: v1
kind: ServiceAccount
metadata:
  name: build-robot
EOF
$ kubectl create -f /tmp/serviceaccount.yaml
serviceaccount "build-robot" created
```

If you get a complete dump of the service account object, like this:

```shell
$ kubectl get serviceaccounts/build-robot -o yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  creationTimestamp: 2015-06-16T00:12:59Z
  name: build-robot
  namespace: default
  resourceVersion: "272500"
  selfLink: /api/v1/namespaces/default/serviceaccounts/build-robot
  uid: 721ab723-13bc-11e5-aec2-42010af0021e
secrets:
- name: build-robot-token-bvbk5
```

then you will see that a token has automatically been created and is referenced by the service account.

You may use authorization plugins to [set permissions on service accounts](/docs/admin/authorization/#a-quick-note-on-service-accounts).

To use a non-default service account, simply set the `spec.serviceAccountName`
field of a pod to the name of the service account you wish to use.

The service account has to exist at the time the pod is created, or it will be rejected.

You cannot update the service account of an already created pod.

You can clean up the service account from this example like this:

```shell
$ kubectl delete serviceaccount/build-robot
```

## Manually create a service account API token.

Suppose we have an existing service account named "build-robot" as mentioned above, and we create
a new secret manually.

```shell
$ cat > /tmp/build-robot-secret.yaml <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: build-robot-secret
  annotations:
    kubernetes.io/service-account.name: build-robot
type: kubernetes.io/service-account-token
EOF
$ kubectl create -f /tmp/build-robot-secret.yaml
secret "build-robot-secret" created
```

Now you can confirm that the newly built secret is populated with an API token for the "build-robot" service account.

Any tokens for non-existent service accounts will be cleaned up by the token controller.

```shell
$ kubectl describe secrets/build-robot-secret
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

**Note:** The content of `token` is elided here.
{: .note}

## Add ImagePullSecrets to a service account

First, create an imagePullSecret, as described [here](/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod). 
Next, verify it has been created.  For example:

```shell
$ kubectl get secrets myregistrykey
NAME             TYPE                              DATA    AGE
myregistrykey    kubernetes.io/.dockerconfigjson   1       1d
```

Next, modify the default service account for the namespace to use this secret as an imagePullSecret.

```shell
kubectl patch serviceaccount default -p '{\"imagePullSecrets\": [{\"name\": \"acrkey\"}]}'
```

Interactive version requiring manual edit:

```shell
$ kubectl get serviceaccounts default -o yaml > ./sa.yaml
$ cat sa.yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  creationTimestamp: 2015-08-07T22:02:39Z
  name: default
  namespace: default
  resourceVersion: "243024"
  selfLink: /api/v1/namespaces/default/serviceaccounts/default
  uid: 052fb0f4-3d50-11e5-b066-42010af0d7b6
secrets:
- name: default-token-uudge
$ vi sa.yaml
[editor session not shown]
[delete line with key "resourceVersion"]
[add lines with "imagePullSecret:"]
$ cat sa.yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  creationTimestamp: 2015-08-07T22:02:39Z
  name: default
  namespace: default
  selfLink: /api/v1/namespaces/default/serviceaccounts/default
  uid: 052fb0f4-3d50-11e5-b066-42010af0d7b6
secrets:
- name: default-token-uudge
imagePullSecrets:
- name: myregistrykey
$ kubectl replace serviceaccount default -f ./sa.yaml
serviceaccounts/default
```

Now, any new pods created in the current namespace will have this added to their spec:

```yaml
spec:
  imagePullSecrets:
  - name: myregistrykey
```

<!--## Adding Secrets to a service account.

TODO: Test and explain how to use additional non-K8s secrets with an existing service account.
-->
