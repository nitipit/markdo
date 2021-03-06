#!/usr/bin/env python

from appkit.api.v0_2_8 import App
from flask import render_template, request
import os
import sys
import codecs

app = App(__name__)

try:
    file_name = sys.argv[1]
    if not os.path.exists(file_name):
        open(file_name, 'w').close()
except:
    file_name = None

app.file_name = file_name
print(app.file_name)


@app.route('/')
def index():
    markdown = None
    if app.file_name is not None:
        markdown = codecs.open(file_name, 'r', 'utf-8').read()
    return render_template(
            '/ui.html',
            file_name=app.file_name,
            text=markdown)


@app.route('/save/', methods=['POST',])
def save():
    """save markdown content to the file"""

    file_name = request.form.get('file', None)
    text = request.form.get('text', None)

    f = codecs.open(file_name, 'w', encoding='utf-8')
    f.write(text)
    f.close()
    return 'Saved'

app.debug = True
app.run()
