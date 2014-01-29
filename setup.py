#!/usr/bin/env python

from distutils.core import setup
import os

data = list()
for d in os.walk('markdo/'):
    if len(d[2]) > 0:
        path_list = map(
            lambda x: str.join('/', os.path.join(d[0], x).split('/')[1:]),
            d[2]
        )
        data.extend(path_list)

setup(
    # Metadata
    name="MarkDo",
    version='0.2.6',
    author="Nitipit Nontasuwan",
    author_email="nitipit@gmail.com",
    url="http://nitipit.github.com/markdo/",
    license="MIT",
    description="Markdown editor for Gnome",
    platforms=['linux', 'gnome'],
    keywords=['editor', 'markdown'],

    # Setup config
    packages=['markdo'],
    package_dir={'markdo': 'markdo'},
    package_data={'markdo': data},
    scripts=['markdo/markdo'],
    install_requires=['appkit>=0.2.8', ]
)
