---
title: Pod Lifecycle Events
---

# Introduction 

Every Kubernetes Pod follows a structured lifecycle, starting from creation and ending in termination. The lifecycle begins in the Pending phase, where the Pod is scheduled and resources like images are prepared. Once running, the Pod enters the Running phase, where containers are actively executing. Lifecycle Hooks, such as PreStop, allow you to run custom tasks before shutdown. Pods can transition to Succeeded (all containers complete successfully) or Failed (errors occur). Container States track individual container behaviors like Waiting, Running, or Terminated. Kubernetes applies Restart Policies to manage failures and recovery. Probes like Liveness and Readiness ensure containers are healthy. Pods gracefully shut down during Termination, respecting configurable grace periods. Finally, Garbage Collection removes old Pods to prevent resource leaks.

## Key Areas of the Pod Lifecycle

The following are essential concepts related to Pod lifecycle management:

- [Lifecycle Hooks](./lifecycle_hooks/index.md)
  - Lifecycle hooks like PreStop and PostStart allow you to execute commands or run HTTP requests at critical moments in a container’s lifecycle. These hooks provide flexibility during container startup or shutdown, ensuring proper initialization or graceful termination.
  
- [Probes](./probes/readiness-probes.md)
  - Kubernetes uses probes to monitor and manage container health and readiness. Probes ensure that containers are functioning properly and are ready to handle traffic when needed.
  


Each section will provide examples and in-depth explanations to help you implement and manage lifecycle events effectively in Kubernetes.
