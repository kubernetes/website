---
title: Learning kube-scheduler's design and implementation from source code
reviewers:
- wgliang
content_template: templates/concept
toc_hide: true
---

{{% capture overview %}}

{{< note >}}
Be sure to also [create an entry in the table of contents](/docs/home/contribute/write-new-topic/#creating-an-entry-in-the-table-of-contents) for your new document.
{{< /note >}}

Scheduler is one of the important services in Kubernetes which runs in master-node. Understanding kube-scheduler deeper will help us to dig in the workflow and tasks that the Scheduler is actually working on. When we want to learn more about a system, starting with source code is always the right choice. This document is to analyze kube-scheduler's source code to describe how the scheduler is designed and how it is implemented in engineering. The series of articles are listed below:

* [How does the Kubernetes scheduler work?](docs/concepts/scheduling/how-scheduler-works/)
* [How to customize and extend the Kubernetes scheduler?](/docs/concepts/scheduling/customization-and-extension/)
* [How to configure your Kubernetes scheduler?](/docs/concepts/scheduling/configure-scheduler/)
* [Choose scheduling algorithms and strategies for your cluster.](TODO)
* Learn the kube-scheduler's design and implementation from source code.

{{% /capture %}}

{{% capture body %}}

## What does scheduler do? 
The Scheduler watches for new unscheduled pods. It attempts to find nodes that they fit on and writes bindings back to the api server.
![](https://i.imgur.com/hfjM5Ok.png)
Scheduler works as a controller which watches the current system's state and desired state, to serve new request or handle unexpected case. For more details, we need to dive deeper into Scheduler parts. 

## Scheduler command

Kube-scheduler uses [Cobra](https://github.com/spf13/cobra) command to build a powerful CLI which provides commands, flags, etc. For example:

>/etc/kubernetes/manifests/kube-scheduler.yaml
```yaml
spec:
  containers:
  - command:
    - kube-scheduler
    - --address=127.0.0.1
    - --kubeconfig=/etc/kubernetes/scheduler.conf
    - --leader-elect=true
    image: k8s.gcr.io/kube-scheduler:v1.13.1
    imagePullPolicy: IfNotPresent
```

Cobra initializes a new scheduler command has named as *"kube-schedule"* with common flags like usages, helps  and execute it after that.
>cmd/kube-scheduler/scheduler.go
```go
func main() {
    // init Cobra command 
    command := app.NewSchedulerCommand()

    // execute command
    command.Execute()
}
```
The **NewSchedulerCommand()** starts with initializing command options. This creates a default scheduler app options which has all the params needed to run a Scheduler.

The main stuff is actually performing in **runCommand** function inside. It's start point for all of processes after.

## Scheduler configuration
It starts with initializing a configuration from command's arguments. There are some steps to validate and writes the config into the given file name as YAML.
It also builds a leader election configuration for scheduler which guarantees that there is only one instance of kube-scheduler. It will create a new resource lock associated with the configuration.

A quite important configuration is SharedInformer. SharedInformer provides hooks to observe events from a particular resource, such as add, update, delete, etc... and create shared cache among controllers. While PodInformer creates a shared index informer that returns only non-terminal pods.
```go
c.InformerFactory = informers.NewSharedInformerFactory(client, 0)
c.PodInformer = factory.NewPodInformer(client, 0)
```  
The configuration also chooses scheduler algorithm source by the named algorithm provider or from a user specified policy source. 
 

## Schedule
Base on given configuration, the Scheduler starts watching and running in [scheduler.go](https://github.com/kubernetes/kubernetes/blob/master/pkg/scheduler/scheduler.go). 
It waits for cache to be synced, then starts a goroutine and returns immediately. It means _sched.scheduleOne_ will loop forever until StopEverything channel is closed.
```go
func (sched *Scheduler) Run() {
    if !sched.config.WaitForCacheSync() {
        return
    }
    go wait.Until(sched.scheduleOne, 0, sched.config.StopEverything)
}
```
_scheduleOne_ does the entire scheduling workflow for a single pod. 



## References
1. https://blog.heptio.com/core-kubernetes-jazz-improv-over-orchestration-a7903ea92ca

{{% /capture %}}

{{% capture whatsnext %}}

**[Optional Section]**

* Learn more about [Writing a New Topic](/docs/home/contribute/write-new-topic/).
* See [Using Page Templates - Concept template](/docs/home/contribute/page-templates/#concept_template) for how to use this template.

{{% /capture %}}


