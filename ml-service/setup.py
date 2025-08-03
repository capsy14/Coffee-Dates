from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

with open("requirements.txt", "r", encoding="utf-8") as fh:
    requirements = [line.strip() for line in fh if line.strip() and not line.startswith("#")]

setup(
    name="coffee-dates-ml",
    version="1.0.0",
    author="Coffee Dates Team",
    author_email="ml@coffeedates.app",
    description="Machine Learning powered matchmaking service for Coffee Dates app",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/coffeedates/ml-service",
    packages=find_packages(),
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Topic :: Scientific/Engineering :: Artificial Intelligence",
        "Topic :: Internet :: WWW/HTTP :: HTTP Servers",
    ],
    python_requires=">=3.8",
    install_requires=requirements,
    extras_require={
        "dev": [
            "pytest>=7.0.0",
            "pytest-asyncio>=0.21.0",
            "black>=22.0.0",
            "flake8>=4.0.0",
            "mypy>=0.991",
        ],
        "privacy": [
            "cryptography>=3.4.8",
            "phe>=1.5.0",  # For homomorphic encryption
            "opacus>=1.3.0",  # For differential privacy in PyTorch
        ]
    },
    entry_points={
        "console_scripts": [
            "coffee-dates-ml=api.main:main",
            "coffee-dates-data-loader=utils.data_loader:main",
        ],
    },
    include_package_data=True,
    package_data={
        "": ["*.json", "*.yaml", "*.yml"],
    },
)