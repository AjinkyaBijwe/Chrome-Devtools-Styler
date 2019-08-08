(function(document) {
    
    this.fontSmoothingItems = ['none', 'subpixel-antialiased', 'antialiased', 'unset', 'auto', 'initial'];

    function loadDevtools() {
		this.devtools = chrome.devtools.panels;
        chrome.storage.sync.get(['fontFamily', 'fontSize', 'textWidthSize', 'fontSmoothing'], (items) => {
            this.devtools.applyStyleSheet(setTemplate(items));
			this.devtools.create('Devtool Styler', 'assets/img/pantone.png', 'index.html', () => {
                $('#save-message').hide();
				$('#code-font').val(items.fontFamily);
				$('#font-size').val(items.fontSize);
                $('#font-size-val')[0].innerHTML = items.fontSize + 'px'
                $('#font-stroke-size').val(items.textWidthSize);
                $('#font-stroke-val')[0].innerHTML = items.textWidthSize + 'px'
                $('#save').click(() => {setStorage()});
                $('#font-size, #font-stroke-size').change(() => {updateSlider()});
			});
		});
    }
	
	function setStorage() {
        $('#save-message').hide();
		chrome.storage.sync.set({
            fontFamily: $('#code-font').val(),
            fontSize: $('#font-size').val(),
            textWidthSize: $('#font-stroke-size').val()
            //fontSmoothing: this.fontSmoothing
        }, () => {
            clearTimeout(this.timeout);
            $('#save-message').slideDown(300);
            this.timeout = setTimeout(() => {
                $('#save-message').slideUp(300);
            }, 3000);
        });
	}
	
	function setTemplate(items){
        return `:host-context(.platform-windows) .monospace, \
        :host-context(.platform-windows) .source-code, \
        .platform-windows .monospace, .platform-windows .source-code,
        :host-context(.platform-mac) .monospace,
        :host-context(.platform-mac) .source-code,
        .platform-mac .monospace, .platform-mac .source-code,
        :host-context(.platform-linux) .monospace, \
        :host-context(.platform-linux) .source-code, \
        .platform-linux .monospace, .platform-linux .source-code {
            font-family: ${items.fontFamily};
            font-size: ${items.fontSize}px !important;
            -webkit-text-stroke-width: ${items.textWidthSize}px;
            -webkit-font-smoothing: ${items.fontSmoothing}
        }`;
    }
    
    function updateSlider() {
        $('#font-size-val')[0].innerHTML = $('#font-size').val() + 'px';
        $('#font-stroke-val')[0].innerHTML = $('#font-stroke-size').val() + 'px';
    }

    document.addEventListener('DOMContentLoaded', loadDevtools);
})(document);
