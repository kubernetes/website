---
assignees:
- bprashanth

---

To increase or decrease the number of pods under a replication controller's
control, use the `kubectl scale` command:

    $ kubectl scale rc NAME --replicas=COUNT \
        [--current-replicas=COUNT] \
        [--resource-version=VERSION]

Tip: You can use the `rc` alias in your commands in place of
`replicationcontroller`.

Required fields are:

* `NAME`: The name of the replication controller to update.
* `--replicas=COUNT`: The desired number of replicas.

Optional fields are:

* `--current-replicas=COUNT`: A precondition for current size. If specified,
  the resize will only take place if the current number of replicas matches
  this value.
* `--resource-version=VERSION`: A precondition for resource version. If
  specified, the resize will only take place if the current replication
  controller version matches this value. Versions are specified in the
  `labels` field of the replication controller's configuration file, as a
  key:value pair with a key of `version`. For example,
  `--resource-version test` matches:

        "labels": {
          "version": "test"
        }
