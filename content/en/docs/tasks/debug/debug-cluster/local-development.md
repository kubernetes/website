---
title: Local development using mirrord
content_type: task
---

<!-- overview -->

{{% thirdparty-content %}}

`mirrord` is an open-source tool that lets developers run local processes in the context of their cloud environment. 
It makes it easy to test your code on a Kubernetes environment without actually going through the hassle of Dockerization, CI, or deployment, and without disrupting the environment by deploying untested code. 
Instead of saving cloud testing for the last step, mirrord lets you shift it all the way left, letting you run your code in the context of your Kubernetes cluster from the very beginning of your development process.
 
When mirrord is executed, it injects itself into your local process, and starts a temporary pod in your Kubernetes cluster called the mirrord Agent. 
It then overrides low level functions in your local process, and relays them to a pod in your Kubernetes cluster through the mirrord Agent. mirrord does this for incoming and outgoing traffic, file access, and environment variables, so your process "thinks" it's running in the pod you selected, even though it's actually running locally.
 
This document describes using `mirrord` to develop and debug services
running on a remote cluster locally.

## {{% heading "prerequisites" %}}

* Kubernetes cluster is installed
* `kubectl` is configured to communicate with the cluster
* [mirrord](https://mirrord.dev/docs/overview/quick-start/#cli-tool) is installed. This guide uses the mirrord CLI tool, but plugins for VS Code and IntelliJ IDEs are also available.

<!-- steps -->

## Developing or debugging an existing service

When developing an application on Kubernetes, you typically program
or debug a single service. The service might require access to other
services for testing and debugging. One option is to use the continuous
deployment pipeline, but even the fastest deployment pipeline introduces
a delay in the program or debug cycle. Additionally, by deploying untested code to the cluster, you risk affecting the other developers using it.

mirrord lets you run your new code within the context of a pod or deployment in your cluster, without deploying it there. The pod or deployment whose context you want your local process to run in is called the Target.

To use mirrord to develop a specific service, use the following command:
`mirrord exec -t pod/<the pod running your service in the cluster> <the command that runs your service>`

For example:
`mirrord exec -t pod/my-pod-123 python main.py`
 
Running this command executes your local binary with mirrord injected into it. On initialization, mirrord starts a temporary pod in your cluster called the mirrord Agent, 
then overrides low level functions and relays them to the Target you selected through the Agent. For example, when your process tries to read a file, mirrord intercepts that call, and reads the file from the Target instead.
The process is still running locally, and so you can debug it in your IDE the same way you always would, or make small changes and test them out quickly in cloud conditions.

Everything mirrord does can be configured to run either locally or remotely and so suit any type of use case. Incoming traffic supports the following modes:
- Mirroring: mirrord duplicates incoming traffic to the remote pod and sends a copy to your local process. The request is handled by the remote pod.
- Stealing: mirrord intercepts the incoming traffic to the remote pod and sends it to your local process. The request is handled by the local process.
- Stealing with a filter: mirrord only steals incoming traffic that matches a filter you specified, on either an HTTP header or a path. Requests matching the filter are handled by the local process, and all other traffic is handled by the remote pod.

## Running a tool with cluster connectivity

Sometimes during development you want to run a tool or utility in the cluster, like psql or pgAdmin. You can do it with mirrord - simply run the above command without specifying a target, for example:
`mirrord exec psql postgresql://dbmaster:5433/mydb`

mirrord will then relay all traffic sent from the tool to the Kubernetes cluster. It would gain access to any endpoint that's accessible from within the cluster - even if the endpoint is hosted elsewhere.

## {{% heading "whatsnext" %}}

If you're interested in reading more about mirrord, please check out the [official documentation](https://mirrord.dev/docs/overview/introduction/).
