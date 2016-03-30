---
---

* TOC
{:toc}

## Overview

A rolling update applies changes to the configuration of pods being managed by
a replication controller. The changes can be passed as a new replication
controller configuration file; or, if only updating the image, a new container
image can be specified directly.

A rolling update works by:

1. Creating a new replication controller with the updated configuration.
2. Increasing/decreasing the replica count on the new and old controllers until
   the correct number of replicas is reached.
3. Deleting the original replication controller.

Rolling updates are initiated with the `kubectl rolling-update` command:

    $ kubectl rolling-update NAME \
        ([NEW_NAME] --image=IMAGE | -f FILE)

## Passing a configuration file

To initiate a rolling update using a configuration file, pass the new file to
`kubectl rolling-update`:

    $ kubectl rolling-update NAME -f FILE

The configuration file must:

* Specify a different `metadata.name` value.

* Overwrite at least one common label in its `spec.selector` field.

* Use the same `metadata.namespace`.

Replication controller configuration files are described in
[Creating Replication Controllers](/docs/user-guide/replication-controller/operations/).

### Examples

    // Update pods of frontend-v1 using new replication controller data in frontend-v2.json.
    $ kubectl rolling-update frontend-v1 -f frontend-v2.json

    // Update pods of frontend-v1 using JSON data passed into stdin.
    $ cat frontend-v2.json | kubectl rolling-update frontend-v1 -f -

## Updating the container image

To update only the container image, pass a new image name and tag with the
`--image` flag and (optionally) a new controller name:

    $ kubectl rolling-update NAME [NEW_NAME] --image=IMAGE:TAG

The `--image` flag is only supported for single-container pods. Specifying
`--image` with multi-container pods returns an error.

If no `NEW_NAME` is specified, a new replication controller is created with
a temporary name. Once the rollout is complete, the old controller is deleted,
and the new controller is updated to use the original name.

The update will fail if `IMAGE:TAG` is identical to the
current value. For this reason, we recommend the use of versioned tags as
opposed to values such as `:latest`. Doing a rolling update from `image:latest`
to a new `image:latest` will fail, even if the image at that tag has changed.

### Examples

    // Update the pods of frontend-v1 to frontend-v2
    $ kubectl rolling-update frontend-v1 frontend-v2 --image=image:v2

    // Update the pods of frontend, keeping the replication controller name
    $ kubectl rolling-update frontend --image=image:v2

## Required and optional fields

Required fields are:

* `NAME`: The name of the replication controller to update.

as well as either:

* `-f FILE`: A replication controller configuration file, in either JSON or
  YAML format. The configuration file must specify a new top-level `id` value
  and include at least one of the existing `spec.selector` key:value pairs.
  See the
  [Replication Controller Operations](/docs/user-guide/replication-controller/operations#replication-controller-configuration-file)
  page for details.
<br>
<br>
    or:
<br>
<br>
* `--image IMAGE:TAG`: The name and tag of the image to update to. Must be
  different than the current image:tag currently specified.

Optional fields are:

* `NEW_NAME`: Only used in conjunction with `--image` (not with `-f FILE`). The
  name to assign to the new replication controller.
* `--poll-interval DURATION`: The time between polling the controller status
  after update. Valid units are `ns` (nanoseconds), `us` or `µs` (microseconds),
  `ms` (milliseconds), `s` (seconds), `m` (minutes), or `h` (hours). Units can
  be combined (e.g. `1m30s`). The default is `3s`.
* `--timeout DURATION`: The maximum time to wait for the controller to update a
  pod before exiting. Default is `5m0s`. Valid units are as described for
  `--poll-interval` above.
* `--update-period DURATION`: The time to wait between updating pods. Default
  is `1m0s`. Valid units are as described for `--poll-interval` above.

Additional information about the `kubectl rolling-update` command is available
from the [`kubectl` reference](/docs/user-guide/kubectl/kubectl_rolling-update/).

## Troubleshooting

If the `timeout` duration is reached during a rolling update, the operation will
fail with some pods belonging to the new replication controller, and some to the
original controller.

To continue the update from where it failed, retry using the same command.

To roll back to the original state before the attempted update, append the
`--rollback=true` flag to the original command. This will revert all changes.
