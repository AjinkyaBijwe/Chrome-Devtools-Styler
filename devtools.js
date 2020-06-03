var app = angular.module('devtools', []);

app.controller('devtools-controller', ['$scope', ($scope) => {
    
    $scope.fontSmoothingItems = ['none', 'subpixel-antialiased', 'antialiased', 'unset', 'auto', 'initial'];

    $scope.loadDevtools = () => {
        $scope.devtools = chrome.devtools.panels;
        $scope.restoreDefaultValues();
        chrome.storage.sync.get(['fontFamily', 'fontSize', 'fontWeight', 'textWidthSize', 'fontSmoothing', 'codeLineHeight',
			'plaformFontFamily', 'plaformFontSize', 'plaformFontWeight'], (items) => {
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
	
	$scope.saveSettings = (event) => {
		if (event.ctrlKey || event.metaKey) {
			switch (String.fromCharCode(event.which).toLowerCase()) {
				case 's':
					event.preventDefault();
					$scope.setStorage();
				break;
			}
		}
	}

    $scope.restoreDefaultValues = (clearStorage) => {
        $scope.fontFamily = '';
        $scope.fontSize = 12;
		$scope.fontWeight = 400;
        $scope.textWidthSize = 0;
        $scope.fontSmoothing = 'none';
        $scope.codeLineHeight = 15;
        $scope.plaformFontFamily = '';
        $scope.plaformFontSize = 12;
		$scope.plaformFontWeight = 400;
        if (clearStorage) {
            chrome.storage.sync.clear();
            $scope.showAlert();
        }
    }

    $scope.setStorage = () => {
        chrome.storage.sync.set({
            fontFamily: $scope.fontFamily,
            fontSize: $scope.fontSize,
			fontWeight: $scope.fontWeight,
            textWidthSize: $scope.textWidthSize,
            fontSmoothing: $scope.fontSmoothing,
			codeLineHeight: $scope.codeLineHeight,
            plaformFontFamily: $scope.plaformFontFamily,
            plaformFontSize: $scope.plaformFontSize,
			plaformFontWeight: $scope.plaformFontWeight
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
        $('#reset-modal').modal({
            backdrop: 'static',
            keyboard: false
        });

        $('.btn-yes').click(() => {
            $scope.restoreDefaultValues(true);
            $('#reset-modal').modal('hide');
        })
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
        .CodeMirror pre,
        #console-messages .source-code,
        .stack-preview-container {
            font-family: ${items.fontFamily} !important;
            font-size: ${items.fontSize}px !important;
            -webkit-text-stroke-width: ${items.textWidthSize}px;
            -webkit-font-smoothing: ${items.fontSmoothing};
			font-weight: ${items.fontWeight} !important;
        }
        .platform-linux, .platform-mac, .platform-windows{
            font-family: ${items.plaformFontFamily} !important;
            font-size: ${items.plaformFontSize}px !important;
			font-weight: ${items.plaformFontWeight} !important;
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
        }
		.CodeMirror-gutter-elt{
			top : 0px !important;
		}
        .tree-outline-disclosure .tree-outline > li, 
        .tree-outline-disclosure.tree-outline-disclosure-hide-overflow .tree-outline li,
        .elements-disclosure .elements-tree-outline.source-code li,
        .tree-outline-disclosure .tree-outline.hide-selection-when-blurred.source-code.object-properties-section li {
            line-height: ${items.codeLineHeight}px !important;
            min-height: ${items.codeLineHeight}px !important;
            font-size: ${items.fontSize}px !important;
            -webkit-text-stroke-width: ${items.textWidthSize}px;
            -webkit-font-smoothing: ${items.fontSmoothing}
        }
        .elements-disclosure .elements-tree-outline.source-code li.parent::before{
            -webkit-mask-position-y: 0.14em !important;
            cursor: pointer;
        }
        .elements-disclosure .elements-tree-outline.source-code li.parent.expanded::before{
            -webkit-mask-position-y: 0.05em !important;
        }
        .tree-outline-disclosure .tree-outline.tree-outline-dense > .parent,
        .tree-outline-disclosure .tree-outline.tree-outline-dense .header-name {
            -webkit-text-stroke-width: 0.1px;
            font-weight: normal;
        }
        .tree-outline-disclosure .tree-outline.tree-outline-dense .header-name {
            color: #bb0000;
            font-size: ${items.fontSize}px !important;
        }
        .tree-outline-disclosure .tree-outline.tree-outline-dense > .parent{
            color: #252525;
        }
        .tree-outline-disclosure .tree-outline.tree-outline-dense li.expanded .header-toggle {
            margin-left: 15px;
        }
        .tree-outline-disclosure .tree-outline.hide-selection-when-blurred.source-code.object-properties-section .name-and-value {
            line-height: inherit;
        }`;

        return styleSheet;
    }

    document.addEventListener('DOMContentLoaded', $scope.loadDevtools());
}]);