---
layout: blog
title: 'Kubernetes 1.23: Pod Security Graduates to Beta'
date: 2021-12-09
slug: pod-security-admission-beta
author: >
   Jim Angel (Google),
   Lachlan Evenson (Microsoft)
---

With the release of Kubernetes v1.23, [Pod Security admission](/docs/concepts/security/pod-security-admission/) has now entered beta. Pod Security is a [built-in](/docs/reference/access-authn-authz/admission-controllers/) admission controller that evaluates pod specifications against a predefined set of [Pod Security Standards](/docs/concepts/security/pod-security-standards/) and determines whether to `admit` or `deny` the pod from running.

Pod Security is the successor to [PodSecurityPolicy](/docs/concepts/security/pod-security-policy/) which was deprecated in the v1.21 release, and will be removed in Kubernetes v1.25. In this article, we cover the key concepts of Pod Security along with how to use it. We hope that cluster administrators and developers alike will use this new mechanism to enforce secure defaults for their workloads.

## Why Pod Security

The overall aim of Pod Security is to let you isolate workloads. You can run a cluster that runs different workloads and, without adding extra third-party tooling, implement controls that require Pods for a workload to restrict their own privileges to a defined bounding set.

Pod Security overcomes key shortcomings of Kubernetes' existing, but deprecated, PodSecurityPolicy (PSP) mechanism:

   * Policy authorization model — challenging to deploy with controllers.
   * Risks around switching — a lack of dry-run/audit capabilities made it hard to enable PodSecurityPolicy.
   * Inconsistent and Unbounded API — the large configuration surface and evolving constraints led to a complex and confusing API.

The shortcomings of PSP made it very difficult to use which led the community to reevaluate whether or not a better implementation could achieve the same goals. One of those goals was to provide an out-of-the-box solution to apply security best practices. Pod Security ships with predefined Pod Security levels that a cluster administrator can configure to meet the desired security posture.

It's important to note that Pod Security doesn't have complete feature parity with the deprecated PodSecurityPolicy. Specifically, it doesn't have the ability to mutate or change Kubernetes resources to auto-remediate a policy violation on behalf of the user. Additionally, it doesn't provide fine-grained control over each allowed field and value within a pod specification or any other Kubernetes resource that you may wish to evaluate. If you need more fine-grained policy control then take a look at these [other](/docs/concepts/security/pod-security-standards/#faq) projects which support such use cases.

Pod Security also adheres to Kubernetes best practices of declarative object management by denying resources that violate the policy. This requires resources to be updated in source repositories, and tooling to be updated prior to being deployed to Kubernetes.

## How Does Pod Security Work?
    
Pod Security is a built-in [admission controller](/docs/reference/access-authn-authz/admission-controllers/) starting with Kubernetes v1.22, but can also be run as a standalone [webhook](/docs/concepts/security/pod-security-admission/#webhook). Admission controllers function by intercepting requests in the Kubernetes API server prior to persistence to storage. They can either `admit` or `deny` a request. In the case of Pod Security, pod specifications will be evaluated against a configured policy in the form of a Pod Security Standard. This means that security sensitive fields in a pod specification will only be allowed to have [specific](h/docs/concepts/security/pod-security-standards/#profile-details) values. 

## Configuring Pod Security
    
### Pod Security Standards
    
In order to use Pod Security we first need to understand [Pod Security Standards](/docs/concepts/security/pod-security-standards/). These standards define three different policy levels that range from permissive to restrictive. These levels are as follows:
   * `privileged` — open and unrestricted
   * `baseline` — Covers known privilege escalations while minimizing restrictions
   * `restricted` — Highly restricted, hardening against known and unknown privilege escalations. May cause compatibility issues

Each of these policy levels define which fields are restricted within a pod specification and the allowed values. Some of the fields restricted by these policies include:
   * `spec.securityContext.sysctls`
   * `spec.hostNetwork`
   * `spec.volumes[*].hostPath`
   * `spec.containers[*].securityContext.privileged`

Policy levels are applied via labels on Namespace resources, which allows for granular per-namespace policy selection. The AdmissionConfiguration in the API server can also be configured to set cluster-wide default levels and exemptions.

### Policy modes

Policies are applied in a specific mode. Multiple modes (with different policy levels) can be set on the same namespace. Here is a list of modes:
   * `enforce` — Any Pods that violate the policy will be rejected
   * `audit` — Violations will be recorded as an annotation in the audit logs, but don't affect whether the pod is allowed.
   * `warn` — Violations will send a warning message back to the user, but don't affect whether the pod is allowed.

In addition to modes you can also pin the policy to a specific version (for example v1.22). Pinning to a specific version allows the behavior to remain consistent if the policy definition changes in future Kubernetes releases.

## Hands on demo

### Prerequisites

- [KinD](https://kind.sigs.k8s.io/docs/user/quick-start/#installation)
- [kubectl](/docs/tasks/tools/)
- [Docker](https://docs.docker.com/get-docker/) or [Podman](https://podman.io/getting-started/installation) container runtime & CLI

### Deploy a kind cluster

```shell
kind create cluster --image kindest/node:v1.23.0
```

It might take a while to start and once it's started it might take a minute or so before the node becomes ready.

```shell
kubectl cluster-info --context kind-kind
```

Wait for the node STATUS to become ready.

```shell
kubectl get nodes
```

The output is similar to this:

```
NAME                 STATUS   ROLES                  AGE   VERSION
kind-control-plane   Ready    control-plane,master   54m   v1.23.0
```

### Confirm Pod Security is enabled

The best way to [confirm the API's default enabled plugins](/docs/reference/access-authn-authz/admission-controllers/#which-plugins-are-enabled-by-default) is to check the Kubernetes API container's help arguments.

```shell
kubectl -n kube-system exec kube-apiserver-kind-control-plane -it -- kube-apiserver -h | grep "default enabled ones"
```

The output is similar to this:

```
...
      --enable-admission-plugins strings
admission plugins that should be enabled in addition
to default enabled ones (NamespaceLifecycle, LimitRanger,
ServiceAccount, TaintNodesByCondition, PodSecurity, Priority,
DefaultTolerationSeconds, DefaultStorageClass,
StorageObjectInUseProtection, PersistentVolumeClaimResize,
RuntimeClass, CertificateApproval, CertificateSigning,
CertificateSubjectRestriction, DefaultIngressClass,
MutatingAdmissionWebhook, ValidatingAdmissionWebhook,
ResourceQuota).
...
```

`PodSecurity` is listed in the group of default enabled admission plugins.

If using a cloud provider, or if you don't have access to the API server, the best way to check would be to run a quick end-to-end test:

```shell
kubectl create namespace verify-pod-security
kubectl label namespace verify-pod-security pod-security.kubernetes.io/enforce=restricted
# The following command does NOT create a workload (--dry-run=server)
kubectl -n verify-pod-security run test --dry-run=server --image=busybox --privileged
kubectl delete namespace verify-pod-security
```

The output is similar to this:

```
Error from server (Forbidden): pods "test" is forbidden: violates PodSecurity "restricted:latest": privileged (container "test" must not set securityContext.privileged=true), allowPrivilegeEscalation != false (container "test" must set securityContext.allowPrivilegeEscalation=false), unrestricted capabilities (container "test" must set securityContext.capabilities.drop=["ALL"]), runAsNonRoot != true (pod or container "test" must set securityContext.runAsNonRoot=true), seccompProfile (pod or container "test" must set securityContext.seccompProfile.type to "RuntimeDefault" or "Localhost")
```

### Configure Pod Security

Policies are applied to a namespace via labels. These labels are as follows:
   * `pod-security.kubernetes.io/<MODE>: <LEVEL>` (required to enable pod security)
   * `pod-security.kubernetes.io/<MODE>-version: <VERSION>` (*optional*, defaults to latest)

A specific version can be supplied for each enforcement mode. The version pins the policy to the version that was shipped as part of the Kubernetes release. Pinning to a specific Kubernetes version allows for deterministic policy behavior while allowing flexibility for future updates to Pod Security Standards. The possible <MODE(S)> are `enforce`, `audit` and `warn`.

### When to use `warn`?

The typical uses for `warn` are to get ready for a future change where you want to enforce a different policy. The most two common cases would be:

* `warn` at the same level but a different version (e.g. pin `enforce` to *restricted+v1.23* and `warn` at *restricted+latest*)
* `warn` at a stricter level (e.g. `enforce` baseline, `warn` restricted)

It's not recommended to use `warn` for the exact same level+version of the policy as `enforce`. In the admission sequence, if `enforce` fails, the entire sequence fails before evaluating the `warn`.

First, create a namespace called `verify-pod-security` if not created earlier. For the demo, `--overwrite` is used when labeling to allow repurposing a single namespace for multiple examples.

```shell
kubectl create namespace verify-pod-security
```

### Deploy demo workloads

Each workload represents a higher level of security that would not pass the profile that comes after it.

For the following examples, use the `busybox` container runs a `sleep` command for 1 million seconds (≅11 days) or until deleted. Pod Security is not interested in which container image you chose, but rather the Pod level settings and their implications for security.

### Privileged level and workload

For the privileged pod, use the [privileged policy](/docs/concepts/security/pod-security-standards/#privileged). This allows the process inside a container to gain new processes (also known as "privilege escalation") and can be dangerous if untrusted.

First, let's apply a restricted Pod Security level for a test.

```shell
# enforces a "restricted" security policy and audits on restricted
kubectl label --overwrite ns verify-pod-security \
  pod-security.kubernetes.io/enforce=restricted \
  pod-security.kubernetes.io/audit=restricted
```

Next, try to deploy a privileged workload in the namespace.

```shell
cat <<EOF | kubectl -n verify-pod-security apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: busybox-privileged
spec:
  containers:
  - name: busybox
    image: busybox
    args:
    - sleep
    - "1000000"
    securityContext:
      allowPrivilegeEscalation: true
EOF
```

The output is similar to this:

```
Error from server (Forbidden): error when creating "STDIN": pods "busybox-privileged" is forbidden: violates PodSecurity "restricted:latest": allowPrivilegeEscalation != false (container "busybox" must set securityContext.allowPrivilegeEscalation=false), unrestricted capabilities (container "busybox" must set securityContext.capabilities.drop=["ALL"]), runAsNonRoot != true (pod or container "busybox" must set securityContext.runAsNonRoot=true), seccompProfile (pod or container "busybox" must set securityContext.seccompProfile.type to "RuntimeDefault" or "Localhost")
```

Now let's apply the privileged Pod Security level and try again.

```shell
# enforces a "privileged" security policy and warns / audits on baseline
kubectl label --overwrite ns verify-pod-security \
  pod-security.kubernetes.io/enforce=privileged \
  pod-security.kubernetes.io/warn=baseline \
  pod-security.kubernetes.io/audit=baseline
```

```shell
cat <<EOF | kubectl -n verify-pod-security apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: busybox-privileged
spec:
  containers:
  - name: busybox
    image: busybox
    args:
    - sleep
    - "1000000"
    securityContext:
      allowPrivilegeEscalation: true
EOF
```

The output is similar to this:

```
pod/busybox-privileged created
```

We can run `kubectl -n verify-pod-security get pods` to verify it is running. Clean up with:

```shell
kubectl -n verify-pod-security delete pod busybox-privileged
```

### Baseline level and workload

The [baseline policy](/docs/concepts/security/pod-security-standards/#baseline) demonstrates sensible defaults while preventing common container exploits.

Let's revert back to a restricted Pod Security level for a quick test.

```shell
# enforces a "restricted" security policy and audits on restricted
kubectl label --overwrite ns verify-pod-security \
  pod-security.kubernetes.io/enforce=restricted \
  pod-security.kubernetes.io/audit=restricted
```

Apply the workload.

```shell
cat <<EOF | kubectl -n verify-pod-security apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: busybox-baseline
spec:
  containers:
  - name: busybox
    image: busybox
    args:
    - sleep
    - "1000000"
    securityContext:
      allowPrivilegeEscalation: false
      capabilities:
        add:
          - NET_BIND_SERVICE
          - CHOWN
EOF
```

The output is similar to this:

```
Error from server (Forbidden): error when creating "STDIN": pods "busybox-baseline" is forbidden: violates PodSecurity "restricted:latest": unrestricted capabilities (container "busybox" must set securityContext.capabilities.drop=["ALL"]; container "busybox" must not include "CHOWN" in securityContext.capabilities.add), runAsNonRoot != true (pod or container "busybox" must set securityContext.runAsNonRoot=true), seccompProfile (pod or container "busybox" must set securityContext.seccompProfile.type to "RuntimeDefault" or "Localhost")
```

Let's apply the baseline Pod Security level and try again.

```shell
# enforces a "baseline" security policy and warns / audits on restricted
kubectl label --overwrite ns verify-pod-security \
  pod-security.kubernetes.io/enforce=baseline \
  pod-security.kubernetes.io/warn=restricted \
  pod-security.kubernetes.io/audit=restricted
```

```shell
cat <<EOF | kubectl -n verify-pod-security apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: busybox-baseline
spec:
  containers:
  - name: busybox
    image: busybox
    args:
    - sleep
    - "1000000"
    securityContext:
      allowPrivilegeEscalation: false
      capabilities:
        add:
          - NET_BIND_SERVICE
          - CHOWN
EOF
```

The output is similar to the following. Note that the warnings match the error message from the test above, but the pod is still successfully created.

```
Warning: would violate PodSecurity "restricted:latest": unrestricted capabilities (container "busybox" must set securityContext.capabilities.drop=["ALL"]; container "busybox" must not include "CHOWN" in securityContext.capabilities.add), runAsNonRoot != true (pod or container "busybox" must set securityContext.runAsNonRoot=true), seccompProfile (pod or container "busybox" must set securityContext.seccompProfile.type to "RuntimeDefault" or "Localhost")
pod/busybox-baseline created
```

Remember, we set the `verify-pod-security` namespace to `warn` based on the restricted profile. We can run `kubectl -n verify-pod-security get pods` to verify it is running.  Clean up with:

```shell
kubectl -n verify-pod-security delete pod busybox-baseline
```

### Restricted level and workload

The [restricted policy](/docs/concepts/security/pod-security-standards/#restricted) requires rejection of all privileged parameters. It is the most secure with a trade-off for complexity.
The restricted policy allows containers to add the `NET_BIND_SERVICE` capability only.

While we've already tested restricted as a blocking function, let's try to get something running that meets all the criteria.

First we need to reapply the restricted profile, for the last time.

```shell
# enforces a "restricted" security policy and audits on restricted
kubectl label --overwrite ns verify-pod-security \
  pod-security.kubernetes.io/enforce=restricted \
  pod-security.kubernetes.io/audit=restricted
```

```shell
cat <<EOF | kubectl -n verify-pod-security apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: busybox-restricted
spec:
  containers:
  - name: busybox
    image: busybox
    args:
    - sleep
    - "1000000"
    securityContext:
      allowPrivilegeEscalation: false
      capabilities:
        add:
          - NET_BIND_SERVICE
EOF
```

The output is similar to this:

```
Error from server (Forbidden): error when creating "STDIN": pods "busybox-restricted" is forbidden: violates PodSecurity "restricted:latest": unrestricted capabilities (container "busybox" must set securityContext.capabilities.drop=["ALL"]), runAsNonRoot != true (pod or container "busybox" must set securityContext.runAsNonRoot=true), seccompProfile (pod or container "busybox" must set securityContext.seccompProfile.type to "RuntimeDefault" or "Localhost")
```

This is because the restricted profile explicitly requires that certain values are set to the most secure parameters.

By requiring explicit values, manifests become more declarative and your entire security model can shift left. With the `restricted` level of enforcement, a company could audit their cluster's compliance based on permitted manifests.

Let's fix each warning resulting in the following file:

```shell
cat <<EOF | kubectl -n verify-pod-security apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: busybox-restricted
spec:
  containers:
  - name: busybox
    image: busybox
    args:
    - sleep
    - "1000000"
    securityContext:
      seccompProfile:
        type: RuntimeDefault
      runAsNonRoot: true
      allowPrivilegeEscalation: false
      capabilities:
        drop:
          - ALL
        add:
          - NET_BIND_SERVICE
EOF
```

The output is similar to this:

```
pod/busybox-restricted created
```

Run `kubectl -n verify-pod-security get pods` to verify it is running. The output is similar to this:

```
NAME               READY   STATUS                       RESTARTS   AGE
busybox-restricted   0/1     CreateContainerConfigError   0          2m26s
```

Let's figure out why the container is not starting with `kubectl -n verify-pod-security describe pod busybox-restricted`. The output is similar to this:

```
Events:
  Type     Reason     Age                    From               Message
  ----     ------     ----                   ----               -------
  Warning  Failed     2m29s (x8 over 3m55s)  kubelet            Error: container has runAsNonRoot and image will run as root (pod: "busybox-restricted_verify-pod-security(a4c6a62d-2166-41a9-b288-20df17cf5c90)", container: busybox)
```

To solve this, set the effective UID (`runAsUser`) to a non-zero (root) value or use the `nobody` UID (65534).

```shell
# delete the original pod
kubectl -n verify-pod-security delete pod busybox-restricted

# create the pod again with new runAsUser
cat <<EOF | kubectl -n verify-pod-security apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: busybox-restricted
spec:
  securityContext:
    runAsUser: 65534
  containers:
  - name: busybox
    image: busybox
    args:
    - sleep
    - "1000000"
    securityContext:
      seccompProfile:
        type: RuntimeDefault
      runAsNonRoot: true
      allowPrivilegeEscalation: false
      capabilities:
        drop:
          - ALL
        add:
          - NET_BIND_SERVICE
EOF
```

Run `kubectl -n verify-pod-security get pods` to verify it is running. The output is similar to this:

```
NAME                 READY   STATUS    RESTARTS   AGE
busybox-restricted   1/1     Running   0          25s
```

Clean up the demo (restricted pod and namespace) with:

```shell
kubectl delete namespace verify-pod-security
```

At this point, if you wanted to dive deeper into linux permissions or what is permitted for a certain container, exec into the control plane and play around with `containerd` and `crictl inspect`.

```shell
# if using docker, shell into the control plane
docker exec -it kind-control-plane bash

# list running containers
crictl ps

# inspect each one by container ID
crictl inspect <CONTAINER ID>
```

### Applying a cluster-wide policy

In addition to applying labels to namespaces to configure policy you can also configure cluster-wide policies and exemptions using the AdmissionConfiguration resource. 

Using this resource, policy definitions are applied cluster-wide by default and any policy that is applied via namespace labels will take precedence. 

There is no runtime configurable API for the `AdmissionConfiguration` configuration file so a cluster administrator would need to specify a path to the file below via the `--admission-control-config-file` flag on the API server. 

In the following resource we are enforcing the baseline policy and warning and auditing the baseline policy. We are also making the kube-system namespace exempt from this policy.

It's not recommended to alter control plane / clusters after install, so let's build a new cluster with a default policy on all namespaces.

First, delete the current cluster.

```shell
kind delete cluster
```

Create a Pod Security configuration that `enforce` and `audit` baseline policies while using a restricted profile to `warn` the end user.

```shell
cat <<EOF > pod-security.yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
- name: PodSecurity
  configuration:
    apiVersion: pod-security.admission.config.k8s.io/v1beta1
    kind: PodSecurityConfiguration
    defaults:
      enforce: "baseline"
      enforce-version: "latest"
      audit: "baseline"
      audit-version: "latest"
      warn: "restricted"
      warn-version: "latest"
    exemptions:
      # Array of authenticated usernames to exempt.
      usernames: []
      # Array of runtime class names to exempt.
      runtimeClasses: []
      # Array of namespaces to exempt.
      namespaces: [kube-system]
EOF
```

For additional options, check out the official [_standards admission controller_](/docs/tasks/configure-pod-container/enforce-standards-admission-controller/#configure-the-admission-controller) docs.

We now have a default baseline policy. Next pass it to the kind configuration to enable the `--admission-control-config-file` API server argument and pass the policy file. To pass a file to a kind cluster, use a configuration file to pass additional setup instructions. Kind uses `kubeadm` to provision the cluster and the configuration file has the ability to pass `kubeadmConfigPatches` for further customization. In our case, the local file is mounted into the control plane node as `/etc/kubernetes/policies/pod-security.yaml` which is then mounted into the `apiServer` container. We also pass the `--admission-control-config-file` argument pointing to the policy's location.

```shell
cat <<EOF > kind-config.yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
  kubeadmConfigPatches:
  - |
    kind: ClusterConfiguration
    apiServer:
        # enable admission-control-config flag on the API server
        extraArgs:
          admission-control-config-file: /etc/kubernetes/policies/pod-security.yaml
        # mount new file / directories on the control plane
        extraVolumes:
          - name: policies
            hostPath: /etc/kubernetes/policies
            mountPath: /etc/kubernetes/policies
            readOnly: true
            pathType: "DirectoryOrCreate"
  # mount the local file on the control plane
  extraMounts:
  - hostPath: ./pod-security.yaml
    containerPath: /etc/kubernetes/policies/pod-security.yaml
    readOnly: true
EOF
```

Create a new cluster using the kind configuration file defined above.

```shell
kind create cluster --image kindest/node:v1.23.0 --config kind-config.yaml
```

Let's look at the default namespace.

```shell
kubectl describe namespace default
```

The output is similar to this:

```
Name:         default
Labels:       kubernetes.io/metadata.name=default
Annotations:  <none>
Status:       Active

No resource quota.

No LimitRange resource.
```

Let's create a new namespace and see if the labels apply there.

```shell
kubectl create namespace test-defaults
kubectl describe namespace test-defaults
```

Same.

```
Name:         test-defaults
Labels:       kubernetes.io/metadata.name=test-defaults
Annotations:  <none>
Status:       Active

No resource quota.

No LimitRange resource.
```

Can a privileged workload be deployed?

```shell
cat <<EOF | kubectl -n test-defaults apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: busybox-privileged
spec:
  containers:
  - name: busybox
    image: busybox
    args:
    - sleep
    - "1000000"
    securityContext:
      allowPrivilegeEscalation: true
EOF
```

Hmm... yep. The default `warn` level is working at least.

```
Warning: would violate PodSecurity "restricted:latest": allowPrivilegeEscalation != false (container "busybox" must set securityContext.allowPrivilegeEscalation=false), unrestricted capabilities (container "busybox" must set securityContext.capabilities.drop=["ALL"]), runAsNonRoot != true (pod or container "busybox" must set securityContext.runAsNonRoot=true), seccompProfile (pod or container "busybox" must set securityContext.seccompProfile.type to "RuntimeDefault" or "Localhost")
pod/busybox-privileged created
```

Let's delete the pod with `kubectl -n test-defaults delete pod/busybox-privileged`.

Is my config even working?

```shell
# if using docker, shell into the control plane
docker exec -it kind-control-plane bash

# cat out the file we mounted
cat /etc/kubernetes/policies/pod-security.yaml

# check the api server logs
cat /var/log/containers/kube-apiserver*.log 

# check the api server config
cat /etc/kubernetes/manifests/kube-apiserver.yaml 
```

**UPDATE:** The baseline policy permits `allowPrivilegeEscalation`. While I cannot see the Pod Security default levels of enforcement, they are there. Let's try to provide a manifest that violates the baseline by requesting hostNetwork access.

```shell
# delete the original pod
kubectl -n test-defaults delete pod busybox-privileged

cat <<EOF | kubectl -n test-defaults apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: busybox-privileged
spec:
  containers:
  - name: busybox
    image: busybox
    args:
    - sleep
    - "1000000"
  hostNetwork: true
EOF
```

The output is similar to this:

```
Error from server (Forbidden): error when creating "STDIN": pods "busybox-privileged" is forbidden: violates PodSecurity "baseline:latest": host namespaces (hostNetwork=true)
```

#### Yes!!! It worked! 🎉🎉🎉 {#it-worked}

I later found out, another way to check if things are operating as intended is to check the raw API server metrics endpoint.

Run the following command:

```
kubectl get --raw /metrics | grep pod_security_evaluations_total
```

The output is similar to this:

```
# HELP pod_security_evaluations_total [ALPHA] Number of policy evaluations that occurred, not counting ignored or exempt requests.
# TYPE pod_security_evaluations_total counter
pod_security_evaluations_total{decision="allow",mode="enforce",policy_level="baseline",policy_version="latest",request_operation="create",resource="pod",subresource=""} 2
pod_security_evaluations_total{decision="allow",mode="enforce",policy_level="privileged",policy_version="latest",request_operation="create",resource="pod",subresource=""} 0
pod_security_evaluations_total{decision="allow",mode="enforce",policy_level="privileged",policy_version="latest",request_operation="update",resource="pod",subresource=""} 0
pod_security_evaluations_total{decision="deny",mode="audit",policy_level="baseline",policy_version="latest",request_operation="create",resource="pod",subresource=""} 1
pod_security_evaluations_total{decision="deny",mode="enforce",policy_level="baseline",policy_version="latest",request_operation="create",resource="pod",subresource=""} 1
pod_security_evaluations_total{decision="deny",mode="warn",policy_level="restricted",policy_version="latest",request_operation="create",resource="controller",subresource=""} 2
pod_security_evaluations_total{decision="deny",mode="warn",policy_level="restricted",policy_version="latest",request_operation="create",resource="pod",subresource=""} 2
```

A monitoring tool could ingest these metrics too for reporting, assessments, or measuring trends.

## Clean up

When finished, delete the kind cluster.

```shell
kind delete cluster
```

## Auditing

Auditing is another way to track what policies are being enforced in your cluster. To set up auditing with kind, review the official docs for [enabling auditing](https://kind.sigs.k8s.io/docs/user/auditing/). As of [version 1.11](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.11.md#sig-auth), Kubernetes audit logs include two annotations that indicate whether or not a request was authorized (`authorization.k8s.io/decision`) and the reason for the decision (`authorization.k8s.io/reason`). Audit events can be streamed to a webhook for monitoring, tracking, or alerting.

The audit events look similar to the following:

```yaml
{"authorization.k8s.io/decision":"allow","authorization.k8s.io/reason":"","pod-security.kubernetes.io/audit":"allowPrivilegeEscalation != false (container \"busybox\" must set securityContext.allowPrivilegeEscalation=false), unrestricted capabilities (container \"busybox\" must set securityContext.capabilities.drop=[\"ALL\"]), runAsNonRoot != true (pod or container \"busybox\" must set securityContext.runAsNonRoot=true), seccompProfile (pod or container \"busybox\" must set securityContext.seccompProfile.type to \"RuntimeDefault\" or \"Localhost\")"}}
```

Auditing is also a good first step in evaluating your cluster's current compliance with Pod Security. The Kubernetes Enhancement Proposal (KEP) hints at a future where `baseline` [could be the default for unlabeled namespaces](https://github.com/kubernetes/enhancements/blob/master/keps/sig-auth/2579-psp-replacement/README.md#rollout-of-baseline-by-default-for-unlabeled-namespaces).


Example `audit-policy.yaml` configuration tuned for Pod Security events:

```
apiVersion: audit.k8s.io/v1
kind: Policy
rules:
- level: RequestResponse
  resources:
    - group: "" # core API group
      resources: ["pods", "pods/ephemeralcontainers", "podtemplates", "replicationcontrollers"]
    - group: "apps"
      resources: ["daemonsets", "deployments", "replicasets", "statefulsets"]
    - group: "batch"
      resources: ["cronjobs", "jobs"]
  verbs: ["create", "update"]
  omitStages:
    - "RequestReceived"
    - "ResponseStarted"
    - "Panic"
```

Once auditing is enabled, look at the configured local file if using `--audit-log-path` or the destination of a webhook if using `--audit-webhook-config-file`.

If using a file (`--audit-log-path`), run `cat /PATH/TO/API/AUDIT.log | grep "is forbidden:"` to see all rejected workloads audited.

## PSP migrations

If you're already using PSP, SIG Auth has created a guide and [published the steps to migrate off of PSP](/docs/tasks/configure-pod-container/migrate-from-psp/).

To summarize the process:
- Update all existing PSPs to be non-mutating
- Apply Pod Security policies in `warn` or `audit` mode
- Upgrade Pod Security policies to `enforce` mode
- Remove `PodSecurityPolicy` from `--enable-admission-plugins`

Listed as "optional future extensions" and currently out of scope, SIG Auth has kicked around the idea of providing a tool to assist with migrations. More [details in the KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-auth/2579-psp-replacement/README.md#automated-psp-migration-tooling).

## Wrap up

Pod Security is a promising new feature that provides an out-of-the-box way to allow users to improve the security posture of their workloads. Like any new enhancement that has matured to beta, we ask that you try it out, provide feedback, or share your experience via either raising a Github issue or joining SIG Auth community meetings. It's our hope that Pod Security will be deployed on every cluster in our ongoing pursuit as a community to make Kubernetes security a priority.

For a step by step guide on how to enable "baseline" Pod Security Standards with Pod Security Admission feature please refer to these dedicated [tutorials](/docs/tutorials/security/) that cover the configuration needed at cluster level and namespace level.

## Additional resources

- [Official Pod Security Docs](/docs/concepts/security/pod-security-admission/)
- [Enforce Pod Security Standards with Namespace Labels](/docs/tasks/configure-pod-container/enforce-standards-namespace-labels/)
- [Enforce Pod Security Standards by Configuring the Built-in Admission Controller](/docs/tasks/configure-pod-container/enforce-standards-admission-controller/)
- [Official Kubernetes Enhancement Proposal](https://github.com/kubernetes/enhancements/blob/master/keps/sig-auth/2579-psp-replacement/README.md) (KEP)
- [PodSecurityPolicy Deprecation: Past, Present, and Future](/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/)
- [Hands on with Kubernetes Pod Security](https://medium.com/@LachlanEvenson/hands-on-with-kubernetes-pod-security-admission-b6cac495cd11)