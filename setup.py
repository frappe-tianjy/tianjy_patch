from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

version = '0.0.1'

setup(
	name="tianjy_patch",
	version=version,
	description="Tianjy Patch",
	author="Tianjy",
	author_email="Tianjy",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
