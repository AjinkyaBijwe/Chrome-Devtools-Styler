import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
    title: string;
    panels: any;

    constructor() {
        this.title = 'Chrome Devtool Styler';
    }

    ngOnInit() {
        this.panels = chrome.devtools;
        chrome.storage.sync.get({
            fontFamily: 'monospace',
            externalFonts: []
        }, items => {
            items.externalFonts.forEach(url => {
                fetch(url).then(resp => {
                    return resp.text();
                }).then(resp => {
                    this.panels.applyStyleSheet(resp);
                });
            });
            this.panels.applyStyleSheet(this.styleTemplate(items.fontFamily));
        });

        this.panels.create('Devtool Styler', 'index.html');
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
            font-family: 'SF Mono' !important;
        }`;
    }
}


