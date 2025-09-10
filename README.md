# Zebra Printing Extension for Google Chrome

Most Zebra Printers have a [HTTP POST endpoint](https://developer.zebra.com/community/home/blog/2015/03/31/printing-from-websites-part-2) through which ZPL can be directly printed without the need for an installed driver, print dialogs popping up or other locally installed software.

Unfortunately those printers [don't set any CORS headers](https://developer.zebra.com/community/home/blog/2015/08/13/http-post-printing-and-cors) which makes it impossible to use this HTTP endpoint in modern browser-based apps.

This extension circumvents this issue.

[![Available in the Chrome Web Store](https://storage.googleapis.com/web-dev-uploads/image/WlD8wC6g8khYWPJUsQceQkhXSlv1/UV4C4ybeBTsZt43U4xis.png)](https://chrome.google.com/webstore/detail/ndikjdigobmbieacjcgomahigeiobhbo)

## Usage

Install this extension from the [Chrome Web Store](https://chrome.google.com/webstore/detail/ndikjdigobmbieacjcgomahigeiobhbo) in your browser (it's free).

In your web app you can now directly print to Zebra printers by using [`window.postMessage()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage):

```javascript
window.postMessage({
    type: "zebra_print_label",
    zpl: "^XA^FO20,20^A0N,30,30^FDThis is a TEST^FS^XZ",
    url: "http://192.168.37.36/pstprnt"
}, "*");
```

The Zebra Printing extension will listen to those messages and print the `zpl` to the `url`.

- type: The extension will only pick up messages where the type is `zebra_print_label`
- zpl: The ZPL string to be printed
- url: The URL of the printer (local IP or dns name)

The extension will also post a message to the web page upon loading. This way in your web app you can check if the extension is installed:

```javascript
window.addEventListener("message", function (event) {
    if (!event.data.ZebraPrintingVersion) {
        return;
    }
    // extension installed, enable print button or whatever...
    console.log(event.data);
});
```

The event will contain two fields:

- ZebraPrintingExtensionId: The extension ID (ndikjdigobmbieacjcgomahigeiobhbo)
- ZebraPrintingVersion: The version number of the installed extension

Optionally, you can send a message with the type `zebra_ping`, and the extension will respond with the same message. This can be useful if your code adds the event listener after the initial message has already been sent.


## Tested Printers

- ZT220 with firmware V72.19.15Z, V72.20.01Z
- ZD620 with firmware V84.20.10Z, V84.20.18Z, V84.20.21Z
- ZD621 with firmware V93.21.07Z
- GK420d with firmware V61.17.17Z
- ZD230 with firmware V89.21.26Z

Feel free to open a pull request to add other supported printers!

## Development

For local development/testing:

```shell
cd testing/
openssl req -new -x509 -keyout server.pem -out server.pem -days 365 -nodes
python simple-https-server.py
open https://localhost:4443/
```

## Release

Just zip up the `extension` directory:

```shell
zip -FSr extension.zip extension
```

## Known Limitations

[Zebra printers will always return a `200 OK` status code](https://developer.zebra.com/community/home/blog/2015/12/02/http-post) whether they were able to print or not.

## Legal

This extension comes without any warranty.

This extension is not affiliated with Zebra Technologies Corp.

Icon made by [Freepik](https://www.flaticon.com/authors/freepik) from [www.flaticon.com](http://www.flaticon.com/)
