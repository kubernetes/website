---
title: PreStop Hook Behaviors
content_type: reference
weight: 30
auto_generated: true
---

## Prestop Behaviors

The following behaviors describes the functionality of the `PreStop` hook. Each behavior ensures that the `PreStop` hook behaves as expected under different scenarios.

---

### PreStop Basic Behavior

This behavior describes the basic functionality of the `PreStop` hook. It ensures that:
- A specified command is executed during the graceful termination of a container.
- The command completes its execution within the defined termination grace period before the container shuts down.

<!-- prestop_basic_execution_test_starts -->

When you have a PreStop hook defined on your container, it will execute before the container is terminated.

Imagine You Have a Pod with the Following Specification:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-termination-grace-period
spec:
  containers:
  - name: busybox
    image: registry.k8s.io/e2e-test-images/busybox:1.36.1-1
    command:
    - sleep
    - "10000"
    lifecycle:
      preStop:
        exec:
          command:
          - sh
          - -c
          - echo 'PreStop Hook Executed' > /tmp/prestop-hook-test.log
    volumeMounts:
    - mountPath: /tmp/prestop-hook-test.log
      name: host-data
  terminationGracePeriodSeconds: 30
  volumes:
  - name: host-data
    hostPath:
      path: /tmp/prestop-hook-test.log
      type: FileOrCreate
```

The Pod should start successfully and run for a specified time.
When the container is terminated, the PreStop hook will execute within the grace period.
After the PreStop hook completes, the container terminates gracefully.

The following log output confirms the successful execution of the PreStop hook:

```
PreStop Hook Executed
```
<!-- prestop_basic_execution_test_ends -->

---

### PreStop Failure Behavior

This behavior describes how the `PreStop` hook behaves when issues arise during its execution. It ensures that:
- The errors are managed during the execution of the `PreStop` hook.
- shows failure affects the overall container shutdown process.

<!-- prestop_basic_failure_test_starts -->
<!-- Auto-generated test details, pod specifications, steps, and logs for PreStop Failure Handling will be inserted here. -->
<!-- prestop_basic_failure_test_ends -->

---

### PreStop Hook Behavior Multiple Containers

This behavior describes how the `PreStop` hook operates when multiple containers within the same Pod define hooks. It ensures:
- The correct execution order of the hooks across containers.
- Whether the hooks are executed sequentially or in parallel.

<!-- prestop_multiple_containers_test_starts -->
<!-- Auto-generated test details, pod specifications, steps, and logs for the PreStop Hook for Multiple Containers will be inserted here. -->
<!-- prestop_multiple_containers_test_ends -->

---