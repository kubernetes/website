package kubernetes.placement

import data.kubernetes.clusters

annotations["federation.kubernetes.io/replica-set-preferences"] = preferences {
    input.kind = "ReplicaSet"
    preferences = replica_set_preferences
}

replica_set_clusters[cluster_name] {
    clusters[cluster_name]
    not insufficient_pci[cluster_name]
}

insufficient_pci[cluster_name] {
    clusters[cluster_name]
    input.metadata.annotations["requires-pci"] = "true"
    not pci_clusters[cluster_name]
}

pci_clusters[cluster_name] {
    clusters[cluster_name].metadata.annotations["pci-certified"] = "true"
}

replica_set_preferences = serialized {
    value = {"clusters": cluster_map, "rebalance": true}
    json.marshal(value, serialized)
}

cluster_map[cluster_name] = {"weight": 1} {
    replica_set_clusters[cluster_name]
}
