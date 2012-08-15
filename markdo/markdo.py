#!/usr/bin/env python
from gi.repository import Gtk, WebKit
from urlparse import urlparse
import os
import re

Gtk.init('')

class App(object):
    registed_route = {}
    bounded_file = None

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
    settings.set_property('enable-file-access-from-file-uris', True)
    window.set_size_request(400,600)
    scrollWindow = Gtk.ScrolledWindow()
    scrollWindow.add(webkitView)
    window.add(scrollWindow)
    window.connect('destroy', Gtk.main_quit)
    ui_path = 'file:///' + os.path.join(app.base_path, 'ui.html')
    webkitView.load_uri(ui_path)
    webkitView.connect('resource-request-starting', on_resource_request_starting)
    window.show_all()
    return (window, webkitView)

def on_resource_request_starting(webkitView, *args, **kwargs):
    web_resource = args[1]
    request = args[2]
    url = urlparse(request.get_uri())
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
                app.registed_route[key]()


def run():
    (window, webkitView) = init()
    Gtk.main()

@app.route('/save/')
def save():
    print 'save'

if __name__ == '__main__':
    run()
