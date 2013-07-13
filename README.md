vim-netbeans-proxy
==================

A proxy for Vim Netbeans connections.

Purpose
-------

Connect to a host from behind a firewall, or connect to an IPv6 host.
(Vim only supports IPv4 for netbeans)

[MIT License](http://cel.mit-license.org)

Starting the proxy
------------------

To specify which host and port the proxy should bind to, set the environmental variables `HOST` and `PORT`. Then start:

    npm start

Connecting to the proxy
-----------------------

in vim:

Connect to `host:port` with password `pass` through a vim-netbeans-proxy on
`proxyhost:proxyport`:

    :nbs:proxyhost:proxyport:host:port:pass

If omitted, the host will be localhost, and the port will be 3219.

If you are running vim-netbeans-proxy locally on the default port, you can
omit `proxyhost` and `proxyport`:

    :nbs:::host:port:pass

and if the service to connect to uses the default port and no password, you can
omit `port` and `pass`:

    :nbs:::host
