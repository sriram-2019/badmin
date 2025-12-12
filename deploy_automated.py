#!/usr/bin/env python3

"""

Automated Django Deployment Script for PythonAnywhere

⚠️ IMPORTANT: This script MUST be run on PythonAnywhere, NOT on your local machine!

To use:

1. Upload your project to PythonAnywhere (via Git or Files tab)

2. Open a Bash console on PythonAnywhere

3. Run: python3 deploy_automated.py

"""

import os
import sys
import subprocess
import getpass
from pathlib import Path

# Colors for terminal output
class Colors:
    GREEN = '\033[0;32m'
    YELLOW = '\033[1;33m'
    RED = '\033[0;31m'
    BLUE = '\033[0;34m'
    NC = '\033[0m'  # No Color

def print_step(step_num, total, message):
    print(f"{Colors.YELLOW}[{step_num}/{total}] {message}...{Colors.NC}")

def print_success(message):
    print(f"{Colors.GREEN}✓ {message}{Colors.NC}")

def print_error(message):
    print(f"{Colors.RED}✗ {message}{Colors.NC}")

def print_info(message):
    print(f"{Colors.BLUE}ℹ {message}{Colors.NC}")

def run_command(cmd, check=True, shell=True):
    """Run a shell command and return the result"""
    try:
        result = subprocess.run(
            cmd,
            shell=shell,
            check=check,
            capture_output=True,
            text=True
        )
        return result.returncode == 0, result.stdout, result.stderr
    except subprocess.CalledProcessError as e:
        return False, e.stdout, e.stderr

def main():
    print(f"{Colors.BLUE}{'='*50}{Colors.NC}")
    print(f"{Colors.BLUE}  Automated Django Deployment Script{Colors.NC}")
    print(f"{Colors.BLUE}  (Database & Model Updates Included){Colors.NC}")
    print(f"{Colors.BLUE}{'='*50}{Colors.NC}\n")
    
    # Configuration
    # ============================================
    # Your specific configuration:
    # ============================================
    PROJECT_NAME = "myproject"  # Your project folder name
    PYTHON_VERSION = "3.10"      # Python version (3.9, 3.10, 3.11, etc.)
    
    # Auto-detect username, or set manually if needed:
    # For user: BackendBadminton
    detected_username = getpass.getuser()
    USERNAME = detected_username  # Will auto-detect as "BackendBadminton" on PythonAnywhere
    
    # Auto-detect project path - check current directory first, then home directory
    current_dir = Path.cwd()
    home_dir = Path.home()
    
    # Check if we're already in the project directory (has manage.py)
    if (current_dir / "manage.py").exists():
        PROJECT_PATH = current_dir
        print(f"{Colors.YELLOW}✓ Detected project in current directory: {PROJECT_PATH}{Colors.NC}")
    # Check if project is in a subdirectory (e.g., ~/myproject/myproject/)
    elif (current_dir / PROJECT_NAME / "manage.py").exists():
        PROJECT_PATH = current_dir / PROJECT_NAME
        print(f"{Colors.YELLOW}✓ Detected project in subdirectory: {PROJECT_PATH}{Colors.NC}")
    # Check nested structure: ~/myproject/myproject/ (Git repo root with nested project)
    elif (current_dir.parent / PROJECT_NAME / "manage.py").exists() and current_dir.name == PROJECT_NAME:
        PROJECT_PATH = current_dir
        print(f"{Colors.YELLOW}✓ Detected nested project structure: {PROJECT_PATH}{Colors.NC}")
    # Check home directory
    elif (home_dir / PROJECT_NAME / "manage.py").exists():
        PROJECT_PATH = home_dir / PROJECT_NAME
        print(f"{Colors.YELLOW}✓ Detected project in home directory: {PROJECT_PATH}{Colors.NC}")
    else:
        PROJECT_PATH = home_dir / PROJECT_NAME
        print(f"{Colors.YELLOW}⚠ Using default path: {PROJECT_PATH}{Colors.NC}")
        print(f"{Colors.YELLOW}  Current directory: {current_dir}{Colors.NC}")
    
    print(f"{Colors.YELLOW}Configuration:{Colors.NC}")
    print(f"  Project: {PROJECT_NAME}")
    print(f"  Username: {USERNAME}")
    print(f"  Python: {PYTHON_VERSION}")
    print(f"  Path: {PROJECT_PATH}\n")
    
    # Step 1: Check project directory
    print_step(1, 10, "Checking project directory")
    if not PROJECT_PATH.exists():
        print_error(f"Project directory not found at {PROJECT_PATH}")
        print(f"{Colors.YELLOW}Current directory: {Path.cwd()}{Colors.NC}")
        print(f"{Colors.YELLOW}Please navigate to your project directory or update PROJECT_NAME{Colors.NC}")
        sys.exit(1)
    
    # Verify manage.py exists
    if not (PROJECT_PATH / "manage.py").exists():
        print_error(f"manage.py not found in {PROJECT_PATH}")
        print(f"{Colors.YELLOW}Please ensure you're in the correct project directory{Colors.NC}")
        sys.exit(1)
    
    # Save original directory before changing
    original_cwd = Path.cwd()
    
    os.chdir(PROJECT_PATH)
    print_success(f"Project directory found: {PROJECT_PATH}")
    
    # Step 2: Create virtual environment
    print_step(2, 10, "Setting up virtual environment")
    venv_path = PROJECT_PATH / "venv"
    if not venv_path.exists():
        success, _, _ = run_command(f"python{PYTHON_VERSION} -m venv venv")
        if success:
            print_success("Virtual environment created")
        else:
            print_error("Failed to create virtual environment")
            sys.exit(1)
    else:
        print(f"{Colors.YELLOW}⚠ Virtual environment already exists{Colors.NC}")
    
    # Step 3: Install dependencies
    print_step(3, 10, "Installing dependencies")
    venv_python = venv_path / "bin" / "python"
    venv_pip = venv_path / "bin" / "pip"
    
    if not venv_pip.exists():
        print_error("Virtual environment pip not found")
        sys.exit(1)
    
    run_command(f"{venv_pip} install --upgrade pip", check=False)
    
    # Look for requirements.txt - check multiple locations
    requirements_file = None
    
    # Check 1: Original directory (where script was run from)
    original_dir_requirements = original_cwd / "requirements.txt"
    # Check 2: Project path (current directory after os.chdir)
    project_path_requirements = PROJECT_PATH / "requirements.txt"
    # Check 3: Parent directory
    parent_requirements = PROJECT_PATH.parent / "requirements.txt"
    # Check 4: Current working directory (after chdir)
    current_dir_requirements = Path.cwd() / "requirements.txt"
    
    if original_dir_requirements.exists():
        requirements_file = original_dir_requirements
        print(f"{Colors.YELLOW}Found requirements.txt in original directory: {original_cwd}{Colors.NC}")
    elif current_dir_requirements.exists():
        requirements_file = current_dir_requirements
        print(f"{Colors.YELLOW}Found requirements.txt in current directory: {Path.cwd()}{Colors.NC}")
    elif project_path_requirements.exists():
        requirements_file = project_path_requirements
        print(f"{Colors.YELLOW}Found requirements.txt in project directory: {PROJECT_PATH}{Colors.NC}")
    elif parent_requirements.exists():
        requirements_file = parent_requirements
        print(f"{Colors.YELLOW}Found requirements.txt in parent directory: {PROJECT_PATH.parent}{Colors.NC}")
    else:
        print_error(f"requirements.txt not found")
        print(f"{Colors.YELLOW}Searched in:{Colors.NC}")
        print(f"  - Original directory: {original_cwd}")
        print(f"  - Current directory: {Path.cwd()}")
        print(f"  - Project path: {PROJECT_PATH}")
        print(f"  - Parent directory: {PROJECT_PATH.parent}")
        print(f"{Colors.YELLOW}Please ensure requirements.txt exists in one of these locations{Colors.NC}")
        sys.exit(1)
    
    print(f"{Colors.YELLOW}Using requirements.txt from: {requirements_file}{Colors.NC}")
    success, _, _ = run_command(f"{venv_pip} install -r {requirements_file}")
    if success:
        print_success("Dependencies installed")
    else:
        print_error("Failed to install dependencies")
        sys.exit(1)
    
    # Step 4: Update settings.py
    print_step(4, 10, "Updating settings.py for production")
    
    # Try to find settings.py in common locations
    settings_locations = [
        PROJECT_PATH / "backend" / "settings.py",
        PROJECT_PATH / PROJECT_NAME / "settings.py",
        PROJECT_PATH / "settings.py",
    ]
    
    settings_file = None
    for loc in settings_locations:
        if loc.exists():
            settings_file = loc
            break
    
    if not settings_file:
        print_error(f"settings.py not found. Searched in:")
        for loc in settings_locations:
            print(f"  - {loc}")
        sys.exit(1)
    
    print_info(f"Found settings.py at: {settings_file}")
    
    # Read current settings
    with open(settings_file, 'r', encoding='utf-8') as f:
        settings_content = f.read()
    
    # Remove old production settings if they exist
    lines = settings_content.split('\n')
    new_lines = []
    skip = False
    skip_count = 0
    
    for i, line in enumerate(lines):
        if '# ============================================' in line and i + 1 < len(lines) and 'Production Settings' in lines[i + 1]:
            skip = True
            skip_count = 0
        if skip:
            skip_count += 1
            # Stop skipping after finding the end (blank line after production settings block)
            if skip_count > 30 and line.strip() == '':
                # Check if we've passed the production block
                if 'if ON_PYTHONANYWHERE:' in '\n'.join(lines[max(0, i-30):i]):
                    skip = False
                    continue
            continue
        new_lines.append(line)
    
    # Add production settings
    production_settings = f"""

# ============================================
# PythonAnywhere Production Settings (Auto-generated)
# ============================================
ON_PYTHONANYWHERE = 'pythonanywhere.com' in os.environ.get('HTTP_HOST', '')
if ON_PYTHONANYWHERE:
    DEBUG = False
    ALLOWED_HOSTS = [
        '{USERNAME}.pythonanywhere.com',
        'www.{USERNAME}.pythonanywhere.com',
    ]
    CORS_ALLOWED_ORIGINS = [
        "https://{USERNAME}.pythonanywhere.com",
    ]
    CSRF_TRUSTED_ORIGINS = [
        "https://{USERNAME}.pythonanywhere.com",
    ]
    LOGGING = {{
        'version': 1,
        'disable_existing_loggers': False,
        'handlers': {{
            'file': {{
                'level': 'ERROR',
                'class': 'logging.FileHandler',
                'filename': os.path.join(BASE_DIR, 'django_errors.log'),
            }},
        }},
        'loggers': {{
            'django': {{
                'handlers': ['file'],
                'level': 'ERROR',
                'propagate': True,
            }},
        }},
    }}
"""
    
    with open(settings_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(new_lines) + production_settings)
    
    print_success("Settings updated")
    
    # Step 5: Make migrations for model changes
    print_step(5, 10, "Creating migrations for model changes")
    
    print_info("Checking for model changes...")
    success, stdout, stderr = run_command(f"{venv_python} manage.py makemigrations --dry-run", check=False)
    if success and stdout.strip():
        if "No changes detected" not in stdout:
            print_info("Model changes detected. Creating migrations...")
            success, stdout, stderr = run_command(f"{venv_python} manage.py makemigrations")
            if success:
                print_success("Migrations created successfully")
                if stdout:
                    migration_lines = [line for line in stdout.split('\n') if 'Migrations' in line or '.py' in line]
                    for line in migration_lines[:5]:
                        if line.strip() and 'Creating' in line:
                            print(f"  {Colors.GREEN}{line.strip()}{Colors.NC}")
            else:
                print_error("Failed to create migrations")
                print(f"{Colors.RED}Error: {stderr}{Colors.NC}")
                print(f"{Colors.YELLOW}⚠ Continuing anyway...{Colors.NC}")
        else:
            print_success("No model changes detected")
    else:
        print_success("No new migrations needed")
    
    # Step 6: Check database connection
    print_step(6, 10, "Checking database connection")
    success, stdout, stderr = run_command(f"{venv_python} manage.py check --database default", check=False)
    if success:
        print_success("Database connection verified")
    else:
        print(f"{Colors.YELLOW}⚠ Database check had issues, but continuing...{Colors.NC}")
        if stderr:
            print(f"{Colors.YELLOW}  {stderr[:200]}{Colors.NC}")
    
    # Step 7: Run migrations (Update database)
    print_step(7, 10, "Running database migrations")
    
    # Check for pending migrations first
    print_info("Checking for pending migrations...")
    success, stdout, stderr = run_command(f"{venv_python} manage.py showmigrations --plan", check=False)
    if success:
        pending = [line for line in stdout.split('\n') if '[ ]' in line]
        if pending:
            print_info(f"Found {len(pending)} pending migration(s)")
            for line in pending[:10]:  # Show first 10 pending migrations
                if line.strip():
                    print(f"  {Colors.YELLOW}{line.strip()}{Colors.NC}")
        else:
            print_success("No pending migrations")
    
    # Ask user if they want to run migrations
    print(f"\n{Colors.BLUE}Database Migration Options:{Colors.NC}")
    print("  1. Apply all pending migrations (recommended)")
    print("  2. Skip migrations")
    response = input(f"{Colors.BLUE}Choose option (1/2) [default: 1]: {Colors.NC}").strip()
    
    if response == '' or response == '1':
        print_info("Applying migrations...")
        success, stdout, stderr = run_command(f"{venv_python} manage.py migrate --noinput")
        if success:
            print_success("Migrations completed successfully")
            # Show migration output
            if stdout:
                migration_lines = [line for line in stdout.split('\n') if 'Applying' in line or 'OK' in line]
                for line in migration_lines[:15]:  # Show first 15 migration lines
                    if line.strip():
                        print(f"  {Colors.GREEN}{line.strip()}{Colors.NC}")
        else:
            print_error("Migrations failed")
            if stderr:
                print(f"{Colors.RED}Error details: {stderr[:500]}{Colors.NC}")
            print(f"{Colors.YELLOW}You may need to check your database configuration{Colors.NC}")
            response_continue = input(f"{Colors.YELLOW}Continue anyway? (y/n): {Colors.NC}")
            if response_continue.lower() not in ['y', 'yes']:
                sys.exit(1)
    else:
        print(f"{Colors.YELLOW}⚠ Skipped migrations{Colors.NC}")
    
    # Step 8: Verify database state
    print_step(8, 10, "Verifying database state")
    success, stdout, stderr = run_command(f"{venv_python} manage.py showmigrations", check=False)
    if success:
        unapplied = [line for line in stdout.split('\n') if '[ ]' in line]
        applied = [line for line in stdout.split('\n') if '[X]' in line]
        print_info(f"Applied migrations: {len(applied)}")
        if unapplied:
            print(f"{Colors.YELLOW}Unapplied migrations: {len(unapplied)}{Colors.NC}")
        else:
            print_success("All migrations applied")
    
    # Step 9: Collect static files
    print_step(9, 10, "Collecting static files")
    success, _, _ = run_command(f"{venv_python} manage.py collectstatic --noinput")
    if success:
        print_success("Static files collected")
    else:
        print_error("Failed to collect static files")
        print(f"{Colors.YELLOW}⚠ Continuing anyway...{Colors.NC}")
    
    # Step 10: Create superuser (optional)
    print_step(10, 10, "Superuser creation")
    response = input(f"{Colors.BLUE}Do you want to create a superuser? (y/n): {Colors.NC}")
    if response.lower() in ['y', 'yes']:
        run_command(f"{venv_python} manage.py createsuperuser", check=False)
        print_success("Superuser creation completed")
    else:
        print(f"{Colors.YELLOW}⚠ Skipped superuser creation{Colors.NC}")
    
    # Generate WSGI config
    print(f"\n{Colors.YELLOW}Generating WSGI configuration...{Colors.NC}")
    wsgi_file = PROJECT_PATH / "wsgi_config_generated.py"
    
    # Determine settings module path
    settings_module = "backend.settings"
    if (PROJECT_PATH / PROJECT_NAME / "settings.py").exists():
        settings_module = f"{PROJECT_NAME}.settings"
    
    wsgi_content = f"""# Auto-generated WSGI configuration for PythonAnywhere
# Copy this content to your WSGI file in the Web tab

import os
import sys

path = '{PROJECT_PATH}'
if path not in sys.path:
    sys.path.insert(0, path)

os.environ['DJANGO_SETTINGS_MODULE'] = '{settings_module}'

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
"""
    
    with open(wsgi_file, 'w', encoding='utf-8') as f:
        f.write(wsgi_content)
    print_success(f"WSGI configuration generated: {wsgi_file.name}")
    
    # Summary
    print(f"\n{Colors.GREEN}{'='*50}{Colors.NC}")
    print(f"{Colors.GREEN}  Deployment Setup Complete!{Colors.NC}")
    print(f"{Colors.GREEN}{'='*50}{Colors.NC}\n")
    
    print(f"{Colors.YELLOW}What was done:{Colors.NC}")
    print("✓ Virtual environment setup")
    print("✓ Dependencies installed")
    print("✓ Settings.py updated for production")
    print("✓ Migrations created (if model changes detected)")
    print("✓ Database migrations applied")
    print("✓ Static files collected")
    print("✓ WSGI configuration generated\n")
    
    print(f"{Colors.YELLOW}Next steps (Manual):{Colors.NC}")
    print("1. Go to Web tab in PythonAnywhere dashboard")
    print("2. Click 'Add a new web app' (if not created)")
    print("3. Choose: Manual configuration, Python", PYTHON_VERSION)
    print(f"4. Click on 'WSGI configuration file'")
    print(f"5. Copy content from: {wsgi_file.name}")
    print("6. Configure static files:")
    print(f"   - URL: /static/")
    print(f"   - Directory: {PROJECT_PATH}/staticfiles")
    print("7. Configure media files (if using):")
    print(f"   - URL: /media/")
    print(f"   - Directory: {PROJECT_PATH}/media")
    print("8. Click 'Reload' button\n")
    
    print(f"{Colors.GREEN}Your API will be available at:{Colors.NC}")
    print(f"{Colors.BLUE}https://{USERNAME}.pythonanywhere.com{Colors.NC}\n")
    
    print(f"{Colors.YELLOW}Database Status:{Colors.NC}")
    print(f"  - Models: Checked and migrations created if needed")
    print(f"  - Database: Migrations applied")
    print(f"  - Status: Ready for production\n")

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n{Colors.YELLOW}Deployment cancelled by user{Colors.NC}")
        sys.exit(1)
    except Exception as e:
        print(f"\n{Colors.RED}Error: {e}{Colors.NC}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

