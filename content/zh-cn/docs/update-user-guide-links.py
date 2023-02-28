import subprocess
import re

# Finds the documents to rewrite for files that include user-guide-content-moved.md.
# Then opens these files and processes the stuff after those lines to figure out where
# the line should move to.
# Returns a list of ('old/path', 'new/path') tuples.
def find_documents_to_rewrite():
    cmd = "ag --markdown -Q -l \"{% include user-guide-content-moved.md %}\""
    moved_docs = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE).stdout.read().splitlines()

    rewrites = []
    for doc in moved_docs:
        location = doc_location(doc)
        destinations = get_destinations_for_doc(doc)

        if len(destinations) == 0:
            print("Unable to get possible destinations for %s" % doc)
        elif len(destinations) > 1:
            print("%s has multiple potential destinations. Not rewriting links." % doc)
        else:
            # print("%s --> %s" % (location, destinations[0]))
            rewrites.append((location, destinations[0]))

    return rewrites

# Returns the location of the documentation as we will refer to it in the markdown.
# /docs/path/to/foo/index.md are available at /docs/path/to/foo/
# /docs/path/to/foo/bar.md are available at /docs/path/to/foo/bar/
def doc_location(filename):
    if filename.endswith('/index.md'):
        return "/docs/" + filename[:-9] + "/"
    else:
        return "/docs/" + filename[:-3] + "/"

REDIRECT_REGEX = re.compile("^.*\[(.*)\]\((.*)\)$")

def get_destinations_for_doc(filename):
    destination_paths = []
    with open(filename) as f:
        lines = [line.rstrip('\n').rstrip('\r') for line in f.readlines()]

        # Remove empty lines
        lines = filter(bool, lines)

        content_moved_index = lines.index("{% include user-guide-content-moved.md %}")

        # Get everything after that line.
        destinations = lines[content_moved_index + 1:]
        for destination in destinations:
            result = REDIRECT_REGEX.match(destination)
            if not result:
                return []
            doc_title = result.group(1) # Unused, can print it out for more info.
            new_path = result.group(2)
            destination_paths.append(new_path)

    return destination_paths

# Given a list of (old/path, new/path) tuples executes a sed command across all files in
# to replace (/docs/path/to/old/doc/) with (/docs/path/to/new/doc/).
def rewrite_documents(rewrites):
    cmd = "find . -name '*.md' -type f -exec sed -i.bak 's@(%s)@(%s)@g' '{}' \;"
    for original, new in rewrites:

        print("%s --> %s" % (original, new))
        original = original.replace('-', '\-')
        new = new.replace('-', '\-')

        #print(cmd % (original, new))
        subprocess.call(cmd % (original, new), shell=True)

# We can't have in-line replace across multiple files without sudo (I think), so it
# creates a lot of backups that we have to delete.
def remove_sed_backups():
    cmd = "find . -name '*.bak' -delete"
    subprocess.call(cmd, shell=True)

def main():
    rewrites = find_documents_to_rewrite()
    rewrite_documents(rewrites)
    remove_sed_backups()

if __name__ == "__main__":
    main()
