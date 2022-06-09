const vizDisplay = document.getElementById('tableauViz');
const vizDiv = document.getElementById("vizContainerB");
let minValue;
let maxValue;
var vizList = [
    "https://prod-useast-b.online.tableau.com/t/tessellationhq/views/Quick_Basic_16540987528080/SegmentSales",
    "https://prod-useast-b.online.tableau.com/t/tessellationhq/views/Quick_Basic_16540987528080/ShipProfit",
    "https://prod-useast-b.online.tableau.com/t/tessellationhq/views/Quick_Basic_16540987528080/RegionDiscount"];
var viz,
vizLen = vizList.length,
vizCount = 0;
let userEmail = document.getElementById("userEmail").textContent.trim();

function initViz() {
    fetch('https://phdata-tableau-jwt.herokuapp.com/?username='+userEmail)
        .then(result => result.json())
        .then((output) => {
            vizDisplay.setAttribute('token', output.token);
        }).catch(err => console.error(err));
};
function initVizB() {
    fetch('https://phdata-tableau-jwt.herokuapp.com/?username='+userEmail)
        .then(result => result.json())
        .then((output) => {
            vizDiv.setAttribute('token', output.token);
        }).catch(err => console.error(err));
};

function filtVal(elem) {
    let sheet = vizDisplay.workbook.activeSheet;
    if (elem === "") {
        sheet.clearFilterAsync("Category2")
    } else {
        sheet.applyFilterAsync("Category2", [elem], "replace")
    }
};

function filtButF() {
    let sheet = vizDisplay.workbook.activeSheet;
    sheet.applyFilterAsync("Category2", ["Furniture"], "replace");
};

function filtButO() {
    let sheet = vizDisplay.workbook.activeSheet;
    sheet.applyFilterAsync("Category2", ["Office Supplies"], "replace");
};

function filtButT() {
    let sheet = vizDisplay.workbook.activeSheet;
    sheet.applyFilterAsync("Category2", ["Technology"], "replace");
};

function filtButA() {
    let sheet = vizDisplay.workbook.activeSheet;
    sheet.clearFilterAsync("Category2");
};

function selMA() {
    let sheet = vizDisplay.workbook.activeSheet;
    sheet.selectMarksByValueAsync([{
            fieldName: 'Segment',
            value: ['Consumer']
        }, {
            fieldName: 'Year-OrderDate',
            value: ['2017']

        }],
        'select-replace');
};

function selMB() {
    let sheet = vizDisplay.workbook.activeSheet;
    sheet.selectMarksByValueAsync([{
            fieldName: 'Segment',
            value: ['Corporate']
        }, {
            fieldName: 'Year-OrderDate',
            value: ['2018']

        }],
        'select-replace');
};

function selMC() {
    let sheet = vizDisplay.workbook.activeSheet;
    sheet.selectMarksByValueAsync([{
            fieldName: 'Segment',
            value: ['Home Office']
        }, {
            fieldName: 'Year-OrderDate',
            value: ['2019']

        }],
        'select-replace');
};

function selClear() {
    let sheet = vizDisplay.workbook.activeSheet;
    sheet.clearSelectedMarksAsync();
};

function tranSizeApp() {
    let sheet = vizDisplay.workbook.activeSheet;
    let minValue = Number(document.getElementById("minValFilt").value);
    let maxValue = Number(document.getElementById("maxValFilt").value);
    sheet.applyRangeFilterAsync('Sales', {
        min: minValue,
        max: maxValue
    })
};

function clearTranSiz() {
    let sheet = vizDisplay.workbook.activeSheet;
    sheet.clearFilterAsync('Sales');
    document.getElementById("minValFilt").value = '';
    document.getElementById("maxValFilt").value = '';
};

async function getSelectedMarks(event) {
    const marksSelected = await event.detail.getMarksAsync();
    const numMarks = marksSelected.data[0].data.length;
    //console.log(`getSelectedMarks: ${numMarks} marks selected`);
    return event.detail.getMarksAsync().then(reportSelectedMarks);
}

function reportSelectedMarks(marks) {
    let markPlur;
    const markCount = marks.data[0].data.length;
    if (Number(markCount) != 1) {
        markPlur = "s"
    } else {
        markPlur = "."
    }

    let markSum = 0;
    for (let i = 0; i <= markCount - 1; i++) {
        markSum += marks.data[0]._data[i][2].value;

    }
    let markAve = Math.round(markSum / markCount).toLocaleString(undefined);
    console.log("Input Marks: ", marks);

    var html = "You have selected " + markCount + " mark" + markPlur + ".";
    var html2 = "<br>The sum (rounded) is " + Math.round(markSum).toLocaleString(undefined) + "."
    var html3 = "<br>Of these marks (<i>not the underlying data</i>), the average (rounded) is " + markAve + "."
    if (Number(markCount) > 0) {
        htmlResult = html + html2 + html3;
    } else {
        htmlResult = "Select one or marks to summarize them here."
    }
    var infoDiv = document.getElementById("markDetails");
    infoDiv.innerHTML = htmlResult;
};

function createViz(vizPlusMinus) {
    vizCount = vizCount + vizPlusMinus;
            if (vizCount >= vizLen) {
            // Keep the vizCount in the bounds of the array index.
                vizCount = 0;
            } else if (vizCount < 0) {
                vizCount = vizLen - 1;
            }

            if (viz) { // If a viz object exists, delete it.
                viz.dispose();
            }
            console.log(vizCount);
            
            var vizURL = vizList[vizCount];
            console.log(vizURL);
            vizDiv.setAttribute('src', vizURL)
            //viz = new tableau.Viz(vizDiv, vizURL, options);
        }

document.getElementById("applyTranSiz").addEventListener('click', function() {
    tranSizeApp();
});

vizDisplay.addEventListener('markselectionchanged', getSelectedMarks);

document.addEventListener('DOMContentLoaded', initViz);
document.addEventListener('DOMContentLoaded', initVizB);
