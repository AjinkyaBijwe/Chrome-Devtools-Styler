var app = angular.module('devtools', []);

app.controller('devtools-controller', ['$scope', ($scope) => {

    $scope.fontSmoothingItems = ['none', 'subpixel-antialiased', 'antialiased', 'unset', 'auto', 'initial'];

    $scope.loadDevtools = () => {
        $scope.devtools = chrome.devtools.panels;
        $scope.restoreDefaultValues();
        chrome.storage.sync.get(['fontFamily', 'fontSize', 'textWidthSize', 'fontSmoothing', 'plaformFontFamily', 'plaformFontSize', 'codeLineHeight'], (items) => {
            if (Object.keys(items).length > 0) {
                $scope.devtools.applyStyleSheet($scope.setTemplate(items));
                Object.keys(items).forEach((key) => {
                    $scope[key] = items[key];
                });
            }
            $scope.devtools.create('Devtools Styler', 'assets/img/pantone.png', 'index.html', () => {
                setTimeout(() => {
                    $scope.$apply();
                });
            });
        });
    }

    $scope.restoreDefaultValues = (clearStorage) => {
        $scope.fontFamily = 'Monospace';
        $scope.fontSize = 12;
        $scope.textWidthSize = 0;
        $scope.fontSmoothing = 'none';
        $scope.codeLineHeight = 16;
        $scope.plaformFontFamily = 'Segoe UI';
        $scope.plaformFontSize = 12;
        if (clearStorage) {
            chrome.storage.sync.clear();
            $scope.showAlert();
        }
    }

    $scope.setStorage = () => {
        chrome.storage.sync.set({
            fontFamily: $scope.fontFamily,
            fontSize: $scope.fontSize,
            textWidthSize: $scope.textWidthSize,
            fontSmoothing: $scope.fontSmoothing,
            plaformFontFamily: $scope.plaformFontFamily,
            plaformFontSize: $scope.plaformFontSize,
            codeLineHeight: $scope.codeLineHeight
        }, () => {
            $scope.showAlert();
        });
    }

    $scope.showAlert = () => {
        $('#save-message').hide();
        clearTimeout($scope.timeout);
        $('#save-message').slideDown(300);
        $scope.timeout = setTimeout(() => {
            $('#save-message').slideUp(300);
        }, 3000);
    }

    $scope.setFontSmoothing = (item) => {
        $scope.fontSmoothing = item;
    }

    $scope.confirmDialog = () => {
        $("#reset-modal").modal({
            backdrop: 'static',
            keyboard: false
        });
    }

    $scope.setTemplate = (items) => {
        var styleSheet =
        `:host-context(.platform-mac) .monospace,
        :host-context(.platform-mac) .source-code,
        .platform-mac .monospace,
        .platform-mac .source-code,
        :host-context(.platform-windows) .monospace,
        :host-context(.platform-windows) .source-code,
        .platform-windows .monospace,
        .platform-windows .source-code,
        :host-context(.platform-linux) .monospace,
        :host-context(.platform-linux) .source-code,
        .platform-linux .monospace,
        .platform-linux .source-code,
        .source-code, .CodeMirror pre, td.webkit-line-content {
            font-family: ${items.fontFamily} !important;
            font-size: ${items.fontSize}px !important;
            -webkit-text-stroke-width: ${items.textWidthSize}px;
            -webkit-font-smoothing: ${items.fontSmoothing}
        }
        .platform-linux, .platform-mac, .platform-windows{
            font-family: ${items.plaformFontFamily} !important;
            font-size: ${items.plaformFontSize}px !important;
        }
        .CodeMirror-lines { 
            line-height: ${items.codeLineHeight}px !important;
        }
        .cm-breakpoint .CodeMirror-gutter-wrapper .CodeMirror-linenumber { 
            height: ${items.codeLineHeight}px !important;
            line-height: ${items.codeLineHeight}px !important;
            display: flex;
            justify-content: center;
            flex-direction: column;
            text-align: right;
            position: relative;
            top: -1px !important;
        }`;

        return styleSheet;
    }

    document.addEventListener('DOMContentLoaded', $scope.loadDevtools());
}]);