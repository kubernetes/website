---
title: Set up placement policies in Federation
content_template: templates/task
weight: 135
---

{{% capture overview %}}

{{< deprecationfilewarning >}}
{{< include "federation-deprecation-warning-note.md" >}}
{{< /deprecationfilewarning >}}

This page shows how to enforce policy-based placement decisions over Federated
resources using an external policy engine.

{{% /capture %}}

{{% capture prerequisites %}}

You need to have a running Kubernetes cluster (which is referenced as host
cluster). Please see one of the [getting started](/docs/setup/)
guides for installation instructions for your platform.

{{% /capture %}}

{{% capture steps %}}

## Deploying Federation and configuring an external policy engine

The Federation control plane can be deployed using `kubefed init`.

After deploying the Federation control plane, you must configure an Admission
Controller in the Federation API server that enforces placement decisions
received from the external policy engine.

    kubectl apply -f scheduling-policy-admission.yaml

Shown below is an example ConfigMap for the Admission Controller:

{{< codenew file="federation/scheduling-policy-admission.yaml" >}}

The ConfigMap contains three files:

* `config.yml` specifies the location of the `SchedulingPolicy` Admission
  Controller config file.
* `scheduling-policy-config.yml` specifies the location of the kubeconfig file
  required to contact the external policy engine. This file can also include a
  `retryBackoff` value that controls the initial retry backoff delay in
  milliseconds.
* `opa-kubeconfig` is a standard kubeconfig containing the URL and credentials
  needed to contact the external policy engine.

Edit the Federation API server deployment to enable the `SchedulingPolicy`
Admission Controller.

	kubectl -n federation-system edit deployment federation-apiserver

Update the Federation API server command line arguments to enable the Admission
Controller and mount the ConfigMap into the container. If there's an existing
`--enable-admission-plugins` flag, append `,SchedulingPolicy` instead of adding
another line.

    --enable-admission-plugins=SchedulingPolicy
    --admission-control-config-file=/etc/kubernetes/admission/config.yml

Add the following volume to the Federation API server pod:

    - name: admission-config
      configMap:
        name: admission

Add the following volume mount the Federation API server `apiserver` container:

    volumeMounts:
    - name: admission-config
      mountPath: /etc/kubernetes/admission

## Deploying an external policy engine

The [Open Policy Agent (OPA)](http://openpolicyagent.org) is an open source,
general-purpose policy engine that you can use to enforce policy-based placement
decisions in the Federation control plane.

Create a Service in the host cluster to contact the external policy engine:

    kubectl apply -f policy-engine-service.yaml

Shown below is an example Service for OPA.

{{< codenew file="federation/policy-engine-service.yaml" >}}

Create a Deployment in the host cluster with the Federation control plane:

    kubectl apply -f policy-engine-deployment.yaml

Shown below is an example Deployment for OPA.

{{< codenew file="federation/policy-engine-deployment.yaml" >}}

## Configuring placement policies via ConfigMaps

The external policy engine will discover placement policies created in the
`kube-federation-scheduling-policy` namespace in the Federation API server.

Create the namespace if it does not already exist:

    kubectl --context=federation create namespace kube-federation-scheduling-policy

Configure a sample policy to test the external policy engine:

```
# OPA supports a high-level declarative language named Rego for authoring and
# enforcing policies. For more information on Rego, visit
# http://openpolicyagent.org.

# Rego policies are namespaced by the "package" directive.
package kubernetes.placement

# Imports provide aliases for data inside the policy engine. In this case, the
# policy simply refers to "clusters" below.
import data.kubernetes.clusters

# The "annotations" rule generates a JSON object containing the key
# "federation.kubernetes.io/replica-set-preferences" mapped to <preferences>.
# The preferences values is generated dynamically by OPA when it evaluates the
# rule.
#
# The SchedulingPolicy Admission Controller running inside the Federation API
# server will merge these annotations into incoming Federated resources. By
# setting replica-set-preferences, we can control the placement of Federated
# ReplicaSets.
#
# Rules are defined to generate JSON values (booleans, strings, objects, etc.)
# When OPA evaluates a rule, it generates a value IF all of the expressions in
# the body evaluate successfully. All rules can be understood intuitively as
# <head> if <body> where <body> is true if <expr-1> AND <expr-2> AND ...
# <expr-N> is true (for some set of data.)
annotations["federation.kubernetes.io/replica-set-preferences"] = preferences {
    input.kind = "ReplicaSet"
    value = {"clusters": cluster_map, "rebalance": true}
    json.marshal(value, preferences)
}

# This "annotations" rule generates a value for the "federation.alpha.kubernetes.io/cluster-selector"
# annotation.
#
# In English, the policy asserts that resources in the "production" namespace
# that are not annotated with "criticality=low" MUST be placed on clusters
# labelled with "on-premises=true".
annotations["federation.alpha.kubernetes.io/cluster-selector"] = selector {
    input.metadata.namespace = "production"
    not input.metadata.annotations.criticality = "low"
    json.marshal([{
        "operator": "=",
        "key": "on-premises",
        "values": "[true]",
    }], selector)
}

# Generates a set of cluster names that satisfy the incoming Federated
# ReplicaSet's requirements. In this case, just PCI compliance.
replica_set_clusters[cluster_name] {
    clusters[cluster_name]
    not insufficient_pci[cluster_name]
}

# Generates a set of clusters that must not be used for Federated ReplicaSets
# that request PCI compliance.
insufficient_pci[cluster_name] {
    clusters[cluster_name]
    input.metadata.annotations["requires-pci"] = "true"
    not pci_clusters[cluster_name]
}

# Generates a set of clusters that are PCI certified. In this case, we assume
# clusters are annotated to indicate if they have passed PCI compliance audits.
pci_clusters[cluster_name] {
    clusters[cluster_name].metadata.annotations["pci-certified"] = "true"
}

# Helper rule to generate a mapping of desired clusters to weights. In this
# case, weights are static.
cluster_map[cluster_name] = {"weight": 1} {
    replica_set_clusters[cluster_name]
}
```

Shown below is the command to create the sample policy:

    kubectl --context=federation -n kube-federation-scheduling-policy create configmap scheduling-policy --from-file=policy.rego

This sample policy illustrates a few key ideas:

* Placement policies can refer to any field in Federated resources.
* Placement policies can leverage external context (for example, Cluster
  metadata) to make decisions.
* Administrative policy can be managed centrally.
* Policies can define simple interfaces (such as the `requires-pci` annotation) to
  avoid duplicating logic in manifests.

## Testing placement policies

Annotate one of the clusters to indicate that it is PCI certified.

    kubectl --context=federation annotate clusters cluster-name-1 pci-certified=true

Deploy a Federated ReplicaSet to test the placement policy.

{{< codenew file="federation/replicaset-example-policy.yaml" >}}

Shown below is the command to deploy a ReplicaSet that *does* match the policy.

    kubectl --context=federation create -f replicaset-example-policy.yaml

Inspect the ReplicaSet to confirm the appropriate annotations have been applied:

    kubectl --context=federation get rs nginx-pci -o jsonpath='{.metadata.annotations}'

{{% /capture %}}


