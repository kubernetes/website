# Font icons

The Kubernetes website renders its social icons (in the header and footer) using a custom font that only includes the handful of logos/icons that we need. This document explains how to update these icons if we ever want to add or remove one of the logos.

## Overview

The font is generated with [IcoMoon](https://icomoon.io) which allows us to export both the final font files along with a state file called `selection.json`. Updating the font involves:

1. Import `selection.json` into IcoMoon
1. Add or remove whatever icons you want
1. Export the font
1. Copy files into the correct folders
1. Actually use the icons on the site

## Import `selection.json` into IcoMoon

1. Go to https://icomoon.io/app/#/projects and click "Import Project"
1. Select `selection.json` in the `assets/static/fonts` and click "Open"
1. Click "Load" on the right

## Change the icons we import

What you do here really depends on what change you're trying to make. To add a new icon, click "Add Icons From Library..." and start clicking around until you find the icon(s) you want to add. If you want to remove an icon, click it again to de-select it. It will get removed when you re-generate the font.

## Export the font

1. In the bottom right, click "Generate Font"
1. Double check that you see a reasonable number of glyphs
1. Click "Download" in the bottom right

## Copy files into the correct folders

1. Unzip the export from the previous step into a folder
1. Copy all of the files in `fonts/` into this repo's `static/fonts/` folder
1. Copy `selection.json` into `static/fonts/` too
1. Copy `style.css` into `static/css/` and rename the file to `icons.css`

## Use the icons on the site

Render an icon anywhere by adding the `icon` class and the `icon-<glphy>` class to any element you want to put an icon in.

    <span class="icon icon-twitter">There's a twitter icon to the left of this text</span>
