import os
import glob
import shutil

media_dir = r"C:\Users\ACER\.gemini\antigravity\brain\0bd0a12d-0c12-409f-9406-17699ac0da83\.tempmediaStorage"
dest = r"c:\Users\ACER\Desktop\shortly project latest\frontend\public\priyansh.png"

files = glob.glob(os.path.join(media_dir, "*.png"))
files.sort(key=os.path.getmtime, reverse=True)

if files:
    shutil.copy2(files[0], dest)
    print("Copied", files[0])
else:
    print("No png files found")
