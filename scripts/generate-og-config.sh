#!/bin/bash
set -euo pipefail

CONFIG_FILE="goog-config.json"
TEMPLATE="${1:-scripts/og-template.html}"
SITE="${SITE_NAME:-webdong.dev}"

echo "Scanning posts for OG image generation..."

get_fm_value() {
    local file="$1" key="$2"
    awk -v k="$key:" '
        /^---$/ { in_fm = !in_fm; next }
        in_fm && index($0, k) == 1 {
            sub(/^[^:]+:[[:space:]]*/, "")
            gsub(/^["\x27]|["\x27]$/, "")
            print
            exit
        }
    ' "$file"
}

get_body_excerpt() {
    local file="$1" max_len="${2:-160}"
    awk '/^---$/ { c++; next } c==2 { print }' "$file" \
        | sed 's/!\[.*\]([^)]*)//g' \
        | sed 's/\[\([^]]*\)\]([^)]*)/\1/g' \
        | sed 's/^#\{1,\} //g' \
        | sed 's/^> //g' \
        | sed 's/[*_`~]//g' \
        | sed 's/[[:space:]]\{1,\}/ /g' \
        | tr '\n' ' ' \
        | sed 's/^ *//;s/ *$//' \
        | head -c "$max_len"
}

echo "[" > "$CONFIG_FILE"
first=true

process_file() {
    local file="$1" type="$2"
    local prefix="src/content/${type}/"
    local rel="${file#$prefix}"
    local lang="${rel%%/*}"
    local slug_path="${rel#*/}"
    local slug="${slug_path%%/*}"
    local headline excerpt category body_excerpt description

    headline=$(get_fm_value "$file" "headline")
    [ -z "$headline" ] && return

    if [ "$type" = "post" ]; then
        excerpt=$(get_fm_value "$file" "excerpt")
        description="$excerpt"
    else
        body_excerpt=$(get_body_excerpt "$file" 160)
        description="$body_excerpt"
    fi

    category=$(get_fm_value "$file" "category")
    [ -z "$category" ] && category="Blog"

    title_json=$(printf '%s' "$headline" | jq -Rs '.')
    desc_json=$(printf '%s' "$description" | jq -Rs '.')
    tag_json=$(printf '%s' "$category" | jq -Rs '.')

    if [ "$first" = true ]; then
        first=false
    else
        printf ",\n" >> "$CONFIG_FILE"
    fi

    local out_path="public/og/${type}/${lang}/${slug}.png"

    printf '\n  {\n    "template": "%s",\n    "vars": {\n      "tag": %s,\n      "title": %s,\n      "description": %s,\n      "site": "%s"\n    },\n    "out": "%s"\n  }' \
        "$TEMPLATE" \
        "$tag_json" \
        "$title_json" \
        "$desc_json" \
        "$SITE" \
        "$out_path" >> "$CONFIG_FILE"
}

# Process regular posts
for file in $(find -L src/content/post -name 'index.mdx' -type f 2>/dev/null); do
    [ -f "$file" ] || continue
    process_file "$file" "post"
done

# Process shortposts
for file in $(find -L src/content/shortpost -name 'index.mdx' -type f 2>/dev/null); do
    [ -f "$file" ] || continue
    process_file "$file" "shortpost"
done

printf "\n]" >> "$CONFIG_FILE"

count=$(jq length "$CONFIG_FILE")
echo "Generated goog-config.json with ${count} entries"

# Pre-create all output directories (goog's os.WriteFile doesn't mkdir -p)
jq -r '.[].out' "$CONFIG_FILE" | xargs -I {} dirname {} | sort -u | xargs -I {} mkdir -p "{}"
echo "Created $(jq -r '.[].out' "$CONFIG_FILE" | xargs -I {} dirname {} | sort -u | wc -l | tr -d ' ') output directories"
