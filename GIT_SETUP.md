# 🔄 Fresh Git Setup Guide

## Step-by-Step Git Configuration

### Step 1: Initialize Git Repository
```bash
cd c:\Users\019301.MAA019301A\Desktop\badmitton\badminton
git init
```

### Step 2: Create .gitignore (if not exists)
Make sure you have a `.gitignore` file with:
```
node_modules/
.next/
out/
.env.local
.env*.local
.DS_Store
*.log
```

### Step 3: Add All Files
```bash
git add .
```

### Step 4: Make Initial Commit
```bash
git commit -m "Initial commit - Badminton registration app"
```

### Step 5: Create New Repository on GitHub
1. Go to: https://github.com/new
2. Repository name: `badmin` (or your preferred name)
3. Description: "Badminton Tournament Registration App"
4. Choose: Public or Private
5. **DO NOT** initialize with README, .gitignore, or license
6. Click "Create repository"

### Step 6: Add Remote and Push
```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/sriram-2019/badminton.git

# Or if using SSH:
# git remote add origin git@github.com:sriram-2019/badminton.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## Complete Command Sequence

Copy and paste these commands in order:

```bash
# Navigate to project
cd c:\Users\019301.MAA019301A\Desktop\badmitton\badminton

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Badminton registration app"

# Add remote (replace with your actual repo URL)
git remote add origin https://github.com/sriram-2019/badminton.git

# Rename branch
git branch -M main

# Push
git push -u origin main
```

## Troubleshooting

### If you get "repository already exists" error:
```bash
git remote remove origin
git remote add origin https://github.com/sriram-2019/badminton.git
```

### If you get authentication error:
- Use GitHub Personal Access Token instead of password
- Or set up SSH keys

### If you need to force push (be careful!):
```bash
git push -u origin main --force
```

## Next Steps After Setup

1. ✅ Git repository initialized
2. ✅ Connected to GitHub
3. ✅ Code pushed to GitHub
4. ✅ Update Render deployment to use new repository
5. ✅ Update PythonAnywhere if needed

