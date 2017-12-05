/**
 * Created by zhu_yeqing on 2017/11/26.
 */

window.onload = function () {
    var cardsHtml = document.getElementById('cards');
    var cover = document.getElementById('cover');
    var add = document.getElementById('add');
    var edit = document.getElementById('edit');

    // eventUntil.addHandler(cardsHtml, 'click', clickTrash);//添加点击垃圾桶事件
    eventUntil.addHandler(add, 'click', addCard);//添加点击加号事件
    // eventUntil.addHandler(cardsHtml, 'click', viewMore);//添加点击view more事件


    //从localStorage中读取数据并将cards动态添加到页面
    var cards = localStorage.getItem("cards");
    cards = JSON.parse(cards);
    if (cards.length > 0) {
        for (var i = 0;i < cards.length;i++) {
            var card = cards[i];

            var str ='';
            str += '<div class="card">'
                +   '<p class="title">' + card.title + '</p>'
                +   '<table class="content">'
                +       '<tr class="progress">'
                +           '<td class="name">学习进度：</td>'
                +           '<td class="value">'
                +               '<div class="progress-bar"></div>'
                +               '<span>' + card.progress + '%</span>'
                +           '</td>'
                +       '</tr>'
                +       '<tr class="evaluation">'
                +           '<td class="name">知识评价：</td>'
                +           '<td class="value stars"></td>'
                +       '</tr>'
                +       '<tr class="notes">'
                +           '<td class="name">学习笔记：</td>'
                +           '<td class="value">'
                +               '<p class="notes-con"></p>'
                +               '<a href="#" class="view-more">view more</a>'
                +           '</td>'
                +       '</tr>'
                +   '</table>'
                +   '<div class="tags"></div>'
                +   '<img src="Picture/Material/Trash.png" alt="trash" class="trash">'
                + '</div>';
            cardsHtml.innerHTML += str;

            //从json中读取出来的数据写入上边定义的html结构中
            var progressBar = document.getElementsByClassName('progress-bar');
            progressBar[i].style.width = card.progress / 100  + 'rem';

            var stars = document.getElementsByClassName('stars');
            for (var j = 0;j < card.evaluation;j++) {
                stars[i].innerHTML += '<img src="Picture/Material/Star-1.png" alt="star" class="eva-img">';
            }

            var notesCon = document.getElementsByClassName('notes-con');
            notesCon[i].innerHTML = card.notes;

            var tags = document.getElementsByClassName('tags');
            for (var k = 0;k < card.tags.length;k++) {
                tags[i].innerHTML += '<span class="tag">' + card.tags[k] + '</span>';
            }

            document.getElementsByClassName('card')[i].id = 'card-' + i; //为每个card添加id
        }
        render();
    }
    cards = JSON.stringify(cards); //将JSON对象转化成字符串
    localStorage.setItem("cards", cards); //用localStorage保存转化好的字符串




    function render() {
        var cardClick = document.getElementsByClassName('card');
        for (var i = 0;i < cardClick.length;i++) {

            eventUntil.addHandler(cardClick[i], 'click', function (e) {
                var e = eventUntil.getElement(e);

                //点击垃圾桶
                if (e.className === "trash") {
                    var str = '';
                    var cardId = e.parentNode.id;
                    var cardIndex = cardId.split('-')[1]; //点击的删除键对应数据的index值
                    str += '<p>是否删除此卡片？</p>' +
                        '<p><input type="button" value="确定"><input type="button" value="取消"></p>'; //点击删除后弹出的div里的内容

                    popup(str, 1, 'delete-confirm', 'delDiv');
                    eventUntil.addScroll(preventScroll);


                    var delDiv = document.getElementById('delDiv');
                    eventUntil.addHandler(delDiv, 'click', delConfirm);

                    function delConfirm(e) {
                        var e = eventUntil.getEvent(e);
                        if (eventUntil.getElement(e).value === "确定") {
                            var card_del = document.getElementById(cardId); //获取要删除的card
                            card_del.parentNode.removeChild(card_del); //删除
                            var cards = localStorage.getItem("cards");
                            cards = JSON.parse(cards);
                            cards.splice(cardIndex, 1); //删除数据

                            cards = JSON.stringify(cards); //将JSON对象转化成字符串
                            localStorage.setItem("cards", cards); //用localStorage保存转化好的字符串

                            cover.style.display = 'none';
                            delDiv.parentNode.removeChild(delDiv); //删除弹出的确认框

                        } else if (eventUntil.getElement(e).value === "取消") {
                            cancel(delDiv);
                        }
                        eventUntil.removeScroll(preventScroll);
                    }
                }

                //点击view more
                else if (e.className === "view-more") {
                    var notesCon = e.parentNode.childNodes[0]; //学习笔记内容的p标签
                    notesCon.style.width = 'auto';
                    notesCon.style.whiteSpace = 'normal';
                    notesCon.innerHTML += '<a href="#" class="hide"> hide</a>';
                    e.innerHTML = '';


                }

                //点击hide
                else if (e.className === "hide") {
                    var notesCon = e.parentNode; //学习笔记内容的p标签，与view more中的获取语句不同，但是获取的都是p
                    notesCon.style.width = '3rem'; //指向放学习笔记内容的p标签
                    notesCon.style.whiteSpace = 'nowrap';
                    notesCon.removeChild(notesCon.childNodes[1]); //noteCon.childNodes[1]: 学习笔记内容p标签内的hide（a标签）
                    notesCon.parentNode.childNodes[1].innerHTML = 'view more';
                }

                //点击tags没反应
                else if (e.className === "tag") {
                    return;
                }

                //点击card的其他地方都进入编辑页面
                else {
                    var cardId = this.id;
                    cardId = cardId.split('-')[1];

                    var cards = localStorage.getItem("cards");
                    cards = JSON.parse(cards);

                    var str = '';
                    str += '<form action="">'
                        +  '<table>'
                        +  '<tr><td>Title: </td> <td><input type="text" id="edit-tit"></td></tr>'
                        +  '<tr><td>URL: </td><td><input type="text" id="edit-url"></td></tr>'
                        +  '<tr><td>学习进度: </td><td><input type="text" id="edit_pro">% (1%~100%)</td></tr>'
                        +  '<tr><td>知识评价: </td><td><input type="text" id="edit-eva">颗星 (1~5)</td></tr>'
                        +  '<tr><td class="notes">学习笔记: </td><td><textarea name="" id="edit-not" cols="30" rows="10"></textarea></td></tr>'
                        +  '<tr><td>Tags: </td><td><input type="text" id="edit-tag">(用分号分隔)</td></tr>'
                        +  '</table>'
                        +  '<p id="edit-conf"><input type="button" value="确定"><input type="button" value="取消"></p>'
                        +  '</form>';

                    cardsHtml.style.display = 'none';
                    add.style.display = 'none';
                    edit.innerHTML = str;

                    document.getElementById('edit-tit').value = cards[cardId].title;
                    document.getElementById('edit-url').value = cards[cardId].URL;
                    document.getElementById('edit_pro').value = cards[cardId].progress;
                    document.getElementById('edit-eva').value = cards[cardId].evaluation;
                    document.getElementById('edit-not').value = cards[cardId].notes;
                    document.getElementById('edit-tag').value = cards[cardId].tags;
                    document.getElementById('edit-tag').value = document.getElementById('edit-tag').value.replace(/,/g,';'); //将逗号替换成分号

                    var edit_conf = document.getElementById('edit-conf');
                    eventUntil.addHandler(edit_conf, 'click', editConf);

                    function editConf(e) {
                        var e = eventUntil.getEvent(e);
                        if (eventUntil.getElement(e).value === "确定") {

                            //取得用户修改/未修改的内容
                            cards[cardId].title = document.getElementById('edit-tit').value;
                            cards[cardId].URL = document.getElementById('edit-url').value;
                            cards[cardId].progress = document.getElementById('edit_pro').value;
                            cards[cardId].evaluation = document.getElementById('edit-eva').value;
                            cards[cardId].notes = document.getElementById('edit-not').value;
                            cards[cardId].tags = document.getElementById('edit-tag').value.split(';');//通过分号分割

                            cardsHtml.innerHTML = '';

                            if (cards.length > 0) {
                                for (var i = 0;i < cards.length;i++) {
                                    var card = cards[i];

                                    var str ='';
                                    str += '<div class="card">'
                                        +   '<p class="title">' + card.title + '</p>'
                                        +   '<table class="content">'
                                        +       '<tr class="progress">'
                                        +           '<td class="name">学习进度：</td>'
                                        +           '<td class="value">'
                                        +               '<div class="progress-bar"></div>'
                                        +               '<span>' + card.progress + '%</span>'
                                        +           '</td>'
                                        +       '</tr>'
                                        +       '<tr class="evaluation">'
                                        +           '<td class="name">知识评价：</td>'
                                        +           '<td class="value stars"></td>'
                                        +       '</tr>'
                                        +       '<tr class="notes">'
                                        +           '<td class="name">学习笔记：</td>'
                                        +           '<td class="value">'
                                        +               '<p class="notes-con"></p>'
                                        +               '<a href="#" class="view-more">view more</a>'
                                        +           '</td>'
                                        +       '</tr>'
                                        +   '</table>'
                                        +   '<div class="tags"></div>'
                                        +   '<img src="Picture/Material/Trash.png" alt="trash" class="trash">'
                                        + '</div>';
                                    cardsHtml.innerHTML += str;

                                    var progressBar = document.getElementsByClassName('progress-bar');
                                    progressBar[i].style.width = card.progress / 100  + 'rem';

                                    var stars = document.getElementsByClassName('stars');
                                    for (var j = 0;j < card.evaluation;j++) {
                                        stars[i].innerHTML += '<img src="Picture/Material/Star-1.png" alt="star" class="eva-img">';
                                    }

                                    var notesCon = document.getElementsByClassName('notes-con');
                                    notesCon[i].innerHTML = card.notes;

                                    var tags = document.getElementsByClassName('tags');
                                    for (var k = 0;k < card.tags.length;k++) {
                                        tags[i].innerHTML += '<span class="tag">' + card.tags[k] + '</span>';
                                    }

                                    //为每个card添加id
                                    document.getElementsByClassName('card')[i].id = 'card-' + i;
                                }
                                render();
                            }
                            cardsHtml.style.display = 'block';
                            add.style.display = 'flex';
                            edit.innerHTML = '';

                            //用完存起来
                            cards = JSON.stringify(cards); //将JSON对象转化成字符串
                            localStorage.setItem("cards", cards); //用localStorage保存转化好的字符串

                        }
                        else if (eventUntil.getElement(e).value === "取消") {
                            cardsHtml.style.display = 'block';
                            add.style.display = 'flex';
                            edit.innerHTML = '';
                        }

                    }


                }
            });
        }



    }







    /**
     * 点击view more事件：展开笔记详情
     */
    function viewMore(e) {
            // var notesCon = eventUntil.getElement(e).parentNode.childNodes[0]; //学习笔记内容的p标签
            // notesCon.style.width = 'auto';
            // notesCon.style.whiteSpace = 'normal';
            // notesCon.innerHTML += '<a href="#" class="hide"> hide</a>';
            // eventUntil.getElement(e).innerHTML = '';
            //
            // //document.getElementsByClassName('hide').length - 1  点击的hide对应的a标签
            // eventUntil.addHandler(document.getElementsByClassName('hide')[document.getElementsByClassName('hide').length - 1], 'click', hide);
            // function hide() {
            //     notesCon.style.width = '3rem'; //指向放学习笔记内容的p标签
            //     notesCon.style.whiteSpace = 'nowrap';
            //     notesCon.removeChild(notesCon.childNodes[1]); //noteCon.childNodes[1]: 学习笔记内容p标签内的hide（a标签）
            //     eventUntil.getElement(e).innerHTML = 'view more';
            // }
    }






    /**
     * 点击加号事件：添加新的cards
     */
    function addCard() {

        var str = '';
        str += '<form action="">'
            +  '<table>'
            +  '<tr><td>Title: </td> <td><input type="text" id="edit-tit"></td></tr>'
            +  '<tr><td>URL: </td><td><input type="text" id="edit-url"></td></tr>'
            +  '<tr><td>学习进度: </td><td><input type="text" id="edit_pro">% (1%~100%)</td></tr>'
            +  '<tr><td>知识评价: </td><td><input type="text" id="edit-eva">颗星 (1~5)</td></tr>'
            +  '<tr><td class="notes">学习笔记: </td><td><textarea name="" id="edit-not" cols="30" rows="10"></textarea></td></tr>'
            +  '<tr><td>Tags: </td><td><input type="text" id="edit-tag">(用分号分隔)</td></tr>'
            +  '</table>'
            +  '<p id="edit-conf"><input type="button" value="确定"><input type="button" value="取消"></p>'
            +  '</form>';
        cardsHtml.style.display = 'none';
        add.style.display = 'none';
        edit.innerHTML = str;


        var edit_conf = document.getElementById('edit-conf');
        eventUntil.addHandler(edit_conf, 'click', addConf);

    }



    /**
     * 添加界面的确定 or 取消触发的事件
     * @param e
     */
    function addConf(e) {
        var e = eventUntil.getEvent(e);
        if (eventUntil.getElement(e).value === "确定") {
            //取得用户输入的内容
            var edit_tit = document.getElementById('edit-tit').value;
            var edit_url = document.getElementById('edit-url').value;
            var edit_pro = document.getElementById('edit_pro').value;
            var edit_eva = document.getElementById('edit-eva').value;
            var edit_not = document.getElementById('edit-not').value;
            var edit_tag = document.getElementById('edit-tag').value;//通过分号分割
            edit_tag = edit_tag.split(";");
            var newCard = {};
            newCard.title = edit_tit;
            newCard.URL = edit_url;
            newCard.progress = edit_pro;
            newCard.evaluation = edit_eva;
            newCard.notes = edit_not;
            newCard.tags = edit_tag;


            var cards = localStorage.getItem("cards");
            cards = JSON.parse(cards);
            cards.push(newCard);
            cardsHtml.innerHTML = '';

            if (cards.length > 0) {
                for (var i = 0;i < cards.length;i++) {
                    var card = cards[i];

                    var str ='';
                    str += '<div class="card">'
                        +   '<p class="title">' + card.title + '</p>'
                        +   '<table class="content">'
                        +       '<tr class="progress">'
                        +           '<td class="name">学习进度：</td>'
                        +           '<td class="value">'
                        +               '<div class="progress-bar"></div>'
                        +               '<span>' + card.progress + '%</span>'
                        +           '</td>'
                        +       '</tr>'
                        +       '<tr class="evaluation">'
                        +           '<td class="name">知识评价：</td>'
                        +           '<td class="value stars"></td>'
                        +       '</tr>'
                        +       '<tr class="notes">'
                        +           '<td class="name">学习笔记：</td>'
                        +           '<td class="value">'
                        +               '<p class="notes-con"></p>'
                        +               '<a href="#" class="view-more">view more</a>'
                        +           '</td>'
                        +       '</tr>'
                        +   '</table>'
                        +   '<div class="tags"></div>'
                        +   '<img src="Picture/Material/Trash.png" alt="trash" class="trash">'
                        + '</div>';
                    cardsHtml.innerHTML += str;

                    var progressBar = document.getElementsByClassName('progress-bar');
                    progressBar[i].style.width = card.progress / 100  + 'rem';

                    var stars = document.getElementsByClassName('stars');
                    for (var j = 0;j < card.evaluation;j++) {
                        stars[i].innerHTML += '<img src="Picture/Material/Star-1.png" alt="star" class="eva-img">';
                    }

                    var notesCon = document.getElementsByClassName('notes-con');
                    notesCon[i].innerHTML = card.notes;

                    var tags = document.getElementsByClassName('tags');
                    for (var k = 0;k < card.tags.length;k++) {
                        tags[i].innerHTML += '<span class="tag">' + card.tags[k] + '</span>';
                    }

                    //为每个card添加id
                    document.getElementsByClassName('card')[i].id = 'card-' + i;
                }

            }
            cardsHtml.style.display = 'block';
            add.style.display = 'flex';
            edit.innerHTML = '';
            cards = JSON.stringify(cards); //将JSON对象转化成字符串
            localStorage.setItem("cards", cards); //用localStorage保存转化好的字符串
        }
        else if (eventUntil.getElement(e).value === "取消") {
            cardsHtml.style.display = 'block';
            add.style.display = 'flex';
            edit.innerHTML = '';
        }
    }





    /**
     * 点击delete事件：删除按钮
     * @param e
     */
    function clickTrash(e) {
        var e = eventUntil.getEvent(e);
        if (eventUntil.getElement(e).className === "trash") {
            // var str = '';
            // var cardId = eventUntil.getElement(e).parentNode.id;
            // var cardIndex = cardId.split('-')[1]; //点击的删除键对应数据的index值
            // str += '<p>是否删除此卡片？</p>' +
            //      '<p><input type="button" value="确定"><input type="button" value="取消"></p>'; //点击删除后弹出的div里的内容
            //
            // popup(str, 1, 'delete-confirm', 'delDiv');
            // eventUntil.addScroll(preventScroll);
            //
            //
            // var delDiv = document.getElementById('delDiv');
            // eventUntil.addHandler(delDiv, 'click', delConfirm);
            //
            // function delConfirm(e) {
            //     var e = eventUntil.getEvent(e);
            //     if (eventUntil.getElement(e).value === "确定") {
            //         var card_del = document.getElementById(cardId); //获取要删除的card
            //         card_del.parentNode.removeChild(card_del); //删除
            //         var cards = localStorage.getItem("cards");
            //         cards = JSON.parse(cards);
            //         cards.splice(cardIndex, 1); //删除数据
            //         cards = JSON.stringify(cards); //将JSON对象转化成字符串
            //         localStorage.setItem("cards", cards); //用localStorage保存转化好的字符串
            //
            //         cover.style.display = 'none';
            //         delDiv.parentNode.removeChild(delDiv); //删除弹出的确认框
            //
            //     } else if (eventUntil.getElement(e).value === "取消") {
            //         cancel(delDiv);
            //     }
            //     eventUntil.removeScroll(preventScroll);
            // }
        }
    }



    /**
     * 确认框的弹出
     * @param str 确认框的内容
     * @param delDiv_hei 删除框的高度
     * @param className 类名
     * @param id id名
     */
    function popup(str, delDiv_hei, className,id) {
        cover.style.height = innerHeight + 'px';
        cover.style.width = innerWidth + 'px';
        cover.style.display = 'block';

        eventUntil.addScroll(preventScroll);

        var addDiv = document.createElement('div');
        addDiv.innerHTML = str;
        addDiv.className = className;
        addDiv.id = id;
        addDiv.style.top = innerHeight/200 - delDiv_hei/2 + 'rem'; //除200是转化为rem
        addDiv.style.left = 30 + '%' ; //删除框的宽度是40%

        document.body.appendChild(addDiv);
    }



    /**
     * 确认框点击取消后的动作
     * @param elem 编辑确认框 or 删除确认框
     */
    function cancel(elem) {
        cover.style.display = 'none'; //隐藏遮罩
        elem.parentNode.removeChild(elem); //删除弹出框
    }

    /**
     * 禁止滚轮默认行为
     */
    function preventScroll(e) {
        var e = eventUntil.getEvent(e);
        eventUntil.preventDefault(e);
    }



}
