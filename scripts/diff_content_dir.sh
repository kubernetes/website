#!/bin/bash

# Usage: ./scripts/diff_content_dir.sh <input_directory>
# Example: ./scripts/diff_content_dir.sh content/zh-cn/docs/
#
# This script compares the contents of the input directory (in a specific language)
# with its English counterpart and displays the differences in colored output.

# Check if the terminal supports color
if [ -t 1 ]; then
    colors=$(tput colors)
    if [ -n "$colors" ] && [ $colors -ge 8 ]; then
        RED="$(tput setaf 1)"
        GREEN="$(tput setaf 2)"
        RESET="$(tput sgr0)"
    fi
fi

# Function to print colored output
print_colored() {
    local color=$1
    local message=$2
    if [ -n "$color" ]; then
        echo -e "${color}${message}${RESET}"
    else
        echo "$message"
    fi
}

# Check if an input directory is provided
if [ $# -eq 0 ]; then
    echo -e "\nThis script compares the contents of the input directory (in a specific language) " >&2
    echo -e "with its English counterpart and displays the differences.\n" >&2
    echo -e "Usage:\n\t$0 <PATH>\n" >&2
    echo -e "Example:\n\t$0 content/zh-cn/docs/concepts/\n" >&2
    exit 1
fi

input_dir=$1

# Extract the language code from the input directory
lang_code=$(echo "$input_dir" | sed -n 's/.*content\/\([^/]*\).*/\1/p')

# Create the English version of the directory path
en_dir=$(echo "$input_dir" | sed "s/$lang_code/en/")

# Check if both directories exist
if [ ! -d "$input_dir" ]; then
    echo "Error: Input directory does not exist."
    exit 1
fi

if [ ! -d "$en_dir" ]; then
    echo "Error: English directory does not exist."
    exit 1
fi

# Function to compare directories
compare_directories() {
    local lang_dir=$1
    local en_dir=$2

    # Find files in lang_dir that are not in en_dir
    comm -23 <(cd "$lang_dir" && find . -type f | sort) <(cd "$en_dir" && find . -type f | sort) | while read -r file; do
        print_colored "$GREEN" "Added in $lang_code: ${file:2}"
    done

    # Find files in en_dir that are not in lang_dir
    comm -13 <(cd "$lang_dir" && find . -type f | sort) <(cd "$en_dir" && find . -type f | sort) | while read -r file; do
        print_colored "$RED" "Missing in $lang_code: ${file:2}"
    done
}

# Start the comparison
echo "Comparing $input_dir with $en_dir :"
compare_directories "$input_dir" "$en_dir"

echo "Comparison complete."