---
assignees:
- bprashanth
- davidopp
- derekwaynecarr
- erictune
- janetkuo
- thockin
title: Using Admission Controllers
---

* TOC
{:toc}

## What are they?

An admission control plug-in is a piece of code that intercepts requests to the Kubernetes
API server prior to persistence of the object, but after the request is authenticated
and authorized.  The plug-in code is in the API server process
and must be compiled into the binary in order to be used at this time.

Each admission control plug-in is run in sequence before a request is accepted into the cluster.  If
any of the plug-ins in the sequence reject the request, the entire request is rejected immediately
and an error is returned to the end-user.

Admission control plug-ins may mutate the incoming object in some cases to apply system configured
defaults.  In addition, admission control plug-ins may mutate related resources as part of request
processing to do things like increment quota usage.

## Why do I need them?

Many advanced features in Kubernetes require an admission control plug-in to be enabled in order
to properly support the feature.  As a result, a Kubernetes API server that is not properly
configured with the right set of admission control plug-ins is an incomplete server and will not
support all the features you expect.

## How do I turn on an admission control plug-in?

The Kubernetes API server supports a flag, `admission-control` that takes a comma-delimited,
ordered list of admission control choices to invoke prior to modifying objects in the cluster.

## What does each plug-in do?

### AlwaysAdmit

Use this plugin by itself to pass-through all requests.

### AlwaysPullImages

This plug-in modifies every new Pod to force the image pull policy to Always. This is useful in a
multitenant cluster so that users can be assured that their private images can only be used by those
who have the credentials to pull them. Without this plug-in, once an image has been pulled to a
node, any pod from any user can use it simply by knowing the image's name (assuming the Pod is
scheduled onto the right node), without any authorization check against the image. When this plug-in
is enabled, images are always pulled prior to starting containers, which means valid credentials are
required.

### AlwaysDeny

Rejects all requests.  Used for testing.

### DenyExecOnPrivileged (deprecated)

This plug-in will intercept all requests to exec a command in a pod if that pod has a privileged container.

If your cluster supports privileged containers, and you want to restrict the ability of end-users to exec
commands in those containers, we strongly encourage enabling this plug-in.

This functionality has been merged into [DenyEscalatingExec](#denyescalatingexec).

### DenyEscalatingExec

This plug-in will deny exec and attach commands to pods that run with escalated privileges that
allow host access.  This includes pods that run as privileged, have access to the host IPC namespace, and
have access to the host PID namespace.

If your cluster supports containers that run with escalated privileges, and you want to
restrict the ability of end-users to exec commands in those containers, we strongly encourage
enabling this plug-in.

### ImagePolicyWebhook

The ImagePolicyWebhook plug-in allows a backend webhook to make admission decisions. You enable this plug-in by setting the admission-control option as follows:

```shell
--admission-control=ImagePolicyWebhook
```

#### Configuration File Format
ImagePolicyWebhook uses the admission 
config file (`--admission-control-config-file`) to set configuration options for the behavior of the backend. This file may be json or yaml and has the following format:

```javascript
{
  "imagePolicy": {
     "kubeConfigFile": "path/to/kubeconfig/for/backend",
     "allowTTL": 50,           // time in s to cache approval
     "denyTTL": 50,            // time in s to cache denial
     "retryBackoff": 500,      // time in ms to wait between retries
     "defaultAllow": true      // determines behavior if the webhook backend fails
  }
}
```

The config file must reference a [kubeconfig](/docs/user-guide/kubeconfig-file/) formatted file which sets up the connection to the backend. It is required that the backend communicate over TLS.

The kubeconfig file's cluster field must point to the remote service, and the user field must contain the returned authorizer.

```yaml
# clusters refers to the remote service.
clusters:
- name: name-of-remote-imagepolicy-service
  cluster:
    certificate-authority: /path/to/ca.pem    # CA for verifying the remote service.
    server: https://images.example.com/policy # URL of remote service to query. Must use 'https'.

# users refers to the API server's webhook configuration.
users:
- name: name-of-api-server
  user:
    client-certificate: /path/to/cert.pem # cert for the webhook plugin to use
    client-key: /path/to/key.pem          # key matching the cert
```
For additional HTTP configuration, refer to the [kubeconfig](/docs/user-guide/kubeconfig-file/) documentation.

#### Request Payloads

When faced with an admission decision, the API Server POSTs a JSON serialized api.imagepolicy.v1alpha1.ImageReview object describing the action. This object contains fields describing the containers being admitted, as well as any pod annotations that match `*.image-policy.k8s.io/*`.

Note that webhook API objects are subject to the same versioning compatibility rules as other Kubernetes API objects. Implementers should be aware of looser compatibility promises for alpha objects and check the "apiVersion" field of the request to ensure correct deserialization. Additionally, the API Server must enable the imagepolicy.k8s.io/v1alpha1 API extensions group (`--runtime-config=imagepolicy.k8s.io/v1alpha1=true`).

An example request body:

```
{  
  "apiVersion":"imagepolicy.k8s.io/v1alpha1",
  "kind":"ImageReview",
  "spec":{  
    "containers":[  
      {  
        "image":"myrepo/myimage:v1"
      },
      {  
        "image":"myrepo/myimage@sha256:beb6bd6a68f114c1dc2ea4b28db81bdf91de202a9014972bec5e4d9171d90ed"
      }
    ],
    "annotations":[  
      "mycluster.image-policy.k8s.io/ticket-1234": "break-glass"
    ],
    "namespace":"mynamespace"
  }
}
```

The remote service is expected to fill the ImageReviewStatus field of the request and respond to either allow or disallow access. The response body's "spec" field is ignored and may be omitted. A permissive response would return:

```
{
  "apiVersion": "imagepolicy.k8s.io/v1alpha1",
  "kind": "ImageReview",
  "status": {
    "allowed": true
  }
}
```

To disallow access, the service would return:

```
{
  "apiVersion": "imagepolicy.k8s.io/v1alpha1",
  "kind": "ImageReview",
  "status": {
    "allowed": false,
    "reason": "image currently blacklisted"
  }
}
```

For further documentation refer to the `imagepolicy.v1alpha1` API objects and `plugin/pkg/admission/imagepolicy/admission.go`.

#### Extending with Annotations

All annotations on a Pod that match `*.image-policy.k8s.io/*` are sent to the webhook. Sending annotations allows users who are aware of the image policy backend to send extra information to it, and for different backends implementations to accept different information.

Examples of information you might put here are:

 * request to "break glass" to override a policy, in case of emergency.
 * a ticket number from a ticket system that documents the break-glass request
 * provide a hint to the policy server as to the imageID of the image being provided, to save it a lookup

In any case, the annotations are provided by the user and are not validated by Kubernetes in any way. In the future, if an annotation is determined to be widely useful, it may be promoted to a named field of ImageReviewSpec.

### ServiceAccount

This plug-in implements automation for [serviceAccounts](/docs/user-guide/service-accounts).
We strongly recommend using this plug-in if you intend to make use of Kubernetes `ServiceAccount` objects.

### SecurityContextDeny

This plug-in will deny any pod with a [SecurityContext](/docs/user-guide/security-context) that defines options that were not available on the `Container`.

### ResourceQuota

This plug-in will observe the incoming request and ensure that it does not violate any of the constraints
enumerated in the `ResourceQuota` object in a `Namespace`.  If you are using `ResourceQuota`
objects in your Kubernetes deployment, you MUST use this plug-in to enforce quota constraints.

See the [resourceQuota design doc](https://github.com/kubernetes/kubernetes/blob/{{page.githubbranch}}/docs/design/admission_control_resource_quota.md) and the [example of Resource Quota](/docs/admin/resourcequota/) for more details.

It is strongly encouraged that this plug-in is configured last in the sequence of admission control plug-ins.  This is
so that quota is not prematurely incremented only for the request to be rejected later in admission control.

### LimitRanger

This plug-in will observe the incoming request and ensure that it does not violate any of the constraints
enumerated in the `LimitRange` object in a `Namespace`.  If you are using `LimitRange` objects in
your Kubernetes deployment, you MUST use this plug-in to enforce those constraints. LimitRanger can also
be used to apply default resource requests to Pods that don't specify any; currently, the default LimitRanger
applies a 0.1 CPU requirement to all Pods in the `default` namespace.

See the [limitRange design doc](https://github.com/kubernetes/kubernetes/blob/{{page.githubbranch}}/docs/design/admission_control_limit_range.md) and the [example of Limit Range](/docs/admin/limitrange/) for more details.

### InitialResources (experimental)

This plug-in observes pod creation requests. If a container omits compute resource requests and limits,
then the plug-in auto-populates a compute resource request based on historical usage of containers running the same image.
If there is not enough data to make a decision the Request is left unchanged.
When the plug-in sets a compute resource request, it annotates the pod with information on what compute resources it auto-populated.

See the [InitialResouces proposal](https://github.com/kubernetes/kubernetes/blob/{{page.githubbranch}}/docs/proposals/initial-resources.md) for more details.

### NamespaceLifecycle

This plug-in enforces that a `Namespace` that is undergoing termination cannot have new objects created in it,
and ensures that requests in a non-existent `Namespace` are rejected.

A `Namespace` deletion kicks off a sequence of operations that remove all objects (pods, services, etc.) in that
namespace.  In order to enforce integrity of that process, we strongly recommend running this plug-in.

### DefaultStorageClass

This plug-in observes creation of `PersistentVolumeClaim` objects that do not request any specific storage class
and automatically adds a default storage class to them.
This way, users that do not request any special storage class do no need to care about them at all and they
will get the default one.

This plug-in does not do anything when no default storage class is configured. When more than one storage
class is marked as default, it rejects any creation of `PersistentVolumeClaim` with an error and administrator
must revisit `StorageClass` objects and mark only one as default.
This plugin ignores any `PersistentVolumeClaim` updates, it acts only on creation.

See [persistent volume](/docs/user-guide/persistent-volumes) documentation about persistent volume claims and
storage classes and how to mark a storage class as default.

## Is there a recommended set of plug-ins to use?

Yes.

For Kubernetes >= 1.4.0, we strongly recommend running the following set of admission control plug-ins (order matters):

```shell
--admission-control=NamespaceLifecycle,LimitRanger,ServiceAccount,DefaultStorageClass,ResourceQuota
```

For Kubernetes >= 1.2.0, we strongly recommend running the following set of admission control plug-ins (order matters):

```shell
--admission-control=NamespaceLifecycle,LimitRanger,ServiceAccount,ResourceQuota
```

For Kubernetes >= 1.0.0, we strongly recommend running the following set of admission control plug-ins (order matters):

```shell
--admission-control=NamespaceLifecycle,LimitRanger,SecurityContextDeny,ServiceAccount,PersistentVolumeLabel,ResourceQuota
```
