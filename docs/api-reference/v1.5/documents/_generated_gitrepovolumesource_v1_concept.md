

-----------
# GitRepoVolumeSource v1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | GitRepoVolumeSource







Represents a volume that is populated with the contents of a git repository. Git repo volumes do not support ownership management. Git repo volumes support SELinux relabeling.

<aside class="notice">
Appears In <a href="#volume-v1">Volume</a> </aside>

Field        | Description
------------ | -----------
directory <br /> *string*  | Target directory name. Must not contain or start with '..'.  If '.' is supplied, the volume directory will be the git repository.  Otherwise, if specified, the volume will contain the git repository in the subdirectory with the given name.
repository <br /> *string*  | Repository URL
revision <br /> *string*  | Commit hash for the specified revision.






