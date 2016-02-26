---
---

Kubernetes has a web-based user interface that displays the current cluster state graphically.

## Accessing the UI

By default, the Kubernetes UI is deployed as a cluster addon. To access it, visit `https://<kubernetes-master>/ui`, which redirects to `https://<kubernetes-master>/api/v1/proxy/namespaces/kube-system/services/kube-ui/#/dashboard/`.

If you find that you're not able to access the UI, it may be because the kube-ui service has not been started on your cluster. In that case, you can start it manually with:

```shell
kubectl create -f cluster/addons/kube-ui/kube-ui-rc.yaml --namespace=kube-system
kubectl create -f cluster/addons/kube-ui/kube-ui-svc.yaml --namespace=kube-system
```

Normally, this should be taken care of automatically by the [`kube-addons.sh`](http://releases.k8s.io/{{page.githubbranch}}/cluster/saltbase/salt/kube-addons/kube-addons.sh) script that runs on the master.

## Using the UI

The Kubernetes UI can be used to introspect your current cluster, such as checking how resources are used, or looking at error messages. You cannot, however, use the UI to modify your cluster.

### Node Resource Usage

After accessing Kubernetes UI, you'll see a homepage dynamically listing out all nodes in your current cluster, with related information including internal IP addresses, CPU usage, memory usage, and file systems usage.

![Kubernetes UI home page](/images/docs/k8s-ui-overview.png)

### Dashboard Views

Click on the "Views" button in the top-right of the page to see other views available, which include: Explore, Pods, Nodes, Replication Controllers, Services, and Events.

#### Explore View

The "Explore" view allows your to see the pods, replication controllers, and services in current cluster easily.

![Kubernetes UI Explore View](/images/docs/k8s-ui-explore.png)

The "Group by" dropdown list allows you to group these resources by a number of factors, such as type, name, host, etc.

![Kubernetes UI Explore View - Group by](/images/docs/k8s-ui-explore-groupby.png)

You can also create filters by clicking on the down triangle of any listed resource instances and choose which filters you want to add.

![Kubernetes UI Explore View - Filter](/images/docs/k8s-ui-explore-filter.png)

To see more details of each resource instance, simply click on it.

![Kubernetes UI - Pod](/images/docs/k8s-ui-explore-poddetail.png)

### Other Views

Other views (Pods, Nodes, Replication Controllers, Services, and Events) simply list information about each type of resource. You can also click on any instance for more details.

![Kubernetes UI - Nodes](/images/docs/k8s-ui-nodes.png)

## More Information

For more information, see the [Kubernetes UI development document](http://releases.k8s.io/{{page.githubbranch}}/www/README.md) in the www directory.