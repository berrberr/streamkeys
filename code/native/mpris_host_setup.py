#!/usr/bin/env python3

import os
import sys
import json
import logging
import argparse

log = logging.getLogger(__name__)

HOST_FILENAME = "streamkeys_mpris.py"
HOST_MANIFEST_FILENAME = "org.mpris.streamkeys_host.json"
HOST_MANIFEST = {
  "name": "org.mpris.streamkeys_host",
  "description": "Streamkeys MPRIS native messaging host",
  "path": None,
  "type": "stdio",
  "allowed_origins": []
}
XDG_CONFIG_HOME = os.environ.get("XDG_CONFIG_HOME",
                                 default=os.path.expanduser("~/.config"))


def initialize_parser():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dir", dest="install_dir",
                        default=os.path.join(XDG_CONFIG_HOME, "streamkeys"),
                        help="The directory to install the host script")
    subparsers = parser.add_subparsers(title="Commands", metavar="")

    p = subparsers.add_parser("install",
                              help="Install the native messaging host")
    p.add_argument("id", help="The extension ID")
    p.set_defaults(func=main_install)

    p = subparsers.add_parser("uninstall",
                              help="Uninstall the native messaging host")
    p.set_defaults(func=main_uninstall)
    return parser


def get_xdg_config_paths():
    return [os.path.join(XDG_CONFIG_HOME, "chromium"),
            os.path.join(XDG_CONFIG_HOME, "google-chrome")]


def install_host(ext_id, install_dir):
    # Copy the host script
    host_path = os.path.join(install_dir, HOST_FILENAME)
    os.makedirs(install_dir, exist_ok=True)
    src = os.path.join(os.path.dirname(os.path.realpath(__file__)), "mpris.py")
    with open(src, "rb") as f:
        data = f.read()
    with open(host_path, "wb") as f:
        f.write(data)
    os.chmod(host_path, 0o744)

    # Create the manifest file
    xdg_paths = get_xdg_config_paths()
    manifest = dict(HOST_MANIFEST)
    manifest["path"] = host_path
    manifest["allowed_origins"].append("chrome-extension://%s/" % ext_id)
    for path in xdg_paths:
        if not os.path.exists(path):
            continue
        message_hosts = os.path.join(path, "NativeMessagingHosts")
        manifest_path = os.path.join(message_hosts, HOST_MANIFEST_FILENAME)

        os.makedirs(message_hosts, exist_ok=True)
        with open(manifest_path, "w") as f:
            json.dump(manifest, f, indent=2)
        os.chmod(manifest_path, 0o644)


def uninstall_host(install_dir):
    # Remove host script
    host_path = os.path.join(install_dir, HOST_FILENAME)
    if os.path.isfile(host_path):
        os.remove(host_path)

    # Remove manifest file
    xdg_paths = get_xdg_config_paths()
    for path in xdg_paths:
        if not os.path.exists(path):
            continue
        message_hosts = os.path.join(path, "NativeMessagingHosts")
        manifest_path = os.path.join(message_hosts, HOST_MANIFEST_FILENAME)
        if os.path.isfile(manifest_path):
            os.remove(manifest_path)


def setup_logger(level=logging.DEBUG):
    log = logging.getLogger()
    log.setLevel(level)
    stream = logging.StreamHandler(sys.stdout)
    stream.setLevel(level)
    log.addHandler(stream)
    return log


def main():
    global log

    parser = initialize_parser()
    args = parser.parse_args()
    log = setup_logger()

    return args.func(args)


def main_install(args):
    # Chrome's extension IDs are in hexadecimal but using a-p, referred
    # internally as "mpdecimal". See https://stackoverflow.com/a/2050916
    if (len(args.id) != 32
            or any(ord(c) not in range(97, 113) for c in args.id)):
        raise RuntimeError("Not valid extension ID: %s" % args.id)

    try:
        from gi.repository import GLib, Gio  # noqa: F401
    except ImportError:
        raise RuntimeError("Required dependency `python3-gobject' not"
                           " found")

    try:
        import pydbus  # noqa: F401
    except ImportError:
        raise RuntimeError("Required dependency `python3-pydbus' not"
                           " found")

    install_host(args.id, args.install_dir)


def main_uninstall(args):
    uninstall_host(args.install_dir)


if __name__ == "__main__":
    sys.exit(main())
