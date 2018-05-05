

# Background

See https://hugo-migration.docs.kubernetes.io/docs/home/contribute/content-organization/

# Migration Prepare

The scripts that generates documentation  (see https://hugo-migration.docs.kubernetes.io/docs/home/contribute/) needs to be updated to be Hugo-compatible.

Note that the `docs/reference/generated` is not included in this branch and must be re-generated. The current export fails in Hugo.

# Migration Steps

1. Make sure the branch is rebased with the latest in master.
2. Run the Go program below `works/cripts/k8-migrate-content`
3. Run `work/root-dir-cleaner.sh` to remove now superflous directory and files in the root folder of the project.

Manual updates before merge into master:

* netlify.toml: Update producetion `baseURL`.

