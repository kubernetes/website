---
title: " Draft: Kubernetes container development made easy "
date: 2017-05-31
slug: draft-kubernetes-container-development
url: /blog/2017/05/Draft-Kubernetes-Container-Development
author: >
  Brendan Burns (Microsoft Azure)
---
About a month ago Microsoft announced the acquisition of Deis to expand our expertise in containers and Kubernetes. Today, I’m excited to announce a new open source project derived from this newly expanded Azure team: Draft.   

While by now the strengths of Kubernetes for deploying and managing applications at scale are well understood. The process of developing a new application for Kubernetes is still too hard. It’s harder still if you are new to containers, Kubernetes, or developing cloud applications.  

Draft fills this role. As its name implies it is a tool that helps you begin that first draft of a containerized application running in Kubernetes. When you first run the draft tool, it automatically discovers the code that you are working on and builds out the scaffolding to support containerizing your application. Using heuristics and a variety of pre-defined project templates draft will create an initial Dockerfile to containerize your application, as well as a Helm Chart to enable your application to be deployed and maintained in a Kubernetes cluster. Teams can even bring their own draft project templates to customize the scaffolding that is built by the tool.  

But the value of draft extends beyond simply scaffolding in some files to help you create your application. Draft also deploys a server into your existing Kubernetes cluster that is automatically kept in sync with the code on your laptop. Whenever you make changes to your application, the draft daemon on your laptop synchronizes that code with the draft server in Kubernetes and a new container is built and deployed automatically without any user action required. Draft enables the “inner loop” development experience for the cloud.  

Of course, as is the expectation with all infrastructure software today, Draft is available as an open source project, and it itself is in “draft” form :) We eagerly invite the community to come and play around with draft today, we think it’s pretty awesome, even in this early form. But we’re especially excited to see how we can develop a community around draft to make it even more powerful for all developers of containerized applications on Kubernetes.  

To give you a sense for what Draft can do, here is an example drawn from the [Getting Started](https://github.com/Azure/draft/blob/master/docs/getting-started.md) page in the [GitHub repository](https://github.com/Azure/draft).  

There are multiple example applications included within the [examples directory](https://github.com/Azure/draft/blob/master/examples). For this walkthrough, we'll be using the [python example application](https://github.com/Azure/draft/tree/master/examples/example-python) which uses [Flask](http://flask.pocoo.org/) to provide a very simple Hello World webserver.  


 ```
$ cd examples/python
  ```


**Draft Create**  

We need some "scaffolding" to deploy our app into a [Kubernetes](https://kubernetes.io/) cluster. Draft can create a [Helm](https://github.com/kubernetes/helm) chart, a Dockerfile and a draft.toml with draft create:  


 ```
$ draft create

--\> Python app detected

--\> Ready to sail

$ ls

Dockerfile  app.py  chart/  draft.toml  requirements.txt
  ```


The chart/ and Dockerfile assets created by Draft default to a basic Python configuration. This Dockerfile harnesses the [python:onbuild image](https://hub.docker.com/_/python/), which will install the dependencies in requirements.txt and copy the current directory into /usr/src/app. And to align with the service values in chart/values.yaml, this Dockerfile exposes port 80 from the container.  

The draft.toml file contains basic configuration about the application like the name, which namespace it will be deployed to, and whether to deploy the app automatically when local files change.  


 ```
$ cat draft.toml  
[environments]  
  [environments.development]  
    name = "tufted-lamb"  
    namespace = "default"  
    watch = true  
    watch\_delay = 2
  ```



**Draft Up**



Now we're ready to deploy app.py to a Kubernetes cluster.

Draft handles these tasks with one draft up command:

- reads configuration from draft.toml
- compresses the chart/ directory and the application directory as two separate tarballs
- uploads the tarballs to draftd, the server-side component
- draftd then builds the docker image and pushes the image to a registry
- draftd instructs helm to install the Helm chart, referencing the Docker registry image just built

With the watch option set to true, we can let this run in the background while we make changes later on…



 ```
$ draft up  
--\> Building Dockerfile  
Step 1 : FROM python:onbuild  
onbuild: Pulling from library/python  
...  
Successfully built 38f35b50162c  
--\> Pushing docker.io/microsoft/tufted-lamb:5a3c633ae76c9bdb81b55f5d4a783398bf00658e  
The push refers to a repository [docker.io/microsoft/tufted-lamb]  
...  
5a3c633ae76c9bdb81b55f5d4a783398bf00658e: digest: sha256:9d9e9fdb8ee3139dd77a110fa2d2b87573c3ff5ec9c045db6009009d1c9ebf5b size: 16384  
--\> Deploying to Kubernetes  
    Release "tufted-lamb" does not exist. Installing it now.  
--\> Status: DEPLOYED  
--\> Notes:  
     1. Get the application URL by running these commands:  
     NOTE: It may take a few minutes for the LoadBalancer IP to be available.  
           You can watch the status of by running 'kubectl get svc -w tufted-lamb-tufted-lamb'  
  export SERVICE\_IP=$(kubectl get svc --namespace default tufted-lamb-tufted-lamb -o jsonpath='{.status.loadBalancer.ingress[0].ip}')  
  echo http://$SERVICE\_IP:80  

Watching local files for changes...
  ```



**Interact with the Deployed App**



Using the handy output that follows successful deployment, we can now contact our app. Note that it may take a few minutes before the load balancer is provisioned by Kubernetes. Be patient!



 ```
$ export SERVICE\_IP=$(kubectl get svc --namespace default tufted-lamb-tufted-lamb -o jsonpath='{.status.loadBalancer.ingress[0].ip}')  
$ curl [http://$SERVICE\_IP](http://%24service_ip/)
  ```



When we curl our app, we see our app in action! A beautiful "Hello World!" greets us.



**Update the App**



Now, let's change the "Hello, World!" output in app.py to output "Hello, Draft!" instead:



 ```
$ cat \<\<EOF \> app.py  
from flask import Flask  

app = Flask(\_\_name\_\_)  

@app.route("/")  
def hello():  
    return "Hello, Draft!\n"  

if \_\_name\_\_ == "\_\_main\_\_":  
    app.run(host='0.0.0.0', port=8080)  
EOF
  ```



**Draft Up(grade)**



Now if we watch the terminal that we initially called draft up with, Draft will notice that there were changes made locally and call draft up again. Draft then determines that the Helm release already exists and will perform a helm upgrade rather than attempting another helm install:



 ```
--\> Building Dockerfile  
Step 1 : FROM python:onbuild  
...  
Successfully built 9c90b0445146  
--\> Pushing docker.io/microsoft/tufted-lamb:f031eb675112e2c942369a10815850a0b8bf190e  
The push refers to a repository [docker.io/microsoft/tufted-lamb]  
...  
--\> Deploying to Kubernetes  
--\> Status: DEPLOYED  
--\> Notes:  
     1. Get the application URL by running these commands:  
     NOTE: It may take a few minutes for the LoadBalancer IP to be available.  
           You can watch the status of by running 'kubectl get svc -w tufted-lamb-tufted-lamb'  
  export SERVICE\_IP=$(kubectl get svc --namespace default tufted-lamb-tufted-lamb -o jsonpath='{.status.loadBalancer.ingress[0].ip}')  
  echo [http://$SERVICE\_IP:80](http://%24service_ip/)
  ```



Now when we run curl http://$SERVICE\_IP, our first app has been deployed and updated to our Kubernetes cluster via Draft!

We hope this gives you a sense for everything that Draft can do to streamline development for Kubernetes. Happy drafting!


- Post questions (or answer questions) on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
- Join the community portal for advocates on [K8sPort](http://k8sport.org/)
- Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates
- Connect with the community on [Slack](http://slack.k8s.io/)
- Get involved with the Kubernetes project on [GitHub](https://github.com/kubernetes/kubernetes)
