var app = angular.module('devtools', []);
app.controller('devtools-controller', controller)

controller.$inject = ['$scope'];

function controller($scope) {
    $scope.fontSmoothingItems = ['none', 'subpixel-antialiased', 'antialiased', 'unset', 'auto', 'initial'];

    $scope.loadDevtools = () => {
        $scope.devtools = chrome.devtools.panels;
        chrome.storage.sync.get(['fontFamily', 'fontSize', 'textWidthSize', 'fontSmoothing'], (items) => {
            $scope.devtools.applyStyleSheet($scope.setTemplate(items));
            $scope.devtools.create('Devtool Styler', 'assets/img/pantone.png', 'index.html', () => {
                $('#save-message').hide();
                $scope.fontFamily = items.fontFamily ? items.fontFamily : '';
                $scope.fontSize = items.fontSize ? parseInt(items.fontSize) : 12;
                $scope.textWidthSize = items.textWidthSize ? parseFloat(items.textWidthSize) : 0;
                $scope.fontSmoothing = items.fontSmoothing ? items.fontSmoothing : 'none';
                setTimeout(() => {
                    $scope.$apply();
                });
            });
        });
    }

    $scope.setStorage = () => {
        $('#save-message').hide();
        chrome.storage.sync.set({
            fontFamily: $scope.fontFamily,
            fontSize: $scope.fontSize,
            textWidthSize: $scope.textWidthSize,
            fontSmoothing: $scope.fontSmoothing
        }, () => {
            clearTimeout($scope.timeout);
            $('#save-message').slideDown(300);
            $scope.timeout = setTimeout(() => {
                $('#save-message').slideUp(300);
            }, 3000);
        });
    }

    $scope.setFontSmoothing = (item) => {
        $scope.fontSmoothing = item;
    }

    $scope.setTemplate = (items) => {
        var styleSheet =  `:host-context(.platform-windows) .monospace, 
        :host-context(.platform-windows) .source-code, 
        .platform-windows .monospace, .platform-windows .source-code, 
        :host-context(.platform-mac) .monospace,
        :host-context(.platform-mac) .source-code, 
        .platform-mac .monospace, .platform-mac .source-code,
        :host-context(.platform-linux) .monospace, 
        :host-context(.platform-linux) .source-code, 
        .platform-linux .monospace, .platform-linux .source-code, 
        .source-code {
            font-family: ${items.fontFamily};
            font-size: ${items.fontSize}px !important;
            -webkit-text-stroke-width: ${items.textWidthSize}px;
            -webkit-font-smoothing: ${items.fontSmoothing}
        }
        
        table {
            font-family: ${items.fontFamily} !important;
        }`;

        return styleSheet;
    }

    document.addEventListener('DOMContentLoaded', $scope.loadDevtools());
}