const $tableID = $('#table');

const newTr = `
<tr class="hide">
  <td class="pt-3-half white-text" contenteditable="true">Define Function Here</td>
  <td class="pt-3-half white-text" contenteditable="true">500</td>
  <td>
    <span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0 waves-effect waves-light">Remove</button></span>
  </td>
</tr>`;

$(".add").click(function(){

    console.log("Adding new row");

    const $clone = $tableID.find('tbody tr').last().clone(false).removeClass('hide table-line');

    if ($tableID.find('tbody tr').length === 0) {

        $('tbody').append(newTr);
    }

    $tableID.find('table').append($clone);
});

$tableID.on('click', '.table-remove', function () {
    console.log("Removing row");

    $(this).parents('tr').detach();
});

// A few jQuery helpers for exporting only
jQuery.fn.pop = [].pop;
jQuery.fn.shift = [].shift;

$(".calculate").click(function(){
    console.log("Button Pressed");

    const $rows = $tableID.find('tr:not(:hidden)');
    const headers = [];
    const data = [];

    // Get the headers
    $($rows.shift()).find('th:not(:empty)').each(function () {
        let header = $(this).text().toLowerCase();

        if (header === "estimated lines of code") {
            header = "loc";
        }

        headers.push(header);
    });

    $rows.each(function () {
        const $td = $(this).find('td');
        const h = {};

        // Use the headers from earlier to name our hash keys
        headers.forEach((header, i) => {
            h[header] = $td.eq(i).text();
        });

        data.push(h);
    });

    let totalLOC = 0;

    for (let i = 0; i < data.length; i++) {
        let n = parseInt(data[i].loc);

        if (n <= 0) {
            console.log("Lines of code estimate is less than or equal to zero.");
            $('#badLOCEstimateModal').modal();
            return;
        } else if (!Number.isInteger(n)) {
            n = 0;
        }
        totalLOC += n;
    }

    let pm = document.getElementById("person-months").value;
    let salary = document.getElementById("salary").value;

    // Check if inputs are empty/improper here
    if (pm === "" || salary === "") {
        console.log("Input is Empty");
        $('#inputModal').modal();
        return;
    } else if (isNaN(pm) || isNaN(salary)) {
        console.log("Input is of improper type");
        $('#inputModal').modal();
        return;
    } else if (pm <= 0 || salary <= 0) {
        console.log("Input is less than or equal to zero");
        $('#zeroOrLessModal').modal();
        return;
    }

    let productivity = (totalLOC / pm).toFixed(2);
    let costLOC = (salary / productivity).toFixed(2);
    let totalCost = (salary * pm).toFixed(2);

    // Check if Total LOC is 0
    if (totalLOC === 0) {
        costLOC = 0.00.toFixed(2);
    }

    document.getElementById("result1").innerText = totalLOC.toString();
    document.getElementById("result2").innerText = "$" + costLOC.toString();
    document.getElementById("result3").innerText = "$" + totalCost.toString();
    document.getElementById("result4").innerText = productivity.toString() + " LOC/pm";
});

$(".export").click(function(){
    const $rows = $tableID.find('tr:not(:hidden)');
    const headers = [];
    const data = [];

    // Get the headers
    $($rows.shift()).find('th:not(:empty)').each(function () {
        headers.push($(this).text().toLowerCase());
    });

    $rows.each(function () {
        const $td = $(this).find('td');
        const h = {};

        // Use the headers from earlier to name our hash keys
        headers.forEach((header, i) => {

            h[header] = $td.eq(i).text();
        });

        data.push(h);
    });

    $('#exportModal').modal();

    // Output the result
    document.getElementById("export").textContent = JSON.stringify(data, undefined, 2);
});
