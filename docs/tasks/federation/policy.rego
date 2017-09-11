# OPA supports a high-level declarative language named Rego for authoring and
# enforcing policies. For more infomration on Rego, visit
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
# server will merge these annotatiosn into incoming Federated resources. By
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
