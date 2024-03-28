

import os 
import shutil

def change_file_extension(directory, old_extension, new_extension):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(old_extension):
                old_file_path = os.path.join(root, file)
                new_file_path = os.path.join(root, file.replace(old_extension, new_extension))
                shutil.move(old_file_path, new_file_path)

# Frontend
change_file_extension('frontend', '.js', '.ts')
change_file_extension('frontend', '.jsx', '.tsx')

#  Backend
change_file_extension('backend', '.js', '.ts')
