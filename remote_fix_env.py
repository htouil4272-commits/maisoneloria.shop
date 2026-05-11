import os

env_py_path = '/etc/easypanel/projects/maisoneloria/backend/code/backend/app/migrations/env.py'
with open(env_py_path, 'r') as f:
    content = f.read()

# Replace the specific line causing the configparser issue
old_line = 'config.set_main_option("sqlalchemy.url", settings.async_database_url)'
new_line = 'config.set_main_option("sqlalchemy.url", settings.async_database_url.replace("%", "%%"))'

content = content.replace(old_line, new_line)

with open(env_py_path, 'w') as f:
    f.write(content)

print("Updated env.py to fix configparser interpolation bug")