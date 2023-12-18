---
title: CSIMigrationRBD
content_type: feature_gate
_build:
  list: never
  render: false
---
Enables shims and translation logic to route volume
operations from the RBD in-tree plugin to Ceph RBD CSI plugin. Requires
CSIMigration and csiMigrationRBD feature flags enabled and Ceph CSI plugin
installed and configured in the cluster. This flag has been deprecated in
favor of the `InTreePluginRBDUnregister` feature flag which prevents the registration of
in-tree RBD plugin.
