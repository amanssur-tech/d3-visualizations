#!/usr/bin/env bash
OUT="project_contents.txt"

{
  printf '===== PROJECT CONTENTS =====\n\n'
  printf '===== PROJECT TREE (with line counts) =====\n\n'

  count_lines() {
    local n=0
    while IFS= read -r _; do
      ((n++))
    done < "$1"
    echo "$n"
  }

  tree -I 'dist|node_modules' -fi --noreport \
  | while IFS= read -r path; do
      if [[ -d $path ]]; then
        printf '%s\n' "$path"
      elif [[ -f $path ]]; then
        lines=$(count_lines "$path")
        printf '%s (%s lines)\n' "$path" "$lines"
      fi
    done \
  | awk '
    {
      split($0, parts, "/");
      depth = length(parts) - 1;
      indent = "";
      for (i = 1; i < depth; i++) indent = indent "│   ";
      if (depth > 0) {
        sub(".*/", "", $0);
        printf "%s├── %s\n", indent, $0;
      } else {
        print $0;
      }
    }'

  printf '\n\n===== FILE CONTENTS =====\n\n'
  find . -type f \
    ! -path "*/node_modules/*" \
    ! -path "*/dist/*" \
    ! -path "*/.git/*" \
    ! -path "*/.astro/*" \
    ! -path "*/.wrangler/*" \
    ! -name ".*" \
    ! -name "package-lock.json" \
    ! -name "*.svg" \
    ! -name "*.jpg" \
    ! -name "*.webp" \
    ! -name "*.pdf" \
    ! -name "*.avif" \
    ! -name "*.ttf" \
    ! -name "*.d.ts" \
    ! -name "*.ico" \
    ! -name "*.png" \
    ! -name "*.gif" \
    ! -name "$OUT" \
  -print | while read -r file; do
      if [ -f "$file" ]; then
        echo "$file"
        cat "$file"
        printf '\n\n'
      fi
    done
} > "$OUT"

echo "Processing complete."