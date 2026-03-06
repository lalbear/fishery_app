import os
import re
import glob

files_to_process = glob.glob("src/screens/*.tsx")

for filepath in files_to_process:
    with open(filepath, 'r') as f:
        content = f.read()

    # Skip files that don't use theme
    if "theme" not in content:
        continue

    # replace imports
    content = re.sub(r"import\s*\{\s*theme\s*\}\s*from\s*['\"](.*?)theme['\"];", r"import { useTheme } from '\1ThemeContext';", content)

    has_styles = "StyleSheet.create" in content
    
    # Prevent double patching
    if "const { theme } = useTheme();" in content:
        continue

    hook_code = "\n  const { theme } = useTheme();"
    if has_styles:
        hook_code += "\n  const styles = getStyles(theme);"

    def insert_hook(match):
        return match.group(0) + hook_code

    content, num_subs = re.subn(r"(export default function \w+\([^)]*\)\s*\{)", insert_hook, content, count=1)
    
    if num_subs == 0:
        content, num_subs = re.subn(r"(function \w+\([^)]*\)\s*\{)", insert_hook, content, count=1)

    if has_styles:
        content = re.sub(r"const\s+styles\s*=\s*StyleSheet\.create\s*\(", r"const getStyles = (theme: any) => StyleSheet.create(", content)

    with open(filepath, 'w') as f:
        f.write(content)
    
    print(f"Processed {filepath}")
