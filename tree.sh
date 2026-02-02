#!/usr/bin/env bash
# generate-tree.sh

OUTPUT="TREE.md"

echo '```' > "$OUTPUT"
tree -a -I 'node_modules|.git|dist' >> "$OUTPUT"
echo '```' >> "$OUTPUT"

echo "✅ Arborescence générée dans $OUTPUT"
