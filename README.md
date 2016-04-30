## Instructions for Contributing to the Docs/Website

Welcome! We are very pleased you want to contribute to the documentation and/or website for Kubernetes.

You can click the "Fork" button in the upper-right area of the screen to create a copy of our site on your GitHub account called a "fork." Make any changes you want in your fork, and when you are ready to send those changes to us, go to the index page for your fork and click "New Pull Request" to let us know about it.

If you want to see your changes staged without having to install anything locally, remove the CNAME file in this directory and
change the name of the fork to be:

    YOUR_GITHUB_USERNAME.github.io

Then, visit: [http://YOUR_GITHUB_USERNAME.github.io](http://YOUR_GITHUB_USERNAME.github.io)

You should see a special-to-you version of the site. 

## Editing/staging the site locally

If you have files to upload, or just want to work offline, run the below commands to setup
your environment for running GitHub pages locally. Then, any edits you make will be viewable
on a lightweight webserver that runs on your local machine.

First install rvm

	curl -sSL https://get.rvm.io | bash -s stable

Then load it into your environment

	source ${HOME}/.rvm/scripts/rvm (or whatever is prompted by the installer)

Then install Ruby 2.2 or higher

	rvm install ruby-2.2.4
	rvm use ruby-2.2.4 --default
	
Verify that this new version is running (optional)

	which ruby
	ruby -v
	
Install the GitHub Pages package, which includes Jekyll

	gem install github-pages

Clone our site

	git clone https://github.com/kubernetes/kubernetes.github.io.git

Make any changes you want. Then, to see your changes locally:

	cd kubernetes.github.io
	jekyll serve

Your copy of the site will then be viewable at: [http://localhost:4000](http://localhost:4000)
(or wherever Ruby tells you).

If you're a bit rusty with git/GitHub, you might wanna read
[this](http://readwrite.com/2013/10/02/github-for-beginners-part-2) for a refresher.

The above instructions work on Mac and Linux.
[These instructions ](https://martinbuberl.com/blog/setup-jekyll-on-windows-and-host-it-on-github-pages/)
might help for Windows users. 

## Common Tasks

### Edit Page Titles or Change the Left Navigation

Edit the yaml files in `/_data/` for the Guides, Reference, Samples, or Support areas. 

You may have to exit and `jekyll clean` before restarting the `jekyll serve` to
get changes to files in `/_data/` to show up.

### Add Images

Put the new image in `/images/docs/` if it's for the documentation, and just `/images/` if it's for the website.

**For diagrams, we greatly prefer SVG files!**

### Include code from another file

To include a file that is hosted on this GitHub repo, insert this code:

<pre>&#123;% include code.html language="&lt;LEXERVALUE&gt;" file="&lt;RELATIVEPATH&gt;" ghlink="&lt;PATHFROMROOT&gt;" %&#125;</pre>

* `LEXERVALUE`: The language in which the file was written; must be [a value supported by Rouge](https://github.com/jneen/rouge/wiki/list-of-supported-languages-and-lexers).
* `RELATIVEPATH`: The path to the file you're including, relative to the current file.
* `PATHFROMROOT`: The path to the file relative to root, e.g. `/docs/admin/foo.yaml`

To include a file that is hosted in the external, main Kubernetes repo, make sure it's added to [/update-imported-docs.sh](https://github.com/kubernetes/kubernetes.github.io/blob/master/update-imported-docs.sh), and run it so that the file gets downloaded, then enter:

<pre>&#123;% include code.html language="&lt;LEXERVALUE&gt;" file="&lt;RELATIVEPATH&gt;" k8slink="&lt;PATHFROMK8SROOT&gt;" %&#125;</pre>

* `PATHFROMK8SROOT`: The path to the file relative to the root of [the Kubernetes repo](https://github.com/kubernetes/kubernetes/tree/release-1.2), e.g. `/examples/rbd/foo.yaml`

## Using tabs for multi-language examples

By specifying some inline CSV in a varable called `tabspec`, you can include a file
called `tabs.html` that generates tabs showing code examples in multiple langauges.

<pre>&#123;% capture tabspec %&#125;servicesample
JSON,json,service-sample.json,/docs/user-guide/services/service-sample.json
YAML,yaml,service-sample.yaml,/docs/user-guide/services/service-sample.yaml&#123;% endcapture %&#125;
&#123;% include tabs.html %&#125;</pre>

In English, this would read: "Create a set of tabs with the alias `servicesample`,
and have tabs visually labeled "JSON" and "YAML" that use `json` and `yaml` Rouge syntax highlighting, which display the contents of
`service-sample.{extension}` on the page, and link to the file in GitHub at (full path)."

Example file: [Pods: Multi-Container](/docs/user-guide/pods/multi-container/).

## Use a global variable

The `/_config.yml` file defines some useful variables you can use when editing docs. 

* `page.githubbranch`: The name of the GitHub branch on the Kubernetes repo that is associated with this branch of the docs. e.g. `release-1.2`
* `page.version` The version of Kubernetes associated with this branch of the docs. e.g. `v1.2`
* `page.docsbranch` The name of the GitHub branch on the Docs/Website repo that you are currently using. e.g. `release-1.1` or `master`

This keeps the docs you're editing aligned with the Kubernetes version you're talking about. For example, if you define a link like so, you'll never have to worry about it going stale in future doc branches:

<pre>View the README [here](http://releases.k8s.io/&#123;&#123;page.githubbranch&#125;&#125;/cluster/addons/README.md).</pre>

That, of course, will send users to:

[http://releases.k8s.io/release-1.2/cluster/addons/README.md](http://releases.k8s.io/release-1.2/cluster/addons/README.md)

(Or whatever Kubernetes release that docs branch is associated with.)

## Branch structure

The current version of the website is served out of the `master` branch.

All versions of the site that relate to past and future versions will be named after their Kubernetes release number. For example, [the old branch for the 1.1 docs is called `release-1.1`](https://github.com/kubernetes/kubernetes.github.io/tree/release-1.1).

## Thank you!

Kubernetes thrives on community participation and we really appreciate your
contributions to our site and our documentation!
