#!/usr/bin/env python

from appkit.api.v0_2_4 import App
import os
import sys
from jinja2 import Template
import codecs


app = App(__file__)

try:
    file_name = sys.argv[1]
    if not os.path.exists(file_name):
        open(file_name, 'w').close()
except:
    file_name = None

app.file_name = file_name


@app.route('/$')
def index():
    ui_path = os.path.join(app.app_dir, 'ui.html')
    template = Template(open(ui_path).read())
    markdown = None
    if app.file_name is not None:
        markdown = codecs.open(file_name, 'r', 'utf-8').read()
    return template.render(file_name=app.file_name, text=markdown)


@app.route('/save/')
def save():
    """save markdown content to the file"""

    document = app.webkit_web_view.get_dom_document()
    file_name = document.get_element_by_id('file').get_value()
    md = document.get_element_by_id('editor').get_value()
    f = open(file_name, 'w')
    f.write(md)
    f.close()
    return 'Saved'

if __name__ == '__main__':
    app.run()
