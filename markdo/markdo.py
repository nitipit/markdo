#!/usr/bin/env python
from gi.repository import Gtk, WebKit
from urlparse import urlparse
import os

Gtk.init('')

class App(object):
    def __init__(self):
        self.base_path = os.path.abspath(os.path.dirname(__file__))

    registedRoute = {}
    def route(self, path=None):
        def decorator(fn):
            self.registedRoute[path] = fn
            return fn
        return decorator

    def uri_route(uri):
        print uri

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
    if url.path[0] == '/':
        url = url.path[1:]
    else:
        url = url.path
    url = 'file://' + os.path.join(app.base_path, url)
    request.set_uri(url)

def run():
    (window, webkitView) = init()
    Gtk.main()

if __name__ == '__main__':
    run()
