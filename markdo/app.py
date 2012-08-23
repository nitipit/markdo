#!/usr/bin/env python
from gi.repository import Gtk, WebKit, Soup
from urlparse import urlparse
import os
import sys
import re

Gtk.init('')

class App(object):
    """App
    Application class
    """
    registed_route = {} # for url to function mapping
    document = None # Root DOM
    try:
        file_name = sys.argv[1]
    except:
        file_name = None

    def __init__(self):
        self.base_path = os.path.abspath(os.path.dirname(__file__))

    def route(self, path=None):
        def decorator(fn):
            self.registed_route[path] = fn
            return fn
        return decorator

app = App()

def init():
    window = Gtk.Window()
    window.set_title('MarkDo')
    webkitView = WebKit.WebView()
    settings = webkitView.get_settings()
    settings.set_property('enable-universal-access-from-file-uris', True)
    settings.set_property('enable-developer-extras', True)
    window.set_default_size(800,600)
    scrollWindow = Gtk.ScrolledWindow()
    scrollWindow.add(webkitView)
    window.add(scrollWindow)
    window.connect('destroy', Gtk.main_quit)
    ui_path = 'file:///' + os.path.join(app.base_path, 'ui.html')
    webkitView.load_uri(ui_path)
    webkitView.connect('notify::load-status', on_notify_load_status)
    webkitView.connect('resource-request-starting', on_resource_request_starting)
    window.show_all()
    return (window, webkitView)

def on_notify_load_status(webkitView, *args, **kwargs):
    """Callback function when the page was loaded completely

    FYI, this function will be called after $(document).ready()
    in jQuery
    """
    status = webkitView.get_load_status()
    if status == status.FINISHED:
        app.document = webkitView.get_dom_document()
        # load file content into editor
        if app.file_name != None:
            input_file = app.document.get_element_by_id('file')
            input_file.set_value(app.file_name)
            md = open(app.file_name, 'r').read()
            app.document.get_element_by_id('editor').set_value(md)
            webkitView.execute_script('codeMirror.setValue($("#editor").val())')

def on_resource_request_starting(webkitView, *args, **kwargs):
    """Call back function to handle urls start with '/'

    Handle webkit request for local resources
    """

    web_resource = args[1]
    request = args[2]
    url = urlparse(request.get_uri())

    # return file uri if request for /static/
    # else, route to registed function
    if re.match('^/static/', url.path):
        url = url.path[1:]
        url = 'file://' + os.path.join(app.base_path, url)
        request.set_uri(url)
    else:
        path = url.path.split('/')
        for i in range(path.count('')):
            path.remove('')

        for key in app.registed_route.keys():
            route = key.split('/')
            for i in range(route.count('')):
                route.remove('')
            if path == route :
                app.registed_route[key](webkitView, web_resource, request)


def run():
    (window, webkitView) = init()
    Gtk.main()

@app.route('/save/')
def save(webkitView, web_resource, request):
    """save markdown content to the file"""

    file_name = app.document.get_element_by_id('file').get_value()
    webkitView.execute_script('$("#editor").val(codeMirror.getValue())')
    md = app.document.get_element_by_id('editor').get_value()
    f = open(file_name, 'w')
    f.write(md)
    f.close()

if __name__ == '__main__':
    run()
