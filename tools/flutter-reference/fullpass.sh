#!/bin/bash
# usage: bash fullpass.sh <mapfile> <outfile>
# Every case of a map (name|storyId|selector|args|click): layout numbers (compare.mjs), then
# rendered pixels of each text run (inkruns.py) and fill colours (flatdiff.py). Storybook must run on :6006.
cd "$(dirname "$0")" || exit 1
export FLUTTER_REF_WORK="${FLUTTER_REF_WORK:-$PWD}"
: > "$2"
while IFS='|' read -r name id sel args click; do
  [ -z "$name" ] && continue
  echo "=== $name" >> "$2"
  node compare.mjs "$name" "$id" "$sel" "$args" "$click" >> "$2" 2>&1 < /dev/null
  python inkruns.py "$name" >> "$2" 2>&1 < /dev/null
  python flatdiff.py "$name" >> "$2" 2>&1 < /dev/null
done < "$1"
echo DONE >> "$2"
