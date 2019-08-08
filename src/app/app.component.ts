import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
    snackbar: MatSnackBar;
    title: string;
    devtools: any;
    fontFamily: any;

    constructor(snackbar: MatSnackBar) {
        this.snackbar = snackbar;
        this.title = 'Chrome Devtool Styler';
    }

    ngOnInit() {
        this.fontFamily = null;
        this.loadDevtools();
    }

    loadDevtools = () => {
        this.devtools = chrome.devtools.panels;
        if (this.devtools) {
            this.devtools.create('Devtool Styler', 'devtool.png', 'index.html', () => {
                chrome.storage.sync.get(['fontFamily'], (items) => {
                    // items.externalFonts.forEach(url => {
                    //     fetch(url).then(resp => {
                    //         return resp.text();
                    //     }).then(resp => {
                    //         this.devtools.applyStyleSheet(resp);
                    //     });
                    // });
                    setTimeout(() => {
                        this.fontFamily = items.fontFamily;
                    }, 200);
                    this.devtools.applyStyleSheet(this.styleTemplate(items.fontFamily));
                });
            });
        }
    }

    setChromeStorage = () => {
        chrome.storage.sync.set({
            fontFamily: this.fontFamily
        }, () => {
            this.snackbar.open('Style Stored Please Reopen Chrome Debugger', 'Dismiss' , {
                duration: 5000
            });
        });
    }

    styleTemplate = (fontFamily) => {
        return `:host-context(.platform-windows) .monospace, \
        :host-context(.platform-windows) .source-code, \
        .platform-windows .monospace, .platform-windows .source-code,
        :host-context(.platform-mac) .monospace,
        :host-context(.platform-mac) .source-code,
        .platform-mac .monospace, .platform-mac .source-code,
        :host-context(.platform-linux) .monospace, \
        :host-context(.platform-linux) .source-code, \
        .platform-linux .monospace, .platform-linux .source-code {
            font-family: ${fontFamily} !important;
        }`;
    }
}


