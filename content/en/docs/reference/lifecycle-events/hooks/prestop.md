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
<!-- Auto-generated test details, pod specifications, steps, and logs for the PreStop Basic Behavior will be inserted here. -->
<!-- prestop_basic_execution_test_ends -->

---

### PreStop Failure Behavior

This behavior describes how the `PreStop` hook behaves when issues arise during its execution. It ensures that:
- The errors are managed during the execution of the `PreStop` hook.
- shows failure affects the overall container shutdown process.

<!-- prestop_basic_failure_test_starts -->
<!-- Auto-generated test details, pod specifications, steps, and logs for PreStop Failure Behavior will be inserted here. -->
<!-- prestop_basic_failure_test_ends -->

---

### PreStop Hook Behavior Multiple Containers

This behavior describes how the `PreStop` hook operates when multiple containers within the same Pod define hooks. It ensures:
- The correct execution order of the hooks across containers.
- Whether the hooks are executed sequentially or in parallel.

<!-- prestop_multiple_containers_test_starts -->
<!-- Auto-generated test details, pod specifications, steps, and logs for the PreStop Hook Behavior for Multiple Containers  will be inserted here. -->
<!-- prestop_multiple_containers_test_ends -->

---


