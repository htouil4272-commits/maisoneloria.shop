import os

config_py_path = '/etc/easypanel/projects/maisoneloria/backend/code/backend/app/config.py'
with open(config_py_path, 'r') as f:
    content = f.read()

# Add auto-correction for '@database:5432' to '@maisoneloria_database:5432'
old_code = "if not url:"
new_code = '''if "@database:5432" in url:
            url = url.replace("@database:5432", "@maisoneloria_database:5432")
        if not url:'''

content = content.replace(old_code, new_code)

with open(config_py_path, 'w') as f:
    f.write(content)

print("Updated config.py")