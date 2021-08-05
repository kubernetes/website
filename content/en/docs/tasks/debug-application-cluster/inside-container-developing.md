---
title: Developing and debugging applications running in your cluster
content_type: task
---

Kubernetes applications are generally composed of many microservices. Due to environment differences and resource constraints, these microservices somtimes can not run locally as source code. Therefore, developers need to rebuild the image, modify the image version of the workload and then wait for the Pod scheduling after coding. This causes the low efficiency of development in Kubernetes emvironment.

This page describes how you can external tools to debug an application that's running in your cluster.

The tools covered are:
{{% thirdparty-content %}}

- [Nocalhost](https://nocalhost.dev)

Nocalhost is a tool that enables developers to develop applications in Kubernetes Cluster. It can transfer the remote workload to development mode by using Nocalhost IDE (including VSCode and Jetbrains). When the developer writes code locally, any code changes will be automatically synchronized to the remote development container and initiate the application update immediately (depending on the hot load mechanism of the application or restart the application). The development container inherits all the declarative configurations (configmap, secret, volume, Env) from the original workload, which provides the basis for the application to run in the development container as source code.

This is an tutorial of developing services in the container in Kubernetes environment using  `Nocalhost` .

## {{% heading "prerequisites" %}}

* {{< include "task-tutorial-prereqs.md" >}}
*  A local IDE: either Microsoft Visual Studio Code, or Jetbrains
*  Nocalhost itself. To learn how to install Nocalhost, visit [Installation](https://nocalhost.dev/eng/installation/)

## Add Kubeconfig for Nocalhost 

We take the VSCode extension as an example here. Open the Nocalhost extension, then you can add the Kubernetes Cluster by selecting the context in `~/.kube/config` or pasting the "kubeconfig".

![Pasting kubeconfig to Nocalhost VSCode plugin](/images/docs/paste-kubeconfig-to-nocalhost.png)

## Install the Demo application 

After adding the cluster, open it and it will displays all  `Namespace`. Find the  `default` Namespace and click the right button ![](/images/docs/nocalhost-deploy.png).

Select "Deploy Demo" to install the "bookinfo" application of lstio examples.

![Install bookinfo demo](/images/docs/nocalhost-demo.png)

After the application is installed, open the "bookinfo" application and enter the "Deplpoyment" menu. When all service icons turn green, the application becomes ready.

![Wait bookinfo becomes ready](/images/docs/nocalhost-bookinfo.png)

Next, open `127.0.0.1:39080` in the browser to access the `productpage` service. You will see the following interface.

![Bookinfo productpage](/images/docs/nocalhost-bookinfo-productpage.png)

## Develop service

Here, assume that we are going to modify the line “The Comedy of Errors” on the interface (known to be the output of the  `productpage` service). Generally, we have two methods.

* The first method is to modify the source code, and then execute `docker build` to build the image. Push it to the image registry, update the image version of the workload and wait for it to work.
* The second method is to use tools such as  `Telepresence`. Run `productpage` service locally as source code and intercept the local domain name resolution to the remote cluster to access the  `details`, `ratings`, `reviews` services of the remote.

For some complex microservices, it is very difficult to run locally as source code due to environment differences and resource constraints. Hence, we have no choice but go back to the first method, which is the current situation of many complex application development.

But now, with Nocalhost, you have a new choice: develop the service in the container.

It becomes very easy to develop `productpage` services. Click the ![](/images/docs/nocalhost-start-develop.png) icon on the right side of the service on the extension, and select "Clone from Git Repo" in the pop-up menu and then choose a local directory. Nocalhost will atomatically clone the source code of this service and enter its development mode.

In development mode, IDE will open the source code in a new window and obtain access to the remote container  `Terminal` .

![Nocalhost remote dev container](/images/docs/nocalhost-remote-dev-container.png)

Execute `ls` command in the  `Terminal` :

```
Dockerfile  README.md  productpage.py  requirements.txt  run.sh  static  templates  test-requirements.txt  tests
```

You can find that the source code of  `productpage` has been synchronized to the container. Then execute the command:

```
sh run.sh
```

The `productpage` service will start in a moment .

Next, use `VSCode` to edit the `355` line of  `productpage.py` file in the current workplace. Change `The Comedy of Errors` to `The Comedy of Errors Code Change Here`, and save the changes.

![Productpage Code](/images/docs/nocalhost-bookinfo-productpage-code-change.png)

In your web browser, refresh the window or tab where you have `http://127.0.0.1:39080/` open. You will see the following interface:

![Productpage after code changed](/images/docs/nocalhost-bookinfo-productpage-new-web.png)

Now, any code changes will be automatically synchronized to the remote. Since the `productpage` service has the hot reload ablity, the changes will work with immediate effect.

## {{% heading "whatsnext" %}}

* Learn about [Developing and debugging services locally](/docs/tasks/debug-application-cluster/local-debugging/)