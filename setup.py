from distutils.core import setup
import os

data = list()
for d in os.walk('markdo/'):
    if len(d[2]) > 0:
        path_list = map(lambda x: str.join('/',os.path.join(d[0],x).split('/')[1:]), d[2])
        data.extend(path_list)

setup(
    name = "MarkDo",
    version = "0.1",
    package_dir = {'markdo': 'markdo'},
    packages = ['markdo'],
    scripts = ['markdo/markdo'],
    package_data = {'markdo': data}
)
