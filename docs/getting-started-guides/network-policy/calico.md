---
assignees:
- caseydavenport

---

You can deploy a cluster using Calico for network policy in the default [GCE deployment](/docs/getting-started-guides/gce) using the following set of commands:

```shell
export NETWORK_POLICY_PROVIDER=calico
curl -sS https://get.k8s.io | bash
```

See the [Calico documentation](https://github.com/projectcalico/calico-containers/tree/master/docs/cni/kubernetes#getting-started) for more options to deploy Calico with Kubernetes.

Once your cluster using Calico is running, you should see a collection of pods running in the `kube-system` Namespace that support Kubernetes NetworkPolicy.

```console
$ kubectl get pods --namespace=kube-system
NAME                                                 READY     STATUS    RESTARTS   AGE
calico-node-kubernetes-minion-group-jck6             1/1       Running   0          46m
calico-node-kubernetes-minion-group-k9jy             1/1       Running   0          46m
calico-node-kubernetes-minion-group-szgr             1/1       Running   0          46m
calico-policy-controller-65rw1                       1/1       Running   0          46m
...
```

There are two main components to be aware of:

- One `calico-node` Pod runs on each node in your cluster, and enforces network policy on the traffic to/from Pods on that machine by configuring iptables.
- The `calico-policy-controller` Pod reads policy and label information from the Kubernetes API and configures Calico appropriately.

Once your cluster is running, you can follow the [NetworkPolicy gettting started guide](/docs/getting-started-guides/network-policy/walkthrough) to try out Kubernetes NetworkPolicy.
