#!/usr/bin/env python3

import sys
import enum
import json
import struct
import logging

from pydbus import SessionBus
from pydbus.generic import signal
from collections import namedtuple
from gi.repository import GLib, Gio

log = logging.getLogger(__name__)

NO_TRACK = "/org/mpris/MediaPlayer2/TrackList/NoTrack"


class PlaybackStatus(enum.Enum):
    """Supported playback statuses."""

    PLAYING = "Playing"
    PAUSED = "Paused"
    STOPPED = "Stopped"


# Class for the org.mpris.MediaPlayer2 interface
class Root(object):  # noqa
    """<!DOCTYPE node PUBLIC
      "-//freedesktop//DTD D-BUS Object Introspection 1.0//EN"
      "http://www.freedesktop.org/standards/dbus/1.0/introspect.dtd">

    <node>
    <interface name="org.mpris.MediaPlayer2">
        <property name="CanQuit"                type="b"    access="read"/>
        <property name="Fullscreen"             type="b"    access="readwrite">
            <annotation name="org.mpris.MediaPlayer2.property.optional" value="true"/>
        </property>
        <property name="CanSetFullscreen"       type="b"    access="read">
            <annotation name="org.mpris.MediaPlayer2.property.optional" value="true"/>
        </property>
        <property name="CanRaise"               type="b"    access="read"/>
        <property name="HasTrackList"           type="b"    access="read"/>
        <property name="Identity"               type="s"    access="read"/>
        <property name="DesktopEntry"           type="s"    access="read">
            <annotation name="org.mpris.MediaPlayer2.property.optional" value="true"/>
        </property>
        <property name="SupportedUriSchemes"    type="as" access="read"/>
        <property name="SupportedMimeTypes"     type="as" access="read"/>

        <method name="Raise"/>
        <method name="Quit"/>
    </interface>
    </node>
    """  # noqa

    PropertiesChanged = signal()

    def __init__(self, can_quit=False, can_raise=False,
                 can_set_fullscreen=False, has_tracklist=False,
                 supported_mime_types=None, supported_uri_schemes=None,
                 fullscreen=False, identity="MediaPlayer2", desktop_entry=None,
                 **kwargs):
        super().__init__(**kwargs)
        self.CanQuit = can_quit
        self.CanRaise = can_raise
        self.HasTrackList = has_tracklist
        self.SupportedMimeTypes = (supported_mime_types
                                   if supported_mime_types is not None else [])
        self.SupportedUriSchemes = (supported_uri_schemes
                                    if supported_uri_schemes is not None else [])  # noqa: E501

        self.CanSetFullscreen = can_set_fullscreen
        self.Fullscreen = fullscreen
        self.DesktopEntry = desktop_entry

        self.Identity = identity

    def Raise(self):  # noqa: N802
        pass

    def Quit(self):  # noqa: N802
        if not self.CanQuit:
            return


# Class for the org.mpris.MediaPlayer2.Player interface
class Player(object):  # noqa
    """<!DOCTYPE node PUBLIC
      "-//freedesktop//DTD D-BUS Object Introspection 1.0//EN"
      "http://www.freedesktop.org/standards/dbus/1.0/introspect.dtd">

    <node>
    <interface name="org.mpris.MediaPlayer2.Player">
        <property name="PlaybackStatus" type="s"     access="read"/>
        <property name="LoopStatus"     type="s"     access="readwrite">
            <annotation name="org.mpris.MediaPlayer2.property.optional" value="true"/>
        </property>
        <property name="Rate"           type="d"     access="readwrite"/>
        <property name="Shuffle"        type="b"     access="readwrite">
            <annotation name="org.mpris.MediaPlayer2.property.optional" value="true"/>
        </property>
        <property name="Metadata"       type="a{sv}" access="read"/>
        <property name="Volume"         type="d"     access="readwrite"/>
        <property name="Position"       type="x"     access="read">
            <annotation name="org.freedesktop.DBus.Property.EmitsChangedSignal" value="false"/>
        </property>
        <property name="MinimumRate"    type="d"     access="read"/>
        <property name="MaximumRate"    type="d"     access="read"/>
        <property name="CanGoNext"      type="b"     access="read"/>
        <property name="CanGoPrevious"  type="b"     access="read"/>
        <property name="CanPlay"        type="b"     access="read"/>
        <property name="CanPause"       type="b"     access="read"/>
        <property name="CanSeek"        type="b"     access="read"/>
        <property name="CanControl"     type="b"     access="read">
            <annotation name="org.freedesktop.DBus.Property.EmitsChangedSignal" value="false"/>
        </property>

        <signal name="Seeked">
            <arg name="Position" type="x"/>
        </signal>

        <method name="Next"/>
        <method name="Previous"/>
        <method name="Pause"/>
        <method name="PlayPause"/>
        <method name="Stop"/>
        <method name="Play"/>
        <method name="Seek">
            <arg direction="in" type="x" name="Offset"/>
        </method>
        <method name="SetPosition">
            <arg direction="in" type="o" name="TrackId"/>
            <arg direction="in" type="x" name="Position"/>
        </method>
        <method name="OpenUri">
            <arg direction="in" type="s" name="Uri"/>
        </method>
    </interface>
    </node>
    """  # noqa

    Seeked = signal()

    def __init__(self, loop_status="None", metadata=None, position=0,
                 playback_status=PlaybackStatus.STOPPED.value, rate=1,
                 shuffle=False, volume=1, can_control=True, can_pause=True,
                 can_play=True, can_seek=False, minimum_rate=1, maximum_rate=1,
                 can_go_next=True, can_go_previous=True, **kwargs):
        super().__init__(**kwargs)
        self._loop_status = loop_status
        if metadata is None:
            metadata = {
                "mpris:trackid": GLib.Variant("o", NO_TRACK)
            }
        self.Metadata = metadata
        self.Position = position

        self.PlaybackStatus = playback_status
        self.Rate = rate
        self.Shuffle = shuffle
        self.Volume = volume
        self.CanControl = can_control
        self.CanPlay = can_play
        self.CanPause = can_pause
        self.CanSeek = can_seek
        self.CanGoNext = can_go_next
        self.CanGoPrevious = can_go_previous
        self.MinimumRate = minimum_rate
        self.MaximumRate = maximum_rate

    @property
    def LoopStatus(self):  # noqa: N802
        return self._loop_status

    @LoopStatus.setter
    def LoopStatus(self, value):  # noqa: N802
        if not self.CanControl:
            raise ValueError

    def Next(self):  # noqa: N802
        if self.CanControl and self.CanGoNext:
            raise NotImplementedError

    def OpenUri(self, uri):  # noqa: N802
        pass

    def Pause(self):  # noqa: N802
        if self.CanControl and self.CanPause:
            raise NotImplementedError

    def Play(self):  # noqa: N802
        if self.CanControl and self.CanPlay:
            raise NotImplementedError

    def PlayPause(self):  # noqa: N802
        if self.CanControl and self.CanPause:
            raise NotImplementedError
        if not self.CanPause:
            raise NotImplementedError

    def Previous(self):  # noqa: N802
        if self.CanControl and self.CanGoPrevious:
            raise NotImplementedError

    def Seek(self, offset):  # noqa: N802
        if self.CanControl and self.CanSeek:
            raise NotImplementedError

    def SetPosition(self, trackid, position):  # noqa: N802
        if self.CanControl and self.CanSeek:
            raise NotImplementedError

    def Stop(self):  # noqa: N802
        raise NotImplementedError


class MediaPlayer(Player, Root):
    """A class representing a generic MPRIS media player."""

    # Used by pydbus
    dbus = [Root.__doc__, Player.__doc__]

    # The name of the media player. Subclasses should set that.
    name = None

    # The annotation that indicates if a signal should be emited when a
    # property changes.
    CHANGED_ANNOT = "org.freedesktop.DBus.Property.EmitsChangedSignal"

    def __setattr__(self, name, value):
        """Override to set the DBus object properties and emit signals."""
        if name == "_properties":
            return super().__setattr__(name, value)

        props = [p.name for i in self._properties for p in self._properties[i]]
        if name in props:
            self.set_properties({name: value})
        else:
            super().__setattr__(name, value)

    def __init__(self, name=None, **kwargs):
        # NOTE: Ensure this is always first, as ther attribute accesses might
        # fail due to __setattr__ needing self._properties.
        self._properties = {}

        self.name = name if name is not None else self.name
        if self.name is None:
            raise ValueError("Attribute `name' must be set")

        super().__init__(**kwargs)

        # Initialize _properties, a dict that maps DBus interfaces to lists of
        # DBus properties.
        node_info = [Gio.DBusNodeInfo.new_for_xml(i) for i in self.dbus]
        interfaces = sum((ni.interfaces for ni in node_info), [])

        for iface in interfaces:
            self._properties[iface] = [
                p for p in iface.properties
                if p.flags & Gio.DBusPropertyInfoFlags.READABLE
            ]

    @staticmethod
    def _patch_metadata(metadata, player_name):
        """Patch the metadata.

        Replace metadata values with GLib.Variants. Also handle the trackId.
        """
        metadata_types = {
            "mpris:trackid": "o",
            "mpris:length": "x",
            "mpris:artUrl": "s",
            "xesam:url": "s",
            "xesam:title": "s",
            "xesam:artist": "as",
            "xesam:album": "s",
        }

        # Handle track id
        if "mpris:trackid" in metadata:
            if metadata["mpris:trackid"] is None:
                trackid = NO_TRACK
            else:
                trackid = (("/mpris/%s/tracks/" % player_name)
                           + str(metadata["mpris:trackid"]).lstrip("/"))
            metadata["mpris:trackid"] = trackid

        # Patch metadata, replacing values with GLib.Variants.
        patched_metadata = {
            k: GLib.Variant(metadata_types[k], v) for k, v in metadata.items()
            if k in metadata_types and v is not None
        }
        return patched_metadata

    def set_properties(self, changed_props):
        """Set interface properties, emitting signals when needed.

        We use this method to set attributes that are interface properties
        to be able to correctly emit signals. Otherwise a simple `attr = value'
        would suffice. We also handle the Metadata attribute.
        """
        if "Metadata" in changed_props:
            changed_props["Metadata"] = (
                self._patch_metadata(changed_props["Metadata"], self.name))

        for iface, props in self._properties.items():
            iface_changed_props = {}
            props_to_signal = {}
            for p in props:
                if p.name in changed_props:
                    iface_changed_props[p.name] = changed_props[p.name]

                    for a in p.annotations:
                        if (a.key == self.CHANGED_ANNOT
                                and a.value.lower() == "false"):
                            break
                    else:
                        # We didn't found the CHANGED_ANNOT or we found it and
                        # it was not "false". We should signal for this
                        # property.
                        props_to_signal[p.name] = changed_props[p.name]

            # NOTE; Use super().__setattr__() since self.__setattr__() calls us
            for name, value in iface_changed_props.items():
                super().__setattr__(name, value)

            # Emit signal for changed properties
            if props_to_signal:
                self.PropertiesChanged(iface.name, props_to_signal, [])

    def publish(self, bus=None):
        """Publish the media player to DBus."""
        if bus is None:
            bus = SessionBus()

        pub = bus.publish("org.mpris.MediaPlayer2.%s" % self.name,
                          ("/org/mpris/MediaPlayer2", self))
        return (bus, pub)


class StreamKeysMPRIS(MediaPlayer):
    """The StreamKeys MPRIS media player."""

    def __init__(self):
        super().__init__(name="streamkeys",
                         identity="Chrome StreamKeys extension")

    def Pause(self):  # noqa: N802
        status = PlaybackStatus(self.PlaybackStatus)
        if self.CanPause and status == PlaybackStatus.PLAYING:
            send_msg(Message(command=Command.PAUSE))

    def Play(self):  # noqa: N802
        status = PlaybackStatus(self.PlaybackStatus)
        if self.CanPlay and status != PlaybackStatus.PLAYING:
            send_msg(Message(command=Command.PLAY))

    def PlayPause(self):  # noqa: N802
        if self.CanPause:
            status = PlaybackStatus(self.PlaybackStatus)
            if status in [PlaybackStatus.PAUSED, PlaybackStatus.STOPPED]:
                send_msg(Message(command=Command.PLAY))
            elif status == PlaybackStatus.PLAYING:
                send_msg(Message(command=Command.PAUSE))

    def Next(self):  # noqa: N802
        if self.CanGoNext:
            send_msg(Message(command=Command.NEXT))

    def Previous(self):  # noqa: N802
        if self.CanGoPrevious:
            send_msg(Message(command=Command.PREVIOUS))

    def Stop(self):  # noqa: N802
        send_msg(Message(command=Command.STOP))


def make_streams_binary():
    # Messages should be in UTF-8, preceded with 32-bit message length.
    sys.stdin = sys.stdin.detach()
    sys.stdout = sys.stdout.detach()


def encode_msg(msg):
    """Encode a message before sending it."""
    # Each message is serialized using JSON, UTF-8 encoded and is preceded with
    # 32-bit message length in native byte order.
    try:
        text = json.dumps(msg)
    except ValueError:
        return 0

    data = text.encode("utf-8")
    length_bytes = struct.pack("@i", len(data))
    return length_bytes + data


class Message(namedtuple("Message", ["command", "args"])):
    """A class represending a message."""

    # Maintain the efficiency of a named tuple
    __slots__ = ()

    def __new__(cls, command, args=None):
        # add default values
        args = [] if args is None else args
        return super(Message, cls).__new__(cls, command, args)


def send_msg(msg):
    """Send a message to the extension."""
    enc_msg = encode_msg({"command": msg.command.value, "args": msg.args})
    written = sys.stdout.write(enc_msg)
    # We flush to make sure that Chrome gets the message *right now*
    sys.stdout.flush()
    return written


def recv_msg():
    """Receive a message from the extension."""
    # Each message is serialized using JSON, UTF-8 encoded and is preceded with
    # 32-bit message length in native byte order.
    # Read the message length (first 4 bytes).
    length_bytes = sys.stdin.read(4)
    if len(length_bytes) < 4:
        raise ValueError("unexpected end of input")

    # Unpack message length as 4 byte integer.
    length = struct.unpack("@i", length_bytes)[0]

    # Read the text (JSON object) of the message.
    text = sys.stdin.read(length).decode("utf-8")
    msg = json.loads(text)
    command = msg["command"]
    args = msg.get("args", None)
    return Message(command=command, args=args)


class Command(enum.Enum):
    """Supported commands in messages."""

    PLAY = "play"  # no args
    PAUSE = "pause"  # no args
    PLAYPAUSE = "playpause"  # no args
    STOP = "stop"  # no args
    NEXT = "next"  # no args
    PREVIOUS = "previous"  # no args
    UPDATE_STATE = "update_state"  # args: List of a dict with updated state
    SEEK = "seek"  # args: The number of microseconds to seek forward/backwards
    ADD_PLAYER = "add_player"  # no args
    REMOVE_PLAYER = "remove_player"  # no args
    QUIT = "quit"  # no args


def setup_logger(level=logging.DEBUG):
    log = logging.getLogger()
    log.setLevel(level)
    stream = logging.StreamHandler(sys.stdout)
    stream.setLevel(level)
    log.addHandler(stream)
    return log


class StreamKeysDBusService(object):

    def __init__(self):
        self.bus = None
        self.player = None
        self.dbus_pub = None
        self.loop = None

    def run(self):
        self.loop = GLib.MainLoop()
        chan = GLib.IOChannel.unix_new(sys.stdin.fileno())
        GLib.io_add_watch(chan, GLib.IOCondition.IN, self.message_handler)
        GLib.io_add_watch(chan, GLib.IOCondition.HUP,
                          lambda *_: self.loop.quit())
        self.loop.run()

    def add_player(self):
        if not self.player:
            self.player = StreamKeysMPRIS()
            self.bus, self.dbus_pub = self.player.publish()

    def remove_player(self):
        if self.dbus_pub:
            self.dbus_pub.unpublish()
            self.player = None
            self.dbus_pub = None

    def message_handler(self, chan, condition):
        try:
            msg = recv_msg()
            cmd = Command(msg.command)

            if cmd == Command.QUIT:
                self.loop.quit()
            elif cmd == Command.ADD_PLAYER:
                self.add_player()
            elif cmd == Command.REMOVE_PLAYER:
                self.remove_player()
            elif cmd in [Command.PLAY, Command.PAUSE, Command.STOP,
                         Command.NEXT, Command.PREVIOUS]:
                func = getattr(self.player, cmd.value.capitalize())
                func()
            elif cmd == Command.PLAYPAUSE:
                self.player.PlayPause()
            elif cmd == Command.UPDATE_STATE:
                self.player.set_properties(*msg.args)
            elif cmd == Command.SEEK:
                self.player.Seeked(*msg.args)
            else:
                raise NotImplementedError("Cannot handle command `%s'" % cmd)
        except Exception as e:  # noqa: F841
            # FIXME: stdout/stderr is detached
            # log.exception(e)
            pass

        # Return true, otherwise GLib will remove our watch
        return True


def main():
    global log
    make_streams_binary()
    log = setup_logger()
    StreamKeysDBusService().run()


if __name__ == "__main__":
    main()
