---
title: " Simple leader election with Kubernetes and Docker "
date: 2016-01-11
slug: simple-leader-election-with-kubernetes
url: /blog/2016/01/Simple-Leader-Election-With-Kubernetes
---

####  Overview


Kubernetes simplifies the deployment and operational management of services running on clusters. However, it also simplifies the development of these services. In this post we'll see how you can use Kubernetes to easily perform leader election in your distributed application. Distributed applications usually replicate the tasks of a service for reliability and scalability, but often it is necessary to designate one of the replicas as the leader who is responsible for coordination among all of the replicas.

Typically in leader election, a set of candidates for becoming leader is identified. These candidates all race to declare themselves the leader. One of the candidates wins and becomes the leader. Once the election is won, the leader continually "heartbeats" to renew their position as the leader, and the other candidates periodically make new attempts to become the leader. This ensures that a new leader is identified quickly, if the current leader fails for some reason.

Implementing leader election usually requires either deploying software such as ZooKeeper, etcd or Consul and using it for consensus, or alternately, implementing a consensus algorithm on your own. We will see below that Kubernetes makes the process of using leader election in your application significantly easier.

####  Implementing leader election in Kubernetes


The first requirement in leader election is the specification of the set of candidates for becoming the leader. Kubernetes already uses _Endpoints_ to represent a replicated set of pods that comprise a service, so we will re-use this same object. (aside: You might have thought that we would use _ReplicationControllers_, but they are tied to a specific binary, and generally you want to have a single leader even if you are in the process of performing a rolling update)

To perform leader election, we use two properties of all Kubernetes API objects:

* ResourceVersions - Every API object has a unique ResourceVersion, and you can use these versions to perform compare-and-swap on Kubernetes objects
* Annotations - Every API object can be annotated with arbitrary key/value pairs to be used by clients.

Given these primitives, the code to use master election is relatively straightforward, and you can find it [here][1]. Let's run it ourselves.

```    
$ kubectl run leader-elector --image=gcr.io/google_containers/leader-elector:0.4 --replicas=3 -- --election=example
```

This creates a leader election set with 3 replicas:

```    
$ kubectl get pods
NAME                   READY     STATUS    RESTARTS   AGE
leader-elector-inmr1   1/1       Running   0          13s
leader-elector-qkq00   1/1       Running   0          13s
leader-elector-sgwcq   1/1       Running   0          13s
```

To see which pod was chosen as the leader, you can access the logs of one of the pods, substituting one of your own pod's names in place of

```  
${pod_name}, (e.g. leader-elector-inmr1 from the above)

$ kubectl logs -f ${name}
leader is (leader-pod-name)
```
… Alternately, you can inspect the endpoints object directly:


_'example' is the name of the candidate set from the above kubectl run … command_
```
$ kubectl get endpoints example -o yaml
```
Now to validate that leader election actually works, in a different terminal, run:

```  
$ kubectl delete pods (leader-pod-name)
```
This will delete the existing leader. Because the set of pods is being managed by a replication controller, a new pod replaces the one that was deleted, ensuring that the size of the replicated set is still three. Via leader election one of these three pods is selected as the new leader, and you should see the leader failover to a different pod. Because pods in Kubernetes have a _grace period_ before termination, this may take 30-40 seconds.

The leader-election container provides a simple webserver that can serve on any address (e.g. http://localhost:4040). You can test this out by deleting the existing leader election group and creating a new one where you additionally pass in a --http=(host):(port) specification to the leader-elector image. This causes each member of the set to serve information about the leader via a webhook.

```    
# delete the old leader elector group
$ kubectl delete rc leader-elector

# create the new group, note the --http=localhost:4040 flag
$ kubectl run leader-elector --image=gcr.io/google_containers/leader-elector:0.4 --replicas=3 -- --election=example --http=0.0.0.0:4040

# create a proxy to your Kubernetes api server
$ kubectl proxy
```

You can then access:


http://localhost:8001/api/v1/proxy/namespaces/default/pods/(leader-pod-name):4040/


And you will see:

```  
{"name":"(name-of-leader-here)"}
```
####  Leader election with sidecars


Ok, that's great, you can do leader election and find out the leader over HTTP, but how can you use it from your own application? This is where the notion of sidecars come in. In Kubernetes, Pods are made up of one or more containers. Often times, this means that you add sidecar containers to your main application to make up a Pod. (for a much more detailed treatment of this subject see my earlier blog post).

The leader-election container can serve as a sidecar that you can use from your own application. Any container in the Pod that's interested in who the current master is can simply access http://localhost:4040 and they'll get back a simple JSON object that contains the name of the current master. Since all containers in a Pod share the same network namespace, there's no service discovery required!

For example, here is a simple Node.js application that connects to the leader election sidecar and prints out whether or not it is currently the master. The leader election sidecar sets its identifier to `hostname` by default.

```    
var http = require('http');
// This will hold info about the current master
var master = {};

  // The web handler for our nodejs application
  var handleRequest = function(request, response) {
    response.writeHead(200);
    response.end("Master is " + master.name);
  };

  // A callback that is used for our outgoing client requests to the sidecar
  var cb = function(response) {
    var data = '';
    response.on('data', function(piece) { data = data + piece; });
    response.on('end', function() { master = JSON.parse(data); });
  };

  // Make an async request to the sidecar at http://localhost:4040
  var updateMaster = function() {
    var req = http.get({host: 'localhost', path: '/', port: 4040}, cb);
    req.on('error', function(e) { console.log('problem with request: ' + e.message); });
    req.end();
  };

  / / Set up regular updates
  updateMaster();
  setInterval(updateMaster, 5000);

  // set up the web server
  var www = http.createServer(handleRequest);
  www.listen(8080);
  ```
  Of course, you can use this sidecar from any language that you choose that supports HTTP and JSON.

#### Conclusion


  Hopefully I've shown you how easy it is to build leader election for your distributed application using Kubernetes. In future installments we'll show you how Kubernetes is making building distributed systems even easier. In the meantime, head over to [Google Container Engine][2] or [kubernetes.io][3] to get started with Kubernetes.

  [1]: https://github.com/kubernetes/contrib/pull/353
  [2]: https://cloud.google.com/container-engine/
  [3]: http://kubernetes.io/
