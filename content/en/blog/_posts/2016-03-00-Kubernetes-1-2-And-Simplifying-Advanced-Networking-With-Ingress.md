---
title: " Kubernetes 1.2 and simplifying advanced networking with Ingress "
date: 2016-03-31
slug: kubernetes-1.2-and-simplifying-advanced-networking-with-ingress
url: /blog/2016/03/Kubernetes-1-2-And-Simplifying-Advanced-Networking-With-Ingress
author: >
  Prashanth Balasubramanian (independent)
---
_**Editor's note:** This is the sixth post in a [series of in-depth posts](/blog/2016/03/five-days-of-kubernetes-12) on what's new in Kubernetes 1.2_  
_Ingress is currently in beta and under active development._  

In Kubernetes, Services and Pods have IPs only routable by the cluster network, by default. All traffic that ends up at an edge router is either dropped or forwarded elsewhere. In Kubernetes 1.2, we’ve made improvements to the Ingress object, to simplify allowing inbound connections to reach the cluster services. It can be configured to give services externally-reachable URLs, load balance traffic, terminate SSL, offer name based virtual hosting and lots more.  


### Ingress controllers
Today, with containers or VMs, configuring a web server or load balancer is harder than it should be. Most web server configuration files are very similar. There are some applications that have weird little quirks that tend to throw a wrench in things, but for the most part, you can apply the same logic to them and achieve a desired result. In Kubernetes 1.2, the Ingress resource embodies this idea, and an Ingress controller is meant to handle all the quirks associated with a specific "class" of Ingress (be it a single instance of a load balancer, or a more complicated setup of frontends that provide GSLB, CDN, DDoS protection etc). An Ingress Controller is a daemon, deployed as a Kubernetes Pod, that watches the ApiServer's /ingresses endpoint for updates to the [Ingress resource](/docs/user-guide/ingress/). Its job is to satisfy requests for ingress.  

Your Kubernetes cluster must have exactly one Ingress controller that supports TLS for the following example to work. If you’re on a cloud-provider, first check the “kube-system” namespace for an Ingress controller RC. If there isn’t one, you can deploy the [nginx controller](https://github.com/kubernetes/contrib/tree/master/ingress/controllers/nginx), or [write your own](https://github.com/kubernetes/contrib/tree/master/ingress/controllers#writing-an-ingress-controller) in \< 100 lines of code.  

Please take a minute to look over the known limitations of existing controllers (gce, nginx).  


### TLS termination and HTTP load-balancing
Since the Ingress spans Services, it’s particularly suited for load balancing and centralized security configuration. If you’re familiar with the go programming language, Ingress is like [net/http’s “Server”](https://golang.org/pkg/net/http/#Server) for your entire cluster. The following example shows you how to configure TLS termination. Load balancing is not optional when dealing with ingress traffic, so simply creating the object will configure a load balancer.  

First create a test Service. We’ll run a simple echo server for this example so you know exactly what’s going on. The source is [here](https://github.com/kubernetes/contrib/tree/master/ingress/echoheaders).  
```  
$ kubectl run echoheaders   
--image=gcr.io/google\_containers/echoserver:1.3 --port=8080  
$ kubectl expose deployment echoheaders --target-port=8080   
--type=NodePort  
```
If you’re on a cloud-provider, make sure you can reach the Service from outside the cluster through its node port.  

```
$ NODE_IP=$(kubectl get node `kubectl get po -l run=echoheaders 
--template '{{range .items}}{{.spec.nodeName}}{{end}}'` --template
'{{range $i, $n := .status.addresses}}{{if eq $n.type 
"ExternalIP"}}{{$n.address}}{{end}}{{end}}')
$ NODE_PORT=$(kubectl get svc echoheaders --template '{{range $i, $e 
:= .spec.ports}}{{$e.nodePort}}{{end}}')
$ curl $NODE_IP:$NODE_PORT
```
This is a sanity check that things are working as expected. If the last step hangs, you might need a [firewall rule](https://github.com/kubernetes/contrib/blob/master/ingress/controllers/gce/BETA_LIMITATIONS.md#creating-the-firewall-rule-for-glbc-health-checks).  

Now lets create our TLS secret:  
```
$ openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout   

/tmp/tls.key -out /tmp/tls.crt -subj "/CN=echoheaders/O=echoheaders"

$ echo "  
apiVersion: v1  
kind: Secret  
metadata:
  name: tls  
data:  
  tls.crt: `base64 -w 0 /tmp/tls.crt`  
  tls.key: `base64 -w 0 /tmp/tls.key`  
" | kubectl create -f   
```  
And the Ingress:  

```
$ echo "

apiVersion: extensions/v1beta1

kind: Ingress

metadata:

  name: test

spec:

  tls:

  - secretName: tls
  backend:  
    serviceName: echoheaders  
    servicePort: 8080  
" | kubectl create -f -  
```  
You should get a load balanced IP soon:  
```  
$ kubectl get ing   
NAME      RULE      BACKEND            ADDRESS         AGE  
test      -         echoheaders:8080   130.X.X.X     4m  
```  
And if you wait till the Ingress controller marks your backends as healthy, you should see requests to that IP on :80 getting redirected to :443 and terminated using the given TLS certificates.  
```
$ curl 130.X.X.X  
\<html\>  
\<head\>\<title\>301 Moved Permanently\</title\>\</head\>\<body bgcolor="white"\>\<center\>\<h1\>301 Moved Permanently\</h1\>\</center\>  
```  

```
$ curl https://130.X.X.X -kCLIENT VALUES:client\_address=10.48.0.1command=GETreal path=/  


$ curl 130.X.X.X -Lk

CLIENT VALUES:client\_address=10.48.0.1command=GETreal path=/
```
### Future work
You can read more about the [Ingress API](/docs/user-guide/ingress/) or controllers by following the links. The Ingress is still in beta, and we would love your input to grow it. You can contribute by writing controllers or evolving the API. All things related to the meaning of the word “[ingress](https://www.google.com/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=ingress%20meaning)” are in scope, this includes DNS, different TLS modes, SNI, load balancing at layer 4, content caching, more algorithms, better health checks; the list goes on.  

There are many ways to participate. If you’re particularly interested in Kubernetes and networking, you’ll be interested in:  

- Our [Networking slack channel ](https://kubernetes.slack.com/messages/sig-network/)
- Our [Kubernetes Networking Special Interest Group](https://groups.google.com/forum/#!forum/kubernetes-sig-network) email list
- The Big Data “Special Interest Group,” which meets biweekly at 3pm (15h00) Pacific Time at [SIG-Networking hangout](https://zoom.us/j/5806599998)

And of course for more information about the project in general, go to[www.kubernetes.io](http://kubernetes.io/) 
