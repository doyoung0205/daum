

var editor;

var config = {
		txHost : '', /* 런타임 시 리소스들을 로딩할 때 필요한 부분으로, 경로가 변경되면 이 부분 수정이 필요. ex) http://xxx.xxx.com */
		txPath : '', /* 런타임 시 리소스들을 로딩할 때 필요한 부분으로, 경로가 변경되면 이 부분 수정이 필요. ex) /xxx/xxx/ */
		txService : 'sample', /* 수정필요없음. */
		txProject : 'sample', /* 수정필요없음. 프로젝트가 여러개일 경우만 수정한다. */
		initializedId : "", /* 대부분의 경우에 빈문자열 */
		wrapper : "tx_trex_container", /* 에디터를 둘러싸고 있는 레이어 이름(에디터 컨테이너) */
		form : 'tx_editor_form' + "", /* 등록하기 위한 Form 이름 */
		txIconPath : "/allct/resources/daumOpenEditor/images/icon/editor/", /*에디터에 사용되는 이미지 디렉터리, 필요에 따라 수정한다. */
		txDecoPath : "/allct/resources/daumOpenEditor/images/deco/contents/", /*본문에 사용되는 이미지 디렉터리, 서비스에서 사용할 때는 완성된 컨텐츠로 배포되기 위해 절대경로로 수정한다. */
		canvas : {
			exitEditor : {
				/*
				desc:'빠져 나오시려면 shift+b를 누르세요.',
				hotKey: {
				    shiftKey:true,
				    keyCode:66
				},
				nextElement: document.getElementsByTagName('button')[0]
				 */
			},
			styles : {
				color : "#123456", /* 기본 글자색 */
				fontFamily : "굴림", /* 기본 글자체 */
				fontSize : "10pt", /* 기본 글자크기 */
				backgroundColor : "#fff", /*기본 배경색 */
				lineHeight : "1.5", /*기본 줄간격 */
				padding : "8px" /* 위지윅 영역의 여백 */
			},
			showGuideArea : false
		},
		events : {
			preventUnload : false
		},
		sidebar : {
			attachbox : {
				show : true,
				confirmForDeleteAll : true
			},
			// 이미지첨부 관련 추가 config
			attacher:{ 
				image:{ 
					features:{ left:250,top:65,width:400,height:190,scrollbars:0 }, //팝업창 사이즈
					popPageUrl:'imagePopup' //팝업창 주소
				},
				file:{ 
					boxonly : true,
					features:{left:250,top:65,width:400,height:190,scrollbars:0}, // 팝업창 사이즈
					popPageUrl:'filePopup'  // 팝업창 주소
				}
			},
			capacity: { 
				maximum: 100*1024*1024 // 최대 첨부 용량 (100MB)
			}
		},
		size : {
			contentWidth : 700
			/* 지정된 본문영역의 넓이가 있을 경우에 설정 */
		}
};


EditorJSLoader.ready(function(Editor) {
	editor = new Editor(config);
});



/* 예제용 함수 */

function saveContent() {
	var images = Editor.getAttachments('image');
	var files = Editor.getAttachments('file', true);
	var i;

	if(images != null){
		for (i = 0; i < images.length; i++) {
			// existStage는 현재 본문에 존재하는지 여부
			if (images[i].existStage) {
				var ElementPath = "<input type='hidden' name='imgPath"+i+"' value='"+images[i].data.originalurl+"' >"
				document.getElementById('tx_editor_form').insertAdjacentHTML('beforeEnd',ElementPath);
				var ElementName = "<input type='hidden' name='imgName"+i+"' value='"+images[i].data.filename+"' >"
				document.getElementById('tx_editor_form').insertAdjacentHTML('beforeEnd',ElementName);
				var ElementSize = "<input type='hidden' name='imgSize"+i+"' value='"+images[i].data.filesize+"' >"
				document.getElementById('tx_editor_form').insertAdjacentHTML('beforeEnd',ElementSize);
			}
		}
		var ii = "<input type='hidden' name='image_length' value='"+images.length+"' >"
		document.getElementById('tx_editor_form').insertAdjacentHTML('beforeEnd',ii);
	}
	if(files != null){
		for (i = 0; i < files.length; i++) {
			// existStage는 현재 본문에 존재하는지 여부
			var ElementPath = "<input type='hidden' name='filePath"+i+"' value='"+files[i].data.path+"' >"
			document.getElementById('tx_editor_form').insertAdjacentHTML('beforeEnd',ElementPath);
			var ElementName = "<input type='hidden' name='fileName"+i+"' value='"+files[i].data.filename+"' >"
			document.getElementById('tx_editor_form').insertAdjacentHTML('beforeEnd',ElementName);
			var ElementSize = "<input type='hidden' name='fileSize"+i+"' value='"+files[i].data.filesize+"' >"
			document.getElementById('tx_editor_form').insertAdjacentHTML('beforeEnd',ElementSize);
		}
		var ii = "<input type='hidden' name='file_length' value='"+files.length+"' >"
		document.getElementById('tx_editor_form').insertAdjacentHTML('beforeEnd',ii);
	}
	
	Editor.save(); // 이 함수를 호출하여 글을 등록하면 된다.
}

/**
 * Editor.save()를 호출한 경우 데이터가 유효한지 검사하기 위해 부르는 콜백함수로
 * 상황에 맞게 수정하여 사용한다.
 * 모든 데이터가 유효할 경우에 true를 리턴한다.
 * @function
 * @param {Object} editor - 에디터에서 넘겨주는 editor 객체
 * @returns {Boolean} 모든 데이터가 유효할 경우에 true
 */

function validForm(editor) {
	// Place your validation logic here

	// sample : validate that content exists
	var validator = new Trex.Validator();
	var content = editor.getContent();
	var $testTitle = $('#testTitle').val();
	
	if (!validator.exists(content)) {
		alert('내용을 입력하세요');
		return false;
	}

	return true;
}

/**
 * Editor.save()를 호출한 경우 validForm callback 이 수행된 이후
 * 실제 form submit을 위해 form 필드를 생성, 변경하기 위해 부르는 콜백함수로
 * 각자 상황에 맞게 적절히 응용하여 사용한다.
 * @function
 * @param {Object} editor - 에디터에서 넘겨주는 editor 객체
 * @returns {Boolean} 정상적인 경우에 true
 */
function setForm(editor) {
	var i, input;
	var form = editor.getForm();
	var content = editor.getContent();

	// 본문 내용을 필드를 생성하여 값을 할당하는 부분
	var textarea = document.createElement('textarea');
	textarea.name = 'content';
	textarea.value = content;
	form.createField(textarea);

	/* 아래의 코드는 첨부된 데이터를 필드를 생성하여 값을 할당하는 부분으로 상황에 맞게 수정하여 사용한다.
			 첨부된 데이터 중에 주어진 종류(image,file..)에 해당하는 것만 배열로 넘겨준다. */
	var images = editor.getAttachments('image');
	for (i = 0; i < images.length; i++) {
		// existStage는 현재 본문에 존재하는지 여부
		if (images[i].existStage) {
			// data는 팝업에서 execAttach 등을 통해 넘긴 데이터
			input = document.createElement('input');
			input.type = 'hidden';
			input.name = 'attach_image';
			input.value = images[i].data.imageurl; // 예에서는 이미지경로만 받아서 사용
			form.createField(input);
		}
	}

	var files = editor.getAttachments('file' , true);
	for (i = 0; i < files.length; i++) {
		input = document.createElement('input');
		input.type = 'hidden';
		input.name = 'attach_file';
		input.value = files[i].data.attachurl;
		form.createField(input);
	}
	
	return true;
} 

$(function(){
    $('body img').each(function(index) {
        if($(this).attr("alt") =="" || $(this).attr("alt") ==null){
     	 $(this).attr("alt"," ")  
        }  
         });
	    
	    $('body textarea').each(function(index) {
	           if($(this).attr("title") =="" || $(this).attr("title") ==null){ 
	        	 $(this).attr("title","텍스트창");  
	           }
	      });
	    $('body input').each(function(index) {
	        if($(this).attr("title") =="" || $(this).attr("title") ==null){ 
	        	 $(this).attr("title","input");   
	           }
	    });
	    $('body a').each(function(index) {
	    	if($(this).html() =="" || $(this).html() ==null){
	    		$(this).append("<span style='display: none;'>.</span>");  
	    	}else if($(this).text() =="" || $(this).text() ==null){
	    			$(this).append("<span style='display: none;'>.</span>");
	    	}
	    });
})