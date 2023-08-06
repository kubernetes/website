---
reviewers:
- verb
- yujuhong
title: Ephemeral Containers
content_type: concept
weight: 80
---

<!-- overview -->

{{< feature-state state="stable" for_k8s_version="v1.25" >}}

This page provides an overview of ephemeral containers: a special type of container
that runs temporarily in an existing {{< glossary_tooltip term_id="pod" >}} to
accomplish user-initiated actions such as troubleshooting. You use ephemeral
containers to inspect services rather than to build applications.

<!-- body -->

## Understanding ephemeral containers

{{< glossary_tooltip text="Pods" term_id="pod" >}} are the fundamental building
block of Kubernetes applications. Since Pods are intended to be disposable and
replaceable, you cannot add a container to a Pod once it has been created.
Instead, you usually delete and replace Pods in a controlled fashion using
{{< glossary_tooltip text="deployments" term_id="deployment" >}}.

Sometimes it's necessary to inspect the state of an existing Pod, however, for
example to troubleshoot a hard-to-reproduce bug. In these cases you can run
an ephemeral container in an existing Pod to inspect its state and run
arbitrary commands.

### What is an ephemeral container?

Ephemeral containers differ from other containers in that they lack guarantees
for resources or execution, and they will never be automatically restarted, so
they are not appropriate for building applications.  Ephemeral containers are
described using the same `ContainerSpec` as regular containers, but many fields
are incompatible and disallowed for ephemeral containers.

- Ephemeral containers may not have ports, so fields such as `ports`,
  `livenessProbe`, `readinessProbe` are disallowed.
- Pod resource allocations are immutable, so setting `resources` is disallowed.
- For a complete list of allowed fields, see the [EphemeralContainer reference
  documentation](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#ephemeralcontainer-v1-core).

Ephemeral containers are created using a special `ephemeralcontainers` handler
in the API rather than by adding them directly to `pod.spec`, so it's not
possible to add an ephemeral container using `kubectl edit`.

Like regular containers, you may not change or remove an ephemeral container
after you have added it to a Pod.

{{< note >}}
Ephemeral containers are not supported by [static pods](/docs/tasks/configure-pod-container/static-pod/).
{{< /note >}}

## Uses for ephemeral containers

Ephemeral containers are useful for interactive troubleshooting when `kubectl
exec` is insufficient because a container has crashed or a container image
doesn't include debugging utilities.

In particular, [distroless images](https://github.com/GoogleContainerTools/distroless)
enable you to deploy minimal container images that reduce attack surface
and exposure to bugs and vulnerabilities. Since distroless images do not include a
shell or any debugging utilities, it's difficult to troubleshoot distroless
images using `kubectl exec` alone.

When using ephemeral containers, it's helpful to enable [process namespace
sharing](/docs/tasks/configure-pod-container/share-process-namespace/) so
you can view processes in other containers.

## {{% heading "whatsnext" %}}

* Learn how to [debug pods using ephemeral containers](/docs/tasks/debug/debug-application/debug-running-pod/#ephemeral-container).

### Kubernetes Ephemeral Container Security
Attempting to debug a Pod and realizing that you can't install curl due to 
security settings has to be a meme at this point. Good security practices 
are always nice but it often comes at the cost of usability. To the point 
where some may even solve this problem by installing debug tools into their
production images. Shudders.

Kubernetes has introduced a new concept called ephemeral containers to deal
with this problem. Ephemeral containers are temporary containers that can be
attached after a Pod has been created. Rejoice! We can now attach a temporary
container with all the tools which we desire. While the applications container 
may have "annoying security features" like a read only file system the ephemeral 
container can enjoy all the freedom which writing files entails. I love this feature
so I need to upgrade my cluster immediately


## Digging Deeper

Now that we have the new feature we can start a ephemeral container in any Pod we like  

```shell
kubectl run ephemeral-demo --image=k8s.gcr.io/pause:3.1 --restart=Never
kubectl debug -it ephemeral-demo --image=busybox:1.28
```

We get a shell and life is now much simpler, but wait a minute.
This post is not about how to use ephemeral containers, there are 
enough of those already, but rather the security implications of enabling 
ephemeral containers. Let's have a look at the YAML for the Pod that we 
created the ephemeral container in.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: ephemeral-demo
spec:
  ...
  ephemeralContainers:
  - name: debugger-r59b7
    image: busybox:1.28
    imagePullPolicy: IfNotPresent
    stdin: true
    tty: true
```
                            
Interesting, there is a new field called ephemeralContainers in the Pod 
definition. This new field contains a list of containers similar to
initContainers and containers. It is not identical as there are certain
options which are not available, refer to the API documentation for more
information. It does however allow configuration of the container security 
context, which could in theory allow a bad actor to escalate the container's
privileges. This should not affect those of us who use a policy enforcement
tool right? The answer is yes and no depending on the tool and version that 
is being used. It also depends on if you are using policies from the project's
library or policies developed in house.


## OPA Gatekeeper

OPA Gatekeeper does not require any code changes as all of its policies are 
written in rego. It's sub project Gateekper Library does however have to be 
updated. The library contains an implementation of the common Pod Security
Policies. This includes policies like not allowing containers in privileged 
mode. The issue with the all of the policies is that they currently only 
check containers specified in initContainers and containers, analyze the 
following rego as an example.

The good news is that this is a pretty easy fix, the bad news is
that it requires end users to update the policies pulled from the library.


## Pod Security Policies

Pod Security Policies used to be the default policy tool for Kubernetes,
and a lot of projects have rules based on Pod Security Policies (PSP).
However if you are relying on PSP in a modern cluster you should really
start looking for other options like OPA Gatekeeper or Kyverno. 
PSP has been deprecated since Kubernetes v1.21 and will be removed in v1.25.

If PSP is your only policy tool and you are planning to upgrade to v1.23,
don't. As PSP is deprecated no new features have been added, and that
includes policy enforcement on ephemeral containers. Which means that
any security context in an ephemeral container is allowed no matter 
the PSP in the cluster. The PSP below will have no affect when adding
an ephemeral container to a Pod which is privileged.  
   
```yaml
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: default
spec:
  privileged: false
  seLinux:
    rule: RunAsAny
  supplementalGroups:
    rule: RunAsAny
  runAsUser:
    rule: RunAsAny
  fsGroup:
    rule: RunAsAny
  volumes:
  - '*'

```

## RBAC

Disallowing ephemeral containers with RBAC could be an option if
the feature is not needed and it is not possible to disable the
feature completely. The KEP-277: Ephemeral Containers state the
following about using RBAC to disable ephemeral containers.

Cluster administrators will be expected to choose from one of the
following mechanisms for restricting usage of ephemeral containers:

Use RBAC to control which users are allowed to access the
/ephemeralcontainers subresource.
Write or use a third-party admission controller to allow 
or reject Pod updates that modify ephemeral containers based
on the content of the update.
Disable the feature using the EphemeralContainers feature gate.
RBAC is additive which means that it is not possible to remove
permissions from a role. This type of mitigation obviously does
not matter if all users a cluster admin, which they should not
be, so we assume that new roles are created for the cluster
consumers. In this case having a look at the existing roles
can be enough to make sure that the subresource /ephemeralcontainers
is not included in the role.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: edit
rules:
- apiGroups:
  - ""
  resources:
  - pods
  - pods/attach
  - pods/exec
  - pods/portforward
  - pods/proxy
  verbs:
  - create
  - delete
  - deletecollection
  - patch
  - update

```
## Checking Policy Enforcement

Let's say that you upgraded your cluster and informed all end users
of the great new feature. How do you know that the correct policies
are enforced in accordance to your security practices. You may have 
been aware of the API changes and taken the correct precautionary 
steps. Or you just updated Kyverno and it's policies out of pure
happenstance. Either way it is good to trust but verify that
it is not for example possible to create a privileged ephemeral 
container. Annoyingly the debug command does not expose any options
to set any security context configuration, so we need another option.
Ephemeral containers cannot be defined in a Pod when it is created 
and it can neither be added with an update. We need some other
method to create these specific ephemeral containers.

Ephemeral containers are created using a special ephemeralcontainers 
handler in the API rather than by adding them directly to pod.spec,
so it's not possible to add an ephemeral container using kubectl edit.

The simplest method to add an ephemeral container with a security 
context to a Pod is to use the Go client. A couple of lines of 
code can add a new ephemeral container running as privileged or 
use any other security context setting which is to your liking
```
package main

import (
    "context"
    "fmt"
    "os"

    corev1 "k8s.io/api/core/v1"
    metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
    "k8s.io/client-go/kubernetes"
    "k8s.io/client-go/tools/clientcmd"
)

func main() {
    if len(os.Args) != 4 {
        panic("expected three args")
    }
    podNamespace := os.Args[1]
    podName := os.Args[2]
    kubeconfigPath := os.Args[3]

    // Create the client
    client, err := getKubernetesClients(kubeconfigPath)
    if err != nil {
    panic(fmt.Errorf("could not create client: %w", err))
    }
    ctx := context.Background()

    // Get the Pod
    pod, err := client.CoreV1().Pods(podNamespace).Get(ctx, podName, metav1.GetOptions{})
    if err != nil {
    panic(fmt.Errorf("could not get pod: %w", err))
    }

    // Add a new ephemeral container
    trueValue := true
    ephemeralContainer := corev1.EphemeralContainer{
        EphemeralContainerCommon: corev1.EphemeralContainerCommon{
            Name:  "debug",
            Image: "busybox",
            TTY:   true,
            SecurityContext: &corev1.SecurityContext{
                Privileged:               &trueValue,
                AllowPrivilegeEscalation: &trueValue,
            },
        },
    }
    pod.Spec.EphemeralContainers = append(pod.Spec.EphemeralContainers, ephemeralContainer)
    pod, err = client.CoreV1().Pods(pod.Namespace).UpdateEphemeralContainers(ctx, pod.Name, pod, metav1.UpdateOptions{})
    if err != nil {
    panic(fmt.Errorf("could not add ephemeral container: %w", err))
    }
}

func getKubernetesClients(path string) (kubernetes.Interface, error) {
    cfg, err := clientcmd.BuildConfigFromFlags("", path)
    if err != nil {
        return nil, err
    }
    client, err := kubernetes.NewForConfig(cfg)
    if err != nil {
        return nil, err
    }
    return client, nil
}
                                                                                                                                                                                                                                                                                                                                                     

                                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                           
                                                                                                                                                                                                                                                                                                
```

Run the program and pass the namespace, pod name, and path to a 
kube config file. We assume that the ephemeral-demo Pod is still running.

go run main.go default ephemeral-demo $KUBECONFIG

If it completes with no error a privileged ephemeral container
should have been added to the Pod. Exec into it and list the host's 
devices to prove that it is a privileged container.
```
shell
kubectl exec -it ephemeral-demo -c debug -- sh
ls /dev
```
### Conclusion

If there is one takeaway from this post, it is that any policy
tool that has not been updated in the last couple of months will 
not enforce rules on ephemeral containers. This also includes all
policies written in house! It is not enough to update the community policies.

Some may argue that this type of oversight is not really an issue.
Ephemeral containers can't mount host paths, or access the hosts
namespaces. All it can do is set the common container security 
context. That is a fair comment, because it's true. Being able 
to create a privileged container is however still not ideal,
and there are methods to escalate privileges when this is possible.
Either way it is important to be aware of how policies are enforced 
and the security contexts which are allowed.

I am still not sure how much of an issue this will be short term.
Cloud providers are currently in the process of rolling out Kubernetes 
v1.23 in their SaaS offerings. In these solutions it is still a possibility 
that they chose to disable ephemeral containers. Those rolling their own 
clusters may have already upgraded to v1.23 and not be aware of the new feature. 
That is the biggest issue really, that the platform administrator has to be aware
of the existence of ephemeral containers. The fact that kubectl does not expose the 
option to set a security context will make even less people aware that it is still 
possible to set one with other means. Investing in a security audit 6 months ago 
will only be  valuable as long as the same Kubernetes version is used. Kubernetes 
is by design not secure by default, so each new feature introduced has to be analyzed.
The fact that upgrading from Kubernetes v1.22 to v.23 could make your cluster less
secure is part of the difficulties of working with Kubernetes, requiring platform 
administrators to always stay on top of things. The reality is that these types
of things are easy to miss, so hopefully this post has helped someone make their
cluster a bit more secure.


