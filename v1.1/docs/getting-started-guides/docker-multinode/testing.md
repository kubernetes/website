---
title: "Testing your Kubernetes cluster."
---
To validate that your node(s) have been added, run:

{% highlight sh %}

kubectl get nodes

{% endhighlight %}

That should show something like:

{% highlight console %}

NAME           LABELS                                 STATUS
10.240.99.26   kubernetes.io/hostname=10.240.99.26    Ready
127.0.0.1      kubernetes.io/hostname=127.0.0.1       Ready

{% endhighlight %}

If the status of any node is `Unknown` or `NotReady` your cluster is broken, double check that all containers are running properly, and if all else fails, contact us on [Slack](../../troubleshooting.html#slack).

### Run an application

{% highlight sh %}

kubectl -s http://localhost:8080 run nginx --image=nginx --port=80

{% endhighlight %}

now run `docker ps` you should see nginx running.  You may need to wait a few minutes for the image to get pulled.

### Expose it as a service

{% highlight sh %}

kubectl expose rc nginx --port=80

{% endhighlight %}

Run the following command to obtain the IP of this service we just created. There are two IPs, the first one is internal (CLUSTER_IP), and the second one is the external load-balanced IP.

{% highlight sh %}

kubectl get svc nginx

{% endhighlight %}

Alternatively, you can obtain only the first IP (CLUSTER_IP) by running:

{% highlight sh %}

kubectl get svc nginx --template={{.spec.clusterIP}}

{% endhighlight %}

Hit the webserver with the first IP (CLUSTER_IP):

{% highlight sh %}

curl <insert-cluster-ip-here>

{% endhighlight %}

Note that you will need run this curl command on your boot2docker VM if you are running on OS X.

### Scaling

Now try to scale up the nginx you created before:

{% highlight sh %}

kubectl scale rc nginx --replicas=3

{% endhighlight %}

And list the pods

{% highlight sh %}

kubectl get pods

{% endhighlight %}

You should see pods landing on the newly added machine.



