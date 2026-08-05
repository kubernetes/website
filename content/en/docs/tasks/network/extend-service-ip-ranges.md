---
reviewers:
- thockin
- dwinship
min-kubernetes-server-version: v1.29
title: Extend Service IP Ranges
content_type: task
---

<!-- overview -->
{{< feature-state feature_gate_name="MultiCIDRServiceAllocator" >}}

This document shares how to extend the existing Service IP range assigned to a cluster.


## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

{{< version-check >}}

{{< note >}}
While you can use this feature with an earlier version, the feature is only GA and officially supported since v1.33.
{{< /note >}}

<!-- steps -->

## Extend Service IP Ranges

Kubernetes clusters with kube-apiservers that have enabled the `MultiCIDRServiceAllocator`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) and have the
`networking.k8s.io/v1` API group active, will create a ServiceCIDR object that takes
the well-known name `kubernetes`, and that specifies an IP address range
based on the value of the `--service-cluster-ip-range` command line argument to kube-apiserver.

```sh
kubectl get servicecidr
```

```
NAME         CIDRS          AGE
kubernetes   10.96.0.0/28   17d
```

The well-known `kubernetes` Service, that exposes the kube-apiserver endpoint to the Pods, calculates
the first IP address from the default ServiceCIDR range and uses that IP address as its
cluster IP address.

```sh
kubectl get service kubernetes
```

```
NAME         TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
kubernetes   ClusterIP   10.96.0.1    <none>        443/TCP   17d
```

The default Service, in this case, uses the ClusterIP 10.96.0.1, that has the corresponding IPAddress object.

```sh
kubectl get ipaddress 10.96.0.1
```

```
NAME        PARENTREF
10.96.0.1   services/default/kubernetes
```

The ServiceCIDRs are protected with {{<glossary_tooltip text="finalizers" term_id="finalizer">}},
to avoid leaving Service ClusterIPs orphans; the finalizer is only removed if there is another subnet
that contains the existing IPAddresses or there are no IPAddresses belonging to the subnet.

## Extend the number of available IPs for Services

There are cases that users will need to increase the number addresses available to Services,
previously, increasing the Service range was a disruptive operation that could also cause data loss.
With this new feature users only need to add a new ServiceCIDR to increase the number of available addresses.

### Adding a new ServiceCIDR

On a cluster with a 10.96.0.0/28 range for Services, there is only 2^(32-28) - 2 = 14
IP addresses available. The `kubernetes.default` Service is always created; for this example,
that leaves you with only 13 possible Services.

```sh
for i in $(seq 1 13); do kubectl create service clusterip "test-$i" --tcp 80 -o json | jq -r .spec.clusterIP; done
```

```
10.96.0.11
10.96.0.5
10.96.0.12
10.96.0.13
10.96.0.14
10.96.0.2
10.96.0.3
10.96.0.4
10.96.0.6
10.96.0.7
10.96.0.8
10.96.0.9
error: failed to create ClusterIP service: Internal error occurred: failed to allocate a serviceIP: range is full
```

You can increase the number of IP addresses available for Services, by creating a new ServiceCIDR
that extends or adds new IP address ranges.

```sh
cat <EOF | kubectl apply -f -
apiVersion: networking.k8s.io/v1
kind: ServiceCIDR
metadata:
  name: newcidr1
spec:
  cidrs:
  - 10.96.0.0/24
EOF
```

```
servicecidr.networking.k8s.io/newcidr1 created
```

and this will allow you to create new Services with ClusterIPs that will be picked from this new range.

```sh
for i in $(seq 13 16); do kubectl create service clusterip "test-$i" --tcp 80 -o json | jq -r .spec.clusterIP; done
```

```
10.96.0.48
10.96.0.200
10.96.0.121
10.96.0.144
```

### Deleting a ServiceCIDR

You cannot delete a ServiceCIDR if there are IPAddresses that depend on the ServiceCIDR.

```sh
kubectl delete servicecidr newcidr1
```

```
servicecidr.networking.k8s.io "newcidr1" deleted
```

Kubernetes uses a finalizer on the ServiceCIDR to track this dependent relationship.

```sh
kubectl get servicecidr newcidr1 -o yaml
```

```yaml
apiVersion: networking.k8s.io/v1
kind: ServiceCIDR
metadata:
  creationTimestamp: "2023-10-12T15:11:07Z"
  deletionGracePeriodSeconds: 0
  deletionTimestamp: "2023-10-12T15:12:45Z"
  finalizers:
  - networking.k8s.io/service-cidr-finalizer
  name: newcidr1
  resourceVersion: "1133"
  uid: 5ffd8afe-c78f-4e60-ae76-cec448a8af40
spec:
  cidrs:
  - 10.96.0.0/24
status:
  conditions:
  - lastTransitionTime: "2023-10-12T15:12:45Z"
    message: There are still IPAddresses referencing the ServiceCIDR, please remove
      them or create a new ServiceCIDR
    reason: OrphanIPAddress
    status: "False"
    type: Ready
```

By removing the Services containing the IP addresses that are blocking the deletion of the ServiceCIDR

```sh
for i in $(seq 13 16); do kubectl delete service "test-$i" ; done
```

```
service "test-13" deleted
service "test-14" deleted
service "test-15" deleted
service "test-16" deleted
```

the control plane notices the removal. The control plane then removes its finalizer,
so that the ServiceCIDR that was pending deletion will actually be removed.

```sh
kubectl get servicecidr newcidr1
```

```
Error from server (NotFound): servicecidrs.networking.k8s.io "newcidr1" not found
```

## Kubernetes Service CIDR Policies

Cluster administrators can implement policies to control the creation and
modification of ServiceCIDR resources within the cluster. This allows for
centralized management of the IP address ranges used for Services and helps
prevent unintended or conflicting configurations. Kubernetes provides mechanisms
like Validating Admission Policies to enforce these rules.

### Preventing Unauthorized ServiceCIDR Creation/Update using Validating Admission Policy

There can be situations that the cluster administrators want to restrict the
ranges that can be allowed or to completely deny any changes to the cluster
Service IP ranges.

{{< note >}}
The default "kubernetes" ServiceCIDR is created by the kube-apiserver
to provide consistency in the cluster and is required for the cluster to work,
so it always must be allowed. You can ensure your `ValidatingAdmissionPolicy`
doesn't restrict the default ServiceCIDR by adding the clause:

```yaml
  matchConditions:
  - name: 'exclude-default-servicecidr'
    expression: "object.metadata.name != 'kubernetes'"
```

as in the examples below.
{{</ note >}}

#### Restrict Service CIDR ranges to some specific ranges

The following is an example of a `ValidatingAdmissionPolicy` that only allows
ServiceCIDRs to be created if they are subranges of the given `allowed` ranges.
(So the example policy would allow a ServiceCIDR with `cidrs: ['10.96.1.0/24']`
or `cidrs: ['2001:db8:0:0:ffff::/80', '10.96.0.0/20']` but would not allow a
ServiceCIDR with `cidrs: ['172.20.0.0/16']`.) You can copy this policy and change
the value of `allowed` to something appropriate for you cluster.

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicy
metadata:
  name: "servicecidrs.default"
spec:
  failurePolicy: Fail
  matchConstraints:
    resourceRules:
    - apiGroups:   ["networking.k8s.io"]
      apiVersions: ["v1"]
      operations:  ["CREATE", "UPDATE"]
      resources:   ["servicecidrs"]
  matchConditions:
  - name: 'exclude-default-servicecidr'
    expression: "object.metadata.name != 'kubernetes'"
  variables:
  - name: allowed
    expression: "['10.96.0.0/16','2001:db8::/64']"
  validations:
  - expression: "object.spec.cidrs.all(newCIDR, variables.allowed.exists(allowedCIDR, cidr(allowedCIDR).containsCIDR(newCIDR)))"
  # For all CIDRs (newCIDR) listed in the spec.cidrs of the submitted ServiceCIDR
  # object, check if there exists at least one CIDR (allowedCIDR) in the `allowed`
  # list of the VAP such that the allowedCIDR fully contains the newCIDR.
---
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicyBinding
metadata:
  name: "servicecidrs-binding"
spec:
  policyName: "servicecidrs.default"
  validationActions: [Deny,Audit]
```

Consult the [CEL documentation](https://kubernetes.io/docs/reference/using-api/cel/)
to learn more about CEL if you want to write your own validation `expression`.

#### Restrict any usage of the ServiceCIDR API

The following example demonstrates how to use a `ValidatingAdmissionPolicy` and
its binding to restrict the creation of any new Service CIDR ranges, excluding the default "kubernetes" ServiceCIDR:

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicy
metadata:
  name: "servicecidrs.deny"
spec:
  failurePolicy: Fail
  matchConstraints:
    resourceRules:
    - apiGroups:   ["networking.k8s.io"]
      apiVersions: ["v1"]
      operations:  ["CREATE", "UPDATE"]
      resources:   ["servicecidrs"]
  validations:
  - expression: "object.metadata.name == 'kubernetes'"
---
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicyBinding
metadata:
  name: "servicecidrs-deny-binding"
spec:
  policyName: "servicecidrs.deny"
  validationActions: [Deny,Audit]
```
