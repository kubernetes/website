---
---

{% capture overview %}
This page shows how to use the DNS horizontal autoscaling featrure
in a Kubernetes cluster.
{% endcapture %}

{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

* Make sure the [DNS feature](/docs/admin/dns/) itself
is enabled

* Recommended Kuberentes version 1.4.0 or higher.

{% endcapture %}

{% capture steps %}

### Enable DNS horizontal autoscaling feature

Note: this feature is enabled by default on GCE clusters with Kubernetes version
1.5.0 or higher.

1. Check whether this feature is enabled by listing deployments in your cluster:

		kubectl get deployment --namespace=kube-system

	The output should be similar to this:

		NAME                  DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
		...
		kube-dns-autoscaler   1         1         1            1           <some-time>
		...

	If you see the "kube-dns-autoscaler" deployment, DNS horizontal autoscaling is
	already enabled in your cluster.

1. Get DNS Deployment / ReplicationController name as the scale target:

		kubectl get deployment --namespace=kube-system

	The output should be similar to this:

		NAME         DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
		...
		kube-dns     1         1         1            1           <some-time>
		...

	In this case, the scale target should be Deployment/kube-dns.

	Or DNS may be using Replication Controller with Kubernetes version lower than 1.5.0

		kubectl get rc --namespace=kube-system

	The output should be similar to this:

		NAME            DESIRED   CURRENT   READY     AGE
		...
		kube-dns-v20    1         1         1         <some-time>
		...

	In this case, the scale target should be ReplicationController/kube-dns-v20.

1. Deploy cluster-proportional-autoscaler to autoscale the DNS backends:

	{% include code.html language="yaml" file="dns-horizontal-autoscaler.yaml" ghlink="/docs/tasks/administer-cluster/dns-horizontal-autoscaler.yaml" %}

Above deployment configuration file deploys the horizontal autoscaler for DNS.

Replace the {SCALE_TARGET} with what you got from the second step. Enter below
command to use this configuration file.

	kubectl create -f dns-horizontal-autoscaler.yaml

The output should be:

	deployment "kube-dns-autoscaler" created

DNS horizontal autoscaling is now enabled.

### Tuning autoscaling parameters

1. Confirm the "kube-dns-autoscaler" ConfigMap exists:

		kubectl get configmap --namespace=kube-system

	The output should be similar to this:

		NAME                  DATA      AGE
		...
		kube-dns-autoscaler   1         <some-time>
		...

1. Modify the data in ConfigMap:

		kubectl edit configmap kube-dns-autoscaler --namespace=kube-system

	Look for below line:

		linear: '{"coresPerReplica":256,"min":1,"nodesPerReplica":16}'

	Modify any field above for your own demand. "min" field indicates the minimal
	number of DNS backends. The actual backends number is calculated using below
	equation:

		replicas = max( ceil( cores * 1/coresPerReplica ) , ceil( nodes * 1/nodesPerReplica ) )

	Note that the values of both "coresPerReplica" and "nodesPerReplica" should be
	`int` with Cluster-proportional-autoscaler Version 1.0.0.

	Ideally, when cluster is using large nodes(with more cores), "coresPerReplica"
	should dominate. If using small nodes, "nodesPerReplica" should dominate.

	There are other supported scaling patterns. See [here](
	https://github.com/kubernetes-incubator/cluster-proportional-autoscaler)
	for details.

### Disable DNS horizontal autoscaling feature

There are a few options for turning off this feature. Which option to use depends on
different conditions.

1. Scale down the kube-dns-autoscaler deployment to 0 replica:

	This option works for all situations, use below command:

		kubectl scale deployment --replicas=0 kube-dns-autoscaler --namespace=kube-system

	You should see below output:

		deployment "kube-dns-autoscaler" scaled

	By listing the deployments again, you should see:

		NAME                  DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
		...
		kube-dns-autoscaler   0         0         0            0           <some-time>
		...

2. Delete the kube-dns-autoscaler deployment:

	This option works if kube-dns-autoscaler is under your own control, which means no one
	will re-create it:

		kubectl delete deployment kube-dns-autoscaler --namespace=kube-system

	The output should be:

		deployment "kube-dns-autoscaler" deleted

3. Delete the kube-dns-autoscaler manifest file from the master node:

	This option works if kube-dns-autoscaler is under [the Addon Manager](
	https://github.com/kubernetes/kubernetes/blob/master/cluster/addons/README.md)'s control.
	But you have the write access permission for the master node.

	If above conditions are true, you could log on to the master node and delete the
	corresponding manifest file. The common path for this kube-dns-autoscaler is:

		/etc/kubernetes/addons/dns-horizontal-autoscaler/dns-horizontal-autoscaler.yaml

	Kube-dns-autoscaler deployment and pod will be deleted by the Addon Manager after its
	manifest file is deleted.

{% endcapture %}

{% capture discussion %}

### Understanding how DNS Horizontal Autoscaling works

The cluster-proportional-autoscaler is deployed as a standalone application from the DNS
service. How it works could be demonstrated using below bullet points:

* An autoscaler pod runs a Kubernetes Golang API client to connect to the Apiserver and
polls for the number of nodes and cores in the cluster.

* A desired replica count would be calculated and applied to the DNS backends based on
current schedulable nodes/cores and the given scaling parameters.

* The scaling parameters and data points are provided via a ConfigMap to the autoscaler
 and it refreshes its parameters table every poll interval to be up to date with the
 latest desired scaling parameters.

* On-the-fly changes of the scaling parameters are allowed without rebuilding or
restarting the autoscaler pod.

* The autoscaler provides a controller interface to support multiple control patterns.
Current supported control patterns are `linear` and `ladder`. More comprehensive control
patterns that consider custom metrics will be developed in the future.

### Future Works

One growing direction for this DNS horizontal autoscaling feature is to scale DNS backends
based on DNS specific metrics. The current implementation, which utilizes number of nodes
and cores in cluster, is not practical enough.

On another aspect, this functionality seems to be a fit for custom metric case in [Horizontal
Pod Autoscaler](http://kubernetes.io/docs/user-guide/horizontal-pod-autoscaling/). We may
consider embrace this Custom Metric feature for DNS horizontal autoscaling in the future,
giving that it may have lower maintenance overhead and well defined configuration.

## References

- Learn more about [the implementation of cluster-proportional-autoscaler](
https://github.com/kubernetes-incubator/cluster-proportional-autoscaler).

{% endcapture %}


{% include templates/task.md %}
