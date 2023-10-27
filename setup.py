from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in tianjy_patch/__init__.py
from tianjy_patch import __version__ as version

setup(
	name="tianjy_patch",
	version=version,
	description="Tianjy Patch",
	author="guigu",
	author_email="guigu",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
