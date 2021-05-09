So far:

```bash
[rolfedh@fedora-desktop _posts]$ touch test-my-email-and-cla-settings.md
[rolfedh@fedora-desktop _posts]$ vi test-my-email-and-cla-settings.md
[rolfedh@fedora-desktop _posts]$ git add *
[rolfedh@fedora-desktop _posts]$ git status
On branch check-email-and-cla-settings
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
	new file:   test-my-email-and-cla-settings.md

[rolfedh@fedora-desktop _posts]$ git commit -m "test my cla and email settings"
[check-email-and-cla-settings bebea9641] test my cla and email settings
 1 file changed, 1 insertion(+)
 create mode 100644 content/en/blog/_posts/test-my-email-and-cla-settings.md
[rolfedh@fedora-desktop _posts]$ git status
On branch check-email-and-cla-settings
nothing to commit, working tree clean
[rolfedh@fedora-desktop _posts]$ git push origin HEAD
Enumerating objects: 12, done.
Counting objects: 100% (12/12), done.
Delta compression using up to 8 threads
Compressing objects: 100% (7/7), done.
Writing objects: 100% (7/7), 610 bytes | 610.00 KiB/s, done.
Total 7 (delta 5), reused 0 (delta 0), pack-reused 0
remote: Resolving deltas: 100% (5/5), completed with 5 local objects.
remote: error: GH007: Your push would publish a private email address.
remote: You can make your email public or disable this protection by visiting:
remote: http://github.com/settings/emails
To github.com:rolfedh/website.git
 ! [remote rejected]     HEAD -> check-email-and-cla-settings (push declined due to email privacy restrictions)
error: failed to push some refs to 'github.com:rolfedh/website.git'
[rolfedh@fedora-desktop _posts]$
```
In GitHub, under *Account settings* >  *Emails*, uncheck the setting that says:

```
Block command line pushes that expose my email
If you push commits that use a private email that is linked with your GitHub account as your author email we will block the push and warn you about exposing your private email.
```

Then push again:

```
[rolfedh@fedora-desktop _posts]$ git push origin HEAD
Enumerating objects: 12, done.
Counting objects: 100% (12/12), done.
Delta compression using up to 8 threads
Compressing objects: 100% (7/7), done.
Writing objects: 100% (7/7), 1.21 KiB | 620.00 KiB/s, done.
Total 7 (delta 5), reused 0 (delta 0), pack-reused 0
remote: Resolving deltas: 100% (5/5), completed with 5 local objects.
remote:
remote: Create a pull request for 'check-email-and-cla-settings' on GitHub by visiting:
remote:      https://github.com/rolfedh/website/pull/new/check-email-and-cla-settings
remote:
To github.com:rolfedh/website.git
 * [new branch]          HEAD -> check-email-and-cla-settings
[rolfedh@fedora-desktop _posts]$
```

See! No problems with email settings. Unfortunately, I signed the CLA using my REAL email address. This means my commits must also include my real email address. I don't know where, but apparently this information is publicly visible in my commits and can be harvested by spammers.

[] to do task: find out where and how.
[] another to do task: find out if I can re-sign the CFCN CLA using the obfuscated email address GitHub provides. Or failing that, what other contributors do.

Okay it worked - I went to kubernetes/website and saw the notification that I had recently pushed some changes to a branch and asking would I like to create a pull request. I clicked the button and created the pull request. Within moments, the pull request passed all checks. When I expanded the "All checks have passed notification" says **cla/linuxfoundation --- rolfedh authorized**.

`rolfedh` is the user ID for both my GitHub and Linux Foundation user accounts.

So, success! No problems committing from my machine to this repo.

I wonder if the settings are specific to this repo - or to all git on this  machine. If the latter, I will have problems pushing changes to my work repos because those require my work email. In that case, I will need to configure my email settings on a per-repo basis.

Here I check my git config:

```
[rolfedh@fedora-desktop _posts]$ git config user.name
Rolfe Dlugy-Hegwer
[rolfedh@fedora-desktop _posts]$ git config --list
user.name=Rolfe Dlugy-Hegwer
user.email=rolfedh@users.noreply.github.com
credential.helper=cache --timeout=3600
core.repositoryformatversion=0
core.filemode=true
core.bare=false
core.logallrefupdates=true
remote.origin.url=git@github.com:rolfedh/website.git
remote.origin.fetch=+refs/heads/*:refs/remotes/origin/*
branch.master.remote=origin
branch.master.merge=refs/heads/master
remote.upstream.url=git@github.com:kubernetes/website.git
remote.upstream.fetch=+refs/heads/*:refs/remotes/upstream/*
branch.fixes-issue-27843.remote=origin
branch.fixes-issue-27843.merge=refs/heads/fixes-issue-27843
branch.fixes-issue-27843.github-pr-owner-number=kubernetes#website#27845
user.email=abc@123.com
```
Interesting. The configuration contains two `user.email` entries:
`user.email=rolfedh@users.noreply.github.com`
and
`user.email=<my-personal-email-address-that-I-don't-want-the-world-to-know>`

The latter address is the one I used to sign the CLA. That's a problem. Basically, I have to expose my private email address to submit content to the kubernetes website.

```
[rolfedh@fedora-desktop _posts]$ cat ~/.gitconfig
# This is Git's per-user configuration file.
[user]
# Please adapt and uncomment the following lines:
	name = Rolfe Dlugy-Hegwer
	email = rolfedh@users.noreply.github.com
[credential]
	helper = cache --timeout=3600
```
