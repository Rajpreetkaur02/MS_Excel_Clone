let defaultProperties = {
    "text":"",
    "font-weight":"",
    "font-style":"",
    "text-decoration":"",
    "text-align":"left",
    "background-color":"#ffffff",
    "color":"#000000",
    "font-family":"Noto Sans",
    "font-size":"14px"
};

let celldata = {
    "Sheet1" : {}
};

let selectedSheet = "Sheet1";
let totalSheets = 1;
let lastaddedsheet = 1;
$(document).ready(function(){
    for(let i = 1 ; i < 100 ; i++){
        let ans = "";
        let n = i;
        while(n>0){
            let rem = n%26;
            if(rem == 0){
                ans = "Z" + ans;
                n = Math.floor(n/26) - 1;
            }else{
                ans = String.fromCharCode(rem-1+65) + ans;
                n = Math.floor(n/26);
            }
        }
        let column = $(`<div class="column-name  colId=${i}" id="colCod-${ans}">${ans}</div>`);
        $(".column-name-container").append(column);
        let row = $(`<div class="row-name" id="rowId=${i}">${i}</div>`);
        $(".row-name-container").append(row);
    } 
    for (let i = 1; i <= 100; i++) {
         let row = $(`<div class="cell-row"></div>`);
         for (let j = 1; j <= 100; j++) {
             let colCode = $(`.colId-${j}`).attr("id");
             let column = $(`<div class="input-cell" contenteditable="false" id = "row-${i}-col-${j}" data="code-${colCode}"></div>`);
             row.append(column);
         }
         $(".input-cell-container").append(row);
     }

     $(".align-icon").click(function(){
        $(".align-icon.selected").removeClass("selected");
        $(this).addClass("selected");
     })

     $(".style-icon").click(function(){
        $(this).toggleClass("selected");
     })

     $(".input-cell").click(function(e){
        //console.log(e);
        if(e.ctrlKey){
            let[rowId,colId] = getRowCol(this);
            if(rowId>1){
                let topCellselected = $(`#row-${rowId-1}-col-${colId}`).hasClass("selected");
                if(topCellselected){
                    $(this).addClass("top-cell-selected");
                    $(`#row-${rowId-1}-col-${colId}`).addClass("bottom-cell-selected");
                }   
            }   
            if(rowId<100){
                let bottomCellselected = $(`#row-${rowId+1}-col-${colId}`).hasClass("selected");
                if(bottomCellselected){
                    $(this).addClass("bottom-cell-selected");
                    $(`#row-${rowId+1}-col-${colId}`).addClass("top-cell-selected");
                }   
            }   
            if(colId>1){
                let leftCellselected = $(`#row-${rowId}-col-${colId-1}`).hasClass("selected");
                if(leftCellselected){
                    $(this).addClass("left-cell-selected");
                    $(`#row-${rowId}-col-${colId-1}`).addClass("right-cell-selected");
                }   
            }   
            if(colId<100){
                let rightCellselected = $(`#row-${rowId}-col-${colId+1}`).hasClass("selected");
                if(rightCellselected){
                    $(this).addClass("right-cell-selected");
                    $(`#row-${rowId}-col-${colId+1}`).addClass("left-cell-selected");
                }   
            }   
        }
        else{
            $(".input-cell.selected").removeClass("selected");
        }
        $(this).addClass("selected");
        changeHeader(this);
     });

     function changeHeader(ele){
        let [rowId,colId] = getRowCol(ele);
        let cellinfo = defaultProperties;
        if(celldata[selectedSheet][rowId] && celldata[selectedSheet][rowId][colId]){
            cellinfo = celldata[selectedSheet][rowId][colId];
        }
        cellinfo["font-weight"] ? $(".icon-bold").addClass("selected") : $(".icon-bold").removeClass("selected");
        cellinfo["font-style"] ? $(".icon-italic").addClass("selected") : $(".icon-italic").removeClass("selected");
        cellinfo["text-decoration"] ? $(".icon-underline").addClass("selected") : $(".icon-underline").removeClass("selected");
        let alignment = cellinfo["text-align"];
        $(".align-icon.selected").removeClass("selected");
        $(".icon-"+alignment).addClass("selected");
        $(".background-color-picker").val(cellinfo["background-color"]);
        $(".text-color-picker").val(cellinfo["color"]);
        $(".font-family-selector").val(cellinfo["font-family"]);
        $(".font-size-selector").val(cellinfo["font-size"]);
     }

     $(".input-cell").dblclick(function(){
        $(".input-cell.selected").removeClass("selected");
        $(this).addClass("selected");
        $(this).attr("contenteditable","true");
        $(this).focus();
     })

     $(".input-cell").blur(function(){
        $(".input-cell.selected").attr("contenteditable","false");
        updateCell("text",$(this).text());
     })

     $(".input-cell-container").scroll(function(){
        $(".column-name-container").scrollLeft(this.scrollLeft);
        $(".row-name-container").scrollTop(this.scrollTop);
     })
});

function getRowCol(ele){
    console.log($(ele).attr("id"));
    let idArray = $(ele).attr("id").split("-");
    let rowId = parseInt(idArray[1]);
    let colId = parseInt(idArray[3]);
    return [rowId,colId];
}

function updateCell(property,value,defaultPossible){
    $(".input-cell.selected").each(function(){
        $(this).css(property,value);
        let [rowId,colId] = getRowCol(this);
        if(celldata[selectedSheet][rowId]){
            if(celldata[selectedSheet][rowId][colId]){
                celldata[selectedSheet][rowId][colId][property] = value;

            }else{
                celldata[selectedSheet][rowId][colId] = {...defaultProperties};
                celldata[selectedSheet][rowId][colId][property]= value;
            }
        }else{
            celldata[selectedSheet][rowId] = {};
            celldata[selectedSheet][rowId][colId] = {...defaultProperties};
            celldata[selectedSheet][rowId][colId][property] = value;
        }
        if(defaultPossible && (JSON.stringify(celldata[selectedSheet][rowId][colId]) === JSON.stringify(defaultProperties))){
             delete celldata[selectedSheet][rowId][colId];
             if(Object.keys(celldata[selectedSheet][rowId]).length == 0){
                delete celldata[selectedSheet][rowId];
             }
        }     
    });
    console.log(celldata);
}

    

$(".icon-bold").click(function(){
    if($(this).hasClass("selected")){
        updateCell("font-weight","",true);
    }else{
        updateCell("font-weight","bold",false);
    }
});

$(".icon-italic").click(function(){
    if($(this).hasClass("selected")){
        updateCell("font-style","",true);
    }else{
        updateCell("font-style","italic",false);
    }
});

$(".icon-underline").click(function(){
    if($(this).hasClass("selected")){
        updateCell("text-decoration","",true);
    }else{
        updateCell("text-decoration","underline",false);
    }
});

$(".icon-left").click(function(){
    if(!$(this).hasClass("selected")){
        updateCell("text-align","left",true);
    }
});

$(".icon-center").click(function(){
    if(!$(this).hasClass("selected")){
        updateCell("text-align","center",false);
    }
});

$(".icon-right").click(function(){
    if(!$(this).hasClass("selected")){
        updateCell("text-align","right",false);
    }
});

$(".font-family-selector").click(function(){
    updateCell("font-family",$(this).val());
    $(".font-family-selector").css("font-family",$(this).val());
});

$(".font-size-selector").click(function(){
    updateCell("font-size",$(this).val());
});

$(".color-fill-icon").click(function(){
    $(".background-color-picker").click();
});

$(".color-text-icon").click(function(){
    $(".text-color-picker").click();
});

$(".background-color-picker").change(function(){
    updateCell("background-color",$(this).val())
});

$(".text-color-picker").change(function(){
    updateCell("color",$(this).val())
});

function emptySheet(){
    let sheetinfo = celldata[selectedSheet];
    for(let i of Object.keys(sheetinfo)){
        for(let j of Object.keys(sheetinfo[i])){
            $(`#row-${i}-col-${j}`).text("");
            $(`#row-${i}-col-${j}`).css("background-color","#ffffff");
            $(`#row-${i}-col-${j}`).css("color","#000000");
            $(`#row-${i}-col-${j}`).css("text-align","left");
            $(`#row-${i}-col-${j}`).css("font-weight","");
            $(`#row-${i}-col-${j}`).css("font-style","");
            $(`#row-${i}-col-${j}`).css("text-decoration","");
            $(`#row-${i}-col-${j}`).css("font-family","Noto sans");
            $(`#row-${i}-col-${j}`).css("font-size","14px");
        }
    }
}

function LoadSheet(){
    let sheetinfo = celldata[selectedSheet];
    for(let i of Object.keys(sheetinfo)){
        for(let j of Object.keys(sheetinfo[i])){
            let cellinfo = celldata[selectedSheet][i][j];
            $(`#row-${i}-col-${j}`).text(cellinfo["text"]);
            $(`#row-${i}-col-${j}`).css("background-color",cellinfo["background-color"]);
            $(`#row-${i}-col-${j}`).css("color",cellinfo["color"]);
            $(`#row-${i}-col-${j}`).css("text-align",cellinfo["text-align"]);
            $(`#row-${i}-col-${j}`).css("font-weight",cellinfo["font-weight"]);
            $(`#row-${i}-col-${j}`).css("font-style",cellinfo["font-style"]);
            $(`#row-${i}-col-${j}`).css("text-decoration",cellinfo["text-decoration"]);
            $(`#row-${i}-col-${j}`).css("font-family",cellinfo["font-family"]);
            $(`#row-${i}-col-${j}`).css("font-size",cellinfo["font-size"]);
        }
    }   
}

$(".icons-add").click(function(){
    emptySheet();
    $(".sheet-tab.selected").removeClass("selected");
    let sheetName = "sheet" + (lastaddedsheet + 1);
    celldata[sheetName] = {};
    totalSheets+=1;
    lastaddedsheet+=1;
    selectedSheet = sheetName;
    $(".sheet-tab-container").append(`<div class="sheet-tab selected">${sheetName}</div>`);
    $(".sheet-tab.selected").click(function(){
        if(!$(this).hasClass("selected")){
            selectsheet(this);
        }
    })
});

$(".sheet-tab").click(function(){
    if(!$(this).hasClass("selected")){
        selectsheet(this);
    }
})

function selectsheet(ele){
    $(".sheet-tab.selected").removeClass("selected");
    $(ele).addClass("selected");
    emptySheet();
    selectedSheet = $(ele).text();
    LoadSheet();
}